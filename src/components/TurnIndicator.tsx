import React, { useContext } from 'react';

export const TurnIndicator = ({ playerTurn }: { playerTurn: 'user' | 'computer' }) => {
  return <div className="turn-indicator">{playerTurn === 'user' ? 'Your turn' : 'Computer turn'}</div>;
};
