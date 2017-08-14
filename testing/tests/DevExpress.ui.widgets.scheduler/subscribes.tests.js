"use strict";

require("common.css!");
require("generic_light.css!");
require("ui/scheduler/ui.scheduler.subscribes");
require("ui/scheduler/ui.scheduler");

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    fx = require("animation/fx"),
    recurrenceUtils = require("ui/scheduler/utils.recurrence"),
    dateUtils = require("core/utils/date"),
    config = require("core/config");

function getDaylightSavingsOffset(date1, date2) {
    return date1.getTimezoneOffset() - date2.getTimezoneOffset();
}

QUnit.testStart(function() {
    $("#qunit-fixture").html('<div id="scheduler"></div>');
});

QUnit.module("Subscribes", {
    beforeEach: function() {
        this.createInstance = function(options) {
            this.instance = $("#scheduler").dxScheduler(options).dxScheduler("instance");
        };
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("'setCellDataCacheAlias' should call workSpace method with right arguments", function(assert) {
    this.createInstance({
        currentView: "week"
    });

    var setCacheAliasStub = sinon.stub(this.instance.getWorkSpace(), "setCellDataCacheAlias");
    try {
        this.instance.fire("setCellDataCacheAlias", {
            rowIndex: 1,
            cellIndex: 2,
            groupIndex: 3,
            left: 4,
            top: 5
        }, {
            left: 4,
            top: 5
        });

        assert.ok(setCacheAliasStub.calledOnce, "setCellDataCacheAlias workSpace method called once");
        assert.deepEqual(setCacheAliasStub.getCall(0).args[0], {
            rowIndex: 1,
            cellIndex: 2,
            groupIndex: 3,
            left: 4,
            top: 5
        }, "setCellDataCacheAlias workSpace method called with correct appointmentSettings");
        assert.deepEqual(setCacheAliasStub.getCall(0).args[1], {
            left: 4,
            top: 5
        }, "setCellDataCacheAlias workSpace method called with correct geometry");
    } finally {
        setCacheAliasStub.restore();
    }
});

QUnit.test("'correctAppointmentCoordinates' should correct appointment coordinates during drag, allDay = false ", function(assert) {
    this.createInstance({
        currentView: "week"
    });

    var coordinates = {
            left: 100,
            top: 400
        },
        updatedCoordinates;

    this.instance.fire("correctAppointmentCoordinates", {
        coordinates: coordinates,
        allDay: false,
        callback: function(result) {
            updatedCoordinates = result;
        }
    });

    var allDayPanelHeight = this.instance.element().find(".dx-scheduler-all-day-table-cell").eq(0).outerHeight(),
        headerPanelHeight = this.instance.element().find(".dx-scheduler-header-panel").outerHeight(true);

    assert.roughEqual(updatedCoordinates.top, coordinates.top + allDayPanelHeight + headerPanelHeight, 2, "new top is correct");
    assert.equal(updatedCoordinates.left, 0, "new left is correct");
});

QUnit.test("'correctAppointmentCoordinates' should correct appointment coordinates during drag, allDay = true ", function(assert) {
    this.createInstance({
        currentView: "week",
        height: 500
    });

    var coordinates = {
            left: 100,
            top: 400
        },
        updatedCoordinates;

    var headerPanelHeight = this.instance.element().find(".dx-scheduler-header-panel").outerHeight(true);

    this.instance.fire("correctAppointmentCoordinates", {
        coordinates: coordinates,
        allDay: true,
        callback: function(result) {
            updatedCoordinates = result;
        }
    });

    assert.roughEqual(updatedCoordinates.top, coordinates.top + headerPanelHeight, 2, "new top is correct");
    assert.equal(updatedCoordinates.left, 0, "new left is correct");
});

QUnit.test("'correctAppointmentCoordinates' should correct appointment coordinates during drag, RTL mode ", function(assert) {
    this.createInstance({
        currentView: "month",
        rtlEnabled: true,
        height: 500
    });

    var coordinates = {
            left: 572,
            top: 65
        },
        updatedCoordinates;

    this.instance.fire("correctAppointmentCoordinates", {
        coordinates: coordinates,
        callback: function(result) {
            updatedCoordinates = result;
        }
    });

    var headerPanelHeight = this.instance.element().find(".dx-scheduler-header-panel").outerHeight(true);

    assert.roughEqual(updatedCoordinates.top, coordinates.top + headerPanelHeight, 2, "new top is correct");
    assert.equal(updatedCoordinates.left, coordinates.left, "new left is correct");

});

QUnit.test("'getDraggableAppointmentArea' should return workSpace date table scrollable", function(assert) {
    this.createInstance();
    var draggableArea;

    this.instance.fire("getDraggableAppointmentArea", {
        callback: function(result) {
            draggableArea = result;
        }
    });

    assert.deepEqual(draggableArea.get(0), this.instance.element().find(".dx-scheduler-date-table-scrollable .dx-scrollable-container").get(0), "Draggable area is OK");
});

QUnit.test("'needCoordinates' should return workSpace date table scrollable", function(assert) {
    this.createInstance({
        currentView: "day",
        startDayHour: 2,
        endDayHour: 10,
        currentDate: 1425416400000
    });

    this.instance.fire("needCoordinates", {
        appointmentData: {
            "startDate": new Date(2015, 2, 3, 22),
            "endDate": new Date(2015, 2, 17, 10, 30)
        },
        startDate: new Date(2015, 2, 3, 22),
        callback: function(result) {
            var coordinate = result[0];
            assert.roughEqual(coordinate.top, 0, 1.001, "Top coordinate is OK");
        }
    });
});

QUnit.test("'needCoordinates' should return correct count of coordinates for allDay recurrence appointment", function(assert) {
    this.createInstance();
    this.instance.option({
        currentView: "week",
        startDayHour: 2,
        endDayHour: 10,
        currentDate: new Date(2015, 2, 2, 0),
        firstDayOfWeek: 1
    });

    this.instance.fire("needCoordinates", {
        appointmentData: {
            "startDate": new Date(2015, 2, 2, 0),
            "endDate": new Date(2015, 2, 3, 0),
            "recurrenceRule": "FREQ=DAILY"
        },
        startDate: new Date(2015, 2, 2, 0),
        callback: function(result) {
            assert.equal(result.length, 7, "count is OK");
        }
    });
});

QUnit.test("'needCoordinates' should return correct count of coordinates for allDay recurrence appointment, allDay = true", function(assert) {
    this.createInstance();
    this.instance.option({
        currentView: "week",
        startDayHour: 2,
        endDayHour: 10,
        currentDate: new Date(2015, 2, 2, 0),
        firstDayOfWeek: 1
    });

    this.instance.fire("needCoordinates", {
        appointmentData: {
            "startDate": new Date(2015, 2, 2, 0),
            "endDate": new Date(2015, 2, 3, 0),
            "recurrenceRule": "FREQ=DAILY",
            allDay: true
        },
        startDate: new Date(2015, 2, 2, 0),
        callback: function(result) {
            assert.equal(result.length, 7, "count is OK");
        }
    });
});

QUnit.test("'needCoordinates' should not change dateRange", function(assert) {
    this.createInstance({
        currentView: "week",
        startDayHour: 2,
        endDayHour: 10,
        currentDate: new Date(2015, 2, 2, 0),
        firstDayOfWeek: 1
    });

    var instance = this.instance,
        dateRange = instance._workSpace.getDateRange();

    instance.fire("needCoordinates", {
        appointmentData: {
            "startDate": new Date(2015, 2, 2, 0),
            "endDate": new Date(2015, 2, 3, 0),
            "recurrenceRule": "FREQ=DAILY",
            allDay: true
        },
        startDate: new Date(2015, 2, 2, 0),
        callback: function(result) {
            assert.deepEqual(dateRange, instance._workSpace.getDateRange(), "Date range wasn't changed");
        }
    });
});

QUnit.test("'needCoordinates' should calculate correct dates fo recurring appts (T408509)", function(assert) {
    this.createInstance({
        currentView: "week",
        startDayHour: 2,
        endDayHour: 10,
        currentDate: new Date(2015, 2, 2, 0),
        firstDayOfWeek: 1
    });
    var getDatesByRecurrenceStub = sinon.stub(recurrenceUtils, "getDatesByRecurrence").returns([]);

    try {
        var instance = this.instance;


        instance.fire("needCoordinates", {
            appointmentData: {
                "startDate": new Date(2015, 2, 2, 0),
                "endDate": new Date(2015, 2, 3, 0),
                "recurrenceRule": "FREQ=DAILY",
                allDay: true
            },
            startDate: new Date(2015, 2, 2, 0),
            originalStartDate: new Date(2015, 2, 2, 1),
            callback: noop
        });

        var startDate = getDatesByRecurrenceStub.getCall(0).args[0].start;

        assert.equal(startDate.getTime(), new Date(2015, 2, 2, 1).getTime(), "Original start date was used for dates calculation");

    } finally {
        getDatesByRecurrenceStub.restore();
    }
});

QUnit.test("Long appointment in Timeline view should have right left coordinate", function(assert) {
    this.createInstance({
        currentView: "timelineDay",
        views: ["timelineDay"],
        currentDate: new Date(2015, 2, 3)
    });

    var $expectedCell = this.instance.element().find(".dx-scheduler-date-table-cell").eq(1),
        expectedLeftCoordinate = $expectedCell.position().left;

    this.instance.fire("needCoordinates", {
        appointmentData: {
            "startDate": new Date(2015, 2, 3, 0, 30),
            "endDate": new Date(2015, 2, 5, 15, 30)
        },
        startDate: new Date(2015, 2, 3, 0, 30),
        callback: function(result) {
            var coordinate = result[0];
            assert.equal(coordinate.left, expectedLeftCoordinate, "left coordinate is OK");
        }
    });
});

QUnit.test("'needCoordinates' should work correct with custom data fields", function(assert) {
    this.createInstance({
        currentView: "week",
        currentDate: new Date(2015, 2, 2, 0),
        firstDayOfWeek: 1,
        startDateExpr: "Start"
    });

    this.instance.fire("needCoordinates", {
        appointmentData: {
            startDate: new Date(2015, 2, 2, 0)
        },
        startDate: new Date(2015, 2, 2, 0),
        callback: function(result) {
            assert.equal(result.length, 1, "Coordinates are OK");
        }
    });
});

QUnit.test("'updateAppointmentStartDate' should work correct with custom data fields", function(assert) {
    this.createInstance({
        startDateExpr: "Start"
    });

    this.instance.fire("updateAppointmentStartDate", {
        startDate: new Date(2015, 2, 2, 0),
        callback: function(result) {
            assert.ok(result, "There is some result");
        }
    });
});

QUnit.test("'formatDates' should work correct with custom data fields", function(assert) {
    this.createInstance({
        startDateExpr: "Start",
        endDateExpr: "End"
    });

    this.instance.fire("formatDates", {
        startDate: new Date(2015, 2, 2, 0),
        endDate: new Date(2015, 2, 2, 30),
        formatType: "DATETIME",
        callback: function(result) {
            assert.ok(result, "There is some result");
        }
    });
});

QUnit.test("'appointmentTakesAllDay' should work correct with custom data fields", function(assert) {
    this.createInstance({
        startDateExpr: "Start",
        endDateExpr: "End",
    });

    this.instance.fire("appointmentTakesAllDay", {
        appointment: {
            Start: new Date(2015, 2, 2, 0),
            End: new Date(2015, 2, 3, 0)
        },
        callback: function(result) {
            assert.ok(result, "There is some result");
        }
    });
});

QUnit.test("'showAddAppointmentPopup' should update appointment data if there is some custom data fields", function(assert) {
    this.createInstance();
    var stub = sinon.stub(this.instance, "showAppointmentPopup");

    this.instance.option({
        startDateExpr: "Start",
        endDateExpr: "End",
        allDayExpr: "AllDay"
    });

    this.instance.fire("showAddAppointmentPopup", {
        startDate: new Date(2015, 1, 1),
        endDate: new Date(2015, 1, 1, 1),
        allDay: true
    });

    var appointmentData = stub.getCall(0).args[0];

    assert.deepEqual(appointmentData, {
        Start: new Date(2015, 1, 1),
        End: new Date(2015, 1, 1, 1),
        AllDay: true
    }, "Appointment data is OK");
});

QUnit.test("'appointmentFocused' should fire restoreScrollTop", function(assert) {
    this.createInstance();

    var workspace = this.instance.element().find(".dx-scheduler-work-space").dxSchedulerWorkSpaceDay("instance"),
        restoreScrollTopStub = sinon.stub(workspace, "restoreScrollTop");

    this.instance.fire("appointmentFocused");

    assert.ok(restoreScrollTopStub.calledOnce, "There is some result");
});

QUnit.test("check the 'getField' method with date field", function(assert) {
    var defaultForceIsoDateParsing = config().forceIsoDateParsing;
    config().forceIsoDateParsing = true;
    try {
        this.createInstance();
        var startDate = this.instance.fire("getField", "startDate", { startDate: "2017-02-08" });
        assert.deepEqual(startDate, new Date(2017, 1, 8), "the 'getField' method works fine");

        var endDate = this.instance.fire("getField", "endDate", { endDate: "2017-02-09" });
        assert.deepEqual(endDate, new Date(2017, 1, 9), "the 'getField' method works fine");
    } finally {
        config().forceIsoDateParsing = defaultForceIsoDateParsing;
    }
});

QUnit.test("check the 'setField' method with date field and auto detect of serialization format", function(assert) {
    var defaultForceIsoDateParsing = config().forceIsoDateParsing;
    config().forceIsoDateParsing = true;
    try {
        this.createInstance();
        var obj = { startDate: "2017-02-07", endDate: "2017-02-08" };

        this.instance.fire("getField", "startDate", obj);

        this.instance.fire("setField", "startDate", obj, new Date(2017, 1, 8));
        assert.equal(obj.startDate, "2017-02-08", "the 'setField' method works fine");

        this.instance.fire("setField", "endDate", obj, new Date(2017, 1, 10));
        assert.equal(obj.endDate, "2017-02-10", "the 'setField' method works fine");
    } finally {
        config().forceIsoDateParsing = defaultForceIsoDateParsing;
    }
});

QUnit.test("check the 'setField' method with date field and dateSerializationFormat", function(assert) {
    this.createInstance({
        dateSerializationFormat: "yyyy-MM-ddTHH:mm:ssZ"
    });
    var obj = { startDate: "2017-02-07", endDate: "2017-02-08" };

    this.instance.fire("setField", "startDate", obj, new Date(Date.UTC(2017, 1, 8, 1)));
    assert.equal(obj.startDate, "2017-02-08T01:00:00Z", "the 'setField' method works fine");

    this.instance.fire("setField", "endDate", obj, new Date(Date.UTC(2017, 1, 10, 1)));
    assert.equal(obj.endDate, "2017-02-10T01:00:00Z", "the 'setField' method works fine");
});

QUnit.test("check the 'getField' method", function(assert) {
    this.createInstance();
    var text = this.instance.fire("getField", "text", { text: 1 });
    assert.equal(text, 1, "the 'getField' method works fine");
});

QUnit.test("check the 'getField - recurrenceRule' method, if recurrenceRuleExpr = null", function(assert) {
    this.createInstance({
        recurrenceRuleExpr: null
    });

    var recurrenceRule = this.instance.fire("getField", "recurrenceRule", { recurrenceRule: "FREQ=daily" });
    assert.strictEqual(recurrenceRule, undefined, "the 'getField' method works fine");
});

QUnit.test("check the 'getField - recurrenceRule' method, if recurrenceRuleExpr was set as null after option changed", function(assert) {
    this.createInstance();

    this.instance.option({
        recurrenceRuleExpr: null
    });

    var recurrenceRule = this.instance.fire("getField", "recurrenceRule", { recurrenceRule: "FREQ=daily" });
    assert.strictEqual(recurrenceRule, undefined, "the 'getField' method works fine");
});

QUnit.test("check the 'getField - recurrenceRule' method, if recurrenceRuleExpr was set as value after option changed", function(assert) {
    this.createInstance({
        recurrenceRuleExpr: null
    });

    this.instance.option({
        recurrenceRuleExpr: "recurrenceRule"
    });

    var recurrenceRule = this.instance.fire("getField", "recurrenceRule", { recurrenceRule: "FREQ=daily" });
    assert.equal(recurrenceRule, "FREQ=daily", "the 'getField' method works fine");
});

QUnit.test("check the 'setField' method", function(assert) {
    this.createInstance();
    var obj = { text: 1 };

    this.instance.fire("setField", "text", obj, 2);
    assert.equal(obj.text, 2, "the 'setField' method works fine");
});

QUnit.test("check the 'setField' method with multi-dotted string", function(assert) {
    this.createInstance({ textExpr: "a.b.text" });
    var obj = this.instance.fire("setField", "text", {}, 2),
        obj1 = this.instance.fire("setField", "text", { c: "just field" }, 2);

    assert.deepEqual(obj, { a: { b: { text: 2 } } }, "the 'setField' method works fine");
    assert.deepEqual(obj1, { c: "just field", a: { b: { text: 2 } } }, "the 'setField' method works fine");
});

QUnit.test("check the 'setField-recurrenceRule' method, if recurrenceRuleExpr = null", function(assert) {
    this.createInstance({
        recurrenceRuleExpr: null
    });

    var obj = { recurrenceRule: "FREQ=DAILY" };

    this.instance.fire("setField", "recurrenceRule", obj, "FREQ=WEEKLY");
    assert.equal(obj.recurrenceRule, "FREQ=DAILY", "the 'setField' method works fine");
});

QUnit.test("check the 'setField-recurrenceRule' method, if recurrenceRuleExpr was set as null after option changed", function(assert) {
    this.createInstance();

    this.instance.option({
        recurrenceRuleExpr: null
    });

    var obj = { recurrenceRule: "FREQ=DAILY" };

    this.instance.fire("setField", "recurrenceRule", obj, "FREQ=WEEKLY");
    assert.equal(obj.recurrenceRule, "FREQ=DAILY", "the 'setField' method works fine");
});

QUnit.test("check the 'setField-recurrenceRule' method, if recurrenceRuleExpr was set as value after option changed", function(assert) {
    this.createInstance({
        recurrenceRuleExpr: null
    });

    this.instance.option({
        recurrenceRuleExpr: "recurrenceRule"
    });

    var obj = { recurrenceRule: "FREQ=DAILY" };

    this.instance.fire("setField", "recurrenceRule", obj, "FREQ=WEEKLY");
    assert.equal(obj.recurrenceRule, "FREQ=WEEKLY", "the 'setField' method works fine");
});

QUnit.test("UpdateAppointmentStartDate should return corrected startDate", function(assert) {
    this.createInstance();
    this.instance.option({
        currentView: "week",
        currentDate: new Date(2016, 1, 1),
        startDayHour: 5
    });

    var appointment = {
        startDate: new Date(2016, 1, 2, 2),
        endDate: new Date(2016, 1, 2, 7)
    };

    this.instance.fire("updateAppointmentStartDate", {
        startDate: appointment.startDate,
        callback: function(result) {
            assert.deepEqual(result, new Date(2016, 1, 2, 5), "Updated date is correct");
        }
    });
});

QUnit.test("appointmentTakesSeveralDays should return true, if startDate and endDate is different days", function(assert) {
    this.createInstance();
    this.instance.option({
        currentView: "week",
        currentDate: new Date(2016, 1, 1),
    });

    var appointments = [
        {
            startDate: new Date(2016, 1, 2, 2),
            endDate: new Date(2016, 1, 3, 7)
        },
        {
            startDate: new Date(2016, 1, 2, 2),
            endDate: new Date(2016, 1, 2, 7)
        },
    ];

    assert.ok(this.instance.fire("appointmentTakesSeveralDays", appointments[0]), "appointmentTakesSeveralDays works correctly");
    assert.notOk(this.instance.fire("appointmentTakesSeveralDays", appointments[1]), "appointmentTakesSeveralDays works correctly");
});

QUnit.test("UpdateAppointmentStartDate should return corrected startDate for long appointments", function(assert) {
    this.createInstance();

    this.instance.option({
        currentView: "week",
        currentDate: new Date(2016, 1, 1),
        startDayHour: 5
    });

    var appointment = {
        startDate: new Date(2016, 1, 2, 2),
        endDate: new Date(2016, 1, 4, 7)
    };

    this.instance.fire("updateAppointmentStartDate", {
        startDate: appointment.startDate,
        appointment: appointment,
        callback: function(result) {
            assert.deepEqual(result, new Date(2016, 1, 2, 5), "Date is correct");
        }
    });
});

QUnit.test("UpdateAppointmentEndDate should return corrected endDate", function(assert) {
    this.createInstance();
    this.instance.option({
        currentView: "timelineWeek",
        currentDate: 1425416400000,
        startDayHour: 1,
        endDayHour: 10
    });

    var appointment = {
        startDate: new Date(2015, 2, 3, 9, 30),
        endDate: new Date(2015, 2, 3, 10, 30)
    };

    this.instance.fire("updateAppointmentEndDate", {
        appointment: appointment,
        endDate: appointment.endDate,
        callback: function(result) {
            assert.deepEqual(result, new Date(2015, 2, 3, 10), "Updated date is correct");
        }
    });
});

QUnit.test("UpdateAppointmentEndDate should return corrected endDate for long appointment", function(assert) {
    this.createInstance();
    this.instance.option({
        currentView: "timelineWeek",
        currentDate: 1425416400000,
        startDayHour: 1,
        endDayHour: 10
    });

    var appointment = {
        startDate: new Date(2015, 2, 2, 9, 30),
        endDate: new Date(2015, 2, 3, 10, 30)
    };

    this.instance.fire("updateAppointmentEndDate", {
        appointment: appointment,
        endDate: appointment.endDate,
        callback: function(result) {
            assert.deepEqual(result, new Date(2015, 2, 3, 10), "Updated date is correct");
        }
    });
});

QUnit.test("UpdateAppointmentEndDate should return corrected endDate by certain endDayHour", function(assert) {
    this.createInstance({
        currentView: "timelineWeek",
        views: [{
            type: "timelineWeek",
            endDayHour: 18
        }],
        startDayHour: 9,
        endDayHour: 23,
        currentDate: new Date(2015, 2, 3)
    });

    var appointment = {
        startDate: new Date(2015, 2, 3, 9, 30),
        endDate: new Date(2015, 2, 3, 20, 30)
    };

    this.instance.fire("updateAppointmentEndDate", {
        appointment: appointment,
        endDate: appointment.endDate,
        callback: function(result) {
            assert.deepEqual(result, new Date(2015, 2, 3, 18), "Updated date is correct");
        }
    });
});

QUnit.test("'convertDateByTimezone' should return date according to the custom timeZone", function(assert) {
    var timezoneValue = 5;
    this.createInstance();
    this.instance.option({
        timeZone: timezoneValue
    });

    var date = new Date(2015, 6, 3, 3),
        timezoneDifference = date.getTimezoneOffset() * 60000 + timezoneValue * 3600000;

    timezoneDifference -= getDaylightSavingsOffset(date, new Date()) * 60000;

    var convertedDate = this.instance.fire("convertDateByTimezone", date);

    assert.deepEqual(convertedDate, new Date(date.getTime() + timezoneDifference), "'convertDateByTimezone' works fine");
});

QUnit.test("'convertDateByTimezone' should return date according to the custom timeZone as string", function(assert) {

    var timezone = { id: "Asia/Ashkhabad", value: 5 };
    this.createInstance();

    this.instance.option({
        timeZone: timezone.id
    });

    var date = new Date(2015, 6, 3, 3),
        timezoneDifference = date.getTimezoneOffset() * 60000 + timezone.value * 3600000;

    timezoneDifference -= getDaylightSavingsOffset(date, new Date()) * 60000;

    var convertedDate = this.instance.fire("convertDateByTimezone", date);

    assert.deepEqual(convertedDate, new Date(date.getTime() + timezoneDifference), "'convertDateByTimezone' works fine");
});

QUnit.test("'getAppointmentDurationInMs' should return visible appointment duration", function(assert) {
    this.createInstance();

    this.instance.fire("getAppointmentDurationInMs", {
        startDate: new Date(2015, 2, 2, 8),
        endDate: new Date(2015, 2, 2, 20),
        callback: function(result) {
            assert.equal(result / dateUtils.dateToMilliseconds("hour"), 12, "'getAppointmentDurationInMs' works fine");
        }
    });
});

QUnit.test("'getAppointmentDurationInMs' should return visible appointment duration considering startDayHour and endDayHour", function(assert) {
    this.createInstance();

    this.instance.option({
        startDayHour: 8,
        endDayHour: 20
    });

    this.instance.fire("getAppointmentDurationInMs", {
        startDate: new Date(2015, 2, 2, 8),
        endDate: new Date(2015, 2, 4, 20),
        callback: function(result) {
            assert.equal(result / dateUtils.dateToMilliseconds("hour"), 12 * 3, "'getAppointmentDurationInMs' works fine");
        }
    });
});

QUnit.test("'getAppointmentDurationInMs' should return visible appointment duration considering startDayHour and endDayHour for stricly allDay appointment without allDay field", function(assert) {
    this.createInstance();

    this.instance.option({
        startDayHour: 8,
        endDayHour: 20
    });

    this.instance.fire("getAppointmentDurationInMs", {
        startDate: new Date(2015, 2, 2, 8),
        endDate: new Date(2015, 2, 3, 0),
        callback: function(result) {
            assert.equal(result / dateUtils.dateToMilliseconds("hour"), 12, "'getAppointmentDurationInMs' works fine");
        }
    });
});

QUnit.test("'getAppointmentDurationInMs' should return visible appointment duration considering hours of startDate and endDate", function(assert) {
    this.createInstance();

    this.instance.option({
        startDayHour: 1,
        endDayHour: 22
    });

    this.instance.fire("getAppointmentDurationInMs", {
        startDate: new Date(2015, 4, 25, 21),
        endDate: new Date(2015, 4, 26, 3),
        callback: function(result) {
            assert.equal(result / dateUtils.dateToMilliseconds("hour"), 3, "'getAppointmentDurationInMs' works fine");
        }
    });
});

QUnit.test("'getAppointmentDurationInMs' should return visible long appointment duration considering hours of startDate and endDate", function(assert) {
    this.createInstance();

    this.instance.option({
        startDayHour: 8,
        endDayHour: 20
    });

    this.instance.fire("getAppointmentDurationInMs", {
        startDate: new Date(2015, 2, 2, 10),
        endDate: new Date(2015, 2, 4, 17),
        callback: function(result) {
            assert.equal(result / dateUtils.dateToMilliseconds("hour"), 31, "'getAppointmentDurationInMs' works fine");
        }
    });
});

QUnit.test("'getAppointmentDurationInMs' should return visible appointment duration considering hours of ultraboundary startDate and endDate", function(assert) {
    this.createInstance();

    this.instance.option({
        startDayHour: 8,
        endDayHour: 20
    });

    this.instance.fire("getAppointmentDurationInMs", {
        startDate: new Date(2015, 2, 2, 7),
        endDate: new Date(2015, 2, 4, 21),
        callback: function(result) {
            assert.equal(result / dateUtils.dateToMilliseconds("hour"), 12 * 3, "'getAppointmentDurationInMs' works fine");
        }
    });
});

QUnit.test("'getAppointmentDurationInMs' should return visible allDay appointment duration", function(assert) {
    this.createInstance();

    this.instance.option({
        startDayHour: 8,
        endDayHour: 20
    });

    this.instance.fire("getAppointmentDurationInMs", {
        startDate: new Date(2015, 2, 2, 7),
        endDate: new Date(2015, 2, 4, 21),
        allDay: true,
        callback: function(result) {
            assert.equal(result / dateUtils.dateToMilliseconds("hour"), 12 * 3, "'getAppointmentDurationInMs' works fine");
        }
    });
});

QUnit.test("'getAppointmentColor' by certain group", function(assert) {
    var appointmentColor;

    this.createInstance({
        currentView: "workWeek",
        views: ["week", {
            type: "workWeek",
            groups: ["typeId"]
        }],
        groups: ["priorityId"],
        resources: [{
            field: "typeId",
            dataSource: [{ id: 1, color: "red" }]
        },
        {
            field: "priorityId",
            dataSource: [{ id: 1, color: "black" }]
        }
        ]
    });

    this.instance.fire("getAppointmentColor", {
        itemData: {
            typeId: 1,
            priorityId: 1
        },
        groupIndex: 0,
        callback: function(result) {
            result.done(function(color) {
                appointmentColor = color;
            });
        }
    });

    assert.strictEqual(appointmentColor, "red", "appointment color");
});

QUnit.test("'getAppointmentColor' with fieldExpr for complex resource", function(assert) {
    var appointmentColor;

    this.createInstance({
        currentView: "workWeek",
        views: ["week", {
            type: "workWeek",
            groups: ["typeId"]
        }],
        groups: ["TheatreId"],
        resources: [{
            fieldExpr: "Movie.ID",
            useColorAsDefault: true,
            allowMultiple: false,
            dataSource: [{
                "ID": 1,
                "Color": "blue"
            }, {
                "ID": 3,
                "Color": "red"
            }],
            valueExpr: "ID",
            colorExpr: "Color"
        }, {
            fieldExpr: "TheatreId",
            dataSource: [{
                id: 1
            }, {
                id: 2
            }]
        }]
    });

    this.instance.fire("getAppointmentColor", {
        itemData: {
            "Price": 10,
            "startDate": new Date(2015, 4, 24, 9, 10, 0, 0),
            "endDate": new Date(2015, 4, 24, 11, 1, 0, 0),
            "Movie": {
                "ID": 3
            },
            "TheatreId": 1
        },
        groupIndex: 0,
        callback: function(result) {
            result.done(function(color) {
                appointmentColor = color;
            });
        }
    });

    assert.strictEqual(appointmentColor, "red", "appointment color is OK");
});

QUnit.module("Agenda", {
    beforeEach: function() {
        this.createInstance = function(options) {
            this.instance = $("#scheduler").dxScheduler(options).dxScheduler("instance");
        };
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("Agenda row count calculation", function(assert) {
    this.createInstance({
        views: ["agenda"],
        currentView: "agenda"
    });
    var instance = this.instance,
        expectedRows = [0, 1, 17, 19, 21, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52];

    instance._reloadDataSource = function() {
        this._dataSourceLoadedCallback.fireWith(this, [[
            { startDate: new Date(2016, 1, 2), endDate: new Date(2016, 1, 2, 0, 30) },
            { startDate: new Date(2016, 1, 20), endDate: new Date(2016, 1, 20, 0, 30) },
            { startDate: new Date(2016, 1, 18), endDate: new Date(2016, 1, 18, 0, 30) },
            { startDate: new Date(2016, 1, 18), endDate: new Date(2016, 1, 18, 0, 30) },
            { startDate: new Date(2016, 1, 22), endDate: new Date(2016, 1, 22, 0, 30) },
            { startDate: new Date(2016, 2, 2), endDate: new Date(2016, 2, 22, 0, 30) },

            { startDate: new Date(2016, 0, 30), endDate: new Date(2016, 1, 1, 5, 30) },

            { startDate: new Date(2016, 2, 23), endDate: new Date(2016, 2, 24, 5, 30) }
        ]]);
    };

    instance.fire("getAgendaRows", {
        agendaDuration: 65,
        currentDate: new Date(2016, 1, 1)
    }).done(function(result) {

        assert.equal(result.length, 1, "Rows are OK");

        $.each(result[0], function(index, item) {
            if($.inArray(index, expectedRows) > -1) {
                if(index === 17) {
                    assert.equal(item, 2, "Row is OK");
                } else {
                    assert.equal(item, 1, "Row is OK");
                }
            } else {
                assert.equal(item, 0, "Row is OK");
            }
        });

        assert.notOk(instance._dataSourceLoadedCallback.has(), "Callback was removed from list");
    });

    instance._reloadDataSource();
});

QUnit.test("Agenda row count calculation with recurrence appointments", function(assert) {
    this.createInstance({
        views: ["agenda"],
        currentView: "agenda"
    });
    var instance = this.instance,
        endViewDateStub = sinon.stub(instance, "getEndViewDate").returns(new Date(2016, 1, 5, 23, 59)),
        startViewDateStub = sinon.stub(instance, "getStartViewDate").returns(new Date(2016, 1, 1));

    try {
        instance._reloadDataSource = function() {
            this._dataSourceLoadedCallback.fireWith(this, [[
                { startDate: new Date(2016, 1, 2), endDate: new Date(2016, 1, 2, 0, 30) },
                { startDate: new Date(2016, 1, 3), endDate: new Date(2016, 1, 3, 0, 30), recurrenceRule: "FREQ=DAILY" },
                { startDate: new Date(2016, 0, 31), endDate: new Date(2016, 0, 31, 0, 30), recurrenceRule: "FREQ=DAILY" }
            ]]);
        };

        instance.fire("getAgendaRows", {
            agendaDuration: 5,
            currentDate: new Date(2016, 1, 1)
        }).done(function(rows) {
            assert.deepEqual(rows, [[1, 2, 2, 2, 2]], "Rows are OK");
        });

        instance._reloadDataSource();
    } finally {
        endViewDateStub.restore();
        startViewDateStub.restore();
    }
});

QUnit.test("Agenda row count calculation with long appointments", function(assert) {
    this.createInstance({
        views: ["agenda"],
        currentView: "agenda"
    });
    var instance = this.instance,
        endViewDateStub = sinon.stub(instance, "getEndViewDate").returns(new Date(2016, 1, 5, 23, 59)),
        startViewDateStub = sinon.stub(instance, "getStartViewDate").returns(new Date(2016, 1, 1));

    try {
        instance._reloadDataSource = function() {
            this._dataSourceLoadedCallback.fireWith(this, [[
                { startDate: new Date(2016, 1, 1, 1), endDate: new Date(2016, 1, 4, 10, 30) }
            ]]);
        };

        instance.fire("getAgendaRows", {
            agendaDuration: 5,
            currentDate: new Date(2016, 1, 1)
        }).done(function(rows) {
            assert.deepEqual(rows, [[1, 1, 1, 1, 0]], "Rows are OK");
        });

        instance._reloadDataSource();
    } finally {
        endViewDateStub.restore();
        startViewDateStub.restore();
    }
});

QUnit.test("Agenda row count calculation with long recurrence appointments", function(assert) {
    this.createInstance({
        startDateExpr: "Start",
        endDateExpr: "End",
        recurrenceRuleExpr: "RecurrenceRule",
        views: ["agenda"],
        currentView: "agenda"
    });
    var instance = this.instance,
        endViewDateStub = sinon.stub(instance, "getEndViewDate").returns(new Date(2016, 2, 1, 23, 59)),
        startViewDateStub = sinon.stub(instance, "getStartViewDate").returns(new Date(2016, 1, 24));

    try {
        instance._reloadDataSource = function() {
            this._dataSourceLoadedCallback.fireWith(this, [[
                {
                    Start: new Date(2016, 1, 22, 1).toString(),
                    End: new Date(2016, 1, 23, 1, 30).toString(),
                    RecurrenceRule: "FREQ=DAILY;INTERVAL=3"
                }
            ]]);
        };

        instance.fire("getAgendaRows", {
            agendaDuration: 7,
            currentDate: new Date(2016, 1, 24).toString()
        }).done(function(rows) {
            assert.deepEqual(rows, [[0, 1, 1, 0, 1, 1, 0]], "Rows are OK");
        });

        instance._reloadDataSource();
    } finally {
        endViewDateStub.restore();
        startViewDateStub.restore();
    }
});

QUnit.test("Agenda row count calculation with groups", function(assert) {
    this.createInstance({
        groups: ["ownerId"],
        resources: [{
            field: "ownerId",
            dataSource: [
                { id: 1 },
                { id: 2 },
                { id: 3 }
            ],
            allowMultiple: true
        }],
        views: ["agenda"],
        currentView: "agenda"
    });
    var instance = this.instance;

    instance._reloadDataSource = function() {
        this._dataSourceLoadedCallback.fireWith(this, [[
            { startDate: new Date(2016, 1, 2), endDate: new Date(2016, 1, 2, 1), ownerId: 1 },
            { startDate: new Date(2016, 1, 3), endDate: new Date(2016, 1, 3, 1), ownerId: 2 },
            { startDate: new Date(2016, 1, 3), endDate: new Date(2016, 1, 3, 1), ownerId: 1 },
            { startDate: new Date(2016, 1, 3, 2), endDate: new Date(2016, 1, 3, 3), ownerId: 1 },
            { startDate: new Date(2016, 1, 5), endDate: new Date(2016, 1, 5, 1), ownerId: [1, 2] },
            { startDate: new Date(2016, 1, 4), endDate: new Date(2016, 1, 4, 1), ownerId: 2 }
        ]]);
    };

    instance.fire("getAgendaRows", {
        agendaDuration: 7,
        currentDate: new Date(2016, 1, 1)
    }).done(function(result) {
        assert.equal(result.length, 3, "Rows are OK");
        assert.deepEqual(result[0], [0, 1, 2, 0, 1, 0, 0], "Row is OK");
        assert.deepEqual(result[1], [0, 0, 1, 1, 1, 0, 0], "Row is OK");
        assert.strictEqual(result[2].length, 0, "Row is OK");
    });

    instance._reloadDataSource();
});

QUnit.test("Agenda should work when current view is changed", function(assert) {
    this.createInstance({
        views: ["agenda", "week"],
        currentView: "week",
        currentDate: new Date(2016, 2, 1),
        dataSource: [{ startDate: new Date(2016, 2, 1, 1), endDate: new Date(2016, 2, 1, 2) }]
    });

    this.instance.option("currentView", "agenda");

    assert.ok(true, "Agenda works");
});

QUnit.test("'getHeaderHeight' should return correct value", function(assert) {
    this.createInstance({
        views: ["day"],
        currentView: "day",
        dataSource: [{ startDate: new Date(2016, 2, 1, 1), endDate: new Date(2016, 2, 1, 2) }]
    });

    var headerHeight = this.instance.fire("getHeaderHeight");

    assert.equal(headerHeight, 56, "Header height is OK");
});

QUnit.test("'getMaxAppointmentsPerCell' should return correct value in accordance with view configuration", function(assert) {
    this.createInstance({
        views: [{
            name: "DAY",
            type: "day",
            maxAppointmentsPerCell: 5
        }, {
            name: "WEEK",
            type: "week",
            maxAppointmentsPerCell: "none"
        }],
        currentView: "DAY",
        dataSource: [{ startDate: new Date(2016, 2, 1, 1), endDate: new Date(2016, 2, 1, 2) }]
    });

    var countPerCell = this.instance.fire("getMaxAppointmentsPerCell");

    assert.equal(countPerCell, 5, "overlappingMode is OK");

    this.instance.option("currentView", "WEEK");

    countPerCell = this.instance.fire("getMaxAppointmentsPerCell");

    assert.equal(countPerCell, "none", "overlappingMode is OK");
});
