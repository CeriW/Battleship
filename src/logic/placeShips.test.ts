import { generateRandomPosition, checkValidShipState, initialiseShipArray, placeShips } from './placeShips';
import { CellStates } from '../types';

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

  test('Ships can reach top left corner', () => {
    const rowPositions = new Set();
    const colPositions = new Set();

    for (let i = 0; i < 100; i++) {
      const { startingRow, startingColumn } = generateRandomPosition({ name: 'destroyer', size: 2 }, 'horizontal');
      rowPositions.add(startingRow);
      colPositions.add(startingColumn);
    }

    expect(rowPositions.has(0)).toBe(true);
    expect(colPositions.has(0)).toBe(true);
  });

  test('Ships can reach bottom right corner', () => {
    const rowPositions = new Set();
    const colPositions = new Set();

    for (let i = 0; i < 100; i++) {
      const { startingRow, startingColumn } = generateRandomPosition({ name: 'destroyer', size: 1 }, 'horizontal');
      rowPositions.add(startingRow);
      colPositions.add(startingColumn);
    }

    expect(rowPositions.has(9)).toBe(true);
    expect(colPositions.has(9)).toBe(true);
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
  afterEach(() => {
    // Reset the module registry after each test
    jest.resetModules();
  });

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
    existingPositions[0][1] = { name: 'battleship', status: CellStates.miss };

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
    existingPositions[0][8] = { name: 'carrier', status: CellStates.miss };

    const props = {
      proposedPositions: { startingRow: 0, startingColumn: 6, alignment: 'horizontal' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
    };

    expect(checkValidShipState(props)).toBe(false);
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

  test('when adjacent ships are 100% allowed, returns true when a different ship is already in row below', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[1][0] = { name: 'submarine', status: CellStates.miss };

    const props = {
      proposedPositions: { startingRow: 0, startingColumn: 0, alignment: 'horizontal' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
      adjacentShipModifier: 1,
    };

    expect(checkValidShipState(props)).toBe(true);
  });

  test('when adjacent ships are not allowed, returns false when a different ship is already in row below', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[1][0] = { name: 'submarine', status: CellStates.miss };

    const props = {
      proposedPositions: { startingRow: 0, startingColumn: 0, alignment: 'horizontal' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
      adjacentShipModifier: 0,
    };

    expect(checkValidShipState(props)).toBe(false);
  });

  test('when adjacent ships are 100% allowed, returns true when a different ship is already in row above', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[1][0] = { name: 'submarine', status: CellStates.miss };

    const props = {
      proposedPositions: { startingRow: 2, startingColumn: 0, alignment: 'horizontal' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
      adjacentShipModifier: 1,
    };

    expect(checkValidShipState(props)).toBe(true);
  });

  test('when adjacent ships are not allowed, returns false when a different ship is already in row above', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[1][0] = { name: 'submarine', status: CellStates.miss };

    const props = {
      proposedPositions: { startingRow: 2, startingColumn: 0, alignment: 'horizontal' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
      adjacentShipModifier: 0,
    };

    expect(checkValidShipState(props)).toBe(false);
  });

  test('when adjacent ships are 100% allowed, returns true when a different ship is already in column to left', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[1][0] = { name: 'submarine', status: CellStates.miss };

    const props = {
      proposedPositions: { startingRow: 1, startingColumn: 1, alignment: 'horizontal' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
      adjacentShipModifier: 1,
    };

    expect(checkValidShipState(props)).toBe(true);
  });

  test('when adjacent ships are not allowed, returns false when a different ship is already in column to left', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[1][0] = { name: 'submarine', status: CellStates.miss };

    const props = {
      proposedPositions: { startingRow: 1, startingColumn: 1, alignment: 'horizontal' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
      adjacentShipModifier: 0,
    };

    expect(checkValidShipState(props)).toBe(false);
  });

  test('when adjacent ships are 100% allowed, returns true when a different ship is already in column to right', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[1][4] = { name: 'submarine', status: CellStates.miss };

    const props = {
      proposedPositions: { startingRow: 1, startingColumn: 1, alignment: 'horizontal' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
      adjacentShipModifier: 1,
    };

    expect(checkValidShipState(props)).toBe(true);
  });

  test('when adjacent ships are not allowed, returns false when a different ship is already in column to right', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[1][4] = { name: 'submarine', status: CellStates.miss };

    const props = {
      proposedPositions: { startingRow: 1, startingColumn: 1, alignment: 'horizontal' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
      adjacentShipModifier: 0,
    };

    expect(checkValidShipState(props)).toBe(false);
  });

  test('should return true for a 1 tile long ship in top left corner', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[0][1] = { name: 'submarine', status: CellStates.hit };
    existingPositions[1][0] = { name: 'submarine', status: CellStates.hit };

    const props = {
      proposedPositions: { startingRow: 0, startingColumn: 0, alignment: 'horizontal' as 'horizontal' | 'vertical' },
      shipSize: 1,
      existingPositions,
      adjacentShipModifier: 1,
    };

    expect(checkValidShipState(props)).toBe(true);
  });

  test('should return true for a 1 tile long ship in bottom right corner', () => {
    let existingPositions = initialiseShipArray();

    const props = {
      proposedPositions: { startingRow: 9, startingColumn: 9, alignment: 'horizontal' as 'horizontal' | 'vertical' },
      shipSize: 1,
      existingPositions,
      adjacentShipModifier: 1,
    };

    expect(checkValidShipState(props)).toBe(true);
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
    existingPositions[1][0] = { name: 'battleship', status: CellStates.miss };

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
    existingPositions[0][6] = { name: 'carrier', status: CellStates.miss };

    const props = {
      proposedPositions: { startingRow: 0, startingColumn: 6, alignment: 'vertical' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
    };

    expect(checkValidShipState(props)).toBe(false);
  });

  test('returns false when ship size exceeds board boundaries', () => {
    let existingPositions = initialiseShipArray();

    const props = {
      proposedPositions: { startingRow: 8, startingColumn: 0, alignment: 'vertical' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
    };

    const result = checkValidShipState(props);
    expect(result).toBe(false);
  });

  test('when adjacent ships are 100% allowed, returns true when a different ship is already in row below', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[3][0] = { name: 'submarine', status: CellStates.miss };

    const props = {
      proposedPositions: { startingRow: 0, startingColumn: 0, alignment: 'vertical' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
      adjacentShipModifier: 1,
    };

    expect(checkValidShipState(props)).toBe(true);
  });

  test('when adjacent ships are not allowed, returns false when a different ship is already in row below', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[3][0] = { name: 'submarine', status: CellStates.miss };

    const props = {
      proposedPositions: { startingRow: 0, startingColumn: 0, alignment: 'vertical' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
      adjacentShipModifier: 0,
    };

    expect(checkValidShipState(props)).toBe(false);
  });

  test('when adjacent ships are 100% allowed, returns true when a different ship is already in row above', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[0][0] = { name: 'submarine', status: CellStates.miss };

    const props = {
      proposedPositions: { startingRow: 1, startingColumn: 0, alignment: 'vertical' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
      adjacentShipModifier: 1,
    };

    expect(checkValidShipState(props)).toBe(true);
  });

  test('when adjacent ships are not allowed, returns false when a different ship is already in row above', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[0][0] = { name: 'submarine', status: CellStates.miss };

    const props = {
      proposedPositions: { startingRow: 1, startingColumn: 0, alignment: 'vertical' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
      adjacentShipModifier: 0,
    };

    expect(checkValidShipState(props)).toBe(false);
  });

  test('when adjacent ships are 100% allowed, returns true when a different ship is already in column to left', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[1][0] = { name: 'submarine', status: CellStates.miss };

    const props = {
      proposedPositions: { startingRow: 1, startingColumn: 1, alignment: 'horizontal' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
      adjacentShipModifier: 1,
    };

    expect(checkValidShipState(props)).toBe(true);
  });

  test('when adjacent ships are not allowed, returns false when a different ship is already in column to left', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[1][0] = { name: 'submarine', status: CellStates.miss };

    const props = {
      proposedPositions: { startingRow: 1, startingColumn: 1, alignment: 'horizontal' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
      adjacentShipModifier: 0,
    };

    expect(checkValidShipState(props)).toBe(false);
  });

  test('when adjacent ships are 100% allowed, returns true when a different ship is already in column to right', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[1][4] = { name: 'submarine', status: CellStates.miss };

    const props = {
      proposedPositions: { startingRow: 1, startingColumn: 1, alignment: 'horizontal' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
      adjacentShipModifier: 1,
    };

    expect(checkValidShipState(props)).toBe(true);
  });

  test('when adjacent ships are not allowed, returns false when a different ship is already in column to right', () => {
    let existingPositions = initialiseShipArray();
    existingPositions[1][4] = { name: 'submarine', status: CellStates.miss };

    const props = {
      proposedPositions: { startingRow: 1, startingColumn: 1, alignment: 'horizontal' as 'horizontal' | 'vertical' },
      shipSize: 3,
      existingPositions,
      adjacentShipModifier: 0,
    };

    expect(checkValidShipState(props)).toBe(false);
  });
});

describe('placeShips', () => {
  test('each ship appears the correct number of times on the board', () => {
    for (let i = 0; i < 100; i++) {
      const positions = placeShips().flat();
      expect(positions.filter((ship) => ship?.name === 'carrier')).toHaveLength(5);
      expect(positions.filter((ship) => ship?.name === 'battleship')).toHaveLength(4);
      expect(positions.filter((ship) => ship?.name === 'cruiser')).toHaveLength(3);
      expect(positions.filter((ship) => ship?.name === 'submarine')).toHaveLength(3);
      expect(positions.filter((ship) => ship?.name === 'destroyer')).toHaveLength(2);
    }
  });
});
