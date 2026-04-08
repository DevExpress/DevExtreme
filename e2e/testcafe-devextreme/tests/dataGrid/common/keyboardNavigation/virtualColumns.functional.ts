import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { triggerEvent } from '../../helpers/eventUtils';

fixture.disablePageReloads`Virtual Columns.Functional`
  .page(url(__dirname, '../../../container.html'));

const generateData = (rowCount: number, columnCount: number): Record<string, unknown>[] => {
  const items: Record<string, unknown>[] = [];

  for (let i = 0; i < rowCount; i += 1) {
    const item = {};

    for (let j = 0; j < columnCount; j += 1) {
      item[`field${j + 1}`] = `${i + 1}-${j + 1}`;
    }

    items.push(item);
  }

  return items;
};

test('DataGrid should scroll to the first cell of the next row and focus it when navigating with Tab key', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await dataGrid.scrollTo(t, { x: 10000 });

  // assert
  await t
    .expect(dataGrid.getScrollLeft())
    .eql(1500)
    .expect(dataGrid.getDataCell(0, 19).element.exists)
    .ok();

  // act
  await t.click(dataGrid.getDataCell(0, 19).element);

  // assert
  await t
    .expect(dataGrid.getDataCell(0, 19).element.focused)
    .ok();

  // act
  await t.pressKey('tab');

  // assert
  await t
    .expect(dataGrid.getScrollLeft())
    .eql(0)
    .expect(dataGrid.getDataCell(1, 0).element.focused)
    .ok();
}).before(async () => createWidget('dxDataGrid', {
  width: 500,
  dataSource: generateData(10, 20),
  columnWidth: 100,
  scrolling: {
    columnRenderingMode: 'virtual',
  },
}));

test('DataGrid should scroll to the last cell of the previous row and focus it when navigating with Shift+Tab keys', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await t.click(dataGrid.getDataCell(1, 0).element);

  // assert
  await t
    .expect(dataGrid.getDataCell(1, 0).element.focused)
    .ok();

  // act
  await t.pressKey('shift+tab');

  // assert
  await t
    .expect(dataGrid.getScrollLeft())
    .eql(1500)
    .expect(dataGrid.getDataCell(0, 19).element.focused)
    .ok();
}).before(async () => createWidget('dxDataGrid', {
  width: 500,
  dataSource: generateData(10, 20),
  columnWidth: 100,
  scrolling: {
    columnRenderingMode: 'virtual',
  },
}));

