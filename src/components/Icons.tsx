import React from 'react';

export const MissIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="90%" height="90%" fill="#000">
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
  </svg>
);

export const HitIcon = () => {
  const version = Math.ceil(Math.random() * 9);
  return <img src={`/img/fire-${version}.svg`} alt="Hit" width="90%" height="90%" />;
};
