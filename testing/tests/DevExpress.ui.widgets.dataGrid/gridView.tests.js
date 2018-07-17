"use strict";

QUnit.testStart(function() {
    var markup =
'<style>\
    body {\
        padding: 0;\
        margin: 0;\
    }\
    .gridWithHeight {\
        height: 440px;\
    }\
</style>\
<div style="padding: 0px 40px; margin: 0px 50px">\
    <div id="testContainer"></div>\
</div>\
<div id="root">\
    <div id="container" class="dx-datagrid dx-widget"></div>\
</div>\
<div id="itemsContainer"><div style="width:125px; display: inline-block;" ></div><div style="width:125px; display: inline-block;" ></div></div>';

    $("#qunit-fixture").html(markup);
});


require("common.css!");

require("ui/data_grid/ui.data_grid");

var $ = require("jquery"),
    gridCore = require("ui/data_grid/ui.data_grid.core"),
    domUtils = require("core/utils/dom"),
    devices = require("core/devices"),
    dataGridMocks = require("../../helpers/dataGridMocks.js"),
    setupDataGridModules = dataGridMocks.setupDataGridModules,
    MockDataController = dataGridMocks.MockDataController,
    MockColumnsController = dataGridMocks.MockColumnsController,
    getCells = dataGridMocks.getCells;

function getTextFromCell(cell) {
    return $(cell).text();
}


function createGridView(options, userOptions) {
    this.options = $.extend({}, {
        commonColumnSettings: {},
        showColumnHeaders: true
    }, userOptions);

    setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'rows', 'headerPanel', 'grouping', 'pager', 'sorting', 'gridView', 'filterRow', 'headerFilter', 'search', 'columnsResizingReordering', 'editorFactory', 'columnChooser', 'summary', 'columnFixing'],
        {
            initViews: true,
            controllers: {
                data: options.dataController,
                columns: options.columnsController
            },
            views: {
                gridView: options.gridViewType && new options.gridViewType(this)
            }
        });

    this.$element = function() {
        return $("#container");
    };

    return this._views.gridView;
}

