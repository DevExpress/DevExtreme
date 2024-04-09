import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import DataGrid from 'devextreme-testcafe-models/dataGrid';

fixture.disablePageReloads`Focus`
  .page(url(__dirname, '../../container.html'));

const GRID_SELECTOR = '#container';
const FOCUSED_CLASS = 'dx-focused';

test('Should remove dx-focused class on blur event from the cell', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  const firstCell = dataGrid.getDataCell(0, 1);
  const secondCell = dataGrid.getDataCell(1, 1);

  await t
    .click(firstCell.element)
    .click(secondCell.element);

  await t.expect(firstCell.element().hasClass(FOCUSED_CLASS)).notOk();
  await t.expect(secondCell.element().hasClass(FOCUSED_CLASS)).ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { A: 0, B: 1, C: 2 },
    { A: 3, B: 4, C: 5 },
    { A: 6, B: 7, C: 8 },
  ],
  editing: {
    mode: 'batch',
    allowUpdating: true,
    startEditAction: 'dblClick',
  },
  onCellClick: (event) => event.component.focus(event.cellElement),
}));
