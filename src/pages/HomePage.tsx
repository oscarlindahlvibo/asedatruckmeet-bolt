import { Link } from 'react-router-dom';
import Hero from '@/components/Hero';
import LiveStats from '@/components/LiveStats';
import SponsorLogo from '@/components/SponsorLogo';
import { useSponsors, useArtists, groupSponsorsByTier } from '@/hooks/useSponsors';
import { ARTISTS as FALLBACK_ARTISTS, SPONSORS as FALLBACK_SPONSORS } from '@/config';
import type { Sponsor, Artist } from '@/types';
import { Truck, Music, Trophy, Users, ArrowRight, Ticket, MapPin, Crown, Award, Medal, Loader2 } from 'lucide-react';

const FEATURES = [
  { icon: Truck, title: 'Häftiga ekipage', description: 'Se hundratals lastbilar från hela Norden. Rösta fram årets finaste lastbil på plats.', link: '/om' },
  { icon: Music, title: 'Scenunderhållning', description: 'Pipex, Da Buzz, Maskinen, 2 Blyga Läppar, J.O.X och LBSB på scen.', link: '/artister' },
  { icon: Trophy, title: 'Tävlingar & show', description: 'Truck-show, tävlingar och spännande föreläsningar för hela familjen.', link: '/om' },
  { icon: Users, title: 'Branschutställare', description: 'Möt lokala och nationella företag. Besök branschutställarna och upptäck nyheter.', link: '/sponsorer' },
];

function sponsorToCompany(s: Sponsor) {
  return { name: s.name, description: s.description, logo: s.logo_url, url: s.website_url };
}

function artistToDisplay(a: Artist) {
  return { name: a.name, genre: a.genre, description: a.description, image: a.image_url };
}

function TierLabel({ icon: Icon, label, color }: { icon: typeof Crown; label: string; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <h3 className="font-heading font-bold text-lg md:text-xl text-white tracking-wide">{label}</h3>
    </div>
  );
}

