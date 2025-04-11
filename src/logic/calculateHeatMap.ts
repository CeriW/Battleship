// import { ai } from '../ai-behaviour';
import { shipTypes } from '../App';
import { CellStates, HeatMapArray, PositionArray, Alignment, ShipNames } from '../types';
import { doesShipFit, generatePotentialCoordinates, generateRandomAlignment } from './helpers';
import { isShipSunk } from './helpers';
import { GameContext } from '../GameContext';
import { useContext } from 'react';

export const HeatValues = {
  hit: 400,
  miss: 0,
  unguessed: 1,
};

// Check that for a proposed ship occupation, there are no overlaps with other ships
// Returns true if the state is valid and usable
export const checkValidShipPlacement = ({
  proposedPositions,
  shipSize,
  existingPositions,
}: // adjacentShipModifier = 0,
{
  proposedPositions: { startingRow: number; startingColumn: number; alignment: Alignment };
  shipSize: number;
  existingPositions: PositionArray;
  // adjacentShipModifier?: number; // How likely it is as a number between 0 and 1 that we will allow ships to touch each other
  // forHeatMap?: boolean;
}): boolean => {
  // First check if ship would go out of bounds
  if (!doesShipFit(proposedPositions, shipSize)) return false;

  // Generate a list of all the cells that this ship could occupy
  const potentialCoordinates = generatePotentialCoordinates(proposedPositions, shipSize);

  // Figure out whether the spaces are occupied by other ships, as well as adjacent spaces where ai disallows
  let valid = true;
  potentialCoordinates.forEach(({ x, y }) => {
    let thisCell = existingPositions[y][x];
    if (thisCell) valid = false;
  });

  return valid;
};

export function initialiseHeatMapArray(): HeatMapArray {
  let array: HeatMapArray = [];

  for (let i = 0; i < 10; i++) {
    array[i] = new Array(10).fill(HeatValues.unguessed);
  }
  return array;
}

//  Cells that have been determined to be hit or miss cannot have further heat applied
const isHeatable = (cell: number | null): boolean => {
  if (cell === HeatValues.hit || cell === HeatValues.miss) return false;
  return true;
};

type HeatMapStrategy = {
  missCoolnessRadius: 0 | 1 | 2;
};

const calculateHeatMapStrategy = (aiLevel: number): HeatMapStrategy => {
  let missCoolnessRadius; // how many cells adjacent to a miss should be considered colder

  // At AI < 5, we don't consider cells adjacent to misses cooler
  // At 5-10, we consider one cell adjacent to misses cooler
  // At 11-15, we might consider 1-2 cells adjacent to misses cooler (random)
  // At 16-19, might be 1 or 2 but probably 2 (random)
  // At 20 (maximum AI level), we always consider 2 cells adjacent to misses cooler

  if (aiLevel < 5) {
    missCoolnessRadius = 0;
  } else if (aiLevel <= 10) {
    missCoolnessRadius = 1;
  } else if (aiLevel <= 15) {
    missCoolnessRadius = Math.round(Math.random() * 2);
  } else if (aiLevel <= 19) {
    missCoolnessRadius = Math.round(Math.random() * 2.5);
  } else {
    missCoolnessRadius = 2;
  }

  return {
    missCoolnessRadius: missCoolnessRadius as 0 | 1 | 2, // how many cells adjacent to a miss should be considered colder
  };
};

const isAdjacentToHit = (existingBoard: PositionArray, x: number, y: number) => {
  if (
    y > 0 &&
    existingBoard[y - 1][x]?.status === CellStates.hit &&
    !isShipSunk(existingBoard[y - 1][x]!.name as ShipNames, existingBoard)
  ) {
    return true;
  }

  if (
    y < existingBoard.length - 1 &&
    existingBoard[y + 1][x]?.status === CellStates.hit &&
    !isShipSunk(existingBoard[y + 1][x]!.name as ShipNames, existingBoard)
  ) {
    return true;
  }

  if (
    x > 0 &&
    existingBoard[y][x - 1]?.status === CellStates.hit &&
    !isShipSunk(existingBoard[y][x - 1]!.name as ShipNames, existingBoard)
  ) {
    return true;
  }

  if (
    x < existingBoard[y].length - 1 &&
    existingBoard[y][x + 1]?.status === CellStates.hit &&
    !isShipSunk(existingBoard[y][x + 1]!.name as ShipNames, existingBoard)
  ) {
    return true;
  }

  return false;
};

