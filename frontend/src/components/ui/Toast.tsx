import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--text-primary)',
            color: 'var(--text-inverse)',
            boxShadow: 'var(--shadow-lg)',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
          onClick={onClose}
        >
          {type === 'success' ? (
            <CheckCircle2 size={18} color="var(--status-ontime)" />
          ) : (
            <AlertCircle size={18} color="var(--status-severe)" />
          )}
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
