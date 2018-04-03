"use strict";

import $ from "jquery";
import SchedulerTimeline from "ui/scheduler/ui.scheduler.timeline";
import SchedulerWorkSpaceVerticalStrategy from "ui/scheduler/ui.scheduler.work_space.grouped.strategy.vertical";
import SchedulerResourcesManager from "ui/scheduler/ui.scheduler.resource_manager";
import "ui/scheduler/ui.scheduler";

QUnit.testStart(() => {
    const markup =
        '<div id="scheduler-timeline"></div>';

    $("#qunit-fixture").html(markup);
});

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

