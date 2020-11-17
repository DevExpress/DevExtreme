import { Selector, ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../helpers/createWidget';
import DataGrid from '../../model/dataGrid';

fixture.disablePageReloads`Keyboard Navigation`
  .page(url(__dirname, '../container.html'))
  .afterEach(() => disposeWidgets());

test('Cell should not highlighted after editing another cell when startEditAction: dblClick and editing.mode: batch', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t
    .expect(dataGrid.getDataCell(0, 1).isFocused).notOk()
    .expect(dataGrid.getDataCell(1, 1).isFocused).notOk()

    .doubleClick(dataGrid.getDataCell(1, 1).element, { speed: 0.5 })
    .expect(dataGrid.getDataCell(0, 1).isFocused)
    .notOk()
    .expect(dataGrid.getDataCell(1, 1).isFocused)
    .ok()

    .click(dataGrid.getDataCell(0, 1).element, { speed: 0.5 })
    .expect(dataGrid.getDataCell(0, 1).isFocused)
    .notOk()
    .expect(dataGrid.getDataCell(1, 1).isFocused)
    .notOk()
    .expect(dataGrid.getDataCell(1, 1).isEditCell)
    .notOk()

    .doubleClick(dataGrid.getDataCell(1, 1).element, { speed: 0.5 })
    .expect(dataGrid.getDataCell(0, 1).isFocused)
    .notOk()

    .click(dataGrid.getDataCell(0, 1).element, { speed: 0.5 })
    .expect(dataGrid.getDataCell(0, 1).element.focused)
    .ok()
    .expect(dataGrid.getDataCell(0, 1).isFocused)
    .notOk()
    .expect(dataGrid.getDataCell(1, 1).isFocused)
    .notOk();
}).before(() => createWidget('dxDataGrid', {
  dataSource: [
    { name: 'Alex', phone: '555555', room: 1 },
    { name: 'Dan', phone: '553355', room: 2 },
  ],
  columns: ['name', 'phone', 'room'],
  editing: {
    mode: 'batch',
    allowUpdating: true,
    startEditAction: 'dblClick',
  },
}));

test('Cell should highlighted after editing another cell when startEditAction is "dblClick" and editing mode is "cell"', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t
    .expect(dataGrid.getDataCell(0, 1).isFocused).notOk()
    .expect(dataGrid.getDataCell(1, 1).isFocused).notOk()

    .doubleClick(dataGrid.getDataCell(1, 1).element)
    .expect(dataGrid.getDataCell(0, 1).isFocused)
    .notOk()
    .expect(dataGrid.getDataCell(1, 1).isFocused)
    .ok()

    .click(dataGrid.getDataCell(0, 1).element)
    .expect(dataGrid.getDataCell(0, 1).isFocused)
    .ok()
    .expect(dataGrid.getDataCell(1, 1).isFocused)
    .notOk()
    .expect(dataGrid.getDataCell(1, 1).isEditCell)
    .notOk()

    .doubleClick(dataGrid.getDataCell(1, 1).element)
    .expect(dataGrid.getDataCell(0, 1).isFocused)
    .notOk()
    .expect(dataGrid.getDataCell(1, 1).isFocused)
    .ok()

    .click(dataGrid.getDataCell(0, 1).element)
    .expect(dataGrid.getDataCell(0, 1).element.focused)
    .ok()
    .expect(dataGrid.getDataCell(0, 1).isFocused)
    .ok()
    .expect(dataGrid.getDataCell(1, 1).isFocused)
    .notOk();
}).before(() => createWidget('dxDataGrid', {
  dataSource: [
    { name: 'Alex', phone: '555555', room: 1 },
    { name: 'Dan', phone: '553355', room: 2 },
  ],
  columns: ['name', 'phone', 'room'],
  editing: {
    mode: 'cell',
    allowUpdating: true,
    startEditAction: 'dblClick',
  },
  onFocusedCellChanging: (e) => { e.isHighlighted = true; },
}));

test('Cell should be focused after Enter key press if enterKeyDirection is "none" and enterKeyAction is "moveFocus"', async (t) => {
  const dataGrid = new DataGrid('#container');
  const dataCell = dataGrid.getDataCell(0, 0).element;
  const commandCell = dataGrid.getDataCell(0, 1).element;

  await t
    .click(dataCell)
    .pressKey('esc')
    .expect(dataCell.focused).ok()
    .pressKey('enter')
    .expect(dataCell.focused)
    .ok()

    .pressKey('enter')
    .expect(dataCell.focused)
    .ok()

    .pressKey('tab enter')
    .expect(commandCell.focused)
    .ok()
    .expect(dataGrid.getDataRow(0).isRemoved)
    .ok();
}).before(() => createWidget('dxDataGrid', {
  height: 200,
  width: 200,
  dataSource: [
    { id: 0 },
    { id: 1 },
  ],
  editing: {
    mode: 'batch',
    allowUpdating: true,
    allowDeleting: true,
  },
  keyboardNavigation: {
    enterKeyAction: 'moveFocus',
    enterKeyDirection: 'none',
  },
}));

test('TextArea should be focused on editing start', async (t) => {
  const dataGrid = new DataGrid('#container');
  const commandCell = dataGrid.getDataCell(1, 3).element;
  const dataCell = dataGrid.getDataCell(1, 0);
  const getTextArea = () => dataCell.element.find('.text-area-1');

  await t
    // act, assert
    .click(commandCell.find('.dx-link-edit'))
    .expect(dataCell.isEditCell).ok()
    .expect(getTextArea().exists)
    .ok()
    .expect(getTextArea().focused)
    .ok();
}).before(() => createWidget('dxDataGrid', {
  dataSource: [
    { id: 0, name: 'Alex' },
    { id: 1, name: 'Bob' },
  ],
  editing: {
    mode: 'row',
    allowUpdating: true,
  },
  columns: [
    {
      dataField: 'name',
      editCellTemplate: (cell) => $(cell).append($('<textarea class="text-area-1" />')),
    },
    {
      dataField: 'phone',
      editCellTemplate: (cell) => $(cell).append($('<textarea class="text-area-2" />')),
    },
    {
      dataField: 'room',
      editCellTemplate: (cell) => $(cell).append($('<textarea />')),
    },
  ],
}));

