import React, { useContext } from 'react';
import { GameContext } from '../GameContext';
import { HitIcon, MissIcon, SunkIcon } from './Icons';

export type LogEntryTypes = 'hit' | 'miss' | 'sunk' | 'general' | 'user-win' | 'computer-win';

export const Log = () => {
  const { log } = useContext(GameContext);

  return (
    <ol className="game-log">
      {log.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ol>
  );
};

export const LogEntry = ({ item, type }: { item: string; type: LogEntryTypes }) => {
  return (
    <div className="log-entry">
      {getLogEntryIcon(type)}
      <div className="log-entry-message">{item}</div>
    </div>
  );
};

const getLogEntryIcon = (type: LogEntryTypes) => {
  switch (type) {
    case 'hit':
      return (
        <div className="log-entry-icon">
          <HitIcon />
        </div>
      );
    case 'miss':
      return (
        <div className="log-entry-icon">
          <MissIcon fill="#fff" />
        </div>
      );
    case 'sunk':
      return (
        <div className="log-entry-icon">
          <SunkIcon />
        </div>
      );
    default:
      return <></>;
  }
};

export default Log;
