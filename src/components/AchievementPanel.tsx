import React, { useEffect, useRef } from 'react';
import { useAchievements } from '../context/AchievementContext';
import { Achievement } from '../types/achievements';
import './AchievementPanel.scss';

interface AchievementPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementPanel: React.FC<AchievementPanelProps> = ({ isOpen, onClose }) => {
  const { achievements, progress, unlockedAchievements } = useAchievements();
  const panelRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Focus the panel
      if (panelRef.current) {
        panelRef.current.focus();
      }

      // Handle ESC key
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    } else if (previousActiveElement.current) {
      // Restore focus to the previously focused element
      previousActiveElement.current.focus();
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Sort achievements: unlocked first, then by name
  const sortedAchievements = [...achievements].sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    return a.name.localeCompare(b.name);
  });

  const getProgressPercentage = (achievement: Achievement) => {
    if (achievement.unlocked) return 100;
    if (!achievement.maxProgress) return 0;

    switch (achievement.id) {
      case 'destroyer_master':
        return Math.min((progress.destroyersSunk / 10) * 100, 100);
      case 'carrier_hunter':
        return Math.min((progress.carriersSunk / 5) * 100, 100);
      case 'corner_specialist':
        return Math.min((progress.cornerHits / 20) * 100, 100);
      case 'center_master':
        return Math.min((progress.centerHits / 30) * 100, 100);
      case 'games_played_10':
        return Math.min((progress.totalGames / 10) * 100, 100);
      case 'games_played_50':
        return Math.min((progress.totalGames / 50) * 100, 100);
      case 'games_played_100':
        return Math.min((progress.totalGames / 100) * 100, 100);
      case 'hard_mode_master':
        return Math.min((progress.winsOnHard / 10) * 100, 100);
      case 'submarine_hunter':
        return Math.min((progress.submarinesSunk / 1) * 100, 100);
      case 'cruiser_slayer':
        return Math.min((progress.cruisersSunk / 1) * 100, 100);
      case 'battleship_destroyer':
        return Math.min((progress.battleshipsSunk / 1) * 100, 100);
      case 'easy_master':
        return Math.min((progress.winsOnEasy / 1) * 100, 100);
      case 'medium_master':
        return Math.min((progress.winsOnMedium / 1) * 100, 100);
      case 'hard_master':
        return Math.min((progress.winsOnHard / 1) * 100, 100);
      case 'submarine_expert':
        return Math.min((progress.submarinesSunk / 5) * 100, 100);
      case 'cruiser_expert':
        return Math.min((progress.cruisersSunk / 5) * 100, 100);
      case 'battleship_expert':
        return Math.min((progress.battleshipsSunk / 5) * 100, 100);
      case 'easy_expert':
        return Math.min((progress.winsOnEasy / 5) * 100, 100);
      case 'medium_expert':
        return Math.min((progress.winsOnMedium / 5) * 100, 100);
      case 'hard_expert':
        return Math.min((progress.winsOnHard / 5) * 100, 100);
      case 'first_shot_hit':
        return Math.min((progress.firstShotHits / 1) * 100, 100);
      case 'sound_on':
        return Math.min((progress.soundEnabled / 1) * 100, 100);
      default:
        return 0;
    }
  };

  return (
    <div className="achievement-panel-overlay" onClick={onClose}>
      <div
        ref={panelRef}
        className="achievement-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="achievements-header"
        tabIndex={-1}
      >
        <div className="achievement-header">
          <h2 id="achievements-header">Achievements</h2>
          <div className="achievement-stats">
            <div className="stat">
              <span className="stat-value">{unlockedAchievements.length}</span>
              <span className="stat-label">Unlocked</span>
            </div>
            <div className="stat">
              <span className="stat-value">{progress.totalGames}</span>
              <span className="stat-label">Games</span>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="achievement-list">
          {sortedAchievements.map((achievement) => {
            const progressPercentage = getProgressPercentage(achievement);
            const isUnlocked = achievement.unlocked;

            return (
              <div
                key={achievement.id}
                className={`achievement-item ${isUnlocked ? 'unlocked' : 'locked'} ${achievement.rarity}`}
              >
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-info">
                  <div className="achievement-name">
                    {achievement.name}
                    {isUnlocked && <span className="unlocked-badge">✓</span>}
                  </div>
                  <div className="achievement-description">{achievement.description}</div>
                  <div className="achievement-meta">
                    <span className="achievement-rarity">{achievement.rarity}</span>
                    {achievement.unlockedAt && (
                      <span className="achievement-date">
                        Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {!isUnlocked && progressPercentage > 0 && (
                    <div className="achievement-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
                      </div>
                      <span className="progress-text">{Math.round(progressPercentage)}%</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
