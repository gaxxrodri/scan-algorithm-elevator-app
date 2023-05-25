import { floors } from './constants'
import './App.css'
import { useElevator } from './hooks/useElevator'
import { ElevatorStatus } from './types.d'

const App = () => {
  const { callElevator, currentFloor, currentStatus, queue } = useElevator()

  return (
    <>
      <div>Elevator app </div>
      <div className='floating'>
        <h4>Current Floor {currentFloor}</h4>
        <div style={{ color: currentStatus === ElevatorStatus.Running ? 'green' : 'red' }}>
          Current status {currentStatus}
        </div>
      </div>
      <div className='elevator-container'>
        {floors.map((floor: number) => {
          return (
            <div key={floor} className='floor-container'>
              <button
                disabled={floor === 15}
                style={{
                  border: queue.some(
                    request => request.floor === floor && request.isGoingUp && request.dropUser !== true
                  )
                    ? '1px solid green'
                    : '',
                }}
                className='up-button'
                onClick={() => {
                  callElevator(floor, true)
                }}
              >
                Up
              </button>
              <div className='floor-text-container' style={{ borderColor: currentFloor === floor ? '#646cff' : '' }}>
                <h5
                  className='floor-text-number'
                  style={{
                    color: queue.some(request => request.floor === floor && request.dropUser === true) ? 'violet' : '',
                  }}
                >
                  {floor}
                </h5>
              </div>
              <button
                disabled={floor === 0}
                style={{
                  border: queue.some(
                    request => request.floor === floor && !request.isGoingUp && request.dropUser !== true
                  )
                    ? '1px solid red'
                    : '',
                }}
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
