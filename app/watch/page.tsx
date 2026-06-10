'use client';

import { useState } from 'react';
import WatchPicker from '@/components/watch/WatchPicker';
import WatchHandoff from '@/components/watch/WatchHandoff';
import WatchResults from '@/components/watch/WatchResults';
import WatchConflict from '@/components/watch/WatchConflict';

export type WatchType = 'movie' | 'tv';

export type WatchSelections = {
  name: string;
  type: WatchType;
  services: number[];
  genres: number[];
  length: 'short' | 'medium' | 'long' | null;
  era: 'fresh' | 'any' | 'classic';
  includeNonEnglish: boolean;
};

type Stage = 'picker-a' | 'handoff' | 'picker-b' | 'conflict' | 'results';

const emptySelections = (): WatchSelections => ({
  name: '',
  type: 'movie',
  services: [],
  genres: [],
  length: null,
  era: 'any',
  includeNonEnglish: false,
});

export default function WatchPage() {
  const [stage, setStage] = useState<Stage>('picker-a');
  const [selectionsA, setSelectionsA] = useState<WatchSelections>(emptySelections());
  const [selectionsB, setSelectionsB] = useState<WatchSelections>(emptySelections());

  const handleBDone = (s: WatchSelections) => {
    setSelectionsB(s);
    if (selectionsA.type !== s.type) {
      setStage('conflict');
    } else {
      setStage('results');
    }
  };

  const resolveConflict = (type: WatchType) => {
    setSelectionsA(a => ({ ...a, type }));
    setSelectionsB(b => ({ ...b, type }));
    setStage('results');
  };

  const reset = () => {
    setSelectionsA(emptySelections());
    setSelectionsB(emptySelections());
    setStage('picker-a');
  };

  return (
    <main className="min-h-screen bg-[#0e0e0e] text-white flex flex-col">
      {stage === 'picker-a' && (
        <WatchPicker step={1} onDone={(s) => { setSelectionsA(s); setStage('handoff'); }} />
      )}
      {stage === 'handoff' && (
        <WatchHandoff personAName={selectionsA.name} onReady={() => setStage('picker-b')} />
      )}
      {stage === 'picker-b' && (
        <WatchPicker step={2} onDone={handleBDone} />
      )}
      {stage === 'conflict' && (
        <WatchConflict nameA={selectionsA.name} nameB={selectionsB.name} onResolve={resolveConflict} />
      )}
      {stage === 'results' && (
        <WatchResults selectionsA={selectionsA} selectionsB={selectionsB} onReset={reset} />
      )}
    </main>
  );
}
