import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, Clock, Navigation, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { LiveTrainData } from '../../types/train';
import { StatusBadge } from '../ui/StatusBadge';
import { LiveIndicator } from '../ui/LiveIndicator';
import { FavoriteButton } from '../ui/FavoriteButton';
import { ShareDialog } from '../ui/ShareDialog';
import { formatTime } from '../../utils/formatters';

interface HeroCardProps {
  data: LiveTrainData;
  onShare?: () => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({ data, onShare }) => {
  const navigate = useNavigate();
  const [shareOpen, setShareOpen] = useState(false);

  const currentDep = formatTime(data.currentStation?.scheduledDeparture || data.currentStation?.scheduledArrival);
  const nextArr = formatTime(data.nextStation?.scheduledArrival || data.nextStation?.scheduledDeparture);
  const runDaysStr = (data as any).runDays?.map((d: string) => d.toUpperCase()).join(' • ') || '';

  const handleShareClick = () => {
    if (onShare) onShare();
    setShareOpen(true);
  };

  return (
    <>
      <div className="apple-card" style={{ padding: '24px', position: 'relative' }}>
        {/* Top Badges Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {(data as any).trainCategory && (
            <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-primary)', padding: '4px 10px', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {(data as any).trainCategory}
            </span>
          )}
          {(data as any).trainType && (
            <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
              {(data as any).trainType}
            </span>
          )}
          {runDaysStr && (
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
              <Calendar size={13} /> {runDaysStr}
            </span>
          )}
        </div>

        {/* Header Title Row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--accent-primary)' }}>
                #{data.trainNumber}
              </span>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {data.trainName}
              </h1>
            </div>
            <LiveIndicator lastUpdated={data.lastUpdated} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => navigate(`/train/${data.trainNumber}/analytics`)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--accent-subtle)',
                color: 'var(--accent-primary)',
                border: '1px solid var(--accent-primary)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all var(--transition-fast)',
              }}
            >
              <TrendingUp size={15} /> Analytics
            </button>

            <FavoriteButton
              trainNumber={data.trainNumber}
              trainName={data.trainName}
              origin={data.origin.name}
              destination={data.destination.name}
            />

            <button
              onClick={handleShareClick}
              title="Share journey"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                transition: 'all var(--transition-fast)',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Main Live Status Metric Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '16px',
            padding: '18px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '20px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '6px' }}>
              Live Status
            </div>
            <StatusBadge status={data.status} delayMinutes={data.delayMinutes} />
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '6px' }}>
              Speed
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Navigation size={18} color="var(--accent-primary)" />
              {data.currentSpeedKmH} km/h
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '6px' }}>
              Destination ETA
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={18} color="var(--accent-primary)" />
              {formatTime(data.etaToDestination)}
            </div>
          </div>
        </div>

        {/* Current & Next Station Banner */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(52,199,89,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
              <MapPin size={18} color="var(--status-ontime)" />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 700, letterSpacing: '0.04em' }}>CURRENT LOCATION</div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                {data.currentStation.name} ({data.currentStation.code})
              </div>
              <div style={{ fontSize: '0.781rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Dep: {currentDep} {data.currentStation.platform ? `• PF ${data.currentStation.platform}` : ''}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
              <MapPin size={18} color="var(--accent-primary)" />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 700, letterSpacing: '0.04em' }}>NEXT STOP</div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                {data.nextStation.name} ({data.nextStation.code})
              </div>
              <div style={{ fontSize: '0.781rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                ETA: {nextArr} {data.nextStation.platform ? `• PF ${data.nextStation.platform}` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShareDialog
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        trainNumber={data.trainNumber}
        trainName={data.trainName}
      />
    </>
  );
};
