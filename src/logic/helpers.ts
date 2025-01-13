import { Alignment } from '../types';

export const generateRandomAlignment = (): Alignment => (Math.random() < 0.5 ? 'horizontal' : 'vertical');

// Return a boolean to confirm whether the ship can fit or would go off the side of the board at the proposed position
export const doesShipFit = (
  proposedCoordinates: { startingRow: number; startingColumn: number; alignment: Alignment },
  shipSize: number
): boolean => {
  if (proposedCoordinates.alignment === 'horizontal' && proposedCoordinates.startingColumn + shipSize > 10)
    return false;
  if (proposedCoordinates.alignment === 'vertical' && proposedCoordinates.startingRow + shipSize > 10) return false;
  return true;
};

// Given a starting position and alignment, return a an array of co-ordinates this ship would occupy
export const generatePotentialPositions = (
  proposedPositions: { startingRow: number; startingColumn: number; alignment: Alignment },
  shipSize: number
) => {
  // Make a list of all the cells that this ship could occupy
  const potentialCoordinates = [];
  if (proposedPositions.alignment === 'horizontal') {
    for (let i = 0; i < shipSize; i++) {
      potentialCoordinates.push({
        x: proposedPositions.startingColumn + i,
        y: proposedPositions.startingRow,
      });
    }
  } else {
    // alignment === 'vertical'
    for (let i = 0; i < shipSize; i++) {
      potentialCoordinates.push({
        x: proposedPositions.startingColumn,
        y: proposedPositions.startingRow + i,
      });
    }
  }
  return potentialCoordinates;
};
