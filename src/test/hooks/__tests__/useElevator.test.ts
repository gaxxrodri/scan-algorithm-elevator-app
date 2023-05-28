import { expect } from 'vitest'
import { renderHook, act } from '@testing-library/react-hooks'
import sinon from 'sinon'
import { useElevator } from '../../../hooks/useElevator'
import * as useInternalControllerModule from '../../../hooks/useInternalController'
import * as utils from '../../../hooks/utils'
import { ElevatorStatus } from '../../../common/types'

let useInternalControllerStub: sinon.SinonStub
let processReachedFloorStub: sinon.SinonStub
let getNextMoveStub: sinon.SinonStub

beforeEach(() => {
  useInternalControllerStub = sinon.stub(useInternalControllerModule, 'useInternalController')
  getNextMoveStub = sinon.stub(utils, 'getNextMove')
  processReachedFloorStub = sinon.stub(utils, 'processReachedFloor')
})

afterEach(() => {
  useInternalControllerStub.restore()
  getNextMoveStub.restore()
  processReachedFloorStub.restore()
})

describe('useElevator hook tests', () => {
  describe('callElevator function tests', () => {
    test('should add new request to requestsQueue when callElevator is called', async () => {
      const { result } = renderHook(() => useElevator())
      const newRequest = { floor: 5, isGoingUp: true }

      act(() => {
        result.current.callElevator(newRequest.floor, newRequest.isGoingUp)
      })

      expect(result.current.requestQueue).toContainEqual({ ...newRequest, dropUser: false })
    })
    test('should add new request to requestsQueue when callElevator is called when is running', async () => {
      const { result } = renderHook(() => useElevator())
      const newRequest = { floor: 5, isGoingUp: true, dropUser: true }

      act(() => {
        result.current.callElevator(newRequest.floor, newRequest.isGoingUp, newRequest.dropUser)
      })

      expect(result.current.requestQueue).toContainEqual(newRequest)
    })
  })
  describe('addStop function tests', () => {
    test('should call function setOpenModal with false and add the stop to requestQueue', async () => {
      const setOpenModalSpy = sinon.spy()
      const { result } = renderHook(() => useElevator())
      const floorRequest = 6

      act(() => {
        result.current.addStop(floorRequest)
      })

      const resultQueue = { floor: 6, isGoingUp: true, dropUser: true }
      expect(setOpenModalSpy.called).toBe(false)
      expect(result.current.requestQueue).toContainEqual(resultQueue)
    })
  })
  describe('useEffect tests', () => {
    test('should not do anything when currentStatus is Running', () => {
      useInternalControllerStub.returns({
        getCurrentStatus: () => ElevatorStatus.Running,
      })

      renderHook(() => useElevator())

      expect(processReachedFloorStub.called).toBe(false)
      expect(getNextMoveStub.called).toBe(false)
    })
  })
})
