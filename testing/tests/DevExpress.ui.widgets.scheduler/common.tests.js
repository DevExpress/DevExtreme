"use strict";

var pointerMock = require("../../helpers/pointerMock.js");

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    isRenderer = require("core/utils/type").isRenderer,
    translator = require("animation/translator"),
    devices = require("core/devices"),
    domUtils = require("core/utils/dom"),
    errors = require("ui/widget/ui.errors"),
    Color = require("color"),
    fx = require("animation/fx"),
    config = require("core/config"),
    dxSchedulerAppointmentModel = require("ui/scheduler/ui.scheduler.appointment_model"),
    dxSchedulerWorkSpace = require("ui/scheduler/ui.scheduler.work_space"),
    dxSchedulerWorkSpaceDay = require("ui/scheduler/ui.scheduler.work_space_day"),
    subscribes = require("ui/scheduler/ui.scheduler.subscribes"),
    dragEvents = require("events/drag"),
    DataSource = require("data/data_source/data_source").DataSource,
    CustomStore = require("data/custom_store"),
    SchedulerTimezones = require("ui/scheduler/ui.scheduler.timezones"),
    dataUtils = require("core/element_data"),
    keyboardMock = require("../../helpers/keyboardMock.js"),
    themes = require("ui/themes");

require("ui/scheduler/ui.scheduler");
require("common.css!");
require("generic_light.css!");

QUnit.testStart(function() {
    $("#qunit-fixture").html('<div id="scheduler"></div>');
});

(function() {
    QUnit.module("Initialization", {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();

            this.instance = $("#scheduler").dxScheduler().dxScheduler("instance");
            this.checkDateTime = function(assert, actualDate, expectedDate, messagePrefix) {
                assert.equal(actualDate.getHours(), expectedDate.getHours(), messagePrefix + "Hours're OK");
                assert.equal(actualDate.getMinutes(), expectedDate.getMinutes(), messagePrefix + "Minutes're OK");
                assert.equal(actualDate.getSeconds(), expectedDate.getSeconds(), messagePrefix + "Seconds're OK");
                assert.equal(actualDate.getMilliseconds(), expectedDate.getMilliseconds(), messagePrefix + "Milliseconds're OK");
            };
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
                }
            ];
        },
        afterEach: function() {
            this.clock.restore();
            fx.off = false;
        }
    });

    QUnit.test("Scheduler should have task model instance", function(assert) {
        var data = new DataSource({
            store: this.tasks
        });

        this.instance.option({ dataSource: data });

        assert.ok(this.instance._appointmentModel instanceof dxSchedulerAppointmentModel, "Task model is initialized on scheduler init");
        assert.ok(this.instance._appointmentModel._dataSource instanceof DataSource, "Task model has data source instance");
    });

    QUnit.test("Scheduler should work correctly when wrong timeZone was set", function(assert) {
        this.instance.option({ timeZone: "Wrong/timeZone" });

        assert.ok(true, "Widget works correctly");
    });


    QUnit.test("Scheduler shouldn't have paginate in default DataSource", function(assert) {
        this.instance.option({ dataSource: this.tasks });

        assert.notOk(this.instance._appointmentModel._dataSource.paginate(), "Paginate is false");
    });

    QUnit.test("Rendering inside invisible element", function(assert) {
        try {
            domUtils.triggerHidingEvent($("#scheduler"));
            $("#scheduler").hide();
            this.instance.option({
                dataSource: [{
                    text: "a",
                    startDate: new Date(2015, 6, 8, 8, 0),
                    endDate: new Date(2015, 6, 8, 17, 0),
                    allDay: true
                }],
                currentDate: new Date(2015, 6, 8)
            });
        } finally {
            $("#scheduler").show();
            domUtils.triggerShownEvent($("#scheduler"));
            this.clock.tick();
            assert.equal(this.instance.$element().find(".dx-scheduler-appointment").length, 1, "Appointment is rendered");
        }
    });

    QUnit.test("Data expressions should be compiled on init", function(assert) {
        var dataAccessors = this.instance._dataAccessors;

        $.each([
            "startDate",
            "endDate",
            "startDateTimeZone",
            "endDateTimeZone",
            "text",
            "description",
            "allDay",
            "recurrenceRule",
            "recurrenceException"], function(_, field) {
            assert.ok($.isFunction(dataAccessors.getter[field]), "'" + field + "' getter is OK");
            assert.ok($.isFunction(dataAccessors.setter[field]), "'" + field + "' setter is OK");
        });
    });

    QUnit.test("Data expressions should be recompiled on optionChanged", function(assert) {
        var repaintStub = sinon.stub(this.instance, "repaint");

        try {
            this.instance.option({
                "startDateExpr": "_startDate",
                "endDateExpr": "_endDate",
                "startDateTimeZoneExpr": "_startDateTimeZone",
                "endDateTimeZoneExpr": "_endDateTimeZone",
                "textExpr": "_text",
                "descriptionExpr": "_description",
                "allDayExpr": "_allDay",
                "recurrenceRuleExpr": "_recurrenceRule",
                "recurrenceExceptionExpr": "_recurrenceException"
            });

            var data = {
                startDate: new Date(2017, 2, 22),
                endDate: new Date(2017, 2, 23),
                startDateTimeZone: "America/Los_Angeles",
                endDateTimeZone: "America/Los_Angeles",
                text: "a",
                description: "b",
                allDay: true,
                recurrenceRule: "abc",
                recurrenceException: "def"
            };
            var appointment = {
                _startDate: data.startDate,
                _endDate: data.endDate,
                _startDateTimeZone: data.startDateTimeZone,
                _endDateTimeZone: data.endDateTimeZone,
                _text: data.text,
                _description: data.description,
                _allDay: data.allDay,
                _recurrenceRule: data.recurrenceRule,
                _recurrenceException: data.recurrenceException
            };

            var dataAccessors = this.instance._dataAccessors;

            $.each(dataAccessors.getter, function(name, getter) {
                assert.equal(dataAccessors.getter[name](appointment), data[name], "getter for " + name + " is OK");
            });

            $.each(dataAccessors.setter, function(name, getter) {
                dataAccessors.setter[name](appointment, "xyz");
                assert.equal(appointment["_" + name], "xyz", "setter for " + name + " is OK");
            });
        } finally {
            repaintStub.restore();
        }
    });

    QUnit.test("RecurrenceRule expression should not be compiled, if recurrenceRuleExpr = null", function(assert) {
        this.instance.option({
            "startDateExpr": "_startDate",
            "endDateExpr": "_endDate",
            "textExpr": "_text",
            "descriptionExpr": "_description",
            "allDayExpr": "_allDay",
            "recurrenceRuleExpr": null
        });

        var dataAccessors = this.instance._dataAccessors;

        assert.strictEqual(dataAccessors.getter.recurrenceRule, undefined, "getter for recurrenceRule is OK");
        assert.strictEqual(dataAccessors.setter.recurrenceRule, undefined, "setter for recurrenceRule is OK");
    });

})("Initialization");

