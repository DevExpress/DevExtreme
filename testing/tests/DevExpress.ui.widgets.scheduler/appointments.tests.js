"use strict";

var pointerMock = require("../../helpers/pointerMock.js"),
    keyboardMock = require("../../helpers/keyboardMock.js");

var $ = require("jquery"),
    VerticalAppointmentsStrategy = require("ui/scheduler/ui.scheduler.appointments.strategy.vertical"),
    HorizontalMonthAppointmentsStrategy = require("ui/scheduler/ui.scheduler.appointments.strategy.horizontal_month"),
    SchedulerAppointments = require("ui/scheduler/ui.scheduler.appointments"),
    dropDownAppointments = require("ui/scheduler/ui.scheduler.appointments.drop_down"),
    dblclickEvent = require("events/dblclick"),
    translator = require("animation/translator"),
    dataCoreUtils = require("core/utils/data"),
    commonUtils = require("core/utils/common"),
    compileGetter = dataCoreUtils.compileGetter,
    compileSetter = dataCoreUtils.compileSetter,
    Draggable = require("ui/draggable"),
    Resizable = require("ui/resizable"),
    Widget = require("ui/widget/ui.widget"),
    fx = require("animation/fx"),
    dragEvents = require("events/drag"),
    DataSource = require("data/data_source/data_source").DataSource;

QUnit.testStart(function() {
    $("#qunit-fixture").html('<div id="scheduler-appointments"></div>\
                                <div id="allDayContainer"></div>\
                                <div id="fixedContainer"></div>');
});

var moduleOptions = {
    beforeEach: function() {
        fx.off = true;

        this.clock = sinon.useFakeTimers();
        this.width = 20;
        this.height = 20;
        this.allDayHeight = 20;
        this.items = [];
        this.coordinates = [{ top: 0, left: 0 }];
        this.getCoordinates = function() {
            return this.coordinates;
        };

        var dataAccessors = {
            getter: {
                startDate: compileGetter("startDate"),
                endDate: compileGetter("endDate"),
                allDay: compileGetter("allDay"),
                text: compileGetter("text"),
                recurrenceRule: compileGetter("recurrenceRule")
            },
            setter: {
                startDate: compileSetter("startDate"),
                endDate: compileSetter("endDate"),
                allDay: compileSetter("allDay"),
                text: compileSetter("text"),
                recurrenceRule: compileSetter("recurrenceRule")
            }
        };

        var that = this;
        this.initItems = function(items) {
            this.items = items;
            this.instance.option("items", items);
        };


        var subscribes = {
            needCoordinates: function(options) {
                options.callback(that.getCoordinates.apply(that));
            },
            getCellDimensions: function(options) {
                options.callback(that.width, that.height, that.allDayHeight);
            },
            renderDropDownAppointments: function(options) {
                var $menu = $("<div>").appendTo("#qunit-fixture #scheduler-appointments");

                return dropDownAppointments.render({
                    $container: $menu,
                    coordinates: options.coordinates,
                    items: options.items,
                    color: options.color,
                    itemTemplate: options.itemTemplate,
                    buttonWidth: options.buttonWidth
                }, new (Widget.inherit({
                    fire: function() { }
                }))($("<div>")));
            },
            getAppointmentColor: function(options) {
                options.callback($.Deferred().resolve("red").promise());
            },
            getResourceForPainting: function(options) {
                options.callback({ field: "roomId" });
            },
            getField: function(field, obj) {
                if(!commonUtils.isDefined(dataAccessors.getter[field])) {
                    return;
                }

                return dataAccessors.getter[field](obj);
            },
            setField: function(field, obj, value) {
                return dataAccessors.setter[field](obj, value);
            },
            prerenderFilter: function() {
                return that.items.length ? that.items : that.instance.option("items");
            },
            convertDateByTimezone: function(field, timezone) {
                return field;
            },
            getEndViewDate: function() {
                return new Date(2150, 1, 1);
            },
            getAppointmentDurationInMs: function(options) {
                options.callback(options.endDate.getTime() - options.startDate.getTime());
            },
            getResourcesFromItem: function(options) {
                options.callback({ someId: ["with space"] });
            }
        };

        var observer = {
            fire: function(subject) {
                var callback = subscribes[subject],
                    args = Array.prototype.slice.call(arguments);

                return callback && callback.apply(this, args.slice(1));
            }
        };

        this.instance = $("#scheduler-appointments").dxSchedulerAppointments({ observer: observer }).dxSchedulerAppointments("instance");

    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
};

var checkAppointmentUpdatedCallbackArgs = function(assert, actual, expected) {
    assert.deepEqual(actual.old, expected.old, "Old data is OK");
    assert.deepEqual(actual.updated, expected.updated, "New data is OK");
    assert.deepEqual(actual.$appointment.get(0), expected.$appointment.get(0), "Appointment element is OK");
};

QUnit.module("Appointments", moduleOptions);

QUnit.test("Scheduler appointments should be initialized", function(assert) {
    assert.ok(this.instance instanceof SchedulerAppointments, "dxSchedulerAppointments was initialized");
});

QUnit.test("Scheduler appointments should have a right css class", function(assert) {
    var $element = this.instance.element();

    assert.ok($element.hasClass("dx-scheduler-scrollable-appointments"), "dxSchedulerAppointments has 'dx-scheduler-scrollable-appointments' css class");
});

QUnit.test("Exception should be thrown if appointment has no start date", function(assert) {
    var that = this;

    assert.throws(
        function() {
            that.initItems([{ text: "Appointment 1" }]);
        },
        function(e) {
            return /E1032/.test(e.message);
        },
        "Exception messages should be correct"
    );
});

QUnit.test("Exception should be thrown if appointment has a broken start date", function(assert) {
    var that = this;

    assert.throws(
        function() {
            that.initItems([{ text: "Appointment 1", startDate: "Invalid date format" }]);
        },
        function(e) {
            return /E1032/.test(e.message);
        },
        "Exception messages should be correct"
    );
});

QUnit.test("startDate should be preprocessed before rendering", function(assert) {
    this.initItems([
        { text: "Appointment 1", startDate: 1429688467740 }
    ]);

    assert.equal(this.instance.element().find(".dx-scheduler-appointment").data("dxItemData").startDate, 1429688467740);
});

QUnit.test("Default appointment duration should be equal to 30 minutes", function(assert) {
    this.initItems([
        { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8) }
    ]);

    assert.deepEqual(this.instance.option("items")[0].endDate, new Date(2015, 1, 9, 8, 30), "End date of appointment is 30 minutes");
});

