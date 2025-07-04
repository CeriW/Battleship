import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Log, { LogEntry } from '../components/Log';
import Window from '../components/Window';

const meta = {
  title: 'Log',
  component: Log,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '10px' }}>
        <Window title="Feed" className="feed">
          <Story />
        </Window>
      </div>
    ),
  ],
} satisfies Meta<typeof Log>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock GameProvider with custom log data
const MockGameProvider = ({ logData }: { logData: React.ReactNode[] }) => {
  return (
    <ol className="game-log">
      {logData.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ol>
  );
};

export const LogWithAllTypes: Story = {
  render: () => (
    <MockGameProvider
      logData={[
        <LogEntry key="1" item="Example hit message" type="hit" />,
        <LogEntry key="2" item="Example miss message" type="miss" />,
        <LogEntry key="3" item="Example sunk message" type="sunk" />,
        <LogEntry key="4" item="Example general message" type="general" />,
        <LogEntry key="5" item="Example user-win message" type="user-win" />,
        <LogEntry key="6" item="Example computer-win message" type="computer-win" />,
      ]}
    />
  ),
};

// export const SingleMiss: Story = {
//   render: () => <MockGameProvider logData={[<LogEntry key="1" item="Miss at B3" type="miss" />]} />,
// };

// export const SingleSunk: Story = {
//   render: () => <MockGameProvider logData={[<LogEntry key="1" item="Carrier sunk!" type="sunk" />]} />,
// };

// export const MixedEntries: Story = {
//   render: () => (
//     <MockGameProvider
//       logData={[
//         <LogEntry key="1" item="Hit on carrier at A1" type="hit" />,
//         <LogEntry key="2" item="Miss at B3" type="miss" />,
//         <LogEntry key="3" item="Hit on battleship at C5" type="hit" />,
//         <LogEntry key="4" item="Carrier sunk!" type="sunk" />,
//         <LogEntry key="5" item="Miss at D7" type="miss" />,
//       ]}
//     />
//   ),
// };

// export const GameInProgress: Story = {
//   render: () => (
//     <MockGameProvider
//       logData={[
//         <LogEntry key="1" item="Game started! You go first." type="general" />,
//         <LogEntry key="2" item="Hit on carrier at A1" type="hit" />,
//         <LogEntry key="3" item="Computer misses at B3" type="miss" />,
//         <LogEntry key="4" item="Hit on battleship at C5" type="hit" />,
//         <LogEntry key="5" item="Computer hits your destroyer at D2" type="hit" />,
//         <LogEntry key="6" item="Miss at E7" type="miss" />,
//         <LogEntry key="7" item="Carrier sunk!" type="sunk" />,
//         <LogEntry key="8" item="Computer misses at F4" type="miss" />,
//         <LogEntry key="9" item="Hit on cruiser at G8" type="hit" />,
//         <LogEntry key="10" item="Computer hits your submarine at H1" type="hit" />,
//       ]}
//     />
//   ),
// };

// export const GameEnded: Story = {
//   render: () => (
//     <MockGameProvider
//       logData={[
//         <LogEntry key="1" item="Hit on carrier at A1" type="hit" />,
//         <LogEntry key="2" item="Carrier sunk!" type="sunk" />,
//         <LogEntry key="3" item="Hit on battleship at C5" type="hit" />,
//         <LogEntry key="4" item="Battleship sunk!" type="sunk" />,
//         <LogEntry key="5" item="Hit on cruiser at G8" type="hit" />,
//         <LogEntry key="6" item="Cruiser sunk!" type="sunk" />,
//         <LogEntry key="7" item="Hit on destroyer at I3" type="hit" />,
//         <LogEntry key="8" item="Destroyer sunk!" type="sunk" />,
//         <LogEntry key="9" item="Hit on submarine at J7" type="hit" />,
//         <LogEntry key="10" item="Submarine sunk!" type="sunk" />,
//         <LogEntry key="11" item="You win! All enemy ships destroyed!" type="user-win" />,
//       ]}
//     />
//   ),
// };

// export const LongMessage: Story = {
//   render: () => (
//     <MockGameProvider
//       logData={[
//         <LogEntry
//           key="1"
//           item="This is a very long message that should test how the log component handles text wrapping and overflow in the log entry display area"
//           type="general"
//         />,
//         <LogEntry key="2" item="Hit on carrier at A1" type="hit" />,
//         <LogEntry key="3" item="Miss at B3" type="miss" />,
//       ]}
//     />
//   ),
// };
