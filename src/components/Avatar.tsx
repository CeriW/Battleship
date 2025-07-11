import React, { useContext } from 'react';

import happyPng from '../img/emily/happy.png';
import sadPng from '../img/emily/sad.png';
import angryPng from '../img/emily/angry.png';
import thinkingPng from '../img/emily/thinking.png';
import worriedPng from '../img/emily/worried.png';
import confusedPng from '../img/emily/confused.png';

import { GameContext } from '../GameContext';

export type Emotion = 'happy' | 'sad' | 'angry' | 'thinking' | 'worried' | 'confused';

const emotionImages = {
  happy: happyPng,
  sad: sadPng,
  angry: angryPng,
  thinking: thinkingPng,
  worried: worriedPng,
  confused: confusedPng,
};

export enum GameEvents {
  USER_MISS = 'user-miss',
  USER_HIT = 'user-hit',
  USER_SUNK_OPPONENT = 'user-sunk-opponent',
  USER_WIN = 'user-win',
  USER_LOSE = 'user-lose',

  COMPUTER_MISS = 'computer-miss',
  COMPUTER_HIT = 'computer-hit',
  COMPUTER_SUNK_USER = 'computer-sunk-user',
  COMPUTER_WIN = 'computer-win',
  COMPUTER_LOSE = 'computer-lose',

  COMPUTER_THINKING = 'computer-thinking',
}

export const AvatarImage = ({ emotion }: { emotion: Emotion }) => {
  const { avatar } = useContext(GameContext);

  return (
    <div className="avatar">
      <img src={emotionImages[emotion]} alt={`Emily ${emotion}`} />
    </div>
  );
};

export const deriveAvatarEmotion = ({ gameEvent }: { gameEvent: GameEvents }) => {
  switch (gameEvent) {
    case GameEvents.USER_MISS:
      return 'happy';
    case GameEvents.USER_HIT:
      return 'worried';
    case GameEvents.USER_SUNK_OPPONENT:
      return 'angry';
    case GameEvents.USER_WIN:
      return 'sad';
    case GameEvents.USER_LOSE:
      return 'happy';

    case GameEvents.COMPUTER_MISS:
      return 'confused';
    case GameEvents.COMPUTER_HIT:
      return 'happy';
    case GameEvents.COMPUTER_SUNK_USER:
      return 'happy';
    case GameEvents.COMPUTER_WIN:
      return 'happy';
    case GameEvents.COMPUTER_LOSE:
      return 'sad';

    case GameEvents.COMPUTER_THINKING:
      return 'thinking';
  }
};