const markMissAdjacentCellsColder = (
  heatMap: HeatMapArray,
  existingBoard: PositionArray,
  missCoolnessRadius: 0 | 1 | 2
) => {
  const immediatelyAdjacentCoolnessMultiplier = 0.6;
  const secondaryAdjacentCoolnessMultiplier = 0.7;
  const tertiaryAdjacentCoolnessMultiplier = 0.8;
  /* ---------------------------------------------------------------------- */
  /* COOL CELLS ADJACENT TO MISSES */
  /* If this cell is a miss, make adjacent cells colder
  /* ---------------------------------------------------------------------- */

  const newHeatMap = heatMap.map((row) => [...row]);

  for (let i = 0; i < 100; i++) {
    let y = Math.floor(i / 10);
    let x = i % 10;

    if (missCoolnessRadius > 0) {
      if (existingBoard[y][x]?.status === CellStates.miss) {
        // MARK ADJACENT CELLS AS COOL INDISCRIMINATELY --------------------------

        // If we're not in the first row, and the cell above is unknown, then it's cool
        if (y > 0 && isHeatable(heatMap[y - 1][x]) && !isAdjacentToHit(existingBoard, x, y - 1)) {
          newHeatMap[y - 1][x] *= immediatelyAdjacentCoolnessMultiplier;
        }

        // If we're not in the last row, and the cell below is unknown, then it's cool
        if (
          y < existingBoard.length - 1 &&
          isHeatable(heatMap[y + 1][x]) &&
          !isAdjacentToHit(existingBoard, x, y + 1)
        ) {
          newHeatMap[y + 1][x] *= immediatelyAdjacentCoolnessMultiplier;
        }

        // If we're not in the last column, and the cell to the right is unknown, then it's cool
        if (
          x < existingBoard[y].length - 1 &&
          isHeatable(heatMap[y][x + 1]) &&
          !isAdjacentToHit(existingBoard, x + 1, y)
        ) {
          newHeatMap[y][x + 1] *= immediatelyAdjacentCoolnessMultiplier;
        }

        // If we're not in the first column, and the cell to the left is unknown, then it's cool
        if (x > 0 && isHeatable(heatMap[y][x - 1]) && !isAdjacentToHit(existingBoard, x - 1, y)) {
          newHeatMap[y][x - 1] *= immediatelyAdjacentCoolnessMultiplier;
        }

        // GO LEFT TO RIGHT ALONG THE ROWS FOR EXTRA COOLING ---------------------

        // Is the cell to the left also a miss?
        if (x > 0 && isHeatable(heatMap[y][x - 1])) {
          // If it is, we're going to keep going left until we find an empty space and make it even cooler
          for (let i = x; i >= 0; i--) {
            if (existingBoard[y][i]?.status === CellStates.hit) {
              break;
            }

            if (isHeatable(heatMap[y][i])) {
              newHeatMap[y][i] *= immediatelyAdjacentCoolnessMultiplier;

              if (i > 0 && isHeatable(heatMap[y][i - 1]) && !isAdjacentToHit(existingBoard, i - 1, y)) {
                newHeatMap[y][i - 1] *= secondaryAdjacentCoolnessMultiplier;
              }

              if (
                missCoolnessRadius > 1 &&
                i > 1 &&
                isHeatable(heatMap[y][i - 2]) &&
                !isAdjacentToHit(existingBoard, i - 2, y)
              ) {
                newHeatMap[y][i - 2] *= tertiaryAdjacentCoolnessMultiplier;
              }
              break;
            }
          }
        }

        // Is the cell to the right also a miss?
        if (x < existingBoard[y].length - 1 && isHeatable(heatMap[y][x + 1])) {
          // If it is, we're going to keep going right until we find a miss and make it even cooler
          for (let i = x; i < existingBoard[y].length; i++) {
            if (existingBoard[y][i]?.status === CellStates.hit) {
              break;
            }

            if (isHeatable(heatMap[y][i])) {
              newHeatMap[y][i] *= secondaryAdjacentCoolnessMultiplier;

              if (
                i < existingBoard[y].length - 1 &&
                isHeatable(heatMap[y][i + 1]) &&
                !isAdjacentToHit(existingBoard, i + 1, y)
              ) {
                newHeatMap[y][i + 1] *= tertiaryAdjacentCoolnessMultiplier;
              }

              if (
                missCoolnessRadius > 1 &&
                i < existingBoard[y].length - 2 &&
                isHeatable(heatMap[y][i + 2]) &&
                !isAdjacentToHit(existingBoard, i + 2, y)
              ) {
                newHeatMap[y][i + 2] *= tertiaryAdjacentCoolnessMultiplier;
              }
              break;
            }
          }
        }

        // GO DOWN THE COLUMNS FOR EXTRA COOLING ---------------------------------

        // Is the cell above also a miss?
        if (y > 0 && isHeatable(heatMap[y - 1][x])) {
          // If it is, we're going to keep going up until we find a hit and make it even cooler
          for (let i = y; i >= 0; i--) {
            if (existingBoard[i][x]?.status === CellStates.hit) {
              break;
            }

            if (isHeatable(heatMap[i][x]) && !isAdjacentToHit(existingBoard, x, i)) {
              newHeatMap[i][x] *= immediatelyAdjacentCoolnessMultiplier;

              if (i > 0 && isHeatable(heatMap[i - 1][x]) && !isAdjacentToHit(existingBoard, x, i - 1)) {
                newHeatMap[i - 1][x] *= secondaryAdjacentCoolnessMultiplier;
              }

              if (
                missCoolnessRadius > 1 &&
                i > 1 &&
                isHeatable(heatMap[i - 2][x]) &&
                !isAdjacentToHit(existingBoard, i - 2, y)
              ) {
                newHeatMap[i - 2][x] *= tertiaryAdjacentCoolnessMultiplier;
              }

              break;
            }
          }
        }

        // Is the cell below also a miss?
        if (y < existingBoard.length - 1 && isHeatable(heatMap[y + 1][x])) {
          // If it is, we're going to keep going up until we find a hit and make it even cooler
          for (let i = y; i < existingBoard.length; i++) {
            if (existingBoard[i][x]?.status === CellStates.hit) {
              break;
            }

            if (isHeatable(heatMap[i][x]) && !isAdjacentToHit(existingBoard, x, i)) {
              newHeatMap[i][x] *= immediatelyAdjacentCoolnessMultiplier;

              if (i < existingBoard.length - 1 && isHeatable(heatMap[i + 1][x])) {
                newHeatMap[i + 1][x] *= secondaryAdjacentCoolnessMultiplier;
              }

              if (
                missCoolnessRadius > 1 &&
                i < existingBoard.length - 2 &&
                isHeatable(heatMap[i + 2][x]) &&
                !isAdjacentToHit(existingBoard, i + 2, y)
              ) {
                newHeatMap[i + 2][x] *= tertiaryAdjacentCoolnessMultiplier;
              }
              break;
            }
          }
        }
      }
    }
  }

  return newHeatMap;
};

