import React from 'react';
import { RowName, ShipNames } from '../types';

const deriveName = (player: 'user' | 'computer') => {
  return player === 'user' ? 'YOU' : 'COMPUTER';
};

const deriveTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
export const guessMessage = ({
  player,
  x,
  y,
  type,
}: {
  player: 'user' | 'computer';
  x: number;
  y: RowName;
  type: 'hit' | 'miss';
}) => {
  return (
    <div>
      <span>{deriveName(player)}:</span>
      <span>
        guessed {y}
        {x}, {type}
      </span>
      <span className="log-time">{deriveTime()}</span>
    </div>
  );
};

export const shipSunkMessage = ({ player, shipName }: { player: 'user' | 'computer'; shipName: ShipNames }) => {
  return (
    <div>
      <span>{deriveName(player)}:</span>
      <span>sunk {shipName}</span>
      <span className="log-time">{deriveTime()}</span>
    </div>
  );
};
