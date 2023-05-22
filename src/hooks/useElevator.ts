import { useEffect, useState } from 'react'
import { useInternalController } from './useInternalController'
import { ElevatorStatus } from '../types.d'

interface CallRequest {
  floor: number
  isGoingUp: boolean
}

let queue: CallRequest[] = []
let isCurrentGoingUp: boolean = true

export const useElevator = () => {
  const { up, down, getCurrentFloor, getCurrentStatus } = useInternalController()

  const [run, setRun] = useState(false)
  const currentFloor = getCurrentFloor()
  const currentStatus = getCurrentStatus()

  const getNextMove = (): CallRequest | undefined => {
    if (queue.length === 0) {
      return
    }

    // filter request in the same direction
    const filteredQueue = queue.filter(request => {
      if (request.isGoingUp === isCurrentGoingUp) {
        if (isCurrentGoingUp ? request.floor > currentFloor : request.floor < currentFloor) {
          return true
        } else if (request.floor === currentFloor && queue[0].isGoingUp === request.isGoingUp) {
          // remove request from queue when reached
          const indexToRemove = queue.findIndex(
            obj => obj.floor === request.floor && obj.isGoingUp === request.isGoingUp
          )
          queue.splice(indexToRemove, 1)
          return false
        }
      }
      return false
    })

    // sort requests in the same direction
    const sortQueue = filteredQueue.sort((a, b) => {
      if (isCurrentGoingUp) {
        return a.floor - b.floor
      } else {
        return b.floor - a.floor
      }
    })

    // if no request in the same direction, sort request in the oposite direction
    if (filteredQueue.length === 0 && queue.length !== 0) {
      const opositeQueue = queue.sort((a, b) => {
        if (isCurrentGoingUp) {
          return b.floor - a.floor
        } else {
          return a.floor - b.floor
        }
      })
      return opositeQueue[0]
    }
    return sortQueue[0]
  }

  useEffect(() => {
    if (currentStatus === ElevatorStatus.Running) {
      return
    }
    if (queue.length !== 0) {
      let nextMove = getNextMove()
      if (nextMove !== undefined) {
        void moveElevator(nextMove)
      } else {
        nextMove = getNextMove()
        if (nextMove !== undefined) {
          void moveElevator(nextMove)
        }
        setRun(false)
      }
    }
  }, [currentFloor, run])

  const moveElevator = async (nextMove: CallRequest) => {
    if (nextMove.floor > currentFloor) {
      isCurrentGoingUp = true
      await up()
    } else if (nextMove.floor < currentFloor) {
      isCurrentGoingUp = false
      await down()
    } else {
      isCurrentGoingUp = nextMove.isGoingUp
      setRun(prev => !prev)
    }
  }

  const callElevator = (floor: number, isGoingUp: boolean) => {
    const updatedQueue = [...queue, { floor, isGoingUp }]
    queue = updatedQueue
    setRun(true)
  }
  return { callElevator, currentFloor, currentStatus }
}
