import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { supabase } from '@/lib/supabase';
import type { Sponsor, SponsorTier } from '@/types';
import { Plus, Pencil, Trash2, X, Loader2, AlertCircle, Crown, Award, Medal, GripVertical, Eye, EyeOff } from 'lucide-react';

const TIER_CONFIG: Record<SponsorTier, { label: string; color: string; icon: typeof Crown }> = {
  main: { label: 'Huvudpartner', color: 'bg-amber-500', icon: Crown },
  platinum: { label: 'Platinapartner', color: 'bg-diesel-500', icon: Award },
  gold: { label: 'Guld', color: 'bg-amber-600', icon: Medal },
  silver: { label: 'Silver', color: 'bg-steel-500', icon: Medal },
  bronze: { label: 'Brons', color: 'bg-amber-700', icon: Medal },
};

const TIER_ORDER: SponsorTier[] = ['main', 'platinum', 'gold', 'silver', 'bronze'];

interface FormData {
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
  tier: SponsorTier;
  display_order: number;
  is_active: boolean;
}

const EMPTY_FORM: FormData = {
  name: '',
  description: '',
  logo_url: '',
  website_url: '',
  tier: 'bronze',
  display_order: 0,
  is_active: true,
};

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchSponsors = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .order('tier', { ascending: true })
      .order('display_order', { ascending: true });
    if (error) {
      setError(error.message);
    } else {
      setSponsors(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSponsors();
  }, [fetchSponsors]);

  const startEdit = (sponsor: Sponsor) => {
    setEditingId(sponsor.id);
    setForm({
      name: sponsor.name,
      description: sponsor.description,
      logo_url: sponsor.logo_url,
      website_url: sponsor.website_url,
      tier: sponsor.tier,
      display_order: sponsor.display_order,
      is_active: sponsor.is_active,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (editingId) {
      const { error } = await supabase.from('sponsors').update(form).eq('id', editingId);
      if (error) setError(error.message);
      else {
        setShowForm(false);
        fetchSponsors();
      }
    } else {
      const { error } = await supabase.from('sponsors').insert(form);
      if (error) setError(error.message);
      else {
        setShowForm(false);
        fetchSponsors();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Är du säker på att du vill radera denna sponsor?')) return;
    const { error } = await supabase.from('sponsors').delete().eq('id', id);
    if (error) {
      setError(error.message);
    } else {
      fetchSponsors();
    }
  };

  const toggleActive = async (sponsor: Sponsor) => {
    const { error } = await supabase
      .from('sponsors')
      .update({ is_active: !sponsor.is_active })
      .eq('id', sponsor.id);
    if (error) setError(error.message);
    else fetchSponsors();
  };

  return (
    <AdminLayout activeTab="sponsors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-2xl text-white">Sponsorer</h2>
        <button onClick={startAdd} className="btn-primary">
          <Plus className="w-5 h-5" />
          Lägg till sponsor
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
              {editingId ? 'Redigera sponsor' : 'Ny sponsor'}
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Namn *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all"
                placeholder="Företagsnamn"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Sponsorpaket</label>
              <select
                value={form.tier}
                onChange={(e) => setForm({ ...form, tier: e.target.value as SponsorTier })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all"
              >
                {TIER_ORDER.map((tier) => (
                  <option key={tier} value={tier} className="bg-ink-900">
                    {TIER_CONFIG[tier].label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-white/70 mb-2 block">Beskrivning</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all resize-none"
                placeholder="Kort beskrivning av företaget"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Logo-URL</label>
              <input
                type="url"
                value={form.logo_url}
                onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all"
                placeholder="https://exempel.se/logo.png"
              />
              {form.logo_url && (
                <div className="mt-2 bg-white rounded-lg p-3 inline-flex">
                  <img src={form.logo_url} alt="Logo preview" className="h-10 w-auto object-contain" />
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Website-URL</label>
              <input
                type="url"
                value={form.website_url}
                onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all"
                placeholder="https://exempel.se"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Sorteringsordning</label>
              <input
                type="number"
                value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                min={0}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-5 h-5 rounded accent-amber-500"
                />
                <span className="text-sm font-medium text-white/70">Synlig på hemsidan</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sparar...
                </>
              ) : (
                'Spara sponsor'
              )}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">
              Avbryt
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          {TIER_ORDER.map((tier) => {
            const tierSponsors = sponsors.filter((s) => s.tier === tier);
            if (tierSponsors.length === 0) return null;
            const config = TIER_CONFIG[tier];
            const Icon = config.icon;

            return (
              <div key={tier}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-lg ${config.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-white">{config.label}</h3>
                  <span className="text-sm text-white/40">({tierSponsors.length})</span>
                </div>

                <div className="space-y-3">
                  {tierSponsors.map((sponsor) => (
                    <div
                      key={sponsor.id}
                      className={`glass-card p-4 flex items-center gap-4 ${
                        !sponsor.is_active ? 'opacity-50' : ''
                      }`}
                    >
                      <GripVertical className="w-5 h-5 text-white/20 flex-shrink-0" />

                      <div className="bg-white rounded-lg p-2.5 flex-shrink-0 w-16 h-16 flex items-center justify-center">
                        {sponsor.logo_url ? (
                          <img src={sponsor.logo_url} alt={sponsor.name} className="max-h-10 max-w-full object-contain" />
                        ) : (
                          <span className="font-heading font-bold text-xs text-ink-900 text-center leading-tight">
                            {sponsor.name}
                          </span>
                        )}
                      </div>

                      <div className="flex-grow min-w-0">
                        <h4 className="font-heading font-semibold text-white truncate">{sponsor.name}</h4>
                        <p className="text-sm text-white/40 truncate">{sponsor.description || 'Ingen beskrivning'}</p>
                        {sponsor.website_url && (
                          <a
                            href={sponsor.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-amber-400/70 hover:text-amber-400 transition-colors"
                          >
                            {sponsor.website_url}
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => toggleActive(sponsor)}
                          className="p-2 rounded-lg text-white/40 hover:text-amber-400 hover:bg-white/5 transition-all"
                          title={sponsor.is_active ? 'Dölj' : 'Visa'}
                        >
                          {sponsor.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => startEdit(sponsor)}
                          className="p-2 rounded-lg text-white/40 hover:text-amber-400 hover:bg-white/5 transition-all"
                          title="Redigera"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sponsor.id)}
                          className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-all"
                          title="Radera"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {sponsors.length === 0 && (
            <p className="text-center text-white/40 py-12">Inga sponsorer ännu. Klicka på "Lägg till sponsor" för att börja.</p>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
