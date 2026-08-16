import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Sponsor, Artist, SponsorTier } from '@/types';

export function useSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('sponsors')
        .select('*')
        .eq('is_active', true)
        .order('tier', { ascending: true })
        .order('display_order', { ascending: true });
      setSponsors((data ?? []) as Sponsor[]);
      setLoading(false);
    })();
  }, []);

  return { sponsors, loading };
}

export function useArtists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('artists')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      setArtists((data ?? []) as Artist[]);
      setLoading(false);
    })();
  }, []);

  return { artists, loading };
}

export function groupSponsorsByTier(sponsors: Sponsor[]) {
  const groups: Record<SponsorTier, Sponsor[]> = {
    main: [],
    platinum: [],
    gold: [],
    silver: [],
    bronze: [],
  };
  for (const s of sponsors) {
    groups[s.tier].push(s);
  }
  return groups;
}
