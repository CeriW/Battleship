/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */

import React from 'react';
import { render, screen } from '@testing-library/react';
// import App from './App';
import Board from './components/Board';
import '@testing-library/jest-dom'; // For using the .toBeInTheDocument matcher

test('Renders basic layout', () => {
  const { container } = render(<Board />);
  const myBoard = container.querySelector('.board');
  expect(myBoard).toBeInTheDocument();
});
