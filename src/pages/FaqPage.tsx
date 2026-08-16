import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { useFaq } from '@/hooks/useCms';
import { Loader2, ChevronDown } from 'lucide-react';

export default function FaqPage() {
  const { categories, questions, loading } = useFaq();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <>
      <PageHeader
        badge="FAQ"
        title="Vanliga"
        highlight="frågor"
        subtitle="Hitta svar på de vanligaste frågorna om Åseda Truckmeet."
      />

      <section className="relative section-pad overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="container-pad relative z-10 max-w-3xl">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            </div>
          ) : questions.length === 0 ? (
            <p className="text-center text-white/40 py-12">FAQ kommer snart.</p>
          ) : (
            <div className="space-y-8">
              {categories.map((cat) => {
                const catQuestions = questions.filter((q) => q.category_id === cat.id);
                if (catQuestions.length === 0) return null;
                return (
                  <div key={cat.id}>
                    <h3 className="font-heading font-bold text-lg text-white mb-4 flex items-center gap-3">
                      <span className="w-6 h-px bg-amber-500/50" />
                      {cat.name}
                    </h3>
                    <div className="space-y-2">
                      {catQuestions.map((q) => (
                        <div key={q.id} className="glass-card overflow-hidden">
                          <button
                            onClick={() => setOpenId(openId === q.id ? null : q.id)}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.03] transition-colors"
                          >
                            <span className="font-heading font-semibold text-white pr-4">{q.question}</span>
                            <ChevronDown
                              className={`w-5 h-5 text-amber-400 flex-shrink-0 transition-transform duration-300 ${
                                openId === q.id ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              openId === q.id ? 'max-h-96' : 'max-h-0'
                            }`}
                          >
                            <p className="text-sm text-white/50 leading-relaxed px-5 pb-5">{q.answer}</p>
                          </div>
                        </div>
                      ))}
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
