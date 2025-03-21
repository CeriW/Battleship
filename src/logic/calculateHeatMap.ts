// import { ai } from '../ai-behaviour';
import { shipTypes } from '../App';
import { CellStates, HeatMapArray, PositionArray, Alignment } from '../types';
import { doesShipFit, generatePotentialCoordinates, generateRandomAlignment } from './helpers';
import { checkValidShipState } from './placeShips';

// TODO - while this file works, it does not produce logic that a human would agree with and needs a major rework.

export function initialiseHeatMapArray(): HeatMapArray {
  let array: HeatMapArray = [];

  for (let i = 0; i < 10; i++) {
    array[i] = new Array(10).fill(0);
  }
  return array;
}

const generateValidShipPlacement = (startingPoint: number, size: number, alignment: Alignment): number => {
  const min = Math.max(0, startingPoint - (size - 1));
  const max = Math.min(9 - (alignment === 'vertical' ? size - 1 : 0), startingPoint);
  return min + Math.floor(Math.random() * (max - min + 1));
};

// Given an existingBoard of hits and misses, generate a board with ships that match
export const generateMatchingBoard = (existingBoard: PositionArray): PositionArray => {
  // Initialize the positions array properly
  const positions: PositionArray = Array(10)
    .fill(null)
    .map(() => Array(10).fill(0));

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
            const proposedRow = alignment === 'horizontal' ? y : generateValidShipPlacement(y, ship.size, alignment);
            const proposedColumn = alignment === 'vertical' ? x : generateValidShipPlacement(x, ship.size, alignment);

            return shipSpaceIsAvailable({
              proposedPositions: {
                startingRow: proposedRow,
                startingColumn: proposedColumn,
                alignment,
              },
              shipSize: ship.size,
              existingPositions: positions,
              existingBoard,
            });
          });

          if (validShips.length > 0) {
            const randomIndex = Math.floor(Math.random() * validShips.length);
            const ship = validShips[randomIndex];

            const proposedRow = alignment === 'horizontal' ? y : generateValidShipPlacement(y, ship.size, alignment);
            const proposedColumn = alignment === 'vertical' ? x : generateValidShipPlacement(x, ship.size, alignment);

            // Place the ship
            if (alignment === 'horizontal') {
              for (let i = proposedColumn; i < proposedColumn + ship.size; i++) {
                positions[proposedRow][i] = { name: ship.name, status: CellStates.unguessed };
              }
            } else {
              for (let i = proposedRow; i < proposedRow + ship.size; i++) {
                positions[i][proposedColumn] = { name: ship.name, status: CellStates.unguessed };
              }
            }

            const shipIndex = unplacedShips.findIndex((s) => s.name === ship.name);
            unplacedShips.splice(shipIndex, 1);
            placed = true;
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
        shipSpaceIsAvailable({
          proposedPositions,
          shipSize: ship.size,
          existingPositions: positions,
          existingBoard,
        })
      ) {
        // Place the ship
        if (proposedPositions.alignment === 'horizontal') {
          for (let i = proposedPositions.startingColumn; i < proposedPositions.startingColumn + ship.size; i++) {
            positions[proposedPositions.startingRow][i] = {
              name: ship.name,
              status: CellStates.unguessed,
            };
          }
        } else {
          for (let i = proposedPositions.startingRow; i < proposedPositions.startingRow + ship.size; i++) {
            positions[i][proposedPositions.startingColumn] = {
              name: ship.name,
              status: CellStates.unguessed,
            };
          }
        }
        placed = true;
        unplacedShips.shift();
      }
    }
  }

  return positions;
};

export const shipSpaceIsAvailable = ({
  proposedPositions,
  shipSize,
  existingPositions,
  existingBoard,
}: {
  proposedPositions: { startingRow: number; startingColumn: number; alignment: Alignment };
  shipSize: number;
  existingPositions: PositionArray;
  existingBoard?: PositionArray;
}): boolean => {
  if (!doesShipFit(proposedPositions, shipSize)) return false;

  const potentialCoordinates = generatePotentialCoordinates(proposedPositions, shipSize);

  for (const { x, y } of potentialCoordinates) {
    let thisCell = existingPositions[y][x];
    if (thisCell) return false;

    if (existingBoard) {
      const existingCell = existingBoard[y][x];
      if (existingCell?.status === CellStates.miss) return false;
    }
  }

  return true;
};

const getHeat = (status: CellStates): number | null => {
  if (status === CellStates.hit) return 400;
  if (status === CellStates.miss) return 0;
  return 0;
};

const HeatValues = {
  hit: 400,
  miss: 0,
  unguessed: 1,
};

//  Cells that have been determined to be hit or miss cannot have further heat applied
const isHeatable = (cell: number | null): boolean => cell !== HeatValues.hit && cell !== HeatValues.miss;
// const isHeatable = (cell: number): boolean => true;

