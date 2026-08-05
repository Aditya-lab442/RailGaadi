import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrain } from '../hooks/useTrain';
import { useElevation } from '../hooks/useElevation';
import { useNearby } from '../hooks/useNearby';
import { useWeather } from '../hooks/useWeather';
import { HeroCard } from '../components/cards/HeroCard';
import { JourneyCard } from '../components/cards/JourneyCard';
import { DelayChart } from '../components/analytics/DelayChart';
import { ElevationCard } from '../components/analytics/ElevationCard';
import { NearbyCard } from '../components/analytics/NearbyCard';
import { WeatherCard } from '../components/weather/WeatherCard';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { ErrorState } from '../components/ui/ErrorState';
import { ArrowLeft, TrendingUp, Navigation, Map } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { number = '22436' } = useParams<{ number: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useTrain(number);
  const { data: elevationData } = useElevation(number);
  const { data: nearbyFeatures } = useNearby(number);
  const { data: weatherData } = useWeather(
    data?.currentStation ?? null,
    data?.nextStation ?? null,
    data?.destination ?? null
  );

  if (isLoading) {
    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <SkeletonCard height="200px" />
        <SkeletonCard height="300px" />
        <SkeletonCard height="240px" />
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Navigation Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => navigate(`/train/${number}`)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <ArrowLeft size={16} /> Back to Train Status
        </button>

        <button
          onClick={() => navigate(`/train/${number}/map`)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--accent-subtle)',
            border: '1px solid var(--accent-primary)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: 'var(--accent-primary)',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <Map size={16} /> View Fullscreen Map
        </button>
      </div>

      {/* Hero Overview */}
      <HeroCard data={data} />

      {/* Analytics Section Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {/* Delay Trend Chart */}
        <DelayChart stations={data.route.stations} />

        {/* Journey Completion */}
        <JourneyCard data={data} />

        {/* Elevation Profile */}
        {elevationData && <ElevationCard data={elevationData} />}

        {/* Weather Intelligence */}
        {weatherData && (
          <WeatherCard
            currentWeather={weatherData.current}
            nextWeather={weatherData.next}
            destinationWeather={weatherData.destination}
          />
        )}

        {/* Geographic Highlights */}
        {nearbyFeatures && nearbyFeatures.length > 0 && <NearbyCard features={nearbyFeatures} />}
      </div>
    </div>
  );
};
