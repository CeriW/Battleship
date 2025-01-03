import { calculateHeatMap, initialiseHeatMapArray } from './calculateHeatMap';
import { initialiseShipArray } from './placeShips';
import { CellStates } from '../types';

describe('initialiseHeatMap', () => {
  test('should return a 10x10 array of zeroes', () => {
    const heatMap = initialiseHeatMapArray();
    expect(heatMap).toHaveLength(10);
    heatMap.forEach((row) => {
      expect(row).toHaveLength(10);
      expect(row.every((value) => value.heat === 0 && value.heatMultiplier === 1)).toBe(true);
    });
  });
});

describe('calculateHeatMap - heat', () => {
  test('Returns a heat map full of zeroes for an empty board', () => {
    const heatMap = calculateHeatMap(initialiseShipArray());
    expect(heatMap).toBeDefined();
    heatMap.forEach((row) => {
      expect(row).toHaveLength(10);
      expect(row.every((value) => value.heat === 0)).toBe(true);
    });
  });

  test('hit squares have a heat of -1', () => {
    const board = initialiseShipArray();
    board[4][5] = { name: 'test', hit: CellStates.hit }; // Above

    const heatMap = calculateHeatMap(board);
    expect(heatMap[4][5].heat).toBe(-1);
  });

  test('squares adjacent to a single hit square have a heat of 1', () => {
    const board = initialiseShipArray();
    board[5][5] = { name: 'test', hit: CellStates.hit };
    const heatMap = calculateHeatMap(board);
    expect(heatMap[4][5].heat).toBe(1);
    expect(heatMap[6][5].heat).toBe(1);
    expect(heatMap[5][4].heat).toBe(1);
    expect(heatMap[5][6].heat).toBe(1);
  });

  test('a square adjacent to two hit squares has a heat of 2', () => {
    const board = initialiseShipArray();
    board[4][5] = { name: 'test', hit: CellStates.hit }; // Above
    board[5][4] = { name: 'test', hit: CellStates.hit }; // Left

    const heatMap = calculateHeatMap(board);
    expect(heatMap[5][5].heat).toBe(2);
  });

  test('squares adjacent three separate hit squares have a heat of 3', () => {
    const board = initialiseShipArray();
    board[4][5] = { name: 'test', hit: CellStates.hit }; // Above
    board[5][4] = { name: 'test', hit: CellStates.hit }; // Left
    board[5][6] = { name: 'test', hit: CellStates.hit }; // Right

    const heatMap = calculateHeatMap(board);
    expect(heatMap[5][5].heat).toBe(3);
  });

  test('squares adjacent to four separate hit squares have a heat of 4', () => {
    const board = initialiseShipArray();
    board[4][5] = { name: 'test', hit: CellStates.hit }; // Above
    board[5][4] = { name: 'test', hit: CellStates.hit }; // Left
    board[5][6] = { name: 'test', hit: CellStates.hit }; // Right
    board[6][5] = { name: 'test', hit: CellStates.hit }; // Below

    const heatMap = calculateHeatMap(board);
    expect(heatMap[5][5].heat).toBe(4);
  });

  test('two horizontally adjacent hits should return appropriate heat for adjacent squares', () => {
    const board = initialiseShipArray();
    board[5][4] = { name: 'test', hit: CellStates.hit };
    board[5][5] = { name: 'test', hit: CellStates.hit };

    const heatMap = calculateHeatMap(board);

    // The hits
    expect(heatMap[5][4].heat).toBe(-1);
    expect(heatMap[5][5].heat).toBe(-1);

    // Squares above
    expect(heatMap[4][4].heat).toBe(1);
    expect(heatMap[4][5].heat).toBe(1);

    // Squares below
    expect(heatMap[6][4].heat).toBe(1);
    expect(heatMap[6][5].heat).toBe(1);

    // Squares to left
    expect(heatMap[5][3].heat).toBe(2);
    expect(heatMap[5][2].heat).toBe(1);
    expect(heatMap[5][1].heat).toBe(0);

    // Squares to right
    expect(heatMap[5][6].heat).toBe(2);
    expect(heatMap[5][7].heat).toBe(1);
    expect(heatMap[5][8].heat).toBe(0);
  });

  test('two vertically adjacent hits should return appropriate heat for adjacent squares', () => {
    const board = initialiseShipArray();
    board[5][5] = { name: 'test', hit: CellStates.hit };
    board[6][5] = { name: 'test', hit: CellStates.hit };

    const heatMap = calculateHeatMap(board);

    // The hits
    expect(heatMap[5][5].heat).toBe(-1);
    expect(heatMap[6][5].heat).toBe(-1);

    // Squares above
    expect(heatMap[4][5].heat).toBe(2);
    expect(heatMap[3][5].heat).toBe(1);
    expect(heatMap[2][5].heat).toBe(0);

    // Squares below
    expect(heatMap[7][5].heat).toBe(2);
    expect(heatMap[8][5].heat).toBe(1);
    expect(heatMap[9][5].heat).toBe(0);

    // Squares to left
    expect(heatMap[5][4].heat).toBe(1);
    expect(heatMap[5][3].heat).toBe(0);

    // Squares to right
    expect(heatMap[5][6].heat).toBe(1);
    expect(heatMap[6][6].heat).toBe(1);
  });
});

