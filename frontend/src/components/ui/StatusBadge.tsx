import React from 'react';

interface StatusBadgeProps {
  status: 'RUNNING' | 'ON TIME' | 'DELAYED' | 'ARRIVED' | 'NOT STARTED';
  delayMinutes?: number;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, delayMinutes = 0 }) => {
  let label: string = status;
  let bg = 'var(--status-ontime-subtle)';
  let color = 'var(--status-ontime)';
  let dotColor = 'var(--status-ontime)';

  if (delayMinutes > 0) {
    label = `Delayed by ${delayMinutes} min`;
    if (delayMinutes > 30) {
      bg = 'var(--status-severe-subtle)';
      color = 'var(--status-severe)';
      dotColor = 'var(--status-severe)';
    } else {
      bg = 'var(--status-delayed-subtle)';
      color = 'var(--status-delayed)';
      dotColor = 'var(--status-delayed)';
    }
  } else if (status === 'ON TIME') {
    label = 'On Time';
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: bg,
        color: color,
        fontSize: '0.8125rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      }}
    >
      <span
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: dotColor,
        }}
      />
      {label}
    </span>
  );
};
