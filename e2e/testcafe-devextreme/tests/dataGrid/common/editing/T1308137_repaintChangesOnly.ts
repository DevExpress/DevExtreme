import { Selector } from 'testcafe';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Editing - repaintChangesOnly issue T1308137`
  .page(url(__dirname, '../../../container.html'));

// T1308137: Cell values should be restored after canceling changes with validation error
// when repaintChangesOnly is enabled
test('Second cell value should be restored after validation error and cancel with repaintChangesOnly', async (t) => {
  // First, make sure the grid is rendered properly
  await t.wait(500);

  // Test the FIRST cell first - this should work correctly as a baseline
  await t
    // Click on first cell (name column) to start editing
    .click(Selector('#container .dx-datagrid-rowsview tbody tr:nth-child(1) td:nth-child(2)'))
    .wait(100)
    // Clear the value in the input to trigger validation error
    .selectText(Selector('#container .dx-datagrid-rowsview tbody tr:nth-child(1) td:nth-child(2) input'))
    .pressKey('delete')
    .wait(100)
    // Try to move to next row - this should trigger validation error
    .pressKey('down')
    .wait(200)
    // Cancel editing with Escape
    .pressKey('esc')
    .wait(200);

  // Check that first cell value is restored (this should work)
  const firstCellSelector = Selector('#container .dx-datagrid-rowsview tbody tr:nth-child(1) td:nth-child(2)');
  await t.expect(firstCellSelector.innerText).eql('Job 1', 'First cell should be restored');

  // Now test the SECOND cell - this is where the bug occurs with repaintChangesOnly
  await t
    // Click on second cell (name column) to start editing
    .click(Selector('#container .dx-datagrid-rowsview tbody tr:nth-child(2) td:nth-child(2)'))
    .wait(100)
    // Clear the value in the input to trigger validation error
    .selectText(Selector('#container .dx-datagrid-rowsview tbody tr:nth-child(2) td:nth-child(2) input'))
    .pressKey('delete')
    .wait(100)
    // Try to move to next row - this should trigger validation error
    .pressKey('down')
    .wait(200)
    // Cancel editing with Escape - THIS IS WHERE THE BUG OCCURS
    .pressKey('esc')
    .wait(200);

  // Check that second cell value is restored - WITHOUT THE FIX, this will show empty
  const secondCellSelector = Selector('#container .dx-datagrid-rowsview tbody tr:nth-child(2) td:nth-child(2)');
  await t.expect(secondCellSelector.innerText).eql('Job 2', 'Second cell should be restored (this was the bug without the fix)');
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Job 1' },
    { id: 2, name: 'Job 2' },
  ],
  keyExpr: 'id',
  repaintChangesOnly: true,
  editing: {
    mode: 'cell',
    allowUpdating: true,
  },
  columns: [
    { dataField: 'id', allowEditing: false },
    {
      dataField: 'name',
      validationRules: [{
        type: 'required',
        message: 'Required field',
      }],
    },
  ],
}));
