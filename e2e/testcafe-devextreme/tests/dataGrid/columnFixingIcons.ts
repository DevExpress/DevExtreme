/* eslint-disable @typescript-eslint/no-floating-promises */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { changeTheme } from '../../helpers/changeTheme';
import { Themes } from '../../helpers/themes';
import { getData } from './helpers/generateDataSourceData';

fixture.disablePageReloads`Column Fixing`.page(
  url(__dirname, '../container.html'),
);
[Themes.genericLight, Themes.materialBlue, Themes.fluentBlue].forEach(
  (theme) => {
    test('Sticky columns: add icons for context menu', async (t) => {
      const dataGrid = new DataGrid('#container');
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
      await t
        .rightClick(dataGrid.getHeaders().getHeaderRow(0).element)
        .click(dataGrid.getContextMenu().getItemByOrder(4))
        .expect(
          await takeScreenshot(
            `sticky_columns_menu_icons_(${theme}).png`,
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
          dataSource: getData(1, 5),
          width: '100%',
          columnFixing: {
            enabled: true,
            texts: {
              // @ts-expect-error required
              stickyPosition: 'Stick',
            },
          },
          customizeColumns: (columns) => {
            columns[1].fixed = true;
            columns[1].fixedPosition = 'sticky';
          },
        });
      })
      .after(async () => {
        await changeTheme(Themes.genericLight);
      });
  },
);
