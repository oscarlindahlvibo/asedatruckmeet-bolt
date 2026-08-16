import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { useGallery, useGalleryImages } from '@/hooks/useCms';
import { Loader2, X, Camera } from 'lucide-react';

export default function GalleryPage() {
  const { albums, loading } = useGallery();
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (selectedAlbum) {
    return <GalleryAlbumView albumId={selectedAlbum} onBack={() => setSelectedAlbum(null)} lightbox={lightbox} setLightbox={setLightbox} />;
  }

  return (
    <>
      <PageHeader
        badge="Galleri"
        title="Bilder från"
        highlight="eventen"
        subtitle="Se bilder från tidigare och aktuella Åseda Truckmeet-upplagor."
      />

      <section className="relative section-pad overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
        <div className="container-pad relative z-10">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            </div>
          ) : albums.length === 0 ? (
            <p className="text-center text-white/40 py-12">Inga album publicerade ännu.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <button
                  key={album.id}
                  onClick={() => setSelectedAlbum(album.id)}
                  className="glass-card overflow-hidden hover:border-amber-500/30 hover:bg-white/[0.08] transition-all duration-300 group text-left"
                >
                  {album.cover_image_url ? (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={album.cover_image_url}
                        alt={album.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-white/5 flex items-center justify-center">
                      <Camera className="w-12 h-12 text-white/20" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-lg text-white mb-1 group-hover:text-amber-400 transition-colors">
                      {album.title}
                    </h3>
                    <p className="text-xs text-white/40">{album.year}{album.photographer ? ` · ${album.photographer}` : ''}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function GalleryAlbumView({ albumId, onBack, lightbox, setLightbox }: {
  albumId: string;
  onBack: () => void;
  lightbox: string | null;
  setLightbox: (url: string | null) => void;
}) {
  const { images, loading } = useGalleryImages(albumId);

  return (
    <div className="pt-28 pb-16">
      <div className="container-pad">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-amber-400 transition-colors mb-8">
          <X className="w-4 h-4" />
          Tillbaka till album
        </button>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => setLightbox(img.image_url)}
                className="aspect-square overflow-hidden rounded-xl group relative"
              >
                <img
                  src={img.image_url}
                  alt={img.caption || 'Galleribild'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {img.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <p className="text-xs text-white">{img.caption}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="Förstored bild" className="max-w-full max-h-full object-contain rounded-lg" />
          <button className="absolute top-4 right-4 text-white/60 hover:text-white" onClick={() => setLightbox(null)}>
            <X className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
}
