import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { Heart, Trash2, ArrowRight, Train } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, removeFavorite } = useUserStore();

  return (
    <div style={{ padding: '32px 24px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <Heart size={24} color="var(--status-severe)" fill="var(--status-severe)" />
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Saved Favorites ({favorites.length})
        </h1>
      </div>
      <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Quickly access real-time journey tracking for your saved train routes.
      </p>

      {favorites.length === 0 ? (
        <div
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '16px' }}>
            You haven't added any favorite trains yet.
          </p>
          <button
            onClick={() => navigate('/search')}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--accent-primary)',
              color: '#FFF',
              fontWeight: 600,
            }}
          >
            Find Trains
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {favorites.map((fav) => (
            <div
              key={fav.trainNumber}
              className="apple-card"
              onClick={() => navigate(`/train/${fav.trainNumber}`)}
              style={{
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    #{fav.trainNumber}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(fav.trainNumber);
                    }}
                    title="Remove favorite"
                    style={{ color: 'var(--text-tertiary)', padding: '4px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {fav.trainName}
                </h3>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{fav.origin}</span>
                  <ArrowRight size={12} />
                  <span>{fav.destination}</span>
                </div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.8125rem' }}>
                <span>Track Live</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