test('Navigation through views using Tab, Shift+Tab', async (t) => {
  const dataGrid = new DataGrid('#container');
  const headers = dataGrid.getHeaders();
  const headerRow = headers.getHeaderRow(0);
  const filterRow = headers.getFilterRow();
  const filterPanel = dataGrid.getFilterPanel();
  const pager = dataGrid.getPager();

  // header row
  await t
    .pressKey('tab')
    .expect(headers.hasFocusedState).ok()
    .expect(headerRow.getCommandCell(0).element.focused)
    .notOk()
    .expect(headerRow.getCommandCell(0).getSelectCheckBox().focused)
    .ok()

    .pressKey('tab')
    .expect(headerRow.getHeaderCell(1).element.focused)
    .ok()
    .pressKey('tab')
    .expect(headers.hasFocusedState)
    .ok()
    .expect(headerRow.getHeaderCell(1).getFilterIcon().focused)
    .ok()

    .pressKey('tab')
    .expect(headers.hasFocusedState)
    .ok()
    .expect(headerRow.getHeaderCell(2).element.focused)
    .ok()
    .pressKey('tab')
    .expect(headers.hasFocusedState)
    .ok()
    .expect(headerRow.getHeaderCell(2).getFilterIcon().focused)
    .ok();

  // filter row
  await t
    .pressKey('tab')
    .expect(headers.hasFocusedState).ok()
    .expect(filterRow.getFilterCell(1).getSearchIcon().element.focused)
    .ok()
    .expect(filterRow.getFilterCell(1).getSearchIcon().hasFocusedState)
    .ok()

    .pressKey('tab')
    .expect(headers.hasFocusedState)
    .ok()
    .expect(filterRow.getFilterCell(1).getEditor().element.focused)
    .ok()

    .pressKey('tab')
    .expect(headers.hasFocusedState)
    .ok()
    .expect(filterRow.getFilterCell(2).getSearchIcon().element.focused)
    .ok()
    .expect(filterRow.getFilterCell(2).getSearchIcon().hasFocusedState)
    .ok()

    .pressKey('tab')
    .expect(headers.hasFocusedState)
    .ok()
    .expect(filterRow.getFilterCell(2).getEditor().element.focused)
    .ok();

  // rowsView
  await t
    // 1st row
    .pressKey('tab')
    .expect(dataGrid.getDataRow(0).getCommandCell(0).getSelectCheckBox().focused).ok()
    .expect(dataGrid.getDataRow(0).getCommandCell(0).element.focused)
    .notOk()
    .expect(dataGrid.getDataRow(0).getCommandCell(0).isFocused)
    .ok()

    .pressKey('tab')
    .expect(dataGrid.getDataRow(0).getDataCell(1).element.focused)
    .ok()
    .expect(dataGrid.getDataRow(0).getDataCell(1).isFocused)
    .ok()

    .pressKey('tab')
    .expect(dataGrid.getDataRow(0).getDataCell(2).element.focused)
    .ok()
    .expect(dataGrid.getDataRow(0).getDataCell(2).isFocused)
    .ok()

    .pressKey('tab')
    .expect(dataGrid.getDataRow(0).getCommandCell(3).getButton(0).focused)
    .ok()

    .pressKey('tab')
    .expect(dataGrid.getDataRow(0).getCommandCell(3).getButton(1).focused)
    .ok()

    // 2nd row
    .pressKey('tab')
    .expect(dataGrid.getDataRow(1).getCommandCell(0).getSelectCheckBox().focused)
    .ok()
    .expect(dataGrid.getDataRow(1).getCommandCell(0).element.focused)
    .notOk()
    .expect(dataGrid.getDataRow(1).getCommandCell(0).isFocused)
    .ok()

    .pressKey('tab')
    .expect(dataGrid.getDataRow(1).getDataCell(1).element.focused)
    .ok()
    .expect(dataGrid.getDataRow(1).getDataCell(1).isFocused)
    .ok()

    .pressKey('tab')
    .expect(dataGrid.getDataRow(1).getDataCell(2).element.focused)
    .ok()
    .expect(dataGrid.getDataRow(1).getDataCell(2).isFocused)
    .ok()

    .pressKey('tab')
    .expect(dataGrid.getDataRow(1).getCommandCell(3).getButton(0).focused)
    .ok()

    .pressKey('tab')
    .expect(dataGrid.getDataRow(1).getCommandCell(3).getButton(1).focused)
    .ok();

  // filterPanel
  await t
    .pressKey('tab')
    .expect(filterPanel.hasFocusedState).ok()
    .expect(filterPanel.getIconFilter().element.focused)
    .ok()

    .pressKey('tab')
    .expect(filterPanel.hasFocusedState)
    .ok()
    .expect(filterPanel.getFilterText().element.focused)
    .ok();

  // pager
  await t
    .pressKey('tab')
    .expect(pager.hasFocusedState).ok()
    .expect(pager.getPageSize(0).element.focused)
    .ok()

    .pressKey('tab')
    .expect(pager.hasFocusedState)
    .ok()
    .expect(pager.getPageSize(1).element.focused)
    .ok()

    .pressKey('tab')
    .expect(pager.hasFocusedState)
    .ok()
    .expect(pager.getPrevNavButton().element.focused)
    .ok()

    .pressKey('tab')
    .expect(pager.hasFocusedState)
    .ok()
    .expect(pager.getNavPage('1').element.focused)
    .ok()

    .pressKey('tab')
    .expect(pager.hasFocusedState)
    .ok()
    .expect(pager.getNavPage('2').element.focused)
    .ok()

    .pressKey('tab')
    .expect(pager.hasFocusedState)
    .ok()
    .expect(pager.getNextNavButton().element.focused)
    .ok();

  // focus BODY
  await t
    .pressKey('tab')
    .expect(Selector('BODY').focused).ok();

  // Reverse
  // pager
  await t
    .pressKey('shift+tab')
    .expect(pager.hasFocusedState).ok()
    .expect(pager.getNextNavButton().element.focused)
    .ok()

    .pressKey('shift+tab')
    .expect(pager.hasFocusedState)
    .ok()
    .expect(pager.getNavPage('2').element.focused)
    .ok()

    .pressKey('shift+tab')
    .expect(pager.hasFocusedState)
    .ok()
    .expect(pager.getNavPage('1').element.focused)
    .ok()

    .pressKey('shift+tab')
    .expect(pager.hasFocusedState)
    .ok()
    .expect(pager.getPrevNavButton().element.focused)
    .ok()

    .pressKey('shift+tab')
    .expect(pager.hasFocusedState)
    .ok()
    .expect(pager.getPageSize(1).element.focused)
    .ok()

    .pressKey('shift+tab')
    .expect(pager.hasFocusedState)
    .ok()
    .expect(pager.getPageSize(0).element.focused)
    .ok();

  // filterPanel
  await t
    .pressKey('shift+tab')
    .expect(filterPanel.hasFocusedState).ok()
    .expect(filterPanel.getFilterText().element.focused)
    .ok()

    .pressKey('shift+tab')
    .expect(filterPanel.hasFocusedState)
    .ok()
    .expect(filterPanel.getIconFilter().element.focused)
    .ok();

  // rowsView
  await t
    // 2nd row
    .pressKey('shift+tab')
    .expect(dataGrid.getDataRow(1).getCommandCell(3).getButton(1).focused).ok()

    .pressKey('shift+tab')
    .expect(dataGrid.getDataRow(1).getCommandCell(3).getButton(0).focused)
    .ok()

    .pressKey('shift+tab')
    .expect(dataGrid.getDataRow(1).getDataCell(2).element.focused)
    .ok()
    .expect(dataGrid.getDataRow(1).getDataCell(2).isFocused)
    .ok()

    .pressKey('shift+tab')
    .expect(dataGrid.getDataRow(1).getDataCell(1).element.focused)
    .ok()
    .expect(dataGrid.getDataRow(1).getDataCell(1).isFocused)
    .ok()

    .pressKey('shift+tab')
    .expect(dataGrid.getDataRow(1).getCommandCell(0).getSelectCheckBox().focused)
    .ok()
    .expect(dataGrid.getDataRow(1).getCommandCell(0).element.focused)
    .notOk()
    .expect(dataGrid.getDataRow(1).getCommandCell(0).isFocused)
    .ok()

    // 1st row
    .pressKey('shift+tab')
    .expect(dataGrid.getDataRow(0).getCommandCell(3).getButton(1).focused)
    .ok()

    .pressKey('shift+tab')
    .expect(dataGrid.getDataRow(0).getCommandCell(3).getButton(0).focused)
    .ok()

    .pressKey('shift+tab')
    .expect(dataGrid.getDataCell(0, 2).element.focused)
    .ok()
    .expect(dataGrid.getDataCell(0, 2).isFocused)
    .ok()

    .pressKey('shift+tab')
    .expect(dataGrid.getDataCell(0, 1).element.focused)
    .ok()
    .expect(dataGrid.getDataCell(0, 1).isFocused)
    .ok()

    .pressKey('shift+tab')
    .expect(dataGrid.getDataRow(0).getCommandCell(0).getSelectCheckBox().focused)
    .ok()
    .expect(dataGrid.getDataRow(0).getCommandCell(0).element.focused)
    .notOk()
    .expect(dataGrid.getDataRow(0).getCommandCell(0).isFocused)
    .ok()

    .pressKey('shift+tab')
    .expect(dataGrid.getDataRow(0).getCommandCell(0).getSelectCheckBox().focused)
    .notOk()
    .expect(dataGrid.getDataRow(0).getCommandCell(0).element.focused)
    .ok()
    .expect(dataGrid.getDataRow(0).getCommandCell(0).isFocused)
    .ok();

  // filter row
  await t
    .pressKey('shift+tab')
    .expect(headers.hasFocusedState).ok()
    .expect(filterRow.getFilterCell(2).getEditor().element.focused)
    .ok()

    .pressKey('shift+tab')
    .expect(headers.hasFocusedState)
    .ok()
    .expect(filterRow.getFilterCell(2).getSearchIcon().element.focused)
    .ok()
    .expect(filterRow.getFilterCell(2).getSearchIcon().hasFocusedState)
    .ok()

    .pressKey('shift+tab')
    .expect(headers.hasFocusedState)
    .ok()
    .expect(filterRow.getFilterCell(1).getEditor().element.focused)
    .ok()

    .pressKey('shift+tab')
    .expect(headers.hasFocusedState)
    .ok()
    .expect(filterRow.getFilterCell(1).getSearchIcon().element.focused)
    .ok()
    .expect(filterRow.getFilterCell(1).getSearchIcon().hasFocusedState)
    .ok();

  // header row
  await t
    .pressKey('shift+tab')
    .expect(headers.hasFocusedState).ok()
    .expect(headerRow.getHeaderCell(2).getFilterIcon().focused)
    .ok()
    .pressKey('shift+tab')
    .expect(headers.hasFocusedState)
    .ok()
    .expect(headerRow.getHeaderCell(2).element.focused)
    .ok()

    .pressKey('shift+tab')
    .expect(headers.hasFocusedState)
    .ok()
    .expect(headerRow.getHeaderCell(1).getFilterIcon().focused)
    .ok()
    .pressKey('shift+tab')
    .expect(headers.hasFocusedState)
    .ok()
    .expect(headerRow.getHeaderCell(1).element.focused)
    .ok()

    .pressKey('shift+tab')
    .expect(headers.hasFocusedState)
    .ok()
    .expect(headerRow.getCommandCell(0).element.focused)
    .notOk()
    .expect(headerRow.getCommandCell(0).getSelectCheckBox().focused)
    .ok();

  // focus BODY
  await t
    .pressKey('shift+tab')
    .expect(Selector('BODY').focused).ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    width: 300,
    dataSource: [
      { name: 'Alex', c0: 'c0_0' },
      { name: 'Ben', c0: 'c0_1' },
      { name: 'Dan', c0: 'c0_2' },
      { name: 'John', c0: 'c0_3' },
    ],
    keyExpr: 'name',
    editing: {
      allowUpdating: true,
      allowDeleting: true,
      selectTextOnEditStart: true,
      useIcons: true,
    },
    headerFilter: { visible: true },
    filterPanel: { visible: true },
    filterRow: { visible: true },
    pager: {
      allowedPageSizes: [1, 2],
      showPageSizeSelector: true,
      showNavigationButtons: true,
    },
    paging: {
      pageSize: 2,
    },
    focusedRowEnabled: true,
    selection: {
      mode: 'multiple',
      showCheckBoxesMode: 'always',
    },
  });
});

