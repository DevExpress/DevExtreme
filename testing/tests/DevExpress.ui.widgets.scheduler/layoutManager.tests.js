import "common.css!";
import "generic_light.css!";
import "ui/scheduler/ui.scheduler";

import $ from "jquery";
import keyboardMock from "../../helpers/keyboardMock.js";
import pointerMock from "../../helpers/pointerMock.js";
import translator from "animation/translator";
import { DataSource } from "data/data_source/data_source";
import { SchedulerTestWrapper } from './helpers.js';

import SchedulerLayoutManager from "ui/scheduler/ui.scheduler.appointments.layout_manager";
import BaseAppointmentsStrategy from "ui/scheduler/rendering_strategies/ui.scheduler.appointments.strategy.base";
import VerticalAppointmentStrategy from "ui/scheduler/rendering_strategies/ui.scheduler.appointments.strategy.vertical";
import HorizontalAppointmentsStrategy from "ui/scheduler/rendering_strategies/ui.scheduler.appointments.strategy.horizontal";
import HorizontalMonthLineAppointmentsStrategy from "ui/scheduler/rendering_strategies/ui.scheduler.appointments.strategy.horizontal_month_line";
import Color from "color";
import dataUtils from "core/element_data";
import devices from "core/devices";
import CustomStore from "data/custom_store";

const APPOINTMENT_DEFAULT_OFFSET = 25,
    APPOINTMENT_MOBILE_OFFSET = 50;

const APPOINTMENT_CLASS_NAME = ".dx-scheduler-appointment";

const getOffset = () => {
    if(devices.current().deviceType !== "desktop") {
        return APPOINTMENT_MOBILE_OFFSET;
    } else {
        return APPOINTMENT_DEFAULT_OFFSET;
    }
};

const checkAppointmentUpdatedCallbackArgs = (assert, actual, expected) => {
    assert.deepEqual(actual.old, expected.old, "Old data is OK");
    assert.deepEqual(actual.updated, expected.updated, "New data is OK");
    assert.deepEqual(actual.$appointment.get(0), expected.$appointment.get(0), "Appointment element is OK");
};

QUnit.testStart(function() {
    $("#qunit-fixture").html('<div id="scheduler"></div>');
});

const moduleOptions = {
    beforeEach: function() {
        this.createInstance = options => {
            this.instance = $("#scheduler").dxScheduler($.extend(options, { editing: true, maxAppointmentsPerCell: null })).dxScheduler("instance");
        };
    },
    afterEach: function() {
    }
};

const renderLayoutModuleOptions = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.createInstance = (view, dataSource, options) => {
            this.instance = $("#scheduler").dxScheduler($.extend(options, {
                views: ["week", "month", "agenda"],
                currentView: view,
                dataSource: dataSource,
                currentDate: new Date(2017, 4, 25),
                startDayHour: 9,
                height: 600,
                width: 1300,
                editing: true,
            })).dxScheduler("instance");
        };

        this.markAppointments = function() {
            $(APPOINTMENT_CLASS_NAME).data("mark", true);
        };

        this.getUnmarkedAppointments = function() {
            return $(APPOINTMENT_CLASS_NAME).filter(function() {
                return !!$(this).data("mark") === false;
            });
        };

        this.getAppointments = function() { return document.querySelectorAll(APPOINTMENT_CLASS_NAME); };
    },
    afterEach: function() {
        this.clock.restore();
    }
};


