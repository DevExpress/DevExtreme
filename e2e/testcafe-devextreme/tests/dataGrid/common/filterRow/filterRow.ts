import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import FilterTextBox from 'devextreme-testcafe-models/dataGrid/editors/filterTextBox';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { changeTheme } from '../../../../helpers/changeTheme';
import { getNumberData, getData } from '../../helpers/generateDataSourceData';
import { Themes } from '../../../../helpers/themes';

fixture.disablePageReloads`FilterRow`
  .page(url(__dirname, '../../../container.html'));

test('Filter should reset if the filter row editor text is cleared (T1257261)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const filterEditor = dataGrid.getFilterEditor(1, FilterTextBox);
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

test('Filter row\'s height should be adjusted by content (T1072609)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('T1072609-material.blue.light', dataGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await changeTheme('material.blue.light');

  return createWidget('dxDataGrid', {
    columns: [{
      dataField: 'Date',
      dataType: 'date',
      width: 140,
      selectedFilterOperation: 'between',
      filterValue: [new Date(2022, 2, 28), new Date(2022, 2, 29)],
    }],
    filterRow: { visible: true },
    wordWrapEnabled: true,
    showBorders: true,
  });
}).after(async () => {
  await changeTheme('generic.light');
});

test('FilterRow range overlay screenshot', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');
  const filterEditor = dataGrid.getFilterEditor(1, FilterTextBox);

  await t
    .click(filterEditor.menuButton);
  await t
    .click(filterEditor.menu.getItemByText('Between'))
    // act
    .expect(await takeScreenshot('filter-row-overlay.png', dataGrid.element))
    .ok()
    // assert
    .expect(dataGrid.getFilterRangeOverlay().exists)
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getNumberData(20, 2),
  height: 400,
  showBorders: true,
  filterRow: {
    visible: true,
    applyFilter: 'auto',
  },
}));

// T1267481
test('Filter Row\'s Reset button does not work after a custom filter is set in Filter Builder', async (t) => {
  const dataGrid = new DataGrid('#container');
  const filterEditor = dataGrid.getFilterEditor(0, FilterTextBox);

  await dataGrid.isReady();

  await t
    .expect(dataGrid.dataRows.count)
    .eql(0);

  await t
    .click(filterEditor.menuButton)
    .click(filterEditor.menu.getItemByText('Reset'));

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

// T1287288
test('Focus overlay should be visible in filter row when focusedRowEnabled is enabled (Fluent SaaS)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');
  const filterEditor = dataGrid.getFilterEditor(1, FilterTextBox);

  await t
    .click(dataGrid.getDataCell(0, 0).element)
    .click(filterEditor.input)
    // assert
    .expect(filterEditor.input.focused)
    .ok()
    .expect(await takeScreenshot(`filter-row-focus-overlay (${Themes.fluentBlue}).png`, dataGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await changeTheme(Themes.fluentBlue);

  return createWidget('dxDataGrid', {
    dataSource: [
      { ID: 1, Field: 'Item 1' },
      { ID: 2, Field: 'Item 2' },
      { ID: 3, Field: 'Item 3' },
    ],
    keyExpr: 'ID',
    focusedRowEnabled: true,
    filterRow: { visible: true },
    showBorders: true,
    columns: ['ID', 'Field'],
  });
}).after(async () => {
  await changeTheme('generic.light');
});

test('DataGrid - NVDA reads filter menu items as "Search box 1 of 8" (T1290386)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const filterEditor = dataGrid.getFilterEditor(0, FilterTextBox);

  await dataGrid.isReady();

  await t
    .expect(filterEditor.menuButton.getAttribute('aria-label'))
    .eql('Search box');

  await t
    .click(filterEditor.menuButton);

  const itemCount = await filterEditor.menu.getItemCount();

  for (let i = 0; i < itemCount; i += 1) {
    const item = filterEditor.menu.getItemByIndex(i);
    await t.expect(item.getAttribute('aria-label')).eql(null);
  }

  await t
    .click(filterEditor.menu.getItemByText('Equals'))
    .expect(filterEditor.menuButton.getAttribute('aria-label'))
    .eql('Equals');
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(5, 1),
  keyExpr: 'field_0',
  filterRow: {
    visible: true,
  },
}));

test('DataGrid - The `between` filter dropdown sticks to the viewport edge during horizontal scrolling (T1280071)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');
  const filterEditor = dataGrid.getFilterEditor(0, FilterTextBox);

  await dataGrid.isReady();

  await t
    .click(filterEditor.menuButton)
    .click(filterEditor.menu.getItemByText('Between'));

  await dataGrid.scrollBy(t, { x: 999 });
  await t
    .expect(await takeScreenshot('filter-row-filter-range-hide-on-scroll.png'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { ID: 1, Text: 'Item 1' },
    { ID: 2, Text: '' },
    { ID: 3, Text: 'Item 3' },
  ],
  keyExpr: 'ID',
  filterRow: {
    visible: true,
  },
  scrolling: {
    useNative: true,
  },
  columnWidth: 400,
  width: 500,
}));

// T1290381
test('DataGrid - filter row\'s search-box\'s aria-label should be customizable via localization', async (t) => {
  const dataGrid = new DataGrid('#container');
  const filterEditor = dataGrid.getFilterEditor(0, FilterTextBox);

  await dataGrid.isReady();

  const ariaLabel = await filterEditor.menuButton.getAttribute('aria-label');

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
}).after(async (t) => {
  await t.eval(() => location.reload());
});
