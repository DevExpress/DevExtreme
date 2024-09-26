import 'generic_light.css!';

import 'ui/data_grid';

import $ from 'jquery';
import { setupDataGridModules, MockDataController } from '../../helpers/dataGridMocks.js';
import { addShadowDomStyles } from 'core/utils/shadow_dom';

QUnit.testStart(function() {
    const markup =
        `<style nonce="qunit-test">
            .qunit-fixture-static {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
            }
        </style>
        <div>
            <div id="container" class="dx-widget" style="width: 2000px;">
                <div class="dx-datagrid">
                </div>
            </div>
        </div>`;

    $('#qunit-fixture').html(markup);
    addShadowDomStyles($('#qunit-fixture'));
});

QUnit.module('Column resizing points - columnResizingMode = "nextColumn"', {
    beforeEach: function() {
        $('#qunit-fixture').addClass('qunit-fixture-static');
        this.$element = () => $('#container');
        this.gridContainer = $('#container > .dx-datagrid');

        this.$element().width(800);

        this.columns = [
            {
                caption: 'Column 1', fixed: true, width: 100, allowResizing: true
            },
            {
                caption: 'Column 2', width: 150, allowResizing: true
            },
            {
                caption: 'Column 3', fixed: true, width: 125, allowResizing: true
            },
            {
                caption: 'Column 4', fixed: true, fixedPosition: 'right', width: 200, allowResizing: true
            },
            {
                caption: 'Column 5', width: 150, allowResizing: true
            },
            {
                caption: 'Column 6', width: 150, allowResizing: true
            },
            {
                caption: 'Column 7', fixed: true, fixedPosition: 'right', width: 200, allowResizing: true
            }
        ];

        this.setupDataGrid = (options) => {
            this.options = {
                showColumnHeaders: true,
                columns: this.columns,
                allowColumnResizing: true,
                columnResizingMode: 'nextColumn',
                ...options,
            };

            setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'rows', 'stickyColumns', 'columnsResizingReordering'], {
                initViews: true,
                controllers: {
                    data: new MockDataController({ items: this.items || [] })
                },
                options: {
                    columnFixing: {
                        legacyMode: false
                    }
                }
            });
        };
    },
    afterEach: function() {
        $('#qunit-fixture').removeClass('qunit-fixture-static');
        this.dispose();
    }
}, () => {
    QUnit.module('Columns with left and right positions', () => {
        QUnit.test('should get the correct points when scrollLeft = 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 5, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 225, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 3, x: 375, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 4, index: 5, x: 400, y: 0 }, 'fourth point');
            assert.deepEqual(pointsByColumns[4], { columnIndex: 5, index: 6, x: 600, y: 0 }, 'fifth point');
        });

        QUnit.test('should get the correct points when scrollLeft !== 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(50);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 50, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 5, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 225, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 3, x: 325, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 4, index: 5, x: 400, y: 0 }, 'fourth point');
            assert.deepEqual(pointsByColumns[4], { columnIndex: 5, index: 6, x: 600, y: 0 }, 'fifth point');
        });

        QUnit.test('should get the correct points when scroll position is at the end', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 275, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 5, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 225, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 250, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 4, index: 5, x: 400, y: 0 }, 'fourth point');
            assert.deepEqual(pointsByColumns[4], { columnIndex: 5, index: 6, x: 600, y: 0 }, 'fifth point');
        });
    });

    QUnit.module('Columns with sticky position', {
        beforeEach: function() {
            this.$element().width(400);
            this.columns = [
                {
                    caption: 'Column 1', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 5', width: 175, allowResizing: true
                },
            ];
        }
    }, () => {
        QUnit.test('should get the correct points when scrollLeft = 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 4, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 175, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 3, x: 275, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 3, index: 4, x: 375, y: 0 }, 'fourth point');
        });

        QUnit.test('should get the correct points when scrollLeft !== 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(50);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 50, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 4, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 125, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 3, x: 225, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 3, index: 4, x: 325, y: 0 }, 'fourth point');
        });

        QUnit.test('should get the correct points when scroll position is at the end', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 150, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 3, x: 198, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 298, y: 0 }, 'third point');
        });
    });

    QUnit.module('Columns with left and sticky positions', {
        beforeEach: function() {
            this.$element().width(400);
            this.columns = [
                {
                    caption: 'Column 1', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', fixed: true, fixedPosition: 'sticky', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 5', width: 175, allowResizing: true
                },
            ];
        }
    }, () => {
        QUnit.test('should get the correct points when scrollLeft = 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 4, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 200, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 3, x: 275, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 3, index: 4, x: 375, y: 0 }, 'fourth point');
        });

        QUnit.test('should get the correct points when scrollLeft !== 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(50);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 50, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 4, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 150, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 3, x: 225, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 3, index: 4, x: 325, y: 0 }, 'fourth point');
        });

        QUnit.test('should get the correct points when scroll position is at the end', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 150, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 3, x: 173, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 225, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when sticky column after left fixed column and scrollLeft = 0', function(assert) {
            // arrange
            this.columns = [
                {
                    caption: 'Column 1', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 4, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 200, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 3, x: 275, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 3, index: 4, x: 375, y: 0 }, 'fourth point');
        });

        QUnit.test('should get the correct points when sticky column after left fixed column and scrollLeft !== 0', function(assert) {
            // arrange
            this.columns = [
                {
                    caption: 'Column 1', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(50);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 50, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 4, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 200, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 3, x: 225, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 3, index: 4, x: 325, y: 0 }, 'fourth point');
        });

        QUnit.test('should get the correct points when sticky column after left fixed column and scroll position is at the end', function(assert) {
            // arrange
            this.columns = [
                {
                    caption: 'Column 1', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 150, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 200, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 225, y: 0 }, 'third point');
        });
    });

    QUnit.module('Columns with right and sticky positions', {
        beforeEach: function() {
            this.$element().width(360);
            this.columns = [
                {
                    caption: 'Column 1', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, fixedPosition: 'right', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 5', width: 175, allowResizing: true
                },
            ];
        }
    }, () => {
        QUnit.test('should get the correct points when scrollLeft = 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 162, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 260, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when scrollLeft !== 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(150);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 150, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 1, index: 2, x: 125, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 3, x: 225, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 260, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when scroll position is at the end', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 290, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 2, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 2, index: 3, x: 98, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 3, index: 4, x: 260, y: 0 }, 'second point');
        });

        QUnit.test('should get the correct points when sticky column before right fixed column and scrollLeft = 0', function(assert) {
            // arrange
            this.$element().width(400);
            this.columns = [
                {
                    caption: 'Column 1', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, fixedPosition: 'right', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', fixed: true, fixedPosition: 'sticky', width: 175, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 3, x: 125, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 300, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when sticky column before right fixed column and scrollLeft !== 0', function(assert) {
            // arrange
            this.$element().width(400);
            this.columns = [
                {
                    caption: 'Column 1', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, fixedPosition: 'right', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', fixed: true, fixedPosition: 'sticky', width: 175, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(50);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 50, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 50, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 3, x: 125, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 300, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when sticky column before right fixed column and scroll position is at the end', function(assert) {
            // arrange
            this.$element().width(400);
            this.columns = [
                {
                    caption: 'Column 1', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, fixedPosition: 'right', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', fixed: true, fixedPosition: 'sticky', width: 175, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 150, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 1, index: 2, x: 25, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 3, x: 125, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 300, y: 0 }, 'third point');
        });
    });
});

QUnit.module('Column resizing points - columnResizingMode = "nextColumn" (rtlEnabled = true)', {
    beforeEach: function() {
        $('#qunit-fixture').addClass('qunit-fixture-static');
        const $container = $('#container')
            .width(800)
            .addClass('dx-rtl');

        this.$element = () => $container;
        this.gridContainer = $('#container > .dx-datagrid');

        this.columns = [
            {
                caption: 'Column 1', fixed: true, width: 100, allowResizing: true
            },
            {
                caption: 'Column 2', width: 150, allowResizing: true
            },
            {
                caption: 'Column 3', fixed: true, width: 125, allowResizing: true
            },
            {
                caption: 'Column 4', fixed: true, fixedPosition: 'right', width: 200, allowResizing: true
            },
            {
                caption: 'Column 5', width: 150, allowResizing: true
            },
            {
                caption: 'Column 6', width: 150, allowResizing: true
            },
            {
                caption: 'Column 7', fixed: true, fixedPosition: 'right', width: 200, allowResizing: true
            }
        ];

        this.setupDataGrid = (options) => {
            this.options = {
                rtlEnabled: true,
                showColumnHeaders: true,
                columns: this.columns,
                allowColumnResizing: true,
                columnResizingMode: 'nextColumn',
                ...options,
            };

            setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'rows', 'stickyColumns', 'columnsResizingReordering'], {
                initViews: true,
                controllers: {
                    data: new MockDataController({ items: this.items || [] })
                },
                options: {
                    columnFixing: {
                        legacyMode: false
                    }
                }
            });
        };
    },
    afterEach: function() {
        $('#qunit-fixture').removeClass('qunit-fixture-static');
        this.dispose();
    }
}, () => {
    QUnit.module('Columns with left and right positions', () => {
        QUnit.test('should get the correct points when scrollLeft = 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 5, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 600, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 400, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 3, x: 250, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 4, index: 5, x: 225, y: 0 }, 'fourth point');
            assert.deepEqual(pointsByColumns[4], { columnIndex: 5, index: 6, x: 125, y: 0 }, 'fifth point');
        });

        QUnit.test('should get the correct points when scrollLeft !== 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-50);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -50, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 5, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 600, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 400, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 3, x: 300, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 4, index: 5, x: 225, y: 0 }, 'fourth point');
            assert.deepEqual(pointsByColumns[4], { columnIndex: 5, index: 6, x: 125, y: 0 }, 'fifth point');
        });

        QUnit.test('should get the correct points when scroll position is at the end', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -275, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 5, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 600, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 400, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 375, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 4, index: 5, x: 225, y: 0 }, 'fourth point');
            assert.deepEqual(pointsByColumns[4], { columnIndex: 5, index: 6, x: 125, y: 0 }, 'fifth point');
        });
    });

    QUnit.module('Columns with sticky position', {
        beforeEach: function() {
            this.$element().width(400);
            this.columns = [
                {
                    caption: 'Column 1', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 5', width: 175, allowResizing: true
                },
            ];
        }
    }, () => {
        QUnit.test('should get the correct points when scrollLeft = 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 4, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 300, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 225, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 3, x: 125, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 3, index: 4, x: 25, y: 0 }, 'fourth point');
        });

        QUnit.test('should get the correct points when scrollLeft !== 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-50);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -50, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 4, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 300, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 275, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 3, x: 175, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 3, index: 4, x: 75, y: 0 }, 'fourth point');
        });

        QUnit.test('should get the correct points when scroll position is at the end', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -150, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 300, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 3, x: 202, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 102, y: 0 }, 'third point');
        });
    });

    QUnit.module('Columns with left and sticky positions', {
        beforeEach: function() {
            this.$element().width(400);
            this.columns = [
                {
                    caption: 'Column 1', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 5', width: 175, allowResizing: true
                },
            ];
        }
    }, () => {
        QUnit.test('should get the correct points when scrollLeft = 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 300, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 198, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 100, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when scrollLeft !== 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-150);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -150, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 1, index: 2, x: 275, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 3, x: 175, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 100, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when scroll position is at the end', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -250, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 1, index: 2, x: 375, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 3, x: 275, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 100, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when sticky column after left fixed column and scrollLeft = 0', function(assert) {
            // arrange
            this.columns = [
                {
                    caption: 'Column 1', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 5', fixed: true, fixedPosition: 'sticky', width: 75, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 300, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 3, x: 175, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 100, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when sticky column after left fixed column and scrollLeft !== 0', function(assert) {
            // arrange
            this.columns = [
                {
                    caption: 'Column 1', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 5', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-50);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -50, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 350, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 3, x: 200, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 100, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when sticky column after left fixed column and scroll position is at the end', function(assert) {
            // arrange
            this.columns = [
                {
                    caption: 'Column 1', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 5', fixed: true, fixedPosition: 'sticky', width: 175, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -150, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 1, index: 2, x: 375, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 3, x: 275, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 100, y: 0 }, 'third point');
        });
    });

    QUnit.module('Columns with right and sticky positions', {
        beforeEach: function() {
            this.$element().width(400);
            this.columns = [
                {
                    caption: 'Column 1', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, fixedPosition: 'right', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
            ];
        }
    }, () => {
        QUnit.test('should get the correct points when scrollLeft = 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 300, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 200, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 3, x: 98, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when scrollLeft !== 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-150);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -150, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 300, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 3, x: 175, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 75, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when scroll position is at the end', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -250, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 300, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 3, x: 275, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 175, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when sticky column before right fixed column and scrollLeft = 0', function(assert) {
            // arrange
            this.columns = [
                {
                    caption: 'Column 1', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, fixedPosition: 'right', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 4, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 300, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 200, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 3, x: 125, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 3, index: 4, x: 25, y: 0 }, 'fourth point');
        });

        QUnit.test('should get the correct points when sticky column before right fixed column and scrollLeft !== 0', function(assert) {
            // arrange
            this.columns = [
                {
                    caption: 'Column 1', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, fixedPosition: 'right', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-50);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -50, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 4, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 300, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 200, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 3, x: 175, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 3, index: 4, x: 75, y: 0 }, 'fourth point');
        });

        QUnit.test('should get the correct points when sticky column before right fixed column and scroll position is at the end', function(assert) {
            // arrange
            this.columns = [
                {
                    caption: 'Column 1', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, fixedPosition: 'right', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -150, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 300, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 200, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 175, y: 0 }, 'third point');
        });
    });
});

QUnit.module('Column resizing points - columnResizingMode = "widget"', {
    beforeEach: function() {
        $('#qunit-fixture').addClass('qunit-fixture-static');
        this.$element = () => $('#container');
        this.gridContainer = $('#container > .dx-datagrid');

        this.$element().width(800);

        this.columns = [
            {
                caption: 'Column 1', fixed: true, width: 100, allowResizing: true
            },
            {
                caption: 'Column 2', width: 150, allowResizing: true
            },
            {
                caption: 'Column 3', fixed: true, width: 125, allowResizing: true
            },
            {
                caption: 'Column 4', fixed: true, fixedPosition: 'right', width: 200, allowResizing: true
            },
            {
                caption: 'Column 5', width: 150, allowResizing: true
            },
            {
                caption: 'Column 6', width: 150, allowResizing: true
            },
            {
                caption: 'Column 7', fixed: true, fixedPosition: 'right', width: 200, allowResizing: true
            }
        ];

        this.setupDataGrid = (options) => {
            this.options = {
                showColumnHeaders: true,
                columns: this.columns,
                allowColumnResizing: true,
                columnResizingMode: 'widget',
                ...options,
            };

            setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'rows', 'stickyColumns', 'columnsResizingReordering'], {
                initViews: true,
                controllers: {
                    data: new MockDataController({ items: this.items || [] })
                },
                options: {
                    columnFixing: {
                        legacyMode: false
                    }
                }
            });
        };
    },
    afterEach: function() {
        $('#qunit-fixture').removeClass('qunit-fixture-static');
        this.dispose();
    }
}, () => {
    QUnit.module('Columns with left and right positions', () => {
        QUnit.test('should get the correct points when scrollLeft = 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 5, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 225, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 3, x: 375, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 5, index: 5, x: 400, y: 0 }, 'fourth point');
            assert.deepEqual(pointsByColumns[4], { columnIndex: 6, index: 6, x: 600, y: 0 }, 'fifth point');
        });

        QUnit.test('should get the correct points when scrollLeft !== 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(50);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 50, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 5, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 225, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 3, x: 325, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 5, index: 5, x: 400, y: 0 }, 'fourth point');
            assert.deepEqual(pointsByColumns[4], { columnIndex: 6, index: 6, x: 600, y: 0 }, 'fifth point');
        });

        QUnit.test('should get the correct points when scroll position is at the end', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 275, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 5, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 225, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 250, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 4, index: 5, x: 400, y: 0 }, 'fourth point');
            assert.deepEqual(pointsByColumns[4], { columnIndex: 6, index: 6, x: 600, y: 0 }, 'fifth point');
        });
    });

    QUnit.module('Columns with sticky position', {
        beforeEach: function() {
            this.$element().width(400);
            this.columns = [
                {
                    caption: 'Column 1', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 5', width: 175, allowResizing: true
                },
            ];
        }
    }, () => {
        QUnit.test('should get the correct points when scrollLeft = 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 4, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 175, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 3, x: 275, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 3, index: 4, x: 375, y: 0 }, 'fourth point');
        });

        QUnit.test('should get the correct points when scrollLeft !== 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(50);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 50, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 4, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 125, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 3, x: 225, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 3, index: 4, x: 325, y: 0 }, 'fourth point');
        });

        QUnit.test('should get the correct points when scroll position is at the end', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 150, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 4, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 3, x: 198, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 298, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 4, index: 5, x: 400, y: 0 }, 'fourth point');
        });
    });

    QUnit.module('Columns with left and sticky positions', {
        beforeEach: function() {
            this.$element().width(350);
            this.columns = [
                {
                    caption: 'Column 1', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 5', width: 175, allowResizing: true
                },
            ];
        }
    }, () => {
        QUnit.test('should get the correct points when scrollLeft = 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 200, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 3, x: 252, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when scrollLeft !== 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(150);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 150, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 3, x: 225, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 325, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when scroll position is at the end', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 300, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 3, index: 4, x: 198, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 4, index: 5, x: 350, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when sticky column after left fixed column and scrollLeft = 0', function(assert) {
            // arrange
            this.columns = [
                {
                    caption: 'Column 1', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 200, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 3, x: 275, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when sticky column after left fixed column and scrollLeft !== 0', function(assert) {
            // arrange
            this.columns = [
                {
                    caption: 'Column 1', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(50);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 50, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 4, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 200, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 3, x: 225, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 3, index: 4, x: 325, y: 0 }, 'fourth point');
        });

        QUnit.test('should get the correct points when sticky column after left fixed column and scroll position is at the end', function(assert) {
            // arrange
            this.columns = [
                {
                    caption: 'Column 1', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 200, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 200, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 4, index: 5, x: 350, y: 0 }, 'third point');
        });
    });

    QUnit.module('Columns with right and sticky positions', {
        beforeEach: function() {
            this.$element().width(400);
            this.columns = [
                {
                    caption: 'Column 1', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, fixedPosition: 'right', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 5', width: 175, allowResizing: true
                },
            ];
        }
    }, () => {
        QUnit.test('should get the correct points when scrollLeft = 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 2, x: 202, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 4, index: 4, x: 300, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when scrollLeft !== 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(50);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 50, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 50, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 2, x: 202, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 4, index: 4, x: 300, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when scroll position is at the end', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 250, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 1, index: 2, x: 25, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 3, x: 125, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 300, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when sticky column before right fixed column and scrollLeft = 0', function(assert) {
            // arrange
            this.columns = [
                {
                    caption: 'Column 1', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, fixedPosition: 'right', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', fixed: true, fixedPosition: 'sticky', width: 175, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 100, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 3, index: 3, x: 125, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 4, index: 4, x: 300, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when sticky column before right fixed column and scrollLeft !== 0', function(assert) {
            // arrange
            this.columns = [
                {
                    caption: 'Column 1', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, fixedPosition: 'right', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', fixed: true, fixedPosition: 'sticky', width: 175, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(50);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 50, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 50, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 3, index: 3, x: 125, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 4, index: 4, x: 300, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when sticky column before right fixed column and scroll position is at the end', function(assert) {
            // arrange
            this.columns = [
                {
                    caption: 'Column 1', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, fixedPosition: 'right', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', fixed: true, fixedPosition: 'sticky', width: 175, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), 150, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 1, index: 2, x: 25, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 3, x: 125, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 4, index: 4, x: 300, y: 0 }, 'third point');
        });
    });
});

QUnit.module('Column resizing points - columnResizingMode = "widget" (rtlEnabled = true)', {
    beforeEach: function() {
        $('#qunit-fixture').addClass('qunit-fixture-static');
        const $container = $('#container')
            .width(800)
            .addClass('dx-rtl');

        this.$element = () => $container;
        this.gridContainer = $('#container > .dx-datagrid');

        this.columns = [
            {
                caption: 'Column 1', fixed: true, width: 100, allowResizing: true
            },
            {
                caption: 'Column 2', width: 150, allowResizing: true
            },
            {
                caption: 'Column 3', fixed: true, width: 125, allowResizing: true
            },
            {
                caption: 'Column 4', fixed: true, fixedPosition: 'right', width: 200, allowResizing: true
            },
            {
                caption: 'Column 5', width: 150, allowResizing: true
            },
            {
                caption: 'Column 6', width: 150, allowResizing: true
            },
            {
                caption: 'Column 7', fixed: true, fixedPosition: 'right', width: 200, allowResizing: true
            }
        ];

        this.setupDataGrid = (options) => {
            this.options = {
                rtlEnabled: true,
                showColumnHeaders: true,
                columns: this.columns,
                allowColumnResizing: true,
                columnResizingMode: 'widget',
                ...options,
            };

            setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'rows', 'stickyColumns', 'columnsResizingReordering'], {
                initViews: true,
                controllers: {
                    data: new MockDataController({ items: this.items || [] })
                },
                options: {
                    columnFixing: {
                        legacyMode: false
                    }
                }
            });
        };
    },
    afterEach: function() {
        $('#qunit-fixture').removeClass('qunit-fixture-static');
        this.dispose();
    }
}, () => {
    QUnit.module('Columns with left and right positions', () => {
        QUnit.test('should get the correct points when scrollLeft = 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 5, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 600, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 2, x: 400, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 3, x: 250, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 5, index: 5, x: 225, y: 0 }, 'fourth point');
            assert.deepEqual(pointsByColumns[4], { columnIndex: 6, index: 6, x: 125, y: 0 }, 'fifth point');
        });

        QUnit.test('should get the correct points when scrollLeft !== 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-50);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -50, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 5, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 600, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 400, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 3, x: 300, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 5, index: 5, x: 225, y: 0 }, 'fourth point');
            assert.deepEqual(pointsByColumns[4], { columnIndex: 6, index: 6, x: 125, y: 0 }, 'fifth point');
        });

        QUnit.test('should get the correct points when scroll position is at the end', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -275, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 5, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 600, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 400, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 4, index: 4, x: 375, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 5, index: 5, x: 225, y: 0 }, 'fourth point');
            assert.deepEqual(pointsByColumns[4], { columnIndex: 6, index: 6, x: 125, y: 0 }, 'fifth point');
        });
    });

    QUnit.module('Columns with sticky position', {
        beforeEach: function() {
            this.$element().width(400);
            this.columns = [
                {
                    caption: 'Column 1', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 5', width: 175, allowResizing: true
                },
            ];
        }
    }, () => {
        QUnit.test('should get the correct points when scrollLeft = 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 4, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 1, index: 1, x: 300, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 2, x: 225, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 3, x: 125, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 4, index: 4, x: 25, y: 0 }, 'fourth point');
        });

        QUnit.test('should get the correct points when scrollLeft !== 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-50);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -50, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 4, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 300, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 2, x: 275, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 3, x: 175, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 4, index: 4, x: 75, y: 0 }, 'fourth point');
        });

        QUnit.test('should get the correct points when scroll position is at the end', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -150, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 300, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 3, x: 202, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 4, x: 102, y: 0 }, 'third point');
        });
    });

    QUnit.module('Columns with left and sticky positions', {
        beforeEach: function() {
            this.$element().width(360);
            this.columns = [
                {
                    caption: 'Column 1', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 5', width: 175, allowResizing: true
                },
            ];
        }
    }, () => {
        QUnit.test('should get the correct points when scrollLeft = 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 4, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 0, x: 360, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 1, x: 260, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 2, x: 198, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 4, index: 4, x: 100, y: 0 }, 'fourth point');
        });

        QUnit.test('should get the correct points when scrollLeft !== 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-150);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -150, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 2, index: 2, x: 235, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 3, index: 3, x: 135, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 4, index: 4, x: 100, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when scroll position is at the end', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -290, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 2, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 2, index: 3, x: 262, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 4, index: 4, x: 100, y: 0 }, 'second point');
        });

        QUnit.test('should get the correct points when sticky column after left fixed column and scrollLeft = 0', function(assert) {
            // arrange
            this.$element().width(400);
            this.columns = [
                {
                    caption: 'Column 1', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 5', fixed: true, fixedPosition: 'sticky', width: 75, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 4, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 0, x: 400, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 1, x: 300, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 3, x: 175, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 4, index: 4, x: 100, y: 0 }, 'fourth point');
        });

        QUnit.test('should get the correct points when sticky column after left fixed column and scrollLeft !== 0', function(assert) {
            // arrange
            this.$element().width(400);
            this.columns = [
                {
                    caption: 'Column 1', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 5', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-50);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -50, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 1, index: 1, x: 350, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 3, index: 3, x: 200, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 4, index: 4, x: 100, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when sticky column after left fixed column and scroll position is at the end', function(assert) {
            // arrange
            this.$element().width(400);
            this.columns = [
                {
                    caption: 'Column 1', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 5', fixed: true, fixedPosition: 'sticky', width: 175, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -150, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 2, index: 2, x: 375, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 3, index: 3, x: 275, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 4, index: 4, x: 100, y: 0 }, 'third point');
        });
    });

    QUnit.module('Columns with right and sticky positions', {
        beforeEach: function() {
            this.$element().width(400);
            this.columns = [
                {
                    caption: 'Column 1', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', fixed: true, fixedPosition: 'sticky', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, fixedPosition: 'right', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
            ];
        }
    }, () => {
        QUnit.test('should get the correct points when scrollLeft = 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 4, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 1, index: 1, x: 300, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 2, x: 200, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 3, x: 125, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 4, index: 4, x: 25, y: 0 }, 'fourth point');
        });

        QUnit.test('should get the correct points when scrollLeft !== 0', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-50);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -50, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 4, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 300, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 2, x: 250, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 3, x: 175, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 4, index: 4, x: 75, y: 0 }, 'fourth point');
        });

        QUnit.test('should get the correct points when scroll position is at the end', function(assert) {
            // arrange
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -150, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 300, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 3, x: 227, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 4, index: 4, x: 175, y: 0 }, 'third point');
        });

        QUnit.test('should get the correct points when sticky column before right fixed column and scrollLeft = 0', function(assert) {
            // arrange
            this.columns = [
                {
                    caption: 'Column 1', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, fixedPosition: 'right', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 4, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 300, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 2, x: 200, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 3, x: 125, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 4, index: 4, x: 25, y: 0 }, 'fourth point');
        });

        QUnit.test('should get the correct points when sticky column before right fixed column and scrollLeft !== 0', function(assert) {
            // arrange
            this.columns = [
                {
                    caption: 'Column 1', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, fixedPosition: 'right', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-50);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -50, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 4, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 300, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 200, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 3, x: 175, y: 0 }, 'third point');
            assert.deepEqual(pointsByColumns[3], { columnIndex: 4, index: 4, x: 75, y: 0 }, 'fourth point');
        });

        QUnit.test('should get the correct points when sticky column before right fixed column and scroll position is at the end', function(assert) {
            // arrange
            this.columns = [
                {
                    caption: 'Column 1', fixed: true, fixedPosition: 'sticky', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 75, allowResizing: true
                },
                {
                    caption: 'Column 3', fixed: true, fixedPosition: 'right', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 4', width: 100, allowResizing: true
                },
                {
                    caption: 'Column 2', width: 175, allowResizing: true
                },
            ];
            this.setupDataGrid();
            this.columnHeadersView.render(this.gridContainer);
            this.columnHeadersView.resize();
            const $dataGridContent = $(this.columnHeadersView.element()).children();
            $dataGridContent.scrollLeft(-1000);

            // assert
            assert.strictEqual($dataGridContent.scrollLeft(), -150, 'content scroll left');

            // act
            this.columnsResizerController._generatePointsByColumns();
            const pointsByColumns = this.columnsResizerController._pointsByColumns;

            // assert
            assert.strictEqual(pointsByColumns.length, 3, 'count points by columns');
            assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 1, x: 300, y: 0 }, 'first point');
            assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 2, x: 200, y: 0 }, 'second point');
            assert.deepEqual(pointsByColumns[2], { columnIndex: 4, index: 4, x: 175, y: 0 }, 'third point');
        });
    });
});

