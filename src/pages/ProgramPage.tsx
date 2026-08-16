import PageHeader from '@/components/PageHeader';
import { useProgram } from '@/hooks/useCms';
import { Loader2, Clock, MapPin, ExternalLink, Circle } from 'lucide-react';

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function ProgramPage() {
  const { items, loading } = useProgram();
  const now = new Date();

  const isLive = (item: typeof items[0]) => {
    const start = new Date(item.start_time);
    const end = item.end_time ? new Date(item.end_time) : new Date(start.getTime() + 3600000);
    return now >= start && now <= end;
  };

  const isUpcoming = (item: typeof items[0]) => {
    return new Date(item.start_time) > now;
  };

  const groupedByDay = items.reduce<Record<string, typeof items>>((acc, item) => {
    const day = formatDate(item.start_time);
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        badge="Program"
        title="Hela"
        highlight="programmet"
        subtitle="Se allt som händer under Åseda Truckmeet – från scenen till tävlingar och aktiviteter."
      />

      <section className="relative section-pad overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="container-pad relative z-10 max-w-4xl">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-white/40 py-12">Programmet publiceras snart.</p>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedByDay).map(([day, dayItems]) => (
                <div key={day}>
                  <h3 className="font-heading font-bold text-xl text-white capitalize mb-6 flex items-center gap-3">
                    <span className="w-8 h-px bg-amber-500/50" />
                    {day}
                  </h3>
                  <div className="space-y-3">
                    {dayItems.map((item) => {
                      const live = isLive(item);
                      const upcoming = isUpcoming(item);
                      return (
                        <div
                          key={item.id}
                          className={`glass-card p-5 flex gap-4 items-start transition-all ${
                            live ? 'border-red-500/40 bg-red-500/5' : ''
                          }`}
                        >
                          <div className="flex-shrink-0 text-right min-w-[80px]">
                            <p className="font-heading font-bold text-lg text-white">{formatTime(item.start_time)}</p>
                            {item.end_time && (
                              <p className="text-xs text-white/40">{formatTime(item.end_time)}</p>
                            )}
                          </div>

                          <div className="flex-shrink-0">
                            {live ? (
                              <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold animate-pulse">
                                <Circle className="w-2 h-2 fill-current" />
                                LIVE
                              </span>
                            ) : upcoming ? (
                              <span className="text-xs text-amber-400/60 font-medium">Kommer</span>
                            ) : (
                              <span className="text-xs text-white/30">Avslutat</span>
                            )}
                          </div>

                          <div className="flex-grow min-w-0">
                            <h4 className="font-heading font-semibold text-white mb-1">{item.title}</h4>
                            {item.stage && (
                              <p className="text-xs text-amber-400/70 flex items-center gap-1 mb-1">
                                <MapPin className="w-3 h-3" />
                                {item.stage}
                              </p>
                            )}
                            {item.description && (
                              <p className="text-sm text-white/50 leading-relaxed">{item.description}</p>
                            )}
                            {item.external_link && (
                              <a
                                href={item.external_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 mt-2 transition-colors"
                              >
                                Läs mer <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
