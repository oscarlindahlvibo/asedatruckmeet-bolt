import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { useMapPois, useMapRoutes } from '@/hooks/useCms';
import { Loader2, MapPin, X, Clock, ExternalLink, Route as RouteIcon } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  scen: 'bg-purple-500',
  wc: 'bg-blue-500',
  mat: 'bg-orange-500',
  bar: 'bg-amber-500',
  sponsor: 'bg-green-500',
  utstallare: 'bg-teal-500',
  lastbil: 'bg-red-500',
  camping: 'bg-indigo-500',
  entre: 'bg-yellow-500',
  parkering: 'bg-gray-500',
  sjukvard: 'bg-pink-500',
  information: 'bg-cyan-500',
  aktivitet: 'bg-lime-500',
  info: 'bg-cyan-500',
};

export default function MapPage() {
  const { pois, loading } = useMapPois();
  const { routes } = useMapRoutes();
  const [selectedPoi, setSelectedPoi] = useState<string | null>(null);
  const [activeRoute, setActiveRoute] = useState<string | null>(null);

  const selected = pois.find((p) => p.id === selectedPoi);

  return (
    <>
      <PageHeader
        badge="Områdeskarta"
        title="Hitta på"
        highlight="området"
        subtitle="Se var scenen, mat, toaletter och andra viktiga platser finns på eventområdet."
      />

      <section className="relative section-pad overflow-hidden">
        <div className="container-pad relative z-10">
          {/* Route selector */}
          {routes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveRoute(null)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  !activeRoute ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
                }`}
              >
                Alla platser
              </button>
              {routes.map((route) => (
                <button
                  key={route.id}
                  onClick={() => setActiveRoute(route.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeRoute === route.id ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <RouteIcon className="w-4 h-4" />
                  {route.name}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            </div>
          ) : pois.length === 0 ? (
            <p className="text-center text-white/40 py-12">Kartan kommer snart.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map */}
              <div className="lg:col-span-2">
                <div className="relative aspect-[4/3] bg-ink-950 rounded-2xl border border-white/10 overflow-hidden">
                  {/* Grid background */}
                  <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }} />

                  {/* POIs */}
                  {pois.map((poi) => {
                    const isInRoute = !activeRoute || (routes.find(r => r.id === activeRoute)?.poi_ids.includes(poi.id));
                    if (!isInRoute) return null;
                    const color = CATEGORY_COLORS[poi.category] ?? 'bg-cyan-500';
                    return (
                      <button
                        key={poi.id}
                        onClick={() => setSelectedPoi(poi.id)}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group"
                        style={{ left: `${poi.x}%`, top: `${poi.y}%` }}
                      >
                        <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center group-hover:scale-125 transition-transform shadow-lg`}>
                          <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white/80 bg-ink-950/90 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {poi.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* POI list / detail */}
              <div>
                {selected ? (
                  <div className="glass-card p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-heading font-bold text-lg text-white">{selected.name}</h3>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 text-white ${CATEGORY_COLORS[selected.category] ?? 'bg-cyan-500'}`}>
                          {selected.category}
                        </span>
                      </div>
                      <button onClick={() => setSelectedPoi(null)} className="text-white/40 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    {selected.description && (
                      <p className="text-sm text-white/60 leading-relaxed mb-4">{selected.description}</p>
                    )}
                    {selected.open_hours && (
                      <div className="flex items-center gap-2 text-sm text-white/50 mb-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        {selected.open_hours}
                      </div>
                    )}
                    {selected.link_url && (
                      <a href={selected.link_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 transition-colors">
                        Läs mer <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="glass-card p-5">
                    <h3 className="font-heading font-bold text-lg text-white mb-4">Platser på området</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {pois.map((poi) => (
                        <button
                          key={poi.id}
                          onClick={() => setSelectedPoi(poi.id)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
                        >
                          <div className={`w-8 h-8 rounded-full ${CATEGORY_COLORS[poi.category] ?? 'bg-cyan-500'} flex items-center justify-center flex-shrink-0`}>
                            <MapPin className="w-4 h-4 text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{poi.name}</p>
                            <p className="text-xs text-white/40 capitalize">{poi.category}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
