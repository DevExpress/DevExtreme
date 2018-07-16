"use strict";

var pointerMock = require("../../helpers/pointerMock.js"),
    keyboardMock = require("../../helpers/keyboardMock.js");

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    isRenderer = require("core/utils/type").isRenderer,
    config = require("core/config"),
    SchedulerResourcesManager = require("ui/scheduler/ui.scheduler.resource_manager"),
    domUtils = require("core/utils/dom"),
    resizeCallbacks = require("core/utils/resize_callbacks"),
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
    QUnit.test("Workspace week should set first day by firstDayOfWeek option if it is setted and this is different in localization", function(assert) {
        var dateLocalizationSpy = sinon.spy(dateLocalization, "firstDayOfWeekIndex");

        $("#scheduler-work-space").dxSchedulerWorkSpaceWeek({
            views: ["week"],
            currentView: "week",
            currentDate: new Date(2017, 4, 25),
            firstDayOfWeek: 0
        }).dxSchedulerWorkSpaceWeek("instance");

        assert.notOk(dateLocalizationSpy.called, "dateLocalization.firstDayOfWeekIndex wasn't called");
    });

    QUnit.module("Work Space Base", {
        beforeEach: function() {
            this.instance = $("#scheduler-work-space").dxSchedulerWorkSpace().dxSchedulerWorkSpace("instance");
            stubInvokeMethod(this.instance);
        }
    });

    QUnit.test("Scheduler workspace should have a right default intervalCount and startDate", function(assert) {
        assert.equal(this.instance.option("intervalCount"), 1, "dxSchedulerWorkSpace intervalCount is right");
        assert.deepEqual(this.instance.option("startDate"), null, "dxSchedulerWorkSpace startDate is right");
    });

    QUnit.test("All day panel is invisible, if showAllDayPanel = false", function(assert) {
        this.instance.option("showAllDayPanel", false);

        var $element = this.instance.$element(),
            $allDayPanel = $element.find(".dx-scheduler-all-day-panel");

        assert.equal($allDayPanel.css("display"), "none", "allDay panel is invisible");

        this.instance.option("showAllDayPanel", true);

        assert.notEqual($allDayPanel.css("display"), "none", "allDay panel is visible");
    });

    QUnit.test("Scheduler workspace scrollables should be updated after allDayExpanded option changed", function(assert) {
        this.instance.option("allDayExpanded", false);
        var stub = sinon.stub(this.instance, "_updateScrollable");

        this.instance.option("allDayExpanded", true);

        assert.ok(stub.calledOnce, "Scrollables were updated");
    });

    QUnit.test("Scheduler workspace scrollables should be updated after endDayHour option changed if allDayPanel is hided", function(assert) {
        this.instance.option("showAllDayPanel", false);
        this.instance.option("endDayHour", 18);
        var stub = sinon.stub(this.instance, "_updateScrollable");

        this.instance.option("endDayHour", 24);

        assert.ok(stub.calledOnce, "Scrollables were updated");
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

        // TODO: use public method instead
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

                this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceDay(options).dxSchedulerWorkSpaceDay("instance");
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

        assert.roughEqual(coords.top, $element.find(".dx-scheduler-date-table tbody td").eq(2).position().top, 1, "Cell coordinates are right");
        assert.equal(coords.left, $element.find(".dx-scheduler-date-table tbody td").eq(2).position().left, "Cell coordinates are right");
    });

    QUnit.test("Work space should find cell coordinates by date depend on fractional start day hour", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("currentDate", new Date(2015, 2, 4));
        this.instance.option("startDayHour", 5.5);

        var coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 4, 6, 0));

        assert.roughEqual(coords.top, $element.find(".dx-scheduler-date-table tbody td").eq(1).position().top, 1, "Cell coordinates are right");
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

    QUnit.test("Cells have right cellData in vertical grouped WorkSpace Day view", function(assert) {
        this.instance.option({
            currentDate: new Date(2018, 2, 16),
            groups: [{
                name: "one",
                items: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
            }],
            groupOrientation: "vertical",
            startDayHour: 9,
            showAllDayPanel: false
        });
        var firstCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).data("dxCellData"),
            secondCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(36).data("dxCellData");

        assert.deepEqual(firstCellData.startDate, new Date(2018, 2, 16, 9), "cell has right startDate");
        assert.deepEqual(firstCellData.endDate, new Date(2018, 2, 16, 9, 30), "cell has right endDate");

        assert.deepEqual(secondCellData.startDate, new Date(2018, 2, 16, 12), "cell has right startDate");
        assert.deepEqual(secondCellData.endDate, new Date(2018, 2, 16, 12, 30), "cell has right endDate");
    });
})("Work Space Day");

