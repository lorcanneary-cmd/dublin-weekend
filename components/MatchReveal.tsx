"use client"

import type { Category } from "@/lib/ranking"

const CAT_ICON: Record<Category, string> = {
  Walks: "ti-walk",
  Adventures: "ti-wave-sine",
  Culture: "ti-building-museum",
  "Coffee & Bakeries": "ti-coffee",
  "Bars & Cocktails": "ti-glass-cocktail",
  Film: "ti-movie",
  "Low-Key": "ti-sofa",
}

const MISMATCH_LINES: Record<Category, string> = {
  Walks: "a walk? really?",
  Adventures: "a bit adventurous, no?",
  Culture: "culture vulture behaviour",
  "Coffee & Bakeries": "another coffee shop?",
  "Bars & Cocktails": "classic",
  Film: "eyes glued to a screen",
  "Low-Key": "aggressively low energy",
}

interface Props {
  nameA: string
  nameB: string
  catsA: Category[]
  catsB: Category[]
  onReveal: () => void
}

export default function MatchReveal({ nameA, nameB, catsA, catsB, onReveal }: Props) {
  const matched = catsA.filter((c) => catsB.includes(c))
  const onlyA = catsA.filter((c) => !catsB.includes(c))
  const onlyB = catsB.filter((c) => !catsA.includes(c))
  const matchCount = matched.length

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-8">

        {/* Score */}
        <div className="text-center space-y-2">
          <h2 className="text-white text-3xl font-bold tracking-tight">
            {matchCount === 0 ? "No overlap" : `${matchCount} match${matchCount > 1 ? "es" : ""}`}
          </h2>
          <p className="text-stone-500 text-sm">
            {nameA} & {nameB} · {matchCount} of {Math.max(catsA.length, catsB.length)} categories
          </p>
        </div>

        {/* Matched */}
        {matched.length > 0 && (
          <div className="space-y-3">
            <p className="text-stone-500 text-xs uppercase tracking-widest font-medium">You both want</p>
            <div className="flex flex-wrap gap-2">
              {matched.map((cat) => (
                <span key={cat} className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-sm font-medium px-3.5 py-2 rounded-full">
                  <i className={`ti ${CAT_ICON[cat]} text-base leading-none`} aria-hidden="true" />
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Only A */}
        {onlyA.length > 0 && (
          <div className="space-y-3">
            <p className="text-stone-500 text-xs uppercase tracking-widest font-medium">Only {nameA} picked</p>
            <div className="flex flex-wrap gap-2">
              {onlyA.map((cat) => (
                <span key={cat} className="flex items-center gap-2 bg-stone-800 text-stone-400 border border-stone-700 text-sm font-medium px-3.5 py-2 rounded-full">
                  <i className={`ti ${CAT_ICON[cat]} text-base leading-none`} aria-hidden="true" />
                  {cat}
                </span>
              ))}
            </div>
            <p className="text-stone-600 text-xs italic">
              {nameB}, can you believe {nameA} picked {onlyA.map(c => MISMATCH_LINES[c] || c).join(" and ")}
            </p>
          </div>
        )}

        {/* Only B */}
        {onlyB.length > 0 && (
          <div className="space-y-3">
            <p className="text-stone-500 text-xs uppercase tracking-widest font-medium">Only {nameB} picked</p>
            <div className="flex flex-wrap gap-2">
              {onlyB.map((cat) => (
                <span key={cat} className="flex items-center gap-2 bg-stone-800 text-stone-400 border border-stone-700 text-sm font-medium px-3.5 py-2 rounded-full">
                  <i className={`ti ${CAT_ICON[cat]} text-base leading-none`} aria-hidden="true" />
                  {cat}
                </span>
              ))}
            </div>
            <p className="text-stone-600 text-xs italic">
              {nameA}, {nameB} wants {onlyB.map(c => MISMATCH_LINES[c] || c).join(" and ")}. make of that what you will.
            </p>
          </div>
        )}

        <button
          onClick={onReveal}
          className="w-full bg-white text-stone-900 font-semibold py-4 rounded-2xl text-base hover:bg-stone-100 transition-colors"
        >
          Show us what to do
        </button>
      </div>
    </div>
  )
}
