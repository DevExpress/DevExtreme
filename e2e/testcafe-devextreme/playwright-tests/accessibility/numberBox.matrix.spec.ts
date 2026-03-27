import { test } from '@playwright/test';
import { testAccessibilityMatrix } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - numberBox matrix', () => {
  testAccessibilityMatrix({
    component: 'dxNumberBox',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      value: [20.5],
      placeholder: [undefined, 'placeholder'],
      disabled: [true, false],
      readOnly: [true, false],
      showClearButton: [true, false],
      showSpinButtons: [true, false],
      inputAttr: [{ 'aria-label': 'aria-label' }],
    },
  });
});