QUnit.test("Appointment duration should be equal to 30 minutes if end date equal or lower than start date", function(assert) {
    this.initItems([
        { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 8) },
        { text: "Appointment 2", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 7) }
    ]);

    assert.deepEqual(this.instance.option("items")[0].endDate, new Date(2015, 1, 9, 8, 30), "End date of appointment is 30 minutes");
    assert.deepEqual(this.instance.option("items")[1].endDate, new Date(2015, 1, 9, 8, 30), "End date of appointment is 30 minutes");
});

QUnit.test("Scheduler appointment should have appointment title", function(assert) {
    this.initItems([
        { text: "Appointment 1", startDate: new Date(2015, 8, 24, 13) }
    ]);

    assert.equal(this.instance.element().find(".dx-scheduler-appointment").attr("title"), this.instance.option("items")[0].text, "title is right");
});

QUnit.test("Scheduler appointments should have a right item count", function(assert) {
    this.initItems([
        { text: "Appointment 1", startDate: new Date() },
        { text: "Appointment 2", startDate: new Date() }
    ]);

    assert.equal(this.instance.element().find(".dx-scheduler-appointment").length, 2, "dxSchedulerAppointments has two items");
});

QUnit.test("Scheduler appointments with recurrenceRule should have a specific class", function(assert) {
    this.initItems([{ text: "Appointment 1", startDate: new Date(), recurrenceRule: "FREQ=YEARLY;COUNT=1" }]);

    assert.equal(this.instance.element().find(".dx-scheduler-appointment-recurrence").length, 1, "dxSchedulerAppointments has two items");
});

QUnit.test("Scheduler appointments should have a correct height", function(assert) {
    this.initItems([
        { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) }
    ]);

    var $appointment = this.instance.element().find(".dx-scheduler-appointment");

    assert.equal($appointment.outerHeight(), 40, "Appointment has a right height");
});

QUnit.test("Scheduler appointments should have a correct height when dates are defined as not Date objects", function(assert) {
    this.initItems([
        { text: "Appointment 1", startDate: 1423458000000, endDate: 1423461600000 }
    ]);

    var $appointment = this.instance.element().find(".dx-scheduler-appointment");

    assert.equal($appointment.outerHeight(), 40, "Appointment has a right height");
});

QUnit.test("Scheduler appointments should have a min height", function(assert) {
    this.initItems([
        { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 8, 1) }
    ]);

    var $appointment = this.instance.element().find(".dx-scheduler-appointment");

    assert.equal($appointment.outerHeight(), 2, "Appointment has a right height");
});


QUnit.test("Scheduler appointment should be resizable", function(assert) {
    this.height = 30;
    this.instance.option("items", [
        { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) }
    ]);

    var $appointment = this.instance.element().find(".dx-scheduler-appointment"),
        resizableInstance = $appointment.dxResizable("instance");

    assert.ok(resizableInstance instanceof Resizable, "Appointment is instance of dxResizable");
    assert.equal(resizableInstance.option("handles"), "top bottom", "Appointment can resize only vertical");
    assert.equal(resizableInstance.option("step"), this.height, "Resizable has a right step");
    assert.equal(resizableInstance.option("minHeight"), this.height, "Resizable has a right minHeight");
    assert.deepEqual(resizableInstance.option("area"), this.instance.element().closest(".dx-scrollable-content"), "Resizable area is scrollable content");
});


QUnit.test("Scheduler appointment should not be resizable if allowResize is false", function(assert) {
    this.initItems([
    { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) }
    ]);

    this.instance.option({ allowResize: false });

    var $appointment = this.instance.element().find(".dx-scheduler-appointment");

    assert.notOk($appointment.data("dxResizable"), "Appointment is not dxResizable");
});

QUnit.test("All-day appointment should not be resizable if current view is 'day'", function(assert) {
    this.initItems([
        {
            text: "Appointment 1",
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9),
            allDay: true
        }
    ]);

    this.instance.option({ "allowAllDayResize": false });

    var $appointment = this.instance.element().find(".dx-scheduler-appointment").first();

    assert.notOk($appointment.hasClass("dx-resizable"), "Appointment is not resizable");
});

