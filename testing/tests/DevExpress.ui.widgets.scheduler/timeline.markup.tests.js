"use strict";

import $ from "jquery";
import SchedulerTimeline from "ui/scheduler/ui.scheduler.timeline";
import SchedulerTimelineDay from "ui/scheduler/ui.scheduler.timeline_day";
import dataUtils from "core/element_data";
import dateLocalization from "localization/date";
import SchedulerWorkSpaceVerticalStrategy from "ui/scheduler/ui.scheduler.work_space.grouped.strategy.vertical";
import SchedulerResourcesManager from "ui/scheduler/ui.scheduler.resource_manager";
import "ui/scheduler/ui.scheduler";

QUnit.testStart(() => {
    const markup =
        '<div id="scheduler-timeline"></div>';

    $("#qunit-fixture").html(markup);
});

const CELL_CLASS = "dx-scheduler-date-table-cell";

var checkHeaderCells = function($element, assert, interval, groupCount) {
    interval = interval || 0.5;
    groupCount = groupCount || 1;
    var cellCount = 24 / interval,
        cellDuration = 3600000 * interval;

    assert.equal($element.find(".dx-scheduler-header-panel-cell").length, cellCount * groupCount, "Time panel has a right count of cells");
    $element.find(".dx-scheduler-header-panel-cell").each(function(index) {
        var time = dateLocalization.format(new Date(new Date(1970, 0).getTime() + cellDuration * index), "shorttime");
        assert.equal($(this).text(), time, "Time is OK");
    });
};

const stubInvokeMethod = (instance) => {
    sinon.stub(instance, "invoke", function() {
        var subscribe = arguments[0];
        if(subscribe === "createResourcesTree") {
            return new SchedulerResourcesManager().createResourcesTree(arguments[1]);
        }
        if(subscribe === "convertDateByTimezone") {
            return arguments[1];
        }
    });
};

const moduleConfig = {
    beforeEach: () =>{
        this.createInstance = function(options) {
            if(this.instance) {
                this.instance.invoke.restore();
                delete this.instance;
            }

            this.instance = $("#scheduler-timeline").dxSchedulerTimeline().dxSchedulerTimeline("instance");
            stubInvokeMethod(this.instance, options);
        };

        this.createInstance();
    }
};

