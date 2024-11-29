import { generateRandomPosition } from './placeShips';

describe('generateRandomShipPosition', () => {
  test('should ensure the startingColumn leaves enough space for the ship', () => {
    const { startingColumn } = generateRandomPosition({ name: 'cruiser', size: 4 });
    expect(startingColumn).toBeLessThanOrEqual(5);
  });

  test('should return a row and startingColumn within the board bounds', () => {
    const { row, startingColumn } = generateRandomPosition({ name: 'cruiser', size: 3 });

    expect(row).toBeGreaterThanOrEqual(0);
    expect(row).toBeLessThan(10);
    expect(startingColumn).toBeGreaterThanOrEqual(0);
    expect(startingColumn).toBeLessThanOrEqual(9);
  });

  test('should handle ships of size 1 correctly', () => {
    const { row, startingColumn } = generateRandomPosition({ name: 'cruiser', size: 1 });

    expect(row).toBeGreaterThanOrEqual(0);
    expect(row).toBeLessThan(10);
    expect(startingColumn).toBeGreaterThanOrEqual(0);
    expect(startingColumn).toBeLessThan(10);
  });

  test('a theoretical size 10 ship should only be able to start in column 0', () => {
    const shipPosition = generateRandomPosition({ name: 'cruiser', size: 10 });
    expect(shipPosition.startingColumn).toBe(0);
  });

  test('should generate random positions for the same ship size', () => {
    const positions = new Set();

    for (let i = 0; i < 100; i++) {
      const position = generateRandomPosition({ name: 'cruiser', size: 3 });
      positions.add(`${position.row}-${position.startingColumn}`);
    }

    expect(positions.size).toBeGreaterThan(1);
  });
});
