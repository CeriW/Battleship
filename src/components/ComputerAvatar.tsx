import React, { useContext } from 'react';
import { GameContext } from '../GameContext';

import emilyHappy from '../img/emily/emily-happy.svg';
import emilySad from '../img/emily/emily-sad.svg';
import emilyWorried from '../img/emily/emily-worried.svg';
import emilyAngry from '../img/emily/emily-angry.svg';
import emilyThinking from '../img/emily/emily-thinking.svg';
import emilyConfused from '../img/emily/emily-confused.svg';

export type AvatarNames = 'Emily';
export type AvatarEmotions = 'happy' | 'sad' | 'worried' | 'angry' | 'thinking' | 'confused';

const emotionImages = {
  happy: emilyHappy,
  sad: emilySad,
  worried: emilyWorried,
  angry: emilyAngry,
  thinking: emilyThinking,
  confused: emilyConfused,
};

export const Avatar = ({ name, emotion }: { name: AvatarNames; emotion: AvatarEmotions }) => {
  return (
    <div className="avatar">
      <img src={emotionImages[emotion]} alt={emotion} width={256} height={256} />
    </div>
  );
};

export default Avatar;
