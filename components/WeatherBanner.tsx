"use client"

import type { WeatherResult } from "@/lib/weather"

const ICON_MAP: Record<string, string> = {
  "clear": "ti-sun",
  "partly-cloudy": "ti-cloud-sun",
  "cloudy": "ti-cloud",
  "fog": "ti-cloud-fog",
  "drizzle": "ti-cloud-drizzle",
  "rain": "ti-cloud-rain",
  "snow": "ti-snowflake",
  "thunder": "ti-cloud-storm",
}

interface Props {
  weather: WeatherResult | null
}

export default function WeatherBanner({ weather }: Props) {
  if (!weather) return null

  const icon = ICON_MAP[weather.icon] || "ti-cloud"

  return (
    <div className="flex items-center gap-3 bg-sky-50 border border-sky-100 rounded-2xl px-4 py-3 mb-2">
      <i className={`ti ${icon} text-sky-500 text-xl leading-none`} aria-hidden="true" />
      <div className="flex-1">
        <p className="text-xs text-sky-500 font-medium uppercase tracking-widest">Today in Dublin</p>
        <p className="text-sm text-sky-800 font-medium">
          {weather.tempC}°C · {weather.text} · {weather.precipProb}% rain · {weather.windKph} km/h
        </p>
      </div>
    </div>
  )
}
