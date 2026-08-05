import React from 'react';
import { Station } from '../../types/train';
import { formatTime } from '../../utils/formatters';
import { Clock, MapPin, CheckCircle2, Navigation } from 'lucide-react';

interface StationCardProps {
  station: Station;
  isFirst?: boolean;
  isLast?: boolean;
}

export const StationCard: React.FC<StationCardProps> = ({ station, isFirst, isLast }) => {
  const isPassed = station.status === 'passed';
  const isCurrent = station.status === 'current';

  const scheduledTime = formatTime(station.scheduledArrival || station.scheduledDeparture);
  const actualTime = formatTime(station.actualArrival || station.actualDeparture);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', position: 'relative', paddingBottom: isLast ? 0 : '18px' }}>
      {/* Connector Line */}
      {!isLast && (
        <div
          style={{
            position: 'absolute',
            top: '22px',
            left: '9px',
            width: '2px',
            bottom: 0,
            backgroundColor: isPassed ? 'var(--status-ontime)' : 'var(--border-subtle)',
            zIndex: 0,
          }}
        />
      )}

      {/* Marker Icon / Circle */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '3px',
          flexShrink: 0,
        }}
      >
        {isCurrent ? (
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(0, 122, 255, 0.6)',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-primary)',
              }}
            />
          </div>
        ) : isPassed ? (
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-ontime)',
            }}
          />
        ) : (
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'var(--border-medium)',
              border: '2px solid var(--bg-card)',
            }}
          />
        )}
      </div>

      {/* Main Station Content Box */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isCurrent ? '12px 16px' : '8px 12px',
          backgroundColor: isCurrent ? 'var(--accent-subtle)' : 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          border: isCurrent ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
          transition: 'all var(--transition-fast)',
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: isCurrent ? 800 : 700, fontSize: '0.9rem', color: isCurrent ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
              {station.name}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>
              ({station.code})
            </span>
            {isCurrent && (
              <span style={{ fontSize: '0.65rem', fontWeight: 800, backgroundColor: 'var(--accent-primary)', color: '#FFF', padding: '2px 8px', borderRadius: 'var(--radius-full)', letterSpacing: '0.04em' }}>
                LIVE NOW
              </span>
            )}
            {isFirst && <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-primary)', backgroundColor: 'var(--accent-subtle)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>ORIGIN</span>}
            {isLast && <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', backgroundColor: 'var(--bg-card)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>DESTINATION</span>}
            {station.isHalt === false && (
              <span style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-card)', padding: '1px 5px', borderRadius: 'var(--radius-sm)' }}>Pass-through</span>
            )}
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>{station.distanceFromOrigin} km</span>
            {station.platform && (
              <span style={{ backgroundColor: 'var(--bg-card)', padding: '1px 6px', borderRadius: '4px', fontWeight: 600, border: '1px solid var(--border-subtle)' }}>
                PF {station.platform}
              </span>
            )}
          </div>
        </div>

        {/* Time and Delay Status Column */}
        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '12px' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            {scheduledTime}
          </div>
          {station.delayMinutes > 0 ? (
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--status-delayed)' }}>
              +{station.delayMinutes}m delay ({actualTime})
            </div>
          ) : isPassed ? (
            <div style={{ fontSize: '0.75rem', color: 'var(--status-ontime)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end' }}>
              <CheckCircle2 size={12} /> Departed
            </div>
          ) : (
            <div style={{ fontSize: '0.75rem', color: 'var(--status-ontime)', fontWeight: 600 }}>
              On Time
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
