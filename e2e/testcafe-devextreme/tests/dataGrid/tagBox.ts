/* eslint-disable @typescript-eslint/no-floating-promises */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

fixture.disablePageReloads`Tagbox Columns`.page(
  url(__dirname, '../container.html'),
);
// T1228720
test('Datagrid tagbox column should not look broken', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(dataGrid.isReady)
    .ok();

  await t
    .click(dataGrid.getDataCell(0, 1).element)
    .expect(await takeScreenshot('T1228720-grid-tagbox-on-edit.png', dataGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    showBorders: true,
    allowColumnResizing: true,
    dataSource: [
      { id: 1, items: [1, 2, 3, 4, 5] },
    ],
    columns: ['id', {
      dataField: 'items',
      lookup: {
        dataSource: Array.from({ length: 10 }, (_, index) => ({
          id: index + 1,
          text: `item ${index + 1}`,
        })),
        valueExpr: 'id',
        displayExpr: 'text',
      },
      editCellTemplate(container, cellInfo) {
        ($('<div/>') as any).dxTagBox({
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
        }).appendTo(container);
      },
      cellTemplate(container, options) {
        const noBreakSpace = '\u00A0';

        const vals = options.value.map(
          (itemId) => options.column.lookup!.calculateCellValue!(itemId),
        );
        const text = vals.join(', ');
        // @ts-expect-error text
        container.text(text || noBreakSpace).attr('title', text);
      },
    }],
    editing: { mode: 'batch', allowUpdating: true },
  });
});
