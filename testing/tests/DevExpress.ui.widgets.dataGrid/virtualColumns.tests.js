import $ from "jquery";
import dataGridMocks from "../../helpers/dataGridMocks.js";
import "ui/data_grid/ui.data_grid";
import "common.css!";
import { DataSource } from "data/data_source/data_source";

var setupModule = function() {
    var columns = [];

    for(var i = 1; i <= 50; i++) {
        columns.push({ dataField: "field" + i });
    }

    this.columns = columns;

    this.setupModules = function(options) {
        dataGridMocks.setupDataGridModules(this, ['columns', 'data', 'selection', 'editing', 'masterDetail', 'columnFixing', 'virtualColumns'], {
            initDefaultOptions: true,
            controllers: {
                data: new dataGridMocks.MockDataController({ items: [] })
            },
            options: options
        });
    };

    this.setupVirtualColumns = function(options) {
        this.setupModules($.extend(true, {
            scrolling: {
                columnRenderingMode: "virtual"
            },
            width: 400,
            columnWidth: 50,
            columns: this.columns
        }, options));
    };

    this.getColumns = function(parameterNames) {
        return this.columnsController.getColumns();
    };

    this.getFixedColumns = function(parameterNames) {
        return this.columnsController.getFixedColumns();
    };
};

var teardownModule = function() {
    this.dispose();
};

QUnit.module("initialization", { beforeEach: setupModule, afterEach: teardownModule });

QUnit.test("virtual column rendering is disabled by default", function(assert) {

    this.setupModules({
        width: 400,
        columnWidth: 50,
        columns: this.columns
    });

    assert.strictEqual(this.getColumns().length, 50, "column count");
    assert.strictEqual(this.getVisibleColumns().length, 50, "visible column count");
});

QUnit.test("Enable virtual column rendering using columnRenderingMode option", function(assert) {
    this.setupVirtualColumns();

    assert.strictEqual(this.getColumns().length, 50, "column count");
    assert.strictEqual(this.getVisibleColumns().length, 11, "visible column count");
    assert.strictEqual(this.getVisibleColumns(0, true).length, 50, "all visible column count");
});

QUnit.test("getVisibleColumns if columns are generated by data source", function(assert) {
    this.setupVirtualColumns({
        columns: null
    });

    var dataItem = {};

    for(var i = 0; i < this.columns.length; i++) {
        dataItem[this.columns[i].dataField] = "test";
    }

    var dataSource = new DataSource([ dataItem ]);
    dataSource.load();

    this.columnsController.applyDataSource(dataSource);

    assert.strictEqual(this.getColumns().length, 50, "column count");
    assert.strictEqual(this.getVisibleColumns().length, 11, "visible column count");
    assert.strictEqual(this.getVisibleColumns(0, true).length, 50, "all visible column count");
});

QUnit.test("getVisibleColumns if zero width on initialization (Angular)", function(assert) {
    this.setupVirtualColumns({
        width: 0
    });

    this.options.width = 400;

    assert.strictEqual(this.getColumns().length, 50, "column count");
    assert.strictEqual(this.getVisibleColumns().length, 11, "visible column count");
    assert.strictEqual(this.getVisibleColumns(0, true).length, 50, "all visible column count");
});

QUnit.test("getVisibleColumns should return all visible columns if second argument is true", function(assert) {
    this.setupVirtualColumns();

    assert.strictEqual(this.getVisibleColumns().length, 11, "visible column count");
    assert.strictEqual(this.getVisibleColumns(0, true).length, 50, "all visible column count");
});

QUnit.test("Virtual column rendering if band columns are exists", function(assert) {
    this.columns.unshift({
        caption: "Band",
        columns: ["bandField1", "bandField2"]
    });

    this.setupVirtualColumns();

    assert.strictEqual(this.getColumns().length, 53, "column count");
    assert.strictEqual(this.getVisibleColumns().length, 11, "visible column count");
    assert.strictEqual(this.getVisibleColumns(0).length, 10, "first header row column count");
    assert.strictEqual(this.getVisibleColumns(0)[9].command, "virtual", "first header row last column");
    assert.strictEqual(this.getVisibleColumns(1).length, 3, "second header row column count");
    assert.strictEqual(this.getVisibleColumns(1)[2].command, "virtual", "second header row last column");
    assert.strictEqual(this.getVisibleColumns(0)[0].colspan, 2, "band colspan");
    assert.strictEqual(this.getVisibleColumns(0)[1].rowspan, 2, "non-band rowspan");
    assert.strictEqual(this.getVisibleColumns(1)[0].colspan, undefined, "band child colspan");
    assert.strictEqual(this.getVisibleColumns(1)[0].rowspan, undefined, "band child rowspan");
});

