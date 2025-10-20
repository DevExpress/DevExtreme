import $ from 'jquery';
import fx from 'common/core/animation/fx';
import {
    createWrapper,
    initTestMarkup,
    isDesktopEnvironment,
    TOOLBAR_TOP_LOCATION,
    TOOLBAR_BOTTOM_LOCATION } from '../../helpers/scheduler/helpers.js';
import { getSimpleDataArray } from '../../helpers/scheduler/data.js';
import { waitAsync } from '../../helpers/scheduler/waitForAsync.js';
import resizeCallbacks from 'core/utils/resize_callbacks';
import devices from '__internal/core/m_devices';
import 'ui/switch';

import 'generic_light.css!';
import '__internal/scheduler/m_scheduler';

const { testStart, test, module } = QUnit;

testStart(() => initTestMarkup());

const createInstance = (options) => {
    const defaultOption = {
        dataSource: getSimpleDataArray(),
        views: ['agenda', 'day', 'week', 'workWeek', 'month'],
        currentView: 'month',
        currentDate: new Date(2017, 4, 25),
        startDayHour: 9,
        height: 600,
        adaptivityEnabled: true
    };
    return createWrapper($.extend(defaultOption, options));
};

const moduleConfig = {
    beforeEach() {
        fx.off = true;
    },

    afterEach() {
        fx.off = false;
    }
};

const setWindowWidth = width => {
    Object.defineProperty(document.documentElement, 'clientWidth', {
        get: () => width,
        configurable: true
    });
};

const resetWindowWidth = () => delete document.documentElement.clientWidth;

module('Mobile tooltip', moduleConfig, () => {
    test('Tooltip should be render scroll, if count of items in list is a lot', async function(assert) {
        const MAX_TOOLTIP_HEIGHT = 250;
        const isDesktop = devices.real().deviceType === 'desktop';

        const scheduler = await createInstance();
        const { tooltip, appointments } = scheduler;

        assert.notOk(tooltip.isVisible(), 'On page load tooltip should be invisible');

        appointments.compact.click();
        if(isDesktop) {
            assert.notOk(tooltip.hasScrollbar(), 'Tooltip contained 3 items shouldn\'t render scroll bar');
        } else {
            assert.ok(tooltip.getOverlayContentElement().height() < MAX_TOOLTIP_HEIGHT, 'Tooltip contained 3 items shouldn\'t render scroll bar');
        }

        appointments.compact.click(appointments.compact.getLastButtonIndex());
        if(!isDesktop) {
            assert.equal(tooltip.getOverlayContentElement().height(), MAX_TOOLTIP_HEIGHT, 'Tooltip contained 4 items should limit height');
        }
    });

    test('Title in mobile tooltip should equals title of cell appointments in month view', async function(assert) {
        const scheduler = await createInstance();
        assert.notOk(scheduler.tooltip.isVisible(), 'On page load tooltip should be invisible');

        const clock = sinon.useFakeTimers();
        for(let i = 0; i < scheduler.appointments.getAppointmentCount(); i++) {
            await scheduler.appointments.click(i, clock);
            assert.ok(scheduler.tooltip.isVisible(), 'Tooltip should be visible after click on appointment');
            assert.equal(scheduler.tooltip.getTitleText(), scheduler.appointments.getTitleText(i), 'Title in tooltip should be equal with appointment');
        }
        clock.restore();
    });

    test('Tooltip should hide after execute actions', async function(assert) {
        const scheduler = await createInstance();
        const initialDataCount = scheduler.instance.option('dataSource').length;

        assert.notOk(scheduler.tooltip.isVisible(), 'On page load tooltip should be invisible');

        scheduler.appointments.compact.click();
        assert.ok(scheduler.tooltip.isVisible(), 'Tooltip should be visible after click on appointment');

        scheduler.tooltip.clickOnItem();

        assert.ok(scheduler.appointmentPopup.isVisible(), 'Appointment popup should be visible after click on item in tooltip');
        assert.notOk(scheduler.tooltip.isVisible(), 'Tooltip should be hide after showing Appointment popup');

        scheduler.appointmentPopup.clickCancelButton();
        scheduler.appointments.compact.click();
        assert.ok(scheduler.tooltip.isVisible(), 'Tooltip should be visible after click on appointment');

        scheduler.tooltip.clickOnDeleteButton();
        assert.notOk(scheduler.tooltip.isVisible(), 'Tooltip should be hide after click on remove button in tooltip');

        assert.equal(scheduler.instance.option('dataSource').length, initialDataCount - 1, 'Appointment should delete form dataSource after click on delete button in tooltip');
    });

    test('appointmentTooltipTemplate method should pass valid arguments and render valid html markup', async function(assert) {
        let templateCallCount = 0;
        const TOOLTIP_TEMPLATE_MARKER_CLASS_NAME = 'appointment-tooltip-template-marker';

        const scheduler = await createInstance({
            appointmentTooltipTemplate: (model, index, contentElement) => {
                assert.equal(model.targetedAppointmentData.text, model.appointmentData.text, 'targetedAppointmentData should be not empty');
                assert.equal(index, templateCallCount, 'Index should be correct pass in template callback');
                assert.equal($(contentElement).length, 1, 'contentElement should be DOM element');
                templateCallCount++;

                return $('<div />').addClass(TOOLTIP_TEMPLATE_MARKER_CLASS_NAME).text(`template item index - ${index}`);
            }
        });

        const checkItemTemplate = (index) => {
            assert.ok(scheduler.tooltip.checkItemElementHtml(index, `<div class="${TOOLTIP_TEMPLATE_MARKER_CLASS_NAME}">`), 'Template should contain valid custom css class ');
            assert.ok(scheduler.tooltip.checkItemElementHtml(index, `template item index - ${index}`), 'Template should render valid content dependent on item index');
        };

        scheduler.appointments.compact.click();
        checkItemTemplate(0);
        checkItemTemplate(1);
        checkItemTemplate(2);
        assert.ok(scheduler.tooltip.isVisible(), 'Tooltip should be visible after click on appointment');

        templateCallCount = 0;

        scheduler.appointments.compact.click(scheduler.appointments.compact.getLastButtonIndex());
        checkItemTemplate(0);
        checkItemTemplate(1);
        checkItemTemplate(2);
        checkItemTemplate(3);
    });
});

