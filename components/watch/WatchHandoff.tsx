'use client';

type Props = {
  personAName: string;
  onReady: () => void;
};

export default function WatchHandoff({ personAName, onReady }: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0e0e0e] items-center justify-center px-8 text-center gap-8">
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
        <i className="ti ti-device-mobile text-2xl text-white/40" aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-xl font-medium text-white mb-2">
          {personAName ? `${personAName} is done.` : 'Person 1 is done.'}
        </h2>
        <p className="text-sm text-white/40">
          Person 2, make your picks<br />without peeking.
        </p>
      </div>
      <button
        onClick={onReady}
        className="w-full max-w-xs py-4 rounded-2xl bg-[#c8f04a] text-[#0e0e0e] text-sm font-medium"
      >
        I'm ready
      </button>
      <p className="text-xs text-white/20">Person 1's picks are hidden</p>
    </div>
  );
}
