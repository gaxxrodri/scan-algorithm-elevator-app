import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test } from 'vitest'
import App from '../../../App'

describe('App component', () => {
  // Render the component
  test('', async () => {
    render(<App />)

    // Verify that elevator status is displayed
    expect(screen.getByText('Elevator status:')).toBeInTheDocument()
    expect(screen.getByText('Idle')).toBeInTheDocument()

    // Verify that buttons are present and can be clicked
    const upButtons = screen.getAllByText('Up')

    expect(upButtons.length).toBeGreaterThanOrEqual(1)
    await userEvent.click(upButtons[0])

    const downButtons = screen.getAllByText('Down')

    expect(downButtons.length).toBeGreaterThanOrEqual(1)
    await userEvent.click(downButtons[0])
  })
})
