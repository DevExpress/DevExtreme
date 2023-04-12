import { Selector, ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import DataGrid from '../../../model/dataGrid';
import CommandCell from '../../../model/dataGrid/commandCell';
import { ClassNames } from '../../../model/dataGrid/classNames';

const CLASS = ClassNames;

fixture.disablePageReloads`Keyboard Navigation - common`
  .page(url(__dirname, '../../container.html'));

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
}).before(async () => createWidget('dxDataGrid', {
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
  loadingTimeout: null,
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
}).before(async () => createWidget('dxDataGrid', {
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
}).before(async () => createWidget('dxDataGrid', {
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
  const commandCell = dataGrid.getDataCell(1, 3);
  const dataCell = dataGrid.getDataCell(1, 0);
  const getTextArea = (): Selector => dataCell.element.find('.text-area-1');

  await t
    // act, assert
    .click(commandCell.getLinkEdit())
    .expect(dataCell.isEditCell).ok()
    .expect(getTextArea().exists)
    .ok()
    .expect(getTextArea().focused)
    .ok();
}).before(async () => createWidget('dxDataGrid', {
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
      editCellTemplate: (cell): any => $(cell).append($('<textarea class="text-area-1" />')),
    },
    {
      dataField: 'phone',
      editCellTemplate: (cell): any => $(cell).append($('<textarea class="text-area-2" />')),
    },
    {
      dataField: 'room',
      editCellTemplate: (cell): any => $(cell).append($('<textarea />')),
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
    .expect(filterRow.getFilterCell(1).getEditorInput().element.focused)
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
    .expect(filterRow.getFilterCell(2).getEditorInput().element.focused)
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
    .notOk()
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
    .notOk()
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
    .expect(filterRow.getFilterCell(2).getEditorInput().element.focused)
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
    .expect(filterRow.getFilterCell(1).getEditorInput().element.focused)
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
    .expect(filterRow.getFilterCell(0).getEditorInput().element.focused)
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
    .expect(filterRow.getFilterCell(0).getEditorInput().element.focused)
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
}).before(async () => createWidget('dxDataGrid', {
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
}).before(async () => createWidget('dxDataGrid', {
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
}).before(async () => createWidget('dxDataGrid', {
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
}).before(async () => createWidget('dxDataGrid', {
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
}).before(async () => createWidget('dxDataGrid', {
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
}).before(async () => createWidget('dxDataGrid', {
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
  }).before(async () => createWidget('dxDataGrid', {
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
  }).before(async () => createWidget('dxDataGrid', {
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
  }).before(async () => createWidget('dxDataGrid', {
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
  }).before(async () => createWidget('dxDataGrid', {
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
}).before(async () => {
  const generateData = (rowCount, columnCount): Record<string, unknown>[] => {
    const items: Record<string, unknown>[] = [];

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

test.skip('Vertical moving by keydown if scrolling.mode: virtual, scrolling.rowRenderingMode: virtual', async (t) => {
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
}).before(async () => {
  const generateData = (rowCount, columnCount): Record<string, unknown>[] => {
    const items: Record<string, unknown>[] = [];

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
  }).before(async () => {
    const generateData = (rowCount, columnCount): Record<string, unknown>[] => {
      const items: Record<string, unknown>[] = [];

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
        useNative: false,
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
        const cell = columnIndex <= 2 || columnIndex >= 16
          ? dataGrid.getFixedDataCell(rowIndex, columnIndex)
          : dataGrid.getDataCell(rowIndex, columnIndex);

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
        const cell = columnIndex <= 2 || columnIndex >= 16
          ? dataGrid.getFixedDataCell(rowIndex, columnIndex)
          : dataGrid.getDataCell(rowIndex, columnIndex);

        await t.expect(cell.isFocused).ok(`Cell[${rowIndex}, ${columnIndex}] is in focused`);

        if (rowIndex === 0 && columnIndex === 0) {
          break;
        }

        await t.pressKey('shift+tab');
      }
    }
  }
}).before(async () => {
  const generateData = (rowCount, columnCount): Record<string, unknown>[] => {
    const items: Record<string, unknown>[] = [];

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
      useNative: false,
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
        const cell = columnIndex <= 2 || columnIndex >= 16
          ? dataGrid.getFixedDataCell(rowIndex, columnIndex)
          : dataGrid.getDataCell(rowIndex, columnIndex);

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
        const cell = columnIndex <= 2 || columnIndex >= 16
          ? dataGrid.getFixedDataCell(rowIndex, columnIndex)
          : dataGrid.getDataCell(rowIndex, columnIndex);

        await t.expect(cell.isFocused).ok(`Cell[${rowIndex}, ${columnIndex}] is in focused`);

        if (rowIndex === 0 && columnIndex === 0) {
          break;
        }

        await t.pressKey('shift+tab');
      }
    }
  }
}).before(async () => {
  const generateData = (rowCount, columnCount): Record<string, unknown>[] => {
    const items: Record<string, unknown>[] = [];

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
      useNative: false,
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
    }).after(async () => {
      await ClientFunction(() => {
        $('#myinput').remove();
      })();
    });
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
}).after(async () => {
  await ClientFunction(() => {
    $('#myinput1').remove();
    $('#myinput2').remove();
  })();
});

[false, true].forEach((isCommandColumnFixed) => {
  test(`The first cell should be focused on pressing the tab key after clicking on the document when command column is ${isCommandColumnFixed ? 'fixed' : 'unfixed'} and on the left side (T951849)`, async (t) => {
    const dataGrid = new DataGrid('#container');
    const headers = dataGrid.getHeaders();
    const dataGridOffsetBottom = await dataGrid.element.getBoundingClientRectProperty('bottom');

    async function checkNavigationOfAllCells(): Promise<void> {
      await t
        .click(headers.getHeaderRow(0).getHeaderCell(1).element)
        .expect(headers.getHeaderRow(0).getHeaderCell(1).element.focused)
        .ok()
        .pressKey('tab')
        .expect(headers.getHeaderRow(0).getHeaderCell(2).element.focused)
        .ok()
        .pressKey('tab');

      const $commandCell: CommandCell = isCommandColumnFixed
        ? dataGrid.getFixedDataRow(0).getCommandCell(0)
        : dataGrid.getDataRow(0).getCommandCell(0);
      let $buttonElement = $commandCell.getButton(0);

      await t
        .expect($commandCell.element.focused)
        .ok()
        .pressKey('tab')
        .expect($buttonElement.focused)
        .ok()
        .pressKey('tab')
        .expect(dataGrid.getDataCell(0, 1).element.focused)
        .ok()
        .pressKey('tab')
        .expect(dataGrid.getDataCell(0, 2).element.focused)
        .ok()
        .pressKey('tab');

      $buttonElement = isCommandColumnFixed
        ? dataGrid.getFixedDataRow(1).getCommandCell(0).getButton(0)
        : dataGrid.getDataRow(1).getCommandCell(0).getButton(0);

      await t
        .expect($buttonElement.focused)
        .ok()
        .pressKey('tab')
        .expect(dataGrid.getDataCell(1, 1).element.focused)
        .ok()
        .pressKey('tab')
        .expect(dataGrid.getDataCell(1, 2).element.focused)
        .ok();
    }

    await checkNavigationOfAllCells();

    await t
      .pressKey('tab')
      .expect(dataGrid.getDataCell(1, 2).element.focused)
      .notOk()
      .click(Selector('body'), {
        offsetY: dataGridOffsetBottom + 10,
      });

    await checkNavigationOfAllCells();
  }).before(async () => {
    await createWidget('dxDataGrid', {
      dataSource: [
        { name: 'Alex', c0: 'c0_0' },
        { name: 'Ben', c0: 'c0_1' },
      ],
      keyExpr: 'name',
      columns: [{ type: 'buttons', fixed: isCommandColumnFixed, fixedPosition: 'left' }, 'name', 'c0'],
      editing: {
        mode: 'row',
        allowUpdating: true,
        useIcons: true,
      },
      sorting: {
        mode: 'none',
      },
    });
  });

  test(`The cell focus should be restored on pressing shift and tab keys when command column is ${isCommandColumnFixed ? 'fixed' : 'unfixed'} and on the left side (T951849)`, async (t) => {
    const dataGrid = new DataGrid('#container');
    const headers = dataGrid.getHeaders();

    async function checkNavigationOfAllCells(): Promise<void> {
      await t
        .click(headers.getHeaderRow(0).getHeaderCell(1).element)
        .expect(headers.getHeaderRow(0).getHeaderCell(1).element.focused)
        .ok()
        .pressKey('tab')
        .expect(headers.getHeaderRow(0).getHeaderCell(2).element.focused)
        .ok()
        .pressKey('tab');

      const $commandCell: CommandCell = isCommandColumnFixed
        ? dataGrid.getFixedDataRow(0).getCommandCell(0)
        : dataGrid.getDataRow(0).getCommandCell(0);
      let $buttonElement: Selector = $commandCell.getButton(0);

      await t
        .expect($commandCell.element.focused)
        .ok()
        .pressKey('tab')
        .expect($buttonElement.focused)
        .ok()
        .pressKey('tab')
        .expect(dataGrid.getDataCell(0, 1).element.focused)
        .ok()
        .pressKey('tab')
        .expect(dataGrid.getDataCell(0, 2).element.focused)
        .ok()
        .pressKey('tab');

      $buttonElement = isCommandColumnFixed
        ? dataGrid.getFixedDataRow(1).getCommandCell(0).getButton(0)
        : dataGrid.getDataRow(1).getCommandCell(0).getButton(0);

      await t
        .expect($buttonElement.focused)
        .ok()
        .pressKey('tab')
        .expect(dataGrid.getDataCell(1, 1).element.focused)
        .ok()
        .pressKey('tab')
        .expect(dataGrid.getDataCell(1, 2).element.focused)
        .ok();
    }

    await checkNavigationOfAllCells();

    await t
      .pressKey('tab')
      .expect(dataGrid.getDataCell(1, 2).element.focused)
      .notOk()
      .pressKey('shift+tab')
      .expect(dataGrid.getDataCell(1, 2).element.focused)
      .ok();
  }).before(async () => {
    await createWidget('dxDataGrid', {
      dataSource: [
        { name: 'Alex', c0: 'c0_0' },
        { name: 'Ben', c0: 'c0_1' },
      ],
      keyExpr: 'name',
      columns: [{ type: 'buttons', fixed: isCommandColumnFixed, fixedPosition: 'left' }, 'name', 'c0'],
      editing: {
        mode: 'row',
        allowUpdating: true,
        useIcons: true,
      },
      sorting: {
        mode: 'none',
      },
    });
  });

  test(`The first cell should be focused on pressing the tab key after clicking on the document when command column is ${isCommandColumnFixed ? 'fixed' : 'unfixed'} and on the right side (T951849)`, async (t) => {
    const dataGrid = new DataGrid('#container');
    const headers = dataGrid.getHeaders();
    const dataGridOffsetBottom = await dataGrid.element.getBoundingClientRectProperty('bottom');

    async function checkNavigationOfAllCells(): Promise<void> {
      await t
        .click(headers.getHeaderRow(0).getHeaderCell(0).element)
        .expect(headers.getHeaderRow(0).getHeaderCell(0).element.focused)
        .ok()
        .pressKey('tab')
        .expect(headers.getHeaderRow(0).getHeaderCell(1).element.focused)
        .ok()
        .pressKey('tab')
        .expect(dataGrid.getDataCell(0, 0).element.focused)
        .ok()
        .pressKey('tab')
        .expect(dataGrid.getDataCell(0, 1).element.focused)
        .ok()
        .pressKey('tab');

      let $buttonElement = isCommandColumnFixed
        ? dataGrid.getFixedDataRow(0).getCommandCell(2).getButton(0)
        : dataGrid.getDataRow(0).getCommandCell(2).getButton(0);

      await t
        .expect($buttonElement.focused)
        .ok()
        .pressKey('tab')
        .expect(dataGrid.getDataCell(1, 0).element.focused)
        .ok()
        .pressKey('tab')
        .expect(dataGrid.getDataCell(1, 1).element.focused)
        .ok()
        .pressKey('tab');

      $buttonElement = isCommandColumnFixed
        ? dataGrid.getFixedDataRow(1).getCommandCell(2).getButton(0)
        : dataGrid.getDataRow(1).getCommandCell(2).getButton(0);

      await t
        .expect($buttonElement.focused)
        .ok();
    }

    await checkNavigationOfAllCells();

    await t
      .pressKey('tab');

    const $buttonElement = isCommandColumnFixed
      ? dataGrid.getFixedDataRow(1).getCommandCell(2).getButton(0)
      : dataGrid.getDataRow(1).getCommandCell(2).getButton(0);

    await t
      .expect($buttonElement.focused)
      .notOk()
      .click(Selector('body'), {
        offsetY: dataGridOffsetBottom + 10,
      });

    await checkNavigationOfAllCells();
  }).before(async () => {
    await createWidget('dxDataGrid', {
      dataSource: [
        { name: 'Alex', c0: 'c0_0' },
        { name: 'Ben', c0: 'c0_1' },
      ],
      keyExpr: 'name',
      columns: ['name', 'c0', { type: 'buttons', fixed: isCommandColumnFixed, fixedPosition: 'right' }],
      editing: {
        mode: 'row',
        allowUpdating: true,
        useIcons: true,
      },
      sorting: {
        mode: 'none',
      },
    });
  });

  test(`The first cell should be focused on pressing shift and tab keys after clicking on the document when command column is ${isCommandColumnFixed ? 'fixed' : 'unfixed'} and on the right side (T951849)`, async (t) => {
    const dataGrid = new DataGrid('#container');
    const headers = dataGrid.getHeaders();
    const dataGridOffsetBottom = await dataGrid.element.getBoundingClientRectProperty('bottom');

    async function checkNavigationOfAllCells(): Promise<void> {
      await t
        .click(headers.getHeaderRow(0).getHeaderCell(0).element)
        .expect(headers.getHeaderRow(0).getHeaderCell(0).element.focused)
        .ok()
        .pressKey('tab')
        .expect(headers.getHeaderRow(0).getHeaderCell(1).element.focused)
        .ok()
        .pressKey('tab')
        .expect(dataGrid.getDataCell(0, 0).element.focused)
        .ok()
        .pressKey('tab')
        .expect(dataGrid.getDataCell(0, 1).element.focused)
        .ok()
        .pressKey('tab');

      const $buttonElement = isCommandColumnFixed
        ? dataGrid.getFixedDataRow(0).getCommandCell(2).getButton(0)
        : dataGrid.getDataRow(0).getCommandCell(2).getButton(0);

      await t
        .expect($buttonElement.focused)
        .ok()
        .pressKey('tab')
        .expect(dataGrid.getDataCell(1, 0).element.focused)
        .ok()
        .pressKey('tab')
        .expect(dataGrid.getDataCell(1, 1).element.focused)
        .ok();
    }

    await checkNavigationOfAllCells();

    await t
      .click(Selector('body'), {
        offsetY: dataGridOffsetBottom + 10,
      })
      .pressKey('shift+tab')
      .expect(dataGrid.getDataCell(0, 0).element.focused)
      .ok();
  }).before(async () => {
    await createWidget('dxDataGrid', {
      dataSource: [
        { name: 'Alex', c0: 'c0_0' },
        { name: 'Ben', c0: 'c0_1' },
      ],
      keyExpr: 'name',
      columns: ['name', 'c0', { type: 'buttons', fixed: isCommandColumnFixed, fixedPosition: 'right' }],
      editing: {
        mode: 'row',
        allowUpdating: true,
        useIcons: true,
      },
      sorting: {
        mode: 'none',
      },
    });
  });

  test(`The cell focus should be restored on pressing shift and tab keys when command column is ${isCommandColumnFixed ? 'fixed' : 'unfixed'} and on the right side (T951849)`, async (t) => {
    const dataGrid = new DataGrid('#container');
    const headers = dataGrid.getHeaders();

    async function checkNavigationOfAllCells(): Promise<void> {
      await t
        .click(headers.getHeaderRow(0).getHeaderCell(0).element)
        .expect(headers.getHeaderRow(0).getHeaderCell(0).element.focused)
        .ok()
        .pressKey('tab')
        .expect(headers.getHeaderRow(0).getHeaderCell(1).element.focused)
        .ok()
        .pressKey('tab')
        .expect(dataGrid.getDataCell(0, 0).element.focused)
        .ok()
        .pressKey('tab')
        .expect(dataGrid.getDataCell(0, 1).element.focused)
        .ok()
        .pressKey('tab');

      let $buttonElement = isCommandColumnFixed
        ? dataGrid.getFixedDataRow(0).getCommandCell(2).getButton(0)
        : dataGrid.getDataRow(0).getCommandCell(2).getButton(0);

      await t
        .expect($buttonElement.focused)
        .ok()
        .pressKey('tab')
        .expect(dataGrid.getDataCell(1, 0).element.focused)
        .ok()
        .pressKey('tab')
        .expect(dataGrid.getDataCell(1, 1).element.focused)
        .ok()
        .pressKey('tab');

      $buttonElement = isCommandColumnFixed
        ? dataGrid.getFixedDataRow(1).getCommandCell(2).getButton(0)
        : dataGrid.getDataRow(1).getCommandCell(2).getButton(0);

      await t
        .expect($buttonElement.focused)
        .ok();
    }

    await checkNavigationOfAllCells();

    await t
      .pressKey('tab');

    const $buttonElement = isCommandColumnFixed
      ? dataGrid.getFixedDataRow(1).getCommandCell(2).getButton(0)
      : dataGrid.getDataRow(1).getCommandCell(2).getButton(0);

    await t
      .expect($buttonElement.focused)
      .notOk()
      .pressKey('shift+tab')
      .expect($buttonElement.focused)
      .ok()
      .pressKey('shift+tab')
      .expect(dataGrid.getDataCell(1, 1).element.focused)
      .ok();
  }).before(async () => {
    await createWidget('dxDataGrid', {
      dataSource: [
        { name: 'Alex', c0: 'c0_0' },
        { name: 'Ben', c0: 'c0_1' },
      ],
      keyExpr: 'name',
      columns: ['name', 'c0', { type: 'buttons', fixed: isCommandColumnFixed, fixedPosition: 'right' }],
      editing: {
        mode: 'row',
        allowUpdating: true,
        useIcons: true,
      },
      sorting: {
        mode: 'none',
      },
    });
  });
});

test('Grid should get focus when the focus method is called (T955678)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const button = Selector('#mycontainer');

  // act
  await t
    .click(button);

  // assert
  await t
    .expect(dataGrid.getDataRow(0).element.focused)
    .ok()
    .expect(dataGrid.getDataRow(0).isFocusedRow)
    .ok();

  // act
  await t
    .pressKey('down');

  // assert
  await t
    .expect(dataGrid.getDataRow(1).element.focused)
    .ok()
    .expect(dataGrid.getDataRow(1).isFocusedRow)
    .ok();

  // act
  await t
    .pressKey('up');

  // assert
  await t
    .expect(dataGrid.getDataRow(0).element.focused)
    .ok()
    .expect(dataGrid.getDataRow(0).isFocusedRow)
    .ok();

  // act
  await t
    .click(Selector('body'), {
      offsetY: 20,
      offsetX: 200,
    })
    .click(button)
    .pressKey('right');

  // assert
  await t
    .expect(dataGrid.getDataRow(0).isFocusedRow)
    .ok()
    .expect(dataGrid.getDataCell(0, 1).element.focused)
    .ok()
    .expect(dataGrid.getDataCell(0, 1).isFocused)
    .ok();

  // act
  await t
    .click(Selector('body'), {
      offsetY: 20,
      offsetX: 200,
    })
    .click(button);

  // assert
  await t
    .expect(dataGrid.getDataRow(0).element.focused)
    .ok()
    .expect(dataGrid.getDataRow(0).isFocusedRow)
    .ok();

  // act
  await t
    .pressKey('down');

  // assert
  await t
    .expect(dataGrid.getDataRow(1).element.focused)
    .ok()
    .expect(dataGrid.getDataRow(1).isFocusedRow)
    .ok();
}).before(async () => {
  await ClientFunction(() => {
    $('<div id="mycontainer">').prependTo('body');
  })();
  await createWidget('dxButton', {
    text: 'Focus',
    onClick() {
      ($('#container') as any).dxDataGrid('instance').focus();
    },
  }, '#mycontainer');
  await createWidget('dxDataGrid', {
    dataSource: [{ id: 1, name: 'test1' }, { id: 2, name: 'test2' }],
    keyExpr: 'id',
    focusedRowEnabled: true,
  });
}).after(async () => {
  await ClientFunction(() => {
    $('#mycontainer').remove();
  })();
});

test('New mode. A cell should be focused when the PageDow/Up key is pressed (T898324)', async (t) => {
  const dataGrid = new DataGrid('#container');

  // act
  await t
    .click(dataGrid.getDataCell(0, 0).element);

  // assert
  await t
    .expect(dataGrid.getDataCell(0, 0).isFocused)
    .ok()
    .expect(dataGrid.option('focusedRowIndex'))
    .eql(0)
    .expect(dataGrid.option('focusedColumnIndex'))
    .eql(0);

  // act
  await t
    .pressKey('pagedown');

  // assert
  await t
    .expect(dataGrid.getDataCell(8, 0).isFocused)
    .ok()
    .expect(dataGrid.option('focusedRowIndex'))
    .eql(8)
    .expect(dataGrid.option('focusedColumnIndex'))
    .eql(0);

  // act
  await t
    .pressKey('pageup');

  // assert
  await t
    .expect(dataGrid.getDataCell(0, 0).isFocused)
    .ok()
    .expect(dataGrid.option('focusedRowIndex'))
    .eql(0)
    .expect(dataGrid.option('focusedColumnIndex'))
    .eql(0);
}).before(async () => {
  const getData = (): Record<string, unknown>[] => {
    const items: Record<string, unknown>[] = [];
    for (let i = 0; i < 100; i += 1) {
      items.push({
        ID: i + 1,
        Name: `Name ${i + 1}`,
        Description: `Description ${i + 1}`,
      });
    }
    return items;
  };
  await createWidget('dxDataGrid', {
    dataSource: getData(),
    keyExpr: 'ID',
    remoteOperations: true,
    height: 300,
    scrolling: {
      mode: 'virtual',
      legacyMode: false,
    },
    columns: ['Name', 'Description'],
    onFocusedCellChanging(e) {
      e.isHighlighted = true;
    },
  });
});

['Row', 'Cell', 'Batch'].forEach((editMode) => {
  [false, true].forEach((repaintChangesOnly) => {
    test(`${editMode} - Focus next cell using tab after adding row if some another row is focused and repaintChangesOnly is ${repaintChangesOnly} (T1004913, T1036685)`, async (t) => {
      const dataGrid = new DataGrid('#container');

      const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();
      const cell00 = dataGrid.getDataCell(0, 0);
      const editor00 = cell00.getEditor();
      const cell01 = dataGrid.getDataCell(0, 1);
      const editor01 = cell01.getEditor();

      await t
        .click(addRowButton)

        .expect(cell00.isFocused)
        .ok()
        .expect(editor00.element.focused)
        .ok()

        .pressKey('tab')

        .expect(cell01.isFocused)
        .ok()
        .expect(editor01.element.focused)
        .ok();
    }).before(async () => createWidget('dxDataGrid', {
      dataSource: [{ ID: 1, FirstName: 'John' }],
      keyExpr: 'ID',
      repaintChangesOnly,
      editing: {
        mode: editMode.toLowerCase(),
        allowUpdating: true,
        allowAdding: true,
      },
      focusedRowEnabled: true,
      focusedRowKey: 1,
      columns: ['ID', 'FirstName'],
    }));
  });
});

test('All rows should be focused on arrow-up/down when virtual scrolling enabled with group summary (T1014612)', async (t) => {
  const dataGrid = new DataGrid('#container');

  // act (forward)
  await t
    .pressKey('tab');

  // assert
  await t
    .expect(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1).element.focused)
    .ok();

  // act
  await t
    .pressKey('tab');

  // assert
  await t
    .expect(dataGrid.getGroupRow(0).element.focused)
    .ok()
    .expect(dataGrid.getGroupRow(0).isFocused)
    .ok();

  // act
  await t
    .pressKey('down');

  // assert
  await t
    .expect(dataGrid.getDataCell(1, 1).element.focused)
    .ok()
    .expect(dataGrid.getDataCell(1, 1).isFocused)
    .ok();

  // act
  await t
    .pressKey('down');

  // assert
  await t
    .expect(dataGrid.getGroupRow(1).element.focused)
    .ok()
    .expect(dataGrid.getGroupRow(1).isFocused)
    .ok();

  // act
  await t
    .pressKey('down');

  // assert
  await t
    .expect(dataGrid.getDataCell(4, 1).element.focused)
    .ok()
    .expect(dataGrid.getDataCell(4, 1).isFocused)
    .ok();

  // act (backward)
  await t
    .pressKey('up');

  // assert
  await t
    .expect(dataGrid.getGroupRow(1).element.focused)
    .ok()
    .expect(dataGrid.getGroupRow(1).isFocused)
    .ok();

  // act
  await t
    .pressKey('up');

  // assert
  await t
    .expect(dataGrid.getDataCell(1, 1).element.focused)
    .ok()
    .expect(dataGrid.getDataCell(1, 1).isFocused)
    .ok();

  // act
  await t
    .pressKey('up');

  // assert
  await t
    .expect(dataGrid.getGroupRow(0).element.focused)
    .ok()
    .expect(dataGrid.getGroupRow(0).isFocused)
    .ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'test1' },
    { id: 2, name: 'test2' },
  ],
  keyExpr: 'id',
  grouping: {
    autoExpandAll: true,
  },
  scrolling: {
    mode: 'virtual',
  },
  summary: {
    groupItems: [{
      column: 'id',
      summaryType: 'count',
      showInGroupFooter: true,
    }],
  },
  columns: ['id', {
    dataField: 'name',
    groupIndex: 0,
  }],
}));

test('Cells should be focused after saving data when filter is applied and cell mode is used (T1029906)', async (t) => {
  const dataGrid = new DataGrid('#container');

  // act
  await t
    .click(dataGrid.getDataCell(0, 0).element);

  // assert
  await t
    .expect(dataGrid.getDataCell(0, 0).isFocused)
    .ok()
    .expect(dataGrid.getDataCell(0, 0).getEditor().element.exists)
    .ok();

  // act
  await t
    .pressKey('esc');

  // assert
  await t
    .expect(dataGrid.getDataCell(0, 0).isFocused)
    .ok()
    .expect(dataGrid.getDataCell(0, 0).getEditor().element.exists)
    .notOk();

  // act
  await t
    .pressKey('down');

  // assert
  await t
    .expect(dataGrid.getDataCell(1, 0).isFocused)
    .ok();

  // act
  await t
    .pressKey('d')
    .pressKey('enter');

  const visibleRows = await dataGrid.apiGetVisibleRows();

  // assert
  await t
    .expect(visibleRows.length)
    .eql(4)
    .expect(dataGrid.getDataCell(2, 0).isFocused)
    .ok();

  // act
  await t
    .pressKey('down');

  // assert
  await t
    .expect(dataGrid.getDataCell(3, 0).isFocused)
    .ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'aaa' },
    { id: 2, name: 'aba' },
    { id: 3, name: 'baa' },
    { id: 4, name: 'bca' },
    { id: 5, name: 'acd' },
  ],
  keyExpr: 'id',
  columns: [{
    dataField: 'name',
    filterValue: 'a',
  }],
  filterRow: {
    visible: true,
    applyFilter: 'auto',
  },
  keyboardNavigation: {
    enterKeyAction: 'moveFocus',
    enterKeyDirection: 'column',
    editOnKeyPress: true,
  },

  editing: {
    mode: 'cell',
    allowUpdating: true,
  },
  onFocusedCellChanging(e) {
    e.isHighlighted = true;
  },
}));

test('Lookup editor should update cell value on down or up key when cell is focused by tab or shift+tab (T1036028)', async (t) => {
  const dataGrid = new DataGrid('#container');

  // act
  await t
    .click(dataGrid.getDataRow(0).getCommandCell(3).getButton(0));

  // assert
  await t
    .expect(dataGrid.getDataRow(0).isEdited)
    .ok()
    .expect(dataGrid.getDataCell(0, 0).isFocused)
    .ok();

  // act
  await t
    .pressKey('tab');

  // assert
  await t
    .expect(dataGrid.getDataCell(0, 1).isFocused)
    .ok()
    .expect(dataGrid.apiGetCellValue(0, 1))
    .eql('1');

  // act
  await t
    .pressKey('down');

  // assert
  await t
    .expect(dataGrid.apiGetCellValue(0, 1))
    .eql('2');

  // act
  await t
    .pressKey('tab');

  // assert
  await t
    .expect(dataGrid.getDataCell(0, 2).isFocused)
    .ok();

  // act
  await t
    .pressKey('shift+tab');

  // assert
  await t
    .expect(dataGrid.getDataCell(0, 1).isFocused)
    .ok()
    .expect(dataGrid.apiGetCellValue(0, 1))
    .eql('2');

  // act
  await t
    .pressKey('up');

  // assert
  await t
    .expect(dataGrid.apiGetCellValue(0, 1))
    .eql('1');
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    {
      id: 1, field1: 'a', field2: '1', field3: 'b',
    },
  ],
  keyExpr: 'id',
  columns: ['field1',
    {
      dataField: 'field2',
      lookup: {
        dataSource: [
          { id: '1' },
          { id: '2' },
        ],
        displayExpr: 'id',
        valueExpr: 'id',
      },
    },
    'field3'],
  editing: {
    mode: 'row',
    allowUpdating: true,
  },
}));

[false, true].forEach((repaintChangesOnly) => {
  test(`Editor in the filter row should not lose focus when groups are expanded after the filtering (repaintChangesOnly is ${repaintChangesOnly}) (T1038332)`, async (t) => {
    const dataGrid = new DataGrid('#container');
    const filterRowCell = dataGrid.getHeaders().getFilterRow().getFilterCell(1);
    const filterRowEditor = filterRowCell.getEditorInput();

    // act
    await t
      .click(filterRowEditor.element);

    // assert
    await t
      .expect(filterRowEditor.element.focused)
      .ok()
      .expect(filterRowCell.isFocused)
      .ok();

    // act
    await t
      .typeText(filterRowEditor.element, 'Name')
      .wait(1000);

    let visibleRows = await dataGrid.apiGetVisibleRows();

    // assert
    await t
      .expect(visibleRows.length)
      .eql(5)
      .expect(filterRowEditor.element.focused)
      .ok()
      .expect(filterRowCell.isFocused)
      .ok();

    // act
    await t
      .typeText(filterRowEditor.element, '_1')
      .wait(1000);

    visibleRows = await dataGrid.apiGetVisibleRows();

    // assert
    await t
      .expect(visibleRows.length)
      .eql(2)
      .expect(filterRowEditor.element.focused)
      .ok()
      .expect(filterRowCell.isFocused)
      .ok();
  }).before(async () => createWidget('dxDataGrid', {
    dataSource: [
      {
        ID: 1,
        Name: 'Name_1',
        Category: 'Category_1',
      },
      {
        ID: 2,
        Name: 'Name_2',
        Category: 'Category_1',
      },
      {
        ID: 3,
        Name: 'Name_3',
        Category: 'Category_2',
      },
    ],
    keyExpr: 'ID',
    repaintChangesOnly,
    filterRow: {
      visible: true,
    },
    grouping: {
      autoExpandAll: false,
    },
    onContentReady(e) {
      if (e.component.getCombinedFilter()) {
        if (e.component.myAllExpand) {
          e.component.myAllExpand = false;
          return;
        }
        e.component.myAllExpand = true;
        e.component.expandAll(0);
      }
    },
    columns: [
      'Name',
      {
        dataField: 'Category',
        groupIndex: 0,
      },
    ],
  }));
});

test('Checkbox value is changed properly on tab when the batch editing mode and focused row are enabled (T1059412)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();

  // act
  await t
    .click(addRowButton);

  // assert
  await t
    .expect(dataGrid.getDataRow(0).isInserted)
    .ok();

  // act
  await t
    .click(dataGrid.getDataCell(0, 0).element.nth(1));

  // assert
  await t
    .expect(dataGrid.getDataRow(0).element.nth(1).hasClass('dx-row-focused'))
    .ok();

  // act
  await t
    .pressKey('up');

  // assert
  await t
    .expect(dataGrid.getDataCell(0, 0).isFocused)
    .ok();

  // act
  await t
    .pressKey('right');

  // assert
  await t
    .expect(dataGrid.getDataCell(0, 1).isFocused)
    .ok();

  // act
  await t
    .pressKey('space');

  // assert
  await t
    .expect(dataGrid.apiGetCellValue(0, 1))
    .ok()
    .expect(dataGrid.getDataCell(0, 1).isFocused)
    .ok()
    .expect(dataGrid.getDataCell(0, 1).isModified)
    .ok();

  // act
  await t
    .pressKey('space');

  // assert
  await t
    .expect(dataGrid.apiGetCellValue(0, 1))
    .notOk()
    .expect(dataGrid.getDataCell(0, 1).isFocused)
    .ok()
    .expect(dataGrid.getDataCell(0, 1).isModified)
    .ok();

  // act
  await t
    .pressKey('space');

  // assert
  await t
    .expect(dataGrid.apiGetCellValue(0, 1))
    .ok()
    .expect(dataGrid.getDataCell(0, 1).isFocused)
    .ok()
    .expect(dataGrid.getDataCell(0, 1).isModified)
    .ok();
}).before(async () => createWidget('dxDataGrid', {
  keyExpr: 'id',
  columns: [
    {
      dataField: 'id',
      allowEditing: false,
    },
    {
      dataField: 'checked',
      dataType: 'boolean',
    },
  ],
  dataSource: [
    {
      id: 1,
      checked: false,
    },
  ],
  editing: {
    allowAdding: true,
    allowUpdating: true,
    mode: 'batch',
  },
  focusedRowEnabled: true,
  keyboardNavigation: {
    editOnKeyPress: true,
  },
}));

test('The last cell should be focused after changing the page size (T1063530)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const pager = dataGrid.getPager();

  // act
  for (let i = 0; i < 3; i += 1) {
    await t.pressKey('tab');
  }

  // assert
  await t
    .expect(dataGrid.getDataCell(0, 0).isFocused)
    .ok();

  // act
  await t
    .pressKey('tab');

  // assert
  await t
    .expect(dataGrid.getDataCell(0, 1).isFocused)
    .ok();

  // act
  await t
    .pressKey('tab');

  // assert
  await t
    .expect(dataGrid.getDataCell(1, 0).isFocused)
    .ok();

  // act
  await t
    .pressKey('tab');

  // assert
  await t
    .expect(dataGrid.getDataCell(1, 1).isFocused)
    .ok();

  // act
  await t
    .pressKey('tab');

  // assert
  await t
    .expect(pager.getPageSize(0).element.focused)
    .ok();

  // act
  await t
    .pressKey('space');
  const visibleRows = await dataGrid.apiGetVisibleRows();

  // assert
  await t
    .expect(visibleRows.length)
    .eql(1);

  // act
  await t
    .pressKey('shift+tab');

  // assert
  await t
    .expect(dataGrid.getDataCell(0, 1).isFocused)
    .ok();
}).before(async () => {
  const getItems = (): Record<string, unknown>[] => {
    const items: Record<string, unknown>[] = [];
    for (let i = 0; i < 5; i += 1) {
      items.push({
        ID: i + 1,
        Name: `Name ${i + 1}`,
      });
    }
    return items;
  };
  return createWidget('dxDataGrid', {
    dataSource: getItems(),
    keyExpr: 'ID',
    columnWidth: 150,
    paging: {
      pageSize: 2,
    },
    pager: {
      visible: true,
      allowedPageSizes: [1, 2],
      showPageSizeSelector: true,
    },
  });
});

test('The last cell should be focused after changing the page size when scrolling.columnRenderingMode is virtual (T1063530)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const pager = dataGrid.getPager();

  // act
  await t
    .click(dataGrid.getDataCell(0, 0).element);

  // assert
  await t
    .expect(dataGrid.getDataCell(0, 0).hasHiddenFocusState)
    .ok();

  // navigate trough the first row
  for (let i = 0; i < 6; i += 1) {
    // act
    await t
      .pressKey('tab');

    // assert
    await t
      .expect(dataGrid.getDataCell(0, i + 1).isFocused)
      .ok();
  }

  // navigate trough the second row
  for (let i = 0; i < 7; i += 1) {
    // act
    await t
      .pressKey('tab');

    // assert
    await t
      .expect(dataGrid.getDataCell(1, i).isFocused)
      .ok();
  }

  // act
  await t
    .pressKey('tab');

  // assert
  await t
    .expect(pager.getPageSize(0).element.focused)
    .ok();

  // act
  await t
    .pressKey('space');
  const visibleRows = await dataGrid.apiGetVisibleRows();

  // assert
  await t
    .expect(visibleRows.length)
    .eql(1);

  // act
  await t
    .pressKey('shift+tab');

  // assert
  await t
    .expect(dataGrid.getDataCell(0, 6).isFocused)
    .ok();
}).before(async () => {
  const getItems = (): Record<string, unknown>[] => {
    const items: Record<string, unknown>[] = [];
    for (let i = 0; i < 5; i += 1) {
      const item = {
        id: i + 1,
      };

      for (let j = 1; j < 7; j += 1) {
        item[`field${j + 1}`] = `Field_${i + 1}_${j + 1}`;
      }
      items.push(item);
    }
    return items;
  };
  return createWidget('dxDataGrid', {
    dataSource: getItems(),
    keyExpr: 'id',
    width: 450,
    columnWidth: 150,
    paging: {
      pageSize: 2,
    },
    scrolling: {
      columnRenderingMode: 'virtual',
    },
    pager: {
      visible: true,
      allowedPageSizes: [1, 2],
      showPageSizeSelector: true,
    },
  });
});

