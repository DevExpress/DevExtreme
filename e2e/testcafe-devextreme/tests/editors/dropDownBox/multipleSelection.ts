import { Selector, ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { testScreenshot } from '../../../helpers/themeUtils';

const BUTTON_CLASS = 'dx-dropdowneditor-button';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

fixture.disablePageReloads`DropDownBox - Multiple Selection`
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

safeSizeTest('TreeView - should display initial selected items', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const treeBox = Selector('#treeBox');
  const input = treeBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

  await t
    .expect(input.value)
    .eql('Super Mart of the West');

  await testScreenshot(t, takeScreenshot, 'DropDownBox-multiple-selection-treeview-initial.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 700]).before(async () => createWidget('dxDropDownBox', {
  id: 'treeBox',
  value: ['1_1'],
  valueExpr: 'ID',
  displayExpr: 'name',
  placeholder: 'Select a value...',
  showClearButton: true,
  dataSource: treeProductsData,
  contentTemplate(e) {
    const v = e.component.option('value');
    const $treeView = ($('<div>') as any).dxTreeView({
      dataSource: treeProductsData,
      dataStructure: 'plain',
      keyExpr: 'ID',
      parentIdExpr: 'categoryId',
      selectionMode: 'multiple',
      displayExpr: 'name',
      selectByClick: true,
      selectedKeys: v || [],
      selectNodesRecursive: false,
      showCheckBoxesMode: 'normal',
      onItemSelectionChanged(args) {
        const selectedKeys = args.component.getSelectedNodeKeys();
        e.component.option('value', selectedKeys);
      },
    });

    const treeView = $treeView.dxTreeView('instance');

    e.component.on('valueChanged', (args) => {
      const { value } = args;
      if (!value || value.length === 0) {
        treeView.unselectAll();
      } else {
        value.forEach((key) => {
          treeView.selectItem(key);
        });
      }
    });

    return $treeView;
  },
}));

safeSizeTest('TreeView - should select multiple items', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const treeBox = Selector('#treeBox');
  const dropDownButton = treeBox.find(`.${BUTTON_CLASS}`);

  await t
    .click(dropDownButton)
    .wait(300);

  const televisionsCheckbox = Selector('.dx-treeview-item').withText('Televisions').find('.dx-checkbox');
  const secondStoreCheckbox = Selector('.dx-treeview-item').withText('Braeburn').find('.dx-checkbox');

  await t
    .click(televisionsCheckbox)
    .wait(200)
    .click(secondStoreCheckbox)
    .wait(200);

  await testScreenshot(t, takeScreenshot, 'DropDownBox-multiple-selection-treeview-multiple-items.png');

  const value = await getTreeBoxValue();
  await t
    .expect(value.length)
    .eql(3)
    .expect(value)
    .contains('1_1')
    .expect(value)
    .contains('1_1_2')
    .expect(value)
    .contains('1_2');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 700]).before(async () => createWidget('dxDropDownBox', {
  id: 'treeBox',
  value: ['1_1'],
  valueExpr: 'ID',
  displayExpr: 'name',
  placeholder: 'Select a value...',
  showClearButton: true,
  dataSource: treeProductsData,
  contentTemplate(e) {
    const v = e.component.option('value');
    const $treeView = ($('<div>') as any).dxTreeView({
      dataSource: treeProductsData,
      dataStructure: 'plain',
      keyExpr: 'ID',
      parentIdExpr: 'categoryId',
      selectionMode: 'multiple',
      displayExpr: 'name',
      selectByClick: true,
      selectedKeys: v || [],
      selectNodesRecursive: false,
      showCheckBoxesMode: 'normal',
      onItemSelectionChanged(args) {
        const selectedKeys = args.component.getSelectedNodeKeys();
        e.component.option('value', selectedKeys);
      },
    });

    const treeView = $treeView.dxTreeView('instance');

    e.component.on('valueChanged', (args) => {
      const { value } = args;
      if (!value || value.length === 0) {
        treeView.unselectAll();
      } else {
        value.forEach((key) => {
          treeView.selectItem(key);
        });
      }
    });

    return $treeView;
  },
}));

