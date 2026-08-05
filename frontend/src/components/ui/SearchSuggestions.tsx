import React from 'react';
import { Train, ArrowRight } from 'lucide-react';
import { TrainSearchResult } from '../../types/train';

interface SearchSuggestionsProps {
  suggestions: TrainSearchResult[];
  onSelect: (train: TrainSearchResult) => void;
  isVisible: boolean;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSelect,
  isVisible,
}) => {
  if (!isVisible || suggestions.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        left: 0,
        right: 0,
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 1000,
        overflow: 'hidden',
        maxHeight: '360px',
        overflowY: 'auto',
      }}
    >
      <div style={{ padding: '8px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Matching Trains ({suggestions.length})
      </div>
      {suggestions.map((train) => (
        <button
          key={train.number}
          onClick={() => onSelect(train)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderTop: '1px solid var(--border-subtle)',
            textAlign: 'left',
            transition: 'background-color var(--transition-fast)',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--accent-subtle)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.8125rem',
              }}
            >
              <Train size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                  #{train.number}
                </span>
                <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                  {train.name}
                </span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span>{train.origin}</span>
                <ArrowRight size={12} />
                <span>{train.destination}</span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.781rem', color: 'var(--text-tertiary)' }}>
            <div>Departs {train.departureTime}</div>
            <div style={{ fontWeight: 500, color: 'var(--accent-primary)', marginTop: '2px' }}>Track Live ➔</div>
          </div>
        </button>
      ))}
    </div>
  );
};
