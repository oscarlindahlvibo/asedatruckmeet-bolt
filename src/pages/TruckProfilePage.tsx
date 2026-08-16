import { useParams, Link } from 'react-router-dom';
import { useTruck, useVoteSettings } from '@/hooks/useCms';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowLeft, MapPin, Calendar, Instagram, Facebook, Globe, Heart } from 'lucide-react';
import { useState } from 'react';

export default function TruckProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { truck, images, loading } = useTruck(id);
  const { settings } = useVoteSettings();
  const [voted, setVoted] = useState(false);
  const [voting, setVoting] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (!truck) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <p className="text-white/60 mb-4">Lastbilen hittades inte eller är inte publicerad.</p>
          <Link to="/lastbilar" className="btn-ghost">Tillbaka till lastbilar</Link>
        </div>
      </div>
    );
  }

  const voteOpen = settings?.opens_at && settings?.closes_at &&
    new Date() >= new Date(settings.opens_at) &&
    new Date() <= new Date(settings.closes_at);

  const handleVote = async () => {
    if (!truck) return;
    setVoting(true);
    const voterHash = `${navigator.userAgent}-${Date.now()}-${Math.random()}`;
    await supabase.from('votes').insert({
      event_id: truck.event_id,
      truck_id: truck.id,
      voter_hash: voterHash,
    });
    setVoted(true);
    setVoting(false);
  };

  return (
    <div className="pt-28 pb-16">
      <div className="container-pad max-w-4xl">
        <Link to="/lastbilar" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-amber-400 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Tillbaka till lastbilar
        </Link>

        {truck.main_image_url && (
          <div className="aspect-[16/9] overflow-hidden rounded-2xl mb-8">
            <img src={truck.main_image_url} alt={`${truck.company} ${truck.model}`} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            {truck.truck_number && (
              <span className="inline-block px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-sm font-bold mb-3">
                {truck.truck_number}
              </span>
            )}
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-white mb-2">
              {truck.company || truck.driver_name}
            </h1>
            <p className="text-lg text-white/60">{truck.brand} {truck.model}</p>
            {(truck.city || truck.country) && (
              <p className="text-sm text-white/40 mt-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {truck.city}{truck.city && truck.country ? ', ' : ''}{truck.country}
              </p>
            )}
          </div>

          {voteOpen && (
            <button
              onClick={handleVote}
              disabled={voted || voting}
              className={voted ? 'btn-ghost' : 'btn-primary'}
            >
              <Heart className={`w-5 h-5 ${voted ? 'fill-amber-400 text-amber-400' : ''}`} />
              {voted ? 'Röstat!' : 'Rösta på denna lastbil'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {truck.year_model && (
            <InfoCard label="Årsmodell" value={String(truck.year_model)} />
          )}
          {truck.engine_type && (
            <InfoCard label="Motortyp" value={truck.engine_type} />
          )}
          {truck.engine_power && (
            <InfoCard label="Motoreffekt" value={truck.engine_power} />
          )}
          {truck.body_type && (
            <InfoCard label="Påbyggnad" value={truck.body_type} />
          )}
          {truck.category && (
            <InfoCard label="Kategori" value={truck.category} />
          )}
          {truck.competition_class && (
            <InfoCard label="Tävlingsklass" value={truck.competition_class} />
          )}
        </div>

        {truck.description && (
          <div className="glass-card p-6 mb-8">
            <h3 className="font-heading font-semibold text-white mb-3">Beskrivning</h3>
            <p className="text-white/60 leading-relaxed whitespace-pre-line">{truck.description}</p>
          </div>
        )}

        {images.length > 0 && (
          <div className="mb-8">
            <h3 className="font-heading font-semibold text-white mb-4">Galleri</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setLightbox(img.image_url)}
                  className="aspect-square overflow-hidden rounded-xl group"
                >
                  <img src={img.image_url} alt="Lastbil bild" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        )}

        {(truck.instagram || truck.facebook || truck.website) && (
          <div className="flex items-center gap-3">
            {truck.instagram && (
              <a href={truck.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-amber-400 hover:border-amber-500/30 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {truck.facebook && (
              <a href={truck.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-amber-400 hover:border-amber-500/30 transition-all">
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {truck.website && (
              <a href={truck.website} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-amber-400 hover:border-amber-500/30 transition-all">
                <Globe className="w-5 h-5" />
              </a>
            )}
          </div>
        )}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Förstored bild" className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-card p-4">
      <p className="text-xs text-white/40 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  );
}
