import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toSafeErrorMessage } from '@/lib/error';

export type ResumeCategory = 'Experience' | 'Education' | 'Core Competency' | 'Tools';

export interface ResumeEntry {
  id: string;
  category: ResumeCategory;
  title: string;
  organization: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string | null;
}

export const RESUME_CATEGORIES: ResumeCategory[] = ['Experience', 'Education', 'Core Competency', 'Tools'];

export function useResume() {
  const [entries, setEntries] = useState<ResumeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('resume_entries')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        setError(toSafeErrorMessage(error, 'Unable to load resume data.'));
      } else if (data) {
        setEntries(data as ResumeEntry[]);
      }
      setLoading(false);
    })();
  }, []);

  return { entries, loading, error };
}
