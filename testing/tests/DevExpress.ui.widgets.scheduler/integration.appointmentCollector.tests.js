import $ from "jquery";
import translator from "animation/translator";
import fx from "animation/fx";
import { SchedulerTestWrapper } from "./helpers.js";
import themes from "ui/themes";
import { CompactAppointmentsHelper } from "ui/scheduler/compactAppointmentsHelper";
import Widget from "ui/widget/ui.widget";
import Color from "color";

import "ui/scheduler/ui.scheduler";
import "common.css!";
import "generic_light.css!";

QUnit.testStart(() => {
    $("#qunit-fixture").html(
        '<div id="ddAppointments"></div>\
        <div id="scheduler"></div>');
});

const ADAPTIVE_COLLECTOR_DEFAULT_SIZE = 28;
const ADAPTIVE_COLLECTOR_BOTTOM_OFFSET = 40;
const ADAPTIVE_COLLECTOR_RIGHT_OFFSET = 5;
const COMPACT_THEME_ADAPTIVE_COLLECTOR_RIGHT_OFFSET = 1;

QUnit.module("Integration: Appointments Collector Base Tests", {
    beforeEach: () => {
        fx.off = true;

        this.editing = true;
        this.rtlEnabled = false;
        this.buttonWidth = 200;
        this.color;

        this.widgetMock = new (Widget.inherit({
            option: function(options) {
                if(options === "appointmentCollectorTemplate") {
                    return "appointmentCollector";
                }
                return this.callBase(options);
            },
            _getAppointmentTemplate: function(template) {
                return this._getTemplateByOption(template);
            }
        }))($("<div>"));

        this.renderAppointmentsCollectorContainer = (items, options) => {
            const helper = new CompactAppointmentsHelper(this.widgetMock);
            items = items || { data: [{ text: "a", startDate: new Date(2015, 1, 1) }], colors: [] };
            return helper.render($.extend(options, {
                $container: $("#ddAppointments"),
                coordinates: { top: 0, left: 0 },
                items: items,
                buttonWidth: this.buttonWidth,
                buttonColor: $.Deferred().resolve(this.color)
            }));
        };
    },
    afterEach: () => {
        fx.off = false;
    }
}, () => {
    QUnit.test("Appointment collector should be rendered with right class", (assert) => {
        var $collector = this.renderAppointmentsCollectorContainer();
        assert.ok($collector.hasClass("dx-scheduler-appointment-collector"), "Container is rendered");
        assert.ok($collector.dxButton("instance"), "Container is button");
    });

    QUnit.test("Appointment collector should be painted", (assert) => {
        this.color = "#0000ff";
        var $collector = this.renderAppointmentsCollectorContainer();

        assert.equal(new Color($collector.css("backgroundColor")).toHex(), this.color, "Color is OK");
    });

    QUnit.test("Appointment collector should not be painted if items have different colors", (assert) => {
        this.color = "#0000ff";
        var $collector = this.renderAppointmentsCollectorContainer({
            data: [
                { text: "a", startDate: new Date(2015, 1, 1) },
                { text: "b", startDate: new Date(2015, 1, 1) }
            ],
            colors: ["#fff000", "#000fff"]
        });

        assert.notEqual(new Color($collector.css("backgroundColor")).toHex(), this.color, "Color is OK");
    });

    QUnit.test("Appointment collector should have a correct markup", (assert) => {
        var $button = this.renderAppointmentsCollectorContainer(),
            $collectorContent = $button.find(".dx-scheduler-appointment-collector-content");

        assert.equal($collectorContent.length, 1, "Content is OK");
        assert.equal($collectorContent.html().toLowerCase(), "<span>1 more</span>", "Markup is OK");
    });
});

