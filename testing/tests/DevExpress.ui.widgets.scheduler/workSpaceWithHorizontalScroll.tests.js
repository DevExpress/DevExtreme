"use strict";

var $ = require("jquery"),
    domUtils = require("core/utils/dom"),
    devices = require("core/devices");

require("common.css!");
require("generic_light.css!");
require("ui/scheduler/ui.scheduler");

QUnit.testStart(function() {
    $("#qunit-fixture").html('<div id="scheduler-work-space"></div>');
});

QUnit.module("Vertical Workspace with horizontal scrollbar", {
    beforeEach: function() {
        this.instance = $("#scheduler-work-space").dxSchedulerWorkSpaceWeek({
            crossScrollingEnabled: true,
            width: 100
        }).dxSchedulerWorkSpaceWeek("instance");
    }
});

QUnit.test("Three scrollable elements should be rendered", function(assert) {
    assert.ok(this.instance.element().hasClass("dx-scheduler-work-space-both-scrollbar"), "CSS class is OK");
    this.instance.option("crossScrollingEnabled", false);
    assert.notOk(this.instance.element().hasClass("dx-scheduler-work-space-both-scrollbar"), "CSS class is OK");
});

QUnit.test("Three scrollable elements should be rendered", function(assert) {
    var $dateTableScrollable = this.instance.element().find(".dx-scheduler-date-table-scrollable"),
        $timePanelScrollable = this.instance.element().find(".dx-scheduler-sidebar-scrollable"),
        $headerScrollable = this.instance.element().find(".dx-scheduler-header-scrollable");

    assert.equal($dateTableScrollable.length, 1, "Date table scrollable was rendered");
    assert.ok($dateTableScrollable.data("dxScrollable"), "Date table scrollable is instance of dxScrollable");

    assert.equal($timePanelScrollable.length, 1, "Time panel scrollable was rendered");
    assert.ok($timePanelScrollable.data("dxScrollable"), "Time panel scrollable is instance of dxScrollable");

    assert.equal($headerScrollable.length, 1, "Header scrollable was rendered");
    assert.ok($headerScrollable.data("dxScrollable"), "Header scrollable is instance of dxScrollable");
});

QUnit.test("Header scrollable should contain header panel, all-day container and all-day panel", function(assert) {
    domUtils.triggerResizeEvent(this.instance.element());
    var headerScrollable = this.instance.element().find(".dx-scheduler-header-scrollable").dxScrollable("instance"),
        scrollableContent = headerScrollable.content();

    assert.equal(scrollableContent.find(".dx-scheduler-header-panel").length, 1, "Header panel exists");
    assert.equal(scrollableContent.find(".dx-scheduler-all-day-appointments").length, 1, "All-day container exists");
    assert.equal(scrollableContent.find(".dx-scheduler-all-day-panel").length, 1, "All-day panel exists");
});

QUnit.test("Date table scrollable should contain date table", function(assert) {
    domUtils.triggerResizeEvent(this.instance.element());
    var dateTableScrollable = this.instance.element().find(".dx-scheduler-date-table-scrollable").dxScrollable("instance"),
        scrollableContent = dateTableScrollable.content();

    assert.equal(scrollableContent.find(".dx-scheduler-date-table").length, 1, "Date table exists");
});

QUnit.test("Time panel scrollable should contain time panel", function(assert) {
    var timePanelScrollable = this.instance.element().find(".dx-scheduler-sidebar-scrollable").dxScrollable("instance"),
        scrollableContent = timePanelScrollable.content();

    assert.equal(scrollableContent.find(".dx-scheduler-time-panel").length, 1, "Time panel exists");
});

QUnit.test("Header scrollable should have right config", function(assert) {
    var headerScrollable = this.instance.element().find(".dx-scheduler-header-scrollable").dxScrollable("instance");

    assert.equal(headerScrollable.option("direction"), "horizontal", "Direction is OK");
    assert.strictEqual(headerScrollable.option("showScrollbar"), false, "showScrollbar is OK");
    assert.strictEqual(headerScrollable.option("bounceEnabled"), false, "bounceEnabled is OK");
    assert.strictEqual(headerScrollable.option("updateManually"), true, "updateManually is OK");
});

QUnit.test("Date table scrollable should have right config", function(assert) {
    var dateTableScrollable = this.instance.element().find(".dx-scheduler-date-table-scrollable").dxScrollable("instance"),
        device = devices.current(),
        expectedShowScrollbarOption = "onHover";

    if(device.phone || device.tablet) {
        expectedShowScrollbarOption = "onScroll";
    }

    assert.equal(dateTableScrollable.option("direction"), "both", "Direction is OK");
    assert.equal(dateTableScrollable.option("showScrollbar"), expectedShowScrollbarOption, "showScrollbar is OK");
    assert.strictEqual(dateTableScrollable.option("bounceEnabled"), false, "bounceEnabled is OK");
    assert.strictEqual(dateTableScrollable.option("updateManually"), true, "updateManually is OK");
});

QUnit.test("Time panel scrollable should have right config", function(assert) {
    var timePanelScrollable = this.instance.element().find(".dx-scheduler-sidebar-scrollable").dxScrollable("instance");

    assert.equal(timePanelScrollable.option("direction"), "vertical", "Direction is OK");
    assert.strictEqual(timePanelScrollable.option("showScrollbar"), false, "showScrollbar is OK");
    assert.strictEqual(timePanelScrollable.option("bounceEnabled"), false, "bounceEnabled is OK");
    assert.strictEqual(timePanelScrollable.option("updateManually"), true, "updateManually is OK");
});

