import React, { useContext } from 'react';
import { GameContext } from '../GameContext';

export const TurnIndicator = ({ playerTurn }: { playerTurn: 'user' | 'computer' }) => {
  return <div className="turn-indicator">{playerTurn === 'user' ? 'Your turn' : 'Computer turn'}</div>;
};