QUnit.test("Virtual column rendering if band columns and fixed columns at left are exists", function(assert) {
    this.columns.unshift({
        caption: "Band",
        fixed: true,
        columns: ["bandField1", "bandField2"]
    });

    this.setupVirtualColumns();

    assert.strictEqual(this.getColumns().length, 53, "column count");
    assert.deepEqual(this.getFixedColumns().map(function(column) {
        return column.dataField || column.command;
    }), ["bandField1", "bandField2", "transparent"], "fixed columns");
    assert.strictEqual(this.getFixedColumns()[2].colspan, 9, "transparent column colspan");
    assert.strictEqual(this.getVisibleColumns().length, 11, "visible column count");

    assert.deepEqual(this.getVisibleColumns(0).map(function(column) {
        return column.caption || column.command;
    }), ["Band", "Field 1", "Field 2", "Field 3", "Field 4", "Field 5", "Field 6", "Field 7", "Field 8", "virtual"], "first header row columns");

    assert.deepEqual(this.getVisibleColumns(0).map(function(column) {
        return column.colspan;
    }), [2, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], "first header row colspans");

    assert.deepEqual(this.getVisibleColumns(0).map(function(column) {
        return column.rowspan;
    }), [undefined, 2, 2, 2, 2, 2, 2, 2, 2, undefined], "first header row rowspans");

    assert.deepEqual(this.getVisibleColumns(1).map(function(column) {
        return column.caption || column.command;
    }), ["Band Field 1", "Band Field 2", "virtual"], "second header row columns");
});

QUnit.test("Virtual column rendering if band columns and fixed columns at left are exists and scroll position at middle", function(assert) {
    this.columns.unshift({
        caption: "Band",
        fixed: true,
        columns: ["bandField1", "bandField2"]
    });

    this.setupVirtualColumns();
    this.columnsController.setScrollPosition(50 * 25 - 400 / 2);

    assert.strictEqual(this.getColumns().length, 53, "column count");
    assert.deepEqual(this.getFixedColumns().map(function(column) {
        return column.caption || column.command;
    }), ["Band Field 1", "Band Field 2", "transparent"], "fixed columns");
    assert.strictEqual(this.getFixedColumns()[2].colspan, 12, "transparent column colspan");
    assert.strictEqual(this.getVisibleColumns().length, 14, "visible column count");

    assert.deepEqual(this.getVisibleColumns(0).map(function(column) {
        return column.caption || column.command;
    }), ["Band", "virtual", "Field 19", "Field 20", "Field 21", "Field 22", "Field 23", "Field 24", "Field 25", "Field 26", "Field 27", "Field 28", "virtual"], "first header row columns");

    assert.deepEqual(this.getVisibleColumns(0).map(function(column) {
        return column.colspan;
    }), [2, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], "first header row colspans");

    assert.deepEqual(this.getVisibleColumns(0).map(function(column) {
        return column.rowspan;
    }), [undefined, undefined, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, undefined], "first header row rowspans");

    assert.deepEqual(this.getVisibleColumns(1).map(function(column) {
        return column.caption || column.command;
    }), ["Band Field 1", "Band Field 2", "virtual", "virtual"], "second header row columns");
});

QUnit.test("Virtual column rendering if band columns and fixed columns at right are exists", function(assert) {
    this.columns.unshift({
        caption: "Band",
        fixed: true,
        fixedPosition: "right",
        columns: ["bandField1", "bandField2"]
    });

    this.setupVirtualColumns();

    assert.strictEqual(this.getColumns().length, 53, "column count");
    assert.deepEqual(this.getFixedColumns().map(function(column) {
        return column.dataField || column.command;
    }), ["transparent", "bandField1", "bandField2"], "fixed columns");
    assert.strictEqual(this.getFixedColumns()[0].colspan, 11, "transparent column colspan");
    assert.strictEqual(this.getVisibleColumns().length, 13, "visible column count");

    assert.deepEqual(this.getVisibleColumns(0).map(function(column) {
        return column.caption || column.command;
    }), ["Field 1", "Field 2", "Field 3", "Field 4", "Field 5", "Field 6", "Field 7", "Field 8", "Field 9", "Field 10", "virtual", "Band"], "first header row columns");

    assert.deepEqual(this.getVisibleColumns(0).map(function(column) {
        return column.colspan;
    }), [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 2], "first header row colspans");

    assert.deepEqual(this.getVisibleColumns(0).map(function(column) {
        return column.rowspan;
    }), [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, undefined, undefined], "first header row rowspans");

    assert.deepEqual(this.getVisibleColumns(1).map(function(column) {
        return column.caption || column.command;
    }), ["virtual", "Band Field 1", "Band Field 2"], "second header row columns");
});

