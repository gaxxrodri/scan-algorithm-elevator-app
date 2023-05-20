import { useState } from 'react'
import { ElevatorStatus } from '../types.d'

interface InternalControl {
  getCurrentStatus: () => ElevatorStatus
  getCurrentFloor: () => number
  up: (callback?: () => void) => Promise<void>
  down: (callback?: () => void) => Promise<void>
}

export const useInternalController = (): InternalControl => {
  const [currentStatus, setCurrentStatus] = useState(ElevatorStatus.Idle)
  const [currentFloor, setCurrentFloor] = useState(0)

  const up = async (callback?: () => void): Promise<void> => {
    await new Promise<void>(resolve => {
      setCurrentStatus(ElevatorStatus.Running)
      setTimeout(() => {
        setCurrentFloor(prev => prev + 1)
        resolve()
      }, 1000)
    }).then(() => {
      setCurrentStatus(ElevatorStatus.Idle)
      callback?.()
    })
  }
  const down = async (callback?: () => void): Promise<void> => {
    await new Promise<void>(resolve => {
      setCurrentStatus(ElevatorStatus.Running)
      setTimeout(() => {
        setCurrentFloor(prev => prev - 1)
        resolve()
      }, 1000)
    }).then(() => {
      setCurrentStatus(ElevatorStatus.Idle)
      callback?.()
    })
  }

  const getCurrentFloor = (): number => currentFloor

  const getCurrentStatus = (): ElevatorStatus => currentStatus

  return { up, down, getCurrentFloor, getCurrentStatus }
}