test('Select - The first command cell should be focused using Tab (T884646)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);
  const dataRow = dataGrid.getDataRow(0);

  // header row
  await t
    .pressKey('tab')
    .expect(headerRow.getCommandCell(0).element.focused).notOk()
    .expect(headerRow.getCommandCell(0).getSelectCheckBox().focused)
    .ok()

    .pressKey('tab')
    .expect(headerRow.getHeaderCell(1).element.focused)
    .ok();

  // data row
  await t
    .pressKey('tab')
    .expect(dataRow.getCommandCell(0).isFocused).ok()
    .expect(dataRow.getCommandCell(0).element.focused)
    .ok()
    .expect(dataRow.getCommandCell(0).getSelectCheckBox().focused)
    .notOk()
    .pressKey('tab')
    .expect(dataRow.getCommandCell(0).isFocused)
    .ok()
    .expect(dataRow.getCommandCell(0).element.focused)
    .notOk()
    .expect(dataRow.getCommandCell(0).getSelectCheckBox().focused)
    .ok()

    .pressKey('tab')
    .expect(dataRow.getDataCell(1).isFocused)
    .ok()
    .expect(dataRow.getDataCell(1).element.focused)
    .ok()

    .pressKey('shift+tab')
    .expect(dataRow.getCommandCell(0).isFocused)
    .ok()
    .expect(dataRow.getCommandCell(0).element.focused)
    .notOk()
    .expect(dataRow.getCommandCell(0).getSelectCheckBox().focused)
    .ok()
    .pressKey('shift+tab')
    .expect(dataRow.getCommandCell(0).isFocused)
    .ok()
    .expect(dataRow.getCommandCell(0).element.focused)
    .ok()
    .expect(dataRow.getCommandCell(0).getSelectCheckBox().focused)
    .notOk();

  // header row
  await t
    .pressKey('shift+tab')
    .expect(headerRow.getHeaderCell(1).element.focused).ok()

    .pressKey('shift+tab')
    .expect(headerRow.getCommandCell(0).element.focused)
    .notOk()
    .expect(headerRow.getCommandCell(0).getSelectCheckBox().focused)
    .ok();

  // focus BODY
  await t
    .pressKey('shift+tab')
    .expect(Selector('BODY').focused).ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    width: 300,
    dataSource: [
      { name: 'Alex' },
    ],
    keyExpr: 'name',
    selection: {
      mode: 'multiple',
      showCheckBoxesMode: 'always',
    },
  });
});

test('Edit - The first command cell should be focused using Tab (T884646)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);
  const dataRow = dataGrid.getDataRow(0);

  // header row
  await t
    .pressKey('tab')
    .expect(headerRow.getHeaderCell(1).element.focused).ok();

  // data row
  await t
    .pressKey('tab')
    .expect(dataRow.getCommandCell(0).isFocused).ok()
    .expect(dataRow.getCommandCell(0).element.focused)
    .ok()
    .expect(dataRow.getCommandCell(0).getButton(0).focused)
    .notOk()
    .pressKey('tab')
    .expect(dataRow.getCommandCell(0).isFocused)
    .notOk()
    .expect(dataRow.getCommandCell(0).element.focused)
    .notOk()
    .expect(dataRow.getCommandCell(0).getButton(0).focused)
    .ok()

    .pressKey('tab')
    .expect(dataRow.getDataCell(1).isFocused)
    .ok()
    .expect(dataRow.getDataCell(1).element.focused)
    .ok()

    .pressKey('shift+tab')
    .expect(dataRow.getCommandCell(0).isFocused)
    .notOk()
    .expect(dataRow.getCommandCell(0).element.focused)
    .notOk()
    .expect(dataRow.getCommandCell(0).getButton(0).focused)
    .ok()
    .pressKey('shift+tab')
    .expect(dataRow.getCommandCell(0).isFocused)
    .ok()
    .expect(dataRow.getCommandCell(0).element.focused)
    .ok()
    .expect(dataRow.getCommandCell(0).getButton(0).focused)
    .notOk();

  // header row
  await t
    .pressKey('shift+tab')
    .expect(headerRow.getHeaderCell(1).element.focused).ok();

  // focus BODY
  await t
    .pressKey('shift+tab')
    .expect(Selector('BODY').focused).ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    width: 300,
    dataSource: [
      { name: 'Alex' },
    ],
    columns: [
      { type: 'buttons' },
      'name',
    ],
    keyExpr: 'name',
    editing: {
      mode: 'row',
      allowUpdating: true,
    },
  });
});

