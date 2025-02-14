import React from 'react';
import { render, screen } from '@testing-library/react';
import { GameProvider } from './GameContext';
import TestComponent from './TestComponent';

it('provides initial context values', () => {
  render(
    <GameProvider>
      <TestComponent />
    </GameProvider>
  );

  const userShipsElement = screen.getByTestId('user-ships');
  const computerShipsElement = screen.getByTestId('computer-ships');

  // Verify the basic structure is correct (10x10 array)
  const userShips = JSON.parse(userShipsElement.textContent || '');
  const computerShips = JSON.parse(computerShipsElement.textContent || '');

  expect(userShips).toHaveLength(10);
  expect(userShips[0]).toHaveLength(10);
  expect(computerShips).toHaveLength(10);
  expect(computerShips[0]).toHaveLength(10);

  // Verify at least one ship is placed
  const hasShip = userShips.some((row) =>
    row.some((cell) => cell && cell.name === 'carrier' && cell.status === 'unguessed')
  );
  expect(hasShip).toBe(true);

  expect(screen.getByTestId('player-turn')).toHaveTextContent('computer');
});
