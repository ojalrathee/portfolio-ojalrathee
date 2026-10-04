/*
# Add category column to projects

## Summary
Adds a `category` text column to the `projects` table so projects can be
filtered by type (Certifications, Projects, Badges, Vibe Coding).

## Security Changes
- The new column inherits the table's existing RLS policies (no new policies needed).
- Backfill existing rows to 'Projects' as a sensible default.

## Important Notes
- Column is nullable=false with a default of 'Projects' so all future
  inserts get a category automatically.
*/

ALTER TABLE projects ADD COLUMN category text NOT NULL DEFAULT 'Projects';
