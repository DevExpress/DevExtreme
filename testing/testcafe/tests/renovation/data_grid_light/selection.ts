import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { multiPlatformTest, createWidget, updateComponentOptions } from '../../../helpers/multi-platform-test';

const test = multiPlatformTest({ page: 'declaration/data_grid_light', platforms: ['jquery', 'react', 'angular'] });

const getDefaultOptions = (platform) => ({
  columns: ['id', 'text'],
  dataSource: [
    { id: 1, text: 'text 1' },
    { id: 2, text: 'text 2' },
    { id: 3, text: 'text 3' },
    { id: 4, text: 'text 4' },
    { id: 5, text: 'text 5' },
  ],
  keyExpr: 'id',
  selection: {
    allowSelectAll: true,
    mode: 'single',
    selectAllMode: 'page',
    selectedRowKeys: platform === 'jquery' ? undefined : [],
  },
  pager: {
    visible: false,
  },
});

const prepareDataGrid = (options = {}) => async (t, { platform }) => {
  await t.resizeWindow(800, 600);
  await createWidget(platform, 'dxDataGridNext', getDefaultOptions(platform));
  await updateComponentOptions(platform, options);
};

fixture('DataGridNext with Pager');

test('Render', async (t, { screenshotComparerOptions }) => {
  await t
    .expect(
      await compareScreenshot(t, 'data_grid_light_selection.png', null, screenshotComparerOptions),
    )
    .ok();
}).before(prepareDataGrid());

test('Select single row', async (t, { screenshotComparerOptions }) => {
  await t.click(Selector('.dx-select-checkbox').nth(1));
  await t.click(Selector('.dx-select-checkbox').nth(2));

  await t
    .expect(
      await compareScreenshot(t, 'data_grid_light_selection_single.png', null, screenshotComparerOptions),
    )
    .ok();
}).before(prepareDataGrid());

test('Select multiple row', async (t, { screenshotComparerOptions }) => {
  await t.click(Selector('.dx-select-checkbox').nth(1));
  await t.click(Selector('.dx-select-checkbox').nth(2));

  await t
    .expect(
      await compareScreenshot(t, 'data_grid_light_selection_multiple.png', null, screenshotComparerOptions),
    )
    .ok();
}).before(prepareDataGrid({
  selection: { mode: 'multiple' },
}));

test('Select all', async (t, { screenshotComparerOptions }) => {
  await t.click(Selector('.dx-select-checkbox').nth(0));

  await t
    .expect(
      await compareScreenshot(t, 'data_grid_light_selection_all.png', null, screenshotComparerOptions),
    )
    .ok();
}).before(prepareDataGrid({
  selection: { mode: 'multiple' },
}));
