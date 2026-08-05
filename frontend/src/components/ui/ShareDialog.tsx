import React, { useState } from 'react';
import { X, Copy, Check, Share2, Send, MessageCircle, Twitter } from 'lucide-react';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  trainNumber: string;
  trainName: string;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onClose, trainNumber, trainName }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const currentUrl = window.location.href;
  const shareText = `Track live status for #${trainNumber} ${trainName} on RailGaadi Intelligence Platform: ${currentUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `#${trainNumber} ${trainName} Live Status`,
          text: `Live tracking for #${trainNumber} ${trainName}`,
          url: currentUrl,
        });
      } catch (err) {}
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-default)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
          padding: '24px',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--text-tertiary)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
          }}
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: 'var(--accent-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
            }}
          >
            <Share2 size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Share Live Journey
            </h3>
            <div style={{ fontSize: '0.781rem', color: 'var(--text-secondary)' }}>
              #{trainNumber} {trainName}
            </div>
          </div>
        </div>

        {/* Copy Link Input */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: '6px', textTransform: 'uppercase' }}>
            Journey Link
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <input
              readOnly
              value={currentUrl}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <button
              onClick={handleCopy}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: copied ? 'var(--status-ontime)' : 'var(--accent-primary)',
                color: '#FFF',
                border: 'none',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                fontFamily: 'inherit',
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Quick Social Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              padding: '12px 8px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(37,211,102,0.1)',
              color: '#25D366',
              textDecoration: 'none',
              fontSize: '0.781rem',
              fontWeight: 700,
              transition: 'transform var(--transition-fast)',
            }}
          >
            <MessageCircle size={20} />
            <span>WhatsApp</span>
          </a>

          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              padding: '12px 8px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(0,136,204,0.1)',
              color: '#0088CC',
              textDecoration: 'none',
              fontSize: '0.781rem',
              fontWeight: 700,
              transition: 'transform var(--transition-fast)',
            }}
          >
            <Send size={20} />
            <span>Telegram</span>
          </a>

          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              padding: '12px 8px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(29,161,242,0.1)',
              color: '#1DA1F2',
              textDecoration: 'none',
              fontSize: '0.781rem',
              fontWeight: 700,
              transition: 'transform var(--transition-fast)',
            }}
          >
            <Twitter size={20} />
            <span>Twitter/X</span>
          </a>
        </div>

        {/* Web Share API option if supported */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            style={{
              width: '100%',
              marginTop: '12px',
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontFamily: 'inherit',
            }}
          >
            <Share2 size={15} /> More Options
          </button>
        )}
      </div>
    </div>
  );
};
