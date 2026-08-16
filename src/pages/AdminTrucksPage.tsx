import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { supabase } from '@/lib/supabase';
import { useAllEvents } from '@/hooks/useEvent';
import type { Truck, TruckStatus } from '@/types';
import { Loader2, Check, X, Eye, EyeOff, Truck as TruckIcon, Search } from 'lucide-react';

const STATUS_LABELS: Record<TruckStatus, { label: string; color: string }> = {
  incomplete: { label: 'Ofullständig', color: 'bg-white/10 text-white/50' },
  pending_approval: { label: 'Väntar godkännande', color: 'bg-amber-500/20 text-amber-400' },
  approved: { label: 'Godkänd', color: 'bg-green-500/20 text-green-400' },
  rejected: { label: 'Avvisad', color: 'bg-red-500/20 text-red-400' },
  hidden: { label: 'Dold', color: 'bg-white/10 text-white/40' },
};

export default function AdminTrucksPage() {
  const { events } = useAllEvents();
  const event_id = events.find(e => e.is_active)?.id ?? null;
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchTrucks = useCallback(async () => {
    if (!event_id) return;
    setLoading(true);
    let q = supabase.from('trucks').select('*').eq('event_id', event_id).order('created_at', { ascending: false });
    if (statusFilter) q = q.eq('status', statusFilter);
    const { data } = await q;
    setTrucks((data ?? []) as Truck[]);
    setLoading(false);
  }, [event_id, statusFilter]);

  useEffect(() => { fetchTrucks(); }, [fetchTrucks]);

  const updateStatus = async (id: string, status: TruckStatus) => {
    await supabase.from('trucks').update({ status }).eq('id', id);
    fetchTrucks();
  };

  const togglePublic = async (truck: Truck) => {
    await supabase.from('trucks').update({ is_public: !truck.is_public }).eq('id', truck.id);
    fetchTrucks();
  };

  const filtered = search
    ? trucks.filter(t =>
        t.company.toLowerCase().includes(search.toLowerCase()) ||
        t.driver_name.toLowerCase().includes(search.toLowerCase()) ||
        t.reg_number.toLowerCase().includes(search.toLowerCase()) ||
        t.truck_number.toLowerCase().includes(search.toLowerCase())
      )
    : trucks;

  return (
    <AdminLayout activeTab="settings">
      <h2 className="font-heading font-bold text-2xl text-white mb-6">Lastbilar</h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sök åkeri, chaufför, regnummer, trucknummer..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none transition-all"
        >
          <option value="" className="bg-ink-900">Alla statusar</option>
          <option value="pending_approval" className="bg-ink-900">Väntar godkännande</option>
          <option value="approved" className="bg-ink-900">Godkända</option>
          <option value="rejected" className="bg-ink-900">Avvisade</option>
          <option value="incomplete" className="bg-ink-900">Ofullständiga</option>
          <option value="hidden" className="bg-ink-900">Dolda</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((truck) => (
            <div key={truck.id} className="glass-card p-5">
              <div className="flex items-start gap-4 flex-wrap">
                {truck.main_image_url ? (
                  <img src={truck.main_image_url} alt={truck.company} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <TruckIcon className="w-10 h-10 text-white/20" />
                  </div>
                )}

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {truck.truck_number && <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-xs font-bold">{truck.truck_number}</span>}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_LABELS[truck.status].color}`}>{STATUS_LABELS[truck.status].label}</span>
                  </div>
                  <h3 className="font-heading font-semibold text-white">{truck.company || truck.driver_name}</h3>
                  <p className="text-sm text-white/40">{truck.brand} {truck.model} · {truck.city}</p>
                  {truck.reg_number && <p className="text-xs text-white/30">Reg: {truck.reg_number}</p>}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => togglePublic(truck)} className="p-2 rounded-lg text-white/40 hover:text-amber-400 hover:bg-white/5 transition-all" title={truck.is_public ? 'Dölj' : 'Visa'}>
                    {truck.is_public ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  {truck.status === 'pending_approval' && (
                    <>
                      <button onClick={() => updateStatus(truck.id, 'approved')} className="p-2 rounded-lg text-white/40 hover:text-green-400 hover:bg-white/5 transition-all" title="Godkänn">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => updateStatus(truck.id, 'rejected')} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-all" title="Avvisa">
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {truck.status === 'approved' && (
                    <button onClick={() => updateStatus(truck.id, 'hidden')} className="p-2 rounded-lg text-white/40 hover:text-amber-400 hover:bg-white/5 transition-all text-xs">
                      Dölj
                    </button>
                  )}
                  {truck.status === 'rejected' && (
                    <button onClick={() => updateStatus(truck.id, 'approved')} className="p-2 rounded-lg text-white/40 hover:text-green-400 hover:bg-white/5 transition-all text-xs">
                      Godkänn
                    </button>
                  )}
                </div>
              </div>

              {/* Truck number editor */}
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                <input
                  type="text"
                  defaultValue={truck.truck_number}
                  placeholder="Trucknummer (t.ex. B127)"
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all w-40"
                  onBlur={async (e) => {
                    if (e.target.value !== truck.truck_number) {
                      await supabase.from('trucks').update({ truck_number: e.target.value }).eq('id', truck.id);
                    }
                  }}
                />
                <input
                  type="text"
                  defaultValue={truck.area}
                  placeholder="Område"
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all w-32"
                  onBlur={async (e) => {
                    if (e.target.value !== truck.area) {
                      await supabase.from('trucks').update({ area: e.target.value }).eq('id', truck.id);
                    }
                  }}
                />
                <input
                  type="text"
                  defaultValue={truck.spot}
                  placeholder="Plats"
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all w-24"
                  onBlur={async (e) => {
                    if (e.target.value !== truck.spot) {
                      await supabase.from('trucks').update({ spot: e.target.value }).eq('id', truck.id);
                    }
                  }}
                />
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-white/40 py-12">Inga lastbilar hittades.</p>}
        </div>
      )}
    </AdminLayout>
  );
}
