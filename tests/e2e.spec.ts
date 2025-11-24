import { expect, test } from '@playwright/test'

const weatherMock = {
  properties: {
    meta: { updated_at: '2024-01-01T00:00:00Z' },
    timeseries: [
      {
        time: '2024-01-01T00:00:00Z',
        data: {
          instant: { details: { air_temperature: 8, wind_speed: 2, relative_humidity: 70 } },
          next_1_hours: { summary: { symbol_code: 'cloudy' }, details: { precipitation_amount: 0.1 } },
          next_6_hours: {
            summary: { symbol_code: 'cloudy' },
            details: { air_temperature_max: 10, air_temperature_min: 5, precipitation_amount: 0.3 },
          },
        },
      },
    ],
  },
}

test.beforeEach(async ({ page }) => {
  await page.route('**/geocoding-api.open-meteo.com/**', (route) => {
    const url = new URL(route.request().url())
    const name = url.searchParams.get('name') ?? 'Oslo'
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        results: [
          {
            latitude: 59.91,
            longitude: 10.75,
            name,
            country_code: 'NO',
            timezone: 'Europe/Oslo',
          },
        ],
      }),
    })
  })

  await page.route('**/api.met.no/weatherapi/locationforecast/2.0/compact**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(weatherMock),
    }),
  )
})

test('viser dashboard, skjelett og data', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Værdashboard' })).toBeVisible()
  await expect(page.getByRole('article', { name: 'Nåværende vær' })).toBeVisible()

  await page.getByLabel('Søk etter sted').fill('Bergen')
  await page.getByRole('button', { name: 'Søk nå' }).click()

  await expect(page.getByRole('article', { name: 'Nåværende vær' })).toContainText('Bergen')
})
