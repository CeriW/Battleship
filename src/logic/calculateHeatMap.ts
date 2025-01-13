import { shipTypes } from '../App';
import { CellStates, HeatMapArray, PositionArray, HeatMapCell, Alignment } from '../types';
import { initialiseShipArray } from './placeShips';
import { ShipInfo } from '../types';
import {
  doesShipFit,
  generatePotentialPositions as generatePotentialCoordinates,
  generateRandomAlignment,
} from './helpers';

// const generateValidPosition = (currentPos: number, shipSize: number, isVertical: boolean): number => {
//   if (isVertical) {
//     return Math.max(0, currentPos - (shipSize - 1));
//   } else {
//     const min = Math.max(0, currentPos - (shipSize - 1));
//     const max = Math.min(9, currentPos);
//     return min + Math.floor(Math.random() * (max - min + 1));
//   }
// };

export function initialiseHeatMapArray(): HeatMapArray {
  let array: HeatMapArray = [];

  for (let i = 0; i < 10; i++) {
    array[i] = new Array(10).fill({ heat: 0, heatMultiplier: 1 });
  }
  return array;
}

//  Cells that have been determined to be hit or miss cannot have further heat applied
const isHeatable = (cell: HeatMapCell): boolean => cell.heat !== CellStates.hit && cell.heat !== CellStates.miss;

//   const heatMap = initialiseHeatMapArray();

//   for (let i = 0; i < 100; i++) {
//     let y = Math.floor(i / 10);
//     let x = i % 10;

//     heatMap[y][x] = { heat: existingBoard[y][x]?.status ?? 0, heatMultiplier: 1 };
//   }

//   // Now we've figured out where all the hits are, we can mark the adjacent cells as possible hits
//   for (let i = 0; i < 100; i++) {
//     let y = Math.floor(i / 10);
//     let x = i % 10;

//     //  If this cell is a hit...
//     if (heatMap[y][x].heat === CellStates.hit) {
//       // MARK ADJACENT CELLS AS HOT INDISCRIMINATELY ---------------------------

//       // If we're not in the first row, and the cell above is not a hit, then it's hot
//       if (y > 0 && isHeatable(heatMap[y - 1][x])) {
//         heatMap[y - 1][x].heat += 1;
//       }

//       // If we're not in the last row, and the cell below is not a hit, then it's hot
//       if (y < 9 && isHeatable(heatMap[y + 1][x])) {
//         heatMap[y + 1][x].heat += 1;
//       }

//       // If we're not in the last column, and the cell to the right is not a hit, then it's hot
//       if (x < 9 && isHeatable(heatMap[y][x + 1])) {
//         heatMap[y][x + 1].heat += 1;
//       }

//       // If we're not in the first column, and the cell to the left is not a hit, then it's hot
//       if (x > 0 && isHeatable(heatMap[y][x - 1])) {
//         heatMap[y][x - 1].heat += 1;
//       }

//       // GO ALONG THE ROWS FOR EXTRA HEAT --------------------------------------

//       // Is the cell to the left also a hit?
//       if (x > 0 && isHeatable(heatMap[y][x - 1])) {
//         // If it is, we're going to keep going left until we find empty space and make it even hotter
//         for (let i = x; i >= 0; i--) {
//           if (heatMap[y][i].heat !== CellStates.hit) {
//             heatMap[y][i].heat += 1;

//             if (i - 1 >= 0 && isHeatable(heatMap[y][i - 1])) {
//               heatMap[y][i - 1].heat += 1;
//             }
//             break;
//           }
//         }
//       }

//       // Is the cell to the right also a hit?
//       if (x < 10 && isHeatable(heatMap[y][x + 1])) {
//         // If it is, we're going to keep going right until we find empty space and make it even hotter
//         for (let i = x; i < 9; i++) {
//           if (heatMap[y][i].heat !== CellStates.hit) {
//             heatMap[y][i].heat += 1;

//             if (i + 1 < 10 && isHeatable(heatMap[y][i + 1])) {
//               heatMap[y][i + 1].heat += 1;
//             }
//             break;
//           }
//         }
//       }

//       // GO ALONG THE COLUMNS FOR EXTRA HEAT -----------------------------------

//       // Is the cell above also a hit?
//       if (y > 0 && isHeatable(heatMap[y - 1][x])) {
//         // If it is, we're going to keep going up until we find empty space and make it even hotter
//         for (let i = y; i >= 0; i--) {
//           if (isHeatable(heatMap[i][x])) {
//             heatMap[i][x].heat += 1;