if(isDesktopEnvironment()) {
    module('Appointment form on desktop', {
        beforeEach() {
            fx.off = true;
        },

        afterEach() {
            fx.off = false;
            resetWindowWidth();
        }
    }, () => {
        test('Items has layout with one column when the form\'s width < 600px', async function(assert) {
            const scheduler = await createInstance({ editing: { legacyForm: true } });
            setWindowWidth(500);
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();

            assert.ok(scheduler.appointmentForm.hasFormSingleColumn(), 'Appointment form has single column');
        });

        test('Items with recurrence editor has layout with one column when the form\'s width < 600px', async function(assert) {
            const scheduler = await createInstance({ editing: { legacyForm: true } });
            setWindowWidth(500);
            scheduler.option('dataSource', [{
                startDate: new Date(2015, 1, 1),
                endDate: new Date(2015, 1, 2),
                recurrenceRule: 'FREQ=WEEKLY'
            }]);
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();
            $('.dx-dialog-buttons .dx-button').eq(0).trigger('dxclick');

            assert.ok(scheduler.appointmentForm.hasFormSingleColumn(), 'Appointment form has single column');
        });

        test('Items has layout with non-one column when the form\'s width > 600px', async function(assert) {
            const scheduler = await createInstance({ editing: { legacyForm: true } });
            setWindowWidth(700);
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();

            assert.notOk(scheduler.appointmentForm.hasFormSingleColumn(), 'Appointment form has not single column');
        });

        test('Items with recurrence editor has layout with non-one column when the form\'s width > 600px', async function(assert) {
            const scheduler = await createInstance({ editing: { legacyForm: true } });
            setWindowWidth(700);
            scheduler.option('dataSource', [{
                startDate: new Date(2015, 1, 1),
                endDate: new Date(2015, 1, 2),
                recurrenceRule: 'FREQ=WEEKLY'
            }]);
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();
            $('.dx-dialog-buttons .dx-button').eq(0).trigger('dxclick');

            assert.notOk(scheduler.appointmentForm.hasFormSingleColumn(), 'Appointment form has not single column');
        });

        test('Items has layout with one column when the form\'s width < 600px on window resizing', async function(assert) {
            const scheduler = await createInstance({ editing: { legacyForm: true } });
            setWindowWidth(700);
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();

            setWindowWidth(500);
            resizeCallbacks.fire();

            assert.ok(scheduler.appointmentForm.hasFormSingleColumn(), 'Appointment form has single column');
        });

        test('Items has layout with non-one column when the form\'s width > 600px on window resizing', async function(assert) {
            const scheduler = await createInstance({ editing: { legacyForm: true } });
            setWindowWidth(500);
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();

            setWindowWidth(700);
            resizeCallbacks.fire();

            assert.notOk(scheduler.appointmentForm.hasFormSingleColumn(), 'Appointment form has not single column');
        });
    });
}

