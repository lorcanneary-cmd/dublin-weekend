'use client';

import { WatchType } from '@/app/watch/page';

type Props = {
  nameA: string;
  nameB: string;
  onResolve: (type: WatchType) => void;
};

export default function WatchConflict({ nameA, nameB, onResolve }: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0e0e0e] items-center justify-center px-8 text-center gap-6">
      <i className="ti ti-arrows-shuffle text-4xl text-white/20" aria-hidden="true" />
      <div>
        <h2 className="text-xl font-medium text-white mb-2">One wants a movie, one wants a series</h2>
        <p className="text-sm text-white/40">Pick one to go with</p>
      </div>
      <div className="w-full max-w-xs flex flex-col gap-3">
        <button
          onClick={() => onResolve('movie')}
          className="w-full py-4 rounded-2xl border border-white/10 bg-white/5 text-sm text-white/60 flex items-center justify-center gap-2"
        >
          <i className="ti ti-movie text-lg" aria-hidden="true" />
          Movie
        </button>
        <button
          onClick={() => onResolve('tv')}
          className="w-full py-4 rounded-2xl border border-white/10 bg-white/5 text-sm text-white/60 flex items-center justify-center gap-2"
        >
          <i className="ti ti-device-tv text-lg" aria-hidden="true" />
          TV series
        </button>
      </div>
    </div>
  );
}
