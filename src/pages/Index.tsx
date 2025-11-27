import { MoonStar, Sun } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CurrentWeather } from '../components/ui/CurrentWeather'
import { DailyForecast } from '../components/ui/DailyForecast'
import { HourlyForecast } from '../components/ui/HourlyForecast'
import { NavLink } from '../components/ui/NavLink'
import { WeatherSearch } from '../components/ui/WeatherSearch'
import { HourlyFilter, type HourFilter } from '../components/ui/HourlyFilter'
import { useDebounce } from '../hooks/useDebounce'
import { useToast } from '../hooks/use-toast'
import { useWeather } from '../hooks/useWeather'
import { useMobile } from '../hooks/use-mobile'
import { searchCoordinatesList } from '../lib/api'
import type { DailyForecastItem } from '../types/weather'

// --- Sidevisningstyper ---
type ViewMode = 'all' | 'daily' | 'hourly'

// HOVEDKOMPONENT — Hele siden 


const Index = () => {
  // --- Søk & navigasjon ---
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('all')
  const [sortWarmFirst] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  // --- Autocomplete-forslag ---
  const [suggestions, setSuggestions] = useState<{ label: string; subLabel?: string }[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // --- Mobil meny ---
  const [showMenu, setShowMenu] = useState(false)

  // --- Filter for time-for-time ---
  const [hourFilter, setHourFilter] = useState<HourFilter>('all')

  // --- Debounce av søket ---
  const debouncedQuery = useDebounce(query, 0)
  const firstRun = useRef(true)

  // --- Mobil-deteksjon ---
  const isMobile = useMobile(768)

  // --- Værdata ---
  const { data, loading, error, refresh, refreshByCoords, unit, setUnit } = useWeather('Oslo')

  // --- Toast-system ---
  const { toasts, pushToast, dismiss } = useToast()


  //  Tema (light/dark)


  useEffect(() => {
    document.body.classList.toggle('light-mode', !darkMode)
  }, [darkMode])


  // Autocomplete søk
  

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
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
          const sub = [item.admin1 ?? item.admin2, item.country ?? 'Norway']
            .filter(Boolean)
            .join(', ')
          const key = `${item.name}-${sub}`
          if (!unique.has(key)) unique.set(key, { label: item.name, subLabel: sub })
        })

        setSuggestions(Array.from(unique.values()))
      } catch {
        setSuggestions([])
      }
    }

    run()
    return () => controller.abort()
  }, [debouncedQuery, refresh, showSuggestions])


  //  Feil → Toast
 

  useEffect(() => {
    if (error) {
      pushToast({
        title: 'Klarte ikke å hente værdata',
        description: error,
        variant: 'error'
      })
    }
  }, [error, pushToast])

 
  // Sortering av dager


  const dailyItems = useMemo<DailyForecastItem[]>(() => {
    const items = data?.daily ?? []
    if (sortWarmFirst) return [...items].sort((a, b) => b.max - a.max)
    return items
  }, [data?.daily, sortWarmFirst])

 
  //  Filtrering av time-for-time
 

  const filteredHourly = useMemo(() => {
    const items = data?.hourly ?? []
    switch (hourFilter) {
      case 'cold': return items.filter((h) => h.temp <= 0)
      case 'warm': return items.filter((h) => h.temp >= 15)
      case 'precip': return items.filter((h) => (h.precipitation ?? 0) > 0)
      case 'dry': return items.filter((h) => (h.precipitation ?? 0) === 0)
      default: return items
    }
  }, [data?.hourly, hourFilter])

  const showCurrent = loading || Boolean(data)
  const showDaily = viewMode === 'all' || viewMode === 'daily'
  const showHourly = viewMode === 'all' || viewMode === 'hourly'

  const locationLabel = data?.location.name ?? query

 
  // alle seksjoner får stabil minimumshøyde


  return (
    <main
      className={`px-4 py-10 md:px-10 lg:px-16 ${darkMode ? 'bg-midnight' : 'bg-white'}`}
      style={{ minHeight: 1600 }}
    >
      <div className={`mx-auto flex max-w-6xl flex-col gap-8 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>

        {/* HEADER */}
    
        <header className="flex flex-wrap items-start justify-between gap-3">

          {/* Tittel */}
          <h1 className={`text-3xl font-bold md:text-4xl ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Værdashboard
          </h1>

          <div className="ml-auto flex items-center gap-2">

            {/* °C / °F */}
            <div className={darkMode ? 'rounded-full bg-white/5 p-1' : 'rounded-full bg-slate-100 p-1'}>
              <button
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  unit === 'celsius' ? 'bg-white text-midnight' : darkMode ? 'text-slate-200' : 'text-slate-700'
                }`}
                onClick={() => setUnit('celsius')}
              >
                °C
              </button>

              <button
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  unit === 'fahrenheit' ? 'bg-white text-midnight' : darkMode ? 'text-slate-200' : 'text-slate-700'
                }`}
                onClick={() => setUnit('fahrenheit')}
              >
                °F
              </button>
            </div>

            {/* Tema-knapp */}
            <button
              onClick={() => setDarkMode((p) => !p)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                darkMode ? 'bg-white/5 text-slate-200' : 'bg-slate-900 text-white'
              }`}
            >
              {darkMode ? <MoonStar className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {darkMode ? 'Mørkt' : 'Lyst'}
            </button>

            {/*  Mobilmeny-knapp */}
            {isMobile && (
              <button
                type="button"
                onClick={() => setShowMenu((prev) => !prev)}
                className={`rounded-full p-3 text-sm font-semibold transition ${
                  darkMode ? 'bg-white/5 text-slate-200 hover:bg-white/10'
                          : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
                aria-label="Meny"
              >
                ☰
              </button>
            )}
          </div>
        </header>

       
        {/* MOBILMENY (Zero-CLS) */}
      
        {isMobile && (
          <section
            aria-label="Navigasjon"
            style={{ minHeight: showMenu ? 150 : 0 }}
            className="flex flex-col gap-2 overflow-hidden transition-all duration-200"
          >
            {showMenu && (
              <>
                <NavLink label="Varsel" active={viewMode === 'all'} onClick={() => { setViewMode('all'); setShowMenu(false) }} darkMode={darkMode} />
                <NavLink label="Andre forhold" onClick={() => { setShowMenu(false) }} darkMode={darkMode} />
                <NavLink label="Kart" onClick={() => { setShowMenu(false) }} darkMode={darkMode} />
                <NavLink label="21-dagers varsel" onClick={() => { setShowMenu(false) }} darkMode={darkMode} />
                <NavLink label="Hav og kyst" onClick={() => { setShowMenu(false) }} darkMode={darkMode} />
                <NavLink label="Detaljer" onClick={() => { setShowMenu(false) }} darkMode={darkMode} />
                <NavLink label="Statistikk" onClick={() => { setShowMenu(false) }} darkMode={darkMode} />
                <NavLink label="Sorter på varme først" onClick={() => { setShowMenu(false) }} darkMode={darkMode} />
              </>
            )}
          </section>
        )}


        {/* SØKEFELT */}
       
        <section style={{ minHeight: 80 }}>
          <WeatherSearch
            value={query}
            onChange={(v) => { setQuery(v); setShowSuggestions(true) }}
            onSubmit={() => {
              const q = query.trim()
              if (q) refresh(q)
            }}
            loading={loading}
            darkMode={darkMode}
            disableTooltip={isMobile}
            suggestions={showSuggestions ? suggestions : []}
            onSelectSuggestion={(v) => {
              setQuery('')
              refresh(v)
              setSuggestions([])
              setShowSuggestions(false)
            }}
            onUseCurrentLocation={() => {
              setQuery('')
              setSuggestions([])
              setShowSuggestions(false)
              navigator.geolocation?.getCurrentPosition((pos) => {
                refreshByCoords({
                  lat: pos.coords.latitude,
                  lon: pos.coords.longitude,
                  name: 'Din posisjon'
                })
              })
            }}
          />
        </section>

  
        {/* DESKTOP NAV */}
       
        {!isMobile && (
          <section className="flex flex-wrap items-center gap-3" style={{ minHeight: 48 }}>
            <NavLink label="Varsel" active={viewMode === 'all'} onClick={() => setViewMode('all')} darkMode={darkMode} />
            <NavLink label="Andre forhold" onClick={() => undefined} darkMode={darkMode} />
            <NavLink label="Kart" onClick={() => undefined} darkMode={darkMode} />
            <NavLink label="21-dagers varsel" onClick={() => undefined} darkMode={darkMode} />
            <NavLink label="Hav og kyst" onClick={() => undefined} darkMode={darkMode} />
            <NavLink label="Detaljer" onClick={() => undefined} darkMode={darkMode} />
            <NavLink label="Statistikk" onClick={() => undefined} darkMode={darkMode} />
            <NavLink label="Sorter på varme først" onClick={() => undefined} darkMode={darkMode} />
          </section>
        )}

   
        {/* CURRENT WEATHER  */}
       
        <section style={{ minHeight: 480 }}>
          {showCurrent && (
            <CurrentWeather
              location={locationLabel}
              unit={unit}
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
        </section>

     
        {/* FILTER  */}
      
        {showHourly && (
          <section style={{ minHeight: 40 }}>
            <HourlyFilter value={hourFilter} onChange={setHourFilter} darkMode={darkMode} />
          </section>
        )}

        {/* TIME-FOR-TIME  */}
    
        {showHourly && (
          <section style={{ minHeight: 420 }}>
            <HourlyForecast
              unit={unit}
              items={filteredHourly}
              loading={loading}
              darkMode={darkMode}
            />
          </section>
        )}

       
        {/*  DAGLIG VARSEL  */}
      
        <section style={{ minHeight: 460 }}>
          {showDaily && (
            <DailyForecast
              unit={unit}
              items={dailyItems}
              loading={loading}
              darkMode={darkMode}
            />
          )}
        </section>

        {/* Ingen data */}
      
        {!loading && !data && (
          <p className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-300">
            Ingen data ennå – prøv et annet søk.
          </p>
        )}

      
        {/*  TOASTS */}
        
        <aside
          className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-3"
          aria-live="assertive"
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto w-80 rounded-2xl px-4 py-3 shadow-lg ${
                toast.variant === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-midnight'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{toast.title}</p>
                  {toast.description && (
                    <p className="text-xs text-slate-800">{toast.description}</p>
                  )}
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
