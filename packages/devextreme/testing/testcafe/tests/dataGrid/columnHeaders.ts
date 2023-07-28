import { a11yCheck } from '../../helpers/accessibilityUtils';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';

fixture.disablePageReloads`Column Headers`
  .page(url(__dirname, '../container.html'));

test('Checking column headers via aXe', async (t) => {
  await a11yCheck(t);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{
    id: 1,
    field1: 'field1',
    field2: 'field2',
  }],
  keyExpr: 'id',
  columns: ['field1', 'field2'],
  showBorders: true,
}));
