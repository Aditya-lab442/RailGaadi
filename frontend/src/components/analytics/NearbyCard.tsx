import React from 'react';
import { Landmark, Waves, ArrowRightLeft, TreePine, MapPin } from 'lucide-react';
import { NearbyFeature } from '../../hooks/useNearby';

interface NearbyCardProps {
  features: NearbyFeature[];
}

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  River: { icon: <Waves size={16} />, color: '#007AFF', bg: 'rgba(0,122,255,0.1)' },
  Ghat: { icon: <TreePine size={16} />, color: '#34C759', bg: 'rgba(52,199,89,0.1)' },
  Bridge: { icon: <ArrowRightLeft size={16} />, color: '#FF9500', bg: 'rgba(255,149,0,0.1)' },
  Tunnel: { icon: <ArrowRightLeft size={16} />, color: '#5856D6', bg: 'rgba(88,86,214,0.1)' },
  Monument: { icon: <Landmark size={16} />, color: '#FF3B30', bg: 'rgba(255,59,48,0.1)' },
};

export const NearbyCard: React.FC<NearbyCardProps> = ({ features }) => {
  if (!features?.length) return null;

  return (
    <div className="apple-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <MapPin size={20} color="var(--accent-primary)" />
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Geographic Highlights Along Route
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {features.map((feature, idx) => {
          const cfg = typeConfig[feature.type] || typeConfig['Monument'];
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                transition: 'all var(--transition-fast)',
              }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = cfg.color)}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: cfg.bg,
                  color: cfg.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {cfg.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {feature.name}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {feature.distanceKm} km
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                  {feature.description}
                </p>
              </div>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  backgroundColor: cfg.bg,
                  color: cfg.color,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  letterSpacing: '0.03em',
                  whiteSpace: 'nowrap',
                  alignSelf: 'center',
                  flexShrink: 0,
                }}
              >
                {feature.type}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
