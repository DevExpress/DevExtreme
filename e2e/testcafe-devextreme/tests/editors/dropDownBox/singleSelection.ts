import { Selector, ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { testScreenshot } from '../../../helpers/themeUtils';

const BUTTON_CLASS = 'dx-dropdowneditor-button';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

fixture.disablePageReloads`DropDownBox - Single Selection`
  .page(url(__dirname, '../../container.html'));

const treeProductsData = [
  { ID: 1, name: 'Stores', expanded: true },
  {
    ID: '1_1', categoryId: 1, name: 'Super Mart of the West', expanded: true,
  },
  { ID: '1_1_1', categoryId: '1_1', name: 'Video Players' },
  {
    ID: '1_1_1_1', categoryId: '1_1_1', name: 'HD Video Player', price: 220,
  },
  {
    ID: '1_1_1_2', categoryId: '1_1_1', name: 'SuperHD Video Player', price: 270,
  },
  { ID: '1_1_2', categoryId: '1_1', name: 'Televisions' },
  {
    ID: '1_1_2_1', categoryId: '1_1_2', name: 'SuperLCD 42', price: 1200,
  },
  {
    ID: '1_1_2_2', categoryId: '1_1_2', name: 'SuperLED 42', price: 1450,
  },
  {
    ID: '1_2', categoryId: 1, name: 'Braeburn', expanded: true,
  },
  { ID: '1_2_1', categoryId: '1_2', name: 'Video Players' },
  {
    ID: '1_2_1_1', categoryId: '1_2_1', name: 'HD Video Player', price: 240,
  },
];

const customersData = [
  {
    ID: 1, CompanyName: 'Premier Buy', City: 'Richfield', Phone: '(612) 291-1000',
  },
  {
    ID: 2, CompanyName: 'ElectrixMax', City: 'San Diego', Phone: '(619) 754-2000',
  },
  {
    ID: 3, CompanyName: 'Video Emporium', City: 'Sacramento', Phone: '(916) 741-3000',
  },
  {
    ID: 4, CompanyName: 'Screen Shop', City: 'Beaver Ruin', Phone: '(978) 879-4000',
  },
  {
    ID: 5, CompanyName: 'Braeburn', City: 'Los Angeles', Phone: '(310) 555-5000',
  },
];

const getTreeBoxValue = ClientFunction(() => ($('#treeBox') as any).dxDropDownBox('instance').option('value'));
const getGridBoxValue = ClientFunction(() => ($('#gridBox') as any).dxDropDownBox('instance').option('value'));

safeSizeTest('TreeView - should display initial selected item', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const treeBox = Selector('#treeBox');
  const input = treeBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

  await t
    .expect(input.value)
    .eql('Super Mart of the West');

  await testScreenshot(t, takeScreenshot, 'DropDownBox-single-selection-treeview-initial.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 700]).before(async () => createWidget('dxDropDownBox', {
  id: 'treeBox',
  value: '1_1',
  valueExpr: 'ID',
  displayExpr: 'name',
  placeholder: 'Select a value...',
  showClearButton: true,
  dataSource: treeProductsData,
  contentTemplate(e) {
    const value = e.component.option('value');
    const $treeView = ($('<div>') as any).dxTreeView({
      dataSource: treeProductsData,
      dataStructure: 'plain',
      keyExpr: 'ID',
      parentIdExpr: 'categoryId',
      selectionMode: 'single',
      displayExpr: 'name',
      selectByClick: true,
      selectedKeys: value ? [value] : [],
      selectNodesRecursive: false,
      onItemSelectionChanged(args) {
        const selectedKeys = args.component.getSelectedNodeKeys();
        const singleValue = selectedKeys.length > 0 ? selectedKeys[0] : null;
        e.component.option('value', singleValue);
      },
    });

    const treeView = $treeView.dxTreeView('instance');

    e.component.on('valueChanged', (args) => {
      if (!args.value) {
        treeView.unselectAll();
      } else {
        treeView.selectItem(args.value);
      }
      e.component.close();
    });

    return $treeView;
  },
}));

safeSizeTest('TreeView - should select item on click', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const treeBox = Selector('#treeBox');
  const input = treeBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
  const dropDownButton = treeBox.find(`.${BUTTON_CLASS}`);

  await t
    .click(dropDownButton)
    .wait(300);

  const treeViewItem = Selector('.dx-treeview-item').withText('Televisions');

  await t
    .click(treeViewItem)
    .wait(200);

  await testScreenshot(t, takeScreenshot, 'DropDownBox-single-selection-treeview-after-select.png');

  const value = await getTreeBoxValue();
  await t
    .expect(value)
    .eql('1_1_2')
    .expect(input.value)
    .eql('Televisions');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 700]).before(async () => createWidget('dxDropDownBox', {
  id: 'treeBox',
  value: '1_1',
  valueExpr: 'ID',
  displayExpr: 'name',
  placeholder: 'Select a value...',
  showClearButton: true,
  dataSource: treeProductsData,
  contentTemplate(e) {
    const value = e.component.option('value');
    const $treeView = ($('<div>') as any).dxTreeView({
      dataSource: treeProductsData,
      dataStructure: 'plain',
      keyExpr: 'ID',
      parentIdExpr: 'categoryId',
      selectionMode: 'single',
      displayExpr: 'name',
      selectByClick: true,
      selectedKeys: value ? [value] : [],
      selectNodesRecursive: false,
      onItemSelectionChanged(args) {
        const selectedKeys = args.component.getSelectedNodeKeys();
        const singleValue = selectedKeys.length > 0 ? selectedKeys[0] : null;
        e.component.option('value', singleValue);
      },
    });

    const treeView = $treeView.dxTreeView('instance');

    e.component.on('valueChanged', (args) => {
      if (!args.value) {
        treeView.unselectAll();
      } else {
        treeView.selectItem(args.value);
      }
      e.component.close();
    });

    return $treeView;
  },
}));

