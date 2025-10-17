import React, { useState, useEffect } from 'react';
import { AchievementToast } from './AchievementToast';
import { Achievement } from '../types/achievements';
import './AchievementToastManager.scss';

interface Toast {
  id: string;
  achievement: Achievement;
}

export const AchievementToastManager: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleAchievementUnlocked = (event: CustomEvent<Achievement>) => {
      const achievement = event.detail;
      const toastId = `toast-${achievement.id}-${Date.now()}`;

      setToasts((prev) => [...prev, { id: toastId, achievement }]);
    };

    // Listen for achievement unlock events
    window.addEventListener('achievement-unlocked', handleAchievementUnlocked as EventListener);

    return () => {
      window.removeEventListener('achievement-unlocked', handleAchievementUnlocked as EventListener);
    };
  }, []);

  const removeToast = (toastId: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  };

  return (
    <div className="achievement-toast-container">
      {toasts.map((toast) => (
        <AchievementToast key={toast.id} achievement={toast.achievement} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};
