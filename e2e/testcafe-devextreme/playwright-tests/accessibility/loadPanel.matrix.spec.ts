import { test } from '@playwright/test';
import { testAccessibilityMatrix } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - loadPanel matrix', () => {
  testAccessibilityMatrix({
    component: 'dxLoadPanel',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      visible: [true],
      showIndicator: [true, false],
      showPane: [true, false],
      message: [undefined, 'message'],
      delay: [undefined, 0],
    },
  });
});
