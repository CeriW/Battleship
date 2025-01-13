import { shipTypes } from '../App';
import { CellStates, HeatMapArray, PositionArray, HeatMapCell } from '../types';
import { initialiseShipArray } from './placeShips';
import { ShipInfo } from '../types';
import { doesShipFit, generatePotentialPositions, generateRandomAlignment } from './helpers';

export function initialiseHeatMapArray(): HeatMapArray {
  let array: HeatMapArray = [];

  for (let i = 0; i < 10; i++) {
    array[i] = new Array(10).fill({ heat: 0, heatMultiplier: 1 });
  }
  return array;
}

//  Cells that have been determined to be hit or miss cannot have further heat applied
const isHeatable = (cell: HeatMapCell): boolean => cell.heat !== CellStates.hit && cell.heat !== CellStates.miss;

export const calculateHeatMap = (existingBoard: PositionArray): HeatMapArray => {
  const heatMap = initialiseHeatMapArray();

  for (let i = 0; i < 100; i++) {
    let y = Math.floor(i / 10);
    let x = i % 10;

    heatMap[y][x] = { heat: existingBoard[y][x]?.status ?? 0, heatMultiplier: 1 };
  }

  // Now we've figured out where all the hits are, we can mark the adjacent cells as possible hits
  for (let i = 0; i < 100; i++) {
    let y = Math.floor(i / 10);
    let x = i % 10;

    //  If this cell is a hit...
    if (heatMap[y][x].heat === CellStates.hit) {
      // MARK ADJACENT CELLS AS HOT INDISCRIMINATELY ---------------------------

      // If we're not in the first row, and the cell above is not a hit, then it's hot
      if (y > 0 && isHeatable(heatMap[y - 1][x])) {
        heatMap[y - 1][x].heat += 1;
      }

      // If we're not in the last row, and the cell below is not a hit, then it's hot
      if (y < 9 && isHeatable(heatMap[y + 1][x])) {
        heatMap[y + 1][x].heat += 1;
      }

      // If we're not in the last column, and the cell to the right is not a hit, then it's hot
      if (x < 9 && isHeatable(heatMap[y][x + 1])) {
        heatMap[y][x + 1].heat += 1;
      }

      // If we're not in the first column, and the cell to the left is not a hit, then it's hot
      if (x > 0 && isHeatable(heatMap[y][x - 1])) {
        heatMap[y][x - 1].heat += 1;
      }

      // GO ALONG THE ROWS FOR EXTRA HEAT --------------------------------------

      // Is the cell to the left also a hit?
      if (x > 0 && isHeatable(heatMap[y][x - 1])) {
        // If it is, we're going to keep going left until we find empty space and make it even hotter
        for (let i = x; i >= 0; i--) {
          if (heatMap[y][i].heat !== CellStates.hit) {
            heatMap[y][i].heat += 1;

            if (i - 1 >= 0 && isHeatable(heatMap[y][i - 1])) {
              heatMap[y][i - 1].heat += 1;
            }
            break;
          }
        }
      }

      // Is the cell to the right also a hit?
      if (x < 10 && isHeatable(heatMap[y][x + 1])) {
        // If it is, we're going to keep going right until we find empty space and make it even hotter
        for (let i = x; i < 9; i++) {
          if (heatMap[y][i].heat !== CellStates.hit) {
            heatMap[y][i].heat += 1;

            if (i + 1 < 10 && isHeatable(heatMap[y][i + 1])) {
              heatMap[y][i + 1].heat += 1;
            }
            break;
          }
        }
      }

      // GO ALONG THE COLUMNS FOR EXTRA HEAT -----------------------------------

      // Is the cell above also a hit?
      if (y > 0 && isHeatable(heatMap[y - 1][x])) {
        // If it is, we're going to keep going up until we find empty space and make it even hotter
        for (let i = y; i >= 0; i--) {
          if (isHeatable(heatMap[i][x])) {
            heatMap[i][x].heat += 1;

            if (i - 1 >= 0 && isHeatable(heatMap[i - 1][x])) {
              heatMap[i - 1][x].heat += 1;
            }
            break;
          }
        }
      }

      // Is the cell below also a hit?
      if (y < 9 && isHeatable(heatMap[y + 1][x])) {
        // If it is, we're going to keep going up until we find empty space and make it even hotter
        for (let i = y; i < 10; i++) {
          if (isHeatable(heatMap[i][x])) {
            heatMap[i][x].heat += 1;

            if (i + 1 < 10 && isHeatable(heatMap[i + 1][x])) {
              heatMap[i + 1][x].heat += 1;
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

    if (heatMap[y][x].heat !== CellStates.hit) {
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

    heatMap[y][x].heatMultiplier = heatMultiplier;
  }

  return heatMap;
};

// Given an existingBoard of hits and misses, generate a board with ships that match
export const generateMatchingBoard = (existingBoard: PositionArray): PositionArray => {
  const positions = initialiseShipArray();
  const unplacedShips = [...shipTypes];

  // First, try to place ships on confirmed hits
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      if (existingBoard[y][x]?.status === CellStates.hit) {
        // Try both horizontal and vertical alignments
        const alignments = ['horizontal', 'vertical'] as const;

        for (const alignment of alignments) {
          // Try each remaining ship
          for (let shipIndex = 0; shipIndex < unplacedShips.length; shipIndex++) {
            const ship = unplacedShips[shipIndex];

            if (
              checkValidShipState({
                proposedPositions: { startingRow: y, startingColumn: x, alignment },
                shipSize: ship.size,
                existingPositions: positions,
                mayOverlapHits: true,
                existingBoard, // Pass the existing board to check against misses
              })
            ) {
              // Place the ship
              if (alignment === 'horizontal') {
                for (let i = x; i < x + ship.size; i++) {
                  positions[y][i] = { name: ship.name, status: CellStates.unguessed };
                }
              } else {
                for (let i = y; i < y + ship.size; i++) {
                  positions[i][x] = { name: ship.name, status: CellStates.unguessed };
                }
              }

              // Remove the placed ship from unplaced ships
              unplacedShips.splice(shipIndex, 1);
              break;
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
  // First check if ship would go out of bounds
  if (!doesShipFit(proposedPositions, shipSize)) return false;

  const potentialCoordinates = generatePotentialPositions(proposedPositions, shipSize);

  // Figure out whether the spaces are occupied by other ships
  let valid = true;

  potentialCoordinates.forEach(({ x, y }) => {
    let thisCell = existingPositions[y][x];
    if (thisCell) valid = false;

    // Check against existing board
    if (existingBoard) {
      const existingCell = existingBoard[y][x];
      if (existingCell?.status === CellStates.miss) valid = false;
      if (!mayOverlapHits && existingCell?.status === CellStates.hit) valid = false;
    }
  });

  return valid;
};

export const calculateHeatMapV2 = (existingBoard: PositionArray): HeatMapArray => {
  const heatMap = initialiseHeatMapArray();
  console.log('existingBoard', existingBoard);

  for (let i = 0; i < 100; i++) {
    let y = Math.floor(i / 10);
    let x = i % 10;

    if (existingBoard[y][x]?.status === CellStates.hit) {
      heatMap[y][x] = { ...heatMap[y][x], heat: CellStates.hit };
    }
  }

  return heatMap;
};
