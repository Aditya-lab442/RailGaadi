import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrain } from '../hooks/useTrain';
import { useWeather } from '../hooks/useWeather';
import { useElevation } from '../hooks/useElevation';
import { useNearby } from '../hooks/useNearby';
import { HeroCard } from '../components/cards/HeroCard';
import { JourneyCard } from '../components/cards/JourneyCard';
import { StationList } from '../components/cards/StationList';
import { RouteMap } from '../components/map/RouteMap';
import { WeatherCard } from '../components/weather/WeatherCard';
import { ElevationCard } from '../components/analytics/ElevationCard';
import { NearbyCard } from '../components/analytics/NearbyCard';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { ErrorState } from '../components/ui/ErrorState';
import { Toast } from '../components/ui/Toast';

export const TrainPage: React.FC = () => {
  const { number = '22436' } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useTrain(number);

  // Real API hooks (weather, elevation, nearby) — fire in parallel once train data is loaded
  const { data: weatherData } = useWeather(
    data?.currentStation ?? null,
    data?.nextStation ?? null,
    data?.destination ?? null
  );
  const { data: elevationData } = useElevation(number);
  const { data: nearbyFeatures } = useNearby(number);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setToastMessage('Journey link copied to clipboard!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (isLoading) {
    return (
      <div style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <SkeletonCard height="220px" />
        <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <SkeletonCard height="440px" />
            <SkeletonCard height="160px" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <SkeletonCard height="200px" />
            <SkeletonCard height="440px" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* ── Hero ── */}
        <HeroCard data={data} onShare={handleShare} />

        {/* ── Main 2-column grid ── */}
        <div
          style={{
            display: 'grid',
            gap: '24px',
            gridTemplateColumns: '1fr',
          }}
          className="train-page-grid"
        >
          <style>{`
            @media (min-width: 1024px) {
              .train-page-grid { grid-template-columns: 7fr 5fr !important; }
            }
          `}</style>

          {/* ── Left column: map, journey, elevation, nearby ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <RouteMap
              data={data}
              height="440px"
              onToggleFullscreen={() => navigate(`/train/${number}/map`)}
            />

            <JourneyCard data={data} />

            {elevationData && <ElevationCard data={elevationData} />}

            {nearbyFeatures && nearbyFeatures.length > 0 && (
              <NearbyCard features={nearbyFeatures} />
            )}
          </div>

          {/* ── Right column: station list, weather ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <StationList stations={data.route.stations} />

            {weatherData && (
              <WeatherCard
                currentWeather={weatherData.current}
                nextWeather={weatherData.next}
                destinationWeather={weatherData.destination}
              />
            )}
          </div>
        </div>
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </>
  );
};
