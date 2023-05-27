import { expect } from 'vitest'
import { renderHook, act } from '@testing-library/react-hooks'
import sinon from 'sinon'
import { useElevator } from '../../../hooks/useElevator'
import * as useInternalControllerModule from '../../../hooks/useInternalController'
import * as utils from '../../../hooks/utils'

let useInternalControllerStub: sinon.SinonStub
let filterQueueStub: sinon.SinonStub
let updateQueueIfReachFloorStub: sinon.SinonStub

beforeEach(() => {
  useInternalControllerStub = sinon.stub(useInternalControllerModule, 'useInternalController')
  filterQueueStub = sinon.stub(utils, 'filterQueue')
  updateQueueIfReachFloorStub = sinon.stub(utils, 'updateQueueIfReachFloor')
})

afterEach(() => {
  useInternalControllerStub.restore()
  filterQueueStub.restore()
  updateQueueIfReachFloorStub.restore()
})

describe('useElevator hook tests', () => {
  describe('callElevator function tests', () => {
    test('should add new request to requestsQueue when callElevator is called', async () => {
      useInternalControllerStub.returns({
        up: sinon.stub(),
        down: sinon.stub(),
        getCurrentFloor: sinon.stub().returns(0),
        getCurrentStatus: sinon.stub().returns('Idle'),
      })

      const { result } = renderHook(() => useElevator())

      const newRequest = { floor: 5, isGoingUp: true }

      act(() => {
        result.current.callElevator(newRequest.floor, newRequest.isGoingUp)
      })

      expect(result.current.requestQueue).toContainEqual({ ...newRequest, dropUser: false })
    })
    test('should add new request to requestsQueue when callElevator is called when is running', async () => {
      useInternalControllerStub.returns({
        up: sinon.stub(),
        down: sinon.stub(),
        getCurrentFloor: sinon.stub().returns(0),
        getCurrentStatus: sinon.stub().returns('Running'),
      })

      const { result } = renderHook(() => useElevator())

      const newRequest = { floor: 5, isGoingUp: true, dropUser: false }

      act(() => {
        result.current.callElevator(newRequest.floor, newRequest.isGoingUp)
      })

      expect(result.current.requestQueue).toContainEqual({ ...newRequest, dropUser: false })
    })
  })
})
