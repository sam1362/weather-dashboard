import type {
  CurrentWeather,
  DailyForecastItem,
  HourlyForecastItem,
  WeatherBundle,
  WeatherResponse,
  WeatherTimeseries,
} from '../types/weather'

const pickSymbol = (entry: WeatherTimeseries) =>
  entry.data.next_1_hours?.summary?.symbol_code ??
  entry.data.next_6_hours?.summary?.symbol_code ??
  'cloudy'

const mapCurrentWeather = (entry: WeatherTimeseries): CurrentWeather => {
  const temperature = entry.data.instant.details.air_temperature
  const windSpeed = entry.data.instant.details.wind_speed
  const humidity = entry.data.instant.details.relative_humidity
  const pressure = entry.data.instant.details.air_pressure_at_sea_level
  const precipitation = entry.data.next_1_hours?.details?.precipitation_amount

  return {
    time: entry.time,
    temperature,
    feelsLike: temperature,
    windSpeed,
    humidity,
    pressure,
    precipitation,
    symbol: pickSymbol(entry),
  }
}

const mapDailyForecast = (series: WeatherTimeseries[]): DailyForecastItem[] => {
  const grouped = new Map<string, DailyForecastItem>()

  series.forEach((entry) => {
    const key = entry.time.split('T')[0]
    const next = entry.data.next_6_hours?.details
    const temp = entry.data.instant.details.air_temperature

    const current = grouped.get(key) ?? {
      date: key,
      min: temp,
      max: temp,
      symbol: pickSymbol(entry),
      precipitation: 0,
    }

    const minCandidate = next?.air_temperature_min ?? temp
    const maxCandidate = next?.air_temperature_max ?? temp
    const precipitationCandidate = next?.precipitation_amount ?? 0

    grouped.set(key, {
      ...current,
      min: Math.min(current.min, minCandidate),
      max: Math.max(current.max, maxCandidate),
      symbol: current.symbol || pickSymbol(entry),
      precipitation: (current.precipitation ?? 0) + precipitationCandidate,
    })
  })

  return Array.from(grouped.values()).slice(0, 7)
}

const mapHourlyForecast = (series: WeatherTimeseries[]): HourlyForecastItem[] =>
  series.slice(0, 12).map((entry) => ({
    time: entry.time,
    temp: entry.data.instant.details.air_temperature,
    symbol: pickSymbol(entry),
    precipitation: entry.data.next_1_hours?.details?.precipitation_amount,
    windSpeed: entry.data.instant.details.wind_speed,
  }))

export const mapWeatherResponse = (payload: WeatherResponse, location: WeatherBundle['location']): WeatherBundle => {
  const series = payload.properties.timeseries ?? []
  if (!series.length) {
    throw new Error('Ingen data returnert fra MET')
  }

  return {
    location,
    current: mapCurrentWeather(series[0]),
    daily: mapDailyForecast(series),
    hourly: mapHourlyForecast(series),
    updatedAt: payload.properties.meta?.updated_at,
  }
}
