'use client';

import React, { useState } from 'react';
import { CTHeader } from './Shared';
import { Chico, chicoStateFromSavings } from './Chico';
import { Palette, peso, CT_SEMANTIC } from '@/lib/tokens';
import { Allocation } from '@/lib/types';
import { BubbleEditSheet } from './ChicoBubbles';

interface InsightsScreenProps {
  palette: Palette;
  income: number;
  savingsPct: number;
  allocations: Allocation[];
  onSavingsChange: (v: number) => void;
  onAddAllocation: (a: Allocation) => void;
  onRemoveAllocation: (id: string | number) => void;
  onBack: () => void;
  onRestart: () => void;
  onTalk: () => void;
}

export function InsightsScreen({ 
  palette, income, savingsPct, allocations, 
  onSavingsChange, onAddAllocation, onRemoveAllocation,
  onBack, onRestart, onTalk 
}: InsightsScreenProps) {
  const p = palette;
  const takeHome = Math.round(income * 0.84);
  const monthly = Math.round(takeHome * savingsPct);
  const annual = monthly * 12;
  const state = chicoStateFromSavings(takeHome > 0 ? monthly / takeHome : 0);

  const [adjusting, setAdjusting] = useState<Allocation | null>(null);

  const spend = takeHome - monthly;
  
  const allocTotal = allocations.reduce((s, a) => s + a.amount, 0);
  let categories = allocations.map(a => ({
    id: a.id,
    label: a.label,
    amount: a.amount,
    pct: takeHome > 0 ? a.amount / takeHome : 0,
    color: a.color,
    emoji: a.emoji
  }));

  // If no allocations, show placeholder for visual structure
  if (categories.length === 0) {
    categories = [
      { id: '1', label: 'Unallocated Spend', amount: spend, pct: takeHome > 0 ? spend / takeHome : 0, color: p.inkMuted, emoji: '❔' },
    ];
  }

  const insights = [
    {
      title: state === 'rich' ? "You're saving like a banana baron" :
             state === 'thriving' ? "You're outsaving most of your peers" :
             state === 'okay' ? "You're saving less than the recommended 20%" :
             state === 'stressed' ? "You're cutting it pretty close" :
             "We need to have a chat",
      body: state === 'rich' ? `At this pace you'll hit a million in ${Math.ceil(1000000/(monthly || 1))} months. I'm proud. I'm a proud monkey.` :
            state === 'thriving' ? `Your annual rate of ${peso(annual)} compounds beautifully. Keep climbing.` :
            state === 'okay' ? `Bumping savings to 20% would mean ${peso(takeHome*0.2)}/mo — that's ${peso((takeHome*0.2 - monthly)*12)} more per year.` :
            state === 'stressed' ? `Less than 12% is risky territory. One emergency could undo a year of progress.` :
            `Saving under 5% means no buffer. Let's find ₱2,000/mo to start. I believe in you.`,
      tone: state === 'rich' || state === 'thriving' ? 'win' : state === 'okay' ? 'amber' : 'danger',
    },
    {
      title: "If you started today",
      body: `By age 60 (assuming 6% growth), this rate compounds to roughly ${peso(annual * 38)}. That's a coconut farm. Maybe two.`,
      tone: 'win',
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden w-full">
      <div className="md:hidden">
        <CTHeader palette={p} title="Insights" onBack={onBack} />
      </div>

      <div className="flex-1 flex flex-col xl:flex-row w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 gap-6 xl:gap-12">
        
        {/* Left Column: Insights & Breakdown */}
        <div className="flex-1 flex flex-col gap-6 max-w-3xl w-full mx-auto xl:mx-0">
          
          <div className="flex items-center gap-4 px-2">
            <div className="w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] flex-shrink-0">
              <Chico state={state} size="100%" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] sm:text-xs text-ct-inkMuted uppercase tracking-wider font-semibold">
                This month, Chico says
              </div>
              <div className="font-serif text-2xl sm:text-[28px] leading-tight text-ct-ink mt-1">
                {state === 'rich' ? "Magnificent." :
                 state === 'thriving' ? "We're doing the thing." :
                 state === 'okay' ? "We could do better." :
                 state === 'stressed' ? "I'm worried." :
                 "Banana red alert."}
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-[24px] bg-ct-bgCard border border-ct-line shadow-sm">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-ct-inkMuted uppercase tracking-wider font-semibold">
                Saving rate
              </span>
              <span className="text-sm font-bold text-ct-win">
                {Math.round(savingsPct * 100)}%
              </span>
            </div>
            <div className="font-serif text-[42px] sm:text-[56px] text-ct-ink mt-1 tabular-nums tracking-tight leading-none">
              {peso(monthly)} <span className="text-lg sm:text-2xl text-ct-inkSoft font-sans tracking-normal">/mo</span>
            </div>

            <div className="mt-6 sm:mt-8">
              <div className="flex h-3 sm:h-4 rounded-full overflow-hidden bg-ct-line/30">
                {categories.map((c, i) => (
                  <div key={i} style={{ flex: c.pct, background: c.color }} className="transition-all duration-300" />
                ))}
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-ct-inkSoft">
                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: c.color }} />
                    <span className="flex-1 truncate">{c.label}</span>
                    <span className="tabular-nums font-medium text-ct-ink">{peso(c.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-xs text-ct-inkMuted uppercase tracking-wider font-semibold px-2">
              Chico's takes
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((ins, i) => {
                const accent = ins.tone === 'win' ? CT_SEMANTIC.win :
                               ins.tone === 'danger' ? CT_SEMANTIC.danger :
                               CT_SEMANTIC.amber;
                return (
                  <div key={i} className="p-4 sm:p-5 rounded-[20px] bg-ct-bgCard border border-ct-line relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 left-0 bottom-0 w-1.5" style={{ background: accent }} />
                    <div className="pl-2">
                      <div className="font-serif text-lg sm:text-[20px] text-ct-ink leading-tight">
                        {ins.title}
                      </div>
                      <div className="text-sm text-ct-inkSoft mt-2 leading-relaxed">
                        {ins.body}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Inline Budget Adjuster for Desktop */}
        <div className="flex-1 flex flex-col w-full max-w-3xl xl:max-w-md mx-auto xl:mx-0 mt-6 xl:mt-0">
          <div className="p-5 sm:p-6 rounded-[24px] bg-ct-bg border-2 border-ct-line/50 shadow-sm flex flex-col h-full">
            <div className="font-serif text-2xl text-ct-ink mb-1">
              Adjust on the fly
            </div>
            <div className="text-sm text-ct-inkSoft mb-6 leading-relaxed">
              Got a bonus or a surprise bill? Tweak any expense, or shift your savings rate to see the impact instantly.
            </div>

            <div className="p-4 rounded-[16px] bg-ct-bgCard border border-ct-line shadow-sm mb-6">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs text-ct-inkMuted uppercase tracking-wider font-semibold">Savings rate</span>
                <span className="font-serif text-2xl text-ct-win tabular-nums">
                  {Math.round(savingsPct * 100)}%
                </span>
              </div>
              <input type="range" min={0} max={0.6} step={0.01} value={savingsPct}
                onChange={(e) => onSavingsChange(Number(e.target.value))}
                className="w-full accent-ct-win cursor-pointer" />
            </div>

            <div className="text-xs text-ct-inkMuted uppercase tracking-wider font-semibold mb-3">
              Your expenses · tap to edit
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2">
              {allocations.length === 0 ? (
                <div className="text-sm text-ct-inkMuted p-4 text-center border-2 border-dashed border-ct-line rounded-[16px]">
                  None yet — add some bubbles on the previous screen.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {allocations.map((a: Allocation) => (
                    <div key={a.id} className="flex items-center gap-3 p-3 rounded-[16px] bg-ct-bgCard border border-ct-line shadow-sm hover:border-ct-inkMuted transition-colors group">
                      <span className="text-2xl">{a.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-ct-ink truncate">{a.label}</div>
                        <div className="text-xs font-bold tabular-nums" style={{ color: a.color }}>
                          {peso(a.amount)}/mo
                        </div>
                      </div>
                      <button onClick={() => setAdjusting(a)} className="px-3 py-1.5 rounded-full border border-ct-line bg-transparent text-ct-ink text-xs font-medium cursor-pointer hover:bg-ct-line/30 transition-colors">
                        Edit
                      </button>
                      <button onClick={() => onRemoveAllocation(a.id)} className="border-none bg-transparent text-ct-inkMuted hover:text-ct-danger text-xl cursor-pointer p-1 transition-colors">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-6 flex flex-col gap-3">
               <button onClick={onTalk} className="w-full py-3.5 rounded-[16px] bg-ct-ink text-ct-bg font-sans text-base font-semibold cursor-pointer flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-md">
                 <span className="text-xl">🐒</span> Talk to Chico
               </button>
               <button onClick={onBack} className="w-full py-3.5 rounded-[16px] bg-transparent border border-ct-line text-ct-ink font-sans text-base font-medium cursor-pointer hover:bg-ct-line/30 transition-colors">
                 ← Back to Slider
               </button>
            </div>
          </div>
        </div>
      </div>

      {adjusting && (
        <BubbleEditSheet palette={p} bubble={{ ...adjusting, mode: 'edit' }}
          onSave={(u) => { onAddAllocation(u); setAdjusting(null); }}
          onCancel={() => setAdjusting(null)} />
      )}
    </div>
  );
}
