/*
# Create events and site_settings tables for multi-event CMS

## Purpose
Enables event-based architecture where each Åseda Truckmeet edition (2026, 2027, etc.)
is a separate event with its own dates, status, and content. Site-wide settings
(hero text, countdown target, live statistics toggles) are managed from admin.

## 1. New Tables

### events
- id (uuid, primary key)
- name (text, not null) — e.g. "Åseda Truckmeet 2027"
- year (int, not null, unique) — e.g. 2027
- start_date (timestamptz, not null) — event start
- end_date (timestamptz, not null) — event end
- location (text, default 'Åseda Folkets park')
- status (text, not null default 'draft') — one of: draft, announced, tickets_coming, tickets_on_sale, event_week, live, finished
- is_active (boolean, default false) — the active event shown on public site
- hero_title (text) — main hero heading
- hero_subtitle (text) — hero subheading
- hero_badge (text) — badge text above hero title
- hero_image_url (text) — hero background image
- hero_video_url (text) — optional hero background video
- countdown_target (timestamptz) — what the countdown counts down to
- countdown_label (text) — label under countdown
- primary_cta_text (text, default 'Köp biljett')
- primary_cta_link (text, default '/biljetter')
- secondary_cta_text (text)
- secondary_cta_link (text)
- stat_trucks_visible (boolean, default true)
- stat_tickets_visible (boolean, default true)
- stat_partners_visible (boolean, default true)
- stat_days_visible (boolean, default true)
- stat_trucks_value (int, default 0)
- stat_tickets_value (int, default 0)
- stat_partners_value (int, default 0)
- stat_days_value (int, default 0)
- created_at (timestamptz)
- updated_at (timestamptz)

### site_settings (singleton — single row)
- id (int, primary key, always 1)
- site_name (text, default 'Åseda Truckmeet')
- organization (text)
- org_address (text)
- org_zip (text)
- org_phone (text)
- contact_email (text)
- pretix_shop_url (text)
- facebook_url (text)
- instagram_url (text)
- youtube_url (text)
- updated_at (timestamptz)

## 2. Security
- Public read access to events and site_settings (anon + authenticated)
- Write access restricted to authenticated users (admin)
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  year int NOT NULL UNIQUE,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  location text NOT NULL DEFAULT 'Åseda Folkets park',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'announced', 'tickets_coming', 'tickets_on_sale', 'event_week', 'live', 'finished')),
  is_active boolean NOT NULL DEFAULT false,
  hero_title text DEFAULT '',
  hero_subtitle text DEFAULT '',
  hero_badge text DEFAULT '',
  hero_image_url text DEFAULT '',
  hero_video_url text DEFAULT '',
  countdown_target timestamptz,
  countdown_label text DEFAULT '',
  primary_cta_text text DEFAULT 'Köp biljett',
  primary_cta_link text DEFAULT '/biljetter',
  secondary_cta_text text DEFAULT '',
  secondary_cta_link text DEFAULT '',
  stat_trucks_visible boolean NOT NULL DEFAULT true,
  stat_tickets_visible boolean NOT NULL DEFAULT true,
  stat_partners_visible boolean NOT NULL DEFAULT true,
  stat_days_visible boolean NOT NULL DEFAULT true,
  stat_trucks_value int NOT NULL DEFAULT 0,
  stat_tickets_value int NOT NULL DEFAULT 0,
  stat_partners_value int NOT NULL DEFAULT 0,
  stat_days_value int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_events" ON events;
CREATE POLICY "public_read_events" ON events FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_events" ON events;
CREATE POLICY "admin_insert_events" ON events FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_events" ON events;
CREATE POLICY "admin_update_events" ON events FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_events" ON events;
CREATE POLICY "admin_delete_events" ON events FOR DELETE
  TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_name text NOT NULL DEFAULT 'Åseda Truckmeet',
  organization text NOT NULL DEFAULT 'Truckmeet i syd ideell förening',
  org_address text NOT NULL DEFAULT 'Ekängsvägen 2',
  org_zip text NOT NULL DEFAULT '577 71 Virserum',
  org_phone text NOT NULL DEFAULT '0495-76 60 60',
  contact_email text NOT NULL DEFAULT 'kontakt@asedatruckmeet.se',
  pretix_shop_url text NOT NULL DEFAULT 'https://asedatruckmeet.se/butik',
  facebook_url text NOT NULL DEFAULT 'https://www.facebook.com/Asedatruckmeet',
  instagram_url text NOT NULL DEFAULT 'https://www.instagram.com/asedatruckmeet',
  youtube_url text NOT NULL DEFAULT 'https://www.youtube.com',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_site_settings" ON site_settings;
CREATE POLICY "admin_update_site_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_insert_site_settings" ON site_settings;
CREATE POLICY "admin_insert_site_settings" ON site_settings FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_events_active ON events(is_active);
CREATE INDEX IF NOT EXISTS idx_events_year ON events(year);

DROP TRIGGER IF EXISTS trg_events_updated_at ON events;
CREATE TRIGGER trg_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_site_settings_updated_at ON site_settings;
CREATE TRIGGER trg_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed: Åseda Truckmeet 2027
INSERT INTO events (
  name, year, start_date, end_date, location, status, is_active,
  hero_title, hero_subtitle, hero_badge,
  hero_image_url,
  countdown_target, countdown_label,
  primary_cta_text, primary_cta_link,
  secondary_cta_text, secondary_cta_link,
  stat_trucks_visible, stat_tickets_visible, stat_partners_visible, stat_days_visible,
  stat_trucks_value, stat_tickets_value, stat_partners_value, stat_days_value
) VALUES (
  'Åseda Truckmeet 2027',
  2027,
  '2027-07-02T15:00:00+02:00',
  '2027-07-03T23:59:00+02:00',
  'Åseda Folkets park',
  'announced',
  true,
  'UPPLEV MAGIN MED',
  'Skandinaviens största lastbilsträff. Tre dagar fyllda med häftiga ekipage, branschutställare, underhållning och gemenskap.',
  'NÄSTA EVENT · 2027',
  'https://images.pexels.com/photos/35602229/pexels-photo-35602229.jpeg?auto=compress&cs=tinysrgb&w=1920',
  '2027-07-02T15:00:00+02:00',
  'Åseda Truckmeet 2027 börjar om',
  'Köp biljett',
  '/biljetter',
  'Anmäl lastbil',
  '/kontakt',
  true, true, true, true,
  187, 12480, 34, 2
) ON CONFLICT (year) DO NOTHING;

-- Seed: site_settings singleton
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;