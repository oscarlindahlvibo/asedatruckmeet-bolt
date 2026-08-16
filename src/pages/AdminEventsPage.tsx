import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { supabase } from '@/lib/supabase';
import type { TruckmeetEvent, EventStatus } from '@/types';
import { Plus, Pencil, Trash2, X, Loader2, AlertCircle, Calendar, Check } from 'lucide-react';

const STATUS_OPTIONS: { value: EventStatus; label: string }[] = [
  { value: 'draft', label: 'Utkast' },
  { value: 'announced', label: 'Tillkännagivet' },
  { value: 'tickets_coming', label: 'Biljetter kommer' },
  { value: 'tickets_on_sale', label: 'Biljetter ute' },
  { value: 'event_week', label: 'Eventvecka' },
  { value: 'live', label: 'LIVE' },
  { value: 'finished', label: 'Avslutat' },
];

interface FormData {
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
  countdown_target: string;
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
}

function toInputDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toISOString().slice(0, 16);
}

function emptyForm(year: number): FormData {
  return {
    name: `Åseda Truckmeet ${year}`,
    year,
    start_date: '',
    end_date: '',
    location: 'Åseda Folkets park',
    status: 'draft',
    is_active: false,
    hero_title: '',
    hero_subtitle: '',
    hero_badge: '',
    hero_image_url: '',
    countdown_target: '',
    countdown_label: '',
    primary_cta_text: 'Köp biljett',
    primary_cta_link: '/biljetter',
    secondary_cta_text: '',
    secondary_cta_link: '',
    stat_trucks_visible: true,
    stat_tickets_visible: true,
    stat_partners_visible: true,
    stat_days_visible: true,
    stat_trucks_value: 0,
    stat_tickets_value: 0,
    stat_partners_value: 0,
    stat_days_value: 0,
  };
}

