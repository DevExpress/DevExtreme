import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('FixedColumns', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  // T1148937

  test.skip('Hovering over a row should work correctly when there is a fixed column and a column with a cellTemplate (React)', async ({ page }) => {
    // TODO: Playwright migration - TestCafe API remnants (dataGrid undefined, t.ok, compareResults, row.isHovered)
    await createWidget(page, 'dxDataGrid', {
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
      });

      await page.waitForTimeout(100);

      // simulating async rendering in React
      await page.evaluate(() => {
        const dataGrid = ($('#container') as any).dxDataGrid('instance');

        // eslint-disable-next-line no-underscore-dangle
        dataGrid.getView('rowsView')._templatesCache = {};

        // eslint-disable-next-line no-underscore-dangle
        dataGrid._getTemplate = () => ({
          render(options) {
            setTimeout(() => {
              ($(options.container) as any).append(($('<div/>') as any).text(options.model.value));
              options.deferred?.resolve();
            }, 100);
          },
        });

        dataGrid.repaint();
      });

      await page.waitForTimeout(200);

    // arrange
      const firstDataRow = page.locator('.dx-data-row').nth(0);
    const firstFixedDataRow = dataGrid.getFixedDataRow(0);
    const secondDataRow = page.locator('.dx-data-row').nth(1);
    const secondFixedDataRow = dataGrid.getFixedDataRow(1);
    // act
    await (firstDataRow.element).hover();

    // assert
    await testScreenshot(page, 'T1148937-grid-hover-row-1.png', { element: page.locator('#container') });

    expect(await firstDataRow.isHovered);
    await t.ok();
    expect(await firstFixedDataRow.isHovered);
    await t.ok();

    // act
    await (secondFixedDataRow.element).hover();

    // assert
    await testScreenshot(page, 'T1148937-grid-hover-row-2.png', { element: page.locator('#container') });

    expect(await secondDataRow.isHovered);
    await t.ok();
    expect(await secondFixedDataRow.isHovered);
    await t.ok();
    expect(await compareResults.isValid());
    await t.ok(compareResults.errorMessages());
  });

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
        { dataField: 'Column1', fixed: true, fixedPosition: 'right', width: 100 },
        { dataField: 'Column2', width: undefined },
        { dataField: 'Column3', width: 0 },
        { dataField: 'Column4', width: 220 },
        { dataField: 'Column5', width: 240 },
        { dataField: 'Column6', width: 240 },
        { dataField: 'Column7', width: 0 },
        { dataField: 'Column8', width: 270 },
      ],
    });

    const dataGrid = new DataGrid(page, '#container');
    await expect(dataGrid.getContainer()).toBeVisible();

    await testScreenshot(page, 'T1177143-right-fixed-column-with-no-width-columns-1.png', { element: page.locator('#container') });

    await dataGrid.scrollTo({ x: 5000 });
    await page.waitForTimeout(100);

    await testScreenshot(page, 'T1177143-right-fixed-column-with-no-width-columns-2.png', { element: page.locator('#container') });
  });

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
        columns: [{ caption: 'Banded column', width: 150 }],
      }, {
        caption: 'Default column',
      }, {
        type: 'buttons',
        width: 50,
      }],
    });

    const dataGrid = new DataGrid(page, '#container');
    await expect(dataGrid.getContainer()).toBeVisible();

    await testScreenshot(page, 'T1193153-layout-with-fixed-and-band-columns-1.png', { element: page.locator('#container') });

    await page.setViewportSize({ width: 400, height: 400 });
    await page.waitForTimeout(100);

    await testScreenshot(page, 'T1193153-layout-with-fixed-and-band-columns-2.png', { element: page.locator('#container') });
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

    const dataGrid = new DataGrid(page, '#container');
    await expect(dataGrid.getContainer()).toBeVisible();

    const positionHeader = dataGrid.getHeaders().getHeaderRow(0).locator('td').nth(3);
    await positionHeader.click({ button: 'right' });

    const contextMenu = dataGrid.getContextMenu();
    await contextMenu.getItemByText('Unfix').click();
    await page.waitForTimeout(100);

    await testScreenshot(page, 'T1322380-unfix-column-via-context-menu.png', { element: page.locator('#container') });
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
      masterDetail: { enabled: true },
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
        { dataField: 'State', groupIndex: 0 },
        'Address',
        'Zipcode',
      ],
    });

    const dataGrid = new DataGrid(page, '#container');
    await expect(dataGrid.getContainer()).toBeVisible();

    await testScreenshot(page, 'T1317623-expand-columns-with-band-columns.png', { element: page.locator('#container') });

    await dataGrid.scrollTo({ x: 5000 });
    await page.waitForTimeout(100);

    await testScreenshot(page, 'T1317623-horizontal-scroll-with-fixed-band-columns.png', { element: page.locator('#container') });
  });
});
