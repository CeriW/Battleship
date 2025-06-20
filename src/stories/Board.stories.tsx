import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import Board from '../components/Board';
import { initialiseShipArray } from '../logic/placeShips';
import './Board.stories.css';
import { CellStates } from '../types';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Board',
  component: Board,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    positions: {
      control: false,
      description: 'Board positions array (read-only)',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '450px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Board>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

const BoardWithHitsAndMisses = () => {
  const positions = initialiseShipArray();
  positions[1][1] = { name: 'carrier', status: CellStates.hit };
  positions[1][4] = { name: 'carrier', status: CellStates.hit };
  positions[1][5] = { name: 'carrier', status: CellStates.hit };
  positions[5][5] = { name: 'carrier', status: CellStates.hit };

  positions[4][1] = { name: null, status: CellStates.miss };
  positions[6][3] = { name: null, status: CellStates.miss };
  positions[7][8] = { name: null, status: CellStates.miss };
  positions[8][5] = { name: null, status: CellStates.miss };

  return positions;
};

export const HitsAndMisses: Story = {
  args: {
    positions: BoardWithHitsAndMisses(),
  },
};

export const Blank: Story = {
  args: {
    positions: initialiseShipArray(),
  },
};
