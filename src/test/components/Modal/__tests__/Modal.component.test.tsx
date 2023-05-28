import { render, fireEvent } from '@testing-library/react'
import sinon from 'sinon'
import { test } from 'vitest'
import Modal from '../../../../components/Modal.tsx/Modal'

describe('Modal component', () => {
  const addStopSpy = sinon.spy()
  test('renders Modal and checks floor buttons behavior', () => {
    const currentFloor = 1
    const isCurrentGoingUp = true

    const { getByText } = render(
      <Modal isOpen={true} addStop={addStopSpy} isCurrentGoingUp={isCurrentGoingUp} currentFloor={currentFloor} />
    )

    expect(getByText(`Elevator at floor ${currentFloor}`)).toBeInTheDocument()
    expect(getByText('Please select destination floor:')).toBeInTheDocument()

    // Checks if the current floor button is disabled
    expect(getByText(`Floor ${currentFloor}`).closest('button')).toBeDisabled()

    // Checks if the floors below the current floor are disabled when the elevator is going up
    if (isCurrentGoingUp) {
      for (let floor = 0; floor < currentFloor; floor++) {
        expect(getByText(`Floor ${floor}`).closest('button')).toBeDisabled()
      }
    }

    // Fires a click event on a valid floor buttons and checks if addStop function is called with the right argument
    const floorToTest = currentFloor + 1
    fireEvent.click(getByText(`Floor ${floorToTest}`))
    sinon.assert.calledWith(addStopSpy, floorToTest)
  })
  test('should not render Modal if isOpen prop is false', () => {
    const currentFloor = 1
    const isCurrentGoingUp = true

    const { queryByText } = render(
      <Modal isOpen={false} addStop={addStopSpy} isCurrentGoingUp={isCurrentGoingUp} currentFloor={currentFloor} />
    )
    expect(queryByText(`Elevator at floor ${currentFloor}`)).toBeNull()
  })
})
