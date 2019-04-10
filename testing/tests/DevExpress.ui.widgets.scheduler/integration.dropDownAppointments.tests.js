import $ from "jquery";
import translator from "animation/translator";
import fx from "animation/fx";

import "ui/scheduler/ui.scheduler";
import "common.css!";
import "generic_light.css!";

QUnit.testStart(() => {
    $("#qunit-fixture").html(
        '<div id="scheduler"></div>');
});

const DATE_TABLE_CELL_CLASS = "dx-scheduler-date-table-cell";
const DROP_DOWN_APPOINTMENT_CLASS = "dx-scheduler-dropdown-appointments";
const APPOINTMENT_CLASS = "dx-scheduler-appointment";

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
                views: ["month"],
                width: 840,
                currentView: "month",
                currentDate: new Date(2019, 2, 4)
            })).dxScheduler("instance");
        };

        // NOTE: sizes of the current config in create instance
        this.cellWidth = 120;
        this.cellHeight = 115;
    },
    afterEach: () => {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.test("There are no ordinary appointments on adaptive month view", (assert) => {
        this.createInstance();

        let $dropDownButton = this.instance.$element().find("." + DROP_DOWN_APPOINTMENT_CLASS);
        let $appointments = this.instance.$element().find("." + APPOINTMENT_CLASS);


        assert.equal($dropDownButton.length, 1, "DropDown button is rendered");
        assert.equal($appointments.length, 0, "Appointments are not rendered");

        this.instance.option("dataSource", [{ startDate: new Date(2019, 2, 4), text: "a", endDate: new Date(2019, 2, 4, 0, 30) }]);

        $dropDownButton = this.instance.$element().find("." + DROP_DOWN_APPOINTMENT_CLASS);
        $appointments = this.instance.$element().find("." + APPOINTMENT_CLASS);

        assert.equal($dropDownButton.length, 1, "DropDown button is rendered");
        assert.equal($appointments.length, 0, "Appointments are not rendered");
    });

    QUnit.test("Adaptive dropDown appointment button should have correct coordinates", (assert) => {
        this.createInstance();

        let $dropDownButton = this.instance.$element().find("." + DROP_DOWN_APPOINTMENT_CLASS);

        let buttonCoordinates = translator.locate($dropDownButton);
        let expectedCoordinates = this.instance.$element().find("." + DATE_TABLE_CELL_CLASS).eq(8).position();

        assert.roughEqual(buttonCoordinates.left, expectedCoordinates.left + (this.cellWidth - ADAPTIVE_DROP_DOWN_BUTTON_DEFAULT_SIZE) / 2, 1.001, "Left coordinate is OK");
        assert.roughEqual(buttonCoordinates.top, expectedCoordinates.top + this.cellHeight - DROP_DOWN_BUTTON_ADAPTIVE_BOTTOM_OFFSET, 1.001, "Top coordinate is OK");
    });
});


