import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import WeatherHeader from '@/components/WeatherHeader';
import CurrentWeather from '@/components/CurrentWeather';
import HourlyForecast from '@/components/HourlyForecast';
import WeeklyForecast from '@/components/WeeklyForecast';
import WeatherDetailsGrid from '@/components/WeatherDetailsGrid';
import SearchBar from '@/components/SearchBar';
import FavoriteCities from '@/components/FavoriteCities';
import { useWeather } from '@/hooks/useWeather';
import { getGradientClass, mockWeatherData, favoriteCities, type WeatherCondition } from '@/lib/weatherData';

/* ── Ambient weather particles ── */
const WeatherParticles = ({ condition }: { condition: WeatherCondition }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Stable deterministic particle data so values don't change on re-render
  const data = useMemo(() => ({
    rain: Array.from({ length: 12 }, (_, i) => ({
      left:  `${((i * 8.3 + 2) % 100).toFixed(1)}%`,
      h:      12 + (i * 3.7 % 18),
      delay:  +(i * 0.17 % 2).toFixed(2),
      dur:    +(0.7 + i * 0.06 % 0.7).toFixed(2),
    })),
    snow: Array.from({ length: 10 }, (_, i) => ({
      left:  `${((i * 10.1 + 1) % 100).toFixed(1)}%`,
      size:   8 + (i * 1.4 % 10),
      delay:  +(i * 0.31 % 3).toFixed(2),
      dur:    +(2 + i * 0.21 % 2).toFixed(2),
    })),
    stars: Array.from({ length: 14 }, (_, i) => ({
      left: `${((i * 7.3 + 3) % 100).toFixed(1)}%`,
      top:  `${((i * 6.1 + 5) % 48).toFixed(1)}%`,
      dur:   1.5 + (i % 5) * 0.4,
      delay: +(i * 0.18 % 2).toFixed(2),
    })),
  }), []);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      if (condition === 'rainy' || condition === 'stormy') {
        gsap.utils.toArray<HTMLElement>('.wp-drop', ref.current!).forEach((el) => {
          gsap.fromTo(el,
            { y: -20, opacity: 0 },
            { y: '110vh', opacity: 0.45, duration: +el.dataset.dur!, delay: +el.dataset.delay!, repeat: -1, ease: 'none' }
          );
        });
      } else if (condition === 'snowy') {
        gsap.utils.toArray<HTMLElement>('.wp-flake', ref.current!).forEach((el) => {
          gsap.fromTo(el,
            { y: -30, x: 0, opacity: 0 },
            { y: '110vh', x: '+=30', opacity: 0.75, duration: +el.dataset.dur!, delay: +el.dataset.delay!, repeat: -1, ease: 'sine.inOut' }
          );
        });
      } else if (condition === 'sunny') {
        gsap.to('.wp-glow', { scale: 1.25, opacity: 0.2, duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      } else if (condition === 'night') {
        gsap.utils.toArray<HTMLElement>('.wp-star', ref.current!).forEach((el) => {
          gsap.to(el, { opacity: 0.85, scale: 1.4, duration: +el.dataset.dur!, delay: +el.dataset.delay!, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        });
      }
    }, ref);
    return () => ctx.revert();
  }, [condition]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {(condition === 'rainy' || condition === 'stormy') && data.rain.map((p, i) => (
        <div key={i} className="wp-drop absolute bg-blue-200/50 rounded-full" style={{ left: p.left, height: p.h, width: 1, top: 0 }} data-delay={p.delay} data-dur={p.dur} />
      ))}
      {condition === 'snowy' && data.snow.map((p, i) => (
        <div key={i} className="wp-flake absolute text-white/70 select-none" style={{ left: p.left, top: 0, fontSize: p.size }} data-delay={p.delay} data-dur={p.dur}>❄</div>
      ))}
      {condition === 'sunny' && (
        <div className="wp-glow absolute top-0 right-0 w-80 h-80 rounded-full opacity-[0.12]" style={{ background: 'radial-gradient(circle, #ffd700 0%, #ff8c00 45%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
      )}
      {condition === 'night' && data.stars.map((s, i) => (
        <div key={i} className="wp-star absolute w-1 h-1 bg-white rounded-full opacity-20" style={{ left: s.left, top: s.top }} data-dur={s.dur} data-delay={s.delay} />
      ))}
    </div>
  );
};

/* ── Skeleton loader ── */
const SkeletonPulse = ({ className }: { className: string }) => (
  <div className={`skeleton rounded-xl ${className}`} />
);

const LoadingScreen = () => (
  <div className="weather-gradient-night h-screen flex flex-col">
    <div className="flex-1 max-w-md w-full mx-auto px-4 py-5 flex flex-col gap-3 overflow-hidden">
      <div className="flex justify-between items-center">
        <div className="space-y-1.5">
          <SkeletonPulse className="h-5 w-36" />
          <SkeletonPulse className="h-3.5 w-24" />
        </div>
        <SkeletonPulse className="h-9 w-9 rounded-full" />
      </div>
      <SkeletonPulse className="h-11" />
      <div className="flex flex-col items-center gap-2 py-4">
        <SkeletonPulse className="h-20 w-20 rounded-full" />
        <SkeletonPulse className="h-16 w-32" />
        <SkeletonPulse className="h-5 w-24" />
      </div>
      <SkeletonPulse className="h-24" />
      <SkeletonPulse className="h-36" />
      <div className="grid grid-cols-3 gap-2">
        {[...Array(6)].map((_, i) => <SkeletonPulse key={i} className="h-16" />)}
      </div>
    </div>
  </div>
);

/* ── Main page ── */
const Index = () => {
  const { weather, isLoading, error, refetch, fetchByCity } = useWeather();
  const bgRef      = useRef<HTMLDivElement>(null);
  const prevCond   = useRef('');
  const contentRef = useRef<HTMLDivElement>(null);

  const displayWeather = weather || mockWeatherData;
  const initialLoadDone = useRef(false);

  /* Mark when first real data arrives */
  useEffect(() => {
    if (weather && !initialLoadDone.current) {
      initialLoadDone.current = true;
    }
  }, [weather]);

  /* Dim/restore content while re-fetching an already-loaded city */
  useEffect(() => {
    if (!contentRef.current || !initialLoadDone.current) return;
    if (isLoading) {
      gsap.to(contentRef.current, { opacity: 0.45, scale: 0.985, duration: 0.3, ease: 'power2.in' });
    } else {
      gsap.to(contentRef.current, { opacity: 1, scale: 1, duration: 0.55, ease: 'power2.out' });
    }
  }, [isLoading]);

  /* Anima cambio de fondo cuando cambia la condición */
  useEffect(() => {
    if (!bgRef.current) return;
    if (prevCond.current === displayWeather.condition) return;
    prevCond.current = displayWeather.condition;

    gsap.fromTo(
      bgRef.current,
      { opacity: 0.3 },
      { opacity: 1, duration: 1.2, ease: 'power2.inOut' }
    );
  }, [displayWeather.condition]);

  /* Anima entrada del contenido al montar */
  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(
      contentRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
  }, []);

  if (isLoading && !weather) return <LoadingScreen />;

  return (
    <div
      ref={bgRef}
      className={`${getGradientClass(displayWeather.condition)} relative h-screen flex flex-col transition-none`}
    >
      <WeatherParticles condition={displayWeather.condition} />

      {/* Error banner */}
      {error && (
        <div className="bg-yellow-500/20 border-b border-yellow-400/20 px-4 py-1.5 text-center shrink-0">
          <p className="text-yellow-200 text-xs">⚠️ Demo data — {error}</p>
        </div>
      )}

      {/* Scrollable content */}
      <div
        ref={contentRef}
        className="relative flex-1 overflow-y-auto overscroll-none z-10"
        style={{ opacity: 0 }}
      >
        <div className="max-w-md mx-auto px-4 py-5 flex flex-col gap-3 pb-6">

          {/* Header */}
          <WeatherHeader
            city={displayWeather.city}
            country={displayWeather.country}
            isLoading={isLoading}
            onRefresh={refetch}
          />

          {/* Search */}
          <SearchBar onSelectCity={fetchByCity} />

          {/* Main temp + icon */}
          <CurrentWeather
            temp={displayWeather.temp}
            condition={displayWeather.condition}
            description={displayWeather.description}
            high={displayWeather.high}
            low={displayWeather.low}
            feelsLike={displayWeather.details.feelsLike}
          />

          {/* Hourly */}
          <HourlyForecast hours={displayWeather.hourly} />

          {/* Weekly */}
          <WeeklyForecast days={displayWeather.weekly} />

          {/* Details grid */}
          <WeatherDetailsGrid details={displayWeather.details} />

          {/* Favorites */}
          <FavoriteCities cities={favoriteCities} onSelect={fetchByCity} />

        </div>
      </div>
    </div>
  );
};

export default Index;
