import PageHeader from '@/components/PageHeader';
import { useVisitInfo } from '@/hooks/useCms';
import { Loader2, Info } from 'lucide-react';

const ICON_MAP: Record<string, typeof Info> = {
  'map-pin': Info,
  'car': Info,
  'clock': Info,
  'tent': Info,
  'utensils': Info,
  'paw-print': Info,
  'info': Info,
};

export default function VisitInfoPage() {
  const { items, loading } = useVisitInfo();

  return (
    <>
      <PageHeader
        badge="Besöksinformation"
        title="Allt du behöver"
        highlight="veta"
        subtitle="Hitta all praktisk information för ditt besök på Åseda Truckmeet."
      />

      <section className="relative section-pad overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
        <div className="container-pad relative z-10">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-white/40 py-12">Information kommer snart.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
              {items.map((item, i) => {
                const Icon = ICON_MAP[item.icon] ?? Info;
                return (
                  <div key={item.id} className="glass-card p-6 hover:bg-white/[0.08] transition-all duration-300 group flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5 text-amber-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-white mb-1.5">{item.title}</h3>
                      <p className="text-sm text-white/50 leading-relaxed whitespace-pre-line">{item.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
