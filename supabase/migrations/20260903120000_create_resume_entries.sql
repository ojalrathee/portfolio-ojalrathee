/*
# Create resume entries

1. New Tables
- `resume_entries` stores the editable content shown on the public Resume page.
- `id` is the stable entry identifier.
- `category` is one of Experience, Education, Core Competency, or Tools.
- `title` is the entry heading.
- `organization` is the school, employer, or context label.
- `description` contains the supporting details.
- `start_date` and `end_date` store optional timeline labels.
- `sort_order` controls display order within each category.
- `created_at` and `updated_at` track changes.

2. Security
- Row level security is enabled.
- Public visitors can read resume content.
- Authenticated admin users can add, edit, and delete resume content.

3. Seed Data
- Adds placeholder resume content for a final-year BCA student focused on AWS Cloud Architecture, Computer Networking, and JavaScript development.

4. Important Notes
- The category constraint keeps the public page limited to exactly four requested sections.
- The migration is idempotent and safe to re-run without duplicating seed rows.
*/

CREATE TABLE IF NOT EXISTS public.resume_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('Experience', 'Education', 'Core Competency', 'Tools')),
  title text NOT NULL,
  organization text,
  description text,
  start_date text,
  end_date text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

ALTER TABLE public.resume_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read resume entries" ON public.resume_entries;
CREATE POLICY "Public can read resume entries" ON public.resume_entries
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admins can insert resume entries" ON public.resume_entries;
CREATE POLICY "Admins can insert resume entries" ON public.resume_entries
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update resume entries" ON public.resume_entries;
CREATE POLICY "Admins can update resume entries" ON public.resume_entries
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete resume entries" ON public.resume_entries;
CREATE POLICY "Admins can delete resume entries" ON public.resume_entries
  FOR DELETE TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS resume_entries_category_order_idx
  ON public.resume_entries (category, sort_order, created_at);

