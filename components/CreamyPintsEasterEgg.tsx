"use client"

import type { Activity } from "@/lib/ranking"

interface Props {
  activities: Activity[]
  onReset: () => void
}

function searchUrl(act: Activity) {
  return `https://www.google.com/search?q=${encodeURIComponent((act.searchQuery || act.title + ' Dublin pub'))}`
}

export default function CreamyPintsEasterEgg({ activities, onReset }: Props) {
  const pubs = activities.filter(a => a.primaryCategory === "Creamy Pints")

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', padding: '32px 20px 60px', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#111', margin: '0 0 8px' }}>
        you absolute legends.
      </h1>
      <p style={{ fontSize: '15px', color: '#666', margin: '0 0 32px', lineHeight: 1.5 }}>
        here are the top ten places for a creamy pint in Dublin
      </p>
      {pubs.map(act => (
        <div key={act.id} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#111', margin: '0 0 4px' }}>{act.title}</p>
          <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.5, margin: '0 0 12px' }}>{act.description}</p>
          <a href={searchUrl(act)} target="_blank" rel="noopener noreferrer"
            style={{ display: 'block', textAlign: 'center', background: '#1a1a1a', color: '#fff', padding: '10px', borderRadius: '12px', fontSize: '13px', textDecoration: 'none' }}>
            Find it
          </a>
        </div>
      ))}
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <button onClick={onReset} style={{ background: 'none', border: 'none', color: '#999', fontSize: '14px', cursor: 'pointer' }}>
          start over
        </button>
      </div>
    </div>
  )
}
