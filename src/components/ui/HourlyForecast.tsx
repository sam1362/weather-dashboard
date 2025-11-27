import { Clock3, Cloudy, Droplets } from 'lucide-react'
import { formatHourLabel, roundTemp, tempLabel, tempToneClass } from '../../lib/utils'
import type { HourlyForecastItem, TemperatureUnit } from '../../types/weather'

interface HourlyForecastProps {
  items: HourlyForecastItem[]
  unit: TemperatureUnit
  loading?: boolean
  darkMode?: boolean
}

export const HourlyForecast = ({ items, unit, loading, darkMode = true }: HourlyForecastProps) => {
  
  if (loading) {
    return (
      <section aria-label="Time for time" className="relative overflow-hidden rounded-3xl" style={{ minHeight: 420 }}>
        
        {/* Glasslag — isolert absolutt (hindrer layout-shift) */}
        <div
          className={`absolute inset-0 rounded-3xl backdrop-blur-xl ${
            darkMode
              ? 'bg-white/8 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.35)]'
              : 'bg-white/80 border border-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.12)]'
          }`}
          style={{ pointerEvents: 'none', willChange: 'transform' }}
        />

        {/* Stabil skeleton — eksakt samme høyde som endelig visning */}
        <div className="relative z-10 p-6 md:p-8" style={{ minHeight: 420 }}>
          <div className="flex h-full flex-col justify-between gap-8">

            {/* Overskrift skeleton */}
            <div className="h-8 w-44 rounded-full bg-white/10 animate-pulse" />

            {/* Grid skeleton — høyde matcher ekte grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 min-h-[380px]">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-36 rounded-2xl bg-white/10 animate-pulse" />
              ))}
            </div>

          </div>
        </div>
      </section>
    )
  }

  return (
    <section aria-label="Time for time" className="relative overflow-hidden rounded-3xl" style={{ minHeight: 420 }}>
      
      {/* Glasslag – isolert absolutt for å unngå reflow */}
      <div
        className={`absolute inset-0 rounded-3xl backdrop-blur-xl ${
          darkMode
            ? 'bg-white/8 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.35)]'
            : 'bg-white/80 border border-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.12)]'
        }`}
        style={{ pointerEvents: 'none', willChange: 'transform' }}
      />

      {/* Stabilt innhold */}
      <div className="relative z-10 p-6 md:p-8" style={{ minHeight: 420 }}>
        <div className="flex h-full flex-col justify-between gap-8">

          {/* Header */}
          <header className="flex items-center justify-between min-h-[48px]">
            <div>
              <p className={`text-xs uppercase tracking-wide ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Neste timer
              </p>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Time for time
              </h2>
            </div>
          </header>

          {/* Ingen resultater */}
          {items.length === 0 ? (
            <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Ingen timer som matcher filteret.
            </p>
          ) : (
            
            /* Grid – min-h matcher skeleton  */
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 min-h-[380px]">
              {items.map((item) => (
                <article
                  key={item.time}
                  className={`flex flex-col gap-3 rounded-2xl px-4 py-3 ${
                    darkMode
                      ? 'bg-white/5 text-slate-100'
                      : 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  }`}
                >
                  {/* Tid + ikon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-teal-500 block" aria-hidden />
                      <time className="text-sm font-semibold" dateTime={item.time}>
                        {formatHourLabel(item.time)}
                      </time>
                    </div>
                    <Cloudy className="h-4 w-4 block text-slate-400" aria-hidden />
                  </div>

                  {/* Temperatur + nedbør */}
                  <div className="flex items-center justify-between">
                    <p className={`text-lg font-bold ${tempToneClass(roundTemp(item.temp, 'celsius'), darkMode)}`}>
                      {tempLabel(item.temp, unit)}
                    </p>
                    <div className={`flex items-center gap-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      <Droplets className="h-4 w-4 text-teal-500 block" aria-hidden />
                      <span>{item.precipitation ? `${item.precipitation.toFixed(1)} mm` : '0 mm'}</span>
                    </div>
                  </div>

                  {/* Symbol */}
                  <p className={`text-xs capitalize ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {item.symbol.replace(/[-_]/g, ' ')}
                  </p>

                </article>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
