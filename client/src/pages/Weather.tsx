import { useState, useMemo } from 'react';
import useFetch from '../hooks/useFetch';
import { CloudRain, Wind, Thermometer, MapPin, Sun, Cloud, CloudLightning, CloudSnow, CloudFog, WifiOff } from 'lucide-react';

const cities = [
  { name: 'Nagpur', lat: 21.1458, lon: 79.0882 },
  { name: 'Pune', lat: 18.5204, lon: 73.8567 },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { name: 'Latur', lat: 18.4088, lon: 76.5604 }
];

// WMO Weather Interpretation Codes (WW)
const weatherCodeMap: Record<number, { label: string; icon: any }> = {
  0: { label: 'Clear Sky', icon: Sun },
  1: { label: 'Mainly Clear', icon: Sun },
  2: { label: 'Partly Cloudy', icon: Cloud },
  3: { label: 'Overcast', icon: Cloud },
  45: { label: 'Fog', icon: CloudFog },
  48: { label: 'Depositing Rime Fog', icon: CloudFog },
  51: { label: 'Light Drizzle', icon: CloudRain },
  53: { label: 'Moderate Drizzle', icon: CloudRain },
  55: { label: 'Dense Drizzle', icon: CloudRain },
  56: { label: 'Light Freezing Drizzle', icon: CloudSnow },
  57: { label: 'Dense Freezing Drizzle', icon: CloudSnow },
  61: { label: 'Slight Rain', icon: CloudRain },
  63: { label: 'Moderate Rain', icon: CloudRain },
  65: { label: 'Heavy Rain', icon: CloudRain },
  66: { label: 'Light Freezing Rain', icon: CloudSnow },
  67: { label: 'Heavy Freezing Rain', icon: CloudSnow },
  71: { label: 'Slight Snow Fall', icon: CloudSnow },
  73: { label: 'Moderate Snow Fall', icon: CloudSnow },
  75: { label: 'Heavy Snow Fall', icon: CloudSnow },
  77: { label: 'Snow Grains', icon: CloudSnow },
  80: { label: 'Slight Rain Showers', icon: CloudRain },
  81: { label: 'Moderate Rain Showers', icon: CloudRain },
  82: { label: 'Violent Rain Showers', icon: CloudRain },
  85: { label: 'Slight Snow Showers', icon: CloudSnow },
  86: { label: 'Heavy Snow Showers', icon: CloudSnow },
  95: { label: 'Thunderstorm', icon: CloudLightning },
  96: { label: 'Thunderstorm with Slight Hail', icon: CloudLightning },
  99: { label: 'Thunderstorm with Heavy Hail', icon: CloudLightning },
};

const Weather = () => {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current_weather=true`;
  const { data: apiData, loading, error } = useFetch<any>(url);

  // Fallback / Mock Data if API fails
  const mockData = useMemo(() => ({
    current_weather: {
      temperature: 28.5 + (Math.random() * 5),
      windspeed: 12.4,
      weathercode: 0,
      time: new RegExp('T(.*)').exec(new Date().toISOString())?.[1] || ''
    }
  }), [selectedCity]);

  const data = apiData || (error ? mockData : null);
  const weatherInfo = data?.current_weather ? (weatherCodeMap[data.current_weather.weathercode] || { label: 'Unknown', icon: Sun }) : null;
  const WeatherIcon = weatherInfo?.icon || Sun;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Weather Forecast</h2>
      
      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem' }}>
        {cities.map(city => (
          <button 
            key={city.name} 
            className={`btn ${selectedCity.name === city.name ? 'btn-primary' : ''}`}
            style={{ display: 'flex', gap: '0.5rem', whiteSpace: 'nowrap', background: selectedCity.name !== city.name ? 'var(--bg-color)' : '', border: selectedCity.name !== city.name ? '1px solid var(--border)' : '' }}
            onClick={() => setSelectedCity(city)}
          >
            <MapPin size={16} /> {city.name}
          </button>
        ))}
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 2rem', position: 'relative', overflow: 'hidden' }}>
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p>Fetching weather data...</p>
          </div>
        )}

        {error && !loading && apiData === null && (
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 600, border: '1px solid rgba(239, 68, 68, 0.2)', zIndex: 10 }}>
            <WifiOff size={14} /> Offline Mode (Using Mock Data)
          </div>
        )}
        
        {data && data.current_weather && !loading && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <WeatherIcon size={80} color="var(--primary)" strokeWidth={1.5} />
              <div style={{ fontSize: '4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', letterSpacing: '-0.05em' }}>
                {Math.round(data.current_weather.temperature)}°C
              </div>
              <p style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-main)' }}>{weatherInfo?.label}</p>
            </div>
            
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', borderTop: '1px solid var(--border)', paddingTop: '2.5rem', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <Wind size={20} color="var(--text-muted)" />
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{data.current_weather.windspeed} km/h</span>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Wind Speed</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <Thermometer size={20} color="var(--text-muted)" />
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{Math.round(data.current_weather.temperature)}°C</span>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Feels Like</span>
              </div>
            </div>
            
            {/* Visual background element */}
            <WeatherIcon size={250} style={{ position: 'absolute', bottom: '-80px', right: '-80px', opacity: 0.03, color: 'var(--primary)', transform: 'rotate(-15deg)' }} />
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Weather;
