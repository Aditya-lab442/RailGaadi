import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../hooks/useSearch';
import { useUserStore } from '../store/userStore';
import {
  Train, Heart, Sparkles, Clock, ArrowRight,
  Search, X, Zap, MapPin, Navigation, TrendingUp
} from 'lucide-react';
import { TrainSearchResult } from '../types/train';

/* ── Popular trains (used as placeholder if no recent/favorites) ── */
const POPULAR_TRAINS = [
  { number: '22436', name: 'Vande Bharat Express',      from: 'New Delhi',    to: 'Varanasi Jn',       tag: '95 km/h avg' },
  { number: '12952', name: 'Mumbai Rajdhani Express',   from: 'New Delhi',    to: 'Mumbai Central',    tag: 'Daily' },
  { number: '12002', name: 'New Delhi Shatabdi',        from: 'New Delhi',    to: 'Rani Kamalapati',   tag: '86 km/h avg' },
  { number: '12302', name: 'Howrah Rajdhani Express',   from: 'New Delhi',    to: 'Howrah Jn',         tag: 'Premium' },
  { number: '20608', name: 'Vande Bharat Express',      from: 'Mysuru Jn',   to: 'Chennai Central',   tag: 'Superfast' },
  { number: '12259', name: 'Sealdah Duronto Express',   from: 'New Delhi',    to: 'Sealdah',           tag: 'Non-stop' },
];

