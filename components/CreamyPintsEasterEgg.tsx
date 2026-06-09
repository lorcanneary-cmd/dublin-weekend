"use client"

import { useState, useEffect } from "react"
import type { Activity } from "@/lib/ranking"

interface Props {
  activities: Activity[]
  onReset: () => void
}

export default function CreamyPintsEasterEgg({ activities, onReset }: Props) {
  const [fillComplete, setFillComplete] = useState(false)
  const [showHeadline, setShowHeadline] = useState(false)
  const [showSubtext, setShowSubtext] = useState(false)
  const [showCards, setShowCards] = useState(false)

  const pubActivities = activities.filter((a) => a.primaryCategory === "Creamy Pints")

  useEffect(() => {
    const fillTimer = setTimeout(() => {
      setFillComplete(true)
    }, 2000)
    return () => clearTimeout(fillTimer)
  }, [])

  useEffect(() => {
    if (!fillComplete) return
    const headlineTimer = setTimeout(() => {
      setShowHeadline(true)
    }, 300)
    return () => clearTimeout(headlineTimer)
  }, [fillComplete])

  useEffect(() => {
    if (!showHeadline) return
    const subtextTimer = setTimeout(() => {
      setShowSubtext(true)
    }, 300)
    return () => clearTimeout(subtextTimer)
  }, [showHeadline])

  useEffect(() => {
    if (!showSubtext) return
    const cardsTimer = setTimeout(() => {
      setShowCards(true)
    }, 300)
    return () => clearTimeout(cardsTimer)
  }, [showSubtext])

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-6 py-12 space-y-8">
      {/* Pint glass SVG */}
      <div className="relative w-24 h-32">
        <svg
          viewBox="0 0 80 120"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="fillClip">
              <rect
                x="12"
                y="20"
                width="56"
                height="70"
                style={{
                  animation: fillComplete ? "none" : "fillUp 2s ease-in-out forwards",
                }}
              />
            </clipPath>
          </defs>

          {/* Glass outline */}
          <path
            d="M 20 30 L 15 100 Q 15 110 25 110 L 55 110 Q 65 110 65 100 L 60 30 Z"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />

          {/* Fill */}
          <rect
            x="12"
            y="20"
            width="56"
            height="70"
            fill="#E8B67B"
            clipPath="url(#fillClip)"
          />

          {/* Foam head */}
          {fillComplete && (
            <g
              style={{
                animation: "foamFade 0.8s ease-out forwards",
              }}
            >
              <circle cx="40" cy="20" r="8" fill="white" opacity="0.8" />
              <circle cx="28" cy="18" r="5" fill="white" opacity="0.7" />
              <circle cx="52" cy="19" r="6" fill="white" opacity="0.7" />
            </g>
          )}
        </svg>
      </div>

      {/* Headline */}
      {showHeadline && (
        <h1
          className="text-2xl font-bold text-white text-center animate-fade-in max-w-sm"
          style={{ animation: "fadeIn 0.6s ease-in" }}
        >
          the most important decision you'll make today
        </h1>
      )}

      {/* Subtext */}
      {showSubtext && (
        <p
          className="text-stone-400 text-sm text-center animate-fade-in"
          style={{ animation: "fadeIn 0.6s ease-in" }}
        >
          you absolute legends. both of you.
        </p>
      )}

      {/* Pub cards */}
      {showCards && (
        <div className="w-full max-w-lg space-y-3 animate-fade-in" style={{ animation: "fadeIn 0.6s ease-in" }}>
          {pubActivities.map((act, idx) => (
            <div
              key={act.id}
              className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2"
              style={{
                animation: `slideUp 0.5s ease-out ${idx * 0.1}s both`,
              }}
            >
              <h3 className="font-semibold text-white text-base">{act.title}</h3>
              {act.description && (
                <p className="text-sm text-stone-400">{act.description}</p>
              )}
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(act.searchQuery || act.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-stone-300 hover:text-white text-xs font-medium transition-colors"
              >
                <i className="ti ti-search text-xs mr-1" aria-hidden="true" />
                Search online
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Start over button */}
      {showCards && (
        <button
          onClick={onReset}
          className="text-stone-500 hover:text-stone-300 text-xs transition-colors animate-fade-in"
          style={{ animation: "fadeIn 0.6s ease-in 0.5s both" }}
        >
          start over
        </button>
      )}

      <style>{`
        @keyframes fillUp {
          0% {
            height: 0;
            y: 90;
          }
          100% {
            height: 70;
            y: 20;
          }
        }

        @keyframes foamFade {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
