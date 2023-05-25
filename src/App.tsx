import { ELEVATOR_STATUS_TEXT, floors } from './common/constants'
import './App.css'
import { useElevator } from './hooks/useElevator'
import { ElevatorStatus } from './common/types'
import Button from './components/Button/Button'
import { isFloorRequested } from './common/utils'

const App = () => {
  const { callElevator, currentFloor, currentStatus, queue } = useElevator()

  return (
    <>
      <div>
        <h3>{ELEVATOR_STATUS_TEXT}</h3>
        <h4 style={{ color: currentStatus === ElevatorStatus.Running ? 'green' : 'red' }}>{currentStatus}</h4>
      </div>
      <div className='elevator-container'>
        {floors.map((floor: number) => {
          return (
            <div key={floor} className='floor-container'>
              <Button floor={floor} requestQueue={queue} callElevator={callElevator} isUpButton />
              <div className='floor-text-container' style={{ borderColor: currentFloor === floor ? '#646cff' : '' }}>
                <h5
                  className='floor-text-number'
                  style={{
                    color: isFloorRequested(queue, floor) ? '#ff64ed' : '',
                  }}
                >
                  {floor}
                </h5>
              </div>
              <Button floor={floor} requestQueue={queue} callElevator={callElevator} isUpButton={false} />
            </div>
          )
        })}
      </div>
    </>
  )
}

export default App
