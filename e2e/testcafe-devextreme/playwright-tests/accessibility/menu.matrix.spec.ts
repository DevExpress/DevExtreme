import { test } from '@playwright/test';
import { testAccessibilityMatrix } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

const items = [
  {
    text: 'remove',
    icon: 'remove',
    items: [
      {
        text: 'user',
        icon: 'user',
        disabled: true,
        items: [{ text: 'user_1' }],
      },
      {
        text: 'save',
        icon: 'save',
        items: [
          { text: 'export', icon: 'export' },
          { text: 'edit', icon: 'edit' },
        ],
      },
    ],
  },
  { text: 'user', icon: 'user' },
  { text: 'coffee', icon: 'coffee', disabled: true },
];

test.describe('Accessibility - menu matrix', () => {
  testAccessibilityMatrix({
    component: 'dxMenu',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      items: [items],
      disabled: [true, false],
      width: [400, 1024],
      orientation: ['horizontal', 'vertical'],
      adaptivityEnabled: [true, false],
    },
  });
});
