import { getOuterWidth, getOuterHeight } from 'core/utils/size';
import $ from 'jquery';
import translator from 'common/core/animation/translator';
import fx from 'common/core/animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import Color from 'color';
import { DataSource } from 'common/data/data_source/data_source';
import { CustomStore } from 'common/data/custom_store';
import browser from 'core/utils/browser';
import { APPOINTMENT_FORM_GROUP_NAMES } from '__internal/scheduler/appointment_popup/m_form';
import {
    initTestMarkup,
    createWrapper,
    supportedScrollingModes
} from '../../helpers/scheduler/helpers.js';

import '__internal/scheduler/m_scheduler';
import 'ui/switch';

const {
    module,
    test,
    testStart,
} = QUnit;

testStart(() => initTestMarkup());

const DATE_TABLE_CELL_CLASS = 'dx-scheduler-date-table-cell';
const APPOINTMENT_CLASS = 'dx-scheduler-appointment';

const APPOINTMENT_DEFAULT_TOP_OFFSET = 26;

const getAppointmentColor = ($task, checkedProperty) => {
    checkedProperty = checkedProperty || 'backgroundColor';
    return new Color($task.css(checkedProperty)).toHex();
};

const createInstanceBase = (options, clock) => {
    const scheduler = createWrapper({
        height: 600,
        width: 800,
        ...options,
    });

    clock.tick(300);
    scheduler.instance.focus();

    return scheduler;
};

module('T712431', () => {
    // TODO: there is a test for T712431 bug, when replace table layout on div layout, the test will also be useless
    const APPOINTMENT_WIDTH = 941;

    test(`Appointment width should be not less ${APPOINTMENT_WIDTH}px with width control 1100px`, function(assert) {
        const data = [
            {
                text: 'Website Re-Design Plan 2',
                startDate: new Date(2017, 4, 7, 9, 30),
                endDate: new Date(2017, 4, 12, 17, 20)
            }
        ];

        const scheduler = createWrapper({
            dataSource: data,
            views: ['month'],
            currentView: 'month',
            currentDate: new Date(2017, 4, 25),
            startDayHour: 9,
            width: 1100,
            height: 600
        });

        const appointment = scheduler.appointments.getAppointment();
        assert.roughEqual(getOuterWidth(appointment), APPOINTMENT_WIDTH, 1);
    });
});

