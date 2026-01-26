const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    // Validate URL parameter exists and is a string
    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid URL parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate it's a YouTube URL only
    const youtubePattern = /^https:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubePattern.test(url)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Only YouTube URLs are allowed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate URL structure
    try {
      const urlObj = new URL(url);
      if (urlObj.protocol !== 'https:') {
        return new Response(
          JSON.stringify({ success: false, error: 'Only HTTPS URLs allowed' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Malformed URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Scraping: ${url}`);
    
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: ['markdown'],
        waitFor: 2000,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error(`Firecrawl error:`, data);
      return new Response(
        JSON.stringify({ success: false, error: data.error || 'Failed to scrape' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const markdown = data.data?.markdown || data.markdown || '';
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        markdown,
        url
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