QUnit.module('Column reordering points', {
    beforeEach: function() {
        $('#qunit-fixture').addClass('qunit-fixture-static');
        this.$element = () => $('#container');
        this.gridContainer = $('#container > .dx-datagrid');

        this.$element().width(800);

        this.columns = [
            {
                caption: 'Column 1', fixed: true, fixedPosition: 'right', width: 100, allowReordering: true
            },
            {
                caption: 'Col 2', fixed: true, fixedPosition: 'right', width: 75, allowReordering: true
            },
            {
                caption: 'Column 3', fixed: true, fixedPosition: 'right', width: 100, allowReordering: true
            },
            {
                caption: 'Column 4', width: 125, allowReordering: true
            },
            {
                caption: 'Column 5', width: 100, allowReordering: true
            },
            {
                caption: 'Column 6', width: 125, allowReordering: true
            },
            {
                caption: 'Column 7', width: 100, allowReordering: true
            },
            {
                caption: 'Column 8', width: 125, allowReordering: true
            },
            {
                caption: 'Column 9', fixed: true, fixedPosition: 'left', width: 100, allowReordering: true
            },
            {
                caption: 'Col 10', fixed: true, fixedPosition: 'left', width: 75, allowReordering: true
            },
            {
                caption: 'Column 11', fixed: true, fixedPosition: 'left', width: 100, allowReordering: true
            }
        ];

        this.setupDataGrid = (options) => {
            this.options = {
                showColumnHeaders: true,
                columns: this.columns,
                allowColumnReordering: true,
                ...options,
            };

            setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'rows', 'stickyColumns', 'columnsResizingReordering'], {
                initViews: true,
                controllers: {
                    data: new MockDataController({ items: this.items || [] })
                },
                options: {
                    columnFixing: {
                        legacyMode: false
                    }
                }
            });
        };
    },
    afterEach: function() {
        $('#qunit-fixture').removeClass('qunit-fixture-static');
        this.dispose();
    }
}, () => {
    QUnit.test('should get the correct points for fixed columns on the left', function(assert) {
        // arrange
        this.setupDataGrid();

        this.columnHeadersView.render(this.gridContainer);
        this.columnHeadersView.resize();

        // act
        const pointsByColumns = this.draggingHeaderController._generatePointsByColumns({
            columnElements: this.columnHeadersView.getColumnElements(),
            columns: this.columnsController.getVisibleColumns(),
            sourceColumn: this.columns[10],
            targetDraggingPanel: this.columnHeadersView,
            sourceLocation: 'headers',
        });

        // assert
        assert.equal(pointsByColumns.length, 4, 'point count');
        assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 0, x: 0, y: 0 }, 'first point');
        assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 1, x: 100, y: 0 }, 'second point');
        assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 2, x: 175, y: 0 }, 'third point');
        assert.deepEqual(pointsByColumns[3], { columnIndex: 3, index: 3, x: 275, y: 0 }, 'fourth point');
    });

    QUnit.test('should get the correct points for fixed columns on the right', function(assert) {
        // arrange
        this.setupDataGrid();

        this.columnHeadersView.render(this.gridContainer);
        this.columnHeadersView.resize();

        // act
        const pointsByColumns = this.draggingHeaderController._generatePointsByColumns({
            columnElements: this.columnHeadersView.getColumnElements(),
            columns: this.columnsController.getVisibleColumns(),
            sourceColumn: this.columns[0],
            targetDraggingPanel: this.columnHeadersView,
            sourceLocation: 'headers',
        });

        // assert
        assert.equal(pointsByColumns.length, 4, 'point count');
        assert.deepEqual(pointsByColumns[0], { columnIndex: 8, index: 8, x: 525, y: 0 }, 'first point');
        assert.deepEqual(pointsByColumns[1], { columnIndex: 9, index: 9, x: 625, y: 0 }, 'second point');
        assert.deepEqual(pointsByColumns[2], { columnIndex: 10, index: 10, x: 700, y: 0 }, 'third point');
        assert.deepEqual(pointsByColumns[3], { columnIndex: 11, index: 11, x: 800, y: 0 }, 'fourth point');
    });

    QUnit.test('should get the correct points for non-fixed columns when there are left and right fixed columns', function(assert) {
        // arrange
        this.setupDataGrid();

        this.columnHeadersView.render(this.gridContainer);
        this.columnHeadersView.resize();

        // act
        const pointsByColumns = this.draggingHeaderController._generatePointsByColumns({
            columnElements: this.columnHeadersView.getColumnElements(),
            columns: this.columnsController.getVisibleColumns(),
            sourceColumn: this.columns[4],
            targetDraggingPanel: this.columnHeadersView,
            sourceLocation: 'headers',
        });

        // assert
        assert.equal(pointsByColumns.length, 3, 'point count');
        assert.deepEqual(pointsByColumns[0], { columnIndex: 3, index: 3, x: 275, y: 0 }, 'first point');
        assert.deepEqual(pointsByColumns[1], { columnIndex: 4, index: 4, x: 400, y: 0 }, 'second point');
        assert.deepEqual(pointsByColumns[2], { columnIndex: 5, index: 5, x: 500, y: 0 }, 'third point');
    });

    QUnit.test('should get the correct points for non-fixed columns when there are left and right fixed columns and scrollLeft !== 0', function(assert) {
        // arrange
        this.setupDataGrid();

        this.columnHeadersView.render(this.gridContainer);
        this.columnHeadersView.resize();
        const $dataGridContent = $(this.columnHeadersView.element()).children();
        $dataGridContent.scrollLeft(50);

        // assert
        assert.strictEqual($dataGridContent.scrollLeft(), 50, 'content scroll left');

        // act
        const pointsByColumns = this.draggingHeaderController._generatePointsByColumns({
            columnElements: this.columnHeadersView.getColumnElements(),
            columns: this.columnsController.getVisibleColumns(),
            sourceColumn: this.columns[4],
            targetDraggingPanel: this.columnHeadersView,
            sourceLocation: 'headers',
        });

        // assert
        assert.equal(pointsByColumns.length, 2, 'point count');
        assert.deepEqual(pointsByColumns[0], { columnIndex: 4, index: 4, x: 350, y: 0 }, 'first point');
        assert.deepEqual(pointsByColumns[1], { columnIndex: 5, index: 5, x: 450, y: 0 }, 'second point');
    });

    QUnit.test('should get the correct points for sticky column when there are left and right fixed columns', function(assert) {
        // arrange
        this.columns[4].fixed = true;
        this.columns[4].fixedPosition = 'sticky';
        this.setupDataGrid();

        this.columnHeadersView.render(this.gridContainer);
        this.columnHeadersView.resize();

        // act
        const pointsByColumns = this.draggingHeaderController._generatePointsByColumns({
            columnElements: this.columnHeadersView.getColumnElements(),
            columns: this.columnsController.getVisibleColumns(),
            sourceColumn: this.columns[4],
            targetDraggingPanel: this.columnHeadersView,
            sourceLocation: 'headers',
        });

        // assert
        assert.equal(pointsByColumns.length, 3, 'point count');
        assert.deepEqual(pointsByColumns[0], { columnIndex: 3, index: 3, x: 275, y: 0 }, 'first point');
        assert.deepEqual(pointsByColumns[1], { columnIndex: 4, index: 4, x: 400, y: 0 }, 'second point');
        assert.deepEqual(pointsByColumns[2], { columnIndex: 5, index: 5, x: 500, y: 0 }, 'third point');
    });

    QUnit.test('should get the correct points for sticky column when there are left fixed columns', function(assert) {
        // arrange
        this.columns.forEach((column) => {
            if(column.fixed && column.fixedPosition === 'right') {
                column.fixed = false;
            }
        });
        this.columns[4].fixed = true;
        this.columns[4].fixedPosition = 'sticky';
        this.setupDataGrid();

        this.columnHeadersView.render(this.gridContainer);
        this.columnHeadersView.resize();

        // act
        const pointsByColumns = this.draggingHeaderController._generatePointsByColumns({
            columnElements: this.columnHeadersView.getColumnElements(),
            columns: this.columnsController.getVisibleColumns(),
            sourceColumn: this.columns[4],
            targetDraggingPanel: this.columnHeadersView,
            sourceLocation: 'headers',
        });

        // assert
        assert.equal(pointsByColumns.length, 6, 'point count');
        assert.deepEqual(pointsByColumns[0], { columnIndex: 3, index: 3, x: 275, y: 0 }, 'first point');
        assert.deepEqual(pointsByColumns[1], { columnIndex: 4, index: 4, x: 375, y: 0 }, 'second point');
        assert.deepEqual(pointsByColumns[2], { columnIndex: 5, index: 5, x: 450, y: 0 }, 'third point');
        assert.deepEqual(pointsByColumns[3], { columnIndex: 6, index: 6, x: 550, y: 0 }, 'fourth point');
        assert.deepEqual(pointsByColumns[4], { columnIndex: 7, index: 7, x: 675, y: 0 }, 'fifth point');
        assert.deepEqual(pointsByColumns[5], { columnIndex: 8, index: 8, x: 775, y: 0 }, 'sixth point');
    });

    QUnit.test('should get the correct points for sticky column when there are right fixed columns', function(assert) {
        // arrange
        this.columns.forEach((column) => {
            if(column.fixed && column.fixedPosition === 'left') {
                column.fixed = false;
            }
        });
        this.columns[4].fixed = true;
        this.columns[4].fixedPosition = 'sticky';
        this.setupDataGrid();

        this.columnHeadersView.render(this.gridContainer);
        this.columnHeadersView.resize();

        // act
        const pointsByColumns = this.draggingHeaderController._generatePointsByColumns({
            columnElements: this.columnHeadersView.getColumnElements(),
            columns: this.columnsController.getVisibleColumns(),
            sourceColumn: this.columns[4],
            targetDraggingPanel: this.columnHeadersView,
            sourceLocation: 'headers',
        });

        // assert
        assert.equal(pointsByColumns.length, 5, 'point count');
        assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 0, x: 0, y: 0 }, 'first point');
        assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 1, x: 125, y: 0 }, 'second point');
        assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 2, x: 225, y: 0 }, 'third point');
        assert.deepEqual(pointsByColumns[3], { columnIndex: 3, index: 3, x: 350, y: 0 }, 'fourth point');
        assert.deepEqual(pointsByColumns[4], { columnIndex: 4, index: 4, x: 450, y: 0 }, 'fifth point');
    });

    QUnit.test('should get the correct points for sticky column when there are no left and right fixed columns', function(assert) {
        // arrange
        this.columns.forEach((column) => { column.fixed = false; });
        this.columns[4].fixed = true;
        this.columns[4].fixedPosition = 'sticky';
        this.setupDataGrid();

        this.columnHeadersView.render(this.gridContainer);
        this.columnHeadersView.resize();

        // act
        const pointsByColumns = this.draggingHeaderController._generatePointsByColumns({
            columnElements: this.columnHeadersView.getColumnElements(),
            columns: this.columnsController.getVisibleColumns(),
            sourceColumn: this.columns[4],
            targetDraggingPanel: this.columnHeadersView,
            sourceLocation: 'headers',
        });

        // assert
        assert.equal(pointsByColumns.length, 8, 'point count');
        assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 0, x: 0, y: 0 }, 'first point');
        assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 1, x: 100, y: 0 }, 'second point');
        assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 2, x: 175, y: 0 }, 'third point');
        assert.deepEqual(pointsByColumns[3], { columnIndex: 3, index: 3, x: 275, y: 0 }, 'fourth point');
        assert.deepEqual(pointsByColumns[4], { columnIndex: 4, index: 4, x: 400, y: 0 }, 'fifth point');
        assert.deepEqual(pointsByColumns[5], { columnIndex: 5, index: 5, x: 500, y: 0 }, 'sixth point');
        assert.deepEqual(pointsByColumns[6], { columnIndex: 6, index: 6, x: 625, y: 0 }, 'seventh point');
        assert.deepEqual(pointsByColumns[7], { columnIndex: 7, index: 7, x: 725, y: 0 }, 'eighth point');
    });

    QUnit.test('should get the correct points for non-fixed column when there are left and sticky fixed columns and scrollLeft !== 0', function(assert) {
        // arrange
        this.columns.forEach((column) => {
            if(column.fixed && column.fixedPosition === 'right') {
                column.fixed = false;
            }
        });
        this.columns[1].fixed = true;
        this.columns[1].fixedPosition = 'sticky';
        this.columns[3].fixed = true;
        this.columns[3].fixedPosition = 'sticky';
        this.setupDataGrid();

        this.columnHeadersView.render(this.gridContainer);
        this.columnHeadersView.resize();
        const $dataGridContent = $(this.columnHeadersView.element()).children();
        $dataGridContent.scrollLeft(250);

        // assert
        assert.strictEqual($dataGridContent.scrollLeft(), 250, 'content scroll left');

        // act
        const pointsByColumns = this.draggingHeaderController._generatePointsByColumns({
            columnElements: this.columnHeadersView.getColumnElements(),
            columns: this.columnsController.getVisibleColumns(),
            sourceColumn: this.columns[6],
            targetDraggingPanel: this.columnHeadersView,
            sourceLocation: 'headers',
        });

        // assert
        assert.equal(pointsByColumns.length, 5, 'point count');
        assert.deepEqual(pointsByColumns[0], { columnIndex: 4, index: 4, x: 273, y: 0 }, 'first point');
        assert.deepEqual(pointsByColumns[1], { columnIndex: 6, index: 6, x: 346, y: 0 }, 'second point');
        assert.deepEqual(pointsByColumns[2], { columnIndex: 8, index: 8, x: 525, y: 0 }, 'third point');
        assert.deepEqual(pointsByColumns[3], { columnIndex: 9, index: 9, x: 650, y: 0 }, 'fourth point');
        assert.deepEqual(pointsByColumns[4], { columnIndex: 10, index: 10, x: 750, y: 0 }, 'fifth point');
    });

    QUnit.test('should get the correct points for non-fixed column when sticky columns after the left fixed columns and scrollLeft !== 0', function(assert) {
        // arrange
        this.columns.forEach((column) => {
            if(column.fixed && column.fixedPosition === 'right') {
                column.fixed = false;
            }
        });
        this.columns[0].fixed = true;
        this.columns[0].fixedPosition = 'sticky';
        this.columns[1].fixed = true;
        this.columns[1].fixedPosition = 'sticky';
        this.setupDataGrid();

        this.columnHeadersView.render(this.gridContainer);
        this.columnHeadersView.resize();
        const $dataGridContent = $(this.columnHeadersView.element()).children();
        $dataGridContent.scrollLeft(250);

        // assert
        assert.strictEqual($dataGridContent.scrollLeft(), 250, 'content scroll left');

        // act
        const pointsByColumns = this.draggingHeaderController._generatePointsByColumns({
            columnElements: this.columnHeadersView.getColumnElements(),
            columns: this.columnsController.getVisibleColumns(),
            sourceColumn: this.columns[6],
            targetDraggingPanel: this.columnHeadersView,
            sourceLocation: 'headers',
        });

        // assert
        assert.equal(pointsByColumns.length, 5, 'point count');
        assert.deepEqual(pointsByColumns[0], { columnIndex: 3, index: 3, x: 275, y: 0 }, 'first point');
        assert.deepEqual(pointsByColumns[1], { columnIndex: 4, index: 4, x: 375, y: 0 }, 'second point');
        assert.deepEqual(pointsByColumns[2], { columnIndex: 8, index: 8, x: 525, y: 0 }, 'third point');
        assert.deepEqual(pointsByColumns[3], { columnIndex: 9, index: 9, x: 650, y: 0 }, 'fourth point');
        assert.deepEqual(pointsByColumns[4], { columnIndex: 10, index: 10, x: 750, y: 0 }, 'fifth point');
    });

    QUnit.test('should get the correct points for non-fixed column when sticky columns before the right fixed columns and scrollLeft !== 0', function(assert) {
        // arrange
        this.columns.forEach((column) => {
            if(column.fixed && column.fixedPosition === 'left') {
                column.fixed = false;
            }
        });
        this.columns[9].fixed = true;
        this.columns[9].fixedPosition = 'sticky';
        this.columns[10].fixed = true;
        this.columns[10].fixedPosition = 'sticky';
        this.setupDataGrid();

        this.columnHeadersView.render(this.gridContainer);
        this.columnHeadersView.resize();
        const $dataGridContent = $(this.columnHeadersView.element()).children();
        $dataGridContent.scrollLeft(50);

        // assert
        assert.strictEqual($dataGridContent.scrollLeft(), 50, 'content scroll left');

        // act
        const pointsByColumns = this.draggingHeaderController._generatePointsByColumns({
            columnElements: this.columnHeadersView.getColumnElements(),
            columns: this.columnsController.getVisibleColumns(),
            sourceColumn: this.columns[6],
            targetDraggingPanel: this.columnHeadersView,
            sourceLocation: 'headers',
        });

        // assert
        assert.equal(pointsByColumns.length, 5, 'point count');
        assert.deepEqual(pointsByColumns[0], { columnIndex: 1, index: 1, x: 75, y: 0 }, 'first point');
        assert.deepEqual(pointsByColumns[1], { columnIndex: 2, index: 2, x: 175, y: 0 }, 'second point');
        assert.deepEqual(pointsByColumns[2], { columnIndex: 3, index: 3, x: 300, y: 0 }, 'third point');
        assert.deepEqual(pointsByColumns[3], { columnIndex: 7, index: 7, x: 425, y: 0 }, 'fourth point');
        assert.deepEqual(pointsByColumns[4], { columnIndex: 8, index: 8, x: 525, y: 0 }, 'fifth point');
    });
});

