'use client';

import React, { useState } from 'react';
import { CTHeader, CTButton } from './Shared';
import { Chico } from './Chico';
import { Palette, peso, CT_SEMANTIC } from '@/lib/tokens';

interface OnboardingScreenProps {
  palette: Palette;
  income: number;
  onIncomeChange: (val: number) => void;
  onContinue: () => void;
}

export function OnboardingScreen({ palette, income, onIncomeChange, onContinue }: OnboardingScreenProps) {
  const p = palette;
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(income);

  const takeHome = Math.round(draft * 0.84); // rough deduction estimate

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden w-full">
      <div className="md:hidden">
        <CTHeader palette={p} title="Welcome" />
      </div>

      <div className="flex-1 flex flex-col md:flex-row md:items-center justify-center w-full max-w-5xl mx-auto px-6 md:px-12 py-6 gap-8 md:gap-20 min-h-[500px]">
        {/* Chico hero */}
        <div className="flex justify-center md:flex-1 md:justify-end">
          <div className="w-[180px] h-[180px] md:w-[280px] md:h-[280px]">
            <Chico state="thriving" size="100%" />
          </div>
        </div>

        {step === 0 && (
          <div className="flex-1 flex flex-col md:justify-center w-full max-w-md">
            <div className="font-serif text-[38px] md:text-[48px] leading-tight text-ct-ink text-pretty">
              Hi, I'm Chico.
            </div>
            <div className="text-base md:text-lg text-ct-inkSoft mt-4 md:mt-6 leading-relaxed">
              I'm a monkey who's seen some things. Mostly bananas. Sometimes money.
              Tell me what you bring home and I'll tell you how stressed I am about it.
            </div>
            <div className="flex-1 md:flex-none md:h-12" />
            <div className="mt-8">
              <CTButton palette={p} onClick={() => setStep(1)} label="Okay, fine" />
            </div>
            <div className="h-6" />
          </div>
        )}

        {step === 1 && (
          <div className="flex-1 flex flex-col md:justify-center w-full max-w-md">
            <div className="font-serif text-[28px] md:text-[36px] leading-tight text-ct-ink">
              What's your gross monthly?
            </div>
            <div className="text-sm md:text-base text-ct-inkSoft mt-2 md:mt-3">
              Before the government takes its share. I won't judge. (I will judge.)
            </div>

            <div className="mt-6 md:mt-8 p-5 bg-ct-bgCard rounded-[20px] border border-ct-line shadow-sm">
              <div className="text-xs text-ct-inkMuted uppercase tracking-wider font-semibold">
                Gross monthly
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-[28px] md:text-[36px] text-ct-inkSoft font-serif">₱</span>
                <input
                  type="number"
                  value={draft || ''}
                  onChange={e => setDraft(Number(e.target.value) || 0)}
                  className="flex-1 border-none bg-transparent text-[38px] md:text-[46px] font-serif text-ct-ink outline-none min-w-0 p-0"
                  placeholder="0"
                />
              </div>
              <div className="mt-4 pt-4 border-t border-dashed border-ct-line flex justify-between items-center">
                <span className="text-xs text-ct-inkMuted uppercase tracking-wider font-semibold">
                  Take-home (est.)
                </span>
                <span className="text-lg md:text-xl font-serif text-ct-win font-medium">
                  {peso(takeHome)}
                </span>
              </div>
            </div>

            {/* quick presets */}
            <div className="flex gap-2 mt-5 flex-wrap">
              {[25000, 40000, 60000, 90000, 120000].map(v => (
                <button key={v}
                  onClick={() => setDraft(v)}
                  className={`px-3 py-2 rounded-full border text-sm font-medium transition-colors ${
                    draft === v 
                      ? 'bg-ct-ink border-ct-ink text-ct-bg shadow-md' 
                      : 'bg-transparent border-ct-line text-ct-inkSoft hover:bg-black/5'
                  }`}
                >
                  {peso(v).replace('₱', '₱')}
                </button>
              ))}
            </div>

            <div className="flex-1 md:flex-none md:h-10" />
            <div className="mt-8">
              <CTButton palette={p} onClick={() => { onIncomeChange(draft); onContinue(); }} label="Show me the damage →" />
            </div>
            <div className="h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
