import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toSafeErrorMessage } from '@/lib/error';

export interface VibeCoding {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  demo_url: string | null;
  github_url: string | null;
  tags: string[];
  sort_order: number;
  created_at: string;
  updated_at: string | null;
}

export function useVibeCoding() {
  const [items, setItems] = useState<VibeCoding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('vibe_coding')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        setError(toSafeErrorMessage(error, 'Unable to load vibe coding entries.'));
      } else if (data) {
        setItems((data as VibeCoding[]).map((v) => ({ ...v, tags: v.tags ?? [] })));
      }
      setLoading(false);
    })();
  }, []);

  return { items, loading, error };
}
