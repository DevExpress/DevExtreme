import $ from 'jquery';
import dateSerialization from 'core/utils/date_serialization';
import config from 'core/config';
import Tooltip from 'ui/tooltip';
import { hide } from '__internal/ui/tooltip/m_tooltip';
import resizeCallbacks from 'core/utils/resize_callbacks';
import fx from 'common/core/animation/fx';
import dateLocalization from 'common/core/localization/date';
import messageLocalization from 'common/core/localization/message';
import { DataSource } from 'common/data/data_source/data_source';
import keyboardMock from '../../helpers/keyboardMock.js';
import devices from '__internal/core/m_devices';
import dataUtils from 'core/element_data';
import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';
import { getSimpleDataArray } from '../../helpers/scheduler/data.js';
import { waitAsync } from '../../helpers/scheduler/waitForAsync.js';

import 'fluent_blue_light.css!';
import '__internal/scheduler/m_scheduler';

const dateFormat = 'monthandday';
const timeFormat = 'shorttime';

const { testStart, module, test } = QUnit;

testStart(() => initTestMarkup());

const moduleConfig = {
    beforeEach() {
        fx.off = true;
    },

    afterEach() {
        fx.off = false;
        hide();
    }
};

module('Global formatting config (spec): Scheduler tooltip', {
    beforeEach() {
        fx.off = true;
        const globalConfig = config();
        this.savedGlobalFormats = {
            dateFormat: globalConfig.dateFormat,
            timeFormat: globalConfig.timeFormat,
            dateTimeFormat: globalConfig.dateTimeFormat,
            numberFormat: globalConfig.numberFormat,
            dateTimeFormatPresets: globalConfig.dateTimeFormatPresets,
        };
    },
    afterEach() {
        fx.off = false;
        hide();
        const globalConfig = config();
        Object.keys(this.savedGlobalFormats).forEach((key) => {
            const value = this.savedGlobalFormats[key];
            if(value === undefined) {
                delete globalConfig[key];
            } else {
                globalConfig[key] = value;
            }
        });
    }
}, () => {
    const createScheduler = (options) => createWrapper($.extend({
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
        height: 600,
        dataSource: [{
            text: 'Task 1',
            startDate: new Date(2015, 1, 9, 11, 0),
            endDate: new Date(2015, 1, 9, 12, 0),
        }],
    }, options));

    test('implicit Scheduler tooltip time format uses global timeFormat', async function(assert) {
        config({
            ...config(),
            timeFormat: (date) => `T${date.getHours()}`,
        });

        const scheduler = await createScheduler();
        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();

        assert.strictEqual(scheduler.tooltip.getDateText(), 'T11 - T12');
    });

    test('implicit Scheduler tooltip uses built-in format when global timeFormat is not set', async function(assert) {
        const scheduler = await createScheduler();
        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();

        assert.strictEqual(scheduler.tooltip.getDateText(), '11:00 AM - 12:00 PM');
    });

    test('implicit Scheduler tooltip date/time use global dateFormat and timeFormat', async function(assert) {
        config({
            ...config(),
            dateFormat: (date) => `Date${date.getDate()}`,
            timeFormat: (date) => `Time${date.getHours()}`,
        });

        const scheduler = await createScheduler({
            dataSource: [{
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 23, 0),
                endDate: new Date(2015, 1, 10, 1, 0),
            }],
        });
        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();

        assert.strictEqual(scheduler.tooltip.getDateText(), 'Date9 Time23 - Date10 Time1');
    });
});

