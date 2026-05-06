'use client';

import React, { useState } from 'react';
import { CTHeader, CTButton } from './Shared';
import { Chico } from './Chico';
import { FatSlider } from './ScreenSlider';
import { Palette, peso, CT_SEMANTIC } from '@/lib/tokens';
import { useCountTo } from '@/lib/hooks';

export const DREAM_LIBRARY = [
  { id: 'boracay',  emoji: '🏝',  label: 'Boracay trip',     target: 45000,   tone: 'aspirational',
    img: 'linear-gradient(135deg, #7DD3FC 0%, #FED7AA 60%, #FECACA 100%)' },
  { id: 'iphone',   emoji: '📱',  label: 'New phone',         target: 65000,   tone: 'aspirational',
    img: 'linear-gradient(135deg, #1F2937 0%, #4B5563 50%, #9CA3AF 100%)' },
  { id: 'condo',    emoji: '🏢',  label: 'Condo down pynt',   target: 350000,  tone: 'practical',
    img: 'linear-gradient(160deg, #93C5FD 0%, #DBEAFE 40%, #F3F4F6 100%)' },
  { id: 'japan',    emoji: '⛩',  label: 'Japan trip',        target: 120000,  tone: 'aspirational',
    img: 'linear-gradient(135deg, #FCA5A5 0%, #FECACA 50%, #FEF3C7 100%)' },
  { id: 'emergency',emoji: '🛟',  label: 'Emergency fund',    target: 180000,  tone: 'practical',
    img: 'linear-gradient(135deg, #34D399 0%, #A7F3D0 50%, #FEF3C7 100%)' },
  { id: 'wedding',  emoji: '💍',  label: 'Wedding',           target: 400000,  tone: 'practical',
    img: 'linear-gradient(135deg, #F9A8D4 0%, #FBCFE8 50%, #FEF3C7 100%)' },
];

interface DreamTrackerScreenProps {
  palette: Palette;
  monthlySavings: number;
  onBack: () => void;
  onNext: () => void;
}

