import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { safeSizeTest } from '../../../../helpers/safeSizeTest';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { defaultConfig } from '../helpers/data';
import { testScreenshot } from '../../../../helpers/themeUtils';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`Sticky columns - Row Selection`
  .page(url(__dirname, '../../../container.html'));

// visual: generic.light
// visual: material.blue.light
// visual: fluent.blue.light
safeSizeTest('The selected row should be displayed correctly when there are sticky columns (generic.light theme)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await testScreenshot(t, takeScreenshot, 'row_selection_with_sticky_columns_1.png', { element: dataGrid.element });

  await dataGrid.scrollTo(t, { x: 10000 });

  await testScreenshot(t, takeScreenshot, 'row_selection_with_sticky_columns_2.png', { element: dataGrid.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800])
  .before(async () => {
    await createWidget('dxDataGrid', {
      ...defaultConfig,
      selection: {
        mode: 'multiple',
      },
      selectedRowKeys: [4],
    });
  });
