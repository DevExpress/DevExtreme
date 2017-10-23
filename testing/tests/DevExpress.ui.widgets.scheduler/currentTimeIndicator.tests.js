"use strict";

var $ = require("jquery"),
    SchedulerResourcesManager = require("ui/scheduler/ui.scheduler.resource_manager"),
    resizeCallbacks = require("core/utils/window").resizeCallbacks;

var SCHEDULER_DATE_TIME_SHADER_CLASS = "dx-scheduler-date-time-shader",
    SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS = "dx-scheduler-date-time-shader-all-day",
    SCHEDULER_DATE_TIME_SHADER_TOP_CLASS = "dx-scheduler-date-time-shader-top",
    SCHEDULER_DATE_TIME_SHADER_BOTTOM_CLASS = "dx-scheduler-date-time-shader-bottom",
    SCHEDULER_DATE_TIME_INDICATOR_CLASS = "dx-scheduler-date-time-indicator";

require("common.css!");
require("generic_light.css!");

require("ui/scheduler/ui.scheduler.work_space_day");
require("ui/scheduler/ui.scheduler.work_space_week");
require("ui/scheduler/ui.scheduler.timeline_day"),
require("ui/scheduler/ui.scheduler.timeline_week"),
require("ui/scheduler/ui.scheduler.timeline_work_week"),
require("ui/scheduler/ui.scheduler.timeline_month"),
QUnit.testStart(function() {
    $("#qunit-fixture").html('</div><div id="scheduler-work-space-rtl"></div><div id="scheduler-work-space">');
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
            this.clock = sinon.useFakeTimers();

            this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceDay({
                showCurrentTimeIndicator: true,
                currentDate: new Date(2017, 8, 5),
                startDayHour: 8,
            }).dxSchedulerWorkSpaceDay("instance");
            stubInvokeMethod(this.instance);
        },
        afterEach: function() {
            this.clock.restore();
        }
    });

    QUnit.test("DateTimeIndicator should be rendered if needed, Day view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        var $element = this.instance.$element();

        assert.equal($element.find("." + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 1, "Indicator is rendered correctly");

        this.instance.option("showCurrentTimeIndicator", false);
        $element = this.instance.$element();

        assert.equal($element.find("." + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 0, "Indicator wasn't rendered");
    });

    QUnit.test("DateTimeIndicator should be wrapped by scrollable, Day view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });
        var $element = this.instance.$element();

        assert.ok($element.find("." + SCHEDULER_DATE_TIME_SHADER_CLASS).parent().hasClass("dx-scrollable-content"), "Scrollable contains time indicator");
    });

    QUnit.test("Indication should be updated by some timer", function(assert) {
        var renderIndicatorStub = sinon.stub(this.instance, "_renderDateTimeIndication");

        this.instance.option({
            indicatorUpdateInterval: 20
        });

        var timer = setTimeout(function() {
            assert.ok(renderIndicatorStub.calledTwice, "Indicator was updated");
        }, 40);

        this.clock.tick(40);
        clearTimeout(timer);
    });

    QUnit.test("Indication should not be updated by some timer if indicatorUpdateInterval = 0", function(assert) {
        var renderIndicatorStub = sinon.stub(this.instance, "_renderDateTimeIndication");

        this.instance.option({
            indicatorUpdateInterval: 0
        });

        var timer = setTimeout(function() {
            assert.equal(renderIndicatorStub.callCount, 0, "Indicator wasn't updated");
        }, 40);

        this.clock.tick(40);
        clearTimeout(timer);
    });

    QUnit.test("Indication should be updated on dimensionChanged", function(assert) {
        var renderIndicatorStub = sinon.stub(this.instance, "_renderDateTimeIndication");

        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        resizeCallbacks.fire();

        assert.ok(renderIndicatorStub.calledTwice, "Indicator was updated");
    });

    QUnit.test("DateTimeIndicator should not be renderd after currentDate changing, Day view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 19, 45),
            showAllDayPanel: true
        });

        var $element = this.instance.$element();
        assert.equal($element.find("." + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 1, "Indicator is rendered");

        this.instance.option("currentDate", new Date(2017, 8, 6));

        assert.equal($element.find("." + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 0, "Indicator wasn't rendered");
    });

    QUnit.test("DateTimeIndicator should not be renderd if indicatorTime < startDayHour, Day view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 10, 45),
            startDayHour: 11,
            intervalCount: 3
        });

        var $element = this.instance.$element();
        assert.equal($element.find("." + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 0, "Indicator wasn't rendered");

        this.instance.option("startDayHour", 8);
        assert.equal($element.find("." + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 1, "Indicator is rendered");
    });

    QUnit.test("DateTimeIndicator should have correct positions, Day view with groups", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        this.instance.option("groups", [{ name: "a", items: [{ id: 1, text: "a.1" }, { id: 2, text: "a.2" }] }]);

        var $element = this.instance.$element(),
            $indicators = $element.find("." + SCHEDULER_DATE_TIME_INDICATOR_CLASS),
            cellHeight = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerHeight();
        assert.equal($indicators.length, 2, "Indicator count is correct");
        assert.equal($indicators.eq(0).position().left, 0);
        assert.equal($indicators.eq(0).position().top, 9.5 * cellHeight);
        assert.equal($indicators.eq(1).position().left, this.instance._getRoundedCellWidth(1) + 1);
        assert.equal($indicators.eq(1).position().top, 9.5 * cellHeight);
    });

    QUnit.test("DateTimeIndicator should have correct positions, Day view with groups without shader", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            shadeUntilCurrentTime: false
        });

        this.instance.option("groups", [{ name: "a", items: [{ id: 1, text: "a.1" }, { id: 2, text: "a.2" }] }]);

        var $element = this.instance.$element(),
            $indicators = $element.find("." + SCHEDULER_DATE_TIME_INDICATOR_CLASS),
            cellHeight = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerHeight();

        assert.equal($indicators.length, 2, "Indicator count is correct");
        assert.equal($indicators.eq(0).position().left, 0);
        assert.equal($indicators.eq(0).position().top, 9.5 * cellHeight);
        assert.equal($indicators.eq(1).position().left, this.instance._getRoundedCellWidth(1) + 1);
        assert.equal($indicators.eq(1).position().top, 9.5 * cellHeight);
    });

    QUnit.test("Shader should be rendered if needed, Day view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            shadeUntilCurrentTime: false
        });

        var $element = this.instance.$element();

        assert.equal($element.find("." + SCHEDULER_DATE_TIME_SHADER_CLASS).length, 0, "Shader wasn't rendered");

        this.instance.option("shadeUntilCurrentTime", true);
        $element = this.instance.$element();

        assert.equal($element.find("." + SCHEDULER_DATE_TIME_SHADER_CLASS).length, 1, "Shader was rendered");
    });

    QUnit.test("Shader on allDayPanel should be rendered if needed, Day view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            showAllDayPanel: false
        });
        var $element = this.instance.$element();

        assert.equal($element.find("." + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).length, 0, "Shader wasn't rendered");

        this.instance.option("showAllDayPanel", true);

        assert.equal($element.find("." + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).length, 1, "Shader is rendered");
    });

    QUnit.test("AllDay Shader should be wrapped by allDay panel, Day view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            showAllDayPanel: true
        });
        var $element = this.instance.$element();

        assert.ok($element.find("." + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).parent().hasClass("dx-scheduler-all-day-panel"), "AllDay panel contains time indicator");
    });

    QUnit.test("Shader on allDayPanel should have correct height, Day view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            showAllDayPanel: true,
            allDayExpanded: false
        });
        var $element = this.instance.$element();

        assert.roughEqual($element.find("." + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).eq(0).outerHeight(), 24, 1, "Indicator has correct height");

        this.instance.option("allDayExpanded", true);

        assert.roughEqual($element.find("." + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).eq(0).outerHeight(), 74, 1, "Indicator has correct height");
    });

    QUnit.test("Shader should have correct height, Day view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        var $element = this.instance.$element(),
            $indicator = $element.find("." + SCHEDULER_DATE_TIME_SHADER_CLASS),
            cellHeight = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerHeight();

        assert.roughEqual($indicator.outerHeight(), 9.5 * cellHeight, 1, "Indicator has correct height");
    });

    QUnit.test("Shader should have limited height, Day view", function(assert) {
        this.instance.option({
            endDayHour: 18,
            indicatorTime: new Date(2017, 8, 5, 19, 45)
        });

        var $element = this.instance.$element(),
            $shader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_CLASS),
            cellHeight = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerHeight();

        assert.roughEqual($shader.outerHeight(), 20 * cellHeight, 1.5, "Indicator has correct height");

        this.instance.option("endDayHour", 24);

        $shader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_CLASS);
        assert.roughEqual($shader.outerHeight(), 23.5 * cellHeight, 1.5, "Indicator has correct height");
    });

    QUnit.test("Shader should have correct height & width, Day view with intervalCount", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 12, 45),
            intervalCount: 3
        });

        var $element = this.instance.$element(),
            $shader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_CLASS),
            $topShader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_TOP_CLASS),
            $bottomShader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_BOTTOM_CLASS),
            $cell = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0),
            cellHeight = $cell.outerHeight(),
            cellWidth = $cell.outerWidth();

        assert.roughEqual($shader.outerHeight(), 9.5 * cellHeight, 1, "Shader has correct height");
        assert.roughEqual($topShader.outerHeight(), 9.5 * cellHeight, 1, "Top shader has correct height");
        assert.roughEqual($bottomShader.outerHeight(), 22.5 * cellHeight, 1, "Bottom shader has correct height");

        assert.roughEqual($shader.outerWidth(), 3 * cellWidth, 2, "Shader has correct width");
        assert.roughEqual($topShader.outerWidth(), 2 * cellWidth, 1, "Top shader has correct width");
        assert.roughEqual($bottomShader.outerWidth(), cellWidth, 1, "Bottom shader has correct width");
    });

    QUnit.test("Shader should have correct height & width, Day view with intervalCount, different months", function(assert) {
        this.instance.option({
            currentDate: new Date(2017, 8, 30),
            indicatorTime: new Date(2017, 9, 1, 12, 45),
            intervalCount: 3
        });

        var $element = this.instance.$element(),
            $shader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_CLASS),
            $topShader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_TOP_CLASS),
            $bottomShader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_BOTTOM_CLASS),
            $cell = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0),
            cellHeight = $cell.outerHeight(),
            cellWidth = $cell.outerWidth();

        assert.roughEqual($shader.outerHeight(), 9.5 * cellHeight, 1, "Indicator has correct height");
        assert.roughEqual($topShader.outerHeight(), 9.5 * cellHeight, 1, "Top shader has correct height");
        assert.roughEqual($bottomShader.outerHeight(), 22.5 * cellHeight, 1, "Bottom shader has correct height");

        assert.roughEqual($shader.outerWidth(), 3 * cellWidth, 2, "Indicator has correct width");
        assert.roughEqual($topShader.outerWidth(), 2 * cellWidth, 1, "Top shader has correct width");
        assert.roughEqual($bottomShader.outerWidth(), cellWidth, 1, "Bottom shader has correct width");
    });

    QUnit.test("Shader should have correct height & width, Day view with intervalCount, indicatorTime = startDayHour", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 12, 0),
            startDayHour: 12,
            intervalCount: 3
        });

        var $element = this.instance.$element(),
            $topShader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_TOP_CLASS),
            $bottomShader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_BOTTOM_CLASS),
            $cell = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0),
            cellHeight = $cell.outerHeight(),
            cellWidth = $cell.outerWidth();

        assert.roughEqual($topShader.outerHeight(), 0, 1, "Top shader has correct height");
        assert.roughEqual($bottomShader.outerHeight(), 24 * cellHeight, 1, "Bottom shader has correct height");
        assert.roughEqual($bottomShader.outerWidth(), cellWidth, 1, "Bottom shader has correct width");
    });

    QUnit.test("Shader should be rendered correctly, Day view with groups", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 12, 45),
            intervalCount: 3
        });

        this.instance.option("groups", [{ name: "a", items: [{ id: 1, text: "a.1" }, { id: 2, text: "a.2" }] }]);

        var $element = this.instance.$element(),
            $shader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_CLASS),
            $firstTopShader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_TOP_CLASS).eq(0),
            $firstBottomShader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_BOTTOM_CLASS).eq(0),
            $firstAllDayShader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).eq(0),
            $secondTopShader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_TOP_CLASS).eq(1),
            $secondBottomShader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_BOTTOM_CLASS).eq(1),
            $secondAllDayShader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).eq(0),
            $cell = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0),
            cellHeight = $cell.outerHeight(),
            cellWidth = $cell.outerWidth();

        assert.roughEqual($shader.outerHeight(), 9.5 * cellHeight, 1, "Indicator has correct height");
        assert.roughEqual($firstTopShader.outerHeight(), 9.5 * cellHeight, 1, "Top indicator has correct height");
        assert.roughEqual($firstBottomShader.outerHeight(), 22.5 * cellHeight, 1.5, "Bottom indicator has correct height");
        assert.roughEqual($secondTopShader.outerHeight(), 9.5 * cellHeight, 1, "Top indicator has correct height");
        assert.roughEqual($secondBottomShader.outerHeight(), 22.5 * cellHeight, 1.5, "Bottom indicator has correct height");

        assert.roughEqual($shader.outerWidth(), 6 * cellWidth, 5, "Indicator has correct width");
        assert.roughEqual($firstTopShader.outerWidth(), 2 * cellWidth, 1, "Top indicator has correct width");
        assert.roughEqual($firstBottomShader.outerWidth(), cellWidth, 1, "Bottom indicator has correct width");
        assert.roughEqual($firstAllDayShader.outerWidth(), 2 * cellWidth, 2.5, "AllDay indicator has correct width");
        assert.roughEqual($secondTopShader.outerWidth(), 2 * cellWidth, 2.5, "Top indicator has correct width");
        assert.roughEqual($secondBottomShader.outerWidth(), cellWidth, 2.5, "Bottom indicator has correct width");
        assert.roughEqual($secondAllDayShader.outerWidth(), 2 * cellWidth, 2.5, "AllDay indicator has correct width");
    });

    QUnit.test("Shader should be rendered correctly, Day view with crossScrollingEnabled", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            crossScrollingEnabled: true
        });

        var $element = this.instance.$element(),
            $indicator = $element.find("." + SCHEDULER_DATE_TIME_SHADER_CLASS),
            containerHeight = $indicator.parent().outerHeight();

        assert.roughEqual($indicator.outerHeight(), containerHeight, 1, "Indicator has correct height");
        assert.equal($indicator.css("marginTop"), -containerHeight + "px", "Indicator has correct margin");
    });

    QUnit.test("TimePanel currentTime cell should have specific class, Day view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        var $element = this.instance.$element(),
            $cell = $element.find(".dx-scheduler-time-panel-cell").eq(9);

        assert.ok($cell.hasClass("dx-scheduler-time-panel-current-time-cell"), "Cell has specific class");
    });

    QUnit.test("TimePanel currentTime cell should have specific class, Day view with intervalCount", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 12, 45),
            intervalCount: 3
        });

        var $element = this.instance.$element(),
            $cell = $element.find(".dx-scheduler-time-panel-cell").eq(9);

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
        var $element = this.instance.$element();

        assert.equal($element.find("." + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 1, "Indicator is rendered correctly");

        this.instance.option("showCurrentTimeIndicator", false);
        $element = this.instance.$element();

        assert.equal($element.find("." + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 0, "Indicator wasn't rendered");
    });

    QUnit.test("DateTimeIndicator should not be renderd after currentDate changing, Week view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 19, 45),
            showAllDayPanel: true
        });

        var $element = this.instance.$element();
        assert.equal($element.find("." + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 1, "Indicator is rendered");

        this.instance.option("currentDate", new Date(2017, 8, 15));

        assert.equal($element.find("." + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 0, "Indicator wasn't rendered");
    });

    QUnit.test("Shader on allDayPanel should have correct height & width, Week view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 7, 12, 45),
            showAllDayPanel: true,
            allDayExpanded: false
        });
        var $element = this.instance.$element();

        assert.roughEqual($element.find("." + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).eq(0).outerHeight(), 24, 1.5, "Indicator has correct height");
        assert.roughEqual($element.find("." + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).eq(0).outerWidth(), 640, 1.5, "Indicator has correct height");

        this.instance.option("allDayExpanded", true);

        assert.roughEqual($element.find("." + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).eq(0).outerHeight(), 74, 1.5, "Indicator has correct height");
    });

    QUnit.test("Shader should have correct height & width, Week view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 12, 45)
        });

        var $element = this.instance.$element(),
            $shader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_CLASS),
            $topShader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_TOP_CLASS),
            $bottomShader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_BOTTOM_CLASS),
            $cell = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0),
            cellHeight = $cell.outerHeight(),
            cellWidth = $cell.outerWidth();

        assert.roughEqual($shader.outerHeight(), 9.5 * cellHeight, 1, "Indicator has correct height");
        assert.roughEqual($topShader.outerHeight(), 9.5 * cellHeight, 1, "Top indicator has correct height");
        assert.roughEqual($bottomShader.outerHeight(), 22.5 * cellHeight, 1.5, "Bottom indicator has correct height");

        assert.roughEqual($shader.outerWidth(), 898, 1, "Indicator has correct width");
        assert.roughEqual($topShader.outerWidth(), 4 * cellWidth, 1, "Top indicator has correct width");
        assert.roughEqual($bottomShader.outerWidth(), 3 * cellWidth, 1, "Bottom indicator has correct width");
    });

    QUnit.test("Shader should have limited height, Week view", function(assert) {
        this.instance.option({
            endDayHour: 18,
            indicatorTime: new Date(2017, 8, 5, 19, 45)
        });

        var $element = this.instance.$element(),
            $shader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_CLASS);

        assert.roughEqual($shader.outerHeight(), 1000, 1.5, "Shader has correct height");
    });

    QUnit.test("Shader should be rendered for 'overdue' views", function(assert) {
        this.instance.option({
            endDayHour: 18,
            currentDate: new Date(2017, 7, 5),
            indicatorTime: new Date(2017, 8, 5, 19, 45)
        });

        var $element = this.instance.$element(),
            $shader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_CLASS),
            $topShader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_TOP_CLASS),
            $bottomShader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_BOTTOM_CLASS);

        assert.roughEqual($shader.outerHeight(), 1000, 1.5, "Shader has correct height");

        assert.roughEqual($topShader.outerWidth(), 896, 2, "TopShader has correct width");
        assert.roughEqual($topShader.outerHeight(), 1000, 1.5, "TopShader has correct height");

        assert.roughEqual($bottomShader.outerHeight(), 0, 1.5, "BottomShader has correct height");
    });

    QUnit.test("TimePanel currentTime cell should have specific class, Week view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 12, 30)
        });

        var $element = this.instance.$element(),
            $firstCell = $element.find(".dx-scheduler-time-panel-cell").eq(8),
            $secondCell = $element.find(".dx-scheduler-time-panel-cell").eq(9),
            $thirdCell = $element.find(".dx-scheduler-time-panel-cell").eq(10);

        assert.ok($firstCell.hasClass("dx-scheduler-time-panel-current-time-cell"), "Cell has specific class");
        assert.ok($secondCell.hasClass("dx-scheduler-time-panel-current-time-cell"), "Cell has specific class");
        assert.notOk($thirdCell.hasClass("dx-scheduler-time-panel-current-time-cell"), "Cell hasn't specific class");
    });

    QUnit.test("DateHeader currentTime cell should have specific class, Week view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 7, 12, 45)
        });

        var $element = this.instance.$element(),
            $cell = $element.find(".dx-scheduler-header-panel-cell").eq(4);

        assert.ok($cell.hasClass("dx-scheduler-header-panel-current-time-cell"), "Cell has specific class");
    });

    QUnit.test("DateTimeIndicator and shader should have correct positions, Day view with intervalCount, rtl mode", function(assert) {
        var workspace = $("#scheduler-work-space-rtl").dxSchedulerWorkSpaceWeek({
            showCurrentTimeIndicator: true,
            currentDate: new Date(2017, 8, 5),
            startDayHour: 8,
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            rtlEnabled: true,
            intervalCount: 2
        }).dxSchedulerWorkSpaceWeek("instance");

        var $element = workspace.$element(),
            $indicator = $element.find("." + SCHEDULER_DATE_TIME_INDICATOR_CLASS),
            $topShader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_TOP_CLASS),
            $bottomShader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_BOTTOM_CLASS);

        assert.equal($indicator.length, 1, "Indicator count is correct");
        assert.roughEqual($indicator.eq(0).position().left, 706, 1.5, "Indicator left is OK");
        assert.roughEqual(parseInt($topShader.css("left")), 706, 1.5, "Top indicator has correct left");
        assert.roughEqual(parseInt($bottomShader.css("left")), 770, 1.5, "Bottom indicator has correct left");
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
        var $element = this.instance.$element();

        assert.equal($element.find("." + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 1, "Indicator is rendered correctly");

        this.instance.option("showCurrentTimeIndicator", false);
        $element = this.instance.$element();

        assert.equal($element.find("." + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 0, "Indicator wasn't rendered");
    });

    QUnit.test("Shader should have correct height & width, TimelineDay view", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        var $element = this.instance.$element(),
            $shader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_CLASS),
            cellWidth = $element.find(".dx-scheduler-date-table-cell").eq(0).outerWidth();

        assert.roughEqual($shader.outerHeight(), 200, 1, "Shader has correct height");

        assert.roughEqual($shader.outerWidth(), 9.5 * cellWidth, 1, "Shader has correct width");
    });

    QUnit.test("Shader should have limited width, TimelineDay view", function(assert) {
        this.instance.option({
            endDayHour: 18,
            indicatorTime: new Date(2017, 8, 5, 19, 45)
        });

        var $element = this.instance.$element(),
            $shader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_CLASS);

        assert.roughEqual($shader.outerWidth(), 4000, 1, "Shader has correct width");
    });

    QUnit.test("Shader should be rendered for 'overdue' views, TimelineDay view", function(assert) {
        this.instance.option({
            currentDate: new Date(2017, 8, 3),
            indicatorTime: new Date(2017, 8, 5, 19, 45)
        });

        var $element = this.instance.$element(),
            $shader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_CLASS);

        assert.roughEqual($shader.outerWidth(), 6400, 1, "Shader has correct width");
    });

    QUnit.test("DateHeader currentTime cell should have specific class", function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        var $element = this.instance.$element(),
            $cell = $element.find(".dx-scheduler-header-panel-cell").eq(9);

        assert.ok($cell.hasClass("dx-scheduler-header-panel-current-time-cell"), "Cell has specific class");
    });
})("DateTime indicator on TimelineDay View");

