"use strict";

var $ = require("jquery"),
    dblclickEvent = require("events/dblclick"),
    Color = require("color"),
    fx = require("animation/fx"),
    pointerMock = require("../../../helpers/pointerMock.js"),
    dragEvents = require("events/drag"),
    DataSource = require("data/data_source/data_source").DataSource;

require("ui/scheduler/ui.scheduler");

QUnit.module("Integration: Recurring Appointments", {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = function(options) {
            this.instance = $("#scheduler").dxScheduler(options).dxScheduler("instance");
        };
        this.getAppointmentColor = function($task) {
            return new Color($task.css("background-color")).toHex();
        };
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test("Tasks should be duplicated according to recurrence rule", function(assert) {
    var tasks = [
            { text: "One", startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 2), recurrenceRule: "FREQ=DAILY;INTERVAL=4" },
            { text: "Two", startDate: new Date(2015, 2, 17), endDate: new Date(2015, 2, 17, 0, 30) }
    ];
    var dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentView: "week",
        currentDate: new Date(2015, 2, 16),
        dataSource: dataSource
    });

    assert.equal(this.instance.element().find(".dx-scheduler-appointment").length, 3, "tasks are OK");
    assert.equal(this.instance.element().find(".dx-scheduler-appointment-recurrence").length, 2, "recurrence tasks are OK");
});

QUnit.test("Tasks should be duplicated according to recurrence rule, if firstDayOfWeek was set", function(assert) {
    var tasks = [
            { text: "One", startDate: new Date(2015, 2, 12), endDate: new Date(2015, 2, 12, 2), recurrenceRule: "FREQ=WEEKLY;BYDAY=MO,TH,SA" }
    ];
    var dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentView: "week",
        currentDate: new Date(2015, 2, 12),
        dataSource: dataSource,
        firstDayOfWeek: 4
    });

    assert.equal(this.instance.element().find(".dx-scheduler-appointment-recurrence").length, 3, "recurrence tasks are OK");
});

QUnit.test("Tasks should be duplicated according to recurrence rule and recurrence exception", function(assert) {
    var tasks = [
            { text: "One", startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 2), recurrenceRule: "FREQ=DAILY", recurrenceException: "20150317" }
    ];
    var dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentView: "week",
        currentDate: new Date(2015, 2, 16),
        dataSource: dataSource
    });

    assert.equal(this.instance.element().find(".dx-scheduler-appointment-recurrence").length, 5, "tasks are OK");
});

QUnit.test("Recurring appointments with resources should have color of the first resource if groups option is not defined", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        firstDayOfWeek: 1,
        views: ["week"],
        currentView: "week",
        resources: [{
            field: "ownerId",
            dataSource: [{ id: 1, text: "John", color: "#ff0000" }, { id: 2, text: "Mike", color: "#0000ff" }]
        }],
        dataSource: [
            {
                text: "a",
                recurrenceRule: "FREQ=DAILY",
                startDate: new Date(2015, 1, 9, 10),
                endDate: new Date(2015, 1, 9, 10, 30),
                ownerId: [1, 2]
            }
        ]
    });
    var that = this;
    $(this.instance.element()).find(".dx-scheduler-appointment").each(function() {
        assert.equal(that.getAppointmentColor($(this)), "#ff0000", "Color is OK");
    });

});

