/* eslint-disable no-param-reassign -- customizeColumns changes the columns it gets */
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { getData } from '../../helpers/generateDataSourceData';

test.describe('FixedColumns - appearance', () => {
  [false, true].forEach(
    (showRowLines) => {
      // T1268664
      const showRowLinesState = `showRowLines=${showRowLines ? 'true' : 'false'}`;

      test(`Row height for selected, focus and edit state should not differ from the default one if ${showRowLinesState}`, async ({ page }) => {
        await createWidget(page, 'dxDataGrid', ({ data, rowLines }) => ({
          dataSource: data,
          keyExpr: 'field_0',
          columnFixing: {
            enabled: true,
          },
          groupPanel: {
            visible: true,
          },
          editing: {
            allowUpdating: true,
            mode: 'row',
          },
          showColumnHeaders: true,
          columnAutoWidth: true,
          allowColumnReordering: true,
          allowColumnResizing: true,
          focusedRowEnabled: true,
          showRowLines: rowLines,
          selection: {
            mode: 'multiple',
          },
          customizeColumns(columns) {
            columns[5].fixed = true;
            columns[6].fixed = true;

            columns[11].fixed = true;
            columns[11].fixedPosition = 'right';
            columns[12].fixed = true;
            columns[12].fixedPosition = 'right';
          },
        }), DEFAULT_SELECTOR, { arg: { data: getData(13, 40), rowLines: showRowLines } });

        const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

        await expect.poll(() => dataGrid.isReady()).toBe(true);

        await testScreenshot(page, `datagrid_default_state_with_${showRowLinesState}.png`, { element: dataGrid.element });

        await dataGrid.getDataRow(2).getCommandCell(41).getButton(0).click();
        await expect(dataGrid.getDataCell(2, 1).getEditor().element).toBeFocused();
        await dataGrid.getDataRow(3).getCommandCell(0).element.click();
        await dataGrid.getDataRow(3).expectSelected();
        await dataGrid.getDataRow(4).getDataCell(4).element.click();
        await dataGrid.getDataRow(4).expectFocusedRow();

        await testScreenshot(page, `datagrid_selected_focused_edit_state_with_${showRowLinesState}.png`, { element: dataGrid.element });
      });
    },
  );
});
