import { calculateHeatMap, initialiseHeatMapArray } from './calculateHeatMap';
import { initialiseShipArray } from './placeShips';
import { CellStates } from '../types';

let heatMapSimulations = 100;

jest.mock('../ai-behaviour', () => ({
  ai: {
    heatMapSimulations: heatMapSimulations,
    adjacentShipModifier: 0,
  },
}));

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
    expect(heatMap[4][5]).toBe(heatMapSimulations);
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
