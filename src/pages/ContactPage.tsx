import PageHeader from '@/components/PageHeader';
import { SITE_CONFIG } from '@/config';
import { MapPin, Phone, Mail, Truck, Handshake } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <PageHeader
        badge="Kontakt"
        title="Hör av"
        highlight="dig till oss"
        subtitle="Vill du bli sponsor, branschutställare eller har frågor om evenemanget? Vi finns här för dig."
      />

      <section className="relative section-pad overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="container-pad relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <a
              href={`tel:${SITE_CONFIG.orgPhone.replace(/\s/g, '')}`}
              className="glass-card p-8 hover:border-amber-500/30 hover:bg-white/[0.08] transition-all duration-300 group text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <Phone className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-white mb-2">Telefon</h3>
              <p className="text-white/50">{SITE_CONFIG.orgPhone}</p>
            </a>

            <a
              href={`mailto:${SITE_CONFIG.contactEmail}`}
              className="glass-card p-8 hover:border-amber-500/30 hover:bg-white/[0.08] transition-all duration-300 group text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <Mail className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-white mb-2">E-post</h3>
              <p className="text-white/50 break-all">{SITE_CONFIG.contactEmail}</p>
            </a>

            <div className="glass-card p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
                <MapPin className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-white mb-2">Adress</h3>
              <p className="text-white/50">{SITE_CONFIG.orgAddress}</p>
              <p className="text-white/50">{SITE_CONFIG.orgZip}</p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="glass-card p-8 hover:border-amber-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Handshake className="w-6 h-6 text-amber-400" />
                <h3 className="font-heading font-bold text-xl text-white">Bli sponsor</h3>
              </div>
              <p className="text-white/60 leading-relaxed mb-4">
                Vi behöver alltid fler fantastiska företag som vill vara med och göra det möjligt att
                utveckla Åseda Truckmeet. Kontakta oss för att diskutera sponsormöjligheter.
              </p>
              <a href={`mailto:${SITE_CONFIG.contactEmail}?subject=Sponsor%20Åseda%20Truckmeet`} className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors">
                Skicka e-post <Mail className="w-4 h-4" />
              </a>
            </div>

            <div className="glass-card p-8 hover:border-amber-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="w-6 h-6 text-amber-400" />
                <h3 className="font-heading font-bold text-xl text-white">Bli branschutställare</h3>
              </div>
              <p className="text-white/60 leading-relaxed mb-4">
                Vill ni visa upp ert företag och era produkter? Bli branschutställare och träffa
                tusentals besökare intresserade av lastbilar och transport.
              </p>
              <a href={`mailto:${SITE_CONFIG.contactEmail}?subject=Branschutställare%20Åseda%20Truckmeet`} className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors">
                Skicka e-post <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
