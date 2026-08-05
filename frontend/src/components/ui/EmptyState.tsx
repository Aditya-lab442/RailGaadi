import React from 'react';
import { Search, Train } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onSelectSuggestion?: (trainNumber: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No train found',
  description = 'Try searching with a valid train number or name, or pick a popular train below.',
  onSelectSuggestion,
}) => {
  const suggestions = [
    { number: '22436', name: 'Vande Bharat Express (NDLS ➔ BSB)' },
    { number: '12952', name: 'Mumbai Rajdhani (NDLS ➔ MMCT)' },
    { number: '12002', name: 'Shatabdi Express (NDLS ➔ RKMP)' },
    { number: '20608', name: 'Vande Bharat Express (MYS ➔ MAS)' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)',
        maxWidth: '560px',
        margin: '32px auto',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-tertiary)',
          marginBottom: '16px',
        }}
      >
        <Search size={32} />
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
        {description}
      </p>

      {onSelectSuggestion && (
        <div style={{ width: '100%' }}>
          <div style={{ fontSize: '0.781rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: '12px' }}>
            Suggested Trains
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {suggestions.map((item) => (
              <button
                key={item.number}
                onClick={() => onSelectSuggestion(item.number)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-subtle)',
                  transition: 'all var(--transition-fast)',
                  textAlign: 'left',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
              >
                <Train size={18} color="var(--accent-primary)" />
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>#{item.number}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
