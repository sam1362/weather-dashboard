import { AlertCircle, MoonStar, Sun } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CurrentWeather } from '../components/ui/CurrentWeather'
import { DailyForecast } from '../components/ui/DailyForecast'
import { HourlyForecast } from '../components/ui/HourlyForecast'
import { NavLink } from '../components/ui/NavLink'
import { WeatherSearch } from '../components/ui/WeatherSearch'
import { useDebounce } from '../hooks/useDebounce'
import { useToast } from '../hooks/use-toast'
import { useWeather } from '../hooks/useWeather'
import { reverseGeocode, searchCoordinatesList } from '../lib/api'
import type { DailyForecastItem, TemperatureUnit } from '../types/weather'

type ViewMode = 'all' | 'daily' | 'hourly'

const Index = () => {
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('all')
  const [sortWarmFirst] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [suggestions, setSuggestions] = useState<{ label: string; subLabel?: string }[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const debouncedQuery = useDebounce(query, 0)
  const firstRun = useRef(true)

  const { data, loading, error, refresh, refreshByCoords, unit, setUnit } = useWeather('')
  const { toasts, pushToast, dismiss } = useToast()

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.classList.toggle('light-mode', !darkMode)
  }, [darkMode])

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const baseCoords = {
              lat: pos.coords.latitude,
              lon: pos.coords.longitude,
            }
            try {
              const named = await reverseGeocode(baseCoords)
              if (named) {
                const label = [named.name, named.admin1 ?? named.admin2 ?? named.country].filter(Boolean).join(', ')
                setQuery(label)
                refreshByCoords({ ...named, name: label })
                return
              }
            } catch {
              // fall through to unnamed coords
            }
            refreshByCoords({ ...baseCoords, name: 'Ukjent posisjon' })
          },
          () => {
            // Hvis bruker avviser, ikke last noe – la brukeren søke selv
          },
          { timeout: 5000 },
        )
      }
      return
    }
    const controller = new AbortController()
    const run = async () => {
      if (debouncedQuery.trim().length < 1) {
  setSuggestions([])
  return
}

      try {
        const result = await searchCoordinatesList(debouncedQuery, controller.signal)
        const unique = new Map<string, { label: string; subLabel?: string }>()
        result.forEach((item) => {
          const sub = [item.admin1 ?? item.admin2, item.country ?? 'Norway'].filter(Boolean).join(', ')
          const key = `${item.name}-${sub}`
          if (!unique.has(key)) {
            unique.set(key, { label: item.name, subLabel: sub })
          }
        })
        setSuggestions(Array.from(unique.values()))
      } catch {
        setSuggestions([])
      }
    }
    run()
    return () => controller.abort()
  }, [debouncedQuery, refresh, showSuggestions])

  useEffect(() => {
    if (error) {
      pushToast({
        title: 'Klarte ikke å hente værdata',
        description: error,
        variant: 'error',
      })
    }
  }, [error, pushToast])

  const dailyItems = useMemo<DailyForecastItem[]>(() => {
    const items = data?.daily ?? []
    if (sortWarmFirst) {
      return [...items].sort((a, b) => b.max - a.max)
    }
    return items
  }, [data?.daily, sortWarmFirst])

  const showCurrent = loading || Boolean(data)
  const showDaily = viewMode === 'all' || viewMode === 'daily'
  const showHourly = viewMode === 'all' || viewMode === 'hourly'
  const locationLabel = data?.location.name ?? query

  const toggleUnit = (next: TemperatureUnit) => setUnit(next)

  return (
    <main className={`min-h-screen px-4 py-10 md:px-10 lg:px-16 ${darkMode ? 'bg-midnight' : 'bg-white'}`}>
      <div
        className={`mx-auto flex max-w-6xl flex-col gap-8 ${
          darkMode ? 'text-slate-100' : 'text-slate-900'
        }`}
      >
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="tag">MET Norway / YR</p>
            <h1
              className={`mt-2 text-3xl font-bold md:text-4xl ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              Værdashboard
            </h1>
            <p className={`max-w-2xl text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Live-data fra MET med søk, filtrering og temperatur i både Celsius og Fahrenheit.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDarkMode((prev) => !prev)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
              darkMode
                ? 'bg-white/5 text-slate-200 hover:bg-white/10'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
            aria-pressed={darkMode}
            aria-label="Veksle tema"
          >
            {darkMode ? <MoonStar className="h-4 w-4" aria-hidden /> : <Sun className="h-4 w-4" aria-hidden />}
            {darkMode ? 'Mørkt' : 'Lyst'}
          </button>
        </header>

        <WeatherSearch
          value={query}
          onChange={(value) => {
            setQuery(value)
            setShowSuggestions(true)
          }}
          onSubmit={() => refresh(query)}
          loading={loading}
          darkMode={darkMode}
          suggestions={showSuggestions ? suggestions : []}
          onSelectSuggestion={(value) => {
            setQuery(value)
            refresh(value)
            setSuggestions([])
            setShowSuggestions(false)
          }}
          onUseCurrentLocation={() => {
            setQuery('')
            setSuggestions([])
            setShowSuggestions(false)
            if (typeof navigator !== 'undefined' && navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  refreshByCoords({
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude,
                    name: 'Din posisjon',
                  })
                },
                () => undefined,
                { timeout: 5000 },
              )
            }
          }}
        />

        <section aria-label="Navigasjon" className="flex flex-wrap items-center gap-3">
          <NavLink label="Varsel" active={viewMode === 'all'} onClick={() => setViewMode('all')} darkMode={darkMode} />
          <NavLink
            label="Andre forhold"
            active={viewMode === 'daily'}
            onClick={() => setInfoMessage('Andre forhold er under arbeid – ingen data tilgjengelig ennå.')}
            darkMode={darkMode}
          />
          <NavLink
            label="Kart"
            active={viewMode === 'hourly'}
            onClick={() => setInfoMessage('Kart er under arbeid – ingen data tilgjengelig ennå.')}
            darkMode={darkMode}
          />
          {['21-dagers varsel', 'Hav og kyst', 'Detaljer', 'Statistikk'].map((label) => (
            <NavLink
              key={label}
              label={label}
              darkMode={darkMode}
              onClick={() => setInfoMessage(`${label} er under arbeid – ingen data tilgjengelig ennå.`)}
            />
          ))}
          <button
            type="button"
            onClick={() => {
              setInfoMessage('Sorter på varme først er under arbeid – ingen data tilgjengelig ennå.')
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
              darkMode ? 'bg-white/5 text-slate-200 hover:bg-white/10' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}
            aria-pressed={sortWarmFirst}
          >
            Sorter på varme først
          </button>
        </section>

        {infoMessage && (
          <div
            className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm ${
              darkMode ? 'bg-white/10 text-slate-100' : 'bg-slate-100 text-slate-900'
            }`}
            role="status"
          >
            <div>
              <p className="font-semibold">Info</p>
              <p className="text-sm">{infoMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setInfoMessage(null)}
              className="text-xs font-semibold underline"
            >
              Lukk
            </button>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex items-center gap-3 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-100"
          >
            <AlertCircle className="h-5 w-5" aria-hidden />
            <p>{error}</p>
          </div>
        )}

        {showCurrent && (
          <CurrentWeather
            location={locationLabel}
            unit={unit}
            onUnitChange={toggleUnit}
            loading={loading}
            darkMode={darkMode}
            temperature={data?.current.temperature ?? 0}
            symbol={data?.current.symbol ?? 'cloudy'}
            feelsLike={data?.current.feelsLike ?? 0}
            humidity={data?.current.humidity}
            windSpeed={data?.current.windSpeed}
            pressure={data?.current.pressure}
            precipitation={data?.current.precipitation}
            time={data?.current.time ?? new Date().toISOString()}
          />
        )}

        {showDaily && <DailyForecast unit={unit} items={dailyItems} loading={loading} darkMode={darkMode} />}

        {showHourly && (
          <HourlyForecast unit={unit} items={data?.hourly ?? []} loading={loading} darkMode={darkMode} />
        )}

        {!loading && !data && (
          <p className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-300">
            Ingen data ennå – prøv et annet søk.
          </p>
        )}

        <aside
          className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-3"
          aria-live="assertive"
          aria-label="Varsler"
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto w-80 rounded-2xl px-4 py-3 shadow-lg ${
                toast.variant === 'error' ? 'bg-red-500 text-white' : 'bg-white text-midnight'
              }`}
              role="status"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{toast.title}</p>
                  {toast.description && <p className="text-xs text-slate-800">{toast.description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  className="text-xs font-semibold text-slate-700 underline"
                >
                  Lukk
                </button>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </main>
  )
}

export default Index
