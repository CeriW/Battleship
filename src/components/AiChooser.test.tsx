import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AiSlider from './AiChooser';
import { GameContext, GameContextType } from '../GameContext';

// Mock the GameContext
const mockSetAiLevel = jest.fn();

describe('AiSlider Component', () => {
  beforeEach(() => {
    mockSetAiLevel.mockClear();
  });

  test('renders the difficulty selector with correct initial value', () => {
    render(
      <GameContext.Provider value={{ aiLevel: 20, setAiLevel: mockSetAiLevel } as unknown as GameContextType}>
        <AiSlider />
      </GameContext.Provider>
    );

    const difficultyLabel = screen.getByText('AI Difficulty: 20');
    expect(difficultyLabel).toBeInTheDocument();

    const easyRadio = screen.getByTestId('difficulty-easy');
    const mediumRadio = screen.getByTestId('difficulty-medium');
    const hardRadio = screen.getByTestId('difficulty-hard');

    expect(easyRadio).toBeInTheDocument();
    expect(mediumRadio).toBeInTheDocument();
    expect(hardRadio).toBeInTheDocument();
  });

  test('calls setAiLevel when difficulty changes', () => {
    render(
      <GameContext.Provider value={{ aiLevel: 20, setAiLevel: mockSetAiLevel } as unknown as GameContextType}>
        <AiSlider />
      </GameContext.Provider>
    );

    const mediumRadio = screen.getByTestId('difficulty-medium');
    fireEvent.click(mediumRadio);
    expect(mockSetAiLevel).toHaveBeenCalled();
  });

  test('displays all difficulty options', () => {
    render(
      <GameContext.Provider value={{ aiLevel: 20, setAiLevel: mockSetAiLevel } as unknown as GameContextType}>
        <AiSlider />
      </GameContext.Provider>
    );

    const easyLabel = screen.getByText('Easy');
    const mediumLabel = screen.getByText('Medium');
    const hardLabel = screen.getByText('Hard');

    expect(easyLabel).toBeInTheDocument();
    expect(mediumLabel).toBeInTheDocument();
    expect(hardLabel).toBeInTheDocument();
  });

  test('radio buttons have correct values and states', () => {
    render(
      <GameContext.Provider value={{ aiLevel: 20, setAiLevel: mockSetAiLevel } as unknown as GameContextType}>
        <AiSlider />
      </GameContext.Provider>
    );

    const easyRadio = screen.getByTestId('difficulty-easy');
    const mediumRadio = screen.getByTestId('difficulty-medium');
    const hardRadio = screen.getByTestId('difficulty-hard');

    // Check that the radio buttons have the correct values
    expect(easyRadio).toHaveAttribute('value', 'easy');
    expect(mediumRadio).toHaveAttribute('value', 'medium');
    expect(hardRadio).toHaveAttribute('value', 'hard');

    // Check that they're all part of the same group
    expect(easyRadio).toHaveAttribute('name', 'difficulty');
    expect(mediumRadio).toHaveAttribute('name', 'difficulty');
    expect(hardRadio).toHaveAttribute('name', 'difficulty');
  });

  test('updates UI immediately when difficulty changes', () => {
    const { rerender } = render(
      <GameContext.Provider value={{ aiLevel: 'hard', setAiLevel: mockSetAiLevel } as unknown as GameContextType}>
        <AiSlider />
      </GameContext.Provider>
    );

    const mediumRadio = screen.getByTestId('difficulty-medium');
    fireEvent.click(mediumRadio);

    rerender(
      <GameContext.Provider value={{ aiLevel: 'medium', setAiLevel: mockSetAiLevel } as unknown as GameContextType}>
        <AiSlider />
      </GameContext.Provider>
    );

    // Now check that the label shows the updated value
    const updatedLabel = screen.getByText('AI Difficulty: medium');
    expect(updatedLabel).toBeInTheDocument();
  });
});
