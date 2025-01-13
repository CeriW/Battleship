import { calculateHeatMap, initialiseHeatMapArray } from './calculateHeatMap';
import { initialiseShipArray } from './placeShips';
import { CellStates } from '../types';

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

// describe('calculateHeatMap', () => {

// });

// describe('calculateHeatMap - heat', () => {
//   test('Returns a heat map full of zeroes for an empty board', () => {
//     const heatMap = calculateHeatMap(initialiseShipArray());
//     expect(heatMap).toBeDefined();
//     heatMap.forEach((row) => {
//       expect(row).toHaveLength(10);
//       expect(row.every((value) => value.heat === 0)).toBe(true);
//     });
//   });

//   test('hit squares have a heat of -1', () => {
//     const board = initialiseShipArray();
//     board[4][5] = { name: 'test', status: CellStates.hit }; // Above

//     const heatMap = calculateHeatMap(board);
//     expect(heatMap[4][5].heat).toBe(-1);
//   });

//   test('squares adjacent to a single hit square have a heat of 2, and squares two spaces away have a heat of 1', () => {
//     const board = initialiseShipArray();

//     const y = 5;
//     const x = 5;

//     board[y][x] = { name: 'test', status: CellStates.hit };
//     const heatMap = calculateHeatMap(board);
//     expect(heatMap[y - 1][x].heat).toBe(2); // above
//     expect(heatMap[y + 1][x].heat).toBe(2); // below
//     expect(heatMap[y][x - 1].heat).toBe(2); // to left
//     expect(heatMap[y][x + 1].heat).toBe(2); // to right

//     expect(heatMap[y - 2][x].heat).toBe(1); // above
//     expect(heatMap[y + 2][x].heat).toBe(1); // below
//     expect(heatMap[y][x - 2].heat).toBe(1); // to left
//     expect(heatMap[y][x + 2].heat).toBe(1); // to right
//   });

//   test('a square adjacent to two hit squares has a heat of 4', () => {
//     const board = initialiseShipArray();
//     board[4][5] = { name: 'test', status: CellStates.hit }; // Above
//     board[5][4] = { name: 'test', status: CellStates.hit }; // Left

//     const heatMap = calculateHeatMap(board);
//     expect(heatMap[5][5].heat).toBe(4);
//   });

//   test('squares adjacent three separate hit squares have a heat of 6', () => {
//     const board = initialiseShipArray();
//     board[4][5] = { name: 'test', status: CellStates.hit }; // Above
//     board[5][4] = { name: 'test', status: CellStates.hit }; // Left
//     board[5][6] = { name: 'test', status: CellStates.hit }; // Right

//     const heatMap = calculateHeatMap(board);
//     expect(heatMap[5][5].heat).toBe(6);
//   });

//   test('squares adjacent to four separate hit squares have a heat of 8', () => {
//     const board = initialiseShipArray();

//     const x = 5;
//     const y = 5;

//     board[y - 1][x] = { name: 'test', status: CellStates.hit }; // Above
//     board[y + 1][x] = { name: 'test', status: CellStates.hit }; // Below
//     board[y][x - 1] = { name: 'test', status: CellStates.hit }; // Left
//     board[y][x + 1] = { name: 'test', status: CellStates.hit }; // Right

//     const heatMap = calculateHeatMap(board);
//     expect(heatMap[y][x].heat).toBe(8);
//   });

//   test('two horizontally adjacent hits should return appropriate heat for adjacent squares', () => {
//     const board = initialiseShipArray();
//     const x = 5;
//     const y = 5;

//     board[y][x] = { name: 'test', status: CellStates.hit };
//     board[y][x + 1] = { name: 'test', status: CellStates.hit };

//     const heatMap = calculateHeatMap(board);

//     // The hits
//     expect(heatMap[y][x].heat).toBe(-1);
//     expect(heatMap[y][x + 1].heat).toBe(-1);

//     // Squares above
//     expect(heatMap[y - 1][x].heat).toBe(2);
//     expect(heatMap[y - 1][x + 1].heat).toBe(2);

