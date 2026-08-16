import PageHeader from '@/components/PageHeader';
import { useState, useEffect, useCallback } from 'react';
import { fetchTickets, createCart } from '@/lib/prettix';
import { MOCK_TICKETS, SITE_CONFIG } from '@/config';
import type { TicketItem, CartLine } from '@/types';
import { Ticket, ShoppingCart, Loader2, Plus, Minus, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  Standard: 'Standard',
  Dagsbiljett: 'Dagsbiljett',
  VIP: 'VIP',
  Tillägg: 'Tillägg',
};

export default function ShopPage() {
  const [tickets, setTickets] = useState<TicketItem[]>(MOCK_TICKETS as unknown as TicketItem[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(false);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchTickets();
        if (cancelled) return;
        if (data.tickets.length > 0) {
          setTickets(data.tickets);
        }
        setConfigured(data.configured);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Kunde inte hämta biljetter');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const updateQty = useCallback((id: number, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] ?? 0;
      const next = Math.max(0, Math.min(10, current + delta));
      return { ...prev, [id]: next };
    });
  }, []);

  const totalItems = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  const handleCheckout = async () => {
    const lines: CartLine[] = tickets
      .filter((t) => (quantities[t.id] ?? 0) > 0)
      .map((t) => ({ item: t.id, variation: null, count: quantities[t.id] }));

    if (lines.length === 0) return;

    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const res = await createCart(lines);
      setCheckoutUrl(res.checkoutUrl);
      window.open(res.checkoutUrl, '_blank');
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Något gick fel');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        badge="Biljetter & Shop"
        title="Säkra din"
        highlight="plats"
        subtitle="Köp dina biljetter direkt här via vår bokningsmotor. Snabbt, säkert och enkelt."
      />

      <section className="relative section-pad bg-ink-950 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/5 rounded-full blur-[150px]" />

        <div className="container-pad relative z-10">
          {!configured && !loading && (
            <div className="mb-10 flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-white/60">Pretix-integrationen visas med exempelbiljetter. Anslut ditt Pretix-konto för riktiga biljetter.</span>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="glass-card p-8 text-center max-w-md mx-auto">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-4" />
              <p className="text-white/70 mb-6">{error}</p>
              <a href={SITE_CONFIG.pretixShopUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Gå till bokningssidan <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tickets.map((ticket) => {
                  const qty = quantities[ticket.id] ?? 0;
                  return (
                    <div
                      key={ticket.id}
                      className={`glass-card p-6 flex flex-col transition-all duration-300 ${
                        ticket.available
                          ? 'hover:border-amber-500/30 hover:bg-white/[0.08]'
                          : 'opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-xs tracking-wider text-amber-400/70 uppercase font-medium">
                          {CATEGORY_LABELS[ticket.category] ?? ticket.category}
                        </span>
                        {ticket.badge && (
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              ticket.badge === 'Slutsåld'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {ticket.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="font-heading font-bold text-xl text-white mb-2">{ticket.name}</h3>
                      <p className="text-sm text-white/50 leading-relaxed mb-5 flex-grow">{ticket.description}</p>

                      <div className="flex items-end gap-1 mb-5">
                        <span className="font-heading font-bold text-3xl text-gradient-amber">{ticket.price}</span>
                        <span className="text-sm text-white/50 mb-1">SEK</span>
                      </div>

                      {ticket.available ? (
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQty(ticket.id, -1)}
                              disabled={qty === 0}
                              className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 transition-all active:scale-90"
                              aria-label="Minska"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-heading font-semibold text-lg text-white w-6 text-center">
                              {qty}
                            </span>
                            <button
                              onClick={() => updateQty(ticket.id, 1)}
                              disabled={qty >= 10}
                              className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 hover:bg-amber-500/20 disabled:opacity-30 transition-all active:scale-90"
                              aria-label="Öka"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <Ticket className="w-5 h-5 text-white/20" />
                        </div>
                      ) : (
                        <div className="text-sm text-red-400/70 font-medium text-center py-2">
                          Ej tillgänglig
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-col items-center gap-4">
                {checkoutError && (
                  <div className="flex items-center gap-2 text-sm text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    {checkoutError}
                  </div>
                )}
                {checkoutUrl && (
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Omdirigerar till säker betalning...
                  </div>
                )}
                <button
                  onClick={handleCheckout}
                  disabled={totalItems === 0 || checkoutLoading}
                  className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed min-w-[260px]"
                >
                  {checkoutLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Bearbetar...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Gå till kassan {totalItems > 0 && `(${totalItems})`}
                    </>
                  )}
                </button>
                <p className="text-xs text-white/40">
                  Säker betalning via Pretix. Du omdirigeras till Pretix för att slutföra köpet.
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