QUnit.module("Render layout", renderLayoutModuleOptions, function() {
    const createScheduler = (view, dataSource, options) => {
        const instance = $("#scheduler").dxScheduler($.extend(options, {
            views: ["week", "month", "agenda"],
            currentView: view,
            dataSource: dataSource,
            currentDate: new Date(2017, 4, 25),
            startDayHour: 9,
            height: 600,
            width: 1300,
            editing: true,
        })).dxScheduler("instance");

        return new SchedulerTestWrapper(instance);
    };

    const defaultData = [
        {
            id: 0,
            text: "Website Re-Design Plan",
            startDate: new Date(2017, 4, 21, 9, 30),
            endDate: new Date(2017, 4, 21, 11, 30)
        }, {
            id: 1,
            text: "Install New Database",
            startDate: new Date(2017, 4, 21, 12, 45),
            endDate: new Date(2017, 4, 21, 13, 15)
        }, {
            id: 2,
            text: "Book Flights to San Fran for Sales Trip",
            startDate: new Date(2017, 4, 22, 12, 0),
            endDate: new Date(2017, 4, 22, 13, 0),
        }, {
            id: 3,
            text: "Install New Router in Dev Room",
            startDate: new Date(2017, 4, 22, 14, 30),
            endDate: new Date(2017, 4, 22, 15, 30)
        }, {
            id: 4,
            text: "Approve Personal Computer Upgrade Plan",
            startDate: new Date(2017, 4, 23, 10, 0),
            endDate: new Date(2017, 4, 23, 11, 0)
        }, {
            id: 5,
            text: "Final Budget Review",
            startDate: new Date(2017, 4, 23, 12, 0),
            endDate: new Date(2017, 4, 23, 13, 35)
        }, {
            id: 6,
            text: "Install New Database",
            startDate: new Date(2017, 4, 24, 9, 45),
            endDate: new Date(2017, 4, 24, 11, 15)
        }, {
            id: 7,
            text: "Upgrade Personal Computers",
            startDate: new Date(2017, 4, 24, 15, 15),
            endDate: new Date(2017, 4, 24, 16, 30)
        }, {
            id: 8,
            text: "Customer Workshop",
            startDate: new Date(2017, 4, 25, 11, 0),
            endDate: new Date(2017, 4, 25, 12, 0),
        }, {
            id: 9,
            text: "Prepare 2015 Marketing Plan",
            startDate: new Date(2017, 4, 25, 11, 0),
            endDate: new Date(2017, 4, 25, 13, 30)
        }, {
            id: 10,
            text: "Create Icons for Website",
            startDate: new Date(2017, 4, 26, 10, 0),
            endDate: new Date(2017, 4, 26, 11, 30)
        }, {
            id: 11,
            text: "Upgrade Server Hardware",
            startDate: new Date(2017, 4, 26, 14, 30),
            endDate: new Date(2017, 4, 26, 16, 0)
        }, {
            id: 12,
            text: "Submit New Website Design",
            startDate: new Date(2017, 4, 27, 16, 30),
            endDate: new Date(2017, 4, 27, 18, 0)
        }, {
            id: 13,
            text: "Launch New Website",
            startDate: new Date(2017, 4, 27, 12, 20),
            endDate: new Date(2017, 4, 27, 14, 0)
        }
    ];

    this.createDataSource = (list = defaultData) => {
        return new DataSource({
            store: {
                type: "array",
                key: "id",
                data: [...list]
            }
        });
    };

    QUnit.test("Scheduler should render appointments only for appointments that need redraw", function(assert) {
        const dataSource = this.createDataSource();
        this.createInstance("week", dataSource);

        this.markAppointments();
        dataSource.store().push([
            { type: "update", key: 0, data: { text: "updated-1" } },
            { type: "update", key: 1, data: { text: "updated-2" } }
        ]);
        dataSource.load();
        assert.equal(2, this.getUnmarkedAppointments().length, "Should rendered only two updated appointments");

        this.markAppointments();
        dataSource.store().push([{ type: "insert", data: {
            id: 15,
            text: "Fake",
            startDate: new Date(2017, 4, 27, 15, 30),
            endDate: new Date(2017, 4, 27, 16, 30)
        } }]);
        dataSource.load();
        assert.equal(1, this.getUnmarkedAppointments().length, "Should rendered only inserted appointment");

        this.markAppointments();
        dataSource.store().remove(0);
        dataSource.load();
        assert.equal(0, this.getUnmarkedAppointments().length, "Html element should removed and should not redrawing another appointments");
    });

    QUnit.test("Scheduler should render only necessary appointments in crossing appointments case", function(assert) {
        const dataSource = this.createDataSource();
        this.createInstance("week", dataSource);

        this.markAppointments();
        dataSource.store().push([{ type: "insert", data: {
            id: 14,
            text: "Fake_key_14",
            startDate: defaultData[0].startDate,
            endDate: defaultData[0].endDate
        } }]);
        dataSource.load();
        assert.equal(2, this.getUnmarkedAppointments().length, "Should rendered inserted appointment and update appointment");

        this.markAppointments();
        dataSource.store().push([{ type: "insert", data: {
            id: 15,
            text: "Fake_key_15",
            startDate: defaultData[1].startDate,
            endDate: defaultData[1].endDate
        } }]);
        dataSource.load();
        assert.equal(2, this.getUnmarkedAppointments().length, "Should rendered inserted appointment and 2 updated appointment");

        this.markAppointments();
        dataSource.store().remove(15);
        dataSource.load();
        assert.equal(1, this.getUnmarkedAppointments().length, "Should rendered only two updated appointments");
    });

    QUnit.test("Scheduler should throw onAppointmentRendered event only for appointments that need redraw", function(assert) {
        const dataSource = this.createDataSource();
        const fakeHandler = {
            onAppointmentRendered: () => { }
        };
        const renderedStub = sinon.stub(fakeHandler, "onAppointmentRendered");

        this.createInstance("week", dataSource, { onAppointmentRendered: fakeHandler.onAppointmentRendered });

        renderedStub.reset();
        dataSource.store().push([{ type: "insert", data: {
            id: 14,
            text: "Fake_key_14",
            startDate: new Date(2017, 4, 21, 15, 0),
            endDate: new Date(2017, 4, 21, 15, 30),
        } }]);
        dataSource.load();
        assert.equal(renderedStub.callCount, 1, "Should throw one call onAppointmentRendered event");

        renderedStub.reset();
        dataSource.store().remove(14);
        dataSource.load();
        assert.equal(renderedStub.callCount, 0, "Should not throw onAppointmentRendered event");

        renderedStub.reset();
        dataSource.store().push([{ type: "insert", data: {
            id: 15,
            text: "Fake_key_15",
            startDate: defaultData[0].startDate,
            endDate: defaultData[0].endDate
        } }]);
        dataSource.load();
        assert.equal(renderedStub.callCount, 2, "Should throw two call onAppointmentRendered event");

        renderedStub.reset();
        dataSource.store().push([
            { type: "update", key: 0, data: { text: "updated-1" } },
        ]);
        dataSource.load();

        assert.equal(renderedStub.callCount, 1, "Should throw one call onAppointmentRendered event");
    });

    QUnit.test("Scheduler should render appointments only for appointments that need redraw in Month view", function(assert) {
        const dataSource = this.createDataSource();
        this.createInstance("month", dataSource);

        this.markAppointments();
        dataSource.store().push([
            { type: "update", key: 0, data: { text: "updated-1" } },
            { type: "update", key: 1, data: { text: "updated-2" } }
        ]);
        dataSource.load();
        assert.equal(2, this.getUnmarkedAppointments().length, "Should rendered only two updated appointments");

        this.markAppointments();
        dataSource.store().push([{ type: "insert", data: {
            id: 15,
            text: "Fake",
            startDate: new Date(2017, 4, 28, 15, 30),
            endDate: new Date(2017, 4, 28, 16, 30)
        } }]);
        dataSource.load();
        assert.equal(1, this.getUnmarkedAppointments().length, "Should rendered only inserted appointment");

        this.markAppointments();
        dataSource.store().remove(0);
        dataSource.load();

        // TODO: in future this case should be optimized - redraw in this case can escape
        assert.equal(1, this.getUnmarkedAppointments().length, "Should rendered only one appointment");
    });

    QUnit.test("Scheduler should render appointments only for appointments that need redraw. Use scheduler API", function(assert) {
        this.createInstance("week", defaultData);

        this.markAppointments();
        this.instance.updateAppointment(defaultData[0], { text: "updated" });
        assert.equal(1, this.getUnmarkedAppointments().length, "Should rendered only one appointment");

        this.markAppointments();
        this.instance.updateAppointment(defaultData[9], { text: "updated" });
        assert.equal(1, this.getUnmarkedAppointments().length, "Should rendered only one appointment from intersecting appointments");

        this.markAppointments();
        this.instance.deleteAppointment(defaultData[0]);
        assert.equal(0, this.getUnmarkedAppointments().length, "Nothing should be redrawing");
    });

    QUnit.test("Scheduler should render all appointments in Agenda view case", function(assert) {
        const dataSource = this.createDataSource();
        this.createInstance("agenda", dataSource);

        this.markAppointments();
        dataSource.store().push([
            { type: "update", key: 8, data: { text: "updated-1" } },
            { type: "update", key: 10, data: { text: "updated-2" } }
        ]);
        dataSource.load();
        assert.equal(this.getAppointments().length, this.getUnmarkedAppointments().length, "Should rendered all appointments");

        this.markAppointments();
        dataSource.store().push([{ type: "insert", data: {
            id: 15,
            text: "Fake",
            startDate: new Date(2017, 4, 27, 15, 30),
            endDate: new Date(2017, 4, 27, 16, 30)
        } }]);
        dataSource.load();

        assert.equal(this.getAppointments().length, this.getUnmarkedAppointments().length, "Should rendered all appointments");
    });

    QUnit.test("Scheduler should re-render appointments in Agenda view, if data source loading data", function(assert) {
        const items = [
            { id: 0, startDate: new Date(2017, 4, 25, 9), endDate: new Date(2017, 4, 25, 9, 30), text: "a" },
            { id: 1, startDate: new Date(2017, 4, 27, 15), endDate: new Date(2017, 4, 27, 15, 30), text: "b" }
        ];

        const dataSource = {
            store: new CustomStore({
                key: "id",
                load: () => items,
                update: (key, values) => items[parseInt(key)] = values
            })
        };
        const scheduler = createScheduler("agenda", dataSource);
        assert.equal(scheduler.appointments.getAppointmentCount(), 2, "Should render 2 appointments");
        this.markAppointments();

        scheduler.appointments.click();
        scheduler.tooltip.clickOnItem();
        scheduler.appointmentForm.setSubject("new text");
        scheduler.appointmentPopup.clickDoneButton();

        assert.equal(scheduler.appointments.getAppointmentCount(), 2, "Should render 2 appointments");
        assert.equal(scheduler.appointments.getAppointmentCount(), this.getUnmarkedAppointments().length, "Should re-rendered all appointments");
    });
});

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

QUnit.test("Scheduler should have a right rendering strategy for views with config", function(assert) {
    this.createInstance({
        views: [ {
            name: "MonthView",
            type: "month"
        }, {
            name: "WeekView",
            type: "week"
        }],
        currentView: "WeekView"
    });

    assert.ok(this.instance.getRenderingStrategyInstance() instanceof VerticalAppointmentStrategy, "Strategy is OK");

    this.instance.option("currentView", "MonthView");
    assert.ok(this.instance.getRenderingStrategyInstance() instanceof HorizontalAppointmentsStrategy, "Strategy is OK");
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
        currentDate: new Date(2015, 1, 9),
        dataSource: [{ text: "Appointment 1", startDate: new Date(2015, 1, 9, 8) }]
    });

    assert.deepEqual(this.instance.option("dataSource")[0].endDate, new Date(2015, 1, 9, 8, 30), "End date of appointment is 30 minutes");
});

QUnit.test("Appointment duration should be equal to 30 minutes if end date equal or lower than start date", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: [
            { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 8) },
            { text: "Appointment 2", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 7) }
        ]
    });

    assert.deepEqual(this.instance.option("dataSource")[0].endDate, new Date(2015, 1, 9, 8, 30), "End date is correct");
    assert.deepEqual(this.instance.option("dataSource")[1].endDate, new Date(2015, 1, 9, 8, 30), "End date is correct");
});

QUnit.test("AllDay appointment without endDate shoud be rendered correctly", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: [
            { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), AllDay: true }
        ],
        currentView: "week",
        allDayExpr: "AllDay",
        views: ["week"]
    });

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment"));

    assert.equal($appointment.length, 1, "AllDay appointment was rendered");
});

QUnit.test("Appointment should have right default height", function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2016, 2, 1),
            dataSource: [{ startDate: new Date(2016, 2, 1, 1), endDate: new Date(2016, 2, 1, 2) }]
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment"));

    assert.equal($appointment.outerHeight(), 100, "Appointment has a right height");
});

QUnit.test("Appointment should have a correct height when dates are defined as not Date objects", function(assert) {
    this.createInstance(
        {
            currentDate: 1423458000000,
            dataSource: [{ text: "Appointment 1", startDate: 1423458000000, endDate: 1423461600000 }]
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment"));

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

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment"));

    assert.equal($appointment.outerHeight(), 4, "Appointment has a right height");
});

QUnit.test("Appointment should have a correct min width", function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9, 8),
            views: ["timelineWeek"],
            currentView: "timelineWeek",
            dataSource: [
                {
                    startDate: new Date(2015, 1, 9, 8, 1, 1),
                    endDate: new Date(2015, 1, 9, 8, 1, 2)
                }
            ]
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment"));

    assert.equal($appointment.outerWidth(), 5, "Appointment has a right width");
});