test('The last cell should be focused after changing the page size when scrolling.columnRenderingMode is virtual and fixed columns are enabled (T1063530)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const pager = dataGrid.getPager();

  // act
  await t
    .click(dataGrid.getFixedDataCell(0, 0).element);

  // assert
  await t
    .expect(dataGrid.getFixedDataCell(0, 0).hasHiddenFocusState)
    .ok();

  // navigate trough the first row
  for (let i = 0; i < 6; i += 1) {
    // act
    await t
      .pressKey('tab');

    const dataCell = i < 5 ? dataGrid.getDataCell(0, i + 1) : dataGrid.getFixedDataCell(0, i + 1);

    // assert
    await t
      .expect(dataCell.isFocused)
      .ok();
  }

  // navigate trough the second row
  for (let i = 0; i < 7; i += 1) {
    // act
    await t
      .pressKey('tab');

    const dataCell = i === 0 || i === 6 ? dataGrid.getFixedDataCell(1, i)
      : dataGrid.getDataCell(1, i);

    // assert
    await t
      .expect(dataCell.isFocused)
      .ok();
  }

  // act
  await t
    .pressKey('tab');

  // assert
  await t
    .expect(pager.getPageSize(0).element.focused)
    .ok();

  // act
  await t
    .pressKey('space');
  const visibleRows = await dataGrid.apiGetVisibleRows();

  // assert
  await t
    .expect(visibleRows.length)
    .eql(1);

  // act
  await t
    .pressKey('shift+tab');

  // assert
  await t
    .expect(dataGrid.getFixedDataCell(0, 6).isFocused)
    .ok();
}).before(async () => {
  const getItems = (): Record<string, unknown>[] => {
    const items: Record<string, unknown>[] = [];
    for (let i = 0; i < 5; i += 1) {
      const item = {
        id: i + 1,
      };

      for (let j = 1; j < 7; j += 1) {
        item[`field${j + 1}`] = `Field_${i + 1}_${j + 1}`;
      }
      items.push(item);
    }
    return items;
  };
  return createWidget('dxDataGrid', {
    dataSource: getItems(),
    keyExpr: 'id',
    width: 450,
    columnWidth: 150,
    customizeColumns(columns) {
      columns[0].fixed = true;
      columns[6].fixed = true;
      columns[6].fixedPosition = 'right';
    },
    paging: {
      pageSize: 2,
    },
    scrolling: {
      columnRenderingMode: 'virtual',
    },
    pager: {
      visible: true,
      allowedPageSizes: [1, 2],
      showPageSizeSelector: true,
    },
  });
});

