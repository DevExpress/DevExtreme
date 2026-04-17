import { test } from '@playwright/test';
import { testAccessibilityMatrix } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

const markup = '<p>He<em>llo</em></p>';

test.describe('Accessibility - htmlEditor matrix', () => {
  testAccessibilityMatrix({
    component: 'dxHtmlEditor',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      value: [markup],
      readOnly: [true, false],
      name: ['', 'name'],
      height: [undefined, 300],
      width: [undefined, 300],
      placeholder: ['', 'placeholder'],
      focusStateEnabled: [true],
      toolbar: [{ items: ['bold', 'color'] }],
    },
  });
});
