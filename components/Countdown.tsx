"use client"

import { useEffect, useState } from "react"

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
    const t = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [count, onComplete])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px'
    }}>
      <div style={{
        fontSize: '120px',
        fontWeight: 500,
        color: '#ffffff',
        lineHeight: 1,
        transition: 'all 0.2s ease',
        transform: 'scale(1)'
      }}>
        {count === 0 ? '' : count}
      </div>
      <p style={{ fontSize: '14px', color: '#555', letterSpacing: '0.05em' }}>
        finding your matches
      </p>
    </div>
  )
}