test('Window should not be scrolled after clicking on freespace row (T1104035)', async (t) => {
  const getWindowScrollTop = ClientFunction(() => window.pageYOffset);

  await t
    .expect(getWindowScrollTop())
    .eql(0);

  await ClientFunction(() => { $(`.${CLASS.freeSpaceRow} td`).trigger('click'); }, { dependencies: { CLASS } })();

  await t
    .expect(getWindowScrollTop())
    .eql(0);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{ id: 1 }, { id: 2 }],
  keyExpr: 'id',
  height: 1500,
}));

test('edit => scroll => command, should not result in grid scrolling back to edit', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t.wait(100);
  await ClientFunction(() => {
    const grid = ($('#container') as any).dxDataGrid('instance');
    setTimeout(() => {
      grid.getCellElement(1, 1).trigger('dxclick');
      setTimeout(() => {
        grid.getScrollable().scrollTo({ x: 10000 });
        setTimeout(
          () => { $('.dx-link-delete').first().trigger('focusin'); },
          100,
        );
      }, 100);
    }, 500);
  })();

  await t.wait(1000)
    .expect(dataGrid.getScrollLeft())
    .notEql(0);
}).before(async () => createWidget('dxDataGrid', {
  editing: {
    mode: 'cell',
    allowUpdating: true,
    allowDeleting: true,
  },
  width: 900,
  scrolling: {
    useNative: false,
  },
  dataSource: [
    {
      ID: 1, Prefix: '1', FirstName: '1', LastName: '1', StateID: '1', BirthDate: '1',
    }, {
      ID: 2, Prefix: '2', FirstName: '2', LastName: '2', StateID: '2', BirthDate: '2',
    },
  ],
  columns: [
    {
      dataField: 'Prefix',
      caption: 'Title',
      width: 200,
    },
    { dataField: 'FirstName', width: 200 },
    { dataField: 'LastName', width: 200 }, {
      dataField: 'Position',
      width: 200,
    }, {
      dataField: 'StateID',
      caption: 'State',
      width: 200,

    }, {
      dataField: 'BirthDate',
      dataType: 'date',
      width: 200,
    },
  ],
}));

