import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { getData } from '../helpers/generateDataSourceData';

fixture`Scrolling with axe`
  .page(url(__dirname, '../../container.html'));

test('Infinite scrolling', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t
    .expect(dataGrid.isReady())
    .ok();

  await a11yCheck(t);
}).before(() => createWidget('dxDataGrid', {
  dataSource: getData(1000, 2),
  height: 400,
  showBorders: true,
  scrolling: {
    mode: 'infinite',
  },
}));
