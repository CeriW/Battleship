import React from 'react';

import happySvg from '../img/emily/happy.svg';
import sadSvg from '../img/emily/sad.svg';
import angrySvg from '../img/emily/angry.svg';
import thinkingSvg from '../img/emily/thinking.svg';
import worriedSvg from '../img/emily/worried.svg';

export type Emotion = 'happy' | 'sad' | 'angry' | 'thinking' | 'worried';

const emotionImages = {
  happy: happySvg,
  sad: sadSvg,
  angry: angrySvg,
  thinking: thinkingSvg,
  worried: worriedSvg,
};

export const AvatarImage = ({ emotion }: { emotion: Emotion }) => {
  return (
    <div className="avatar">
      <img src={emotionImages[emotion]} alt={`Emily ${emotion}`} />
    </div>
  );
};

const deriveAvatarEmotion = ({
  player,
  action,
}: {
  player: 'user' | 'computer';
  action: 'miss' | 'hit' | 'sunk' | 'win' | 'lose';
}) => {
  if (player === 'computer') {
    switch (action) {
      case 'miss':
        return 'sad';
      case 'hit':
        return 'happy';
      default:
        return 'thinking';
    }
  }

  return 'thinking';

  // switch (action) {
  //   case 'miss':
  //     return 'sad';
  //   case 'hit':
  //     return 'happy';
  //   case 'sunk':
  // }
};