//     // Squares below
//     expect(heatMap[y + 1][x].heat).toBe(2);
//     expect(heatMap[y + 1][x + 1].heat).toBe(2);

//     // Squares to left
//     expect(heatMap[y][x - 1].heat).toBe(2);
//     expect(heatMap[y][x - 2].heat).toBe(1);
//     expect(heatMap[y][x - 3].heat).toBe(0);

//     // Squares to right
//     expect(heatMap[y][x + 2].heat).toBe(2);
//     expect(heatMap[y][x + 3].heat).toBe(1);
//     expect(heatMap[y][x + 4].heat).toBe(0);
//   });

//   test('two vertically adjacent hits should return appropriate heat for adjacent squares', () => {
//     const board = initialiseShipArray();
//     const x = 5;
//     const y = 5;

//     board[y][x] = { name: 'test', status: CellStates.hit };
//     board[y + 1][x] = { name: 'test', status: CellStates.hit };

//     const heatMap = calculateHeatMap(board);

//     // The hits
//     expect(heatMap[y][x].heat).toBe(-1);
//     expect(heatMap[y + 1][x].heat).toBe(-1);

//     // Squares above
//     expect(heatMap[y - 1][x].heat).toBe(2);
//     expect(heatMap[y - 2][x].heat).toBe(1);
//     expect(heatMap[y - 3][x].heat).toBe(0);

//     // Squares below
//     expect(heatMap[y + 2][x].heat).toBe(2);
//     expect(heatMap[y + 3][x].heat).toBe(1);
//     expect(heatMap[y + 4][x].heat).toBe(0);

//     // Squares to left
//     expect(heatMap[y][x - 1].heat).toBe(2);
//     expect(heatMap[y][x - 2].heat).toBe(1);

//     // Squares to right
//     expect(heatMap[y][x + 1].heat).toBe(2);
//     expect(heatMap[y + 1][x + 1].heat).toBe(2);
//   });
// });

// describe('calculateHeatMap - heatMultiplier', () => {
//   test('Returns a heat map full of 10s for an empty board', () => {
//     const heatMap = calculateHeatMap(initialiseShipArray());
//     expect(heatMap).toBeDefined();
//     heatMap.forEach((row) => {
//       expect(row).toHaveLength(10);
//     });

//     expect(heatMap).toEqual([
//       [
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 9 },
//         { heat: 0, heatMultiplier: 8 },
//         { heat: 0, heatMultiplier: 6 },
//         { heat: 0, heatMultiplier: 5 },
//       ],
//       [
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 9 },
//         { heat: 0, heatMultiplier: 8 },
//         { heat: 0, heatMultiplier: 6 },
//         { heat: 0, heatMultiplier: 5 },
//       ],
//       [
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 9 },
//         { heat: 0, heatMultiplier: 8 },
//         { heat: 0, heatMultiplier: 6 },
//         { heat: 0, heatMultiplier: 5 },
//       ],
//       [
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 9 },
//         { heat: 0, heatMultiplier: 8 },
//         { heat: 0, heatMultiplier: 6 },
//         { heat: 0, heatMultiplier: 5 },
//       ],
//       [
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 9 },
//         { heat: 0, heatMultiplier: 8 },
//         { heat: 0, heatMultiplier: 6 },
//         { heat: 0, heatMultiplier: 5 },
//       ],
//       [
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 10 },
//         { heat: 0, heatMultiplier: 9 },
//         { heat: 0, heatMultiplier: 8 },
//         { heat: 0, heatMultiplier: 6 },
//         { heat: 0, heatMultiplier: 5 },
//       ],
//       [
//         { heat: 0, heatMultiplier: 9 },
//         { heat: 0, heatMultiplier: 9 },
//         { heat: 0, heatMultiplier: 9 },
//         { heat: 0, heatMultiplier: 9 },
//         { heat: 0, heatMultiplier: 9 },
//         { heat: 0, heatMultiplier: 9 },
//         { heat: 0, heatMultiplier: 8 },
//         { heat: 0, heatMultiplier: 7 },
//         { heat: 0, heatMultiplier: 5 },
//         { heat: 0, heatMultiplier: 4 },
//       ],
//       [
//         { heat: 0, heatMultiplier: 8 },
//         { heat: 0, heatMultiplier: 8 },
//         { heat: 0, heatMultiplier: 8 },
//         { heat: 0, heatMultiplier: 8 },
//         { heat: 0, heatMultiplier: 8 },
//         { heat: 0, heatMultiplier: 8 },
//         { heat: 0, heatMultiplier: 7 },
//         { heat: 0, heatMultiplier: 6 },
//         { heat: 0, heatMultiplier: 4 },
//         { heat: 0, heatMultiplier: 3 },
//       ],
//       [
//         { heat: 0, heatMultiplier: 6 },
//         { heat: 0, heatMultiplier: 6 },
//         { heat: 0, heatMultiplier: 6 },
//         { heat: 0, heatMultiplier: 6 },
//         { heat: 0, heatMultiplier: 6 },
//         { heat: 0, heatMultiplier: 6 },
//         { heat: 0, heatMultiplier: 5 },
//         { heat: 0, heatMultiplier: 4 },
//         { heat: 0, heatMultiplier: 2 },
//         { heat: 0, heatMultiplier: 1 },
//       ],
//       [
//         { heat: 0, heatMultiplier: 5 },
//         { heat: 0, heatMultiplier: 5 },
//         { heat: 0, heatMultiplier: 5 },
//         { heat: 0, heatMultiplier: 5 },
//         { heat: 0, heatMultiplier: 5 },
//         { heat: 0, heatMultiplier: 5 },
//         { heat: 0, heatMultiplier: 4 },
//         { heat: 0, heatMultiplier: 3 },
//         { heat: 0, heatMultiplier: 1 },
//         { heat: 0, heatMultiplier: 0 },
//       ],
//     ]);
//   });

