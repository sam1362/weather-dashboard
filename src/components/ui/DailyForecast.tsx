// Viser 7-dagers varsel
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
      <section aria-label="Daglig varsel" className="glass rounded-3xl p-6 md:p-8">
        <div className="mb-4 h-6 w-44 rounded-full bg-white/10 animate-pulse" />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-24 rounded-2xl bg-white/10 animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section aria-label="Daglig varsel" className="glass rounded-3xl p-6 md:p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className={`text-xs uppercase tracking-wide ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            7 dagers oversikt
          </p>
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Daglig prognose</h2>
        </div>
      </header>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.date}
            className={`flex items-center justify-between rounded-2xl px-4 py-3 ${
              darkMode
                ? 'bg-white/5 text-slate-100'
                : 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-xl p-3 ${darkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}>
                <CloudSun className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-semibold">{formatDateLabel(item.date)}</p>
                <p className={`text-xs capitalize ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {item.symbol.replace(/[-_]/g, ' ')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className={`flex items-center gap-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <Thermometer className="h-4 w-4 text-teal-500" aria-hidden />
                <span className={`font-semibold ${tempToneClass(item.max, darkMode)}`}>{tempLabel(item.max, unit)}</span>
                <span className="text-slate-400">/{tempLabel(item.min, unit)}</span>
              </div>
              <div className={`flex items-center gap-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <Droplets className="h-4 w-4 text-teal-500" aria-hidden />
                <span>{item.precipitation ? `${item.precipitation.toFixed(1)} mm` : '0 mm'}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