QUnit.test("Long appointment tail should have a correct min height", function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9, 8),
            views: ["week"],
            currentView: "week",
            dataSource: [
                {
                    startDate: new Date(2015, 1, 9, 23, 0),
                    endDate: new Date(2015, 1, 10, 0, 0, 53)
                }
            ]
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")).eq(1);

    assert.equal($appointment.outerHeight(), 4, "Appointment-tail has a right height");
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

    var $appointments = $(this.instance.$element().find(".dx-scheduler-appointment"));

    assert.equal(dataUtils.data($appointments.get(0), "dxAppointmentSettings").sortedIndex, 0, "app has right sortedIndex");
    assert.equal(dataUtils.data($appointments.get(1), "dxAppointmentSettings").sortedIndex, 1, "app has right sortedIndex");
    assert.equal(dataUtils.data($appointments.get(2), "dxAppointmentSettings").sortedIndex, 2, "app has right sortedIndex");
    assert.equal(dataUtils.data($appointments.get(3), "dxAppointmentSettings").sortedIndex, 3, "app has right sortedIndex");
});

// NOTE: check sortedIndex for long appt parts
QUnit.test("Compact parts of long appointment shouldn't have sortedIndex", function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4, 2),
            focusStateEnabled: true,
            views: ["month"],
            currentView: "month",
            height: 500,
            dataSource: [
                { text: "Appointment 1", startDate: new Date(2015, 2, 4, 2), endDate: new Date(2015, 2, 5, 3), allDay: true },
                { text: "Appointment 2", startDate: new Date(2015, 2, 4, 2), endDate: new Date(2015, 2, 5, 12), allDay: true },
                { text: "Appointment 3", startDate: new Date(2015, 2, 4, 2), endDate: new Date(2015, 2, 8, 2), allDay: true }
            ]
        }
    );

    var $appointments = $(this.instance.$element().find(".dx-scheduler-appointment"));

    assert.equal(dataUtils.data($appointments.get(0), "dxAppointmentSettings").sortedIndex, 0, "app has sortedIndex");
    assert.equal(dataUtils.data($appointments.get(1), "dxAppointmentSettings").sortedIndex, 1, "app has sortedIndex");
    assert.equal(dataUtils.data($appointments.get(2), "dxAppointmentSettings").sortedIndex, 2, "app has sortedIndex");
    assert.equal(dataUtils.data($appointments.get(3), "dxAppointmentSettings").sortedIndex, null, "app has sortedIndex");
    assert.equal(dataUtils.data($appointments.get(4), "dxAppointmentSettings").sortedIndex, null, "app has sortedIndex");
    assert.equal(dataUtils.data($appointments.get(5), "dxAppointmentSettings").sortedIndex, null, "app has sortedIndex");
    assert.equal(dataUtils.data($appointments.get(6), "dxAppointmentSettings").sortedIndex, 3, "app has sortedIndex");
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

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")),
        $allDayCell = $(this.instance.$element().find(".dx-scheduler-all-day-table-cell"));

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

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")),
        $tableCell = $(this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0));

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
            height: 600,
            dataSource: [
                { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 12) },
                { text: "Appointment 2", startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 12) },
                { text: "Appointment 3", startDate: new Date(2015, 1, 9, 11), endDate: new Date(2015, 1, 9, 12) }
            ]
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment"));
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

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")),
        $tableCell = $(this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0)),
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

    assert.roughEqual(thirdAppointmentPosition.left, 21, 1.5, "appointment is rendered in right place");
    assert.roughEqual(thirdAppointmentPosition.top, 3, 1.5, "appointment is rendered in right place");
    assert.equal($appointment.eq(2).outerHeight(), 15, "appointment has a right size");
    assert.equal($appointment.eq(2).outerWidth(), 15, "appointment has a right size");
    assert.roughEqual(fourthAppointmentPosition.left, 3, 1, "appointment is rendered in right place");
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

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")),
        $tableCell = $(this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0)),
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
            width: 600,
            dataSource: items
        }
    );

    var $appointments = $(this.instance.$element().find(".dx-scheduler-appointment"));

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
        pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-left")).start();

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
        $appointment: this.instance.$element().find(".dx-scheduler-appointment")
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
        pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-right")).start();

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
        $appointment: this.instance.$element().find(".dx-scheduler-appointment")
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
        pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-left")).start();

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
        $appointment: this.instance.$element().find(".dx-scheduler-appointment")
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
        pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-right")).start();

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
        $appointment: this.instance.$element().find(".dx-scheduler-appointment")
    });
});

QUnit.module("Horizontal Month Strategy", {
    beforeEach: function() {
        moduleOptions.beforeEach.apply(this);
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        moduleOptions.afterEach.apply(this);
        this.clock.restore();
    }
});

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
        pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-left")).start();

    pointer.dragStart().drag(-80, 0).dragEnd();

    var args = stub.getCall(0).args;

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: items[0],
        updated: updatedItem,
        $appointment: this.instance.$element().find(".dx-scheduler-appointment")
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

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment"));
    assert.equal($appointment.length, 2, "Cloned appointments are grouped");

    var $dropDownMenu = $(this.instance.$element()).find(".dx-scheduler-dropdown-appointments").trigger("dxclick"),
        dropDownMenu = $dropDownMenu.eq(0).dxDropDownMenu("instance"),
        groupedAppointments = dropDownMenu.option("items"),
        dropDownMenuText = $dropDownMenu.find("span").first().text();

    assert.equal($dropDownMenu.length, 1, "ddAppointment is rendered");

    assert.equal(groupedAppointments.length, 8, "DropDown menu has correct items");
    assert.equal(dropDownMenuText, "8 more", "DropDown menu has correct text");
    assert.roughEqual(dropDownMenu.option("buttonWidth"), 106, 1, "DropDownMenu button width is OK");
});

QUnit.test("Grouped appointments schould have correct colors", function(assert) {
    var items = [], i = 2;

    while(i > 0) {
        items.push({ text: i, startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), roomId: 1 });
        i--;
    }
    i = 10;
    while(i > 0) {
        items.push({ text: i, startDate: new Date(2015, 1, 9, 3), endDate: new Date(2015, 1, 9, 4), roomId: 2 });
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

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment"));
    assert.equal($appointment.length, 2, "Cloned appointments are grouped");

    var $dropDownMenu = $(this.instance.$element()).find(".dx-scheduler-dropdown-appointments");

    assert.equal(new Color($dropDownMenu.css("backgroundColor")).toHex(), "#0000ff", "ddAppointment is rendered");
});

QUnit.test("Grouped appointments schould have correct colors when resourses store is asynchronous", function(assert) {
    var items = [], i = 2;

    while(i > 0) {
        items.push({ text: i, startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), roomId: 1 });
        i--;
    }
    i = 10;
    while(i > 0) {
        items.push({ text: i, startDate: new Date(2015, 1, 9, 3), endDate: new Date(2015, 1, 9, 4), roomId: 2 });
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
                    dataSource: new CustomStore({
                        load: function() {
                            var d = $.Deferred();
                            setTimeout(function() {
                                d.resolve([
                                    { id: 1, text: "Room 1", color: "#ff0000" },
                                    { id: 2, text: "Room 2", color: "#0000ff" }
                                ]);
                            }, 300);

                            return d.promise();
                        }
                    })
                }
            ]
        }
    );

    this.clock.tick(300);
    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment"));
    assert.equal($appointment.length, 2, "Cloned appointments are grouped");

    var $dropDownMenu = $(this.instance.$element()).find(".dx-scheduler-dropdown-appointments");
    this.clock.tick(300);
    assert.equal(new Color($dropDownMenu.css("backgroundColor")).toHex(), "#0000ff", "ddAppointment is rendered");
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
            width: 600,
            dataSource: items
        }
    );
    items.push({ text: "a", startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1) });
    this.instance.option("dataSource", items);
    var $dropDownMenu = $(this.instance.$element().find(".dx-scheduler-dropdown-appointments"));

    assert.equal($dropDownMenu.length, 1, "DropDown appointments are refreshed");
});

QUnit.test("Parts of long compact appt should have right positions", function(assert) {
    var items = [ { text: "Task 1", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 5, 3, 0) },
        { text: "Task 2", startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 5, 12, 0) },
        { text: "Task 3", startDate: new Date(2015, 2, 4, 12, 0), endDate: new Date(2015, 2, 7, 2, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "month",
            height: 500,
            dataSource: items
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")),
        tableCellWidth = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerWidth(),
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
        pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-left")).start();

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
        $appointment: this.instance.$element().find(".dx-scheduler-appointment")
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
        pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-left")).start();

    pointer.dragStart().drag(-800, 0).dragEnd();

    var args = stub.getCall(0).args;

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.$element().find(".dx-scheduler-appointment")
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
        pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-right")).start();

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
        $appointment: this.instance.$element().find(".dx-scheduler-appointment")
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
        pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-left")).start();

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
        $appointment: this.instance.$element().find(".dx-scheduler-appointment")
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
        pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-right")).start();

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
        $appointment: this.instance.$element().find(".dx-scheduler-appointment")
    });
});

QUnit.test("End date of appointment should be changed considering endDayHour and startDayHour when resize is finished", function(assert) {
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
        pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-right")).start();

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
        $appointment: this.instance.$element().find(".dx-scheduler-appointment")
    });
});