QUnit.test("End date of appointment should be changed when resize is finished", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
        updatedItem = $.extend({}, item, { endDate: new Date(2015, 1, 9, 10) });

    this.initItems([item]);

    var stub = sinon.stub(this.instance, "notifyObserver").withArgs("updateAppointmentAfterResize");

    var pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-bottom")).start();
    pointer.dragStart().drag(0, 40).dragEnd();

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

QUnit.test("moveAppointmentBack should affect on appointment only first time", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) };

    this.initItems([item]);

    this.instance.option({
        height: 100,
        width: 100,
        focusStateEnabled: true
    });

    var $appointment = this.instance.element().find(".dx-scheduler-appointment");

    var pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-bottom")).start();
    pointer.dragStart();

    var coordinates = {
        top: 10,
        left: 10
    };

    this.instance.moveAppointmentBack();

    translator.move($appointment, coordinates);
    this.instance.moveAppointmentBack();
    assert.deepEqual(translator.locate($appointment), coordinates, "coordinates has been changed");

});

QUnit.test("Appointment should not be changed while resize when 'esc' key was pressed", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) };

    this.initItems([item]);

    this.instance.option({ focusStateEnabled: true });

    var updateSpy = sinon.spy($.noop);

    this.instance.notifyObserver = updateSpy;

    var $appointment = this.instance.element().find(".dx-scheduler-appointment"),
        keyboard = keyboardMock($appointment);


    var pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-bottom")).start();
    pointer.dragStart().drag(0, 40);
    keyboard.keyDown("esc");
    pointer.dragEnd();

    assert.ok(!updateSpy.calledOnce, "Observer was not notified");
});

QUnit.test("Appointment should not be changed while resize when 'esc' key was pressed", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) };

    this.initItems([item]);

    this.instance.option({ focusStateEnabled: true });

    var $appointment = this.instance.element().find(".dx-scheduler-appointment"),
        initialWidth = $appointment.width(),
        initialHeight = $appointment.height(),
        keyboard = keyboardMock($appointment),
        pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-bottom")).start();

    pointer.dragStart().drag(0, 40);
    keyboard.keyDown("esc");
    pointer.dragEnd();

    assert.equal($appointment.width(), initialWidth, "Appointment width is correct");
    assert.equal($appointment.height(), initialHeight, "Appointment height is correct");
});

QUnit.test("Start date of appointment should be changed when resize is finished", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) },
        updatedItem = $.extend({}, item, { startDate: new Date(2015, 1, 9, 7) });

    this.initItems([item]);

    var stub = sinon.stub(this.instance, "notifyObserver").withArgs("updateAppointmentAfterResize");

    var pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-top")).start();
    pointer.dragStart().drag(0, -40).dragEnd();

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

QUnit.test("Scheduler appointment should be draggable", function(assert) {
    this.initItems([
        { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) }
    ]);

    var $appointment = this.instance.element().find(".dx-scheduler-appointment"),
        draggableInstance = $appointment.dxDraggable("instance");

    assert.ok(draggableInstance instanceof Draggable, "Appointment is instance of dxDraggable");
});

QUnit.test("Scheduler appointment should not be draggable if allowDrag is false", function(assert) {
    this.initItems([
    { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) }
    ]);
    this.instance.option({ allowDrag: false });

    var $appointment = this.instance.element().find(".dx-scheduler-appointment");

    assert.notOk($appointment.data("dxDraggable"), "Appointment is not dxDraggable");
});

QUnit.test("Drag event targets should be corrected on dragStart", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9), allDay: true };

    this.instance.option({
        items: [item],
        fixedContainer: $("#fixedContainer")
    });

    var updateSpy = sinon.spy($.noop);

    this.instance.notifyObserver = updateSpy;

    var $appointment = this.instance.element().find(".dx-scheduler-appointment"),
        pointer = pointerMock($appointment).start();

    pointer.dragStart();

    assert.ok(!updateSpy.calledOnce, "Observers are notified");
    assert.deepEqual(updateSpy.getCall(1).args[0], "getDragEventTargetElements", "Correct method of observer is called");

    pointer.dragEnd();
});


QUnit.test("Drag event should not contain maxBottomOffset & maxRightOffset", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9), allDay: true };

    this.instance.option({
        items: [item],
        fixedContainer: $("#fixedContainer")
    });

    var $appointment = this.instance.element().find(".dx-scheduler-appointment"),
        pointer = pointerMock($appointment).start();

    $appointment.on(dragEvents.start, function(e) {
        assert.equal(e.maxBottomOffset, null, "maxBottomOffset is not set");
        assert.equal(e.maxRightOffset, null, "maxRightOffset is not set");
    });

    pointer.dragStart();
    pointer.dragEnd();
});

QUnit.test("Allday appointment should stay in allDayContainer after small dragging", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2016, 1, 1, 8), endDate: new Date(2016, 1, 1, 10), allDay: true };

    this.instance.option({
        items: [item],
        fixedContainer: $("#fixedContainer"),
        allDayContainer: $("#allDayContainer")
    });

    var $appointment = $("#allDayContainer .dx-scheduler-appointment"),
        pointer = pointerMock($appointment).start();

    pointer.dragStart().drag(0, -30);
    pointer.dragEnd();

    assert.equal($("#allDayContainer .dx-scheduler-appointment").length, 1, "appointment is in allDayContainer");
});

