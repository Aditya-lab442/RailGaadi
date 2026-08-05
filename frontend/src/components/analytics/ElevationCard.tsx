import React from 'react';
import { Mountain, Waves, Landmark, ArrowUpDown, TrendingUp } from 'lucide-react';
import { ElevationProfile } from '../../hooks/useElevation';

interface ElevationCardProps {
  data: ElevationProfile;
}

export const ElevationCard: React.FC<ElevationCardProps> = ({ data }) => {
  if (!data?.points?.length) return null;

  const maxElevation = Math.max(...data.points.map((p) => p.elevation));
  const minElevation = Math.min(...data.points.map((p) => p.elevation));
  const elevRange = Math.max(maxElevation - minElevation, 1);

  // SVG chart dimensions
  const svgW = 600;
  const svgH = 100;
  const padX = 10;
  const padY = 10;

  const pts = data.points.map((p, i) => {
    const x = padX + ((svgW - padX * 2) * i) / (data.points.length - 1);
    const y = svgH - padY - ((p.elevation - minElevation) / elevRange) * (svgH - padY * 2);
    return `${x},${y}`;
  });

  const polylineStr = pts.join(' ');
  const areaStr = `${padX},${svgH} ` + pts.join(' ') + ` ${svgW - padX},${svgH}`;

  return (
    <div className="apple-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Mountain size={20} color="var(--accent-primary)" />
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Elevation Profile
        </h2>
      </div>

      {/* SVG Elevation Chart */}
      <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'var(--bg-subtle)', padding: '12px 12px 4px', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" style={{ display: 'block' }}>
          {/* Area fill */}
          <defs>
            <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#007AFF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#007AFF" stopOpacity="0.04" />
            </linearGradient>
          </defs>
          <polygon points={areaStr} fill="url(#elevGrad)" />
          <polyline
            points={polylineStr}
            fill="none"
            stroke="#007AFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Highest point marker */}
          {(() => {
            const hi = data.highestPoint;
            const idx = data.points.findIndex((p) => p.elevation === hi.elevation);
            const x = padX + ((svgW - padX * 2) * idx) / (data.points.length - 1);
            const y = svgH - padY - ((hi.elevation - minElevation) / elevRange) * (svgH - padY * 2);
            return (
              <g>
                <circle cx={x} cy={y} r={5} fill="#FF9500" stroke="#FFF" strokeWidth={2} />
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        {[
          { icon: <TrendingUp size={16} color="#FF9500" />, label: 'Highest Point', value: `${data.highestPoint.elevation} m` },
          { icon: <ArrowUpDown size={16} color="var(--accent-primary)" />, label: 'Elevation Gain', value: `${maxElevation - minElevation} m` },
          { icon: <Waves size={16} color="var(--status-ontime)" />, label: 'Lowest Point', value: `${data.lowestPoint.elevation} m` },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>{stat.icon}</div>
            <div style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--text-primary)' }}>{stat.value}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', marginTop: '2px' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
