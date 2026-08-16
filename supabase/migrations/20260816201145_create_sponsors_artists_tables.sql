/*
# Create sponsors and artists tables with admin auth

## Purpose
Enables an admin interface where organizers can add, edit, and delete sponsors and artists
that appear on the public-facing Åseda Truckmeet website. Sponsors have a tier system
(main, platinum, gold, silver, bronze) and artists have genre/image metadata.

## 1. New Tables

### sponsors
- id (uuid, primary key)
- name (text, not null) — company/organization name
- description (text) — short description shown on partner cards
- logo_url (text) — URL to the company logo image
- website_url (text) — link to the company website
- tier (text, not null) — one of: 'main', 'platinum', 'gold', 'silver', 'bronze'
- display_order (int, default 0) — sort order within tier
- is_active (boolean, default true) — toggle visibility
- created_at (timestamptz)
- updated_at (timestamptz)

### artists
- id (uuid, primary key)
- name (text, not null) — artist/band name
- genre (text) — music genre label
- description (text) — short description shown on artist cards
- image_url (text) — URL to artist photo
- display_order (int, default 0) — sort order
- is_active (boolean, default true) — toggle visibility
- created_at (timestamptz)
- updated_at (timestamptz)

## 2. Security

### RLS on both tables
- Public read access (anon + authenticated) so the website can display sponsors and artists.
- Write access (insert/update/delete) restricted to authenticated users only (admin).
- This is a single-organization app where any signed-in user is an admin.

## 3. Important Notes
1. The app has a sign-in screen — authenticated users are trusted admins.
2. SELECT policies use `TO anon, authenticated` so the public site can read data.
3. Write policies use `TO authenticated` so only logged-in admins can modify.
4. No user_id column needed — any authenticated user is an admin.
*/

CREATE TABLE IF NOT EXISTS sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  logo_url text DEFAULT '',
  website_url text DEFAULT '',
  tier text NOT NULL DEFAULT 'bronze' CHECK (tier IN ('main', 'platinum', 'gold', 'silver', 'bronze')),
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_sponsors" ON sponsors;
CREATE POLICY "public_read_sponsors"
ON sponsors FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_sponsors" ON sponsors;
CREATE POLICY "admin_insert_sponsors"
ON sponsors FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_sponsors" ON sponsors;
CREATE POLICY "admin_update_sponsors"
ON sponsors FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_sponsors" ON sponsors;
CREATE POLICY "admin_delete_sponsors"
ON sponsors FOR DELETE
TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  genre text DEFAULT '',
  description text DEFAULT '',
  image_url text DEFAULT '',
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE artists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_artists" ON artists;
CREATE POLICY "public_read_artists"
ON artists FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_artists" ON artists;
CREATE POLICY "admin_insert_artists"
ON artists FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_artists" ON artists;
CREATE POLICY "admin_update_artists"
ON artists FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_artists" ON artists;
CREATE POLICY "admin_delete_artists"
ON artists FOR DELETE
TO authenticated USING (true);

-- Index for efficient tier-based queries
CREATE INDEX IF NOT EXISTS idx_sponsors_tier ON sponsors(tier);
CREATE INDEX IF NOT EXISTS idx_sponsors_active ON sponsors(is_active);
CREATE INDEX IF NOT EXISTS idx_artists_active ON artists(is_active);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sponsors_updated_at ON sponsors;
CREATE TRIGGER trg_sponsors_updated_at
BEFORE UPDATE ON sponsors
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_artists_updated_at ON artists;
CREATE TRIGGER trg_artists_updated_at
BEFORE UPDATE ON artists
FOR EACH ROW EXECUTE FUNCTION update_updated_at();