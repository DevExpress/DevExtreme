import 'fluent_blue_light.css!';
import $ from 'jquery';

import {
    createWrapper,
    initTestMarkup,
    asyncScrollTest,
    asyncWrapper,
    isDesktopEnvironment,
} from '../../helpers/scheduler/helpers.js';

const {
    testStart,
    module
} = QUnit;

const test = (description, callback) => {
    const testFunc = !isDesktopEnvironment()
        ? QUnit.skip
        : QUnit.test;

    return testFunc(description, callback);
};
const printOffset = offset => [
    offset.x >= 0 ? `offset.x: ${offset.x}` : '',
    offset.y >= 0 ? `offset.y: ${offset.y}` : ''
].join(',');

testStart(() => initTestMarkup());

module('Virtual scrolling Month View', () => {
    module('Regular appointments', () => {
        test('Regular appointments should be rendered correctly if horizontal grouping', async function(assert) {
            const scheduler = await createWrapper({
                dataSource: [{
                    text: 'Test-S00',
                    startDate: new Date(2021, 0, 31, 16),
                    endDate: new Date(2021, 1, 3, 17, 30),
                    priority: [1, 3, 5, 7, 8]
                }],
                views: ['month'],
                currentView: 'month',
                currentDate: new Date(2021, 1, 1),
                groups: ['priority'],
                resources: [{
                    fieldExpr: 'priority',
                    allowMultiple: false,
                    dataSource: [
                        { id: 1, text: 'rc_001' },
                        { id: 2, text: 'rc_002' },
                        { id: 3, text: 'rc_003' },
                        { id: 4, text: 'rc_004' }
                    ]
                }],
                scrolling: {
                    mode: 'virtual',
                    orientation: 'both'
                },
                crossScrollingEnabled: true,
                width: 530,
                height: 600
            });

            const { instance } = scheduler;

            const scrollable = instance.getWorkSpaceScrollable();

            return asyncWrapper(assert, promise => {
                [
                    {
                        offset: { x: 0 },
                        expectedRects: [{
                            left: -9999,
                            top: -9859,
                            width: 300
                        }]
                    },
                    {
                        offset: { x: 1050 },
                        expectedRects: [{
                            left: -9999,
                            top: -9859,
                            width: 300
                        }]
                    },
                    {
                        offset: { x: 2100 },
                        expectedRects: [{
                            left: -10371,
                            top: -9859,
                            width: 150
                        }]
                    }
                ].forEach(({ offset, expectedRects }) => {
                    promise = asyncScrollTest(
                        assert,
                        promise,
                        () => {
                            assert.ok(true, printOffset(offset));

                            const { appointments } = scheduler;

                            assert.equal(expectedRects.length, appointments.getAppointmentCount(), 'Appointment amount is correct');

                            expectedRects.forEach((expectedRect, index) => {
                                const appointmentRect = appointments
                                    .getAppointment(index)
                                    .get(0)
                                    .getBoundingClientRect();

                                assert.roughEqual(appointmentRect.left, expectedRect.left, 2.01, 'appointment left is correct');
                                assert.roughEqual(appointmentRect.top, expectedRect.top, 2.01, 'appointment top is correct');
                                assert.roughEqual(appointmentRect.width, expectedRect.width, 2.01, 'appointment width is correct');
                            });
                        },
                        scrollable,
                        offset);
                });

                return promise;
            });
        });

        test('Regular appointments should be rendered correctly if vertical grouping', async function(assert) {
            const scheduler = await createWrapper({
                dataSource: [{
                    text: 'Test-S00',
                    startDate: new Date(2021, 0, 31, 16),
                    endDate: new Date(2021, 1, 3, 17, 30),
                    priority: [1, 3, 5, 7, 8]
                }],
                views: [{
                    type: 'month',
                    groupOrientation: 'vertical'
                }],
                currentView: 'month',
                currentDate: new Date(2021, 1, 1),
                groups: ['priority'],
                resources: [{
                    fieldExpr: 'priority',
                    allowMultiple: false,
                    dataSource: [
                        { id: 1, text: 'rc_001' },
                        { id: 2, text: 'rc_002' },
                        { id: 3, text: 'rc_003' },
                        { id: 4, text: 'rc_004' }
                    ]
                }],
                scrolling: {
                    mode: 'virtual',
                    orientation: 'both'
                },
                width: 530,
                height: 600
            });

            const { instance } = scheduler;

            const scrollable = instance.getWorkSpaceScrollable();

            return asyncWrapper(assert, promise => {
                [
                    {
                        offset: { y: 0 },
                        expectedRects: [{
                            left: -9934,
                            top: -9889,
                            width: 300
                        }]
                    },
                    {
                        offset: { y: 900 },
                        expectedRects: [{
                            left: -9934,
                            top: -9589,
                            width: 300
                        }]
                    },
                    {
                        offset: { y: 1800 },
                        expectedRects: []
                    }
                ].forEach(({ offset, expectedRects }) => {
                    promise = asyncScrollTest(
                        assert,
                        promise,
                        () => {
                            assert.ok(true, printOffset(offset));

                            const { appointments } = scheduler;

                            assert.equal(expectedRects.length, appointments.getAppointmentCount(), 'Appointment amount is correct');

                            expectedRects.forEach((expectedRect, index) => {
                                const appointmentRect = appointments
                                    .getAppointment(index)
                                    .get(0)
                                    .getBoundingClientRect();

                                assert.roughEqual(appointmentRect.left, expectedRect.left, 2.01, 'appointment left is correct');
                                assert.roughEqual(appointmentRect.top, expectedRect.top, 2.01, 'appointment top is correct');
                                assert.roughEqual(appointmentRect.width, expectedRect.width, 2.01, 'appointment width is correct');
                            });
                        },
                        scrollable,
                        offset);
                });

                return promise;
            });
        });

        test('Multi week regular appointment should be rendered correctly if horizontal grouping', async function(assert) {
            const scheduler = await createWrapper({
                dataSource: [{
                    text: 'Test-L00',
                    startDate: new Date(2021, 1, 1, 16),
                    endDate: new Date(2021, 1, 26, 17, 30),
                    priority: [1, 3]
                }],
                views: [{
                    type: 'month',
                    intervalCount: 36
                }],
                currentView: 'month',
                currentDate: new Date(2021, 1, 1),
                groups: ['priority'],
                resources: [{
                    fieldExpr: 'priority',
                    allowMultiple: false,
                    dataSource: [
                        { id: 1, text: 'rc_001' },
                        { id: 2, text: 'rc_002' },
                        { id: 3, text: 'rc_003' },
                        { id: 4, text: 'rc_004' }
                    ]
                }],
                scrolling: {
                    mode: 'virtual',
                    orientation: 'both'
                },
                crossScrollingEnabled: true,
                width: 530,
                height: 600
            });

            const { instance } = scheduler;

            const scrollable = instance.getWorkSpaceScrollable();

            return asyncWrapper(assert, promise => {
                [
                    {
                        offset: { x: 0 },
                        expectedRects: [{
                            left: -9924,
                            top: -9859,
                            width: 450
                        }, {
                            left: -9999,
                            top: -9759,
                            width: 525
                        }, {
                            left: -9999,
                            top: -9659,
                            width: 525
                        }, {
                            left: -9999,
                            top: -9559,
                            width: 450
                        }]
                    },
                    {
                        offset: { x: 700 },
                        expectedRects: [{
                            left: -10324,
                            top: -9859,
                            width: 150
                        }, {
                            left: -10324,
                            top: -9759,
                            width: 150
                        }, {
                            left: -10324,
                            top: -9659,
                            width: 150
                        }, {
                            left: -10324,
                            top: -9559,
                            width: 75
                        }, {
                            left: -9574,
                            top: -9859,
                            width: 450
                        }, {
                            left: -9649,
                            top: -9759,
                            width: 525
                        }, {
                            left: -9649,
                            top: -9659,
                            width: 525
                        }, {
                            left: -9649,
                            top: -9559,
                            width: 450
                        }]
                    },
                    {
                        offset: { x: 1050 },
                        expectedRects: [{
                            left: -9924,
                            top: -9859,
                            width: 450
                        }, {
                            left: -9999,
                            top: -9759,
                            width: 525
                        }, {
                            left: -9999,
                            top: -9659,
                            width: 525
                        }, {
                            left: -9999,
                            top: -9559,
                            width: 450
                        }]
                    },
                    {
                        offset: { x: 1400 },
                        expectedRects: [{
                            left: -10274,
                            top: -9859,
                            width: 450
                        }, {
                            left: -10349,
                            top: -9759,
                            width: 525
                        }, {
                            left: -10349,
                            top: -9659,
                            width: 525
                        }, {
                            left: -10349,
                            top: -9559,
                            width: 450
                        }]
                    }
                ].forEach(({ offset, expectedRects }) => {
                    promise = asyncScrollTest(
                        assert,
                        promise,
                        () => {
                            assert.ok(true, printOffset(offset));

                            const { appointments } = scheduler;

                            assert.equal(expectedRects.length, appointments.getAppointmentCount(), 'Appointment amount is correct');

                            expectedRects.forEach((expectedRect, index) => {
                                const appointmentRect = appointments
                                    .getAppointment(index)
                                    .get(0)
                                    .getBoundingClientRect();

                                assert.roughEqual(appointmentRect.left, expectedRect.left, 2.01, `appointment#${index} left is correct`);
                                assert.roughEqual(appointmentRect.top, expectedRect.top, 2.01, `appointment#${index} top is correct`);
                                assert.roughEqual(appointmentRect.width, expectedRect.width, 2.01, `appointment#${index} width is correct`);
                            });
                        },
                        scrollable,
                        offset);
                });

                return promise;
            });
        });

        test('Multi week regular appointment should be rendered correctly if vertical grouping', async function(assert) {
            const scheduler = await createWrapper({
                dataSource: [{
                    text: 'Test-L00',
                    startDate: new Date(2021, 1, 17, 16),
                    endDate: new Date(2021, 2, 10, 17, 30),
                    priority: [1, 3]
                }],
                views: [{
                    type: 'month',
                    groupOrientation: 'vertical'
                }],
                currentView: 'month',
                currentDate: new Date(2021, 1, 1),
                groups: ['priority'],
                resources: [{
                    fieldExpr: 'priority',
                    allowMultiple: false,
                    dataSource: [
                        { id: 1, text: 'rc_001' },
                        { id: 2, text: 'rc_002' },
                        { id: 3, text: 'rc_003' },
                        { id: 4, text: 'rc_004' }
                    ]
                }],
                scrolling: {
                    mode: 'virtual',
                    orientation: 'both'
                },
                crossScrollingEnabled: true,
                width: 630,
                height: 560
            });

            const { instance } = scheduler;

            const scrollable = instance.getWorkSpaceScrollable();

            return asyncWrapper(assert, promise => {
                [
                    {
                        offset: { y: 0 },
                        expectedRects: [{
                            left: -9693,
                            top: -9689,
                            width: 322
                        }, {
                            left: -9934,
                            top: -9589,
                            width: 563
                        }, {
                            left: -9934,
                            top: -9489,
                            width: 563
                        }, {
                            left: -9934,
                            top: -9389,
                            width: 322
                        }]
                    },
                    {
                        offset: { y: 350 },
                        expectedRects: [{
                            left: -9693,
                            top: -10039,
                            width: 322
                        }, {
                            left: -9934,
                            top: -9939,
                            width: 563
                        }, {
                            left: -9934,
                            top: -9839,
                            width: 563
                        }, {
                            left: -9934,
                            top: -9739,
                            width: 322
                        }]
                    },
                    {
                        offset: { y: 1000 },
                        expectedRects: [{
                            left: -9693,
                            top: -9489,
                            width: 322
                        }, {
                            left: -9934,
                            top: -9389,
                            width: 563
                        }, {
                            left: -9934,
                            top: -9289,
                            width: 563
                        }, {
                            left: -9934,
                            top: -9189,
                            width: 322
                        }]
                    }
                ].forEach(({ offset, expectedRects }) => {
                    promise = asyncScrollTest(
                        assert,
                        promise,
                        () => {
                            assert.ok(true, printOffset(offset));

                            const { appointments } = scheduler;

                            assert.equal(expectedRects.length, appointments.getAppointmentCount(), 'Appointment amount is correct');

                            expectedRects.forEach((expectedRect, index) => {
                                const appointmentRect = appointments
                                    .getAppointment(index)
                                    .get(0)
                                    .getBoundingClientRect();

                                assert.roughEqual(appointmentRect.left, expectedRect.left, 2.01, `appointment#${index} left is correct`);
                                assert.roughEqual(appointmentRect.top, expectedRect.top, 2.01, `appointment#${index} top is correct`);
                                assert.roughEqual(appointmentRect.width, expectedRect.width, 2.01, `appointment#${index} width is correct`);
                            });
                        },
                        scrollable,
                        offset);
                });

                return promise;
            });
        });

        module('Group by date', () => {
            test('Regular appointment should be rendered correctly if grouped by date', async function(assert) {
                const resources = [{
                    id: 0,
                    text: 'David Carter',
                    color: '#74d57b'
                }, {
                    id: 1,
                    text: 'Emma Lewis',
                    color: '#1db2f5'
                }, {
                    id: 2,
                    text: 'Noah Hill',
                    color: '#f5564a'
                }, {
                    id: 3,
                    text: 'William Bell',
                    color: '#97c95c'
                }];
                const appointment = {
                    text: 'Test',
                    startDate: new Date('2021-02-26T12:16:00.000Z'),
                    endDate: new Date('2021-02-26T15:36:00.000Z'),
                    humanId: 1
                };
                const scheduler = await createWrapper({
                    width: 400,
                    currentDate: new Date(2021, 1, 2),
                    dataSource: [appointment],
                    views: ['month'],
                    currentView: 'month',
                    scrolling: {
                        mode: 'virtual'
                    },
                    groups: ['humanId'],
                    groupByDate: true,
                    resources: [{
                        fieldExpr: 'humanId',
                        allowMultiple: false,
                        dataSource: resources
                    }]
                });

                const { instance } = scheduler;
                const workspace = instance.getWorkSpace();
                const scrollable = workspace.getScrollable();

                workspace.renderer.getRenderTimeout = () => -1;

                return asyncWrapper(assert, promise => {
                    [{
                        scrollX: 1066,
                        expectedSettings: {
                            left: -9490,
                            top: -9559,
                            width: 75,
                        }
                    }, {
                        scrollX: 1300,
                        expectedSettings: {
                            left: -9724,
                            top: -9559,
                            width: 75,
                        }
                    }].forEach(({ scrollX, expectedSettings }) => {
                        promise = asyncScrollTest(
                            assert,
                            promise,
                            () => {
                                const appointmentRect = scheduler.appointments
                                    .getAppointment(0)
                                    .get(0)
                                    .getBoundingClientRect();

                                assert.roughEqual(appointmentRect.left, expectedSettings.left, 2.01, 'appointment left is correct');
                                assert.roughEqual(appointmentRect.top, expectedSettings.top, 2.01, 'appointment top is correct');
                                assert.roughEqual(appointmentRect.width, expectedSettings.width, 2.01, 'appointment width is correct');
                            },
                            scrollable,
                            { left: scrollX }
                        );
                    });

                    return promise;
                });
            });
        });
    });

    module('Recurrent appointments', () => {
        test('Regular recurrent appointment should be rendered correctly if horizontal grouping', async function(assert) {
            const scheduler = await createWrapper({
                dataSource: [{
                    text: 'Test-REC00',
                    startDate: new Date(2021, 1, 1, 16),
                    endDate: new Date(2021, 1, 1, 17, 30),
                    recurrenceRule: 'FREQ=WEEKLY;INTERVAL=2',
                    priority: [1, 3]
                }],
                views: ['month'],
                currentView: 'month',
                currentDate: new Date(2021, 1, 1),
                groups: ['priority'],
                resources: [{
                    fieldExpr: 'priority',
                    allowMultiple: false,
                    dataSource: [
                        { id: 1, text: 'rc_001' },
                        { id: 2, text: 'rc_002' },
                        { id: 3, text: 'rc_003' },
                        { id: 4, text: 'rc_004' },
                        { id: 5, text: 'rc_005' }
                    ]
                }],
                scrolling: {
                    mode: 'virtual',
                    orientation: 'both'
                },
                crossScrollingEnabled: true,
                width: 530,
                height: 600
            });

            const { instance } = scheduler;

            const scrollable = instance.getWorkSpaceScrollable();

            return asyncWrapper(assert, promise => {
                [
                    {
                        offset: { x: 0 },
                        expectedRects: [{
                            left: -9924,
                            top: -9859,
                            width: 75
                        }, {
                            left: -9924,
                            top: -9659,
                            width: 75
                        }, {
                            left: -9924,
                            top: -9459,
                            width: 75
                        }]
                    },
                    {
                        offset: { x: 1050 },
                        expectedRects: [{
                            left: -9924,
                            top: -9859,
                            width: 75
                        }, {
                            left: -9924,
                            top: -9659,
                            width: 75
                        }, {
                            left: -9924,
                            top: -9459,
                            width: 75
                        }]
                    },
                    {
                        offset: { x: 2100 },
                        expectedRects: []
                    }
                ].forEach(({ offset, expectedRects }) => {
                    promise = asyncScrollTest(
                        assert,
                        promise,
                        () => {
                            assert.ok(true, printOffset(offset));

                            const { appointments } = scheduler;

                            assert.equal(expectedRects.length, appointments.getAppointmentCount(), 'Appointment amount is correct');

                            expectedRects.forEach((expectedRect, index) => {
                                const appointmentRect = appointments
                                    .getAppointment(index)
                                    .get(0)
                                    .getBoundingClientRect();

                                assert.roughEqual(appointmentRect.left, expectedRect.left, 2.01, 'appointment left is correct');
                                assert.roughEqual(appointmentRect.top, expectedRect.top, 2.01, 'appointment top is correct');
                                assert.roughEqual(appointmentRect.width, expectedRect.width, 2.01, 'appointment width is correct');
                            });
                        },
                        scrollable,
                        offset);
                });

                return promise;
            });
        });

        test('Regular recurrent appointment should be rendered correctly if vertical grouping', async function(assert) {
            const scheduler = await createWrapper({
                dataSource: [{
                    text: 'Test-REC00',
                    startDate: new Date(2021, 1, 1, 16),
                    endDate: new Date(2021, 1, 1, 17, 30),
                    recurrenceRule: 'FREQ=WEEKLY;INTERVAL=2',
                    priority: [1, 3]
                }],
                views: [{
                    type: 'month',
                    groupOrientation: 'vertical'
                }],
                currentView: 'month',
                currentDate: new Date(2021, 1, 1),
                groups: ['priority'],
                resources: [{
                    fieldExpr: 'priority',
                    allowMultiple: false,
                    dataSource: [
                        { id: 1, text: 'rc_001' },
                        { id: 2, text: 'rc_002' },
                        { id: 3, text: 'rc_003' },
                        { id: 4, text: 'rc_004' }
                    ]
                }],
                scrolling: {
                    mode: 'virtual',
                    orientation: 'both'
                },
                crossScrollingEnabled: true,
                width: 530,
                height: 560
            });

            const { instance } = scheduler;

            const scrollable = instance.getWorkSpaceScrollable();

            return asyncWrapper(assert, promise => {
                [
                    {
                        offset: { y: 0 },
                        expectedRects: [{
                            left: -9859,
                            top: -9889,
                            width: 75
                        }, {
                            left: -9859,
                            top: -9689,
                            width: 75
                        }, {
                            left: -9859,
                            top: -9489,
                            width: 75
                        }]
                    },
                    {
                        offset: { y: 900 },
                        expectedRects: [{
                            left: -9859,
                            top: -9589,
                            width: 75
                        }, {
                            left: -9859,
                            top: -9389,
                            width: 75
                        }, {
                            left: -9859,
                            top: -9189,
                            width: 75
                        }]
                    }
                ].forEach(({ offset, expectedRects }) => {
                    promise = asyncScrollTest(
                        assert,
                        promise,
                        () => {
                            assert.ok(true, printOffset(offset));

                            const { appointments } = scheduler;

                            assert.equal(expectedRects.length, appointments.getAppointmentCount(), 'Appointment amount is correct');

                            expectedRects.forEach((expectedRect, index) => {
                                const appointmentRect = appointments
                                    .getAppointment(index)
                                    .get(0)
                                    .getBoundingClientRect();

                                assert.roughEqual(appointmentRect.left, expectedRect.left, 2.01, 'appointment left is correct');
                                assert.roughEqual(appointmentRect.top, expectedRect.top, 2.01, 'appointment top is correct');
                                assert.roughEqual(appointmentRect.width, expectedRect.width, 2.01, 'appointment width is correct');
                            });
                        },
                        scrollable,
                        offset);
                });

                return promise;
            });
        });

        test('Multi week recurrent appointment should be rendered correctly if horizontal grouping', async function(assert) {
            const scheduler = await createWrapper({
                dataSource: [{
                    text: 'Test-R00',
                    startDate: new Date(2021, 1, 1, 16),
                    endDate: new Date(2021, 1, 24, 17, 30),
                    recurrenceRule: 'FREQ=MONTHLY;INTERVAL=2',
                    priority: [1, 3]
                }],
                views: [{
                    type: 'month',
                }],
                currentView: 'month',
                currentDate: new Date(2021, 1, 1),
                groups: ['priority'],
                resources: [{
                    fieldExpr: 'priority',
                    allowMultiple: false,
                    dataSource: [
                        { id: 1, text: 'rc_001' },
                        { id: 2, text: 'rc_002' },
                        { id: 3, text: 'rc_003' },
                        { id: 4, text: 'rc_004' }
                    ]
                }],
                scrolling: {
                    mode: 'virtual',
                    orientation: 'both'
                },
                crossScrollingEnabled: true,
                width: 530,
                height: 560
            });

            const { instance } = scheduler;

            const scrollable = instance.getWorkSpaceScrollable();

            return asyncWrapper(assert, promise => {
                [
                    {
                        offset: { x: 0 },
                        expectedRects: [{
                            left: -9924,
                            top: -9859,
                            width: 450
                        }, {
                            left: -9999,
                            top: -9759,
                            width: 525
                        }, {
                            left: -9999,
                            top: -9659,
                            width: 525
                        }, {
                            left: -9999,
                            top: -9559,
                            width: 300
                        }]
                    },
                    {
                        offset: { x: 1050 },
                        expectedRects: [{
                            left: -9924,
                            top: -9859,
                            width: 450
                        }, {
                            left: -9999,
                            top: -9759,
                            width: 525
                        }, {
                            left: -9999,
                            top: -9659,
                            width: 525
                        }, {
                            left: -9999,
                            top: -9559,
                            width: 300
                        }]
                    },
                    {
                        offset: { x: 1300 },
                        expectedRects: [{
                            left: -10174,
                            top: -9859,
                            width: 450
                        }, {
                            left: -10249,
                            top: -9759,
                            width: 525
                        }, {
                            left: -10249,
                            top: -9659,
                            width: 525
                        }, {
                            left: -10249,
                            top: -9559,
                            width: 300
                        }]
                    }
                ].forEach(({ offset, expectedRects }) => {
                    promise = asyncScrollTest(
                        assert,
                        promise,
                        () => {
                            assert.ok(true, printOffset(offset));

                            const { appointments } = scheduler;

                            assert.equal(expectedRects.length, appointments.getAppointmentCount(), 'Appointment amount is correct');

                            expectedRects.forEach((expectedRect, index) => {
                                const appointmentRect = appointments
                                    .getAppointment(index)
                                    .get(0)
                                    .getBoundingClientRect();

                                assert.roughEqual(appointmentRect.left, expectedRect.left, 2.01, `appointment#${index} left is correct`);
                                assert.roughEqual(appointmentRect.top, expectedRect.top, 2.01, `appointment#${index} top is correct`);
                                assert.roughEqual(appointmentRect.width, expectedRect.width, 2.01, `appointment#${index} width is correct`);
                            });
                        },
                        scrollable,
                        offset);
                });

                return promise;
            });
        });

        test('Multi week recurrent appointment should be rendered correctly if vertical grouping', async function(assert) {
            const scheduler = await createWrapper({
                dataSource: [{
                    text: 'Test-R00',
                    startDate: new Date(2021, 1, 1, 16),
                    endDate: new Date(2021, 1, 24, 17, 30),
                    recurrenceRule: 'FREQ=MONTHLY;INTERVAL=2',
                    priority: [1, 3]
                }],
                views: [{
                    type: 'month',
                    groupOrientation: 'vertical'
                }],
                currentView: 'month',
                currentDate: new Date(2021, 1, 1),
                groups: ['priority'],
                resources: [{
                    fieldExpr: 'priority',
                    allowMultiple: false,
                    dataSource: [
                        { id: 1, text: 'rc_001' },
                        { id: 2, text: 'rc_002' },
                        { id: 3, text: 'rc_003' },
                        { id: 4, text: 'rc_004' }
                    ]
                }],
                scrolling: {
                    mode: 'virtual',
                    orientation: 'both'
                },
                crossScrollingEnabled: true,
                width: 630,
                height: 560
            });

            const { instance } = scheduler;

            const scrollable = instance.getWorkSpaceScrollable();

            return asyncWrapper(assert, promise => {
                [
                    {
                        offset: { y: 0 },
                        expectedRects: [{
                            left: -9853,
                            top: -9889,
                            width: 482
                        }, {
                            left: -9934,
                            top: -9789,
                            width: 562
                        }, {
                            left: -9934,
                            top: -9689,
                            width: 562
                        }, {
                            left: -9934,
                            top: -9589,
                            width: 321
                        }]
                    },
                    {
                        offset: { y: 900 },
                        expectedRects: [{
                            left: -9853,
                            top: -9589,
                            width: 482
                        }, {
                            left: -9934,
                            top: -9489,
                            width: 562
                        }, {
                            left: -9934,
                            top: -9389,
                            width: 562
                        }, {
                            left: -9934,
                            top: -9289,
                            width: 321
                        }]
                    },
                    {
                        offset: { y: 1100 },
                        expectedRects: [{
                            left: -9853,
                            top: -9789,
                            width: 482
                        }, {
                            left: -9934,
                            top: -9689,
                            width: 562
                        }, {
                            left: -9934,
                            top: -9589,
                            width: 562
                        }, {
                            left: -9934,
                            top: -9489,
                            width: 321
                        }]
                    }
                ].forEach(({ offset, expectedRects }) => {
                    promise = asyncScrollTest(
                        assert,
                        promise,
                        () => {
                            assert.ok(true, printOffset(offset));

                            const { appointments } = scheduler;

                            assert.equal(expectedRects.length, appointments.getAppointmentCount(), 'Appointment amount is correct');

                            expectedRects.forEach((expectedRect, index) => {
                                const appointmentRect = appointments
                                    .getAppointment(index)
                                    .get(0)
                                    .getBoundingClientRect();

                                assert.roughEqual(appointmentRect.left, expectedRect.left, 2.01, `appointment#${index} left is correct`);
                                assert.roughEqual(appointmentRect.top, expectedRect.top, 2.01, `appointment#${index} top is correct`);
                                assert.roughEqual(appointmentRect.width, expectedRect.width, 2.01, `appointment#${index} width is correct`);
                            });
                        },
                        scrollable,
                        offset);
                });

                return promise;
            });
        });

        test('Long appointments should be rendered correctly when style is custom', async function(assert) {
            const $style = $('<style>');
            const styleBefore = $style.text();

            $style
                .text('#scheduler .dx-scheduler-cell-sizes-horizontal { width: 150px } ')
                .appendTo('head');

            const scheduler = await createWrapper({
                height: 600,
                currentDate: new Date(2021, 1, 2),
                dataSource: [{
                    startDate: new Date(2021, 1, 7, 8),
                    endDate: new Date(2021, 1, 20, 20),
                    priority: 1
                }],
                views: [
                    {
                        type: 'timelineWorkWeek',
                        name: 'Timeline',
                        groupOrientation: 'vertical'
                    },
                    {
                        type: 'workWeek',
                        groupOrientation: 'vertical'
                    },
                    {
                        type: 'month',
                        groupOrientation: 'horizontal'
                    }
                ],
                currentView: 'month',
                startDayHour: 8,
                endDayHour: 20,
                scrolling: {
                    mode: 'virtual'
                },
                showAllDayPanel: false,
                groups: ['priority'],
                resources: [{
                    fieldExpr: 'priority',
                    allowMultiple: false,
                    dataSource: [
                        { id: 1, text: 'rc_001' },
                        { id: 2, text: 'rc_002' },
                        { id: 3, text: 'rc_003' },
                        { id: 4, text: 'rc_004' }
                    ]
                }],
                width: 400,
            });

            const appointmentCount = scheduler.appointmentList.length;

            assert.equal(appointmentCount, 2, 'Correct number of long appointment parts');

            $style.text(styleBefore);
        });
    });
});
