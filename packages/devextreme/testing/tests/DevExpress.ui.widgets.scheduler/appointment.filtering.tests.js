import $ from 'jquery';
import fx from 'common/core/animation/fx';
import { DataSource } from 'common/data/data_source/data_source';
import dataUtils from 'core/element_data';
import {
    initTestMarkup,
    createWrapper,
    asyncAssert,
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

const APPOINTMENT_CLASS = 'dx-scheduler-appointment';

const createInstanceBase = (options, clock) => {
    const scheduler = createWrapper({
        height: 600,
        ...options,
    });

    clock.tick(300);
    scheduler.instance.focus();

    return scheduler;
};

module('Integration: Appointment filtering', {
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
            test('Removed appointments should render, if appointment appeared after filtering (T903973)', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('Virtual scrolling not support month view');
                    return;
                }

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

            test('Remote filter should apply after change view type', function(assert) {
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
                    dataSource,
                    dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ss',
                    remoteFiltering: true,
                    views: ['workWeek', 'month'],
                    currentView: 'month',
                    currentDate: new Date(2017, 4, 23),
                    maxAppointmentsPerCell: 'unlimited',
                    scrolling: {
                        mode: scrollingMode
                    },
                    height: 1200,
                    width: 600
                });

                assert.equal(scheduler.appointments.getAppointmentCount(), 9, `Appointment count should be equals to ${model.length} items`);

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

            test('Tasks should be filtered by date before render', function(assert) {
                const tasks = [
                    { text: 'One', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 1) },
                    { text: 'Two', startDate: new Date(2015, 2, 17), endDate: new Date(2015, 2, 17, 1) }
                ];
                const dataSource = new DataSource({
                    store: tasks
                });
                const scheduler = createInstance({
                    currentDate: new Date(2015, 2, 16),
                    dataSource: dataSource,
                    currentView: 'day',
                    remoteFiltering: true
                }, this.clock);

                assert.deepEqual(dataSource.items(), [tasks[0]], 'Items are OK');

                scheduler.instance.option('currentDate', new Date(2015, 2, 17));
                assert.deepEqual(dataSource.items(), [tasks[1]], 'Items are OK');

                scheduler.instance.option('currentView', 'week');
                assert.deepEqual(dataSource.items(), tasks, 'Items are OK');
            });

            test('Tasks should be filtered by start day hour before render', function(assert) {
                const tasks = [
                    { text: 'One', startDate: new Date(2015, 2, 16, 5), endDate: new Date(2015, 2, 16, 5, 30) },
                    { text: 'Two', startDate: new Date(2015, 2, 16, 2), endDate: new Date(2015, 2, 16, 2, 30) },
                    { text: 'Three', startDate: new Date(2015, 2, 17, 2), endDate: new Date(2015, 2, 17, 2, 30) },
                    { text: 'Five', startDate: new Date(2015, 2, 10, 6), endDate: new Date(2015, 2, 10, 6, 30) }
                ];
                const dataSource = new DataSource({
                    store: tasks
                });
                const scheduler = createInstance({
                    currentDate: new Date(2015, 2, 16),
                    dataSource: dataSource,
                    startDayHour: 4,
                    currentView: 'week'
                }, this.clock);

                let $appointments = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.equal($appointments.length, 1, 'There is only one appointment');
                assert.deepEqual(dataUtils.data($appointments[0], 'dxItemData'), tasks[0], 'Appointment data is OK');

                scheduler.instance.option('startDayHour', 1);
                $appointments = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.equal($appointments.length, 3, 'There are three appointments');
                assert.deepEqual(dataUtils.data($appointments.get(0), 'dxItemData'), tasks[0], 'Appointment data is OK');
                assert.deepEqual(dataUtils.data($appointments.get(1), 'dxItemData'), tasks[1], 'Appointment data is OK');
                assert.deepEqual(dataUtils.data($appointments.get(2), 'dxItemData'), tasks[2], 'Appointment data is OK');
            });

            test('Tasks should be filtered by end day hour before render', function(assert) {
                const tasks = [
                    { text: 'One', startDate: new Date(2015, 2, 16, 7), endDate: new Date(2015, 2, 16, 7, 30) },
                    { text: 'Two', startDate: new Date(2015, 2, 16, 11), endDate: new Date(2015, 2, 16, 11, 30) },
                    { text: 'Three', startDate: new Date(2015, 2, 16, 12), endDate: new Date(2015, 2, 16, 12, 30) },
                    { text: 'Five', startDate: new Date(2015, 2, 10, 15), endDate: new Date(2015, 2, 10, 15, 30) }
                ];

                const scheduler = createInstance({
                    currentDate: new Date(2015, 2, 16),
                    dataSource: tasks,
                    endDayHour: 10,
                    currentView: 'week',
                    height: 600
                }, this.clock);

                let $appointments = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.equal($appointments.length, 1, 'There is only one appointment');
                assert.deepEqual(dataUtils.data($appointments[0], 'dxItemData'), tasks[0], 'Appointment data is OK');

                scheduler.instance.option('endDayHour', 14);

                return asyncAssert(
                    assert,
                    () => {
                        $appointments = scheduler.instance.$element().find(`.${APPOINTMENT_CLASS}`);

                        assert.equal($appointments.length, 3, 'There are three appointments');

                        assert.deepEqual(dataUtils.data($appointments.get(0), 'dxItemData'), tasks[0], 'Appointment data is OK');
                        assert.deepEqual(dataUtils.data($appointments.get(1), 'dxItemData'), tasks[1], 'Appointment data is OK');
                        assert.deepEqual(dataUtils.data($appointments.get(2), 'dxItemData'), tasks[2], 'Appointment data is OK');
                    });
            });

            test('tasks should be filtered by resources before render', function(assert) {
                const tasks = [
                    { text: 'a', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: [1, 2] }, // false
                    { text: 'b', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2], managerId: 4 }, // true
                    { text: 'b', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 3, roomId: [1, 2] }, // false
                    { text: 'c', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2, 3] } // true
                ];
                const dataSource = new DataSource({
                    store: tasks
                });
                const scheduler = createInstance({
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
                }, this.clock);

                const $appointments = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.equal($appointments.length, 4, 'There are four appointment');
                assert.deepEqual(dataUtils.data($appointments.get(0), 'dxItemData'), tasks[1], 'The first appointment data is OK');
                assert.deepEqual(dataUtils.data($appointments.get(1), 'dxItemData'), tasks[1], 'The second appointment dat is OK');
                assert.deepEqual(dataUtils.data($appointments.get(2), 'dxItemData'), tasks[3], 'The first appointment data is OK');
                assert.deepEqual(dataUtils.data($appointments.get(3), 'dxItemData'), tasks[3], 'The second appointment dat is OK');
            });

            test('Tasks should be filtered by resources if dataSource is changed', function(assert) {
                const tasks = [
                    { text: 'a', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: [1, 2] }, // false
                    { text: 'b', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2], managerId: 4 }, // true
                    { text: 'b', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 3, roomId: [1, 2] }, // false
                    { text: 'c', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2, 3] } // true
                ];
                const dataSource = new DataSource({
                    store: tasks
                });
                const scheduler = createInstance({
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
                }, this.clock);

                scheduler.instance.option('dataSource', dataSource);

                const $appointments = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.equal($appointments.length, 4, 'There are four appointment');
                assert.deepEqual(dataUtils.data($appointments.get(0), 'dxItemData'), tasks[1], 'The first appointment data is OK');
                assert.deepEqual(dataUtils.data($appointments.get(1), 'dxItemData'), tasks[1], 'The second appointment dat is OK');
                assert.deepEqual(dataUtils.data($appointments.get(2), 'dxItemData'), tasks[3], 'The first appointment data is OK');
                assert.deepEqual(dataUtils.data($appointments.get(3), 'dxItemData'), tasks[3], 'The second appointment dat is OK');
            });

            test('Tasks should be filtered by resources if resources are changed', function(assert) {
                const tasks = [
                    { text: 'a', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: [1, 2] }, // false
                    { text: 'b', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2], managerId: 4 }, // true
                    { text: 'b', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 3, roomId: [1, 2] }, // false
                    { text: 'c', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2, 3] } // true
                ];
                const dataSource = new DataSource({
                    store: tasks
                });
                const scheduler = createInstance({
                    currentDate: new Date(2015, 2, 16),
                    dataSource: dataSource,
                    groups: ['ownerId', 'roomId']
                }, this.clock);

                scheduler.instance.option('resources', [
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

                const $appointments = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.equal($appointments.length, 4, 'There are four appointment');
                assert.deepEqual(dataUtils.data($appointments.get(0), 'dxItemData'), tasks[1], 'The first appointment data is OK');
                assert.deepEqual(dataUtils.data($appointments.get(1), 'dxItemData'), tasks[1], 'The second appointment data is OK');
                assert.deepEqual(dataUtils.data($appointments.get(2), 'dxItemData'), tasks[3], 'The first appointment data is OK');
                assert.deepEqual(dataUtils.data($appointments.get(3), 'dxItemData'), tasks[3], 'The second appointment data is OK');
            });

            test('Tasks should be filtered by resources if groups are changed', function(assert) {
                const tasks = [
                    { text: 'a', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: [1, 2] }, // false
                    { text: 'b', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2], managerId: 1 }, // true
                    { text: 'c', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 3, roomId: [1, 2] }, // false
                    { text: 'd', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2, 3] } // false
                ];
                const dataSource = new DataSource({
                    store: tasks
                });
                const scheduler = createInstance({
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
                }, this.clock);
                scheduler.instance.option('groups', ['ownerId', 'roomId', 'managerId']);
                const $appointments = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.equal($appointments.length, 2, 'There are two appointment');
                assert.deepEqual(dataUtils.data($appointments.get(0), 'dxItemData'), tasks[1], 'The first appointment data is OK');
                assert.deepEqual(dataUtils.data($appointments.get(1), 'dxItemData'), tasks[1], 'The second appointment data is OK');
            });

            test('Appointments should be filtered correctly by end day hour when current date was changed', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 4, 6),
                    currentView: 'week',
                    endDayHour: 10,
                    firstDayOfWeek: 1,
                    dataSource: [
                        {
                            startDate: new Date(2015, 4, 7, 11)
                        }
                    ]
                }, this.clock);

                let $appointments = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);
                assert.equal($appointments.length, 0, 'There are not appointments');

                scheduler.instance.option('currentDate', new Date(2015, 4, 7));

                $appointments = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);
                assert.equal($appointments.length, 0, 'There is one appointment');
            });
        });
    });
});
