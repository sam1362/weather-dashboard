import { Droplets, Eye, Gauge, SunDim, Thermometer, Wind } from 'lucide-react'
import { tempLabel } from '../../lib/utils'
import type { TemperatureUnit } from '../../types/weather'

interface WeatherDetailsProps {
  feelsLike: number
  unit: TemperatureUnit
  humidity?: number
  windSpeed?: number
  pressure?: number
  visibilityKm?: number
  uvIndex?: number
  loading?: boolean
  darkMode?: boolean
}

const detailCard = (
  label: string,
  value: string,
  icon: React.ReactNode,
  darkMode: boolean,
) => (
  <article
    className={`flex items-center gap-4 rounded-2xl border px-4 py-3 shadow-md ${
      darkMode ? 'border-white/5 bg-white/5' : 'border-slate-200 bg-white'
    }`}
  >
    <div
      className={`rounded-full p-3 ${
        darkMode ? 'bg-white/10 text-teal-400' : 'bg-slate-100 text-teal-500'
      }`}
      aria-hidden
    >
      {icon}
    </div>
    <div>
      <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{label}</p>
      <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{value}</p>
    </div>
  </article>
)

export const WeatherDetails = ({
  feelsLike,
  unit,
  humidity,
  windSpeed,
  pressure,
  visibilityKm,
  uvIndex,
  loading,
  darkMode = true,
}: WeatherDetailsProps) => {
  if (loading) {
    return (
      <section className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="h-20 rounded-2xl bg-white/10 animate-pulse" />
        ))}
      </section>
    )
  }

  const cards = [
    detailCard('Føles som', tempLabel(feelsLike, unit), <Thermometer className="h-5 w-5" />, darkMode),
    detailCard('Luftfuktighet', humidity ? `${humidity}%` : '—', <Droplets className="h-5 w-5" />, darkMode),
    detailCard('Vind', windSpeed ? `${windSpeed.toFixed(1)} m/s` : '—', <Wind className="h-5 w-5" />, darkMode),
    detailCard('Lufttrykk', pressure ? `${Math.round(pressure)} hPa` : '—', <Gauge className="h-5 w-5" />, darkMode),
    detailCard('UV-indeks', uvIndex ? `${uvIndex}` : '—', <SunDim className="h-5 w-5" />, darkMode),
    detailCard('Sikt', visibilityKm ? `${visibilityKm} km` : '—', <Eye className="h-5 w-5" />, darkMode),
  ]

  return (
    <section className="grid gap-3 md:grid-cols-2" aria-label="Værdetaljer">
      {cards}
    </section>
  )
}
