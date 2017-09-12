"use strict";

var pointerMock = require("../../helpers/pointerMock.js"),
    keyboardMock = require("../../helpers/keyboardMock.js");

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    SchedulerWorkSpace = require("ui/scheduler/ui.scheduler.work_space"),
    SchedulerResourcesManager = require("ui/scheduler/ui.scheduler.resource_manager"),
    domUtils = require("core/utils/dom"),
    resizeCallbacks = require("core/utils/window").resizeCallbacks,
    dateUtils = require("core/utils/date"),
    dateLocalization = require("localization/date"),
    dragEvents = require("events/drag");

require("common.css!");
require("generic_light.css!");

require("ui/scheduler/ui.scheduler.work_space_day");
require("ui/scheduler/ui.scheduler.work_space_week");
require("ui/scheduler/ui.scheduler.work_space_work_week");
require("ui/scheduler/ui.scheduler.work_space_month");

var CELL_CLASS = "dx-scheduler-date-table-cell",
    DROPPABLE_CELL_CLASS = "dx-scheduler-date-table-droppable-cell",
    ALL_DAY_TABLE_CELL_CLASS = "dx-scheduler-all-day-table-cell";

var checkRowsAndCells = function($element, assert, interval, start) {
    interval = interval || 0.5;
    start = start || 0;
    var cellCount = (12 - start / (interval * 2)) / interval,
        cellDuration = 3600000 * interval * 2;

    assert.equal($element.find(".dx-scheduler-time-panel-row").length, cellCount, "Time panel has a right count of rows");
    assert.equal($element.find(".dx-scheduler-time-panel-cell").length, cellCount, "Time panel has a right count of cells");

    $element.find(".dx-scheduler-time-panel-cell").each(function(index) {
        var time = dateLocalization.format(new Date(new Date(1970, 0).getTime() + cellDuration * index + start * 3600000), "shorttime");
        assert.equal($(this).text(), time, "Time is OK");
    });
};

var stubInvokeMethod = function(instance, options) {
    options = options || {};
    sinon.stub(instance, "invoke", function() {
        var subscribe = arguments[0];
        if(subscribe === "createResourcesTree") {
            return new SchedulerResourcesManager().createResourcesTree(arguments[1]);
        }
        if(subscribe === "getResourceTreeLeaves") {
            var resources = instance.resources || [{ field: "one", dataSource: [{ id: 1 }, { id: 2 }] }];
            return new SchedulerResourcesManager(resources).getResourceTreeLeaves(arguments[1], arguments[2]);
        }
        if(subscribe === "getTimezone") {
            return options.tz || 3;
        }
        if(subscribe === "getTimezoneOffset") {
            return -180 * 60000;
        }
        if(subscribe === "convertDateByTimezone") {
            var date = new Date(arguments[1]);

            var tz = options.tz;

            if(tz) {
                var tzOffset = new Date().getTimezoneOffset() * 60000,
                    dateInUTC = date.getTime() + tzOffset;

                date = new Date(dateInUTC + (tz * 3600000));
            }

            return date;
        }
    });
};

QUnit.testStart(function() {
    $("#qunit-fixture").html('<div id="scheduler-work-space"></div>');
});

(function() {
    QUnit.module("Work Space Base", {
        beforeEach: function() {
            this.instance = $("#scheduler-work-space").dxSchedulerWorkSpace().dxSchedulerWorkSpace("instance");
            stubInvokeMethod(this.instance);
        }
    });

    QUnit.test("Scheduler workspace should be initialized", function(assert) {
        assert.ok(this.instance instanceof SchedulerWorkSpace, "dxSchedulerWorkSpace was initialized");
    });

    QUnit.test("Scheduler workspace should have a right css class", function(assert) {
        var $element = this.instance.$element();
        assert.ok($element.hasClass("dx-scheduler-work-space"), "dxSchedulerWorkSpace has 'dx-scheduler-workspace' css class");
    });

    QUnit.test("Scheduler workspace should have a right default intervalCount and startDate", function(assert) {
        assert.equal(this.instance.option("intervalCount"), 1, "dxSchedulerWorkSpace intervalCount is right");
        assert.deepEqual(this.instance.option("startDate"), null, "dxSchedulerWorkSpace startDate is right");
    });

    QUnit.test("Scheduler workspace with intervalCount should have a right css class", function(assert) {
        this.instance.option("intervalCount", 3);
        var $element = this.instance.$element();
        assert.ok($element.hasClass("dx-scheduler-work-space-count"), "dxSchedulerWorkSpace has 'dx-scheduler-workspace' css class");

        this.instance.option("intervalCount", 1);
        $element = this.instance.$element();
        assert.notOk($element.hasClass("dx-scheduler-work-space-count"), "dxSchedulerWorkSpace has 'dx-scheduler-workspace' css class");
    });

    QUnit.test("Scheduler workspace should contain time panel, header panel, allday panel and content", function(assert) {
        var $element = this.instance.$element();

        assert.equal($element.find(".dx-scheduler-header-panel").length, 1, "Workspace contains the time panel");
        assert.equal($element.find(".dx-scheduler-all-day-panel").length, 1, "Workspace contains the all day panel");
        assert.equal($element.find(".dx-scheduler-time-panel").length, 1, "Workspace contains the time panel");
        assert.equal($element.find(".dx-scheduler-date-table").length, 1, "Workspace contains date table");
    });

    QUnit.test("All day title should be rendered in workspace directly", function(assert) {
        var $element = this.instance.$element();

        assert.equal($element.children(".dx-scheduler-all-day-title").length, 1, "All-day-title is OK");
    });

    QUnit.test("All day panel is invisible, if showAllDayPanel = false", function(assert) {
        this.instance.option("showAllDayPanel", false);

        var $element = this.instance.$element(),
            $allDayPanel = $element.find(".dx-scheduler-all-day-panel");

        assert.equal($allDayPanel.css("display"), "none", "allDay panel is invisible");

        this.instance.option("showAllDayPanel", true);

        assert.notEqual($allDayPanel.css("display"), "none", "allDay panel is visible");
    });

    QUnit.test("All day title has a special CSS class, if showAllDayPanel = false", function(assert) {
        this.instance.option("showAllDayPanel", false);

        var $element = this.instance.$element(),
            $allDayTitle = $element.find(".dx-scheduler-all-day-title");

        assert.ok($allDayTitle.hasClass("dx-scheduler-all-day-title-hidden"), "CSS class is OK");

        this.instance.option("showAllDayPanel", true);

        assert.notOk($allDayTitle.hasClass("dx-scheduler-all-day-title-hidden"), "CSS class is OK");
    });

    QUnit.test("Workspace should have specific css class, if showAllDayPanel = true ", function(assert) {
        this.instance.option("showAllDayPanel", true);

        var $element = this.instance.$element();
        assert.ok($element.hasClass("dx-scheduler-work-space-all-day"), "dxSchedulerWorkSpace has 'dx-scheduler-work-space-all-day' css class");

        this.instance.option("showAllDayPanel", false);
        assert.notOk($element.hasClass("dx-scheduler-work-space-all-day"), "dxSchedulerWorkSpace hasn't 'dx-scheduler-work-space-all-day' css class");
    });

    QUnit.test("Workspace should have specific css class, if hoursInterval = 0.5 ", function(assert) {
        this.instance.option("hoursInterval", 0.5);

        var $element = this.instance.$element();
        assert.ok($element.hasClass("dx-scheduler-work-space-odd-cells"), "dxSchedulerWorkSpace has 'dx-scheduler-work-space-odd-cells' css class");

        this.instance.option("hoursInterval", 0.75);
        assert.notOk($element.hasClass("dx-scheduler-work-space-odd-cells"), "dxSchedulerWorkSpace hasn't 'dx-scheduler-work-space-odd-cells' css class");
    });

    QUnit.test("All day panel has specific class when allDayExpanded = true", function(assert) {
        this.instance.option("showAllDayPanel", true);
        this.instance.option("allDayExpanded", true);

        var $element = this.instance.$element();

        assert.notOk($element.hasClass("dx-scheduler-work-space-all-day-collapsed"), "dxSchedulerWorkSpace has not 'dx-scheduler-work-space-all-day-collapsed' css class");

        this.instance.option("allDayExpanded", false);

        assert.ok($element.hasClass("dx-scheduler-work-space-all-day-collapsed"), "dxSchedulerWorkSpace has 'dx-scheduler-work-space-all-day-collapsed' css class");
    });

    QUnit.test("Workspace should not has specific class when showAllDayPanel = false", function(assert) {
        this.instance.option("showAllDayPanel", false);
        this.instance.option("allDayExpanded", false);

        var $element = this.instance.$element();

        assert.notOk($element.hasClass("dx-scheduler-work-space-all-day-collapsed"), "dxSchedulerWorkSpace has not 'dx-scheduler-work-space-all-day-collapsed' css class");

        this.instance.option("showAllDayPanel", true);

        assert.ok($element.hasClass("dx-scheduler-work-space-all-day-collapsed"), "dxSchedulerWorkSpace has 'dx-scheduler-work-space-all-day-collapsed' css class");
    });

    QUnit.test("Scheduler workspace parts should be wrapped by scrollable", function(assert) {
        var $element = this.instance.$element();

        assert.ok($element.find(".dx-scheduler-time-panel").parent().hasClass("dx-scrollable-content"), "Scrollable contains the time panel");
        assert.ok($element.find(".dx-scheduler-date-table").parent().hasClass("dx-scrollable-content"), "Scrollable contains date table");
    });

    QUnit.test("Time panel cells and rows should have special css classes", function(assert) {
        var $element = this.instance.$element(),
            $row = $element.find(".dx-scheduler-time-panel tr").first(),
            $cell = $row.find("td").first();

        assert.ok($row.hasClass("dx-scheduler-time-panel-row"), "Css class of row is correct");
        assert.ok($cell.hasClass("dx-scheduler-time-panel-cell"), "Css class of cell is correct");
    });


    QUnit.test("Time panel should have special css class when difference between endDayHour and startDayHour is odd", function(assert) {
        var $element = this.instance.$element(),
            $timePanel = $element.find(".dx-scheduler-time-panel");

        this.instance.option("startDayHour", 5.5);
        assert.ok($timePanel.hasClass("dx-scheduler-time-panel-odd-row-count"), "Time panel has css class");

        this.instance.option("startDayHour", 6);
        assert.notOk($timePanel.hasClass("dx-scheduler-time-panel-odd-row-count"), "Time panel has no css class");
    });

    QUnit.test("All day panel row should have special css class", function(assert) {
        this.instance.option("showAllDayPanel", true);

        var $element = this.instance.$element(),
            $row = $element.find(".dx-scheduler-all-day-table tr").first();

        assert.ok($row.hasClass("dx-scheduler-all-day-table-row"), "Css class of row is correct");
    });

    QUnit.test("All-day-appointments container should be rendered directly in workspace", function(assert) {
        var $element = this.instance.$element();

        assert.equal($element.children(".dx-scheduler-all-day-appointments").length, 1, "Container is rendered correctly");
    });

    QUnit.test("Fixed appointments container should be rendered directly in workspace", function(assert) {
        var $element = this.instance.$element();

        assert.equal($element.children(".dx-scheduler-fixed-appointments").length, 1, "Container is rendered correctly");
    });

    QUnit.test("Work space should have 'grouped' class & group row count attr if there are some groups", function(assert) {
        assert.ok(!this.instance.$element().hasClass("dx-scheduler-work-space-grouped"), "'grouped' class is not applied");

        this.instance.option("groups", [{
            name: "one",
            items: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
        }]);

        assert.ok(this.instance.$element().hasClass("dx-scheduler-work-space-grouped"), "'grouped' class is applied");
        assert.equal(this.instance.$element().attr("dx-group-row-count"), 1, "'dx-group-row-count' is right");

        this.instance.option("groups", []);
        assert.ok(!this.instance.$element().hasClass("dx-scheduler-work-space-grouped"), "'grouped' class is not applied");
        assert.notOk(this.instance.$element().attr("dx-group-row-count"), "'dx-group-row-count' isn't applied");
    });

    QUnit.test("Work space should not have 'grouped' class & group row count attr if groups exist but empty(T381796)", function(assert) {
        assert.ok(!this.instance.$element().hasClass("dx-scheduler-work-space-grouped"), "'grouped' class is not applied");

        this.instance.option("groups", [{
            name: "one",
            items: []
        }]);

        assert.notOk(this.instance.$element().hasClass("dx-scheduler-work-space-grouped"), "'grouped' class isn't applied");
        assert.notOk(this.instance.$element().attr("dx-group-row-count"), "'dx-group-row-count' isn't applied");
    });

    QUnit.test("Group header should be rendered if there are some groups", function(assert) {

        assert.equal(this.instance.$element().find(".dx-scheduler-group-header").length, 0, "Groups are not rendered");

        this.instance.option("groups", [
            {
                name: "one",
                items: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
            },
            {
                name: "two",
                items: [{ id: 1, text: "c" }, { id: 2, text: "d" }, { id: 3, text: "e" }]
            }
        ]);

        var rows = this.instance.$element().find(".dx-scheduler-group-row"),
            firstRowCells = rows.eq(0).find(".dx-scheduler-group-header"),
            secondRowCells = rows.eq(1).find(".dx-scheduler-group-header");

        assert.equal(rows.length, 2, "There are two group rows");
        assert.equal(this.instance.$element().attr("dx-group-row-count"), 2, "'dx-group-row-count' is right");

        assert.equal(firstRowCells.length, 2, "The first group row contains two group headers");
        assert.equal(firstRowCells.attr("colspan"), "3", "Cells of the first group row have a right colspan attr");
        assert.equal(firstRowCells.eq(0).text(), "a", "Cell has a right text");
        assert.equal(firstRowCells.eq(1).text(), "b", "Cell has a right text");

        assert.equal(secondRowCells.length, 6, "The second group row contains six group headers");

        assert.strictEqual(secondRowCells.attr("colspan"), undefined, "Cells of the second group row do not have colspan attr");

        assert.equal(secondRowCells.eq(0).text(), "c", "Cell has a right text");
        assert.equal(secondRowCells.eq(1).text(), "d", "Cell has a right text");
        assert.equal(secondRowCells.eq(2).text(), "e", "Cell has a right text");

        assert.equal(secondRowCells.eq(3).text(), "c", "Cell has a right text");
        assert.equal(secondRowCells.eq(4).text(), "d", "Cell has a right text");
        assert.equal(secondRowCells.eq(5).text(), "e", "Cell has a right text");
    });

    QUnit.test("Group header should be rendered if there is a single group", function(assert) {
        this.instance.option("groups", [{ name: "one", items: [{ id: 1, text: "a" }] }]);

        var headers = this.instance.$element().find(".dx-scheduler-group-header");

        assert.equal(headers.length, 1, "Group are rendered");
        assert.equal(headers.eq(0).text(), "a", "Group header text is right");
    });

    QUnit.test("Group header should contain group header content", function(assert) {
        this.instance.option("groups", [{ name: "one", items: [{ id: 1, text: "a" }] }]);

        var header = this.instance.$element().find(".dx-scheduler-group-header"),
            headerContent = header.find(".dx-scheduler-group-header-content");

        assert.equal(headerContent.length, 1, "Group header content is rendered");
    });

    QUnit.test("Tables should be rerendered if dimension was changed and horizontal scrolling is enabled", function(assert) {
        this.instance.option("crossScrollingEnabled", true);
        var stub = sinon.stub(this.instance, "_setTableSizes");

        resizeCallbacks.fire();

        assert.ok(stub.calledOnce, "Tables were updated");
    });

    QUnit.test("Tables should not be rerendered if dimension was changed and horizontal scrolling isn't enabled", function(assert) {
        this.instance.option("crossScrollingEnabled", false);
        var stub = sinon.stub(this.instance, "_setTableSizes");

        resizeCallbacks.fire();

        assert.equal(stub.callCount, 0, "Tables were not updated");
    });

    QUnit.test("Tables should be rerendered if width was changed and horizontal scrolling is enabled", function(assert) {
        var stub = sinon.stub(this.instance, "_setTableSizes");
        this.instance.option("crossScrollingEnabled", true);
        this.instance.option("width", 777);

        assert.ok(stub.calledOnce, "Tables were updated");
    });

    QUnit.test("Tables should not be rerendered if width was changed and horizontal scrolling isn't enabled", function(assert) {
        var stub = sinon.stub(this.instance, "_setTableSizes");
        this.instance.option("crossScrollingEnabled", false);
        this.instance.option("width", 777);

        assert.equal(stub.callCount, 0, "Tables were not updated");
    });

    QUnit.test("Workspace should restore scrollTop after restoreScrollTop call", function(assert) {
        this.instance.$element().scrollTop(30);
        assert.equal(this.instance.$element().scrollTop(), 30, "scrollTop is right");

        this.instance.restoreScrollTop();
        assert.equal(this.instance.$element().scrollTop(), 0, "scrollTop is restored");
    });

    QUnit.test("dateUtils.getTimezonesDifference should be called when calculating interval between dates", function(assert) {
        var stub = sinon.stub(dateUtils, "getTimezonesDifference"),
            minDate = new Date("Thu Mar 10 2016 00:00:00 GMT-0500"),
            maxDate = new Date("Mon Mar 15 2016 00:00:00 GMT-0400");

        //TODO: use public method instead
        this.instance._getIntervalBetween(minDate, maxDate, true);

        assert.ok(stub.calledOnce, "getTimezonesDifference was called");

        dateUtils.getTimezonesDifference.restore();
    });

    QUnit.test("Workspace should throw an error if target index is incorrect in getCoordinatesByDate method ", function(assert) {
        var instance = this.instance;

        assert.throws(
            function() {
                instance.getCoordinatesByDate(new Date(), 100, 0);
            },
            function(e) {
                return /E1039/.test(e.message);
            },
            "Exception messages should be correct"
        );
    });
})("Work Space Base");