export const HomePage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: suggestions = [], isLoading } = useSearch(query);
  const { favorites, recentSearches, addRecentSearch } = useUserStore();

  const handleSelectTrain = (train: { number: string; name: string }) => {
    addRecentSearch({ trainNumber: train.number, trainName: train.name });
    setQuery('');
    setShowSuggestions(false);
    navigate(`/train/${train.number}`);
  };

  /* Close suggestions on outside click */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div style={{ padding: '24px 24px 64px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* ── Hero Section ── */}
      <div style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '24px' }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '6px 14px', borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-primary)',
          fontSize: '0.8125rem', fontWeight: 700, marginBottom: '16px',
        }}>
          <Sparkles size={14} /> Live Intelligence for 5,000+ Indian Trains
        </div>

        <h1 style={{
          fontSize: 'clamp(1.75rem, 5vw, 2.75rem)', fontWeight: 800,
          letterSpacing: '-0.03em', color: 'var(--text-primary)',
          marginBottom: '12px', lineHeight: 1.15,
        }}>
          Track Any Train,<br />Anywhere in India
        </h1>
        <p style={{
          fontSize: '1.0625rem', color: 'var(--text-secondary)',
          maxWidth: '560px', margin: '0 auto 32px',
        }}>
          Real-time live train movement, interactive maps, delay alerts, weather intelligence, and elevation profiles — for every train in India.
        </p>

        {/* ── Search Bar ── */}
        <div
          ref={searchRef}
          style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '14px 18px', borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-card)', border: '1.5px solid var(--border-default)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
          }}
            onClick={() => inputRef.current?.focus()}
          >
            {isLoading
              ? <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--accent-primary)', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
              : <Search size={20} color="var(--text-tertiary)" />
            }
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search train number or name (e.g. 22436, Vande Bharat)..."
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: '1rem', color: 'var(--text-primary)',
                fontFamily: 'inherit', fontWeight: 500,
              }}
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setShowSuggestions(false); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', color: 'var(--text-tertiary)' }}
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && query.trim() && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
              backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-default)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 999,
              overflow: 'hidden', maxHeight: '340px', overflowY: 'auto',
            }}>
              {isLoading && (
                <div style={{ padding: '16px 20px', fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                  Searching all Indian trains...
                </div>
              )}
              {!isLoading && suggestions.length === 0 && (
                <div style={{ padding: '16px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: 6 }}>No trains found for &ldquo;{query}&rdquo;</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Try the full 5-digit train number (e.g. 12345)</div>
                </div>
              )}
              {suggestions.map((train, idx) => (
                <div
                  key={train.number + idx}
                  onClick={() => handleSelectTrain(train)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '12px 20px', cursor: 'pointer',
                    borderBottom: idx < suggestions.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    backgroundColor: 'var(--accent-subtle)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Train size={18} color="var(--accent-primary)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {train.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                      #{train.number}
                      {train.origin && ` · ${train.origin} → ${train.destination}`}
                    </div>
                  </div>
                  <ArrowRight size={16} color="var(--accent-primary)" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick search pills */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '14px', flexWrap: 'wrap' }}>
          {['22436', '12952', '12002', '12302', '20608'].map((num) => (
            <button
              key={num}
              onClick={() => handleSelectTrain({ number: num, name: '' })}
              style={{
                padding: '6px 14px', borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)',
                fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                fontFamily: 'inherit',
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-subtle)'; e.currentTarget.style.color = 'var(--accent-primary)'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              #{num}
            </button>
          ))}
        </div>
      </div>

      {/* ── Recent Searches ── */}
      {recentSearches.length > 0 && (
        <section style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Clock size={16} color="var(--text-tertiary)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Recent Searches
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {recentSearches.slice(0, 6).map((r) => (
              <div
                key={r.trainNumber}
                onClick={() => navigate(`/train/${r.trainNumber}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 16px', borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                  cursor: 'pointer', transition: 'all var(--transition-fast)',
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                <Clock size={14} color="var(--text-tertiary)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-primary)' }}>#{r.trainNumber}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.trainName || 'View Journey'}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Favorites ── */}
      {favorites.length > 0 && (
        <section style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Heart size={16} color="var(--status-severe)" fill="var(--status-severe)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Saved Favorites
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            {favorites.map((fav) => (
              <div
                key={fav.trainNumber}
                className="apple-card"
                onClick={() => navigate(`/train/${fav.trainNumber}`)}
                style={{ padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: 'rgba(255,59,48,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Heart size={16} color="var(--status-severe)" fill="var(--status-severe)" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '0.9rem' }}>#{fav.trainNumber}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fav.trainName}</div>
                  </div>
                </div>
                <ArrowRight size={16} color="var(--text-tertiary)" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Popular Flagship Trains ── */}
      <section style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={16} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Popular Trains
            </h2>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--status-ontime)', display: 'inline-block' }} />
            Live Tracking Active
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '14px' }}>
          {POPULAR_TRAINS.map((train) => (
            <div
              key={train.number}
              className="apple-card"
              onClick={() => handleSelectTrain(train)}
              style={{ padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    backgroundColor: 'var(--accent-subtle)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Train size={20} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '1rem', lineHeight: 1 }}>
                      #{train.number}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, marginTop: 2 }}>
                      {train.tag}
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize: '0.65rem', fontWeight: 700, backgroundColor: 'var(--status-ontime-subtle)',
                  color: 'var(--status-ontime)', padding: '3px 8px', borderRadius: 'var(--radius-full)',
                }}>LIVE</span>
              </div>

              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.3 }}>
                  {train.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  <MapPin size={12} color="var(--text-tertiary)" />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{train.from}</span>
                  <ArrowRight size={12} color="var(--text-tertiary)" />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{train.to}</span>
                </div>
              </div>

              <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                <span>View Live Journey</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature Highlights Row ── */}
      <section>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
          {[
            { icon: <Navigation size={20} color="#007AFF" />, color: '#007AFF', bg: 'rgba(0,122,255,0.1)', title: 'Live Map', desc: 'Real-time train position on an interactive railway map' },
            { icon: <Zap size={20} color="#FF9500" />, color: '#FF9500', bg: 'rgba(255,149,0,0.1)', title: 'Delay Alerts', desc: 'Per-station delay info and ETA updates' },
            { icon: <MapPin size={20} color="#34C759" />, color: '#34C759', bg: 'rgba(52,199,89,0.1)', title: 'Weather Intel', desc: 'Live weather at current, next & destination stations' },
            { icon: <TrendingUp size={20} color="#5856D6" />, color: '#5856D6', bg: 'rgba(88,86,214,0.1)', title: 'Elevation Profile', desc: 'Terrain chart along the full train route' },
          ].map((f) => (
            <div
              key={f.title}
              style={{
                padding: '18px', borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                {f.icon}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{f.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
