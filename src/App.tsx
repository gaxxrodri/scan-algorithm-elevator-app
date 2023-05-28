import Button from './components/Button/Button'
import Modal from './components/Modal.tsx/Modal'
import { useElevator } from './hooks/useElevator'
import { Toaster } from 'sonner'
import { ELEVATOR_STATUS_TEXT, floors } from './common/constants'
import { ElevatorStatus } from './common/types'
import { isFloorRequested } from './common/utils'
import './App.css'

const App = () => {
  const { callElevator, currentFloor, currentStatus, requestQueue, openModal, addStop, isCurrentGoingUp } =
    useElevator()

  return (
    <>
      <Modal isOpen={openModal} addStop={addStop} isCurrentGoingUp={isCurrentGoingUp} currentFloor={currentFloor} />
      <Toaster position='top-right' richColors />
      <div>
        <h3>{ELEVATOR_STATUS_TEXT}</h3>
        <h4 style={{ color: currentStatus === ElevatorStatus.Running ? 'green' : 'red' }}>{currentStatus}</h4>
      </div>
      <div className='elevator-container'>
        {floors.map((floor: number) => {
          return (
            <div key={floor} className='floor-container'>
              <Button floor={floor} requestQueue={requestQueue} callElevator={callElevator} isUpButton />
              <div className='floor-text-container' style={{ borderColor: currentFloor === floor ? '#646cff' : '' }}>
                <h5
                  className='floor-text-number'
                  style={{
                    color: isFloorRequested(requestQueue, floor) ? '#ff64ed' : '',
                  }}
                >
                  {floor}
                </h5>
              </div>
              <Button floor={floor} requestQueue={requestQueue} callElevator={callElevator} isUpButton={false} />
            </div>
          )
        })}
      </div>
    </>
  )
}

export default App