safeSizeTest('TreeView - should deselect item', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const treeBox = Selector('#treeBox');
  const dropDownButton = treeBox.find(`.${BUTTON_CLASS}`);

  await t
    .click(dropDownButton)
    .wait(300);

  const superMartCheckbox = Selector('.dx-treeview-item').withText('Super Mart of the West').find('.dx-checkbox');

  await t
    .click(superMartCheckbox)
    .wait(200);

  await testScreenshot(t, takeScreenshot, 'DropDownBox-multiple-selection-treeview-deselect.png');

  const value = await getTreeBoxValue();
  await t
    .expect(value.length)
    .eql(1)
    .expect(value)
    .contains('1_2');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 700]).before(async () => createWidget('dxDropDownBox', {
  id: 'treeBox',
  value: ['1_1', '1_2'],
  valueExpr: 'ID',
  displayExpr: 'name',
  placeholder: 'Select a value...',
  showClearButton: true,
  dataSource: treeProductsData,
  contentTemplate(e) {
    const v = e.component.option('value');
    const $treeView = ($('<div>') as any).dxTreeView({
      dataSource: treeProductsData,
      dataStructure: 'plain',
      keyExpr: 'ID',
      parentIdExpr: 'categoryId',
      selectionMode: 'multiple',
      displayExpr: 'name',
      selectByClick: true,
      selectedKeys: v || [],
      selectNodesRecursive: false,
      showCheckBoxesMode: 'normal',
      onItemSelectionChanged(args) {
        const selectedKeys = args.component.getSelectedNodeKeys();
        e.component.option('value', selectedKeys);
      },
    });

    const treeView = $treeView.dxTreeView('instance');

    e.component.on('valueChanged', (args) => {
      const { value } = args;
      if (!value || value.length === 0) {
        treeView.unselectAll();
      } else {
        value.forEach((key) => {
          treeView.selectItem(key);
        });
      }
    });

    return $treeView;
  },
}));

safeSizeTest('TreeView - should clear all selections', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const treeBox = Selector('#treeBox');
  const input = treeBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
  const clearButton = treeBox.find('.dx-clear-button-area');

  await t
    .expect(input.value)
    .eql('Super Mart of the West, Braeburn')
    .click(clearButton)
    .wait(200);

  await testScreenshot(t, takeScreenshot, 'DropDownBox-multiple-selection-treeview-cleared.png');

  const value = await getTreeBoxValue();
  await t
    .expect(value.length)
    .eql(0)
    .expect(input.value)
    .eql('');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 700]).before(async () => createWidget('dxDropDownBox', {
  id: 'treeBox',
  value: ['1_1', '1_2'],
  valueExpr: 'ID',
  displayExpr: 'name',
  placeholder: 'Select a value...',
  showClearButton: true,
  dataSource: treeProductsData,
  contentTemplate(e) {
    const v = e.component.option('value');
    const $treeView = ($('<div>') as any).dxTreeView({
      dataSource: treeProductsData,
      dataStructure: 'plain',
      keyExpr: 'ID',
      parentIdExpr: 'categoryId',
      selectionMode: 'multiple',
      displayExpr: 'name',
      selectByClick: true,
      selectedKeys: v || [],
      selectNodesRecursive: false,
      showCheckBoxesMode: 'normal',
      onItemSelectionChanged(args) {
        const selectedKeys = args.component.getSelectedNodeKeys();
        e.component.option('value', selectedKeys);
      },
    });

    const treeView = $treeView.dxTreeView('instance');

    e.component.on('valueChanged', (args) => {
      const { value } = args;
      if (!value || value.length === 0) {
        treeView.unselectAll();
      } else {
        value.forEach((key) => {
          treeView.selectItem(key);
        });
      }
    });

    return $treeView;
  },
}));

