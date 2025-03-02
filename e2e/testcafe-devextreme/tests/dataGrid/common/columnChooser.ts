/* eslint-disable @typescript-eslint/no-floating-promises */

import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
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

test('Column chooser should support string height and width', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t
    .click(dataGrid.getHeaderPanel().getColumnChooserButton());

  const columnChooserContent = dataGrid.getColumnChooser().content;

  await t
    .expect(columnChooserContent.getStyleProperty('height'))
    .eql('400px')
    .expect(columnChooserContent.getStyleProperty('width'))
    .eql('330px');
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [],
  columns: [
    'field1', 'field2', 'field3',
  ],
  width: 700,
  columnChooser: {
    enabled: true,
    height: '400px',
    width: '330px',
  },
}));

// T1219785
test('Check the behavior of pressing the Esc button when dragging a column from the column chooser', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .click(dataGrid.getColumnChooserButton());

  await takeScreenshot('T1219785-column-chooser-1.png', dataGrid.element);

  await dataGrid.getColumnChooser().focusList();
  await dataGrid.moveColumnChooserColumn(0, -25, -25, true);
  await dataGrid.moveColumnChooserColumn(0, -50, -50);

  await takeScreenshot('T1219785-column-chooser-2.png', dataGrid.element);

  // act
  await t.pressKey('esc');
  await dataGrid.moveColumnChooserColumn(0, -75, -75);

  await takeScreenshot('T1219785-column-chooser-3.png', dataGrid.element);

  // assert
  await t
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
    mode: 'dragAndDrop',
  },
}));