QUnit.test("Start date of appointment should be changed considering endDayHour and startDayHour when resize is finished", function(assert) {
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
        pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-left")).start();
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
        $appointment: this.instance.$element().find(".dx-scheduler-appointment")
    });
});

QUnit.test("Start date of long multiday appointment should be changed considering endDayHour and startDayHour when resize is finished", function(assert) {
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
        pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-left")).start(),
        tableCellWidth = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerWidth(),
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
        $appointment: this.instance.$element().find(".dx-scheduler-appointment")
    });
});

QUnit.test("End date of long multiday appointment should be changed considering endDayHour and startDayHour when resize is finished", function(assert) {
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
        pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-right")).start(),
        tableCellWidth = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerWidth(),
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
        $appointment: this.instance.$element().find(".dx-scheduler-appointment")
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
            maxAppointmentsPerCell: null,
            height: 500,
            dataSource: items,
            startDayHour: 1
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment"));
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

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")),
        tableCellWidth = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerWidth() * 2;

    assert.equal($appointment.eq(0).outerWidth(), tableCellWidth, "appointment has a right size");
    assert.equal($appointment.eq(0).outerHeight(), 100, "appointment has a right size");

    assert.equal($appointment.eq(1).outerWidth(), tableCellWidth, "appointment has a right size");
    assert.equal($appointment.eq(1).outerHeight(), 100, "appointment has a right size");

    assert.equal($appointment.eq(2).outerWidth(), tableCellWidth, "appointment has a right size");
    assert.equal($appointment.eq(2).outerHeight(), 100, "appointment has a right size");

    assert.equal($appointment.eq(3).outerWidth(), tableCellWidth, "appointment has a right size");
    assert.equal($appointment.eq(3).outerHeight(), 100, "appointment has a right size");
});

