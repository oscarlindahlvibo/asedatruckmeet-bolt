import PageHeader from '@/components/PageHeader';
import { RULES } from '@/config';
import { Info, Clock } from 'lucide-react';

export default function RulesPage() {
  return (
    <>
      <PageHeader
        badge="Bra att veta"
        title="Regler &"
        highlight="information"
        subtitle="För att alla ska få en trygg och minnesvärd upplevelse har vi några enkla regler."
      />

      <section className="relative section-pad overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-diesel-500/5 rounded-full blur-[100px]" />
        <div className="container-pad relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {RULES.map((rule, i) => (
              <div
                key={i}
                className="glass-card p-6 hover:bg-white/[0.08] transition-all duration-300 group flex gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {i === 0 ? (
                      <Clock className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Info className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg text-white mb-1.5">{rule.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{rule.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 glass-card p-8 md:p-12 text-center max-w-3xl mx-auto">
            <h3 className="font-heading font-bold text-2xl text-white mb-4">
              Frågor om reglerna?
            </h3>
            <p className="text-white/60 leading-relaxed mb-6">
              Vid tveksamheter, kontakta arrangemanget via telefon eller e-post. Vi finns tillgängliga
              för att hjälpa till och svara på frågor inför och under evenemanget.
            </p>
            <a href="tel:0495766060" className="btn-ghost">
              Ring oss: 0495-76 60 60
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
