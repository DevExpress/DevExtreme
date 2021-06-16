QUnit.testStart(function() {
    const markup =
        `<style>
            .qunit-fixture-static {
                position: static !important;
                left: 0 !important;
                top: 0 !important;
            }
        </style>
        <div class="dx-widget" id="grid">
            <div class="dx-datagrid dx-gridbase-container" id="container">
            </div>
        </div>`;

    $('#qunit-fixture').html(markup);
});

import 'generic_light.css!';

import 'ui/data_grid/ui.data_grid';

import $ from 'jquery';
import pointerMock from '../../helpers/pointerMock.js';
import { setupDataGridModules } from '../../helpers/dataGridMocks.js';

const generateData = function(rowCount) {
    const result = [];

    for(let i = 0; i < rowCount; i++) {
        result.push({ field1: 'test' + i, field2: 'test' + (i + 1), field3: 'test' + (i + 2) });
    }

    return result;
};

function createRowsView() {
    const mockDataGrid = {
        options: this.options,
        isReady: function() {
            return true;
        },
        $element: function() {
            return $('.dx-datagrid');
        },
        element: function() {
            return this.$element();
        }
    };

    setupDataGridModules(mockDataGrid, ['data', 'columns', 'rows', 'rowDragging', 'columnFixing', 'grouping', 'masterDetail', 'virtualScrolling', 'summary'], {
        initViews: true
    });

    if(this.dataGrid) {
        QUnit.assert.ok(false, 'dataGrid is already created');
    }

    this.dataGrid = mockDataGrid;
    return mockDataGrid.rowsView;
}

const moduleConfig = {
    beforeEach: function() {
        $('#qunit-fixture').addClass('qunit-fixture-visible');
        this.options = {
            dataSource: generateData(10),
            columns: ['field1', 'field2', 'field3'],
            rowDragging: {
                allowReordering: true
            }
        };
        this.createRowsView = createRowsView;
    },
    afterEach: function() {
        $('#qunit-fixture').removeClass('qunit-fixture-visible');
        this.dataGrid && this.dataGrid.dispose();
    }
};

const processOptionsForCompare = function(options, ignoreOptionNames) {
    const result = {};

    for(const optionName in options) {
        if(ignoreOptionNames.indexOf(optionName) === -1) {
            result[optionName] = options[optionName];
        }
    }

    return result;
};

