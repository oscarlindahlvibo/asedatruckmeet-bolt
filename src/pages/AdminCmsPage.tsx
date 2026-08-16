import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { supabase } from '@/lib/supabase';
import { useAllEvents } from '@/hooks/useEvent';
import type { VisitInfoSection, ProgramItem, NewsArticle, FaqCategory, FaqQuestion, GalleryAlbum, GalleryImage, HistoryItem, Aftermovie } from '@/types';
import { Plus, Pencil, Trash2, X, Loader2, AlertCircle, ChevronDown } from 'lucide-react';

type CmsType = 'visit' | 'program' | 'news' | 'faq' | 'gallery' | 'history' | 'aftermovies';

const CMS_TABS: { id: CmsType; label: string }[] = [
  { id: 'visit', label: 'Besöksinfo' },
  { id: 'program', label: 'Program' },
  { id: 'news', label: 'Nyheter' },
  { id: 'faq', label: 'FAQ' },
  { id: 'gallery', label: 'Galleri' },
  { id: 'history', label: 'Historik' },
  { id: 'aftermovies', label: 'Aftermovies' },
];

export default function AdminCmsPage() {
  const [tab, setTab] = useState<CmsType>('visit');

  return (
    <AdminLayout activeTab="settings">
      <h2 className="font-heading font-bold text-2xl text-white mb-6">Innehåll (CMS)</h2>

      <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
        {CMS_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t.id ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'visit' && <VisitInfoEditor />}
      {tab === 'program' && <ProgramEditor />}
      {tab === 'news' && <NewsEditor />}
      {tab === 'faq' && <FaqEditor />}
      {tab === 'gallery' && <GalleryEditor />}
      {tab === 'history' && <HistoryEditor />}
      {tab === 'aftermovies' && <AftermovieEditor />}
    </AdminLayout>
  );
}

function useEventId() {
  const { events } = useAllEvents();
  return events.find(e => e.is_active)?.id ?? null;
}

function useAdminData<T>(table: string, filter: string | null, order: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    let q = supabase.from(table).select('*');
    if (filter) q = q.eq('event_id', filter);
    const { data, error } = await q.order(order, { ascending: true });
    if (error) setError(error.message);
    setItems((data ?? []) as T[]);
    setLoading(false);
  }, [table, filter, order]);

  useEffect(() => { fetch(); }, [fetch]);

  return { items, loading, error, refetch: fetch };
}

function CrudHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-heading font-bold text-lg text-white">{title}</h3>
      <button onClick={onAdd} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Lägg till</button>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-white/70 mb-1.5 block">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all" />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-white/70 mb-1.5 block">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all resize-none" />
    </div>
  );
}

function ItemCard({ children, onEdit, onDelete }: { children: React.ReactNode; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="glass-card p-4 flex items-center gap-3">
      <div className="flex-grow min-w-0">{children}</div>
      <button onClick={onEdit} className="p-2 rounded-lg text-white/40 hover:text-amber-400 hover:bg-white/5 transition-all"><Pencil className="w-4 h-4" /></button>
      <button onClick={onDelete} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-all"><Trash2 className="w-4 h-4" /></button>
    </div>
  );
}

function FormModal({ title, onClose, children, onSave, saving }: {
  title: string; onClose: () => void; children: React.ReactNode; onSave: () => void; saving: boolean;
}) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="glass-card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-lg text-white">{title}</h3>
        <button type="button" onClick={onClose} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
      </div>
      <div className="space-y-4">{children}</div>
      <div className="flex gap-3 mt-6">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Sparar...</> : 'Spara'}
        </button>
        <button type="button" onClick={onClose} className="btn-ghost">Avbryt</button>
      </div>
    </form>
  );
}

