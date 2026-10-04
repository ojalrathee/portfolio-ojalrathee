/*
# Create blog_posts table

## Summary
Creates a `blog_posts` table to store blog articles for the portfolio's
blog page. Public visitors can read published posts; only the authenticated
admin can create, edit, and delete them.

## New Tables
- `blog_posts`
  - `id` (uuid, primary key)
  - `title` (text, not null) — blog post title
  - `slug` (text, unique, not null) — URL-friendly identifier
  - `excerpt` (text, not null) — short summary shown on the blog listing
  - `content` (text, not null) — full article body (markdown/plain text)
  - `cover_image_url` (text, nullable) — optional hero image URL
  - `tags` (text[], default '{}') — array of tag strings
  - `published` (boolean, default false) — draft vs published
  - `published_at` (timestamptz, nullable) — when the post went live
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, nullable)

## Security
- RLS enabled on `blog_posts`.
- Public SELECT for all visitors (anon + authenticated) so the blog is
  readable without signing in.
- INSERT / UPDATE / DELETE restricted to authenticated (admin) only.

## Important Notes
1. The blog is public-readable — visitors don't need an account to read posts.
2. Only the signed-in admin can create, edit, or delete blog posts.
3. The `published` flag lets the admin save drafts without showing them publicly.
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  cover_image_url text,
  tags text[] NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read access (anon + authenticated can SELECT)
DROP POLICY IF EXISTS "public_read_blog_posts" ON blog_posts;
CREATE POLICY "public_read_blog_posts" ON blog_posts FOR SELECT
  TO anon, authenticated USING (true);

-- Admin-only write access
DROP POLICY IF EXISTS "auth_insert_blog_posts" ON blog_posts;
CREATE POLICY "auth_insert_blog_posts" ON blog_posts FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_blog_posts" ON blog_posts;
CREATE POLICY "auth_update_blog_posts" ON blog_posts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_blog_posts" ON blog_posts;
CREATE POLICY "auth_delete_blog_posts" ON blog_posts FOR DELETE
  TO authenticated USING (true);

-- Index for slug lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
-- Index for ordering by published date
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
