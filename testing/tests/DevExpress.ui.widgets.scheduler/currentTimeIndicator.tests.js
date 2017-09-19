"use strict";

var $ = require("jquery"),
    SchedulerResourcesManager = require("ui/scheduler/ui.scheduler.resource_manager");

require("common.css!");
require("generic_light.css!");

require("ui/scheduler/ui.scheduler.work_space_day");
require("ui/scheduler/ui.scheduler.work_space_week");
require("ui/scheduler/ui.scheduler.timeline_day"),
require("ui/scheduler/ui.scheduler.timeline_week"),
require("ui/scheduler/ui.scheduler.timeline_work_week"),
require("ui/scheduler/ui.scheduler.timeline_month"),
QUnit.testStart(function() {
    $("#qunit-fixture").html('<div id="scheduler-work-space"></div>');
});

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
    });
};

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

    QUnit.test("DateTimeIndicator should be rendered if needed, Day view", function(assert) {
        this.instance.option({
            currentIndicatorDate: new Date(2017, 8, 5, 12, 45)
        });
        var $element = this.instance.element();

        assert.equal($element.find(".dx-scheduler-date-time-indicator").length, 1, "Indicator is rendered correctly");

        this.instance.option("showCurrentTimeIndicator", false);
        $element = this.instance.element();

        assert.equal($element.find(".dx-scheduler-date-time-indicator").length, 0, "Indicator wasn't rendered");
    });

    QUnit.test("DateTimeIndicator on allDayPanel should be rendered if needed, Day view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            showAllDayPanel: false
        });
        var $element = this.instance.element();

        assert.equal($element.find(".dx-scheduler-date-time-indicator-all-day").length, 0, "Indicator wasn't rendered");

        this.instance.option("showAllDayPanel", true);

        assert.equal($element.find(".dx-scheduler-date-time-indicator").length, 1, "Indicator is rendered");
    });

    QUnit.test("DateTimeIndicator on allDayPanel should have correct height, Day view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            showAllDayPanel: true,
            allDayExpanded: false
        });
        var $element = this.instance.element();

        assert.roughEqual($element.find(".dx-scheduler-date-time-indicator-all-day").eq(0).outerHeight(), 24, 1, "Indicator has correct height");

        this.instance.option("allDayExpanded", true);

        assert.roughEqual($element.find(".dx-scheduler-date-time-indicator-all-day").eq(0).outerHeight(), 74, 1, "Indicator has correct height");
    });

    QUnit.test("DateTimeIndicator should be wrapped by scrollable, Day view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });
        var $element = this.instance.element();

        assert.ok($element.find(".dx-scheduler-date-time-indicator").parent().hasClass("dx-scrollable-content"), "Scrollable contains time indicator");
    });

    QUnit.test("AllDay dateTimeIndicator should be wrapped by allDay panel, Day view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            showAllDayPanel: true
        });
        var $element = this.instance.element();

        assert.ok($element.find(".dx-scheduler-date-time-indicator-all-day").parent().hasClass("dx-scheduler-all-day-panel"), "AllDay panel contains time indicator");
    });

    QUnit.test("DateTimeIndicator should have correct height, Day view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        var $element = this.instance.element(),
            $indicator = $element.find(".dx-scheduler-date-time-indicator");

        assert.roughEqual($indicator.outerHeight(), 475, 1, "Indicator has correct height");
    });

    QUnit.test("DateTimeIndicator should have limited height, Day view", function(assert) {
        this.instance.option({
            endDayHour: 18,
            indicatorTime: new Date(2017, 8, 5, 19, 45)
        });

        var $element = this.instance.element(),
            $indicator = $element.find(".dx-scheduler-date-time-indicator");

        assert.roughEqual($indicator.outerHeight(), 1001, 1, "Indicator has correct height");
        assert.equal($indicator.children(".dx-scheduler-date-time-indicator-content").length, 0, "Indicator has no content");
    });

    QUnit.test("DateTimeIndicator should have correct height & width, Day view with intervalCount", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 12, 45),
            intervalCount: 3
        });

        var $element = this.instance.element(),
            $indicator = $element.find(".dx-scheduler-date-time-indicator"),
            $topIndicator = $element.find(".dx-scheduler-date-time-indicator-top"),
            $bottomIndicator = $element.find(".dx-scheduler-date-time-indicator-bottom");

        assert.roughEqual($indicator.outerHeight(), 475, 1, "Indicator has correct height");
        assert.roughEqual($topIndicator.outerHeight(), 475, 1, "Top indicator has correct height");
        assert.roughEqual($bottomIndicator.outerHeight(), 1125, 1, "Bottom indicator has correct height");

        assert.roughEqual($indicator.outerWidth(), 898, 1, "Indicator has correct width");
        assert.roughEqual($topIndicator.outerWidth(), 598, 1, "Top indicator has correct width");
        assert.roughEqual($bottomIndicator.outerWidth(), 299, 1, "Bottom indicator has correct width");
    });

    QUnit.test("DateTimeIndicator should be rendered correctly, Day view with groups", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 12, 45),
            intervalCount: 3
        });

        this.instance.option("groups", [{ name: "a", items: [{ id: 1, text: "a.1" }, { id: 2, text: "a.2" }] }]);

        var $element = this.instance.element(),
            $indicator = $element.find(".dx-scheduler-date-time-indicator"),
            $firstTopIndicator = $element.find(".dx-scheduler-date-time-indicator-top").eq(0),
            $firstBottomIndicator = $element.find(".dx-scheduler-date-time-indicator-bottom").eq(0),
            $firstAllDayIndicator = $element.find(".dx-scheduler-date-time-indicator-all-day").eq(0),
            $secondTopIndicator = $element.find(".dx-scheduler-date-time-indicator-top").eq(1),
            $secondBottomIndicator = $element.find(".dx-scheduler-date-time-indicator-bottom").eq(1),
            $secondAllDayIndicator = $element.find(".dx-scheduler-date-time-indicator-all-day").eq(0);

        assert.roughEqual($indicator.outerHeight(), 475, 1, "Indicator has correct height");
        assert.roughEqual($firstTopIndicator.outerHeight(), 475, 1, "Top indicator has correct height");
        assert.roughEqual($firstBottomIndicator.outerHeight(), 1125, 1, "Bottom indicator has correct height");
        assert.roughEqual($secondTopIndicator.outerHeight(), 475, 1, "Top indicator has correct height");
        assert.roughEqual($secondBottomIndicator.outerHeight(), 1125, 1, "Bottom indicator has correct height");

        assert.roughEqual($indicator.outerWidth(), 898, 1, "Indicator has correct width");
        assert.roughEqual($firstTopIndicator.outerWidth(), 298, 1, "Top indicator has correct width");
        assert.roughEqual($firstBottomIndicator.outerWidth(), 149, 1, "Bottom indicator has correct width");
        assert.roughEqual($firstAllDayIndicator.outerWidth(), 298, 1, "AllDay indicator has correct width");
        assert.roughEqual($secondTopIndicator.outerWidth(), 298, 1, "Top indicator has correct width");
        assert.roughEqual($secondBottomIndicator.outerWidth(), 149, 1, "Bottom indicator has correct width");
        assert.roughEqual($secondAllDayIndicator.outerWidth(), 298, 1, "AllDay indicator has correct width");
    });

    QUnit.test("DateTimeIndicator should not be renderd after currentDate changing, Day view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 19, 45),
            showAllDayPanel: true
        });

        var $element = this.instance.element();
        assert.equal($element.find(".dx-scheduler-date-time-indicator").length, 1, "Indicator is rendered");
        assert.equal($element.find(".dx-scheduler-date-time-indicator-all-day").length, 1, "AllDay indicator is rendered");

        this.instance.option("currentDate", new Date(2017, 8, 6));

        assert.equal($element.find(".dx-scheduler-date-time-indicator").length, 0, "Indicator wasn't rendered");
        assert.equal($element.find(".dx-scheduler-date-time-indicator-all-day").length, 0, "AllDay indicator wasn't rendered");
    });

    QUnit.test("TimePanel currentTime cell should have specific class, Day view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        var $element = this.instance.element(),
            $cell = $element.find(".dx-scheduler-time-panel-cell").eq(5);

        assert.ok($cell.hasClass("dx-scheduler-time-panel-current-time-cell"), "Cell has specific class");
    });

    QUnit.test("TimePanel currentTime cell should have specific class, Day view with intervalCount", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 12, 45),
            intervalCount: 3
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
        }
    });

    QUnit.test("DateTimeIndicator should be rendered if needed, Week view", function(assert) {
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

    QUnit.test("DateTimeIndicator on allDayPanel should be rendered if needed, Week view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 7, 12, 45),
            showAllDayPanel: false
        });
        var $element = this.instance.element();

        assert.equal($element.find(".dx-scheduler-date-time-indicator-all-day").length, 0, "Indicator wasn't rendered");

        this.instance.option("showAllDayPanel", true);

        assert.equal($element.find(".dx-scheduler-date-time-indicator").length, 1, "Indicator is rendered");
    });

    QUnit.test("DateTimeIndicator on allDayPanel should have correct height & width, Week view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 7, 12, 45),
            showAllDayPanel: true,
            allDayExpanded: false
        });
        var $element = this.instance.element();

        assert.roughEqual($element.find(".dx-scheduler-date-time-indicator-all-day").eq(0).outerHeight(), 24, 1, "Indicator has correct height");
        assert.roughEqual($element.find(".dx-scheduler-date-time-indicator-all-day").eq(0).outerWidth(), 640, 1, "Indicator has correct height");

        this.instance.option("allDayExpanded", true);

        assert.roughEqual($element.find(".dx-scheduler-date-time-indicator-all-day").eq(0).outerHeight(), 74, 1, "Indicator has correct height");
    });

    QUnit.test("DateTimeIndicator should have correct height & width, Week view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 12, 45)
        });

        var $element = this.instance.element(),
            $indicator = $element.find(".dx-scheduler-date-time-indicator"),
            $topIndicator = $element.find(".dx-scheduler-date-time-indicator-top"),
            $bottomIndicator = $element.find(".dx-scheduler-date-time-indicator-bottom");

        assert.roughEqual($indicator.outerHeight(), 475, 1, "Indicator has correct height");
        assert.roughEqual($topIndicator.outerHeight(), 475, 1, "Top indicator has correct height");
        assert.roughEqual($bottomIndicator.outerHeight(), 1125, 1, "Bottom indicator has correct height");

        assert.roughEqual($indicator.outerWidth(), 898, 1, "Indicator has correct width");
        assert.roughEqual($topIndicator.outerWidth(), 512, 1, "Top indicator has correct width");
        assert.roughEqual($bottomIndicator.outerWidth(), 384, 1, "Bottom indicator has correct width");
    });

    QUnit.test("DateTimeIndicator should have limited height, Week view", function(assert) {
        this.instance.option({
            endDayHour: 18,
            indicatorTime: new Date(2017, 8, 5, 19, 45)
        });

        var $element = this.instance.element(),
            $indicator = $element.find(".dx-scheduler-date-time-indicator");

        assert.roughEqual($indicator.outerHeight(), 1001, 1, "Indicator has correct height");
        assert.equal($indicator.children(".dx-scheduler-date-time-indicator-content").length, 0, "Indicator has no content");
    });

    QUnit.test("DateTimeIndicator should be rendered for 'overdue' views", function(assert) {
        this.instance.option({
            endDayHour: 18,
            currentDate: new Date(2017, 7, 5),
            indicatorTime: new Date(2017, 8, 5, 19, 45)
        });

        var $element = this.instance.element(),
            $indicator = $element.find(".dx-scheduler-date-time-indicator");

        assert.roughEqual($indicator.outerHeight(), 1001, 1, "Indicator has correct height");
        assert.equal($indicator.children(".dx-scheduler-date-time-indicator-content").length, 0, "Indicator has no content");
    });

    QUnit.test("DateTimeIndicator should not be renderd after currentDate changing, Week view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 19, 45),
            showAllDayPanel: true
        });

        var $element = this.instance.element();
        assert.equal($element.find(".dx-scheduler-date-time-indicator").length, 1, "Indicator is rendered");
        assert.equal($element.find(".dx-scheduler-date-time-indicator").length, 1, "AllDay indicator is rendered");

        this.instance.option("currentDate", new Date(2017, 8, 15));

        assert.equal($element.find(".dx-scheduler-date-time-indicator").length, 0, "Indicator wasn't rendered");
        assert.equal($element.find(".dx-scheduler-date-time-indicator").length, 0, "AllDay indicator wasn't rendered");
    });

    QUnit.test("TimePanel currentTime cell should have specific class, Week view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 12, 45)
        });

        var $element = this.instance.element(),
            $cell = $element.find(".dx-scheduler-time-panel-cell").eq(5);

        assert.ok($cell.hasClass("dx-scheduler-time-panel-current-time-cell"), "Cell has specific class");
    });

    QUnit.test("DateHeader currentTime cell should have specific class, Week view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 7, 12, 45)
        });

        var $element = this.instance.element(),
            $cell = $element.find(".dx-scheduler-header-panel-cell").eq(4);

        assert.ok($cell.hasClass("dx-scheduler-header-panel-current-time-cell"), "Cell has specific class");
    });
})("DateTime indicator on Week View");

