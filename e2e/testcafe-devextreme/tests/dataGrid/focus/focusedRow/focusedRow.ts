import { ClientFunction } from 'testcafe';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from 'devextreme-testcafe-models/dataGrid';

fixture.disablePageReloads`Focused row`
  .page(url(__dirname, '../../../container.html'));

test('onFocusedRowChanged event should fire once after changing focusedRowKey if paging.enabled = false (T755722)', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t.expect(ClientFunction(() => (window as any).onFocusedRowChangedCounter)()).eql(1);

  await ClientFunction(() => (window as any).widget.option('focusedRowKey', 'Ben'))();

  await t
    .expect(dataGrid.getFocusedRow().exists).ok()
    .expect(ClientFunction(() => (window as any).onFocusedRowChangedCounter)()).eql(2);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { name: 'Alex', phone: '111111', room: 6 },
    { name: 'Dan', phone: '2222222', room: 5 },
    { name: 'Ben', phone: '333333', room: 4 },
  ],
  keyExpr: 'name',
  focusedRowEnabled: true,
  focusedRowIndex: 1,
  paging: {
    enabled: false,
  },
  onFocusedRowChanged: () => {
    const global = window as Window & typeof globalThis & { onFocusedRowChangedCounter: number };
    if (!global.onFocusedRowChangedCounter) {
      global.onFocusedRowChangedCounter = 0;
    }
    global.onFocusedRowChangedCounter += 1;
  },
}));

test('Form - Focused row should not be reset after editing a row (T851400)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const dataRow0 = dataGrid.getDataRow(0);
  const dataRow1 = dataGrid.getDataRow(1);
  const editForm = dataGrid.getEditForm();
  const editor = editForm.getItem('c0');

  await t
    .expect(dataRow1.isFocusedRow).ok()
    .expect(dataGrid.option('focusedRowKey')).eql(6)
    .click(dataRow1.getCommandCell(2).getButton(0))
    .expect(editForm.element.exists)
    .ok()
    .click(editForm.cancelButton)
    .expect(dataRow1.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(6);

  await t
    .click(dataRow1.getCommandCell(2).getButton(0))
    .expect(editForm.element.exists).ok()
    .click(editor)
    .typeText(editor, 'test')
    .click(editForm.saveButton)
    .expect(dataRow1.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(6);

  await t
    .click(dataRow0.getCommandCell(2).getButton(0))
    .expect(editForm.element.exists).ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(5)
    .click(editForm.cancelButton)
    .expect(dataRow0.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(5);

  await t
    .click(dataRow0.getCommandCell(2).getButton(0))
    .expect(editForm.element.exists).ok()
    .click(editor)
    .typeText(editor, 'test')
    .click(editForm.saveButton)
    .expect(dataRow0.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(5);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 5, c0: 'c0_0' },
    { id: 6, c0: 'c0_1' },
  ],
  keyExpr: 'id',
  focusedRowEnabled: true,
  focusedRowKey: 6,
  editing: {
    mode: 'form',
    allowUpdating: true,
  },
}));

test('Popup - Focused row should not be reset after editing a row (T879627)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const dataRow0 = dataGrid.getDataRow(0);
  const dataRow1 = dataGrid.getDataRow(1);
  const popupEditForm = dataGrid.getPopupEditForm();
  const editor = popupEditForm.getItem('c0');

  await t
    .expect(dataRow1.isFocusedRow).ok()
    .expect(dataGrid.option('focusedRowKey')).eql(6)
    .click(dataRow1.getCommandCell(2).getButton(0))
    .expect(popupEditForm.element.visible)
    .ok()
    .click(popupEditForm.cancelButton)
    .expect(dataRow1.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(6);

  await t
    .click(dataRow1.getCommandCell(2).getButton(0))
    .expect(popupEditForm.element.visible).ok()
    .click(editor)
    .typeText(editor, 'test')
    .click(popupEditForm.saveButton)
    .expect(dataRow1.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(6);

  await t
    .click(dataRow0.getCommandCell(2).getButton(0))
    .expect(popupEditForm.element.visible).ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(5)
    .click(popupEditForm.cancelButton)
    .expect(dataRow0.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(5);

  await t
    .click(dataRow0.getCommandCell(2).getButton(0))
    .expect(popupEditForm.element.visible).ok()
    .click(editor)
    .typeText(editor, 'test')
    .click(popupEditForm.saveButton)
    .expect(dataRow0.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(5);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 5, c0: 'c0_0' },
    { id: 6, c0: 'c0_1' },
  ],
  keyExpr: 'id',
  focusedRowEnabled: true,
  focusedRowKey: 6,
  editing: {
    mode: 'popup',
    allowUpdating: true,
    popup: {
      animation: undefined,
    },
  },
}));

