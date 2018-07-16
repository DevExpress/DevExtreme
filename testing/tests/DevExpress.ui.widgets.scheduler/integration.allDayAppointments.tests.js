"use strict";

var $ = require("jquery");

QUnit.testStart(function() {
    $("#qunit-fixture").html(
        '<div id="scheduler">\
            <div data-options="dxTemplate: { name: \'template\' }">Task Template</div>\
            </div>');
});

require("common.css!");
require("generic_light.css!");


var $ = require("jquery"),
    translator = require("animation/translator"),
    dblclickEvent = require("events/dblclick"),
    fx = require("animation/fx"),
    pointerMock = require("../../helpers/pointerMock.js"),
    dragEvents = require("events/drag"),
    DataSource = require("data/data_source/data_source").DataSource,
    ArrayStore = require("data/array_store"),
    CustomStore = require("data/custom_store"),
    Query = require("data/query"),
    dataUtils = require("core/element_data"),
    devices = require("core/devices");

require("ui/scheduler/ui.scheduler");

var APPOINTMENT_DEFAULT_OFFSET = 25,
    APPOINTMENT_MOBILE_OFFSET = 50;

function getOffset() {
    if(devices.current().deviceType !== "desktop") {
        return APPOINTMENT_MOBILE_OFFSET;
    } else {
        return APPOINTMENT_DEFAULT_OFFSET;
    }
}

QUnit.module("Integration: allDay appointments", {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = function(options) {
            this.instance = $("#scheduler").dxScheduler($.extend(options, { maxAppointmentsPerCell: null })).dxScheduler("instance");
        };

        this.clock = sinon.useFakeTimers();
        this.tasks = [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            },
            {
                text: "Task 2",
                startDate: new Date(2015, 1, 9, 11, 0),
                endDate: new Date(2015, 1, 9, 12, 0)
            }
        ];
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test("AllDay tasks should not be filtered by start day hour", function(assert) {
    var tasks = [
            { text: "One", startDate: new Date(2015, 2, 16, 5), endDate: new Date(2015, 2, 16, 5, 30), allDay: true },
            { text: "Two", startDate: new Date(2015, 2, 16, 2), endDate: new Date(2015, 2, 16, 2, 30), allDay: true }];

    var dataSource = new DataSource({
        store: tasks
    });

    this.createInstance({
        currentDate: new Date(2015, 2, 16),
        dataSource: dataSource,
        startDayHour: 6,
        currentView: "week"
    });

    var $appointments = $(this.instance.$element()).find(".dx-scheduler-appointment");

    assert.equal($appointments.length, 2, "There are two appointments");
    assert.deepEqual(dataUtils.data($appointments.get(0), "dxItemData"), tasks[0], "The first appointment is OK");
    assert.deepEqual(dataUtils.data($appointments.get(1), "dxItemData"), tasks[1], "The second appointment is OK");
});

QUnit.test("AllDay tasks should not be filtered by end day hour", function(assert) {
    var tasks = [
        { text: "One", startDate: new Date(2015, 2, 16, 5), allDay: true, endDate: new Date(2015, 2, 16, 5, 30) },
        { text: "Two", startDate: new Date(2015, 2, 16, 10), allDay: true, endDate: new Date(2015, 2, 16, 10, 30) }
    ];
    var dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentDate: new Date(2015, 2, 16),
        dataSource: dataSource,
        endDayHour: 8,
        currentView: "week"
    });

    assert.deepEqual(dataSource.items(), [tasks[0], tasks[1]], "Items are OK");
});

QUnit.test("AllDay appointments should not be filtered by start & end day hour (day view)", function(assert) {
    var tasks = [
        { key: 1, text: "One", startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 2), allDay: true }
    ];

    var dataSource = new DataSource({
        store: new ArrayStore({
            data: tasks,
            key: "key"
        }),
    });

    this.createInstance({
        currentDate: new Date(2015, 2, 16),
        dataSource: dataSource,
        startDayHour: 3,
        endDayHour: 7,
        views: ["month", "day"],
        currentView: "month",
        firstDayOfWeek: 1
    });

    this.instance.option("currentView", "day");
    var $appointments = $(this.instance.$element()).find(".dx-scheduler-appointment");

    assert.equal($appointments.length, 1, "There are two appointments");
});

QUnit.test("All-day appointment should be resized correctly", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        editing: true,
        views: ["week"],
        currentView: "week",
        allDayExpr: "AllDay",
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 1, 9),
            endDate: new Date(2015, 1, 10),
            AllDay: true
        }]
    });

    var cellWidth = $(this.instance.$element()).find(".dx-scheduler-date-table-cell").eq(0).outerWidth();

    var pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-right").eq(0)).start();
    pointer.dragStart().drag(cellWidth, 0).dragEnd();

    assert.deepEqual(this.instance.option("dataSource")[0].endDate, new Date(2015, 1, 11), "End date is OK");
});

QUnit.test("All-day appointment endDate should be correct after resize when startDayHour & endDayHour", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        editing: true,
        views: ["week"],
        currentView: "week",
        startDayHour: 8,
        endDayHour: 19,
        allDayExpr: "AllDay",
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 1, 9),
            endDate: new Date(2015, 1, 10),
            AllDay: true
        }]
    });

    var cellWidth = $(this.instance.$element()).find(".dx-scheduler-date-table-cell").eq(0).outerWidth();

    var pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-right").eq(0)).start();
    pointer.dragStart().drag(cellWidth, 0).dragEnd();

    assert.deepEqual(this.instance.option("dataSource")[0].endDate, new Date(2015, 1, 11), "End date is OK");
});

QUnit.test("All-day appointment startDate should be correct after resize when startDayHour & endDayHour", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        editing: true,
        views: ["week"],
        currentView: "week",
        startDayHour: 8,
        endDayHour: 19,
        allDayExpr: "AllDay",
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 1, 10),
            endDate: new Date(2015, 1, 11),
            AllDay: true
        }]
    });

    var cellWidth = $(this.instance.$element()).find(".dx-scheduler-date-table-cell").eq(0).outerWidth();

    var pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-left").eq(0)).start();
    pointer.dragStart().drag(-(cellWidth - 10), 0).dragEnd();

    assert.deepEqual(this.instance.option("dataSource")[0].startDate, new Date(2015, 1, 9), "Start date is OK");
});

