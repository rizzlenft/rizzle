import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the latest video from cache
    const { data: cached } = await supabase
      .from('wip_video_cache')
      .select('*')
      .eq('id', 'latest')
      .maybeSingle();

    if (!cached) {
      return new Response(
        JSON.stringify({ success: false, error: 'No cached video found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const videoId = cached.video_id;
    const videoTitle = cached.title;

    // Check if we already extracted guests for this video
    const { data: existing } = await supabase
      .from('guest_appearances')
      .select('guest_name')
      .eq('video_id', videoId);

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Guests already extracted for this video',
          videoId,
          guests: existing.map(g => g.guest_name)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Scrape the YouTube video page to get the description
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    console.log(`Scraping YouTube video: ${youtubeUrl}`);

    const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: youtubeUrl,
        formats: ['markdown'],
        waitFor: 3000,
      }),
    });

    const scrapeData = await scrapeResponse.json();

    if (!scrapeResponse.ok) {
      console.error('Firecrawl error:', scrapeData);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to scrape video page' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const markdown = scrapeData.data?.markdown || scrapeData.markdown || '';
    console.log(`Scraped content length: ${markdown.length} chars`);

    // Use AI to extract guest names from the description
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Lovable API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiPrompt = `You are analyzing a YouTube video page for a weekly Web3/NFT meetup called "WIP Meetup". 
Your task is to extract the names of guests who appeared on this episode.

The video title is: "${videoTitle}"

Here is the scraped content from the video page:
${markdown.substring(0, 8000)}

Instructions:
1. Look for guest names in the video description, which typically lists speakers/guests
2. Guest names are often formatted as Twitter/X handles (like @username) or display names
3. Common hosts to EXCLUDE: Rizzle, Matt Kane (they are the hosts, not guests)
4. Return ONLY a JSON array of guest names as strings
5. Use the display name format (e.g., "Stina Jones" not "@stinajones")
6. If you can't find any guest names, return an empty array []

Return ONLY valid JSON, no explanation. Example: ["Guest Name 1", "Guest Name 2"]`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'user', content: aiPrompt }
        ],
        temperature: 0.1,
      }),
    });

    if (!aiResponse.ok) {
      const aiError = await aiResponse.text();
      console.error('AI API error:', aiError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to extract guests with AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || '[]';
    
    console.log('AI response:', aiContent);

    // Parse the guest names from AI response
    let guestNames: string[] = [];
    try {
      // Clean up the response - remove markdown code blocks if present
      const cleanedContent = aiContent.replace(/```json?\n?/g, '').replace(/```\n?/g, '').trim();
      guestNames = JSON.parse(cleanedContent);
      
      if (!Array.isArray(guestNames)) {
        guestNames = [];
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to parse guest names from AI response',
          rawResponse: aiContent
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (guestNames.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No guests found in video description. The description may not be updated yet.',
          videoId,
          guests: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert guest appearances into the database
    const insertData = guestNames.map(name => ({
      guest_name: name,
      video_id: videoId,
      video_title: videoTitle,
      confirmed: false,
    }));

    const { error: insertError } = await supabase
      .from('guest_appearances')
      .upsert(insertData, { onConflict: 'guest_name,video_id' });

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to save guest appearances' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Saved ${guestNames.length} guest appearances for video ${videoId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Extracted ${guestNames.length} guests`,
        videoId,
        videoTitle,
        guests: guestNames
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