// ============ VISIT INFO ============
function VisitInfoEditor() {
  const event_id = useEventId();
  const { items, loading, refetch } = useAdminData<VisitInfoSection>('visit_info_sections', event_id, 'display_order');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', content: '', icon: 'info', display_order: 0, is_active: true });
  const [saving, setSaving] = useState(false);

  const startAdd = () => { setEditingId(null); setForm({ title: '', content: '', icon: 'info', display_order: 0, is_active: true }); setShowForm(true); };
  const startEdit = (item: VisitInfoSection) => { setEditingId(item.id); setForm({ title: item.title, content: item.content, icon: item.icon, display_order: item.display_order, is_active: item.is_active }); setShowForm(true); };

  const handleSave = async () => {
    setSaving(true);
    if (editingId) {
      await supabase.from('visit_info_sections').update({ ...form, event_id }).eq('id', editingId);
    } else {
      await supabase.from('visit_info_sections').insert({ ...form, event_id });
    }
    setSaving(false); setShowForm(false); refetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Radera denna sektion?')) return;
    await supabase.from('visit_info_sections').delete().eq('id', id);
    refetch();
  };

  if (loading) return <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />;

  return (
    <div>
      <CrudHeader title="Besöksinfo-sektioner" onAdd={startAdd} />
      {showForm && (
        <FormModal title={editingId ? 'Redigera sektion' : 'Ny sektion'} onClose={() => setShowForm(false)} onSave={handleSave} saving={saving}>
          <Input label="Titel" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <TextArea label="Innehåll" value={form.content} onChange={(v) => setForm({ ...form, content: v })} />
          <Input label="Ikon-namn" value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} placeholder="info, map-pin, clock..." />
          <Input label="Sorteringsordning" value={String(form.display_order)} onChange={(v) => setForm({ ...form, display_order: parseInt(v) || 0 })} type="number" />
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-5 h-5 rounded accent-amber-500" />
            <span className="text-sm text-white/70">Publikt synlig</span>
          </label>
        </FormModal>
      )}
      <div className="space-y-2">
        {items.map((item) => (
          <ItemCard key={item.id} onEdit={() => startEdit(item)} onDelete={() => handleDelete(item.id)}>
            <h4 className="font-heading font-semibold text-white">{item.title}</h4>
            <p className="text-sm text-white/40 truncate">{item.content}</p>
          </ItemCard>
        ))}
        {items.length === 0 && <p className="text-center text-white/40 py-8">Inga sektioner ännu.</p>}
      </div>
    </div>
  );
}

// ============ PROGRAM ============
function ProgramEditor() {
  const event_id = useEventId();
  const { items, loading, refetch } = useAdminData<ProgramItem>('program_items', event_id, 'start_time');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', start_time: '', end_time: '', stage: '', artist: '', image_url: '', category: '', external_link: '', is_active: true });
  const [saving, setSaving] = useState(false);

  const startAdd = () => { setEditingId(null); setForm({ title: '', description: '', start_time: '', end_time: '', stage: '', artist: '', image_url: '', category: '', external_link: '', is_active: true }); setShowForm(true); };
  const startEdit = (item: ProgramItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title, description: item.description,
      start_time: item.start_time ? new Date(item.start_time).toISOString().slice(0, 16) : '',
      end_time: item.end_time ? new Date(item.end_time).toISOString().slice(0, 16) : '',
      stage: item.stage, artist: item.artist, image_url: item.image_url, category: item.category, external_link: item.external_link, is_active: item.is_active,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      event_id,
      start_time: form.start_time ? new Date(form.start_time).toISOString() : null,
      end_time: form.end_time ? new Date(form.end_time).toISOString() : null,
    };
    if (editingId) {
      await supabase.from('program_items').update(payload).eq('id', editingId);
    } else {
      await supabase.from('program_items').insert(payload);
    }
    setSaving(false); setShowForm(false); refetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Radera denna programpunkt?')) return;
    await supabase.from('program_items').delete().eq('id', id);
    refetch();
  };

  if (loading) return <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />;

  return (
    <div>
      <CrudHeader title="Programpunkter" onAdd={startAdd} />
      {showForm && (
        <FormModal title={editingId ? 'Redigera programpunkt' : 'Ny programpunkt'} onClose={() => setShowForm(false)} onSave={handleSave} saving={saving}>
          <Input label="Titel" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <TextArea label="Beskrivning" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start" value={form.start_time} onChange={(v) => setForm({ ...form, start_time: v })} type="datetime-local" />
            <Input label="Slut" value={form.end_time} onChange={(v) => setForm({ ...form, end_time: v })} type="datetime-local" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Scen/Plats" value={form.stage} onChange={(v) => setForm({ ...form, stage: v })} />
            <Input label="Artist" value={form.artist} onChange={(v) => setForm({ ...form, artist: v })} />
          </div>
          <Input label="Kategori" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
          <Input label="Bild-URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
          <Input label="Extern länk" value={form.external_link} onChange={(v) => setForm({ ...form, external_link: v })} />
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-5 h-5 rounded accent-amber-500" />
            <span className="text-sm text-white/70">Publikt synlig</span>
          </label>
        </FormModal>
      )}
      <div className="space-y-2">
        {items.map((item) => (
          <ItemCard key={item.id} onEdit={() => startEdit(item)} onDelete={() => handleDelete(item.id)}>
            <h4 className="font-heading font-semibold text-white">{item.title}</h4>
            <p className="text-sm text-white/40">{new Date(item.start_time).toLocaleString('sv-SE')} {item.stage ? `· ${item.stage}` : ''}</p>
          </ItemCard>
        ))}
        {items.length === 0 && <p className="text-center text-white/40 py-8">Inga programpunkter ännu.</p>}
      </div>
    </div>
  );
}

