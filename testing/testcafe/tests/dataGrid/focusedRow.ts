import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/testHelper';
import { ClientFunction } from 'testcafe';
import DataGrid from '../../model/dataGrid';

fixture`Focused row`
    .page(url(__dirname, '../container.html'));

test('onFocusedRowChanged event should fire once after changing focusedRowKey if paging.enabled = false (T755722)', async t => {
    const dataGrid = new DataGrid('#container');

    await t.expect(ClientFunction(() => (window as any).onFocusedRowChangedCounter)()).eql(1);

    await ClientFunction(() => (window as any).widget.option('focusedRowKey', 'Ben'))();

    await t
        .expect(dataGrid.getFocusedRow().exists).ok()
        .expect(ClientFunction(() => (window as any).onFocusedRowChangedCounter)()).eql(2);
}).before(() => createWidget('dxDataGrid', {
    dataSource: [
        { name: 'Alex', phone: '111111', room: 6 },
        { name: 'Dan', phone: '2222222', room: 5 },
        { name: 'Ben', phone: '333333', room: 4 }
    ],
    keyExpr: 'name',
    focusedRowEnabled: true,
    focusedRowIndex: 1,
    paging: {
        enabled: false
    },
    onFocusedRowChanged: () => {
        const global = window as any;
        if (!global.onFocusedRowChangedCounter) {
            global.onFocusedRowChangedCounter = 0;
        }
        global.onFocusedRowChangedCounter++;
    }
}));

