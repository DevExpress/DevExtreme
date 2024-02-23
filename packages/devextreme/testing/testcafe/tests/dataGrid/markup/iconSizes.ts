import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { changeTheme } from '../../../helpers/changeTheme';
import { createWidget } from '../../../helpers/createWidget';
import DataGrid from '../../../model/dataGrid';

fixture.disablePageReloads`Icon Sizes`
  .page(url(__dirname, '../../container.html'));

const GRID_CONTAINER = '#container';

test('Correct icon sizes in the Fluent compact theme (T1207612)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(GRID_CONTAINER);

  await t
    .expect(await takeScreenshot('icon-sizes-fluent-compact.png', dataGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await changeTheme('fluent.blue.light.compact');
  await createWidget('dxDataGrid', {
    dataSource: [...new Array(3)].map((_, index) => ({ id: index, text: `item ${index}`, group: `group ${index % 2}` })),
    keyExpr: 'id',
    width: 550,
    columns: [
      { dataField: 'id' },
      { dataField: 'text', sortOrder: 'asc' },
      { dataField: 'group', groupIndex: 0 },
      { dataField: 'hidden', hidingPriority: 0 },
    ],
    editing: {
      allowAdding: true,
      allowUpdating: true,
      allowDeleting: true,
    },
    showBorders: true,
    filterValue: ['Id', '>=', 0],
    filterPanel: { visible: true },
    headerFilter: { visible: true },
    filterRow: { visible: true },
    groupPanel: { visible: true },
    searchPanel: { visible: true },
    selection: { mode: 'multiple' },
    rowDragging: { allowReordering: true },
    columnChooser: { enabled: true },
    columnHidingEnabled: true,
    masterDetail: { enabled: true },
    export: { enabled: true },
    pager: {
      visible: true,
      allowedPageSizes: [5, 10, 'all'],
      showPageSizeSelector: true,
      showInfo: true,
      showNavigationButtons: true,
    },
  });
}).after(async () => {
  await changeTheme('generic.light');
});
