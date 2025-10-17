import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AchievementModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const AchievementModalContext = createContext<AchievementModalContextType | undefined>(undefined);

export const AchievementModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <AchievementModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </AchievementModalContext.Provider>
  );
};

export const useAchievementModal = () => {
  const context = useContext(AchievementModalContext);
  if (context === undefined) {
    throw new Error('useAchievementModal must be used within an AchievementModalProvider');
  }
  return context;
};