QUnit.test("Drag event should not contain maxBottomOffset & maxLeftOffset for RTL", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9), allDay: true };

    this.instance.option({
        items: [item],
        fixedContainer: $("#fixedContainer"),
        rtlEnabled: true
    });

    var $appointment = this.instance.element().find(".dx-scheduler-appointment"),
        pointer = pointerMock($appointment).start();

    $appointment.on(dragEvents.start, function(e) {
        assert.equal(e.maxBottomOffset, null, "maxBottomOffset is not set");
        assert.equal(e.maxLeftOffset, null, "maxLeftOffset is not set");
    });

    pointer.dragStart();
    pointer.dragEnd();
});

QUnit.test("Appointment coordinates should be corrected during drag", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9), allDay: true };

    this.instance.option({
        items: [item],
        fixedContainer: $("#fixedContainer")
    });

    var updateSpy = sinon.spy($.noop);

    this.instance.notifyObserver = updateSpy;

    var $appointment = this.instance.element().find(".dx-scheduler-appointment"),
        pointer = pointerMock($appointment).start();

    pointer.dragStart().drag(0, 60);

    assert.ok(!updateSpy.calledOnce, "Observers are notified");
    assert.deepEqual(updateSpy.getCall(2).args[0], "correctAppointmentCoordinates", "Correct method of observer is called");
    assert.deepEqual(updateSpy.getCall(2).args[1].coordinates, { left: 0, top: 60 }, "Arguments are OK");
    assert.deepEqual(updateSpy.getCall(2).args[1].allDay, true, "Arguments are OK");

    pointer.dragEnd();
});

QUnit.test("Appointment coordinates should be corrected on dragend", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9), allDay: true };

    this.instance.option({
        items: [item],
        fixedContainer: $("#fixedContainer")
    });

    var updateSpy = sinon.spy($.noop);

    this.instance.notifyObserver = updateSpy;

    var $appointment = this.instance.element().find(".dx-scheduler-appointment"),
        pointer = pointerMock($appointment).start();

    pointer.dragStart().drag(0, 60).dragEnd();

    assert.ok(!updateSpy.calledOnce, "Observers are notified");
    assert.deepEqual(updateSpy.getCall(3).args[0], "correctAppointmentCoordinates", "Correct method of observer is called");
    assert.deepEqual(updateSpy.getCall(3).args[1].coordinates, { left: 0, top: 60 }, "Arguments are OK");
    assert.deepEqual(updateSpy.getCall(3).args[1].allDay, true, "Arguments are OK");
    assert.deepEqual(updateSpy.getCall(3).args[1].isFixedContainer, true, "Arguments are OK");

    pointer.dragEnd();
});

QUnit.test("Start & end date of appointment should be changed when drag is finished", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) };

    this.instance.option({
        items: [item],
        fixedContainer: $("#fixedContainer")
    });

    var updateSpy = sinon.spy($.noop);

    this.instance.notifyObserver = updateSpy;

    var $appointment = this.instance.element().find(".dx-scheduler-appointment"),
        pointer = pointerMock($appointment).start();

    pointer.dragStart().drag(0, 60).dragEnd();

    assert.ok(!updateSpy.calledOnce, "Observers are notified");
    assert.deepEqual(updateSpy.getCall(4).args[0], "updateAppointmentAfterDrag", "Correct method of observer is called");
    assert.deepEqual(updateSpy.getCall(4).args[1].data, item, "Arguments are OK");
    assert.deepEqual(updateSpy.getCall(4).args[1].$appointment.get(0), $appointment.get(0), "Arguments are OK");
});

QUnit.test("Appointment tooltip should be hidden when drag is started", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) };

    this.instance.option({
        items: [item],
        fixedContainer: $("#fixedContainer")
    });

    var updateSpy = sinon.spy($.noop);

    this.instance.notifyObserver = updateSpy;

    var $appointment = this.instance.element().find(".dx-scheduler-appointment"),
        pointer = pointerMock($appointment).start();

    pointer.dragStart().drag(0, 60);

    assert.deepEqual(updateSpy.getCall(0).args[0], "hideAppointmentTooltip", "Correct method of observer is called");

    pointer.dragEnd();
});

QUnit.test("Appointment should be placed in fixed container on drag-start", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) };

    this.instance.option({
        items: [item],
        focusStateEnabled: true,
        fixedContainer: $("#fixedContainer")
    });

    var $appointment = this.instance.element().find(".dx-scheduler-appointment"),
        pointer = pointerMock($appointment).start();

    pointer.dragStart().drag(0, 60);
    assert.equal($("#fixedContainer .dx-scheduler-appointment").length, 1, "fixedContainer has 1 item");

    pointer.dragEnd();
    assert.equal($("#fixedContainer .dx-scheduler-appointment").length, 0, "fixedContainer is empty after drag-end");
});

QUnit.test("Appointment should be rendered a many times if coordinates array contains a few items", function(assert) {
    var item = { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10) };

    this.coordinates = [{ top: 0, left: 0 }, { top: 10, left: 10 }, { top: 20, left: 20 }];

    this.instance.option({
        items: [item]
    });

    var $appointment = this.instance.element().find(".dx-scheduler-appointment");

    assert.equal($appointment.length, 3, "All appointments are rendered");
    assert.deepEqual(translator.locate($appointment.eq(0)), { top: 0, left: 0 }, "appointment is rendered in right place");
    assert.deepEqual(translator.locate($appointment.eq(1)), { top: 10, left: 10 }, "appointment is rendered in right place");
    assert.deepEqual(translator.locate($appointment.eq(2)), { top: 20, left: 20 }, "appointment is rendered in right place");
    assert.deepEqual(this.instance.option("items"), [item], "items are not affected");
});

