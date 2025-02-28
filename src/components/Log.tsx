import React, { useContext, useEffect } from 'react';
import { GameContext } from '../GameContext';

export const Log = () => {
  const { log } = useContext(GameContext);

  return <div>{log.map((item) => item)}</div>;
};