module('Integration: Appointments in Month view', {
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
}, () => {
    module('Scrolling mode standard', () => {
        test('Appointments should be rendered correctly when resourses store is asynchronous', function(assert) {
            const appointments = [
                { startDate: new Date(2015, 2, 4), text: 'a', endDate: new Date(2015, 2, 4, 0, 30), roomId: 1 },
                { startDate: new Date(2015, 2, 4), text: 'b', endDate: new Date(2015, 2, 4, 0, 30), roomId: 2 }
            ];

            const scheduler = createInstanceBase({
                currentDate: new Date(2015, 2, 4),
                views: ['month'],
                dataSource: appointments,
                width: 840,
                height: 600,
                currentView: 'month',
                firstDayOfWeek: 1,
                groups: ['roomId'],
                resources: [
                    {
                        field: 'roomId',
                        allowMultiple: true,
                        dataSource: new DataSource({
                            store: new CustomStore({
                                load: function() {
                                    const d = $.Deferred();
                                    setTimeout(function() {
                                        d.resolve([
                                            { id: 1, text: 'Room 1', color: '#ff0000' },
                                            { id: 2, text: 'Room 2', color: '#0000ff' }
                                        ]);
                                    }, 300);

                                    return d.promise();
                                }
                            })
                        })
                    }
                ]
            }, this.clock);

            this.clock.tick(300);
            assert.deepEqual(scheduler.instance.$element().find('.' + APPOINTMENT_CLASS).length, 2, 'Appointments are rendered');
        });
    });

    supportedScrollingModes.forEach(scrollingMode => {
        module(`Scrolling mode ${scrollingMode}`, () => {
            const createInstance = (options, clock) => {
                options = options || {};
                $.extend(
                    true,
                    options,
                    {
                        scrolling: {
                            mode: scrollingMode
                        }
                    }
                );

                const scheduler = createInstanceBase(options, clock);

                if(scrollingMode === 'virtual') {
                    const workspace = scheduler.instance.getWorkSpace();
                    workspace.renderer.getRenderTimeout = () => -1;
                }

                return scheduler;
            };
            test('Scheduler tasks should have a right dimensions for month view', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual scrolling not support month view');
                    return;
                }

                const scheduler = createInstance({
                    dataSource: [
                        { text: 'Task 1', startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 10) }
                    ],
                    currentDate: new Date(2015, 1, 9),
                    views: ['month'],
                    currentView: 'month',
                    height: 800
                }, this.clock);
                this.clock.tick(10);

                const cellHeight = scheduler.workSpace.getCellHeight();
                const cellWidth = scheduler.workSpace.getCellWidth();

                assert.roughEqual(scheduler.appointments.getAppointmentHeight(0), (cellHeight - 30) / 4, 2, 'Task has a right height');
                assert.roughEqual(scheduler.appointments.getAppointmentWidth(0), cellWidth, 1.001, 'Task has a right width');
            });

            test('Scheduler tasks should have a right height when currentView is changed', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual scrolling not support month view');
                    return;
                }
                const scheduler = createInstance({
                    dataSource: [
                        { text: 'Task 1', startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 10) }
                    ],
                    currentDate: new Date(2015, 1, 9),
                    views: ['day', 'week', 'month'],
                    height: 800
                }, this.clock);
                this.clock.tick(10);

                scheduler.instance.option('currentView', 'month');

                const cellHeight = scheduler.workSpace.getCellHeight();
                const cellWidth = scheduler.workSpace.getCellWidth();

                assert.roughEqual(scheduler.appointments.getAppointmentHeight(0), (cellHeight - 30) / 4, 2, 'Task has a right height');
                assert.roughEqual(scheduler.appointments.getAppointmentWidth(0), cellWidth, 1.001, 'Task has a right width');
            });

            test('Two not rival appointments with fractional coordinates should have correct positions(ie)', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual scrolling not support month view');
                    return;
                }

                const scheduler = createInstance({
                    dataSource: [
                        { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10) },
                        { text: 'Appointment 2', startDate: new Date(2015, 1, 11, 8), endDate: new Date(2015, 1, 11, 10) },
                        { text: 'Appointment 3', startDate: new Date(2015, 1, 10, 8), endDate: new Date(2015, 1, 10, 10) }
                    ],
                    currentDate: new Date(2015, 1, 9),
                    views: ['month'],
                    currentView: 'month',
                    height: 600,
                    width: 720
                }, this.clock);

                const $appointment = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS);

                assert.equal($appointment.length, 3, 'All appointments are rendered');
                assert.equal(translator.locate($appointment.eq(0)).top, translator.locate($appointment.eq(1)).top, 'appointment is rendered in right place');
                assert.equal(translator.locate($appointment.eq(1)).top, translator.locate($appointment.eq(2)).top, 'appointment is rendered in right place');
            });

            test('Month appointment inside grouped view should have a right resizable area', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 6, 10),
                    editing: true,
                    views: ['month'],
                    currentView: 'month',
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 6, 10, 0),
                        endDate: new Date(2015, 6, 10, 0, 30),
                        ownerId: 1
                    }, {
                        text: 'b',
                        startDate: new Date(2015, 6, 10, 0),
                        endDate: new Date(2015, 6, 10, 0, 30),
                        ownerId: 2
                    }],
                    groups: ['ownerId'],
                    resources: [
                        {
                            field: 'ownerId',
                            dataSource: [
                                { id: 1, text: 'one' },
                                { id: 2, text: 'two' }
                            ]
                        }
                    ],
                    width: 1000
                }, this.clock);

                const $appointments = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);
                const area1 = $appointments.eq(0).dxResizable('instance').option('area');
                const area2 = $appointments.eq(1).dxResizable('instance').option('area');
                const $cells = scheduler.instance.$element().find('.' + DATE_TABLE_CELL_CLASS);
                const halfOfCellWidth = 0.5 * getOuterWidth($cells.eq(0));

                assert.roughEqual(area1.left, $cells.eq(0).offset().left - halfOfCellWidth, 1.001);
                assert.roughEqual(area1.right, $cells.eq(7).offset().left + halfOfCellWidth, 1.001);

                assert.roughEqual(area2.left, $cells.eq(7).offset().left - halfOfCellWidth, 1.001);
                assert.roughEqual(area2.right, $cells.eq(13).offset().left + halfOfCellWidth * 3, 1.001);
            });

            test('Rival appointments should have correct positions on month view, rtl mode', function(assert) {
                const scheduler = createInstance({
                    rtlEnabled: true,
                    currentDate: new Date(2015, 2, 4),
                    views: ['month'],
                    currentView: 'month',
                    firstDayOfWeek: 1,
                    dataSource: [
                        { startDate: new Date(2015, 2, 4), endDate: new Date(2015, 2, 7), text: 'long' },
                        { startDate: new Date(2015, 2, 5), endDate: new Date(2015, 2, 5, 1), text: 'short' }]
                }, this.clock);

                const $longAppointment = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS).eq(0);
                const $shortAppointment = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS).eq(1);

                assert.notEqual($longAppointment.position().top, $shortAppointment.position().top, 'Appointments positions are correct');
            });

            test('Recurrence appointment should be rendered correctly when currentDate was changed: month view', function(assert) {
                const appointment = {
                    startDate: new Date(2015, 1, 14, 0),
                    endDate: new Date(2015, 1, 14, 0, 30),
                    text: 'appointment',
                    recurrenceRule: 'FREQ=MONTHLY'
                };

                const scheduler = createInstance({
                    currentDate: new Date(2015, 1, 14),
                    dataSource: [appointment],
                    views: ['month'],
                    currentView: 'month',
                    width: 600
                }, this.clock);

                scheduler.instance.option('currentDate', new Date(2015, 2, 14));

                const $appointment = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS);

                assert.equal($appointment.length, 1, 'Appointment is rendered');
            });

            test('Recurrence long appointment should be rendered correctly when currentDate was changed: month view', function(assert) {
                const appointment = {
                    text: 'Website Re-Design Plan',
                    priorityId: 2,
                    startDate: new Date(2015, 4, 25, 9, 0),
                    endDate: new Date(2015, 4, 26, 11, 30),
                    recurrenceRule: 'FREQ=DAILY;INTERVAL=5'
                };

                const scheduler = createInstance({
                    currentDate: new Date(2015, 4, 25),
                    dataSource: [appointment],
                    views: ['month'],
                    currentView: 'month'
                }, this.clock);

                scheduler.instance.option('currentDate', new Date(2015, 5, 25));

                const $appointment = scheduler.instance.$element().find(`.${APPOINTMENT_CLASS}`);

                assert.equal($appointment.length, 10, 'Appointments were rendered');
            });

            test('Recurrence icon position should be correct (T718691)', function(assert) {
                const data = [{
                    text: 'Book Flights to San Fran for Sales Trip',
                    startDate: new Date(2017, 4, 29, 12, 0),
                    endDate: new Date(2017, 5, 5, 13, 0),
                    allDay: true,
                    recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU;COUNT=10'
                }];
                const scheduler = createInstance({
                    dataSource: data,
                    views: ['month'],
                    currentView: 'month',
                    currentDate: new Date(2017, 4, 25),
                    startDayHour: 9,
                    height: 600
                }, this.clock);

                const $appointment = $(scheduler.instance.$element()).find('.dx-scheduler-appointment');
                const $appointmentContent = $appointment.find('.dx-scheduler-appointment-content');
                const $appointmentRecurringIcon = $appointmentContent.find('.dx-scheduler-appointment-recurrence-icon');

                assert.equal($appointmentRecurringIcon.eq(0).css('right'), '20px', 'Icon position is OK');
                assert.equal($appointmentRecurringIcon.eq(1).css('right'), '5px', 'Icon position is OK');
                assert.equal($appointmentRecurringIcon.eq(2).css('right'), '20px', 'Icon position is OK');
            });

            test('Appointment startDate should be preprocessed before position calculating', function(assert) {

                const scheduler = createInstance({
                    dataSource: [{ 'text': 'a', 'allDay': true, 'startDate': '2017-03-13T09:05:00Z', 'endDate': '2017-03-20T09:05:00Z' }],
                    currentDate: new Date(2017, 2, 13),
                    currentView: 'month',
                    views: ['month'],
                    height: 600
                }, this.clock);

                const $appointment = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS);

                assert.equal($appointment.length, 2, 'appointment is rendered');
            });

            test('Scheduler appointment popup should be opened correctly for recurrence appointments after multiple opening(T710140)', function(assert) {
                const tasks = [{
                    text: 'Recurrence task',
                    start: new Date(2017, 2, 13),
                    end: new Date(2017, 2, 13, 0, 30),
                    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10'
                }];

                const scheduler = createInstance({
                    dataSource: tasks,
                    currentDate: new Date(2017, 2, 13),
                    currentView: 'month',
                    views: ['month'],
                    startDateExpr: 'start',
                    endDateExpr: 'end'
                }, this.clock);

                scheduler.instance.showAppointmentPopup(tasks[0]);
                $('.dx-dialog-buttons .dx-button').eq(0).trigger('dxclick');
                const form = scheduler.instance.getAppointmentDetailsForm();
                const descriptionEditor = form.getEditor('description');

                descriptionEditor.option('value', 'Recurrence task 1');

                scheduler.instance.hideAppointmentPopup();
                scheduler.instance.showAppointmentPopup(tasks[0]);

                $('.dx-dialog-buttons .dx-button').eq(0).trigger('dxclick');

                const popup = scheduler.instance._appointmentPopup.popup;
                const $buttonGroup = $(popup.$content()).find('.dx-buttongroup');

                assert.deepEqual($buttonGroup.eq(0).dxButtonGroup('instance').option('selectedItemKeys'), ['MO', 'TH'], 'Right button group select item keys');
            });

            test('Scheduler appointment popup should be opened correctly for recurrence appointments after opening for ordinary appointments(T710140)', function(assert) {
                const tasks = [{
                    text: 'Task',
                    start: new Date(2017, 2, 13),
                    end: new Date(2017, 2, 13, 0, 30)
                }, {
                    text: 'Recurrence task',
                    start: new Date(2017, 2, 13),
                    end: new Date(2017, 2, 13, 0, 30),
                    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10'
                }];

                const scheduler = createInstance({
                    dataSource: tasks,
                    currentDate: new Date(2017, 2, 13),
                    currentView: 'month',
                    views: ['month'],
                    startDateExpr: 'start',
                    endDateExpr: 'end'
                }, this.clock);

                scheduler.instance.showAppointmentPopup(tasks[0]);

                let form = scheduler.instance.getAppointmentDetailsForm();
                const descriptionEditor = form.getEditor('description');

                descriptionEditor.option('value', 'Task 1');

                scheduler.instance.hideAppointmentPopup();
                scheduler.instance.showAppointmentPopup(tasks[1]);

                $('.dx-dialog-buttons .dx-button').eq(0).trigger('dxclick');

                const popup = scheduler.instance._appointmentPopup.popup;
                const $buttonGroup = $(popup.$content()).find('.dx-buttongroup');

                $buttonGroup.eq(0).dxButtonGroup('instance').option('selectedItemKeys'), ['MO', 'TH'], 'Right button group select item keys';

                scheduler.instance.hideAppointmentPopup();
                scheduler.instance.showAppointmentPopup(tasks[0]);

                form = scheduler.instance.getAppointmentDetailsForm();

                assert.equal(form.itemOption(APPOINTMENT_FORM_GROUP_NAMES.Recurrence).visible, false, 'Recurrence editor is hidden. Popup is correct');
            });

            test('Long term appoinment inflict index shift in other appointments (T737780)', function(assert) {
                const data = [
                    {
                        text: 'Website Re-Design Plan',
                        startDate: new Date(2017, 4, 2, 9, 30),
                        endDate: new Date(2017, 4, 12, 11, 30)
                    }, {
                        text: 'Book Flights to San Fran for Sales Trip',
                        startDate: new Date(2017, 4, 4, 12, 0),
                        endDate: new Date(2017, 4, 4, 13, 0),
                        allDay: true
                    }, {
                        text: 'Approve Personal Computer Upgrade Plan',
                        startDate: new Date(2017, 4, 10, 10, 0),
                        endDate: new Date(2017, 4, 10, 11, 0)
                    }
                ];

                const scheduler = createInstance({
                    dataSource: data,
                    views: ['month'],
                    currentView: 'month',
                    currentDate: new Date(2017, 4, 25),
                    startDayHour: 9,
                    height: 600
                }, this.clock);

                const appointments = scheduler.instance._getAppointmentsToRepaint();
                assert.strictEqual(appointments[0].settings[1].index, 0, 'Long term appointment tail has right index');
                assert.strictEqual(appointments[1].settings[0].index, 1, 'Appointment next to long term appointment head has right index');
                assert.strictEqual(appointments[2].settings[0].index, 1, 'Appointment next to long term appointment tail has right index');
            });

            test('Appointment should be rendered correctly after changing view (T593699)', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 6, 10),
                    views: ['month', 'week'],
                    currentView: 'month',
                    maxAppointmentsPerCell: 'auto',
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 6, 10, 0),
                        endDate: new Date(2015, 6, 10, 0, 30),
                        ownerId: { id: 1 }
                    }],
                    height: 300
                }, this.clock);

                scheduler.instance.option('currentView', 'week');
                assert.notOk(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0).data('dxItemData').settings, 'Item hasn\'t excess settings');
            });

            test('Appointments should be rendered correctly, Month view with intervalCount and startDate', function(assert) {
                const tasks = [
                    { text: 'One', startDate: new Date(2017, 5, 22, 4), endDate: new Date(2017, 5, 22, 4, 30) },
                    { text: 'Two', startDate: new Date(2017, 5, 26, 0), endDate: new Date(2017, 5, 26, 0, 30) },
                    { text: 'Three', startDate: new Date(2017, 6, 2, 10), endDate: new Date(2017, 6, 2, 11) },
                    { text: 'Four', startDate: new Date(2017, 6, 9, 8), endDate: new Date(2017, 6, 9, 8, 30) },
                    { text: 'Five', startDate: new Date(2017, 7, 9, 8), endDate: new Date(2017, 7, 9, 8, 30) }
                ];
                const dataSource = new DataSource({
                    store: tasks
                });
                const scheduler = createInstance({
                    currentDate: new Date(2017, 5, 26),
                    dataSource: dataSource,
                    views: [{
                        type: 'month',
                        intervalCount: 3,
                        startDate: new Date(2017, 0, 19)
                    }],
                    currentView: 'month',
                    firstDayOfWeek: 1,
                    height: 800
                }, this.clock);

                const $appointments = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.equal($appointments.length, 3, 'Appointments were rendered correctly');
            });

            test('Appointments should be rendered correctly in vertical grouped workspace Month', function(assert) {

                const scheduler = createInstance({
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2018, 2, 16, 9),
                        endDate: new Date(2018, 2, 16, 10, 30),
                        id: 1
                    }, {
                        text: 'b',
                        startDate: new Date(2018, 2, 16, 9),
                        endDate: new Date(2018, 2, 16, 10, 30),
                        id: 2
                    }],
                    currentDate: new Date(2018, 2, 1),
                    views: [{
                        type: 'month',
                        groupOrientation: 'vertical'
                    }],
                    currentView: 'month',
                    groups: ['id'],
                    resources: [
                        {
                            field: 'id',
                            dataSource: [
                                { id: 1, text: 'one' },
                                { id: 2, text: 'two' }
                            ]
                        }
                    ]
                }, this.clock);

                const $appointments = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS);
                assert.equal($appointments.length, 2, 'two appointments is rendered');

                const cellHeight = getOuterHeight($(scheduler.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0));
                const cellPosition = $(scheduler.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(5).position().left;

                assert.roughEqual($appointments.eq(0).position().top, cellHeight * 2 + APPOINTMENT_DEFAULT_TOP_OFFSET, 1, 'correct top position');
                assert.roughEqual($appointments.eq(0).position().left, cellPosition, 1.5, 'correct left position');
                assert.roughEqual($appointments.eq(1).position().top, cellHeight * 8 + APPOINTMENT_DEFAULT_TOP_OFFSET, 3.5, 'correct top position');
                assert.roughEqual($appointments.eq(1).position().left, cellPosition, 1.5, 'correct left position');
            });

            test('Appointment should be resized correctly to left side in horizontal grouped workspace Month', function(assert) {
                const scheduler = createInstance({
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2018, 2, 5, 12),
                        endDate: new Date(2018, 2, 5, 12, 30),
                        id: 1
                    }],
                    currentDate: new Date(2018, 2, 1),
                    views: [{
                        type: 'month',
                        groupOrientation: 'vertical'
                    }],
                    currentView: 'month',
                    groups: ['id'],
                    editing: true,
                    resources: [
                        {
                            field: 'id',
                            dataSource: [
                                { id: 1, text: 'one' },
                                { id: 2, text: 'two' }
                            ]
                        }
                    ]
                }, this.clock);

                const $element = $(scheduler.instance.$element());
                const cellWidth = getOuterWidth($element.find('.' + DATE_TABLE_CELL_CLASS).eq(0));
                const pointer = pointerMock($element.find('.dx-resizable-handle-left').eq(0)).start();

                pointer.dragStart().drag(-(cellWidth / 2), 0);
                pointer.dragEnd();

                const $appointment = $element.find('.' + APPOINTMENT_CLASS).eq(0);

                assert.roughEqual($appointment.position().left, 0, 1.1, 'Left coordinate is correct');
            });

            test('Long appointment should have correct parts count(T854740)', function(assert) {

                const data = [{ text: 'Two Weeks App (Jan 6 - Jan 19)', startDate: new Date(2020, 0, 6), endDate: new Date(2020, 0, 19, 12), typeId: 1 }];

                const scheduler = createWrapper({
                    dataSource: data,
                    views: ['month'],
                    firstDayOfWeek: 1,
                    currentView: 'month',
                    currentDate: new Date(2020, 0, 1),
                    scrolling: {
                        mode: scrollingMode
                    },
                    height: 500,
                    width: 250
                }, this.clock);

                assert.equal(scheduler.appointments.getAppointmentCount(), 2, 'Appointment parts are ok');
            });

            test('Long appt parts should have correct coordinates if duration > week in vertical grouped workspace Month', function(assert) {
                const scheduler = createInstance({
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2018, 2, 11, 12),
                        endDate: new Date(2018, 2, 18, 11, 30),
                        id: 1
                    }],
                    currentDate: new Date(2018, 2, 1),
                    views: [{
                        type: 'month',
                        groupOrientation: 'vertical'
                    }],
                    currentView: 'month',
                    groups: ['id'],
                    resources: [
                        {
                            field: 'id',
                            dataSource: [
                                { id: 1, text: 'one' },
                                { id: 2, text: 'two' }
                            ]
                        }
                    ]
                }, this.clock);

                const $firstPart = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const $secondPart = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(1);

                assert.roughEqual($firstPart.position().left, 0, 1.1, 'correct left position');
                assert.roughEqual($secondPart.position().left, 0, 1.1, 'correct left position');
            });

            test('Long appointment should have correct parts count if widget is zoomed (T854740)', function(assert) {

                if(!browser.webkit) {
                    assert.ok(true, 'Browser zooming is enabled in webkit');
                    return;
                }

                $('#scheduler').css('zoom', 1.25);

                const data = [{
                    text: 'Two Weeks App (Jan 6 - Jan 19)',
                    startDate: new Date(2020, 0, 6),
                    endDate: new Date(2020, 0, 19, 12),
                    typeId: 1
                }];

                const scheduler = createWrapper({
                    dataSource: data,
                    views: ['month'],
                    firstDayOfWeek: 1,
                    currentView: 'month',
                    currentDate: new Date(2020, 0, 1),
                    crossScrollingEnabled: true,
                    scrolling: {
                        mode: scrollingMode
                    },
                    height: 500,
                    width: 250
                }, this.clock);

                assert.equal(scheduler.appointments.getAppointmentCount(), 2, 'Appointment parts are ok');
            });

            test('Appointments from neighbor cells should not overlap each other if widget is zoomed (T885595)', function(assert) {
                if(!browser.webkit) {
                    assert.ok(true, 'Browser zooming is enabled in webkit');
                    return;
                }

                $('#scheduler').css('zoom', 1.1);

                const data = [{
                    text: 'Provide New Health Insurance Docs',
                    startDate: new Date(2017, 4, 22, 12, 45),
                    endDate: new Date(2017, 4, 22, 14, 15)
                }, {
                    text: 'Recall Rebate Form',
                    startDate: new Date(2017, 4, 23, 12, 45),
                    endDate: new Date(2017, 4, 23, 13, 15)
                }];

                const scheduler = createWrapper({
                    dataSource: data,
                    width: 1023.1,
                    views: [{
                        type: 'month',
                        name: 'Auto Mode',
                        maxAppointmentsPerCell: 'auto'
                    }],
                    currentView: 'Auto Mode',
                    currentDate: new Date(2017, 4, 25),
                    scrolling: {
                        mode: scrollingMode
                    },
                    height: 650
                }, this.clock);

                assert.equal(scheduler.appointments.getAppointmentPosition(0).top, scheduler.appointments.getAppointmentPosition(1).top, 'Appointment positions are correct');
            });
        });
    });

    module('Recurrence', () => {
        [
            {
                scrollingMode: 'standard',
                expected: [
                    {
                        color: '#ff0000',
                        indices: [0, 1, 4]
                    },
                    {
                        color: '#0000ff',
                        indices: [2, 3, 5]
                    }
                ]
            }, {
                scrollingMode: 'virtual',
                expected: [
                    {
                        color: '#ff0000',
                        indices: [0, 1, 2]
                    },
                    {
                        color: '#0000ff',
                        indices: [3, 4, 5]
                    }
                ]
            }
        ].forEach(({ scrollingMode, expected }) => {
            test(`Grouped recurrence tasks should have a correct color in ${scrollingMode} scrolling mode`, function(assert) {
                const scheduler = createInstanceBase({
                    currentDate: new Date(2015, 11, 10),
                    currentView: 'month',
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 11, 12),
                        endDate: new Date(2015, 11, 14),
                        ownerId: [1, 2],
                        recurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=2',
                        firstDayOfWeek: 1
                    }],
                    groups: ['ownerId'],
                    resources: [
                        {
                            field: 'ownerId',
                            dataSource: [
                                { id: 1, text: 'one', color: '#ff0000' },
                                { id: 2, text: 'two', color: '#0000ff' }
                            ]
                        }
                    ],
                    scrolling: {
                        mode: scrollingMode
                    },
                    width: 800,
                    height: 600
                }, this.clock);

                const task = scheduler.instance.$element().find(`.${APPOINTMENT_CLASS}`);

                expected.forEach(({ color, indices }) => {
                    indices.forEach(index => {
                        assert.equal(getAppointmentColor(task.eq(index)), color, `${color} Color is OK`);
                    });
                });
            });
        });
    });
});
