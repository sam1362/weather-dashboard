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
      <section aria-label="Time for time" className="glass rounded-3xl p-6 md:p-8">
        <div className="mb-4 h-6 w-36 rounded-full bg-white/10 animate-pulse" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-24 rounded-2xl bg-white/10 animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section aria-label="Time for time" className="glass rounded-3xl p-6 md:p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className={`text-xs uppercase tracking-wide ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Neste timer
          </p>
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Time for time</h2>
        </div>
      </header>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <article
            key={item.time}
            className={`flex flex-col gap-3 rounded-2xl px-4 py-3 ${
              darkMode
                ? 'bg-white/5 text-slate-100'
                : 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-teal-500" aria-hidden />
                <time className="text-sm font-semibold" dateTime={item.time}>
                  {formatHourLabel(item.time)}
                </time>
              </div>
              <Cloudy className={`h-4 w-4 ${darkMode ? 'text-slate-300' : 'text-slate-500'}`} aria-hidden />
            </div>
            <div className="flex items-center justify-between text-sm">
              <p
                className={`text-lg font-bold ${tempToneClass(roundTemp(item.temp, 'celsius'), darkMode)}`}
              >
                {tempLabel(item.temp, unit)}
              </p>
              <div className={`flex items-center gap-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <Droplets className="h-4 w-4 text-teal-500" aria-hidden />
                <span>{item.precipitation ? `${item.precipitation.toFixed(1)} mm` : '—'}</span>
              </div>
            </div>
            <p className={`text-xs capitalize ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {item.symbol.replace(/[-_]/g, ' ')}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
