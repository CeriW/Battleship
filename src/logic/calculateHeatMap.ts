import { HeatMapArray, PositionArray } from '../types';

export function initialiseHeatMapArray(): HeatMapArray {
  let array = [];
  for (let i = 0; i < 10; i++) {
    array[i] = new Array(10).fill(0);
  }
  return array;
}

export const calculateHeatMap = (existingBoard: PositionArray) => {
  const heatMap = initialiseHeatMapArray();

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      //  If we already have a hit in this cell, it's dead on the heatmap
      if (existingBoard[y][x]?.hit) {
        heatMap[y][x] = -1;
      }
    }
  }

  // Now we've figured out where all the hits are, we can mark the adjacent cells as possible hits
  for (let i = 0; i < 100; i++) {
    let y = Math.floor(i / 10);
    let x = i % 10;

    //  If this cell is a hit...
    if (heatMap[y][x] === -1) {
      // MARK ADJACENT CELLS AS HOT INDISCRIMINATELY ---------------------------

      // If we're not in the first row, and the cell above is not a hit, then it's hot
      if (y > 0 && heatMap[y - 1][x] !== -1) {
        heatMap[y - 1][x] += 1;
      }

      // If we're not in the last row, and the cell below is not a hit, then it's hot
      if (y < 9 && heatMap[y + 1][x] !== -1) {
        heatMap[y + 1][x] += 1;
      }

      // If we're not in the last column, and the cell to the right is not a hit, then it's hot
      if (x < 9 && heatMap[y][x + 1] !== -1) {
        heatMap[y][x + 1] += 1;
      }

      // If we're not in the first column, and the cell to the left is not a hit, then it's hot
      if (x > 0 && heatMap[y][x - 1] !== -1) {
        heatMap[y][x - 1] += 1;
      }

      // GO ALONG THE ROWS FOR EXTRA HEAT --------------------------------------

      // Is the cell to the left also a hit?
      if (x > 0 && heatMap[y][x - 1] === -1) {
        // If it is, we're going to keep going left until we find an empty space and mark it as extra hot
        for (let i = x; i >= 0; i--) {
          if (heatMap[y][i] !== -1) {
            heatMap[y][i] += 1;

            if (i - 1 >= 0) {
              heatMap[y][i - 1] += 1;
            }
            break;
          }
        }
      }
      // TODO - shouldn't go 5 steps along if the 5 long ship has already gone, for example

      // Is the cell to the right also a hit?
      if (x < 10 && heatMap[y][x + 1] === -1) {
        // If it is, we're going to keep going right until we find an empty space and mark it as extra hot
        for (let i = x; i < 9; i++) {
          if (heatMap[y][i] !== -1) {
            heatMap[y][i] += 1;

            if (i + 1 < 10) {
              heatMap[y][i + 1] += 1;
            }
            break;
          }
        }
      }

      // TODO - shouldn't go 5 steps along if the 5 long ship has already gone, for example

      // GO ALONG THE COLUMNS FOR EXTRA HEAT -----------------------------------

      // Is the cell above also a hit?
      if (y > 0 && heatMap[y - 1][x] === -1) {
        // If it is, we're going to keep going up until we find an empty space and mark it as extra hot
        for (let i = y; i >= 0; i--) {
          if (heatMap[i][x] !== -1) {
            heatMap[i][x] += 1;

            if (i - 1 >= 0) {
              heatMap[i - 1][x] += 1;
            }
            break;
          }
        }
      }
      // TODO - shouldn't go 5 steps along if the 5 long ship has already gone, for example

      // Is the cell below also a hit?
      if (y < 9 && heatMap[y + 1][x] === -1) {
        // If it is, we're going to keep going up until we find an empty space and mark it as extra hot
        for (let i = y; i < 10; i++) {
          if (heatMap[i][x] !== -1) {
            heatMap[i][x] += 1;

            if (i + 1 < 10) {
              heatMap[i + 1][x] += 1;
            }
            break;
          }
        }
      }
      // TODO - shouldn't go 5 steps along if the 5 long ship has already gone, for example
    }
  }

  return heatMap;
};
