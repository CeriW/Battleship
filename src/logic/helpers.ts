import { Alignment, CellStates, PositionArray, ShipNames } from '../types';
import { GameContext } from '../GameContext';
import { useContext } from 'react';
import React from 'react'
// import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'

export const generateRandomAlignment = (): Alignment => (Math.random() < 0.5 ? 'horizontal' : 'vertical');

// Return a boolean to confirm whether the ship can fit or whether it would go off the side of the board at the proposed position
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
export const generatePotentialCoordinates = (
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

// For a given ship name, return true if all the cells for that ship are hit
export const isShipSunk = (shipName: ShipNames, board: PositionArray) => {
  const shipCells = board.flat().filter((ship) => ship?.name === shipName);
  return shipCells.every((ship) => ship?.status === CellStates.hit);
};

export const checkAllShipsSunk = (board: PositionArray) => {
  // Get all ship cells
  const shipCells = board.flat().filter((ship) => ship?.name);

  // Is every ship cell hit?
  return shipCells.every((ship) => ship?.status === CellStates.hit);
};
