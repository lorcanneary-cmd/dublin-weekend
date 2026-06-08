"use client"

import { useState, useEffect } from "react"
import type { Activity, WeatherHint, Category } from "@/lib/ranking"
import { getLuckyPicks } from "@/lib/ranking"

const CAT_ICON: Record<string, string> = {
  Walks: "ti-walk",
  Adventures: "ti-wave-sine",
  Culture: "ti-building-museum",
  "Coffee & Bakeries": "ti-coffee",
  "Bars & Cocktails": "ti-glass-cocktail",
  Film: "ti-movie",
  "Low-Key": "ti-sofa",
}

function searchUrl(query: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`
}

interface CardProps { activity: Activity; index: number }

function LuckyCard({ activity: act, index }: CardProps) {
  return (
    <div
      className="bg-stone-800 border border-stone-700 rounded-2xl p-4 space-y-3"
      style={{ animation: `fadeUp 0.4s ease forwards`, animationDelay: `${0.6 + index * 0.1}s`, opacity: 0 }}
    >
      <div className="flex items-start gap-3">
        <i className={`ti ${CAT_ICON[act.primaryCategory] || "ti-map-pin"} text-stone-400 text-base leading-none mt-0.5 shrink-0`} aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm leading-snug">{act.title}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs text-stone-500">{act.durationMin} min</span>
            <span className="text-stone-700">·</span>
            <span className="text-xs text-stone-500">{act.cost === "free" ? "Free" : act.cost}</span>
            {act.priceHint && (
              <>
                <span className="text-stone-700">·</span>
                <span className="text-xs text-stone-500">{act.priceHint}</span>
              </>
            )}
            {act.rating && (
              <>
                <span className="text-stone-700">·</span>
                <span className="text-xs text-amber-500 font-medium">
                  <i className="ti ti-star text-xs" aria-hidden="true" /> {act.rating}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {act.description && (
        <p className="text-xs text-stone-400 leading-relaxed pl-7">{act.description}</p>
      )}

      {act.availabilityNote && (
        <p className="text-xs text-stone-500 italic pl-7">{act.availabilityNote}</p>
      )}

      <div className="flex gap-2 pt-1">
        {act.bookingUrl && (
          <a href={act.bookingUrl} target="_blank" rel="noopener noreferrer"
            className="flex-1 text-center text-xs font-medium bg-white text-stone-900 rounded-xl py-2.5 px-3 hover:bg-stone-100 transition-colors">
            Book now
          </a>
        )}
        {act.infoUrl && (
          <a href={act.infoUrl} target="_blank" rel="noopener noreferrer"
            className="flex-1 text-center text-xs font-medium border border-stone-600 text-stone-300 rounded-xl py-2.5 px-3 hover:border-stone-400 transition-colors">
            More info
          </a>
        )}
        {!act.infoUrl && !act.bookingUrl && act.searchQuery && (
          <a href={searchUrl(act.searchQuery)} target="_blank" rel="noopener noreferrer"
            className="flex-1 text-center text-xs font-medium border border-stone-600 text-stone-300 rounded-xl py-2.5 px-3 hover:border-stone-400 transition-colors">
            <i className="ti ti-search text-xs mr-1" aria-hidden="true" />
            Search online
          </a>
        )}
        {act.infoUrl && act.searchQuery && (
          <a href={searchUrl(act.searchQuery)} target="_blank" rel="noopener noreferrer"
            className="flex-1 text-center text-xs font-medium border border-stone-600 text-stone-300 rounded-xl py-2.5 px-3 hover:border-stone-400 transition-colors">
            <i className="ti ti-search text-xs mr-1" aria-hidden="true" />
            Search
          </a>
        )}
      </div>
    </div>
  )
}

interface Props {
  activities: Activity[]
  weatherHint: WeatherHint
  bothLucky: boolean
  wizardName?: string
  luckyName?: string
  wizardCats?: Category[]
  onReset: () => void
}

export default function LuckyResults({
  activities, weatherHint, bothLucky,
  wizardName, luckyName, wizardCats = [],
  onReset
}: Props) {
  const [picks, setPicks] = useState<Activity[]>([])
  const [key, setKey] = useState(0)

  function reshuffle() {
    setKey(k => k + 1)
  }

  useEffect(() => {
    const excludeCats = bothLucky ? [] : wizardCats
    setPicks(getLuckyPicks(activities, 3, weatherHint, excludeCats))
  }, [key, activities, weatherHint, bothLucky, wizardCats])

  return (
    <>
      <style>{`
        @keyframes burst {
          0% { transform: scale(0.3); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes particle {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-50px) scale(0); opacity: 0; }
        }
      `}</style>

      <div className="min-h-screen bg-stone-900 flex flex-col">
        <div className="max-w-lg mx-auto w-full px-5 py-10 flex flex-col items-center">

          {/* Icon burst */}
          <div className="relative w-20 h-20 mb-7 shrink-0">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-stone-500"
                style={{
                  top: `${[0, 20, 20, 60, 60, 10][i]}%`,
                  left: `${[50, 90, 10, 80, 20, 30][i]}%`,
                  animation: `particle 0.8s ease-out forwards`,
                  animationDelay: `${0.1 + i * 0.05}s`,
                }} />
            ))}
            <div className="w-20 h-20 rounded-full border border-stone-700 flex items-center justify-center"
              style={{ animation: "burst 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
              <i className="ti ti-stars text-white text-4xl leading-none" aria-hidden="true" />
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-8 space-y-2"
            style={{ animation: "fadeUp 0.4s ease forwards", animationDelay: "0.3s", opacity: 0 }}>
            {bothLucky ? (
              <>
                <h2 className="text-2xl font-bold text-white">you're both feeling lucky</h2>
                <p className="text-stone-500 text-sm">no plans, no categories. here's what the universe picked.</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white">{luckyName} was feeling lucky</h2>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {wizardName} made their picks. {luckyName} left it to fate.<br />
                  these are from outside {wizardName}'s categories.
                </p>
              </>
            )}
          </div>

          {/* Cards */}
          <div className="w-full space-y-3 mb-6">
            {picks.map((act, i) => (
              <LuckyCard key={`${act.id}-${key}`} activity={act} index={i} />
            ))}
          </div>

          {/* Reshuffle */}
          <div className="w-full space-y-3"
            style={{ animation: "fadeUp 0.4s ease forwards", animationDelay: "0.9s", opacity: 0 }}>
            <button onClick={reshuffle}
              className="w-full bg-white text-stone-900 font-semibold py-4 rounded-2xl text-base hover:bg-stone-100 transition-colors flex items-center justify-center gap-2">
              <i className="ti ti-refresh text-lg leading-none" aria-hidden="true" />
              try three more
            </button>
            <button onClick={onReset}
              className="w-full py-3 text-stone-600 text-sm hover:text-stone-400 transition-colors">
              start over
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
