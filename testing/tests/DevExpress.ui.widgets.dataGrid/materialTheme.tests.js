import 'material_blue_light.css!';

import $ from 'jquery';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';

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

        this.clock.tick();
        dataGridInstance.editCell(0, 0);

        const beforeElement = window.getComputedStyle(document.querySelector('.dx-placeholder'), ':before');
        const rightPadding = beforeElement.getPropertyValue('padding-right');
        const leftPadding = beforeElement.getPropertyValue('padding-left');

        assert.equal(rightPadding, '14px');
        assert.equal(leftPadding, '14px');
    });
});