QUnit.module("Integration: Appointments Collector, adaptivityEnabled = false", {
    beforeEach: () => {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
        this.tasks = [
            { startDate: new Date(2019, 2, 4), text: "a", endDate: new Date(2019, 2, 4, 0, 30) },
            { startDate: new Date(2019, 2, 4), text: "b", endDate: new Date(2019, 2, 4, 0, 30) },
            { startDate: new Date(2019, 2, 4), text: "c", endDate: new Date(2019, 2, 4, 0, 30) },
            { startDate: new Date(2019, 2, 4), text: "d", endDate: new Date(2019, 2, 4, 0, 30) },
            { startDate: new Date(2019, 2, 4), text: "e", endDate: new Date(2019, 2, 4, 0, 30) },
            { startDate: new Date(2019, 2, 4), text: "f", endDate: new Date(2019, 2, 4, 0, 30) }
        ];
        this.createInstance = (options) => {
            this.instance = $("#scheduler").dxScheduler($.extend({
                dataSource: this.tasks,
                views: ["month", "week"],
                width: 840,
                currentView: "month",
                height: 1000,
                currentDate: new Date(2019, 2, 4),
                onContentReady: () => {
                    this.scheduler = new SchedulerTestWrapper(this.instance);
                }
            }, options)).dxScheduler("instance");
        };
    },
    afterEach: () => {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.test("Appointment collector should have correct coordinates on month view", (assert) => {
        this.createInstance();

        assert.equal(this.scheduler.appointments.compact.getButtonCount(), 0, "Collector wasn't rendered");
        assert.equal(this.scheduler.appointments.getAppointmentCount(), 6, "Six appointments were rendered");

        this.instance.addAppointment({ startDate: new Date(2019, 2, 4), text: "d", endDate: new Date(2019, 2, 4, 0, 30) });

        assert.equal(this.scheduler.appointments.compact.getButtonCount(), 1, "Collector was rendered");
        assert.equal(this.scheduler.appointments.getAppointmentCount(), 6, "Five appointments were rendered");

        let $collector = this.scheduler.appointments.compact.getButton(0);

        let collectorCoordinates = translator.locate($collector);
        let expectedCoordinates = this.scheduler.workSpace.getCell(8).position();

        assert.roughEqual(collectorCoordinates.left, expectedCoordinates.left, 1.001, "Left coordinate is OK");
        assert.roughEqual(collectorCoordinates.top, expectedCoordinates.top, 1.001, "Top coordinate is OK");
    });

    QUnit.test("Appointment collector should have correct size in material theme", (assert) => {
        const origIsMaterial = themes.isMaterial;

        try {
            themes.isMaterial = () => true;

            this.createInstance({
                currentDate: new Date(2019, 2, 4),
                views: ["month"],
                width: 840,
                height: 500,
                dataSource: this.tasks,
                currentView: "month",
                firstDayOfWeek: 1
            });

            assert.roughEqual(this.scheduler.appointments.compact.getButtonWidth(), 63, 1, "Collector width is ok");
            assert.roughEqual(this.scheduler.appointments.compact.getButtonHeight(), 20, 1, "Collector height is ok");
        } finally {
            themes.isMaterial = origIsMaterial;
        }
    });

    QUnit.test("DropDown appointment button should have correct coordinates on weekView, not in allDay panel", (assert) => {
        const WEEK_VIEW_BUTTON_OFFSET = 5;

        this.createInstance({
            currentDate: new Date(2019, 2, 4),
            views: ["week"],
            width: 840,
            currentView: "week",
            firstDayOfWeek: 1,
            maxAppointmentsPerCell: 1,
            dataSource: [
                { startDate: new Date(2019, 2, 6), text: "a", endDate: new Date(2019, 2, 6, 0, 30) },
                { startDate: new Date(2019, 2, 6), text: "b", endDate: new Date(2019, 2, 6, 0, 30) }
            ]
        });

        let $collector = this.scheduler.appointments.compact.getButton(0);
        let collectorWidth = this.scheduler.appointments.compact.getButtonWidth(0);
        let collectorCoordinates = translator.locate($collector);
        let expectedCoordinates = this.scheduler.workSpace.getCell(2).position();
        let cellWidth = this.scheduler.workSpace.getCell(2).outerWidth();

        assert.equal(this.scheduler.appointments.compact.getButtonCount(), 1, "Collector was rendered");
        assert.roughEqual(collectorCoordinates.left, expectedCoordinates.left + cellWidth - collectorWidth - WEEK_VIEW_BUTTON_OFFSET, 1.001, "Left coordinate is OK");
        assert.roughEqual(collectorCoordinates.top, expectedCoordinates.top, 1.001, "Top coordinate is OK");
    });

    QUnit.test("Appointment collector should have correct size when intervalCount is set", (assert) => {
        this.createInstance({
            views: [{ type: "month", intervalCount: 2 }],
            width: 850,
            maxAppointmentsPerCell: 2,
            currentView: "month",
            firstDayOfWeek: 1
        });

        this.instance.option("dataSource", [
            { startDate: new Date(2019, 2, 4), text: "a", endDate: new Date(2019, 2, 4, 0, 30) },
            { startDate: new Date(2019, 2, 4), text: "b", endDate: new Date(2019, 2, 4, 0, 30) },
            { startDate: new Date(2019, 2, 4), text: "c", endDate: new Date(2019, 2, 4, 0, 30) },
            { startDate: new Date(2019, 2, 4), text: "d", endDate: new Date(2019, 2, 4, 0, 30) },
            { startDate: new Date(2019, 2, 4), text: "e", endDate: new Date(2019, 2, 4, 0, 30) },
            { startDate: new Date(2019, 2, 4), text: "f", endDate: new Date(2019, 2, 4, 0, 30) }
        ]);

        let cellWidth = this.scheduler.workSpace.getCell(0).outerWidth();

        assert.roughEqual(this.scheduler.appointments.compact.getButtonWidth(), cellWidth - 60, 1.5, "Collector width is ok");

        this.instance.option("views", ["month"]);

        assert.roughEqual(this.scheduler.appointments.compact.getButtonWidth(), cellWidth - 36, 1, "Collector width is ok");
        assert.roughEqual(this.scheduler.appointments.compact.getButtonHeight(), 20, 1, "Collector height is ok");
    });

    QUnit.test("Appointment collector count should be ok when there are multiday appointments", (assert) => {
        this.createInstance({
            views: ['month'],
            currentView: 'month',
            currentDate: new Date(2019, 8, 20),
            width: 470,
            height: 650
        });

        this.instance.option("dataSource", [
            { text: 'a', startDate: new Date(2019, 8, 14), endDate: new Date(2019, 8, 15) },
            { text: 'b', startDate: new Date(2019, 8, 14), endDate: new Date(2019, 8, 15) },
            { text: 'c', startDate: new Date(2019, 8, 12), endDate: new Date(2019, 8, 15) },
            { text: 'd', startDate: new Date(2019, 8, 12), endDate: new Date(2019, 8, 15) },
            { text: 'e', startDate: new Date(2019, 8, 12), endDate: new Date(2019, 8, 15) },
            { text: 'f', startDate: new Date(2019, 8, 12), endDate: new Date(2019, 8, 15) }
        ]);

        assert.equal(this.scheduler.appointments.compact.getButtonCount(), 3, "Collectors count is ok");
    });

    QUnit.test("Many dropDown appts with one multi day task should be grouped correctly", (assert) => {
        this.createInstance({
            views: ['month'],
            currentView: 'month',
            currentDate: new Date(2019, 4, 29),
            width: 800,
            height: 500
        });
        this.clock.tick(300);
        this.instance.focus();

        this.instance.option("dataSource", [
            { text: '1', startDate: new Date(2019, 4, 29), endDate: new Date(2019, 4, 29, 1) },
            { text: '2', startDate: new Date(2019, 4, 29), endDate: new Date(2019, 4, 29, 1) },
            { text: '3', startDate: new Date(2019, 4, 29), endDate: new Date(2019, 4, 29, 1) },
            { text: '4', startDate: new Date(2019, 4, 29), endDate: new Date(2019, 4, 29, 1) },
            { text: '5', startDate: new Date(2019, 4, 29), endDate: new Date(2019, 4, 29, 1) },
            { text: '6', startDate: new Date(2019, 4, 29), endDate: new Date(2019, 4, 29, 1) },
            { text: '7', startDate: new Date(2019, 4, 29), endDate: new Date(2019, 4, 29, 1) },
            { text: '8', startDate: new Date(2019, 4, 29), endDate: new Date(2019, 4, 29, 1) },
            { text: 'long appt', startDate: new Date(2019, 4, 29), endDate: new Date(2019, 4, 31, 1) }
        ]);

        this.scheduler.appointments.compact.click(0);
        this.clock.tick(300);
        assert.equal(this.scheduler.tooltip.getItemCount(), 8, "There are 8 collapsed appts");
    });

    QUnit.test("Many collapsed appts should be grouped correctly with one multi day task which started before collector (T525443)", (assert) => {
        this.createInstance({
            views: ['month'],
            currentView: 'month',
            maxAppointmentsPerCell: 1,
            currentDate: new Date(2019, 5, 25),
            width: 800,
            height: 950
        });
        this.clock.tick(300);
        this.instance.focus();

        this.instance.option("dataSource", [
            { text: 'long appt', startDate: new Date(2019, 5, 8, 9, 0), endDate: new Date(2019, 5, 20, 9, 15) },
            { text: '1', startDate: new Date(2019, 5, 11, 9, 30), endDate: new Date(2019, 5, 11, 11, 30) },
            { text: '2', startDate: new Date(2019, 5, 11, 12, 0), endDate: new Date(2019, 5, 11, 13, 0) },
            { text: '3', startDate: new Date(2019, 5, 11, 12, 0), endDate: new Date(2019, 5, 11, 13, 0) },
            { text: '4', startDate: new Date(2019, 5, 11, 8, 0), endDate: new Date(2019, 5, 11, 23, 59) },
            { text: '5', startDate: new Date(2019, 5, 11, 9, 45), endDate: new Date(2019, 5, 11, 11, 15) },
            { text: '6', startDate: new Date(2019, 5, 11, 11, 0), endDate: new Date(2019, 5, 11, 12, 0) },
            { text: '7', startDate: new Date(2019, 5, 11, 11, 0), endDate: new Date(2019, 5, 11, 13, 30) },
            { text: '8', startDate: new Date(2019, 5, 11, 14, 0), endDate: new Date(2019, 5, 11, 15, 30) },
            { text: '9', startDate: new Date(2019, 5, 11, 14, 0), endDate: new Date(2019, 5, 11, 15, 30) },
            { text: '10', startDate: new Date(2019, 5, 11, 14, 0), endDate: new Date(2019, 5, 11, 15, 30) },
            { text: '11', startDate: new Date(2019, 5, 11, 14, 0), endDate: new Date(2019, 5, 11, 15, 30) },
            { text: '12', startDate: new Date(2019, 5, 11, 14, 0), endDate: new Date(2019, 5, 11, 15, 30) },
            { text: '13', startDate: new Date(2019, 5, 11, 14, 30), endDate: new Date(2019, 5, 11, 16, 0) }
        ]);

        this.scheduler.appointments.compact.click(0);
        this.clock.tick(300);
        assert.equal(this.scheduler.tooltip.getItemCount(), 13, "There are 13 drop down appts");
    });
});

QUnit.module("Integration: Appointments Collector, adaptivityEnabled = true", {
    beforeEach: () => {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
        this.tasks = [
            { startDate: new Date(2019, 2, 4), text: "a", endDate: new Date(2019, 2, 4, 0, 30) },
            { startDate: new Date(2019, 2, 4), text: "b", endDate: new Date(2019, 2, 4, 0, 30) },
            { startDate: new Date(2019, 2, 4), text: "c", endDate: new Date(2019, 2, 4, 0, 30) },
            { startDate: new Date(2019, 2, 4), text: "d", endDate: new Date(2019, 2, 4, 0, 30) },
            { startDate: new Date(2019, 2, 4), text: "e", endDate: new Date(2019, 2, 4, 0, 30) },
            { startDate: new Date(2019, 2, 4), text: "f", endDate: new Date(2019, 2, 4, 0, 30) }
        ];
        this.createInstance = (options) => {
            this.instance = $("#scheduler").dxScheduler($.extend(options, {
                height: 800,
                dataSource: this.tasks,
                adaptivityEnabled: true,
                views: ["month", "week"],
                width: 840,
                currentView: "month",
                currentDate: new Date(2019, 2, 4)
            })).dxScheduler("instance");
        };
        this.scheduler = new SchedulerTestWrapper(this.instance);
    },
    afterEach: () => {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.test("There are no ordinary appointments on adaptive month view", (assert) => {
        this.createInstance();

        assert.equal(this.scheduler.appointments.compact.getButtonCount(), 1, "Collector is rendered");
        assert.equal(this.scheduler.appointments.getAppointmentCount(), 0, "Appointments are not rendered");

        this.instance.option("dataSource", [{ startDate: new Date(2019, 2, 4), text: "a", endDate: new Date(2019, 2, 4, 0, 30) }]);

        assert.equal(this.scheduler.appointments.compact.getButtonCount(), 1, "Collector is rendered");
        assert.equal(this.scheduler.appointments.getAppointmentCount(), 0, "Appointments are not rendered");
    });

    QUnit.test("There are no ordinary appointments on adaptive week view allDay panel", (assert) => {
        this.createInstance();

        this.instance.option("dataSource", [{ startDate: new Date(2019, 2, 4), text: "a", endDate: new Date(2019, 2, 4, 0, 30), allDay: true }]);
        this.instance.option("currentView", "week");

        assert.equal(this.scheduler.appointments.compact.getButtonCount(), 1, "Collector is rendered");
        assert.equal(this.scheduler.appointments.getAppointmentCount(), 0, "Appointments are not rendered");
    });

    QUnit.test("Adaptive collector should have correct coordinates", (assert) => {
        this.createInstance();

        let $collector = this.scheduler.appointments.compact.getButton(0);

        let buttonCoordinates = translator.locate($collector);
        let expectedCoordinates = this.scheduler.workSpace.getCell(8).position();

        assert.roughEqual(buttonCoordinates.left, expectedCoordinates.left + (this.scheduler.workSpace.getCellWidth() - ADAPTIVE_COLLECTOR_DEFAULT_SIZE) / 2, 1.001, "Left coordinate is OK");
        assert.roughEqual(buttonCoordinates.top, expectedCoordinates.top + this.scheduler.workSpace.getCellHeight() - ADAPTIVE_COLLECTOR_BOTTOM_OFFSET, 1.001, "Top coordinate is OK");
    });

    QUnit.test("Adaptive collector should have correct sizes", (assert) => {
        this.createInstance();

        let $collector = this.scheduler.appointments.compact.getButton(0);

        assert.roughEqual($collector.outerWidth(), ADAPTIVE_COLLECTOR_DEFAULT_SIZE, 1.001, "Width is OK");
        assert.roughEqual($collector.outerHeight(), ADAPTIVE_COLLECTOR_DEFAULT_SIZE, 1.001, "Height is OK");
    });

    QUnit.test("Adaptive collector should have correct size in material theme", (assert) => {
        const origIsMaterial = themes.isMaterial;
        themes.isMaterial = () => true;

        this.createInstance();
        let $collector = this.scheduler.appointments.compact.getButton(0);

        assert.roughEqual($collector.outerWidth(), ADAPTIVE_COLLECTOR_DEFAULT_SIZE, 1.001, "Width is OK");
        assert.roughEqual($collector.outerHeight(), ADAPTIVE_COLLECTOR_DEFAULT_SIZE, 1.001, "Height is OK");

        themes.isMaterial = origIsMaterial;
    });

    QUnit.test("Adaptive collector should have correct coordinates on allDay panel", (assert) => {
        this.createInstance();

        this.instance.option("dataSource", [{ startDate: new Date(2019, 2, 4), text: "a", endDate: new Date(2019, 2, 4, 0, 30), allDay: true }]);
        this.instance.option("currentView", "week");

        let $collector = this.scheduler.appointments.compact.getButton(0);

        let buttonCoordinates = translator.locate($collector);
        let expectedCoordinates = this.scheduler.workSpace.getAllDayCell(1).position();

        assert.roughEqual(buttonCoordinates.left, expectedCoordinates.left + (this.scheduler.workSpace.getAllDayCellWidth() - ADAPTIVE_COLLECTOR_DEFAULT_SIZE) / 2, 1.001, "Left coordinate is OK");
        assert.roughEqual(buttonCoordinates.top, (this.scheduler.workSpace.getAllDayCellHeight() - ADAPTIVE_COLLECTOR_DEFAULT_SIZE) / 2, 1.001, "Top coordinate is OK");
    });

    QUnit.test("Adaptive collector should have correct sizes on allDayPanel", (assert) => {
        this.createInstance();

        this.instance.option("dataSource", [{ startDate: new Date(2019, 2, 4), text: "a", endDate: new Date(2019, 2, 4, 0, 30), allDay: true }]);
        this.instance.option("currentView", "week");

        let $collector = this.scheduler.appointments.compact.getButton(0);

        assert.roughEqual($collector.outerWidth(), ADAPTIVE_COLLECTOR_DEFAULT_SIZE, 1.001, "Width is OK");
        assert.roughEqual($collector.outerHeight(), ADAPTIVE_COLLECTOR_DEFAULT_SIZE, 1.001, "Height is OK");
    });

    QUnit.test("Ordinary appointment count depends on scheduler width on week view", (assert) => {
        this.createInstance();

        this.instance.option("dataSource", [{ startDate: new Date(2019, 2, 4), text: "a", endDate: new Date(2019, 2, 4, 0, 30) }, { startDate: new Date(2019, 2, 4), text: "b", endDate: new Date(2019, 2, 4, 0, 30) }]);
        this.instance.option("currentView", "week");

        assert.equal(this.scheduler.appointments.compact.getButtonCount(), 1, "Collector is rendered");
        assert.equal(this.scheduler.appointments.getAppointmentCount(), 1, "Appointment is rendered");

        this.instance.option("width", 200);

        assert.equal(this.scheduler.appointments.compact.getButtonCount(), 1, "Collector is rendered");
        assert.equal(this.scheduler.appointments.getAppointmentCount(), 0, "Appointment isn't rendered");

        this.instance.option("width", 1000);

        assert.equal(this.scheduler.appointments.compact.getButtonCount(), 0, "Collector isn't rendered");
        assert.equal(this.scheduler.appointments.getAppointmentCount(), 2, "Appointments are rendered");
    });

    QUnit.test("Ordinary appointments should have correct sizes on week view", (assert) => {
        this.createInstance();

        this.instance.option("dataSource", [{ startDate: new Date(2019, 2, 4), text: "a", endDate: new Date(2019, 2, 4, 0, 30) }, { startDate: new Date(2019, 2, 4), text: "b", endDate: new Date(2019, 2, 4, 0, 30) }]);
        this.instance.option("currentView", "week");

        let $appointment = this.scheduler.appointments.getAppointment(0);

        assert.roughEqual($appointment.outerWidth(), 70, 1.001, "Width is OK");
        assert.roughEqual($appointment.outerHeight(), 50, 1.001, "Height is OK");

        this.instance.option("width", 1000);

        let $firstAppointment = this.scheduler.appointments.getAppointment(0);
        let $secondAppointment = this.scheduler.appointments.getAppointment(1);

        assert.roughEqual($firstAppointment.outerWidth(), 46.5, 1.001, "Width is OK");
        assert.roughEqual($firstAppointment.outerHeight(), 50, 1.001, "Height is OK");

        assert.roughEqual($secondAppointment.outerWidth(), 46.5, 1.001, "Width is OK");
        assert.roughEqual($secondAppointment.outerHeight(), 50, 1.001, "Height is OK");
    });

    QUnit.test("Adaptive collector should have correct coordinates on week view", (assert) => {
        this.createInstance();

        this.instance.option("dataSource", [{ startDate: new Date(2019, 2, 4), text: "a", endDate: new Date(2019, 2, 4, 0, 30) }, { startDate: new Date(2019, 2, 4), text: "b", endDate: new Date(2019, 2, 4, 0, 30) }]);
        this.instance.option("currentView", "week");

        let $collector = this.scheduler.appointments.compact.getButton(0);

        let collectorCoordinates = translator.locate($collector);
        let expectedCoordinates = this.scheduler.workSpace.getCell(1).position();

        assert.roughEqual(collectorCoordinates.left, expectedCoordinates.left + this.scheduler.workSpace.getCellWidth() - ADAPTIVE_COLLECTOR_DEFAULT_SIZE - ADAPTIVE_COLLECTOR_RIGHT_OFFSET, 1.001, "Left coordinate is OK");
        assert.roughEqual(collectorCoordinates.top, expectedCoordinates.top, 1.001, "Top coordinate is OK");
    });

    QUnit.test("Adaptive collector should have correct coordinates coordinates on week view in compact theme", (assert) => {
        try {
            this.themeMock = sinon.stub(themes, "current").returns("generic.light.compact");
            this.createInstance();
            this.instance.option("currentView", "week");

            let $collector = this.scheduler.appointments.compact.getButton(0);

            let collectorCoordinates = translator.locate($collector);
            let expectedCoordinates = this.scheduler.workSpace.getCell(1).position();

            assert.roughEqual(collectorCoordinates.left, expectedCoordinates.left + this.scheduler.workSpace.getCellWidth() - ADAPTIVE_COLLECTOR_DEFAULT_SIZE - COMPACT_THEME_ADAPTIVE_COLLECTOR_RIGHT_OFFSET, 1.001, "Left coordinate is OK");
            assert.roughEqual(collectorCoordinates.top, expectedCoordinates.top, 1.001, "Top coordinate is OK");
        } finally {
            this.themeMock.restore();
        }
    });

    QUnit.test("Adaptive collector should have correct sizes on week view", (assert) => {
        this.createInstance();

        this.instance.option("dataSource", [{ startDate: new Date(2019, 2, 4), text: "a", endDate: new Date(2019, 2, 4, 0, 30) }, { startDate: new Date(2019, 2, 4), text: "b", endDate: new Date(2019, 2, 4, 0, 30) }]);
        this.instance.option("currentView", "week");

        let $collector = this.scheduler.appointments.compact.getButton(0);

        assert.roughEqual($collector.outerWidth(), ADAPTIVE_COLLECTOR_DEFAULT_SIZE, 1.001, "Width is OK");
        assert.roughEqual($collector.outerHeight(), ADAPTIVE_COLLECTOR_DEFAULT_SIZE, 1.001, "Height is OK");
    });
});


