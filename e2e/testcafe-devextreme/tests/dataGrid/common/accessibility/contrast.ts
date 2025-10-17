import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import FilterTextBox from 'devextreme-testcafe-models/dataGrid/editors/filterTextBox';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { getData } from '../../helpers/generateDataSourceData';

fixture.disablePageReloads`DataGrid - contrast`
  .page(url(__dirname, '../../../container.html'));

// T1257970
// visual: generic.light
// visual: fluent.blue.light
// visual: material.blue.light
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
    .expect(await takeScreenshot(`T1257970-datagrid-menu-icon-contrast-generic.light.png`, dataGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(
  async () => {
    await createWidget('dxDataGrid', {
      dataSource: getData(5, 5),
      filterRow: {
        visible: true,
      },
    });
  },
);

// T1286345
// visual: generic.light
// visual: fluent.blue.light
// visual: material.blue.light
test('DataGrid - Filter icon should remain visible when it\'s focused', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(dataGrid.isReady())
    .ok();

  const searchIconContainer = dataGrid
    .getHeaders()
    .getFilterRow()
    .getFilterCell(1)
    .getSearchIcon()
    .element;

  await t
    .click(dataGrid.getFilterCell(0))
    .pressKey('tab')
    .expect(searchIconContainer.focused)
    .ok();

  await t
    .expect(await takeScreenshot(`T1286345-datagrid-menu-icon-when-focused-generic.light.png`, dataGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(
  async () => {
    await createWidget('dxDataGrid', {
      dataSource: getData(2, 2),
      filterRow: {
        visible: true,
      },
    });
  },
);
