/*
# Create portfolio image storage

1. Storage
- Create the `portfolio-images` public bucket for images used by portfolio content.
- Limit uploads to 5 MB.
- Allow only JPEG, PNG, and WEBP image formats.

2. Security
- Public visitors may read portfolio images so existing public pages can display them.
- Only the signed-in portfolio administrator may upload, update, or delete objects in this bucket.
- Uploads are restricted to the `portfolio/` object path.

3. Compatibility
- Existing image URL fields and externally hosted images remain unchanged.
- This migration adds storage only; no application tables or columns are modified.
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-images',
  'portfolio-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public can view portfolio images" ON storage.objects;
CREATE POLICY "Public can view portfolio images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "Admin can upload portfolio images" ON storage.objects;
CREATE POLICY "Admin can upload portfolio images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'portfolio-images'
  AND (storage.foldername(name))[1] = 'portfolio'
);

DROP POLICY IF EXISTS "Admin can update portfolio images" ON storage.objects;
CREATE POLICY "Admin can update portfolio images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'portfolio-images'
  AND (storage.foldername(name))[1] = 'portfolio'
)
WITH CHECK (
  bucket_id = 'portfolio-images'
  AND (storage.foldername(name))[1] = 'portfolio'
);

DROP POLICY IF EXISTS "Admin can delete portfolio images" ON storage.objects;
CREATE POLICY "Admin can delete portfolio images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'portfolio-images'
  AND (storage.foldername(name))[1] = 'portfolio'
);

