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
  alignment = (Math.random() > 0.5 ? 'horizontal' : 'vertical') as 'horizontal' | 'vertical' // For testing purposes only
): { startingRow: number; startingColumn: number; alignment: 'horizontal' | 'vertical' } => {
  let startingRow, startingColumn;

  if (alignment === 'horizontal') {
    startingRow = Math.floor(Math.random() * 10);
    startingColumn = Math.floor(Math.random() * ship.size);

    while (startingColumn > 10 - ship.size) {
      startingColumn = Math.floor(Math.random() * ship.size);
    }
  } else {
    startingRow = Math.floor(Math.random() * 10);
    startingColumn = Math.floor(Math.random() * ship.size);

    while (startingRow > 10 - ship.size) {
      startingRow = Math.floor(Math.random() * 10);
    }
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
  if (proposedPositions.alignment === 'horizontal') {
    // Starting at the initial column and looping until it reaches the end,
    // If there's something in that cell, or i goes outside of the board bounds, return false
    for (let i = proposedPositions.startingColumn; i < proposedPositions.startingColumn + shipSize; i++) {
      if (existingPositions[proposedPositions.startingRow][i] || proposedPositions.startingColumn + shipSize > 9) {
        return false;
      }
    }
    return true;
  }

  // alignment === 'vertical
  // Starting at the initial row and looping until it reaches the end,
  // If there's something in that cell, or i goes outside of the board bounds, return false
  for (let i = proposedPositions.startingRow; i < proposedPositions.startingRow + shipSize; i++) {
    if (existingPositions[i][proposedPositions.startingColumn] || proposedPositions.startingColumn + shipSize > 9) {
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

  console.log(positions);
  return positions;
};