(function() {
    QUnit.module("DateTime indicator on other timelines");

    QUnit.test("Shader should have correct height & width, TimelineWeek view", function(assert) {
        var instance = $("#scheduler-work-space").dxSchedulerTimelineWeek({
            showCurrentTimeIndicator: true,
            currentDate: new Date(2017, 8, 5),
            startDayHour: 8,
            height: 307,
            indicatorTime: new Date(2017, 8, 5, 12, 30),
            hoursInterval: 1
        }).dxSchedulerTimelineWeek("instance");

        var $element = instance.$element(),
            $shader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_CLASS),
            cellWidth = $element.find(".dx-scheduler-date-table-cell").eq(0).outerWidth();

        assert.roughEqual($shader.outerHeight(), 160, 1, "Shader has correct height");

        assert.roughEqual($shader.outerWidth(), 36.5 * cellWidth, 1, "Shader has correct width");
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

        var $element = instance.$element(),
            $cell = $element.find(".dx-scheduler-header-panel-cell").eq(43);

        assert.ok($cell.hasClass("dx-scheduler-header-panel-current-time-cell"), "Cell has specific class");
    });

    QUnit.test("Shader should have correct height & width, TimelineMonth view", function(assert) {
        var instance = $("#scheduler-work-space").dxSchedulerTimelineMonth({
            showCurrentTimeIndicator: true,
            currentDate: new Date(2017, 8, 5),
            startDayHour: 8,
            height: 307,
            indicatorTime: new Date(2017, 8, 16, 12, 0),
            hoursInterval: 1
        }).dxSchedulerTimelineMonth("instance");

        var $element = instance.$element(),
            $shader = $element.find("." + SCHEDULER_DATE_TIME_SHADER_CLASS),
            cellWidth = $element.find(".dx-scheduler-date-table-cell").eq(0).outerWidth();

        assert.roughEqual($shader.outerHeight(), 200, 1, "Shader has correct height");

        assert.roughEqual($shader.outerWidth(), 15.5 * cellWidth, 1, "Shader has correct width");
    });

    QUnit.test("DateHeader currentTime cell should have specific class, TimelineMonth view", function(assert) {
        var instance = $("#scheduler-work-space").dxSchedulerTimelineMonth({
            showCurrentTimeIndicator: true,
            currentDate: new Date(2017, 8, 5),
            startDayHour: 8,
            height: 307,
            indicatorTime: new Date(2017, 8, 15, 12, 30)
        }).dxSchedulerTimelineMonth("instance");

        var $element = instance.$element(),
            $cell = $element.find(".dx-scheduler-header-panel-cell").eq(14);

        assert.ok($cell.hasClass("dx-scheduler-header-panel-current-time-cell"), "Cell has specific class");
    });
})("DateTime indicator on other timelines");