QUnit.test("virtual column is not exists if columns count are small", function(assert) {
    this.columns = this.columns.slice(0, 10);

    this.setupVirtualColumns();

    assert.strictEqual(this.getVisibleColumns().length, 10, "visible column count");
    assert.strictEqual(this.getVisibleColumns().filter(column => column.command).length, 0, "no command columns");
});

QUnit.test("visible column count should be less if one column have big width", function(assert) {
    this.columns[0].width = 200;

    this.setupVirtualColumns();

    assert.strictEqual(this.getVisibleColumns().length, 6, "visible column count");
    assert.strictEqual(this.getVisibleColumns()[5].command, "virtual", "virtual column is added to end");
    assert.strictEqual(this.getVisibleColumns()[5].width, 50 * 45, "virtual column width");
});

QUnit.test("visible columns if visibleWidth option is defined in columns", function(assert) {
    this.columns.forEach(column => {
        column.visibleWidth = 100;
    });

    this.setupVirtualColumns();

    assert.strictEqual(this.getVisibleColumns().length, 6, "visible column count");
    assert.strictEqual(this.getVisibleColumns()[5].command, "virtual", "virtual column is added to end");
    assert.strictEqual(this.getVisibleColumns()[5].width, 100 * 45, "virtual column width");
});

QUnit.test("visible columns if command column is fixed and visible", function(assert) {

    this.setupVirtualColumns({
        selection: { mode: "multiple" },
        columnFixing: { enabled: true }
    });

    this.columnsController.reset();

    assert.strictEqual(this.getVisibleColumns().length, 11, "visible column count");
    assert.strictEqual(this.getVisibleColumns()[0].command, "select", "select column is added to end");
    assert.strictEqual(this.getVisibleColumns()[1].dataField, "field1", "data column is added after select");
    assert.strictEqual(this.getVisibleColumns()[10].command, "virtual", "virtual column is added to end");
    assert.strictEqual(this.getVisibleColumns()[10].width, 50 * 41, "virtual column width");
});

QUnit.module("Scrolling", { beforeEach: setupModule, afterEach: teardownModule });

QUnit.test("virtual column location if scroll position at begin", function(assert) {
    this.setupVirtualColumns();

    assert.strictEqual(this.getVisibleColumns().length, 11, "visible column count");
    assert.strictEqual(this.getVisibleColumns()[10].command, "virtual", "virtual column is added to end");
    assert.strictEqual(this.getVisibleColumns()[10].width, 50 * 40, "virtual column width");
});

QUnit.test("virtual column location if scroll position at end", function(assert) {
    this.setupVirtualColumns();
    this.columnsController.setScrollPosition(50 * 50 - 400);

    assert.strictEqual(this.getVisibleColumns().length, 11, "visible column count");
    assert.strictEqual(this.getVisibleColumns()[0].command, "virtual", "virtual column is added to begin");
    assert.strictEqual(this.getVisibleColumns()[0].width, 50 * 40, "virtual column width");
});

QUnit.test("virtual column location if scroll position at middle", function(assert) {
    this.setupVirtualColumns();
    this.columnsController.setScrollPosition(50 * 25 - 400 / 2);

    assert.strictEqual(this.getVisibleColumns().length, 12, "visible column count");
    assert.strictEqual(this.getVisibleColumns().filter(column => column.command).length, 2, "two command columns are added");
    assert.strictEqual(this.getVisibleColumns()[0].command, "virtual", "virtual column is added to begin");
    assert.strictEqual(this.getVisibleColumns()[0].width, 1000, "virtual column width");
    assert.strictEqual(this.getVisibleColumns()[11].command, "virtual", "virtual column is added to end");
    assert.strictEqual(this.getVisibleColumns()[11].width, 1000, "virtual column width");
});


QUnit.test("virtual column location if scroll position at begin with fixed columns", function(assert) {
    this.columns[0].fixed = true;
    this.columns[1].fixed = true;
    this.columns[1].fixedPosition = "right";
    this.setupVirtualColumns();

    assert.strictEqual(this.getVisibleColumns().length, 12, "visible column count");
    assert.strictEqual(this.getVisibleColumns()[0].dataField, "field1", "fixed column is added to end");
    assert.strictEqual(this.getVisibleColumns()[1].dataField, "field3", "fixed column is added to end");
    assert.strictEqual(this.getVisibleColumns()[10].command, "virtual", "virtual column is added to end");
    assert.strictEqual(this.getVisibleColumns()[11].dataField, "field2", "fixed column is added to end");
});

