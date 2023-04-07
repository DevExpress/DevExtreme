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


});
