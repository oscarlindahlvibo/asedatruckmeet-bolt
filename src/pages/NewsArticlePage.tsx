import { useParams, Link } from 'react-router-dom';
import { useNewsArticle } from '@/hooks/useCms';
import { Loader2, ArrowLeft, Calendar } from 'lucide-react';

export default function NewsArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { article, loading } = useNewsArticle(id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <p className="text-white/60 mb-4">Artikeln hittades inte.</p>
          <Link to="/nyheter" className="btn-ghost">Tillbaka till nyheter</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16">
      <div className="container-pad max-w-3xl">
        <Link to="/nyheter" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-amber-400 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Tillbaka till nyheter
        </Link>

        <div className="flex items-center gap-2 text-sm text-white/40 mb-4">
          <Calendar className="w-4 h-4" />
          {new Date(article.published_at).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>

        <h1 className="font-heading font-bold text-3xl md:text-5xl text-white mb-6 leading-tight">
          {article.title}
        </h1>

        {article.image_url && (
          <div className="aspect-[16/9] overflow-hidden rounded-2xl mb-8">
            <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        {article.excerpt && (
          <p className="text-lg text-white/70 leading-relaxed mb-8 font-medium">{article.excerpt}</p>
        )}

        <div className="prose prose-invert max-w-none">
          <p className="text-white/60 leading-relaxed whitespace-pre-line">{article.body}</p>
        </div>

        {article.video_url && (
          <div className="mt-8 aspect-video rounded-2xl overflow-hidden">
            <iframe
              src={article.video_url}
              className="w-full h-full"
              title={article.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </div>
  );
}
