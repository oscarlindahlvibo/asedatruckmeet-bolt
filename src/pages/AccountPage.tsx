import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { Truck } from '@/types';
import { Loader2, Ticket, Truck as TruckIcon, User, LogOut, Plus, Pencil } from 'lucide-react';

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTruckForm, setShowTruckForm] = useState(false);
  const [tab, setTab] = useState<'tickets' | 'trucks' | 'profile'>('trucks');

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('trucks')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });
      setTrucks((data ?? []) as Truck[]);
      setLoading(false);
    })();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="glass-card p-8 text-center max-w-md">
          <p className="text-white/60 mb-6">Du måste logga in för att se Mina sidor.</p>
          <Link to="/konto/login" className="btn-primary">Logga in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="container-pad max-w-4xl">
        <h1 className="font-heading font-bold text-3xl text-white mb-2">Mina sidor</h1>
        <p className="text-sm text-white/40 mb-8">{user.email}</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/10 pb-3">
          <TabButton active={tab === 'trucks'} onClick={() => setTab('trucks')} icon={TruckIcon} label="Mina lastbilar" />
          <TabButton active={tab === 'tickets'} onClick={() => setTab('tickets')} icon={Ticket} label="Mina biljetter" />
          <TabButton active={tab === 'profile'} onClick={() => setTab('profile')} icon={User} label="Min profil" />
        </div>

        {tab === 'trucks' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-xl text-white">Mina lastbilar</h2>
              <button onClick={() => setShowTruckForm(!showTruckForm)} className="btn-primary">
                <Plus className="w-5 h-5" />
                Anmäl lastbil
              </button>
            </div>

            {showTruckForm && <TruckForm onSave={() => { setShowTruckForm(false); window.location.reload(); }} userId={user.id} />}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
              </div>
            ) : trucks.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <TruckIcon className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/50 mb-2">Du har inte anmält någon lastbil ännu.</p>
                <p className="text-sm text-white/30">Klicka på "Anmäl lastbil" för att komma igång.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {trucks.map((truck) => (
                  <div key={truck.id} className="glass-card p-5 flex items-center gap-4">
                    {truck.main_image_url ? (
                      <img src={truck.main_image_url} alt={truck.company} className="w-16 h-16 rounded-xl object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center">
                        <TruckIcon className="w-8 h-8 text-white/20" />
                      </div>
                    )}
                    <div className="flex-grow min-w-0">
                      <h3 className="font-heading font-semibold text-white truncate">{truck.company || truck.driver_name}</h3>
                      <p className="text-sm text-white/40">{truck.brand} {truck.model}</p>
                      <StatusBadge status={truck.status} />
                    </div>
                    <Link to={`/lastbilar/${truck.id}`} className="p-2 rounded-lg text-white/40 hover:text-amber-400 hover:bg-white/5 transition-all">
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'tickets' && (
          <div className="glass-card p-8 text-center">
            <Ticket className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 mb-2">Dina biljetter hanteras av Pretix.</p>
            <p className="text-sm text-white/30 mb-4">När du köpt biljetter visas de här automatiskt.</p>
            <Link to="/biljetter" className="btn-primary">Köp biljetter</Link>
          </div>
        )}

        {tab === 'profile' && (
          <div className="glass-card p-6 max-w-md">
            <h3 className="font-heading font-semibold text-white mb-4">Profil</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wide mb-1">E-post</p>
                <p className="text-white">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Användar-ID</p>
                <p className="text-white/60 text-sm font-mono">{user.id}</p>
              </div>
            </div>
            <button onClick={signOut} className="btn-ghost mt-6">
              <LogOut className="w-5 h-5" />
              Logga ut
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: {
  active: boolean;
  onClick: () => void;
  icon: typeof Ticket;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, { text: string; color: string }> = {
    incomplete: { text: 'Ofullständig', color: 'bg-white/10 text-white/50' },
    pending_approval: { text: 'Väntar godkännande', color: 'bg-amber-500/20 text-amber-400' },
    approved: { text: 'Godkänd', color: 'bg-green-500/20 text-green-400' },
    rejected: { text: 'Avvisad', color: 'bg-red-500/20 text-red-400' },
    hidden: { text: 'Dold', color: 'bg-white/10 text-white/40' },
  };
  const s = labels[status] ?? labels.incomplete;
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${s.color}`}>{s.text}</span>;
}

function TruckForm({ onSave, userId }: { onSave: () => void; userId: string }) {
  const { useActiveEvent } = require('@/hooks/useEvent');
  const { event } = useActiveEvent();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    company: '',
    driver_name: '',
    reg_number: '',
    country: 'Sverige',
    city: '',
    brand: '',
    model: '',
    category: 'Showtruck',
    description: '',
    is_public: false,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('trucks').insert({
      ...form,
      event_id: event?.id,
      owner_id: userId,
      status: form.is_public ? 'pending_approval' : 'incomplete',
    });
    setSaving(false);
    onSave();
  };

  return (
    <form onSubmit={handleSave} className="glass-card p-6 mb-6">
      <h3 className="font-heading font-bold text-lg text-white mb-4">Anmäl lastbil</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input placeholder="Åkeri / Företag" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all" />
        <input placeholder="Chaufför / Ägare" value={form.driver_name} onChange={(e) => setForm({ ...form, driver_name: e.target.value })}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all" />
        <input placeholder="Registreringsnummer" value={form.reg_number} onChange={(e) => setForm({ ...form, reg_number: e.target.value })}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all" />
        <input placeholder="Ort" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all" />
        <input placeholder="Märke (Scania, Volvo...)" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all" />
        <input placeholder="Modell" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all" />
        <textarea placeholder="Beskrivning" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
          className="md:col-span-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all resize-none" />
      </div>
      <label className="flex items-center gap-3 mt-4 cursor-pointer">
        <input type="checkbox" checked={form.is_public} onChange={(e) => setForm({ ...form, is_public: e.target.checked })} className="w-5 h-5 rounded accent-amber-500" />
        <span className="text-sm text-white/70">Visa min lastbil offentligt (kräver godkännande av admin)</span>
      </label>
      <div className="flex gap-3 mt-6">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Sparar...</> : 'Spara lastbil'}
        </button>
      </div>
    </form>
  );
}
