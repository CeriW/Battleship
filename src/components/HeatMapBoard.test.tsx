import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { HeatMapBoard } from './HeatMapBoard';
import { initialiseHeatMapArray } from '../logic/calculateHeatMap';
import { HeatMapCell } from '../types';

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

  test('renders cells with undefined heat values', () => {
    const positions = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({ heat: undefined } as unknown as HeatMapCell))
      );

    render(<HeatMapBoard positions={positions} />);

    const cells = screen.getAllByTestId('cell');
    expect(cells[0]).toHaveClass('cell heat-');
  });

  test('renders cells with defined heat values', () => {
    const positions = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({ heat: 5 } as unknown as HeatMapCell))
      );

    render(<HeatMapBoard positions={positions} />);

    const cells = screen.getAllByTestId('cell');
    expect(cells[0]).toHaveClass('cell heat-5');
  });
});