QUnit.module('Drag and Drop rows', moduleConfig, () => {

    QUnit.test('Dragging row', function(assert) {
    // arrange
        const $testElement = $('#container');

        const rowsView = this.createRowsView();
        rowsView.render($testElement);

        // act
        pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70);

        // assert
        const $draggableElement = $('body').children('.dx-sortable-dragging');
        const $placeholderElement = $('body').children('.dx-sortable-placeholder');
        assert.strictEqual($draggableElement.length, 1, 'there is dragging element');
        assert.strictEqual($placeholderElement.length, 1, 'placeholder');
        assert.ok($draggableElement.children().children().hasClass('dx-datagrid'), 'dragging element is datagrid');
        assert.strictEqual($draggableElement.find('.dx-data-row').length, 1, 'row count in dragging element');
    });

    QUnit.test('Dragging events', function(assert) {
    // arrange
        const $testElement = $('#container');

        this.options.rowDragging = {
            allowReordering: true,
            onDragStart: sinon.spy(),
            onReorder: sinon.spy()
        };

        const rowsView = this.createRowsView();
        rowsView.render($testElement);

        // act
        pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70).up();

        // assert
        const onDragStart = this.options.rowDragging.onDragStart;
        assert.strictEqual(onDragStart.callCount, 1, 'onDragStart called once');
        assert.strictEqual(onDragStart.getCall(0).args[0].itemData, this.options.dataSource[0], 'onDragStart itemData param');
        assert.strictEqual(onDragStart.getCall(0).args[0].component, this.dataGrid, 'onDragStart component param');

        const onReorder = this.options.rowDragging.onReorder;
        assert.strictEqual(onReorder.callCount, 1, 'onReorder called once');
        assert.strictEqual(onReorder.getCall(0).args[0].component, this.dataGrid, 'onReorder component param');
    });

    QUnit.test('Draggable element (grid) - checking options', function(assert) {
    // arrange
        $.extend(this.options, {
            columns: [{ dataField: 'field1', width: 100, fixed: true, fixedPosition: 'right' }, { dataField: 'field2', width: 150 }, { dataField: 'field3', width: 200 }],
            showColumnHeaders: true,
            showBorders: false,
            showColumnLines: true,
            columnAutoWidth: true,
            pager: {
                visible: true
            },
            scrolling: {
                useNative: true,
                showScrollbar: true
            },
            columnFixing: {
                enabled: true
            }
        });

        const rowsView = this.createRowsView();

        // act
        const options = rowsView._getDraggableGridOptions({ data: this.options.dataSource[0] });
        const processedOptions = processOptionsForCompare(options, ['customizeColumns', 'rowTemplate', 'onCellPrepared', 'onRowPrepared']);

        // assert
        assert.deepEqual(processedOptions, {
            dataSource: [{ id: 1, parentId: 0 }],
            columnFixing: {
                enabled: true
            },
            columns: [
                {
                    width: 150,
                    fixed: undefined,
                    fixedPosition: undefined
                },
                {
                    width: 200,
                    fixed: undefined,
                    fixedPosition: undefined
                },
                {
                    width: 100,
                    fixed: true,
                    fixedPosition: 'right'
                }
            ],
            columnAutoWidth: true,
            showColumnHeaders: false,
            showBorders: true,
            showColumnLines: true,
            pager: {
                visible: false
            },
            scrolling: {
                useNative: false,
                showScrollbar: false
            },
            loadingTimeout: undefined
        }, 'options');
    });

    QUnit.test('Dragging row when rowTemplate is specified', function(assert) {
    // arrange
        const $testElement = $('#container');

        $.extend(this.options, {
            rowTemplate: function() {
                return $('<tr class=\'dx-row dx-data-row my-row\'><td>Test</td></tr>');
            }
        });

        const rowsView = this.createRowsView();
        rowsView.render($testElement);

        // act
        pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70);

        // assert
        const $draggableElement = $('body').children('.dx-sortable-dragging');
        assert.strictEqual($draggableElement.find('.dx-data-row').length, 1, 'data row count');
        assert.ok($draggableElement.find('.dx-data-row').hasClass('my-row'), 'custom row');
    });

    QUnit.test('Dragging row when there is group column', function(assert) {
    // arrange
        const $testElement = $('#container');

        $.extend(this.options, {
            columns: [{ dataField: 'field1', groupIndex: 0 }, 'field2', 'field3'],
            grouping: {
                autoExpandAll: true
            }
        });

        const rowsView = this.createRowsView();
        rowsView.render($testElement);

        // act
        pointerMock(rowsView.getRowElement(1)).start().down().move(0, 70);

        // assert
        const $draggableElement = $('body').children('.dx-sortable-dragging');
        assert.strictEqual($draggableElement.find('.dx-data-row').length, 1, 'data row count');
        assert.strictEqual($draggableElement.find('.dx-group-row').length, 0, 'group row count');
    });

    QUnit.test('Dragging group row', function(assert) {
    // arrange
        const $testElement = $('#container');

        $.extend(true, this.options, {
            columns: [{ dataField: 'field1', groupIndex: 0 }, 'field2', 'field3'],
            rowDragging: {
                onDragStart: sinon.spy()
            }
        });

        const rowsView = this.createRowsView();
        rowsView.render($testElement);

        // act
        pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70);

        // assert
        const dragStartArgs = this.options.rowDragging.onDragStart.getCall(0).args[0];
        assert.strictEqual(dragStartArgs.fromIndex, 0, 'onDragStart fromIndex');
        assert.strictEqual(dragStartArgs.itemData.key, 'test0', 'onDragStart itemData');
        assert.strictEqual(dragStartArgs.cancel, true, 'onDragStart cancel is true');
    });

    QUnit.test('Dragging row when prepared events are specified', function(assert) {
    // arrange
        const $testElement = $('#container');

        $.extend(this.options, {
            onRowPrepared: function(options) {
                $(options.rowElement).addClass('my-row');
            },
            onCellPrepared: function(options) {
                $(options.cellElement).addClass('my-cell');
            }
        });

        const rowsView = this.createRowsView();
        rowsView.render($testElement);

        // act
        pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70);

        // assert
        const $draggableElement = $('body').children('.dx-sortable-dragging');
        assert.strictEqual($draggableElement.find('.dx-data-row').length, 1, 'data row count');
        assert.ok($draggableElement.find('.dx-data-row').hasClass('my-row'), 'row with custom class');
        assert.ok($draggableElement.find('.dx-data-row').children().first().hasClass('my-cell'), 'cell with custom class');
    });

    QUnit.test('\'rowDragging.allowReordering\' option changing (false -> true)', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.rowDragging = {
            allowReordering: false
        };

        const rowsView = this.createRowsView();
        rowsView.render($testElement);

        // act
        const pointer = pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70);

        // assert
        assert.strictEqual($('body').children('.dx-sortable-placeholder').length, 0, 'no placeholder');
        assert.strictEqual($('body').children('.dx-sortable-dragging').length, 0, 'no dragging element');

        // arrange
        pointer.up();

        rowsView.option('rowDragging', { allowReordering: true });

        // act
        pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70);

        // assert
        assert.strictEqual($('body').children('.dx-sortable-placeholder').length, 1, 'there is placeholder');
        assert.strictEqual($('body').children('.dx-sortable-dragging').length, 1, 'there is dragging element');
    });

    // T972509
    QUnit.test('\'rowDragging.allowReordering\' option changing (true -> false)', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.rowDragging = {
            allowReordering: true
        };

        const rowsView = this.createRowsView();
        rowsView.render($testElement);

        // act
        const pointer = pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70);

        // assert
        assert.strictEqual($('body').children('.dx-sortable-placeholder').length, 1, 'there is placeholder');
        assert.strictEqual($('body').children('.dx-sortable-dragging').length, 1, 'there is dragging element');

        // arrange
        pointer.up();

        rowsView.option('rowDragging', { allowReordering: false });

        // act
        pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70);

        // assert
        assert.strictEqual($('body').children('.dx-sortable-placeholder').length, 0, 'there is not placeholder');
        assert.strictEqual($('body').children('.dx-sortable-dragging').length, 0, 'there is not dragging element');
        assert.notStrictEqual($(rowsView.getRowElement(0)).children().first().css('cursor'), 'pointer', 'cursor is not pointer');
    });

    QUnit.test('Dragging row to the last position - row should be before the freespace row', function(assert) {
    // arrange
        let $rowElements;
        const $testElement = $('#container');

        this.options.dataSource = this.options.dataSource.slice(0, 3);
        this.options.rowDragging.moveItemOnDrop = true;

        const rowsView = this.createRowsView();
        rowsView.render($testElement);

        // act
        const pointer = pointerMock(rowsView.getRowElement(0)).start().down().move(0, 110);

        // assert
        $rowElements = $(rowsView.element()).find('tbody').children();
        assert.ok($rowElements.eq(3).hasClass('dx-freespace-row'), 'freespace row');
        assert.ok($('body').children('.dx-sortable-placeholder').offset().top <= $rowElements.eq(3).offset().top, 'placeholder');

        // act
        pointer.up();

        // assert
        $rowElements = $(rowsView.element()).find('tbody').children();
        assert.strictEqual($rowElements.eq(2).children().first().text(), 'test0', 'first row');
        assert.ok($rowElements.eq(3).hasClass('dx-freespace-row'), 'freespace row');
    });

    QUnit.test('Dragging row if masterDetail row is opened', function(assert) {
    // arrange
        const $testElement = $('#container');

        this.options.rowDragging.onDragStart = sinon.spy();

        const rowsView = this.createRowsView();
        rowsView.render($testElement);

        // act
        this.dataGrid.expandRow(this.options.dataSource[0]);
        pointerMock(rowsView.getRowElement(2)).start().down().move(0, 10);

        // assert
        const dragStartArgs = this.options.rowDragging.onDragStart.getCall(0).args[0];
        assert.strictEqual(dragStartArgs.fromIndex, 2, 'onDragStart fromIndex');
        assert.strictEqual(dragStartArgs.itemData, this.options.dataSource[1], 'onDragStart itemData');
    });

    QUnit.test('Dragging row if scrolling mode is virtual', function(assert) {
    // arrange
        const $testElement = $('#container');

        this.options.scrolling = { mode: 'virtual' };
        this.options.paging = { pageSize: 2, pageIndex: 1 };
        this.options.rowDragging.onDragStart = sinon.spy();

        const rowsView = this.createRowsView();
        rowsView.render($testElement);

        // act
        pointerMock(rowsView.getRowElement(0)).start().down().move(0, 10);

        // assert
        const dragStartArgs = this.options.rowDragging.onDragStart.getCall(0).args[0];
        assert.strictEqual(dragStartArgs.fromIndex, 0, 'onDragStart fromIndex');
        assert.strictEqual(dragStartArgs.itemData, this.options.dataSource[2], 'onDragStart itemData');
    });

    QUnit.test('Dragging row to far page if scrolling mode is virtual (T867087)', function(assert) {
    // arrange
        const $testElement = $('#container');

        this.options.scrolling = { mode: 'virtual' };
        this.options.paging = { pageSize: 2, pageIndex: 0 };
        const onReorder = this.options.rowDragging.onReorder = sinon.spy();

        const rowsView = this.createRowsView();
        rowsView.render($testElement);

        // act
        pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70);
        this.dataGrid.pageIndex(4);

        // assert
        assert.ok($('.dx-sortable-dragging').is(':visible'), 'dragging element is visible');

        // act
        pointerMock($testElement).start().up();

        // assert
        const reorderArgs = onReorder.getCall(0).args[0];
        assert.strictEqual(onReorder.callCount, 1, 'onReorder called once');
        assert.strictEqual(reorderArgs.fromIndex, 0, 'onReorder fromIndex');
        assert.strictEqual(reorderArgs.toIndex, 1, 'onReorder toIndex');
        assert.strictEqual(reorderArgs.itemData, this.options.dataSource[0], 'onReorder itemData');

        assert.strictEqual(this.dataGrid.getVisibleRows().length, 2, 'visible row count');
        assert.strictEqual(this.dataGrid.getVisibleRows()[reorderArgs.toIndex].data, this.options.dataSource[9], 'onReorder toIndex data');
    });

    QUnit.test('Sortable should have height if dataSource is empty', function(assert) {
    // arrange
        const $testElement = $('#container');

        this.options.dataSource = [];

        const rowsView = this.createRowsView();
        // act
        rowsView.render($testElement);

        // assert
        assert.equal($('#container').find('.dx-sortable').height(), 100);
    });

    QUnit.test('Sortable should have height if dataSource is empty and grid has height', function(assert) {
    // arrange
        const $testElement = $('#container');

        this.options.dataSource = [];
        this.options.columnAutoWidth = true;
        this.options.scrolling = { useNative: false };

        const rowsView = this.createRowsView();

        $('#grid').height(300);
        // act
        rowsView.render($testElement);

        // assert
        assert.equal($('#container').find('.dx-sortable').height(), 300);
    });

    QUnit.test('Dragging row when allowDropInsideItem is true', function(assert) {
    // arrange
        const $testElement = $('#container');

        this.options.rowDragging = {
            allowDropInsideItem: true
        };

        const rowsView = this.createRowsView();
        rowsView.render($testElement);

        // act
        pointerMock(rowsView.getRowElement(0)).start().down().move(0, 50);

        // assert
        const $draggableElement = $('body').children('.dx-sortable-dragging');
        const $placeholderElement = $('body').children('.dx-sortable-placeholder.dx-sortable-placeholder-inside');
        assert.strictEqual($draggableElement.length, 1, 'there is dragging element');
        assert.strictEqual($placeholderElement.length, 1, 'placeholder');
        assert.ok($draggableElement.children().children().hasClass('dx-datagrid'), 'dragging element is datagrid');
        assert.strictEqual($draggableElement.find('.dx-data-row').length, 1, 'row count in dragging element');
    });

    QUnit.test('Dragging row when the lookup column is specified with a remote source', function(assert) {
    // arrange
        const clock = sinon.useFakeTimers();
        const $testElement = $('#container');

        this.options.columns[2] = {
            dataField: 'field3',
            lookup: {
                dataSource: {
                    load: function() {
                        const d = $.Deferred();

                        setTimeout(function() {
                            d.resolve([{
                                id: 'test2',
                                text: 'lookup'
                            }]);
                        }, 200);

                        return d.promise();
                    }
                },
                displayExpr: 'text',
                valueExpr: 'id'
            }
        };

        const rowsView = this.createRowsView();
        clock.tick(200);
        rowsView.render($testElement);

        // act
        pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70);

        // assert
        const $draggableElement = $('body').children('.dx-sortable-dragging');
        assert.ok($draggableElement.children().children().hasClass('dx-datagrid'), 'dragging element is datagrid');
        assert.strictEqual($draggableElement.find('.dx-data-row').length, 1, 'row count in dragging element');
        clock.restore();
    });

    QUnit.test('Dragging row when there are fixed columns', function(assert) {
    // arrange
        const $testElement = $('#container');

        this.options.columns[2] = {
            dataField: 'field3',
            fixed: true
        };

        const rowsView = this.createRowsView();
        rowsView.render($testElement);

        // act
        pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70);

        // assert
        const $draggableElement = $('body').children('.dx-sortable-dragging');
        const $table = $draggableElement.find('.dx-datagrid-rowsview').children(':not(.dx-datagrid-content-fixed)').find('table');
        const $fixTable = $draggableElement.find('.dx-datagrid-rowsview').children('.dx-datagrid-content-fixed').find('table');

        assert.ok($draggableElement.children().children().hasClass('dx-datagrid'), 'dragging element is datagrid');
        assert.strictEqual($table.find('.dx-data-row').length, 1, 'row count in main table');
        assert.strictEqual($table.find('.dx-data-row').children('.dx-pointer-events-none').length, 0, 'main table hasn\'t transparent column');
        assert.strictEqual($fixTable.find('.dx-data-row').length, 1, 'row count in fixed table');
        assert.strictEqual($fixTable.find('.dx-data-row').children('.dx-pointer-events-none').length, 1, 'fixed table has transparent column');
    });

    [false, true].forEach((isFixedCellDragging) => {
        QUnit.test(`Tables should be synchronized during ${isFixedCellDragging ? 'fixed' : ''} row dragging if there are fixed columns`, function(assert) {
            // arrange
            const $testElement = $('#container');

            this.options.columns[2] = {
                dataField: 'field3',
                fixed: true
            };
            this.options.rowDragging.dropFeedbackMode = 'push';

            const rowsView = this.createRowsView();
            rowsView.render($testElement);

            // act
            pointerMock(rowsView.getCellElement(0, isFixedCellDragging ? 2 : 0)).start().down().move(0, 70);

            // assert
            const $sortable = $testElement.find('.dx-sortable');

            assert.equal($sortable.length, 2, 'two sortables are rendered');

            const sortableOptions = [
                $sortable.eq(0).dxSortable('instance').option(),
                $sortable.eq(1).dxSortable('instance').option(),
            ];

            assert.equal(sortableOptions[0].fromIndex, 0, 'first sortable fromIndex');
            assert.equal(sortableOptions[1].fromIndex, 0, 'second sortable fromIndex');
            assert.equal(sortableOptions[0].toIndex, 2, 'first sortable toIndex');
            assert.equal(sortableOptions[1].toIndex, 2, 'second sortable toIndex');
        });
    });

    QUnit.test('Sortables should be updated after resize', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.columns[2] = {
            dataField: 'field3',
            fixed: true
        };
        this.options.scrolling = { mode: 'virtual' };
        this.options.paging = { pageSize: 2, pageIndex: 1 };


        const rowsView = this.createRowsView();
        rowsView.render($testElement);
        rowsView.height(50);
        // act
        pointerMock(rowsView.getCellElement(0, 0)).start().down().move(0, 70);

        // assert
        const $sortable = $testElement.find('.dx-sortable');

        assert.equal($sortable.length, 2, 'two sortables are rendered');

        const sortableInstances = [
            $sortable.eq(0).dxSortable('instance'),
            $sortable.eq(1).dxSortable('instance'),
        ];
        sinon.spy(sortableInstances[0], 'update');
        sinon.spy(sortableInstances[1], 'update');

        // act
        this.dataGrid.pageIndex(4);
        const $scrollContainer = $testElement.find('.dx-datagrid-rowsview .dx-scrollable-container');
        $scrollContainer.trigger('scroll');
        rowsView.resize();

        assert.equal(sortableInstances[0].update.callCount, 1, 'update for sortable 0 is called');
        assert.equal(sortableInstances[0].option('offset'), 8, 'sortable 0 offset is updated');

        assert.equal(sortableInstances[1].update.callCount, 1, 'update for sortable 1 is called');
        assert.equal(sortableInstances[1].option('offset'), 8, 'sortable 1 offset is updated');

    });

    QUnit.test('Sortables points should be updated on scroll for fixed columns (T996293)', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.columns[2] = {
            dataField: 'field3',
            fixed: true
        };

        const rowsView = this.createRowsView();
        rowsView.render($testElement);
        rowsView.height(50);

        const $sortable = $testElement.find('.dx-sortable');
        const fixedScrollable = $sortable.eq(1).dxSortable('instance');
        sinon.spy(fixedScrollable, '_correctItemPoints');

        // act
        pointerMock(rowsView.getCellElement(0, 0)).start().down().move(0, 70);

        $sortable.eq(1).scrollTop(10);
        $sortable.eq(1).trigger('scroll');

        // assert
        assert.equal($sortable.length, 2, 'two sortables are rendered');
        assert.equal(fixedScrollable._correctItemPoints.callCount, 1, '_correctItemPoints for fixed sortable is called');
    });

    // T830034
    QUnit.test('Placeholder should not be wider than grid if horizontal scroll exists', function(assert) {
    // arrange
        const $testElement = $('#container');

        $testElement.css('width', '500px');
        this.options.columnWidth = 300;

        const rowsView = this.createRowsView();
        rowsView.render($testElement);

        // act
        pointerMock(rowsView.getRowElement(0)).start().down().move(0, 115).move(0, 5);

        // assert
        assert.ok($('.dx-sortable-placeholder').width() < 501, 'placeholder width');
    });

    // T868007
    QUnit.test('Placeholder should not be wider than grid if horizontal scroll exists (with fixed column)', function(assert) {
    // arrange
        const $testElement = $('#container');

        $testElement.css('width', '500px');
        this.options.columnWidth = 300;
        this.options.rowDragging = {
            group: 'myGroup'
        };
        this.options.columns = ['field1', 'field2', 'field3', {
            fixed: true, dataField: 'fixed'
        }];

        const rowsView = this.createRowsView();
        rowsView.render($testElement);

        // act
        pointerMock(rowsView.getCellElement(0, 0)).start().down().move(0, 10).move(0, 45);

        // assert
        const $placeholder = $('.dx-sortable-placeholder');

        assert.ok($placeholder.length, 'placeholder exists');
        assert.ok($placeholder.width() < 501, 'placeholder width');
    });

    // T830034
    QUnit.test('Placeholder should be placed correctly if scrollLeft > 0', function(assert) {
    // arrange
        const $testElement = $('#container');

        $testElement.css('width', '200px');
        this.options.columnWidth = 100;

        const rowsView = this.createRowsView();
        rowsView.render($testElement);

        // act
        $testElement.find('.dx-scrollable-container').scrollLeft(50);
        pointerMock(rowsView.getRowElement(0)).start().down().move(0, 115);

        const $placeholderElement = $('.dx-sortable-placeholder');

        // assert
        assert.ok($placeholderElement.width() < 501, 'placeholder width');
        assert.equal($placeholderElement.offset().left, 0, 'placeholder offset left');
    });

    // T837848
    QUnit.test('The placeholder should be placed correctly when there are grouping and hidden group summary rows', function(assert) {
    // arrange
        const onDragChangeSpy = sinon.spy();
        const $testElement = $('#container');

        this.options.grouping = { autoExpandAll: true };
        this.options.rowDragging.onDragChange = onDragChangeSpy;
        this.options.columns[0] = { dataField: 'field1', groupIndex: 0 };
        this.options.summary = {
            groupItems: [{
                column: 'field2',
                summaryType: 'count',
                showInGroupFooter: true
            }],
            texts: {
                count: 'Count: {0}'
            }
        };
        this.options.onRowPrepared = (e) => {
            if(e.rowType === 'groupFooter') {
                $(e.rowElement).hide();
            }
        };

        const rowsView = this.createRowsView();
        rowsView.render($testElement);

        // assert
        assert.ok($(rowsView.getRowElement(2)).hasClass('dx-datagrid-group-footer'), 'has group footer');
        assert.notOk($(rowsView.getRowElement(2)).is(':visible'), 'group footer is hidden');

        // act
        pointerMock(rowsView.getRowElement(1)).start().down().move(0, 100);

        // assert
        const $placeholderElement = $('.dx-sortable-placeholder');
        assert.ok($placeholderElement.is(':visible'), 'placeholder is visible');
        assert.strictEqual($placeholderElement.offset().top, $(rowsView.getRowElement(4)).offset().top, 'placeholder position');
        assert.strictEqual(onDragChangeSpy.getCall(0).args[0].toIndex, 3, 'toIndex');
    });

    // T887897
    ['push', 'indicate'].forEach((dropFeedbackMode) => {
        QUnit.test(`The dragged row should not be displayed in its original position for a moment after row is dropped (dropFeedbackMode = ${dropFeedbackMode})`, function(assert) {
            // arrange
            const $testElement = $('#container');
            const items = generateData(10);
            let d = $.Deferred();

            this.options.dataSource = {
                load: function() {
                    return d.promise();
                }
            };
            this.options.rowDragging = {
                allowReordering: true,
                dropFeedbackMode: dropFeedbackMode,
                onReorder: sinon.spy((e) => {
                    const toIndex = items.indexOf(items[e.toIndex]);
                    const fromIndex = items.indexOf(e.itemData);

                    items.splice(fromIndex, 1);
                    items.splice(toIndex, 0, e.itemData);
                    e.promise = this.dataGrid.refresh();
                })
            };

            const rowsView = this.createRowsView();
            d.resolve(items);
            d = $.Deferred();

            rowsView.render($testElement);

            // act
            pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70).up();

            // assert
            const onReorder = this.options.rowDragging.onReorder;
            let $rowElement = $(rowsView.getRowElement(0));
            let $draggableElement = $('body').children('.dx-sortable-dragging');

            assert.strictEqual(onReorder.callCount, 1, 'onReorder called once');
            assert.strictEqual($draggableElement.length, 1, 'there is dragging element');
            assert.ok($rowElement.hasClass('dx-sortable-source'), 'source row');

            if(dropFeedbackMode === 'push') {
                assert.ok($rowElement.hasClass('dx-sortable-source-hidden'), 'source element is hidden');
            }

            // act
            d.resolve();

            // assert
            $draggableElement = $('body').children('.dx-sortable-dragging');
            $rowElement = $(rowsView.getRowElement(0));

            assert.strictEqual($draggableElement.length, 0, 'there is not dragging element');
            assert.notOk($rowElement.hasClass('dx-sortable-source'), 'element has not source class');
            assert.notOk($rowElement.hasClass('dx-sortable-source-hidden'), 'element has not source-hidden class');
        });
    });
});

