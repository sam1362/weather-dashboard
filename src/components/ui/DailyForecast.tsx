import { CloudSun, Droplets, Thermometer } from 'lucide-react'
import { formatDateLabel, tempLabel, tempToneClass } from '../../lib/utils'
import type { DailyForecastItem, TemperatureUnit } from '../../types/weather'

interface DailyForecastProps {
  items: DailyForecastItem[]
  unit: TemperatureUnit
  loading?: boolean
  darkMode?: boolean
}

export const DailyForecast = ({ items, unit, loading, darkMode = true }: DailyForecastProps) => {

  if (loading) {
    return (
      <section aria-label="Daglig varsel" className="relative overflow-hidden rounded-3xl" style={{ minHeight: 460 }}>
        
        <div
          className={`absolute inset-0 rounded-3xl backdrop-blur-xl ${
            darkMode
              ? 'bg-white/8 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.35)]'
              : 'bg-white/80 border border-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.12)]'
          }`}
          style={{ pointerEvents: 'none', willChange: 'transform' }}
        />

        {/* Skeleton-innhold – eksakt samme struktur som final view */}
        <div className="relative z-10 p-6 md:p-8" style={{ minHeight: 460 }}>
          <div className="flex h-full flex-col justify-between gap-8">

            {/* Header skeleton */}
            <div className="h-8 w-48 rounded-full bg-white/10 animate-pulse" />

            {/* Grid skeleton – matcher final grid */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 min-h-[320px]">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-36 rounded-2xl bg-white/10 animate-pulse" />
              ))}
            </div>

          </div>
        </div>
      </section>
    )
  }

  return (
    <section aria-label="Daglig varsel" className="relative overflow-hidden rounded-3xl" style={{ minHeight: 460 }}>
      
      {/* Glasslag – separert for å unngå layout shift */}
      <div
        className={`absolute inset-0 rounded-3xl backdrop-blur-xl ${
          darkMode
            ? 'bg-white/8 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.35)]'
            : 'bg-white/80 border border-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.12)]'
        }`}
        style={{ pointerEvents: 'none', willChange: 'transform' }}
      />

      {/* Faktisk innhold – høyden er stabil */}
      <div className="relative z-10 p-6 md:p-8" style={{ minHeight: 460 }}>
        <div className="flex h-full flex-col justify-between gap-8">

          {/* Header */}
          <header className="flex items-center justify-between min-h-[48px]">
            <div>
              <p className={`text-xs uppercase tracking-wide ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                7 dagers oversikt
              </p>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Daglig prognose
              </h2>
            </div>
          </header>

          {/* Grid med daglige kort – matcher skeleton-høyde */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 min-h-[320px]">
            {items.map((item) => (
              <article
                key={item.date}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 ${
                  darkMode
                    ? 'bg-white/5 text-slate-100'
                    : 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                }`}
              >

                {/* Venstre panel: ikon + dato + tekst */}
                <div className="flex items-center gap-3">
                  <div className={`rounded-xl p-3 ${darkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    <CloudSun className="h-5 w-5 block" aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{formatDateLabel(item.date)}</p>
                    <p className={`text-xs capitalize ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {item.symbol.replace(/[-_]/g, ' ')}
                    </p>
                  </div>
                </div>

                {/* Høyre panel: temperatur og nedbør */}
                <div className="flex items-center gap-4 text-sm">
                  
                  {/* Temperatur */}
                  <div className={`flex items-center gap-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <Thermometer className="h-4 w-4 text-teal-500 block" aria-hidden />
                    <span className={`font-semibold ${tempToneClass(item.max, darkMode)}`}>
                      {tempLabel(item.max, unit)}
                    </span>
                    <span className="text-slate-400">/{tempLabel(item.min, unit)}</span>
                  </div>

                  {/* Nedbør */}
                  <div className={`flex items-center gap-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <Droplets className="h-4 w-4 text-teal-500 block" aria-hidden />
                    <span>{item.precipitation ? `${item.precipitation.toFixed(1)} mm` : '0 mm'}</span>
                  </div>

                </div>

              </article>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
