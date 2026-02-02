import Button from 'devextreme-testcafe-models/button';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Band columns.Functional`
  .page(url(__dirname, '../../../container.html'));

const GRID_CONTAINER = '#container';

test('Changing dataField for a banded column with the columnOption method does not work as expected (T1210340)', async (t) => {
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const changeFieldButton = new Button('#otherContainer');

  await t
    .expect(dataGrid.getDataCell(0, 4).element.innerText)
    .eql('2353025')
    .click(changeFieldButton.element)
    .expect(dataGrid.getDataCell(0, 4).element.innerText)
    .eql('0.672');
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      id: 1,
      Country: 'Brazil',
      Area: 8515767,
      Population_Urban: 0.85,
      Population_Rural: 0.15,
      Population_Total: 205809000,
      GDP_Agriculture: 0.054,
      GDP_Industry: 0.274,
      GDP_Services: 0.672,
      GDP_Total: 2353025,
    }],
    columns: [
      'Country',
      'Area', {
        caption: 'Population',
        columns: [
          'Population_Total',
          'Population_Urban',
        ],
      }, {
        caption: 'Nominal GDP',
        columns: [{
          caption: 'Total, mln $',
          dataField: 'GDP_Total',
          name: 'GDP_Total',
        }, {
          caption: 'By Sector',
          columns: [{
            caption: 'Agriculture',
            dataField: 'GDP_Agriculture',
          }, {
            caption: 'Industry',
            dataField: 'GDP_Industry',
            format: {
              type: 'percent',
            },
          }, {
            caption: 'Services',
            dataField: 'GDP_Services',
          }],
        }],
      }],
    keyExpr: 'id',
    showBorders: true,
  });

  await createWidget('dxButton', {
    text: 'Change fields',
    onClick() {
      const grid = ($('#container') as any).dxDataGrid('instance');
      grid.columnOption('GDP_Total', 'dataField', 'GDP_Services');
    },
  }, '#otherContainer');
});
