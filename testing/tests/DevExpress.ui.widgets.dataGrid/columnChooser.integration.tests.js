QUnit.testStart(function() {
    const gridMarkup = `
        <div id='container'>
            <div id="dataGrid"></div>
        </div>
    `;

    $('#qunit-fixture').html(gridMarkup);
});

import $ from 'jquery';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';
import messageLocalization from 'localization/message';

QUnit.module('Column chooser', baseModuleConfig, () => {
    // T862537
    QUnit.test('column should be draggable if grid contains this column and column with allowHiding: false', function(assert) {
        // act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columns: [{ dataField: 'field1', allowHiding: false }, { dataField: 'field2' }],
            dataSource: []
        });

        // assert
        assert.equal($(dataGrid.$element()).find('.dx-datagrid-drag-action').length, 0, 'no drag actions');
        assert.equal($(dataGrid.$element()).find('.dx-datagrid-action').length, 2, 'two actions');

        // act
        dataGrid.showColumnChooser();

        // assert
        assert.equal($(dataGrid.$element()).find('.dx-datagrid-drag-action').length, 1, 'one drag action for hiding column');
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
        let position = { my: 'left bottom', at: 'left bottom' , of: '#dataGrid'};

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
            columnChooser: { mode: 'select', selection: { allowSelectAll: true } },
            columns: [{ dataField: 'field1' }, { dataField: 'field2' }],
            dataSource: []
        });

        // act
        dataGrid.showColumnChooser();

        // assert
        const $selectAllCheckbox = $('.dx-treeview-select-all-item');

        assert.ok($selectAllCheckbox.length, 'there is \'Select all\' checkbox');

        // act
        const selectAllCheckbox = $selectAllCheckbox.dxCheckBox('instance');
        selectAllCheckbox.option('value', false);
        
        // assert
        assert.strictEqual(dataGrid.getVisibleColumns().length, 0, 'No columns are shown');

        // act
        selectAllCheckbox.option('value', true);

        // assert
        assert.strictEqual(dataGrid.getVisibleColumns().length, 2, 'All columns are shown');
    });

    QUnit.test('Column chooser selection.allowSelectAll option should work with column which has allowHiding=false', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columnChooser: { mode: 'select', selection: { allowSelectAll: true } },
            columns: [{ dataField: 'field1', allowHiding: false }, { dataField: 'field2' }],
            dataSource: []
        });

        // act
        dataGrid.showColumnChooser();

        const $selectAllCheckbox = $('.dx-treeview-select-all-item');
        const selectAllCheckbox = $selectAllCheckbox.dxCheckBox('instance');
        selectAllCheckbox.option('value', false);
        
        // assert
        assert.strictEqual(dataGrid.getVisibleColumns().length, 1, 'Only column with allowHiding=false is shown');

        // act
        selectAllCheckbox.option('value', true);

        // assert
        assert.strictEqual(dataGrid.getVisibleColumns().length, 2, 'All columns are shown');
    });
    
    QUnit.test('Column chooser selection.recursive should work', function(assert) {
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columnChooser: { mode: 'select', selection: { recursive: true } },
            columns: [{
                caption: 'band1',
                columns: [{ dataField: 'field1' }, { dataField: 'field2' }]
            }, { dataField: 'field3' }],
            dataSource: []
        });

        // act
        dataGrid.showColumnChooser();

        const treeView = $('.dx-treeview');
        const items = $('.dx-item.dx-treeview-item');
        const bandColumnItem = items[0];

        treeView.deselectItem(bandColumnItem);

        // assert
        assert.strictEqual(dataGrid.getVisibleColumns().length, 1, 'All columns under band column should be deselected');
        assert.strictEqual(dataGrid.getVisibleColumns()[0].dataField, 'field3', 'All columns under band column should be deselected');
    });

    QUnit.test('Column chooser selection.recursive should work with column with allowHiding=false', function(assert) {
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columnChooser: { mode: 'select', selection: { recursive: true } },
            columns: [{
                caption: 'band1',
                columns: [{ dataField: 'field1' }, { dataField: 'field2', allowHiding: false }]
            }],
            dataSource: []
        });

        // act
        dataGrid.showColumnChooser();

        const treeView = $('.dx-treeview');
        const items = $('.dx-item.dx-treeview-item');
        const bandColumnItem = items[0];

        treeView.deselectItem(bandColumnItem);

        // assert
        assert.strictEqual(dataGrid.getVisibleColumns().length, 1, 'Column with allowHiding=false should not be deselected');
        assert.strictEqual(dataGrid.getVisibleColumns()[0].dataField, 'field2', 'check dataField');
    });

    QUnit.test('Column chooser search.editorOptions option should work', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            columnChooser: { 
                mode: 'select', 
                allowSearch: true, 
                search: { 
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
});
