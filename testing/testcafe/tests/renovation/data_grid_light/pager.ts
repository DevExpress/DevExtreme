import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { multiPlatformTest, createWidget } from '../../../helpers/multi-platform-test';

const test = multiPlatformTest({ page: 'declaration/data_grid_light', platforms: ['react'/* , 'angular' */] });

const defaultOptions = {
  columns: ['id', 'text'],
  dataSource: [
    { id: 1, text: 'text 1' },
    { id: 2, text: 'text 2' },
    { id: 3, text: 'text 3' },
    { id: 4, text: 'text 4' },
    { id: 5, text: 'text 5' },
  ],
  paging: {
    pageSize: 2,
    pageIndex: 0,
    enabled: true,
  },
  pager: {
    visible: true,
    allowedPageSizes: [2, 4, 'all'],
    showPageSizeSelector: true,
    displayMode: 'full',
  },
};

const prepareDataGrid = async (t, { platform }) => {
  await t.resizeWindow(800, 600);
  await createWidget(platform, 'dxDataGridNext', defaultOptions);
};

fixture('DataGridNext with Pager');

test('Render', async (t, { screenshotComparerOptions }) => {
  await t
    .expect(
      await compareScreenshot(t, 'data_grid_light_pager.png', null, screenshotComparerOptions),
    )
    .ok();
}).before(prepareDataGrid);

test('Change page', async (t, { screenshotComparerOptions }) => {
  const page2 = Selector('.dx-page').nth(-1);

  await t.click(page2);

  await t
    .expect(
      await compareScreenshot(t, 'data_grid_light_change_page.png', null, screenshotComparerOptions),
    )
    .ok();
}).before(prepareDataGrid);

test('Change page size', async (t, { screenshotComparerOptions }) => {
  const pageSize4 = Selector('.dx-page-size').withText('4');

  await t.click(pageSize4);

  await t
    .expect(
      await compareScreenshot(t, 'data_grid_light_change_page_size.png', null, screenshotComparerOptions),
    )
    .ok();
}).before(prepareDataGrid);

test('Page size all', async (t, { screenshotComparerOptions }) => {
  const pageSizeAll = Selector('.dx-page-size').withText('All');

  await t.click(pageSizeAll);

  await t
    .expect(
      await compareScreenshot(t, 'data_grid_light_change_page_size_all.png', null, screenshotComparerOptions),
    )
    .ok();
}).before(prepareDataGrid);
