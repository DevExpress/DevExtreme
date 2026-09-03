import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import PivotGrid from '../../../models/pivotGrid';

const THEMES = { tag: ['@generic.light', '@material.blue.light', '@material.blue.light.compact'] };

const sales = [
  { region: 'Africa', city: 'Cairo', amount: 1000 },
  { region: 'Africa', city: 'Tunis', amount: 2000 },
  { region: 'Europe', city: 'Berlin', amount: 3000 },
];

const createPivotGrid = async (page: Parameters<typeof createWidget>[0]): Promise<void> => createWidget(page, 'dxPivotGrid', {
  dataSource: {
    fields: [
      { dataField: 'region', area: 'row' },
      { dataField: 'city', area: 'column' },
      { dataField: 'amount', area: 'data', summaryType: 'sum' },
    ],
    store: sales,
  },
});

test('PivotGrid renders its areas and answers its options', THEMES, async ({ page }) => {
  await createPivotGrid(page);

  const pivotGrid = new PivotGrid(page, '#container');

  await expect(pivotGrid.dataArea).toBeVisible();
  expect(await pivotGrid.option('rowHeaderLayout')).toBe('standard');

  await pivotGrid.option('rowHeaderLayout', 'tree');

  expect(await pivotGrid.option('rowHeaderLayout')).toBe('tree');
});

test('PivotGrid markup', async ({ page }) => {
  await createPivotGrid(page);

  await testScreenshot(page, 'PivotGrid markup.png', { element: '#container' });
});
