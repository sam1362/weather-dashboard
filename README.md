# Værdashboard (MET Norway / YR)

React + Vite + TypeScript værapp som henter data fra MET Norway / YR (locationforecast 2.0) og viser nåværende vær, 7-dagers og time-for-time.  
UI og kommentarer er på norsk.

 **Live demo (Vercel): https://weather-dashboard-rho-three.vercel.app/**

---

## Hovedfunksjoner
- Nåværende vær med både Celsius og Fahrenheit, føles som, vind, luftfuktighet og nedbør.
- 7-dagers og time-for-time visning, med enkel filtrering (Alle/Daglig/Time) og sortering på varmest først.
- Søk med 600 ms debounce; tast Enter eller klikk på søk. Geokoding via open-meteo (for å få lat/lon til MET-kallet).
- Lasteskjeletter for alle seksjoner, feilhåndtering med toast og error boundary.
- Responsivt (320 / 768 / 1024) med Tailwind, mobil først.
- A11y: semantiske områder (main/section/article/time), ARIA-labels, tastaturfokus (focus-visible), Enter-handlere, alt-tekst/ikoner.
- Valgfri mørk/lys-modus, enhetstoggling °C/°F, ikonpakke fra lucide-react.

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

---

## Screenshot
Legg inn eget skjermbilde i `docs/screenshot.png`, og inkluder:

```md
![Screenshot](./docs/screenshot.png)
```