// ============ NEWS ============
function NewsEditor() {
  const event_id = useEventId();
  const { items, loading, refetch } = useAdminData<NewsArticle>('news_articles', event_id, 'published_at');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', excerpt: '', body: '', image_url: '', video_url: '', is_published: false, seo_title: '', seo_description: '' });
  const [saving, setSaving] = useState(false);

  const startAdd = () => { setEditingId(null); setForm({ title: '', excerpt: '', body: '', image_url: '', video_url: '', is_published: false, seo_title: '', seo_description: '' }); setShowForm(true); };
  const startEdit = (item: NewsArticle) => {
    setEditingId(item.id);
    setForm({ title: item.title, excerpt: item.excerpt, body: item.body, image_url: item.image_url, video_url: item.video_url, is_published: item.is_published, seo_title: item.seo_title, seo_description: item.seo_description });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form, event_id, published_at: new Date().toISOString() };
    if (editingId) {
      await supabase.from('news_articles').update(payload).eq('id', editingId);
    } else {
      await supabase.from('news_articles').insert(payload);
    }
    setSaving(false); setShowForm(false); refetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Radera denna nyhet?')) return;
    await supabase.from('news_articles').delete().eq('id', id);
    refetch();
  };

  if (loading) return <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />;

  return (
    <div>
      <CrudHeader title="Nyheter" onAdd={startAdd} />
      {showForm && (
        <FormModal title={editingId ? 'Redigera nyhet' : 'Ny nyhet'} onClose={() => setShowForm(false)} onSave={handleSave} saving={saving}>
          <Input label="Titel" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <TextArea label="Ingress" value={form.excerpt} onChange={(v) => setForm({ ...form, excerpt: v })} rows={2} />
          <TextArea label="Text" value={form.body} onChange={(v) => setForm({ ...form, body: v })} rows={6} />
          <Input label="Bild-URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
          <Input label="Video-URL (embed)" value={form.video_url} onChange={(v) => setForm({ ...form, video_url: v })} />
          <Input label="SEO-titel" value={form.seo_title} onChange={(v) => setForm({ ...form, seo_title: v })} />
          <Input label="SEO-beskrivning" value={form.seo_description} onChange={(v) => setForm({ ...form, seo_description: v })} />
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="w-5 h-5 rounded accent-amber-500" />
            <span className="text-sm text-white/70">Publicerad</span>
          </label>
        </FormModal>
      )}
      <div className="space-y-2">
        {items.map((item) => (
          <ItemCard key={item.id} onEdit={() => startEdit(item)} onDelete={() => handleDelete(item.id)}>
            <h4 className="font-heading font-semibold text-white">{item.title}</h4>
            <p className="text-sm text-white/40">{item.is_published ? 'Publicerad' : 'Utkast'} · {new Date(item.published_at).toLocaleDateString('sv-SE')}</p>
          </ItemCard>
        ))}
        {items.length === 0 && <p className="text-center text-white/40 py-8">Inga nyheter ännu.</p>}
      </div>
    </div>
  );
}

