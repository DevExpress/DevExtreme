import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/themeUtils';
import { Themes } from '../../../../helpers/themes';

fixture.disablePageReloads`Icon Sizes`
  .page(url(__dirname, '../../../container.html'));

test('Correct icon sizes in the Fluent compact theme (T1207612)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'icon-sizes.png', { theme: Themes.fluentBlueCompact });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
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
});
