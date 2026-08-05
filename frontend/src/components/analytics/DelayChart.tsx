import React from 'react';
import { Station } from '../../types/train';
import { Clock, TrendingUp } from 'lucide-react';

interface DelayChartProps {
  stations: Station[];
}

export const DelayChart: React.FC<DelayChartProps> = ({ stations }) => {
  const haltingStations = stations.filter((s) => s.isHalt !== false && s.delayMinutes !== undefined);
  if (!haltingStations.length) return null;

  const maxDelay = Math.max(...haltingStations.map((s) => s.delayMinutes), 15);
  const avgDelay = Math.round(
    haltingStations.reduce((sum, s) => sum + (s.delayMinutes || 0), 0) / haltingStations.length
  );

  // SVG dimensions
  const svgW = 600;
  const svgH = 120;
  const padX = 12;
  const padY = 12;

  const points = haltingStations.map((s, idx) => {
    const x = padX + ((svgW - padX * 2) * idx) / Math.max(1, haltingStations.length - 1);
    const y = svgH - padY - ((s.delayMinutes || 0) / maxDelay) * (svgH - padY * 2);
    return { x, y, station: s };
  });

  const polylineStr = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaStr = `${padX},${svgH} ` + polylineStr + ` ${svgW - padX},${svgH}`;

  return (
    <div className="apple-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={20} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Station Delay Progression
          </h3>
        </div>
        <div style={{ fontSize: '0.781rem', fontWeight: 700, color: avgDelay > 0 ? 'var(--status-delayed)' : 'var(--status-ontime)', backgroundColor: avgDelay > 0 ? 'var(--status-delayed-subtle)' : 'var(--status-ontime-subtle)', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
          {avgDelay > 0 ? `Avg Delay: +${avgDelay}m` : 'On Time Route'}
        </div>
      </div>

      {/* SVG Chart Container */}
      <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: '12px', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
          <defs>
            <linearGradient id="delayGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF9500" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FF9500" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {/* Fill */}
          <polygon points={areaStr} fill="url(#delayGrad)" />

          {/* Line */}
          <polyline
            points={polylineStr}
            fill="none"
            stroke="#FF9500"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Station Point Circles */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r={p.station.delayMinutes > 0 ? 4 : 3}
                fill={p.station.delayMinutes > 0 ? '#FF3B30' : '#34C759'}
                stroke="#FFFFFF"
                strokeWidth={1.5}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        <div style={{ padding: '10px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>Max Delay</div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: maxDelay > 0 ? 'var(--status-delayed)' : 'var(--status-ontime)', marginTop: 2 }}>+{maxDelay} min</div>
        </div>
        <div style={{ padding: '10px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>Avg Delay</div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', marginTop: 2 }}>+{avgDelay} min</div>
        </div>
        <div style={{ padding: '10px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>Halts Tracked</div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--accent-primary)', marginTop: 2 }}>{haltingStations.length}</div>
        </div>
      </div>
    </div>
  );
};