(function() {

    function getDeltaTz(schedulerTz) {
        var defaultTz = new Date().getTimezoneOffset() / 60;
        return schedulerTz + defaultTz;
    }

    QUnit.module("Methods", {
        beforeEach: function() {
            this.createInstance = function(options) {
                this.instance = $("#scheduler").dxScheduler($.extend({
                    showCurrentTimeIndicator: false
                }, options)).dxScheduler("instance");
            };

            this.clock = sinon.useFakeTimers();

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
                }
            ];
        },
        afterEach: function() {
            this.clock.restore();
            fx.off = false;
        }
    });

    QUnit.test("Add new item", function(assert) {
        var data = new DataSource({
            store: this.tasks
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        this.clock.tick();

        this.instance.addAppointment({ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: "caption" });
        this.clock.tick();
        assert.ok(this.instance.option("dataSource").items().length === 3, "new item is added");
    });

    QUnit.test("Add new item with empty text", function(assert) {
        var data = new DataSource({
            store: this.tasks
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        this.clock.tick();

        this.instance.addAppointment({ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17) });
        this.clock.tick();
        assert.ok(this.instance.option("dataSource").items()[2].text === "", "new item was added with correct text");
    });

    QUnit.test("Add new item when timezone doesn't equal to the default value", function(assert) {
        var currentDevice = devices.current(),
            isWinPhone = currentDevice.deviceType === "phone" && currentDevice.platform === "win";

        if(!isWinPhone) {
            var data = [],
                deltaTz = getDeltaTz(5);

            this.createInstance({
                currentDate: new Date(2015, 1, 9),
                dataSource: data,
                timeZone: 5
            });

            this.instance.addAppointment({ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: "first" });

            assert.deepEqual(data[0].startDate, new Date(2015, 1, 9, 16 - deltaTz), "Start date is OK");
            assert.deepEqual(data[0].endDate, new Date(2015, 1, 9, 17 - deltaTz), "End date is OK");

            this.instance.addAppointment({ startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 0, 30), text: "second" });
            this.instance.addAppointment({ startDate: new Date(2015, 1, 9, 23, 30), endDate: new Date(2015, 1, 9, 23, 59), text: "third" });

            var $appointments = $(this.instance.$element().find(".dx-scheduler-appointment"));
            assert.equal($appointments.length, 3, "All appts are rendered");
        } else {
            assert.ok(true);
        }
    });

    QUnit.test("Add new item when timezone doesn't equal to the default value, startDay and endDay hours are set", function(assert) {
        var data = [],
            deltaTz = getDeltaTz(10);

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data,
            timezone: 5,
            startDayHour: 3,
            endDayHour: 20,
            timeZone: 10
        });

        this.instance.addAppointment({ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: "first" });

        assert.deepEqual(data[0].startDate, new Date(2015, 1, 9, 16 - deltaTz), "Start date is OK");
        assert.deepEqual(data[0].endDate, new Date(2015, 1, 9, 17 - deltaTz), "End date is OK");

        this.instance.addAppointment({ startDate: new Date(2015, 1, 9, 3, 30), endDate: new Date(2015, 1, 9, 4), text: "second" });
        this.instance.addAppointment({ startDate: new Date(2015, 1, 9, 19), endDate: new Date(2015, 1, 9, 19, 30), text: "third" });

        var $appointments = $(this.instance.$element().find(".dx-scheduler-appointment"));
        assert.equal($appointments.length, 3, "All appts are rendered");
    });

    QUnit.test("Add new item when timezone doesn't equal to the default value, negative value", function(assert) {
        var currentDevice = devices.current(),
            isWinPhone = currentDevice.deviceType === "phone" && currentDevice.platform === "win";

        if(!isWinPhone) {
            var data = [],
                deltaTz = getDeltaTz(-7);

            this.createInstance({
                currentDate: new Date(2015, 1, 9),
                dataSource: data,
                timeZone: -7
            });

            this.instance.addAppointment({
                startDate: new Date(2015, 1, 9, 16),
                endDate: new Date(2015, 1, 9, 17),
                text: "first"
            });

            assert.deepEqual(data[0].startDate, new Date(new Date(2015, 1, 9).setHours(16 - deltaTz)), "Start date is OK");
            assert.deepEqual(data[0].endDate, new Date(new Date(2015, 1, 9).setHours(17 - deltaTz)), "End date is OK");

            this.instance.addAppointment({ startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 0, 30), text: "second" });
            this.instance.addAppointment({ startDate: new Date(2015, 1, 9, 23, 30), endDate: new Date(2015, 1, 9, 23, 59), text: "third" });

            var $appointments = $(this.instance.$element().find(".dx-scheduler-appointment"));
            assert.equal($appointments.length, 3, "All appts are rendered");
        } else {
            assert.ok(true);
        }
    });

    QUnit.test("Add new item when timezone doesn't equal to the default value, negative value, startDay and endDay hours are set", function(assert) {
        var data = [],
            deltaTz = getDeltaTz(-7);

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data,
            timezone: 5,
            startDayHour: 3,
            endDayHour: 20,
            timeZone: -7
        });

        this.instance.addAppointment({
            startDate: new Date(2015, 1, 9, 16),
            endDate: new Date(2015, 1, 9, 17),
            text: "first"
        });

        assert.deepEqual(data[0].startDate, new Date(new Date(2015, 1, 9).setHours(16 - deltaTz)), "Start date is OK");
        assert.deepEqual(data[0].endDate, new Date(new Date(2015, 1, 9).setHours(17 - deltaTz)), "End date is OK");

        this.instance.addAppointment({ startDate: new Date(2015, 1, 9, 3, 30), endDate: new Date(2015, 1, 9, 4), text: "second" });
        this.instance.addAppointment({ startDate: new Date(2015, 1, 9, 19), endDate: new Date(2015, 1, 9, 19, 30), text: "third" });

        var $appointments = $(this.instance.$element().find(".dx-scheduler-appointment"));
        assert.equal($appointments.length, 3, "All appts are rendered");
    });

    QUnit.test("Add new item when timezone doesn't equal to the default value and set as string", function(assert) {
        this.clock.restore();
        var data = [],
            deltaTz = getDeltaTz(4);

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data,
            timeZone: "Asia/Muscat"
        });

        this.instance.addAppointment({ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17) });

        assert.deepEqual(data[0].startDate, new Date(2015, 1, 9, 16 - deltaTz), "Start date is OK");
        assert.deepEqual(data[0].endDate, new Date(2015, 1, 9, 17 - deltaTz), "End date is OK");
    });

    QUnit.test("Update item", function(assert) {
        var data = new DataSource({
            store: this.tasks
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        this.clock.tick();

        var newTask = { startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: "caption" };

        this.instance.updateAppointment(this.tasks[0], newTask);
        this.clock.tick();

        assert.deepEqual(this.instance.option("dataSource").items()[0], newTask, "item is updated");
    });

    QUnit.test("Updated item should be rerendered", function(assert) {
        var data = new DataSource({
            store: this.tasks
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        this.clock.tick();

        var newTask = {
            text: "Task 11",
            startDate: new Date(2015, 1, 9, 1, 0),
            endDate: new Date(2015, 1, 9, 2, 0)
        };

        this.instance.option("onAppointmentRendered", function() {
            assert.ok(true, "Updated item was rerendered");
        });
        this.instance.updateAppointment(this.tasks[0], newTask);
        this.clock.tick();
    });

    QUnit.test("Updated item should be rerendered if it's coordinates weren't changed (T650811)", function(assert) {
        var data = new DataSource({
            store: [this.tasks[0]]
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        this.clock.tick();

        var newTask = {
            allDay: undefined,
            text: "Task 11",
            startDate: new Date(2015, 1, 9, 1, 0),
            endDate: new Date(2015, 1, 9, 2, 0)
        };

        this.instance.option("onAppointmentRendered", function() {
            assert.ok(true, "Updated item was rerendered");
        });

        this.instance.updateAppointment(this.tasks[0], newTask);

        this.clock.tick();
    });

    QUnit.test("Other appointments should not be rerendered after update item", function(assert) {
        var data = new DataSource({
            store: this.tasks
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        this.clock.tick();

        var newTask = { startDate: new Date(2015, 1, 9, 2, 0), endDate: new Date(2015, 1, 9, 3, 0), text: "caption" },
            counter = 0;

        this.instance.option({ onAppointmentRendered: function(args) {
            counter++;
        } });

        this.instance.updateAppointment(this.tasks[0], newTask);
        this.clock.tick();

        assert.deepEqual(this.instance.option("dataSource").items()[0], newTask, "item is updated");
        assert.equal(counter, 1, "Only updated appointment was rerendered");
    });

    QUnit.test("Update item when custom timeZone was set", function(assert) {
        var data = new DataSource({
            store: this.tasks
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data,
            timeZone: 5
        });

        this.clock.tick();

        var newTask = { startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: "caption" };

        this.instance.updateAppointment(this.tasks[0], newTask);
        this.clock.tick();

        assert.deepEqual(this.instance.option("dataSource").items()[0], newTask, "item is updated");
    });

    QUnit.test("Update item when custom timeZone was set as string", function(assert) {
        var data = new DataSource({
            store: this.tasks
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data,
            timeZone: "Asia/Muscat"
        });

        this.clock.tick();

        var newTask = { startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: "caption" };

        this.instance.updateAppointment(this.tasks[0], newTask);
        this.clock.tick();

        assert.deepEqual(this.instance.option("dataSource").items()[0], newTask, "item is updated");
    });

    QUnit.test("the 'update' method of store should have key as arg is store has the 'key' field", function(assert) {
        var data = [{
            id: 1, text: "abc", startDate: new Date(2015, 1, 9, 10)
        }];
        var dataSource = new DataSource({
            store: new CustomStore({
                load: function() {
                    return data;
                },
                update: function(key, updatedItem) {
                    assert.equal(key, 1, "Key is OK");
                },
                key: "id"
            })
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: dataSource
        });

        this.clock.tick();

        this.instance.updateAppointment(data[0], {});
    });

    QUnit.test("the 'update' method of store should have item as arg is store has not the 'key' field", function(assert) {
        var data = [{
            id: 1, text: "abc", startDate: new Date(2015, 1, 9, 10)
        }];
        var dataSource = new DataSource({
            store: new CustomStore({
                load: function() {
                    return data;
                },
                update: function(key, updatedItem) {
                    assert.equal(key, data[0], "Key is OK");
                }
            })
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: dataSource
        });
        this.clock.tick();

        this.instance.updateAppointment(data[0], {});
    });

    QUnit.test("Remove item", function(assert) {
        var data = new DataSource({
            store: this.tasks
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        this.clock.tick();

        var lastTask = this.tasks[1];

        this.instance.deleteAppointment(this.tasks[0]);
        this.clock.tick();
        assert.deepEqual(this.instance.option("dataSource").items(), [lastTask], "Task is removed");
    });

    QUnit.test("Other appointments should not be rerendered after remove appointment", function(assert) {
        var data = new DataSource({
            store: this.tasks
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });
        this.clock.tick();

        var lastTask = this.tasks[1];

        this.instance.option({ onAppointmentRendered: function(args) {
            assert.ok(false, "Appointments were rerendered");
        } });

        this.instance.deleteAppointment(this.tasks[0]);
        this.clock.tick();
        assert.deepEqual(this.instance.option("dataSource").items(), [lastTask], "Task is removed");
    });

    QUnit.test("the 'remove' method of store should have key as arg is store has the 'key' field", function(assert) {
        var data = [{
            id: 1, text: "abc", startDate: new Date(2015, 1, 9, 10)
        }];
        var dataSource = new DataSource({
            store: new CustomStore({
                load: function() {
                    return data;
                },
                remove: function(key) {
                    assert.equal(key, 1, "Key is OK");
                },
                key: "id"
            })
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: dataSource
        });
        this.clock.tick();

        this.instance.deleteAppointment(data[0]);
    });

    QUnit.test("the 'remove' method of store should have item as arg is store has not the 'key' field", function(assert) {
        var data = [{
            id: 1, text: "abc", startDate: new Date(2015, 1, 9, 10)
        }];
        var dataSource = new DataSource({
            store: new CustomStore({
                load: function() {
                    return data;
                },
                remove: function(key) {
                    assert.equal(key, data[0], "Key is OK");
                }
            })
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: dataSource
        });
        this.clock.tick();

        this.instance.deleteAppointment(data[0]);
    });

    QUnit.test("Check appointment takes all day", function(assert) {
        this.createInstance({
            dataSource: []
        });
        var result = this.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 0),
            endDate: new Date(2015, 5, 5, 0)
        });

        assert.ok(result, "Appointment takes all day");

        result = this.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 0),
            endDate: new Date(2015, 5, 5, 10)
        });

        assert.ok(result, "Appointment takes all day");

        result = this.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 0),
            endDate: new Date(2015, 5, 4, 5)
        });
        assert.ok(!result, "Appointment doesn't take all day");
    });

    QUnit.test("Check appointment takes all day if start & end hours are defined", function(assert) {
        this.createInstance({
            dataSource: [],
            startDayHour: 5,
            endDayHour: 10
        });

        var result = this.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 0),
            endDate: new Date(2015, 5, 5, 0)
        });

        assert.ok(result, "Appointment takes all day");

        result = this.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 5),
            endDate: new Date(2015, 5, 4, 10)
        });
        assert.ok(result, "Appointment takes all day");

        result = this.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 6),
            endDate: new Date(2015, 5, 4, 7)
        });
        assert.ok(!result, "Appointment doesn't take all day");

        result = this.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 6),
            endDate: new Date(2015, 5, 4, 12)
        });
        assert.ok(!result, "Appointment doesn't take all day");
    });

    QUnit.test("Scheduler focus method should call workspace focus method when appointment wasn't updated", function(assert) {
        this.createInstance({
            dataSource: [],
            currentView: "day",
            currentDate: new Date(2015, 10, 3)
        });

        var workspace = this.instance.getWorkSpace(),
            spy = sinon.spy(workspace, "focus");

        this.instance.focus();

        assert.ok(spy.calledOnce, "focus is called");
    });

    QUnit.test("Scheduler focus method should call appointments focus method when appointment was updated", function(assert) {
        var tasks = [{
            text: "a",
            startDate: new Date(2015, 6, 8, 8, 0),
            endDate: new Date(2015, 6, 8, 17, 0),
            allDay: true
        }];

        this.createInstance({
            dataSource: tasks,
            currentDate: new Date(2015, 6, 8)
        });

        var appointments = this.instance.getAppointmentsInstance(),
            focusSpy = sinon.spy(appointments, "focus");

        this.instance._editAppointmentData = tasks[0];
        this.instance.focus();

        assert.ok(focusSpy.calledOnce, "focus is called");
    });

    QUnit.test("Scheduler getWorkSpaceDateTableOffset should return right dateTable offset", function(assert) {
        this.createInstance({
            dataSource: "day",
            currentDate: new Date(2015, 10, 3)
        });

        var timePanelWidth = this.instance.$element().find(".dx-scheduler-time-panel").eq(0).outerWidth(),
            offset = this.instance.getWorkSpaceDateTableOffset();

        assert.equal(offset, timePanelWidth, "Date Table offset is correct");
    });

    QUnit.test("Scheduler getWorkSpaceDateTableOffset should return right dateTable offset, crossScrollingEnabled=true", function(assert) {
        this.createInstance({
            dataSource: "day",
            currentDate: new Date(2015, 10, 3),
            crossScrollingEnabled: true
        });

        var offset = this.instance.getWorkSpaceDateTableOffset();

        assert.equal(offset, 0, "Date Table offset is correct");
    });

    QUnit.test("Scheduler getWorkSpaceDateTableOffset should return right dateTable offset, crossScrollingEnabled=true, rtl mode", function(assert) {
        this.createInstance({
            dataSource: "day",
            currentDate: new Date(2015, 10, 3),
            crossScrollingEnabled: true,
            rtlEnabled: true
        });

        var timePanelWidth = this.instance.$element().find(".dx-scheduler-time-panel").eq(0).outerWidth(),
            offset = this.instance.getWorkSpaceDateTableOffset();

        assert.equal(offset, timePanelWidth, "Date Table offset is correct");
    });

    QUnit.test("Timezone offset calculation(T388304)", function(assert) {
        [{ tz: "Europe/Belgrade", offset: 1, daylightOffset: 2, daylightDate: new Date(2016, 4, 10), date: new Date(2016, 10, 20) },
        { tz: "Asia/Ashgabat", offset: 5, daylightOffset: 5, daylightDate: new Date(2016, 4, 10), date: new Date(2016, 10, 20) },
        { tz: "America/Los_Angeles", offset: -8, daylightOffset: -7, daylightDate: new Date(2016, 4, 10), date: new Date(2016, 10, 20) },
        { tz: "America/Louisville", offset: -5, daylightOffset: -4, daylightDate: new Date(2016, 4, 10), date: new Date(2016, 10, 20) },
        { tz: "America/Managua", offset: -6, daylightOffset: -6, daylightDate: new Date(2016, 4, 10), date: new Date(2016, 10, 20) },
        { tz: "Antarctica/South_Pole", offset: 12, daylightOffset: 13, daylightDate: new Date(2016, 10, 20), date: new Date(2016, 4, 10) },
        { tz: "Arctic/Longyearbyen", offset: 1, daylightOffset: 2, daylightDate: new Date(2016, 4, 10), date: new Date(2016, 10, 20) },
        { tz: "Asia/Brunei", offset: 8, daylightOffset: 8, daylightDate: new Date(2016, 4, 10), date: new Date(2016, 10, 20) },
        { tz: "Asia/Damascus", offset: 2, daylightOffset: 3, daylightDate: new Date(2016, 4, 10), date: new Date(2016, 10, 20) }
        ].forEach(function(item) {
            var offset = SchedulerTimezones.getTimezoneOffsetById(item.tz, item.date),
                daylightOffset = SchedulerTimezones.getTimezoneOffsetById(item.tz, item.daylightDate);

            assert.equal(offset, item.offset, item.tz + ": Common offset is OK");
            assert.equal(daylightOffset, item.daylightOffset, item.tz + ": DST offset is OK");
        });
    });

    QUnit.test("Scheduler should work correctly when groupOrientation is set without groups", function(assert) {
        assert.expect(1);

        this.createInstance({
            dataSource: [],
            resources: [{
                fieldExpr: "owner.id",
                allowMultiple: true,
                dataSource: [
                    {
                        id: 1,
                        text: "A"
                    }, {
                        id: 2,
                        text: "B"
                    }
                ]
            }],
            views: [
                {
                    type: "week",
                    name: "VWEEK",
                    groupOrientation: "vertical"
                }
            ],
            currentView: "VWEEK",
            height: 500
        });

        const $workSpace = this.instance.getWorkSpace().$element();

        assert.notOk($workSpace.hasClass("dx-scheduler-work-space-vertical-grouped"), "Workspace hasn't 'dx-scheduler-work-space-vertical-grouped' css class");
    });

    QUnit.test("getWorkSpaceScrollableScrollTop should return right value for allDay appointments depending on the group orientation", function(assert) {
        assert.expect(4);

        this.createInstance({
            dataSource: [],
            groups: ["owner.id"],
            resources: [{
                fieldExpr: "owner.id",
                allowMultiple: true,
                dataSource: [
                    {
                        id: 1,
                        text: "A"
                    }, {
                        id: 2,
                        text: "B"
                    }
                ]
            }],
            views: [{
                type: "week",
                name: "HWEEK",
                groupOrientation: "horizontal"
            },
            {
                type: "week",
                name: "VWEEK",
                groupOrientation: "vertical"
            }],
            currentView: "HWEEK",
            height: 500
        });

        var scrollable = this.instance.getWorkSpace().getScrollable();
        scrollable.scrollTo({ left: 0, top: 400 });

        assert.equal(this.instance.getWorkSpaceScrollableScrollTop(), 400, "Returned value is right for not allDay appt and horizontal grouping");
        assert.equal(this.instance.getWorkSpaceScrollableScrollTop(true), 0, "Returned value is right for allDay appt and horizontal grouping");

        this.instance.option("currentView", "VWEEK");

        scrollable = this.instance.getWorkSpace().getScrollable();
        scrollable.scrollTo({ left: 0, top: 400 });

        assert.equal(this.instance.getWorkSpaceScrollableScrollTop(), 400, "Returned value is right for not allDay appt and vertical grouping");
        assert.equal(this.instance.getWorkSpaceScrollableScrollTop(true), 400, "Returned value is right for allDay appt and vertical grouping");
    });

})("Methods");

(function() {

    QUnit.module("Scrolling to time", {
        beforeEach: function() {
            this.createInstance = function(options) {
                this.instance = $("#scheduler").dxScheduler($.extend({
                    showCurrentTimeIndicator: false
                }, options)).dxScheduler("instance");
            };

            this.clock = sinon.useFakeTimers();

            fx.off = true;
        },
        afterEach: function() {
            this.clock.restore();
            fx.off = false;
        }
    });

    QUnit.test("Check scrolling to time", function(assert) {
        this.createInstance({
            currentView: "week",
            currentDate: new Date(2015, 1, 9),
            height: 500
        });

        var scrollable = this.instance.getWorkSpaceScrollable(),
            scrollBy = sinon.spy(scrollable, "scrollBy");

        this.instance.scrollToTime(9, 5);

        assert.roughEqual(scrollBy.getCall(0).args[0].top, this.instance._workSpace.getCoordinatesByDate(new Date(2015, 1, 9, 9, 5)).top, 1.001, "scrollBy was called with right distance");
        assert.equal(scrollBy.getCall(0).args[0].left, 0, "scrollBy was called with right distance");
    });

    QUnit.test("Check scrolling to time, if startDayHour is not 0", function(assert) {
        this.createInstance({
            currentView: "week",
            currentDate: new Date(2015, 1, 9),
            height: 500,
            startDayHour: 3
        });

        var scrollable = this.instance.getWorkSpaceScrollable(),
            scrollBy = sinon.spy(scrollable, "scrollBy");

        this.instance.scrollToTime(2, 0);

        assert.roughEqual(scrollBy.getCall(0).args[0].top, 0, 2.001, "scrollBy was called with right distance");

        this.instance.scrollToTime(5, 0);

        assert.roughEqual(scrollBy.getCall(1).args[0].top, this.instance._workSpace.getCoordinatesByDate(new Date(2015, 1, 9, 5, 0)).top, 1.001, "scrollBy was called with right distance");
    });

    QUnit.test("Check scrolling to time, if 'hours' argument greater than the 'endDayHour' option", function(assert) {
        this.createInstance({
            currentView: "week",
            currentDate: new Date(2015, 1, 9),
            height: 500,
            endDayHour: 10
        });

        var scrollable = this.instance.getWorkSpaceScrollable(),
            scrollBy = sinon.spy(scrollable, "scrollBy");

        this.instance.scrollToTime(12, 0);

        assert.roughEqual(scrollBy.getCall(0).args[0].top, this.instance._workSpace.getCoordinatesByDate(new Date(2015, 1, 9, 9, 0)).top, 1.001, "scrollBy was called with right distance");
    });

    QUnit.test("Scrolling to date which doesn't locate on current view should call console warning", function(assert) {
        this.createInstance({
            currentView: "week",
            currentDate: new Date(2015, 1, 9),
            height: 500
        });

        var warningHandler = sinon.spy(errors, "log");

        this.instance.scrollToTime(12, 0, new Date(2015, 1, 16));

        assert.equal(warningHandler.callCount, 1, "warning has been called once");
        assert.equal(warningHandler.getCall(0).args[0], "W1008", "warning has correct error id");
    });

    QUnit.test("Check scrolling to time for timeline view", function(assert) {
        this.createInstance({
            views: ["timelineWeek"],
            currentView: "timelineWeek",
            currentDate: new Date(2015, 1, 9),
            width: 500
        });

        var scrollable = this.instance.getWorkSpaceScrollable(),
            scrollBy = sinon.spy(scrollable, "scrollBy");

        this.instance.scrollToTime(9, 5);

        assert.roughEqual(scrollBy.getCall(0).args[0].left, this.instance._workSpace.getCoordinatesByDate(new Date(2015, 1, 9, 9, 5)).left, 1.001, "scrollBy was called with right distance");
    });

    QUnit.test("Check scrolling to time for timeline view, rtl mode", function(assert) {
        this.createInstance({
            views: ["timelineWeek"],
            currentView: "timelineWeek",
            currentDate: new Date(2015, 1, 9),
            width: 500,
            rtlEnabled: true
        });

        var scrollable = this.instance.getWorkSpaceScrollable(),
            scrollLeft = scrollable.scrollLeft(),
            scrollBy = sinon.spy(scrollable, "scrollBy"),
            offset = this.instance.getWorkSpace().getScrollableContainer().outerWidth();

        this.instance.scrollToTime(9, 5);

        assert.roughEqual(scrollBy.getCall(0).args[0].left, this.instance._workSpace.getCoordinatesByDate(new Date(2015, 1, 9, 9, 5)).left - scrollLeft - offset, 1.001, "scrollBy was called with right distance");
    });

    QUnit.test("Check scrolling to time for timeline view if date was set", function(assert) {
        this.createInstance({
            views: ["timelineWeek"],
            currentView: "timelineWeek",
            currentDate: new Date(2015, 1, 9),
            width: 500,
            firstDayOfWeek: 1
        });

        var scrollable = this.instance.getWorkSpaceScrollable(),
            scrollBy = sinon.spy(scrollable, "scrollBy");

        this.instance.scrollToTime(9, 5, new Date(2015, 1, 11, 10, 30));

        assert.roughEqual(scrollBy.getCall(0).args[0].left, this.instance._workSpace.getCoordinatesByDate(new Date(2015, 1, 11, 9, 5)).left, 1.001, "scrollBy was called with right distance");
    });

    QUnit.test("Check scrolling to time for timeline view if date was set, rtl mode", function(assert) {
        this.createInstance({
            views: ["timelineWeek"],
            currentView: "timelineWeek",
            currentDate: new Date(2015, 1, 9),
            width: 500,
            firstDayOfWeek: 1,
            rtlEnabled: true
        });

        var scrollable = this.instance.getWorkSpaceScrollable(),
            scrollLeft = scrollable.scrollLeft(),
            scrollBy = sinon.spy(scrollable, "scrollBy"),
            offset = this.instance.getWorkSpace().getScrollableContainer().outerWidth();

        this.instance.scrollToTime(9, 5, new Date(2015, 1, 11, 10, 30));

        assert.roughEqual(scrollBy.getCall(0).args[0].left, this.instance._workSpace.getCoordinatesByDate(new Date(2015, 1, 11, 9, 5)).left - scrollLeft - offset, 1.001, "scrollBy was called with right distance");
    });
})("Scrolling to time");

