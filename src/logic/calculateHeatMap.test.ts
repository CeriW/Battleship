import {
  calculateHeatMap,
  generateMatchingBoard,
  generateValidShipPlacement,
  initialiseHeatMapArray,
  shipSpaceIsAvailable,
} from './calculateHeatMap';
import { initialiseShipArray } from './placeShips';
import { CellStates, PositionArray, ShipNames } from '../types';
import { shipTypes } from '../App';

describe('generateMatchingBoard', () => {
  test('generates a valid board with all ships placed', () => {
    const emptyBoard: PositionArray = Array(10)
      .fill(null)
      .map(() => Array(10).fill(0));
    const result = generateMatchingBoard(emptyBoard);

    const shipCells = result.flat().filter((cell) => cell && cell.name);
    expect(shipCells.length).toBe(17);
  });

  test('places ships on confirmed hits', () => {
    const boardWithHit: PositionArray = Array(10)
      .fill(null)
      .map(() => Array(10).fill(0));
    boardWithHit[0][0] = { name: 'destroyer' as ShipNames, status: CellStates.hit };

    const result = generateMatchingBoard(boardWithHit);
    expect(result[0][0]).toBeTruthy();
    expect(result[0][0]?.status).toBe(CellStates.unguessed);
  });

  test('does not place ships on confirmed misses', () => {
    const boardWithMiss: PositionArray = Array(10)
      .fill(null)
      .map(() => Array(10).fill(0));
    boardWithMiss[0][0] = { name: null, status: CellStates.miss };

    const result = generateMatchingBoard(boardWithMiss);
    expect(result[0][0]).toBeFalsy();
  });

  test('should generate a valid board with all ships placed', () => {
    const existingBoard = Array(10)
      .fill(null)
      .map(() => Array(10).fill(null));
    const result = generateMatchingBoard(existingBoard);

    // Count ships on board
    const shipCounts = new Map();
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const cell = result[y][x];
        if (cell?.name) {
          shipCounts.set(cell.name, (shipCounts.get(cell.name) || 0) + 1);
        }
      }
    }

    // Verify all ships are placed with correct sizes
    shipTypes.forEach((ship) => {
      expect(shipCounts.get(ship.name)).toBe(ship.size);
    });
  });

  test('should place ships on confirmed hits', () => {
    const existingBoard = Array(10)
      .fill(null)
      .map(() => Array(10).fill(null));
    existingBoard[0][0] = { status: CellStates.hit };
    existingBoard[0][1] = { status: CellStates.hit };

    const result = generateMatchingBoard(existingBoard);
    expect(result[0][0]?.name).toBeTruthy();
    expect(result[0][1]?.name).toBeTruthy();
  });

  test('should avoid placing ships on misses', () => {
    const existingBoard = Array(10)
      .fill(null)
      .map(() => Array(10).fill(null));
    existingBoard[0][0] = { status: CellStates.miss };

    const result = generateMatchingBoard(existingBoard);
    expect(result[0][0]).toBeFalsy();
  });

  test('should handle multiple hits in a row', () => {
    const existingBoard = Array(10)
      .fill(null)
      .map(() => Array(10).fill(null));
    existingBoard[0][0] = { status: CellStates.hit };
    existingBoard[0][1] = { status: CellStates.hit };
    existingBoard[0][2] = { status: CellStates.hit };

    const result = generateMatchingBoard(existingBoard);
    expect(result[0][0]?.name).toBeTruthy();
    expect(result[0][1]?.name).toBeTruthy();
    expect(result[0][2]?.name).toBeTruthy();
  });

  test('should handle hits in different directions', () => {
    const existingBoard = Array(10)
      .fill(null)
      .map(() => Array(10).fill(null));
    existingBoard[0][0] = { status: CellStates.hit };
    existingBoard[1][0] = { status: CellStates.hit };

    const result = generateMatchingBoard(existingBoard);
    expect(result[0][0]?.name).toBeTruthy();
    expect(result[1][0]?.name).toBeTruthy();
  });
});

describe('generateValidShipPlacement', () => {
  test('returns number between 0 and 9', () => {
    const result = generateValidShipPlacement(5, 5, 'horizontal');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(9);
  });

  test('for horizontal ship in first column, always returns 0', () => {
    const result = generateValidShipPlacement(0, 5, 'horizontal');
    expect(result).toBe(0);
  });

  test('for horizontal ship in last column, cannot exist in first 5 columns', () => {
    // A 5 long ship in last column will always start in column 5 (occupying columns 5, 6, 7, 8, 9)
    const result = generateValidShipPlacement(9, 5, 'horizontal');
    expect(result).toBeGreaterThanOrEqual(5);
  });

  test('for vertical ship in first row, always returns 0', () => {
    const result = generateValidShipPlacement(0, 5, 'vertical');
    expect(result).toBe(0);
  });

  test('for vertical ship in last row, cannot exist in first 5 rows', () => {
    // A 5 long ship in last column will always start in column 5 (occupying columns 5, 6, 7, 8, 9)
    const result = generateValidShipPlacement(9, 5, 'vertical');
    expect(result).toBeGreaterThanOrEqual(5);
  });
});

