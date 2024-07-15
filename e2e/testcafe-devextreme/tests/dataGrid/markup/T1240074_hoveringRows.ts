import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { getData } from '../helpers/generateDataSourceData';

fixture.disablePageReloads`HoveringRows`.page(
  url(__dirname, '../../container.html'),
);

test('Hover over rows in the middle', async (t) => {
  const dataGrid = new DataGrid('#container');
  const firstRow = dataGrid.getDataRow(10);
  const secondRow = dataGrid.getDataRow(11);

  await t.hover(firstRow.element)
    .expect(firstRow.isHovered)
    .ok();

  await t.hover(secondRow.element)
    .expect(firstRow.isHovered)
    .notOk()
    .expect(secondRow.isHovered)
    .ok();
}).before(async () => {
  await createWidget(
    'dxDataGrid',
    {
      dataSource: getData(20, 3),
      hoverStateEnabled: true,
    },
  );
});

test('Hover over first and last rows', async (t) => {
  const dataGrid = new DataGrid('#container');
  const firstRow = dataGrid.getDataRow(0);
  const lastRow = dataGrid.getDataRow(19);

  await t.hover(firstRow.element)
    .expect(firstRow.isHovered)
    .ok();

  await t.hover(lastRow.element)
    .expect(firstRow.isHovered)
    .notOk()
    .expect(lastRow.isHovered)
    .ok();
}).before(async () => {
  await createWidget(
    'dxDataGrid',
    {
      dataSource: getData(20, 3),
      hoverStateEnabled: true,
    },
  );
});
