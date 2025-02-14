import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Board } from './Board';
import { initialiseShipArray } from '../logic/placeShips';
import { CellStates } from '../types';

describe('Board Component', () => {
  test('should render the board', () => {
    render(<Board positions={initialiseShipArray()} />);
    const boardElement = screen.getByTestId('board');
    expect(boardElement).toBeInTheDocument();

    const columnMarkers = screen.getAllByTestId('column-marker');
    expect(columnMarkers).toHaveLength(11);

    const rowMarkers = screen.getAllByTestId('row-marker');
    expect(rowMarkers).toHaveLength(10);

    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(100);
  });

  test('displays fire emoji for hit cells', () => {
    const positions = Array(10).fill(Array(10).fill(null));
    positions[0][0] = { status: CellStates.hit, name: 'ship' };

    render(<Board positions={positions} />);

    const cells = screen.getAllByTestId('cell');
    expect(cells[0]).toHaveTextContent('🔥');
  });

  test('displays X emoji for missed cells', () => {
    const positions = Array(10).fill(Array(10).fill(null));
    positions[0][0] = { status: CellStates.miss, name: '' };

    render(<Board positions={positions} />);

    const cells = screen.getAllByTestId('cell');
    expect(cells[0]).toHaveTextContent('❌');
  });

  test('displays blank for empty or unmarked cells', () => {
    const positions = Array(10).fill(Array(10).fill(null));
    positions[0][0] = { status: undefined, name: '' };

    render(<Board positions={positions} />);

    const cells = screen.getAllByTestId('cell');
    expect(cells[0]).toHaveTextContent('');
  });
});