QUnit.test("Recurring Task dragging", function(assert) {
    var data = new DataSource({
        store: [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: "FREQ=DAILY"
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: "week",
        editing: true,
        firstDayOfWeek: 1
    });

    var updatedItem = {
        text: "Task 1",
        startDate: new Date(2015, 1, 14),
        endDate: new Date(2015, 1, 14, 1),
        recurrenceRule: "FREQ=DAILY",
        allDay: false
    };

    $(this.instance.element()).find(".dx-scheduler-appointment").eq(0).trigger(dragEvents.start);
    $(this.instance.element()).find(".dx-scheduler-date-table-cell").eq(5).trigger(dragEvents.enter);
    $(this.instance.element()).find(".dx-scheduler-appointment").eq(0).trigger(dragEvents.end);
    $(".dx-dialog-buttons .dx-button").eq(0).trigger("dxclick");

    var dataSourceItem = this.instance.option("dataSource").items()[0];

    assert.equal(dataSourceItem.text, updatedItem.text, "New data is correct");
    assert.equal(dataSourceItem.allDay, updatedItem.allDay, "New data is correct");
    assert.equal(dataSourceItem.recurrenceRule, updatedItem.recurrenceRule, "New data is correct");
    assert.deepEqual(dataSourceItem.startDate, updatedItem.startDate, "New data is correct");
    assert.deepEqual(dataSourceItem.endDate, updatedItem.endDate, "New data is correct");

    $(this.instance.element()).find(".dx-scheduler-appointment").eq(0).trigger(dragEvents.start);
    $(this.instance.element()).find(".dx-scheduler-date-table-cell").eq(8).trigger(dragEvents.enter);
    $(this.instance.element()).find(".dx-scheduler-appointment").eq(0).trigger(dragEvents.end);
    $(".dx-dialog-buttons .dx-button").eq(1).trigger("dxclick");

    dataSourceItem = this.instance.option("dataSource").items()[0];

    assert.equal(dataSourceItem.text, updatedItem.text, "data does not changed");
    assert.equal(dataSourceItem.allDay, updatedItem.allDay, "data does not changed");
    assert.equal(dataSourceItem.recurrenceRule, updatedItem.recurrenceRule, "data does not changed");
    assert.deepEqual(dataSourceItem.startDate, updatedItem.startDate, "data does not changed");
    assert.deepEqual(dataSourceItem.endDate, updatedItem.endDate, "data does not changed");
});

QUnit.test("Recurring Task dragging with 'series' recurrenceEditMode", function(assert) {
    var data = new DataSource({
        store: [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: "FREQ=DAILY"
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: "week",
        editing: true,
        firstDayOfWeek: 1,
        recurrenceEditMode: "series"
    });

    var updatedItem = {
        text: "Task 1",
        startDate: new Date(2015, 1, 14),
        endDate: new Date(2015, 1, 14, 1),
        recurrenceRule: "FREQ=DAILY",
        allDay: false
    };

    $(this.instance.element()).find(".dx-scheduler-appointment").eq(0).trigger(dragEvents.start);
    $(this.instance.element()).find(".dx-scheduler-date-table-cell").eq(5).trigger(dragEvents.enter);
    $(this.instance.element()).find(".dx-scheduler-appointment").eq(0).trigger(dragEvents.end);

    var dataSourceItem = this.instance.option("dataSource").items()[0];

    delete dataSourceItem.initialCoordinates;
    delete dataSourceItem.initialSize;

    assert.deepEqual(dataSourceItem, updatedItem, "New data is correct");
});

QUnit.test("Recurrent Task dragging with 'occurrence' recurrenceEditMode", function(assert) {
    var data = new DataSource({
        store: [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: "FREQ=DAILY"
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: "week",
        editing: true,
        firstDayOfWeek: 1,
        recurrenceEditMode: "occurrence"
    });

    var updatedItem = {
        text: "Task 1",
        startDate: new Date(2015, 1, 14),
        endDate: new Date(2015, 1, 14, 1),
        allDay: false,
        recurrenceRule: "",
        recurrenceException: ""
    };

    $(this.instance.element()).find(".dx-scheduler-appointment").eq(0).trigger(dragEvents.start);
    $(this.instance.element()).find(".dx-scheduler-date-table-cell").eq(5).trigger(dragEvents.enter);
    $(this.instance.element()).find(".dx-scheduler-appointment").eq(0).trigger(dragEvents.end);

    var updatedSingleItem = this.instance.option("dataSource").items()[1],
        updatedRecurringItem = this.instance.option("dataSource").items()[0];

    delete updatedSingleItem.initialCoordinates;
    delete updatedSingleItem.initialSize;

    assert.deepEqual(updatedSingleItem, updatedItem, "New data is correct");

    assert.equal(updatedRecurringItem.recurrenceException, "20150209T010000", "Exception for recurrence appointment is correct");
});

QUnit.test("Updated single item should not have recurrenceException ", function(assert) {
    var data = new DataSource({
        store: [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: "FREQ=DAILY",
                recurrenceException: "20150214T010000"
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: "week",
        editing: true,
        firstDayOfWeek: 1
    });

    $(this.instance.element()).find(".dx-scheduler-appointment").eq(1).trigger(dragEvents.start);
    $(this.instance.element()).find(".dx-scheduler-date-table-cell").eq(5).trigger(dragEvents.enter);
    $(this.instance.element()).find(".dx-scheduler-appointment").eq(1).trigger(dragEvents.end);
    $(".dx-dialog-buttons .dx-button").eq(1).trigger("dxclick");

    var singleItem = this.instance.option("dataSource").items()[1];

    assert.equal(singleItem.recurrenceException, "", "Single appointment data is correct");
});

QUnit.test("Recurrent Task dragging, single mode", function(assert) {
    var data = new DataSource({
        store: [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 17, 0),
                endDate: new Date(2015, 1, 9, 18, 0),
                recurrenceRule: "FREQ=DAILY"
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: "week",
        editing: true,
        firstDayOfWeek: 1
    });

    var updatedItem = {
        text: "Task 1",
        startDate: new Date(2015, 1, 14),
        endDate: new Date(2015, 1, 14, 1),
        allDay: false,
        recurrenceRule: ""
    };

    $(this.instance.element()).find(".dx-scheduler-appointment").eq(0).trigger(dragEvents.start);
    $(this.instance.element()).find(".dx-scheduler-date-table-cell").eq(5).trigger(dragEvents.enter);
    $(this.instance.element()).find(".dx-scheduler-appointment").eq(0).trigger(dragEvents.end);
    $(".dx-dialog-buttons .dx-button").eq(1).trigger("dxclick");

    var updatedSingleItem = this.instance.option("dataSource").items()[1],
        updatedRecurringItem = this.instance.option("dataSource").items()[0];

    assert.equal(updatedSingleItem.text, updatedItem.text, "New data is correct");
    assert.equal(updatedSingleItem.allDay, updatedItem.allDay, "New data is correct");
    assert.equal(updatedSingleItem.recurrenceRule, updatedItem.recurrenceRule, "New data is correct");
    assert.deepEqual(updatedSingleItem.startDate, updatedItem.startDate, "New data is correct");
    assert.deepEqual(updatedSingleItem.endDate, updatedItem.endDate, "New data is correct");

    assert.equal(updatedRecurringItem.recurrenceException, "20150209T170000", "Exception for recurrence appointment is correct");
});

QUnit.test("Recurrent Task dragging, single mode - recurrenceException updating ", function(assert) {
    var data = new DataSource({
        store: [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: "FREQ=DAILY",
                recurrenceException: "20150214T010000"
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: "week",
        editing: true,
        firstDayOfWeek: 1
    });

    $(this.instance.element()).find(".dx-scheduler-appointment").eq(1).trigger(dragEvents.start);
    $(this.instance.element()).find(".dx-scheduler-date-table-cell").eq(5).trigger(dragEvents.enter);
    $(this.instance.element()).find(".dx-scheduler-appointment").eq(1).trigger(dragEvents.end);
    $(".dx-dialog-buttons .dx-button").eq(1).trigger("dxclick");

    var updatedRecurringItem = this.instance.option("dataSource").items()[0];

    assert.equal(updatedRecurringItem.recurrenceException, "20150214T010000,20150210T010000", "Exception for recurrence appointment is correct");
});

QUnit.test("Recurrent Task resizing, single mode", function(assert) {
    var data = new DataSource({
        store: [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: "FREQ=DAILY"
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: "week",
        firstDayOfWeek: 1,
        editing: true
    });

    var updatedItem = {
        text: "Task 1",
        startDate: new Date(2015, 1, 10, 1),
        endDate: new Date(2015, 1, 10, 3),
        allDay: false,
        recurrenceRule: ""
    };

    var cellHeight = $(this.instance.element()).find(".dx-scheduler-date-table-cell").eq(0).outerHeight(),
        hourHeight = cellHeight * 2;

    var pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-bottom").eq(1)).start();
    pointer.dragStart().drag(0, hourHeight).dragEnd();
    $(".dx-dialog-buttons .dx-button").eq(1).trigger("dxclick");

    var updatedSingleItem = this.instance.option("dataSource").items()[1],
        updatedRecurringItem = this.instance.option("dataSource").items()[0];

    assert.equal(updatedSingleItem.recurrenceRule, updatedItem.recurrenceRule, "New data is correct");
    assert.deepEqual(updatedSingleItem.startDate, updatedItem.startDate, "New data is correct");
    assert.deepEqual(updatedSingleItem.endDate, updatedItem.endDate, "New data is correct");

    assert.equal(updatedRecurringItem.recurrenceException, "20150210T010000", "Exception for recurrence appointment is correct");
});

QUnit.test("Recurrence task resizing when currentDate != recStartDate (T488760)", function(assert) {
    this.createInstance({
        currentDate: new Date(2017, 2, 20),
        editing: true,
        recurrenceEditMode: "occurrence",
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 4, 25, 1),
            endDate: new Date(2015, 4, 25, 2, 30),
            recurrenceRule: "FREQ=WEEKLY;BYDAY=MO"

        }]
    });

    var cellHeight = $(this.instance.element()).find(".dx-scheduler-date-table-cell").eq(0).outerHeight(),
        pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-bottom").eq(0)).start();

    pointer.dragStart().drag(0, cellHeight).dragEnd();

    var apptData = $(this.instance.element()).find(".dx-scheduler-appointment").dxSchedulerAppointment("instance").option("data");

    assert.deepEqual(apptData.endDate, new Date(2017, 2, 20, 3), "End date is OK");
});

QUnit.test("Recurrent Task deleting, single mode", function(assert) {
    var data = new DataSource({
        store: [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: "FREQ=DAILY"
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: "week",
        firstDayOfWeek: 1
    });

    $(this.instance.element()).find(".dx-scheduler-appointment").eq(1).trigger("dxclick");
    this.clock.tick(300);

    $(".dx-scheduler-appointment-tooltip-buttons .dx-button").eq(0).trigger("dxclick");
    $(".dx-dialog-buttons .dx-button").eq(1).trigger("dxclick");

    var updatedRecurringItem = this.instance.option("dataSource").items()[0];

    assert.equal(updatedRecurringItem.recurrenceException, "20150210T010000", "Exception for recurrence appointment is correct");
    assert.equal(this.instance.option("dataSource").items().length, 1, "Single item was deleted");
});

QUnit.test("Recurrent Task editing, confirmation tooltip should be shown after trying to edit recurrent appointment", function(assert) {
    var data = new DataSource({
        store: [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: "FREQ=DAILY"
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: "week",
        firstDayOfWeek: 1
    });

    $(this.instance.element()).find(".dx-scheduler-appointment").eq(2).trigger("dxclick");
    this.clock.tick(300);
    $(".dx-scheduler-appointment-tooltip-buttons .dx-button").eq(1).trigger("dxclick");

    assert.ok($(".dx-dialog.dx-overlay-modal").length, "Dialog was shown");
    $(".dx-dialog-buttons .dx-button").eq(1).trigger("dxclick");
});

QUnit.test("Recurrent Task editing, single mode", function(assert) {
    var data = new DataSource({
        store: [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: "FREQ=DAILY"
            }
        ]
    });

    var updatedItem = {
        text: "Task 2",
        startDate: new Date(2015, 1, 11, 3),
        endDate: new Date(2015, 1, 11, 4),
        allDay: false,
        recurrenceRule: ""
    };

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: "week",
        firstDayOfWeek: 1
    });

    $(this.instance.element()).find(".dx-scheduler-appointment").eq(2).trigger("dxclick");
    this.clock.tick(300);
    $(".dx-scheduler-appointment-tooltip-buttons .dx-button").eq(1).trigger("dxclick");
    $(".dx-dialog-buttons .dx-button").eq(1).trigger("dxclick");

    var $title = $(".dx-textbox").eq(0),
        title = $title.dxTextBox("instance"),
        $startDate = $(".dx-datebox").eq(0),
        startDate = $startDate.dxDateBox("instance");

    title.option("value", "Task 2");
    startDate.option("value", new Date(2015, 1, 11, 3, 0));
    $(".dx-button.dx-popup-done").eq(0).trigger("dxclick");
    this.clock.tick(300);

    var updatedSingleItem = this.instance.option("dataSource").items()[1],
        updatedRecurringItem = this.instance.option("dataSource").items()[0];

    assert.equal(updatedSingleItem.text, updatedItem.text, "New data is correct");
    assert.equal(updatedSingleItem.recurrenceRule, updatedItem.recurrenceRule, "New data is correct");
    assert.deepEqual(updatedSingleItem.startDate, updatedItem.startDate, "New data is correct");
    assert.deepEqual(updatedSingleItem.endDate, updatedItem.endDate, "New data is correct");

    assert.equal(updatedRecurringItem.recurrenceException, "20150211T010000", "Exception for recurrence appointment is correct");
});

QUnit.test("Recurrent Task edition canceling, single mode", function(assert) {
    var data = new DataSource({
        store: [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: "FREQ=DAILY"
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: "week",
        firstDayOfWeek: 1
    });

    $(this.instance.element()).find(".dx-scheduler-appointment").eq(2).trigger("dxclick");
    this.clock.tick(300);
    $(".dx-scheduler-appointment-tooltip-buttons .dx-button").eq(1).trigger("dxclick");
    $(".dx-dialog-buttons .dx-button").eq(1).trigger("dxclick");
    $(".dx-button.dx-popup-cancel").eq(0).trigger("dxclick");

    $(this.instance.element()).find(".dx-scheduler-appointment").eq(2).trigger("dxclick");
    this.clock.tick(300);
    $(".dx-scheduler-appointment-tooltip-buttons .dx-button").eq(1).trigger("dxclick");
    $(".dx-dialog-buttons .dx-button").eq(0).trigger("dxclick");
    $(".dx-button.dx-popup-done").eq(0).trigger("dxclick");

    var items = this.instance.option("dataSource").items();

    assert.equal(items.length, 1, "Items are correct");
});

QUnit.test("Recurrent Task editing, single mode - canceling", function(assert) {
    var data = new DataSource({
        store: [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: "FREQ=DAILY"
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: "week",
        firstDayOfWeek: 1
    });

    $(this.instance.element()).find(".dx-scheduler-appointment").eq(2).trigger("dxclick");
    this.clock.tick(300);
    $(".dx-scheduler-appointment-tooltip-buttons .dx-button").eq(1).trigger("dxclick");
    $(".dx-dialog-buttons .dx-button").eq(1).trigger("dxclick");

    $(".dx-button.dx-popup-cancel").eq(0).trigger("dxclick");
    this.clock.tick(300);

    var recurrentItem = this.instance.option("dataSource").items()[0];

    assert.equal(recurrentItem.recurrenceException, undefined, "Exception for recurrence appointment is correct");
});

QUnit.test("Recurrent Task editing, confirmation tooltip should be shown after double click on recurrent appointment", function(assert) {
    var data = new DataSource({
        store: [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: "FREQ=DAILY"
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: "week",
        firstDayOfWeek: 1
    });

    $(this.instance.element()).find(".dx-scheduler-appointment").eq(2).trigger(dblclickEvent.name);
    this.clock.tick(300);

    assert.ok($(".dx-dialog.dx-overlay-modal").length, "Dialog was shown");
    $(".dx-dialog-buttons .dx-button").eq(1).trigger("dxclick");
});

QUnit.test("Recurrent Task editing, single mode - double click", function(assert) {
    var data = new DataSource({
        store: [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: "FREQ=DAILY"
            }
        ]
    });

    var updatedItem = {
        text: "Task 2",
        startDate: new Date(2015, 1, 11, 3),
        endDate: new Date(2015, 1, 11, 4),
        allDay: false,
        recurrenceRule: ""
    };

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: "week",
        firstDayOfWeek: 1
    });

    $(this.instance.element()).find(".dx-scheduler-appointment").eq(2).trigger(dblclickEvent.name);
    this.clock.tick(300);

    $(".dx-dialog-buttons .dx-button").eq(1).trigger("dxclick");

    var $title = $(".dx-textbox").eq(0),
        title = $title.dxTextBox("instance"),
        $startDate = $(".dx-datebox").eq(0),
        startDate = $startDate.dxDateBox("instance");

    title.option("value", "Task 2");
    startDate.option("value", new Date(2015, 1, 11, 3, 0));
    $(".dx-button.dx-popup-done").eq(0).trigger("dxclick");
    this.clock.tick(300);

    var updatedSingleItem = this.instance.option("dataSource").items()[1],
        updatedRecurringItem = this.instance.option("dataSource").items()[0];

    assert.equal(updatedSingleItem.text, updatedItem.text, "New data is correct");
    assert.equal(updatedSingleItem.recurrenceRule, updatedItem.recurrenceRule, "New data is correct");
    assert.deepEqual(updatedSingleItem.startDate, updatedItem.startDate, "New data is correct");
    assert.deepEqual(updatedSingleItem.endDate, updatedItem.endDate, "New data is correct");

    assert.equal(updatedRecurringItem.recurrenceException, "20150211T010000", "Exception for recurrence appointment is correct");
});

QUnit.test("Recurrent allDay task dragging on month view, single mode", function(assert) {
    var data = new DataSource({
        store: [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1),
                endDate: new Date(2015, 1, 9, 2),
                allDay: true,
                recurrenceRule: "FREQ=DAILY"
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        endDayHour: 10,
        dataSource: data,
        currentView: "month",
        firstDayOfWeek: 1,
        editing: true
    });

    var updatedItem = {
        text: "Task 1",
        startDate: new Date(2015, 0, 26, 1),
        endDate: new Date(2015, 0, 26, 2),
        allDay: true,
        recurrenceRule: ""
    };

    $(this.instance.element()).find(".dx-scheduler-appointment").eq(0).trigger(dragEvents.start);
    $(this.instance.element()).find(".dx-scheduler-date-table-cell").eq(0).trigger(dragEvents.enter);
    $(this.instance.element()).find(".dx-scheduler-appointment").eq(0).trigger(dragEvents.end);
    $(".dx-dialog-buttons .dx-button").eq(1).trigger("dxclick");

    var updatedSingleItem = this.instance.option("dataSource").items()[1],
        updatedRecurringItem = this.instance.option("dataSource").items()[0];

    assert.equal(updatedSingleItem.text, updatedItem.text, "New data is correct");
    assert.equal(updatedSingleItem.allDay, updatedItem.allDay, "New data is correct");
    assert.equal(updatedSingleItem.recurrenceRule, updatedItem.recurrenceRule, "New data is correct");
    assert.deepEqual(updatedSingleItem.startDate, updatedItem.startDate, "New data is correct");
    assert.deepEqual(updatedSingleItem.endDate, updatedItem.endDate, "New data is correct");

    assert.equal(updatedRecurringItem.recurrenceException, "20150209T010000", "Exception for recurrence appointment is correct");
});

QUnit.test("Recurrent allDay task dragging on month view, single mode, 24h appointment duration", function(assert) {
    var data = new DataSource({
        store: [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9),
                endDate: new Date(2015, 1, 10),
                allDay: true,
                recurrenceRule: "FREQ=DAILY"
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: "month",
        firstDayOfWeek: 1,
        editing: true,
        startDayHour: 3,
        endDayHour: 10
    });

    var updatedItem = {
        text: "Task 1",
        startDate: new Date(2015, 0, 26),
        endDate: new Date(2015, 0, 27),
        allDay: true,
        recurrenceRule: ""
    };

    $(this.instance.element()).find(".dx-scheduler-appointment").eq(0).trigger(dragEvents.start);
    $(this.instance.element()).find(".dx-scheduler-date-table-cell").eq(0).trigger(dragEvents.enter);
    $(this.instance.element()).find(".dx-scheduler-appointment").eq(0).trigger(dragEvents.end);
    $(".dx-dialog-buttons .dx-button").eq(1).trigger("dxclick");

    var updatedSingleItem = this.instance.option("dataSource").items()[1],
        updatedRecurringItem = this.instance.option("dataSource").items()[0];

    assert.equal(updatedSingleItem.text, updatedItem.text, "New data is correct");
    assert.equal(updatedSingleItem.allDay, updatedItem.allDay, "New data is correct");
    assert.equal(updatedSingleItem.recurrenceRule, updatedItem.recurrenceRule, "New data is correct");
    assert.deepEqual(updatedSingleItem.startDate, updatedItem.startDate, "New data is correct");
    assert.deepEqual(updatedSingleItem.endDate, updatedItem.endDate, "New data is correct");

    assert.equal(updatedRecurringItem.recurrenceException, "20150209T000000", "Exception for recurrence appointment is correct");
});

QUnit.test("Recurrence item in form should have a special css class", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: [],
        currentView: "week",
        firstDayOfWeek: 1
    });

    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 9, 2) }, true);

    var form = this.instance.getAppointmentDetailsForm(),
        recurrenceItemClass = "dx-scheduler-recurrence-rule-item",
        openedRecurrenceItemClass = "dx-scheduler-recurrence-rule-item-opened",
        $recurrenceItem = form.element().find("." + recurrenceItemClass);

    assert.notOk($recurrenceItem.hasClass(openedRecurrenceItemClass));

    form.element().find(".dx-recurrence-switch").dxSwitch("instance").option("value", true);
    $recurrenceItem = form.element().find("." + recurrenceItemClass);

    assert.ok($recurrenceItem.hasClass(openedRecurrenceItemClass));
});

