import { floors } from './constants'
import './App.css'
import { useElevator } from './hooks/useElevator'

const App = () => {
  const { callElevator, currentFloor, currentStatus } = useElevator()

  return (
    <>
      <div>Elevator app </div>
      <div className='floating'>
        <h4>Current Floor {currentFloor}</h4>
        <h4>Current status {currentStatus}</h4>
      </div>
      <div className='elevator-container'>
        {floors.map((floor: number) => {
          return (
            <div key={floor} className='floor-container'>
              <button
                className='up-button'
                onClick={() => {
                  callElevator(floor, true)
                }}
              >
                Up
              </button>
              <div className='floor-text-container' style={{ borderColor: currentFloor === floor ? '#646cff' : '' }}>
                <h5 className='floor-text-number'>{floor}</h5>
              </div>
              <button
                className='down-button'
                onClick={() => {
                  callElevator(floor, false)
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
