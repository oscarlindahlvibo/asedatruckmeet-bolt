interface SponsorLogoProps {
  name: string;
  logo: string;
  height?: string;
  textSize?: string;
  className?: string;
}

export default function SponsorLogo({ name, logo, height = 'h-16', textSize = 'text-lg', className = '' }: SponsorLogoProps) {
  if (logo) {
    return (
      <img
        src={logo}
        alt={name}
        className={`${height} w-auto object-contain ${className}`}
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.style.display = 'none';
          const fallback = img.nextElementSibling;
          if (fallback) fallback.classList.remove('hidden');
        }}
      />
    );
  }
  return (
    <span className={`font-heading font-bold text-ink-900 ${textSize} ${className}`}>
      {name}
    </span>
  );
}
