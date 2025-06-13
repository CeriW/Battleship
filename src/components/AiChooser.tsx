import React, { useContext } from 'react';
import { GameContext } from '../GameContext';

const AiSlider = () => {
  const { aiLevel, setAiLevel } = useContext(GameContext);

  const handleDifficultyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAiLevel(event.target.value as 'easy' | 'medium' | 'hard');
  };

  return (
    <div className="ai-slider-container">
      <label id="ai-difficulty-label">AI Difficulty: {aiLevel}</label>
      <div className="radio-row">
        <label>
          <input
            type="radio"
            name="difficulty"
            value="easy"
            checked={aiLevel === 'easy'}
            onChange={handleDifficultyChange}
            data-testid="difficulty-easy"
          />
          Easy
        </label>
        <label>
          <input
            type="radio"
            name="difficulty"
            value="medium"
            checked={aiLevel === 'medium'}
            onChange={handleDifficultyChange}
            data-testid="difficulty-medium"
          />
          Medium
        </label>
        <label>
          <input
            type="radio"
            name="difficulty"
            value="hard"
            checked={aiLevel === 'hard'}
            onChange={handleDifficultyChange}
            data-testid="difficulty-hard"
          />
          Hard
        </label>
      </div>
    </div>
  );
};

export default AiSlider;
