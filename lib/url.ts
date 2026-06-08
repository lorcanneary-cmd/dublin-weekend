import type { Category } from "./ranking"

export interface AppState {
  nameA: string
  nameB: string
  catsA: Category[]
  catsB: Category[]
}

const CAT_MAP: Record<string, Category> = {
  W: "Walks",
  A: "Adventures",
  C: "Culture",
  K: "Coffee & Bakeries",
  B: "Bars & Cocktails",
  M: "Film",
  L: "Low-Key",
}

const CAT_REVERSE: Record<Category, string> = {
  Walks: "W",
  Adventures: "A",
  Culture: "C",
  "Coffee & Bakeries": "K",
  "Bars & Cocktails": "B",
  Film: "M",
  "Low-Key": "L",
}

function encodeCats(cats: Category[]): string {
  return cats.map((c) => CAT_REVERSE[c]).join("")
}

function decodeCats(str: string): Category[] {
  return str.split("").map((c) => CAT_MAP[c]).filter(Boolean) as Category[]
}

export function encodeState(state: AppState): string {
  const params = new URLSearchParams()
  if (state.nameA) params.set("na", state.nameA)
  if (state.nameB) params.set("nb", state.nameB)
  if (state.catsA.length) params.set("a", encodeCats(state.catsA))
  if (state.catsB.length) params.set("b", encodeCats(state.catsB))
  return params.toString()
}

export function decodeState(search: string): Partial<AppState> {
  const params = new URLSearchParams(search)
  return {
    nameA: params.get("na") || "",
    nameB: params.get("nb") || "",
    catsA: decodeCats(params.get("a") || ""),
    catsB: decodeCats(params.get("b") || ""),
  }
}
