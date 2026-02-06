import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Cache duration in hours
const CACHE_HOURS = 3;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check cache first
    const { data: cached } = await supabase
      .from('wip_video_cache')
      .select('*')
      .eq('id', 'latest')
      .maybeSingle();

    if (cached) {
      const cachedAt = new Date(cached.cached_at);
      const now = new Date();
      const hoursSinceCached = (now.getTime() - cachedAt.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceCached < CACHE_HOURS) {
        console.log(`Returning cached video (${hoursSinceCached.toFixed(1)}h old)`);
        return new Response(
          JSON.stringify({ 
            videoId: cached.video_id,
            title: cached.title,
            publishedAt: cached.published_at,
            thumbnailUrl: cached.thumbnail_url,
            videoUrl: cached.video_url
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log('Cache miss or expired, fetching fresh data...');

    // First, fetch the channel page to get the channel ID
    const channelUrl = 'https://www.youtube.com/@theWIPmeetup';
    const pageResponse = await fetch(channelUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    });
    
    if (!pageResponse.ok) {
      console.error('Failed to fetch channel page:', pageResponse.status);
      
      // Return cached data if available, otherwise fallback
      if (cached) {
        return new Response(
          JSON.stringify({ 
            videoId: cached.video_id,
            title: cached.title,
            publishedAt: cached.published_at,
            thumbnailUrl: cached.thumbnail_url,
            videoUrl: cached.video_url
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
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
      if (cached) {
        return new Response(
          JSON.stringify({ 
            videoId: cached.video_id,
            title: cached.title,
            publishedAt: cached.published_at,
            thumbnailUrl: cached.thumbnail_url,
            videoUrl: cached.video_url
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
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
      if (cached) {
        return new Response(
          JSON.stringify({ 
            videoId: cached.video_id,
            title: cached.title,
            publishedAt: cached.published_at,
            thumbnailUrl: cached.thumbnail_url,
            videoUrl: cached.video_url
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
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
    
    // Parse the XML to extract the first entry (latest video)
    // The RSS structure has <entry> elements for each video
    const entryMatch = xml.match(/<entry>([\s\S]*?)<\/entry>/);
    
    if (!entryMatch) {
      console.error('Could not find any entry in RSS feed');
      if (cached) {
        return new Response(
          JSON.stringify({ 
            videoId: cached.video_id,
            title: cached.title,
            publishedAt: cached.published_at,
            thumbnailUrl: cached.thumbnail_url,
            videoUrl: cached.video_url
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
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
    
    const entryXml = entryMatch[1];
    
    // Extract video ID from within the entry
    const videoIdMatch = entryXml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    
    if (!videoIdMatch || !videoIdMatch[1]) {
      console.error('Could not parse video ID from entry');
      if (cached) {
        return new Response(
          JSON.stringify({ 
            videoId: cached.video_id,
            title: cached.title,
            publishedAt: cached.published_at,
            thumbnailUrl: cached.thumbnail_url,
            videoUrl: cached.video_url
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
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
    
    // Extract the video title from within the entry
    const titleMatch = entryXml.match(/<media:title>([^<]+)<\/media:title>/);
    const title = titleMatch ? titleMatch[1] : 'Latest WIP Meetup';
    
    // Extract the publish date from within the entry (not the feed's published date)
    const publishedMatch = entryXml.match(/<published>([^<]+)<\/published>/);
    const publishedAt = publishedMatch ? publishedMatch[1] : null;
    
    console.log(`Parsed video: ${videoId}, title: ${title}, published: ${publishedAt}`);

    const videoData = {
      videoId, 
      title,
      publishedAt,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`
    };

    // Update the cache
    await supabase
      .from('wip_video_cache')
      .upsert({
        id: 'latest',
        video_id: videoId,
        title,
        thumbnail_url: videoData.thumbnailUrl,
        video_url: videoData.videoUrl,
        published_at: publishedAt,
        cached_at: new Date().toISOString()
      });

    console.log('Cache updated with fresh video data');

    return new Response(
      JSON.stringify(videoData),
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
