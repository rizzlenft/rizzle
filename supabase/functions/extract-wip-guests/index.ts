import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const WIP_CHANNEL_URL = 'https://www.youtube.com/@theWIPmeetup';
// How many recent episodes to scan each run. Cron runs weekly so 5 gives a healthy buffer.
const MAX_EPISODES_TO_PROCESS = 5;

interface RssVideo {
  videoId: string;
  title: string;
  publishedAt: string | null;
}

async function fetchRecentWipVideos(limit: number): Promise<RssVideo[]> {
  // Resolve channel ID from the channel page
  const pageResponse = await fetch(WIP_CHANNEL_URL, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    },
  });

  if (!pageResponse.ok) {
    throw new Error(`Failed to fetch channel page: ${pageResponse.status}`);
  }

  const pageHtml = await pageResponse.text();
  let channelId =
    pageHtml.match(/channel_id=([^"&]+)/)?.[1] ??
    pageHtml.match(/"externalId":"([^"]+)"/)?.[1] ??
    null;

  if (!channelId) {
    throw new Error('Could not extract channel ID from WIP channel page');
  }

  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const rssResponse = await fetch(rssUrl);
  if (!rssResponse.ok) {
    throw new Error(`Failed to fetch RSS feed: ${rssResponse.status}`);
  }

  const xml = await rssResponse.text();
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];

  const videos: RssVideo[] = [];
  for (const entry of entries.slice(0, limit)) {
    const entryXml = entry[1];
    const videoId = entryXml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const title =
      entryXml.match(/<media:title>([^<]+)<\/media:title>/)?.[1] ?? 'WIP Meetup';
    const published =
      entryXml.match(/<published>([^<]+)<\/published>/)?.[1] ?? null;
    if (videoId) {
      videos.push({ videoId, title, publishedAt: published });
    }
  }

  return videos;
}

async function extractGuestsForVideo(
  video: RssVideo,
  firecrawlApiKey: string,
  lovableApiKey: string,
): Promise<{ guests: string[]; markdownLength: number }> {
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
  console.log(`Scraping ${youtubeUrl}`);

  const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${firecrawlApiKey}`,
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
    console.error(`Firecrawl error for ${video.videoId}:`, scrapeData);
    return { guests: [], markdownLength: 0 };
  }

  const markdown: string = scrapeData.data?.markdown || scrapeData.markdown || '';

  const aiPrompt = `You are analyzing a YouTube video page for a weekly Web3/NFT meetup called "WIP Meetup".
Your task is to extract the names of guests who appeared on this episode.

The video title is: "${video.title}"

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

  const aiResponse = await fetch(
    'https://ai.gateway.lovable.dev/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: aiPrompt }],
        temperature: 0.1,
      }),
    },
  );

  if (!aiResponse.ok) {
    console.error(
      `AI API error for ${video.videoId}:`,
      await aiResponse.text(),
    );
    return { guests: [], markdownLength: markdown.length };
  }

  const aiData = await aiResponse.json();
  const aiContent: string = aiData.choices?.[0]?.message?.content || '[]';

  let guestNames: string[] = [];
  try {
    const cleaned = aiContent
      .replace(/```json?\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) {
      guestNames = parsed.filter(
        (n): n is string => typeof n === 'string' && n.trim().length > 0,
      );
    }
  } catch (err) {
    console.error(`Failed to parse AI response for ${video.videoId}:`, err);
  }

  return { guests: guestNames, markdownLength: markdown.length };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!firecrawlApiKey || !lovableApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'API keys not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // Optional override: ?limit=N (1..10) for manual backfills
    let limit = MAX_EPISODES_TO_PROCESS;
    try {
      const url = new URL(req.url);
      const param = url.searchParams.get('limit');
      if (param) {
        const n = parseInt(param, 10);
        if (!Number.isNaN(n)) limit = Math.min(Math.max(n, 1), 10);
      }
    } catch {
      // ignore
    }

    const recentVideos = await fetchRecentWipVideos(limit);
    console.log(`Found ${recentVideos.length} recent WIP videos`);

    // Find which already have extracted guests
    const videoIds = recentVideos.map((v) => v.videoId);
    const { data: existingRows } = await supabase
      .from('guest_appearances')
      .select('video_id')
      .in('video_id', videoIds);

    const alreadyExtracted = new Set(
      (existingRows ?? []).map((r: { video_id: string }) => r.video_id),
    );

    const results: Array<{
      videoId: string;
      title: string;
      status: 'skipped' | 'extracted' | 'no-guests' | 'error';
      guests?: string[];
      error?: string;
    }> = [];

    for (const video of recentVideos) {
      if (alreadyExtracted.has(video.videoId)) {
        results.push({
          videoId: video.videoId,
          title: video.title,
          status: 'skipped',
        });
        continue;
      }

      try {
        const { guests } = await extractGuestsForVideo(
          video,
          firecrawlApiKey,
          lovableApiKey,
        );

        if (guests.length === 0) {
          results.push({
            videoId: video.videoId,
            title: video.title,
            status: 'no-guests',
          });
          continue;
        }

        const insertData = guests.map((name) => ({
          guest_name: name,
          video_id: video.videoId,
          video_title: video.title,
          confirmed: false,
        }));

        const { error: insertError } = await supabase
          .from('guest_appearances')
          .upsert(insertData, { onConflict: 'guest_name,video_id' });

        if (insertError) {
          console.error(`Insert error for ${video.videoId}:`, insertError);
          results.push({
            videoId: video.videoId,
            title: video.title,
            status: 'error',
            error: 'insert failed',
          });
          continue;
        }

        console.log(
          `Saved ${guests.length} guests for ${video.videoId} (${video.title})`,
        );
        results.push({
          videoId: video.videoId,
          title: video.title,
          status: 'extracted',
          guests,
        });
      } catch (err) {
        console.error(`Error processing ${video.videoId}:`, err);
        results.push({
          videoId: video.videoId,
          title: video.title,
          status: 'error',
          error: 'processing failed',
        });
      }
    }

    const summary = {
      total: results.length,
      extracted: results.filter((r) => r.status === 'extracted').length,
      skipped: results.filter((r) => r.status === 'skipped').length,
      noGuests: results.filter((r) => r.status === 'no-guests').length,
      errors: results.filter((r) => r.status === 'error').length,
    };

    return new Response(
      JSON.stringify({ success: true, summary, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'An unexpected error occurred' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