//   test('cells that are a hit have a heatMultiplier of 0', () => {
//     const board = initialiseShipArray();
//     board[0][0] = { name: 'test', status: CellStates.hit };

//     const heatMap = calculateHeatMap(board);

//     expect(heatMap[0][0].heatMultiplier).toBe(0);
//   });

//   test('cells that are a miss have a heatMultiplier of 0', () => {
//     const board = initialiseShipArray();
//     board[0][0] = { name: 'test', status: CellStates.miss };

//     const heatMap = calculateHeatMap(board);

//     expect(heatMap[0][0].heatMultiplier).toBe(0);
//   });

//   test('top left corner of the board has a heatMultiplier of 10 on an empty board', () => {
//     const board = initialiseShipArray();
//     // board[0][0] = { name: 'test', status: CellStates.miss };

//     const heatMap = calculateHeatMap(board);

//     expect(heatMap[0][0].heatMultiplier).toBe(10);
//   });

//   test('top left corner of the board has a heatMultiplier of 5 when cell to right is a miss', () => {
//     // No ships can start in top left corner horizontally in this scenario
//     // |  ?  | miss |

//     const board = initialiseShipArray();
//     board[0][1] = { name: 'test', status: CellStates.miss };

//     const heatMap = calculateHeatMap(board);

//     expect(heatMap[0][0].heatMultiplier).toBe(5);
//   });

//   test('top left corner of the board has a heatMultiplier of 10 when cell to right is a hit', () => {
//     // All ships could feasibly be in the top left corner both horizontally and vertically
//     // |  ?  | hit |

//     const board = initialiseShipArray();
//     board[0][1] = { name: 'test', status: CellStates.hit };

//     const heatMap = calculateHeatMap(board);

//     expect(heatMap[0][0].heatMultiplier).toBe(10);
//   });

//   test('top left corner of the board has a heatMultiplier of 10 when cell to right and below are hits', () => {
//     // All ships could feasibly be in the top left corner both horizontally and vertically
//     // |   ?  | hit |
//     // |  hit |     |

//     const board = initialiseShipArray();
//     board[0][1] = { name: 'test', status: CellStates.hit };
//     board[1][0] = { name: 'test', status: CellStates.hit };

//     const heatMap = calculateHeatMap(board);
//     expect(heatMap[0][0].heatMultiplier).toBe(10);
//   });