QUnit.test("Recurrence editor should work correctly after toggling repeat and end-repeat switch", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: new DataSource({
            store: []
        }),
        currentView: "week"
    });

    var appointment = { startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), text: "caption 1" };

    this.instance.showAppointmentPopup(appointment);

    var $popup = $(".dx-scheduler-appointment-popup"),
        switchEditor = $popup.find(".dx-recurrence-switch").dxSwitch("instance");

    switchEditor.option("value", true);

    var switchEndEditor = $popup.find(".dx-recurrence-switch-repeat-end").dxSwitch("instance");

    switchEndEditor.option("value", true);
    switchEditor.option("value", false);

    assert.ok(true, "recurrence editor works correctly");
});

QUnit.test("Recurrence editor should work correctly after switch off the recurrence", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 4, 25),
        dataSource: new DataSource({
            store: []
        }),
        currentView: "week"
    });

    this.instance.option("recurrenceEditMode", "series");

    var appointment = {
        text: "Appointment",
        startDate: new Date(2015, 4, 25, 9, 0),
        endDate: new Date(2015, 4, 25, 9, 15),
        recurrenceRule: "FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR;UNTIL=20150530"
    };

    this.instance.showAppointmentPopup(appointment);

    var $popup = $(".dx-scheduler-appointment-popup"),
        switchEditor = $popup.find(".dx-recurrence-switch").dxSwitch("instance");

    switchEditor.option("value", false);

    assert.ok(true, "recurrence editor works correctly");
});