safeSizeTest('DataGrid - should display initial selected items', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const gridBox = Selector('#gridBox');
  const input = gridBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

  await t
    .expect(input.value)
    .eql('Video Emporium');

  await testScreenshot(t, takeScreenshot, 'DropDownBox-multiple-selection-datagrid-initial.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 700]).before(async () => createWidget('dxDropDownBox', {
  id: 'gridBox',
  value: [3],
  valueExpr: 'ID',
  placeholder: 'Select a value...',
  displayExpr: 'CompanyName',
  showClearButton: true,
  dataSource: customersData,
  contentTemplate(e) {
    const v = e.component.option('value');
    const $dataGrid = ($('<div>') as any).dxDataGrid({
      dataSource: customersData,
      columns: ['CompanyName', 'City', 'Phone'],
      hoverStateEnabled: true,
      paging: { enabled: true, pageSize: 10 },
      filterRow: { visible: true },
      scrolling: { mode: 'virtual' },
      height: 345,
      selection: { mode: 'multiple' },
      selectedRowKeys: v || [],
      onSelectionChanged(selectedItems) {
        const keys = selectedItems.selectedRowKeys;
        e.component.option('value', keys);
      },
    });

    const dataGrid = $dataGrid.dxDataGrid('instance');

    e.component.on('valueChanged', (args) => {
      const { value } = args;
      dataGrid.selectRows(value, false);
    });

    return $dataGrid;
  },
}));

safeSizeTest('DataGrid - should select multiple rows', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const gridBox = Selector('#gridBox');
  const dropDownButton = gridBox.find(`.${BUTTON_CLASS}`);

  await t
    .click(dropDownButton)
    .wait(300);

  const firstRow = Selector('.dx-datagrid-rowsview .dx-data-row').nth(0);
  const secondRow = Selector('.dx-datagrid-rowsview .dx-data-row').nth(1);

  await t
    .click(firstRow.find('.dx-select-checkbox'))
    .wait(200)
    .click(secondRow.find('.dx-select-checkbox'))
    .wait(200);

  await testScreenshot(t, takeScreenshot, 'DropDownBox-multiple-selection-datagrid-multiple-rows.png');

  const value = await getGridBoxValue();
  await t
    .expect(value.length)
    .eql(3)
    .expect(value)
    .contains(1)
    .expect(value)
    .contains(2)
    .expect(value)
    .contains(3);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 700]).before(async () => createWidget('dxDropDownBox', {
  id: 'gridBox',
  value: [3],
  valueExpr: 'ID',
  placeholder: 'Select a value...',
  displayExpr: 'CompanyName',
  showClearButton: true,
  dataSource: customersData,
  contentTemplate(e) {
    const v = e.component.option('value');
    const $dataGrid = ($('<div>') as any).dxDataGrid({
      dataSource: customersData,
      columns: ['CompanyName', 'City', 'Phone'],
      hoverStateEnabled: true,
      paging: { enabled: true, pageSize: 10 },
      filterRow: { visible: true },
      scrolling: { mode: 'virtual' },
      height: 345,
      selection: { mode: 'multiple' },
      selectedRowKeys: v || [],
      onSelectionChanged(selectedItems) {
        const keys = selectedItems.selectedRowKeys;
        e.component.option('value', keys);
      },
    });

    const dataGrid = $dataGrid.dxDataGrid('instance');

    e.component.on('valueChanged', (args) => {
      const { value } = args;
      dataGrid.selectRows(value, false);
    });

    return $dataGrid;
  },
}));

safeSizeTest('DataGrid - should deselect row', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const gridBox = Selector('#gridBox');
  const dropDownButton = gridBox.find(`.${BUTTON_CLASS}`);

  await t
    .click(dropDownButton)
    .wait(300);

  const firstRow = Selector('.dx-datagrid-rowsview .dx-data-row').nth(0);

  await t
    .click(firstRow.find('.dx-select-checkbox'))
    .wait(200);

  await testScreenshot(t, takeScreenshot, 'DropDownBox-multiple-selection-datagrid-deselect.png');

  const value = await getGridBoxValue();
  await t
    .expect(value.length)
    .eql(1)
    .expect(value)
    .contains(3);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 700]).before(async () => createWidget('dxDropDownBox', {
  id: 'gridBox',
  value: [1, 3],
  valueExpr: 'ID',
  placeholder: 'Select a value...',
  displayExpr: 'CompanyName',
  showClearButton: true,
  dataSource: customersData,
  contentTemplate(e) {
    const v = e.component.option('value');
    const $dataGrid = ($('<div>') as any).dxDataGrid({
      dataSource: customersData,
      columns: ['CompanyName', 'City', 'Phone'],
      hoverStateEnabled: true,
      paging: { enabled: true, pageSize: 10 },
      filterRow: { visible: true },
      scrolling: { mode: 'virtual' },
      height: 345,
      selection: { mode: 'multiple' },
      selectedRowKeys: v || [],
      onSelectionChanged(selectedItems) {
        const keys = selectedItems.selectedRowKeys;
        e.component.option('value', keys);
      },
    });

    const dataGrid = $dataGrid.dxDataGrid('instance');

    e.component.on('valueChanged', (args) => {
      const { value } = args;
      dataGrid.selectRows(value, false);
    });

    return $dataGrid;
  },
}));

