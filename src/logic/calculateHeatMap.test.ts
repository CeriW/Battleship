import { calculateHeatMap, generateMatchingBoard, initialiseHeatMapArray } from './calculateHeatMap';
import { initialiseShipArray } from './placeShips';
import { CellStates, PositionArray } from '../types';

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
    boardWithHit[0][0] = { name: 'test', status: CellStates.hit };

    const result = generateMatchingBoard(boardWithHit);
    expect(result[0][0]).toBeTruthy();
    expect(result[0][0].status).toBe(CellStates.unguessed);
  });

  test('does not place ships on confirmed misses', () => {
    const boardWithMiss: PositionArray = Array(10)
      .fill(null)
      .map(() => Array(10).fill(0));
    boardWithMiss[0][0] = { name: null, status: CellStates.miss };

    const result = generateMatchingBoard(boardWithMiss);
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
    board[4][5] = { name: 'test', status: CellStates.hit };

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
    board[4][5] = { name: 'test', status: CellStates.hit };
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
});
