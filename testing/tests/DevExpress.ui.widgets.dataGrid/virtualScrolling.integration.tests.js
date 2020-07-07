import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';
import $ from 'jquery';

QUnit.testStart(function() {
    const markup = `
        <div id="dataGrid"></div>
    `;

    $('#qunit-fixture').html(markup);
});

QUnit.module('Virtual Scrolling', baseModuleConfig, () => {

    // T356666
    QUnit.test('Focused row should be visible after change focusedRowKey if connection is slow', function(assert) {
        const data = [];

        for(let i = 0; i < 10; i++) {
            data.push({ id: i + 1 });
        }

        // act
        const dataGrid = createDataGrid({
            dataSource: data,
            keyExpr: 'id',
            height: 100,
            paging: {
                pageSize: 2
            },
            scrolling: {
                mode: 'virtual',
                minTimeout: 500,
                useNative: false
            },
            focusedRowEnabled: true,
            focusedRowKey: 8
        });

        this.clock.tick(500);
        assert.ok(dataGrid.getScrollable().scrollTop() > 0, 'scroll top is changed');

        // act
        dataGrid.option('focusedRowKey', 1);
        this.clock.tick(500);

        // assert
        assert.strictEqual(dataGrid.getScrollable().scrollTop(), 0, 'scroll top is updated');
    });

    // T643374
    QUnit.test('ScrollTop should be correct after loading pageIndex from state', function(assert) {
        // act
        const dataGrid = createDataGrid({
            height: 100,
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return { pageIndex: 3 };
                },
                customSave: function() {
                }
            },
            scrolling: {
                mode: 'virtual',
                useNative: false
            },
            paging: {
                pageSize: 2
            },
            dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }, { id: 10 }]
        });

        this.clock.tick();

        // assert
        const scrollTop = dataGrid.getScrollable().scrollTop();
        assert.ok(scrollTop > 0, 'scrollTop');
        assert.ok(dataGrid.$element().find('.dx-virtual-row').first().children().first().height() <= scrollTop, 'scrollTop should be less than or equal to virtual row height');
    });
});
