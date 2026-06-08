"use client"

import type { ScoredActivity } from "@/lib/ranking"

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
  scored: ScoredActivity
  saved: boolean
  onSave: () => void
  muted?: boolean
}

function searchUrl(query: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`
}

export default function ActivityCard({ scored, saved, onSave, muted }: Props) {
  const { activity: act, reason } = scored

  return (
    <div className={`rounded-2xl border p-4 space-y-3 transition-all duration-200 ${
      muted ? "bg-stone-50 border-stone-100" : "bg-white border-stone-200 shadow-sm"
    }`}>

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <i className={`ti ${CAT_ICON[act.primaryCategory] || "ti-map-pin"} text-stone-400 text-base leading-none shrink-0`} aria-hidden="true" />
            <h3 className="font-semibold text-stone-800 text-base leading-snug">{act.title}</h3>
          </div>
          <div className="flex items-center gap-2 mt-1 pl-6 flex-wrap">
            <span className="text-xs text-stone-400">{act.durationMin} min</span>
            <span className="text-stone-200">·</span>
            <span className="text-xs text-stone-400">{act.cost === "free" ? "Free" : act.cost}</span>
            {act.priceHint && (
              <>
                <span className="text-stone-200">·</span>
                <span className="text-xs text-stone-400">{act.priceHint}</span>
              </>
            )}
            {act.rating && (
              <>
                <span className="text-stone-200">·</span>
                <span className="text-xs text-amber-500 font-medium">
                  <i className="ti ti-star-filled text-xs" aria-hidden="true" /> {act.rating}
                </span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={onSave}
          className={`shrink-0 transition-all ${saved ? "text-stone-700" : "text-stone-200 hover:text-stone-400"}`}
          aria-label={saved ? "Saved" : "Save this"}
        >
          <i className={`ti ${saved ? "ti-bookmark-filled" : "ti-bookmark"} text-lg`} aria-hidden="true" />
        </button>
      </div>

      {/* Description */}
      {act.description && (
        <p className="text-sm text-stone-600 leading-relaxed pl-6">{act.description}</p>
      )}

      {/* Reason */}
      <p className="text-xs text-stone-400 leading-relaxed pl-6">{reason}</p>

      {/* Availability */}
      {act.availabilityNote && (
        <p className="text-xs text-stone-400 italic pl-6">{act.availabilityNote}</p>
      )}

      {/* Buttons */}
      <div className="flex gap-2 flex-wrap pt-1">
        {act.bookingUrl && (
          <a
            href={act.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-sm font-medium bg-stone-900 text-white rounded-xl py-2.5 px-4 hover:bg-stone-700 transition-colors"
          >
            Book now
          </a>
        )}
        {act.infoUrl && !act.bookingUrl && (
          <a
            href={act.infoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-sm font-medium border border-stone-200 text-stone-600 rounded-xl py-2.5 px-4 hover:border-stone-400 hover:text-stone-800 transition-colors bg-white"
          >
            More info
          </a>
        )}
        {act.infoUrl && act.bookingUrl && (
          <a
            href={act.infoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-sm font-medium border border-stone-200 text-stone-600 rounded-xl py-2.5 px-4 hover:border-stone-400 hover:text-stone-800 transition-colors bg-white"
          >
            More info
          </a>
        )}
        {!act.infoUrl && !act.bookingUrl && act.searchQuery && (
          <a
            href={searchUrl(act.searchQuery)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-sm font-medium border border-stone-200 text-stone-600 rounded-xl py-2.5 px-4 hover:border-stone-400 hover:text-stone-800 transition-colors bg-white"
          >
            <i className="ti ti-search text-xs mr-1" aria-hidden="true" />
            Search online
          </a>
        )}
        {act.infoUrl && act.searchQuery && !act.bookingUrl && (
          <a
            href={searchUrl(act.searchQuery)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-sm font-medium border border-stone-200 text-stone-600 rounded-xl py-2.5 px-4 hover:border-stone-400 hover:text-stone-800 transition-colors bg-white"
          >
            <i className="ti ti-search text-xs mr-1" aria-hidden="true" />
            Search online
          </a>
        )}
      </div>
    </div>
  )
}
