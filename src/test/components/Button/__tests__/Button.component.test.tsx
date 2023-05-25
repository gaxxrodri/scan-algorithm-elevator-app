import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import sinon from 'sinon'
import { test } from 'vitest'
import Button from '../../../../components/Button/Button'
import { type FloorRequest } from '../../../../common/types'

test('Button component', async () => {
  const floor = 1
  const isUpButton = true
  const requestQueue: FloorRequest[] = [
    { floor: 1, isGoingUp: true, dropUser: false },
    { floor: 2, isGoingUp: false, dropUser: false },
    { floor: 3, isGoingUp: true, dropUser: true },
  ]

  const callElevatorMock = sinon.spy()

  // Render the component
  render(<Button floor={floor} requestQueue={requestQueue} callElevator={callElevatorMock} isUpButton={isUpButton} />)

  // Verify button text
  expect(screen.getByRole('button')).toHaveTextContent('Up')

  // Verify button style
  expect(screen.getByRole('button')).toHaveStyle({ border: '1px solid green' })

  // Click on the button
  await userEvent.click(screen.getByRole('button'))

  // Verify that callElevator is called with correct arguments
  sinon.assert.calledWith(callElevatorMock, floor, isUpButton)
})
