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

const rowNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export const placeShips = () => {
  // TODO - allow for horizontal and vertical
  // Starting with horizontal as this one is the easiesta

  const positions = initialiseShipArray();

  shipTypes.forEach((ship) => {
    const row = Math.floor(Math.random() * 10);
    // const startingColumn = Math.floor(Math.random() * 10 - ship.size);
    let startingColumn = Math.floor(Math.random() * 10);
    while (startingColumn < 0 || startingColumn > 10 - ship.size) {
      startingColumn = Math.floor(Math.random() * 10);
    }

    console.log(ship, row, startingColumn);
  });
};
