import type { Preview } from '@storybook/react';

import { ThemeDecorator, themesToolbarItems } from './themes';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: themesToolbarItems[0].value,
      toolbar: {
        title: 'Theme',
        items: themesToolbarItems,
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