(function() {

    QUnit.module("Work Space Week", {
        beforeEach: function() {
            this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceWeek({
                showCurrentTimeIndicator: false
            }).dxSchedulerWorkSpaceWeek("instance");
            stubInvokeMethod(this.instance);
        }
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
        assert.roughEqual(coords.top, $element.find(".dx-scheduler-date-table tbody td").eq(18).position().top, 1, "Cell coordinates are right");
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

        assert.equal(spy.callCount, 344);
        spy.restore();
    });

    QUnit.test("Cells have right cellData in horizontal grouped WorkSpace Week view", function(assert) {
        this.instance.option({
            currentDate: new Date(2018, 2, 16),
            groupOrientation: "vertical",
            startDayHour: 9,
            groups: [{
                name: "one",
                items: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
            }]
        });

        var firstCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(25).data("dxCellData"),
            secondCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(248).data("dxCellData");

        assert.deepEqual(firstCellData.startDate, new Date(2018, 2, 15, 10, 30), "cell has right startDate");
        assert.deepEqual(firstCellData.endDate, new Date(2018, 2, 15, 11), "cell has right endtDate");

        assert.deepEqual(secondCellData.startDate, new Date(2018, 2, 14, 11, 30), "cell has right startDate");
        assert.deepEqual(secondCellData.endDate, new Date(2018, 2, 14, 12), "cell has right endtDate");
    });
})("Work Space Week");

