import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import {
  Truck, LogOut, LayoutGrid, Music, Crown,
  Calendar, Settings, BarChart3, X, Menu,
  FileText, Map, Vote, Ticket, Newspaper, Image, Film,
} from 'lucide-react';
import { useState } from 'react';

export type AdminTab = 'dashboard' | 'events' | 'sponsors' | 'artists' | 'settings' | 'cms' | 'trucks' | 'orders' | 'map' | 'vote';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: AdminTab;
}

const NAV_ITEMS: { id: AdminTab; label: string; icon: typeof Truck; path: string }[] = [
  { id: 'dashboard', label: 'Översikt', icon: BarChart3, path: '/admin' },
  { id: 'events', label: 'Event', icon: Calendar, path: '/admin/event' },
  { id: 'orders', label: 'Beställningar', icon: Ticket, path: '/admin/bestallningar' },
  { id: 'trucks', label: 'Lastbilar', icon: Truck, path: '/admin/lastbilar' },
  { id: 'vote', label: 'Publikens val', icon: Vote, path: '/admin/rostning' },
  { id: 'sponsors', label: 'Sponsorer', icon: Crown, path: '/admin/sponsorer' },
  { id: 'artists', label: 'Artister', icon: Music, path: '/admin/artister' },
  { id: 'cms', label: 'Innehåll', icon: FileText, path: '/admin/innehall' },
  { id: 'map', label: 'Karta & QR', icon: Map, path: '/admin/karta' },
  { id: 'settings', label: 'Webbplats', icon: Settings, path: '/admin/installningar' },
];

export default function AdminLayout({ children, activeTab }: AdminLayoutProps) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const scrollableNav = ['cms', 'trucks', 'orders', 'map', 'vote'];

  const NavContent = () => (
    <>
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-diesel-600 flex items-center justify-center flex-shrink-0">
          <Truck className="w-6 h-6 text-ink-900" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <h1 className="font-heading font-bold text-lg text-white truncate">Admin</h1>
          <p className="text-xs text-white/40 truncate">{user?.email}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => setMobileNavOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 pt-4 border-t border-white/10 mt-4">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
        >
          <LayoutGrid className="w-4 h-4" />
          Visa hemsidan
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-red-400 hover:bg-white/5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logga ut
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-ink-900 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-ink-950 border-r border-white/10 p-4 sticky top-0 h-screen">
        <NavContent />
      </aside>

      {/* Mobile nav */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-ink-950 border-r border-white/10 p-4 flex flex-col">
            <button
              onClick={() => setMobileNavOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <NavContent />
          </div>
          <div
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile header */}
        <header className="md:hidden bg-ink-950 border-b border-white/10 sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="text-white p-2"
            aria-label="Meny"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-heading font-bold text-white">Admin</span>
          <div className="w-10" />
        </header>

        <div className="container-pad py-8 max-w-6xl">
          {children}
        </div>
      </div>
    </div>
  );
}
