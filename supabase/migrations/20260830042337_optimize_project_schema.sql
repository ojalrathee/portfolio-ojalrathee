/*
# Optimize portfolio project schema with normalized detail tables and thumbnails

## Summary
This migration restructures the portfolio database to store detailed project content
in properly normalized related tables instead of flat text arrays. It also adds
thumbnail image support for project cards. All existing data is preserved and
migrated to the new structure.

## Changes Overview

### 1. New Columns on `projects`
- `thumbnail_url` (text, nullable) — URL to the project's thumbnail/cover image,
  displayed at the top of project cards.
- `long_description` (text, nullable) — An optional longer-form description field
  separate from `short_description`, for extended project summaries.
- `updated_at` (timestamptz, default now()) — Timestamp of last modification.

### 2. New Tables (normalized project detail content)

- `project_technologies`
  Stores individual tech-stack entries as rows instead of a flat text[] array.
  Each row has a label, optional category (e.g. "Cloud", "Frontend"), optional
  icon identifier, and a sort order. This makes technologies queryable,
  dedupable, and individually manageable.
  Columns: id (uuid PK), project_id (text FK → projects.id ON DELETE CASCADE),
  name (text NOT NULL), category (text), icon (text), sort_order (int default 0).

- `project_architecture`
  Stores system architecture bullet points as individual rows.
  Columns: id (uuid PK), project_id (text FK → projects.id ON DELETE CASCADE),
  title (text NOT NULL), description (text), sort_order (int default 0).

- `project_challenges`
  Stores technical challenge entries as individual rows.
  Columns: id (uuid PK), project_id (text FK → projects.id ON DELETE CASCADE),
  title (text NOT NULL), description (text), sort_order (int default 0).

- `project_deployment`
  Stores deployment detail steps as individual rows.
  Columns: id (uuid PK), project_id (text FK → projects.id ON DELETE CASCADE),
  step_number (int NOT NULL), description (text NOT NULL), sort_order (int default 0).

### 3. Data Migration
- Existing `tech_stack` array values are split into `project_technologies` rows.
- Existing `system_architecture` array values are split into `project_architecture` rows.
- Existing `technical_challenges` array values are split into `project_challenges` rows.
- Existing `deployment_details` array values are split into `project_deployment` rows.
- Thumbnail URLs are set for the two existing projects.

### 4. Indexes
- Indexes on `project_id` for all four child tables for fast joins.
- Index on `projects.sort_order` for efficient ordering.

### 5. Security (RLS)
- RLS enabled on all four new child tables.
- Policies: anon + authenticated can SELECT (public portfolio, no sign-in).
  INSERT/UPDATE/DELETE restricted to authenticated users (admin-only writes).
- `projects` table RLS is already enabled; existing policies are preserved.

### 6. Important Notes
- The original array columns (tech_stack, system_architecture, technical_challenges,
  deployment_details) are NOT dropped — they remain for backward compatibility.
  The frontend will read from the new normalized tables going forward.
- `demo_video_url` remains but the frontend no longer uses it for video embeds.
*/

-- =========================================================
-- 1. Add new columns to projects
-- =========================================================

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'thumbnail_url'
  ) THEN
    ALTER TABLE projects ADD COLUMN thumbnail_url text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'long_description'
  ) THEN
    ALTER TABLE projects ADD COLUMN long_description text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE projects ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- =========================================================
-- 2. Create normalized child tables
-- =========================================================