QUnit.test("Header scrollable should update position if date scrollable position is changed", function(assert) {
    var $element = this.instance.element(),
        headerScrollable = $element.find(".dx-scheduler-header-scrollable").dxScrollable("instance"),
        dateTableScrollable = $element.find(".dx-scheduler-date-table-scrollable").dxScrollable("instance");

    domUtils.triggerHidingEvent($element);
    domUtils.triggerShownEvent($element);

    dateTableScrollable.scrollTo({ left: 100 });

    assert.equal(headerScrollable.scrollLeft(), 100, "Scroll position is OK");
});

QUnit.test("Time panel scrollable should update position if date scrollable position is changed", function(assert) {
    var $element = this.instance.element(),
        timePanelScrollable = $element.find(".dx-scheduler-sidebar-scrollable").dxScrollable("instance"),
        dateTableScrollable = $element.find(".dx-scheduler-date-table-scrollable").dxScrollable("instance");

    domUtils.triggerHidingEvent($element);
    domUtils.triggerShownEvent($element);

    dateTableScrollable.scrollTo({ top: 100 });

    assert.equal(timePanelScrollable.scrollTop(), 100, "Scroll position is OK");
});

QUnit.test("Date table scrollable should update position if time panel position is changed", function(assert) {
    var $element = this.instance.element(),
        timePanelScrollable = $element.find(".dx-scheduler-sidebar-scrollable").dxScrollable("instance"),
        dateTableScrollable = $element.find(".dx-scheduler-date-table-scrollable").dxScrollable("instance");

    domUtils.triggerHidingEvent($element);
    domUtils.triggerShownEvent($element);

    timePanelScrollable.scrollTo({ top: 100 });

    assert.equal(dateTableScrollable.scrollTop(), 100, "Scroll position is OK");
});

QUnit.test("Date table scrollable should update position if header scrollable position is changed", function(assert) {
    var $element = this.instance.element(),
        headerScrollable = $element.find(".dx-scheduler-header-scrollable").dxScrollable("instance"),
        dateTableScrollable = $element.find(".dx-scheduler-date-table-scrollable").dxScrollable("instance");

    domUtils.triggerHidingEvent($element);
    domUtils.triggerShownEvent($element);

    headerScrollable.scrollTo({ left: 100 });

    assert.equal(dateTableScrollable.scrollLeft(), 100, "Scroll position is OK");
});

QUnit.test("the 'getCellIndexByCoordinates' method should return a right result", function(assert) {
    var $element = this.instance.element();

    domUtils.triggerHidingEvent($element);
    domUtils.triggerShownEvent($element);

    var index = this.instance.getCellIndexByCoordinates({ left: 85, top: 55 });

    assert.equal(index, 8, "Index is OK");
});

QUnit.test("Header panel, all-day panel, date table should have a correct width", function(assert) {
    var $element = this.instance.element();

    domUtils.triggerHidingEvent($element);
    domUtils.triggerShownEvent($element);

    var headerPanelWidth = $element.find(".dx-scheduler-header-panel").outerWidth(),
        allDayTableWidth = $element.find(".dx-scheduler-all-day-table").outerWidth(),
        dateTableWidth = $element.find(".dx-scheduler-date-table").outerWidth();

    assert.equal(headerPanelWidth, 525, "Width is OK");
    assert.equal(allDayTableWidth, 525, "Width is OK");
    assert.equal(dateTableWidth, 525, "Width is OK");
});

QUnit.test("Header panel, all-day panel, date table should always take all work space width", function(assert) {
    var $element = this.instance.element();

    sinon.stub(this.instance, "_getWorkSpaceWidth").returns(1000);

    domUtils.triggerHidingEvent($element);
    domUtils.triggerShownEvent($element);

    var headerPanelWidth = $element.find(".dx-scheduler-header-panel").outerWidth(),
        allDayTableWidth = $element.find(".dx-scheduler-all-day-table").outerWidth(),
        dateTableWidth = $element.find(".dx-scheduler-date-table").outerWidth();

    assert.equal(headerPanelWidth, 1000, "Width is OK");
    assert.equal(allDayTableWidth, 1000, "Width is OK");
    assert.equal(dateTableWidth, 1000, "Width is OK");
});

QUnit.test("Workspace tables width should not be less than element width", function(assert) {
    var $element = this.instance.element();
    $element.css("width", 1000);

    sinon.stub(this.instance, "_getWorkSpaceWidth").returns(50);

    domUtils.triggerHidingEvent($element);
    domUtils.triggerShownEvent($element);

    var headerPanelWidth = $element.find(".dx-scheduler-header-panel").outerWidth(),
        allDayTableWidth = $element.find(".dx-scheduler-all-day-table").outerWidth(),
        dateTableWidth = $element.find(".dx-scheduler-date-table").outerWidth(),
        expectedWidth = 1000 - this.instance.getTimePanelWidth();

    assert.equal(headerPanelWidth, expectedWidth, "Width is OK");
    assert.equal(allDayTableWidth, expectedWidth, "Width is OK");
    assert.equal(dateTableWidth, expectedWidth, "Width is OK");
});