(function() {

    var checkDate = function(instance, assert) {

        var workSpace = instance.getWorkSpace(),
            workSpaceCurrentDate = workSpace.option("currentDate"),
            header = instance.getHeader(),
            headerCurrentDate = header.option("currentDate");

        assert.ok(workSpaceCurrentDate instanceof Date, "date is instance of Date constructor");
        assert.equal(workSpaceCurrentDate.getFullYear(), 2015, "Year is OK");
        assert.equal(workSpaceCurrentDate.getMonth(), 4, "Month is OK");
        assert.equal(workSpaceCurrentDate.getDate(), 13, "Date is OK");

        assert.ok(headerCurrentDate instanceof Date, "date is instance of Date constructor");
        assert.equal(headerCurrentDate.getFullYear(), 2015, "Year is OK");
        assert.equal(headerCurrentDate.getMonth(), 4, "Month is OK");
        assert.equal(headerCurrentDate.getDate(), 13, "Date is OK");
    };

    QUnit.module("Options", {
        beforeEach: function() {
            this.createInstance = function(options) {
                this.instance = $("#scheduler").dxScheduler(options).dxScheduler("instance");
            };
            this.clock = sinon.useFakeTimers();
        },
        afterEach: function() {
            this.clock.restore();
        }
    });

    QUnit.test("Changing of 'currentView' option after initializing should work correctly", function(assert) {
        this.createInstance({
            currentDate: new Date(2018, 0, 30),
            views: ["day", "week"],
            currentView: "week",
            onInitialized: function(e) {
                e.component.option("currentView", "day");
            }
        });

        assert.ok(this.instance.getWorkSpace() instanceof dxSchedulerWorkSpaceDay, "correct view");
    });

    QUnit.test("It should be possible to init currentDate as timestamp", function(assert) {
        this.createInstance({
            currentDate: 1431515985596
        });

        checkDate(this.instance, assert);
    });

    QUnit.test("It should be possible to change currentDate using timestamp", function(assert) {
        this.createInstance();

        this.instance.option("currentDate", 1431515985596);
        checkDate(this.instance, assert);
    });

    QUnit.test("Custom store should be loaded only once on the first rendering", function(assert) {
        var counter = 0;

        this.createInstance({
            dataSource: new DataSource({
                store: new CustomStore({
                    load: function() {
                        var d = $.Deferred();
                        setTimeout(function() {
                            d.resolve([]);
                            counter++;
                        }, 100);

                        return d.promise();
                    }
                })
            })
        });

        this.clock.tick(200);

        assert.equal(counter, 1);
    });

    QUnit.test("Custom store should be loaded only once on dataSource option change", function(assert) {
        var counter = 0;

        this.createInstance();

        this.instance.option("dataSource", new DataSource({
            store: new CustomStore({
                load: function() {
                    var d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([]);
                        counter++;
                    }, 100);

                    return d.promise();
                }
            })
        }));

        this.clock.tick(200);

        assert.equal(counter, 1);
    });

    QUnit.test("allowAllDayResize option should be updated when current view is changed", function(assert) {
        this.createInstance({
            currentView: "day"
        });

        assert.notOk(this.instance.getAppointmentsInstance().option("allowAllDayResize"));

        this.instance.option("currentView", "week");
        assert.ok(this.instance.getAppointmentsInstance().option("allowAllDayResize"));
    });

    QUnit.test("allowAllDayResize option should depend on intervalCount", function(assert) {
        this.createInstance({
            views: [{ type: "week", name: "WEEK" }, { type: "day", name: "DAY" }, { type: "day", name: "DAY1", intervalCount: 3 } ],
            currentView: "DAY"
        });

        assert.notOk(this.instance.getAppointmentsInstance().option("allowAllDayResize"));

        this.instance.option("currentView", "DAY1");
        assert.ok(this.instance.getAppointmentsInstance().option("allowAllDayResize"));
    });

    QUnit.test("showAllDayPanel option value = true on init", function(assert) {
        this.createInstance();

        assert.equal(this.instance.option("showAllDayPanel"), true, "showAllDayPanel option value is right on init");
    });

    QUnit.test("showCurrentTimeIndicator should have right default", function(assert) {
        this.createInstance();

        assert.equal(this.instance.option("showCurrentTimeIndicator"), true, "showCurrentTimeIndicator option value is right on init");
    });

    QUnit.test("showCurrentTimeIndicator option should be passed to workSpace", function(assert) {
        this.createInstance({
            currentView: "week",
            showCurrentTimeIndicator: false
        });

        var workSpaceWeek = this.instance.getWorkSpace();

        assert.equal(workSpaceWeek.option("showCurrentTimeIndicator"), false, "workspace has correct showCurrentTimeIndicator");

        this.instance.option("showCurrentTimeIndicator", true);

        assert.equal(workSpaceWeek.option("showCurrentTimeIndicator"), true, "workspace has correct showCurrentTimeIndicator");
    });

    QUnit.test("indicatorTime option should be passed to workSpace", function(assert) {
        this.createInstance({
            currentView: "week",
            indicatorTime: new Date(2017, 8, 19)
        });

        var workSpaceWeek = this.instance.getWorkSpace();

        assert.deepEqual(workSpaceWeek.option("indicatorTime"), new Date(2017, 8, 19), "workspace has correct indicatorTime");

        this.instance.option("indicatorTime", new Date(2017, 8, 20));

        assert.deepEqual(workSpaceWeek.option("indicatorTime"), new Date(2017, 8, 20), "workspace has correct indicatorTime");
    });

    QUnit.test("indicatorUpdateInterval should have right default", function(assert) {
        this.createInstance({
            currentView: "week"
        });

        assert.equal(this.instance.option("indicatorUpdateInterval"), 300000, "workspace has correct indicatorUpdateInterval");
    });

    QUnit.test("indicatorUpdateInterval option should be passed to workSpace", function(assert) {
        this.createInstance({
            currentView: "week",
            indicatorUpdateInterval: 2000
        });

        var workSpaceWeek = this.instance.getWorkSpace();

        assert.equal(workSpaceWeek.option("indicatorUpdateInterval"), 2000, "workspace has correct indicatorUpdateInterval");

        this.instance.option("indicatorUpdateInterval", 3000);

        assert.equal(workSpaceWeek.option("indicatorUpdateInterval"), 3000, "workspace has correct indicatorUpdateInterval");
    });

    QUnit.test("shadeUntilCurrentTime should have right default", function(assert) {
        this.createInstance({
            currentView: "week"
        });

        assert.equal(this.instance.option("shadeUntilCurrentTime"), false, "workspace has correct shadeUntilCurrentTime");
    });

    QUnit.test("shadeUntilCurrentTime option should be passed to workSpace", function(assert) {
        this.createInstance({
            currentView: "week",
            shadeUntilCurrentTime: false
        });

        var workSpaceWeek = this.instance.getWorkSpace();

        assert.equal(workSpaceWeek.option("shadeUntilCurrentTime"), false, "workspace has correct shadeUntilCurrentTime");

        this.instance.option("shadeUntilCurrentTime", true);

        assert.equal(workSpaceWeek.option("shadeUntilCurrentTime"), true, "workspace has correct shadeUntilCurrentTime");
    });

    QUnit.test("appointments should be repainted after scheduler dimensions changing", function(assert) {
        var data = [{
            id: 1, text: "abc", startDate: new Date(2015, 1, 9, 10), endDate: new Date(2015, 1, 9, 10, 30)
        }];

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            currentView: "month",
            dataSource: data,
            height: 500,
            width: 800
        });

        var initialAppointmentHeight = this.instance.$element().find(".dx-scheduler-appointment").eq(0).outerHeight();

        this.instance.option("height", 200);
        this.clock.tick();

        assert.notEqual(this.instance.$element().find(".dx-scheduler-appointment").eq(0).outerHeight(), initialAppointmentHeight, "Appointment was repainted");
    });

    QUnit.test("appointments should be repainted after scheduler hiding/showing and dimensions changing", function(assert) {
        var data = [{
            id: 1, text: "abc", startDate: new Date(2015, 1, 9, 10), endDate: new Date(2015, 1, 9, 10, 30)
        }];

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            currentView: "month",
            dataSource: data,
            maxAppointmentsPerCell: null,
            height: 500,
            width: 800
        });

        var initialAppointmentHeight = this.instance.$element().find(".dx-scheduler-appointment").eq(0).outerHeight();

        domUtils.triggerHidingEvent($("#scheduler"));
        $("#scheduler").hide();
        this.instance.option("height", 400);
        $("#scheduler").show();
        domUtils.triggerShownEvent($("#scheduler"));
        this.clock.tick();

        assert.notEqual(this.instance.$element().find(".dx-scheduler-appointment").eq(0).outerHeight(), initialAppointmentHeight, "Appointment was repainted");
    });

    QUnit.test("view.intervalCount is passed to workspace & header & navigator", function(assert) {
        this.createInstance({
            currentView: "week",
            views: [{
                type: "week",
                name: "Week",
                intervalCount: 3
            }]
        });

        var workSpaceWeek = this.instance.getWorkSpace(),
            header = this.instance.getHeader(),
            navigator = header._navigator;

        assert.equal(workSpaceWeek.option("intervalCount"), 3, "workspace has correct count");
        assert.equal(header.option("intervalCount"), 3, "header has correct count");
        assert.equal(navigator.option("intervalCount"), 3, "navigator has correct count");
    });

    QUnit.test("view.intervalCount is passed to workspace & header & navigator, currentView is set by view.name", function(assert) {
        this.createInstance({
            currentView: "WEEK1",
            views: [{
                type: "day",
                name: "DAY1",
                intervalCount: 5
            }, {
                type: "week",
                name: "WEEK1",
                intervalCount: 3
            }]
        });

        var workSpaceWeek = this.instance.getWorkSpace(),
            header = this.instance.getHeader(),
            navigator = header._navigator;

        assert.equal(workSpaceWeek.option("intervalCount"), 3, "workspace has correct count");
        assert.equal(header.option("intervalCount"), 3, "header has correct count");
        assert.equal(navigator.option("intervalCount"), 3, "navigator has correct count");
    });

    QUnit.test("view.intervalCount is passed to workspace & header & navigator, currentView is set by view.type", function(assert) {
        var views = [{
            type: "day",
            name: "DAY1",
            intervalCount: 5
        }, {
            type: "week",
            name: "WEEK1",
            intervalCount: 3
        }];

        this.createInstance({
            currentView: "week",
            views: views,
            useDropDownViewSwitcher: false
        });

        var workSpaceWeek = this.instance.getWorkSpace(),
            header = this.instance.getHeader(),
            viewSwitcher = header._viewSwitcher,
            navigator = header._navigator;

        assert.equal(workSpaceWeek.option("intervalCount"), 3, "workspace has correct count");
        assert.equal(header.option("intervalCount"), 3, "header has correct count");
        assert.equal(navigator.option("intervalCount"), 3, "navigator has correct count");
        assert.deepEqual(viewSwitcher.option("selectedItem"), views[1], "View switcher has correct selectedItem");
    });

    QUnit.test("view.startDate is passed to workspace & header & navigator", function(assert) {
        var date = new Date(2017, 3, 4);

        this.createInstance({
            currentView: "week",
            currentDate: new Date(2017, 2, 10),
            views: [{
                type: "week",
                name: "Week",
                intervalCount: 3,
                startDate: date
            }]
        });

        var workSpaceWeek = this.instance.getWorkSpace(),
            header = this.instance.getHeader(),
            navigator = header._navigator;

        assert.deepEqual(workSpaceWeek.option("startDate"), date, "workspace has correct startDate");
        assert.deepEqual(header.option("startDate"), date, "header has correct startDate");
        assert.equal(navigator.option("date").getMonth(), 1, "navigator has correct date depending on startDate");
    });

    QUnit.test("currentView option should be passed to header correctly", function(assert) {
        this.createInstance({
            currentView: "Week1",
            currentDate: new Date(2017, 10, 25),
            views: [{
                type: "day",
                name: "day1"
            }, {
                type: "week",
                name: "Week1"
            }]
        });

        var header = this.instance.getHeader(),
            navigator = header._navigator;

        assert.deepEqual(header.option("currentView"), { type: "week", name: "Week1" }, "header has correct currentView");
        assert.equal(navigator.option("step"), "week", "navigator has correct currentView");

        this.instance.option("currentView", "day1");

        assert.deepEqual(header.option("currentView"), { type: "day", name: "day1" }, "header has correct currentView");
        assert.equal(navigator.option("step"), "day", "navigator has correct currentView");
    });

    QUnit.test("currentView option changing should work correctly, when intervalCount & startDate is set", function(assert) {
        this.createInstance({
            currentView: "day",
            currentDate: new Date(2017, 10, 25),
            views: [{
                type: "day",
                name: "day",
                intervalCount: 3,
                startDate: new Date(2017, 1, 1)
            }, {
                type: "week",
                name: "Week",
                intervalCount: 2,
                startDate: new Date(2017, 10, 1)
            }]
        });

        this.instance.option("currentView", "week");
        var workSpaceWeek = this.instance.getWorkSpace(),
            header = this.instance.getHeader(),
            navigator = header._navigator;

        assert.equal(workSpaceWeek.option("intervalCount"), 2, "workspace has correct count");
        assert.equal(header.option("intervalCount"), 2, "header has correct count");
        assert.equal(navigator.option("intervalCount"), 2, "navigator has correct count");

        assert.deepEqual(workSpaceWeek.option("startDate"), new Date(2017, 10, 1), "workspace has correct startDate");
        assert.deepEqual(header.option("startDate"), new Date(2017, 10, 1), "header has correct startDate");
        assert.equal(navigator.option("date").getMonth(), 10, "navigator has correct date");
    });

    QUnit.test("maxAppointmentsPerCell should have correct default", function(assert) {
        this.createInstance({
            currentView: "Week",
            views: [{
                type: "week",
                name: "Week",
            }]
        });

        assert.equal(this.instance.option("maxAppointmentsPerCell"), "auto", "Default Option value is right");
        var $workSpace = this.instance.getWorkSpace().$element();
        assert.ok($workSpace.hasClass("dx-scheduler-work-space-overlapping"), "workspace has right class");
    });

    QUnit.test("cellDuration is passed to workspace", function(assert) {
        this.createInstance({
            currentView: "week",
            cellDuration: 60
        });

        var workSpaceWeek = this.instance.getWorkSpace();

        assert.equal(workSpaceWeek.option("hoursInterval") * 60, this.instance.option("cellDuration"), "workspace has correct cellDuration");

        this.instance.option("cellDuration", 20);

        assert.equal(workSpaceWeek.option("hoursInterval") * 60, this.instance.option("cellDuration"), "workspace has correct cellDuration after change");
    });

    QUnit.test("accessKey is passed to workspace", function(assert) {
        this.createInstance({
            currentView: "month",
            accessKey: "o"
        });

        var workSpaceMonth = this.instance.getWorkSpace();
        assert.equal(workSpaceMonth.option("accessKey"), this.instance.option("accessKey"), "workspace has correct accessKey");

        this.instance.option("accessKey", "k");
        assert.equal(workSpaceMonth.option("accessKey"), this.instance.option("accessKey"), "workspace has correct accessKey afterChange");
    });

    QUnit.test("the 'width' option should be passed to work space on option changed if horizontal scrolling is enabled", function(assert) {
        this.createInstance();
        this.instance.option("crossScrollingEnabled", true);
        this.instance.option("width", 777);

        assert.equal(this.instance.getWorkSpace().option("width"), 777, "option is OK");
    });

    QUnit.test("the 'width' option should not be passed to work space on option changed if horizontal scrolling is not enabled", function(assert) {
        this.createInstance();
        this.instance.option("crossScrollingEnabled", false);
        this.instance.option("width", 777);

        assert.strictEqual(this.instance.getWorkSpace().option("width"), undefined, "option is OK");
    });

    QUnit.test("Editing default option value", function(assert) {
        var defaultEditing = { allowAdding: true, allowUpdating: true, allowDeleting: true, allowResizing: true, allowDragging: true };

        if(devices.real().platform !== "generic") {
            defaultEditing.allowDragging = false;
            defaultEditing.allowResizing = false;
        }

        this.createInstance();
        var editing = this.instance.option("editing");

        assert.deepEqual(editing, defaultEditing);
    });

    QUnit.test("Drop-down appointments should be repainted if the 'editing' option is changed", function(assert) {
        this.createInstance({
            editing: true
        });

        var repaintStub = sinon.stub(this.instance._dropDownAppointments, "repaintExisting");

        this.instance.option("editing", false);

        assert.ok(repaintStub.calledOnce, "Appointments are repainted");
        assert.equal(repaintStub.getCall(0).args[0], this.instance.$element(), "Argument is OK");
    });

    QUnit.test("Scheduler should be repainted after currentTime indication toggling", function(assert) {
        this.createInstance({
            showCurrentTimeIndicator: true,
            currentDate: new Date(2017, 11, 18),
            indicatorTime: new Date(2017, 11, 18, 16, 45),
            views: ["timelineWeek"],
            view: "timelineWeek"
        });

        var repaintStub = sinon.stub(this.instance, "repaint");

        this.instance.option("showCurrentTimeIndicator", false);

        assert.ok(repaintStub.calledOnce, "Sheduler was repainted");
    });

    QUnit.test("Appointment popup should have right defaultOptionsRules", function(assert) {
        this.createInstance();
        this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2) });

        var popupDefaultOptions = this.instance.getAppointmentPopup().option("defaultOptionsRules")[0].options;

        assert.deepEqual(popupDefaultOptions, { fullScreen: true }, "Popup has right default");
    });

    QUnit.test("Filter options should be updated when dataSource is changed", function(assert) {
        this.createInstance({
            currentDate: new Date(2016, 2, 15),
            views: ["week"],
            currentView: "week",
            dataSource: [{ startDate: new Date(2016, 2, 15, 1).toString(), endDate: new Date(2016, 2, 15, 2).toString() }]
        });

        assert.equal(this.instance.$element().find(".dx-scheduler-appointment").length, 1, "Appointment is rendered");

        this.instance.option("dataSource", [
            { startDate: new Date(2016, 2, 15, 1).toString(), endDate: new Date(2016, 2, 15, 2).toString() },
            { startDate: new Date(2016, 2, 15, 3).toString(), endDate: new Date(2016, 2, 15, 4).toString() }
        ]);

        assert.equal(this.instance.$element().find(".dx-scheduler-appointment").length, 2, "Appointments are rendered");
    });

    QUnit.test("Appointments should be deleted from DOM when needed", function(assert) {
        this.createInstance({
            currentDate: new Date(2016, 2, 15),
            views: ["week", "month"],
            currentView: "week",
            dataSource: [{ startDate: new Date(2016, 2, 15, 1).toString(), endDate: new Date(2016, 2, 15, 2).toString() }]
        });

        assert.equal(this.instance.$element().find(".dx-scheduler-appointment").length, 1, "Appointment is rendered");

        this.instance.option("currentDate", new Date(2016, 2, 23));
        this.instance.option("currentView", "month");
        this.instance.option("currentView", "week");

        assert.equal(this.instance.$element().find(".dx-scheduler-appointment").length, 0, "Appointments were removed");
    });

    QUnit.test("selectedCellData option should be updated after view changing", function(assert) {
        this.createInstance({
            currentDate: new Date(2018, 4, 10),
            views: ["week", "month"],
            currentView: "week",
            focusStateEnabled: true
        });

        var keyboard = keyboardMock(this.instance.getWorkSpace().$element()),
            cells = this.instance.$element().find(".dx-scheduler-date-table-cell");

        pointerMock(cells.eq(7)).start().click();
        keyboard.keyDown("down", { shiftKey: true });

        assert.deepEqual(this.instance.option("selectedCellData"), [{
            startDate: new Date(2018, 4, 6, 0, 30),
            endDate: new Date(2018, 4, 6, 1),
            allDay: false
        }, {
            startDate: new Date(2018, 4, 6, 1),
            endDate: new Date(2018, 4, 6, 1, 30),
            allDay: false
        }], "correct cell data");

        this.instance.option("currentView", "month");
        assert.deepEqual(this.instance.option("selectedCellData"), []);
    });

})("Options");

