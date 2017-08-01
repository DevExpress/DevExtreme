"use strict";

require("common.css!");
require("generic_light.css!");
require("ui/scheduler/ui.scheduler");

var $ = require("jquery"),
    keyboardMock = require("../../helpers/keyboardMock.js"),
    pointerMock = require("../../helpers/pointerMock.js"),
    translator = require("animation/translator"),
    SchedulerLayoutManager = require("ui/scheduler/ui.scheduler.appointments.layout_manager"),
    BaseAppointmentsStrategy = require("ui/scheduler/ui.scheduler.appointments.strategy.base"),
    HorizontalAppointmentsStrategy = require("ui/scheduler/ui.scheduler.appointments.strategy.horizontal"),
    HorizontalMonthLineAppointmentsStrategy = require("ui/scheduler/ui.scheduler.appointments.strategy.horizontal_month_line"),
    Color = require("color");

var APPOINTMENT_DEFAULT_OFFSET = 25;

var checkAppointmentUpdatedCallbackArgs = function(assert, actual, expected) {
    assert.deepEqual(actual.old, expected.old, "Old data is OK");
    assert.deepEqual(actual.updated, expected.updated, "New data is OK");
    assert.deepEqual(actual.$appointment.get(0), expected.$appointment.get(0), "Appointment element is OK");
};

QUnit.testStart(function() {
    $("#qunit-fixture").html('<div id="scheduler"></div>');
});

var moduleOptions = {
    beforeEach: function() {
        this.createInstance = function(options) {
            this.instance = $("#scheduler").dxScheduler($.extend(options, { editing: true })).dxScheduler("instance");
        };
    },
    afterEach: function() {
    }
};


QUnit.module("LayoutManager", moduleOptions);

QUnit.test("LayoutManager should be initialized", function(assert) {
    this.createInstance();
    assert.ok(this.instance.getLayoutManager() instanceof SchedulerLayoutManager, "SchedulerLayoutManager was initialized");
});

QUnit.test("RenderingStrategy should be initialized", function(assert) {
    this.createInstance();
    assert.ok(this.instance.getLayoutManager().getRenderingStrategyInstance() instanceof BaseAppointmentsStrategy, "SchedulerLayoutManager was initialized");
});

QUnit.test("Scheduler should have a right rendering strategy for timeline views", function(assert) {
    this.createInstance({
        views: ["timelineDay", "timelineWeek", "timelineWorkWeek", "timelineMonth"],
        currentView: "timelineDay"
    });

    assert.ok(this.instance.getRenderingStrategyInstance() instanceof HorizontalAppointmentsStrategy, "Strategy is OK");

    this.instance.option("currentView", "timelineWeek");
    assert.ok(this.instance.getRenderingStrategyInstance() instanceof HorizontalAppointmentsStrategy, "Strategy is OK");

    this.instance.option("currentView", "timelineWorkWeek");
    assert.ok(this.instance.getRenderingStrategyInstance() instanceof HorizontalAppointmentsStrategy, "Strategy is OK");

    this.instance.option("currentView", "timelineMonth");
    assert.ok(this.instance.getRenderingStrategyInstance() instanceof HorizontalMonthLineAppointmentsStrategy, "Strategy is OK");
});

QUnit.module("Appointments", moduleOptions);

QUnit.test("Exception should be thrown if appointment has no start date", function(assert) {
    this.createInstance();

    var layoutManager = this.instance.getLayoutManager();

    assert.throws(
        function() {
            layoutManager.createAppointmentsMap([{
                text: "Appointment 1"
            }]);
        },
        function(e) {
            return /E1032/.test(e.message);
        },
        "Exception messages should be correct"
    );
});

QUnit.test("Exception should be thrown if appointment has a broken start date", function(assert) {
    this.createInstance();

    var layoutManager = this.instance.getLayoutManager();

    assert.throws(
        function() {
            layoutManager.createAppointmentsMap([{
                text: "Appointment 1", startDate: "Invalid date format"
            }]);
        },
        function(e) {
            return /E1032/.test(e.message);
        },
        "Exception messages should be correct"
    );
});

QUnit.test("Default appointment duration should be equal to 30 minutes", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9)
    });

    var layoutManager = this.instance.getLayoutManager(),
        items = layoutManager.createAppointmentsMap([{ text: "Appointment 1", startDate: new Date(2015, 1, 9, 8) }]);

    assert.deepEqual(items[0].itemData.endDate, new Date(2015, 1, 9, 8, 30), "End date of appointment is 30 minutes");
});

QUnit.test("Appointment duration should be equal to 30 minutes if end date equal or lower than start date", function(assert) {
    this.createInstance();

    var layoutManager = this.instance.getLayoutManager(),
        items = layoutManager.createAppointmentsMap([
            { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 8) },
            { text: "Appointment 2", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 7) }
        ]);

    assert.deepEqual(items[0].itemData.endDate, new Date(2015, 1, 9, 8, 30), "End date is correct");
    assert.deepEqual(items[1].itemData.endDate, new Date(2015, 1, 9, 8, 30), "End date is correct");
});

QUnit.test("Appointment should have right default height", function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2016, 2, 1),
            dataSource: [{ startDate: new Date(2016, 2, 1, 1), endDate: new Date(2016, 2, 1, 2) }]
        }
    );

    var $appointment = $(this.instance.element().find(".dx-scheduler-appointment"));

    assert.equal($appointment.outerHeight(), 100, "Appointment has a right height");
});

QUnit.test("Appointment should have a correct height when dates are defined as not Date objects", function(assert) {
    this.createInstance(
        {
            currentDate: 1423458000000,
            dataSource: [{ text: "Appointment 1", startDate: 1423458000000, endDate: 1423461600000 }]
        }
    );

    var $appointment = $(this.instance.element().find(".dx-scheduler-appointment"));

    assert.equal($appointment.outerHeight(), 100, "Appointment has a right height");
});

QUnit.test("Appointment should have a correct min height", function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9, 8),
            dataSource: [
                {
                    startDate: new Date(2015, 1, 9, 8),
                    endDate: new Date(2015, 1, 9, 8, 1)
                }
            ]
        }
    );

    var $appointment = $(this.instance.element().find(".dx-scheduler-appointment"));

    assert.equal($appointment.outerHeight(), 2, "Appointment has a right height");
});

