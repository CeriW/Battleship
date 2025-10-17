import React from 'react';
import { useAchievements } from '../context/AchievementContext';
import { useAchievementModal } from '../context/AchievementModalContext';
import './AchievementButton.scss';

export const AchievementButton: React.FC = () => {
  const { unlockedAchievements } = useAchievements();
  const { openModal } = useAchievementModal();

  return (
    <button className="achievement-button toolbar-button" onClick={openModal} title="View Achievements">
      <span className="achievement-icon">🏆</span>
      <span className="achievement-text">Achievements</span>
      <span className="achievement-count">{unlockedAchievements.length}</span>
    </button>
  );
};