(function() {
    QUnit.module("Events", {
        beforeEach: function() {
            this.createInstance = function(options) {
                this.instance = $("#scheduler").dxScheduler(options).dxScheduler("instance");
            };
            this.clock = sinon.useFakeTimers();
            fx.off = true;
        },
        afterEach: function() {
            this.clock.restore();
            fx.off = false;
        }
    });

    QUnit.test("onAppointmentAdding", function(assert) {
        var addingSpy = sinon.spy(noop);

        this.createInstance({
            onAppointmentAdding: addingSpy,
            dataSource: []
        });

        var newAppointment = {
            startDate: new Date(2015, 1, 9, 16),
            endDate: new Date(2015, 1, 9, 17),
            text: "caption"
        };

        this.instance.addAppointment(newAppointment);
        this.clock.tick();


        var args = addingSpy.getCall(0).args[0];

        assert.ok(addingSpy.calledOnce, "onAppointmentAdding was called");
        assert.equal(args.element, this.instance.element(), "Element field is OK");
        assert.equal(args.component, this.instance, "Component field is OK");
        assert.strictEqual(args.cancel, false, "'Cancel' flag is OK");
        assert.deepEqual(args.appointmentData, newAppointment, "Appointment field is OK");
    });

    QUnit.test("Appointment should not be added to the data source if 'cancel' flag is defined as true", function(assert) {
        var dataSource = new DataSource({
            store: []
        });
        this.createInstance({
            onAppointmentAdding: function(args) {
                args.cancel = true;
            },
            dataSource: dataSource
        });

        this.instance.addAppointment({ startDate: new Date(), text: "Appointment 1" });
        this.clock.tick();

        assert.ok(dataSource.items().length === 0, "Insert operation is canceled");
    });

    QUnit.test("Appointment should not be added to the data source if 'cancel' flag is defined as true during async operation", function(assert) {
        var dataSource = new DataSource({
            store: []
        });
        this.createInstance({
            onAppointmentAdding: function(args) {
                args.cancel = $.Deferred();
                setTimeout(function() {
                    args.cancel.resolve(true);
                }, 200);
            },
            dataSource: dataSource
        });

        this.instance.addAppointment({ startDate: new Date(), text: "Appointment 1" });
        this.clock.tick(200);

        assert.ok(dataSource.items().length === 0, "Insert operation is canceled");
    });

    QUnit.test("Appointment should not be added to the data source if 'cancel' flag is defined as Promise", function(assert) {
        var promise = new Promise(function(resolve) {
            setTimeout(function() {
                resolve(true);
            }, 200);
        });
        var dataSource = new DataSource({
            store: []
        });
        this.createInstance({
            onAppointmentAdding: function(args) {
                args.cancel = promise;
            },
            dataSource: dataSource
        });

        this.instance.addAppointment({ startDate: new Date(), text: "Appointment 1" });
        this.clock.tick(200);

        promise.then(function() {
            assert.ok(dataSource.items().length === 0, "Insert operation is canceled");
        });

        return promise;
    });

    QUnit.test("onAppointmentAdded", function(assert) {
        var addedSpy = sinon.spy(noop);

        this.createInstance({
            onAppointmentAdded: addedSpy,
            dataSource: []
        });

        var newAppointment = { startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: "caption" };

        this.instance.addAppointment(newAppointment);
        this.clock.tick();

        var args = addedSpy.getCall(0).args[0];

        assert.ok(addedSpy.calledOnce, "onAppointmentAdded was called");
        assert.deepEqual(args.appointmentData, newAppointment, "Appointment field is OK");
        assert.equal(args.element, this.instance.element(), "Element field is OK");
        assert.equal(args.component, this.instance, "Component field is OK");
        assert.strictEqual(args.error, undefined, "Error field is not defined");
    });

    QUnit.test("onAppointmentAdded should have error field in args if an error occurs while data inserting", function(assert) {
        var addedSpy = sinon.spy(noop);

        this.createInstance({
            onAppointmentAdded: addedSpy,
            dataSource: new DataSource({
                store: new CustomStore({
                    load: noop,
                    insert: function() {
                        return $.Deferred().reject(new Error("Unknown error occurred"));
                    }
                })
            })
        });

        this.instance.addAppointment({ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: "caption" });
        this.clock.tick();

        var error = addedSpy.getCall(0).args[0].error;

        assert.ok(error instanceof Error, "Error field is defined");
        assert.equal(error.message, "Unknown error occurred", "Error message is OK");
    });


    QUnit.test("onAppointmentUpdating", function(assert) {
        var updatingSpy = sinon.spy(noop),
            oldData = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: "caption" }],
            newData = { startDate: new Date(2015, 1, 10, 16), endDate: new Date(2015, 1, 10, 17), text: "title" };

        this.createInstance({
            onAppointmentUpdating: updatingSpy,
            dataSource: new DataSource({ store: oldData })
        });

        this.instance.updateAppointment(oldData[0], newData);
        this.clock.tick();

        var args = updatingSpy.getCall(0).args[0];

        assert.ok(updatingSpy.calledOnce, "onAppointmentUpdating was called");
        assert.equal(args.element, this.instance.element(), "Element field is OK");
        assert.equal(args.component, this.instance, "Component field is OK");
        assert.strictEqual(args.cancel, false, "'Cancel' flag is OK");
        assert.deepEqual(args.newData, newData, "newData field is OK");
        assert.deepEqual(args.oldData, oldData[0], "oldData field is OK");
    });

    QUnit.test("Appointment should not be updated if 'cancel' flag is defined as true", function(assert) {
        var appointments = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: "caption" }],
            dataSource = new DataSource({
                store: appointments
            });

        this.createInstance({
            onAppointmentUpdating: function(args) {
                args.cancel = true;
            },
            dataSource: dataSource,
            currentDate: new Date(2015, 1, 9)
        });

        this.instance.updateAppointment(appointments[0], { startDate: new Date(), text: "Appointment 1" });
        this.clock.tick();

        assert.deepEqual(dataSource.items(), [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: "caption" }], "Update operation is canceled");
    });

    QUnit.test("Appointment form should not be updated if 'cancel' flag is defined as true (T653358)", function(assert) {
        var tzOffsetStub = sinon.stub(subscribes, "getClientTimezoneOffset").returns(-10800000);

        try {
            var appointments = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: "caption" }],
                dataSource = new DataSource({
                    store: appointments
                });

            this.createInstance({
                timeZone: "Etc/UTC",
                onAppointmentUpdating: function(args) {
                    args.cancel = true;
                },
                dataSource: dataSource,
                currentDate: new Date(2015, 1, 9)
            });

            this.instance.showAppointmentPopup(appointments[0]);
            $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

            this.clock.tick();
            assert.deepEqual(this.instance._appointmentForm.option("formData").startDate, new Date(2015, 1, 9, 13), "Form data is correct");
        } finally {
            tzOffsetStub.restore();
        }
    });

    QUnit.test("Appointment should not be updated if 'cancel' flag is defined as true during async operation", function(assert) {
        var appointments = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: "caption" }],
            dataSource = new DataSource({
                store: appointments
            });

        this.createInstance({
            onAppointmentUpdating: function(args) {
                args.cancel = $.Deferred();
                setTimeout(function() {
                    args.cancel.resolve(true);
                }, 200);
            },
            dataSource: dataSource,
            currentDate: new Date(2015, 1, 9)
        });

        this.instance.updateAppointment(appointments[0], { startDate: new Date(), text: "Appointment 1" });
        this.clock.tick(200);

        assert.deepEqual(dataSource.items(), [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: "caption" }], "Update operation is canceled");
    });

    QUnit.test("Appointment should have initial position if 'cancel' flag is defined as true during update operation", function(assert) {
        var appointments = [{ startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2), text: "caption" }],
            dataSource = new DataSource({
                store: appointments
            });

        this.createInstance({
            onAppointmentUpdating: function(args) {
                args.cancel = true;
            },
            dataSource: dataSource,
            firstDayOfWeek: 1,
            currentDate: new Date(2015, 1, 9)
        });

        var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment").eq(0)),
            initialPosition = translator.locate($appointment);


        $(this.instance.$element().find(".dx-scheduler-date-table-cell").eq(5)).trigger(dragEvents.enter);

        pointerMock($appointment)
            .start()
            .down(initialPosition.left + 10, initialPosition.top + 10)
            .move(initialPosition.left + 10, initialPosition.top + 100)
            .up();

        $appointment = $(this.instance.$element().find(".dx-scheduler-appointment").eq(0));
        assert.deepEqual(translator.locate($appointment), initialPosition, "Appointments position is OK");
    });

    QUnit.test("Appointment should have initial size if 'cancel' flag is defined as true during update operation (day view)", function(assert) {
        this.createInstance({
            onAppointmentUpdating: function(args) {
                args.cancel = true;
            },
            dataSource: [{ startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2), text: "caption" }],
            firstDayOfWeek: 1,
            currentDate: new Date(2015, 1, 9)
        });

        var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment").eq(0)),
            initialHeight = $appointment.outerHeight(),
            cellHeight = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerHeight();

        var pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-bottom").eq(0)).start();
        pointer.dragStart().drag(0, cellHeight * 2).dragEnd();

        assert.equal(this.instance.$element().find(".dx-scheduler-appointment").eq(0).outerHeight(), initialHeight, "Height is OK");
    });

    QUnit.test("Appointment should have initial size if 'cancel' flag is defined as true during update operation (month view)", function(assert) {
        this.createInstance({
            onAppointmentUpdating: function(args) {
                args.cancel = true;
            },
            views: ["month"],
            currentView: "month",
            dataSource: [{ startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2), text: "caption" }],
            firstDayOfWeek: 1,
            currentDate: new Date(2015, 1, 9)
        });

        var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment").eq(0)),
            initialWidth = $appointment.outerWidth(),
            cellWidth = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerWidth();

        var pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-right").eq(0)).start();
        pointer.dragStart().drag(cellWidth * 2, 0).dragEnd();

        assert.equal(this.instance.$element().find(".dx-scheduler-appointment").eq(0).outerWidth(), initialWidth, "Width is OK");
    });

    QUnit.test("Appointment should have initial size if 'cancel' flag is defined as true during update operation (all day)", function(assert) {
        this.createInstance({
            onAppointmentUpdating: function(args) {
                args.cancel = true;
            },
            currentView: "week",
            dataSource: [{ startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 10), text: "caption", allDay: true }],
            firstDayOfWeek: 1,
            currentDate: new Date(2015, 1, 9)
        });

        var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment").eq(0)),
            initialWidth = $appointment.outerWidth(),
            cellWidth = this.instance.$element().find(".dx-scheduler-all-day-table-cell").eq(0).outerWidth();

        var pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-right").eq(0)).start();
        pointer.dragStart().drag(cellWidth * 2, 0).dragEnd();

        assert.equal(this.instance.$element().find(".dx-scheduler-appointment").eq(0).outerWidth(), initialWidth, "Width is OK");
    });

    QUnit.test("Appointment should have initial size if 'cancel' flag is defined as true during update operation (if appointment takes few days)", function(assert) {
        this.createInstance({
            onAppointmentUpdating: function(args) {
                args.cancel = true;
            },
            currentView: "week",
            dataSource: [{ startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 11), text: "caption" }],
            firstDayOfWeek: 1,
            currentDate: new Date(2015, 1, 9)
        });

        var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment").eq(0)),
            initialWidth = $appointment.outerWidth(),
            cellWidth = this.instance.$element().find(".dx-scheduler-all-day-table-cell").eq(0).outerWidth();

        var pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-right").eq(0)).start();
        pointer.dragStart().drag(cellWidth * 3, 0).dragEnd();

        assert.equal(this.instance.$element().find(".dx-scheduler-appointment").eq(0).outerWidth(), initialWidth, "Width is OK");
    });

    QUnit.test("Appointment should have initial left coordinate if 'cancel' flag is defined as true during resize operation", function(assert) {
        this.createInstance({
            onAppointmentUpdating: function(args) {
                args.cancel = true;
            },
            currentView: "week",
            dataSource: [{ startDate: new Date(2015, 1, 11), endDate: new Date(2015, 1, 13), text: "caption" }],
            firstDayOfWeek: 1,
            currentDate: new Date(2015, 1, 9)
        });

        var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment").eq(0)),
            initialLeftPosition = translator.locate($appointment).left,
            cellWidth = this.instance.$element().find(".dx-scheduler-all-day-table-cell").eq(0).outerWidth(),
            pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-left").eq(0)).start();

        pointer.dragStart().drag(-cellWidth * 2, 0).dragEnd();

        assert.equal(translator.locate(this.instance.$element().find(".dx-scheduler-appointment").eq(0)).left, initialLeftPosition, "Left position is OK");
    });

    QUnit.test("Appointment should have initial top coordinate if 'cancel' flag is defined as true during resize operation", function(assert) {
        this.createInstance({
            onAppointmentUpdating: function(args) {
                args.cancel = true;
            },
            currentView: "week",
            dataSource: [{ startDate: 1423620000000, endDate: 1423627200000, text: "caption" }],
            firstDayOfWeek: 1,
            currentDate: new Date(2015, 1, 9)
        });

        var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment").eq(0)),
            initialTopPosition = translator.locate($appointment).top,
            cellHeight = this.instance.$element().find(".dx-scheduler-all-day-table-cell").eq(0).outerHeight(),
            pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-top").eq(0)).start();

        pointer.dragStart().drag(0, -cellHeight * 2).dragEnd();

        assert.equal(translator.locate(this.instance.$element().find(".dx-scheduler-appointment").eq(0)).top, initialTopPosition, "Top position is OK");
    });

    QUnit.test("onAppointmentUpdated", function(assert) {
        var updatedSpy = sinon.spy(noop),
            oldData = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: "caption" }],
            newData = { startDate: new Date(2015, 1, 10, 16), endDate: new Date(2015, 1, 10, 17), text: "title" };

        this.createInstance({
            onAppointmentUpdated: updatedSpy,
            dataSource: new DataSource({ store: oldData }),
            currentDate: new Date(2015, 1, 9)
        });

        this.instance.updateAppointment(oldData[0], newData);
        this.clock.tick();

        var args = updatedSpy.getCall(0).args[0];

        assert.ok(updatedSpy.calledOnce, "onAppointmentUpdated was called");
        assert.equal(args.element, this.instance.element(), "Element field is OK");
        assert.equal(args.component, this.instance, "Component field is OK");
        assert.deepEqual(args.appointmentData, newData, "newData field is OK");
        assert.strictEqual(args.error, undefined, "Error field is not defined");
    });

    QUnit.test("onAppointmentUpdated should have error field in args if an error occurs while data updating", function(assert) {
        var updatedSpy = sinon.spy(noop),
            oldData = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: "caption" }],
            newData = { startDate: new Date(2015, 1, 10, 16), endDate: new Date(2015, 1, 10, 17), text: "title" };

        this.createInstance({
            onAppointmentUpdated: updatedSpy,
            dataSource: new DataSource({
                store: new CustomStore({
                    load: function(options) {
                        var d = $.Deferred();
                        d.resolve(oldData);
                        return d.promise();
                    },
                    update: function() {
                        return $.Deferred().reject(new Error("Unknown error occurred"));
                    }
                })
            })
        });

        this.instance.updateAppointment(oldData[0], newData);
        this.clock.tick();

        var error = updatedSpy.getCall(0).args[0].error;

        assert.ok(error instanceof Error, "Error field is defined");
        assert.equal(error.message, "Unknown error occurred", "Error message is OK");
    });

    QUnit.test("onAppointmentDeleting", function(assert) {
        var deletingSpy = sinon.spy(noop),
            appointments = [
                { startDate: new Date(2015, 3, 29, 5), text: "Appointment 1", endDate: new Date(2015, 3, 29, 6) }
            ];

        this.createInstance({
            onAppointmentDeleting: deletingSpy,
            currentDate: new Date(2015, 3, 29),
            dataSource: new DataSource({
                store: appointments
            })
        });

        this.instance.deleteAppointment(appointments[0]);
        this.clock.tick();

        var args = deletingSpy.getCall(0).args[0];

        assert.ok(deletingSpy.calledOnce, "onAppointmentDeleting was called");
        assert.equal(args.element, this.instance.element(), "Element field is OK");
        assert.equal(args.component, this.instance, "Component field is OK");
        assert.deepEqual(args.appointmentData, { startDate: new Date(2015, 3, 29, 5), text: "Appointment 1", endDate: new Date(2015, 3, 29, 6) }, "Appointment field is OK");
        assert.strictEqual(args.cancel, false, "'Cancel' flag is OK");
    });

    QUnit.test("Appointment should not be deleted if 'cancel' flag is defined as true", function(assert) {
        var appointments = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: "caption" }],
            dataSource = new DataSource({
                store: appointments
            });

        this.createInstance({
            onAppointmentDeleting: function(args) {
                args.cancel = true;
            },
            dataSource: dataSource,
            currentDate: new Date(2015, 1, 9)
        });

        this.instance.deleteAppointment(appointments[0]);
        this.clock.tick();

        assert.deepEqual(dataSource.items(), [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: "caption" }], "Delete operation is canceled");
    });

    QUnit.test("Appointment should not be deleted if 'cancel' flag is defined as true during async operation", function(assert) {
        var appointments = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: "caption" }],
            dataSource = new DataSource({
                store: appointments
            });

        this.createInstance({
            onAppointmentDeleting: function(args) {
                args.cancel = $.Deferred();
                setTimeout(function() {
                    args.cancel.resolve(true);
                }, 200);
            },
            dataSource: dataSource,
            currentDate: new Date(2015, 1, 9)
        });

        this.instance.deleteAppointment(appointments[0]);
        this.clock.tick(200);

        assert.deepEqual(dataSource.items(), [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: "caption" }], "Delete operation is canceled");
    });

    QUnit.test("Appointment should be deleted correctly if 'cancel' flag is defined as false during async operation", function(assert) {
        var appointments = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: "caption" }],
            dataSource = new DataSource({
                store: appointments
            });

        this.createInstance({
            onAppointmentDeleting: function(args) {
                args.cancel = $.Deferred();
                setTimeout(function() {
                    args.cancel.resolve(false);
                }, 200);
            },
            dataSource: dataSource,
            currentDate: new Date(2015, 1, 9)
        });

        this.instance.deleteAppointment(appointments[0]);
        this.clock.tick(200);

        assert.equal(dataSource.items().length, 0, "Delete operation is completed");
    });

    QUnit.test("onAppointmentDeleted", function(assert) {
        var deletedSpy = sinon.spy(noop),
            appointments = [
                { startDate: new Date(2015, 3, 29, 5), text: "Appointment 1", endDate: new Date(2015, 3, 29, 6) }
            ];

        this.createInstance({
            onAppointmentDeleted: deletedSpy,
            currentDate: new Date(2015, 3, 29),
            dataSource: new DataSource({
                store: appointments
            })
        });

        this.instance.deleteAppointment(appointments[0]);
        this.clock.tick();

        var args = deletedSpy.getCall(0).args[0];
        assert.ok(deletedSpy.calledOnce, "onAppointmentDeleted was called");
        assert.equal(args.element, this.instance.element(), "Element field is OK");
        assert.equal(args.component, this.instance, "Component field is OK");
        assert.deepEqual(args.appointmentData, { startDate: new Date(2015, 3, 29, 5), text: "Appointment 1", endDate: new Date(2015, 3, 29, 6) }, "newData field is OK");
        assert.strictEqual(args.error, undefined, "Error field is not defined");
    });

    QUnit.test("onAppointmentDeleted should have error field in args if an error occurs while data deleting", function(assert) {
        var deletedSpy = sinon.spy(noop);

        this.createInstance({
            onAppointmentDeleted: deletedSpy,
            dataSource: new DataSource({
                store: new CustomStore({
                    load: noop,
                    remove: function() {
                        return $.Deferred().reject(new Error("Unknown error occurred"));
                    }
                })
            })
        });

        this.instance.deleteAppointment({});
        this.clock.tick();

        var error = deletedSpy.getCall(0).args[0].error;

        assert.ok(error instanceof Error, "Error field is defined");
        assert.equal(error.message, "Unknown error occurred", "Error message is OK");
    });

    QUnit.test("onAppointmentRendered", function(assert) {
        var renderedSpy = sinon.spy(noop);
        var appointments = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: "caption" }],
            dataSource = new DataSource({
                store: appointments
            });

        this.createInstance({
            dataSource: dataSource,
            onAppointmentRendered: renderedSpy,
            currentDate: new Date(2015, 1, 9)
        });

        var args = renderedSpy.getCall(0).args[0];

        assert.ok(renderedSpy.calledOnce, "onAppointmentRendered was called");
        assert.deepEqual(args.component, this.instance, "component is scheduler instance");
        assert.deepEqual($(args.element).get(0), this.instance.$element().get(0), "element is $scheduler");
        assert.deepEqual(args.appointmentData, appointments[0], "appointment is OK");
        assert.deepEqual($(args.appointmentElement).get(0), this.instance.$element().find(".dx-scheduler-appointment").get(0), "appointment element is OK");
    });

    QUnit.test("onAppointmentRendered should called on each recurrence", function(assert) {
        var renderedSpy = sinon.spy(noop);
        var appointments = [{
                startDate: new Date(2015, 1, 9, 16),
                endDate: new Date(2015, 1, 9, 17),
                text: "caption",
                recurrenceRule: "FREQ=DAILY;COUNT=2",
            }],
            dataSource = new DataSource({
                store: appointments
            });

        this.createInstance({
            currentView: "week",
            dataSource: dataSource,
            onAppointmentRendered: renderedSpy,
            currentDate: new Date(2015, 1, 9)
        });

        assert.ok(renderedSpy.calledTwice, "onAppointmentRendered was called twice");
    });

    QUnit.test("onAppointmentRendered should updated correctly", function(assert) {
        this.createInstance({
            dataSource: new DataSource({
                store: [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: "caption" }]
            }),
            onAppointmentRendered: function() { return 1; },
            currentDate: new Date(2015, 1, 9)
        });

        this.instance.option("onAppointmentRendered", function() { return 2; });
        var appointmentsCollection = this.instance.getAppointmentsInstance();

        assert.equal(appointmentsCollection.option("onItemRendered")(), 2, "option is updated correctly");
    });

    QUnit.test("onAppointmentRendered should fires when appointment is completely rendered", function(assert) {
        this.createInstance({
            editing: {
                allowResizing: true,
                allowDragging: true
            },
            dataSource: new DataSource({
                store: [{
                    startDate: new Date(2015, 1, 9, 16),
                    endDate: new Date(2015, 1, 9, 17),
                    text: "caption",
                    groupId: 1,
                    recurrenceRule: "FREQ=DAILY;INTERVAL=2"
                }],
            }),
            resources: [
                {
                    field: "groupId",
                    dataSource: [
                        {
                            text: "a",
                            id: 1,
                            color: "#ff0000"
                        }
                    ]
                }
            ],
            onAppointmentRendered: function(args) {
                var $appointment = $(args.appointmentElement);

                assert.equal(new Color($appointment.css("backgroundColor")).toHex(), "#ff0000", "Resource color is applied");
                assert.ok($appointment.attr("data-groupid-1"), "Resource data attribute is defined");
                assert.ok($appointment.hasClass("dx-scheduler-appointment-recurrence"), "Recurrent class is defined");
                assert.ok($appointment.hasClass("dx-draggable"), "Draggable class is defined");
                assert.ok($appointment.hasClass("dx-resizable"), "Resizable class is defined");
            },
            currentDate: new Date(2015, 1, 9)
        });
    });

    QUnit.test("onAppointmentRendered should fires when appointment is completely rendered(month view)", function(assert) {
        assert.expect(2);

        this.createInstance({
            dataSource: new DataSource({
                store: [{
                    startDate: new Date(2015, 1, 10),
                    endDate: new Date(2015, 1, 20),
                    text: "caption"
                }],
            }),
            views: ["month"],
            maxAppointmentsPerCell: null,
            currentView: "month",
            onAppointmentRendered: function(args) {
                assert.equal($(args.appointmentElement).find(".dx-scheduler-appointment-reduced-icon").length, 1, "Appointment reduced icon is applied");
            },
            currentDate: new Date(2015, 1, 9)
        });
    });

    QUnit.test("onAppointmentRendered should contain information about all recurring appts", function(assert) {
        this.createInstance({
            dataSource: new DataSource([
                {
                    startDate: new Date(2015, 1, 9, 16),
                    endDate: new Date(2015, 1, 9, 17),
                    text: "caption",
                    recurrenceRule: "FREQ=DAILY"
                }
            ]),
            onAppointmentRendered: function(e) {
                var targetedAppointmentData = e.targetedAppointmentData,
                    appointmentIndex = $(e.appointmentElement).index();

                assert.equal(targetedAppointmentData.startDate.getTime(), new Date(2015, 1, 9 + appointmentIndex, 16).getTime(), "Start date is OK");
                assert.equal(targetedAppointmentData.endDate.getTime(), new Date(2015, 1, 9 + appointmentIndex, 17).getTime(), "End date is OK");
            },
            currentDate: new Date(2015, 1, 9),
            views: ["week"],
            currentView: "week"
        });
    });

    QUnit.test("onAppointmentRendered should fires only for rerendered appointments", function(assert) {
        assert.expect(2);

        this.createInstance({
            dataSource: new DataSource({
                store: [{
                    startDate: new Date(2015, 1, 10),
                    endDate: new Date(2015, 1, 11),
                    text: "caption1"
                }],
            }),
            views: ["month"],
            maxAppointmentsPerCell: null,
            currentView: "month",
            onAppointmentRendered: function(args) {
                assert.ok(true, "Appointment was rendered");
            },
            currentDate: new Date(2015, 1, 9)
        });

        this.instance.addAppointment({
            startDate: new Date(2015, 1, 12, 10),
            endDate: new Date(2015, 1, 13, 20),
            text: "caption2"
        });
        this.clock.tick();
    });

    QUnit.test("All appointments should be rerendered after cellDuration changed", function(assert) {
        assert.expect(6);

        this.createInstance({
            dataSource: new DataSource({
                store: [{
                    startDate: new Date(2015, 1, 10),
                    endDate: new Date(2015, 1, 11),
                    text: "caption1"
                }, {
                    startDate: new Date(2015, 1, 12, 10),
                    endDate: new Date(2015, 1, 13, 20),
                    text: "caption2"
                }],
            }),
            views: ["timelineWeek"],
            currentView: "timelineWeek",
            cellDuration: 60,
            onAppointmentRendered: function(args) {
                assert.ok(true, "Appointment was rendered");
            },
            currentDate: new Date(2015, 1, 9)
        });
        var appointments = this.instance.getAppointmentsInstance(),
            initialItems = appointments.option("items");

        this.instance.option("cellDuration", 100);
        this.clock.tick();

        var changedItems = appointments.option("items");

        assert.notDeepEqual(initialItems[0].settings, changedItems[0].settings, "Item's settings were changed");
        assert.notDeepEqual(initialItems[1].settings, changedItems[1].settings, "Item's settings were changed");
    });

    QUnit.test("targetedAppointmentData should return correct allDay appointmentData", function(assert) {
        this.createInstance({
            dataSource: new DataSource([
                {
                    startDate: new Date(2015, 1, 9),
                    endDate: new Date(2015, 1, 10),
                    allDay: true,
                    text: "All day appointment"
                }
            ]),
            onAppointmentRendered: function(e) {
                var targetedAppointmentData = e.targetedAppointmentData;

                assert.equal(targetedAppointmentData.startDate.getTime(), new Date(2015, 1, 9).getTime(), "Start date is OK");
                assert.equal(targetedAppointmentData.endDate.getTime(), new Date(2015, 1, 10).getTime(), "End date is OK");
            },
            currentDate: new Date(2015, 1, 9),
            views: ["week"],
            currentView: "week"
        });
    });


    QUnit.test("onAppointmentRendered should contain information about all recurring appts on agenda view", function(assert) {
        this.createInstance({
            dataSource: new DataSource([
                {
                    startDate: new Date(2015, 1, 9, 16),
                    endDate: new Date(2015, 1, 9, 17),
                    text: "caption",
                    recurrenceRule: "FREQ=DAILY"
                }
            ]),
            onAppointmentRendered: function(e) {
                var targetedAppointmentData = e.targetedAppointmentData,
                    appointmentIndex = $(e.appointmentElement).index();

                assert.equal(targetedAppointmentData.startDate.getTime(), new Date(2015, 1, 9 + appointmentIndex, 16).getTime(), "Start date is OK");
                assert.equal(targetedAppointmentData.endDate.getTime(), new Date(2015, 1, 9 + appointmentIndex, 17).getTime(), "End date is OK");
            },
            currentDate: new Date(2015, 1, 9),
            views: ["agenda"],
            currentView: "agenda"
        });
    });

    QUnit.test("onAppointmentRendered should not contain information about particular appt resources if there are not groups(T413561)", function(assert) {
        var workSpaceSpy = sinon.spy(dxSchedulerWorkSpace.prototype, "getCellDataByCoordinates");

        this.createInstance({
            dataSource: new DataSource([
                {
                    startDate: new Date(2015, 1, 9, 16),
                    endDate: new Date(2015, 1, 9, 17),
                    text: "caption",
                    recurrenceRule: "FREQ=YEARLY"
                }
            ]),
            currentDate: new Date(2015, 1, 9),
            views: ["week"],
            currentView: "week"
        });

        assert.equal(workSpaceSpy.callCount, 1, "Resources aren't required");
    });

    QUnit.test("onAppointmentClick should fires when appointment is clicked", function(assert) {
        assert.expect(3);

        var items = [{
            startDate: new Date(2015, 2, 10),
            endDate: new Date(2015, 2, 13),
            text: "Task caption"
        }, {
            startDate: new Date(2015, 2, 15),
            endDate: new Date(2015, 2, 20),
            text: "Task caption"
        }];

        this.createInstance({
            dataSource: new DataSource({
                store: items
            }),
            views: ["month"],
            currentView: "month",
            maxAppointmentsPerCell: null,
            currentDate: new Date(2015, 2, 9),
            onAppointmentClick: function(e) {
                assert.deepEqual(isRenderer(e.appointmentElement), !!config().useJQuery, "appointmentElement is correct");
                assert.deepEqual($(e.appointmentElement)[0], $item[0], "appointmentElement is correct");
                assert.strictEqual(e.appointmentData, items[0], "appointmentData is correct");
            }
        });

        var $item = $(this.instance.$element().find(".dx-scheduler-appointment").eq(0));
        $($item).trigger("dxclick");
    });

    QUnit.test("Args of onAppointmentClick should contain data about particular appt", function(assert) {
        assert.expect(2);

        var items = [{
            text: "Task caption",
            start: { date: new Date(2015, 2, 10, 1) },
            end: { date: new Date(2015, 2, 10, 2) },
            recurrence: { rule: "FREQ=DAILY" }
        }];

        this.createInstance({
            dataSource: new DataSource(items),
            views: ["week"],
            currentView: "week",
            currentDate: new Date(2015, 2, 9),
            startDateExpr: "start.date",
            endDateExpr: "end.date",
            recurrenceRuleExpr: "recurrence.rule",
            onAppointmentClick: function(e) {
                var targetedAppointmentData = e.targetedAppointmentData;

                assert.equal(targetedAppointmentData.start.date.getTime(), new Date(2015, 2, 11, 1).getTime(), "Start date is OK");
                assert.equal(targetedAppointmentData.end.date.getTime(), new Date(2015, 2, 11, 2).getTime(), "End date is OK");
            }
        });

        $(this.instance.$element().find(".dx-scheduler-appointment").eq(1)).trigger("dxclick");
    });

    QUnit.test("Args of onAppointmentClick/Rendered should contain data about particular grouped appt", function(assert) {
        assert.expect(6);

        var items = [{
            text: "Task caption",
            start: { date: new Date(2015, 2, 10, 1) },
            end: { date: new Date(2015, 2, 10, 2) },
            owner: { id: [1, 2] },
            priority: 1
        }];

        this.createInstance({
            dataSource: new DataSource(items),
            groups: ["owner.id", "priority"],
            resources: [{
                fieldExpr: "owner.id",
                allowMultiple: true,
                dataSource: [
                    {
                        id: 1,
                        text: "A"
                    }, {
                        id: 2,
                        text: "B"
                    }
                ]
            }, {
                fieldExpr: "priority",
                dataSource: [{ id: 1, text: "Low" }]
            }],
            views: ["week"],
            currentView: "week",
            currentDate: new Date(2015, 2, 9),
            startDateExpr: "start.date",
            endDateExpr: "end.date",
            maxAppointmentsPerCell: null,
            recurrenceRuleExpr: "recurrence.rule",
            onAppointmentClick: function(e) {
                var targetedAppointmentData = e.targetedAppointmentData;

                assert.equal(targetedAppointmentData.owner.id, 2, "Owner id is OK on click");
                assert.equal(targetedAppointmentData.priority, 1, "Priority is OK on click");
            },
            onAppointmentRendered: function(e) {
                var targetedAppointmentData = e.targetedAppointmentData,
                    expectedOwnerId = 1;

                if($(e.appointmentElement).index() === 1) {
                    expectedOwnerId = 2;
                }

                assert.equal(targetedAppointmentData.owner.id, expectedOwnerId, "Owner id is OK on rendered");
                assert.equal(targetedAppointmentData.priority, 1, "Priority is OK on rendered");
            }
        });

        $(this.instance.$element().find(".dx-scheduler-appointment").eq(1)).trigger("dxclick");
    });

    QUnit.test("Args of onAppointmentClick should contain data about particular grouped appt on Agenda view", function(assert) {
        assert.expect(6);

        var items = [{
            text: "Task caption",
            start: { date: new Date(2015, 2, 10, 1) },
            end: { date: new Date(2015, 2, 10, 2) },
            owner: { id: [1, 2] },
            priority: 1
        }];

        this.createInstance({
            dataSource: new DataSource(items),
            groups: ["owner.id", "priority"],
            resources: [{
                fieldExpr: "owner.id",
                allowMultiple: true,
                dataSource: [
                    {
                        id: 1,
                        text: "A"
                    }, {
                        id: 2,
                        text: "B"
                    }
                ]
            }, {
                fieldExpr: "priority",
                dataSource: [{ id: 1, text: "Low" }]
            }],
            views: ["agenda"],
            currentView: "agenda",
            currentDate: new Date(2015, 2, 9),
            startDateExpr: "start.date",
            endDateExpr: "end.date",
            recurrenceRuleExpr: "recurrence.rule",
            onAppointmentClick: function(e) {
                var targetedAppointmentData = e.targetedAppointmentData;

                assert.equal(targetedAppointmentData.owner.id, 2, "Owner id is OK");
                assert.equal(targetedAppointmentData.priority, 1, "Priority is OK");
            },
            onAppointmentRendered: function(e) {
                var targetedAppointmentData = e.targetedAppointmentData,
                    expectedOwnerId = 1;

                if($(e.appointmentElement).index() === 1) {
                    expectedOwnerId = 2;
                }

                assert.equal(targetedAppointmentData.owner.id, expectedOwnerId, "Owner id is OK on rendered");
                assert.equal(targetedAppointmentData.priority, 1, "Priority is OK on rendered");
            }
        });

        $(this.instance.$element().find(".dx-scheduler-appointment").eq(1)).trigger("dxclick");
    });

    QUnit.test("onAppointmentContextMenu should fires when appointment context menu is triggered", function(assert) {
        assert.expect(3);

        var items = [{
            startDate: new Date(2015, 2, 10),
            endDate: new Date(2015, 2, 13),
            text: "Task caption"
        }, {
            startDate: new Date(2015, 2, 15),
            endDate: new Date(2015, 2, 20),
            text: "Task caption"
        }];

        this.createInstance({
            dataSource: new DataSource({
                store: items
            }),
            views: ["month"],
            currentView: "month",
            maxAppointmentsPerCell: null,
            currentDate: new Date(2015, 2, 9),
            onAppointmentContextMenu: function(e) {
                assert.deepEqual(isRenderer(e.appointmentElement), !!config().useJQuery, "appointmentElement is correct");
                assert.deepEqual($(e.appointmentElement)[0], $item[0], "appointmentElement is correct");
                assert.strictEqual(e.appointmentData, items[0], "appointmentData is correct");
            }
        });

        var $item = $(this.instance.$element().find(".dx-scheduler-appointment").eq(0));
        $($item).trigger("dxcontextmenu");
    });

    QUnit.test("Args of onAppointmentContextMenu should contain data about particular appt", function(assert) {
        assert.expect(2);

        var items = [{
            text: "Task caption",
            start: { date: new Date(2015, 2, 10, 1) },
            end: { date: new Date(2015, 2, 10, 2) },
            recurrence: { rule: "FREQ=DAILY" }
        }];

        this.createInstance({
            dataSource: new DataSource(items),
            views: ["week"],
            currentView: "week",
            currentDate: new Date(2015, 2, 9),
            startDateExpr: "start.date",
            endDateExpr: "end.date",
            recurrenceRuleExpr: "recurrence.rule",
            onAppointmentContextMenu: function(e) {
                var targetedAppointmentData = e.targetedAppointmentData;

                assert.equal(targetedAppointmentData.start.date.getTime(), new Date(2015, 2, 11, 1).getTime(), "Start date is OK");
                assert.equal(targetedAppointmentData.end.date.getTime(), new Date(2015, 2, 11, 2).getTime(), "End date is OK");
            }
        });

        $(this.instance.$element().find(".dx-scheduler-appointment").eq(1)).trigger("dxcontextmenu");
    });

    QUnit.test("Cell click option should be passed to workSpace", function(assert) {
        this.createInstance({
            currentView: 'month',
            onCellClick: sinon.stub().returns(1)
        });
        var workspaceMonth = this.instance.getWorkSpace();

        assert.deepEqual(workspaceMonth.option("onCellClick")(), this.instance.option("onCellClick")(), "scheduler has correct onCellClick");

        this.instance.option("onCellClick", sinon.stub().returns(2));
        assert.deepEqual(workspaceMonth.option("onCellClick")(), this.instance.option("onCellClick")(), "scheduler has correct onCellClick after option change");
    });

    QUnit.test("onCellContextMenu option should be passed to workSpace", function(assert) {
        this.createInstance({
            currentView: 'month',
            onCellContextMenu: sinon.stub().returns(1)
        });
        var workspaceMonth = this.instance.getWorkSpace();

        assert.deepEqual(workspaceMonth.option("onCellContextMenu")(), this.instance.option("onCellContextMenu")(), "scheduler has correct onCellContextMenu");

        this.instance.option("onCellContextMenu", sinon.stub().returns(2));
        assert.deepEqual(workspaceMonth.option("onCellContextMenu")(), this.instance.option("onCellContextMenu")(), "scheduler has correct onCellContextMenu after option change");
    });

    QUnit.test("onAppointmentContextMenu option should be passed to appointments", function(assert) {
        this.createInstance({
            currentView: 'month',
            onAppointmentContextMenu: sinon.stub().returns(1)
        });

        var appointments = this.instance.getAppointmentsInstance();
        assert.deepEqual(appointments.option("onItemContextMenu")(), this.instance.option("onAppointmentContextMenu")(), "scheduler has correct onAppointmentContextMenu");

        this.instance.option("onAppointmentContextMenu", sinon.stub().returns(2));
        assert.deepEqual(appointments.option("onItemContextMenu")(), this.instance.option("onAppointmentContextMenu")(), "scheduler has correct onAppointmentContextMenu after option change");
    });

    QUnit.test("onAppointmentDblClick option should be passed to appointments", function(assert) {
        this.createInstance({
            currentView: 'month',
            onAppointmentDblClick: sinon.stub().returns(1)
        });

        var appointments = this.instance.getAppointmentsInstance();
        assert.deepEqual(appointments.option("onAppointmentDblClick")(), this.instance.option("onAppointmentDblClick")(), "scheduler has correct onAppointmentDblClick");

        this.instance.option("onAppointmentDblClick", sinon.stub().returns(2));
        assert.deepEqual(appointments.option("onAppointmentDblClick")(), this.instance.option("onAppointmentDblClick")(), "scheduler has correct onAppointmentDblClick after option change");
    });

    QUnit.test("onAppointmentFormCreated event should be fired while details form is opening", function(assert) {
        var stub = sinon.stub(),
            data = {
                text: "One",
                location: "NY"
            };
        this.createInstance({
            currentView: 'month',
            onAppointmentFormCreated: stub
        });

        this.instance.showAppointmentPopup(data);

        var args = stub.getCall(0).args[0];

        assert.ok(stub.calledOnce, "Event was fired");
        assert.equal(args.appointmentData, data, "Appointment data is OK");
        assert.equal(args.form, this.instance.getAppointmentDetailsForm(), "Appointment form is OK");
    });

    QUnit.test("Option changed", function(assert) {
        this.createInstance();

        this.instance.option({
            "onAppointmentAdding": function() { return true; },
            "onAppointmentAdded": function() { return true; },
            "onAppointmentUpdating": function() { return true; },
            "onAppointmentUpdated": function() { return true; },
            "onAppointmentDeleting": function() { return true; },
            "onAppointmentDeleted": function() { return true; },
            "onAppointmentFormCreated": function() { return true; }
        });

        $.each(this.instance.getActions(), function(name, action) {
            assert.ok(action(), "'" + name + "' option is changed");
        });
    });

    QUnit.test("contentReady action should rise at the right time", function(assert) {
        var done = assert.async();
        this.clock.restore();

        var dataSource = new DataSource({
            store: new CustomStore({
                load: function() {
                    var d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([{
                            startDate: new Date(2016, 2, 15, 1).toString(),
                            endDate: new Date(2016, 2, 15, 2).toString()
                        }]);
                    }, 100);

                    return d.promise();
                }
            })
        });

        this.createInstance({
            currentDate: new Date(2016, 2, 15),
            views: ["week"],
            currentView: "week",
            width: 800,
            dataSource: dataSource,
            onContentReady: function(e) {
                var element = e.component,
                    $element = $(e.component.$element()),
                    $header = element.getHeader().$element(),
                    $workSpace = element.getWorkSpace().$element(),
                    $appointment = $element.find(".dx-scheduler-appointment"),
                    appointmentPosition = translator.locate($appointment);

                assert.equal($header.length, 1, "Header is rendered");
                assert.equal($workSpace.length, 1, "Work Space is rendered");
                assert.equal($appointment.length, 1, "Appointment is rendered");
                assert.roughEqual(appointmentPosition.top, 100, 2.001, "Appointment top is OK");
                assert.roughEqual(appointmentPosition.left, 299, 1.001, "Appointment left is OK");
                done();
            }
        });
    });

    QUnit.test("contentReady action should rise when appointment is added", function(assert) {
        this.createInstance({
            currentDate: new Date(2016, 2, 15),
            views: ["week"],
            currentView: "week",
            width: 800,
            dataSource: []
        });

        this.instance.option("onContentReady", function(e) {
            var $element = $(e.component.$element()),
                $appointment = $element.find(".dx-scheduler-appointment"),
                appointmentPosition = translator.locate($appointment);

            assert.equal($appointment.length, 1, "Appointment is rendered");
            assert.roughEqual(appointmentPosition.top, 100, 2.001, "Appointment top is OK");
            assert.roughEqual(appointmentPosition.left, 299, 1.001, "Appointment left is OK");
        });

        this.instance.addAppointment({
            startDate: new Date(2016, 2, 15, 1).toString(),
            endDate: new Date(2016, 2, 15, 2).toString()
        });
    });

    QUnit.test("contentReady action should rise when appointment is updated", function(assert) {
        var appointment = {
            startDate: new Date(2016, 2, 15, 1).toString(),
            endDate: new Date(2016, 2, 15, 2).toString()
        };

        this.createInstance({
            currentDate: new Date(2016, 2, 15),
            views: ["week"],
            currentView: "week",
            width: 800,
            dataSource: [appointment]
        });

        this.instance.option("onContentReady", function(e) {
            var $element = $(e.component.$element()),
                $appointment = $element.find(".dx-scheduler-appointment"),
                appointmentPosition = translator.locate($appointment);

            assert.equal($appointment.length, 1, "Appointment is rendered");
            assert.roughEqual(appointmentPosition.top, 150, 2.001, "Appointment top is OK");
            assert.roughEqual(appointmentPosition.left, 299, 1.001, "Appointment left is OK");
        });

        this.instance.updateAppointment(appointment, {
            startDate: new Date(2016, 2, 15, 1, 30).toString()
        });
    });

    QUnit.test("contentReady action should rise when appointment is deleted", function(assert) {
        var appointment = {
            startDate: new Date(2016, 2, 15, 1).toString(),
            endDate: new Date(2016, 2, 15, 2).toString()
        };

        this.createInstance({
            currentDate: new Date(2016, 2, 15),
            views: ["week"],
            currentView: "week",
            width: 800,
            dataSource: [appointment]
        });

        this.instance.option("onContentReady", function(e) {
            var $appointment = $(e.component.$element().find(".dx-scheduler-appointment"));
            assert.equal($appointment.length, 0, "Appointment is not rendered");
        });

        this.instance.deleteAppointment(appointment);
    });
})("Events");