QUnit.test("Appointment has right sortedIndex", function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 9, 16),
            currentView: "month",
            focusStateEnabled: true,
            dataSource: [
                { text: "Appointment 1", startDate: new Date(2015, 9, 16, 9), endDate: new Date(2015, 9, 16, 11) },
                { text: "Appointment 2", startDate: new Date(2015, 9, 17, 8), endDate: new Date(2015, 9, 17, 10) },
                { text: "Appointment 3", startDate: new Date(2015, 9, 18, 8), endDate: new Date(2015, 9, 18, 10) },
                { text: "Appointment 4", startDate: new Date(2015, 9, 19, 8), endDate: new Date(2015, 9, 19, 10) }
            ]
        }
    );

    var $appointments = $(this.instance.element().find(".dx-scheduler-appointment"));

    assert.equal($appointments.eq(0).data("dxAppointmentSettings").sortedIndex, 0, "app has right sortedIndex");
    assert.equal($appointments.eq(1).data("dxAppointmentSettings").sortedIndex, 1, "app has right sortedIndex");
    assert.equal($appointments.eq(2).data("dxAppointmentSettings").sortedIndex, 2, "app has right sortedIndex");
    assert.equal($appointments.eq(3).data("dxAppointmentSettings").sortedIndex, 3, "app has right sortedIndex");
});

//NOTE: check sortedIndex for long appt parts
QUnit.test("Compact parts of long appointment shouldn't have sortedIndex", function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4, 2),
            focusStateEnabled: true,
            views: ["month"],
            currentView: "month",
            dataSource: [
                { text: "Appointment 1", startDate: new Date(2015, 2, 4, 2), endDate: new Date(2015, 2, 5, 3), allDay: true },
                { text: "Appointment 2", startDate: new Date(2015, 2, 4, 2), endDate: new Date(2015, 2, 5, 12), allDay: true },
                { text: "Appointment 3", startDate: new Date(2015, 2, 4, 2), endDate: new Date(2015, 2, 8, 2), allDay: true }
            ]
        }
    );

    var $appointments = $(this.instance.element().find(".dx-scheduler-appointment"));

    assert.equal($appointments.eq(0).data("dxAppointmentSettings").sortedIndex, 0, "app has sortedIndex");
    assert.equal($appointments.eq(1).data("dxAppointmentSettings").sortedIndex, 1, "app has sortedIndex");
    assert.equal($appointments.eq(2).data("dxAppointmentSettings").sortedIndex, 2, "app has sortedIndex");
    assert.equal($appointments.eq(3).data("dxAppointmentSettings").sortedIndex, null, "app has sortedIndex");
    assert.equal($appointments.eq(4).data("dxAppointmentSettings").sortedIndex, null, "app has sortedIndex");
    assert.equal($appointments.eq(5).data("dxAppointmentSettings").sortedIndex, null, "app has sortedIndex");
    assert.equal($appointments.eq(6).data("dxAppointmentSettings").sortedIndex, 3, "app has sortedIndex");

});

QUnit.test("AllDay appointment should be displayed right when endDate > startDate and duration < 24", function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 2, 5),
            currentView: "week",
            dataSource: [
                { text: "Appointment 1", startDate: new Date(2015, 2, 5, 10), endDate: new Date(2015, 2, 6, 6), allDay: true }
            ]
        }
    );

    var $appointment = $(this.instance.element().find(".dx-scheduler-appointment")),
        $allDayCell = $(this.instance.element().find(".dx-scheduler-all-day-table-cell"));

    assert.roughEqual($appointment.eq(0).outerWidth(), $allDayCell.eq(0).outerWidth() * 2, 1, "appointment has right width");
});

QUnit.test("Two rival appointments should have correct positions", function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: "month",
            height: 500,
            dataSource: [
                { text: "Appointment 1", startDate: new Date(2015, 1, 1, 8), endDate: new Date(2015, 1, 1, 10) },
                { text: "Appointment 1", startDate: new Date(2015, 1, 1, 8), endDate: new Date(2015, 1, 1, 10) }
            ]
        }
    );

    var $appointment = $(this.instance.element().find(".dx-scheduler-appointment")),
        $tableCell = $(this.instance.element().find(".dx-scheduler-date-table-cell").eq(0));

    assert.equal($appointment.length, 2, "All appointments are rendered");

    var firstAppointmentPosition = translator.locate($appointment.eq(0)),
        secondAppointmentPosition = translator.locate($appointment.eq(1));

    assert.equal(firstAppointmentPosition.left, 0, "appointment is rendered in right place");
    assert.roughEqual(firstAppointmentPosition.top, 26, 1.5, "appointment is rendered in right place");
    assert.equal($appointment.eq(0).outerWidth(), $tableCell.outerWidth(), "appointment has a right size");

    assert.equal(secondAppointmentPosition.left, 0, "appointment is rendered in right place");
    assert.roughEqual(secondAppointmentPosition.top, 46, 1.5, "appointment is rendered in right place");
    assert.equal($appointment.eq(1).outerWidth(), $tableCell.outerWidth(), "appointment has a right size");
});

QUnit.test("Collapsing appointments should have specific class", function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: "month",
            height: 500,
            dataSource: [
                { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 12) },
                { text: "Appointment 2", startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 12) },
                { text: "Appointment 3", startDate: new Date(2015, 1, 9, 11), endDate: new Date(2015, 1, 9, 12) }
            ]
        }
    );
    var $appointment = $(this.instance.element().find(".dx-scheduler-appointment"));
    assert.ok(!$appointment.eq(0).hasClass("dx-scheduler-appointment-empty"), "appointment has not the class");
    assert.ok(!$appointment.eq(1).hasClass("dx-scheduler-appointment-empty"), "appointment has not the class");
    assert.ok($appointment.eq(2).hasClass("dx-scheduler-appointment-empty"), "appointment has the class");
});

QUnit.test("Four rival appointments should have correct positions", function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: "month",
            height: 500,
            dataSource: [
                { text: "Appointment 1", startDate: new Date(2015, 1, 1, 8), endDate: new Date(2015, 1, 1, 12) },
                { text: "Appointment 2", startDate: new Date(2015, 1, 1, 9), endDate: new Date(2015, 1, 1, 12) },
                { text: "Appointment 3", startDate: new Date(2015, 1, 1, 11), endDate: new Date(2015, 1, 1, 12) },
                { text: "Appointment 4", startDate: new Date(2015, 1, 1, 10), endDate: new Date(2015, 1, 1, 12) }
            ]
        }
    );

    var $appointment = $(this.instance.element().find(".dx-scheduler-appointment")),
        $tableCell = $(this.instance.element().find(".dx-scheduler-date-table-cell").eq(0)),
        firstAppointmentPosition = translator.locate($appointment.eq(0)),
        secondAppointmentPosition = translator.locate($appointment.eq(1)),
        thirdAppointmentPosition = translator.locate($appointment.eq(2)),
        fourthAppointmentPosition = translator.locate($appointment.eq(3));

    assert.equal($appointment.length, 4, "All appointments are rendered");

    assert.equal(firstAppointmentPosition.left, 0, "appointment is rendered in right place");
    assert.roughEqual(firstAppointmentPosition.top, 26, 1.5, "appointment is rendered in right place");
    assert.equal($appointment.eq(0).outerWidth(), $tableCell.outerWidth(), "appointment has a right size");

    assert.equal(secondAppointmentPosition.left, 0, "appointment is rendered in right place");
    assert.roughEqual(secondAppointmentPosition.top, 46, 1.5, "appointment is rendered in right place");
    assert.equal($appointment.eq(1).outerWidth(), $tableCell.outerWidth(), "appointment has a right size");

    assert.roughEqual(thirdAppointmentPosition.left, 3, 1.5, "appointment is rendered in right place");
    assert.roughEqual(thirdAppointmentPosition.top, 3, 1.5, "appointment is rendered in right place");
    assert.equal($appointment.eq(2).outerHeight(), 15, "appointment has a right size");
    assert.equal($appointment.eq(2).outerWidth(), 15, "appointment has a right size");
    assert.roughEqual(fourthAppointmentPosition.left, 21, 1, "appointment is rendered in right place");
    assert.roughEqual(fourthAppointmentPosition.top, 3, 1.5, "appointment is rendered in right place");
    assert.equal($appointment.eq(3).outerHeight(), 15, "appointment has a right size");
    assert.equal($appointment.eq(3).outerWidth(), 15, "appointment has a right size");
});

