/* eslint-disable @typescript-eslint/promise-function-async */
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

export const updateQueueIfReachFloor = async (
  requestQueue: FloorRequest[],
  isCurrentGoingUp: boolean,
  currentFloor: number
): Promise<FloorRequest[]> => {
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
    const destinationFloor = await getDestinationFloor(currentFloor, isCurrentGoingUp)
    updateQueue.push({ floor: destinationFloor, isGoingUp: isCurrentGoingUp, dropUser: true })
  }

  return updateQueue
}

export const getDestinationFloor = (currentFloor: number, isGoingUp: boolean): Promise<number> => {
  const regex = /^(0|1[0-5]|[1-9])$/

  const validateDestination = (destination: string) => {
    const floor = Number(destination)
    if (!regex.test(destination) || floor === currentFloor) return false
    if (isGoingUp ? floor < currentFloor : floor > currentFloor) return false
    return true
  }

  // Recursive function
  const getValidDestinationFloor = (): Promise<number> => {
    // TODO replace this prompt with a modal or something more user friendly and testable
    const destinationFloor = prompt(
      `Elevator has reached floor ${currentFloor}. Please enter a valid destination floor:`
    ) as string

    if (validateDestination(destinationFloor)) {
      return Promise.resolve(Number(destinationFloor))
    } else {
      return getValidDestinationFloor() // recurse function until user enter a valid destination floor
    }
  }

  return getValidDestinationFloor()
}