(function() {
    QUnit.module("DateTime indicator on TimelineDay View", {
        beforeEach: function() {
            this.instance = $("#scheduler-work-space").dxSchedulerTimelineDay({
                showCurrentTimeIndicator: true,
                currentDate: new Date(2017, 8, 5),
                startDayHour: 8,
                height: 307
            }).dxSchedulerTimelineDay("instance");
        }
    });

    QUnit.test("DateTimeIndicator should be rendered if needed, TimelineDay view", function(assert) {
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

    QUnit.test("DateTimeIndicator should have correct height & width, TimelineDay view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        var $element = this.instance.element(),
            $indicator = $element.find(".dx-scheduler-date-time-indicator"),
            cellWidth = $element.find(".dx-scheduler-date-table-cell").eq(0).outerWidth();

        assert.roughEqual($indicator.outerHeight(), 200, 1, "Indicator has correct height");

        assert.roughEqual($indicator.outerWidth(), 9.5 * cellWidth, 1, "Indicator has correct width");
    });

    QUnit.test("DateTimeIndicator should have limited width, TimelineDay view", function(assert) {
        this.instance.option({
            endDayHour: 18,
            indicatorTime: new Date(2017, 8, 5, 19, 45)
        });

        var $element = this.instance.element(),
            $indicator = $element.find(".dx-scheduler-date-time-indicator");

        assert.roughEqual($indicator.outerWidth(), 4000, 1, "Indicator has correct width");
        assert.equal($indicator.children(".dx-scheduler-date-time-indicator-content").length, 0, "Indicator has no content");
    });

    QUnit.test("DateTimeIndicator should be rendered for 'overdue' views, TimelineDay view", function(assert) {
        this.instance.option({
            currentDate: new Date(2017, 8, 3),
            indicatorTime: new Date(2017, 8, 5, 19, 45)
        });

        var $element = this.instance.element(),
            $indicator = $element.find(".dx-scheduler-date-time-indicator");

        assert.roughEqual($indicator.outerWidth(), 6400, 1, "Indicator has correct width");
        assert.equal($indicator.children(".dx-scheduler-date-time-indicator-content").length, 0, "Indicator has no content");
    });

    QUnit.test("DateHeader currentTime cell should have specific class", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        var $element = this.instance.element(),
            $cell = $element.find(".dx-scheduler-header-panel-cell").eq(9);

        assert.ok($cell.hasClass("dx-scheduler-header-panel-current-time-cell"), "Cell has specific class");
    });
})("DateTime indicator on TimelineDay View");

