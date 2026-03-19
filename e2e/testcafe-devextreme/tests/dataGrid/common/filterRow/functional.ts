import DataGrid from 'devextreme-testcafe-models/dataGrid';
import TextBox from 'devextreme-testcafe-models/textBox';
import SelectBox from 'devextreme-testcafe-models/selectBox';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { getData } from '../../helpers/generateDataSourceData';

fixture`FilterRow`
  .page(url(__dirname, '../../../container.html'));

test('Filter should reset if the filter row editor text is cleared (T1257261)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const filterEditor = dataGrid.getFilterEditor(1, TextBox);
  const filterPanelText = dataGrid.getFilterPanel().getFilterText();

  await t
  // assert
    .expect(filterPanelText.element.textContent)
    .eql('[Text] Equals \'i\'')
  // act
    .click(filterEditor.input)
    .pressKey('backspace')
    .wait(100) // updateValueTimeout
  // assert
    .expect(filterPanelText.element.textContent)
    .eql('Create Filter')
  // act
    .click(dataGrid.element)
  // assert
    .expect(filterPanelText.element.textContent)
    .eql('Create Filter');
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { ID: 1, Text: 'Item 1' },
    { ID: 2, Text: '' },
    { ID: 3, Text: 'Item 3' },
  ],
  keyExpr: 'ID',
  showBorders: true,
  remoteOperations: true,
  headerFilter: { visible: true },
  filterRow: { visible: true },
  filterPanel: { visible: true },
  filterValue: ['Text', '=', 'i'],
  columns: ['ID', {
    dataField: 'Text',
    selectedFilterOperation: '=',
  }],
  onEditorPreparing(e: any) {
    e.updateValueTimeout = 100;
  },
}));

// T1267481
test('Filter Row\'s Reset button does not work after a custom filter is set in Filter Builder', async (t) => {
  const dataGrid = new DataGrid('#container');
  const filterCell = dataGrid.getFilterCell(0);

  await dataGrid.isReady();

  await t
    .expect(dataGrid.dataRows.count)
    .eql(0);

  await t
    .click(filterCell.menuButton)
    .click(filterCell.menu.getItemByText('Reset'));

  await t
    .expect(dataGrid.dataRows.count)
    .notEql(0);
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: getData(20, 1),
    height: 400,
    showBorders: true,
    filterRow: {
      visible: true,
      applyFilter: 'auto',
    },
    filterBuilder: {
      customOperations: [
        {
          name: 'custom',
          caption: 'custom',
          dataTypes: ['string'],
          icon: 'check',
          hasValue: false,
          calculateFilterExpression() {
            return [
              ['Field 0', '=', 0],
            ];
          },
        },
      ],
      allowHierarchicalFields: true,
    },
    filterPanel: { visible: true },
    filterValue: [
      ['field_0', 'custom'],
    ],
  });
});

// T1290381
test('DataGrid - filter row\'s search-box\'s aria-label should be customizable via localization', async (t) => {
  const dataGrid = new DataGrid('#container');
  const filterCell = dataGrid.getFilterCell(0);

  await dataGrid.isReady();

  const ariaLabel = await filterCell.menuButton.getAttribute('aria-label');

  await t
    .expect(ariaLabel)
    .eql('custom text');
}).before(async (t) => {
  await t.eval(() => {
    (window as any).DevExpress.localization.loadMessages({
      en: {
        'dxDataGrid-ariaSearchBox': 'custom text',
      },
    });
  });

  return createWidget('dxDataGrid', {
    columns: [{
      dataField: 'test',
      dataType: 'string',
    }],
    filterRow: {
      visible: true,
    },
  });
});

test('DataGrid - NVDA reads filter menu items as "Search box 1 of 8" (T1290386)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const filterCell = dataGrid.getFilterCell(0);

  await dataGrid.isReady();

  await t
    .expect(filterCell.menuButton.getAttribute('aria-label'))
    .eql('Search box');

  await t
    .click(filterCell.menuButton);

  const itemCount = await filterCell.menu.getItemCount();

  for (let i = 0; i < itemCount; i += 1) {
    const item = filterCell.menu.getItemByIndex(i);
    await t.expect(item.getAttribute('aria-label')).eql(null);
  }

  await t
    .click(filterCell.menu.getItemByText('Equals'))
    .expect(filterCell.menuButton.getAttribute('aria-label'))
    .eql('Equals');
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(5, 1),
  keyExpr: 'field_0',
  filterRow: {
    visible: true,
  },
}));

