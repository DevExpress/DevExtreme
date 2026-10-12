import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import PivotGrid from 'devextreme-testcafe-models/pivotGrid';
import { Selector } from 'testcafe';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../helpers/themeUtils';
import { sales } from '../data';

fixture.disablePageReloads`pivotGrid_kbn_expandIcon`
  .page(url(__dirname, '../../../container.html'));

const PIVOT_GRID_SELECTOR = '#container';

test('Expandable cell should have a visible focus outline when focused by keyboard', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);

  // Tab through the grid until an expandable cell is focused by keyboard
  // so that the :focus-visible outline is applied.
  for (let i = 0; i < 10; i += 1) {
    await t.pressKey('tab');

    if (await Selector(':focus').find('[aria-expanded]').exists) {
      break;
    }
  }

  await t
    .expect(Selector(':focus').find('[aria-expanded]').exists)
    .ok('an expandable cell is focused');

  await testScreenshot(t, takeScreenshot, 'pivotgrid_kbn_expandable_cell_focused.png', { element: pivotGrid.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxPivotGrid', {
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
}));
