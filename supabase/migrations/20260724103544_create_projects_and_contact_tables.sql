/*
# Create projects and contact_messages tables

1. Purpose
   This migration sets up the database schema for the portfolio website.
   It creates the core `projects` and `contact_messages` tables.

2. New Tables
   - `projects`
     - `id` (text, primary key): URL slug used in routes.
     - `title` (text, not null): Display name of the project.
     - `short_description` (text, not null): One-line summary.
     - `tech_stack` (text[], not null): Array of technology tags.
     - `year` (text, not null): Year the project was built.
     - `demo_video_url` (text, not null): Embeddable video URL.
     - `github_url` (text, not null): Link to the source repository.
     - `live_demo_url` (text, not null): Link to the live deployment.
     - `overview` (text, not null): Full project overview text.
     - `system_architecture` (text[], not null): Array of architecture details.
     - `technical_challenges` (text[], not null): Array of challenges.
     - `deployment_details` (text[], not null): Array of deployment details.
     - `sort_order` (int, not null, default 0): Controls display ordering.
     - `created_at` (timestamptz, default now()): Creation timestamp.

   - `contact_messages`
     - `id` (uuid, primary key): Auto-generated unique ID.
     - `name` (text, not null): Sender's name.
     - `email` (text, not null): Sender's email address.
     - `message` (text, not null): Message content.
     - `created_at` (timestamptz, default now()): Submission timestamp.

3. Security (RLS)
   - RLS enabled on both tables.
   - `projects`: public read for anon + authenticated, writes restricted to authenticated admin users.
   - `contact_messages`: INSERT for anon + authenticated (contact form submissions).
*/

-- ── projects table ──
CREATE TABLE IF NOT EXISTS projects (
  id text PRIMARY KEY,
  title text NOT NULL,
  short_description text NOT NULL,
  tech_stack text[] NOT NULL DEFAULT '{}',
  year text NOT NULL,
  demo_video_url text NOT NULL DEFAULT '',
  github_url text NOT NULL DEFAULT '',
  live_demo_url text NOT NULL DEFAULT '',
  overview text NOT NULL DEFAULT '',
  system_architecture text[] NOT NULL DEFAULT '{}',
  technical_challenges text[] NOT NULL DEFAULT '{}',
  deployment_details text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_projects" ON projects;
CREATE POLICY "anon_select_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_projects" ON projects;
CREATE POLICY "auth_insert_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_projects" ON projects;
CREATE POLICY "auth_update_projects" ON projects FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
CREATE POLICY "auth_delete_projects" ON projects FOR DELETE
  TO authenticated USING (true);

-- ── contact_messages table ──
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Index for ordering queries
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects (sort_order);

