import { Search, Compass, MapPin, LocateFixed } from 'lucide-react'
import { useCallback, type KeyboardEvent } from 'react'
import { cn } from '../../lib/utils'

interface WeatherSearchProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  loading?: boolean
  darkMode?: boolean
  suggestions?: Array<{ label: string; subLabel?: string }>
  onSelectSuggestion?: (value: string) => void
  onUseCurrentLocation?: () => void
}

export const WeatherSearch = ({
  value,
  onChange,
  onSubmit,
  loading,
  darkMode = true,
  suggestions = [],
  onSelectSuggestion,
  onUseCurrentLocation,
}: WeatherSearchProps) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        onSubmit()
      }
    },
    [onSubmit],
  )

  return (
    <form
      className="relative z-30 glass flex flex-col gap-3 rounded-2xl p-4 shadow-lg md:flex-row md:items-center md:gap-4"
      role="search"
      aria-label="Søk etter sted"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <label className="sr-only" htmlFor="location-search">
        Søk etter sted
      </label>
      <div className="relative flex-1">
        <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          id="location-search"
          name="location"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Skriv et sted, f.eks. Oslo eller Bergen"
          className={cn(
            'w-full rounded-xl border px-10 py-3 text-base shadow-inner placeholder:text-slate-400 focus-visible:border-teal-500 focus-visible:outline-none',
            darkMode
              ? 'border-white/5 bg-white/5 text-slate-100'
              : 'border-slate-200 bg-white text-slate-900',
          )}
          aria-describedby="search-hint"
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <ul
            role="listbox"
            className={cn(
              'absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-80 overflow-auto rounded-2xl border text-sm shadow-2xl',
              darkMode
                ? 'border-white/10 bg-midnight-soft text-slate-100'
                : 'border-slate-200 bg-white text-slate-900',
            )}
          >
            {suggestions.map((item) => (
              <li key={`${item.label}-${item.subLabel ?? ''}`}>
                <button
                  type="button"
                  className={cn(
                    'flex w-full items-start gap-3 px-4 py-3 text-left transition',
                    darkMode
                      ? 'hover:bg-white/10 focus-visible:bg-white/10'
                      : 'hover:bg-slate-100 focus-visible:bg-slate-100',
                  )}
                  onClick={() => onSelectSuggestion?.(item.label)}
                  role="option"
                >
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-teal-500" aria-hidden />
                  <div className="flex flex-col">
                    <span className="text-base font-semibold">{item.label}</span>
                    {item.subLabel && (
                      <span className={cn('text-xs', darkMode ? 'text-slate-400' : 'text-slate-600')}>
                        {item.subLabel}
                      </span>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onUseCurrentLocation}
          className={cn(
            'relative rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
            darkMode
              ? 'bg-white/5 text-slate-200 hover:bg-white/10'
              : 'bg-slate-100 text-slate-800 hover:bg-slate-200',
          )}
          aria-label="Bruk min posisjon"
          data-tooltip="Bruk min posisjon"
        >
          <LocateFixed className="h-5 w-5" aria-hidden />
        </button>
        <button
          type="submit"
          className={cn(
            'flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
            loading
              ? darkMode
                ? 'bg-white/10 text-slate-400'
                : 'bg-slate-200 text-slate-500'
              : darkMode
                ? 'bg-teal-600 text-white hover:bg-teal-500 shadow-glow'
                : 'bg-teal-600 text-white hover:bg-teal-500 shadow-glow',
          )}
          aria-busy={loading}
        >
          <Compass className="h-4 w-4" aria-hidden />
          {loading ? 'Laster...' : 'Søk nå'}
        </button>
      </div>
    </form>
  )
}
