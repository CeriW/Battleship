import React from 'react';

export const MissIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="90%" height="90%" fill="#000">
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
  </svg>
);

export const HitIcon: React.FC = () => {
  const versionRef = React.useRef(Math.ceil(Math.random() * 9));
  return <img src={`/img/fire-${versionRef.current}.svg`} alt="Hit marker" width="90%" height="90%" />;
};
