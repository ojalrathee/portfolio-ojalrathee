import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toSafeErrorMessage } from '@/lib/error';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  tags: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string | null;
}

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false, nullsFirst: false });

      if (error) {
        setError(toSafeErrorMessage(error, 'Unable to load blog posts.'));
      } else {
        setPosts(data as BlogPost[]);
      }
      setLoading(false);
    })();
  }, []);

  return { posts, loading, error };
}

export function useBlogPost(slug: string | undefined) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        setError(toSafeErrorMessage(error, 'Unable to load blog post.'));
      } else {
        setPost(data as BlogPost | null);
      }
      setLoading(false);
    })();
  }, [slug]);

  return { post, loading, error };
}
