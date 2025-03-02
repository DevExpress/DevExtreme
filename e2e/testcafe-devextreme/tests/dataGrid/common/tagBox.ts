/* eslint-disable @typescript-eslint/no-floating-promises */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { changeTheme } from '../../helpers/changeTheme';
import { Themes } from '../../helpers/themes';

fixture.disablePageReloads`Tagbox Columns`.page(
  url(__dirname, '../container.html'),
);
// T1228720
[Themes.genericLight, Themes.materialBlue, Themes.fluentBlue].forEach(
  (theme) => {
    test('Datagrid tagbox column should not look broken', async (t) => {
      const dataGrid = new DataGrid('#container');
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
      await t
        .click(dataGrid.getDataCell(0, 1).element)
        .expect(
          await takeScreenshot(
            `T1228720-grid-tagbox-on-edit_(${theme}).png`,
            dataGrid.element,
          ),
        )
        .ok()
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    })
      .before(async () => {
        await changeTheme(theme);
        await createWidget('dxDataGrid', {
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
        });
      })
      .after(async () => {
        await changeTheme(Themes.genericLight);
      });
  },
);
