import { useEffect, useState } from 'react'
import { useInternalController } from './useInternalController'
import { ElevatorStatus, type FloorRequest } from '../common/types'
import { getNextMove, processReachedFloor } from './utils'

export const useElevator = () => {
  const { up, down, getCurrentFloor, getCurrentStatus } = useInternalController()
  const currentFloor = getCurrentFloor()
  const currentStatus = getCurrentStatus()

  const [requestQueue, setRequestQueue] = useState<FloorRequest[]>([])
  const [isCurrentGoingUp, setIsCurrentGoingUp] = useState<boolean>(true)

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      if (currentStatus === ElevatorStatus.Running || requestQueue.length === 0 || isModalOpen) {
        return
      }
      const updatedQueue = processReachedFloor(requestQueue, isCurrentGoingUp, currentFloor, setIsModalOpen)

      if (updatedQueue !== undefined) {
        setRequestQueue(updatedQueue)
      } else {
        const nextMove = getNextMove(requestQueue, isCurrentGoingUp, currentFloor)

        if (nextMove !== undefined) {
          try {
            await moveElevator(nextMove)
          } catch (error) {
            console.error('An error occurred while moving the elevator: ', error)
          }
        }
      }
    })().catch(error => {
      console.error('An error occurred during elevator operation: ', error)
    })
  }, [currentFloor, isModalOpen, requestQueue, isCurrentGoingUp])

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
    setIsModalOpen(false)
  }
  return { callElevator, addStop, isCurrentGoingUp, currentFloor, currentStatus, requestQueue, isModalOpen }
}
