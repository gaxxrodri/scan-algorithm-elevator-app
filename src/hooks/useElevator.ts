import { useEffect, useState } from 'react'
import { useInternalController } from './useInternalController'
import { ElevatorStatus, type FloorRequest } from '../common/types'
import { getNextMove, processReachedFloor } from './utils'

export const useElevator = () => {
  const { up, down, getCurrentFloor, getCurrentStatus } = useInternalController()
  const currentFloor = getCurrentFloor()
  const currentStatus = getCurrentStatus()

  const [requestQueue, setRequestQueue] = useState<FloorRequest[]>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isCurrentGoingUp, setIsCurrentGoingUp] = useState<boolean>(true)

  useEffect(() => {
    if (currentStatus === ElevatorStatus.Running || openModal) {
      return
    }

    if (requestQueue.length !== 0) {
      const updatedQueue = processReachedFloor(requestQueue, isCurrentGoingUp, currentFloor, setOpenModal)
      if (updatedQueue !== undefined) {
        setRequestQueue(updatedQueue)
        return
      }
      const nextMove = getNextMove(requestQueue, isCurrentGoingUp, currentFloor)
      if (nextMove !== undefined) {
        void moveElevator(nextMove)
      }
    }
  }, [currentFloor, openModal, requestQueue, isCurrentGoingUp])

  const moveElevator = async (nextMove: FloorRequest) => {
    if (nextMove.floor > currentFloor) {
      setIsCurrentGoingUp(true)
      await up()
    } else if (nextMove.floor < currentFloor) {
      setIsCurrentGoingUp(false)
      await down()
    } else {
      // If elevator reach a floor request in the opposite direction of its movement. Set direction from next move
      setIsCurrentGoingUp(nextMove.isGoingUp)
    }
  }

  const callElevator = (floor: number, isGoingUp: boolean, dropUser?: boolean) => {
    const updatedRequestQueue = [...requestQueue, { floor, isGoingUp, dropUser: dropUser ?? false }]
    setRequestQueue(updatedRequestQueue)
  }

  const addStop = (floor: number) => {
    callElevator(floor, isCurrentGoingUp, true)
    setOpenModal(false)
  }
  return { callElevator, addStop, isCurrentGoingUp, currentFloor, currentStatus, requestQueue, openModal }
}
