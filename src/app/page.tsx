'use client';

import React, { useState } from 'react';
import { CT_PALETTES } from '@/lib/tokens';
import { OnboardingScreen } from '@/components/ScreenOnboarding';
import { SavingsSliderScreen } from '@/components/ScreenSlider';
import { DreamTrackerScreen } from '@/components/ScreenDreams';
import { InsightsScreen } from '@/components/ScreenInsights';
import { CoachScreen } from '@/components/ScreenCoach';
import { Allocation } from '@/lib/types';
import { ChicoState } from '@/components/Chico';

type Screen = 'onboarding' | 'slider' | 'dreams' | 'insights' | 'coach';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('onboarding');
  const [income, setIncome] = useState<number>(35000);
  const [savingsPct, setSavingsPct] = useState<number>(0.18);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const palette = CT_PALETTES.cream; // We can use the cream palette for now

  const addAllocation = (b: Allocation) => setAllocations(prev =>
    prev.find(a => a.id === b.id) ? prev.map(a => a.id === b.id ? b : a) : [...prev, b]);
  
  const removeAllocation = (id: string | number) => setAllocations(prev => prev.filter(a => a.id !== id));

  const takeHome = Math.round(income * 0.84);
  const monthly = Math.round(takeHome * savingsPct);

  let body;
  if (screen === 'onboarding') {
    body = <OnboardingScreen
      palette={palette} income={income} onIncomeChange={setIncome}
      onContinue={() => setScreen('slider')} />;
  } else if (screen === 'slider') {
    body = <SavingsSliderScreen
      palette={palette} income={income} savingsPct={savingsPct}
      onSavingsChange={setSavingsPct}
      variant="classic" // Can be switched to 'split' or 'dial'
      allocations={allocations}
      onAddAllocation={addAllocation}
      onRemoveAllocation={removeAllocation}
      onBack={() => setScreen('onboarding')}
      onNext={() => setScreen('dreams')} />;
  } else if (screen === 'dreams') {
    body = <DreamTrackerScreen
      palette={palette} monthlySavings={monthly}
      onBack={() => setScreen('slider')}
      onNext={() => setScreen('insights')} />;
  } else if (screen === 'insights') {
    body = <InsightsScreen
      palette={palette} income={income} savingsPct={savingsPct}
      onSavingsChange={setSavingsPct}
      allocations={allocations}
      onAddAllocation={addAllocation}
      onRemoveAllocation={removeAllocation}
      onBack={() => setScreen('slider')}
      onTalk={() => setScreen('coach')}
      onRestart={() => setScreen('onboarding')} />;
  } else {
    body = <CoachScreen
      palette={palette} income={income} savingsPct={savingsPct}
      onSavingsChange={setSavingsPct}
      allocations={allocations}
      onAddAllocation={addAllocation}
      onRemoveAllocation={removeAllocation}
      onBack={() => setScreen('insights')} />;
  }

  const tabs: { id: Screen, label: string }[] = [
    { id: 'onboarding', label: 'Start' },
    { id: 'slider',     label: 'Save'  },
    { id: 'dreams',     label: 'Dream' },
    { id: 'insights',   label: 'Insights' },
    { id: 'coach',      label: 'Chat' },
  ];

  return (
    <main className="w-full min-h-screen bg-ct-bg text-ct-ink flex flex-col items-center">
      <div className="w-full max-w-7xl h-[100dvh] flex flex-col relative overflow-hidden">
        {/* Navigation header */}
        <header className="flex justify-between items-center px-6 py-4 md:px-10 md:py-6 border-b border-ct-line">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ct-amber text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md">
              C
            </div>
            <span className="font-sans font-bold text-lg text-ct-ink hidden sm:block tracking-wide">
              Cha-Ching
            </span>
          </div>
          <nav className="flex gap-2 sm:gap-6 items-center">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setScreen(t.id)} 
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  t.id === screen ? 'text-ct-ink font-bold' : 'text-ct-inkSoft hover:text-ct-ink'
                }`}
              >
                {t.label}
                {t.id === screen && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-ct-ink rounded-t-full" />
                )}
              </button>
            ))}
          </nav>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto flex flex-col w-full">
          {body}
        </div>
      </div>
    </main>
  );
}
