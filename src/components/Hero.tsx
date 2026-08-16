import { Link } from 'react-router-dom';
import { useCountdown } from '@/hooks/useCountdown';
import { useActiveEvent } from '@/hooks/useEvent';
import { SITE_CONFIG } from '@/config';
import { Ticket, MapPin, ChevronDown, Truck, Loader2 } from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.pexels.com/photos/35602229/pexels-photo-35602229.jpeg?auto=compress&cs=tinysrgb&w=1920';

function TimeUnit({ value, label }: { value: number; label: string }) {
  const display = value < 10 ? `0${value}` : `${value}`;
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-16 h-20 md:w-24 md:h-28 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent" />
          <span className="font-heading font-bold text-3xl md:text-5xl text-white text-gradient-amber relative z-10">
            {display}
          </span>
        </div>
      </div>
      <span className="mt-2 text-[10px] md:text-xs font-medium tracking-[0.15em] text-white/50 uppercase">
        {label}
      </span>
    </div>
  );
}

export default function Hero() {
  const { event, loading } = useActiveEvent();

  const countdownTarget = event?.countdown_target ?? SITE_CONFIG.eventStartDate;
  const { days, hours, minutes, seconds } = useCountdown(countdownTarget);

  const heroTitle = event?.hero_title || 'UPPLEV MAGIN MED';
  const heroSubtitle = event?.hero_subtitle || 'Skandinaviens största lastbilsträff. Tre dagar fyllda med häftiga ekipage, branschutställare, underhållning och gemenskap – alltid helgen efter midsommar.';
  const heroBadge = event?.hero_badge || `${event?.year ?? SITE_CONFIG.year}-ÅRSJUBILEUM · ${event?.year ?? 2026}`;
  const heroImage = event?.hero_image_url || FALLBACK_IMAGE;
  const countdownLabel = event?.countdown_label || `Åseda Truckmeet ${event?.year ?? 2026} börjar om`;
  const primaryCtaText = event?.primary_cta_text || 'Köp biljetter nu';
  const primaryCtaLink = event?.primary_cta_link || '/biljetter';
  const secondaryCtaText = event?.secondary_cta_text || 'Läs mer';
  const secondaryCtaLink = event?.secondary_cta_link || '/om';

  const datesText = event
    ? `${new Date(event.start_date).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' })}–${new Date(event.end_date).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })}`
    : SITE_CONFIG.dates;
  const locationText = event?.location || SITE_CONFIG.location;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Lastbil på väg i solnedgång" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/70 to-ink-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/60 to-transparent" />
      </div>

      <div className="relative z-10 container-pad text-center pt-24 pb-16">
        {loading ? (
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
        ) : (
          <>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 backdrop-blur-sm mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-sm font-medium text-amber-400 tracking-wide">{heroBadge}</span>
            </div>

            <h1 className="font-heading font-bold text-5xl md:text-7xl lg:text-8xl text-white text-shadow-lg leading-[0.95] mb-6 animate-fade-in-up">
              {heroTitle}<br />
              <span className="text-gradient-amber">ÅSEDA TRUCKMEET</span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 animate-fade-in-delay-1 leading-relaxed">
              {heroSubtitle}
            </p>

            <div className="flex items-center justify-center gap-2 text-white/60 mb-8 animate-fade-in-delay-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              <span className="text-sm md:text-base">{datesText} · {locationText}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-delay-3">
              <Link to={primaryCtaLink} className="btn-primary">
                <Ticket className="w-5 h-5" />
                {primaryCtaText}
              </Link>
              {secondaryCtaText && (
                <Link to={secondaryCtaLink} className="btn-ghost">
                  {secondaryCtaText === 'Anmäl lastbil' && <Truck className="w-5 h-5" />}
                  {secondaryCtaText}
                </Link>
              )}
            </div>

            <div className="animate-fade-in-delay-3">
              <p className="text-xs tracking-[0.2em] text-white/40 uppercase mb-5">
                {countdownLabel}
              </p>
              <div className="flex items-center justify-center gap-3 md:gap-5">
                <TimeUnit value={days} label="Dagar" />
                <span className="font-heading text-2xl md:text-4xl text-amber-500/50 -mt-6">:</span>
                <TimeUnit value={hours} label="Timmar" />
                <span className="font-heading text-2xl md:text-4xl text-amber-500/50 -mt-6">:</span>
                <TimeUnit value={minutes} label="Minuter" />
                <span className="font-heading text-2xl md:text-4xl text-amber-500/50 -mt-6">:</span>
                <TimeUnit value={seconds} label="Sekunder" />
              </div>
            </div>
          </>
        )}
      </div>

      <a
        href="#features"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/40 hover:text-amber-400 transition-colors animate-bounce"
        aria-label="Scrolla ner"
      >
        <ChevronDown className="w-8 h-8" />
      </a>
    </section>
  );
}
