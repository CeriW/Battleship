import type { Preview } from '@storybook/react-webpack5';
import '../src/storybook.scss';

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
