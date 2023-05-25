import { test } from 'vitest'
import { getButtonStyle } from '../../../../components/Button/Button.utils'
import { type FloorRequest } from '../../../../common/types'

describe('Button utils function tests', () => {
  describe('getButtonStyle function', () => {
    const requestQueue: FloorRequest[] = [
      { floor: 1, isGoingUp: true, dropUser: false },
      { floor: 2, isGoingUp: false, dropUser: false },
      { floor: 3, isGoingUp: true, dropUser: true },
    ]

    test('should return green', () => {
      const floor = 1
      const isUpButton = true

      const result = getButtonStyle(requestQueue, floor, isUpButton)
      expect(result).toBe('1px solid green')
    })
    test('should return red', () => {
      const floor = 2
      const isUpButton = false

      const result = getButtonStyle(requestQueue, floor, isUpButton)
      expect(result).toBe('1px solid red')
    })
    test('should return empty string', () => {
      const floor = 4
      const isUpButton = true

      const result = getButtonStyle(requestQueue, floor, isUpButton)
      expect(result).toBe('')
    })
    test('should return empty string', () => {
      const floor = 3
      const isUpButton = true

      const result = getButtonStyle(requestQueue, floor, isUpButton)
      expect(result).toBe('')
    })
  })
})
