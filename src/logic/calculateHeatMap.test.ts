import { calculateHeatMap, initialiseHeatMapArray, isAdjacentToHit } from './calculateHeatMap';
import { initialiseShipArray } from './placeShips';
import { CellStates } from '../types';

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
    expect(heatMap[y][x + 1]).toBe(0.42);
    expect(heatMap[y][x - 1]).toBe(0.36);
    expect(heatMap[y + 1][x]).toBe(0.36);
    expect(heatMap[y - 1][x]).toBe(0.36);
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
    expect(heatMap[4][8]).toBe(1.55);
    expect(heatMap[4][7]).toBeGreaterThanOrEqual(heatMap[4][8]);

    // Cells to left
    expect(heatMap[4][4]).toBeGreaterThan(2);
    expect(heatMap[4][3]).toBe(1.55);
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
    expect(heatMap[7][5]).toBe(1.6);
    expect(heatMap[6][5]).toBeGreaterThan(heatMap[7][5]);

    // Cells to left
    expect(heatMap[4][5]).toBeGreaterThan(2);
    expect(heatMap[3][5]).toBe(1.55);
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
    expect(heatMap[4][8]).toBeLessThanOrEqual(0.8);
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
    expect(heatMap[7][5]).toBeLessThanOrEqual(0.8);
    expect(heatMap[6][5]).toBeLessThanOrEqual(heatMap[7][5]);

    // Cells to left
    expect(heatMap[4][5]).toBeLessThanOrEqual(0.75);
    expect(heatMap[3][5]).toBeLessThanOrEqual(0.8);
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

  test('isAdjacentToHit returns true when there is an unsunk hit above', () => {
    const board = initialiseShipArray();
    board[3][5] = { name: 'destroyer', status: CellStates.hit };
    board[0][0] = { name: 'destroyer', status: CellStates.unguessed }; // required to ensure isShipSunk returns false
    expect(isAdjacentToHit(board, 5, 4)).toBe(true);
  });

  test('isAdjacentToHit returns true when there is an unsunk hit below', () => {
    const board = initialiseShipArray();
    board[5][5] = { name: 'destroyer', status: CellStates.hit };
    board[0][0] = { name: 'destroyer', status: CellStates.unguessed }; // required to ensure isShipSunk returns false

    expect(isAdjacentToHit(board, 5, 4)).toBe(true);
  });

  test('isAdjacentToHit returns true when there is an unsunk hit to the left', () => {
    const board = initialiseShipArray();
    board[4][4] = { name: 'destroyer', status: CellStates.hit };
    board[0][0] = { name: 'destroyer', status: CellStates.unguessed }; // required to ensure isShipSunk returns false

    expect(isAdjacentToHit(board, 5, 4)).toBe(true);
  });

  test('isAdjacentToHit returns true when there is an unsunk hit to the right', () => {
    const board = initialiseShipArray();
    board[4][6] = { name: 'destroyer', status: CellStates.hit };
    board[0][0] = { name: 'destroyer', status: CellStates.unguessed }; // required to ensure isShipSunk returns false
    expect(isAdjacentToHit(board, 5, 4)).toBe(true);
  });

  test('isAdjacentToHit returns false when there are no adjacent hits', () => {
    const board = initialiseShipArray();
    expect(isAdjacentToHit(board, 5, 4)).toBe(false);
  });

  test('isAdjacentToHit returns false when adjacent hit is from a sunk ship', () => {
    const board = initialiseShipArray();
    // Place a destroyer (size 2) horizontally and mark both cells as hit
    board[4][5] = { name: 'destroyer', status: CellStates.hit };
    board[4][6] = { name: 'destroyer', status: CellStates.hit };
    expect(isAdjacentToHit(board, 5, 4)).toBe(false);
  });
});
