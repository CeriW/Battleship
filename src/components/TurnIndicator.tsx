import React, { useContext } from 'react';

export const TurnIndicator = ({ playerTurn }: { playerTurn: string }) => {
  return <div className="turn-indicator">{playerTurn}</div>;
};
