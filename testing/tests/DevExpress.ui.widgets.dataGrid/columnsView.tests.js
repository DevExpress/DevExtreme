"use strict";

var $ = require("jquery");

QUnit.testStart(function() {
    var markup = '<div><div id="container" class="dx-datagrid"></div></div>';
    $("#qunit-fixture").html(markup);
});

require("common.css!");
require("ui/data_grid/ui.data_grid");

var devices = require("core/devices"),
    columnsView = require("ui/grid_core/ui.grid_core.columns_view"),
    fx = require("animation/fx"),
    dataGridMocks = require("../../helpers/dataGridMocks.js"),
    MockColumnsController = dataGridMocks.MockColumnsController,
    setupDataGridModules = dataGridMocks.setupDataGridModules;


QUnit.module('API methods', {
    beforeEach: function() {
        var that = this;
        that.widths = [100, 200, 50, 50, 200];

        that.columns = [{ caption: 'Column 1', width: that.widths[0] },
                        { caption: 'Column 2', width: that.widths[1] },
                        { caption: 'Column 3', width: that.widths[2] },
                        { caption: 'Column 4', width: that.widths[3] },
                        { caption: 'Column 5', width: that.widths[4] }];

        setupDataGridModules(that, [], {
            initViews: true,
            controllers: {
                columns: new MockColumnsController(that.columns)
            },
            views: {
                columnsView: new columnsView.ColumnsView(that)
            }
        });

        that.columnsView._tableElement = $('<table />').addClass("dx-datagrid-table").addClass("dx-datagrid-table-fixed")
            .append(that.columnsView._createColGroup(that.columns), [
                $('<tbody><tr><td><div><table><row><td></td></row></table></div></td><td></td><td></td><td></td><td></td></tr></tbody>')
            ]);

        that.columnsView._$element = $('<div/>').addClass("dx-datagrid-content").append(that.columnsView._tableElement);
        that.columnsView._$element.appendTo($('#container').width('600'));
    }
});

QUnit.test('Apply options', function(assert) {
    //arrange
    //act
    this.options.showColumnHeaders = true;

    //assert
    assert.ok(this.columnsView.option("showColumnHeaders"));
});

QUnit.test('Get column widths', function(assert) {
    //act, assert
    assert.deepEqual(this.columnsView.getColumnWidths(), this.widths);
});

//T208053
QUnit.test('Get column widths during css animation', function(assert) {
    var done = assert.async();

    var that = this;

    //act
    fx.animate('#container', {
        type: 'pop',
        duration: 50,
        complete: function() {
            done();
        }
    });

    //assert
    assert.deepEqual(that.columnsView.getColumnWidths(), that.widths);
});

QUnit.test('Get column widths with group row', function(assert) {
    //arrange
    this.columnsView.element().find('table').prepend($('<tr class = "dx-group-row"><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr>'));

    //act, assert
    assert.deepEqual(this.columnsView.getColumnWidths(), this.widths);
});

//T308596
QUnit.test('Get column widths with detail row (editForm)', function(assert) {
    //arrange
    this.columnsView.element().find('table').prepend($('<tr class="dx-master-detail-row"><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr>'));

    //act, assert
    assert.deepEqual(this.columnsView.getColumnWidths(), this.widths);
});

QUnit.test('Set column widths', function(assert) {
    //arrange
    var that = this,
        newWidths = [250, 100, 50, 50, 150];

    //act
    that.columnsView.setColumnWidths(newWidths);

    //assert
    assert.deepEqual(that.columnsView.getColumnWidths(), newWidths);
});

QUnit.test("Create table by default", function(assert) {
    //act
    var $table = this.columnsView._createTable();

    //assert
    assert.ok($table.hasClass("dx-datagrid-table-fixed"), "is contains data grid table class");
});

QUnit.test("Create table with columns in iOS", function(assert) {
    //arrange
    var realDevice = devices.real(),
        currentDevice = devices.current();

    devices.current("iPad");
    devices._realDevice = devices.current();

    //act
    var $table = this.columnsView._createTable(this.columns),
        $thead = $table.find("thead");

    //assert
    assert.ok($thead.length, "is contains thead element");
    assert.equal($thead.html().toLowerCase(), "<tr></tr>", "and contain empty tr");

    devices.current(currentDevice);
    devices._realDevice = realDevice;
});

QUnit.test("Create table by columnWidth auto", function(assert) {
    //arrange
    this.options.columnAutoWidth = true;

    //act
    var $table = this.columnsView._createTable();

    //assert
    assert.ok($table.hasClass("dx-datagrid-table-fixed"), "is contains data grid table class");
});

