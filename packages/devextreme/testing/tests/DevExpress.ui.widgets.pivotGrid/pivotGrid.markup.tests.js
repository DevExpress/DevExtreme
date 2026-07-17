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

    QUnit.test('Expand control is a focusable button, td keeps its header cell role', function(assert) {
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
            assert.strictEqual($collapsedControl.attr('tabindex'), '-1', 'control is focusable programmatically only');
            assert.ok(['columnheader', 'rowheader'].includes($collapsedTd.attr('role')), 'td has a header cell role');
            assert.strictEqual($collapsedTd.attr('tabindex'), '0', 'td is the roving tab stop of the row headers area');
            assert.strictEqual($collapsedTd.attr('aria-expanded'), 'false', 'td exposes the collapsed state');
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
            assert.strictEqual($dataCell.attr('role'), 'gridcell', 'data cell has role="gridcell"');
            assert.strictEqual($dataCell.attr('tabindex'), '0', 'first data cell is focusable to provide keyboard access to the scrollable data area');
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

    QUnit.test('Populated field-area tables are exposed as a labelled menubar', function(assert) {
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
            data: 'Data Fields'
        };

        Object.keys(expectedLabels).forEach((area) => {
            const $table = pivotGrid.$element()
                .find(`.dx-area-fields[group="${area}"] > table`);

            assert.strictEqual($table.length, 1, `${area} field table exists`);
            assert.strictEqual($table.attr('role'), 'menubar', `${area} field table is a menubar`);
            assert.strictEqual($table.attr('aria-label'), expectedLabels[area], `${area} menubar has localized label`);
            assert.ok($table.attr('aria-description'), `${area} menubar has an interaction description`);
        });

        // The filter area has no fields in this data source; a menubar without
        // menu items is invalid ARIA, so its table stays presentational.
        const $filterTable = pivotGrid.$element()
            .find('.dx-area-fields[group="filter"] > table');

        assert.strictEqual($filterTable.attr('role'), 'presentation', 'empty filter area table is presentational');
        assert.strictEqual($filterTable.attr('aria-label'), undefined, 'empty filter area table has no aria-label');
        assert.strictEqual($filterTable.attr('aria-description'), undefined, 'empty filter area table has no aria-description');
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

    QUnit.test('Column header and data cells have aria-colindex along shared column axis', function(assert) {
        if(!windowUtils.hasWindow()) {
            assert.expect(0);
            return;
        }

        const pivotGrid = createPivotGrid({
            width: 600, height: 400,
            dataSource: createExpandableDataSource()
        });
        this.clock.tick(10);

        const $columnArea = pivotGrid.$element().find('.dx-pivotgrid-horizontal-headers');
        const $dataArea = pivotGrid.$element().find('.dx-pivotgrid-area-data');

        $columnArea.find('td').each((_, cell) => {
            assert.ok(parseInt(cell.getAttribute('aria-colindex'), 10) >= 1, 'column header cell has 1-based aria-colindex');
            assert.strictEqual(cell.getAttribute('aria-rowindex'), null, 'column header cell has no aria-rowindex');
        });

        $dataArea.find('td').each((_, cell) => {
            assert.ok(parseInt(cell.getAttribute('aria-colindex'), 10) >= 1, 'data cell has 1-based aria-colindex');
        });

        const $firstDataRowCells = $dataArea.find('tr').first().find('td');

        $firstDataRowCells.each((_, dataCell) => {
            const colIndex = dataCell.getAttribute('aria-colindex');
            const $headerCells = $columnArea.find(`td[aria-colindex="${colIndex}"]`);

            assert.ok($headerCells.length > 0, `column header exists for aria-colindex ${colIndex}`);
        });
    });

    QUnit.test('Row header and data cells have aria-rowindex along shared row axis', function(assert) {
        if(!windowUtils.hasWindow()) {
            assert.expect(0);
            return;
        }

        const pivotGrid = createPivotGrid({
            width: 600, height: 400,
            dataSource: createExpandableDataSource()
        });
        this.clock.tick(10);

        const $rowArea = pivotGrid.$element().find('.dx-pivotgrid-vertical-headers');
        const $dataArea = pivotGrid.$element().find('.dx-pivotgrid-area-data');

        $rowArea.find('td').each((_, cell) => {
            assert.ok(parseInt(cell.getAttribute('aria-rowindex'), 10) >= 1, 'row header cell has 1-based aria-rowindex');
            assert.strictEqual(cell.getAttribute('aria-colindex'), null, 'row header cell has no aria-colindex');
        });

        $dataArea.find('tr').each((rowIndex, row) => {
            const expectedRowIndex = String(rowIndex + 1);

            $(row).find('td').each((_, cell) => {
                assert.strictEqual(cell.getAttribute('aria-rowindex'), expectedRowIndex, 'data cell aria-rowindex');
            });

            const $rowHeaderCells = $rowArea.find('tr').eq(rowIndex).find('td');

            $rowHeaderCells.each((_, cell) => {
                assert.strictEqual(cell.getAttribute('aria-rowindex'), expectedRowIndex, 'row header aria-rowindex matches data row');
            });
        });
    });

    QUnit.test('Multi-level column header colspan is reflected in aria-colindex', function(assert) {
        if(!windowUtils.hasWindow()) {
            assert.expect(0);
            return;
        }

        const pivotGrid = createPivotGrid({
            width: 600, height: 400,
            dataSource: createExpandableDataSource()
        });
        this.clock.tick(10);

        const $columnArea = pivotGrid.$element().find('.dx-pivotgrid-horizontal-headers');
        const $topRowCells = $columnArea.find('tr').first().find('td');

        assert.ok($topRowCells.length > 0, 'top header row has cells');

        const $leafRow = $columnArea.find('tr').last();

        $topRowCells.each((_, cell) => {
            const colspan = cell.colSpan || 1;
            const colIndex = parseInt(cell.getAttribute('aria-colindex'), 10);

            assert.ok(colIndex >= 1, 'aria-colindex is 1-based');

            if(colspan > 1) {
                const leafColIndices = $leafRow.find('td').toArray()
                    .map(c => parseInt(c.getAttribute('aria-colindex'), 10))
                    .filter(ci => ci >= colIndex && ci < colIndex + colspan);

                assert.strictEqual(leafColIndices.length, colspan,
                    `parent with colspan=${colspan} at colindex=${colIndex} has exactly ${colspan} leaf columns`);
                assert.strictEqual(leafColIndices[0], colIndex,
                    'first leaf aria-colindex matches parent');
                assert.strictEqual(leafColIndices[leafColIndices.length - 1], colIndex + colspan - 1,
                    'last leaf aria-colindex equals parent colindex + colspan - 1');
            }
        });
    });

    QUnit.test('aria-colindex and aria-rowindex account for virtual scrolling offsets', function(assert) {
        if(!windowUtils.hasWindow()) {
            assert.expect(0);
            return;
        }

        const store = [];
        for(let i = 0; i < 50; i++) {
            store.push({ row: `row${i}`, column: `col${i}`, value: i + 1 });
        }

        const pivotGrid = createPivotGrid({
            width: 120,
            height: 120,
            fieldChooser: { enabled: false },
            scrolling: {
                mode: 'virtual',
                timeout: 0,
                virtualColumnWidth: 20,
                virtualRowHeight: 20
            },
            dataSource: {
                fields: [
                    { dataField: 'row', area: 'row' },
                    { dataField: 'column', area: 'column' },
                    { dataField: 'value', area: 'data' }
                ],
                store
            }
        });
        this.clock.tick(10);

        const dataController = pivotGrid._dataController;
        const columnPageSize = dataController._columnsScrollController.pageSize();
        const rowPageSize = dataController._rowsScrollController.pageSize();

        const assertAriaIndices = (columnOffset, rowOffset, messagePrefix) => {
            const $dataRows = pivotGrid.$element().find('.dx-pivotgrid-area-data tr');
            const $firstDataCell = $dataRows.first().find('td').first();
            const $lastDataCell = $dataRows.last().find('td').last();
            const $firstColumnHeaderCell = pivotGrid.$element().find('.dx-pivotgrid-horizontal-headers td[aria-colindex]').first();
            const $lastColumnHeaderCell = pivotGrid.$element().find('.dx-pivotgrid-horizontal-headers tr').last().find('td[aria-colindex]').last();
            const $firstRowHeaderCell = pivotGrid.$element().find('.dx-pivotgrid-vertical-headers tr').first().find('td').first();
            const $lastRowHeaderCell = pivotGrid.$element().find('.dx-pivotgrid-vertical-headers tr').last().find('td').last();

            assert.strictEqual(
                dataController.getColumnIndexOffset(),
                columnOffset,
                `${messagePrefix}: getColumnIndexOffset`
            );
            assert.strictEqual(
                dataController.getRowIndexOffset(),
                rowOffset,
                `${messagePrefix}: getRowIndexOffset`
            );
            assert.strictEqual(
                $firstDataCell.attr('aria-colindex'),
                String(columnOffset + 1),
                `${messagePrefix}: first data cell aria-colindex`
            );
            assert.strictEqual(
                $firstColumnHeaderCell.attr('aria-colindex'),
                String(columnOffset + 1),
                `${messagePrefix}: first column header aria-colindex`
            );
            assert.ok(
                parseInt($lastColumnHeaderCell.attr('aria-colindex'), 10) > columnOffset + 1,
                `${messagePrefix}: last column header aria-colindex is greater than first`
            );
            assert.strictEqual(
                $firstDataCell.attr('aria-rowindex'),
                String(rowOffset + 1),
                `${messagePrefix}: first data cell aria-rowindex`
            );
            assert.strictEqual(
                $firstRowHeaderCell.attr('aria-rowindex'),
                String(rowOffset + 1),
                `${messagePrefix}: first row header aria-rowindex`
            );
            assert.ok(
                parseInt($lastDataCell.attr('aria-rowindex'), 10) > rowOffset + 1,
                `${messagePrefix}: last data cell aria-rowindex is greater than first`
            );
            assert.ok(
                parseInt($lastRowHeaderCell.attr('aria-rowindex'), 10) > rowOffset + 1,
                `${messagePrefix}: last row header aria-rowindex is greater than first`
            );
        };

        assertAriaIndices(0, 0, 'initial');

        const columnBeginPageIndex = 2;
        const rowBeginPageIndex = 1;

        const stubs = [
            sinon.stub(dataController._columnsScrollController, 'beginPageIndex').returns(columnBeginPageIndex),
            sinon.stub(dataController._rowsScrollController, 'beginPageIndex').returns(rowBeginPageIndex),
            sinon.stub(dataController._columnsScrollController, 'endPageIndex').returns(columnBeginPageIndex),
            sinon.stub(dataController._rowsScrollController, 'endPageIndex').returns(rowBeginPageIndex),
        ];

        try {
            dataController.changed.fire();
            this.clock.tick(10);

            assertAriaIndices(
                columnBeginPageIndex * columnPageSize,
                rowBeginPageIndex * rowPageSize,
                'after virtual page change'
            );
        } finally {
            stubs.forEach(s => s.restore());
        }
    });

    QUnit.test('Inner area tables and their thead/tbody have role="presentation"', function(assert) {
        if(!windowUtils.hasWindow()) {
            assert.expect(0);
            return;
        }

        const pivotGrid = createPivotGrid({
            width: 600, height: 400,
            dataSource: createExpandableDataSource()
        });
        this.clock.tick(10);

        const areaSelectors = [
            'thead.dx-pivotgrid-horizontal-headers',
            'tbody.dx-pivotgrid-vertical-headers',
            '.dx-pivotgrid-area-data table'
        ];

        areaSelectors.forEach((selector) => {
            const $element = pivotGrid.$element().find(selector);

            assert.ok($element.length > 0, `${selector} exists`);
            assert.strictEqual($element.attr('role'), 'presentation', `${selector} has role="presentation"`);
        });
    });

    QUnit.test('Each row of an area table has role="row"', function(assert) {
        if(!windowUtils.hasWindow()) {
            assert.expect(0);
            return;
        }

        const pivotGrid = createPivotGrid({
            width: 600, height: 400,
            dataSource: createExpandableDataSource()
        });
        this.clock.tick(10);

        const $rows = pivotGrid.$element().find('.dx-pivotgrid-area table tr');

        assert.ok($rows.length > 0, 'rows exist');
        $rows.each((_, row) => {
            assert.strictEqual(row.getAttribute('role'), 'row');
        });
    });

    QUnit.test('Cells have role="columnheader"/"rowheader"/"gridcell" per area', function(assert) {
        if(!windowUtils.hasWindow()) {
            assert.expect(0);
            return;
        }

        const pivotGrid = createPivotGrid({
            width: 600, height: 400,
            dataSource: createExpandableDataSource()
        });
        this.clock.tick(10);

        const $columnHeaderCells = pivotGrid.$element().find('.dx-pivotgrid-horizontal-headers td').not('.dx-white-space-column');
        const $rowHeaderCells = pivotGrid.$element().find('.dx-pivotgrid-vertical-headers td').not('.dx-white-space-column');
        const $dataCells = pivotGrid.$element().find('.dx-pivotgrid-area-data td');
        const $whiteSpaceCells = pivotGrid.$element().find('.dx-white-space-column');

        assert.ok($columnHeaderCells.length > 0, 'column header cells exist');
        assert.ok($rowHeaderCells.length > 0, 'row header cells exist');
        assert.ok($dataCells.length > 0, 'data cells exist');

        $columnHeaderCells.each((_, cell) => assert.strictEqual(cell.getAttribute('role'), 'columnheader'));
        $rowHeaderCells.each((_, cell) => assert.strictEqual(cell.getAttribute('role'), 'rowheader'));
        $dataCells.each((_, cell) => assert.strictEqual(cell.getAttribute('role'), 'gridcell'));
        $whiteSpaceCells.each((_, cell) => assert.strictEqual(cell.getAttribute('role'), null, 'white-space filler cell has no header role'));
    });

    QUnit.test('Data area\'s grid element has role="grid", aria-owns linking the area tables, and aria-rowcount/aria-colcount from the data source', function(assert) {
        if(!windowUtils.hasWindow()) {
            assert.expect(0);
            return;
        }

        const pivotGrid = createPivotGrid({
            width: 600, height: 400,
            dataSource: createExpandableDataSource()
        });
        this.clock.tick(10);

        const dataController = pivotGrid._dataController;
        const columnsTableId = pivotGrid._columnsArea.tableElement().attr('id');
        const rowsTableId = pivotGrid._rowsArea.tableElement().attr('id');
        const dataTableId = pivotGrid._dataArea.tableElement().attr('id');
        const $gridElement = pivotGrid._dataArea.tableElement().parent();

        const ariaOwns = $gridElement.attr('aria-owns').split(' ');

        assert.ok($gridElement.hasClass('dx-scrollable-content'), 'grid element is the data table\'s scrollable content wrapper');
        assert.strictEqual($gridElement.attr('role'), 'grid', 'grid element has role="grid"');

        [columnsTableId, rowsTableId, dataTableId].forEach((id) => {
            assert.ok(id, 'table has an id');
            assert.ok(ariaOwns.includes(id), `aria-owns includes ${id}`);
        });

        assert.strictEqual(
            $gridElement.attr('aria-rowcount'),
            String(dataController.totalRowCount())
        );
        assert.strictEqual(
            $gridElement.attr('aria-colcount'),
            String(dataController.totalColumnCount())
        );
    });
});
