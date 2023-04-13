import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { appendElementTo, setAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture`Integration_DataGrid`
  .page(url(__dirname, '../../container.html'));

[true, false].forEach((useNative) => {
  test(`The rows in the fixed column are not aligned when the grid is encapsulated inside a <td> element, useNative: ${useNative} (T1071725)`, async (t) => {
    // NOTE: for some reason of the toolbar buttons was hovered on the screenshot
    // try to force mouse to the (0, 0) position to prevent hovering
    // await t.hover('body', { offsetX: 0, offsetY: 0 });

    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `Grid with scrollable wrapped in td el, useNative=${useNative}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await setAttribute('#container', 'style', 'width: 300px; height: 200px;');

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
        useNative,
      },
      width: 300,
      columns: [
        { dataField: 'field1', fixed: true },
        { dataField: 'field2' },
      ],
      hoverStateEnabled: true,
    }, '#grid');
  });
});
