import $ from 'jquery';
import windowUtils from 'core/utils/window';

import '__internal/grids/pivot_grid/m_widget';

QUnit.module('PivotGrid markup tests', () => {

    QUnit.testStart(function() {
        const markup = '<div id=\'pivotGrid\' />';
        $('#qunit-fixture').html(markup);
    });

    const createPivotGrid = function(options) {
        const pivotGridElement = $('#pivotGrid').dxPivotGrid(options);
        return pivotGridElement.dxPivotGrid('instance');
    };

    QUnit.test('Init markup with sizes', function(assert) {
    // arrange
        const pivotGrid = createPivotGrid({ width: '600', height: '800' });

        // assert
        assert.ok(pivotGrid.$element().hasClass('dx-pivotgrid'), 'has dx-pivotgrid class');
        assert.equal(pivotGrid.$element().children().length > 0, windowUtils.hasWindow(), 'empty rectangle');
        assert.equal(pivotGrid.$element().attr('style'), 'width: 600px; height: 800px;', 'has size attributes');
    });

    QUnit.test('Render empty data', function(assert) {
    // arrange
        const pivotGrid = createPivotGrid({
            width: '600',
            height: '800',
            dataSource: {
                fields: [{
                    dataField: 'region',
                    area: 'row'
                }, {
                    dataField: 'date',
                    dataType: 'date',
                    area: 'column'
                }, {
                    dataField: 'amount',
                    area: 'data'
                }]
            }
        });

        // assert
        assert.ok(pivotGrid.$element().hasClass('dx-pivotgrid'), 'has dx-pivotgrid class');
        assert.equal(pivotGrid.$element().children().length > 0, windowUtils.hasWindow(), 'empty rectangle');
    });

    QUnit.test('Render with data', function(assert) {
    // arrange
        const clock = sinon.useFakeTimers();
        const pivotGrid = createPivotGrid({
            width: '600',
            height: '800',
            dataSource: {
                fields: [{
                    dataField: 'region',
                    area: 'row'
                }, {
                    dataField: 'date',
                    dataType: 'date',
                    area: 'column'
                }, {
                    dataField: 'amount',
                    area: 'data'
                }],
                store: [{
                    'region': 'North America',
                    'date': '2013/01/06',
                    'amount': 1740
                }]
            }
        });

        clock.tick(10);

        // assert
        assert.ok(pivotGrid.$element().hasClass('dx-pivotgrid'), 'has dx-pivotgrid class');
        assert.equal(pivotGrid.$element().children().length > 0, windowUtils.hasWindow(), 'empty rectangle');

        clock.restore();
    });

    QUnit.test('Expandable td has aria-expanded reflecting expanded state', function(assert) {
        const clock = sinon.useFakeTimers();
        const pivotGrid = createPivotGrid({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' },
                    { caption: 'Sum', area: 'data' }
                ],
                rows: [
                    { value: 'A', index: 0 }
                ],
                columns: [{
                    value: '2010', index: 1,
                    children: [
                        { value: '1', index: 0 }
                    ]
                }, {
                    value: '2012', index: 2
                }],
                values: [[[1]], [[2]], [[3]]]
            }
        });
        clock.tick(10);

        const $expandedTd = pivotGrid.$element().find('.dx-pivotgrid-expanded').closest('td');
        const $collapsedTd = pivotGrid.$element().find('.dx-pivotgrid-collapsed').closest('td');

        assert.strictEqual($expandedTd.attr('aria-expanded'), 'true', 'expanded td has aria-expanded="true"');
        assert.strictEqual($collapsedTd.attr('aria-expanded'), 'false', 'collapsed td has aria-expanded="false"');

        clock.restore();
    });

    QUnit.test('Expandable td has tabindex="0"', function(assert) {
        const clock = sinon.useFakeTimers();
        const pivotGrid = createPivotGrid({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' },
                    { caption: 'Sum', area: 'data' }
                ],
                rows: [
                    { value: 'A', index: 0 }
                ],
                columns: [{
                    value: '2010', index: 1,
                    children: [
                        { value: '1', index: 0 }
                    ]
                }, {
                    value: '2012', index: 2
                }],
                values: [[[1]], [[2]], [[3]]]
            }
        });
        clock.tick(10);

        const $expandedTd = pivotGrid.$element().find('.dx-pivotgrid-expanded').closest('td');
        const $collapsedTd = pivotGrid.$element().find('.dx-pivotgrid-collapsed').closest('td');

        assert.strictEqual($expandedTd.attr('tabindex'), '0', 'expanded td is focusable');
        assert.strictEqual($collapsedTd.attr('tabindex'), '0', 'collapsed td is focusable');

        clock.restore();
    });

    QUnit.test('Non-expandable td has neither aria-expanded nor tabindex', function(assert) {
        const clock = sinon.useFakeTimers();
        const pivotGrid = createPivotGrid({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' },
                    { caption: 'Sum', area: 'data' }
                ],
                rows: [
                    { value: 'A', index: 0 }
                ],
                columns: [{
                    value: '2010', index: 1,
                    children: [
                        { value: '1', index: 0 }
                    ]
                }, {
                    value: '2012', index: 2
                }],
                values: [[[1]], [[2]], [[3]]]
            }
        });
        clock.tick(10);

        const $nonExpandableTd = pivotGrid.$element().find('td:not([aria-expanded])').first();

        assert.ok($nonExpandableTd.length > 0, 'non-expandable td exists');
        assert.strictEqual($nonExpandableTd.attr('aria-expanded'), undefined, 'no aria-expanded attribute');
        assert.strictEqual($nonExpandableTd.attr('tabindex'), undefined, 'no tabindex attribute');

        clock.restore();
    });

});

