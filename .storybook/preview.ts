import type { Preview } from '@storybook/react-webpack5';

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        blue: { name: 'Blue', value: 'var(--battleship-blue)' },
      },
    },
  },
  initialGlobals: {
    // 👇 Set the initial background color
    backgrounds: { value: 'blue' },
  },
};

export default preview;
