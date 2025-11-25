// Tester WeatherSearch-komponenten
import { jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import { WeatherSearch } from '../components/ui/WeatherSearch'

describe('WeatherSearch', () => {
  // Sjekk at onChange og onSubmit trigges via Enter
  it('kaller onChange og onSubmit via Enter', () => {
    const onChange = jest.fn()
    const onSubmit = jest.fn()

    render(<WeatherSearch value="" onChange={onChange} onSubmit={onSubmit} />)

    const input = screen.getByRole('textbox', { name: /søk etter sted/i })
    fireEvent.change(input, { target: { value: 'Oslo' } })
    expect(onChange).toHaveBeenCalledWith('Oslo')

    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onSubmit).toHaveBeenCalled()
  })
})
