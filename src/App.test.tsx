// Import necessary functions from testing libraries
import React from 'react';
import '@testing-library/jest-dom'; // For .toBeInTheDocument matcher
import { render, screen } from '@testing-library/react';
import Board from './components/Board';

// Test suite for the 'Board' component
describe('Board Component', () => {
  test('should render the board', () => {
    // Render the Board component
    render(<Board />);

    // Check if an element with the class 'board' exists in the DOM
    const boardElement = document.body.querySelector('.board');
    expect(boardElement).toBeInTheDocument(); // Assert that the board element is in the document
  });
});
