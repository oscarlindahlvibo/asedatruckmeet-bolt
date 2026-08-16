import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { supabase } from '@/lib/supabase';
import { useAllEvents } from '@/hooks/useEvent';
import type { VoteSettings, Truck } from '@/types';
import { Loader2, Save, Check, BarChart3, Trophy } from 'lucide-react';

export default function AdminVotePage() {
  const { events } = useAllEvents();
  const event_id = events.find(e => e.is_active)?.id ?? null;
  const [settings, setSettings] = useState<VoteSettings | null>(null);
  const [results, setResults] = useState<{ truck: Truck; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    opens_at: '',
    closes_at: '',
    max_votes: 1,
    requires_ticket: false,
    requires_verified_email: true,
    results_published: false,
  });

  const fetch = useCallback(async () => {
    if (!event_id) return;
    const { data: settingsData } = await supabase.from('vote_settings').select('*').eq('event_id', event_id).maybeSingle();
    const s = settingsData as VoteSettings | null;
    setSettings(s);
    if (s) {
      setForm({
        opens_at: s.opens_at ? new Date(s.opens_at).toISOString().slice(0, 16) : '',
        closes_at: s.closes_at ? new Date(s.closes_at).toISOString().slice(0, 16) : '',
        max_votes: s.max_votes,
        requires_ticket: s.requires_ticket,
        requires_verified_email: s.requires_verified_email,
        results_published: s.results_published,
      });
    }

    // Get vote counts
    const { data: voteData } = await supabase.from('votes').select('truck_id').eq('event_id', event_id);
    const { data: truckData } = await supabase.from('trucks').select('*').eq('event_id', event_id).eq('status', 'approved');
    const counts: Record<string, number> = {};
    (voteData ?? []).forEach((v: { truck_id: string }) => {
      counts[v.truck_id] = (counts[v.truck_id] ?? 0) + 1;
    });
    const truckList = (truckData ?? []) as Truck[];
    const resultArray = truckList
      .map((truck) => ({ truck, count: counts[truck.id] ?? 0 }))
      .sort((a, b) => b.count - a.count);
    setResults(resultArray);
    setLoading(false);
  }, [event_id]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      event_id,
      opens_at: form.opens_at ? new Date(form.opens_at).toISOString() : null,
      closes_at: form.closes_at ? new Date(form.closes_at).toISOString() : null,
      max_votes: form.max_votes,
      requires_ticket: form.requires_ticket,
      requires_verified_email: form.requires_verified_email,
      results_published: form.results_published,
    };
    if (settings) {
      await supabase.from('vote_settings').update(payload).eq('id', settings.id);
    } else {
      await supabase.from('vote_settings').insert(payload);
    }
    setSaving(false);
    setSaved(true);
    fetch();
    setTimeout(() => setSaved(false), 3000);
  };

  const totalVotes = results.reduce((sum, r) => sum + r.count, 0);

  return (
    <AdminLayout activeTab="settings">
      <h2 className="font-heading font-bold text-2xl text-white mb-6">Publikens val</h2>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Settings */}
          <div className="glass-card p-6">
            <h3 className="font-heading font-bold text-lg text-white mb-4">Inställningar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white/70 mb-1.5 block">Öppnar</label>
                <input type="datetime-local" value={form.opens_at} onChange={(e) => setForm({ ...form, opens_at: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none transition-all" />
              </div>
              <div>
                <label className="text-sm font-medium text-white/70 mb-1.5 block">Stänger</label>
                <input type="datetime-local" value={form.closes_at} onChange={(e) => setForm({ ...form, closes_at: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none transition-all" />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium text-white/70 mb-1.5 block">Max röster per person</label>
              <input type="number" min={1} value={form.max_votes} onChange={(e) => setForm({ ...form, max_votes: parseInt(e.target.value) || 1 })}
                className="w-32 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none transition-all" />
            </div>
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.requires_ticket} onChange={(e) => setForm({ ...form, requires_ticket: e.target.checked })} className="w-5 h-5 rounded accent-amber-500" />
                <span className="text-sm text-white/70">Kräver biljett för röstning</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.requires_verified_email} onChange={(e) => setForm({ ...form, requires_verified_email: e.target.checked })} className="w-5 h-5 rounded accent-amber-500" />
                <span className="text-sm text-white/70">Kräver verifierad e-post</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.results_published} onChange={(e) => setForm({ ...form, results_published: e.target.checked })} className="w-5 h-5 rounded accent-amber-500" />
                <span className="text-sm text-white/70">Publicera resultat publikt</span>
              </label>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Spara inställningar</>}
              </button>
              {saved && <span className="flex items-center gap-2 text-sm text-green-400"><Check className="w-4 h-4" /> Sparat!</span>}
            </div>
          </div>

          {/* Results */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-400" />
                Preliminära resultat
              </h3>
              <span className="text-sm text-white/40">{totalVotes} totala röster</span>
            </div>

            {results.length === 0 ? (
              <p className="text-center text-white/40 py-8">Inga röster inkomna ännu.</p>
            ) : (
              <div className="space-y-2">
                {results.map((r, i) => (
                  <div key={r.truck.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      i === 0 ? 'bg-amber-500/20 text-amber-400' : i === 1 ? 'bg-white/10 text-white/60' : 'bg-white/5 text-white/40'
                    }`}>
                      {i + 1}
                    </span>
                    {r.truck.main_image_url ? (
                      <img src={r.truck.main_image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    ) : null}
                    <div className="flex-grow min-w-0">
                      <p className="font-medium text-white text-sm truncate">{r.truck.company || r.truck.driver_name}</p>
                      <p className="text-xs text-white/40">{r.truck.brand} {r.truck.model}</p>
                    </div>
                    <span className="font-heading font-bold text-lg text-amber-400">{r.count}</span>
                    {i === 0 && r.count > 0 && <Trophy className="w-5 h-5 text-amber-400" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
