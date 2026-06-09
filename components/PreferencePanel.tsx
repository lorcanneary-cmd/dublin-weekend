"use client"

import type { Category } from "@/lib/ranking"

const CATEGORIES: Category[] = ["Walks", "Adventures", "Nature/Day Trip", "Culture", "Coffee & Bakeries", "Bars & Cocktails", "Film", "Low-Key", "Creamy Pints"]

const CAT_ICON: Record<Category, string> = {
  Walks: "ti-walk",
  Adventures: "ti-wave-sine",
  Culture: "ti-building-museum",
  "Coffee & Bakeries": "ti-coffee",
  "Bars & Cocktails": "ti-glass-cocktail",
  Film: "ti-movie",
  "Low-Key": "ti-sofa",
  "Nature/Day Trip": "ti-trees",
  "Creamy Pints": "ti-beer",
}

interface Props {
  selected: Category[]
  onChange: (cats: Category[]) => void
  max?: number
}

export default function PreferencePanel({ selected, onChange, max = 3 }: Props) {
  function toggle(cat: Category) {
    if (selected.includes(cat)) {
      onChange(selected.filter((c) => c !== cat))
    } else if (selected.length < max) {
      onChange([...selected, cat])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const active = selected.includes(cat)
          const disabled = !active && selected.length >= max
          return (
            <button
              key={cat}
              onClick={() => toggle(cat)}
              disabled={disabled}
              className={`
                flex items-center gap-2 px-3.5 py-2.5 rounded-full text-sm font-medium
                transition-all duration-150 border select-none
                ${active
                  ? "bg-stone-900 text-white border-stone-900"
                  : disabled
                  ? "bg-stone-50 text-stone-300 border-stone-100 cursor-not-allowed"
                  : "bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:text-stone-800 active:scale-95"
                }
              `}
            >
              <i className={`ti ${CAT_ICON[cat]} text-base leading-none`} aria-hidden="true" />
              <span>{cat}</span>
            </button>
          )
        })}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-stone-400">
          {selected.length} of {max} selected
          {selected.length === max && " — that's your lot"}
        </p>
      )}
    </div>
  )
}
