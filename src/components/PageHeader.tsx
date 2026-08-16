import { Truck } from 'lucide-react';

interface PageHeaderProps {
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
}

export default function PageHeader({ badge, title, highlight, subtitle }: PageHeaderProps) {
  return (
    <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-[120px]" />
      <div className="container-pad relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 backdrop-blur-sm mb-6">
          <Truck className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium text-amber-400 tracking-wide">{badge}</span>
        </div>
        <h1 className="font-heading font-bold text-4xl md:text-6xl text-white leading-tight mb-5">
          {title} <span className="text-gradient-amber">{highlight}</span>
        </h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
      </div>
    </section>
  );
}
