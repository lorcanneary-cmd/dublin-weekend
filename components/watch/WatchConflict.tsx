'use client';

import { WatchType } from '@/app/watch/page';

type Props = {
  nameA: string;
  nameB: string;
  onResolve: (type: WatchType) => void;
};

export default function WatchConflict({ nameA, nameB, onResolve }: Props) {
  const flip = () => {
    const types: WatchType[] = ['movie', 'tv'];
    onResolve(types[Math.floor(Math.random() * 2)]);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-8 text-center">
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        <i className="ti ti-arrows-shuffle text-3xl text-[#c8f04a]" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-medium text-white mb-3">You're split</h2>
      <p className="text-sm text-white/30 leading-relaxed mb-8">
        {nameA} wants a movie.<br />
        {nameB} wants a TV series.<br />
        Pick one to go with.
      </p>
      <div className="w-full max-w-xs flex flex-col gap-3 mb-6">
        <button
          onClick={() => onResolve('movie')}
          className="w-full py-4 rounded-2xl border border-white/10 bg-white/5 text-white text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <i className="ti ti-movie text-lg" aria-hidden="true" />
          Go with a movie
        </button>
        <button
          onClick={() => onResolve('tv')}
          className="w-full py-4 rounded-2xl border border-white/10 bg-white/5 text-white text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <i className="ti ti-device-tv text-lg" aria-hidden="true" />
          Go with a TV series
        </button>
      </div>
      <button
        onClick={flip}
        className="flex items-center gap-2 text-sm text-white/30 py-2"
      >
        <i className="ti ti-dice text-base" aria-hidden="true" />
        Flip a coin
      </button>
    </div>
  );
}
