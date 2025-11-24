# Værdashboard (MET Norway / YR)

React + Vite + TypeScript værapp som henter data fra MET Norway / YR (locationforecast 2.0) og viser nåværende vær, 7-dagers og time-for-time. UI og kommentarer er på norsk.

## Hovedfunksjoner
- Nåværende vær med både Celsius og Fahrenheit, føles som, vind, luftfuktighet og nedbør.
- 7-dagers og time-for-time visning, med enkel filtrering (Alle/Daglig/Time) og sortering på varmest først.
- Søk med 600 ms debounce; tast Enter eller klikk på søk. Geokoding via open-meteo (for å få lat/lon til MET-kallet).
- Lasteskjeletter for alle seksjoner, feilhåndtering med toast og error boundary.
- Responsivt (320 / 768 / 1024) med Tailwind, mobil først.
- A11y: semantiske områder (main/section/article/time), ARIA-labels, tastaturfokus (focus-visible), Enter-handlere, alt-tekst/ikoner.
- Valgfri mørk/lys-modus, enhetstoggling °C/°F, ikonpakke fra lucide-react.

## Teknologistack
- React 19, TypeScript, Vite
- Tailwind CSS
- Jest + Testing Library (+ jest-axe for UU), Playwright for E2E
- MET Norway / YR locationforecast API (vær), open-meteo geocoding (for koordinater)

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

## Kom i gang
Forutsetning: Node 20+.

```bash
npm install
npm run dev
```

Åpne `http://localhost:5173`.

## Testing
- Enhet/komponent: `npm test`
- Watch: `npm run test:watch`
- E2E (Playwright):  
  1) `npx playwright install --with-deps` (laster ned nettlesere)  
  2) `npm run test:e2e`

E2E-testene mocker både geokoding og MET-kallet, så de kjøres uten nettverk.

## API-notater
- Værdata: `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat={lat}&lon={lon}`  
  (ingen API-nøkkel, men krever lat/lon og fornuftig User-Agent – browsere lar ikke egendefinert User-Agent-header, så vi kjører uten).
- Geokoding: open-meteo search endepunktet for å slå opp koordinater basert på søkestreng.
- Feil og timeouts fanges i `useWeather` med abort-støtte.

## Deploy
- Klar for Vercel: legg til prosjektet, pek på repo, byggkommando `npm run build`, output `dist/`.

## Screenshot
- Kjør `npm run dev`, ta skjermbilde av dashboardet (f.eks. med en valgt by), lagre som `docs/screenshot.png`, og legg inn i README hvis ønsket.
