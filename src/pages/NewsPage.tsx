import { Link } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import { useNews } from '@/hooks/useCms';
import { Loader2, ArrowRight, Calendar } from 'lucide-react';

export default function NewsPage() {
  const { articles, loading } = useNews();

  return (
    <>
      <PageHeader
        badge="Nyheter"
        title="Senaste"
        highlight="nyheterna"
        subtitle="Håll dig uppdaterad om allt som händer kring Åseda Truckmeet."
      />

      <section className="relative section-pad overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
        <div className="container-pad relative z-10 max-w-4xl">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            </div>
          ) : articles.length === 0 ? (
            <p className="text-center text-white/40 py-12">Inga nyheter publicerade ännu.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/nyheter/${article.id}`}
                  className="glass-card overflow-hidden hover:border-amber-500/30 hover:bg-white/[0.08] transition-all duration-300 group flex flex-col"
                >
                  {article.image_url && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(article.published_at).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-amber-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed flex-grow">{article.excerpt}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-medium mt-4 group-hover:gap-2 transition-all">
                      Läs mer <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