QUnit.test("virtual column location if scroll position at end with fixed columns", function(assert) {
    this.columns[0].fixed = true;
    this.columns[1].fixed = true;
    this.columns[1].fixedPosition = "right";
    this.setupVirtualColumns();
    this.columnsController.setScrollPosition(50 * 50 - 400);

    assert.strictEqual(this.getVisibleColumns().length, 12, "visible column count");
    assert.strictEqual(this.getVisibleColumns()[0].dataField, "field1", "fixed column is added to begin");
    assert.strictEqual(this.getVisibleColumns()[1].command, "virtual", "virtual column is added to begin");
    assert.strictEqual(this.getVisibleColumns()[1].width, 50 * 39, "virtual column width");
    assert.strictEqual(this.getVisibleColumns()[10].dataField, "field50", "last non-fixed column");
    assert.strictEqual(this.getVisibleColumns()[11].dataField, "field2", "fixed column is added to begin");
});

QUnit.test("virtual column location if scroll position at middle with fixed columns", function(assert) {
    this.columns[0].fixed = true;
    this.columns[1].fixed = true;
    this.columns[1].fixedPosition = "right";
    this.setupVirtualColumns();
    this.columnsController.setScrollPosition(50 * 25 - 400 / 2);

    assert.strictEqual(this.getVisibleColumns().length, 14, "visible column count");
    assert.strictEqual(this.getVisibleColumns().filter(column => column.command).length, 2, "two command columns are added");
    assert.strictEqual(this.getVisibleColumns()[0].dataField, "field1", "fixed column is added to begin");
    assert.strictEqual(this.getVisibleColumns()[1].command, "virtual", "virtual column is added to begin");
    assert.strictEqual(this.getVisibleColumns()[1].width, 50 * 19, "virtual column width");
    assert.strictEqual(this.getVisibleColumns()[12].command, "virtual", "virtual column is added to end");
    assert.strictEqual(this.getVisibleColumns()[12].width, 50 * 19, "virtual column width");
    assert.strictEqual(this.getVisibleColumns()[13].dataField, "field2", "fixed column is added to end");
});

QUnit.test("columnsChanged event should be fired during scrolling to right", function(assert) {
    var pos,
        columnsChangedPositions = [];
    this.setupVirtualColumns({ width: 420 });

    this.columnsController.columnsChanged.add(e => {
        assert.deepEqual(e, {
            optionNames: { all: true, length: 1 },
            changeTypes: { columns: true, length: 1 }
        }, "columnsChanged args");
        columnsChangedPositions.push(pos);
    });

    this.columnsController.getVisibleColumns();

    for(pos = 0; pos < 1000; pos += 10) {
        this.columnsController.setScrollPosition(pos);
        var firstColumn = this.columnsController.getVisibleColumns().slice().shift();
        var lastColumn = this.columnsController.getVisibleColumns().slice().pop();
        assert.ok(pos ? firstColumn.width : 0 <= pos, "left virtual column is outside viewport for position " + pos);
        assert.ok(lastColumn.width <= 50 * 50 - pos + 420, "last virtual column is outside viewport for position " + pos);
    }

    assert.deepEqual(columnsChangedPositions, [90, 340, 590, 840], "positions with columnsChanged");
});

QUnit.test("columnsChanged event should be fired during scrolling to left", function(assert) {
    var pos = 1000,
        columnsChangedPositions = [];
    this.setupVirtualColumns({ width: 420 });

    this.columnsController.setScrollPosition(pos);

    this.columnsController.columnsChanged.add(e => {
        assert.deepEqual(e, {
            optionNames: { all: true, length: 1 },
            changeTypes: { columns: true, length: 1 }
        }, "columnsChanged args");
        columnsChangedPositions.push(pos);
    });

    for(; pos >= 0; pos -= 10) {
        this.columnsController.setScrollPosition(pos);
        var firstColumn = this.columnsController.getVisibleColumns().slice().shift();
        var lastColumn = this.columnsController.getVisibleColumns().slice().pop();
        assert.ok(pos ? firstColumn.width : 0 <= pos, "left virtual column is outside viewport for position " + pos);
        assert.ok(lastColumn.width <= 50 * 50 - pos + 420, "last virtual column is outside viewport for position " + pos);
    }

    assert.deepEqual(columnsChangedPositions, [950, 700, 450, 200]);
});

