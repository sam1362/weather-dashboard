import '@testing-library/jest-dom'
import * as jestAxe from 'jest-axe'

const toHaveNoViolations =
  (jestAxe as unknown as { toHaveNoViolations?: jest.CustomMatcher }).toHaveNoViolations ??
  (jestAxe as any).default?.toHaveNoViolations?.toHaveNoViolations

if (typeof toHaveNoViolations === 'function') {
  expect.extend({ toHaveNoViolations })
}
