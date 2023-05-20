import { useElevator } from './hooks/useElevator'
import { ElevatorDirection } from './types.d'
import { floors } from './constants'
import './App.css'

const App = () => {
  const { callElevator, currentFloor, currentStatus } = useElevator()

  return (
    <>
      <div>Elevator app </div>
      <div className='floating'>
        <text>Current Floor {currentFloor}</text>
        <text>Current status {currentStatus}</text>
      </div>
      <div className='elevator-container'>
        {floors.map((floor: number) => {
          return (
            <div key={floor} className='floor-container'>
              <button
                className='up-button'
                onClick={() => {
                  callElevator(floor, ElevatorDirection.up)
                }}
              >
                Up
              </button>
              <text className='floor-text-number'>{floor}</text>
              <button
                className='down-button'
                onClick={() => {
                  callElevator(floor, ElevatorDirection.down)
                }}
              >
                Down
              </button>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default App
