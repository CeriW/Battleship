import { ai } from '../ai-behaviour';

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
}: {
  proposedPositions: { startingRow: number; startingColumn: number; alignment: 'horizontal' | 'vertical' };
  shipSize: number;
  existingPositions: PositionArray;
}): boolean => {
  // First check if ship would go out of bounds
  if (proposedPositions.alignment === 'horizontal' && proposedPositions.startingColumn + shipSize > 10) return false;
  if (proposedPositions.alignment === 'vertical' && proposedPositions.startingRow + shipSize > 10) return false;

  // Then check for overlaps
  if (proposedPositions.alignment === 'horizontal') {
    // Whether to check adjacent spots, depending on AI difficulty
    const start = Math.max(
      ai.willPlaceShipsNextToEachOther ? proposedPositions.startingColumn : proposedPositions.startingColumn - 1,
      0
    );
    const end = Math.min(
      ai.willPlaceShipsNextToEachOther
        ? proposedPositions.startingColumn + shipSize
        : proposedPositions.startingColumn + shipSize + 1,
      10
    );

    for (let i = start; i < end; i++) {
      // Check for existing ship in this specific spot
      if (existingPositions[proposedPositions.startingRow][i]) return false;

      //  Check row above (if difficulty allows)
      if (
        !ai.willPlaceShipsNextToEachOther &&
        proposedPositions.startingRow > 0 &&
        existingPositions[proposedPositions.startingRow - 1][i]
      )
        return false;

      //  Check row below (if difficulty allows)
      if (
        !ai.willPlaceShipsNextToEachOther &&
        proposedPositions.startingRow < 9 &&
        existingPositions[proposedPositions.startingRow + 1][i]
      )
        return false;
    }
  } else {
    // Whether to check adjacent spots, depending on AI difficulty
    const start = Math.max(
      ai.willPlaceShipsNextToEachOther ? proposedPositions.startingRow : proposedPositions.startingRow - 1,
      0
    );
    const end = Math.min(
      ai.willPlaceShipsNextToEachOther
        ? proposedPositions.startingRow + shipSize
        : proposedPositions.startingRow + shipSize + 1,
      10
    );

    //  Check for existing ships in these spots.
    for (let i = start; i < end; i++) {
      if (existingPositions[i][proposedPositions.startingColumn]) return false;

      // Ensure column index is within bounds
      if (
        !ai.willPlaceShipsNextToEachOther &&
        proposedPositions.startingColumn > 0 &&
        existingPositions[i][proposedPositions.startingColumn - 1]
      )
        return false;
    }
  }
  return true;
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
