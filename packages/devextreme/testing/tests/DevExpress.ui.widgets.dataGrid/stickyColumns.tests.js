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
