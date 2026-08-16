import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useActiveEvent } from '@/hooks/useEvent';
import type {
  VisitInfoSection, ProgramItem, NewsArticle,
  FaqCategory, FaqQuestion, GalleryAlbum, GalleryImage,
  HistoryItem, Aftermovie, Truck, TruckImage, VoteSettings,
  MapPoi, MapRoute, QrCode,
} from '@/types';

function useEventId() {
  const { event } = useActiveEvent();
  return event?.id ?? null;
}

export function useVisitInfo() {
  const event_id = useEventId();
  const [items, setItems] = useState<VisitInfoSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!event_id) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from('visit_info_sections')
        .select('*')
        .eq('event_id', event_id)
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      setItems((data ?? []) as VisitInfoSection[]);
      setLoading(false);
    })();
  }, [event_id]);

  return { items, loading };
}

export function useProgram() {
  const event_id = useEventId();
  const [items, setItems] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!event_id) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from('program_items')
        .select('*')
        .eq('event_id', event_id)
        .eq('is_active', true)
        .order('start_time', { ascending: true });
      setItems((data ?? []) as ProgramItem[]);
      setLoading(false);
    })();
  }, [event_id]);

  return { items, loading };
}

export function useNews() {
  const event_id = useEventId();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!event_id) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from('news_articles')
        .select('*')
        .eq('event_id', event_id)
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      setArticles((data ?? []) as NewsArticle[]);
      setLoading(false);
    })();
  }, [event_id]);

  return { articles, loading };
}

export function useNewsArticle(id: string | undefined) {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from('news_articles')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .maybeSingle();
      setArticle(data as NewsArticle | null);
      setLoading(false);
    })();
  }, [id]);

  return { article, loading };
}

export function useFaq() {
  const event_id = useEventId();
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [questions, setQuestions] = useState<FaqQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!event_id) { setLoading(false); return; }
    (async () => {
      const [catRes, qRes] = await Promise.all([
        supabase.from('faq_categories').select('*').eq('event_id', event_id).order('display_order', { ascending: true }),
        supabase.from('faq_questions').select('*, faq_categories!inner(event_id)').eq('faq_categories.event_id', event_id).eq('is_active', true).order('display_order', { ascending: true }),
      ]);
      setCategories((catRes.data ?? []) as FaqCategory[]);
      setQuestions((qRes.data ?? []) as FaqQuestion[]);
      setLoading(false);
    })();
  }, [event_id]);

  return { categories, questions, loading };
}

export function useGallery() {
  const event_id = useEventId();
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!event_id) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from('gallery_albums')
        .select('*')
        .eq('is_active', true)
        .order('year', { ascending: false });
      setAlbums((data ?? []) as GalleryAlbum[]);
      setLoading(false);
    })();
  }, [event_id]);

  return { albums, loading };
}

export function useGalleryImages(albumId: string | undefined) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!albumId) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('album_id', albumId)
        .order('display_order', { ascending: true });
      setImages((data ?? []) as GalleryImage[]);
      setLoading(false);
    })();
  }, [albumId]);

  return { images, loading };
}

export function useHistory() {
  const event_id = useEventId();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!event_id) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from('history_items')
        .select('*')
        .eq('is_active', true)
        .order('year', { ascending: true });
      setItems((data ?? []) as HistoryItem[]);
      setLoading(false);
    })();
  }, [event_id]);

  return { items, loading };
}

export function useAftermovies() {
  const event_id = useEventId();
  const [items, setItems] = useState<Aftermovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!event_id) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from('aftermovies')
        .select('*')
        .eq('is_active', true)
        .order('year', { ascending: false });
      setItems((data ?? []) as Aftermovie[]);
      setLoading(false);
    })();
  }, [event_id]);

  return { items, loading };
}

export function useTrucks() {
  const event_id = useEventId();
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!event_id) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from('trucks')
        .select('*')
        .eq('event_id', event_id)
        .eq('status', 'approved')
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      setTrucks((data ?? []) as Truck[]);
      setLoading(false);
    })();
  }, [event_id]);

  return { trucks, loading };
}

export function useTruck(id: string | undefined) {
  const [truck, setTruck] = useState<Truck | null>(null);
  const [images, setImages] = useState<TruckImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from('trucks')
        .select('*')
        .eq('id', id)
        .eq('status', 'approved')
        .eq('is_public', true)
        .maybeSingle();
      setTruck(data as Truck | null);
      if (data) {
        const { data: imgData } = await supabase
          .from('truck_images')
          .select('*')
          .eq('truck_id', id)
          .order('display_order', { ascending: true });
        setImages((imgData ?? []) as TruckImage[]);
      }
      setLoading(false);
    })();
  }, [id]);

  return { truck, images, loading };
}

export function useVoteSettings() {
  const event_id = useEventId();
  const [settings, setSettings] = useState<VoteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!event_id) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from('vote_settings')
        .select('*')
        .eq('event_id', event_id)
        .maybeSingle();
      setSettings(data as VoteSettings | null);
      setLoading(false);
    })();
  }, [event_id]);

  return { settings, loading };
}

export function useMapPois() {
  const event_id = useEventId();
  const [pois, setPois] = useState<MapPoi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!event_id) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from('map_pois')
        .select('*')
        .eq('event_id', event_id)
        .order('category', { ascending: true });
      setPois((data ?? []) as MapPoi[]);
      setLoading(false);
    })();
  }, [event_id]);

  return { pois, loading };
}

export function useMapRoutes() {
  const event_id = useEventId();
  const [routes, setRoutes] = useState<MapRoute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!event_id) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from('map_routes')
        .select('*')
        .eq('event_id', event_id);
      setRoutes((data ?? []) as MapRoute[]);
      setLoading(false);
    })();
  }, [event_id]);

  return { routes, loading };
}

export function useQrCodes() {
  const event_id = useEventId();
  const [codes, setCodes] = useState<QrCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!event_id) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('event_id', event_id)
        .order('created_at', { ascending: false });
      setCodes((data ?? []) as QrCode[]);
      setLoading(false);
    })();
  }, [event_id]);

  return { codes, loading };
}
