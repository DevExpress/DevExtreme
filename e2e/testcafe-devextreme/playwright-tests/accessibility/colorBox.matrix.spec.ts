import { test } from '@playwright/test';
import { testAccessibilityMatrix } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

const baseOptions = {
  value: [undefined, '#f05b41'],
  disabled: [true, false],
  readOnly: [true, false],
  placeholder: [undefined, 'placeholder'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const buttonsOptions = {
  value: ['#f05b41'],
  label: [undefined, 'label'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

test.describe('Accessibility - colorBox matrix (deferred)', () => {
  testAccessibilityMatrix({
    component: 'dxColorBox',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      ...baseOptions,
      opened: [true, false],
      deferRendering: [true],
    },
  });
});

test.describe('Accessibility - colorBox matrix (no deferred)', () => {
  testAccessibilityMatrix({
    component: 'dxColorBox',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      ...baseOptions,
      opened: [false],
      deferRendering: [false],
    },
  });
});

test.describe('Accessibility - colorBox matrix (alpha channel)', () => {
  testAccessibilityMatrix({
    component: 'dxColorBox',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      ...baseOptions,
      opened: [true],
      editAlphaChannel: [true],
      deferRendering: [true],
    },
  });
});

test.describe('Accessibility - colorBox matrix (buttons)', () => {
  testAccessibilityMatrix({
    component: 'dxColorBox',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      ...buttonsOptions,
      showClearButton: [true, false],
      showDropDownButton: [true, false],
    },
  });
});