//S173138
QUnit.test("Set title attribute when cell text is trimmed", function(assert) {
    //arrange
    var that = this,
        $container = $('#container').width(200),
        $table,
        firstCellElement,
        lastCellElement;

    that.option("cellHintEnabled", true);
    that.columns.length = 0;
    that.columns.push({ caption: 'Column 1', width: 100 });
    that.columns.push({ caption: 'Column 2', width: 100 });

    $table = $(that.columnsView._createTable());
    $container.html($("<div class = 'dx-datagrid-rowsview dx-datagrid-nowrap' />").append($table.append(that.columnsView._createColGroup(that.columns), $('<tr class = "dx-row"><td>Test</td><td>Test Test Test Test Test</td></tr>'))));

    //act
    firstCellElement = $table.find("td").first();
    firstCellElement.trigger("mousemove");

    //assert
    assert.strictEqual(firstCellElement.attr("title"), undefined, "not has attribute title in first cell");

    //act
    lastCellElement = $table.find("td").last();
    lastCellElement.trigger("mousemove");

    //assert
    assert.strictEqual(lastCellElement.attr("title"), "Test Test Test Test Test", "has attribute title in last cell");
});

//S173138
QUnit.test("Not set title attribute when cell text is trimmed with cellHintEnabled false", function(assert) {
    //arrange
    var that = this,
        $container = $('#container').width(200),
        $table,
        firstCellElement,
        lastCellElement;

    that.option("cellHintEnabled", false);
    that.columns.length = 0;
    that.columns.push({ caption: 'Column 1', width: 100 });
    that.columns.push({ caption: 'Column 2', width: 100 });

    $table = $(that.columnsView._createTable());
    $container.html($("<div class = 'dx-datagrid-rowsview dx-datagrid-nowrap' />").append($table.append(that.columnsView._createColGroup(that.columns), $('<tr class = "dx-row"><td>Test</td><td>Test Test Test Test Test</td></tr>'))));

    //act
    firstCellElement = $table.find("td").first();
    firstCellElement.trigger("mousemove");

    //assert
    assert.strictEqual(firstCellElement.attr("title"), undefined, "not has attribute title in first cell");

    //act
    lastCellElement = $table.find("td").last();
    lastCellElement.trigger("mousemove");

    //assert
    assert.strictEqual(lastCellElement.attr("title"), undefined, "not has attribute title in last cell");
});

//T180556
QUnit.test("Not set title attribute when cell text is trimmed and cellTemplate defined", function(assert) {
    //arrange
    var that = this,
        $container = $('#container').width(200),
        $table,
        firstCellElement,
        lastCellElement;

    that.option("cellHintEnabled", true);
    that.columns.length = 0;
    that.columns.push({ caption: 'Column 1', width: 100 });
    that.columns.push({ caption: 'Column 2', width: 100, cellTemplate: function() { } });

    $table = $(that.columnsView._createTable());
    $container.html($("<div class = 'dx-datagrid-rowsview dx-datagrid-nowrap' />").append($table.append(that.columnsView._createColGroup(that.columns), $('<tr class = "dx-row dx-data-row"><td>Test Test Test Test Test</td><td>Test Test Test Test Test</td></tr>'))));

    //act
    firstCellElement = $table.find("td").first();
    firstCellElement.trigger("mousemove");

    //assert
    assert.strictEqual(firstCellElement.attr("title"), "Test Test Test Test Test", "has attribute title in first cell");

    //act
    lastCellElement = $table.find("td").last();
    lastCellElement.trigger("mousemove");

    //assert
    assert.strictEqual(lastCellElement.attr("title"), undefined, "not has attribute title in last cell");
});

