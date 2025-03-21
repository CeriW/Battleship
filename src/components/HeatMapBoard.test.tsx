import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { HeatMapBoard } from './HeatMapBoard';
import { initialiseHeatMapArray } from '../logic/calculateHeatMap';
import { GameContext, GameContextType } from '../GameContext';

// Mock the GameContext
jest.mock('../GameContext', () => ({
  GameContext: {
    // Mock the context with a simple object
    Provider: ({ children }: { children: React.ReactNode; value: any }) => children,
  },
}));

describe('Heatmap board component', () => {
  test('should render the board structure correctly', () => {
    render(<HeatMapBoard positions={initialiseHeatMapArray()} />);
    const boardElement = screen.getByTestId('heatmap-board');
    expect(boardElement).toBeInTheDocument();

    const columnMarkers = screen.getAllByTestId('column-marker');
    expect(columnMarkers).toHaveLength(11);
    expect(columnMarkers[0]).toHaveTextContent('');
    expect(columnMarkers[1]).toHaveTextContent('1');

    const rowMarkers = screen.getAllByTestId('row-marker');
    expect(rowMarkers).toHaveLength(10);
    expect(rowMarkers[0]).toHaveTextContent('A');

    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(100);
  });

  test('should display correct cell contents based on position values', () => {
    // Create a fresh positions array for each test
    const positions = initialiseHeatMapArray();

    // Set test values
    positions[0][0] = 0; // Should show ❌
    positions[0][1] = 400; // Should show ✔️
    positions[0][2] = Math.floor(400 / 2); // Should show percentage

    render(<HeatMapBoard positions={positions} />);

    // Get all cells
    const cells = screen.getAllByTestId('cell');

    // Test cell with 0 value (positions[0][0])
    expect(cells[0]).toHaveTextContent('❌');

    // Test cell with maximum value (positions[0][1])
    expect(cells[1]).toHaveTextContent('✔️');

    // Test cell with intermediate value (positions[0][2])
    const expectedPercentage = ((400 / 2 / 400) * 100).toFixed(1);
    expect(cells[2]).toHaveTextContent(`${expectedPercentage}`);
  });

  test('should handle empty positions array', () => {
    // Create a fresh array for each test - using Array.from to avoid shared references
    const emptyPositions = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => 0));

    render(<HeatMapBoard positions={emptyPositions} />);

    const cells = screen.getAllByTestId('cell');
    cells.forEach((cell) => {
      expect(cell).toHaveTextContent('❌');
    });
  });
});