module('Integration: Appointment tooltip', moduleConfig, () => {
    const createScheduler = (options) => createWrapper($.extend(options, { height: 600 }));
    const getDeltaTz = (schedulerTz, date) => schedulerTz * 3600000 + date.getTimezoneOffset() * 60000;
    const getSampleData = () => [
        {
            text: 'Task 1',
            startDate: new Date(2015, 1, 9, 1, 0),
            endDate: new Date(2015, 1, 9, 2, 0)
        },
        {
            text: 'Task 2',
            startDate: new Date(2015, 1, 9, 11, 0),
            endDate: new Date(2015, 1, 9, 12, 0)
        }
    ];

    test('Tooltip marker should be color up in resource color', async function(assert) {
        const views = ['workWeek', 'month'];

        const data = [
            {
                text: 'Book Flights to San Fran for Sales Trip',
                priorityId: 1,
                startDate: new Date(2017, 4, 22, 12, 0),
                endDate: new Date(2017, 4, 22, 13, 0)
            }, {
                text: 'Install New Router in Dev Room',
                priorityId: 2,
                startDate: new Date(2017, 4, 23, 14, 30),
                endDate: new Date(2017, 4, 23, 15, 30)
            }, {
                text: 'Website Re-Design Plan',
                priorityId: 3,
                startDate: new Date(2017, 4, 24, 9, 30),
                endDate: new Date(2017, 4, 24, 11, 30)
            }, {
                text: 'Approve Personal Computer Upgrade Plan',
                priorityId: 4,
                startDate: new Date(2017, 4, 25, 10, 0),
                endDate: new Date(2017, 4, 25, 11, 0)
            }
        ];

        const priorities = [
            {
                text: 'Samantha Bright',
                id: 1,
                color: 'rgb(114, 123, 210)'
            }, {
                text: 'John Heart',
                id: 2,
                color: 'rgb(50, 201, 237)'
            }, {
                text: 'Todd Hoffman',
                id: 3,
                color: 'rgb(42, 126, 228)'
            }, {
                text: 'Sandra Johnson',
                id: 4,
                color: 'rgb(128, 193, 42)'
            }
        ];

        const scheduler = await createScheduler({
            dataSource: data,
            views: views,
            currentDate: new Date(2017, 4, 22),
            startDayHour: 9,
            endDayHour: 19,
            width: 500,
            height: 600,
            resources: [
                {
                    fieldExpr: 'priorityId',
                    allowMultiple: true,
                    dataSource: priorities,
                    label: 'Priority'
                }
            ]
        });
        const testView = async(view) => {
            scheduler.option('currentView', view);
            await waitAsync(0);
            const appts = Array.from(scheduler.appointments.getAppointments());

            const clock = sinon.useFakeTimers();
            for(let index = 0; index < appts.length; index++) {
                await scheduler.appointments.click(index, clock);

                const marker = scheduler.tooltip.getMarker();
                assert.equal(marker.css('backgroundColor'), priorities[index].color, `marker color in tooltip should equal color in resource, ${view} view`);
            }
            clock.restore();
        };

        await testView(views[0]);
        await testView(views[1]);
    });

    test('After change view type, tooltip should be appear after click on appointment, group mode(T802158)', async function(assert) {
        const data = [
            {
                text: 'Website Re-Design Plan',
                priorityId: 2,
                startDate: new Date(2018, 4, 21, 9, 30),
                endDate: new Date(2018, 4, 21, 11, 30)
            }
        ];

        const priorityData = [
            {
                text: 'Low Priority',
                id: 1,
                color: '#1e90ff'
            }, {
                text: 'High Priority',
                id: 2,
                color: '#ff9747'
            }
        ];

        const defaultViews = ['week', 'agenda', 'month'];

        const scheduler = await createScheduler({
            dataSource: data,
            views: defaultViews,
            currentView: defaultViews[0],
            crossScrollingEnabled: true,
            currentDate: new Date(2018, 4, 21),
            startDayHour: 9,
            endDayHour: 16,
            width: 800,
            height: 600,
            groups: ['priorityId'],
            resources: [
                {
                    fieldExpr: 'priorityId',
                    allowMultiple: false,
                    dataSource: priorityData,
                    label: 'Priority'
                }
            ]
        });

        const testView = async(view) => {
            scheduler.option('currentView', view);
            await waitAsync(0);
            const clock = sinon.useFakeTimers();
            await scheduler.appointments.click(0, clock);
            clock.restore();
            assert.ok(scheduler.tooltip.isVisible(), `tooltip should be visible after click on item in ${view} view`);
        };

        await testView(defaultViews[0]);
        await testView(defaultViews[1]);
        await testView(defaultViews[2]);
    });

    test('There is no need to check recurring appointment if editing.allowUpdating is false', async function(assert) {
        const scheduler = await createScheduler({
            editing: {
                allowUpdating: false
            },
            currentDate: new Date(2015, 5, 15),
            firstDayOfWeek: 1,
            dataSource: [{
                text: 'a',
                startDate: new Date(2015, 5, 15, 10),
                endDate: new Date(2015, 5, 15, 10, 30),
                recurrenceRule: 'FREQ=MONTHLY'
            }]
        });


        const $appointment = scheduler.appointments.getAppointment(0);
        const itemData = dataUtils.data($appointment[0], 'dxItemData');

        scheduler.instance.showAppointmentTooltip(itemData, $appointment);

        scheduler.tooltip.clickOnItem();
        assert.ok(scheduler.appointmentPopup.isVisible(), 'Popup is rendered instead of recurrence tooltip');
    });

    test('Delete button should not exist if editing.allowUpdating is false', async function(assert) {
        const scheduler = await createScheduler({
            editing: {
                allowDeleting: false
            },
            currentDate: new Date(2015, 5, 15),
            firstDayOfWeek: 1,
            dataSource: [{
                text: 'a',
                startDate: new Date(2015, 5, 15, 10),
                endDate: new Date(2015, 5, 15, 10, 30)
            }]
        });

        const $appointment = scheduler.appointments.getAppointment(0);
        const itemData = dataUtils.data($appointment[0], 'dxItemData');

        scheduler.instance.showAppointmentTooltip(itemData, $appointment);
        assert.notOk(scheduler.tooltip.hasDeleteButton(), 'Delete button should not exist');
    });

    test('Click on appointment should call scheduler.showAppointmentTooltip', async function(assert) {
        const data = new DataSource({
            store: getSampleData()
        });

        const scheduler = await createScheduler({ currentDate: new Date(2015, 1, 9), dataSource: data });
        const stub = sinon.stub(scheduler.instance, 'showAppointmentTooltip');

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(1, clock);
        clock.restore();

        assert.deepEqual(
            stub.getCall(0).args[0],
            {
                startDate: new Date(2015, 1, 9, 11, 0),
                endDate: new Date(2015, 1, 9, 12, 0),
                text: 'Task 2'
            },
            'showAppointmentTooltip has a right arguments'
        );
    });

    test('Shown tooltip should have right boundary', async function(assert) {
        const tasks = [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            },
            {
                text: 'Task 2',
                startDate: new Date(2015, 1, 9, 11, 0),
                endDate: new Date(2015, 1, 9, 11, 0, 30),
                allDay: true
            }
        ];
        const data = new DataSource({
            store: tasks
        });

        const scheduler = await createScheduler({ currentDate: new Date(2015, 1, 9), dataSource: data });

        const $firstAppointment = $(scheduler.instance.$element()).find('.dx-scheduler-appointment').eq(1);
        const firstItemData = dataUtils.data($firstAppointment[0], 'dxItemData');

        scheduler.instance.showAppointmentTooltip(firstItemData, $firstAppointment);
        assert.deepEqual(Tooltip.getInstance($('.dx-tooltip')).option('position').boundary.get(0), scheduler.instance.getWorkSpace().$element().find('.dx-scrollable-container').get(0), 'Boundary is correct');

        const $secondAppointment = $(scheduler.instance.$element()).find('.dx-scheduler-appointment').eq(0);
        const secondItemData = dataUtils.data($secondAppointment[0], 'dxItemData');

        scheduler.instance.showAppointmentTooltip(secondItemData, $secondAppointment);
        assert.deepEqual(Tooltip.getInstance($('.dx-tooltip')).option('position').boundary.get(0), $(scheduler.instance.$element()).get(0), 'Boundary of allDay appointment is correct');
    });

    test('\'rtlEnabled\' option value should be passed to appointmentTooltip', async function(assert) {
        const data = new DataSource({
            store: getSampleData()
        });

        const scheduler = await createScheduler({ currentDate: new Date(2015, 1, 9), dataSource: data, rtlEnabled: true });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(1, clock);
        clock.restore();

        assert.equal(Tooltip.getInstance($('.dx-tooltip')).option('rtlEnabled'), true, 'rtlEnabled for tooltip was set to true');
    });

    test('Click on tooltip-edit button should call scheduler.appointmentPopup and hide tooltip', async function(assert) {
        const data = new DataSource({
            store: getSampleData()
        });

        const scheduler = await createScheduler({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        const stub = sinon.stub(scheduler.instance.appointmentPopup, 'show');

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(1, clock);
        clock.restore();
        scheduler.tooltip.clickOnItem();

        const args = stub.getCall(0).args;

        assert.deepEqual(args[0], {
            startDate: new Date(2015, 1, 9, 11, 0),
            endDate: new Date(2015, 1, 9, 12, 0),
            text: 'Task 2'
        },
        'show has a right appointment data arg');

        assert.equal(args[1].readOnly, false, 'show has a right readOnly arg');


        assert.notOk(scheduler.tooltip.isVisible(), 'tooltip was hidden');
    });

    test('Scheduler appointment tooltip should has right content', async function(assert) {
        const data = new DataSource({
            store: getSampleData()
        });

        const scheduler = await createScheduler({ currentDate: new Date(2015, 1, 9), dataSource: data });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(1, clock);
        clock.restore();

        assert.equal(scheduler.tooltip.getContentElement().length, 1, 'one tooltip was shown');
        assert.equal(scheduler.tooltip.getTitleText(), 'Task 2', 'tooltip title is correct');
        assert.equal(scheduler.tooltip.getDateElement().length, 1, 'dates container was rendered');
        assert.equal(scheduler.tooltip.hasDeleteButton(), 1, 'buttons container was rendered');
    });

    test('Scheduler appointment tooltip should has right content when appointmentTooltipTemplate is used', async function(assert) {
        const tasks = getSampleData();
        const data = new DataSource({
            store: tasks
        });

        const scheduler = await createScheduler({
            currentDate: new Date(2015, 1, 9),
            dataSource: data,
            appointmentTooltipTemplate: model => {
                assert.deepEqual(model.appointmentData, tasks[1], 'data is right');
                return $('<div>').addClass('new-scheduler-tooltip-template');
            }
        });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(1, clock);
        clock.restore();

        const $tooltip = $('.new-scheduler-tooltip-template');

        assert.equal($tooltip.length, 1, 'one tooltip with template was shown');
    });

    test('Scheduler appointment tooltip dates are displayed with right format, date/week views', async function(assert) {
        const data = new DataSource({
            store: getSampleData()
        });

        const scheduler = await createScheduler({ currentDate: new Date(2015, 1, 9), dataSource: data, currentView: 'day' });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(1, clock);
        clock.restore();

        assert.equal(scheduler.tooltip.getDateText(), '11:00 AM - 12:00 PM', 'dates and time were displayed correctly');
    });

    test('Scheduler tooltip should be closed after call hideAppointmentTooltip', async function(assert) {
        const data = new DataSource({
            store: getSampleData()
        });

        const scheduler = await createScheduler({ currentDate: new Date(2015, 1, 9), dataSource: data, currentView: 'day' });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(1, clock);
        clock.restore();

        assert.ok(scheduler.tooltip.isVisible(), 'tooltip is shown');

        scheduler.instance.hideAppointmentTooltip();

        assert.notOk(scheduler.tooltip.isVisible(), 'tooltip is hidden');
    });

    test('Appointment Tooltip on Day view should have a right dates', async function(assert) {
        const scheduler = await createScheduler({
            dataSource: [{
                startDate: new Date(2016, 9, 5, 23, 30),
                endDate: new Date(2016, 9, 6, 1),
                text: 'new Date sample'
            }],
            currentDate: new Date(2016, 9, 6),
            views: ['day'],
            currentView: 'day',
            cellDuration: 60
        });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();

        assert.equal(scheduler.tooltip.getDateText(), 'October 5 11:30 PM - October 6 1:00 AM', 'dates and time were displayed correctly');
    });

    test('Scheduler appointment tooltip dates should be correct, when custom timeZone is set', async function(assert) {
        const startDate = new Date(2015, 1, 9, 11);
        const endDate = new Date(2015, 1, 9, 12);
        const data = new DataSource({
            store: [{
                text: 'Task 2',
                startDate: startDate,
                endDate: endDate
            }]
        });

        const deltaTz = getDeltaTz(5, startDate);
        const scheduler = await createScheduler({ currentDate: new Date(2015, 1, 9), dataSource: data, currentView: 'week', timeZone: 'Etc/GMT-5' });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();

        const expectedStartDate = dateLocalization.format(new Date(startDate.getTime() + deltaTz), 'shorttime');
        const expectedEndDate = dateLocalization.format(new Date(endDate.getTime() + deltaTz), 'shorttime');

        assert.equal(scheduler.tooltip.getDateText(), expectedStartDate + ' - ' + expectedEndDate, 'dates and time were displayed correctly');
    });

    test('Scheduler appointment tooltip dates should be correct, when custom timeZone is set as string', async function(assert) {
        const startDate = new Date(2015, 1, 9, 11);
        const endDate = new Date(2015, 1, 9, 12);
        const appointment = {
            text: 'Task 2',
            startDate: startDate,
            endDate: endDate
        };

        const data = new DataSource({
            store: [appointment]
        });
        const deltaTz = getDeltaTz(5, startDate);
        const scheduler = await createScheduler({ currentDate: new Date(2015, 1, 9), dataSource: data, currentView: 'week', timeZone: 'Asia/Ashkhabad' });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();

        const expectedStartDate = dateLocalization.format(new Date(startDate.getTime() + deltaTz), 'shorttime');
        const expectedEndDate = dateLocalization.format(new Date(endDate.getTime() + deltaTz), 'shorttime');

        assert.equal(scheduler.tooltip.getDateText(), expectedStartDate + ' - ' + expectedEndDate, 'dates and time were displayed correctly');
    });

    test('Scheduler appointment tooltip dates should be correct, when appointment timeZone is set', async function(assert) {
        const appointment = {
            text: 'Task',
            startDate: new Date(2015, 1, 9, 11),
            endDate: new Date(2015, 1, 9, 12),
            startDateTimeZone: 'Asia/Ashkhabad', // +5
            endDateTimeZone: 'Asia/Bishkek', // +6
        };

        const scheduler = await createScheduler({
            currentDate: new Date(2015, 1, 9),
            dataSource: [appointment],
            currentView: 'week'
        });
        const expectedDate = scheduler.appointments.getDateText(0);

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();

        assert.equal(scheduler.tooltip.getDateText(), expectedDate, 'dates and time were displayed correctly');
    });

    test('Scheduler appointment tooltip dates should be correct, when appointment timeZone and scheduler timeZone was set', async function(assert) {
        const appointment = {
            text: 'Task',
            startDate: new Date(2015, 1, 9, 11),
            endDate: new Date(2015, 1, 9, 12),
            Timezone: 'Asia/Ashkhabad'
        };

        const scheduler = await createScheduler({
            currentDate: new Date(2015, 1, 9),
            dataSource: [appointment],
            currentView: 'week',
            startDateTimezoneExpr: 'Timezone',
            timeZone: 'Asia/Qyzylorda'
        });

        const expectedDate = scheduler.appointments.getDateText(0);

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();

        assert.equal(scheduler.tooltip.getDateText(), expectedDate, 'dates and time were displayed correctly');
    });

    test('Scheduler appointment tooltip dates are displayed with right format, month view', async function(assert) {
        const data = new DataSource({
            store: getSampleData()
        });

        const scheduler = await createScheduler({ currentDate: new Date(2015, 1, 9), dataSource: data, currentView: 'month' });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(1, clock);
        clock.restore();

        assert.equal(scheduler.tooltip.getDateText(), 'February 9 11:00 AM - 12:00 PM', 'dates and time were displayed correctly');
    });

    test('Tooltip should appear if mouse is over arrow icon', async function(assert) {
        const endDate = new Date(2015, 9, 12);

        const scheduler = await createScheduler({
            currentDate: new Date(2015, 4, 6),
            views: ['month'],
            currentView: 'month',
            firstDayOfWeek: 1,
            dataSource: [{ startDate: new Date(2015, 4, 10), endDate: endDate }]
        });

        const $appointment = $(scheduler.instance.$element()).find('.dx-scheduler-appointment');
        const $arrowIcon = $appointment.find('.dx-scheduler-appointment-reduced-icon');

        $arrowIcon.trigger('dxpointerenter');

        const $tooltip = $('.dx-tooltip');

        assert.equal($tooltip.length, 1, 'Tooltip has appeared');
        assert.equal(Tooltip.getInstance($tooltip).$content().text(), messageLocalization.format('dxScheduler-editorLabelEndDate') + ': October 12, 2015');

        $arrowIcon.trigger('dxpointerleave');
        assert.equal($('.dx-tooltip').length, 0, 'Tooltip has disappeared');
    });

    test('showAppointmentTooltip should be called after click on arrow icon and doesn\'t hide after pointerleave', async function(assert) {
        const endDate = new Date(2015, 9, 12);

        const scheduler = await createScheduler({
            currentDate: new Date(2015, 4, 6),
            views: ['month'],
            currentView: 'month',
            firstDayOfWeek: 1,
            dataSource: [{ startDate: new Date(2015, 4, 10), endDate: endDate }]
        });

        const $appointment = $(scheduler.instance.$element()).find('.dx-scheduler-appointment');
        const $arrowIcon = $appointment.find('.dx-scheduler-appointment-reduced-icon');

        const clock = sinon.useFakeTimers();
        $arrowIcon.trigger('dxpointerenter');
        $arrowIcon.eq(0).trigger('dxclick');
        await clock.tickAsync(300);
        $arrowIcon.trigger('dxpointerleave');
        clock.restore();

        assert.ok(scheduler.tooltip.isVisible(), 'Appointment tooltip is shown');
    });

    test('Tooltip of allDay appointment should display right dates', async function(assert) {
        const startDate = new Date(2015, 2, 5);
        const endDate = new Date(2015, 2, 6);

        const scheduler = await createScheduler({
            currentDate: new Date(2015, 2, 4),
            currentView: 'week',
            dataSource: [{
                text: 'a',
                allDay: true,
                startDate: startDate,
                endDate: endDate
            }]
        });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();

        assert.equal(scheduler.tooltip.getDateText(), dateLocalization.format(startDate, 'monthAndDay') + ' - ' + dateLocalization.format(endDate, 'monthAndDay'), 'dates were displayed correctly');
    });

    test('Tooltip of allDay appointment with startDate = endDate should display right date', async function(assert) {
        const startDate = new Date(2015, 2, 5, 6);
        const endDate = new Date(2015, 2, 5, 10);

        const scheduler = await createScheduler({
            currentDate: new Date(2015, 2, 4),
            currentView: 'week',
            dataSource: [{
                text: 'a',
                allDay: true,
                startDate: startDate,
                endDate: endDate
            }]
        });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();

        assert.equal(scheduler.tooltip.getDateText(), dateLocalization.format(startDate, 'monthAndDay'), 'date was displayed correctly');
    });

    test('Tooltip of multiday appointment should display date & time for usual view', async function(assert) {
        const startDate = new Date(2015, 2, 5, 6);
        const endDate = new Date(2015, 2, 6, 8);

        const scheduler = await createScheduler({
            currentDate: new Date(2015, 2, 4),
            currentView: 'week',
            dataSource: [{
                text: 'a',
                startDate: startDate,
                endDate: endDate
            }]
        });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();

        const startDateString = dateLocalization.format(startDate, dateFormat) + ' ' + dateLocalization.format(startDate, timeFormat);
        const endDateString = dateLocalization.format(endDate, dateFormat) + ' ' + dateLocalization.format(endDate, timeFormat);

        assert.equal(scheduler.tooltip.getDateText(), startDateString + ' - ' + endDateString, 'dates were displayed correctly');
    });

    test('Tooltip of multiday appointment should display date & time for month view', async function(assert) {
        const startDate = new Date(2015, 2, 5, 6);
        const endDate = new Date(2015, 2, 6, 8);

        const scheduler = await createScheduler({
            currentDate: new Date(2015, 2, 4),
            currentView: 'month',
            dataSource: [{
                text: 'a',
                startDate: startDate,
                endDate: endDate
            }]
        });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();

        const startDateString = dateLocalization.format(startDate, dateFormat) + ' ' + dateLocalization.format(startDate, timeFormat);
        const endDateString = dateLocalization.format(endDate, dateFormat) + ' ' + dateLocalization.format(endDate, timeFormat);

        assert.equal(scheduler.tooltip.getDateText(), startDateString + ' - ' + endDateString, 'dates were displayed correctly');
    });

    test('Tooltip of appointment part after midnight should display right date & time', async function(assert) {
        const startDate = new Date(2015, 4, 25, 23, 0);
        const endDate = new Date(2015, 4, 26, 1, 15);

        const scheduler = await createScheduler({
            currentDate: new Date(2015, 4, 25),
            currentView: 'week',
            dataSource: [{
                text: 'a',
                startDate: startDate,
                endDate: endDate
            }]
        });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(1, clock);
        clock.restore();

        const startDateString = dateLocalization.format(startDate, dateFormat) + ' ' + dateLocalization.format(startDate, timeFormat);
        const endDateString = dateLocalization.format(endDate, dateFormat) + ' ' + dateLocalization.format(endDate, timeFormat);

        assert.equal(scheduler.tooltip.getDateText(), startDateString + ' - ' + endDateString, 'dates were displayed correctly');
    });

    test('Tooltip of recurrence appointment part after midnight should display right date & time', async function(assert) {
        const startDate = new Date(2015, 4, 25, 23, 0);
        const endDate = new Date(2015, 4, 26, 1, 15);

        const scheduler = await createScheduler({
            currentDate: new Date(2015, 4, 25),
            currentView: 'month',
            dataSource: [{
                text: 'a',
                startDate: startDate,
                endDate: endDate,
                recurrenceRule: 'FREQ=DAILY;INTERVAL=5'
            }]
        });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(2, clock);
        clock.restore();

        assert.equal(scheduler.tooltip.getDateText(), 'May 30 11:00 PM - May 31 1:15 AM', 'dates were displayed correctly');
    });

    test('Tooltip for recurrence appointment should display right dates(T384181)', async function(assert) {
        const startDate = new Date(2015, 1, 5, 11);
        const endDate = new Date(2015, 1, 5, 12);

        const scheduler = await createScheduler({
            currentDate: new Date(2015, 1, 4),
            views: ['month'],
            currentView: 'month',
            dataSource: [{
                text: 'a',
                startDate: startDate,
                endDate: endDate,
                recurrenceRule: 'FREQ=DAILY'
            }]
        });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(1, clock);
        clock.restore();

        assert.equal(scheduler.tooltip.getDateText(), 'February 6 11:00 AM - 12:00 PM', 'dates and time were displayed correctly');
    });

    test('Tooltip should hide when window was resized', async function(assert) {
        const scheduler = await createScheduler({
            currentDate: new Date(2016, 1, 11),
            currentView: 'week',
            dataSource: [{
                text: 'a',
                allDay: true,
                startDate: new Date(2016, 1, 11, 10),
                endDate: new Date(2016, 1, 11, 15)
            }]
        });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();

        assert.ok(scheduler.tooltip.isVisible(), 'tooltip was shown');
        resizeCallbacks.fire();
        assert.notOk(scheduler.tooltip.isVisible(), 'tooltip was hidden');
    });

    test('Appointment tooltip should be hidden after immediately delete key pressing', async function(assert) {
        const appt = {
            text: 'a',
            allDay: true,
            startDate: new Date(2016, 1, 11, 10),
            endDate: new Date(2016, 1, 11, 15)
        };

        const scheduler = await createScheduler({
            currentDate: new Date(2016, 1, 11),
            currentView: 'week',
            dataSource: [appt],
            focusStateEnabled: true
        });

        const $appt1 = $(scheduler.instance.$element()).find('.dx-scheduler-appointment').eq(0);
        const keyboard = keyboardMock($appt1);
        const notifyStub = sinon.spy(scheduler.instance.getAppointmentsInstance(), 'notifyObserver');

        $appt1.trigger('dxclick');
        keyboard.keyDown('del');

        assert.ok(notifyStub.called, 'notify is called');
        assert.ok(notifyStub.withArgs('onDeleteButtonPress').called, 'onDeleteButtonPress is called');
        assert.notOk(notifyStub.withArgs('showAppointmentTooltip').called, 'showAppointmentTooltip isn\'t called');
    });

    test('Tooltip should has right boundary in timeline view if appointment is allDay', async function(assert) {
        const scheduler = await createScheduler({
            dataSource: [{
                startDate: new Date(2018, 8, 24),
                endDate: new Date(2018, 8, 25)
            }],
            currentView: 'timelineDay',
            currentDate: new Date(2018, 8, 24)
        });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();

        const tooltip = Tooltip.getInstance($('.dx-tooltip'));
        const tooltipBoundary = tooltip.option('position').boundary.get(0);
        const containerBoundary = scheduler.instance.getWorkSpaceScrollableContainer().get(0);

        assert.deepEqual(tooltipBoundary, containerBoundary, 'tooltip has right boundary');
    });

    test('the targetedAppointmentData parameter appends to arguments of the appointment tooltip template for a recurrence rule', async function(assert) {
        const scheduler = await createScheduler({
            dataSource: [{
                startDate: new Date(2015, 4, 24, 9),
                endDate: new Date(2015, 4, 24, 11),
                allDay: true,
                recurrenceRule: 'FREQ=DAILY;COUNT=3',
                text: 'Task 2'
            }],
            height: 600,
            currentDate: new Date(2015, 4, 24),
            currentView: 'month',
            views: ['month'],
            appointmentTooltipTemplate: model => {
                assert.deepEqual(
                    model.targetedAppointmentData,
                    {
                        allDay: true,
                        endDate: new Date(2015, 4, 25, 11),
                        recurrenceRule: 'FREQ=DAILY;COUNT=3',
                        startDate: new Date(2015, 4, 25, 9),
                        text: 'Task 2',
                        displayEndDate: new Date(2015, 4, 25, 11),
                        displayStartDate: new Date(2015, 4, 25, 9),
                    }
                );
            }
        });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(1, clock);
        clock.restore();
    });

    test('the targetedAppointmentData parameter appends to arguments of the appointment tooltip template for a non-recurrence rule', async function(assert) {
        const scheduler = await createScheduler({
            dataSource: [{
                startDate: new Date(2015, 4, 24, 9),
                endDate: new Date(2015, 4, 24, 11),
                text: 'Task 1'
            }],
            height: 600,
            currentDate: new Date(2015, 4, 24),
            currentView: 'month',
            views: ['month'],
            appointmentTooltipTemplate: model => {
                assert.deepEqual(model.targetedAppointmentData, {
                    startDate: new Date(2015, 4, 24, 9),
                    endDate: new Date(2015, 4, 24, 11),
                    text: 'Task 1',
                    displayStartDate: new Date(2015, 4, 24, 9),
                    displayEndDate: new Date(2015, 4, 24, 11),
                });
            }
        });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();
    });
});


module('Appointment tooltip template', moduleConfig, () => {
    const checkAppointmentDataInTooltipTemplate = async(assert, dataSource, currentDate) => {
        const scheduler = await createWrapper({
            dataSource: dataSource,
            height: 600,
            currentDate: currentDate,
            currentView: 'month',
            views: ['month'],
            appointmentTooltipTemplate: model => {
                assert.equal(dataSource.indexOf(model.appointmentData), 0, 'appointment data contains in the data source');
            }
        });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();
    };

    test('The appointmentData argument of the appointment tooltip template is should be instance of the data source', async function(assert) {
        const dataSource = [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            },
            {
                text: 'Task 2',
                startDate: new Date(2015, 1, 9, 11, 0),
                endDate: new Date(2015, 1, 9, 12, 0)
            }
        ];
        await checkAppointmentDataInTooltipTemplate(assert, dataSource, new Date(2015, 1, 9));
    });

    test('The appointmentData argument of the appointment tooltip template is should be instance of the data source for recurrence rule', async function(assert) {
        const dataSource = [{
            startDate: new Date(2015, 4, 24, 9),
            endDate: new Date(2015, 4, 24, 11),
            recurrenceRule: 'FREQ=DAILY;COUNT=3',
            allDay: true,
            text: 'Task 1'
        }, {
            startDate: new Date(2015, 4, 24, 19),
            endDate: new Date(2015, 4, 24, 31),
            allDay: true,
            recurrenceRule: 'FREQ=DAILY;COUNT=2',
            text: 'Task 2'
        }];

        await checkAppointmentDataInTooltipTemplate(assert, dataSource, new Date(2015, 4, 24));
    });

    module('isButtonClicked argument in appointmentTooltipTemplate', () => {
        const data = [{
            text: '1',
            priorityId: [2],
            startDate: new Date(2021, 3, 26),
            endDate: new Date(2021, 3, 27),
        }, {
            text: '2',
            priorityId: [2],
            startDate: new Date(2021, 3, 26),
            endDate: new Date(2021, 3, 27),
        }, {
            text: '3',
            priorityId: [2],
            startDate: new Date(2021, 3, 26),
            endDate: new Date(2021, 3, 27),
        }, {
            text: '4',
            priorityId: [2],
            startDate: new Date(2021, 3, 26),
            endDate: new Date(2021, 3, 27),
        }];

        test('should be false if clicked on single appointment', async function(assert) {
            const scheduler = await createWrapper({
                dataSource: data,
                views: ['month'],
                currentView: 'month',
                currentDate: new Date(2021, 3, 27),
                height: 600,
                appointmentTooltipTemplate: (model) => assert.notOk(model.isButtonClicked)
            });

            const clock = sinon.useFakeTimers();
            await scheduler.appointments.click(0, clock);
            clock.restore();
            assert.expect(1);
        });

        test('should be true if clicked on compact button', async function(assert) {
            const scheduler = await createWrapper({
                dataSource: data,
                views: ['month'],
                currentView: 'month',
                currentDate: new Date(2021, 3, 27),
                height: 600,
                appointmentTooltipTemplate: (model) => assert.ok(model.isButtonClicked),
                maxAppointmentsPerCell: 2
            });

            scheduler.appointments.compact.click(0);
            assert.expect(2);
        });
    });
});

