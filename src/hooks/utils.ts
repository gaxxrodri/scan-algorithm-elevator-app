import { type FloorRequest } from '../common/types'

export const filterQueue = (
  requestQueue: FloorRequest[],
  isCurrentGoingUp: boolean,
  currentFloor: number
): FloorRequest[] => {
  const filteredRequestQueue = requestQueue.filter(
    request =>
      request.isGoingUp === isCurrentGoingUp &&
      (isCurrentGoingUp ? request.floor > currentFloor : request.floor < currentFloor)
  )
  return filteredRequestQueue
}

export const updateQueueIfReachFloor = (
  requestQueue: FloorRequest[],
  isCurrentGoingUp: boolean,
  currentFloor: number
): FloorRequest[] => {
  // Remove reached floor
  const updateQueue = requestQueue.filter(
    request => !(request.isGoingUp === isCurrentGoingUp && request.floor === currentFloor)
  )

  // Find if reached floor has to pickup user
  const completedRequests = requestQueue.find(
    request => request.isGoingUp === isCurrentGoingUp && request.floor === currentFloor && !request.dropUser
  )

  // Ask for destination floor if is a pickup floor request
  if (completedRequests !== undefined) {
    const destinationFloor = getDestinationFloor(currentFloor, isCurrentGoingUp)
    updateQueue.push({ floor: destinationFloor, isGoingUp: isCurrentGoingUp, dropUser: true })
  }

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
  // TODO replace this prompt with a modal or something more user friendly
  let destinationFloor: string
  do {
    destinationFloor = prompt(
      `Elevator has reached floor ${currentFloor}. Please enter a valid destination floor:`
    ) as string
  } while (!validateDestination(destinationFloor))

  return Number(destinationFloor)
}
