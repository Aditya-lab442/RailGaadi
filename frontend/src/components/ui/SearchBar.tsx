import React, { useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  isLoading = false,
  placeholder = 'Search train number or name (e.g. 22436, Vande Bharat)',
  autoFocus = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-full)',
        border: `1.5px solid ${isFocused ? 'var(--border-focus)' : 'var(--border-subtle)'}`,
        boxShadow: isFocused ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
        transition: 'all var(--transition-fast)',
        padding: '6px 16px',
      }}
    >
      <Search
        size={20}
        color={isFocused ? 'var(--accent-primary)' : 'var(--text-tertiary)'}
        style={{ marginRight: '10px', flexShrink: 0 }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          width: '100%',
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          fontSize: '0.9375rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
        }}
      />
      {isLoading ? (
        <Loader2 size={18} className="animate-spin" color="var(--accent-primary)" />
      ) : value ? (
        <button
          onClick={() => {
            onChange('');
            if (onClear) onClear();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-hover)',
            color: 'var(--text-secondary)',
          }}
        >
          <X size={14} />
        </button>
      ) : null}
    </div>
  );
};
