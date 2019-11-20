var $ = require("jquery");

QUnit.testStart(function() {
    $("#qunit-fixture").html('<div id="scheduler"></div>');
});

require("common.css!");
require("generic_light.css!");


var dateLocalization = require("localization/date"),
    fx = require("animation/fx"),
    subscribes = require("ui/scheduler/ui.scheduler.subscribes");

require("ui/scheduler/ui.scheduler");

var DATE_TABLE_CELL_CLASS = "dx-scheduler-date-table-cell",
    APPOINTMENT_CLASS = "dx-scheduler-appointment";

function getDeltaTz(schedulerTz, date) {
    var defaultTz = date.getTimezoneOffset() * 60000;
    return schedulerTz * 3600000 + defaultTz;
}

QUnit.module("Integration: Appointments", {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = function(options) {
            this.instance = $("#scheduler").dxScheduler(options).dxScheduler("instance");
        };
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test("Appointment wich started in DST and ended in STD time should have correct start & end dates", function(assert) {
    var startDate = 1541311200000,
        endDate = 1541319000000;

    this.createInstance({
        currentDate: new Date(2018, 10, 4),
        views: ["week"],
        currentView: "week",
        dataSource: [{
            text: "DST",
            startDate: startDate,
            endDate: endDate
        }],
        timeZone: "America/Chicago"
    });

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        deltaTzStart = getDeltaTz(-5, startDate),
        deltaTzEnd = getDeltaTz(-6, endDate),
        startDateByTz = new Date(startDate.setHours(startDate.getHours() + deltaTzStart / 3600000)),
        endDateByTz = new Date(endDate.setHours(endDate.getHours() + deltaTzEnd / 3600000));

    assert.equal($appointment.find(".dx-scheduler-appointment-content div").eq(0).text(), "DST", "Text is correct on init");

    assert.equal($appointment.find(".dx-scheduler-appointment-content-date").eq(0).text(), dateLocalization.format(startDateByTz, "shorttime"), "Start Date is correct on init");
    assert.equal($appointment.find(".dx-scheduler-appointment-content-date").eq(2).text(), dateLocalization.format(endDateByTz, "shorttime"), "End Date is correct on init");
});

QUnit.test("Appointment wich started in STD and ended in DST time should have correct start & end dates", function(assert) {
    var startDate = new Date(1520748000000),
        endDate = new Date(1520751600000);

    this.createInstance({
        currentDate: new Date(2018, 2, 11),
        views: ["timelineDay"],
        maxAppointmentsPerCell: null,
        currentView: "timelineDay",
        dataSource: [{
            text: "DST",
            startDate: startDate,
            endDate: endDate
        }],
        timeZone: "America/New_York"
    });

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        deltaTzStart = getDeltaTz(-5, startDate),
        deltaTzEnd = getDeltaTz(-4, endDate),
        startDateByTz = new Date(startDate.setHours(startDate.getHours() + deltaTzStart / 3600000)),
        endDateByTz = new Date(endDate.setHours(endDate.getHours() + deltaTzEnd / 3600000));

    assert.equal($appointment.find(".dx-scheduler-appointment-content div").eq(0).text(), "DST", "Text is correct on init");

    assert.equal($appointment.find(".dx-scheduler-appointment-content-date").eq(0).text(), dateLocalization.format(startDateByTz, "shorttime"), "Start Date is correct on init");
    assert.equal($appointment.find(".dx-scheduler-appointment-content-date").eq(2).text(), dateLocalization.format(endDateByTz, "shorttime"), "End Date is correct on init");
});

QUnit.test("Second recurring appointment wich started in STD and ended in DST time should have correct start & end dates & position", function(assert) {
    var startDate = new Date(1520748000000),
        endDate = new Date(1520751600000);

    this.createInstance({
        currentDate: new Date(2018, 2, 12),
        views: ["timelineDay"],
        currentView: "timelineDay",
        maxAppointmentsPerCell: null,
        dataSource: [{
            text: "DST",
            startDate: startDate,
            endDate: endDate,
            recurrenceRule: "FREQ=DAILY"
        }],
        timeZone: "America/New_York"
    });

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        deltaTzStart = getDeltaTz(-5, startDate),
        deltaTzEnd = getDeltaTz(-5, endDate),
        startDateByTz = new Date(startDate.setHours(startDate.getHours() + deltaTzStart / 3600000)),
        endDateByTz = new Date(endDate.setHours(endDate.getHours() + deltaTzEnd / 3600000));

    assert.equal($appointment.find(".dx-scheduler-appointment-content div").eq(0).text(), "DST", "Text is correct on init");

    assert.equal($appointment.find(".dx-scheduler-appointment-content-date").eq(0).text(), dateLocalization.format(startDateByTz, "shorttime"), "Start Date is correct on init");
    assert.equal($appointment.find(".dx-scheduler-appointment-content-date").eq(2).text(), dateLocalization.format(endDateByTz, "shorttime"), "End Date is correct on init");

    assert.roughEqual($appointment.get(0).getBoundingClientRect().width, $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).get(0).getBoundingClientRect().width * 2, 2, "Appointment width is correct");
});

QUnit.test("Appointment which started in DST and ended in STD time should have right width, timeline view", function(assert) {
    var startDate = new Date(2018, 10, 4, 1),
        endDate = new Date(2018, 10, 4, 3),
        currentDate = new Date(2018, 10, 4);

    this.createInstance({
        views: ["timelineWeek"],
        currentView: "timelineWeek",
        cellDuration: 60,
        currentDate: currentDate,
        maxAppointmentsPerCell: null,
        dataSource: [{
            text: "DST",
            startDate: startDate,
            endDate: endDate
        }]
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).first(),
        cellWidth = this.instance.$element().find("." + DATE_TABLE_CELL_CLASS).first().outerWidth(),
        duration = (endDate - startDate) / 3600000,
        tzDiff = (startDate.getTimezoneOffset() - endDate.getTimezoneOffset()) / 60;

    assert.roughEqual($appointment.outerWidth(), cellWidth * (duration + tzDiff), 2.001, "Appt width is correct on the day of the time ajusting");
});

QUnit.test("Second recurring appointment should have right width if previous appt started in STD and ended in DST, timeline view", function(assert) {
    var startDate = new Date(1520758800000),
        endDate = new Date(1520762400000),
        currentDate = new Date(2018, 2, 12);

    this.createInstance({
        currentDate: currentDate,
        views: ["timelineDay"],
        currentView: "timelineDay",
        maxAppointmentsPerCell: null,
        dataSource: [{
            text: "DST",
            startDate: startDate,
            endDate: endDate,
            recurrenceRule: "FREQ=DAILY"
        }],
        cellDuration: 60,
        timeZone: "America/New_York"
    });
    this.instance.option("currentDate", this.instance.fire("convertDateByTimezone", currentDate, -5));

    var $secondRecAppointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).first(),
        cellWidth = this.instance.$element().find("." + DATE_TABLE_CELL_CLASS).first().outerWidth(),
        duration = (endDate - startDate) / 3600000;

    assert.roughEqual($secondRecAppointment.outerWidth(), cellWidth * duration, 2.001, "Appt width is correct after the day of the time ajusting");
});

QUnit.test("Recurrence exception should not be rendered if exception goes after adjusting AEST-> AEDT (T619455)", function(assert) {
    var tzOffsetStub = sinon.stub(subscribes, "getClientTimezoneOffset").returns(-39600000);
    try {
        this.createInstance({
            dataSource: [{
                text: "Recruiting students",
                startDate: new Date(2018, 2, 30, 10, 0),
                endDate: new Date(2018, 2, 30, 11, 0),
                recurrenceRule: "FREQ=DAILY",
                recurrenceException: "20180401T100000"
            }],
            views: ["month"],
            currentView: "month",
            currentDate: new Date(2018, 2, 30),
            timeZone: "Australia/Sydney",
            height: 600
        });

        var $appointments = $(this.instance.$element()).find("." + APPOINTMENT_CLASS);

        assert.equal($appointments.length, 8, "correct number of the events");

        this.instance.option("currentView", "day");
        this.instance.option("currentDate", new Date(2018, 3, 1));

        assert.notOk($(this.instance.$element()).find("." + APPOINTMENT_CLASS).length, "event is an exception");
    } finally {
        tzOffsetStub.restore();
    }
});

QUnit.test("Appointment should rendered correctly if end date appointment coincided translation oт STD", function(assert) {
    this.createInstance({
        dataSource: [{
            text: "November 4",
            startDate: new Date(2018, 10, 4, 18, 0),
            endDate: new Date(2018, 10, 5, 0, 0),
        }],
        views: ["month"],
        currentView: "month",
        currentDate: new Date(2018, 10, 1),
        firstDayOfWeek: 0,
        cellDuration: 60,
        height: 800
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).first(),
        cellWidth = this.instance.$element().find("." + DATE_TABLE_CELL_CLASS).first().outerWidth();

    assert.roughEqual($appointment.outerWidth(), cellWidth, 1.1, 'Appointment width is correct after translation oт STD');
});
