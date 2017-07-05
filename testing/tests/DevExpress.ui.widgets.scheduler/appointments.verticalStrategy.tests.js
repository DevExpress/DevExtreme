"use strict";

var pointerMock = require("../../helpers/pointerMock.js");

var $ = require("jquery"),
    DropDownAppointments = require("ui/scheduler/ui.scheduler.appointments.drop_down"),
    translator = require("animation/translator"),
    dataCoreUtils = require("core/utils/data"),
    commonUtils = require("core/utils/common"),
    compileGetter = dataCoreUtils.compileGetter,
    compileSetter = dataCoreUtils.compileSetter,
    Widget = require("ui/widget/ui.widget"),
    fx = require("animation/fx");

require("ui/scheduler/ui.scheduler");

QUnit.testStart(function() {
    $("#qunit-fixture").html('<div id="scheduler-appointments"></div>\
                                <div id="allDayContainer"></div>\
                                <div id="fixedContainer"></div>');
});

var CELL_OFFSET = 25,
    CELL_BORDER_OFFSET = 1;

var moduleOptions = {
    beforeEach: function() {
        fx.off = true;

        this.coordinates = [{ top: 0, left: 0 }];
        this.getCoordinates = function() {
            return this.coordinates;
        };
        this.clock = sinon.useFakeTimers();
        this.cellWidth = 30;
        this.cellHeight = 20;
        this.allDayHeight = 20;
        this.compactAppointmentOffset = 3;

        this.appWidth = function(appInCellCount) {
            appInCellCount = appInCellCount || 1;
            return (this.cellWidth - CELL_OFFSET) / appInCellCount;
        };

        this.appCoordinates = function(appInCellIndex, appInCellCount, startTopCoord, startLeftCoord) {
            appInCellCount = appInCellCount || 1;
            appInCellIndex = appInCellIndex || 0;
            startTopCoord = startTopCoord || 0;
            startLeftCoord = startLeftCoord || 0;

            var topCoord = startTopCoord,
                leftCoord = startLeftCoord + ((this.cellWidth - CELL_OFFSET) / appInCellCount) * appInCellIndex;

            return { top: topCoord, left: leftCoord };
        };

        this.instance = $("#scheduler-appointments").dxSchedulerAppointments().dxSchedulerAppointments("instance");

        this.instance.notifyObserver = $.proxy(function(command, options) {
            if(command === "needCoordinates") {
                options.callback(this.getCoordinates.apply(this));
            }

            if(command === "getCellDimensions") {
                options.callback(this.cellWidth, this.cellHeight, this.allDayHeight);
            }
            if(command === "renderDropDownAppointments") {

                var $menu = $("<div>").appendTo("#qunit-fixture #scheduler-appointments");

                return new DropDownAppointments().render({
                    $container: $menu,
                    coordinates: options.coordinates,
                    items: options.items,
                    color: options.color,
                    itemTemplate: options.itemTemplate,
                    buttonWidth: options.buttonWidth
                }, new (Widget.inherit({
                    fire: function() { }
                }))($("<div>")));
            }
            if(command === "getAppointmentColor") {
                options.callback($.Deferred().resolve("red").promise());
            }
            if(command === "getResourceForPainting") {
                options.callback({ field: "roomId" });
            }
            if(command === "getAppointmentDurationInMs") {
                options.callback(options.endDate.getTime() - options.startDate.getTime());
            }
        }, this);

        this.instance.invoke = $.proxy(function(command, field, obj, value) {
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
            if(command === "getField") {
                if(!commonUtils.isDefined(dataAccessors.getter[field])) {
                    return;
                }

                return dataAccessors.getter[field](obj);
            }
            if(command === "setField") {
                return dataAccessors.setter[field](obj, value);
            }
            if(command === "prerenderFilter") {
                return this.instance.option("items");
            }
            if(command === "convertDateByTimezone") {
                return field;
            }
        }, this);
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

QUnit.module("Vertical Strategy", moduleOptions);

QUnit.test("Two rival appointments should have correct positions", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10) },
    { text: "Appointment 2", startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 10) }];

    this.getCoordinates = function() {
        return [{ top: 0, left: 0 }];
    };
    this.instance.option("items", items);

    var $appointment = this.instance.element().find(".dx-scheduler-appointment");
    assert.equal($appointment.length, 2, "All appointments are rendered");
    assert.deepEqual(translator.locate($appointment.eq(0)), this.appCoordinates(0, 2), "appointment is rendered in right place");
    assert.equal($appointment.eq(0).outerWidth(), this.appWidth(2), "appointment has a right size");
    assert.deepEqual(translator.locate($appointment.eq(1)), this.appCoordinates(1, 2), "appointment is rendered in right place");
    assert.equal($appointment.eq(1).outerWidth(), this.appWidth(2), "appointment has a right size");
});

