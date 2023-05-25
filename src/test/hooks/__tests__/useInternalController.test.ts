// import { renderHook } from '@testing-library/react-hooks'
// import { useInternalController } from '../../../hooks/useInternalController'
// import { act } from 'react-dom/test-utils'
// import sinon from 'sinon'

// describe('useInternalController tests', () => {
//   describe('up function', () => {
//     test('should call up correctly', async () => {
//       const { result, waitForNextUpdate } = renderHook(() => useInternalController())

//       expect(result.current.getCurrentFloor()).toEqual(0)
//       expect(result.current.getCurrentStatus()).toEqual('Idle')

//       act(() => {
//         result.current.up()
//       })

//       await waitForNextUpdate()

//       expect(result.current.getCurrentFloor()).toEqual(1)
//       expect(result.current.getCurrentStatus()).toEqual('Idle')
//     })
//   })
//   describe('down function', () => {
//     test('should call down correctly', async () => {
//       const { result, waitForNextUpdate } = renderHook(() => useInternalController())

//       act(() => {
//         result.current.up()
//       })

//       await waitForNextUpdate()

//       expect(result.current.getCurrentFloor()).toEqual(1)

//       act(() => {
//         result.current.down()
//       })

//       await waitForNextUpdate()

//       expect(result.current.getCurrentFloor()).toEqual(0)
//       expect(result.current.getCurrentStatus()).toEqual('Idle')
//     })
//   })

//   describe('getCurrentFloor function', () => {
//     test('should return the floor 0', () => {
//       const { result } = renderHook(() => useInternalController())

//       expect(result.current.getCurrentFloor()).toEqual(0)
//     })
//     test('should return the floor 1', async () => {
//       const { result, waitForNextUpdate } = renderHook(() => useInternalController())
//       act(() => {
//         result.current.up()
//       })
//       await waitForNextUpdate()

//       expect(result.current.getCurrentFloor()).toEqual(1)
//     })
//   })
//   describe('getCurrentStatus function', () => {
//     test('should return the status Idle', () => {
//       const { result } = renderHook(() => useInternalController())
//       expect(result.current.getCurrentStatus()).toEqual('Idle')
//     })
//     test('should return status Running after up is called and before promise resolves', async () => {
//       const clock = sinon.useFakeTimers()

//       const { result } = renderHook(() => useInternalController())
//       act(() => {
//         result.current.up()
//       })
//       act(() => {
//         clock.tick(500)
//       })

//       expect(result.current.getCurrentStatus()).toBe('Running')

//       await act(() => clock.tick(500))

//       expect(result.current.getCurrentStatus()).toBe('Idle')

//       clock.restore()
//     })
//   })
// })
