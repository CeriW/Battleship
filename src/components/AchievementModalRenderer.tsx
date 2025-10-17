import React from 'react';
import { useAchievementModal } from '../context/AchievementModalContext';
import { AchievementModal } from './AchievementModal';

export const AchievementModalRenderer: React.FC = () => {
  const { isOpen, closeModal } = useAchievementModal();

  return <AchievementModal isOpen={isOpen} onClose={closeModal} />;
};