test('Detail - The first command cell should be focused using Tab (T884646)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);
  const dataRow = dataGrid.getDataRow(0);

  // header row
  await t
    .pressKey('tab')
    .expect(headerRow.getHeaderCell(1).element.focused).ok();

  // data row
  await t
    .pressKey('tab')
    .expect(dataRow.getCommandCell(0).isFocused).ok()
    .expect(dataRow.getCommandCell(0).element.focused)
    .ok()

    .pressKey('tab')
    .expect(dataRow.getDataCell(1).isFocused)
    .ok()
    .expect(dataRow.getDataCell(1).element.focused)
    .ok()

    .pressKey('shift+tab')
    .expect(dataRow.getCommandCell(0).isFocused)
    .ok()
    .expect(dataRow.getCommandCell(0).element.focused)
    .ok();

  // header row
  await t
    .pressKey('shift+tab')
    .expect(headerRow.getHeaderCell(1).element.focused).ok();

  // focus BODY
  await t
    .pressKey('shift+tab')
    .expect(Selector('BODY').focused).ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    width: 300,
    dataSource: [
      { name: 'Alex' },
    ],
    keyExpr: 'name',
    masterDetail: {
      enabled: true,
    },
  });
});

test('Adaptive - Hidden cells should not be focused using Tab (T887014)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);
  const dataRow = dataGrid.getDataRow(0);

  // header row
  await t
    .pressKey('tab')
    .expect(headerRow.getHeaderCell(1).element.focused).ok()
    .expect(headerRow.getHeaderCell(1).element.hasAttribute('tabindex'))
    .ok()
    .expect(headerRow.getHeaderCell(2).isHidden)
    .ok()
    .expect(headerRow.getHeaderCell(2).element.hasAttribute('tabindex'))
    .notOk('the third header cell does not have tabindex')

    .pressKey('tab')
    .expect(headerRow.getHeaderCell(3).element.focused)
    .ok()
    .expect(headerRow.getHeaderCell(3).element.hasAttribute('tabindex'))
    .ok();

  // data row
  await t
    .pressKey('tab')
    .expect(dataRow.getCommandCell(0).isFocused).ok()
    .expect(dataRow.getCommandCell(0).element.focused)
    .ok()

    .pressKey('tab')
    .expect(dataRow.getDataCell(1).isFocused)
    .ok()
    .expect(dataRow.getDataCell(1).element.focused)
    .ok()
    .expect(dataRow.getDataCell(2).isHidden)
    .ok()
    .expect(dataRow.getDataCell(2).element.hasAttribute('tabindex'))
    .notOk('the third data cell does not have tabindex')

    .pressKey('tab')
    .expect(dataRow.getDataCell(3).isFocused)
    .ok()
    .expect(dataRow.getDataCell(3).element.focused)
    .ok()

    .pressKey('shift+tab')
    .expect(dataRow.getDataCell(2).isHidden)
    .ok()
    .expect(dataRow.getDataCell(2).element.hasAttribute('tabindex'))
    .notOk('the third data cell does not have tabindex')
    .expect(dataRow.getDataCell(1).isFocused)
    .ok()
    .expect(dataRow.getDataCell(1).element.focused)
    .ok()

    .pressKey('shift+tab')
    .expect(dataRow.getCommandCell(0).isFocused)
    .ok()
    .expect(dataRow.getCommandCell(0).element.focused)
    .ok();

  // header row
  await t
    .pressKey('shift+tab')
    .expect(headerRow.getHeaderCell(3).element.focused).ok()
    .expect(headerRow.getHeaderCell(3).element.hasAttribute('tabindex'))
    .ok()

    .pressKey('shift+tab')
    .expect(headerRow.getHeaderCell(2).isHidden)
    .ok()
    .expect(headerRow.getHeaderCell(2).element.hasAttribute('tabindex'))
    .notOk('the third header cell does not have tabindex')
    .expect(headerRow.getHeaderCell(1).element.focused)
    .ok()
    .expect(headerRow.getHeaderCell(1).element.hasAttribute('tabindex'))
    .ok();

  // focus BODY
  await t
    .pressKey('shift+tab')
    .expect(Selector('BODY').focused).ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    keyExpr: 'name',
    dataSource: [
      { name: 'Alex', phone: '5555555555', room: 1 },
    ],
    width: 150,
    columnHidingEnabled: true,
    columns: [
      {
        type: 'adaptive',
      },
      'name',
      {
        dataField: 'phone',
        hidingPriority: 0,
      },
      'room',
    ],
  });
});

test('Select views by Ctrl+Up, Ctrl+Down keys', async (t) => {
  const dataGrid = new DataGrid('#container');
  const headers = dataGrid.getHeaders();
  const headerRow = headers.getHeaderRow(0);
  const filterRow = headers.getFilterRow();
  const filterPanel = dataGrid.getFilterPanel();
  const pager = dataGrid.getPager();

  // Ctrl+Down
  await t
    .pressKey('tab')
    .expect(headers.hasFocusedState).ok('headers has focused state')
    .expect(headerRow.getHeaderCell(0).element.focused)
    .ok('focused header cell[0, 0]')

    .pressKey('ctrl+down')
    .expect(headers.hasFocusedState)
    .ok('headers has focused state')
    .expect(filterRow.getFilterCell(0).getEditor().element.focused)
    .ok('focused filterRow cell[0, 0]')

    .pressKey('ctrl+down')
    .expect(dataGrid.getDataRow(0).isFocusedRow)
    .ok('Row 0 is a focused row')

    .pressKey('ctrl+down')
    .expect(filterPanel.hasFocusedState)
    .ok('Filter panel has focused state')
    .expect(filterPanel.getIconFilter().element.focused)
    .ok('Focused filter panel filter icon')

    .pressKey('ctrl+down')
    .expect(pager.hasFocusedState)
    .ok('Pager has focused state')
    .expect(pager.getPageSize(0))
    .ok('Focused filter panel filter icon');

  // Ctrl+Up
  await t
    .pressKey('ctrl+up')
    .expect(filterPanel.hasFocusedState).ok('Filter panel has focused state')
    .expect(filterPanel.getIconFilter().element.focused)
    .ok('Focused filter panel filter icon')

    .pressKey('ctrl+up')
    .expect(dataGrid.getDataRow(0).isFocusedRow)
    .ok('Row 0 is a focused row')

    .pressKey('ctrl+up')
    .expect(headers.hasFocusedState)
    .ok('headers has focused state')
    .expect(filterRow.getFilterCell(0).getEditor().element.focused)
    .ok('focused filterRow cell[0, 0]')

    .pressKey('ctrl+up')
    .expect(headers.hasFocusedState)
    .ok('headers has focused state')
    .expect(headerRow.getHeaderCell(0).element.focused)
    .ok('focused header cell[0, 0]');
}).before(async () => {
  await createWidget('dxDataGrid', {
    width: 300,
    dataSource: [
      { name: 'Alex', c0: 'c0_0' },
      { name: 'Ben', c0: 'c0_1' },
      { name: 'Dan', c0: 'c0_2' },
      { name: 'John', c0: 'c0_3' },
    ],
    keyExpr: 'name',
    editing: {
      allowUpdating: true,
      allowDeleting: true,
      selectTextOnEditStart: true,
      useIcons: true,
    },
    headerFilter: { visible: true },
    filterPanel: { visible: true },
    filterRow: { visible: true },
    pager: {
      allowedPageSizes: [1, 2],
      showPageSizeSelector: true,
      showNavigationButtons: true,
    },
    paging: {
      pageSize: 2,
    },
    focusedRowEnabled: true,
  });
});