safeSizeTest('TreeView - should clear selection', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const treeBox = Selector('#treeBox');
  const input = treeBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
  const clearButton = treeBox.find('.dx-clear-button-area');

  await t
    .expect(input.value)
    .eql('Super Mart of the West')
    .click(clearButton)
    .wait(200);

  await testScreenshot(t, takeScreenshot, 'DropDownBox-single-selection-treeview-cleared.png');

  const value = await getTreeBoxValue();
  await t
    .expect(value)
    .eql(null)
    .expect(input.value)
    .eql('');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 700]).before(async () => createWidget('dxDropDownBox', {
  id: 'treeBox',
  value: '1_1',
  valueExpr: 'ID',
  displayExpr: 'name',
  placeholder: 'Select a value...',
  showClearButton: true,
  dataSource: treeProductsData,
  contentTemplate(e) {
    const value = e.component.option('value');
    const $treeView = ($('<div>') as any).dxTreeView({
      dataSource: treeProductsData,
      dataStructure: 'plain',
      keyExpr: 'ID',
      parentIdExpr: 'categoryId',
      selectionMode: 'single',
      displayExpr: 'name',
      selectByClick: true,
      selectedKeys: value ? [value] : [],
      selectNodesRecursive: false,
      onItemSelectionChanged(args) {
        const selectedKeys = args.component.getSelectedNodeKeys();
        const singleValue = selectedKeys.length > 0 ? selectedKeys[0] : null;
        e.component.option('value', singleValue);
      },
    });

    const treeView = $treeView.dxTreeView('instance');

    e.component.on('valueChanged', (args) => {
      if (!args.value) {
        treeView.unselectAll();
      } else {
        treeView.selectItem(args.value);
      }
      e.component.close();
    });

    return $treeView;
  },
}));

safeSizeTest('DataGrid - should display initial selected item', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const gridBox = Selector('#gridBox');
  const input = gridBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

  await t
    .expect(input.value)
    .eql('Video Emporium <(916) 741-3000>');

  await testScreenshot(t, takeScreenshot, 'DropDownBox-single-selection-datagrid-initial.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 700]).before(async () => createWidget('dxDropDownBox', {
  id: 'gridBox',
  value: 3,
  valueExpr: 'ID',
  deferRendering: false,
  placeholder: 'Select a value...',
  displayExpr(item) {
    return item && `${item.CompanyName} <${item.Phone}>`;
  },
  showClearButton: true,
  dataSource: customersData,
  contentTemplate(e) {
    const value = e.component.option('value');
    const $dataGrid = ($('<div>') as any).dxDataGrid({
      dataSource: customersData,
      columns: ['CompanyName', 'City', 'Phone'],
      hoverStateEnabled: true,
      paging: { enabled: true, pageSize: 10 },
      filterRow: { visible: true },
      scrolling: { mode: 'virtual' },
      selection: { mode: 'single' },
      selectedRowKeys: [value],
      height: '100%',
      showBorders: true,
      onSelectionChanged(selectedItems) {
        const keys = selectedItems.selectedRowKeys;
        const hasSelection = keys.length;
        e.component.option('value', hasSelection ? keys[0] : null);
      },
    });

    const dataGrid = $dataGrid.dxDataGrid('instance');

    e.component.on('valueChanged', (args) => {
      dataGrid.selectRows(args.value, false);
      e.component.close();
    });

    return $dataGrid;
  },
}));

