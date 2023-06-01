import $ from 'jquery';

import { createDataGrid, baseModuleConfig } from '../../helpers/baseDataGridHelper.js';

import 'material_blue_light.css!';

QUnit.testStart(function() {
    const markup = '<div id="dataGrid"></div>';
    $('#qunit-fixture').html(markup);
});

QUnit.module('Material theme', baseModuleConfig, () => {
    QUnit.test('Editor placeholder has left/right padding', function(assert) {
        const dataGridInstance = createDataGrid({
            dataSource: [{ key: 1, ID: '' }],
            editing: {
                mode: 'cell'
            },
            columns: [{
                dataField: 'ID',
                editorOptions: { placeholder: 'placeholder' }
            }]
        });

        this.clock.tick(10);
        dataGridInstance.editCell(0, 0);

        const beforeElement = window.getComputedStyle($('.dx-placeholder').get(0), ':before');
        const rightPadding = beforeElement.getPropertyValue('padding-right');
        const leftPadding = beforeElement.getPropertyValue('padding-left');

        assert.equal(rightPadding, '16px');
        assert.equal(leftPadding, '16px');
    });

    QUnit.test('Vertical scroll does not bounce on updateDimensions (T1050513)', function(assert) {
        const dataGridInstance = createDataGrid({
            dataSource: Array(50).fill(0).map((_, i) => ({ id: i })),
            columnHidingEnabled: true,
            height: 702,
            keyExpr: 'id',
            paging: {
                enabled: false
            },
            scrolling: {
                useNative: false
            }
        });

        this.clock.tick(10);

        const scrollable = dataGridInstance.getScrollable();

        // scroll to the end
        scrollable.scrollTo(10000);

        const beforeUpdateScrollPosition = scrollable.scrollTop();

        dataGridInstance.updateDimensions();

        const afterUpdateScrollPosition = scrollable.scrollTop();

        assert.roughEqual(beforeUpdateScrollPosition, afterUpdateScrollPosition, 1, 'Scroll position is not change');
    });
});
