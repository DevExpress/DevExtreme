import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { getData } from '../../helpers/generateDataSourceData';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`FixedColumns - appearance`
  .page(url(__dirname, '../../../container.html'));

// visual: generic.light
// visual: generic.light.compact
// visual: material.blue
// visual: material.blue.compact
// visual: fluent.blue
// visual: fluent.blue.compact
[false, true].forEach(
  (showRowLines) => {
    // T1268664
    const showRowLinesState = `showRowLines=${showRowLines ? 'true' : 'false'}`;
    test(`Row height for selected, focus and edit state should not differ from the default one if ${showRowLinesState}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`datagrid_default_state_with_${showRowLinesState}_(generic.light).png`, dataGrid.element);

      await t
        .click(dataGrid.getDataRow(2).getCommandCell(41).getButton(0))
        .click(dataGrid.getDataRow(3).getCommandCell(0).element)
        .click(dataGrid.getDataRow(4).getDataCell(4).element);

      await takeScreenshot(`datagrid_selected_focused_edit_state_with_${showRowLinesState}_(generic.light).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(13, 40),
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
      showRowLines,
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
    }));
  },
);
