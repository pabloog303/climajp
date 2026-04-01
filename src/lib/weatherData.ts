export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'night' | 'stormy' | 'snowy';

export interface HourForecast {
  time: string;
  temp: number;
  condition: WeatherCondition;
}

export interface DayForecast {
  day: string;
  min: number;
  max: number;
  condition: WeatherCondition;
}

export interface WeatherDetails {
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  pressure: number;
  uvIndex: number;
  visibility: number;
}

export interface CityWeather {
  city: string;
  country: string;
  temp: number;
  condition: WeatherCondition;
  high: number;
  low: number;
  description: string;
  details: WeatherDetails;
  hourly: HourForecast[];
  weekly: DayForecast[];
}

const conditionIcons: Record<WeatherCondition, string> = {
  sunny: '☀️',
  cloudy: '⛅',
  rainy: '🌧️',
  night: '🌙',
  stormy: '⛈️',
  snowy: '🌨️',
};

export const getWeatherIcon = (condition: WeatherCondition) => conditionIcons[condition];

export const getGradientClass = (condition: WeatherCondition) => {
  const map: Record<WeatherCondition, string> = {
    sunny: 'weather-gradient-sunny',
    cloudy: 'weather-gradient-cloudy',
    rainy: 'weather-gradient-rainy',
    night: 'weather-gradient-night',
    stormy: 'weather-gradient-stormy',
    snowy: 'weather-gradient-snowy',
  };
  return map[condition];
};

export const mockWeatherData: CityWeather = {
  city: 'San Francisco',
  country: 'US',
  temp: 22,
  condition: 'sunny',
  high: 25,
  low: 16,
  description: 'Clear skies',
  details: {
    humidity: 62,
    windSpeed: 14,
    feelsLike: 21,
    pressure: 1013,
    uvIndex: 6,
    visibility: 16,
  },
  hourly: [
    { time: 'Now', temp: 22, condition: 'sunny' },
    { time: '1 PM', temp: 23, condition: 'sunny' },
    { time: '2 PM', temp: 24, condition: 'sunny' },
    { time: '3 PM', temp: 25, condition: 'sunny' },
    { time: '4 PM', temp: 24, condition: 'cloudy' },
    { time: '5 PM', temp: 23, condition: 'cloudy' },
    { time: '6 PM', temp: 21, condition: 'cloudy' },
    { time: '7 PM', temp: 20, condition: 'night' },
    { time: '8 PM', temp: 19, condition: 'night' },
    { time: '9 PM', temp: 18, condition: 'night' },
    { time: '10 PM', temp: 17, condition: 'night' },
    { time: '11 PM', temp: 16, condition: 'night' },
  ],
  weekly: [
    { day: 'Today', min: 16, max: 25, condition: 'sunny' },
    { day: 'Tue', min: 15, max: 23, condition: 'cloudy' },
    { day: 'Wed', min: 14, max: 20, condition: 'rainy' },
    { day: 'Thu', min: 13, max: 19, condition: 'rainy' },
    { day: 'Fri', min: 15, max: 22, condition: 'cloudy' },
    { day: 'Sat', min: 17, max: 26, condition: 'sunny' },
    { day: 'Sun', min: 18, max: 27, condition: 'sunny' },
  ],
};

export const citySuggestions = [
  'San Francisco', 'New York', 'London', 'Tokyo', 'Paris',
  'Sydney', 'Berlin', 'Toronto', 'Dubai', 'Singapore',
  'Los Angeles', 'Chicago', 'Miami', 'Seattle', 'Boston',
];

export const favoriteCities: { city: string; temp: number; condition: WeatherCondition }[] = [
  { city: 'New York', temp: 18, condition: 'cloudy' },
  { city: 'London', temp: 14, condition: 'rainy' },
  { city: 'Tokyo', temp: 26, condition: 'sunny' },
  { city: 'Paris', temp: 16, condition: 'cloudy' },
];
