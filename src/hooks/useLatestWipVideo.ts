import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LatestVideo {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export const useLatestWipVideo = () => {
  const [video, setVideo] = useState<LatestVideo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestVideo = async () => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke('get-latest-wip-video');
        
        if (fnError) {
          console.error('Error fetching latest WIP video:', fnError);
          setError('Failed to load latest video');
          return;
        }

        if (data?.videoId) {
          setVideo(data);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load latest video');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestVideo();
  }, []);

  return { video, isLoading, error };
};
