# Værdashboard (MET Norway / YR)

React + Vite + TypeScript værapp som henter data fra MET Norway / YR (locationforecast 2.0) og viser nåværende vær, 7-dagers og time-for-time.  
UI og kommentarer er på norsk.

 **Live demo (Vercel): https://weather-dashboard-rho-three.vercel.app/**

---

## Implementerte funksjoner og forskjeller

Nesten alle krav er implementert, med følgende detaljer:

✔ Nåværende vær (°C/°F, vind, fuktighet, nedbør, trykk, sikt, UV)  
✔ Dynamiske symboler basert på MET `symbol_code` (dag/natt)  
✔ Time-for-time (12 timer) og 7-dagers varsel  
✔ Filtre for alle / kaldt (≤0°C) / varmt (≥15°C) / med nedbør / uten nedbør  
✔ Søk med forslag fra første tegn (open-meteo geokoding)  
✔ MET locationforecast for værdata  
✔ Skjelett-loading, toast og feilgrense  
✔ Mørk/lys-modus, temperaturfarger og lucide-ikoner  
✔ A11y (ARIA, semantikk, focus-visible)

### Bruk min posisjon
- Henter geolokasjon **kun ved klikk** (ingen automatisk forespørsel).  
- Søket tømmes, koordinater hentes via `navigator.geolocation` og MET oppdateres.  
- Hvis brukeren avslår, skjer ingenting (stille fallback).  
- Første lasting bruker **Oslo** som standard.
---

## Teknologistack
- React 19, TypeScript, Vite  
- Tailwind CSS  
- Jest + Testing Library (+ jest-axe for UU), Playwright for E2E  
- MET Norway / YR locationforecast API (vær)  
- Open-meteo geocoding (for koordinater)

---

## Strukturoversikt
```
src/
components/
ui/ (CurrentWeather, DailyForecast, HourlyForecast, WeatherSearch, ErrorBoundary, NavLink)
hooks/ (useWeather, useDebounce, use-mobile, use-toast)
lib/ (api, mapper, utils)
pages/ (Index, NotFound)
types/ (weather)
setupTests.ts
App.tsx
main.tsx
index.css
tests/ (Playwright e2e)
```

---

## Kom i gang
Forutsetning: Node 20+.

```bash
npm install
npm run dev
```

Åpne `http://localhost:5173`.

---

## Testing
- Enhet/komponent: `npm test`
- Watch: `npm run test:watch`
- E2E (Playwright):
  1. `npx playwright install --with-deps`
  2. `npm run test:e2e`

E2E-testene mocker både geokoding og MET-kallet, så de kjøres uten nettverk.

---

## Deploy (Vercel)
- Live: [https://weather-dashboard-rho-three.vercel.app/](https://weather-dashboard-rho-three.vercel.app/)
- Klar for Vercel:
  - Build command: `npm run build`
  - Output: `dist/`

---

## Videre forbedringer (hvis mer tid)
- Kart + radarlag (Leaflet/Mapbox) for nedbør, vind og temperatur.
- Favorittbyer / persistering og rask byveksling.
- Grafer (temperatur, vind, UV) med Recharts/Chart.js.
- PWA-støtte: offline-modus, auto-refresh, installérbar app.
- Arkitektur: React Query for caching/SWR, Next.js SSR for raskere first paint.
- Testing: Flere E2E-scenarioer, MSW-mocking, visual regression og mapper-tester.

---

## API-notater
- Værdata: `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat={lat}&lon={lon}`
- Geokoding: Open-meteo search-endepunkt.
- Feil, avbrudd og timeouts håndteres i `useWeather` via AbortController.