(function() {

    QUnit.module("Work Space Day", {
        beforeEach: function() {
            this.createInstance = function(options) {
                if(this.instance) {
                    this.instance.invoke.restore();
                    delete this.instance;
                }

                this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceDay().dxSchedulerWorkSpaceDay("instance");
                stubInvokeMethod(this.instance, options);
            };

            this.createInstance();
        }
    });

    QUnit.test("Workspace getAllDayHeight() should return 0 or allDayPanel-height depending on the showAllDayPanel option", function(assert) {
        this.instance.option("showAllDayPanel", true);
        assert.ok(this.instance.getAllDayHeight() > 0, "Return value is correct");

        this.instance.option("showAllDayPanel", false);
        assert.equal(this.instance.getAllDayHeight(), 0, "Return value is correct");
    });

    QUnit.test("Scheduler workspace day should have a right css class", function(assert) {
        var $element = this.instance.$element();

        assert.ok($element.hasClass("dx-scheduler-work-space-day"), "dxSchedulerWorkSpaceDay has 'dx-scheduler-workspace-day' css class");
    });

    QUnit.test("Scheduler all day panel should contain one row", function(assert) {
        this.instance.option("showAllDayPanel", true);

        var $allDayPanel = this.instance.$element().find(".dx-scheduler-all-day-panel");

        assert.equal($allDayPanel.find("tbody tr").length, 1, "All day panel contains 1 row");
        assert.equal($allDayPanel.find("tbody tr>td").length, 1, "All day panel contains 1 cell");
    });

    QUnit.test("Scheduler workspace date-table rows and cells should have correct css-class", function(assert) {
        var $element = this.instance.$element(),
            $dateTable = $element.find(".dx-scheduler-date-table"),
            $row = $dateTable.find("tr").first(),
            $cell = $row.find("td").first();

        assert.ok($row.hasClass("dx-scheduler-date-table-row"), "Row class is correct");
        assert.ok($cell.hasClass("dx-scheduler-date-table-cell"), "Cell class is correct");
    });

    QUnit.test("Scheduler workspace day view", function(assert) {
        var $element = this.instance.$element(),
            cellCounter = 0;


        assert.equal($element.find(".dx-scheduler-date-table tbody tr").length, 48, "Date table has 48 rows");
        assert.equal($element.find(".dx-scheduler-date-table tbody tr>td").length, 48, "Date table has 48 cells");

        $element.find(".dx-scheduler-date-table tbody tr").each(function() {
            if($(this).find("td").length === 1) {
                cellCounter++;
            }
        });

        assert.equal(cellCounter, 48, "Each row has a single cell");
    });

    QUnit.test("Scheduler workspace day grouped view", function(assert) {
        var $element = this.instance.$element(),
            cellCounter = 0;

        this.instance.option("groups", [{ name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] }]);

        assert.equal($element.find(".dx-scheduler-date-table tbody tr").length, 48, "Date table has 48 rows");
        assert.equal($element.find(".dx-scheduler-date-table tbody tr>td").length, 96, "Date table has 96 cells");

        $element.find(".dx-scheduler-date-table tbody tr").each(function() {
            if($(this).find("td").length === 2) {
                cellCounter++;
            }
        });

        assert.equal(cellCounter, 48, "Each row has a two cells");
    });

    QUnit.test("Date table cells should have a special css class", function(assert) {
        var $element = this.instance.$element(),
            classes = $element.find(".dx-scheduler-date-table td").attr("class").split(" ");

        assert.ok($.inArray(CELL_CLASS, classes) > -1, "Cell has a css class");
    });

    QUnit.test("Grouped cells should have a right group field in dxCellData", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("groups", [{ name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] }]);

        assert.deepEqual($element.find(".dx-scheduler-date-table tbody tr>td").eq(0).data("dxCellData").groups, {
            one: 1
        }, "Cell group is OK");
        assert.deepEqual($element.find(".dx-scheduler-date-table tbody tr>td").eq(1).data("dxCellData").groups, { one: 2 }, "Cell group is OK");
    });

    QUnit.test("Scheduler workspace day view should not contain a single header", function(assert) {
        var $element = this.instance.$element();

        assert.equal($element.find(".dx-scheduler-header-row th").length, 0, "Date table has not header cell");
    });

    QUnit.test("Scheduler workspace day grouped view should contain a few headers", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("groups", [
            {
                name: "one",
                items: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
            },
            {
                name: "two",
                items: [{ id: 1, text: "c" }, { id: 2, text: "d" }]
            }
        ]);

        assert.equal($element.find(".dx-scheduler-header-row th").length, 0, "Date table has not header cell");
        assert.equal($element.find(".dx-scheduler-group-row").eq(0).find("th").attr("colspan"), "2", "Group header has a right 'colspan'");
        assert.strictEqual($element.find(".dx-scheduler-group-row").eq(1).find("th").attr("colspan"), undefined, "Group header has a right 'colspan'");
    });


    QUnit.test("Time panel should have 24 rows and 24 cells", function(assert) {
        checkRowsAndCells(this.instance.$element(), assert);
    });

    QUnit.test("Time panel should have 11 rows and 11 cells for hoursInterval = 1 & startDayHour = 2", function(assert) {
        this.instance.option({
            hoursInterval: 1,
            startDayHour: 2
        });

        checkRowsAndCells(this.instance.$element(), assert, 1, 2);
    });

    QUnit.test("Work space should find cell coordinates by date", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("currentDate", new Date(2015, 2, 4));
        var coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 4, 2, 0));

        assert.equal(coords.top, $element.find(".dx-scheduler-date-table tbody td").eq(4).position().top, "Top cell coordinates are right");
        assert.equal(coords.left, $element.find(".dx-scheduler-date-table tbody td").eq(4).position().left, "Left cell coordinates are right");


        var $cell = $element.find(".dx-scheduler-date-table tbody td").eq(5),
            position = $cell.position();

        coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 4, 2, 30));
        assert.equal(coords.top, position.top, "Cell coordinates are right");
        assert.equal(coords.left, position.left, "Cell coordinates are right");

        coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 4, 2, 45));

        position.top += $cell.outerHeight() * 0.5;
        assert.equal(coords.top, position.top, "Cell coordinates are right");
        assert.equal(coords.left, position.left, "Cell coordinates are right");
    });

    QUnit.test("Workspace should find cell coordinates by date with second precision", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("currentDate", new Date(2017, 5, 16));
        this.instance.option("hoursInterval", 1);

        var coords = this.instance.getCoordinatesByDate(new Date(2017, 5, 16, 1, 1, 30)),
            $cell = $element.find(".dx-scheduler-date-table tbody td").eq(1),
            top = $cell.position().top + (1.5 / 60) * $cell.outerHeight();

        assert.equal(coords.top, top, "Cell coordinates are right");
        assert.equal(coords.left, $cell.position().left, "Cell coordinates are right");
    });

    QUnit.test("Work space should find cell coordinates by date depend on start day hour", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("currentDate", new Date(2015, 2, 4));
        this.instance.option("startDayHour", 5);

        var coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 4, 6, 0));

        assert.equal(coords.top, $element.find(".dx-scheduler-date-table tbody td").eq(2).position().top, "Cell coordinates are right");
        assert.equal(coords.left, $element.find(".dx-scheduler-date-table tbody td").eq(2).position().left, "Cell coordinates are right");
    });

    QUnit.test("Work space should find cell coordinates by date depend on fractional start day hour", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("currentDate", new Date(2015, 2, 4));
        this.instance.option("startDayHour", 5.5);

        var coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 4, 6, 0));

        assert.equal(coords.top, $element.find(".dx-scheduler-date-table tbody td").eq(1).position().top, "Cell coordinates are right");
        assert.equal(coords.left, $element.find(".dx-scheduler-date-table tbody td").eq(1).position().left, "Cell coordinates are right");
    });

    QUnit.test("Work space should find cell coordinates by date depend on end day hour", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("currentDate", new Date(2015, 2, 4));
        this.instance.option("endDayHour", 10);

        var coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 4, 6, 0));

        assert.equal(coords.top, $element.find(".dx-scheduler-date-table tbody td").eq(12).position().top, "Cell coordinates are right");
        assert.equal(coords.left, $element.find(".dx-scheduler-date-table tbody td").eq(12).position().left, "Cell coordinates are right");
    });

    QUnit.test("Work space should return coordinates of first cell for dates before first view date", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("currentDate", new Date(2015, 2, 4));

        var coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 3, 0, 0));
        assert.equal(coords.top, $element.find(".dx-scheduler-date-table-cell").eq(0).position().top, "Cell coordinates are right");
        assert.equal(coords.left, $element.find(".dx-scheduler-date-table-cell").eq(0).position().left, "Cell coordinates are right");
    });

    QUnit.test("getDataByDroppableCell should work right with the single group", function(assert) {
        this.instance.option("currentDate", new Date(2015, 1, 18));
        this.instance.option("groups", [
            {
                name: "res",
                items: [
                    { id: 1, text: "one" }, { id: 2, text: "two" }
                ]
            }
        ]);

        this.instance.$element().find("." + CELL_CLASS).eq(5).addClass("dx-scheduler-date-table-droppable-cell");

        var data = this.instance.getDataByDroppableCell();
        assert.deepEqual(data, {
            date: new Date(2015, 1, 18, 1),
            allDay: false,
            groups: {
                res: 2
            }
        }, "Data is OK");
    });

    QUnit.test("getDataByDroppableCell should work right with many groups", function(assert) {
        this.instance.option("currentDate", new Date(2015, 1, 18));
        this.instance.option("groups", [
            {
                name: "one",
                items: [
                    { id: 1, text: "a" }, { id: 2, text: "b" }
                ]
            },
            {
                name: "two",
                items: [
                    { id: 1, text: "c" }, { id: 2, text: "d" }
                ]
            },
            {
                name: "three",
                items: [
                    { id: 1, text: "e" }, { id: 2, text: "f" }, { id: 3, text: "g" }
                ]
            }
        ]);

        this.instance.$element().find("." + CELL_CLASS).eq(20).addClass("dx-scheduler-date-table-droppable-cell");

        var data = this.instance.getDataByDroppableCell();
        assert.deepEqual(data, {
            date: new Date(2015, 1, 18, 0, 30),
            allDay: false,
            groups: {
                one: 2,
                two: 1,
                three: 3
            }
        }, "Data is OK");
    });

    QUnit.test("droppable class should be added on dxdragenter", function(assert) {
        var $cell = this.instance.$element().find("." + CELL_CLASS).eq(2);

        $($cell).trigger(dragEvents.enter);
        assert.ok($cell.hasClass(DROPPABLE_CELL_CLASS), "cell has droppable class");
    });

    QUnit.test("droppable class should be removed on dxdrop", function(assert) {
        var $cell = this.instance.$element().find("." + CELL_CLASS).eq(2);
        $cell.addClass(DROPPABLE_CELL_CLASS);

        $($cell).trigger(dragEvents.drop);
        assert.ok(!$cell.hasClass(DROPPABLE_CELL_CLASS), "cell has no droppable class");
    });

    QUnit.test("Get date range", function(assert) {
        this.instance.option("currentDate", new Date(2015, 2, 16));

        assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 16, 0, 0), new Date(2015, 2, 16, 23, 59)], "Range is OK");
    });

    QUnit.test("Each cell should contain jQuery dxCellData", function(assert) {
        this.instance.option("currentDate", new Date(2015, 2, 16));

        var $cell = this.instance.$element().find("." + CELL_CLASS).first();

        assert.deepEqual($cell.data("dxCellData"), {
            startDate: new Date(2015, 2, 16, 0, 0),
            endDate: new Date(2015, 2, 16, 0, 30),
            allDay: false
        });
    });

    QUnit.test("dxCellData should be 'immutable'", function(assert) {
        var $element = this.instance.$element(),
            $cell = $element.find("." + CELL_CLASS).first(),
            cellData = this.instance.getCellData($cell);

        cellData.cellCustomField = "cell-custom-data";
        assert.strictEqual($element.find("." + CELL_CLASS).first().data("dxCellData").cellCustomField, undefined, "Cell data is not affected");
    });

})("Work Space Day");

