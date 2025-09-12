import React, { useContext, useState } from 'react';
import gameTitle from '../img/game-title.png';
import emilyHappyPng from '../img/avatars/emily/happy.png';
import AlexHappyPng from '../img/avatars/alex/happy.png';
import NatashaHappyPng from '../img/avatars/natasha/happy.png';

import { GameContext } from '../GameContext';
import { placeShips } from '../logic/placeShips';
import { AiLevel } from '../types';
import { GameEvents } from './Avatar';

export const StartScreen = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const { setAiLevel, setComputerShips, setAvatar, setgameStatus } = useContext(GameContext);

  const startGame = (difficulty: AiLevel) => {
    setAiLevel(difficulty);
    setComputerShips(placeShips());
    setGameStarted(true);
    setgameStatus('user-turn');
    setAvatar({ gameEvent: GameEvents.GAME_START });
  };

  return gameStarted ? null : (
    <div className="start-screen">
      <img src={gameTitle} alt="Battleship" className="game-title" />

      <h2>Choose your opponent</h2>
      <div className="difficulty-selector">
        <div className="difficulty-selector-item emily" onClick={() => startGame('easy')}>
          <img src={emilyHappyPng} alt="Emily" />
          <div className="difficulty-selector-item-name">
            <div className="difficulty-selector-name">Emily</div>
            <div className="difficulty-selector-description">Difficulty: easy</div>
          </div>
        </div>

        <div className="difficulty-selector-item alex" onClick={() => startGame('medium')}>
          <img src={AlexHappyPng} alt="Alex" />
          <div className="difficulty-selector-item-name">
            <div className="difficulty-selector-name">Alex</div>
            <div className="difficulty-selector-description">Difficulty: medium</div>
          </div>
        </div>

        <div className="difficulty-selector-item natasha" onClick={() => startGame('hard')}>
          <img src={NatashaHappyPng} alt="Natasha" />
          <div className="difficulty-selector-item-name">
            <div className="difficulty-selector-name">Natasha</div>
            <div className="difficulty-selector-description">Difficulty: hard</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GameScreen = () => {
  return <div>GameScreen</div>;
};