QUnit.test("Recurrence appointment should be rendered correctly on timelineWeek (T701534)", function(assert) {
    var items = [{
        allDay: false,
        endDate: new Date(2018, 11, 12, 2),
        RecurrenceRule: "FREQ=DAILY;COUNT=2",
        startDate: new Date(2018, 11, 11, 2)
    }];

    this.createInstance(
        {
            currentDate: new Date(2018, 11, 10),
            currentView: "timelineWeek",
            height: 530,
            dataSource: items,
            startDayHour: 1,
            cellDuration: 1440,
            recurrenceRuleExpr: "RecurrenceRule"
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment"));

    assert.equal($appointment.length, 2, "appointments are rendered correctly");
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

    var $appointments = $(this.instance.$element().find(".dx-scheduler-appointment"));

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

    var $appointments = $(this.instance.$element().find(".dx-scheduler-all-day-appointment"));

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

    var $appointment = $(this.instance.$element().find(".dx-scheduler-all-day-appointment"));

    var stub = sinon.stub(this.instance.getAppointmentsInstance(), "notifyObserver").withArgs("updateAppointmentAfterResize"),
        pointer = pointerMock($appointment.find(".dx-resizable-handle-left")).start();

    pointer.dragStart().drag(-120, 0).dragEnd();

    var args = stub.getCall(0).args;

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.$element().find(".dx-scheduler-all-day-appointment")
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
        pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-top")).start();
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
        $appointment: this.instance.$element().find(".dx-scheduler-appointment")
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

    var pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-bottom")).start();
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
        $appointment: this.instance.$element().find(".dx-scheduler-appointment")
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

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")),
        $tableCell = $(this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0)),
        cellHeight = $tableCell.get(0).getBoundingClientRect().height,
        cellWidth = $tableCell.get(0).getBoundingClientRect().width,
        offset = getOffset();

    assert.equal($appointment.length, 2, "All appointments are rendered");

    var firstAppointmentPosition = translator.locate($appointment.eq(0)),
        secondAppointmentPosition = translator.locate($appointment.eq(1));

    assert.equal(firstAppointmentPosition.top, 0, "appointment is rendered in right place");
    assert.roughEqual(firstAppointmentPosition.left, cellWidth + 100, 1, "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(0).outerWidth(), (cellWidth - offset) / 2, 1, "appointment has a right size");

    assert.equal(secondAppointmentPosition.top, 2 * cellHeight, "appointment is rendered in right place");
    assert.roughEqual(secondAppointmentPosition.left, cellWidth + $appointment.eq(0).outerWidth() + 100, 1, "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(1).outerWidth(), (cellWidth - offset) / 2, 1, "appointment has a right size");
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

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")),
        $tableCell = $(this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0)),
        cellHeight = $tableCell.get(0).getBoundingClientRect().height,
        cellWidth = $tableCell.get(0).getBoundingClientRect().width,
        offset = getOffset(),
        firstAppointmentPosition = translator.locate($appointment.eq(0)),
        secondAppointmentPosition = translator.locate($appointment.eq(1)),
        thirdAppointmentPosition = translator.locate($appointment.eq(2));

    assert.equal($appointment.length, 3, "All appointments are rendered");
    assert.equal(firstAppointmentPosition.top, 0, "appointment is rendered in right place");
    assert.roughEqual(firstAppointmentPosition.left, cellWidth + 100, 1, "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(0).outerWidth(), (cellWidth - offset) / 2, 1, "appointment has a right size");

    assert.equal(secondAppointmentPosition.top, 2 * cellHeight, "appointment is rendered in right place");
    assert.roughEqual(secondAppointmentPosition.left, cellWidth + $appointment.eq(0).outerWidth() + 100, 1, "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(1).outerWidth(), (cellWidth - offset) / 2, 1, "appointment has a right size");

    assert.equal(thirdAppointmentPosition.top, 0, "appointment is rendered in right place");
    assert.roughEqual(thirdAppointmentPosition.left, cellWidth + $appointment.eq(0).outerWidth() + 100, 1, "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(1).outerWidth(), (cellWidth - offset) / 2, 1, "appointment has a right size");
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

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")),
        $tableCell = $(this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0)),
        cellHeight = $tableCell.get(0).getBoundingClientRect().height,
        cellWidth = $tableCell.get(0).getBoundingClientRect().width,
        offset = getOffset(),
        expectedAppWidth = (cellWidth - offset) / 3;

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

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")),
        $tableCell = $(this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0)),
        cellWidth = $tableCell.outerWidth(),
        offset = getOffset();

    assert.equal($appointment.length, 3, "All appointments are rendered");
    assert.deepEqual(translator.locate($appointment.eq(0)), { top: 0, left: cellWidth + 100 }, "appointment is rendered in right place");
    assert.equal($appointment.eq(0).outerWidth(), cellWidth - offset, "appointment has a right size");

    assert.deepEqual(translator.locate($appointment.eq(1)), { top: 0, left: 2 * cellWidth + 100 }, "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(1).outerWidth(), (cellWidth - offset) / 2, 1, "appointment has a right size");

    assert.deepEqual(translator.locate($appointment.eq(2)), { top: 0, left: 2 * cellWidth + 100 + (cellWidth - offset) / 2 }, "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(2).outerWidth(), (cellWidth - offset) / 2, 1, "appointment has a right size");
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
        firstAppointmentPosition = $appointment.eq(0).position(),
        secondAppointmentPosition = $appointment.eq(1).position(),
        containerOffset = $(this.instance.$element().find(".dx-scheduler-all-day-appointments")).position().top;

    assert.equal($appointment.length, 2, "All appointments are rendered");

    assert.equal(firstAppointmentPosition.top, 0 + containerOffset, "appointment is rendered in right place");
    assert.roughEqual(firstAppointmentPosition.left, 100, 1, "appointment is rendered in right place");
    assert.roughEqual($appointment.eq(0).outerWidth(), 798, 1.1, "appointment has a right width");
    assert.roughEqual($appointment.eq(0).outerHeight(), 37, 1.1, "appointment has a right height");

    assert.roughEqual(secondAppointmentPosition.top, 37 + containerOffset, 1, "appointment is rendered in right place");
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
        $allDayCell = $(this.instance.$element().find(".dx-scheduler-all-day-table-cell").eq(0)),
        appointmentPosition = $appointment.eq(0).position();

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

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")),
        containerOffset = $(this.instance.$element().find(".dx-scheduler-all-day-appointments")).position().top,
        gap = 3 + containerOffset,
        cellBorderOffset = 1,
        cellWidth = this.instance.$element().find(".dx-scheduler-all-day-table-cell").eq(0).outerWidth();

    for(var i = 2; i < $appointment.length; i++) {
        var appointmentPosition = $appointment.eq(i).position();

        assert.roughEqual($appointment.eq(i).outerWidth(), 15, 1, "appointment has a right size");
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

    var $appointments = $(this.instance.$element().find(".dx-scheduler-appointment"));
    $($appointments.eq(3)).trigger("focusin");
    this.clock.tick();

    var keyboard = keyboardMock($appointments.eq(3));

    $(this.instance.$element()).on("keydown", function(e) {
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

    var $appointments = $(this.instance.$element().find(".dx-scheduler-appointment")),
        apptInstance = this.instance.getAppointmentsInstance();

    $($appointments.eq(0)).trigger("focusin");
    this.clock.tick();

    var keyboard = keyboardMock($appointments.eq(0));
    keyboard.keyDown("tab");
    assert.deepEqual($appointments.get(1), $(apptInstance.option("focusedElement")).get(0), "app 1 in focus");

    keyboard.keyDown("tab");
    assert.deepEqual($appointments.get(2), $(apptInstance.option("focusedElement")).get(0), "app 0 in focus");

    keyboard.keyDown("tab");
    assert.deepEqual($appointments.get(3), $(apptInstance.option("focusedElement")).get(0), "app 3 in focus");
});

QUnit.testInActiveWindow("Apps should be focused in right order on month view with ddAppointments", function(assert) {
    this.createInstance({
        focusStateEnabled: true,
        currentView: "month",
        views: [{
            type: "month",
            name: "MONTH",
            maxAppointmentsPerCell: "auto"
        }],
        height: 600,
        currentDate: new Date(2015, 9, 16),
        dataSource: [{ text: "Appointment 1", startDate: new Date(2015, 9, 11, 9), endDate: new Date(2015, 9, 11, 11) },
            { text: "Appointment 2", startDate: new Date(2015, 9, 11, 8), endDate: new Date(2015, 9, 11, 10) },
            { text: "Appointment 3", startDate: new Date(2015, 9, 11, 8), endDate: new Date(2015, 9, 11, 10) },
            { text: "Appointment 4", startDate: new Date(2015, 9, 12, 8), endDate: new Date(2015, 9, 12, 10) }]
    });

    var $appointments = $(this.instance.$element().find(".dx-scheduler-appointment")),
        apptInstance = this.instance.getAppointmentsInstance();

    $($appointments.eq(0)).trigger("focusin");
    this.clock.tick();

    var keyboard = keyboardMock($appointments.eq(0));
    keyboard.keyDown("tab");
    assert.deepEqual($appointments.get(1), $(apptInstance.option("focusedElement")).get(0), "app 1 in focus");

    keyboard.keyDown("tab");
    assert.deepEqual($appointments.get(2), $(apptInstance.option("focusedElement")).get(0), "app 0 in focus");
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

    var $appointments = $(this.instance.$element().find(".dx-scheduler-appointment")),
        apptInstance = this.instance.getAppointmentsInstance(),
        keyboard = keyboardMock($appointments.eq(0));

    $($appointments.eq(3)).trigger("focusin");
    this.clock.tick();

    keyboard.keyDown("tab", { shiftKey: true });
    assert.deepEqual($appointments.get(2), $(apptInstance.option("focusedElement")).get(0), "app 1 in focus");

    keyboard.keyDown("tab", { shiftKey: true });
    assert.deepEqual($appointments.get(1), $(apptInstance.option("focusedElement")).get(0), "app 1 in focus");

    keyboard.keyDown("tab", { shiftKey: true });
    assert.deepEqual($appointments.get(0), $(apptInstance.option("focusedElement")).get(0), "app 1 in focus");
});

QUnit.module("Appointment overlapping, month view and allDay panel", moduleOptions);

QUnit.test("Full-size appointment count depends on maxAppointmentsPerCell option", function(assert) {
    var items = [ { text: "Task 1", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0) },
        { text: "Task 2", startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0) },
        { text: "Task 3", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 5, 0) },
        { text: "Task 4", startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "month",
            views: [{
                type: "month",
                maxAppointmentsPerCell: 3
            }],
            height: 500,
            dataSource: items
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")),
        tableCellWidth = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerWidth();
    for(var i = 0; i < 2; i++) {
        var appointmentWidth = $appointment.eq(i).outerWidth();

        assert.roughEqual(appointmentWidth, tableCellWidth, 1.5, "appointment is full-size");
    }

    var $dropDownMenu = $(this.instance.$element()).find(".dx-scheduler-dropdown-appointments").trigger("dxclick"),
        dropDownMenu = $dropDownMenu.eq(0).dxDropDownMenu("instance"),
        groupedAppointments = dropDownMenu.option("items"),
        dropDownMenuText = $dropDownMenu.find("span").first().text();

    assert.equal($dropDownMenu.length, 1, "ddAppointment is rendered");

    assert.equal(groupedAppointments.length, 1, "DropDown menu has correct items");
    assert.equal(dropDownMenuText, "1 more", "DropDown menu has correct text");
});

QUnit.test("Full-size appointment count depends on maxAppointmentsPerCell option, 'auto' mode", function(assert) {
    var items = [ { text: "Task 1", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0) },
        { text: "Task 2", startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0) },
        { text: "Task 3", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 5, 0) },
        { text: "Task 4", startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "month",
            views: [{
                type: "month",
                maxAppointmentsPerCell: 'auto'
            }],
            height: 600,
            dataSource: items
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")),
        tableCellWidth = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerWidth(),
        $dropDownMenu = $(this.instance.$element()).find(".dx-scheduler-dropdown-appointments").trigger("dxclick"),
        dropDownMenuText = $dropDownMenu.find("span").first().text();

    assert.roughEqual($appointment.eq(0).outerWidth(), tableCellWidth, 1.5, "appointment is full-size");
    assert.roughEqual($appointment.eq(1).outerWidth(), tableCellWidth, 1.5, "appointment is full-size");
    assert.equal($dropDownMenu.length, 1, "ddAppointment is rendered");
    assert.equal(dropDownMenuText, "2 more", "DropDown menu has correct text");

    this.instance.option("height", 900);
    $appointment = $(this.instance.$element().find(".dx-scheduler-appointment"));

    assert.roughEqual($appointment.eq(0).outerWidth(), tableCellWidth, 1.5, "appointment is full-size");
    assert.roughEqual($appointment.eq(1).outerWidth(), tableCellWidth, 1.5, "appointment is full-size");
    assert.roughEqual($appointment.eq(2).outerWidth(), tableCellWidth, 1.5, "appointment is full-size");
    assert.roughEqual($appointment.eq(3).outerWidth(), tableCellWidth, 1.5, "appointment is full-size");
});

QUnit.test("Full-size appointment count depends on maxAppointmentsPerCell option, height is small 'auto' mode", function(assert) {
    var items = [ { text: "Task 1", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0) },
        { text: "Task 2", startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0) },
        { text: "Task 3", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 5, 0) },
        { text: "Task 4", startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "month",
            views: [{
                type: "month",
                maxAppointmentsPerCell: 'auto'
            }],
            height: 200,
            dataSource: items
        }
    );

    var $dropDownMenu = $(this.instance.$element()).find(".dx-scheduler-dropdown-appointments").trigger("dxclick"),
        dropDownMenuText = $dropDownMenu.find("span").first().text();

    assert.equal($dropDownMenu.length, 1, "ddAppointment is rendered");
    assert.equal(dropDownMenuText, "4 more", "DropDown menu has correct text");
});

QUnit.test("Full-size appointment should have correct height, 'auto' mode", function(assert) {
    var items = [ { text: "Task 1", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0) },
        { text: "Task 2", startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0) },
        { text: "Task 3", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 5, 0) },
        { text: "Task 4", startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "month",
            views: [{
                type: "month",
                maxAppointmentsPerCell: 'auto'
            }],
            height: 550,
            dataSource: items
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment"));

    assert.roughEqual($appointment.eq(0).outerHeight(), 23.5, 1, "appointment height is ok");
    assert.roughEqual($appointment.eq(1).outerHeight(), 23.5, 1, "appointment height is ok");

    this.instance.option("height", 900);
    $appointment = $(this.instance.$element().find(".dx-scheduler-appointment"));

    assert.roughEqual($appointment.eq(0).outerHeight(), 21, 1, "appointment height is ok");
    assert.roughEqual($appointment.eq(1).outerHeight(), 21, 1, "appointment height is ok");
});

QUnit.test("Full-size appointment should not have empty class in 'auto' mode", function(assert) {
    var items = [ { text: "Task 1", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0) },
        { text: "Task 2", startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "month",
            views: [{
                type: "month",
                maxAppointmentsPerCell: 'auto'
            }],
            height: 500,
            dataSource: []
        }
    );

    var getHeightStub = sinon.stub(this.instance.getRenderingStrategyInstance(), "_getAppointmentDefaultHeight", function() {
        return 18;
    });

    try {
        this.instance.option("dataSource", items);

        var $firstAppointment = $(this.instance.$element().find(".dx-scheduler-appointment")).eq(0),
            $secondAppointment = $(this.instance.$element().find(".dx-scheduler-appointment")).eq(1);

        assert.ok(!$firstAppointment.hasClass("dx-scheduler-appointment-empty"), "appointment has not the class");
        assert.ok(!$secondAppointment.eq(1).hasClass("dx-scheduler-appointment-empty"), "appointment has not the class");
    } finally {
        getHeightStub.restore();
    }
});

QUnit.test("Full-size appointment should have correct height, 'numeric' mode", function(assert) {
    var items = [ { text: "Task 1", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0) },
        { text: "Task 2", startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0) },
        { text: "Task 3", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 5, 0) },
        { text: "Task 4", startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "month",
            views: [{
                type: "month",
                maxAppointmentsPerCell: 3
            }],
            height: 550,
            dataSource: items
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment"));

    assert.roughEqual($appointment.eq(0).outerHeight(), 15.5, 1, "appointment height is ok");
    assert.roughEqual($appointment.eq(1).outerHeight(), 15.5, 1, "appointment height is ok");
    assert.roughEqual($appointment.eq(2).outerHeight(), 15.5, 1, "appointment height is ok");

    this.instance.option("height", 900);
    $appointment = $(this.instance.$element().find(".dx-scheduler-appointment"));

    assert.roughEqual($appointment.eq(0).outerHeight(), 35.5, 1, "appointment height is ok");
    assert.roughEqual($appointment.eq(1).outerHeight(), 35.5, 1, "appointment height is ok");
    assert.roughEqual($appointment.eq(2).outerHeight(), 35.5, 1, "appointment height is ok");
});

