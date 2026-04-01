import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Star } from 'lucide-react';
import { getWeatherIcon, type WeatherCondition, getGradientClass } from '@/lib/weatherData';

interface FavoriteCitiesProps {
  cities: { city: string; temp: number; condition: WeatherCondition }[];
  onSelect: (city: string) => void;
}

const FavoriteCities = ({ cities, onSelect }: FavoriteCitiesProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelectorAll('.fav-card'),
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.07, duration: 0.45, ease: 'back.out(1.2)', delay: 0.4 }
    );
  }, [cities]);

  if (!cities.length) return null;

  return (
    <section ref={sectionRef}>
      <div className="flex items-center gap-1.5 mb-2 px-0.5">
        <Star className="w-3 h-3 text-yellow-400/80 fill-yellow-400/80" />
        <p className="text-[11px] font-semibold text-white/50 uppercase tracking-widest">
          Favorites
        </p>
      </div>
      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
        {cities.map((c) => (
          <button
            key={c.city}
            onClick={() => onSelect(c.city)}
            className={`fav-card opacity-0 ${getGradientClass(c.condition)} min-w-[120px] rounded-2xl p-3.5 text-left hover:scale-[1.04] active:scale-95 transition-transform duration-200 shadow-lg`}
          >
            <p className="text-sm font-semibold text-white/90 truncate">{c.city}</p>
            <div className="flex items-end justify-between mt-2">
              <span className="text-2xl font-bold text-white">{c.temp}°</span>
              <span className="text-2xl">{getWeatherIcon(c.condition)}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default FavoriteCities;
