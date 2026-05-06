'use client';

import React, { useRef, useState, useEffect } from 'react';
import { CTHeader, CTButton } from './Shared';
import { BubbleStage, DroppableChico, AllocationStack } from './ChicoBubbles';
import { Palette, peso, CT_SEMANTIC } from '@/lib/tokens';
import { chicoStateFromSavings, chicoLine, ChicoState } from './Chico';
import { Allocation } from '@/lib/types';
import { useCountTo } from '@/lib/hooks';

interface SavingsSliderScreenProps {
  palette: Palette;
  income: number;
  savingsPct: number;
  onSavingsChange: (v: number) => void;
  forcedState?: ChicoState | 'auto' | null;
  variant?: 'classic' | 'split' | 'dial';
  onNext: () => void;
  onBack: () => void;
  allocations?: Allocation[];
  onAddAllocation: (a: Allocation) => void;
  onRemoveAllocation: (id: string | number) => void;
}

export function SavingsSliderScreen({
  palette, income, savingsPct, onSavingsChange,
  forcedState = null, variant = 'classic', onNext, onBack,
  allocations = [], onAddAllocation, onRemoveAllocation,
}: SavingsSliderScreenProps) {
  const p = palette;
  const takeHome = Math.round(income * 0.84);

  const allocTotal = allocations.reduce((s, a) => s + a.amount, 0);
  const remaining = Math.max(0, takeHome - allocTotal);
  const savingsAmount = Math.round(remaining * savingsPct);
  const spendingAmount = remaining - savingsAmount;

  const truePct = takeHome > 0 ? savingsAmount / takeHome : 0;
  const state = (forcedState && forcedState !== 'auto') ? forcedState : chicoStateFromSavings(truePct);

  const animSavings = useCountTo(savingsAmount, 350);
  const animSpending = useCountTo(spendingAmount, 350);

  const [seed, setSeed] = useState(0);
  const lastStateRef = useRef(state);
  useEffect(() => {
    if (lastStateRef.current !== state) {
      setSeed(s => s + 1);
      lastStateRef.current = state;
    }
  }, [state]);

  const line = chicoLine(state, seed);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
      <div className="md:hidden">
        <CTHeader palette={p} title="How much will you save?" onBack={onBack} />
      </div>

      <BubbleStage palette={p} allocations={allocations}
        onAdd={onAddAllocation} onRemove={onRemoveAllocation}
        onEditAllocation={onAddAllocation}
        chicoState={state}>
        {variant === 'classic' && (
          <ClassicLayout p={p} state={state} line={line}
            animSavings={animSavings} animSpending={animSpending}
            savingsPct={savingsPct} onSavingsChange={onSavingsChange}
            takeHome={takeHome} onNext={onNext}
            allocations={allocations} onRemoveAllocation={onRemoveAllocation} />
        )}
        {variant === 'split' && (
          <SplitLayout p={p} state={state} line={line}
            animSavings={animSavings} animSpending={animSpending}
            savingsPct={savingsPct} onSavingsChange={onSavingsChange}
            takeHome={takeHome} onNext={onNext}
            allocations={allocations} onRemoveAllocation={onRemoveAllocation} />
        )}
        {variant === 'dial' && (
          <DialLayout p={p} state={state} line={line}
            animSavings={animSavings} animSpending={animSpending}
            savingsPct={savingsPct} onSavingsChange={onSavingsChange}
            takeHome={takeHome} onNext={onNext}
            allocations={allocations} onRemoveAllocation={onRemoveAllocation} />
        )}
      </BubbleStage>
    </div>
  );
}

function ClassicLayout({ p, state, line, animSavings, animSpending, savingsPct, onSavingsChange, takeHome, onNext, allocations, onRemoveAllocation }: any) {
  return (
    <div className="flex-1 flex flex-col md:flex-row w-full max-w-6xl mx-auto px-6 md:px-12 py-4 gap-8 md:gap-16 overflow-y-auto">
      {/* Left Column (Chico) */}
      <div className="flex flex-col items-center justify-center md:flex-1 md:order-1 pt-4 md:pt-0">
        <div className="relative flex justify-center items-end h-[200px] md:h-[280px]">
          <DroppableChico state={state} size={220} />
        </div>
        <SpeechBubble p={p} text={line} state={state} />
      </div>

      {/* Right Column (Controls) */}
      <div className="flex flex-col md:flex-1 md:justify-center md:order-2 w-full max-w-md mx-auto">
        <div className="text-center mt-6 md:mt-0">
          <div className="font-serif text-[56px] md:text-[64px] leading-none text-ct-ink tracking-tight tabular-nums">
            {peso(animSavings)}
          </div>
          <div className="text-[13px] md:text-[15px] text-ct-inkSoft mt-2 tracking-wide">
            to save · <span className="text-ct-win font-semibold">{Math.round(savingsPct * 100)}%</span> of take-home
          </div>
        </div>

        <div className="mt-8 px-2 md:px-0">
          <FatSlider value={savingsPct} onChange={onSavingsChange} state={state} p={p} />
          <div className="flex justify-between mt-3 text-[11px] md:text-sm text-ct-inkMuted tracking-wide">
            <span>0%</span><span>20%</span><span>40%</span><span>60%+</span>
          </div>
        </div>

        <div className="mt-8 md:mt-10">
          <AllocationStack palette={p} allocations={allocations} onRemove={onRemoveAllocation} />
        </div>

        <div className="flex-1 md:flex-none md:h-12" />
        <div className="mt-8 w-full">
          <CTButton palette={p} label="Lock it in →" onClick={onNext} />
        </div>
        <div className="h-6" />
      </div>
    </div>
  );
}