QUnit.test("Task dragging into the allDay container", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, editing: true });
    var $element = $(this.instance.$element()),
        $appointment = $element.find(".dx-scheduler-appointment").eq(0);

    $appointment.trigger(dragEvents.start);
    $element.find(".dx-scheduler-all-day-table-cell").trigger(dragEvents.enter);
    $appointment.trigger(dragEvents.end);
    this.clock.tick();

    var $allDayAppointment = $element.find(".dx-scheduler-all-day-appointments .dx-scheduler-appointment");

    assert.equal($allDayAppointment.length, 1, "allDayContainer has 1 item");
    assert.ok(this.instance.option("dataSource").items()[0].allDay, "New data is correct");

    $allDayAppointment.trigger(dragEvents.start);
    $(this.instance.$element()).find(".dx-scheduler-date-table-cell").eq(5).trigger(dragEvents.enter);
    $allDayAppointment.trigger(dragEvents.end);


    assert.ok(!this.instance.option("dataSource").items()[0].allDay, "New data is correct");
    assert.deepEqual(this.instance.option("dataSource").items()[0].endDate, new Date(2015, 1, 9, 3), "New data is correct");
    assert.equal($element.find(".dx-scheduler-all-day-appointments .dx-scheduler-appointment").length, 0, "allDayContainer is empty");
});

QUnit.test("Task dragging into the allDay container when allDay-cell is exactly top", function(assert) {
    var data = new DataSource({
        store: [{
            text: "Task 1",
            startDate: new Date(2015, 2, 4, 0, 0),
            endDate: new Date(2015, 2, 4, 0, 30)
        }]
    });

    this.createInstance({ currentDate: new Date(2015, 2, 4), dataSource: data, currentView: "week", editing: true });
    var $element = $(this.instance.$element()),
        $appointment = $element.find(".dx-scheduler-appointment").eq(0);

    $appointment.trigger(dragEvents.start);
    $element.find(".dx-scheduler-all-day-table-cell").eq(3).trigger(dragEvents.enter);
    $appointment.trigger(dragEvents.end);
    this.clock.tick();

    var $allDayAppointment = $element.find(".dx-scheduler-all-day-appointments .dx-scheduler-appointment");

    assert.equal($allDayAppointment.length, 1, "allDayContainer has 1 item");
    assert.ok(this.instance.option("dataSource").items()[0].allDay, "New data is correct");

    $allDayAppointment.trigger(dragEvents.start);
    $(this.instance.$element()).find(".dx-scheduler-date-table-cell").eq(3).trigger(dragEvents.enter);
    $allDayAppointment.trigger(dragEvents.end);


    assert.ok(!this.instance.option("dataSource").items()[0].allDay, "New data is correct");
    assert.deepEqual(this.instance.option("dataSource").items()[0].endDate, new Date(2015, 2, 4, 0, 30), "New data is correct");
    assert.equal($element.find(".dx-scheduler-all-day-appointments .dx-scheduler-appointment").length, 0, "allDayContainer is empty");
});

QUnit.test("End date of appointment should be calculated if it's dragged off from the all day container", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        editing: true,
        currentView: "week",
        firstDayOfWeek: 0,
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 1, 9, 0),
            endDate: new Date(2015, 1, 11, 0)
        }]
    });

    var $appointment = $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0);

    $appointment.trigger(dragEvents.start);
    $(this.instance.$element()).find(".dx-scheduler-date-table-cell").eq(0).trigger(dragEvents.enter);
    $appointment.trigger(dragEvents.end);

    this.clock.tick();
    var appointmentData = dataUtils.data($(this.instance.$element()).find(".dx-scheduler-appointment").get(0), "dxItemData");

    assert.deepEqual(appointmentData.startDate, new Date(2015, 1, 8, 0, 0), "Start date is correct");
    assert.deepEqual(appointmentData.endDate, new Date(2015, 1, 8, 0, 30), "End date is correct");
});

QUnit.test("boundOffset of allDay appointment should be correct on init", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        editing: true,
        currentView: "week",
        firstDayOfWeek: 0,
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 1, 9, 0),
            endDate: new Date(2015, 1, 9, 0, 30),
            allDay: true
        }]
    });

    var $appointment = $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0),
        allDayPanelHeight = $(this.instance.$element()).find(".dx-scheduler-all-day-table-cell").eq(0).get(0).getBoundingClientRect().height;

    assert.equal($appointment.dxDraggable("instance").option("boundOffset").top, -allDayPanelHeight, "Bound offset is correct");
});


QUnit.test("allDayExpanded option of workspace should be updated after dragged into the all day container", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: "week",
        editing: true
    });

    var $element = $(this.instance.$element()),
        $appointment = $element.find(".dx-scheduler-appointment").eq(0);

    var workspace = $(this.instance.$element()).find(".dx-scheduler-work-space").dxSchedulerWorkSpaceWeek("instance");

    assert.equal(workspace.option("allDayExpanded"), false);

    $appointment.trigger(dragEvents.start);
    $element.find(".dx-scheduler-all-day-table-cell").trigger(dragEvents.enter);
    $appointment.trigger(dragEvents.end);
    this.clock.tick();

    assert.equal(workspace.option("allDayExpanded"), true);
});

QUnit.test("Height of appointment should be correct after dragged into the all day container", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: "week",
        editing: true
    });

    var $element = $(this.instance.$element()),
        $appointment = $element.find(".dx-scheduler-appointment").eq(0);

    $appointment.trigger(dragEvents.start);
    $element.find(".dx-scheduler-all-day-table-cell").trigger(dragEvents.enter);
    $appointment.trigger(dragEvents.end);
    this.clock.tick();

    var $allDayCell = $(this.instance.$element()).find(".dx-scheduler-all-day-table-cell").eq(0),
        $allDayAppointment = $element.find(".dx-scheduler-all-day-appointment").eq(0);

    assert.equal($allDayAppointment.outerHeight(), $allDayCell.outerHeight(), "Appointment has correct height");
});

