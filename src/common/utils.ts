import { type FloorRequest } from './types'

export const isFloorRequested = (requestQueue: FloorRequest[], currentFloor: number): boolean => {
  return requestQueue.some(request => request.floor === currentFloor && request.dropUser)
}
