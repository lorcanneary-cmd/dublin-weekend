'use client';

type Props = {
  personAName: string;
  onReady: () => void;
};

export default function WatchHandoff({ personAName, onReady }: Props) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-8 text-center">
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        <i className="ti ti-device-tv text-3xl text-[#c8f04a]" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-medium text-white mb-3">Pass the phone</h2>
      <p className="text-sm text-white/30 leading-relaxed mb-10">
        {personAName ? `${personAName} is done.` : 'Person 1 is done.'}<br />
        Person 2, make your picks<br />without peeking.
      </p>
      <button
        onClick={onReady}
        className="w-full max-w-xs py-4 rounded-2xl bg-[#c8f04a] text-[#0e0e0e] text-sm font-medium active:scale-[0.98] transition-transform"
      >
        I'm ready
      </button>
      <p className="text-xs text-white/20 mt-4">Person 1's picks are hidden</p>
    </div>
  );
}
