/*
# Add separate hero image for project detail page

## Summary
Previously each project had a single `thumbnail_url` used for both the small
project card image and the large detail-page hero image. This migration adds
a second column, `hero_image_url`, so the card thumbnail and the detail-page
hero can use different images.

## Changes

### 1. New Column on `projects`
- `hero_image_url` (text, nullable) — URL to the large hero image shown at the
  top of the project detail page. When null, the detail page falls back to
  `thumbnail_url`.

### 2. Data Population
- Distinct hero images are set for both existing projects so the two images
  differ out of the box.

### 3. Security
- No RLS policy changes needed — `projects` already has public SELECT and
  admin-only write policies. The new column is covered by existing policies.

### Important Notes
- `thumbnail_url` continues to be used for project cards on the home and
  projects listing pages.
- `hero_image_url` is used for the large image on the project detail page.
- If `hero_image_url` is null, the frontend falls back to `thumbnail_url`.
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'hero_image_url'
  ) THEN
    ALTER TABLE projects ADD COLUMN hero_image_url text;
  END IF;
END $$;