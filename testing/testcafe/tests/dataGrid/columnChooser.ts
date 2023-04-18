/* eslint-disable @typescript-eslint/no-floating-promises */

import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import DataGrid from '../../model/dataGrid';
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
    .expect(dataGrid.getColumnChooser().element.exists)
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

test('Column chooser checkboxes should be aligned correctly with plain structure', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid('#container');

  await t
    .click(dataGrid.getHeaderPanel().getColumnChooserButton());

  const columnChooser = dataGrid.getColumnChooser();

  await t
    .expect(await takeScreenshot('column-chooser-checkbox-alignment-plain-structure.png', columnChooser.content))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [],
  columns: ['field1', 'field2', 'field3'],
  width: 700,
  columnChooser: {
    enabled: true,
    mode: 'select',
    search: {
      enabled: true,
    },
    selection: {
      allowSelectAll: true,
    },
  },
}));

test('Column chooser checkboxes should be aligned correctly with tree structure', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid('#container');

  await t
    .click(dataGrid.getHeaderPanel().getColumnChooserButton());

  const columnChooser = dataGrid.getColumnChooser();

  await t
    .expect(await takeScreenshot('column-chooser-checkbox-alignment-tree-structure.png', columnChooser.content))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [],
  columns: [
    'field1',
    {
      caption: 'band1',
      columns: ['field2', 'field3'],
    },
  ],
  width: 700,
  columnChooser: {
    enabled: true,
    mode: 'select',
    search: {
      enabled: true,
    },
    selection: {
      allowSelectAll: true,
    },
  },
}));
