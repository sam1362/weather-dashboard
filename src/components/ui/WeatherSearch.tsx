import { Search, Compass, MapPin } from 'lucide-react'
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
  disableTooltip?: boolean
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
  disableTooltip = false,
}: WeatherSearchProps) => {
  
  // Enter-tast
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
      role="search"
      aria-label="Søk etter sted"

      /* fast høyde i stedet for min-height */
      className={cn(
        "relative z-30 flex w-full flex-row flex-nowrap items-center gap-2 rounded-2xl p-4 shadow-lg h-[72px]", 
        "transition-colors",
        darkMode
          ? "bg-white/5 border border-white/10"
          : "bg-white border border-slate-200 shadow-sm"
      )}

      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >


      {/* Input wrapper */}
      <div className="relative flex-1">

        {/* Input felt */}
        <input
          id="location-search"
          name="location"
          value={value}
          aria-label="Søk etter sted"
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Skriv et sted ..."
          autoComplete="off"

          className={cn(
            "w-full rounded-xl border px-10 h-[44px] text-base shadow-inner placeholder:text-slate-400",
            "focus-visible:border-teal-500 focus-visible:outline-none",
            darkMode
              ? "border-white/5 bg-white/5 text-slate-100"
              : "border-slate-200 bg-white text-slate-900"
          )}
        />

        {/* block + fixed position */}
        <Search
          aria-hidden
          className="block pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        />

        {/* Forslagsliste med stabil høyde */}
        {suggestions.length > 0 && (
          <ul
            role="listbox"
            className={cn(
              "absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-2xl border text-sm shadow-2xl",
              "overflow-auto max-h-72", 
              darkMode
                ? "border-white/10 bg-midnight-soft text-slate-100"
                : "border-slate-200 bg-white text-slate-900"
            )}
            style={{ minHeight: 44 }} 
          >
            {suggestions.map((item) => (
              <li key={`${item.label}-${item.subLabel ?? ''}`}>
                <button
                  type="button"
                  onClick={() => onSelectSuggestion?.(item.label)}
                  role="option"
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-3 text-left transition",
                    darkMode
                      ? "hover:bg-white/10 focus-visible:bg-white/10"
                      : "hover:bg-slate-100 focus-visible:bg-slate-100",
                  )}
                >
                  <MapPin className="block h-5 w-5 shrink-0 text-teal-500 mt-1" aria-hidden />
                  <div className="flex flex-col">
                    <span className="text-base font-semibold">{item.label}</span>
                    {item.subLabel && (
                      <span className={cn("text-xs", darkMode ? "text-slate-400" : "text-slate-600")}>
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

      {/* Posisjonsknapp */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onUseCurrentLocation?.()
        }}

        /* fast høyde og bredde */
        className={cn(
          "flex items-center justify-center h-[44px] w-[44px] rounded-xl transition",
          darkMode
            ? "bg-white/5 text-slate-200 hover:bg-white/10"
            : "bg-slate-100 text-slate-800 hover:bg-slate-200",
        )}
        aria-label="Bruk min posisjon"
        data-tooltip={disableTooltip ? undefined : "Bruk min posisjon"}
      >
          <MapPin className="block h-5 w-5" aria-hidden />
      </button>

      {/* Søk-knapp */}
      <button
        type="submit"
        aria-busy={loading}
        className={cn(
          "flex items-center justify-center gap-2 h-[44px] w-[80px] sm:w-auto sm:min-w-[96px] rounded-xl px-4 text-sm font-semibold transition",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 whitespace-nowrap",
          loading
            ? darkMode
              ? "bg-white/10 text-slate-400"
              : "bg-slate-200 text-slate-500"
            : darkMode
              ? "bg-sky-700 text-white hover:bg-sky-600 shadow-glow"
              : "bg-sky-700 text-white hover:bg-sky-600 shadow-glow",
        )}
      >
        {/* block icon */}
        <Compass className="h-4 w-4 block text-white" aria-hidden />
        Søk
      </button>

    </form>
  )
}
