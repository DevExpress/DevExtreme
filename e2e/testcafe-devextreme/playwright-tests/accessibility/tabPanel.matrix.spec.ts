import { test } from '@playwright/test';
import { testAccessibilityMatrix } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

const items = [
  { title: 'John Heart', text: 'John Heart' },
  { title: 'Marina Thomas', text: 'Marina Thomas', disabled: true },
  { title: 'Robert Reagan', text: 'Robert Reagan' },
  { title: 'Greta Sims', text: 'Greta Sims' },
  { title: 'Olivia Peyton', text: 'Olivia Peyton' },
  { title: 'Ed Holmes', text: 'Ed Holmes' },
  { title: 'Wally Hobbs', text: 'Wally Hobbs' },
  { title: 'Brad Jameson', text: 'Brad Jameson' },
];

test.describe('Accessibility - tabPanel matrix', () => {
  testAccessibilityMatrix({
    component: 'dxTabPanel',
    containerUrl,
    options: {
      dataSource: [[], items],
      showNavButtons: [true, false],
      disabled: [true, false],
      width: [450, 'auto'],
      height: [250, 550],
    },
  });
});