QUnit.module("Timeline markup", moduleConfig, () => {
    QUnit.test("Scheduler timeline should be initialized", (assert) => {
        assert.ok(this.instance instanceof SchedulerTimeline, "dxSchedulerTimeLine was initialized");
    });

    QUnit.test("Scheduler timeline should have right groupedStrategy by default", (assert) => {
        assert.ok(this.instance._groupedStrategy instanceof SchedulerWorkSpaceVerticalStrategy, "Grouped strategy is right");
    });

    QUnit.test("Two scrollable elements should be rendered", (assert) => {
        let $dateTableScrollable = this.instance.$element().find(".dx-scheduler-date-table-scrollable"),
            $headerScrollable = this.instance.$element().find(".dx-scheduler-header-scrollable");


        assert.equal($dateTableScrollable.length, 1, "Date table scrollable was rendered");
        assert.ok($dateTableScrollable.dxScrollable("instance"), "Date table scrollable is instance of dxScrollable");

        assert.equal($headerScrollable.length, 1, "Header scrollable was rendered");
        assert.ok($headerScrollable.dxScrollable("instance"), "Header scrollable is instance of dxScrollable");
    });

    QUnit.test("Both scrollable elements should be rendered if crossScrollingEnabled=true", (assert) => {
        this.instance.option("crossScrollingEnabled", true);
        assert.ok(this.instance.$element().hasClass("dx-scheduler-work-space-both-scrollbar"), "CSS class is OK");
        this.instance.option("crossScrollingEnabled", false);
        assert.notOk(this.instance.$element().hasClass("dx-scheduler-work-space-both-scrollbar"), "CSS class is OK");
    });

    QUnit.test("Date table scrollable should have right config", (assert) => {
        let dateTableScrollable = this.instance.$element().find(".dx-scheduler-date-table-scrollable").dxScrollable("instance");

        assert.equal(dateTableScrollable.option("direction"), "horizontal", "Direction is OK");
    });

    QUnit.test("Date table scrollable should have right config for crossScrolling", (assert) => {
        this.instance.option("crossScrollingEnabled", true);
        let dateTableScrollable = this.instance.$element().find(".dx-scheduler-date-table-scrollable").dxScrollable("instance");

        assert.equal(dateTableScrollable.option("direction"), "both", "Direction is OK");
    });

    QUnit.test("Sidebar should contain group table in grouped mode", (assert) => {
        let $element = this.instance.$element();

        this.instance.option("groups", [{ name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] }]);
        let $groupTable = $element.find(".dx-scheduler-sidebar-scrollable .dx-scheduler-group-table");

        assert.equal($groupTable.length, 1, "Group table is rendered");
    });

    QUnit.test("Header panel should not contain group rows in grouped mode", (assert) => {
        let $element = this.instance.$element();

        this.instance.option("groups", [{ name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] }]);
        let $groupRows = $element.find(".dx-scheduler-header-panel .dx-scheduler-group-row");

        assert.strictEqual($groupRows.length, 0, "Header panel does not contain any group row");
    });

    QUnit.test("Group table should contain right rows and cells count", (assert) => {
        let $element = this.instance.$element();

        this.instance.option("groups", [
            { name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] },
            { name: "two", items: [{ id: 1, text: "1" }, { id: 2, text: "2" }] }
        ]);

        let $groupTable = $element.find(".dx-scheduler-sidebar-scrollable .dx-scheduler-group-table"),
            $groupRows = $groupTable.find(".dx-scheduler-group-row"),
            $firstRowCells = $groupRows.eq(0).find(".dx-scheduler-group-header"),
            $secondRowCells = $groupRows.eq(1).find(".dx-scheduler-group-header"),
            $thirdRowCells = $groupRows.eq(2).find(".dx-scheduler-group-header"),
            $fourthRowCells = $groupRows.eq(3).find(".dx-scheduler-group-header");

        assert.equal($groupRows.length, 4, "Row count is OK");
        assert.equal($firstRowCells.length, 2, "Cell count is OK");
        assert.equal($firstRowCells.eq(0).attr("rowspan"), 2, "Rowspan is OK");
        assert.equal($firstRowCells.eq(1).attr("rowspan"), 1, "Rowspan is OK");

        assert.equal($secondRowCells.length, 1, "Cell count is OK");
        assert.equal($secondRowCells.eq(0).attr("rowspan"), 1, "Rowspan is OK");

        assert.equal($thirdRowCells.length, 2, "Cell count is OK");
        assert.equal($thirdRowCells.eq(0).attr("rowspan"), 2, "Rowspan is OK");
        assert.equal($thirdRowCells.eq(1).attr("rowspan"), 1, "Rowspan is OK");

        assert.equal($fourthRowCells.length, 1, "Cell count is OK");
        assert.equal($fourthRowCells.eq(0).attr("rowspan"), 1, "Rowspan is OK");
    });

    QUnit.test("Timeline should have the right 'dx-group-column-count' attr depend on group count", (assert) => {
        let $element = this.instance.$element();

        this.instance.option("groups", [
            { name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] },
            { name: "two", items: [{ id: 1, text: "1" }, { id: 2, text: "2" }] }
        ]);

        assert.equal($element.attr("dx-group-column-count"), "2", "Attr is OK");
        assert.notOk($element.attr("dx-group-row-count"), "row-count attr is not applied");

        this.instance.option("groups", []);

        assert.notOk($element.attr("dx-group-column-count"), "column-count attr is not applied");
    });
});

const timelineDayModuleConfig = {
    beforeEach: () =>{
        this.createInstance = function(options) {
            if(this.instance) {
                this.instance.invoke.restore();
                delete this.instance;
            }

            this.instance = $("#scheduler-timeline").dxSchedulerTimelineDay().dxSchedulerTimelineDay("instance");
            stubInvokeMethod(this.instance, options);
        };

        this.createInstance();
    }
};

