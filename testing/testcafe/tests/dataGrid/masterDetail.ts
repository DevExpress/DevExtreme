import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import { changeTheme } from '../../helpers/changeTheme';
import DataGrid from '../../model/dataGrid';
import { safeSizeTest } from '../../helpers/safeSizeTest';

fixture.disablePageReloads`Master detail`
  .page(url(__dirname, '../container.html'));

['material.blue.light', 'generic.light'].forEach((theme) => {
  test.skip(`Checkbox align right in masterdetail (T1045321) ${theme}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // assert
    await t
      .expect(await takeScreenshot(`T1045321-${theme}.png`, '#container'))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);
    return createWidget('dxDataGrid', {
      dataSource: [{
        ID: 1,
        Prefix: 'Mr.',
      }],
      keyExpr: 'ID',
      showBorders: true,
      selection: {
        mode: 'multiple',
      },
      columns: [
        {
          dataField: 'Prefix',
          caption: 'Title',
          width: 400,
        },
      ],
      masterDetail: {
        autoExpandAll: true,
        enabled: true,
        template(container) {
          ($('<div>') as any)
            .dxTreeList({
              columnAutoWidth: true,
              showBorders: true,
              selection: {
                mode: 'multiple',
              },
              dataSource: [{
                ID: 1,
                Title: 'CEO',
                Hire_Date: '1995-01-15',
              }],
              rootValue: -1,
              keyExpr: 'ID',
              parentIdExpr: 'Head_ID',
              columns: [
                {
                  dataField: 'Title',
                  caption: 'Position',
                  width: 200,
                },
                {
                  dataField: 'Hire_Date',
                  dataType: 'date',
                  width: 200,
                },
              ],
              showRowLines: true,
            })
            .appendTo(container);
        },
      },
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });
});

// T1113525
test('pageSizeSelector has correct layout inside masterDetail', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid('#container');

  // act
  await t.click(dataGrid.getDataRow(0).getCommandCell(0).element);

  const masterRow = dataGrid.getMasterRow(0);
  const masterGrid = masterRow.getDataGrid();

  // assert
  await t
    .expect(await takeScreenshot('T1113525.page-size-select.png', masterGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
})
  .before(() => createWidget('dxDataGrid', {
    dataSource: [{ column1: 'first' }],
    columns: ['column1'],
    masterDetail: {
      enabled: true,
      template(container) {
        ($('<div>') as any)
          .dxDataGrid({
            pager: {
              displayMode: 'compact',
              showPageSizeSelector: true,
              visible: true,
            },
            columns: ['detail1'],
            dataSource: [],
          })
          .appendTo(container);
      },
    },
  }));

// T1159578
safeSizeTest('The master detail row should display correctly when renderAsync, virtual scrolling and column fixing features are enabled', async (t) => {
  // arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid('#container');

  // assert
  await takeScreenshot('T1159578-master-detail-with-renderAsync-1.png', dataGrid.element);

  // act
  await t.click(dataGrid.getDataRow(16).getCommandCell(0).element);

  // assert
  await takeScreenshot('T1159578-master-detail-with-renderAsync-2.png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800])
  .before(() => createWidget('dxDataGrid', {
    dataSource: [...new Array(40)].map((_, index) => ({ id: index, text: `item ${index}` })),
    keyExpr: 'id',
    showBorders: true,
    height: 700,
    renderAsync: true,
    masterDetail: {
      enabled: true,
    },
    scrolling: {
      mode: 'virtual',
    },
  }));
