import { Link } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import SponsorLogo from '@/components/SponsorLogo';
import { useSponsors, groupSponsorsByTier } from '@/hooks/useSponsors';
import { SPONSORS as FALLBACK_SPONSORS } from '@/config';
import type { Sponsor } from '@/types';
import { Crown, Award, Handshake, ExternalLink, Medal, Loader2 } from 'lucide-react';

function sponsorToCompany(s: Sponsor) {
  return { name: s.name, description: s.description, logo: s.logo_url, url: s.website_url };
}

function TierLabel({ icon: Icon, label, color }: { icon: typeof Crown; label: string; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h2 className="font-heading font-bold text-2xl md:text-3xl text-white tracking-wide">{label}</h2>
    </div>
  );
}

interface TierGridProps {
  partners: { name: string; description: string; logo: string; url: string }[];
  logoHeight: string;
  textSize: string;
  cols: string;
}

function TierGrid({ partners, logoHeight, textSize, cols }: TierGridProps) {
  if (partners.length === 0) return null;

  return (
    <div className={`grid ${cols} gap-4 md:gap-5`}>
      {partners.map((partner, i) => (
        <div
          key={i}
          className="glass-card p-5 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 flex flex-col"
        >
          <div className="bg-white rounded-xl p-4 md:p-5 mb-3 flex items-center justify-center min-h-[80px]">
            <SponsorLogo name={partner.name} logo={partner.logo} height={logoHeight} textSize={textSize} />
          </div>
          <h3 className="font-heading font-semibold text-white mb-1 leading-tight">{partner.name}</h3>
          <p className="text-xs text-white/50 leading-relaxed mb-2 flex-grow">{partner.description}</p>
          {partner.url && (
            <a
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors mt-auto"
            >
              Besök hemsida <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

export default function SponsorsPage() {
  const { sponsors, loading } = useSponsors();
  const useFallback = sponsors.length === 0 && !loading;
  const grouped = groupSponsorsByTier(sponsors);

  const mainPartner = grouped.main[0]
    ? sponsorToCompany(grouped.main[0])
    : useFallback
    ? { name: FALLBACK_SPONSORS.mainPartner.name, description: FALLBACK_SPONSORS.mainPartner.description, logo: FALLBACK_SPONSORS.mainPartner.logo, url: FALLBACK_SPONSORS.mainPartner.url }
    : null;

  const platinumPartner = grouped.platinum[0]
    ? sponsorToCompany(grouped.platinum[0])
    : useFallback
    ? { name: FALLBACK_SPONSORS.platinumPartner.name, description: FALLBACK_SPONSORS.platinumPartner.description, logo: FALLBACK_SPONSORS.platinumPartner.logo, url: FALLBACK_SPONSORS.platinumPartner.url }
    : null;

  const goldPartners = grouped.gold.map(sponsorToCompany);
  const silverPartners = grouped.silver.map(sponsorToCompany);
  const bronzePartners = grouped.bronze.map(sponsorToCompany);

  return (
    <>
      <PageHeader
        badge="Våra sponsorer"
        title="Tack till våra"
        highlight="partners"
        subtitle="Det är våra fantastiska sponsorer och branschutställare som gör Åseda Truckmeet möjligt. Vill ni vara med och sponsra eller visa upp er?"
      />

      <section className="relative section-pad overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
        <div className="container-pad relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/kontakt" className="btn-primary">
              <Handshake className="w-5 h-5" />
              Bli sponsor
            </Link>
            <Link to="/kontakt" className="btn-ghost">
              Bli branschutställare
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            </div>
          ) : (
            <>
              {/* Main Partner */}
              {mainPartner && (
                <div className="mb-12">
                  <TierLabel icon={Crown} label="Huvudpartner" color="bg-amber-500" />
                  <a
                    href={mainPartner.url || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card p-10 md:p-14 hover:border-amber-500/40 transition-all duration-300 group relative overflow-hidden block max-w-3xl mx-auto"
                  >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                      <div className="bg-white rounded-2xl p-10 flex items-center justify-center min-h-[140px] md:min-w-[300px] group-hover:scale-[1.03] transition-transform">
                        <SponsorLogo name={mainPartner.name} logo={mainPartner.logo} height="h-20 md:h-24" textSize="text-2xl md:text-3xl" />
                      </div>
                      <div className="text-center md:text-left">
                        <h3 className="font-heading font-bold text-3xl md:text-4xl text-white mb-3">{mainPartner.name}</h3>
                        <p className="text-white/60 leading-relaxed mb-4">{mainPartner.description}</p>
                        {mainPartner.url && (
                          <span className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors">
                            Läs mer <ExternalLink className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                </div>
              )}

              {/* Platinum Partner */}
              {platinumPartner && (
                <div className="mb-16">
                  <TierLabel icon={Award} label="Platinapartner" color="bg-diesel-500" />
                  <a
                    href={platinumPartner.url || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card p-8 md:p-12 hover:border-amber-500/40 transition-all duration-300 group relative overflow-hidden block max-w-3xl mx-auto"
                  >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-diesel-500/10 rounded-full blur-3xl group-hover:bg-diesel-500/20 transition-colors" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                      <div className="bg-white rounded-2xl p-8 flex items-center justify-center min-h-[120px] md:min-w-[260px] group-hover:scale-[1.03] transition-transform">
                        <SponsorLogo name={platinumPartner.name} logo={platinumPartner.logo} height="h-16 md:h-20" textSize="text-xl md:text-2xl" />
                      </div>
                      <div className="text-center md:text-left">
                        <h3 className="font-heading font-bold text-2xl md:text-3xl text-white mb-3">{platinumPartner.name}</h3>
                        <p className="text-white/60 leading-relaxed mb-4">{platinumPartner.description}</p>
                        {platinumPartner.url && (
                          <span className="inline-flex items-center gap-2 text-sm font-medium text-diesel-400 hover:text-diesel-500 transition-colors">
                            Läs mer <ExternalLink className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                </div>
              )}

              {/* Gold Partners - 3 per row */}
              {goldPartners.length > 0 && (
                <div className="mb-16">
                  <TierLabel icon={Medal} label="Guldpartners" color="bg-amber-600" />
                  <TierGrid partners={goldPartners} logoHeight="h-14 md:h-16" textSize="text-lg md:text-xl" cols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
                </div>
              )}

              {/* Silver Partners - 4 per row */}
              {silverPartners.length > 0 && (
                <div className="mb-16">
                  <TierLabel icon={Medal} label="Silverpartners" color="bg-steel-500" />
                  <TierGrid partners={silverPartners} logoHeight="h-10 md:h-12" textSize="text-sm md:text-base" cols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" />
                </div>
              )}

              {/* Bronze Partners - 5 per row */}
              {bronzePartners.length > 0 && (
                <div className="mb-16">
                  <TierLabel icon={Medal} label="Bronspartners" color="bg-amber-700" />
                  <TierGrid partners={bronzePartners} logoHeight="h-8 md:h-10" textSize="text-xs md:text-sm" cols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" />
                </div>
              )}

              {/* CTA */}
              <div className="mt-16 glass-card p-8 md:p-12 text-center">
                <h3 className="font-heading font-bold text-2xl md:text-3xl text-white mb-4">
                  Vill ditt företag vara med?
                </h3>
                <p className="text-white/60 max-w-2xl mx-auto mb-8 leading-relaxed">
                  Vi erbjuder flera olika sponsorpaket – från brons till huvudpartner. Kontakta oss för att
                  diskutera vilket paket som passar ert företag bäst.
                </p>
                <Link to="/kontakt" className="btn-primary">
                  <Handshake className="w-5 h-5" />
                  Kontakta oss
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