QUnit.test("Rival duplicated appointments should have correct positions", function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: "month",
            height: 500,
            dataSource: [
                { text: "Appointment 1", startDate: new Date(2015, 1, 1, 8), endDate: new Date(2015, 1, 1, 10) },
                { text: "Appointment 2", startDate: new Date(2015, 1, 1, 8), endDate: new Date(2015, 1, 2, 9) }
            ]
        }
    );

    var $appointment = $(this.instance.element().find(".dx-scheduler-appointment")),
        $tableCell = $(this.instance.element().find(".dx-scheduler-date-table-cell").eq(0)),
        firstAppointmentPosition = translator.locate($appointment.eq(0)),
        secondAppointmentPosition = translator.locate($appointment.eq(1));

    assert.equal($appointment.length, 2, "All appointments are rendered");

    assert.equal(firstAppointmentPosition.left, 0, "appointment is rendered in right place");
    assert.roughEqual(firstAppointmentPosition.top, 26, 1.5, "appointment is rendered in right place");
    assert.equal($appointment.eq(0).outerWidth(), $tableCell.outerWidth(), "appointment has a right size");

    assert.equal(secondAppointmentPosition.left, 0, "appointment is rendered in right place");
    assert.roughEqual(secondAppointmentPosition.top, 46, 1.5, "appointment is rendered in right place");
    assert.equal($appointment.eq(1).outerWidth(), $tableCell.outerWidth() * 2, "appointment has a right size");
});

QUnit.test("More than 3 small appointments should be grouped", function(assert) {
    var items = [], i = 8;
    while(i > 0) {
        items.push({ text: i, startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 10) });
        i--;
    }

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: "month",
            height: 500,
            dataSource: items
        }
    );

    var $appointments = $(this.instance.element().find(".dx-scheduler-appointment"));

    assert.equal($appointments.length, 2, "Small appointments are grouped");
});

QUnit.module("Horizontal Month Line Strategy", moduleOptions);

QUnit.test("Start date of appointment should be changed when resize is finished", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 4, 0), endDate: new Date(2015, 1, 5, 0) },
        updatedItem = $.extend({}, item, { startDate: new Date(2015, 1, 3, 0) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 4),
            currentView: "timelineMonth",
            height: 500,
            dataSource: [item]
        }
    );

    var stub = sinon.stub(this.instance.getAppointmentsInstance(), "notifyObserver").withArgs("updateAppointmentAfterResize"),
        pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-left")).start();

    pointer.dragStart().drag(-200, 0).dragEnd();
    var args = stub.getCall(0).args;
    assert.ok(stub.calledOnce, "Observer is notified");

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.element().find(".dx-scheduler-appointment")
    });
});

QUnit.test("End date of appointment should be changed when resize is finished", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 4, 0), endDate: new Date(2015, 1, 5, 0) },
        updatedItem = $.extend({}, item, { endDate: new Date(2015, 1, 6, 0) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 4),
            currentView: "timelineMonth",
            height: 500,
            dataSource: [item]
        }
    );

    var stub = sinon.stub(this.instance.getAppointmentsInstance(), "notifyObserver").withArgs("updateAppointmentAfterResize"),
        pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-right")).start();

    pointer.dragStart().drag(200, 0).dragEnd();

    var args = stub.getCall(0).args;
    assert.ok(stub.calledOnce, "Observer is notified");

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.element().find(".dx-scheduler-appointment")
    });
});

QUnit.test("End date of appointment should be changed when resize is finished, RTL mode", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 4, 0), endDate: new Date(2015, 1, 5, 0) },
        updatedItem = $.extend({}, item, { endDate: new Date(2015, 1, 6, 0) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 4),
            currentView: "timelineMonth",
            rtlEnabled: true,
            height: 500,
            dataSource: [item]
        }
    );
    var stub = sinon.stub(this.instance.getAppointmentsInstance(), "notifyObserver").withArgs("updateAppointmentAfterResize"),
        pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-left")).start();

    pointer.dragStart().drag(-200, 0).dragEnd();

    var args = stub.getCall(0).args;
    assert.ok(stub.calledOnce, "Observer is notified");

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.element().find(".dx-scheduler-appointment")
    });
});

QUnit.test("Start date of appointment should be changed when resize is finished, RTL mode", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 4, 0), endDate: new Date(2015, 1, 5, 0) },
        updatedItem = $.extend({}, item, { startDate: new Date(2015, 1, 3, 0) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 4),
            currentView: "timelineMonth",
            rtlEnabled: true,
            height: 500,
            dataSource: [item]
        }
    );

    var stub = sinon.stub(this.instance.getAppointmentsInstance(), "notifyObserver").withArgs("updateAppointmentAfterResize"),
        pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-right")).start();

    pointer.dragStart().drag(200, 0).dragEnd();

    var args = stub.getCall(0).args;

    assert.ok(stub.calledOnce, "Observer is notified");

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.element().find(".dx-scheduler-appointment")
    });
});

QUnit.module("Horizontal Month Strategy", moduleOptions);

QUnit.test("Start date of the long-time reduced appointment should be changed correctly when resize is finished", function(assert) {
    var items = [{
        text: "Appointment 1",
        startDate: new Date(2015, 2, 11, 0),
        endDate: new Date(2015, 2, 23, 0)
    }];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 15),
            currentView: "month",
            height: 500,
            dataSource: items
        }
    );

    var updatedItem = $.extend({}, items[0], { startDate: new Date(2015, 2, 10, 0) }),
        stub = sinon.stub(this.instance.getAppointmentsInstance(), "notifyObserver").withArgs("updateAppointmentAfterResize"),
        pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-left")).start();

    pointer.dragStart().drag(-80, 0).dragEnd();

    var args = stub.getCall(0).args;

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: items[0],
        updated: updatedItem,
        $appointment: this.instance.element().find(".dx-scheduler-appointment")
    });
});

