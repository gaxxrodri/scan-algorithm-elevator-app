import { type FloorRequest } from '../../common/types'

export const getButtonStyle = (requestQueue: FloorRequest[], floor: number, isUpButton: boolean) => {
  const isFloorInRequest = requestQueue.some(
    request => request.floor === floor && request.isGoingUp === isUpButton && request.dropUser !== true
  )

  if (!isFloorInRequest) return ''

  return isUpButton ? '1px solid green' : '1px solid red'
}
