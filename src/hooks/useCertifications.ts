import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toSafeErrorMessage } from '@/lib/error';

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  image_url: string | null;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string | null;
}

export function useCertifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        setError(toSafeErrorMessage(error, 'Unable to load certifications.'));
      } else if (data) {
        setCertifications(data as Certification[]);
      }
      setLoading(false);
    })();
  }, []);

  return { certifications, loading, error };
}
