import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { supabase } from '@/lib/supabase';
import type { Artist } from '@/types';
import { Plus, Pencil, Trash2, X, Loader2, AlertCircle, GripVertical, Eye, EyeOff } from 'lucide-react';

interface FormData {
  name: string;
  genre: string;
  description: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

const EMPTY_FORM: FormData = {
  name: '',
  genre: '',
  description: '',
  image_url: '',
  display_order: 0,
  is_active: true,
};

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchArtists = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) {
      setError(error.message);
    } else {
      setArtists(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  const startEdit = (artist: Artist) => {
    setEditingId(artist.id);
    setForm({
      name: artist.name,
      genre: artist.genre,
      description: artist.description,
      image_url: artist.image_url,
      display_order: artist.display_order,
      is_active: artist.is_active,
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
      const { error } = await supabase.from('artists').update(form).eq('id', editingId);
      if (error) setError(error.message);
      else {
        setShowForm(false);
        fetchArtists();
      }
    } else {
      const { error } = await supabase.from('artists').insert(form);
      if (error) setError(error.message);
      else {
        setShowForm(false);
        fetchArtists();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Är du säker på att du vill radera denna artist?')) return;
    const { error } = await supabase.from('artists').delete().eq('id', id);
    if (error) {
      setError(error.message);
    } else {
      fetchArtists();
    }
  };

  const toggleActive = async (artist: Artist) => {
    const { error } = await supabase
      .from('artists')
      .update({ is_active: !artist.is_active })
      .eq('id', artist.id);
    if (error) setError(error.message);
    else fetchArtists();
  };

  return (
    <AdminLayout activeTab="artists">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-2xl text-white">Artister</h2>
        <button onClick={startAdd} className="btn-primary">
          <Plus className="w-5 h-5" />
          Lägg till artist
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
              {editingId ? 'Redigera artist' : 'Ny artist'}
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
                placeholder="Artist/bandnamn"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Genre</label>
              <input
                type="text"
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all"
                placeholder="t.ex. Dansband, Rock, Party"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-white/70 mb-2 block">Beskrivning</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all resize-none"
                placeholder="Kort beskrivning av artisten"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-white/70 mb-2 block">Bild-URL</label>
              <input
                type="url"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all"
                placeholder="https://exempel.se/bild.jpg"
              />
              {form.image_url && (
                <div className="mt-2 rounded-lg overflow-hidden inline-block">
                  <img src={form.image_url} alt="Preview" className="h-24 w-auto rounded-lg object-cover" />
                </div>
              )}
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
                'Spara artist'
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className={`glass-card p-4 flex gap-4 ${!artist.is_active ? 'opacity-50' : ''}`}
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-ink-700">
                {artist.image_url ? (
                  <img src={artist.image_url} alt={artist.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
                    Ingen bild
                  </div>
                )}
              </div>

              <div className="flex-grow min-w-0">
                <h4 className="font-heading font-semibold text-white truncate">{artist.name}</h4>
                <p className="text-xs text-amber-400/70">{artist.genre || 'Ingen genre'}</p>
                <p className="text-xs text-white/40 truncate mt-1">{artist.description || 'Ingen beskrivning'}</p>
              </div>

              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <button
                  onClick={() => toggleActive(artist)}
                  className="p-1.5 rounded-lg text-white/40 hover:text-amber-400 hover:bg-white/5 transition-all"
                  title={artist.is_active ? 'Dölj' : 'Visa'}
                >
                  {artist.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => startEdit(artist)}
                  className="p-1.5 rounded-lg text-white/40 hover:text-amber-400 hover:bg-white/5 transition-all"
                  title="Redigera"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(artist.id)}
                  className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-all"
                  title="Radera"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {artists.length === 0 && (
            <p className="col-span-full text-center text-white/40 py-12">
              Inga artister ännu. Klicka på "Lägg till artist" för att börja.
            </p>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