QUnit.test("Height of allDay appointment should be correct, 3 appts in cell", function(assert) {
    var data = new DataSource({
        store: [
            {
                text: "Task 1",
                allDay: true,
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            },
            {
                text: "Task 2",
                allDay: true,
                startDate: new Date(2015, 1, 9, 11, 0),
                endDate: new Date(2015, 1, 9, 12, 0)
            },
            {
                text: "Task 3",
                allDay: true,
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: "week",
        editing: true
    });

    var $element = $(this.instance.$element()),
        $appointments = $element.find(".dx-scheduler-appointment"),
        firstPosition = translator.locate($appointments.eq(0));

    assert.roughEqual($appointments.eq(0).outerHeight(), 25, 1.5, "Appointment has correct height");
    assert.roughEqual($appointments.eq(1).outerHeight(), 25, 1.5, "Appointment has correct height");
    assert.roughEqual(firstPosition.top, 25, 1.5, "Appointment has correct top");

    assert.equal($appointments.eq(2).outerWidth(), 15, "Compact appointment has correct width");
    assert.equal($appointments.eq(2).outerHeight(), 15, "Compact appointment has correct height");
});

QUnit.test("allDayExpanded option of workspace should be updated after dragged off from the all day container", function(assert) {
    this.createInstance({
        showAllDayPanel: true,
        currentDate: new Date(2015, 1, 9),
        currentView: "week",
        editing: true,
        firstDayOfWeek: 0,
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 1, 9, 0),
            allDay: true
        }]
    });

    var $appointment = $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0);

    $appointment.trigger(dragEvents.start);
    $(this.instance.$element()).find(".dx-scheduler-date-table-cell").eq(0).trigger(dragEvents.enter);
    $appointment.trigger(dragEvents.end);

    this.clock.tick();
    var workspace = $(this.instance.$element()).find(".dx-scheduler-work-space").dxSchedulerWorkSpaceWeek("instance");

    assert.equal(workspace.option("allDayExpanded"), false);
});

QUnit.test("Tail of long appointment should have a right width", function(assert) {
    this.createInstance({
        dataSource: [
            { text: "Task 1", startDate: new Date(2015, 8, 12), endDate: new Date(2015, 8, 22, 10) }
        ],
        currentDate: new Date(2015, 8, 22),
        views: ["week"],
        currentView: "week",
        firstDayOfWeek: 1
    });

    var $appointment = $(this.instance.$element()).find(".dx-scheduler-work-space .dx-scheduler-appointment").eq(0),
        $cell = $(this.instance.$element()).find(".dx-scheduler-work-space .dx-scheduler-date-table-cell").eq(0);

    assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * 2, 1.001, "Task has a right width");
});


QUnit.test("All-day appointment should save duration after resize operation", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        currentView: "week",
        firstDayOfWeek: 1,
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 1, 10),
            endDate: new Date(2015, 1, 13),
            allDay: true
        }]
    });

    var $appointment = $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0),
        appointmentWidth = $appointment.outerWidth();

    $(this.instance.$element()).find(".dx-scheduler-all-day-table-cell").eq(0).trigger(dragEvents.enter);
    $appointment.trigger(dragEvents.start).trigger(dragEvents.end);

    assert.roughEqual(this.instance.$element().find(".dx-scheduler-appointment").eq(0).outerWidth(), appointmentWidth, 0.1, "Width is OK");
});

QUnit.test("Appointment should have right position while dragging, after change allDay property", function(assert) {
    var appointment = {
            text: "a",
            startDate: new Date(2015, 1, 9, 7),
            allDay: true
        },
        newAppointment = {
            text: "a",
            startDate: new Date(2015, 1, 9, 7),
            endDate: new Date(2015, 1, 9, 8),
            allDay: false
        };

    this.createInstance({
        height: 500,
        currentDate: new Date(2015, 1, 9),
        currentView: "week",
        editing: true,
        dataSource: [appointment]
    });

    this.instance.updateAppointment(appointment, newAppointment);

    var $appointment = $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0),
        scrollable = this.instance.getWorkSpace().$element().find(".dx-scrollable").dxScrollable("instance"),
        allDayHeight = $(this.instance.$element()).find(".dx-scheduler-all-day-table-cell").first().outerHeight(),
        scrollDistance = 400,
        dragDistance = -300,
        headerPanelHeight = $(this.instance.$element()).find(".dx-scheduler-header-panel").outerHeight(true);

    scrollable.scrollBy(scrollDistance);

    var pointer = pointerMock($appointment).start(),
        startPosition = translator.locate($appointment);

    pointer.dragStart().drag(0, dragDistance);

    var currentPosition = translator.locate($appointment);

    assert.equal(startPosition.top, currentPosition.top + scrollDistance - allDayHeight - dragDistance - headerPanelHeight, "Appointment position is correct");
    pointer.dragEnd();
});

QUnit.test("AllDay appointment should have right position while dragging from allDay panel", function(assert) {
    var appointment = {
        text: "a",
        startDate: new Date(2015, 1, 9, 7),
        endDate: new Date(2015, 1, 9, 7, 30),
        allDay: true
    };

    this.createInstance({
        height: 500,
        currentDate: new Date(2015, 1, 9),
        currentView: "week",
        editing: true,
        dataSource: [appointment]
    });

    var $appointment = $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0),
        dragDistance = 300,
        headerPanelHeight = $(this.instance.$element()).find(".dx-scheduler-header-panel").outerHeight(true);

    var pointer = pointerMock($appointment).start(),
        startPosition = translator.locate($appointment);

    pointer.dragStart().drag(0, dragDistance);

    var currentPosition = translator.locate($appointment);

    assert.equal(startPosition.top, currentPosition.top - dragDistance - headerPanelHeight, "Appointment position is correct");
    pointer.dragEnd();
});

QUnit.test("AllDay appointment width should be decreased if it greater than work space width (grouped mode, day view)", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 4, 10),
        views: ["day"],
        currentView: "day",
        dataSource: [{
            startDate: new Date(2015, 4, 10),
            endDate: new Date(2015, 4, 12),
            ownerId: [1, 2],
            allDay: true
        }],
        groups: ["ownerId"],
        resources: [
            {
                field: "ownerId",
                label: "o",
                allowMultiple: true,
                dataSource: [
                    {
                        text: "a",
                        id: 1
                    },
                    {
                        text: "b",
                        id: 2
                    }
                ]
            }
        ]
    });

    var $appointment1 = $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0),
        $appointment2 = $(this.instance.$element()).find(".dx-scheduler-appointment").eq(1),
        $cell = $(this.instance.$element()).find(".dx-scheduler-date-table-cell");

    assert.roughEqual($appointment1.outerWidth(), Math.floor($cell.outerWidth()), 1.001, "Appointment width is OK");
    assert.roughEqual($appointment2.outerWidth(), Math.floor($cell.outerWidth()), 1.001, "Appointment width is OK");
});