QUnit.module("TimelineDay markup", timelineDayModuleConfig, () => {
    QUnit.test("Scheduler timelineDay should be initialized", (assert) => {
        assert.ok(this.instance instanceof SchedulerTimelineDay, "dxSchedulerTimeLineDay was initialized");
    });

    QUnit.test("Scheduler timeline day should have a right css class", (assert) => {
        let $element = this.instance.$element();
        assert.ok($element.hasClass("dx-scheduler-timeline"), "dxSchedulerTimelineDay has 'dx-scheduler-timeline' css class");
        assert.ok($element.hasClass("dx-scheduler-timeline-day"), "dxSchedulerTimelineDay has 'dx-scheduler-timeline' css class");
    });

    QUnit.test("Scheduler timeline day view should have right cell & row count", (assert) => {
        let $element = this.instance.$element();

        assert.equal($element.find(".dx-scheduler-date-table-row").length, 1, "Date table has 1 rows");
        assert.equal($element.find(".dx-scheduler-date-table-cell").length, 48, "Date table has 48 cells");
    });

    QUnit.test("Scheduler timeline day should have rigth first view date", (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 9, 21),
            firstDayOfWeek: 1,
            startDayHour: 4
        });

        assert.deepEqual(this.instance.getStartViewDate(), new Date(2015, 9, 21, 4), "First view date is OK");
    });

    QUnit.test("Each cell of scheduler timeline day should contain rigth jQuery dxCellData", (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 9, 21),
            firstDayOfWeek: 1,
            startDayHour: 5,
            hoursInterval: 1
        });

        let $cells = this.instance.$element().find("." + CELL_CLASS);

        assert.deepEqual(dataUtils.data($cells.get(0), "dxCellData"), {
            startDate: new Date(2015, 9, 21, 5),
            endDate: new Date(2015, 9, 21, 6),
            allDay: false
        }, "data of first cell is rigth");

        assert.deepEqual(dataUtils.data($cells.get(5), "dxCellData"), {
            startDate: new Date(2015, 9, 21, 10),
            endDate: new Date(2015, 9, 21, 11),
            allDay: false
        }, "data of 5th cell is rigth");

        assert.deepEqual(dataUtils.data($cells.get(10), "dxCellData"), {
            startDate: new Date(2015, 9, 21, 15),
            endDate: new Date(2015, 9, 21, 16),
            allDay: false
        }, "data of 10th cell is rigth");
    });

    QUnit.test("Each cell of grouped scheduler timeline day should contain rigth jQuery dxCellData", (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 9, 21),
            firstDayOfWeek: 1,
            startDayHour: 5,
            hoursInterval: 1,
            groups: [
                { name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] },
                { name: "two", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] }
            ]
        });

        let $cells = this.instance.$element().find(".dx-scheduler-date-table-row").eq(2).find("." + CELL_CLASS);

        assert.deepEqual(dataUtils.data($cells.get(0), "dxCellData"), {
            startDate: new Date(2015, 9, 21, 5),
            endDate: new Date(2015, 9, 21, 6),
            allDay: false,
            groups: {
                one: 2,
                two: 1
            }
        }, "data of first cell is rigth");

        assert.deepEqual(dataUtils.data($cells.get(5), "dxCellData"), {
            startDate: new Date(2015, 9, 21, 10),
            endDate: new Date(2015, 9, 21, 11),
            allDay: false,
            groups: {
                one: 2,
                two: 1
            }
        }, "data of 5th cell is rigth");

        assert.deepEqual(dataUtils.data($cells.get(10), "dxCellData"), {
            startDate: new Date(2015, 9, 21, 15),
            endDate: new Date(2015, 9, 21, 16),
            allDay: false,
            groups: {
                one: 2,
                two: 1
            }
        }, "data of 10th cell is rigth");
    });

    QUnit.test("Header panel should have right quantity of cells", (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 9, 21, 0, 0)
        });
        checkHeaderCells(this.instance.$element(), assert);
    });

    QUnit.test("Date table should have right quantity of cells", (assert) => {
        var $element = this.instance.$element();

        this.instance.option("groups", [{ name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] }]);
        let $rows = $element.find(".dx-scheduler-date-table-row");

        assert.equal($rows.length, 2, "Date table has 2 rows");
        assert.equal($rows.eq(0).find(".dx-scheduler-date-table-cell").length, 48, "The first group row has 48 cells");
        assert.equal($rows.eq(1).find(".dx-scheduler-date-table-cell").length, 48, "The second group row has 48 cells");
    });

    QUnit.test("Scheduler timeline day should correctly process startDayHour=0", (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 5, 30),
            startDayHour: 10
        });

        this.instance.option("startDayHour", 0);

        assert.deepEqual(this.instance.getStartViewDate(), new Date(2015, 5, 30, 0), "First view date is correct");
    });

    QUnit.test("Cell count should depend on start/end day hour & hoursInterval", (assert) => {
        var $element = this.instance.$element();

        this.instance.option({
            currentDate: new Date(2015, 2, 1),
            startDayHour: 8,
            endDayHour: 20,
            hoursInterval: 2.5
        });

        assert.equal($element.find(".dx-scheduler-date-table-cell").length, 5, "Cell count is OK");
    });
});