export const calculateHeatMap = (existingBoard: PositionArray, aiLevel: number = 20): HeatMapArray => {
  let heatMap = initialiseHeatMapArray();
  const heatMapStrategy = calculateHeatMapStrategy(aiLevel);

  for (let i = 0; i < 100; i++) {
    let y = Math.floor(i / 10);
    let x = i % 10;

    heatMap[y][x] = HeatValues[existingBoard[y][x]?.status as keyof typeof HeatValues] ?? HeatValues.unguessed;
  }

  // Now we've figured out where all the hits are, we can mark the adjacent cells as possible hits

  /* ---------------------------------------------------------------------- */
  /* HEAT CELLS ADJACENT TO HITS */
  /* ---------------------------------------------------------------------- */

  const immediatelyAdjacentExtraHeat = 2;
  const secondaryAdjacentExtraHeat = 1.5;

  for (let i = 0; i < 100; i++) {
    let y = Math.floor(i / 10);
    let x = i % 10;

    //  If this cell is a hit...
    const thisCell = existingBoard[y][x];
    if (thisCell?.status === CellStates.hit && thisCell?.name && !isShipSunk(thisCell!.name, existingBoard)) {
      // MARK ADJACENT CELLS AS HOT INDISCRIMINATELY ---------------------------

      // If we're not in the first row, and the cell above is not a hit, then it's hot
      if (y > 0 && isHeatable(heatMap[y - 1][x])) {
        heatMap[y - 1][x] *= immediatelyAdjacentExtraHeat;
      }

      // If we're not in the last row, and the cell below is not a hit, then it's hot
      if (y < existingBoard.length - 1 && isHeatable(heatMap[y + 1][x])) {
        heatMap[y + 1][x] *= immediatelyAdjacentExtraHeat;
      }

      // If we're not in the last column, and the cell to the right is not a hit, then it's hot
      if (x < existingBoard[y].length - 1 && isHeatable(heatMap[y][x + 1])) {
        heatMap[y][x + 1] *= immediatelyAdjacentExtraHeat;
      }

      // If we're not in the first column, and the cell to the left is not a hit, then it's hot
      if (x > 0 && isHeatable(heatMap[y][x - 1])) {
        heatMap[y][x - 1] *= immediatelyAdjacentExtraHeat;
      }

      // GO LEFT TO RIGHT ALONG THE ROWS FOR EXTRA HEAT ------------------------

      // Is the cell to the right also a hit?
      if (x > 0 && existingBoard[y][x - 1]?.status === CellStates.hit) {
        // If it is, we're going to keep going left until we find empty space and make it even hotter
        for (let i = x; i >= 0; i--) {
          if (existingBoard[y][i]?.status === CellStates.miss) {
            break;
          }

          if (isHeatable(heatMap[y][i])) {
            heatMap[y][i] *= secondaryAdjacentExtraHeat;

            if (i > 0 && isHeatable(heatMap[y][i - 1])) {
              heatMap[y][i - 1] *= secondaryAdjacentExtraHeat;
            }
            break;
          }
        }
      }

      // Is the cell to the left also a hit?
      if (x < existingBoard[y].length - 1 && existingBoard[y][x + 1]?.status === CellStates.hit) {
        // If it is, we're going to keep going right until we find empty space and make it even hotter
        for (let i = x; i < existingBoard[y].length; i++) {
          if (existingBoard[y][i]?.status === CellStates.miss) {
            break;
          }

          if (isHeatable(heatMap[y][i])) {
            heatMap[y][i] *= secondaryAdjacentExtraHeat;

            if (i < existingBoard[y].length - 1 && isHeatable(heatMap[y][i + 1])) {
              heatMap[y][i + 1] *= secondaryAdjacentExtraHeat;
            }
            break;
          }
        }
      }

      // GO DOWN THE COLUMNS FOR EXTRA HEAT -----------------------------------

      // Is the cell above also a hit?
      if (y > 0 && existingBoard[y - 1][x]?.status === CellStates.hit) {
        // If it is, we're going to keep going up until we find empty space and make it even hotter
        for (let i = y; i >= 0; i--) {
          if (existingBoard[i][x]?.status === CellStates.miss) {
            break;
          }

          if (isHeatable(heatMap[i][x])) {
            heatMap[i][x] *= secondaryAdjacentExtraHeat;

            if (i > 0 && isHeatable(heatMap[i - 1][x])) {
              heatMap[i - 1][x] *= secondaryAdjacentExtraHeat;
            }
            break;
          }
        }
      }

      // Is the cell below also a hit?
      if (y < existingBoard.length - 1 && existingBoard[y + 1][x]?.status === CellStates.hit) {
        // If it is, we're going to keep going up until we find empty space and make it even hotter
        for (let i = y; i < existingBoard.length; i++) {
          if (existingBoard[i][x]?.status === CellStates.miss) {
            break;
          }

          if (isHeatable(heatMap[i][x])) {
            heatMap[i][x] *= secondaryAdjacentExtraHeat;

            if (i < existingBoard.length - 1 && isHeatable(heatMap[i + 1][x])) {
              heatMap[i + 1][x] *= secondaryAdjacentExtraHeat;
            }
            break;
          }
        }
      }
    }
  }

  if (heatMapStrategy.missCoolnessRadius > 0) {
    heatMap = markMissAdjacentCellsColder(heatMap, existingBoard, heatMapStrategy.missCoolnessRadius);
  }

  //  Now we've applied some general heat, let's figure out whether ships can fit in the spaces available
  // e.g. a 1x1 gap surrounded by misses can't possible have a ship in it

  for (let i = 0; i < 100; i++) {
    let y = Math.floor(i / 10);
    let x = i % 10;

    let heatMultiplier = 0;

    if (existingBoard[y][x]?.status !== CellStates.hit && existingBoard[y][x]?.status !== CellStates.miss) {
      shipTypes.forEach((ship) => {
        if (isShipSunk(ship.name, existingBoard)) return;

        // TODO - an adjacent ship modifier of 1 creates a perfect heat map which results in unhumanlike guesses
        // What is the solution?
        // adjust the modifier based on AI which creates more randomness?
        // Adjust makeComputerGuess to not guess in proximity to other guesses?
        const adjacentShipModifier = 1;

        if (
          checkValidShipPlacement({
            proposedPositions: { startingRow: y, startingColumn: x, alignment: 'horizontal' },
            shipSize: ship.size,
            existingPositions: existingBoard,
          })
        ) {
          heatMultiplier += 1;
        }

        if (
          checkValidShipPlacement({
            proposedPositions: { startingRow: y, startingColumn: x, alignment: 'vertical' },
            shipSize: ship.size,
            existingPositions: existingBoard,
          })
        ) {
          heatMultiplier += 1;
        }

        if (x - ship.size >= 0) {
          if (
            checkValidShipPlacement({
              proposedPositions: { startingRow: y, startingColumn: x - ship.size, alignment: 'horizontal' },
              shipSize: ship.size,
              existingPositions: existingBoard,
            })
          ) {
            heatMultiplier += 1;
          }
        }

        if (y - ship.size >= 0) {
          if (
            checkValidShipPlacement({
              proposedPositions: { startingRow: y - ship.size, startingColumn: x, alignment: 'vertical' },
              shipSize: ship.size,
              existingPositions: existingBoard,
            })
          ) {
            heatMultiplier += 1;
          }
        }
      });
    }

    // TODO - does this need modifying to account for sunk ships?
    heatMap[y][x] += heatMultiplier / (shipTypes.length * 4);
  }

  return heatMap;
};
