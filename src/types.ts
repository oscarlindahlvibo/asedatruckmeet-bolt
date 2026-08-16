export interface TicketItem {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  available: boolean;
  badge: string | null;
}

export interface CartRequest {
  items: CartLine[];
}

export interface CartLine {
  item: number;
  variation: number | null;
  count: number;
}

export interface CartResponse {
  checkoutUrl: string;
  cartId: string;
}

export interface ItemsResponse {
  tickets: TicketItem[];
  source: 'pretix' | 'mock';
  configured: boolean;
}

export type SponsorTier = 'main' | 'platinum' | 'gold' | 'silver' | 'bronze';

export interface Sponsor {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
  tier: SponsorTier;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  description: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type EventStatus = 'draft' | 'announced' | 'tickets_coming' | 'tickets_on_sale' | 'event_week' | 'live' | 'finished';

export interface TruckmeetEvent {
  id: string;
  name: string;
  year: number;
  start_date: string;
  end_date: string;
  location: string;
  status: EventStatus;
  is_active: boolean;
  hero_title: string;
  hero_subtitle: string;
  hero_badge: string;
  hero_image_url: string;
  hero_video_url: string;
  countdown_target: string | null;
  countdown_label: string;
  primary_cta_text: string;
  primary_cta_link: string;
  secondary_cta_text: string;
  secondary_cta_link: string;
  stat_trucks_visible: boolean;
  stat_tickets_visible: boolean;
  stat_partners_visible: boolean;
  stat_days_visible: boolean;
  stat_trucks_value: number;
  stat_tickets_value: number;
  stat_partners_value: number;
  stat_days_value: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: number;
  site_name: string;
  organization: string;
  org_address: string;
  org_zip: string;
  org_phone: string;
  contact_email: string;
  pretix_shop_url: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  updated_at: string;
}

export interface VisitInfoSection {
  id: string;
  event_id: string;
  title: string;
  content: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProgramItem {
  id: string;
  event_id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string | null;
  stage: string;
  artist: string;
  image_url: string;
  category: string;
  external_link: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewsArticle {
  id: string;
  event_id: string;
  title: string;
  excerpt: string;
  body: string;
  image_url: string;
  video_url: string;
  published_at: string;
  is_published: boolean;
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
}

export interface FaqCategory {
  id: string;
  event_id: string;
  name: string;
  display_order: number;
  created_at: string;
}

export interface FaqQuestion {
  id: string;
  category_id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface GalleryAlbum {
  id: string;
  event_id: string;
  title: string;
  year: number;
  photographer: string;
  cover_image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  album_id: string;
  image_url: string;
  caption: string;
  photographer: string;
  display_order: number;
  created_at: string;
}

export interface HistoryItem {
  id: string;
  event_id: string;
  year: number;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Aftermovie {
  id: string;
  event_id: string;
  title: string;
  year: number;
  video_url: string;
  thumbnail_url: string;
  is_featured: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface PretixOrder {
  id: string;
  event_id: string;
  pretix_order_id: string;
  email: string;
  name: string;
  total: number;
  status: string;
  payment_status: string;
  created_at_pretix: string | null;
  synced_at: string;
}

export type TruckStatus = 'incomplete' | 'pending_approval' | 'approved' | 'rejected' | 'hidden';

export interface Truck {
  id: string;
  event_id: string;
  owner_id: string;
  company: string;
  driver_name: string;
  reg_number: string;
  country: string;
  city: string;
  brand: string;
  model: string;
  year_model: number | null;
  engine_type: string;
  engine_power: string;
  body_type: string;
  category: string;
  competition_class: string;
  description: string;
  instagram: string;
  facebook: string;
  website: string;
  photographer: string;
  main_image_url: string;
  truck_number: string;
  area: string;
  row: string;
  spot: string;
  status: TruckStatus;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface TruckImage {
  id: string;
  truck_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface VoteSettings {
  id: string;
  event_id: string;
  opens_at: string | null;
  closes_at: string | null;
  max_votes: number;
  requires_ticket: boolean;
  requires_verified_email: boolean;
  results_published: boolean;
}

export interface MapPoi {
  id: string;
  event_id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  x: number;
  y: number;
  open_hours: string;
  link_url: string;
  created_at: string;
}

export interface MapRoute {
  id: string;
  event_id: string;
  name: string;
  slug: string;
  description: string;
  poi_ids: string[];
  created_at: string;
}

export interface QrCode {
  id: string;
  event_id: string;
  name: string;
  target_type: string;
  target_url: string;
  tracking_label: string;
  scan_count: number;
  created_at: string;
}
