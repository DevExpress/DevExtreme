"use strict";

var $ = require("jquery");

require("common.css!");
require("generic_light.css!");

require("ui/scheduler/ui.scheduler.work_space_day");
require("ui/scheduler/ui.scheduler.work_space_week");

QUnit.testStart(function() {
    $("#qunit-fixture").html('<div id="scheduler-work-space"></div>');
});

(function() {
    QUnit.module("DateTime indicator on Day View", {
        beforeEach: function() {
            this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceDay({
                showCurrentTimeIndicator: true,
                currentDate: new Date(2017, 8, 5),
                startDayHour: 8,
            }).dxSchedulerWorkSpaceDay("instance");
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

    QUnit.test("DateTimeIndicator should have correct height & width, day view with intervalCount", function(assert) {
        this.instance.option({
            _currentDateTime: new Date(2017, 8, 6, 12, 45),
            intervalCount: 3
        });

        var $element = this.instance.element(),
            $indicator = $element.find(".dx-scheduler-date-time-indicator"),
            $topIndicator = $element.find(".dx-scheduler-date-time-indicator-top"),
            $bottomIndicator = $element.find(".dx-scheduler-date-time-indicator-bottom");

        assert.roughEqual($indicator.outerHeight(), 475, 1, "Indicator has correct height");
        assert.roughEqual($topIndicator.outerHeight(), 475, 1, "Top indicator has correct height");
        assert.roughEqual($bottomIndicator.outerHeight(), 1125, 1, "Bottom indicator has correct height");

        assert.roughEqual($indicator.outerWidth(), 998, 1, "Indicator has correct width");
        assert.roughEqual($topIndicator.outerWidth(), 598, 1, "Top indicator has correct width");
        assert.roughEqual($bottomIndicator.outerWidth(), 299, 1, "Bottom indicator has correct width");
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

    QUnit.test("TimePanel currentTime cell should have specific class, day view with intervalCount ", function(assert) {
        this.instance.option({
            _currentDateTime: new Date(2017, 8, 6, 12, 45),
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
})("DateTime indicator on Week View");
