import $ from "jquery";
import translator from "animation/translator";
import fx from "animation/fx";
import { SchedulerTestWrapper } from "./helpers.js";

import "ui/scheduler/ui.scheduler";
import "common.css!";
import "generic_light.css!";

QUnit.testStart(() => {
    $("#qunit-fixture").html(
        '<div id="scheduler"></div>');
});

const ADAPTIVE_DROP_DOWN_BUTTON_DEFAULT_SIZE = 28;
const DROP_DOWN_BUTTON_ADAPTIVE_BOTTOM_OFFSET = 40;

QUnit.module("Integration: DropDownAppointments, adaptivityEnabled = true", {
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

        assert.equal(this.scheduler.appointments.compact.getButtonCount(), 1, "DropDown button is rendered");
        assert.equal(this.scheduler.appointments.getAppointmentCount(), 0, "Appointments are not rendered");

        this.instance.option("dataSource", [{ startDate: new Date(2019, 2, 4), text: "a", endDate: new Date(2019, 2, 4, 0, 30) }]);

        assert.equal(this.scheduler.appointments.compact.getButtonCount(), 1, "DropDown button is rendered");
        assert.equal(this.scheduler.appointments.getAppointmentCount(), 0, "Appointments are not rendered");
    });

    QUnit.test("There are no ordinary appointments on adaptive week view allDay panel", (assert) => {
        this.createInstance();

        this.instance.option("dataSource", [{ startDate: new Date(2019, 2, 4), text: "a", endDate: new Date(2019, 2, 4, 0, 30), allDay: true }]);
        this.instance.option("currentView", "week");

        assert.equal(this.scheduler.appointments.compact.getButtonCount(), 1, "DropDown button is rendered");
        assert.equal(this.scheduler.appointments.getAppointmentCount(), 0, "Appointments are not rendered");
    });

    QUnit.test("Adaptive dropDown appointment button should have correct coordinates", (assert) => {
        this.createInstance();

        let $dropDownButton = this.scheduler.appointments.compact.getButton(0);

        let buttonCoordinates = translator.locate($dropDownButton);
        let expectedCoordinates = this.scheduler.workSpace.getCell(8).position();

        assert.roughEqual(buttonCoordinates.left, expectedCoordinates.left + (this.scheduler.workSpace.getCellWidth() - ADAPTIVE_DROP_DOWN_BUTTON_DEFAULT_SIZE) / 2, 1.001, "Left coordinate is OK");
        assert.roughEqual(buttonCoordinates.top, expectedCoordinates.top + this.scheduler.workSpace.getCellHeight() - DROP_DOWN_BUTTON_ADAPTIVE_BOTTOM_OFFSET, 1.001, "Top coordinate is OK");
    });

    QUnit.test("Adaptive dropDown appointment button should have correct coordinates in allDay panel", (assert) => {
        this.createInstance();

        this.instance.option("dataSource", [{ startDate: new Date(2019, 2, 4), text: "a", endDate: new Date(2019, 2, 4, 0, 30), allDay: true }]);
        this.instance.option("currentView", "week");

        let $dropDownButton = this.scheduler.appointments.compact.getButton(0);

        let buttonCoordinates = translator.locate($dropDownButton);
        let expectedCoordinates = this.scheduler.workSpace.getAllDayCell(1).position();

        assert.roughEqual(buttonCoordinates.left, expectedCoordinates.left + (this.scheduler.workSpace.getAllDayCellWidth() - ADAPTIVE_DROP_DOWN_BUTTON_DEFAULT_SIZE) / 2, 1.001, "Left coordinate is OK");
        assert.roughEqual(buttonCoordinates.top, (this.scheduler.workSpace.getAllDayCellHeight() - ADAPTIVE_DROP_DOWN_BUTTON_DEFAULT_SIZE) / 2, 1.001, "Top coordinate is OK");
    });
});