//             if (i - 1 >= 0 && isHeatable(heatMap[i - 1][x])) {
//               heatMap[i - 1][x].heat += 1;
//             }
//             break;
//           }
//         }
//       }

//       // Is the cell below also a hit?
//       if (y < 9 && isHeatable(heatMap[y + 1][x])) {
//         // If it is, we're going to keep going up until we find empty space and make it even hotter
//         for (let i = y; i < 10; i++) {
//           if (isHeatable(heatMap[i][x])) {
//             heatMap[i][x].heat += 1;

//             if (i + 1 < 10 && isHeatable(heatMap[i + 1][x])) {
//               heatMap[i + 1][x].heat += 1;
//             }
//             break;
//           }
//         }
//       }
//     }
//   }

//   //  Now we've applied some general heat, let's figure out whether ships can fit in the spaces available
//   // Calculated as such:
//   // +1 for every ship type that can fit here horizontally
//   // +1 for every ship type that can fit here vertically
//   // will result in 0 for a space where no ships can fit (e.g. a 1x1 gap)
//   // will result in 10 for a space where every ship could fit horizontally and vertically (e.g. a 5x5 gap)
//   // and everything in between

//   for (let i = 0; i < 100; i++) {
//     let y = Math.floor(i / 10);
//     let x = i % 10;

//     let heatMultiplier = 0;

//     if (heatMap[y][x].heat !== CellStates.hit) {
//       shipTypes.forEach((ship) => {
//         if (
//           checkValidShipState({
//             proposedPositions: { startingRow: y, startingColumn: x, alignment: 'horizontal' },
//             shipSize: ship.size,
//             existingPositions: existingBoard,
//             mayOverlapHits: true,
//           })
//         ) {
//           heatMultiplier += 1;
//         }

//         if (
//           checkValidShipState({
//             proposedPositions: { startingRow: y, startingColumn: x, alignment: 'vertical' },
//             shipSize: ship.size,
//             existingPositions: existingBoard,
//             mayOverlapHits: true,
//           })
//         ) {
//           heatMultiplier += 1;
//         }
//       });
//     }

//     heatMap[y][x].heatMultiplier = heatMultiplier;
//   }

//   return heatMap;
// };

const ceriTest = (a: number, size: number, alignment: Alignment): number => {
  if (alignment === 'vertical') {
    // For vertical placement, randomly choose between placing up or down from the hit position
    const min = Math.max(0, a - (size - 1)); // Highest possible starting position going up
    const max = Math.min(9 - (size - 1), a); // Highest possible starting position going down
    return min + Math.floor(Math.random() * (max - min + 1));
  } else {
    // For horizontal placement, keep existing logic
    const min = Math.max(0, a - (size - 1));
    const max = Math.min(9, a);
    return min + Math.floor(Math.random() * (max - min + 1));
  }
};

export const calculateHeatMap = (existingBoard: PositionArray): HeatMapArray => {
  const heatMap = initialiseHeatMapArray();
  return heatMap;
};

