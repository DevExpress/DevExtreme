import $ from 'jquery';
import { noop } from 'core/utils/common';
import errors from 'ui/widget/ui.errors';
import translator from 'animation/translator';
import dateLocalization from 'localization/date';
import dblclickEvent from 'events/dblclick';
import fx from 'animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import Color from 'color';
import tooltip from 'ui/tooltip/ui.tooltip';
import config from 'core/config';
import dragEvents from 'events/drag';
import { DataSource } from 'data/data_source/data_source';
import CustomStore from 'data/custom_store';
import dataUtils from 'core/element_data';
import dateSerialization from 'core/utils/date_serialization';
import browser from 'core/utils/browser';
import { Deferred } from 'core/utils/deferred';
import { APPOINTMENT_FORM_GROUP_NAMES } from 'ui/scheduler/ui.scheduler.appointment_form';
import {
    SchedulerTestWrapper,
    initTestMarkup,
    createWrapper,
    CLASSES,
    checkResultByDeviceType
} from '../../helpers/scheduler/helpers.js';

import 'ui/scheduler/ui.scheduler';
import 'ui/switch';
import 'common.css!';
import 'generic_light.css!';

QUnit.testStart(() => initTestMarkup());

const DATE_TABLE_CELL_CLASS = 'dx-scheduler-date-table-cell';
const APPOINTMENT_CLASS = 'dx-scheduler-appointment';

const APPOINTMENT_DEFAULT_LEFT_OFFSET = 26;
const APPOINTMENT_DEFAULT_TOP_OFFSET = 26;

QUnit.module('T712431', () => {
    // TODO: there is a test for T712431 bug, when replace table layout on div layout, the test will also be useless
    const APPOINTMENT_WIDTH = 941;

    QUnit.test(`Appointment width should be not less ${APPOINTMENT_WIDTH}px with width control 1100px`, function(assert) {
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
        assert.roughEqual(appointment.outerWidth(), APPOINTMENT_WIDTH, 1);
    });
});