test('Navigation shouldn\'t get stuck on cell templates with links in them when navigating from outside the grid (T1123129)', async (t) => {
  const getFocusedElement = () => Selector(':focus').nth(0);

  let focusedElement: Selector | null = null;

  const tabFromOutside = async () => {
    await t.click(Selector('.dx-page-size').nth(0));
    await t.pressKey('shift+tab');
    focusedElement = Selector(':focus');
    await t.pressKey('shift+tab');
  };

  await tabFromOutside();

  await t.expect(focusedElement === getFocusedElement())
    .notOk();

  await tabFromOutside();

  await t.expect(focusedElement === getFocusedElement())
    .notOk();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: {
    store: {
      type: 'array',
      data: [
        { name: 'Alex', phone: '555555' },
        { name: 'Dan', phone: '553355' },
      ],
      key: 'name',
    },
    paginate: true,
  },
  keyExpr: 'name',
  columns: ['name', {
    cellTemplate: (cellElement) => $(cellElement).append('<a  href=\'#\' >Link</a>'),
  }, 'phone'],
  pager: {
    visible: true,
    allowedPageSizes: [1, 2],
    showPageSizeSelector: true,
  },
}));

// T1134231
test('Adaptive - Adaptive cells should be focused by tab key press', async (t) => {
  const dataGrid = new DataGrid('#container');
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);
  const firstDataRow = dataGrid.getDataRow(0);
  const secondDataRow = dataGrid.getDataRow(1);
  const adaptiveDetailRow = dataGrid.getAdaptiveRow(0);

  await dataGrid.apiExpandAdaptiveDetailRow('Alex');

  await t
    .expect(adaptiveDetailRow.element.exists)
    .ok();

  // header row
  await t
    // first cell
    .pressKey('tab')
    .expect(headerRow.getHeaderCell(0).element.focused)
    .ok()
    .expect(headerRow.getHeaderCell(0).element.hasAttribute('tabindex'))
    .ok()

    // second cell
    .expect(headerRow.getHeaderCell(1).isHidden)
    .ok()
    .expect(headerRow.getHeaderCell(1).element.hasAttribute('tabindex'))
    .notOk('the second header cell does not have tabindex')

    // third cell
    .expect(headerRow.getHeaderCell(2).isHidden)
    .ok()
    .expect(headerRow.getHeaderCell(2).element.hasAttribute('tabindex'))
    .notOk('the third header cell does not have tabindex')

    // fourth cell
    .pressKey('tab')
    .expect(headerRow.getHeaderCell(3).element.focused)
    .ok()
    .expect(headerRow.getHeaderCell(3).element.hasAttribute('tabindex'))
    .ok()

    // first data row
    // first cell
    .pressKey('tab')
    .expect(firstDataRow.getDataCell(0).isFocused)
    .ok()
    .expect(firstDataRow.getDataCell(0).element.focused)
    .ok()

    // second cell
    .expect(firstDataRow.getDataCell(1).isHidden)
    .ok()
    .expect(firstDataRow.getDataCell(1).element.getAttribute('tabindex'))
    .eql('-1', 'the second data cell does not have tabindex')

    // third cell
    .expect(firstDataRow.getDataCell(2).isHidden)
    .ok()
    .expect(firstDataRow.getDataCell(2).element.getAttribute('tabindex'))
    .eql('-1', 'the third data cell does not have tabindex')

    // fourth cell
    .pressKey('tab')
    .expect(firstDataRow.getDataCell(3).isFocused)
    .ok()
    .expect(firstDataRow.getDataCell(3).element.focused)
    .ok()

    // fifth cell
    .pressKey('tab')
    .expect(firstDataRow.getCommandCell(4).isFocused)
    .ok()
    .expect(firstDataRow.getCommandCell(4).element.focused)
    .ok()

    // adaptive detail row
    // first item
    .pressKey('tab')
    .expect(adaptiveDetailRow.getAdaptiveCell(0).isFocused)
    .ok()
    .expect(adaptiveDetailRow.getAdaptiveCell(0).element.focused)
    .ok()

    // second item
    .pressKey('tab')
    .expect(adaptiveDetailRow.getAdaptiveCell(1).isFocused)
    .ok()
    .expect(adaptiveDetailRow.getAdaptiveCell(1).element.focused)
    .ok()

    // second data row
    // first cell
    .pressKey('tab')
    .expect(secondDataRow.getDataCell(0).isFocused)
    .ok()
    .expect(secondDataRow.getDataCell(0).element.focused)
    .ok()
    // second cell
    .pressKey('tab')
    .expect(secondDataRow.getDataCell(3).isFocused)
    .ok()
    .expect(secondDataRow.getDataCell(3).element.focused)
    .ok()
    // first cell
    .pressKey('shift+tab')
    .expect(secondDataRow.getDataCell(0).isFocused)
    .ok()
    .expect(secondDataRow.getDataCell(0).element.focused)
    .ok()

    // adaptive detail row
    // second item
    .pressKey('shift+tab')
    .expect(adaptiveDetailRow.getAdaptiveCell(1).isFocused)
    .ok()
    .expect(adaptiveDetailRow.getAdaptiveCell(1).element.focused)
    .ok()

    // first item
    .pressKey('shift+tab')
    .expect(adaptiveDetailRow.getAdaptiveCell(0).isFocused)
    .ok()
    .expect(adaptiveDetailRow.getAdaptiveCell(0).element.focused)
    .ok()

    // first data row
    // fifth cell
    .pressKey('shift+tab')
    .expect(firstDataRow.getCommandCell(4).isFocused)
    .ok()
    .expect(firstDataRow.getCommandCell(4).element.focused)
    .ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    keyExpr: 'name',
    dataSource: [
      {
        name: 'Alex', phone: '555555', text: 'aaaaaa', room: 1,
      },
      {
        name: 'Bob', phone: '777777', text: 'bbbbbb', room: 2,
      },
    ],
    width: 150,
    columnHidingEnabled: true,
    columns: [
      'name',
      {
        dataField: 'phone',
        hidingPriority: 0,
      }, {
        dataField: 'text',
        hidingPriority: 1,
      },
      'room',
    ],
  });
});

