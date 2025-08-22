import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Window from '../components/Window';
import { Avatar, GameEvents } from '../components/Avatar';
import { GameProvider, GameContext } from '../GameContext';
import { AiLevel } from '../types';

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

// Helper component to wrap Avatar with specific aiLevel context
const AvatarWithContext = ({ aiLevel, gameEvent }: { aiLevel: AiLevel; gameEvent: GameEvents }) => {
  const [contextValue, setContextValue] = React.useState({
    userShips: [],
    computerShips: [],
    setUserShips: () => {},
    setComputerShips: () => {},
    playerTurn: 'user' as const,
    setPlayerTurn: () => {},
    log: [],
    addToLog: () => {},
    gameEnded: false,
    setGameEnded: () => {},
    gameStatus: null,
    setgameStatus: () => {},
    aiLevel,
    setAiLevel: () => {},
    avatar: { gameEvent },
    setAvatar: () => {},
    aiAdjacentShipModifier: 0,
    setAiAdjacentShipModifier: () => {},
  });

  React.useEffect(() => {
    setContextValue((prev) => ({ ...prev, aiLevel, avatar: { gameEvent } }));
  }, [aiLevel, gameEvent]);

  return (
    <GameContext.Provider value={contextValue}>
      <Avatar gameEvent={gameEvent} />
    </GameContext.Provider>
  );
};

// Emily (Easy AI) Stories
export const EmilyHappy: Story = {
  render: (args) => <AvatarWithContext aiLevel="easy" gameEvent={args.gameEvent} />,
  args: {
    gameEvent: GameEvents.COMPUTER_HIT,
  },
};

export const EmilySad: Story = {
  render: (args) => <AvatarWithContext aiLevel="easy" gameEvent={args.gameEvent} />,
  args: {
    gameEvent: GameEvents.USER_WIN,
  },
};

export const EmilyThinking: Story = {
  render: (args) => <AvatarWithContext aiLevel="easy" gameEvent={args.gameEvent} />,
  args: {
    gameEvent: GameEvents.COMPUTER_THINKING,
  },
};

export const EmilyAngry: Story = {
  render: (args) => <AvatarWithContext aiLevel="easy" gameEvent={args.gameEvent} />,
  args: {
    gameEvent: GameEvents.USER_SUNK_COMPUTER,
  },
};

export const EmilyConfused: Story = {
  render: (args) => <AvatarWithContext aiLevel="easy" gameEvent={args.gameEvent} />,
  args: {
    gameEvent: GameEvents.COMPUTER_MISS,
  },
};

export const EmilyWorried: Story = {
  render: (args) => <AvatarWithContext aiLevel="easy" gameEvent={args.gameEvent} />,
  args: {
    gameEvent: GameEvents.USER_HIT,
  },
};

// Alex (Medium AI) Stories
export const AlexHappy: Story = {
  render: (args) => <AvatarWithContext aiLevel="medium" gameEvent={args.gameEvent} />,
  args: {
    gameEvent: GameEvents.COMPUTER_HIT,
  },
};

export const AlexSad: Story = {
  render: (args) => <AvatarWithContext aiLevel="medium" gameEvent={args.gameEvent} />,
  args: {
    gameEvent: GameEvents.USER_WIN,
  },
};

export const AlexThinking: Story = {
  render: (args) => <AvatarWithContext aiLevel="medium" gameEvent={args.gameEvent} />,
  args: {
    gameEvent: GameEvents.COMPUTER_THINKING,
  },
};

export const AlexAngry: Story = {
  render: (args) => <AvatarWithContext aiLevel="medium" gameEvent={args.gameEvent} />,
  args: {
    gameEvent: GameEvents.USER_SUNK_COMPUTER,
  },
};

export const AlexConfused: Story = {
  render: (args) => <AvatarWithContext aiLevel="medium" gameEvent={args.gameEvent} />,
  args: {
    gameEvent: GameEvents.COMPUTER_MISS,
  },
};

export const AlexWorried: Story = {
  render: (args) => <AvatarWithContext aiLevel="medium" gameEvent={args.gameEvent} />,
  args: {
    gameEvent: GameEvents.USER_HIT,
  },
};

// Natasha (Hard AI) Stories
export const NatashaHappy: Story = {
  render: (args) => <AvatarWithContext aiLevel="hard" gameEvent={args.gameEvent} />,
  args: {
    gameEvent: GameEvents.COMPUTER_HIT,
  },
};

export const NatashaSad: Story = {
  render: (args) => <AvatarWithContext aiLevel="hard" gameEvent={args.gameEvent} />,
  args: {
    gameEvent: GameEvents.USER_WIN,
  },
};

export const NatashaThinking: Story = {
  render: (args) => <AvatarWithContext aiLevel="hard" gameEvent={args.gameEvent} />,
  args: {
    gameEvent: GameEvents.COMPUTER_THINKING,
  },
};

export const NatashaAngry: Story = {
  render: (args) => <AvatarWithContext aiLevel="hard" gameEvent={args.gameEvent} />,
  args: {
    gameEvent: GameEvents.USER_SUNK_COMPUTER,
  },
};

export const NatashaConfused: Story = {
  render: (args) => <AvatarWithContext aiLevel="hard" gameEvent={args.gameEvent} />,
  args: {
    gameEvent: GameEvents.COMPUTER_MISS,
  },
};

export const NatashaWorried: Story = {
  render: (args) => <AvatarWithContext aiLevel="hard" gameEvent={args.gameEvent} />,
  args: {
    gameEvent: GameEvents.USER_HIT,
  },
};