QUnit.module('Column reordering points (rtlEnabled = true)', {
    beforeEach: function() {
        $('#qunit-fixture').addClass('qunit-fixture-static');
        this.$element = () => $('#container');
        this.gridContainer = $('#container > .dx-datagrid');

        this.$element()
            .addClass('dx-rtl')
            .width(800);

        this.columns = [
            {
                caption: 'Column 1', fixed: true, fixedPosition: 'right', width: 100, allowReordering: true
            },
            {
                caption: 'Col 2', fixed: true, fixedPosition: 'right', width: 75, allowReordering: true
            },
            {
                caption: 'Column 3', fixed: true, fixedPosition: 'right', width: 100, allowReordering: true
            },
            {
                caption: 'Column 4', width: 125, allowReordering: true
            },
            {
                caption: 'Column 5', width: 100, allowReordering: true
            },
            {
                caption: 'Column 6', width: 125, allowReordering: true
            },
            {
                caption: 'Column 7', width: 100, allowReordering: true
            },
            {
                caption: 'Column 8', width: 125, allowReordering: true
            },
            {
                caption: 'Column 9', fixed: true, fixedPosition: 'left', width: 100, allowReordering: true
            },
            {
                caption: 'Col 10', fixed: true, fixedPosition: 'left', width: 75, allowReordering: true
            },
            {
                caption: 'Column 11', fixed: true, fixedPosition: 'left', width: 100, allowReordering: true
            }
        ];

        this.setupDataGrid = (options) => {
            this.options = {
                rtlEnabled: true,
                showColumnHeaders: true,
                columns: this.columns,
                allowColumnReordering: true,
                ...options,
            };

            setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'rows', 'stickyColumns', 'columnsResizingReordering'], {
                initViews: true,
                controllers: {
                    data: new MockDataController({ items: this.items || [] })
                },
                options: {
                    columnFixing: {
                        legacyMode: false
                    }
                }
            });
        };
    },
    afterEach: function() {
        $('#qunit-fixture').removeClass('qunit-fixture-static');
        this.dispose();
    }
}, () => {
    QUnit.test('should get the correct points for fixed columns on the left', function(assert) {
        // arrange
        this.setupDataGrid();

        this.columnHeadersView.render(this.gridContainer);
        this.columnHeadersView.resize();

        // act
        const pointsByColumns = this.draggingHeaderController._generatePointsByColumns({
            columnElements: this.columnHeadersView.getColumnElements(),
            columns: this.columnsController.getVisibleColumns(),
            sourceColumn: this.columns[10],
            targetDraggingPanel: this.columnHeadersView,
            sourceLocation: 'headers',
        });

        // assert
        assert.equal(pointsByColumns.length, 4, 'point count');
        assert.deepEqual(pointsByColumns[0], { columnIndex: 8, index: 8, x: 275, y: 0 }, 'first point');
        assert.deepEqual(pointsByColumns[1], { columnIndex: 9, index: 9, x: 175, y: 0 }, 'second point');
        assert.deepEqual(pointsByColumns[2], { columnIndex: 10, index: 10, x: 100, y: 0 }, 'third point');
        assert.deepEqual(pointsByColumns[3], { columnIndex: 11, index: 11, x: 0, y: 0 }, 'fourth point');
    });

    QUnit.test('should get the correct points for fixed columns on the right', function(assert) {
        // arrange
        this.setupDataGrid();

        this.columnHeadersView.render(this.gridContainer);
        this.columnHeadersView.resize();

        // act
        const pointsByColumns = this.draggingHeaderController._generatePointsByColumns({
            columnElements: this.columnHeadersView.getColumnElements(),
            columns: this.columnsController.getVisibleColumns(),
            sourceColumn: this.columns[0],
            targetDraggingPanel: this.columnHeadersView,
            sourceLocation: 'headers',
        });

        // assert
        assert.equal(pointsByColumns.length, 4, 'point count');

        assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 0, x: 800, y: 0 }, 'first point');
        assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 1, x: 700, y: 0 }, 'second point');
        assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 2, x: 625, y: 0 }, 'third point');
        assert.deepEqual(pointsByColumns[3], { columnIndex: 3, index: 3, x: 525, y: 0 }, 'fourth point');
    });

    QUnit.test('should get the correct points for non-fixed columns when there are left and right fixed columns', function(assert) {
        // arrange
        this.setupDataGrid();

        this.columnHeadersView.render(this.gridContainer);
        this.columnHeadersView.resize();

        // act
        const pointsByColumns = this.draggingHeaderController._generatePointsByColumns({
            columnElements: this.columnHeadersView.getColumnElements(),
            columns: this.columnsController.getVisibleColumns(),
            sourceColumn: this.columns[4],
            targetDraggingPanel: this.columnHeadersView,
            sourceLocation: 'headers',
        });

        // assert
        assert.equal(pointsByColumns.length, 3, 'point count');
        assert.deepEqual(pointsByColumns[0], { columnIndex: 3, index: 3, x: 525, y: 0 }, 'first point');
        assert.deepEqual(pointsByColumns[1], { columnIndex: 4, index: 4, x: 400, y: 0 }, 'second point');
        assert.deepEqual(pointsByColumns[2], { columnIndex: 5, index: 5, x: 300, y: 0 }, 'third point');
    });

    QUnit.test('should get the correct points for non-fixed columns when there are left and right fixed columns and scrollLeft !== 0', function(assert) {
        // arrange
        this.setupDataGrid();

        this.columnHeadersView.render(this.gridContainer);
        this.columnHeadersView.resize();
        const $dataGridContent = $(this.columnHeadersView.element()).children();
        $dataGridContent.scrollLeft(-50);

        // assert
        assert.strictEqual($dataGridContent.scrollLeft(), -50, 'content scroll left');

        // act
        const pointsByColumns = this.draggingHeaderController._generatePointsByColumns({
            columnElements: this.columnHeadersView.getColumnElements(),
            columns: this.columnsController.getVisibleColumns(),
            sourceColumn: this.columns[4],
            targetDraggingPanel: this.columnHeadersView,
            sourceLocation: 'headers',
        });

        // assert
        assert.equal(pointsByColumns.length, 2, 'point count');
        assert.deepEqual(pointsByColumns[0], { columnIndex: 4, index: 4, x: 450, y: 0 }, 'first point');
        assert.deepEqual(pointsByColumns[1], { columnIndex: 5, index: 5, x: 350, y: 0 }, 'second point');
    });

    QUnit.test('should get the correct points for sticky column when there are left and right fixed columns', function(assert) {
        // arrange
        this.columns[4].fixed = true;
        this.columns[4].fixedPosition = 'sticky';
        this.setupDataGrid();

        this.columnHeadersView.render(this.gridContainer);
        this.columnHeadersView.resize();

        // act
        const pointsByColumns = this.draggingHeaderController._generatePointsByColumns({
            columnElements: this.columnHeadersView.getColumnElements(),
            columns: this.columnsController.getVisibleColumns(),
            sourceColumn: this.columns[4],
            targetDraggingPanel: this.columnHeadersView,
            sourceLocation: 'headers',
        });

        // assert
        assert.equal(pointsByColumns.length, 3, 'point count');
        assert.deepEqual(pointsByColumns[0], { columnIndex: 3, index: 3, x: 525, y: 0 }, 'first point');
        assert.deepEqual(pointsByColumns[1], { columnIndex: 4, index: 4, x: 400, y: 0 }, 'second point');
        assert.deepEqual(pointsByColumns[2], { columnIndex: 5, index: 5, x: 300, y: 0 }, 'third point');
    });

    QUnit.test('should get the correct points for sticky column when there are left fixed columns', function(assert) {
        // arrange
        this.columns.forEach((column) => {
            if(column.fixed && column.fixedPosition === 'right') {
                column.fixed = false;
            }
        });
        this.columns[4].fixed = true;
        this.columns[4].fixedPosition = 'sticky';
        this.setupDataGrid();

        this.columnHeadersView.render(this.gridContainer);
        this.columnHeadersView.resize();

        // act
        const pointsByColumns = this.draggingHeaderController._generatePointsByColumns({
            columnElements: this.columnHeadersView.getColumnElements(),
            columns: this.columnsController.getVisibleColumns(),
            sourceColumn: this.columns[4],
            targetDraggingPanel: this.columnHeadersView,
            sourceLocation: 'headers',
        });

        // assert
        assert.equal(pointsByColumns.length, 6, 'point count');
        assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 0, x: 800, y: 0 }, 'first point');
        assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 1, x: 700, y: 0 }, 'second point');
        assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 2, x: 625, y: 0 }, 'third point');
        assert.deepEqual(pointsByColumns[3], { columnIndex: 3, index: 3, x: 525, y: 0 }, 'fourth point');
        assert.deepEqual(pointsByColumns[4], { columnIndex: 4, index: 4, x: 400, y: 0 }, 'fifth point');
        assert.deepEqual(pointsByColumns[5], { columnIndex: 5, index: 5, x: 300, y: 0 }, 'sixth point');
    });

    QUnit.test('should get the correct points for sticky column when there are right fixed columns', function(assert) {
        // arrange
        this.columns.forEach((column) => {
            if(column.fixed && column.fixedPosition === 'left') {
                column.fixed = false;
            }
        });
        this.columns[4].fixed = true;
        this.columns[4].fixedPosition = 'sticky';
        this.setupDataGrid();

        this.columnHeadersView.render(this.gridContainer);
        this.columnHeadersView.resize();

        // act
        const pointsByColumns = this.draggingHeaderController._generatePointsByColumns({
            columnElements: this.columnHeadersView.getColumnElements(),
            columns: this.columnsController.getVisibleColumns(),
            sourceColumn: this.columns[4],
            targetDraggingPanel: this.columnHeadersView,
            sourceLocation: 'headers',
        });

        // assert
        assert.equal(pointsByColumns.length, 5, 'point count');
        assert.deepEqual(pointsByColumns[0], { columnIndex: 3, index: 3, x: 525, y: 0 }, 'first point');
        assert.deepEqual(pointsByColumns[1], { columnIndex: 4, index: 4, x: 400, y: 0 }, 'second point');
        assert.deepEqual(pointsByColumns[2], { columnIndex: 5, index: 5, x: 300, y: 0 }, 'third point');
        assert.deepEqual(pointsByColumns[3], { columnIndex: 6, index: 6, x: 175, y: 0 }, 'fourth point');
        assert.deepEqual(pointsByColumns[4], { columnIndex: 7, index: 7, x: 75, y: 0 }, 'fifth point');
    });

    QUnit.test('should get the correct points for sticky column when there are no left and right fixed columns', function(assert) {
        // arrange
        this.columns.forEach((column) => { column.fixed = false; });
        this.columns[4].fixed = true;
        this.columns[4].fixedPosition = 'sticky';
        this.setupDataGrid();

        this.columnHeadersView.render(this.gridContainer);
        this.columnHeadersView.resize();

        // act
        const pointsByColumns = this.draggingHeaderController._generatePointsByColumns({
            columnElements: this.columnHeadersView.getColumnElements(),
            columns: this.columnsController.getVisibleColumns(),
            sourceColumn: this.columns[4],
            targetDraggingPanel: this.columnHeadersView,
            sourceLocation: 'headers',
        });

        // assert
        assert.equal(pointsByColumns.length, 8, 'point count');
        assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 0, x: 800, y: 0 }, 'first point');
        assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 1, x: 700, y: 0 }, 'second point');
        assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 2, x: 625, y: 0 }, 'third point');
        assert.deepEqual(pointsByColumns[3], { columnIndex: 3, index: 3, x: 525, y: 0 }, 'fourth point');
        assert.deepEqual(pointsByColumns[4], { columnIndex: 4, index: 4, x: 400, y: 0 }, 'fifth point');
        assert.deepEqual(pointsByColumns[5], { columnIndex: 5, index: 5, x: 300, y: 0 }, 'sixth point');
        assert.deepEqual(pointsByColumns[6], { columnIndex: 6, index: 6, x: 175, y: 0 }, 'seventh point');
        assert.deepEqual(pointsByColumns[7], { columnIndex: 7, index: 7, x: 75, y: 0 }, 'eighth point');
    });

    QUnit.test('should get the correct points for non-fixed column when there are left and sticky fixed columns', function(assert) {
        // arrange
        this.columns.forEach((column) => {
            if(column.fixed && column.fixedPosition === 'right') {
                column.fixed = false;
            }
        });
        this.columns[4].fixed = true;
        this.columns[4].fixedPosition = 'sticky';
        this.columns[6].fixed = true;
        this.columns[6].fixedPosition = 'sticky';
        this.setupDataGrid();

        this.columnHeadersView.render(this.gridContainer);
        this.columnHeadersView.resize();

        // act
        const pointsByColumns = this.draggingHeaderController._generatePointsByColumns({
            columnElements: this.columnHeadersView.getColumnElements(),
            columns: this.columnsController.getVisibleColumns(),
            sourceColumn: this.columns[6],
            targetDraggingPanel: this.columnHeadersView,
            sourceLocation: 'headers',
        });

        // assert
        assert.equal(pointsByColumns.length, 6, 'point count');
        assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 0, x: 800, y: 0 }, 'first point');
        assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 1, x: 700, y: 0 }, 'second point');
        assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 2, x: 625, y: 0 }, 'third point');
        assert.deepEqual(pointsByColumns[3], { columnIndex: 3, index: 3, x: 525, y: 0 }, 'fourth point');
        assert.deepEqual(pointsByColumns[4], { columnIndex: 5, index: 5, x: 371, y: 0 }, 'fifth point');
        assert.deepEqual(pointsByColumns[5], { columnIndex: 7, index: 7, x: 273, y: 0 }, 'sixth point');
    });

    QUnit.test('should get the correct points for non-fixed column when there are right and sticky fixed columns and scrollLeft !== 0', function(assert) {
        // arrange
        this.columns.forEach((column) => {
            if(column.fixed && column.fixedPosition === 'left') {
                column.fixed = false;
            }
        });
        this.columns[4].fixed = true;
        this.columns[4].fixedPosition = 'sticky';
        this.columns[6].fixed = true;
        this.columns[6].fixedPosition = 'sticky';
        this.setupDataGrid();

        this.columnHeadersView.render(this.gridContainer);
        this.columnHeadersView.resize();
        const $dataGridContent = $(this.columnHeadersView.element()).children();
        $dataGridContent.scrollLeft(-300);

        // assert
        assert.strictEqual($dataGridContent.scrollLeft(), -300, 'content scroll left');

        // act
        const pointsByColumns = this.draggingHeaderController._generatePointsByColumns({
            columnElements: this.columnHeadersView.getColumnElements(),
            columns: this.columnsController.getVisibleColumns(),
            sourceColumn: this.columns[6],
            targetDraggingPanel: this.columnHeadersView,
            sourceLocation: 'headers',
        });

        // assert
        assert.equal(pointsByColumns.length, 5, 'point count');
        assert.deepEqual(pointsByColumns[0], { columnIndex: 4, index: 4, x: 527, y: 0 }, 'first point');
        assert.deepEqual(pointsByColumns[1], { columnIndex: 6, index: 6, x: 429, y: 0 }, 'second point');
        assert.deepEqual(pointsByColumns[2], { columnIndex: 8, index: 8, x: 250, y: 0 }, 'third point');
        assert.deepEqual(pointsByColumns[3], { columnIndex: 9, index: 9, x: 150, y: 0 }, 'fourth point');
        assert.deepEqual(pointsByColumns[4], { columnIndex: 10, index: 10, x: 75, y: 0 }, 'fifth point');
    });

    QUnit.test('should get the correct points for non-fixed column when sticky columns after the left fixed columns and scrollLeft !== 0', function(assert) {
        // arrange
        this.columns.forEach((column) => {
            if(column.fixed && column.fixedPosition === 'right') {
                column.fixed = false;
            }
        });
        this.columns[6].fixed = true;
        this.columns[6].fixedPosition = 'sticky';
        this.columns[7].fixed = true;
        this.columns[7].fixedPosition = 'sticky';
        this.setupDataGrid();

        this.columnHeadersView.render(this.gridContainer);
        this.columnHeadersView.resize();

        // act
        const pointsByColumns = this.draggingHeaderController._generatePointsByColumns({
            columnElements: this.columnHeadersView.getColumnElements(),
            columns: this.columnsController.getVisibleColumns(),
            sourceColumn: this.columns[6],
            targetDraggingPanel: this.columnHeadersView,
            sourceLocation: 'headers',
        });

        // assert
        assert.equal(pointsByColumns.length, 6, 'point count');
        assert.deepEqual(pointsByColumns[0], { columnIndex: 0, index: 0, x: 800, y: 0 }, 'first point');
        assert.deepEqual(pointsByColumns[1], { columnIndex: 1, index: 1, x: 700, y: 0 }, 'second point');
        assert.deepEqual(pointsByColumns[2], { columnIndex: 2, index: 2, x: 625, y: 0 }, 'third point');
        assert.deepEqual(pointsByColumns[3], { columnIndex: 3, index: 3, x: 525, y: 0 }, 'fourth point');
        assert.deepEqual(pointsByColumns[4], { columnIndex: 7, index: 7, x: 400, y: 0 }, 'fifth point');
        assert.deepEqual(pointsByColumns[5], { columnIndex: 8, index: 8, x: 275, y: 0 }, 'sixth point');
    });

    QUnit.test('should get the correct points for non-fixed column when sticky columns before the right fixed columns and scrollLeft !== 0', function(assert) {
        // arrange
        this.columns.forEach((column) => {
            if(column.fixed && column.fixedPosition === 'left') {
                column.fixed = false;
            }
        });
        this.columns[3].fixed = true;
        this.columns[3].fixedPosition = 'sticky';
        this.columns[4].fixed = true;
        this.columns[4].fixedPosition = 'sticky';
        this.setupDataGrid();

        this.columnHeadersView.render(this.gridContainer);
        this.columnHeadersView.resize();
        const $dataGridContent = $(this.columnHeadersView.element()).children();
        $dataGridContent.scrollLeft(-100);

        // assert
        assert.strictEqual($dataGridContent.scrollLeft(), -100, 'content scroll left');

        // act
        const pointsByColumns = this.draggingHeaderController._generatePointsByColumns({
            columnElements: this.columnHeadersView.getColumnElements(),
            columns: this.columnsController.getVisibleColumns(),
            sourceColumn: this.columns[6],
            targetDraggingPanel: this.columnHeadersView,
            sourceLocation: 'headers',
        });

        // assert
        assert.equal(pointsByColumns.length, 5, 'point count');
        assert.deepEqual(pointsByColumns[0], { columnIndex: 3, index: 3, x: 525, y: 0 }, 'first point');
        assert.deepEqual(pointsByColumns[1], { columnIndex: 4, index: 4, x: 400, y: 0 }, 'second point');
        assert.deepEqual(pointsByColumns[2], { columnIndex: 6, index: 6, x: 275, y: 0 }, 'third point');
        assert.deepEqual(pointsByColumns[3], { columnIndex: 7, index: 7, x: 175, y: 0 }, 'fourth point');
        assert.deepEqual(pointsByColumns[4], { columnIndex: 8, index: 8, x: 50, y: 0 }, 'fifth point');
    });
});
