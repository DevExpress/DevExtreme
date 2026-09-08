import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import PivotGrid from '../../../../models/pivotGrid';
import { sales } from '../data';

const PIVOT_GRID_SELECTOR = '#container';

test('Expandable cell should have a visible focus outline when focused by keyboard', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', {
    width: 600,
    allowExpandAll: true,
    fieldChooser: {
      enabled: false,
    },
    dataSource: {
      fields: [{
        dataField: 'region',
        area: 'row',
        expanded: false,
      }, {
        dataField: 'city',
        area: 'row',
      }, {
        dataField: 'date',
        area: 'column',
      }, {
        dataField: 'amount',
        area: 'data',
        summaryType: 'sum',
        dataType: 'number',
      }],
      store: sales,
    },
  });

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
  const focusedExpandableCell = page.locator(':focus [aria-expanded]');

  // Tab through the grid until an expandable cell is focused by keyboard
  // so that the :focus-visible outline is applied.
  for (let i = 0; i < 10; i += 1) {
    await page.keyboard.press('Tab');

    if (await focusedExpandableCell.count() > 0) {
      break;
    }
  }

  await expect(focusedExpandableCell.first(), 'an expandable cell is focused').toBeAttached();

  await testScreenshot(page, 'pivotgrid_kbn_expandable_cell_focused.png', { element: pivotGrid.element });
});