module('New common tooltip for compact and cell appointments', moduleConfig, () => {
    const createScheduler = (options, data) => {
        const defaultOption = {
            dataSource: data || getSimpleDataArray(),
            views: ['agenda', 'day', 'week', 'workWeek', 'month'],
            currentView: 'month',
            currentDate: new Date(2017, 4, 25),
            startDayHour: 9,
            height: 600,
        };
        return createWrapper($.extend(defaultOption, options));
    };

    test('Title in tooltip should equals title of cell appointments in month view', async function(assert) {
        const scheduler = await createScheduler({ maxAppointmentsPerCell: 2 }, undefined);
        assert.notOk(scheduler.tooltip.isVisible(), 'On page load tooltip should be invisible');

        const clock = sinon.useFakeTimers();
        for(let i = 0; i < scheduler.appointments.getAppointmentCount(); i++) {
            await scheduler.appointments.click(i, clock);
            assert.equal(scheduler.tooltip.getTitleText(), scheduler.appointments.getTitleText(i), 'Title in tooltip should be equal with appointment');
        }
        clock.restore();

        const compactAppointmentSample = [
            ['Install New Router in Dev Room'],
            ['New Brochures'],
            ['Upgrade Personal Computers'],
            ['Brochure Design Review'],
            ['Upgrade Server Hardware', 'Submit New Website Design']
        ];

        for(let i = 0; i < scheduler.appointments.compact.getButtonCount(); i++) {
            const compactAppointmentSampleItem = compactAppointmentSample[i];
            scheduler.appointments.compact.click(i);

            assert.equal(scheduler.appointments.compact.getButtonText(i), `${compactAppointmentSampleItem.length} more`, 'Count of compact appointments in button is match of count real appointments');

            compactAppointmentSampleItem.forEach((sampleTitle, index) => {
                assert.equal(scheduler.tooltip.getTitleText(index), sampleTitle, 'Title in tooltip should be equal with sample data');
            });
        }
    });

    test('Title in tooltip should equals title of cell appointments in other views', async function(assert) {
        const scheduler = await createScheduler(undefined, undefined);
        assert.notOk(scheduler.tooltip.isVisible(), 'On page load tooltip should be invisible');

        const views = ['week', 'day', 'workWeek', 'agenda'];

        for(let i = 0; i < views.length; i++) {
            const view = views[i];
            scheduler.instance.option('currentView', view);
            const clock = sinon.useFakeTimers();
            for(let i = 0; i < scheduler.appointments.getAppointmentCount(); i++) {
                await scheduler.appointments.click(i, clock);
                assert.equal(scheduler.tooltip.getTitleText(), scheduler.appointments.getTitleText(i), 'Title in tooltip should be equal with appointment');
            }
            clock.restore();
        }
    });

    test('Delete button in tooltip shouldn\'t render if editing = false', async function(assert) {
        const scheduler = await createScheduler({
            editing: false
        }, undefined);

        let clock = sinon.useFakeTimers();
        for(let i = 0; i < scheduler.appointments.getAppointmentCount(); i++) {
            await scheduler.appointments.click(i, clock);
            assert.notOk(scheduler.tooltip.hasDeleteButton(), 'Delete button shouldn\'t render');
        }
        clock.restore();

        for(let i = 0; i < scheduler.appointments.compact.getButtonCount(); i++) {
            scheduler.appointments.compact.click(i);
            assert.notOk(scheduler.tooltip.hasDeleteButton(), 'Delete button shouldn\'t render for compact appointments');
        }

        scheduler.instance.option('editing', true);

        clock = sinon.useFakeTimers();
        for(let i = 0; i < scheduler.appointments.getAppointmentCount(); i++) {
            await scheduler.appointments.click(i, clock);
            assert.ok(scheduler.tooltip.hasDeleteButton(), 'Delete button should be render');
        }
        clock.restore();
    });

    test('Compact button should hide or show after change in data source', async function(assert) {
        const dataList = getSimpleDataArray();
        const scheduler = await createScheduler({ maxAppointmentsPerCell: 2 }, dataList);

        assert.equal(scheduler.appointments.compact.getButtonText(), '1 more', 'Value on init should be correct');
        assert.equal(scheduler.appointments.compact.getButtonCount(), 5, 'Count of compact buttons on init should be correct');

        scheduler.instance.deleteAppointment(dataList[0]);
        assert.equal(scheduler.appointments.compact.getButtonCount(), 4, 'Count of compact buttons should be reduce after delete appointment');

        scheduler.instance.addAppointment({
            text: 'Temp appointment',
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30)
        });
        assert.equal(scheduler.appointments.compact.getButtonText(), '1 more', 'Count of compact buttons should be increase after add appointment');
        assert.equal(scheduler.appointments.compact.getButtonCount(), 5, 'Count of compact buttons should be increase after add appointment');

        scheduler.instance.addAppointment({
            text: 'Temp appointment 2',
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30)
        });
        scheduler.instance.addAppointment({
            text: 'Temp appointment 3',
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30)
        });
        assert.equal(scheduler.appointments.compact.getButtonText(4), '3 more', 'Count of compact buttons should be increase after add appointment');
        assert.equal(scheduler.appointments.compact.getButtonCount(), 5, 'Count of compact buttons shouldn\'t change');
    });

    test('Tooltip should hide after perform action', async function(assert) {
        const scheduler = await createScheduler({ maxAppointmentsPerCell: 2 }, undefined);

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();
        assert.ok(scheduler.tooltip.isVisible(), 'Tooltip should visible');

        scheduler.tooltip.clickOnItem();
        assert.notOk(scheduler.tooltip.isVisible(), 'Tooltip shouldn\'t visible');

        scheduler.appointmentPopup.clickCancelButton();

        scheduler.appointments.compact.click(scheduler.appointments.compact.getButtonCount() - 1);
        assert.ok(scheduler.tooltip.isVisible(), 'Tooltip should visible');

        scheduler.tooltip.clickOnItem(1);
        assert.notOk(scheduler.tooltip.isVisible(), 'Tooltip shouldn\'t visible');

        scheduler.appointmentPopup.clickCancelButton();

        scheduler.appointments.compact.click(scheduler.appointments.compact.getButtonCount() - 1);
        assert.equal(scheduler.tooltip.getItemCount(), 2, 'Count of items in tooltip should be equal 2');

        scheduler.tooltip.clickOnDeleteButton(1);
        assert.ok(scheduler.tooltip.isVisible(), 'Tooltip should be visible');
        assert.equal(scheduler.tooltip.getItemCount(), 1, 'Count of items in tooltip should be equal 1');

        scheduler.tooltip.clickOnDeleteButton();
        assert.notOk(scheduler.tooltip.isVisible(), 'Tooltip shouldn\'t visible');
    });

    test('Tooltip should work correct in week view', async function(assert) {
        const DEFAULT_TEXT = 'Temp appointment';
        const scheduler = await createScheduler({
            currentView: 'week',
            width: 600
        });

        assert.equal(scheduler.appointments.compact.getButtonCount(), 0, 'Compact button shouldn\'t render on init');

        scheduler.instance.addAppointment({
            text: DEFAULT_TEXT,
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30)
        });

        assert.equal(scheduler.appointments.compact.getButtonCount(), 1, 'Compact button should render');
        scheduler.appointments.compact.click();
        assert.equal(scheduler.tooltip.getTitleText(), DEFAULT_TEXT, 'Title in tooltip should equal text in appointment cell');

        scheduler.tooltip.clickOnDeleteButton();
        assert.equal(scheduler.appointments.compact.getButtonCount(), 0, 'Compact button shouldn\'t render after click delete button');
    });

    test('appointmentTooltipTemplate method should pass valid arguments', async function(assert) {
        let templateCallCount = 0;
        const scheduler = await createScheduler({
            appointmentTooltipTemplate: (model, index, contentElement) => {
                assert.ok($(contentElement).hasClass('dx-list-item-content'), 'Content element should be list item');
                assert.equal(model.targetedAppointmentData.text, model.appointmentData.text, 'targetedAppointmentData should be not empty');
                assert.equal(index, templateCallCount, 'Index should be correct pass in template callback');

                templateCallCount++;
                return $('<div />').text(`template item index - ${index}`);
            },
            maxAppointmentsPerCell: 2
        }, undefined);

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();
        assert.ok(scheduler.tooltip.checkItemElementHtml(0, `template item index - ${0}`), `Template should render content contains ${0} item index`);

        templateCallCount = 0;

        const buttonCount = scheduler.appointments.compact.getButtonCount();
        scheduler.appointments.compact.click(buttonCount - 1);

        assert.ok(scheduler.tooltip.checkItemElementHtml(0, `template item index - ${0}`), `Template should render content contains ${0} item index. Compact appointments`);
        assert.ok(scheduler.tooltip.checkItemElementHtml(1, `template item index - ${1}`), `Template should render content contains ${1} item index. Compact appointments`);
    });

    if(devices.current().deviceType === 'desktop') {
        module('Keyboard navigation in tooltip', () => {
            const ITEM_FOCUSED_STATE_CLASS_NAME = 'dx-state-focused';

            test('List should be navigate by keyboard', async function(assert) {
                const scheduler = await createScheduler({ maxAppointmentsPerCell: 2 }, undefined);

                const checkFocusedState = index => scheduler.tooltip.getItemElement(index).hasClass(ITEM_FOCUSED_STATE_CLASS_NAME);

                const clock = sinon.useFakeTimers();
                await scheduler.appointments.click(0, clock);
                clock.restore();

                assert.notOk(checkFocusedState(0), 'On first show tooltip, list item shouldn\'t focused');

                const keyboard = keyboardMock(scheduler.tooltip.getContentElement().find('[tabindex=0]'));
                keyboard.keyDown('down');

                assert.ok(checkFocusedState(0), 'After press key down, list item should focused');

                const buttonCount = scheduler.appointments.compact.getButtonCount();
                scheduler.appointments.compact.click(buttonCount - 1);

                assert.notOk(checkFocusedState(0), 'After tooltip showed, list item shouldn\'t focused');

                keyboard.keyDown('down');
                assert.ok(checkFocusedState(0), 'After press key down, first list item should focused');

                keyboard.keyDown('down');
                assert.ok(checkFocusedState(1), 'After press key down, second list item should focused');
            });

            test('focusStateEnabled property should disable or enable navigate in list', async function(assert) {
                const scheduler = await createScheduler(undefined, undefined);

                const clock = sinon.useFakeTimers();
                await scheduler.appointments.click(0, clock);
                clock.restore();

                const buttonCount = scheduler.appointments.compact.getButtonCount();
                const keyboard = keyboardMock(scheduler.tooltip.getContentElement().find('[tabindex=0]'));
                const checkFocusedState = index => scheduler.tooltip.getItemElement(index).hasClass(ITEM_FOCUSED_STATE_CLASS_NAME);

                scheduler.option('focusStateEnabled', false);
                scheduler.appointments.compact.click(buttonCount - 1);

                keyboard.keyDown('down');
                assert.notOk(checkFocusedState(0));

                scheduler.instance.hideAppointmentTooltip();

                scheduler.option('focusStateEnabled', true);
                scheduler.appointments.compact.click(buttonCount - 1);

                keyboard.keyDown('down');
                assert.ok(checkFocusedState(0));
            });
        });
    }

    test('onAppointmentDblClick event should raised after click on tooltip from collector and in adaptivity mode', async function(assert) {
        const options = {
            onAppointmentClick: () => {}
        };
        const stub = sinon.stub(options, 'onAppointmentClick');
        const scheduler = await createScheduler(options, undefined);

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();
        stub.reset();
        scheduler.tooltip.clickOnItem();
        assert.equal(stub.callCount, 0, 'onAppointmentClick shouldn\'t raised after click on common tooltip');

        scheduler.appointments.compact.click();
        scheduler.tooltip.clickOnItem();
        assert.equal(stub.callCount, 1, 'onAppointmentClick should raised after click on tooltip from collector');

        stub.reset();

        scheduler.instance.option('adaptivityEnabled', true);
        scheduler.appointments.compact.click();
        scheduler.tooltip.clickOnItem();
        assert.equal(stub.callCount, 1, 'onAppointmentClick should raised in adaptivity mode');
    });

    test('Tooltip should crop list, if list has many items', async function(assert) {
        const scheduler = await createScheduler({
            maxAppointmentsPerCell: 2,
            dataSource: [
                {
                    text: 'Prepare 2015 Marketing Plan',
                    startDate: new Date(2017, 4, 25, 11, 0),
                    endDate: new Date(2017, 4, 25, 13, 30)
                }, {
                    text: 'Prepare 2015 Marketing Plan',
                    startDate: new Date(2017, 4, 25, 11, 0),
                    endDate: new Date(2017, 4, 25, 13, 30)
                }, {
                    text: 'Prepare 2015 Marketing Plan',
                    startDate: new Date(2017, 4, 25, 11, 0),
                    endDate: new Date(2017, 4, 25, 13, 30)
                }, {
                    text: 'Prepare 2015 Marketing Plan',
                    startDate: new Date(2017, 4, 25, 11, 0),
                    endDate: new Date(2017, 4, 25, 13, 30)
                }, {
                    text: 'Prepare 2015 Marketing Plan',
                    startDate: new Date(2017, 4, 25, 11, 0),
                    endDate: new Date(2017, 4, 25, 13, 30)
                }, {
                    text: 'Prepare 2015 Marketing Plan',
                    startDate: new Date(2017, 4, 25, 11, 0),
                    endDate: new Date(2017, 4, 25, 13, 30)
                }
            ]
        });

        const { getItemCount, getItemElement, getOverlayContentElement } = scheduler.tooltip;

        scheduler.appointments.compact.click();
        assert.equal(getItemCount(), 4, 'Tooltip should render 4 items');

        assert.ok(getItemElement().outerHeight() * 4 > getOverlayContentElement().outerHeight(), 'Tooltip height should less then list height');

        scheduler.instance.option('dataSource', [
            {
                text: 'Prepare 2015 Marketing Plan',
                startDate: new Date(2017, 4, 25, 11, 0),
                endDate: new Date(2017, 4, 25, 13, 30)
            }, {
                text: 'Prepare 2015 Marketing Plan',
                startDate: new Date(2017, 4, 25, 11, 0),
                endDate: new Date(2017, 4, 25, 13, 30)
            }, {
                text: 'Prepare 2015 Marketing Plan',
                startDate: new Date(2017, 4, 25, 11, 0),
                endDate: new Date(2017, 4, 25, 13, 30)
            }
        ]);
        await waitAsync(0);

        assert.ok(scheduler.tooltip.isVisible(), 'Tooltip should be visible');
        assert.equal(getItemCount(), 1, 'Tooltip should render 1 item');
        assert.roughEqual(getItemElement().outerHeight(), getOverlayContentElement().outerHeight(), 10, 'Tooltip height should equals then list height');
    });

    test('Component should draw correctly, if component append to container in appointmentTooltipTemplate', async function(assert) {
        const data = [
            {
                text: 'Website Re-Design Plan',
                startDate: new Date(2017, 4, 22, 9, 30),
                endDate: new Date(2017, 4, 22, 11, 30)
            }, {
                text: 'Book Flights to San Fran for Sales Trip',
                startDate: new Date(2017, 4, 22, 12, 0),
                endDate: new Date(2017, 4, 22, 13, 0),
                allDay: true
            }, {
                text: 'Install New Router in Dev Room',
                startDate: new Date(2017, 4, 22, 14, 30),
                endDate: new Date(2017, 4, 22, 15, 30)
            }, {
                text: 'Approve Personal Computer Upgrade Plan',
                startDate: new Date(2017, 4, 22, 10, 0),
                endDate: new Date(2017, 4, 22, 11, 0)
            }
        ];

        const findButton = index => {
            const tooltipContentElement = scheduler.tooltip.getItemElement(index);
            return tooltipContentElement.find(`#button-${index}`).dxButton('instance');
        };

        const getExpectedText = index => `test-${index}`;

        const scheduler = await createScheduler({
            dataSource: data,
            views: ['month'],
            currentView: 'month',
            currentDate: new Date(2017, 4, 25),
            appointmentTooltipTemplate: (model, index, container) => {
                const div = $('<div>').attr('id', `button-${index}`);
                $(container).append(div);
                $(`#button-${index}`).dxButton({ text: `test-${index}` });
            },
            startDayHour: 9,
            height: 600,
            maxAppointmentsPerCell: 2
        }, undefined);

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();
        assert.equal(findButton(0).option('text'), getExpectedText(0), 'dxButton component should placed in item of tooltip');

        scheduler.appointments.compact.click();
        assert.equal(findButton(0).option('text'), getExpectedText(0), 'dxButton component should placed in first item of compact tooltip');
        assert.equal(findButton(1).option('text'), getExpectedText(1), 'dxButton component should placed in second item of compact tooltip');
    });

    test('onAppointmentDblClick should have correct targetedAppointmentData', async function(assert) {
        const scheduler = await createScheduler({
            views: [{
                type: 'week',
                maxAppointmentsPerCell: 1,
            }],
            currentDate: new Date(2020, 11, 1),
            dataSource: [{
                startDate: new Date(2020, 11, 1, 9),
                endDate: new Date(2020, 11, 1, 9, 30),
                recurrenceRule: 'FREQ=DAILY',
            }, {
                startDate: new Date(2020, 11, 1, 9),
                endDate: new Date(2020, 11, 1, 9, 30),
                recurrenceRule: 'FREQ=DAILY',
            }],
            currentView: 'week',
            onAppointmentClick: ({ targetedAppointmentData }) => {
                const expectedAppointment = {
                    startDate: new Date(2020, 11, 3, 9),
                    displayStartDate: new Date(2020, 11, 3, 9),
                    endDate: new Date(2020, 11, 3, 9, 30),
                    displayEndDate: new Date(2020, 11, 3, 9, 30),
                    recurrenceRule: 'FREQ=DAILY',
                };
                assert.deepEqual(targetedAppointmentData, expectedAppointment, 'Correct targeted appointment');
            },
        });

        scheduler.appointments.compact.click(2);
        scheduler.tooltip.clickOnItem();
        scheduler.appointmentPopup.dialog.hide();
    });
});

