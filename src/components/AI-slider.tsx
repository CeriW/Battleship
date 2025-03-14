import React, { useContext } from 'react';
import { GameContext } from '../GameContext';

const AiSlider = () => {
  const { aiLevel, setAiLevel } = useContext(GameContext);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = parseInt(event.target.value, 10);
    setAiLevel(newLevel);
  };

  return (
    <div className="ai-slider-container">
      <label htmlFor="ai-difficulty">AI Difficulty: {aiLevel}</label>
      <div className="slider-row">
        <span className="slider-label">Easy</span>
        <input
          id="ai-difficulty"
          type="range"
          min="1"
          max="20"
          value={aiLevel}
          onChange={handleSliderChange}
          className="difficulty-slider"
          data-testid="ai-difficulty-slider"
        />
        <span className="slider-label">Hard</span>
      </div>
    </div>
  );
};

export default AiSlider;