QUnit.test("All-day appointment inside grouped view should have a right resizable area", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 6, 10),
        views: ["week"],
        currentView: "week",
        editing: true,
        dataSource: [{
            text: "a",
            allDay: true,
            startDate: new Date(2015, 6, 10, 0),
            endDate: new Date(2015, 6, 10, 0, 30),
            ownerId: 1
        }, {
            text: "b",
            allDay: true,
            startDate: new Date(2015, 6, 10, 0),
            endDate: new Date(2015, 6, 10, 0, 30),
            ownerId: 2
        }, {
            text: "c",
            startDate: new Date(2015, 6, 10, 2),
            endDate: new Date(2015, 6, 10, 2, 30),
            ownerId: 2
        }
        ],
        groups: ["ownerId"],
        resources: [
            {
                field: "ownerId",
                dataSource: [
                    { id: 1, text: "one" },
                    { id: 2, text: "two" }
                ]
            }
        ]
    });

    var $appointments = $(this.instance.$element()).find(".dx-scheduler-appointment"),
        area1 = $appointments.eq(0).dxResizable("instance").option("area"),
        area2 = $appointments.eq(1).dxResizable("instance").option("area"),
        area3 = $appointments.eq(2).dxResizable("instance").option("area"),
        $cells = $(this.instance.$element()).find(".dx-scheduler-date-table-cell"),
        halfOfCellWidth = 0.5 * $cells.eq(0).outerWidth();

    assert.roughEqual(area1.left, $cells.eq(0).offset().left - halfOfCellWidth, 1.001);
    assert.roughEqual(area1.right, $cells.eq(7).offset().left + halfOfCellWidth, 1.001);

    assert.roughEqual(area2.left, $cells.eq(7).offset().left - halfOfCellWidth, 1.001);
    assert.roughEqual(area2.right, $cells.eq(13).offset().left + 3 * halfOfCellWidth - 1, 1.001);

    assert.deepEqual(area3.get(0), this.instance.getWorkSpace().$element().find(".dx-scrollable-content").get(0), "Area is OK");
});

QUnit.test("All-day appointment inside grouped view should have a right resizable area: rtl mode", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 6, 10),
        views: ["week"],
        currentView: "week",
        editing: true,
        rtlEnabled: true,
        dataSource: [{
            text: "a",
            allDay: true,
            startDate: new Date(2015, 6, 10, 0),
            endDate: new Date(2015, 6, 10, 0, 30),
            ownerId: 1
        }],
        groups: ["ownerId"],
        resources: [
            {
                field: "ownerId",
                dataSource: [
                    { id: 1, text: "one" },
                    { id: 2, text: "two" }
                ]
            }
        ]
    });

    var $appointments = $(this.instance.$element()).find(".dx-scheduler-appointment"),
        area = $appointments.eq(0).dxResizable("instance").option("area"),
        $cells = $(this.instance.$element()).find(".dx-scheduler-date-table-cell"),
        halfOfCellWidth = 0.5 * $cells.eq(0).outerWidth();

    assert.roughEqual(area.left, $cells.eq(7).offset().left + halfOfCellWidth, 1.001);
    assert.roughEqual(area.right, $cells.eq(0).offset().left + 3 * halfOfCellWidth, 1.001);
});

QUnit.test("Many grouped allDay dropDown appts should be grouped correctly (T489535)", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 4, 25),
        views: ["week"],
        currentView: "week",
        groups: ["ownerId"],
        resources: [
            {
                field: "ownerId",
                dataSource: [
                    { id: 1, text: "one" },
                    { id: 2, text: "two" }
                ]
            }
        ]
    });

    this.instance.option("dataSource", [
        { text: '1', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 1 },
        { text: '2', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 1 },
        { text: '3', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 1 },
        { text: '4', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 1 },
        { text: '5', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 1 },
        { text: '6', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 2 },
        { text: '7', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 2 },
        { text: '8', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 2 },
        { text: '9', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 2 },
        { text: '10', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 2 }
    ]);

    var firstGroupDropDown = $(this.instance.$element()).find(".dx-scheduler-dropdown-appointments").eq(0).dxDropDownMenu("instance"),
        secondGroupDropDown = $(this.instance.$element()).find(".dx-scheduler-dropdown-appointments").eq(1).dxDropDownMenu("instance");

    firstGroupDropDown.open();
    var firstDdAppointments = firstGroupDropDown._list.$element().find(".dx-scheduler-dropdown-appointment");

    assert.equal(firstDdAppointments.length, 3, "There are 3 drop down appts in 1st group");

    secondGroupDropDown.open();
    var secondDdAppointments = secondGroupDropDown._list.$element().find(".dx-scheduler-dropdown-appointment");

    assert.equal(secondDdAppointments.length, 3, "There are 3 drop down appts in 2d group");
});

QUnit.test("DropDown appointment should be removed correctly when needed", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 4, 25),
        views: ["week"],
        currentView: "week"
    });

    var items = [
        { text: '1', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '2', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '3', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '4', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '5', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '6', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '7', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '8', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true }
    ];

    this.instance.option("dataSource", items);

    var $dropDown = this.instance.$element().find(".dx-scheduler-dropdown-appointments");
    assert.equal($dropDown.length, 1, "Dropdown appointment was rendered");

    this.instance.deleteAppointment(items[7]);

    $dropDown = this.instance.$element().find(".dx-scheduler-dropdown-appointments");
    assert.equal($dropDown.length, 0, "Dropdown appointment was removed");
});

QUnit.test("If there are not groups, '.dx-scrollable-content' should be a resizable area for all-day appointment", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 6, 10),
        views: ["week"],
        currentView: "week",
        editing: true,
        rtlEnabled: true,
        dataSource: [{
            text: "a",
            allDay: true,
            startDate: new Date(2015, 6, 10, 0),
            endDate: new Date(2015, 6, 10, 0, 30)
        }]
    });

    var $appointments = $(this.instance.$element()).find(".dx-scheduler-appointment"),
        $area = $appointments.eq(0).dxResizable("instance").option("area");

    assert.deepEqual($area.get(0), this.instance.getWorkSpace().$element().find(".dx-scrollable-content").get(0), "Area is OK");
});