QUnit.test("Draggable clone should be correct", function(assert) {
    var items = [
        { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10) }
    ];

    this.coordinates = [{ top: 0, left: 0 }, { top: 200, left: 200 }];

    this.instance.option({
        items: items,
        fixedContainer: $("#fixedContainer")
    });

    var $secondAppointment = this.instance.element().find(".dx-scheduler-appointment").eq(1),
        pointer = pointerMock($secondAppointment).start();

    $secondAppointment.dxDraggable("instance").option("onDrag", function(e) {
        assert.deepEqual(arguments[0].element.get(0), $secondAppointment.get(0), "draggable element is right");
    });

    pointer.dragStart().drag(0, 60).dragEnd();
});

QUnit.test("Delta time for resizable appointment should be 0 if appointment isn't resized", function(assert) {
    var strategy = new HorizontalMonthAppointmentsStrategy({
            notifyObserver: $.noop,
            option: $.noop
        }),
        deltaTime = strategy.getDeltaTime({ width: 100 }, { width: 100 });

    assert.strictEqual(deltaTime, 0, "Delta time is 0");
});

QUnit.test("Delta time for resizable appointment should decreased correctly in vertical strategy", function(assert) {
    var optionStub = sinon.stub();
    optionStub.withArgs("appointmentDurationInMinutes").returns(30);

    var strategy = new VerticalAppointmentsStrategy({
        _getStartDate: function() { return new Date(); },
        _getEndDate: function() { return new Date(); },
        option: optionStub,
        notifyObserver: $.noop,
        invoke: $.noop
    });
    strategy._defaultHeight = 50;
    var deltaTime = strategy.getDeltaTime({ height: 50 }, { height: 99 }, { allDay: false });

    assert.strictEqual(deltaTime, -1800000, "Delta time is OK");
});

QUnit.test("Scheduler appointment should have aria-role 'button'", function(assert) {
    this.instance.option("items", [
        { text: "Appointment 1", startDate: new Date(2015, 10, 23, 8), endDate: new Date(2015, 10, 25, 9) }
    ]);

    var $appointment = this.instance.element().find(".dx-scheduler-appointment");

    assert.equal($appointment.attr("role"), "button", "role is right");
});

QUnit.test("Split appointment by day", function(assert) {
    var appt1 = { startDate: new Date(2016, 1, 25, 1).toString(), endDate: new Date(2016, 1, 25, 2).toString() },
        appt2 = { startDate: new Date(2016, 1, 28, 1).toString(), endDate: new Date(2016, 2, 3, 2).toString() },
        appt3 = { startDate: new Date(2016, 1, 28, 23).toString(), endDate: new Date(2016, 1, 29, 1).toString() };

    var parts1 = this.instance.splitAppointmentByDay(appt1),
        parts2 = this.instance.splitAppointmentByDay(appt2),
        parts3 = this.instance.splitAppointmentByDay(appt3);

    assert.deepEqual(parts1, [{
        appointmentData: appt1,
        startDate: new Date(2016, 1, 25, 1)
    }], "Parts are OK");

    assert.deepEqual(parts2, [
        { appointmentData: appt2, startDate: new Date(2016, 1, 28, 1) },
        { appointmentData: appt2, startDate: new Date(2016, 1, 29) },
        { appointmentData: appt2, startDate: new Date(2016, 2, 1) },
        { appointmentData: appt2, startDate: new Date(2016, 2, 2) },
        { appointmentData: appt2, startDate: new Date(2016, 2, 3) }
    ], "Parts are OK");

    assert.deepEqual(parts3, [
        { appointmentData: appt3, startDate: new Date(2016, 1, 28, 23) },
        { appointmentData: appt3, startDate: new Date(2016, 1, 29) },
    ], "Parts are OK");
});

QUnit.test("Appointment should process resource names with spaces", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 10, 3, 9), endDate: new Date(2015, 10, 3, 11) }];

    this.instance.option({
        currentDate: new Date(2015, 10, 3),
        items: items
    });

    var $appointment = $(".dx-scheduler-appointment").eq(0);
    assert.equal($appointment.filter("[data-someid-with__32__space]").length, 1, "attr is right");
});

QUnit.module("Appointments Actions", moduleOptions);

QUnit.test("Appointments should set alias key to cellCache", function(assert) {
    var setCacheAliasSpy = sinon.spy(this.instance, "invoke").withArgs("setCellDataCacheAlias");

    this.initItems([{ text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10) }]);

    assert.ok(setCacheAliasSpy.calledOnce, "setCacheAlias was called once");
    assert.deepEqual(setCacheAliasSpy.getCall(0).args[1], {
        allDay: false,
        appointmentReduced: null,
        count: 1,
        height: 80,
        index: 0,
        left: 0,
        sortedIndex: 0,
        top: 0,
        width: 0
    }, "setCacheAlias was called with correct appointment appointmentSettings");

    assert.deepEqual(setCacheAliasSpy.getCall(0).args[2], {
        height: 80,
        left: 0,
        top: 0,
        width: 5
    }, "setCacheAlias was called with correct geometry");

});

