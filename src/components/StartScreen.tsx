import React, { useContext } from 'react';
import gameTitle from '../img/game-title.png';
import emilyHappyPng from '../img/avatars/emily/happy.png';
import AlexHappyPng from '../img/avatars/alex/happy.png';
import NatashaHappyPng from '../img/avatars/natasha/happy.png';

import { GameContext } from '../GameContext';

export const StartScreen = () => {
  const { setAiLevel } = useContext(GameContext);
  return (
    <div className="start-screen">
      <img src={gameTitle} alt="Battleship" className="game-title" />

      <h2>Choose your opponent</h2>
      <div className="difficulty-selector">
        <div className="difficulty-selector-item emily" onClick={() => setAiLevel('easy')}>
          <img src={emilyHappyPng} alt="Emily" />
          <div className="difficulty-selector-item-name">
            <div className="difficulty-selector-name">Emily</div>
            <div className="difficulty-selector-description">Difficulty: easy</div>
          </div>
        </div>

        <div className="difficulty-selector-item alex" onClick={() => setAiLevel('medium')}>
          <img src={AlexHappyPng} alt="Alex" />
          <div className="difficulty-selector-item-name">
            <div className="difficulty-selector-name">Alex</div>
            <div className="difficulty-selector-description">Difficulty: medium</div>
          </div>
        </div>

        <div className="difficulty-selector-item natasha" onClick={() => setAiLevel('hard')}>
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
