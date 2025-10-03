import React, { useState, useEffect } from 'react';
import { skipToNextTrack, isMusicPlaying } from './MusicButton';
import './SkipTrackButton.scss';

export const SkipTrackButton = () => {
  const [isDisabled, setIsDisabled] = useState(true); // Start disabled

  useEffect(() => {
    const checkMusicState = () => {
      // Only enable if music is actually playing
      const musicPlaying = isMusicPlaying();
      setIsDisabled(!musicPlaying);
    };

    // Check music state periodically to update button state
    const interval = setInterval(checkMusicState, 100);

    return () => clearInterval(interval);
  }, []);

  const handleSkipTrack = () => {
    if (isMusicPlaying()) {
      skipToNextTrack();
    }
  };

  return (
    <button
      className={`skip-track-button ${isDisabled ? 'disabled' : ''}`}
      onClick={handleSkipTrack}
      disabled={isDisabled}
      title={isDisabled ? 'Sound is off' : 'Skip to Next Track'}
    >
      <span className="skip-icon">⏭️</span>
      <span className="skip-text">Next Track</span>
    </button>
  );
};
