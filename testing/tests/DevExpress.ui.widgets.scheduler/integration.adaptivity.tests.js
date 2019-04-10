import $ from "jquery";
import fx from "animation/fx";
import { SchedulerTestWrapper } from "./helpers.js";
import { getSimpleDataArray } from './data.js';

import "common.css!";
import "generic_light.css!";
import "ui/scheduler/ui.scheduler";

QUnit.testStart(function() {
    $("#qunit-fixture").html(
        '<div id="scheduler">\
            <div data-options="dxTemplate: { name: \'template\' }">Task Template</div>\
            </div>');
});

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;

        this.createInstance = function(options) {
            const defaultOption = {
                dataSource: getSimpleDataArray(),
                views: ["agenda", "day", "week", "workWeek", "month"],
                currentView: "month",
                currentDate: new Date(2017, 4, 25),
                startDayHour: 9,
                height: 600,
                adaptivityEnabled: true
            };
            this.instance = $("#scheduler").dxScheduler($.extend(defaultOption, options)).dxScheduler("instance");
            this.scheduler = new SchedulerTestWrapper(this.instance);
        };

        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    },
};

QUnit.module("Mobile tooltip", moduleConfig, function() {
    QUnit.test("Title in mobile tooltip should equals title of cell appointments in month view", function(assert) {
        this.createInstance();
        assert.notOk(this.scheduler.tooltip.isVisible(), "On page load tooltip should be invisible");

        for(let i = 0; i < this.scheduler.appointments.getAppointmentCount(); i++) {
            this.scheduler.appointments.click(i);
            assert.ok(this.scheduler.tooltip.isVisible(), "Tooltip should be visible after click on appointment");
            assert.equal(this.scheduler.tooltip.getTitleText(), this.scheduler.appointments.getTitleText(i), "Title in tooltip should be equal with appointment");
        }
    });

    QUnit.test("Tooltip should hide after execute actions", function(assert) {
        this.createInstance();
        const initialDataCount = this.scheduler.instance.option("dataSource").length;

        assert.notOk(this.scheduler.tooltip.isVisible(), "On page load tooltip should be invisible");

        this.scheduler.appointments.click();
        assert.ok(this.scheduler.tooltip.isVisible(), "Tooltip should be visible after click on appointment");

        this.scheduler.tooltip.clickOnItem();

        assert.ok(this.scheduler.appointmentPopup.isVisible(), "Appointment popup should be visible after click on item in tooltip");
        assert.notOk(this.scheduler.tooltip.isVisible(), "Tooltip should be hide after showing Appointment popup");

        this.scheduler.appointmentPopup.hide();
        this.scheduler.appointments.click();
        assert.ok(this.scheduler.tooltip.isVisible(), "Tooltip should be visible after click on appointment");

        this.scheduler.tooltip.clickOnDeleteButton();
        assert.notOk(this.scheduler.tooltip.isVisible(), "Tooltip should be hide after click on remove button in tooltip");

        assert.equal(this.scheduler.instance.option("dataSource").length, initialDataCount - 1, "Appointment should delete form dataSource after click on delete button in tooltip");
    });

    QUnit.test("appointmentTooltipTemplate method should pass valid arguments and render valid html markup", function(assert) {
        let templateCallCount = 0;
        const TOOLTIP_TEMPLATE_MARKER_CLASS_NAME = "appointment-tooltip-template-marker";

        const checkItemTemplate = (index) => {
            assert.ok(this.scheduler.tooltip.checkItemElementHtml(index, `<div class="${TOOLTIP_TEMPLATE_MARKER_CLASS_NAME}">`), "Template should contain valid custom css class ");
            assert.ok(this.scheduler.tooltip.checkItemElementHtml(index, `template item index - ${index}`), "Template should render valid content dependent on item index");
        };

        this.createInstance({
            appointmentTooltipTemplate: (appointmentData, contentElement, targetedAppointmentData, index) => {
                assert.equal(targetedAppointmentData.text, appointmentData.text, "targetedAppointmentData should be not empty");
                assert.equal(index, templateCallCount, "Index should be correct pass in template callback");
                templateCallCount++;

                return $('<div />').addClass(TOOLTIP_TEMPLATE_MARKER_CLASS_NAME).text(`template item index - ${index}`);
            }
        });

        this.scheduler.appointments.click();
        checkItemTemplate(0);
        assert.ok(this.scheduler.tooltip.isVisible(), "Tooltip should be visible after click on appointment");
        templateCallCount = 0;

        const buttonCount = this.scheduler.appointments.compact.getButtonCount();
        this.scheduler.appointments.compact.click(buttonCount - 1);
        checkItemTemplate(0);
        checkItemTemplate(1);
    });
});
