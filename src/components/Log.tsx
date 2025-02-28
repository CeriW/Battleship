import React, { useContext } from 'react';
import { GameContext } from '../GameContext';

export const Log = () => {
  const { log } = useContext(GameContext);

  return (
    <ul className="game-log">
      {log.map((item, index) => (
        <li key={index} className="log-entry">
          {item}
        </li>
      ))}
    </ul>
  );
};

export default Log;