safeSizeTest('DataGrid - should select row on click', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const gridBox = Selector('#gridBox');
  const input = gridBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
  const dropDownButton = gridBox.find(`.${BUTTON_CLASS}`);

  await t
    .click(dropDownButton)
    .wait(300);

  const dataRow = Selector('.dx-datagrid-rowsview .dx-data-row').nth(1);

  await t
    .click(dataRow)
    .wait(200);

  await testScreenshot(t, takeScreenshot, 'DropDownBox-single-selection-datagrid-after-select.png');

  const value = await getGridBoxValue();
  await t
    .expect(value)
    .eql(2)
    .expect(input.value)
    .eql('ElectrixMax <(619) 754-2000>');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 700]).before(async () => createWidget('dxDropDownBox', {
  id: 'gridBox',
  value: 3,
  valueExpr: 'ID',
  deferRendering: false,
  placeholder: 'Select a value...',
  displayExpr(item) {
    return item && `${item.CompanyName} <${item.Phone}>`;
  },
  showClearButton: true,
  dataSource: customersData,
  contentTemplate(e) {
    const value = e.component.option('value');
    const $dataGrid = ($('<div>') as any).dxDataGrid({
      dataSource: customersData,
      columns: ['CompanyName', 'City', 'Phone'],
      hoverStateEnabled: true,
      paging: { enabled: true, pageSize: 10 },
      filterRow: { visible: true },
      scrolling: { mode: 'virtual' },
      selection: { mode: 'single' },
      selectedRowKeys: [value],
      height: '100%',
      showBorders: true,
      onSelectionChanged(selectedItems) {
        const keys = selectedItems.selectedRowKeys;
        const hasSelection = keys.length;
        e.component.option('value', hasSelection ? keys[0] : null);
      },
    });

    const dataGrid = $dataGrid.dxDataGrid('instance');

    e.component.on('valueChanged', (args) => {
      dataGrid.selectRows(args.value, false);
      e.component.close();
    });

    return $dataGrid;
  },
}));

safeSizeTest('DataGrid - should clear selection', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const gridBox = Selector('#gridBox');
  const input = gridBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
  const clearButton = gridBox.find('.dx-clear-button-area');

  await t
    .expect(input.value)
    .eql('Video Emporium <(916) 741-3000>')
    .click(clearButton)
    .wait(200);

  await testScreenshot(t, takeScreenshot, 'DropDownBox-single-selection-datagrid-cleared.png');

  const value = await getGridBoxValue();
  await t
    .expect(value)
    .eql(null)
    .expect(input.value)
    .eql('');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 700]).before(async () => createWidget('dxDropDownBox', {
  id: 'gridBox',
  value: 3,
  valueExpr: 'ID',
  deferRendering: false,
  placeholder: 'Select a value...',
  displayExpr(item) {
    return item && `${item.CompanyName} <${item.Phone}>`;
  },
  showClearButton: true,
  dataSource: customersData,
  contentTemplate(e) {
    const value = e.component.option('value');
    const $dataGrid = ($('<div>') as any).dxDataGrid({
      dataSource: customersData,
      columns: ['CompanyName', 'City', 'Phone'],
      hoverStateEnabled: true,
      paging: { enabled: true, pageSize: 10 },
      filterRow: { visible: true },
      scrolling: { mode: 'virtual' },
      selection: { mode: 'single' },
      selectedRowKeys: [value],
      height: '100%',
      showBorders: true,
      onSelectionChanged(selectedItems) {
        const keys = selectedItems.selectedRowKeys;
        const hasSelection = keys.length;
        e.component.option('value', hasSelection ? keys[0] : null);
      },
    });

    const dataGrid = $dataGrid.dxDataGrid('instance');

    e.component.on('valueChanged', (args) => {
      dataGrid.selectRows(args.value, false);
      e.component.close();
    });

    return $dataGrid;
  },
}));

safeSizeTest('DataGrid - should filter rows correctly', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const gridBox = Selector('#gridBox');
  const dropDownButton = gridBox.find(`.${BUTTON_CLASS}`);

  await t
    .click(dropDownButton)
    .wait(300);

  const filterInput = Selector('.dx-datagrid-filter-row .dx-editor-cell').nth(0).find('input');

  await t
    .typeText(filterInput, 'Premier')
    .wait(500);

  await testScreenshot(t, takeScreenshot, 'DropDownBox-single-selection-datagrid-filtered.png');

  const visibleRows = Selector('.dx-datagrid-rowsview .dx-data-row');

  await t
    .expect(visibleRows.count)
    .eql(1);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 700]).before(async () => createWidget('dxDropDownBox', {
  id: 'gridBox',
  value: 3,
  valueExpr: 'ID',
  deferRendering: false,
  placeholder: 'Select a value...',
  displayExpr(item) {
    return item && `${item.CompanyName} <${item.Phone}>`;
  },
  showClearButton: true,
  dataSource: customersData,
  contentTemplate(e) {
    const value = e.component.option('value');
    const $dataGrid = ($('<div>') as any).dxDataGrid({
      dataSource: customersData,
      columns: ['CompanyName', 'City', 'Phone'],
      hoverStateEnabled: true,
      paging: { enabled: true, pageSize: 10 },
      filterRow: { visible: true },
      scrolling: { mode: 'virtual' },
      selection: { mode: 'single' },
      selectedRowKeys: [value],
      height: '100%',
      showBorders: true,
      onSelectionChanged(selectedItems) {
        const keys = selectedItems.selectedRowKeys;
        const hasSelection = keys.length;
        e.component.option('value', hasSelection ? keys[0] : null);
      },
    });

    const dataGrid = $dataGrid.dxDataGrid('instance');

    e.component.on('valueChanged', (args) => {
      dataGrid.selectRows(args.value, false);
      e.component.close();
    });

    return $dataGrid;
  },
}));
