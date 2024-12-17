import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import FilterTextBox from 'devextreme-testcafe-models/dataGrid/editors/filterTextBox';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { getData } from '../helpers/generateDataSourceData';
import { Themes } from '../../../helpers/themes';
import { changeTheme } from '../../../helpers/changeTheme';

fixture.disablePageReloads`DataGrid - contrast`
  .page(url(__dirname, '../../container.html'));

// T1257970
[
  Themes.genericLight,
  Themes.fluentBlue,
  Themes.materialBlue,
].forEach((theme) => {
  test('DataGrid - Contrast between icons in the Filter Row menu and their background doesn\'t comply with WCAG accessibility standards', async (t) => {
    const dataGrid = new DataGrid('#container');
    const filterEditor = dataGrid.getFilterEditor(0, FilterTextBox);
    const searchButton = filterEditor.menuButton;
    const filterMenu = filterEditor.menu;
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(dataGrid.isReady())
      .ok();
    await t
      .click(searchButton)
      .expect(filterMenu.element.exists)
      .ok();
    await t
      .expect(await takeScreenshot(`T1257970-datagrid-menu-icon-contrast-${theme}.png`, dataGrid.element))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(
    async () => {
      await changeTheme(theme);
      await createWidget('dxDataGrid', {
        dataSource: getData(5, 5),
        filterRow: {
          visible: true,
        },
      });
    },
  ).after(
    async () => {
      if (theme === Themes.genericLight) {
        return;
      }
      await changeTheme(Themes.genericLight);
    },
  );
});