QUnit.test("Three rival appointments with two columns should have correct positions", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10) },
    { text: "Appointment 2", startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 10) },
    { text: "Appointment 3", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) }];

    var current = 0;
    this.getCoordinates = function() {
        var coords = [[{ top: 0, left: 0 }], [{ top: 60, left: 0 }], [{ top: 0, left: 0 }]];
        return coords[current++ % coords.length];
    };

    this.instance.option("items", items);

    var $appointment = this.instance.element().find(".dx-scheduler-appointment");
    assert.equal($appointment.length, 3, "All appointments are rendered");
    assert.deepEqual(translator.locate($appointment.eq(0)), this.appCoordinates(0, 2), "appointment is rendered in right place");
    assert.equal($appointment.eq(0).outerWidth(), this.appWidth(2), "appointment has a right size");

    assert.deepEqual(translator.locate($appointment.eq(1)), this.appCoordinates(1, 2, 60, 0), "appointment is rendered in right place");
    assert.equal($appointment.eq(1).outerWidth(), this.appWidth(2), "appointment has a right size");

    assert.deepEqual(translator.locate($appointment.eq(2)), this.appCoordinates(1, 2), "appointment is rendered in right place");
    assert.equal($appointment.eq(2).outerWidth(), this.appWidth(2), "appointment has a right size");
});

QUnit.test("Four rival appointments with three columns should have correct positions", function(assert) {
    var items = [
        { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 11) },
        { text: "Appointment 2", startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 10) },
        { text: "Appointment 3", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10) },
        { text: "Appointment 4", startDate: new Date(2015, 1, 9, 10), endDate: new Date(2015, 1, 9, 12) }
    ];

    var current = 0;

    this.getCoordinates = function() {
        var coords = [[{ top: 0, left: 0 }], [{ top: 60, left: 0 }], [{ top: 0, left: 0 }], [{ top: 120, left: 0 }]];
        return coords[current++ % coords.length];
    };
    this.cellWidth = 45;
    this.cellHeight = 30;

    this.instance.option("items", items);

    var $appointment = this.instance.element().find(".dx-scheduler-appointment");
    assert.equal($appointment.length, 4, "All appointments are rendered");
    assert.deepEqual(translator.locate($appointment.eq(0)), this.appCoordinates(0, 3), "appointment is rendered in right place");


    assert.roughEqual($appointment.eq(0).outerWidth(), this.appWidth(3), 1, "appointment has a right size");

    assert.deepEqual(translator.locate($appointment.eq(1)), this.appCoordinates(2, 3, 60, 0), "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(1).outerWidth(), this.appWidth(3), 1, "appointment has a right size");

    assert.deepEqual(translator.locate($appointment.eq(2)), this.appCoordinates(1, 3), "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(2).outerWidth(), this.appWidth(3), 1, "appointment has a right size");

    assert.deepEqual(translator.locate($appointment.eq(3)), this.appCoordinates(1, 3, 120, 0), "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(3).outerWidth(), this.appWidth(3), 1, "appointment has a right size");

});

QUnit.test("Rival duplicated appointments should have correct positions", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10) },
    { text: "Appointment 2", startDate: new Date(2015, 1, 10, 8), endDate: new Date(2015, 1, 10, 9) }];

    var current = 0;
    this.getCoordinates = function() {
        var coords = [[{ top: 0, left: 0 }, { top: 0, left: 20 }], [{ top: 0, left: 20 }]];
        return coords[current++ % coords.length];
    };
    this.cellWidth = 35;

    this.instance.option("items", items);
    var $appointment = this.instance.element().find(".dx-scheduler-appointment");
    assert.equal($appointment.length, 3, "All appointments are rendered");
    assert.deepEqual(translator.locate($appointment.eq(0)), this.appCoordinates(0, 2), "appointment is rendered in right place");
    assert.equal($appointment.eq(0).outerWidth(), this.appWidth(1), "appointment has a right size");

    assert.deepEqual(translator.locate($appointment.eq(1)), this.appCoordinates(0, 2, 0, 20), "appointment is rendered in right place");
    assert.equal($appointment.eq(1).outerWidth(), this.appWidth(2), "appointment has a right size");

    assert.deepEqual(translator.locate($appointment.eq(2)), this.appCoordinates(1, 2, 0, 20), "appointment is rendered in right place");
    assert.equal($appointment.eq(2).outerWidth(), this.appWidth(2), "appointment has a right size");
});

