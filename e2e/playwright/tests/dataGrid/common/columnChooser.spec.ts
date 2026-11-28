import type { ColumnChooserMode, Properties } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../helpers/const';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import DataGrid from '../../../models/dataGrid';
import { getData } from '../helpers/generateDataSourceData';

test.describe('Column chooser', () => {
  (['dragAndDrop', 'select'] as ColumnChooserMode[]).forEach((mode) => {
    test(`Column chooser screenshot in mode=${mode}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
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
          mode,
        },
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await dataGrid.apiShowColumnChooser();

      await dataGrid.getColumnChooser().expectOpened();

      await testScreenshot(page, `column-chooser-${mode}-mode.png`, { element: dataGrid.element });
    });
  });

  test('Empty column chooser', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      columnChooser: {
        enabled: true,
      },
      columns: [
        'field_0',
        'field_1',
        'field_2',
        'field_3',
        'field_4',
      ],
    }, DEFAULT_SELECTOR);

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const columnChooser = dataGrid.getColumnChooser();
    const columnChooserButton = dataGrid.getColumnChooserButton();

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await columnChooserButton.click();

    // assert
    await columnChooser.expectOpened();

    await testScreenshot(page, 'empty-column-chooser.png');
  });

  test('Column chooser checkboxes should be aligned correctly with plain structure', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
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
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getHeaderPanel().getColumnChooserButton().click();

    const columnChooser = dataGrid.getColumnChooser();

    await testScreenshot(page, 'column-chooser-checkbox-alignment-plain-structure.png', { element: columnChooser.content });
  });

  test('Column chooser checkboxes should be aligned correctly with tree structure', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
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
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getHeaderPanel().getColumnChooserButton().click();

    const columnChooser = dataGrid.getColumnChooser();

    await testScreenshot(page, 'column-chooser-checkbox-alignment-tree-structure.png', { element: columnChooser.content });
  });

  test('Column chooser should support string height and width', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
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
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getHeaderPanel().getColumnChooserButton().click();

    const columnChooserContent = dataGrid.getColumnChooser().content;

    await expect(columnChooserContent).toHaveCSS('height', '400px');
    await expect(columnChooserContent).toHaveCSS('width', '330px');
  });

  // T1219785
  test('Check the behavior of pressing the Esc button when dragging a column from the column chooser', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
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
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getColumnChooserButton().click();

    await testScreenshot(page, 'T1219785-column-chooser-1.png', { element: dataGrid.element });

    await dataGrid.getColumnChooser().focusList();
    await dataGrid.moveColumnChooserColumn(0, -25, -25, true);
    await dataGrid.moveColumnChooserColumn(0, -50, -50);

    await testScreenshot(page, 'T1219785-column-chooser-2.png', { element: dataGrid.element });

    // act
    await page.keyboard.press('Escape');
    await dataGrid.moveColumnChooserColumn(0, -75, -75);

    await testScreenshot(page, 'T1219785-column-chooser-3.png', { element: dataGrid.element });
  });

  test('Should take into account column options change during general option change (T1267471)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (): Properties => ({
      dataSource: [
        { id: 0, A: 'A', B: 'B' },
      ],
      keyExpr: 'id',
      columns: ['A', 'B'],
      columnChooser: {
        enabled: true,
        mode: 'select',
      },
      onOptionChanged: ({ component, fullName }) => {
        if (!/columns\[\d+\]\.visible/.test(fullName)) {
          return;
        }

        const visibleColumns = component.getVisibleColumns();
        const [{ dataField: lastColumnDataField }] = visibleColumns;

        if (!lastColumnDataField) {
          return;
        }

        component.columnOption(lastColumnDataField, 'allowHiding', false);
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const columnChooserBtn = dataGrid.getColumnChooserButton();

    await columnChooserBtn.click();

    const columnChooser = dataGrid.getColumnChooser();
    const lastItemCheckbox = columnChooser.getCheckbox(1);

    await columnChooser.expectCheckboxDisabled(0, false);
    await columnChooser.expectCheckboxDisabled(1, false);

    await lastItemCheckbox.click();

    await columnChooser.expectCheckboxDisabled(0);
    await columnChooser.expectCheckboxDisabled(1, false);
  });

  test('ColumnChooser should receive and render custom texts', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).DevExpress.localization.loadMessages({
        en: {
          'dxDataGrid-columnChooserTitle': 'customTitle',
          'dxDataGrid-columnChooserEmptyText': 'customEmptyText',
        },
      });
    });

    await createWidget(page, 'dxDataGrid', {
      columnChooser: {
        height: '340px',
        enabled: true,
        mode: 'dragAndDrop',
        position: {
          my: 'right top',
          at: 'right bottom',
          of: '.dx-datagrid-column-chooser-button',
        },
      },
      dataSource: [],
      columns: [],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const columnChooserBtn = dataGrid.getColumnChooserButton();
    await columnChooserBtn.click();
    const columnChooser = dataGrid.getColumnChooser();
    const title = columnChooser.getTitle();
    const emptyMessage = columnChooser.getEmptyMessage();

    await expect(title).toHaveText('customTitle', { useInnerText: true });
    await expect(emptyMessage).toHaveText('customEmptyText', { useInnerText: true });
  });
});