// Grid view module///
(function() {
    QUnit.module('Grid view', {
        beforeEach: function() {
            this.defaultOptions = {
                columnsController: new MockColumnsController([]),
                dataController: new MockDataController({
                    pageCount: 1,
                    pageIndex: 0,
                    items: [{ values: {} }]
                })
            };
            this.createGridView = createGridView;
        }
    });

    QUnit.test('Grid view container is empty after redraw', function(assert) {
        // arrange
        this.defaultOptions.columnsController.getVisibleColumns = function() {
            return [{ caption: 'Column 1' }, { caption: 'Column 2' }, { caption: 'Column 3' }];
        };
        this.defaultOptions.dataController.items = function() {
            return [{ values: [10, 12, 'test 1'] }, { values: [100, 142, 'test 2'] }];
        };

        var gridView = this.createGridView(this.defaultOptions),
            testElement = $('#container'),
            renderOptions = {
                showColumnHeaders: true,
                groupPanel: {
                    visible: false
                },
                searchPanel: {
                    visible: false
                }
            },
            tableElements,
            cells,
            tr,
            rows;

        $.extend(this.options, renderOptions);

        // act
        gridView.render(testElement, this.options);
        gridView.render(testElement, this.options);
        gridView.render(testElement, this.options);

        tableElements = testElement.find('table');
        assert.ok(tableElements);
        assert.equal(tableElements.length, 2);

        rows = tableElements.eq(0).find('tbody > tr');

        // assert
        assert.equal(tableElements.length, 2, 'tables count');

        assert.equal(rows.length, 1, 'headers row count');

        tr = $(rows[0]);

        cells = getCells(tr);
        assert.equal($(cells[0]).find(".dx-datagrid-text-content").first().text(), 'Column 1', '1 header');
        assert.equal($(cells[1]).find(".dx-datagrid-text-content").first().text(), 'Column 2', '2 header');
        assert.equal($(cells[2]).find(".dx-datagrid-text-content").first().text(), 'Column 3', '3 header');

        rows = tableElements.eq(1).find('tbody > tr');
        tr = $(rows[0]);

        assert.equal(rows.length, 3, 'rows count');
        assert.equal(getTextFromCell(getCells(tr)[0]), '10', '1 row 1 cell');
        assert.equal(getTextFromCell(getCells(tr)[1]), '12', '1 row 2 cell');
        assert.equal(getTextFromCell(getCells(tr)[2]), 'test 1', '1 row 3 cell');

        tr = $(rows[1]);

        assert.equal(getTextFromCell(getCells(tr)[0]), '100', '2 row 1 cell');
        assert.equal(getTextFromCell(getCells(tr)[1]), '142', '2 row 2 cell');
        assert.equal(getTextFromCell(getCells(tr)[2]), 'test 2', '2 row 3 cell');
    });
    // B237087
    QUnit.test('Render search panel. Call resize after render', function(assert) {
        // arrange
        var testElement = $('#container'),
            resizeCallCount = 0;
        var gridView = this.createGridView(this.defaultOptions);

        gridView.getView("columnHeadersView").resize = function() {
            resizeCallCount++;
        };

        $.extend(this.options, {
            showColumnHeaders: true,
            searchPanel: {
                visible: true,
                width: 300,
                placeholder: 'Enter text for search'
            },
            groupPanel: {
                visible: false
            }
        });

        // act
        gridView.render(testElement, this.options);
        gridView.update();

        // assert
        assert.strictEqual(resizeCallCount, 1, 'valid count call update method');
    });

    QUnit.test('Render search panel. Call update after resize', function(assert) {
        // arrange
        var testElement = $('#container'),
            countCallUpdate = 0;
        var gridView = this.createGridView(this.defaultOptions);

        gridView.render(testElement, $.extend(this.options, {
            showColumnHeaders: true,
            searchPanel: {
                visible: true,
                width: 300,
                placeholder: 'Enter text for search'
            },
            groupPanel: {
                visible: false
            }
        }));
        gridView.getView("columnHeadersView").resize = function() {
            countCallUpdate++;
        };
        // act
        gridView.getController("resizing").resize();
        // assert
        assert.strictEqual(countCallUpdate, 1, 'valid count call update method');
    });

    QUnit.test('Check search panel aria attribute', function(assert) {
        // arrange
        var testElement = $('#container'),
            gridView = this.createGridView(this.defaultOptions);

        gridView.render(testElement, $.extend(this.options, {
            searchPanel: {
                visible: true
            }
        }));

        // assert
        assert.equal(testElement.find(".dx-datagrid-search-panel :not(.dx-texteditor-input)").attr("aria-label"), undefined, "aria-label attribute not presents for non 'input' elements");
        assert.notEqual(testElement.find(".dx-texteditor-input").attr("aria-label"), undefined, "aria-label attribute presents for 'input' element");
    });

    QUnit.test('Grid view resize', function(assert) {
        // arrange
        this.defaultOptions.columnsController.getVisibleColumns = function() {
            return [{ caption: 'Column 1' }, { caption: 'Column 2' }, { caption: 'Column 3' }];
        };
        this.defaultOptions.dataController.items = function() {
            return [{ values: [10, 12, 'test 1'] }, { values: [100, 142, 'test 2'] }];
        };

        var testElement = $('#container');

        testElement.height(300);

        var gridView = this.createGridView(this.defaultOptions);

        $.extend(this.options, {
            showColumnHeaders: true,
            scrolling: true,
            filterRow: { visible: true },
            groupPanel: {
                visible: false
            },
            searchPanel: {
                visible: false
            }
        });

        gridView.render(testElement);
        gridView.update();

        var scrollableDiv = testElement.find('.dx-scrollable');
        var scrollableHeight = scrollableDiv.height();

        // act
        $('#container').height(250);

        gridView.getController("resizing").resize();

        // assert
        assert.ok(scrollableDiv);
        assert.equal(scrollableDiv.length, 1);

        assert.equal(scrollableHeight, scrollableDiv.height() + 50);
    });

    QUnit.test('Resize on endUpdate', function(assert) {
        // arrange
        var gridView = this.createGridView(this.defaultOptions),
            resizeCounter = 0;

        gridView.render($('#container'));
        gridView._resizingController.updateDimensions = function() {
            resizeCounter++;
        };

        // act
        gridView.beginUpdate();
        gridView.component._requireResize = true;
        gridView.endUpdate();

        // assert
        assert.equal(resizeCounter, 1);
    });

    // B237092
    QUnit.test('Grid view resize when header height changed during resize', function(assert) {
        // arrange
        this.defaultOptions.columnsController.getVisibleColumns = function() {
            return [{ caption: 'Test Title' }];
        };
        this.defaultOptions.dataController.items = function() {
            return [{ values: [10] }, { values: [100] }];
        };

        this.defaultOptions.dataController.isPagerVisible = function() {
            return false;
        };

        var testElement = $('#container');

        testElement.height(300);
        testElement.width(20);

        var gridView = this.createGridView(this.defaultOptions);

        gridView.render(testElement, $.extend(this.options, {
            showColumnHeaders: true,
            scrolling: true,
            filterRow: { visible: true }
        }));

        // act
        $('#container').width(200);

        gridView.resize();

        assert.equal(Math.round(gridView.getView("rowsView").height() + gridView.getView("columnHeadersView").getHeight()), 300);
    });

    QUnit.test('Grid view update size after change columnHeadersView height', function(assert) {
        // arrange
        this.defaultOptions.columnsController.getVisibleColumns = function() {
            return [{ caption: 'Column 1', allowFiltering: true }, { caption: 'Column 2' }, { caption: 'Column 3' }];
        };
        this.defaultOptions.dataController.items = function() {
            return [{ values: [10, 12, 'test 1'] }, { values: [100, 142, 'test 2'] }];
        };

        var testElement = $('#container');

        testElement.height(300);

        var gridView = this.createGridView(this.defaultOptions);

        gridView.render(testElement, $.extend(this.options, {
            showColumnHeaders: true,
            scrolling: true
        }));

        var columnHeadersViewHeight = gridView.getView("columnHeadersView").getHeight();
        var rowsViewHeight = gridView.getView("rowsView").element().height();

        // act
        this.options.filterRow = { visible: true };
        gridView.getView("columnHeadersView").render();
        gridView._resizingController.resize();

        // assert
        assert.notEqual(columnHeadersViewHeight, gridView.getView("columnHeadersView").getHeight());
        assert.equal(Math.round(columnHeadersViewHeight + rowsViewHeight), Math.round(gridView.getView("columnHeadersView").getHeight() + gridView.getView("rowsView").element().height()));
    });

    QUnit.test('Show headers', function(assert) {
        // arrange
        var gridView = this.createGridView(this.defaultOptions),
            testElement = $('#container'),
            headers;

        // act
        gridView.render(testElement, $.extend(this.options, {
            showColumnHeaders: true
        }));
        headers = testElement.find(".dx-datagrid-headers");

        // assert
        assert.ok(headers.length > 0, 'headers are shown');
    });

    QUnit.test('Hide headers', function(assert) {
        // arrange
        var gridView = this.createGridView(this.defaultOptions, { showColumnHeaders: false }),
            testElement = $('#container'),
            headers;

        // act
        gridView.render(testElement, {});
        headers = testElement.find(".dx-datagrid-headers");

        // assert
        assert.ok(headers.length === 0, 'headers are hidden');
    });

    QUnit.test("Hide borders by default", function(assert) {
        // arrange
        var gridView = this.createGridView(this.defaultOptions),
            testElement = $('#container');

        // act
        gridView.render(testElement, {});

        // assert
        assert.equal(testElement.find(".dx-datagrid-borders").length, 0, "borders class");
    });

    QUnit.test("Show borders", function(assert) {
        // arrange
        var gridView = this.createGridView(this.defaultOptions),
            testElement = $('#container');

        // act
        gridView.render(testElement, {});
        gridView.optionChanged({ name: "showBorders", value: true });

        // assert
        assert.equal(testElement.find(".dx-datagrid-borders").length, 1, "borders class");
    });

    QUnit.test('Show filterRow by filterRow visible', function(assert) {
        // arrange
        var gridView = this.createGridView(this.defaultOptions, {
                filterRow: { visible: true },
                groupPanel: {
                    visible: false
                },
                searchPanel: {
                    visible: false
                }
            }),
            testElement = $('#container'),
            headers;

        // act
        gridView.render(testElement);
        headers = testElement.find(".dx-datagrid-headers");

        // assert
        assert.ok(headers.length > 0, 'headers are shown');
    });

    QUnit.test('Hide filterRow by filterRow visible', function(assert) {
        // arrange
        var gridView = this.createGridView(this.defaultOptions,
            {
                showColumnHeaders: false,
                filterRow: {
                    visible: false
                },
                groupPanel: {
                    visible: false
                },
                searchPanel: {
                    visible: false
                }
            }),
            testElement = $('#container'),
            headers;

        // act
        gridView.render(testElement);
        headers = testElement.find(".dx-datagrid-headers");

        // assert
        assert.ok(headers.length === 0, 'headers are hidden');
    });

    // B239207
    QUnit.testInActiveWindow('Get points by columns when change scroll position headers_B239207', function(assert) {
        // arrange
        var done = assert.async(),
            defaultOptions = {
                columnsController: new MockColumnsController([
                { caption: 'Column 1', width: 500, allowResizing: true },
                { caption: 'Column 2', width: 500, allowResizing: true }
                ], this.commonColumnSettings),
                dataController: new MockDataController({
                    items: [{ values: ['', ''] }]
                })
            },
            gridView,
            testElement = $('<div />').width(300).appendTo($('#container')),
            pointsByColumns;

        // act
        this.$element = function() {
            return testElement;
        };
        gridView = this.createGridView(defaultOptions, { commonColumnSettings: { allowResizing: true } });
        gridView.render(testElement);
        pointsByColumns = $.extend([], gridView.getController('columnsResizer')._pointsByColumns);
        var $scrollable = testElement.find('.dx-scrollable-container');

        // assert
        $scrollable.scroll(function() {
            assert.notDeepEqual(pointsByColumns, gridView.getController('columnsResizer')._pointsByColumns);
            done();
        });

        $scrollable.scrollLeft(470);
    });

    // //////// Scroller////////////
    QUnit.test('No scroller when content height less then rowsView height', function(assert) {
        // arrange, act
        var gridView = this.createGridView({
            columnsController: new MockColumnsController([{ caption: 'Column 1', visible: true }]),
            dataController: new MockDataController({
                items: [
                            { values: [1] },
                            { values: [2] }
                ]
            })
        });

        $('#container').height(200).width(1000);
        gridView.render($('#container'), $.extend(this.options, {
            scrolling: true,
            showColumnHeaders: true,
            groupPanel: {
                visible: false
            },
            searchPanel: {
                visible: false
            }
        }));

        // assert
        assert.strictEqual(gridView.getView("columnHeadersView").element().css('paddingRight'), '0px');
        assert.strictEqual(gridView.getView("rowsView").getScrollbarWidth(), 0);
    });

    QUnit.test('Scroller shown when content height more then rowsView height', function(assert) {
        // arrange, act
        var gridView = this.createGridView({
                columnsController: new MockColumnsController([{ caption: 'Column 1', visible: true }]),
                dataController: new MockDataController({
                    items: [
                            { values: [1] },
                            { values: [2] },
                            { values: [3] },
                            { values: [4] },
                            { values: [5] }
                    ],
                    totalItem: {
                        summaryCells: [
                        { summaryType: "count", value: 100 },
                        { summaryType: "min", value: 0 },
                        { summaryType: "max", value: 120001 }
                        ]
                    }
                })
            }),
            $container = $('#container');

        $container.height(100).width(1000);
        gridView.render($container, $.extend(this.options, {
            scrolling: {},
            showColumnHeaders: true,
            groupPanel: {
                visible: false
            },
            searchPanel: {
                visible: false
            },
            disabled: false
        }));
        gridView.update();

        gridView.getController("resizing").resize();

        // assert

        var headersContainer = gridView.getView("columnHeadersView").element();
        var headersTable = gridView.getView("columnHeadersView")._tableElement;
        var footerTable = gridView.getView("footerView")._tableElement;
        var scrollerWidth = gridView.getView("rowsView").getScrollbarWidth();
        var device = devices.real();

        if(device.ios || device.win || device.android) {
            assert.strictEqual(scrollerWidth, 0);
        } else {
            assert.notStrictEqual(scrollerWidth, 0);
        }
        assert.strictEqual(headersContainer.outerWidth() - headersTable.width(), scrollerWidth);
        // T351379
        assert.strictEqual(footerTable.width(), headersTable.width(), "headers and footer table widths must be equals");
    });

    QUnit.test('Scroller not shown when scrollable is false', function(assert) {
        // arrange, act
        var gridView = this.createGridView({
            columnsController: new MockColumnsController([{ caption: 'Column 1', visible: true }]),
            dataController: new MockDataController({
                items: [
                            { values: [1] },
                            { values: [2] },
                            { values: [3] },
                            { values: [4] },
                            { values: [5] }
                ]
            })
        });

        $('#container').height(100).width(1000);
        gridView.render($('#container'), $.extend(this.options, {
            scrolling: false,
            showColumnHeaders: true,
            groupPanel: {
                visible: false
            },
            searchPanel: {
                visible: false
            }
        }));

        // assert

        var headersContainer = gridView.getView("columnHeadersView").element();
        var scrollerWidth = gridView.getView("rowsView").getScrollbarWidth();

        assert.strictEqual(scrollerWidth, 0);
        assert.strictEqual(headersContainer.css('paddingRight'), '0px');
    });
    // ////////////////////////////

    QUnit.test('RowsView height calculation', function(assert) {
        // arrange, act
        var gridView = this.createGridView({
            columnsController: new MockColumnsController([{ caption: 'Column 1', visible: true }]),
            dataController: new MockDataController({
                items: [
                    { values: [1] },
                    { values: [2] }
                ]
            })
        });

        $('#container').height(100).width(1000);

        gridView.render($('#container'), $.extend(this.options, {
            scrolling: true,
            showColumnHeaders: true,
            pager: {
                visible: true
            }
        }));

        // assert

        var columnsHeaderViewContainer = gridView.getView('columnHeadersView').element();
        var rowsViewViewContainer = gridView.getView('rowsView').element();
        var pagerView = gridView.getView('pagerView');

        // B232626
        assert.strictEqual(Math.round(columnsHeaderViewContainer.height() + rowsViewViewContainer.height() + pagerView.getHeight()), 100);
        assert.notStrictEqual(columnsHeaderViewContainer.height(), 0);
        assert.notStrictEqual(rowsViewViewContainer.height(), 0);
        assert.notStrictEqual(pagerView.getHeight(), 0);
    });

    QUnit.test('RowsView height calculation when no data', function(assert) {
        // arrange, act
        var gridView = this.createGridView({
            columnsController: new MockColumnsController([{ caption: 'Column 1', visible: true }]),
            dataController: new MockDataController({ items: [], allRowsCount: 0 })
        });

        $('#container').width(1000);
        gridView.render($('#container'), $.extend(this.options, {
            scrolling: true,
            showColumnHeaders: false,
            loadPanel: { enabled: true, width: 200, height: 90 },
            groupPanel: {
                visible: false
            },
            searchPanel: {
                visible: false
            }
        }));

        // assert

        var rowsViewViewContainer = gridView.getView("rowsView").element();

        assert.strictEqual(rowsViewViewContainer.height(), 100);
    });

    QUnit.test('RowsView height calculation when data not loaded and allRowsCount defined', function(assert) {
        // arrange, act
        var gridView = this.createGridView({
            columnsController: new MockColumnsController([{ caption: 'Column 1', visible: true }]),
            dataController: new MockDataController({ items: [], allRowsCount: 100 })
        });

        $('#container').width(1000);
        gridView.render($('#container'), $.extend(this.options, {
            scrolling: true,
            showColumnHeaders: false,
            loadPanel: { enabled: true, width: 200, height: 90 },
            groupPanel: {
                visible: false
            },
            searchPanel: {
                visible: false
            }
        }));

        // assert

        var rowsViewViewContainer = gridView.getView("rowsView").element();

        assert.strictEqual(rowsViewViewContainer.height(), 100);
    });

    QUnit.test('RowsView height calculation when no data and loadIndicator is not visible', function(assert) {
        // arrange, act
        var gridView = this.createGridView({
            columnsController: new MockColumnsController([{ caption: 'Column 1', visible: true }]),
            dataController: new MockDataController({ items: [], allRowsCount: 0 })
        });

        $('#container').width(1000);
        gridView.render($('#container'), $.extend(this.options, {
            scrolling: true,
            showColumnHeaders: false,
            loadPanel: { enabled: false },
            groupPanel: {
                visible: false
            },
            searchPanel: {
                visible: false
            }
        }));

        // assert

        var rowsViewViewContainer = gridView.getView("rowsView").element();

        assert.strictEqual(rowsViewViewContainer.height(), 100);
    });

    QUnit.test('Scroller shown after inserting items', function(assert) {
        // arrange, act
        var dataController = new MockDataController({
                items: [
                { values: [1] },
                { values: [2] }
                ]
            }),
            columnsController = new MockColumnsController([{ caption: 'Column 1', visible: true }]),
            gridView = this.createGridView({
                columnsController: columnsController,
                dataController: dataController
            }),
            headersContainer,
            headersTable,
            scrollerWidth,
            device = devices.real(),
            $container = $('#container');

        columnsController.columnOption = function() {
            if(arguments.length === 3) {
                $('#container').find('col').width('auto');
            }
        };
        $container.height(150).width(1000);
        gridView.render($container, $.extend(this.options, {
            scrolling: true,
            showColumnHeaders: true,
            groupPanel: {
                visible: false
            },
            searchPanel: {
                visible: false
            },
            disabled: false
        }));
        gridView.update();

        // assert

        assert.strictEqual(gridView.getView("rowsView").getScrollbarWidth(), 0);

        // act
        dataController.insertItems([{ values: [3] }, { values: [4] }, { values: [5] }]);

        // assert
        headersContainer = gridView.getView("columnHeadersView").element();
        headersTable = gridView.getView("columnHeadersView")._tableElement;
        scrollerWidth = gridView.getView("rowsView").getScrollbarWidth();

        if(device.ios || device.win || device.android) {
            assert.strictEqual(scrollerWidth, 0);
        } else {
            assert.notStrictEqual(scrollerWidth, 0);
        }
        assert.strictEqual(headersContainer.outerWidth() - headersTable.width(), scrollerWidth);
    });

    // B254732
    QUnit.test('update scrollable after append items in infinite scrolling mode', function(assert) {
        // arrange, act
        var dataController = new MockDataController({
            items: [
                { values: [1] },
                { values: [2] }
            ]
        });

        var gridView = this.createGridView({
            columnsController: new MockColumnsController([{ caption: 'Column 1', visible: true }]),
            dataController: dataController
        });

        $('#container').height(150).width(1000);
        gridView.render($('#container'), $.extend(this.options, {
            scrolling: {
                mode: 'infinite'
            },
            showColumnHeaders: true
        }));
        gridView.update();
        dataController.changed.fire({
            changeType: 'refresh'
        });

        var scrollableUpdateCallCount = 0;

        gridView.getView("rowsView").element().dxScrollable("instance").update = function() {
            scrollableUpdateCallCount++;
        };


        // act
        dataController.changed.fire({
            changeType: 'append',
            items: []
        });

        // assert
        assert.equal(scrollableUpdateCallCount, 1, 'scrollable update call count');
    });

    QUnit.test('Get points by group panel items', function(assert) {
        // arrange
        var defaultOptions = {
                columnsController: new MockColumnsController([{ caption: 'Test 1', groupIndex: 0, allowSorting: true }, { caption: 'Test 2', groupIndex: 1, allowSorting: true }], { allowReordering: true }),
                dataController: new MockDataController({
                    items: [{ values: ['', ''] }]
                })
            },
            gridView = this.createGridView(defaultOptions, {
                groupPanel: {
                    visible: true,
                    message: 'Test drag'
                },
                searchPanel: {
                    visible: false
                }
            }),
            testElement = $('#container').css({ width: '500px', height: '500px' });

        // act
        gridView.render(testElement);

        // assert
        var points = gridCore.getPointsByColumns(gridView.getView('headerPanel').getColumnElements());
        assert.equal(points.length, 3, '3 group points');
        assert.strictEqual(points[0].index, 0);
        assert.strictEqual(points[1].index, 1);
        assert.strictEqual(points[2].index, 2);
        assert.strictEqual(points[0].columnIndex, 0);
        assert.strictEqual(points[1].columnIndex, 1);
        assert.strictEqual(points[2].columnIndex, 2);
        assert.ok(points[0].x < points[1].x, 'first column element position less second element position');
        assert.ok(points[1].x < points[2].x, 'second column element position less third element position');
    });

    QUnit.test("Content ready action and shown event are not triggered on selection changed", function(assert) {
        // arrange
        var isContentReadyCalled,
            isShownEventTriggered;

        this.createGridView(this.defaultOptions);

        domUtils.triggerShownEvent = function() {
            isShownEventTriggered = true;
        };

        this.resizingController.component._fireContentReadyAction = function() {
            isContentReadyCalled = true;
        };

        // act
        this.resizingController._initPostRenderHandlers();
        this.resizingController._refreshSizesHandler({
            changeType: "updateSelection"
        });

        // assert
        assert.ok(!isShownEventTriggered, "shown event");
        assert.ok(!isContentReadyCalled, "content ready");
    });

    QUnit.test("Render scrollable when there is max height (T427967)", function(assert) {
        // arrange, act
        var $testElement = $('#container').css("maxHeight", 100),
            gridView = this.createGridView({
                columnsController: new MockColumnsController([{ caption: 'Column 1', visible: true }]),
                dataController: new MockDataController({
                    items: [
                        { values: [1] },
                        { values: [2] },
                        { values: [1] },
                        { values: [3] },
                        { values: [4] },
                        { values: [5] },
                        { values: [6] }
                    ]
                })
            });

        // act
        gridView.render($('#container'));
        gridView.update();

        // assert
        assert.ok($testElement.find(".dx-datagrid-rowsview").hasClass("dx-scrollable"), "has scrollable");
    });

    // T527837
    QUnit.test("RowsView height calculation when grid container has border and padding (zoom is 90%)", function(assert) {
        // arrange, act
        var $rowsViewContainer,
            $testElement = $("#container").css({
                border: "1px solid black",
                padding: 15
            }),
            gridView = this.createGridView({
                columnsController: new MockColumnsController([{ caption: "Column 1", visible: true }]),
                dataController: new MockDataController({
                    items: [
                        { values: [1] },
                        { values: [2] }
                    ]
                })
            });

        $("#root").css("zoom", 0.9);

        gridView.render($testElement, $.extend(this.options, {
            scrolling: true,
            showColumnHeaders: true,
            pager: {
                visible: true
            }
        }));

        // assert
        $rowsViewContainer = gridView.getView("rowsView").element();
        assert.strictEqual($rowsViewContainer.get(0).style.height, "", "height of the rowsView");
    });

    // T654070
    QUnit.test("Render scrollable after showing grid", function(assert) {
        // arrange
        var $testElement = $("#container");

        $testElement.hide();
        $testElement.addClass("gridWithHeight");

        var gridView = this.createGridView({
            columnsController: new MockColumnsController([{ caption: 'Column 1', visible: true }]),
            dataController: new MockDataController({
                items: [ { values: [1] } ]
            })
        });

        gridView.render($testElement);
        gridView.update();

        // assert
        assert.notOk(this.rowsView.element().hasClass("dx-scrollable"), "hasn't scrollable");

        // act
        $testElement.show();
        this.updateDimensions();

        // assert
        assert.ok(this.rowsView.element().hasClass("dx-scrollable"), "has scrollable");
    });
}());

