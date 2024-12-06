import { generateRandomPosition, checkValidShipState, initialiseShipArray, placeShips } from './placeShips';

describe('generateRandomShipPosition', () => {
  test('should ensure the startingColumn leaves enough space for the ship', () => {
    for (let i = 0; i < 100; i++) {
      const { startingColumn } = generateRandomPosition({ name: 'cruiser', size: 4 });
      expect(startingColumn).toBeLessThanOrEqual(6);
    }
  });

  test('should return a row and startingColumn within the board bounds', () => {
    for (let i = 0; i < 100; i++) {
      const { row, startingColumn } = generateRandomPosition({ name: 'cruiser', size: 3 });

      expect(row).toBeGreaterThanOrEqual(0);
      expect(row).toBeLessThan(10);
      expect(startingColumn).toBeGreaterThanOrEqual(0);
      expect(startingColumn).toBeLessThanOrEqual(9);
    }
  });

  test('should handle ships of size 1 correctly', () => {
    for (let i = 0; i < 100; i++) {
      const { row, startingColumn } = generateRandomPosition({ name: 'cruiser', size: 1 });

      expect(row).toBeGreaterThanOrEqual(0);
      expect(row).toBeLessThan(10);
      expect(startingColumn).toBeGreaterThanOrEqual(0);
      expect(startingColumn).toBeLessThan(10);
    }
  });

  test('a theoretical size 10 ship should only be able to start in column 0', () => {
    for (let i = 0; i < 100; i++) {
      const shipPosition = generateRandomPosition({ name: 'cruiser', size: 10 });
      expect(shipPosition.startingColumn).toBe(0);
    }
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

describe('checkValidShipState', () => {
  test('returns true when there are no overlaps with other ships', () => {
    let existingPositions = initialiseShipArray();

    const props = {
      proposedPositions: { row: 0, startingColumn: 0 },
      shipSize: 3,
      existingPositions,
    };

    expect(checkValidShipState(props)).toBe(true);
  });

  test('returns false when the proposed positions overlap with existing ships', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[0][1] = 'battleship';

    const props = {
      proposedPositions: { row: 0, startingColumn: 0 },
      shipSize: 3,
      existingPositions,
    };

    expect(checkValidShipState(props)).toBe(false);
  });

  test('returns true when a ship is placed at the edge of the board without overlap', () => {
    let existingPositions = initialiseShipArray();

    const props = {
      proposedPositions: { row: 0, startingColumn: 6 },
      shipSize: 3,
      existingPositions,
    };

    expect(checkValidShipState(props)).toBe(true);
  });

  test('returns false when a ship overlaps another ship at the edge of the board', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[0][8] = 'carrier';

    const props = {
      proposedPositions: { row: 0, startingColumn: 6 },
      shipSize: 3,
      existingPositions,
    };

    expect(checkValidShipState(props)).toBe(false);
  });

  test('returns true when no ships overlap in different rows', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[1][0] = 'submarine';

    const props = {
      proposedPositions: { row: 0, startingColumn: 0 },
      shipSize: 3,
      existingPositions,
    };

    expect(checkValidShipState(props)).toBe(true);
  });

  test('returns false when ship size exceeds board boundaries', () => {
    let existingPositions = initialiseShipArray();

    const props = {
      proposedPositions: { row: 0, startingColumn: 8 },
      shipSize: 3,
      existingPositions,
    };

    const result = checkValidShipState(props);
    expect(result).toBe(false);
  });
});

describe('placeShips', () => {
  test('each ship appears the correct number of times on the board', () => {
    for (let i = 0; i < 100; i++) {
      const positions = placeShips().flat();
      expect(positions.filter((ship) => ship === 'carrier')).toHaveLength(5);
      expect(positions.filter((ship) => ship === 'battleship')).toHaveLength(4);
      expect(positions.filter((ship) => ship === 'cruiser')).toHaveLength(3);
      expect(positions.filter((ship) => ship === 'submarine')).toHaveLength(3);
      expect(positions.filter((ship) => ship === 'destroyer')).toHaveLength(2);
    }
  });
});