(function() {
    QUnit.module("DateTime indicator on other timelines");

    QUnit.test("DateTimeIndicator should have correct height & width, TimelineWeek view", function(assert) {
        var instance = $("#scheduler-work-space").dxSchedulerTimelineWeek({
            showCurrentTimeIndicator: true,
            currentDate: new Date(2017, 8, 5),
            startDayHour: 8,
            height: 307,
            indicatorTime: new Date(2017, 8, 5, 12, 30),
            hoursInterval: 1
        }).dxSchedulerTimelineWeek("instance");

        var $element = instance.element(),
            $indicator = $element.find(".dx-scheduler-date-time-indicator"),
            cellWidth = $element.find(".dx-scheduler-date-table-cell").eq(0).outerWidth();

        assert.roughEqual($indicator.outerHeight(), 160, 1, "Indicator has correct height");

        assert.roughEqual($indicator.outerWidth(), 36.5 * cellWidth, 1, "Indicator has correct width");
    });

    QUnit.test("DateHeader currentTime cell should have specific class, TimelineWeek view", function(assert) {
        var instance = $("#scheduler-work-space").dxSchedulerTimelineWeek({
            showCurrentTimeIndicator: true,
            currentDate: new Date(2017, 8, 5),
            startDayHour: 8,
            height: 307,
            indicatorTime: new Date(2017, 8, 5, 12, 30),
            hoursInterval: 1
        }).dxSchedulerTimelineWeek("instance");

        var $element = instance.element(),
            $cell = $element.find(".dx-scheduler-header-panel-cell").eq(43);

        assert.ok($cell.hasClass("dx-scheduler-header-panel-current-time-cell"), "Cell has specific class");
    });

    QUnit.test("DateTimeIndicator should have correct height & width, TimelineMonth view", function(assert) {
        var instance = $("#scheduler-work-space").dxSchedulerTimelineMonth({
            showCurrentTimeIndicator: true,
            currentDate: new Date(2017, 8, 5),
            startDayHour: 8,
            height: 307,
            indicatorTime: new Date(2017, 8, 16, 12, 0),
            hoursInterval: 1
        }).dxSchedulerTimelineMonth("instance");

        var $element = instance.element(),
            $indicator = $element.find(".dx-scheduler-date-time-indicator"),
            cellWidth = $element.find(".dx-scheduler-date-table-cell").eq(0).outerWidth();

        assert.roughEqual($indicator.outerHeight(), 200, 1, "Indicator has correct height");

        assert.roughEqual($indicator.outerWidth(), 15.5 * cellWidth, 1, "Indicator has correct width");
    });

    QUnit.test("DateHeader currentTime cell should have specific class, TimelineMonth view", function(assert) {
        var instance = $("#scheduler-work-space").dxSchedulerTimelineMonth({
            showCurrentTimeIndicator: true,
            currentDate: new Date(2017, 8, 5),
            startDayHour: 8,
            height: 307,
            indicatorTime: new Date(2017, 8, 15, 12, 30)
        }).dxSchedulerTimelineMonth("instance");

        var $element = instance.element(),
            $cell = $element.find(".dx-scheduler-header-panel-cell").eq(14);

        assert.ok($cell.hasClass("dx-scheduler-header-panel-current-time-cell"), "Cell has specific class");
    });
})("DateTime indicator on other timelines");

