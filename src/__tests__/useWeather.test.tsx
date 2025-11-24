import { jest } from '@jest/globals'
import { act, renderHook } from '@testing-library/react'
import { useWeather } from '../hooks/useWeather'

const mockGeo = {
  results: [
    {
      latitude: 59.91,
      longitude: 10.75,
      name: 'Oslo',
      country_code: 'NO',
      timezone: 'Europe/Oslo',
    },
  ],
}

const mockWeather = {
  properties: {
    meta: { updated_at: '2024-01-01T00:00:00Z' },
    timeseries: [
      {
        time: '2024-01-01T00:00:00Z',
        data: {
          instant: {
            details: {
              air_temperature: 10,
              wind_speed: 3,
              relative_humidity: 80,
            },
          },
          next_1_hours: {
            summary: { symbol_code: 'cloudy' },
            details: { precipitation_amount: 0.2 },
          },
          next_6_hours: {
            summary: { symbol_code: 'partly_cloudy' },
            details: {
              air_temperature_max: 12,
              air_temperature_min: 8,
              precipitation_amount: 0.5,
            },
          },
        },
      },
    ],
  },
}

const buildFetch = (...responses: Array<{ ok?: boolean; json: () => Promise<unknown> }>) => {
  const mock = jest.fn() as any
  responses.forEach((res) => {
    mock.mockResolvedValueOnce({ ok: true, ...res } as any)
  })
  return mock
}

describe('useWeather', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('henter og mapper data fra MET', async () => {
    const fetchMock = buildFetch(
      { json: async () => mockGeo },
      { json: async () => mockWeather },
    )
    globalThis.fetch = fetchMock as unknown as typeof fetch

    const { result } = renderHook(() => useWeather(''))

    await act(async () => {
      await result.current.refresh('Oslo')
    })

    expect(result.current.data?.location.name).toBe('Oslo')
    expect(result.current.data?.current.temperature).toBe(10)
    expect(result.current.error).toBeNull()
  })

  it('returnerer feil når geokoding ikke gir treff', async () => {
    const fetchMock = buildFetch({ json: async () => ({ results: [] }) })
    globalThis.fetch = fetchMock as unknown as typeof fetch

    const { result } = renderHook(() => useWeather(''))

    await act(async () => {
      await result.current.refresh('Ukjent')
    })

    expect(result.current.error).toContain('Fant ingen treff')
  })
})