QUnit.test("New allDay appointment should have correct height", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({
        currentDate: new Date(2015, 2, 10),
        dataSource: data,
        currentView: "week",
        showAllDayPanel: true
    });

    var newItem = { startDate: new Date(2015, 2, 10, 1), allDay: true, text: "caption", endDate: new Date(2015, 2, 10, 1, 30) };

    this.instance.showAppointmentPopup(newItem, true);
    $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

    var $addedAppointment = $(this.instance.$element()).find(".dx-scheduler-all-day-appointment").eq(0),
        $allDayCell = $(this.instance.$element()).find(".dx-scheduler-all-day-table-cell").eq(0);

    assert.equal($addedAppointment.outerHeight(), $allDayCell.get(0).getBoundingClientRect().height, "Appointment has correct height");
});

QUnit.test("showAllDayPanel option of workSpace should be updated after adding allDay appointment", function(assert) {
    var data = new DataSource({
            store: this.tasks
        }),
        newItem = { startDate: new Date(2015, 1, 9, 1), allDay: true, text: "caption" };

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data });
    this.instance.showAppointmentPopup(newItem);

    $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

    var workspace = $(this.instance.$element()).find(".dx-scheduler-work-space").dxSchedulerWorkSpaceDay("instance");

    assert.equal(workspace.option("showAllDayPanel"), true, "allDay panel is visible after adding allDay task");
});

QUnit.test("all-day-collapsed class of workSpace should be removed after adding allDay appointment", function(assert) {
    var data = new DataSource({
            store: this.tasks
        }),
        newItem = { startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 1, 30), allDay: true, text: "caption" };

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data });

    var $workspace = $(this.instance.$element()).find(".dx-scheduler-work-space");

    assert.ok($workspace.hasClass("dx-scheduler-work-space-all-day-collapsed"), "Work space has specific class");

    this.instance.showAppointmentPopup(newItem, true);
    $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

    assert.notOk($workspace.hasClass("dx-scheduler-work-space-all-day-collapsed"), "Work space has not specific class");
});

QUnit.test("AllDay appointment is visible on month view, if showAllDayPanel = false ", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 2, 10),
        dataSource: [{
            startDate: new Date(2015, 2, 10, 1),
            allDay: true,
            text: "caption",
            endDate: new Date(2015, 2, 10, 1, 30)
        }],
        currentView: "week",
        views: ["day", "week", "month"],
        showAllDayPanel: false
    });

    assert.equal(this.instance.$element().find(".dx-scheduler-all-day-appointment").length, 0, "AllDay appointments are not visible on 'week' view");

    this.instance.option("currentView", "month");

    assert.equal(this.instance.$element().find(".dx-scheduler-appointment").length, 1, "AllDay appointments are visible on 'month' view");
});

QUnit.test("AllDay appointment should have correct height", function(assert) {
    var appointment = { startDate: new Date(2015, 2, 10, 1), endDate: new Date(2015, 2, 10, 1, 30), allDay: true, text: "caption" };

    this.createInstance({
        currentDate: new Date(2015, 2, 10),
        dataSource: [appointment],
        currentView: "week",
        showAllDayPanel: true
    });

    var appointmentHeight = $(this.instance.$element()).find(".dx-scheduler-all-day-appointment").outerHeight(),
        allDayPanelHeight = $(this.instance.$element()).find(".dx-scheduler-all-day-table-cell").eq(0).get(0).getBoundingClientRect().height;

    assert.equal(appointmentHeight, allDayPanelHeight, "Appointment height is correct on init");

    this.instance.option("currentDate", new Date(2015, 2, 17));
    this.instance.option("currentDate", new Date(2015, 2, 10));

    assert.equal(this.instance.$element().find(".dx-scheduler-all-day-appointment").outerHeight(), appointmentHeight, "Appointment height is correct");
});

QUnit.test("Multi-day appointment parts should be displayed correctly in allDay panel", function(assert) {
    var appointment = { startDate: new Date(2015, 3, 5, 0), endDate: new Date(2015, 3, 6, 7), text: "caption" };

    this.createInstance({
        currentDate: new Date(2015, 3, 6),
        dataSource: [appointment],
        firstDayOfWeek: 1,
        endDayHour: 10,
        currentView: "day",
        showAllDayPanel: true
    });

    var $appointments = $(this.instance.$element()).find(".dx-scheduler-all-day-appointments .dx-scheduler-appointment");

    assert.ok($appointments.length, "Appointment is displayed correctly in right place");
});

QUnit.test("AllDay appointment should have correct height after changing view", function(assert) {
    var appointment = { startDate: new Date(2015, 2, 5, 1), endDate: new Date(2015, 2, 5, 1, 30), allDay: true, text: "caption" };

    this.createInstance({
        currentDate: new Date(2015, 2, 4),
        dataSource: [appointment],
        currentView: "week",
        showAllDayPanel: true
    });

    var allDayPanelHeight = $(this.instance.$element()).find(".dx-scheduler-all-day-table-cell").eq(0).get(0).getBoundingClientRect().height;

    this.instance.option("currentView", "day");
    this.instance.option("currentView", "week");

    assert.equal(this.instance.$element().find(".dx-scheduler-all-day-appointment").outerHeight(), allDayPanelHeight, "Appointment height is correct");
});

QUnit.test("allDay panel should be expanded when there are long appointments without allDay", function(assert) {
    var appointment = { startDate: new Date(2015, 2, 5, 1), endDate: new Date(2015, 2, 5, 3), text: "caption" },
        newAppointment = { startDate: new Date(2015, 2, 5, 1), endDate: new Date(2015, 2, 8, 3), text: "caption" };

    this.createInstance({
        currentDate: new Date(2015, 2, 4),
        dataSource: [appointment],
        currentView: "week",
        showAllDayPanel: true
    });

    this.instance.updateAppointment(appointment, newAppointment);
    var $workspace = $(this.instance.$element()).find(".dx-scheduler-work-space");

    assert.notOk($workspace.hasClass("dx-scheduler-work-space-all-day-collapsed"), "AllDay panel is expanded");
});

