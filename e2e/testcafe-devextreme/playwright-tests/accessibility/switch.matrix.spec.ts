import { test } from '@playwright/test';
import { testAccessibilityMatrix } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - switch matrix', () => {
  testAccessibilityMatrix({
    component: 'dxSwitch',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      value: [true, false],
      disabled: [true, false],
      readOnly: [true, false],
      name: ['', 'name'],
    },
  });
});
