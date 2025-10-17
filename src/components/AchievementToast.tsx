import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    // Show toast after a brief delay
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Auto-hide after duration
    const hideTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  return (
    <div className={`achievement-toast ${isVisible ? 'visible' : ''} ${isExiting ? 'exiting' : ''}`}>
      <div className="toast-content">
        <div className="toast-icon">{achievement.icon}</div>
        <div className="toast-text">
          <div className="toast-title">Achievement Unlocked!</div>
          <div className="toast-name">{achievement.name}</div>
          <div className="toast-description">{achievement.description}</div>
        </div>
        <button className="toast-close" onClick={handleClose}>
          ×
        </button>
      </div>
      <div className="toast-progress">
        <div className="progress-bar" />
      </div>
    </div>
  );
};
