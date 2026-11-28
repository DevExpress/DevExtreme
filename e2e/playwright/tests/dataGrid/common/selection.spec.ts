import type { Properties } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../helpers/const';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import CheckBox from '../../../models/checkBox';
import DataGrid from '../../../models/dataGrid';

const data = [
  { ID: 'aaa', Name: 'Name 1' },
  { ID: 'AAA', Name: 'Name 2' },
  { ID: 'BBB', Name: 'Name 3' },
];

test.describe('Selection', () => {
  test('selectAll state should be correct after unselect item if refresh(true) is called inside onSelectionChanged (T1048081)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (): Properties => ({
      dataSource: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
      ],
      keyExpr: 'id',
      selectedRowKeys: [1, 2],
      paging: {
        pageSize: 3,
      },
      selection: {
        mode: 'multiple',
      },
      onSelectionChanged(e) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        e.component.refresh(true);
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    const firstRowSelectionCheckBox = new CheckBox(
      page,
      dataGrid.getDataCell(0, 0).getEditor().element,
    );
    const selectAllCheckBox = new CheckBox(
      page,
      dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).getEditor().element,
    );

    // act
    await firstRowSelectionCheckBox.element.click();
    // assert
    await expect.poll(() => selectAllCheckBox.option('value')).toBe(undefined);
    await expect.poll(() => firstRowSelectionCheckBox.option('value')).toBe(false);
  });

  // T1141405
  test('The Select All checkbox should be visible when a column headerCellTemplate is specified (React)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [...new Array(2)].map((_, index) => ({ id: index, text: `item ${index}` })),
      renderAsync: false,
      // @ts-expect-error private option
      templatesRenderAsynchronously: true,
      loadingTimeout: 200,
      columns: [
        { dataField: 'id', headerCellTemplate: '#test' },
        { dataField: 'text' },
      ],
      selection: {
        mode: 'multiple',
      },
    });

    // simulating async rendering in React
    await page.evaluate((gridSelector) => {
      const grid = ($(gridSelector) as any).dxDataGrid('instance');

      // eslint-disable-next-line no-underscore-dangle
      grid.getView('columnHeadersView')._templatesCache = {};

      // eslint-disable-next-line no-underscore-dangle
      grid._getTemplate = () => ({
        render(options) {
          // The template renders after the grid, like an asynchronous template of a framework.
          // eslint-disable-next-line no-restricted-syntax
          setTimeout(() => {
            $(options.container).html('<div>Custom  header template</div>');
            options.deferred?.resolve();
          }, 100);
        },
      });
    }, DEFAULT_SELECTOR);

    // arrange, act
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await expect(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1).element).toContainText('header template');

    // assert
    await testScreenshot(page, 'T1141405-grid-select-all.png', { element: dataGrid.element });
  });

  // T1214734
  test('Select rows by shift should work when grid has real time updates', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (): Properties => ({
      dataSource: {
        store: {
          data: [...new Array(50)].map((_, i) => ({
            ID: i + 1,
            CompanyName: `company name ${i + 1}`,
            City: `city ${i + 1}`,
          })),
          type: 'array',
          key: 'ID',
        },
        reshapeOnPush: true,
        pushAggregationTimeout: 0,
      },
      height: 600,
      repaintChangesOnly: true,
      selection: {
        mode: 'multiple',
      },
      onSelectionChanged(e) {
        e.component.getDataSource().store().push([{
          type: 'update',
          key: 3,
          data: {
            City: 'test123',
          },
        }]);
      },
      columnAutoWidth: true,
      showBorders: true,
      paging: {
        pageSize: 10,
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const secondRow = dataGrid.getDataRow(1).getSelectCheckBox();
    const seventhRow = dataGrid.getDataRow(6).getSelectCheckBox();
    const checkRowSelectionStates = async (
      startRowIndex: number,
      endRowIndex: number,
    ): Promise<void> => {
      for (let i = startRowIndex; i <= endRowIndex; i += 1) {
        await dataGrid.getDataRow(i).expectSelected();
      }
    };

    // act
    await secondRow.click();
    // The grid shows the update pushed on the selection a moment later.
    await expect(dataGrid.getDataCell(2, 3).element).toHaveText('test123');

    // assert
    await checkRowSelectionStates(1, 1);

    // act
    await seventhRow.click({ modifiers: ['Shift'] });

    // assert
    await checkRowSelectionStates(1, 6);
  });

  // --- T1234676 ---

  (['base', undefined] as ('base' | undefined)[]).forEach((sensitivity) => {
    test(`Deferred selection should work correctly with deferred sensitivity: ${sensitivity}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: data,
        keyExpr: 'ID',
        columns: ['ID', 'Name'],
        showBorders: true,
        selection: {
          mode: 'multiple',
          deferred: true,
          sensitivity,
        },
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const checkBoxCell = dataGrid.getDataCell(0, 0);
      const firstRow = dataGrid.getDataRow(0);
      const secondRow = dataGrid.getDataRow(1);

      await checkBoxCell.element.click();

      await firstRow.expectSelected();
      await secondRow.expectSelected();
    });
  });

  test('Deferred selection should work correctly with deferred sensitivity: \'case\'', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: data,
      keyExpr: 'ID',
      columns: ['ID', 'Name'],
      showBorders: true,
      selection: {
        mode: 'multiple',
        deferred: true,
        sensitivity: 'case',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const checkBoxCell = dataGrid.getDataCell(0, 0);
    const firstRow = dataGrid.getDataRow(0);
    const secondRow = dataGrid.getDataRow(1);

    await checkBoxCell.element.click();

    await firstRow.expectSelected();
    await secondRow.expectSelected(false);
  });

  test('Sensitivity option change should be correctly handled during runtime change', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: data,
      keyExpr: 'ID',
      columns: ['ID', 'Name'],
      showBorders: true,
      selection: {
        mode: 'multiple',
        deferred: true,
        sensitivity: 'base',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const checkBoxCell = dataGrid.getDataCell(0, 0);
    const firstRow = dataGrid.getDataRow(0);
    const secondRow = dataGrid.getDataRow(1);

    await checkBoxCell.element.click();

    await firstRow.expectSelected();
    await secondRow.expectSelected();

    await dataGrid.apiChangeSensitivity('case');

    await firstRow.expectSelected(false);
    await secondRow.expectSelected(false);

    await checkBoxCell.element.click();

    await firstRow.expectSelected();
    await secondRow.expectSelected(false);
  });

  // ---

  test('"Select All" checkbox should not react when not visible', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
      keyExpr: 'orderId',
      selection: {
        mode: 'multiple',
      },
      paging: {
        pageSize: 10,
      },
      pager: {
        visible: true,
      },
      filterRow: {
        visible: true,
      },
      columns: [{
        dataField: 'orderId',
        caption: 'Order ID',
        width: 90,
      },
      'city', {
        dataField: 'country',
        width: 180,
      },
      'region', {
        dataField: 'date',
        dataType: 'date',
      }, {
        dataField: 'amount',
        format: 'currency',
        width: 90,
      }],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const selectAllCheckBox = new CheckBox(
      page,
      dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).getEditor().element,
    );
    const editorCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element;

    await expect(selectAllCheckBox.element).toBeAttached();
    await expect(selectAllCheckBox.element).toBeHidden();

    await editorCell.click();

    await expect(selectAllCheckBox.element).toBeHidden();
  });

  test('"Deselect all" should work after changing showCheckboxMode', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }, { a: 7 },
      ],
      keyExpr: 'a',
      selection: {
        mode: 'multiple',
        showCheckBoxesMode: 'always',
      },
      selectedRowKeys: [1, 2],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.option('selection.showCheckBoxesMode', 'onClick');

    const selectAllCheckBox = new CheckBox(
      page,
      dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).getEditor().element,
    );

    await selectAllCheckBox.element.click(); // select all
    await selectAllCheckBox.element.click(); // deselect all

    await expect.poll(() => selectAllCheckBox.option('value')).toBe(false);

    for (let i = 0; i < 7; i += 1) {
      await dataGrid.getDataRow(i).expectSelected(false);
    }
  });
});
