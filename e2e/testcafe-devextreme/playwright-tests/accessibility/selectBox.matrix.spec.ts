import { test } from '@playwright/test';
import { testAccessibilityMatrix } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

const items = [
  'HD Video Player',
  'SuperHD Video Player',
  'SuperPlasma 50',
];

const baseOptions = {
  dataSource: [[], items],
  value: [undefined, items[0]],
  disabled: [true, false],
  readOnly: [true, false],
  searchEnabled: [true, false],
  searchTimeout: [0],
  placeholder: [undefined, 'placeholder'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const buttonsOptions = {
  dataSource: [items],
  value: [items[0]],
  label: [undefined, 'label'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

test.describe('Accessibility - selectBox matrix (deferred)', () => {
  testAccessibilityMatrix({
    component: 'dxSelectBox',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      ...baseOptions,
      opened: [true, false],
      deferRendering: [true],
    },
  });
});

test.describe('Accessibility - selectBox matrix (no deferred)', () => {
  testAccessibilityMatrix({
    component: 'dxSelectBox',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      ...baseOptions,
      opened: [false],
      deferRendering: [false],
    },
  });
});

test.describe('Accessibility - selectBox matrix (buttons)', () => {
  testAccessibilityMatrix({
    component: 'dxSelectBox',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      ...buttonsOptions,
      showClearButton: [true, false],
      showDropDownButton: [true, false],
    },
  });
});