describe('initialiseHeatMap', () => {
  test('should return a 10x10 array of zeroes', () => {
    const heatMap = initialiseHeatMapArray();
    expect(heatMap).toHaveLength(10);
    heatMap.forEach((row) => {
      expect(row).toHaveLength(10);
      expect(row.every((value) => value === 1)).toBe(true);
    });
  });
});

describe('calculateHeatMap', () => {
  test('should return 100% for cells that are hits', () => {
    const board = initialiseShipArray();
    board[4][5] = { name: 'destroyer', status: CellStates.hit };
    const heatMap = calculateHeatMap(board);
    expect(heatMap[4][5]).toBe(400);
  });

  test('should return 0% for cells that are misses', () => {
    const board = initialiseShipArray();
    board[4][5] = { name: null, status: CellStates.miss };
    const heatMap = calculateHeatMap(board);
    expect(heatMap[4][5]).toBe(0);
  });

  test('miss cells should have 0% heat, even when adjacent to hit cells', () => {
    const board = initialiseShipArray();
    board[4][5] = { name: 'destroyer', status: CellStates.hit };
    board[4][6] = { name: null, status: CellStates.miss };
    board[4][4] = { name: null, status: CellStates.miss };
    board[3][5] = { name: null, status: CellStates.miss };
    board[5][5] = { name: null, status: CellStates.miss };
    const heatMap = calculateHeatMap(board);
    expect(heatMap[4][6]).toBe(0);
    expect(heatMap[4][4]).toBe(0);
    expect(heatMap[3][5]).toBe(0);
    expect(heatMap[5][5]).toBe(0);
  });

  test('a single unguessed cell surrounded by misses should have a heat of 0', () => {
    const board = initialiseShipArray();
    const x = 5;
    const y = 5;
    board[y][x] = { name: null, status: CellStates.unguessed };
    board[y][x + 1] = { name: null, status: CellStates.miss };
    board[y][x - 1] = { name: null, status: CellStates.miss };
    board[y + 1][x] = { name: null, status: CellStates.miss };
    board[y - 1][x] = { name: null, status: CellStates.miss };
    const heatMap = calculateHeatMap(board);
    expect(heatMap[4][5]).toBe(0);
  });

  test('heat radiates outwards from hits', () => {
    const board = initialiseShipArray();

    const x = 5;
    const y = 5;
    board[y][x] = { name: 'destroyer', status: CellStates.hit };
    board[y][x + 1] = { name: 'destroyer', status: CellStates.unguessed };

    const heatMap = calculateHeatMap(board);

    // The hit cell
    expect(heatMap[y][x]).toBe(400);

    // 1 is the value for a normal unguessed cell
    // Immediately adjacent unguessed cells should be at least 2
    expect(heatMap[y][x + 1]).toBeGreaterThanOrEqual(2);
    expect(heatMap[y][x - 1]).toBeGreaterThanOrEqual(2);
    expect(heatMap[y + 1][x]).toBeGreaterThanOrEqual(2);
    expect(heatMap[y - 1][x]).toBeGreaterThanOrEqual(2);

    // Cells adjacent to adjacent cells should be a little hotter than normal
    expect(heatMap[y][x + 2]).toBeGreaterThan(1);
    expect(heatMap[y][x - 2]).toBeGreaterThan(1);
    expect(heatMap[y + 2][x]).toBeGreaterThan(1);
    expect(heatMap[y - 2][x]).toBeGreaterThan(1);
  });

  test('a hit cell next to another hit cell should have a heat of 400', () => {
    const board = initialiseShipArray();
    board[4][5] = { name: 'destroyer', status: CellStates.hit };
    board[4][6] = { name: 'destroyer', status: CellStates.hit };
    const heatMap = calculateHeatMap(board);
    expect(heatMap[4][5]).toBe(400);
    expect(heatMap[4][6]).toBe(400);
  });

  test('cells next to a sunk ship should have default heat', () => {
    const board = initialiseShipArray();
    board[4][5] = { name: 'destroyer', status: CellStates.hit };
    board[4][6] = { name: 'destroyer', status: CellStates.hit };
    const heatMap = calculateHeatMap(board);
    expect(heatMap[4][5]).toBe(400);
    expect(heatMap[4][6]).toBe(400);
    expect(heatMap[4][4]).toBe(1);
    expect(heatMap[4][7]).toBe(1);
    expect(heatMap[3][5]).toBe(1);
    expect(heatMap[3][6]).toBe(1);
  });

  test('cells next to a miss should be cooler', () => {
    const board = initialiseShipArray();

    const x = 4;
    const y = 4;
    board[y][x] = { name: null, status: CellStates.miss };
    const heatMap = calculateHeatMap(board);

    expect(heatMap[y][x]).toBe(0);
    expect(heatMap[y][x + 1]).toBe(0.75);
    expect(heatMap[y][x - 1]).toBe(0.75);
    expect(heatMap[y + 1][x]).toBe(0.75);
    expect(heatMap[y - 1][x]).toBe(0.75);
  });

  test('a miss cell next to a hit cell should have a heat of 0', () => {
    const board = initialiseShipArray();
    board[4][5] = { name: 'destroyer', status: CellStates.hit };
    board[4][6] = { name: null, status: CellStates.miss };
    const heatMap = calculateHeatMap(board);
    expect(heatMap[4][6]).toBe(0);
  });

  test('two horizontal hits then unguessed and empty cells should have appropriate heat', () => {
    const board = initialiseShipArray();
    board[4][5] = { name: 'carrier', status: CellStates.hit };
    board[4][6] = { name: 'carrier', status: CellStates.hit };
    board[4][7] = { name: 'carrier', status: CellStates.unguessed }; // Unguessed cell ensures isShipSunk returns false

    const heatMap = calculateHeatMap(board);
    expect(heatMap[4][5]).toBe(400);
    expect(heatMap[4][6]).toBe(400);

    // Cells to right
    expect(heatMap[4][7]).toBeGreaterThan(2);
    expect(heatMap[4][8]).toBeGreaterThanOrEqual(2);
    expect(heatMap[4][7]).toBeGreaterThanOrEqual(heatMap[4][8]);

    // Cells to left
    expect(heatMap[4][4]).toBeGreaterThan(2);
    expect(heatMap[4][3]).toBeGreaterThan(2);
    expect(heatMap[4][4]).toBeGreaterThan(heatMap[4][3]);
  });

  test('two vertical hits then unguessed and empty cells should have appropriate heat', () => {
    const board = initialiseShipArray();
    board[4][5] = { name: 'carrier', status: CellStates.hit };
    board[5][5] = { name: 'carrier', status: CellStates.hit };
    board[6][5] = { name: 'carrier', status: CellStates.unguessed }; // Unguessed cell ensures isShipSunk returns false

    const heatMap = calculateHeatMap(board);
    expect(heatMap[4][5]).toBe(400);
    expect(heatMap[5][5]).toBe(400);

    // Cells to right
    expect(heatMap[6][5]).toBeGreaterThan(2);
    expect(heatMap[7][5]).toBeGreaterThan(2);
    expect(heatMap[6][5]).toBeGreaterThan(heatMap[7][5]);

    // Cells to left
    expect(heatMap[4][5]).toBeGreaterThan(2);
    expect(heatMap[3][5]).toBeGreaterThan(2);
    expect(heatMap[4][5]).toBeGreaterThan(heatMap[3][5]);
  });

  test('two horizontal misses then empty cells should have appropriate cooling', () => {
    const board = initialiseShipArray();
    board[4][5] = { name: null, status: CellStates.miss };
    board[4][6] = { name: null, status: CellStates.miss };

    const heatMap = calculateHeatMap(board);
    expect(heatMap[4][5]).toBe(0);
    expect(heatMap[4][6]).toBe(0);

    // Cells to right
    expect(heatMap[4][7]).toBeLessThanOrEqual(0.75);
    expect(heatMap[4][8]).toBeLessThanOrEqual(0.75);
    expect(heatMap[4][7]).toBeLessThanOrEqual(heatMap[4][8]);

    // Cells to left
    expect(heatMap[4][4]).toBeLessThanOrEqual(0.75);
    expect(heatMap[4][3]).toBeLessThanOrEqual(0.75);
    expect(heatMap[4][4]).toBeLessThanOrEqual(heatMap[4][3]);
  });

  test('two vertical misses then unguessed should have appropriate cooling', () => {
    const board = initialiseShipArray();
    board[4][5] = { name: null, status: CellStates.miss };
    board[5][5] = { name: null, status: CellStates.miss };

    const heatMap = calculateHeatMap(board);
    expect(heatMap[4][5]).toBe(0);
    expect(heatMap[5][5]).toBe(0);

    // Cells to right
    expect(heatMap[6][5]).toBeLessThanOrEqual(0.75);
    expect(heatMap[7][5]).toBeLessThanOrEqual(0.75);
    expect(heatMap[6][5]).toBeLessThanOrEqual(heatMap[7][5]);

    // Cells to left
    expect(heatMap[4][5]).toBeLessThanOrEqual(0.75);
    expect(heatMap[3][5]).toBeLessThanOrEqual(0.75);
    expect(heatMap[4][5]).toBeLessThanOrEqual(heatMap[3][5]);
  });

  test('a hit and adjacent misses to retain max/min heat', () => {
    const board = initialiseShipArray();

    board[4][5] = { name: 'destroyer', status: CellStates.hit };

    board[4][6] = { name: null, status: CellStates.miss }; // to right
    board[4][4] = { name: null, status: CellStates.miss }; // to left

    board[3][5] = { name: null, status: CellStates.miss }; // above
    board[5][5] = { name: null, status: CellStates.miss }; // below

    const heatMap = calculateHeatMap(board);
    expect(heatMap[4][5]).toBe(400);
    expect(heatMap[4][6]).toBe(0);
    expect(heatMap[4][4]).toBe(0);
    expect(heatMap[3][5]).toBe(0);
    expect(heatMap[5][5]).toBe(0);
  });
});
