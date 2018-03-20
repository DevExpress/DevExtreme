"use strict";

import $ from "jquery";
// import fx from "animation/fx";
import SchedulerWorkSpace from "ui/scheduler/ui.scheduler.work_space";
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

    VERTICAL_SIZES_CLASS = "dx-scheduler-cell-sizes-vertical";

    // CELL_CLASS = "dx-scheduler-date-table-cell",
    // HORIZONTAL_SIZES_CLASS = "dx-scheduler-cell-sizes-horizontal",
    // VERTICAL_SIZES_CLASS = "dx-scheduler-cell-sizes-vertical",
    // DROPPABLE_CELL_CLASS = "dx-scheduler-date-table-droppable-cell",
    // ALL_DAY_TABLE_CELL_CLASS = "dx-scheduler-all-day-table-cell";

const toSelector = cssClass => "." + cssClass;


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