QUnit.test("Default behavior of item click should prevented when set e.cancel", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10) }];

    this.instance.option({
        items: items,
        onItemClick: function(e) {
            e.cancel = true;
        }
    });

    var stub = sinon.stub(this.instance, "notifyObserver").withArgs("showAppointmentTooltip");
    var $item = $(".dx-scheduler-appointment").eq(0);

    $item.trigger("dxclick");
    this.clock.tick(300);

    assert.notOk(stub.called, "showAppointmentTooltip doesn't shown");
});

QUnit.test("onAppointmentDblClick should fires when item is dbl clicked", function(assert) {
    assert.expect(2);

    var items = [{
        startDate: new Date(2015, 2, 10),
        endDate: new Date(2015, 2, 13),
        text: "Task caption"
    }, {
        startDate: new Date(2015, 2, 15),
        endDate: new Date(2015, 2, 20),
        text: "Task caption"
    }];

    this.instance.option({
        dataSource: new DataSource({
            store: items
        }),
        views: ["month"],
        currentView: "month",
        currentDate: new Date(2015, 2, 9),
        onAppointmentDblClick: function(e) {
            assert.deepEqual(e.appointmentElement[0], $item[0], "appointmentElement is correct");
            assert.deepEqual(e.appointmentData, items[0], "appointmentData is correct");
        }
    });

    var $item = $(".dx-scheduler-appointment").eq(0);
    $item.trigger(dblclickEvent.name);
});

QUnit.test("Popup should be shown when onAppointmentDblClick", function(assert) {
    assert.expect(1);

    var items = [{ text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10) }];

    this.instance.option({
        items: items,
        onAppointmentDblClick: function(e) {
            e.cancel = true;
        }
    });

    var stub = sinon.stub(this.instance, "notifyObserver").withArgs("showEditAppointmentPopup");
    var $item = $(".dx-scheduler-appointment").eq(0);

    $item.trigger(dblclickEvent.name);

    assert.notOk(stub.called, "showEditAppointmentPopup doesn't shown");
});


QUnit.module("Appointments Keyboard Navigation", {
    beforeEach: function() {
        moduleOptions.beforeEach.apply(this);

        var current = 0;
        this.getCoordinates = function() {
            var coords = [[{ top: 0, left: 100 }], [{ top: 0, left: 200 }], [{ top: 0, left: 300 }], [{ top: 0, left: 400 }]];
            return coords[current++ % coords.length];
        };

        this.width = 100;
        this.height = 30;
    },
    afterEach: function() {
        moduleOptions.afterEach.apply(this);
    }
});

QUnit.test("Items has a tab index if focusStateEnabled", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10) },
                { text: "Appointment 2", startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 10) }];

    this.instance.option({
        currentDate: new Date(2015, 1, 9),
        items: items,
        focusStateEnabled: true,
        tabIndex: 1
    });
    var $appointments = $(".dx-scheduler-appointment");

    assert.equal($appointments.eq(0).attr("tabindex"), 1, "item tabindex is right");

    this.instance.option({
        focusStateEnabled: false
    });

    $appointments = $(".dx-scheduler-appointment");
    assert.ok(!$appointments.eq(0).attr("tabindex"), "item tabindex is right");
});

QUnit.test("Focused element should be changed on focusin", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10) },
                { text: "Appointment 2", startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 10) }];

    this.instance.option({
        currentDate: new Date(2015, 1, 9),
        items: items,
        focusStateEnabled: true
    });
    var $appointments = $(".dx-scheduler-appointment");
    $appointments.eq(0).trigger("focusin");
    assert.deepEqual($appointments.get(0), this.instance.option("focusedElement").get(0), "right element is focused");

    $appointments.eq(1).trigger("focusin");
    assert.deepEqual($appointments.get(1), this.instance.option("focusedElement").get(0), "right element is focused");
});

QUnit.test("Appointment popup should be opened after enter key press", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 8, 16, 9), endDate: new Date(2015, 8, 16, 11) },
                { text: "Appointment 2", startDate: new Date(2015, 8, 17, 8), endDate: new Date(2015, 8, 17, 10) }];

    this.instance.option({
        currentDate: new Date(2015, 8, 16),
        items: items,
        focusStateEnabled: true
    });

    var notifyStub = sinon.stub(this.instance, "notifyObserver"),
        $appointments = $(".dx-scheduler-appointment"),
        keyboard = keyboardMock($appointments.eq(0));


    $appointments.eq(0).trigger("focusin");
    keyboard.keyDown("enter");
    this.clock.tick(300);

    assert.ok(notifyStub.called, "notify is called");
    assert.equal(notifyStub.getCall(0).args[0], "showEditAppointmentPopup", "popup is shown");

    assert.deepEqual(notifyStub.getCall(0).args[1].data, items[0], "data is ok");
    assert.deepEqual(notifyStub.getCall(0).args[1].target.get(0), $appointments.get(0), "element is ok");
});

