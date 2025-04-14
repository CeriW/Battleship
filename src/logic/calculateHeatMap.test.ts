import {
  calculateHeatMap,
  initialiseHeatMapArray,
  isAdjacentToHit,
  checkValidShipPlacement,
  markEdgesColder,
  markSunkAdjacentColder,
  HeatValues,
} from './calculateHeatMap';
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

describe('markEdgesColder', () => {
  test('edges should be cooler', () => {
    const board = initialiseShipArray();
    const cooledBoard = markEdgesColder(initialiseHeatMapArray(), board);

    for (let x = 1; x < 9; x++) {
      expect(cooledBoard[0][x]).toBe(0.7);
      expect(cooledBoard[9][x]).toBe(0.7);
    }

    for (let y = 1; y < 9; y++) {
      expect(cooledBoard[y][0]).toBe(0.7);
      expect(cooledBoard[y][9]).toBe(0.7);
    }

    // Corners
    expect(cooledBoard[0][0]).toBe(0.48999999999999994);
    expect(cooledBoard[0][9]).toBe(0.48999999999999994);
    expect(cooledBoard[9][0]).toBe(0.48999999999999994);
    expect(cooledBoard[9][9]).toBe(0.48999999999999994);
  });
});

describe('markSunkAdjacentColder', () => {
  test('should mark cells of sunk ships cooler', () => {
    const board = initialiseShipArray();
    const heatMap = initialiseHeatMapArray();

    // Place a destroyer (size 2) horizontally and mark both cells as hit
    board[4][5] = { name: 'destroyer', status: CellStates.hit };
    board[4][6] = { name: 'destroyer', status: CellStates.hit };

    // Set initial heat values
    heatMap[4][5] = 2;
    heatMap[4][6] = 2;

    const cooledBoard = markSunkAdjacentColder(heatMap, board);

    // The cells of the sunk ship should have their heat reduced by the multiplier (0.6)
    expect(cooledBoard[4][5]).toBe(1.2); // 2 * 0.6
    expect(cooledBoard[4][6]).toBe(1.2); // 2 * 0.6
  });

  test('should not affect cells that are not part of sunk ships', () => {
    const board = initialiseShipArray();
    const heatMap = initialiseHeatMapArray();

    // Place a destroyer (size 2) horizontally with one hit and one unguessed
    board[4][5] = { name: 'destroyer', status: CellStates.hit };
    board[4][6] = { name: 'destroyer', status: CellStates.unguessed };

    // Set initial heat values
    heatMap[4][5] = 2;
    heatMap[4][6] = 2;

    const cooledBoard = markSunkAdjacentColder(heatMap, board);

    // The cells should not be affected since the ship is not sunk
    expect(cooledBoard[4][5]).toBe(2);
    expect(cooledBoard[4][6]).toBe(2);
  });

  test('should not affect hit cells', () => {
    const board = initialiseShipArray();
    const heatMap = initialiseHeatMapArray();

    // Place a destroyer (size 2) horizontally and mark both cells as hit
    board[4][5] = { name: 'destroyer', status: CellStates.hit };
    board[4][6] = { name: 'destroyer', status: CellStates.hit };

    // Set initial heat values
    heatMap[4][5] = HeatValues.hit; // Hit cell
    heatMap[4][6] = 2;

    const cooledBoard = markSunkAdjacentColder(heatMap, board);

    // The hit cell should not be affected
    expect(cooledBoard[4][5]).toBe(HeatValues.hit);
    // The other cell should be cooled
    expect(cooledBoard[4][6]).toBe(1.2); // 2 * 0.6
  });
});