test('DataGrid - Scroll bars should not appear when updating edge cell focus overlay position (T812494)', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t
    .click(dataGrid.getDataCell(0, 0).element)
    .expect(dataGrid.getDataCell(0, 0).element.focused).ok()
    .pressKey('tab')
    .expect(dataGrid.getDataCell(0, 1).isFocused)
    .ok()
    .pressKey('tab')
    .expect(dataGrid.getDataCell(1, 0).isFocused)
    .ok()
    .expect(dataGrid.getScrollbarWidth(false))
    .eql(0);
}).before(async () => {
  await createWidget('dxDataGrid', {
    height: 150,
    width: 200,
    columnAutoWidth: true,
    dataSource: [
      { c0: 'c0_0', c1: 'c1_0' },
      { c0: 'c0_1', c1: 'c1_1' },
    ],
    scrolling: {
      useNative: true,
    },
    columns: [
      'c0',
      { dataField: 'c1', width: 50 },
    ],
  });
});

test('Tab key on the focused group row should be handled by default behavior (T833621)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const groupRow = dataGrid.getGroupRow(1);
  const pagerPage0 = dataGrid.getPager().getNavPage('1');

  await t
    .click(groupRow.element)
    .expect(groupRow.hasHiddenFocusState).ok()
    .pressKey('tab')
    .expect(pagerPage0.element.focused)
    .ok()
    .pressKey('shift+tab')
    .expect(groupRow.hasHiddenFocusState)
    .notOk()
    .expect(groupRow.hasFocusedState)
    .notOk()
    .expect(groupRow.element.focused)
    .ok()
    .pressKey('tab')
    .expect(groupRow.hasHiddenFocusState)
    .notOk()
    .expect(pagerPage0.element.focused)
    .ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    width: 400,
    dataSource: [
      { id: 0, c0: 'Test00 resize', c1: 'Test10' },
      { id: 1, c0: 'Test01 resize', c1: 'Test11' },
      { id: 1, c0: 'Test01 resize', c1: 'Test12' },
      { id: 1, c0: 'Test01 resize', c1: 'Test10' },
      { id: 1, c0: 'Test01 resize', c1: 'Test11' },
      { id: 1, c0: 'Test01 resize', c1: 'Test12' },
      { id: 1, c0: 'Test01 resize', c1: 'Test10' },
    ],
    columns: [
      'id',
      'c0',
      {
        dataField: 'c1',
        groupIndex: 0,
        showWhenGrouped: true,
      },
    ],
    paging: {
      pageSize: 2,
    },
    grouping: {
      autoExpandAll: false,
    },
  });
});

test('Row should not be focused by "focusedRowIndex" after change "pageIndex" by pager if "autoNavigateToFocused" row is false', async (t) => {
  const dataGrid = new DataGrid('#container');
  const pager = dataGrid.getPager();

  await t
    .expect(dataGrid.getDataRow(1).isFocusedRow).ok()
    .click(pager.getNavPage('2').element)
    .expect(pager.getNavPage('2').selected)
    .ok()
    .expect(dataGrid.getFocusedRow().exists)
    .notOk();
}).before(() => createWidget('dxDataGrid', {
  dataSource: [
    { id: 0, c0: 'c0_0' },
    { id: 1, c0: 'c0_1' },
    { id: 2, c0: 'c0_2' },
    { id: 3, c0: 'c0_3' },
  ],
  keyExpr: 'id',
  focusedRowEnabled: true,
  autoNavigateToFocusedRow: false,
  focusedRowIndex: 1,
  paging: {
    pageSize: 2,
  },
}));

test('Cell should be highlighted after editing another cell when startEditAction is \'dblClick\' and \'batch\' edit mode if isHighlighted is set to true in onFocusedCellChanging (T836391)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const cell0 = dataGrid.getDataCell(0, 0);
  const cell1 = dataGrid.getDataCell(0, 1);

  await t
    .expect(cell0.isFocused).notOk()
    .expect(cell1.isFocused).notOk()

    .doubleClick(cell0.element)
    .expect(cell0.isFocused)
    .ok()
    .expect(cell0.isEditCell)
    .ok()

    .click(cell1.element)
    .expect(cell1.isFocused)
    .ok()
    .expect(cell0.isFocused)
    .notOk()
    .expect(cell0.isEditCell)
    .notOk();
}).before(() => createWidget('dxDataGrid', {
  dataSource: [
    { name: 'Alex', phone: '555555', room: 1 },
    { name: 'Dan', phone: '553355', room: 2 },
  ],
  columns: ['name', 'phone', 'room'],
  editing: {
    mode: 'batch',
    allowUpdating: true,
    startEditAction: 'dblClick',
  },
  onFocusedCellChanging: (e) => { e.isHighlighted = true; },
}));

test('Previous navigation elements should not have "tabindex" if navigation action is "click" (T870120)', async (t) => {
  const dataGrid = new DataGrid('#container');

  for (let rowIndex = 0; rowIndex < 3; rowIndex += 1) {
    for (let colIndex = 0; colIndex < 3; colIndex += 1) {
      const cell = dataGrid.getDataCell(rowIndex, colIndex);

      await t
        .click(cell.element)
        .expect(cell.element.focused).ok(`cell[${rowIndex}, ${colIndex}] is focused`)
        .expect(cell.element.getAttribute('tabindex'))
        .eql('111', `cell[${rowIndex}, ${colIndex}] has tabindex`);
    }
  }
}).before(() => createWidget('dxDataGrid', {
  dataSource: [
    { id: 4, c0: 'c0_4', c1: 'c1_4' },
    { id: 5, c0: 'c0_5', c1: 'c1_5' },
    { id: 6, c0: 'c0_6', c1: 'c1_6' },
  ],
  tabIndex: '111',
}));

test('Previous navigation elements should not have "tabindex" if navigation action is "tab" (T870120)', async (t) => {
  const dataGrid = new DataGrid('#container');
  let cell = dataGrid.getDataCell(0, 0);

  await t.click(cell.element);

  for (let rowIndex = 0; rowIndex < 3; rowIndex += 1) {
    for (let colIndex = 0; colIndex < 3; colIndex += 1) {
      cell = dataGrid.getDataCell(rowIndex, colIndex);

      await t
        .expect(cell.element.focused).ok(`cell[${rowIndex}, ${colIndex}] is focused`)
        .expect(cell.element.getAttribute('tabindex')).eql('111', `cell[${rowIndex}, ${colIndex}] has tabindex`)
        .pressKey('tab');
    }
  }
}).before(() => createWidget('dxDataGrid', {
  dataSource: [
    { id: 4, c0: 'c0_4', c1: 'c1_4' },
    { id: 5, c0: 'c0_5', c1: 'c1_5' },
    { id: 6, c0: 'c0_6', c1: 'c1_6' },
  ],
  tabIndex: '111',
}));

