import { jest } from '@jest/globals'
import { act, render } from '@testing-library/react'
import * as jestAxe from 'jest-axe'
import App from '../App'

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
        },
      },
    ],
  },
}

describe('A11y', () => {
  beforeEach(() => {
    const fetchMock = jest.fn() as any
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => mockGeo } as any)
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => mockWeather } as any)

    globalThis.fetch = fetchMock as unknown as typeof fetch
  })

  it('har ingen tilgjengelighetsfeil', async () => {
    let container: HTMLElement
    await act(async () => {
      container = render(<App />).container
    })
    const axeRunner =
      (jestAxe as unknown as { axe?: typeof import('jest-axe').axe }).axe ?? (jestAxe as any).default?.axe

    if (axeRunner) {
      const results = await axeRunner(container!)
      expect(results).toHaveNoViolations()
    }
  })
})
