import { floors } from '../../common/constants'
import './Modal.css'

interface ModalProps {
  isOpen: boolean
  addStop: (floor: number) => void
  isCurrentGoingUp: boolean
  currentFloor: number
}

const Modal = ({ isOpen, addStop, isCurrentGoingUp, currentFloor }: ModalProps) => {
  if (!isOpen) {
    return null
  }

  const isDestinationFloorValid = (floor: number): boolean => {
    if (floor === currentFloor) return false
    if (isCurrentGoingUp ? floor < currentFloor : floor > currentFloor) return false
    return true
  }

  return (
    <div className='modal'>
      <div
        className='modal__content'
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <h4>Elevator at floor {currentFloor}</h4>
        <h4>Please select destination floor:</h4>
        <div className='buttons-container'>
          {floors.map((floor: number) => {
            return (
              <button
                className='buttons-container__floor-button'
                disabled={!isDestinationFloorValid(floor)}
                key={floor}
                onClick={() => {
                  addStop(floor)
                }}
              >
                Floor {floor}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Modal
