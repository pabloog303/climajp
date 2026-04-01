// OpenWeather API Configuration
// Get your API key from: https://openweathermap.org/api

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export interface GeoLocation {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface OpenWeatherCurrent {
  coord: { lon: number; lat: number };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: { speed: number; deg: number };
  clouds: { all: number };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  name: string;
}

export interface OpenWeatherForecast {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: { all: number };
    wind: { speed: number; deg: number };
    visibility: number;
    pop: number;
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

// Search cities by name
export async function searchCities(query: string): Promise<GeoLocation[]> {
  if (!query || query.length < 2) return [];
  
  const response = await fetch(
    `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to search cities');
  }
  
  return response.json();
}

// Get current weather by coordinates
export async function getCurrentWeather(lat: number, lon: number): Promise<OpenWeatherCurrent> {
  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch current weather');
  }
  
  return response.json();
}

// Get current weather by city name
export async function getCurrentWeatherByCity(city: string): Promise<OpenWeatherCurrent> {
  const response = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch weather for city');
  }
  
  return response.json();
}

// Get 5-day forecast (3-hour intervals)
export async function getForecast(lat: number, lon: number): Promise<OpenWeatherForecast> {
  const response = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch forecast');
  }
  
  return response.json();
}

// Get user's current location
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    });
  });
}

// Map OpenWeather icon codes to our weather conditions
export function mapWeatherCondition(iconCode: string): 'sunny' | 'cloudy' | 'rainy' | 'night' | 'stormy' | 'snowy' {
  const code = iconCode.slice(0, 2);
  const isNight = iconCode.endsWith('n');
  
  switch (code) {
    case '01': // clear sky
      return isNight ? 'night' : 'sunny';
    case '02': // few clouds
    case '03': // scattered clouds
    case '04': // broken/overcast clouds
      return isNight ? 'night' : 'cloudy';
    case '09': // shower rain
    case '10': // rain
      return 'rainy';
    case '11': // thunderstorm
      return 'stormy';
    case '13': // snow
      return 'snowy';
    case '50': // mist/fog
      return 'cloudy';
    default:
      return isNight ? 'night' : 'sunny';
  }
}

// Format Unix timestamp to readable time
export function formatTime(timestamp: number, timezone: number): string {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
    timeZone: 'UTC',
  });
}

// Format Unix timestamp to day name
export function formatDay(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

// Get weather icon URL from OpenWeather
export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
