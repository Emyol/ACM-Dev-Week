'use client';

import React from 'react';
import { Palette, CT_SEMANTIC } from '@/lib/tokens';

interface CTHeaderProps {
  palette: Palette;
  title: string;
  right?: React.ReactNode;
  onBack?: () => void;
}

export function CTHeader({ palette, title, right, onBack }: CTHeaderProps) {
  const p = palette;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 18px 6px',
    }}>
      {onBack ? (
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 18, border: 'none',
          background: p.bgCard, color: p.ink, fontSize: 18, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>←</button>
      ) : (
        <div style={{
          width: 36, height: 36, borderRadius: 12, background: CT_SEMANTIC.amber,
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600,
        }}>C</div>
      )}
      <div style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 14, color: p.inkSoft }}>
        {title}
      </div>
      {right}
    </div>
  );
}

interface CTButtonProps {
  palette: Palette;
  onClick: () => void;
  label: string;
  variant?: 'primary' | 'secondary';
}

export function CTButton({ palette, onClick, label, variant = 'primary' }: CTButtonProps) {
  const p = palette;
  const isPrimary = variant === 'primary';
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: '16px 22px',
      borderRadius: 18, border: 'none',
      background: isPrimary ? p.ink : 'transparent',
      color: isPrimary ? p.bg : p.ink,
      fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-sans)',
      cursor: 'pointer', letterSpacing: 0.2,
      boxShadow: isPrimary ? '0 8px 24px rgba(42,31,18,0.25)' : 'none',
      transition: 'transform .15s ease',
    }}
    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >{label}</button>
  );
}
