"use strict";

import $ from "jquery";
// import fx from "animation/fx";
import SchedulerWorkSpace from "ui/scheduler/ui.scheduler.work_space";
import SchedulerResourcesManager from "ui/scheduler/ui.scheduler.resource_manager";
import dateLocalization from "localization/date";
import "ui/scheduler/ui.scheduler";
// import DataSource from "data/data_source/data_source";
// import dxSchedulerAppointmentModel from "ui/scheduler/ui.scheduler.appointment_model";
"use strict";

// var pointerMock = require("../../helpers/pointerMock.js");

// var $ = require("jquery"),
//     noop = require("core/utils/common").noop,
//     isRenderer = require("core/utils/type").isRenderer,
//     dxScheduler = require("ui/scheduler/ui.scheduler"),
//     translator = require("animation/translator"),
//     devices = require("core/devices"),
//     domUtils = require("core/utils/dom"),
//     dateUtils = require("core/utils/date"),
//     errors = require("ui/widget/ui.errors"),
//     Color = require("color"),
//     fx = require("animation/fx"),
//     config = require("core/config"),
//     dxSchedulerAppointmentModel = require("ui/scheduler/ui.scheduler.appointment_model"),
//     dxSchedulerWorkSpace = require("ui/scheduler/ui.scheduler.work_space"),
//     dxSchedulerWorkSpaceDay = require("ui/scheduler/ui.scheduler.work_space_day"),
//     dragEvents = require("events/drag"),
//     DataSource = require("data/data_source/data_source").DataSource,
//     CustomStore = require("data/custom_store"),
//     SchedulerTimezones = require("ui/scheduler/ui.scheduler.timezones"),
//     dataUtils = require("core/element_data"),
//     keyboardMock = require("../../helpers/keyboardMock.js");

// require("common.css!");
// require("generic_light.css!");

QUnit.testStart(() => {
    const markup =
        '<div id="scheduler"> </div>\
        <div id="scheduler-work-space"> </div>';

    $("#qunit-fixture").html(markup);
});

const WORKSPACE_CLASS = "dx-scheduler-work-space",
    WORKSPACE_WITH_COUNT_CLASS = "dx-scheduler-work-space-count",
    HEADER_PANEL_CLASS = "dx-scheduler-header-panel",
    ALL_DAY_PANEL_CLASS = "dx-scheduler-all-day-panel",
    TIME_PANEL_CLASS = "dx-scheduler-time-panel",
    DATE_TABLE_CLASS = "dx-scheduler-date-table",
    ALL_DAY_TITLE_CLASS = "dx-scheduler-all-day-title",

    CELL_CLASS = "dx-scheduler-date-table-cell",
    HORIZONTAL_SIZES_CLASS = "dx-scheduler-cell-sizes-horizontal",
    VERTICAL_SIZES_CLASS = "dx-scheduler-cell-sizes-vertical";

const toSelector = cssClass => "." + cssClass;

