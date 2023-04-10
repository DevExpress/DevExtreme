/* eslint-disable @typescript-eslint/no-floating-promises */

import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import DataGrid, { CLASS } from '../../model/dataGrid';
import { getData } from './helpers/generateDataSourceData';

fixture.disablePageReloads`Column chooser`
  .page(url(__dirname, '../container.html'));

test('Column chooser screenshot', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');

  await t
    .click(dataGrid.getColumnChooserButton())
    // act
    .expect(await takeScreenshot('column-chooser.png', dataGrid.element))
    .ok()
    // assert
    .expect(Selector(`.${CLASS.columnChooser}`).exists)
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 3),
  height: 400,
  showBorders: true,
  columns: [{
    dataField: 'field_0',
    dataType: 'string',
  }, {
    dataField: 'field_1',
    dataType: 'string',
  }, {
    dataField: 'field_2',
    dataType: 'string',
    visible: false,
  }],
  columnChooser: {
    enabled: true,
  },
}));
