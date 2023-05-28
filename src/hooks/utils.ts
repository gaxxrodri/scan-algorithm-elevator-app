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
  setIsModalOpen: (open: boolean) => void
): FloorRequest[] | undefined => {
  const updateQueue: FloorRequest[] = []

  requestQueue.forEach(request => {
    if (request.isGoingUp !== isCurrentGoingUp || request.floor !== currentFloor) {
      updateQueue.push(request)
    } else {
      request.dropUser && toast.success(`User arrived at floor ${currentFloor}.`)

      // Open modal and ask for destination floor.
      !request.dropUser && setIsModalOpen(true)
    }
  })

  return updateQueue.length !== requestQueue.length ? updateQueue : undefined
}

export const getNextMove = (
  requestQueue: FloorRequest[],
  isCurrentGoingUp: boolean,
  currentFloor: number
): FloorRequest | undefined => {
  if (requestQueue.length === 0) {
    return undefined
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