[true, false].forEach((rtlEnabled) => {
  [true, false].forEach((useNative) => {
    test(`DataGrid should scroll to the next virtual cell and focus it when navigating with Tab key (rtlEnabled: ${rtlEnabled}, useNative: ${useNative})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid('#container');
      const headerRow = dataGrid.getHeaders().getHeaderRow(0);
      const expectedScrollLeft = rtlEnabled ? 1400 : 100;

      // assert
      await t
        .expect(dataGrid.isReady())
        .ok()
        .expect(headerRow.getDataHeaderCells().count)
        .eql(5);

      // act
      /*
        We can't use the TestCafe API (for example, click)
        because it doesn't work correctly in RTL mode.
        Specifically, the negative scroll position is reset
        when calling the click method.
      */
      await triggerEvent(dataGrid.getDataCell(0, 4).element, 'dxpointerdown');

      // assert
      await t
        .expect(dataGrid.getDataCell(0, 4).element.focused)
        .ok();

      // act
      await t.pressKey('tab');

      // assert
      await t
        .expect(dataGrid.getScrollLeft())
        .eql(expectedScrollLeft)
        .expect(dataGrid.getDataCell(0, 5).element.focused)
        .ok()
        .expect(headerRow.getDataHeaderCells().count)
        .eql(10);
    }).before(async () => createWidget('dxDataGrid', {
      width: 500,
      rtlEnabled,
      dataSource: generateData(10, 20),
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
        useNative,
      },
    }));

    test(`DataGrid should scroll to the previous virtual cell and focus it when navigating with Shift+Tab key (rtlEnabled: ${rtlEnabled}, useNative: ${useNative})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid('#container');
      const headerRow = dataGrid.getHeaders().getHeaderRow(0);

      // assert
      await t
        .expect(dataGrid.isReady())
        .ok();

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      // assert
      await t
        .expect(await dataGrid.getScrollLeft())
        .eql(rtlEnabled ? 0 : 1500)
        .expect(dataGrid.getDataCell(0, 19).element.exists)
        .ok()
        .expect(headerRow.getDataHeaderCells().count)
        .eql(5);

      // act
      /*
        We can't use the TestCafe API (for example, click)
        because it doesn't work correctly in RTL mode.
        Specifically, the negative scroll position is reset
        when calling the click method.
      */
      await triggerEvent(dataGrid.getDataCell(0, 15).element, 'dxpointerdown');

      // assert
      await t
        .expect(dataGrid.getDataCell(0, 15).element.focused)
        .ok();

      // act
      await t.pressKey('shift+tab');

      // assert
      await t
        .expect(dataGrid.getScrollLeft())
        .eql(rtlEnabled ? 100 : 1400)
        .expect(dataGrid.getDataCell(0, 14).element.focused)
        .ok()
        .expect(headerRow.getDataHeaderCells().count)
        .eql(10);
    }).before(async () => createWidget('dxDataGrid', {
      width: 500,
      rtlEnabled,
      dataSource: generateData(10, 20),
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
        useNative,
      },
    }));

    test(`DataGrid should scroll to the next virtual cell and focus it when navigating with Right key (rtlEnabled: ${rtlEnabled}, useNative: ${useNative})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid('#container');
      const headerRow = dataGrid.getHeaders().getHeaderRow(0);
      const expectedScrollLeft = rtlEnabled ? 1400 : 100;
      const navigationDirection = rtlEnabled ? 'left' : 'right';

      // assert
      await t
        .expect(dataGrid.isReady())
        .ok()
        .expect(headerRow.getDataHeaderCells().count)
        .eql(5);

      // act
      /*
        We can't use the TestCafe API (for example, click)
        because it doesn't work correctly in RTL mode.
        Specifically, the negative scroll position is reset
        when calling the click method.
      */
      await triggerEvent(dataGrid.getDataCell(0, 4).element, 'dxpointerdown');

      // assert
      await t
        .expect(dataGrid.getDataCell(0, 4).element.focused)
        .ok();

      // act
      await t.pressKey(navigationDirection);

      // assert
      await t
        .expect(dataGrid.getScrollLeft())
        .eql(expectedScrollLeft)
        .expect(dataGrid.getDataCell(0, 5).element.focused)
        .ok()
        .expect(headerRow.getDataHeaderCells().count)
        .eql(10);
    }).before(async () => createWidget('dxDataGrid', {
      width: 500,
      rtlEnabled,
      dataSource: generateData(10, 20),
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
        useNative,
      },
    }));

    test(`DataGrid should scroll to the previous virtual cell and focus it when navigating with Left key (rtlEnabled: ${rtlEnabled}, useNative: ${useNative})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid('#container');
      const headerRow = dataGrid.getHeaders().getHeaderRow(0);
      const navigationDirection = rtlEnabled ? 'right' : 'left';

      // assert
      await t
        .expect(dataGrid.isReady())
        .ok();

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      // assert
      await t
        .expect(await dataGrid.getScrollLeft())
        .eql(rtlEnabled ? 0 : 1500)
        .expect(dataGrid.getDataCell(0, 19).element.exists)
        .ok()
        .expect(headerRow.getDataHeaderCells().count)
        .eql(5);

      // act
      /*
        We can't use the TestCafe API (for example, click)
        because it doesn't work correctly in RTL mode.
        Specifically, the negative scroll position is reset
        when calling the click method.
      */
      await triggerEvent(dataGrid.getDataCell(0, 15).element, 'dxpointerdown');

      // assert
      await t
        .expect(dataGrid.getDataCell(0, 15).element.focused)
        .ok();

      // act
      await t.pressKey(navigationDirection);

      // assert
      await t
        .expect(dataGrid.getScrollLeft())
        .eql(rtlEnabled ? 100 : 1400)
        .expect(dataGrid.getDataCell(0, 14).element.focused)
        .ok()
        .expect(headerRow.getDataHeaderCells().count)
        .eql(10);
    }).before(async () => createWidget('dxDataGrid', {
      width: 500,
      rtlEnabled,
      dataSource: generateData(10, 20),
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
        useNative,
      },
    }));
  });
});

