import React, { useContext } from 'react';
import { AiLevel } from '../types';

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

export const Avatar = ({ gameEvent }: { gameEvent: GameEvents }) => {
  const { aiLevel } = useContext(GameContext);

  return (
    <div className="avatar">
      <img
        src={emotionImages[deriveAvatarEmotion({ gameEvent })]}
        alt={`Emily ${deriveAvatarEmotion({ gameEvent })}`}
      />

      <div className="avatar-info">
        <h4 className="avatar-name">{deriveAvatarName(aiLevel)}</h4>
        <div className="speech-bubble">{deriveAvatarSpeech({ gameEvent })}</div>
      </div>
    </div>
  );
};

export const deriveAvatarName = (aiLevel: AiLevel) => {
  if (aiLevel === 'easy') {
    return 'Emily';
  } else if (aiLevel === 'medium') {
    return 'Emily';
  } else if (aiLevel === 'hard') {
    return 'Emily';
  }

  return 'Emily';
};

const deriveAvatarSpeech = ({ gameEvent }: { gameEvent: GameEvents }) => {
  switch (gameEvent) {
    case GameEvents.USER_MISS:
      return 'Haha, you missed!';
    case GameEvents.USER_HIT:
      return 'Oh no...';
    case GameEvents.USER_SUNK_OPPONENT:
      return 'Aaah, no fair!';
    case GameEvents.USER_WIN:
      return 'Yay! I won!';
    case GameEvents.USER_LOSE:
      return 'Aww, I lost...';

    case GameEvents.COMPUTER_MISS:
      return 'Darn, I missed!';
    case GameEvents.COMPUTER_HIT:
      return 'Haha, I hit you!';
    case GameEvents.COMPUTER_SUNK_USER:
      return 'Take that!';
    case GameEvents.COMPUTER_WIN:
      return 'Yay! I won!';
    case GameEvents.COMPUTER_LOSE:
      return 'Aww, I lost...';

    case GameEvents.COMPUTER_THINKING:
      return 'Hmm...';
  }
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
