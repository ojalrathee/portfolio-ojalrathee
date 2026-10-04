/*
  # Lock Down RBAC & Prevent IDOR / BOLA Privilege Escalation

  1. Problem:
     Previous policies used `TO authenticated USING (true)`, which granted full
     write/delete permissions on all tables and read/delete permissions on private
     contact messages to ANY authenticated user session (including arbitrary signups).

  2. Fix:
     - Define `public.is_admin()` function checking JWT admin role and verified admin identity.
     - Restrict all write, update, delete operations across all tables strictly to verified admins.
     - Restrict reading and deleting contact messages strictly to verified admins.
     - Restrict storage upload and delete operations to verified admins.
*/

-- 1. Helper function to check if the current requester is an authorized administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR (auth.jwt() ->> 'email') = 'ojalrathee@gmail.com',
    false
  );
$$;

-- 2. Projects & Related Child Tables: Restrict mutations to admin only
DROP POLICY IF EXISTS "auth_insert_projects" ON projects;
CREATE POLICY "auth_insert_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_update_projects" ON projects;
CREATE POLICY "auth_update_projects" ON projects FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
CREATE POLICY "auth_delete_projects" ON projects FOR DELETE
  TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "auth_write_project_technologies" ON project_technologies;
CREATE POLICY "auth_write_project_technologies" ON project_technologies FOR ALL
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_write_project_architecture" ON project_architecture;
CREATE POLICY "auth_write_project_architecture" ON project_architecture FOR ALL
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_write_project_challenges" ON project_challenges;
CREATE POLICY "auth_write_project_challenges" ON project_challenges FOR ALL
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_write_project_deployment" ON project_deployment;
CREATE POLICY "auth_write_project_deployment" ON project_deployment FOR ALL
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 3. Contact Messages: Only verified admin can read or delete messages (Prevent IDOR)
DROP POLICY IF EXISTS "auth_read_contact_messages" ON contact_messages;
CREATE POLICY "auth_read_contact_messages" ON contact_messages FOR SELECT
  TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "auth_delete_contact_messages" ON contact_messages;
CREATE POLICY "auth_delete_contact_messages" ON contact_messages FOR DELETE
  TO authenticated USING (public.is_admin());

-- 4. Blog Posts: Mutations restricted to admin only
DROP POLICY IF EXISTS "auth_insert_blog_posts" ON blog_posts;
CREATE POLICY "auth_insert_blog_posts" ON blog_posts FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_update_blog_posts" ON blog_posts;
CREATE POLICY "auth_update_blog_posts" ON blog_posts FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_delete_blog_posts" ON blog_posts;
CREATE POLICY "auth_delete_blog_posts" ON blog_posts FOR DELETE
  TO authenticated USING (public.is_admin());

-- 5. Certifications: Mutations restricted to admin only
DROP POLICY IF EXISTS "auth_insert_certifications" ON certifications;
CREATE POLICY "auth_insert_certifications" ON certifications FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_update_certifications" ON certifications;
CREATE POLICY "auth_update_certifications" ON certifications FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_delete_certifications" ON certifications;
CREATE POLICY "auth_delete_certifications" ON certifications FOR DELETE
  TO authenticated USING (public.is_admin());

-- 6. Badges & Vibe Coding: Mutations restricted to admin only
DROP POLICY IF EXISTS "auth_insert_badges" ON badges;
CREATE POLICY "auth_insert_badges" ON badges FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_update_badges" ON badges;
CREATE POLICY "auth_update_badges" ON badges FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_delete_badges" ON badges;
CREATE POLICY "auth_delete_badges" ON badges FOR DELETE
  TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "auth_insert_vibe_coding" ON vibe_coding;
CREATE POLICY "auth_insert_vibe_coding" ON vibe_coding FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_update_vibe_coding" ON vibe_coding;
CREATE POLICY "auth_update_vibe_coding" ON vibe_coding FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_delete_vibe_coding" ON vibe_coding;
CREATE POLICY "auth_delete_vibe_coding" ON vibe_coding FOR DELETE
  TO authenticated USING (public.is_admin());

-- 7. Resume Entries: Mutations restricted to admin only
DROP POLICY IF EXISTS "auth_insert_resume_entries" ON resume_entries;
CREATE POLICY "auth_insert_resume_entries" ON resume_entries FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_update_resume_entries" ON resume_entries;
CREATE POLICY "auth_update_resume_entries" ON resume_entries FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "auth_delete_resume_entries" ON resume_entries;
CREATE POLICY "auth_delete_resume_entries" ON resume_entries FOR DELETE
  TO authenticated USING (public.is_admin());

-- 8. Storage: Restrict object write/delete to verified admin only
DROP POLICY IF EXISTS "Admin can upload portfolio images" ON storage.objects;
CREATE POLICY "Admin can upload portfolio images" ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'portfolio-images'
    AND public.is_admin()
    AND (storage.foldername(name))[1] = 'portfolio'
  );

DROP POLICY IF EXISTS "Admin can update portfolio images" ON storage.objects;
CREATE POLICY "Admin can update portfolio images" ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'portfolio-images'
    AND public.is_admin()
    AND (storage.foldername(name))[1] = 'portfolio'
  )
  WITH CHECK (
    bucket_id = 'portfolio-images'
    AND public.is_admin()
    AND (storage.foldername(name))[1] = 'portfolio'
  );

DROP POLICY IF EXISTS "Admin can delete portfolio images" ON storage.objects;
CREATE POLICY "Admin can delete portfolio images" ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'portfolio-images'
    AND public.is_admin()
    AND (storage.foldername(name))[1] = 'portfolio'
  );
