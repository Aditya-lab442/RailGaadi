import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Train, Home, Search, Heart, Settings, Clock, Sparkles } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { recentSearches, favorites } = useUserStore();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Favorites', path: '/favorites', icon: Heart, count: favorites.length },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        zIndex: 100,
      }}
    >
      {/* Brand Logo */}
      <div
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0 8px',
          marginBottom: '32px',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-primary)',
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
          }}
        >
          <Train size={22} />
        </div>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
            RailGaadi
          </div>
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Sparkles size={10} /> Live Intelligence
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '32px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9375rem',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--accent-subtle)' : 'transparent',
                textDecoration: 'none',
                transition: 'all var(--transition-fast)',
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                  {item.count}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Recent Searches Section */}
      {recentSearches.length > 0 && (
        <div style={{ marginTop: 'auto' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={12} /> Recent Searches
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {recentSearches.slice(0, 5).map((search) => (
              <button
                key={search.trainNumber}
                onClick={() => navigate(`/train/${search.trainNumber}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)',
                  textAlign: 'left',
                  transition: 'background-color var(--transition-fast)',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span style={{ fontWeight: 600 }}>#{search.trainNumber}</span>
                <span style={{ color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
                  {search.trainName}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
