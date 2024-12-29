import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Board from './components/Board';

// Test suite for the 'Board' component
describe('Board Component', () => {
  test('should render the board', () => {
    render(<Board />);

    // Check if an element with the class 'board' exists in the DOM
    // const boardElement = document.body.querySelector('.board');
    // expect(boardElement).toBeInTheDocument();
  });
});