const stubInvokeMethod = function(instance, options) {
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

var checkRowsAndCells = function($element, assert, interval, start) {
    interval = interval || 0.5;
    start = start || 0;
    var cellCount = (24 - start) / interval,
        cellDuration = 3600000 * interval;

    assert.equal($element.find(".dx-scheduler-time-panel-row").length, cellCount, "Time panel has a right count of rows");
    assert.equal($element.find(".dx-scheduler-time-panel-cell").length, cellCount, "Time panel has a right count of cells");

    $element.find(".dx-scheduler-time-panel-cell").each(function(index) {
        var time;
        if(index % 2 === 0) {
            time = dateLocalization.format(new Date(new Date(1970, 0).getTime() + cellDuration * index + start * 3600000), "shorttime");
        } else {
            time = "";
        }
        assert.equal($(this).text(), time, "Time is OK");
    });
};

// const moduleConfig = {
//     beforeEach: () => {
//         this.clock = sinon.useFakeTimers();

//         this.instance = $("#scheduler").dxScheduler().dxScheduler("instance");
//         this.checkDateTime = function(assert, actualDate, expectedDate, messagePrefix) {
//             assert.equal(actualDate.getHours(), expectedDate.getHours(), messagePrefix + "Hours're OK");
//             assert.equal(actualDate.getMinutes(), expectedDate.getMinutes(), messagePrefix + "Minutes're OK");
//             assert.equal(actualDate.getSeconds(), expectedDate.getSeconds(), messagePrefix + "Seconds're OK");
//             assert.equal(actualDate.getMilliseconds(), expectedDate.getMilliseconds(), messagePrefix + "Milliseconds're OK");
//         };
//         fx.off = true;
//         this.tasks = [
//             {
//                 text: "Task 1",
//                 startDate: new Date(2015, 1, 9, 1, 0),
//                 endDate: new Date(2015, 1, 9, 2, 0)
//             },
//             {
//                 text: "Task 2",
//                 startDate: new Date(2015, 1, 9, 11, 0),
//                 endDate: new Date(2015, 1, 9, 12, 0)
//             }
//         ];
//     },
//     afterEach: () => {
//         this.clock.restore();
//         fx.off = false;
//     }
// };

const moduleConfig = {
    beforeEach: () =>{
        this.instance = $("#scheduler-work-space").dxSchedulerWorkSpace().dxSchedulerWorkSpace("instance");
        // stubInvokeMethod(this.instance);
    }
};

QUnit.module("Workspace markup", moduleConfig, () => {
    QUnit.test("Scheduler workspace should be initialized", (assert) => {
        assert.ok(this.instance instanceof SchedulerWorkSpace, "dxSchedulerWorkSpace was initialized");
    });

    QUnit.test("Scheduler workspace should have a right css class", (assert) => {
        const $element = this.instance.$element();
        assert.ok($element.hasClass(WORKSPACE_CLASS), "dxSchedulerWorkSpace has 'dx-scheduler-workspace' css class");
    });

    QUnit.test("Scheduler workspace with intervalCount should have a right css class", (assert) => {
        this.instance.option("intervalCount", 3);
        var $element = this.instance.$element();
        assert.ok($element.hasClass(WORKSPACE_WITH_COUNT_CLASS), "dxSchedulerWorkSpace has 'dx-scheduler-workspace' css class");

        this.instance.option("intervalCount", 1);
        $element = this.instance.$element();
        assert.notOk($element.hasClass(WORKSPACE_WITH_COUNT_CLASS), "dxSchedulerWorkSpace has 'dx-scheduler-workspace' css class");
    });

    QUnit.test("Scheduler workspace should contain time panel, header panel, allday panel and content", (assert) => {
        const $element = this.instance.$element();

        assert.equal($element.find(toSelector(HEADER_PANEL_CLASS)).length, 1, "Workspace contains the time panel");
        assert.equal($element.find(toSelector(ALL_DAY_PANEL_CLASS)).length, 1, "Workspace contains the all day panel");
        assert.equal($element.find(toSelector(TIME_PANEL_CLASS)).length, 1, "Workspace contains the time panel");
        assert.equal($element.find(toSelector(DATE_TABLE_CLASS)).length, 1, "Workspace contains date table");
    });

    QUnit.test("All day title should be rendered in workspace directly", (assert) => {
        const $element = this.instance.$element();

        assert.equal($element.children(toSelector(ALL_DAY_TITLE_CLASS)).length, 1, "All-day-title is OK");
    });

    QUnit.test("All day title has a special CSS class, if showAllDayPanel = false", (assert) => {
        this.instance.option("showAllDayPanel", false);

        const $element = this.instance.$element(),
            $allDayTitle = $element.find(".dx-scheduler-all-day-title");

        assert.ok($allDayTitle.hasClass("dx-scheduler-all-day-title-hidden"), "CSS class is OK");

        this.instance.option("showAllDayPanel", true);

        assert.notOk($allDayTitle.hasClass("dx-scheduler-all-day-title-hidden"), "CSS class is OK");
    });

    QUnit.test("Workspace should have specific css class, if showAllDayPanel = true ", (assert) => {
        this.instance.option("showAllDayPanel", true);

        const $element = this.instance.$element();
        assert.ok($element.hasClass("dx-scheduler-work-space-all-day"), "dxSchedulerWorkSpace has 'dx-scheduler-work-space-all-day' css class");

        this.instance.option("showAllDayPanel", false);
        assert.notOk($element.hasClass("dx-scheduler-work-space-all-day"), "dxSchedulerWorkSpace hasn't 'dx-scheduler-work-space-all-day' css class");
    });

    QUnit.test("Workspace should have specific css class, if hoursInterval = 0.5 ", (assert) => {
        this.instance.option("hoursInterval", 0.5);

        const $element = this.instance.$element();
        assert.ok($element.hasClass("dx-scheduler-work-space-odd-cells"), "dxSchedulerWorkSpace has 'dx-scheduler-work-space-odd-cells' css class");

        this.instance.option("hoursInterval", 0.75);
        assert.notOk($element.hasClass("dx-scheduler-work-space-odd-cells"), "dxSchedulerWorkSpace hasn't 'dx-scheduler-work-space-odd-cells' css class");
    });

    QUnit.test("All day panel has specific class when allDayExpanded = true", (assert) => {
        this.instance.option("showAllDayPanel", true);
        this.instance.option("allDayExpanded", true);

        const $element = this.instance.$element();

        assert.notOk($element.hasClass("dx-scheduler-work-space-all-day-collapsed"), "dxSchedulerWorkSpace has not 'dx-scheduler-work-space-all-day-collapsed' css class");

        this.instance.option("allDayExpanded", false);

        assert.ok($element.hasClass("dx-scheduler-work-space-all-day-collapsed"), "dxSchedulerWorkSpace has 'dx-scheduler-work-space-all-day-collapsed' css class");
    });

    QUnit.test("Workspace should not has specific class when showAllDayPanel = false", (assert) => {
        this.instance.option("showAllDayPanel", false);
        this.instance.option("allDayExpanded", false);

        const $element = this.instance.$element();

        assert.notOk($element.hasClass("dx-scheduler-work-space-all-day-collapsed"), "dxSchedulerWorkSpace has not 'dx-scheduler-work-space-all-day-collapsed' css class");

        this.instance.option("showAllDayPanel", true);

        assert.ok($element.hasClass("dx-scheduler-work-space-all-day-collapsed"), "dxSchedulerWorkSpace has 'dx-scheduler-work-space-all-day-collapsed' css class");
    });

    QUnit.test("Scheduler workspace parts should be wrapped by scrollable", (assert) => {
        var $element = this.instance.$element();

        assert.ok($element.find(".dx-scheduler-time-panel").parent().hasClass("dx-scrollable-content"), "Scrollable contains the time panel");
        assert.ok($element.find(".dx-scheduler-date-table").parent().hasClass("dx-scrollable-content"), "Scrollable contains date table");
    });

    QUnit.test("Workspace scrollable should work correctly after changing currentDate", (assert) => {
        this.instance.option("height", 200);
        this.instance.option("currentDate", new Date());

        const $element = this.instance.$element();

        assert.notEqual($element.find(".dx-scrollbar-vertical").css("display"), "none", "Scrollable works correctly");
    });

    QUnit.test("Workspace scrollable should work correctly after changing currentDate, crossScrollingEnabled = true", (assert) => {
        this.instance.option("crossScrollingEnabled", true);
        this.instance.option("height", 200);
        this.instance.option("currentDate", new Date());

        const $element = this.instance.$element();

        assert.notEqual($element.find(".dx-scrollbar-vertical").css("display"), "none", "Scrollable works correctly");
    });

    QUnit.test("Time panel cells and rows should have special css classes", (assert) => {
        const $element = this.instance.$element(),
            $row = $element.find(".dx-scheduler-time-panel tr").first(),
            $cell = $row.find("td").first();

        assert.ok($row.hasClass("dx-scheduler-time-panel-row"), "Css class of row is correct");
        assert.ok($cell.hasClass("dx-scheduler-time-panel-cell"), "Css class of cell is correct");
        assert.ok($cell.hasClass(VERTICAL_SIZES_CLASS), "Css class of cell is correct");
    });

    QUnit.test("All day panel row should have special css class", (assert) => {
        this.instance.option("showAllDayPanel", true);

        const $element = this.instance.$element(),
            $row = $element.find(".dx-scheduler-all-day-table tr").first();

        assert.ok($row.hasClass("dx-scheduler-all-day-table-row"), "Css class of row is correct");
    });

    QUnit.test("All-day-appointments container should be rendered directly in workspace", (assert) => {
        const $element = this.instance.$element();

        assert.equal($element.children(".dx-scheduler-all-day-appointments").length, 1, "Container is rendered correctly");
    });

    QUnit.test("Fixed appointments container should be rendered directly in workspace", (assert) => {
        const $element = this.instance.$element();

        assert.equal($element.children(".dx-scheduler-fixed-appointments").length, 1, "Container is rendered correctly");
    });

    QUnit.test("Work space should have 'grouped' class & group row count attr if there are some groups", (assert) => {
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

    QUnit.test("Work space should not have 'grouped' class & group row count attr if groups exist but empty(T381796)", (assert) => {
        assert.ok(!this.instance.$element().hasClass("dx-scheduler-work-space-grouped"), "'grouped' class is not applied");

        this.instance.option("groups", [{
            name: "one",
            items: []
        }]);

        assert.notOk(this.instance.$element().hasClass("dx-scheduler-work-space-grouped"), "'grouped' class isn't applied");
        assert.notOk(this.instance.$element().attr("dx-group-row-count"), "'dx-group-row-count' isn't applied");
    });

    QUnit.test("Group header should be rendered if there are some groups", (assert) => {

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

        const rows = this.instance.$element().find(".dx-scheduler-group-row"),
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

    QUnit.test("Group header should be rendered if there is a single group", (assert) => {
        this.instance.option("groups", [{ name: "one", items: [{ id: 1, text: "a" }] }]);

        const headers = this.instance.$element().find(".dx-scheduler-group-header");

        assert.equal(headers.length, 1, "Group are rendered");
        assert.equal(headers.eq(0).text(), "a", "Group header text is right");
    });

    QUnit.test("Group header should contain group header content", (assert) => {
        this.instance.option("groups", [{ name: "one", items: [{ id: 1, text: "a" }] }]);

        const header = this.instance.$element().find(".dx-scheduler-group-header"),
            headerContent = header.find(".dx-scheduler-group-header-content");

        assert.equal(headerContent.length, 1, "Group header content is rendered");
    });
});


const dayModuleConfig = {
    beforeEach: () => {
        this.createInstance = (options) => {
            if(this.instance) {
                // this.instance.invoke.restore();
                delete this.instance;
            }

            this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceDay().dxSchedulerWorkSpaceDay("instance");
            stubInvokeMethod(this.instance, options);
        };

        this.createInstance();
    }
};

QUnit.module("Workspace Day markup", dayModuleConfig, () => {
    QUnit.test("Scheduler workspace day should have a right css class", (assert) => {
        const $element = this.instance.$element();

        assert.ok($element.hasClass("dx-scheduler-work-space-day"), "dxSchedulerWorkSpaceDay has 'dx-scheduler-workspace-day' css class");
    });

    QUnit.test("Date table cells should have a special css classes", (assert) => {
        const $element = this.instance.$element(),
            classes = $element.find(".dx-scheduler-date-table td").attr("class").split(" ");

        assert.ok($.inArray(CELL_CLASS, classes) > -1, "Cell has a css class");
        assert.ok($.inArray(HORIZONTAL_SIZES_CLASS, classes) > -1, "Cell has a css class");
        assert.ok($.inArray(VERTICAL_SIZES_CLASS, classes) > -1, "Cell has a css class");
    });

    QUnit.test("Scheduler all day panel should contain one row", (assert) => {
        this.instance.option("showAllDayPanel", true);

        const $allDayPanel = this.instance.$element().find(".dx-scheduler-all-day-panel");

        assert.equal($allDayPanel.find("tbody tr").length, 1, "All day panel contains 1 row");
        assert.equal($allDayPanel.find("tbody tr>td").length, 1, "All day panel contains 1 cell");
    });

    QUnit.test("Scheduler workspace date-table rows and cells should have correct css-class", (assert) => {
        var $element = this.instance.$element(),
            $dateTable = $element.find(".dx-scheduler-date-table"),
            $row = $dateTable.find("tr").first(),
            $cell = $row.find("td").first();

        assert.ok($row.hasClass("dx-scheduler-date-table-row"), "Row class is correct");
        assert.ok($cell.hasClass("dx-scheduler-date-table-cell"), "Cell class is correct");
    });

    QUnit.test("Scheduler workspace day view", (assert) => {
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

    QUnit.test("Scheduler workspace day grouped view", (assert) => {
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

    QUnit.test("Grouped cells should have a right group field in dxCellData", (assert) => {
        var $element = this.instance.$element();

        this.instance.option("groups", [{ name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] }]);

        assert.deepEqual($element.find(".dx-scheduler-date-table tbody tr>td").eq(0).data("dxCellData").groups, {
            one: 1
        }, "Cell group is OK");
        assert.deepEqual($element.find(".dx-scheduler-date-table tbody tr>td").eq(1).data("dxCellData").groups, { one: 2 }, "Cell group is OK");
    });

    QUnit.test("Scheduler workspace day view should not contain a single header", (assert) => {
        var $element = this.instance.$element();

        assert.equal($element.find(".dx-scheduler-header-row th").length, 0, "Date table has not header cell");
    });

    QUnit.test("Scheduler workspace day grouped view should contain a few headers", (assert) => {
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

    QUnit.test("Time panel should have 24 rows and 24 cells", (assert) => {
        checkRowsAndCells(this.instance.$element(), assert);
    });

    QUnit.test("Time panel should have 22 rows and 22 cells for hoursInterval = 1 & startDayHour = 2", (assert) => {
        this.instance.option({
            hoursInterval: 1,
            startDayHour: 2
        });

        checkRowsAndCells(this.instance.$element(), assert, 1, 2);
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

const weekModuleConfig = {
    beforeEach: () => {
        this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceWeek({ 
            showCurrentTimeIndicator: false
        }).dxSchedulerWorkSpaceWeek("instance");
        stubInvokeMethod(this.instance);
    }
};

QUnit.module("Workspace Day markup", weekModuleConfig, () => {
    QUnit.test("Scheduler workspace week should have a right css class", (assert) => {
        var $element = this.instance.$element();

        assert.ok($element.hasClass("dx-scheduler-work-space-week"), "dxSchedulerWorkSpaceWeek has 'dx-scheduler-workspace-week' css class");
    });

    QUnit.test("Header cells should have a special css classes", (assert) => {
        var $element = this.instance.$element(),
            classes = $element.find(".dx-scheduler-header-panel th").attr("class").split(" ");

        assert.ok($.inArray("dx-scheduler-header-panel-cell", classes) > -1, "Cell has a css class");
        assert.ok($.inArray(HORIZONTAL_SIZES_CLASS, classes) > -1, "Cell has a css class");
        assert.notOk($.inArray(VERTICAL_SIZES_CLASS, classes) > -1, "Cell hasn't a css class");
    });

    QUnit.test("Scheduler all day panel should contain one row & 7 cells", (assert) => {
        this.instance.option("showAllDayPanel", true);

        var $allDayPanel = this.instance.$element().find(".dx-scheduler-all-day-panel");

        assert.equal($allDayPanel.find("tbody tr").length, 1, "All day panel contains 1 row");
        assert.equal($allDayPanel.find("tbody tr>td").length, 7, "All day panel contains 7 cell");
    });

    QUnit.test("Scheduler workspace week view", (assert) => {
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

    QUnit.test("Time panel should have 24 rows and 24 cells", (assert) => {
        this.instance.option("currentDate", new Date(1970, 0));
        checkRowsAndCells(this.instance.$element(), assert);
    });

    QUnit.test("Scheduler workspace week grouped view", (assert) => {
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

    QUnit.test("Scheduler workspace week view should contain a 7 headers", (assert) => {
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

    QUnit.test("Scheduler workspace grouped week view should contain a few headers", (assert) => {
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

    QUnit.test("Group row should be rendered before header row", (assert) => {
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
});

const workWeekModuleConfig = {
    beforeEach: () => {
        this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceWorkWeek().dxSchedulerWorkSpaceWorkWeek("instance");
        stubInvokeMethod(this.instance);
    }
};

QUnit.module("Workspace Work Week markup", workWeekModuleConfig, () => {
    QUnit.test("Scheduler workspace work week should have a right css class", (assert) => {
        var $element = this.instance.$element();

        assert.ok($element.hasClass("dx-scheduler-work-space-work-week"), "dxSchedulerWorkSpaceWorkWeek has 'dx-scheduler-workspace-work-week' css class");
    });

    QUnit.test("Scheduler all day panel should contain one row & 5 cells", (assert) => {
        this.instance.option("showAllDayPanel", true);

        var $allDayPanel = this.instance.$element().find(".dx-scheduler-all-day-panel");

        assert.equal($allDayPanel.find("tbody tr").length, 1, "All day panel contains 1 row");
        assert.equal($allDayPanel.find("tbody tr>td").length, 5, "All day panel contains 5 cell");
    });

    QUnit.test("Scheduler workspace work week view", (assert) => {
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

    QUnit.test("Scheduler workspace work week grouped view", (assert) => {
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

    QUnit.test("Scheduler workspace work week view should contain a 5 headers", (assert) => {
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

    QUnit.test("Scheduler workspace work week grouped view should contain a few headers", (assert) => {
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

    QUnit.test("Scheduler workspace work week view should be correct with any first day of week", (assert) => {
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

    QUnit.test("Scheduler workspace work week view should be correct, if currentDate is Sunday", (assert) => {
        var $element = this.instance.$element();

        this.instance.option("firstDayOfWeek", 0);
        this.instance.option("currentDate", new Date(2016, 0, 10));

        var $headerCells = $element.find(".dx-scheduler-header-row th");

        assert.equal($headerCells.first().text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[1].toLowerCase() + " 11", "first header has a right text");
        assert.equal($headerCells.eq(2).text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[3].toLowerCase() + " 13", "3 header has a right text");
        assert.equal($headerCells.last().text().toLowerCase(), dateLocalization.getDayNames("abbreviated")[5].toLowerCase() + " 15", "last header has a right text");
    });

    QUnit.test("Scheduler workspace work week view should be correct with any first day of week, if currentDate is Sunday", (assert) => {
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

    QUnit.test("Time panel should have 24 rows and 24 cells", (assert) => {
        checkRowsAndCells(this.instance.$element(), assert);
    });

});
// QUnit.module("Scheduler markup", moduleConfig, () => {
//     QUnit.test("Scheduler should be initialized", (assert) => {
//         assert.ok(this.instance instanceof dxScheduler, "Scheduler was initialized");
//     });

//     QUnit.test("Scheduler should have a right css classes", (assert) => {
//         assert.ok(this.instance.$element().hasClass("dx-scheduler"), "Scheduler has 'dx-scheduler' css class");
//         assert.ok(this.instance.$element().hasClass("dx-widget"), "Scheduler has 'dx-widget' css class");
//     });

//     QUnit.test("Scheduler should not fail when dataSource is set", (assert) => {
//         var data = new DataSource.DataSource({
//             store: this.tasks
//         });

//         var instance = $("#scheduler").dxScheduler({
//             dataSource: data,
//             views: ["day"],
//             currentView: "day"
//         }).dxScheduler("instance");

//         assert.ok(instance._appointmentModel instanceof dxSchedulerAppointmentModel, "Task model is initialized on scheduler init");
//         assert.ok(instance._appointmentModel._dataSource instanceof DataSource, "Task model has data source instance");
//     });
// });
