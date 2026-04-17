import { test } from '@playwright/test';
import { testAccessibilityMatrix } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

const items = [
  {
    resizable: true,
    minSize: '70px',
    size: '140px',
    text: 'Left Pane',
  },
  {
    size: '140px',
    resizable: false,
    collapsible: false,
    text: 'Right Pane',
  },
];

test.describe('Accessibility - splitter matrix', () => {
  testAccessibilityMatrix({
    component: 'dxSplitter',
    containerUrl,
    a11yCheckConfig: {
      rules: {
        'scrollable-region-focusable': { enabled: false },
      },
    },
    options: {
      dataSource: [items],
      allowKeyboardNavigation: [true, false],
      disabled: [true, false],
      width: [450, 'auto', '100%'],
      height: [400],
      separatorSize: [8, 5],
    },
  });
});
