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

QUnit.module('Async render', baseModuleConfig, () => {
    // T857205
    QUnit.test('selection if renderAsync is true and state storing is used', function(assert) {
        const selectedRowKeys = [1, 2];

        const customLoad = sinon.spy(() => {
            return {
                selectedRowKeys: selectedRowKeys
            };
        });

        // act
        const grid = createDataGrid({
            dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }],
            keyExpr: 'id',
            loadingTimeout: undefined,
            renderAsync: true,
            filterRow: {
                visible: true
            },
            selection: {
                mode: 'multiple'
            },
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad
            }
        });

        const $grid = grid.$element();
        this.clock.tick();

        const $selectCheckboxes = $grid.find('.dx-select-checkbox');
        const $inputs = $selectCheckboxes.find('input');

        // assert
        assert.equal(customLoad.callCount, 1, 'customLoad was called once');

        assert.deepEqual(grid.getSelectedRowKeys(), selectedRowKeys, 'selected row keys');

        assert.equal($inputs.eq(1).prop('value'), 'true', 'first row checkbox');
        assert.equal($inputs.eq(2).prop('value'), 'true', 'second row checkbox');
        assert.equal($inputs.eq(3).prop('value'), 'false', 'third row checkbox');
    });

    // T899260
    QUnit.test('deferred selection if renderAsync is true and state storing is used', function(assert) {
        const selectionFilter = [['id', '=', 1], 'or', ['id', '=', 2]];

        const customLoad = sinon.spy(() => {
            return {
                selectionFilter: selectionFilter
            };
        });

        // act
        const grid = createDataGrid({
            dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }],
            keyExpr: 'id',
            loadingTimeout: undefined,
            renderAsync: true,
            filterRow: {
                visible: true
            },
            selection: {
                mode: 'multiple',
                deferred: true
            },
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad
            }
        });

        const $grid = grid.$element();
        this.clock.tick();

        const $selectCheckboxes = $grid.find('.dx-select-checkbox');
        const $inputs = $selectCheckboxes.find('input');

        // assert
        assert.equal(customLoad.callCount, 1, 'customLoad was called once');

        assert.deepEqual(grid.option('selectionFilter'), selectionFilter, 'selected row keys');

        assert.equal($inputs.eq(1).prop('value'), 'true', 'first row checkbox');
        assert.equal($inputs.eq(2).prop('value'), 'true', 'second row checkbox');
        assert.equal($inputs.eq(3).prop('value'), 'false', 'third row checkbox');
    });

    // T899260
    QUnit.test('deferred selection if renderAsync is true', function(assert) {
        const selectionFilter = [['id', '=', 1], 'or', ['id', '=', 2]];

        // act
        const grid = createDataGrid({
            dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }],
            keyExpr: 'id',
            loadingTimeout: undefined,
            renderAsync: true,
            selection: {
                mode: 'multiple',
                deferred: true
            },
            selectionFilter: selectionFilter
        });

        const $grid = grid.$element();
        this.clock.tick();

        const $selectCheckboxes = $grid.find('.dx-select-checkbox');
        const $inputs = $selectCheckboxes.find('input');

        // assert
        assert.equal($inputs.eq(1).prop('value'), 'true', 'first row checkbox');
        assert.equal($inputs.eq(2).prop('value'), 'true', 'second row checkbox');
        assert.equal($inputs.eq(3).prop('value'), 'false', 'third row checkbox');
    });
});
