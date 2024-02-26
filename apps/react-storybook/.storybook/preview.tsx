import type { Preview } from '@storybook/react';

import { ThemeDecorator, themesToolbarItems } from './themes';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        // The label to show for this toolbar item
        title: 'Theme',
        // Array of plain string values or MenuItem shape (see below)
        items: themesToolbarItems,
        // Change title based on selected value
        dynamicTitle: true,
      }
    }
  },
  decorators: [
      ThemeDecorator
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
  },
};

export default preview;
