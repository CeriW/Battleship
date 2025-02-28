import React from 'react';
import { render, screen } from '@testing-library/react';
import { Log } from '../Log';
import { GameContext } from '../../GameContext';
import defaultTestContext from '../../defaultTestContext';
describe('Log Component', () => {
  // Helper function to render Log with custom context
  const renderLog = (log: string[]) => {
    return render(
      <GameContext.Provider value={{ ...defaultTestContext, log }}>
        <Log />
      </GameContext.Provider>
    );
  };

  test('renders empty log list when log is empty', () => {
    renderLog([]);
    const logElement = screen.getByRole('list');
    expect(logElement).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('renders log entries correctly', () => {
    const testLog = ['First entry', 'Second entry', 'Third entry'];
    renderLog(testLog);

    const logEntries = screen.getAllByRole('listitem');
    expect(logEntries).toHaveLength(3);

    testLog.forEach((entry, index) => {
      expect(logEntries[index]).toHaveTextContent(entry);
    });
  });

  test('maintains correct order of log entries', () => {
    const testLog = ['First entry', 'Second entry'];
    renderLog(testLog);

    const logEntries = screen.getAllByRole('listitem');
    expect(logEntries[0]).toHaveTextContent('First entry');
    expect(logEntries[1]).toHaveTextContent('Second entry');
  });

  test('updates when context log changes', () => {
    const { rerender } = renderLog(['Initial entry']);
    expect(screen.getByText('Initial entry')).toBeInTheDocument();

    // Rerender with updated log
    rerender(
      <GameContext.Provider value={{ ...defaultTestContext, log: ['Initial entry', 'New entry'] }}>
        <Log />
      </GameContext.Provider>
    );

    expect(screen.getByText('Initial entry')).toBeInTheDocument();
    expect(screen.getByText('New entry')).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    renderLog(['Test entry']);

    const logList = screen.getByRole('list');
    const logEntry = screen.getByRole('listitem');

    expect(logList).toHaveClass('game-log');
    expect(logEntry).toHaveClass('log-entry');
  });
});
