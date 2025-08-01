import React, { useContext } from 'react';
import { GameContext } from '../GameContext';
import { shipTypes } from '../types';
import { CellStates } from '../types';
import { isShipSunk } from '../logic/helpers';
import { deriveAvatarName } from './Avatar';

export const status = () => {
  const { userShips, computerShips, aiLevel } = useContext(GameContext);

  const countHitsForShip = (shipName: string, ships: any) => {
    let hitCount = 0;
    for (let y = 0; y < ships.length; y++) {
      for (let x = 0; x < ships[y].length; x++) {
        const cell = ships[y][x];
        if (cell?.name === shipName && cell.status === CellStates.hit) {
          hitCount++;
        }
      }
    }
    return hitCount;
  };

  return (
    <div className="status">
      <div className="status-header">
        <div className="status-columns">
          <span> {/* deliberately empty */}</span>
          <span className="status-column-label">Yours</span>
          <span className="status-column-label">{deriveAvatarName(aiLevel)}'s</span>
        </div>
      </div>
      <div className="status-ships">
        {shipTypes.map((ship) => {
          const userHitCount = countHitsForShip(ship.name, userShips);
          const computerHitCount = countHitsForShip(ship.name, computerShips);
          const isComputerShipSunk = isShipSunk(ship.name, computerShips);

          return (
            <div key={ship.name} className="status-ship-row">
              <span className="status-ship-name">{ship.name.charAt(0).toUpperCase() + ship.name.slice(1)}</span>
              <div className="status-ship-columns">
                <span className="ship-status-indicator">
                  {Array.from({ length: ship.size }).map((_, i) => {
                    const isHit = i < userHitCount;
                    return (
                      <span key={i} className={`status-ship-cell ${isHit ? 'hit' : ''}`}>
                        &#9632;
                      </span>
                    );
                  })}
                </span>
                <span className="ship-status-indicator">
                  {Array.from({ length: ship.size }).map((_, i) => {
                    // Only show hits if the ship is completely sunk
                    const isHit = isComputerShipSunk && i < computerHitCount;
                    return (
                      <span key={i} className={`status-ship-cell ${isHit ? 'hit' : ''}`}>
                        {isHit ? '■' : '□'}
                      </span>
                    );
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
