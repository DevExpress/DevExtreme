import type { Properties } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { pointWithin } from '../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { makeRowsViewTemplatesAsync } from '../../helpers/asyncTemplates';

test.describe('FixedColumns', () => {
  // T1148937
  test('Hovering over a row should work correctly when there is a fixed column and a column with a cellTemplate (React)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (): Properties => ({
      dataSource: [...new Array(2)].map((_, index) => ({ id: index, text: `item ${index}` })),
      keyExpr: 'id',
      renderAsync: false,
      hoverStateEnabled: true,
      templatesRenderAsynchronously: true,
      columns: [
        { dataField: 'id', fixed: true },
        { dataField: 'text', cellTemplate: '#test' },
      ],
      columnFixing: {
        // @ts-expect-error private option
        legacyMode: true,
      },
      showBorders: true,
    }));

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const firstDataRow = dataGrid.getDataRow(0);
    const firstFixedDataRow = dataGrid.getFixedDataRow(0);
    const secondDataRow = dataGrid.getDataRow(1);
    const secondFixedDataRow = dataGrid.getFixedDataRow(1);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // simulating async rendering in React
    await page.evaluate((gridSelector) => {
      const grid = ($(gridSelector) as any).dxDataGrid('instance');

      // eslint-disable-next-line no-underscore-dangle
      grid.getView('rowsView')._templatesCache = {};

      // eslint-disable-next-line no-underscore-dangle
      grid._getTemplate = () => ({
        render(options) {
          // The template renders after the grid, like an asynchronous template of a framework.
          // eslint-disable-next-line no-restricted-syntax
          setTimeout(() => {
            ($(options.container) as any).append(($('<div/>') as any).text(options.model.value));
            options.deferred?.resolve();
          }, 100);
        },
      });

      grid.repaint();
    }, DEFAULT_SELECTOR);

    // The templates of both rows render together a moment after the repaint.
    await expect(secondDataRow.getDataCell(1).element).toHaveText('item 1');

    // act
    await firstDataRow.element.hover();

    // assert
    await testScreenshot(page, 'T1148937-grid-hover-row-1.png', { element: dataGrid.element });

    await firstDataRow.expectHovered();
    await firstFixedDataRow.expectHovered();

    // act
    // The main table lies over the middle of the fixed row and takes the pointer there, as it did
    // when TestCafe hovered the fixed row.
    const secondFixedRowCenter = await pointWithin(secondFixedDataRow.element);
    await page.mouse.move(secondFixedRowCenter.x, secondFixedRowCenter.y);

    // assert
    await testScreenshot(page, 'T1148937-grid-hover-row-2.png', { element: dataGrid.element });

    await secondDataRow.expectHovered();
    await secondFixedDataRow.expectHovered();
  });

  test.describe(() => {
    test.use({ browserSize: [800, 800] });

    // T1177143
    test('Fixed to the right columns should appear when any column has undefined or 0 width', async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        columnAutoWidth: false,
        dataSource: [{
          Column1: 'a',
          Column2: 'b',
          Column3: 'b',
          Column4: 'c',
          Column5: 'd',
          Column6: 'e',
          Column7: 'f',
          Column8: 'g',
        }],
        columnFixing: {
          // @ts-expect-error private option
          legacyMode: true,
        },
        columns: [
          {
            dataField: 'Column1', fixed: true, fixedPosition: 'right', width: 100,
          },
          { dataField: 'Column2', width: undefined },
          { dataField: 'Column3', width: 0 },
          { dataField: 'Column4', width: 220 },
          { dataField: 'Column5', width: 240 },
          { dataField: 'Column6', width: 240 },
          { dataField: 'Column7', width: 0 },
          { dataField: 'Column8', width: 270 },
        ],
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      // act
      await testScreenshot(page, 'T1177143-right-fixed-column-with-no-width-columns-1.png', { element: dataGrid.element });

      await dataGrid.scrollTo({ left: 5000 });

      await testScreenshot(page, 'T1177143-right-fixed-column-with-no-width-columns-2.png', { element: dataGrid.element });
    });
  });

  // T1180834
  test('Hovering over a row should work correctly after scrolling when there is a fixed column with a cellTemplate and virtual scrolling is used (React)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (): Properties => ({
      dataSource: [...new Array(60)].map((_, index) => ({ id: index, text1: `item1 ${index}`, text2: `item2 ${index}` })),
      height: 500,
      keyExpr: 'id',
      renderAsync: false,
      hoverStateEnabled: true,
      templatesRenderAsynchronously: true,
      columns: [
        'id',
        {
          dataField: 'text1',
          cellTemplate: (_, { value }) => ($('<div/>') as any).text(value),
          fixed: true,
        },
        'text2',
      ],
      columnFixing: {
        // @ts-expect-error private option
        legacyMode: true,
      },
      paging: {
        enabled: false,
      },
      scrolling: {
        useNative: false,
        showScrollbar: 'never',
        rowRenderingMode: 'virtual',
      },
      showBorders: true,
    }));

    await makeRowsViewTemplatesAsync(page, DEFAULT_SELECTOR, 100);

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    let dataRow = dataGrid.getDataRow(1);
    let fixedDataRow = dataGrid.getDataRow(1);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await dataRow.element.hover();

    // assert
    await testScreenshot(page, 'T1180834-grid-hover-row-after-scrolling-1.png', { element: dataGrid.element });

    await dataRow.expectHovered();
    await fixedDataRow.expectHovered();

    // act
    await dataGrid.scrollTo({ top: 300 });
    dataRow = dataGrid.getDataRow(10);
    await dataRow.element.hover();

    // assert
    fixedDataRow = dataGrid.getDataRow(10);

    await testScreenshot(page, 'T1180834-grid-hover-row-after-scrolling-2.png', { element: dataGrid.element });

    await dataRow.expectHovered();
    await fixedDataRow.expectHovered();
  });

  test.describe(() => {
    test.use({ browserSize: [800, 800] });

    // T1193153
    test('The grid layout should be correct after resizing the window when there are fixed and band columns', async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        columnAutoWidth: true,
        dataSource: [{}],
        columnFixing: {
          // @ts-expect-error private option
          legacyMode: true,
        },
        columns: [{
          caption: 'Fixed column',
          fixed: true,
          columns: [{
            caption: 'Banded column',
            width: 150,
          }],
        }, {
          caption: 'Default column',
        }, {
          type: 'buttons',
          width: 50,
        }],
      });

      // arrange
      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      // assert
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      // act
      await testScreenshot(page, 'T1193153-layout-with-fixed-and-band-columns-1.png', { element: dataGrid.element });
      await page.setViewportSize({ width: 400, height: 400 });
      await testScreenshot(page, 'T1193153-layout-with-fixed-and-band-columns-2.png', { element: dataGrid.element });
    });
  });

  // T1322380
  test('The grid layout should be correct after unfixing a column via the context menu', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        ID: 1,
        Title: 'Mr.',
        FirstName: 'John',
        LastName: 'Heart',
        Position: 'CEO',
        Address: '351 S Hill St.',
        City: 'Los Angeles',
        Zipcode: 90013,
        State: 'California',
      }, {
        ID: 2,
        Title: 'Mrs.',
        FirstName: 'Olivia',
        LastName: 'Peyton',
        Position: 'Sales Assistant',
        Address: '807 W Paseo Del Mar',
        City: 'Los Angeles',
        Zipcode: 90036,
        State: 'California',
      }],
      keyExpr: 'ID',
      columnAutoWidth: true,
      showBorders: true,
      repaintChangesOnly: true,
      columnFixing: { enabled: true },
      width: 800,
      columns: [
        { dataField: 'Title', fixed: true },
        { dataField: 'FirstName', fixed: true },
        { dataField: 'LastName', fixed: true },
        { dataField: 'Position', fixed: true },
        { dataField: 'Address' },
        { dataField: 'City' },
        { dataField: 'Zipcode' },
        { dataField: 'State' },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const contextMenu = dataGrid.getContextMenu();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act: unfix Position column via context menu
    const positionHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);
    await positionHeader.element.click({ button: 'right' });
    await contextMenu.getItemByText('Unfix').click();

    // assert
    await testScreenshot(page, 'T1322380-unfix-column-via-context-menu.png', { element: dataGrid.element });
  });

  // T1317623
  test('Expand columns headers offsets should be correct with fixed band columns and fixed command columns (T1317623)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        {
          ID: 1,
          CompanyName: 'Super Mart of the West',
          Address: '702 SW 8th Street',
          City: 'Bentonville',
          State: 'Arkansas',
          Zipcode: 72716,
          Phone: '(800) 555-2797',
          Fax: '(800) 555-2171',
        },
        {
          ID: 2,
          CompanyName: 'K&S Music',
          Address: '1000 Nicllet Mall',
          City: 'Minneapolis',
          State: 'Minnesota',
          Zipcode: 55403,
          Phone: '(612) 304-6073',
          Fax: '(612) 304-6074',
        },
      ],
      keyExpr: 'ID',
      width: '100%',
      showBorders: true,
      columnWidth: 200,
      columnFixing: { enabled: true },
      selection: { mode: 'multiple' },
      grouping: { autoExpandAll: true },
      masterDetail: {
        enabled: true,
      },
      columns: [
        {
          caption: 'Company Info',
          fixed: true,
          fixedPosition: 'left',
          columns: [
            { dataField: 'CompanyName', groupIndex: 1, showWhenGrouped: true },
            { dataField: 'Phone' },
            { dataField: 'Fax' },
          ],
        },
        'City',
        {
          dataField: 'State',
          groupIndex: 0,
        },
        'Address',
        'Zipcode',
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'T1317623-expand-columns-with-band-columns.png', { element: dataGrid.element });

    await dataGrid.scrollTo({ left: 5000 });

    await testScreenshot(page, 'T1317623-horizontal-scroll-with-fixed-band-columns.png', { element: dataGrid.element });
  });
});