function eventToForm(e: TruckmeetEvent): FormData {
  return {
    name: e.name,
    year: e.year,
    start_date: toInputDate(e.start_date),
    end_date: toInputDate(e.end_date),
    location: e.location,
    status: e.status,
    is_active: e.is_active,
    hero_title: e.hero_title,
    hero_subtitle: e.hero_subtitle,
    hero_badge: e.hero_badge,
    hero_image_url: e.hero_image_url,
    countdown_target: e.countdown_target ? toInputDate(e.countdown_target) : '',
    countdown_label: e.countdown_label,
    primary_cta_text: e.primary_cta_text,
    primary_cta_link: e.primary_cta_link,
    secondary_cta_text: e.secondary_cta_text,
    secondary_cta_link: e.secondary_cta_link,
    stat_trucks_visible: e.stat_trucks_visible,
    stat_tickets_visible: e.stat_tickets_visible,
    stat_partners_visible: e.stat_partners_visible,
    stat_days_visible: e.stat_days_visible,
    stat_trucks_value: e.stat_trucks_value,
    stat_tickets_value: e.stat_tickets_value,
    stat_partners_value: e.stat_partners_value,
    stat_days_value: e.stat_days_value,
  };
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<TruckmeetEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm(new Date().getFullYear() + 1));
  const [saving, setSaving] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('year', { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setEvents((data ?? []) as TruckmeetEvent[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const startEdit = (evt: TruckmeetEvent) => {
    setEditingId(evt.id);
    setForm(eventToForm(evt));
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startAdd = () => {
    setEditingId(null);
    const nextYear = events.length > 0 ? Math.max(...events.map(e => e.year)) + 1 : new Date().getFullYear() + 1;
    setForm(emptyForm(nextYear));
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
      end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
      countdown_target: form.countdown_target ? new Date(form.countdown_target).toISOString() : null,
    };

    if (editingId) {
      const { error } = await supabase.from('events').update(payload).eq('id', editingId);
      if (error) setError(error.message);
      else {
        setShowForm(false);
        fetchEvents();
      }
    } else {
      const { error } = await supabase.from('events').insert(payload);
      if (error) setError(error.message);
      else {
        setShowForm(false);
        fetchEvents();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Är du säker på att du vill radera detta event? All data kopplad till eventet kan påverkas.')) return;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) setError(error.message);
    else fetchEvents();
  };

  const setActive = async (evt: TruckmeetEvent) => {
    // First, unset is_active on all events
    await supabase.from('events').update({ is_active: false }).neq('id', evt.id);
    // Then set this one active
    const { error } = await supabase.from('events').update({ is_active: true }).eq('id', evt.id);
    if (error) setError(error.message);
    else fetchEvents();
  };

  return (
    <AdminLayout activeTab="events">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-2xl text-white">Event</h2>
        <button onClick={startAdd} className="btn-primary">
          <Plus className="w-5 h-5" />
          Skapa event
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSave} className="glass-card p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-xl text-white">
              {editingId ? 'Redigera event' : 'Nytt event'}
            </h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-white/40 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Namn *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all"
                placeholder="Åseda Truckmeet 2028" />
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">År *</label>
              <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) || 2027 })} required min={2020} max={2099}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all" />
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Startdatum *</label>
              <input type="datetime-local" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all" />
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Slutdatum *</label>
              <input type="datetime-local" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} required
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all" />
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Plats</label>
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all" />
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as EventStatus })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all">
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value} className="bg-ink-900">{s.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 border-t border-white/10 pt-5 mt-1">
              <h4 className="font-heading font-semibold text-white mb-4">Hero & startsida</h4>
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Hero-badge</label>
              <input type="text" value={form.hero_badge} onChange={(e) => setForm({ ...form, hero_badge: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all"
                placeholder="NÄSTA EVENT · 2027" />
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Hero-bild URL</label>
              <input type="url" value={form.hero_image_url} onChange={(e) => setForm({ ...form, hero_image_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all"
                placeholder="https://..." />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-white/70 mb-2 block">Hero-titel</label>
              <input type="text" value={form.hero_title} onChange={(e) => setForm({ ...form, hero_title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all"
                placeholder="UPPLEV MAGIN MED" />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-white/70 mb-2 block">Hero-undertext</label>
              <textarea value={form.hero_subtitle} onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })} rows={2}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all resize-none"
                placeholder="Beskrivning under hero-titel" />
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Primär CTA-text</label>
              <input type="text" value={form.primary_cta_text} onChange={(e) => setForm({ ...form, primary_cta_text: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all" />
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Primär CTA-länk</label>
              <input type="text" value={form.primary_cta_link} onChange={(e) => setForm({ ...form, primary_cta_link: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all" />
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Sekundär CTA-text</label>
              <input type="text" value={form.secondary_cta_text} onChange={(e) => setForm({ ...form, secondary_cta_text: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all" />
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Sekundär CTA-länk</label>
              <input type="text" value={form.secondary_cta_link} onChange={(e) => setForm({ ...form, secondary_cta_link: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all" />
            </div>

            <div className="md:col-span-2 border-t border-white/10 pt-5 mt-1">
              <h4 className="font-heading font-semibold text-white mb-4">Countdown</h4>
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Countdown-datum</label>
              <input type="datetime-local" value={form.countdown_target} onChange={(e) => setForm({ ...form, countdown_target: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all" />
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Countdown-text</label>
              <input type="text" value={form.countdown_label} onChange={(e) => setForm({ ...form, countdown_label: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all"
                placeholder="Åseda Truckmeet 2027 börjar om" />
            </div>

            <div className="md:col-span-2 border-t border-white/10 pt-5 mt-1">
              <h4 className="font-heading font-semibold text-white mb-4">Live-statistik</h4>
            </div>

            <StatField label="Anmälda lastbilar" value={form.stat_trucks_value} visible={form.stat_trucks_visible}
              onChange={(v) => setForm({ ...form, stat_trucks_value: v })}
              onToggle={() => setForm({ ...form, stat_trucks_visible: !form.stat_trucks_visible })} />

            <StatField label="Sålda biljetter" value={form.stat_tickets_value} visible={form.stat_tickets_visible}
              onChange={(v) => setForm({ ...form, stat_tickets_value: v })}
              onToggle={() => setForm({ ...form, stat_tickets_visible: !form.stat_tickets_visible })} />

            <StatField label="Partners" value={form.stat_partners_value} visible={form.stat_partners_visible}
              onChange={(v) => setForm({ ...form, stat_partners_value: v })}
              onToggle={() => setForm({ ...form, stat_partners_visible: !form.stat_partners_visible })} />

            <StatField label="Dagar" value={form.stat_days_value} visible={form.stat_days_visible}
              onChange={(v) => setForm({ ...form, stat_days_value: v })}
              onToggle={() => setForm({ ...form, stat_days_visible: !form.stat_days_visible })} />

            <div className="md:col-span-2 flex items-end">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-5 h-5 rounded accent-amber-500" />
                <span className="text-sm font-medium text-white/70">Aktivt event (visas på hemsidan)</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
              {saving ? (<><Loader2 className="w-5 h-5 animate-spin" /> Sparar...</>) : 'Spara event'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Avbryt</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((evt) => (
            <div key={evt.id} className={`glass-card p-5 ${!evt.is_active ? 'opacity-70' : ''}`}>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3 flex-grow min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-heading font-semibold text-white truncate">{evt.name}</h4>
                    <p className="text-sm text-white/40">
                      {new Date(evt.start_date).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' })} –
                      {new Date(evt.end_date).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {evt.is_active ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">Aktivt</span>
                  ) : (
                    <button onClick={() => setActive(evt)} className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-white/60 hover:text-amber-400 hover:bg-white/10 transition-all">
                      Sätt aktiv
                    </button>
                  )}
                  <button onClick={() => startEdit(evt)} className="p-2 rounded-lg text-white/40 hover:text-amber-400 hover:bg-white/5 transition-all" title="Redigera">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(evt.id)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-all" title="Radera">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-center text-white/40 py-12">Inga event ännu. Klicka på "Skapa event" för att börja.</p>
          )}
        </div>
      )}
    </AdminLayout>
  );
}

function StatField({ label, value, visible, onChange, onToggle }: {
  label: string;
  value: number;
  visible: boolean;
  onChange: (v: number) => void;
  onToggle: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-white/70">{label}</label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={visible} onChange={onToggle} className="w-4 h-4 rounded accent-amber-500" />
          <span className="text-xs text-white/40">Visa</span>
        </label>
      </div>
      <input type="number" value={value} onChange={(e) => onChange(parseInt(e.target.value) || 0)} min={0}
        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all" />
    </div>
  );
}
