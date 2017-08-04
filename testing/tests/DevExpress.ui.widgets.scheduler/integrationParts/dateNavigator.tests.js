"use strict";

var $ = require("jquery"),
    fx = require("animation/fx");

require("ui/scheduler/ui.scheduler");

QUnit.module("Integration: Date navigator", {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = function(options) {
            this.instance = $("#scheduler").dxScheduler(options).dxScheduler("instance");
        };
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("Click on the 'next' button should update currentDate", function(assert) {

    this.createInstance({ currentDate: new Date(2015, 1, 9) });

    $(this.instance.element()).find(".dx-scheduler-navigator-next").trigger("dxclick");

    assert.deepEqual(this.instance.option("currentDate"), new Date(2015, 1, 10), "New date is correct");
});

QUnit.test("Click on the 'next' button should update currentDate correctly, when intervalCount & startDate", function(assert) {
    this.createInstance({ currentDate: new Date(2015, 1, 9), views: [{
        type: "day",
        intervalCount: 3,
        startDate: new Date(2015, 1, 11)
    }] });

    $(this.instance.element().find(".dx-scheduler-navigator-next")).trigger("dxclick");

    assert.deepEqual(this.instance.option("currentDate"), new Date(2015, 1, 11), "New date is correct");
});

QUnit.test("Click on the 'next' button should update currentDate correctly, when intervalCount & startDate, month view", function(assert) {
    this.createInstance({
        currentDate: new Date(2017, 5, 9),
        currentView: "month",
        views: [{
            type: "month",
            intervalCount: 3,
            startDate: new Date(2017, 11, 11)
        }] });

    $(this.instance.element().find(".dx-scheduler-navigator-next")).trigger("dxclick");

    assert.deepEqual(this.instance.option("currentDate"), new Date(2017, 8, 28), "New date is correct");
});

QUnit.test("Click on the 'next' and 'previous' button should update currentDate correctly, currentDate = startDate, month view", function(assert) {
    this.createInstance({
        currentDate: new Date(2017, 11, 11),
        currentView: "month",
        views: [{
            type: "month",
            intervalCount: 3,
            startDate: new Date(2017, 11, 11)
        }] });

    var $nextButton = $(this.instance.element().find(".dx-scheduler-navigator-next")),
        $previousButton = $(this.instance.element().find(".dx-scheduler-navigator-previous"));

    $nextButton.trigger("dxclick");
    $nextButton.trigger("dxclick");
    $previousButton.trigger("dxclick");
    $previousButton.trigger("dxclick");

    assert.equal(this.instance.option("currentDate").getMonth(), 11, "New date is correct");
});

QUnit.test("Click on the 'previous' button should update currentDate", function(assert) {

    this.createInstance({ currentDate: new Date(2015, 1, 9) });

    $(this.instance.element()).find(".dx-scheduler-navigator-previous").trigger("dxclick");

    assert.deepEqual(this.instance.option("currentDate"), new Date(2015, 1, 8), "New date is correct");
});

QUnit.test("Click on the 'previous' button should update currentDate correctly, when intervalCount & startDate", function(assert) {

    this.createInstance({ currentDate: new Date(2015, 1, 9), views: [{
        type: "day",
        intervalCount: 3,
        startDate: new Date(2015, 1, 10)
    }] });

    $(this.instance.element().find(".dx-scheduler-navigator-previous")).trigger("dxclick");

    assert.deepEqual(this.instance.option("currentDate"), new Date(2015, 1, 4), "New date is correct");
});

QUnit.test("Click on the 'previous' button should update currentDate correctly, when intervalCount & startDate, month view", function(assert) {
    this.createInstance({
        currentDate: new Date(2017, 5, 9),
        currentView: "month",
        views: [{
            type: "month",
            intervalCount: 3,
            startDate: new Date(2017, 11, 11)
        }] });

    $(this.instance.element().find(".dx-scheduler-navigator-previous")).trigger("dxclick");

    assert.deepEqual(this.instance.option("currentDate"), new Date(2017, 2, 28), "New date is correct");
});

QUnit.test("Caption should be updated when currentDate is changed", function(assert) {

    this.createInstance({ currentDate: new Date(2015, 1, 9) });
    this.instance.option("currentDate", new Date(2015, 1, 10));

    var navigator = $(this.instance.element()).find(".dx-scheduler-navigator").dxSchedulerNavigator("instance");

    assert.deepEqual(navigator.option("date"), new Date(2015, 1, 10), "New date is correct");
});

QUnit.test("Caption should be updated when currentView is changed", function(assert) {

    this.createInstance({ currentDate: new Date(2015, 1, 9) });
    this.instance.option("currentView", "week");

    var navigator = $(this.instance.element()).find(".dx-scheduler-navigator").dxSchedulerNavigator("instance");

    assert.deepEqual(navigator.option("step"), "week", "Navigator caption is OK");
});

QUnit.test("First day of week should be updated when firstDayOfWeek is changed", function(assert) {

    this.createInstance({ currentDate: new Date(2015, 1, 9), firstDayOfWeek: 3 });

    var navigator = $(this.instance.element()).find(".dx-scheduler-navigator").dxSchedulerNavigator("instance");

    assert.deepEqual(navigator.option("firstDayOfWeek"), 3, "firstDayOfWeek is OK");

    this.instance.option("firstDayOfWeek", 2);

    assert.deepEqual(navigator.option("firstDayOfWeek"), 2, "firstDayOfWeek is OK");
});

QUnit.test("Tasks should be rerendered after click on next/prev button", function(assert) {
    this.createInstance({ currentDate: new Date(2015, 1, 24) });

    var spy = sinon.spy(this.instance._appointmentModel, "filterByDate");

    try {
        $(this.instance.element()).find(".dx-scheduler-navigator-previous").trigger("dxclick");
        assert.ok(spy.calledOnce, "filterByDate is called");
    } finally {
        this.instance._appointmentModel.filterByDate.restore();
    }
});

QUnit.test("Tasks should have correct position after click on next/prev button & calendar", function(assert) {
    this.createInstance({
        currentDate: new Date(2016, 0, 24),
        startDayHour: 2,
        currentView: "day",
        firstDayOfWeek: 1,
        dataSource: [{ startDate: new Date(2016, 0, 24, 3), endDate: new Date(2016, 0, 24, 4) }]
    });
    var $scheduler = $(this.instance.element());

    var appointmentPosition = $scheduler.find(".dx-scheduler-appointment").position();

    $scheduler.find(".dx-scheduler-navigator-caption").trigger("dxclick");
    $(".dx-calendar td[data-value='2016/01/23']").trigger("dxclick");
    $scheduler.find(".dx-scheduler-navigator-next").trigger("dxclick");

    var currentPosition = $scheduler.find(".dx-scheduler-appointment").position();
    assert.roughEqual(currentPosition.top, appointmentPosition.top, 1.001, "position is not modified");
});

QUnit.test("Min & Max options should be passed to header", function(assert) {
    this.createInstance({ currentDate: new Date(2015, 1, 9), min: new Date(2015, 1, 2), max: new Date(2015, 1, 4) });

    var header = $(this.instance.element()).find(".dx-scheduler-header").dxSchedulerHeader("instance");

    assert.deepEqual(header.option("min"), new Date(2015, 1, 2), "min is passed");
    assert.deepEqual(header.option("max"), new Date(2015, 1, 4), "max is passed");

    this.instance.option("min", new Date(2015, 1, 1));
    assert.deepEqual(header.option("min"), new Date(2015, 1, 1), "min is passed after option changed");

    this.instance.option("max", new Date(2015, 1, 5));
    assert.deepEqual(header.option("max"), new Date(2015, 1, 5), "max is passed after option changed");
});

QUnit.test("Date navigator should have a correct step on the Agenda view", function(assert) {
    this.createInstance({
        views: ["agenda"],
        currentView: "agenda"
    });

    var navigator = $(this.instance.element()).find(".dx-scheduler-navigator").dxSchedulerNavigator("instance");

    assert.equal(navigator.option("step"), "agenda", "Step is OK");
});
