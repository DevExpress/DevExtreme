import $ from 'jquery';
import windowUtils from 'core/utils/window';

import '__internal/grids/pivot_grid/m_widget';

const createPivotGrid = function(options) {
    const pivotGridElement = $('#pivotGrid').dxPivotGrid(options);
    return pivotGridElement.dxPivotGrid('instance');
};

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

QUnit.module('PivotGrid markup tests', () => {

    QUnit.testStart(function() {
        const markup = '<div id=\'pivotGrid\' />';
        $('#qunit-fixture').html(markup);
    });


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

    QUnit.test('Expand control has aria-expanded reflecting expanded state', function(assert) {
        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'skipped on serverSide');
            return;
        }
        const clock = sinon.useFakeTimers();
        try {
            const pivotGrid = createPivotGrid({ dataSource: createExpandableDataSource() });
            clock.tick(10);

            const $expandedControl = pivotGrid.$element().find('.dx-pivotgrid-expanded').first().find('.dx-expand-icon-container');
            const $collapsedControl = pivotGrid.$element().find('.dx-pivotgrid-collapsed').first().find('.dx-expand-icon-container');

            assert.ok($expandedControl.length > 0, 'expanded control present');
            assert.ok($collapsedControl.length > 0, 'collapsed control present');
            assert.strictEqual($expandedControl.attr('aria-expanded'), 'true', 'expanded control has aria-expanded="true"');
            assert.strictEqual($collapsedControl.attr('aria-expanded'), 'false', 'collapsed control has aria-expanded="false"');
        } finally {
            clock.restore();
        }
    });

    QUnit.test('Expand control is a focusable button, td keeps native cell semantics', function(assert) {
        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'skipped on serverSide');
            return;
        }
        const clock = sinon.useFakeTimers();
        try {
            const pivotGrid = createPivotGrid({ dataSource: createExpandableDataSource() });
            clock.tick(10);

            const $collapsedTd = pivotGrid.$element().find('.dx-pivotgrid-collapsed').first();
            const $collapsedControl = $collapsedTd.find('.dx-expand-icon-container');

            assert.strictEqual($collapsedControl.attr('role'), 'button', 'control has role="button"');
            assert.strictEqual($collapsedControl.attr('tabindex'), '0', 'control is focusable');
            assert.strictEqual($collapsedTd.attr('role'), undefined, 'td keeps native cell role');
            assert.strictEqual($collapsedTd.attr('tabindex'), undefined, 'td is not in the tab order');
            assert.strictEqual($collapsedTd.attr('aria-expanded'), undefined, 'td has no aria-expanded');
        } finally {
            clock.restore();
        }
    });

    QUnit.test('Expand control aria-label matches the displayed text, not the raw value', function(assert) {
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
            const $collapsedControl = $collapsedTd.find('.dx-expand-icon-container');
            const displayedText = $collapsedTd.text().trim();

            assert.notStrictEqual($collapsedControl.attr('aria-label').indexOf(' region'), -1, 'aria-label uses customized display text');
            assert.strictEqual($collapsedControl.attr('aria-label'), displayedText, 'aria-label equals the visible cell text');
        } finally {
            clock.restore();
        }
    });

    QUnit.test('Non-expandable cell has no expand control', function(assert) {
        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'skipped on serverSide');
            return;
        }
        const clock = sinon.useFakeTimers();
        try {
            const pivotGrid = createPivotGrid({ dataSource: createExpandableDataSource() });
            clock.tick(10);

            const $dataCell = pivotGrid.$element().find('.dx-area-data-cell td').first();

            assert.ok($dataCell.length > 0, 'data cell exists');
            assert.strictEqual($dataCell.find('.dx-expand-icon-container').length, 0, 'no expand control in a non-expandable cell');
            assert.strictEqual($dataCell.attr('role'), undefined, 'data cell has no role');
            assert.strictEqual($dataCell.attr('tabindex'), undefined, 'data cell is not focusable');
        } finally {
            clock.restore();
        }
    });
});

QUnit.module('PivotGrid accessibility markup', {
    beforeEach() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach() {
        this.clock.restore();
    }
}, () => {

    QUnit.testStart(function() {
        $('#qunit-fixture').html('<div id=\'pivotGrid\' />');
    });

    QUnit.test('Root element has role="group"', function(assert) {
        const pivotGrid = createPivotGrid({});

        assert.strictEqual(pivotGrid.$element().attr('role'), 'group', 'root role');
    });

    QUnit.test('Root element has aria-label after render', function(assert) {
        const pivotGrid = createPivotGrid({
            width: 600, height: 400,
            dataSource: createExpandableDataSource()
        });
        this.clock.tick(10);

        const ariaLabel = pivotGrid.$element().attr('aria-label');
        assert.equal(ariaLabel, 'Pivot grid');
    });

    QUnit.test('Outer table has role="presentation"', function(assert) {
        if(!windowUtils.hasWindow()) {
            assert.expect(0);
            return;
        }

        const pivotGrid = createPivotGrid({
            width: 600, height: 400,
            dataSource: createExpandableDataSource()
        });
        this.clock.tick(10);

        const $outerTable = pivotGrid.$element().find('.dx-pivotgrid-container > table');

        assert.ok($outerTable.length > 0);
        assert.equal($outerTable.attr('role'), 'presentation');
    });

    QUnit.test('Field-area tables have role="group" and localized aria-label', function(assert) {
        if(!windowUtils.hasWindow()) {
            assert.expect(0);
            return;
        }

        const pivotGrid = createPivotGrid({
            width: 600, height: 400,
            fieldPanel: {
                visible: true,
                showRowFields: true,
                showColumnFields: true,
                showDataFields: true,
                showFilterFields: true
            },
            dataSource: createExpandableDataSource()
        });
        this.clock.tick(10);

        const expectedLabels = {
            row: 'Row Fields',
            column: 'Column Fields',
            data: 'Data Fields',
            filter: 'Filter Fields'
        };

        Object.keys(expectedLabels).forEach((area) => {
            const $table = pivotGrid.$element()
                .find(`.dx-area-fields[group="${area}"] > table`);

            assert.strictEqual($table.length, 1, `${area} field table exists`);
            assert.strictEqual($table.attr('role'), 'group');
            assert.strictEqual($table.attr('aria-label'), expectedLabels[area]);
        });
    });

    QUnit.test('Scrollable containers have no tabindex', function(assert) {
        if(!windowUtils.hasWindow()) {
            assert.expect(0);
            return;
        }

        const pivotGrid = createPivotGrid({
            width: 600, height: 400,
            dataSource: createExpandableDataSource()
        });
        this.clock.tick(10);

        const $scrollableContainers = pivotGrid.$element().find('.dx-pivotgrid-area .dx-scrollable-container');

        assert.equal($scrollableContainers.length, 3);

        $scrollableContainers.each((_, container) => {
            assert.strictEqual(container.getAttribute('tabindex'), null);
        });
    });
});