(function() {

    QUnit.module("Work Space Week", {
        beforeEach: function() {
            this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceWeek().dxSchedulerWorkSpaceWeek("instance");
            stubInvokeMethod(this.instance);
        }
    });

    QUnit.test("Scheduler workspace week should have a right css class", function(assert) {
        var $element = this.instance.$element();

        assert.ok($element.hasClass("dx-scheduler-work-space-week"), "dxSchedulerWorkSpaceWeek has 'dx-scheduler-workspace-week' css class");
    });

    QUnit.test("Scheduler all day panel should contain one row & 7 cells", function(assert) {
        this.instance.option("showAllDayPanel", true);

        var $allDayPanel = this.instance.$element().find(".dx-scheduler-all-day-panel");

        assert.equal($allDayPanel.find("tbody tr").length, 1, "All day panel contains 1 row");
        assert.equal($allDayPanel.find("tbody tr>td").length, 7, "All day panel contains 7 cell");
    });

    QUnit.test("Scheduler workspace week view", function(assert) {
        var $element = this.instance.$element(),
            cellCounter = 0;

        assert.equal($element.find(".dx-scheduler-date-table tbody tr").length, 48, "Date table has 48 rows");
        assert.equal($element.find(".dx-scheduler-date-table tbody tr>td").length, 336, "Date table has 336 cells");

        $element.find(".dx-scheduler-date-table tbody tr").each(function() {
            if($(this).find("td").length === 7) {
                cellCounter++;
            }
        });

        assert.equal(cellCounter, 48, "Each row has a seven cells");
    });

    QUnit.test("Time panel should have 24 rows and 24 cells", function(assert) {
        this.instance.option("currentDate", new Date(1970, 0));
        checkRowsAndCells(this.instance.$element(), assert);
    });

    QUnit.test("Scheduler workspace week grouped view", function(assert) {
        var $element = this.instance.$element(),
            cellCounter = 0;

        this.instance.option("groups", [{ name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] }]);

        assert.equal($element.find(".dx-scheduler-date-table tbody tr").length, 48, "Date table has 48 rows");
        assert.equal($element.find(".dx-scheduler-date-table tbody tr>td").length, 672, "Date table has 672 cells");

        $element.find(".dx-scheduler-date-table tbody tr").each(function() {
            if($(this).find("td").length === 14) {
                cellCounter++;
            }
        });

        assert.equal(cellCounter, 48, "Each row has a fourteen cells");
    });

    QUnit.test("Scheduler workspace week view should contain a 7 headers", function(assert) {
        var $element = this.instance.$element();

        var weekStartDate = new Date().getDate() - new Date().getDay();

        var $headerCells = $element.find(".dx-scheduler-header-row th");

        assert.equal($headerCells.length, 7, "Date table has 7 header cells");

        $headerCells.each(function(index, cell) {
            var date = new Date();
            date.setDate(weekStartDate + index);

            var cellText = [
                dateLocalization.getDayNames("abbreviated")[index % 7].toLowerCase(),
                date.getDate()
            ].join(" ");

            assert.equal($(cell).text().toLowerCase(), cellText, "Header has a right text");
            assert.equal($(cell).attr("title").toLowerCase(), cellText, "Header has a right title");
        });
    });

    QUnit.test("Scheduler workspace grouped week view should contain a few headers", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("groups", [
            {
                name: "one",
                items: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
            },
            {
                name: "two",
                items: [{ id: 1, text: "c" }, { id: 2, text: "d" }]
            }
        ]);

        var $headerCells = $element.find(".dx-scheduler-header-row th");

        assert.equal($headerCells.length, 28, "Date table has 28 header cells");

        assert.equal($element.find(".dx-scheduler-group-row").eq(0).find("th").attr("colspan"), "14", "Group header has a right 'colspan'");
        assert.equal($element.find(".dx-scheduler-group-row").eq(1).find("th").attr("colspan"), "7", "Group header has a right 'colspan'");
    });

    QUnit.test("Group row should be rendered before header row", function(assert) {
        this.instance.option("groups", [
            {
                name: "one",
                items: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
            }
        ]);
        var $element = this.instance.$element(),
            $groupRow = $element.find(".dx-scheduler-group-row"),
            $headerRow = $element.find(".dx-scheduler-header-row");

        assert.deepEqual($groupRow.next().get(0), $headerRow.get(0), "Group row rendered correctly");
    });

    QUnit.test("Work space should find cell coordinates by date", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("currentDate", new Date(2015, 2, 4));
        var coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 5, 2, 0));
        assert.equal(coords.top, $element.find(".dx-scheduler-date-table tbody td").eq(32).position().top, "Cell coordinates are right");
        assert.equal(coords.left, $element.find(".dx-scheduler-date-table tbody td").eq(32).position().left, "Cell coordinates are right");
    });

    QUnit.test("Work space should find cell coordinates by date in allDay panel", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("currentDate", new Date(2015, 2, 4));
        var coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 5, 2, 15), 0, true);

        assert.roughEqual(coords.top, 0, 1.001, "Cell coordinates are right");
        assert.equal(coords.left, $element.find(".dx-scheduler-all-day-table tbody td").eq(4).position().left, "Cell coordinates are right");
    });

    QUnit.test("Work space should find cell coordinates by date depend on start day hour", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("currentDate", new Date(2015, 2, 4));
        this.instance.option("startDayHour", 5);
        this.instance.option("firstDayOfWeek", 7);

        var coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 5, 6, 0));
        assert.equal(coords.top, $element.find(".dx-scheduler-date-table tbody td").eq(18).position().top, "Cell coordinates are right");
        assert.equal(coords.left, $element.find(".dx-scheduler-date-table tbody td").eq(18).position().left, "Cell coordinates are right");
    });

    QUnit.test("Work space should find cell coordinates by date depend on start/end day hour & cellDuration", function(assert) {
        var $element = this.instance.$element();

        this.instance.option({
            currentDate: new Date(2015, 2, 1),
            firstDayOfWeek: 0,
            startDayHour: 5,
            endDayHour: 10,
            hoursInterval: 0.75
        });

        var coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 2, 8, 0));
        assert.equal(coords.top, $element.find(".dx-scheduler-date-table tbody td").eq(29).position().top, "Cell coordinates are right");
        assert.equal(coords.left, $element.find(".dx-scheduler-date-table tbody td").eq(29).position().left, "Cell coordinates are right");
    });

    QUnit.test("Work space should find cell coordinates by date depend on end day hour", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("currentDate", new Date(2015, 2, 4));
        this.instance.option("endDayHour", 10);
        this.instance.option("firstDayOfWeek", 1);

        var coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 5, 0, 30));
        assert.equal(coords.top, $element.find(".dx-scheduler-date-table tbody td").eq(10).position().top, "Cell coordinates are right");
        assert.equal(coords.left, $element.find(".dx-scheduler-date-table tbody td").eq(10).position().left, "Cell coordinates are right");
    });

    QUnit.test("Work space should find cell coordinates by date inside group", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("currentDate", new Date(2015, 2, 4));
        this.instance.option("groups", [{ name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] }]);

        var coords = this.instance.getCoordinatesByDateInGroup(new Date(2015, 2, 5, 2, 0), { "one": [2] });
        assert.equal(coords.length, 1);
        assert.equal(coords[0].top, $element.find(".dx-scheduler-date-table tbody td").eq(67).position().top, "Cell coordinates are right");
        assert.equal(coords[0].left, $element.find(".dx-scheduler-date-table tbody td").eq(67).position().left, "Cell coordinates are right");
    });

    QUnit.test("Work space should find cells coordinates by date inside the same groups", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("currentDate", new Date(2015, 2, 4));
        this.instance.option("groups", [{ name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] }]);

        var coords = this.instance.getCoordinatesByDateInGroup(new Date(2015, 2, 5, 2, 0), { "one": [1, 2] }),
            $cells = $element.find(".dx-scheduler-date-table tbody td");
        assert.equal(coords.length, 2);
        assert.equal(coords[0].top, $cells.eq(60).position().top, "Cell coordinates are right");
        assert.equal(coords[0].left, $cells.eq(60).position().left, "Cell coordinates are right");
        assert.equal(coords[1].top, $cells.eq(67).position().top, "Cell coordinates are right");
        assert.equal(coords[1].left, $cells.eq(67).position().left, "Cell coordinates are right");
    });

    QUnit.test("Work space should find cells coordinates by date inside the different groups", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("currentDate", new Date(2015, 2, 4));
        this.instance.option("groups", [
            {
                name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
            },
            {
                name: "two", items: [{ id: 1, text: "c" }, { id: 2, text: "d" }]
            }
        ]);

        this.instance.resources = [
            { field: "one", dataSource: [{ id: 1 }, { id: 2 }] },
            { field: "two", dataSource: [{ id: 1 }, { id: 2 }] }
        ];

        var resources = { one: [1, 2], two: [1, 2] },
            coords = this.instance.getCoordinatesByDateInGroup(new Date(2015, 2, 5, 2, 0), resources),
            $cells = $element.find(".dx-scheduler-date-table tbody td");

        $.each(coords, function(index, coordinate) {
            var position = $cells.eq(116 + index * 7).position();
            assert.equal(coordinate.top, position.top, "");
            assert.equal(coordinate.left, position.left, "");
        });
    });

    QUnit.test("Get date range", function(assert) {
        this.instance.option("firstDayOfWeek", 1);
        this.instance.option("currentDate", new Date(2015, 2, 16));

        assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 16, 0, 0), new Date(2015, 2, 22, 23, 59)], "Range is OK");
    });

    QUnit.test("Date range should be correct if startDayHour & endDayHour are defined", function(assert) {
        this.instance.option({
            "firstDayOfWeek": 1,
            "currentDate": new Date(2015, 2, 16),
            startDayHour: 2,
            endDayHour: 3
        });

        assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 16, 2, 0), new Date(2015, 2, 22, 2, 59)], "Range is OK");
    });

    QUnit.test("Each cell should contain jQuery dxCellData depend on start day hour", function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 2, 16),
            firstDayOfWeek: 1,
            startDayHour: 5
        });

        var $cell = this.instance.$element().find("." + CELL_CLASS).eq(8);

        assert.deepEqual($cell.data("dxCellData"), {
            startDate: new Date(2015, 2, 17, 5, 30),
            endDate: new Date(2015, 2, 17, 6, 0),
            allDay: false
        });
    });

    QUnit.test("Each cell should contain jQuery dxCellData depend on end day hour", function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 2, 4),
            firstDayOfWeek: 1,
            endDayHour: 10
        });

        var $cell = this.instance.$element().find("." + CELL_CLASS).eq(8);

        assert.deepEqual($cell.data("dxCellData"), {
            startDate: new Date(2015, 2, 3, 0, 30),
            endDate: new Date(2015, 2, 3, 1, 0),
            allDay: false
        });
    });

    QUnit.test("getCoordinatesByDate should return right coordinates for all day appointments", function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 2, 4),
            firstDayOfWeek: 1,
            startDayHour: 4,
            showAllDayPanel: true
        });

        var $cell = this.instance.$element().find(".dx-scheduler-all-day-table-cell").eq(4),
            cellPosition = $cell.position();

        var coordinates = this.instance.getCoordinatesByDate(new Date(2015, 2, 6), 0, true);

        assert.equal(coordinates.left, cellPosition.left);
    });

    QUnit.test("getCoordinatesByDate should return rowIndex and cellIndex", function(assert) {
        this.instance.option("currentDate", new Date(2015, 2, 4));

        var coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 4, 2, 45));

        assert.equal(coords.rowIndex, 5, "Row index is OK");
        assert.equal(coords.cellIndex, 3, "Cell index is OK");
    });

    QUnit.test("Get first view date", function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 5, 30),
            firstDayOfWeek: 1,
            startDayHour: 4
        });

        assert.deepEqual(this.instance.getStartViewDate(), new Date(2015, 5, 29, 4), "First view date is OK");
    });

    QUnit.test("Get cellData by coordinates", function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 5, 30),
            firstDayOfWeek: 1,
            endDayHour: 10
        });

        var cellData = {
            allDay: false,
            endDate: new Date(2015, 5, 29, 1, 30),
            startDate: new Date(2015, 5, 29, 1, 0)
        };

        assert.deepEqual(this.instance.getCellDataByCoordinates({ top: 100, left: 100 }, false), cellData, "Cell data is OK");
    });

    QUnit.test("Cell data should be correct if DST makes sense (T442904)", function(assert) {
        // can be reproduced in PST timezone
        this.instance.option({
            currentDate: new Date(2016, 10, 6),
            firstDayOfWeek: 0,
            startDayHour: 1
        });

        var cellData = this.instance.$element().find(".dx-scheduler-date-table-row").eq(1).find(".dx-scheduler-date-table-cell").eq(0).data("dxCellData");

        assert.equal(cellData.startDate.toString(), new Date(2016, 10, 6, 1, 30).toString(), "Start date is OK");
        assert.equal(cellData.endDate.toString(), new Date(2016, 10, 6, 2).toString(), "End date is OK");
    });

    QUnit.test("Get allDay cellData by coordinates", function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 5, 30),
            firstDayOfWeek: 1,
            endDayHour: 10,
            allDayExpanded: true
        });

        var cellData = {
            allDay: true,
            endDate: new Date(2015, 5, 30, 0),
            startDate: new Date(2015, 5, 29, 0)
        };

        assert.deepEqual(this.instance.getCellDataByCoordinates({ top: 51, left: 100 }, true), cellData, "Cell data is OK");
    });

    QUnit.test("Get last view date", function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 5, 30),
            firstDayOfWeek: 1,
            endDayHour: 10
        });

        assert.deepEqual(this.instance.getEndViewDate(), new Date(2015, 6, 5, 9, 59), "Last view date is OK");
    });

    QUnit.test("Get visible bounds", function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 5, 30),
            firstDayOfWeek: 1,
            startDayHour: 1,
            height: 410,
            showAllDayPanel: true,
            allDayExpanded: true
        });

        this.instance.$element().css("padding", 0);

        var scrollable = this.instance.getScrollable();

        domUtils.triggerShownEvent(this.instance.$element());

        scrollable.scrollBy(0);

        var bounds = this.instance.getVisibleBounds();

        assert.deepEqual(bounds.top, { hours: 1, minutes: 0 }, "Top bound is OK");
        assert.deepEqual(bounds.bottom, { hours: 3, minutes: 30 }, "Bottom bound is OK");
    });

    QUnit.test("Get visible bounds if scroll position is not null", function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 5, 30),
            firstDayOfWeek: 1,
            startDayHour: 1,
            height: 700,
            showAllDayPanel: true,
            allDayExpanded: true
        });

        var scrollable = this.instance.getScrollable();

        domUtils.triggerShownEvent(this.instance.$element());

        scrollable.scrollBy(220);

        var bounds = this.instance.getVisibleBounds();

        assert.deepEqual(bounds.top, { hours: 3, minutes: 30 }, "Top bound is OK");
        assert.deepEqual(bounds.bottom, { hours: 8, minutes: 0 }, "Bottom bound is OK");
    });

    QUnit.test("Get visible bounds if hoursInterval is set", function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 2, 2),
            firstDayOfWeek: 1,
            startDayHour: 1,
            height: 700,
            showAllDayPanel: true,
            allDayExpanded: true,
            hoursInterval: 1.5
        });
        var scrollable = this.instance.getScrollable(),
            bounds = this.instance.getVisibleBounds();

        scrollable = this.instance.getScrollable();

        domUtils.triggerShownEvent(this.instance.$element());

        scrollable.scrollBy(200);

        bounds = this.instance.getVisibleBounds();

        assert.deepEqual(bounds.top, { hours: 7, minutes: 0 }, "Top bound is OK");
        assert.deepEqual(bounds.bottom, { hours: 22, minutes: 0 }, "Bottom bound is OK");

    });

    QUnit.test("the getDistanceBetweenCells method", function(assert) {
        this.instance.option("width", 700);
        this.instance.$element().find(".dx-scheduler-date-table-cell").css("width", 100);

        var distance = this.instance.getDistanceBetweenCells(2, 4);
        assert.equal(distance, 300, "distance is OK");
    });

    QUnit.test("Cells of week after the DST switch should have right date", function(assert) {
        var spy = sinon.spy(dateUtils, "getTimezonesDifference");

        this.instance.option({
            currentDate: new Date(2016, 2, 14)
        });

        assert.equal(spy.callCount, 343);
        spy.restore();
    });
})("Work Space Week");

(function() {

    QUnit.module("Work Space Work Week", {
        beforeEach: function() {
            this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceWorkWeek().dxSchedulerWorkSpaceWorkWeek("instance");
            stubInvokeMethod(this.instance);
        }
    });

    QUnit.test("Scheduler workspace work week should have a right css class", function(assert) {
        var $element = this.instance.$element();

        assert.ok($element.hasClass("dx-scheduler-work-space-work-week"), "dxSchedulerWorkSpaceWorkWeek has 'dx-scheduler-workspace-work-week' css class");
    });

    QUnit.test("Scheduler all day panel should contain one row & 5 cells", function(assert) {
        this.instance.option("showAllDayPanel", true);

        var $allDayPanel = this.instance.$element().find(".dx-scheduler-all-day-panel");

        assert.equal($allDayPanel.find("tbody tr").length, 1, "All day panel contains 1 row");
        assert.equal($allDayPanel.find("tbody tr>td").length, 5, "All day panel contains 5 cell");
    });

    QUnit.test("Scheduler workspace work week view", function(assert) {
        var $element = this.instance.$element(),
            cellCounter = 0;

        assert.equal($element.find(".dx-scheduler-date-table tbody tr").length, 48, "Date table has 48 rows");
        assert.equal($element.find(".dx-scheduler-date-table tbody tr>td").length, 240, "Date table has 240 cells");

        $element.find(".dx-scheduler-date-table tbody tr").each(function() {
            if($(this).find("td").length === 5) {
                cellCounter++;
            }
        });

        assert.equal(cellCounter, 48, "Each row has a five cells");
    });

    QUnit.test("Scheduler workspace work week grouped view", function(assert) {
        var $element = this.instance.$element(),
            cellCounter = 0;

        this.instance.option("groups", [{ name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] }]);

        assert.equal($element.find(".dx-scheduler-date-table tbody tr").length, 48, "Date table has 48 rows");
        assert.equal($element.find(".dx-scheduler-date-table tbody tr>td").length, 480, "Date table has 480 cells");

        $element.find(".dx-scheduler-date-table tbody tr").each(function() {
            if($(this).find("td").length === 10) {
                cellCounter++;
            }
        });

        assert.equal(cellCounter, 48, "Each row has a ten cells");
    });

    QUnit.test("Scheduler workspace work week view should contain a 5 headers", function(assert) {
        var currentDate = new Date(),
            $element = this.instance.$element(),
            weekStartDate = new Date(currentDate).getDate() - (new Date(currentDate).getDay() - 1),
            $headerCells = $element.find(".dx-scheduler-header-panel-cell");

        assert.equal($headerCells.length, 5, "Date table has 5 header cells");

        $headerCells.each(function(index, cell) {
            var date = new Date(currentDate);
            date.setDate(weekStartDate + index);
            assert.equal($(cell).text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[(index + 1) % 7].toLowerCase() + " " + date.getDate(), "Header has a right text");
        });
    });

    QUnit.test("Scheduler workspace work week grouped view should contain a few headers", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("groups", [
            {
                name: "one",
                items: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
            },
            {
                name: "two",
                items: [{ id: 1, text: "c" }, { id: 2, text: "d" }]
            }
        ]);

        var $headerCells = $element.find(".dx-scheduler-header-row th");

        assert.equal($headerCells.length, 20, "Date table has 20 header cells");
        assert.equal($element.find(".dx-scheduler-group-row").eq(0).find("th").attr("colspan"), "10", "Group header has a right 'colspan'");
        assert.equal($element.find(".dx-scheduler-group-row").eq(1).find("th").attr("colspan"), "5", "Group header has a right 'colspan'");
    });

    QUnit.test("Scheduler workspace work week view should be correct with any first day of week", function(assert) {
        var instance = $("#scheduler-work-space").dxSchedulerWorkSpaceWorkWeek({
            firstDayOfWeek: 2,
            currentDate: new Date(2015, 1, 4)
        }).dxSchedulerWorkSpaceWorkWeek("instance");

        var $element = instance.$element();

        var $headerCells = $element.find(".dx-scheduler-header-row th");

        assert.equal($headerCells.first().text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[2].toLowerCase() + " 3", "first header has a right text");
        assert.equal($headerCells.eq(3).text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[5].toLowerCase() + " 6", "4 header has a right text");
        assert.equal($headerCells.last().text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[1].toLowerCase() + " 9", "last header has a right text");
    });

    QUnit.test("Scheduler workspace work week view should be correct, if currentDate is Sunday", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("firstDayOfWeek", 0);
        this.instance.option("currentDate", new Date(2016, 0, 10));

        var $headerCells = $element.find(".dx-scheduler-header-row th");

        assert.equal($headerCells.first().text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[1].toLowerCase() + " 11", "first header has a right text");
        assert.equal($headerCells.eq(2).text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[3].toLowerCase() + " 13", "3 header has a right text");
        assert.equal($headerCells.last().text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[5].toLowerCase() + " 15", "last header has a right text");
    });

    QUnit.test("Scheduler workspace work week view should be correct with any first day of week, if currentDate is Sunday", function(assert) {
        var instance = $("#scheduler-work-space").dxSchedulerWorkSpaceWorkWeek({
            currentDate: new Date(2016, 0, 10),
            firstDayOfWeek: 3
        }).dxSchedulerWorkSpaceWorkWeek("instance");

        var $element = instance.$element();

        var $headerCells = $element.find(".dx-scheduler-header-row th");

        assert.equal($headerCells.first().text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[3].toLowerCase() + " 6", "first header has a right text");
        assert.equal($headerCells.eq(2).text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[5].toLowerCase() + " 8", "3 header has a right text");
        assert.equal($headerCells.last().text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[2].toLowerCase() + " 12", "last header has a right text");
    });

    QUnit.test("Time panel should have 24 rows and 24 cells", function(assert) {
        checkRowsAndCells(this.instance.$element(), assert);
    });

    QUnit.test("Work space should find cell coordinates by date", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("currentDate", new Date(2015, 2, 4));
        var coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 5, 2, 0));
        assert.equal(coords.top, $element.find(".dx-scheduler-date-table tbody td").eq(23).position().top, "Cell coordinates are right");
        assert.equal(coords.left, $element.find(".dx-scheduler-date-table tbody td").eq(23).position().left, "Cell coordinates are right");
    });

    QUnit.test("Work space should find cell coordinates by date depend on start day hour", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("currentDate", new Date(2015, 2, 4));
        this.instance.option("startDayHour", 5);
        this.instance.option("firstDayOfWeek", 7);

        var coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 5, 6, 0));
        assert.equal(coords.top, $element.find(".dx-scheduler-date-table tbody td").eq(14).position().top, "Cell coordinates are right");
        assert.equal(coords.left, $element.find(".dx-scheduler-date-table tbody td").eq(14).position().left, "Cell coordinates are right");
    });

    QUnit.test("Work space should find cell coordinates by date depend on end day hour", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("currentDate", new Date(2015, 2, 4));
        this.instance.option("endDayHour", 10);
        this.instance.option("firstDayOfWeek", 1);

        var coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 5, 0, 30));
        assert.equal(coords.top, $element.find(".dx-scheduler-date-table tbody td").eq(8).position().top, "Cell coordinates are right");
        assert.equal(coords.left, $element.find(".dx-scheduler-date-table tbody td").eq(8).position().left, "Cell coordinates are right");
    });

    QUnit.test("Get date range", function(assert) {
        this.instance.option("firstDayOfWeek", 1);
        this.instance.option("currentDate", new Date(2015, 2, 16));

        assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 16, 0, 0), new Date(2015, 2, 20, 23, 59)], "Range is OK");
    });

})("Work Space Work Week");

