// Tester CurrentWeather-komponenten
import { render, screen } from '@testing-library/react'
import { CurrentWeather } from '../components/ui/CurrentWeather'

describe('CurrentWeather', () => {
  // Sjekk at både °C og °F vises
  it('viser både Celsius og Fahrenheit', () => {
    render(
      <CurrentWeather
        location="Oslo"
        unit="celsius"
        temperature={12}
        symbol="sunny"
        feelsLike={11}
        time="2024-01-01T00:00:00Z"
      />,
    )

    expect(screen.getByText(/12°C/)).toBeInTheDocument()
    expect(screen.getByText(/54°F/)).toBeInTheDocument()
  })
})
