import React, { useContext } from 'react';

import happySvg from '../img/emily/happy.svg';
import sadSvg from '../img/emily/sad.svg';
import angrySvg from '../img/emily/angry.svg';
import thinkingSvg from '../img/emily/thinking.svg';
import worriedSvg from '../img/emily/worried.svg';
import confusedSvg from '../img/emily/confused.svg';

import { GameContext } from '../GameContext';

export type Emotion = 'happy' | 'sad' | 'angry' | 'thinking' | 'worried' | 'confused';

const emotionImages = {
  happy: happySvg,
  sad: sadSvg,
  angry: angrySvg,
  thinking: thinkingSvg,
  worried: worriedSvg,
  confused: confusedSvg,
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
  }
};
