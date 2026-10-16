import 'fluent_blue_light.css!';

import {
    createWrapper,
    initTestMarkup,
    isDesktopEnvironment,
    asyncScrollTest,
    asyncWrapper,
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
    offset.left >= 0 ? `offset.left: ${offset.left}` : '',
    offset.top >= 0 ? `offset.top: ${offset.top}` : ''
].join(',');

testStart(() => initTestMarkup());

module('Virtual scrolling timelines', () => {
    module('Appointments', () => {
        module('timelineDay', () => {
            test('multiday appointment should be rendered correctly', async function(assert) {
                const data = [{
                    text: 'Appt-001',
                    startDate: new Date(2021, 1, 2, 15, 45),
                    endDate: new Date(2021, 1, 3, 10, 15),
                }];

                const scheduler = await createWrapper({
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
                            offset: { left: 0 },
                            expectedRects: []
                        },
                        {
                            offset: { left: 2200 },
                            expectedRects: [{
                                left: -9099,
                                top: -9833,
                                width: 300
                            }]
                        },
                        {
                            offset: { left: 3200 },
                            expectedRects: [{
                                left: -10099,
                                top: -9833,
                                width: 1300
                            }]
                        },
                        {
                            offset: { left: 4200 },
                            expectedRects: [{
                                left: -10399,
                                top: -9833,
                                width: 1600
                            }]
                        },
                        {
                            offset: { left: 5200 },
                            expectedRects: [{
                                left: -10399,
                                top: -9833,
                                width: 900
                            }]
                        },
                        {
                            offset: { left: 6200 },
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
                test('appointments should be rendered correctly', async function(assert) {
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

                    const scheduler = await createWrapper({
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
                                offset: { left: 0 },
                                expectedRects: []
                            },
                            {
                                offset: { left: 5200 },
                                expectedRects: [{
                                    left: -9099,
                                    top: -9525,
                                    width: 400
                                }]
                            },
                            {
                                offset: { left: 6200 },
                                expectedRects: [{
                                    left: -8899,
                                    top: -9679,
                                    width: 200
                                }, {
                                    left: -10099,
                                    top: -9525,
                                    width: 1400
                                }]
                            },
                            {
                                offset: { left: 7200 },
                                expectedRects: [{
                                    left: -9899,
                                    top: -9679,
                                    width: 1200
                                }, {
                                    left: -10299,
                                    top: -9525,
                                    width: 1000
                                }]
                            },
                            {
                                offset: { left: 8200 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9679,
                                    width: 1600
                                }]
                            },
                            {
                                offset: { left: 9200 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9679,
                                    width: 650
                                }, {
                                    left: -9649,
                                    top: -9525,
                                    width: 950
                                }]
                            },
                            {
                                offset: { left: 10200 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9525,
                                    width: 1600
                                }]
                            },
                            {
                                offset: { left: 12000 },
                                expectedRects: [{
                                    left: -9899,
                                    top: -9833,
                                    width: 1200
                                }, {
                                    left: -9899,
                                    top: -9679,
                                    width: 1200
                                }, {
                                    left: -10299,
                                    top: -9525,
                                    width: 1600
                                }]
                            },
                            {
                                offset: { left: 13000 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9833,
                                    width: 1600
                                }, {
                                    left: -10299,
                                    top: -9679,
                                    width: 1600
                                }, {
                                    left: -10299,
                                    top: -9525,
                                    width: 1600
                                }]
                            },
                            {
                                offset: { left: 14000 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9833,
                                    width: 1600
                                }, {
                                    left: -10299,
                                    top: -9679,
                                    width: 1600
                                }, {
                                    left: -10299,
                                    top: -9525,
                                    width: 1600
                                }]
                            },
                            {
                                offset: { left: 15000 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9833,
                                    width: 1600
                                }, {
                                    left: -10299,
                                    top: -9679,
                                    width: 1600
                                }, {
                                    left: -10299,
                                    top: -9525,
                                    width: 1600
                                }]
                            },
                            {
                                offset: { left: 17000 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9833,
                                    width: 1400
                                }, {
                                    left: -10299,
                                    top: -9679,
                                    width: 1400
                                }, {
                                    left: -10299,
                                    top: -9525,
                                    width: 1600
                                }]
                            },
                            {
                                offset: { left: 17500 },
                                expectedRects: [{
                                    left: -10399,
                                    top: -9833,
                                    width: 1000
                                }, {
                                    left: -10399,
                                    top: -9679,
                                    width: 1000
                                }, {
                                    left: -10399,
                                    top: -9525,
                                    width: 1600
                                }]
                            },
                            {
                                offset: { left: 18000 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9833,
                                    width: 400
                                }, {
                                    left: -10299,
                                    top: -9679,
                                    width: 400
                                }, {
                                    left: -10299,
                                    top: -9525,
                                    width: 1600
                                }]
                            },
                            {
                                offset: { left: 19000 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9525,
                                    width: 1600
                                }]
                            },
                            {
                                offset: { left: 20000 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9525,
                                    width: 950
                                }]
                            },
                            {
                                offset: { left: 20500 },
                                expectedRects: [{
                                    left: -10399,
                                    top: -9525,
                                    width: 550
                                }]
                            },
                            {
                                offset: { left: 20800 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9525,
                                    width: 150
                                }]
                            },
                            {
                                offset: { left: 21200 },
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
                test('multiday appointment should be rendered correctly in timelineWeek view with grouping', async function(assert) {
                    const scheduler = await createWrapper({
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
                                offset: { left: 0 },
                                expectedRects: [{
                                    left: -9899,
                                    top: -9609,
                                    width: 1200
                                }]
                            },
                            {
                                offset: { left: 10000 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9609,
                                    width: 1600
                                }]
                            },
                            {
                                offset: { left: 20000 },
                                expectedRects: [{
                                    left: -10299,
                                    top: -9609,
                                    width: 1600
                                }]
                            },
                            {
                                offset: { left: 21700 },
                                expectedRects: [{
                                    left: -10399,
                                    top: -9609,
                                    width: 800
                                }]
                            },
                            {
                                offset: { left: 23000 },
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