(function() {

    QUnit.module("Work Space Month", {
        beforeEach: function() {
            this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth().dxSchedulerWorkSpaceMonth("instance");
            stubInvokeMethod(this.instance);
        }
    });

    QUnit.test("Scheduler workspace month should have a right css class", function(assert) {
        var $element = this.instance.$element();

        assert.ok($element.hasClass("dx-scheduler-work-space-month"), "dxSchedulerWorkSpaceMonth has 'dx-scheduler-workspace-month' css class");
    });

    QUnit.test("Scheduler all day panel should not contain rows & cells", function(assert) {
        var $allDayPanel = this.instance.$element().find(".dx-scheduler-all-day-panel");

        assert.equal($allDayPanel.find("tbody tr").length, 0, "All day panel does not contain rows");
    });

    QUnit.test("Scheduler all day panel is invisible on month view after switching showAllDayPanel option", function(assert) {
        this.instance.option("showAllDayPanel", false);
        this.instance.option("showAllDayPanel", true);

        var $allDayPanel = this.instance.$element().find(".dx-scheduler-all-day-panel");

        assert.equal($allDayPanel.css("display"), "none", "allDay panel is invisible");
    });

    QUnit.test("Scheduler all day panel is invisible on month view after switching showAllDayPanel option", function(assert) {
        this.instance.option("showAllDayPanel", false);
        this.instance.option("showAllDayPanel", true);

        var $allDayTitle = this.instance.$element().find(".dx-scheduler-all-day-title");

        assert.equal($allDayTitle.css("display"), "none", "All-day title is invisible");
    });

    QUnit.test("Scheduler time panel should not contain rows & cells", function(assert) {
        var $timePanel = this.instance.$element().find(".dx-scheduler-time-panel");

        assert.equal($timePanel.find("tbody tr").length, 0, "Time panel does not contain rows");
    });

    QUnit.test("Scheduler workspace month view", function(assert) {
        var $element = this.instance.$element(),
            cellCounter = 0;

        assert.equal($element.find(".dx-scheduler-date-table tbody tr").length, 6, "Date table has 6 rows");
        assert.equal($element.find(".dx-scheduler-date-table tbody tr>td").length, 42, "Date table has 42 cells");

        $element.find(".dx-scheduler-date-table tbody tr").each(function() {
            if($(this).find("td").length === 7) {
                cellCounter++;
            }
        });

        assert.equal(cellCounter, 6, "Each row has a seven cells");
    });

    QUnit.test("Scheduler workspace month grouped view", function(assert) {
        var $element = this.instance.$element(),
            cellCounter = 0;

        this.instance.option("currentDate", new Date(2015, 2, 5));
        this.instance.option("firstDayOfWeek", 1);

        this.instance.option("groups", [{ name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }, { id: 3, text: "c" }] }]);

        assert.equal($element.find(".dx-scheduler-date-table tbody tr").length, 6, "Date table has 6 rows");
        assert.equal($element.find(".dx-scheduler-date-table tbody tr>td").length, 126, "Date table has 126 cells");

        $element.find(".dx-scheduler-date-table tbody tr").each(function() {
            if($(this).find("td").length === 21) {
                cellCounter++;
            }
        });

        assert.equal(cellCounter, 6, "Each row has a 21 cells");
        assert.equal($element.find(".dx-scheduler-date-table tbody tr>td").eq(7).text(), "23", "Text is OK");
    });

    QUnit.test("Scheduler workspace month view should contain a 7 headers", function(assert) {
        var $element = this.instance.$element();

        var $headerCells = $element.find(".dx-scheduler-header-row th");

        assert.equal($headerCells.length, 7, "Date table has 7 header cells");

        $headerCells.each(function(index, cell) {
            assert.equal($(cell).text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[index % 7].toLowerCase(), "Header has a right text");
        });
    });

    QUnit.test("Scheduler workspace month grouped view should contain a few headers", function(assert) {
        var $element = this.instance.$element();
        this.instance.option("groups", [
            {
                name: "one",
                items: [{ id: 1, text: "a" }, { id: 2, text: "b" }, { id: 3, text: "c" }]
            },
            {
                name: "two",
                items: [{ id: 1, text: "d" }, { id: 2, text: "e" }, { id: 3, text: "f" }]
            }
        ]);

        var $headerCells = $element.find(".dx-scheduler-header-row th");

        assert.equal($headerCells.length, 63, "Date table has 63 header cells");
        assert.equal($element.find(".dx-scheduler-group-row").eq(0).find("th").attr("colspan"), 21, "Group header has a right 'colspan'");
        assert.equal($element.find(".dx-scheduler-group-row").eq(1).find("th").attr("colspan"), 7, "Group header has a right 'colspan'");
    });

    QUnit.test("Scheduler workspace month view should have a right date in each cell", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("currentDate", new Date(2015, 2, 1));
        this.instance.option("firstDayOfWeek", 1);

        var firstDate = new Date(2015, 1, 23);

        $element.find(".dx-scheduler-date-table tr>td").each(function(index, cell) {
            var date = new Date(firstDate);
            date.setDate(firstDate.getDate() + index);
            assert.equal($(cell).text(), dateLocalization.format(date, "dd"), "Cell has a right date");
        });
    });

    QUnit.test("Scheduler workspace month view should have a date with current-date class", function(assert) {
        var $element = this.instance.$element();

        var currentDate = new Date(),
            $cell = $element.find(".dx-scheduler-date-table-current-date");

        this.instance.option("currentDate", currentDate);

        assert.equal(parseInt($cell.text(), 10), currentDate.getDate().toString(), "Cell text is correct");
    });

    QUnit.test("Scheduler workspace month view should have a dates with other-month class", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("currentDate", new Date(2015, 2, 1));

        var $cells = $element.find(".dx-scheduler-date-table-other-month");
        assert.equal($cells.length, 11, "Other-month cells count is correct");
    });

    // QUnit.test("Scheduler workspace month view should have a dates with other-month class, if startDate is set", function(assert) {
    //     var $element = this.instance.$element();

    //     this.instance.option("currentDate", new Date(2015, 2, 1));
    //     this.instance.option("startDate", new Date(2015, 5, 1));

    //     var $cells = $element.find(".dx-scheduler-date-table-other-month");
    //     assert.equal($cells.length, 12, "Other-month cells count is correct");
    // });

    // QUnit.test("Scheduler workspace month view should have a dates with other-month class, if startDate & intervalCount is set", function(assert) {
    //     var $element = this.instance.$element();

    //     this.instance.option("currentDate", new Date(2015, 2, 1));
    //     this.instance.option("startDate", new Date(2015, 11, 1));
    //     this.instance.option("intervalCount", 3);

    //     var $cells = $element.find(".dx-scheduler-date-table-other-month");
    //     assert.equal($cells.length, 7, "Other-month cells count is correct");
    // });

    QUnit.test("Scheduler workspace should have a right first day of week", function(assert) {
        var $element = this.instance.$element();

        var days = dateLocalization.getDayNames("abbreviated");
        var firstCellHeader = $element.find(".dx-scheduler-header-panel thead tr>th").first().text();

        assert.equal(firstCellHeader.toLowerCase(), days[0].toLowerCase(), "Workspace has a right first day of week by default");

        this.instance.option("firstDayOfWeek", 2);

        firstCellHeader = $element.find(".dx-scheduler-header-panel thead tr>th").first().text();

        assert.equal(firstCellHeader.toLowerCase(), days[this.instance.option("firstDayOfWeek")].toLowerCase(), "Workspace has a right first day of week when option was changed");
    });

    QUnit.test("Work space should find cell coordinates by date", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("firstDayOfWeek", 1);
        this.instance.option("currentDate", new Date(2015, 2, 4));

        var coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 5, 0, 0)),
            expectedCoordinates = $element.find(".dx-scheduler-date-table tbody td").eq(10).position();

        assert.roughEqual(coords.top, Math.floor(expectedCoordinates.top), 1.001, "Cell coordinates are right");
        assert.equal(coords.left, expectedCoordinates.left, "Cell coordinates are right");
    });

    QUnit.test("Work space should find cell coordinates by date depend on start day hour", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("currentDate", new Date(2015, 2, 4));
        this.instance.option("firstDayOfWeek", 7);
        this.instance.option("startDayHour", 5);

        var coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 5, 6, 0));
        assert.equal(coords.top, $element.find(".dx-scheduler-date-table tbody td").eq(4).position().top, "Cell coordinates are right");
        assert.equal(coords.left, $element.find(".dx-scheduler-date-table tbody td").eq(4).position().left, "Cell coordinates are right");
    });

    QUnit.test("Work space should find cell coordinates by date depend on end day hour", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("currentDate", new Date(2015, 2, 4));
        this.instance.option("firstDayOfWeek", 7);
        this.instance.option("endDayHour", 10);

        var coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 5, 6, 0));
        assert.equal(coords.top, $element.find(".dx-scheduler-date-table tbody td").eq(4).position().top, "Cell coordinates are right");
        assert.equal(coords.left, $element.find(".dx-scheduler-date-table tbody td").eq(4).position().left, "Cell coordinates are right");
    });

    QUnit.test("Get date range", function(assert) {
        this.instance.option("firstDayOfWeek", 1);
        this.instance.option("currentDate", new Date(2015, 2, 16));

        assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 1, 23, 0, 0), new Date(2015, 3, 5, 23, 59)], "Range is OK");
    });

    QUnit.test("Get date range when startDayHour & endDayHour are specified", function(assert) {
        this.instance.option({
            firstDayOfWeek: 1,
            currentDate: new Date(2015, 2, 16),
            startDayHour: 8,
            endDayHour: 20
        });
        this.instance.option("currentDate", new Date(2015, 2, 16));

        assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 1, 23, 8, 0), new Date(2015, 3, 5, 19, 59)], "Range is OK");
    });

    QUnit.test("Each cell should contain jQuery dxCellData depend on start day hour", function(assert) {

        this.instance.option({
            currentDate: new Date(2015, 2, 16),
            firstDayOfWeek: 1,
            startDayHour: 5
        });

        var $cell = this.instance.$element().find("." + CELL_CLASS).eq(0);

        assert.deepEqual($cell.data("dxCellData"), {
            startDate: new Date(2015, 1, 23, 5, 0),
            endDate: new Date(2015, 1, 24, 0, 0),
            allDay: undefined
        });
    });

    QUnit.test("Each cell should contain jQuery dxCellData depend on end day hour", function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 2, 16),
            firstDayOfWeek: 1,
            endDayHour: 10
        });

        var $cell = this.instance.$element().find("." + CELL_CLASS).eq(0);

        assert.deepEqual($cell.data("dxCellData"), {
            startDate: new Date(2015, 1, 23, 0, 0),
            endDate: new Date(2015, 1, 23, 10, 0),
            allDay: undefined
        });
    });

    QUnit.test("getCoordinateByDates should return coordinates depend on appointment duration", function(assert) {
        var ws = this.instance;

        ws.option({
            currentDate: new Date(2015, 2, 16),
            firstDayOfWeek: 1
        });
        var $cells = ws.$element().find(".dx-scheduler-date-table-cell"),
            coordinates = ws.getCoordinatesByDates(new Date(2015, 2, 7), new Date(2015, 2, 28));

        var cells = [12, 14, 21, 28];

        $.each(coordinates, function(index, coordinate) {
            var $currentCell = $cells.eq(cells[index]),
                rowIndex = $currentCell.parent().index(),
                expectedCoordinate = $currentCell.position();

            if(rowIndex) {
                //! fix coordinate calculation in webkit
                expectedCoordinate.top = rowIndex * ws.getCellHeight();
            }

            assert.equal(coordinate.top, expectedCoordinate.top, "");
            assert.equal(coordinate.left, expectedCoordinate.left, "");
        });
    });

    QUnit.test("WorkSpace should calculate max left position", function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 2, 16),
            firstDayOfWeek: 1
        });

        var $lastCell = this.instance.$element().find(".dx-scheduler-date-table").find("td").eq(6);

        assert.deepEqual(this.instance.getMaxAllowedPosition(),
            [Math.round($lastCell.position().left + $lastCell.outerWidth())], "Max left position is correct");
    });

    QUnit.test("Grouped work space should calculate max left position", function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 2, 16),
            firstDayOfWeek: 1,
            groups: [{
                name: "one",
                items: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
            },
            {
                name: "two",
                items: [{ id: 1, text: "c" }, { id: 2, text: "d" }]
            }]
        });

        var $cells = this.instance.$element().find(".dx-scheduler-date-table tr").first().find("td"),
            $firstGroupLastCell = $cells.eq(6),
            $secondGroupLastCell = $cells.eq(13),
            $thirdGroupLastCell = $cells.eq(20),
            $fourthGroupLastCell = $cells.eq(27);

        assert.deepEqual(this.instance.getMaxAllowedPosition(),
            [
                Math.round($firstGroupLastCell.position().left + $firstGroupLastCell.outerWidth()),
                Math.round($secondGroupLastCell.position().left + $secondGroupLastCell.outerWidth()),
                Math.round($thirdGroupLastCell.position().left + $thirdGroupLastCell.outerWidth()),
                Math.round($fourthGroupLastCell.position().left + $fourthGroupLastCell.outerWidth())
            ], "Max left positions are correct");
    });

    QUnit.test("Group width calculation", function(assert) {
        this.instance.option("groups", [{ name: "one", items: [{ id: 1, text: "a" }] }]);
        sinon.stub(this.instance, "getCellWidth").returns(50);

        assert.equal(this.instance.getGroupWidth(), 350, "Group width is OK");
    });

    QUnit.test("Get cell count to last view date", function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 2, 16),
            firstDayOfWeek: 1
        });

        assert.equal(this.instance.getCellCountToLastViewDate(new Date(2015, 2, 17)), 20, "Cell count is OK");
    });

    QUnit.test("Get cell count to last view date", function(assert) {
        var origGetFirstViewDate = this.instance.getStartViewDate;

        this.instance.getStartViewDate = function() {
            return new Date(2016, 1, 29, 6, 0);
        };

        try {
            this.instance.option({
                currentDate: new Date(2016, 2, 14, 0, 0),
                startDayHour: 5
            });

            var $cell = this.instance._getCells().eq(14);

            assert.deepEqual($cell.data("dxCellData"), {
                startDate: new Date(2016, 2, 14, 5, 0),
                endDate: new Date(2016, 2, 15, 0, 0),
                allDay: undefined
            }, "data of the cell is right");
        } finally {
            this.instance.getStartViewDate = origGetFirstViewDate;
        }
    });

})("Work Space Month");

