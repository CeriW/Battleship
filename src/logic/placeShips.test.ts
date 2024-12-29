import { generateRandomPosition, checkValidShipState, initialiseShipArray, placeShips } from './placeShips';

describe('generateRandomShipPosition - horizontal', () => {
  test('should ensure the startingColumn leaves enough space for the ship', () => {
    for (let i = 0; i < 100; i++) {
      const { startingColumn } = generateRandomPosition({ name: 'cruiser', size: 4 }, 'horizontal');
      expect(startingColumn).toBeLessThanOrEqual(6);
    }
  });

  test('should return a startingRow and startingColumn within the board bounds', () => {
    for (let i = 0; i < 100; i++) {
      const { startingRow, startingColumn } = generateRandomPosition({ name: 'cruiser', size: 3 }, 'horizontal');

      expect(startingRow).toBeGreaterThanOrEqual(0);
      expect(startingRow).toBeLessThan(10);
      expect(startingColumn).toBeGreaterThanOrEqual(0);
      expect(startingColumn).toBeLessThanOrEqual(9);
    }
  });

  test('should handle ships of size 1 correctly', () => {
    for (let i = 0; i < 100; i++) {
      const { startingRow, startingColumn } = generateRandomPosition({ name: 'cruiser', size: 1 }, 'horizontal');

      expect(startingRow).toBeGreaterThanOrEqual(0);
      expect(startingRow).toBeLessThan(10);
      expect(startingColumn).toBeGreaterThanOrEqual(0);
      expect(startingColumn).toBeLessThan(10);
    }
  });

  test('a theoretical size 10 ship should only be able to start in column 0', () => {
    for (let i = 0; i < 100; i++) {
      const shipPosition = generateRandomPosition({ name: 'cruiser', size: 10 }, 'horizontal');
      expect(shipPosition.startingColumn).toBe(0);
    }
  });

  test('should generate random positions for the same ship size', () => {
    const positions = new Set();

    for (let i = 0; i < 100; i++) {
      const position = generateRandomPosition({ name: 'cruiser', size: 3 }, 'horizontal');
      positions.add(`${position.startingRow}-${position.startingColumn}`);
    }

    expect(positions.size).toBeGreaterThan(1);
  });
});

describe('generateRandomShipPosition - vertical', () => {
  test('should ensure the starting startingRow leaves enough space for the ship', () => {
    for (let i = 0; i < 100; i++) {
      const { startingRow } = generateRandomPosition({ name: 'cruiser', size: 4 }, 'vertical');
      expect(startingRow).toBeLessThanOrEqual(6);
    }
  });

  test('should return a startingRow and startingColumn within the board bounds', () => {
    for (let i = 0; i < 100; i++) {
      const { startingRow, startingColumn } = generateRandomPosition({ name: 'cruiser', size: 3 }, 'vertical');

      expect(startingRow).toBeGreaterThanOrEqual(0);
      expect(startingRow).toBeLessThan(10);
      expect(startingColumn).toBeGreaterThanOrEqual(0);
      expect(startingColumn).toBeLessThanOrEqual(9);
    }
  });

  test('should handle ships of size 1 correctly', () => {
    for (let i = 0; i < 100; i++) {
      const { startingRow, startingColumn } = generateRandomPosition({ name: 'cruiser', size: 1 }, 'vertical');

      expect(startingRow).toBeGreaterThanOrEqual(0);
      expect(startingRow).toBeLessThan(10);
      expect(startingColumn).toBeGreaterThanOrEqual(0);
      expect(startingColumn).toBeLessThan(10);
    }
  });

  test('a theoretical size 10 ship should only be able to start in startingRow 0', () => {
    for (let i = 0; i < 100; i++) {
      const shipPosition = generateRandomPosition({ name: 'cruiser', size: 10 }, 'vertical');
      expect(shipPosition.startingRow).toBe(0);
    }
  });

  test('should generate random positions for the same ship size', () => {
    const positions = new Set();

    for (let i = 0; i < 100; i++) {
      const position = generateRandomPosition({ name: 'cruiser', size: 3 }, 'vertical');
      positions.add(`${position.startingRow}-${position.startingColumn}`);
    }

    expect(positions.size).toBeGreaterThan(1);
  });
});

describe('checkValidShipState - horizontal', () => {
  test('returns true when there are no overlaps with other ships', () => {
    let existingPositions = initialiseShipArray();

    const props = {
      proposedPositions: { startingRow: 0, startingColumn: 0, alignment: 'horizontal' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
    };

    expect(checkValidShipState(props)).toBe(true);
  });

  test('returns false when the proposed positions overlap with existing ships', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[0][1] = 'battleship';

    const props = {
      proposedPositions: { startingRow: 0, startingColumn: 0, alignment: 'horizontal' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
    };

    expect(checkValidShipState(props)).toBe(false);
  });

  test('returns true when a ship is placed at the edge of the board without overlap', () => {
    let existingPositions = initialiseShipArray();

    const props = {
      proposedPositions: { startingRow: 0, startingColumn: 6, alignment: 'horizontal' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
    };

    expect(checkValidShipState(props)).toBe(true);
  });

  test('returns false when a ship overlaps another ship at the edge of the board', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[0][8] = 'carrier';

    const props = {
      proposedPositions: { startingRow: 0, startingColumn: 6, alignment: 'horizontal' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
    };

    expect(checkValidShipState(props)).toBe(false);
  });

  test('returns true when no ships overlap in different startingRows', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[1][0] = 'submarine';

    const props = {
      proposedPositions: { startingRow: 0, startingColumn: 0, alignment: 'horizontal' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
    };

    expect(checkValidShipState(props)).toBe(true);
  });

  test('returns false when ship size exceeds board boundaries', () => {
    let existingPositions = initialiseShipArray();

    const props = {
      proposedPositions: { startingRow: 0, startingColumn: 8, alignment: 'horizontal' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
    };

    const result = checkValidShipState(props);
    expect(result).toBe(false);
  });
});

describe('checkValidShipState - vertical', () => {
  test('returns true when there are no overlaps with other ships', () => {
    let existingPositions = initialiseShipArray();

    const props = {
      proposedPositions: { startingRow: 0, startingColumn: 0, alignment: 'vertical' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
    };

    expect(checkValidShipState(props)).toBe(true);
  });

  test('returns false when the proposed positions overlap with existing ships', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[1][0] = 'battleship';

    const props = {
      proposedPositions: { startingRow: 0, startingColumn: 0, alignment: 'vertical' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
    };

    expect(checkValidShipState(props)).toBe(false);
  });

  test('returns true when a ship is placed at the edge of the board without overlap', () => {
    let existingPositions = initialiseShipArray();

    const props = {
      proposedPositions: { startingRow: 0, startingColumn: 6, alignment: 'vertical' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
    };

    expect(checkValidShipState(props)).toBe(true);
  });

  test('returns false when a ship overlaps another ship at the edge of the board', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[0][6] = 'carrier';

    const props = {
      proposedPositions: { startingRow: 0, startingColumn: 6, alignment: 'vertical' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
    };

    expect(checkValidShipState(props)).toBe(false);
  });

  test('returns true when no ships overlap in different startingColumns', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[0][3] = 'submarine';

    const props = {
      proposedPositions: { startingRow: 0, startingColumn: 0, alignment: 'vertical' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
    };

    expect(checkValidShipState(props)).toBe(true);
  });

  test('returns false when ship size exceeds board boundaries', () => {
    let existingPositions = initialiseShipArray();

    const props = {
      proposedPositions: { startingRow: 0, startingColumn: 8, alignment: 'vertical' as 'horizontal' | 'vertical' },
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