['Form', 'Popup'].forEach((mode) => {
  test(`${mode} - Focused row should not be reset after editing a row by API (T879627)`, async (t) => {
    const dataGrid = new DataGrid('#container');
    const dataRow1 = dataGrid.getDataRow(1);

    await t
      .expect(dataGrid.option('focusedRowKey')).eql(6)
      .expect(dataRow1.isFocusedRow).ok();

    await dataGrid.apiEditRow(1);

    await t.expect(dataGrid.option('focusedRowKey')).eql(6);

    await dataGrid.apiCancelEditData();

    await t.expect(dataGrid.option('focusedRowKey')).eql(6);

    await dataGrid.apiEditRow(0);

    await t.expect(dataGrid.option('focusedRowKey')).eql(6);

    await dataGrid.apiSaveEditData();

    await t.expect(dataGrid.option('focusedRowKey')).eql(6);
  }).before(async () => createWidget('dxDataGrid', {
    dataSource: [
      { id: 5, c0: 'c0_0' },
      { id: 6, c0: 'c0_1' },
    ],
    keyExpr: 'id',
    focusedRowEnabled: true,
    focusedRowKey: 6,
    editing: {
      mode: mode.toLowerCase() as any,
      allowUpdating: true,
      popup: {
        animation: null as any, // todo check
      },
    },
  }));
});

test('Row - Focused row should not be reset after editing a row (T879627)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const dataRow0 = dataGrid.getDataRow(0);
  const dataRow1 = dataGrid.getDataRow(1);

  await t
    .expect(dataRow1.isFocusedRow).ok()
    .expect(dataGrid.option('focusedRowKey')).eql(6)
    .click(dataRow1.getCommandCell(2).getButton(0))
    .expect(dataRow1.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(6)
    .click(dataRow1.getCommandCell(2).getButton(1))
    .expect(dataRow1.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(6);

  let editor = dataRow1.getDataCell(1).getEditor();

  await t
    .click(dataRow1.getCommandCell(2).getButton(0))
    .click(editor.element)
    .typeText(editor.element, 'test')
    .click(dataRow1.getCommandCell(2).getButton(0))
    .expect(dataRow1.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(6);

  await t
    .click(dataRow0.getCommandCell(2).getButton(0))
    .expect(dataGrid.option('focusedRowKey')).eql(5)
    .click(dataRow0.getCommandCell(2).getButton(1))
    .expect(dataRow0.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(5);

  editor = dataRow0.getDataCell(1).getEditor();

  await t
    .click(dataRow0.getCommandCell(2).getButton(0))
    .click(editor.element)
    .typeText(editor.element, 'test')
    .click(dataRow0.getCommandCell(2).getButton(0))
    .expect(dataRow0.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(5);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 5, c0: 'c0_0' },
    { id: 6, c0: 'c0_1' },
  ],
  keyExpr: 'id',
  focusedRowEnabled: true,
  focusedRowKey: 6,
  editing: {
    mode: 'row',
    allowUpdating: true,
  },
}));

test('Row - Focused row should be reset after editing a row by API (T879627)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const dataRow1 = dataGrid.getDataRow(1);

  await t
    .expect(dataGrid.option('focusedRowKey')).eql(6)
    .expect(dataRow1.isFocusedRow).ok();

  await dataGrid.apiEditRow(1);

  await t.expect(dataGrid.option('focusedRowKey')).eql(6);

  await dataGrid.apiCancelEditData();

  await t.expect(dataGrid.option('focusedRowKey')).eql(6);

  await dataGrid.apiEditRow(0);

  await t.expect(dataGrid.option('focusedRowKey')).eql(5);

  await dataGrid.apiSaveEditData();

  await t.expect(dataGrid.option('focusedRowKey')).eql(5);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 5, c0: 'c0_0' },
    { id: 6, c0: 'c0_1' },
  ],
  keyExpr: 'id',
  focusedRowEnabled: true,
  focusedRowKey: 6,
  editing: {
    mode: 'row',
    allowUpdating: true,
  },
}));

