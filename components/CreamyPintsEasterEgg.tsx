"use client"

import { useState, useEffect } from "react"
import type { Activity } from "@/lib/ranking"

interface Props {
  activities: Activity[]
  onReset: () => void
}

export default function CreamyPintsEasterEgg({ activities, onReset }: Props) {
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1)
  const pubActivities = activities.filter((a) => a.primaryCategory === "Creamy Pints")

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(2), 2500)
    return () => clearTimeout(timer1)
  }, [])

  useEffect(() => {
    if (phase < 2) return
    const timer2 = setTimeout(() => setPhase(3), 1000)
    return () => clearTimeout(timer2)
  }, [phase])

  useEffect(() => {
    if (phase < 3) return
    const timer3 = setTimeout(() => setPhase(4), 1200)
    return () => clearTimeout(timer3)
  }, [phase])

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      backgroundColor: phase < 2 ? "#ffffff" : "#0f0f0f",
      transition: phase === 2 ? "background-color 0.5s ease-in-out" : "none"
    }}>
      {/* Phase 1 & 2: Pint glass */}
      {phase < 3 && (
        <div style={{
          position: "relative",
          width: "96px",
          height: "128px",
          opacity: phase < 2 ? 1 : 0,
          transition: phase === 2 ? "opacity 0.5s ease-out" : "none",
          transitionDelay: phase === 2 ? "0s" : "none"
        }}>
          <svg
            viewBox="0 0 80 120"
            style={{ width: "100%", height: "100%" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Glass outline */}
            <path
              d="M 20 30 L 15 100 Q 15 110 25 110 L 55 110 Q 65 110 65 100 L 60 30 Z"
              fill="none"
              stroke="#1c1c1c"
              strokeWidth="2"
            />

            {/* Glass fill container with overflow hidden */}
            <g style={{ overflow: "hidden" }}>
              <defs>
                <clipPath id="glassClip">
                  <path d="M 20 30 L 15 100 Q 15 110 25 110 L 55 110 Q 65 110 65 100 L 60 30 Z" />
                </clipPath>
              </defs>

              {/* Rising fill div (dark brown/black) */}
              <rect
                x="12"
                y="20"
                width="56"
                height="70"
                fill="#1a1a1a"
                clipPath="url(#glassClip)"
                style={{
                  animation: phase >= 1 ? "fillRise 2.5s ease-in-out forwards" : "none"
                }}
              />

              {/* White foam head (top 20% of fill) */}
              <rect
                x="12"
                y="20"
                width="56"
                height="14"
                fill="#ffffff"
                clipPath="url(#glassClip)"
                style={{
                  animation: phase >= 1 ? "foamRise 2.5s ease-in-out forwards" : "none"
                }}
              />
            </g>
          </svg>
        </div>
      )}

      {/* Phase 3: Headline */}
      {phase >= 3 && (
        <h1 style={{
          fontSize: "32px",
          fontWeight: "700",
          color: "#ffffff",
          textAlign: "center",
          maxWidth: "448px",
          marginBottom: "24px",
          animation: "fadeIn 0.8s ease-in forwards",
          opacity: 0
        }}>
          the most important decision you'll make today
        </h1>
      )}

      {/* Phase 3: Subtext */}
      {phase >= 3 && (
        <p style={{
          fontSize: "14px",
          color: "#999999",
          textAlign: "center",
          marginBottom: "48px",
          animation: "fadeIn 0.8s ease-in 0.3s forwards",
          opacity: 0
        }}>
          you absolute legends. both of you.
        </p>
      )}

      {/* Phase 4: Pub cards */}
      {phase >= 4 && (
        <div style={{
          width: "100%",
          maxWidth: "512px",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}>
          {pubActivities.map((act, idx) => (
            <div
              key={act.id}
              style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333333",
                borderRadius: "16px",
                padding: "16px",
                animation: `slideUp 0.5s ease-out ${idx * 0.1}s both`,
                opacity: 0,
                transform: "translateY(20px)"
              }}
            >
              <h3 style={{
                fontWeight: "600",
                color: "#ffffff",
                fontSize: "16px",
                marginBottom: "8px"
              }}>
                {act.title}
              </h3>
              {act.description && (
                <p style={{
                  fontSize: "14px",
                  color: "#999999",
                  marginBottom: "12px"
                }}>
                  {act.description}
                </p>
              )}
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(act.searchQuery || act.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#d4d4d4",
                  fontSize: "13px",
                  fontWeight: "500",
                  textDecoration: "none",
                  transition: "color 0.2s"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#d4d4d4")}
              >
                <i className="ti ti-search" style={{ fontSize: "13px" }} aria-hidden="true" />
                Find it
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Start over button */}
      {phase >= 4 && (
        <button
          onClick={onReset}
          style={{
            marginTop: "32px",
            backgroundColor: "transparent",
            border: "none",
            color: "#808080",
            fontSize: "13px",
            cursor: "pointer",
            transition: "color 0.2s",
            animation: "fadeIn 0.8s ease-in 0.5s forwards",
            opacity: 0
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#b3b3b3")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#808080")}
        >
          start over
        </button>
      )}

      <style>{`
        @keyframes fillRise {
          0% {
            y: 90;
            height: 0;
          }
          100% {
            y: 20;
            height: 70;
          }
        }

        @keyframes foamRise {
          0% {
            y: 90;
            height: 0;
          }
          100% {
            y: 56;
            height: 14;
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
