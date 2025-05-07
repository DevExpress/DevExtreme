import { getOuterHeight, getOuterWidth } from 'core/utils/size';
import $ from 'jquery';
import translator from 'common/core/animation/translator';
import dblclickEvent from 'common/core/events/dblclick';
import fx from 'common/core/animation/fx';
import { DataSource } from 'common/data/data_source/data_source';
import { CustomStore } from 'common/data/custom_store';
import {
    supportedScrollingModes,
    createWrapper,
    initTestMarkup
} from '../../helpers/scheduler/helpers.js';

import 'generic_light.css!';
import '__internal/scheduler/m_scheduler';

const { module, test, testStart } = QUnit;

testStart(() => initTestMarkup());

const APPOINTMENT_DEFAULT_LEFT_OFFSET = 26;

const createInstanceBase = options => createWrapper({ _draggingMode: 'default', ...options });

const config = {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
        this.tasks = [
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
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
};

module('All day appointments common', config, () => {
    supportedScrollingModes.forEach(scrollingMode => {
        module(`Scrolling mode ${scrollingMode}`, () => {

            const createInstance = options => {
                return createInstanceBase($.extend(true, options, {
                    scrolling: {
                        mode: scrollingMode
                    },
                    height: 600
                }));
            };

            test('AllDay appointment should be displayed correctly after changing view with custom store', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 2, 4),
                    currentView: 'day',
                    maxAppointmentsPerCell: 'unlimited',
                    dataSource: new DataSource({
                        store: new CustomStore({
                            load: function(options) {
                                const d = $.Deferred();
                                setTimeout(function() {
                                    d.resolve([{
                                        text: 'a',
                                        allDay: true,
                                        startDate: new Date(2015, 2, 5),
                                        endDate: new Date(2015, 2, 5, 0, 30)
                                    }]);
                                }, 300);

                                return d.promise();
                            }
                        })
                    })
                });

                this.clock.tick(300);
                scheduler.instance.option('currentView', 'week');
                this.clock.tick(300);

                const allDayPanelHeight = $(scheduler.instance.$element()).find('.dx-scheduler-all-day-table-cell').eq(0).get(0).getBoundingClientRect().height;
                const $appointment = $(scheduler.instance.$element()).find('.dx-scheduler-appointment').eq(0);

                assert.roughEqual(getOuterHeight($appointment), allDayPanelHeight, 0.501, 'Appointment height is correct');
            });

            test('AllDay appointment should be displayed correctly after changing date with custom store', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('This test is for the standard scrolling mode');
                    return;
                }

                const scheduler = createInstance({
                    currentDate: new Date(2015, 2, 4),
                    currentView: 'day',
                    maxAppointmentsPerCell: 'unlimited',
                    dataSource: new DataSource({
                        store: new CustomStore({
                            load: function(options) {
                                const d = $.Deferred();
                                setTimeout(function() {
                                    d.resolve([{
                                        text: 'a',
                                        allDay: true,
                                        startDate: new Date(2015, 2, 5),
                                        endDate: new Date(2015, 2, 5, 0, 30)
                                    }]);
                                }, 300);

                                return d.promise();
                            }
                        })
                    })
                });

                this.clock.tick(300);
                scheduler.instance.option('currentDate', new Date(2015, 2, 5));
                this.clock.tick(300);

                const allDayPanelHeight = $(scheduler.instance.$element()).find('.dx-scheduler-all-day-table-cell').eq(0).get(0).getBoundingClientRect().height;
                const $appointment = $(scheduler.instance.$element()).find('.dx-scheduler-appointment').eq(0);

                assert.roughEqual(getOuterHeight($appointment), allDayPanelHeight, 2, 'Appointment height is correct');
            });

            test('Multi-day appointment parts should have allDay class', function(assert) {
                const appointment = { startDate: new Date(2015, 1, 4, 0), endDate: new Date(2015, 1, 10, 0), text: 'long appointment' };

                const scheduler = createInstance({
                    currentDate: new Date(2015, 1, 5),
                    dataSource: [appointment],
                    currentView: 'day'
                });

                const $appointment = $(scheduler.instance.$element()).find('.dx-scheduler-all-day-appointments .dx-scheduler-appointment').eq(0);

                assert.ok($appointment.hasClass('dx-scheduler-all-day-appointment'), 'Appointment part has allDay class');
            });

            test('Multi-day appointment parts should have correct reduced class', function(assert) {
                const appointment = { startDate: new Date(2015, 1, 4, 0), endDate: new Date(2015, 1, 7, 0), text: 'long appointment' };

                const scheduler = createInstance({
                    currentDate: new Date(2015, 1, 5),
                    dataSource: [appointment],
                    currentView: 'day'
                });

                let $appointment = scheduler.instance.$element().find('.dx-scheduler-all-day-appointments .dx-scheduler-appointment').eq(0);

                assert.ok($appointment.hasClass('dx-scheduler-appointment-head'), 'Appointment part has reduced class');

                scheduler.instance.option('currentDate', new Date(2015, 1, 6));

                $appointment = scheduler.instance.$element().find('.dx-scheduler-all-day-appointments .dx-scheduler-appointment').eq(0);

                assert.notOk($appointment.hasClass('dx-scheduler-appointment-head'), 'Appointment part hasn\'t reduced class. It is tail');
            });

            test('AllDay recurrent appointment should be rendered coorectly after changing currentDate', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('This test is for the standard scrolling mode');
                    return;
                }

                const appointment = {
                    text: 'Appointment',
                    recurrenceRule: 'FREQ=DAILY',
                    allDay: true,
                    startDate: new Date(2015, 4, 25),
                    endDate: new Date(2015, 4, 25, 0, 30)
                };

                const scheduler = createInstance({
                    currentDate: new Date(2015, 4, 25),
                    dataSource: [appointment],
                    currentView: 'week'
                });

                scheduler.instance.option('currentDate', new Date(2015, 4, 31));

                const $appointment = $(scheduler.instance.$element()).find('.dx-scheduler-all-day-appointments .dx-scheduler-appointment').eq(0);
                const cellHeight = getOuterHeight($(scheduler.instance.$element()).find('.dx-scheduler-all-day-table-cell'));
                const cellWidth = getOuterWidth($(scheduler.instance.$element()).find('.dx-scheduler-all-day-table-cell'));

                assert.roughEqual(getOuterWidth($appointment), 1.1, cellWidth, 'Appointment width is OK');
                assert.roughEqual(getOuterHeight($appointment), 1.1, cellHeight, 'Appointment height is OK');
            });

            test('DblClick on appointment should call scheduler.showAppointmentPopup for allDay appointment on month view', function(assert) {
                const data = [{
                    text: 'a', allDay: true, startDate: new Date(2015, 2, 5), endDate: new Date(2015, 2, 5, 0, 30)
                }];

                const scheduler = createInstance({
                    currentDate: new Date(2015, 2, 4),
                    currentView: 'month',
                    dataSource: data,
                    maxAppointmentsPerCell: 1,
                    width: 600
                });

                this.clock.tick(10);

                const spy = sinon.spy(scheduler.instance, 'showAppointmentPopup');

                $(scheduler.instance.$element()).find('.dx-scheduler-appointment').eq(0).trigger(dblclickEvent.name);

                assert.ok(spy.calledOnce, 'Method was called');
            });

            test('AllDay appointment has right startDate and endDate', function(assert) {

                const scheduler = createInstance({
                    currentDate: new Date(2015, 2, 4),
                    currentView: 'week'
                });
                scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 2, 5, 6), endDate: new Date(2015, 2, 6, 7), text: 'a', allDay: true });

                const $popupContent = $('.dx-scheduler-appointment-popup .dx-popup-content');
                const startDate = $popupContent.find('.dx-datebox').eq(0).dxDateBox('instance');
                const endDate = $popupContent.find('.dx-datebox').eq(1).dxDateBox('instance');

                assert.equal(startDate.option('type'), 'date', 'type is right');
                assert.equal(endDate.option('type'), 'date', 'type is right');
            });

            test('All-day & common appointments should have a right sorting', function(assert) {
                const scheduler = createInstanceBase({
                    currentDate: new Date(2016, 1, 10),
                    currentView: 'day',
                    width: 800,
                    maxAppointmentsPerCell: 3,
                    dataSource: [
                        {
                            text: 'A',
                            startDate: new Date(2016, 1, 10, 9, 0),
                            endDate: new Date(2016, 1, 10, 11, 30),
                            allDay: true
                        }, {
                            text: 'B',
                            startDate: new Date(2016, 1, 10, 12, 0),
                            endDate: new Date(2016, 1, 10, 13, 0),
                            allDay: true
                        },
                        {
                            text: 'C',
                            startDate: new Date(2016, 1, 10, 12, 0),
                            endDate: new Date(2016, 1, 10, 13, 0),
                            allDay: true
                        },

                        {
                            text: 'D',
                            startDate: new Date(2016, 1, 10, 12, 0),
                            endDate: new Date(2016, 1, 10, 13, 0),
                            allDay: true
                        }, {
                            text: 'E',
                            startDate: new Date(2016, 1, 10, 12, 0),
                            endDate: new Date(2016, 1, 10, 13, 0),
                            allDay: true
                        },
                        {
                            text: 'F',
                            startDate: new Date(2016, 1, 10, 12, 0),
                            endDate: new Date(2016, 1, 10, 13, 0),
                            allDay: true
                        },
                        {
                            text: 'Simple appointment',
                            startDate: new Date(2016, 1, 10, 1),
                            endDate: new Date(2016, 1, 10, 2)
                        }
                    ]
                });

                const cellWidth = scheduler.workSpace.getCellWidth();

                assert.equal(scheduler.appointments.getTitleText(0), 'A', 'Text is right');
                assert.equal(scheduler.appointments.getTitleText(1), 'B', 'Text is right');
                assert.equal(scheduler.appointments.getTitleText(2), 'C', 'Text is right');
                assert.equal(scheduler.appointments.getTitleText(3), 'Simple appointment', 'Text is right');

                assert.roughEqual(scheduler.appointments.getAppointmentPosition(3).left, 0, 1.001, 'Appointment position is OK');
                assert.roughEqual(scheduler.appointments.getAppointmentPosition(3).top, 100, 1.001, 'Appointment position is OK');
                assert.roughEqual(scheduler.appointments.getAppointmentWidth(3), cellWidth - APPOINTMENT_DEFAULT_LEFT_OFFSET, 1.001, 'Appointment size is OK');
            });

            test('dropDown appointment should have correct container & position', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 4, 25),
                    views: ['week'],
                    currentView: 'week',
                    scrolling: {
                        orientation: 'vertical'
                    }
                });

                scheduler.instance.option('dataSource', [
                    { text: '1', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '2', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '3', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '4', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '5', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '6', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '7', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '8', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '9', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '10', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true }
                ]);

                const $dropDown = $(scheduler.instance.$element()).find('.dx-scheduler-appointment-collector').eq(0);

                assert.equal($dropDown.parent().get(0), $(scheduler.instance.$element()).find('.dx-scheduler-all-day-appointments').get(0), 'Container is OK');
                assert.roughEqual(translator.locate($dropDown).left, 128, 1.001, 'Appointment position is OK');
                assert.roughEqual(translator.locate($dropDown).top, 0, 1.001, 'Appointment position is OK');
            });

            test('dropDown appointment should not have compact class on allDay panel', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 4, 25),
                    views: ['week'],
                    currentView: 'week'
                });

                scheduler.instance.option('dataSource', [
                    { text: '1', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '2', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '3', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '4', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '5', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '6', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '7', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '8', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '9', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '10', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true }
                ]);

                const $dropDown = $(scheduler.instance.$element()).find('.dx-scheduler-appointment-collector').eq(0);

                assert.notOk($dropDown.hasClass('dx-scheduler-appointment-collector-compact'), 'class is ok');
            });

            test('AllDay appointments should have correct height, groupOrientation = vertical', function(assert) {
                const appointments = [
                    { ownerId: 1, startDate: new Date(2015, 2, 10, 1), endDate: new Date(2015, 2, 10, 1, 30), allDay: true, text: 'caption1' },
                    { ownerId: 2, startDate: new Date(2015, 2, 10, 1), endDate: new Date(2015, 2, 10, 1, 30), allDay: true, text: 'caption2' }];

                const scheduler = createInstance({
                    currentDate: new Date(2015, 2, 10),
                    dataSource: appointments,
                    groupOrientation: 'vertical',
                    currentView: 'day',
                    showAllDayPanel: true,
                    maxAppointmentsPerCell: 'unlimited',
                    groups: ['ownerId'],
                    resources: [
                        {
                            field: 'ownerId',
                            label: 'o',
                            allowMultiple: true,
                            dataSource: [
                                {
                                    text: 'a',
                                    id: 1
                                },
                                {
                                    text: 'b',
                                    id: 2
                                }
                            ]
                        }
                    ],
                    height: 600,
                    width: 600
                });

                const allDayPanelHeight = $(scheduler.instance.$element()).find('.dx-scheduler-all-day-table-cell').eq(0).get(0).getBoundingClientRect().height;

                assert.roughEqual(getOuterHeight(
                    $(scheduler.instance.$element()).find('.dx-scheduler-all-day-appointment').eq(0)
                ), allDayPanelHeight, 0.501, 'First appointment height is correct on init');
                assert.roughEqual(getOuterHeight(
                    $(scheduler.instance.$element()).find('.dx-scheduler-all-day-appointment').eq(1)
                ), allDayPanelHeight, 0.501, 'Second appointment height is correct on init');
            });

            test('AllDay appointments should have correct position, groupOrientation = vertical', function(assert) {
                const appointments = [
                    { ownerId: 1, startDate: new Date(2015, 2, 10, 1), endDate: new Date(2015, 2, 10, 1, 30), allDay: true, text: 'caption1' },
                    { ownerId: 2, startDate: new Date(2015, 2, 10, 1), endDate: new Date(2015, 2, 10, 1, 30), allDay: true, text: 'caption2' }];

                const scheduler = createInstance({
                    dataSource: appointments,
                    currentDate: new Date(2015, 2, 10),
                    groupOrientation: 'vertical',
                    currentView: 'day',
                    showAllDayPanel: true,
                    groups: ['ownerId'],
                    resources: [
                        {
                            field: 'ownerId',
                            label: 'o',
                            allowMultiple: true,
                            dataSource: [
                                {
                                    text: 'a',
                                    id: 1
                                },
                                {
                                    text: 'b',
                                    id: 2
                                }
                            ]
                        }
                    ]
                });

                const $element = $(scheduler.instance.$element());
                const $appointments = $element.find('.dx-scheduler-appointment');
                const firstPosition = translator.locate($appointments.eq(0));
                const secondPosition = translator.locate($appointments.eq(1));
                const $allDayRows = $element.find('.dx-scheduler-all-day-table-row');
                const firstAllDayRowPosition = translator.locate($allDayRows.eq(0));
                const secondAllDayRowPosition = translator.locate($allDayRows.eq(1));

                assert.roughEqual(firstPosition.top, firstAllDayRowPosition.top, 1.5, 'Appointment has correct top');
                assert.roughEqual(secondPosition.top, secondAllDayRowPosition.top, 1.5, 'Appointment has correct top');
            });

            test('Appointment in allDayPanel must not change position if `editing` option is changed (T807933)', function(assert) {
                const scheduler = createInstanceBase({
                    dataSource: [{
                        text: 'Website Re-Design Plan',
                        startDate: new Date(2017, 4, 22, 9, 30),
                        endDate: new Date(2017, 4, 23, 9, 30),
                        allDay: true,
                    }],
                    views: ['week'],
                    currentView: 'week',
                    currentDate: new Date(2017, 4, 22),
                    startDayHour: 9,
                    endDayHour: 19,
                    height: 600
                });

                let $appointment = scheduler.appointments.getAppointment();
                assert.ok($appointment, 'Appointment is rendered');

                scheduler.instance.option('editing.allowUpdating', false);

                $appointment = scheduler.appointments.getAppointment();

                assert.ok($appointment.hasClass('dx-scheduler-all-day-appointment'), 'Appointment has `addDayAppointment` class');
                assert.strictEqual($(scheduler.instance.$element()).find('.dx-scheduler-all-day-appointments .dx-scheduler-appointment').length, 1, 'Appointment is in `allDayAppointments` container');
                assert.strictEqual(translator.locate($appointment).top, 0, 'Appointment is on top of it`s container');
            });

            test('New allDay appointment should be rendered correctly when groupByDate = true (T845632)', function(assert) {
                const appointment = {
                    text: 'a',
                    startDate: new Date(2020, 1, 9, 1),
                    endDate: new Date(2020, 1, 9, 2),
                    ownerId: [2]
                };
                const newAppointment = {
                    text: 'a',
                    startDate: new Date(2020, 1, 9),
                    endDate: new Date(2020, 1, 9),
                    allDay: true,
                    ownerId: [2]
                };

                const scheduler = createInstanceBase({
                    currentDate: new Date(2020, 1, 9),
                    views: ['week'],
                    currentView: 'week',
                    groupByDate: true,
                    startDayHour: 1,
                    dataSource: [appointment],
                    groups: ['ownerId'],
                    resources: [
                        {
                            field: 'ownerId',
                            label: 'o',
                            allowMultiple: true,
                            dataSource: [
                                {
                                    text: 'a',
                                    id: 1
                                },
                                {
                                    text: 'b',
                                    id: 2
                                }
                            ]
                        }
                    ]
                });

                scheduler.instance.updateAppointment(appointment, newAppointment);

                const $appointment = scheduler.appointments.getAppointment();

                assert.ok($appointment.hasClass('dx-scheduler-all-day-appointment'), 'Appointment has `addDayAppointment` class');
                assert.strictEqual($(scheduler.instance.$element()).find('.dx-scheduler-all-day-appointments .dx-scheduler-appointment').length, 1, 'Appointment is in `allDayAppointments` container');
                assert.strictEqual(translator.locate($appointment).top, 0, 'Appointment is on top of it`s container');
            });

            test('Recurrence allDay appointment should be rendered correctly (T831801)', function(assert) {
                const appointment = {
                    text: 'a',
                    startDate: new Date(2020, 1, 9, 1),
                    endDate: new Date(2020, 1, 9, 2),
                    recurrenceRule: 'FREQ=DAILY'
                };
                const newAppointment = {
                    text: 'a',
                    startDate: new Date(2020, 1, 9),
                    endDate: new Date(2020, 1, 9, 1),
                    allDay: true,
                    recurrenceRule: 'FREQ=DAILY'
                };

                const scheduler = createInstanceBase({
                    currentDate: new Date(2020, 1, 9),
                    views: ['week'],
                    currentView: 'week',
                    groupByDate: true,
                    startDayHour: 1,
                    dataSource: [appointment]
                });

                scheduler.instance.updateAppointment(appointment, newAppointment);

                const appointmentCount = scheduler.appointments.getAppointmentCount();

                assert.equal(appointmentCount, 7, 'All appointment parts were rendered');
            });
        });
    });
});
