import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App Component', () => {
  test('should render the board', () => {
    render(<App />);
    const boardElement = screen.getByTestId('board');
    expect(boardElement).toBeInTheDocument();
  });
});
