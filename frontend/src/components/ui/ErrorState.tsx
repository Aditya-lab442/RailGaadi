import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load train status',
  message = 'We encountered a network issue or backend server timeout. Please try retrying.',
  onRetry,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)',
        maxWidth: '480px',
        margin: '32px auto',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--status-severe-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--status-severe)',
          marginBottom: '16px',
        }}
      >
        <AlertCircle size={28} />
      </div>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--accent-primary)',
            color: '#FFF',
            fontWeight: 600,
            fontSize: '0.875rem',
            boxShadow: 'var(--shadow-sm)',
            transition: 'background-color var(--transition-fast)',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-primary)')}
        >
          <RefreshCw size={16} />
          Retry Connection
        </button>
      )}
    </div>
  );
};
