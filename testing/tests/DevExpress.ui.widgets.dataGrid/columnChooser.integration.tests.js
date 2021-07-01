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


QUnit.module('Column chooser', baseModuleConfig, () => {
    // T862537
    QUnit.test('column should be draggable if grid contains this column and column with allowHiding: false', function(assert) {
        // act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
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

    QUnit.test('Correct runtime changing of a columnChooser mode (string)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columns: [{ dataField: 'field1', allowSorting: false }, { dataField: 'field2' }],
            dataSource: []
        });

        // act
        dataGrid.showColumnChooser();

        let $overlayWrapper = dataGrid.getView('columnChooserView')._popupContainer._wrapper();

        assert.ok($overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-drag'), 'has dragAndDrop mode class');
        assert.ok(!$overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-select'), 'hasn\'t select mode class');

        dataGrid.option('columnChooser.mode', 'select');

        $overlayWrapper = dataGrid.getView('columnChooserView')._popupContainer._wrapper();

        // assert
        assert.ok(!$overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-drag'), 'hasn\'t dragAndDrop mode class');
        assert.ok($overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-select'), 'has select mode class');
    });

    QUnit.test('Correct runtime changing of a columnChooser mode (object)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columns: [{ dataField: 'field1', allowSorting: false }, { dataField: 'field2' }],
            dataSource: []
        });

        // act
        dataGrid.showColumnChooser();

        let $overlayWrapper = dataGrid.getView('columnChooserView')._popupContainer._wrapper();

        assert.ok($overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-drag'), 'has dragAndDrop mode class');
        assert.ok(!$overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-select'), 'hasn\'t select mode class');

        dataGrid.option({ columnChooser: { mode: 'select' } });

        $overlayWrapper = dataGrid.getView('columnChooserView')._popupContainer._wrapper();

        // assert
        assert.ok(!$overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-drag'), 'hasn\'t dragAndDrop mode class');
        assert.ok($overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-select'), 'has select mode class');
    });

    QUnit.test('ColumnChooser\'s treeView get correct default config (without checkboxes)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columnChooser: { mode: 'select' },
            columns: [{ dataField: 'field1', allowSorting: false }, { dataField: 'field2', visible: false }],
            dataSource: []
        });

        // act
        dataGrid.showColumnChooser();

        let $overlayWrapper = dataGrid.getView('columnChooserView')._popupContainer._wrapper();

        assert.ok($overlayWrapper.find('.dx-checkbox').length, 'There are checkboxes in columnChooser');

        dataGrid.option({ columnChooser: { mode: 'dragAndDrop' } });

        $overlayWrapper = dataGrid.getView('columnChooserView')._popupContainer._wrapper();

        // assert
        assert.ok(!$overlayWrapper.find('.dx-checkbox').length, 'There aren\'t checkboxes in columnChooser');
    });

});
