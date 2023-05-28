import { toast } from 'sonner'
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

export const processReachedFloor = (
  requestQueue: FloorRequest[],
  isCurrentGoingUp: boolean,
  currentFloor: number,
  setOpenModal: (open: boolean) => void
): FloorRequest[] | undefined => {
  // Remove reached floor.
  const updateQueue = requestQueue.filter(
    request => !(request.isGoingUp === isCurrentGoingUp && request.floor === currentFloor)
  )

  // Display message if user arrived.
  requestQueue.forEach(request => {
    request.floor === currentFloor && request.dropUser && toast.success(`User arrived at floor ${currentFloor}.`)
  })

  // Find if reached floor has to pickup user.
  const completedRequests = requestQueue.find(
    request => request.isGoingUp === isCurrentGoingUp && request.floor === currentFloor && !request.dropUser
  )

  // Open modal and ask for destination floor.
  if (completedRequests !== undefined) {
    setOpenModal(true)
  }

  return updateQueue.length === requestQueue.length ? undefined : updateQueue
}

export const getNextMove = (
  requestQueue: FloorRequest[],
  isCurrentGoingUp: boolean,
  currentFloor: number
): FloorRequest | undefined => {
  if (requestQueue.length === 0) {
    return
  }

  // Filter requestQueue by elevator direction and then sort it
  const sortedQueue = filterQueue(requestQueue, isCurrentGoingUp, currentFloor).sort((a, b) =>
    isCurrentGoingUp ? a.floor - b.floor : b.floor - a.floor
  )

  if (sortedQueue.length > 0) {
    return sortedQueue[0]
  }
  // If there is no request in the current direction, sort queue in the oposite direction
  const oppositeSortedQueue = requestQueue.sort((a, b) => (isCurrentGoingUp ? b.floor - a.floor : a.floor - b.floor))
  return oppositeSortedQueue[0]
}