test('Adaptive with batch edit mode - Adaptive cells should not go into edit state by tab key press', async (t) => {
  const dataGrid = new DataGrid('#container');
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);
  const firstDataRow = dataGrid.getDataRow(0);
  const secondDataRow = dataGrid.getDataRow(1);
  const adaptiveDetailRow = dataGrid.getAdaptiveRow(0);

  await dataGrid.apiExpandAdaptiveDetailRow('Alex');

  await t
    .expect(adaptiveDetailRow.element.exists)
    .ok();

  // header row
  await t
    // first cell
    .pressKey('tab')
    .expect(headerRow.getHeaderCell(0).element.focused)
    .ok()
    .expect(headerRow.getHeaderCell(0).element.hasAttribute('tabindex'))
    .ok()

    // second cell
    .expect(headerRow.getHeaderCell(1).isHidden)
    .ok()
    .expect(headerRow.getHeaderCell(1).element.hasAttribute('tabindex'))
    .notOk('the second header cell does not have tabindex')

    // third cell
    .expect(headerRow.getHeaderCell(2).isHidden)
    .ok()
    .expect(headerRow.getHeaderCell(2).element.hasAttribute('tabindex'))
    .notOk('the third header cell does not have tabindex')

    // fourth cell
    .pressKey('tab')
    .expect(headerRow.getHeaderCell(3).element.focused)
    .ok()
    .expect(headerRow.getHeaderCell(3).element.hasAttribute('tabindex'))
    .ok()

    // first data row
    // first cell
    .pressKey('tab')
    .expect(firstDataRow.getDataCell(0).isFocused)
    .ok()
    .expect(firstDataRow.getDataCell(0).element.focused)
    .ok()

    // second cell
    .expect(firstDataRow.getDataCell(1).isHidden)
    .ok()
    .expect(firstDataRow.getDataCell(1).element.getAttribute('tabindex'))
    .eql('-1', 'the second data cell does not have tabindex')

    // third cell
    .expect(firstDataRow.getDataCell(2).isHidden)
    .ok()
    .expect(firstDataRow.getDataCell(2).element.getAttribute('tabindex'))
    .eql('-1', 'the third data cell does not have tabindex')

    // fourth cell
    .pressKey('tab')
    .expect(firstDataRow.getDataCell(3).isFocused)
    .ok()
    .expect(firstDataRow.getDataCell(3).element.focused)
    .ok()

    // fifth cell
    .pressKey('tab')
    .expect(firstDataRow.getCommandCell(4).isFocused)
    .ok()
    .expect(firstDataRow.getCommandCell(4).element.focused)
    .ok()

    // adaptive detail row
    // first item
    .pressKey('tab')
    .expect(adaptiveDetailRow.getAdaptiveCell(0).isFocused)
    .ok()
    .expect(adaptiveDetailRow.getAdaptiveCell(0).element.focused)
    .ok()

    // second item
    .pressKey('tab')
    .expect(adaptiveDetailRow.getAdaptiveCell(1).isFocused)
    .ok()
    .expect(adaptiveDetailRow.getAdaptiveCell(1).element.focused)
    .ok()

    // second data row
    // first cell
    .pressKey('tab')
    .expect(secondDataRow.getDataCell(0).isFocused)
    .ok()
    .expect(secondDataRow.getDataCell(0).element.focused)
    .ok()
    // second cell
    .pressKey('tab')
    .expect(secondDataRow.getDataCell(3).isFocused)
    .ok()
    .expect(secondDataRow.getDataCell(3).element.focused)
    .ok()
    // first cell
    .pressKey('shift+tab')
    .expect(secondDataRow.getDataCell(0).isFocused)
    .ok()
    .expect(secondDataRow.getDataCell(0).element.focused)
    .ok()

    // adaptive detail row
    // second item
    .pressKey('shift+tab')
    .expect(adaptiveDetailRow.getAdaptiveCell(1).isFocused)
    .ok()
    .expect(adaptiveDetailRow.getAdaptiveCell(1).element.focused)
    .ok()

    // first item
    .pressKey('shift+tab')
    .expect(adaptiveDetailRow.getAdaptiveCell(0).isFocused)
    .ok()
    .expect(adaptiveDetailRow.getAdaptiveCell(0).element.focused)
    .ok()

    // first data row
    // fifth cell
    .pressKey('shift+tab')
    .expect(firstDataRow.getCommandCell(4).isFocused)
    .ok()
    .expect(firstDataRow.getCommandCell(4).element.focused)
    .ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    keyExpr: 'name',
    dataSource: [
      {
        name: 'Alex', phone: '555555', text: 'aaaaaa', room: 1,
      },
      {
        name: 'Bob', phone: '777777', text: 'bbbbbb', room: 2,
      },
    ],
    editing: {
      mode: 'batch',
      allowUpdating: true,
    },
    width: 150,
    columnHidingEnabled: true,
    columns: [
      'name',
      {
        dataField: 'phone',
        hidingPriority: 0,
      }, {
        dataField: 'text',
        hidingPriority: 1,
      },
      'room',
    ],
  });
});

