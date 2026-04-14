import { ClientFunction, Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid, { CLASS } from 'devextreme-testcafe-models/dataGrid';
import { Overlay } from 'devextreme-testcafe-models/dataGrid/overlay';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { getData } from '../../helpers/generateDataSourceData';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`Editing.Visual`
  .page(url(__dirname, '../../../container.html'));

const encodedIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgIHdpZHRoPSIyMHB4IiBoZWlnaHQ9IjIwcHgiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iIzAwMDAwMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KCTxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIC8+DQo8L3N2Zz4NCg==';

test('The E0110 should not occur when editing a column with setCellValue in form mode (T1193894)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');
  // act
  await t
    .typeText(dataGrid.getFormItemEditor(0), 'new')
    .click(dataGrid.getEditForm().saveButton);

  // assert
  await testScreenshot(t, takeScreenshot, 'grid-form-editing-T1193894.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{
    ID: 1,
    Name: 'test',
  }],
  keyExpr: 'ID',
  editing: {
    mode: 'form',
    allowUpdating: true,
    editRowKey: 1,
  },
  columns: [{
    dataField: 'Name',
    setCellValue(rowData, value) {
      rowData.Name = value;
    },
  }],
  // @ts-expect-error private option
  templatesRenderAsynchronously: true,
}));

// visual: material.blue.light
test('Checkbox has ink ripple in material theme inside editing popup (T977287)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');
  const overlay = new Overlay();

  // act
  await t
    .click(dataGrid.getDataRow(0).getCommandCell(1).getButton(0))
    .wait(1000)
    .click(overlay.getPopupCheckbox());

  // assert
  await testScreenshot(t, takeScreenshot, 'grid-popup-editing-checkbox.png', { element: overlay.content });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{
    ID: 1,
    LastName: 'Heart',
  }],
  keyExpr: 'ID',
  editing: {
    allowUpdating: true,
    mode: 'popup',
    form: {
      items: [{
        dataField: 'checkbox',
        editorType: 'dxCheckBox',
      }],
    },
  },
  columns: ['LastName'],
}));

// visual: material.blue.light
test('DataGrid inside editing popup should have synchronized columns (T1059401)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');

  const dataGridOffsetBottom = await dataGrid.element.getBoundingClientRectProperty('bottom');
  // act

  await t
    .click(Selector('body'), { offsetY: dataGridOffsetBottom + 10 });

  await t
    .click(dataGrid.getDataRow(0).getCommandCell(1).getButton(0));

  const overlay = new Overlay();

  const popupDataGridSelector = overlay.content.find(`.${CLASS.dataGrid}`);
  const popupDataGrid = new DataGrid(popupDataGridSelector);

  await t
    .expect(popupDataGrid.getDataRow(0).element.exists)
    .ok();

  // assert
  await testScreenshot(t, takeScreenshot, 'grid-popup-editing-grid.png', { element: overlay.content });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{
    ID: 1,
  }],
  keyExpr: 'ID',
  editing: {
    allowUpdating: true,
    mode: 'popup',
    form: {
      colCount: 1,
      items: [{
        template() {
          return ($('<div>') as any).dxDataGrid({
            showColumnLines: true,
            dataSource: [{
              ID: 1,
              FirstName: 'John',
              LastName: 'Heart',
            }],
            height: 200,
            editing: {
              allowUpdating: true,
              allowDeleting: true,
            },
          });
        },
      }],
    },
  },
}));

// visual: material.blue.light
test('DataGrid adaptive text should have correct paddings (T1062084)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // act
  await t
    .click(dataGrid.getDataRow(0).getCommandCell(4).getAdaptiveButton());

  await t
    .click(dataGrid.getFormItemElement(0));

  await t
    .typeText(dataGrid.getFormItemEditor(0), '1');

  await t
    .pressKey('enter');

  await t
    .click(dataGrid.getFormItemElement(2));

  await t
    .typeText(dataGrid.getFormItemEditor(2), '0');

  await t
    .pressKey('enter');

  await testScreenshot(t, takeScreenshot, 'grid-adaptive-item-text.png', { element: dataGrid.element });
  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  width: 400,
  dataSource: [{
    OrderNumber: 35703,
    SaleAmount: 11800,
    OrderDate: '2014/04/10',
    Employee: 'Harv Mudd',
  }],
  keyExpr: 'OrderNumber',
  columnHidingEnabled: true,
  editing: {
    allowUpdating: true,
    mode: 'batch',
  },
  columns: [{
    dataField: 'OrderNumber',
    caption: 'Invoice Number',
    width: 300,
  }, {
    dataField: 'Employee',
  }, {
    dataField: 'OrderDate',
    dataType: 'date',
  }, {
    dataField: 'SaleAmount',
    validationRules: [{ type: 'range', max: 100000 }],
    format: 'currency',
  }],
}));