QUnit.test("boundOffset of non allDay appointments should be recalculated", function(assert) {
    var newItem = {
        text: "b",
        startDate: new Date(2015, 1, 11, 0),
        endDate: new Date(2015, 1, 11, 0, 30),
        allDay: true
    };

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        currentView: "week",
        editing: true,
        firstDayOfWeek: 0,
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 1, 9, 0),
            endDate: new Date(2015, 1, 9, 0, 30)
        }]
    });

    var $allDayPanel = $(this.instance.$element()).find(".dx-scheduler-all-day-table-cell").eq(0),
        $a = $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0),
        $b;

    assert.equal($a.dxDraggable("instance").option("boundOffset").top, -$allDayPanel.outerHeight(), "Bound offset is correct");

    this.instance.addAppointment(newItem);

    $a = $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0);
    $b = $(this.instance.$element()).find(".dx-scheduler-appointment").eq(1);

    assert.equal($a.dxDraggable("instance").option("boundOffset").top, -$allDayPanel.outerHeight(), "Bound offset is correct");
    assert.equal($b.dxDraggable("instance").option("boundOffset").top, -$allDayPanel.outerHeight(), "Bound offset is correct");
});

QUnit.test("allDay panel should be expanded after adding allDay appointment via api", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        currentView: "week",
        firstDayOfWeek: 0,
        dataSource: []
    });

    this.instance.addAppointment({
        text: "a",
        startDate: new Date(2015, 1, 11, 0),
        endDate: new Date(2015, 1, 11, 0, 30)
    });

    var workspace = this.instance.getWorkSpace();
    assert.notOk(workspace.option("allDayExpanded"), "allDay panel is not expanded");

    this.instance.addAppointment({
        text: "b",
        startDate: new Date(2015, 1, 11, 0),
        endDate: new Date(2015, 1, 11, 0, 30),
        allDay: true
    });

    assert.ok(workspace.option("allDayExpanded"), "allDay panel is expanded");
});

QUnit.test("allDay panel should be expanded after adding long appointment via api", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        currentView: "week",
        firstDayOfWeek: 0,
        dataSource: []
    });

    var workspace = this.instance.getWorkSpace();

    this.instance.addAppointment({
        text: "b",
        startDate: new Date(2015, 1, 11, 0),
        endDate: new Date(2015, 4, 11, 0)
    });

    assert.ok(workspace.option("allDayExpanded"), "allDay panel is expanded");
});

QUnit.test("all-day-appointment should have a correct height when the 'showAllDayPanel' option was changed", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        currentView: "week",
        firstDayOfWeek: 0,
        dataSource: [{ startDate: new Date(2015, 1, 9), allDay: true }]
    });

    var appointmentHeight = $(this.instance.$element()).find(".dx-scheduler-appointment").first().outerHeight();
    this.instance.option("showAllDayPanel", false);
    this.instance.option("showAllDayPanel", true);

    assert.equal(this.instance.$element().find(".dx-scheduler-appointment").first().outerHeight(), appointmentHeight, "appointment height is correct");
});

QUnit.test("long appointment should not be rendered if 'showAllDayPanel' = false", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        currentView: "week",
        firstDayOfWeek: 0,
        dataSource: [{ startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 12) }]
    });

    this.instance.option("showAllDayPanel", false);

    assert.notOk(this.instance.$element().find(".dx-scheduler-appointment").length, "long appointment was not rendered");
});

QUnit.test("AllDay panel should be displayed correctly on init with custom store", function(assert) {
    var data = [{
        text: "a", allDay: true, startDate: new Date(2015, 3, 16), endDate: new Date(2015, 3, 17)
    }];

    this.createInstance({
        currentDate: new Date(2015, 3, 16),
        firstDayOfWeek: 1,
        currentView: "week",
        dataSource: new DataSource({
            store: new CustomStore({
                load: function() {
                    var d = $.Deferred();
                    setTimeout(function() {
                        d.resolve(data);
                    }, 300);

                    return d.promise();
                }
            })
        })
    });

    var workspace = this.instance.getWorkSpace();
    this.clock.tick(300);

    assert.ok(workspace.option("allDayExpanded"), "allDay panel is expanded");
});

QUnit.test("AllDay panel should be displayed correctly after changing view with custom store", function(assert) {
    var data = [{
        text: "a", allDay: true, startDate: new Date(2015, 2, 5)
    }];

    this.createInstance({
        currentDate: new Date(2015, 2, 4),
        currentView: "week",
        dataSource: new DataSource({
            store: new CustomStore({
                load: function(options) {
                    var d = $.Deferred();
                    setTimeout(function() {
                        d.resolve(Query([data[0]]).filter(options.filter).toArray());
                    }, 300);

                    return d.promise();
                }
            })
        })
    });

    this.clock.tick(300);
    this.instance.option("currentView", "day");
    this.clock.tick(300);

    var workspace = this.instance.getWorkSpace();
    assert.notOk(workspace.option("allDayExpanded"), "allDay panel is not expanded");
});

QUnit.test("AllDay appointment should be displayed correctly after changing view with custom store", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 2, 4),
        currentView: "day",
        dataSource: new DataSource({
            store: new CustomStore({
                load: function(options) {
                    var d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([{
                            text: "a",
                            allDay: true,
                            startDate: new Date(2015, 2, 5),
                            endDate: new Date(2015, 2, 5, 0, 30)
                        }]);
                    }, 300);

                    return d.promise();
                }
            })
        })
    });

    this.clock.tick(300);
    this.instance.option("currentView", "week");
    this.clock.tick(300);

    var allDayPanelHeight = $(this.instance.$element()).find(".dx-scheduler-all-day-table-cell").eq(0).get(0).getBoundingClientRect().height,
        $appointment = $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0);

    assert.equal($appointment.outerHeight(), allDayPanelHeight, "Appointment height is correct");
});

QUnit.test("AllDay appointment should be displayed correctly after changing date with custom store", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 2, 4),
        currentView: "day",
        dataSource: new DataSource({
            store: new CustomStore({
                load: function(options) {
                    var d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([{
                            text: "a",
                            allDay: true,
                            startDate: new Date(2015, 2, 5),
                            endDate: new Date(2015, 2, 5, 0, 30)
                        }]);
                    }, 300);

                    return d.promise();
                }
            })
        })
    });

    this.clock.tick(300);
    this.instance.option("currentDate", new Date(2015, 2, 5));
    this.clock.tick(300);

    var allDayPanelHeight = $(this.instance.$element()).find(".dx-scheduler-all-day-table-cell").eq(0).get(0).getBoundingClientRect().height,
        $appointment = $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0);

    assert.roughEqual($appointment.outerHeight(), allDayPanelHeight, 2, "Appointment height is correct");
});