(function() {

    QUnit.module("Work Space Work Week", {
        beforeEach: function() {
            this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceWorkWeek().dxSchedulerWorkSpaceWorkWeek("instance");
            stubInvokeMethod(this.instance);
        }
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
        assert.roughEqual(coords.top, $element.find(".dx-scheduler-date-table tbody td").eq(14).position().top, 1, "Cell coordinates are right");
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

    QUnit.test("Scheduler allDay title should have correct text after changing currentDate", function(assert) {
        this.instance.option("showAllDayPanel", true);
        this.instance.option("currentDate", new Date(2017, 2, 4));

        var $allDayTitle = this.instance.$element().find(".dx-scheduler-all-day-title");

        assert.equal($allDayTitle.text(), "All day", "All-day title is correct");
    });

})("Work Space Work Week");

(function() {

    QUnit.module("Work Space Month", {
        beforeEach: function() {
            this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth().dxSchedulerWorkSpaceMonth("instance");
            stubInvokeMethod(this.instance);
        }
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
        assert.roughEqual(coords.top, $element.find(".dx-scheduler-date-table tbody td").eq(4).position().top, 1, "Cell coordinates are right");
        assert.equal(coords.left, $element.find(".dx-scheduler-date-table tbody td").eq(4).position().left, "Cell coordinates are right");
    });

    QUnit.test("Work space should find cell coordinates by date depend on end day hour", function(assert) {
        var $element = this.instance.$element();

        this.instance.option("currentDate", new Date(2015, 2, 4));
        this.instance.option("firstDayOfWeek", 7);
        this.instance.option("endDayHour", 10);

        var coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 5, 6, 0));
        assert.roughEqual(coords.top, $element.find(".dx-scheduler-date-table tbody td").eq(4).position().top, 1, "Cell coordinates are right");
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
                // ! fix coordinate calculation in webkit
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
                Math.round($firstGroupLastCell.position().left + $firstGroupLastCell.get(0).getBoundingClientRect().width),
                Math.round($secondGroupLastCell.position().left + $secondGroupLastCell.get(0).getBoundingClientRect().width),
                Math.round($thirdGroupLastCell.position().left + $thirdGroupLastCell.get(0).getBoundingClientRect().width),
                Math.round($fourthGroupLastCell.position().left + $fourthGroupLastCell.get(0).getBoundingClientRect().width)
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

    QUnit.test("Cells have right cellData in horizontal grouped WorkSpace Month view", function(assert) {
        this.instance.option({
            currentDate: new Date(2018, 2, 1),
            groupOrientation: "vertical",
            groups: [{
                name: "one",
                items: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
            }]
        });

        var firstCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).data("dxCellData"),
            secondCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(51).data("dxCellData");

        assert.deepEqual(firstCellData.startDate, new Date(2018, 1, 25, 0), "cell has right startDate");
        assert.deepEqual(firstCellData.endDate, new Date(2018, 1, 26, 0), "cell has right endtDate");

        assert.deepEqual(secondCellData.startDate, new Date(2018, 2, 6, 0), "cell has right startDate");
        assert.deepEqual(secondCellData.endDate, new Date(2018, 2, 7, 0), "cell has right endtDate");
    });

})("Work Space Month");

(function() {

    QUnit.module("Work Space Month with horizontal grouping", {
        beforeEach: function() {
            this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
                currentDate: new Date(2018, 2, 1),
                groupOrientation: "vertical",
                crossScrollingEnabled: true
            }).dxSchedulerWorkSpaceMonth("instance");

            stubInvokeMethod(this.instance);

            this.instance.option("groups", [{
                name: "one",
                items: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
            }]);
        }
    });

    QUnit.test("Group table content should have right height", function(assert) {
        var $groupHeaderContents = this.instance.$element().find(".dx-scheduler-group-header-content");
        resizeCallbacks.fire();
        assert.roughEqual($groupHeaderContents.eq(0).outerHeight(), 449, 5, "Group header content height is OK");
        assert.roughEqual($groupHeaderContents.eq(1).outerHeight(), 449, 5, "Group header content height is OK");
    });

    QUnit.test("Group width calculation", function(assert) {
        sinon.stub(this.instance, "getCellWidth").returns(50);

        assert.equal(this.instance.getGroupWidth(), 350, "Group width is OK");
    });

    QUnit.test("Tables should not be rerendered if dimension was changed and horizontal scrolling is disabled", function(assert) {
        this.instance.option("crossScrollingEnabled", false);
        var stub = sinon.stub(this.instance, "_setTableSizes");

        resizeCallbacks.fire();

        assert.notOk(stub.calledOnce, "Tables weren't updated");
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

    QUnit.test("Workspace should handle enter/space key correctly if e.cancel=true", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
                focusStateEnabled: true,
                firstDayOfWeek: 1,
                editing: true,
                onCellClick: function(e) {
                    e.cancel = true;
                },
                currentDate: new Date(2015, 3, 1)
            }),
            keyboard = keyboardMock($element),
            instance = $element.dxSchedulerWorkSpaceMonth("instance"),
            updateSpy = sinon.spy(noop);

        instance.notifyObserver = updateSpy;

        $($element.find("." + CELL_CLASS).eq(0)).trigger("focusin");
        keyboard.keyDown("enter");
        $($element).trigger("focusin");
        keyboard.keyDown("enter");

        assert.notOk(updateSpy.called, "Observer method was not called if e.cancel = true");
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

    QUnit.test("Multiple selected cells should have focused class in vertical grouped Workspace Week", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceWeek({
                focusStateEnabled: true,
                currentDate: new Date(2018, 4, 21),
                groupOrientation: "vertical",
                endDayHour: 2
            }),
            instance = $element.dxSchedulerWorkSpaceWeek("instance");

        stubInvokeMethod(instance);

        instance.option("groups", [{ name: "a", items: [{ id: 1, text: "a.1" }, { id: 2, text: "a.2" }] }]);

        var cells = $element.find("." + CELL_CLASS),
            cell = cells.eq(14).get(0),
            $table = $element.find(".dx-scheduler-date-table");

        pointerMock(cells.eq(0)).start().click();

        $($table).trigger($.Event("dxpointerdown", { target: cells.eq(0).get(0), which: 1, pointerType: "mouse" }));

        $($table).trigger($.Event("dxpointermove", { target: cell, which: 1 }));

        assert.equal(cells.filter(".dx-state-focused").length, 3, "right quantity of focused cells");
        assert.ok(cells.eq(0).hasClass("dx-state-focused"), "right first focused cell");
        assert.ok(cells.eq(14).hasClass("dx-state-focused"), "right last focused cell");

        $($element).trigger("focusout");
        cell = cells.eq(42).get(0);

        pointerMock(cells.eq(28)).start().click();

        $($table).trigger($.Event("dxpointerdown", { target: cells.eq(28).get(0), which: 1, pointerType: "mouse" }));

        $($table).trigger($.Event("dxpointermove", { target: cell, which: 1 }));

        assert.equal(cells.filter(".dx-state-focused").length, 3, "right quantity of focused cells");
        assert.ok(cells.eq(28).hasClass("dx-state-focused"), "right first focused cell");
        assert.ok(cells.eq(42).hasClass("dx-state-focused"), "right last focused cell");
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
        assert.expect(3);

        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
            currentDate: new Date(2015, 9, 1),
            focusStateEnabled: true,
            onCellClick: function(e) {
                assert.equal(isRenderer(e.cellElement), !!config().useJQuery, "cell is clicked");
                assert.deepEqual($(e.cellElement)[0], $cell[0], "cell is clicked");
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

    QUnit.test("onCellContextMenu should be fired after trigger context menu event", function(assert) {
        assert.expect(4);

        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth({
            focusStateEnabled: true,
            currentDate: new Date(2018, 2, 1),
            onCellContextMenu: function(e) {
                assert.ok(true, "event is handled");
                assert.equal(isRenderer(e.cellElement), !!config().useJQuery, "cell is correct");
                assert.deepEqual($(e.cellElement)[0], $cell[0], "cell is correct");
                assert.deepEqual(e.cellData, { startDate: new Date(2018, 1, 26), endDate: new Date(2018, 1, 27) }, "cell is correct");
            }
        });

        var $cell = $element.find("." + CELL_CLASS).eq(1);
        $($cell).trigger("dxcontextmenu");
    });

    QUnit.test("Cells should be focused after onCellContextMenu event firing", function(assert) {
        var $element = $("#scheduler-work-space").dxSchedulerWorkSpaceWeek({
            focusStateEnabled: true,
            currentDate: new Date(2018, 2, 1)
        });
        var keyboard = keyboardMock($element),
            cells = $element.find("." + CELL_CLASS);

        pointerMock(cells.eq(7)).start().click();
        keyboard.keyDown("right", { shiftKey: true });
        $(cells.eq(8)).trigger("dxcontextmenu");
        $($element).trigger("focusout");

        assert.equal(cells.filter(".dx-state-focused").length, 49, "right cells are focused");
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

    QUnit.test("Week view, fractional value", function(assert) {
        this.createInstance("Week", { width: 800, height: 800 });
        var index = this.instance.getCellIndexByCoordinates({ left: 160.4, top: 55 });

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

    QUnit.test("Horizontal grouped view", function(assert) {
        this.createInstance("Week", {
            width: 800,
            height: 800,
            groups: [{ name: "a", items: [{ id: 1, text: "a.1" }, { id: 2, text: "a.2" }] }]
        });
        var index = this.instance.getCellIndexByCoordinates({ left: 200, top: 55 });

        assert.equal(index, 16, "Index is OK");
    });

    QUnit.test("Vertical grouped view", function(assert) {
        this.createInstance("Week", {
            width: 800,
            height: 800,
            groupOrientation: "vertical"
        }, true);

        stubInvokeMethod(this.instance);
        this.instance.option("groups", [{ name: "a", items: [{ id: 1, text: "a.1" }, { id: 2, text: "a.2" }] }]);

        var index = this.instance.getCellIndexByCoordinates({ left: 200, top: 55 });

        assert.equal(index, 7, "Index is OK");
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
            this.createInstance = function(options) {
                this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceDay(options).dxSchedulerWorkSpaceDay("instance");
                stubInvokeMethod(this.instance);
            };
        }
    });

    QUnit.test("WorkSpace Day view cells have right cellData with view option intervalCount=2", function(assert) {
        this.createInstance({
            intervalCount: 2,
            currentDate: new Date(2017, 5, 29)
        });

        var firstCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(1).data("dxCellData"),
            secondCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(95).data("dxCellData");

        assert.deepEqual(firstCellData.startDate, new Date(2017, 5, 30, 0), "cell has right startDate");
        assert.deepEqual(firstCellData.endDate, new Date(2017, 5, 30, 0, 30), "cell has right endtDate");

        assert.deepEqual(secondCellData.startDate, new Date(2017, 5, 30, 23, 30), "cell has right startDate");
        assert.deepEqual(secondCellData.endDate, new Date(2017, 5, 31, 0), "cell has right endtDate");
    });

    QUnit.test("WorkSpace Day view cells have right cellData with view option intervalCount = 3 and startDate < currentDate", function(assert) {
        this.createInstance({
            intervalCount: 3,
            currentDate: new Date(2017, 5, 28),
            startDate: new Date(2017, 5, 21)
        });

        var firstCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).data("dxCellData"),
            secondCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(143).data("dxCellData");

        assert.deepEqual(firstCellData.startDate, new Date(2017, 5, 27, 0), "cell has right startDate");
        assert.deepEqual(firstCellData.endDate, new Date(2017, 5, 27, 0, 30), "cell has right endtDate");

        assert.deepEqual(secondCellData.startDate, new Date(2017, 5, 29, 23, 30), "cell has right startDate");
        assert.deepEqual(secondCellData.endDate, new Date(2017, 5, 30, 0), "cell has right endtDate");
    });

    QUnit.test("WorkSpace Day view cells have right cellData with view option intervalCount = 3 and startDate > currentDate", function(assert) {
        this.createInstance({
            intervalCount: 3,
            currentDate: new Date(2017, 5, 25),
            startDate: new Date(2017, 5, 30)
        });

        var firstCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).data("dxCellData"),
            secondCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(143).data("dxCellData");

        assert.deepEqual(firstCellData.startDate, new Date(2017, 5, 24, 0), "cell has right startDate");
        assert.deepEqual(firstCellData.endDate, new Date(2017, 5, 24, 0, 30), "cell has right endtDate");

        assert.deepEqual(secondCellData.startDate, new Date(2017, 5, 26, 23, 30), "cell has right startDate");
        assert.deepEqual(secondCellData.endDate, new Date(2017, 5, 27, 0), "cell has right endtDate");
    });

    QUnit.test("Get date range", function(assert) {
        this.createInstance({
            intervalCount: 2,
            currentDate: new Date(2015, 2, 16)
        });

        assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 16, 0, 0), new Date(2015, 2, 17, 23, 59)], "Range is OK");

        this.instance.option("intervalCount", 4);
        assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 16, 0, 0), new Date(2015, 2, 19, 23, 59)], "Range is OK");
    });

    QUnit.test("WorkSpace Day view with option intervalCount = 3 should have right header", function(assert) {
        this.createInstance({
            intervalCount: 3,
            currentDate: new Date(2017, 5, 25),
            startDate: new Date(2017, 5, 24)
        });

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
            this.createInstance = function(options) {
                this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceWeek(options).dxSchedulerWorkSpaceWeek("instance");
                stubInvokeMethod(this.instance);
            };
        }
    });

    QUnit.test("WorkSpace Week view cells have right cellData with view option intervalCount", function(assert) {
        this.createInstance({
            intervalCount: 2,
            currentDate: new Date(2017, 5, 25)
        });

        var firstCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(6).data("dxCellData"),
            secondCellData = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(671).data("dxCellData");

        assert.deepEqual(firstCellData.startDate, new Date(2017, 6, 1, 0), "cell has right startDate");
        assert.deepEqual(firstCellData.endDate, new Date(2017, 6, 1, 0, 30), "cell has right endtDate");

        assert.deepEqual(secondCellData.startDate, new Date(2017, 6, 8, 23, 30), "cell has right startDate");
        assert.deepEqual(secondCellData.endDate, new Date(2017, 6, 9, 0), "cell has right endtDate");
    });

    QUnit.test("WorkSpace Week view cells have right cellData with view option intervalCount = 3 and startDate < currentDate", function(assert) {
        this.createInstance({
            intervalCount: 3,
            hoursInterval: 1,
            firstDayOfWeek: 1,
            currentDate: new Date(2017, 6, 26),
            startDate: new Date(2017, 6, 4)
        });

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
        this.createInstance({
            intervalCount: 2,
            hoursInterval: 1,
            firstDayOfWeek: 1,
            currentDate: new Date(2017, 6, 4),
            startDate: new Date(2017, 6, 26)
        });

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
        this.createInstance({
            intervalCount: 3,
            currentDate: new Date(2015, 2, 15)
        });

        assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 15, 0, 0), new Date(2015, 3, 4, 23, 59)], "Range is OK");

        this.instance.option("intervalCount", 4);
        assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 15, 0, 0), new Date(2015, 3, 11, 23, 59)], "Range is OK");
    });
})("Work Space Week with intervalCount");

