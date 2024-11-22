export function initialiseShipArray() {
  let array = [];
  for (let i = 0; i < 10; i++) {
    array[i] = new Array(10).fill(null);
  }
  return array;
}

type Ship = 'carrier' | 'battleship' | 'cruiser' | 'submarine' | 'destroyer';

const shipSizes: Record<Ship, number> = {
  carrier: 5,
  battleship: 4,
  cruiser: 3,
  submarine: 3,
  destroyer: 2,
};

const computerShips: Record<Ship, string[]> = {
  carrier: [],
  battleship: [],
  cruiser: [],
  submarine: [],
  destroyer: [],
};

const rowNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export const placeShips = () => {
  // TODO - allow for horizontal and vertical
  // Starting with horizontal as this one is the easiest
  const axis = 'horizontal';

  (Object.keys(computerShips) as (keyof typeof computerShips)[]).forEach((ship) => {
    computerShips[ship] = [];

    const row = Math.floor(Math.random() * 10);
    const startingColumn = Math.floor(Math.random() * (10 - shipSizes[ship]));

    for (let i = 0; i < shipSizes[ship]; i++) {
      computerShips[ship].push(`${rowNames[row]}${startingColumn + i}`);
    }
  });

  console.log('Final positions for all ships:', computerShips);
};
