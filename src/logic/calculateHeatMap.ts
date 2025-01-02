import { CellStates, HeatMapArray, PositionArray } from '../types';

export function initialiseHeatMapArray(): HeatMapArray {
  let array = [];
  for (let i = 0; i < 10; i++) {
    array[i] = new Array(10).fill(0);
  }
  return array;
}

const hasNotBeenHit = (cell: CellStates) => {
  return cell !== CellStates.hit && cell !== CellStates.miss;
};

export const calculateHeatMap = (existingBoard: PositionArray) => {
  const heatMap = initialiseHeatMapArray();

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      //  If we already have a hit in this cell, it' s dead on the heatmap
      // if (existingBoard[y][x]?.hit) {
      //   heatMap[y][x] = -1;
      // }

      console.log(existingBoard[y][x]);

      heatMap[y][x] = existingBoard[y][x]?.hit ?? 0;
    }
  }

  // Now we've figured out where all the hits are, we can mark the adjacent cells as possible hits
  for (let i = 0; i < 100; i++) {
    let y = Math.floor(i / 10);
    let x = i % 10;

    //  If this cell is a hit...
    if (heatMap[y][x] === CellStates.hit) {
      // MARK ADJACENT CELLS AS HOT INDISCRIMINATELY ---------------------------

      // If we're not in the first row, and the cell above is not a hit, then it's hot
      if (y > 0 && hasNotBeenHit(heatMap[y - 1][x])) {
        heatMap[y - 1][x] += 1;
      }

      // If we're not in the last row, and the cell below is not a hit, then it's hot
      if (y < 9 && hasNotBeenHit(heatMap[y + 1][x])) {
        heatMap[y + 1][x] += 1;
      }

      // If we're not in the last column, and the cell to the right is not a hit, then it's hot
      if (x < 9 && hasNotBeenHit(heatMap[y][x + 1])) {
        heatMap[y][x + 1] += 1;
      }

      // If we're not in the first column, and the cell to the left is not a hit, then it's hot
      if (x > 0 && hasNotBeenHit(heatMap[y][x - 1])) {
        heatMap[y][x - 1] += 1;
      }

      // GO ALONG THE ROWS FOR EXTRA HEAT --------------------------------------

      // Is the cell to the left also a hit?
      if (x > 0 && hasNotBeenHit(heatMap[y][x - 1])) {
        // If it is, we're going to keep going left until we find an empty space and make it even hotter
        for (let i = x; i >= 0; i--) {
          if (heatMap[y][i] !== -1) {
            heatMap[y][i] += 1;

            if (i - 1 >= 0 && hasNotBeenHit(heatMap[y][i - 1])) {
              heatMap[y][i - 1] += 1;
            }
            break;
          }
        }
      }

      // Is the cell to the right also a hit?
      if (x < 10 && hasNotBeenHit(heatMap[y][x + 1])) {
        // If it is, we're going to keep going right until we find an empty space and make it even hotter
        for (let i = x; i < 9; i++) {
          if (heatMap[y][i] !== -1) {
            heatMap[y][i] += 1;

            if (i + 1 < 10 && hasNotBeenHit(heatMap[y][i + 1])) {
              heatMap[y][i + 1] += 1;
            }
            break;
          }
        }
      }

      // GO ALONG THE COLUMNS FOR EXTRA HEAT -----------------------------------

      // Is the cell above also a hit?
      if (y > 0 && heatMap[y - 1][x] === -1) {
        // If it is, we're going to keep going up until we find an empty space and make it even hotter
        for (let i = y; i >= 0; i--) {
          if (hasNotBeenHit(heatMap[i][x])) {
            heatMap[i][x] += 1;

            if (i - 1 >= 0) {
              heatMap[i - 1][x] += 1;
            }
            break;
          }
        }
      }

      // Is the cell below also a hit?
      if (y < 9 && heatMap[y + 1][x] === -1) {
        // If it is, we're going to keep going up until we find an empty space and make it even hotter
        for (let i = y; i < 10; i++) {
          if (hasNotBeenHit(heatMap[i][x])) {
            heatMap[i][x] += 1;

            if (i + 1 < 10) {
              heatMap[i + 1][x] += 1;
            }
            break;
          }
        }
      }
    }
  }

  return heatMap;
};
