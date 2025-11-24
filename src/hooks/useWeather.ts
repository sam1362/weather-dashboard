import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchWeather, searchCoordinates } from '../lib/api'
import { mapWeatherResponse } from '../lib/mapper'
import type { Coordinates, TemperatureUnit, WeatherBundle } from '../types/weather'

interface WeatherHookState {
  data: WeatherBundle | null
  loading: boolean
  error: string | null
  lastQuery: string
  unit: TemperatureUnit
}

export const useWeather = (initialQuery = '') => {
  const [state, setState] = useState<WeatherHookState>({
    data: null,
    loading: false,
    error: null,
    lastQuery: initialQuery,
    unit: 'celsius',
  })

  const abortRef = useRef<AbortController | null>(null)

  const refresh = useCallback(
    async (query: string) => {
      const trimmed = query.trim()
      if (!trimmed.length) {
        abortRef.current?.abort()
        setState((prev) => ({
          ...prev,
          loading: false,
          error: null,
          lastQuery: trimmed,
        }))
        return
      }

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        lastQuery: query,
      }))

      try {
        const coords = await searchCoordinates(trimmed, controller.signal)
        if (!coords) {
          throw new Error('Fant ingen treff for søket')
        }

        const weather = await fetchWeather(coords, controller.signal)
        const mapped = mapWeatherResponse(weather, coords)

        setState((prev) => ({
          ...prev,
          data: mapped,
          loading: false,
          error: null,
        }))
      } catch (error) {
        if (controller.signal.aborted) return
        const message = error instanceof Error ? error.message : 'Ukjent feil'
        setState((prev) => ({
          ...prev,
          loading: false,
          data: null,
          error: message,
        }))
      }
    },
    [],
  )

  const refreshByCoords = useCallback(async (coords: Coordinates) => {
    if (!coords.lat || !coords.lon) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      lastQuery: coords.name ?? '',
    }))

    try {
      const weather = await fetchWeather(coords, controller.signal)
      const mapped = mapWeatherResponse(weather, coords)

      setState((prev) => ({
        ...prev,
        data: mapped,
        loading: false,
        error: null,
      }))
    } catch (error) {
      if (controller.signal.aborted) return
      const message = error instanceof Error ? error.message : 'Ukjent feil'
      setState((prev) => ({
        ...prev,
        loading: false,
        data: null,
        error: message,
      }))
    }
  }, [])

  useEffect(() => {
    if (initialQuery) {
      refresh(initialQuery)
    }
  }, [initialQuery, refresh])

  useEffect(
    () => () => {
      abortRef.current?.abort()
    },
    [],
  )

  const setUnit = useCallback((unit: TemperatureUnit) => {
    setState((prev) => ({ ...prev, unit }))
  }, [])

  return { ...state, refresh, refreshByCoords, setUnit }
}
