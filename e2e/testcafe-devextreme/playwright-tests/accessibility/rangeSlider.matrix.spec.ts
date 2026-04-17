import { test } from '@playwright/test';
import { testAccessibilityMatrix } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - rangeSlider matrix', () => {
  testAccessibilityMatrix({
    component: 'dxRangeSlider',
    containerUrl,
    a11yCheckConfig: {},
    options: {
      start: [40],
      end: [60],
      disabled: [true, false],
      readOnly: [true, false],
      height: [undefined, 250],
      width: [undefined, '50%'],
      label: [{ visible: true, position: 'top' }],
      tooltip: [{ enabled: true, showMode: 'always', position: 'bottom' }],
    },
  });
});
