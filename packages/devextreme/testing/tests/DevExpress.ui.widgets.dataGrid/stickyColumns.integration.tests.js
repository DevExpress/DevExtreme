import $ from 'jquery';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';

QUnit.testStart(function() {
    const gridMarkup = `
        <div id='container'>
            <div id="dataGrid"></div>
        </div>
    `;

    $('#qunit-fixture').html(gridMarkup);
});

QUnit.module('Sticky columns', baseModuleConfig, () => {
    QUnit.test('Editing a row should not throw an exception when edit mode is row (T1268965)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            dataSource: [
                { id: 1, field1: 'test1', field2: 'test2' },
                { id: 1, field1: 'test3', field2: 'test4' }
            ],
            keyExpr: 'id',
            columnFixing: {
                enabled: true,
            },
            editing: {
                mode: 'row',
                allowUpdating: true,
            }
        });

        this.clock.tick(30);

        try {
            // act
            dataGrid.editRow(0);
            this.clock.tick(10);

            // assert
            assert.ok(true, 'no exceptions');
        } catch(e) {
            // assert
            assert.ok(false, `exception - ${e}`);
        }
    });

    QUnit.test('Editing a row should not throw an exception when edit mode is form (T1268965)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            dataSource: [
                { id: 1, field1: 'test1', field2: 'test2' },
                { id: 1, field1: 'test3', field2: 'test4' }
            ],
            keyExpr: 'id',
            columnFixing: {
                enabled: true,
            },
            editing: {
                mode: 'form',
                allowUpdating: true,
            }
        });

        this.clock.tick(30);

        try {
            // act
            dataGrid.editRow(0);
            this.clock.tick(10);

            // assert
            assert.ok(true, 'no exceptions');
        } catch(e) {
            // assert
            assert.ok(false, `exception - ${e}`);
        }
    });
});