export const calculateHeatMap = (existingBoard: PositionArray): HeatMapArray => {
  const heatMap = initialiseHeatMapArray();
  console.log(existingBoard);

  for (let i = 0; i < 100; i++) {
    let y = Math.floor(i / 10);
    let x = i % 10;

    // heatMap[y][x] = { heat: existingBoard[y][x]?.status ?? 0, heatMultiplier: 1 };
    // heatMap[y][x] = getHeat(existingBoard[y][x]?.status ?? CellStates.unguessed);
    heatMap[y][x] = HeatValues[existingBoard[y][x]?.status ?? CellStates.unguessed];
    // console.log(heatMap[y][x]);
  }

  // Now we've figured out where all the hits are, we can mark the adjacent cells as possible hits
  for (let i = 0; i < 100; i++) {
    let y = Math.floor(i / 10);
    let x = i % 10;

    //  If this cell is a hit...
    if (existingBoard[y][x]?.status === CellStates.hit) {
      // MARK ADJACENT CELLS AS HOT INDISCRIMINATELY ---------------------------

      // If we're not in the first row, and the cell above is not a hit, then it's hot
      if (y > 0 && existingBoard[y - 1][x]?.status !== CellStates.hit) {
        heatMap[y - 1][x] += 1;
      }

      // If we're not in the last row, and the cell below is not a hit, then it's hot
      if (y < 9 && existingBoard[y + 1][x]?.status !== CellStates.hit) {
        heatMap[y + 1][x] += 1;
      }

      // If we're not in the last column, and the cell to the right is not a hit, then it's hot
      if (x < 9 && existingBoard[y][x + 1]?.status !== CellStates.hit) {
        heatMap[y][x + 1] += 1;
      }

      // If we're not in the first column, and the cell to the left is not a hit, then it's hot
      if (x > 0 && existingBoard[y][x - 1]?.status !== CellStates.hit) {
        heatMap[y][x - 1] += 1;
      }

      // GO ALONG THE ROWS FOR EXTRA HEAT --------------------------------------

      // Is the cell to the left also a hit?
      if (x > 0 && existingBoard[y][x - 1]?.status !== CellStates.hit) {
        // If it is, we're going to keep going left until we find empty space and make it even hotter
        for (let i = x; i >= 0; i--) {
          if (existingBoard[y][i]?.status !== CellStates.hit) {
            heatMap[y][i] += 1;

            if (i - 1 >= 0 && existingBoard[y][i - 1]?.status !== CellStates.hit) {
              heatMap[y][i - 1] += 1;
            }
            break;
          }
        }
      }

      // Is the cell to the right also a hit?
      if (x < 10 && existingBoard[y][x + 1]?.status !== CellStates.hit) {
        // If it is, we're going to keep going right until we find empty space and make it even hotter
        for (let i = x; i < 9; i++) {
          if (existingBoard[y][i]?.status !== CellStates.hit) {
            heatMap[y][i] += 1;

            if (i + 1 < 10 && existingBoard[y][i + 1]?.status !== CellStates.hit) {
              heatMap[y][i + 1] += 1;
            }
            break;
          }
        }
      }

      // GO ALONG THE COLUMNS FOR EXTRA HEAT -----------------------------------

      // Is the cell above also a hit?
      if (y > 0 && existingBoard[y - 1][x]?.status !== CellStates.hit) {
        // If it is, we're going to keep going up until we find empty space and make it even hotter
        for (let i = y; i >= 0; i--) {
          if (existingBoard[i][x]?.status !== CellStates.hit) {
            heatMap[i][x] += 1;

            if (i - 1 >= 0 && existingBoard[i - 1][x]?.status !== CellStates.hit) {
              heatMap[i - 1][x] += 1;
            }
            break;
          }
        }
      }

      // Is the cell below also a hit?
      if (y < 9 && existingBoard[y + 1][x]?.status !== CellStates.hit) {
        // If it is, we're going to keep going up until we find empty space and make it even hotter
        for (let i = y; i < 10; i++) {
          if (existingBoard[i][x]?.status !== CellStates.hit) {
            heatMap[i][x] += 1;

            if (i + 1 < 10 && existingBoard[i + 1][x]?.status !== CellStates.hit) {
              heatMap[i + 1][x] += 1;
            }
            break;
          }
        }
      }
    }
  }

  //  Now we've applied some general heat, let's figure out whether ships can fit in the spaces available
  // Calculated as such:
  // +1 for every ship type that can fit here horizontally
  // +1 for every ship type that can fit here vertically
  // will result in 0 for a space where no ships can fit (e.g. a 1x1 gap)
  // will result in 10 for a space where every ship could fit horizontally and vertically (e.g. a 5x5 gap)
  // and everything in between

  for (let i = 0; i < 100; i++) {
    let y = Math.floor(i / 10);
    let x = i % 10;

    let heatMultiplier = 0;

    if (existingBoard[y][x]?.status !== CellStates.hit) {
      shipTypes.forEach((ship) => {
        if (
          checkValidShipState({
            proposedPositions: { startingRow: y, startingColumn: x, alignment: 'horizontal' },
            shipSize: ship.size,
            existingPositions: existingBoard,
            mayOverlapHits: true,
          })
        ) {
          heatMultiplier += 1;
        }

        if (
          checkValidShipState({
            proposedPositions: { startingRow: y, startingColumn: x, alignment: 'vertical' },
            shipSize: ship.size,
            existingPositions: existingBoard,
            mayOverlapHits: true,
          })
        ) {
          heatMultiplier += 1;
        }
      });
    }

    // heatMap[y][x].heatMultiplier = heatMultiplier;
  }

  console.log(heatMap);

  return heatMap;
};