QUnit.test("Appointment should be deleted after delete key press, if allowDelete = true", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 8, 16, 9), endDate: new Date(2015, 8, 16, 11) },
                { text: "Appointment 2", startDate: new Date(2015, 8, 17, 8), endDate: new Date(2015, 8, 17, 10) }];

    this.instance.option({
        currentDate: new Date(2015, 8, 16),
        items: items,
        focusStateEnabled: true,
        allowDelete: true
    });

    var notifyStub = sinon.stub(this.instance, "notifyObserver"),
        $appointments = $(".dx-scheduler-appointment"),
        $targetAppointment = $appointments.eq(1);

    $targetAppointment.trigger("focusin");

    var keyboard = keyboardMock($targetAppointment);
    keyboard.keyDown("del");

    assert.ok(notifyStub.called, "notify is called");

    var deleteEventName = notifyStub.getCall(0).args[0],
        hideTooltipEventName = notifyStub.getCall(1).args[0];

    assert.equal(deleteEventName, "deleteAppointment", "deleteAppointment is called");

    var eventOptions = notifyStub.getCall(0).args[1];
    assert.deepEqual(eventOptions.data, items[1], "data is ok");
    assert.deepEqual($(eventOptions.target).get(0), $targetAppointment.get(0), "target is ok");

    assert.equal(hideTooltipEventName, "hideAppointmentTooltip", "hideAppointmentTooltip is called");
});

QUnit.test("Appointment should not be deleted after delete key press, if allowDelete = false", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 8, 16, 9), endDate: new Date(2015, 8, 16, 11) },
                { text: "Appointment 2", startDate: new Date(2015, 8, 17, 8), endDate: new Date(2015, 8, 17, 10) }];

    this.instance.option({
        currentDate: new Date(2015, 8, 16),
        items: items,
        focusStateEnabled: true,
        allowDelete: false
    });

    var notifyStub = sinon.stub(this.instance, "notifyObserver"),
        $appointments = $(".dx-scheduler-appointment"),
        $targetAppointment = $appointments.eq(1);

    $targetAppointment.trigger("focusin");

    var keyboard = keyboardMock($targetAppointment);
    keyboard.keyDown("del");

    assert.notOk(notifyStub.called, "notify was not called");
});

QUnit.test("Focus method should call focus on appointment", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 10, 3, 9), endDate: new Date(2015, 10, 3, 11) }];

    this.instance.option({
        currentDate: new Date(2015, 10, 3),
        items: items,
        focusStateEnabled: true
    });

    var $appointment = $(".dx-scheduler-appointment").eq(0);

    $appointment.trigger("focusin");

    var focusSpy = sinon.spy(this.instance.option("focusedElement"), "focus"),
        appointmentFocusedStub = sinon.stub(this.instance, "notifyObserver").withArgs("appointmentFocused");

    this.instance.focus();

    this.clock.tick();
    assert.ok(focusSpy.called, "focus is called");
    assert.ok(appointmentFocusedStub.called, "appointmentFocused is fired");
});

QUnit.test("Default behavior of tab button should be prevented for apps", function(assert) {
    assert.expect(1);

    var items = [{ text: "Appointment 1", startDate: new Date(2015, 8, 16, 9), endDate: new Date(2015, 8, 16, 11) },
                    { text: "Appointment 2", startDate: new Date(2015, 8, 17, 8), endDate: new Date(2015, 8, 17, 10) }];

    this.instance.option({
        currentDate: new Date(2015, 8, 16),
        items: items,
        focusStateEnabled: true
    });

    var $appointments = this.instance.element().find(".dx-scheduler-appointment"),
        keyboard = keyboardMock($appointments.eq(0));

    this.instance.element().on("keydown", function(e) {
        assert.ok(e.isDefaultPrevented(), "default tab prevented");
    });

    $appointments.eq(0).trigger("focusin");
    keyboard.keyDown("tab");

    $appointments.off("keydown");
});

QUnit.test("Appointment has right sortedIndex", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 9, 16, 9), endDate: new Date(2015, 9, 16, 11) },
                { text: "Appointment 2", startDate: new Date(2015, 9, 17, 8), endDate: new Date(2015, 9, 17, 10) },
                { text: "Appointment 3", startDate: new Date(2015, 9, 18, 8), endDate: new Date(2015, 9, 18, 10) },
                { text: "Appointment 4", startDate: new Date(2015, 9, 19, 8), endDate: new Date(2015, 9, 19, 10) }];

    this.instance.option({
        items: items,
        focusStateEnabled: true
    });

    var $appointments = this.instance.element().find(".dx-scheduler-appointment");

    assert.equal($appointments.eq(0).attr("sortedIndex"), 0, "app has attr");
    assert.equal($appointments.eq(1).attr("sortedIndex"), 1, "app has attr");
    assert.equal($appointments.eq(2).attr("sortedIndex"), 2, "app has attr");
    assert.equal($appointments.eq(3).attr("sortedIndex"), 3, "app has attr");
});

QUnit.test("Compact parts of long appointment shouldn't have sortedIndex", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 2, 4, 2), endDate: new Date(2015, 2, 5, 3), allDay: true },
                { text: "Appointment 2", startDate: new Date(2015, 2, 4, 2), endDate: new Date(2015, 2, 5, 12), allDay: true },
                { text: "Appointment 3", startDate: new Date(2015, 2, 4, 2), endDate: new Date(2015, 2, 8, 2), allDay: true }];

    this.getCoordinates = function() {
        return [{ top: 0, left: 0 }];
    };

    this.instance.option({
        items: items,
        focusStateEnabled: true,
        currentView: "month"
    });

    var $appointments = this.instance.element().find(".dx-scheduler-appointment");

    assert.equal($appointments.eq(0).attr("sortedIndex"), 0, "app has attr");
    assert.equal($appointments.eq(1).attr("sortedIndex"), 1, "app has attr");
    assert.equal($appointments.eq(2).attr("sortedIndex"), 2, "app has attr");
    assert.equal($appointments.eq(3).attr("sortedIndex"), null, "app has attr");
    assert.equal($appointments.eq(4).attr("sortedIndex"), null, "app has attr");
    assert.equal($appointments.eq(5).attr("sortedIndex"), null, "app has attr");
    assert.equal($appointments.eq(6).attr("sortedIndex"), null, "app has attr");

});

