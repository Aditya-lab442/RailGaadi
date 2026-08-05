import React from 'react';
import { ProgressRing } from '../ui/ProgressRing';
import { ProgressBar } from '../ui/ProgressBar';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { LiveTrainData } from '../../types/train';
import { formatTime } from '../../utils/formatters';
import { MapPin, Navigation } from 'lucide-react';

interface JourneyCardProps {
  data: LiveTrainData;
}

export const JourneyCard: React.FC<JourneyCardProps> = ({ data }) => {
  const originDep = formatTime(data.origin.scheduledDeparture || data.origin.scheduledArrival);
  const destArr = formatTime(data.destination.scheduledArrival || data.destination.scheduledDeparture);

  return (
    <div className="apple-card" style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '1.0625rem', fontWeight: 800, marginBottom: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Navigation size={18} color="var(--accent-primary)" />
        Journey Analytics
      </h2>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
        {/* Circular Ring */}
        <ProgressRing progress={data.journeyCompletionPercent} size={110} strokeWidth={9}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
            <AnimatedCounter value={data.journeyCompletionPercent} suffix="%" />
          </div>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginTop: '4px' }}>
            Completed
          </div>
        </ProgressRing>

        {/* Linear Metrics */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Covered Distance</span>
            <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
              <AnimatedCounter value={Math.round(data.distanceCoveredKm)} suffix=" km" />
            </span>
          </div>

          <ProgressBar progress={data.journeyCompletionPercent} height={10} color="var(--accent-primary)" />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Remaining Distance</span>
            <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
              <AnimatedCounter value={Math.round(data.remainingDistanceKm)} suffix=" km" />
            </span>
          </div>
        </div>
      </div>

      {/* Origin -> Destination Line */}
      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>ORIGIN</div>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{data.origin.name}</span>
          <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Dep: {originDep}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>DESTINATION</div>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{data.destination.name}</span>
          <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>ETA: {destArr}</div>
        </div>
      </div>
    </div>
  );
};
