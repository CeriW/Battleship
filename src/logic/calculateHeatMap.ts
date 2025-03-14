// import { ai } from '../ai-behaviour';
import { shipTypes } from '../App';
import { CellStates, HeatMapArray, PositionArray, Alignment } from '../types';
import { doesShipFit, generatePotentialCoordinates, generateRandomAlignment } from './helpers';

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

export const calculateHeatMap = (existingBoard: PositionArray, heatMapSimulations: number = 400) => {
  let placements = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));

  // for (let y = 0; y < 10; y++) {
  //   for (let x = 0; x < 10; x++) {
  //     if (existingBoard[y][x]?.status === CellStates.miss) {
  //       placements[y][x] = 0;
  //     }

  //     if (existingBoard[y][x]?.status === CellStates.hit) {
  //       placements[y][x] = ai.heatMapSimulations;
  //     }
  //   }
  // }

  for (let simulation = 0; simulation < heatMapSimulations; simulation++) {
    const boardSimulation = generateMatchingBoard(existingBoard);

    // For each cell in the simulation
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        if (
          boardSimulation[y][x]?.name &&
          existingBoard[y][x]?.status !== CellStates.miss &&
          existingBoard[y][x]?.status !== CellStates.hit
        ) {
          placements[y][x]++;
        }

        if (existingBoard[y][x]?.status === CellStates.miss) {
          placements[y][x] = 0;
        }

        if (existingBoard[y][x]?.status === CellStates.hit) {
          placements[y][x] = heatMapSimulations;
        }
      }
    }
  }

  return placements;
};
