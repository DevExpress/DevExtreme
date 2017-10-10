"use strict";

var $ = require("jquery"),
    fx = require("animation/fx"),
    pointerMock = require("../../../helpers/pointerMock.js"),
    translator = require("animation/translator");

require("ui/scheduler/ui.scheduler");

QUnit.module("Integration: Dragging from Tooltip", {
    beforeEach: function() {
        fx.off = true;
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
            },
            {
                text: "Task 3",
                startDate: new Date(2015, 1, 9, 13, 0),
                endDate: new Date(2015, 1, 9, 14, 0)
            }
        ];

        this.createInstance = function(options) {
            this.instance = $("#scheduler").dxScheduler($.extend(options, {
                editing: true,
                height: 600,
                views: ["month"],
                currentView: "month",
                dataSource: this.tasks,
                currentDate: new Date(2015, 1, 9)
            })).dxScheduler("instance");
        };

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test("Phantom appointment should be rendered after tooltip item dragStart", function(assert) {
    this.createInstance();

    var dropDown = this.instance.$element().find(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance");

    dropDown.open();
    var $ddAppointment = $(dropDown._list.$element().find(".dx-list-item").eq(0));

    var apptsInstance = this.instance.getAppointmentsInstance(),
        renderStub = sinon.stub(apptsInstance, "_renderItem");

    $ddAppointment.trigger("dxdragstart");
    assert.ok(renderStub.calledOnce, "Item was rendered");
});

QUnit.test("Phantom appointment should have correct appointmentData", function(assert) {
    this.createInstance();

    var dropDown = this.instance.$element().find(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance");

    dropDown.open();
    var $ddAppointment = $(dropDown._list.$element().find(".dx-list-item").eq(0));

    var apptsInstance = this.instance.getAppointmentsInstance(),
        renderStub = sinon.stub(apptsInstance, "_renderItem");

    $ddAppointment.trigger("dxdragstart");
    var phantomData = renderStub.getCall(0).args[1];

    assert.deepEqual(phantomData.itemData, this.tasks[2], "Data is OK");
    assert.equal(phantomData.settings[0].isCompact, false, "Some settings is OK");
    assert.equal(phantomData.settings[0].virtual, false, "Some settings is OK");
});

QUnit.test("Phantom appointment position should be recalculated during dragging tooltip item", function(assert) {
    this.createInstance();

    var dropDown = this.instance.$element().find(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance");

    dropDown.open();
    var $ddAppointment = $(dropDown._list.$element().find(".dx-list-item").eq(0));

    var pointer = pointerMock($ddAppointment).start().dragStart(),
        $phantomAppointment = this.instance.$element().find(".dx-scheduler-appointment").eq(0),
        initialPhantomPosition = translator.locate($phantomAppointment);

    pointer.drag(30, 60);

    var phantomPosition = translator.locate($phantomAppointment);
    assert.roughEqual(phantomPosition.top, initialPhantomPosition.top + 60 + 51, 1.5, "Phantom top is OK");
    assert.roughEqual(phantomPosition.left, initialPhantomPosition.left + 30, 1.5, "Phantom left is OK");

    pointer.dragEnd();
});

QUnit.test("Phantom appointment position should be corrected during dragging tooltip item", function(assert) {
    this.createInstance();

    var dropDown = this.instance.$element().find(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance");

    dropDown.open();
    var $ddAppointment = $(dropDown._list.$element().find(".dx-list-item").eq(0));

    var pointer = pointerMock($ddAppointment).start().dragStart(),
        $phantomAppointment = this.instance.$element().find(".dx-scheduler-appointment").eq(0),
        initialPhantomPosition = translator.locate($phantomAppointment);

    pointer.drag(30, 60);

    var correctCoordinatesStub = sinon.stub(this.instance.getAppointmentsInstance(), "notifyObserver").withArgs("correctAppointmentCoordinates");

    pointer.dragStart().drag(0, 0);

    assert.ok(correctCoordinatesStub.calledOnce, "Observers are notified");
    var args = correctCoordinatesStub.getCall(0).args;
    assert.deepEqual(args[1].coordinates, { left: initialPhantomPosition.left + 30, top: initialPhantomPosition.top + 60 }, "Arguments are OK");
    assert.deepEqual(args[1].allDay, undefined, "Arguments are OK");

    pointer.dragEnd();
});

QUnit.test("Recurrence appointment dragging should work correctly", function(assert) {
    var tasks = [
        {
            text: "Task 1",
            startDate: new Date(2015, 1, 9, 1, 0),
            endDate: new Date(2015, 1, 9, 2, 0)
        },
        {
            text: "Task 2",
            startDate: new Date(2015, 1, 9, 11, 0),
            endDate: new Date(2015, 1, 9, 12, 0)
        },
        {
            text: "Task 3",
            startDate: new Date(2015, 1, 7, 13, 0),
            endDate: new Date(2015, 1, 7, 14, 0),
            recurrenceRule: "FREQ=DAILY"
        }
    ];
    this.createInstance();
    this.instance.option("dataSource", tasks);

    var stub = sinon.stub(this.instance, "_checkRecurringAppointment");

    var dropDown = this.instance.$element().find(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance");
    dropDown.open();

    var $ddAppointment = $(dropDown._list.$element().find(".dx-list-item").eq(0)),
        pointer = pointerMock($ddAppointment).start().dragStart(),
        $phantomAppointment = this.instance.$element().find(".dx-scheduler-appointment").eq(0);

    assert.deepEqual($phantomAppointment.data("dxItemData").settings[0].startDate, new Date(2015, 1, 9, 13), "Date of phantom recurrence part is OK");

    pointer.drag(0, -100).dragEnd();

    assert.deepEqual(stub.getCall(0).args[2], new Date(2015, 1, 9, 0), "_checkRecurringAppointment has a right exceptionDate");
});