export function DreamTrackerScreen({ palette, monthlySavings, onBack, onNext }: DreamTrackerScreenProps) {
  const p = palette;
  const [activeId, setActiveId] = useState('boracay');
  const [progress, setProgress] = useState<Record<string, number>>({
    boracay: 0.65, iphone: 0.32, condo: 0.08, japan: 0.18, emergency: 0.42, wedding: 0.05,
  });

  const active = DREAM_LIBRARY.find(d => d.id === activeId)!;
  const pct = progress[activeId] || 0;
  const saved = Math.round(active.target * pct);
  const monthsLeft = monthlySavings > 0 ? Math.ceil((active.target - saved) / monthlySavings) : 99;

  const animSaved = useCountTo(saved, 500);
  const animPct = useCountTo(pct, 500);

  const blurPx = Math.max(0, (1 - animPct) * 22);
  const grayscale = Math.max(0, (1 - animPct) * 80);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden w-full">
      <div className="md:hidden">
        <CTHeader palette={p} title="Your dreams" onBack={onBack} />
      </div>

      <div className="flex-1 flex flex-col md:flex-row w-full max-w-6xl mx-auto px-6 md:px-12 py-4 gap-8 md:gap-16">
        
        {/* Left Column: Dream Focus */}
        <div className="flex flex-col w-full max-w-md mx-auto md:max-w-none md:flex-1 md:justify-center">
          <div className="relative h-[240px] md:h-[320px] rounded-[22px] md:rounded-[32px] overflow-hidden border border-ct-line shadow-lg"
            style={{ boxShadow: '0 12px 30px rgba(42,31,18,0.12)' }}>
            <div className="absolute -inset-[30px] transition-all duration-500 ease-in-out"
              style={{
                background: active.img,
                filter: `blur(${blurPx}px) grayscale(${grayscale}%)`,
              }} />
            <div className="absolute inset-0"
              style={{
                background: 'repeating-linear-gradient(45deg, transparent 0 12px, rgba(255,255,255,0.04) 12px 24px)',
                mixBlendMode: 'overlay',
              }} />
            <div className="absolute left-0 right-0 bottom-0 h-[120px] md:h-[160px]"
              style={{
                background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.55))',
              }} />
            <div className="absolute inset-0 flex items-center justify-center text-[80px] md:text-[100px] transition-opacity duration-500 drop-shadow-xl"
              style={{ opacity: Math.max(0.25, 1 - animPct) }}>
              {active.emoji}
            </div>
            <div className="absolute left-4 right-4 bottom-4 md:left-6 md:bottom-6 text-white">
              <div className="text-[11px] md:text-xs opacity-85 uppercase tracking-[1.5px] font-semibold">
                Coming into focus
              </div>
              <div className="font-serif text-[26px] md:text-[36px] leading-tight mt-1">
                {active.label}
              </div>
            </div>
            <div className="absolute top-4 right-4 md:top-6 md:right-6 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[13px] md:text-sm font-semibold text-ct-ink tabular-nums shadow-sm"
              style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)' }}>
              {Math.round(animPct * 100)}%
            </div>
          </div>

          <div className="flex justify-between items-baseline mt-5 md:mt-8 px-2">
            <div>
              <div className="text-[11px] md:text-xs text-ct-inkMuted uppercase tracking-wider font-semibold">Saved</div>
              <div className="font-serif text-[24px] md:text-[32px] text-ct-ink tabular-nums">
                {peso(animSaved)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] md:text-xs text-ct-inkMuted uppercase tracking-wider font-semibold">Goal</div>
              <div className="font-serif text-[24px] md:text-[32px] text-ct-inkSoft tabular-nums">
                {peso(active.target)}
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-6 p-3 md:p-4 rounded-[16px] bg-ct-bgCard border border-ct-line flex items-center gap-3 text-[13px] md:text-sm text-ct-inkSoft shadow-sm">
            <Chico state={pct >= 0.5 ? 'thriving' : 'okay'} size={40} animate={false} />
            <span className="leading-relaxed">
              At <b className="text-ct-ink font-semibold">{peso(monthlySavings)}/mo</b>, ~
              <b className="font-semibold" style={{ color: CT_SEMANTIC.dream }}> {monthsLeft} months</b> until banana time.
            </span>
          </div>
        </div>

        {/* Right Column: Library & Controls */}
        <div className="flex flex-col w-full max-w-md mx-auto md:max-w-none md:flex-1 md:justify-center mt-6 md:mt-0">
          
          <div className="text-[12px] md:text-sm text-ct-inkMuted uppercase tracking-wider font-semibold mb-3 px-2">
            Switch dream
          </div>
          
          {/* Desktop Grid / Mobile Horizontal Scroll */}
          <div className="flex md:grid md:grid-cols-2 gap-3 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
            {DREAM_LIBRARY.map(d => {
              const isActive = d.id === activeId;
              const dpct = progress[d.id] || 0;
              return (
                <button key={d.id} onClick={() => setActiveId(d.id)}
                  className={`flex-shrink-0 w-[120px] md:w-auto p-3 md:p-4 rounded-[16px] border text-left font-sans transition-all duration-200 ${
                    isActive ? 'bg-ct-ink border-ct-ink text-ct-bg shadow-md scale-[1.02]' : 'bg-ct-bgCard border-ct-line text-ct-ink hover:border-ct-inkMuted'
                  }`}>
                  <div className="text-[24px] md:text-[28px]">{d.emoji}</div>
                  <div className="text-[12px] md:text-sm mt-2 font-semibold leading-tight">{d.label}</div>
                  <div className="mt-2 h-1 md:h-1.5 rounded-full overflow-hidden" style={{ background: isActive ? 'rgba(255,255,255,0.2)' : p.line }}>
                    <div className="h-full transition-all duration-500 ease-out" style={{ width: `${dpct * 100}%`, background: CT_SEMANTIC.dream }} />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 px-2 md:px-0">
            <div className="text-[12px] md:text-sm text-ct-inkMuted mb-3 tracking-wide">
              Drag to preview future progress
            </div>
            <FatSlider
              value={pct} max={1}
              onChange={(v: number) => setProgress(prev => ({ ...prev, [activeId]: v }))}
              state={pct >= 0.5 ? 'thriving' : 'okay'} p={p} />
          </div>

          <div className="flex-1 md:flex-none md:h-12" />
          <div className="mt-10 px-2 md:px-0 w-full">
            <CTButton palette={p} label="See my insights →" onClick={onNext} />
          </div>
          <div className="h-6" />
        </div>

      </div>
    </div>
  );
}