(function() {

    QUnit.module("Workspace Keyboard Navigation");

    QUnit.test("Month workspace navigation by arrows", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
                focusStateEnabled: true
            }),
            keyboard = keyboardMock($element);

        $element.dxSchedulerWorkSpaceMonth("instance");

        $($element).trigger("focusin");
        var cells = $element.find("." + CELL_CLASS);
        assert.equal(cells.find("dx-state-focused").length, 0, "cells is not focused");

        keyboard.keyDown("down");
        assert.ok(cells.eq(7).hasClass("dx-state-focused"), "new cell is focused");
        assert.equal(cells.eq(7).attr("aria-label"), "Add appointment", "focused cell label is right");

        keyboard.keyDown("up");
        assert.ok(!cells.eq(7).hasClass("dx-state-focused"), "previous cell is not focused");
        assert.equal(cells.eq(7).attr("aria-label"), undefined, "previous cell  label is not exist");
        assert.ok(cells.eq(0).hasClass("dx-state-focused"), "new cell is focused");
        assert.equal(cells.eq(0).attr("aria-label"), "Add appointment", "focused cell label is right");

        keyboard.keyDown("right");
        assert.ok(!cells.eq(0).hasClass("dx-state-focused"), "previous cell is not focused");
        assert.ok(cells.eq(1).hasClass("dx-state-focused"), "new cell is focused");

        keyboard.keyDown("left");
        assert.ok(!cells.eq(1).hasClass("dx-state-focused"), "previous cell is not focused");
        assert.ok(cells.eq(0).hasClass("dx-state-focused"), "new cell is focused");
    });



    QUnit.test("Month workspace navigation by arrows, RTL mode", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
                focusStateEnabled: true,
                rtlEnabled: true
            }),
            keyboard = keyboardMock($element);

        $element.dxSchedulerWorkSpaceMonth("instance");

        $($element).trigger("focusin");
        var cells = $element.find("." + CELL_CLASS);

        keyboard.keyDown("left");
        assert.ok(!cells.eq(0).hasClass("dx-state-focused"), "previous cell is not focused");
        assert.ok(cells.eq(1).hasClass("dx-state-focused"), "new cell is focused");

        keyboard.keyDown("right");
        assert.ok(!cells.eq(1).hasClass("dx-state-focused"), "previous cell is not focused");
        assert.ok(cells.eq(0).hasClass("dx-state-focused"), "new cell is focused");
    });

    QUnit.test("Workspace should not loose focused cell after arrow key press", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
                focusStateEnabled: true
            }),
            keyboard = keyboardMock($element);

        $element.dxSchedulerWorkSpaceMonth("instance");

        var cells = $element.find("." + CELL_CLASS);
        $($element).trigger("focusin");
        assert.ok(cells.eq(0).hasClass("dx-state-focused"), "cell is focused");

        keyboard.keyDown("up");
        assert.ok(cells.eq(0).hasClass("dx-state-focused"), "cell is still focused");
    });


    QUnit.test("Workspace should scroll to focused cell during navigation", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceWeek({
                focusStateEnabled: true
            }),
            keyboard = keyboardMock($element);

        $element.dxSchedulerWorkSpaceWeek("instance");

        var scrollable = $element.find(".dx-scrollable").dxScrollable("instance"),
            scrollToElement = sinon.spy(scrollable, "scrollToElement");

        var cells = $element.find("." + CELL_CLASS);

        $($element).trigger("focusin");
        keyboard.keyDown("down");
        assert.ok(scrollToElement.getCall(0).args[0].is(cells.eq(7)), "scrollToElement is called with right args");

        keyboard.keyDown("up");
        assert.ok(scrollToElement.getCall(1).args[0].is(cells.eq(0)), "scrollToElement is called with right args");

        scrollable.scrollToElement.restore();
    });

    QUnit.test("Workspace should handle enter/space key", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
                focusStateEnabled: true,
                firstDayOfWeek: 1,
                currentDate: new Date(2015, 3, 1)
            }),
            keyboard = keyboardMock($element),
            instance = $element.dxSchedulerWorkSpaceMonth("instance"),
            updateSpy = sinon.spy(noop);

        instance.notifyObserver = updateSpy;

        $($element.find("." + CELL_CLASS).eq(0)).trigger("focusin");

        keyboard.keyDown("enter");
        assert.notOk(updateSpy.called, "enter is not handled");

        $($element).trigger("focusin");
        keyboard.keyDown("enter");
        assert.equal(updateSpy.getCall(0).args[0], "showAddAppointmentPopup", "Correct method of observer is called");

        assert.deepEqual(updateSpy.getCall(0).args[1], {
            startDate: new Date(2015, 2, 30),
            endDate: new Date(2015, 2, 31)
        }, "Arguments are OK");

        keyboard.keyDown("right");
        keyboard.keyDown("space");
        assert.equal(updateSpy.getCall(1).args[0], "showAddAppointmentPopup", "Correct method of observer is called");
        assert.deepEqual(updateSpy.getCall(1).args[1], {
            startDate: new Date(2015, 2, 31),
            endDate: new Date(2015, 3, 1)
        }, "Arguments are OK");
    });

    QUnit.test("Workspace should allow select several cells with shift & arrow", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
                focusStateEnabled: true,
                firstDayOfWeek: 1,
                currentDate: new Date(2015, 3, 1)
            }),
            keyboard = keyboardMock($element);

        var cells = $element.find("." + CELL_CLASS);

        $($element).trigger("focusin");
        keyboard.keyDown("right", { shiftKey: true });

        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
        assert.equal(cells.slice(0, 2).filter(".dx-state-focused").length, 2, "right cells are focused");

        keyboard.keyDown("down", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 9, "right quantity of focused cells");
        assert.equal(cells.slice(0, 9).filter(".dx-state-focused").length, 9, "right cells are focused");

        keyboard.keyDown("right");
        assert.equal(cells.filter(".dx-state-focused").length, 1, "right quantity of focused cells");
        assert.ok(cells.eq(9).hasClass("dx-state-focused"), "right cell is focused");

        keyboard.keyDown("up", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 8, "right quantity of focused cells");
        assert.equal(cells.slice(2, 10).filter(".dx-state-focused").length, 8, "right cells are focused");

        keyboard.keyDown("left", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 9, "right quantity of focused cells");
        assert.equal(cells.slice(1, 10).filter(".dx-state-focused").length, 9, " right cells are focused");
    });

    QUnit.test("Workspace should allow select/unselect cells with shift & right/left arrow", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
                focusStateEnabled: true,
                firstDayOfWeek: 1,
                currentDate: new Date(2015, 3, 1)
            }),
            keyboard = keyboardMock($element);

        var cells = $element.find("." + CELL_CLASS);

        pointerMock(cells.eq(10)).start().click();
        keyboard.keyDown("right", { shiftKey: true });

        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
        assert.equal(cells.slice(9, 12).filter(".dx-state-focused").length, 2, "right cells are focused");
        keyboard.keyDown("left", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 1, "right quantity of focused cells");
        assert.equal(cells.slice(9, 11).filter(".dx-state-focused").length, 1, "right cells are focused");

        keyboard.keyDown("left", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
        assert.equal(cells.slice(8, 11).filter(".dx-state-focused").length, 2, "right cells are focused");
        keyboard.keyDown("left", { shiftKey: true });
        keyboard.keyDown("left", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 4, "right quantity of focused cells");
        assert.equal(cells.slice(7, 11).filter(".dx-state-focused").length, 4, "right cells are focused");
        keyboard.keyDown("left", { shiftKey: true });
        keyboard.keyDown("left", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 6, "right quantity of focused cells");
        assert.equal(cells.slice(4, 11).filter(".dx-state-focused").length, 6, "right cells are focused");
    });

    QUnit.test("Workspace should allow select/unselect cells with shift & right/left arrow", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
                focusStateEnabled: true,
                firstDayOfWeek: 1,
                currentDate: new Date(2015, 3, 1)
            }),
            keyboard = keyboardMock($element);

        var cells = $element.find("." + CELL_CLASS);

        pointerMock(cells.eq(3)).start().click();
        keyboard.keyDown("left", { shiftKey: true });

        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
        assert.equal(cells.slice(2, 4).filter(".dx-state-focused").length, 2, "right cells are focused");
        keyboard.keyDown("right", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 1, "right quantity of focused cells");
        assert.equal(cells.slice(2, 4).filter(".dx-state-focused").length, 1, "right cells are focused");

        keyboard.keyDown("right", { shiftKey: true });
        keyboard.keyDown("right", { shiftKey: true });
        keyboard.keyDown("right", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 4, "right quantity of focused cells");
        keyboard.keyDown("right", { shiftKey: true });
        keyboard.keyDown("right", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 6, "right quantity of focused cells");
    });

    QUnit.test("Workspace should allow unselect cells with shift & up/down arrow", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
                focusStateEnabled: true,
                firstDayOfWeek: 1,
                currentDate: new Date(2015, 3, 1)
            }),
            keyboard = keyboardMock($element);

        var cells = $element.find("." + CELL_CLASS);

        pointerMock(cells.eq(7)).start().click();
        keyboard.keyDown("down", { shiftKey: true });
        keyboard.keyDown("down", { shiftKey: true });

        assert.equal(cells.filter(".dx-state-focused").length, 15, "right quantity of focused cells");
        assert.equal(cells.slice(7, 23).filter(".dx-state-focused").length, 15, "right cells are focused");
        keyboard.keyDown("up", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 8, "right quantity of focused cells");
        assert.equal(cells.slice(7, 16).filter(".dx-state-focused").length, 8, "right cells are focused");

        keyboard.keyDown("up", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 1, "right quantity of focused cells");
        assert.equal(cells.slice(7, 9).filter(".dx-state-focused").length, 1, "right cells are focused");

        keyboard.keyDown("up", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 8, "right quantity of focused cells");
        assert.equal(cells.slice(0, 8).filter(".dx-state-focused").length, 8, "right cells are focused");

        keyboard.keyDown("up", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 8, "right quantity of focused cells");
        assert.equal(cells.slice(0, 8).filter(".dx-state-focused").length, 8, "right cells are focused");

        keyboard.keyDown("down", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 1, "right quantity of focused cells");
        assert.equal(cells.slice(7, 9).filter(".dx-state-focused").length, 1, "right cells are focused");
    });

    QUnit.test("Focus shouldn't disappear when select cells with shift & down/right arrow", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
                focusStateEnabled: true,
                firstDayOfWeek: 1,
                currentDate: new Date(2015, 3, 1),
                height: 400
            }),
            keyboard = keyboardMock($element);

        var cells = $element.find("." + CELL_CLASS);

        pointerMock(cells.eq(28)).start().click();
        keyboard.keyDown("down", { shiftKey: true });
        keyboard.keyDown("down", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 8, "right quantity of focused cells");
        assert.equal(cells.slice(28, 42).filter(".dx-state-focused").length, 8, "right cells are focused");

        keyboard.keyDown("down", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 8, "right quantity of focused cells");
        assert.equal(cells.slice(28, 42).filter(".dx-state-focused").length, 8, "right cells are focused");

        pointerMock(cells.eq(40)).start().click();
        keyboard.keyDown("right", { shiftKey: true });
        keyboard.keyDown("right", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
        assert.equal(cells.slice(40, 42).filter(".dx-state-focused").length, 2, "right cells are focused");
    });

    QUnit.test("Workspace Week should allow select/unselect cells with shift & arrows", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceWeek({
                focusStateEnabled: true,
                firstDayOfWeek: 1,
                startDayHour: 3,
                endDayHour: 10,
                hoursInterval: 0.5,
                currentDate: new Date(2015, 3, 1)
            }),
            keyboard = keyboardMock($element);

        var cells = $element.find("." + CELL_CLASS);

        pointerMock(cells.eq(15)).start().click();

        keyboard.keyDown("down", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
        assert.equal(cells.slice(15, 23).filter(".dx-state-focused").length, 2, "right cells are focused");
        keyboard.keyDown("up", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 1, "right quantity of focused cells");
        assert.equal(cells.slice(15, 23).filter(".dx-state-focused").length, 1, "right cells are focused");
        keyboard.keyDown("up", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
        assert.equal(cells.slice(8, 16).filter(".dx-state-focused").length, 2, "right cells are focused");
        keyboard.keyDown("left", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 16, "right quantity of focused cells");
        keyboard.keyDown("right", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
        keyboard.keyDown("right", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 14, "right quantity of focused cells");
    });


    QUnit.test("Workspace Week should allow select/unselect cells with shift & arrows, RTL mode", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceWeek({
                focusStateEnabled: true,
                rtlEnabled: true,
                firstDayOfWeek: 1,
                startDayHour: 3,
                endDayHour: 10,
                hoursInterval: 0.5,
                currentDate: new Date(2015, 3, 1)
            }),
            keyboard = keyboardMock($element);

        var cells = $element.find("." + CELL_CLASS);

        pointerMock(cells.eq(14)).start().click();
        keyboard.keyDown("left", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 15, "right quantity of focused cells");
        keyboard.keyDown("up", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 14, "right quantity of focused cells");
        keyboard.keyDown("down", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 15, "right quantity of focused cells");
        keyboard.keyDown("down", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 16, "right quantity of focused cells");
        keyboard.keyDown("right", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
    });

    QUnit.test("Workspace should handle enter/space key for several selected cells", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
                focusStateEnabled: true,
                firstDayOfWeek: 1,
                currentDate: new Date(2015, 3, 1)
            }),
            keyboard = keyboardMock($element),
            instance = $element.dxSchedulerWorkSpaceMonth("instance"),
            updateSpy = sinon.spy(noop);

        instance.notifyObserver = updateSpy;

        $($element.find("." + CELL_CLASS).eq(0)).trigger("focusin");

        $($element).trigger("focusin");
        keyboard.keyDown("down", { shiftKey: true });
        keyboard.keyDown("enter");
        assert.equal(updateSpy.getCall(0).args[0], "showAddAppointmentPopup", "Correct method of observer is called");

        assert.deepEqual(updateSpy.getCall(0).args[1], {
            startDate: new Date(2015, 2, 30),
            endDate: new Date(2015, 3, 7)
        }, "Arguments are OK");

        keyboard.keyDown("right", { shiftKey: true });
        keyboard.keyDown("space");
        assert.equal(updateSpy.getCall(1).args[0], "showAddAppointmentPopup", "Correct method of observer is called");
        assert.deepEqual(updateSpy.getCall(1).args[1], {
            startDate: new Date(2015, 2, 30),
            endDate: new Date(2015, 3, 8)
        }, "Arguments are OK");
    });

    QUnit.test("Workspace shouldn't unselect selected cells with no shift & arrows", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
                focusStateEnabled: true,
                firstDayOfWeek: 1,
                currentDate: new Date(2015, 3, 1),
                height: 400
            }),
            keyboard = keyboardMock($element);

        var cells = $element.find("." + CELL_CLASS);

        $($element).trigger("focusin");
        keyboard.keyDown("down", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 8, "right quantity of focused cells");

        keyboard.keyDown("left");
        assert.equal(cells.filter(".dx-state-focused").length, 1, "right quantity of focused cells");
    });

    QUnit.test("Workspace with groups should allow select cells within one group", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
                focusStateEnabled: true,
                firstDayOfWeek: 1,
                currentDate: new Date(2015, 3, 1),
                height: 400
            }),
            instance = $element.dxSchedulerWorkSpaceMonth("instance"),
            keyboard = keyboardMock($element);

        stubInvokeMethod(instance),
        instance.option("groups", [{ name: "a", items: [{ id: 1, text: "a.1" }, { id: 2, text: "a.2" }] }]);

        var cells = $element.find("." + CELL_CLASS);

        pointerMock(cells.eq(6)).start().click();
        keyboard.keyDown("right", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
        assert.equal(cells.filter(".dx-state-focused").last().index(), 0, "right quantity of focused cells");
        $($element).trigger("focusout");

        pointerMock(cells.eq(13)).start().click();
        keyboard.keyDown("right", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
        assert.equal(cells.filter(".dx-state-focused").last().index(), 7, "right quantity of focused cells");
        $($element).trigger("focusout");

        pointerMock(cells.eq(7)).start().click();
        keyboard.keyDown("left", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 1, "right quantity of focused cells");
        assert.equal(cells.filter(".dx-state-focused").last().index(), 7, "right quantity of focused cells");
    });

    QUnit.test("Workspace with groups should allow select cells within one group, RTL mode", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
                focusStateEnabled: true,
                rtlEnabled: true,
                firstDayOfWeek: 1,
                currentDate: new Date(2015, 3, 1),
                height: 400
            }),
            instance = $element.dxSchedulerWorkSpaceMonth("instance"),
            keyboard = keyboardMock($element);

        stubInvokeMethod(instance),
        instance.option("groups", [{ name: "a", items: [{ id: 1, text: "a.1" }, { id: 2, text: "a.2" }] }]);

        var cells = $element.find("." + CELL_CLASS);

        pointerMock(cells.eq(7)).start().click();
        keyboard.keyDown("right", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 1, "right quantity of focused cells");
        assert.equal(cells.filter(".dx-state-focused").last().index(), 7, "right quantity of focused cells");
        $($element).trigger("focusout");

        pointerMock(cells.eq(14)).start().click();
        keyboard.keyDown("right", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
        assert.equal(cells.filter(".dx-state-focused").first().index(), 6, "right quantity of focused cells");
        $($element).trigger("focusout");

        pointerMock(cells.eq(6)).start().click();
        keyboard.keyDown("left", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
        assert.equal(cells.filter(".dx-state-focused").last().index(), 0, "right quantity of focused cells");
    });

    QUnit.test("Workspace should select/unselect cells in allDay panel with shift & arrows", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceWeek({
                focusStateEnabled: true,
                showAllDayPanel: true,
                firstDayOfWeek: 1,
                startDayHour: 3,
                endDayHour: 10,
                hoursInterval: 0.5,
                currentDate: new Date(2015, 3, 1)
            }),
            keyboard = keyboardMock($element);

        var cells = $element.find("." + ALL_DAY_TABLE_CELL_CLASS);

        pointerMock(cells.eq(2)).start().click();
        keyboard.keyDown("right", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
        assert.equal(cells.slice(2, 4).filter(".dx-state-focused").length, 2, "right cells are focused");

        keyboard.keyDown("left", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 1, "right quantity of focused cells");
        assert.equal(cells.slice(2, 3).filter(".dx-state-focused").length, 1, "right cells are focused");

        keyboard.keyDown("left", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
        assert.equal(cells.slice(1, 3).filter(".dx-state-focused").length, 2, "right cells are focused");

        keyboard.keyDown("down", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
        assert.equal(cells.slice(1, 3).filter(".dx-state-focused").length, 2, "right cells are focused");

        keyboard.keyDown("up", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
        assert.equal(cells.slice(1, 3).filter(".dx-state-focused").length, 2, "right cells are focused");
    });


    QUnit.test("Workspace Day should allow select/unselect cells with shift & arrows", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceDay({
                focusStateEnabled: true,
                startDayHour: 3,
                endDayHour: 10,
                hoursInterval: 0.5,
                currentDate: new Date(2015, 3, 1)
            }),
            keyboard = keyboardMock($element);

        var cells = $element.find("." + CELL_CLASS);

        pointerMock(cells.eq(2)).start().click();
        keyboard.keyDown("down", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
        assert.equal(cells.slice(2, 4).filter(".dx-state-focused").length, 2, "right cells are focused");

        keyboard.keyDown("up", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 1, "right quantity of focused cells");
        assert.equal(cells.slice(2, 4).filter(".dx-state-focused").length, 1, "right cells are focused");
        keyboard.keyDown("up", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
        assert.equal(cells.slice(1, 3).filter(".dx-state-focused").length, 2, "right cells are focused");
    });

    QUnit.test("Workspace Day with groups should allow select/unselect", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceDay({
                focusStateEnabled: true,
                startDayHour: 3,
                endDayHour: 10,
                hoursInterval: 0.5,
                currentDate: new Date(2015, 3, 1)
            }),
            instance = $element.dxSchedulerWorkSpaceDay("instance"),
            keyboard = keyboardMock($element);

        stubInvokeMethod(instance),
        instance.option("groups", [{ name: "a", items: [{ id: 1, text: "a.1" }, { id: 2, text: "a.2" }] }]);

        var cells = $element.find("." + CELL_CLASS);

        pointerMock(cells.eq(2)).start().click();
        keyboard.keyDown("down", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
        assert.equal(cells.slice(2, 5).filter(".dx-state-focused").length, 2, "right cells are focused");

        keyboard.keyDown("up", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 1, "right quantity of focused cells");
        assert.equal(cells.slice(2, 4).filter(".dx-state-focused").length, 1, "right cells are focused");

        keyboard.keyDown("up", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
        assert.equal(cells.slice(0, 3).filter(".dx-state-focused").length, 2, "right cells are focused");

        keyboard.keyDown("right", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
        assert.equal(cells.slice(0, 3).filter(".dx-state-focused").length, 2, "right cells are focused");

        keyboard.keyDown("left", { shiftKey: true });
        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
        assert.equal(cells.slice(0, 3).filter(".dx-state-focused").length, 2, "right cells are focused");
    });

    QUnit.test("Current focused cell should have 'dx-scheduler-focused-cell' css class", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
                focusStateEnabled: true,
                firstDayOfWeek: 1,
                currentDate: new Date(2015, 3, 1),
                height: 400
            }),

            keyboard = keyboardMock($element),
            cells = $element.find("." + CELL_CLASS);

        pointerMock(cells.eq(2)).start().click();
        assert.ok(cells.eq(2).hasClass("dx-scheduler-focused-cell"), "right quantity of focused cells");
        pointerMock(cells.eq(0)).start().click();
        assert.ok(cells.eq(0).hasClass("dx-scheduler-focused-cell"), "right quantity of focused cells");
        assert.notOk(cells.eq(2).hasClass("dx-scheduler-focused-cell"), "right quantity of focused cells");
        keyboard.keyDown("right", { shiftKey: true });
        assert.ok(cells.eq(1).hasClass("dx-scheduler-focused-cell"), "right quantity of focused cells");
        assert.notOk(cells.eq(0).hasClass("dx-scheduler-focused-cell"), "right quantity of focused cells");
        keyboard.keyDown("down", { shiftKey: true });
        assert.ok(cells.eq(8).hasClass("dx-scheduler-focused-cell"), "right quantity of focused cells");
        assert.notOk(cells.eq(1).hasClass("dx-scheduler-focused-cell"), "right quantity of focused cells");
    });

    QUnit.test("Focus should work right after focusout", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
                focusStateEnabled: true,
                firstDayOfWeek: 1,
                currentDate: new Date(2015, 3, 1),
                height: 400
            }),

            cells = $element.find("." + CELL_CLASS);

        pointerMock(cells.eq(10)).start().click();
        assert.ok(cells.eq(10).hasClass("dx-scheduler-focused-cell"), "right focused cell");
        $($element).trigger("focusout");
        $($element).trigger("focusin");
        assert.ok(cells.eq(10).hasClass("dx-scheduler-focused-cell"), "right focused cell");
    });

    QUnit.test("It should not be possible to select cells via keyboard if the allowMultipleCellSelection option is false", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
            focusStateEnabled: true,
            firstDayOfWeek: 1,
            currentDate: new Date(2015, 3, 1),
            height: 400,
            allowMultipleCellSelection: false
        });

        var cells = $element.find("." + CELL_CLASS);

        pointerMock(cells.eq(2)).start().click();
        keyboardMock($element).keyDown("down", { shiftKey: true });

        assert.equal(cells.filter(".dx-state-focused").length, 1, "right quantity of focused cells");
    });

    QUnit.test("It should not be possible to select cells via mouse if the allowMultipleCellSelection option is false", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
            focusStateEnabled: true,
            firstDayOfWeek: 1,
            currentDate: new Date(2015, 3, 1),
            height: 400,
            allowMultipleCellSelection: false
        });

        var cells = $element.find("." + CELL_CLASS),
            cell = cells.eq(23).get(0),
            $table = $element.find(".dx-scheduler-date-table");

        pointerMock(cells.eq(2)).start().click();
        $($table).trigger($.Event("dxpointermove", { target: cell, toElement: cell, which: 1 }));

        assert.equal(cells.filter(".dx-state-focused").length, 1, "right quantity of focused cells");
    });

})("Workspace Keyboard Navigation");


