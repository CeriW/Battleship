import React, { useContext } from 'react';
import { GameContext } from '../GameContext';

export const TurnIndicator = ({ playerTurn }: { playerTurn: 'user' | 'computer' }) => {
  return (
    <div className="turn-indicator">
      <h3>Turn Indicator</h3>
      <p>Current turn: {playerTurn}</p>
    </div>
  );
};
