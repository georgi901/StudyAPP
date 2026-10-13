import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SessionSummary from './SessionSummary'

describe('SessionSummary', () => {
  it('displays durations like the history for sub-minute and mixed values', () => {
    render(
      <SessionSummary
        session={{
          startTime: Date.parse('2026-05-05T18:00:00.000Z'),
          endTime: Date.parse('2026-05-05T18:02:00.000Z'),
          totalFocusTime: 45,
          totalBreakTime: 75,
          completedPomodoros: 1,
          tasks: [],
        }}
        onClose={() => {}}
      />
    )

    expect(screen.getByText('45s')).toBeInTheDocument()
    expect(screen.getByText('1 min 15s')).toBeInTheDocument()
  })
})
