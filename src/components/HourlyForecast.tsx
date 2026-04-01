import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { type HourForecast, getWeatherIcon } from '@/lib/weatherData';

interface HourlyForecastProps {
  hours: HourForecast[];
}

const HourlyForecast = ({ hours }: HourlyForecastProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll('.hour-item');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, stagger: 0.04, duration: 0.45, ease: 'power2.out', delay: 0.25 }
    );
  }, [hours]);

  return (
    <section ref={sectionRef} className="glass rounded-2xl p-4">
      <p className="text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-3 px-0.5">
        Hourly Forecast
      </p>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {hours.map((hour, i) => (
          <div
            key={i}
            className="hour-item opacity-0 flex flex-col items-center gap-1.5 min-w-[52px] bg-white/5 rounded-xl py-2.5 px-1 hover:bg-white/10 transition-colors cursor-default"
          >
            <span className="text-[11px] text-white/65 font-medium whitespace-nowrap">
              {hour.time}
            </span>
            <span className="text-xl">{getWeatherIcon(hour.condition)}</span>
            <span className="text-sm font-semibold text-white">
              {hour.temp}°
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HourlyForecast;
