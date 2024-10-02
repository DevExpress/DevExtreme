import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { defaultConfig } from './data';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`FixedColumns - MasterDetail`
  .page(url(__dirname, '../../container.html'));

safeSizeTest('Sticky columns with master-detail', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  await dataGrid.apiExpandRow(1);

  await takeScreenshot('masterdetail-scroll-begin.png', dataGrid.element);

  await dataGrid.scrollTo(t, { x: 100 });
  await takeScreenshot('masterdetail-scroll-center.png', dataGrid.element);

  await dataGrid.scrollTo(t, { x: 10000 });
  await takeScreenshot('masterdetail-scroll-end.png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [900, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  masterDetail: {
    enabled: true,
    template(container) {
      $(container)
        .text('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
    },
  },
}));
