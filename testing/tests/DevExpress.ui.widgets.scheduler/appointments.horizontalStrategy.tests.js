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

var moduleOptions = {
    beforeEach: function() {
        fx.off = true;

        this.clock = sinon.useFakeTimers();
        this.width = 20;
        this.height = 20;
        this.allDayHeight = 20;
        this.compactAppointmentOffset = 3;
        this.viewStartDate = undefined;
        this.dropDownAppointments = new DropDownAppointments();
        this.coordinates = [{ top: 0, left: 0 }];
        this.getCoordinates = function() {
            return this.coordinates;
        };
        this.instance = $("#scheduler-appointments").dxSchedulerAppointments().dxSchedulerAppointments("instance");

        this.instance.notifyObserver = $.proxy(function(command, options) {
            if(command === "needCoordinates") {
                options.callback(this.getCoordinates.apply(this));
            }

            if(command === "getCellDimensions") {
                options.callback(this.width, this.height, this.allDayHeight);
            }

            if(command === "getFullWeekAppointmentWidth") {
                options.callback(this.fullWeekAppointmentWidth);
            }

            if(command === "getMaxAppointmentWidth") {
                options.callback(this.maxAppointmentWidth);
            }

            if(command === "renderDropDownAppointments") {
                var $menu = $("<div>").appendTo("#qunit-fixture #scheduler-appointments");

                return this.dropDownAppointments.render({
                    $container: $menu,
                    coordinates: options.coordinates,
                    items: options.items,
                    buttonColor: options.buttonColor,
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
            if(command === "updateAppointmentStartDate") {
                this.viewStartDate && options.callback(this.viewStartDate);
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
            if(command === "getEndDayHour") {
                if(this.instance.option("renderingStrategy") === "horizontalMonthLine") {
                    return 24;
                } else {
                    return 20;
                }
            }
            if(command === "getStartDayHour") {
                if(this.instance.option("renderingStrategy") === "horizontalMonthLine") {
                    return 0;
                } else {
                    return 8;
                }
            }
                // TODO: rename arguments
            if(command === "processDateDependOnTimezone") {
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

(function() {

    QUnit.module("Horizontal Month Strategy", moduleOptions);

    QUnit.test("AllDay appointment should be displayed right when endDate > startDate and duration < 24", function(assert) {
        var items = [{ text: "a", allDay: true, startDate: new Date(2015, 2, 5, 10), endDate: new Date(2015, 2, 6, 6) }];

        this.getCoordinates = function() {
            return [{ top: 0, left: 0 }];
        };
        this.width = 20;
        this.items = items;
        this.instance.option("items", items);

        var $appointment = this.instance.element().find(".dx-scheduler-appointment"),
            allDayAppointmentWidth = this.width * 2;
        assert.equal($appointment.eq(0).outerWidth(), allDayAppointmentWidth, "appointment has right width");
    });

    QUnit.test("Appointment should not be multiweek when its width some more than maxAllowedPosition(ie & ff pixels)", function(assert) {
        this.fullWeekAppointmentWidth = 140;
        this.maxAppointmentWidth = 500;
        this.coordinates = [{ top: 0, left: 0, max: 135 }];
        var item = { text: "Appointment 1", startDate: new Date(2015, 2, 1), endDate: new Date(2015, 2, 8) };

        this.items = [item];

        this.instance.option({
            items: [item],
            renderingStrategy: "horizontalMonth"
        });

        var $appointment = this.instance.element().find(".dx-scheduler-appointment");

        assert.equal($appointment.length, 1, "appointment is not multiline");
    });

    QUnit.test("End date of appointment should be changed сonsidering endDayHour and startDayHour when resize is finished, month view", function(assert) {
        var item = { text: "Appointment 1", startDate: new Date(2015, 1, 9, 10), endDate: new Date(2015, 1, 9, 19) },
            updatedItem = $.extend({}, item, { endDate: new Date(2015, 1, 10, 19) });

        this.items = [item];
        this.instance.option({
            items: [item],
            renderingStrategy: "horizontalMonth"
        });

        var stub = sinon.stub(this.instance, "notifyObserver").withArgs("updateAppointmentAfterResize");

        var pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-right")).start();
        pointer.dragStart().drag(20, 0).dragEnd();

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

    QUnit.test("Start date of appointment should be changed сonsidering endDayHour and startDayHour when resize is finished, month view", function(assert) {
        var item = { text: "Appointment 1", startDate: new Date(2015, 1, 9, 10), endDate: new Date(2015, 1, 9, 19) },
            updatedItem = $.extend({}, item, { startDate: new Date(2015, 1, 8, 10) });

        this.items = [item];
        this.instance.option({
            items: [item],
            renderingStrategy: "horizontalMonth"
        });

        var stub = sinon.stub(this.instance, "notifyObserver").withArgs("updateAppointmentAfterResize");

        var pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-left")).start();
        pointer.dragStart().drag(-20, 0).dragEnd();

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

    QUnit.test("Start date of the long-time reduced appointment should be changed correctly when resize is finished", function(assert) {
        this.coordinates = [{ top: 0, left: 0, max: 140 }];
        var item = { text: "Appointment 1", startDate: new Date(2015, 2, 15, 0), endDate: new Date(2015, 2, 23, 0) },
            updatedItem = $.extend({}, item, { startDate: new Date(2015, 2, 11, 0) });

        this.items = [item];

        this.instance.option({
            items: [item],
            renderingStrategy: "horizontalMonth"
        });

        var stub = sinon.stub(this.instance, "notifyObserver").withArgs("updateAppointmentAfterResize");

        var pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-left")).start();
        pointer.dragStart().drag(-80, 0).dragEnd();

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

    QUnit.test("Two rival appointments should have correct positions", function(assert) {
        var items = [{ text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10) },
        { text: "Appointment 2", startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 10) }];

        this.getCoordinates = function() {
            return [{ top: 0, left: 0 }];
        };
        this.items = items;
        this.instance.option("renderingStrategy", "horizontalMonth");
        this.instance.option("items", items);

        var $appointment = this.instance.element().find(".dx-scheduler-appointment");
        assert.equal($appointment.length, 2, "All appointments are rendered");
        assert.deepEqual(translator.locate($appointment.eq(0)), { top: 8, left: 0 }, "appointment is rendered in right place");
        assert.equal($appointment.eq(0).outerWidth(), 20, "appointment has a right size");
        assert.deepEqual(translator.locate($appointment.eq(1)), { top: 14, left: 0 }, "appointment is rendered in right place");
        assert.equal($appointment.eq(1).outerWidth(), 20, "appointment has a right size");
    });

    QUnit.test("Collapsing appointments should have specific class", function(assert) {
        var items = [{ text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 12) },
        { text: "Appointment 2", startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 12) },
        { text: "Appointment 3", startDate: new Date(2015, 1, 9, 11), endDate: new Date(2015, 1, 9, 12) }];

        this.getCoordinates = function() {
            return [{ top: 0, left: 0 }];
        };
        this.width = 150;
        this.height = 200;
        this.instance.option("renderingStrategy", "horizontalMonth");
        this.items = items;
        this.instance.option("items", items);

        var $appointment = this.instance.element().find(".dx-scheduler-appointment");
        assert.ok(!$appointment.eq(0).hasClass("dx-scheduler-appointment-empty"), "appointment has not the class");
        assert.ok(!$appointment.eq(1).hasClass("dx-scheduler-appointment-empty"), "appointment has not the class");
        assert.ok($appointment.eq(2).hasClass("dx-scheduler-appointment-empty"), "appointment has the class");
    });

    QUnit.test("Small width appointments should have specific class", function(assert) {
        var items = [{ text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 12) }];

        this.getCoordinates = function() {
            return [{ top: 0, left: 0 }];
        };
        this.width = 20;
        this.items = items;
        this.instance.option("renderingStrategy", "horizontalMonth");
        this.instance.option("items", items);

        var $appointment = this.instance.element().find(".dx-scheduler-appointment");
        assert.ok($appointment.eq(0).hasClass("dx-scheduler-appointment-empty"), "appointment has the class");
    });

    QUnit.test("Small height appointments should have specific class", function(assert) {
        var items = [{ text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 12) }];

        this.getCoordinates = function() {
            return [{ top: 0, left: 0 }];
        };
        this.width = 400;
        this.height = 30;
        this.items = items;
        this.instance.option("renderingStrategy", "horizontalMonth");
        this.instance.option("items", items);

        var $appointment = this.instance.element().find(".dx-scheduler-appointment");
        assert.ok($appointment.eq(0).hasClass("dx-scheduler-appointment-empty"), "appointment has the class");
    });

    QUnit.test("Four rival appointments should have correct positions", function(assert) {
        var items = [{ text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 12) },
        { text: "Appointment 2", startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 12) },
        { text: "Appointment 3", startDate: new Date(2015, 1, 9, 11), endDate: new Date(2015, 1, 9, 12) },
        { text: "Appointment 4", startDate: new Date(2015, 1, 9, 10), endDate: new Date(2015, 1, 9, 12) }];

        this.getCoordinates = function() {
            return [{ top: 0, left: 0 }];
        };
        this.items = items;
        this.instance.option("renderingStrategy", "horizontalMonth");

        sinon.stub(this.instance._renderingStrategy, "_getMaxNeighborAppointmentCount").returns(4);

        this.instance.option("items", items);

        var $appointment = this.instance.element().find(".dx-scheduler-appointment");
        assert.equal($appointment.length, 4, "All appointments are rendered");
        assert.deepEqual(translator.locate($appointment.eq(0)), { top: 8, left: 0 }, "appointment is rendered in right place");
        assert.equal($appointment.eq(0).outerWidth(), 20, "appointment has a right size");
        assert.deepEqual(translator.locate($appointment.eq(1)), { top: 14, left: 0 }, "appointment is rendered in right place");
        assert.equal($appointment.eq(1).outerWidth(), 20, "appointment has a right size");

        assert.deepEqual(translator.locate($appointment.eq(2)), { top: 3, left: 3 }, "appointment is rendered in right place");
        assert.equal($appointment.eq(2).outerHeight(), 15, "appointment has a right size");
        assert.equal($appointment.eq(2).outerWidth(), 15, "appointment has a right size");
        assert.deepEqual(translator.locate($appointment.eq(3)), { top: 3, left: 21 }, "appointment is rendered in right place");
        assert.equal($appointment.eq(3).outerHeight(), 15, "appointment has a right size");
        assert.equal($appointment.eq(3).outerWidth(), 15, "appointment has a right size");
    });


    QUnit.test("Rival duplicated appointments should have correct positions", function(assert) {
        var items = [{ text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10) },
        { text: "Appointment 2", startDate: new Date(2015, 1, 10, 8), endDate: new Date(2015, 1, 10, 9) }];

        var current = 0;
        this.getCoordinates = function() {
            var coords = [[{ top: 0, left: 0 }, { top: 0, left: 30 }], [{ top: 0, left: 30 }]];
            return coords[current++ % coords.length];
        };
        this.items = items;

        this.instance.option("renderingStrategy", "horizontalMonth");
        this.instance.option("items", items);
        var $appointment = this.instance.element().find(".dx-scheduler-appointment");
        assert.equal($appointment.length, 3, "All appointments are rendered");
        assert.deepEqual(translator.locate($appointment.eq(0)), { top: 8, left: 0 }, "appointment is rendered in right place");
        assert.equal($appointment.eq(0).outerWidth(), 20, "appointment has a right size");

        assert.deepEqual(translator.locate($appointment.eq(1)), { top: 8, left: 30 }, "appointment is rendered in right place");
        assert.equal($appointment.eq(1).outerWidth(), 20, "appointment has a right size");

        assert.deepEqual(translator.locate($appointment.eq(2)), { top: 14, left: 30 }, "appointment is rendered in right place");
        assert.equal($appointment.eq(2).outerWidth(), 20, "appointment has a right size");
    });

    QUnit.test("More than 3 small appointments should be grouped", function(assert) {
        var items = [], i = 12;
        while(i > 0) {
            items.push({ text: i, startDate: new Date(2015, 1, 9) });
            i--;
        }

        var current = 0;
        this.getCoordinates = function() {
            var coords = [[{ top: 0, left: 0 }], [{ top: 0, left: 30 }]];
            return coords[current++ % coords.length];
        };
        this.items = items;
        this.instance.option("renderingStrategy", "horizontalMonth");
        sinon.stub(this.instance._renderingStrategy, "_getMaxNeighborAppointmentCount").returns(3);
        this.instance.option("items", items);

        var $appointment = this.instance.element().find(".dx-scheduler-appointment");

        assert.equal($appointment.length, 4, "Small appointments are grouped");
    });

    QUnit.test("More than 3 cloned appointments should be grouped", function(assert) {

        var items = [], i = 6,
            renderSpy = sinon.spy(this.dropDownAppointments, "render");
        try {
            while(i > 0) {
                items.push({ text: i, startDate: new Date(2015, 1, 9), roomId: [1, 2] });
                i--;
            }

            this.getCoordinates = function() {
                return [
                    { "top": 195, "left": 114 },
                    { "top": 195, "left": 342 },
                    { "top": 195, "left": 570 },
                    { "top": 260, "left": 0 },
                    { "top": 260, "left": 228 },
                    { "top": 260, "left": 456 },
                    { "top": 260, "left": 684 },
                    { "top": 325, "left": 114 },
                    { "top": 325, "left": 342 },
                    { "top": 325, "left": 570 }];
            };
            this.items = items;

            this.instance.option("renderingStrategy", "horizontalMonth");
            sinon.stub(this.instance._renderingStrategy, "_getMaxNeighborAppointmentCount").returns(3);
            this.instance.option("items", items);

            var $appointment = this.instance.element().find(".dx-scheduler-appointment");

            this.instance.element().find(".dx-scheduler-dropdown-appointments").last().trigger("dxclick");

            assert.equal($appointment.length, 20, "Cloned appointments are grouped");
            assert.equal(renderSpy.getCall(0).args[0].buttonColor, "red", "Color is passed to the dd menu");
        } finally {
            renderSpy.restore();
        }
    });

    QUnit.test("More than 3 small appointments should be represented via dropdown menu", function(assert) {
        var items = [], i = 12,
            renderSpy = sinon.spy(this.dropDownAppointments, "render");
        try {
            while(i > 0) {
                items.push({ text: i, startDate: new Date(2015, 1, 9) });
                i--;
            }

            var current = 0;
            this.getCoordinates = function() {
                var coords = [[{ top: 0, left: 0, cellIndex: 0 }], [{ top: 0, left: 100, cellIndex: 1 }]];
                return coords[current++ % coords.length];
            };

            this.width = 100;
            this.items = items;

            this.instance.option("renderingStrategy", "horizontalMonth");
            sinon.stub(this.instance._renderingStrategy, "_getMaxNeighborAppointmentCount").returns(3);
            this.instance.option("items", items);

            var $dropDownMenu = this.instance.element().find(".dx-scheduler-dropdown-appointments").trigger("dxclick"),
                dropDownMenu = $dropDownMenu.eq(0).dxDropDownMenu("instance"),
                groupedAppointments = dropDownMenu.option("items"),
                dropDownMenuText = dropDownMenu.option("buttonTemplate").find("span").first().text();

            assert.equal($dropDownMenu.length, 2, "DropDown menu is rendered");
            assert.equal(groupedAppointments.length, 4, "DropDown menu has correct items");
            assert.equal(dropDownMenuText, "4", "DropDown menu has correct text");
            assert.equal(renderSpy.getCall(0).args[0].buttonColor, "red", "Color is passed to the dd menu");
            assert.equal(dropDownMenu.option("buttonWidth"), 75, "DropDownMenu button width is OK");
        } finally {
            renderSpy.restore();
        }
    });

    QUnit.test("Grouped appointments should be reinitialized if datasource is changed", function(assert) {
        var items = [], i = 6;
        while(i > 0) {
            items.push({ text: i, startDate: new Date(2015, 1, 9) });
            i--;
        }

        this.getCoordinates = function() {
            return [{ top: 0, left: 30 }];
        };

        this.items = items;
        this.instance.option("renderingStrategy", "horizontalMonth");
        sinon.stub(this.instance._renderingStrategy, "_getMaxNeighborAppointmentCount").returns(3);
        this.instance.option("items", items);
        items.push({ text: "a", startDate: new Date() });
        this.instance.option("items", items);

        var $dropDownMenu = this.instance.element().find(".dx-scheduler-dropdown-appointments");

        assert.equal($dropDownMenu.length, 1, "DropDown appointments are refreshed");
    });

    QUnit.test("Parts of long compact appt should have right positions", function(assert) {
        var items = [ { text: "Task 1", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 5, 3, 0) },
            { text: "Task 2", startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 5, 12, 0) },
            { text: "Task 3", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 8, 2, 0) } ];

        this.getCoordinates = function() {
            return [{ top: 0, left: 0 }];
        };
        this.width = 114;
        this.instance.option("renderingStrategy", "horizontalMonth");
        this.items = items;
        this.instance.option("items", items);

        var $appointment = this.instance.element().find(".dx-scheduler-appointment"),
            gap = this.compactAppointmentOffset,
            cellWidth = this.width;
        for(var i = 2; i < $appointment.length; i++) {
            assert.deepEqual($appointment.eq(i).outerWidth(), 15, "appointment has a right size");
            assert.deepEqual(translator.locate($appointment.eq(i)), { top: gap, left: gap + cellWidth * (i - 2) }, "part has right position");
        }
    });

})("Horizontal Month Strategy");

(function() {

    QUnit.module("Horizontal Month Line Strategy", moduleOptions);

    QUnit.test("Start date of appointment should be changed when resize is finished", function(assert) {
        this.coordinates = [{ top: 0, left: 0, max: 140 }];
        var item = { text: "Appointment 1", startDate: new Date(2015, 1, 4, 0), endDate: new Date(2015, 1, 5, 0) },
            updatedItem = $.extend({}, item, { startDate: new Date(2015, 1, 3, 0) });

        this.items = [item];

        this.instance.option({
            items: [item],
            renderingStrategy: "horizontalMonthLine"
        });

        var stub = sinon.stub(this.instance, "notifyObserver").withArgs("updateAppointmentAfterResize");

        var pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-left")).start();
        pointer.dragStart().drag(-20, 0).dragEnd();
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

        this.items = [item];
        this.instance.option({
            items: [item],
            renderingStrategy: "horizontalMonthLine"
        });

        var stub = sinon.stub(this.instance, "notifyObserver").withArgs("updateAppointmentAfterResize");

        var pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-right")).start();
        pointer.dragStart().drag(20, 0).dragEnd();

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

        this.items = [item];

        var instance = $("#scheduler-appointments").dxSchedulerAppointments({
            rtlEnabled: true,
            items: [item],
            renderingStrategy: "horizontalMonthLine",
        }).dxSchedulerAppointments("instance");

        var stub = sinon.stub(this.instance, "notifyObserver").withArgs("updateAppointmentAfterResize");

        var pointer = pointerMock(instance.element().find(".dx-resizable-handle-left")).start();
        pointer.dragStart().drag(-20, 0).dragEnd();

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

        this.items = [item];
        var instance = $("#scheduler-appointments").dxSchedulerAppointments({
            rtlEnabled: true,
            items: [item],
            renderingStrategy: "horizontalMonthLine",
        }).dxSchedulerAppointments("instance");

        var stub = sinon.stub(this.instance, "notifyObserver").withArgs("updateAppointmentAfterResize");

        var pointer = pointerMock(instance.element().find(".dx-resizable-handle-right")).start();
        pointer.dragStart().drag(20, 0).dragEnd();

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
})("Horizontal Month Line Strategy");

(function() {
    QUnit.module("Horizontal Strategy", moduleOptions);

    QUnit.test("Start date of appointment should be changed when resize is finished", function(assert) {
        var item = { text: "Appointment 1", startDate: new Date(2015, 1, 4, 10), endDate: new Date(2015, 1, 5, 0) },
            updatedItem = $.extend({}, item, { startDate: new Date(2015, 1, 4, 9, 30) });

        this.items = [item];
        this.instance.option({
            items: [item],
            renderingStrategy: "horizontal"
        });

        var stub = sinon.stub(this.instance, "notifyObserver").withArgs("updateAppointmentAfterResize");

        var pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-left")).start();
        pointer.dragStart().drag(-20, 0).dragEnd();
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
        var item = { text: "Appointment 1", startDate: new Date(2015, 2, 15, 14), endDate: new Date(2015, 2, 23, 0) },
            updatedItem = $.extend({}, item, { startDate: new Date(2015, 2, 15, 12) });

        this.items = [item];

        this.instance.option({
            items: [item],
            renderingStrategy: "horizontal"
        });

        var stub = sinon.stub(this.instance, "notifyObserver").withArgs("updateAppointmentAfterResize");

        var pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-left")).start();
        pointer.dragStart().drag(-80, 0).dragEnd();

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

        this.items = [item];

        this.instance.option({
            items: [item],
            renderingStrategy: "horizontal"
        });

        var stub = sinon.stub(this.instance, "notifyObserver").withArgs("updateAppointmentAfterResize");

        var pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-right")).start();
        pointer.dragStart().drag(20, 0).dragEnd();

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

        this.items = [item];

        var instance = $("#scheduler-appointments").dxSchedulerAppointments({
            rtlEnabled: true,
            items: [item],
            renderingStrategy: "horizontal",
        }).dxSchedulerAppointments("instance");

        var stub = sinon.stub(this.instance, "notifyObserver").withArgs("updateAppointmentAfterResize");

        var pointer = pointerMock(instance.element().find(".dx-resizable-handle-left")).start();
        pointer.dragStart().drag(-20, 0).dragEnd();

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

        this.items = [item];

        var instance = $("#scheduler-appointments").dxSchedulerAppointments({
            rtlEnabled: true,
            items: [item],
            renderingStrategy: "horizontal",
        }).dxSchedulerAppointments("instance");

        var stub = sinon.stub(this.instance, "notifyObserver").withArgs("updateAppointmentAfterResize");

        var pointer = pointerMock(instance.element().find(".dx-resizable-handle-right")).start();
        pointer.dragStart().drag(20, 0).dragEnd();

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

        this.items = [item];
        this.instance.option({
            items: [item],
            renderingStrategy: "horizontal"
        });

        var stub = sinon.stub(this.instance, "notifyObserver").withArgs("updateAppointmentAfterResize");

        var pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-right")).start();
        pointer.dragStart().drag(120, 0).dragEnd();

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

        this.items = [item];
        this.instance.option({
            items: [item],
            renderingStrategy: "horizontal"
        });

        var stub = sinon.stub(this.instance, "notifyObserver").withArgs("updateAppointmentAfterResize");

        var pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-left")).start();
        pointer.dragStart().drag(-80, 0).dragEnd();

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

        this.items = [item];
        this.instance.option({
            items: [item],
            renderingStrategy: "horizontal"
        });

        var stub = sinon.stub(this.instance, "notifyObserver").withArgs("updateAppointmentAfterResize");

        var pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-left")).start(),
            cellsCount = 15 * 2;
        pointer.dragStart().drag(-cellsCount * this.width, 0).dragEnd();

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

        this.items = [item];
        this.instance.option({
            items: [item],
            renderingStrategy: "horizontal"
        });

        var stub = sinon.stub(this.instance, "notifyObserver").withArgs("updateAppointmentAfterResize");

        var pointer = pointerMock(this.instance.element().find(".dx-resizable-handle-right")).start(),
            cellsCount = 15 * 2;
        pointer.dragStart().drag(cellsCount * this.width, 0).dragEnd();

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

        this.getCoordinates = function() {
            return [{ top: 10, left: 0 }];
        };

        this.height = 200;
        this.items = items;

        this.instance.option("renderingStrategy", "horizontal");

        sinon.stub(this.instance._renderingStrategy, "_getMaxNeighborAppointmentCount").returns(4);

        this.instance.option("items", items);

        var $appointment = this.instance.element().find(".dx-scheduler-appointment");
        assert.equal($appointment.length, 4, "All appointments are rendered");

        assert.deepEqual(translator.locate($appointment.eq(0)), { top: 10, left: 0 }, "appointment is rendered in right place");
        assert.deepEqual(translator.locate($appointment.eq(1)), { top: 55, left: 0 }, "appointment is rendered in right place");
        assert.deepEqual(translator.locate($appointment.eq(2)), { top: 100, left: 0 }, "appointment is rendered in right place");
        assert.deepEqual(translator.locate($appointment.eq(3)), { top: 145, left: 0 }, "appointment is rendered in right place");
    });

    QUnit.test("Four rival appointments should have correct sizes", function(assert) {
        var items = [{ text: "Appointment 1", startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2) },
        { text: "Appointment 2", startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2) },
        { text: "Appointment 3", startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2) },
        { text: "Appointment 4", startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2) }];

        this.getCoordinates = function() {
            return [{ top: 0, left: 0 }];
        };

        this.height = 200;
        this.width = 50;
        this.items = items;

        this.instance.option("renderingStrategy", "horizontal");

        sinon.stub(this.instance._renderingStrategy, "_getMaxNeighborAppointmentCount").returns(4);

        this.instance.option("items", items);

        var $appointment = this.instance.element().find(".dx-scheduler-appointment");

        assert.equal($appointment.eq(0).outerWidth(), 100, "appointment has a right size");
        assert.equal($appointment.eq(0).outerHeight(), 45, "appointment has a right size");

        assert.equal($appointment.eq(1).outerWidth(), 100, "appointment has a right size");
        assert.equal($appointment.eq(1).outerHeight(), 45, "appointment has a right size");

        assert.equal($appointment.eq(2).outerWidth(), 100, "appointment has a right size");
        assert.equal($appointment.eq(2).outerHeight(), 45, "appointment has a right size");

        assert.equal($appointment.eq(3).outerWidth(), 100, "appointment has a right size");
        assert.equal($appointment.eq(3).outerHeight(), 45, "appointment has a right size");
    });

    QUnit.test("All-day appointment should have a correct css class", function(assert) {
        var items = [{
            text: "Appointment 1",
            startDate: new Date(2015, 1, 9, 1),
            endDate: new Date(2015, 1, 9, 2),
            allDay: true
        }];

        this.getCoordinates = function() {
            return [{ top: 0, left: 0 }];
        };

        this.height = 200;
        this.width = 50;
        this.items = items;

        this.instance.option("renderingStrategy", "horizontal");

        sinon.stub(this.instance._renderingStrategy, "_getMaxNeighborAppointmentCount").returns(4);

        this.instance.option("items", items);

        var $appointment = this.instance.element().find(".dx-scheduler-appointment");

        assert.ok($appointment.eq(0).hasClass("dx-scheduler-all-day-appointment"), "Appointment has a right css class");
    });

    QUnit.test("Appointment should have a correct min width", function(assert) {
        this.instance.option("renderingStrategy", "horizontal");

        var width = this.instance._renderingStrategy.calculateAppointmentWidth({
            text: "Appointment 1",
            startDate: new Date(2015, 3, 1, 22, 30, 55),
            endDate: new Date(2015, 3, 1, 22, 31)
        });

        assert.equal(width, 2, "Min width is OK");
    });

})("Horizontal Strategy");