test('Form - Focused row should not be reset after editing a row (T851400)', async t => {
    const dataGrid = new DataGrid('#container');
    const dataRow0 = dataGrid.getDataRow(0);
    const dataRow1 = dataGrid.getDataRow(1);
    const editForm = dataGrid.getEditForm();
    const editor = editForm.getItem('c0');

    await t
        .expect(dataRow1.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(6)
        .click(dataRow1.getCommandCell(2).getButton(0))
        .expect(editForm.element.exists).ok()
        .click(editForm.cancelButton)
        .expect(dataRow1.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(6);

    await t
        .click(dataRow1.getCommandCell(2).getButton(0))
        .expect(editForm.element.exists).ok()
        .click(editor)
        .typeText(editor, 'test')
        .click(editForm.saveButton)
        .expect(dataRow1.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(6);

    await t
        .click(dataRow0.getCommandCell(2).getButton(0))
        .expect(editForm.element.exists).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(5)
        .click(editForm.cancelButton)
        .expect(dataRow0.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(5);

    await t
        .click(dataRow0.getCommandCell(2).getButton(0))
        .expect(editForm.element.exists).ok()
        .click(editor)
        .typeText(editor, 'test')
        .click(editForm.saveButton)
        .expect(dataRow0.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(5);

}).before(() => createWidget('dxDataGrid', {
    dataSource: [
        { id: 5, c0: 'c0_0' },
        { id: 6, c0: 'c0_1' }
    ],
    keyExpr: 'id',
    focusedRowEnabled: true,
    focusedRowKey: 6,
    editing: {
        mode: 'form',
        allowUpdating: true
    }
}));

test('Popup - Focused row should not be reset after editing a row (T879627)', async t => {
    const dataGrid = new DataGrid('#container');
    const dataRow0 = dataGrid.getDataRow(0);
    const dataRow1 = dataGrid.getDataRow(1);
    const popupEditForm = dataGrid.getPopupEditForm();
    const editor = popupEditForm.getItem('c0');

    await t
        .expect(dataRow1.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(6)
        .click(dataRow1.getCommandCell(2).getButton(0))
        .expect(popupEditForm.element.visible).ok()
        .click(popupEditForm.cancelButton)
        .expect(dataRow1.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(6);

    await t
        .click(dataRow1.getCommandCell(2).getButton(0))
        .expect(popupEditForm.element.visible).ok()
        .click(editor)
        .typeText(editor, 'test')
        .click(popupEditForm.saveButton)
        .expect(dataRow1.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(6);

    await t
        .click(dataRow0.getCommandCell(2).getButton(0))
        .expect(popupEditForm.element.visible).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(5)
        .click(popupEditForm.cancelButton)
        .expect(dataRow0.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(5);

    await t
        .click(dataRow0.getCommandCell(2).getButton(0))
        .expect(popupEditForm.element.visible).ok()
        .click(editor)
        .typeText(editor, 'test')
        .click(popupEditForm.saveButton)
        .expect(dataRow0.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(5);

}).before(() => createWidget('dxDataGrid', {
    dataSource: [
        { id: 5, c0: 'c0_0' },
        { id: 6, c0: 'c0_1' }
    ],
    keyExpr: 'id',
    focusedRowEnabled: true,
    focusedRowKey: 6,
    editing: {
        mode: 'popup',
        allowUpdating: true,
        popup: {
            animation: null
        }
    }
}));

["Form", "Popup"].forEach(mode => {
    test(`${mode} - Focused row should not be reset after editing a row by API (T879627)`, async t => {
        const dataGrid = new DataGrid('#container');
        const dataRow1 = dataGrid.getDataRow(1);

        await t
            .expect(dataGrid.option('focusedRowKey')).eql(6)
            .expect(dataRow1.isFocusedRow).ok();

        await dataGrid.api_editRow(1);

        await t.expect(dataGrid.option('focusedRowKey')).eql(6);

        await dataGrid.api_cancelEditData();

        await t.expect(dataGrid.option('focusedRowKey')).eql(6);

        await dataGrid.api_editRow(0);

        await t.expect(dataGrid.option('focusedRowKey')).eql(6);

        await dataGrid.api_saveEditData();

        await t.expect(dataGrid.option('focusedRowKey')).eql(6);

    }).before(() => createWidget('dxDataGrid', {
        dataSource: [
            { id: 5, c0: 'c0_0' },
            { id: 6, c0: 'c0_1' }
        ],
        keyExpr: 'id',
        focusedRowEnabled: true,
        focusedRowKey: 6,
        editing: {
            mode: mode.toLowerCase(),
            allowUpdating: true,
            popup: {
                animation: null
            }
        }
    }));
});

test('Row - Focused row should not be reset after editing a row (T879627)', async t => {
    const dataGrid = new DataGrid('#container');
    const dataRow0 = dataGrid.getDataRow(0);
    const dataRow1 = dataGrid.getDataRow(1);

    await t
        .expect(dataRow1.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(6)
        .click(dataRow1.getCommandCell(2).getButton(0))
        .expect(dataRow1.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(6)
        .click(dataRow1.getCommandCell(2).getButton(1))
        .expect(dataRow1.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(6);

    let editor = dataRow1.getDataCell(1).getEditor();

    await t
        .click(dataRow1.getCommandCell(2).getButton(0))
        .click(editor.element)
        .typeText(editor.element, 'test')
        .click(dataRow1.getCommandCell(2).getButton(0))
        .expect(dataRow1.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(6);

    await t
        .click(dataRow0.getCommandCell(2).getButton(0))
        .expect(dataGrid.option('focusedRowKey')).eql(5)
        .click(dataRow0.getCommandCell(2).getButton(1))
        .expect(dataRow0.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(5);

    editor = dataRow0.getDataCell(1).getEditor();

    await t
        .click(dataRow0.getCommandCell(2).getButton(0))
        .click(editor.element)
        .typeText(editor.element, 'test')
        .click(dataRow0.getCommandCell(2).getButton(0))
        .expect(dataRow0.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(5);

}).before(() => createWidget('dxDataGrid', {
    dataSource: [
        { id: 5, c0: 'c0_0' },
        { id: 6, c0: 'c0_1' }
    ],
    keyExpr: 'id',
    focusedRowEnabled: true,
    focusedRowKey: 6,
    editing: {
        mode: 'row',
        allowUpdating: true
    }
}));

test('Row - Focused row should be reset after editing a row by API (T879627)', async t => {
    const dataGrid = new DataGrid('#container');
    const dataRow1 = dataGrid.getDataRow(1);

    await t
        .expect(dataGrid.option('focusedRowKey')).eql(6)
        .expect(dataRow1.isFocusedRow).ok();

    await dataGrid.api_editRow(1);

    await t.expect(dataGrid.option('focusedRowKey')).eql(6);

    await dataGrid.api_cancelEditData();

    await t.expect(dataGrid.option('focusedRowKey')).eql(6);

    await dataGrid.api_editRow(0);

    await t.expect(dataGrid.option('focusedRowKey')).eql(5);

    await dataGrid.api_saveEditData();

    await t.expect(dataGrid.option('focusedRowKey')).eql(5);

}).before(() => createWidget('dxDataGrid', {
    dataSource: [
        { id: 5, c0: 'c0_0' },
        { id: 6, c0: 'c0_1' }
    ],
    keyExpr: 'id',
    focusedRowEnabled: true,
    focusedRowKey: 6,
    editing: {
        mode: 'row',
        allowUpdating: true
    }
}));

test('Cell - Focused row should not be reset after editing a cell (T879627)', async t => {
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
        .expect(editor.element.exists).ok()
        .expect(dataRow1.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(6)
        .pressKey('esc')
        .expect(editor.element.exists).notOk()
        .expect(dataRow1.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(6);

    await t
        .click(dataCell11.element)
        .expect(editor.element.exists).ok()
        .click(editor.element)
        .typeText(editor.element, 'test')
        .pressKey('enter')
        .expect(editor.element.exists).notOk()
        .expect(dataRow1.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(6);

    editor = dataCell01.getEditor();

    await t
        .click(dataCell01.element)
        .expect(editor.element.exists).ok()
        .expect(dataRow0.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(5)
        .pressKey('esc')
        .expect(dataRow0.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(5);

    await t
        .click(dataCell01.element)
        .expect(editor.element.exists).ok()
        .click(editor.element)
        .typeText(editor.element, 'test')
        .pressKey('enter')
        .expect(editor.element.exists).notOk()
        .expect(dataRow0.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(5);

}).before(() => createWidget('dxDataGrid', {
    dataSource: [
        { id: 5, c0: 'c0_0' },
        { id: 6, c0: 'c0_1' }
    ],
    keyExpr: 'id',
    focusedRowEnabled: true,
    focusedRowKey: 6,
    editing: {
        mode: 'cell',
        allowUpdating: true
    }
}));

test('Batch - Focused row should not be reset after editing a cell (T879627)', async t => {
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
        .expect(editor.element.exists).ok()
        .expect(dataRow1.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(6)
        .pressKey('esc')
        .expect(editor.element.exists).notOk()
        .expect(dataRow1.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(6);

    await t
        .click(dataCell11.element)
        .expect(editor.element.exists).ok()
        .click(editor.element)
        .typeText(editor.element, 'test')
        .pressKey('enter')
        .expect(editor.element.exists).notOk()
        .expect(dataRow1.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(6)
        .click(saveButton)
        .expect(dataRow1.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(6);

    editor = dataCell01.getEditor();

    await t
        .click(dataCell01.element)
        .expect(editor.element.exists).ok()
        .expect(dataRow0.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(5)
        .pressKey('esc')
        .expect(dataRow0.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(5);

    await t
        .click(dataCell01.element)
        .expect(editor.element.exists).ok()
        .click(editor.element)
        .typeText(editor.element, 'test')
        .pressKey('enter')
        .expect(editor.element.exists).notOk()
        .expect(dataRow0.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(5)
        .click(saveButton)
        .expect(dataRow0.isFocusedRow).ok()
        .expect(dataGrid.option('focusedRowKey')).eql(5);

}).before(() => createWidget('dxDataGrid', {
    dataSource: [
        { id: 5, c0: 'c0_0' },
        { id: 6, c0: 'c0_1' }
    ],
    keyExpr: 'id',
    focusedRowEnabled: true,
    focusedRowKey: 6,
    editing: {
        mode: 'batch',
        allowUpdating: true
    }
}));

["Cell", "Batch"].forEach(mode => {
    test(`${mode} - Focused row should not be reset after editing a cell by API (T879627)`, async t => {
        const dataGrid = new DataGrid('#container');
        const dataRow1 = dataGrid.getDataRow(1);

        await t
            .expect(dataGrid.option('focusedRowKey')).eql(6)
            .expect(dataRow1.isFocusedRow).ok();

        await dataGrid.api_editCell(1, 1);

        await t.expect(dataGrid.option('focusedRowKey')).eql(6);

        await dataGrid.api_cancelEditData();

        await t.expect(dataGrid.option('focusedRowKey')).eql(6);

        await dataGrid.api_editCell(0, 1);

        await dataGrid.api_cellValue(0, 1, 'test');

        await t.expect(dataGrid.option('focusedRowKey')).eql(6);

        await dataGrid.api_saveEditData();

        await t.expect(dataGrid.option('focusedRowKey')).eql(6);

    }).before(() => createWidget('dxDataGrid', {
        dataSource: [
            { id: 5, c0: 'c0_0' },
            { id: 6, c0: 'c0_1' }
        ],
        keyExpr: 'id',
        focusedRowEnabled: true,
        focusedRowKey: 6,
        editing: {
            mode: mode.toLowerCase(),
            allowUpdating: true
        }
    }));
});

test('Focused row should not fire onFocusedRowChanging, onFocusedRowChanged events on scrolling if scrolling.mode and rowRenderingMode are virtual', async t => {
    const dataGrid = new DataGrid('#container');

    await t.expect(dataGrid.getFocusedRow().exists).ok();

    await ClientFunction(() => {
        const widget = (window as any).widget;
        const scrollable = widget.getScrollable();
        scrollable.scrollTo({ top: 2000 });
    })();
    await t.wait(500);

    await t.expect(ClientFunction(() => (window as any).focusedRowChanging_Counter)()).eql(undefined);
    await t.expect(ClientFunction(() => (window as any).focusedRowChanged_Counter)()).eql(1);

    await ClientFunction(() => {
        const widget = (window as any).widget;
        const scrollable = widget.getScrollable();
        scrollable.scrollTo({ top: 0 });
    })();
    await t.wait(500);

    await t.expect(ClientFunction(() => (window as any).focusedRowChanging_Counter)()).eql(undefined);
    await t.expect(ClientFunction(() => (window as any).focusedRowChanged_Counter)()).eql(1);
}).before(() => createWidget('dxDataGrid', () => {
    const data = function() {
        let data = [];

        for(let i = 0; i < 200; i++) {
            data.push({ id: i, c0: `c0`, c1: `c1_${i % 20}` });
        }

        return data;
    }();

    return {
        height: 300,
        keyExpr: "id",
        dataSource: data,
        focusedRowEnabled: true,
        focusedRowKey: 1,
        editing: {
            allowAdding: true,
            allowUpdating: true,
            mode: 'form'
        },
        masterDetail: {
            enabled: true,
            template: container => {
                container.append($("<div>")['dxDataGrid']({
                    height: 500,
                    keyExpr: "id",
                    dataSource: data,
                    editing: {
                        allowAdding: true,
                        allowUpdating: true,
                        mode: 'batch'
                    }
                }));
            }
        },
        columns: [
            'id',
            'c0',
            {
                dataField: 'c1',
                groupIndex: 0
            }
        ],
        paging: {
            pageSize: 5
        },
        scrolling: {
            mode: 'virtual',
            rowRenderingMode: 'virtual'
        },
        onFocusedRowChanging: () => {
            if(!(window as any).focusedRowChanging_Counter) {
                (window as any).focusedRowChanging_Counter = 0;
            }
            (window as any).focusedRowChanging_Counter++;
        },
        onFocusedRowChanged: () => {
            if(!(window as any).focusedRowChanged_Counter) {
                (window as any).focusedRowChanged_Counter = 0;
            }
            (window as any).focusedRowChanged_Counter++;
        }
    };
}));