// ============ FAQ ============
function FaqEditor() {
  const event_id = useEventId();
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [questions, setQuestions] = useState<FaqQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCatForm, setShowCatForm] = useState(false);
  const [showQForm, setShowQForm] = useState(false);
  const [catForm, setCatForm] = useState({ name: '', display_order: 0 });
  const [qForm, setQForm] = useState({ category_id: '', question: '', answer: '', display_order: 0, is_active: true });
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    if (!event_id) return;
    const [catRes, qRes] = await Promise.all([
      supabase.from('faq_categories').select('*').eq('event_id', event_id).order('display_order', { ascending: true }),
      supabase.from('faq_questions').select('*, faq_categories!inner(event_id)').eq('faq_categories.event_id', event_id).order('display_order', { ascending: true }),
    ]);
    setCategories((catRes.data ?? []) as FaqCategory[]);
    setQuestions((qRes.data ?? []) as FaqQuestion[]);
    setLoading(false);
  }, [event_id]);

  useEffect(() => { fetch(); }, [fetch]);

  const saveCat = async () => {
    setSaving(true);
    await supabase.from('faq_categories').insert({ ...catForm, event_id });
    setSaving(false); setShowCatForm(false); setCatForm({ name: '', display_order: 0 }); fetch();
  };

  const saveQ = async () => {
    setSaving(true);
    await supabase.from('faq_questions').insert(qForm);
    setSaving(false); setShowQForm(false); setQForm({ category_id: '', question: '', answer: '', display_order: 0, is_active: true }); fetch();
  };

  const deleteCat = async (id: string) => {
    if (!confirm('Radera kategori och alla frågor i den?')) return;
    await supabase.from('faq_categories').delete().eq('id', id);
    fetch();
  };

  const deleteQ = async (id: string) => {
    await supabase.from('faq_questions').delete().eq('id', id);
    fetch();
  };

  if (loading) return <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-lg text-white">FAQ</h3>
        <div className="flex gap-2">
          <button onClick={() => setShowCatForm(true)} className="btn-ghost text-sm"><Plus className="w-4 h-4" /> Ny kategori</button>
          {categories.length > 0 && <button onClick={() => { setQForm({ ...qForm, category_id: categories[0].id }); setShowQForm(true); }} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Ny fråga</button>}
        </div>
      </div>

      {showCatForm && (
        <FormModal title="Ny kategori" onClose={() => setShowCatForm(false)} onSave={saveCat} saving={saving}>
          <Input label="Namn" value={catForm.name} onChange={(v) => setCatForm({ ...catForm, name: v })} />
          <Input label="Sorteringsordning" value={String(catForm.display_order)} onChange={(v) => setCatForm({ ...catForm, display_order: parseInt(v) || 0 })} type="number" />
        </FormModal>
      )}

      {showQForm && (
        <FormModal title="Ny fråga" onClose={() => setShowQForm(false)} onSave={saveQ} saving={saving}>
          <div>
            <label className="text-sm font-medium text-white/70 mb-1.5 block">Kategori</label>
            <select value={qForm.category_id} onChange={(e) => setQForm({ ...qForm, category_id: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none transition-all">
              {categories.map((c) => <option key={c.id} value={c.id} className="bg-ink-900">{c.name}</option>)}
            </select>
          </div>
          <Input label="Fråga" value={qForm.question} onChange={(v) => setQForm({ ...qForm, question: v })} />
          <TextArea label="Svar" value={qForm.answer} onChange={(v) => setQForm({ ...qForm, answer: v })} />
        </FormModal>
      )}

      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.id}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-heading font-semibold text-white">{cat.name}</h4>
              <button onClick={() => deleteCat(cat.id)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-all"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2">
              {questions.filter((q) => q.category_id === cat.id).map((q) => (
                <div key={q.id} className="glass-card p-4 flex items-center gap-3">
                  <div className="flex-grow min-w-0">
                    <p className="font-medium text-white text-sm">{q.question}</p>
                    <p className="text-xs text-white/40 truncate">{q.answer}</p>
                  </div>
                  <button onClick={() => deleteQ(q.id)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="text-center text-white/40 py-8">Skapa en kategori för att börja.</p>}
      </div>
    </div>
  );
}

// ============ GALLERY ============
function GalleryEditor() {
  const { items: albums, loading, refetch } = useAdminData<GalleryAlbum>('gallery_albums', null, 'year');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', year: new Date().getFullYear(), photographer: '', cover_image_url: '', is_active: true });
  const [saving, setSaving] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState('');

  const fetchImages = useCallback(async () => {
    if (!selectedAlbum) return;
    setImgLoading(true);
    const { data } = await supabase.from('gallery_images').select('*').eq('album_id', selectedAlbum).order('display_order', { ascending: true });
    setImages((data ?? []) as GalleryImage[]);
    setImgLoading(false);
  }, [selectedAlbum]);

  useEffect(() => { if (selectedAlbum) fetchImages(); }, [selectedAlbum, fetchImages]);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('gallery_albums').insert(form);
    setSaving(false); setShowForm(false); refetch();
  };

  const addImage = async () => {
    if (!imgUrl || !selectedAlbum) return;
    await supabase.from('gallery_images').insert({ album_id: selectedAlbum, image_url: imgUrl, display_order: images.length });
    setImgUrl(''); fetchImages();
  };

  const deleteImage = async (id: string) => {
    await supabase.from('gallery_images').delete().eq('id', id);
    fetchImages();
  };

  const deleteAlbum = async (id: string) => {
    if (!confirm('Radera album och alla bilder?')) return;
    await supabase.from('gallery_albums').delete().eq('id', id);
    setSelectedAlbum(null); refetch();
  };

  if (loading) return <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />;

  if (selectedAlbum) {
    return (
      <div>
        <button onClick={() => setSelectedAlbum(null)} className="text-sm text-white/50 hover:text-amber-400 transition-colors mb-4">← Tillbaka</button>
        <h3 className="font-heading font-bold text-lg text-white mb-4">Bilder i album</h3>
        <div className="flex gap-2 mb-4">
          <input value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} placeholder="Bild-URL"
            className="flex-grow px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all" />
          <button onClick={addImage} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Lägg till</button>
        </div>
        {imgLoading ? <Loader2 className="w-6 h-6 text-amber-400 animate-spin mx-auto" /> : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group">
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                <button onClick={() => deleteImage(img.id)} className="absolute top-1 right-1 w-7 h-7 rounded-lg bg-black/60 text-white/80 hover:text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <CrudHeader title="Galleri-album" onAdd={() => setShowForm(true)} />
      {showForm && (
        <FormModal title="Nytt album" onClose={() => setShowForm(false)} onSave={handleSave} saving={saving}>
          <Input label="Titel" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <Input label="År" value={String(form.year)} onChange={(v) => setForm({ ...form, year: parseInt(v) || 2027 })} type="number" />
          <Input label="Fotograf" value={form.photographer} onChange={(v) => setForm({ ...form, photographer: v })} />
          <Input label="Omslagsbild-URL" value={form.cover_image_url} onChange={(v) => setForm({ ...form, cover_image_url: v })} />
        </FormModal>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {albums.map((album) => (
          <button key={album.id} onClick={() => setSelectedAlbum(album.id)} className="glass-card p-4 text-left hover:border-amber-500/30 transition-all">
            {album.cover_image_url ? (
              <img src={album.cover_image_url} alt={album.title} className="w-full aspect-video rounded-lg object-cover mb-3" />
            ) : (
              <div className="w-full aspect-video rounded-lg bg-white/5 mb-3" />
            )}
            <h4 className="font-heading font-semibold text-white text-sm">{album.title}</h4>
            <p className="text-xs text-white/40">{album.year}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ HISTORY ============
function HistoryEditor() {
  const { items, loading, refetch } = useAdminData<HistoryItem>('history_items', null, 'year');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ year: 2027, title: '', description: '', image_url: '', is_active: true, event_id: '' });
  const [saving, setSaving] = useState(false);
  const event_id = useEventId();

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('history_items').insert({ ...form, event_id });
    setSaving(false); setShowForm(false); setForm({ year: 2027, title: '', description: '', image_url: '', is_active: true, event_id: '' }); refetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('history_items').delete().eq('id', id);
    refetch();
  };

  if (loading) return <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />;

  return (
    <div>
      <CrudHeader title="Historik / Timeline" onAdd={() => setShowForm(true)} />
      {showForm && (
        <FormModal title="Ny historikpunkt" onClose={() => setShowForm(false)} onSave={handleSave} saving={saving}>
          <Input label="År" value={String(form.year)} onChange={(v) => setForm({ ...form, year: parseInt(v) || 2027 })} type="number" />
          <Input label="Titel" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <TextArea label="Beskrivning" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
          <Input label="Bild-URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
        </FormModal>
      )}
      <div className="space-y-2">
        {items.map((item) => (
          <ItemCard key={item.id} onEdit={() => {}} onDelete={() => handleDelete(item.id)}>
            <h4 className="font-heading font-semibold text-white">{item.year} · {item.title}</h4>
            <p className="text-sm text-white/40 truncate">{item.description}</p>
          </ItemCard>
        ))}
      </div>
    </div>
  );
}

// ============ AFTERMOVIES ============
function AftermovieEditor() {
  const { items, loading, refetch } = useAdminData<Aftermovie>('aftermovies', null, 'year');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', year: 2027, video_url: '', thumbnail_url: '', is_featured: false, is_active: true, event_id: '' });
  const [saving, setSaving] = useState(false);
  const event_id = useEventId();

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('aftermovies').insert({ ...form, event_id });
    setSaving(false); setShowForm(false); setForm({ title: '', year: 2027, video_url: '', thumbnail_url: '', is_featured: false, is_active: true, event_id: '' }); refetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('aftermovies').delete().eq('id', id);
    refetch();
  };

  if (loading) return <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />;

  return (
    <div>
      <CrudHeader title="Aftermovies" onAdd={() => setShowForm(true)} />
      {showForm && (
        <FormModal title="Ny aftermovie" onClose={() => setShowForm(false)} onSave={handleSave} saving={saving}>
          <Input label="Titel" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <Input label="År" value={String(form.year)} onChange={(v) => setForm({ ...form, year: parseInt(v) || 2027 })} type="number" />
          <Input label="Video-URL (embed)" value={form.video_url} onChange={(v) => setForm({ ...form, video_url: v })} />
          <Input label="Thumbnail-URL" value={form.thumbnail_url} onChange={(v) => setForm({ ...form, thumbnail_url: v })} />
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-5 h-5 rounded accent-amber-500" />
            <span className="text-sm text-white/70">Featured på startsidan</span>
          </label>
        </FormModal>
      )}
      <div className="space-y-2">
        {items.map((item) => (
          <ItemCard key={item.id} onEdit={() => {}} onDelete={() => handleDelete(item.id)}>
            <h4 className="font-heading font-semibold text-white">{item.title}</h4>
            <p className="text-sm text-white/40">{item.year} {item.is_featured ? '· Featured' : ''}</p>
          </ItemCard>
        ))}
      </div>
    </div>
  );
}
