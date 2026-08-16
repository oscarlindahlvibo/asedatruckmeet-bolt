/*
# Create CMS, program, news, FAQ, gallery, trucks, voting, map, and QR tables

## Purpose
Complete data model for Åseda Truckmeet event platform phases 2-6.

## New Tables

### visit_info_sections (Fas 2 - Besöksinfo)
- id, event_id, title, content, icon, display_order, is_active

### program_items (Fas 2 - Program)
- id, event_id, title, description, start_time, end_time, stage, artist, image_url, category, external_link, display_order, is_active

### news_articles (Fas 2 - Nyheter)
- id, event_id, title, excerpt, body, image_url, video_url, published_at, is_published, seo_title, seo_description

### faq_categories (Fas 2 - FAQ)
- id, event_id, name, display_order

### faq_questions (Fas 2 - FAQ)
- id, category_id, question, answer, display_order, is_active

### gallery_albums (Fas 2 - Galleri)
- id, event_id, title, year, photographer, cover_image_url, display_order, is_active

### gallery_images (Fas 2 - Galleri)
- id, album_id, image_url, caption, photographer, display_order

### history_items (Fas 2 - Om/Timeline)
- id, event_id, year, title, description, image_url, display_order, is_active

### aftermovies (Fas 2 - Aftermovies)
- id, event_id, title, year, video_url, thumbnail_url, is_featured, display_order, is_active

### pretix_orders (Fas 3 - Orders)
- id, event_id, pretix_order_id, email, name, total, status, payment_status, created_at_pretix, synced_at

### trucks (Fas 4 - Lastbilar)
- id, event_id, owner_id, company, driver_name, reg_number, country, city, brand, model, year_model, engine_type, engine_power, body_type, category, competition_class, description, instagram, facebook, website, photographer, main_image_url, truck_number, area, row, spot, status, is_public, created_at, updated_at

### truck_images (Fas 4 - Lastbilsgalleri)
- id, truck_id, image_url, display_order

### votes (Fas 6 - Publikens val)
- id, event_id, truck_id, voter_hash, created_at

### vote_settings (Fas 6 - Röstningsinställningar)
- id, event_id, opens_at, closes_at, max_votes, requires_ticket, requires_verified_email, results_published

### map_pois (Fas 5 - Karta)
- id, event_id, name, category, icon, description, x, y, open_hours, link_url

### map_routes (Fas 5 - Gångvägar)
- id, event_id, name, slug, description, poi_ids

### qr_codes (Fas 5 - QR-koder)
- id, event_id, name, target_type, target_url, tracking_label, scan_count

## Security
- Public read on all published content (anon + authenticated)
- Write restricted to authenticated (admin)
- Trucks: owners can CRUD their own trucks; public read only on approved+public
- Votes: insert by anon+authenticated; no read for anon (admin only)
*/

-- Helper: ensure update_updated_at function exists
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============ VISIT INFO SECTIONS ============
CREATE TABLE IF NOT EXISTS visit_info_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'info',
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE visit_info_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_visit_info" ON visit_info_sections;
CREATE POLICY "public_read_visit_info" ON visit_info_sections FOR SELECT TO anon, authenticated USING (is_active = true);
DROP POLICY IF EXISTS "admin_crud_visit_info" ON visit_info_sections;
CREATE POLICY "admin_crud_visit_info" ON visit_info_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ PROGRAM ITEMS ============
CREATE TABLE IF NOT EXISTS program_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  stage text NOT NULL DEFAULT '',
  artist text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  external_link text NOT NULL DEFAULT '',
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE program_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_program" ON program_items;
CREATE POLICY "public_read_program" ON program_items FOR SELECT TO anon, authenticated USING (is_active = true);
DROP POLICY IF EXISTS "admin_crud_program" ON program_items;
CREATE POLICY "admin_crud_program" ON program_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ NEWS ARTICLES ============
CREATE TABLE IF NOT EXISTS news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  video_url text NOT NULL DEFAULT '',
  published_at timestamptz DEFAULT now(),
  is_published boolean NOT NULL DEFAULT false,
  seo_title text NOT NULL DEFAULT '',
  seo_description text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_news" ON news_articles;
