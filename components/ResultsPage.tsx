"use client"

import { useState } from "react"
import type { ScoredActivity } from "@/lib/ranking"
import type { WeatherResult } from "@/lib/weather"
import ActivityCard from "./ActivityCard"
import WeatherBanner from "./WeatherBanner"

const CAT_ICON: Record<string, string> = {
  Walks: "ti-walk",
  Adventures: "ti-wave-sine",
  Culture: "ti-building-museum",
  "Coffee & Bakeries": "ti-coffee",
  "Bars & Cocktails": "ti-glass-cocktail",
  Film: "ti-movie",
  "Low-Key": "ti-sofa",
}

interface Props {
  nameA: string
  nameB: string
  matched: ScoredActivity[]
  onlyA: ScoredActivity[]
  onlyB: ScoredActivity[]
  savedIds: string[]
  onToggleSave: (id: string) => void
  onReset: () => void
  weather: WeatherResult | null
}

const INITIAL = 5

function groupByCategory(items: ScoredActivity[]): Record<string, ScoredActivity[]> {
  return items.reduce((acc, item) => {
    const cat = item.activity.primaryCategory
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {} as Record<string, ScoredActivity[]>)
}

function CategorySection({
  category,
  items,
  savedIds,
  onToggleSave,
  muted,
}: {
  category: string
  items: ScoredActivity[]
  savedIds: string[]
  onToggleSave: (id: string) => void
  muted?: boolean
}) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? items : items.slice(0, INITIAL)

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <i className={`ti ${CAT_ICON[category] || "ti-map-pin"} text-stone-400 text-sm leading-none`} aria-hidden="true" />
        <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">{category}</span>
      </div>
      {visible.map((s) => (
        <ActivityCard
          key={s.activity.id}
          scored={s}
          saved={savedIds.includes(s.activity.id)}
          onSave={() => onToggleSave(s.activity.id)}
          muted={muted}
        />
      ))}
      {!showAll && items.length > INITIAL && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-3 text-xs text-stone-400 hover:text-stone-600 border border-stone-100 rounded-xl transition-colors"
        >
          Show {items.length - INITIAL} more in {category}
        </button>
      )}
    </div>
  )
}

export default function ResultsPage({
  nameA, nameB, matched, onlyA, onlyB,
  savedIds, onToggleSave, onReset, weather,
}: Props) {
  const matchedByCategory = groupByCategory(matched)
  const onlyAByCategory = groupByCategory(onlyA)
  const onlyBByCategory = groupByCategory(onlyB)

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button onClick={onReset} className="flex items-center gap-1.5 text-stone-400 hover:text-stone-600 text-sm transition-colors">
            <i className="ti ti-arrow-left text-base leading-none" aria-hidden="true" />
            Start over
          </button>
          <span className="text-stone-500 text-sm font-medium">{nameA} & {nameB}</span>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-10 pb-16">

        {/* Weather */}
        <WeatherBanner weather={weather} />

        {/* Zone 1: Matched */}
        {matched.length > 0 ? (
          <section className="space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <i className="ti ti-target text-stone-700 text-xl leading-none" aria-hidden="true" />
                <h2 className="text-lg font-bold text-stone-800">You both want this</h2>
              </div>
              <p className="text-sm text-stone-400 pl-8">
                {matched.length} idea{matched.length > 1 ? "s" : ""} where you actually agree
              </p>
            </div>
            {Object.entries(matchedByCategory).map(([cat, items]) => (
              <CategorySection
                key={cat}
                category={cat}
                items={items}
                savedIds={savedIds}
                onToggleSave={onToggleSave}
              />
            ))}
          </section>
        ) : (
          <section>
            <div className="bg-stone-100 border border-stone-200 rounded-2xl p-5 text-center space-y-2">
              <i className="ti ti-mood-confuzed text-3xl text-stone-400" aria-hidden="true" />
              <p className="font-semibold text-stone-700">No category overlap</p>
              <p className="text-sm text-stone-500">Scroll down — maybe one of you will come around</p>
            </div>
          </section>
        )}

        {/* Zone 2a: Only A */}
        {onlyA.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-3 py-3 border-t border-b border-stone-200">
              <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center shrink-0">
                <i className="ti ti-user text-stone-500 text-sm leading-none" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-600">Only {nameA} wants this</p>
                <p className="text-xs text-stone-400">{nameB}, this is what you're missing out on</p>
              </div>
            </div>
            <div className="space-y-6">
              {Object.entries(onlyAByCategory).map(([cat, items]) => (
                <CategorySection
                  key={cat}
                  category={cat}
                  items={items}
                  savedIds={savedIds}
                  onToggleSave={onToggleSave}
                  muted
                />
              ))}
            </div>
          </section>
        )}

        {/* Zone 2b: Only B */}
        {onlyB.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-3 py-3 border-t border-b border-stone-200">
              <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center shrink-0">
                <i className="ti ti-user text-stone-500 text-sm leading-none" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-600">Only {nameB} wants this</p>
                <p className="text-xs text-stone-400">{nameA}, this is what you're missing out on</p>
              </div>
            </div>
            <div className="space-y-6">
              {Object.entries(onlyBByCategory).map(([cat, items]) => (
                <CategorySection
                  key={cat}
                  category={cat}
                  items={items}
                  savedIds={savedIds}
                  onToggleSave={onToggleSave}
                  muted
                />
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-stone-200 text-center">
          <button
            onClick={onReset}
            className="w-full py-3 text-stone-400 text-sm hover:text-stone-600 transition-colors"
          >
            Start over with different picks
          </button>
        </div>
      </div>
    </div>
  )
}