QUnit.test("More than 3 cloned appointments should be grouped", function(assert) {
    var items = [], i = 10;

    while(i > 0) {
        items.push({ text: i, startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1) });
        i--;
    }

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: "month",
            height: 500,
            dataSource: items
        }
    );

    var $appointment = $(this.instance.element().find(".dx-scheduler-appointment"));
    assert.equal($appointment.length, 2, "Cloned appointments are grouped");

    var $dropDownMenu = $(this.instance.element()).find(".dx-scheduler-dropdown-appointments").trigger("dxclick"),
        dropDownMenu = $dropDownMenu.eq(0).dxDropDownMenu("instance"),
        groupedAppointments = dropDownMenu.option("items"),
        dropDownMenuText = dropDownMenu.option("buttonTemplate").find("span").first().text();

    assert.equal($dropDownMenu.length, 1, "ddAppointment is rendered");

    assert.equal(groupedAppointments.length, 8, "DropDown menu has correct items");
    assert.equal(dropDownMenuText, "8", "DropDown menu has correct text");
    assert.roughEqual(dropDownMenu.option("buttonWidth"), 106.5, 1, "DropDownMenu button width is OK");
});

QUnit.test("Grouped appointments schould have correct colors", function(assert) {
    var items = [], i = 2;

    while(i > 0) {
        items.push({ text: i, startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), roomId: 1 });
        i--;
    }
    i = 10;
    while(i > 0) {
        items.push({ text: i, startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), roomId: 2 });
        i--;
    }

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: "month",
            height: 500,
            dataSource: items,
            resources: [
                {
                    field: "roomId",
                    allowMultiple: true,
                    dataSource: [
                        { id: 1, text: "Room 1", color: "#ff0000" },
                        { id: 2, text: "Room 2", color: "#0000ff" }
                    ]
                }
            ]
        }
    );

    var $appointment = $(this.instance.element().find(".dx-scheduler-appointment"));
    assert.equal($appointment.length, 2, "Cloned appointments are grouped");

    var $dropDownMenu = $(this.instance.element()).find(".dx-scheduler-dropdown-appointments").trigger("dxclick");

    assert.equal(new Color($dropDownMenu.css("background-color")).toHex(), "#0000ff", "ddAppointment is rendered");
});

QUnit.test("Grouped appointments should be reinitialized if datasource is changed", function(assert) {
    var items = [], i = 7;
    while(i > 0) {
        items.push({ text: i, startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1) });
        i--;
    }

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: "month",
            height: 500,
            dataSource: items
        }
    );
    items.push({ text: "a", startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1) });
    this.instance.option("dataSource", items);

    var $dropDownMenu = $(this.instance.element().find(".dx-scheduler-dropdown-appointments"));

    assert.equal($dropDownMenu.length, 1, "DropDown appointments are refreshed");
});

QUnit.test("Parts of long compact appt should have right positions", function(assert) {
    var items = [ { text: "Task 1", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 5, 3, 0) },
        { text: "Task 2", startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 5, 12, 0) },
        { text: "Task 3", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 7, 2, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "month",
            height: 500,
            dataSource: items
        }
    );

    var $appointment = $(this.instance.element().find(".dx-scheduler-appointment")),
        tableCellWidth = this.instance.element().find(".dx-scheduler-date-table-cell").eq(0).outerWidth(),
        gap = 3;

    for(var i = 2; i < $appointment.length; i++) {
        var appointmentPosition = translator.locate($appointment.eq(i));

        assert.deepEqual($appointment.eq(i).outerWidth(), 15, "appointment has a right size");
        assert.roughEqual(appointmentPosition.top, gap, 1.5, "part has right position");
        assert.roughEqual(appointmentPosition.left, gap + 3 * tableCellWidth + tableCellWidth * (i - 2), 1.5, "part has right position");
    }
});

QUnit.module("Horizontal Strategy", moduleOptions);

QUnit.test("Start date of appointment should be changed when resize is finished", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 2, 0) },
        updatedItem = $.extend({}, item, { startDate: new Date(2015, 1, 1, 0, 30) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 1),
            views: ["timelineWeek"],
            currentView: "timelineWeek",
            height: 500,
            dataSource: [item]
        }
    );

    var stub = sinon.stub(this.instance.getAppointmentsInstance(), "notifyObserver").withArgs("updateAppointmentAfterResize"),
        pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-left")).start();

    pointer.dragStart().drag(-200, 0).dragEnd();

    var args = stub.getCall(0).args;
    assert.ok(stub.calledOnce, "Observer is notified");

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.element().find(".dx-scheduler-appointment")
    });
});

QUnit.test("Start date of the long-time reduced appointment should be changed correctly when resize is finished", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 2, 15, 2), endDate: new Date(2015, 2, 23, 0) },
        updatedItem = $.extend({}, item, { startDate: new Date(2015, 2, 15, 0) });

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 15),
            views: ["timelineWeek"],
            currentView: "timelineWeek",
            height: 500,
            dataSource: [item]
        }
    );

    var stub = sinon.stub(this.instance.getAppointmentsInstance(), "notifyObserver").withArgs("updateAppointmentAfterResize"),
        pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-left")).start();

    pointer.dragStart().drag(-800, 0).dragEnd();

    var args = stub.getCall(0).args;

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.element().find(".dx-scheduler-appointment")
    });
});

QUnit.test("End date of appointment should be changed when resize is finished", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 4, 0), endDate: new Date(2015, 1, 5, 0) },
        updatedItem = $.extend({}, item, { endDate: new Date(2015, 1, 5, 0, 30) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 4),
            views: ["timelineWeek"],
            currentView: "timelineWeek",
            height: 500,
            dataSource: [item]
        }
    );

    var stub = sinon.stub(this.instance.getAppointmentsInstance(), "notifyObserver").withArgs("updateAppointmentAfterResize"),
        pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-right")).start();

    pointer.dragStart().drag(200, 0).dragEnd();

    var args = stub.getCall(0).args;
    assert.ok(stub.calledOnce, "Observer is notified");

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.element().find(".dx-scheduler-appointment")
    });
});

QUnit.test("End date of appointment should be changed when resize is finished, RTL mode", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 4, 0), endDate: new Date(2015, 1, 5, 0) },
        updatedItem = $.extend({}, item, { endDate: new Date(2015, 1, 5, 0, 30) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 4),
            views: ["timelineWeek"],
            currentView: "timelineWeek",
            rtlEnabled: true,
            height: 500,
            dataSource: [item]
        }
    );

    var stub = sinon.stub(this.instance.getAppointmentsInstance(), "notifyObserver").withArgs("updateAppointmentAfterResize"),
        pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-left")).start();

    pointer.dragStart().drag(-200, 0).dragEnd();

    var args = stub.getCall(0).args;
    assert.ok(stub.calledOnce, "Observer is notified");

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.element().find(".dx-scheduler-appointment")
    });
});

