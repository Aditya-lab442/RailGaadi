import React from 'react';
import { Plus, Minus, LocateFixed } from 'lucide-react';

interface MapControlsProps {
  onRecenter: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onRecenter,
  onZoomIn,
  onZoomOut,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '24px',
        right: '24px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <button
        onClick={onRecenter}
        title="Recenter Camera on Train"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-glass)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-primary)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid rgba(255,255,255,0.7)',
        }}
      >
        <LocateFixed size={20} />
      </button>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-glass)',
          backdropFilter: 'blur(12px)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid rgba(255,255,255,0.7)',
          overflow: 'hidden',
        }}
      >
        <button
          onClick={onZoomIn}
          title="Zoom In"
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <Plus size={18} />
        </button>
        <button
          onClick={onZoomOut}
          title="Zoom Out"
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
          }}
        >
          <Minus size={18} />
        </button>
      </div>
    </div>
  );
};