test('The first group row should be expanded when the Enter key is pressed (T869799)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const firstGroupRow = dataGrid.getGroupRow(0);

  await t
    .pressKey('tab')
    .pressKey('tab')

    .expect(firstGroupRow.element.focused).ok()
    .expect(firstGroupRow.isFocused)
    .ok()
    .expect(firstGroupRow.isExpanded)
    .notOk()

    .pressKey('enter')

    .expect(firstGroupRow.element.focused)
    .ok()
    .expect(firstGroupRow.isFocused)
    .ok()
    .expect(firstGroupRow.isExpanded)
    .ok();
}).before(() => createWidget('dxDataGrid', {
  dataSource: [
    { name: 'Alex', phone: '555555' },
  ],
  columns: [{
    dataField: 'name',
    groupIndex: 0,
  }, 'phone'],
  grouping: {
    autoExpandAll: false,
  },
}));

test('The expand cell should not lose focus on expanding a master row (T892203)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const headerCell01 = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);
  const dataRow0 = dataGrid.getDataRow(0);
  const cell00 = dataRow0.getCommandCell(0);
  const cell01 = dataRow0.getDataCell(1);
  const dataRow1 = dataGrid.getDataRow(1);
  const cell10 = dataRow1.getCommandCell(0);
  const cell11 = dataRow1.getDataCell(1);

  await t
    .pressKey('tab')

    .expect(headerCell01.element.focused).ok()

    .pressKey('tab')

    .expect(cell00.element.focused)
    .ok()
    .expect(cell00.isFocused)
    .ok()

    .pressKey('enter')

    .expect(cell00.element.focused)
    .ok()
    .expect(cell00.isFocused)
    .ok()
    .expect(dataRow0.isExpanded)
    .ok()

    .pressKey('tab')

    .expect(cell01.element.focused)
    .ok()
    .expect(cell01.isFocused)
    .ok()

    .pressKey('tab')

    .expect(cell10.element.focused)
    .ok()
    .expect(cell10.isFocused)
    .ok()

    .pressKey('tab')

    .expect(cell11.element.focused)
    .ok()
    .expect(cell11.isFocused)
    .ok()

    .pressKey('shift+tab')

    .expect(cell10.element.focused)
    .ok()
    .expect(cell10.isFocused)
    .ok()

    .pressKey('shift+tab')

    .expect(cell01.element.focused)
    .ok()
    .expect(cell01.isFocused)
    .ok()

    .pressKey('shift+tab')

    .expect(cell00.element.focused)
    .ok()
    .expect(cell00.isFocused)
    .ok()

    .pressKey('enter')

    .expect(cell00.element.focused)
    .ok()
    .expect(cell00.isFocused)
    .ok()
    .expect(dataRow0.isExpanded)
    .notOk()

    .pressKey('shift+tab')

    .expect(headerCell01.element.focused)
    .ok()

    .pressKey('shift+tab')

    .expect(Selector('BODY').focused)
    .ok();
}).before(() => createWidget('dxDataGrid', {
  showBorders: true,
  keyExpr: 'id',
  dataSource: [{ id: 1 }, { id: 2 }],
  masterDetail: {
    enabled: true,
  },
}));

['Batch', 'Cell'].forEach((editMode) => {
  test(`${editMode} mode - Cells in a new row should be updated on Tab (T898356)`, async (t) => {
    const dataGrid = new DataGrid('#container') as any;
    const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();
    const cell00 = dataGrid.getDataCell(0, 0);
    const editor00 = cell00.getEditor();
    const cell01 = dataGrid.getDataCell(0, 1);
    const editor01 = cell01.getEditor();

    await t
      .click(addRowButton)

      .expect(cell00.isFocused).ok()
      .expect(editor00.element.focused)
      .ok()

      .typeText(editor00.element, '1')
      .pressKey('tab')

      .expect(cell00.isFocused)
      .notOk()
      .expect(dataGrid.apiGetCellValue(0, 0))
      .eql('1')
      .expect(cell01.isFocused)
      .ok()
      .expect(editor01.element.focused)
      .ok()

      .typeText(editor01.element, '2')
      .pressKey('tab')

      .expect(cell01.isFocused)
      .notOk()
      .expect(dataGrid.apiGetCellValue(0, 1))
      .eql('2');
  }).before(() => createWidget('dxDataGrid', {
    dataSource: [],
    editing: {
      mode: editMode.toLowerCase(),
      allowAdding: true,
    },
    columns: ['a', 'b'],
  }));

  test(`${editMode} mode - Cells in a new row should be updated on Shift+Tab (T898356)`, async (t) => {
    const dataGrid = new DataGrid('#container') as any;
    const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();
    const cell00 = dataGrid.getDataCell(0, 0);
    const editor00 = cell00.getEditor();
    const cell01 = dataGrid.getDataCell(0, 1);
    const editor01 = cell01.getEditor();

    await t
      .click(addRowButton)
      .click(cell01.element)

      .expect(cell01.isFocused).ok()
      .expect(editor01.element.focused)
      .ok()

      .typeText(editor01.element, '2')
      .pressKey('shift+tab')

      .expect(cell01.isFocused)
      .notOk()
      .expect(dataGrid.apiGetCellValue(0, 1))
      .eql('2')
      .expect(cell00.isFocused)
      .ok()
      .expect(editor00.element.focused)
      .ok()

      .typeText(editor00.element, '1')
      .pressKey('shift+tab')

      .expect(cell00.isFocused)
      .notOk()
      .expect(dataGrid.apiGetCellValue(0, 0))
      .eql('1');
  }).before(() => createWidget('dxDataGrid', {
    dataSource: [],
    editing: {
      mode: editMode.toLowerCase(),
      allowAdding: true,
    },
    columns: ['a', 'b'],
  }));

  test(`${editMode} mode - Cells in a modified row should be updated on Tab (T898356)`, async (t) => {
    const dataGrid = new DataGrid('#container') as any;
    const cell00 = dataGrid.getDataCell(0, 0);
    const editor00 = cell00.getEditor();
    const cell01 = dataGrid.getDataCell(0, 1);
    const editor01 = cell01.getEditor();

    await t
      .click(cell00.element)

      .expect(cell00.isFocused).ok()
      .expect(editor00.element.focused)
      .ok()

      .typeText(editor00.element, '1')
      .pressKey('tab')

      .expect(cell00.isFocused)
      .notOk()
      .expect(dataGrid.apiGetCellValue(0, 0))
      .eql('11')
      .expect(cell01.isFocused)
      .ok()
      .expect(editor01.element.focused)
      .ok()

      .typeText(editor01.element, '2')
      .pressKey('tab')

      .expect(cell01.isFocused)
      .notOk()
      .expect(dataGrid.apiGetCellValue(0, 1))
      .eql('22');
  }).before(() => createWidget('dxDataGrid', {
    dataSource: [{ a: '1', b: '2' }],
    editing: {
      mode: editMode.toLowerCase(),
      allowUpdating: true,
    },
    columns: ['a', 'b'],
  }));

  test(`${editMode} mode - Cells in a modified row should be updated on Shift+Tab (T898356)`, async (t) => {
    const dataGrid = new DataGrid('#container') as any;
    const cell00 = dataGrid.getDataCell(0, 0);
    const editor00 = cell00.getEditor();
    const cell01 = dataGrid.getDataCell(0, 1);
    const editor01 = cell01.getEditor();

    await t
      .click(cell01.element)

      .expect(cell01.isFocused).ok()
      .expect(editor01.element.focused)
      .ok()

      .typeText(editor01.element, '2')
      .pressKey('shift+tab')

      .expect(cell01.isFocused)
      .notOk()
      .expect(dataGrid.apiGetCellValue(0, 1))
      .eql('22')
      .expect(cell00.isFocused)
      .ok()
      .expect(editor00.element.focused)
      .ok()

      .typeText(editor00.element, '1')
      .pressKey('shift+tab')

      .expect(cell00.isFocused)
      .notOk()
      .expect(dataGrid.apiGetCellValue(0, 0))
      .eql('11');
  }).before(() => createWidget('dxDataGrid', {
    dataSource: [{ a: '1', b: '2' }],
    editing: {
      mode: editMode.toLowerCase(),
      allowUpdating: true,
    },
    columns: ['a', 'b'],
  }));
});