QUnit.test("Start date of appointment should be changed when resize is finished, RTL mode", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 4, 10), endDate: new Date(2015, 1, 5, 0) },
        updatedItem = $.extend({}, item, { startDate: new Date(2015, 1, 4, 9, 30) });
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 4),
            views: ["timelineWeek"],
            currentView: "timelineWeek",
            rtlEnabled: true,
            height: 500,
            dataSource: [item]
        }
    );

    var stub = sinon.stub(this.instance.getAppointmentsInstance(), "notifyObserver").withArgs("updateAppointmentAfterResize"),
        pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-right")).start();

    pointer.dragStart().drag(200, 0).dragEnd();

    var args = stub.getCall(0).args;

    assert.ok(stub.calledOnce, "Observer is notified");

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.element().find(".dx-scheduler-appointment")
    });
});

QUnit.test("End date of appointment should be changed сonsidering endDayHour and startDayHour when resize is finished", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 9, 18), endDate: new Date(2015, 1, 9, 19) },
        updatedItem = $.extend({}, item, { endDate: new Date(2015, 1, 10, 10) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            views: ["timelineWeek"],
            currentView: "timelineWeek",
            startDayHour: 8,
            endDayHour: 20,
            height: 500,
            dataSource: [item]
        }
    );

    var stub = sinon.stub(this.instance.getAppointmentsInstance(), "notifyObserver").withArgs("updateAppointmentAfterResize"),
        pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-right")).start();

    pointer.dragStart().drag(1200, 0).dragEnd();

    var args = stub.getCall(0).args;

    assert.ok(stub.calledOnce, "Observer is notified");
    assert.deepEqual(args[0], "updateAppointmentAfterResize", "Correct method of observer is called");

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.element().find(".dx-scheduler-appointment")
    });
});

QUnit.test("Start date of appointment should be changed сonsidering endDayHour and startDayHour when resize is finished", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 10) },
        updatedItem = $.extend({}, item, { startDate: new Date(2015, 1, 8, 19) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            views: ["timelineWeek"],
            currentView: "timelineWeek",
            startDayHour: 8,
            endDayHour: 20,
            height: 500,
            dataSource: [item]
        }
    );

    var stub = sinon.stub(this.instance.getAppointmentsInstance(), "notifyObserver").withArgs("updateAppointmentAfterResize"),
        pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-left")).start();
    pointer.dragStart().drag(-800, 0).dragEnd();

    var args = stub.getCall(0).args;

    assert.ok(stub.calledOnce, "Observer is notified");
    assert.deepEqual(args[0], "updateAppointmentAfterResize", "Correct method of observer is called");

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.element().find(".dx-scheduler-appointment")
    });
});

QUnit.test("Start date of long multiday appointment should be changed сonsidering endDayHour and startDayHour when resize is finished", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 10) },
        updatedItem = $.extend({}, item, { startDate: new Date(2015, 1, 7, 18) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            views: ["timelineWeek"],
            currentView: "timelineWeek",
            startDayHour: 8,
            endDayHour: 20,
            height: 500,
            dataSource: [item]
        }
    );

    var stub = sinon.stub(this.instance.getAppointmentsInstance(), "notifyObserver").withArgs("updateAppointmentAfterResize"),
        pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-left")).start(),
        tableCellWidth = this.instance.element().find(".dx-scheduler-date-table-cell").eq(0).outerWidth(),
        cellsCount = 15 * 2;

    pointer.dragStart().drag(-cellsCount * tableCellWidth, 0).dragEnd();

    var args = stub.getCall(0).args;

    assert.ok(stub.calledOnce, "Observer is notified");
    assert.deepEqual(args[0], "updateAppointmentAfterResize", "Correct method of observer is called");

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.element().find(".dx-scheduler-appointment")
    });
});

QUnit.test("End date of long multiday appointment should be changed сonsidering endDayHour and startDayHour when resize is finished", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 9, 18), endDate: new Date(2015, 1, 9, 19) },
        updatedItem = $.extend({}, item, { endDate: new Date(2015, 1, 11, 10) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            views: ["timelineWeek"],
            currentView: "timelineWeek",
            startDayHour: 8,
            endDayHour: 20,
            height: 500,
            dataSource: [item]
        }
    );

    var stub = sinon.stub(this.instance.getAppointmentsInstance(), "notifyObserver").withArgs("updateAppointmentAfterResize"),
        pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-right")).start(),
        tableCellWidth = this.instance.element().find(".dx-scheduler-date-table-cell").eq(0).outerWidth(),
        cellsCount = 15 * 2;

    pointer.dragStart().drag(cellsCount * tableCellWidth, 0).dragEnd();

    var args = stub.getCall(0).args;

    assert.ok(stub.calledOnce, "Observer is notified");
    assert.deepEqual(args[0], "updateAppointmentAfterResize", "Correct method of observer is called");

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.element().find(".dx-scheduler-appointment")
    });
});

QUnit.test("Four rival appointments should have correct positions", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2) },
    { text: "Appointment 2", startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2) },
    { text: "Appointment 3", startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2) },
    { text: "Appointment 4", startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2) }];

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: "timelineDay",
            height: 500,
            dataSource: items,
            startDayHour: 1
        }
    );

    var $appointment = $(this.instance.element().find(".dx-scheduler-appointment"));
    assert.equal($appointment.length, 4, "All appointments are rendered");

    assert.deepEqual(translator.locate($appointment.eq(0)), { top: 0, left: 0 }, "appointment is rendered in right place");

    assert.roughEqual(translator.locate($appointment.eq(1)).top, $appointment.eq(0).outerHeight(), 1, "appointment is rendered in right place");
    assert.equal(translator.locate($appointment.eq(1)).left, 0, "appointment is rendered in right place");

    assert.roughEqual(translator.locate($appointment.eq(2)).top, 2 * $appointment.eq(0).outerHeight(), 1, "appointment is rendered in right place");
    assert.equal(translator.locate($appointment.eq(2)).left, 0, "appointment is rendered in right place");

    assert.roughEqual(translator.locate($appointment.eq(3)).top, 3 * $appointment.eq(0).outerHeight(), 1, "appointment is rendered in right place");
    assert.equal(translator.locate($appointment.eq(3)).left, 0, "appointment is rendered in right place");
});

