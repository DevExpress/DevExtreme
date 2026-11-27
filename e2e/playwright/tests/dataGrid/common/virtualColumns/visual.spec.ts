import type { Page } from '@playwright/test';
import type { Column, Properties } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { dragToElement, dragToOffset } from '../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { isScrollAtEnd } from '../../helpers/rowDraggingHelpers';
import { waitForScrollHandled } from '../../helpers/waitForQueuedTimers';

const MAXIMIZED_WINDOW_SIZE = { width: 1920, height: 1080 };

const showDataGrid = (page: Page): Promise<void> => page.evaluate(() => {
  $('#wrapperContainer').css('display', '');
});

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

const generateColumns = (columnCount: number): Column[] => [...new Array(columnCount)]
  .map((_, index) => ({
    dataField: `field${index + 1}`,
  }));

test.describe('Virtual Columns.Visual', () => {
  // T1090735
  test('The updateDimensions method should render the grid if a container was hidden and columnRenderingMode is virtual', async ({ page }) => {
    await page.setViewportSize(MAXIMIZED_WINDOW_SIZE);

    await page.evaluate((selector) => {
      $(selector).wrap('<div id=\'wrapperContainer\' style=\'display: none;\'></div>');
    }, DEFAULT_SELECTOR);

    await createWidget(page, 'dxDataGrid', {
      height: 440,
      dataSource: generateData(150, 500),
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect(page.locator('#wrapperContainer')).toBeHidden();

    await showDataGrid(page);

    await expect(page.locator('#wrapperContainer')).toBeVisible();

    await dataGrid.apiUpdateDimensions();

    await testScreenshot(page, 'T1090735-grid-virtual-columns.png', { element: '#wrapperContainer' });
  });

  // T1176160
  [true, false].forEach((useNative) => {
    test(`The vertical scroll position should not be reset after horizontal scrolling when there are a fixed column and a master detail row (useNative = ${useNative})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', ({ data, native }): Properties => ({
        dataSource: data,
        keyExpr: 'id',
        width: 500,
        height: 500,
        columnWidth: 100,
        scrolling: {
          columnRenderingMode: 'virtual',
          mode: 'virtual',
          useNative: native,
        },
        columnFixing: {
          // @ts-expect-error private option
          legacyMode: true,
        },
        customizeColumns(columns) {
          // eslint-disable-next-line no-param-reassign
          columns[0].fixed = true;
        },
        masterDetail: {
          enabled: true,
          template() {
            return ($('<div style=\'height: 300px;\'>') as any).text('details');
          },
        },
      }), DEFAULT_SELECTOR, {
        arg: {
          data: generateData(10, 50).map((item, index) => ({ ...item, id: index })),
          native: useNative,
        },
      });

      // arrange
      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await dataGrid.apiExpandRow(9);

      // assert
      await expect(dataGrid.getMasterRow(0).element).toBeAttached();

      // act
      await dataGrid.scrollTo({ top: 5000 });

      // assert
      await testScreenshot(page, `T1176160-master-detail-with-virtual-columns-and-useNative=${useNative}-1.png`, { element: dataGrid.element });

      // act
      await dataGrid.scrollTo({ left: 1000 });
      await dataGrid.scrollTo({ left: 2000 });

      // The rows settle a moment after two quick scrolls. A verify run waits for that;
      // --update-snapshots can record the frame before it.
      // assert
      await testScreenshot(page, `T1176160-master-detail-with-virtual-columns-and-useNative=${useNative}-2.png`, { element: dataGrid.element });
    });
  });

  // T1176161
  test('The markup should be correct after horizontal scrolling and collapse of the master detail row', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data): Properties => ({
      dataSource: data,
      keyExpr: 'id',
      width: 500,
      height: 500,
      columnWidth: 100,
      scrolling: {
        mode: 'virtual',
        columnRenderingMode: 'virtual',
      },
      columnFixing: {
        // @ts-expect-error private option
        legacyMode: true,
      },
      customizeColumns(columns) {
        // eslint-disable-next-line no-param-reassign
        columns[0].fixed = true;
      },
      masterDetail: {
        enabled: true,
        template() {
          return ($('<div style=\'height: 300px;\'>') as any).text('details');
        },
      },
      onContentReady(e) {
        // @ts-expect-error flag for test
        // eslint-disable-next-line no-underscore-dangle
        if (!e.component.__initExpand) {
          // @ts-expect-error flag for test
          // eslint-disable-next-line no-underscore-dangle
          e.component.__initExpand = true;
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          e.component.expandRow(0);
        }
      },
    }), DEFAULT_SELECTOR, {
      arg: generateData(10, 50).map((item, index) => ({ ...item, id: index })),
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // The grid expands the first row on its first content ready.
    await expect(dataGrid.getMasterRow(0).element).toBeAttached();
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await dataGrid.scrollTo({ left: 2000 });
    await waitForScrollHandled(page);
    await dataGrid.scrollTo({ left: 4000 });

    // The cells of the new columns render a moment after the scroll. A verify run waits for that;
    // --update-snapshots can record the frame before it.
    // assert
    await testScreenshot(page, 'T1176161-master-detail-with-virtual-columns-1.png', { element: dataGrid.element });

    // act
    await dataGrid.apiCollapseRow(0);

    // assert
    await testScreenshot(page, 'T1176161-master-detail-with-virtual-columns-2.png', { element: dataGrid.element });
  });

  // T1191875
  test('Columns should be rendered correctly after reinit of columns controller', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      height: 440,
      dataSource: generateData(150, 500),
      columns: generateColumns(500),
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.scrollTo({ left: 1000 });
    await expect.poll(() => dataGrid.getScrollLeft()).toBe(1000);

    const columns = generateColumns(500);
    columns[0].visible = false;
    await dataGrid.option('columns', columns);
    await expect.poll(() => dataGrid.getScrollLeft()).toBe(1000);

    columns[0].visible = true;
    await dataGrid.option('columns', columns);
    await expect.poll(() => dataGrid.getScrollLeft()).toBe(1000);

    await testScreenshot(page, 'grid-virtual-columns-after-reinit.png');
  });

  test('Columns reordering should work with virtual columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      allowColumnReordering: true,
      height: 440,
      dataSource: generateData(150, 500),
      columns: generateColumns(500),
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.scrollTo({ left: 100000 });

    await dragToOffset(
      page,
      dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(499).element,
      -110,
      0,
    );

    await testScreenshot(page, 'data-grid__virtual-columns__reoder.png', { element: dataGrid.element });
  });

  test('Grouping should work with virtual columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      height: 440,
      groupPanel: {
        visible: true,
      },
      dataSource: generateData(150, 500),
      columns: generateColumns(500),
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.scrollTo({ left: 100000 });

    await dragToElement(
      page,
      dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(499).element,
      dataGrid.getGroupPanel().element,
    );

    await testScreenshot(page, 'data-grid__virtual-columns__grouping.png', { element: dataGrid.element });
  });

  test('Column chooser should work with virtual columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      height: 440,
      columnChooser: {
        enabled: true,
      },
      dataSource: generateData(150, 500),
      columns: generateColumns(500),
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.scrollTo({ left: 100000 });

    await dataGrid.getColumnChooserButton().click();
    await dataGrid.getColumnChooser().expectOpened();

    await dragToElement(
      page,
      dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(499).element,
      dataGrid.getColumnChooser().content,
    );
    await testScreenshot(page, 'data-grid__virtual-columns__column-chooser.png', { element: dataGrid.element });
  });

  test('Group row should have right colspan with summary, virtual columns and fixed columns (T1221369)', async ({ page }) => {
    const generatedColumns = generateColumns(20);
    const columns = [
      {
        ...generatedColumns[0],
        groupIndex: 0,
      },
      {
        ...generatedColumns[1],
        fixed: true,
      },
      {
        ...generatedColumns[2],
        fixed: true,
      },
      ...generatedColumns.splice(3),
    ];
    const data = generateData(10, 20);

    await createWidget(page, 'dxDataGrid', {
      dataSource: data,
      width: 400,
      height: 400,
      columns,
      columnFixing: {
        enabled: true,
        // @ts-expect-error private option
        legacyMode: true,
      },
      columnMinWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
      summary: {
        groupItems: [{
          column: columns[2].dataField,
          summaryType: 'count',
          alignByColumn: true,
        }],
      },
    });

    const grid = new DataGrid(page, DEFAULT_SELECTOR);

    await testScreenshot(page, 'T1221369_fixed-summary-with-virtual-cols_0.png', { element: grid.element });

    // NOTE: There is an issue with Scrollable
    // So, we should scroll two times to reach maximum right scroll position
    await grid.scrollTo({ left: 10000 });
    await grid.scrollTo({ left: 10000 });

    await testScreenshot(page, 'T1221369_fixed-summary-with-virtual-cols_1.png', { element: grid.element });

    await grid.scrollTo({ left: 0 });

    await testScreenshot(page, 'T1221369_fixed-summary-with-virtual-cols_2.png', { element: grid.element });
  });

  // T1260472
  test('Header, fixed columns and virtual scroll bar should have stable position during async render and virtual horizontal scrolling', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data): Properties => {
      const defaultColumnConfig = {
        headerCellTemplate: 'headerCellTemplate',
        cellTemplate: 'cellTemplate',
      };

      return {
        dataSource: data,
        keyExpr: 'field1',
        showBorders: true,
        width: 500,
        columnWidth: 100,
        scrolling: {
          rowRenderingMode: 'virtual',
          columnRenderingMode: 'virtual',
          mode: 'virtual',
          useNative: false,
        },
        columns: Array.from({ length: 20 }).map((_, i) => ({
          ...defaultColumnConfig,
          caption: `Product${i + 1}`,
          fixed: i === 0,
          columns: [
            { ...defaultColumnConfig, dataField: `field${(2 * i) + 1}`, fixed: i === 0 },
            { ...defaultColumnConfig, dataField: `field${(2 * i) + 2}`, fixed: i === 0 },
          ],
        })),
        // @ts-expect-error private option
        templatesRenderAsynchronously: true,
        integrationOptions: {
          templates: {
            headerCellTemplate: {
              render({ model, container, onRendered }) {
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                const title = model.column.caption == null ? null : model.column.caption;
                const content = $(`<span title='${title}'>
          ${title}
        </span>`);
                container.append(content);
                if ((window as any).deferred) {
                  (window as any).deferred.done(onRendered);
                } else {
                  onRendered();
                }
              },
            },
            cellTemplate: {
              render({ model, container, onRendered }) {
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                const title = model.value == null ? null : model.value;
                const content = $(`<span title='${title}'>
          ${title}
        </span>`);
                container.append(content);
                if ((window as any).deferred) {
                  (window as any).deferred.done(onRendered);
                } else {
                  onRendered();
                }
              },
            },
          },
        },
      };
    }, DEFAULT_SELECTOR, { arg: generateData(3, 50) });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect(dataGrid.getDataRow(0).element).toBeAttached(); // wait for initial render
    await page.evaluate(() => { (window as any).deferred = $.Deferred(); });
    await dataGrid.scrollTo({ left: 2000 });
    await testScreenshot(page, 'T1260472-async-render-during-horizontal-scrolling.png', { element: dataGrid.element });
    await page.evaluate(() => {
      (window as any).deferred.resolve();
      (window as any).deferred = undefined;
    });
    await testScreenshot(page, 'T1260472-async-render-after-horizontal-scrolling.png', { element: dataGrid.element });
  });

  test('Virtual columns should render correctly with repaintChangesOnly and grouping after horizontal scrolling (T1319173)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data): Properties => ({
      dataSource: data,
      keyExpr: 'id',
      height: 400,
      width: 600,
      repaintChangesOnly: true,
      scrolling: {
        columnRenderingMode: 'virtual',
        useNative: false,
      },
      columnWidth: 100,
      customizeColumns(columns) {
        // eslint-disable-next-line no-param-reassign
        columns[1].groupIndex = 0;
      },
    }), DEFAULT_SELECTOR, {
      arg: generateData(10, 50).map((item, index) => ({ id: index, ...item })),
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await expect(dataGrid.getDataCell(1, 1).element).toHaveText('0');

    // act
    await dataGrid.scrollTo({ left: 10000 });

    // assert
    await expect(dataGrid.getDataCell(1, 50).element).toHaveText('1-50');
    await expect.poll(() => isScrollAtEnd(page, 'horizontal')).toBe(true);

    await testScreenshot(page, 'T1319173__datagrid__virtual-columns__repaintChangesOnly=true.png', { element: dataGrid.element });
  });
});
