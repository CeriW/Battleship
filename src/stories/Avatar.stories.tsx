import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Window from '../components/Window';
import { Avatar, GameEvents } from '../components/Avatar';

// Mock Math.random for consistent stories
Math.random = () => 0.5;

const meta = {
  title: 'Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '10px' }}>
        <Window title="" className="computer-avatar">
          <Story />
        </Window>
      </div>
    ),
  ],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmilyHappy: Story = {
  args: {
    gameEvent: GameEvents.COMPUTER_HIT,
  },
};

export const EmilySad: Story = {
  args: {
    gameEvent: GameEvents.USER_WIN,
  },
};

export const EmilyThinking: Story = {
  args: {
    gameEvent: GameEvents.COMPUTER_THINKING,
  },
};

export const EmilyAngry: Story = {
  args: {
    gameEvent: GameEvents.USER_SUNK_COMPUTER,
  },
};

export const EmilyConfused: Story = {
  args: {
    gameEvent: GameEvents.COMPUTER_MISS,
  },
};

export const EmilyWorried: Story = {
  args: {
    gameEvent: GameEvents.USER_HIT,
  },
};
