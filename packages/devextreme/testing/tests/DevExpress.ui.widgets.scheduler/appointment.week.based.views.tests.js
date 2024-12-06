import { getHeight, getOuterHeight, getOuterWidth } from 'core/utils/size';
import $ from 'jquery';
import errors from 'ui/widget/ui.errors';
import translator from 'common/core/animation/translator';
import dateLocalization from 'common/core/localization/date';
import fx from 'common/core/animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import Color from 'color';
import { hide } from '__internal/ui/tooltip/m_tooltip';
import { DataSource } from 'common/data/data_source/data_source';
import { CustomStore } from 'common/data/custom_store';
import dataUtils from 'core/element_data';
import dateSerialization from 'core/utils/date_serialization';
import {
    initTestMarkup,
    asyncAssert,
    createWrapper,
    supportedScrollingModes
} from '../../helpers/scheduler/helpers.js';

import '__internal/scheduler/m_scheduler';
import 'ui/switch';
import 'generic_light.css!';

const {
    module,
    test,
    skip
} = QUnit;

QUnit.testStart(() => initTestMarkup());

const DATE_TABLE_CELL_CLASS = 'dx-scheduler-date-table-cell';
const APPOINTMENT_CLASS = 'dx-scheduler-appointment';

const APPOINTMENT_DEFAULT_LEFT_OFFSET = 26;

const createInstanceBase = (options, clock) => {
    const scheduler = createWrapper({
        height: 600,
        ...options,
    }, clock);

    clock.tick(300);
    scheduler.instance.focus();

    return scheduler;
};

const getAppointmentColor = ($task, checkedProperty) => {
    checkedProperty = checkedProperty || 'backgroundColor';
    return new Color($task.css(checkedProperty)).toHex();
};

