import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget, { cleanContainer } from '../../../helpers/createWidget';
import { appendElementTo } from '../helpers/domUtils';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';

fixture.disablePageReloads`Integration_DataGrid`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => cleanContainer());

test('The rows in the fixed column are not aligned when the grid is encapsulated inside a <td> element, useNative: false (T1071725)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshotInTheme(t, takeScreenshot, 'Grid with scrollable encapsulated inside td element, useNative=false.png', Selector('#grid'));

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'table', 'outerTable', {});
  await appendElementTo('#outerTable', 'tr', 'outerTableTR', {});
  await appendElementTo('#outerTableTR', 'td', 'outerTableTD', {});
  await appendElementTo('#outerTableTR', 'div', 'grid', {});

  return createWidget('dxDataGrid', {
    dataSource: [
      {
        field1: 'test1', field2: 'test2',
      },
    ],
    scrolling: {
      useNative: false,
    },
    width: 300,
    columns: [
      { dataField: 'field1', fixed: true },
      { dataField: 'field2' },
    ],
    hoverStateEnabled: true,
  }, false, '#grid');
});

test('The rows in the fixed column are not aligned when the grid is encapsulated inside a <td> element, useNative: true', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('Grid with scrollable encapsulated inside td element, useNative=true.png', Selector('#grid')))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'table', 'outerTable', {});
  await appendElementTo('#outerTable', 'tr', 'outerTableTR', {});
  await appendElementTo('#outerTableTR', 'td', 'outerTableTD', {});
  await appendElementTo('#outerTableTR', 'div', 'grid', {});

  return createWidget('dxDataGrid', {
    dataSource: [
      {
        field1: 'test1', field2: 'test2',
      },
    ],
    scrolling: {
      useNative: true,
    },
    width: 300,
    columns: [
      { dataField: 'field1', fixed: true },
      { dataField: 'field2' },
    ],
    hoverStateEnabled: true,
  }, false, '#grid');
});
