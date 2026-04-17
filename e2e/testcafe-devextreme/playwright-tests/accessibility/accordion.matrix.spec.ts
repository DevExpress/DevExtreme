import { test } from '@playwright/test';
import { testAccessibilityMatrix } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

const items = ['Item_1', 'Item_2', 'Item_3'];

test.describe('Accessibility - accordion matrix', () => {
  testAccessibilityMatrix({
    component: 'dxAccordion',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      dataSource: [items],
      disabled: [true, false],
      deferRendering: [true, false],
      multiple: [true, false],
      focusStateEnabled: [true],
    },
  });
});
