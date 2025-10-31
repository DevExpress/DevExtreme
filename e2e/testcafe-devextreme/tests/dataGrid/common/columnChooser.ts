import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { getData } from '../helpers/generateDataSourceData';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture.disablePageReloads`Column chooser`
  .page(url(__dirname, '../../container.html'));

// visual: generic.light
// visual: material.blue.light
// visual: fluent.blue.light

['dragAndDrop', 'select'].forEach((mode: any) => {
  test(`Column chooser screenshot in mode=${mode}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid('#container');

    // @ts-expect-error ts-error
    await dataGrid.apiShowColumnChooser();

    await testScreenshot(t, takeScreenshot, `column-chooser-${mode}-mode.png`, { element: dataGrid.element });
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxDataGrid', {
    dataSource: getData(20, 3),
    height: 400,
    showBorders: true,
    columns: [{
      dataField: 'field_0',
      dataType: 'string',
    }, {
      dataField: 'field_1',
      dataType: 'string',
    }, {
      dataField: 'field_2',
      dataType: 'string',
      visible: false,
    }],
    columnChooser: {
      enabled: true,
      mode,
    },
  }));
});

test('Column chooser checkboxes should be aligned correctly with plain structure', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid('#container');

  await t
    .click(dataGrid.getHeaderPanel().getColumnChooserButton());

  const columnChooser = dataGrid.getColumnChooser();

  await testScreenshot(t, takeScreenshot, 'column-chooser-checkbox-alignment-plain-structure.png', { element: columnChooser.content });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [],
  columns: ['field1', 'field2', 'field3'],
  width: 700,
  columnChooser: {
    enabled: true,
    mode: 'select',
    search: {
      enabled: true,
    },
    selection: {
      allowSelectAll: true,
    },
  },
}));

test('Column chooser checkboxes should be aligned correctly with tree structure', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid('#container');

  await t
    .click(dataGrid.getHeaderPanel().getColumnChooserButton());

  const columnChooser = dataGrid.getColumnChooser();

  await testScreenshot(t, takeScreenshot, 'column-chooser-checkbox-alignment-tree-structure.png', { element: columnChooser.content });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [],
  columns: [
    'field1',
    {
      caption: 'band1',
      columns: ['field2', 'field3'],
    },
  ],
  width: 700,
  columnChooser: {
    enabled: true,
    mode: 'select',
    search: {
      enabled: true,
    },
    selection: {
      allowSelectAll: true,
    },
  },
}));

test('Column chooser should support string height and width', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t
    .click(dataGrid.getHeaderPanel().getColumnChooserButton());

  const columnChooserContent = dataGrid.getColumnChooser().content;

  await t
    .expect(columnChooserContent.getStyleProperty('height'))
    .eql('400px')
    .expect(columnChooserContent.getStyleProperty('width'))
    .eql('330px');
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [],
  columns: [
    'field1', 'field2', 'field3',
  ],
  width: 700,
  columnChooser: {
    enabled: true,
    height: '400px',
    width: '330px',
  },
}));

// T1219785
test('Check the behavior of pressing the Esc button when dragging a column from the column chooser', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .click(dataGrid.getColumnChooserButton());

  await testScreenshot(t, takeScreenshot, 'T1219785-column-chooser-1.png', { element: dataGrid.element });

  await dataGrid.getColumnChooser().focusList();
  await dataGrid.moveColumnChooserColumn(0, -25, -25, true);
  await dataGrid.moveColumnChooserColumn(0, -50, -50);

  await testScreenshot(t, takeScreenshot, 'T1219785-column-chooser-2.png', { element: dataGrid.element });

  // act
  await t.pressKey('esc');
  await dataGrid.moveColumnChooserColumn(0, -75, -75);

  await testScreenshot(t, takeScreenshot, 'T1219785-column-chooser-3.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 3),
  height: 400,
  showBorders: true,
  columns: [{
    dataField: 'field_0',
    dataType: 'string',
  }, {
    dataField: 'field_1',
    dataType: 'string',
  }, {
    dataField: 'field_2',
    dataType: 'string',
    visible: false,
  }],
  columnChooser: {
    enabled: true,
    mode: 'dragAndDrop',
  },
}));

test(
  'Should take into account column options change during general option change (T1267471)',
  async (t) => {
    const dataGrid = new DataGrid('#container');
    const columnChooserBtn = dataGrid.getColumnChooserButton();

    await t.click(columnChooserBtn);

    const columnChooser = dataGrid.getColumnChooser();
    // @ts-expect-error ts-error
    const lastItemCheckbox = columnChooser.getCheckbox(1);

    // @ts-expect-error ts-error
    await t.expect(columnChooser.isCheckboxDisabled(0)).notOk();
    // @ts-expect-error ts-error
    await t.expect(columnChooser.isCheckboxDisabled(1)).notOk();

    await t.click(lastItemCheckbox);

    // @ts-expect-error ts-error
    await t.expect(columnChooser.isCheckboxDisabled(0)).ok();
    // @ts-expect-error ts-error
    await t.expect(columnChooser.isCheckboxDisabled(1)).notOk();
  },
).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 0, A: 'A', B: 'B' },
  ],
  keyExpr: 'id',
  columns: ['A', 'B'],
  columnChooser: {
    enabled: true,
    mode: 'select',
  },
  onOptionChanged: ({ component, fullName }) => {
    if (!/columns\[\d+\]\.visible/.test(fullName)) {
      return;
    }

    const visibleColumns = component.getVisibleColumns();
    const [{ dataField: lastColumnDataField }] = visibleColumns;

    if (!lastColumnDataField) {
      return;
    }

    component.columnOption(lastColumnDataField, 'allowHiding', false);
  },
}));

test('ColumnChooser should receive and render custom texts', async (t) => {
  const dataGrid = new DataGrid('#container');
  await dataGrid.isReady();
  const columnChooserBtn = dataGrid.getColumnChooserButton();
  await t.click(columnChooserBtn);
  const columnChooser = dataGrid.getColumnChooser();
  // @ts-expect-error ts-error
  const title = columnChooser.getTitle();
  // @ts-expect-error ts-error
  const emptyMessage = columnChooser.getEmptyMessage();
  const titleText = await title.innerText;
  const emptyMessageText = await emptyMessage.innerText;

  await t.expect(titleText).eql('customTitle');
  await t.expect(emptyMessageText).eql('customEmptyText');
}).before(async (t) => {
  await t.eval(() => {
    (window as any).DevExpress.localization.loadMessages({
      en: {
        'dxDataGrid-columnChooserTitle': 'customTitle',
        'dxDataGrid-columnChooserEmptyText': 'customEmptyText',
      },
    });
  });

  return createWidget('dxDataGrid', {
    columnChooser: {
      height: '340px',
      enabled: true,
      mode: 'dragAndDrop',
      position: {
        my: 'right top',
        at: 'right bottom',
        of: '.dx-datagrid-column-chooser-button',
      },
    },
    dataSource: [],
    columns: [],
  });
}).after(async (t) => {
  await t.eval(() => location.reload());
});
