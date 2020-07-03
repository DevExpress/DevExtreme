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

});