CREATE POLICY "public_read_news" ON news_articles FOR SELECT TO anon, authenticated USING (is_published = true);
DROP POLICY IF EXISTS "admin_crud_news" ON news_articles;
CREATE POLICY "admin_crud_news" ON news_articles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ FAQ CATEGORIES ============
CREATE TABLE IF NOT EXISTS faq_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE faq_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_faq_cat" ON faq_categories;
CREATE POLICY "public_read_faq_cat" ON faq_categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_crud_faq_cat" ON faq_categories;
CREATE POLICY "admin_crud_faq_cat" ON faq_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ FAQ QUESTIONS ============
CREATE TABLE IF NOT EXISTS faq_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES faq_categories(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL DEFAULT '',
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE faq_questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_faq_q" ON faq_questions;
CREATE POLICY "public_read_faq_q" ON faq_questions FOR SELECT TO anon, authenticated USING (is_active = true);
DROP POLICY IF EXISTS "admin_crud_faq_q" ON faq_questions;
CREATE POLICY "admin_crud_faq_q" ON faq_questions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ GALLERY ALBUMS ============
CREATE TABLE IF NOT EXISTS gallery_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  title text NOT NULL,
  year int NOT NULL,
  photographer text NOT NULL DEFAULT '',
  cover_image_url text NOT NULL DEFAULT '',
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_gal_album" ON gallery_albums;
CREATE POLICY "public_read_gal_album" ON gallery_albums FOR SELECT TO anon, authenticated USING (is_active = true);
DROP POLICY IF EXISTS "admin_crud_gal_album" ON gallery_albums;
CREATE POLICY "admin_crud_gal_album" ON gallery_albums FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ GALLERY IMAGES ============
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid REFERENCES gallery_albums(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text NOT NULL DEFAULT '',
  photographer text NOT NULL DEFAULT '',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_gal_img" ON gallery_images;
CREATE POLICY "public_read_gal_img" ON gallery_images FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_crud_gal_img" ON gallery_images;
CREATE POLICY "admin_crud_gal_img" ON gallery_images FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ HISTORY ITEMS ============
CREATE TABLE IF NOT EXISTS history_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  year int NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE history_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_history" ON history_items;
CREATE POLICY "public_read_history" ON history_items FOR SELECT TO anon, authenticated USING (is_active = true);
DROP POLICY IF EXISTS "admin_crud_history" ON history_items;
CREATE POLICY "admin_crud_history" ON history_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ AFTERMOVIES ============
CREATE TABLE IF NOT EXISTS aftermovies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  title text NOT NULL,
  year int NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text NOT NULL DEFAULT '',
  is_featured boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE aftermovies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_aftermovies" ON aftermovies;
CREATE POLICY "public_read_aftermovies" ON aftermovies FOR SELECT TO anon, authenticated USING (is_active = true);
DROP POLICY IF EXISTS "admin_crud_aftermovies" ON aftermovies;
CREATE POLICY "admin_crud_aftermovies" ON aftermovies FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ PRETIX ORDERS ============
CREATE TABLE IF NOT EXISTS pretix_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  pretix_order_id text NOT NULL,
  email text NOT NULL DEFAULT '',
  name text NOT NULL DEFAULT '',
  total numeric(12,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'pending',
  created_at_pretix timestamptz,
  synced_at timestamptz DEFAULT now(),
  UNIQUE(event_id, pretix_order_id)
);
ALTER TABLE pretix_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_orders" ON pretix_orders;
CREATE POLICY "public_read_orders" ON pretix_orders FOR SELECT TO anon, authenticated USING (email = current_setting('request.jwt.claims', true)::json->>'email');
DROP POLICY IF EXISTS "admin_crud_orders" ON pretix_orders;
CREATE POLICY "admin_crud_orders" ON pretix_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ TRUCKS ============
CREATE TABLE IF NOT EXISTS trucks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  owner_id uuid DEFAULT auth.uid(),
  company text NOT NULL DEFAULT '',
  driver_name text NOT NULL DEFAULT '',
  reg_number text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  brand text NOT NULL DEFAULT '',
  model text NOT NULL DEFAULT '',
  year_model int,
  engine_type text NOT NULL DEFAULT '',
  engine_power text NOT NULL DEFAULT '',
  body_type text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  competition_class text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  instagram text NOT NULL DEFAULT '',
  facebook text NOT NULL DEFAULT '',
  website text NOT NULL DEFAULT '',
  photographer text NOT NULL DEFAULT '',
  main_image_url text NOT NULL DEFAULT '',
  truck_number text NOT NULL DEFAULT '',
  area text NOT NULL DEFAULT '',
  row text NOT NULL DEFAULT '',
  spot text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'incomplete' CHECK (status IN ('incomplete', 'pending_approval', 'approved', 'rejected', 'hidden')),
  is_public boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE trucks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_trucks" ON trucks;
CREATE POLICY "public_read_trucks" ON trucks FOR SELECT TO anon, authenticated USING (status = 'approved' AND is_public = true);
DROP POLICY IF EXISTS "owner_read_trucks" ON trucks;
CREATE POLICY "owner_read_trucks" ON trucks FOR SELECT TO authenticated USING (owner_id = auth.uid());
DROP POLICY IF EXISTS "owner_insert_trucks" ON trucks;
CREATE POLICY "owner_insert_trucks" ON trucks FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
DROP POLICY IF EXISTS "owner_update_trucks" ON trucks;
CREATE POLICY "owner_update_trucks" ON trucks FOR UPDATE TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
DROP POLICY IF EXISTS "admin_update_trucks" ON trucks;
CREATE POLICY "admin_update_trucks" ON trucks FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_trucks" ON trucks;
CREATE POLICY "admin_delete_trucks" ON trucks FOR DELETE TO authenticated USING (true);

-- ============ TRUCK IMAGES ============
CREATE TABLE IF NOT EXISTS truck_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  truck_id uuid REFERENCES trucks(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE truck_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_truck_images" ON truck_images;
CREATE POLICY "public_read_truck_images" ON truck_images FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "owner_crud_truck_images" ON truck_images;
CREATE POLICY "owner_crud_truck_images" ON truck_images FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM trucks WHERE trucks.id = truck_images.truck_id AND trucks.owner_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM trucks WHERE trucks.id = truck_images.truck_id AND trucks.owner_id = auth.uid())
);
DROP POLICY IF EXISTS "admin_crud_truck_images" ON truck_images;
CREATE POLICY "admin_crud_truck_images" ON truck_images FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ VOTES ============
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  truck_id uuid REFERENCES trucks(id) ON DELETE CASCADE,
  voter_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_insert_votes" ON votes;
CREATE POLICY "anon_insert_votes" ON votes FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_read_votes" ON votes;
CREATE POLICY "admin_read_votes" ON votes FOR SELECT TO authenticated USING (true);

-- ============ VOTE SETTINGS ============
CREATE TABLE IF NOT EXISTS vote_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  opens_at timestamptz,
  closes_at timestamptz,
  max_votes int NOT NULL DEFAULT 1,
  requires_ticket boolean NOT NULL DEFAULT false,
  requires_verified_email boolean NOT NULL DEFAULT false,
  results_published boolean NOT NULL DEFAULT false,
  UNIQUE(event_id)
);
ALTER TABLE vote_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_vote_settings" ON vote_settings;
CREATE POLICY "public_read_vote_settings" ON vote_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_crud_vote_settings" ON vote_settings;
CREATE POLICY "admin_crud_vote_settings" ON vote_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ MAP POIS ============
CREATE TABLE IF NOT EXISTS map_pois (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'info',
  icon text NOT NULL DEFAULT 'map-pin',
  description text NOT NULL DEFAULT '',
  x numeric(5,2) NOT NULL DEFAULT 50,
  y numeric(5,2) NOT NULL DEFAULT 50,
  open_hours text NOT NULL DEFAULT '',
  link_url text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE map_pois ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_pois" ON map_pois;
CREATE POLICY "public_read_pois" ON map_pois FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_crud_pois" ON map_pois;
CREATE POLICY "admin_crud_pois" ON map_pois FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ MAP ROUTES ============
CREATE TABLE IF NOT EXISTS map_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  description text NOT NULL DEFAULT '',
  poi_ids text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE map_routes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_routes" ON map_routes;
CREATE POLICY "public_read_routes" ON map_routes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_crud_routes" ON map_routes;
CREATE POLICY "admin_crud_routes" ON map_routes FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ QR CODES ============
CREATE TABLE IF NOT EXISTS qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  target_type text NOT NULL DEFAULT 'url',
  target_url text NOT NULL,
  tracking_label text NOT NULL DEFAULT '',
  scan_count int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_qr" ON qr_codes;
CREATE POLICY "public_read_qr" ON qr_codes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_crud_qr" ON qr_codes;
CREATE POLICY "admin_crud_qr" ON qr_codes FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_visit_info_event ON visit_info_sections(event_id);
CREATE INDEX IF NOT EXISTS idx_program_event ON program_items(event_id);
CREATE INDEX IF NOT EXISTS idx_news_event ON news_articles(event_id);
CREATE INDEX IF NOT EXISTS idx_faq_cat_event ON faq_categories(event_id);
CREATE INDEX IF NOT EXISTS idx_faq_q_cat ON faq_questions(category_id);
CREATE INDEX IF NOT EXISTS idx_gallery_album_event ON gallery_albums(event_id);
CREATE INDEX IF NOT EXISTS idx_gallery_img_album ON gallery_images(album_id);
CREATE INDEX IF NOT EXISTS idx_history_event ON history_items(event_id);
CREATE INDEX IF NOT EXISTS idx_aftermovies_event ON aftermovies(event_id);
CREATE INDEX IF NOT EXISTS idx_pretix_orders_event ON pretix_orders(event_id);
CREATE INDEX IF NOT EXISTS idx_trucks_event ON trucks(event_id);
CREATE INDEX IF NOT EXISTS idx_trucks_owner ON trucks(owner_id);
CREATE INDEX IF NOT EXISTS idx_trucks_status ON trucks(status);
CREATE INDEX IF NOT EXISTS idx_truck_images_truck ON truck_images(truck_id);
CREATE INDEX IF NOT EXISTS idx_votes_event ON votes(event_id);
CREATE INDEX IF NOT EXISTS idx_votes_truck ON votes(truck_id);
CREATE INDEX IF NOT EXISTS idx_map_pois_event ON map_pois(event_id);
CREATE INDEX IF NOT EXISTS idx_map_routes_event ON map_routes(event_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_event ON qr_codes(event_id);

-- ============ TRIGGERS ============
DROP TRIGGER IF EXISTS trg_visit_info_updated ON visit_info_sections;
CREATE TRIGGER trg_visit_info_updated BEFORE UPDATE ON visit_info_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_program_updated ON program_items;
CREATE TRIGGER trg_program_updated BEFORE UPDATE ON program_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_news_updated ON news_articles;
CREATE TRIGGER trg_news_updated BEFORE UPDATE ON news_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_trucks_updated ON trucks;
CREATE TRIGGER trg_trucks_updated BEFORE UPDATE ON trucks FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============ SEED DATA ============
-- Visit info for event 2027
INSERT INTO visit_info_sections (event_id, title, content, icon, display_order)
SELECT e.id, 'Hitta hit', 'Åseda Folkets park ligger centralt i Åseda, Uppvidinge kommun. Följ skyltning från E22. Parkering finns i anslutning till området.', 'map-pin', 1
FROM events e WHERE e.year = 2027 AND NOT EXISTS (SELECT 1 FROM visit_info_sections WHERE event_id = e.id);

INSERT INTO visit_info_sections (event_id, title, content, icon, display_order)
SELECT e.id, 'Parkering', 'Gratis parkering finns utanför eventområdet. Följ personalens anvisningar. Personbilar och besöksfordon har separat parkering från utställningslastbilar.', 'car', 2
FROM events e WHERE e.year = 2027 AND NOT EXISTS (SELECT 1 FROM visit_info_sections WHERE event_id = e.id AND title = 'Parkering');

INSERT INTO visit_info_sections (event_id, title, content, icon, display_order)
SELECT e.id, 'Öppettider', 'Fredag: kl. 14:00–20:00 | Lördag: kl. 08:00–09:00 (inpassering) | Stängs 01:00 varje natt.', 'clock', 3
FROM events e WHERE e.year = 2027 AND NOT EXISTS (SELECT 1 FROM visit_info_sections WHERE event_id = e.id AND title = 'Öppettider');

INSERT INTO visit_info_sections (event_id, title, content, icon, display_order)
SELECT e.id, 'Camping', 'Camping finns i anslutning till området. Boka campingtillägg via biljettshoppen. Begränsat antal platser. Toaletter och dusch finns.', 'tent', 4
FROM events e WHERE e.year = 2027 AND NOT EXISTS (SELECT 1 FROM visit_info_sections WHERE event_id = e.id AND title = 'Camping');

INSERT INTO visit_info_sections (event_id, title, content, icon, display_order)
SELECT e.id, 'Mat & dryck', 'Flera matstånd och barer finns på området. Ingen medtagad alkohol tillåts. Försäljning sker i anordnarens barer. Föräldrafritt område.', 'utensils', 5
FROM events e WHERE e.year = 2027 AND NOT EXISTS (SELECT 1 FROM visit_info_sections WHERE event_id = e.id AND title = 'Mat & dryck');

INSERT INTO visit_info_sections (event_id, title, content, icon, display_order)
SELECT e.id, 'Husdjur', 'Husdjur är inte tillåtna på evenemangsområdet av säkerhetsskäl.', 'paw-print', 6
FROM events e WHERE e.year = 2027 AND NOT EXISTS (SELECT 1 FROM visit_info_sections WHERE event_id = e.id AND title = 'Husdjur');

-- FAQ categories
INSERT INTO faq_categories (event_id, name, display_order)
SELECT e.id, 'Biljetter', 1 FROM events e WHERE e.year = 2027 AND NOT EXISTS (SELECT 1 FROM faq_categories WHERE event_id = e.id);

INSERT INTO faq_categories (event_id, name, display_order)
SELECT e.id, 'Praktisk info', 2 FROM events e WHERE e.year = 2027 AND NOT EXISTS (SELECT 1 FROM faq_categories WHERE event_id = e.id AND name = 'Praktisk info');

-- FAQ questions
INSERT INTO faq_questions (category_id, question, answer, display_order)
SELECT fc.id, 'Hur köper jag biljetter?', 'Du köper biljetter direkt på vår hemsida under fliken Biljetter. Betalning sker säkert via Pretix.', 1
FROM faq_categories fc JOIN events e ON fc.event_id = e.id WHERE e.year = 2027 AND fc.name = 'Biljetter'
AND NOT EXISTS (SELECT 1 FROM faq_questions WHERE category_id = fc.id);

INSERT INTO faq_questions (category_id, question, answer, display_order)
SELECT fc.id, 'Kan jag få återbetalning?', 'Återbetalning hanteras av Pretix enligt deras villkor. Kontakta oss för hjälp med din bokning.', 2
FROM faq_categories fc JOIN events e ON fc.event_id = e.id WHERE e.year = 2027 AND fc.name = 'Biljetter'
AND NOT EXISTS (SELECT 1 FROM faq_questions WHERE category_id = fc.id AND question = 'Kan jag få återbetalning?');

INSERT INTO faq_questions (category_id, question, answer, display_order)
SELECT fc.id, 'Finns det parkering?', 'Ja, gratis parkering finns utanför eventområdet. Följ personalens anvisningar.', 1
FROM faq_categories fc JOIN events e ON fc.event_id = e.id WHERE e.year = 2027 AND fc.name = 'Praktisk info'
AND NOT EXISTS (SELECT 1 FROM faq_questions WHERE category_id = fc.id);

INSERT INTO faq_questions (category_id, question, answer, display_order)
SELECT fc.id, 'Får jag ta med husdjur?', 'Nej, husdjur är inte tillåtna på evenemangsområdet av säkerhetsskäl.', 2
FROM faq_categories fc JOIN events e ON fc.event_id = e.id WHERE e.year = 2027 AND fc.name = 'Praktisk info'
AND NOT EXISTS (SELECT 1 FROM faq_questions WHERE category_id = fc.id AND question = 'Får jag ta med husdjur?');

-- History items
INSERT INTO history_items (event_id, year, title, description, display_order)
SELECT e.id, 2016, 'Starten', 'Åseda Truckmeet arrangerades för första gången i Åseda Folkets park. En liten lastbilsträff med stort engagemang.', 1
FROM events e WHERE e.year = 2027 AND NOT EXISTS (SELECT 1 FROM history_items WHERE event_id = e.id AND year = 2016);

INSERT INTO history_items (event_id, year, title, description, display_order)
SELECT e.id, 2026, '10-årsjubileum', 'Ett decennium av lastbilsmagi. Åseda Truckmeet firade tio år med rekordmånga deltagare och besökare.', 2
FROM events e WHERE e.year = 2027 AND NOT EXISTS (SELECT 1 FROM history_items WHERE event_id = e.id AND year = 2026);

INSERT INTO history_items (event_id, year, title, description, display_order)
SELECT e.id, 2027, 'Nästa kapitel', 'Åseda Truckmeet 2027 – 2-3 juli. Vi fortsätter bygga Skandinaviens största lastbilsträff.', 3
FROM events e WHERE e.year = 2027 AND NOT EXISTS (SELECT 1 FROM history_items WHERE event_id = e.id AND year = 2027);

-- Vote settings
INSERT INTO vote_settings (event_id, opens_at, closes_at, max_votes, requires_ticket, requires_verified_email, results_published)
SELECT e.id, '2027-07-02T15:00:00+02:00', '2027-07-03T20:00:00+02:00', 1, false, true, false
FROM events e WHERE e.year = 2027 AND NOT EXISTS (SELECT 1 FROM vote_settings WHERE event_id = e.id);