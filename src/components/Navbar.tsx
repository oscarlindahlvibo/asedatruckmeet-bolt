import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Ticket } from 'lucide-react';

const NAV_LINKS = [
  { to: '/om', label: 'Om' },
  { to: '/program', label: 'Program' },
  { to: '/lastbilar', label: 'Lastbilar' },
  { to: '/artister', label: 'Artister' },
  { to: '/sponsorer', label: 'Sponsorer' },
  { to: '/besok', label: 'Besök' },
  { to: '/nyheter', label: 'Nyheter' },
  { to: '/karta', label: 'Karta' },
  { to: '/faq', label: 'FAQ' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === '/';
  const solidBg = scrolled || !isHome;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        solidBg
          ? 'bg-ink-950/90 backdrop-blur-xl border-b border-white/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="container-pad flex items-center justify-between">
        <Link to="/" className="flex items-center group" aria-label="Åseda Truckmeet">
          <img
            src="/ÅTM_LOGO_Svart.png"
            alt="Åseda Truckmeet"
            className="h-11 md:h-12 w-auto brightness-0 invert transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 relative group ${
                  isActive ? 'text-amber-400' : 'text-white/70 hover:text-amber-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-amber-400 transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
          <Link to="/biljetter" className="btn-primary text-xs px-5 py-2.5">
            <Ticket className="w-4 h-4" />
            Köp biljetter
          </Link>
        </div>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Meny"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-ink-950/95 backdrop-blur-xl border-b border-white/10 animate-slide-down">
          <div className="container-pad py-6 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-base font-medium transition-colors ${
                    isActive ? 'text-amber-400' : 'text-white/80 hover:text-amber-400'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/biljetter" className="btn-primary mt-2">
              <Ticket className="w-4 h-4" />
              Köp biljetter
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
