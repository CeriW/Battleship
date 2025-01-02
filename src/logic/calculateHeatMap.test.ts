import { calculateHeatMap, initialiseHeatMapArray } from './calculateHeatMap';
import { initialiseShipArray } from './placeShips';
import { CellStates } from '../types';

describe('initialiseHeatMap', () => {
  test('should return a 10x10 array of zeroes', () => {
    const heatMap = initialiseHeatMapArray();
    expect(heatMap).toHaveLength(10);
    heatMap.forEach((row: number[]) => {
      expect(row).toHaveLength(10);
      expect(row.every((value: number) => value === 0)).toBe(true);
    });
  });
});

describe('calculateHeatMap', () => {
  test('Returns a heat map full of zeroes for an empty board', () => {
    const heatMap = calculateHeatMap(initialiseShipArray());
    expect(heatMap).toBeDefined();
    heatMap.forEach((row: number[]) => {
      expect(row).toHaveLength(10);
      expect(row.every((value: number) => value === 0)).toBe(true);
    });
  });

  test('hit squares have a heat of -1', () => {
    const board = initialiseShipArray();
    board[4][5] = { name: 'test', hit: CellStates.hit }; // Above

    const heatMap = calculateHeatMap(board);
    expect(heatMap[4][5]).toBe(-1);
  });

  test('squares adjacent to a single hit square have a heat of 1', () => {
    const board = initialiseShipArray();
    board[5][5] = { name: 'test', hit: CellStates.hit };
    const heatMap = calculateHeatMap(board);
    expect(heatMap[4][5]).toBe(1);
    expect(heatMap[6][5]).toBe(1);
    expect(heatMap[5][4]).toBe(1);
    expect(heatMap[5][6]).toBe(1);
  });

  test('a square adjacent to two hit squares has a heat of 2', () => {
    const board = initialiseShipArray();
    board[4][5] = { name: 'test', hit: CellStates.hit }; // Above
    board[5][4] = { name: 'test', hit: CellStates.hit }; // Left

    const heatMap = calculateHeatMap(board);
    expect(heatMap[5][5]).toBe(2);
  });

  test('squares adjacent three separate hit squares have a heat of 3', () => {
    const board = initialiseShipArray();
    board[4][5] = { name: 'test', hit: CellStates.hit }; // Above
    board[5][4] = { name: 'test', hit: CellStates.hit }; // Left
    board[5][6] = { name: 'test', hit: CellStates.hit }; // Right

    const heatMap = calculateHeatMap(board);
    expect(heatMap[5][5]).toBe(3);
  });

  test('squares adjacent to four separate hit squares have a heat of 4', () => {
    const board = initialiseShipArray();
    board[4][5] = { name: 'test', hit: CellStates.hit }; // Above
    board[5][4] = { name: 'test', hit: CellStates.hit }; // Left
    board[5][6] = { name: 'test', hit: CellStates.hit }; // Right
    board[6][5] = { name: 'test', hit: CellStates.hit }; // Below

    const heatMap = calculateHeatMap(board);
    expect(heatMap[5][5]).toBe(4);
  });

  test('two horizontally adjacent hits should return appropriate heat for adjacent squares', () => {
    const board = initialiseShipArray();
    board[5][4] = { name: 'test', hit: CellStates.hit };
    board[5][5] = { name: 'test', hit: CellStates.hit };

    const heatMap = calculateHeatMap(board);

    // The hits
    expect(heatMap[5][4]).toBe(-1);
    expect(heatMap[5][5]).toBe(-1);

    // Squares above
    expect(heatMap[4][4]).toBe(1);
    expect(heatMap[4][5]).toBe(1);

    // Squares below
    expect(heatMap[6][4]).toBe(1);
    expect(heatMap[6][5]).toBe(1);

    // Squares to left
    expect(heatMap[5][3]).toBe(2);
    expect(heatMap[5][2]).toBe(1);
    expect(heatMap[5][1]).toBe(0);

    // Squares to right
    expect(heatMap[5][6]).toBe(2);
    expect(heatMap[5][7]).toBe(1);
    expect(heatMap[5][8]).toBe(0);
  });

  test('two vertically adjacent hits should return appropriate heat for adjacent squares', () => {
    const board = initialiseShipArray();
    board[5][5] = { name: 'test', hit: CellStates.hit };
    board[6][5] = { name: 'test', hit: CellStates.hit };

    const heatMap = calculateHeatMap(board);

    // The hits
    expect(heatMap[5][5]).toBe(-1);
    expect(heatMap[6][5]).toBe(-1);

    // Squares above
    expect(heatMap[4][5]).toBe(2);
    expect(heatMap[3][5]).toBe(1);
    expect(heatMap[2][5]).toBe(0);

    // Squares below
    expect(heatMap[7][5]).toBe(2);
    expect(heatMap[8][5]).toBe(1);
    expect(heatMap[9][5]).toBe(0);

    // Squares to left
    expect(heatMap[5][4]).toBe(1);
    expect(heatMap[5][3]).toBe(0);

    // Squares to right
    expect(heatMap[5][6]).toBe(1);
    expect(heatMap[6][6]).toBe(1);
  });
});
