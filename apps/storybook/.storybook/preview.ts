import type { Preview } from '@storybook/react';
// Import CSS directly from source for hot reload
import '../../../packages/button/src/Button.css';
import '../../../packages/card/src/Card.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