//   test('top left corner of the board has a heatMultiplier of 10 when cell to right and below are misses', () => {
//     // No ships could feasibly be in the top left corner in any alignment
//     // |   ?   | miss |
//     // |  miss |      |

//     const board = initialiseShipArray();
//     board[0][1] = { name: 'test', status: CellStates.miss };
//     board[1][0] = { name: 'test', status: CellStates.miss };

//     const heatMap = calculateHeatMap(board);

//     expect(heatMap[0][0].heatMultiplier).toBe(0);
//   });

//   test('top left corner of the board has a heatMultiplier of 10 when a 2x2 gap is available', () => {
//     // Only a 2 tile long ship could fit here, and it could be horizontal or vertical
//     // |   ?   |        |  miss  |
//     // |       |        |  miss  |
//     // |  miss |  miss  |        |

//     const board = initialiseShipArray();
//     board[0][2] = { name: 'test', status: CellStates.miss };
//     board[1][2] = { name: 'test', status: CellStates.miss };
//     board[2][0] = { name: 'test', status: CellStates.miss };
//     board[2][1] = { name: 'test', status: CellStates.miss };

//     const heatMap = calculateHeatMap(board);

//     expect(heatMap[0][0].heatMultiplier).toBe(2);
//   });

//   test('top left corner of the board has a heatMultiplier of 1 when a 2x1 gap is available', () => {
//     // Only a 2 tile long ship could fit here, only horizontally
//     // |   ?   |        |  miss  |
//     // |  miss |  miss  |        |

//     const board = initialiseShipArray();
//     board[0][2] = { name: 'test', status: CellStates.miss };
//     board[1][0] = { name: 'test', status: CellStates.miss };
//     board[1][1] = { name: 'test', status: CellStates.miss };

//     const heatMap = calculateHeatMap(board);

//     expect(heatMap[0][0].heatMultiplier).toBe(1);
//   });

//   test('top left corner of the board has a heatMultiplier of 3 when a 3x1 gap is available', () => {
//     // The single 2 tile long ship and both 3 tile long ships could fit here horizontally
//     // |   ?   |        |        | miss  |
//     // |  miss |  N/A   |  N/A   |

//     const board = initialiseShipArray();
//     board[0][3] = { name: 'test', status: CellStates.miss }; // miss to right
//     board[1][0] = { name: 'test', status: CellStates.miss }; // row below

//     const heatMap = calculateHeatMap(board);

//     expect(heatMap[0][0].heatMultiplier).toBe(3);
//   });

//   test('top left corner of the board has a heatMultiplier of 4 when a 4x1 gap is available', () => {
//     // The single 2 tile long ship, the two 3 tile long ships, and the 4 tile long ship could fit here horizontally but not vertically
//     // |   ?   |        |        |        | miss  |
//     // |  miss |  N/A   |  N/A   |  N/A   |

//     const board = initialiseShipArray();
//     board[0][4] = { name: 'test', status: CellStates.miss }; // miss to right
//     board[1][0] = { name: 'test', status: CellStates.miss }; // row below

//     const heatMap = calculateHeatMap(board);

//     expect(heatMap[0][0].heatMultiplier).toBe(4);
//   });

//   test('top left corner of the board has a heatMultiplier of 5 when a 5x1 gap is available', () => {
//     // The single 2 tile long ship, the two 3 tile long ships, the 4 tile long ship, and the 5 tile long ship could fit here horizontally but not vertically
//     // |   ?   |        |        |        |        |        | miss  |
//     // |  miss |  N/A   |  N/A   |  N/A   |  N/A   |  N/A   |

//     const board = initialiseShipArray();
//     board[0][5] = { name: 'test', status: CellStates.miss }; // miss to right
//     board[1][0] = { name: 'test', status: CellStates.miss }; // row below

//     const heatMap = calculateHeatMap(board);

//     expect(heatMap[0][0].heatMultiplier).toBe(5);
//   });

//   test('top left corner of the board has a heatMultiplier of 1 when a 1x2 gap is available', () => {
//     // Only a 2 tile long ship could fit here, only vertically
//     // |   ?   |  miss  |
//     // |       |  miss  |
//     // |  miss |        |

