/* eslint-disable no-param-reassign -- customizeColumns changes the columns it gets */
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { hasHorizontalScroll } from '../../../../helpers/domUtils';
import { dragToOffset } from '../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import GridFocusableElement from '../../../../models/gridCore/focusable';
import { getData } from '../../helpers/generateDataSourceData';

test.describe('FixedColumns - Focus Overlay', () => {
  test('Focus overlay should be displayed correctly if sticky columns are turned on', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      dataSource: data,
      columnFixing: {
        enabled: true,
      },
      groupPanel: {
        visible: true,
      },
      width: 800,
      showColumnHeaders: true,
      columnAutoWidth: true,
      allowColumnReordering: true,
      allowColumnResizing: true,
      summary: {
        totalItems: [{
          column: 'field_1',
          summaryType: 'count',
        }, {
          column: 'field_6',
          summaryType: 'count',
        }],
        groupItems: [{
          column: 'field_0',
          summaryType: 'count',
          showInGroupFooter: false,
          alignByColumn: true,
        },
        {
          column: 'field_11',
          summaryType: 'count',
          showInGroupFooter: false,
          alignByColumn: true,
        }, {
          column: 'field_6',
          summaryType: 'count',
          showInGroupFooter: true,
        }],
      },
      customizeColumns(columns) {
        columns[5].fixed = true;
        columns[6].fixed = true;

        columns[11].fixed = true;
        columns[11].fixedPosition = 'right';
        columns[12].fixed = true;
        columns[12].fixedPosition = 'right';

        columns.splice(15, 5, {
          caption: 'Band column 1',
          columns: [{
            caption: 'Nested column 1',
            columns: ['field_15', 'field_16'],
          },
          'field_17',
          {
            caption: 'Nested column 2',
            columns: ['field_18', 'field_19'],
          }],
        });

        columns.splice(25, 4, {
          caption: 'Band column 2',
          columns: [
            'field_29',
            {
              caption: 'Nested column 3',
              columns: ['field_30', 'field_31'],
            },
            'field_32',
          ],
        });

        columns[0].hidingPriority = 0;
        columns[columns.length - 1].hidingPriority = 1;
        columns[columns.length - 2].hidingPriority = 2;
        columns[columns.length - 3].hidingPriority = 3;

        columns[1].groupIndex = 0;
        columns[2].groupIndex = 1;
      },
    }), DEFAULT_SELECTOR, { arg: getData(20, 40) });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const groupRow = dataGrid.getGroupRow(0);
    const adaptiveCommandCell = dataGrid.getDataRow(2).getCommandCell(40);
    const groupFooterRow = new GridFocusableElement(dataGrid.getGroupFooterRow(0));
    const nextGroupFooterRow = new GridFocusableElement(dataGrid.getGroupFooterRow(1));

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await groupRow.getCell(1).element.click();
    await groupRow.expectFocusHidden();
    await page.keyboard.press('Tab');
    await dataGrid.getGroupRow(1).expectFocusVisible();

    await testScreenshot(page, 'datagrid_group_row_focused.png', { element: dataGrid.element });

    await adaptiveCommandCell.getAdaptiveButton().click();
    await adaptiveCommandCell.expectFocusHidden();
    await page.keyboard.press('Tab');
    await expect(dataGrid.getAdaptiveRow(0).getAdaptiveCell(0).element).toBeFocused();

    await testScreenshot(page, 'datagrid_adaptive_item_focused.png', { element: dataGrid.element });

    await groupFooterRow.element.click({ position: { x: 5, y: 5 } });
    await groupFooterRow.expectFocusHidden();
    await page.keyboard.press('Tab');
    await nextGroupFooterRow.expectFocusVisible();

    await testScreenshot(page, 'datagrid_group_footer_row_focused.png', { element: dataGrid.element });
  });

  test('Native scrollbar should not be shown when the focus overlay is visible (T1310336)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      dataSource: data,
      keyExpr: 'field_0',
      height: 300,
      focusedRowEnabled: true,
      customizeColumns(columns) {
        columns[0].fixed = true;
        columns[1].groupIndex = 0;
      },
      scrolling: {
        useNative: true,
      },
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
    }), DEFAULT_SELECTOR, { arg: getData(20, 5) });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const scrollableContainer = dataGrid.getScrollContainer();
    const firstGroupRow = dataGrid.getGroupRow(0);
    const firstDataRow = dataGrid.getDataRow(1);
    const secondDataCell = firstDataRow.getDataCell(2);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dragToOffset(page, secondDataCell.element, -2, 0, { offsetX: 1 });

    await firstDataRow.expectFocusedRow();
    await expect(dataGrid.getFocusOverlay()).not.toBeVisible();
    await expect.poll(() => hasHorizontalScroll(scrollableContainer)).toBe(false);

    await page.keyboard.press('ArrowUp');

    await firstGroupRow.expectFocusedRow();
    await expect(dataGrid.getFocusOverlay()).toBeVisible();
    await expect.poll(() => hasHorizontalScroll(scrollableContainer)).toBe(false);
  });
});