(function() {
    QUnit.module("Workspace Mouse Interaction");

    QUnit.test("Pointer move propagation should be stopped", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceWeek({
            focusStateEnabled: true,
            firstDayOfWeek: 1,
            startDayHour: 3,
            endDayHour: 7,
            hoursInterval: 0.5,
            currentDate: new Date(2015, 3, 1)
        });

        var cells = $element.find("." + CELL_CLASS),
            $table = $element.find(".dx-scheduler-date-table");

        pointerMock(cells.eq(15)).start().click();

        $($table).on("dxpointermove", "td", function(e) {
            assert.ok(e.isDefaultPrevented(), "default is prevented");
            assert.ok(e.isPropagationStopped(), "propagation is stopped");
        });

        $($table).trigger($.Event("dxpointerdown", { target: cells.eq(15).get(0), which: 1, pointerType: "mouse" }));
        $($table).trigger($.Event("dxpointermove", { target: cells.eq(16).get(0), which: 1 }));

    });

    QUnit.test("Workspace should add/remove specific class while mouse selection", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceWeek({
            focusStateEnabled: true,
            firstDayOfWeek: 1,
            startDayHour: 3,
            endDayHour: 7,
            hoursInterval: 0.5,
            currentDate: new Date(2015, 3, 1)
        });

        var cells = $element.find("." + CELL_CLASS),
            cell = cells.eq(23).get(0),
            $table = $element.find(".dx-scheduler-date-table");

        $($table).trigger($.Event("dxpointerdown", { target: cells.eq(15).get(0), which: 1, pointerType: "mouse" }));

        assert.ok($element.hasClass("dx-scheduler-work-space-mouse-selection"), "right first focused cell");

        $($table).trigger($.Event("dxpointermove", { target: cell, which: 1 }));
        $($table).trigger($.Event("dxpointerup", { target: cell, which: 1 }));

        assert.notOk($element.hasClass("dx-scheduler-work-space-mouse-selection"), "right first focused cell");
    });

    QUnit.test("Workspace Week should allow select/unselect cells with mouse", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceWeek({
            focusStateEnabled: true,
            firstDayOfWeek: 1,
            startDayHour: 3,
            endDayHour: 7,
            hoursInterval: 0.5,
            currentDate: new Date(2015, 3, 1)
        });

        var cells = $element.find("." + CELL_CLASS),
            cell = cells.eq(23).get(0),
            $table = $element.find(".dx-scheduler-date-table");

        pointerMock(cells.eq(15)).start().click();

        $($table).trigger($.Event("dxpointerdown", { target: cells.eq(15).get(0), which: 1, pointerType: "mouse" }));

        $($table).trigger($.Event("dxpointermove", { target: cell, which: 1 }));

        assert.equal(cells.filter(".dx-state-focused").length, 10, "right quantity of focused cells");
        assert.ok(cells.eq(15).hasClass("dx-state-focused"), "right first focused cell");
        assert.ok(cells.eq(23).hasClass("dx-state-focused"), "right last focused cell");

        cell = cells.eq(22).get(0);

        $($table).trigger($.Event("dxpointermove", { target: cell, which: 1 }));

        assert.equal(cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
        assert.ok(cells.eq(15).hasClass("dx-state-focused"), "right first focused cell");
        assert.ok(cells.eq(22).hasClass("dx-state-focused"), "right last focused cell");

        cell = cells.eq(21).get(0);

        $($table).trigger($.Event("dxpointermove", { target: cell, which: 1 }));

        assert.equal(cells.filter(".dx-state-focused").length, 8, "right quantity of focused cells");
        assert.ok(cells.eq(21).hasClass("dx-state-focused"), "right first focused cell");
        assert.ok(cells.eq(15).hasClass("dx-state-focused"), "right last focused cell");

        $($table).trigger($.Event("dxpointerup", { target: cell, which: 1 }));
    });

    QUnit.test("Workspace with groups should allow select cells within one group via mouse", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
                focusStateEnabled: true,
                firstDayOfWeek: 1,
                startDayHour: 3,
                endDayHour: 7,
                hoursInterval: 0.5,
                currentDate: new Date(2015, 3, 1),
                height: 400
            }),
            instance = $element.dxSchedulerWorkSpaceMonth("instance");

        stubInvokeMethod(instance),
        instance.option("groups", [{ name: "a", items: [{ id: 1, text: "a.1" }, { id: 2, text: "a.2" }] }]);

        var cells = $element.find("." + CELL_CLASS);

        pointerMock(cells.eq(15)).start().click();

        var cell = cells.eq(20).get(0),
            $table = $element.find(".dx-scheduler-date-table");

        $($table).trigger($.Event("dxpointerdown", { target: cells.eq(15).get(0), which: 1, pointerType: "mouse" }));

        $($table).trigger($.Event("dxpointermove", { target: cell, which: 1 }));

        var $focusedCells = cells.filter(".dx-state-focused");
        assert.equal($focusedCells.length, 6, "right quantity of focused cells");

        cell = cells.eq(22).get(0);

        $($table).trigger($.Event("dxpointermove", { target: cell, which: 1 }));

        assert.equal(cells.filter(".dx-state-focused").length, 6, "right quantity of focused cells");

        $($table).trigger($.Event("dxpointerup", { target: cell, which: 1 }));
    });

    QUnit.test("Workspace should handle pointerdown by only left mouse key", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
            focusStateEnabled: true
        });

        $element.dxSchedulerWorkSpaceMonth("instance");

        var cells = $element.find("." + CELL_CLASS);

        cells.eq(0).trigger($.Event("dxpointerdown", { which: 1, pointerType: "mouse" }));
        assert.ok(cells.eq(0).hasClass("dx-state-focused"), "cell is focused");

        cells.eq(1).trigger($.Event("dxpointerdown", { which: 2, pointerType: "mouse" }));
        assert.notOk(cells.eq(1).hasClass("dx-state-focused"), "focused cell is not changed");
        assert.ok(cells.eq(0).hasClass("dx-state-focused"), "focused cell is not changed");
    });

    QUnit.test("Workspace should prevent default for all mouse keys except left", function(assert) {
        assert.expect(2);

        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
            focusStateEnabled: true
        });

        $element.dxSchedulerWorkSpaceMonth("instance");
        try {
            var cells = $element.find("." + CELL_CLASS);
            $($element).on("dxpointerdown.WorkspaceTests", function(e) {
                if(e.which > 1) {
                    assert.ok(e.isDefaultPrevented(), "default prevented");
                } else {
                    assert.notOk(e.isDefaultPrevented(), "default is not prevented");
                }
            });

            cells.eq(0).trigger($.Event("dxpointerdown", { which: 1, pointerType: "mouse" }));
            cells.eq(1).trigger($.Event("dxpointerdown", { which: 2, pointerType: "mouse" }));
        } finally {
            $($element).off("dxpointerdown.WorkspaceTests");
        }
    });

    QUnit.test("onCellClick should fires when cell is clicked", function(assert) {
        assert.expect(2);

        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
            currentDate: new Date(2015, 9, 1),
            focusStateEnabled: true,
            onCellClick: function(e) {
                assert.deepEqual(e.cellElement[0], $cell[0], "cell is clicked");
                assert.deepEqual(e.cellData, { startDate: new Date(2015, 8, 27), endDate: new Date(2015, 8, 28) }, "cell is clicked");
            }
        });

        var $cell = $element.find("." + CELL_CLASS).eq(0);
        $($cell).trigger("dxclick");
    });

    QUnit.test("onCellClick should fires when defines after option change", function(assert) {
        assert.expect(1);

        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
                focusStateEnabled: true
            }),
            instance = $element.dxSchedulerWorkSpaceMonth("instance");

        instance.option("onCellClick", function() {
            assert.ok(true, "click is handled after option change");
        });
        var $cell = $element.find("." + CELL_CLASS).eq(0);
        $($cell).trigger("dxclick");
    });

    QUnit.test("Popup should be shown when onCellClick", function(assert) {
        assert.expect(1);


        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
                focusStateEnabled: true,
                onCellClick: function(e) {
                    e.cancel = true;
                }
            }),
            instance = $element.dxSchedulerWorkSpaceMonth("instance");

        var stub = sinon.stub(instance, "notifyObserver").withArgs("showAddAppointmentPopup");

        var $cell = $element.find("." + CELL_CLASS).eq(1);

        pointerMock($cell).start().click().click();

        assert.notOk(stub.called, "showAddAppointmentPopup doesn't shown");
    });

})("Workspace Mouse Interaction");


(function() {

    QUnit.module("Get cell index by coordinates", {
        beforeEach: function() {
            this.createInstance = function(type, options, skipInvokeStub) {
                var workSpace = "dxSchedulerWorkSpace" + type;

                if(!skipInvokeStub) {
                    this.instance = $("#scheduler-work-space")[workSpace]()[workSpace]("instance");
                    stubInvokeMethod(this.instance);
                    this.instance.option(options);
                } else {
                    this.instance = $("#scheduler-work-space")[workSpace](options)[workSpace]("instance");
                }
            };
        }
    });

    QUnit.test("Week view", function(assert) {
        this.createInstance("Week", { width: 800, height: 800 });
        var index = this.instance.getCellIndexByCoordinates({ left: 100, top: 55 });

        assert.equal(index, 7, "Index is OK");
    });

    QUnit.test("Week view: rtl mode", function(assert) {
        this.createInstance("Week", { width: 800, height: 800, rtlEnabled: true }, true);
        var index = this.instance.getCellIndexByCoordinates({ left: 411, top: 50 });

        assert.equal(index, 9, "Index is OK");
    });

    QUnit.test("All day row", function(assert) {
        this.createInstance("Week", { width: 800, height: 800 });
        var index = this.instance.getCellIndexByCoordinates({ left: 398, top: 0 });

        assert.equal(index, 3, "Index is OK");
    });

    QUnit.test("Grouped view", function(assert) {
        this.createInstance("Week", {
            width: 800,
            height: 800,
            groups: [{ name: "a", items: [{ id: 1, text: "a.1" }, { id: 2, text: "a.2" }] }]
        });
        var index = this.instance.getCellIndexByCoordinates({ left: 200, top: 55 });

        assert.equal(index, 16, "Index is OK");
    });

    QUnit.test("Month view", function(assert) {
        this.createInstance("Month", {
            width: 800,
            height: 500
        });
        var index = this.instance.getCellIndexByCoordinates({ left: 228, top: 91 });

        assert.equal(index, 9, "Index is OK");
    });

})("Get cell index by coordinates");

(function() {
    QUnit.module("Work Space cellData Cache", {
        beforeEach: function() {
            this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceWeek().dxSchedulerWorkSpaceWeek("instance");
            stubInvokeMethod(this.instance);
        }
    });

    QUnit.test("Workspace should be able to cache cellData", function(assert) {
        var cache,
            $cell = { startDate: 2015, endDate: 2016 },
            getCellDataStub = sinon.stub(this.instance, "getCellData").returns($cell),
            cellCoordinates = {
                rowIndex: 1,
                cellIndex: 0
            };

        try {
            this.instance.setCellDataCache(cellCoordinates, 0, $cell);
            cache = this.instance.getCellDataCache();

            assert.deepEqual(cache, {
                "{\"rowIndex\":1,\"cellIndex\":0,\"groupIndex\":0}": {
                    startDate: 2015,
                    endDate: 2016
                }
            }, "Cache is OK");

        } finally {
            getCellDataStub.restore();
        }
    });

    QUnit.test("CellData cache set correct alias", function(assert) {
        var $cell = { startDate: 2015, endDate: 2016 },
            getCellDataStub = sinon.stub(this.instance, "getCellData").returns($cell);

        try {
            var appointment = {
                    rowIndex: 1,
                    cellIndex: 0,
                    groupIndex: 0
                },
                geometry = {
                    top: 10,
                    left: 10
                },
                aliasKey = JSON.stringify({
                    top: geometry.top,
                    left: geometry.left
                });

            this.instance.setCellDataCache(appointment, 0, $cell);
            this.instance.setCellDataCacheAlias(appointment, geometry);
            var cacheData = this.instance.getCellDataCache(aliasKey);

            assert.deepEqual(cacheData, {
                "endDate": 2016,
                "startDate": 2015
            }, "Cache Data Alias is OK");

        } finally {
            getCellDataStub.restore();
        }
    });

    QUnit.test("getCellDataByCoordinates return cached cell data", function(assert) {
        var appointment = {
                rowIndex: 1,
                cellIndex: 0,
                groupIndex: 0
            },
            geometry = {
                top: 10,
                left: 10
            },
            aliasKey = JSON.stringify({
                top: geometry.top,
                left: geometry.left,
            }),
            $cell = {
                startDate: 2015,
                endDate: 2016
            },
            getCellDataStub = sinon.stub(this.instance, "getCellData").returns($cell),
            getCellDataCacheSpy = sinon.spy(this.instance, "getCellDataCache").withArgs(aliasKey);

        try {

            this.instance.setCellDataCache(appointment, 0, $cell);
            this.instance.setCellDataCacheAlias(appointment, geometry);

            var cellData = this.instance.getCellDataByCoordinates({ top: 10, left: 10 });

            assert.ok(getCellDataStub.calledOnce, "getCellData called once");
            assert.ok(getCellDataCacheSpy.calledOnce, "getCellDataByCoordinates called getCellDataCache once");
            assert.deepEqual(getCellDataCacheSpy.getCall(0).returnValue, {
                "endDate": 2016,
                "startDate": 2015
            }, "getCellDataCache return correct cellData object");
            assert.deepEqual(cellData, {
                "endDate": 2016,
                "startDate": 2015
            }, "getCellDataByCoordinates returns correct cellData object");

        } finally {
            getCellDataStub.restore();
        }
    });

    QUnit.test("Work space should return correct cell data if option changed (cleanCellDataCache)", function(assert) {
        var workSpace = this.instance,
            $element = this.instance.$element(),
            appointment = {
                cellIndex: 0,
                rowIndex: 0,
                groupIndex: 0
            },
            geometry = {
                top: 10,
                left: 120
            },
            testDataList = [
                {
                    optionName: "currentDate",
                    optionValue: new Date(2016, 4, 12),
                    cellDataCompare: {
                        allDay: false,
                        startDate: new Date(2016, 4, 8),
                        endDate: new Date(2016, 4, 8, 0, 30)
                    }
                }, {
                    optionName: "hoursInterval",
                    optionValue: 0.3,
                    cellDataCompare: {
                        allDay: false,
                        startDate: new Date(2016, 4, 8),
                        endDate: new Date(2016, 4, 8, 0, 18)
                    }
                }, {
                    optionName: "firstDayOfWeek",
                    optionValue: 3,
                    cellDataCompare: {
                        allDay: false,
                        startDate: new Date(2016, 4, 11),
                        endDate: new Date(2016, 4, 11, 0, 18, 0)
                    }
                }, {
                    optionName: "groups",
                    optionValue: [{ name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] }],
                    cellDataCompare: {
                        allDay: false,
                        startDate: new Date(2016, 4, 11),
                        endDate: new Date(2016, 4, 11, 0, 18, 0),
                        groups: { one: 1 }
                    }
                }, {
                    optionName: "startDayHour",
                    optionValue: 2,
                    cellDataCompare: {
                        allDay: false,
                        startDate: new Date(2016, 4, 11, 2),
                        endDate: new Date(2016, 4, 11, 2, 18, 0),
                        groups: { one: 1 }
                    }
                }, {
                    optionName: "endDayHour",
                    optionValue: 23,
                    cellDataCompare: {
                        allDay: false,
                        startDate: new Date(2016, 4, 11, 2),
                        endDate: new Date(2016, 4, 11, 2, 18),
                        groups: { one: 1 }
                    }
                }
            ];

        workSpace.option("currentDate", new Date(2016, 3, 12));

        testDataList.forEach(function(testData) {
            var $firstCell = $element.find(".dx-scheduler-date-table-cell").first();

            workSpace.setCellDataCache(appointment, 0, $firstCell);
            workSpace.setCellDataCacheAlias(appointment, geometry);

            workSpace.option(testData.optionName, testData.optionValue);
            assert.ok($.isEmptyObject(workSpace.getCellDataCache()), "Cell data cache was cleared after " + testData.optionName + " option changing");

            var cellData = workSpace.getCellDataByCoordinates(geometry);
            assert.deepEqual(cellData, testData.cellDataCompare, "Cell data cache was cleared after " + testData.optionName + " option changing");
        });
    });

    QUnit.test("Cell data cache should be cleared when dimensions were changed", function(assert) {
        var workSpace = this.instance,
            $element = this.instance.$element(),
            appointment = {
                cellIndex: 0,
                rowIndex: 0,
                groupIndex: 0
            },
            geometry = {
                top: 10,
                left: 120
            };

        var $firstCell = $element.find(".dx-scheduler-date-table-cell").first();

        workSpace.setCellDataCache(appointment, 0, $firstCell);
        workSpace.setCellDataCacheAlias(appointment, geometry);

        resizeCallbacks.fire();

        var cache = workSpace.getCellDataCache();

        assert.ok($.isEmptyObject(cache), "Cache is cleared");
    });

})("Work Space cellData Cache");

