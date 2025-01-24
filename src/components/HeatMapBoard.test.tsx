import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { HeatMapBoard } from './HeatMapBoard';
import { initialiseHeatMapArray } from '../logic/calculateHeatMap';
import { ai } from '../ai-behaviour';

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
    const positions = initialiseHeatMapArray();
    // Set some test values
    positions[0][0] = 0; // Should show ❌
    positions[0][1] = ai.heatMapSimulations; // Should show ✔️
    positions[0][2] = Math.floor(ai.heatMapSimulations / 2); // Should show percentage

    render(<HeatMapBoard positions={positions} />);
    const cells = screen.getAllByTestId('cell');

    // Test cell with 0 value
    expect(cells[0]).toHaveTextContent('❌');

    // Test cell with maximum value
    expect(cells[1]).toHaveTextContent('✔️');

    // Test cell with intermediate value
    const expectedPercentage = ((ai.heatMapSimulations / 2 / ai.heatMapSimulations) * 100).toFixed(1);
    expect(cells[2]).toHaveTextContent(`${expectedPercentage}%`);
  });

  test('should handle empty positions array', () => {
    const emptyPositions = Array(10).fill(Array(10).fill(0));
    render(<HeatMapBoard positions={emptyPositions} />);

    const cells = screen.getAllByTestId('cell');
    cells.forEach((cell) => {
      expect(cell).toHaveTextContent('❌');
    });
  });
});
