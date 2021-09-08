import 'generic_light.css!';

import {
    createWrapper,
    initTestMarkup,
    isDesktopEnvironment,
    asyncScrollTest,
    asyncWrapper,
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

module('Virtual scrolling timelines', () => {
    module('Appointments', () => {
        module('timelineDay', () => {
            test('multiday appointment should be rendered correctly', function(assert) {
                const data = [{
                    text: 'Appt-001',
                    startDate: new Date(2021, 1, 2, 15, 45),
                    endDate: new Date(2021, 1, 3, 10, 15)
                }];

                const scheduler = createWrapper({
                    dataSource: data,
                    views: [{
                        type: 'timelineDay',
                        intervalCount: 2
                    }],
                    currentView: 'timelineDay',
                    currentDate: new Date(2021, 1, 2),
                    firstDayOfWeek: 0,
                    startDayHour: 8,
                    endDayHour: 20,
                    cellDuration: 30,
                    scrolling: {
                        mode: 'virtual',
                        orientation: 'both'
                    },
                    width: 800,
                    height: 600
                });

                const scrollable = scheduler.instance.getWorkSpaceScrollable();

                return asyncWrapper(assert, promise => {
                    [
                        {
                            offset: { x: 0 },
                            expectedRects: []
                        },
                        {
                            offset: { x: 2200 },
                            expectedRects: [{
                                left: -9099,
                                top: -9827,
                                width: 300
                            }]
                        },
                        {
                            offset: { x: 3200 },
                            expectedRects: [{
                                left: -10099,
                                top: -9827,
                                width: 1300
                            }]
                        },
                        {
                            offset: { x: 4200 },
                            expectedRects: [{
                                left: -10399,
                                top: -9827,
                                width: 1600
                            }]
                        },
                        {
                            offset: { x: 5200 },
                            expectedRects: [{
                                left: -10399,
                                top: -9827,
                                width: 900
                            }]
                        },
                        {
                            offset: { x: 6200 },
                            expectedRects: []
                        },
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
        });

        module('Vertical grouping', () => {
            module('timelineDay', () => {
                test('appointments should be rendered correctly', function(assert) {
                    const data = [
                        {
                            text: 'Appt-001',
                            ownerId: [3],
                            startDate: new Date(2021, 1, 2, 10, 0),
                            endDate: new Date(2021, 1, 2, 13, 0),
                            priority: 1
                        },
                        {
                            text: 'Appt-002',
                            ownerId: [2],
                            startDate: new Date(2021, 1, 2, 12, 0),
                            endDate: new Date(2021, 1, 2, 15, 45),
                            priority: 1
                        },
                        {
                            text: 'Appt-003',
                            ownerId: [3],
                            startDate: new Date(2021, 1, 2, 15, 45),
                            endDate: new Date(2021, 1, 3, 10, 15),
                            priority: 2
                        },
                        {
                            text: 'Appt-004',
                            ownerId: [2, 1],
                            startDate: new Date(2021, 1, 2, 20, 0),
                            endDate: new Date(2021, 1, 3, 6, 0),
                            priority: 1
                        }
                    ];

                    const scheduler = createWrapper({
                        dataSource: data,
                        views: [{
                            type: 'timelineDay',
                            intervalCount: 2
                        }],
                        currentView: 'timelineDay',
                        currentDate: new Date(2021, 1, 2),
                        firstDayOfWeek: 0,
                        startDayHour: 0,
                        endDayHour: 24,
                        cellDuration: 20,
                        resources: [{
                            fieldExpr: 'ownerId',
                            allowMultiple: true,
                            dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }],
                            label: 'Owner',
                        }, {
                            fieldExpr: 'priority',
                            allowMultiple: false,
                            dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }],
                            label: 'Priority'
                        }],
                        groups: ['ownerId'],
                        scrolling: {
                            mode: 'virtual',
                            orientation: 'horizontal'
                        },
                        width: 800,
                        height: 600
                    });

                    const scrollable = scheduler.instance.getWorkSpaceScrollable();

                    return asyncWrapper(assert, promise => {
                        [
                            {
                                offset: { x: 0 },
                                expectedRects: []
                            },
                            {
                                offset: { x: 5200 },
                                expectedRects: [{
                                    left: -9099,
                                    top: -9528,
                                    width: 400
                                }]
                            },
                            {
                                offset: { x: 6200 },
                                expectedRects: [{
                                    left: -10099,
                                    top: -9528,
                                    width: 1400
                                }, {
                                    left: -8899,
                                    top: -9677,
                                    width: 200
                                }]
                            },
                            {
                                offset: { x: 7200 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9528,
                                    width: 1000
                                }, {
                                    left: -9899,
                                    top: -9677,
                                    width: 1200
                                }]
                            },
                            {
                                offset: { x: 8200 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9677,
                                    width: 1650
                                }]
                            },
                            {
                                offset: { x: 9200 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9677,
                                    width: 650
                                }, {
                                    left: -9649,
                                    top: -9528,
                                    width: 950
                                }]
                            },
                            {
                                offset: { x: 10200 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9528,
                                    width: 1600
                                }]
                            },
                            {
                                offset: { x: 12000 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9528,
                                    width: 1600
                                }, {
                                    left: -9899,
                                    top: -9827,
                                    width: 1200
                                }, {
                                    left: -9899,
                                    top: -9677,
                                    width: 1200
                                }]
                            },
                            {
                                offset: { x: 13000 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9528,
                                    width: 1600
                                }, {
                                    left: -10299,
                                    top: -9827,
                                    width: 1600
                                }, {
                                    left: -10299,
                                    top: -9677,
                                    width: 1600
                                }]
                            },
                            {
                                offset: { x: 14000 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9528,
                                    width: 1600
                                }, {
                                    left: -10299,
                                    top: -9827,
                                    width: 1600
                                }, {
                                    left: -10299,
                                    top: -9677,
                                    width: 1600
                                }]
                            },
                            {
                                offset: { x: 15000 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9528,
                                    width: 1600
                                }, {
                                    left: -10299,
                                    top: -9827,
                                    width: 1600
                                }, {
                                    left: -10299,
                                    top: -9677,
                                    width: 1600
                                }]
                            },
                            {
                                offset: { x: 17000 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9528,
                                    width: 1600
                                }, {
                                    left: -10299,
                                    top: -9827,
                                    width: 1400
                                }, {
                                    left: -10299,
                                    top: -9677,
                                    width: 1400
                                }]
                            },
                            {
                                offset: { x: 17500 },
                                expectedRects: [{
                                    left: -10399,
                                    top: -9528,
                                    width: 1600
                                }, {
                                    left: -10399,
                                    top: -9827,
                                    width: 1000
                                }, {
                                    left: -10399,
                                    top: -9677,
                                    width: 1000
                                }]
                            },
                            {
                                offset: { x: 18000 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9528,
                                    width: 1600
                                }, {
                                    left: -10299,
                                    top: -9827,
                                    width: 400
                                }, {
                                    left: -10299,
                                    top: -9677,
                                    width: 400
                                }]
                            },
                            {
                                offset: { x: 19000 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9528,
                                    width: 1600
                                }]
                            },
                            {
                                offset: { x: 20000 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9528,
                                    width: 950
                                }]
                            },
                            {
                                offset: { x: 20500 },
                                expectedRects: [{
                                    left: -10399,
                                    top: -9528,
                                    width: 550
                                }]
                            },
                            {
                                offset: { x: 20800 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9528,
                                    width: 150
                                }]
                            },
                            {
                                offset: { x: 21200 },
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

            module('timelineWeek', () => {
                test('multiday appointment should be rendered correctly in timelineWeek view with grouping', function(assert) {
                    const scheduler = createWrapper({
                        height: 600,
                        width: 800,
                        dataSource: [{
                            startDate: new Date(2021, 8, 5, 9),
                            endDate: new Date(2021, 8, 11, 10),
                            resourceId: 1,
                        }],
                        views: [{
                            type: 'timelineWeek',
                            groupOrientation: 'vertical',
                            intervalCount: 2
                        }],
                        startDayHour: 9,
                        endDayHour: 18,
                        currentView: 'timelineWeek',
                        scrolling: {
                            mode: 'virtual',
                            orientation: 'both',
                        },
                        showAllDayPanel: false,
                        currentDate: new Date(2021, 8, 6),
                        groups: ['resourceId'],
                        resources: [{
                            fieldExpr: 'resourceId',
                            dataSource: [
                                { id: 0 },
                                { id: 1 }
                            ]
                        }]
                    });

                    const scrollable = scheduler.instance.getWorkSpaceScrollable();

                    return asyncWrapper(assert, promise => {
                        [
                            {
                                offset: { x: 0 },
                                expectedRects: [{
                                    left: -9899,
                                    top: -9603,
                                    width: 1200
                                }]
                            },
                            {
                                offset: { x: 10000 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9603,
                                    width: 1600
                                }]
                            },
                            {
                                offset: { x: 20000 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9603,
                                    width: 1600
                                }]
                            },
                            {
                                offset: { x: 21700 },
                                expectedRects: [{
                                    left: -10399,
                                    top: -9603,
                                    width: 800
                                }]
                            },
                            {
                                offset: { x: 23000 },
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
            });
        });
    });
});
