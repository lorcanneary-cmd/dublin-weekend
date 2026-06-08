"use client"

import { useState, useEffect } from "react"

interface Props {
  onComplete: () => void
}

export default function Countdown({ onComplete }: Props) {
  const [count, setCount] = useState(3)

  useEffect(() => {
    if (count === 0) {
      onComplete()
      return
    }

    const timer = setTimeout(() => {
      setCount(count - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [count, onComplete])

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Main number with scale animation */}
        <div
          key={count}
          className="text-white font-bold animate-countdown"
          style={{ fontSize: "120px", lineHeight: 1 }}
        >
          {count}
        </div>

        {/* Subtext */}
        <p className="text-stone-400 text-sm animate-fade-in">
          finding your matches
        </p>
      </div>

      {/* Expanding ring behind number */}
      <div
        key={`ring-${count}`}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-40 h-40 rounded-full border-2 border-white/10 animate-expand-ring" />
      </div>

      <style>{`
        @keyframes countdown {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes expand-ring {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-countdown {
          animation: countdown 1s ease-out;
        }

        .animate-expand-ring {
          animation: expand-ring 1s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-in;
        }
      `}</style>
    </div>
  )
}
