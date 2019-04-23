import $ from "jquery";
import fx from "animation/fx";
import { SchedulerTestWrapper } from "./helpers.js";
import { getSimpleDataArray } from './data.js';
import resizeCallbacks from "core/utils/resize_callbacks";
import devices from "core/devices";
import "ui/switch";

import "common.css!";
import "generic_light.css!";
import "ui/scheduler/ui.scheduler";

const { testStart, test, skip, module } = QUnit;

testStart(function() {
    $("#qunit-fixture").html(
        `<div id="scheduler">
            <div data-options="dxTemplate: { name: 'template' }">Task Template</div>
        </div>`
    );
});

const createInstance = function(options) {
    const defaultOption = {
        dataSource: getSimpleDataArray(),
        views: ["agenda", "day", "week", "workWeek", "month"],
        currentView: "month",
        currentDate: new Date(2017, 4, 25),
        startDayHour: 9,
        height: 600,
        adaptivityEnabled: true
    };
    const instance = $("#scheduler").dxScheduler($.extend(defaultOption, options)).dxScheduler("instance");
    return new SchedulerTestWrapper(instance);
};

const moduleConfig = {
    beforeEach() {
        fx.off = true;
    },

    afterEach() {
        fx.off = false;
    }
};

module("Mobile tooltip", moduleConfig, () => {
    test("Title in mobile tooltip should equals title of cell appointments in month view", function(assert) {
        const scheduler = createInstance();
        assert.notOk(scheduler.tooltip.isVisible(), "On page load tooltip should be invisible");

        for(let i = 0; i < scheduler.appointments.getAppointmentCount(); i++) {
            scheduler.appointments.click(i);
            assert.ok(scheduler.tooltip.isVisible(), "Tooltip should be visible after click on appointment");
            assert.equal(scheduler.tooltip.getTitleText(), scheduler.appointments.getTitleText(i), "Title in tooltip should be equal with appointment");
        }
    });

    skip("Tooltip should hide after execute actions", function(assert) {
        const scheduler = createInstance();
        const initialDataCount = scheduler.instance.option("dataSource").length;

        assert.notOk(scheduler.tooltip.isVisible(), "On page load tooltip should be invisible");

        scheduler.appointments.click();
        assert.ok(scheduler.tooltip.isVisible(), "Tooltip should be visible after click on appointment");

        scheduler.tooltip.clickOnItem();

        assert.ok(scheduler.appointmentPopup.isVisible(), "Appointment popup should be visible after click on item in tooltip");
        assert.notOk(scheduler.tooltip.isVisible(), "Tooltip should be hide after showing Appointment popup");

        scheduler.appointmentPopup.hide();
        scheduler.appointments.click();
        assert.ok(scheduler.tooltip.isVisible(), "Tooltip should be visible after click on appointment");

        scheduler.tooltip.clickOnDeleteButton();
        assert.notOk(scheduler.tooltip.isVisible(), "Tooltip should be hide after click on remove button in tooltip");

        assert.equal(scheduler.instance.option("dataSource").length, initialDataCount - 1, "Appointment should delete form dataSource after click on delete button in tooltip");
    });

    skip("appointmentTooltipTemplate method should pass valid arguments and render valid html markup", function(assert) {
        let templateCallCount = 0;
        const TOOLTIP_TEMPLATE_MARKER_CLASS_NAME = "appointment-tooltip-template-marker";
        const scheduler = createInstance();

        const checkItemTemplate = (index) => {
            assert.ok(scheduler.tooltip.checkItemElementHtml(index, `<div class="${TOOLTIP_TEMPLATE_MARKER_CLASS_NAME}">`), "Template should contain valid custom css class ");
            assert.ok(scheduler.tooltip.checkItemElementHtml(index, `template item index - ${index}`), "Template should render valid content dependent on item index");
        };

        this.createInstance({
            appointmentTooltipTemplate: (appointmentData, contentElement, targetedAppointmentData, index) => {
                assert.equal(targetedAppointmentData.text, appointmentData.text, "targetedAppointmentData should be not empty");
                assert.equal(index, templateCallCount, "Index should be correct pass in template callback");
                templateCallCount++;

                return $('<div />').addClass(TOOLTIP_TEMPLATE_MARKER_CLASS_NAME).text(`template item index - ${index}`);
            }
        });

        scheduler.appointments.click();
        checkItemTemplate(0);
        assert.ok(scheduler.tooltip.isVisible(), "Tooltip should be visible after click on appointment");
        templateCallCount = 0;

        const buttonCount = scheduler.appointments.compact.getButtonCount();
        scheduler.appointments.compact.click(buttonCount - 1);
        checkItemTemplate(0);
        checkItemTemplate(1);
    });
});

if(devices.real().deviceType === "desktop") {
    module("Appointment form", moduleConfig, () => {
        test("Label location is left when the form's width > 610px on first show", function(assert) {
            const scheduler = createInstance();
            scheduler.appointmentPopup.setInitialWidth(700);
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();

            const form = scheduler.appointmentForm.getFormInstance();
            assert.equal(form.option("labelLocation"), "left", "label location of Form");
        });

        test("Label location is top when the form's width < 610px on first show", function(assert) {
            const scheduler = createInstance();
            scheduler.appointmentPopup.setInitialWidth(600);
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();

            const form = scheduler.appointmentForm.getFormInstance();
            assert.equal(form.option("labelLocation"), "top", "label location of Form");
        });

        test("Items has layout has one column when the form's width < 460px on first show", function(assert) {
            const scheduler = createInstance();
            scheduler.appointmentPopup.setInitialWidth(400);
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();

            assert.ok(scheduler.appointmentForm.hasFormSingleColumn(), "Appointment form has single column");
        });

        test("Items has layout has non-one column when the form's width > 460px on first show", function(assert) {
            const scheduler = createInstance();
            scheduler.appointmentPopup.setInitialWidth(463);
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();

            assert.notOk(scheduler.appointmentForm.hasFormSingleColumn(), "Appointment form has not single column");
        });

        test("Label location is left when the form's width > 610px on window resizing", function(assert) {
            const scheduler = createInstance();
            scheduler.appointmentPopup.setInitialWidth(400);
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();

            scheduler.appointmentPopup.setPopupWidth(620);
            resizeCallbacks.fire();

            const form = scheduler.appointmentForm.getFormInstance();
            assert.equal(form.option("labelLocation"), "left", "label location of Form");
        });

        test("Label location is top when the form's width < 610px on window resizing", function(assert) {
            const scheduler = createInstance();
            scheduler.appointmentPopup.setInitialWidth(700);
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();

            scheduler.appointmentPopup.setPopupWidth(600);
            resizeCallbacks.fire();

            const form = scheduler.appointmentForm.getFormInstance();

            assert.equal(form.option("labelLocation"), "top", "label location of Form");
        });

        test("Items has layout has one column when the form's width < 460px on window resizing", function(assert) {
            const scheduler = createInstance();
            scheduler.appointmentPopup.setInitialWidth(500);
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();

            scheduler.appointmentPopup.setPopupWidth(400);
            resizeCallbacks.fire();

            assert.ok(scheduler.appointmentForm.hasFormSingleColumn(), "Appointment form has single column");
        });

        test("Items has layout has non-one column when the form's width > 460px on window resizing", function(assert) {
            const scheduler = createInstance();
            scheduler.appointmentPopup.setInitialWidth(460);
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();

            scheduler.appointmentPopup.setPopupWidth(463);
            resizeCallbacks.fire();

            assert.notOk(scheduler.appointmentForm.hasFormSingleColumn(), "Appointment form has not single column");
        });
    });
}