QUnit.testInActiveWindow("Apps should be focused in right order", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 9, 16, 9), endDate: new Date(2015, 9, 16, 11) },
                    { text: "Appointment 2", startDate: new Date(2015, 9, 17, 8), endDate: new Date(2015, 9, 17, 10) },
                    { text: "Appointment 3", startDate: new Date(2015, 9, 18, 8), endDate: new Date(2015, 9, 18, 10) },
                    { text: "Appointment 4", startDate: new Date(2015, 9, 19, 8), endDate: new Date(2015, 9, 19, 10) }];

    var current = 0;
    this.getCoordinates = function() {
        var coords = [[{ top: 0, left: 200 }], [{ top: 0, left: 100 }], [{ top: 0, left: 0 }], [{ top: 0, left: 300 }]];
        return coords[current++ % coords.length];
    };

    this.instance.option({
        items: items,
        focusStateEnabled: true
    });

    var $appointments = this.instance.element().find(".dx-scheduler-appointment");
    $appointments.eq(2).trigger("focusin");

    var keyboard = keyboardMock($appointments.eq(2));
    keyboard.keyDown("tab");
    assert.deepEqual($appointments.get(1), this.instance.option("focusedElement").get(0), "app 1 in focus");

    keyboard.keyDown("tab");
    assert.deepEqual($appointments.get(0), this.instance.option("focusedElement").get(0), "app 2 in focus");

    keyboard.keyDown("tab");
    assert.deepEqual($appointments.get(3), this.instance.option("focusedElement").get(0), "app 3 in focus");

});

QUnit.test("Focus shouldn't be prevent when last appointment is reached", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 9, 16, 9), endDate: new Date(2015, 9, 16, 11) },
                    { text: "Appointment 2", startDate: new Date(2015, 9, 17, 8), endDate: new Date(2015, 9, 17, 10) },
                    { text: "Appointment 3", startDate: new Date(2015, 9, 18, 8), endDate: new Date(2015, 9, 18, 10) },
                    { text: "Appointment 4", startDate: new Date(2015, 9, 19, 8), endDate: new Date(2015, 9, 19, 10) }];

    this.instance.option({
        items: items,
        focusStateEnabled: true
    });

    var $appointments = this.instance.element().find(".dx-scheduler-appointment");
    $appointments.eq(3).trigger("focusin");

    var keyboard = keyboardMock($appointments.eq(3));

    this.instance.element().on("keydown", function(e) {
        assert.notOk(e.isDefaultPrevented(), "default tab isn't prevented");
    });

    keyboard.keyDown("tab");

    $appointments.off("keydown");
});

QUnit.test("Focus shouldn't be prevent when first appointment is reached in back order", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 9, 16, 9), endDate: new Date(2015, 9, 16, 11) },
                    { text: "Appointment 2", startDate: new Date(2015, 9, 17, 8), endDate: new Date(2015, 9, 17, 10) },
                    { text: "Appointment 3", startDate: new Date(2015, 9, 18, 8), endDate: new Date(2015, 9, 18, 10) },
                    { text: "Appointment 4", startDate: new Date(2015, 9, 19, 8), endDate: new Date(2015, 9, 19, 10) }];

    this.instance.option({
        items: items,
        focusStateEnabled: true
    });

    var $appointments = this.instance.element().find(".dx-scheduler-appointment"),
        keyboard = keyboardMock($appointments.eq(0));

    this.instance.element().on("keydown", function(e) {
        assert.notOk(e.isDefaultPrevented(), "default tab isn't prevented");
    });

    $appointments.eq(0).trigger("focusin");
    keyboard.keyDown("tab", { shiftKey: true });

    $appointments.off("keydown");

});

QUnit.testInActiveWindow("Apps should be focused in back order while press shift+tab", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 9, 16, 9), endDate: new Date(2015, 9, 16, 11) },
                    { text: "Appointment 2", startDate: new Date(2015, 9, 17, 8), endDate: new Date(2015, 9, 17, 10) },
                    { text: "Appointment 3", startDate: new Date(2015, 9, 18, 8), endDate: new Date(2015, 9, 18, 10) },
                    { text: "Appointment 4", startDate: new Date(2015, 9, 19, 8), endDate: new Date(2015, 9, 19, 10) }];

    this.instance.option({
        items: items,
        focusStateEnabled: true
    });

    var $appointments = this.instance.element().find(".dx-scheduler-appointment"),
        keyboard = keyboardMock($appointments.eq(0));

    $appointments.eq(3).trigger("focusin");
    keyboard.keyDown("tab", { shiftKey: true });
    assert.deepEqual($appointments.get(2), this.instance.option("focusedElement").get(0), "app 1 in focus");

    keyboard.keyDown("tab", { shiftKey: true });
    assert.deepEqual($appointments.get(1), this.instance.option("focusedElement").get(0), "app 1 in focus");

    keyboard.keyDown("tab", { shiftKey: true });
    assert.deepEqual($appointments.get(0), this.instance.option("focusedElement").get(0), "app 1 in focus");
});