module('Integration: Appointment Day, Week views', {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    module('Scrolling mode standard', () => {
        test('DataSource option should be passed to the appointments collection after wrap by layout manager', function(assert) {
            const data = new DataSource({
                store: [
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
                ]
            });

            const scheduler = createInstanceBase({
                views: ['day', 'week'],
                currentView: 'day',
                dataSource: data,
                currentDate: new Date(2015, 1, 9)
            }, this.clock);

            const dataSourceItems = scheduler.instance.option('dataSource').items();
            const appointmentsItems = scheduler.instance.getAppointmentsInstance().option('items');

            $.each(dataSourceItems, function(index, item) {
                assert.equal(appointmentsItems[index].itemData, item, 'Item is correct');
            });
        });

        test('Short tasks should have a right height (T725948)', function(assert) {
            const scheduler = createInstanceBase({
                dataSource: [
                    {
                        endDate: '2019-03-20T12:06:41.000Z',
                        startDate: '2019-03-20T12:06:40.000Z'
                    }
                ],
                currentView: 'day',
                views: ['day'],
                height: 800,
                currentDate: new Date(2019, 2, 20),
                firstDayOfWeek: 1,
                cellDuration: 15
            }, this.clock);

            this.clock.tick(10);

            const $appointment = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);

            assert.roughEqual(getHeight($appointment), 3, 0.5, 'Task has a right height');
        });

        test('DblClick on appointment should not affect the related cell start date (T395620)', function(assert) {
            const scheduler = createInstanceBase({
                currentDate: new Date(2015, 1, 9),
                dataSource: [
                    {
                        text: 'Task 1',
                        startDate: new Date(2015, 1, 9, 1, 0),
                        endDate: new Date(2015, 1, 9, 2, 0)
                    },
                    {
                        text: 'Task 2',
                        startDate: new Date(2015, 1, 9, 3, 0),
                        endDate: new Date(2015, 1, 9, 4, 0)
                    }
                ],
                height: 600,
            }, this.clock);

            sinon.stub(scheduler.instance, 'showAppointmentPopup');

            try {
                const appointment = scheduler.appointmentList[0];
                const apptData = appointment.data;

                apptData.startDate = new Date(2015, 1, 9, 2);

                appointment.dbClick();

                const cell = scheduler.workSpace.getCell(2, 0).get(0);

                const relatedCellData = !scheduler.instance.option('renovateRender')
                    ? dataUtils.data(cell, 'dxCellData').startDate
                    : scheduler.instance.getWorkSpace().getCellData($(cell)).startDate;

                assert.equal(relatedCellData.getTime(), new Date(2015, 1, 9, 1).getTime(), 'Cell start date is OK');
            } finally {
                scheduler.instance.showAppointmentPopup.restore();
            }
        });
    });

    supportedScrollingModes.forEach(scrollingMode => {
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

        module(`Scrolling mode ${scrollingMode}`, () => {
            test('Scheduler tasks should have a right parent', function(assert) {
                const scheduler = createInstance({}, this.clock);

                assert.equal(
                    scheduler.instance.$element().find('.dx-scheduler-work-space .dx-scrollable-content .dx-scheduler-date-table-container>.dx-scheduler-scrollable-appointments').length
                    || scheduler.instance.$element().find('.dx-scheduler-work-space .dx-scrollable-content>.dx-scheduler-scrollable-appointments').length,
                    1,
                    'scrollable is parent of dxSchedulerAppointments',
                );
            });

            test('Scheduler tasks should have a right height', function(assert) {
                const appointments = [
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

                const scheduler = createInstance({ dataSource: appointments, currentDate: new Date(2015, 1, 9) }, this.clock);
                this.clock.tick(10);
                const cellHeight = scheduler.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0).get(0).getBoundingClientRect().height;
                const resultHeight = cellHeight * 2;

                assert.equal(getOuterHeight(scheduler.instance.$element().find('.' + APPOINTMENT_CLASS).eq(0)), resultHeight, 'Task has a right height');
            });

            test('Appointment dates should not be normalized before sending to the details view', function(assert) {
                const startDate = 1429776000000;
                const endDate = 1429794000000;
                const task = {
                    text: 'Task 1',
                    ownerId: 1,
                    startDate: startDate,
                    endDate: endDate
                };

                const scheduler = createInstance({
                    dataSource: new DataSource({
                        store: [task]
                    }),
                    currentDate: new Date(2015, 3, 23),
                    height: 1500
                }, this.clock);

                this.clock.tick(10);

                const spy = sinon.spy(scheduler.instance._appointmentPopup, 'show');

                scheduler.appointments.click();
                this.clock.tick(300);
                scheduler.tooltip.clickOnItem();

                try {
                    const args = spy.getCall(0).args[0];
                    assert.deepEqual(args.startDate, startDate, 'Start date is OK');
                    assert.deepEqual(args.endDate, endDate, 'End date is OK');

                    hide();
                } finally {
                    scheduler.instance._appointmentPopup.show.restore();
                }
            });

            test('Appointment should be copied before sending to the details view', function(assert) {
                const task = {
                    text: 'Task 1',
                    startDate: 1429776000000,
                    endDate: 1429794000000
                };

                const scheduler = createInstance({
                    dataSource: new DataSource({
                        store: [task]
                    }),
                    currentDate: new Date(2015, 3, 23)
                }, this.clock);

                this.clock.tick(10);

                scheduler.instance.showAppointmentPopup(task);

                const detailsForm = scheduler.instance.getAppointmentDetailsForm();
                const formData = detailsForm.option('formData');

                assert.notEqual(formData, task, 'Appointment data is copied');
            });

            test('Non-grid-aligned appointments should be resized correctly', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 1, 9),
                    editing: true,
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 1, 9, 1),
                        endDate: new Date(2015, 1, 9, 1, 20)
                    }]
                }, this.clock);

                const cellHeight = getOuterHeight(scheduler.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0));

                const pointer = pointerMock(scheduler.instance.$element().find('.dx-resizable-handle-bottom').eq(0)).start();
                pointer.dragStart().drag(0, cellHeight).dragEnd();

                assert.deepEqual(scheduler.instance.option('dataSource')[0].endDate, new Date(2015, 1, 9, 2), 'End date is OK');
            });

            test('Non-grid-aligned appointments should be resized correctly, when startDayHour is set', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 1, 9),
                    editing: true,
                    startDayHour: 9,
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 1, 9, 10, 25),
                        endDate: new Date(2015, 1, 9, 11)
                    }]
                }, this.clock);

                const cellHeight = getOuterHeight(scheduler.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0));

                const pointer = pointerMock(scheduler.instance.$element().find('.dx-resizable-handle-top').eq(0)).start();
                pointer.dragStart().drag(0, -3 * cellHeight).dragEnd();

                assert.deepEqual(scheduler.instance.option('dataSource')[0].startDate, new Date(2015, 1, 9, 9), 'Start date is OK');
            });

            test('Non-grid-aligned appointments should be resized correctly, when endDayHour is set', function(assert) {
                this.clock.restore();

                const scheduler = createInstance({
                    currentDate: new Date(2015, 1, 9),
                    editing: true,
                    endDayHour: 15,
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 1, 9, 13),
                        endDate: new Date(2015, 1, 9, 14, 25)
                    }]
                }, this.clock);

                scheduler.instance.getWorkSpace().getScrollable().scrollTo({ y: 1000 });

                return asyncAssert(assert, () => {
                    const cellHeight = getOuterHeight(scheduler.instance.$element().find(`.${DATE_TABLE_CELL_CLASS}`).eq(0));

                    const pointer = pointerMock(scheduler.instance.$element().find('.dx-resizable-handle-bottom').eq(0)).start();
                    pointer.dragStart().drag(0, cellHeight).dragEnd();

                    assert.deepEqual(scheduler.instance.option('dataSource')[0].endDate, new Date(2015, 1, 9, 15), 'End date is OK');

                });
            });

            test('Task should be placed in correct group', function(assert) {
                const data = new DataSource({
                    store: [{ text: 'Item 1', ownerId: 2, startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 0, 30) }]
                });

                const scheduler = createInstance({
                    currentDate: new Date(2015, 1, 9),
                    groups: ['ownerId'],
                    resources: [{
                        field: 'ownerId',
                        dataSource: [{ id: 1, text: 'John' }, { id: 2, text: 'Mike' }]
                    }],
                    crossScrollingEnabled: true,
                    width: 1700
                }, this.clock);

                scheduler.instance.option('dataSource', data);

                const itemShift = (getOuterWidth($('.dx-scheduler-date-table'))) * 0.5;
                const position = $('.dx-scheduler-appointment').position();

                assert.roughEqual(position.top, 0, 1.001, 'top is correct');
                assert.roughEqual(position.left, itemShift, 1.001, 'left is correct');
            });

            test('Tasks should have a right color', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 2, 18),
                    dataSource: [
                        {
                            id: 1,
                            text: 'Item 1',
                            roomId: [1, 2],
                            ownerId: [1, 2],
                            managerId: 1,
                            startDate: new Date(2015, 2, 18),
                            endDate: new Date(2015, 2, 18, 0, 30)
                        },
                        {
                            id: 2,
                            text: 'Item 2',
                            roomId: 1,
                            ownerId: 2,
                            managerId: 1,
                            startDate: new Date(2015, 2, 18),
                            endDate: new Date(2015, 2, 18, 0, 30)
                        }
                    ],
                    groups: ['roomId', 'ownerId'],
                    resources: [
                        {
                            field: 'roomId',
                            allowMultiple: true,
                            dataSource: [
                                { id: 1, text: 'Room 1', color: '#ff0000' },
                                { id: 2, text: 'Room 2', color: '#0000ff' }
                            ]
                        },
                        {
                            fieldExpr: 'ownerId',
                            allowMultiple: true,
                            dataSource: [
                                { id: 1, text: 'John', color: '#cb2824' },
                                { id: 2, text: 'Mike', color: '#cb7d7b' }
                            ]
                        },
                        {
                            field: 'managerId',
                            dataSource: [
                                { id: 1, text: 'mr. Smith', color: '#CB6BB2' },
                                { id: 2, text: 'mr. Bale', color: '#CB289F' }
                            ]
                        }
                    ],
                    width: 800
                }, this.clock);

                const tasks = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.equal(getAppointmentColor(tasks.eq(0)), '#cb2824', 'Color is OK');
                assert.equal(getAppointmentColor(tasks.eq(1)), '#cb7d7b', 'Color is OK');
                assert.equal(getAppointmentColor(tasks.eq(2)), '#cb2824', 'Color is OK');
                assert.equal(getAppointmentColor(tasks.eq(3)), '#cb7d7b', 'Color is OK');
                assert.equal(getAppointmentColor(tasks.eq(4)), '#cb7d7b', 'Color is OK');
            });

            test('Ungrouped tasks should have a right color (via the "useColorAsDefault" field)', function(assert) {
                try {
                    const data = new DataSource({
                        store: [
                            { text: 'Item 1', ownerId: 2, startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 0, 30) },
                            { text: 'Item 2', startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 0, 30) }
                        ]
                    });

                    const scheduler = createInstance({
                        currentDate: new Date(2015, 1, 9),
                        resources: [{
                            field: 'ownerId',
                            useColorAsDefault: true,
                            dataSource: [{ id: 1, text: 'John', color: '#ff0000' }, { id: 2, text: 'Mike', color: '#0000ff' }]
                        }],
                        dataSource: data,
                        width: 700
                    }, this.clock);

                    const tasks = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);
                    assert.equal(getAppointmentColor(tasks.eq(0)), '#0000ff', 'Color is OK');
                    assert.equal($.inArray(getAppointmentColor(tasks.eq(1)), ['#ff0000', '#0000ff']), -1, 'Color is OK');
                } finally {
                    $('.dynamic-styles').remove();
                }
            });

            skip('Appointment width should depend on cell width', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 2, 18),
                    maxAppointmentsPerCell: 'auto'
                }, this.clock);

                const workSpace = scheduler.instance.getWorkSpace();
                const defaultGetCellWidthMethod = workSpace.getCellWidth;
                const CELL_WIDTH = 777;

                workSpace.getCellWidth = function() {
                    return CELL_WIDTH;
                };
                try {
                    scheduler.instance.option('dataSource', [
                        { id: 1, text: 'Item 1', startDate: new Date(2015, 2, 18), endDate: new Date(2015, 2, 18, 0, 30) }
                    ]);

                    assert.equal(scheduler.appointments.getAppointmentWidth(), CELL_WIDTH - APPOINTMENT_DEFAULT_LEFT_OFFSET, 'Appointment width is OK');

                } finally {
                    workSpace.getCellWidth = defaultGetCellWidthMethod;
                }
            });

            test('Multi-day appointments with startDate less than startDayHour should be rendered ', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 11, 14),
                    currentView: 'week',
                    endDayHour: 10,
                    startDayHour: 2,
                    firstDayOfWeek: 1,
                    dataSource: [
                        {
                            startDate: new Date(2015, 11, 14),
                            endDate: new Date(2015, 11, 19),
                            text: 'Second shift',
                            Status: { StatusId: 0 }
                        }
                    ]
                }, this.clock);

                const $appointments = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);
                assert.equal($appointments.length, 1, 'Appointment was rendered');
            });

            test('Appointments should be cleared when currentDate option is changed', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 3, 16),
                    firstDayOfWeek: 1,
                    currentView: 'week',
                    dataSource: new DataSource({
                        store: new CustomStore({
                            load: function(options) {
                                const d = $.Deferred();
                                setTimeout(function() {
                                    d.resolve([{
                                        text: 'b', allDay: true, startDate: new Date(2015, 3, 16), endDate: new Date(2015, 3, 16, 0, 30)
                                    }, {
                                        text: 'a', startDate: new Date(2015, 3, 16), endDate: new Date(2015, 3, 16, 0, 30)
                                    }]);
                                }, 300);

                                return d.promise();
                            }
                        })
                    })
                }, this.clock);
                this.clock.tick(300);
                assert.strictEqual(scheduler.instance.$element().find('.' + APPOINTMENT_CLASS).length, 2);

                scheduler.instance.option('currentDate', new Date(2015, 4, 6));
                this.clock.tick(300);

                assert.strictEqual(scheduler.instance.$element().find('.' + APPOINTMENT_CLASS).length, 0);

                scheduler.instance.option('currentDate', new Date(2015, 3, 16));
                this.clock.tick(300);

                assert.equal(scheduler.instance.$element().find('.' + APPOINTMENT_CLASS).length, 2);
            });

            test('Appointments should be cleared when startDayHour option is changed', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 3, 16),
                    firstDayOfWeek: 1,
                    currentView: 'day',
                    dataSource: new DataSource({
                        store: new CustomStore({
                            load: function(options) {
                                const d = $.Deferred();
                                setTimeout(function() {
                                    d.resolve([{
                                        text: 'a', startDate: new Date(2015, 3, 16, 0), endDate: new Date(2015, 3, 16, 0, 30)
                                    }, {
                                        text: 'b', startDate: new Date(2015, 3, 16, 3), endDate: new Date(2015, 3, 16, 3, 30)
                                    }]);
                                }, 300);

                                return d.promise();
                            }
                        })
                    })
                }, this.clock);
                this.clock.tick(300);
                assert.strictEqual(scheduler.instance.$element().find('.' + APPOINTMENT_CLASS).length, 2);

                scheduler.instance.option('startDayHour', 2);
                this.clock.tick(300);

                assert.strictEqual(scheduler.instance.$element().find('.' + APPOINTMENT_CLASS).length, 1);

                scheduler.instance.option('startDayHour', 0);
                this.clock.tick(300);

                assert.equal(scheduler.instance.$element().find('.' + APPOINTMENT_CLASS).length, 2);
            });

            test('Appointments should be cleared when endDayHour option is changed', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 3, 16),
                    firstDayOfWeek: 1,
                    currentView: 'day',
                    dataSource: new DataSource({
                        store: new CustomStore({
                            load: function(options) {
                                const d = $.Deferred();
                                setTimeout(function() {
                                    d.resolve([{
                                        text: 'a', startDate: new Date(2015, 3, 16, 0), endDate: new Date(2015, 3, 16, 0, 30)
                                    }, {
                                        text: 'b', startDate: new Date(2015, 3, 16, 3), endDate: new Date(2015, 3, 16, 3, 30)
                                    }]);
                                }, 300);

                                return d.promise();
                            }
                        })
                    })
                }, this.clock);
                this.clock.tick(300);
                assert.strictEqual(scheduler.instance.$element().find('.' + APPOINTMENT_CLASS).length, 2);

                scheduler.instance.option('endDayHour', 2);
                this.clock.tick(300);

                assert.strictEqual(scheduler.instance.$element().find('.' + APPOINTMENT_CLASS).length, 1);

                scheduler.instance.option('endDayHour', 10);
                this.clock.tick(300);

                assert.equal(scheduler.instance.$element().find('.' + APPOINTMENT_CLASS).length, 2);
            });

            test('Appointment should be rendered correctly with expressions on init', function(assert) {
                const startDate = new Date(2015, 1, 4, 0);
                const endDate = new Date(2015, 1, 4, 1);
                const appointments = [{
                    Start: startDate.getTime(),
                    End: endDate.getTime(),
                    Text: 'abc'
                }, {
                    Start: startDate.getTime(),
                    End: endDate.getTime(),
                    Text: 'def',
                    RecRule: 'FREQ=DAILY'
                }];

                const scheduler = createInstance({
                    currentDate: new Date(2015, 1, 4),
                    views: ['day'],
                    currentView: 'day',
                    firstDayOfWeek: 1,
                    dataSource: appointments,
                    startDateExpr: 'Start',
                    endDateExpr: 'End',
                    textExpr: 'Text',
                    recurrenceRuleExpr: 'RecRule'
                }, this.clock);

                const $appointment = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const $recAppointment = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS).eq(1);
                const resultDate = `${dateLocalization.format(startDate, 'shorttime')} - ${dateLocalization.format(endDate, 'shorttime')}`;

                assert.equal($appointment.find('.dx-scheduler-appointment-content div').eq(0).text(), 'abc', 'Text is correct on init');
                assert.equal($appointment.find('.dx-scheduler-appointment-content-date').eq(0).text(), resultDate, 'Date is correct on init');
                assert.notOk($appointment.find('.dx-scheduler-appointment-recurrence-icon').length, 'Repeat icon isn\'t rendered');
                assert.equal($recAppointment.find('.dx-scheduler-appointment-recurrence-icon').length, 1, 'Repeat icon is rendered');
            });

            test('Appointment should be rendered correctly with recurrenceRule expression', function(assert) {
                const startDate = new Date(2015, 1, 4, 0);
                const endDate = new Date(2015, 1, 4, 1);
                const appointments = [{
                    startDate: startDate.getTime(),
                    endDate: endDate.getTime(),
                    text: 'def',
                    RecRule: 'FREQ=DAILY'
                }
                ];

                const scheduler = createInstance({
                    currentDate: new Date(2015, 1, 4),
                    views: ['day'],
                    currentView: 'day',
                    firstDayOfWeek: 1,
                    dataSource: appointments,
                    recurrenceRuleExpr: 'RecRule'
                }, this.clock);

                const $recAppointment = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS).eq(0);
                const resultDate = `${dateLocalization.format(startDate, 'shorttime')} - ${dateLocalization.format(endDate, 'shorttime')}`;

                assert.equal($recAppointment.find('.dx-scheduler-appointment-content div').eq(0).text(), 'def', 'Text is correct on init');

                assert.equal($recAppointment.find('.dx-scheduler-appointment-content-date').eq(0).text(), resultDate, 'Date is correct on init');
                assert.equal($recAppointment.find('.dx-scheduler-appointment-recurrence-icon').length, 1, 'Recurrence icon is rendered');
            });

            test('Appointment should be rendered correctly with expressions on optionChanged', function(assert) {
                const oldStartDate = new Date(2015, 1, 4);
                const startDate = new Date(2015, 1, 4, 1);
                const endDate = new Date(2015, 1, 4, 2);
                const appointment = {
                    Start: oldStartDate.getTime(),
                    End: startDate.getTime(),
                    Text: 'abc',

                    AppointmentStart: startDate.getTime(),
                    AppointmentEnd: endDate.getTime(),
                    AppointmentText: 'xyz'
                };

                const scheduler = createInstance({
                    currentDate: new Date(2015, 1, 4),
                    views: ['day'],
                    currentView: 'day',
                    firstDayOfWeek: 1,
                    dataSource: [appointment],
                    startDateExpr: 'Start',
                    endDateExpr: 'End',
                    textExpr: 'Text',
                }, this.clock);

                scheduler.instance.option({
                    startDateExpr: 'AppointmentStart',
                    endDateExpr: 'AppointmentEnd',
                    textExpr: 'AppointmentText'
                });

                const $appointment = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const resultDate = `${dateLocalization.format(startDate, 'shorttime')} - ${dateLocalization.format(endDate, 'shorttime')}`;

                assert.equal($appointment.find('.dx-scheduler-appointment-content .dx-scheduler-appointment-title').eq(0).text(), 'xyz', 'Text is correct on init');
                assert.equal($appointment.find('.dx-scheduler-appointment-content-date').eq(0).text(), resultDate, 'Date is correct on init');
            });

            test('Appointment should be rendered correctly with expressions on custom template', function(assert) {
                const startDate = new Date(2015, 1, 4, 1);
                const endDate = new Date(2015, 1, 4, 2);
                const appointment = {
                    Start: startDate.getTime(),
                    End: endDate.getTime(),
                    Text: 'abc'
                };

                const scheduler = createInstance({
                    currentDate: new Date(2015, 1, 4),
                    views: ['day'],
                    currentView: 'day',
                    firstDayOfWeek: 1,
                    dataSource: [appointment],
                    startDateExpr: 'Start',
                    endDateExpr: 'End',
                    textExpr: 'Text',
                    appointmentTemplate: function(model) {
                        return '<div class=\'custom-title\'>' + model.appointmentData.Text + '</div>';
                    }
                }, this.clock);

                const $appointment = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);

                assert.equal($appointment.find('.custom-title').text(), 'abc', 'Text is correct on init');
            });

            test('Appointment should have right position, if it is not startDate time less than startDayHour option value', function(assert) {
                const appointment = {
                    startDate: new Date(2016, 2, 1, 2),
                    endDate: new Date(2016, 2, 1, 5)
                };

                const scheduler = createInstance({
                    currentDate: new Date(2016, 2, 1),
                    currentView: 'week',
                    firstDayOfWeek: 1,
                    dataSource: [appointment],
                    startDayHour: 3
                }, this.clock);

                const $appointment = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const $targetCell = scheduler.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(1);

                assert.roughEqual($appointment.position().top, $targetCell.position().top, 1.001, 'appointment top is correct');
                assert.roughEqual($appointment.position().left, $targetCell.position().left, 1.001, 'appointment left is correct');
            });

            test('Appointment with zero-duration should be rendered correctly (T443143)', function(assert) {
                const scheduler = createInstance({
                    dataSource: [{
                        text: 'Website Re-Design Plan',
                        startDate: new Date(2016, 8, 16),
                        endDate: new Date(2016, 8, 16)
                    }],
                    currentDate: new Date(2016, 8, 16),
                    currentView: 'agenda',
                    views: ['agenda'],
                    height: 600
                }, this.clock);

                const $element = scheduler.instance.$element();
                const $appointments = $element.find('.' + APPOINTMENT_CLASS);

                assert.equal($appointments.length, 1, 'Appt is rendered');
                assert.equal($element.find('.dx-scheduler-agenda-nodata').length, 0, 'There is no \'No data\' message');
            });

            test('Small appointment should have hidden content information but visible content element(T469453)', function(assert) {
                const scheduler = createInstance({
                    dataSource: [{
                        text: 'Meeting',
                        startDate: new Date(2016, 8, 16),
                        endDate: new Date(2016, 8, 16, 0, 5),
                        recurrenceRule: 'FREQ=DAILY'
                    }],
                    currentDate: new Date(2016, 8, 16),
                    currentView: 'day',
                    views: ['day'],
                    height: 600
                }, this.clock);

                const $appointment = $(scheduler.instance.$element()).find('.dx-scheduler-appointment-empty');
                const $appointmentContent = $appointment.find('.dx-scheduler-appointment-content');
                const $appointmentTitle = $appointmentContent.find('.dx-scheduler-appointment-title');
                const $appointmentDetails = $appointmentContent.find('.dx-scheduler-appointment-content-details');
                const $appointmentRecurringIcon = $appointmentContent.find('.dx-scheduler-appointment-recurrence-icon');

                assert.equal($appointmentContent.css('display'), 'block', 'Appointment content is visible');
                assert.equal($appointmentTitle.css('display'), 'none', 'Appointment title isn\'t visible');
                assert.equal($appointmentDetails.css('display'), 'none', 'Appointment title isn\'t visible');
                assert.equal($appointmentRecurringIcon.css('display'), 'none', 'Appointment recurring icon isn\'t visible');
            });

            test('Appointment startDate and endDate should have correct format in the details view after allDay appoitment opening (T505119)', function(assert) {
                const tasks = [{
                    text: 'AllDay task',
                    start: new Date(2017, 2, 13),
                    end: new Date(2017, 2, 13, 0, 30),
                    AllDay: true
                }, {
                    text: 'Short task',
                    start: new Date(2017, 2, 13),
                    end: new Date(2017, 2, 13, 0, 30)
                }];

                const scheduler = createInstance({
                    dataSource: tasks,
                    currentDate: new Date(2017, 2, 13),
                    currentView: 'week',
                    views: ['week'],
                    startDateExpr: 'start',
                    endDateExpr: 'end',
                    allDayExpr: 'AllDay'
                }, this.clock);
                scheduler.instance.showAppointmentPopup(tasks[0]);
                scheduler.instance.hideAppointmentPopup();
                scheduler.instance.showAppointmentPopup(tasks[1]);

                const detailsForm = scheduler.instance.getAppointmentDetailsForm();
                const startDateEditor = detailsForm.getEditor('start');
                const endDateEditor = detailsForm.getEditor('end');

                assert.equal(startDateEditor.option('type'), 'datetime', 'start date is correct');
                assert.equal(endDateEditor.option('type'), 'datetime', 'end date is correct');
            });

            test('Scheduler should not throw error at deferred appointment loading (T518327)', function(assert) {
                const data = [{ text: 'Task 1', startDate: new Date(2017, 4, 22, 16), endDate: new Date(2017, 4, 24, 1) }];

                const scheduler = createInstance({
                    dataSource: new DataSource({
                        store: new CustomStore({
                            load: function() {
                                const d = $.Deferred();
                                d.resolve(data);
                                return d.promise();
                            }
                        })
                    }),
                    currentDate: new Date(2017, 4, 20),
                    views: ['week', 'day'],
                    currentView: 'week'
                }, this.clock);

                const errorLogStub = sinon.stub(errors, 'log');
                scheduler.instance.option('currentView', 'day');

                assert.notOk(errorLogStub.called, 'Error was not thrown');
                errorLogStub.restore();
            });

            test('Exception should not be thrown on second details view opening if form items was not found', function(assert) {
                const task = { text: 'Task', startDate: new Date(2017, 2, 13), endDate: new Date(2017, 2, 13, 0, 30) };

                const scheduler = createInstance({
                    dataSource: [task],
                    currentDate: new Date(2017, 2, 13),
                    currentView: 'week',
                    views: ['week'],
                    onAppointmentFormOpening: function(e) {
                        e.form.option('items', []);
                    }
                }, this.clock);

                try {
                    scheduler.instance.showAppointmentPopup(task);
                    scheduler.instance.hideAppointmentPopup();

                    scheduler.instance.showAppointmentPopup(task);
                    assert.ok(true, 'exception is not expected');
                } catch(e) {
                    assert.ok(false, 'Exception: ' + e);
                }
            });

            test('FormData should be reset on saveChanges, dateSerializationFormat is set in initial appointment data (T569673)', function(assert) {
                const task = { text: 'Task', StartDate: '2016-05-25T09:40:00',
                    EndDate: '2016-05-25T10:40:00' };

                const scheduler = createInstance({
                    dataSource: [task],
                    currentDate: new Date(2016, 4, 25),
                    currentView: 'week',
                    views: ['week'],
                    startDateExpr: 'StartDate',
                    endDateExpr: 'EndDate',
                    onAppointmentFormOpening: function(data) {
                        const form = data.form;
                        let startDate = data.appointmentData.StartDate;
                        const endDate = data.appointmentData.EndDate;

                        form.option('items', [
                            {
                                dataField: 'StartDate',
                                editorType: 'dxDateBox',
                                editorOptions: {
                                    value: startDate,
                                    type: 'datetime',
                                    onValueChanged: function(args) {
                                        startDate = args.value;
                                        form.getEditor('EndDate')
                                            .option('value', new Date(1464160900000));
                                    }
                                }
                            }, {
                                name: 'EndDate',
                                dataField: 'EndDate',
                                editorType: 'dxDateBox',
                                editorOptions: {
                                    value: endDate,
                                    type: 'datetime',
                                    readOnly: true
                                }
                            }
                        ]);
                    },
                    height: 800
                }, this.clock);

                scheduler.instance.showAppointmentPopup(task, true);

                const detailsForm = scheduler.instance.getAppointmentDetailsForm();
                const startDateEditor = detailsForm.getEditor('StartDate');

                startDateEditor.option('value', '2016-05-25T10:40:00');

                $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick').trigger('dxclick');

                const $appointments = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);

                const endDateFormat = dateSerialization.getDateSerializationFormat(dataUtils.data($appointments[1], 'dxItemData').EndDate);
                assert.deepEqual(endDateFormat, 'yyyy-MM-ddTHH:mm:ss', 'Appointment EndDate format is OK');
            });

            test('A long appointment should not change start date if resized from the bottom', function(assert) {
                const expectedStartDate = new Date(2018, 4, 21, 0, 30);
                const scheduler = createInstance({
                    views: ['day'],
                    currentView: 'day',
                    currentDate: new Date(2018, 4, 21),
                    dataSource: [{
                        text: 'Test',
                        startDate: expectedStartDate,
                        endDate: new Date(2018, 4, 21, 23, 30),
                    }]
                }, this.clock);

                const $element = $(scheduler.instance.element());

                const workspace = scheduler.instance.getWorkSpace();
                workspace.getScrollable().scrollTo({ y: 3000 });

                const cellWidth = getOuterHeight($element.find(`.${DATE_TABLE_CELL_CLASS}`).eq(0));
                const pointer = pointerMock($element.find('.dx-resizable-handle-bottom').eq(0)).start();

                pointer.dragStart().drag(0, -cellWidth);
                pointer.dragEnd();

                const { startDate } = scheduler.instance.option('dataSource')[0];

                assert.deepEqual(startDate, expectedStartDate);
            });

            test('Tail of long appointment should have a right position, groupByDate = true', function(assert) {
                const scheduler = createInstance({
                    dataSource: [
                        { text: 'Task 1', startDate: new Date(2015, 8, 22, 22, 0), endDate: new Date(2015, 8, 23, 21, 0), ownerId: 2 }
                    ],
                    groupByDate: true,
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
                    currentDate: new Date(2015, 8, 22),
                    views: ['week'],
                    startDayHour: 20,
                    currentView: 'week',
                    firstDayOfWeek: 1,
                    width: 1600
                }, this.clock);

                const $appointmentTail = $(scheduler.instance.$element()).find('.dx-scheduler-work-space .dx-scheduler-appointment').eq(1);
                const $cell = $(scheduler.instance.$element()).find('.dx-scheduler-work-space .dx-scheduler-date-table-cell').eq(5);

                assert.roughEqual($appointmentTail.position().left, $cell.position().left, 1.001, 'Tail has a right position');
            });

            test('Appointment with equal startDate and endDate should render with 1 minute duration (T817857)', function(assert) {
                const scheduler = createInstance({
                    dataSource: [{
                        text: 'Zero minute appointment',
                        startDate: new Date(2019, 8, 1, 10, 0),
                        endDate: new Date(2019, 8, 1, 10, 0),
                    }, {
                        text: 'One minute appointment',
                        startDate: new Date(2019, 8, 1, 11, 0),
                        endDate: new Date(2019, 8, 1, 11, 1),
                    }],
                    views: ['day'],
                    currentView: 'day',
                    currentDate: new Date(2019, 8, 1, 10, 0),
                    startDayHour: 7,
                    endDayHour: 18,
                    height: 580,
                }, this.clock);

                assert.strictEqual(scheduler.appointments.getAppointmentCount(), 2, 'Appointments are rendered');
                assert.equal(scheduler.appointments.getAppointmentHeight(0), scheduler.appointments.getAppointmentHeight(1), 'Appointment heights are equal');
            });

            [
                'month',
                'timelineMonth'
            ].forEach(viewName => {
                test(`Appointment with equal startDate and endDate should render in whole cell on ${viewName} view (T858496)`, function(assert) {
                    const scheduler = createInstance({
                        dataSource: [{
                            text: 'Zero-minute appointment',
                            startDate: new Date(2017, 4, 22, 0),
                            endDate: new Date(2017, 4, 22, 0)
                        }, {
                            text: 'Default appointment',
                            startDate: new Date(2017, 4, 22, 0),
                            endDate: new Date(2017, 4, 22, 1)
                        }],
                        views: [viewName],
                        currentView: viewName,
                        currentDate: new Date(2017, 4, 25),
                        height: 600,
                        width: 3000
                    }, this.clock);

                    assert.strictEqual(scheduler.appointments.getAppointmentCount(), 2, 'Appointments are rendered');
                    assert.equal(scheduler.appointments.getAppointmentWidth(0), scheduler.appointments.getAppointmentWidth(1), 'Appointment widths are equal');
                });
            });

            test('Multi-day appointment is hidden in compact collectors according to head and tail coordinates (T835541)', function(assert) {
                const scheduler = createInstance({
                    dataSource: [{
                        text: 'Appointment 1',
                        startDate: new Date(2017, 4, 22, 10, 45),
                        endDate: new Date(2017, 4, 23, 10, 30)
                    }, {
                        text: 'Appointment 2',
                        startDate: new Date(2017, 4, 22, 15, 15),
                        endDate: new Date(2017, 4, 23, 13, 0)
                    }],
                    views: ['week'],
                    currentView: 'week',
                    currentDate: new Date(2017, 4, 21),
                    startDayHour: 9,
                    height: 800,
                    width: 500,
                    crossScrollingEnabled: true,
                    maxAppointmentsPerCell: 1,
                }, this.clock);

                assert.strictEqual(scheduler.appointments.compact.getButtonCount(), 2, 'Appointments are rendered');

                const tailCoords = translator.locate(scheduler.appointments.compact.getButton(1));

                assert.strictEqual(tailCoords.top, 0, 'Appointment top is correct');
                assert.roughEqual(tailCoords.left, 196, 2, 'Appointment left is correct');
            });

            test('targetedAppointmentData should have valid targeted resource on onAppointmentClick event', function(assert) {
                const data = [{
                    text: 'Website Re-Design Plan',
                    priorityId: [1, 2],
                    startDate: new Date(2021, 4, 21, 1),
                    endDate: new Date(2021, 4, 21, 1, 30)
                }];

                const priorityData = [{
                    text: 'Low Priority',
                    id: 1
                }, {
                    text: 'High Priority',
                    id: 2
                }];

                let currentResourceId = 1;

                const scheduler = createWrapper({
                    dataSource: data,
                    views: ['day'],
                    onAppointmentClick: e => {
                        const assertText = `priorityId should be equal ${currentResourceId} of targetedAppointmentData`;
                        assert.equal(e.targetedAppointmentData.priorityId, currentResourceId, assertText);
                        assert.equal(e.appointmentData, data[0], 'e.appointmentData should be equal item of dataSource');

                        currentResourceId++;
                    },
                    currentView: 'day',
                    currentDate: new Date(2021, 4, 21),
                    groups: ['priorityId'],
                    resources: [{
                        fieldExpr: 'priorityId',
                        dataSource: priorityData,
                        label: 'Priority'
                    }]
                }, this.clock);

                scheduler.appointments.click(0);
                scheduler.appointments.click(1);

                assert.expect(4);
            });
        });
    });

    test('Scheduler should render correct amount of appointments when startDateExpr is provided', function(assert) {
        const scheduler = createWrapper({
            currentView: 'week',
            currentDate: new Date(2015, 2, 2, 0),
            firstDayOfWeek: 1,
            startDateExpr: 'Start',
            dataSource: [{
                Start: new Date(2015, 2, 2, 0)
            }],
            width: 1000,
            height: 1000,
        });

        const appointments = scheduler.appointmentList;
        assert.equal(appointments.length, 1, 'Correct number of appointments');
    });

    test('Appointments should be rendered correctly when groupByDate is true in Day view', function(assert) {
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
        const scheduler = createWrapper({
            currentView: 'day',
            views: [{
                type: 'day',
                name: 'day',
                intervalCount: 2
            }],
            currentDate: new Date(2018, 4, 21, 9, 0),
            groupByDate: true,
            startDayHour: 9,
            groups: ['priorityId'],
            resources: [
                {
                    fieldExpr: 'priorityId',
                    allowMultiple: false,
                    dataSource: priorityData,
                    label: 'Priority'
                }
            ],
            dataSource: [{
                startDate: new Date(2018, 4, 21, 9, 0),
                priorityId: 2,
            }, {
                startDate: new Date(2018, 4, 22, 9, 0),
                priorityId: 1,
            }],
        }, this.clock);

        const appointments = scheduler.appointmentList;

        assert.equal(appointments.length, 2, 'Correct number of appointments');

        assert.equal(appointments[0].position.top, 0, 'Correct top coordinate');
        assert.roughEqual(appointments[0].position.left, 224, 2, 'Correct left coordinate');

        assert.equal(appointments[1].position.top, 0, 'Correct top coordinate');
        assert.roughEqual(appointments[1].position.left, 448, 2, 'Correct left coordinate');
    });

    test('Appointments should be rendered correctly when groupByDate is true in Week view', function(assert) {
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
        const scheduler = createWrapper({
            currentView: 'week',
            views: ['week'],
            currentDate: new Date(2018, 4, 21, 9, 0),
            groupByDate: true,
            startDayHour: 9,
            groups: ['priorityId'],
            resources: [
                {
                    fieldExpr: 'priorityId',
                    allowMultiple: false,
                    dataSource: priorityData,
                    label: 'Priority'
                }
            ],
            dataSource: [{
                startDate: new Date(2018, 4, 22, 10, 0),
                priorityId: 2
            }, {
                startDate: new Date(2018, 4, 25, 11, 0),
                priorityId: 1
            }],
        });

        const appointments = scheduler.appointmentList;

        assert.equal(appointments.length, 2, 'Correct number of appointments');

        assert.equal(appointments[0].position.top, 100, 'Correct top coordinate');
        assert.roughEqual(appointments[0].position.left, 320, 2, 'Correct left coordinate');

        assert.equal(appointments[1].position.top, 200, 'Correct top coordinate');
        assert.roughEqual(appointments[1].position.left, 640, 2, 'Correct left coordinate');
    });
});
