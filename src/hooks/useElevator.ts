import { useEffect, useState } from 'react'
import { useInternalController } from './useInternalController'
import { ElevatorStatus, type FloorRequest } from '../common/types'
import { filterQueue, updateQueueIfReachFloor } from './utils'

let isCurrentGoingUp: boolean = true
let queue: FloorRequest[] = []

export const useElevator = () => {
  const { up, down, getCurrentFloor, getCurrentStatus } = useInternalController()
  const currentFloor = getCurrentFloor()
  const currentStatus = getCurrentStatus()
  const [run, setRun] = useState(false)

  useEffect(() => {
    if (currentStatus === ElevatorStatus.Running) {
      return
    }
    if (queue.length !== 0) {
      const nextMove = getNextMove()
      if (nextMove !== undefined) {
        void moveElevator(nextMove)
      }
    }
  }, [currentFloor, run])

  const getNextMove = (): FloorRequest | undefined => {
    if (queue.length === 0) {
      return
    }
    queue = updateQueueIfReachFloor(queue, isCurrentGoingUp, currentFloor)

    // Filter queue by elevator direction and then sort it
    const sortedQueue = filterQueue(queue, isCurrentGoingUp, currentFloor).sort((a, b) =>
      isCurrentGoingUp ? a.floor - b.floor : b.floor - a.floor
    )

    if (sortedQueue.length > 0) {
      return sortedQueue[0]
    }
    // If there is no request in the current direction, sort queue in the oposite direction
    const oppositeSortedQueue = queue.sort((a, b) => (isCurrentGoingUp ? b.floor - a.floor : a.floor - b.floor))
    return oppositeSortedQueue[0]
  }

  const moveElevator = async (nextMove: FloorRequest) => {
    if (nextMove.floor > currentFloor) {
      isCurrentGoingUp = true
      await up()
    } else if (nextMove.floor < currentFloor) {
      isCurrentGoingUp = false
      await down()
    } else {
      // If elevator reach a floor request in the opposite direction of its movement. Set direction and re-run
      isCurrentGoingUp = nextMove.isGoingUp
      setRun(prev => !prev)
    }
  }

  const callElevator = (floor: number, isGoingUp: boolean) => {
    const updatedQueue = [...queue, { floor, isGoingUp }]
    queue = updatedQueue
    setRun(prev => !prev)
  }
  return { callElevator, currentFloor, currentStatus, queue }
}