safeSizeTest('DataGrid - should clear all selections', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const gridBox = Selector('#gridBox');
  const input = gridBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
  const clearButton = gridBox.find('.dx-clear-button-area');

  await t
    .expect(input.value)
    .eql('Premier Buy, Video Emporium')
    .click(clearButton)
    .wait(200);

  await testScreenshot(t, takeScreenshot, 'DropDownBox-multiple-selection-datagrid-cleared.png');

  const value = await getGridBoxValue();
  await t
    .expect(value.length)
    .eql(0)
    .expect(input.value)
    .eql('');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 700]).before(async () => createWidget('dxDropDownBox', {
  id: 'gridBox',
  value: [1, 3],
  valueExpr: 'ID',
  placeholder: 'Select a value...',
  displayExpr: 'CompanyName',
  showClearButton: true,
  dataSource: customersData,
  contentTemplate(e) {
    const v = e.component.option('value');
    const $dataGrid = ($('<div>') as any).dxDataGrid({
      dataSource: customersData,
      columns: ['CompanyName', 'City', 'Phone'],
      hoverStateEnabled: true,
      paging: { enabled: true, pageSize: 10 },
      filterRow: { visible: true },
      scrolling: { mode: 'virtual' },
      height: 345,
      selection: { mode: 'multiple' },
      selectedRowKeys: v || [],
      onSelectionChanged(selectedItems) {
        const keys = selectedItems.selectedRowKeys;
        e.component.option('value', keys);
      },
    });

    const dataGrid = $dataGrid.dxDataGrid('instance');

    e.component.on('valueChanged', (args) => {
      const { value } = args;
      dataGrid.selectRows(value, false);
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

  const filterInput = Selector('.dx-datagrid-filter-row .dx-editor-cell').nth(1).find('input');

  await t
    .typeText(filterInput, 'San Diego')
    .wait(500);

  await testScreenshot(t, takeScreenshot, 'DropDownBox-multiple-selection-datagrid-filtered.png');

  const visibleRows = Selector('.dx-datagrid-rowsview .dx-data-row');

  await t
    .expect(visibleRows.count)
    .eql(1);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 700]).before(async () => createWidget('dxDropDownBox', {
  id: 'gridBox',
  value: [3],
  valueExpr: 'ID',
  placeholder: 'Select a value...',
  displayExpr: 'CompanyName',
  showClearButton: true,
  dataSource: customersData,
  contentTemplate(e) {
    const v = e.component.option('value');
    const $dataGrid = ($('<div>') as any).dxDataGrid({
      dataSource: customersData,
      columns: ['CompanyName', 'City', 'Phone'],
      hoverStateEnabled: true,
      paging: { enabled: true, pageSize: 10 },
      filterRow: { visible: true },
      scrolling: { mode: 'virtual' },
      height: 345,
      selection: { mode: 'multiple' },
      selectedRowKeys: v || [],
      onSelectionChanged(selectedItems) {
        const keys = selectedItems.selectedRowKeys;
        e.component.option('value', keys);
      },
    });

    const dataGrid = $dataGrid.dxDataGrid('instance');

    e.component.on('valueChanged', (args) => {
      const { value } = args;
      dataGrid.selectRows(value, false);
    });

    return $dataGrid;
  },
}));
