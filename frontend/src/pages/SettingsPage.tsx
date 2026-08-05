import React, { useState, useEffect } from 'react';
import { Settings, RefreshCw, Trash2, CheckCircle2, AlertTriangle, ShieldCheck, Database, Sliders, Moon } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { Toast } from '../components/ui/Toast';
import { apiClient } from '../services/api/client';

export const SettingsPage: React.FC = () => {
  const { clearRecentSearches, favorites, recentSearches } = useUserStore();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [apiHealth, setApiHealth] = useState<{ status: string; useRealApi?: boolean; timestamp?: string } | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);

  const checkHealth = async () => {
    setLoadingHealth(true);
    try {
      const res = await apiClient.get('/health');
      setApiHealth(res.data);
    } catch (e) {
      setApiHealth({ status: 'offline' });
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleClearHistory = () => {
    clearRecentSearches();
    setToastMessage('Search history cleared successfully!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Settings size={26} color="var(--accent-primary)" />
          Settings & Preferences
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Configure live tracking intervals, manage saved data, and check real-time API health status.
        </p>
      </div>

      {/* API Health & Integration Card */}
      <div className="apple-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={20} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Live API Status
            </h2>
          </div>
          <button
            onClick={checkHealth}
            disabled={loadingHealth}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.781rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <RefreshCw size={12} className={loadingHealth ? 'spin' : ''} />
            Refresh
          </button>
        </div>

        <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {apiHealth?.status === 'ok' ? (
              <CheckCircle2 size={24} color="var(--status-ontime)" />
            ) : (
              <AlertTriangle size={24} color="var(--status-delayed)" />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {apiHealth?.status === 'ok' ? 'RailGaadi Live APIs Online' : 'Connecting to API Server...'}
              </div>
              <div style={{ fontSize: '0.781rem', color: 'var(--text-secondary)' }}>
                {apiHealth?.useRealApi ? 'Real-time Indian Railways API (RailRadar v1) Connected' : 'Using Local Simulation Engine'}
              </div>
            </div>
          </div>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: 'var(--radius-full)', backgroundColor: apiHealth?.status === 'ok' ? 'var(--status-ontime-subtle)' : 'var(--status-delayed-subtle)', color: apiHealth?.status === 'ok' ? 'var(--status-ontime)' : 'var(--status-delayed)' }}>
            {apiHealth?.status === 'ok' ? 'OPERATIONAL' : 'CHECKING'}
          </span>
        </div>
      </div>

      {/* Preferences Settings Card */}
      <div className="apple-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Sliders size={20} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            App Preferences
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Live Refresh Interval</div>
              <div style={{ fontSize: '0.781rem', color: 'var(--text-secondary)' }}>Auto-update train position & delays</div>
            </div>
            <select
              defaultValue="15"
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            >
              <option value="15">Every 15 seconds</option>
              <option value="30">Every 30 seconds</option>
              <option value="60">Every 60 seconds</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Map Style</div>
              <div style={{ fontSize: '0.781rem', color: 'var(--text-secondary)' }}>MapTiler vector tile style</div>
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-primary)', backgroundColor: 'var(--accent-subtle)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
              Streets Vector (v2)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Theme Mode</div>
              <div style={{ fontSize: '0.781rem', color: 'var(--text-secondary)' }}>Apple-inspired clean light theme</div>
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', backgroundColor: 'var(--bg-subtle)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
              Light Theme
            </span>
          </div>
        </div>
      </div>

      {/* Data & Storage Card */}
      <div className="apple-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Trash2 size={20} color="var(--status-severe)" />
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Data & Privacy
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Recent Searches History</div>
            <div style={{ fontSize: '0.781rem', color: 'var(--text-secondary)' }}>
              Currently storing {recentSearches.length} recent search entries
            </div>
          </div>

          <button
            onClick={handleClearHistory}
            disabled={recentSearches.length === 0}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255,59,48,0.1)',
              color: 'var(--status-severe)',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: recentSearches.length === 0 ? 'not-allowed' : 'pointer',
              opacity: recentSearches.length === 0 ? 0.5 : 1,
              fontFamily: 'inherit',
            }}
          >
            <Trash2 size={14} /> Clear History
          </button>
        </div>
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
};
