import type { Preview } from '@storybook/react';

import { ThemeDecorator, themeToolbarItems, compact } from './themes/themes';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: themeToolbarItems[0].value,
      toolbar: {
        title: 'Theme',
        items: themeToolbarItems,
        dynamicTitle: true,
      }
    },
    compact: {
      description: 'Compact or non compact theme',
      defaultValue: compact[0].value,
      toolbar: {
        title: 'Compact',
        items: compact,
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