(function() {
    QUnit.module("Work Space Work Week with intervalCount", {
        beforeEach: function() {
            this.createInstance = function(options) {
                this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceWorkWeek(options).dxSchedulerWorkSpaceWorkWeek("instance");
                stubInvokeMethod(this.instance);
            };
        }
    });

    QUnit.test("'getCoordinatesByDate' should return right coordinates with view option intervalCount", function(assert) {
        this.createInstance({
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

    QUnit.test("'getCoordinatesByDate' should return right coordinates with view option intervalCount, short day duration", function(assert) {
        this.createInstance({
            intervalCount: 2,
            currentDate: new Date(2017, 5, 25),
            startDayHour: 10,
            endDayHour: 13
        });

        var $element = this.instance.$element();

        var coords = this.instance.getCoordinatesByDate(new Date(2017, 6, 6, 12, 0), 0, false),
            targetCellPosition = $element.find(".dx-scheduler-date-table tbody td").eq(48).position();

        assert.equal(coords.top, targetCellPosition.top, "Cell coordinates are right");
        assert.equal(coords.left, targetCellPosition.left, "Cell coordinates are right");
    });

    QUnit.test("WorkSpace WorkWeek view cells have right cellData with view option intervalCount", function(assert) {
        this.createInstance({
            intervalCount: 2,
            currentDate: new Date(2017, 5, 25)
        });

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
        this.createInstance({
            intervalCount: 3,
            hoursInterval: 1,
            firstDayOfWeek: 1,
            currentDate: new Date(2017, 6, 26),
            startDate: new Date(2017, 6, 4)
        });

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
        this.createInstance({
            intervalCount: 2,
            hoursInterval: 1,
            firstDayOfWeek: 1,
            currentDate: new Date(2017, 6, 4),
            startDate: new Date(2017, 6, 26)
        });

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
        this.createInstance({
            intervalCount: 3,
            currentDate: new Date(2017, 5, 26)
        });

        assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 26, 0, 0), new Date(2017, 6, 14, 23, 59)], "Range is OK");

        this.instance.option("intervalCount", 4);
        assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 26, 0, 0), new Date(2017, 6, 21, 23, 59)], "Range is OK");
    });

    QUnit.test("Grouped WorkSpace WorkWeek view cells have right cellData with view option intervalCount", function(assert) {
        this.createInstance({
            intervalCount: 2,
            hoursInterval: 1,
            firstDayOfWeek: 1,
            currentDate: new Date(2017, 6, 4)
        });

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
            this.createInstance = function(options) {
                this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceMonth(options).dxSchedulerWorkSpaceMonth("instance");
                stubInvokeMethod(this.instance);
            };
        }
    });

    QUnit.test("WorkSpace Month view cells have right cellData with view option intervalCount & startDate < currentDate", function(assert) {
        this.createInstance({
            intervalCount: 3,
            currentDate: new Date(2017, 4, 25),
            startDate: new Date(2017, 0, 15)
        });

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
        this.createInstance({
            intervalCount: 3,
            currentDate: new Date(2017, 1, 15),
            startDate: new Date(2017, 5, 15)
        });

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
        this.createInstance({
            intervalCount: 3,
            currentDate: new Date(2017, 6, 15),
            startDate: new Date(2017, 5, 15)
        });

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

    QUnit.test("Get date range", function(assert) {
        this.createInstance({
            intervalCount: 3,
            currentDate: new Date(2017, 5, 26),
        });

        assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 4, 28, 0, 0), new Date(2017, 8, 2, 23, 59)], "Range is OK");

        this.instance.option("intervalCount", 4);
        assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 4, 28, 0, 0), new Date(2017, 8, 30, 23, 59)], "Range is OK");
    });

})("Work Space Work Week with intervalCount");