QUnit.test("Four rival appointments should have correct sizes", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2) },
    { text: "Appointment 2", startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2) },
    { text: "Appointment 3", startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2) },
    { text: "Appointment 4", startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2) }];

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: "timelineDay",
            height: 530,
            dataSource: items,
            startDayHour: 1
        }
    );

    var $appointment = $(this.instance.element().find(".dx-scheduler-appointment")),
        tableCellWidth = this.instance.element().find(".dx-scheduler-date-table-cell").eq(0).outerWidth() * 2;

    assert.equal($appointment.eq(0).outerWidth(), tableCellWidth, "appointment has a right size");
    assert.equal($appointment.eq(0).outerHeight(), 100, "appointment has a right size");

    assert.equal($appointment.eq(1).outerWidth(), tableCellWidth, "appointment has a right size");
    assert.equal($appointment.eq(1).outerHeight(), 100, "appointment has a right size");

    assert.equal($appointment.eq(2).outerWidth(), tableCellWidth, "appointment has a right size");
    assert.equal($appointment.eq(2).outerHeight(), 100, "appointment has a right size");

    assert.equal($appointment.eq(3).outerWidth(), tableCellWidth, "appointment has a right size");
    assert.equal($appointment.eq(3).outerHeight(), 100, "appointment has a right size");
});

QUnit.module("Vertical Strategy", moduleOptions);

QUnit.test("AllDay recurrent appointments count should be correct if recurrenceException is set", function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2016, 6, 25),
            currentView: "week",
            height: 900,
            width: 900,
            dataSource: [
                {
                    text: "SERIES - 1",
                    startDate: new Date(2016, 6, 25, 14, 14),
                    endDate: new Date(2016, 6, 25, 14, 14),
                    allDay: true,
                    recurrenceRule: "FREQ=DAILY",
                    recurrenceException: "20160728T141400, 20160729T141400"
                }
            ]
        }
    );

    var $appointments = $(this.instance.element().find(".dx-scheduler-appointment"));

    assert.equal($appointments.length, 4, "Appointments count is OK");
});

QUnit.test("Four rival all day appointments should have correct sizes", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10), allDay: true },
    { text: "Appointment 2", startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 10), allDay: true },
    { text: "Appointment 3", startDate: new Date(2015, 1, 9, 10), endDate: new Date(2015, 1, 9, 12), allDay: true },
    { text: "Appointment 4", startDate: new Date(2015, 1, 9, 12), endDate: new Date(2015, 1, 9, 14), allDay: true }];

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: "day",
            height: 900,
            width: 900,
            dataSource: items
        }
    );

    var $appointments = $(this.instance.element().find(".dx-scheduler-all-day-appointment"));

    assert.equal($appointments.length, 4, "All appointments are rendered");

    assert.roughEqual($appointments.eq(0).outerWidth(), 798, 1.1, "appointment has a right width");
    assert.roughEqual($appointments.eq(0).outerHeight(), 24, 2, "appointment has a right height");

    assert.roughEqual($appointments.eq(1).outerWidth(), 798, 1.1, "appointment has a right width");
    assert.roughEqual($appointments.eq(1).outerHeight(), 24, 2, "appointment has a right height");

    assert.roughEqual($appointments.eq(2).outerWidth(), 15, 1.1, "appointment has a right width");
    assert.roughEqual($appointments.eq(2).outerHeight(), 15, 1.1, "appointment has a right height");

    assert.roughEqual($appointments.eq(3).outerWidth(), 15, 1.1, "appointment has a right width");
    assert.roughEqual($appointments.eq(3).outerHeight(), 15, 1.1, "appointment has a right height");
});

QUnit.test("Dates of allDay appointment should be changed when resize is finished, week view RTL mode", function(assert) {
    var item = {
            text: "Appointment 1",
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 10),
            allDay: true
        },
        updatedItem = $.extend({}, item, {
            endDate: new Date(2015, 1, 10, 10)
        });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: "week",
            rtlEnabled: true,
            height: 900,
            width: 900,
            dataSource: [item]
        }
    );

    var $appointment = $(this.instance.element().find(".dx-scheduler-all-day-appointment"));

    var stub = sinon.stub(this.instance.getAppointmentsInstance(), "notifyObserver").withArgs("updateAppointmentAfterResize"),
        pointer = pointerMock($appointment.find(".dx-resizable-handle-left")).start();

    pointer.dragStart().drag(-100, 0).dragEnd();

    var args = stub.getCall(0).args;

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.element().find(".dx-scheduler-all-day-appointment")
    });
});

QUnit.test("Start date of appointment should be changed when resize is finished", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
        updatedItem = $.extend({}, item, { startDate: new Date(2015, 1, 9, 7) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: "day",
            height: 530,
            dataSource: [item]
        }
    );

    var stub = sinon.stub(this.instance.getAppointmentsInstance(), "notifyObserver").withArgs("updateAppointmentAfterResize"),
        pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-top")).start();
    pointer.dragStart().drag(0, -80).dragEnd();

    var args = stub.getCall(0).args;

    assert.ok(stub.calledOnce, "Observer is notified");

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.element().find(".dx-scheduler-appointment")
    });
});

QUnit.test("End date of appointment should be changed when resize is finished", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
        updatedItem = $.extend({}, item, { endDate: new Date(2015, 1, 9, 10) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: "day",
            height: 530,
            dataSource: [item]
        }
    );

    var stub = sinon.stub(this.instance.getAppointmentsInstance(), "notifyObserver").withArgs("updateAppointmentAfterResize");

    var pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-bottom")).start();
    pointer.dragStart().drag(0, 80).dragEnd();

    var args = stub.getCall(0).args;

    assert.ok(stub.calledOnce, "Observer is notified");
    assert.deepEqual(args[0], "updateAppointmentAfterResize", "Correct method of observer is called");

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.element().find(".dx-scheduler-appointment")
    });
});

QUnit.test("Two rival appointments should have correct positions, vertical strategy", function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: "week",
            height: 500,
            startDayHour: 8,
            dataSource: [
                { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10) },
                { text: "Appointment 2", startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 10) }
            ]
        }
    );

    var $appointment = $(this.instance.element().find(".dx-scheduler-appointment")),
        $tableCell = $(this.instance.element().find(".dx-scheduler-date-table-cell").eq(0)),
        cellHeight = $tableCell.outerHeight(),
        cellWidth = $tableCell.outerWidth();

    assert.equal($appointment.length, 2, "All appointments are rendered");

    var firstAppointmentPosition = translator.locate($appointment.eq(0)),
        secondAppointmentPosition = translator.locate($appointment.eq(1));

    assert.equal(firstAppointmentPosition.top, 0, "appointment is rendered in right place");
    assert.roughEqual(firstAppointmentPosition.left, cellWidth + 100, 1, "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(0).outerWidth(), 51.5, 1, "appointment has a right size");

    assert.equal(secondAppointmentPosition.top, 2 * cellHeight, "appointment is rendered in right place");
    assert.roughEqual(secondAppointmentPosition.left, cellWidth + $appointment.eq(0).outerWidth() + 100, 1, "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(1).outerWidth(), 51.5, 1, "appointment has a right size");
});