test('DataGrid should move focus from Save to Cancel button on Tab press in row editing mode with virtual columns (T1326106)', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');

  await t
    .expect(dataGrid.isReady())
    .ok();

  const commandCell = dataGrid.getDataRow(0).getCommandCell(5);

  // act - click Edit button on first row
  await t.click(commandCell.getButton(0));

  const saveButton = commandCell.getButton(0);
  const cancelButton = commandCell.getButton(1);

  // assert
  await t
    .expect(saveButton.exists)
    .ok()
    .expect(cancelButton.exists)
    .ok();

  const lastDataCell = dataGrid.getDataCell(0, 4);

  // act
  await t.click(lastDataCell.element);

  // assert
  await t
    .expect(lastDataCell.isFocused)
    .ok();

  // act
  await t.pressKey('tab');

  // assert
  await t
    .expect(saveButton.focused)
    .ok();

  // act
  await t.pressKey('tab');

  // assert
  await t
    .expect(cancelButton.focused)
    .ok();

  // act
  await t.pressKey('tab');

  // assert - First cell of the second row should be focused
  await t
    .expect(dataGrid.getDataCell(1, 0).isFocused)
    .ok();
}).before(async () => createWidget('dxDataGrid', {
  width: 800,
  dataSource: generateData(10, 5),
  columnWidth: 100,
  keyExpr: 'field1',
  editing: {
    mode: 'row',
    allowUpdating: true,
    allowDeleting: true,
  },
  scrolling: {
    columnRenderingMode: 'virtual',
  },
}));

test('DataGrid should move focus from Save to Cancel button on Shift + Tab press in row editing mode with virtual columns (T1326106)', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');

  await t
    .expect(dataGrid.isReady())
    .ok();

  const commandCell = dataGrid.getDataRow(1).getCommandCell(5);

  // act - click Edit button on second row
  await t.click(commandCell.getButton(0));

  const saveButton = commandCell.getButton(0);
  const cancelButton = commandCell.getButton(1);

  // assert
  await t
    .expect(saveButton.exists)
    .ok()
    .expect(cancelButton.exists)
    .ok();

  const firstDataCell = dataGrid.getDataCell(1, 0);

  // act
  await t.click(firstDataCell.element);

  // assert
  await t
    .expect(firstDataCell.isFocused)
    .ok();

  // act
  await t.pressKey('shift+tab');

  // assert
  await t
    .expect(cancelButton.focused)
    .ok();

  // act
  await t.pressKey('shift+tab');

  // assert
  await t
    .expect(saveButton.focused)
    .ok();

  // act
  await t.pressKey('shift+tab');

  // assert - Last cell of the first row should be focused
  await t
    .expect(dataGrid.getDataCell(0, 4).isFocused)
    .ok();
}).before(async () => createWidget('dxDataGrid', {
  width: 800,
  dataSource: generateData(10, 5),
  columnWidth: 100,
  keyExpr: 'field1',
  editing: {
    mode: 'row',
    allowUpdating: true,
    allowDeleting: true,
  },
  scrolling: {
    columnRenderingMode: 'virtual',
  },
}));