// T1312521
[true, false].forEach((grouped) => {
  test('DataGrid - filter range overlay in last column on Tab pressed moves focus to next tabbable element (T1312521)', async (t) => {
    const dataGrid = new DataGrid('#container');
    const filterCell = dataGrid.getFilterCell(2);
    const expectedFocusedElement = grouped ? dataGrid.getGroupRow(0) : dataGrid.getDataCell(0, 0);

    await t
      .click(filterCell.element)
      .expect(dataGrid.getFilterRangeOverlay().exists)
      .ok('Filter range overlay is shown')
      .pressKey('tab')
      .pressKey('tab')
      .expect(dataGrid.getFilterRangeOverlay().exists)
      .notOk('Filter range overlay is closed')
      .expect(expectedFocusedElement.isFocused)
      .ok('First cell of first row is focused');
  }).before(async () => createWidget('dxDataGrid', {
    dataSource: [
      { Group: 'group1', Value: 'field1', Range: 10 },
      { Group: 'group1', Value: 'field2', Range: 20 },
      { Group: 'group2', Value: 'field3', Range: 30 },
      { Group: 'group2', Value: 'field4', Range: 40 },
    ],
    filterRow: { visible: true },
    columns: [
      {
        dataField: 'Group',
        groupIndex: grouped ? 0 : undefined,
      },
      'Value',
      {
        dataField: 'Range',
        selectedFilterOperation: 'between',
      },
    ],
  }));
});

test('DataGrid - filter range overlay in last column on Tab pressed moves focus to next tabbable element with empty data (T1312521)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const filterCell = dataGrid.getFilterCell(2);

  await t
    .click(filterCell.element)
    .expect(dataGrid.getFilterRangeOverlay().exists)
    .ok('Filter range overlay is shown')
    .pressKey('tab')
    .pressKey('tab')
    .expect(dataGrid.getFilterRangeOverlay().exists)
    .notOk('Filter range overlay is closed')
    .expect(dataGrid.getRowsView().focused)
    .ok('Empty rows view is focused');
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [],
  filterRow: { visible: true },
  columns: [
    'Group',
    'Value',
    {
      dataField: 'Range',
      selectedFilterOperation: 'between',
    },
  ],
}));

test('Lookup filter should not change to (All) after searching twice in another column (T1284002)', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const lookupFilterEditor = dataGrid.getFilterEditor(0, SelectBox);
  const textFilterEditor = dataGrid.getFilterEditor(1, TextBox);

  // assert
  await t.expect(dataGrid.isReady()).ok();

  // act
  await t.click(lookupFilterEditor.element);

  // assert
  await t.expect(await lookupFilterEditor.isOpened()).ok();

  // act
  const lookupList = await lookupFilterEditor.getList();
  const lookupItem = lookupList.getItem(1);
  await t.click(lookupItem.element);

  // assert
  await t
    .expect(lookupFilterEditor.value)
    .eql('Lookup Item 1')
    .expect(dataGrid.dataRows.count)
    .eql(1);

  // act
  await t.typeText(textFilterEditor.input, 'a');

  // assert
  await t
    .expect(lookupFilterEditor.value)
    .eql('Lookup Item 1')
    .expect(dataGrid.dataRows.count)
    .eql(0);

  // act
  await t.typeText(textFilterEditor.input, 'b');

  // assert
  await t
    .expect(lookupFilterEditor.value)
    .eql('Lookup Item 1')
    .expect(dataGrid.dataRows.count)
    .eql(0);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { ID: 1, Lookup: 1, Text: 'Item 1' },
    { ID: 2, Lookup: 2, Text: 'Item 2' },
    { ID: 3, Lookup: 3, Text: 'Item 3' },
  ],
  keyExpr: 'ID',
  syncLookupFilterValues: true,
  filterRow: { visible: true },
  columns: [{
    dataField: 'Lookup',
    lookup: {
      valueExpr: 'ID',
      displayExpr: 'Text',
      dataSource: [
        { ID: 1, Text: 'Lookup Item 1' },
        { ID: 2, Text: 'Lookup Item 2' },
        { ID: 3, Text: 'Lookup Item 3' },
      ],
    },
  }, 'Text'],
  onEditorPreparing(e) {
    if (e.dataField === 'Text') {
      e.updateValueTimeout = 0;
    }
  },
}));
