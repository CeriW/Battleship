import React, { useState, useEffect } from 'react';
import { shipTypes, ShipNames, PositionArray, Alignment, CellStates } from '../types';
import { initialiseShipArray, checkValidShipState } from '../logic/placeShips';
import Board from './Board';
import './ShipPlacement.scss';

interface ShipPlacementProps {
  onComplete: (ships: PositionArray) => void;
}

export const ShipPlacement: React.FC<ShipPlacementProps> = ({ onComplete }) => {
  const [selectedShip, setSelectedShip] = useState<ShipNames | null>(null);
  const [shipAlignment, setShipAlignment] = useState<Alignment>('horizontal');
  const [hoveredPosition, setHoveredPosition] = useState<{ row: number; col: number } | null>(null);
  const [placedShips, setPlacedShips] = useState<PositionArray>(initialiseShipArray());
  const [placedShipNames, setPlacedShipNames] = useState<Set<ShipNames>>(new Set());
  const [isDragging, setIsDragging] = useState(false);

  // Keyboard event listener for 'R' key to rotate
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'r' && selectedShip) {
        handleRotateShip();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [selectedShip]);

  const getShipInfo = (shipName: ShipNames) => {
    return shipTypes.find((ship) => ship.name === shipName);
  };

  const getShipPreview = () => {
    if (!selectedShip || !hoveredPosition) return null;

    const shipInfo = getShipInfo(selectedShip);
    if (!shipInfo) return null;

    const preview: { row: number; col: number }[] = [];
    const { row, col } = hoveredPosition;

    for (let i = 0; i < shipInfo.size; i++) {
      if (shipAlignment === 'horizontal') {
        preview.push({ row, col: col + i });
      } else {
        preview.push({ row: row + i, col });
      }
    }

    return preview;
  };

  const isShipPlacementValid = (shipName: ShipNames, startRow: number, startCol: number, alignment: Alignment) => {
    const shipInfo = getShipInfo(shipName);
    if (!shipInfo) return false;

    const proposedPositions = {
      startingRow: startRow,
      startingColumn: startCol,
      alignment,
    };

    return checkValidShipState({
      proposedPositions,
      shipSize: shipInfo.size,
      existingPositions: placedShips,
      adjacentShipModifier: 0, // Don't allow adjacent ships for user placement
    });
  };

  const isShipPreviewValid = () => {
    if (!selectedShip || !hoveredPosition) return true;

    const shipInfo = getShipInfo(selectedShip);
    if (!shipInfo) return true;

    // Check if ship would go off the board
    const { row, col } = hoveredPosition;

    if (shipAlignment === 'horizontal') {
      return col + shipInfo.size <= 10;
    } else {
      return row + shipInfo.size <= 10;
    }
  };

  const handleCellHover = (row: number, col: number) => {
    if (selectedShip) {
      setHoveredPosition({ row, col });
    }
  };

  const handleDragStart = (row: number, col: number) => {
    if (selectedShip) {
      setIsDragging(true);
      setHoveredPosition({ row, col });
    }
  };

  const handleDragOver = (row: number, col: number) => {
    if (isDragging && selectedShip) {
      setHoveredPosition({ row, col });
    }
  };

  const handleDragEnd = (row: number, col: number) => {
    if (isDragging && selectedShip) {
      setIsDragging(false);
      handleCellClick(row, col);
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (!selectedShip) return;

    const shipInfo = getShipInfo(selectedShip);
    if (!shipInfo) return;

    if (isShipPlacementValid(selectedShip, row, col, shipAlignment)) {
      const newPlacedShips = [...placedShips];

      // Place the ship
      for (let i = 0; i < shipInfo.size; i++) {
        if (shipAlignment === 'horizontal') {
          newPlacedShips[row][col + i] = {
            name: selectedShip,
            status: CellStates.unguessed,
          };
        } else {
          newPlacedShips[row + i][col] = {
            name: selectedShip,
            status: CellStates.unguessed,
          };
        }
      }

      setPlacedShips(newPlacedShips);
      setPlacedShipNames((prev) => new Set([...prev, selectedShip]));
      setSelectedShip(null);
      setHoveredPosition(null);
    }
  };

  const handleShipSelect = (shipName: ShipNames) => {
    if (placedShipNames.has(shipName)) return;
    setSelectedShip(shipName);
  };

  const handleRotateShip = () => {
    setShipAlignment((prev) => (prev === 'horizontal' ? 'vertical' : 'horizontal'));
  };

  const handleRemoveShip = (shipName: ShipNames) => {
    const newPlacedShips = initialiseShipArray();

    // Rebuild the array without the removed ship
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (placedShips[row][col] && placedShips[row][col]?.name !== shipName) {
          newPlacedShips[row][col] = placedShips[row][col];
        }
      }
    }

    setPlacedShips(newPlacedShips);
    setPlacedShipNames((prev) => {
      const newSet = new Set(prev);
      newSet.delete(shipName);
      return newSet;
    });
  };

  const handleStartGame = () => {
    if (placedShipNames.size === shipTypes.length) {
      onComplete(placedShips);
    }
  };

  const handleResetShips = () => {
    setPlacedShips(initialiseShipArray());
    setPlacedShipNames(new Set());
    setSelectedShip(null);
    setHoveredPosition(null);
  };

  const shipPreview = getShipPreview();
  const allShipsPlaced = placedShipNames.size === shipTypes.length;

  return (
    <div className="ship-placement">
      <div className="ship-placement-header">
        <h2>Place Your Ships</h2>
        <p>
          <span className="desktop-instructions">
            Click on a ship to select it, then click or drag on the board to place it. Press 'R' or click the rotate
            button to change orientation.
          </span>
          <span className="tablet-instructions">
            Tap on a ship to select it, then tap or drag on the board to place it. Tap the rotate button to change
            orientation.
          </span>
          <span className="mobile-instructions">
            Tap on a ship to select it, then tap or drag on the board to place it. Tap the rotate button to change
            orientation.
          </span>
        </p>
      </div>

      <div className="ship-placement-content">
        <div className="ship-selection">
          <h3>Your Fleet</h3>
          <div className="ship-list">
            {shipTypes.map((ship) => (
              <div
                key={ship.name}
                className={`ship-item ${selectedShip === ship.name ? 'selected' : ''} ${
                  placedShipNames.has(ship.name) ? 'placed' : ''
                }`}
                onClick={() => handleShipSelect(ship.name)}
              >
                <div className="ship-visual">
                  {Array.from({ length: ship.size }, (_, i) => (
                    <div key={i} className={`ship-segment ${ship.name}`} />
                  ))}
                </div>
                <div className="ship-info">
                  <div className="ship-name">{ship.name}</div>
                  <div className="ship-size">{ship.size} tiles</div>
                </div>
                {placedShipNames.has(ship.name) && (
                  <button
                    className="remove-ship"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveShip(ship.name);
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {selectedShip && (
            <div className="ship-controls">
              <button onClick={handleRotateShip} className="rotate-button">
                Rotate Ship ({shipAlignment === 'horizontal' ? 'vertical' : 'horizontal'})
              </button>
            </div>
          )}
        </div>

        <div className="placement-board">
          <div className="board-container">
            <Board
              positions={placedShips}
              onCellHover={handleCellHover}
              onCellClick={handleCellClick}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              shipPreview={shipPreview}
              selectedShip={selectedShip}
              isDragging={isDragging}
              isPreviewValid={isShipPreviewValid()}
            />
          </div>
        </div>
      </div>

      <div className="ship-placement-footer">
        <div className="placement-status">
          {allShipsPlaced ? (
            <div className="ready-to-start">
              <span>✓ All ships placed! Ready to start the game.</span>
            </div>
          ) : (
            <div className="ships-remaining">{shipTypes.length - placedShipNames.size} ships remaining</div>
          )}
        </div>

        <div className="footer-buttons">
          <button className="reset-button" onClick={handleResetShips} disabled={placedShipNames.size === 0}>
            Reset Ships
          </button>
          <button className="start-game-button" onClick={handleStartGame} disabled={!allShipsPlaced}>
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipPlacement;