QUnit.test("Full-size appointment count depends on maxAppointmentsPerCell option, 'unlimited' mode", function(assert) {
    var items = [ { text: "Task 1", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0) },
        { text: "Task 2", startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0) },
        { text: "Task 3", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 5, 0) },
        { text: "Task 4", startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0) },
        { text: "Task 5", startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0) },
        { text: "Task 5", startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "month",
            views: [{
                type: "month",
                maxAppointmentsPerCell: 'unlimited'
            }],
            height: 200,
            dataSource: items
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")),
        tableCellWidth = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerWidth();

    assert.roughEqual($appointment.eq(0).outerWidth(), tableCellWidth, 1.5, "appointment is full-size");
    assert.roughEqual($appointment.eq(1).outerWidth(), tableCellWidth, 1.5, "appointment is full-size");
    assert.roughEqual($appointment.eq(2).outerWidth(), tableCellWidth, 1.5, "appointment is full-size");
    assert.roughEqual($appointment.eq(3).outerWidth(), tableCellWidth, 1.5, "appointment is full-size");
    assert.roughEqual($appointment.eq(4).outerWidth(), tableCellWidth, 1.5, "appointment is full-size");
    assert.roughEqual($appointment.eq(5).outerWidth(), tableCellWidth, 1.5, "appointment is full-size");
});

QUnit.test("Full-size appointment count depends on maxAppointmentsPerCell option, Day view", function(assert) {
    var items = [ { text: "Task 1", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0), allDay: true },
        { text: "Task 2", startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0), allDay: true },
        { text: "Task 3", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 5, 0), allDay: true },
        { text: "Task 4", startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0), allDay: true } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "day",
            views: [{
                type: "day",
                maxAppointmentsPerCell: 3
            }],
            height: 500,
            dataSource: items
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-all-day-appointment")),
        tableCellWidth = this.instance.$element().find(".dx-scheduler-all-day-table-cell").eq(0).outerWidth(),
        tableCellHeight = this.instance.$element().find(".dx-scheduler-all-day-table-cell").eq(0).outerHeight();

    for(var i = 0; i < 3; i++) {
        var appointmentWidth = $appointment.eq(i).outerWidth(),
            appointmentHeight = $appointment.eq(i).outerHeight();

        assert.roughEqual(appointmentWidth, tableCellWidth, 1.5, "appointment is full-size");
        assert.roughEqual(appointmentHeight, (tableCellHeight - 30) / 3, 1.5, "appointment is full-size");
    }

    var $dropDownMenu = $(this.instance.$element()).find(".dx-scheduler-dropdown-appointments").trigger("dxclick"),
        dropDownMenu = $dropDownMenu.eq(0).dxDropDownMenu("instance"),
        groupedAppointments = dropDownMenu.option("items"),
        dropDownMenuText = $dropDownMenu.find("span").first().text();

    assert.equal($dropDownMenu.length, 1, "ddAppointment is rendered");

    assert.equal(groupedAppointments.length, 1, "DropDown menu has correct items");
    assert.equal(dropDownMenuText, "1 more", "DropDown menu has correct text");
});

QUnit.test("Full-size appointment count depends on maxAppointmentsPerCell option, Day view, 'auto' mode", function(assert) {
    var items = [ { text: "Task 1", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0), allDay: true },
        { text: "Task 2", startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0), allDay: true },
        { text: "Task 3", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 5, 0), allDay: true },
        { text: "Task 4", startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0), allDay: true },
        { text: "Task 5", startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0), allDay: true } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "day",
            views: [{
                type: "day",
                maxAppointmentsPerCell: 'auto'
            }],
            height: 500,
            dataSource: items
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-all-day-appointment")),
        tableCellWidth = this.instance.$element().find(".dx-scheduler-all-day-table-cell").eq(0).outerWidth(),
        tableCellHeight = this.instance.$element().find(".dx-scheduler-all-day-table-cell").eq(0).outerHeight();

    for(var i = 0; i < 2; i++) {
        var appointmentWidth = $appointment.eq(i).outerWidth(),
            appointmentHeight = $appointment.eq(i).outerHeight();

        assert.roughEqual(appointmentWidth, tableCellWidth, 1.5, "appointment is full-size");
        assert.roughEqual(appointmentHeight, (tableCellHeight - 24) / 2, 1.5, "appointment is full-size");
    }

    var $dropDownMenu = $(this.instance.$element()).find(".dx-scheduler-dropdown-appointments").trigger("dxclick"),
        dropDownMenu = $dropDownMenu.eq(0).dxDropDownMenu("instance"),
        groupedAppointments = dropDownMenu.option("items"),
        dropDownMenuText = $dropDownMenu.find("span").first().text();

    assert.equal($dropDownMenu.length, 1, "ddAppointment is rendered");

    assert.equal(groupedAppointments.length, 3, "DropDown menu has correct items");
    assert.equal(dropDownMenuText, "3 more", "DropDown menu has correct text");
});

QUnit.test("Appointment should have an unchangeable height, Day view, 'auto' mode", function(assert) {
    var items = [ { text: "Task 1", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0), allDay: true } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "day",
            views: [{
                type: "day",
                maxAppointmentsPerCell: 'auto'
            }],
            height: 500,
            dataSource: items
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-all-day-appointment")),
        tableCellHeight = this.instance.$element().find(".dx-scheduler-all-day-table-cell").eq(0).outerHeight(),
        appointmentHeight = (tableCellHeight - 24) / 2;

    assert.roughEqual($appointment.eq(0).outerHeight(), appointmentHeight, 1.5, "appointment has a correct height");

    this.instance.addAppointment({ text: "Task 2", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0), allDay: true });
    $appointment = $(this.instance.$element().find(".dx-scheduler-all-day-appointment"));

    assert.roughEqual($appointment.eq(0).outerHeight(), appointmentHeight, 1.5, "appointment has a correct height");
    assert.roughEqual($appointment.eq(1).outerHeight(), appointmentHeight, 1.5, "appointment has a correct height");
});

QUnit.test("Appointment should have a right top position, Day view, 'auto' mode", function(assert) {
    var items = [ { text: "Task 1", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0), allDay: true } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "day",
            views: [{
                type: "day",
                maxAppointmentsPerCell: 'auto'
            }],
            height: 500,
            dataSource: items
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-all-day-appointment")),
        $header = $(this.instance.$element().find(".dx-scheduler-header"));

    assert.roughEqual($appointment.eq(0).position().top, $header.outerHeight(), 1.5, "appointment has a correct position");

    this.instance.addAppointment({ text: "Task 2", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0), allDay: true });
    $appointment = $(this.instance.$element().find(".dx-scheduler-all-day-appointment"));

    assert.roughEqual($appointment.eq(0).position().top, $header.outerHeight(), 1.5, "appointment has a correct position");
    assert.roughEqual($appointment.eq(1).position().top, $header.outerHeight() + $appointment.outerHeight(), 1.5, "appointment has a correct position");
});

