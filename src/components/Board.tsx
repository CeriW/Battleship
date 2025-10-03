import React from 'react';
import { PositionArray, CellStates, ShipNames } from '../types';
import { HitIcon, MissIcon } from './Icons';

interface BoardProps {
  positions: PositionArray;
  icons?: 'dark' | 'light';
  onCellHover?: (row: number, col: number) => void;
  onCellClick?: (row: number, col: number) => void;
  onDragStart?: (row: number, col: number) => void;
  onDragOver?: (row: number, col: number) => void;
  onDragEnd?: (row: number, col: number) => void;
  shipPreview?: { row: number; col: number }[] | null;
  selectedShip?: ShipNames | null;
  isDragging?: boolean;
  isPreviewValid?: boolean;
}

export const Board: React.FC<BoardProps> = ({
  positions,
  icons = 'dark',
  onCellHover,
  onCellClick,
  onDragStart,
  onDragOver,
  onDragEnd,
  shipPreview,
  selectedShip,
  isDragging,
  isPreviewValid = true,
}) => {
  const columnMarkers = [];
  for (let i = 0; i <= 10; i++) {
    columnMarkers.push(
      <div key={`column-marker-${i}`} className="column-marker" data-testid="column-marker">
        {i === 0 ? '' : i}
      </div>
    );
  }

  // Used to assign classes like carrier-1, carrier-2 etc to individual cells for styling
  const shipCounts: { [key: string]: number } = {
    carrier: 0,
    battleship: 0,
    cruiser: 0,
    submarine: 0,
    destroyer: 0,
  };

  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const rows = [];

  for (let y = 0; y < letters.length; y++) {
    const cells = [];
    for (let x = 0; x < 10; x++) {
      if (positions[y][x]?.name) {
        shipCounts[positions[y][x]?.name as ShipNames]++;
      }

      const isPreviewCell = shipPreview?.some((preview) => preview.row === y && preview.col === x);
      const isClickable = selectedShip && onCellClick;

      cells.push(
        <div
          key={`cell-${letters[y]}-${x}`}
          className={`cell 
            ${
              positions[y][x]?.name
                ? `ship ${positions[y][x]?.name} ${positions[y][x]?.name}-${
                    shipCounts[positions[y][x]?.name as ShipNames]
                  }`
                : ''
            }
            ${positions[y][x]?.status ?? ''}
            ${isPreviewCell ? (isPreviewValid ? 'ship-preview' : 'ship-preview-invalid') : ''}
            ${isClickable ? 'clickable' : ''}`}
          data-testid="cell"
          data-row={y}
          data-col={x}
          onMouseEnter={() => (isDragging ? onDragOver?.(y, x) : onCellHover?.(y, x))}
          onClick={() => onCellClick?.(y, x)}
          onTouchStart={(e) => {
            e.preventDefault();
            onDragStart?.(y, x);
            onCellHover?.(y, x);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            if (element) {
              const row = parseInt(element.getAttribute('data-row') || '0');
              const col = parseInt(element.getAttribute('data-col') || '0');
              onDragOver?.(row, col);
            }
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            if (element) {
              const row = parseInt(element.getAttribute('data-row') || '0');
              const col = parseInt(element.getAttribute('data-col') || '0');
              onDragEnd?.(row, col);
              onCellClick?.(row, col);
            } else {
              onDragEnd?.(y, x);
              onCellClick?.(y, x);
            }
          }}
          onMouseDown={() => onDragStart?.(y, x)}
          onMouseUp={() => onDragEnd?.(y, x)}
          draggable={false}
        >
          {positions[y][x]?.status === CellStates.hit && <HitIcon />}
          {positions[y][x]?.status === CellStates.miss && <MissIcon fill={icons === 'light' ? '#fff' : '#000'} />}
          {isPreviewCell && <div className="preview-indicator" />}
        </div>
      );
    }

    rows.push(
      <div className="row" key={`row-${y}`}>
        <div className="row-marker" key={`row-marker-${y}`} data-testid="row-marker">
          {letters[y]}
        </div>
        {cells}
      </div>
    );
  }

  return (
    <div className="board" data-testid="board">
      {columnMarkers}
      {rows}
    </div>
  );
};

export default Board;
