import PageHeader from '@/components/PageHeader';
import { SITE_CONFIG } from '@/config';
import { Truck, Music, Trophy, Users, Calendar, MapPin } from 'lucide-react';

const FEATURES = [
  { icon: Truck, title: 'Häftiga ekipage', description: 'Se hundratals lastbilar från hela Norden. Rösta fram årets finaste lastbil på plats.' },
  { icon: Music, title: 'Scenunderhållning', description: 'Pipex, Da Buzz, Maskinen, 2 Blyga Läppar, J.O.X och LBSB på scen under helgen.' },
  { icon: Trophy, title: 'Tävlingar & show', description: 'Truck-show, tävlingar och spännande föreläsningar för både stor och liten.' },
  { icon: Users, title: 'Branschutställare', description: 'Möt lokala och nationella företag. Besök branschutställarna och upptäck nyheter.' },
];

const GALLERY_IMAGES = [
  'https://images.pexels.com/photos/28264496/pexels-photo-28264496.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/6563903/pexels-photo-6563903.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/11087837/pexels-photo-11087837.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/34902065/pexels-photo-34902065.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/27508769/pexels-photo-27508769.jpeg?auto=compress&cs=tinysrgb&w=800',
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        badge="Om evenemanget"
        title="10 år av"
        highlight="lastbilsmagi"
        subtitle="Truckmeet i syd ideell förening arrangerar Åseda Truckmeet i Åseda Folkets park – alltid helgen efter midsommar. 2026 firar vi 10 år och kommer erbjuda något alldeles extra!"
      />

      <section className="relative section-pad overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="container-pad relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="glass-card p-7 hover:bg-white/[0.08] hover:border-amber-500/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-amber-400" strokeWidth={2} />
                </div>
                <h3 className="font-heading font-semibold text-lg text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="glass-card p-8 md:p-12 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-heading font-bold text-2xl md:text-3xl text-white mb-4">
                  En tradition sedan 2016
                </h3>
                <p className="text-white/60 leading-relaxed mb-6">
                  Åseda Truckmeet startade som en liten lastbilsträff och har vuxit till ett av
                  Skandinaviens största evenemang för lastbilsentusiaster. Varje år samlas hundratals
                  ekipage och tusentals besökare i Åseda Folkets park för att fira lastbilskulturen.
                </p>
                <p className="text-white/60 leading-relaxed">
                  2026 firar vi 10 år och årets upplaga blir tveklöst den mest maxade någonsin.
                  Pipex, Da Buzz, Maskinen, 2 Blyga Läppar, J.O.X och LBSB på scen under helgen!
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <Calendar className="w-8 h-8 text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-white/40 uppercase tracking-wider">Datum</p>
                    <p className="text-lg font-heading font-semibold text-white">{SITE_CONFIG.dates}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <MapPin className="w-8 h-8 text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-white/40 uppercase tracking-wider">Plats</p>
                    <p className="text-lg font-heading font-semibold text-white">{SITE_CONFIG.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <Users className="w-8 h-8 text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-white/40 uppercase tracking-wider">Arrangör</p>
                    <p className="text-lg font-heading font-semibold text-white">{SITE_CONFIG.organization}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {GALLERY_IMAGES.map((src, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-2xl group ${
                  i === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-auto md:h-full' : 'aspect-square'
                }`}
              >
                <img
                  src={src}
                  alt={`Åseda Truckmeet bild ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
