import type { TemperatureUnit } from '../types/weather'

export const toFahrenheit = (valueC: number) => (valueC * 9) / 5 + 32

export const formatDateLabel = (iso: string) =>
  new Intl.DateTimeFormat('nb-NO', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(iso))

export const formatHourLabel = (iso: string) =>
  new Intl.DateTimeFormat('nb-NO', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))

export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

export const normalizeSymbol = (symbol?: string) =>
  symbol ? symbol.replace(/_/g, ' ').replace(/-/g, ' ') : 'ukjent vær'

export const roundTemp = (temp: number, unit: TemperatureUnit) =>
  Math.round(unit === 'fahrenheit' ? toFahrenheit(temp) : temp)

export const tempLabel = (temp: number, unit: TemperatureUnit) =>
  `${roundTemp(temp, unit)}°${unit === 'fahrenheit' ? 'F' : 'C'}`

export const tempToneClass = (tempC: number, darkMode: boolean) =>
  tempC <= 0 ? (darkMode ? 'text-sky-300' : 'text-sky-600') : darkMode ? 'text-rose-300' : 'text-rose-600'