test('Adaptive with batch edit mode - Adaptive cells should be focused by tab key press when they are in edit state', async (t) => {
  const dataGrid = new DataGrid('#container');
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);
  const firstDataRow = dataGrid.getDataRow(0);
  const secondDataRow = dataGrid.getDataRow(2);
  const adaptiveDetailRow = dataGrid.getAdaptiveRow(0);

  await dataGrid.apiExpandAdaptiveDetailRow('Alex');

  await t
    .expect(adaptiveDetailRow.element.exists)
    .ok();

  // header row
  await t
    // first cell
    .pressKey('tab')
    .expect(headerRow.getHeaderCell(0).element.focused).ok()
    .expect(headerRow.getHeaderCell(0).element.hasAttribute('tabindex'))
    .ok()

    // second cell
    .expect(headerRow.getHeaderCell(1).isHidden)
    .ok()
    .expect(headerRow.getHeaderCell(1).element.hasAttribute('tabindex'))
    .notOk('the second header cell does not have tabindex')

    // third cell
    .expect(headerRow.getHeaderCell(2).isHidden)
    .ok()
    .expect(headerRow.getHeaderCell(2).element.hasAttribute('tabindex'))
    .notOk('the third header cell does not have tabindex')

    // fourth cell
    .pressKey('tab')
    .expect(headerRow.getHeaderCell(3).element.focused)
    .ok()
    .expect(headerRow.getHeaderCell(3).element.hasAttribute('tabindex'))
    .ok()

    // first data row
    // first cell
    .pressKey('tab')
    .expect(firstDataRow.getDataCell(0).isFocused)
    .ok()
    .expect(firstDataRow.getDataCell(0).element.focused)
    .ok()

    .click(firstDataRow.getDataCell(0).element)
    .expect(firstDataRow.getDataCell(0).isEditCell)
    .ok()

    // second cell
    .expect(firstDataRow.getDataCell(1).isHidden)
    .ok()
    .expect(firstDataRow.getDataCell(1).element.hasAttribute('tabindex'))
    .notOk('the second data cell does not have tabindex')

    // third cell
    .expect(firstDataRow.getDataCell(2).isHidden)
    .ok()
    .expect(firstDataRow.getDataCell(2).element.hasAttribute('tabindex'))
    .notOk('the third data cell does not have tabindex')

    // fourth cell
    .pressKey('tab')
    .expect(firstDataRow.getDataCell(3).isFocused)
    .ok()
    .expect(firstDataRow.getDataCell(3).isEditCell)
    .ok()

    // adaptive detail row
    // first item
    .pressKey('tab')
    .expect(adaptiveDetailRow.getAdaptiveCell(0).isFocused)
    .ok()
    .expect(adaptiveDetailRow.getAdaptiveCell(0).isEditCell)
    .ok()

    // second item
    .pressKey('tab')
    .expect(adaptiveDetailRow.getAdaptiveCell(1).isFocused)
    .ok()
    .expect(adaptiveDetailRow.getAdaptiveCell(1).isEditCell)
    .ok()

    // second data row
    // first cell
    .pressKey('tab')
    .expect(secondDataRow.getDataCell(0).isFocused)
    .ok()
    .expect(secondDataRow.getDataCell(0).isEditCell)
    .ok()
    // second cell
    .pressKey('tab')
    .expect(secondDataRow.getDataCell(3).isFocused)
    .ok()
    .expect(secondDataRow.getDataCell(3).isEditCell)
    .ok()
    // first cell
    .pressKey('shift+tab')
    .expect(secondDataRow.getDataCell(0).isFocused)
    .ok()
    .expect(secondDataRow.getDataCell(0).isEditCell)
    .ok()

    // adaptive detail row
    // second item
    .pressKey('shift+tab')
    .expect(adaptiveDetailRow.getAdaptiveCell(1).isFocused)
    .ok()
    .expect(adaptiveDetailRow.getAdaptiveCell(1).isEditCell)
    .ok()

    // first item
    .pressKey('shift+tab')
    .expect(adaptiveDetailRow.getAdaptiveCell(0).isFocused)
    .ok()
    .expect(adaptiveDetailRow.getAdaptiveCell(0).isEditCell)
    .ok()

    // first data row
    // fifth cell
    .pressKey('shift+tab')
    .expect(firstDataRow.getDataCell(3).isFocused)
    .ok()
    .expect(firstDataRow.getDataCell(3).isEditCell)
    .ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    keyExpr: 'name',
    dataSource: [
      {
        name: 'Alex', phone: '555555', text: 'aaaaaa', room: 1,
      },
      {
        name: 'Bob', phone: '777777', text: 'bbbbbb', room: 2,
      },
    ],
    editing: {
      mode: 'batch',
      allowUpdating: true,
    },
    width: 150,
    columnHidingEnabled: true,
    columns: [
      'name',
      {
        dataField: 'phone',
        hidingPriority: 0,
      }, {
        dataField: 'text',
        hidingPriority: 1,
      },
      'room',
    ],
  });
});
