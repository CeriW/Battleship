/**
 * Tests for helpers.ts
 *
 * Testing library/framework: Jest/Vitest style (describe/it/expect).
 * - If using Jest: globals are available by default.
 * - If using Vitest: ensure "globals: true" or import { describe, it, expect, vi } from "vitest".
 *
 * These tests focus on the public helpers exported by helpers.ts.
 * We mock Math.random to deterministically verify generateRandomAlignment.
 */

import {
  generateRandomAlignment,
  doesShipFit,
  generatePotentialCoordinates,
  isShipSunk,
  checkAllShipsSunk,
} from './helpers';
import { Alignment, CellStates, PositionArray, ShipNames } from '../types';

// For Vitest users uncomment the following imports if globals are not enabled
// import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// For Jest, use jest.spyOn. For Vitest, vi.spyOn. We branch on availability.
const spyOnFn: typeof jest.spyOn | ((obj: any, key: any) => any) =
  // @ts-ignore
  (globalThis as any).jest?.spyOn ?? ((obj: any, key: any) => (globalThis as any).vi.spyOn(obj, key));
const mockRestoreAll = () => {
  // @ts-ignore
  if ((globalThis as any).jest?.restoreAllMocks) (globalThis as any).jest.restoreAllMocks();
  // @ts-ignore
  if ((globalThis as any).vi?.restoreAllMocks) (globalThis as any).vi.restoreAllMocks();
};

describe('generateRandomAlignment', () => {
  afterEach(() => {
    mockRestoreAll();
  });

  it('returns "horizontal" when Math.random() < 0.5', () => {
    spyOnFn(Math, 'random').mockReturnValue(0.49);
    const result = generateRandomAlignment();
    expect(result).toBe<Alignment>('horizontal');
  });

  it('returns "vertical" when Math.random() >= 0.5 (boundary at 0.5)', () => {
    spyOnFn(Math, 'random').mockReturnValue(0.5);
    const result = generateRandomAlignment();
    expect(result).toBe<Alignment>('vertical');
  });

  it('returns "vertical" when Math.random() > 0.5', () => {
    spyOnFn(Math, 'random').mockReturnValue(0.99);
    const result = generateRandomAlignment();
    expect(result).toBe<Alignment>('vertical');
  });
});

describe('doesShipFit', () => {
  it('fits horizontally when startingColumn + shipSize == 10 (exact boundary)', () => {
    const proposed = { startingRow: 0, startingColumn: 5, alignment: 'horizontal' as Alignment };
    expect(doesShipFit(proposed, 5)).toBe(true); // 5 + 5 = 10
  });

  it('does not fit horizontally when startingColumn + shipSize > 10', () => {
    const proposed = { startingRow: 0, startingColumn: 7, alignment: 'horizontal' as Alignment };
    expect(doesShipFit(proposed, 4)).toBe(false); // 7 + 4 = 11
  });

  it('fits vertically when startingRow + shipSize == 10 (exact boundary)', () => {
    const proposed = { startingRow: 6, startingColumn: 0, alignment: 'vertical' as Alignment };
    expect(doesShipFit(proposed, 4)).toBe(true); // 6 + 4 = 10
  });

  it('does not fit vertically when startingRow + shipSize > 10', () => {
    const proposed = { startingRow: 8, startingColumn: 0, alignment: 'vertical' as Alignment };
    expect(doesShipFit(proposed, 3)).toBe(false); // 8 + 3 = 11
  });

  it('returns true for small ships well inside bounds', () => {
    const proposed = { startingRow: 3, startingColumn: 3, alignment: 'horizontal' as Alignment };
    expect(doesShipFit(proposed, 2)).toBe(true);
  });
});

describe('generatePotentialCoordinates', () => {
  it('generates correct horizontal coordinates', () => {
    const coords = generatePotentialCoordinates(
      { startingRow: 2, startingColumn: 4, alignment: 'horizontal' },
      3
    );
    expect(coords).toEqual([
      { x: 4, y: 2 },
      { x: 5, y: 2 },
      { x: 6, y: 2 },
    ]);
  });

  it('generates correct vertical coordinates', () => {
    const coords = generatePotentialCoordinates(
      { startingRow: 1, startingColumn: 7, alignment: 'vertical' },
      4
    );
    expect(coords).toEqual([
      { x: 7, y: 1 },
      { x: 7, y: 2 },
      { x: 7, y: 3 },
      { x: 7, y: 4 },
    ]);
  });

  it('returns empty array when shipSize is 0', () => {
    const coords = generatePotentialCoordinates(
      { startingRow: 0, startingColumn: 0, alignment: 'horizontal' },
      0
    );
    expect(coords).toEqual([]);
  });
});

// Utilities to build a 10x10 board for ship tests
const empty10x10 = (): PositionArray =>
  Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => null));

type ShipCell = {
  name: ShipNames;
  status: CellStates;
};

const cell = (name: ShipNames, status: CellStates): ShipCell => ({ name, status });

describe('isShipSunk', () => {
  it('returns true when all cells for the ship are hit', () => {
    const board: PositionArray = empty10x10();
    // Place two cells for a given ship, both hit
    board[0][0] = cell('destroyer' as ShipNames, CellStates.hit);
    board[0][1] = cell('destroyer' as ShipNames, CellStates.hit);
    // Add other ship cells not fully hit
    board[5][5] = cell('submarine' as ShipNames, CellStates.hit);
    board[5][6] = cell('submarine' as ShipNames, CellStates.ship);

    expect(isShipSunk('destroyer' as ShipNames, board)).toBe(true);
  });

  it('returns false when at least one cell for the ship is not hit', () => {
    const board: PositionArray = empty10x10();
    board[1][1] = cell('battleship' as ShipNames, CellStates.hit);
    board[1][2] = cell('battleship' as ShipNames, CellStates.ship); // not hit

    expect(isShipSunk('battleship' as ShipNames, board)).toBe(false);
  });

  it('returns true when the ship does not exist on the board (empty selection -> every([]) === true)', () => {
    const board: PositionArray = empty10x10();
    // No cells for "carrier"
    expect(isShipSunk('carrier' as ShipNames, board)).toBe(true);
  });
});

describe('checkAllShipsSunk', () => {
  it('returns false when at least one ship cell is not hit', () => {
    const board: PositionArray = empty10x10();
    board[3][3] = cell('patrolBoat' as ShipNames, CellStates.hit);
    board[3][4] = cell('patrolBoat' as ShipNames, CellStates.ship); // not hit
    expect(checkAllShipsSunk(board)).toBe(false);
  });

  it('returns true when all ship cells are hit', () => {
    const board: PositionArray = empty10x10();
    // Two different ships, all hit
    board[0][0] = cell('destroyer' as ShipNames, CellStates.hit);
    board[0][1] = cell('destroyer' as ShipNames, CellStates.hit);
    board[5][5] = cell('submarine' as ShipNames, CellStates.hit);
    board[6][5] = cell('submarine' as ShipNames, CellStates.hit);

    expect(checkAllShipsSunk(board)).toBe(true);
  });

  it('returns true when there are no ship cells on the board (empty selection -> every([]) === true)', () => {
    const board: PositionArray = empty10x10();
    expect(checkAllShipsSunk(board)).toBe(true);
  });
});