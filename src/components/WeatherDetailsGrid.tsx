import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Droplets, Wind, Thermometer, Gauge, Sun, Eye } from 'lucide-react';
import { type WeatherDetails as WeatherDetailsType } from '@/lib/weatherData';

interface WeatherDetailsGridProps {
  details: WeatherDetailsType;
}

const items = [
  { key: 'humidity'   as const, label: 'Humidity',    unit: '%',    icon: Droplets,    color: 'text-blue-300'   },
  { key: 'windSpeed'  as const, label: 'Wind',        unit: ' km/h',icon: Wind,        color: 'text-teal-300'   },
  { key: 'feelsLike'  as const, label: 'Feels Like',  unit: '°',    icon: Thermometer, color: 'text-orange-300' },
  { key: 'pressure'   as const, label: 'Pressure',    unit: ' hPa', icon: Gauge,       color: 'text-purple-300' },
  { key: 'uvIndex'    as const, label: 'UV Index',    unit: '',     icon: Sun,         color: 'text-yellow-300' },
  { key: 'visibility' as const, label: 'Visibility',  unit: ' km',  icon: Eye,         color: 'text-cyan-300'   },
];

const WeatherDetailsGrid = ({ details }: WeatherDetailsGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    gsap.fromTo(
      gridRef.current.querySelectorAll('.detail-card'),
      { opacity: 0, scale: 0.88, y: 14 },
      { opacity: 1, scale: 1, y: 0, stagger: 0.07, duration: 0.45, ease: 'back.out(1.2)', delay: 0.35 }
    );
  }, [details]);

  return (
    <div ref={gridRef} className="grid grid-cols-3 gap-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.key}
            className="detail-card opacity-0 glass rounded-xl p-3 flex flex-col gap-1 hover:scale-[1.03] transition-transform duration-200"
          >
            <div className="flex items-center gap-1.5">
              <Icon className={`w-3.5 h-3.5 ${item.color}`} />
              <span className="text-[10px] font-semibold text-white/45 uppercase tracking-wider">
                {item.label}
              </span>
            </div>
            <p className="text-lg font-bold text-white leading-none">
              {details[item.key]}<span className="text-sm font-normal text-white/60">{item.unit}</span>
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default WeatherDetailsGrid;
