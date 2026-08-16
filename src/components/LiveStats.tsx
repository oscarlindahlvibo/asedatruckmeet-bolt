import { useActiveEvent } from '@/hooks/useEvent';
import { useSponsors } from '@/hooks/useSponsors';
import { Truck, Ticket, Handshake, CalendarDays } from 'lucide-react';

export default function LiveStats() {
  const { event } = useActiveEvent();
  const { sponsors } = useSponsors();

  if (!event) return null;

  const stats = [
    { visible: event.stat_trucks_visible, value: event.stat_trucks_value, label: 'Anmälda lastbilar', icon: Truck },
    { visible: event.stat_tickets_visible, value: event.stat_tickets_value, label: 'Sålda biljetter', icon: Ticket },
    { visible: event.stat_partners_visible, value: event.stat_partners_visible ? (sponsors.length || event.stat_partners_value) : 0, label: 'Partners', icon: Handshake },
    { visible: event.stat_days_visible, value: event.stat_days_value, label: 'Dagar', icon: CalendarDays },
  ].filter(s => s.visible && s.value > 0);

  if (stats.length === 0) return null;

  return (
    <section className="relative section-pad bg-ink-950 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-amber-500/5 rounded-full blur-[150px]" />
      <div className="container-pad relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-amber-400" strokeWidth={2} />
                </div>
                <p className="font-heading font-bold text-3xl md:text-5xl text-white mb-1">
                  {stat.value.toLocaleString('sv-SE')}
                </p>
                <p className="text-xs md:text-sm text-white/50 tracking-wide uppercase font-medium">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