//T356806
QUnit.test("Not set title attribute when group cell text is trimmed and groupCellTemplate defined", function(assert) {
    //arrange
    var that = this,
        $container = $('#container').width(100),
        $table,
        firstCellElement,
        lastCellElement;

    that.option("cellHintEnabled", true);
    that.columns.length = 0;
    that.columns.push({ caption: 'Column 1', width: 50, groupIndex: 0 });
    that.columns.push({ caption: 'Column 2', width: 50, groupIndex: 1, groupCellTemplate: function() { } });
    that.columns.push({ caption: 'Column 3', width: 50 });

    $table = $(that.columnsView._createTable());
    $container.html($("<div class = 'dx-datagrid-rowsview dx-datagrid-nowrap' />").append($table.append(that.columnsView._createColGroup(that.columns),
        $('<tr class = "dx-row dx-group-row"><td class="dx-datagrid-group-space"></td><td colspan="2">Test Test Test Test Test</td></tr>'),
        $('<tr class = "dx-row dx-group-row"><td class="dx-datagrid-group-space"></td><td class="dx-datagrid-group-space"></td><td>Test Test Test Test Test</td></tr>')
    )));

    $table.find("tr").eq(0).data("options", { cells: [{}, { column: that.columns[0] }] });
    $table.find("tr").eq(1).data("options", { cells: [{}, {}, { column: that.columns[1] }] });

    //act
    firstCellElement = $table.find("tr").eq(0).find("td").last();
    firstCellElement.trigger("mousemove");

    //assert
    assert.strictEqual(firstCellElement.attr("title"), "Test Test Test Test Test", "has attribute title in first group cell");

    //act
    lastCellElement = $table.find("tr").eq(1).find("td").last();
    lastCellElement.trigger("mousemove");

    //assert
    assert.strictEqual(lastCellElement.attr("title"), undefined, "not has attribute title in last group cell");
});


//T268245
QUnit.test("Not set title attribute when cell text is trimmed and headerCellTemplate defined", function(assert) {
    //arrange
    var that = this,
        $container = $('#container').width(200),
        $table,
        firstCellElement,
        lastCellElement;

    that.option("cellHintEnabled", true);
    that.columns.length = 0;
    that.columns.push({ caption: 'Column 1', width: 100 });
    that.columns.push({ caption: 'Column 2', width: 100, headerCellTemplate: function() { } });

    $table = $(that.columnsView._createTable());
    $container.html($("<div class = 'dx-datagrid-headers dx-datagrid-nowrap' />").append($table.append(that.columnsView._createColGroup(that.columns), $('<tr class = "dx-row dx-header-row"><td>Test Test Test Test Test</td><td>Test Test Test Test Test</td></tr>'))));

    //act
    firstCellElement = $table.find("td").first();
    firstCellElement.trigger("mousemove");

    //assert
    assert.strictEqual(firstCellElement.attr("title"), "Test Test Test Test Test", "has attribute title in first cell");

    //act
    lastCellElement = $table.find("td").last();
    lastCellElement.trigger("mousemove");

    //assert
    assert.strictEqual(lastCellElement.attr("title"), undefined, "not has attribute title in last cell");
});

//T222924
QUnit.test("Not set title attribute when cell text is trimmed and user title defined", function(assert) {
    //arrange
    var that = this,
        $container = $('#container').width(200),
        $table,
        firstCellElement,
        lastCellElement;

    that.option("cellHintEnabled", true);
    that.columns.length = 0;
    that.columns.push({ caption: 'Column 1', width: 100 });
    that.columns.push({ caption: 'Column 2', width: 100 });

    $table = $(that.columnsView._createTable());
    $container.html($("<div class = 'dx-datagrid-rowsview dx-datagrid-nowrap' />").append($table.append(that.columnsView._createColGroup(that.columns), $('<tr class = "dx-row dx-data-row"><td><div title="User Title">Test Test Test Test Test</div></td><td><div>Test Test Test Test Test</div></td></tr>'))));

    //act
    firstCellElement = $table.find("td").first();
    firstCellElement.children().trigger("mousemove");

    //assert
    assert.strictEqual(firstCellElement.attr("title"), undefined, "not has attribute title in first cell");
    assert.strictEqual(firstCellElement.children().attr("title"), "User Title", "user title on div in first cell");

    //act
    lastCellElement = $table.find("td").last();
    lastCellElement.children().trigger("mousemove");

    //assert
    assert.strictEqual(lastCellElement.attr("title"), undefined, "not has attribute title in last cell");
    assert.strictEqual(lastCellElement.children().attr("title"), "Test Test Test Test Test", "has attribute title on div in last cell");
});

//S173138
QUnit.test("Set title attribute when cell text is trimmed in dx-datagrid-text-content container", function(assert) {
    //arrange
    var that = this,
        $container = $('#container').width(200),
        $table,
        firstCellElement,
        lastCellElement;

    that.option("cellHintEnabled", true);
    that.columns.length = 0;
    that.columns.push({ caption: 'Column 1', width: 100 });
    that.columns.push({ caption: 'Column 2', width: 100 });

    $table = $(that.columnsView._createTable());
    $container.html($("<div class = 'dx-datagrid-headers dx-datagrid-nowrap' />").append($table.append(that.columnsView._createColGroup(that.columns), $('<tr class = "dx-row"><td><div class="dx-datagrid-text-content">Test</div></td><td><div class="dx-datagrid-text-content">Test Test Test Test Test</div></td></tr>'))));

    //act
    firstCellElement = $table.find("div").first();
    firstCellElement.trigger("mousemove");

    //assert
    assert.strictEqual(firstCellElement.attr("title"), undefined, "not has attribute title in first cell");

    //act
    lastCellElement = $table.find("div").last();
    lastCellElement.trigger("mousemove");

    //assert
    assert.strictEqual(lastCellElement.attr("title"), "Test Test Test Test Test", "has attribute title in last cell");
});

