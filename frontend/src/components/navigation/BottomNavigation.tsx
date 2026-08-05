import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Heart, Settings } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export const BottomNavigation: React.FC = () => {
  const { favorites } = useUserStore();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Favorites', path: '/favorites', icon: Heart, count: favorites.length },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 1000,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)',
              fontSize: '0.6875rem',
              fontWeight: isActive ? 700 : 500,
              textDecoration: 'none',
              position: 'relative',
            })}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