describe('calculateHeatMap - heatMultiplier', () => {
  test('Returns a heat map full of 10s for an empty board', () => {
    const heatMap = calculateHeatMap(initialiseShipArray());
    expect(heatMap).toBeDefined();
    heatMap.forEach((row) => {
      expect(row).toHaveLength(10);
    });

    expect(heatMap).toEqual([
      [
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 9 },
        { heat: 0, heatMultiplier: 8 },
        { heat: 0, heatMultiplier: 6 },
        { heat: 0, heatMultiplier: 5 },
      ],
      [
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 9 },
        { heat: 0, heatMultiplier: 8 },
        { heat: 0, heatMultiplier: 6 },
        { heat: 0, heatMultiplier: 5 },
      ],
      [
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 9 },
        { heat: 0, heatMultiplier: 8 },
        { heat: 0, heatMultiplier: 6 },
        { heat: 0, heatMultiplier: 5 },
      ],
      [
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 9 },
        { heat: 0, heatMultiplier: 8 },
        { heat: 0, heatMultiplier: 6 },
        { heat: 0, heatMultiplier: 5 },
      ],
      [
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 9 },
        { heat: 0, heatMultiplier: 8 },
        { heat: 0, heatMultiplier: 6 },
        { heat: 0, heatMultiplier: 5 },
      ],
      [
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 10 },
        { heat: 0, heatMultiplier: 9 },
        { heat: 0, heatMultiplier: 8 },
        { heat: 0, heatMultiplier: 6 },
        { heat: 0, heatMultiplier: 5 },
      ],
      [
        { heat: 0, heatMultiplier: 9 },
        { heat: 0, heatMultiplier: 9 },
        { heat: 0, heatMultiplier: 9 },
        { heat: 0, heatMultiplier: 9 },
        { heat: 0, heatMultiplier: 9 },
        { heat: 0, heatMultiplier: 9 },
        { heat: 0, heatMultiplier: 8 },
        { heat: 0, heatMultiplier: 7 },
        { heat: 0, heatMultiplier: 5 },
        { heat: 0, heatMultiplier: 4 },
      ],
      [
        { heat: 0, heatMultiplier: 8 },
        { heat: 0, heatMultiplier: 8 },
        { heat: 0, heatMultiplier: 8 },
        { heat: 0, heatMultiplier: 8 },
        { heat: 0, heatMultiplier: 8 },
        { heat: 0, heatMultiplier: 8 },
        { heat: 0, heatMultiplier: 7 },
        { heat: 0, heatMultiplier: 6 },
        { heat: 0, heatMultiplier: 4 },
        { heat: 0, heatMultiplier: 3 },
      ],
      [
        { heat: 0, heatMultiplier: 6 },
        { heat: 0, heatMultiplier: 6 },
        { heat: 0, heatMultiplier: 6 },
        { heat: 0, heatMultiplier: 6 },
        { heat: 0, heatMultiplier: 6 },
        { heat: 0, heatMultiplier: 6 },
        { heat: 0, heatMultiplier: 5 },
        { heat: 0, heatMultiplier: 4 },
        { heat: 0, heatMultiplier: 2 },
        { heat: 0, heatMultiplier: 1 },
      ],
      [
        { heat: 0, heatMultiplier: 5 },
        { heat: 0, heatMultiplier: 5 },
        { heat: 0, heatMultiplier: 5 },
        { heat: 0, heatMultiplier: 5 },
        { heat: 0, heatMultiplier: 5 },
        { heat: 0, heatMultiplier: 5 },
        { heat: 0, heatMultiplier: 4 },
        { heat: 0, heatMultiplier: 3 },
        { heat: 0, heatMultiplier: 1 },
        { heat: 0, heatMultiplier: 0 },
      ],
    ]);
  });

  test('cells that are a hit have a heatMultiplier of 0', () => {
    const board = initialiseShipArray();
    board[0][0] = { name: 'test', hit: CellStates.hit };

    const heatMap = calculateHeatMap(board);

    expect(heatMap[0][0].heatMultiplier).toBe(0);
  });

  test('cells that are a miss have a heatMultiplier of 0', () => {
    const board = initialiseShipArray();
    board[0][0] = { name: 'test', hit: CellStates.miss };

    const heatMap = calculateHeatMap(board);

    expect(heatMap[0][0].heatMultiplier).toBe(0);
  });

  test('top left corner of the board has a heatMultiplier of 10 on an empty board', () => {
    const board = initialiseShipArray();
    // board[0][0] = { name: 'test', hit: CellStates.miss };

    const heatMap = calculateHeatMap(board);

    expect(heatMap[0][0].heatMultiplier).toBe(10);
  });

  test('top left corner of the board has a heatMultiplier of 5 when cell to right is a miss', () => {
    // No ships can start in top left corner horizontally in this scenario
    // |  ?  | miss |

    const board = initialiseShipArray();
    board[0][1] = { name: 'test', hit: CellStates.miss };

    const heatMap = calculateHeatMap(board);

    expect(heatMap[0][0].heatMultiplier).toBe(5);
  });

  test('top left corner of the board has a heatMultiplier of 10 when cell to right is a hit', () => {
    // All ships could feasibly be in the top left corner both horizontally and vertically
    // |  ?  | hit |

    const board = initialiseShipArray();
    board[0][1] = { name: 'test', hit: CellStates.hit };

    const heatMap = calculateHeatMap(board);

    expect(heatMap[0][0].heatMultiplier).toBe(10);
  });

  test('top left corner of the board has a heatMultiplier of 10 when cell to right and below are hits', () => {
    // All ships could feasibly be in the top left corner both horizontally and vertically
    // |   ?  | hit |
    // |  hit |     |

    const board = initialiseShipArray();
    board[0][1] = { name: 'test', hit: CellStates.hit };
    board[1][0] = { name: 'test', hit: CellStates.hit };

    const heatMap = calculateHeatMap(board);

    // TODO - THIS TESTS FAILS BUT IT SHOULD PASS
    // LOGIC NEEDS UPDATING

    expect(heatMap[0][0].heatMultiplier).toBe(10);
  });

  test('top left corner of the board has a heatMultiplier of 10 when cell to right and below are misses', () => {
    // No ships could feasibly be in the top left corner in any alignment
    // |   ?   | miss |
    // |  miss |      |

    const board = initialiseShipArray();
    board[0][1] = { name: 'test', hit: CellStates.miss };
    board[1][0] = { name: 'test', hit: CellStates.miss };

    const heatMap = calculateHeatMap(board);

    // TODO - THIS TESTS FAILS BUT IT SHOULD PASS
    // LOGIC NEEDS UPDATING

    expect(heatMap[0][0].heatMultiplier).toBe(0);
  });

  // test('hit squares have a heat of -1', () => {
  //   const board = initialiseShipArray();
  //   board[4][5] = { name: 'test', hit: CellStates.hit }; // Above

  //   const heatMap = calculateHeatMap(board);
  //   expect(heatMap[4][5].heat).toBe(-1);
  // });

  // test('squares adjacent to a single hit square have a heat of 1', () => {
  //   const board = initialiseShipArray();
  //   board[5][5] = { name: 'test', hit: CellStates.hit };
  //   const heatMap = calculateHeatMap(board);
  //   expect(heatMap[4][5].heat).toBe(1);
  //   expect(heatMap[6][5].heat).toBe(1);
  //   expect(heatMap[5][4].heat).toBe(1);
  //   expect(heatMap[5][6].heat).toBe(1);
  // });

  // test('a square adjacent to two hit squares has a heat of 2', () => {
  //   const board = initialiseShipArray();
  //   board[4][5] = { name: 'test', hit: CellStates.hit }; // Above
  //   board[5][4] = { name: 'test', hit: CellStates.hit }; // Left

  //   const heatMap = calculateHeatMap(board);
  //   expect(heatMap[5][5].heat).toBe(2);
  // });

  // test('squares adjacent three separate hit squares have a heat of 3', () => {
  //   const board = initialiseShipArray();
  //   board[4][5] = { name: 'test', hit: CellStates.hit }; // Above
  //   board[5][4] = { name: 'test', hit: CellStates.hit }; // Left
  //   board[5][6] = { name: 'test', hit: CellStates.hit }; // Right

  //   const heatMap = calculateHeatMap(board);
  //   expect(heatMap[5][5].heat).toBe(3);
  // });

  // test('squares adjacent to four separate hit squares have a heat of 4', () => {
  //   const board = initialiseShipArray();
  //   board[4][5] = { name: 'test', hit: CellStates.hit }; // Above
  //   board[5][4] = { name: 'test', hit: CellStates.hit }; // Left
  //   board[5][6] = { name: 'test', hit: CellStates.hit }; // Right
  //   board[6][5] = { name: 'test', hit: CellStates.hit }; // Below

  //   const heatMap = calculateHeatMap(board);
  //   expect(heatMap[5][5].heat).toBe(4);
  // });

  // test('two horizontally adjacent hits should return appropriate heat for adjacent squares', () => {
  //   const board = initialiseShipArray();
  //   board[5][4] = { name: 'test', hit: CellStates.hit };
  //   board[5][5] = { name: 'test', hit: CellStates.hit };

  //   const heatMap = calculateHeatMap(board);

  //   // The hits
  //   expect(heatMap[5][4].heat).toBe(-1);
  //   expect(heatMap[5][5].heat).toBe(-1);

  //   // Squares above
  //   expect(heatMap[4][4].heat).toBe(1);
  //   expect(heatMap[4][5].heat).toBe(1);

  //   // Squares below
  //   expect(heatMap[6][4].heat).toBe(1);
  //   expect(heatMap[6][5].heat).toBe(1);

  //   // Squares to left
  //   expect(heatMap[5][3].heat).toBe(2);
  //   expect(heatMap[5][2].heat).toBe(1);
  //   expect(heatMap[5][1].heat).toBe(0);

  //   // Squares to right
  //   expect(heatMap[5][6].heat).toBe(2);
  //   expect(heatMap[5][7].heat).toBe(1);
  //   expect(heatMap[5][8].heat).toBe(0);
  // });

  // test('two vertically adjacent hits should return appropriate heat for adjacent squares', () => {
  //   const board = initialiseShipArray();
  //   board[5][5] = { name: 'test', hit: CellStates.hit };
  //   board[6][5] = { name: 'test', hit: CellStates.hit };

  //   const heatMap = calculateHeatMap(board);

  //   // The hits
  //   expect(heatMap[5][5].heat).toBe(-1);
  //   expect(heatMap[6][5].heat).toBe(-1);

  //   // Squares above
  //   expect(heatMap[4][5].heat).toBe(2);
  //   expect(heatMap[3][5].heat).toBe(1);
  //   expect(heatMap[2][5].heat).toBe(0);

  //   // Squares below
  //   expect(heatMap[7][5].heat).toBe(2);
  //   expect(heatMap[8][5].heat).toBe(1);
  //   expect(heatMap[9][5].heat).toBe(0);

  //   // Squares to left
  //   expect(heatMap[5][4].heat).toBe(1);
  //   expect(heatMap[5][3].heat).toBe(0);

  //   // Squares to right
  //   expect(heatMap[5][6].heat).toBe(1);
  //   expect(heatMap[6][6].heat).toBe(1);
  // });
});