module('onAppointmentTooltipShowing event', moduleConfig, () => {
    const data = [{
        text: '1',
        priorityId: [2],
        startDate: new Date(2021, 3, 26),
        endDate: new Date(2021, 3, 27),
    }, {
        text: '2',
        priorityId: [2],
        startDate: new Date(2021, 3, 26),
        endDate: new Date(2021, 3, 27),
    }, {
        text: '3',
        priorityId: [2],
        startDate: new Date(2021, 3, 26),
        endDate: new Date(2021, 3, 27),
    }, {
        text: '4',
        priorityId: [2],
        startDate: new Date(2021, 3, 26),
        endDate: new Date(2021, 3, 27),
    }];

    test('e.cancel argument should be prevent showing tooltip', async function(assert) {
        const scheduler = await createWrapper({
            dataSource: data,
            views: ['month'],
            currentView: 'month',
            currentDate: new Date(2021, 3, 27),
            height: 600,
            onAppointmentTooltipShowing: (e) => e.cancel = true
        });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();

        assert.notOk(scheduler.tooltip.isVisible());
    });

    test('Arguments should be valid on a single appointment', async function(assert) {
        const scheduler = await createWrapper({
            dataSource: data,
            views: ['month'],
            currentView: 'month',
            currentDate: new Date(2021, 3, 27),
            height: 600,
            onAppointmentTooltipShowing: (e) => {
                const appointment = e.appointments[0];

                assert.deepEqual(appointment.appointmentData, data[0]);
                assert.deepEqual({
                    ...appointment.appointmentData,
                    displayStartDate: appointment.appointmentData.startDate,
                    displayEndDate: new Date(appointment.appointmentData.endDate),
                }, appointment.currentAppointmentData);
            }
        });

        const clock = sinon.useFakeTimers();
        await scheduler.appointments.click(0, clock);
        clock.restore();
        assert.expect(2);
    });

    test('Arguments should be valid on a compact button', async function(assert) {
        const scheduler = await createWrapper({
            dataSource: data,
            views: ['month'],
            currentView: 'month',
            currentDate: new Date(2021, 3, 27),
            height: 600,
            onAppointmentTooltipShowing: (e) => {
                const appointment3 = e.appointments[0];
                const appointment4 = e.appointments[1];

                assert.deepEqual(appointment3.appointmentData, data[2]);
                assert.deepEqual({
                    ...appointment3.appointmentData,
                    displayStartDate: appointment3.appointmentData.startDate,
                    displayEndDate: appointment3.appointmentData.endDate,
                }, appointment3.currentAppointmentData);

                assert.deepEqual(appointment4.appointmentData, data[3]);
                assert.deepEqual({
                    ...appointment4.appointmentData,
                    displayStartDate: appointment4.appointmentData.startDate,
                    displayEndDate: appointment4.appointmentData.endDate,
                }, appointment4.currentAppointmentData);
            },
            maxAppointmentsPerCell: 2
        });

        scheduler.appointments.compact.click(0);
        assert.expect(4);
    });
});