// visual: material.blue.light
test('DataGrid checkboxes should have correct outline in adaptive row', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // act
  await t
    .click(dataGrid.getDataRow(0).getCommandCell(4).getAdaptiveButton())
    .click(dataGrid.getFormItemElement(2));

  await testScreenshot(t, takeScreenshot, 'grid-adaptive-checkbox.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  width: 400,
  dataSource: [{
    OrderNumber: 35703,
    Employee: 'Sam',
    OrderDate: '2014/04/10',
    Checkbox: true,
  }],
  keyExpr: 'OrderNumber',
  columnHidingEnabled: true,
  editing: {
    allowUpdating: true,
    mode: 'cell',
  },
  columns: [{
    dataField: 'OrderNumber',
    caption: 'Invoice Number',
    width: 300,
  }, {
    dataField: 'Employee',
  }, {
    dataField: 'OrderDate',
    dataType: 'date',
  }, {
    dataField: 'Checkbox',
    dataType: 'boolean',
  }],
}));

test('DataGrid cell with checkbox should have outline on focused', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // act
  await t
    .click(dataGrid.getDataCell(0, 0).element)
    .expect(dataGrid.getDataCell(0, 0).isFocused).ok()
    .pressKey('enter')
    .pressKey('tab');

  await testScreenshot(t, takeScreenshot, 'grid-checkbox-outline.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  height: 150,
  width: 200,
  dataSource: [{
    Id: 0,
    Checkbox: true,
  }],
  keyExpr: 'Id',
  editing: {
    allowUpdating: true,
    mode: 'cell',
  },
  columns: ['Id', 'Checkbox'],
}));

