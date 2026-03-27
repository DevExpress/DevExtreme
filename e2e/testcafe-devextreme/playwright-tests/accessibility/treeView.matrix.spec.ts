import { test } from '@playwright/test';
import { testAccessibilityMatrix } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

const employees = [
  {
    id: 1,
    fullName: 'John Heart',
    parentId: 0,
    hasItems: true,
  },
  {
    id: 2,
    fullName: 'Samantha Bright',
    parentId: 1,
    hasItems: false,
  },
  {
    id: 3,
    fullName: 'Kevin Carter',
    parentId: 1,
    hasItems: false,
  },
  {
    id: 4,
    fullName: 'Robert Reagan',
    parentId: 0,
    hasItems: true,
  },
  {
    id: 5,
    fullName: 'Amelia Harper',
    parentId: 4,
    hasItems: false,
  },
];

test.describe('Accessibility - treeView matrix', () => {
  testAccessibilityMatrix({
    component: 'dxTreeView',
    containerUrl,
    options: {
      items: [[], employees],
      searchEnabled: [true, false],
      showCheckBoxesMode: ['none', 'normal', 'selectAll'],
      noDataText: [undefined, 'no data text'],
      displayExpr: ['fullName'],
    },
  });
});