describe('calculateHeatMap', () => {
  test('should return 100% for cells that are hits', () => {
    const board = initialiseShipArray();
    board[4][5] = { name: 'destroyer', status: CellStates.hit };
    board[4][6] = { name: 'destroyer', status: CellStates.unguessed }; // Unguessed cell ensures isShipSunk returns false
    const heatMap = calculateHeatMap(board);
    expect(heatMap[4][5]).toBe(HeatValues.hit);
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
    expect(heatMap[y][x]).toBe(HeatValues.hit);

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

  test('a hit cell next to another hit cell should have a heat of 100', () => {
    const board = initialiseShipArray();
    board[4][5] = { name: 'destroyer', status: CellStates.hit };
    board[4][6] = { name: 'destroyer', status: CellStates.hit };
    board[4][7] = { name: 'destroyer', status: CellStates.unguessed }; // Unguessed cell ensures isShipSunk returns false

    const heatMap = calculateHeatMap(board);
    expect(heatMap[4][5]).toBe(HeatValues.hit);
    expect(heatMap[4][6]).toBe(HeatValues.hit);
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
    expect(heatMap[4][5]).toBe(HeatValues.hit);
    expect(heatMap[4][6]).toBe(HeatValues.hit);

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
    expect(heatMap[4][5]).toBe(HeatValues.hit);
    expect(heatMap[5][5]).toBe(HeatValues.hit);

    // Cells to right
    expect(heatMap[6][5]).toBeGreaterThan(2);
    expect(heatMap[7][5]).toBe(1.6);
    expect(heatMap[6][5]).toBeGreaterThan(heatMap[7][5]);

    // Cells to left
    expect(heatMap[4][5]).toBeGreaterThan(2);
    expect(heatMap[3][5]).toBe(4.6);
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

    board[0][0] = { name: 'destroyer', status: CellStates.unguessed }; // Unguessed cell ensures isShipSunk returns false
    board[4][5] = { name: 'destroyer', status: CellStates.hit };

    board[4][6] = { name: null, status: CellStates.miss }; // to right
    board[4][4] = { name: null, status: CellStates.miss }; // to left

    board[3][5] = { name: null, status: CellStates.miss }; // above
    board[5][5] = { name: null, status: CellStates.miss }; // below

    const heatMap = calculateHeatMap(board);
    expect(heatMap[4][5]).toBe(HeatValues.hit);
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

  test('should handle break statements in ship placement loops', () => {
    const board = initialiseShipArray();

    board[9][9] = { name: 'submarine', status: CellStates.unguessed }; // Unguessed cell ensures isShipSunk returns false
    board[8][9] = { name: 'destroyer', status: CellStates.unguessed }; // Unguessed cell ensures isShipSunk returns false

    // Create a scenario that will trigger break statements
    // Place a ship horizontally with a miss at the end
    board[0][1] = { name: 'destroyer', status: CellStates.hit };
    board[0][2] = { name: 'destroyer', status: CellStates.hit };
    board[0][3] = { name: null, status: CellStates.miss }; // This should trigger a break

    // Place a ship vertically with a miss at the end

    board[2][0] = { name: 'submarine', status: CellStates.hit };
    board[3][0] = { name: 'submarine', status: CellStates.hit };
    board[4][0] = { name: null, status: CellStates.miss }; // This should trigger a break

    const heatMap = calculateHeatMap(board);

    // Verify the heat map was calculated correctly
    expect(heatMap[0][1]).toBe(HeatValues.hit); // Hit cell
    expect(heatMap[0][2]).toBe(HeatValues.hit); // Hit cell
    expect(heatMap[0][3]).toBe(0); // Miss cell
    expect(heatMap[0][4]).toBe(0.494); // Adjacent to hit

    expect(heatMap[2][0]).toBe(HeatValues.hit); // Hit cell
    expect(heatMap[3][0]).toBe(HeatValues.hit); // Hit cell
    expect(heatMap[4][0]).toBe(0); // Miss cell
    expect(heatMap[5][0]).toBe(0.452); // Adjacent to hit
  });

  test('should handle break statements in ship space availability checks', () => {
    const board = initialiseShipArray();

    // Create a scenario that will trigger break statements in checkValidShipPlacement
    // Place a ship that would block other ships
    board[0][0] = { name: 'carrier', status: CellStates.hit };
    board[0][1] = { name: 'carrier', status: CellStates.hit };
    board[0][2] = { name: 'carrier', status: CellStates.hit };
    board[0][3] = { name: 'carrier', status: CellStates.hit };
    board[0][4] = { name: 'carrier', status: CellStates.hit };

    // This should trigger the break in checkValidShipPlacement
    const result = checkValidShipPlacement({
      proposedPositions: { startingRow: 0, startingColumn: 0, alignment: 'horizontal' },
      shipSize: 3,
      existingPositions: board,
    });

    expect(result).toBe(false);
  });

  test('should handle break statements in ship placement with adjacent ships', () => {
    const board = initialiseShipArray();

    // Create a scenario with ships placed adjacent to each other
    board[0][0] = { name: 'destroyer', status: CellStates.hit };
    board[0][1] = { name: 'destroyer', status: CellStates.hit };
    board[0][2] = { name: 'destroyer', status: CellStates.hit };

    board[1][0] = { name: 'submarine', status: CellStates.hit };
    board[1][1] = { name: 'submarine', status: CellStates.hit };
    board[1][2] = { name: 'submarine', status: CellStates.hit };

    // This should trigger the break in ship placement logic
    const result = checkValidShipPlacement({
      proposedPositions: { startingRow: 0, startingColumn: 0, alignment: 'horizontal' },
      shipSize: 3,
      existingPositions: board,
    });

    expect(result).toBe(false);
  });
});