QUnit.module('Integration: Appointments', {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = function(options) {
            this.instance = $('#scheduler').dxScheduler($.extend(options,
                {
                    height: options && options.height || 600
                })
            ).dxScheduler('instance');

            this.clock.tick(300);
            this.instance.focus();

            this.scheduler = new SchedulerTestWrapper(this.instance);
        };
        this.getAppointmentColor = function($task, checkedProperty) {
            checkedProperty = checkedProperty || 'backgroundColor';
            return new Color($task.css(checkedProperty)).toHex();
        };
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
}, function() {
    QUnit.test('DataSource option should be passed to the appointments collection after wrap by layout manager', function(assert) {
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

        this.createInstance({
            views: ['day', 'week'],
            currentView: 'day',
            dataSource: data,
            currentDate: new Date(2015, 1, 9)
        });

        const dataSourceItems = this.instance.option('dataSource').items();
        const appointmentsItems = this.instance.getAppointmentsInstance().option('items');

        $.each(dataSourceItems, function(index, item) {
            assert.equal(appointmentsItems[index].itemData, item, 'Item is correct');
        });
    });

    QUnit.test('DataSource option should be passed to the appointments collection after wrap by layout manager if virtual scrolling mode', function(assert) {
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

        this.createInstance({
            views: ['day', 'week'],
            currentView: 'day',
            dataSource: data,
            currentDate: new Date(2015, 1, 9),
            scrolling: {
                mode: 'virtual'
            }
        });

        const dataSourceItems = this.instance.option('dataSource').items();
        let appointmentsItems = this.instance.getAppointmentsInstance().option('items');

        assert.equal(appointmentsItems.length, 1, 'Items length is correct');
        assert.equal(appointmentsItems[0].itemData, dataSourceItems[0], 'Item is correct');

        const workspace = this.instance.getWorkSpace();
        workspace.virtualScrollingDispatcher.getRenderTimeout = () => -1;
        workspace.getScrollable().scrollTo({ y: 1000 });

        this.clock.restore();

        checkResultByDeviceType(assert, () => {
            appointmentsItems = this.instance.getAppointmentsInstance().option('items');

            assert.equal(appointmentsItems.length, 2, 'Items length is correct');
            assert.equal(appointmentsItems[0].itemData, dataSourceItems[1], 'Item is correct');
        });
    });

    QUnit.test('Short tasks should have a right height (T725948)', function(assert) {
        this.createInstance({
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
        });

        this.clock.tick();

        const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);

        assert.roughEqual($appointment.height(), 3, 0.5, 'Task has a right height');
    });

    [
        'standard',
        'virtual'
    ].forEach(scrollingMode => {
        QUnit.module(`${scrollingMode} scrolling mode`, {
            beforeEach: function() {
                const createInstance = this.createInstance.bind(this);
                this.createInstance = options => {
                    options = options || {};
                    $.extend(
                        true,
                        options,
                        {
                            scrolling: { mode: scrollingMode }
                        }
                    );

                    createInstance(options);

                    if(scrollingMode === 'virtual') {
                        const virtualScrollingDispatcher = this.instance.getWorkSpace().virtualScrollingDispatcher;
                        if(virtualScrollingDispatcher) {
                            virtualScrollingDispatcher.getRenderTimeout = () => -1;
                        }
                    }
                };

                this.scrollTo = args => this.instance.getWorkSpace().getScrollable().scrollTo(args);
            }
        }, function() {
            QUnit.test('Removed appointments should render, if appointment appeared after filtering(T903973)', function(assert) {
                const dataSource = new DataSource({
                    store: [{
                        text: 'A',
                        ownerId: 1,
                        startDate: new Date(2017, 4, 22, 9, 30),
                        endDate: new Date(2017, 4, 22, 11, 30)
                    }, {
                        text: 'B',
                        ownerId: 2,
                        startDate: new Date(2017, 4, 22, 9, 30),
                        endDate: new Date(2017, 4, 22, 11, 30)
                    }, {
                        text: 'C',
                        ownerId: 3,
                        startDate: new Date(2017, 4, 22, 9, 30),
                        endDate: new Date(2017, 4, 22, 11, 30)
                    }]
                });

                const owners = [{
                    text: 'O1',
                    id: 1
                }, {
                    text: 'O2',
                    id: 2
                }, {
                    text: 'O3',
                    id: 3
                }];

                const scheduler = createWrapper({
                    dataSource: dataSource,
                    views: ['month'],
                    currentView: 'month',
                    currentDate: new Date(2017, 4, 22),
                    groups: ['ownerId'],
                    resources: [{
                        fieldExpr: 'ownerId',
                        dataSource: owners
                    }],
                    scrolling: {
                        mode: scrollingMode
                    },
                    height: 600
                });

                const isIncludes = (array, value) => array.indexOf(value) !== -1;

                assert.equal(scheduler.appointments.getAppointmentCount(), 3, 'At the initial stage all appointments should be rendered');

                dataSource.filter(item => isIncludes([1], item.ownerId));
                dataSource.load();
                assert.equal(scheduler.appointments.getAppointmentCount(), 1, 'After filtering should be rendered appointment "A"');

                dataSource.filter(item => isIncludes([1, 2], item.ownerId));
                dataSource.load();
                assert.equal(scheduler.appointments.getAppointmentCount(), 2, 'After filtering should be rendered appointments "A", "B"');

                dataSource.filter(item => isIncludes([1, 2, 3], item.ownerId));
                dataSource.load();
                assert.equal(scheduler.appointments.getAppointmentCount(), 3, 'After filtering should be rendered appointments "A", "B", "C"');
            });

            QUnit.test('appointmentTemplate option should be passed to Task module', function(assert) {
                const data = new DataSource({
                    store: [
                        {
                            text: 'Task 1',
                            startDate: new Date(2015, 1, 9, 1, 0),
                            endDate: new Date(2015, 1, 9, 2, 0)
                        }
                    ]
                });
                this.createInstance({
                    views: ['day', 'week'],
                    currentView: 'day',
                    currentDate: new Date(2015, 1, 9),
                    appointmentTemplate: 'template',
                    dataSource: data
                });

                assert.deepEqual(this.instance.$element().find('.' + APPOINTMENT_CLASS).eq(0).text(), 'Task Template', 'Tasks itemTemplate option is correct');
            });

            QUnit.test('Scheduler tasks should have a right parent', function(assert) {
                this.createInstance();

                assert.equal(this.instance.$element().find('.dx-scheduler-work-space .dx-scrollable-content>.dx-scheduler-scrollable-appointments').length, 1, 'scrollable is parent of dxSchedulerAppointments');
            });

            QUnit.test('Draggable rendering option \'immediate\' should be turned off', function(assert) {
                const tasks = [
                    { text: 'Task', startDate: new Date(2015, 2, 17), endDate: new Date(2015, 2, 17, 0, 30) }
                ];
                const dataSource = new DataSource({
                    store: tasks
                });
                this.createInstance({
                    currentView: 'week',
                    currentDate: new Date(2015, 2, 16),
                    dataSource: dataSource,
                    editing: true
                });

                const $workspace = $(this.instance.$element()).find('.dx-scrollable-content');
                const immediate = $workspace.dxDraggable('instance').option('immediate');

                assert.notOk(immediate, 'immediate option is false');
            });

            QUnit.test('Tasks should be filtered by date before render', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok(true, 'Option: currentDate');
                    return;
                }

                const tasks = [
                    { text: 'One', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 1) },
                    { text: 'Two', startDate: new Date(2015, 2, 17), endDate: new Date(2015, 2, 17, 1) }
                ];
                const dataSource = new DataSource({
                    store: tasks
                });
                this.createInstance({
                    currentDate: new Date(2015, 2, 16),
                    dataSource: dataSource,
                    currentView: 'day',
                    remoteFiltering: true
                });

                assert.deepEqual(dataSource.items(), [tasks[0]], 'Items are OK');

                this.instance.option('currentDate', new Date(2015, 2, 17));
                assert.deepEqual(dataSource.items(), [tasks[1]], 'Items are OK');

                this.instance.option('currentView', 'week');
                assert.deepEqual(dataSource.items(), tasks, 'Items are OK');
            });

            QUnit.test('Tasks should be filtered by start day hour before render', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok(true, 'Option: startDayHour');
                    return;
                }

                const tasks = [
                    { text: 'One', startDate: new Date(2015, 2, 16, 5), endDate: new Date(2015, 2, 16, 5, 30) },
                    { text: 'Two', startDate: new Date(2015, 2, 16, 2), endDate: new Date(2015, 2, 16, 2, 30) },
                    { text: 'Three', startDate: new Date(2015, 2, 17, 2), endDate: new Date(2015, 2, 17, 2, 30) },
                    { text: 'Five', startDate: new Date(2015, 2, 10, 6), endDate: new Date(2015, 2, 10, 6, 30) }
                ];
                const dataSource = new DataSource({
                    store: tasks
                });
                this.createInstance({
                    currentDate: new Date(2015, 2, 16),
                    dataSource: dataSource,
                    startDayHour: 4,
                    currentView: 'week'
                });

                let $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.equal($appointments.length, 1, 'There is only one appointment');
                assert.deepEqual(dataUtils.data($appointments[0], 'dxItemData'), tasks[0], 'Appointment data is OK');

                this.instance.option('startDayHour', 1);
                $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.equal($appointments.length, 3, 'There are three appointments');
                assert.deepEqual(dataUtils.data($appointments.get(0), 'dxItemData'), tasks[0], 'Appointment data is OK');
                assert.deepEqual(dataUtils.data($appointments.get(1), 'dxItemData'), tasks[1], 'Appointment data is OK');
                assert.deepEqual(dataUtils.data($appointments.get(2), 'dxItemData'), tasks[2], 'Appointment data is OK');
            });

            QUnit.test('Tasks should be filtered by end day hour before render', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok(true, 'Option: endDayHour');
                    return;
                }

                const tasks = [
                    { text: 'One', startDate: new Date(2015, 2, 16, 7), endDate: new Date(2015, 2, 16, 7, 30) },
                    { text: 'Two', startDate: new Date(2015, 2, 16, 11), endDate: new Date(2015, 2, 16, 11, 30) },
                    { text: 'Three', startDate: new Date(2015, 2, 16, 12), endDate: new Date(2015, 2, 16, 12, 30) },
                    { text: 'Five', startDate: new Date(2015, 2, 10, 15), endDate: new Date(2015, 2, 10, 15, 30) }
                ];
                const dataSource = new DataSource({
                    store: tasks
                });
                this.createInstance({
                    currentDate: new Date(2015, 2, 16),
                    dataSource: dataSource,
                    endDayHour: 10,
                    currentView: 'week'
                });

                let $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.equal($appointments.length, 1, 'There is only one appointment');
                assert.deepEqual(dataUtils.data($appointments[0], 'dxItemData'), tasks[0], 'Appointment data is OK');

                this.instance.option('endDayHour', 14);
                $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.equal($appointments.length, 3, 'There are three appointments');
                assert.deepEqual(dataUtils.data($appointments.get(0), 'dxItemData'), tasks[0], 'Appointment data is OK');
                assert.deepEqual(dataUtils.data($appointments.get(1), 'dxItemData'), tasks[1], 'Appointment data is OK');
                assert.deepEqual(dataUtils.data($appointments.get(2), 'dxItemData'), tasks[2], 'Appointment data is OK');
            });

            QUnit.test('tasks should be filtered by resources before render', function(assert) {
                const tasks = [
                    { text: 'a', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: [1, 2] }, // false
                    { text: 'b', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2], managerId: 4 }, // true
                    { text: 'b', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 3, roomId: [1, 2] }, // false
                    { text: 'c', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2, 3] } // true
                ];
                const dataSource = new DataSource({
                    store: tasks
                });
                this.createInstance({
                    currentDate: new Date(2015, 2, 16),
                    dataSource: dataSource,
                    groups: ['ownerId', 'roomId'],
                    resources: [
                        {
                            field: 'ownerId',
                            allowMultiple: true,
                            dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                        },
                        {
                            field: 'roomId',
                            allowMultiple: true,
                            dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                        },
                        {
                            field: 'managerId',
                            allowMultiple: true,
                            dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                        }
                    ]
                });

                const $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.equal($appointments.length, 4, 'There are four appointment');
                assert.deepEqual(dataUtils.data($appointments.get(0), 'dxItemData'), tasks[1], 'The first appointment data is OK');
                assert.deepEqual(dataUtils.data($appointments.get(1), 'dxItemData'), tasks[1], 'The second appointment dat is OK');
                assert.deepEqual(dataUtils.data($appointments.get(2), 'dxItemData'), tasks[3], 'The first appointment data is OK');
                assert.deepEqual(dataUtils.data($appointments.get(3), 'dxItemData'), tasks[3], 'The second appointment dat is OK');
            });

            QUnit.test('Tasks should be filtered by resources if dataSource is changed', function(assert) {
                const tasks = [
                    { text: 'a', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: [1, 2] }, // false
                    { text: 'b', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2], managerId: 4 }, // true
                    { text: 'b', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 3, roomId: [1, 2] }, // false
                    { text: 'c', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2, 3] } // true
                ];
                const dataSource = new DataSource({
                    store: tasks
                });
                this.createInstance({
                    currentDate: new Date(2015, 2, 16),
                    groups: ['ownerId', 'roomId'],
                    resources: [
                        {
                            field: 'ownerId',
                            allowMultiple: true,
                            dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                        },
                        {
                            field: 'roomId',
                            allowMultiple: true,
                            dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                        },
                        {
                            field: 'managerId',
                            allowMultiple: true,
                            dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                        }
                    ]
                });

                this.instance.option('dataSource', dataSource);

                const $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.equal($appointments.length, 4, 'There are four appointment');
                assert.deepEqual(dataUtils.data($appointments.get(0), 'dxItemData'), tasks[1], 'The first appointment data is OK');
                assert.deepEqual(dataUtils.data($appointments.get(1), 'dxItemData'), tasks[1], 'The second appointment dat is OK');
                assert.deepEqual(dataUtils.data($appointments.get(2), 'dxItemData'), tasks[3], 'The first appointment data is OK');
                assert.deepEqual(dataUtils.data($appointments.get(3), 'dxItemData'), tasks[3], 'The second appointment dat is OK');
            });

            QUnit.test('Tasks should be filtered by resources if resources are changed', function(assert) {
                const tasks = [
                    { text: 'a', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: [1, 2] }, // false
                    { text: 'b', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2], managerId: 4 }, // true
                    { text: 'b', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 3, roomId: [1, 2] }, // false
                    { text: 'c', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2, 3] } // true
                ];
                const dataSource = new DataSource({
                    store: tasks
                });
                this.createInstance({
                    currentDate: new Date(2015, 2, 16),
                    dataSource: dataSource,
                    groups: ['ownerId', 'roomId']
                });

                this.instance.option('resources', [
                    {
                        field: 'ownerId',
                        allowMultiple: true,
                        dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                    },
                    {
                        field: 'roomId',
                        allowMultiple: true,
                        dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                    },
                    {
                        field: 'managerId',
                        allowMultiple: true,
                        dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                    }
                ]);

                const $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.equal($appointments.length, 4, 'There are four appointment');
                assert.deepEqual(dataUtils.data($appointments.get(0), 'dxItemData'), tasks[1], 'The first appointment data is OK');
                assert.deepEqual(dataUtils.data($appointments.get(1), 'dxItemData'), tasks[1], 'The second appointment dat is OK');
                assert.deepEqual(dataUtils.data($appointments.get(2), 'dxItemData'), tasks[3], 'The first appointment data is OK');
                assert.deepEqual(dataUtils.data($appointments.get(3), 'dxItemData'), tasks[3], 'The second appointment dat is OK');
            });

            QUnit.test('Tasks should be filtered by resources if groups are changed', function(assert) {
                const tasks = [
                    { text: 'a', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: [1, 2] }, // false
                    { text: 'b', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2], managerId: 1 }, // true
                    { text: 'c', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 3, roomId: [1, 2] }, // false
                    { text: 'd', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2, 3] } // false
                ];
                const dataSource = new DataSource({
                    store: tasks
                });
                this.createInstance({
                    currentDate: new Date(2015, 2, 16),
                    dataSource: dataSource,
                    groups: ['ownerId', 'roomId'],
                    resources: [
                        {
                            field: 'ownerId',
                            allowMultiple: true,
                            dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                        },
                        {
                            field: 'roomId',
                            allowMultiple: true,
                            dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                        },
                        {
                            field: 'managerId',
                            allowMultiple: true,
                            dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                        }
                    ]
                });
                this.instance.option('groups', ['ownerId', 'roomId', 'managerId']);
                const $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.equal($appointments.length, 2, 'There are two appointment');
                assert.deepEqual(dataUtils.data($appointments.get(0), 'dxItemData'), tasks[1], 'The first appointment data is OK');
                assert.deepEqual(dataUtils.data($appointments.get(1), 'dxItemData'), tasks[1], 'The second appointment data is OK');
            });

            QUnit.test('Scheduler tasks should have a right height', function(assert) {
                this.createInstance({ dataSource: this.tasks, currentDate: new Date(2015, 1, 9) });
                this.clock.tick();
                const cellHeight = this.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0).get(0).getBoundingClientRect().height;
                const resultHeight = cellHeight * 2;

                assert.equal(this.instance.$element().find('.' + APPOINTMENT_CLASS).eq(0).outerHeight(), resultHeight, 'Task has a right height');
            });

            QUnit.test('Scheduler tasks should have a right dimensions for month view', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual scrolling not support month view');
                    return;
                }

                this.createInstance({
                    dataSource: [
                        { text: 'Task 1', startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 10) }
                    ],
                    currentDate: new Date(2015, 1, 9),
                    views: ['month'],
                    currentView: 'month',
                    height: 800
                });
                this.clock.tick();

                const cellHeight = this.scheduler.workSpace.getCellHeight();
                const cellWidth = this.scheduler.workSpace.getCellWidth();

                assert.roughEqual(this.scheduler.appointments.getAppointmentHeight(0), (cellHeight - 30) / 4, 2, 'Task has a right height');
                assert.roughEqual(this.scheduler.appointments.getAppointmentWidth(0), cellWidth, 1.001, 'Task has a right width');
            });

            QUnit.test('Scheduler tasks should have a right height when currentView is changed', function(assert) {
                this.createInstance({
                    dataSource: [
                        { text: 'Task 1', startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 10) }
                    ],
                    currentDate: new Date(2015, 1, 9),
                    views: ['day', 'week', 'month'],
                    height: 800
                });
                this.clock.tick();

                this.instance.option('currentView', 'month');

                const cellHeight = this.scheduler.workSpace.getCellHeight();
                const cellWidth = this.scheduler.workSpace.getCellWidth();

                assert.roughEqual(this.scheduler.appointments.getAppointmentHeight(0), (cellHeight - 30) / 4, 2, 'Task has a right height');
                assert.roughEqual(this.scheduler.appointments.getAppointmentWidth(0), cellWidth, 1.001, 'Task has a right width');
            });

            QUnit.test('Two not rival appointments with fractional coordinates should have correct positions(ie)', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual scrolling not support month view');
                    return;
                }

                this.createInstance({
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
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS);

                assert.equal($appointment.length, 3, 'All appointments are rendered');
                assert.equal(translator.locate($appointment.eq(0)).top, translator.locate($appointment.eq(1)).top, 'appointment is rendered in right place');
                assert.equal(translator.locate($appointment.eq(1)).top, translator.locate($appointment.eq(2)).top, 'appointment is rendered in right place');
            });

            QUnit.test('DblClick on appointment should call scheduler.showAppointmentPopup', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('This test is for standard scrolling');
                    return;
                }

                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: new DataSource({
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
                    })
                });
                this.clock.tick();

                if(scrollingMode === 'virtual') {
                    this.scrollTo({ y: 2000 });
                }

                const spy = sinon.stub(this.instance, 'showAppointmentPopup');

                try {
                    $(this.instance.$element()).find(`.${APPOINTMENT_CLASS}`).eq(1).trigger(dblclickEvent.name);

                    assert.ok(spy.calledOnce, 'Method was called');
                    assert.deepEqual(spy.getCall(0).args[0],
                        {
                            startDate: new Date(2015, 1, 9, 11, 0),
                            endDate: new Date(2015, 1, 9, 12, 0),
                            text: 'Task 2'
                        },
                        'Method has a right arguments');
                } finally {
                    this.instance.showAppointmentPopup.restore();
                }
            });

            QUnit.test('DblClick on appointment should not call scheduler.showAppointmentPopup, disabled mode', function(assert) {
                const data = new DataSource({
                    store: this.tasks
                });

                this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, disabled: true });
                this.clock.tick();

                const spy = sinon.spy(this.instance, 'showAppointmentPopup');

                $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(1).trigger(dblclickEvent.name);

                assert.ok(!spy.calledOnce, 'Method was not called');
            });

            QUnit.test('DblClick on appointment should not affect the related cell start date(T395620)', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('This test is for standard scrolling');
                    return;
                }

                const data = new DataSource({
                    store: this.tasks
                });

                this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data });

                sinon.stub(this.instance, 'showAppointmentPopup');

                try {
                    const $appt = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                    const apptData = dataUtils.data($appt[0], 'dxItemData');

                    apptData.startDate = new Date(2015, 1, 9, 2);

                    $appt.trigger(dblclickEvent.name);

                    const relatedCellData = dataUtils.data($(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).get(2), 'dxCellData').startDate;

                    assert.equal(relatedCellData.getTime(), new Date(2015, 1, 9, 1).getTime(), 'Cell start date is OK');
                } finally {
                    this.instance.showAppointmentPopup.restore();
                }
            });

            QUnit.test('Appointment dates should not be normalized before sending to the details view', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('This test is for standard scrolling');
                    return;
                }

                const startDate = 1429776000000;
                const endDate = 1429794000000;
                const task = {
                    text: 'Task 1',
                    ownerId: 1,
                    startDate: startDate,
                    endDate: endDate
                };

                this.createInstance({
                    dataSource: new DataSource({
                        store: [task]
                    }),
                    currentDate: new Date(2015, 3, 23)
                });

                this.clock.tick();

                const spy = sinon.spy(this.instance._appointmentPopup, 'show');

                this.scheduler.appointments.click();
                this.clock.tick(300);
                this.scheduler.tooltip.clickOnItem();

                try {
                    const args = spy.getCall(0).args[0];
                    assert.deepEqual(args.startDate, startDate, 'Start date is OK');
                    assert.deepEqual(args.endDate, endDate, 'End date is OK');

                    tooltip.hide();
                } finally {
                    this.instance._appointmentPopup.show.restore();
                }
            });

            QUnit.test('Appointment should be copied before sending to the details view', function(assert) {
                const task = {
                    text: 'Task 1',
                    startDate: 1429776000000,
                    endDate: 1429794000000
                };

                this.createInstance({
                    dataSource: new DataSource({
                        store: [task]
                    }),
                    currentDate: new Date(2015, 3, 23)
                });

                this.clock.tick();

                this.instance.showAppointmentPopup(task);

                const detailsForm = this.instance.getAppointmentDetailsForm();
                const formData = detailsForm.option('formData');

                assert.notEqual(formData, task, 'Appointment data is copied');
            });

            QUnit.test('Add new appointment', function(assert) {
                const data = new DataSource({
                    store: this.tasks
                });

                this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data });
                const addAppointment = this.instance.addAppointment;
                const spy = sinon.spy(() => new Deferred());
                const newItem = { startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: 'caption' };
                this.instance.addAppointment = spy;
                try {
                    this.instance.showAppointmentPopup(newItem, true);

                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                    assert.ok(spy.calledOnce, 'Add method is called');
                    assert.deepEqual(spy.getCall(0).args[0], newItem, 'New item is correct');
                } finally {
                    this.instance.addAppointment = addAppointment;
                }
            });

            QUnit.test('Appointments should be rendered correctly when resourses store is asynchronous', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('This test is for standard scrolling');
                    return;
                }

                const appointments = [
                    { startDate: new Date(2015, 2, 4), text: 'a', endDate: new Date(2015, 2, 4, 0, 30), roomId: 1 },
                    { startDate: new Date(2015, 2, 4), text: 'b', endDate: new Date(2015, 2, 4, 0, 30), roomId: 2 }
                ];
                this.createInstance({
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
                });

                this.clock.tick(300);
                assert.deepEqual(this.instance.$element().find('.' + APPOINTMENT_CLASS).length, 2, 'Appointments are rendered');
            });

            QUnit.test('Add new appointment with delay(T381444)', function(assert) {
                const done = assert.async();
                const data = [];

                this.clock.restore();

                const dataSource = new DataSource({
                    load: function() {
                        return data;
                    },
                    insert: function(appt) {
                        const d = $.Deferred();

                        setTimeout(function() {
                            assert.ok(popup.option('visible'), 'Popup is visible');

                            data.push(appt);
                            d.resolve(appt);

                            assert.notOk(popup.option('visible'), 'Popup isn\'t visible');
                            done();

                        }, 50);

                        return d.promise();
                    }
                });

                this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: dataSource });

                this.instance.showAppointmentPopup({
                    startDate: new Date(2015, 1, 1, 1),
                    endDate: new Date(2015, 1, 1, 2),
                    text: 'caption'
                }, true);

                $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                const popup = this.instance.getAppointmentPopup();
            });

            QUnit.test('Add new appointment with delay and an error(T381444)', function(assert) {
                const done = assert.async();
                const data = [];

                this.clock.restore();

                const dataSource = new DataSource({
                    load: function() {
                        return data;
                    },
                    insert: function(appt) {
                        const d = $.Deferred();

                        setTimeout(function() {
                            assert.ok(popup.option('visible'), 'Popup is visible');
                            d.reject();
                            assert.ok(popup.option('visible'), 'Popup is still visible');
                            done();
                        }, 100);

                        return d.promise();
                    }
                });

                this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: dataSource });

                this.instance.showAppointmentPopup({
                    startDate: new Date(2015, 1, 1, 1),
                    endDate: new Date(2015, 1, 1, 2),
                    text: 'caption'
                }, true);

                $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                const popup = this.instance.getAppointmentPopup();
            });

            QUnit.test('Scheduler should not update scroll position if appointment is visible ', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: new DataSource({
                        store: []
                    }),
                    currentView: 'week',
                    height: 500,
                    width: 1000,
                });

                const appointment = { startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), text: 'caption' };
                const workSpace = this.instance.getWorkSpace();
                const scrollTo = sinon.spy(workSpace, 'scrollTo');

                try {
                    this.instance.showAppointmentPopup(appointment);
                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                    assert.notOk(scrollTo.calledOnce, 'scrollTo was not called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            });

            QUnit.test('Scheduler should update scroll position if appointment was added to invisible bottom area', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: new DataSource({
                        store: []
                    }),
                    currentView: 'week',
                    height: 300
                });

                const appointment = { startDate: new Date(2015, 1, 9, 21), endDate: new Date(2015, 1, 9, 22), text: 'caption 2' };
                const workSpace = this.instance.getWorkSpace();
                const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                try {
                    this.instance.showAppointmentPopup(appointment);
                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                    assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            });

            QUnit.test('Scheduler should update scroll position if appointment is not visible, timeline view ', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: new DataSource({
                        store: []
                    }),
                    currentView: 'timelineDay',
                    height: 500
                });

                const appointment = { startDate: new Date(2015, 1, 9, 7), endDate: new Date(2015, 1, 9, 1, 8), text: 'caption' };
                const workSpace = this.instance.$element().find('.dx-scheduler-work-space').dxSchedulerTimelineDay('instance');
                const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                try {
                    this.instance.showAppointmentPopup(appointment);
                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                    assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            });

            QUnit.test('Scheduler should update scroll position if appointment is not visible, timeline week view ', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: new DataSource({
                        store: []
                    }),
                    currentView: 'timelineWeek',
                    height: 500,
                    width: 500
                });

                const appointment = { startDate: new Date(2015, 1, 12, 7), endDate: new Date(2015, 1, 12, 1, 8), text: 'caption' };
                const workSpace = this.instance.getWorkSpace();
                const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                try {
                    this.instance.showAppointmentPopup(appointment);
                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                    assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            });

            QUnit.test('Scheduler should update scroll position if appointment was added to invisible top area', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: new DataSource({
                        store: []
                    }),
                    currentView: 'week',
                    height: 300
                });

                this.instance.getWorkSpaceScrollable().scrollBy(220);

                const appointment = { startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 0, 30), text: 'caption' };
                const workSpace = this.instance.getWorkSpace();
                const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                try {
                    this.instance.showAppointmentPopup(appointment);
                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                    assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            });

            QUnit.test('Scheduler should update scroll position if appointment was added to invisible top area: minutes case', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: new DataSource({
                        store: []
                    }),
                    currentView: 'week',
                    height: 500
                });

                this.instance.getWorkSpaceScrollable().scrollBy(220);

                const appointment = { startDate: new Date(2015, 1, 9, 2), endDate: new Date(2015, 1, 9, 2, 30), text: 'caption' };
                const workSpace = this.instance.getWorkSpace();
                const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                try {
                    this.instance.showAppointmentPopup(appointment);
                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                    assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            });

            QUnit.test('Scheduler should update scroll position if appointment was added to invisible bottom area: minutes case', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: new DataSource({
                        store: []
                    }),
                    currentView: 'week',
                    height: 500,
                    showAllDayPanel: false
                });

                this.instance.getWorkSpaceScrollable().scrollBy(140);

                const appointment = { startDate: new Date(2015, 1, 9, 5, 45), endDate: new Date(2015, 1, 9, 6, 30), text: 'caption' };
                const workSpace = this.instance.getWorkSpace();
                const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

                try {
                    this.instance.showAppointmentPopup(appointment);
                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                    assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
                } finally {
                    workSpace.scrollTo.restore();
                }
            });

            // TODO: update editors in popup
            QUnit.test('Update appointment', function(assert) {
                const data = new DataSource({
                    store: this.tasks
                });

                this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data });

                this.clock.tick();

                const updateAppointment = this.instance.updateAppointment;
                const spy = sinon.spy(() => new Deferred());
                const updatedItem = this.tasks[0];
                this.instance.updateAppointment = spy;
                try {
                    this.instance.showAppointmentPopup(updatedItem);

                    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                    tooltip.hide();

                    assert.ok(spy.calledOnce, 'Update method is called');
                    assert.deepEqual(spy.getCall(0).args[0], updatedItem, 'Target item is correct');
                    assert.deepEqual(spy.getCall(0).args[1], updatedItem, 'New data is correct');
                } finally {
                    this.instance.updateAppointment = updateAppointment;
                }
            });

            QUnit.test('updateAppointment method should be called when task was resized', function(assert) {
                const data = new DataSource({
                    store: this.tasks
                });

                this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, editing: true });

                this.clock.tick();

                const updateAppointment = this.instance._updateAppointment;
                const spy = sinon.spy(noop);
                const oldItem = this.tasks[0];

                this.instance._updateAppointment = spy;

                const cellHeight = this.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0).outerHeight();
                const hourHeight = cellHeight * 2;

                try {
                    const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-bottom').eq(0)).start();
                    pointer.dragStart().drag(0, hourHeight).dragEnd();

                    assert.ok(spy.calledOnce, 'Update method is called');
                    assert.deepEqual(spy.getCall(0).args[0], oldItem, 'Target item is correct');
                    assert.deepEqual(spy.getCall(0).args[1], $.extend(true, oldItem, { endDate: new Date(2015, 1, 9, 3, 0) }), 'New data is correct');
                } finally {
                    this.instance._updateAppointment = updateAppointment;
                }
            });

            QUnit.test('updateAppointment method should be called with right args when task was resized, timelineMonth view', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual Scrolling - Limitation');
                    return;
                }

                const data = [{
                    text: 'Task 1',
                    startDate: new Date(2015, 1, 2, 1),
                    endDate: new Date(2015, 1, 2, 2)
                }];

                this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, editing: true, views: ['timelineMonth'], currentView: 'timelineMonth' });

                this.clock.tick();

                const updateAppointment = this.instance._updateAppointment;
                const spy = sinon.spy(noop);
                const oldItem = data[0];

                this.instance._updateAppointment = spy;

                const cellWidth = this.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0).outerWidth();

                try {
                    const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-right').eq(0)).start();
                    pointer.dragStart().drag(cellWidth, 0).dragEnd();

                    assert.ok(spy.calledOnce, 'Update method is called');
                    assert.deepEqual(spy.getCall(0).args[0], oldItem, 'Target item is correct');
                    assert.deepEqual(spy.getCall(0).args[1], $.extend(true, oldItem, { endDate: new Date(2015, 1, 3, 2, 0) }), 'New data is correct');
                } finally {
                    this.instance._updateAppointment = updateAppointment;
                }
            });

            QUnit.test('Non-grid-aligned appointments should be resized correctly', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    editing: true,
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 1, 9, 1),
                        endDate: new Date(2015, 1, 9, 1, 20)
                    }]
                });

                const cellHeight = this.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0).outerHeight();

                const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-bottom').eq(0)).start();
                pointer.dragStart().drag(0, cellHeight).dragEnd();

                assert.deepEqual(this.instance.option('dataSource')[0].endDate, new Date(2015, 1, 9, 2), 'End date is OK');
            });

            QUnit.test('Non-grid-aligned appointments should be resized correctly, when startDayHour is set', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    editing: true,
                    startDayHour: 9,
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 1, 9, 10, 25),
                        endDate: new Date(2015, 1, 9, 11)
                    }]
                });

                const cellHeight = this.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0).outerHeight();

                const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-top').eq(0)).start();
                pointer.dragStart().drag(0, -3 * cellHeight).dragEnd();

                assert.deepEqual(this.instance.option('dataSource')[0].startDate, new Date(2015, 1, 9, 9), 'Start date is OK');
            });

            QUnit.test('Non-grid-aligned appointments should be resized correctly, when endDayHour is set', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    editing: true,
                    endDayHour: 15,
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 1, 9, 13),
                        endDate: new Date(2015, 1, 9, 14, 25)
                    }]
                });

                if(scrollingMode === 'virtual') {
                    this.scrollTo({ y: 1000 });
                }

                this.clock.restore();

                checkResultByDeviceType(assert, () => {
                    const cellHeight = this.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0).outerHeight();

                    const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-bottom').eq(0)).start();
                    pointer.dragStart().drag(0, cellHeight).dragEnd();

                    assert.deepEqual(this.instance.option('dataSource')[0].endDate, new Date(2015, 1, 9, 15), 'End date is OK');
                });
            });

            // TODO: also need test when task is dragging outside the area. updated dates should be equal to old dates
            QUnit.test('Task dragging', function(assert) {
                const data = new DataSource({
                    store: this.tasks
                });

                this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, editing: true });

                this.clock.tick();

                const updatedItem = {
                    text: 'Task 1',
                    startDate: new Date(2015, 1, 9, 2, 30),
                    endDate: new Date(2015, 1, 9, 3, 30),
                    allDay: false
                };

                const pointer = pointerMock($(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0)).start().down().move(10, 10);
                $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(5).trigger(dragEvents.enter);
                pointer.up();

                const dataSourceItem = this.instance.option('dataSource').items()[0];

                this.clock.tick();
                assert.equal(dataSourceItem.text, updatedItem.text, 'New data is correct');
                assert.equal(dataSourceItem.allDay, updatedItem.allDay, 'New data is correct');
                assert.deepEqual(dataSourceItem.startDate, updatedItem.startDate, 'New data is correct');
                assert.deepEqual(dataSourceItem.endDate, updatedItem.endDate, 'New data is correct');
            });

            [false, true].forEach(function(forceIsoDateParsing) {
                QUnit.test('Drag task that contains timestamps when forceIsoDateParsing is ' + forceIsoDateParsing, function(assert) {
                    const defaultForceIsoDateParsing = config().forceIsoDateParsing;

                    try {
                        config().forceIsoDateParsing = forceIsoDateParsing;

                        const data = new DataSource({
                            store: [
                                {
                                    text: 'Task 1',
                                    startDate: new Date(2015, 1, 9).getTime(),
                                    endDate: new Date(2015, 1, 9, 1).getTime()
                                }
                            ]
                        });

                        this.createInstance({
                            currentDate: new Date(2015, 1, 9),
                            dataSource: data,
                            editing: true,
                            allDayExpr: 'AllDay'
                        });

                        this.clock.tick();

                        const updatedItem = {
                            text: 'Task 1',
                            startDate: forceIsoDateParsing ? new Date(2015, 1, 9, 2, 30).getTime() : new Date(2015, 1, 9, 2, 30),
                            endDate: forceIsoDateParsing ? new Date(2015, 1, 9, 3, 30).getTime() : new Date(2015, 1, 9, 3, 30),
                            AllDay: false
                        };

                        const pointer = pointerMock($(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0)).start().down().move(10, 10);
                        $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(5).trigger(dragEvents.enter);
                        pointer.up();

                        this.clock.tick();

                        const dataSourceItem = this.instance.option('dataSource').items()[0];

                        assert.equal(dataSourceItem.text, updatedItem.text, 'New data is correct');
                        assert.equal(dataSourceItem.AllDay, updatedItem.AllDay, 'New data is correct');
                        assert.deepEqual(dataSourceItem.startDate, updatedItem.startDate, 'New data is correct');
                        assert.deepEqual(dataSourceItem.endDate, updatedItem.endDate, 'New data is correct');
                    } finally {
                        config().forceIsoDateParsing = defaultForceIsoDateParsing;
                    }
                });
            });

            QUnit.test('Appointment should be dragged correctly in grouped timeline (T739132)', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual Scrolling - Timeline');
                    return;
                }

                const data = new DataSource({
                    store: [{
                        'text': 'Google AdWords Strategy',
                        'ownerId': [2],
                        'startDate': new Date(2017, 4, 2, 9, 0),
                        'endDate': new Date(2017, 4, 2, 10, 30),
                        'priority': 1
                    }]
                });

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

                this.createInstance({
                    dataSource: data,
                    views: ['timelineMonth'],
                    currentView: 'timelineMonth',
                    currentDate: new Date(2017, 4, 1),
                    startDayHour: 8,
                    endDayHour: 20,
                    cellDuration: 60,
                    editing: true,
                    groups: ['priority'],
                    resources: [{
                        fieldExpr: 'priority',
                        allowMultiple: false,
                        dataSource: priorityData,
                        label: 'Priority'
                    }]
                });

                this.clock.tick();

                const updatedItem = {
                    'text': 'Google AdWords Strategy',
                    'ownerId': [2],
                    'startDate': new Date(2017, 4, 1, 8, 0),
                    'endDate': new Date(2017, 4, 1, 9, 30),
                    'priority': 1
                };

                const pointer = pointerMock(this.scheduler.appointments.getAppointment(0)).start().down().move(-200, 5);
                this.scheduler.workSpace.getCell(0).trigger(dragEvents.enter);
                pointer.up();

                const dataSourceItem = this.instance.option('dataSource').items()[0];

                this.clock.tick();
                assert.deepEqual(dataSourceItem.startDate, updatedItem.startDate, 'New data is correct');
                assert.deepEqual(dataSourceItem.endDate, updatedItem.endDate, 'New data is correct');
            });

            QUnit.test('Appointment should have correct position while dragging from group', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 6, 10),
                    editing: true,
                    views: ['week'],
                    currentView: 'week',
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 6, 10, 0),
                        endDate: new Date(2015, 6, 10, 0, 30),
                        ownerId: { id: 1 }
                    }],
                    groups: ['ownerId.id'],
                    resources: [
                        {
                            field: 'ownerId.id',
                            allowMultiple: false,
                            dataSource: [
                                { id: 1, text: 'one' },
                                { id: 2, text: 'two' }
                            ]
                        }
                    ],
                    width: 800
                });
                const $appointment = $(this.instance.$element().find('.' + APPOINTMENT_CLASS)).eq(0);

                const pointer = pointerMock($appointment).start().down().move(10, 10);
                $(this.instance.$element().find('.' + DATE_TABLE_CELL_CLASS)).eq(7).trigger(dragEvents.enter);
                pointer.up();

                this.clock.tick();
                const appointmentData = dataUtils.data(this.instance.$element().find('.' + APPOINTMENT_CLASS).get(0), 'dxItemData');

                assert.deepEqual(appointmentData.startDate, new Date(2015, 6, 5, 0), 'Start date is correct');
                assert.deepEqual(appointmentData.endDate, new Date(2015, 6, 5, 0, 30), 'End date is correct');
                assert.deepEqual(appointmentData.ownerId, { id: [2] }, 'Resources is correct');
            });

            QUnit.test('Appointment should have correct position while dragging from group, vertical grouping', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual Scrolling - ViewData Generator');
                    return;
                }

                this.createInstance({
                    currentDate: new Date(2015, 6, 10),
                    editing: true,
                    views: [{
                        type: 'week',
                        name: 'Week',
                        groupOrientation: 'vertical'
                    }],
                    currentView: 'week',
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 6, 7, 10),
                        endDate: new Date(2015, 6, 7, 10, 30),
                        ownerId: { id: 2 },
                        roomId: { id: 1 }
                    }],
                    startDayHour: 9,
                    endDayHour: 12,
                    groups: ['ownerId.id', 'roomId.id'],
                    resources: [
                        {
                            field: 'ownerId.id',
                            allowMultiple: false,
                            dataSource: [
                                { id: 1, text: 'one' },
                                { id: 2, text: 'two' }
                            ]
                        },
                        {
                            field: 'roomId.id',
                            allowMultiple: false,
                            dataSource: [
                                { id: 1, text: 'room one' },
                                { id: 2, text: 'room two' }
                            ]
                        }
                    ],
                    width: 800
                });
                const $appointment = $(this.instance.$element().find('.' + APPOINTMENT_CLASS)).eq(0);

                const startPosition = $appointment.offset();

                const pointer = pointerMock($appointment).start().down().move(10, 10);

                const $draggedAppointment = $(this.instance.$element().find('.' + APPOINTMENT_CLASS)).parent().eq(0);

                assert.roughEqual(translator.locate($draggedAppointment).top, startPosition.top + 10, 1.5, 'Start position is correct');
                assert.roughEqual(translator.locate($draggedAppointment).left, startPosition.left + 10, 1.5, 'Start position is correct');

                $(this.instance.$element().find('.' + DATE_TABLE_CELL_CLASS)).eq(7).trigger(dragEvents.enter);
                pointer.up();

                this.clock.tick();
                const appointmentData = dataUtils.data(this.instance.$element().find('.' + APPOINTMENT_CLASS).get(0), 'dxItemData');

                assert.deepEqual(appointmentData.startDate, new Date(2015, 6, 5, 9, 30), 'Start date is correct');
                assert.deepEqual(appointmentData.endDate, new Date(2015, 6, 5, 10, 0), 'End date is correct');
                assert.deepEqual(appointmentData.ownerId, { id: [1] }, 'Resources is correct');
            });

            QUnit.test('Appointment should have correct position while dragging into allDay panel, vertical grouping', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual Scrolling - ViewData Generator');
                    return;
                }

                this.createInstance({
                    currentDate: new Date(2015, 6, 10),
                    editing: true,
                    views: [{
                        type: 'week',
                        name: 'Week',
                        groupOrientation: 'vertical'
                    }],
                    currentView: 'week',
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 6, 7, 10),
                        endDate: new Date(2015, 6, 7, 10, 30),
                        ownerId: { id: 2 }
                    }],
                    startDayHour: 9,
                    endDayHour: 12,
                    groups: ['ownerId.id'],
                    resources: [
                        {
                            field: 'ownerId.id',
                            allowMultiple: false,
                            dataSource: [
                                { id: 1, text: 'one' },
                                { id: 2, text: 'two' }
                            ]
                        }
                    ],
                    width: 800
                });

                const $appointment = $(this.instance.$element().find('.' + APPOINTMENT_CLASS)).eq(0);
                const startPosition = $appointment.offset();

                const pointer = pointerMock($appointment).start().down().move(10, 10);

                const $draggedAppointment = $(this.instance.$element().find('.' + APPOINTMENT_CLASS)).parent().eq(0);

                assert.roughEqual(translator.locate($draggedAppointment).top, startPosition.top + 10, 2.1, 'Start position is correct');
                assert.roughEqual(translator.locate($draggedAppointment).left, startPosition.left + 10, 1.5, 'Start position is correct');

                $(this.instance.$element().find('.dx-scheduler-all-day-table-cell')).eq(11).trigger(dragEvents.enter);
                pointer.up();

                this.clock.tick();
                const appointmentData = dataUtils.data(this.instance.$element().find('.' + APPOINTMENT_CLASS).get(0), 'dxItemData');

                assert.deepEqual(appointmentData.startDate, new Date(2015, 6, 9, 0), 'Start date is correct');
                assert.deepEqual(appointmentData.endDate, new Date(2015, 6, 9, 0, 30), 'End date is correct');
                assert.deepEqual(appointmentData.ownerId, { id: [2] }, 'Resources is correct');
            });

            QUnit.test('Appointment should be rendered correctly after changing view (T593699)', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual Scrolling - Option currentView');
                    return;
                }

                this.createInstance({
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
                });

                this.instance.option('currentView', 'week');
                assert.notOk(this.instance.$element().find('.dx-scheduler-appointment').eq(0).data('dxItemData').settings, 'Item hasn\'t excess settings');
            });

            QUnit.test('Appointment should have correct coordinates after drag if onAppointmentUpdating is canceled (T813826)', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 4, 25),
                    editing: true,
                    views: ['workWeek'],
                    currentView: 'workWeek',
                    dataSource: [{
                        text: 'Test appointment',
                        priorityId: 1,
                        startDate: new Date(2015, 4, 25, 14, 30),
                        endDate: new Date(2015, 4, 25, 15, 30),
                        recurrenceRule: 'FREQ=YEARLY'
                    }],
                    groups: ['priorityId'],
                    resources: [
                        {
                            fieldExpr: 'priorityId',
                            allowMultiple: false,
                            dataSource: [
                                { text: 'Low Priority', id: 1 },
                                { text: 'High Priority', id: 2 }
                            ],
                            label: 'Priority'
                        }
                    ],
                    onAppointmentUpdating: function(e) {
                        e.cancel = true;
                    },
                    width: 800
                });
                const $appointment = this.scheduler.appointments.getAppointment(0);
                const oldAppointmentCoords = translator.locate($appointment);
                $appointment.trigger(dragEvents.start);
                this.scheduler.workSpace.getCell(7).trigger(dragEvents.enter);
                $appointment.trigger(dragEvents.end);

                this.scheduler.appointmentForm.clickFormDialogButton(1);

                const newAppointmentCoords = translator.locate(this.scheduler.appointments.getAppointment(0));

                assert.deepEqual(oldAppointmentCoords, newAppointmentCoords, 'Appointment has correct coords');

                this.clock.tick();
            });

            QUnit.test('Appointment should push correct data to the onAppointmentUpdating event on changing group by drag\'n\'drop ', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual Scrolling - ViewData Generator');
                    return;
                }

                this.createInstance({
                    currentDate: new Date(2015, 4, 25),
                    editing: true,
                    views: ['workWeek'],
                    currentView: 'workWeek',
                    dataSource: [{
                        text: 'Test appointment',
                        priorityId: 1,
                        startDate: new Date(2015, 4, 25, 14, 30),
                        endDate: new Date(2015, 4, 25, 15, 30)
                    }],
                    groups: ['priorityId'],
                    resources: [
                        {
                            fieldExpr: 'priorityId',
                            allowMultiple: false,
                            dataSource: [
                                { text: 'Low Priority', id: 1 },
                                { text: 'High Priority', id: 2 }
                            ],
                            label: 'Priority'
                        }
                    ],
                    onAppointmentUpdating: function(e) {},
                    width: 800
                });

                const stub = sinon.stub(this.instance.option(), 'onAppointmentUpdating');
                const $appointment = this.scheduler.appointments.getAppointment(0);

                const pointer = pointerMock($appointment).start().down().move(10, 10);
                this.scheduler.workSpace.getCell(7).trigger(dragEvents.enter);
                pointer.up();

                const result = stub.getCall(0).args[0];

                assert.equal(result.oldData.priorityId, 1, 'Appointment was located in the first group');
                assert.equal(result.newData.priorityId, 2, 'Appointment located in the second group now');

                this.clock.tick();
            });

            QUnit.test('Appointment should not be updated if it is dropped to the initial cell (week view)', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    currentView: 'week',
                    firstDayOfWeek: 0,
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 1, 9, 0, 7),
                        endDate: new Date(2015, 1, 9, 0, 37)
                    }]
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(1).trigger(dragEvents.enter);
                $appointment.trigger(dragEvents.start);
                $appointment.trigger(dragEvents.end);

                this.clock.tick();
                const appointmentData = dataUtils.data(this.instance.$element().find('.' + APPOINTMENT_CLASS).get(0), 'dxItemData');

                assert.deepEqual(appointmentData.startDate, new Date(2015, 1, 9, 0, 7), 'Start date is correct');
                assert.deepEqual(appointmentData.endDate, new Date(2015, 1, 9, 0, 37), 'End date is correct');
            });

            QUnit.test('Appointment should not be updated if it is dropped to the initial cell (month view)', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual Scrolling - Month view');
                    return;
                }

                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    views: ['month'],
                    currentView: 'month',
                    firstDayOfWeek: 0,
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 1, 9, 8, 7),
                        endDate: new Date(2015, 1, 9, 8, 37)
                    }]
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                $appointment.trigger(dragEvents.start);
                $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(8).trigger(dragEvents.enter);
                $appointment.trigger(dragEvents.end);

                this.clock.tick();

                const appointmentData = dataUtils.data(this.instance.$element().find('.' + APPOINTMENT_CLASS).get(0), 'dxItemData');

                assert.deepEqual(appointmentData.startDate, new Date(2015, 1, 9, 8, 7), 'Start date is correct');
                assert.deepEqual(appointmentData.endDate, new Date(2015, 1, 9, 8, 37), 'End date is correct');
            });

            QUnit.test('Appointment should be updated correctly if it is dropped to the neighbor cell (month view)', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual Scrolling - Month view');
                    return;
                }

                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    views: ['month'],
                    editing: true,
                    currentView: 'month',
                    firstDayOfWeek: 0,
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 1, 9, 8, 0),
                        endDate: new Date(2015, 1, 9, 9, 0),
                    }]
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(9).trigger(dragEvents.enter);
                pointerMock($appointment).start().down().move(10, 10).up();

                this.clock.tick();
                const appointmentData = dataUtils.data(this.instance.$element().find('.' + APPOINTMENT_CLASS).get(0), 'dxItemData');

                assert.deepEqual(appointmentData.startDate, new Date(2015, 1, 10, 8, 0), 'Start date is correct');
                assert.deepEqual(appointmentData.endDate, new Date(2015, 1, 10, 9, 0), 'End date is correct');
            });

            QUnit.test('Dropping appointment to the neighbor cell (month view) with predefined start & end day hours', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual Scrolling - Month view');
                    return;
                }

                this.createInstance({
                    views: ['month'],
                    currentView: 'month',
                    editing: true,
                    currentDate: new Date(2015, 4, 25),
                    firstDayOfWeek: 0,
                    endDayHour: 19,
                    startDayHour: 8,
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 4, 13, 8),
                        endDate: new Date(2015, 4, 13, 9, 30)
                    }]
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(16).trigger(dragEvents.enter);
                pointerMock($appointment).start().down().move(10, 10).up();

                this.clock.tick();
                const appointmentData = dataUtils.data(this.instance.$element().find('.' + APPOINTMENT_CLASS).get(0), 'dxItemData');

                assert.deepEqual(appointmentData.startDate, new Date(2015, 4, 12, 8), 'Start date is correct');
                assert.deepEqual(appointmentData.endDate, new Date(2015, 4, 12, 9, 30), 'End date is correct');
            });

            QUnit.test('Dropping appointment should keep predefined hours (month view)', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual Scrolling - Month view');
                    return;
                }

                this.createInstance({
                    views: ['month'],
                    currentView: 'month',
                    editing: true,
                    currentDate: new Date(2015, 4, 25),
                    firstDayOfWeek: 0,
                    endDayHour: 19,
                    startDayHour: 8,
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 4, 13, 10),
                        endDate: new Date(2015, 4, 13, 17)
                    }]
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(16).trigger(dragEvents.enter);
                pointerMock($appointment).start().down().move(10, 10).up();

                this.clock.tick();
                const appointmentData = dataUtils.data(this.instance.$element().find('.' + APPOINTMENT_CLASS).get(0), 'dxItemData');

                assert.deepEqual(appointmentData.startDate, new Date(2015, 4, 12, 10), 'Start date is correct');
                assert.deepEqual(appointmentData.endDate, new Date(2015, 4, 12, 17), 'End date is correct');
            });

            QUnit.test('Appointment should be returned back if an error occurs during drag (T453486)', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual Scrolling - Month view');
                    return;
                }

                this.createInstance({
                    views: ['month'],
                    currentView: 'month',
                    editing: true,
                    currentDate: new Date(2015, 4, 25),
                    firstDayOfWeek: 0,
                    endDayHour: 19,
                    startDayHour: 8,
                    dataSource: {
                        load: function() {
                            return [{
                                text: 'a',
                                startDate: new Date(2015, 4, 13, 8),
                                endDate: new Date(2015, 4, 13, 9, 30)
                            }];
                        },
                        update: function() {
                            throw new Error('An error occured');
                        }
                    }
                });

                let $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const initialPosition = $appointment.position();

                assert.throws(function() {
                    $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(16).trigger(dragEvents.enter);
                    pointerMock($appointment).start().down().move(10, 10).up();
                }, function(err) {
                    $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                    const updatedPosition = $appointment.position();

                    assert.roughEqual(updatedPosition.top, initialPosition.top, 0.5, 'Top is OK');
                    assert.roughEqual(updatedPosition.left, initialPosition.left, 0.5, 'Left is OK');
                    assert.equal(err.message, 'An error occured', 'Error message is OK');
                    assert.notOk($appointment.hasClass('dx-draggable-dragging'), 'appointment hasn\'t \'dx-draggable-dragging\' class');

                    return true;
                }.bind(this));
            });

            QUnit.test('Appointment should be returned back if the \'update\' method rejects deferred during drag (T453486)', function(assert) {
                this.createInstance({
                    views: ['month'],
                    currentView: 'month',
                    editing: true,
                    currentDate: new Date(2015, 4, 25),
                    firstDayOfWeek: 0,
                    endDayHour: 19,
                    startDayHour: 8,
                    dataSource: {
                        load: function() {
                            return [{
                                text: 'a',
                                startDate: new Date(2015, 4, 13, 8),
                                endDate: new Date(2015, 4, 13, 9, 30)
                            }];
                        },
                        update: function() {
                            return $.Deferred().reject('An error occured');
                        }
                    }
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const initialPosition = $appointment.position();

                $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(16).trigger(dragEvents.enter);
                pointerMock($appointment).start().down().move(10, 10).up();

                const updatedPosition = this.instance.$element().find('.' + APPOINTMENT_CLASS).eq(0).position();

                assert.equal(updatedPosition.top, initialPosition.top, 'Top is OK');
                assert.equal(updatedPosition.left, initialPosition.left, 'Left is OK');
            });

            QUnit.test('Task should be placed in right group', function(assert) {
                const data = new DataSource({
                    store: [{ text: 'Item 1', ownerId: 2, startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 0, 30) }]
                });

                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    groups: ['ownerId'],
                    resources: [{
                        field: 'ownerId',
                        dataSource: [{ id: 1, text: 'John' }, { id: 2, text: 'Mike' }]
                    }],
                    width: 700
                });

                const workSpace = this.instance.getWorkSpace();
                const spy = sinon.spy(workSpace, 'getCoordinatesByDateInGroup');

                this.instance.option('dataSource', data);

                const itemShift = ($('.dx-scheduler-date-table').outerWidth() - $('.dx-scheduler-time-panel').outerWidth()) * 0.5 + $('.dx-scheduler-time-panel').outerWidth();

                try {
                    const value = spy.returnValues[0];
                    assert.roughEqual(value[0].top, 0, 1.001, 'Top is OK');
                    assert.roughEqual(value[0].left, itemShift, 1.001, 'Left is OK');
                } finally {
                    workSpace.getCoordinatesByDateInGroup.restore();
                }
            });

            QUnit.test('Tasks should have a right color', function(assert) {
                this.createInstance({
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
                    ]
                });

                const tasks = this.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.equal(this.getAppointmentColor(tasks.eq(0)), '#cb2824', 'Color is OK');
                assert.equal(this.getAppointmentColor(tasks.eq(1)), '#cb7d7b', 'Color is OK');
                assert.equal(this.getAppointmentColor(tasks.eq(2)), '#cb2824', 'Color is OK');
                assert.equal(this.getAppointmentColor(tasks.eq(3)), '#cb7d7b', 'Color is OK');
                assert.equal(this.getAppointmentColor(tasks.eq(4)), '#cb7d7b', 'Color is OK');
            });

            QUnit.test('Ungrouped tasks should have a right color(via the \'useColorAsDefault\' field)', function(assert) {
                try {
                    const data = new DataSource({
                        store: [
                            { text: 'Item 1', ownerId: 2, startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 0, 30) },
                            { text: 'Item 2', startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 0, 30) }
                        ]
                    });

                    this.createInstance({
                        currentDate: new Date(2015, 1, 9),
                        resources: [{
                            field: 'ownerId',
                            useColorAsDefault: true,
                            dataSource: [{ id: 1, text: 'John', color: '#ff0000' }, { id: 2, text: 'Mike', color: '#0000ff' }]
                        }],
                        dataSource: data,
                        width: 700
                    });

                    const tasks = this.instance.$element().find('.' + APPOINTMENT_CLASS);
                    assert.equal(this.getAppointmentColor(tasks.eq(0)), '#0000ff', 'Color is OK');
                    assert.equal($.inArray(this.getAppointmentColor(tasks.eq(1)), ['#ff0000', '#0000ff']), -1, 'Color is OK');
                } finally {
                    $('.dynamic-styles').remove();
                }
            });

            QUnit.test('Grouped recurrence tasks should have a right color', function(assert) {
                this.createInstance({
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
                    ]
                });

                const task = this.instance.$element().find('.' + APPOINTMENT_CLASS);
                assert.equal(this.getAppointmentColor(task.eq(0)), '#ff0000', 'Color is OK');
                assert.equal(this.getAppointmentColor(task.eq(2)), '#0000ff', 'Color is OK');
            });

            QUnit.test('Task with resources should contain a right data attr', function(assert) {
                const data = new DataSource({
                    store: [
                        { text: 'Item 1', ownerId: 2, roomId: 1, startDate: new Date(2015, 1, 8), endDate: new Date(2015, 1, 8, 0, 30) },
                        { text: 'Item 2', ownerId: [1, 2], startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 0, 30) },
                        { text: 'Item 3', startDate: new Date(2015, 1, 9) }
                    ]
                });

                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    currentView: 'week',
                    resources: [{
                        field: 'ownerId',
                        dataSource: [{ id: 1, text: 'a', color: 'red' }, { id: 2, text: 'b', color: 'green' }],
                    }, {
                        field: 'roomId',
                        dataSource: [{ id: 1, text: 'c', color: 'blue' }, { id: 2, text: 'd', color: 'white' }]
                    }],
                    dataSource: data,
                    width: 700
                });

                const tasks = this.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.ok(tasks.eq(0).attr('data-ownerid-2'));
                assert.ok(tasks.eq(0).attr('data-roomid-1'));

                assert.ok(tasks.eq(1).attr('data-ownerid-1'));
                assert.ok(tasks.eq(1).attr('data-ownerid-2'));

                assert.ok(!tasks.eq(2).attr('data-ownerid-1'));
                assert.ok(!tasks.eq(2).attr('data-ownerid-2'));
                assert.ok(!tasks.eq(2).attr('data-roomid-1'));
                assert.ok(!tasks.eq(2).attr('data-roomid-2'));
            });

            QUnit.test('Task with resources should contain a right data attr if field contains a space', function(assert) {
                const data = new DataSource({
                    store: [
                        { text: 'Item 1', 'owner  Id': 2, startDate: new Date(2015, 1, 8), endDate: new Date(2015, 1, 8, 0, 30) },
                    ]
                });

                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    currentView: 'week',
                    resources: [{
                        field: 'owner  Id',
                        dataSource: [{ id: 1, text: 'a', color: 'red' }, { id: 2, text: 'b', color: 'green' }],
                    }],
                    dataSource: data,
                    width: 700
                });

                const tasks = this.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.ok(tasks.eq(0).attr('data-owner__32____32__id-2'));
            });

            QUnit.test('Appointment width should depend on cell width', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 2, 18),
                    maxAppointmentsPerCell: 'auto'
                });

                const workSpace = this.instance.getWorkSpace();
                const defaultGetCellWidthMethod = workSpace.getCellWidth;
                const CELL_WIDTH = 777;

                workSpace.getCellWidth = function() {
                    return CELL_WIDTH;
                };
                try {
                    this.instance.option('dataSource', [
                        { id: 1, text: 'Item 1', startDate: new Date(2015, 2, 18), endDate: new Date(2015, 2, 18, 0, 30) }
                    ]);

                    assert.equal(this.scheduler.appointments.getAppointmentWidth(), CELL_WIDTH - APPOINTMENT_DEFAULT_LEFT_OFFSET, 'Appointment width is OK');

                } finally {
                    workSpace.getCellWidth = defaultGetCellWidthMethod;
                }
            });

            QUnit.test('Appointments should be filtered correctly by end day hour when current date was changed', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 4, 6),
                    currentView: 'week',
                    endDayHour: 10,
                    firstDayOfWeek: 1,
                    dataSource: [
                        {
                            startDate: new Date(2015, 4, 7, 11)
                        }
                    ]
                });

                let $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);
                assert.equal($appointments.length, 0, 'There are not appointments');

                this.instance.option('currentDate', new Date(2015, 4, 7));

                $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);
                assert.equal($appointments.length, 0, 'There is one appointment');
            });

            QUnit.test('Multi-day appointments should be filtered correctly if it\'s time less than startDayHour', function(assert) {
                this.createInstance({
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
                });

                const $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);
                assert.equal($appointments.length, 1, 'Appointment was rendered');
            });

            QUnit.test('Appointments should be cleared when currentDate option is changed', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual Scrolling - Option currentDate');
                    return;
                }

                this.createInstance({
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
                });
                this.clock.tick(300);
                assert.strictEqual(this.instance.$element().find('.' + APPOINTMENT_CLASS).length, 2);

                this.instance.option('currentDate', new Date(2015, 4, 6));
                this.clock.tick(300);

                assert.strictEqual(this.instance.$element().find('.' + APPOINTMENT_CLASS).length, 0);

                this.instance.option('currentDate', new Date(2015, 3, 16));
                this.clock.tick(300);

                assert.equal(this.instance.$element().find('.' + APPOINTMENT_CLASS).length, 2);
            });

            QUnit.test('Appointments should be cleared when startDayHour option is changed', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual Scrolling - Option startDayHour');
                    return;
                }

                this.createInstance({
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
                });
                this.clock.tick(300);
                assert.strictEqual(this.instance.$element().find('.' + APPOINTMENT_CLASS).length, 2);

                this.instance.option('startDayHour', 2);
                this.clock.tick(300);

                assert.strictEqual(this.instance.$element().find('.' + APPOINTMENT_CLASS).length, 1);

                this.instance.option('startDayHour', 0);
                this.clock.tick(300);

                assert.equal(this.instance.$element().find('.' + APPOINTMENT_CLASS).length, 2);
            });

            QUnit.test('Appointments should be cleared when endDayHour option is changed', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual Scrolling - Option startDayHour');
                    return;
                }

                this.createInstance({
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
                });
                this.clock.tick(300);
                assert.strictEqual(this.instance.$element().find('.' + APPOINTMENT_CLASS).length, 2);

                this.instance.option('endDayHour', 2);
                this.clock.tick(300);

                assert.strictEqual(this.instance.$element().find('.' + APPOINTMENT_CLASS).length, 1);

                this.instance.option('endDayHour', 10);
                this.clock.tick(300);

                assert.equal(this.instance.$element().find('.' + APPOINTMENT_CLASS).length, 2);
            });

            QUnit.test('Month appointment inside grouped view should have a right resizable area', function(assert) {
                this.createInstance({
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
                    ]
                });

                const $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);
                const area1 = $appointments.eq(0).dxResizable('instance').option('area');
                const area2 = $appointments.eq(1).dxResizable('instance').option('area');
                const $cells = this.instance.$element().find('.' + DATE_TABLE_CELL_CLASS);
                const halfOfCellWidth = 0.5 * $cells.eq(0).outerWidth();

                assert.roughEqual(area1.left, $cells.eq(0).offset().left - halfOfCellWidth, 1.001);
                assert.roughEqual(area1.right, $cells.eq(7).offset().left + halfOfCellWidth, 1.001);

                assert.roughEqual(area2.left, $cells.eq(7).offset().left - halfOfCellWidth, 1.001);
                assert.roughEqual(area2.right, $cells.eq(13).offset().left + halfOfCellWidth * 3, 1.001);
            });

            QUnit.test('Rival appointments should have correct positions on month view, rtl mode', function(assert) {
                this.createInstance({
                    rtlEnabled: true,
                    currentDate: new Date(2015, 2, 4),
                    views: ['month'],
                    currentView: 'month',
                    firstDayOfWeek: 1,
                    dataSource: [
                        { startDate: new Date(2015, 2, 4), endDate: new Date(2015, 2, 7), text: 'long' },
                        { startDate: new Date(2015, 2, 5), endDate: new Date(2015, 2, 5, 1), text: 'short' }]
                });

                const $longAppointment = this.instance.$element().find('.' + APPOINTMENT_CLASS).eq(0);
                const $shortAppointment = this.instance.$element().find('.' + APPOINTMENT_CLASS).eq(1);

                assert.notEqual($longAppointment.position().top, $shortAppointment.position().top, 'Appointments positions are correct');
            });

            QUnit.test('Recurrence appointment should be rendered correctly when currentDate was changed: month view', function(assert) {
                const appointment = {
                    startDate: new Date(2015, 1, 14, 0),
                    endDate: new Date(2015, 1, 14, 0, 30),
                    text: 'appointment',
                    recurrenceRule: 'FREQ=MONTHLY'
                };

                this.createInstance({
                    currentDate: new Date(2015, 1, 14),
                    dataSource: [appointment],
                    views: ['month'],
                    currentView: 'month'
                });

                this.instance.option('currentDate', new Date(2015, 2, 14));

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS);

                assert.equal($appointment.length, 1, 'Appointment is rendered');
            });

            QUnit.test('Recurrence long appointment should be rendered correctly when currentDate was changed: month view', function(assert) {
                const appointment = {
                    text: 'Website Re-Design Plan',
                    priorityId: 2,
                    startDate: new Date(2015, 4, 25, 9, 0),
                    endDate: new Date(2015, 4, 26, 11, 30),
                    recurrenceRule: 'FREQ=DAILY;INTERVAL=5'
                };

                this.createInstance({
                    currentDate: new Date(2015, 4, 25),
                    dataSource: [appointment],
                    views: ['month'],
                    currentView: 'month'
                });

                this.instance.option('currentDate', new Date(2015, 5, 25));

                const $appointment = this.instance.$element().find(`.${APPOINTMENT_CLASS}`);

                assert.equal($appointment.length, 10, 'Appointments were rendered');
            });

            QUnit.test('Appointment should be rendered correctly with expressions on init', function(assert) {
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

                this.createInstance({
                    currentDate: new Date(2015, 1, 4),
                    views: ['day'],
                    currentView: 'day',
                    firstDayOfWeek: 1,
                    dataSource: appointments,
                    startDateExpr: 'Start',
                    endDateExpr: 'End',
                    textExpr: 'Text',
                    recurrenceRuleExpr: 'RecRule'
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const $recAppointment = this.instance.$element().find('.' + APPOINTMENT_CLASS).eq(1);
                const resultDate = `${dateLocalization.format(startDate, 'shorttime')} - ${dateLocalization.format(endDate, 'shorttime')}`;

                assert.equal($appointment.find('.dx-scheduler-appointment-content div').eq(0).text(), 'abc', 'Text is correct on init');
                assert.equal($appointment.find('.dx-scheduler-appointment-content-date').eq(0).text(), resultDate, 'Date is correct on init');
                assert.notOk($appointment.find('.dx-scheduler-appointment-recurrence-icon').length, 'Repeat icon isn\'t rendered');
                assert.equal($recAppointment.find('.dx-scheduler-appointment-recurrence-icon').length, 1, 'Repeat icon is rendered');
            });

            QUnit.test('Appointment should be rendered correctly with recurrenceRule expression', function(assert) {
                const startDate = new Date(2015, 1, 4, 0);
                const endDate = new Date(2015, 1, 4, 1);
                const appointments = [{
                    startDate: startDate.getTime(),
                    endDate: endDate.getTime(),
                    text: 'def',
                    RecRule: 'FREQ=DAILY'
                }
                ];

                this.createInstance({
                    currentDate: new Date(2015, 1, 4),
                    views: ['day'],
                    currentView: 'day',
                    firstDayOfWeek: 1,
                    dataSource: appointments,
                    recurrenceRuleExpr: 'RecRule'
                });

                const $recAppointment = this.instance.$element().find('.' + APPOINTMENT_CLASS).eq(0);
                const resultDate = `${dateLocalization.format(startDate, 'shorttime')} - ${dateLocalization.format(endDate, 'shorttime')}`;

                assert.equal($recAppointment.find('.dx-scheduler-appointment-content div').eq(0).text(), 'def', 'Text is correct on init');

                assert.equal($recAppointment.find('.dx-scheduler-appointment-content-date').eq(0).text(), resultDate, 'Date is correct on init');
                assert.equal($recAppointment.find('.dx-scheduler-appointment-recurrence-icon').length, 1, 'Recurrence icon is rendered');
            });

            QUnit.test('Appointment should be rendered correctly with expressions on optionChanged', function(assert) {
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

                this.createInstance({
                    currentDate: new Date(2015, 1, 4),
                    views: ['day'],
                    currentView: 'day',
                    firstDayOfWeek: 1,
                    dataSource: [appointment],
                    startDateExpr: 'Start',
                    endDateExpr: 'End',
                    textExpr: 'Text',
                });

                this.instance.option({
                    startDateExpr: 'AppointmentStart',
                    endDateExpr: 'AppointmentEnd',
                    textExpr: 'AppointmentText'
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const resultDate = `${dateLocalization.format(startDate, 'shorttime')} - ${dateLocalization.format(endDate, 'shorttime')}`;

                assert.equal($appointment.find('.dx-scheduler-appointment-content .dx-scheduler-appointment-title').eq(0).text(), 'xyz', 'Text is correct on init');
                assert.equal($appointment.find('.dx-scheduler-appointment-content-date').eq(0).text(), resultDate, 'Date is correct on init');
            });

            QUnit.test('Appointment should be rendered correctly with expressions on custom template', function(assert) {
                const startDate = new Date(2015, 1, 4, 1);
                const endDate = new Date(2015, 1, 4, 2);
                const appointment = {
                    Start: startDate.getTime(),
                    End: endDate.getTime(),
                    Text: 'abc'
                };

                this.createInstance({
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
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);

                assert.equal($appointment.find('.custom-title').text(), 'abc', 'Text is correct on init');
            });

            QUnit.test('dxScheduler should render custom appointment template with render function that returns dom node', function(assert) {
                const startDate = new Date(2015, 1, 4, 1);
                const endDate = new Date(2015, 1, 4, 2);
                const appointment = {
                    Start: startDate.getTime(),
                    End: endDate.getTime(),
                    Text: 'abc'
                };

                this.createInstance({
                    currentDate: new Date(2015, 1, 4),
                    dataSource: [appointment],
                    startDateExpr: 'Start',
                    endDateExpr: 'End',
                    textExpr: 'Text',
                    appointmentTemplate: 'appointmentTemplate',
                    integrationOptions: {
                        templates: {
                            'appointmentTemplate': {
                                render: function(args) {
                                    const $element = $('<span>')
                                        .addClass('dx-template-wrapper')
                                        .text('text');

                                    return $element.get(0);
                                }
                            }
                        }
                    }
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);

                assert.equal($appointment.text(), 'text', 'container is correct');
            });

            QUnit.test('Appointment should have right position, if it\'s startDate time less than startDayHour option value', function(assert) {
                const appointment = {
                    startDate: new Date(2016, 2, 1, 2),
                    endDate: new Date(2016, 2, 1, 5)
                };

                this.createInstance({
                    currentDate: new Date(2016, 2, 1),
                    currentView: 'week',
                    firstDayOfWeek: 1,
                    dataSource: [appointment],
                    startDayHour: 3
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const $targetCell = this.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(1);

                assert.roughEqual($appointment.position().top, $targetCell.position().top, 1.001, 'appointment top is correct');
                assert.roughEqual($appointment.position().left, $targetCell.position().left, 1.001, 'appointment left is correct');
            });

            QUnit.test('Appointment should have right position on timeline month view', function(assert) {
                const appointment = {
                    startDate: new Date(2016, 1, 3, 8, 15),
                    endDate: new Date(2016, 1, 3, 9, 0)
                };

                this.createInstance({
                    currentDate: new Date(2016, 1, 1),
                    currentView: 'timelineMonth',
                    firstDayOfWeek: 0,
                    dataSource: [appointment],
                    maxAppointmentsPerCell: 'unlimited'
                });

                const targetCellPosition = this.scheduler.workSpace.getCellPosition(0, 2);

                assert.roughEqual(this.scheduler.appointments.getAppointmentPosition().top, targetCellPosition.top, 1.001, 'appointment top is correct');
                assert.roughEqual(this.scheduler.appointments.getAppointmentPosition().left, targetCellPosition.left, 1.001, 'appointment left is correct');
            });

            QUnit.test('Rival appointments should have right position on timeline month view', function(assert) {
                const data = [{
                    'id': '1',
                    'text': 'Recurrence event',
                    'recurrenceRule': 'FREQ=DAILY;INTERVAL=2;COUNT=2',
                    'startDate': new Date(2018, 11, 3, 9, 0),
                    'endDate': new Date(2018, 11, 1, 10, 30)
                },
                {
                    'id': '2',
                    'text': 'Some event',
                    'startDate': new Date(2018, 11, 4, 9, 0),
                    'endDate': new Date(2018, 11, 4, 10, 29),
                }];

                this.createInstance({
                    dataSource: data,
                    views: ['timelineMonth'],
                    currentView: 'timelineMonth',
                    maxAppointmentsPerCell: 'unlimited',
                    currentDate: new Date(2018, 11, 3),
                    firstDayOfWeek: 0,
                    startDayHour: 8,
                    endDayHour: 20
                });

                this.instance.$element().find('.' + APPOINTMENT_CLASS).each(function(index, appointment) {
                    assert.equal($(appointment).position().top, 0, 'Appointment top is ok');
                });
            });

            QUnit.test('Rival long appointments should have right position on timeline month view', function(assert) {
                const data = [{
                    'id': '1',
                    'text': 'Long event',
                    'startDate': new Date(2018, 11, 1, 9, 0),
                    'endDate': new Date(2018, 11, 5, 10, 30)
                },
                {
                    'id': '2',
                    'text': 'Some event',
                    'startDate': new Date(2018, 11, 4, 9, 0),
                    'endDate': new Date(2018, 11, 4, 10, 29),
                }];

                this.createInstance({
                    dataSource: data,
                    views: ['timelineMonth'],
                    currentView: 'timelineMonth',
                    maxAppointmentsPerCell: 2,
                    currentDate: new Date(2018, 11, 3),
                    firstDayOfWeek: 0,
                    startDayHour: 8,
                    endDayHour: 20
                });

                assert.equal(this.scheduler.appointments.getAppointmentPosition(0).top, APPOINTMENT_DEFAULT_TOP_OFFSET, 'Long appointment top is ok');
                assert.roughEqual(this.scheduler.appointments.getAppointmentPosition(1).top, this.scheduler.appointments.getAppointmentHeight() + APPOINTMENT_DEFAULT_TOP_OFFSET, 1, 'Second appointment top is ok');
            });

            QUnit.test('Long appointment part should not be rendered on timeline month view (T678380)', function(assert) {
                const appointment = {
                    'text': 'Ends april 1st at 7:59 am',
                    'startDate': new Date(2019, 2, 20, 9, 0),
                    'endDate': new Date(2019, 3, 1, 7, 59)
                };

                this.createInstance({
                    currentDate: new Date(2019, 3, 2),
                    currentView: 'timelineMonth',
                    views: ['timelineMonth'],
                    recurrenceRuleExpr: null,
                    startDayHour: 8,
                    firstDayOfWeek: 0,
                    endDayHour: 18,
                    cellDuration: 60,
                    dataSource: [appointment]
                });

                assert.equal(this.scheduler.appointments.getAppointmentCount(), 0, 'appointment-part was not rendered');
            });

            QUnit.test('Long appointment part should not be rendered on timeline workWeek view (T678380)', function(assert) {
                const appointment = {
                    'text': 'Ends april 1st at 7:59 am',
                    'startDate': new Date(2019, 2, 20, 9, 0),
                    'endDate': new Date(2019, 3, 1, 7, 59)
                };

                this.createInstance({
                    currentDate: new Date(2019, 3, 2),
                    currentView: 'timelineWorkWeek',
                    views: ['timelineWorkWeek'],
                    recurrenceRuleExpr: null,
                    startDayHour: 8,
                    firstDayOfWeek: 0,
                    endDayHour: 18,
                    cellDuration: 60,
                    dataSource: [appointment]
                });

                assert.equal(this.scheduler.appointments.getAppointmentCount(), 0, 'appointment-part was not rendered');
            });

            QUnit.test('Appointment should have right width on timeline week view', function(assert) {
                const appointment = {
                    startDate: new Date(2015, 2, 3, 9, 30),
                    endDate: new Date(2015, 2, 3, 10, 30)
                };

                this.createInstance({
                    currentDate: 1425416400000,
                    currentView: 'timelineWeek',
                    dataSource: [appointment],
                    startDayHour: 8,
                    endDayHour: 10
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const $cell = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0);

                assert.roughEqual($appointment.outerWidth(), $cell.outerWidth(), 1.001, 'Task has a right width');
            });

            QUnit.test('Multiday appointment should have right width on timelineWeek view when set startDayHour > appointment endDate (T533348)', function(assert) {
                const appointment = {
                    startDate: new Date(2016, 1, 1, 11, 0),
                    endDate: new Date(2016, 1, 2, 1, 0)
                };

                this.createInstance({
                    currentDate: new Date(2016, 1, 1),
                    views: ['timelineWeek'],
                    currentView: 'timelineWeek',
                    cellDuration: 60,
                    firstDayOfWeek: 1,
                    dataSource: [appointment],
                    startDayHour: 8,
                    endDayHour: 20,
                    height: 200
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const $cell = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0);
                const cellsInAppointment = 9;

                assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * cellsInAppointment, 1.001, 'Task has a right width');
            });

            QUnit.test('Recurrence appointment part should have right width on timeline week view', function(assert) {
                const appointment = {
                    startDate: new Date(2015, 4, 25, 21),
                    endDate: new Date(2015, 4, 26, 2),
                    recurrenceRule: 'FREQ=DAILY;INTERVAL=2'
                };

                this.createInstance({
                    currentDate: new Date(2015, 4, 26),
                    currentView: 'timelineWeek',
                    dataSource: [appointment],
                    startDayHour: 1,
                    endDayHour: 22
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(1);
                const $cell = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0);

                assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * 4, 1.001, 'Task has a right width');
            });

            QUnit.test('Multiday appointment should have right width on timeline week view', function(assert) {
                const appointment = {
                    startDate: new Date(2015, 2, 2, 19),
                    endDate: new Date(2015, 2, 3, 13)
                };

                this.createInstance({
                    currentDate: new Date(2015, 2, 3),
                    currentView: 'timelineWeek',
                    cellDuration: 60,
                    dataSource: [appointment],
                    startDayHour: 10,
                    endDayHour: 20
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const $cell = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0);
                const cellsInAppointment = 4;

                assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * cellsInAppointment, 1.001, 'Task has a right width');
            });

            QUnit.test('AllDay appointment should have right width on timeline week view', function(assert) {
                const appointment = {
                    startDate: new Date(2015, 11, 14),
                    endDate: new Date(2015, 11, 17),
                    allDay: true
                };

                this.createInstance({
                    currentDate: new Date(2015, 11, 14),
                    currentView: 'timelineWeek',
                    cellDuration: 60,
                    dataSource: [appointment],
                    startDayHour: 10,
                    endDayHour: 22
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const $cell = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0);
                const cellsInAppointment = 48;

                assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * cellsInAppointment, 1.001, 'Task has a right width');
            });

            QUnit.test('AllDay appointment without allDay field should have right width on timeline day view', function(assert) {
                const appointment = {
                    startDate: new Date(2015, 11, 14, 0, 0),
                    endDate: new Date(2015, 11, 14, 24, 0)
                };

                this.createInstance({
                    currentDate: new Date(2015, 11, 14),
                    currentView: 'timelineDay',
                    cellDuration: 60,
                    dataSource: [appointment],
                    startDayHour: 10,
                    endDayHour: 22
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const $cell = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0);
                const cellsInAppointment = 12;

                assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * cellsInAppointment, 1.001, 'Task has a right width');
            });

            QUnit.test('Long multiday appointment should have right width on timeline work week view', function(assert) {
                const appointment = {
                    startDate: new Date(2015, 2, 2, 9),
                    endDate: new Date(2015, 2, 4, 18)
                };

                this.createInstance({
                    currentDate: new Date(2015, 2, 3),
                    currentView: 'timelineWorkWeek',
                    cellDuration: 60,
                    dataSource: [appointment],
                    startDayHour: 10,
                    endDayHour: 20
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const $cell = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0);
                const cellsInAppointment = 28;

                assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * cellsInAppointment, 1.001, 'Task has a right width');
            });

            QUnit.test('Long multiday appointment should have right width on timeline week view when set startDayHour > appointment endDate (T533348)', function(assert) {
                const appointment = {
                    startDate: new Date(2016, 1, 1, 11, 0),
                    endDate: new Date(2016, 1, 4, 1, 0)
                };

                this.createInstance({
                    currentDate: new Date(2016, 1, 1),
                    views: ['timelineWeek'],
                    currentView: 'timelineWeek',
                    cellDuration: 60,
                    firstDayOfWeek: 1,
                    dataSource: [appointment],
                    startDayHour: 8,
                    endDayHour: 20,
                    height: 200
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const $cell = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0);
                const cellsInAppointment = 33;

                assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * cellsInAppointment, 1.001, 'Task has a right width');
            });

            QUnit.test('Long multiday appointment should have right position on timeline week view', function(assert) {
                const appointment = {
                    startDate: new Date(2015, 2, 2, 9),
                    endDate: new Date(2015, 2, 5, 18)
                };

                this.createInstance({
                    currentDate: new Date(2015, 2, 3),
                    currentView: 'timelineWeek',
                    cellDuration: 60,
                    dataSource: [appointment],
                    startDayHour: 10,
                    endDayHour: 20
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const $cell = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0);
                const cellsToAppointment = 10;

                assert.roughEqual($appointment.position().left, $cell.outerWidth() * cellsToAppointment, 1.001, 'Task has a right width');
            });

            QUnit.test('Appointment with zero-duration should be rendered correctly(T443143)', function(assert) {

                this.createInstance({
                    dataSource: [{
                        text: 'Website Re-Design Plan',
                        startDate: new Date(2016, 8, 16),
                        endDate: new Date(2016, 8, 16)
                    }],
                    currentDate: new Date(2016, 8, 16),
                    currentView: 'agenda',
                    views: ['day', 'workWeek', 'week', 'month', 'agenda'],
                    height: 600
                });

                const $element = this.instance.$element();
                const $appointments = $element.find('.' + APPOINTMENT_CLASS);

                assert.equal($appointments.length, 1, 'Appt is rendered');
                assert.equal($element.find('.dx-scheduler-agenda-nodata').length, 0, 'There is no \'No data\' message');
            });

            QUnit.test('Small appointment should have hidden content information but visible content element(T469453)', function(assert) {
                this.createInstance({
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
                });

                const $appointment = $(this.instance.$element()).find('.dx-scheduler-appointment-empty');
                const $appointmentContent = $appointment.find('.dx-scheduler-appointment-content');
                const $appointmentTitle = $appointmentContent.find('.dx-scheduler-appointment-title');
                const $appointmentDetails = $appointmentContent.find('.dx-scheduler-appointment-content-details');
                const $appointmentRecurringIcon = $appointmentContent.find('.dx-scheduler-appointment-recurrence-icon');

                assert.equal($appointmentContent.css('display'), 'block', 'Appointment content is visible');
                assert.equal($appointmentTitle.css('display'), 'none', 'Appointment title isn\'t visible');
                assert.equal($appointmentDetails.css('display'), 'none', 'Appointment title isn\'t visible');
                assert.equal($appointmentRecurringIcon.css('display'), 'none', 'Appointment recurring icon isn\'t visible');
            });

            QUnit.test('Recurrence icon position should be correct (T718691)', function(assert) {
                const data = [{
                    text: 'Book Flights to San Fran for Sales Trip',
                    startDate: new Date(2017, 4, 29, 12, 0),
                    endDate: new Date(2017, 5, 5, 13, 0),
                    allDay: true,
                    recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU;COUNT=10'
                }];
                this.createInstance({
                    dataSource: data,
                    views: ['month'],
                    currentView: 'month',
                    currentDate: new Date(2017, 4, 25),
                    startDayHour: 9,
                    height: 600
                });

                const $appointment = $(this.instance.$element()).find('.dx-scheduler-appointment');
                const $appointmentContent = $appointment.find('.dx-scheduler-appointment-content');
                const $appointmentRecurringIcon = $appointmentContent.find('.dx-scheduler-appointment-recurrence-icon');

                assert.equal($appointmentRecurringIcon.eq(0).css('right'), '20px', 'Icon position is OK');
                assert.equal($appointmentRecurringIcon.eq(1).css('right'), '5px', 'Icon position is OK');
                assert.equal($appointmentRecurringIcon.eq(2).css('right'), '20px', 'Icon position is OK');
            });

            QUnit.test('Appointment startDate should be preprocessed before position calculating', function(assert) {
                this.createInstance({
                    dataSource: [{ 'text': 'a', 'allDay': true, 'startDate': '2017-03-13T09:05:00Z', 'endDate': '2017-03-20T09:05:00Z' }],
                    currentDate: new Date(2017, 2, 13),
                    currentView: 'month',
                    views: ['month'],
                    height: 600
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS);

                assert.equal($appointment.length, 2, 'appointment is rendered');
            });

            QUnit.test('Appointment startDate and endDate should have correct format in the details view after allDay appoitment opening (T505119)', function(assert) {
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

                this.createInstance({
                    dataSource: tasks,
                    currentDate: new Date(2017, 2, 13),
                    currentView: 'week',
                    views: ['week'],
                    startDateExpr: 'start',
                    endDateExpr: 'end',
                    allDayExpr: 'AllDay'
                });
                this.instance.showAppointmentPopup(tasks[0]);
                this.instance.hideAppointmentPopup();
                this.instance.showAppointmentPopup(tasks[1]);

                const detailsForm = this.instance.getAppointmentDetailsForm();
                const startDateEditor = detailsForm.getEditor('start');
                const endDateEditor = detailsForm.getEditor('end');

                assert.equal(startDateEditor.option('type'), 'datetime', 'start date is correct');
                assert.equal(endDateEditor.option('type'), 'datetime', 'end date is correct');
            });

            QUnit.test('Scheduler appointment popup should be opened correctly for recurrence appointments after multiple opening(T710140)', function(assert) {
                const tasks = [{
                    text: 'Recurrence task',
                    start: new Date(2017, 2, 13),
                    end: new Date(2017, 2, 13, 0, 30),
                    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10'
                }];

                this.createInstance({
                    dataSource: tasks,
                    currentDate: new Date(2017, 2, 13),
                    currentView: 'month',
                    views: ['month'],
                    startDateExpr: 'start',
                    endDateExpr: 'end'
                });
                this.instance.showAppointmentPopup(tasks[0]);
                $('.dx-dialog-buttons .dx-button').eq(0).trigger('dxclick');
                const form = this.instance.getAppointmentDetailsForm();
                const descriptionEditor = form.getEditor('description');

                descriptionEditor.option('value', 'Recurrence task 1');

                this.instance.hideAppointmentPopup();
                this.instance.showAppointmentPopup(tasks[0]);

                $('.dx-dialog-buttons .dx-button').eq(0).trigger('dxclick');

                const popup = this.instance.getAppointmentPopup();
                const $buttonGroup = $(popup.$content()).find('.dx-buttongroup');

                assert.deepEqual($buttonGroup.eq(0).dxButtonGroup('instance').option('selectedItemKeys'), ['MO', 'TH'], 'Right button group select item keys');
            });

            QUnit.test('Scheduler appointment popup should be opened correctly for recurrence appointments after opening for ordinary appointments(T710140)', function(assert) {
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

                this.createInstance({
                    dataSource: tasks,
                    currentDate: new Date(2017, 2, 13),
                    currentView: 'month',
                    views: ['month'],
                    startDateExpr: 'start',
                    endDateExpr: 'end'
                });
                this.instance.showAppointmentPopup(tasks[0]);

                let form = this.instance.getAppointmentDetailsForm();
                const descriptionEditor = form.getEditor('description');

                descriptionEditor.option('value', 'Task 1');

                this.instance.hideAppointmentPopup();
                this.instance.showAppointmentPopup(tasks[1]);

                $('.dx-dialog-buttons .dx-button').eq(0).trigger('dxclick');

                const popup = this.instance.getAppointmentPopup();
                const $buttonGroup = $(popup.$content()).find('.dx-buttongroup');

                $buttonGroup.eq(0).dxButtonGroup('instance').option('selectedItemKeys'), ['MO', 'TH'], 'Right button group select item keys';

                this.instance.hideAppointmentPopup();
                this.instance.showAppointmentPopup(tasks[0]);

                form = this.instance.getAppointmentDetailsForm();

                assert.equal(form.itemOption(APPOINTMENT_FORM_GROUP_NAMES.Recurrence).visible, false, 'Recurrence editor is hidden. Popup is correct');
            });

            QUnit.test('Scheduler appointment popup should correctly update recurrence appointment', function(assert) {
                const tasks = [{
                    text: 'Recurrence task',
                    start: new Date(2017, 2, 13),
                    end: new Date(2017, 2, 13, 0, 30),
                    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10'
                }];

                this.createInstance({
                    dataSource: tasks,
                    currentDate: new Date(2017, 2, 13),
                    currentView: 'month',
                    recurrenceEditMode: 'series',
                    views: ['month'],
                    startDateExpr: 'start',
                    endDateExpr: 'end'
                });

                this.scheduler.appointments.dblclick(0);

                const form = this.instance.getAppointmentDetailsForm();
                const repeatSwitch = form.getEditor('repeat');
                repeatSwitch.option('value', false);

                this.scheduler.appointmentPopup.clickDoneButton();

                assert.deepEqual(this.instance.option('dataSource')[0], {
                    text: 'Recurrence task',
                    start: new Date(2017, 2, 13),
                    end: new Date(2017, 2, 13, 0, 30),
                    recurrenceRule: ''
                }, 'Appointment was updated correctly');
            });

            QUnit.test('Scheduler shouldn\'t throw error at deferred appointment loading (T518327)', function(assert) {
                const data = [{ text: 'Task 1', startDate: new Date(2017, 4, 22, 16), endDate: new Date(2017, 4, 24, 1) }];

                this.createInstance({
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
                });

                const errorLogStub = sinon.stub(errors, 'log');
                this.instance.option('currentView', 'day');

                assert.notOk(errorLogStub.called, 'Error was not thrown');
                errorLogStub.restore();
            });

            QUnit.test('Exception should not be thrown on second details view opening if form items was not found', function(assert) {
                const task = { text: 'Task', startDate: new Date(2017, 2, 13), endDate: new Date(2017, 2, 13, 0, 30) };

                this.createInstance({
                    dataSource: [task],
                    currentDate: new Date(2017, 2, 13),
                    currentView: 'week',
                    views: ['week'],
                    onAppointmentFormOpening: function(e) {
                        e.form.option('items', []);
                    }
                });

                try {
                    this.instance.showAppointmentPopup(task);
                    this.instance.hideAppointmentPopup();

                    this.instance.showAppointmentPopup(task);
                    assert.ok(true, 'exception is not expected');
                } catch(e) {
                    assert.ok(false, 'Exception: ' + e);
                }
            });

            QUnit.test('FormData should be reset on saveChanges, dateSerializationFormat is set in initial appointment data (T569673)', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('This test is for standard scrolling');
                    return;
                }

                const task = { text: 'Task', StartDate: '2016-05-25T09:40:00',
                    EndDate: '2016-05-25T10:40:00' };

                this.createInstance({
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
                    }
                });

                this.instance.showAppointmentPopup(task, true);

                const detailsForm = this.instance.getAppointmentDetailsForm();
                const startDateEditor = detailsForm.getEditor('StartDate');

                startDateEditor.option('value', '2016-05-25T10:40:00');

                $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick').trigger('dxclick');

                const $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);

                const endDateFormat = dateSerialization.getDateSerializationFormat(dataUtils.data($appointments[1], 'dxItemData').EndDate);
                assert.deepEqual(endDateFormat, 'yyyy-MM-ddTHH:mm:ss', 'Appointment EndDate format is OK');
            });

            QUnit.test('Appointments should be rendered correctly, Month view with intervalCount and startDate', function(assert) {
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
                this.createInstance({
                    currentDate: new Date(2017, 5, 26),
                    dataSource: dataSource,
                    views: [{
                        type: 'month',
                        intervalCount: 3,
                        startDate: new Date(2017, 0, 19)
                    }],
                    currentView: 'month',
                    firstDayOfWeek: 1
                });

                const $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.equal($appointments.length, 3, 'Appointments were rendered correctly');
            });

            QUnit.test('Scheduler should add only one appointment at multiple "done" button clicks on appointment form', function(assert) {
                const a = { text: 'a', startDate: new Date(2017, 7, 9), endDate: new Date(2017, 7, 9, 0, 15) };
                const scheduler = createWrapper({
                    dataSource: [],
                    currentDate: new Date(2017, 7, 9),
                    currentView: 'week',
                    views: ['week'],
                    onAppointmentAdding: function(e) {
                        const d = $.Deferred();

                        window.setTimeout(function() {
                            d.resolve();
                        }, 300);

                        e.cancel = d.promise();
                    }
                });
                const appointmentPopup = scheduler.appointmentPopup;

                scheduler.instance.showAppointmentPopup(a, true);

                appointmentPopup.clickDoneButton();
                appointmentPopup.clickDoneButton();

                this.clock.tick(300);

                assert.equal(scheduler.appointments.getAppointmentCount(), 1, 'right appointment quantity');
            });

            QUnit.test('Appointments should be rendered correctly in vertical grouped workspace Month', function(assert) {
                this.createInstance({
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
                });

                const $appointments = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS);
                assert.equal($appointments.length, 2, 'two appointments is rendered');

                const cellHeight = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0).outerHeight();
                const cellPosition = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(5).position().left;

                assert.roughEqual($appointments.eq(0).position().top, cellHeight * 2 + APPOINTMENT_DEFAULT_TOP_OFFSET, 1, 'correct top position');
                assert.roughEqual($appointments.eq(0).position().left, cellPosition, 1.5, 'correct left position');
                assert.roughEqual($appointments.eq(1).position().top, cellHeight * 8 + APPOINTMENT_DEFAULT_TOP_OFFSET, 3.5, 'correct top position');
                assert.roughEqual($appointments.eq(1).position().left, cellPosition, 1.5, 'correct left position');
            });

            QUnit.test('Appointment should be dragged correctly between the groups in vertical grouped workspace Month', function(assert) {
                this.createInstance({
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2018, 2, 16, 12),
                        endDate: new Date(2018, 2, 16, 12, 30),
                        id: 1
                    }],
                    currentDate: new Date(2018, 2, 1),
                    views: [{
                        type: 'month',
                        groupOrientation: 'vertical'
                    }],
                    editing: true,
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
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);

                $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(54).trigger(dragEvents.enter);
                pointerMock($appointment).start().down().move(10, 10).up();

                this.clock.tick();
                const appointmentData = dataUtils.data(this.instance.$element().find('.' + APPOINTMENT_CLASS).get(0), 'dxItemData');

                assert.deepEqual(appointmentData.startDate, new Date(2018, 2, 9, 12), 'Start date is correct');
                assert.deepEqual(appointmentData.endDate, new Date(2018, 2, 9, 12, 30), 'End date is correct');
                assert.deepEqual(appointmentData.id, 2, 'Group is OK');
            });

            QUnit.test('Long appt parts should have correct coordinates if duration > week in vertical grouped workspace Month', function(assert) {
                this.createInstance({
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
                });

                const $firstPart = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const $secondPart = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(1);

                assert.roughEqual($firstPart.position().left, 0, 1.1, 'correct left position');
                assert.roughEqual($secondPart.position().left, 0, 1.1, 'correct left position');
            });

            QUnit.test('Long appt parts should have correct coordinates after drag to the last row cell in vertical grouped workspace Month', function(assert) {
                this.createInstance({
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2018, 2, 4, 12),
                        endDate: new Date(2018, 2, 5, 13, 30),
                        id: 1
                    }],
                    currentDate: new Date(2018, 2, 1),
                    views: [{
                        type: 'month',
                        groupOrientation: 'vertical'
                    }],
                    editing: true,
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
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const cellPosition = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(6).position().left;

                $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(6).trigger(dragEvents.enter);
                pointerMock($appointment).start().down().move(10, 10).up();

                this.clock.tick();
                const $firstPart = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const $secondPart = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(1);

                assert.roughEqual($firstPart.position().left, cellPosition, 2, 'correct left position');
                assert.equal($secondPart.position().left, 0, 'correct left position');
            });

            QUnit.test('Appointment should be resized correctly to left side in horizontal grouped workspace Month', function(assert) {
                this.createInstance({
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
                });

                const $element = $(this.instance.$element());
                const cellWidth = $element.find('.' + DATE_TABLE_CELL_CLASS).eq(0).outerWidth();
                const pointer = pointerMock($element.find('.dx-resizable-handle-left').eq(0)).start();

                pointer.dragStart().drag(-(cellWidth / 2), 0);
                pointer.dragEnd();

                const $appointment = $element.find('.' + APPOINTMENT_CLASS).eq(0);

                assert.roughEqual($appointment.position().left, 0, 1.1, 'Left coordinate is correct');
            });

            QUnit.test('A long appointment should not change start date if resized from the bottom', function(assert) {
                const expectedStartDate = new Date(2018, 4, 21, 0, 30);
                this.createInstance({
                    views: ['day'],
                    currentView: 'day',
                    currentDate: new Date(2018, 4, 21),
                    dataSource: [{
                        text: 'Test',
                        startDate: expectedStartDate,
                        endDate: new Date(2018, 4, 21, 23, 30),
                    }]
                });

                const $element = $(this.instance.element());

                const workspace = this.instance.getWorkSpace();
                workspace.getScrollable().scrollTo({ y: 3000 });

                const cellWidth = $element.find(`.${DATE_TABLE_CELL_CLASS}`).eq(0).outerHeight();
                const pointer = pointerMock($element.find('.dx-resizable-handle-bottom').eq(0)).start();

                pointer.dragStart().drag(0, -cellWidth);
                pointer.dragEnd();

                const { startDate } = this.instance.option('dataSource')[0];

                assert.deepEqual(startDate, expectedStartDate);
            });

            // Timezone-sensitive test, use US/Pacific for proper testing
            [{
                handle: CLASSES.resizableHandle.left,
                direction: -1,
                currentDate: new Date(2019, 10, 1),
                appointment: {
                    startDate: '2019-11-04T00:00',
                    endDate: '2019-11-06T00:00',
                },
                expectedValue: '12:00 AM - 12:00 AM',
                expectedTooltipValue: 'November 3 12:00 AM - November 6 12:00 AM',
                scrollDate: new Date(2019, 10, 1),
                text: 'in case drag left handle to winter DST'
            }, {
                handle: CLASSES.resizableHandle.left,
                direction: -1,
                currentDate: new Date(2019, 2, 10),
                appointment: {
                    startDate: '2019-03-11T00:00',
                    endDate: '2019-03-13T00:00',
                },
                expectedValue: '12:00 AM - 12:00 AM',
                expectedTooltipValue: 'March 10 12:00 AM - March 13 12:00 AM',
                scrollDate: new Date(2019, 2, 10),
                text: 'in case drag left handle to summer DST'
            }, {
                handle: CLASSES.resizableHandle.right,
                direction: 1,
                currentDate: new Date(2019, 10, 1),
                appointment: {
                    startDate: '2019-11-01T00:00',
                    endDate: '2019-11-03T00:00',
                },
                expectedValue: '12:00 AM - 12:00 AM',
                expectedTooltipValue: 'November 1 12:00 AM - November 4 12:00 AM',
                scrollDate: new Date(2019, 10, 1),
                text: 'in case drag right handle to winter DST'
            }, {
                handle: CLASSES.resizableHandle.right,
                direction: 1,
                currentDate: new Date(2019, 2, 10),
                appointment: {
                    startDate: '2019-03-08T00:00',
                    endDate: '2019-03-10T00:00',
                },
                expectedValue: '12:00 AM - 12:00 AM',
                expectedTooltipValue: 'March 8 12:00 AM - March 11 12:00 AM',
                scrollDate: new Date(2019, 2, 7),
                text: 'in case drag right handle to summer DST'
            }].forEach(testCase => {
                QUnit.test(`Appointment should have correct dates after resizing ${testCase.text} (T835544)`, function(assert) {
                    this.createInstance({
                        editing: {
                            allowResizing: true
                        },
                        dataSource: [{
                            text: 'Staff Productivity Report',
                            startDate: testCase.appointment.startDate,
                            endDate: testCase.appointment.endDate,
                        }],
                        views: ['timelineMonth'],
                        currentView: 'timelineMonth',
                        currentDate: new Date(testCase.currentDate),
                        height: 300,
                        startDayHour: 0,
                    });

                    this.scheduler.instance.scrollToTime(0, 0, new Date(testCase.scrollDate));

                    const { getAppointment, getDateText } = this.scheduler.appointments;

                    const cellWidth = this.scheduler.workSpace.getCellWidth();
                    let pointer = pointerMock($(getAppointment()).find(testCase.handle).eq(0)).start();

                    pointer.dragStart().drag(testCase.direction * cellWidth, 0);
                    pointer.dragEnd();

                    assert.equal(getDateText(), testCase.expectedValue, 'Dates should correct after resizing');

                    this.scheduler.appointments.click();
                    assert.equal(this.scheduler.tooltip.getDateText(), testCase.expectedTooltipValue, 'Dates in tooltip should correct');

                    pointer = pointerMock($(getAppointment()).find(testCase.handle).eq(0)).start();

                    pointer.dragStart().drag(-testCase.direction * cellWidth, 0);
                    pointer.dragEnd();

                    assert.equal(getDateText(), testCase.expectedValue, 'Dates should correct');
                });
            });

            QUnit.test('Tail of long appointment should have a right position, groupByDate = true', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual Scrolling - ViewDataGenerator');
                    return;
                }

                this.createInstance({
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
                    firstDayOfWeek: 1
                });

                const $appointmentTail = $(this.instance.$element()).find('.dx-scheduler-work-space .dx-scheduler-appointment').eq(1);
                const $cell = $(this.instance.$element()).find('.dx-scheduler-work-space .dx-scheduler-date-table-cell').eq(5);

                assert.roughEqual($appointmentTail.position().left, $cell.position().left, 1.001, 'Tail has a right position');
            });

            QUnit.test('Appointment should be rendered without compact ones if only one per cell (even with zoom) (T723354)', function(assert) {
                this.createInstance({
                    dataSource: [{
                        text: 'Recruiting students',
                        startDate: new Date(2018, 2, 26, 10, 0),
                        endDate: new Date(2018, 2, 26, 11, 0),
                        recurrenceRule: 'FREQ=DAILY'
                    }],
                    views: ['timelineMonth'],
                    currentView: 'timelineMonth',
                    currentDate: new Date(2018, 3, 27)
                });

                assert.equal(this.scheduler.appointments.getAppointmentCount(), 30, 'Scheduler appointments are rendered without compact ones');
            });

            QUnit.skip('Appointments are rendered with custom cell width less than default (T816873)', function(assert) {
                const $style = $('<style>').text('#dxLineSchedule .dx-scheduler-date-table-cell, #dxLineSchedule .dx-scheduler-header-panel-cell {width: 100px !important;}');
                try {
                    $style.appendTo('head');

                    const data = [{
                        recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;UNTIL=20190930T130000',
                        recurrenceException: '',
                        startDate: '2019-09-19T18:00:00.000Z',
                        endDate: '2019-09-19T18:04:00.000Z'
                    }, {
                        recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;UNTIL=20190930T050000',
                        recurrenceException: '',
                        startDate: '2019-09-20T10:00:00.000Z',
                        endDate: '2019-09-20T04:59:59.000Z'
                    }, {
                        recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;UNTIL=20190930T045900',
                        recurrenceException: '',
                        startDate: '2019-09-20T09:59:00.000Z',
                        endDate: '2019-09-20T10:00:00.000Z'
                    }];

                    this.createInstance({
                        dataSource: data,
                        elementAttr: {
                            id: 'dxLineSchedule'
                        },
                        views: [{
                            type: 'timelineWeek',
                            cellDuration: 120,
                            maxAppointmentsPerCell: 'unlimited'
                        }],
                        currentView: 'timelineWeek',
                        currentDate: new Date(2019, 8, 22)
                    });

                    assert.ok(this.scheduler.appointments.getAppointmentCount() > 0, 'Appointments are rendered');
                } finally {
                    $style.remove();
                }
            });

            QUnit.test('Long term appoinment inflict index shift in other appointments (T737780)', function(assert) {
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

                this.createInstance({
                    dataSource: data,
                    views: ['month'],
                    currentView: 'month',
                    currentDate: new Date(2017, 4, 25),
                    startDayHour: 9,
                    height: 600
                });

                const appointments = this.instance._getAppointmentsToRepaint();
                assert.strictEqual(appointments[0].settings[1].index, 0, 'Long term appointment tail has right index');
                assert.strictEqual(appointments[1].settings[0].index, 1, 'Appointment next to long term appointment head has right index');
                assert.strictEqual(appointments[2].settings[0].index, 1, 'Appointment next to long term appointment tail has right index');
            });

            QUnit.test('Multi-day appointment should be rendered when started after endDayHour (T819852)', function(assert) {
                const data = [{
                    text: 'Default appt',
                    startDate: new Date('2019-10-03T06:00:00.000'),
                    endDate: new Date('2019-10-03T18:00:00.000'),
                }, {
                    text: 'Appt with end before endDayHour',
                    startDate: new Date('2019-10-02T17:00:00.000'),
                    endDate: new Date('2019-10-03T17:00:00.000'),
                }, {
                    text: 'Appt with end before startDayHour',
                    startDate: new Date('2019-10-02T17:30:00.000'),
                    endDate: new Date('2019-10-02T18:30:00.000'),
                }, {
                    text: 'Appt with end after endDayHour',
                    startDate: new Date('2019-10-02T18:55:00.000'),
                    endDate: new Date('2019-10-03T19:00:00.000'),
                }];

                this.createInstance({
                    dataSource: data,
                    views: ['timelineWeek'],
                    currentView: 'timelineWeek',
                    currentDate: new Date(2019, 9, 4),
                    cellDuration: 660,
                    startDayHour: 7,
                    endDayHour: 18,
                    height: 580
                });

                assert.strictEqual(this.scheduler.appointments.getAppointmentCount(), 4, 'Appointments are rendered');
                assert.strictEqual($(this.scheduler.appointments.getAppointment(0)).position().left, $(this.scheduler.appointments.getAppointment(3)).position().left, 'Appointments have same left coordinate');
                assert.strictEqual($(this.scheduler.appointments.getAppointment(0)).innerWidth(), $(this.scheduler.appointments.getAppointment(3)).innerWidth(), 'Appointments with equal coords have same width');
                assert.strictEqual($(this.scheduler.appointments.getAppointment(1)).innerWidth(), $(this.scheduler.appointments.getAppointment(3)).innerWidth(), 'Appointments with defferent coords have same width');
            });

            QUnit.test('Appointment with equal startDate and endDate should render with 1 minute duration (T817857)', function(assert) {
                this.createInstance({
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
                });

                assert.strictEqual(this.scheduler.appointments.getAppointmentCount(), 2, 'Appointments are rendered');
                assert.equal(this.scheduler.appointments.getAppointmentHeight(0), this.scheduler.appointments.getAppointmentHeight(1), 'Appointment heights are equal');
            });

            $.each(['month', 'timelineMonth'], (index, value) => {
                QUnit.test(`Appointment with equal startDate and endDate should render in whole cell on ${value} view (T858496)`, function(assert) {
                    this.createInstance({
                        dataSource: [{
                            text: 'Zero-minute appointment',
                            startDate: new Date(2017, 4, 22, 0),
                            endDate: new Date(2017, 4, 22, 0)
                        }, {
                            text: 'Default appointment',
                            startDate: new Date(2017, 4, 22, 0),
                            endDate: new Date(2017, 4, 22, 1)
                        }],
                        views: [value],
                        currentView: value,
                        currentDate: new Date(2017, 4, 25),
                        height: 600,
                    });

                    assert.strictEqual(this.scheduler.appointments.getAppointmentCount(), 2, 'Appointments are rendered');
                    assert.equal(this.scheduler.appointments.getAppointmentWidth(0), this.scheduler.appointments.getAppointmentWidth(1), 'Appointment widths are equal');
                });
            });

            QUnit.test('Multi-day appointment is hidden in compact collectors according to head and tail coordinates (T835541)', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual Scrolling - Limitation long multiday appointment');
                    return;
                }

                this.createInstance({
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
                    maxAppointmentsPerCell: 1,
                });

                assert.strictEqual(this.scheduler.appointments.compact.getButtonCount(), 2, 'Appointments are rendered');

                const tailCoords = translator.locate(this.scheduler.appointments.compact.getButton(1));

                assert.strictEqual(tailCoords.top, 0, 'Appointment top is correct');
                assert.roughEqual(tailCoords.left, 240, 2, 'Appointment left is correct');
            });

            QUnit.module('Scroll after Editing', {
                beforeEach: function() {
                    this.createScheduler = (options = {}) => {
                        return createWrapper({
                            scrolling: { mode: scrollingMode },
                            currentDate: new Date('2020-09-06T00:00:00'),
                            height: 500,
                            width: 500,
                            crossScrollingEnabled: true,
                            resources: [{
                                fieldExpr: 'ownerId',
                                dataSource: [{
                                    id: 1, text: 'A',
                                }, {
                                    id: 2, text: 'B',
                                }]
                            }],
                            ...options,
                        });
                    };
                },
            }, () => {
                const checkThatScrollToWasCalled = (assert, scheduler, appointment) => {
                    const workSpace = scheduler.instance.getWorkSpace();
                    const scrollTo = sinon.spy(workSpace, 'scrollTo');

                    try {
                        scheduler.instance.showAppointmentPopup(appointment);
                        scheduler.appointmentPopup.clickDoneButton();

                        assert.ok(scrollTo.calledOnce, 'scrollTo was called');
                    } finally {
                        workSpace.scrollTo.restore();
                    }
                };

                const checkThatScrollToWasNotCalled = (assert, scheduler, appointment) => {
                    const workSpace = scheduler.instance.getWorkSpace();
                    const scrollTo = sinon.spy(workSpace, 'scrollTo');

                    try {
                        scheduler.instance.showAppointmentPopup(appointment);
                        scheduler.appointmentPopup.clickDoneButton();

                        assert.notOk(scrollTo.calledOnce, 'scrollTo was not called');
                    } finally {
                        workSpace.scrollTo.restore();
                    }
                };

                [{
                    view: 'week',
                    startDate: new Date('2020-09-06T00:00:00'),
                    endDate: new Date('2020-09-06T01:00:00'),
                    groupOrientation: 'horizontal',
                }, {
                    view: 'month',
                    startDate: new Date('2020-09-06T00:00:00'),
                    endDate: new Date('2020-09-06T01:00:00'),
                    groupOrientation: 'horizontal',
                }, {
                    view: 'timelineWeek',
                    startDate: new Date('2020-09-06T00:00:00'),
                    endDate: new Date('2020-09-06T01:00:00'),
                    groupOrientation: 'horizontal',
                }, {
                    view: 'timelineMonth',
                    startDate: new Date('2020-09-01T00:00:00'),
                    endDate: new Date('2020-09-01T01:00:00'),
                    groupOrientation: 'horizontal',
                }, {
                    view: 'week',
                    startDate: new Date('2020-09-06T00:00:00'),
                    endDate: new Date('2020-09-06T01:00:00'),
                    groupOrientation: 'vertical',
                }, {
                    view: 'month',
                    startDate: new Date('2020-09-06T00:00:00'),
                    endDate: new Date('2020-09-06T01:00:00'),
                    groupOrientation: 'vertical',
                }, {
                    view: 'timelineWeek',
                    startDate: new Date('2020-09-06T00:00:00'),
                    endDate: new Date('2020-09-06T01:00:00'),
                    groupOrientation: 'vertical',
                }, {
                    view: 'timelineMonth',
                    startDate: new Date('2020-09-01T00:00:00'),
                    endDate: new Date('2020-09-01T01:00:00'),
                    groupOrientation: 'vertical',
                }].forEach(({ view, startDate, endDate, groupOrientation }) => {
                    QUnit.test(
                        `Scroll position should not be updated if appointment is visible in ${view}, ${groupOrientation} grouping`,
                        function(assert) {
                            const scheduler = this.createScheduler({
                                views: [{
                                    type: view,
                                    groupOrientation,
                                }],
                                currentView: view,
                                groups: ['ownerId'],
                            });

                            const appointment = {
                                startDate,
                                endDate,
                                text: 'text',
                                ownerId: 1,
                            };

                            checkThatScrollToWasNotCalled(assert, scheduler, appointment);
                        });
                });

                [{
                    view: 'week',
                    startDate: new Date('2020-09-06T00:00:00'),
                    endDate: new Date('2020-09-06T01:00:00'),
                    groupOrientation: 'horizontal',
                }, {
                    view: 'month',
                    startDate: new Date('2020-09-06T00:00:00'),
                    endDate: new Date('2020-09-06T01:00:00'),
                    groupOrientation: 'horizontal',
                }, {
                    view: 'timelineWeek',
                    startDate: new Date('2020-09-06T00:00:00'),
                    endDate: new Date('2020-09-06T01:00:00'),
                    groupOrientation: 'horizontal',
                }, {
                    view: 'timelineMonth',
                    startDate: new Date('2020-09-01T00:00:00'),
                    endDate: new Date('2020-09-01T01:00:00'),
                    groupOrientation: 'horizontal',
                }, {
                    view: 'week',
                    startDate: new Date('2020-09-06T00:00:00'),
                    endDate: new Date('2020-09-06T01:00:00'),
                    groupOrientation: 'vertical',
                }, {
                    view: 'month',
                    startDate: new Date('2020-09-06T00:00:00'),
                    endDate: new Date('2020-09-06T01:00:00'),
                    groupOrientation: 'vertical',
                }, {
                    view: 'timelineWeek',
                    startDate: new Date('2020-09-08T00:00:00'),
                    endDate: new Date('2020-09-08T01:00:00'),
                    groupOrientation: 'vertical',
                }, {
                    view: 'timelineMonth',
                    startDate: new Date('2020-09-08T00:00:00'),
                    endDate: new Date('2020-09-08T01:00:00'),
                    groupOrientation: 'vertical',
                }].forEach(({ view, startDate, endDate, groupOrientation }) => {
                    QUnit.test(`Scroll position should be updated if appointment is not visible in ${view}, ${groupOrientation} grouping`, function(assert) {
                        const scheduler = this.createScheduler({
                            views: [{
                                type: view,
                                groupOrientation,
                            }],
                            currentView: view,
                            groups: ['ownerId'],
                        });

                        const appointment = {
                            startDate,
                            endDate,
                            text: 'text',
                            ownerId: 2,
                        };

                        checkThatScrollToWasCalled(assert, scheduler, appointment);
                    });
                });

                [{
                    view: 'week',
                    startDate: new Date('2020-09-06T00:00:00'),
                    endDate: new Date('2020-09-06T01:00:00'),
                }, {
                    view: 'month',
                    startDate: new Date('2020-09-06T00:00:00'),
                    endDate: new Date('2020-09-06T01:00:00'),
                }, {
                    view: 'timelineWeek',
                    startDate: new Date('2020-09-06T00:00:00'),
                    endDate: new Date('2020-09-06T01:00:00'),
                }, {
                    view: 'timelineMonth',
                    startDate: new Date('2020-09-01T00:00:00'),
                    endDate: new Date('2020-09-01T01:00:00'),
                }].forEach(({ view, startDate, endDate }) => {
                    QUnit.test(
                        `Scroll position should not be updated if appointment is visible in ${view}, grouping by date`,
                        function(assert) {
                            const scheduler = this.createScheduler({
                                views: [{
                                    type: view,
                                    groupOrientation: 'horizontal',
                                    groupByDate: true,
                                }],
                                currentView: view,
                                groups: ['ownerId'],
                            });

                            const appointment = {
                                startDate,
                                endDate,
                                text: 'text',
                                ownerId: 1,
                            };

                            checkThatScrollToWasNotCalled(assert, scheduler, appointment);
                        });
                });

                [{
                    view: 'week',
                    startDate: new Date('2020-09-11T00:00:00'),
                    endDate: new Date('2020-09-11T01:00:00'),
                }, {
                    view: 'month',
                    startDate: new Date('2020-09-11T00:00:00'),
                    endDate: new Date('2020-09-11T01:00:00'),
                }, {
                    view: 'timelineWeek',
                    startDate: new Date('2020-09-11T00:00:00'),
                    endDate: new Date('2020-09-11T01:00:00'),
                }, {
                    view: 'timelineMonth',
                    startDate: new Date('2020-09-11T00:00:00'),
                    endDate: new Date('2020-09-11T01:00:00'),
                }].forEach(({ view, startDate, endDate }) => {
                    QUnit.test(
                        `Scroll position should be updated if appointment is not visible in ${view}, grouping by date`,
                        function(assert) {
                            const scheduler = this.createScheduler({
                                views: [{
                                    type: view,
                                    groupOrientation: 'horizontal',
                                    groupByDate: true,
                                }],
                                currentView: view,
                                groups: ['ownerId'],
                            });

                            const appointment = {
                                startDate,
                                endDate,
                                text: 'text',
                                ownerId: 2,
                            };

                            checkThatScrollToWasCalled(assert, scheduler, appointment);
                        });
                });

                QUnit.test(
                    'Scroll position should not be updated if appointment is visible in all-day panel',
                    function(assert) {
                        const scheduler = this.createScheduler({
                            views: [{
                                type: 'week',
                                groupOrientation: 'horizontal',
                            }],
                            currentView: 'week',
                            groups: ['ownerId'],
                        });

                        const appointment = {
                            startDate: new Date('2020-09-06T00:00:00'),
                            endDate: new Date('2020-09-06T01:00:00'),
                            text: 'text',
                            ownerId: 1,
                            allDay: true,
                        };

                        checkThatScrollToWasNotCalled(assert, scheduler, appointment);
                    });

                QUnit.test(
                    'Scroll position should be updated if appointment is not visible in all-day panel',
                    function(assert) {
                        const scheduler = this.createScheduler({
                            views: [{
                                type: 'week',
                                groupOrientation: 'horizontal',
                            }],
                            currentView: 'week',
                            groups: ['ownerId'],
                        });

                        const appointment = {
                            startDate: new Date('2020-09-06T00:00:00'),
                            endDate: new Date('2020-09-06T01:00:00'),
                            text: 'text',
                            ownerId: 2,
                            allDay: true,
                        };

                        checkThatScrollToWasCalled(assert, scheduler, appointment);
                    });

                QUnit.test(
                    'Scroll position should not be updated if appointment is longer that one day and visible',
                    function(assert) {
                        const scheduler = this.createScheduler({
                            views: [{
                                type: 'week',
                                groupOrientation: 'horizontal',
                            }],
                            currentView: 'week',
                            groups: ['ownerId'],
                        });

                        const appointment = {
                            startDate: new Date('2020-09-06T00:00:00'),
                            endDate: new Date('2020-09-07T01:00:00'),
                            text: 'text',
                            ownerId: 1,
                        };

                        checkThatScrollToWasNotCalled(assert, scheduler, appointment);
                    });

                QUnit.test(
                    'Scroll position should be updated if appointment is longer that one day and is not visible',
                    function(assert) {
                        const scheduler = this.createScheduler({
                            views: [{
                                type: 'week',
                                groupOrientation: 'horizontal',
                            }],
                            currentView: 'week',
                            groups: ['ownerId'],
                        });

                        const appointment = {
                            startDate: new Date('2020-09-06T00:00:00'),
                            endDate: new Date('2020-09-07T01:00:00'),
                            text: 'text',
                            ownerId: 2,
                        };

                        checkThatScrollToWasCalled(assert, scheduler, appointment);
                    });

                [{
                    position: 'right',
                    startDate: new Date('2020-09-11T00:00:00'),
                    endDate: new Date('2020-09-11T01:00:00'),
                    scrollLeft: 0,
                    scrollTop: 0,
                }, {
                    position: 'left',
                    startDate: new Date('2020-09-06T00:00:00'),
                    endDate: new Date('2020-09-06T01:00:00'),
                    scrollLeft: 2,
                    scrollTop: 0,
                }, {
                    position: 'top',
                    startDate: new Date('2020-09-11T00:00:00'),
                    endDate: new Date('2020-09-11T01:00:00'),
                    scrollLeft: 0,
                    scrollTop: 2,
                }, {
                    position: 'bottom',
                    startDate: new Date('2020-09-11T00:00:00'),
                    endDate: new Date('2020-09-11T01:00:00'),
                    scrollLeft: 0,
                    scrollTop: 0,
                }].forEach(({ position, startDate, endDate, scrollLeft, scrollTop }) => {
                    QUnit.test(
                        `Scroll position should be updated if an appointment starts in a partially visible cell, ${position} end`,
                        function(assert) {
                            const scheduler = this.createScheduler({
                                views: ['week'],
                                currentView: 'week',
                            });

                            const appointment = {
                                startDate,
                                endDate,
                                text: 'text',
                            };
                            const workSpace = scheduler.instance.getWorkSpace();
                            workSpace.getScrollable().scrollTo({ x: scrollLeft, y: scrollTop });

                            checkThatScrollToWasCalled(assert, scheduler, appointment);
                        });
                });
            });
        });
    });

    QUnit.module('Appointments', () => {
        let eventCallCount = 0;

        const createScheduler = (data, options) => {
            const config = {
                dataSource: data,
                views: ['month'],
                currentView: 'month',
                currentDate: new Date(2017, 4, 25),
                startDayHour: 9,
                width: 600,
                height: 600
            };

            return createWrapper($.extend(config, options));
        };

        const createTestForCommonData = (assert, scheduler, skipCallCount = false) => {
            eventCallCount = 0;

            return (model, index, container) => {
                const { appointmentData, targetedAppointmentData } = model;

                if(!skipCallCount) {
                    assert.equal(index, eventCallCount, 'index argument should be equal current index of appointment');
                }
                assert.deepEqual(appointmentData, targetedAppointmentData, 'appointmentData and targetedAppointmentData should be equivalents');

                eventCallCount++;
            };
        };

        const createTestForRecurrenceData = (assert, scheduler) => {
            eventCallCount = 0;

            return (model, index, container) => {
                const { appointmentData, targetedAppointmentData } = model;
                const startDateExpr = scheduler.option('startDateExpr');
                const endDateExpr = scheduler.option('endDateExpr');
                const textExpr = scheduler.option('textExpr');

                const expectedStartDate = appointmentData[startDateExpr].getDate() + eventCallCount;
                const expectedEndDate = appointmentData[endDateExpr].getDate() + eventCallCount;

                assert.equal(targetedAppointmentData[startDateExpr].getDate(), expectedStartDate, `start date of targetedAppointmentData should be equal ${expectedStartDate}`);
                assert.equal(targetedAppointmentData[endDateExpr].getDate(), expectedEndDate, `end date of targetedAppointmentData should be equal ${expectedEndDate}`);

                assert.equal(index, 0, 'index argument should be 0');
                assert.equal(appointmentData[textExpr], targetedAppointmentData[textExpr], 'appointmentData.text and targetedAppointmentData.text arguments should be equal');

                eventCallCount++;
            };
        };
        const createTestForHourlyRecurrenceData = (assert, scheduler) => {
            eventCallCount = 0;

            return (model, index, container) => {
                // TODO: in current state, targetedAppointmentData arguments has non converted dates
                const { appointmentData, targetedAppointmentData } = model;

                const startDateExpr = scheduler.option('startDateExpr');
                const endDateExpr = scheduler.option('endDateExpr');
                const textExpr = scheduler.option('textExpr');

                const expectedStartDate = appointmentData[startDateExpr];
                const expectedStartDateHours = expectedStartDate.getHours() + eventCallCount;
                const expectedStartDateMinutes = expectedStartDate.getMinutes();

                const expectedEndDate = appointmentData[endDateExpr];
                const expectedEndDateHours = expectedEndDate.getHours() + eventCallCount;
                const expectedEndDateMinutes = expectedEndDate.getMinutes();

                assert.equal(targetedAppointmentData[startDateExpr].getHours(), expectedStartDateHours, `start date of targetedAppointmentData should be equal ${expectedStartDateHours}`);
                assert.equal(targetedAppointmentData[startDateExpr].getMinutes(), expectedStartDateMinutes, `start date of targetedAppointmentData should be equal ${expectedStartDateMinutes}`);

                assert.equal(targetedAppointmentData[endDateExpr].getHours(), expectedEndDateHours, `end date of targetedAppointmentData should be equal ${expectedEndDateHours}`);
                assert.equal(targetedAppointmentData[endDateExpr].getMinutes(), expectedEndDateMinutes, `end date of targetedAppointmentData should be equal ${expectedEndDateMinutes}`);

                assert.equal(index, 0, 'index argument should be 0');
                assert.equal(appointmentData[textExpr], targetedAppointmentData[textExpr], 'appointmentData.text and targetedAppointmentData.text arguments should be equal');

                eventCallCount++;
            };
        };

        const commonData = [{
            text: 'Website Re-Design Plan',
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30)
        }, {
            text: 'Website Re-Design Plan',
            startDate: new Date(2017, 4, 23, 9, 30),
            endDate: new Date(2017, 4, 23, 11, 30)
        }, {
            text: 'Website Re-Design Plan',
            startDate: new Date(2017, 4, 24, 9, 30),
            endDate: new Date(2017, 4, 24, 11, 30)
        }, {
            text: 'Website Re-Design Plan',
            startDate: new Date(2017, 4, 25, 9, 30),
            endDate: new Date(2017, 4, 25, 11, 30)
        }, {
            text: 'Website Re-Design Plan',
            startDate: new Date(2017, 4, 26, 9, 30),
            endDate: new Date(2017, 4, 26, 11, 30)
        }];

        const recurrenceData = [{
            text: 'Website Re-Design Plan',
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30),
            recurrenceRule: 'FREQ=DAILY;COUNT=5'
        }];

        const recurrenceDataWithCustomNames = [{
            textCustom: 'Website Re-Design Plan',
            startDateCustom: new Date(2017, 4, 22, 9, 30),
            endDateCustom: new Date(2017, 4, 22, 11, 30),
            recurrenceRule: 'FREQ=DAILY;COUNT=5'
        }];

        const recurrenceAndCompactData = [{
            text: 'Website Re-Design Plan',
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30),
            recurrenceRule: 'FREQ=DAILY;COUNT=5'
        },
        {
            text: 'Website Re-Design Plan1',
            startDate: new Date(2017, 4, 22, 9, 35),
            endDate: new Date(2017, 4, 22, 11, 20),
            recurrenceRule: 'FREQ=DAILY;COUNT=5'
        },
        {
            text: 'Website Re-Design Plan2',
            startDate: new Date(2017, 4, 22, 9, 45),
            endDate: new Date(2017, 4, 22, 11, 25),
            recurrenceRule: 'FREQ=DAILY;COUNT=5'
        }];

        const hourlyRecurrenceData = [{
            textCustom: 'Website Re-Design Plan',
            startDateCustom: new Date(2017, 4, 25, 9, 30),
            endDateCustom: new Date(2017, 4, 25, 10),
            recurrenceRule: 'FREQ=HOURLY;COUNT=5'
        },
        {
            textCustom: 'Website Re-Design Plan1',
            startDateCustom: new Date(2017, 4, 25, 9, 35),
            endDateCustom: new Date(2017, 4, 25, 11, 20),
            recurrenceRule: 'FREQ=HOURLY;COUNT=5'
        }];

        QUnit.module('appointmentTemplate', () => {
            QUnit.test('model.targetedAppointmentData argument should have current appointment data', function(assert) {
                const scheduler = createScheduler(commonData);
                scheduler.option({ appointmentTemplate: createTestForCommonData(assert) });

                assert.strictEqual(eventCallCount, 5, 'appointmentTemplate should be raised');
            });

            QUnit.test('model.targetedAppointmentData argument should have current appointment data in case recurrence', function(assert) {
                const scheduler = createScheduler(recurrenceData);
                scheduler.option({ appointmentTemplate: createTestForRecurrenceData(assert, scheduler) });

                assert.strictEqual(eventCallCount, 5, 'appointmentTemplate should be raised');
            });

            QUnit.test('model.targetedAppointmentData argument should have current appointment data in case recurrence and custom data properties', function(assert) {
                const scheduler = createScheduler(recurrenceDataWithCustomNames, {
                    textExpr: 'textCustom',
                    startDateExpr: 'startDateCustom',
                    endDateExpr: 'endDateCustom'
                });
                scheduler.option({ appointmentTemplate: createTestForRecurrenceData(assert, scheduler) });

                assert.strictEqual(eventCallCount, 5, 'appointmentTemplate should be raised');
            });
        });

        QUnit.module('appointmentTooltipTemplate', () => {
            const cases = [
                {
                    data: commonData,
                    appointmentTooltip: createTestForCommonData,
                    name: 'common'
                },
                {
                    data: recurrenceData,
                    appointmentTooltip: createTestForRecurrenceData,
                    name: 'recurrence'
                },
                {
                    data: recurrenceAndCompactData,
                    appointmentTooltip: createTestForRecurrenceData,
                    name: 'recurrence in collector',
                    testCollector: true
                },
                {
                    data: hourlyRecurrenceData,
                    options: {
                        textExpr: 'textCustom',
                        startDateExpr: 'startDateCustom',
                        endDateExpr: 'endDateCustom',
                        currentView: 'week'
                    },
                    appointmentTooltip: createTestForHourlyRecurrenceData,
                    name: 'hourly recurrence in collector',
                    testCollector: true
                },
                {
                    data: hourlyRecurrenceData,
                    options: {
                        textExpr: 'textCustom',
                        startDateExpr: 'startDateCustom',
                        endDateExpr: 'endDateCustom',
                        currentView: 'week',
                        timeZone: 'Africa/Bangui', // NOTE: +1
                        startDayHour: 0,
                        endDayHour: 24
                    },
                    appointmentTooltip: createTestForHourlyRecurrenceData,
                    name: 'hourly recurrence in collector, custom timezone is set',
                    testCollector: true
                }
            ];

            cases.forEach(testCase => {
                QUnit.test(`model.targetedAppointmentData argument should have current appointment data, ${testCase.name} case`, function(assert) {
                    const scheduler = createScheduler(testCase.data, testCase.options);
                    scheduler.option('appointmentTooltipTemplate', testCase.appointmentTooltip(assert, scheduler, true));

                    for(let i = 0; i < 5; i++) {
                        if(testCase.testCollector) {
                            scheduler.appointments.compact.click(i);
                        } else {
                            scheduler.appointments.click(i);
                        }
                    }

                    assert.strictEqual(eventCallCount, 5, 'appointmentTemplate should be raised');
                });
            });
        });

        QUnit.test('Remote filter should apply after change view type', function(assert) {
            const model = [{
                text: 'New Brochures',
                startDate: '2017-05-23T14:30:00',
                endDate: '2017-05-23T15:45:00'
            }, {
                text: 'Install New Database',
                startDate: '2017-05-24T09:45:00',
                endDate: '2017-05-24T11:15:00'
            }, {
                text: 'Approve New Online Marketing Strategy',
                startDate: '2017-05-24T12:00:00',
                endDate: '2017-05-24T14:00:00'
            }, {
                text: 'Upgrade Personal Computers',
                startDate: '2017-05-24T15:15:00',
                endDate: '2017-05-24T16:30:00'
            }, {
                text: 'Customer Workshop',
                startDate: '2017-05-25T11:00:00',
                endDate: '2017-05-25T12:00:00',
                allDay: true
            }, {
                text: 'Prepare 2015 Marketing Plan',
                startDate: '2017-05-25T11:00:00',
                endDate: '2017-05-25T13:30:00'
            }, {
                text: 'Brochure Design Review',
                startDate: '2017-05-25T14:00:00',
                endDate: '2017-05-25T15:30:00'
            }, {
                text: 'Create Icons for Website',
                startDate: '2017-05-26T10:00:00',
                endDate: '2017-05-26T11:30:00'
            }, {
                text: 'Upgrade Server Hardware',
                startDate: '2017-05-26T14:30:00',
                endDate: '2017-05-26T16:00:00'
            }];

            const dataSource = new DataSource({
                store: model
            });

            const scheduler = createWrapper({
                dataSource: dataSource,
                dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ss',
                remoteFiltering: true,
                views: ['workWeek', 'month'],
                currentView: 'month',
                currentDate: new Date(2017, 4, 23),
                maxAppointmentsPerCell: 'unlimited',
                height: 600,
            });

            assert.equal(scheduler.appointments.getAppointmentCount(), 9, `Appointment count should be equal ${model.length} items`);

            const filter = dataSource.filter();
            filter.push([
                ['startDate', '>', '2017-05-25T21:00:00'],
                'and',
                ['endDate', '<', '2017-05-26T21:00:00']
            ]);

            dataSource.filter(filter);
            dataSource.load();
            assert.equal(scheduler.appointments.getAppointmentCount(), 2, 'Appointments should be filtered after call load method of dataSource');

            scheduler.instance.option('currentView', 'workWeek');
            assert.equal(scheduler.appointments.getAppointmentCount(), 2, 'Appointments should be filtered and rendered after change view on "Work Week"');

            scheduler.instance.option('currentView', 'month');
            assert.equal(scheduler.appointments.getAppointmentCount(), 2, 'Appointments should be filtered and rendered after change view on "Month"');
        });

        QUnit.test('Long appointment should have correct parts count(T854740)', function(assert) {
            const data = [{ text: 'Two Weeks App (Jan 6 - Jan 19)', startDate: new Date(2020, 0, 6), endDate: new Date(2020, 0, 19, 12), typeId: 1 }];

            const scheduler = createWrapper({
                dataSource: data,
                views: ['month'],
                firstDayOfWeek: 1,
                currentView: 'month',
                currentDate: new Date(2020, 0, 1),
                height: 500,
                width: 250
            });

            assert.equal(scheduler.appointments.getAppointmentCount(), 2, 'Appointment parts are ok');
        });

        QUnit.test('Long appointment should have correct parts count if widget is zoomed (T854740)', function(assert) {
            if(!browser.webkit) {
                assert.ok(true, 'Browser zooming is enabled in webkit');
                return;
            }

            $('#scheduler').css('zoom', 1.25);

            const data = [{ text: 'Two Weeks App (Jan 6 - Jan 19)', startDate: new Date(2020, 0, 6), endDate: new Date(2020, 0, 19, 12), typeId: 1 }];

            const scheduler = createWrapper({
                dataSource: data,
                views: ['month'],
                firstDayOfWeek: 1,
                currentView: 'month',
                currentDate: new Date(2020, 0, 1),
                height: 500,
                width: 250
            });

            assert.equal(scheduler.appointments.getAppointmentCount(), 2, 'Appointment parts are ok');
        });

        QUnit.test('Appointments from neighbor cells should not overlap each other if widget is zoomed (T885595)', function(assert) {
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
                height: 650
            });

            assert.equal(scheduler.appointments.getAppointmentPosition(0).top, scheduler.appointments.getAppointmentPosition(1).top, 'Appointment positions are correct');
        });

        QUnit.test('targetedAppointmentData should has valid targeted resource on onAppointmentClick event', function(assert) {
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
            });

            scheduler.appointments.click(0);
            scheduler.appointments.click(1);

            assert.expect(4);
        });
    });
});
