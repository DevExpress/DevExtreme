import { test } from '@playwright/test';
import { testAccessibilityMatrix } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

const baseOptions = {
  value: [undefined, 'value'],
  placeholder: [undefined, 'placeholder'],
  showClearButton: [true, false],
  mode: ['password', 'email', 'search', 'tel', 'text', 'url'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

test.describe('Accessibility - textBox matrix (availability)', () => {
  testAccessibilityMatrix({
    component: 'dxTextBox',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      ...baseOptions,
      disabled: [true, false],
      readOnly: [true, false],
    },
  });
});

test.describe('Accessibility - textBox matrix (info)', () => {
  testAccessibilityMatrix({
    component: 'dxTextBox',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      ...baseOptions,
      label: ['', 'label'],
      name: ['', 'name'],
    },
  });
});

test.describe('Accessibility - textBox matrix (spellcheck)', () => {
  testAccessibilityMatrix({
    component: 'dxTextBox',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      ...baseOptions,
      spellcheck: [true],
    },
  });
});
