import React, { useContext, useRef } from 'react';
import { AiLevel } from '../types';

import happyPng from '../img/avatars/emily/happy.png';
import sadPng from '../img/avatars/emily/sad.png';
import angryPng from '../img/avatars/emily/angry.png';
import thinkingPng from '../img/avatars/emily/thinking.png';
import worriedPng from '../img/avatars/emily/worried.png';
import confusedPng from '../img/avatars/emily/confused.png';
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
  USER_SUNK_COMPUTER = 'user-sunk-computer',
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
  const currentMessageRef = useRef<string>('');
  const lastGameEventRef = useRef<GameEvents | null>(null);

  // Only generate a new message if the gameEvent has changed
  if (lastGameEventRef.current !== gameEvent) {
    currentMessageRef.current = deriveAvatarSpeech({ gameEvent });
    lastGameEventRef.current = gameEvent;
  }

  return (
    <div className="avatar">
      <img
        src={emotionImages[deriveAvatarEmotion({ gameEvent })]}
        alt={`Emily ${deriveAvatarEmotion({ gameEvent })}`}
      />

      <div className="avatar-info">
        <h4 className="avatar-name">{deriveAvatarName(aiLevel)}</h4>
        <div className="speech-bubble">{currentMessageRef.current}</div>
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
  const userMissMessages = [
    'Haha, you missed!',
    'Better luck next time!',
    'You can do better than that!',
    'Phew, that was close!',
  ];
  const userHitMessages = ['Oh no...', 'Ouch!', 'Hey!', 'You got me!'];
  const userSunkOpponentMessages = ['Aaah, no fair!', "You can't beat me!", 'Are you cheating?'];
  const userWinMessages = ["Wow you're good! Fancy another game?"];
  const userLoseMessages = ['Good game!', 'I knew I would win!', 'I was sure I would win!'];

  const computerMissMessages = ['Darn, I missed!', 'Oh shoot...', 'I was sure there was a ship there!'];
  const computerHitMessages = ['Haha, I hit you!', 'Take that!', 'Are you even trying?'];
  const computerSunkUserMessages = ['Haha, I sunk your ship!', "You can't beat me!"];
  const computerWinMessages = ['Yay! I won!', 'I knew I could do it!', 'I told you I would win!'];
  const computerLoseMessages = ['Aww, I lost...', 'I can do better than that!', 'Good game!'];

  const computerThinkingMessages = ['Hmm...', 'I need to think...', 'Watch this!'];

  switch (gameEvent) {
    case GameEvents.USER_MISS:
      return userMissMessages[Math.floor(Math.random() * userMissMessages.length)];
    case GameEvents.USER_HIT:
      return userHitMessages[Math.floor(Math.random() * userHitMessages.length)];
    case GameEvents.USER_SUNK_COMPUTER:
      return userSunkOpponentMessages[Math.floor(Math.random() * userSunkOpponentMessages.length)];
    case GameEvents.USER_WIN:
      return userWinMessages[Math.floor(Math.random() * userWinMessages.length)];
    case GameEvents.USER_LOSE:
      return userLoseMessages[Math.floor(Math.random() * userLoseMessages.length)];
    case GameEvents.COMPUTER_MISS:
      return computerMissMessages[Math.floor(Math.random() * computerMissMessages.length)];
    case GameEvents.COMPUTER_HIT:
      return computerHitMessages[Math.floor(Math.random() * computerHitMessages.length)];
    case GameEvents.COMPUTER_SUNK_USER:
      return computerSunkUserMessages[Math.floor(Math.random() * computerSunkUserMessages.length)];
    case GameEvents.COMPUTER_WIN:
      return computerWinMessages[Math.floor(Math.random() * computerWinMessages.length)];
    case GameEvents.COMPUTER_LOSE:
      return computerLoseMessages[Math.floor(Math.random() * computerLoseMessages.length)];

    case GameEvents.COMPUTER_THINKING:
      return computerThinkingMessages[Math.floor(Math.random() * computerThinkingMessages.length)];
  }
};

export const deriveAvatarEmotion = ({ gameEvent }: { gameEvent: GameEvents }) => {
  switch (gameEvent) {
    case GameEvents.USER_MISS:
      return 'happy';
    case GameEvents.USER_HIT:
      return 'worried';
    case GameEvents.USER_SUNK_COMPUTER:
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
