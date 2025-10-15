import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { getData } from '../helpers/generateDataSourceData';
import { changeTheme } from '../../../helpers/changeTheme';

fixture.disablePageReloads`Column chooser`
  .page(url(__dirname, '../../container.html'));

['generic.light', 'material.blue.light', 'fluent.blue.light'].forEach((theme) => {
  ['dragAndDrop', 'select'].forEach((mode: any) => {
    test(`Column chooser screenshot in mode=${mode}, theme=${theme}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
      const dataGrid = new DataGrid('#container');

      await dataGrid.apiShowColumnChooser();

      await t
        .expect(await takeScreenshot(`column-chooser-${mode}-mode (${theme}).png`, dataGrid.element))
        .ok()
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await changeTheme(theme);
      return createWidget('dxDataGrid', {
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
      });
    }).after(async () => {
      await changeTheme('generic.light');
    });
  });
});

test('Column chooser checkboxes should be aligned correctly with plain structure', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid('#container');

  await t
    .click(dataGrid.getHeaderPanel().getColumnChooserButton());

  const columnChooser = dataGrid.getColumnChooser();

  await t
    .expect(await takeScreenshot('column-chooser-checkbox-alignment-plain-structure.png', columnChooser.content))
    .ok()
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

  await t
    .expect(await takeScreenshot('column-chooser-checkbox-alignment-tree-structure.png', columnChooser.content))
    .ok()
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

  await takeScreenshot('T1219785-column-chooser-1.png', dataGrid.element);

  await dataGrid.getColumnChooser().focusList();
  await dataGrid.moveColumnChooserColumn(0, -25, -25, true);
  await dataGrid.moveColumnChooserColumn(0, -50, -50);

  await takeScreenshot('T1219785-column-chooser-2.png', dataGrid.element);

  // act
  await t.pressKey('esc');
  await dataGrid.moveColumnChooserColumn(0, -75, -75);

  await takeScreenshot('T1219785-column-chooser-3.png', dataGrid.element);

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
    const lastItemCheckbox = columnChooser.getCheckbox(1);

    await t.expect(columnChooser.isCheckboxDisabled(0)).notOk();
    await t.expect(columnChooser.isCheckboxDisabled(1)).notOk();

    await t.click(lastItemCheckbox);

    await t.expect(columnChooser.isCheckboxDisabled(0)).ok();
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
  const title = columnChooser.getTitle();
  const emptyMessage = columnChooser.getEmptyMessage();
  const titleText = await title.innerText;
  const emptyMessageText = await emptyMessage.innerText;

  await t.expect(titleText).eql('customTitle');
  await t.expect(emptyMessageText).eql('customEmptyText');
}).before(async (t) => {
  t.ctx.originalMessages = {
    'dxDataGrid-columnChooserTitle': 'Column Chooser',
    'dxDataGrid-columnChooserEmptyText': 'Drag a column here to hide it',
  };

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
  await t.eval(
    (messages) => {
      (window as any).DevExpress.localization.loadMessages({ en: messages });
    },
    {
      dependencies: { messages: t.ctx.originalMessages },
      boundTestRun: t,
    },
  );
});
