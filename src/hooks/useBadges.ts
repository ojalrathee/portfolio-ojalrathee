import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toSafeErrorMessage } from '@/lib/error';

export interface Badge {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  image_url: string | null;
  credential_url: string | null;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string | null;
}

export function useBadges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        setError(toSafeErrorMessage(error, 'Unable to load badges.'));
      } else if (data) {
        setBadges(data as Badge[]);
      }
      setLoading(false);
    })();
  }, []);

  return { badges, loading, error };
}
