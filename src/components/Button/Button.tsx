import { getButtonStyle } from './Button.utils'
import './Button.css'
import { type FloorRequest } from '../../common/types'
import { DOWN_TEXT, UP_TEXT } from '../../common/constants'

interface ButtonProps {
  floor: number
  requestQueue: FloorRequest[]
  callElevator: (floor: number, isGoingUp: boolean) => void
  isUpButton: boolean
}

const Button = ({ floor, requestQueue, callElevator, isUpButton }: ButtonProps) => {
  const disabledButton = ((isUpButton && floor === 15) || (!isUpButton && floor === 0)) ?? false
  const handleClick = () => {
    callElevator(floor, isUpButton)
  }
  return (
    <button
      disabled={disabledButton}
      style={{
        border: getButtonStyle(requestQueue, floor, isUpButton),
      }}
      className='floor-button'
      onClick={handleClick}
    >
      {isUpButton ? UP_TEXT : DOWN_TEXT}
    </button>
  )
}

export default Button
