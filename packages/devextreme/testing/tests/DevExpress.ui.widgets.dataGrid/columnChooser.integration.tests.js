import $ from 'jquery';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';
import messageLocalization from 'common/core/localization/message';

QUnit.testStart(function() {
    const gridMarkup = `
        <div id='container'>
            <div id="dataGrid"></div>
        </div>
    `;

    $('#qunit-fixture').html(gridMarkup);
});

QUnit.module('Column chooser', baseModuleConfig, () => {
    QUnit.test('columns should be draggable when column chooser is open', function(assert) {
        // act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columns: [{ dataField: 'field1' }, { dataField: 'field2' }],
            dataSource: []
        });

        // assert
        assert.strictEqual($(dataGrid.$element()).find('.dx-datagrid-drag-action').length, 0, 'no drag actions');
        assert.strictEqual($(dataGrid.$element()).find('.dx-datagrid-action').length, 2, 'two actions');

        // act
        dataGrid.showColumnChooser();

        // assert
        const $draggableColumns = $(dataGrid.$element()).find('.dx-datagrid-drag-action');

        assert.strictEqual($draggableColumns.length, 2, 'columns should be draggable');
    });

    QUnit.test('last column should be draggable to column chooser', function(assert) {
        // act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columns: [{ dataField: 'field1' }],
            dataSource: []
        });

        // act
        dataGrid.showColumnChooser();

        // assert
        const $draggableColumns = $(dataGrid.$element()).find('.dx-datagrid-drag-action');

        assert.strictEqual($draggableColumns.length, 1, 'column should be draggable');
    });

    QUnit.test('columns should not be draggable if columnChooser.mode=select', function(assert) {
        // act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columns: [{ dataField: 'field1' }, { dataField: 'field2' }],
            dataSource: [],
            columnChooser: { mode: 'select' }
        });

        // assert
        assert.strictEqual($(dataGrid.$element()).find('.dx-datagrid-drag-action').length, 0, 'no drag actions');
        assert.strictEqual($(dataGrid.$element()).find('.dx-datagrid-action').length, 2, 'two actions');

        // act
        dataGrid.showColumnChooser();

        // assert
        const $draggableColumns = $(dataGrid.$element()).find('.dx-datagrid-drag-action');

        assert.strictEqual($draggableColumns.length, 0, 'columns should not be draggable');
    });

    // T862537
    QUnit.test('column with allowHiding=false should not be draggable', function(assert) {
        // act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columns: [{ dataField: 'field1', allowHiding: false }, { dataField: 'field2' }],
            dataSource: []
        });

        // assert
        assert.strictEqual($(dataGrid.$element()).find('.dx-datagrid-drag-action').length, 0, 'no drag actions');
        assert.strictEqual($(dataGrid.$element()).find('.dx-datagrid-action').length, 2, 'two actions');

        // act
        dataGrid.showColumnChooser();

        // assert
        const $draggableColumn = $(dataGrid.$element()).find('.dx-datagrid-drag-action');

        assert.strictEqual($draggableColumn.length, 1, 'column with no allowHiding=false should be draggable');
        assert.strictEqual($draggableColumn.text(), 'Field 2');
    });

    // T1109671
    QUnit.test('Column Chooser popup should have label, role attributes', function(assert) {
        // act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columns: [{ dataField: 'field1', allowHiding: false }, { dataField: 'field2' }],
            dataSource: [],
            columnChooser: { enabled: true },
        });

        // act
        dataGrid.showColumnChooser();

        // assert
        const popupContainer = dataGrid.getView('columnChooserView')._popupContainer;
        const $popupContent = popupContainer.$content().parent();

        assert.strictEqual($popupContent.attr('aria-label'), messageLocalization.format('dxDataGrid-columnChooserTitle'), 'has aria-label attribute');
        assert.strictEqual($popupContent.attr('role'), 'dialog', 'has role="dialog" attribute');
    });

    QUnit.test('Correct runtime changing of a columnChooser mode (string)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columns: [{ dataField: 'field1', allowSorting: false }, { dataField: 'field2' }],
            dataSource: []
        });

        // act
        dataGrid.showColumnChooser();

        let $overlayWrapper = dataGrid.getView('columnChooserView')._popupContainer.$wrapper();

        assert.ok($overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-drag'), 'has dragAndDrop mode class');
        assert.ok(!$overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-select'), 'hasn\'t select mode class');

        dataGrid.option('columnChooser.mode', 'select');

        $overlayWrapper = dataGrid.getView('columnChooserView')._popupContainer.$wrapper();

        // assert
        assert.ok(!$overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-drag'), 'hasn\'t dragAndDrop mode class');
        assert.ok($overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-select'), 'has select mode class');
    });

    QUnit.test('Correct runtime changing of a columnChooser mode (object)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columns: [{ dataField: 'field1', allowSorting: false }, { dataField: 'field2' }],
            dataSource: []
        });

        // act
        dataGrid.showColumnChooser();

        let $overlayWrapper = dataGrid.getView('columnChooserView')._popupContainer.$wrapper();

        assert.ok($overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-drag'), 'has dragAndDrop mode class');
        assert.ok(!$overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-select'), 'hasn\'t select mode class');

        dataGrid.option({ columnChooser: { mode: 'select' } });

        $overlayWrapper = dataGrid.getView('columnChooserView')._popupContainer.$wrapper();

        // assert
        assert.ok(!$overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-drag'), 'hasn\'t dragAndDrop mode class');
        assert.ok($overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-select'), 'has select mode class');
    });

    QUnit.test('ColumnChooser\'s treeView get correct default config (without checkboxes)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columnChooser: { mode: 'select' },
            columns: [{ dataField: 'field1', allowSorting: false }, { dataField: 'field2', visible: false }],
            dataSource: []
        });

        // act
        dataGrid.showColumnChooser();

        let $overlayWrapper = dataGrid.getView('columnChooserView')._popupContainer.$wrapper();

        assert.ok($overlayWrapper.find('.dx-checkbox').length, 'There are checkboxes in columnChooser');

        dataGrid.option({ columnChooser: { mode: 'dragAndDrop' } });

        $overlayWrapper = dataGrid.getView('columnChooserView')._popupContainer.$wrapper();

        // assert
        assert.ok(!$overlayWrapper.find('.dx-checkbox').length, 'There aren\'t checkboxes in columnChooser');
    });

    QUnit.test('ColumnChooser popup\'s position can be changed', function(assert) {
        // arrange
        let position = { my: 'left bottom', at: 'left bottom', of: '#dataGrid' };

        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columnChooser: { mode: 'select', position },
            columns: [{ dataField: 'field1' }, { dataField: 'field2' }],
            dataSource: []
        });

        // act
        dataGrid.showColumnChooser();

        // assert
        assert.propEqual(dataGrid.getView('columnChooserView')._popupContainer.option('position'), position);

        // act
        position = { my: 'right top', at: 'right top', of: '#dataGrid' };
        dataGrid.option('columnChooser.position', position);
        dataGrid.showColumnChooser();

        // asert
        assert.propEqual(dataGrid.getView('columnChooserView')._popupContainer.option('position'), position);
    });

    QUnit.test('Column chooser selection.allowSelectAll option should work', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columnChooser: {
                mode: 'select',
                selection: { allowSelectAll: true }
            },
            columns: [
                {
                    caption: 'band1',
                    columns: [
                        { dataField: 'field1' },
                        { dataField: 'field2' }
                    ]
                },
                { dataField: 'field3' },
                { dataField: 'field4' },
            ],
            dataSource: []
        });

        const getSelectAllCheckbox = () => $('.dx-treeview-select-all-item').dxCheckBox('instance');
        const getVisibleColumns = () => dataGrid.getVisibleColumns().filter(item => !item.command);

        // act
        dataGrid.showColumnChooser();

        // assert

        assert.ok($('.dx-treeview-select-all-item').length, 'there is \'Select all\' checkbox');

        // act
        getSelectAllCheckbox().option('value', false);
        this.clock.tick(500);

        // assert
        assert.strictEqual(getVisibleColumns().length, 0, 'No column should be shown');

        // act
        getSelectAllCheckbox().option('value', true);
        this.clock.tick(500);

        // assert
        assert.strictEqual(getVisibleColumns().length, 4, 'All columns are shown');
    });

    QUnit.test('Column chooser selection.allowSelectAll option should work with column which has allowHiding=false', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columnChooser: {
                mode: 'select',
                selection: { allowSelectAll: true }
            },
            columns: [
                {
                    caption: 'band1',
                    columns: [
                        { dataField: 'field1' }, { dataField: 'field2' }
                    ]
                },
                {
                    caption: 'band2',
                    columns: [
                        { dataField: 'field3', allowHiding: false }
                    ]
                },
                { dataField: 'field4' },
                { dataField: 'field5', allowHiding: false }
            ],
            dataSource: []
        });

        const getSelectAllCheckbox = () => $('.dx-treeview-select-all-item').dxCheckBox('instance');
        const getVisibleColumns = () => dataGrid.getVisibleColumns().filter(item => !item.command);

        // act
        dataGrid.showColumnChooser();

        getSelectAllCheckbox().option('value', false);
        this.clock.tick(500);

        // assert
        assert.strictEqual(getVisibleColumns().length, 1, 'Only column without band column and with allowHiding=false is shown');
        assert.strictEqual(getVisibleColumns()[0].dataField, 'field5');

        // act
        const treeView = $('.dx-treeview').dxTreeView('instance');
        const selectedNodes = treeView.getSelectedNodes();

        // assert
        assert.ok(selectedNodes.some(node => node.itemData.text === 'Field 3'), 'field2 is checked');
        assert.ok(selectedNodes.some(node => node.itemData.text === 'Field 5'), 'field5 is checked');

        // act
        getSelectAllCheckbox().option('value', true);
        this.clock.tick(500);

        // assert
        assert.strictEqual(getVisibleColumns().length, 5, 'All columns are shown');
    });

    QUnit.test('Column chooser selection.recursive should work', function(assert) {
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columnChooser: {
                mode: 'select',
                selection: { recursive: true }
            },
            columns: [{
                caption: 'band1',
                columns: [
                    { dataField: 'field1' },
                    { dataField: 'field2' }
                ]
            }, { dataField: 'field3' }],
            dataSource: []
        });

        // act
        dataGrid.showColumnChooser();

        const treeView = $('.dx-treeview').dxTreeView('instance');
        const items = $('.dx-item.dx-treeview-item');
        const bandColumnItem = items[0];

        treeView.unselectItem(bandColumnItem);
        this.clock.tick(500);

        // assert
        assert.strictEqual(dataGrid.getVisibleColumns().length, 1, 'All columns under band column should be deselected');
        assert.strictEqual(dataGrid.getVisibleColumns()[0].dataField, 'field3', 'All columns under band column should be deselected');

        // act
        treeView.selectItem(bandColumnItem);
        this.clock.tick(500);

        // assert
        assert.strictEqual(dataGrid.getVisibleColumns().length, 3, 'All columns should be selected');
    });

    QUnit.test('Column chooser selection.recursive should work with column with allowHiding=false', function(assert) {
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columnChooser: {
                mode: 'select',
                selection: { recursive: true }
            },
            columns: [{
                caption: 'band1',
                columns: [
                    { dataField: 'field1' },
                    { dataField: 'field2', allowHiding: false }
                ]
            }],
            dataSource: []
        });

        // act
        dataGrid.showColumnChooser();

        const treeView = $('.dx-treeview').dxTreeView('instance');
        const items = $('.dx-item.dx-treeview-item');
        const bandColumnItem = items[0];

        treeView.unselectItem(bandColumnItem);
        this.clock.tick(500);

        // assert
        assert.strictEqual(dataGrid.getVisibleColumns().length, 1, 'Column with allowHiding=false should not be deselected');
        assert.strictEqual(dataGrid.getVisibleColumns()[0].dataField, 'field2');
    });

    QUnit.test('Column chooser with enabled selectAll and recursion should work correctly when unselect all', function(assert) {
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columnChooser: {
                mode: 'select',
                selection: {
                    allowSelectAll: true,
                    recursive: true
                }
            },
            columns: [
                'field1',
                {
                    caption: 'band1',
                    columns: [
                        { dataField: 'field2' },
                        { dataField: 'field3', allowHiding: false }
                    ]
                }
            ],
            dataSource: []
        });

        const getSelectAllCheckbox = () => $('.dx-treeview-select-all-item').dxCheckBox('instance');
        const getVisibleColumns = () => dataGrid.getVisibleColumns().filter(item => !item.command);

        // act
        dataGrid.showColumnChooser();

        getSelectAllCheckbox().option('value', false);
        this.clock.tick(500);

        // assert
        assert.strictEqual(getVisibleColumns().length, 1, 'Only column with allowHiding=false is shown');
        assert.strictEqual(getVisibleColumns()[0].dataField, 'field3');

        // act
        const treeView = $('.dx-treeview').dxTreeView('instance');
        const nodes = treeView.getNodes();

        // assert
        const field1 = nodes[0];

        assert.strictEqual(field1.selected, false, 'Field 1 column is unselected');

        // assert
        const band1 = nodes[1];
        const field2 = band1.children[0];
        const field3 = band1.children[1];

        assert.strictEqual(band1.selected, undefined, 'Band column is in intermediate state');
        assert.strictEqual(field2.selected, false, 'Field 2 column is unselected');
        assert.strictEqual(field3.selected, true, 'Field 3 column is selected');
    });

    QUnit.test('Column chooser column with allowHiding=false should be disabled', function(assert) {
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columnChooser: {
                mode: 'select',
                selection: { selectByClick: true }
            },
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3', allowHiding: false },
            ],
            dataSource: []
        });

        // act
        dataGrid.showColumnChooser();

        const items = $('.dx-item.dx-treeview-item');

        // assert
        assert.ok(items.eq(2).hasClass('dx-state-disabled'), 'Column with allowHiding=false is disabled');
    });

    QUnit.test('Column chooser search.editorOptions option should work', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columnChooser: {
                mode: 'select',
                search: {
                    enabled: true,
                    editorOptions: { placeholder: 'custom_placeholder' }
                }
            },
            columns: [{ dataField: 'field1' }, { dataField: 'field2' }],
            dataSource: []
        });

        // act
        dataGrid.showColumnChooser();

        const textBox = $('.dx-textbox').dxTextBox('instance');

        // assert
        assert.strictEqual(textBox.option('placeholder'), 'custom_placeholder', 'Placeholder should be custom');
    });

    QUnit.test('Changing columnChooser.selection.recursive via option() should work properly', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columnChooser: {
                mode: 'select',
                selection: {
                    recursive: true
                },
            },
            columns: [{
                caption: 'band1',
                columns: [{ dataField: 'field1' }, { dataField: 'field2', visible: false }]
            }],
            dataSource: []
        });

        // act
        dataGrid.showColumnChooser();

        dataGrid.option('columnChooser.selection.recursive', false);

        dataGrid.showColumnChooser();

        // assert
        const treeView = $('.dx-treeview').dxTreeView('instance');
        const selectedNodes = treeView.getSelectedNodes();

        assert.strictEqual(selectedNodes.length, 2);
        assert.ok(selectedNodes.filter(node => node.text === 'band1'), 'band column is selected');
        assert.ok(selectedNodes.filter(node => node.text === 'field1'), 'field1 column is selected');
    });

    QUnit.test('Column chooser\'s container option should work', function(assert) {
        // arrange
        const $targetContainer = $('#container');
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columnChooser: {
                enabled: true,
                container: $targetContainer
            },
            columns: ['field1'],
            dataSource: []
        });

        // act
        dataGrid.showColumnChooser();

        // assert
        const popup = dataGrid.getView('columnChooserView')._popupContainer;
        const $popupContainer = popup.$wrapper().parent();

        assert.ok($popupContainer.is($targetContainer), 'The container option is applied');
    });

    QUnit.test('Dragged hidden column from the group panel should become visible', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            groupPanel: {
                visible: true
            },
            columnChooser: {
                mode: 'select',
                selection: {
                    recursive: true
                },
            },
            columns: [{
                caption: 'band1',
                visible: false,
                columns: [
                    { dataField: 'field1', visible: false },
                    { dataField: 'field2', groupIndex: 0, visible: false }
                ]
            }],
            dataSource: []
        });

        // act
        dataGrid.showColumnChooser();

        // drag the column from group panel to header panel
        dataGrid.getController('columns').moveColumn(0, -1, 'group', 'headers');

        this.clock.tick(500);

        // assert
        const bandColumns = dataGrid.getVisibleColumns(0);
        const columns = dataGrid.getVisibleColumns(1);

        assert.strictEqual(bandColumns.length, 1);
        assert.ok(bandColumns.some(column => column.caption === 'band1'));

        assert.strictEqual(columns.length, 1);
        assert.ok(columns.some(column => column.dataField === 'field2'));

        // assert
        const treeView = $('.dx-treeview').dxTreeView('instance');

        const selectedNodes = treeView.getSelectedNodes();

        assert.strictEqual(selectedNodes.length, 1);

        assert.ok(selectedNodes.some(node => node.text === 'Field 2'), 'field2 column is selected');
    });

    QUnit.test('Column chooser list should preserve scroll top if items were updated', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columnChooser: {
                mode: 'select',
                selection: {
                    recursive: true
                },
            },
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' },
                { dataField: 'field5' },
                { dataField: 'field6' },
                { dataField: 'field7' },
                { dataField: 'field8' },
            ],
            dataSource: []
        });

        // act
        dataGrid.showColumnChooser();

        const treeView = $('.dx-treeview').dxTreeView('instance');
        treeView.getScrollable().scrollTo({ y: 50 });

        dataGrid.beginUpdate();
        dataGrid.columnOption(0, 'visible', false);
        dataGrid.columnOption(1, 'visible', false);
        dataGrid.endUpdate();

        // assert
        assert.roughEqual(treeView.getScrollable().scrollTop(), 50, 5, 'scroll position');
    });

    QUnit.test('The columnChooser item should be updated if column was hidden via API', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columnChooser: {
                mode: 'select',
                selection: { recursive: true }
            },
            columns: [
                {
                    name: 'Band',
                    caption: 'band1',
                    columns: [
                        { dataField: 'field1' },
                        { dataField: 'field2' }
                    ]
                },
                { dataField: 'field3' },
                { dataField: 'field4' },
            ],
            dataSource: []
        });

        dataGrid.showColumnChooser();

        // assert
        let $bandColumnCheckBox = $('.dx-overlay-wrapper.dx-datagrid-column-chooser').find('.dx-treeview-node .dx-checkbox').first();
        assert.ok($bandColumnCheckBox.hasClass('dx-checkbox-checked'), 'band column checkbox is checked');
        assert.deepEqual(dataGrid.getVisibleColumns().map((column) => column.dataField), ['field1', 'field2', 'field3', 'field4'], 'visible columns');

        // act
        dataGrid.columnOption('Band', 'visible', false);

        // assert
        $bandColumnCheckBox = $('.dx-overlay-wrapper.dx-datagrid-column-chooser').find('.dx-treeview-node .dx-checkbox').first();
        assert.notOk($bandColumnCheckBox.hasClass('dx-checkbox-checked'), 'band column checkbox is unchecked');
        assert.deepEqual(dataGrid.getVisibleColumns().map((column) => column.dataField), ['field3', 'field4'], 'visible columns');

        // act
        dataGrid.columnOption('Band', 'visible', true);

        // assert
        $bandColumnCheckBox = $('.dx-overlay-wrapper.dx-datagrid-column-chooser').find('.dx-treeview-node .dx-checkbox').first();
        assert.ok($bandColumnCheckBox.hasClass('dx-checkbox-checked'), 'band column checkbox is checked');
        assert.deepEqual(dataGrid.getVisibleColumns().map((column) => column.dataField), ['field1', 'field2', 'field3', 'field4'], 'visible columns');
    });

    QUnit.test('The columnChooser items should be updated if columns were hidden via API', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columnChooser: {
                mode: 'select',
                selection: { recursive: true }
            },
            columns: [
                {
                    name: 'Band',
                    caption: 'band1',
                    columns: [
                        { dataField: 'field1' },
                        { dataField: 'field2' }
                    ]
                },
                { dataField: 'field3' },
                { dataField: 'field4' },
            ],
            dataSource: []
        });

        dataGrid.showColumnChooser();

        // act
        dataGrid.beginUpdate();
        dataGrid.columnOption('Band', 'visible', false);
        dataGrid.columnOption('field3', 'visible', false);
        dataGrid.endUpdate();

        // assert
        let $bandColumnCheckBox = $('.dx-overlay-wrapper.dx-datagrid-column-chooser').find('.dx-treeview-node .dx-checkbox').first();
        let $field3ColumnCheckBox = $('.dx-overlay-wrapper.dx-datagrid-column-chooser').find('.dx-treeview-node .dx-checkbox').eq(3);
        assert.notOk($bandColumnCheckBox.hasClass('dx-checkbox-checked'), 'band column checkbox is unchecked');
        assert.notOk($field3ColumnCheckBox.hasClass('dx-checkbox-checked'), 'field3 column checkbox is unchecked');
        assert.deepEqual(dataGrid.getVisibleColumns().map((column) => column.dataField), ['field4'], 'visible columns');

        // act
        dataGrid.beginUpdate();
        dataGrid.columnOption('Band', 'visible', true);
        dataGrid.columnOption('field3', 'visible', true);
        dataGrid.endUpdate();

        // assert
        $bandColumnCheckBox = $('.dx-overlay-wrapper.dx-datagrid-column-chooser').find('.dx-treeview-node .dx-checkbox').first();
        $field3ColumnCheckBox = $('.dx-overlay-wrapper.dx-datagrid-column-chooser').find('.dx-treeview-node .dx-checkbox').eq(3);
        assert.ok($bandColumnCheckBox.hasClass('dx-checkbox-checked'), 'band column checkbox is checked');
        assert.ok($field3ColumnCheckBox.hasClass('dx-checkbox-checked'), 'field3 column checkbox is checked');
        assert.deepEqual(dataGrid.getVisibleColumns().map((column) => column.dataField), ['field1', 'field2', 'field3', 'field4'], 'visible columns');
    });

    QUnit.test('The command column should be visible when editing is enabled while the column chooser is visible', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columns: [{ dataField: 'field1' }],
            dataSource: [],
            columnChooser: {
                enabled: true,
                mode: 'select'
            }
        });

        // act
        dataGrid.showColumnChooser();
        dataGrid.option('editing.allowUpdating', true);

        // assert
        const commandColumn = dataGrid.columnOption('type:buttons');
        assert.ok(commandColumn.visible, 'The command column is visible');
    });
});