QUnit.test("Three rival appointments with two columns should have correct positions, vertical strategy", function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: "week",
            height: 500,
            startDayHour: 8,
            dataSource: [
                { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10) },
                { text: "Appointment 2", startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 10) },
                { text: "Appointment 3", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) }
            ]
        }
    );

    var $appointment = $(this.instance.element().find(".dx-scheduler-appointment")),
        $tableCell = $(this.instance.element().find(".dx-scheduler-date-table-cell").eq(0)),
        cellHeight = $tableCell.outerHeight(),
        cellWidth = $tableCell.outerWidth(),
        firstAppointmentPosition = translator.locate($appointment.eq(0)),
        secondAppointmentPosition = translator.locate($appointment.eq(1)),
        thirdAppointmentPosition = translator.locate($appointment.eq(2));

    assert.equal($appointment.length, 3, "All appointments are rendered");
    assert.equal(firstAppointmentPosition.top, 0, "appointment is rendered in right place");
    assert.roughEqual(firstAppointmentPosition.left, cellWidth + 100, 1, "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(0).outerWidth(), 51.5, 1, "appointment has a right size");

    assert.equal(secondAppointmentPosition.top, 2 * cellHeight, "appointment is rendered in right place");
    assert.roughEqual(secondAppointmentPosition.left, cellWidth + $appointment.eq(0).outerWidth() + 100, 1, "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(1).outerWidth(), 51.5, 1, "appointment has a right size");

    assert.equal(thirdAppointmentPosition.top, 0, "appointment is rendered in right place");
    assert.roughEqual(thirdAppointmentPosition.left, cellWidth + $appointment.eq(0).outerWidth() + 100, 1, "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(1).outerWidth(), 51.5, 1, "appointment has a right size");
});

QUnit.test("Four rival appointments with three columns should have correct positions, vertical strategy", function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: "week",
            height: 500,
            width: 900,
            startDayHour: 8,
            dataSource: [
                { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 11) },
                { text: "Appointment 2", startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 10) },
                { text: "Appointment 3", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10) },
                { text: "Appointment 4", startDate: new Date(2015, 1, 9, 10), endDate: new Date(2015, 1, 9, 12) }
            ]
        }
    );

    var $appointment = $(this.instance.element().find(".dx-scheduler-appointment")),
        $tableCell = $(this.instance.element().find(".dx-scheduler-date-table-cell").eq(0)),
        cellHeight = $tableCell.outerHeight(),
        cellWidth = $tableCell.outerWidth(),
        expectedAppWidth = (cellWidth - APPOINTMENT_DEFAULT_OFFSET) / 3;

    assert.equal($appointment.length, 4, "All appointments are rendered");

    assert.deepEqual(translator.locate($appointment.eq(0)), { top: 0, left: cellWidth + 100 }, "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(0).outerWidth(), expectedAppWidth, 1, "appointment has a right size");

    assert.deepEqual(translator.locate($appointment.eq(1)), { top: 2 * cellHeight, left: cellWidth + 100 + 2 * expectedAppWidth }, "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(1).outerWidth(), expectedAppWidth, 1, "appointment has a right size");

    assert.deepEqual(translator.locate($appointment.eq(2)), { top: 0, left: cellWidth + 100 + expectedAppWidth }, "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(2).outerWidth(), expectedAppWidth, 1, "appointment has a right size");

    assert.deepEqual(translator.locate($appointment.eq(3)), { top: 4 * cellHeight, left: cellWidth + 100 + expectedAppWidth }, "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(3).outerWidth(), expectedAppWidth, 1, "appointment has a right size");
});

QUnit.test("Rival duplicated appointments should have correct positions", function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: "week",
            height: 500,
            width: 900,
            startDayHour: 8,
            dataSource: [
                { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10) },
                { text: "Appointment 2", startDate: new Date(2015, 1, 10, 8), endDate: new Date(2015, 1, 10, 9) },
                { text: "Appointment 3", startDate: new Date(2015, 1, 10, 8), endDate: new Date(2015, 1, 10, 9) }
            ]
        }
    );

    var $appointment = $(this.instance.element().find(".dx-scheduler-appointment")),
        $tableCell = $(this.instance.element().find(".dx-scheduler-date-table-cell").eq(0)),
        cellWidth = $tableCell.outerWidth();

    assert.equal($appointment.length, 3, "All appointments are rendered");
    assert.deepEqual(translator.locate($appointment.eq(0)), { top: 0, left: cellWidth + 100 }, "appointment is rendered in right place");
    assert.equal($appointment.eq(0).outerWidth(), 89, "appointment has a right size");

    assert.deepEqual(translator.locate($appointment.eq(1)), { top: 0, left: 2 * cellWidth + 100 }, "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(1).outerWidth(), 44.5, 1, "appointment has a right size");

    assert.deepEqual(translator.locate($appointment.eq(2)), { top: 0, left: 2 * cellWidth + 100 + 44.5 }, "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(2).outerWidth(), 44.5, 1, "appointment has a right size");
});

QUnit.test("More than 3 all-day appointments should be grouped", function(assert) {
    var items = [], i = 12;
    while(i > 0) {
        items.push({ text: i, startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 10), allDay: true });
        i--;
    }

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: "week",
            height: 500,
            width: 900,
            dataSource: items
        }
    );

    var $appointment = $(".dx-scheduler-all-day-appointments").find(".dx-scheduler-appointment");

    assert.equal($appointment.length, 2, "Small appointments are grouped");
});

QUnit.test("Two rival all day appointments should have correct sizes and positions, vertical strategy", function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: "week",
            height: 500,
            width: 900,
            startDayHour: 8,
            dataSource: [
                { text: "Appointment 1", startDate: new Date(2015, 1, 8), allDay: true, endDate: new Date(2015, 2, 8) },
                { text: "Appointment 2", startDate: new Date(2015, 1, 8), endDate: new Date(2015, 2, 8), allDay: true }
            ]
        }
    );

    var $appointment = $(".dx-scheduler-all-day-appointments .dx-scheduler-appointment"),
        firstAppointmentPosition = translator.locate($appointment.eq(0)),
        secondAppointmentPosition = translator.locate($appointment.eq(1));

    assert.equal($appointment.length, 2, "All appointments are rendered");

    assert.equal(firstAppointmentPosition.top, 0, "appointment is rendered in right place");
    assert.roughEqual(firstAppointmentPosition.left, 100, 1, "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(0).outerWidth(), 798, 1.1, "appointment has a right width");
    assert.roughEqual($appointment.eq(0).outerHeight(), 37, 1.1, "appointment has a right height");

    assert.roughEqual(secondAppointmentPosition.top, 37, 1, "appointment is rendered in right place");
    assert.roughEqual(secondAppointmentPosition.left, 100, 1, "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(1).outerWidth(), 798, 1.1, "appointment has a right width");
    assert.roughEqual($appointment.eq(1).outerHeight(), 37, 1.1, "appointment has a right height");
});

