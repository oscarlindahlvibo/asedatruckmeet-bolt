import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import { useTrucks } from '@/hooks/useCms';
import { Loader2, Search, Truck as TruckIcon } from 'lucide-react';

const BRANDS = ['Scania', 'Volvo', 'Mercedes-Benz', 'MAN', 'DAF', 'Iveco', 'Renault', 'Andra'];
const SORTS = [
  { value: 'recent', label: 'Senast anmälda' },
  { value: 'name', label: 'Namn' },
  { value: 'number', label: 'Trucknummer' },
];

export default function TrucksPage() {
  const { trucks, loading } = useTrucks();
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState<string>('');
  const [sort, setSort] = useState('recent');

  const filtered = useMemo(() => {
    let result = [...trucks];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.company.toLowerCase().includes(q) ||
        t.model.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.truck_number.toLowerCase().includes(q)
      );
    }
    if (brandFilter) {
      if (brandFilter === 'Andra') {
        result = result.filter(t => !['Scania', 'Volvo', 'Mercedes-Benz', 'MAN', 'DAF', 'Iveco', 'Renault'].includes(t.brand));
      } else {
        result = result.filter(t => t.brand === brandFilter);
      }
    }
    if (sort === 'name') result.sort((a, b) => a.company.localeCompare(b.company));
    else if (sort === 'number') result.sort((a, b) => a.truck_number.localeCompare(b.truck_number));
    return result;
  }, [trucks, search, brandFilter, sort]);

  return (
    <>
      <PageHeader
        badge="Lastbilar"
        title="Anmälda"
        highlight="lastbilar"
        subtitle="Bläddra bland de imponerande ekipagen anmälda till Åseda Truckmeet."
      />

      <section className="relative section-pad overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="container-pad relative z-10">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Sök åkeri, modell, ort, trucknummer..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all"
              />
            </div>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none transition-all"
            >
              <option value="" className="bg-ink-900">Alla märken</option>
              {BRANDS.map((b) => (
                <option key={b} value={b} className="bg-ink-900">{b}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none transition-all"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value} className="bg-ink-900">{s.label}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-white/40 py-12">
              {trucks.length === 0 ? 'Inga lastbilar anmälda ännu.' : 'Inga resultat för din sökning.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((truck) => (
                <Link
                  key={truck.id}
                  to={`/lastbilar/${truck.id}`}
                  className="glass-card overflow-hidden hover:border-amber-500/30 hover:bg-white/[0.08] transition-all duration-300 group"
                >
                  {truck.main_image_url ? (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={truck.main_image_url}
                        alt={`${truck.company} ${truck.model}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-white/5 flex items-center justify-center">
                      <TruckIcon className="w-16 h-16 text-white/20" />
                    </div>
                  )}
                  <div className="p-5">
                    {truck.truck_number && (
                      <span className="inline-block px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-xs font-bold mb-2">
                        {truck.truck_number}
                      </span>
                    )}
                    <h3 className="font-heading font-bold text-lg text-white mb-1 group-hover:text-amber-400 transition-colors">
                      {truck.company || truck.driver_name}
                    </h3>
                    <p className="text-sm text-white/50">
                      {truck.brand} {truck.model}
                    </p>
                    {truck.city && (
                      <p className="text-xs text-white/30 mt-1">{truck.city}, {truck.country || 'Sverige'}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
