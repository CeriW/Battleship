import React, { useContext } from 'react';
import Confetti from 'react-confetti';
import { Avatar, deriveAvatarName, deriveAvatarPronouns, GameEvents } from '../components/Avatar';
import { GameContext } from '../GameContext';
import { CellStates, PositionArray } from '../types';

export const declareWinner = (player: 'user' | 'computer'): string => (player === 'user' ? 'WINNER' : 'LOSER');

export const calculateTurnsTaken = (computerShips: PositionArray): number => {
  let unguessedCells = 0;

  for (let y = 0; y < computerShips.length; y++) {
    for (let x = 0; x < computerShips[y].length; x++) {
      const cell = computerShips[y][x];
      if (cell?.status === CellStates.unguessed || !cell) {
        unguessedCells++;
      }
    }
  }

  // Total cells (100) minus unguessed cells = number of turns taken
  return 100 - unguessedCells;
};

export const GameEndScreen = ({ winner }: { winner: 'user' | 'computer' }) => {
  const { aiLevel, computerShips, userShips, resetGame } = useContext(GameContext);

  return (
    <div className="game-end-screen">
      {winner === 'user' && <Confetti />}
      <div className="game-end-screen-content">
        <div className="game-end-header">
          <h1>{winner === 'user' ? 'Congratulations! You win!' : 'Sorry, you lose!'}</h1>
        </div>

        <div className="game-end-body">
          {winner === 'user' && (
            <p>
              You beat {deriveAvatarName(aiLevel)} in a battle of wits! It took you {calculateTurnsTaken(computerShips)}{' '}
              turns to win.
            </p>
          )}

          {winner === 'computer' && (
            <p>
              {deriveAvatarName(aiLevel)} beat you in a battle of wits! It took{' '}
              {deriveAvatarPronouns(deriveAvatarName(aiLevel))} {calculateTurnsTaken(userShips)} turns to win.
            </p>
          )}

          <Avatar gameEvent={winner === 'user' ? GameEvents.USER_WIN : GameEvents.COMPUTER_WIN} />

          <p>Would you like to play again?</p>
          <button className="button" onClick={resetGame}>
            Let's go
          </button>
        </div>
      </div>
    </div>
  );

  // if (player === 'user') {
  //   return (
  //     <div className="game-end-screen">
  //       <h1>You win!</h1>
  //       <Confetti />
  //     </div>
  //   );
  // } else if (player === 'computer') {
  //   return (
  //     <div className="game-end-screen">
  //       <h1>You lose!</h1>
  //     </div>
  //   );
  // }

  // return null;
};