var setupRenderingModule = function() {

    var columns = [];

    for(var i = 1; i <= 50; i++) {
        columns.push({ dataField: "field" + i });
    }

    this.columns = columns;

    this.setupModules = function(options) {
        this.$element = function() {
            return $("#container");
        };

        if(options.width) {
            this.$element().css("width", options.width);
        }

        dataGridMocks.setupDataGridModules(this, ['data', 'columns', 'columnFixing', 'rows', 'columnHeaders', 'summary', 'gridView', 'virtualScrolling', 'virtualColumns'], {
            initDefaultOptions: true,
            initViews: true,
            options: options
        });
    };

    this.setupVirtualColumns = function(options) {
        this.setupModules($.extend(true, {
            scrolling: {
                columnRenderingMode: "virtual",
                useNative: false
            },
            columnWidth: 50,
            columns: this.columns,
            dataSource: [{}]
        }, options));
    };

    this.getColumns = function(parameterNames) {
        return this.columnsController.getColumns();
    };

    this.clock = sinon.useFakeTimers();
};

var teardownRenderingModule = function() {
    this.clock.restore();
    this.dispose();
};

QUnit.testStart(function() {
    var markup = '<div id="container" class="dx-data-grid"></div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("Rendering", { beforeEach: setupRenderingModule, afterEach: teardownRenderingModule });

QUnit.test("virtualize columns by width from styles", function(assert) {
    $("#container").css("width", "200");
    this.setupVirtualColumns();

    assert.strictEqual(this.getColumns().length, 50, "column count");
    assert.strictEqual(this.getVisibleColumns().length, 6, "visible column count");
});

QUnit.test("columnHeaders scroll position during virtual scrolling", function(assert) {
    this.setupVirtualColumns({
        width: 200,
        scrolling: {
            mode: "virtual"
        },
        summary: {
            totalItems: [{ column: "field1", summaryType: "count" }]
        },
    });

    this.gridView.render($("#container"));
    this.gridView.update();

    this.clock.tick(30);

    // act
    this.getScrollable().scrollTo({ left: 200 });

    // assert
    assert.strictEqual(this.columnHeadersView.element().children().scrollLeft(), 200, "scrollLeft in headersView");
    assert.strictEqual(this.footerView.element().children().scrollLeft(), 200, "scrollLeft in footerView");
});

// T669142
QUnit.test("Column visibility update properly when columnAutoWidth=true", function(assert) {
    for(var i = 4; i < this.columns.length; i++) {
        this.columns[i].visible = false;
    }

    this.setupVirtualColumns({
        width: 700,
        columnWidth: "auto",
        "columnAutoWidth": true,
        scrolling: {
            mode: "virtual"
        }
    });

    this.gridView.render($("#container"));
    this.gridView.update();

    this.clock.tick(30);

    this.columnsController.columnOption("field5", "visible", true);
    this.columnsController.columnOption("field6", "visible", true);
    this.columnsController.columnOption("field7", "visible", true);

    // assert
    assert.strictEqual(this.columnHeadersView.element().find("tr td").length, 7);
});

QUnit.test("columns should be update on scrolling", function(assert) {
    this.setupVirtualColumns({
        width: 200
    });

    this.gridView.render($("#container"));
    this.gridView.update();

    this.clock.tick(30);

    // act
    this.getScrollable().scrollTo({ left: 400 });

    // assert
    var $cells = this.rowsView.element().find(".dx-data-row").children();
    assert.strictEqual($cells.length, 12, "cell count in data row");
    assert.strictEqual($cells.eq(0).outerWidth(), 250, "virtual cell width");
    assert.strictEqual(this.getVisibleColumns()[1].dataField, "field6", "first rendered dataField");
});

QUnit.test("columns in rtl", function(assert) {
    this.setupVirtualColumns({
        rtlEnabled: true,
        width: 200
    });

    this.gridView.render($("#container"));
    this.gridView.update();

    // act
    this.clock.tick(30);


    // assert
    var $cells = this.rowsView.element().find(".dx-data-row").children();
    assert.strictEqual($cells.length, 6, "cell count in data row");
    assert.strictEqual($cells.eq(0).outerWidth(), 50, "first cell width");
    assert.strictEqual($cells.eq(5).outerWidth(), 2250, "virtual cell width");
    assert.strictEqual(this.getVisibleColumns()[0].dataField, "field1", "first rendered dataField");
});