function SplitLayout({ p, state, line, animSavings, animSpending, savingsPct, onSavingsChange, takeHome, onNext, allocations, onRemoveAllocation }: any) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4px 80px 0 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 6 }}>
        <DroppableChico state={state} size={120} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
            Take-home
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 32, lineHeight: 1, color: p.ink }}>
            {peso(takeHome)}
          </div>
          <div style={{
            marginTop: 8, fontSize: 13, color: p.inkSoft, lineHeight: 1.4,
            fontStyle: 'italic',
          }}>
            "{line}"
          </div>
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <div style={{
          display: 'flex', height: 72, borderRadius: 16, overflow: 'hidden',
          border: `1px solid ${p.line}`, position: 'relative',
        }}>
          <div style={{
            width: `${savingsPct * 100}%`, background: CT_SEMANTIC.win,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '0 14px', transition: 'width .25s ease', minWidth: 0,
          }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.85)', textTransform: 'uppercase', letterSpacing: 1 }}>
              Save
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: '#fff', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
              {peso(animSavings)}
            </div>
          </div>
          <div style={{
            flex: 1, background: CT_SEMANTIC.amberSoft,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '0 14px', alignItems: 'flex-end', minWidth: 0,
          }}>
            <div style={{ fontSize: 10, color: p.inkSoft, textTransform: 'uppercase', letterSpacing: 1 }}>
              Spend
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: p.ink, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
              {peso(animSpending)}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: p.inkSoft }}>Drag to adjust</span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: p.ink, fontVariantNumeric: 'tabular-nums' }}>
              {Math.round(savingsPct * 100)}%
            </span>
          </div>
          <FatSlider value={savingsPct} onChange={onSavingsChange} state={state} p={p} />
        </div>
      </div>

      <div style={{
        marginTop: 18, padding: 18, borderRadius: 18,
        background: state === 'rich' ? CT_SEMANTIC.winSoft :
                    state === 'shocked' ? CT_SEMANTIC.dangerSoft : p.bgCard,
        border: `1px solid ${p.line}`, transition: 'background .25s',
      }}>
        <div style={{ fontSize: 12, color: p.inkSoft, textTransform: 'uppercase', letterSpacing: 1 }}>
          In 12 months you'll have
        </div>
        <div style={{
          fontFamily: 'var(--font-serif)', fontSize: 42, color: p.ink, marginTop: 4,
          fontVariantNumeric: 'tabular-nums', letterSpacing: -0.5,
        }}>
          {peso(animSavings * 12)}
        </div>
        <div style={{ fontSize: 13, color: p.inkSoft, marginTop: 4 }}>
          That's {Math.round((animSavings * 12) / 5000)} round-trip flights to Cebu, give or take.
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <AllocationStack palette={p} allocations={allocations} onRemove={onRemoveAllocation} />
      </div>

      <div style={{ flex: 1 }} />
      <CTButton palette={p} label="Lock it in →" onClick={onNext} />
      <div style={{ height: 16 }} />
    </div>
  );
}

