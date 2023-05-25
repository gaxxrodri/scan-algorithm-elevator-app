import { type FloorRequest } from '../common/types'

export const filterQueue = (queue: FloorRequest[], isCurrentGoingUp: boolean, currentFloor: number): FloorRequest[] => {
  const filteredQueue = queue.filter(
    request =>
      request.isGoingUp === isCurrentGoingUp &&
      (isCurrentGoingUp ? request.floor > currentFloor : request.floor < currentFloor)
  )
  return filteredQueue
}

export const updateQueueIfReachFloor = (
  queue: FloorRequest[],
  isCurrentGoingUp: boolean,
  currentFloor: number
): FloorRequest[] => {
  const updateQueue = queue.filter(
    request => !(request.isGoingUp === isCurrentGoingUp && request.floor === currentFloor)
  )

  const completedRequests = queue.filter(
    request => request.isGoingUp === isCurrentGoingUp && request.floor === currentFloor
  )

  completedRequests.forEach(request => {
    if (request.dropUser !== true) {
      // Ask for destination floor and add to queue
      const destinationFloor = getDestinationFloor(currentFloor, isCurrentGoingUp)
      updateQueue.push({ floor: destinationFloor, isGoingUp: isCurrentGoingUp, dropUser: true })
    } else {
      alert(`User arrived at floor ${currentFloor}.`)
    }
  })

  return updateQueue
}

export const getDestinationFloor = (currentFloor: number, isGoingUp: boolean): number => {
  const regex = /^(0|1[0-5]|[1-9])$/

  const validateDestination = (destination: string) => {
    const floor = Number(destination)
    if (!regex.test(destination) || floor === currentFloor) return false
    if (isGoingUp ? floor < currentFloor : floor > currentFloor) return false
    return true
  }

  let destinationFloor: string
  do {
    destinationFloor = prompt(
      `Elevator has reached floor ${currentFloor}. Please enter a valid destination floor:`
    ) as string
  } while (!validateDestination(destinationFloor))

  return Number(destinationFloor)
}
