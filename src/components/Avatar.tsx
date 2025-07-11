import React from 'react';

import happySvg from '../img/emily/happy.svg';
import sadSvg from '../img/emily/sad.svg';
import angrySvg from '../img/emily/angry.svg';
import thinkingSvg from '../img/emily/thinking.svg';
import worriedSvg from '../img/emily/worried.svg';

type Emotion = 'happy' | 'sad' | 'angry' | 'thinking' | 'worried';

const emotionImages = {
  happy: happySvg,
  sad: sadSvg,
  angry: angrySvg,
  thinking: thinkingSvg,
  worried: worriedSvg,
};

export const Avatar = ({ emotion }: { emotion: Emotion }) => {
  return (
    <div className="avatar">
      <img src={emotionImages[emotion]} alt={`Emily ${emotion}`} />
    </div>
  );
};
