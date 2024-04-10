/* eslint-disable @typescript-eslint/no-floating-promises */
import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import CheckBox from 'devextreme-testcafe-models/checkBox';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

fixture.disablePageReloads`Selection`
  .page(url(__dirname, '../container.html'));

test('selectAll state should be correct after unselect item if refresh(true) is called inside onSelectionChanged (T1048081)', async (t) => {
  const dataGrid = new DataGrid('#container');

  const firstRowSelectionCheckBox = new CheckBox(dataGrid.getDataCell(0, 0).getEditor().element);
  const selectAllCheckBox = new CheckBox(
    dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).getEditor().element,
  );

  // act
  await t.click(firstRowSelectionCheckBox.element);

  // assert
  await t
    .expect(await selectAllCheckBox.option('value')).eql(undefined)
    .expect(await firstRowSelectionCheckBox.option('value')).eql(false);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
  ],
  keyExpr: 'id',
  selectedRowKeys: [1, 2],
  paging: {
    pageSize: 3,
  },
  selection: {
    mode: 'multiple',
  },
  onSelectionChanged(e) {
    e.component.refresh(true);
  },
}));

// T1141405
test.meta({unstable: true})('The Select All checkbox should be visible when a column headerCellTemplate is specified (React)', async (t) => {
  // arrange, act
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // assert
  await takeScreenshot('T1141405-grid-select-all.png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await createWidget('dxDataGrid', {
    dataSource: [...new Array(2)].map((_, index) => ({ id: index, text: `item ${index}` })),
    renderAsync: false,
    // @ts-expect-error private option
    templatesRenderAsynchronously: true,
    loadingTimeout: 200,
    columns: [
      { dataField: 'id', headerCellTemplate: '#test' },
      { dataField: 'text' },
    ],
    selection: {
      mode: 'multiple',
    },
  });

  // simulating async rendering in React
  await ClientFunction(() => {
    const dataGrid = ($('#container') as any).dxDataGrid('instance');

    // eslint-disable-next-line no-underscore-dangle
    dataGrid.getView('columnHeadersView')._templatesCache = {};

    // eslint-disable-next-line no-underscore-dangle
    dataGrid._getTemplate = () => ({
      render(options) {
        setTimeout(() => {
          $(options.container).html('<div>Custom  header template</div>');
          options.deferred?.resolve();
        }, 100);
      },
    });
  })();

  await t.wait(300);
});

// T1214734
test('Select rows by shift should work when grid has real time updates', async (t) => {
  const dataGrid = new DataGrid('#container');
  const secondRow = dataGrid.getDataRow(1);
  const seventhRow = dataGrid.getDataRow(6);
  const checkRowSelectionStates = async (startRowIndex: number, endRowIndex: number) => {
    for (let i = startRowIndex; i <= endRowIndex; i += 1) {
      await t
        .expect(dataGrid.getDataRow(i).isSelected)
        .ok();
    }
  };

  // act
  await t
    .click(secondRow.element);

  // assert
  await checkRowSelectionStates(1, 1);
  await t
    .expect(dataGrid.getDataCell(2, 3).element.textContent)
    .eql('test123');

  // act
  await t.click(seventhRow.element, { modifiers: { shift: true } });

  // assert
  await checkRowSelectionStates(1, 6);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: {
    store: {
      data: [...new Array(50)].map((_, i) => ({
        ID: i + 1,
        CompanyName: `company name ${i + 1}`,
        City: `city ${i + 1}`,
      })),
      type: 'array',
      key: 'ID',
    },
    reshapeOnPush: true,
    pushAggregationTimeout: 0,
  },
  height: 600,
  repaintChangesOnly: true,
  selection: {
    mode: 'multiple',
  },
  onSelectionChanged(e) {
    e.component.getDataSource().store().push([{
      type: 'update',
      key: 3,
      data: {
        City: 'test123',
      },
    }]);
  },
  columnAutoWidth: true,
  showBorders: true,
  paging: {
    pageSize: 10,
  },
}));
