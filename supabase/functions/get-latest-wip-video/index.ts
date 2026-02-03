import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // First, fetch the channel page to get the channel ID
    const channelUrl = 'https://www.youtube.com/@theWIPmeetup';
    const pageResponse = await fetch(channelUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    });
    
    if (!pageResponse.ok) {
      console.error('Failed to fetch channel page:', pageResponse.status);
      
      // Fallback: use a known recent video ID
      return new Response(
        JSON.stringify({ 
          videoId: 'lyeA_lJdQns',
          title: 'Latest WIP Meetup',
          thumbnailUrl: 'https://img.youtube.com/vi/lyeA_lJdQns/mqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=lyeA_lJdQns'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const pageHtml = await pageResponse.text();
    
    // Extract channel ID from the page
    const channelIdMatch = pageHtml.match(/channel_id=([^"&]+)/);
    let channelId = channelIdMatch ? channelIdMatch[1] : null;
    
    // Also try to find it in the canonical URL or externalId
    if (!channelId) {
      const externalIdMatch = pageHtml.match(/"externalId":"([^"]+)"/);
      channelId = externalIdMatch ? externalIdMatch[1] : null;
    }

    if (!channelId) {
      console.log('Could not extract channel ID, using fallback');
      // Fallback to a known recent video
      return new Response(
        JSON.stringify({ 
          videoId: 'lyeA_lJdQns',
          title: 'Latest WIP Meetup',
          thumbnailUrl: 'https://img.youtube.com/vi/lyeA_lJdQns/mqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=lyeA_lJdQns'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Found channel ID:', channelId);

    // Now fetch the RSS feed with the channel ID
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const rssResponse = await fetch(rssUrl);
    
    if (!rssResponse.ok) {
      console.error('Failed to fetch RSS feed:', rssResponse.status);
      return new Response(
        JSON.stringify({ 
          videoId: 'lyeA_lJdQns',
          title: 'Latest WIP Meetup',
          thumbnailUrl: 'https://img.youtube.com/vi/lyeA_lJdQns/mqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=lyeA_lJdQns'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const xml = await rssResponse.text();
    
    // Parse the XML to extract the latest video ID
    const videoIdMatch = xml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    
    if (!videoIdMatch || !videoIdMatch[1]) {
      console.error('Could not parse video ID from RSS feed');
      return new Response(
        JSON.stringify({ 
          videoId: 'lyeA_lJdQns',
          title: 'Latest WIP Meetup',
          thumbnailUrl: 'https://img.youtube.com/vi/lyeA_lJdQns/mqdefault.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=lyeA_lJdQns'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const videoId = videoIdMatch[1];
    
    // Extract the video title
    const titleMatch = xml.match(/<media:title>([^<]+)<\/media:title>/);
    const title = titleMatch ? titleMatch[1] : 'Latest WIP Meetup';
    
    // Extract the publish date
    const publishedMatch = xml.match(/<published>([^<]+)<\/published>/);
    const publishedAt = publishedMatch ? publishedMatch[1] : null;

    return new Response(
      JSON.stringify({ 
        videoId, 
        title,
        publishedAt,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching latest video:', error);
    // Return fallback video on error
    return new Response(
      JSON.stringify({ 
        videoId: 'lyeA_lJdQns',
        title: 'Latest WIP Meetup',
        thumbnailUrl: 'https://img.youtube.com/vi/lyeA_lJdQns/mqdefault.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=lyeA_lJdQns'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});