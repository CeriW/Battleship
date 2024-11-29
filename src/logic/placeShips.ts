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
export const generateRandomPosition = (ship: ShipInfo): { row: number; startingColumn: number } => {
  const row = Math.floor(Math.random() * 10);
  let startingColumn = Math.floor(Math.random() * 10);

  while (startingColumn < 0 || startingColumn > 10 - ship.size) {
    startingColumn = Math.floor(Math.random() * 10);
  }

  return { row, startingColumn };
};

// Check that for a proposed ship occupation, there are no overlaps with other ships
// Returns true if the state is valid and usable
export const checkValidShipState = ({
  proposedPositions,
  shipSize,
  existingPositions,
}: {
  proposedPositions: { row: number; startingColumn: number };
  shipSize: number;
  existingPositions: PositionArray;
}) => {
  for (let i = proposedPositions.startingColumn; i < proposedPositions.startingColumn + shipSize; i++) {
    if (existingPositions[proposedPositions.row][i] || proposedPositions.startingColumn + shipSize) {
      return false;
    }
  }
  return true;
};

// TODO - write tests
export const placeShips = () => {
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
        for (let i = proposedPositions.startingColumn; i < proposedPositions.startingColumn + ship.size; i++) {
          positions[proposedPositions.row][i] = ship.name;
        }
      }
    }
  });

  console.log(positions);
};
