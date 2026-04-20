import { useState, useMemo } from 'react';
import useFetch from '../hooks/useFetch';
import {
  CloudRain, Wind, Thermometer, MapPin,
  Sun, Cloud, CloudLightning, CloudSnow, CloudFog, WifiOff
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer
} from 'recharts';

const cities = [
  { name: 'Nagpur', lat: 21.1458, lon: 79.0882 },
  { name: 'Pune', lat: 18.5204, lon: 73.8567 },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { name: 'Latur', lat: 18.4088, lon: 76.5604 }
];

// Weather Code Mapping
const weatherCodeMap: Record<number, { label: string; icon: any }> = {
  0: { label: 'Clear Sky', icon: Sun },
  1: { label: 'Mainly Clear', icon: Sun },
  2: { label: 'Partly Cloudy', icon: Cloud },
  3: { label: 'Overcast', icon: Cloud },
  45: { label: 'Fog', icon: CloudFog },
  48: { label: 'Rime Fog', icon: CloudFog },
  51: { label: 'Drizzle', icon: CloudRain },
  61: { label: 'Rain', icon: CloudRain },
  71: { label: 'Snow', icon: CloudSnow },
  95: { label: 'Thunderstorm', icon: CloudLightning }
};

const Weather = () => {
  const [selectedCity, setSelectedCity] = useState(cities[0]);

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current_weather=true&hourly=temperature_2m,apparent_temperature&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;

  const { data: apiData, loading, error } = useFetch<any>(url);

  // Fallback Data
  const mockData = useMemo(() => ({
    current_weather: {
      temperature: 30,
      windspeed: 10,
      weathercode: 0,
      time: new Date().toISOString()
    }
  }), []);

  const data = apiData?.current_weather ? apiData : error ? mockData : null;

  const weatherInfo = data?.current_weather
    ? weatherCodeMap[data.current_weather.weathercode] || { label: 'Unknown', icon: Sun }
    : null;

  const WeatherIcon = weatherInfo?.icon || Sun;

  // Hourly chart data
  const hourlyData = data?.hourly?.time?.slice(0, 12).map((time: string, i: number) => ({
    time: new Date(time).getHours() + ':00',
    temp: data.hourly.temperature_2m[i]
  })) || [];

  const feelsLike = data?.hourly?.apparent_temperature?.[0];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Weather Dashboard</h2>

      {/* City Selector */}
      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', marginBottom: '1rem' }}>
        {cities.map(city => (
          <button
            key={city.name}
            className={`btn ${selectedCity.name === city.name ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedCity(city)}
          >
            <MapPin size={16} /> {city.name}
          </button>
        ))}
      </div>

      {/* Current Weather */}
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        {loading && <p>Loading...</p>}

        {error && !loading && apiData === null && (
          <div style={{ color: '#ef4444' }}>
            <WifiOff size={14} /> Offline Mode
          </div>
        )}

        {data && data.current_weather && !loading && (
          <>
            <WeatherIcon size={70} />
            <h1>{Math.round(data.current_weather.temperature)}°C</h1>
            <p>{weatherInfo?.label}</p>

            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem' }}>
              <div>
                <Wind size={18} />
                <p>{data.current_weather.windspeed} km/h</p>
              </div>
              <div>
                <Thermometer size={18} />
                <p>{Math.round(feelsLike || data.current_weather.temperature)}°C</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Temperature Chart */}
      {hourlyData.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
          <h3>Today's Temperature</h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={hourlyData}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temp" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 7-Day Forecast */}
      {data?.daily && (
        <div className="card" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
          <h3>7-Day Forecast</h3>

          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
            {data.daily.time.map((day: string, i: number) => {
              const weather = weatherCodeMap[data.daily.weathercode[i]] || {};
              const Icon = weather.icon || Sun;

              return (
                <div key={day} style={{ minWidth: '120px', textAlign: 'center' }}>
                  <p>{new Date(day).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  <Icon size={30} />
                  <p>{Math.round(data.daily.temperature_2m_max[i])}°</p>
                  <p style={{ color: '#888' }}>
                    {Math.round(data.daily.temperature_2m_min[i])}°
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;