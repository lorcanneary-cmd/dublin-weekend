export interface WeatherResult {
  tempC: number
  feelsC: number
  windKph: number
  precipProb: number
  code: number
  text: string
  icon: string
}

export type WeatherHint = "rain" | "clear" | null

const CACHE_TTL_MS = 2 * 60 * 60 * 1000
const DUBLIN_LAT = 53.3498
const DUBLIN_LON = -6.2603

export function mapWeather(code: number): { icon: string; text: string } {
  if (code === 0) return { icon: "clear", text: "Clear sky" }
  if (code <= 2) return { icon: "partly-cloudy", text: "Partly cloudy" }
  if (code === 3) return { icon: "cloudy", text: "Overcast" }
  if (code <= 49) return { icon: "fog", text: "Foggy" }
  if (code <= 59) return { icon: "drizzle", text: "Drizzle" }
  if (code <= 69) return { icon: "rain", text: "Rain" }
  if (code <= 79) return { icon: "snow", text: "Snow" }
  if (code <= 82) return { icon: "rain", text: "Rain showers" }
  if (code <= 86) return { icon: "snow", text: "Snow showers" }
  if (code <= 99) return { icon: "thunder", text: "Thunderstorm" }
  return { icon: "cloudy", text: "Unknown" }
}

export function weatherHintFromCode(code: number): WeatherHint {
  if (code >= 51) return "rain"
  if (code <= 2) return "clear"
  return null
}

function lsGet(key: string): WeatherResult | null {
  try {
    const raw = localStorage.getItem(`wx_${key}`)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL_MS) return null
    return data
  } catch { return null }
}

function lsSet(key: string, data: WeatherResult) {
  try {
    localStorage.setItem(`wx_${key}`, JSON.stringify({ data, ts: Date.now() }))
  } catch {}
}

export async function fetchDublinWeather(): Promise<WeatherResult | null> {
  const key = `dublin_${new Date().toISOString().slice(0, 10)}`
  const cached = lsGet(key)
  if (cached) return cached

  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast")
    url.searchParams.set("latitude", DUBLIN_LAT.toString())
    url.searchParams.set("longitude", DUBLIN_LON.toString())
    url.searchParams.set("current", "temperature_2m,apparent_temperature,precipitation_probability,wind_speed_10m,weather_code")
    url.searchParams.set("timezone", "Europe/Dublin")

    const res = await fetch(url.toString())
    if (!res.ok) return null
    const json = await res.json()
    const c = json.current
    const mapped = mapWeather(c.weather_code)

    const result: WeatherResult = {
      tempC: Math.round(c.temperature_2m),
      feelsC: Math.round(c.apparent_temperature),
      windKph: Math.round(c.wind_speed_10m),
      precipProb: Math.round(c.precipitation_probability ?? 0),
      code: c.weather_code,
      text: mapped.text,
      icon: mapped.icon,
    }

    lsSet(key, result)
    return result
  } catch { return null }
}
