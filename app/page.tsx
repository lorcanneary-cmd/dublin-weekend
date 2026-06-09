"use client"

import { useEffect, useState, useCallback } from "react"
import type { Category } from "@/lib/ranking"
import { scoreActivities, partitionResults, detectCreamyPintsScenario } from "@/lib/ranking"
import { decodeState } from "@/lib/url"
import { fetchDublinWeather, weatherHintFromCode, type WeatherResult } from "@/lib/weather"
import PreferencePanel from "@/components/PreferencePanel"
import HandoffScreen from "@/components/HandoffScreen"
import MatchReveal from "@/components/MatchReveal"
import ResultsPage from "@/components/ResultsPage"
import LuckyResults from "@/components/LuckyResults"
import Countdown from "@/components/Countdown"
import CreamyPintsEasterEgg from "@/components/CreamyPintsEasterEgg"
import activitiesRaw from "@/data/activities.json"
import type { Activity } from "@/lib/ranking"

const activities = activitiesRaw as Activity[]

type Step = "person-a" | "handoff" | "person-b" | "creamy-pints" | "countdown" | "reveal" | "results" | "lucky-results"
type Mode = "wizard" | "lucky" | null

export default function Home() {
  const [step, setStep] = useState<Step>("person-a")
  const [nameA, setNameA] = useState("")
  const [nameB, setNameB] = useState("")
  const [catsA, setCatsA] = useState<Category[]>([])
  const [catsB, setCatsB] = useState<Category[]>([])
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [weather, setWeather] = useState<WeatherResult | null>(null)
  const [modeA, setModeA] = useState<Mode>(null)
  const [modeB, setModeB] = useState<Mode>(null)
  const [creamyScenario, setCreamyScenario] = useState<"both-only" | "one-only-a" | "one-only-b" | "none">("none")

  useEffect(() => {
    fetchDublinWeather().then(setWeather)
  }, [])

  useEffect(() => {
    const state = decodeState(window.location.search)
    if (state.nameA) setNameA(state.nameA)
    if (state.nameB) setNameB(state.nameB)
    if (state.catsA?.length) setCatsA(state.catsA)
    if (state.catsB?.length) setCatsB(state.catsB)
    if (state.nameA && state.nameB && state.catsA?.length && state.catsB?.length) {
      setStep("results")
    }
  }, [])

  const weatherHint = weather ? weatherHintFromCode(weather.code) : null

  const scored = scoreActivities(
    activities,
    { name: nameA || "Person A", categories: catsA },
    { name: nameB || "Person B", categories: catsB },
    weatherHint
  )
  const { matched, onlyA, onlyB } = partitionResults(scored)

  const handleToggleSave = useCallback((id: string) => {
    setSavedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }, [])

  const handleReset = useCallback(() => {
    setNameA(""); setNameB("")
    setCatsA([]); setCatsB([])
    setSavedIds([])
    setModeA(null); setModeB(null)
    setStep("person-a")
    window.history.replaceState(null, "", window.location.pathname)
  }, [])

  function handlePersonADone(mode: Mode) {
    setModeA(mode)
    setStep("handoff")
  }

  function handlePersonBDone(mode: Mode) {
    setModeB(mode)
    if (modeA === "lucky" && mode === "lucky") {
      setStep("countdown")
    } else if (mode === "lucky" || modeA === "lucky") {
      setStep("lucky-results")
    } else {
      const scenario = detectCreamyPintsScenario(catsA, catsB)
      setCreamyScenario(scenario)
      if (scenario === "both-only") {
        setStep("creamy-pints")
      } else {
        setStep("countdown")
      }
    }
  }

  // ── Person A ──────────────────────────────────────────────
  if (step === "person-a") {
    return (
      <main className="min-h-screen bg-stone-50 flex flex-col">
        <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-5 py-8 space-y-8">
          <div className="pt-4 space-y-1">
            <h1 className="text-2xl font-bold text-stone-800 tracking-tight">What are we doing?</h1>
            <p className="text-stone-400 text-sm">Pick what you&apos;re into, pass the phone, see where you match.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-600">Your name</label>
            <input type="text" value={nameA} onChange={(e) => setNameA(e.target.value)}
              placeholder="e.g. Sarah"
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 placeholder-stone-300 focus:outline-none focus:border-stone-400 bg-white text-base" />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-stone-600">What are you into? Pick up to 3.</label>
            <PreferencePanel selected={catsA} onChange={setCatsA} />
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => handlePersonADone("wizard")}
              disabled={!nameA.trim() || catsA.length === 0}
              className="w-full bg-stone-900 text-white font-semibold py-4 rounded-2xl text-base disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-700 transition-colors">
              Done — pass the phone
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-xs text-stone-400">or</span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            <button
              onClick={() => { if (nameA.trim()) handlePersonADone("lucky") }}
              disabled={!nameA.trim()}
              className="w-full relative overflow-hidden border-2 border-stone-800 text-stone-800 font-semibold py-4 rounded-2xl text-base disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-stone-800 hover:text-white group"
              style={{ animation: nameA.trim() ? "none" : undefined }}
            >
              <span className="flex items-center justify-center gap-2">
                <i className="ti ti-stars text-lg leading-none" aria-hidden="true" />
                I&apos;m feeling lucky
              </span>
            </button>
            {!nameA.trim() && (
              <p className="text-xs text-stone-400 text-center">enter your name first</p>
            )}
          </div>
        </div>

        <style>{`
          @keyframes pulse-border {
            0%, 100% { box-shadow: 0 0 0 0 rgba(28,25,23,0.15); }
            50% { box-shadow: 0 0 0 6px rgba(28,25,23,0); }
          }
          .lucky-btn { animation: pulse-border 2s ease-in-out infinite; }
        `}</style>
      </main>
    )
  }

  // ── Handoff ───────────────────────────────────────────────
  if (step === "handoff") {
    return <HandoffScreen nameA={nameA} onReady={() => setStep("person-b")} />
  }

  // ── Person B ──────────────────────────────────────────────
  if (step === "person-b") {
    return (
      <main className="min-h-screen bg-stone-50 flex flex-col">
        <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-5 py-8 space-y-8">
          <div className="pt-4 space-y-1">
            <h1 className="text-2xl font-bold text-stone-800 tracking-tight">Your turn</h1>
            <p className="text-stone-400 text-sm">Don&apos;t look at {nameA}&apos;s picks. What are you into?</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-600">Your name</label>
            <input type="text" value={nameB} onChange={(e) => setNameB(e.target.value)}
              placeholder="e.g. John"
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 placeholder-stone-300 focus:outline-none focus:border-stone-400 bg-white text-base" />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-stone-600">Pick up to 3 categories.</label>
            <PreferencePanel selected={catsB} onChange={setCatsB} />
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => handlePersonBDone("wizard")}
              disabled={!nameB.trim() || catsB.length === 0}
              className="w-full bg-stone-900 text-white font-semibold py-4 rounded-2xl text-base disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-700 transition-colors">
              See how we match
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-xs text-stone-400">or</span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            <button
              onClick={() => { if (nameB.trim()) handlePersonBDone("lucky") }}
              disabled={!nameB.trim()}
              className="w-full border-2 border-stone-800 text-stone-800 font-semibold py-4 rounded-2xl text-base disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-stone-800 hover:text-white">
              <span className="flex items-center justify-center gap-2">
                <i className="ti ti-stars text-lg leading-none" aria-hidden="true" />
                I&apos;m feeling lucky
              </span>
            </button>
            {!nameB.trim() && (
              <p className="text-xs text-stone-400 text-center">enter your name first</p>
            )}
          </div>
        </div>
      </main>
    )
  }

  // ── Lucky results ─────────────────────────────────────────
  if (step === "lucky-results") {
    const bothLucky = modeA === "lucky" && modeB === "lucky"
    const wizardIsA = modeA === "wizard"
    return (
      <LuckyResults
        activities={activities}
        weatherHint={weatherHint}
        bothLucky={bothLucky}
        wizardName={bothLucky ? undefined : wizardIsA ? nameA : nameB}
        luckyName={bothLucky ? undefined : wizardIsA ? nameB : nameA}
        wizardCats={bothLucky ? [] : wizardIsA ? catsA : catsB}
        onReset={handleReset}
      />
    )
  }

  // ── Creamy Pints ──────────────────────────────────────────
  if (step === "creamy-pints") {
    return <CreamyPintsEasterEgg activities={activities} onReset={handleReset} />
  }

  // ── Countdown ─────────────────────────────────────────────
  if (step === "countdown") {
    const bothLucky = modeA === "lucky" && modeB === "lucky"
    return <Countdown onComplete={() => bothLucky ? setStep("lucky-results") : setStep("reveal")} />
  }

  // ── Reveal ────────────────────────────────────────────────
  if (step === "reveal") {
    const revealScenario = creamyScenario === "both-only" ? "none" : creamyScenario === "none" ? "none" : creamyScenario
    return (
      <MatchReveal nameA={nameA} nameB={nameB} catsA={catsA} catsB={catsB}
        onReveal={() => setStep("results")} creamyScenario={revealScenario} />
    )
  }

  // ── Results ───────────────────────────────────────────────
  return (
    <ResultsPage
      nameA={nameA} nameB={nameB}
      catsA={catsA} catsB={catsB}
      matched={matched} onlyA={onlyA} onlyB={onlyB}
      savedIds={savedIds} onToggleSave={handleToggleSave}
      onReset={handleReset} weather={weather}
    />
  )
}
