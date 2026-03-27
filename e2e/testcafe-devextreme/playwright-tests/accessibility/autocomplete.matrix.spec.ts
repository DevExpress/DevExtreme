import { test } from '@playwright/test';
import { testAccessibilityMatrix } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

const items = ['Item_1', 'Item_2', 'Item_3'];

const baseOptions = {
  dataSource: [[], items],
  placeholder: [undefined, 'placeholder'],
  value: [undefined, 'Item_1'],
  disabled: [true, false],
  readOnly: [true, false],
  searchTimeout: [0],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const buttonsOptions = {
  dataSource: [[], items],
  value: ['Item_1'],
  label: [undefined, 'label'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

test.describe('Accessibility - autocomplete matrix (deferred)', () => {
  testAccessibilityMatrix({
    component: 'dxAutocomplete',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      ...baseOptions,
      opened: [true, false],
      deferRendering: [true],
    },
  });
});

test.describe('Accessibility - autocomplete matrix (no deferred)', () => {
  testAccessibilityMatrix({
    component: 'dxAutocomplete',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      ...baseOptions,
      opened: [false],
      deferRendering: [false],
    },
  });
});

test.describe('Accessibility - autocomplete matrix (buttons)', () => {
  testAccessibilityMatrix({
    component: 'dxAutocomplete',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      ...buttonsOptions,
      showClearButton: [true, false],
      showDropDownButton: [true, false],
    },
  });
});
