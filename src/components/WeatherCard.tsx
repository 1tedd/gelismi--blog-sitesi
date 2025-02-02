import React, { useEffect, useState } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, Wind, Droplets } from 'lucide-react';

interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

export function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=38.4189&longitude=27.1287&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto'
        );
        if (!response.ok) throw new Error('Weather data not available');
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError('Could not load weather data');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherTheme = (code: number) => {
    if (code === 0 || code === 1) return {
      bg: 'from-yellow-400 to-orange-500',
      icon: <Sun className="w-8 h-8 text-yellow-100 animate-spin-slow" />,
      iconBg: 'bg-yellow-400',
      text: 'text-yellow-100'
    };
    if (code === 2) return {
      bg: 'from-blue-400 to-blue-600',
      icon: <Cloud className="w-8 h-8 text-white animate-bounce-slow" />,
      iconBg: 'bg-blue-400',
      text: 'text-white'
    };
    if (code === 3) return {
      bg: 'from-gray-400 to-gray-600',
      icon: <Cloud className="w-8 h-8 text-white animate-pulse" />,
      iconBg: 'bg-gray-500',
      text: 'text-white'
    };
    if (code >= 51 && code <= 67) return {
      bg: 'from-blue-300 to-blue-500',
      icon: <CloudDrizzle className="w-8 h-8 text-blue-100 animate-drizzle" />,
      iconBg: 'bg-blue-400',
      text: 'text-blue-100'
    };
    if (code >= 71 && code <= 77) return {
      bg: 'from-blue-200 to-blue-400',
      icon: <CloudSnow className="w-8 h-8 text-white animate-snow" />,
      iconBg: 'bg-blue-300',
      text: 'text-white'
    };
    if (code >= 80 && code <= 82) return {
      bg: 'from-blue-600 to-blue-800',
      icon: <CloudRain className="w-8 h-8 text-blue-200 animate-rain" />,
      iconBg: 'bg-blue-600',
      text: 'text-blue-200'
    };
    if (code >= 95 && code <= 99) return {
      bg: 'from-purple-600 to-purple-800',
      icon: <CloudLightning className="w-8 h-8 text-yellow-300 animate-lightning" />,
      iconBg: 'bg-purple-600',
      text: 'text-yellow-300'
    };
    return {
      bg: 'from-gray-400 to-gray-600',
      icon: <Wind className="w-8 h-8 text-white animate-pulse" />,
      iconBg: 'bg-gray-500',
      text: 'text-white'
    };
  };

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 w-16 h-16 rounded-full bg-gray-100 animate-pulse" />
    );
  }

  if (error || !weather) {
    return null;
  }

  const theme = getWeatherTheme(weather.current.weather_code);

  return (
    <div
      className="fixed bottom-4 right-4 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          relative overflow-hidden transition-all duration-300 ease-in-out shadow-lg
          ${isHovered ? 'w-64 h-40 rounded-2xl scale-110' : 'w-16 h-16 rounded-full scale-100'}
          bg-gradient-to-br ${theme.bg}
        `}
      >
        {/* Animated Background Effects */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`
                absolute w-2 h-2 rounded-full bg-white
                animate-float-${(i % 5) + 1}
              `}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>

        {/* Compact View */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
          <div className="text-2xl font-bold text-white">
            {Math.round(weather.current.temperature_2m)}°
          </div>
        </div>

        {/* Expanded View */}
        <div className={`absolute inset-0 p-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-white/80">İzmir</div>
              <div className="text-3xl font-bold text-white">
                {Math.round(weather.current.temperature_2m)}°C
              </div>
              <div className="text-sm text-white/80 mt-1">
                {Math.round(weather.daily.temperature_2m_min[0])}° / {Math.round(weather.daily.temperature_2m_max[0])}°
              </div>
            </div>
            <div className={`p-2 rounded-full ${theme.iconBg} shadow-lg animate-bounce-slow`}>
              {theme.icon}
            </div>
          </div>
          <div className="absolute bottom-3 left-4 right-4 flex justify-between text-xs text-white/80">
            <div className="flex items-center gap-1">
              <Wind className="w-3 h-3" />
              {Math.round(weather.current.wind_speed_10m)} km/h
            </div>
            <div className="flex items-center gap-1">
              <Droplets className="w-3 h-3" />
              {Math.round(weather.current.relative_humidity_2m)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}