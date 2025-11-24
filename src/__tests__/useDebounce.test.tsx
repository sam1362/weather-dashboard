import { jest } from '@jest/globals'
import { act, renderHook } from '@testing-library/react'
import { useDebounce } from '../hooks/useDebounce'

jest.useFakeTimers()

describe('useDebounce', () => {
  it('debouncer oppdaterer etter 600ms', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 600), {
      initialProps: { value: 'Oslo' },
    })

    expect(result.current).toBe('Oslo')

    rerender({ value: 'Bergen' })
    expect(result.current).toBe('Oslo')

    act(() => {
      jest.advanceTimersByTime(600)
    })

    expect(result.current).toBe('Bergen')
  })
})