(function() {
    QUnit.module("Work Space Day with intervalCount", {
        beforeEach: function() {
            this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceDay().dxSchedulerWorkSpaceDay("instance");
            stubInvokeMethod(this.instance);
        }
    });

    QUnit.test("WorkSpace Day view has right count of cells with view option intervalCount=2", function(assert) {
        this.instance.option("intervalCount", 2);

        var cells = this.instance.$element().find(".dx-scheduler-date-table-cell");
        assert.equal(cells.length, this.instance._getCellCountInDay() * 2, "view has right cell count");

        this.instance.option("intervalCount", 4);

        cells = this.instance.$element().find(".dx-scheduler-date-table-cell");
        assert.equal(cells.length, this.instance._getCellCountInDay() * 4, "view has right cell count");
    });

    QUnit.test("WorkSpace Day view cells have right cellData with view option intervalCount=2", function(assert) {
        this.instance.option("intervalCount", 2);
        this.instance.option("currentDate", new Date(2017, 5, 29));

        var firstCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(1).data("dxCellData"),
            secondCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(95).data("dxCellData");

        assert.deepEqual(firstCellData.startDate, new Date(2017, 5, 30, 0), "cell has right startDate");
        assert.deepEqual(firstCellData.endDate, new Date(2017, 5, 30, 0, 30), "cell has right endtDate");

        assert.deepEqual(secondCellData.startDate, new Date(2017, 5, 30, 23, 30), "cell has right startDate");
        assert.deepEqual(secondCellData.endDate, new Date(2017, 5, 31, 0), "cell has right endtDate");
    });

    QUnit.test("WorkSpace Day view cells have right cellData with view option intervalCount = 3 and startDate < currentDate", function(assert) {
        this.instance.option("intervalCount", 3);
        this.instance.option("startDate", new Date(2017, 5, 21));
        this.instance.option("currentDate", new Date(2017, 5, 28));

        var firstCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).data("dxCellData"),
            secondCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(143).data("dxCellData");

        assert.deepEqual(firstCellData.startDate, new Date(2017, 5, 27, 0), "cell has right startDate");
        assert.deepEqual(firstCellData.endDate, new Date(2017, 5, 27, 0, 30), "cell has right endtDate");

        assert.deepEqual(secondCellData.startDate, new Date(2017, 5, 29, 23, 30), "cell has right startDate");
        assert.deepEqual(secondCellData.endDate, new Date(2017, 5, 30, 0), "cell has right endtDate");
    });

    QUnit.test("WorkSpace Day view cells have right cellData with view option intervalCount = 3 and startDate > currentDate", function(assert) {
        this.instance.option("intervalCount", 3);
        this.instance.option("startDate", new Date(2017, 5, 30));
        this.instance.option("currentDate", new Date(2017, 5, 25));

        var firstCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).data("dxCellData"),
            secondCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(143).data("dxCellData");

        assert.deepEqual(firstCellData.startDate, new Date(2017, 5, 24, 0), "cell has right startDate");
        assert.deepEqual(firstCellData.endDate, new Date(2017, 5, 24, 0, 30), "cell has right endtDate");

        assert.deepEqual(secondCellData.startDate, new Date(2017, 5, 26, 23, 30), "cell has right startDate");
        assert.deepEqual(secondCellData.endDate, new Date(2017, 5, 27, 0), "cell has right endtDate");
    });

    QUnit.test("Get date range", function(assert) {
        this.instance.option("currentDate", new Date(2015, 2, 16));
        this.instance.option("intervalCount", 2);

        assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 16, 0, 0), new Date(2015, 2, 17, 23, 59)], "Range is OK");

        this.instance.option("intervalCount", 4);
        assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 16, 0, 0), new Date(2015, 2, 19, 23, 59)], "Range is OK");
    });

    QUnit.test("WorkSpace Day view with option intervalCount = 3 should have right header", function(assert) {
        this.instance.option("intervalCount", 3);
        this.instance.option("currentDate", new Date(2017, 5, 25));
        this.instance.option("startDate", new Date(2017, 5, 24));

        var date = new Date(this.instance.option("startDate")),
            $element = this.instance.$element(),
            $headerCells = $element.find(".dx-scheduler-header-panel-cell");

        assert.equal($headerCells.length, 3, "Date table has 3 header cells");
        assert.equal($headerCells.eq(0).text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[6].toLowerCase() + " " + date.getDate(), "Header has a right text");
        assert.equal($headerCells.eq(1).text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[0].toLowerCase() + " " + new Date(date.setDate(date.getDate() + 1)).getDate(), "Header has a right text");
        assert.equal($headerCells.eq(2).text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[1].toLowerCase() + " " + new Date(date.setDate(date.getDate() + 1)).getDate(), "Header has a right text");

        this.instance.option("intervalCount", 1);

        $headerCells = $element.find(".dx-scheduler-header-panel-cell");
        assert.equal($headerCells.length, 0, "Date table hasn't 3 header cells");
    });

})("Work Space Day with intervalCount");

(function() {
    QUnit.module("Work Space Week with intervalCount", {
        beforeEach: function() {
            this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceWeek().dxSchedulerWorkSpaceWeek("instance");
            stubInvokeMethod(this.instance);
        }
    });

    QUnit.test("WorkSpace Week view has right count of cells with view option intervalCount", function(assert) {
        this.instance.option("intervalCount", 2);

        var cells = this.instance.$element().find(".dx-scheduler-date-table-cell");
        assert.equal(cells.length, this.instance._getCellCountInDay() * 7 * 2, "view has right cell count");

        this.instance.option("intervalCount", 4);

        cells = this.instance.$element().find(".dx-scheduler-date-table-cell");
        assert.equal(cells.length, this.instance._getCellCountInDay() * 7 * 4, "view has right cell count");
    });

    QUnit.test("WorkSpace Week view cells have right cellData with view option intervalCount", function(assert) {
        this.instance.option("intervalCount", 2);
        this.instance.option("currentDate", new Date(2017, 5, 25));

        var firstCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(6).data("dxCellData"),
            secondCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(671).data("dxCellData");

        assert.deepEqual(firstCellData.startDate, new Date(2017, 6, 1, 0), "cell has right startDate");
        assert.deepEqual(firstCellData.endDate, new Date(2017, 6, 1, 0, 30), "cell has right endtDate");

        assert.deepEqual(secondCellData.startDate, new Date(2017, 6, 8, 23, 30), "cell has right startDate");
        assert.deepEqual(secondCellData.endDate, new Date(2017, 6, 9, 0), "cell has right endtDate");
    });

    QUnit.test("WorkSpace Week view cells have right cellData with view option intervalCount = 3 and startDate < currentDate", function(assert) {
        this.instance.option("hoursInterval", 1);
        this.instance.option("firstDayOfWeek", 1);
        this.instance.option("intervalCount", 3);
        this.instance.option("startDate", new Date(2017, 6, 4));
        this.instance.option("currentDate", new Date(2017, 6, 26));

        var firstCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).data("dxCellData"),
            secondCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(240).data("dxCellData"),
            thirdCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(503).data("dxCellData");

        assert.deepEqual(firstCellData.startDate, new Date(2017, 6, 24, 0), "cell has right startDate");
        assert.deepEqual(firstCellData.endDate, new Date(2017, 6, 24, 1), "cell has right endtDate");

        assert.deepEqual(secondCellData.startDate, new Date(2017, 7, 2, 11), "cell has right startDate");
        assert.deepEqual(secondCellData.endDate, new Date(2017, 7, 2, 12), "cell has right endtDate");

        assert.deepEqual(thirdCellData.startDate, new Date(2017, 7, 13, 23), "cell has right startDate");
        assert.deepEqual(thirdCellData.endDate, new Date(2017, 7, 14, 0), "cell has right endtDate");
    });

    QUnit.test("WorkSpace Week view cells have right cellData with view option intervalCount = 3 and startDate > currentDate", function(assert) {
        this.instance.option("hoursInterval", 1);
        this.instance.option("firstDayOfWeek", 1);
        this.instance.option("intervalCount", 2);
        this.instance.option("startDate", new Date(2017, 6, 26));
        this.instance.option("currentDate", new Date(2017, 6, 4));

        var firstCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).data("dxCellData"),
            secondCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(160).data("dxCellData"),
            thirdCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(335).data("dxCellData");

        assert.deepEqual(firstCellData.startDate, new Date(2017, 5, 26, 0), "cell has right startDate");
        assert.deepEqual(firstCellData.endDate, new Date(2017, 5, 26, 1), "cell has right endtDate");

        assert.deepEqual(secondCellData.startDate, new Date(2017, 6, 2, 11), "cell has right startDate");
        assert.deepEqual(secondCellData.endDate, new Date(2017, 6, 2, 12), "cell has right endtDate");

        assert.deepEqual(thirdCellData.startDate, new Date(2017, 6, 9, 23), "cell has right startDate");
        assert.deepEqual(thirdCellData.endDate, new Date(2017, 6, 10, 0), "cell has right endtDate");
    });

    QUnit.test("Get date range", function(assert) {
        this.instance.option("currentDate", new Date(2015, 2, 15));
        this.instance.option("intervalCount", 3);

        assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 15, 0, 0), new Date(2015, 3, 4, 23, 59)], "Range is OK");

        this.instance.option("intervalCount", 4);
        assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 15, 0, 0), new Date(2015, 3, 11, 23, 59)], "Range is OK");
    });

})("Work Space Week with intervalCount");

(function() {
    QUnit.module("Work Space Work Week with intervalCount", {
        beforeEach: function() {
            this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceWorkWeek().dxSchedulerWorkSpaceWorkWeek("instance");
            stubInvokeMethod(this.instance);
        }
    });

    QUnit.test("WorkSpace WorkWeek view has right count of cells with view option intervalCount", function(assert) {
        this.instance.option("intervalCount", 2);

        var cells = this.instance.$element().find(".dx-scheduler-date-table-cell");
        assert.equal(cells.length, this.instance._getCellCountInDay() * 5 * 2, "view has right cell count");

        this.instance.option("intervalCount", 4);

        cells = this.instance.$element().find(".dx-scheduler-date-table-cell");
        assert.equal(cells.length, this.instance._getCellCountInDay() * 5 * 4, "view has right cell count");
    });

    QUnit.test("'getCoordinatesByDate' should return right coordinates with view option intervalCount", function(assert) {
        this.instance.option({
            intervalCount: 2,
            currentDate: new Date(2017, 5, 25),
            startDayHour: 8,
            endDayHour: 20
        });

        var $element = this.instance.$element();

        var coords = this.instance.getCoordinatesByDate(new Date(2017, 6, 6, 12, 0), 0, false),
            targetCellPosition = $element.find(".dx-scheduler-date-table tbody td").eq(88).position();

        assert.equal(coords.top, targetCellPosition.top, "Cell coordinates are right");
        assert.equal(coords.left, targetCellPosition.left, "Cell coordinates are right");
    });

    QUnit.test("WorkSpace WorkWeek view cells have right cellData with view option intervalCount", function(assert) {
        this.instance.option("intervalCount", 2);
        this.instance.option("currentDate", new Date(2017, 5, 25));

        var firstCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(4).data("dxCellData"),
            secondCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(5).data("dxCellData"),
            thirdCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(479).data("dxCellData");

        assert.deepEqual(firstCellData.startDate, new Date(2017, 5, 30, 0), "cell has right startDate");
        assert.deepEqual(firstCellData.endDate, new Date(2017, 5, 30, 0, 30), "cell has right endtDate");

        assert.deepEqual(secondCellData.startDate, new Date(2017, 6, 3, 0), "cell has right startDate");
        assert.deepEqual(secondCellData.endDate, new Date(2017, 6, 3, 0, 30), "cell has right endtDate");

        assert.deepEqual(thirdCellData.startDate, new Date(2017, 6, 7, 23, 30), "cell has right startDate");
        assert.deepEqual(thirdCellData.endDate, new Date(2017, 6, 8, 0), "cell has right endtDate");
    });

    QUnit.test("WorkSpace WorkWeek view cells have right cellData with view option intervalCount = 3 and startDate < currentDate", function(assert) {
        this.instance.option("hoursInterval", 1);
        this.instance.option("firstDayOfWeek", 1);
        this.instance.option("intervalCount", 3);
        this.instance.option("startDate", new Date(2017, 6, 4));
        this.instance.option("currentDate", new Date(2017, 6, 26));

        var firstCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).data("dxCellData"),
            secondCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(82).data("dxCellData"),
            thirdCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").last().data("dxCellData");

        assert.deepEqual(firstCellData.startDate, new Date(2017, 6, 24, 0), "cell has right startDate");
        assert.deepEqual(firstCellData.endDate, new Date(2017, 6, 24, 1), "cell has right endtDate");

        assert.deepEqual(secondCellData.startDate, new Date(2017, 7, 2, 5), "cell has right startDate");
        assert.deepEqual(secondCellData.endDate, new Date(2017, 7, 2, 6), "cell has right endtDate");

        assert.deepEqual(thirdCellData.startDate, new Date(2017, 7, 11, 23), "cell has right startDate");
        assert.deepEqual(thirdCellData.endDate, new Date(2017, 7, 12, 0), "cell has right endtDate");
    });

    QUnit.test("WorkSpace WorkWeek view cells have right cellData with view option intervalCount = 3 and startDate > currentDate", function(assert) {
        this.instance.option("hoursInterval", 1);
        this.instance.option("firstDayOfWeek", 1);
        this.instance.option("intervalCount", 2);
        this.instance.option("startDate", new Date(2017, 6, 26));
        this.instance.option("currentDate", new Date(2017, 6, 4));

        var firstCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).data("dxCellData"),
            secondCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(36).data("dxCellData"),
            thirdCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").last().data("dxCellData");

        assert.deepEqual(firstCellData.startDate, new Date(2017, 5, 26, 0), "cell has right startDate");
        assert.deepEqual(firstCellData.endDate, new Date(2017, 5, 26, 1), "cell has right endtDate");

        assert.deepEqual(secondCellData.startDate, new Date(2017, 6, 4, 3), "cell has right startDate");
        assert.deepEqual(secondCellData.endDate, new Date(2017, 6, 4, 4), "cell has right endtDate");

        assert.deepEqual(thirdCellData.startDate, new Date(2017, 6, 7, 23), "cell has right startDate");
        assert.deepEqual(thirdCellData.endDate, new Date(2017, 6, 8, 0), "cell has right endtDate");
    });

    QUnit.test("Get date range", function(assert) {
        this.instance.option("currentDate", new Date(2017, 5, 26));
        this.instance.option("intervalCount", 3);

        assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 26, 0, 0), new Date(2017, 6, 14, 23, 59)], "Range is OK");

        this.instance.option("intervalCount", 4);
        assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 26, 0, 0), new Date(2017, 6, 21, 23, 59)], "Range is OK");
    });

    QUnit.test("Workspace work week view should contain 15 headers if intervalCount=3", function(assert) {
        var instance = $("#scheduler-work-space").dxSchedulerWorkSpaceWorkWeek({
            currentDate: new Date(2017, 5, 26),
            firstDayOfWeek: 1,
            intervalCount: 3,
            width: 1500
        }).dxSchedulerWorkSpaceWorkWeek("instance");

        var currentDate = instance.option("currentDate"),
            $element = instance.$element(),
            $headerCells = $element.find(".dx-scheduler-header-panel-cell"),
            date;

        assert.equal($headerCells.length, 15, "Date table has 15 header cells");
        for(var i = 0; i < 5; i++) {
            date = new Date(this.instance.option("currentDate"));
            date.setDate(currentDate.getDate() + i);
            assert.equal($headerCells.eq(i).text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[(i + 1) % 7].toLowerCase() + " " + date.getDate(), "Header has a right text");
        }
        for(i = 7; i < 12; i++) {
            date = new Date(this.instance.option("currentDate"));
            date.setDate(currentDate.getDate() + i);
            assert.equal($headerCells.eq(i - 2).text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[(i + 1) % 7].toLowerCase() + " " + date.getDate(), "Header has a right text");
        }
        for(i = 14; i < 19; i++) {
            date = new Date(this.instance.option("currentDate"));
            date.setDate(currentDate.getDate() + i);
            assert.equal($headerCells.eq(i - 4).text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[(i + 1) % 7].toLowerCase() + " " + date.getDate(), "Header has a right text");
        }
    });

    QUnit.test("Grouped Workspace work week view should contain right count of headers with view option intervalCount", function(assert) {
        var instance = $("#scheduler-work-space").dxSchedulerWorkSpaceWorkWeek({
            currentDate: new Date(2017, 5, 26),
            firstDayOfWeek: 1,
            intervalCount: 2,
            groups: [{ name: "a", items: [{ id: 1, text: "a.1" }, { id: 2, text: "a.2" }] }],
            width: 1500
        }).dxSchedulerWorkSpaceWorkWeek("instance");

        var currentDate = instance.option("currentDate"),
            $element = instance.$element(),
            $headerCells = $element.find(".dx-scheduler-header-panel-cell"),
            date;

        assert.equal($headerCells.length, 20, "Date table has 15 header cells");
        for(var i = 0; i < 5; i++) {
            date = new Date(this.instance.option("currentDate"));
            date.setDate(currentDate.getDate() + i);
            assert.equal($headerCells.eq(i).text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[(i + 1) % 7].toLowerCase() + " " + date.getDate(), "Header has a right text");
        }
        for(i = 7; i < 12; i++) {
            date = new Date(this.instance.option("currentDate"));
            date.setDate(currentDate.getDate() + i);
            assert.equal($headerCells.eq(i - 2).text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[(i + 1) % 7].toLowerCase() + " " + date.getDate(), "Header has a right text");
        }
        for(i = 14; i < 19; i++) {
            date = new Date(this.instance.option("currentDate"));
            date.setDate(currentDate.getDate() + i - 14);
            assert.equal($headerCells.eq(i - 4).text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[(i + 1) % 7].toLowerCase() + " " + date.getDate(), "Header has a right text");
        }
        for(i = 21; i < 26; i++) {
            date = new Date(this.instance.option("currentDate"));
            date.setDate(currentDate.getDate() + i - 14);
            assert.equal($headerCells.eq(i - 6).text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[(i + 1) % 7].toLowerCase() + " " + date.getDate(), "Header has a right text");
        }
    });

    QUnit.test("Grouped WorkSpace WorkWeek view cells have right cellData with view option intervalCount", function(assert) {
        this.instance.option("hoursInterval", 1);
        this.instance.option("firstDayOfWeek", 1);
        this.instance.option("intervalCount", 2);
        this.instance.option("currentDate", new Date(2017, 6, 4));
        this.instance.option("groups", [{ name: "a", items: [{ id: 1, text: "a.1" }, { id: 2, text: "a.2" }] }]);

        var firstCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).data("dxCellData"),
            secondCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(5).data("dxCellData"),
            thirdCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(10).data("dxCellData"),
            lastCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(15).data("dxCellData");

        assert.deepEqual(firstCellData.startDate, new Date(2017, 6, 3, 0), "cell has right startDate");
        assert.deepEqual(firstCellData.endDate, new Date(2017, 6, 3, 1), "cell has right endtDate");

        assert.deepEqual(secondCellData.startDate, new Date(2017, 6, 10, 0), "cell has right startDate");
        assert.deepEqual(secondCellData.endDate, new Date(2017, 6, 10, 1), "cell has right endtDate");

        assert.deepEqual(thirdCellData.startDate, new Date(2017, 6, 3, 0), "cell has right startDate");
        assert.deepEqual(thirdCellData.endDate, new Date(2017, 6, 3, 1), "cell has right endtDate");

        assert.deepEqual(lastCellData.startDate, new Date(2017, 6, 10, 0), "cell has right startDate");
        assert.deepEqual(lastCellData.endDate, new Date(2017, 6, 10, 1), "cell has right endtDate");
    });

})("Work Space Work Week with intervalCount");