QUnit.test("Multi-day appointment parts should have allDay class", function(assert) {
    var appointment = { startDate: new Date(2015, 1, 4, 0), endDate: new Date(2015, 1, 10, 0), text: "long appointment" };

    this.createInstance({
        currentDate: new Date(2015, 1, 5),
        dataSource: [appointment],
        currentView: "day"
    });

    var $appointment = $(this.instance.$element()).find(".dx-scheduler-all-day-appointments .dx-scheduler-appointment").eq(0);

    assert.ok($appointment.hasClass("dx-scheduler-all-day-appointment"), "Appointment part has allDay class");
});

QUnit.test("Multi-day appointment parts should have correct reduced class", function(assert) {
    var appointment = { startDate: new Date(2015, 1, 4, 0), endDate: new Date(2015, 1, 7, 0), text: "long appointment" };

    this.createInstance({
        currentDate: new Date(2015, 1, 5),
        dataSource: [appointment],
        currentView: "day"
    });

    var $appointment = this.instance.$element().find(".dx-scheduler-all-day-appointments .dx-scheduler-appointment").eq(0);

    assert.ok($appointment.hasClass("dx-scheduler-appointment-head"), "Appointment part has reduced class");

    this.instance.option("currentDate", new Date(2015, 1, 6));

    $appointment = this.instance.$element().find(".dx-scheduler-all-day-appointments .dx-scheduler-appointment").eq(0);

    assert.notOk($appointment.hasClass("dx-scheduler-appointment-head"), "Appointment part hasn't reduced class. It is tail");
});

QUnit.test("AllDay recurrent appointment should be rendered coorectly after changing currentDate", function(assert) {
    var appointment = {
        text: "Appointment",
        recurrenceRule: "FREQ=DAILY",
        allDay: true,
        startDate: new Date(2015, 4, 25),
        endDate: new Date(2015, 4, 25, 0, 30)
    };

    this.createInstance({
        currentDate: new Date(2015, 4, 25),
        dataSource: [appointment],
        currentView: "week"
    });

    this.instance.option("currentDate", new Date(2015, 4, 31));

    var $appointment = $(this.instance.$element()).find(".dx-scheduler-all-day-appointments .dx-scheduler-appointment").eq(0),
        cellHeight = $(this.instance.$element()).find(".dx-scheduler-all-day-table-cell").outerHeight(),
        cellWidth = $(this.instance.$element()).find(".dx-scheduler-all-day-table-cell").outerWidth();

    assert.equal($appointment.outerWidth(), cellWidth, "Appointment width is OK");
    assert.equal($appointment.outerHeight(), cellHeight, "Appointment height is OK");
});

QUnit.test("DblClick on appointment should call scheduler.showAppointmentPopup for allDay appointment on month view", function(assert) {
    var data = [{
        text: "a", allDay: true, startDate: new Date(2015, 2, 5), endDate: new Date(2015, 2, 5, 0, 30)
    }];

    this.createInstance({
        currentDate: new Date(2015, 2, 4),
        currentView: "month",
        dataSource: data
    });

    this.clock.tick();

    var spy = sinon.spy(this.instance, "showAppointmentPopup");

    $(this.instance.$element()).find(".dx-scheduler-appointment").eq(0).trigger(dblclickEvent.name);

    assert.ok(spy.calledOnce, "Method was called");
});

QUnit.test("AllDay appointment has right startDate and endDate", function(assert) {

    this.createInstance({
        currentDate: new Date(2015, 2, 4),
        currentView: "week"
    });
    this.instance.showAppointmentPopup({ startDate: new Date(2015, 2, 5, 6), endDate: new Date(2015, 2, 6, 7), text: "a", allDay: true });

    var $popupContent = $(".dx-scheduler-appointment-popup .dx-popup-content"),
        startDate = $popupContent.find(".dx-datebox").eq(0).dxDateBox("instance"),
        endDate = $popupContent.find(".dx-datebox").eq(1).dxDateBox("instance");

    assert.equal(startDate.option("type"), "date", "type is right");
    assert.equal(endDate.option("type"), "date", "type is right");
});

QUnit.test("All-day & common appointments should have a right sorting", function(assert) {
    this.createInstance({
        currentDate: new Date(2016, 1, 10),
        currentView: "day",
        width: 800,
        dataSource: [
            {
                text: "Full 1",
                startDate: new Date(2016, 1, 10, 9, 0),
                endDate: new Date(2016, 1, 10, 11, 30),
                allDay: true
            }, {
                text: "Full 2",
                startDate: new Date(2016, 1, 10, 12, 0),
                endDate: new Date(2016, 1, 10, 13, 0),
                allDay: true
            },
            {
                text: "Short 1",
                startDate: new Date(2016, 1, 10, 12, 0),
                endDate: new Date(2016, 1, 10, 13, 0),
                allDay: true
            },

            {
                text: "Short 2",
                startDate: new Date(2016, 1, 10, 12, 0),
                endDate: new Date(2016, 1, 10, 13, 0),
                allDay: true
            }, {
                text: "Short 3",
                startDate: new Date(2016, 1, 10, 12, 0),
                endDate: new Date(2016, 1, 10, 13, 0),
                allDay: true
            },
            {
                text: "Short 4",
                startDate: new Date(2016, 1, 10, 12, 0),
                endDate: new Date(2016, 1, 10, 13, 0),
                allDay: true
            },
            {
                text: "Simple appointment",
                startDate: new Date(2016, 1, 10, 1),
                endDate: new Date(2016, 1, 10, 2)
            }
        ]
    });

    var $element = $(this.instance.$element()),
        $appointments = $element.find(".dx-scheduler-appointment-compact"),
        $simpleAppointment = $element.find(".dx-scheduler-appointment").last(),
        cellWidth = $element.find(".dx-scheduler-date-table-cell").outerWidth(),
        offset = getOffset();

    assert.equal(dataUtils.data($appointments.get(0), "dxItemData").text, "Short 1", "Data is right");
    assert.equal(dataUtils.data($appointments.get(1), "dxItemData").text, "Short 2", "Data is right");
    assert.equal(dataUtils.data($appointments.get(2), "dxItemData").text, "Short 3", "Data is right");
    assert.equal(dataUtils.data($appointments.get(3), "dxItemData").text, "Short 4", "Data is right");

    assert.roughEqual(translator.locate($simpleAppointment).left, 100, 1.001, "Appointment position is OK");
    assert.roughEqual($simpleAppointment.outerWidth(), cellWidth - offset, 1.001, "Appointment size is OK");
});