//S173138
QUnit.test("Not set title attribute when cell text is trimmed in dx-datagrid-text-content container with cellHintEnabled false", function(assert) {
    //arrange
    var that = this,
        $container = $('#container').width(200),
        $table,
        firstCellElement,
        lastCellElement;

    that.option("cellHintEnabled", false);
    that.columns.length = 0;
    that.columns.push({ caption: 'Column 1', width: 100 });
    that.columns.push({ caption: 'Column 2', width: 100 });

    $table = $(that.columnsView._createTable());
    $container.html($("<div class = 'dx-datagrid-headers dx-datagrid-nowrap' />").append($table.append(that.columnsView._createColGroup(that.columns), $('<tr class = "dx-row"><td><div class="dx-datagrid-text-content">Test</div></td><td><div class="dx-datagrid-text-content">Test Test Test Test Test</div></td></tr>'))));

    //act
    firstCellElement = $table.find("div").first();
    firstCellElement.trigger("mousemove");

    //assert
    assert.strictEqual(firstCellElement.attr("title"), undefined, "not has attribute title in first cell");

    //act
    lastCellElement = $table.find("div").last();
    lastCellElement.trigger("mousemove");

    //assert
    assert.strictEqual(lastCellElement.attr("title"), undefined, "not has attribute title in last cell");
});

QUnit.test("Invalidate instead of render for options", function(assert) {
    //arrange
    var renderCounter = 0;
    this.columnsView.render($('#container'));
    this.columnsView.renderCompleted.add(function() {
        renderCounter++;
    });

    //act
    this.columnsView.component.isReady = function() {
        return true;
    };
    this.columnsView.beginUpdate();
    this.columnsView.optionChanged({ name: "cellHintEnabled" });
    this.columnsView.optionChanged({ name: "onCellPrepared" });
    this.columnsView.optionChanged({ name: "onRowPrepared" });
    this.columnsView.optionChanged({ name: "onCellHoverChanged" });
    this.columnsView.endUpdate();

    //assert
    assert.equal(renderCounter, 1, "count of rendering");
});

QUnit.test("Invalidate when data is loading", function(assert) {
    //arrange
    var renderCounter = 0;
    this.columnsView.render($('#container'));
    this.columnsView.renderCompleted.add(function() {
        renderCounter++;
    });

    //act
    this.columnsView.component.isReady = function() {
        return false;
    };
    this.columnsView.beginUpdate();
    this.columnsView.optionChanged({ name: "cellHintEnabled" });
    this.columnsView.optionChanged({ name: "onCellPrepared" });
    this.columnsView.optionChanged({ name: "onRowPrepared" });
    this.columnsView.optionChanged({ name: "onCellHoverChanged" });
    this.columnsView.endUpdate();

    //assert
    assert.equal(renderCounter, 0, "count of rendering");
});

QUnit.test("Require resize of render for options", function(assert) {
    //arrange
    this.columnsView.render($('#container'));

    //act
    this.columnsView.component.isReady = function() {
        return true;
    };
    this.columnsView.beginUpdate();
    this.columnsView.optionChanged({ name: "cellHintEnabled" });
    this.columnsView.optionChanged({ name: "onCellPrepared" });
    this.columnsView.optionChanged({ name: "onRowPrepared" });
    this.columnsView.optionChanged({ name: "onCellHoverChanged" });
    this.columnsView.endUpdate();

    //assert
    assert.ok(this.columnsView.component._requireResize);
});

QUnit.test("Options of template have the 'component'", function(assert) {
    //arrange
    var that = this,
        callRenderTemplate,
        template = {
            allowRenderToDetachedContainer: true,
            render: function($container, options) {
                callRenderTemplate = true;

                //assert
                assert.deepEqual(options.component, that, "component");
            }
        };

    //act
    that.columnsView.renderTemplate($('#container'), template, {});

    //assert
    assert.ok(callRenderTemplate, "call render of template");
});
