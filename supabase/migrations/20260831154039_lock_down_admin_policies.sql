/*
# Lock down admin write policies & enable message reading

## Summary
1. Remove anon write access on `projects` — only authenticated users can
   INSERT, UPDATE, and DELETE. Public SELECT stays open (portfolio must be
   readable by visitors).
2. Add an authenticated-only SELECT policy on `contact_messages` so the
   admin dashboard can read contact submissions. Anon INSERT stays open
   (visitors submit the contact form). Anon SELECT is explicitly denied —
   only the signed-in admin can read messages.

## Security Changes
- `projects`: DROP anon INSERT/UPDATE/DELETE policies, replace with
  authenticated-only equivalents.
- `contact_messages`: add `auth_read_contact_messages` for authenticated
  SELECT.

## Important Notes
- Public visitors can still READ projects and SUBMIT contact messages.
- Only the signed-in admin can CREATE/EDIT/DELETE projects and READ messages.
*/

-- === projects: lock writes to authenticated only ===
DROP POLICY IF EXISTS "anon_delete_projects" ON projects;
DROP POLICY IF EXISTS "anon_insert_projects" ON projects;
DROP POLICY IF EXISTS "anon_update_projects" ON projects;

DROP POLICY IF EXISTS "auth_insert_projects" ON projects;
CREATE POLICY "auth_insert_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_projects" ON projects;
CREATE POLICY "auth_update_projects" ON projects FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
CREATE POLICY "auth_delete_projects" ON projects FOR DELETE
  TO authenticated USING (true);

-- === contact_messages: admin can read, anon can insert ===
DROP POLICY IF EXISTS "auth_read_contact_messages" ON contact_messages;
CREATE POLICY "auth_read_contact_messages" ON contact_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_delete_contact_messages" ON contact_messages;
CREATE POLICY "auth_delete_contact_messages" ON contact_messages FOR DELETE
  TO authenticated USING (true);