QUnit.test("All-day appointments should have a right sorting", function(assert) {
    this.createInstance({
        currentDate: new Date(2016, 1, 10),
        currentView: "day",
        width: 800,
        dataSource: [
            {
                text: "Full 1",
                startDate: new Date(2016, 1, 10, 9, 0),
                endDate: new Date(2016, 1, 10, 11, 30),
                allDay: true
            }, {
                text: "Full 2",
                startDate: new Date(2016, 1, 10, 12, 0),
                endDate: new Date(2016, 1, 10, 13, 0),
                allDay: true
            },
            {
                text: "Short 1",
                startDate: new Date(2016, 1, 10, 12, 0),
                endDate: new Date(2016, 1, 10, 13, 0),
                allDay: true
            },

            {
                text: "Short 2",
                startDate: new Date(2016, 1, 10, 12, 0),
                endDate: new Date(2016, 1, 10, 13, 0),
                allDay: true
            }, {
                text: "Short 3",
                startDate: new Date(2016, 1, 10, 12, 0),
                endDate: new Date(2016, 1, 10, 13, 0),
                allDay: true
            },
            {
                text: "Short 4",
                startDate: new Date(2016, 1, 10, 12, 0),
                endDate: new Date(2016, 1, 10, 13, 0),
                allDay: true
            }
        ]
    });

    var $element = $(this.instance.$element()),
        $appointments = $element.find(".dx-scheduler-appointment-compact");

    assert.equal(dataUtils.data($appointments.get(0), "dxItemData").text, "Short 1", "Data is right");
    assert.equal(dataUtils.data($appointments.get(1), "dxItemData").text, "Short 2", "Data is right");
    assert.equal(dataUtils.data($appointments.get(2), "dxItemData").text, "Short 3", "Data is right");
    assert.equal(dataUtils.data($appointments.get(3), "dxItemData").text, "Short 4", "Data is right");
});

QUnit.test("dropDown appointment should have correct container & position", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 4, 25),
        views: ["week"],
        currentView: "week"
    });

    this.instance.option("dataSource", [
        { text: '1', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '2', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '3', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '4', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '5', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '6', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '7', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '8', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '9', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '10', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true }
    ]);

    var $dropDown = $(this.instance.$element()).find(".dx-scheduler-dropdown-appointments").eq(0);

    assert.equal($dropDown.parent().get(0), $(this.instance.$element()).find(".dx-scheduler-all-day-appointments").get(0), "Container is OK");
    assert.roughEqual(translator.locate($dropDown).left, 228, 1.001, "Appointment position is OK");
    assert.roughEqual(translator.locate($dropDown).top, 0, 1.001, "Appointment position is OK");
});

QUnit.test("dropDown appointment should not have compact class on allDay panel", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 4, 25),
        views: ["week"],
        currentView: "week"
    });

    this.instance.option("dataSource", [
        { text: '1', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '2', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '3', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '4', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '5', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '6', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '7', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '8', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '9', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
        { text: '10', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true }
    ]);

    var $dropDown = $(this.instance.$element()).find(".dx-scheduler-dropdown-appointments").eq(0);

    assert.notOk($dropDown.hasClass("dx-scheduler-dropdown-appointments-compact"), "class is ok");
});

QUnit.test("AllDay appointments should have correct height, groupOrientation = vertical", function(assert) {
    var appointments = [
        { ownerId: 1, startDate: new Date(2015, 2, 10, 1), endDate: new Date(2015, 2, 10, 1, 30), allDay: true, text: "caption1" },
        { ownerId: 2, startDate: new Date(2015, 2, 10, 1), endDate: new Date(2015, 2, 10, 1, 30), allDay: true, text: "caption2" }];

    this.createInstance({
        currentDate: new Date(2015, 2, 10),
        dataSource: appointments,
        groupOrientation: "vertical",
        currentView: "day",
        showAllDayPanel: true,
        groups: ["ownerId"],
        resources: [
            {
                field: "ownerId",
                label: "o",
                allowMultiple: true,
                dataSource: [
                    {
                        text: "a",
                        id: 1
                    },
                    {
                        text: "b",
                        id: 2
                    }
                ]
            }
        ]
    });

    var allDayPanelHeight = $(this.instance.$element()).find(".dx-scheduler-all-day-table-cell").eq(0).get(0).getBoundingClientRect().height;

    assert.equal($(this.instance.$element()).find(".dx-scheduler-all-day-appointment").eq(0).outerHeight(), allDayPanelHeight, "First appointment height is correct on init");
    assert.equal($(this.instance.$element()).find(".dx-scheduler-all-day-appointment").eq(1).outerHeight(), allDayPanelHeight, "Second appointment height is correct on init");
});

QUnit.test("AllDay appointments should have correct position, groupOrientation = vertical", function(assert) {
    var appointments = [
        { ownerId: 1, startDate: new Date(2015, 2, 10, 1), endDate: new Date(2015, 2, 10, 1, 30), allDay: true, text: "caption1" },
        { ownerId: 2, startDate: new Date(2015, 2, 10, 1), endDate: new Date(2015, 2, 10, 1, 30), allDay: true, text: "caption2" }];

    this.createInstance({
        dataSource: appointments,
        currentDate: new Date(2015, 2, 10),
        groupOrientation: "vertical",
        currentView: "day",
        showAllDayPanel: true,
        groups: ["ownerId"],
        resources: [
            {
                field: "ownerId",
                label: "o",
                allowMultiple: true,
                dataSource: [
                    {
                        text: "a",
                        id: 1
                    },
                    {
                        text: "b",
                        id: 2
                    }
                ]
            }
        ]
    });

    var $element = $(this.instance.$element()),
        $appointments = $element.find(".dx-scheduler-appointment"),
        firstPosition = translator.locate($appointments.eq(0)),
        secondPosition = translator.locate($appointments.eq(1)),
        $allDayRows = $element.find(".dx-scheduler-all-day-table-row"),
        firstAllDayRowPosition = translator.locate($allDayRows.eq(0)),
        secondAllDayRowPosition = translator.locate($allDayRows.eq(1));

    assert.roughEqual(firstPosition.top, firstAllDayRowPosition.top, 1.5, "Appointment has correct top");
    assert.roughEqual(secondPosition.top, secondAllDayRowPosition.top, 1.5, "Appointment has correct top");
});
