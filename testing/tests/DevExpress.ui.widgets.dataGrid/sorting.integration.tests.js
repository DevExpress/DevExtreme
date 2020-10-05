import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';
import $ from 'jquery';

QUnit.testStart(function() {
    const markup = `
        <div id="container">
            <div id="dataGrid"></div>
        </div>
    `;

    $('#qunit-fixture').html(markup);
});


QUnit.module('Initialization', baseModuleConfig, () => {
    QUnit.test('Only one column should be sorted after ungrouping when sorting.mode is \'single\' (T933738)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1, name: 'test' }],
            columns: ['id', 'name'],
            loadingTimeout: undefined,
            sorting: {
                mode: 'single'
            }
        });

        // act
        const $idHeaderElement = $(dataGrid.element()).find('.dx-header-row td').eq(0);
        $idHeaderElement.trigger('dxclick');
        this.clock.tick();

        let sortedColumns = dataGrid.getVisibleColumns().filter(col => col.sortIndex >= 0);

        // assert
        assert.equal(sortedColumns.length, 1, 'only one sorted column before grouping');
        assert.strictEqual(sortedColumns[0].dataField, 'id', '\'id\' column is sorted before grouping');
        assert.strictEqual(sortedColumns[0].sortOrder, 'asc', 'sortOrder before grouping');

        // act
        dataGrid.columnOption('id', 'groupIndex', 0);
        this.clock.tick();

        sortedColumns = dataGrid.getVisibleColumns().filter(col => col.sortIndex >= 0);

        // assert
        assert.equal(sortedColumns.length, 1, 'only one sorted column after grouping');
        assert.strictEqual(sortedColumns[0].dataField, 'id', '\'id\' column is sorted after grouping');
        assert.strictEqual(sortedColumns[0].sortOrder, 'asc', 'sortOrder after grouping');

        // act
        const $nameHeaderElement = $(dataGrid.element()).find('.dx-header-row td').eq(1);
        $nameHeaderElement.trigger('dxclick');
        this.clock.tick();

        sortedColumns = dataGrid.getVisibleColumns().filter(col => col.sortIndex >= 0);

        // assert
        assert.equal(sortedColumns.length, 1, 'only one sorted column after clicking the \'name\' column header');
        assert.strictEqual(sortedColumns[0].dataField, 'name', '\'name\' column is sorted after clicking the \'name\' column header');
        assert.strictEqual(sortedColumns[0].sortOrder, 'asc', 'sortOrder after clicking the \'name\' column header');

        // act
        dataGrid.columnOption('id', 'groupIndex', undefined);
        this.clock.tick();

        sortedColumns = dataGrid.getVisibleColumns().filter(col => col.sortIndex >= 0);

        // assert
        assert.equal(sortedColumns.length, 1, 'only one sorted column after ungrouping');
        assert.strictEqual(sortedColumns[0].dataField, 'name', '\'name\' column is sorted after ungrouping');
        assert.strictEqual(sortedColumns[0].sortOrder, 'asc', 'sortOrder after ungrouping');
    });
});