export default function HomePage() {
  const { sponsors, loading: sponsorsLoading } = useSponsors();
  const { artists, loading: artistsLoading } = useArtists();

  const useFallbackSponsors = sponsors.length === 0 && !sponsorsLoading;
  const useFallbackArtists = artists.length === 0 && !artistsLoading;

  const displayArtists = useFallbackArtists
    ? FALLBACK_ARTISTS.map((a) => ({ name: a.name, genre: a.genre, description: a.description, image: a.image }))
    : artists.map(artistToDisplay);

  const grouped = groupSponsorsByTier(sponsors);
  const mainPartner = grouped.main[0]
    ? sponsorToCompany(grouped.main[0])
    : useFallbackSponsors
    ? { name: FALLBACK_SPONSORS.mainPartner.name, description: FALLBACK_SPONSORS.mainPartner.description, logo: FALLBACK_SPONSORS.mainPartner.logo, url: FALLBACK_SPONSORS.mainPartner.url }
    : null;
  const platinumPartner = grouped.platinum[0]
    ? sponsorToCompany(grouped.platinum[0])
    : useFallbackSponsors
    ? { name: FALLBACK_SPONSORS.platinumPartner.name, description: FALLBACK_SPONSORS.platinumPartner.description, logo: FALLBACK_SPONSORS.platinumPartner.logo, url: FALLBACK_SPONSORS.platinumPartner.url }
    : null;

  const goldPartners = grouped.gold.map(sponsorToCompany);
  const silverPartners = grouped.silver.map(sponsorToCompany);
  const bronzePartners = grouped.bronze.map(sponsorToCompany);

  return (
    <>
      <Hero />

      <LiveStats />

      <section id="features" className="relative section-pad overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="container-pad relative z-10">
          <div className="text-center mb-16">
            <span className="text-sm tracking-[0.2em] text-amber-400 font-medium uppercase">Upplevelser</span>
            <h2 className="mt-4 font-heading font-bold text-4xl md:text-5xl text-white">
              Tre dagar av <span className="text-gradient-amber">magi</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <Link
                key={i}
                to={feature.link}
                className="glass-card p-7 hover:bg-white/[0.08] hover:border-amber-500/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-amber-400" strokeWidth={2} />
                </div>
                <h3 className="font-heading font-semibold text-lg text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed mb-4">{feature.description}</p>
                <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-medium group-hover:gap-2 transition-all">
                  Läs mer <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative section-pad bg-ink-950 overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-diesel-500/5 rounded-full blur-[120px]" />
        <div className="container-pad relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-sm tracking-[0.2em] text-amber-400 font-medium uppercase">Scenunderhållning</span>
              <h2 className="mt-4 font-heading font-bold text-4xl md:text-5xl text-white">
                Artister på <span className="text-gradient-amber">scenen</span>
              </h2>
            </div>
            <Link to="/artister" className="inline-flex items-center gap-2 text-sm text-amber-400 hover:gap-3 transition-all">
              Se alla artister <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {artistsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {displayArtists.map((artist, i) => (
                <div key={i} className="group relative overflow-hidden rounded-xl aspect-[3/4]">
                  <img src={artist.image} alt={artist.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-heading font-bold text-sm text-white">{artist.name}</h3>
                    <p className="text-[10px] text-amber-400/80">{artist.genre}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative section-pad overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
        <div className="container-pad relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-sm tracking-[0.2em] text-amber-400 font-medium uppercase">Våra sponsorer</span>
              <h2 className="mt-4 font-heading font-bold text-4xl md:text-5xl text-white">
                Tack till våra <span className="text-gradient-amber">partners</span>
              </h2>
            </div>
            <Link to="/sponsorer" className="inline-flex items-center gap-2 text-sm text-amber-400 hover:gap-3 transition-all">
              Alla sponsorer <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {sponsorsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
            </div>
          ) : (
            <>
              {/* Main + Platinum */}
              {(mainPartner || platinumPartner) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {mainPartner && (
                    <a
                      href={mainPartner.url || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-card p-8 hover:border-amber-500/40 transition-all duration-300 group flex flex-col items-center justify-center min-h-[200px]"
                    >
                      <div className="bg-white rounded-2xl p-8 mb-4 group-hover:scale-105 transition-transform">
                        <SponsorLogo name={mainPartner.name} logo={mainPartner.logo} height="h-16 md:h-20" textSize="text-lg md:text-xl" />
                      </div>
                      <span className="text-xs tracking-[0.2em] text-amber-400 uppercase font-medium">Huvudpartner</span>
                    </a>
                  )}
                  {platinumPartner && (
                    <a
                      href={platinumPartner.url || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-card p-8 hover:border-amber-500/40 transition-all duration-300 group flex flex-col items-center justify-center min-h-[200px]"
                    >
                      <div className="bg-white rounded-2xl p-8 mb-4 group-hover:scale-105 transition-transform">
                        <SponsorLogo name={platinumPartner.name} logo={platinumPartner.logo} height="h-14 md:h-16" textSize="text-base md:text-lg" />
                      </div>
                      <span className="text-xs tracking-[0.2em] text-diesel-400 uppercase font-medium">Platinapartner</span>
                    </a>
                  )}
                </div>
              )}

              {/* Gold - 3 per row */}
              {goldPartners.length > 0 && (
                <div className="mb-10">
                  <TierLabel icon={Medal} label="Guldpartners" color="bg-amber-600" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {goldPartners.map((p, i) => (
                      <div key={i} className="glass-card p-5 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 flex flex-col">
                        <div className="bg-white rounded-xl p-5 mb-3 flex items-center justify-center min-h-[90px]">
                          <SponsorLogo name={p.name} logo={p.logo} height="h-12 md:h-14" textSize="text-lg md:text-xl" />
                        </div>
                        <h4 className="font-heading font-semibold text-white mb-1 leading-tight">{p.name}</h4>
                        <p className="text-xs text-white/50 leading-relaxed">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Silver - 4 per row */}
              {silverPartners.length > 0 && (
                <div className="mb-10">
                  <TierLabel icon={Medal} label="Silverpartners" color="bg-steel-500" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {silverPartners.map((p, i) => (
                      <div key={i} className="glass-card p-4 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 flex flex-col">
                        <div className="bg-white rounded-xl p-4 mb-2 flex items-center justify-center min-h-[70px]">
                          <SponsorLogo name={p.name} logo={p.logo} height="h-9 md:h-11" textSize="text-sm md:text-base" />
                        </div>
                        <h4 className="font-heading font-semibold text-sm text-white mb-0.5 leading-tight">{p.name}</h4>
                        <p className="text-xs text-white/50 leading-relaxed line-clamp-2">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bronze - 5 per row */}
              {bronzePartners.length > 0 && (
                <div className="mb-10">
                  <TierLabel icon={Medal} label="Bronspartners" color="bg-amber-700" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {bronzePartners.map((p, i) => (
                      <div key={i} className="glass-card p-3 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 flex flex-col">
                        <div className="bg-white rounded-lg p-3 mb-2 flex items-center justify-center min-h-[60px]">
                          <SponsorLogo name={p.name} logo={p.logo} height="h-7 md:h-9" textSize="text-xs md:text-sm" />
                        </div>
                        <h4 className="font-heading font-semibold text-xs text-white leading-tight">{p.name}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="relative section-pad bg-ink-950 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/5 rounded-full blur-[150px]" />
        <div className="container-pad relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 backdrop-blur-sm mb-6">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-400 tracking-wide">26-28 JUNI 2026 · ÅSEDA FOLKETS PARK</span>
          </div>
          <h2 className="font-heading font-bold text-4xl md:text-6xl text-white mb-6">
            Redo att vara med?
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10">
            Säkra din plats nu. Biljetterna säljs via vår bokningsmotor med säker betalning.
          </p>
          <Link to="/biljetter" className="btn-primary text-base px-8 py-4">
            <Ticket className="w-5 h-5" />
            Köp biljetter nu
          </Link>
        </div>
      </section>
    </>
  );
}
