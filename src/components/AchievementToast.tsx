import React, { useEffect, useState, useRef } from 'react';
import { Achievement } from '../types/achievements';
import './AchievementToast.scss';

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
  duration?: number;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose, duration = 8000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const isClosedRef = useRef(false);
  const showTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const exitTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Show toast after a brief delay
    showTimerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Auto-hide after duration
    hideTimerRef.current = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
      }
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
      }
    };
  }, [duration]);

  const handleClose = () => {
    // Prevent duplicate close actions
    if (isClosedRef.current) return;

    isClosedRef.current = true;

    // Clear all timers
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    setIsExiting(true);
    exitTimerRef.current = setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  return (
    <div
      className={`achievement-toast ${isVisible ? 'visible' : ''} ${isExiting ? 'exiting' : ''}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{ ['--toast-duration' as any]: `${duration}ms` }}
    >
      <div className="toast-content">
        <div className="toast-icon">{achievement.icon}</div>
        <div className="toast-text">
          <div className="toast-title">Achievement Unlocked!</div>
          <div className="toast-name">{achievement.name}</div>
          <div className="toast-description">{achievement.description}</div>
        </div>
        <button className="toast-close" onClick={handleClose} aria-label="Close achievement notification">
          ×
        </button>
      </div>
      <div className="toast-progress">
        <div className="progress-bar" />
      </div>
    </div>
  );
};