(function() {
    QUnit.module("Keyboard Navigation", {
        beforeEach: function() {
            this.createInstance = function(options) {
                this.instance = $("#scheduler").dxScheduler(options).dxScheduler("instance");
            };
            this.clock = sinon.useFakeTimers();
            fx.off = true;
        },
        afterEach: function() {
            this.clock.restore();
            fx.off = false;
        }
    });

    QUnit.test("Focus options should be passed to scheduler parts", function(assert) {
        this.createInstance({ focusStateEnabled: true, tabIndex: 1, currentView: "day" });
        var header = this.instance.getHeader(),
            workspace = this.instance.getWorkSpace(),
            appointments = this.instance.getAppointmentsInstance();

        assert.equal(this.instance.$element().attr("tabindex"), null, "scheduler has no tabIndex");

        assert.equal(header.option("focusStateEnabled"), true, "header has correct focusStateEnabled");
        assert.equal(workspace.option("focusStateEnabled"), true, "workspace has correct focusStateEnabled");
        assert.equal(appointments.option("focusStateEnabled"), true, "appointments has correct focusStateEnabled");

        assert.equal(header.option("tabIndex"), 1, "header has correct tabIndex");
        assert.equal(workspace.option("tabIndex"), 1, "workspace has correct tabIndex");
        assert.equal(appointments.option("tabIndex"), 1, "appointments has correct tabIndex");

    });

    QUnit.test("Focus options should be passed to scheduler parts after option changed", function(assert) {
        this.createInstance({ focusStateEnabled: true, tabIndex: 1, currentView: "day" });
        var header = this.instance.getHeader(),
            workspace = this.instance.getWorkSpace(),
            appointments = this.instance.getAppointmentsInstance();

        this.instance.option("tabIndex", 2);

        assert.equal(header.option("tabIndex"), 2, "header has correct tabIndex");
        assert.equal(workspace.option("tabIndex"), 2, "workspace has correct tabIndex");
        assert.equal(appointments.option("tabIndex"), 2, "appointments has correct tabIndex");

        this.instance.option("focusStateEnabled", false);

        assert.equal(header.option("focusStateEnabled"), false, "header has correct focusStateEnabled");
        assert.equal(workspace.option("focusStateEnabled"), false, "workspace has correct focusStateEnabled");
        assert.equal(appointments.option("focusStateEnabled"), false, "appointments has correct focusStateEnabled");

    });

    QUnit.test("AllowMultipleCellSelection option should be passed to scheduler workspace", function(assert) {
        this.createInstance({ focusStateEnabled: true, allowMultipleCellSelection: false });
        var workspace = this.instance.getWorkSpace();

        assert.equal(workspace.option("allowMultipleCellSelection"), false, "allowMultipleCellSelection");

        this.instance.option("allowMultipleCellSelection", true);

        assert.equal(workspace.option("allowMultipleCellSelection"), true, "allowMultipleCellSelection");

    });

    QUnit.test("focusedStateEnabled option value should be passed to ddAppointments", function(assert) {
        this.createInstance({
            dataSource: [{
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: "Task 1"
            }, {
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: "Task 2"
            }, {
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: "Task 3"
            }],
            currentDate: new Date(2015, 4, 24),
            views: ["month"],
            currentView: "month",
            focusStateEnabled: false
        });

        var ddAppointments = this.instance.$element().find(".dx-scheduler-dropdown-appointments").eq(0).dxDropDownMenu("instance");
        assert.notOk(ddAppointments.option("focusStateEnabled"), "focusStateEnabled was passed correctly");

        this.instance.option("focusStateEnabled", true);
        ddAppointments = this.instance.$element().find(".dx-scheduler-dropdown-appointments").eq(0).dxDropDownMenu("instance");
        assert.ok(ddAppointments.option("focusStateEnabled"), "focusStateEnabled was passed correctly");
    });

    QUnit.test("Workspace navigation by arrows should work correctly with opened dropDown appointments", function(assert) {
        this.createInstance({
            dataSource: [{
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: "Task 1"
            }, {
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: "Task 2"
            }, {
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: "Task 3"
            }],
            currentDate: new Date(2015, 4, 24),
            views: ["month"],
            currentView: "month",
            focusStateEnabled: true
        });

        var $workSpace = this.instance.getWorkSpace().$element(),
            keyboard = keyboardMock($workSpace);

        $(this.instance.$element().find(".dx-scheduler-dropdown-appointments")).trigger("dxclick");

        keyboard.keyDown("down");
        keyboard.keyDown("up");
        keyboard.keyDown("right");
        keyboard.keyDown("left");

        assert.ok(true, "Scheduler works correctly");
    });
})("Keyboard Navigation");

