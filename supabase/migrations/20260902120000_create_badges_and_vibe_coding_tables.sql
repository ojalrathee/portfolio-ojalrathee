/*
# Create badges and vibe_coding tables

## Summary
1. New Table: `badges` — stores digital badges and micro-credentials (e.g. Credly badges).
   Fields: title, issuer, issue_date, image_url, credential_url, description, sort_order.
2. New Table: `vibe_coding` — stores vibe coding experiments and AI-assisted builds.
   Fields: title, description, image_url, demo_url, github_url, tags (text[]), sort_order.
3. Security on both: RLS enabled, public SELECT, authenticated-only INSERT/UPDATE/DELETE.

## New Columns — badges
- id, title, issuer, issue_date, image_url, credential_url, description, sort_order, created_at, updated_at

## New Columns — vibe_coding
- id, title, description, image_url, demo_url, github_url, tags (text[]), sort_order, created_at, updated_at

## Security Changes
- badges: public_read (anon+auth SELECT), auth insert/update/delete
- vibe_coding: public_read (anon+auth SELECT), auth insert/update/delete
*/

CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuer text NOT NULL,
  issue_date date NOT NULL,
  image_url text,
  credential_url text,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_badges" ON badges;
CREATE POLICY "public_read_badges" ON badges FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_badges" ON badges;
CREATE POLICY "auth_insert_badges" ON badges FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_badges" ON badges;
CREATE POLICY "auth_update_badges" ON badges FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_badges" ON badges;
CREATE POLICY "auth_delete_badges" ON badges FOR DELETE
  TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS vibe_coding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  demo_url text,
  github_url text,
  tags text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

ALTER TABLE vibe_coding ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_vibe_coding" ON vibe_coding;
CREATE POLICY "public_read_vibe_coding" ON vibe_coding FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_vibe_coding" ON vibe_coding;
CREATE POLICY "auth_insert_vibe_coding" ON vibe_coding FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_vibe_coding" ON vibe_coding;
CREATE POLICY "auth_update_vibe_coding" ON vibe_coding FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_vibe_coding" ON vibe_coding;
CREATE POLICY "auth_delete_vibe_coding" ON vibe_coding FOR DELETE
  TO authenticated USING (true);
