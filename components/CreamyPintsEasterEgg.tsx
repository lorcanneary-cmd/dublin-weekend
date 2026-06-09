"use client"

import type { Activity } from "@/lib/ranking"

interface Props {
  activities: Activity[]
  onReset: () => void
}

export default function CreamyPintsEasterEgg({ activities, onReset }: Props) {
  const pubActivities = activities.filter((a) => a.primaryCategory === "Creamy Pints")

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#ffffff",
      padding: "24px",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {/* Heading */}
        <h1 style={{
          fontSize: "28px",
          fontWeight: 600,
          color: "#1a1a1a",
          marginBottom: "8px",
          marginTop: 0
        }}>
          you absolute legends.
        </h1>

        {/* Subtext */}
        <p style={{
          fontSize: "15px",
          color: "#999999",
          marginBottom: "32px",
          marginTop: "8px"
        }}>
          here are the top ten places for a creamy pint in Dublin
        </p>

        {/* Cards */}
        {pubActivities.map((act) => (
          <div
            key={act.id}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e5e5",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "12px"
            }}
          >
            <h3 style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#1a1a1a",
              marginBottom: "4px",
              marginTop: 0
            }}>
              {act.title}
            </h3>

            {act.description && (
              <p style={{
                fontSize: "13px",
                color: "#666666",
                lineHeight: 1.5,
                marginBottom: "12px",
                marginTop: 0
              }}>
                {act.description}
              </p>
            )}

            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(act.searchQuery || act.title + ' Dublin pub')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                width: "100%",
                backgroundColor: "#1a1a1a",
                color: "#ffffff",
                textDecoration: "none",
                borderRadius: "12px",
                padding: "10px",
                fontSize: "13px",
                fontWeight: 500,
                textAlign: "center",
                boxSizing: "border-box",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333333")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1a1a1a")}
            >
              Find it
            </a>
          </div>
        ))}

        {/* Start over */}
        <div style={{
          textAlign: "center",
          marginTop: "24px",
          paddingBottom: "40px"
        }}>
          <button
            onClick={onReset}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#999999",
              fontSize: "13px",
              cursor: "pointer",
              textDecoration: "none",
              transition: "color 0.2s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#666666")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#999999")}
          >
            start over
          </button>
        </div>
      </div>
    </div>
  )
}