QUnit.test("More than 3 all-day appointments should be grouped", function(assert) {
    var items = [], i = 12;
    while(i > 0) {
        items.push({ text: i, startDate: new Date(2015, 1, 9), allDay: true });
        i--;
    }

    var current = 0;
    this.getCoordinates = function() {
        var coords = [[{ top: 0, left: 0 }], [{ top: 0, left: 30 }]];
        return coords[current++ % coords.length];
    };

    this.instance.option("renderingStrategy", "vertical");
    sinon.stub(this.instance._renderingStrategy, "_getMaxNeighborAppointmentCount").returns(3);
    this.instance.option("fixedContainer", $("#fixedContainer"));
    this.instance.option("allDayContainer", $("#allDayContainer"));
    this.instance.option("items", items);

    var $appointment = $("#allDayContainer").find(".dx-scheduler-appointment");

    assert.equal($appointment.length, 4, "Small appointments are grouped");
});

QUnit.test("Wide rival appointments should not have specific class", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 12) },
    { text: "Appointment 2", startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 12) }];

    this.getCoordinates = function() {
        return [{ top: 0, left: 0 }];
    };
    this.cellWidth = 110;
    this.instance.option("items", items);

    var $appointment = this.instance.element().find(".dx-scheduler-appointment");
    assert.ok(!$appointment.eq(0).hasClass("dx-scheduler-appointment-empty"), "appointment has not the class");
    assert.ok(!$appointment.eq(1).hasClass("dx-scheduler-appointment-empty"), "appointment has not the class");
});

QUnit.test("Narrow rival appointments should have specific class", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 12) },
    { text: "Appointment 2", startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 12) }];

    this.getCoordinates = function() {
        return [{ top: 0, left: 0 }];
    };
    this.cellWidth = 50;
    this.instance.option("items", items);

    var $appointment = this.instance.element().find(".dx-scheduler-appointment");
    assert.ok($appointment.eq(0).hasClass("dx-scheduler-appointment-empty"), "appointment has the class");
    assert.ok($appointment.eq(1).hasClass("dx-scheduler-appointment-empty"), "appointment has the class");
});

QUnit.module("Vertical All Day Strategy", {
    beforeEach: function() {
        moduleOptions.beforeEach.apply(this, arguments);
        this.cellWidth = 20;
    },
    afterEach: function() {
        moduleOptions.afterEach.apply(this, arguments);
    },
});

QUnit.test("Scheduler appointments should be rendered in right containers", function(assert) {
    this.instance.option("fixedContainer", $("#fixedContainer"));
    this.instance.option("allDayContainer", $("#allDayContainer"));
    this.instance.option("items", [{ text: "Appointment 1", startDate: new Date() }, { text: "Appointment 2", startDate: new Date(), allDay: true }]);

    assert.equal(this.instance.element().find(".dx-scheduler-appointment").length, 1, "dxSchedulerAppointments has 1 item");
    assert.equal($("#allDayContainer .dx-scheduler-appointment").length, 1, "allDayContainer has 1 item");
});

