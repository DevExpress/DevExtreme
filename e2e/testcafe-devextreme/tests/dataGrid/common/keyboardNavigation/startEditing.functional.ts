import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { ClientFunction } from 'testcafe';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Keyboard Navigation - editOnKeyPress`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

test('Editing should start by pressing enter after scrolling content with scrolling.mode=virtual', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await dataGrid.scrollBy(t, { y: 10000 });

  await t.click(dataGrid.getDataCell(49, 1).element);
  await t.pressKey('enter');

  await t.expect(dataGrid.getDataCell(49, 1).getEditor().element.focused).ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [...new Array(50)].map((_, i) => ({
      data1: i * 2,
      data2: i * 2 + 1,
    })),
    columns: [
      'data1',
      'data2',
    ],
    editing: {
      allowUpdating: true,
    },
    scrolling: {
      mode: 'virtual',
    },
    height: 300,
  });
});

test('editing.allowUpdating callback should receive correct row on tab key on first cell with virtual scrolling (T1290811)', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await dataGrid.scrollBy(t, { y: 10000 });

  await t
    .click(dataGrid.getDataCell(49, 0).element)
    .expect(dataGrid.getDataCell(49, 0).getEditor().element.focused).ok();

  await t
    .pressKey('tab')
    .expect(dataGrid.getDataCell(49, 1).getEditor().element.focused).ok();

  const eventRowKeys = await ClientFunction(() => (window as any).eventRowKeys)();
  const uniqueRowKeys = [...new Set(eventRowKeys)];

  await t.expect(uniqueRowKeys).eql([49]);
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [...new Array(50)].map((_, i) => ({
      id: i,
      data: `Row ${i}`,
    })),
    keyExpr: 'id',
    columns: ['id', 'data'],
    editing: {
      mode: 'cell',
      allowUpdating: (e) => {
        (window as any).eventRowKeys ??= [];
        (window as any).eventRowKeys.push(e.row?.key);
        return true;
      },
    },
    scrolling: {
      mode: 'virtual',
    },
    height: 300,
  });
});

test('editing.allowUpdating callback should receive correct row on tab key on last cell with virtual scrolling (T1290811)', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await dataGrid.scrollBy(t, { y: 10000 });

  await t
    .click(dataGrid.getDataCell(48, 1).element)
    .expect(dataGrid.getDataCell(48, 1).getEditor().element.focused).ok();

  await t
    .pressKey('tab')
    .expect(dataGrid.getDataCell(49, 0).getEditor().element.focused).ok();

  const eventRowKeys = await ClientFunction(() => (window as any).eventRowKeys)();
  const uniqueRowKeys = [...new Set(eventRowKeys)];

  await t.expect(uniqueRowKeys).eql([48, 49]);
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [...new Array(50)].map((_, i) => ({
      id: i,
      data: `Row ${i}`,
    })),
    keyExpr: 'id',
    columns: ['id', 'data'],
    editing: {
      mode: 'cell',
      allowUpdating: (e) => {
        (window as any).eventRowKeys ??= [];
        (window as any).eventRowKeys.push(e.row?.key);
        return true;
      },
    },
    scrolling: {
      mode: 'virtual',
    },
    height: 300,
  });
});

test('DataGrid should not remove the minus symbol when editing started (T1201166)', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .click(dataGrid.getDataCell(0, 0).element)
    .pressKey('- 1')
    .pressKey('enter')
    .expect(dataGrid.getDataCell(0, 0).element.innerText)
    .eql('-1');
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [
      { id: undefined, text: '1' },
      { id: 2, text: '2' },
      { id: 3, text: '3' },
    ],
    columns: [{
      dataField: 'id',
      dataType: 'number',
      editorOptions: {
        format: { type: 'decimal' },
      },
    },
    'text',
    ],
    editing: {
      allowUpdating: true,
      selectTextOnEditStart: true,
      mode: 'batch',
      startEditAction: 'dblClick',
    },
    keyboardNavigation: {
      editOnKeyPress: true,
      enterKeyAction: 'moveFocus',
      enterKeyDirection: 'column',
    },
  });
});
