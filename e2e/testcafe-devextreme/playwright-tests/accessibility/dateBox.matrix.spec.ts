import { test } from '@playwright/test';
import { testAccessibilityMatrix } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

const now = new Date(2024, 0, 15, 10, 30);

const baseOptions = {
  value: [undefined, now],
  disabled: [true, false],
  readOnly: [true, false],
  type: ['date', 'time', 'datetime'],
  placeholder: [undefined, 'placeholder'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const buttonsOptions = {
  value: [now],
  label: [undefined, 'label'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

test.describe('Accessibility - dateBox matrix (deferred)', () => {
  testAccessibilityMatrix({
    component: 'dxDateBox',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      ...baseOptions,
      opened: [true, false],
      deferRendering: [true],
    },
  });
});

test.describe('Accessibility - dateBox matrix (no deferred)', () => {
  testAccessibilityMatrix({
    component: 'dxDateBox',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      ...baseOptions,
      opened: [false],
      deferRendering: [false],
    },
  });
});

test.describe('Accessibility - dateBox matrix (buttons)', () => {
  testAccessibilityMatrix({
    component: 'dxDateBox',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      ...buttonsOptions,
      showClearButton: [true, false],
      showDropDownButton: [true, false],
    },
  });
});
