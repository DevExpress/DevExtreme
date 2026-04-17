import { test } from '@playwright/test';
import { testAccessibilityMatrix } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - button matrix', () => {
  testAccessibilityMatrix({
    component: 'dxButton',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      useSubmitBehavior: [true, false],
      disabled: [true, false],
      icon: [undefined, 'user'],
      text: ['button text'],
    },
  });
});
