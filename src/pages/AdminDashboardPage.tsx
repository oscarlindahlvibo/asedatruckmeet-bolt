import AdminLayout from '@/components/AdminLayout';
import { useAllEvents, useSiteSettings } from '@/hooks/useEvent';
import { useSponsors, useArtists } from '@/hooks/useSponsors';
import type { EventStatus } from '@/types';
import { Ticket, Truck, Crown, Music, Calendar, TrendingUp, Users, Loader2 } from 'lucide-react';

const STATUS_LABELS: Record<EventStatus, { label: string; color: string }> = {
  draft: { label: 'Utkast', color: 'bg-white/10 text-white/60' },
  announced: { label: 'Tillkännagivet', color: 'bg-blue-500/20 text-blue-400' },
  tickets_coming: { label: 'Biljetor kommer', color: 'bg-amber-500/20 text-amber-400' },
  tickets_on_sale: { label: 'Biljetter ute', color: 'bg-green-500/20 text-green-400' },
  event_week: { label: 'Eventvecka', color: 'bg-orange-500/20 text-orange-400' },
  live: { label: 'LIVE', color: 'bg-red-500/20 text-red-400 animate-pulse' },
  finished: { label: 'Avslutat', color: 'bg-white/10 text-white/40' },
};

export default function AdminDashboardPage() {
  const { events, loading: eventsLoading } = useAllEvents();
  const { sponsors } = useSponsors();
  const { artists } = useArtists();

  const activeEvent = events.find(e => e.is_active);
  const loading = eventsLoading;

  const stats = [
    { icon: Ticket, label: 'Sålda biljetter', value: activeEvent?.stat_tickets_value ?? 0, color: 'text-amber-400' },
    { icon: Truck, label: 'Anmälda lastbilar', value: activeEvent?.stat_trucks_value ?? 0, color: 'text-amber-400' },
    { icon: Crown, label: 'Sponsorer', value: sponsors.length, color: 'text-amber-400' },
    { icon: Music, label: 'Artister', value: artists.length, color: 'text-amber-400' },
  ];

  return (
    <AdminLayout activeTab="dashboard">
      <div className="mb-8">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-white mb-2">Översikt</h2>
        {activeEvent && (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-white/60">{activeEvent.name}</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_LABELS[activeEvent.status].color}`}>
              {STATUS_LABELS[activeEvent.status].label}
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="glass-card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${stat.color}`} strokeWidth={2} />
                    </div>
                  </div>
                  <p className="font-heading font-bold text-2xl md:text-3xl text-white mb-1">
                    {stat.value.toLocaleString('sv-SE')}
                  </p>
                  <p className="text-xs text-white/50 uppercase tracking-wide font-medium">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Active event details */}
          {activeEvent && (
            <div className="glass-card p-6 mb-8">
              <h3 className="font-heading font-bold text-lg text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                Aktivt event
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Datum</p>
                  <p className="text-white font-medium">
                    {new Date(activeEvent.start_date).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' })}–
                    {new Date(activeEvent.end_date).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Plats</p>
                  <p className="text-white font-medium">{activeEvent.location}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Countdown till</p>
                  <p className="text-white font-medium">
                    {activeEvent.countdown_target
                      ? new Date(activeEvent.countdown_target).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })
                      : 'Ej satt'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* All events */}
          <div className="glass-card p-6">
            <h3 className="font-heading font-bold text-lg text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              Alla event
            </h3>
            <div className="space-y-2">
              {events.map((evt) => (
                <div key={evt.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-bold text-white">{evt.year}</span>
                    <span className="text-sm text-white/50">{evt.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {evt.is_active && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                        Aktivt
                      </span>
                    )}
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_LABELS[evt.status].color}`}>
                      {STATUS_LABELS[evt.status].label}
                    </span>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <p className="text-center text-white/40 py-4">Inga event skapade ännu.</p>
              )}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
