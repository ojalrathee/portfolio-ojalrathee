/*
# Create certifications table

## Summary
1. New Table: `certifications`
   - Stores professional certifications, badges, and credentials.
   - Fields: title, issuer, issue/expiry dates, credential ID/URL, badge image,
     description, sort order, timestamps.
2. Security
   - RLS enabled.
   - Public SELECT (anon + authenticated) so visitors can see certifications
     on the portfolio.
   - Authenticated-only INSERT/UPDATE/DELETE so only the signed-in admin
     can manage certifications.

## New Columns
- `id` (uuid, primary key, auto-generated)
- `title` (text, not null) — e.g. "AWS Certified Solutions Architect"
- `issuer` (text, not null) — e.g. "Amazon Web Services"
- `issue_date` (date, not null) — when the certification was issued
- `expiry_date` (date, nullable) — null for non-expiring certifications
- `credential_id` (text, nullable) — the credential identifier
- `credential_url` (text, nullable) — URL to verify the credential
- `image_url` (text, nullable) — badge or logo image URL
- `description` (text, nullable) — short description
- `sort_order` (int, default 0) — display ordering
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, nullable)

## Security Changes
- Enable RLS on `certifications`.
- `public_read_certifications`: SELECT for anon + authenticated (portfolio visible to all).
- `auth_insert_certifications`: INSERT for authenticated only.
- `auth_update_certifications`: UPDATE for authenticated only.
- `auth_delete_certifications`: DELETE for authenticated only.
*/

CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuer text NOT NULL,
  issue_date date NOT NULL,
  expiry_date date,
  credential_id text,
  credential_url text,
  image_url text,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_certifications" ON certifications;
CREATE POLICY "public_read_certifications" ON certifications FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_certifications" ON certifications;
CREATE POLICY "auth_insert_certifications" ON certifications FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_certifications" ON certifications;
CREATE POLICY "auth_update_certifications" ON certifications FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_certifications" ON certifications;
CREATE POLICY "auth_delete_certifications" ON certifications FOR DELETE
  TO authenticated USING (true);
