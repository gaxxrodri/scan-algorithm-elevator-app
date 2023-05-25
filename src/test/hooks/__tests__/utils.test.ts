import { expect } from 'vitest'
import * as sinon from 'sinon'
import { filterQueue } from '../../../hooks/utils'
import { type FloorRequest } from '../../../common/types'

describe('Utils function tests', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('filterQueue function', () => {
    test('should return an with the last element of the requests array', () => {
      const currentFloor = 2
      const isCurrentGoingUp = true
      const requests: FloorRequest[] = [
        { floor: 1, isGoingUp: true },
        { floor: 2, isGoingUp: false },
        { floor: 3, isGoingUp: true },
      ]
      const result = filterQueue(requests, isCurrentGoingUp, currentFloor)
      expect(result).toEqual([{ floor: 3, isGoingUp: true }])
    })
    test('should return an empty array', () => {
      const currentFloor = 4
      const isCurrentGoingUp = true
      const requests: FloorRequest[] = [
        { floor: 1, isGoingUp: true },
        { floor: 2, isGoingUp: false },
        { floor: 3, isGoingUp: true },
      ]
      const result = filterQueue(requests, isCurrentGoingUp, currentFloor)
      expect(result).toEqual([])
    })
    test('should return array with two elements', () => {
      const currentFloor = 0
      const isCurrentGoingUp = true
      const requests: FloorRequest[] = [
        { floor: 1, isGoingUp: true },
        { floor: 2, isGoingUp: false },
        { floor: 3, isGoingUp: true },
      ]
      const result = filterQueue(requests, isCurrentGoingUp, currentFloor)
      expect(result).toEqual([
        { floor: 1, isGoingUp: true },
        { floor: 3, isGoingUp: true },
      ])
    })
    test('should return array with elements the with property isGointUp false', () => {
      const currentFloor = 5
      const isCurrentGoingUp = false
      const requests: FloorRequest[] = [
        { floor: 1, isGoingUp: true },
        { floor: 2, isGoingUp: false },
        { floor: 3, isGoingUp: true },
      ]
      const result = filterQueue(requests, isCurrentGoingUp, currentFloor)
      expect(result).toEqual([{ floor: 2, isGoingUp: false }])
    })
  })

  describe('updateQueueIfReachFloor function', () => {
    test('should return an array with the last element of the requests array', () => {
      // TODO  Using sinon.stub not working, test dont fail but freeze.
      //
      //
      // const promptStub = sinon.stub(window, 'prompt')
      // const alertStub = sinon.stub(window, 'alert')
      // promptStub.returns('5')
      // const isCurrentGoingUp = true
      // const currentFloor = 2
      // const requests: FloorRequest[] = [
      //   { floor: 1, isGoingUp: true },
      //   { floor: 2, isGoingUp: true },
      //   { floor: 3, isGoingUp: true, dropUser: true },
      // ]
      // const result = updateQueueIfReachFloor(requests, isCurrentGoingUp, currentFloor)
      // expect(promptStub.calledOnce).toBe(true)
      // expect(alertStub.calledOnce).toBe(true)
      // expect(result).toEqual([
      //   { floor: 1, isGoingUp: true },
      //   { floor: 5, isGoingUp: true, dropUser: true },
      // ])
    })
  })

  describe('getDestinationFloor function', () => {
    test('getDestinationFloor function', () => {
      // TODO  Using sinon.stub not working, test dont fail but freeze.
      //
      //
      //   const currentFloor = 2
      //   const isCurrentGoingUp = true
      //   const promptStub = sinon.stub(window, 'prompt')
      //   promptStub.returns('5')
      //   const result = getDestinationFloor(currentFloor, isCurrentGoingUp)
      //   expect(promptStub.calledOnce).toBe(true)
      //   expect(result).toEqual(5)
    })
  })
})