function DialLayout({ p, state, line, animSavings, animSpending, savingsPct, onSavingsChange, takeHome, onNext, allocations, onRemoveAllocation }: any) {
  const dialRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const angleAt = (clientX: number, clientY: number) => {
    if (!dialRef.current) return savingsPct;
    const r = dialRef.current.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const dx = clientX - cx, dy = clientY - cy;
    let a = Math.atan2(dx, -dy) * 180 / Math.PI;
    a = Math.max(-135, Math.min(135, a));
    return (a + 135) / 270;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    onSavingsChange(angleAt(e.clientX, e.clientY));
    const move = (ev: PointerEvent) => onSavingsChange(angleAt(ev.clientX, ev.clientY));
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const R = 110, CX = 130, CY = 130;
  const angleDeg = -135 + savingsPct * 270;
  const angleRad = (angleDeg - 90) * Math.PI / 180;
  const handleX = CX + R * Math.cos(angleRad);
  const handleY = CY + R * Math.sin(angleRad);

  const arcPath = (start: number, end: number) => {
    const sR = (start - 90) * Math.PI / 180;
    const eR = (end - 90) * Math.PI / 180;
    const x1 = CX + R * Math.cos(sR), y1 = CY + R * Math.sin(sR);
    const x2 = CX + R * Math.cos(eR), y2 = CY + R * Math.sin(eR);
    const large = end - start > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`;
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4px 80px 0 24px', alignItems: 'center' }}>
      <div ref={dialRef} onPointerDown={onPointerDown}
        style={{
          position: 'relative', width: 260, height: 260, marginTop: 6,
          touchAction: 'none', cursor: dragging ? 'grabbing' : 'grab',
        }}>
        <svg width="260" height="260" viewBox="0 0 260 260" style={{ position: 'absolute', inset: 0 }}>
          <path d={arcPath(-135, 135)} fill="none" stroke={p.line} strokeWidth="14" strokeLinecap="round" />
          <path d={arcPath(-135, angleDeg)} fill="none"
                stroke={state === 'shocked' || state === 'stressed' ? CT_SEMANTIC.danger : CT_SEMANTIC.win}
                strokeWidth="14" strokeLinecap="round" style={{ transition: 'stroke .25s' }} />
          {[0.25, 0.5, 0.75].map((t, i) => {
            const a = (-135 + t * 270 - 90) * Math.PI / 180;
            const x1 = CX + (R - 12) * Math.cos(a), y1 = CY + (R - 12) * Math.sin(a);
            const x2 = CX + (R + 12) * Math.cos(a), y2 = CY + (R + 12) * Math.sin(a);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={p.inkMuted} strokeWidth="1" />;
          })}
          <circle cx={handleX} cy={handleY} r="14" fill="#fff"
                  stroke={state === 'shocked' || state === 'stressed' ? CT_SEMANTIC.danger : CT_SEMANTIC.win}
                  strokeWidth="3" />
        </svg>

        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <DroppableChico state={state} size={150} />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 4 }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 44, color: p.ink, lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.5 }}>
          {Math.round(savingsPct * 100)}%
        </div>
        <div style={{ fontSize: 13, color: p.inkSoft, marginTop: 4 }}>
          {peso(animSavings)} · per month
        </div>
      </div>

      <div style={{
        marginTop: 14, padding: '12px 18px', borderRadius: 999,
        background: p.bgCard, border: `1px solid ${p.line}`,
        fontSize: 13, color: p.ink, fontStyle: 'italic', maxWidth: 320, textAlign: 'center',
      }}>
        "{line}"
      </div>

      <div style={{ width: '100%', marginTop: 14 }}>
        <AllocationStack palette={p} allocations={allocations} onRemove={onRemoveAllocation} />
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ width: '100%' }}>
        <CTButton palette={p} label="Lock it in →" onClick={onNext} />
      </div>
      <div style={{ height: 16 }} />
    </div>
  );
}

export function FatSlider({ value, onChange, state, p, max = 0.6 }: any) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const valueAt = (clientX: number) => {
    if (!trackRef.current) return value;
    const r = trackRef.current.getBoundingClientRect();
    const t = (clientX - r.left) / r.width;
    return Math.max(0, Math.min(max, t * max));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    onChange(valueAt(e.clientX));
    const move = (ev: PointerEvent) => onChange(valueAt(ev.clientX));
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const pct = (value / max) * 100;
  const fillColor =
    state === 'rich'     ? CT_SEMANTIC.win :
    state === 'thriving' ? CT_SEMANTIC.win :
    state === 'okay'     ? CT_SEMANTIC.amber :
    state === 'stressed' ? CT_SEMANTIC.danger :
    /* shocked */          CT_SEMANTIC.danger;

  return (
    <div ref={trackRef} onPointerDown={onPointerDown}
      style={{
        position: 'relative', height: 44, cursor: dragging ? 'grabbing' : 'grab',
        touchAction: 'none', userSelect: 'none',
      }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)',
        height: 14, borderRadius: 999, background: p.line,
      }} />
      <div style={{
        position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
        height: 14, width: `${pct}%`, borderRadius: 999, background: fillColor,
        transition: dragging ? 'none' : 'background .25s',
      }} />
      <div style={{
        position: 'absolute', left: `${pct}%`, top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 32, height: 32, borderRadius: '50%', background: '#fff',
        border: `3px solid ${fillColor}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
        transition: dragging ? 'none' : 'border-color .25s',
      }} />
    </div>
  );
}

export function SpeechBubble({ p, text, state }: any) {
  const bg = p.bgCard;
  return (
    <div style={{
      margin: '4px auto 0', maxWidth: 320, padding: '10px 16px',
      background: bg, border: `1px solid ${p.line}`,
      borderRadius: 18, position: 'relative',
      fontSize: 14, color: p.ink, textAlign: 'center', fontStyle: 'italic',
      lineHeight: 1.35,
    }}>
      <div style={{
        position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%) rotate(45deg)',
        width: 12, height: 12, background: bg,
        borderTop: `1px solid ${p.line}`, borderLeft: `1px solid ${p.line}`,
      }} />
      "{text}"
    </div>
  );
}