QUnit.test("Scheduler appointments should have specific allDay class if needed", function(assert) {
    this.instance.option("items", [{ text: "Appointment 2", startDate: new Date() }]);

    var $appointment = $(".dx-scheduler-appointment").eq(0);
    assert.ok(!$appointment.hasClass("dx-scheduler-all-day-appointment"), "Appointment hasn't allDay class");

    this.instance.option("fixedContainer", $("#fixedContainer"));
    this.instance.option("allDayContainer", $("#allDayContainer"));
    this.instance.option("items", [{ text: "Appointment 2", startDate: new Date(), allDay: true }]);

    $appointment = $("#allDayContainer .dx-scheduler-appointment").eq(0);
    assert.ok($appointment.hasClass("dx-scheduler-all-day-appointment"), "Appointment has allDay class");
});

QUnit.test("Two rival all day appointments should have correct sizes and positions, vertical strategy", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 1, 9), allDay: true, endDate: new Date(2015, 2, 9) },
    { text: "Appointment 2", startDate: new Date(2015, 1, 9), endDate: new Date(2015, 2, 9), allDay: true }];

    this.getCoordinates = function() {
        return [{ top: 0, left: 0 }];
    };
    this.instance.option("renderingStrategy", "vertical");
    this.instance.option("fixedContainer", $("#fixedContainer"));
    this.instance.option("allDayContainer", $("#allDayContainer"));
    this.instance.option("items", items);

    var $appointment = $("#allDayContainer .dx-scheduler-appointment");

    assert.equal($appointment.length, 2, "All appointments are rendered");
    assert.deepEqual(translator.locate($appointment.eq(0)), { top: 0, left: 0 }, "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(0).outerWidth(), 559, 1.1, "appointment has a right width");
    assert.roughEqual($appointment.eq(0).outerHeight(), 9, 1.1, "appointment has a right height");
    assert.deepEqual(translator.locate($appointment.eq(1)), { top: 10, left: 0 }, "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(1).outerWidth(), 559, 1.1, "appointment has a right width");
    assert.roughEqual($appointment.eq(1).outerHeight(), 9, 1.1, "appointment has a right height");
});

QUnit.test("All day appointments should have correct left position, vertical strategy, rtl mode", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 1, 9), endDate: new Date(2015, 2, 9), allDay: true }];

    this.getCoordinates = function() {
        return [{ top: 0, left: 0 }];
    };
    this.instance.option("rtlEnabled", true);
    this.instance.option("renderingStrategy", "vertical");
    this.instance.option("fixedContainer", $("#fixedContainer"));
    this.instance.option("allDayContainer", $("#allDayContainer"));
    this.instance.option("items", items);

    var $appointment = $("#allDayContainer .dx-scheduler-appointment"),
        appointmentPosition = translator.locate($appointment.eq(0));

    assert.equal($appointment.length, 1, "Appointment was rendered");
    assert.roughEqual(appointmentPosition.left, -$appointment.outerWidth(), 2, "Appointment left coordinate has been adjusted ");
});