(function() {
    QUnit.module("Work Space Month with intervalCount", {
        beforeEach: function() {
            this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth().dxSchedulerWorkSpaceMonth("instance");
            stubInvokeMethod(this.instance);
        }
    });

    QUnit.test("WorkSpace Month view has right count of rows with view option intervalCount", function(assert) {
        this.instance.option("intervalCount", 2);

        var rows = this.instance.$element().find(".dx-scheduler-date-table-row");
        assert.equal(rows.length, 10, "view has right rows count");

        this.instance.option("intervalCount", 4);

        rows = this.instance.$element().find(".dx-scheduler-date-table-row");
        assert.equal(rows.length, 18, "view has right rows count");
    });

    QUnit.test("WorkSpace Month view has right count of cells with view option intervalCount", function(assert) {
        this.instance.option("intervalCount", 2);

        var rows = this.instance.$element().find(".dx-scheduler-date-table-cell");
        assert.equal(rows.length, 7 * 10, "view has right cells count");
    });

    QUnit.test("WorkSpace Month view cells have right cellData with view option intervalCount & startDate < currentDate", function(assert) {
        this.instance.option("intervalCount", 3);
        this.instance.option("currentDate", new Date(2017, 4, 25));
        this.instance.option("startDate", new Date(2017, 0, 15));

        var firstCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).data("dxCellData"),
            secondCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(35).data("dxCellData"),
            thirdCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").last().data("dxCellData");

        assert.deepEqual(firstCellData.startDate, new Date(2017, 2, 26, 0), "cell has right startDate");
        assert.deepEqual(firstCellData.endDate, new Date(2017, 2, 27, 0), "cell has right endtDate");

        assert.deepEqual(secondCellData.startDate, new Date(2017, 3, 30, 0), "cell has right startDate");
        assert.deepEqual(secondCellData.endDate, new Date(2017, 4, 1, 0), "cell has right endtDate");

        assert.deepEqual(thirdCellData.startDate, new Date(2017, 6, 1, 0), "cell has right startDate");
        assert.deepEqual(thirdCellData.endDate, new Date(2017, 6, 2, 0), "cell has right endtDate");
    });

    QUnit.test("WorkSpace Month view cells have right cellData with view option intervalCount & startDate > currentDate", function(assert) {
        this.instance.option("intervalCount", 3);
        this.instance.option("currentDate", new Date(2017, 1, 15));
        this.instance.option("startDate", new Date(2017, 5, 15));

        var firstCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).data("dxCellData"),
            secondCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(35).data("dxCellData"),
            thirdCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").last().data("dxCellData");

        assert.deepEqual(firstCellData.startDate, new Date(2016, 10, 27, 0), "cell has right startDate");
        assert.deepEqual(firstCellData.endDate, new Date(2016, 10, 28, 0), "cell has right endtDate");

        assert.deepEqual(secondCellData.startDate, new Date(2017, 0, 1, 0), "cell has right startDate");
        assert.deepEqual(secondCellData.endDate, new Date(2017, 0, 2, 0), "cell has right endtDate");

        assert.deepEqual(thirdCellData.startDate, new Date(2017, 2, 4, 0), "cell has right startDate");
        assert.deepEqual(thirdCellData.endDate, new Date(2017, 2, 5, 0), "cell has right endtDate");
    });

    QUnit.test("WorkSpace Month view cells have right cellData with view option intervalCount & startDate = currentDate", function(assert) {
        this.instance.option("intervalCount", 3);
        this.instance.option("currentDate", new Date(2017, 6, 15));
        this.instance.option("startDate", new Date(2017, 5, 15));

        var firstCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).data("dxCellData"),
            secondCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(35).data("dxCellData"),
            thirdCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").last().data("dxCellData");

        assert.deepEqual(firstCellData.startDate, new Date(2017, 4, 28, 0), "cell has right startDate");
        assert.deepEqual(firstCellData.endDate, new Date(2017, 4, 29, 0), "cell has right endtDate");

        assert.deepEqual(secondCellData.startDate, new Date(2017, 6, 2, 0), "cell has right startDate");
        assert.deepEqual(secondCellData.endDate, new Date(2017, 6, 3, 0), "cell has right endtDate");

        assert.deepEqual(thirdCellData.startDate, new Date(2017, 8, 2, 0), "cell has right startDate");
        assert.deepEqual(thirdCellData.endDate, new Date(2017, 8, 3, 0), "cell has right endtDate");
    });

    QUnit.test("WorkSpace Month view with option intervalCount has cells with special firstDayOfMonth class", function(assert) {
        this.instance.option("intervalCount", 2);
        this.instance.option("currentDate", new Date(2017, 5, 25));

        var $firstDayOfMonthCells = this.instance.$element().find(".dx-scheduler-date-table-first-of-month");

        assert.equal($firstDayOfMonthCells.length, 3, "view has right special cells count");

        assert.equal($firstDayOfMonthCells.first().text(), "Jun 1", "Cell has a right text");
        assert.equal($firstDayOfMonthCells.last().text(), "Aug 1", "Cell has a right text");
    });

    QUnit.test("Get date range", function(assert) {
        this.instance.option("currentDate", new Date(2017, 5, 26));
        this.instance.option("intervalCount", 3);

        assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 4, 28, 0, 0), new Date(2017, 8, 2, 23, 59)], "Range is OK");

        this.instance.option("intervalCount", 4);
        assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 4, 28, 0, 0), new Date(2017, 8, 30, 23, 59)], "Range is OK");
    });

})("Work Space Work Week with intervalCount");

(function() {
    QUnit.module("DateTime indicator on Day View", {
        beforeEach: function() {
            this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceDay({
                showCurrentTimeIndicator: true,
                currentDate: new Date(2017, 8, 5),
                startDayHour: 8,
            }).dxSchedulerWorkSpaceDay("instance");
            stubInvokeMethod(this.instance);
        }
    });

    QUnit.test("DateTimeIndicator should be rendered if needed", function(assert) {
        this.instance.option({
            _currentDateTime: new Date(2017, 8, 5, 12, 45)
        });
        var $element = this.instance.element();

        assert.equal($element.find(".dx-scheduler-date-time-indicator").length, 1, "Indicator is rendered correctly");

        this.instance.option("showCurrentTimeIndicator", false);
        $element = this.instance.element();

        assert.equal($element.find(".dx-scheduler-date-time-indicator").length, 0, "Indicator wasn't rendered");
    });

    QUnit.test("DateTimeIndicator on allDayPanel should be rendered if needed", function(assert) {
        this.instance.option({
            _currentDateTime: new Date(2017, 8, 5, 12, 45),
            showAllDayPanel: false
        });
        var $element = this.instance.element();

        assert.equal($element.find(".dx-scheduler-date-time-indicator-all-day").length, 0, "Indicator wasn't rendered");

        this.instance.option("showAllDayPanel", true);

        assert.equal($element.find(".dx-scheduler-date-time-indicator").length, 1, "Indicator is rendered");
    });

    QUnit.test("DateTimeIndicator on allDayPanel should have correct height", function(assert) {
        this.instance.option({
            _currentDateTime: new Date(2017, 8, 5, 12, 45),
            showAllDayPanel: true,
            allDayExpanded: false
        });
        var $element = this.instance.element();

        assert.roughEqual($element.find(".dx-scheduler-date-time-indicator-all-day").eq(0).outerHeight(), 24, 1, "Indicator has correct height");

        this.instance.option("allDayExpanded", true);

        assert.roughEqual($element.find(".dx-scheduler-date-time-indicator-all-day").eq(0).outerHeight(), 74, 1, "Indicator has correct height");
    });

    QUnit.test("DateTimeIndicator should be wrapped by scrollable", function(assert) {
        this.instance.option({
            _currentDateTime: new Date(2017, 8, 5, 12, 45)
        });
        var $element = this.instance.element();

        assert.ok($element.find(".dx-scheduler-date-time-indicator").parent().hasClass("dx-scrollable-content"), "Scrollable contains time indicator");
    });

    QUnit.test("AllDay dateTimeIndicator should be wrapped by allDay panel", function(assert) {
        this.instance.option({
            _currentDateTime: new Date(2017, 8, 5, 12, 45),
            showAllDayPanel: true
        });
        var $element = this.instance.element();

        assert.ok($element.find(".dx-scheduler-date-time-indicator-all-day").parent().hasClass("dx-scheduler-all-day-panel"), "AllDay panel contains time indicator");
    });

    QUnit.test("DateTimeIndicator should have correct height", function(assert) {
        this.instance.option({
            _currentDateTime: new Date(2017, 8, 5, 12, 45)
        });

        var $element = this.instance.element(),
            $indicator = $element.find(".dx-scheduler-date-time-indicator");

        assert.roughEqual($indicator.outerHeight(), 475, 1, "Indicator has correct height");
    });

    QUnit.test("DateTimeIndicator should have limited height", function(assert) {
        this.instance.option({
            endDayHour: 18,
            _currentDateTime: new Date(2017, 8, 5, 19, 45)
        });

        var $element = this.instance.element(),
            $indicator = $element.find(".dx-scheduler-date-time-indicator");

        assert.roughEqual($indicator.outerHeight(), 1000, 1, "Indicator has correct height");
        assert.equal($indicator.children().length, 0, "Indicator has no content");
    });

    QUnit.test("DateTimeIndicator should not be renderd after currentDate changing", function(assert) {
        this.instance.option({
            _currentDateTime: new Date(2017, 8, 5, 19, 45),
            showAllDayPanel: true
        });

        var $element = this.instance.element();
        assert.equal($element.find(".dx-scheduler-date-time-indicator").length, 1, "Indicator is rendered");
        assert.equal($element.find(".dx-scheduler-date-time-indicator-all-day").length, 1, "AllDay indicator is rendered");

        this.instance.option("currentDate", new Date(2017, 8, 6));

        assert.equal($element.find(".dx-scheduler-date-time-indicator").length, 0, "Indicator wasn't rendered");
        assert.equal($element.find(".dx-scheduler-date-time-indicator-all-day").length, 0, "AllDay indicator wasn't rendered");
    });

    QUnit.test("TimePanel currentTime cell should have specific class", function(assert) {
        this.instance.option({
            _currentDateTime: new Date(2017, 8, 5, 12, 45)
        });

        var $element = this.instance.element(),
            $cell = $element.find(".dx-scheduler-time-panel-cell").eq(5);

        assert.ok($cell.hasClass("dx-scheduler-time-panel-current-time-cell"), "Cell has specific class");
    });
})("DateTime indicator on Day View");

(function() {
    QUnit.module("DateTime indicator on Week View", {
        beforeEach: function() {
            this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceWeek({
                showCurrentTimeIndicator: true,
                currentDate: new Date(2017, 8, 5),
                startDayHour: 8,
            }).dxSchedulerWorkSpaceWeek("instance");
            stubInvokeMethod(this.instance);
        }
    });

    QUnit.test("DateTimeIndicator should be rendered if needed", function(assert) {
        this.instance.option({
            currentDate: new Date(),
            startDayHour: 0
        });
        var $element = this.instance.element();

        assert.equal($element.find(".dx-scheduler-date-time-indicator").length, 1, "Indicator is rendered correctly");

        this.instance.option("showCurrentTimeIndicator", false);
        $element = this.instance.element();

        assert.equal($element.find(".dx-scheduler-date-time-indicator").length, 0, "Indicator wasn't rendered");
    });

    QUnit.test("DateTimeIndicator on allDayPanel should be rendered if needed", function(assert) {
        this.instance.option({
            _currentDateTime: new Date(2017, 8, 7, 12, 45),
            showAllDayPanel: false
        });
        var $element = this.instance.element();

        assert.equal($element.find(".dx-scheduler-date-time-indicator-all-day").length, 0, "Indicator wasn't rendered");

        this.instance.option("showAllDayPanel", true);

        assert.equal($element.find(".dx-scheduler-date-time-indicator").length, 1, "Indicator is rendered");
    });

    QUnit.test("DateTimeIndicator on allDayPanel should have correct height & width", function(assert) {
        this.instance.option({
            _currentDateTime: new Date(2017, 8, 7, 12, 45),
            showAllDayPanel: true,
            allDayExpanded: false
        });
        var $element = this.instance.element();

        assert.roughEqual($element.find(".dx-scheduler-date-time-indicator-all-day").eq(0).outerHeight(), 24, 1, "Indicator has correct height");
        assert.roughEqual($element.find(".dx-scheduler-date-time-indicator-all-day").eq(0).outerWidth(), 640, 1, "Indicator has correct height");

        this.instance.option("allDayExpanded", true);

        assert.roughEqual($element.find(".dx-scheduler-date-time-indicator-all-day").eq(0).outerHeight(), 74, 1, "Indicator has correct height");
    });

    QUnit.test("DateTimeIndicator should have correct height & width", function(assert) {
        this.instance.option({
            _currentDateTime: new Date(2017, 8, 6, 12, 45)
        });

        var $element = this.instance.element(),
            $indicator = $element.find(".dx-scheduler-date-time-indicator"),
            $topIndicator = $element.find(".dx-scheduler-date-time-indicator-top"),
            $bottomIndicator = $element.find(".dx-scheduler-date-time-indicator-bottom");

        assert.roughEqual($indicator.outerHeight(), 475, 1, "Indicator has correct height");
        assert.roughEqual($topIndicator.outerHeight(), 475, 1, "Top indicator has correct height");
        assert.roughEqual($bottomIndicator.outerHeight(), 1125, 1, "Bottom indicator has correct height");

        assert.roughEqual($indicator.outerWidth(), 998, 1, "Indicator has correct width");
        assert.roughEqual($topIndicator.outerWidth(), 512, 1, "Top indicator has correct width");
        assert.roughEqual($bottomIndicator.outerWidth(), 384, 1, "Bottom indicator has correct width");
    });

    QUnit.test("DateTimeIndicator should have limited height", function(assert) {
        this.instance.option({
            endDayHour: 18,
            _currentDateTime: new Date(2017, 8, 5, 19, 45)
        });

        var $element = this.instance.element(),
            $indicator = $element.find(".dx-scheduler-date-time-indicator");

        assert.roughEqual($indicator.outerHeight(), 1000, 1, "Indicator has correct height");
        assert.equal($indicator.children(".dx-scheduler-date-time-indicator-content").length, 0, "Indicator has no content");
    });

    QUnit.test("DateTimeIndicator should not be renderd after currentDate changing", function(assert) {
        this.instance.option({
            _currentDateTime: new Date(2017, 8, 5, 19, 45),
            showAllDayPanel: true
        });

        var $element = this.instance.element();
        assert.equal($element.find(".dx-scheduler-date-time-indicator").length, 1, "Indicator is rendered");
        assert.equal($element.find(".dx-scheduler-date-time-indicator").length, 1, "AllDay indicator is rendered");

        this.instance.option("currentDate", new Date(2017, 8, 15));

        assert.equal($element.find(".dx-scheduler-date-time-indicator").length, 0, "Indicator wasn't rendered");
        assert.equal($element.find(".dx-scheduler-date-time-indicator").length, 0, "AllDay indicator wasn't rendered");
    });

    QUnit.test("TimePanel currentTime cell should have specific class", function(assert) {
        this.instance.option({
            _currentDateTime: new Date(2017, 8, 6, 12, 45)
        });

        var $element = this.instance.element(),
            $cell = $element.find(".dx-scheduler-time-panel-cell").eq(5);

        assert.ok($cell.hasClass("dx-scheduler-time-panel-current-time-cell"), "Cell has specific class");
    });

    QUnit.test("DateHeader currentTime cell should have specific class", function(assert) {
        this.instance.option({
            _currentDateTime: new Date(2017, 8, 7, 12, 45)
        });

        var $element = this.instance.element(),
            $cell = $element.find(".dx-scheduler-header-panel-cell").eq(4);

        assert.ok($cell.hasClass("dx-scheduler-header-panel-current-time-cell"), "Cell has specific class");
    });
})("DateTime indicator on Day View");
