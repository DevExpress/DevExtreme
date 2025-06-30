import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { ClientFunction } from 'testcafe';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture
  .disablePageReloads`Keyboard Navigation - Column Reordering`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

const triggerVisibilityChange = ClientFunction(() => {
  document.dispatchEvent(new Event('visibilitychange'));
});

test('The column should be grouped when pressing Ctrl + G if grouping.contextMenuEnabled is false', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstVisibleHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

  await t
    .click(firstVisibleHeader.element)
    .pressKey('ctrl+g');

  await t
    .expect(dataGrid.getGroupPanel().getHeadersCount())
    .eql(1)
    .expect(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1).isFocused)
    .ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    width: 550,
    columnWidth: 100,
    grouping: {
      contextMenuEnabled: false,
    },
    groupPanel: {
      visible: true,
    },
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
  });
});

test('The column should not be grouped when pressing Ctrl + G if keyboardNavigation.enabled is false', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstVisibleHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

  await t
    .click(firstVisibleHeader.element)
    .pressKey('ctrl+g');

  await t
    .expect(dataGrid.getGroupPanel().getHeadersCount())
    .eql(0)
    .expect(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).isFocused)
    .ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    width: 550,
    columnWidth: 100,
    keyboardNavigation: {
      enabled: false,
    },
    groupPanel: {
      visible: true,
    },
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
  });
});

// Group columns when adaptability is enabled
test('Group column when pressing Ctrl + G if adaptability is enabled', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstVisibleHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);

  await t
    .click(firstVisibleHeader.element)
    .pressKey('ctrl+g');

  await t
    .expect(dataGrid.getGroupPanel().getHeadersCount())
    .eql(1)
    .expect(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(4).isFocused)
    .ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    width: 550,
    columnWidth: 100,
    allowColumnReordering: true,
    groupPanel: {
      visible: true,
    },
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
      field5: 'test5',
      field6: 'test6',
      field7: 'test7',
      field8: 'test8',
    }],
    customizeColumns: (columns) => {
      columns[0].hidingPriority = 0;
      columns[2].hidingPriority = 1;
      columns[3].hidingPriority = 2;
    },
  });
});

test('Group column with showWhenGrouped enabled when pressing Ctrl + G if adaptability is enabled', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstVisibleHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);

  await t
    .click(firstVisibleHeader.element)
    .pressKey('ctrl+g');

  await t
    .expect(dataGrid.getGroupPanel().getHeadersCount())
    .eql(1)
    .expect(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(2).isFocused)
    .ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    width: 550,
    columnWidth: 100,
    allowColumnReordering: true,
    groupPanel: {
      visible: true,
    },
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
      field5: 'test5',
      field6: 'test6',
      field7: 'test7',
      field8: 'test8',
    }],
    customizeColumns: (columns) => {
      columns[1].showWhenGrouped = true;

      columns[0].hidingPriority = 0;
      columns[2].hidingPriority = 1;
      columns[3].hidingPriority = 2;
    },
  });
});

// Group nested columns
test('Group first nested column when pressing Ctrl + G', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const nestedFirstHeader = dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(0);

  await t
    .click(nestedFirstHeader.element)
    .pressKey('ctrl+g');

  await t
    .expect(dataGrid.getGroupPanel().getHeadersCount())
    .eql(1)
    .expect(dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(0).isFocused)
    .ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
      field5: 'test5',
    }],
    grouping: {
      contextMenuEnabled: true,
    },
    groupPanel: {
      visible: true,
    },
    columns: [
      'field1',
      {
        caption: 'Band Column',
        columns: ['field2', 'field3', 'field4'],
      },
      'field5',
    ],
  });
});

test('Group last nested column when pressing Ctrl + G', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const nestedLastHeader = dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(2);

  await t
    .click(nestedLastHeader.element)
    .pressKey('ctrl+g');

  await t
    .expect(dataGrid.getGroupPanel().getHeadersCount())
    .eql(1)
    .expect(dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(1).isFocused)
    .ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
      field5: 'test5',
    }],
    grouping: {
      contextMenuEnabled: true,
    },
    groupPanel: {
      visible: true,
    },
    columns: [
      'field1',
      {
        caption: 'Band Column',
        columns: ['field2', 'field3', 'field4'],
      },
      'field5',
    ],
  });
});

