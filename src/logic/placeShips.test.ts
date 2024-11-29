import { generateRandomPosition } from './placeShips';

describe('generateRandomShipPosition', () => {
  test('a theoretical size 10 ship should only be able to start in column 0', () => {
    const shipPosition = generateRandomPosition({ name: 'cruiser', size: 10 });

    expect(shipPosition.startingColumn).toBe(0);
  });
});