QUnit.test("AllDay recurrence appointments should be rendered correctly after changing currentDate", function(assert) {
    var tasks = [
            { text: "One", startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 17), allDay: true, recurrenceRule: "FREQ=DAILY" }
    ];
    var dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentView: "week",
        startDayHour: 8,
        endDayHour: 19,
        currentDate: new Date(2015, 2, 16),
        dataSource: dataSource
    });

    this.instance.option("currentDate", new Date(2015, 2, 23));
    assert.equal(this.instance.element().find(".dx-scheduler-appointment-recurrence").length, 7, "appointments are OK");
});

QUnit.test("AllDay recurrence appointments should be rendered correctly after changing currentDate, day view", function(assert) {
    var tasks = [{
        startDate: new Date(2015, 4, 25, 9, 30),
        endDate: new Date(2015, 4, 26, 11, 30),
        recurrenceRule: "FREQ=MONTHLY;BYMONTHDAY=26"
    }];
    var dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentView: "day",
        currentDate: new Date(2015, 4, 26),
        dataSource: dataSource
    });
    assert.equal(this.instance.element().find(".dx-scheduler-appointment-recurrence").length, 1, "appointments are OK");
    this.instance.option("currentDate", new Date(2015, 4, 27));
    assert.equal(this.instance.element().find(".dx-scheduler-appointment-recurrence").length, 0, "appointments are OK");
});