(function() {

    QUnit.module("Loading", {
        beforeEach: function() {
            this.instance = $("#scheduler").dxScheduler({
                showCurrentTimeIndicator: false
            }).dxScheduler("instance");
            this.clock = sinon.useFakeTimers();
            this.instance.option({
                currentView: "day",
                currentDate: new Date(2015, 10, 1),
                dataSource: new DataSource({
                    store: new CustomStore({
                        load: function() {
                            var d = $.Deferred();
                            setTimeout(function() {
                                d.resolve([]);
                            }, 100);

                            return d.promise();
                        }
                    })
                })
            });
            fx.off = true;
        },
        afterEach: function() {
            this.clock.restore();
            fx.off = false;
        }
    });

    QUnit.test("Loading panel should be shown while datasource is reloading", function(assert) {
        this.clock.tick(100);

        this.instance.option("currentView", "week");
        assert.equal(this.instance.$element().find(".dx-loadpanel-wrapper").length, 1, "loading panel is shown");
    });

    QUnit.test("Loading panel should hide", function(assert) {
        this.clock.tick(100);
        this.instance.option("currentView", "week");
        this.clock.tick(100);

        assert.equal($(".dx-loadpanel-wrapper").length, 0, "loading panel hide");
    });

    QUnit.test("Loading panel should be shown in centre of scheduler", function(assert) {
        this.clock.tick(100);

        this.instance.option("currentView", "week");
        var loadingInstance = $(".dx-loadpanel").last().dxLoadPanel("instance");
        assert.deepEqual(loadingInstance.option("position.of").get(0), this.instance.$element().get(0), "loading panel is shown in right place");
    });

})("Loading");

