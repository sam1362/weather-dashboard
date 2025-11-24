export type TemperatureUnit = 'celsius' | 'fahrenheit'

export interface Coordinates {
  lat: number
  lon: number
  name: string
  country?: string
  timezone?: string
  admin1?: string
  admin2?: string
}

export interface WeatherTimeseries {
  time: string
  data: {
    instant: {
      details: {
        air_temperature: number
        relative_humidity?: number
        wind_speed?: number
        air_pressure_at_sea_level?: number
        cloud_area_fraction?: number
      }
    }
    next_1_hours?: {
      summary?: { symbol_code?: string }
      details?: { precipitation_amount?: number }
    }
    next_6_hours?: {
      summary?: { symbol_code?: string }
      details?: {
        air_temperature_max?: number
        air_temperature_min?: number
        precipitation_amount?: number
      }
    }
  }
}

export interface WeatherResponse {
  properties: {
    meta?: { updated_at?: string }
    timeseries: WeatherTimeseries[]
  }
}

export interface CurrentWeather {
  time: string
  temperature: number
  symbol: string
  windSpeed?: number
  humidity?: number
  pressure?: number
  precipitation?: number
  feelsLike: number
}

export interface DailyForecastItem {
  date: string
  min: number
  max: number
  symbol: string
  precipitation?: number
}

export interface HourlyForecastItem {
  time: string
  temp: number
  symbol: string
  precipitation?: number
  windSpeed?: number
}

export interface WeatherBundle {
  location: Coordinates
  current: CurrentWeather
  daily: DailyForecastItem[]
  hourly: HourlyForecastItem[]
  updatedAt?: string
}
