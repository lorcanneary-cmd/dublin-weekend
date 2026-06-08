# What Are We Doing? 🗺️

A mobile-first web app for couples to find something to do in Dublin and Wicklow. Each person picks their categories independently, then the app reveals where you match — and where you don't.

## How it works

1. **Person A** enters their name and picks up to 3 categories
2. Phone is passed — handoff screen covers their picks
3. **Person B** enters their name and picks up to 3 categories
4. A **match reveal** shows overlap (and playfully calls out the mismatches)
5. **Results** split into "You both want this" and "Only [Name] wants this"
6. Each card has weather, duration, cost, booking links, and a save button
7. Share link encodes both picks into the URL

## Running locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploying to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Click Deploy — no environment variables needed

## Data schema (`data/activities.json`)

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | ✓ | Unique slug |
| `title` | string | ✓ | Display name |
| `primaryCategory` | string | ✓ | One of: Walks, Adventures, Culture, Food & Drink, Film, Low-Key |
| `tags` | string[] | ✓ | e.g. `["outdoor","scenic","rainy"]` |
| `weather` | string[] | ✓ | `["sun","cloud","rain"]` — which conditions suit it |
| `cost` | string | ✓ | `"free"`, `"€"`, `"€€"`, `"€€€"` |
| `durationMin` | number | ✓ | Estimated duration in minutes |
| `lat` | number | — | Latitude for weather fetch |
| `lon` | number | — | Longitude for weather fetch |
| `infoUrl` | string | — | Link to more info |
| `bookingUrl` | string | — | Link to book (shows "Book now" button) |
| `requiresBooking` | boolean | — | Whether booking is essential |
| `priceHint` | string | — | e.g. `"~€12pp"` |
| `availabilityNote` | string | — | e.g. `"Sundays only"` or `"Just turn up"` |

## Adding new activities

Add an object to `data/activities.json` following the schema above. The app picks it up automatically — no code changes needed.

**Tags that affect scoring:**
- `"rainy"` or `"indoor"` → boosted when weather is bad
- `"outdoor"` or `"scenic"` → boosted when weather is clear
- `"romantic"`, `"hidden-gem"` → shown in reason line

## Weather

Uses [Open-Meteo](https://open-meteo.com/) — completely free, no API key. Fetches current conditions for each activity's lat/lon (falls back to Dublin city centre). Results cached in localStorage for 2 hours. If the fetch fails, weather pills simply don't show — the app still works.

## No API keys, no database, no auth

This app is entirely client-side. Nothing to configure on Vercel.