if(!isDesktopEnvironment()) {
    module('Appointment form on mobile', {
        beforeEach() {
            fx.off = true;
            setWindowWidth(800);
        },

        afterEach() {
            fx.off = false;
            resetWindowWidth();
        }
    }, () => {
        test('Items has layout with one column', async function(assert) {
            const scheduler = await createInstance({ editing: { legacyForm: true } });
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();

            assert.ok(scheduler.appointmentForm.hasFormSingleColumn(), 'Appointment form has single column');
        });
    });
}

if(isDesktopEnvironment()) {
    module('Appointment popup size, desktop', {
        beforeEach() {
            fx.off = true;
        },

        afterEach() {
            fx.off = false;
            resetWindowWidth();
        }
    }, () => {
        test('The fullscreen mode is enabled of popup when window\'s width < 1000px', async function(assert) {
            setWindowWidth(900);

            const scheduler = await createInstance({ editing: { legacyForm: true } });
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();
            const popup = scheduler.appointmentPopup.getPopupInstance();

            assert.ok(popup.option('fullScreen'), 'The fullscreen mode is enabled');
            assert.equal(popup.option('maxWidth'), '100%', 'maxWidth');
        });

        test('The fullscreen mode is disabled of popup when window\'s width > 1000px', async function(assert) {
            setWindowWidth(1001);

            const scheduler = await createInstance({ editing: { legacyForm: true } });
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();
            const popup = scheduler.appointmentPopup.getPopupInstance();

            assert.notOk(popup.option('fullScreen'), 'The fullscreen mode is disabled');
            assert.equal(popup.option('maxWidth'), 485, 'maxWidth');
        });

        test('The fullscreen mode is disabled of popup when window\'s width > 1000px, with recurrence editor', async function(assert) {
            setWindowWidth(1001);

            const scheduler = await createInstance({ editing: { legacyForm: true } });
            scheduler.option('dataSource', [{
                startDate: new Date(2015, 1, 1),
                endDate: new Date(2015, 1, 2),
                recurrenceRule: 'FREQ=WEEKLY'
            }]);
            await waitAsync(0);
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();
            $('.dx-dialog-buttons .dx-button').eq(0).trigger('dxclick');
            const popup = scheduler.appointmentPopup.getPopupInstance();

            assert.notOk(popup.option('fullScreen'), 'The fullscreen mode is disabled');
            assert.equal(popup.option('maxWidth'), 970, 'maxWidth');
        });

        test('The fullscreen mode is enabled of popup when the window\'s width < 1000px by resizing the window', async function(assert) {
            setWindowWidth(1001);

            const scheduler = await createInstance({ editing: { legacyForm: true } });
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();
            const popup = scheduler.appointmentPopup.getPopupInstance();

            setWindowWidth(767);
            resizeCallbacks.fire();

            assert.ok(popup.option('fullScreen'), 'The fullscreen mode is enabled');
            assert.equal(popup.option('maxWidth'), '100%', 'maxWidth');
        });

        test('The fullscreen mode is disabled of popup when the window\'s width > 1000px by resizing the window', async function(assert) {
            setWindowWidth(799);

            const scheduler = await createInstance({ editing: { legacyForm: true } });
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();
            const popup = scheduler.appointmentPopup.getPopupInstance();

            setWindowWidth(1001);
            resizeCallbacks.fire();

            assert.notOk(popup.option('fullScreen'), 'The fullscreen mode is disabled');
            assert.equal(popup.option('maxWidth'), 485, 'maxWidth');
        });
    });
}