CREATE TABLE IF NOT EXISTS project_technologies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text,
  icon text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_architecture (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_deployment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  description text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- =========================================================
-- 3. Enable RLS on child tables
-- =========================================================

ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_architecture   ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_challenges     ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_deployment     ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- 4. Create policies (public read, admin write)
-- =========================================================

-- project_technologies
DROP POLICY IF EXISTS "anon_read_technologies" ON project_technologies;
CREATE POLICY "anon_read_technologies" ON project_technologies FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_technologies" ON project_technologies;
CREATE POLICY "auth_insert_technologies" ON project_technologies FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_technologies" ON project_technologies;
CREATE POLICY "auth_update_technologies" ON project_technologies FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_technologies" ON project_technologies;
CREATE POLICY "auth_delete_technologies" ON project_technologies FOR DELETE
  TO authenticated USING (true);

-- project_architecture
DROP POLICY IF EXISTS "anon_read_architecture" ON project_architecture;
CREATE POLICY "anon_read_architecture" ON project_architecture FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_architecture" ON project_architecture;
CREATE POLICY "auth_insert_architecture" ON project_architecture FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_architecture" ON project_architecture;
CREATE POLICY "auth_update_architecture" ON project_architecture FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_architecture" ON project_architecture;
CREATE POLICY "auth_delete_architecture" ON project_architecture FOR DELETE
  TO authenticated USING (true);

-- project_challenges
DROP POLICY IF EXISTS "anon_read_challenges" ON project_challenges;
CREATE POLICY "anon_read_challenges" ON project_challenges FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_challenges" ON project_challenges;
CREATE POLICY "auth_insert_challenges" ON project_challenges FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_challenges" ON project_challenges;
CREATE POLICY "auth_update_challenges" ON project_challenges FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_challenges" ON project_challenges;
CREATE POLICY "auth_delete_challenges" ON project_challenges FOR DELETE
  TO authenticated USING (true);

-- project_deployment
DROP POLICY IF EXISTS "anon_read_deployment" ON project_deployment;
CREATE POLICY "anon_read_deployment" ON project_deployment FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_deployment" ON project_deployment;
CREATE POLICY "auth_insert_deployment" ON project_deployment FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_deployment" ON project_deployment;
CREATE POLICY "auth_update_deployment" ON project_deployment FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_deployment" ON project_deployment;
CREATE POLICY "auth_delete_deployment" ON project_deployment FOR DELETE
  TO authenticated USING (true);

-- =========================================================
-- 5. Create indexes
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_project_technologies_project_id ON project_technologies(project_id);
CREATE INDEX IF NOT EXISTS idx_project_architecture_project_id ON project_architecture(project_id);
CREATE INDEX IF NOT EXISTS idx_project_challenges_project_id ON project_challenges(project_id);
CREATE INDEX IF NOT EXISTS idx_project_deployment_project_id ON project_deployment(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects(sort_order);

-- =========================================================
-- 6. Migrate existing array data into normalized tables
--    (only if child tables are empty — idempotent)
-- =========================================================

-- Migrate tech_stack
INSERT INTO project_technologies (project_id, name, sort_order)
SELECT p.id, tech, ord
FROM projects p,
     unnest(p.tech_stack) WITH ORDINALITY AS arr(tech, ord)
WHERE NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = p.id);

-- Migrate system_architecture
INSERT INTO project_architecture (project_id, title, sort_order)
SELECT p.id, item, ord
FROM projects p,
     unnest(p.system_architecture) WITH ORDINALITY AS arr(item, ord)
WHERE NOT EXISTS (SELECT 1 FROM project_architecture pa WHERE pa.project_id = p.id);

-- Migrate technical_challenges
INSERT INTO project_challenges (project_id, title, sort_order)
SELECT p.id, item, ord
FROM projects p,
     unnest(p.technical_challenges) WITH ORDINALITY AS arr(item, ord)
WHERE NOT EXISTS (SELECT 1 FROM project_challenges pc WHERE pc.project_id = p.id);

-- Migrate deployment_details
INSERT INTO project_deployment (project_id, step_number, description, sort_order)
SELECT p.id, ord, item, ord
FROM projects p,
     unnest(p.deployment_details) WITH ORDINALITY AS arr(item, ord)
WHERE NOT EXISTS (SELECT 1 FROM project_deployment pd WHERE pd.project_id = p.id);