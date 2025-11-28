import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplets,
  Gauge,
  Snowflake,
  Sun,
  Wind,
  Moon,
} from "lucide-react"

import { isValidElement } from "react"
import { formatHourLabel, roundTemp, tempLabel, tempToneClass } from "../../lib/utils"
import type { TemperatureUnit } from "../../types/weather"

// Velger riktig ikon basert på MET-symbolkode
const iconForSymbol = (symbol: string) => {
  const raw = symbol.toLowerCase()
  const normalized = raw.replace(/[_-](day|night|polartwilight)/g, "")
  const isNight = raw.includes("night")

  if (normalized.includes("clearsky"))
    return isNight ? (
      <Moon className="h-10 w-10 shrink-0 block" />
    ) : (
      <Sun className="h-10 w-10 shrink-0 block" />
    )

  if (normalized.includes("fair") || normalized.includes("partlycloudy"))
    return isNight ? (
      <Moon className="h-10 w-10 shrink-0 block" />
    ) : (
      <CloudSun className="h-10 w-10 shrink-0 block" />
    )

  if (normalized.includes("cloudy")) return <Cloud className="h-10 w-10 shrink-0 block" />
  if (normalized.includes("fog")) return <CloudFog className="h-10 w-10 shrink-0 block" />
  if (normalized.includes("sleet") || normalized.includes("snow"))
    return <CloudSnow className="h-10 w-10 shrink-0 block" />
  if (normalized.includes("rain")) return <CloudRain className="h-10 w-10 shrink-0 block" />
  if (normalized.includes("thunder")) return <CloudLightning className="h-10 w-10 shrink-0 block" />
  if (normalized.includes("wind")) return <Wind className="h-10 w-10 shrink-0 block" />

  return <Snowflake className="h-10 w-10 shrink-0 block" />
}

interface CurrentWeatherProps {
  location: string
  unit: TemperatureUnit
  loading?: boolean
  temperature: number
  symbol: string
  feelsLike: number
  humidity?: number
  windSpeed?: number
  pressure?: number
  precipitation?: number
  time: string
  darkMode?: boolean
}

export const CurrentWeather = ({
  location,
  unit,
  loading,
  temperature,
  symbol,
  feelsLike,
  humidity,
  windSpeed,
  precipitation,
  pressure,
  time,
  darkMode = true,
}: CurrentWeatherProps) => {

  const detailItems = [
    {
      title: "Vind",
      value: windSpeed ? `${windSpeed.toFixed(1)} m/s` : "0 m/s",
      icon: <Wind className="h-5 w-5 shrink-0 block" />,
    },
    {
      title: "Luftfuktighet",
      value: humidity ? `${humidity}%` : "0%",
      icon: <Droplets className="h-5 w-5 shrink-0 block" />,
    },
    {
      title: "Nedbør (1t)",
      value: precipitation ? `${precipitation.toFixed(1)} mm` : "0 mm",
      icon: <CloudRain className="h-5 w-5 shrink-0 block" />,
    },
    {
      title: "Lufttrykk",
      value: pressure ? `${Math.round(pressure)} hPa` : "0 hPa",
      icon: <Gauge className="h-5 w-5 shrink-0 block" />,
    },
  ]

  const otherUnit: TemperatureUnit = unit === "celsius" ? "fahrenheit" : "celsius"
  const tempRounded = roundTemp(temperature, "celsius")
  const feelsRounded = roundTemp(feelsLike, "celsius")
  const tempTone = tempToneClass(tempRounded, darkMode)

  // Final heights: tuned smaller to match hero layout
  const SECTION_HEIGHT = "lg:h-[380px]"   // whole widget height
  const GRID_HEIGHT = "lg:h-[300px]"      // grid height (both cards fit perfectly)

  // Skeleton with identical height → zero CLS
  if (loading) {
    return (
      <article className={`relative overflow-hidden rounded-3xl ${SECTION_HEIGHT}`} aria-label="Nåværende vær">
        <div
          className={`
            absolute inset-0 rounded-3xl backdrop-blur-xl
            ${darkMode ? "bg-white/8 border border-white/10" : "bg-white/80 border border-slate-200"}
          `}
        />

        <div className="relative z-10 p-6 md:p-8 flex flex-col gap-6">
          <div className="rounded-2xl bg-white/10 animate-pulse h-[220px] lg:h-[300px]" />
          <div className="grid gap-3 sm:grid-cols-2 h-[220px] lg:h-[300px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-white/10 animate-pulse" />
            ))}
          </div>
        </div>
      </article>
    )
  }

  return (
       <article className="relative overflow-hidden rounded-3xl min-h-[360px] lg:h-[380px]" aria-label="Nåværende vær">
      
      {/* Glass layer */}
      <div
        className={`
          absolute inset-0 rounded-3xl backdrop-blur-xl
          ${darkMode ? "bg-white/8 border border-white/10" : "bg-white/80 border border-slate-200"}
        `}
      />

      <div className="relative z-10 p-6 md:p-8 flex flex-col gap-6">

        {/* GRID — fixed height on desktop */}
        <div className={`grid gap-8 lg:grid-cols-[2fr_1fr] ${GRID_HEIGHT}`}>

          {/* LEFT CARD */}
          <div
            className={`
              rounded-2xl bg-gradient-to-br p-6
              flex flex-col justify-between
              lg:h-full
              ${darkMode ? "from-white/5 to-white/0" : "from-slate-100 to-white"}
            `}
          >
            <div className="flex flex-col gap-4">
              
              {/* Header */}
              <div className="flex flex-col gap-1">
                <p className={`text-xs uppercase tracking-wide ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Nå</p>
                <p className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>{location}</p>
                <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  Oppdatert {formatHourLabel(time)}
                </p>
              </div>

              {/* Symbol text */}
              <p className={`text-sm capitalize ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                {symbol.replace(/[-_]/g, " ")}
              </p>

              {/* Icon + Temps */}
              <div className="flex items-center gap-4 md:gap-6">
                
                <div
                  className={`
                    rounded-2xl p-4 shadow-inner w-fit shrink-0
                    ${darkMode ? "bg-white/10 text-white" : "bg-slate-100 text-slate-800"}
                  `}
                >
                  {iconForSymbol(symbol)}
                </div>

                <div className="flex flex-col gap-1">
                  <p className={`text-6xl font-bold leading-tight ${tempTone}`}>
                    {tempLabel(temperature, unit)}
                  </p>
                  <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Føles som{" "}
                    <span className={tempToneClass(feelsRounded, darkMode)}>
                      {tempLabel(feelsLike, unit)}
                    </span>
                    {" "}• {tempLabel(temperature, otherUnit)}
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className={`grid gap-3 sm:grid-cols-2 lg:h-full`}>
            {detailItems.map((item) => (
              <div
                key={`${item.title}-${item.value}`}
                className={`
                  flex items-center gap-4 rounded-2xl border px-4 py-3
                  ${darkMode ? "border-white/5 bg-white/5" : "border-slate-200 bg-white"}
                `}
              >
                <div
                  className={`
                    flex h-10 w-10 shrink-0 items-center justify-center rounded-full p-2
                    ${darkMode ? "bg-white/10 text-teal-400" : "bg-slate-100 text-teal-500"}
                  `}
                >
                  {isValidElement(item.icon) ? item.icon : null}
                </div>

                <div>
                  <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{item.title}</p>
                  <p className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                    {item.value}
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </article>
  )
}