// T1130497
([
  ['first', 0, 'standard', 0],
  ['last', 20, 'standard', 0],
  ['pageBottom', 20, 'standard', 0],
  ['pageTop', 0, 'standard', 0],
  ['pageBottom', 5, 'virtual', 0],
  ['pageTop', 0, 'virtual', 0],
  ['viewportBottom', 5, 'standard', 0],
  ['viewportBottom', 8, 'standard', 162],
  ['viewportTop', 0, 'standard', 0],
  ['viewportTop', 3, 'standard', 162],
  ['viewportBottom', 5, 'virtual', 0],
  ['viewportBottom', 8, 'virtual', 162],
  ['viewportTop', 0, 'virtual', 0],
  ['viewportTop', 3, 'virtual', 162],
] as const)
  .forEach(([newRowPosition, insertedRowNumber, scrollMode, scrollTop]) => {
    test(`The first cell of the new row should be focused when
      newRowPosition = ${newRowPosition}
      and editing.mode = cell
      and ${scrollMode} scroll mode
      and scrollTop is ${scrollTop}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
      const dataGrid = new DataGrid('#container');
      const headerPanel = dataGrid.getHeaderPanel();

      const scrollTo = async (y) => {
        await dataGrid.scrollTo(t, { y });
        // eslint-disable-next-line local/no-is-ready-without-expect
        return dataGrid.isReady();
      };

      const screenshotName = `grid-new-row_position-${newRowPosition}_scroll-mode-${scrollMode}_top-${scrollTop}.png`;

      await t
        .expect(await scrollTo(scrollTop))
        .ok(`scrollTo ${scrollTop}`)
        .click(headerPanel.getAddRowButton());

      // act
      await testScreenshot(t, takeScreenshot, screenshotName, { element: dataGrid.element });
      await t
        .expect(dataGrid.getDataRow(insertedRowNumber).isInserted)
        .ok('row is inserted')
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(20, 3),
      height: 400,
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
        newRowPosition,
      },
      scrolling: {
        mode: scrollMode,
      },
    }));
  });

test('Popup EditForm screenshot', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');
  const commandCellRow0 = dataGrid.getDataCell(0, 2);

  await t.click(commandCellRow0.getLinkEdit());
  // act
  await testScreenshot(t, takeScreenshot, 'popup-edit-form.png', { element: dataGrid.element });
  // assert
  await t
    .expect(dataGrid.getPopupEditForm().element.exists)
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 2),
  height: 400,
  showBorders: true,
  editing: {
    mode: 'popup',
    allowUpdating: true,
  },
}));

// T1218553
test('Popup EditForm screenshot when editRowKey is initially specified', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');

  await testScreenshot(t, takeScreenshot, 'popup-edit-form-with-initial-editrowkey.png', { element: dataGrid.element });
  await t
    .expect(dataGrid.getPopupEditForm().element.exists)
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 2).map((item, index) => ({ ...item, id: index })),
  keyExpr: 'id',
  height: 400,
  showBorders: true,
  editing: {
    mode: 'popup',
    allowUpdating: true,
    editRowKey: 0,
  },
}));

// visual: generic.light
// visual: material.blue.light
[true, false].forEach((useIcons) => {
  // T1179114
  test('The disabled state should be correct for a custom button when given as a SVG image', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid('#container');
    const commandCell = dataGrid.getDataRow(0).getCommandCell(2);
    const firstCustomIcon = commandCell.getButton(2);
    const secondCustomIcon = commandCell.getButton(3);

    await t
      .expect(firstCustomIcon.clientWidth)
      .eql(20)
      .expect(secondCustomIcon.clientWidth)
      .eql(20);

    await testScreenshot(t, takeScreenshot, `T1179114-grid-edit-custom-button when-useicons-is-${useIcons}.png`, { element: dataGrid.element });
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxDataGrid', {
    width: 600,
    dataSource: [{
      Id: 0,
      name: 'test',
    }],
    keyExpr: 'Id',
    editing: {
      mode: 'row',
      allowUpdating: true,
      allowDeleting: true,
      useIcons,
    },
    columns: ['Id', 'name', {
      type: 'buttons',
      width: 200,
      buttons: [
        {
          name: 'delete',
          disabled: false,
        },
        {
          name: 'delete',
          disabled: true,
        },
        {
          icon: encodedIcon,
          disabled: false,
        },
        {
          icon: encodedIcon,
          disabled: true,
        },
      ],
    }],
  }));
});

// T1201724
test('An exception should not throw after pressing enter on the save button and onSaving\'s promise is resolved', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const dataRow = dataGrid.getDataRow(0);
  const editButton = dataRow.getCommandCell(3).getButton(0);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const resolveOnSavingDeferred = ClientFunction(() => (window as any).deferred.resolve());

  // act
  await t
    .click(editButton)
    .expect(dataRow.isEdited)
    .ok()
    .typeText(dataGrid.getDataCell(0, 0).element, 'new_value')
    .pressKey('tab tab tab')
    .pressKey('enter');

  await resolveOnSavingDeferred();

  // assert
  await t
    .expect(dataRow.isEdited)
    .notOk();

  await testScreenshot(t, takeScreenshot, 'grid-editing-with-onSaving-T1201724.png', { element: dataGrid.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await ClientFunction(() => {
    (window as any).deferred = $.Deferred();
  })();

  return createWidget('dxDataGrid', {
    dataSource: [
      {
        id: 1, field1: 'value1', field2: 'value2', field3: 'value3',
      },
      {
        id: 2, field1: 'value4', field2: 'value5', field3: 'value6',
      },
    ],
    keyExpr: 'id',
    showBorders: true,
    columns: ['field1', 'field2', 'field3'],
    editing: {
      mode: 'row',
      allowUpdating: true,
    },
    onSaving(e) {
      e.promise = (window as any).deferred;
    },
  });
});

test('DataGrid - A new row is added above the existing row if the data source is empty or contains only one record and newRowPosition is set to "pageBottom" (T1287287)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .click(addRowButton)
    .click(addRowButton);

  await t
    .expect(dataGrid.getDataRow(1).isInserted)
    .ok();

  await testScreenshot(t, takeScreenshot, 'newRowPosition-pageBottom-add-row-to-bottom.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [],
  keyExpr: 'ID',
  editing: {
    mode: 'batch',
    allowAdding: true,
    newRowPosition: 'pageBottom',
  },
  columns: [
    {
      dataField: 'A',
    },
  ],
}));

// visual: generic.light
// visual: fluent.blue.light
// visual: material.blue.light
test('DataGrid - ColorBox in DataGrid causes input value to appear behind color preview (T1280023)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');

  await t.click(dataGrid.getDataCell(0, 0).element);

  await testScreenshot(t, takeScreenshot, 'grid-form-editing-with-color-box.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [
      { Color: 'red' },
    ],
    showBorders: true,
    editing: {
      allowUpdating: true,
      mode: 'cell',
    },
    onEditorPreparing(e) {
      if (e.dataField === 'Color') {
        e.editorName = 'dxColorBox';
        e.editorOptions.readOnly = false;
      }
    },
  });
});
