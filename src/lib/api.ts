import type { Coordinates, WeatherResponse } from '../types/weather'

const WEATHER_BASE_URL = 'https://api.met.no/weatherapi/locationforecast/2.0/compact'
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'

export const searchCoordinates = async (query: string, signal?: AbortSignal): Promise<Coordinates | null> => {
  if (!query.trim()) return null

  const url = `${GEO_URL}?name=${encodeURIComponent(query)}&count=5&country=NO&language=nb&format=json`
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error('Klarte ikke å slå opp sted')
  }

  const data = await response.json()
  const result = data.results?.[0]

  if (!result) {
    return null
  }

  return {
    lat: result.latitude,
    lon: result.longitude,
    name: result.name,
    country: result.country_code,
    timezone: result.timezone,
  }
}

export const searchCoordinatesList = async (query: string, signal?: AbortSignal): Promise<Coordinates[]> => {
  if (!query.trim()) return []

  const url = `${GEO_URL}?name=${encodeURIComponent(query)}&count=10&country=NO&language=nb&format=json`
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error('Klarte ikke å slå opp sted')
  }

  const data = await response.json()
  const results = data.results ?? []
  return results.map((result: any) => ({
    lat: result.latitude,
    lon: result.longitude,
    name: result.name,
    country: result.country_code,
    timezone: result.timezone,
    admin1: result.admin1,
    admin2: result.admin2,
  }))
}

export const reverseGeocode = async (coords: Pick<Coordinates, 'lat' | 'lon'>, signal?: AbortSignal) => {
  const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${coords.lat}&longitude=${coords.lon}&count=1&language=nb&format=json`
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error('Klarte ikke å slå opp sted')
  }
  const data = await response.json()
  const result = data.results?.[0]
  if (!result) return null
  return {
    lat: result.latitude,
    lon: result.longitude,
    name: result.name,
    country: result.country_code,
    timezone: result.timezone,
    admin1: result.admin1,
    admin2: result.admin2,
  } as Coordinates
}

export const fetchWeather = async (
  coords: Pick<Coordinates, 'lat' | 'lon'>,
  signal?: AbortSignal,
): Promise<WeatherResponse> => {
  const url = `${WEATHER_BASE_URL}?lat=${coords.lat}&lon=${coords.lon}&altitude=0`

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    throw new Error('MET returnerte en feilstatus')
  }

  return response.json()
}
