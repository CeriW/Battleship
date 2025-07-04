import React from 'react';

import emilyHappy from '../img/emily/emily-happy.svg';
import emilySad from '../img/emily/emily-sad.svg';
import emilyWorried from '../img/emily/emily-worried.svg';
import emilyAngry from '../img/emily/emily-angry.svg';

type names = 'Emily';
type Emotions = 'happy' | 'sad' | 'worried' | 'angry';

const emotionImages = {
  happy: emilyHappy,
  sad: emilySad,
  worried: emilyWorried,
  angry: emilyAngry,
};

export const Avatar = ({ name, emotion }: { name: names; emotion: Emotions }) => {
  return (
    <div className="avatar">
      <img src={emotionImages[emotion]} alt={emotion} width={256} height={256} />
    </div>
  );
};

export default Avatar;