if(!isDesktopEnvironment()) {
    module('Appointment popup size, mobile', {
        beforeEach() {
            fx.off = true;
        },

        afterEach() {
            fx.off = false;
            resetWindowWidth();
        }
    }, () => {
        test('The fullscreen mode is enabled of popup when window\'s width < 500px', async function(assert) {
            setWindowWidth(499);

            const scheduler = await createInstance({ editing: { legacyForm: true } });
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();
            const popup = scheduler.appointmentPopup.getPopupInstance();

            assert.ok(popup.option('fullScreen'), 'The fullscreen mode is enabled');
            assert.equal(popup.option('maxWidth'), '100%', 'maxWidth');
        });

        test('The fullscreen mode is disabled of popup when window\'s width > 500px', async function(assert) {
            setWindowWidth(501);

            const scheduler = await createInstance({ editing: { legacyForm: true } });
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();
            const popup = scheduler.appointmentPopup.getPopupInstance();

            assert.notOk(popup.option('fullScreen'), 'The fullscreen mode is disabled');
            assert.equal(popup.option('maxWidth'), 350, 'maxWidth');
        });

        test('The fullscreen mode is disabled of popup when window\'s width > 500px, with recurrence editor', async function(assert) {
            setWindowWidth(501);

            const scheduler = await createInstance({ editing: { legacyForm: true } });
            scheduler.option('dataSource', [{
                startDate: new Date(2015, 1, 1),
                endDate: new Date(2015, 1, 2),
                recurrenceRule: 'FREQ=WEEKLY'
            }]);
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();
            $('.dx-dialog-buttons .dx-button').eq(0).trigger('dxclick');
            const popup = scheduler.appointmentPopup.getPopupInstance();

            assert.notOk(popup.option('fullScreen'), 'The fullscreen mode is disabled');
            assert.equal(popup.option('maxWidth'), 350, 'maxWidth');
        });
    });
}

module('Appointment popup buttons', moduleConfig, () => {
    const SECTION_AFTER = 'after';
    const SECTION_BEFORE = 'before';
    const DONE_BUTTON = 'done';
    const CANCEL_BUTTON = 'cancel';

    test('Buttons location of the top toolbar for the iOs device', async function(assert) {
        this.realDeviceMock = sinon.stub(devices, 'current').returns({ platform: 'ios' });
        try {
            const scheduler = await createInstance({ editing: { legacyForm: true } });
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();

            const popup = scheduler.appointmentPopup;
            assert.ok(popup.hasToolbarButtonsInSection(TOOLBAR_TOP_LOCATION, SECTION_BEFORE, [CANCEL_BUTTON]), 'the \'Cancel\' button is located inside the \'before\' section');
            assert.ok(popup.hasToolbarButtonsInSection(TOOLBAR_TOP_LOCATION, SECTION_AFTER, [DONE_BUTTON]), 'the \'Done\' button is located inside the \'after\' section');
        } finally {
            this.realDeviceMock.restore();
        }
    });

    test('Buttons location of the top toolbar for the desktop', async function(assert) {
        this.realDeviceMock = sinon.stub(devices, 'current').returns({ platform: 'generic' });
        try {
            const scheduler = await createInstance({ editing: { legacyForm: true } });
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();

            const popup = scheduler.appointmentPopup;
            assert.ok(popup.hasToolbarButtonsInSection(TOOLBAR_BOTTOM_LOCATION, SECTION_AFTER, [DONE_BUTTON, CANCEL_BUTTON]), 'the \'Cancel\' and \'Done\' buttons are located in the \'after\' section');
        } finally {
            this.realDeviceMock.restore();
        }
    });

    test('Buttons location of the top toolbar for the android device', async function(assert) {
        this.realDeviceMock = sinon.stub(devices, 'current').returns({ platform: 'android' });
        try {
            const scheduler = await createInstance({ editing: { legacyForm: true } });
            scheduler.appointments.compact.click();
            scheduler.tooltip.clickOnItem();

            const popup = scheduler.appointmentPopup;
            assert.ok(popup.hasToolbarButtonsInSection(TOOLBAR_BOTTOM_LOCATION, SECTION_AFTER, [CANCEL_BUTTON, DONE_BUTTON]), 'the \'Cancel\' and \'Done\' buttons are located in the \'after\' section');
        } finally {
            this.realDeviceMock.restore();
        }
    });
}),

module('View switcher', moduleConfig, () => {
    if(!isDesktopEnvironment()) {
        const config = {
            beforeEach() {
                fx.off = true;
                $('head').append('<meta  id="viewport" name="viewport" content="width=device-width, initial-scale=1">');
            },

            afterEach() {
                fx.off = false;
                $('#viewport').remove();
            }
        };
        module('mobile environment', config, () => {
            test('label of view name shouldn\'t be visible on mobile in case width < 450px', async function(assert) {
                const scheduler = await createInstance();
                assert.notOk(scheduler.viewSwitcher.getLabel().is(':visible'), 'label of view name shouldn\'t be visible');
            });
        });
    }
});
