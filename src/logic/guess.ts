import { initialiseShipArray, PositionArray, shipTypes, checkValidShipState } from './placeShips';

export type HeatMapArray = number[][];

export function initialiseHeatMapArray(): HeatMapArray {
  let array = [];
  for (let i = 0; i < 10; i++) {
    array[i] = new Array(10).fill(0);
  }
  return array;
}

const makeGuess = (existingBoard: PositionArray) => {
  // console.log(existingBoard);

  const x = Math.floor(Math.random() * 10);
  const y = Math.floor(Math.random() * 10);

  console.log(existingBoard[y][x]);
  // heatMap(existingBoard);
  return !!existingBoard[y][x];
};

export const initialiseHeatMap = (existingBoard: PositionArray) => {
  const heatMap = initialiseHeatMapArray();

  console.log('existingBoard', existingBoard);

  // console.log(shipTypes);

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
      // ADJACENT CELLS INDISCRIMINATELY ------------------------------------------------------------

      // If we're not in the first row, and the cell above is not a hit, then it's hot
      if (y > 0 && heatMap[y - 1][x] !== -1) {
        heatMap[y - 1][x] += 1;
      }

      // If we're not in the last row, and the cell below is not a hit, then it's hot
      if (y < 10 && heatMap[y + 1][x] !== -1) {
        heatMap[y + 1][x] += 1;
      }

      // If we're not in the last column, and the cell to the right is not a hit, then it's hot
      if (x < 10 && heatMap[y][x + 1] !== -1) {
        heatMap[y][x + 1] += 1;
      }

      // If we're not in the last column, and the cell to the left is not a hit, then it's hot
      if (x > 0 && heatMap[y][x - 1] !== -1) {
        heatMap[y][x - 1] += 1;
      }

      // GO ALONG THE ROWS ------------------------------------------------------------------------

      if (heatMap[y][x] === -1) {
        // Is the cell to the left also a hit?
        if (x > 0 && heatMap[y][x - 1] === -1) {
          // If it is, we're going to keep going left until we find an empty space and mark it as extra hot
          for (let i = x; i >= 0; i--) {
            if (heatMap[y][i] !== -1) {
              heatMap[y][i] += 1;
            }
          }
        }
        // TODO - shouldn't go 5 steps along if the 5 long ship has already gone, for example

        // Is the cell to the right also a hit?
        if (x < 10 && heatMap[y][x + 1] === -1) {
          // If it is, we're going to keep going right until we find an empty space and mark it as extra hot
          for (let i = x; i < 10; i++) {
            if (heatMap[y][i] !== -1) {
              heatMap[y][i] += 1;
              heatMap[y][i + 1] += 1;
              break;
            }
          }
        }

        // TODO - shouldn't go 5 steps along if the 5 long ship has already gone, for example

        // Is the cell above also a hit?
        if (y > 0 && heatMap[y - 1][x] === -1) {
          // If it is, we're going to keep going up until we find an empty space and mark it as extra hot
          for (let i = y; i >= 0; i--) {
            if (heatMap[i][x] !== -1) {
              heatMap[i][x] += 1;
            }
          }
        }
        // TODO - shouldn't go 5 steps along if the 5 long ship has already gone, for example

        // Is the cell below also a hit?
        if (y < 10 && heatMap[y + 1][x] === -1) {
          // If it is, we're going to keep going up until we find an empty space and mark it as extra hot
          for (let i = y; i < 10; i++) {
            if (heatMap[i][x] !== -1) {
              heatMap[i][x] += 1;
              heatMap[i + 1][x] += 1;
              break;
            }
          }
        }
        // TODO - shouldn't go 5 steps along if the 5 long ship has already gone, for example
      }
    }
  }

  //  For each type of ship...
  shipTypes.forEach((ship) => {});

  console.log('heatMap', heatMap);

  return heatMap;
};

// const heatMap = (existingBoard: PositionArray) => {
//   const heatMap = initialiseHeatMap();
//   // console.log('heatMap', heatMap);

//   // Let's figure out how likely it is that the carrier (5 tiles long) is in any given square

//   for (let x = 0; x < 10; x++) {
//     for (let y = 0; y < 10; y++) {
//       if (existingBoard[x][y]) {
//         heatMap[y][x] = 'possible';
//       }
//     }
//   }

//   console.log('heatMap', heatMap);
// };

export default makeGuess;
