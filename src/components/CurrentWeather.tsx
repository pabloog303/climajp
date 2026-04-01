import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { type WeatherCondition } from '@/lib/weatherData';

/* ── Animated SVG weather icons ── */
const WeatherIcon = ({ condition }: { condition: WeatherCondition }) => {
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!iconRef.current) return;
    gsap.fromTo(
      iconRef.current,
      { scale: 0.4, opacity: 0, rotation: -15 },
      { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.6)' }
    );
  }, [condition]);

  const icons: Record<WeatherCondition, string> = {
    sunny:  '☀️',
    cloudy: '⛅',
    rainy:  '🌧️',
    night:  '🌙',
    stormy: '⛈️',
    snowy:  '❄️',
  };

  return (
    <div ref={iconRef} className="text-8xl animate-float select-none">
      {icons[condition]}
    </div>
  );
};

interface CurrentWeatherProps {
  temp: number;
  condition: WeatherCondition;
  description: string;
  high: number;
  low: number;
  feelsLike?: number;
}

const CurrentWeather = ({ temp, condition, description, high, low, feelsLike }: CurrentWeatherProps) => {
  const tempRef     = useRef<HTMLHeadingElement>(null);
  const tempValRef  = useRef<HTMLSpanElement>(null);
  const sectionRef  = useRef<HTMLElement>(null);
  const prevTempRef = useRef(temp);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelectorAll('.weather-item'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.55, ease: 'power2.out', delay: 0.15 }
    );
  }, []);

  // Counter animation when temperature changes
  useEffect(() => {
    if (!tempValRef.current) return;
    const obj = { val: prevTempRef.current };
    gsap.to(obj, {
      val: temp,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate() {
        if (tempValRef.current) {
          tempValRef.current.textContent = String(Math.round(obj.val));
        }
      },
      onComplete() {
        prevTempRef.current = temp;
      },
    });

    // Subtle scale pop on change (skip on first render)
    if (prevTempRef.current !== temp && tempRef.current) {
      gsap.fromTo(tempRef.current, { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'back.out(1.8)' });
    }
  }, [temp]);

  return (
    <section ref={sectionRef} className="flex flex-col items-center py-4">
      <div className="weather-item">
        <WeatherIcon condition={condition} />
      </div>

      <h2
        ref={tempRef}
        className="weather-item text-[88px] font-extralight text-white leading-none tracking-tighter mt-2"
      >
        <span ref={tempValRef}>{temp}</span><span className="text-5xl align-top mt-4 inline-block">°</span>
      </h2>

      <p className="weather-item text-xl font-medium text-white/85 mt-1 capitalize">
        {description}
      </p>

      <div className="weather-item flex gap-4 mt-2 text-sm text-white/65 font-medium">
        <span>↑ {high}°</span>
        <span>↓ {low}°</span>
        {feelsLike !== undefined && <span>Feels {feelsLike}°</span>}
      </div>
    </section>
  );
};

export default CurrentWeather;
