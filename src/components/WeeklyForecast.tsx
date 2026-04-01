import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { type DayForecast, getWeatherIcon } from '@/lib/weatherData';

interface WeeklyForecastProps {
  days: DayForecast[];
}

const WeeklyForecast = ({ days }: WeeklyForecastProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  const maxTemp = Math.max(...days.map(d => d.max));
  const minTemp = Math.min(...days.map(d => d.min));
  const range   = maxTemp - minTemp || 1;

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelectorAll('.day-row'),
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, stagger: 0.06, duration: 0.4, ease: 'power2.out', delay: 0.3 }
    );
  }, [days]);

  return (
    <section ref={sectionRef} className="glass rounded-2xl p-4">
      <p className="text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-2 px-0.5">
        7-Day Forecast
      </p>
      <div>
        {days.map((day, i) => {
          const leftPct  = ((day.min - minTemp) / range) * 100;
          const widthPct = Math.max(((day.max - day.min) / range) * 100, 10);
          return (
            <div
              key={day.day + i}
              className="day-row opacity-0 flex items-center gap-2 py-2 border-b border-white/5 last:border-0"
            >
              <span className="text-sm font-medium text-white/75 w-9 shrink-0">{day.day}</span>
              <span className="text-lg w-7 text-center shrink-0">{getWeatherIcon(day.condition)}</span>
              <span className="text-xs text-white/45 w-7 text-right shrink-0">{day.min}°</span>
              <div className="flex-1 h-1 bg-white/10 rounded-full relative mx-1">
                <div
                  className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 to-orange-400"
                  style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-white w-7 shrink-0">{day.max}°</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WeeklyForecast;
