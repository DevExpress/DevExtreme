import { ClientFunction } from 'testcafe';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

const getDetailGridLoadCount = ClientFunction(() => (window as any).detailGridLoadCount as number);

fixture.disablePageReloads`Master detail.Functional`
  .page(url(__dirname, '../../../container.html'));

test('Detail grid should not reload data when the collapsed master row reenters the viewport with standard scrolling and virtual row rendering (T1326188)', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');

  await t.expect(dataGrid.isReady()).ok();

  // act - expand the master row
  await t.click(dataGrid.getDataRow(0).getCommandCell(0).element);

  let detailGrid = dataGrid.getMasterRow(0).getDataGrid();

  // assert
  await t
    .expect(dataGrid.getDataRow(0).isExpanded)
    .ok()
    .expect(detailGrid.element.exists)
    .ok()
    .expect(getDetailGridLoadCount())
    .eql(1);

  // act - collapse the master row
  await t.click(dataGrid.getDataRow(0).getCommandCell(0).element);

  // assert
  await t
    .expect(dataGrid.getDataRow(0).isExpanded)
    .notOk()
    .expect(detailGrid.element.visible)
    .notOk()
    .expect(getDetailGridLoadCount())
    .eql(1);

  // act
  await dataGrid.scrollTo(t, { y: 10000 });

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok()
    .expect(dataGrid.getDataRow(199).element.exists)
    .ok();

  // act
  await dataGrid.scrollTo(t, { y: 0 });

  detailGrid = dataGrid.getMasterRow(0).getDataGrid();

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok()
    .expect(dataGrid.getDataRow(0).element.exists)
    .ok()
    .expect(detailGrid.element.exists)
    .notOk()
    .expect(getDetailGridLoadCount())
    .eql(1, 'Detail grid data should not be reloaded after scrolling back to the collapsed master row');
}).before(async () => {
  await ClientFunction(() => {
    (window as any).detailGridLoadCount = 0;
  })();

  return createWidget('dxDataGrid', {
    dataSource: [...new Array(200)].map((_, index) => ({
      id: index,
      text: `item ${index}`,
    })),
    keyExpr: 'id',
    height: 400,
    scrolling: {
      mode: 'standard',
      rowRenderingMode: 'virtual',
      // @ts-expect-error private option
      updateTimeout: 0,
      useNative: false,
    },
    paging: {
      enabled: false,
    },
    columns: ['id', 'text'],
    masterDetail: {
      enabled: true,
      template(container) {
        ($('<div>') as any)
          .dxDataGrid({
            keyExpr: 'id',
            height: 180,
            columns: ['id', 'text'],
            dataSource: {
              load() {
                ((window as any).detailGridLoadCount as number) += 1;

                return [
                  { id: 1, text: 'detail 1' },
                  { id: 2, text: 'detail 2' },
                ];
              },
              key: 'id',
            } as any,
          })
          .appendTo(container);
      },
    },
  });
}).after(async () => ClientFunction(() => {
  delete (window as any).detailGridLoadCount;
})());
