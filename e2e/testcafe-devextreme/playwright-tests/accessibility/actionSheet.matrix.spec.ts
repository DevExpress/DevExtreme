import { test } from '@playwright/test';
import { testAccessibilityMatrix } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

const items = [
  { text: 'Call' },
  { text: 'Send message' },
  { text: 'Edit' },
  { text: 'Delete' },
];

test.describe('Accessibility - actionSheet matrix', () => {
  testAccessibilityMatrix({
    component: 'dxActionSheet',
    containerUrl,
    options: {
      dataSource: [[], items],
      title: [undefined, 'title'],
      cancelText: [undefined, 'Cancel'],
      showTitle: [true, false],
      showCancelButton: [true, false],
    },
  });
});
