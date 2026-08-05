import React from 'react';

interface SkeletonCardProps {
  height?: string | number;
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ height = '180px' }) => {
  return (
    <div
      className="animate-shimmer"
      style={{
        width: '100%',
        height,
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
      }}
    />
  );
};
