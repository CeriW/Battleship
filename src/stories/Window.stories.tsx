import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import Window from '../components/Window';
import { initialiseShipArray } from '../logic/placeShips';
import { CellStates } from '../types';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Window',
  component: Window,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description: 'Window children',
    },
    title: {
      control: false,
      description: 'Window title',
    },
    className: {
      control: false,
      description: 'Window class name',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '450px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Window>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const WindowWithContent: Story = {
  args: {
    children: (
      <div>
        <div>This is some sample content</div>
        <div>You can have whatever you want in here</div>
      </div>
    ),
    title: 'Window title',
    className: 'window',
  },
};

export const EmptyWindow: Story = {
  args: {
    children: null,
    title: '',
    className: 'window',
  },
};