test('Horizontal moving by keydown if scrolling.columnRenderingMode: virtual', async (t) => {
  const dataGrid = new DataGrid('#container');
  let columnIndex = 0;
  let cell = dataGrid.getDataCell(0, columnIndex);

  await t.click(dataGrid.getDataCell(0, 0).element);

  // Moving right
  for (let i = 0; i < 19; i += 1) {
    await t.pressKey('right');

    columnIndex = i + 1;
    cell = dataGrid.getDataCell(0, columnIndex);
    await t.expect(cell.isFocused).ok(`Cell[0, ${columnIndex}] is focused`);
  }

  // Moving left
  for (let i = 19; i >= 1; i -= 1) {
    await t.pressKey('left');

    columnIndex = i - 1;
    cell = dataGrid.getDataCell(0, columnIndex);
    await t.expect(cell.isFocused).ok(`Cell[0, ${columnIndex}] is focused`);
  }
}).before(() => {
  const generateData = function (rowCount, columnCount) {
    const items: {}[] = [];

    for (let i = 0; i < rowCount; i += 1) {
      const item = {};
      for (let j = 0; j < columnCount; j += 1) {
        item[`field${j}`] = `${i}-${j}`;
      }
      items.push(item);
    }
    return items;
  };
  const data = generateData(2, 20);

  return createWidget('dxDataGrid', {
    width: 300,
    dataSource: data,
    columnWidth: 90,
    scrolling: {
      columnRenderingMode: 'virtual',
    },
    paging: {
      enabled: false,
    },
    onFocusedCellChanging: (e) => { e.isHighlighted = true; },
  });
});

test('Vertical moving by keydown if scrolling.mode: virtual, scrolling.rowRenderingMode: virtual', async (t) => {
  const dataGrid = new DataGrid('#container');
  let rowIndex = 0;
  let cell = dataGrid.getDataCell(rowIndex, 0);

  await t.click(cell.element);

  // Moving Down
  for (let i = 0; i < 19; i += 1) {
    await t.pressKey('down');
    rowIndex = i + 1;
    cell = dataGrid.getDataCell(rowIndex, 0);
    await t.expect(cell.isFocused).ok(`Cell[${rowIndex}, 0] is focused`);
  }

  // Moving Up
  for (let i = 19; i >= 1; i -= 1) {
    await t.pressKey('up');

    rowIndex = i - 1;
    cell = dataGrid.getDataCell(rowIndex, 0);
    await t.expect(cell.isFocused).ok(`Cell[${rowIndex}, 0] is focused`);
  }
}).before(() => {
  const generateData = function (rowCount, columnCount) {
    const items: {}[] = [];

    for (let i = 0; i < rowCount; i += 1) {
      const item = {};
      for (let j = 0; j < columnCount; j += 1) {
        item[`field${j}`] = `${i}-${j}`;
      }
      items.push(item);
    }
    return items;
  };
  const data = generateData(20, 2);

  return createWidget('dxDataGrid', {
    width: 300,
    height: 200,
    dataSource: data,
    scrolling: {
      mode: 'virtual',
      rowRenderingMode: 'virtual',
    },
    paging: {
      enabled: false,
    },
    onFocusedCellChanging: (e) => { e.isHighlighted = true; },
  });
});

['cell', 'batch'].forEach((editMode) => {
  test(`Moving by Tab key if scrolling.columnRenderingMode: virtual, editing.mode: ${editMode}`, async (t) => {
    const dataGrid = new DataGrid('#container');

    await t.click(dataGrid.getDataCell(0, 0).element);

    // Tab
    for (let rowIndex = 0; rowIndex < 2; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < 10; columnIndex += 1) {
        const cell = dataGrid.getDataCell(rowIndex, columnIndex);

        await t.expect(cell.isFocused).ok(`Cell[${rowIndex}, ${columnIndex}] is in focused`);
        await t.expect(cell.isEditCell).ok(`Cell[${rowIndex}, ${columnIndex}] is in edit mode`);

        await t.pressKey('tab');
      }
    }

    await t.click(dataGrid.getDataCell(1, 9).element);

    // Shift + Tab
    for (let rowIndex = 1; rowIndex >= 0; rowIndex -= 1) {
      for (let columnIndex = 9; columnIndex >= 0; columnIndex -= 1) {
        const cell = dataGrid.getDataCell(rowIndex, columnIndex);

        await t.expect(cell.isFocused).ok(`Cell[${rowIndex}, ${columnIndex}] is in focused`);
        await t.expect(cell.isEditCell).ok(`Cell[${rowIndex}, ${columnIndex}] is in edit mode`);

        await t.pressKey('shift+tab');
      }
    }
  }).before(() => {
    const generateData = function (rowCount, columnCount) {
      const items: {}[] = [];

      for (let i = 0; i < rowCount; i += 1) {
        const item = {};
        for (let j = 0; j < columnCount; j += 1) {
          item[`field${j}`] = `${i}-${j}`;
        }
        items.push(item);
      }
      return items;
    };
    const data = generateData(2, 10);

    return createWidget('dxDataGrid', {
      width: 300,
      columnWidth: 70,
      dataSource: data,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
      editing: {
        mode: editMode,
        allowUpdating: true,
      },
      paging: {
        enabled: false,
      },
    });
  });
});