test('Group last nested column when pressing Ctrl + G when there are several band columns', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const nestedSecondHeader = dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(1);

  await t
    .click(nestedSecondHeader.element)
    .pressKey('ctrl+g');

  await t
    .expect(dataGrid.getGroupPanel().getHeadersCount())
    .eql(1)
    .expect(dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(0).isFocused)
    .ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
      field5: 'test5',
      field6: 'test6',
    }],
    grouping: {
      contextMenuEnabled: true,
    },
    groupPanel: {
      visible: true,
    },
    columns: [
      'field1',
      {
        caption: 'Band Column 1',
        columns: ['field2', 'field3'],
      },
      'field4',
      {
        caption: 'Band Column 2',
        columns: ['field5', 'field6'],
      },
    ],
  });
});

test('Group single nested column when pressing Ctrl + G', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const nestedLastHeader = dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(0);

  await t
    .click(nestedLastHeader.element)
    .pressKey('ctrl+g');

  await t
    .expect(dataGrid.getGroupPanel().getHeadersCount())
    .eql(1)
    .expect(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(2).isFocused)
    .ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
    }],
    grouping: {
      contextMenuEnabled: true,
    },
    groupPanel: {
      visible: true,
    },
    columns: [
      'field1',
      {
        caption: 'Band Column',
        columns: ['field2'],
      },
      'field3',
    ],
  });
});

test('Group nested column when pressing Ctrl + G if adaptability is enabled', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstVisibleNestedHeader = dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(2);

  await t
    .click(firstVisibleNestedHeader.element)
    .pressKey('ctrl+g');

  await t
    .expect(dataGrid.getGroupPanel().getHeadersCount())
    .eql(1)
    .expect(dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(4).isFocused)
    .ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    width: 550,
    columnWidth: 100,
    allowColumnReordering: true,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
      field5: 'test5',
      field6: 'test6',
      field7: 'test7',
      field8: 'test8',
      field9: 'test9',
    }],
    groupPanel: {
      visible: true,
    },
    columns: [
      'field1',
      {
        caption: 'Band column 1',
        columns: [
          {
            dataField: 'field2',
            hidingPriority: 0,
          },
          'field3',
          'field4',
          {
            dataField: 'field5',
            hidingPriority: 1,
          },
          {
            dataField: 'field6',
            hidingPriority: 2,
          },
          'field7',
          {
            dataField: 'field8',
            hidingPriority: 3,
          },
        ],
      },
      'field9',
    ],
  });
});

// Ungroup columns
test('Ungroup column with showWhenGrouped enabled when pressing Ctrl + Shift + G if adaptability is enabled', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstVisibleHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(2);

  await t
    .click(firstVisibleHeader.element)
    .pressKey('ctrl+shift+g');

  await t
    .expect(dataGrid.getGroupPanel().getHeadersCount())
    .eql(0)
    .expect(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1).isFocused)
    .ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    width: 550,
    columnWidth: 100,
    allowColumnReordering: true,
    groupPanel: {
      visible: true,
    },
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
      field5: 'test5',
      field6: 'test6',
      field7: 'test7',
      field8: 'test8',
    }],
    customizeColumns: (columns) => {
      columns[1].showWhenGrouped = true;
      columns[1].groupIndex = 0;

      columns[0].hidingPriority = 0;
      columns[2].hidingPriority = 1;
      columns[3].hidingPriority = 2;
    },
  });
});

test('Focus should be restored when ungrouping the column via context menu after leaving the page and returning back', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const contextMenu = dataGrid.getContextMenu();
  const firstGroupedHeader = dataGrid.getGroupPanel().getHeader(0);

  // Simulate leaving a page and returning back
  await triggerVisibilityChange();

  // act
  await t
    .rightClick(firstGroupedHeader.element)
    .click(contextMenu.getItemByText('Ungroup'));

  // assert
  await t
    .expect(dataGrid.getGroupPanel().getHeadersCount())
    .eql(2)
    .expect(dataGrid.getGroupPanel().getHeader(0).element.focused)
    .ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
    groupPanel: {
      visible: true,
    },
    columns: [
      {
        dataField: 'field1',
        groupIndex: 1,
      },
      {
        dataField: 'field2',
        groupIndex: 2,
      },
      'field3',
      {
        dataField: 'field4',
        groupIndex: 0,
      },
    ],
  });
});
