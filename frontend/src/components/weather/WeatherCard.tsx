import React from 'react';
import { CloudSun, Droplets, Wind, CloudRain, Sun, Cloud, Thermometer } from 'lucide-react';
import { StationWeather } from '../../types/weather';

interface WeatherCardProps {
  currentWeather?: StationWeather;
  nextWeather?: StationWeather;
  destinationWeather?: StationWeather;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  currentWeather,
  nextWeather,
  destinationWeather,
}) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Sunny':
      case 'Clear':
        return <Sun size={24} color="#FF9500" />;
      case 'Rain':
      case 'Thunderstorm':
        return <CloudRain size={24} color="#007AFF" />;
      case 'Cloudy':
      case 'Partly Cloudy':
        return <CloudSun size={24} color="#5856D6" />;
      default:
        return <Cloud size={24} color="#8E8E93" />;
    }
  };

  const panels = [
    { label: 'Current Station', data: currentWeather },
    { label: 'Next Station', data: nextWeather },
    { label: 'Destination', data: destinationWeather },
  ].filter((p) => Boolean(p.data));

  if (panels.length === 0) return null;

  return (
    <div className="apple-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <CloudSun size={20} color="var(--accent-primary)" />
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Journey Weather Intelligence
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        {panels.map((panel, idx) => {
          const w = panel.data!;
          return (
            <div
              key={idx}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                {panel.label} ({w.stationCode})
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {w.tempC}°C
                  </div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {w.condition}
                  </div>
                </div>
                {getWeatherIcon(w.condition)}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Droplets size={12} color="var(--accent-primary)" /> {w.humidityPercent}%
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Wind size={12} color="var(--text-tertiary)" /> {w.windSpeedKmH} km/h
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
