"use client"

import { detectCreamyPintsScenario } from "@/lib/ranking"
import type { Category } from "@/lib/ranking"

const CAT_ICON: Record<Category, string> = {
  Walks: "ti-walk",
  Adventures: "ti-wave-sine",
  Culture: "ti-building-museum",
  "Coffee & Bakeries": "ti-coffee",
  "Bars & Cocktails": "ti-glass-cocktail",
  Film: "ti-movie",
  "Low-Key": "ti-sofa",
  "Creamy Pints": "ti-beer",
  "Nature/Day Trip": "ti-trees",
}

const MISMATCH_LINES: Record<Category, string> = {
  Walks: "a walk? really?",
  Adventures: "a bit adventurous, no?",
  Culture: "culture vulture behaviour",
  "Coffee & Bakeries": "another coffee shop?",
  "Bars & Cocktails": "classic",
  Film: "eyes glued to a screen",
  "Low-Key": "aggressively low energy",
  "Creamy Pints": "creamy pints",
  "Nature/Day Trip": "nature walk",
}

interface Props {
  nameA: string
  nameB: string
  catsA: Category[]
  catsB: Category[]
  onReveal: () => void
  creamyScenario?: "one-only-a" | "one-only-b" | "none"
}

export default function MatchReveal({ nameA, nameB, catsA, catsB, onReveal, creamyScenario = "none" }: Props) {
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
            {matchCount === 0 ? "zero overlap" : `${matchCount} match${matchCount > 1 ? "es" : ""}`}
          </h2>
          <p className="text-stone-500 text-sm">
            {matchCount === 0 ? "not a single category in common. might be time to reconsider some life choices." : `${nameA} & ${nameB} · ${matchCount} of ${Math.max(catsA.length, catsB.length)} categories`}
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
            <p className="text-stone-500 text-xs italic">make it happen — no excuses now</p>
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
            {creamyScenario === "one-only-a" ? (
              <p className="text-stone-600 text-xs italic">
                {nameA} would rather be having a creamy pint. just saying.
              </p>
            ) : (
              <>
                <p className="text-stone-600 text-xs italic">
                  {nameB}, can you believe {nameA} picked {onlyA.map(c => MISMATCH_LINES[c] || c).join(" and ")}
                </p>
                <p className="text-stone-600 text-xs italic">paper scissors rock for the rest</p>
              </>
            )}
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
            {creamyScenario === "one-only-b" ? (
              <p className="text-stone-600 text-xs italic">
                {nameB} would rather be having a creamy pint. just saying.
              </p>
            ) : (
              <>
                <p className="text-stone-600 text-xs italic">
                  {nameA}, {nameB} wants {onlyB.map(c => MISMATCH_LINES[c] || c).join(" and ")}. make of that what you will.
                </p>
                <p className="text-stone-600 text-xs italic">paper scissors rock for the rest</p>
              </>
            )}
          </div>
        )}

        <button
          onClick={onReveal}
          className="w-full bg-white text-stone-900 font-semibold py-4 rounded-2xl text-base hover:bg-stone-100 transition-colors"
        >
          {matchCount === 0 ? "try again — different picks" : "show our picks"}
        </button>
        {matchCount === 0 && (
          <p className="text-stone-600 text-xs text-center italic">or just go separately. both fine.</p>
        )}
      </div>
    </div>
  )
}
