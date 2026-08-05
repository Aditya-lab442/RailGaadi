import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  color?: string;
  backgroundColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  color = 'var(--status-ontime)',
  backgroundColor = 'var(--bg-subtle)',
}) => {
  return (
    <div
      style={{
        width: '100%',
        height,
        backgroundColor,
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height: '100%',
          backgroundColor: color,
          borderRadius: 'var(--radius-full)',
        }}
      />
    </div>
  );
};
