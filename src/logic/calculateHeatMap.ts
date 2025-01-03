import { shipTypes } from '../App';
import { CellStates, HeatMapArray, PositionArray, HeatMapCell } from '../types';
import { checkValidShipState } from './placeShips';

export function initialiseHeatMapArray(): HeatMapArray {
  let array: HeatMapArray = [];

  for (let i = 0; i < 10; i++) {
    array[i] = new Array(10).fill({ heat: 0, heatMultiplier: 1 });
  }
  return array;
}

//  Cells that have been determined to be hit or miss cannot have further heat applied
const isHeatable = (cell: HeatMapCell): boolean => {
  return cell.heat !== CellStates.hit && cell.heat !== CellStates.miss;
};

export const calculateHeatMap = (existingBoard: PositionArray): HeatMapArray => {
  console.log('existingBoard', existingBoard);

  const heatMap = initialiseHeatMapArray();

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      heatMap[y][x] = { heat: existingBoard[y][x]?.hit ?? 0, heatMultiplier: 1 };
    }
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
        // If it is, we're going to keep going left until we find an empty space and make it even hotter
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
        // If it is, we're going to keep going right until we find an empty space and make it even hotter
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
      if (y > 0 && heatMap[y - 1][x].heat === CellStates.hit) {
        // If it is, we're going to keep going up until we find an empty space and make it even hotter
        for (let i = y; i >= 0; i--) {
          if (isHeatable(heatMap[i][x])) {
            heatMap[i][x].heat += 1;

            if (i - 1 >= 0) {
              heatMap[i - 1][x].heat += 1;
            }
            break;
          }
        }
      }

      // Is the cell below also a hit?
      if (y < 9 && heatMap[y + 1][x].heat === CellStates.hit) {
        // If it is, we're going to keep going up until we find an empty space and make it even hotter
        for (let i = y; i < 10; i++) {
          if (isHeatable(heatMap[i][x])) {
            heatMap[i][x].heat += 1;

            if (i + 1 < 10) {
              heatMap[i + 1][x].heat += 1;
            }
            break;
          }
        }
      }
    }
  }

  //  Now we've applied some general heat, let's figure out whether ships can fit in the spaces available
  for (let i = 0; i < 100; i++) {
    let y = Math.floor(i / 10);
    let x = i % 10;

    let heatMultiplier = 0;

    shipTypes.forEach((ship) => {
      if (
        checkValidShipState({
          proposedPositions: { startingRow: y, startingColumn: x, alignment: 'horizontal' },
          shipSize: ship.size,
          existingPositions: existingBoard,
          adjacentShipModifier: 1,
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
          adjacentShipModifier: 1,
          mayOverlapHits: true,
        })
      ) {
        heatMultiplier += 1;
      }
    });

    heatMap[y][x].heatMultiplier = heatMultiplier;
  }

  console.log(heatMap);

  return heatMap;
};
