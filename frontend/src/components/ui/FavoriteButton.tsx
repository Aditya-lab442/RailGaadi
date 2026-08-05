import React from 'react';
import { Heart } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

interface FavoriteButtonProps {
  trainNumber: string;
  trainName: string;
  origin: string;
  destination: string;
  size?: number;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  trainNumber,
  trainName,
  origin,
  destination,
  size = 20,
}) => {
  const { isFavorite, addFavorite, removeFavorite } = useUserStore();
  const active = isFavorite(trainNumber);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (active) {
      removeFavorite(trainNumber);
    } else {
      addFavorite({ trainNumber, trainName, origin, destination });
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      title={active ? 'Remove from favorites' : 'Add to favorites'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size + 16,
        height: size + 16,
        borderRadius: '50%',
        backgroundColor: active ? 'rgba(255, 59, 48, 0.1)' : 'var(--bg-subtle)',
        color: active ? 'var(--status-severe)' : 'var(--text-tertiary)',
        transition: 'all var(--transition-fast)',
      }}
      onMouseOver={(e) => {
        if (!active) e.currentTarget.style.color = 'var(--status-severe)';
      }}
      onMouseOut={(e) => {
        if (!active) e.currentTarget.style.color = 'var(--text-tertiary)';
      }}
    >
      <Heart size={size} fill={active ? 'var(--status-severe)' : 'none'} />
    </button>
  );
};
