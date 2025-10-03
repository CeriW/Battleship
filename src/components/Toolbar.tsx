import React from 'react';
import { Link } from 'react-router-dom';
import { MusicButton } from './MusicButton';
import { SkipTrackButton } from './SkipTrackButton';
import './Toolbar.scss';

export const Toolbar = () => {
  return (
    <div className="toolbar">
      <div className="toolbar-content">
        <div className="toolbar-left">
          <Link to="/about" className="toolbar-button about-button">
            <span className="about-icon">🔍</span>
            <span className="about-text">About</span>
          </Link>
        </div>
        <div className="toolbar-right">
          <SkipTrackButton />
          <MusicButton />
        </div>
      </div>
    </div>
  );
};