//     const board = initialiseShipArray();
//     board[0][1] = { name: 'test', status: CellStates.miss };
//     board[1][1] = { name: 'test', status: CellStates.miss };
//     board[2][0] = { name: 'test', status: CellStates.miss };

//     const heatMap = calculateHeatMap(board);

//     expect(heatMap[0][0].heatMultiplier).toBe(1);
//   });

//   test('top left corner of the board has a heatMultiplier of 3 when a 1x3 gap is available', () => {
//     // The single two tile long ship and the two 3 tile long ships could fit here
//     // |   ?   |  miss  |
//     // |       |  miss  |
//     // |       |  miss  |
//     // |  miss |        |

//     const board = initialiseShipArray();
//     board[0][1] = { name: 'test', status: CellStates.miss };
//     board[1][1] = { name: 'test', status: CellStates.miss };
//     board[2][1] = { name: 'test', status: CellStates.miss };
//     board[3][0] = { name: 'test', status: CellStates.miss };

//     const heatMap = calculateHeatMap(board);

//     expect(heatMap[0][0].heatMultiplier).toBe(3);
//   });

//   test('top left corner of the board has a heatMultiplier of 4 when a 1x4 gap is available', () => {
//     // The single two tile long ship, the two 3 tile long ships, and the 4 tile long ship could fit here
//     // |   ?   |  miss  |
//     // |       |  miss  |
//     // |       |  miss  |
//     // |       |  miss  |
//     // |  miss |        |

//     const board = initialiseShipArray();
//     board[0][1] = { name: 'test', status: CellStates.miss };
//     board[1][1] = { name: 'test', status: CellStates.miss };
//     board[2][1] = { name: 'test', status: CellStates.miss };
//     board[3][1] = { name: 'test', status: CellStates.miss };
//     board[4][0] = { name: 'test', status: CellStates.miss };

//     const heatMap = calculateHeatMap(board);

//     expect(heatMap[0][0].heatMultiplier).toBe(4);
//   });

//   test('top left corner of the board has a heatMultiplier of 5 when a 1x5 gap is available', () => {
//     // All five ships could fit here vertically
//     // |   ?   |  miss  |
//     // |       |  miss  |
//     // |       |  miss  |
//     // |       |  miss  |
//     // |       |  miss  |
//     // |  miss |        |

//     const board = initialiseShipArray();
//     board[0][1] = { name: 'test', status: CellStates.miss };
//     board[1][1] = { name: 'test', status: CellStates.miss };
//     board[2][1] = { name: 'test', status: CellStates.miss };
//     board[3][1] = { name: 'test', status: CellStates.miss };
//     board[4][1] = { name: 'test', status: CellStates.miss };
//     board[5][0] = { name: 'test', status: CellStates.miss };

//     const heatMap = calculateHeatMap(board);

//     expect(heatMap[0][0].heatMultiplier).toBe(5);
//   });

//   test('top left corner of the board has a heatMultiplier of 10 when a 5x5 gap is available', () => {
//     // All five ships could fit here both horizontally and vertically
//     // |   ?   |        |        |        |        |   miss  |
//     // |   ?   |        |        |        |        |   miss  |
//     // |   ?   |        |        |        |        |   miss  |
//     // |   ?   |        |        |        |        |   miss  |
//     // |   ?   |        |        |        |        |   miss  |
//     // |   ?   |        |        |        |        |   miss  |
//     // |  miss |  N/A   |  N/A   |  N/A   |  N/A   |  N/A   |

//     const board = initialiseShipArray();
//     board[0][5] = { name: 'test', status: CellStates.miss };
//     board[1][5] = { name: 'test', status: CellStates.miss };
//     board[2][5] = { name: 'test', status: CellStates.miss };
//     board[3][5] = { name: 'test', status: CellStates.miss };
//     board[4][5] = { name: 'test', status: CellStates.miss };
//     board[5][0] = { name: 'test', status: CellStates.miss };

//     const heatMap = calculateHeatMap(board);

//     expect(heatMap[0][0].heatMultiplier).toBe(10);
//   });
// });