test('Cell - Focused row should not be reset after editing a cell (T879627)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const dataRow0 = dataGrid.getDataRow(0);
  const dataRow1 = dataGrid.getDataRow(1);
  const dataCell01 = dataRow0.getDataCell(1);
  const dataCell11 = dataRow1.getDataCell(1);

  let editor = dataCell11.getEditor();

  await t
    .expect(dataRow1.isFocusedRow).ok()
    .expect(dataGrid.option('focusedRowKey')).eql(6)
    .click(dataCell11.element)
    .expect(editor.element.exists)
    .ok()
    .expect(dataRow1.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(6)
    .pressKey('esc')
    .expect(editor.element.exists)
    .notOk()
    .expect(dataRow1.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(6);

  await t
    .click(dataCell11.element)
    .expect(editor.element.exists).ok()
    .click(editor.element)
    .typeText(editor.element, 'test')
    .pressKey('enter')
    .expect(editor.element.exists)
    .notOk()
    .expect(dataRow1.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(6);

  editor = dataCell01.getEditor();

  await t
    .click(dataCell01.element)
    .expect(editor.element.exists).ok()
    .expect(dataRow0.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(5)
    .pressKey('esc')
    .expect(dataRow0.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(5);

  await t
    .click(dataCell01.element)
    .expect(editor.element.exists).ok()
    .click(editor.element)
    .typeText(editor.element, 'test')
    .pressKey('enter')
    .expect(editor.element.exists)
    .notOk()
    .expect(dataRow0.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(5);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 5, c0: 'c0_0' },
    { id: 6, c0: 'c0_1' },
  ],
  keyExpr: 'id',
  focusedRowEnabled: true,
  focusedRowKey: 6,
  editing: {
    mode: 'cell',
    allowUpdating: true,
  },
}));

test('Batch - Focused row should not be reset after editing a cell (T879627)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const saveButton = dataGrid.getHeaderPanel().getSaveButton();
  const dataRow0 = dataGrid.getDataRow(0);
  const dataRow1 = dataGrid.getDataRow(1);
  const dataCell01 = dataRow0.getDataCell(1);
  const dataCell11 = dataRow1.getDataCell(1);

  let editor = dataCell11.getEditor();

  await t
    .expect(dataRow1.isFocusedRow).ok()
    .expect(dataGrid.option('focusedRowKey')).eql(6)
    .click(dataCell11.element)
    .expect(editor.element.exists)
    .ok()
    .expect(dataRow1.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(6)
    .pressKey('esc')
    .expect(editor.element.exists)
    .notOk()
    .expect(dataRow1.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(6);

  await t
    .click(dataCell11.element)
    .expect(editor.element.exists).ok()
    .click(editor.element)
    .typeText(editor.element, 'test')
    .pressKey('enter')
    .expect(editor.element.exists)
    .notOk()
    .expect(dataRow1.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(6)
    .click(saveButton)
    .expect(dataRow1.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(6);

  editor = dataCell01.getEditor();

  await t
    .click(dataCell01.element)
    .expect(editor.element.exists).ok()
    .expect(dataRow0.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(5)
    .pressKey('esc')
    .expect(dataRow0.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(5);

  await t
    .click(dataCell01.element)
    .expect(editor.element.exists).ok()
    .click(editor.element)
    .typeText(editor.element, 'test')
    .pressKey('enter')
    .expect(editor.element.exists)
    .notOk()
    .expect(dataRow0.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(5)
    .click(saveButton)
    .expect(dataRow0.isFocusedRow)
    .ok()
    .expect(dataGrid.option('focusedRowKey'))
    .eql(5);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 5, c0: 'c0_0' },
    { id: 6, c0: 'c0_1' },
  ],
  keyExpr: 'id',
  focusedRowEnabled: true,
  focusedRowKey: 6,
  editing: {
    mode: 'batch',
    allowUpdating: true,
  },
}));

['Cell', 'Batch'].forEach((mode) => {
  test(`${mode} - Focused row should not be reset after editing a cell by API (T879627)`, async (t) => {
    const dataGrid = new DataGrid('#container');
    const dataRow1 = dataGrid.getDataRow(1);

    await t
      .expect(dataGrid.option('focusedRowKey')).eql(6)
      .expect(dataRow1.isFocusedRow).ok();

    await dataGrid.apiEditCell(1, 1);

    await t.expect(dataGrid.option('focusedRowKey')).eql(6);

    await dataGrid.apiCancelEditData();

    await t.expect(dataGrid.option('focusedRowKey')).eql(6);

    await dataGrid.apiEditCell(0, 1);

    await dataGrid.apiCellValue(0, 1, 'test');

    await t.expect(dataGrid.option('focusedRowKey')).eql(6);

    await dataGrid.apiSaveEditData();

    await t.expect(dataGrid.option('focusedRowKey')).eql(6);
  }).before(async () => createWidget('dxDataGrid', {
    dataSource: [
      { id: 5, c0: 'c0_0' },
      { id: 6, c0: 'c0_1' },
    ],
    keyExpr: 'id',
    focusedRowEnabled: true,
    focusedRowKey: 6,
    editing: {
      mode: mode.toLowerCase() as any,
      allowUpdating: true,
    },
  }));
});

test('Focused row should not fire onFocusedRowChanging, onFocusedRowChanged events on scrolling if scrolling.mode and rowRenderingMode are virtual', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t.expect(dataGrid.getFocusedRow().exists).ok();

  await ClientFunction(() => {
    const { widget } = window as any;
    const scrollable = widget.getScrollable();
    scrollable.scrollTo({ top: 2000 });
  })();
  await t.wait(500);

  await t.expect(ClientFunction(() => (window as any).focusedRowChanging_Counter)()).eql(undefined);
  await t.expect(ClientFunction(() => (window as any).focusedRowChanged_Counter)()).eql(1);

  await ClientFunction(() => {
    const { widget } = window as any;
    const scrollable = widget.getScrollable();
    scrollable.scrollTo({ top: 0 });
  })();
  await t.wait(500);

  await t.expect(ClientFunction(() => (window as any).focusedRowChanging_Counter)()).eql(undefined);
  await t.expect(ClientFunction(() => (window as any).focusedRowChanged_Counter)()).eql(1);
}).before(async () => createWidget('dxDataGrid', () => {
  const data = ((): Record<string, unknown>[] => {
    const result: { id: number; c0: string; c1: string }[] = [];

    for (let i = 0; i < 200; i += 1) {
      result.push({ id: i, c0: 'c0', c1: `c1_${i % 20}` });
    }

    return result;
  })();

  return {
    height: 300,
    keyExpr: 'id',
    dataSource: data,
    focusedRowEnabled: true,
    focusedRowKey: 1,
    editing: {
      allowAdding: true,
      allowUpdating: true,
      mode: 'form',
    },
    masterDetail: {
      enabled: true,
      template: (container): any => {
        (container.append($('<div>') as any) as any).dxDataGrid({
          height: 500,
          keyExpr: 'id',
          dataSource: data,
          editing: {
            allowAdding: true,
            allowUpdating: true,
            mode: 'batch',
          },
        });
      },
    },
    columns: [
      'id',
      'c0',
      {
        dataField: 'c1',
        groupIndex: 0,
      },
    ],
    paging: {
      pageSize: 5,
    },
    scrolling: {
      mode: 'virtual',
      rowRenderingMode: 'virtual',
    },
    onFocusedRowChanging: (): void => {
      const global = window as Window & typeof globalThis & { focusedRowChanging_Counter: number };
      if (!global.focusedRowChanging_Counter) {
        global.focusedRowChanging_Counter = 0;
      }
      global.focusedRowChanging_Counter += 1;
    },
    onFocusedRowChanged: (): void => {
      const global = window as Window & typeof globalThis & { focusedRowChanged_Counter: number };
      if (!global.focusedRowChanged_Counter) {
        global.focusedRowChanged_Counter = 0;
      }
      global.focusedRowChanged_Counter += 1;
    },
  };
}));

test('Scrolling should work if scrolling.mode and rowRenderingMode are virtual row is focused (T907192)', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t
    .expect(dataGrid.getFocusedRow().exists).ok()
    .click(dataGrid.element, { offsetX: 195, offsetY: 180 })
    .expect(dataGrid.getFocusedRow().exists)
    .notOk();
}).before(async () => createWidget('dxDataGrid', () => {
  const data = ((): Record<string, unknown>[] => {
    const result: { id: number }[] = [];
    for (let i = 0; i < 100; i += 1) {
      result.push({ id: i + 1 });
    }
    return result;
  })();

  return {
    height: 200,
    width: 200,
    keyExpr: 'id',
    dataSource: data,
    focusedRowEnabled: true,
    focusedRowKey: 1,
    columns: ['id'],
    scrolling: {
      mode: 'virtual',
      rowRenderingMode: 'virtual',
      showScrollbar: 'always',
    },
  };
}));

test('Scrolling should not occured after deleting via push API if scrolling.mode is virtual (T930434)', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t
    .expect(dataGrid.getFocusedRow().exists).ok();

  const scrollTop = await dataGrid.getScrollTop();

  await t
    .expect(scrollTop).gt(0)
    .click('button')
    .click(dataGrid.getDataCell(9, 0).element)
    .click('button')
    .expect(dataGrid.getScrollTop())
    .eql(scrollTop);
}).before(async () => {
  await ClientFunction(() => {
    $('<button>').text('Delete').on('click', () => {
      const { widget } = window as any;
      const focusedRowKey = widget.option('focusedRowKey');
      widget.option('focusedRowKey', undefined);
      widget.getDataSource().store().push([{ type: 'remove', key: focusedRowKey }]);
    }).prependTo('body');
  })();
  await createWidget('dxDataGrid', () => {
    const data = ((): Record<string, unknown>[] => {
      const result: { id: number }[] = [];
      for (let i = 0; i < 20; i += 1) {
        result.push({ id: i + 1 });
      }
      return result;
    })();

    return {
      height: 200,
      width: 200,
      dataSource: {
        store: {
          type: 'array',
          key: 'id',
          data,
        },
        pushAggregationTimeout: 0,
      },
      focusedRowEnabled: true,
      focusedRowKey: 10,
      columns: ['id'],
      scrolling: {
        mode: 'virtual',
      },
    };
  });
}).after(async () => {
  await ClientFunction(() => {
    $('button').remove();
  })();
});

['virtual', 'infinite'].forEach((scrollingMode) => {
  test(`Row should be focused after reloading the data source (scrolling.mode is ${scrollingMode}) (T1022502)`, async (t) => {
    const dataGrid = new DataGrid('#container');
    const reloadDataSource = ClientFunction(() => (window as any).widget.getDataSource().reload());
    const getVisibleRowCount = ClientFunction(() => (window as any).widget.getVisibleRows().length);

    // assert
    await t
      .expect(getVisibleRowCount()).eql(30)
      .expect(dataGrid.getDataRow(20).isFocusedRow).ok();

    // act
    await reloadDataSource();

    // assert
    await t
      .expect(getVisibleRowCount()).eql(30)
      .expect(dataGrid.getDataRow(20).isFocusedRow).ok();
  }).before(async () => {
    const data = ((): Record<string, unknown>[] => {
      const result: { ID: number; Name: string }[] = [];
      for (let i = 0; i < 30; i += 1) {
        result.push({
          ID: i + 1,
          Name: `Name ${i + 1}`,
        });
      }
      return result;
    })();
    return createWidget('dxDataGrid', {
      height: 2000,
      dataSource: data,
      keyExpr: 'ID',
      focusedRowEnabled: true,
      focusedRowIndex: 20,
      scrolling: {
        mode: scrollingMode as any,
        useNative: false,
        // @ts-expect-error private option
        prerenderedRowCount: 10,
      },
    });
  });
});

test('Scroll should not change focused row if focus method is called inside onContentReady (T1047794)', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t
    .expect(dataGrid.option('focusedRowKey')).eql(1)
    .expect(dataGrid.getDataRow(0).isFocusedRow).ok();

  // act
  await dataGrid.scrollTo(t, { y: 200 });
  await dataGrid.scrollTo(t, { y: 0 });

  // assert
  await t
    .expect(dataGrid.option('focusedRowKey')).eql(1)
    .expect(dataGrid.getDataRow(0).isFocusedRow).ok();
}).before(async () => {
  const data = ((): Record<string, unknown>[] => {
    const result: { ID: number; Name: string }[] = [];
    for (let i = 0; i < 30; i += 1) {
      result.push({
        ID: i + 1,
        Name: `Name ${i + 1}`,
      });
    }
    return result;
  })();
  return createWidget('dxDataGrid', {
    height: 400,
    dataSource: data,
    keyExpr: 'ID',
    focusedRowEnabled: true,
    onContentReady(e) {
      e.component.focus();
    },
    scrolling: {
      mode: 'virtual',
    },
  });
});

const clearLocalStorage = ClientFunction(() => {
  (window as any).localStorage.removeItem('mystate');
});
const getItems = (): Record<string, unknown>[] => {
  const items: Record<string, unknown>[] = [];
  for (let i = 0; i < 100; i += 1) {
    items.push({
      ID: i + 1,
      Name: `Name ${i + 1}`,
    });
  }
  return items;
};

const getDataGridConfig = (): any => ({
  dataSource: getItems(),
  keyExpr: 'ID',
  height: 500,
  stateStoring: {
    enabled: true,
    type: 'custom',
    customSave: (state) => {
      localStorage.setItem('mystate', JSON.stringify(state));
    },
    customLoad: () => {
      let state = localStorage.getItem('mystate');
      if (state) {
        state = JSON.parse(state);
      }
      return state;
    },
  },
  scrolling: {
    mode: 'virtual',
  },
  focusedRowEnabled: true,
  focusedRowKey: 90,
});

test('Focused row should be shown after reloading the page (T1058983)', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t
    .wait(1000);
  let scrollTopPosition = await dataGrid.getScrollTop();

  // assert
  await t
    .expect(dataGrid.isFocusedRowInViewport())
    .ok();

  // act
  await dataGrid.scrollTo(t, { top: 0 });
  scrollTopPosition = await dataGrid.getScrollTop();

  // assert
  await t
    .expect(scrollTopPosition)
    .eql(0);

  // act
  await t
    .eval(() => location.reload());
  await createWidget('dxDataGrid', getDataGridConfig());
  await t
    .wait(1000);

  scrollTopPosition = await dataGrid.getScrollTop();

  // assert
  await t
    .expect(dataGrid.isFocusedRowInViewport())
    .ok();
}).before(async () => {
  await clearLocalStorage();
  return createWidget('dxDataGrid', getDataGridConfig());
}).after(async () => {
  await clearLocalStorage();
});

test.skip('It is possible to focus row that was added via push method if previously row with same index was focused (T1202646)', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t.click(dataGrid.getDataRow(0).element);

  await ClientFunction(() => {
    const grid = ($('#container') as any).dxDataGrid('instance');
    grid.getDataSource().store().push([{
      type: 'insert',
      data: { value: 2 },
    }]);
  })();

  await t.click(dataGrid.getDataRow(0).element);

  await t.expect(dataGrid.getDataRow(0).isFocusedRow).ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: {
    store: {
      type: 'array',
      data: [{ value: 1 }],
    },
    reshapeOnPush: true,
  },
  keyExpr: 'value',
  repaintChangesOnly: true,
  focusedRowEnabled: true,
  columns: [
    {
      dataField: 'value',
      sortOrder: 'desc',
    },
  ],
}));
