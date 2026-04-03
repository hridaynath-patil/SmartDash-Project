import { useState } from 'react';
import useFetch from '../hooks/useFetch';
import { CloudRain, Wind, Thermometer, MapPin } from 'lucide-react';

const cities = [
  { name: 'Nagpur', lat: 21.1458, lon: 79.0882 },
  { name: 'Pune', lat: 18.5204, lon: 73.8567 },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { name: 'Latur', lat: 18.4088, lon: 76.5604 }
];

const Weather = () => {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current_weather=true`;
  const { data, loading, error } = useFetch<any>(url);

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
        {loading && <p>Loading weather data...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {data && data.current_weather && !loading && (
          <>
            <div style={{ fontSize: '4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)' }}>
              {data.current_weather.temperature}°C
            </div>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Condition Code: {data.current_weather.weathercode}</p>
            
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <Wind color="var(--text-muted)" />
                <span style={{ fontWeight: 600 }}>{data.current_weather.windspeed} km/h</span>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Wind</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <Thermometer color="var(--text-muted)" />
                <span style={{ fontWeight: 600 }}>{data.current_weather.temperature}°C</span>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Temp</span>
              </div>
            </div>
            
            <CloudRain size={200} style={{ position: 'absolute', top: '-50px', right: '-50px', opacity: 0.05, color: 'var(--primary)' }} />
          </>
        )}
      </div>
    </div>
  );
};

export default Weather;
