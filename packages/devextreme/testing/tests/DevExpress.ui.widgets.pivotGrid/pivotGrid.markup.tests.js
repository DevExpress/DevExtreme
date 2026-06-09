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

    const createExpandableDataSource = () => ({
        fields: [
            { dataField: 'region', area: 'row' },
            { dataField: 'city', area: 'row' },
            { dataField: 'year', area: 'column', expanded: true },
            { dataField: 'quarter', area: 'column' },
            { dataField: 'amount', area: 'data', summaryType: 'sum', dataType: 'number' }
        ],
        store: [
            { region: 'N', city: 'B', year: 2020, quarter: 'Q1', amount: 100 },
            { region: 'N', city: 'NY', year: 2020, quarter: 'Q2', amount: 200 },
            { region: 'S', city: 'M', year: 2021, quarter: 'Q1', amount: 300 }
        ]
    });

    QUnit.test('Expandable td has aria-expanded reflecting expanded state', function(assert) {
        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'skipped on serverSide');
            return;
        }
        const clock = sinon.useFakeTimers();
        try {
            const pivotGrid = createPivotGrid({ dataSource: createExpandableDataSource() });
            clock.tick(10);

            const $expandedTd = pivotGrid.$element().find('.dx-pivotgrid-expanded').first().closest('td');
            const $collapsedTd = pivotGrid.$element().find('.dx-pivotgrid-collapsed').first().closest('td');

            assert.ok($expandedTd.length > 0, 'expanded td present');
            assert.ok($collapsedTd.length > 0, 'collapsed td present');
            assert.strictEqual($expandedTd.attr('aria-expanded'), 'true', 'expanded td has aria-expanded="true"');
            assert.strictEqual($collapsedTd.attr('aria-expanded'), 'false', 'collapsed td has aria-expanded="false"');
        } finally {
            clock.restore();
        }
    });

    QUnit.test('Expandable td has tabindex="0"', function(assert) {
        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'skipped on serverSide');
            return;
        }
        const clock = sinon.useFakeTimers();
        try {
            const pivotGrid = createPivotGrid({ dataSource: createExpandableDataSource() });
            clock.tick(10);

            const $expandedTd = pivotGrid.$element().find('.dx-pivotgrid-expanded').first().closest('td');
            const $collapsedTd = pivotGrid.$element().find('.dx-pivotgrid-collapsed').first().closest('td');

            assert.strictEqual($expandedTd.attr('tabindex'), '0', 'expanded td is focusable');
            assert.strictEqual($collapsedTd.attr('tabindex'), '0', 'collapsed td is focusable');
        } finally {
            clock.restore();
        }
    });

    QUnit.test('Expandable td has role="button"', function(assert) {
        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'skipped on serverSide');
            return;
        }
        const clock = sinon.useFakeTimers();
        try {
            const pivotGrid = createPivotGrid({ dataSource: createExpandableDataSource() });
            clock.tick(10);

            const $expandedTd = pivotGrid.$element().find('.dx-pivotgrid-expanded').first().closest('td');
            const $collapsedTd = pivotGrid.$element().find('.dx-pivotgrid-collapsed').first().closest('td');

            assert.strictEqual($expandedTd.attr('role'), 'button', 'expanded td has role="button"');
            assert.strictEqual($collapsedTd.attr('role'), 'button', 'collapsed td has role="button"');
        } finally {
            clock.restore();
        }
    });

    QUnit.test('Expandable td aria-label matches the displayed text, not the raw value', function(assert) {
        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'skipped on serverSide');
            return;
        }
        const clock = sinon.useFakeTimers();
        try {
            const dataSource = createExpandableDataSource();
            dataSource.fields[0].customizeText = (cellInfo) => `${cellInfo.valueText} region`;
            const pivotGrid = createPivotGrid({ dataSource });
            clock.tick(10);

            const $collapsedTd = pivotGrid.$element().find('.dx-pivotgrid-collapsed').first().closest('td');
            const displayedText = $collapsedTd.text().trim();

            assert.notStrictEqual($collapsedTd.attr('aria-label').indexOf(' region'), -1, 'aria-label uses customized display text');
            assert.strictEqual($collapsedTd.attr('aria-label'), displayedText, 'aria-label equals the visible cell text');
        } finally {
            clock.restore();
        }
    });

    QUnit.test('Non-expandable td has no role, aria-expanded, or tabindex', function(assert) {
        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'skipped on serverSide');
            return;
        }
        const clock = sinon.useFakeTimers();
        try {
            const pivotGrid = createPivotGrid({ dataSource: createExpandableDataSource() });
            clock.tick(10);

            const $nonExpandableTd = pivotGrid.$element().find('td:not([aria-expanded])').first();

            assert.ok($nonExpandableTd.length > 0, 'non-expandable td exists');
            assert.strictEqual($nonExpandableTd.attr('role'), undefined, 'no role attribute');
            assert.strictEqual($nonExpandableTd.attr('aria-expanded'), undefined, 'no aria-expanded attribute');
            assert.strictEqual($nonExpandableTd.attr('tabindex'), undefined, 'no tabindex attribute');
        } finally {
            clock.restore();
        }
    });

});

