import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Train, Search, Heart } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { favorites } = useUserStore();

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 90,
      }}
    >
      <div
        onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--accent-primary)',
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Train size={18} />
        </div>
        <span style={{ fontSize: '1.125rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          RailGaadi
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => navigate('/search')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-subtle)',
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            fontWeight: 500,
          }}
        >
          <Search size={16} />
          <span>Search train...</span>
        </button>

        <button
          onClick={() => navigate('/favorites')}
          style={{
            position: 'relative',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
          }}
        >
          <Heart size={18} />
          {favorites.length > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: 'var(--status-severe)',
                color: '#FFF',
                fontSize: '0.625rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {favorites.length}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
