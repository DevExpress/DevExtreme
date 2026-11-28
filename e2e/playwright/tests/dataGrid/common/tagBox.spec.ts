import { test } from '../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../helpers/const';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import DataGrid from '../../../models/dataGrid';

test.describe('Tagbox Columns', () => {
  // T1228720
  test('Datagrid tagbox column should not look broken', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      showBorders: true,
      allowColumnResizing: true,
      dataSource: [{ id: 1, items: [1, 2, 3, 4, 5] }],
      columns: [
        'id',
        {
          dataField: 'items',
          editCellTemplate(container, cellInfo) {
            ($('<div/>') as any)
              .dxTagBox({
                dataSource: Array.from({ length: 10 }, (_, index) => ({
                  id: index + 1,
                  text: `item ${index + 1}`,
                })),
                value: cellInfo.value,
                valueExpr: 'id',
                displayExpr: 'text',
                onValueChanged(e) {
                  cellInfo.setValue(e.value);
                },
                onSelectionChanged() {
                  cellInfo.component.updateDimensions();
                },
                searchEnabled: true,
              })
              .appendTo(container);
          },
        },
      ],
      editing: { mode: 'batch', allowUpdating: true },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getDataCell(0, 1).element.click();
    await testScreenshot(page, 'T1228720-grid-tagbox-on-edit.png', { element: dataGrid.element });
  });
});
