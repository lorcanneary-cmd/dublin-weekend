export type Category = "Walks" | "Adventures" | "Culture" | "Coffee & Bakeries" | "Bars & Cocktails" | "Film" | "Low-Key"

export interface Activity {
  id: string
  title: string
  description?: string
  primaryCategory: Category
  tags: string[]
  weather: string[]
  cost: "free" | "€" | "€€" | "€€€"
  durationMin: number
  lat?: number
  lon?: number
  infoUrl?: string
  bookingUrl?: string
  searchQuery?: string
  requiresBooking?: boolean
  priceHint?: string
  openHours?: string
  availabilityNote?: string
  rating?: number
}

export interface Prefs {
  name: string
  categories: Category[]
}

export interface ScoredActivity {
  activity: Activity
  score: number
  reason: string
  matchedBy: "both" | "a" | "b"
  nameA: string
  nameB: string
}

export type WeatherHint = "rain" | "clear" | null

export function scoreActivities(
  activities: Activity[],
  a: Prefs,
  b: Prefs,
  weatherHint: WeatherHint = null
): ScoredActivity[] {
  return activities.map((act) => {
    const inA = a.categories.includes(act.primaryCategory)
    const inB = b.categories.includes(act.primaryCategory)

    let score = 0
    let matchedBy: "both" | "a" | "b" = "a"

    if (inA && inB) {
      score = 2
      matchedBy = "both"
    } else if (inA) {
      score = 1
      matchedBy = "a"
    } else if (inB) {
      score = 1
      matchedBy = "b"
    }

    if (score === 0) return { activity: act, score, reason: "", matchedBy, nameA: a.name, nameB: b.name }

    // Weather signal
    if (weatherHint === "rain") {
      if (act.tags.includes("rainy") || act.tags.includes("indoor")) score += 0.5
      if (act.tags.includes("outdoor") && !act.tags.includes("rainy")) score -= 0.3
    }
    if (weatherHint === "clear") {
      if (act.tags.includes("outdoor") || act.tags.includes("scenic")) score += 0.3
    }

    // Rating boost for Coffee & Bakeries
    if (act.rating) {
      score += (act.rating - 4.5) * 0.5
    }

    const reason = buildReason(act, inA, inB, a.name, b.name)
    return { activity: act, score, reason, matchedBy, nameA: a.name, nameB: b.name }
  })
}

export function partitionResults(scored: ScoredActivity[]): {
  matched: ScoredActivity[]
  onlyA: ScoredActivity[]
  onlyB: ScoredActivity[]
} {
  const valid = scored.filter((s) => s.score > 0)

  const matched = valid
    .filter((s) => s.matchedBy === "both")
    .sort((a, b) => b.score - a.score)

  const onlyA = valid
    .filter((s) => s.matchedBy === "a")
    .sort((a, b) => b.score - a.score)

  const onlyB = valid
    .filter((s) => s.matchedBy === "b")
    .sort((a, b) => b.score - a.score)

  return { matched, onlyA, onlyB }
}

function buildReason(act: Activity, inA: boolean, inB: boolean, nameA: string, nameB: string): string {
  const parts: string[] = []

  if (inA && inB) {
    parts.push(`${nameA} & ${nameB} both picked ${act.primaryCategory}`)
  } else if (inA) {
    parts.push(`${nameA}'s pick · ${act.primaryCategory}`)
  } else {
    parts.push(`${nameB}'s pick · ${act.primaryCategory}`)
  }

  parts.push(`${act.durationMin} min`)
  parts.push(act.cost === "free" ? "Free" : act.cost)
  if (act.rating) parts.push(`Rated ${act.rating} on Google`)
  if (act.tags.includes("hidden-gem")) parts.push("Hidden gem")
  if (act.tags.includes("romantic")) parts.push("Romantic")

  return parts.join(" · ")
}