QUnit.test("Full-size appointment count depends on maxAppointmentsPerCell option, Week view, 'unlimited' mode", function(assert) {
    var items = [ { text: "Task 1", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0), allDay: true },
        { text: "Task 2", startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0), allDay: true },
        { text: "Task 3", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 5, 0), allDay: true },
        { text: "Task 4", startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0), allDay: true },
        { text: "Task 5", startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0), allDay: true } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "week",
            views: [{
                type: "week",
                maxAppointmentsPerCell: 'unlimited'
            }],
            height: 500,
            dataSource: items
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-all-day-appointment")),
        tableCellWidth = this.instance.$element().find(".dx-scheduler-all-day-table-cell").eq(0).outerWidth(),
        tableCellHeight = this.instance.$element().find(".dx-scheduler-all-day-table-cell").eq(0).outerHeight();

    for(var i = 0; i < 5; i++) {
        var appointmentWidth = $appointment.eq(i).outerWidth(),
            appointmentHeight = $appointment.eq(i).outerHeight();

        assert.roughEqual(appointmentWidth, tableCellWidth, 1.5, "appointment is full-size");
        assert.roughEqual(appointmentHeight, (tableCellHeight - 10) / 5, 1.5, "appointment is full-size");
    }
});

QUnit.test("One full-size appointment should have a correct height, Week view, 'unlimited' mode", function(assert) {
    var items = [ { text: "Task 1", startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0), allDay: true } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "week",
            views: [{
                type: "week",
                maxAppointmentsPerCell: 'unlimited'
            }],
            height: 500,
            dataSource: items
        }
    );

    var tableCellHeight = this.instance.$element().find(".dx-scheduler-all-day-table-cell").eq(0).outerHeight();

    assert.roughEqual($(this.instance.$element().find(".dx-scheduler-all-day-appointment")).eq(0).outerHeight(), tableCellHeight, 1.5, "appointment height is correct");
});

QUnit.module("Appointment overlapping, timeline view", moduleOptions);

QUnit.test("Full-size appointment count depends on maxAppointmentsPerCell option, 'numeric' mode", function(assert) {
    var items = [ { text: "Task 1", startDate: new Date(2015, 2, 1, 2, 0), endDate: new Date(2015, 2, 1, 4, 0) },
        { text: "Task 2", startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: "Task 3", startDate: new Date(2015, 2, 1, 2, 0), endDate: new Date(2015, 2, 1, 5, 0) },
        { text: "Task 4", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: "Task 5", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) },
        { text: "Task 6", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "timelineWeek",
            views: [{
                type: "timelineWeek",
                maxAppointmentsPerCell: 2
            }],
            height: 500,
            cellDuration: 60,
            dataSource: items
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")),
        tableCellHeight = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerHeight();

    for(var i = 0; i < 3; i++) {
        var appointmentHeight = $appointment.eq(i).outerHeight();

        assert.roughEqual(appointmentHeight, (tableCellHeight - 26) / 2, 1.5, "appointment is full-size");
    }

    var $dropDownMenu = $(this.instance.$element()).find(".dx-scheduler-dropdown-appointments").trigger("dxclick"),
        dropDownMenu = $dropDownMenu.eq(0).dxDropDownMenu("instance"),
        groupedAppointments = dropDownMenu.option("items"),
        dropDownMenuText = $dropDownMenu.find("span").first().text();

    assert.equal($dropDownMenu.length, 2, "ddAppointment is rendered");

    assert.equal(groupedAppointments.length, 2, "DropDown menu has correct items");
    assert.equal(dropDownMenuText, "2 more", "DropDown menu has correct text");
});

QUnit.test("Full-size appointment count depends on maxAppointmentsPerCell option, 'auto' mode", function(assert) {
    var items = [ { text: "Task 1", startDate: new Date(2015, 2, 1, 2, 0), endDate: new Date(2015, 2, 1, 4, 0) },
        { text: "Task 2", startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: "Task 3", startDate: new Date(2015, 2, 1, 2, 0), endDate: new Date(2015, 2, 1, 5, 0) },
        { text: "Task 4", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: "Task 5", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) },
        { text: "Task 6", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "timelineWeek",
            views: [{
                type: "timelineWeek",
                maxAppointmentsPerCell: 'auto'
            }],
            height: 400,
            dataSource: items
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")),
        tableCellHeight = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerHeight();

    for(var i = 0; i < 5; i++) {
        var appointmentHeight = $appointment.eq(i).outerHeight();

        assert.roughEqual(appointmentHeight, (tableCellHeight - 26) / 3, 1.5, "appointment is full-size");
    }

    var $dropDownMenu = $(this.instance.$element()).find(".dx-scheduler-dropdown-appointments").trigger("dxclick"),
        dropDownMenu = $dropDownMenu.eq(0).dxDropDownMenu("instance"),
        groupedAppointments = dropDownMenu.option("items"),
        dropDownMenuText = $dropDownMenu.find("span").first().text();

    assert.equal($dropDownMenu.length, 4, "ddAppointment is rendered");

    assert.equal(groupedAppointments.length, 1, "DropDown menu has correct items");
    assert.equal(dropDownMenuText, "1 more", "DropDown menu has correct text");
});

QUnit.test("Full-size appointment count depends on maxAppointmentsPerCell option, 'auto' mode, narrow height", function(assert) {
    var items = [ { text: "Task 1", startDate: new Date(2015, 2, 1, 2, 0), endDate: new Date(2015, 2, 1, 4, 0) },
        { text: "Task 2", startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: "Task 3", startDate: new Date(2015, 2, 1, 2, 0), endDate: new Date(2015, 2, 1, 5, 0) },
        { text: "Task 4", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: "Task 5", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) },
        { text: "Task 6", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "timelineWeek",
            views: [{
                type: "timelineWeek",
                maxAppointmentsPerCell: 'auto'
            }],
            height: 200,
            dataSource: items
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")),
        tableCellHeight = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerHeight();

    for(var i = 0; i < 2; i++) {
        var appointmentHeight = $appointment.eq(i).outerHeight();

        assert.roughEqual(appointmentHeight, (tableCellHeight - 26), 1.5, "appointment is full-size");
    }

    var $dropDownMenu = $(this.instance.$element()).find(".dx-scheduler-dropdown-appointments").trigger("dxclick"),
        dropDownMenu = $dropDownMenu.eq(0).dxDropDownMenu("instance"),
        groupedAppointments = dropDownMenu.option("items"),
        dropDownMenuText = $dropDownMenu.find("span").first().text();

    assert.equal($dropDownMenu.length, 8, "ddAppointment is rendered");

    assert.equal(groupedAppointments.length, 3, "DropDown menu has correct items");
    assert.equal(dropDownMenuText, "3 more", "DropDown menu has correct text");
});

QUnit.test("Full-size appointment count depends on maxAppointmentsPerCell option, 'unlimited' mode", function(assert) {
    var items = [ { text: "Task 1", startDate: new Date(2015, 2, 1, 2, 0), endDate: new Date(2015, 2, 1, 4, 0) },
        { text: "Task 2", startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: "Task 3", startDate: new Date(2015, 2, 1, 2, 0), endDate: new Date(2015, 2, 1, 5, 0) },
        { text: "Task 4", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: "Task 5", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) },
        { text: "Task 6", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "timelineWeek",
            views: [{
                type: "timelineWeek",
                maxAppointmentsPerCell: 'unlimited'
            }],
            height: 600,
            dataSource: [items[0]]
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")),
        tableCellHeight = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerHeight();

    var appointmentHeight = $appointment.eq(0).outerHeight();
    assert.roughEqual(appointmentHeight, tableCellHeight, 1.5, "appointment is full-size");

    this.instance.option('dataSource', items);
    $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")),
    tableCellHeight = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerHeight();

    for(var i = 0; i < 5; i++) {
        appointmentHeight = $appointment.eq(i).outerHeight();

        assert.roughEqual(appointmentHeight, tableCellHeight / 4, 1.5, "appointment is full-size");
    }

    var $dropDownMenu = $(this.instance.$element()).find(".dx-scheduler-dropdown-appointments");

    assert.equal($dropDownMenu.length, 0, "ddAppointment isn't rendered");
});


QUnit.module("Appointment overlapping, vertical view", moduleOptions);

QUnit.test("Full-size appointment should have minWidth, narrow width", function(assert) {
    var items = [
        { text: "Task 2", startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: "Task 4", startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) }];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "week",
            views: [{
                type: "week"
            }],
            width: 200,
            dataSource: items
        }
    );

    var $appointments = $(this.instance.$element()).find(".dx-scheduler-appointment");

    assert.equal($appointments.eq(0).get(0).getBoundingClientRect().width, 5, "Appointment has min width");
    assert.equal($appointments.eq(1).get(0).getBoundingClientRect().width, 5, "Appointment has min width");
});

QUnit.test("Full-size appointment count depends on maxAppointmentsPerCell option, 'auto' mode, narrow width", function(assert) {
    var items = [
        { text: "Task 2", startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: "Task 4", startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) }];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "week",
            views: [{
                type: "week",
                maxAppointmentsPerCell: 'auto'
            }],
            width: 300,
            dataSource: items
        }
    );

    var $dropDownMenu = $(this.instance.$element()).find(".dx-scheduler-dropdown-appointments").trigger("dxclick"),
        dropDownMenu = $dropDownMenu.eq(0).dxDropDownMenu("instance"),
        groupedAppointments = dropDownMenu.option("items"),
        dropDownMenuText = $dropDownMenu.find("span").first().text();

    assert.equal($dropDownMenu.length, 1, "ddAppointment is rendered");

    assert.equal(groupedAppointments.length, 1, "DropDown menu has correct items");
    assert.equal(dropDownMenuText, "1", "DropDown menu has correct text");
});

