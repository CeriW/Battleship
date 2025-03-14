import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AiSlider from './AI-slider';
import { GameContext, GameContextType, GameProvider } from '../GameContext';

// Mock the GameContext
const mockSetAiLevel = jest.fn();

describe('AiSlider Component', () => {
  beforeEach(() => {
    mockSetAiLevel.mockClear();
  });

  test('renders the slider with correct initial value', () => {
    render(
      <GameContext.Provider value={{ aiLevel: 20 } as unknown as GameContextType}>
        <AiSlider />
      </GameContext.Provider>
    );

    const sliderLabel = screen.getByText(`AI Difficulty: 20`);
    expect(sliderLabel).toBeInTheDocument();

    const slider = screen.getByTestId('ai-difficulty-slider');
    expect(slider).toHaveValue('20');
  });

  test('calls setAiLevel when slider value changes', () => {
    render(
      <GameContext.Provider value={{ aiLevel: 20 } as unknown as GameContextType}>
        <AiSlider />
      </GameContext.Provider>
    );

    const slider = screen.getByTestId('ai-difficulty-slider');
    fireEvent.change(slider, { target: { value: '18' } });
    expect(mockSetAiLevel).toHaveBeenCalledWith(18);
  });

  test('displays "Easy" and "Hard" labels', () => {
    render(
      <GameContext.Provider value={{ aiLevel: 20 } as unknown as GameContextType}>
        <AiSlider />
      </GameContext.Provider>
    );

    const easyLabel = screen.getByText('Easy');
    const hardLabel = screen.getByText('Hard');

    expect(easyLabel).toBeInTheDocument();
    expect(hardLabel).toBeInTheDocument();
  });

  test('slider has correct min and max values', () => {
    render(
      <GameContext.Provider value={{ aiLevel: 20 } as unknown as GameContextType}>
        <AiSlider />
      </GameContext.Provider>
    );

    const slider = screen.getByTestId('ai-difficulty-slider');

    expect(slider).toHaveAttribute('min', '1');
    expect(slider).toHaveAttribute('max', '20');
  });

  test('updates UI immediately when slider changes', () => {
    render(
      <GameContext.Provider value={{ aiLevel: 20 } as unknown as GameContextType}>
        <AiSlider />
      </GameContext.Provider>
    );

    mockSetAiLevel.mockImplementation((newValue) => {
      render(
        <GameContext.Provider
          value={
            {
              aiLevel: newValue,
              setAiLevel: mockSetAiLevel,
            } as unknown as GameContextType
          }
        >
          <AiSlider />
        </GameContext.Provider>
      );
    });

    const slider = screen.getByTestId('ai-difficulty-slider');
    fireEvent.change(slider, { target: { value: '15' } });
    const updatedLabel = screen.getByLabelText(/AI Difficulty:/i);
    expect(updatedLabel).toHaveTextContent('AI Difficulty: 15');
  });
});
