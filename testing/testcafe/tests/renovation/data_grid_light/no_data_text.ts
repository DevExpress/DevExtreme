/* eslint-disable @typescript-eslint/no-type-alias */
import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { multiPlatformTest, createWidget, updateComponentOptions } from '../../../helpers/multi-platform-test';

const test = multiPlatformTest({ page: 'declaration/data_grid_light', platforms: ['angular', 'react'] });

const defaultOptions = {
  columns: ['id', 'text'],
  dataSource: [],
};

const prepareDataGrid = (options = {}) => async (t, { platform }) => {
  await t.resizeWindow(800, 600);
  await createWidget(platform, 'dxDataGridLight', defaultOptions);
  await updateComponentOptions(platform, options);
};

fixture('DataGridLight with Master Detail');

test('Default template', async (t, { screenshotComparerOptions }) => {
  await t
    .expect(
      await compareScreenshot(t, 'data_grid_light_no_data_text.png', null, screenshotComparerOptions),
    )
    .ok();
}).before(prepareDataGrid());

test('Custom template', async (t, { screenshotComparerOptions }) => {
  await t
    .expect(
      await compareScreenshot(t, 'data_grid_light_no_data_text_custom_template.png', null, screenshotComparerOptions),
    )
    .ok();
}).before(prepareDataGrid({
  noDataTemplate: () => 'asd',
}));