QUnit.test("Full-size appointment count depends on maxAppointmentsPerCell option, 'numeric' mode", function(assert) {
    var items = [
        { text: "Task 2", startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: "Task 4", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: "Task 5", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) },
        { text: "Task 6", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "week",
            views: [{
                type: "week",
                maxAppointmentsPerCell: 3
            }],
            height: 500,
            dataSource: items
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")),
        tableCellWidth = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerWidth();

    for(var i = 0; i < 2; i++) {
        var appointmentWidth = $appointment.eq(i).outerWidth();

        assert.roughEqual(appointmentWidth, (tableCellWidth - 26) / 3, 1.5, "appointment is full-size");
    }

    var $dropDownMenu = $(this.instance.$element()).find(".dx-scheduler-dropdown-appointments").trigger("dxclick"),
        dropDownMenu = $dropDownMenu.eq(0).dxDropDownMenu("instance"),
        groupedAppointments = dropDownMenu.option("items"),
        dropDownMenuText = $dropDownMenu.find("span").first().text();

    assert.equal($dropDownMenu.length, 1, "ddAppointment is rendered");

    assert.equal(groupedAppointments.length, 1, "DropDown menu has correct items");
    assert.equal(dropDownMenuText, "1", "DropDown menu has correct text");
});

QUnit.test("Full-size appointment should have correct size, 'auto' mode", function(assert) {
    var items = [
        { text: "Task 2", startDate: new Date(2015, 2, 4, 0, 0), endDate: new Date(2015, 2, 4, 2, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "day",
            views: ["day"],
            height: 600,
            width: 1500,
            dataSource: items
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")).eq(0),
        tableCellWidth = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerWidth(),
        appointmentWidth = $appointment.outerWidth(),
        offset = getOffset();

    assert.roughEqual(appointmentWidth, tableCellWidth - offset, 1.5, "appointment is full-size");
});

QUnit.test("Full-size appointment count depends on maxAppointmentsPerCell and width option, 'auto' mode", function(assert) {
    var items = [
        { text: "Task 2", startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: "Task 4", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: "Task 5", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) },
        { text: "Task 6", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "week",
            views: [{
                type: "week",
                maxAppointmentsPerCell: 'auto'
            }],
            height: 600,
            width: 1600,
            dataSource: items
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")),
        tableCellWidth = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerWidth(),
        appointmentWidth;

    for(var i = 0; i < 2; i++) {
        appointmentWidth = $appointment.eq(i).outerWidth();

        assert.roughEqual(appointmentWidth, (tableCellWidth - 26) / 3, 1.5, "appointment is full-size");
    }

    var $dropDownMenu = $(this.instance.$element()).find(".dx-scheduler-dropdown-appointments").trigger("dxclick"),
        dropDownMenu = $dropDownMenu.eq(0).dxDropDownMenu("instance"),
        groupedAppointments = dropDownMenu.option("items"),
        dropDownMenuText = $dropDownMenu.find("span").first().text();

    assert.equal($dropDownMenu.length, 1, "ddAppointment is rendered");
    assert.equal(groupedAppointments.length, 1, "DropDown menu has correct items");
    assert.equal(dropDownMenuText, "1", "DropDown menu has correct text");

    this.instance.option("width", 900);

    $appointment = $(this.instance.$element().find(".dx-scheduler-appointment"));
    tableCellWidth = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerWidth();
    appointmentWidth = $appointment.eq(0).outerWidth();

    assert.roughEqual(appointmentWidth, tableCellWidth - 26, 1.5, "One appointment is full-size");

    $dropDownMenu = $(this.instance.$element()).find(".dx-scheduler-dropdown-appointments").trigger("dxclick");
    dropDownMenu = $dropDownMenu.eq(0).dxDropDownMenu("instance");
    groupedAppointments = dropDownMenu.option("items");
    dropDownMenuText = $dropDownMenu.find("span").first().text();

    assert.equal($dropDownMenu.length, 1, "ddAppointment is rendered");
    assert.equal(groupedAppointments.length, 3, "DropDown menu has correct items");
    assert.equal(dropDownMenuText, "3", "DropDown menu has correct text");
});

QUnit.test("DropDown appointments button should have correct width on week view", function(assert) {
    var items = [
        { text: "Task 2", startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: "Task 4", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: "Task 5", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) },
        { text: "Task 6", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "week",
            views: [{
                type: "week",
                maxAppointmentsPerCell: 'auto'
            }],
            height: 600,
            width: 1500,
            dataSource: items
        }
    );

    var $dropDownMenu = $(this.instance.$element()).find(".dx-scheduler-dropdown-appointments");

    assert.roughEqual($dropDownMenu.outerWidth(), 24, 0.5, "ddAppointment has correct width");
});

QUnit.test("Full-size appointment count depends on maxAppointmentsPerCell option, 'unlimited' mode", function(assert) {
    var items = [
        { text: "Task 2", startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: "Task 4", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: "Task 5", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) },
        { text: "Task 6", startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "week",
            views: [{
                type: "week",
                maxAppointmentsPerCell: 'unlimited'
            }],
            height: 600,
            dataSource: items
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment")),
        tableCellWidth = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerWidth();

    for(var i = 0; i < 4; i++) {
        var appointmentWidth = $appointment.eq(i).outerWidth();

        assert.roughEqual(appointmentWidth, tableCellWidth / 4, 1.5, "appointment is full-size");
    }

    var $dropDownMenu = $(this.instance.$element()).find(".dx-scheduler-dropdown-appointments");

    assert.equal($dropDownMenu.length, 0, "ddAppointment isn't rendered");
});

QUnit.test("Appointments should not have specific class if maxAppointmentsPerCell=null", function(assert) {
    var items = [
        { text: "Task 2", startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) }];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: "week",
            width: 800,
            views: [{
                type: "week",
                maxAppointmentsPerCell: null
            }],
            height: 600,
            dataSource: items
        }
    );

    var $appointment = $(this.instance.$element().find(".dx-scheduler-appointment"));
    assert.ok(!$appointment.eq(0).hasClass("dx-scheduler-appointment-empty"), "appointment has not the class");
});

QUnit.test("_isAppointmentEmpty should work correctly in different strategies", function(assert) {
    this.createInstance({
        views: ["timelineDay", "week"],
        currentView: "timelineDay"
    });

    let renderingStrategy = this.instance.getRenderingStrategyInstance();

    assert.ok(renderingStrategy._isAppointmentEmpty(34, 41), "Appointment is empty");
    assert.notOk(renderingStrategy._isAppointmentEmpty(36, 41), "Appointment isn't empty");

    this.instance.option("currentView", "week");

    assert.ok(renderingStrategy._isAppointmentEmpty(34, 39), "Appointment is empty");
    assert.notOk(renderingStrategy._isAppointmentEmpty(36, 41), "Appointment isn't empty");

    this.instance.option("currentView", "month");

    assert.ok(renderingStrategy._isAppointmentEmpty(19, 50), "Appointment is empty");
    assert.notOk(renderingStrategy._isAppointmentEmpty(36, 41), "Appointment isn't empty");
});

QUnit.test("Long term appoinment inflict index shift in other appointments (T737780)", function(assert) {
    var data = [
        {
            text: "Website Re-Design Plan",
            startDate: new Date(2017, 4, 2, 9, 30),
            endDate: new Date(2017, 4, 12, 11, 30)
        }, {
            text: "Book Flights to San Fran for Sales Trip",
            startDate: new Date(2017, 4, 4, 12, 0),
            endDate: new Date(2017, 4, 4, 13, 0),
            allDay: true
        }, {
            text: "Approve Personal Computer Upgrade Plan",
            startDate: new Date(2017, 4, 10, 10, 0),
            endDate: new Date(2017, 4, 10, 11, 0)
        }
    ];

    this.createInstance({
        dataSource: data,
        views: ["month"],
        currentView: "month",
        currentDate: new Date(2017, 4, 25),
        startDayHour: 9,
        height: 600
    });
    let appointments = this.instance._getAppointmentsToRepaint();
    assert.ok(appointments[0].settings[1].index === 0, "Long term appointment tail has right index");
    assert.ok(appointments[1].settings[0].index === 1, "Appointment next to long term appointment head has right index");
    assert.ok(appointments[2].settings[0].index === 1, "Appointment next to long term appointment tail has right index");
});