QUnit.test("Four rival all day appointments should have correct sizes and positions, week strategy", function(assert) {
    var items = [{ text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10), allDay: true },
    { text: "Appointment 2", startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 10), allDay: true },
    { text: "Appointment 3", startDate: new Date(2015, 1, 9, 10), endDate: new Date(2015, 1, 9, 12), allDay: true },
    { text: "Appointment 4", startDate: new Date(2015, 1, 9, 12), endDate: new Date(2015, 1, 9, 14), allDay: true }];

    this.getCoordinates = function() {
        return [{ top: 0, left: 0 }];
    };

    sinon.stub(this.instance._renderingStrategy, "_getMaxNeighborAppointmentCount").returns(4);

    this.instance.option("fixedContainer", $("#fixedContainer"));
    this.instance.option("allDayContainer", $("#allDayContainer"));
    this.instance.option("items", items);

    var $appointment = $("#allDayContainer .dx-scheduler-appointment");

    assert.equal($appointment.length, 4, "All appointments are rendered");

    assert.roughEqual($appointment.eq(0).outerWidth(), 20, 1.1, "appointment has a right width");
    assert.roughEqual($appointment.eq(0).outerHeight(), 6, 1.1, "appointment has a right height");

    assert.roughEqual($appointment.eq(1).outerWidth(), 20, 1.1, "appointment has a right width");
    assert.roughEqual($appointment.eq(1).outerHeight(), 6, 1.1, "appointment has a right height");

    assert.roughEqual($appointment.eq(2).outerWidth(), 15, 1.1, "appointment has a right width");
    assert.roughEqual($appointment.eq(2).outerHeight(), 15, 1.1, "appointment has a right height");

    assert.roughEqual($appointment.eq(3).outerWidth(), 15, 1.1, "appointment has a right width");
    assert.roughEqual($appointment.eq(3).outerHeight(), 15, 1.1, "appointment has a right height");
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

    $("#scheduler-appointments").dxSchedulerAppointments({
        rtlEnabled: true,
        items: [item],
        fixedContainer: $("#fixedContainer"),
        allDayContainer: $("#allDayContainer")
    }).dxSchedulerAppointments("instance");

    var $appointment = $("#allDayContainer .dx-scheduler-appointment");

    var stub = sinon.stub(this.instance, "notifyObserver").withArgs("updateAppointmentAfterResize");

    var pointer = pointerMock($appointment.find(".dx-resizable-handle-left")).start();
    pointer.dragStart().drag(-20, 0).dragEnd();

    var args = stub.getCall(0).args;

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: $("#allDayContainer .dx-scheduler-appointment")
    });
});

QUnit.test("AllDay appointment should be displayed right when endDate > startDate and duration < 24", function(assert) {
    var items = [{ text: "a", allDay: true, startDate: new Date(2015, 2, 5, 10), endDate: new Date(2015, 2, 6, 6) }];

    this.getCoordinates = function() {
        return [{ top: 0, left: 0 }];
    };

    this.cellWidth = 20;
    this.instance.option("allDayContainer", $("#allDayContainer"));
    this.instance.option("items", items);

    var $appointment = $("#allDayContainer .dx-scheduler-appointment"),
        allDayAppointmentWidth = this.cellWidth * 2;

    assert.equal($appointment.eq(0).outerWidth(), allDayAppointmentWidth, "appointment has right width");
});

QUnit.test("Parts of long compact appt should have right positions", function(assert) {
    var items = [{ text: "Task 1", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0), allDay: true },
        { text: "Task 2", startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0), allDay: true },
        { text: "Task 4", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 8, 2, 0), allDay: true }];

    this.getCoordinates = function() {
        return [{ top: 0, left: 0 }];
    };

    this.cellWidth = 100;
    this.instance.option("renderingStrategy", "vertical");
    this.instance.option("items", items);

    var $appointment = this.instance.element().find(".dx-scheduler-appointment"),
        gap = this.compactAppointmentOffset,
        cellWidth = this.cellWidth;

    for(var i = 2; i < $appointment.length; i++) {
        assert.deepEqual($appointment.eq(i).outerWidth(), 15, "appointment has a right size");
        assert.deepEqual(translator.locate($appointment.eq(i)), { top: gap, left: gap + (CELL_BORDER_OFFSET + cellWidth) * (i - 2) }, "part has right position");
    }
});

QUnit.test("Original start date for recurring all day appt should be correct(T408509)", function(assert) {
    var startDate = new Date(2015, 2, 4, 2, 30).toString(),
        needCoordinatesStub = sinon.stub(this.instance, "notifyObserver").withArgs("needCoordinates");

    sinon.stub(this.instance, "_getStartDate", function(apptData, skipNormalize) {
        return !skipNormalize ? new Date(new Date(apptData.startDate).setHours(0, 0, 0, 0)) : new Date(apptData.startDate);
    });

    this.instance.option("renderingStrategy", "vertical");
    this.instance.option("items", [{ text: "Task 1", startDate: startDate, endDate: new Date(2015, 2, 4, 3, 0), allDay: true, recurrenceRule: "FREQ=DAILY" }]);

    var originalStartDate = needCoordinatesStub.getCall(0).args[1].originalStartDate;

    assert.strictEqual(originalStartDate.toString(), startDate, "Original start date is defined");
});
