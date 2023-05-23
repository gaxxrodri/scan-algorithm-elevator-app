import { useEffect, useState } from 'react'
import { useInternalController } from './useInternalController'
import { ElevatorStatus } from '../types.d'
import { floors } from '../constants'

interface CallRequest {
  floor: number
  isGoingUp: boolean
  dropUser?: boolean
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
    const filteredQueue = queue.filter((request: CallRequest) => {
      if (request.isGoingUp === isCurrentGoingUp) {
        if (isCurrentGoingUp ? request.floor > currentFloor : request.floor < currentFloor) {
          return true
        } else if (request.floor === currentFloor && queue[0].isGoingUp === request.isGoingUp) {
          // remove request from queue when reached
          const indexToRemove = queue.findIndex(
            (queueElement: CallRequest) =>
              queueElement.floor === request.floor && queueElement.isGoingUp === request.isGoingUp
          )
          if (indexToRemove > -1) {
            queue.splice(indexToRemove, 1)
            if (request.dropUser !== true) {
              queue.push({
                floor: getDestinationFloor(currentFloor, isCurrentGoingUp, floors),
                isGoingUp: request.isGoingUp,
                dropUser: true,
              })
            }
          }
          return false
        }
      }
      return false
    })

    // remove stop request from queue
    const indexToRemove = queue.findIndex(
      (queueElement: CallRequest) => queueElement.floor === currentFloor && queueElement.dropUser === true
    )
    if (indexToRemove > -1) {
      queue.splice(indexToRemove, 1)
    }

    // sort requests in the same direction
    const sortQueue = filteredQueue.sort((a: CallRequest, b: CallRequest) => {
      return isCurrentGoingUp ? a.floor - b.floor : b.floor - a.floor
    })

    // if no request in the same direction, sort request in the opposite direction
    if (filteredQueue.length === 0 && queue.length !== 0) {
      const oppositeQueue = queue.sort((a: CallRequest, b: CallRequest) => {
        return isCurrentGoingUp ? b.floor - a.floor : a.floor - b.floor
      })
      return oppositeQueue[0]
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
  return { callElevator, currentFloor, currentStatus, queue }
}

const getDestinationFloor = (currentFloor: number, isGoingUp: boolean, floors: number[]): number => {
  // TODO Refactor logic in while loop
  let destinationFloor: any = null
  const getCurrentRequest = () =>
    prompt(`Elevator has reached floor ${currentFloor}. Please enter destination floor:`) as string

  const regex = /^(0|1[0-5]|[1-9])$/
  while (
    !regex.test(destinationFloor) || +destinationFloor === currentFloor || isGoingUp
      ? +destinationFloor < currentFloor
      : +destinationFloor > currentFloor || destinationFloor === null
  ) {
    destinationFloor = getCurrentRequest()
  }
  return +destinationFloor
}
