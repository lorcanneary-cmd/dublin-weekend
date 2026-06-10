"use client"

import { detectCreamyPintsScenario } from "@/lib/ranking"
import type { Category } from "@/lib/ranking"

const PERFECT_MATCH_LINES = ["make it happen — no excuses now", "you're basically the same person", "rare. don't waste it", "zero debate required", "this one was meant to be"]

const PARTIAL_MATCH_LINES = ["not bad — work with what you've got", "close enough — meet in the middle", "a solid foundation", "one overlap is all you need", "common ground found"]

const NO_MATCH_LINES = ["compromise is a skill", "someone's going to have to give", "opposites attract, apparently", "this is what negotiation is for", "at least you're honest"]

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
  "Family Fun": "ti-butterfly",
  Wellness: "ti-heart-rate-monitor",
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
  "Family Fun": "trying to be wholesome",
  Wellness: "health kick era",
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
  const isPerfectMatch = catsA.length > 0 && catsB.length > 0 && catsA.length === matched.length && catsB.length === matched.length
  const tagline = isPerfectMatch ? PERFECT_MATCH_LINES[Math.floor(Math.random() * PERFECT_MATCH_LINES.length)] : matched.length > 0 ? PARTIAL_MATCH_LINES[Math.floor(Math.random() * PARTIAL_MATCH_LINES.length)] : NO_MATCH_LINES[Math.floor(Math.random() * NO_MATCH_LINES.length)]

  const getHeading = () => {
    if (isPerfectMatch) return `${nameA} & ${nameB} want the same thing.`
    if (matched.length > 0) return `${nameA} & ${nameB} have something in common.`
    return `${nameA} & ${nameB} are on completely different pages.`
  }

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center px-6 py-12">
      {isPerfectMatch && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{
            fontSize: "120px",
            animation: "perfectMatchPulse 0.8s ease-out forwards"
          }}>
            ✓
          </div>
        </div>
      )}
      <div className="w-full max-w-sm space-y-8" style={{
        animation: isPerfectMatch ? "fadeInDelayed 0.8s ease-out 0.8s both" : "none"
      }}>

        {/* Heading */}
        <div className="text-center space-y-4">
          <h1 className="text-white text-4xl font-bold tracking-tight leading-tight">
            {getHeading()}
          </h1>
          <p className="text-stone-400 text-sm italic">
            {tagline}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-stone-700"></div>

        {/* Matched Categories */}
        {matched.length > 0 && (
          <div className="space-y-3">
            <p className="text-stone-500 text-xs uppercase tracking-widest font-medium">You both want</p>
            <div className="space-y-2">
              {matched.map((cat) => (
                <div key={cat} className="flex items-center gap-3">
                  <i className={`ti ${CAT_ICON[cat]} text-emerald-400 text-lg`} aria-hidden="true" />
                  <span className="text-emerald-400 text-sm font-medium">{cat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Only A */}
        {onlyA.length > 0 && (
          <>
            {matched.length > 0 && <div className="border-t border-stone-700"></div>}
            <div className="space-y-3">
              <p className="text-stone-500 text-xs uppercase tracking-widest font-medium">Only {nameA} wants</p>
              <div className="space-y-2">
                {onlyA.map((cat) => (
                  <div key={cat} className="flex items-center gap-3">
                    <i className={`ti ${CAT_ICON[cat]} text-stone-500 text-lg`} aria-hidden="true" />
                    <span className="text-stone-500 text-sm">{cat}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Only B */}
        {onlyB.length > 0 && (
          <>
            {(matched.length > 0 || onlyA.length > 0) && <div className="border-t border-stone-700"></div>}
            <div className="space-y-3">
              <p className="text-stone-500 text-xs uppercase tracking-widest font-medium">Only {nameB} wants</p>
              <div className="space-y-2">
                {onlyB.map((cat) => (
                  <div key={cat} className="flex items-center gap-3">
                    <i className={`ti ${CAT_ICON[cat]} text-stone-500 text-lg`} aria-hidden="true" />
                    <span className="text-stone-500 text-sm">{cat}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Divider before button */}
        <div className="border-t border-stone-700"></div>

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

      <style>{`
        @keyframes perfectMatchPulse {
          0% {
            opacity: 0;
            transform: scale(0.5);
            color: #10b981;
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
          100% {
            opacity: 0;
            transform: scale(1);
            color: #10b981;
          }
        }

        @keyframes fadeInDelayed {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
