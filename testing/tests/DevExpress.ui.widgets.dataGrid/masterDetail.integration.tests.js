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

QUnit.module('Master Detail', baseModuleConfig, () => {
    QUnit.test('Column hiding should works with masterDetail and column fixing', function(assert) {
        // arrange
        let detailGridCount = 0;
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1 }],
            columnHidingEnabled: true,
            columnFixing: {
                enabled: true
            },
            columnAutoWidth: true,
            width: 1000,
            columns: [
                { dataField: 'column1', width: 1000 },
                { dataField: 'column2' }
            ],
            masterDetail: {
                enabled: true,
                template: function() {
                    detailGridCount++;
                    return $('<div>').dxDataGrid({
                        dataSource: [{}]
                    });
                }
            }
        });

        this.clock.tick();

        // act
        dataGrid.expandRow({ id: 1 });
        this.clock.tick();

        dataGrid.collapseRow({ id: 1 });
        this.clock.tick();

        dataGrid.expandAdaptiveDetailRow({ id: 1 });
        this.clock.tick();

        dataGrid.collapseAdaptiveDetailRow({ id: 1 });
        this.clock.tick(1000);

        // assert
        const $masterDetailRows = $($(dataGrid.$element()).find('.dx-master-detail-row'));
        assert.equal($masterDetailRows.length, 2, 'master-detail row count');
        assert.notOk($masterDetailRows.is(':visible'), 'master-detail rows are not visible');
        assert.equal(detailGridCount, 1, 'master detail is rendered once');
    });

    // T922076
    QUnit.test('Column hiding should work correctly with masterDetail if autoExpandAll is true', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            dataSource: [{}],
            columnHidingEnabled: true,
            width: 1000,
            columns: ['column1', 'column2'],
            masterDetail: {
                autoExpandAll: true,
                template: function() {
                    return $('<div>').dxDataGrid({
                    });
                }
            }
        });

        // act
        this.clock.tick();

        // assert
        const visibleColumns = dataGrid.getVisibleColumns();
        const visibleRows = dataGrid.getVisibleRows();

        assert.equal(visibleColumns.length, 3, 'visible column count');
        assert.equal(visibleColumns[1].dataField, 'column2', 'column 2 dataField');
        assert.equal(visibleColumns[1].visibleWidth, undefined, 'column 2 visibleWidth');
        assert.equal(visibleColumns[2].type, 'adaptive', 'column 3 type');
        assert.equal(visibleColumns[2].visibleWidth, 'adaptiveHidden', 'column 3 visible width');

        assert.equal(visibleRows[1].rowType, 'detail', 'detail row is rendered');
    });
});
