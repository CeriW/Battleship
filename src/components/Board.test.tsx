import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Board } from './Board';
import { initialiseShipArray } from '../logic/placeShips';

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
});
