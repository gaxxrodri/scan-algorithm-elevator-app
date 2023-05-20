import { useEffect, useState } from 'react'
import { useInternalController } from './useInternalController'
import { ElevatorDirection, ElevatorStatus } from '../types.d'

export const useElevator = () => {
  const [upQueue, setUpQueue] = useState<number[]>([])
  const [downQueue, setDownQueue] = useState<number[]>([])

  const { up, down, getCurrentFloor, getCurrentStatus } = useInternalController()
  const currentFloor = getCurrentFloor()
  const currentStatus = getCurrentStatus()

  useEffect(() => {
    if (currentStatus === ElevatorStatus.Running) {
      return
    }

    if (upQueue.length !== 0) {
      void moveElevator(upQueue, true)
    } else if (downQueue.length !== 0) {
      void moveElevator(downQueue, false)
    }
  }, [currentFloor, upQueue, downQueue])

  const moveElevator = async (queue: number[], moveUp: boolean) => {
    if (queue[0] === currentFloor) {
      moveUp ? setUpQueue(prevQueue => prevQueue.slice(1)) : setDownQueue(prevQueue => prevQueue.slice(1))
      return
    }
    moveUp ? await up() : await down()
  }

  const callElevator = (floor: number, direction: ElevatorDirection) => {
    if (direction === ElevatorDirection.up) {
      const updatedUpQueue = [...upQueue, floor].sort((a, b) => a - b)
      setUpQueue(updatedUpQueue)
    } else {
      const updatedDownQueue = [...downQueue, floor].sort((a, b) => b - a)
      setDownQueue(updatedDownQueue)
    }
  }
  return { callElevator, currentFloor, currentStatus }
}
