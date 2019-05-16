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
        '<div id="scheduler"></div>');
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

        this.renderDropDownAppointmentsContainer = function(items, options) {
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
        var $dropDownMenu = this.renderDropDownAppointmentsContainer();
        assert.ok($dropDownMenu.hasClass("dx-scheduler-appointment-collector"), "Container is rendered");
        assert.ok($dropDownMenu.dxButton("instance"), "Container is button");
    });

    QUnit.test("Appointment collector should be painted", (assert) => {
        this.color = "#0000ff";
        var $dropDownMenu = this.renderDropDownAppointmentsContainer();

        assert.equal(new Color($dropDownMenu.css("backgroundColor")).toHex(), this.color, "Color is OK");
    });

    QUnit.test("Appointment collector should not be painted if items have different colors", (assert) => {
        this.color = "#0000ff";
        var $dropDownMenu = this.renderDropDownAppointmentsContainer({
            data: [
                { text: "a", startDate: new Date(2015, 1, 1) },
                { text: "b", startDate: new Date(2015, 1, 1) }
            ],
            colors: ["#fff000", "#000fff"]
        });

        assert.notEqual(new Color($dropDownMenu.css("backgroundColor")).toHex(), this.color, "Color is OK");
    });

    QUnit.test("Appointment collector should have a correct markup", (assert) => {
        var $button = this.renderDropDownAppointmentsContainer(),
            $dropDownAppointmentsContent = $button.find(".dx-scheduler-appointment-collector-content");

        assert.equal($dropDownAppointmentsContent.length, 1, "Content is OK");
        assert.equal($dropDownAppointmentsContent.html().toLowerCase(), "<span>1 more</span>", "Markup is OK");
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


