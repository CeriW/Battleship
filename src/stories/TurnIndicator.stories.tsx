import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { TurnIndicator } from '../components/TurnIndicator';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Turn indicator',
  component: TurnIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    playerTurn: {
      control: 'select',
      options: ['user', 'computer'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '262px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TurnIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const UserTurn: Story = {
  args: {
    playerTurn: 'user',
  },
};

export const ComputerTurn: Story = {
  args: {
    playerTurn: 'computer',
  },
};
