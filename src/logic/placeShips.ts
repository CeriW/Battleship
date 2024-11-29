export function initialiseShipArray() {
  let array = [];
  for (let i = 0; i < 10; i++) {
    array[i] = new Array(10).fill(null);
  }
  return array;
}

// type Ship = 'carrier' | 'battleship' | 'cruiser' | 'submarine' | 'destroyer';

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
// const shipSizes: Record<Ship, number> = {
//   carrier: 5,
//   battleship: 4,
//   cruiser: 3,
//   submarine: 3,
//   destroyer: 2,
// };

// const computerShips: Record<Ship, string[]> = {
//   carrier: [],
//   battleship: [],
//   cruiser: [],
//   submarine: [],
//   destroyer: [],
// };

// TODO - write tests for this function
const generateRandomPosition = (ship: ShipInfo): { row: number; startingColumn: number } => {
  const row = Math.floor(Math.random() * 10);
  let startingColumn = Math.floor(Math.random() * 10);

  while (startingColumn < 0 || startingColumn > 9 - ship.size) {
    startingColumn = Math.floor(Math.random() * 10);
  }

  console.log(ship, row, startingColumn);

  return { row, startingColumn };
};

// TODO - write a test for this function
// Check that for a proposed ship occupation, there are no overlaps with other ships
// Returns true if the state is valid and usable
const checkValidShipState = (props: {
  proposedPositions: { row: number; startingColumn: number };
  shipSize: number;
  existingPositions: any[][];
}) => {
  for (
    let i = props.proposedPositions.startingColumn;
    i < props.proposedPositions.startingColumn + props.shipSize;
    i++
  ) {
    if (props.existingPositions[props.proposedPositions.row][i]) {
      return false;
    }
  }
  return true;
};

// const rowNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

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