QUnit.module('Handle', $.extend({}, moduleConfig, {
    beforeEach: function() {
        $('#qunit-fixture').addClass('qunit-fixture-visible');
        this.options = {
            dataSource: generateData(10),
            columns: ['field1', 'field2', 'field3'],
            rowDragging: {
                allowReordering: true
            }
        };
        this.createRowsView = function() {
            const rowsView = createRowsView.call(this);
            rowsView._columnsController.columnOption('type:drag', 'visible', true);

            return rowsView;
        };
    }
}), () => {

    QUnit.test('Dragging row by the handle', function(assert) {
    // arrange
        const $testElement = $('#container');

        const rowsView = this.createRowsView();

        rowsView.render($testElement);

        const $handleElement = $(rowsView.getRowElement(0)).children().first();

        // assert
        assert.ok($handleElement.hasClass('dx-command-drag'), 'handle');
        assert.strictEqual($handleElement.find('.dx-datagrid-drag-icon').length, 1, 'handle icon');

        // act
        pointerMock($handleElement).start().down().move(0, 70);

        // assert
        const $draggableElement = $('body').children('.dx-sortable-dragging');
        assert.strictEqual($('body').children('.dx-sortable-placeholder').length, 1, 'placeholder');
        assert.strictEqual($draggableElement.length, 1, 'there is dragging element');
        assert.ok($draggableElement.children().children().hasClass('dx-datagrid'), 'dragging element is datagrid');
        assert.strictEqual($draggableElement.find('.dx-data-row').length, 1, 'row count in dragging element');
    });

    QUnit.test('Show handle when changing the \'rowDragging.showDragIcons\' option', function(assert) {
    // arrange
        let $handleElement;
        const $testElement = $('#container');

        this.options.rowDragging = {
            allowReordering: false
        };

        const rowsView = createRowsView.call(this);
        rowsView.render($testElement);
        $handleElement = $(rowsView.getRowElement(0)).children().first();

        // assert
        assert.notOk($handleElement.hasClass('dx-command-drag'), 'no handle');
        assert.strictEqual($handleElement.find('.dx-datagrid-drag-icon').length, 0, 'no handle icon');

        // act
        rowsView.option('rowDragging', {
            showDragIcons: true,
            allowReordering: true
        });

        // assert
        $handleElement = $(rowsView.getRowElement(0)).children().first();
        assert.ok($handleElement.hasClass('dx-command-drag'), 'there is handle');
        assert.ok($handleElement.hasClass('dx-cell-focus-disabled'), 'cell focus disabled for handle');
        assert.strictEqual($handleElement.find('.dx-datagrid-drag-icon').length, 1, 'there is handle icon');
    });

    QUnit.test('Row should have cursor \'pointer\' if showDragIcons set false', function(assert) {
    // arrange
        const $testElement = $('#container');

        const rowsView = createRowsView.call(this);
        rowsView.render($testElement);
        const $handleElement = $(rowsView.getRowElement(0)).children().first();

        // assert
        assert.ok(rowsView.element().find('.dx-sortable-without-handle').length, 'grid has \'dx-sortable-without-handle\' class');
        assert.equal($handleElement.css('cursor'), 'pointer', 'cursor is pointer');
    });

    QUnit.test('Command drag cell should have cursor \'move\' for data rows and \'default\' for group rows', function(assert) {
    // arrange
        const $testElement = $('#container');

        $.extend(this.options, {
            columns: [{ dataField: 'field1', groupIndex: 0 }, 'field2', 'field3'],
            grouping: {
                autoExpandAll: true
            },
            rowDragging: {
                showDragIcons: true
            }
        });

        const $rowsView = this.createRowsView();
        $rowsView.render($testElement);

        // assert
        assert.equal($($rowsView.getRowElement(0)).find('.dx-command-drag').eq(0).css('cursor'), 'default', 'command-drag in group row has default cursor');
        assert.equal($($rowsView.getRowElement(0)).find('.dx-group-cell').eq(0).css('cursor'), 'default', 'data cell in group row has default cursor');
        assert.equal($($rowsView.getRowElement(1)).find('.dx-command-drag').eq(0).css('cursor'), 'move', 'command-drag in data row has move cursor');
        assert.equal($($rowsView.getRowElement(1)).find('td').eq(2).css('cursor'), 'default', 'data cell in data row has default cursor');
    });

    QUnit.test('Command drag cell should have cursor \'grabbing\' for dragging row', function(assert) {
    // arrange
        const rowsView = this.createRowsView();
        rowsView.render($('#container'));

        const $handleElement = $(rowsView.getRowElement(0)).children().first();

        // act
        pointerMock($handleElement).start().down().move(0, 70);

        // assert
        const $draggableElement = $('body').children('.dx-sortable-dragging');
        assert.strictEqual($draggableElement.find('.dx-command-drag').eq(0).css('cursor'), 'grabbing', 'cursor is grabbing');
    });

    QUnit.test('Drag icon should not be displayed for group footer', function(assert) {
    // arrange
        const $testElement = $('#container');

        this.options.grouping = { autoExpandAll: true };
        this.options.columns[0] = { dataField: 'field1', groupIndex: 0 };
        this.options.summary = {
            groupItems: [{
                column: 'field2',
                summaryType: 'count',
                showInGroupFooter: true
            }],
            texts: {
                count: 'Count: {0}'
            }
        };

        const rowsView = this.createRowsView();
        rowsView.render($testElement);

        // assert
        assert.ok($(rowsView.getRowElement(2)).hasClass('dx-datagrid-group-footer'), 'has group footer');

        const $commandDragCell = $(rowsView.getRowElement(2)).find('.dx-command-drag');
        assert.strictEqual($commandDragCell.length, 1, 'group footer has a drag cell');
        assert.strictEqual($(rowsView.getRowElement(2)).find('.dx-command-drag').html(), '&nbsp;', 'group footer does not have a drag icon');
    });
});

