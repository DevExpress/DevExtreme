import { test } from '@playwright/test';
import { testAccessibilityMatrix } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

const items = [
  'HD Video Player',
  'SuperHD Video Player',
  'SuperPlasma 50',
];

const buttonsOptions = {
  dataSource: [items],
  value: [[items[0]]],
  label: [undefined, 'label'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

test.describe('Accessibility - tagBox matrix', () => {
  testAccessibilityMatrix({
    component: 'dxTagBox',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      dataSource: [[], items],
      value: [undefined, [items[0]]],
      disabled: [true, false],
      readOnly: [true, false],
      searchEnabled: [true, false],
      searchTimeout: [0],
      placeholder: [undefined, 'placeholder'],
      inputAttr: [{ 'aria-label': 'aria-label' }],
    },
  });
});

test.describe('Accessibility - tagBox matrix (buttons)', () => {
  testAccessibilityMatrix({
    component: 'dxTagBox',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      ...buttonsOptions,
      showClearButton: [true, false],
      showDropDownButton: [true, false],
    },
  });
});

test.describe('Accessibility - tagBox matrix (popup)', () => {
  testAccessibilityMatrix({
    component: 'dxTagBox',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      ...buttonsOptions,
      opened: [true],
      showSelectionControls: [true, false],
    },
  });
});
