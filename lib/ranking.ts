export type Category = "Walks" | "Adventures" | "Culture" | "Coffee & Bakeries" | "Bars & Cocktails" | "Film" | "Low-Key" | "Creamy Pints" | "Nature/Day Trip" | "Family Fun" | "Wellness"

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

export function detectCreamyPintsScenario(catsA: Category[], catsB: Category[]): "both-only" | "one-only-a" | "one-only-b" | "none" {
  const aIsOnly = catsA.length === 1 && catsA[0] === "Creamy Pints"
  const bIsOnly = catsB.length === 1 && catsB[0] === "Creamy Pints"
  if (aIsOnly && bIsOnly) return "both-only"
  if (aIsOnly && !bIsOnly) return "one-only-a"
  if (!aIsOnly && bIsOnly) return "one-only-b"
  return "none"
}

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

    if (inA && inB) { score = 2; matchedBy = "both" }
    else if (inA) { score = 1; matchedBy = "a" }
    else if (inB) { score = 1; matchedBy = "b" }

    if (score === 0) return { activity: act, score, reason: "", matchedBy, nameA: a.name, nameB: b.name }

    if (weatherHint === "rain") {
      if (act.tags.includes("rainy") || act.tags.includes("indoor")) score += 0.5
      if (act.tags.includes("outdoor") && !act.tags.includes("rainy")) score -= 0.3
    }
    if (weatherHint === "clear") {
      if (act.tags.includes("outdoor") || act.tags.includes("scenic")) score += 0.3
    }
    if (act.rating) score += (act.rating - 4.5) * 0.5

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

  const processZone = (items: ScoredActivity[]): ScoredActivity[] => {
    const high = items.filter(s => s.score >= 2)
    const mid = items.filter(s => s.score >= 1 && s.score < 2)
    const low = items.filter(s => s.score < 1)

    const shuffledHigh = high.sort(() => Math.random() - 0.5)
    const shuffledMid = mid.sort(() => Math.random() - 0.5)
    const shuffledLow = low.sort(() => Math.random() - 0.5)

    const tiered = [...shuffledHigh, ...shuffledMid, ...shuffledLow]

    const categoryCount = new Map<string, number>()
    const result: ScoredActivity[] = []

    for (const item of tiered) {
      const cat = item.activity.primaryCategory
      const count = categoryCount.get(cat) || 0
      if (count < 3) {
        categoryCount.set(cat, count + 1)
        result.push(item)
      }
    }
    return result
  }

  const matched = processZone(valid.filter((s) => s.matchedBy === "both"))
  const onlyA = processZone(valid.filter((s) => s.matchedBy === "a"))
  const onlyB = processZone(valid.filter((s) => s.matchedBy === "b"))
  return { matched, onlyA, onlyB }
}

export function getLuckyPicks(
  activities: Activity[],
  count: number,
  weatherHint: WeatherHint = null,
  excludeCategories: Category[] = []
): Activity[] {
  const LUCKY_EXCLUDED_CATEGORIES: Category[] = ["Creamy Pints"]
  let pool = activities.filter(a => !excludeCategories.includes(a.primaryCategory) && !LUCKY_EXCLUDED_CATEGORIES.includes(a.primaryCategory))

  // Weight by weather
  const weighted: Activity[] = []
  for (const act of pool) {
    let weight = 1
    if (weatherHint === "rain") {
      if (act.tags.includes("rainy") || act.tags.includes("indoor")) weight = 3
      else if (act.tags.includes("outdoor") && !act.tags.includes("rainy")) weight = 0.3
    }
    if (weatherHint === "clear") {
      if (act.tags.includes("outdoor") || act.tags.includes("scenic")) weight = 2
    }
    const slots = Math.max(1, Math.round(weight * 10))
    for (let i = 0; i < slots; i++) weighted.push(act)
  }

  // Fisher-Yates shuffle then pick unique
  const seen = new Set<string>()
  const result: Activity[] = []
  const shuffled = [...weighted].sort(() => Math.random() - 0.5)
  for (const act of shuffled) {
    if (!seen.has(act.id)) {
      seen.add(act.id)
      result.push(act)
      if (result.length >= count) break
    }
  }
  return result
}

export function getTopPicks(
  activities: Activity[],
  catsA: Category[],
  catsB: Category[],
  weatherHint: WeatherHint = null,
  count: number = 4
): Activity[] {
  const combinedCats = Array.from(new Set([...catsA, ...catsB]))

  // Check if "Bars & Cocktails" is in either person's picks
  const includesBars = catsA.includes("Bars & Cocktails") || catsB.includes("Bars & Cocktails")

  // Filter pool based on combined categories
  let pool = activities.filter(a => combinedCats.includes(a.primaryCategory))

  // Exclude "Bars & Cocktails" category and alcohol tags unless explicitly included
  if (!includesBars) {
    pool = pool.filter(a =>
      a.primaryCategory !== "Bars & Cocktails" &&
      !a.tags.includes("alcohol")
    )
  }

  // Shuffle and pick
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function buildReason(act: Activity, inA: boolean, inB: boolean, nameA: string, nameB: string): string {
  const parts: string[] = []
  if (inA && inB) parts.push(`${nameA} & ${nameB} both picked ${act.primaryCategory}`)
  else if (inA) parts.push(`${nameA}'s pick · ${act.primaryCategory}`)
  else parts.push(`${nameB}'s pick · ${act.primaryCategory}`)
  parts.push(`${act.durationMin} min`)
  parts.push(act.cost === "free" ? "Free" : act.cost)
  if (act.rating) parts.push(`Rated ${act.rating} on Google`)
  if (act.tags.includes("hidden-gem")) parts.push("Hidden gem")
  if (act.tags.includes("romantic")) parts.push("Romantic")
  return parts.join(" · ")
}