test('Moving by Tab key if scrolling.columnRenderingMode: virtual and fixed columns are enabled', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t.click(dataGrid.getFixedDataRow(0).getSelectCheckBox());

  // Tab
  for (let rowIndex = 0; rowIndex < 2; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex <= 17; columnIndex += 1) {
      if (columnIndex === 0) {
        const rowCheckBox = dataGrid.getFixedDataRow(rowIndex).getSelectCheckBox();

        await t.expect(rowCheckBox.focused).ok()
          .pressKey('tab');
      } else {
        let cell;
        if (columnIndex <= 2 || columnIndex >= 16) {
          cell = dataGrid.getFixedDataCell(rowIndex, columnIndex);
        } else {
          cell = dataGrid.getDataCell(rowIndex, columnIndex);
        }

        await t.expect(cell.isFocused).ok(`Cell[${rowIndex}, ${columnIndex}] is in focused`);

        if (rowIndex === 1 && columnIndex === 17) {
          break;
        }

        await t.pressKey('tab');
      }
    }
  }

  // Shift + Tab
  for (let rowIndex = 1; rowIndex >= 0; rowIndex -= 1) {
    for (let columnIndex = 17; columnIndex >= 0; columnIndex -= 1) {
      if (columnIndex === 0) {
        const rowCheckBox = dataGrid.getFixedDataRow(rowIndex).getSelectCheckBox();

        await t.expect(rowCheckBox.focused).ok()
          .pressKey('shift+tab');
      } else {
        let cell;
        if (columnIndex <= 2 || columnIndex >= 16) {
          cell = dataGrid.getFixedDataCell(rowIndex, columnIndex);
        } else {
          cell = dataGrid.getDataCell(rowIndex, columnIndex);
        }

        await t.expect(cell.isFocused).ok(`Cell[${rowIndex}, ${columnIndex}] is in focused`);

        if (rowIndex === 0 && columnIndex === 0) {
          break;
        }

        await t.pressKey('shift+tab');
      }
    }
  }
}).before(() => {
  const generateData = function (rowCount, columnCount) {
    const items: {}[] = [];

    for (let i = 0; i < rowCount; i += 1) {
      const item = {};
      for (let j = 0; j < columnCount; j += 1) {
        item[`field${j}`] = `${i}-${j}`;
      }
      items.push(item);
    }
    return items;
  };
  const data = generateData(2, 17);

  return createWidget('dxDataGrid', {
    columnWidth: 70,
    dataSource: data,
    scrolling: {
      columnRenderingMode: 'virtual',
    },
    width: 500,
    selection: {
      mode: 'multiple',
      showCheckBoxesMode: 'always',
    },
    customizeColumns(columns) {
      columns[0].fixed = true;
      columns[1].fixed = true;
      columns[15].fixedPosition = 'right';
      columns[15].fixed = true;
      columns[16].fixedPosition = 'right';
      columns[16].fixed = true;
    },
  });
});

test('Moving by Tab key if scrolling.columnRenderingMode: virtual and fixed columns are enabled (rtlEnabled)', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t.click(dataGrid.getFixedDataRow(0).getSelectCheckBox());

  // Tab
  for (let rowIndex = 0; rowIndex < 2; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex <= 17; columnIndex += 1) {
      if (columnIndex === 0) {
        const rowCheckBox = dataGrid.getFixedDataRow(rowIndex).getSelectCheckBox();

        await t.expect(rowCheckBox.focused).ok()
          .pressKey('tab');
      } else {
        let cell;
        if (columnIndex <= 2 || columnIndex >= 16) {
          cell = dataGrid.getFixedDataCell(rowIndex, columnIndex);
        } else {
          cell = dataGrid.getDataCell(rowIndex, columnIndex);
        }

        await t.expect(cell.isFocused).ok(`Cell[${rowIndex}, ${columnIndex}] is in focused`);

        if (rowIndex === 1 && columnIndex === 17) {
          break;
        }

        await t.pressKey('tab');
      }
    }
  }

  // Shift + Tab
  for (let rowIndex = 1; rowIndex >= 0; rowIndex -= 1) {
    for (let columnIndex = 17; columnIndex >= 0; columnIndex -= 1) {
      if (columnIndex === 0) {
        const rowCheckBox = dataGrid.getFixedDataRow(rowIndex).getSelectCheckBox();

        await t.expect(rowCheckBox.focused).ok()
          .pressKey('shift+tab');
      } else {
        let cell;
        if (columnIndex <= 2 || columnIndex >= 16) {
          cell = dataGrid.getFixedDataCell(rowIndex, columnIndex);
        } else {
          cell = dataGrid.getDataCell(rowIndex, columnIndex);
        }

        await t.expect(cell.isFocused).ok(`Cell[${rowIndex}, ${columnIndex}] is in focused`);

        if (rowIndex === 0 && columnIndex === 0) {
          break;
        }

        await t.pressKey('shift+tab');
      }
    }
  }
}).before(() => {
  const generateData = function (rowCount, columnCount) {
    const items: {}[] = [];

    for (let i = 0; i < rowCount; i += 1) {
      const item = {};
      for (let j = 0; j < columnCount; j += 1) {
        item[`field${j}`] = `${i}-${j}`;
      }
      items.push(item);
    }
    return items;
  };
  const data = generateData(2, 17);

  return createWidget('dxDataGrid', {
    columnWidth: 70,
    dataSource: data,
    rtlEnabled: true,
    scrolling: {
      columnRenderingMode: 'virtual',
    },
    width: 500,
    selection: {
      mode: 'multiple',
      showCheckBoxesMode: 'always',
    },
    customizeColumns(columns) {
      columns[0].fixedPosition = 'right';
      columns[0].fixed = true;
      columns[1].fixedPosition = 'right';
      columns[1].fixed = true;
      columns[15].fixed = true;
      columns[16].fixed = true;
    },
  });
});

['Batch', 'Cell'].forEach((editMode) => {
  [true, false].forEach((focusedRowEnabled) => {
    test(`A stand-alone input should be focused on click after modifying a cell if focusedRowEnabled = ${focusedRowEnabled} and editing mode is ${editMode} (T940309)`, async (t) => {
      const dataGrid = new DataGrid('#container');
      const cell = dataGrid.getDataCell(0, 0);
      const cellEditor = cell.getEditor().element;
      const inputElement = Selector('#myinput');

      // act
      await t
        .click(cell.element);

      // assert
      await t
        .expect(cellEditor.exists)
        .ok('cell editor exists');

      // act
      await t
        .typeText(cellEditor, 'new text')
        .click(inputElement);

      // assert
      await t
        .expect(cellEditor.exists).notOk('cell editor is not rendered')
        .expect(inputElement.focused).ok('input is focused');
    }).before(async () => {
      await ClientFunction(() => {
        $('<input id="myinput">').prependTo('body');
      })();
      await createWidget('dxDataGrid', {
        dataSource: [{ id: 1, name: 'test' }],
        keyExpr: 'id',
        columns: ['name'],
        focusedRowKey: 1,
        focusedRowEnabled,
        editing: {
          mode: editMode.toLowerCase(),
          allowUpdating: true,
        },
      });
    }).after(() => ClientFunction(() => {
      $('#myinput').remove();
    })());
  });
});

test('Empty row should lose focus on Tab (T941246)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);
  const inputElement1 = Selector('#myinput1');
  const inputElement2 = Selector('#myinput2');

  // Tab
  // act
  await t
    .click(inputElement1);

  // assert
  await t
    .expect(inputElement1.focused)
    .ok('first editor is focused');

  // act
  await t
    .pressKey('tab');

  // assert
  await t
    .expect(headerCell.element.focused)
    .ok('header cell is focused');

  // act
  await t
    .pressKey('tab');

  // assert
  await t
    .expect(dataGrid.getRowsView().focused)
    .ok('rows view is focused');

  // act
  await t
    .pressKey('tab');

  // assert
  await t
    .expect(inputElement2.focused)
    .ok('second editor is focused');
  // end Tab

  // Shift+Tab
  // act
  await t
    .pressKey('shift+tab');

  // assert
  await t
    .expect(dataGrid.getRowsView().focused)
    .ok('rows view is focused');

  // act
  await t
    .pressKey('shift+tab');

  // assert
  await t
    .expect(headerCell.element.focused)
    .ok('header cell is focused');

  // act
  await t
    .pressKey('shift+tab');

  // assert
  await t
    .expect(inputElement1.focused)
    .ok('first editor is focused');
  // end Shift+Tab
}).before(async () => {
  await ClientFunction(() => {
    $('<input id="myinput1">').prependTo('body');
    $('<input id="myinput2">').appendTo('body');
  })();
  await createWidget('dxDataGrid', {
    dataSource: [],
    columns: ['id'],
  });
}).after(() => ClientFunction(() => {
  $('#myinput1').remove();
  $('#myinput2').remove();
})());
