import { ai, difficultyClass } from '../ai-behaviour';

export type PositionArray = (string | null)[][];

export function initialiseShipArray(): PositionArray {
  let array = [];
  for (let i = 0; i < 10; i++) {
    array[i] = new Array(10).fill(null);
  }
  return array;
}

type ShipInfo = {
  name: 'carrier' | 'battleship' | 'cruiser' | 'submarine' | 'destroyer';
  size: number;
};

const shipTypes: ShipInfo[] = [
  { name: 'carrier', size: 5 },
  { name: 'battleship', size: 4 },
  { name: 'cruiser', size: 3 },
  { name: 'submarine', size: 3 },
  { name: 'destroyer', size: 2 },
];

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
  adjacentShipModifier = ai.adjacentShipModifier, // for testing purposes only
}: {
  proposedPositions: { startingRow: number; startingColumn: number; alignment: 'horizontal' | 'vertical' };
  shipSize: number;
  existingPositions: PositionArray;
  adjacentShipModifier?: number;
}): boolean => {
  // First check if ship would go out of bounds
  if (proposedPositions.alignment === 'horizontal' && proposedPositions.startingColumn + shipSize > 9) return false;
  if (proposedPositions.alignment === 'vertical' && proposedPositions.startingRow + shipSize > 9) return false;

  // Make a list of all the cells that this ship could occupy
  const potentialCoordinates = [];
  if (proposedPositions.alignment === 'horizontal') {
    for (let i = 0; i < shipSize; i++) {
      potentialCoordinates.push({
        x: proposedPositions.startingColumn + i,
        y: proposedPositions.startingRow,
      });
    }
  } else {
    // alignment === 'vertical'
    for (let i = 0; i < shipSize; i++) {
      potentialCoordinates.push({
        x: proposedPositions.startingColumn,
        y: proposedPositions.startingRow + i,
      });
    }
  }

  // Figure out whether the spaces are occupied by other ships, as well as adjacent spaces where ai disallows
  let valid = true;

  const adjacentShipsAllowable = Math.random() + adjacentShipModifier >= 1;

  potentialCoordinates.forEach(({ x, y }) => {
    if (existingPositions[y][x]) valid = false; // Check this specific spot
    if (!adjacentShipsAllowable && existingPositions[Math.max(0, y - 1)][x]) valid = false; // Check row above
    if (!adjacentShipsAllowable && existingPositions[Math.min(9, y + 1)][x]) valid = false; // Check row below
    if (!adjacentShipsAllowable && existingPositions[y][Math.max(0, x - 1)]) valid = false; // Check column to left
    if (!adjacentShipsAllowable && existingPositions[y][Math.min(9, x + 1)]) valid = false; // Check column to right
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
            positions[proposedPositions.startingRow][i] = ship.name;
          }
        } else {
          // vertical placement
          for (let i = proposedPositions.startingRow; i < proposedPositions.startingRow + ship.size; i++) {
            positions[i][proposedPositions.startingColumn] = ship.name;
          }
        }
      }
    }
  });

  return positions;
};
