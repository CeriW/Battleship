// Import necessary functions from testing libraries
import '@testing-library/jest-dom'; // For using the .toBeInTheDocument matcher

// Mock AchievementContext
jest.mock('./context/AchievementContext', () => ({
  useAchievements: () => ({
    achievements: [],
    progress: {},
    checkAchievements: jest.fn(),
    unlockAchievement: jest.fn(),
    resetProgress: jest.fn(),
  }),
  AchievementProvider: ({ children }: { children: React.ReactNode }) => children,
}));