(function() {
    QUnit.module("Filtering", {
        beforeEach: function() {
            this.createInstance = function(options) {
                this.instance = $("#scheduler").dxScheduler(options).dxScheduler("instance");
            };
        }
    });

    QUnit.test("Start view date & end view date should be passed to the load method as filter expression", function(assert) {
        var dataSource = new DataSource({
            load: function(options) {

                var filter = options.filter,
                    dateFilter = filter[0][0],
                    zeroDurationFilter = filter[0][4];

                assert.ok($.isArray(filter), "Filter is array");

                assert.equal(filter[0].length, 5, "Filter size is OK");

                assert.equal(dateFilter.length, 2, "Date filter contains 2 items");

                assert.deepEqual(dateFilter[0], ["endDate", ">", startViewDate]);

                assert.deepEqual(dateFilter[1], ["startDate", "<", endViewDate]);

                assert.equal(filter.length, 1, "Filter contains only dates");

                assert.deepEqual(zeroDurationFilter[0], ["endDate", startViewDate]);
                assert.deepEqual(zeroDurationFilter[1], ["startDate", startViewDate]);
            }
        });
        var startViewDate = new Date(2015, 11, 7),
            endViewDate = new Date(2015, 11, 14);

        this.createInstance({
            currentDate: new Date(2015, 11, 12),
            firstDayOfWeek: 1,
            currentView: "week",
            dataSource: dataSource,
            remoteFiltering: true
        });

    });

    QUnit.test("Recurrent appointments should be always loaded, if recurrenceRuleExpr !=null", function(assert) {
        var dataSource = new DataSource({
            load: function(options) {
                var filter = options.filter;
                assert.equal(filter[0][1], "or");
                assert.deepEqual(filter[0][2], ["recurrenceRule", "startswith", "freq"]);
            }
        });
        this.createInstance({
            currentDate: new Date(2015, 11, 12),
            firstDayOfWeek: 1,
            currentView: "week",
            dataSource: dataSource,
            remoteFiltering: true
        });

    });

    QUnit.test("There is no filter expression by recurrenceRule, if recurrenceRuleExpr is null", function(assert) {
        var dataSource = new DataSource({
            load: function(options) {
                var filter = options.filter;
                assert.equal(filter[0].length, 3, "recurrenceRule expression is absent");
            }
        });
        this.createInstance({
            currentDate: new Date(2015, 11, 12),
            firstDayOfWeek: 1,
            currentView: "week",
            views: ["week"],
            dataSource: dataSource,
            remoteFiltering: true,
            recurrenceRuleExpr: null
        });

    });

    QUnit.test("Internal scheduler filter should be merged with user's filter if it exists", function(assert) {
        var userFilter = ["someField", "contains", "abc"],
            dataSource = new DataSource({
                filter: ["someField", "contains", "abc"],
                load: function(options) {
                    var filter = options.filter;

                    assert.equal(filter.length, 2);
                    assert.deepEqual(filter[1], userFilter);
                }
            });

        this.createInstance({
            currentDate: new Date(2015, 11, 12),
            firstDayOfWeek: 1,
            currentView: "week",
            dataSource: dataSource,
            remoteFiltering: true
        });

    });

    QUnit.test("Scheduler should filter data on client side if the remoteFiltering option is false", function(assert) {
        var dataSource = new DataSource([
            { StartDate: new Date(2015, 11, 23).toString(), EndDate: new Date(2015, 11, 23, 0, 30).toString() },
            { StartDate: new Date(2015, 11, 19).toString(), EndDate: new Date(2015, 11, 19, 0, 30).toString() }
        ]);

        this.createInstance({
            currentDate: new Date(2015, 11, 24),
            firstDayOfWeek: 1,
            currentView: "week",
            dataSource: dataSource,
            remoteFiltering: false,
            startDateExpr: "StartDate",
            endDateExpr: "EndDate"
        });

        var $appointments = $(this.instance.$element().find(".dx-scheduler-appointment"));

        assert.equal($appointments.length, 1, "There is only one appt");
        assert.deepEqual(dataUtils.data($appointments[0], "dxItemData"), { StartDate: new Date(2015, 11, 23).toString(), EndDate: new Date(2015, 11, 23, 0, 30).toString() }, "Appointment data is OK");
    });

    QUnit.test("Scheduler should filter data on client side if the remoteFiltering option is false and forceIsoDateParsing", function(assert) {
        var defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = true;
        try {
            var dataSource = new DataSource([
                { StartDate: new Date(2015, 11, 23).toString(), EndDate: new Date(2015, 11, 23, 0, 30).toString() },
                { StartDate: new Date(2015, 11, 19).toString(), EndDate: new Date(2015, 11, 19, 0, 30).toString() }
            ]);

            this.createInstance({
                currentDate: new Date(2015, 11, 24),
                firstDayOfWeek: 1,
                currentView: "week",
                dataSource: dataSource,
                remoteFiltering: false,
                startDateExpr: "StartDate",
                endDateExpr: "EndDate"
            });

            var $appointments = $(this.instance.$element().find(".dx-scheduler-appointment"));

            assert.equal($appointments.length, 1, "There is only one appt");
            assert.deepEqual(dataUtils.data($appointments[0], "dxItemData"), { StartDate: new Date(2015, 11, 23).toString(), EndDate: new Date(2015, 11, 23, 0, 30).toString() }, "Appointment data is OK");
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    QUnit.test("Scheduler should filter data on server side if the remoteFiltering option is true", function(assert) {
        var dataSource = new DataSource([
            { StartDate: "2015-12-23T00:00", EndDate: "2015-12-23T00:30" },
            { StartDate: "2015-12-19T00:00", EndDate: "2015-12-19T00:30" }
        ]);

        this.createInstance({
            currentDate: new Date(2015, 11, 24),
            firstDayOfWeek: 1,
            currentView: "week",
            dataSource: dataSource,
            remoteFiltering: true,
            startDateExpr: "StartDate",
            endDateExpr: "EndDate"
        });

        assert.equal(this.instance.option("dataSource").items().length, 0, "Appointments are filtered correctly");
    });

    QUnit.test("Scheduler should filter data on client side depends on user filter", function(assert) {
        var dataSource = new DataSource({
            filter: ["UserId", 1],
            store: [
                { StartDate: new Date(2015, 11, 23).toString(), EndDate: new Date(2015, 11, 23, 0, 30).toString(), UserId: 1 },
                { StartDate: new Date(2015, 11, 24).toString(), EndDate: new Date(2015, 11, 24, 0, 30).toString(), UserId: 2 }
            ]
        });

        this.createInstance({
            currentDate: new Date(2015, 11, 24),
            firstDayOfWeek: 1,
            currentView: "week",
            dataSource: dataSource,
            remoteFiltering: false,
            startDateExpr: "StartDate",
            endDateExpr: "EndDate"
        });

        assert.deepEqual(this.instance.option("dataSource").items(), [{ StartDate: new Date(2015, 11, 23).toString(), EndDate: new Date(2015, 11, 23, 0, 30).toString(), UserId: 1 }], "Appointments are filtered correctly");
    });

    QUnit.test("Date filter should be used everytime before render", function(assert) {
        var dataSource = new DataSource({
            store: new CustomStore({
                load: function() {
                    return [
                        { StartDate: new Date(2015, 11, 23).toString(), EndDate: new Date(2015, 11, 23, 0, 30).toString() },
                        { StartDate: new Date(2015, 9, 24).toString(), EndDate: new Date(2015, 9, 24, 0, 30).toString() }
                    ];
                }
            })
        });

        this.createInstance({
            currentDate: new Date(2015, 11, 24),
            firstDayOfWeek: 1,
            currentView: "week",
            dataSource: dataSource,
            remoteFiltering: false,
            startDateExpr: "StartDate",
            endDateExpr: "EndDate"
        });

        assert.equal(this.instance.$element().find(".dx-scheduler-appointment").length, 1, "Appointment is rendered");
    });

})("Filtering");

(function() {
    QUnit.module("Small size", {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();
            this.createInstance = function(options) {
                this.instance = $("#scheduler").dxScheduler(options).dxScheduler("instance");
            };
        },
        afterEach: function() {
            this.clock.restore();
        }
    });

    QUnit.test("Scheduler should have a small css class on init", function(assert) {
        this.createInstance({
            width: 300
        });

        assert.ok(this.instance.$element().hasClass("dx-scheduler-small"), "Scheduler has 'dx-scheduler-small' css class");
    });


    QUnit.test("Scheduler should have a small css class", function(assert) {
        this.createInstance({
            width: 600
        });

        this.instance.option("width", 300);
        assert.ok(this.instance.$element().hasClass("dx-scheduler-small"), "Scheduler has 'dx-scheduler-small' css class");
        this.instance.option("width", 600);
        assert.notOk(this.instance.$element().hasClass("dx-scheduler-small"), "Scheduler has no 'dx-scheduler-small' css class");
    });

    QUnit.test("Rendering small scheduler inside invisible element", function(assert) {
        try {
            domUtils.triggerHidingEvent($("#scheduler"));
            this.createInstance({
                width: 300,
                currentView: "week",
                maxAppointmentsPerCell: null,
                dataSource: [{
                    text: "a",
                    startDate: new Date(2015, 6, 5, 0, 0),
                    endDate: new Date(2015, 6, 5, 3, 0),
                }],
                currentDate: new Date(2015, 6, 6)
            });
            $("#scheduler").hide();
        } finally {
            $("#scheduler").show();
            domUtils.triggerShownEvent($("#scheduler"));
            this.instance.option("width", 600);
            this.clock.tick();

            var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment"));
            assert.roughEqual($appointment.position().left, 100, 1.001, "Appointment is rendered correctly");
        }
    });

})("Small size");

(function() {
    QUnit.module("View with configuration", {
        beforeEach: function() {
            this.createInstance = function(options) {
                this.instance = $("#scheduler").dxScheduler(options).dxScheduler("instance");
            };
            this.clock = sinon.useFakeTimers();
        },
        afterEach: function() {
            this.clock.restore();
        }
    });

    QUnit.test("Scheduler should have specific cellDuration setting of the view", function(assert) {
        var viewCellDuration = 60;
        this.createInstance({
            views: [{
                type: "day",
                cellDuration: viewCellDuration
            }, "week"],
            cellDuration: 40,
            currentView: "day"
        });

        var workSpace = this.instance.getWorkSpace();

        assert.equal(workSpace.option("hoursInterval") * 60, viewCellDuration, "value of the cellDuration");

        this.instance.option("currentView", "week");

        workSpace = this.instance.getWorkSpace();

        assert.equal(workSpace.option("hoursInterval") * 60, this.instance.option("cellDuration"), "workspace has correct cellDuration after change");

    });

    QUnit.test("Scheduler should have specific startDayHour setting of the view", function(assert) {
        this.createInstance({
            views: [{
                type: "day",
                startDayHour: 10
            }],
            startDayHour: 8,
            currentView: "day"
        });

        assert.equal(this.instance._workSpace.option("startDayHour"), 10, "value of the startDayHour");
    });

    QUnit.test("Scheduler should have specific endDayHour setting of the view", function(assert) {
        this.createInstance({
            views: [{
                type: "day",
                endDayHour: 20
            }],
            endDayHour: 23,
            currentView: "day"
        });

        assert.equal(this.instance._workSpace.option("endDayHour"), 20, "value of the endDayHour");
    });

    QUnit.test("Scheduler should have specific firstDayOfWeek setting of the view", function(assert) {
        this.createInstance({
            views: [{
                type: "workWeek",
                firstDayOfWeek: 0
            }],
            firstDayOfWeek: 3,
            currentView: "workWeek"
        });

        assert.equal(this.instance._workSpace.option("firstDayOfWeek"), 0, "value of the firstDayOfWeek in workSpace");
        assert.equal(this.instance._header.option("firstDayOfWeek"), 0, "value of the firstDayOfWeek in header");
    });

    QUnit.test("Scheduler should have specific groups setting of the view", function(assert) {
        var dataSource1 = [
                { id: 1, text: "group1" },
                { id: 2, text: "group2" }
            ],
            dataSource2 = [
                { id: 1, text: "group3" },
                { id: 2, text: "group4" }
            ];

        this.createInstance({
            views: [{
                type: "workWeek",
                groups: ["test2"]
            }],
            groups: ["test1"],
            resources: [
                {
                    field: "test1",
                    dataSource: dataSource1
                },
                {
                    field: "test2",
                    dataSource: dataSource2
                }
            ],
            currentView: "workWeek"
        });

        assert.deepEqual(this.instance._workSpace.option("groups"), [{
            data: dataSource2,
            items: dataSource2,
            name: "test2"
        }], "value of the groups");
    });

    QUnit.test("Scheduler should have specific agendaDuration setting of the view", function(assert) {
        this.createInstance({
            views: [{
                type: "agenda",
                agendaDuration: 4
            }],
            agendaDuration: 7,
            currentView: "agenda"
        });

        assert.equal(this.instance._workSpace.option("agendaDuration"), 4, "value of the agendaDuration");
    });

    QUnit.test("Scheduler should have specific dataCellTemplate setting of the view", function(assert) {
        var countCallTemplate1 = 0,
            countCallTemplate2 = 0;

        this.createInstance({
            views: [{
                type: "day",
                dataCellTemplate: function() {
                    countCallTemplate2++;
                }
            }],
            dataCellTemplate: function() {
                countCallTemplate1++;
            },
            currentView: "day"
        });

        assert.equal(countCallTemplate1, 0, "count call first template");
        assert.notEqual(countCallTemplate2, 0, "count call second template");
    });

    QUnit.test("Scheduler should have specific dateCellTemplate setting of the view", function(assert) {
        var countCallTemplate1 = 0,
            countCallTemplate2 = 0;

        this.createInstance({
            dataSource: [],
            views: [{
                type: "week",
                dateCellTemplate: function(item, index, container) {
                    assert.equal(isRenderer(container), !!config().useJQuery, "element is correct");
                    countCallTemplate2++;
                }
            }],
            dateCellTemplate: function() {
                countCallTemplate1++;
            },
            currentView: "week"
        });

        assert.equal(countCallTemplate1, 0, "count call first template");
        assert.notEqual(countCallTemplate2, 0, "count call second template");
    });

    QUnit.test("Scheduler should have specific timeCellTemplate setting of the view", function(assert) {
        var countCallTemplate1 = 0,
            countCallTemplate2 = 0;

        this.createInstance({
            dataSource: [],
            views: [{
                type: "week",
                timeCellTemplate: function() {
                    countCallTemplate2++;
                }
            }],
            timeCellTemplate: function() {
                countCallTemplate1++;
            },
            currentView: "week"
        });

        assert.equal(countCallTemplate1, 0, "count call first template");
        assert.notEqual(countCallTemplate2, 0, "count call second template");
    });

    QUnit.test("Scheduler should have specific resourceCellTemplate setting of the view", function(assert) {
        var countCallTemplate1 = 0,
            countCallTemplate2 = 0,
            dataSource = [
                { id: 1, text: "group1" },
                { id: 2, text: "group2" }
            ];

        this.createInstance({
            views: [{
                type: "week",
                resourceCellTemplate: function() {
                    countCallTemplate2++;
                }
            }],
            groups: ["test"],
            resources: [
                {
                    field: "test",
                    dataSource: dataSource
                }
            ],
            resourceCellTemplate: function() {
                countCallTemplate1++;
            },
            currentView: "week"
        });

        assert.equal(countCallTemplate1, 0, "count call first template");
        assert.notEqual(countCallTemplate2, 0, "count call second template");
    });

    QUnit.test("Scheduler should have specific appointmentTemplate setting of the view", function(assert) {
        var countCallTemplate1 = 0,
            countCallTemplate2 = 0;

        this.createInstance({
            dataSource: [{
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1)
            }],
            currentDate: new Date(2015, 4, 24),
            views: [{
                type: "week",
                appointmentTemplate: function(item, index, container) {
                    assert.deepEqual(isRenderer(container), !!config().useJQuery, "appointmentElement is correct");
                    countCallTemplate2++;
                }
            }],
            appointmentTemplate: function() {
                countCallTemplate1++;
            },
            currentView: "week"
        });

        assert.equal(countCallTemplate1, 0, "count call first template");
        assert.notEqual(countCallTemplate2, 0, "count call second template");
    });

    QUnit.test("Scheduler should have specific appointmentTemplate setting of the view after current view changing", function(assert) {
        var countCallTemplate1 = 0,
            countCallTemplate2 = 0;

        this.createInstance({
            dataSource: [{
                startDate: new Date(2015, 4, 26, 9, 10),
                endDate: new Date(2015, 4, 26, 11, 1)
            }],
            currentDate: new Date(2015, 4, 26),
            views: [{
                type: "week",
                name: "Week",
                appointmentTemplate: function(item, index, container) {
                    assert.deepEqual(isRenderer(container), !!config().useJQuery, "appointmentElement is correct");
                    countCallTemplate1++;
                }
            }, {
                type: "workWeek",
                name: "WorkWeek",
                appointmentTemplate: function(item, index, container) {
                    assert.deepEqual(isRenderer(container), !!config().useJQuery, "appointmentElement is correct");
                    countCallTemplate2++;
                }
            }],
            currentView: "Week"
        });

        this.instance.option("currentView", "WorkWeek");

        assert.notEqual(countCallTemplate1, 0, "count call first template");
        assert.notEqual(countCallTemplate2, 0, "count call second template");
    });

    QUnit.test("Scheduler should have specific dropDownAppointmentTemplate setting of the view", function(assert) {
        var countCallTemplate1 = 0,
            countCallTemplate2 = 0;

        this.createInstance({
            dataSource: [{
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: "Task 1"
            }, {
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: "Task 2"
            }, {
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: "Task 3"
            }],
            currentDate: new Date(2015, 4, 24),
            views: [{
                type: "month",
                dropDownAppointmentTemplate: function(item, index, container) {
                    assert.deepEqual(isRenderer(container), !!config().useJQuery, "appointmentElement is correct");
                    countCallTemplate2++;
                }
            }],
            dropDownAppointmentTemplate: function() {
                countCallTemplate1++;
            },
            currentView: "month"
        });

        $(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance").open();

        assert.equal(countCallTemplate1, 0, "count call first template");
        assert.notEqual(countCallTemplate2, 0, "count call second template");
    });

    QUnit.test("Scheduler should have specific appointmentTooltipTemplate setting of the view", function(assert) {
        var countCallTemplate1 = 0,
            countCallTemplate2 = 0;

        this.createInstance({
            dataSource: [{
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1)
            }],
            currentDate: new Date(2015, 4, 24),
            views: [{
                type: "week",
                appointmentTooltipTemplate: function(item, container) {
                    assert.equal(isRenderer(container), !!config().useJQuery, "element is correct");
                    countCallTemplate2++;
                }
            }],
            appointmentTooltipTemplate: function() {
                countCallTemplate1++;
            },
            currentView: "week"
        });

        $(this.instance.$element().find(".dx-scheduler-appointment").eq(0)).trigger("dxclick");
        this.clock.tick(300);

        assert.equal(countCallTemplate1, 0, "count call first template");
        assert.notEqual(countCallTemplate2, 0, "count call second template");
    });

    QUnit.test("Scheduler should have correct dayDuration by certain startDayHour and endDayHour", function(assert) {
        this.createInstance({
            startDayHour: 7,
            endDayHour: 23,
            views: [{
                type: "workWeek",
                startDayHour: 9,
                endDayHour: 18
            }],
            currentView: "workWeek"
        });

        assert.equal(this.instance._getDayDuration(), 9, "correct dayDuration");
    });

    QUnit.test("Check appointment takes all day by certain startDayHour and endDayHour", function(assert) {
        this.createInstance({
            startDayHour: 9,
            endDayHour: 18,
            views: [{
                type: "week",
                startDayHour: 7,
                endDayHour: 23
            }],
            currentView: "week"
        });

        var result = this.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 9),
            endDate: new Date(2015, 5, 4, 18)
        });

        assert.ok(!result, "Appointment doesn't takes all day");

        result = this.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 7),
            endDate: new Date(2015, 5, 4, 23)
        });

        assert.ok(result, "Appointment takes all day");
    });

    QUnit.test("Workspace should have an specific class if view.maxAppointmentsPerCell is set", function(assert) {
        this.createInstance({
            currentView: "Week",
            views: [{
                type: "week",
                name: "Week",
                maxAppointmentsPerCell: 3
            },
            {
                type: "day",
                name: "day",
                maxAppointmentsPerCell: null
            }]
        });

        var $workSpace = this.instance.getWorkSpace().$element();
        assert.ok($workSpace.hasClass("dx-scheduler-work-space-overlapping"), "workspace has correct class");

        this.instance.option("currentView", "day");
        $workSpace = this.instance.getWorkSpace().$element();
        assert.notOk($workSpace.hasClass("dx-scheduler-work-space-overlapping"), "workspace hasn't class");
    });

    QUnit.module("Options for Material theme in components", {
        beforeEach: function() {
            this.origIsMaterial = themes.isMaterial;
            themes.isMaterial = function() { return true; };
            this.createInstance = function(options) {
                this.instance = $("#scheduler").dxScheduler(options).dxScheduler("instance");
            };
            this.clock = sinon.useFakeTimers();
        },
        afterEach: function() {
            this.clock.restore();
            themes.isMaterial = this.origIsMaterial;
        }
    });

    QUnit.test("_dropDownButtonIcon option should be passed to SchedulerHeader", function(assert) {
        this.createInstance({
            currentView: "week",
            showCurrentTimeIndicator: false
        });

        var header = this.instance.getHeader();

        assert.equal(header.option("_dropDownButtonIcon"), "chevrondown", "header has correct _dropDownButtonIcon");
    });

    QUnit.test("_appointmentGroupButtonOffset option should be passed to SchedulerAppointments", function(assert) {
        this.createInstance({
            currentView: "week",
            showCurrentTimeIndicator: false
        });

        var appointments = this.instance.getAppointmentsInstance();

        assert.equal(appointments.option("_appointmentGroupButtonOffset"), 20, "SchedulerAppointments has correct _appointmentGroupButtonOffset");
    });

})("View with configuration");
