import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { HeatMapBoard } from './HeatMapBoard';
import { initialiseHeatMapArray } from '../logic/calculateHeatMap';

describe('Heatmap board component', () => {
  test('should render the board', () => {
    render(<HeatMapBoard positions={initialiseHeatMapArray()} />);
    const boardElement = screen.getByTestId('heatmap-board');
    expect(boardElement).toBeInTheDocument();

    const columnMarkers = screen.getAllByTestId('column-marker');
    expect(columnMarkers).toHaveLength(11);

    const rowMarkers = screen.getAllByTestId('row-marker');
    expect(rowMarkers).toHaveLength(10);

    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(100);
  });
});
