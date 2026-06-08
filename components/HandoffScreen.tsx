"use client"

interface Props {
  nameA: string
  onReady: () => void
}

export default function HandoffScreen({ nameA, onReady }: Props) {
  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center px-6 text-center">
      <div className="space-y-8 max-w-xs w-full">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Pass the phone</h2>
          <p className="text-stone-400 text-sm leading-relaxed">
            {nameA}&apos;s picks are locked in.
          </p>
        </div>
        <button
          onClick={onReady}
          className="w-full bg-white text-stone-900 font-semibold py-4 rounded-2xl text-base hover:bg-stone-100 transition-colors"
        >
          I&apos;ve got the phone
        </button>
      </div>
    </div>
  )
}