// Given an existingBoard of hits and misses, generate a board with ships that match
export const generateMatchingBoard = (existingBoard: PositionArray): PositionArray => {
  // Initialize the positions array properly
  const positions: PositionArray = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));

  const unplacedShips = [...shipTypes];

  // First, try to place ships on confirmed hits
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      if (existingBoard[y]?.[x]?.status === CellStates.hit) {
        const alignments =
          Math.random() < 0.5 ? (['horizontal', 'vertical'] as const) : (['vertical', 'horizontal'] as const);

        let placed = false;
        for (const alignment of alignments) {
          if (placed) break;

          // Find all ships that could fit at this position
          const validShips = unplacedShips.filter((ship) => {
            const proposedRow = alignment === 'horizontal' ? y : ceriTest(y, ship.size, alignment);
            const proposedColumn = alignment === 'vertical' ? x : ceriTest(x, ship.size, alignment);

            return checkValidShipState({
              proposedPositions: {
                startingRow: proposedRow,
                startingColumn: proposedColumn,
                alignment,
              },
              shipSize: ship.size,
              existingPositions: positions,
              mayOverlapHits: true,
              existingBoard,
            });
          });

          if (validShips.length > 0) {
            const randomIndex = Math.floor(Math.random() * validShips.length);
            const ship = validShips[randomIndex];

            const proposedRow = alignment === 'horizontal' ? y : ceriTest(y, ship.size, alignment);
            const proposedColumn = alignment === 'vertical' ? x : ceriTest(x, ship.size, alignment);

            try {
              // Place the ship
              if (alignment === 'horizontal') {
                for (let i = proposedColumn; i < proposedColumn + ship.size; i++) {
                  if (!positions[proposedRow]) {
                    console.error('Invalid proposedRow:', proposedRow);
                    continue;
                  }
                  positions[proposedRow][i] = { name: ship.name, status: CellStates.unguessed };
                }
              } else {
                for (let i = proposedRow; i < proposedRow + ship.size; i++) {
                  if (!positions[i]) {
                    console.error('Invalid row index:', i);
                    continue;
                  }
                  positions[i][proposedColumn] = { name: ship.name, status: CellStates.unguessed };
                }
              }

              const shipIndex = unplacedShips.findIndex((s) => s.name === ship.name);
              unplacedShips.splice(shipIndex, 1);
              placed = true;
            } catch (error) {
              console.error('Error placing ship:', {
                alignment,
                proposedRow,
                proposedColumn,
                shipSize: ship.size,
                error,
              });
            }
          }
        }
      }
    }
  }

  // Place remaining ships randomly, avoiding misses
  while (unplacedShips.length > 0) {
    const ship = unplacedShips[0];
    let placed = false;

    while (!placed) {
      const proposedPositions = {
        startingRow: Math.floor(Math.random() * 10),
        startingColumn: Math.floor(Math.random() * 10),
        alignment: generateRandomAlignment(),
      } as const;

      if (
        checkValidShipState({
          proposedPositions,
          shipSize: ship.size,
          existingPositions: positions,
          existingBoard,
          mayOverlapHits: false,
        })
      ) {
        // Place the ship
        if (proposedPositions.alignment === 'horizontal') {
          for (let i = proposedPositions.startingColumn; i < proposedPositions.startingColumn + ship.size; i++) {
            positions[proposedPositions.startingRow][i] = { name: ship.name, status: CellStates.unguessed };
          }
        } else {
          for (let i = proposedPositions.startingRow; i < proposedPositions.startingRow + ship.size; i++) {
            positions[i][proposedPositions.startingColumn] = { name: ship.name, status: CellStates.unguessed };
          }
        }
        placed = true;
        unplacedShips.shift();
      }
    }
  }

  console.log('positions', positions);
  return positions;
};

export const checkValidShipState = ({
  proposedPositions,
  shipSize,
  existingPositions,
  mayOverlapHits = false,
  existingBoard,
}: {
  proposedPositions: { startingRow: number; startingColumn: number; alignment: 'horizontal' | 'vertical' };
  shipSize: number;
  existingPositions: PositionArray;
  mayOverlapHits?: boolean;
  existingBoard?: PositionArray;
}): boolean => {
  if (!doesShipFit(proposedPositions, shipSize)) return false;

  const potentialCoordinates = generatePotentialCoordinates(proposedPositions, shipSize);

  // Check each coordinate - return false immediately if we find an invalid position
  for (const { x, y } of potentialCoordinates) {
    let thisCell = existingPositions[y][x];
    if (thisCell) return false;

    // Check against existing board
    if (existingBoard) {
      const existingCell = existingBoard[y][x];
      if (existingCell?.status === CellStates.miss) return false;
      if (!mayOverlapHits && existingCell?.status === CellStates.hit) return false;
    }
  }

  return true;
};

export const calculateHeatMapV2 = (existingBoard: PositionArray) => {
  let placements = Array(10)
    .fill(null)
    .map(() => Array(10).fill(0));
  const numSimulations = 1000;

  // First, mark all miss positions as 0 and they will stay 0
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      if (existingBoard[y][x]?.status === CellStates.miss) {
        placements[y][x] = 0;
      }
    }
  }

  // Run multiple simulations to build up a heat map
  for (let simulation = 0; simulation < numSimulations; simulation++) {
    const boardSimulation = generateMatchingBoard(existingBoard);

    // For each cell in the simulation
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        // Only increment if it's not a miss position
        if (boardSimulation[y][x]?.name && existingBoard[y][x]?.status !== CellStates.miss) {
          placements[y][x]++;
        }
      }
    }
  }

  console.log('placements', placements);
  return placements;
};
