'use client';

import React, { useState } from 'react';
import { CTHeader, CTButton } from './Shared';
import { Chico, chicoStateFromSavings } from './Chico';
import { BubbleEditSheet } from './ChicoBubbles';
import { Palette, CT_SEMANTIC } from '@/lib/tokens';
import { Allocation } from '@/lib/types';

interface CoachScreenProps {
  palette: Palette;
  income: number;
  savingsPct: number;
  onSavingsChange: (v: number) => void;
  allocations: Allocation[];
  onAddAllocation: (a: Allocation) => void;
  onRemoveAllocation: (id: string | number) => void;
  onBack: () => void;
}

export function CoachScreen({
  palette, income, savingsPct, onSavingsChange,
  allocations, onAddAllocation, onRemoveAllocation,
  onBack,
}: CoachScreenProps) {
  const p = palette;
  const takeHome = Math.round(income * 0.84);
  const allocTotal = allocations.reduce((s, a) => s + a.amount, 0);
  const remaining = Math.max(0, takeHome - allocTotal);
  const savingsAmt = Math.round(remaining * savingsPct);
  const truePct = takeHome > 0 ? savingsAmt / takeHome : 0;
  const state = chicoStateFromSavings(truePct);

  const [messages, setMessages] = useState([
    { from: 'chico', text: "Hey, real talk. Want to plan how we hit your goal?" },
  ]);
  const [showAdjuster, setShowAdjuster] = useState(false);
  const [adjusting, setAdjusting] = useState<Allocation | null>(null);

  const log = (msg: { from: string; text: string }) => setMessages(m => [...m, msg]);

  const ask = (q: { label: string; reply: string }) => {
    log({ from: 'me', text: q.label });
    setTimeout(() => log({ from: 'chico', text: q.reply }), 350);
  };

  const QUICK = [
    { label: "Can I hit ₱100k this year?",
      reply: takeHome * 12 * 0.18 >= 100000
        ? `At your pace, ₱${(savingsAmt * 12).toLocaleString()}/yr. You're on track. 🍌`
        : `Right now: ₱${(savingsAmt * 12).toLocaleString()}/yr. Need to bump savings ~5% or trim a bubble.` },
    { label: "What should I cut first?",
      reply: allocations.length === 0
        ? "Nothing to cut yet — drag some expenses in first."
        : `Honestly? '${[...allocations].sort((a,b)=>b.amount-a.amount)[0].label}' is your biggest one. Worth a look.` },
    { label: "I got a raise!",
      reply: "Niiice. Tap the income field — bump it up, and I'll reflect it everywhere." },
    { label: "Surprise expense came up",
      reply: "Happens. Tap any bubble in your list to adjust it, or add a new one." },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
      <div className="md:hidden">
        <CTHeader palette={p} title="Talk to Chico" onBack={onBack} />
      </div>

      <div className="flex-1 flex flex-col w-full max-w-2xl mx-auto md:py-6 h-full overflow-hidden">
        <div className="hidden md:flex justify-between items-center mb-6 px-4">
          <div className="font-serif text-3xl text-ct-ink">Talk to Chico</div>
          <button onClick={onBack} className="text-sm font-medium text-ct-inkSoft hover:text-ct-ink transition-colors cursor-pointer bg-transparent border-none">
            Close ✕
          </button>
        </div>

        <div className="mx-4 md:mx-0 p-4 md:p-5 rounded-[18px] md:rounded-[24px] bg-ct-bgCard border border-ct-line flex gap-4 items-center shadow-sm shrink-0 mt-2 md:mt-0">
          <Chico state={state} size={72} />
          <div className="flex-1 min-w-0">
            <div className="text-[11px] md:text-xs text-ct-inkMuted uppercase tracking-wider font-semibold">
              Saving rate
            </div>
            <div className="font-serif text-[28px] md:text-[32px] text-ct-ink leading-none mt-1 tabular-nums">
              {Math.round(truePct * 100)}%
            </div>
            <div className="text-xs md:text-sm text-ct-inkSoft mt-1">
              ₱{savingsAmt.toLocaleString()}/mo · ₱{(savingsAmt * 12).toLocaleString()}/yr
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-3 min-h-0">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[85%] p-3.5 md:p-4 rounded-[20px] text-[14px] md:text-[15px] leading-relaxed shadow-sm ${
              m.from === 'me' 
                ? 'self-end bg-ct-ink text-ct-bg rounded-br-[6px]' 
                : 'self-start bg-ct-bgCard text-ct-ink border border-ct-line rounded-bl-[6px]'
            }`}>
              {m.text}
            </div>
          ))}
        </div>

        <div className="px-4 md:px-0 pb-2 md:pb-4 flex gap-2 flex-wrap shrink-0">
          {QUICK.map((q, i) => (
            <button key={i} onClick={() => ask(q)} 
              className="px-4 py-2.5 rounded-full bg-ct-bgCard hover:bg-ct-line/30 border border-ct-line text-ct-ink text-[13px] md:text-sm font-medium cursor-pointer transition-colors shadow-sm">
              {q.label}
            </button>
          ))}
        </div>

        <div className="mx-4 md:mx-0 mb-3 md:mb-6 p-3 md:p-4 rounded-[16px] md:rounded-[20px] bg-ct-amberSoft border border-ct-amber/20 flex items-center gap-3 md:gap-4 shrink-0 shadow-sm">
          <span className="text-[20px] md:text-[24px]">⚡</span>
          <div className="flex-1 text-[13px] md:text-[14px] text-ct-ink font-medium leading-tight">
            Something change today?
          </div>
          <button onClick={() => setShowAdjuster(true)} 
            className="px-4 py-2 md:px-5 md:py-2.5 rounded-full border-none bg-ct-ink hover:bg-black text-ct-bg text-[12px] md:text-[13px] font-semibold cursor-pointer transition-colors shadow-sm whitespace-nowrap">
            Adjust budget
          </button>
        </div>

        <div className="px-4 md:hidden pb-4 shrink-0">
          <CTButton palette={p} label="Done · back to insights" onClick={onBack} />
        </div>
      </div>

      {showAdjuster && (
        <BudgetAdjusterSheet
          palette={p}
          allocations={allocations}
          savingsPct={savingsPct}
          onSavingsChange={onSavingsChange}
          onEditAlloc={(a: Allocation) => { setAdjusting(a); }}
          onRemove={onRemoveAllocation}
          onClose={() => setShowAdjuster(false)} />
      )}
      {adjusting && (
        <BubbleEditSheet palette={p} bubble={{ ...adjusting, mode: 'edit' }}
          onSave={(u) => { onAddAllocation(u); setAdjusting(null); }}
          onCancel={() => setAdjusting(null)} />
      )}
    </div>
  );
}

function BudgetAdjusterSheet({ palette, allocations, savingsPct, onSavingsChange, onEditAlloc, onRemove, onClose }: any) {
  const p = palette;
  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(20,15,8,0.45)',
        zIndex: 200, animation: 'scrim-in .2s ease',
        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 201,
        background: p.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '12px 20px 20px', boxShadow: '0 -20px 40px rgba(0,0,0,0.2)',
        animation: 'sheet-up .28s cubic-bezier(.2,.8,.3,1)',
        maxHeight: '85%', overflow: 'auto',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: p.line, margin: '0 auto 12px' }} />
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: p.ink, marginBottom: 4 }}>
          Adjust on the fly
        </div>
        <div style={{ fontSize: 12, color: p.inkSoft, marginBottom: 14, lineHeight: 1.4 }}>
          Got a bonus or a surprise bill? Tweak any expense, or shift your savings rate.
        </div>

        <div style={{ padding: '12px 14px', borderRadius: 14, background: p.bgCard, border: `1px solid ${p.line}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Savings rate</span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: CT_SEMANTIC.win, fontVariantNumeric: 'tabular-nums' }}>
              {Math.round(savingsPct * 100)}%
            </span>
          </div>
          <input type="range" min={0} max={0.6} step={0.01} value={savingsPct}
            onChange={(e) => onSavingsChange(Number(e.target.value))}
            style={{ width: '100%', marginTop: 8, accentColor: CT_SEMANTIC.win }} />
        </div>

        <div style={{ marginTop: 14, fontSize: 11, color: p.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
          Your expenses · tap to edit
        </div>
        {allocations.length === 0 ? (
          <div style={{ fontSize: 12, color: p.inkMuted, padding: '14px', textAlign: 'center', border: `1.5px dashed ${p.line}`, borderRadius: 14 }}>
            None yet — go add a bubble.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {allocations.map((a: Allocation) => (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 12,
                background: p.bgCard, border: `1px solid ${p.line}`,
              }}>
                <span style={{ fontSize: 22 }}>{a.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: p.ink }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: a.color, fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
                    ₱{a.amount.toLocaleString()}/mo
                  </div>
                </div>
                <button onClick={() => onEditAlloc(a)} style={{
                  padding: '6px 10px', borderRadius: 999, border: `1px solid ${p.line}`,
                  background: 'transparent', color: p.ink, fontSize: 11, cursor: 'pointer',
                }}>Edit</button>
                <button onClick={() => onRemove(a.id)} style={{
                  border: 'none', background: 'transparent', color: p.inkMuted,
                  fontSize: 18, cursor: 'pointer', padding: 4,
                }}>×</button>
              </div>
            ))}
          </div>
        )}

        <button onClick={onClose} style={{
          width: '100%', marginTop: 16, padding: '13px', borderRadius: 14,
          background: p.ink, border: 'none', color: p.bg,
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>Done</button>
      </div>
    </>
  );
}