// Synchronize columns module///
(function() {
    QUnit.module('Synchronize columns', {
        beforeEach: function() {
            this.options = {
                columnAutoWidth: true,
                showColumnHeaders: true
            };

            this.createGridView = createGridView;
            this.clock = sinon.useFakeTimers();
        },
        afterEach: function() {
            this.clock.restore();
        }
    });

    QUnit.test('Add class nowrap when columnWidth auto', function(assert) {
        // arrange
        var defaultOptions = {
                columnsController: new MockColumnsController([{ caption: 'Column 1' }, { caption: 'Column 2' }, { caption: 'Column 3' }]),
                dataController: new MockDataController({
                    items: [{ values: [10, 12, 'test 1'] }]
                })
            },
            gridView = this.createGridView(defaultOptions, { columnAutoWidth: true }),
            testElement = $('<div />').width(300).appendTo($('#container'));

        // act
        gridView.render(testElement);

        // assert
        assert.ok($('.dx-datagrid-headers').hasClass('dx-datagrid-nowrap'));
    });

    QUnit.test('Columns with fixed width when columnWidth not auto', function(assert) {
        // arrange
        var defaultOptions = {
                columnsController: new MockColumnsController([{ caption: 'Column 1', width: '20px' }, { caption: 'Column 2' }, { caption: 'Column 3' }, { caption: 'Column 4' }, { caption: 'Column 5', width: '20px' }]),
                dataController: new MockDataController({
                    items: [{ values: ['', '', '', '', ''] }]
                })
            },
            gridView = this.createGridView(defaultOptions),
            testElement = $('<div />').width(340).appendTo($('#container')),
            columnsHeader;

        // act
        gridView.render(testElement);
        columnsHeader = testElement.find('table').find('tbody > tr').first().find('td');

        // assert
        assert.equal(columnsHeader.eq(0).outerWidth(), 20);
        assert.equal(columnsHeader.eq(1).outerWidth(), 100);
        assert.equal(columnsHeader.eq(2).outerWidth(), 100);
        assert.equal(columnsHeader.eq(3).outerWidth(), 100);
        assert.equal(columnsHeader.eq(4).outerWidth(), 20);
    });

    QUnit.test('Columns with fixed widths. Reset last width to auto when columnWidth is auto', function(assert) {
        // arrange
        var defaultOptions = {
                columnsController: new MockColumnsController([{ caption: 'Column 1', width: '20px' }, { caption: 'Column 2', width: '50px' }, { caption: 'Column 3', width: '50px' }, { caption: 'Column 4', width: '50px' }, { caption: 'Column 5', width: '20px' }]),
                dataController: new MockDataController({
                    items: [{ values: ['', '', '', '', ''] }]
                })
            },
            gridView = this.createGridView(defaultOptions),
            testElement = $('<div />').width(340).appendTo($('#container')),
            columnsHeader;

        // act
        gridView.render(testElement);
        gridView.update();

        defaultOptions.columnsController.columnsChanged.fire({
            changeTypes: { columns: true, length: 1 },
            optionNames: { visibleWidth: true, length: 1 }
        });

        columnsHeader = testElement.find('table').find('tbody > tr').first().find('td');


        // assert
        assert.equal(columnsHeader.eq(0).outerWidth(), 20);
        assert.equal(columnsHeader.eq(1).outerWidth(), 50);
        assert.equal(columnsHeader.eq(2).outerWidth(), 50);
        assert.equal(columnsHeader.eq(3).outerWidth(), 50);
        assert.equal(columnsHeader.eq(4).outerWidth(), 170);
    });

    QUnit.test('Columns with fixed widths. Reset last width to auto when columnWidth is not auto', function(assert) {
        // arrange
        var defaultOptions = {
                columnsController: new MockColumnsController([{ caption: 'Column 1', width: '20px' }, { caption: 'Column 2', width: '50px' }, { caption: 'Column 3', width: '50px' }, { caption: 'Column 4', width: '50px' }, { caption: 'Column 5', width: '20px' }]),
                dataController: new MockDataController({
                    items: [{ values: ['', '', '', '', ''] }]
                })
            },
            gridView = this.createGridView(defaultOptions),
            testElement = $('<div />').width(340).appendTo($('#container')),
            columnsHeader;

        this.options.columnWidth = undefined;

        // act
        gridView.render(testElement);
        gridView.update();
        defaultOptions.columnsController.columnsChanged.fire({
            changeTypes: { columns: true, length: 1 },
            optionNames: { visibleWidth: true, length: 1 }
        });

        columnsHeader = testElement.find('table').find('tbody > tr').first().find('td');

        // assert
        assert.equal(columnsHeader.eq(0).outerWidth(), 20);
        assert.equal(columnsHeader.eq(1).outerWidth(), 50);
        assert.equal(columnsHeader.eq(2).outerWidth(), 50);
        assert.equal(columnsHeader.eq(3).outerWidth(), 50);
        assert.equal(columnsHeader.eq(4).outerWidth(), 170);
    });

    // B252877
    QUnit.test('Columns with percentage width when columnWidth is not auto', function(assert) {
        // arrange
        var defaultOptions = {
                columnsController: new MockColumnsController([{ caption: 'Column 1', width: '20%' }, { caption: 'Column 2', width: '15%' }, { caption: 'Column 3', width: '15%' }, { caption: 'Column 4', width: '50%' }]),
                dataController: new MockDataController({
                    items: [{ values: ['', '', '', '', ''] }]
                })
            },
            gridView = this.createGridView(defaultOptions),
            testElement = $('<div />').width(800).appendTo($('#container')),
            columnsHeader;

        this.options.columnWidth = undefined;

        // act
        gridView.render(testElement);
        gridView.update();
        defaultOptions.columnsController.columnsChanged.fire({
            changeTypes: { columns: true, length: 1 },
            optionNames: { visibleWidth: true, length: 1 }
        });

        columnsHeader = testElement.find('table').find('tbody > tr').first().find('td');

        // assert
        assert.equal(columnsHeader.eq(0).outerWidth(), 160);
        assert.equal(columnsHeader.eq(1).outerWidth(), 120);
        assert.equal(columnsHeader.eq(2).outerWidth(), 120);
        assert.equal(columnsHeader.eq(3).outerWidth(), 400);
    });

    QUnit.test('Columns with percentage width and fixed width when columnWidth is not auto and totalWidth more than grid width', function(assert) {
        // arrange
        var defaultOptions = {
                columnsController: new MockColumnsController([{ caption: 'Column 1', width: '20%' }, { caption: 'Column 2', width: '15%' }, { caption: 'Column 3', width: '15%' }, { caption: 'Column 4', width: 600 }]),
                dataController: new MockDataController({
                    items: [{ values: ['', '', '', '', ''] }]
                })
            },
            gridView = this.createGridView(defaultOptions),
            testElement = $('<div />').width(800).appendTo($('#container')),
            columnsHeader;

        this.options.columnWidth = undefined;

        // act
        gridView.render(testElement);
        defaultOptions.columnsController.columnsChanged.fire({
            changeTypes: { columns: true, length: 1 },
            optionNames: { visibleWidth: true, length: 1 }
        });

        columnsHeader = testElement.find('table').find('tbody > tr').first().find('td');

        // assert
        assert.equal(columnsHeader.eq(0).outerWidth(), 80);
        assert.equal(columnsHeader.eq(1).outerWidth(), 60);
        assert.equal(columnsHeader.eq(2).outerWidth(), 60);
        assert.equal(columnsHeader.eq(3).outerWidth(), 600, 'last column width not reset to auto');
    });

    QUnit.test('Columns with percentage width and fixed width when columnWidth is not auto and totalWidth less than grid width', function(assert) {
        // arrange
        var defaultOptions = {
                columnsController: new MockColumnsController([{ caption: 'Column 1', width: '20%' }, { caption: 'Column 2', width: '15%' }, { caption: 'Column 3', width: '15%' }, { caption: 'Column 4', width: 200 }]),
                dataController: new MockDataController({
                    items: [{ values: ['', '', '', '', ''] }]
                })
            },
            gridView = this.createGridView(defaultOptions),
            testElement = $('<div />').width(800).appendTo($('#container')),
            columnsHeader;

        this.options.columnWidth = undefined;

        // act
        gridView.render(testElement);
        gridView.update();
        defaultOptions.columnsController.columnsChanged.fire({
            changeTypes: { columns: true, length: 1 },
            optionNames: { visibleWidth: true, length: 1 }
        });

        columnsHeader = testElement.find('table').find('tbody > tr').first().find('td');

        // assert
        assert.equal(columnsHeader.eq(0).outerWidth(), 160);
        assert.equal(columnsHeader.eq(1).outerWidth(), 120);
        assert.equal(columnsHeader.eq(2).outerWidth(), 120);
        assert.equal(columnsHeader.eq(3).outerWidth(), 400, 'last column width reset to auto');
    });

    // B252877
    QUnit.test('Columns with percentage width when columnWidth is auto', function(assert) {
        // arrange
        var defaultOptions = {
                columnsController: new MockColumnsController([{ caption: 'Column 1', width: '30%' }, { caption: 'Column 2', width: '10%' }, { caption: 'Column 3' }, { caption: 'Column 4', width: '30%' }]),
                dataController: new MockDataController({
                    items: [{ values: ['', '', '', '', ''] }]
                })
            },
            gridView = this.createGridView(defaultOptions),
            testElement = $('<div />').width(1000).appendTo($('#container')),
            columnsHeader;

        // act
        gridView.render(testElement);
        columnsHeader = testElement.find('table').find('tbody > tr').first().find('td');

        // assert
        assert.equal(columnsHeader.eq(0).outerWidth(), 300);
        assert.equal(columnsHeader.eq(1).outerWidth(), 100);
        assert.equal(columnsHeader.eq(2).outerWidth(), 300);
        assert.equal(columnsHeader.eq(3).outerWidth(), 300);
    });

    QUnit.test('Columns with percentage width and fixed widths when columnWidth is not auto', function(assert) {
        // arrange
        var defaultOptions = {
                columnsController: new MockColumnsController([{ caption: 'Column 1', width: '30%' }, { caption: 'Column 2', width: '200px' }, { caption: 'Column 3', width: '160px' }, { caption: 'Column 4', width: '50px' }]),
                dataController: new MockDataController({
                    items: [{ values: ['', '', '', '', ''] }]
                })
            },
            gridView = this.createGridView(defaultOptions),
            testElement = $('<div />').width(800).appendTo($('#container')),
            columnsHeader;

        this.options.columnWidth = undefined;

        // act
        gridView.render(testElement);
        gridView.update();
        defaultOptions.columnsController.columnsChanged.fire({
            changeTypes: { columns: true, length: 1 },
            optionNames: { visibleWidth: true, length: 1 }
        });

        columnsHeader = testElement.find('table').find('tbody > tr').first().find('td');

        // assert
        assert.equal(columnsHeader.eq(0).outerWidth(), 240);
        assert.equal(columnsHeader.eq(1).outerWidth(), 200);
        assert.equal(columnsHeader.eq(2).outerWidth(), 160);
        assert.equal(columnsHeader.eq(3).outerWidth(), 200);
    });

    QUnit.test('Columns with percentage width and fixed widths when columnWidth is auto', function(assert) {
        // arrange
        var defaultOptions = {
                columnsController: new MockColumnsController([{ caption: 'Column 1', width: '30%' }, { caption: 'Column 2', width: '200px' }, { caption: 'Column 3' }, { caption: 'Column 4', width: '100px' }]),
                dataController: new MockDataController({
                    items: [{ values: ['', '', '', '', ''] }]
                })
            },
            gridView = this.createGridView(defaultOptions),
            testElement = $('<div />').width(800).appendTo($('#container')),
            columnsHeader;

        // act
        gridView.render(testElement);
        columnsHeader = testElement.find('table').find('tbody > tr').first().find('td');

        // assert
        assert.equal(columnsHeader.eq(0).outerWidth(), 240);
        assert.equal(columnsHeader.eq(1).outerWidth(), 200);
        assert.equal(columnsHeader.eq(2).outerWidth(), 260);
        assert.equal(columnsHeader.eq(3).outerWidth(), 100);
    });

    QUnit.test('Last column with percentage width. Reset last width to auto when columnWidth is not auto', function(assert) {
        // arrange
        var defaultOptions = {
                columnsController: new MockColumnsController([{ caption: 'Column 1' }, { caption: 'Column 2' }, { caption: 'Column 3' }, { caption: 'Column 4', width: '40%' }]),
                dataController: new MockDataController({
                    items: [{ values: ['', '', '', '', ''] }]
                })
            },
            gridView = this.createGridView(defaultOptions),
            testElement = $('<div />').width(1000).appendTo($('#container')),
            columnsHeader;

        this.options.columnWidth = undefined;

        // act
        gridView.render(testElement);
        columnsHeader = testElement.find('table').find('tbody > tr').first().find('td');

        // assert
        assert.equal(columnsHeader.eq(0).outerWidth(), 200);
        assert.equal(columnsHeader.eq(1).outerWidth(), 200);
        assert.equal(columnsHeader.eq(2).outerWidth(), 200);
        assert.equal(columnsHeader.eq(3).outerWidth(), 400);
    });

    // T172783
    QUnit.test("Columns synchronize with visibleWidth", function(assert) {
        // arrange
        var that = this,
            defaultOptions = {
                columnsController: new MockColumnsController([{ caption: 'Column 1' }, { caption: 'Column 2', visibleWidth: 30 }, { caption: 'Column 3' }, { caption: 'Column 4' }, { caption: 'Column 5' }]),
                dataController: new MockDataController({
                    items: [{ values: ['', '', '', '', ''] }]
                })
            },
            gridView = that.createGridView(defaultOptions),
            testElement = $('<div />').width(340).appendTo($('#container'));

        that.columnsController.endUpdate = function() {
            this.columnsChanged.fire({
                changeTypes: { columns: true, length: 1 },
                optionNames: { visibleWidth: true, length: 1 }
            });
        };

        // act
        gridView.render(testElement);
        gridView.update();

        // assert
        assert.ok(that.rowsView._getTableElement().find("td").eq(1).outerWidth(true) > 30, "width second column");
    });

    QUnit.test('Columns synchronize with groupPanel', function(assert) {
        // arrange
        var defaultOptions = {
                columnsController: new MockColumnsController([{ caption: 'Column 1', width: '20px' }, { caption: 'Column 2', width: '50px' }, { caption: 'Column 3', width: '50px' }, { caption: 'Column 4', width: '50px' }, { caption: 'Column 5', width: '20px' }]),
                dataController: new MockDataController({
                    items: [{ values: ['', '', '', '', ''] }]
                })
            },
            gridView = this.createGridView(defaultOptions),
            testElement = $('<div />').width(340).appendTo($('#container')),
            columnsHeader;

        // act
        gridView.render(testElement);
        gridView.update();
        defaultOptions.columnsController.columnsChanged.fire({
            changeTypes: { columns: true, length: 1 },
            optionNames: { visibleWidth: true, length: 1 }
        });
        columnsHeader = testElement.find('table').find('tbody > tr').first().find('td');
        testElement.find('col').eq(2).width(20);

        // assert
        assert.equal(columnsHeader.eq(2).outerWidth(), 20);

        // act
        gridView.getController("columns").columnsChanged.fire({
            changeTypes: { grouping: true, length: 1 },
            optionNames: { length: 0 }
        });
        gridView._dataController.changed.fire({
            changeType: 'refresh'
        });

        columnsHeader = testElement.find('table').find('tbody > tr').first().find('td');

        // assert
        assert.equal(columnsHeader.eq(0).outerWidth(), 20);
        assert.equal(columnsHeader.eq(1).outerWidth(), 50);
        assert.equal(columnsHeader.eq(2).outerWidth(), 50);
        assert.equal(columnsHeader.eq(3).outerWidth(), 50);
        assert.equal(columnsHeader.eq(4).outerWidth(), 170);
    });

    QUnit.test('Columns with fixed widths when they total width is more than the width of container and columnWidth is auto', function(assert) {
        // arrange
        var defaultOptions = {
                columnsController: new MockColumnsController([{ caption: 'Column 1', width: 500 }, { caption: 'Column 2', width: 500 }]),
                dataController: new MockDataController({
                    items: [{ values: [''] }]
                })
            },
            gridView = this.createGridView(defaultOptions),
            testElement = $('<div />').width(300).appendTo($('#container')),
            columnsHeader;

        // act
        gridView.render(testElement);
        columnsHeader = testElement.find('table').find('tbody > tr').first().find('td');

        // assert
        assert.equal(columnsHeader.eq(0).outerWidth(), 500);
        assert.equal(columnsHeader.eq(1).outerWidth(), 500);
    });

    QUnit.test('Columns with fixed widths when they total width is more than the width of container and columnWidth is not auto', function(assert) {
        // arrange
        var defaultOptions = {
                columnsController: new MockColumnsController([{ caption: 'Column 1', width: 500 }, { caption: 'Column 2', width: 500 }]),
                dataController: new MockDataController({
                    items: [{ values: [''] }]
                })
            },
            gridView = this.createGridView(defaultOptions),
            testElement = $('<div />').width(300).appendTo($('#container')),
            columnsHeader;

        // act
        this.options.columnWidth = undefined;
        gridView.render(testElement);
        columnsHeader = testElement.find('table').find('tbody > tr').first().find('td');

        // assert
        assert.equal(columnsHeader.eq(0).outerWidth(), 500);
        assert.equal(columnsHeader.eq(1).outerWidth(), 500);
    });

    QUnit.test('Scrolling with columnWidth auto', function(assert) {
        // arrange
        var defaultOptions = {
                columnsController: new MockColumnsController([
                { caption: 'Column 1', width: '120px' },
                    {
                        caption: 'Column 2', width: '130px', cellTemplate: function(container, options) {
                            $(container).append('<div style="width: 130px" />');
                            $(container).css('padding', 0);
                        }
                    }, { caption: 'Big Big Big Column Title' }, { caption: 'Column 4' }]),
                dataController: new MockDataController({
                    items: [{ values: ['Test Test Test', 'Test', 'Test Test', 'Test Test Test Test Test Test'] }]
                })
            },
            gridView = this.createGridView(defaultOptions, { columnAutoWidth: true }),
            testElement = $('<div />').width(300).appendTo($('#container')),
            bigBigColumnTitleWidth,
            rowsHeader,
            columnsHeader;

        // act
        gridView.render(testElement);
        gridView.update();
        defaultOptions.columnsController.columnsChanged.fire({
            changeTypes: { columns: true, length: 1 },
            optionNames: { visibleWidth: true, length: 1 }
        });
        columnsHeader = testElement.find('table').eq(0).find('tbody > tr').first().find('td');
        rowsHeader = testElement.find('table').eq(1).find('tbody > tr').first().find('td');
        bigBigColumnTitleWidth = testElement.find('table').eq(0).find('tbody > tr').first().find('td').eq(2).children().width();

        // assert
        assert.ok(testElement.find('.dx-scrollable-content').children().width() > 300, 'horizontal scroller is shown');
        assert.equal(columnsHeader.eq(0).outerWidth(), 120);
        assert.equal(rowsHeader.eq(0).outerWidth(), 120);
        assert.equal(columnsHeader.eq(1).outerWidth(), 130);
        assert.equal(rowsHeader.eq(1).outerWidth(), 130);
        assert.equal(columnsHeader.eq(2).outerWidth(), rowsHeader.eq(2).outerWidth());
        assert.ok(columnsHeader.eq(2).outerWidth() > bigBigColumnTitleWidth);
    });

    // T396615
    QUnit.test('Scrollable content have no width when there is horizontal scrollbar', function(assert) {
        // arrange
        var defaultOptions = {
                columnsController: new MockColumnsController([
                    { caption: 'Column 1', width: 150 },
                    { caption: 'Column 2', width: 150 },
                    { caption: 'Big Big Big Column Title', width: 100 },
                    { caption: 'Column 4', width: 200 }]),
                dataController: new MockDataController({
                    items: [{ values: ['Test Test Test', 'Test', 'Test Test', 'Test Test Test Test Test Test'] }]
                })
            },
            scrollable,
            gridView = this.createGridView(defaultOptions),
            $testElement = $('<div />').width(300).appendTo($('#container'));

        // act
        gridView.render($testElement);
        gridView.resize();

        // assert
        scrollable = $testElement.find(".dx-datagrid-rowsview").dxScrollable("instance");
        assert.strictEqual(scrollable.$content()[0].style.width, "", "no width in scrollable content");
    });

    QUnit.test('Scrollable content without width when there is no horizontal scrollbar', function(assert) {
        // arrange
        var defaultOptions = {
                columnsController: new MockColumnsController([
                    { caption: 'Column 1', width: 150 },
                    { caption: 'Column 2', width: 150 },
                    { caption: 'Big Big Big Column Title', width: 100 },
                    { caption: 'Column 4', width: 200 }]),
                dataController: new MockDataController({
                    items: [{ values: ['Test Test Test', 'Test', 'Test Test', 'Test Test Test Test Test Test'] }]
                })
            },
            scrollable,
            gridView = this.createGridView(defaultOptions),
            $testElement = $('<div />').appendTo($('#container'));

        // act
        gridView.render($testElement);
        gridView.resize();

        // assert

        scrollable = $testElement.find(".dx-datagrid-rowsview").dxScrollable("instance");
        assert.strictEqual(scrollable.$content()[0].style.width, "", "width of the scrollable content");
    });

    QUnit.test('Scroll position headers and container with columnWidth auto', function(assert) {
        // arrange
        var done = assert.async();
        var defaultOptions = {
                columnsController: new MockColumnsController([{ caption: 'Column 1', width: 500 }, { caption: 'Column 2', width: 500 }]),
                dataController: new MockDataController({
                    items: [{ values: [''] }]
                })
            },
            gridView = this.createGridView(defaultOptions),
            $scrollContainer,
            testElement = $('<div />').width(300).appendTo($('#container'));

        // act
        gridView.render(testElement);

        testElement.find('.dx-scrollable-container').scroll(function() {
            // assert
            assert.ok(testElement.find('.dx-scrollable-content').children().width() > 300, 'horizontal scroller is shown');

            $scrollContainer = testElement.find(".dx-datagrid-scroll-container");
            assert.equal($scrollContainer.length, 1, "scroll containers count");
            assert.equal($scrollContainer.eq(0).scrollLeft(), 100);
            assert.equal($scrollContainer.eq(0).scrollLeft(), testElement.find('.dx-scrollable-container').scrollLeft());
            done();
        });

        testElement.find('.dx-scrollable-container').scrollLeft(100);
    });

    // T389309
    QUnit.test('Scroll position headers when rtl mode is enabled', function(assert) {
        // arrange
        var done = assert.async(),
            defaultOptions = {
                columnsController: new MockColumnsController([{ caption: 'Column 1', width: 500 }, { caption: 'Column 2', width: 500 }]),
                dataController: new MockDataController({
                    items: [{ values: [''] }]
                })
            },
            gridView = this.createGridView(defaultOptions),
            $scrollContainer,
            $testElement = $('<div />').width(300).addClass("dx-rtl").appendTo($('#container'));

        // act
        gridView.render($testElement);

        $testElement.find('.dx-scrollable-container').scroll(function() {
            // assert
            assert.ok($testElement.find('.dx-scrollable-content').children().width() > 300, 'horizontal scroller is shown');

            $scrollContainer = $testElement.find('.dx-datagrid-scroll-container').first();
            assert.equal($scrollContainer.scrollLeft(), 250);
            assert.equal($scrollContainer.scrollLeft(), $testElement.find('.dx-scrollable-container').scrollLeft());
            assert.equal(Math.round($scrollContainer.find(".dx-datagrid-table").position().left), -250, "left position of the table");
            done();
        });

        $testElement.find('.dx-scrollable-container').scrollLeft(250);
    });

    QUnit.test('Scroll position summary footer and container with columnWidth auto', function(assert) {
        // arrange
        var done = assert.async();
        var defaultOptions = {
                columnsController: new MockColumnsController([{ caption: 'Column 1', width: 500 }, { caption: 'Column 2', width: 500 }]),
                dataController: new MockDataController({
                    items: [{ values: [''] }],
                    totalItem: {
                        summaryCells: [
                            { summaryType: "count", value: 100 },
                            { summaryType: "min", value: 0 },
                            { summaryType: "max", value: 120001 }
                        ]
                    }
                })
            },
            gridView = this.createGridView(defaultOptions),
            $scrollContainer,
            testElement = $('<div />').width(300).appendTo($('#container'));

        // act
        gridView.render(testElement);

        testElement.find('.dx-scrollable-container').scroll(function() {
            // assert
            assert.ok(testElement.find('.dx-scrollable-content').children().width() > 300, 'horizontal scroller is shown');

            $scrollContainer = testElement.find('.dx-datagrid-total-footer .dx-datagrid-scroll-container');
            assert.equal($scrollContainer.length, 1, "scroll containers count");
            assert.equal($scrollContainer.eq(0).scrollLeft(), 100);
            assert.equal($scrollContainer.eq(0).scrollLeft(), testElement.find('.dx-scrollable-container').scrollLeft());
            done();
        });

        testElement.find('.dx-scrollable-container').scrollLeft(100);
    });

    // T389309
    QUnit.test('Scroll position summary footer when rtl mode is enabled', function(assert) {
        // arrange
        var done = assert.async();
        var defaultOptions = {
                columnsController: new MockColumnsController([{ caption: 'Column 1', width: 500 }, { caption: 'Column 2', width: 500 }]),
                dataController: new MockDataController({
                    items: [{ values: [''] }],
                    totalItem: {
                        summaryCells: [
                        { summaryType: "count", value: 100 },
                        { summaryType: "min", value: 0 },
                        { summaryType: "max", value: 120001 }
                        ]
                    }
                })
            },
            gridView = this.createGridView(defaultOptions),
            $scrollContainer,
            $testElement = $('<div />').width(300).addClass("dx-rtl").appendTo($('#container'));

        // act
        gridView.render($testElement);

        $testElement.find('.dx-scrollable-container').scroll(function() {
            // assert
            assert.ok($testElement.find('.dx-scrollable-content').children().width() > 300, 'horizontal scroller is shown');

            $scrollContainer = $testElement.find('.dx-datagrid-total-footer .dx-datagrid-scroll-container').first();
            assert.equal($scrollContainer.scrollLeft(), 250);
            assert.equal($scrollContainer.scrollLeft(), $testElement.find('.dx-scrollable-container').scrollLeft());
            assert.equal(Math.round($scrollContainer.find(".dx-datagrid-table").position().left), -250, "left position of the table");
            done();
        });

        $testElement.find('.dx-scrollable-container').scrollLeft(250);
    });

    // B254644
    QUnit.test('Change sorting after horizontal scrolling', function(assert) {
        // arrange
        var done = assert.async();
        var defaultOptions = {
                columnsController: new MockColumnsController([{ caption: 'Column 1', width: 500, allowSorting: true }, { caption: 'Column 2', width: 500, allowSorting: true }]),
                dataController: new MockDataController({
                    items: [{ values: [''] }]
                })
            },
            gridView = this.createGridView(defaultOptions),
            testElement = $('<div />').width(300).appendTo($('#container'));


        gridView.render(testElement);

        testElement.find('.dx-scrollable-container').scroll(function() {
            // assert
            assert.equal(testElement.find('.dx-datagrid-scroll-container').scrollLeft(), 400, 'headers scroll left');
            assert.equal(testElement.find('.dx-datagrid-scroll-container').scrollLeft(), testElement.find('.dx-scrollable-container').scrollLeft(), 'headers scroll left = scrollable scroll left');

            // act
            gridView.getController("columns").changeSortOrder(1);

            // assert
            assert.equal(testElement.find('.dx-datagrid-scroll-container').scrollLeft(), 400, 'headers scroll left');
            done();
        });

        testElement.find('.dx-scrollable-container').scrollLeft(400);
    });

    // B250043
    QUnit.test('Scroll container with columnWidth auto when no column headers', function(assert) {
        // arrange
        var defaultOptions = {
                columnsController: new MockColumnsController([{ caption: 'Column 1', width: 500 }, { caption: 'Column 2', width: 500 }]),
                dataController: new MockDataController({
                    items: [{ values: [''] }]
                })
            },
            gridView = this.createGridView(defaultOptions),
            testElement = $('<div />').width(300).appendTo($('#container'));

        this.options.showColumnHeaders = false;
        // act
        gridView.render(testElement);
        testElement.find('.dx-scrollable-container').scrollLeft(100);

        // assert
        assert.ok(!testElement.find('.dx-datagrid-scroll-container').length, 'no column headers');
        assert.ok(testElement.find('.dx-scrollable-content').children().width() > 300, 'horizontal scroller is shown');

        this.clock.tick();
        assert.equal(testElement.find('.dx-scrollable-container').scrollLeft(), 100);
    });

    QUnit.test('Columns without fixed widths and columnWidth is auto', function(assert) {
        // arrange
        var defaultOptions = {
                columnsController: new MockColumnsController([{ caption: "Column 1", groupIndex: 0, allowCollapsing: true, command: "expand", cssClass: "dx-command-expand", width: "auto" }, { width: "auto", command: "expand", cssClass: "dx-command-expand" }, { caption: "Column 2" }, { caption: "Column 3" }, { caption: "Column 4" }]),
                dataController: new MockDataController({
                    items: [{ rowType: 'group', groupIndex: 0, isExpanded: true, values: ["test1"] }, { values: [null, false, 'test2', 'test3', 'test4'] }]
                })
            },
            gridView,
            testElement = $('#container'),
            colWidths = 0,
            totalWidths = 0;

        // act
        this.options.headerFilter = {
            visible: true
        };
        this.options.showColumnLines = true;
        gridView = this.createGridView(defaultOptions, this.options),
        gridView.render(testElement);
        gridView.update();
        defaultOptions.columnsController.columnsChanged.fire({
            changeTypes: { columns: true, length: 1 },
            optionNames: { visibleWidth: true, length: 1 }
        });

        $.each(gridView.getView("rowsView").element().find("col"), function(_, col) {
            colWidths += $(col).width();
        });

        var $row = gridView.getView("rowsView").element().find("tbody > tr").eq(1);

        $.each($row.find("td"), function(_, td) {
            totalWidths += $(td).outerWidth(true);
        });

        // assert
        assert.roughEqual(colWidths, totalWidths, 0.1, "synchronize widths by columns");
    });

    QUnit.test("Disable the bestFit mode before correctColumnWidths", function(assert) {
        // arrange
        var defaultOptions = {
                columnsController: new MockColumnsController([{ caption: 'Column 1' }, { caption: 'Column 2' }, { caption: 'Column 3' }]),
                dataController: new MockDataController({
                    items: [{ values: [10, 12, 'test 1'] }]
                })
            },
            gridView = this.createGridView(defaultOptions, { columnAutoWidth: true }),
            testElement = $('<div />').width(300).appendTo($('#container'));

        var stub = sinon.stub(this.resizingController, "_correctColumnWidths", function() {
            var $tables = gridView.element().find(".dx-datagrid-table");
            assert.ok($tables.hasClass("dx-datagrid-table-fixed"), "the best fit mode is disabled");
        });

        // act
        gridView.render(testElement);
        gridView.update();

        // assert
        assert.ok(stub.calledOnce);
    });

    // T604970
    QUnit.test("Column widths should be correctly updated when all columns have minWidth and the grid has a small width", function(assert) {
        // arrange
        var $colElements,
            gridView = this.createGridView({}, {
                columns: [
                    { caption: "Column 1", minWidth: 100 },
                    { caption: "Column 2", minWidth: 50 },
                    { caption: "Column 3", minWidth: 30 },
                    { caption: "Column 4", minWidth: 70 },
                    { caption: "Column 5", minWidth: 150 }
                ]
            }),
            $testElement = $("<div />").width(250).appendTo($("#container"));

        // act
        gridView.render($testElement);
        gridView.update();

        // assert
        $colElements = $testElement.find(".dx-datagrid-headers").find("col");

        assert.strictEqual($colElements.get(0).style.width, "100px", "width of a first column");
        assert.strictEqual($colElements.get(1).style.width, "50px", "width of a second column");
        assert.strictEqual($colElements.get(2).style.width, "30px", "width of a third column");
        assert.strictEqual($colElements.get(3).style.width, "70px", "width of a fourth column");
        assert.strictEqual($colElements.get(4).style.width, "150px", "width of a fifth column");
    });

    // T604970
    QUnit.test("Column widths should be correctly updated when all columns have minWidth and the grid has a large width", function(assert) {
        // arrange
        var $colElements,
            gridView = this.createGridView({}, {
                columns: [
                    { caption: "Column 1", minWidth: 100 },
                    { caption: "Column 2", minWidth: 50 },
                    { caption: "Column 3", minWidth: 20 },
                    { caption: "Column 4", minWidth: 70 },
                    { caption: "Column 5", minWidth: 150 }
                ]
            }),
            $testElement = $("<div />").width(400).appendTo($("#container"));

        // act
        gridView.render($testElement);
        gridView.update();

        // assert
        $colElements = $testElement.find(".dx-datagrid-headers").find("col");

        assert.strictEqual($colElements.get(0).style.width, "100px", "width of a first column");
        assert.strictEqual($colElements.get(1).style.width, "50px", "width of a second column");
        assert.strictEqual($colElements.get(2).style.width, "auto", "width of a third column");
        assert.strictEqual($colElements.get(3).style.width, "70px", "width of a fourth column");
        assert.strictEqual($colElements.get(4).style.width, "150px", "width of a fifth column");
    });
}());

