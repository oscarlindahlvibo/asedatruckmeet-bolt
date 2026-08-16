import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { supabase } from '@/lib/supabase';
import { useAllEvents } from '@/hooks/useEvent';
import type { PretixOrder } from '@/types';
import { Loader2, Search, ExternalLink, RefreshCw } from 'lucide-react';

export default function AdminOrdersPage() {
  const { events } = useAllEvents();
  const event_id = events.find(e => e.is_active)?.id ?? null;
  const [orders, setOrders] = useState<PretixOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchOrders = useCallback(async () => {
    if (!event_id) return;
    setLoading(true);
    const { data } = await supabase
      .from('pretix_orders')
      .select('*')
      .eq('event_id', event_id)
      .order('created_at_pretix', { ascending: false });
    setOrders((data ?? []) as PretixOrder[]);
    setLoading(false);
  }, [event_id]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const filtered = search
    ? orders.filter(o =>
        o.pretix_order_id.toLowerCase().includes(search.toLowerCase()) ||
        o.email.toLowerCase().includes(search.toLowerCase()) ||
        o.name.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  const totalRevenue = orders
    .filter(o => o.payment_status === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <AdminLayout activeTab="settings">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-2xl text-white">Beställningar</h2>
        <button onClick={fetchOrders} className="btn-ghost text-sm">
          <RefreshCw className="w-4 h-4" />
          Synka
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Totalt</p>
          <p className="font-heading font-bold text-2xl text-white">{orders.length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Betalda</p>
          <p className="font-heading font-bold text-2xl text-green-400">{orders.filter(o => o.payment_status === 'paid').length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Omsättning</p>
          <p className="font-heading font-bold text-2xl text-amber-400">{totalRevenue.toLocaleString('sv-SE')} kr</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Sök ordernummer, namn, e-post..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((order) => (
            <div key={order.id} className="glass-card p-4 flex items-center gap-4 flex-wrap">
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-heading font-semibold text-white text-sm">{order.pretix_order_id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    order.payment_status === 'paid' ? 'bg-green-500/20 text-green-400' :
                    order.payment_status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {order.payment_status}
                  </span>
                </div>
                <p className="text-sm text-white/50">{order.name} · {order.email}</p>
              </div>
              <span className="font-heading font-bold text-amber-400">{order.total.toLocaleString('sv-SE')} kr</span>
              {order.created_at_pretix && (
                <span className="text-xs text-white/30">{new Date(order.created_at_pretix).toLocaleDateString('sv-SE')}</span>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-white/40 py-12">
              {orders.length === 0 ? 'Inga beställningar synkade ännu. Beställningar synkas via Pretix webhooks.' : 'Inga resultat.'}
            </p>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
