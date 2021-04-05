import 'generic_light.css!';

import dateUtils from 'core/utils/date';
import {
    createWrapper,
    initTestMarkup,
    asyncScrollTest,
    asyncWrapper,
    isDesktopEnvironment,
    isIE11
} from '../../helpers/scheduler/helpers.js';

const {
    testStart,
    module
} = QUnit;

const test = (description, callback) => {
    const testFunc = isIE11 || !isDesktopEnvironment()
        ? QUnit.skip
        : QUnit.test;

    return testFunc(description, sinon.test(callback));
};
const printOffset = offset => [
    offset.x >= 0 ? `offset.x: ${offset.x}` : '',
    offset.y >= 0 ? `offset.y: ${offset.y}` : ''
].join(',');

testStart(() => initTestMarkup());

module('Virtual scrolling Month View', () => {
    module('Regular appointments', () => {
        test('Regular appointments should be rendered correctly if horizontal grouping', function(assert) {
            const scheduler = createWrapper({
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
                            top: -9837,
                            width: 300
                        }]
                    },
                    {
                        offset: { x: 1050 },
                        expectedRects: [{
                            left: -9999,
                            top: -9837,
                            width: 300
                        }]
                    },
                    {
                        offset: { x: 2100 },
                        expectedRects: [{
                            left: -10371,
                            top: -9837,
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

        test('Regular appointments should be rendered correctly if vertical grouping', function(assert) {
            const scheduler = createWrapper({
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
                            left: -9899,
                            top: -9866,
                            width: 300
                        }]
                    },
                    {
                        offset: { y: 900 },
                        expectedRects: [{
                            left: -9899,
                            top: -9866,
                            width: 300
                        }]
                    },
                    {
                        offset: { y: 1800 },
                        expectedRects: [{
                            left: -9899,
                            top: -10274,
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

        test('Multi week regular appointment should be rendered correctly if horizontal grouping', function(assert) {
            const scheduler = createWrapper({
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
                            top: -9837,
                            width: 450
                        }, {
                            left: -9999,
                            top: -9762,
                            width: 525
                        }, {
                            left: -9999,
                            top: -9687,
                            width: 525
                        }, {
                            left: -9999,
                            top: -9612,
                            width: 450
                        }]
                    },
                    {
                        offset: { x: 700 },
                        expectedRects: [{
                            left: -10324,
                            top: -9837,
                            width: 150
                        }, {
                            left: -10324,
                            top: -9762,
                            width: 150
                        }, {
                            left: -10324,
                            top: -9687,
                            width: 150
                        }, {
                            left: -10324,
                            top: -9612,
                            width: 75
                        }, {
                            left: -9574,
                            top: -9837,
                            width: 450
                        }, {
                            left: -9649,
                            top: -9762,
                            width: 525
                        }, {
                            left: -9649,
                            top: -9687,
                            width: 525
                        }, {
                            left: -9649,
                            top: -9612,
                            width: 450
                        }]
                    },
                    {
                        offset: { x: 1050 },
                        expectedRects: [{
                            left: -9924,
                            top: -9837,
                            width: 450
                        }, {
                            left: -9999,
                            top: -9762,
                            width: 525
                        }, {
                            left: -9999,
                            top: -9687,
                            width: 525
                        }, {
                            left: -9999,
                            top: -9612,
                            width: 450
                        }]
                    },
                    {
                        offset: { x: 1400 },
                        expectedRects: [{
                            left: -10274,
                            top: -9837,
                            width: 450
                        }, {
                            left: -10349,
                            top: -9762,
                            width: 525
                        }, {
                            left: -10349,
                            top: -9687,
                            width: 525
                        }, {
                            left: -10349,
                            top: -9612,
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

        test('Multi week regular appointment should be rendered correctly if vertical grouping', function(assert) {
            const scheduler = createWrapper({
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
                            left: -9674,
                            top: -9716,
                            width: 303
                        }, {
                            left: -9899,
                            top: -9641,
                            width: 528
                        }, {
                            left: -9899,
                            top: -9566,
                            width: 528
                        }, {
                            left: -9899,
                            top: -9491,
                            width: 300
                        }]
                    },
                    {
                        offset: { y: 350 },
                        expectedRects: [{
                            left: -9674,
                            top: -10066,
                            width: 303
                        }, {
                            left: -9899,
                            top: -9991,
                            width: 528
                        }, {
                            left: -9899,
                            top: -9916,
                            width: 528
                        }, {
                            left: -9899,
                            top: -9841,
                            width: 300
                        }]
                    },
                    {
                        offset: { y: 1000 },
                        expectedRects: [{
                            left: -9674,
                            top: -9816,
                            width: 303
                        }, {
                            left: -9899,
                            top: -9741,
                            width: 528
                        }, {
                            left: -9899,
                            top: -9666,
                            width: 528
                        }, {
                            left: -9899,
                            top: -9591,
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

        ['horizontal', 'vertical'].forEach(groupOrientation => {
            test(`Appointment should be correctly croped if Month view  and "${groupOrientation}" group orientation`, function(assert) {
                const longAppointment = {
                    startDate: new Date(2015, 2, 4, 0, 10),
                    endDate: new Date(2015, 2, 4, 23, 50)
                };
                const scheduler = createWrapper({
                    currentDate: new Date(2015, 2, 4),
                    scrolling: {
                        mode: 'virtual'
                    },
                    views: [{
                        type: 'month',
                        groupOrientation: groupOrientation
                    }],
                    currentView: 'month',
                    dataSource: [longAppointment],
                    height: 400
                });

                const { instance } = scheduler;
                const workspace = instance.getWorkSpace();
                const { viewDataProvider } = workspace;
                const scrollable = workspace.getScrollable();

                workspace.virtualScrollingDispatcher.renderer.getRenderTimeout = () => -1;

                return asyncWrapper(assert, promise => {
                    [
                        1000, 1050, 1100, 1200, 1250, 1300, 1350, 1400, 1500, 2000
                    ].forEach(scrollY => {
                        promise = asyncScrollTest(
                            assert,
                            promise,
                            () => {
                                const settings = instance.fire('createAppointmentSettings', longAppointment)[0];

                                assert.equal(
                                    settings.groupIndex,
                                    0,
                                    `group index is correct when scrolled to ${scrollY}`
                                );

                                const startViewDate = viewDataProvider.findGroupCellStartDate(
                                    settings.groupIndex,
                                    settings.info.appointment.startDate,
                                    settings.info.appointment.endDate
                                );

                                assert.deepEqual(
                                    dateUtils.trimTime(settings.info.appointment.startDate),
                                    startViewDate,
                                    'start date is correct'
                                );
                            },
                            scrollable,
                            { y: scrollY }
                        );
                    });

                    return promise;
                });
            });
        });
    });

    module('Recurrent appointments', () => {
        test('Regular recurrent appointment should be rendered correctly if horizontal grouping', function(assert) {
            const scheduler = createWrapper({
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
                            top: -9837,
                            width: 75
                        }, {
                            left: -9924,
                            top: -9681,
                            width: 75
                        }, {
                            left: -9924,
                            top: -9527,
                            width: 75
                        }]
                    },
                    {
                        offset: { x: 1050 },
                        expectedRects: [{
                            left: -9924,
                            top: -9837,
                            width: 75
                        }, {
                            left: -9924,
                            top: -9681,
                            width: 75
                        }, {
                            left: -9924,
                            top: -9527,
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

        test('Regular recurrent appointment should be rendered correctly if vertical grouping', function(assert) {
            const scheduler = createWrapper({
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
                            left: -9824,
                            top: -9866,
                            width: 75
                        }, {
                            left: -9824,
                            top: -9716,
                            width: 75
                        }, {
                            left: -9824,
                            top: -9566,
                            width: 75
                        }]
                    },
                    {
                        offset: { y: 900 },
                        expectedRects: [{
                            left: -9824,
                            top: -9866,
                            width: 75
                        }, {
                            left: -9824,
                            top: -9716,
                            width: 75
                        }, {
                            left: -9824,
                            top: -9566,
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

        test('Multi week recurrent appointment should be rendered correctly if horizontal grouping', function(assert) {
            const scheduler = createWrapper({
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
                            top: -9837,
                            width: 450
                        }, {
                            left: -9999,
                            top: -9766,
                            width: 525
                        }, {
                            left: -9999,
                            top: -9695,
                            width: 525
                        }, {
                            left: -9999,
                            top: -9624,
                            width: 301
                        }]
                    },
                    {
                        offset: { x: 1050 },
                        expectedRects: [{
                            left: -9924,
                            top: -9837,
                            width: 450
                        }, {
                            left: -9999,
                            top: -9766,
                            width: 525
                        }, {
                            left: -9999,
                            top: -9695,
                            width: 525
                        }, {
                            left: -9999,
                            top: -9624,
                            width: 301
                        }]
                    },
                    {
                        offset: { x: 1300 },
                        expectedRects: [{
                            left: -10174,
                            top: -9837,
                            width: 450
                        }, {
                            left: -10249,
                            top: -9766,
                            width: 525
                        }, {
                            left: -10249,
                            top: -9695,
                            width: 525
                        }, {
                            left: -10249,
                            top: -9624,
                            width: 301
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

        test('Multi week recurrent appointment should be rendered correctly if vertical grouping', function(assert) {
            const scheduler = createWrapper({
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
                            left: -9824,
                            top: -9866,
                            width: 453
                        }, {
                            left: -9899,
                            top: -9791,
                            width: 528
                        }, {
                            left: -9899,
                            top: -9716,
                            width: 528
                        }, {
                            left: -9899,
                            top: -9641,
                            width: 301
                        }]
                    },
                    {
                        offset: { y: 900 },
                        expectedRects: [{
                            left: -9824,
                            top: -9866,
                            width: 453
                        }, {
                            left: -9899,
                            top: -9791,
                            width: 528
                        }, {
                            left: -9899,
                            top: -9716,
                            width: 528
                        }, {
                            left: -9899,
                            top: -9641,
                            width: 301
                        }]
                    },
                    {
                        offset: { y: 1100 },
                        expectedRects: [{
                            left: -9824,
                            top: -10066,
                            width: 453
                        }, {
                            left: -9899,
                            top: -9991,
                            width: 528
                        }, {
                            left: -9899,
                            top: -9916,
                            width: 528
                        }, {
                            left: -9899,
                            top: -9841,
                            width: 301
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
    });
});
