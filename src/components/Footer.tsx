import { Link } from 'react-router-dom';
import { Truck, MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';
import { SITE_CONFIG } from '@/config';

const NAV_LINKS = [
  { to: '/om', label: 'Om' },
  { to: '/program', label: 'Program' },
  { to: '/lastbilar', label: 'Lastbilar' },
  { to: '/artister', label: 'Artister' },
  { to: '/sponsorer', label: 'Sponsorer' },
  { to: '/besok', label: 'Besöksinfo' },
  { to: '/nyheter', label: 'Nyheter' },
  { to: '/karta', label: 'Karta' },
  { to: '/faq', label: 'FAQ' },
  { to: '/biljetter', label: 'Biljetter' },
  { to: '/konto', label: 'Mina sidor' },
];

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-ink-950 border-t border-white/10 pt-20 pb-10 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 rounded-full blur-[120px]" />

      <div className="container-pad relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-diesel-600 flex items-center justify-center">
                <Truck className="w-6 h-6 text-ink-900" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-heading font-bold text-lg tracking-wide text-white">ÅSEDA</span>
                <span className="font-heading font-medium text-xs tracking-[0.2em] text-amber-400">TRUCKMEET</span>
              </div>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-5 max-w-xs">
              {SITE_CONFIG.organization} arrangerar Skandinaviens största lastbilsträff i {SITE_CONFIG.location} –
              alltid helgen efter midsommar. 2026 firar vi 10 år!
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/Asedatruckmeet"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-amber-400 hover:border-amber-500/30 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/asedatruckmeet"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-amber-400 hover:border-amber-500/30 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-amber-400 hover:border-amber-500/30 transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm tracking-[0.15em] text-white uppercase mb-5">
              Navigation
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/50 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/admin"
                  className="text-sm text-white/30 hover:text-amber-400 transition-colors"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm tracking-[0.15em] text-white uppercase mb-5">
              Kontakt
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-white/50 leading-relaxed">
                  {SITE_CONFIG.orgAddress}<br />
                  {SITE_CONFIG.orgZip}
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <a href={`tel:${SITE_CONFIG.orgPhone.replace(/\s/g, '')}`} className="text-sm text-white/50 hover:text-amber-400 transition-colors">
                  {SITE_CONFIG.orgPhone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="text-sm text-white/50 hover:text-amber-400 transition-colors">
                  {SITE_CONFIG.contactEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} {SITE_CONFIG.organization}. Alla rättigheter förbehållna.
          </p>
          <p className="text-xs text-white/40">
            Bokning via <span className="text-amber-400/70">Pretix</span> · Byggt med passion för lastbilar
          </p>
        </div>
      </div>
    </footer>
  );
}
