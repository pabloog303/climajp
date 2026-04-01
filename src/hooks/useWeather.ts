import { useState, useEffect, useCallback } from 'react';
import {
  getCurrentWeather,
  getForecast,
  getCurrentPosition,
  mapWeatherCondition,
  formatTime,
  formatDay,
  type OpenWeatherCurrent,
  type OpenWeatherForecast,
} from '@/lib/api';
import type { CityWeather, HourForecast, DayForecast, WeatherCondition } from '@/lib/weatherData';

interface UseWeatherReturn {
  weather: CityWeather | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  fetchByCity: (city: string) => void;
  fetchByCoords: (lat: number, lon: number) => void;
}

// Transform OpenWeather API data to our app format
function transformWeatherData(
  current: OpenWeatherCurrent,
  forecast: OpenWeatherForecast
): CityWeather {
  const timezone = current.timezone;
  
  // Get hourly forecast (next 12 hours from 3-hour intervals)
  const hourly: HourForecast[] = forecast.list.slice(0, 12).map((item, index) => ({
    time: index === 0 ? 'Now' : formatTime(item.dt, timezone),
    temp: Math.round(item.main.temp),
    condition: mapWeatherCondition(item.weather[0].icon) as WeatherCondition,
  }));

  // Get daily forecast (group by day and get min/max)
  const dailyMap = new Map<string, { temps: number[]; condition: WeatherCondition; dt: number }>();
  
  forecast.list.forEach((item) => {
    const dayKey = formatDay(item.dt);
    const existing = dailyMap.get(dayKey);
    
    if (existing) {
      existing.temps.push(item.main.temp);
    } else {
      dailyMap.set(dayKey, {
        temps: [item.main.temp],
        condition: mapWeatherCondition(item.weather[0].icon),
        dt: item.dt,
      });
    }
  });

  const weekly: DayForecast[] = Array.from(dailyMap.entries())
    .slice(0, 7)
    .map(([day, data]) => ({
      day,
      min: Math.round(Math.min(...data.temps)),
      max: Math.round(Math.max(...data.temps)),
      condition: data.condition,
    }));

  return {
    city: current.name,
    country: current.sys.country,
    temp: Math.round(current.main.temp),
    condition: mapWeatherCondition(current.weather[0].icon),
    high: Math.round(current.main.temp_max),
    low: Math.round(current.main.temp_min),
    description: current.weather[0].description,
    details: {
      humidity: current.main.humidity,
      windSpeed: Math.round(current.wind.speed * 3.6), // m/s to km/h
      feelsLike: Math.round(current.main.feels_like),
      pressure: current.main.pressure,
      uvIndex: 0, // Not available in free API
      visibility: Math.round(current.visibility / 1000), // meters to km
    },
    hourly,
    weekly,
  };
}

export function useWeather(initialCity?: string): UseWeatherReturn {
  const [weather, setWeather] = useState<CityWeather | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  const fetchWeatherData = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [current, forecast] = await Promise.all([
        getCurrentWeather(lat, lon),
        getForecast(lat, lon),
      ]);
      
      const transformedData = transformWeatherData(current, forecast);
      setWeather(transformedData);
      setCoords({ lat, lon });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchByCity = useCallback(async (city: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First get coordinates for the city
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
      );
      const locations = await response.json();
      
      if (locations.length === 0) {
        throw new Error('City not found');
      }
      
      const { lat, lon } = locations[0];
      await fetchWeatherData(lat, lon);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setIsLoading(false);
    }
  }, [fetchWeatherData]);

  const fetchByCoords = useCallback((lat: number, lon: number) => {
    fetchWeatherData(lat, lon);
  }, [fetchWeatherData]);

  const refetch = useCallback(() => {
    if (coords) {
      fetchWeatherData(coords.lat, coords.lon);
    }
  }, [coords, fetchWeatherData]);

  // Initial fetch - try geolocation first, then fall back to initial city
  useEffect(() => {
    const initFetch = async () => {
      try {
        const position = await getCurrentPosition();
        await fetchWeatherData(position.coords.latitude, position.coords.longitude);
      } catch {
        // Geolocation failed, use initial city or default
        if (initialCity) {
          fetchByCity(initialCity);
        } else {
          fetchByCity('Madrid'); // Default city
        }
      }
    };

    initFetch();
  }, []);

  return {
    weather,
    isLoading,
    error,
    refetch,
    fetchByCity,
    fetchByCoords,
  };
}
