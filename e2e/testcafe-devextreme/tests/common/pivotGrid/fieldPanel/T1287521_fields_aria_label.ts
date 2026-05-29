import PivotGrid from 'devextreme-testcafe-models/pivotGrid';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`pivotGrid_fieldPanel_aria_label`
  .page(url(__dirname, '../../../container.html'));

const PIVOT_GRID_SELECTOR = '#container';

test('Header fields should have correct aria-label', async (t) => {
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
  const rowHeader = pivotGrid.getRowHeaderArea();
  const columnHeader = pivotGrid.getColumnHeaderArea();
  const filterHeader = pivotGrid.getFilterHeaderArea();

  await t
    .expect(rowHeader.getHeaderFilterIcon(0).ariaLabel)
    .eql('Show filter options for column \'Row1\'')
    .expect(rowHeader.getHeaderFilterIcon(1).ariaLabel)
    .eql('Show filter options for column \'Row2\'')
    .expect(columnHeader.getHeaderFilterIcon(0).ariaLabel)
    .eql('Show filter options for column \'Column1\'')
    .expect(columnHeader.getHeaderFilterIcon(1).ariaLabel)
    .eql('Show filter options for column \'Column2\'')
    .expect(filterHeader.getHeaderFilterIcon(0).ariaLabel)
    .eql('Show filter options for column \'Column3\'')
    .expect(columnHeader.getHeaderFilterIcon(2).ariaLabel)
    .notContains('undefined');
}).before(async () => {
  await createWidget('dxPivotGrid', {
    allowFiltering: true,
    fieldPanel: {
      visible: true,
    },
    dataSource: {
      fields: [{
        dataField: 'row1',
        area: 'row',
      }, {
        dataField: 'row2',
        area: 'row',
      }, {
        dataField: 'column1',
        area: 'column',
      }, {
        dataField: 'column2',
        area: 'column',
      }, {
        area: 'column',
      }, {
        dataField: 'column3',
        area: 'filter',
      }],
      store: [],
    },
  });
});
