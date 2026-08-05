import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrain } from '../hooks/useTrain';
import { RouteMap } from '../components/map/RouteMap';
import { ErrorState } from '../components/ui/ErrorState';
import { SkeletonCard } from '../components/ui/SkeletonCard';

export const MapPage: React.FC = () => {
  const { number = '22436' } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useTrain(number);

  if (isLoading) return <SkeletonCard height="100vh" />;
  if (isError || !data) return <ErrorState />;

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'fixed', top: 0, left: 0, zIndex: 1000 }}>
      <RouteMap
        data={data}
        isFullscreen
        onToggleFullscreen={() => navigate(`/train/${number}`)}
      />
    </div>
  );
};
