# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # Type-check + build for production (tsc && vite build)
npm run preview   # Preview production build locally
```

No test runner is configured (vitest.config.ts and playwright.config.ts exist but are empty).

## Environment Variables

Create a `.env` file at the project root:

```
VITE_OPENWEATHER_API_KEY=your_key_here
```

Get a free key at https://openweathermap.org/api. Without it, the app falls back to `mockWeatherData` from `src/lib/weatherData.ts`.

## Architecture

**Stack:** React 18 + TypeScript + Vite, styled with Tailwind CSS. UI primitives come from shadcn/ui (Radix UI base). Animations via GSAP (`@gsap/react`) and Framer Motion.

**Path alias:** `@/` maps to `src/`.

### Data flow

```
OpenWeather API
    ↓
src/lib/api.ts          — raw fetch functions + type definitions (GeoLocation, OpenWeatherCurrent, OpenWeatherForecast)
    ↓
src/hooks/useWeather.ts — transforms API data into CityWeather shape, manages loading/error state,
                          exposes fetchByCity / fetchByCoords / refetch
    ↓
src/pages/Index.tsx     — single page that consumes useWeather, drives GSAP background transition
                          on weather condition change, falls back to mockWeatherData while loading
```

### Key types (`src/lib/weatherData.ts`)

- `WeatherCondition` — `'sunny' | 'cloudy' | 'rainy' | 'night' | 'stormy' | 'snowy'`
- `CityWeather` — top-level shape consumed by all components (city, temp, condition, details, hourly[], weekly[])

### Components (`src/components/`)

Feature components at root level: `CurrentWeather`, `HourlyForecast`, `WeeklyForecast`, `WeatherDetailsGrid`, `WeatherHeader`, `SearchBar`, `FavoriteCities`, `NavLink`.

`src/components/ui/` contains shadcn/ui primitives — do not hand-edit these.

### Routing

React Router v6 with two routes: `/` → `Index`, `*` → `NotFound`.

### Styling conventions

- Dynamic background gradients driven by `WeatherCondition` via `getGradientClass()` from `src/lib/weatherData.ts`.
- Skeleton loaders are inline in `Index.tsx` (`SkeletonPulse` / `LoadingScreen`).
- Tailwind config lives in `tailwind.config.ts`; PostCSS in `postcss.config.js`.
