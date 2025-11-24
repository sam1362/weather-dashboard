import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplets,
  Eye,
  Gauge,
  Snowflake,
  Sun,
  SunDim,
  Thermometer,
  Wind,
  Moon,
} from 'lucide-react'
import { formatHourLabel, tempLabel, tempToneClass } from '../../lib/utils'
import type { TemperatureUnit } from '../../types/weather'

interface CurrentWeatherProps {
  location: string
  unit: TemperatureUnit
  loading?: boolean
  onUnitChange: (unit: TemperatureUnit) => void
  temperature: number
  symbol: string
  feelsLike: number
  humidity?: number
  windSpeed?: number
  pressure?: number
  precipitation?: number
  visibilityKm?: number
  uvIndex?: number
  time: string
  darkMode?: boolean
}

const iconForSymbol = (symbol: string) => {
  const raw = symbol.toLowerCase()
  const normalized = raw.replace(/[_-](day|night|polartwilight)/g, '')
  const isNight = raw.includes('night')

  if (normalized.includes('clearsky')) return isNight ? <Moon className="h-10 w-10" aria-hidden /> : <Sun className="h-10 w-10" aria-hidden />
  if (normalized.includes('fair') || normalized.includes('partlycloudy'))
    return isNight ? <Moon className="h-10 w-10" aria-hidden /> : <CloudSun className="h-10 w-10" aria-hidden />
  if (normalized.includes('cloudy')) return <Cloud className="h-10 w-10" aria-hidden />
  if (normalized.includes('fog')) return <CloudFog className="h-10 w-10" aria-hidden />
  if (normalized.includes('sleet') || normalized.includes('snow')) return <CloudSnow className="h-10 w-10" aria-hidden />
  if (normalized.includes('rain')) return <CloudRain className="h-10 w-10" aria-hidden />
  if (normalized.includes('thunder')) return <CloudLightning className="h-10 w-10" aria-hidden />
  if (normalized.includes('wind')) return <Wind className="h-10 w-10" aria-hidden />
  return <Snowflake className="h-10 w-10" aria-hidden />
}

export const CurrentWeather = ({
  location,
  unit,
  loading,
  onUnitChange,
  temperature,
  symbol,
  feelsLike,
  humidity,
  windSpeed,
  precipitation,
  pressure,
  visibilityKm,
  uvIndex,
  time,
  darkMode = true,
}: CurrentWeatherProps) => {
  if (loading) {
    return (
      <article className="glass rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 rounded-full bg-white/10 animate-pulse" />
          <div className="h-10 w-24 rounded-full bg-white/10 animate-pulse" />
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="h-24 rounded-2xl bg-white/10 animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 w-20 rounded-full bg-white/10 animate-pulse" />
            <div className="h-4 w-32 rounded-full bg-white/10 animate-pulse" />
            <div className="h-4 w-24 rounded-full bg-white/10 animate-pulse" />
          </div>
        </div>
      </article>
    )
  }

  const otherUnit: TemperatureUnit = unit === 'celsius' ? 'fahrenheit' : 'celsius'
  const tempTone = tempToneClass(temperature, darkMode)

  return (
    <article
      className="glass rounded-3xl p-6 shadow-lg shadow-black/40 md:p-8"
      aria-label="Nåværende vær"
      aria-live="polite"
    >
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div
            className={`flex flex-col justify-between rounded-2xl bg-gradient-to-br p-5 ${
              darkMode ? 'from-white/5 to-white/0' : 'from-slate-100 to-white'
            }`}
          >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs uppercase tracking-wide ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Nå</p>
              <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{location}</h2>
              <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Oppdatert {formatHourLabel(time)}
              </p>
            </div>
            <div className={darkMode ? 'rounded-full bg-white/5 p-1' : 'rounded-full bg-slate-100 p-1'}>
              <button
                type="button"
                className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                  unit === 'celsius'
                    ? 'bg-white text-midnight'
                    : darkMode
                      ? 'text-slate-200 hover:text-white'
                      : 'text-slate-700 hover:text-slate-900'
                }`}
                onClick={() => onUnitChange('celsius')}
                aria-pressed={unit === 'celsius'}
              >
                °C
              </button>
              <button
                type="button"
                className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                  unit === 'fahrenheit'
                    ? 'bg-white text-midnight'
                    : darkMode
                      ? 'text-slate-200 hover:text-white'
                      : 'text-slate-700 hover:text-slate-900'
                }`}
                onClick={() => onUnitChange('fahrenheit')}
                aria-pressed={unit === 'fahrenheit'}
              >
                °F
              </button>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className={`rounded-2xl p-4 shadow-inner ${darkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-800'}`}>
              {iconForSymbol(symbol)}
            </div>
            <div>
              <p className={`text-sm capitalize ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {symbol.replace(/[-_]/g, ' ')}
              </p>
              <p className={`text-6xl font-bold leading-tight ${tempTone}`}>{tempLabel(temperature, unit)}</p>
              <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Føles som <span className={tempToneClass(feelsLike, darkMode)}>{tempLabel(feelsLike, unit)}</span> •{' '}
                {tempLabel(temperature, otherUnit)}
              </p>
            </div>
          </div>
        </div>

        <DetailGrid
          darkMode={darkMode}
          items={[
            { title: 'Føles som', value: tempLabel(feelsLike, unit), icon: <Thermometer className="h-5 w-5" />, tempC: feelsLike },
            { title: 'Symbol', value: symbol.replace(/[-_]/g, ' '), icon: iconForSymbol(symbol) },
            { title: 'Vind', value: windSpeed ? `${windSpeed.toFixed(1)} m/s` : '—', icon: <Wind className="h-5 w-5" /> },
            { title: 'Luftfuktighet', value: humidity ? `${humidity}%` : '—', icon: <Droplets className="h-5 w-5" /> },
            { title: 'Nedbør (1t)', value: precipitation ? `${precipitation.toFixed(1)} mm` : '—', icon: <CloudRain className="h-5 w-5" /> },
            { title: 'Lufttrykk', value: pressure ? `${Math.round(pressure)} hPa` : '—', icon: <Gauge className="h-5 w-5" /> },
            { title: 'Sikt', value: visibilityKm ? `${visibilityKm} km` : '—', icon: <Eye className="h-5 w-5" /> },
            { title: 'UV-indeks', value: uvIndex ? `${uvIndex}` : '—', icon: <SunDim className="h-5 w-5" /> },
          ]}
        />
      </div>
    </article>
  )
}

const DetailGrid = ({
  items,
  darkMode,
}: {
  items: Array<{ title: string; value: string; icon: React.ReactNode; tempC?: number }>
  darkMode: boolean
}) => (
  <div className="grid gap-3 md:grid-cols-2">
    {items.map((item) => (
      <div
        key={`${item.title}-${item.value}`}
        className={`flex items-center gap-4 rounded-2xl border px-4 py-3 ${
          darkMode ? 'border-white/5 bg-white/5' : 'border-slate-200 bg-white'
        }`}
      >
        <div
          className={`rounded-full p-3 ${darkMode ? 'bg-white/10 text-teal-400' : 'bg-slate-100 text-teal-500'}`}
          aria-hidden
        >
          {item.icon}
        </div>
        <div>
          <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{item.title}</p>
          <p
            className={`text-xl font-bold ${
              item.tempC !== undefined ? tempToneClass(item.tempC, darkMode) : darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {item.value}
          </p>
        </div>
      </div>
    ))}
  </div>
)
