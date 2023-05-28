import { expect } from 'vitest'
import * as sinon from 'sinon'
import { filterQueue, getNextMove, processReachedFloor } from '../../../hooks/utils'
import { type FloorRequest } from '../../../common/types'
import { toast } from 'sonner'

describe('Utils function tests', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('filterQueue function', () => {
    test('should return an with the last element of the requests array', () => {
      const currentFloor = 2
      const isCurrentGoingUp = true
      const requests: FloorRequest[] = [
        { floor: 1, isGoingUp: true, dropUser: false },
        { floor: 2, isGoingUp: false, dropUser: false },
        { floor: 3, isGoingUp: true, dropUser: false },
      ]
      const result = filterQueue(requests, isCurrentGoingUp, currentFloor)
      expect(result).toEqual([{ floor: 3, isGoingUp: true, dropUser: false }])
    })
    test('should return an empty array', () => {
      const currentFloor = 4
      const isCurrentGoingUp = true
      const requests: FloorRequest[] = [
        { floor: 1, isGoingUp: true, dropUser: false },
        { floor: 2, isGoingUp: false, dropUser: false },
        { floor: 3, isGoingUp: true, dropUser: false },
      ]
      const result = filterQueue(requests, isCurrentGoingUp, currentFloor)
      expect(result).toEqual([])
    })
    test('should return array with two elements', () => {
      const currentFloor = 0
      const isCurrentGoingUp = true
      const requests: FloorRequest[] = [
        { floor: 1, isGoingUp: true, dropUser: false },
        { floor: 2, isGoingUp: false, dropUser: false },
        { floor: 3, isGoingUp: true, dropUser: false },
      ]
      const result = filterQueue(requests, isCurrentGoingUp, currentFloor)
      expect(result).toEqual([
        { floor: 1, isGoingUp: true, dropUser: false },
        { floor: 3, isGoingUp: true, dropUser: false },
      ])
    })
    test('should return array with elements the with property isGointUp false', () => {
      const currentFloor = 5
      const isCurrentGoingUp = false
      const requests: FloorRequest[] = [
        { floor: 1, isGoingUp: true, dropUser: false },
        { floor: 2, isGoingUp: false, dropUser: false },
        { floor: 3, isGoingUp: true, dropUser: false },
      ]
      const result = filterQueue(requests, isCurrentGoingUp, currentFloor)
      expect(result).toEqual([{ floor: 2, isGoingUp: false, dropUser: false }])
    })
  })

  describe('processReachedFloor function', () => {
    test('should return undefined when the request floor is not reached', () => {
      const requestQueue = [
        { floor: 1, isGoingUp: true, dropUser: true },
        { floor: 2, isGoingUp: true, dropUser: false },
      ]
      const isCurrentGoingUp = true
      const currentFloor = 3
      const setIsModalOpen = sinon.spy()

      const result = processReachedFloor(requestQueue, isCurrentGoingUp, currentFloor, setIsModalOpen)

      expect(result).toBeUndefined()
      expect(setIsModalOpen.called).toBe(false)
    })
    test("should return undefined and not call setIsModalOpen if current floor is equal but direction doesn't match", () => {
      const requestQueue = [
        { floor: 1, isGoingUp: false, dropUser: true },
        { floor: 3, isGoingUp: false, dropUser: false },
      ]
      const isCurrentGoingUp = true
      const currentFloor = 3
      const setIsModalOpen = sinon.spy()

      const result = processReachedFloor(requestQueue, isCurrentGoingUp, currentFloor, setIsModalOpen)

      expect(result).toBeUndefined()
      expect(setIsModalOpen.called).toBe(false)
    })
    test('should remove rechead request from queue and call setIsModalOpen', () => {
      const requestQueue = [
        { floor: 3, isGoingUp: true, dropUser: false },
        { floor: 4, isGoingUp: true, dropUser: false },
      ]
      const isCurrentGoingUp = true
      const currentFloor = 3
      const setIsModalOpen = sinon.spy()

      const result = processReachedFloor(requestQueue, isCurrentGoingUp, currentFloor, setIsModalOpen)

      expect(result).toEqual([{ floor: 4, isGoingUp: true, dropUser: false }])
      expect(setIsModalOpen.calledOnce).toBe(true)
    })
    test('should call toast function with the correct message when drop user', () => {
      const successToastStub = sinon.stub(toast, 'success')

      const requestQueue = [
        { floor: 3, isGoingUp: true, dropUser: true },
        { floor: 1, isGoingUp: true, dropUser: false },
      ]
      const isCurrentGoingUp = true
      const currentFloor = 3
      const setIsModalOpen = sinon.spy()

      processReachedFloor(requestQueue, isCurrentGoingUp, currentFloor, setIsModalOpen)

      sinon.assert.calledWith(successToastStub, `User arrived at floor ${currentFloor}.`)
      afterEach(() => {
        successToastStub.restore()
      })
    })
  })

  describe('getNextMove function', () => {
    test('should return undefined when request queue is empty', () => {
      const requestQueue: FloorRequest[] = []
      const isCurrentGoingUp = true
      const currentFloor = 1

      const result = getNextMove(requestQueue, isCurrentGoingUp, currentFloor)

      expect(result).toBeUndefined()
    })
    test('should return next request in upward direction when current direction is up', () => {
      const requestQueue: FloorRequest[] = [
        { floor: 2, isGoingUp: true, dropUser: true },
        { floor: 3, isGoingUp: true, dropUser: false },
      ]
      const isCurrentGoingUp = true
      const currentFloor = 1

      const result = getNextMove(requestQueue, isCurrentGoingUp, currentFloor)

      expect(result).toEqual({ floor: 2, isGoingUp: true, dropUser: true })
    })
    test('should return next request in downward direction when current direction is down', () => {
      const requestQueue: FloorRequest[] = [
        { floor: 2, isGoingUp: false, dropUser: true },
        { floor: 1, isGoingUp: false, dropUser: false },
      ]
      const isCurrentGoingUp = false
      const currentFloor = 3

      const result = getNextMove(requestQueue, isCurrentGoingUp, currentFloor)

      expect(result).toEqual({ floor: 2, isGoingUp: false, dropUser: true })
    })
    test('should return next request in opposite direction when there are no requests in current direction', () => {
      const requestQueue: FloorRequest[] = [
        { floor: 3, isGoingUp: false, dropUser: true },
        { floor: 2, isGoingUp: false, dropUser: false },
      ]
      const isCurrentGoingUp = true
      const currentFloor = 1

      const result = getNextMove(requestQueue, isCurrentGoingUp, currentFloor)

      expect(result).toEqual({ floor: 3, isGoingUp: false, dropUser: true })
    })
    test('should return next request in opposite direction when there are no requests in current direction', () => {
      const requestQueue: FloorRequest[] = [
        { floor: 3, isGoingUp: false, dropUser: true },
        { floor: 2, isGoingUp: false, dropUser: false },
      ]
      const isCurrentGoingUp = false
      const currentFloor = 1

      const result = getNextMove(requestQueue, isCurrentGoingUp, currentFloor)

      expect(result).toEqual({ floor: 2, isGoingUp: false, dropUser: false })
    })
  })
})
