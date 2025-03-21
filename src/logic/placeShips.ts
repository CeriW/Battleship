import { Alignment, CellStates, PositionArray, ShipInfo } from '../types';
import { shipTypes } from '../App';
import { doesShipFit, generatePotentialCoordinates } from './helpers';

export function initialiseShipArray(): PositionArray {
  let array = [];
  for (let i = 0; i < 10; i++) {
    array[i] = new Array(10).fill(null);
  }
  return array;
}

// Generate a random ship position that does not go off the side of the board
export const generateRandomPosition = (
  ship: ShipInfo,
  alignment = (Math.random() > 0.5 ? 'horizontal' : 'vertical') as 'horizontal' | 'vertical'
): { startingRow: number; startingColumn: number; alignment: 'horizontal' | 'vertical' } => {
  let startingRow, startingColumn;

  if (alignment === 'horizontal') {
    startingRow = Math.floor(Math.random() * 10);
    startingColumn = Math.floor(Math.random() * (11 - ship.size));
  } else {
    // vertical
    startingRow = Math.floor(Math.random() * (11 - ship.size));
    startingColumn = Math.floor(Math.random() * 10);
  }

  return { startingRow, startingColumn, alignment };
};

// Check that for a proposed ship occupation, there are no overlaps with other ships
// Returns true if the state is valid and usable
export const checkValidShipState = ({
  proposedPositions,
  shipSize,
  existingPositions,
  adjacentShipModifier = 0,
  forHeatMap = false,
}: {
  proposedPositions: { startingRow: number; startingColumn: number; alignment: Alignment };
  shipSize: number;
  existingPositions: PositionArray;
  adjacentShipModifier?: number;
  forHeatMap?: boolean;
}): boolean => {
  const mayOverlapHits = forHeatMap;

  // First check if ship would go out of bounds

  if (!doesShipFit(proposedPositions, shipSize)) return false;

  // Generate a list of all the cells that this ship could occupy
  const potentialCoordinates = generatePotentialCoordinates(proposedPositions, shipSize);

  // Figure out whether the spaces are occupied by other ships, as well as adjacent spaces where ai disallows
  let valid = true;

  const adjacentShipsAllowable = forHeatMap || Math.random() + adjacentShipModifier >= 1;

  potentialCoordinates.forEach(({ x, y }) => {
    let thisCell = existingPositions[y][x];
    if (thisCell && !mayOverlapHits) valid = false;

    if (!adjacentShipsAllowable) {
      if (existingPositions[Math.max(0, y - 1)][x]) valid = false; // Check row above
      if (existingPositions[Math.min(9, y + 1)][x]) valid = false; // Check row below
      if (existingPositions[y][Math.max(0, x - 1)]) valid = false; // Check column to left
      if (existingPositions[y][Math.min(9, x + 1)]) valid = false; // Check column to right
    }
  });

  return valid;
};

export const placeShips = (): PositionArray => {
  const positions = initialiseShipArray();

  shipTypes.forEach((ship: ShipInfo) => {
    let validShipState = false;

    while (!validShipState) {
      let proposedPositions = generateRandomPosition(ship);

      validShipState = checkValidShipState({
        proposedPositions,
        shipSize: ship.size,
        existingPositions: positions,
      });

      if (validShipState) {
        if (proposedPositions.alignment === 'horizontal') {
          for (let i = proposedPositions.startingColumn; i < proposedPositions.startingColumn + ship.size; i++) {
            positions[proposedPositions.startingRow][i] = {
              name: ship.name,
              status: CellStates.unguessed,
            };
          }
        } else {
          // vertical placement
          for (let i = proposedPositions.startingRow; i < proposedPositions.startingRow + ship.size; i++) {
            positions[i][proposedPositions.startingColumn] = {
              name: ship.name,
              status: CellStates.unguessed,
            };
          }
        }
      }
    }
  });

  return positions;
};
