import React, { useState, useEffect } from 'react';
import './MusicButton.scss';
import { setGlobalAudioRef, setGlobalAudioEnabled, isAudioEnabled } from '../utils/soundEffects';
import { useAchievementTracker } from '../hooks/useAchievementTracker';
import { GameEvents } from './Avatar';

// Global audio state management
let globalAudioRef: HTMLAudioElement | null = null;
let lastTrack = 0;
let globalIsPlaying = false;

const getRandomTrack = () => {
  let newTrack;
  do {
    newTrack = Math.floor(Math.random() * 8) + 1; // Random number between 1-8
  } while (newTrack === lastTrack);
  lastTrack = newTrack;
  return newTrack;
};

const loadTrack = (trackNumber: number) => {
  if (globalAudioRef) {
    globalAudioRef.src = `/audio/music-${trackNumber}.mp3`;
    globalAudioRef.load();
  }
};

const playNextTrack = () => {
  const nextTrack = getRandomTrack();
  loadTrack(nextTrack);

  if (globalAudioRef && isAudioEnabled()) {
    globalAudioRef.play().catch((error) => {
      console.log('Audio playback failed:', error);
    });
  }
};

// Export functions for sound effects to check if audio is enabled
// isAudioEnabled is now imported from soundEffects.ts

// Export function to check if music is playing
export const isMusicPlaying = () => globalIsPlaying;

// Export function to skip to next track
export const skipToNextTrack = () => {
  if (globalAudioRef && isAudioEnabled()) {
    playNextTrack();
  }
};

export const MusicButton = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { trackGameEvent } = useAchievementTracker();

  useEffect(() => {
    // Create audio element with first random track
    const initialTrack = getRandomTrack();
    globalAudioRef = new Audio(`/audio/music-${initialTrack}.mp3`);
    globalAudioRef.volume = 0.5;

    // Set the global audio ref in sound effects utility
    setGlobalAudioRef(globalAudioRef);

    // Initialize audio state to match the button state (off by default)
    setGlobalAudioEnabled(false);

    // Handle track end - play next random track
    const handleTrackEnd = () => {
      playNextTrack();
    };

    if (globalAudioRef) {
      globalAudioRef.addEventListener('ended', handleTrackEnd);
    }

    // Cleanup on unmount
    return () => {
      if (globalAudioRef) {
        globalAudioRef.removeEventListener('ended', handleTrackEnd);
        globalAudioRef.pause();
        globalAudioRef = null;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!globalAudioRef) return;

    if (isPlaying) {
      globalAudioRef.pause();
      setIsPlaying(false);
      globalIsPlaying = false;
      setGlobalAudioEnabled(false);
    } else {
      globalAudioRef.play().catch((error) => {
        console.log('Audio playback failed:', error);
      });
      setIsPlaying(true);
      globalIsPlaying = true;
      setGlobalAudioEnabled(true);

      // Track achievement for turning on sound
      trackGameEvent(GameEvents.SOUND_ENABLED);
    }
  };

  return (
    <button
      className={`music-button ${isPlaying ? 'playing' : ''}`}
      onClick={toggleAudio}
      title={isPlaying ? 'Sound Off' : 'Sound On'}
    >
      <span className="music-icon">🔊</span>
      <span className="music-text">{isPlaying ? 'Sound Off' : 'Sound On'}</span>
    </button>
  );
};