QUnit.test("All day appointments should have correct left position, vertical strategy, rtl mode", function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: "week",
            height: 500,
            width: 900,
            startDayHour: 8,
            rtlEnabled: true,
            dataSource: [
                { text: "Appointment 1", startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 13), allDay: true }
            ]
        }
    );

    var $appointment = $(".dx-scheduler-all-day-appointments .dx-scheduler-appointment"),
        $allDayCell = $(this.instance.element().find(".dx-scheduler-all-day-table-cell").eq(0)),
        appointmentPosition = translator.locate($appointment.eq(0));

    assert.equal($appointment.length, 1, "Appointment was rendered");
    assert.roughEqual(appointmentPosition.left, $allDayCell.outerWidth() * 2, 2, "Appointment left coordinate has been adjusted ");
});

QUnit.test("Parts of long compact appt should have right positions", function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "week",
            height: 500,
            width: 900,
            startDayHour: 8,
            dataSource: [
                { text: "Task 1", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0), allDay: true },
                { text: "Task 2", startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0), allDay: true },
                { text: "Task 4", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 8, 2, 0), allDay: true }]
        }
    );

    var $appointment = $(this.instance.element().find(".dx-scheduler-appointment")),
        gap = 3,
        cellBorderOffset = 1,
        cellWidth = this.instance.element().find(".dx-scheduler-all-day-table-cell").eq(0).outerWidth();

    for(var i = 2; i < $appointment.length; i++) {
        var appointmentPosition = translator.locate($appointment.eq(i));

        assert.equal($appointment.eq(i).outerWidth(), 15, "appointment has a right size");
        assert.equal(appointmentPosition.top, gap, "Appointment top is OK");
        assert.roughEqual(appointmentPosition.left, (cellBorderOffset + cellWidth) * (i + 1) + 100, 3, "Appointment left is OK");
    }
});

QUnit.module("Appointments Keyboard Navigation", {
    beforeEach: function() {
        moduleOptions.beforeEach.apply(this);
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        moduleOptions.afterEach.apply(this);
        this.clock.restore();
    }
});

QUnit.test("Focus shouldn't be prevent when last appointment is reached", function(assert) {
    this.createInstance({
        focusStateEnabled: true,
        currentView: "month",
        currentDate: new Date(2015, 9, 16),
        dataSource: [{ text: "Appointment 1", startDate: new Date(2015, 9, 16, 9), endDate: new Date(2015, 9, 16, 11) },
                    { text: "Appointment 2", startDate: new Date(2015, 9, 17, 8), endDate: new Date(2015, 9, 17, 10) },
                    { text: "Appointment 3", startDate: new Date(2015, 9, 18, 8), endDate: new Date(2015, 9, 18, 10) },
                    { text: "Appointment 4", startDate: new Date(2015, 9, 19, 8), endDate: new Date(2015, 9, 19, 10) }]
    });

    var $appointments = $(this.instance.element().find(".dx-scheduler-appointment"));
    $($appointments.eq(3)).trigger("focusin");
    this.clock.tick();

    var keyboard = keyboardMock($appointments.eq(3));

    $(this.instance.element()).on("keydown", function(e) {
        assert.notOk(e.isDefaultPrevented(), "default tab isn't prevented");
    });

    keyboard.keyDown("tab");

    $($appointments).off("keydown");
});

QUnit.testInActiveWindow("Apps should be focused in right order", function(assert) {
    this.createInstance({
        focusStateEnabled: true,
        currentView: "week",
        startDayHour: 8,
        currentDate: new Date(2015, 9, 16),
        dataSource: [{ text: "Appointment 1", startDate: new Date(2015, 9, 11, 9), endDate: new Date(2015, 9, 11, 11) },
                    { text: "Appointment 2", startDate: new Date(2015, 9, 12, 8), endDate: new Date(2015, 9, 12, 10) },
                    { text: "Appointment 3", startDate: new Date(2015, 9, 13, 8), endDate: new Date(2015, 9, 13, 10) },
                    { text: "Appointment 4", startDate: new Date(2015, 9, 14, 8), endDate: new Date(2015, 9, 14, 10) }]
    });

    var $appointments = $(this.instance.element().find(".dx-scheduler-appointment")),
        apptInstance = this.instance.getAppointmentsInstance();

    $($appointments.eq(0)).trigger("focusin");
    this.clock.tick();

    var keyboard = keyboardMock($appointments.eq(0));
    keyboard.keyDown("tab");
    assert.deepEqual($appointments.get(1), apptInstance.option("focusedElement").get(0), "app 1 in focus");

    keyboard.keyDown("tab");
    assert.deepEqual($appointments.get(2), apptInstance.option("focusedElement").get(0), "app 0 in focus");

    keyboard.keyDown("tab");
    assert.deepEqual($appointments.get(3), apptInstance.option("focusedElement").get(0), "app 3 in focus");
});

QUnit.testInActiveWindow("Apps should be focused in back order while press shift+tab", function(assert) {
    this.createInstance({
        focusStateEnabled: true,
        currentView: "month",
        currentDate: new Date(2015, 9, 16),
        dataSource: [{ text: "Appointment 1", startDate: new Date(2015, 9, 16, 9), endDate: new Date(2015, 9, 16, 11) },
                    { text: "Appointment 2", startDate: new Date(2015, 9, 17, 8), endDate: new Date(2015, 9, 17, 10) },
                    { text: "Appointment 3", startDate: new Date(2015, 9, 18, 8), endDate: new Date(2015, 9, 18, 10) },
                    { text: "Appointment 4", startDate: new Date(2015, 9, 19, 8), endDate: new Date(2015, 9, 19, 10) }]
    });

    var $appointments = $(this.instance.element().find(".dx-scheduler-appointment")),
        apptInstance = this.instance.getAppointmentsInstance(),
        keyboard = keyboardMock($appointments.eq(0));

    $($appointments.eq(3)).trigger("focusin");
    this.clock.tick();

    keyboard.keyDown("tab", { shiftKey: true });
    assert.deepEqual($appointments.get(2), apptInstance.option("focusedElement").get(0), "app 1 in focus");

    keyboard.keyDown("tab", { shiftKey: true });
    assert.deepEqual($appointments.get(1), apptInstance.option("focusedElement").get(0), "app 1 in focus");

    keyboard.keyDown("tab", { shiftKey: true });
    assert.deepEqual($appointments.get(0), apptInstance.option("focusedElement").get(0), "app 1 in focus");
});

