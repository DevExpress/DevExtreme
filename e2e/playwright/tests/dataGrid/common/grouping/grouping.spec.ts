import type { Properties } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { makeColumnHeadersViewTemplatesAsync } from '../../helpers/asyncTemplates';

const customersT1232129 = [
  {
    id: 1,
    number: 2,
    description: 'Material Description',
    groupId: '',
    articleGroup: 'Material',
  },
];

test.describe('Grouping Panel', () => {
  test('Grouping Panel label should not overflow in a narrow grid (T1103925)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: {
        store: [
          {
            field1: '1', field2: '2', field3: '3', field4: '4', field5: '5',
          },
          {
            field1: '11', field2: '22', field3: '33', field4: '44', field5: '55',
          }],
      },
      width: 200,
      groupPanel: {
        emptyPanelText: 'Long long long long long long long long long long long text',
        visible: true,
      },
      editing: { allowAdding: true, mode: 'batch' },
      columnChooser: {
        enabled: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'groupingPanel.png', { element: dataGrid.getToolbar().element });
  });

  // T1155453
  test('Headers should be rendered correctly after changing the grouping.autoExpandAll when headerCellTemplate is given (React)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (): Properties => ({
      dataSource: [
        {
          field1: '1', field2: 'test1',
        },
        {
          field1: '2', field2: 'test1',
        },
        {
          field1: '3', field2: 'test2',
        },
      ],
      width: 700,
      renderAsync: false,
      // @ts-expect-error private option
      templatesRenderAsynchronously: true,
      columns: [
        { dataField: 'field1', headerCellTemplate: (_, { column }) => $('<div>').text(column.caption as string) },
        { dataField: 'field2', groupIndex: 0 },
      ],
      groupPanel: {
        visible: true,
      },
      grouping: {
        autoExpandAll: true,
      },
    }));

    await makeColumnHeadersViewTemplatesAsync(page, DEFAULT_SELECTOR);

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'T1155453-expanded-groups.png', { element: dataGrid.element });

    // act
    await dataGrid.apiCollapseAllGroups();
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'T1155453-collapsed-groups.png', { element: dataGrid.element });
  });

  // T1155453
  test('Headers should be rendered correctly after changing the grouping.autoExpandAll when there is fixed column and headerCellTemplate is given (React)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (): Properties => ({
      dataSource: [
        {
          field1: '1', field2: 'test1', field3: 'test11',
        },
        {
          field1: '2', field2: 'test1', field3: 'test12',
        },
        {
          field1: '3', field2: 'test2', field3: 'test13',
        },
      ],
      width: 700,
      renderAsync: false,
      templatesRenderAsynchronously: true,
      columnFixing: {
        // @ts-expect-error private option
        legacyMode: true,
      },
      columns: [
        { dataField: 'field1', headerCellTemplate: (_, { column }) => $('<div>').text(column.caption as string) },
        { dataField: 'field2', groupIndex: 0 },
        { dataField: 'field3', fixed: true },
      ],
      groupPanel: {
        visible: true,
      },
      grouping: {
        autoExpandAll: true,
      },
    }));

    await makeColumnHeadersViewTemplatesAsync(page, DEFAULT_SELECTOR);

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'T1155453-expanded-groups-with-fixed-content.png', { element: dataGrid.element });

    // act
    await dataGrid.apiCollapseAllGroups();
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'T1155453-collapsed-groups-with-fixed-content.png', { element: dataGrid.element });
  });

  test.describe(() => {
    test.use({ browserSize: [800, 800] });

    test('Empty header message should appear when all columns grouped and selection is enabled', async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [
          {
            field1: '1', field2: 'test1', field3: 'test11',
          },
          {
            field1: '2', field2: 'test1', field3: 'test12',
          },
          {
            field1: '3', field2: 'test2', field3: 'test13',
          },
        ],
        columns: [
          { dataField: 'field1', groupIndex: 0 },
          { dataField: 'field2', groupIndex: 1 },
          { dataField: 'field3', groupIndex: 2 },
        ],
        groupPanel: {
          visible: true,
        },
        selection: {
          mode: 'multiple',
        },
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await testScreenshot(page, 'empty-header-message-with-selection-enabled.png', { element: dataGrid.element });
    });
  });

  test('Group panel message should be vertically aligned (T1186613)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      groupPanel: {
        visible: true,
      },
      showBorders: true,
      searchPanel: {
        visible: true,
      },
      editing: {
        allowAdding: true,
      },
      toolbar: {
        items: [
          'groupPanel',
          {
            showText: 'always',
            location: 'before',
            name: 'addRowButton',
            options: {
              icon: null,
              text: 'add a new row',
            },
          }, {
            location: 'before',
            widget: 'dxTextBox',
            options: {
              width: 140,
              text: 'TestTest',
            },
          },
        ],
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'group-panel-message-align.png', { element: dataGrid.getToolbar().element });
  });

  test('The collapse icon should update if repaintChangesOnly option is enabled (T1201981)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        {
          field1: '1', field2: 'test1', field3: 'test11',
        },
        {
          field1: '2', field2: 'test1', field3: 'test12',
        },
        {
          field1: '3', field2: 'test2', field3: 'test13',
        },
      ],
      repaintChangesOnly: true,
      columns: [
        {
          dataField: 'field1',
          groupIndex: 0,
        },
        'field2',
        'field3',
      ],
      groupPanel: {
        visible: true,
      },
      paging: {
        pageSize: 3,
      },
      showBorders: true,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getPager().getNavPage('2').click();

    await testScreenshot(page, 'continued_group-collapse_icon-T1201981.png', { element: dataGrid.element });
  });

  test('DataGrid loses grouping after the expandAll method if a grouped column has calculateDisplayValue (T1232129)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: customersT1232129,
      keyExpr: 'id',
      showBorders: true,
      grouping: {
        autoExpandAll: false,
      },
      columns: [
        'number',
        'description',
        {
          dataField: 'groupId',
          calculateDisplayValue: 'articleGroup',
          groupIndex: 0,
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiExpandAll();
    await expect.poll(() => dataGrid.apiColumnOption('groupId', 'groupIndex')).toBe(0);
  });

  test('DataGrid should not lose grouping after the expandAll method if a grouped column has string calculateGroupValue (T1321187)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        id: 0, a: 0, aLabel: 'A_0', b: 'B_0', c: 'C_0',
      }],
      keyExpr: 'id',
      grouping: { autoExpandAll: false },
      columns: [{
        dataField: 'a',
        groupIndex: 0,
        calculateGroupValue: 'aLabel',
      },
      'b', 'c'],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiExpandAll();
    await expect.poll(() => dataGrid.apiColumnOption('a', 'groupIndex')).toBe(0);
  });

  test('DataGrid should not change group column after the expandAll method, string calculateGroupValue corresponds another column (T1308536)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        id: 0, a: 0, aLabel: 'A_0', b: 'B_0', c: 'C_0',
      }],
      keyExpr: 'id',
      grouping: { autoExpandAll: false },
      columns: [{
        dataField: 'a',
        groupIndex: 0,
        calculateGroupValue: 'aLabel',
      },
      { dataField: 'aLabel', visible: false },

      'b', 'c'],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const firstGroupCellText = await dataGrid.getGroupRow(0).getCell(1).element.textContent() ?? '';

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiExpandAll();
    await expect.poll(() => dataGrid.apiColumnOption('a', 'groupIndex')).toBe(0);
    await expect.poll(() => dataGrid.apiColumnOption('aLabel', 'groupIndex')).toBe(undefined);
    await expect(dataGrid.getGroupRow(0).getCell(1).element).toHaveText(firstGroupCellText);
  });

  test('DataGrid should not change group column after the expandAll method, string calculateGroupValue corresponds another unbound column (T1308536)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (): Properties => ({
      dataSource: [{
        id: 0, a: 0, aLabel: 'A_0', b: 'B_0', c: 'C_0',
      }],
      keyExpr: 'id',
      grouping: { autoExpandAll: false },
      columns: [{
        dataField: 'a',
        groupIndex: 0,
        calculateGroupValue: 'aLabel',
      },
      {
        name: 'aLabel',
        caption: 'aLabel',
        calculateCellValue(data) { return data.aLabel; },
      },
      'b', 'c'],
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const firstGroupCellText = await dataGrid.getGroupRow(0).getCell(1).element.textContent() ?? '';

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiExpandAll();
    await expect.poll(() => dataGrid.apiColumnOption('a', 'groupIndex')).toBe(0);
    await expect.poll(() => dataGrid.apiColumnOption('aLabel', 'groupIndex')).toBe(undefined);
    await expect(dataGrid.getGroupRow(0).getCell(1).element).toHaveText(firstGroupCellText);
  });

  test('Grouping and filtering should be applied correctly when they change at runtime (T1237863)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        {
          ID: 1,
          FirstName: 'Bob',
          room: 1,
        },
        {
          ID: 2,
          FirstName: 'Alex',
          room: 2,
        },
        {
          ID: 3,
          FirstName: 'John',
          room: 1,
        },
      ],
      keyExpr: 'ID',
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.option({
      'columns[2].groupIndex': 0,
      filterValue: ['room', '=', '1'],
    });

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'T1237863_datagrid-grouping_and_filtering.png', { element: dataGrid.element });
  });

  // T1112573
  test('Content should be rendered correctly after setting the grouping.autoExpandAll property to true when dataRowTemplate is given', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (): Properties => ({
      dataSource: [
        {
          field1: '1', field2: 'test1',
        },
        {
          field1: '2', field2: 'test1',
        },
        {
          field1: '3', field2: 'test2',
        },
      ],
      width: 700,
      columns: [
        'field1',
        { dataField: 'field2', groupIndex: 0 },
      ],
      dataRowTemplate(container, { data }) {
        return $(container).append($(`<tr><td>${data.field1}</td></tr>`));
      },
      groupPanel: {
        visible: true,
      },
      grouping: {
        autoExpandAll: false,
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiExpandAllGroups();
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'expanded-groups-content.png', { element: dataGrid.element });
  });
});
