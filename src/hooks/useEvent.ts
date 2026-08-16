import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { TruckmeetEvent, SiteSettings } from '@/types';

export function useActiveEvent() {
  const [event, setEvent] = useState<TruckmeetEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('year', { ascending: false })
        .limit(1)
        .maybeSingle();
      setEvent(data as TruckmeetEvent | null);
      setLoading(false);
    })();
  }, []);

  return { event, loading };
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();
      setSettings(data as SiteSettings | null);
      setLoading(false);
    })();
  }, []);

  return { settings, loading };
}

export function useAllEvents() {
  const [events, setEvents] = useState<TruckmeetEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('year', { ascending: false });
      setEvents((data ?? []) as TruckmeetEvent[]);
      setLoading(false);
    })();
  }, []);

  return { events, loading };
}
