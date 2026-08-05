import React from 'react';

interface LiveIndicatorProps {
  lastUpdated?: string;
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({ lastUpdated }) => {
  const formattedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Just now';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.781rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
      <div style={{ position: 'relative', width: '10px', height: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span
          className="animate-pulse-ring"
          style={{
            position: 'absolute',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'var(--status-ontime)',
          }}
        />
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--status-ontime)',
            zIndex: 1,
          }}
        />
      </div>
      <span>LIVE</span>
      <span style={{ color: 'var(--border-medium)' }}>•</span>
      <span style={{ color: 'var(--text-tertiary)' }}>Updated {formattedTime}</span>
    </div>
  );
};
