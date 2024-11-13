import $ from 'jquery';
import dateSerialization from 'core/utils/date_serialization';
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

import 'generic_light.css!';
import '__internal/scheduler/m_scheduler';

const dateFormat = 'monthandday';
const timeFormat = 'shorttime';

const { testStart, module, test } = QUnit;

testStart(() => initTestMarkup());

const moduleConfig = {
    beforeEach() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },

    afterEach() {
        fx.off = false;
        hide();
        this.clock.restore();
    }
};

module('Integration: Appointment tooltip', moduleConfig, () => {
    const createScheduler = (options, clock) => createWrapper($.extend(options, { height: 600 }), clock);
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

    test('Tooltip marker should be color up in resource color', function(assert) {
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

        const scheduler = createScheduler({
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
        }, this.clock);

        views.forEach(view => {
            scheduler.option('currentView', view);

            scheduler.appointments.getAppointments().each(index => {
                scheduler.appointments.click(index);

                const marker = scheduler.tooltip.getMarker();
                assert.equal(marker.css('backgroundColor'), priorities[index].color, `marker color in tooltip should equal color in resource, ${view} view`);
            });
        });
    });

    test('After change view type, tooltip should be appear after click on appointment, group mode(T802158)', function(assert) {
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

        const scheduler = createScheduler({
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
        }, this.clock);

        defaultViews.forEach(view => {
            scheduler.option('currentView', view);
            scheduler.appointments.click();
            assert.ok(scheduler.tooltip.isVisible(), `tooltip should be visible after click on item in ${view} view`);
        });
    });

    test('There is no need to check recurring appointment if editing.allowUpdating is false', function(assert) {
        const scheduler = createScheduler({
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

    test('Delete button should not exist if editing.allowUpdating is false', function(assert) {
        const scheduler = createScheduler({
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

    test('Click on appointment should call scheduler.showAppointmentTooltip', function(assert) {
        const data = new DataSource({
            store: getSampleData()
        });

        const scheduler = createScheduler({ currentDate: new Date(2015, 1, 9), dataSource: data }, this.clock);
        const stub = sinon.stub(scheduler.instance, 'showAppointmentTooltip');

        scheduler.appointments.click(1);

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

    test('Shown tooltip should have right boundary', function(assert) {
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

        const scheduler = createScheduler({ currentDate: new Date(2015, 1, 9), dataSource: data });

        const $firstAppointment = $(scheduler.instance.$element()).find('.dx-scheduler-appointment').eq(1);
        const firstItemData = dataUtils.data($firstAppointment[0], 'dxItemData');

        scheduler.instance.showAppointmentTooltip(firstItemData, $firstAppointment);
        assert.deepEqual(Tooltip.getInstance($('.dx-tooltip')).option('position').boundary.get(0), scheduler.instance.getWorkSpace().$element().find('.dx-scrollable-container').get(0), 'Boundary is correct');

        const $secondAppointment = $(scheduler.instance.$element()).find('.dx-scheduler-appointment').eq(0);
        const secondItemData = dataUtils.data($secondAppointment[0], 'dxItemData');

        scheduler.instance.showAppointmentTooltip(secondItemData, $secondAppointment);
        assert.deepEqual(Tooltip.getInstance($('.dx-tooltip')).option('position').boundary.get(0), $(scheduler.instance.$element()).get(0), 'Boundary of allDay appointment is correct');
    });

    test('\'rtlEnabled\' option value should be passed to appointmentTooltip', function(assert) {
        const data = new DataSource({
            store: getSampleData()
        });

        const scheduler = createScheduler({ currentDate: new Date(2015, 1, 9), dataSource: data, rtlEnabled: true }, this.clock);
        this.clock.tick(10);

        scheduler.appointments.click(1);

        assert.equal(Tooltip.getInstance($('.dx-tooltip')).option('rtlEnabled'), true, 'rtlEnabled for tooltip was set to true');
    });

    test('Click on tooltip-edit button should call scheduler._appointmentPopup and hide tooltip', function(assert) {
        const data = new DataSource({
            store: getSampleData()
        });

        const scheduler = createScheduler({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        }, this.clock);

        const stub = sinon.stub(scheduler.instance._appointmentPopup, 'show');

        scheduler.appointments.click(1);
        scheduler.tooltip.clickOnItem();

        const args = stub.getCall(0).args;

        assert.deepEqual(args[0], {
            startDate: new Date(2015, 1, 9, 11, 0),
            endDate: new Date(2015, 1, 9, 12, 0),
            text: 'Task 2'
        },
        'show has a right appointment data arg');

        assert.equal(args[1].isToolbarVisible, true, 'show has a right createNewAppointment arg');

        assert.notOk(scheduler.tooltip.isVisible(), 'tooltip was hidden');
    });

    test('Scheduler appointment tooltip should has right content', function(assert) {
        const data = new DataSource({
            store: getSampleData()
        });

        const scheduler = createScheduler({ currentDate: new Date(2015, 1, 9), dataSource: data }, this.clock);

        scheduler.appointments.click(1);

        assert.equal(scheduler.tooltip.getContentElement().length, 1, 'one tooltip was shown');
        assert.equal(scheduler.tooltip.getTitleText(), 'Task 2', 'tooltip title is correct');
        assert.equal(scheduler.tooltip.getDateElement().length, 1, 'dates container was rendered');
        assert.equal(scheduler.tooltip.hasDeleteButton(), 1, 'buttons container was rendered');
    });

    test('Scheduler appointment tooltip should has right content when appointmentTooltipTemplate is used', function(assert) {
        const tasks = getSampleData();
        const data = new DataSource({
            store: tasks
        });

        const scheduler = createScheduler({
            currentDate: new Date(2015, 1, 9),
            dataSource: data,
            appointmentTooltipTemplate: model => {
                assert.deepEqual(model.appointmentData, tasks[1], 'data is right');
                return $('<div>').addClass('new-scheduler-tooltip-template');
            }
        }, this.clock);

        scheduler.appointments.click(1);

        const $tooltip = $('.new-scheduler-tooltip-template');

        assert.equal($tooltip.length, 1, 'one tooltip with template was shown');
    });

    test('Scheduler appointment tooltip dates are displayed with right format, date/week views', function(assert) {
        const data = new DataSource({
            store: getSampleData()
        });

        const scheduler = createScheduler({ currentDate: new Date(2015, 1, 9), dataSource: data, currentView: 'day' }, this.clock);

        scheduler.appointments.click(1);

        assert.equal(scheduler.tooltip.getDateText(), '11:00 AM - 12:00 PM', 'dates and time were displayed correctly');
    });

    test('Scheduler tooltip should be closed after call hideAppointmentTooltip', function(assert) {
        const data = new DataSource({
            store: getSampleData()
        });

        const scheduler = createScheduler({ currentDate: new Date(2015, 1, 9), dataSource: data, currentView: 'day' }, this.clock);

        scheduler.appointments.click(1);

        assert.ok(scheduler.tooltip.isVisible(), 'tooltip is shown');

        scheduler.instance.hideAppointmentTooltip();

        this.clock.tick(300);
        assert.notOk(scheduler.tooltip.isVisible(), 'tooltip is hidden');
    });

    test('Appointment Tooltip on Day view should have a right dates', function(assert) {
        const scheduler = createScheduler({
            dataSource: [{
                startDate: new Date(2016, 9, 5, 23, 30),
                endDate: new Date(2016, 9, 6, 1),
                text: 'new Date sample'
            }],
            currentDate: new Date(2016, 9, 6),
            views: ['day'],
            currentView: 'day',
            cellDuration: 60
        }, this.clock);

        scheduler.appointments.click();

        assert.equal(scheduler.tooltip.getDateText(), 'October 5 11:30 PM - October 6 1:00 AM', 'dates and time were displayed correctly');
    });

    test('Scheduler appointment tooltip dates should be correct, when custom timeZone is set', function(assert) {
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
        const scheduler = createScheduler({ currentDate: new Date(2015, 1, 9), dataSource: data, currentView: 'week', timeZone: 'Etc/GMT-5' }, this.clock);

        scheduler.appointments.click();

        const expectedStartDate = dateLocalization.format(new Date(startDate.getTime() + deltaTz), 'shorttime');
        const expectedEndDate = dateLocalization.format(new Date(endDate.getTime() + deltaTz), 'shorttime');

        assert.equal(scheduler.tooltip.getDateText(), expectedStartDate + ' - ' + expectedEndDate, 'dates and time were displayed correctly');
    });

    test('Scheduler appointment tooltip dates should be correct, when custom timeZone is set as string', function(assert) {
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
        const scheduler = createScheduler({ currentDate: new Date(2015, 1, 9), dataSource: data, currentView: 'week', timeZone: 'Asia/Ashkhabad' }, this.clock);

        scheduler.appointments.click();

        const expectedStartDate = dateLocalization.format(new Date(startDate.getTime() + deltaTz), 'shorttime');
        const expectedEndDate = dateLocalization.format(new Date(endDate.getTime() + deltaTz), 'shorttime');

        assert.equal(scheduler.tooltip.getDateText(), expectedStartDate + ' - ' + expectedEndDate, 'dates and time were displayed correctly');
    });

    test('Scheduler appointment tooltip dates should be correct, when appointment timeZone is set', function(assert) {
        const appointment = {
            text: 'Task',
            startDate: new Date(2015, 1, 9, 11),
            endDate: new Date(2015, 1, 9, 12),
            startDateTimeZone: 'Asia/Ashkhabad', // +5
            endDateTimeZone: 'Asia/Bishkek', // +6
        };

        const scheduler = createScheduler({
            currentDate: new Date(2015, 1, 9),
            dataSource: [appointment],
            currentView: 'week'
        }, this.clock);
        const expectedDate = scheduler.appointments.getDateText(0);

        scheduler.appointments.click(0);

        assert.equal(scheduler.tooltip.getDateText(), expectedDate, 'dates and time were displayed correctly');
    });

    test('Scheduler appointment tooltip dates should be correct, when appointment timeZone and scheduler timeZone was set', function(assert) {
        const appointment = {
            text: 'Task',
            startDate: new Date(2015, 1, 9, 11),
            endDate: new Date(2015, 1, 9, 12),
            Timezone: 'Asia/Ashkhabad'
        };

        const scheduler = createScheduler({
            currentDate: new Date(2015, 1, 9),
            dataSource: [appointment],
            currentView: 'week',
            startDateTimezoneExpr: 'Timezone',
            timeZone: 'Asia/Qyzylorda'
        }, this.clock);

        const expectedDate = scheduler.appointments.getDateText(0);

        scheduler.appointments.click(0);

        assert.equal(scheduler.tooltip.getDateText(), expectedDate, 'dates and time were displayed correctly');
    });

    test('Scheduler appointment tooltip dates are displayed with right format, month view', function(assert) {
        const data = new DataSource({
            store: getSampleData()
        });

        const scheduler = createScheduler({ currentDate: new Date(2015, 1, 9), dataSource: data, currentView: 'month' }, this.clock);

        scheduler.appointments.click(1);

        assert.equal(scheduler.tooltip.getDateText(), 'February 9 11:00 AM - 12:00 PM', 'dates and time were displayed correctly');
    });

    test('Click on tooltip-remove button should call scheduler.deleteAppointment and hide tooltip', function(assert) {
        const data = new DataSource({
            store: getSampleData()
        });

        const scheduler = createScheduler({ currentDate: new Date(2015, 1, 9), dataSource: data }, this.clock);
        const stub = sinon.stub(scheduler.instance, 'processDeleteAppointment');

        scheduler.appointments.click(1);
        scheduler.tooltip.clickOnDeleteButton();

        assert.deepEqual(stub.getCall(0).args[0],
            {
                startDate: new Date(2015, 1, 9, 11, 0),
                endDate: new Date(2015, 1, 9, 12, 0),
                text: 'Task 2'
            },
            'processDeleteAppointment has a correct arguments');

        assert.notOk(scheduler.tooltip.isVisible(), 'tooltip was hidden');
    });

    test('Click on tooltip-remove button should call scheduler.updateAppointment and hide tooltip, if recurrenceRuleExpr and recurrenceExceptionExpr is set', function(assert) {
        const scheduler = createScheduler({
            currentDate: new Date(2018, 6, 30),
            currentView: 'month',
            views: ['month'],
            recurrenceRuleExpr: 'SC_RecurrenceRule',
            recurrenceExceptionExpr: 'SC_RecurrenceException',
            recurrenceEditMode: 'occurrence',
            dataSource: [{
                text: 'Meeting of Instructors',
                startDate: new Date(2018, 6, 30, 10, 0),
                endDate: new Date(2018, 6, 30, 11, 0),
                SC_RecurrenceRule: 'FREQ=DAILY;COUNT=3',
                SC_RecurrenceException: '20170626T100000Z'
            }
            ]
        }, this.clock);
        const stub = sinon.stub(scheduler.instance, '_updateAppointment');

        scheduler.appointments.click(1);
        scheduler.tooltip.clickOnDeleteButton();

        const exceptionDate = new Date(2018, 6, 31, 10, 0, 0, 0);
        const exceptionString = dateSerialization.serializeDate(exceptionDate, 'yyyyMMddTHHmmssZ');

        assert.deepEqual(stub.getCall(0).args[1],
            {
                startDate: new Date(2018, 6, 30, 10, 0),
                endDate: new Date(2018, 6, 30, 11, 0),
                text: 'Meeting of Instructors',
                SC_RecurrenceRule: 'FREQ=DAILY;COUNT=3',
                SC_RecurrenceException: '20170626T100000Z,' + exceptionString
            },
            'updateAppointment has a right arguments');

        assert.notOk(scheduler.tooltip.isVisible(), 'tooltip was hidden');

    });

    test('Tooltip should appear if mouse is over arrow icon', function(assert) {
        const endDate = new Date(2015, 9, 12);

        const scheduler = createScheduler({
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

    test('showAppointmentTooltip should be called after click on arrow icon and doesn\'t hide after pointerleave', function(assert) {
        const endDate = new Date(2015, 9, 12);

        const scheduler = createScheduler({
            currentDate: new Date(2015, 4, 6),
            views: ['month'],
            currentView: 'month',
            firstDayOfWeek: 1,
            dataSource: [{ startDate: new Date(2015, 4, 10), endDate: endDate }]
        });

        const $appointment = $(scheduler.instance.$element()).find('.dx-scheduler-appointment');
        const $arrowIcon = $appointment.find('.dx-scheduler-appointment-reduced-icon');

        $arrowIcon.trigger('dxpointerenter');
        $arrowIcon.eq(0).trigger('dxclick');
        this.clock.tick(300);
        $arrowIcon.trigger('dxpointerleave');

        assert.ok(scheduler.tooltip.isVisible(), 'Appointment tooltip is shown');
    });

    test('Tooltip of allDay appointment should display right dates', function(assert) {
        const startDate = new Date(2015, 2, 5);
        const endDate = new Date(2015, 2, 6);

        const scheduler = createScheduler({
            currentDate: new Date(2015, 2, 4),
            currentView: 'week',
            dataSource: [{
                text: 'a',
                allDay: true,
                startDate: startDate,
                endDate: endDate
            }]
        }, this.clock);

        scheduler.appointments.click();

        assert.equal(scheduler.tooltip.getDateText(), dateLocalization.format(startDate, 'monthAndDay') + ' - ' + dateLocalization.format(endDate, 'monthAndDay'), 'dates were displayed correctly');
    });

    test('Tooltip of allDay appointment with startDate = endDate should display right date', function(assert) {
        const startDate = new Date(2015, 2, 5, 6);
        const endDate = new Date(2015, 2, 5, 10);

        const scheduler = createScheduler({
            currentDate: new Date(2015, 2, 4),
            currentView: 'week',
            dataSource: [{
                text: 'a',
                allDay: true,
                startDate: startDate,
                endDate: endDate
            }]
        }, this.clock);

        scheduler.appointments.click();

        assert.equal(scheduler.tooltip.getDateText(), dateLocalization.format(startDate, 'monthAndDay'), 'date was displayed correctly');
    });

    test('Tooltip of multiday appointment should display date & time for usual view', function(assert) {
        const startDate = new Date(2015, 2, 5, 6);
        const endDate = new Date(2015, 2, 6, 8);

        const scheduler = createScheduler({
            currentDate: new Date(2015, 2, 4),
            currentView: 'week',
            dataSource: [{
                text: 'a',
                startDate: startDate,
                endDate: endDate
            }]
        }, this.clock);

        scheduler.appointments.click(0);

        const startDateString = dateLocalization.format(startDate, dateFormat) + ' ' + dateLocalization.format(startDate, timeFormat);
        const endDateString = dateLocalization.format(endDate, dateFormat) + ' ' + dateLocalization.format(endDate, timeFormat);

        assert.equal(scheduler.tooltip.getDateText(), startDateString + ' - ' + endDateString, 'dates were displayed correctly');
    });

    test('Tooltip of multiday appointment should display date & time for month view', function(assert) {
        const startDate = new Date(2015, 2, 5, 6);
        const endDate = new Date(2015, 2, 6, 8);

        const scheduler = createScheduler({
            currentDate: new Date(2015, 2, 4),
            currentView: 'month',
            dataSource: [{
                text: 'a',
                startDate: startDate,
                endDate: endDate
            }]
        }, this.clock);

        scheduler.appointments.click(0);

        const startDateString = dateLocalization.format(startDate, dateFormat) + ' ' + dateLocalization.format(startDate, timeFormat);
        const endDateString = dateLocalization.format(endDate, dateFormat) + ' ' + dateLocalization.format(endDate, timeFormat);

        assert.equal(scheduler.tooltip.getDateText(), startDateString + ' - ' + endDateString, 'dates were displayed correctly');
    });

    test('Tooltip of appointment part after midnight should display right date & time', function(assert) {
        const startDate = new Date(2015, 4, 25, 23, 0);
        const endDate = new Date(2015, 4, 26, 1, 15);

        const scheduler = createScheduler({
            currentDate: new Date(2015, 4, 25),
            currentView: 'week',
            dataSource: [{
                text: 'a',
                startDate: startDate,
                endDate: endDate
            }]
        }, this.clock);

        scheduler.appointments.click(1);

        const startDateString = dateLocalization.format(startDate, dateFormat) + ' ' + dateLocalization.format(startDate, timeFormat);
        const endDateString = dateLocalization.format(endDate, dateFormat) + ' ' + dateLocalization.format(endDate, timeFormat);

        assert.equal(scheduler.tooltip.getDateText(), startDateString + ' - ' + endDateString, 'dates were displayed correctly');
    });

    test('Tooltip of recurrence appointment part after midnight should display right date & time', function(assert) {
        const startDate = new Date(2015, 4, 25, 23, 0);
        const endDate = new Date(2015, 4, 26, 1, 15);

        const scheduler = createScheduler({
            currentDate: new Date(2015, 4, 25),
            currentView: 'month',
            dataSource: [{
                text: 'a',
                startDate: startDate,
                endDate: endDate,
                recurrenceRule: 'FREQ=DAILY;INTERVAL=5'
            }]
        }, this.clock);

        scheduler.appointments.click(2);

        assert.equal(scheduler.tooltip.getDateText(), 'May 30 11:00 PM - May 31 1:15 AM', 'dates were displayed correctly');
    });

    test('Tooltip for recurrence appointment should display right dates(T384181)', function(assert) {
        const startDate = new Date(2015, 1, 5, 11);
        const endDate = new Date(2015, 1, 5, 12);

        const scheduler = createScheduler({
            currentDate: new Date(2015, 1, 4),
            views: ['month'],
            currentView: 'month',
            dataSource: [{
                text: 'a',
                startDate: startDate,
                endDate: endDate,
                recurrenceRule: 'FREQ=DAILY'
            }]
        }, this.clock);

        scheduler.appointments.click(1);

        assert.equal(scheduler.tooltip.getDateText(), 'February 6 11:00 AM - 12:00 PM', 'dates and time were displayed correctly');
    });

    test('Tooltip should hide when window was resized', function(assert) {
        const scheduler = createScheduler({
            currentDate: new Date(2016, 1, 11),
            currentView: 'week',
            dataSource: [{
                text: 'a',
                allDay: true,
                startDate: new Date(2016, 1, 11, 10),
                endDate: new Date(2016, 1, 11, 15)
            }]
        }, this.clock);

        scheduler.appointments.click();

        assert.ok(scheduler.tooltip.isVisible(), 'tooltip was shown');
        resizeCallbacks.fire();
        assert.notOk(scheduler.tooltip.isVisible(), 'tooltip was hidden');
    });

    test('Appointment tooltip should be hidden after immediately delete key pressing', function(assert) {
        const appt = {
            text: 'a',
            allDay: true,
            startDate: new Date(2016, 1, 11, 10),
            endDate: new Date(2016, 1, 11, 15)
        };

        const scheduler = createScheduler({
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
        this.clock.tick(300);

        assert.ok(notifyStub.called, 'notify is called');
        assert.ok(notifyStub.withArgs('onDeleteButtonPress').called, 'onDeleteButtonPress is called');
        assert.notOk(notifyStub.withArgs('showAppointmentTooltip').called, 'showAppointmentTooltip isn\'t called');
    });

    test('Tooltip should has right boundary in timeline view if appointment is allDay', function(assert) {
        const scheduler = createScheduler({
            dataSource: [{
                startDate: new Date(2018, 8, 24),
                endDate: new Date(2018, 8, 25)
            }],
            currentView: 'timelineDay',
            currentDate: new Date(2018, 8, 24)
        }, this.clock);

        scheduler.appointments.click(0);

        const tooltip = Tooltip.getInstance($('.dx-tooltip'));
        const tooltipBoundary = tooltip.option('position').boundary.get(0);
        const containerBoundary = scheduler.instance.getWorkSpaceScrollableContainer().get(0);

        assert.deepEqual(tooltipBoundary, containerBoundary, 'tooltip has right boundary');
    });

    test('the targetedAppointmentData parameter appends to arguments of the appointment tooltip template for a recurrence rule', function(assert) {
        const scheduler = createScheduler({
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
                assert.deepEqual(model.targetedAppointmentData, {
                    allDay: true,
                    endDate: new Date(2015, 4, 25, 11),
                    recurrenceRule: 'FREQ=DAILY;COUNT=3',
                    startDate: new Date(2015, 4, 25, 9),
                    text: 'Task 2',
                    displayEndDate: new Date(2015, 4, 25, 11),
                    displayStartDate: new Date(2015, 4, 25, 9),
                });
            }
        }, this.clock);

        scheduler.appointments.click(1);
    });

    test('the targetedAppointmentData parameter appends to arguments of the appointment tooltip template for a non-recurrence rule', function(assert) {
        const scheduler = createScheduler({
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
        }, this.clock);

        scheduler.appointments.click(0);
    });
});


module('Appointment tooltip template', moduleConfig, () => {
    const checkAppointmentDataInTooltipTemplate = (assert, dataSource, currentDate, clock) => {
        const scheduler = createWrapper({
            dataSource: dataSource,
            height: 600,
            currentDate: currentDate,
            currentView: 'month',
            views: ['month'],
            appointmentTooltipTemplate: model => {
                assert.equal(dataSource.indexOf(model.appointmentData), 0, 'appointment data contains in the data source');
            }
        }, clock);

        scheduler.appointments.click(0);
    };

    test('The appointmentData argument of the appointment tooltip template is should be instance of the data source', function(assert) {
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
        checkAppointmentDataInTooltipTemplate(assert, dataSource, new Date(2015, 1, 9), this.clock);
    });

    test('The appointmentData argument of the appointment tooltip template is should be instance of the data source for recurrence rule', function(assert) {
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

        checkAppointmentDataInTooltipTemplate(assert, dataSource, new Date(2015, 4, 24), this.clock);
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

        test('should be false if clicked on single appointment', function(assert) {
            const scheduler = createWrapper({
                dataSource: data,
                views: ['month'],
                currentView: 'month',
                currentDate: new Date(2021, 3, 27),
                height: 600,
                appointmentTooltipTemplate: (model) => assert.notOk(model.isButtonClicked)
            }, this.clock);

            scheduler.appointments.click(0);
            assert.expect(1);
        });

        test('should be true if clicked on compact button', function(assert) {
            const scheduler = createWrapper({
                dataSource: data,
                views: ['month'],
                currentView: 'month',
                currentDate: new Date(2021, 3, 27),
                height: 600,
                appointmentTooltipTemplate: (model) => assert.ok(model.isButtonClicked)
            }, this.clock);

            scheduler.appointments.compact.click(0);
            assert.expect(2);
        });
    });
});

module('New common tooltip for compact and cell appointments', moduleConfig, () => {
    const createScheduler = (options, data, clock) => {
        const defaultOption = {
            dataSource: data || getSimpleDataArray(),
            views: ['agenda', 'day', 'week', 'workWeek', 'month'],
            currentView: 'month',
            currentDate: new Date(2017, 4, 25),
            startDayHour: 9,
            height: 600,
        };
        return createWrapper($.extend(defaultOption, options), clock);
    };

    test('Title in tooltip should equals title of cell appointments in month view', function(assert) {
        const scheduler = createScheduler(undefined, undefined, this.clock);
        assert.notOk(scheduler.tooltip.isVisible(), 'On page load tooltip should be invisible');

        for(let i = 0; i < scheduler.appointments.getAppointmentCount(); i++) {
            scheduler.appointments.click(i);
            assert.equal(scheduler.tooltip.getTitleText(), scheduler.appointments.getTitleText(i), 'Title in tooltip should be equal with appointment');
        }

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

    test('Title in tooltip should equals title of cell appointments in other views', function(assert) {
        const scheduler = createScheduler(undefined, undefined, this.clock);
        assert.notOk(scheduler.tooltip.isVisible(), 'On page load tooltip should be invisible');

        const views = ['week', 'day', 'workWeek', 'agenda'];
        const testTitles = () => {
            for(let i = 0; i < scheduler.appointments.getAppointmentCount(); i++) {
                scheduler.appointments.click(i);
                assert.equal(scheduler.tooltip.getTitleText(), scheduler.appointments.getTitleText(i), 'Title in tooltip should be equal with appointment');
            }
        };

        views.forEach(viewValue => {
            scheduler.instance.option('currentView', viewValue);
            testTitles();
        });
    });

    test('Delete button in tooltip shouldn\'t render if editing = false', function(assert) {
        const scheduler = createScheduler({
            editing: false
        }, undefined, this.clock);

        for(let i = 0; i < scheduler.appointments.getAppointmentCount(); i++) {
            scheduler.appointments.click(i);
            assert.notOk(scheduler.tooltip.hasDeleteButton(), 'Delete button shouldn\'t render');
        }

        for(let i = 0; i < scheduler.appointments.compact.getButtonCount(); i++) {
            scheduler.appointments.compact.click(i);
            assert.notOk(scheduler.tooltip.hasDeleteButton(), 'Delete button shouldn\'t render for compact appointments');
        }

        scheduler.instance.option('editing', true);

        for(let i = 0; i < scheduler.appointments.getAppointmentCount(); i++) {
            scheduler.appointments.click(i);
            assert.ok(scheduler.tooltip.hasDeleteButton(), 'Delete button should be render');
        }
    });

    test('Compact button should hide or show after change in data source', function(assert) {
        const dataList = getSimpleDataArray();
        const scheduler = createScheduler({}, dataList);

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
        assert.equal(scheduler.appointments.compact.getButtonText(), '2 more', 'Count of compact buttons should be increase after add appointment');
        assert.equal(scheduler.appointments.compact.getButtonCount(), 5, 'Count of compact buttons shouldn\'t change');
    });

    test('Tooltip should hide after perform action', function(assert) {
        const scheduler = createScheduler(undefined, undefined, this.clock);

        scheduler.appointments.click();
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
        assert.notOk(scheduler.tooltip.isVisible(), 'Tooltip shouldn\'t visible');

        scheduler.appointments.compact.click(scheduler.appointments.compact.getButtonCount() - 1);
        assert.equal(scheduler.tooltip.getItemCount(), 1, 'Count of items in tooltip should be equal 1');

        scheduler.tooltip.clickOnDeleteButton();
        assert.notOk(scheduler.tooltip.isVisible(), 'Tooltip shouldn\'t visible');
    });

    test('Tooltip should work correct in week view', function(assert) {
        const DEFAULT_TEXT = 'Temp appointment';
        const scheduler = createScheduler({
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

    test('appointmentTooltipTemplate method should pass valid arguments', function(assert) {
        let templateCallCount = 0;
        const scheduler = createScheduler({
            appointmentTooltipTemplate: (model, index, contentElement) => {
                assert.ok($(contentElement).hasClass('dx-list-item-content'), 'Content element should be list item');
                assert.equal(model.targetedAppointmentData.text, model.appointmentData.text, 'targetedAppointmentData should be not empty');
                assert.equal(index, templateCallCount, 'Index should be correct pass in template callback');

                templateCallCount++;
                return $('<div />').text(`template item index - ${index}`);
            }
        }, undefined, this.clock);

        scheduler.appointments.click();
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

            test('List should be navigate by keyboard', function(assert) {
                const scheduler = createScheduler(undefined, undefined, this.clock);

                const checkFocusedState = index => scheduler.tooltip.getItemElement(index).hasClass(ITEM_FOCUSED_STATE_CLASS_NAME);

                scheduler.appointments.click();

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

            test('focusStateEnabled property should disable or enable navigate in list', function(assert) {
                const scheduler = createScheduler(undefined, undefined, this.clock);

                scheduler.appointments.click();

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

    test('onAppointmentDblClick event should raised after click on tooltip from collector and in adaptivity mode', function(assert) {
        const options = {
            onAppointmentClick: () => {}
        };
        const stub = sinon.stub(options, 'onAppointmentClick');
        const scheduler = createScheduler(options, undefined, this.clock);

        scheduler.appointments.click();
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

    test('Tooltip should crop list, if list has many items', function(assert) {
        const scheduler = createScheduler({
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

        scheduler.appointments.compact.click();
        assert.equal(getItemCount(), 1, 'Tooltip should render 1 item');
        assert.roughEqual(getItemElement().outerHeight(), getOverlayContentElement().outerHeight(), 10, 'Tooltip height should equals then list height');
    });

    test('Component should draw correctly, if component append to container in appointmentTooltipTemplate', function(assert) {
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

        const scheduler = createScheduler({
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
            height: 600
        }, undefined, this.clock);

        scheduler.appointments.click();
        assert.equal(findButton(0).option('text'), getExpectedText(0), 'dxButton component should placed in item of tooltip');

        scheduler.appointments.compact.click();
        assert.equal(findButton(0).option('text'), getExpectedText(0), 'dxButton component should placed in first item of compact tooltip');
        assert.equal(findButton(1).option('text'), getExpectedText(1), 'dxButton component should placed in second item of compact tooltip');
    });

    test('onAppointmentDblClick should have correct targetedAppointmentData', function(assert) {
        const scheduler = createScheduler({
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
                    endDate: new Date(2020, 11, 3, 9, 30),
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

    test('e.cancel argument should be prevent showing tooltip', function(assert) {
        const scheduler = createWrapper({
            dataSource: data,
            views: ['month'],
            currentView: 'month',
            currentDate: new Date(2021, 3, 27),
            height: 600,
            onAppointmentTooltipShowing: (e) => e.cancel = true
        }, this.clock);

        scheduler.appointments.click(0);

        assert.notOk(scheduler.tooltip.isVisible());
    });

    test('Arguments should be valid on a single appointment', function(assert) {
        const scheduler = createWrapper({
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
        }, this.clock);

        scheduler.appointments.click(0);
        assert.expect(2);
    });

    test('Arguments should be valid on a compact button', function(assert) {
        const scheduler = createWrapper({
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
            }
        });

        scheduler.appointments.compact.click(0);
        assert.expect(4);
    });
});
