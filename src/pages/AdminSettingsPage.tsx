import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/types';
import { Loader2, AlertCircle, Check, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState<Partial<SiteSettings>>({});

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    if (error) {
      setError(error.message);
    } else if (data) {
      setSettings(data as SiteSettings);
      setForm(data as SiteSettings);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const { error } = await supabase
      .from('site_settings')
      .update({
        site_name: form.site_name,
        organization: form.organization,
        org_address: form.org_address,
        org_zip: form.org_zip,
        org_phone: form.org_phone,
        contact_email: form.contact_email,
        pretix_shop_url: form.pretix_shop_url,
        facebook_url: form.facebook_url,
        instagram_url: form.instagram_url,
        youtube_url: form.youtube_url,
      })
      .eq('id', 1);

    if (error) {
      setError(error.message);
    } else {
      setSaved(true);
      fetchSettings();
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  return (
    <AdminLayout activeTab="settings">
      <div className="mb-6">
        <h2 className="font-heading font-bold text-2xl text-white">Webbplatsinställningar</h2>
        <p className="text-sm text-white/40 mt-1">Globala inställningar för hela webbplatsen</p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="glass-card p-6 md:p-8 max-w-2xl">
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Webbplatsnamn</label>
              <input type="text" value={form.site_name ?? ''} onChange={(e) => setForm({ ...form, site_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all" />
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Organisation</label>
              <input type="text" value={form.organization ?? ''} onChange={(e) => setForm({ ...form, organization: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-white/70 mb-2 block">Adress</label>
                <input type="text" value={form.org_address ?? ''} onChange={(e) => setForm({ ...form, org_address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all" />
              </div>

              <div>
                <label className="text-sm font-medium text-white/70 mb-2 block">Postnummer</label>
                <input type="text" value={form.org_zip ?? ''} onChange={(e) => setForm({ ...form, org_zip: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-white/70 mb-2 block">Telefon</label>
                <input type="text" value={form.org_phone ?? ''} onChange={(e) => setForm({ ...form, org_phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all" />
              </div>

              <div>
                <label className="text-sm font-medium text-white/70 mb-2 block">E-post</label>
                <input type="email" value={form.contact_email ?? ''} onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all" />
              </div>
            </div>

            <div className="border-t border-white/10 pt-5">
              <h4 className="font-heading font-semibold text-white mb-4">Integrationer</h4>
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Pretix shop-URL</label>
              <input type="url" value={form.pretix_shop_url ?? ''} onChange={(e) => setForm({ ...form, pretix_shop_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all"
                placeholder="https://asedatruckmeet.se/butik" />
            </div>

            <div className="border-t border-white/10 pt-5">
              <h4 className="font-heading font-semibold text-white mb-4">Sociala medier</h4>
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Facebook</label>
              <input type="url" value={form.facebook_url ?? ''} onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all" />
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Instagram</label>
              <input type="url" value={form.instagram_url ?? ''} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all" />
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">YouTube</label>
              <input type="url" value={form.youtube_url ?? ''} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all" />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-8">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
              {saving ? (<><Loader2 className="w-5 h-5 animate-spin" /> Sparar...</>) : (<><Save className="w-5 h-5" /> Spara inställningar</>)}
            </button>
            {saved && (
              <span className="flex items-center gap-2 text-sm text-green-400">
                <Check className="w-4 h-4" />
                Sparat!
              </span>
            )}
          </div>
        </form>
      )}
    </AdminLayout>
  );
}
