import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { multiPlatformTest, createWidget, updateComponentOptions } from '../../../helpers/multi-platform-test';

const test = multiPlatformTest({ page: 'declaration/data_grid_light', platforms: ['react'] });

const defaultOptions = {
  columns: ['id', 'text'],
  dataSource: [
    { id: 1, text: 'text 1' },
    { id: 2, text: 'text 2' },
    { id: 3, text: 'text 3' },
    { id: 4, text: 'text 4' },
    { id: 5, text: 'text 5' },
  ],
  keyExpr: 'id',
  masterDetail: {
    enabled: true,
    template: () => 'Test',
  },
  pager: {
    visible: false,
  },
};

const prepareDataGrid = (options = {}) => async (t, { platform }) => {
  await t.resizeWindow(800, 600);
  await createWidget(platform, 'dxDataGridNext', defaultOptions);
  await updateComponentOptions(platform, options);
};

fixture('DataGridNext with Master Detail');

test('Render', async (t, { screenshotComparerOptions }) => {
  await t
    .expect(
      await compareScreenshot(t, 'data_grid_light_master_detail.png', null, screenshotComparerOptions),
    )
    .ok();
}).before(prepareDataGrid());

test('Render when expandedRowKeys is set', async (t, { screenshotComparerOptions }) => {
  await t
    .expect(
      await compareScreenshot(t, 'data_grid_light_master_detail_with_expandedRowKeys.png', null, screenshotComparerOptions),
    )
    .ok();
}).before(prepareDataGrid({
  masterDetail: { expandedRowKeys: [1, 3] },
}));

test('Expand the master detail', async (t, { screenshotComparerOptions }) => {
  await t.click(Selector('.dx-datagrid-expand').nth(0));

  await t
    .expect(
      await compareScreenshot(t, 'data_grid_light_expand_master_detail.png', null, screenshotComparerOptions),
    )
    .ok();
}).before(prepareDataGrid());
