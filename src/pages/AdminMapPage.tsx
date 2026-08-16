import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { supabase } from '@/lib/supabase';
import { useAllEvents } from '@/hooks/useEvent';
import type { MapPoi, MapRoute, QrCode } from '@/types';
import { Loader2, Plus, Trash2, X, MapPin, QrCode as QrIcon, Route as RouteIcon, Download } from 'lucide-react';

type Tab = 'pois' | 'routes' | 'qr';

export default function AdminMapPage() {
  const [tab, setTab] = useState<Tab>('pois');

  return (
    <AdminLayout activeTab="settings">
      <h2 className="font-heading font-bold text-2xl text-white mb-6">Karta & QR</h2>

      <div className="flex gap-2 mb-6 border-b border-white/10 pb-3">
        {([['pois', 'Platser (POI)'], ['routes', 'Gångvägar'], ['qr', 'QR-koder']] as [Tab, string][]).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === id ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'pois' && <PoiEditor />}
      {tab === 'routes' && <RouteEditor />}
      {tab === 'qr' && <QrEditor />}
    </AdminLayout>
  );
}

function useEventId() {
  const { events } = useAllEvents();
  return events.find(e => e.is_active)?.id ?? null;
}

function PoiEditor() {
  const event_id = useEventId();
  const [pois, setPois] = useState<MapPoi[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'info', icon: 'map-pin', description: '', x: 50, y: 50, open_hours: '', link_url: '' });
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    if (!event_id) return;
    const { data } = await supabase.from('map_pois').select('*').eq('event_id', event_id).order('category');
    setPois((data ?? []) as MapPoi[]);
    setLoading(false);
  }, [event_id]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('map_pois').insert({ ...form, event_id });
    setSaving(false); setShowForm(false); setForm({ name: '', category: 'info', icon: 'map-pin', description: '', x: 50, y: 50, open_hours: '', link_url: '' }); fetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('map_pois').delete().eq('id', id);
    fetch();
  };

  if (loading) return <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-lg text-white">Platser (POI)</h3>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Ny plats</button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-lg text-white">Ny plats</h3>
            <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white/70 mb-1.5 block">Namn</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white/70 mb-1.5 block">Kategori</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none transition-all">
                  {['scen', 'wc', 'mat', 'bar', 'sponsor', 'utstallare', 'lastbil', 'camping', 'entre', 'parkering', 'sjukvard', 'information', 'aktivitet'].map(c => (
                    <option key={c} value={c} className="bg-ink-900">{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-white/70 mb-1.5 block">Ikon</label>
                <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white/70 mb-1.5 block">X-position (%)</label>
                <input type="number" min={0} max={100} value={form.x} onChange={(e) => setForm({ ...form, x: parseFloat(e.target.value) || 50 })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none transition-all" />
              </div>
              <div>
                <label className="text-sm font-medium text-white/70 mb-1.5 block">Y-position (%)</label>
                <input type="number" min={0} max={100} value={form.y} onChange={(e) => setForm({ ...form, y: parseFloat(e.target.value) || 50 })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none transition-all" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-white/70 mb-1.5 block">Beskrivning</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none transition-all resize-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-white/70 mb-1.5 block">Öppettider</label>
              <input value={form.open_hours} onChange={(e) => setForm({ ...form, open_hours: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none transition-all" />
            </div>
            <div>
              <label className="text-sm font-medium text-white/70 mb-1.5 block">Länk</label>
              <input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none transition-all" />
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary mt-4 disabled:opacity-50">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Spara'}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {pois.map((poi) => (
          <div key={poi.id} className="glass-card p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex-grow min-w-0">
              <p className="font-medium text-white text-sm">{poi.name}</p>
              <p className="text-xs text-white/40 capitalize">{poi.category} · X: {poi.x}% Y: {poi.y}%</p>
            </div>
            <button onClick={() => handleDelete(poi.id)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-all"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        {pois.length === 0 && <p className="text-center text-white/40 py-8">Inga platser ännu.</p>}
      </div>
    </div>
  );
}

function RouteEditor() {
  const event_id = useEventId();
  const [routes, setRoutes] = useState<MapRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    if (!event_id) return;
    const { data } = await supabase.from('map_routes').select('*').eq('event_id', event_id);
    setRoutes((data ?? []) as MapRoute[]);
    setLoading(false);
  }, [event_id]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('map_routes').insert({ ...form, event_id, poi_ids: [] });
    setSaving(false); setShowForm(false); setForm({ name: '', slug: '', description: '' }); fetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('map_routes').delete().eq('id', id);
    fetch();
  };

  if (loading) return <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-lg text-white">Gångvägar</h3>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Ny rutt</button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-white">Ny rutt</h3>
            <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div>
            <label className="text-sm font-medium text-white/70 mb-1.5 block">Namn</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none transition-all" />
          </div>
          <div>
            <label className="text-sm font-medium text-white/70 mb-1.5 block">Slug (URL)</label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="entre-norr"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none transition-all" />
          </div>
          <div>
            <label className="text-sm font-medium text-white/70 mb-1.5 block">Beskrivning</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none transition-all resize-none" />
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Spara'}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {routes.map((route) => (
          <div key={route.id} className="glass-card p-4 flex items-center gap-3">
            <RouteIcon className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div className="flex-grow min-w-0">
              <p className="font-medium text-white text-sm">{route.name}</p>
              <p className="text-xs text-white/40">/{route.slug}</p>
            </div>
            <button onClick={() => handleDelete(route.id)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-all"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        {routes.length === 0 && <p className="text-center text-white/40 py-8">Inga rutter ännu.</p>}
      </div>
    </div>
  );
}

function QrEditor() {
  const event_id = useEventId();
  const [codes, setCodes] = useState<QrCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', target_type: 'url', target_url: '', tracking_label: '' });
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    if (!event_id) return;
    const { data } = await supabase.from('qr_codes').select('*').eq('event_id', event_id).order('created_at', { ascending: false });
    setCodes((data ?? []) as QrCode[]);
    setLoading(false);
  }, [event_id]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('qr_codes').insert({ ...form, event_id });
    setSaving(false); setShowForm(false); setForm({ name: '', target_type: 'url', target_url: '', tracking_label: '' }); fetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('qr_codes').delete().eq('id', id);
    fetch();
  };

  if (loading) return <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-lg text-white">QR-koder</h3>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Ny QR-kod</button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-white">Ny QR-kod</h3>
            <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div>
            <label className="text-sm font-medium text-white/70 mb-1.5 block">Namn</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="WC-NORR-01"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none transition-all" />
          </div>
          <div>
            <label className="text-sm font-medium text-white/70 mb-1.5 block">Mål-URL</label>
            <input value={form.target_url} onChange={(e) => setForm({ ...form, target_url: e.target.value })} placeholder="https://asedatruckmeet.se/karta"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none transition-all" />
          </div>
          <div>
            <label className="text-sm font-medium text-white/70 mb-1.5 block">Tracking-label</label>
            <input value={form.tracking_label} onChange={(e) => setForm({ ...form, tracking_label: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none transition-all" />
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Spara'}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {codes.map((code) => (
          <div key={code.id} className="glass-card p-4 flex items-center gap-3">
            <QrIcon className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div className="flex-grow min-w-0">
              <p className="font-medium text-white text-sm">{code.name}</p>
              <p className="text-xs text-white/40 truncate">{code.target_url}</p>
              {code.scan_count > 0 && <p className="text-xs text-amber-400/60">{code.scan_count} scans</p>}
            </div>
            <a href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(code.target_url)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-white/40 hover:text-amber-400 hover:bg-white/5 transition-all">
              <Download className="w-4 h-4" />
            </a>
            <button onClick={() => handleDelete(code.id)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-all"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        {codes.length === 0 && <p className="text-center text-white/40 py-8">Inga QR-koder ännu.</p>}
      </div>
    </div>
  );
}
