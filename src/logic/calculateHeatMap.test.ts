import {
  calculateHeatMap,
  generateMatchingBoard,
  initialiseHeatMapArray,
  shipSpaceIsAvailable,
} from './calculateHeatMap';
import { initialiseShipArray } from './placeShips';
import { CellStates, PositionArray, ShipNames } from '../types';
import { shipTypes } from '../App';

let heatMapIterations = 100;

jest.mock('../ai-behaviour', () => ({
  ai: {
    heatMapSimulations: heatMapIterations,
    adjacentShipModifier: 0,
  },
}));

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
});

describe('initialiseHeatMap', () => {
  test('should return a 10x10 array of zeroes', () => {
    const heatMap = initialiseHeatMapArray();
    expect(heatMap).toHaveLength(10);
    heatMap.forEach((row) => {
      expect(row).toHaveLength(10);
      expect(row.every((value) => value === 0)).toBe(true);
    });
  });
});

describe('calculateHeatMap', () => {
  test('should return 100% for cells that are hits', () => {
    const board = initialiseShipArray();
    board[4][5] = { name: 'destroyer', status: CellStates.hit };

    const heatMap = calculateHeatMap(board);
    expect(heatMap[4][5]).toBe(heatMapIterations);
  });

  test('should return 0% for cells that are misses', () => {
    const board = initialiseShipArray();
    board[4][5] = { name: null, status: CellStates.miss };

    const heatMap = calculateHeatMap(board);
    expect(heatMap[4][5]).toBe(0);
  });

  test('miss cells should not have heat, even when adjacent to hit cells', () => {
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

  test('On an empty board, corner cells should have less heat than the middle cells', () => {
    const board = initialiseShipArray();

    const heatMap = calculateHeatMap(board);
    expect(heatMap[0][0]).toBeLessThan(heatMap[4][4]);
    expect(heatMap[0][9]).toBeLessThan(heatMap[4][4]);
    expect(heatMap[9][0]).toBeLessThan(heatMap[4][4]);
    expect(heatMap[9][9]).toBeLessThan(heatMap[4][4]);
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

  test('should mark misses as zero probability', () => {
    const existingBoard = Array(10)
      .fill(null)
      .map(() => Array(10).fill(null));
    existingBoard[0][0] = { status: CellStates.miss };

    const result = calculateHeatMap(existingBoard);
    expect(result[0][0]).toBe(0);
  });

  test('should generate higher probabilities near hits', () => {
    const existingBoard = Array(10)
      .fill(null)
      .map(() => Array(10).fill(null));
    existingBoard[5][5] = { status: CellStates.hit };

    const result = calculateHeatMap(existingBoard);
    expect(result[5][4]).toBeGreaterThan(0);
    expect(result[5][6]).toBeGreaterThan(0);
    expect(result[4][5]).toBeGreaterThan(0);
    expect(result[6][5]).toBeGreaterThan(0);
  });
});

describe('initialiseHeatMapArray', () => {
  it('should create a 10x10 array filled with zeros', () => {
    const result = initialiseHeatMapArray();
    expect(result.length).toBe(10);
    expect(result[0].length).toBe(10);
    expect(result.every((row) => row.every((cell) => cell === 0))).toBe(true);
  });
});

describe('shipSpaceIsAvailable', () => {
  it('should return false if ship doesnt fit on board', () => {
    const result = shipSpaceIsAvailable({
      proposedPositions: {
        startingRow: 9,
        startingColumn: 9,
        alignment: 'horizontal',
      },
      shipSize: 2,
      existingPositions: Array(10)
        .fill(null)
        .map(() => Array(10).fill(null)),
    });
    expect(result).toBe(false);
  });

  it('should return false if space is occupied', () => {
    const existingPositions = Array(10)
      .fill(null)
      .map(() => Array(10).fill(null));
    existingPositions[0][1] = { name: 'ship', status: CellStates.unguessed };

    const result = shipSpaceIsAvailable({
      proposedPositions: {
        startingRow: 0,
        startingColumn: 0,
        alignment: 'horizontal',
      },
      shipSize: 2,
      existingPositions,
    });
    expect(result).toBe(false);
  });

  it('should return false if space contains a miss', () => {
    const existingBoard = Array(10)
      .fill(null)
      .map(() => Array(10).fill(null));
    existingBoard[0][1] = { status: CellStates.miss };

    const result = shipSpaceIsAvailable({
      proposedPositions: {
        startingRow: 0,
        startingColumn: 0,
        alignment: 'horizontal',
      },
      shipSize: 2,
      existingPositions: Array(10)
        .fill(null)
        .map(() => Array(10).fill(null)),
      existingBoard,
    });
    expect(result).toBe(false);
  });
});
