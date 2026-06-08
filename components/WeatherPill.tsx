"use client"

import { useEffect, useState } from "react"
import { fetchWeather, type WeatherResult } from "@/lib/weather"

interface Props {
  lat?: number
  lon?: number
}

const DUBLIN_LAT = 53.3498
const DUBLIN_LON = -6.2603

export default function WeatherPill({ lat, lon }: Props) {
  const [weather, setWeather] = useState<WeatherResult | null>(null)

  useEffect(() => {
    const fetchLat = lat ?? DUBLIN_LAT
    const fetchLon = lon ?? DUBLIN_LON
    fetchWeather(fetchLat, fetchLon).then(setWeather)
  }, [lat, lon])

  if (!weather) return null

  return (
    <span className="inline-flex items-center gap-1.5 text-xs bg-sky-50 text-sky-700 border border-sky-100 rounded-full px-2.5 py-1 font-medium">
      <span>{weather.icon}</span>
      <span>{weather.tempC}°C</span>
      <span className="text-sky-400">·</span>
      <span>{weather.text}</span>
      <span className="text-sky-400">·</span>
      <span>{weather.precipProb}% rain</span>
    </span>
  )
}
