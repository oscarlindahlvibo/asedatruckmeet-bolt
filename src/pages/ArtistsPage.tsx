import PageHeader from '@/components/PageHeader';
import { useArtists } from '@/hooks/useSponsors';
import { ARTISTS as FALLBACK_ARTISTS } from '@/config';
import type { Artist } from '@/types';
import { Music2, Loader2 } from 'lucide-react';

function artistToDisplay(a: Artist) {
  return { name: a.name, genre: a.genre, description: a.description, image: a.image_url };
}

export default function ArtistsPage() {
  const { artists, loading } = useArtists();
  const useFallback = artists.length === 0 && !loading;

  const displayArtists = useFallback
    ? FALLBACK_ARTISTS.map((a) => ({ name: a.name, genre: a.genre, description: a.description, image: a.image }))
    : artists.map(artistToDisplay);

  return (
    <>
      <PageHeader
        badge="Scenunderhållning"
        title="Artister på"
        highlight="scenen"
        subtitle="En fantastisk blandning av dansband, eurodance, party och liveband som håller stämningen i topp hela helgen."
      />

      <section className="relative section-pad bg-ink-950 overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-diesel-500/5 rounded-full blur-[120px]" />
        <div className="container-pad relative z-10">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayArtists.map((artist, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer"
                >
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />

                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30">
                      <Music2 className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-medium text-amber-400">{artist.genre}</span>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-heading font-bold text-2xl text-white mb-2">{artist.name}</h3>
                    <p className="text-sm text-white/60 leading-relaxed max-w-xs">{artist.description}</p>
                  </div>

                  <div className="absolute inset-0 border-2 border-amber-500/0 group-hover:border-amber-500/40 rounded-2xl transition-all duration-300" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
