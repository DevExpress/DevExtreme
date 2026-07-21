import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`DataGrid - columnOption width change should be applied immediately (T1329677)`
  .page(url(__dirname, '../../../container.html'));

const GRID_SELECTOR = '#container';
const ASSIGNED_COLUMN_INDEX = 1;
const ASSIGNED_COLUMN_WIDTH = 700;
const COLUMN_WIDTH_TOLERANCE = 1;

// T1329677
test('DataGrid - column width changed via columnOption should be applied immediately, without a repaint', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  // Called as a plain instance method after the grid's initial render/resize has already
  // settled (isReady() resolved) - just like an external app calling columnOption from a click
  // handler - rather than from inside onContentReady, which runs while the grid's own
  // render/resize pipeline is still on the call stack and would not expose the bug.
  await dataGrid.apiColumnOption('Task_Assigned_Employee_ID', 'width', ASSIGNED_COLUMN_WIDTH);

  const assignedColumnWidth = await dataGrid.getHeaders().getHeaderRow(0)
    .getHeaderCell(ASSIGNED_COLUMN_INDEX).element.clientWidth;

  await t
    .expect(assignedColumnWidth)
    .within(
      ASSIGNED_COLUMN_WIDTH - COLUMN_WIDTH_TOLERANCE,
      ASSIGNED_COLUMN_WIDTH + COLUMN_WIDTH_TOLERANCE,
      'columnOption width should be applied immediately, without an explicit repaint',
    );
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{ Task_Subject: 'Test' }],
    columnAutoWidth: true,
    columns: [
      { dataField: 'Task_Subject' },
      { dataField: 'Task_Assigned_Employee_ID', caption: 'Assigned' },
    ],
  });
});