// Fixed columns///
(function() {
    QUnit.module('Fixed columns', {
        beforeEach: function() {
            this.defaultOptions = {
                columnsController: new MockColumnsController([]),
                dataController: new MockDataController({
                    pageCount: 1,
                    pageIndex: 0,
                    items: [{ values: {} }]
                })
            };
            this.createGridView = createGridView;
        }
    });

    if(devices.real().deviceType === "desktop") {
        QUnit.test("Draw grid view with a native scrolling", function(assert) {
            // arrange
            this.defaultOptions.columnsController = new MockColumnsController([
                { caption: 'Column 1', width: 100, fixed: true },
                { caption: 'Column 2', width: 100 },
                { caption: 'Column 3', width: 100 },
                { caption: 'Column 4', width: 100, fixed: true }]);
            this.defaultOptions.dataController.items = function() {
                return [{ values: [1, 2, 'test 1', 15], rowType: "data" },
                        { values: [3, 4, 'test 2', 16], rowType: "data" },
                        { values: [5, 6, 'test 3', 17], rowType: "data" },
                        { values: [7, 8, 'test 4', 18], rowType: "data" },
                        { values: [9, 10, 'test 5', 19], rowType: "data" },
                        { values: [11, 12, 'test 6', 20], rowType: "data" },
                        { values: [13, 14, 'test 7', 21], rowType: "data" }];
            };

            var gridView = this.createGridView(this.defaultOptions, {
                    scrolling: {
                        useNative: true
                    }
                }),
                fixedContent,
                testElement = $('#container').width(300).height(200);

            // act
            gridView.render(testElement);
            gridView.update();

            // assert
            fixedContent = testElement.find(".dx-datagrid-rowsview").children(".dx-datagrid-content-fixed");
            assert.ok(parseFloat(fixedContent.css("margin-right")) > 0, "margin right in fixed content");
            assert.ok(parseFloat(fixedContent.css("marginBottom")) > 0, "margin bottom in fixed content");
            fixedContent = testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed");
            assert.ok(parseFloat(fixedContent.css("paddingRight")) > 0, "padding right in fixed content");
        });
    }

    // T381435
    QUnit.test("Set column widths when there isn't scroll", function(assert) {
        // arrange
        this.defaultOptions = {};

        var gridView = this.createGridView(this.defaultOptions, {
                columns: [
                    {
                        caption: "Column 1", fixed: true, allowFixing: true
                    },
                    {
                        caption: "Column 2", allowFixing: true
                    },
                    {
                        caption: "Column 3", allowFixing: true, width: 100
                    }
                ]
            }),
            $colElements,
            $testElement = $('#container');

        // act
        gridView.render($testElement);
        gridView.update();
        gridView.resize();

        $colElements = $testElement.find(".dx-datagrid-headers").children(".dx-datagrid-content-fixed").find("col");

        // assert
        assert.equal($colElements.length, 3, "count col");
        assert.notOk($colElements.eq(0).attr("style"), "width of the first col");
        assert.notOk($colElements.eq(1).attr("style"), "width of the second col");
        assert.strictEqual($colElements.eq(2).attr("style"), "width: 100px;", "width of the third col");
    });
}());
