import { useEffect, useRef } from 'react';
import { MapPin, RefreshCw, Loader2 } from 'lucide-react';
import gsap from 'gsap';

interface WeatherHeaderProps {
  city: string;
  country: string;
  isLoading?: boolean;
  onRefresh?: () => void;
}

const WeatherHeader = ({ city, country, isLoading = false, onRefresh }: WeatherHeaderProps) => {
  const headerRef = useRef<HTMLElement>(null);
  const cityRef   = useRef<HTMLHeadingElement>(null);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Entrada inicial
  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
    );
  }, []);

  // Anima el cambio de ciudad
  useEffect(() => {
    if (!cityRef.current) return;
    gsap.fromTo(
      cityRef.current,
      { opacity: 0, x: -12 },
      { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out' }
    );
  }, [city]);

  return (
    <header ref={headerRef} className="flex items-center justify-between px-1 opacity-0">
      <div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-white/80" />
          <h1
            ref={cityRef}
            className="text-lg font-semibold text-white tracking-tight"
          >
            {city}{country ? `, ${country}` : ''}
          </h1>
        </div>
        <p className="text-sm text-white/55 mt-0.5">{today}</p>
      </div>

      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="p-2 rounded-full glass transition-all duration-200 hover:scale-110 active:scale-90 disabled:opacity-50"
      >
        {isLoading
          ? <Loader2 className="w-4 h-4 text-white/80 animate-spin" />
          : <RefreshCw className="w-4 h-4 text-white/80" />
        }
      </button>
    </header>
  );
};

export default WeatherHeader;
