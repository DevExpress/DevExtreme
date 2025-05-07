import $ from 'jquery';

import { getWindow } from 'core/utils/window';

import 'generic_light.css!';

import { DataSource } from 'common/data/data_source/data_source';
import {
    createWrapper,
    initTestMarkup,
    isDesktopEnvironment,
    asyncScrollTest,
    asyncWrapper,
} from '../../helpers/scheduler/helpers.js';

const supportedViews = ['day', 'week', 'workWeek', 'month']; // TODO: add timelines

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

testStart(() => initTestMarkup());
module('Virtual scrolling integration', () => {
    module('Initialization', () => {
        supportedViews.forEach(viewName => {
            test(`Virtual scrolling should have default cell sizes in "${viewName}" view`, function(assert) {
                const instance = createWrapper({
                    views: [{
                        type: viewName,
                    }],
                    currentView: viewName,
                    scrolling: {
                        mode: 'virtual',
                        orientation: 'both'
                    },
                    height: 400,
                    width: 600
                }).instance;

                const { virtualScrollingDispatcher } = instance.getWorkSpace();

                assert.ok(virtualScrollingDispatcher.rowHeight > 0, 'Cell height is present');
                assert.ok(virtualScrollingDispatcher.cellWidth > 0, 'Cell width is present');
            });

            module('Options', () => {
                test(`viewport sizes should be correct if height and width are not set in "${viewName}" view`, function(assert) {
                    const { instance } = createWrapper({
                        views: [{
                            type: viewName,
                        }],
                        scrolling: {
                            mode: 'virtual',
                            orientation: 'both'
                        },
                        currentView: viewName
                    });

                    const { virtualScrollingDispatcher } = instance.getWorkSpace();
                    const {
                        viewportHeight,
                        viewportWidth
                    } = virtualScrollingDispatcher;

                    assert.equal(viewportHeight, window.innerHeight, 'viewportHeight is correct');
                    assert.equal(viewportWidth, window.innerWidth, 'viewportWidth is correct');
                });

                test(`pageSize should be correct if height and width are not set in "${viewName}" view`, function(assert) {
                    const { instance } = createWrapper({
                        views: [{
                            type: viewName,
                        }],
                        scrolling: {
                            mode: 'virtual',
                            orientation: 'both'
                        },

                        currentView: viewName
                    });

                    const { virtualScrollingDispatcher } = instance.getWorkSpace();

                    instance.getWorkSpace().renderer.getRenderTimeout = () => -1;

                    const { pageSize: verticalPageSize } = virtualScrollingDispatcher.verticalVirtualScrolling;
                    const { pageSize: horizontalPageSize } = virtualScrollingDispatcher.horizontalVirtualScrolling;
                    const {
                        innerHeight,
                        innerWidth
                    } = getWindow();

                    const { itemSize: cellHeight } = virtualScrollingDispatcher.verticalVirtualScrolling;
                    const expectedVerticalPageSize = Math.ceil(innerHeight / cellHeight);

                    assert.equal(verticalPageSize, expectedVerticalPageSize, 'Vertical page size is correct');

                    const { itemSize: cellWidth } = virtualScrollingDispatcher.horizontalVirtualScrolling;
                    const expectedHorizontalPageSize = Math.ceil(innerWidth / cellWidth);

                    assert.equal(horizontalPageSize, expectedHorizontalPageSize, 'Horizontal page size is correct');
                });


                [{
                    orientation: undefined,
                    crossScrollingEnabled: true
                }, {
                    orientation: 'vertical',
                    crossScrollingEnabled: false
                }, {
                    orientation: 'horizontal',
                    crossScrollingEnabled: true
                }, {
                    orientation: 'both',
                    crossScrollingEnabled: true
                }].forEach(({ orientation, crossScrollingEnabled }) => {
                    test(`crossScrollingEnabled should be set correctly if scrolling orientation is "${orientation}" in "${viewName}" view`, function(assert) {
                        const { instance } = createWrapper({
                            views: [{
                                type: viewName,
                            }],
                            scrolling: {
                                mode: 'virtual',
                                orientation
                            },
                            currentView: viewName
                        });

                        const workspace = instance.getWorkSpace();

                        assert.equal(workspace.option('crossScrollingEnabled'), crossScrollingEnabled, 'crossScrollingEnabled is correct');
                    });
                });

                test(`scheduler should correctly change scrolling orientation in "${viewName}"`, function(assert) {
                    const scheduler = createWrapper({
                        views: [viewName],
                        scrolling: {
                            mode: 'virtual',
                            orientation: 'vertical',
                        },
                        currentView: viewName,
                    });

                    scheduler.instance.option('scrolling', { mode: 'virtual', orientation: 'both' });

                    const headerScrollable = scheduler.workSpace.getHeaderScrollable();
                    const sideBarScrollable = scheduler.workSpace.getSideBarScrollable();

                    assert.equal(headerScrollable.length, 1, 'Header scrollable exists');
                    assert.equal(sideBarScrollable.length, 1, 'Header scrollable exists');
                });

                test(`scheduler should correctly change scrolling orientation in "${viewName}" when changing a view's option`, function(assert) {
                    const scheduler = createWrapper({
                        views: [{
                            type: viewName,
                        }],
                        scrolling: {
                            mode: 'virtual',
                            orientation: 'vertical',
                        },
                        currentView: viewName,
                    });

                    scheduler.instance.option('views[0].scrolling', { mode: 'virtual', orientation: 'both' });

                    const headerScrollable = scheduler.workSpace.getHeaderScrollable();
                    const sideBarScrollable = scheduler.workSpace.getSideBarScrollable();

                    assert.equal(headerScrollable.length, 1, 'Header scrollable exists');
                    assert.equal(sideBarScrollable.length, 1, 'Header scrollable exists');
                });
            });
        });

        test('appointment render timeout should be initialized correctly', function(assert) {
            const instance = createWrapper({
                views: supportedViews,
                currentView: 'day',
                dataSource: [],
                scrolling: { mode: 'virtual' },
                height: 400,
            }).instance;

            const workspace = instance.getWorkSpace();

            assert.equal(
                workspace.renderer.getRenderTimeout(),
                15,
                'appointment render timeout is correct'
            );
        });
    });

    module('AppointmentSettings', {
        beforeEach: function() {
            this.createInstance = function(options) {
                this.scheduler = createWrapper(options);
                this.scheduler.instance
                    .getWorkSpace()
                    .renderer.getRenderTimeout = () => -1;
            };
        }
    }, function() {
        module('Week view', () => {
            module('Vertical virtual scroll', () => {
                [
                    {
                        showAllDayPanel: true,
                        steps: [
                            {
                                y: 0,
                                appointmentRects: [
                                    { left: -9824, top: -9689, height: 500 },
                                    { left: -9749, top: -9839, height: 50 },
                                    { left: -9299, top: -9689, height: 500 },
                                    { left: -9224, top: -9839, height: 50 }
                                ]
                            },
                            {
                                y: 1000,
                                appointmentRects: [
                                    { left: -9824, top: -10039, height: 850 },
                                    { left: -9749, top: -10839, height: 50 },
                                    { left: -9299, top: -10039, height: 850 },
                                    { left: -9224, top: -10839, height: 50 }
                                ]
                            },
                            {
                                y: 2200,
                                appointmentRects: [
                                    { left: -9824, top: -10151, height: 650 },
                                    { left: -9749, top: -11901, height: 50 },
                                    { left: -9299, top: -10151, height: 650 },
                                    { left: -9224, top: -11901, height: 50 }
                                ]
                            }]
                    },
                    {
                        showAllDayPanel: false,
                        steps: [{
                            y: 0,
                            appointmentRects: [
                                { left: -9824, top: -9712, height: 500 },
                                { left: -9749, top: -9862, height: 50 },
                                { left: -9299, top: -9712, height: 500 },
                                { left: -9224, top: -9862, height: 50 }
                            ]
                        }, {
                            y: 1000,
                            appointmentRects: [
                                { left: -9824, top: -10062, height: 850 },
                                { left: -9749, top: -10862, height: 50 },
                                { left: -9299, top: -10062, height: 850 },
                                { left: -9224, top: -10862, height: 50 }
                            ]
                        }, {
                            y: 2200,
                            appointmentRects: [
                                { left: -9824, top: -10149, height: 650 },
                                { left: -9749, top: -11899, height: 50 },
                                { left: -9299, top: -10149, height: 650 },
                                { left: -9224, top: -11899, height: 50 }
                            ]
                        }]
                    }
                ].forEach(option => {
                    test(`Long appointment should be rendered correctly if horizontal grouping, and showAllDayPanel is ${option.showAllDayPanel}`, function(assert) {
                        const data = [{
                            startDate: new Date(2020, 9, 12, 1, 30),
                            endDate: new Date(2020, 9, 13, 0, 30),
                            priorityId: 1
                        }, {
                            startDate: new Date(2020, 9, 12, 1, 30),
                            endDate: new Date(2020, 9, 13, 0, 30),
                            priorityId: 2,
                        }];

                        this.createInstance({
                            dataSource: data,
                            currentView: 'week',
                            currentDate: new Date(2020, 9, 12),
                            groups: ['priorityId'],
                            resources: [{
                                fieldExpr: 'priorityId',
                                allowMultiple: false,
                                dataSource: [{ id: 1 }, { id: 2 }]
                            }],
                            scrolling: { mode: 'virtual' },
                            showAllDayPanel: option.showAllDayPanel,
                            height: 500,
                            width: 800
                        });

                        const { instance } = this.scheduler;
                        const workspace = instance.getWorkSpace();
                        const scrollable = workspace.getScrollable();

                        workspace.renderer.getRenderTimeout = () => -1;

                        return asyncWrapper(assert, promise => {
                            option.steps.forEach(step => {
                                promise = asyncScrollTest(
                                    assert,
                                    promise,
                                    () => {
                                        assert.equal(
                                            this.scheduler.appointments.getAppointmentCount(),
                                            step.appointmentRects.length,
                                            `Appointment count is correct if scrollY: ${step.y}`
                                        );

                                        step.appointmentRects.forEach((expectedRect, index) => {
                                            const appointmentRect = this.scheduler.appointments
                                                .getAppointment(index)
                                                .get(0)
                                                .getBoundingClientRect();

                                            assert.roughEqual(appointmentRect.left, expectedRect.left, 2.01, `appointment part #${index} left is correct`);
                                            assert.roughEqual(appointmentRect.top, expectedRect.top, 2.01, `appointment part #${index} top is correct`);
                                            assert.roughEqual(appointmentRect.height, expectedRect.height, 2.01, `appointment part #${index} height is correct`);
                                        });
                                    },
                                    scrollable,
                                    { top: step.y });
                            });

                            return promise;
                        });
                    });
                });

                [
                    {
                        showAllDayPanel: true,
                        steps: [
                            {
                                y: 0,
                                appointmentRects: [
                                    { left: -9749, top: -9839, height: 650 },
                                    { left: -9224, top: -9839, height: 650 }
                                ]
                            },
                            {
                                y: 1000,
                                appointmentRects: [
                                    { left: -9824, top: -9689, height: 500 },
                                    { left: -9749, top: -10839, height: 1050 },
                                    { left: -9299, top: -9689, height: 500 },
                                    { left: -9224, top: -10839, height: 1050 }
                                ]
                            },
                            {
                                y: 2200,
                                appointmentRects: [
                                    { left: -9824, top: -10151, height: 650 },
                                    { left: -9749, top: -11901, height: 1050 },
                                    { left: -9299, top: -10151, height: 650 },
                                    { left: -9224, top: -11901, height: 1050 }
                                ]
                            }
                        ],
                    }, {
                        showAllDayPanel: false,
                        steps: [{
                            y: 0,
                            appointmentRects: [
                                { left: -9749, top: -9862, height: 650 },
                                { left: -9224, top: -9862, height: 650 }
                            ]
                        },
                        {
                            y: 1000,
                            appointmentRects: [
                                { left: -9824, top: -9712, height: 500 },
                                { left: -9749, top: -10862, height: 1050 },
                                { left: -9299, top: -9712, height: 500 },
                                { left: -9224, top: -10862, height: 1050 }
                            ]
                        },
                        {
                            y: 2200,
                            appointmentRects: [
                                { left: -9824, top: -10149, height: 650 },
                                { left: -9749, top: -11899, height: 1050 },
                                { left: -9299, top: -10149, height: 650 },
                                { left: -9224, top: -11899, height: 1050 }
                            ]
                        }
                        ]
                    }
                ].forEach(option => {
                    test(`Long appointment part should be rendered correctly without render the main part if horizontal grouping and showAllDayPanel is ${option.showAllDayPanel}`, function(assert) {
                        const data = [{
                            startDate: new Date(2020, 9, 12, 11, 30),
                            endDate: new Date(2020, 9, 13, 10, 30),
                            priorityId: 1,
                        },
                        {
                            startDate: new Date(2020, 9, 12, 11, 30),
                            endDate: new Date(2020, 9, 13, 10, 30),
                            priorityId: 2,
                        }];
                        this.createInstance({
                            dataSource: data,
                            currentView: 'week',
                            currentDate: new Date(2020, 9, 12),
                            groups: ['priorityId'],
                            resources: [{
                                fieldExpr: 'priorityId',
                                allowMultiple: false,
                                dataSource: [{ id: 1 }, { id: 2 }]
                            }],
                            scrolling: { mode: 'virtual' },
                            showAllDayPanel: option.showAllDayPanel,
                            height: 500,
                            width: 800
                        });

                        const { instance } = this.scheduler;
                        const workspace = instance.getWorkSpace();
                        const scrollable = workspace.getScrollable();

                        workspace.renderer.getRenderTimeout = () => -1;

                        return asyncWrapper(assert, promise => {
                            option.steps.forEach(step => {
                                promise = asyncScrollTest(
                                    assert,
                                    promise,
                                    () => {
                                        assert.equal(
                                            this.scheduler.appointments.getAppointmentCount(),
                                            step.appointmentRects.length,
                                            `Appointment count is correct if scrollY: ${step.y}`
                                        );

                                        step.appointmentRects.forEach((expectedRect, index) => {
                                            const appointmentRect = this.scheduler.appointments
                                                .getAppointment(index)
                                                .get(0)
                                                .getBoundingClientRect();

                                            assert.roughEqual(appointmentRect.left, expectedRect.left, 2.01, `appointment part #${index} left is correct`);
                                            assert.roughEqual(appointmentRect.top, expectedRect.top, 2.01, `appointment part #${index} top is correct`);
                                            assert.roughEqual(appointmentRect.height, expectedRect.height, 2.01, `appointment part #${index} height is correct`);
                                        });
                                    },
                                    scrollable,
                                    { y: step.y });
                            });

                            return promise;
                        });
                    });
                });

                test('Appointment with multiple resources should be rendered correctly if vertical grouping', function(assert) {
                    const data = [{
                        startDate: new Date(2020, 9, 12, 1, 30),
                        endDate: new Date(2020, 9, 12, 22, 30),
                        priorityId: [1, 2],
                    }];

                    this.createInstance({
                        dataSource: data,
                        views: [{
                            type: 'week',
                            groupOrientation: 'vertical'
                        }],
                        currentView: 'week',
                        currentDate: new Date(2020, 9, 12),
                        groups: ['priorityId'],
                        resources: [{
                            fieldExpr: 'priorityId',
                            allowMultiple: true,
                            dataSource: [{ id: 1 }, { id: 2 }]
                        }],
                        scrolling: { mode: 'virtual' },
                        height: 500,
                        width: 800
                    });

                    const { instance } = this.scheduler;
                    const workspace = instance.getWorkSpace();
                    const scrollable = workspace.getScrollable();

                    workspace.renderer.getRenderTimeout = () => -1;

                    return asyncWrapper(assert, promise => {
                        [
                            {
                                y: 0,
                                appointmentRects: [
                                    { left: -9713, top: -9692, height: 450 }
                                ]
                            },
                            {
                                y: 1000,
                                appointmentRects: [
                                    { left: -9713, top: -10092, height: 850 }
                                ]
                            },
                            {
                                y: 2500,
                                appointmentRects: [
                                    { left: -9713, top: -9742, height: 500 }
                                ]
                            },
                            {
                                y: 4500,
                                appointmentRects: [
                                    { left: -9713, top: -10142, height: 500 }
                                ]
                            }
                        ].forEach(option => {
                            promise = asyncScrollTest(
                                assert,
                                promise,
                                () => {
                                    assert.equal(
                                        this.scheduler.appointments.getAppointmentCount(),
                                        option.appointmentRects.length,
                                        `Appointment count is correct when scrollOffset: ${option.y}`
                                    );

                                    option.appointmentRects.forEach((expectedRect, index) => {
                                        const appointmentRect = this.scheduler.appointments
                                            .getAppointment(index)
                                            .get(0)
                                            .getBoundingClientRect();

                                        assert.roughEqual(appointmentRect.left, expectedRect.left, 1.01, `Appointemnt#${index} left is correct`);
                                        assert.roughEqual(appointmentRect.top, expectedRect.top, 1.01, 'Appointemnt#${index} top is correct');
                                        assert.roughEqual(appointmentRect.height, expectedRect.height, 1.01, 'Appointemnt#${index} height is correct');
                                    });
                                },
                                scrollable,
                                { y: option.y }
                            );
                        });

                        return promise;
                    });
                });

                test('Appointment with multiple resources should be rendered correctly if horizontal grouping', function(assert) {
                    const data = [{
                        startDate: new Date(2020, 9, 12, 1, 30),
                        endDate: new Date(2020, 9, 12, 22, 30),
                        priorityId: [1, 2],
                    }];
                    this.createInstance({
                        dataSource: data,
                        currentView: 'week',
                        currentDate: new Date(2020, 9, 12),
                        groups: ['priorityId'],
                        resources: [{
                            fieldExpr: 'priorityId',
                            allowMultiple: true,
                            dataSource: [{ id: 1 }, { id: 2 }]
                        }],
                        scrolling: { mode: 'virtual' },
                        height: 500,
                        width: 800
                    });

                    const { instance } = this.scheduler;
                    const workspace = instance.getWorkSpace();
                    const scrollable = workspace.getScrollable();

                    workspace.renderer.getRenderTimeout = () => -1;

                    return asyncWrapper(assert, promise => {
                        [
                            {
                                y: 0,
                                appointmentRects: [
                                    { left: -9824, top: -9689, height: 500 },
                                    { left: -9299, top: -9689, height: 500 }
                                ]
                            },
                            {
                                y: 1000,
                                appointmentRects: [
                                    { left: -9824, top: -10039, height: 850 },
                                    { left: -9299, top: -10039, height: 850 }
                                ]
                            },
                            {
                                y: 2100,
                                appointmentRects: [
                                    { left: -9824, top: -10151, height: 500 },
                                    { left: -9299, top: -10151, height: 500 }
                                ]
                            }
                        ].forEach(option => {
                            promise = asyncScrollTest(
                                assert,
                                promise,
                                () => {
                                    assert.equal(
                                        option.appointmentRects.length,
                                        this.scheduler.appointments.getAppointmentCount(),
                                        `Appointment count is correct when offsetY: ${option.y}`
                                    );

                                    option.appointmentRects.forEach((expectedRect, index) => {
                                        const appointmentRect = this.scheduler.appointments
                                            .getAppointment(index)
                                            .get(0)
                                            .getBoundingClientRect();

                                        assert.roughEqual(appointmentRect.left, expectedRect.left, 2.01, `appointment part #${index} left is correct`);
                                        assert.roughEqual(appointmentRect.top, expectedRect.top, 2.01, `appointment part #${index} top is correct`);
                                        assert.roughEqual(appointmentRect.height, expectedRect.height, 2.01, `appointment part #${index} height is correct`);
                                    });
                                },
                                scrollable,
                                { y: option.y }
                            );
                        });

                        return promise;
                    });
                });

                [undefined, 'FREQ=DAILY'].forEach(recurrenceRule => {
                    test(`Appointments should contains groupIndex if recurrenceRule: ${recurrenceRule}`, function(assert) {
                        this.createInstance({
                            currentDate: new Date(2015, 2, 2),
                            currentView: 'week',
                            scrolling: {
                                mode: 'virtual',
                                orientation: 'both'
                            },
                            dataSource: [{
                                startDate: new Date(2015, 2, 2, 0),
                                endDate: new Date(2015, 2, 2, 0, 30),
                                recurrenceRule
                            }],
                            height: 400
                        });

                        const { instance } = this.scheduler;

                        const layoutManager = instance.getLayoutManager();
                        const settings = layoutManager._positionMap[0][0];

                        assert.equal(settings.groupIndex, 0, 'groupIndex is correct');
                    });
                });

                [
                    {
                        showAllDayPanel: true,
                        steps: [ {
                            offset: { x: 0, y: 0 },
                            appointmentRects: [
                                { left: -9714, top: -9693, height: 450 },
                                { left: -9629, top: -9843, height: 50 }
                            ]
                        },
                        {
                            offset: { x: 0, y: 2300 },
                            appointmentRects: [
                                { left: -9714, top: -10093, height: 350 },
                                { left: -9629, top: -12143, height: 50 },
                                { left: -9714, top: -9543, height: 300 },
                                { left: -9629, top: -9693, height: 50 }
                            ]
                        }]
                    },
                    {
                        showAllDayPanel: false,
                        steps: [
                            {
                                offset: { x: 0, y: 0 },
                                appointmentRects: [
                                    { left: -9714, top: -9741, height: 500 },
                                    { left: -9629, top: -9891, height: 50 }
                                ]
                            },
                            {
                                offset: { x: 0, y: 2300 },
                                appointmentRects: [
                                    { left: -9714, top: -10091, height: 300 },
                                    { left: -9629, top: -12191, height: 50 },
                                    { left: -9714, top: -9641, height: 400 },
                                    { left: -9629, top: -9791, height: 50 }
                                ]
                            }
                        ]
                    }
                ].forEach(({ showAllDayPanel, steps }) => {
                    test(`Long appointment should be rendered correctly if vertical grouping and showAllDayPanel is ${showAllDayPanel}`, function(assert) {
                        const data = [{
                            startDate: new Date(2020, 9, 12, 1, 30),
                            endDate: new Date(2020, 9, 13, 0, 30),
                            priorityId: 1
                        }, {
                            startDate: new Date(2020, 9, 12, 1, 30),
                            endDate: new Date(2020, 9, 13, 0, 30),
                            priorityId: 2,
                        }];

                        this.createInstance({
                            dataSource: data,
                            views: [{
                                type: 'week',
                                groupOrientation: 'vertical'
                            }],
                            currentView: 'week',
                            currentDate: new Date(2020, 9, 12),
                            groups: ['priorityId'],
                            resources: [{
                                fieldExpr: 'priorityId',
                                allowMultiple: false,
                                dataSource: [{ id: 1 }, { id: 2 }]
                            }],
                            scrolling: {
                                mode: 'virtual',
                                orientation: 'vertical'
                            },
                            showAllDayPanel,
                            height: 500,
                            width: 800
                        });

                        const { instance } = this.scheduler;
                        const workspace = instance.getWorkSpace();
                        const scrollable = workspace.getScrollable();

                        workspace.renderer.getRenderTimeout = () => -1;

                        return asyncWrapper(assert, promise => {
                            steps.forEach(({ offset, appointmentRects }) => {
                                promise = asyncScrollTest(
                                    assert,
                                    promise,
                                    () => {
                                        const appointmentCount = this.scheduler.appointments.getAppointmentCount();

                                        assert.equal(
                                            appointmentCount,
                                            appointmentRects.length,
                                            `Appointment count is correct if scrollX: ${offset.x}, scrollY: ${offset.y}`
                                        );

                                        appointmentRects.forEach((expectedRect, index) => {
                                            const appointmentRect = this.scheduler.appointments
                                                .getAppointment(index)
                                                .get(0)
                                                .getBoundingClientRect();

                                            assert.roughEqual(appointmentRect.left, expectedRect.left, 2.01, `appointment part #${index} left is correct`);
                                            assert.roughEqual(appointmentRect.top, expectedRect.top, 2.01, `appointment part #${index} top is correct`);
                                            assert.roughEqual(appointmentRect.height, expectedRect.height, 2.01, `appointment part #${index} height is correct`);
                                        });
                                    },
                                    scrollable,
                                    offset
                                );
                            });

                            return promise;
                        });
                    });
                });

                [
                    {
                        showAllDayPanel: true,
                        steps: [
                            {
                                y: 0,
                                appointmentRects: [
                                    { left: -9628, top: -9843, height: 600 },
                                ]
                            },
                            {
                                y: 1000,
                                appointmentRects: [
                                    { left: -9713, top: -9693, height: 450 },
                                    { left: -9628, top: -10843, height: 1050 }
                                ]
                            },
                            {
                                y: 2200,
                                appointmentRects: [
                                    { left: -9713, top: -10093, height: 450 },
                                    { left: -9628, top: -12043, height: 1050 },
                                    { left: -9628, top: -9593, height: 350 },
                                ]
                            }
                        ]
                    }, {
                        showAllDayPanel: false,
                        steps: [
                            {
                                y: 0,
                                appointmentRects: [
                                    { left: -9628, top: -9891, height: 650 }
                                ]
                            },
                            {
                                y: 1000,
                                appointmentRects: [
                                    { left: -9713, top: -9741, height: 500 },
                                    { left: -9628, top: -10891, height: 1050 }
                                ]
                            },
                            {
                                y: 2200,
                                appointmentRects: [
                                    { left: -9713, top: -10091, height: 400 },
                                    { left: -9628, top: -12091, height: 1050 },
                                    { left: -9628, top: -9691, height: 450 }
                                ]
                            }
                        ]
                    }
                ].forEach(option => {
                    test(`Long appointment part should be rendered correctly without render main part if vertical grouping and showAllDayPanel is ${option.showAllDayPanel}`, function(assert) {
                        const data = [{
                            startDate: new Date(2020, 9, 12, 11, 30),
                            endDate: new Date(2020, 9, 13, 10, 30),
                            priorityId: 1,
                        },
                        {
                            startDate: new Date(2020, 9, 12, 11, 30),
                            endDate: new Date(2020, 9, 13, 10, 30),
                            priorityId: 2,
                        }];
                        this.createInstance({
                            dataSource: data,
                            views: [{
                                type: 'week',
                                groupOrientation: 'vertical'
                            }],
                            currentView: 'week',
                            currentDate: new Date(2020, 9, 12),
                            groups: ['priorityId'],
                            resources: [{
                                fieldExpr: 'priorityId',
                                allowMultiple: false,
                                dataSource: [{ id: 1 }, { id: 2 }]
                            }],
                            scrolling: { mode: 'virtual' },
                            showAllDayPanel: option.showAllDayPanel,
                            height: 500,
                            width: 800
                        });

                        const { instance } = this.scheduler;
                        const workspace = instance.getWorkSpace();
                        const scrollable = workspace.getScrollable();

                        workspace.renderer.getRenderTimeout = () => -1;

                        return asyncWrapper(assert, promise => {
                            option.steps.forEach(step => {
                                promise = asyncScrollTest(
                                    assert,
                                    promise,
                                    () => {
                                        assert.equal(
                                            this.scheduler.appointments.getAppointmentCount(),
                                            step.appointmentRects.length,
                                            `Appointment count is correct if scrollY: ${step.y}`
                                        );

                                        step.appointmentRects.forEach((expectedRect, index) => {
                                            const appointmentRect = this.scheduler.appointments
                                                .getAppointment(index)
                                                .get(0)
                                                .getBoundingClientRect();

                                            assert.roughEqual(appointmentRect.left, expectedRect.left, 2.01, `appointment part #${index} left is correct`);
                                            assert.roughEqual(appointmentRect.top, expectedRect.top, 2.01, `appointment part #${index} top is correct`);
                                            assert.roughEqual(appointmentRect.height, expectedRect.height, 2.01, `appointment part #${index} height is correct`);
                                        });
                                    },
                                    scrollable,
                                    { top: step.y }
                                );
                            });

                            return promise;
                        });
                    });
                });

            });

            module('Both virtual scroll orientations', () => {
                [
                    {
                        showAllDayPanel: true,
                        steps: [{
                            offset: { x: 0, y: 0 },
                            appointmentRects: [
                                { left: -9874, top: -9689, height: 500 },
                                { left: -9799, top: -9839, height: 50 },
                            ]
                        }, {
                            offset: { x: 0, y: 1000 },
                            appointmentRects: [
                                { left: -9874, top: -10039, height: 850 },
                                { left: -9799, top: -10839, height: 50 },
                            ]
                        }, {
                            offset: { x: 0, y: 2200 },
                            appointmentRects: [
                                { left: -9874, top: -10150, height: 650 },
                                { left: -9799, top: -11900, height: 50 },
                            ]
                        }, {
                            offset: { x: 520, y: 0 },
                            appointmentRects: [
                                { left: -9869, top: -9689, height: 500 },
                                { left: -9794, top: -9839, height: 50 },
                            ]
                        }, {
                            offset: { x: 520, y: 1000 },
                            appointmentRects: [
                                { left: -9869, top: -10038, height: 850 },
                                { left: -9794, top: -10839, height: 50 },
                            ]
                        }, {
                            offset: { x: 520, y: 2200 },
                            appointmentRects: [
                                { left: -9869, top: -10150, height: 650 },
                                { left: -9794, top: -11900, height: 50 },
                            ]
                        }]
                    }, {
                        showAllDayPanel: false,
                        steps: [{
                            offset: { x: 0, y: 0 },
                            appointmentRects: [
                                { left: -9874, top: -9712, height: 500 },
                                { left: -9799, top: -9862, height: 50 },
                            ]
                        }, {
                            offset: { x: 0, y: 1000 },
                            appointmentRects: [
                                { left: -9874, top: -10062, height: 850 },
                                { left: -9799, top: -10862, height: 50 },
                            ]
                        }, {
                            offset: { x: 0, y: 2200 },
                            appointmentRects: [
                                { left: -9874, top: -10149, height: 650 },
                                { left: -9799, top: -11899, height: 50 },
                            ]
                        }, {
                            offset: { x: 520, y: 0 },
                            appointmentRects: [
                                { left: -9869, top: -9712, height: 500 },
                                { left: -9794, top: -9862, height: 50 },
                            ]
                        }, {
                            offset: { x: 520, y: 1000 },
                            appointmentRects: [
                                { left: -9869, top: -10062, height: 850 },
                                { left: -9794, top: -10862, height: 50 },
                            ]
                        }, {
                            offset: { x: 520, y: 2200 },
                            appointmentRects: [
                                { left: -9869, top: -10149, height: 650 },
                                { left: -9794, top: -11899, height: 50 },
                            ]
                        }]
                    }
                ].forEach(({ showAllDayPanel, steps }) => {
                    test(`Long appointment should be rendered correctly if horizontal grouping, and showAllDayPanel is ${showAllDayPanel}`, function(assert) {
                        const data = [{
                            startDate: new Date(2020, 9, 12, 1, 30),
                            endDate: new Date(2020, 9, 13, 0, 30),
                            priorityId: 1
                        }, {
                            startDate: new Date(2020, 9, 12, 1, 30),
                            endDate: new Date(2020, 9, 13, 0, 30),
                            priorityId: 2,
                        }];

                        this.createInstance({
                            dataSource: data,
                            currentView: 'week',
                            currentDate: new Date(2020, 9, 12),
                            groups: ['priorityId'],
                            resources: [{
                                fieldExpr: 'priorityId',
                                allowMultiple: false,
                                dataSource: [{ id: 1 }, { id: 2 }]
                            }],
                            scrolling: {
                                mode: 'virtual',
                                orientation: 'both'
                            },
                            showAllDayPanel: showAllDayPanel,
                            height: 500,
                            width: 300
                        });

                        const { instance } = this.scheduler;
                        const workspace = instance.getWorkSpace();
                        const scrollable = workspace.getScrollable();

                        workspace.renderer.getRenderTimeout = () => -1;

                        return asyncWrapper(assert, promise => {
                            steps.forEach(({ appointmentRects, offset }) => {
                                promise = asyncScrollTest(
                                    assert,
                                    promise,
                                    () => {
                                        assert.equal(
                                            this.scheduler.appointments.getAppointmentCount(),
                                            appointmentRects.length,
                                            `Appointment count is correct if scrollX: ${offset.x}, scrollY: ${offset.y}`
                                        );

                                        appointmentRects.forEach((expectedRect, index) => {
                                            const appointmentRect = this.scheduler.appointments
                                                .getAppointment(index)
                                                .get(0)
                                                .getBoundingClientRect();

                                            assert.roughEqual(appointmentRect.left, expectedRect.left, 2.01, `appointment part #${index} left is correct`);
                                            assert.roughEqual(appointmentRect.top, expectedRect.top, 2.01, `appointment part #${index} top is correct`);
                                            assert.roughEqual(appointmentRect.height, expectedRect.height, 2.01, `appointment part #${index} height is correct`);
                                        });
                                    },
                                    scrollable,
                                    offset
                                );
                            });

                            return promise;
                        });
                    });
                });

                test('Appointment with multiple resources should be rendered correctly if horizontal grouping', function(assert) {
                    const data = [{
                        startDate: new Date(2020, 9, 12, 1, 30),
                        endDate: new Date(2020, 9, 12, 22, 30),
                        priorityId: [1, 2],
                    }];
                    this.createInstance({
                        dataSource: data,
                        currentView: 'week',
                        currentDate: new Date(2020, 9, 12),
                        groups: ['priorityId'],
                        resources: [{
                            fieldExpr: 'priorityId',
                            allowMultiple: true,
                            dataSource: [{ id: 1 }, { id: 2 }]
                        }],
                        scrolling: {
                            mode: 'virtual',
                            orientation: 'both'
                        },
                        height: 500,
                        width: 300
                    });

                    const { instance } = this.scheduler;
                    const workspace = instance.getWorkSpace();
                    const scrollable = workspace.getScrollable();

                    workspace.renderer.getRenderTimeout = () => -1;

                    return asyncWrapper(assert, promise => {
                        [
                            {
                                offset: { x: 0, y: 0 },
                                appointmentRects: [
                                    { left: -9874, top: -9689, height: 500 }
                                ]
                            },
                            {
                                offset: { x: 0, y: 1000 },
                                appointmentRects: [
                                    { left: -9874, top: -10039, height: 850 }
                                ]
                            },
                            {
                                offset: { x: 0, y: 2100 },
                                appointmentRects: [
                                    { left: -9874, top: -10151, height: 500 }
                                ]
                            },
                            {
                                offset: { x: 520, y: 0 },
                                appointmentRects: [
                                    { left: -9869, top: -9689, height: 500 }
                                ]
                            },
                            {
                                offset: { x: 520, y: 1000 },
                                appointmentRects: [
                                    { left: -9869, top: -10039, height: 850 }
                                ]
                            },
                            {
                                offset: { x: 520, y: 2100 },
                                appointmentRects: [
                                    { left: -9869, top: -10151, height: 500 }
                                ]
                            }
                        ].forEach(({ offset, appointmentRects }) => {
                            promise = asyncScrollTest(
                                assert,
                                promise,
                                () => {
                                    assert.equal(
                                        appointmentRects.length,
                                        this.scheduler.appointments.getAppointmentCount(),
                                        `Appointment count is correct when offsetX: ${offset.x}, offsetY: ${offset.y}`
                                    );

                                    appointmentRects.forEach((expectedRect, index) => {
                                        const appointmentRect = this.scheduler.appointments
                                            .getAppointment(index)
                                            .get(0)
                                            .getBoundingClientRect();

                                        assert.roughEqual(appointmentRect.left, expectedRect.left, 2.01, `appointment part #${index} left is correct`);
                                        assert.roughEqual(appointmentRect.top, expectedRect.top, 2.01, `appointment part #${index} top is correct`);
                                        assert.roughEqual(appointmentRect.height, expectedRect.height, 2.01, `appointment part #${index} height is correct`);
                                    });
                                },
                                scrollable,
                                offset
                            );
                        });

                        return promise;
                    });
                });
            });


            ['horizontal', 'vertical'].forEach(groupOrientation => {
                test(`A long appointment should be correctly croped if Week view  and "${groupOrientation}" group orientation`, function(assert) {
                    const longAppointment = {
                        startDate: new Date(2015, 2, 4, 0, 10),
                        endDate: new Date(2015, 2, 4, 23, 50)
                    };
                    this.createInstance({
                        currentDate: new Date(2015, 2, 4),
                        scrolling: {
                            mode: 'virtual'
                        },
                        views: [{
                            type: 'week',
                            groupOrientation: groupOrientation
                        }],
                        currentView: 'week',
                        dataSource: [longAppointment],
                        height: 400
                    });

                    const { instance } = this.scheduler;
                    const workspace = instance.getWorkSpace();
                    const { viewDataProvider } = workspace;
                    const scrollable = workspace.getScrollable();

                    workspace.renderer.getRenderTimeout = () => -1;

                    return asyncWrapper(assert, promise => {
                        [
                            1000, 1050, 1100, 1200, 1250, 1300, 1350, 1400, 1500, 2000
                        ].forEach(scrollY => {
                            promise = asyncScrollTest(
                                assert,
                                promise,
                                () => {

                                    const layoutManager = instance.getLayoutManager();
                                    const settings = layoutManager._positionMap[0][0];

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
                                        settings.info.appointment.startDate,
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

        module('Supported views', () => {
            supportedViews.forEach(viewName => {
                test(`Grouped appointment should contains correct groupIndex if "${viewName}" view has vertical group orientation`, function(assert) {
                    this.createInstance({
                        currentDate: new Date(2015, 2, 2),
                        views: [{
                            type: viewName,
                            groupOrientation: 'vertical'
                        }],
                        currentView: viewName,
                        scrolling: {
                            mode: 'virtual'
                        },
                        groups: ['resourceId0'],
                        resources: [{
                            fieldExpr: 'resourceId0',
                            dataSource: [{ id: 0 }]
                        }],
                        dataSource: [{
                            startDate: new Date(2015, 2, 2, 0),
                            endDate: new Date(2015, 2, 2, 0, 30),
                            resourceId0: 0
                        }],
                        height: 400,
                        width: 800
                    });

                    const { instance } = this.scheduler;

                    const layoutManager = instance.getLayoutManager();
                    const settings = layoutManager._positionMap[0][0];

                    assert.equal(settings.groupIndex, 0, 'groupIndex is correct');
                });

                test(`Grouped appointment should contains correct groupIndex if "${viewName}" view has horizontal group orientation`, function(assert) {
                    this.createInstance({
                        currentDate: new Date(2015, 2, 2),
                        views: [{
                            type: viewName,
                            groupOrientation: 'horizontal'
                        }],
                        currentView: viewName,
                        scrolling: {
                            mode: 'virtual'
                        },
                        groups: ['resourceId0'],
                        resources: [{
                            fieldExpr: 'resourceId0',
                            dataSource: [
                                { id: 0 },
                                { id: 1 }
                            ]
                        }],
                        dataSource: [{
                            startDate: new Date(2015, 2, 2, 0),
                            endDate: new Date(2015, 2, 2, 0, 30),
                            resourceId0: 1
                        }],
                        height: 400,
                        width: 800
                    });

                    const { instance } = this.scheduler;

                    const layoutManager = instance.getLayoutManager();
                    const settings = layoutManager._positionMap[0][0];

                    assert.equal(settings.groupIndex, 1, 'groupIndex is correct');
                });

                test(`Grouped allDay appointment should contains correct groupIndex if "${viewName}" view has vertical group orientation`, function(assert) {
                    this.createInstance({
                        currentDate: new Date(2015, 2, 2),
                        scrolling: {
                            mode: 'virtual'
                        },
                        views: [{
                            type: viewName,
                            groupOrientation: 'vertical'
                        }],
                        currentView: viewName,
                        groups: ['resourceId0'],
                        resources: [{
                            fieldExpr: 'resourceId0',
                            dataSource: [{ id: 0 }]
                        }],
                        dataSource: [{
                            startDate: new Date(2015, 2, 2),
                            endDate: new Date(2015, 2, 2),
                            resourceId0: 0,
                            allDay: true
                        }],
                        height: 400
                    });

                    const { instance } = this.scheduler;

                    const layoutManager = instance.getLayoutManager();
                    const settings = layoutManager._positionMap[0][0];

                    assert.equal(settings.groupIndex, 0, 'groupIndex is correct');
                });
            });
        });

        module('Recurrent appoitnments', () => {
            test('it should have correct settings in vertical group orientation', function(assert) {
                const data = [{
                    text: 'Test0',
                    priorityId: 1,
                    startDate: new Date(2020, 9, 7, 0, 0),
                    endDate: new Date(2020, 9, 7, 0, 15),
                    recurrenceRule: 'FREQ=HOURLY'
                }, {
                    text: 'Test1',
                    priorityId: 2,
                    startDate: new Date(2020, 9, 7, 0, 0),
                    endDate: new Date(2020, 9, 7, 1, 15),
                    recurrenceRule: 'FREQ=HOURLY'
                }];

                const instance = createWrapper({
                    dataSource: data,
                    views: [{
                        type: 'day',
                        groupOrientation: 'vertical',
                    }],
                    currentView: 'day',
                    scrolling: {
                        mode: 'virtual'
                    },
                    currentDate: new Date(2020, 9, 7),
                    groups: ['priorityId'],
                    resources: [{
                        fieldExpr: 'priorityId',
                        dataSource: [
                            { id: 1 },
                            { id: 2 }
                        ]
                    }],
                    height: 600
                }).instance;

                instance.getWorkSpace().renderer.getRenderTimeout = () => -1;

                const scrollable = instance.getWorkSpace().getScrollable();

                return asyncWrapper(assert, (promise) => {
                    [
                        {
                            offset: { y: 0 },
                            expectedSettings: [
                                {
                                    groupIndex: 0,
                                    topPositions: [50, 150, 250, 350, 450, 550, 650, 750]
                                }
                            ]
                        },
                        {
                            offset: { y: 2000 },
                            expectedSettings: [
                                {
                                    groupIndex: 0,
                                    topPositions: [1750, 1850, 1950, 2050, 2150, 2250, 2350]
                                },
                                {
                                    groupIndex: 1,
                                    topPositions: [2500, 2600, 2700]
                                },
                            ]
                        },
                        {
                            offset: { y: 4000 },
                            expectedSettings: [
                                {
                                    groupIndex: 1,
                                    topPositions: [3750, 3800, 3900, 4000, 4100, 4200, 4300, 4400, 4500, 4600, 4700]
                                }
                            ]
                        },
                    ].forEach(({ offset, expectedSettings }) => {
                        promise = asyncScrollTest(
                            assert,
                            promise,
                            () => {
                                instance.filteredItems.forEach((dataItem, index) => {
                                    const layoutManager = instance.getLayoutManager();
                                    const appointmentRenderingStrategy = layoutManager.getRenderingStrategyInstance();
                                    const settings = appointmentRenderingStrategy.generateAppointmentSettings(dataItem);
                                    const {
                                        groupIndex,
                                        topPositions
                                    } = expectedSettings[index];
                                    assert.equal(settings.length, topPositions.length, 'Settings amount is correct');
                                    topPositions.forEach((top, index) => {
                                        assert.equal(settings[index].groupIndex, groupIndex, `Appointment groupIndex "${groupIndex}" is correct for offsetY: ${offset.y}`);
                                        assert.equal(settings[index].top, top, `Appointment top position "${top}" is correct for offsetY: ${offset.y}`);
                                    });
                                });
                            },
                            scrollable,
                            offset
                        );
                    });

                    return promise;
                });
            });

            test('it should not have duplicates in horizontal group orientation', function(assert) {
                const data = [{
                    text: 'Test0',
                    priorityId: [1, 2],
                    startDate: new Date(2020, 10, 2, 9, 30),
                    endDate: new Date(2020, 10, 2, 11, 45),
                    recurrenceRule: 'FREQ=DAILY',
                }, {
                    text: 'Test1',
                    priorityId: [1, 2],
                    startDate: new Date(2020, 10, 2, 13, 30),
                    endDate: new Date(2020, 10, 2, 16, 45),
                    recurrenceRule: 'FREQ=DAILY',
                }];

                const scheduler = createWrapper({
                    dataSource: data,
                    views: [{
                        type: 'day',
                        cellDuration: 15,
                        intervalCount: 2
                    }],
                    currentView: 'day',
                    currentDate: new Date(2020, 10, 2),
                    startDayHour: 9,
                    groups: ['priorityId'],
                    resources: [{
                        fieldExpr: 'priorityId',
                        allowMultiple: false,
                        dataSource: [{ id: 1 }, { id: 2 }]
                    }],
                    height: 600,
                    width: 800,
                    scrolling: {
                        mode: 'virtual'
                    },
                });

                const { instance } = scheduler;

                instance.getWorkSpace().renderer.getRenderTimeout = () => -1;

                const scrollable = instance.getWorkSpace().getScrollable();

                return asyncWrapper(assert, (promise) => {
                    [
                        {
                            offsetY: 0,
                            expected: [
                                [{
                                    groupIndex: 0,
                                    left: 0,
                                    top: 100,
                                    height: 450
                                }, {
                                    groupIndex: 0,
                                    left: 175,
                                    top: 100,
                                    height: 450
                                }, {
                                    groupIndex: 1,
                                    left: 350,
                                    top: 100,
                                    height: 450
                                }, {
                                    groupIndex: 1,
                                    left: 523,
                                    top: 100,
                                    height: 450
                                }],
                                []
                            ]
                        },
                        {
                            offsetY: 500,
                            expected: [
                                [{
                                    groupIndex: 0,
                                    left: 0,
                                    top: 250,
                                    height: 300
                                }, {
                                    groupIndex: 0,
                                    left: 175,
                                    top: 250,
                                    height: 300
                                }, {
                                    groupIndex: 1,
                                    left: 350,
                                    top: 250,
                                    height: 300
                                }, {
                                    groupIndex: 1,
                                    left: 523,
                                    top: 250,
                                    height: 300
                                }],
                                [{
                                    groupIndex: 0,
                                    left: 0,
                                    top: 900,
                                    height: 400
                                }, {
                                    groupIndex: 0,
                                    left: 175,
                                    top: 900,
                                    height: 400
                                }, {
                                    groupIndex: 1,
                                    left: 350,
                                    top: 900,
                                    height: 400
                                }, {
                                    groupIndex: 1,
                                    left: 523,
                                    top: 900,
                                    height: 400
                                }]
                            ]
                        },
                        {
                            offsetY: 900,
                            expected: [
                                [],
                                [{
                                    groupIndex: 0,
                                    left: 0,
                                    top: 900,
                                    height: 650
                                }, {
                                    groupIndex: 0,
                                    left: 175,
                                    top: 900,
                                    height: 650
                                }, {
                                    groupIndex: 1,
                                    left: 350,
                                    top: 900,
                                    height: 650
                                }, {
                                    groupIndex: 1,
                                    left: 523,
                                    top: 900,
                                    height: 650
                                }]]
                        },
                        {
                            offsetY: 500,
                            expected: [
                                [{
                                    groupIndex: 0,
                                    left: 0,
                                    top: 250,
                                    height: 300
                                }, {
                                    groupIndex: 0,
                                    left: 175,
                                    top: 250,
                                    height: 300
                                }, {
                                    groupIndex: 1,
                                    left: 350,
                                    top: 250,
                                    height: 300
                                }, {
                                    groupIndex: 1,
                                    left: 523,
                                    top: 250,
                                    height: 300
                                }],
                                [{
                                    groupIndex: 0,
                                    left: 0,
                                    top: 900,
                                    height: 400
                                }, {
                                    groupIndex: 0,
                                    left: 175,
                                    top: 900,
                                    height: 400
                                }, {
                                    groupIndex: 1,
                                    left: 350,
                                    top: 900,
                                    height: 400
                                }, {
                                    groupIndex: 1,
                                    left: 523,
                                    top: 900,
                                    height: 400
                                }]
                            ]
                        }
                    ].forEach(({ offsetY, expected }) => {
                        promise = asyncScrollTest(
                            assert,
                            promise,
                            () => {
                                const items = instance._appointments.option('items');

                                assert.equal(items.length, expected.length, `Appointments amount is correct for offsetY=${offsetY}`);

                                expected.forEach((expect, index) => {
                                    const { settings } = items[index];

                                    assert.equal(settings.length, expect.length, `Appointment settings amount ${settings.length} is correct`);

                                    settings.forEach((setting, index) => {
                                        const {
                                            left,
                                            top,
                                            groupIndex,
                                            height
                                        } = expect[index];

                                        assert.equal(setting.groupIndex, groupIndex, `Settings groupIndex ${setting.groupIndex} is correct`);
                                        assert.roughEqual(setting.top, top, 1.01, `Settings top ${setting.top} is correct`);
                                        assert.roughEqual(setting.left, left, 1.01, `Settings left ${setting.left} is correct`);
                                        assert.equal(setting.height, height, `Settings height ${setting.height} is correct`);
                                    });
                                });
                            },
                            scrollable,
                            { y: offsetY }
                        );
                    });

                    return promise;
                });
            });

            test('Recurrent all day appoitment with multiple resources should be rendered correctly if horizontal grouping', function(assert) {
                this.createInstance({
                    dataSource: [{
                        text: 'allDay recurrent',
                        startDate: new Date(2021, 8, 6, 9, 30),
                        endDate: new Date(2021, 8, 6, 11, 30),
                        priorityId: [1, 3, 5, 9, 12],
                        recurrenceRule: 'FREQ=DAILY',
                        allDay: true,
                    }],
                    currentView: 'week',
                    startDayHour: 9,
                    endDayHour: 18,
                    currentDate: new Date(2021, 8, 6),
                    groups: ['priorityId'],
                    resources: [{
                        fieldExpr: 'priorityId',
                        allowMultiple: true,
                        dataSource: [
                            { id: 1, label: 'rc_1' }, { id: 2 }, { id: 3 }, { id: 4 },
                            { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 },
                            { id: 9 }, { id: 10 }, { id: 11 }, { id: 12 },
                            { id: 13 }, { id: 14 }, { id: 15 }, { id: 16 }
                        ]
                    }],
                    scrolling: {
                        mode: 'virtual',
                        orientation: 'both'
                    },
                    height: 600,
                    width: 800
                });

                const { instance } = this.scheduler;
                const scrollable = instance.getWorkSpaceScrollable();

                instance.getWorkSpace().renderer.getRenderTimeout = () => -1;

                return asyncWrapper(assert, promise => {
                    [
                        {
                            offset: { x: 0 },
                            appointmentRects: [
                                { left: -9824, top: -9864, height: 25, width: 75 },
                                { left: -9749, top: -9864, height: 25, width: 75 },
                                { left: -9674, top: -9864, height: 25, width: 75 },
                                { left: -9599, top: -9864, height: 25, width: 75 },
                                { left: -9524, top: -9864, height: 25, width: 75 },
                                { left: -9449, top: -9864, height: 25, width: 75 },
                                { left: -8774, top: -9864, height: 25, width: 75 },
                            ]
                        },
                        {
                            offset: { x: 500 },
                            appointmentRects: [
                                { left: -10324, top: -9864, height: 25, width: 75 },
                                { left: -10249, top: -9864, height: 25, width: 75 },
                                { left: -10174, top: -9864, height: 25, width: 75 },
                                { left: -10099, top: -9864, height: 25, width: 75 },
                                { left: -10024, top: -9864, height: 25, width: 75 },
                                { left: -9949, top: -9864, height: 25, width: 75 },
                                { left: -9274, top: -9864, height: 25, width: 75 },
                                { left: -9199, top: -9864, height: 25, width: 75 },
                                { left: -9124, top: -9864, height: 25, width: 75 },
                                { left: -9049, top: -9864, height: 25, width: 75 },
                                { left: -8974, top: -9864, height: 25, width: 75 },
                                { left: -8899, top: -9864, height: 25, width: 75 }
                            ]
                        },
                        {
                            offset: { x: 1000 },
                            appointmentRects: [
                                { left: -9774, top: -9864, height: 25, width: 75 },
                                { left: -9699, top: -9864, height: 25, width: 75 },
                                { left: -9624, top: -9864, height: 25, width: 75 },
                                { left: -9549, top: -9864, height: 25, width: 75 },
                                { left: -9474, top: -9864, height: 25, width: 75 },
                                { left: -9399, top: -9864, height: 25, width: 75 }
                            ]
                        },
                        {
                            offset: { x: 1500 },
                            appointmentRects: [
                                { left: -10274, top: -9864, height: 25, width: 75 },
                                { left: -10199, top: -9864, height: 25, width: 75 },
                                { left: -10124, top: -9864, height: 25, width: 75 },
                                { left: -10049, top: -9864, height: 25, width: 75 },
                                { left: -9974, top: -9864, height: 25, width: 75 },
                                { left: -9899, top: -9864, height: 25, width: 75 },
                                { left: -9224, top: -9864, height: 25, width: 75 },
                                { left: -9149, top: -9864, height: 25, width: 75 },
                                { left: -9074, top: -9864, height: 25, width: 75 },
                                { left: -8999, top: -9864, height: 25, width: 75 },
                                { left: -8924, top: -9864, height: 25, width: 75 },
                                { left: -8849, top: -9864, height: 25, width: 75 }
                            ]
                        },
                        {
                            offset: { x: 2000 },
                            appointmentRects: [
                                { left: -9724, top: -9864, height: 25, width: 75 },
                                { left: -9649, top: -9864, height: 25, width: 75 },
                                { left: -9574, top: -9864, height: 25, width: 75 },
                                { left: -9499, top: -9864, height: 25, width: 75 },
                                { left: -9424, top: -9864, height: 25, width: 75 },
                                { left: -9349, top: -9864, height: 25, width: 75 }
                            ]
                        },
                        {
                            offset: { x: 4200 },
                            appointmentRects: [
                                { left: -9824, top: -9864, height: 25, width: 75 },
                                { left: -9749, top: -9864, height: 25, width: 75 },
                                { left: -9674, top: -9864, height: 25, width: 75 },
                                { left: -9599, top: -9864, height: 25, width: 75 },
                                { left: -9524, top: -9864, height: 25, width: 75 },
                                { left: -9449, top: -9864, height: 25, width: 75 }
                            ]
                        },
                        {
                            offset: { x: 5700 },
                            appointmentRects: [
                                { left: -9749, top: -9864, height: 25, width: 75 },
                                { left: -9674, top: -9864, height: 25, width: 75 },
                                { left: -9599, top: -9864, height: 25, width: 75 },
                                { left: -9524, top: -9864, height: 25, width: 75 },
                                { left: -9449, top: -9864, height: 25, width: 75 },
                                { left: -9374, top: -9864, height: 25, width: 75 }
                            ]
                        },
                        {
                            offset: { x: 7000 },
                            appointmentRects: []
                        }
                    ].forEach(({ offset, appointmentRects }) => {
                        promise = asyncScrollTest(
                            assert,
                            promise,
                            () => {
                                assert.equal(
                                    appointmentRects.length,
                                    this.scheduler.appointments.getAppointmentCount(),
                                    `Appointment count is correct when offsetX: ${offset.x}`
                                );

                                appointmentRects.forEach((expectedRect, index) => {
                                    const appointmentRect = this.scheduler.appointments
                                        .getAppointment(index)
                                        .get(0)
                                        .getBoundingClientRect();

                                    assert.roughEqual(appointmentRect.left, expectedRect.left, 2.01, `appointment part #${index} left is correct`);
                                    assert.roughEqual(appointmentRect.top, expectedRect.top, 2.01, `appointment part #${index} top is correct`);
                                    assert.roughEqual(appointmentRect.height, expectedRect.height, 2.01, `appointment part #${index} height is correct`);
                                    assert.roughEqual(appointmentRect.width, expectedRect.width, 2.01, `appointment part #${index} width is correct`);
                                });
                            },
                            scrollable,
                            offset,
                            200
                        );
                    });

                    return promise;
                });
            });
        });

        test('A vertically grouped long recurrent appointment should not have duplicates', function(assert) {
            const data = [{
                text: 'Website Re-Design Plan',
                priorityId: [1, 2],
                startDate: new Date(2020, 10, 2, 9, 30),
                endDate: new Date(2020, 10, 2, 11, 45),
                recurrenceRule: 'FREQ=DAILY',
            }];
            const scheduler = createWrapper({
                dataSource: data,
                views: [{
                    type: 'day',
                    groupOrientation: 'vertical',
                    cellDuration: 15,
                    intervalCount: 2
                }],
                currentView: 'day',
                currentDate: new Date(2020, 10, 2),
                startDayHour: 9,
                endDayHour: 13,
                groups: ['priorityId'],
                resources: [{
                    fieldExpr: 'priorityId',
                    allowMultiple: false,
                    dataSource: [{ id: 1 }, { id: 2 }]
                }],
                height: 600,
                scrolling: {
                    mode: 'virtual'
                },
            });

            const { instance } = scheduler;

            instance.getWorkSpace().renderer.getRenderTimeout = () => -1;

            const scrollable = instance.getWorkSpace().getScrollable();

            return asyncWrapper(assert, (promise) => {
                [
                    {
                        offsetY: 0,
                        expected: [{
                            groupIndex: 0,
                            top: 150,
                            height: 450
                        }, {
                            groupIndex: 0,
                            top: 150,
                            height: 450
                        }]
                    },
                    {
                        offsetY: 550,
                        expected: [{
                            groupIndex: 0,
                            top: 300,
                            height: 300
                        }, {
                            groupIndex: 0,
                            top: 300,
                            height: 300
                        }, {
                            groupIndex: 1,
                            top: 1000,
                            height: 350
                        }, {
                            groupIndex: 1,
                            top: 1000,
                            height: 350
                        }]
                    },
                    {
                        offsetY: 950,
                        expected: [{
                            groupIndex: 1,
                            top: 1000,
                            height: 450
                        }, {
                            groupIndex: 1,
                            top: 1000,
                            height: 450
                        }]
                    },
                    {
                        offsetY: 590,
                        expected: [{
                            groupIndex: 0,
                            top: 300,
                            height: 300
                        }, {
                            groupIndex: 0,
                            top: 300,
                            height: 300
                        }, {
                            groupIndex: 1,
                            top: 1000,
                            height: 350
                        }, {
                            groupIndex: 1,
                            top: 1000,
                            height: 350
                        }]
                    }
                ].forEach(option => {
                    const {
                        offsetY,
                        expected
                    } = option;

                    promise = asyncScrollTest(
                        assert,
                        promise,
                        () => {
                            const items = instance._appointments.option('items');

                            assert.equal(items.length, 1, `Appointments amount is correct for offsetY=${offsetY}`);

                            const { settings } = items[0];

                            assert.equal(settings.length, expected.length, `Appointment settings amount ${settings.length} is correct`);

                            settings.forEach((setting, index) => {
                                const {
                                    top,
                                    groupIndex,
                                    height
                                } = expected[index];

                                assert.equal(setting.groupIndex, groupIndex, `Settings groupIndex ${setting.groupIndex} is correct`);
                                assert.equal(setting.top, top, `Settings top ${setting.top} is correct`);
                                assert.equal(setting.height, height, `Settings height ${setting.height} is correct`);
                            });
                        },
                        scrollable,
                        { y: offsetY }
                    );
                });

                return promise;
            });
        });
    });

    module('Appointment filtering', function() {
        module('Init', function() {
            ['vertical', 'horizontal'].forEach(groupOrientation => {
                test(`Should be filtered correctly when groupOrientation: ${groupOrientation}`, function(assert) {
                    const data = [
                        {
                            startDate: new Date(2016, 9, 5, 0, 0),
                            endDate: new Date(2016, 9, 5, 0, 30),
                            text: 'test_00'
                        },
                        {
                            startDate: new Date(2016, 9, 5, 2),
                            endDate: new Date(2016, 9, 5, 3),
                            text: 'test_01'
                        },
                        {
                            startDate: new Date(2016, 9, 5, 4),
                            endDate: new Date(2016, 9, 5, 4, 1),
                            text: 'test_02'
                        },
                        {
                            startDate: new Date(2016, 9, 5, 12),
                            endDate: new Date(2016, 9, 5, 13),
                            text: 'test_03'
                        },
                        {
                            startDate: new Date(2016, 9, 5, 18),
                            endDate: new Date(2016, 9, 5, 20),
                            text: 'test_04'
                        }
                    ];

                    const { instance } = createWrapper({
                        dataSource: data,
                        currentDate: new Date(2016, 9, 5),
                        views: [{
                            type: 'day',
                            groupOrientation: groupOrientation,
                        }],
                        currentView: 'day',
                        scrolling: {
                            mode: 'virtual',
                            orientation: 'vertical'
                        },
                        height: 400
                    });

                    const filteredItems = instance.filteredItems;

                    assert.equal(filteredItems.length, 3, 'Filtered items length is correct');
                    assert.deepEqual(filteredItems[0], data[0], 'Filtered item 0 is correct');
                    assert.deepEqual(filteredItems[1], data[1], 'Filtered item 1 is correct');
                    assert.deepEqual(filteredItems[2], data[2], 'Filtered item 2 is correct');
                });

                test(`Should be filtered correctly with resources when groupOrientation: ${groupOrientation}`, function(assert) {
                    const data = [
                        {
                            startDate: new Date(2016, 9, 5, 0, 0),
                            endDate: new Date(2016, 9, 5, 0, 30),
                            resourceId0: 0,
                            text: 'test_00'
                        },
                        {
                            startDate: new Date(2016, 9, 5, 2),
                            endDate: new Date(2016, 9, 5, 3),
                            resourceId0: 1,
                            text: 'test_01'
                        },
                        {
                            startDate: new Date(2016, 9, 5, 4),
                            endDate: new Date(2016, 9, 5, 4, 1),
                            resourceId0: 0,
                            text: 'test_02'
                        },
                        {
                            startDate: new Date(2016, 9, 5, 12),
                            endDate: new Date(2016, 9, 5, 13),
                            resourceId0: 1,
                            text: 'test_03'
                        },
                        {
                            startDate: new Date(2016, 9, 5, 18),
                            endDate: new Date(2016, 9, 5, 20),
                            resourceId0: 0,
                            text: 'test_04'
                        }
                    ];

                    const { instance } = createWrapper({
                        dataSource: data,
                        currentDate: new Date(2016, 9, 5),
                        views: [{
                            type: 'day',
                            groupOrientation: groupOrientation,
                        }],
                        currentView: 'day',
                        scrolling: {
                            mode: 'virtual'
                        },
                        resources: [{
                            fieldExpr: 'resourceId0',
                            dataSource: [
                                { text: 'Rc0_0', id: 0, color: '#727bd2' },
                                { text: 'Rc0_1', id: 1, color: '#32c9ed' },
                            ],
                            label: 'Resource0'
                        }],
                        height: 400
                    });

                    const filteredItems = instance.filteredItems;

                    assert.equal(filteredItems.length, 3, 'Filtered items length is correct');
                    assert.deepEqual(filteredItems[0], data[0], 'Filtered item 0 is correct');
                    assert.deepEqual(filteredItems[1], data[1], 'Filtered item 1 is correct');
                    assert.deepEqual(filteredItems[2], data[2], 'Filtered item 2 is correct');
                });
            });

            test('Grouped appointments should be filtered correctly when groupOrientation: "vertical"', function(assert) {
                const data = [
                    {
                        startDate: new Date(2016, 9, 5, 0, 0),
                        endDate: new Date(2016, 9, 5, 0, 30),
                        resourceId0: 0,
                        text: 'test_00'
                    },
                    {
                        startDate: new Date(2016, 9, 5, 2),
                        endDate: new Date(2016, 9, 5, 3),
                        resourceId0: 1,
                        text: 'test_01'
                    },
                    {
                        startDate: new Date(2016, 9, 5, 4),
                        endDate: new Date(2016, 9, 5, 4, 1),
                        resourceId0: 0,
                        text: 'test_02'
                    },
                    {
                        startDate: new Date(2016, 9, 5, 12),
                        endDate: new Date(2016, 9, 5, 13),
                        resourceId0: 1,
                        text: 'test_03'
                    },
                    {
                        startDate: new Date(2016, 9, 5, 18),
                        endDate: new Date(2016, 9, 5, 20),
                        resourceId0: 0,
                        text: 'test_04'
                    }
                ];

                const { instance } = createWrapper({
                    dataSource: data,
                    currentDate: new Date(2016, 9, 5),
                    views: [{
                        type: 'day',
                        groupOrientation: 'vertical',
                    }],
                    currentView: 'day',
                    scrolling: {
                        mode: 'virtual'
                    },
                    groups: ['resourceId0'],
                    resources: [{
                        fieldExpr: 'resourceId0',
                        dataSource: [
                            { text: 'Rc0_0', id: 0, color: '#727bd2' },
                            { text: 'Rc0_1', id: 1, color: '#32c9ed' },
                        ],
                        label: 'Resource0'
                    }],
                    height: 400,
                    width: 800
                });

                const filteredItems = instance.filteredItems;

                assert.equal(filteredItems.length, 2, 'Filtered items length is correct');
                assert.deepEqual(filteredItems[0], data[0], 'Filtered item 0 is correct');
                assert.deepEqual(filteredItems[1], data[2], 'Filtered item 1 is correct');
            });

            test('Grouped appointments should be filtered correctly when groupOrientation: "horizontal"', function(assert) {
                const data = [
                    {
                        startDate: new Date(2016, 9, 5, 0, 0),
                        endDate: new Date(2016, 9, 5, 0, 30),
                        resourceId0: 0,
                        text: 'test_00'
                    },
                    {
                        startDate: new Date(2016, 9, 5, 2),
                        endDate: new Date(2016, 9, 5, 3),
                        resourceId0: 1,
                        text: 'test_01'
                    },
                    {
                        startDate: new Date(2016, 9, 5, 4),
                        endDate: new Date(2016, 9, 5, 4, 1),
                        resourceId0: 0,
                        text: 'test_02'
                    },
                    {
                        startDate: new Date(2016, 9, 5, 12),
                        endDate: new Date(2016, 9, 5, 13),
                        resourceId0: 1,
                        text: 'test_03'
                    },
                    {
                        startDate: new Date(2016, 9, 5, 18),
                        endDate: new Date(2016, 9, 5, 20),
                        resourceId0: 0,
                        text: 'test_04'
                    }
                ];

                const { instance } = createWrapper({
                    dataSource: data,
                    currentDate: new Date(2016, 9, 5),
                    views: [{
                        type: 'day',
                        groupOrientation: 'horizontal',
                    }],
                    currentView: 'day',
                    scrolling: {
                        mode: 'virtual'
                    },
                    groups: ['resourceId0'],
                    resources: [{
                        fieldExpr: 'resourceId0',
                        dataSource: [
                            { text: 'Rc0_0', id: 0, color: '#727bd2' },
                            { text: 'Rc0_1', id: 1, color: '#32c9ed' },
                        ],
                        label: 'Resource0'
                    }],
                    height: 400,
                    width: 800
                });

                const filteredItems = instance.filteredItems;

                assert.equal(filteredItems.length, 3, 'Filtered items length is correct');
                assert.deepEqual(filteredItems[0], data[0], 'Filtered item 0 is correct');
                assert.deepEqual(filteredItems[1], data[1], 'Filtered item 1 is correct');
                assert.deepEqual(filteredItems[2], data[2], 'Filtered item 2 is correct');
            });

            test('Recurrent appointments should be filtered correctly in vertical group orientation', function(assert) {
                const data = [{
                    text: 'Test0',
                    priorityId: 1,
                    startDate: new Date(2020, 9, 7, 0, 0),
                    endDate: new Date(2020, 9, 7, 0, 15),
                    recurrenceRule: 'FREQ=HOURLY'
                }, {
                    text: 'Test1',
                    priorityId: 2,
                    startDate: new Date(2020, 9, 7, 0, 0),
                    endDate: new Date(2020, 9, 7, 1, 15),
                    recurrenceRule: 'FREQ=HOURLY'
                }];

                const { instance } = createWrapper({
                    dataSource: data,
                    views: [{
                        type: 'day',
                        groupOrientation: 'vertical',
                    }],
                    currentView: 'day',
                    scrolling: {
                        mode: 'virtual'
                    },
                    currentDate: new Date(2020, 9, 7),
                    groups: ['priorityId'],
                    resources: [{
                        fieldExpr: 'priorityId',
                        dataSource: [
                            { id: 1 },
                            { id: 2 }
                        ]
                    }],
                    height: 600
                });

                instance.getWorkSpace().renderer.getRenderTimeout = () => -1;

                const scrollable = instance.getWorkSpace().getScrollable();

                return asyncWrapper(assert, promise => {
                    [
                        { offsetY: 0, expectedDataIndices: [0] },
                        { offsetY: 500, expectedDataIndices: [0] },
                        { offsetY: 1000, expectedDataIndices: [0] },
                        { offsetY: 2000, expectedDataIndices: [0, 1] },
                        { offsetY: 2500, expectedDataIndices: [0, 1] },
                        { offsetY: 4000, expectedDataIndices: [1] },
                        { offsetY: 4500, expectedDataIndices: [1] },
                    ].forEach(option => {
                        promise = asyncScrollTest(
                            assert,
                            promise,
                            () => {
                                const filteredItems = instance.filteredItems;

                                const { expectedDataIndices } = option;
                                assert.equal(filteredItems.length, expectedDataIndices.length, 'Filtered items length is correct');

                                expectedDataIndices.forEach((dataIndex, index) => {
                                    assert.deepEqual(filteredItems[index], data[dataIndex], `Filtered item "${index}" is correct`);
                                });
                            },
                            scrollable,
                            { y: option.offsetY }
                        );
                    });

                    return promise;
                });
            });
        });

        module('Scrolling', {
            beforeEach: function() {
                this.data = [
                    {
                        startDate: new Date(2016, 9, 5, 0, 0),
                        endDate: new Date(2016, 9, 5, 0, 30),
                        resourceId0: 0,
                        text: 'test_00'
                    },
                    {
                        startDate: new Date(2016, 9, 5, 2),
                        endDate: new Date(2016, 9, 5, 3),
                        resourceId0: 1,
                        text: 'test_10'
                    },
                    {
                        startDate: new Date(2016, 9, 5, 4, 0),
                        endDate: new Date(2016, 9, 5, 4, 1),
                        resourceId0: 0,
                        text: 'test_01'
                    },
                    {
                        startDate: new Date(2016, 9, 5, 12),
                        endDate: new Date(2016, 9, 5, 13),
                        resourceId0: 1,
                        text: 'test_11'
                    },
                    {
                        startDate: new Date(2016, 9, 5, 18),
                        endDate: new Date(2016, 9, 5, 20),
                        resourceId0: 0,
                        text: 'test_02'
                    },
                    {
                        startDate: new Date(2016, 9, 5, 13),
                        endDate: new Date(2016, 9, 5, 23),
                        resourceId0: 0,
                        text: 'test_03'
                    }
                ];

                this.createInstance = function(options) {

                    options = options || {};

                    options = $.extend(false, {
                        dataSource: this.data,
                        currentDate: new Date(2016, 9, 5),
                        views: [{
                            type: 'day',
                            groupOrientation: 'vertical',
                        }],
                        currentView: 'day',
                        scrolling: {
                            mode: 'virtual',
                            orientation: 'both'
                        },
                        height: 400
                    }, options);

                    this.instance = createWrapper(options).instance;

                    this.instance
                        .getWorkSpace()
                        .renderer.getRenderTimeout = () => -1;
                };
            }
        }, function() {
            module('Vertical grouping', () => {
                test('Scroll Down', function(assert) {
                    this.createInstance();

                    const { instance } = this;

                    return asyncWrapper(assert, promise => {
                        [
                            { offset: { y: 0 }, expectedIndices: [0, 1, 2] },
                            { offset: { y: 300 }, expectedIndices: [1, 2] },
                            { offset: { y: 900 }, expectedIndices: [3, 5] },
                            { offset: { y: 1700 }, expectedIndices: [4, 5] },
                            { offset: { y: 2400 }, expectedIndices: [4, 5] }
                        ].forEach(({ offset, expectedIndices }) => {
                            const scrollable = instance.getWorkSpaceScrollable();

                            promise = asyncScrollTest(
                                assert,
                                promise,
                                () => {
                                    const filteredItems = this.instance.filteredItems;

                                    assert.equal(filteredItems.length, expectedIndices.length, 'Filtered items length is correct');

                                    filteredItems.forEach((_, index) => {
                                        const expected = this.data[expectedIndices[index]];
                                        assert.deepEqual(filteredItems[index], expected, `Filtered item "${index}" is correct`);
                                    });
                                },
                                scrollable,
                                offset
                            );
                        });

                        return promise;
                    });
                });

                test('Scroll Up', function(assert) {
                    this.createInstance();

                    const { instance } = this;

                    return asyncWrapper(assert, promise => {
                        [
                            { y: 2400, expectedIndices: [4, 5] },
                            { y: 1700, expectedIndices: [4, 5] },
                            { y: 900, expectedIndices: [3, 5] },
                            { y: 300, expectedIndices: [1, 2] },
                            { y: 0, expectedIndices: [0, 1, 2] }
                        ].forEach(option => {
                            const { expectedIndices } = option;
                            const scrollable = instance.getWorkSpaceScrollable();

                            promise = asyncScrollTest(
                                assert,
                                promise,
                                () => {
                                    const filteredItems = this.instance.filteredItems;

                                    assert.equal(filteredItems.length, expectedIndices.length, `Filtered items length is correct if scrollOffset: ${option.y}`);

                                    filteredItems.forEach((_, index) => {
                                        const expected = this.data[expectedIndices[index]];
                                        assert.deepEqual(filteredItems[index], expected, `Filtered item "${index}" is correct`);
                                    });
                                },
                                scrollable,
                                { y: option.y }
                            );
                        });

                        return promise;
                    });
                });

                test('Scroll Down if groups and resources', function(assert) {
                    this.createInstance({
                        groups: ['resourceId0'],
                        resources: [{
                            fieldExpr: 'resourceId0',
                            dataSource: [
                                { text: 'Rc0_0', id: 0, color: '#727bd2' },
                                { text: 'Rc0_1', id: 1, color: '#32c9ed' },
                                { text: 'Rc0_2', id: 2, color: '#52c9ed' },
                            ],
                            label: 'Resource0'
                        }]
                    });

                    const { instance } = this;

                    return asyncWrapper(assert, promise => {
                        [
                            { y: 0, expectedIndices: [0, 2] },
                            { y: 300, expectedIndices: [2] },
                            { y: 900, expectedIndices: [5] },
                            { y: 1700, expectedIndices: [4, 5] },
                            { y: 2400, expectedIndices: [1, 5] },
                            { y: 2700, expectedIndices: [1] },
                            { y: 3000, expectedIndices: [] },
                            { y: 3300, expectedIndices: [3] },
                            { y: 4300, expectedIndices: [] },
                        ].forEach(option => {
                            const { expectedIndices } = option;
                            const scrollable = instance.getWorkSpaceScrollable();

                            promise = asyncScrollTest(
                                assert,
                                promise,
                                () => {
                                    const filteredItems = this.instance.filteredItems;

                                    assert.equal(filteredItems.length, expectedIndices.length, `ScrollY: ${option.y}. Filtered items length is correct`);

                                    filteredItems.forEach((_, index) => {
                                        const expected = this.data[expectedIndices[index]];
                                        assert.deepEqual(filteredItems[index], expected, `Filtered item "${index}" is correct`);
                                    });
                                },
                                scrollable,
                                { y: option.y }
                            );
                        });

                        return promise;
                    });
                });

                test('Next day appointments should be filtered', function(assert) {
                    this.createInstance({
                        groups: ['resourceId0'],
                        dataSource: [{
                            startDate: new Date(2016, 9, 6, 23),
                            endDate: new Date(2016, 9, 6, 23, 23),
                            resourceId0: 0,
                            text: 'test_00'
                        }, {
                            startDate: new Date(2016, 9, 6, 23),
                            endDate: new Date(2016, 9, 6, 23, 23),
                            resourceId0: 1,
                            text: 'test_10'
                        }],
                        resources: [{
                            fieldExpr: 'resourceId0',
                            dataSource: [
                                { text: 'Rc0_0', id: 0, color: '#727bd2' },
                                { text: 'Rc0_1', id: 1, color: '#32c9ed' }
                            ],
                            label: 'Resource0'
                        }]
                    });

                    const { instance } = this;

                    return asyncWrapper(assert, promise => {
                        const scrollable = instance.getWorkSpaceScrollable();

                        [0, 300, 900, 1700, 2400, 2700, 3000, 3300, 4300].forEach(scrollY => {
                            promise = asyncScrollTest(
                                assert,
                                promise,
                                () => {
                                    const filteredItems = this.instance.filteredItems;

                                    assert.equal(
                                        filteredItems.length,
                                        0,
                                        `scrollY: ${scrollY}, filtered items length is correct `
                                    );
                                },
                                scrollable,
                                { y: scrollY }
                            );
                        });

                        return promise;
                    });
                });

                test('All day appointment should be rendered correctly on the next page', function(assert) {
                    const data = [{
                        startDate: new Date(2020, 9, 12, 9, 30),
                        endDate: new Date(2020, 9, 12, 10, 30),
                        allDay: true,
                        priorityId: 2,
                    }];

                    this.createInstance({
                        dataSource: data,
                        views: [{
                            type: 'week',
                            groupOrientation: 'vertical'
                        }],
                        currentView: 'week',
                        currentDate: new Date(2020, 9, 12),
                        startDayHour: 9,
                        endDayHour: 16,
                        groups: ['priorityId'],
                        resources: [{
                            fieldExpr: 'priorityId',
                            allowMultiple: false,
                            dataSource: [{ id: 1 }, { id: 2 }]
                        }],
                        height: 500,
                        width: 600
                    });

                    const scrollable = this.instance.getWorkSpace().getScrollable();

                    return asyncWrapper(assert, promise => {
                        return asyncScrollTest(
                            assert,
                            promise,
                            () => {
                                const filteredItems = this.instance.filteredItems;

                                assert.equal(filteredItems.length, 1, 'Filtered items length is correct');
                                assert.deepEqual(filteredItems[0], data[0], 'Filtered item is correct');
                            },
                            scrollable,
                            { y: 600 }
                        );
                    });
                });
            });

            module('Horizontal grouping', {
                beforeEach: function() {
                    this.data = [
                        {
                            startDate: new Date(2016, 9, 5, 0, 0),
                            endDate: new Date(2016, 9, 5, 0, 30),
                            resourceId0: 0,
                            text: 'test_00'
                        },
                        {
                            startDate: new Date(2016, 9, 5, 11),
                            endDate: new Date(2016, 9, 5, 12),
                            resourceId0: 1,
                            text: 'test_01'
                        },
                        {
                            startDate: new Date(2016, 9, 5, 1, 30),
                            endDate: new Date(2016, 9, 5, 2, 30),
                            resourceId0: 2,
                            text: 'test_02'
                        },
                        {
                            startDate: new Date(2016, 9, 5, 11, 30),
                            endDate: new Date(2016, 9, 5, 12, 30),
                            resourceId0: 3,
                            text: 'test_03'
                        },
                        {
                            startDate: new Date(2016, 9, 5, 18),
                            endDate: new Date(2016, 9, 5, 20),
                            resourceId0: 4,
                            text: 'test_04'
                        },
                        {
                            startDate: new Date(2016, 9, 5, 13),
                            endDate: new Date(2016, 9, 5, 23),
                            resourceId0: 5,
                            text: 'test_05'
                        },
                        {
                            startDate: new Date(2016, 9, 5, 13),
                            endDate: new Date(2016, 9, 5, 23),
                            resourceId0: 6,
                            text: 'test_06'
                        },
                        {
                            startDate: new Date(2016, 9, 5, 13),
                            endDate: new Date(2016, 9, 5, 23),
                            resourceId0: 7,
                            text: 'test_07'
                        },
                        {
                            startDate: new Date(2016, 9, 5, 13),
                            endDate: new Date(2016, 9, 5, 23),
                            resourceId0: 8,
                            text: 'test_08'
                        },
                        {
                            startDate: new Date(2016, 9, 5, 13),
                            endDate: new Date(2016, 9, 5, 23),
                            resourceId0: 9,
                            text: 'test_09'
                        },
                        {
                            startDate: new Date(2016, 9, 5, 13),
                            endDate: new Date(2016, 9, 5, 23),
                            resourceId0: 10,
                            text: 'test_10'
                        }
                    ];

                    this.createInstance = function(options) {

                        options = options || {};

                        options = $.extend(false, {
                            dataSource: this.data,
                            currentDate: new Date(2016, 9, 5),
                            views: [{
                                type: 'day'
                            }],
                            currentView: 'day',
                            scrolling: {
                                mode: 'virtual',
                                orientation: 'both'
                            },
                            groups: ['resourceId0'],
                            resources: [{
                                fieldExpr: 'resourceId0',
                                dataSource: [
                                    { text: 'Rc0_0', id: 0 },
                                    { text: 'Rc0_1', id: 1 },
                                    { text: 'Rc0_3', id: 2 },
                                    { text: 'Rc0_4', id: 3 },
                                    { text: 'Rc0_5', id: 4 },
                                    { text: 'Rc0_6', id: 5 },
                                    { text: 'Rc0_7', id: 6 },
                                    { text: 'Rc0_8', id: 7 },
                                    { text: 'Rc0_9', id: 8 },
                                    { text: 'Rc0_10', id: 9 },
                                    { text: 'Rc0_11', id: 10 },
                                ]
                            }],
                            height: 400,
                            width: 600
                        }, options);

                        this.scheduler = createWrapper(options);
                        this.instance = this.scheduler.instance;

                        this.instance
                            .getWorkSpace()
                            .renderer.getRenderTimeout = () => -1;
                    };
                }
            }, () => {
                module('Regular appointmens', () => {
                    test('Scroll Right', function(assert) {
                        const $style = $('<style nonce="qunit-test">').text('#scheduler .dx-scheduler-cell-sizes-horizontal { width: 200px } ');
                        const styleBefore = $style.text();

                        $('#qunit-fixture').prepend($style);

                        this.createInstance();

                        const { instance } = this;

                        return asyncWrapper(assert, promise => {
                            [
                                {
                                    offset: { x: 0, y: 0 },
                                    expectedIndices: [0, 2],
                                    appointmentRects: [
                                        { left: -9899, top: -9889, height: 50 },
                                        { left: -9499, top: -9739, height: 100 }
                                    ]
                                },
                                {
                                    offset: { x: 300, y: 0 },
                                    expectedIndices: [0, 2],
                                    appointmentRects: [
                                        { left: -10199, top: -9889, height: 50 },
                                        { left: -9799, top: -9739, height: 100 }
                                    ]
                                },
                                {
                                    offset: { x: 900, y: 0 },
                                    expectedIndices: [],
                                    appointmentRects: []
                                },
                                {
                                    offset: { x: 0, y: 1100 },
                                    expectedIndices: [1, 3],
                                    appointmentRects: [
                                        { left: -9699, top: -9889, height: 100 },
                                        { left: -9299, top: -9839, height: 100 }
                                    ]
                                },
                                {
                                    offset: { x: 300, y: 1100 },
                                    expectedIndices: [1, 3],
                                    appointmentRects: [
                                        { left: -9999, top: -9889, height: 100 },
                                        { left: -9599, top: -9839, height: 100 }
                                    ]
                                },
                                {
                                    offset: { x: 1700, y: 1100 },
                                    expectedIndices: [7, 8, 9, 10],
                                    appointmentRects: [
                                        { left: -10199, top: -9689, height: 300 },
                                        { left: -9999, top: -9689, height: 300 },
                                        { left: -9799, top: -9689, height: 300 },
                                        { left: -9599, top: -9689, height: 300 }
                                    ]
                                },
                            ].forEach(({ offset, expectedIndices, appointmentRects }) => {
                                const scrollable = instance.getWorkSpaceScrollable();

                                promise = asyncScrollTest(
                                    assert,
                                    promise,
                                    () => {

                                        assert.ok(true, `Scroll to x: ${offset.x}, y: ${offset.y}`);

                                        const filteredItems = this.instance.filteredItems;

                                        assert.equal(filteredItems.length, expectedIndices.length, 'Filtered items length is correct');

                                        filteredItems.forEach((_, index) => {
                                            const expected = this.data[expectedIndices[index]];
                                            assert.deepEqual(filteredItems[index], expected, `Filtered item "${index}" is correct`);

                                            const expectedRect = appointmentRects[index];
                                            const appointmentRect = this.scheduler.appointments
                                                .getAppointment(index)
                                                .get(0)
                                                .getBoundingClientRect();

                                            assert.roughEqual(appointmentRect.left, expectedRect.left, 2.01, `appointment part #${index} left is correct`);
                                            assert.roughEqual(appointmentRect.top, expectedRect.top, 2.01, `appointment part #${index} top is correct`);
                                            assert.roughEqual(appointmentRect.height, expectedRect.height, 2.01, `appointment part #${index} height is correct`);
                                        });
                                    },
                                    scrollable,
                                    offset
                                );
                            });

                            return promise;
                        }).finally(() => {
                            $style.text(styleBefore);
                        });
                    });
                });

                module('Recurrent appointments', () => {
                    module('Multiple resources', () => {
                        test('Scroll Right recurrent appointment with multiple resources', function(assert) {
                            const scheduler = createWrapper({
                                height: 600,
                                width: 600,
                                dataSource: [{
                                    text: 'Website Re-Design Plan',
                                    startDate: new Date(2021, 8, 6, 9, 30),
                                    endDate: new Date(2021, 8, 6, 11, 30),
                                    resourceId: [1, 3, 5],
                                    recurrenceRule: 'FREQ=DAILY',
                                }
                                ],
                                views: [{
                                    type: 'week',
                                    name: 'Work Week',
                                    groupOrientation: 'horizontal',
                                }],
                                startDayHour: 9,
                                endDayHour: 18,
                                currentView: 'Work Week',
                                scrolling: {
                                    mode: 'virtual',
                                    orientation: 'both',
                                },
                                currentDate: new Date(2021, 8, 6),
                                groups: ['resourceId'],
                                resources: [{
                                    fieldExpr: 'resourceId',
                                    dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
                                    allowMultiple: true,
                                }]
                            });

                            scheduler.instance.getWorkSpace().renderer.getRenderTimeout = () => -1;

                            return asyncWrapper(assert, promise => {
                                [
                                    {
                                        offset: { x: 0 },
                                        appointmentRects: [
                                            { left: -9824, top: -9788, height: 200 },
                                            { left: -9749, top: -9788, height: 200 },
                                            { left: -9674, top: -9788, height: 200 },
                                            { left: -9599, top: -9788, height: 200 },
                                            { left: -9524, top: -9788, height: 200 },
                                            { left: -9449, top: -9788, height: 200 }
                                        ]
                                    },
                                    {
                                        offset: { x: 300 },
                                        appointmentRects: [
                                            { left: -10124, top: -9788, height: 200 },
                                            { left: -10049, top: -9788, height: 200 },
                                            { left: -9974, top: -9788, height: 200 },
                                            { left: -9899, top: -9788, height: 200 },
                                            { left: -9824, top: -9788, height: 200 },
                                            { left: -9749, top: -9788, height: 200 },
                                            { left: -9074, top: -9788, height: 200 }
                                        ]
                                    },
                                    {
                                        offset: { x: 1100 },
                                        appointmentRects: [
                                            { left: -9874, top: -9788, height: 200 },
                                            { left: -9799, top: -9788, height: 200 },
                                            { left: -9724, top: -9788, height: 200 },
                                            { left: -9649, top: -9788, height: 200 },
                                            { left: -9574, top: -9788, height: 200 },
                                            { left: -9499, top: -9788, height: 200 }
                                        ]
                                    },
                                    {
                                        offset: { x: 2100 },
                                        appointmentRects: [
                                            { left: -9824, top: -9788, height: 200 },
                                            { left: -9749, top: -9788, height: 200 },
                                            { left: -9674, top: -9788, height: 200 },
                                            { left: -9599, top: -9788, height: 200 },
                                            { left: -9524, top: -9788, height: 200 },
                                            { left: -9449, top: -9788, height: 200 }
                                        ]
                                    }
                                ].forEach(({ offset, appointmentRects }) => {
                                    const scrollable = scheduler.instance.getWorkSpaceScrollable();

                                    promise = asyncScrollTest(
                                        assert,
                                        promise,
                                        () => {

                                            assert.ok(true, `Scroll to x: ${offset.x}`);

                                            assert.equal(
                                                scheduler.appointments.getAppointmentCount(),
                                                appointmentRects.length,
                                                'Appointment amount is correct'
                                            );

                                            scheduler.appointments.getAppointments()
                                                .each((index, appointment) => {
                                                    const appointmentRect = appointment.getBoundingClientRect();
                                                    const expectedRect = appointmentRects[index];

                                                    assert.roughEqual(appointmentRect.left, expectedRect.left, 2.01, `appointment #${index} left is correct`);
                                                    assert.roughEqual(appointmentRect.top, expectedRect.top, 2.01, `appointment #${index} top is correct`);
                                                    assert.roughEqual(appointmentRect.height, expectedRect.height, 2.01, `appointment #${index} height is correct`);
                                                });
                                        },
                                        scrollable,
                                        offset
                                    );
                                });

                                return promise;
                            });
                        });
                    });
                });
            });
        });
    });

    module('Appointment rendering', {
        before: function() {
            this.createInstance = function(options) {
                this.scheduler = createWrapper(options);

                this.instance = this.scheduler.instance;

                this.instance
                    .getWorkSpace()
                    .renderer.getRenderTimeout = () => -1;
            };
        }
    }, function() {
        [
            {
                groupOrientation: 'horizontal',
                expectedReducers: ['head', 'tail', 'head', 'head', 'tail', 'head']
            }, {
                groupOrientation: 'vertical',
                expectedReducers: ['head', 'tail', 'head']
            }
        ].forEach(option => {
            test(`Reccurrent appointment should not have a reducer icon if ${option.groupOrientation} group orientation`, function(assert) {
                this.createInstance({
                    dataSource: [{
                        text: 'Appointment 1',
                        startDate: new Date(2020, 10, 6, 9, 30),
                        endDate: new Date(2020, 10, 7, 9, 20),
                        recurrenceRule: 'FREQ=DAILY',
                        ownerId: [1, 2]
                    }],
                    currentDate: new Date(2020, 10, 5),
                    views: [{
                        type: 'day',
                        groupOrientation: option.groupOrientation,
                        cellDuration: 5,
                        intervalCount: 3

                    }],
                    currentView: 'day',
                    groups: ['ownerId'],
                    startDayHour: 9,
                    endDayHour: 16,
                    resources: [
                        {
                            field: 'ownerId',
                            dataSource: [
                                { id: 1, text: 'one' },
                                { id: 2, text: 'two' }
                            ]
                        }
                    ],
                    scrolling: {
                        mode: 'virtual'
                    },
                    width: 800
                });

                const { expectedReducers } = option;
                const appointments = this.scheduler.instance.getAppointmentsInstance();
                const { settings } = appointments.option('items')[0];

                assert.equal(settings.length, expectedReducers.length, 'Appointment settings amount is correct');
                expectedReducers.forEach((expected, i) => {
                    assert.equal(settings[i].appointmentReduced, expected, `Part "${i}" has correct reducer state`);
                });
            });
        });

        ['vertical', 'horizontal'].forEach(groupOrientation => {
            ['vertical', 'horizontal', 'both'].forEach(scrollOrientation => {
                test(`Created appointments should be fully repainted in "${groupOrientation}" group orientation and "${scrollOrientation}" scroll orientation`, function(assert) {
                    this.createInstance({
                        currentDate: new Date(2015, 2, 2),
                        dataSource: [],
                        views: [{
                            type: 'week',
                            groupOrientation,
                            cellDuration: 30,
                        }],
                        currentView: 'week',
                        scrolling: {
                            mode: 'virtual',
                            orientation: scrollOrientation
                        },
                        groups: ['priorityId'],
                        resources: [{
                            fieldExpr: 'priorityId',
                            dataSource: [
                                { id: 0 },
                                { id: 1 },
                            ],
                        }],
                        height: 400,
                        width: 600
                    });

                    const { instance } = this.scheduler;

                    instance.addAppointment({
                        startDate: new Date(2015, 2, 2, 1),
                        endDate: new Date(2015, 2, 2, 1, 30),
                        priorityId: 0
                    });

                    instance.addAppointment({
                        startDate: new Date(2015, 2, 2, 1, 30),
                        endDate: new Date(2015, 2, 2, 2),
                        priorityId: 0
                    });

                    assert.equal(this.scheduler.appointments.getAppointmentCount(), 2, 'Appointments rendered correctly');
                });
            });
        });

        QUnit.test('DataSource items should be passed to the appointments collection after wrap by layout manager', function(assert) {
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
                currentView: 'day',
                dataSource: data,
                currentDate: new Date(2015, 1, 9),
                scrolling: {
                    mode: 'virtual',
                    orientation: 'both'
                },
                height: 500,
                width: 600
            });

            const dataSourceItems = this.instance.option('dataSource').items();
            let appointmentsItems = this.instance.getAppointmentsInstance().option('items');

            assert.equal(appointmentsItems.length, 1, 'Items length is correct');
            assert.equal(appointmentsItems[0].itemData, dataSourceItems[0], 'Item is correct');

            const workspace = this.instance.getWorkSpace();
            const scrollable = workspace.getScrollable();

            workspace.renderer.getRenderTimeout = () => -1;

            return asyncWrapper(
                assert,
                promise => asyncScrollTest(
                    assert,
                    promise,
                    () => {
                        appointmentsItems = this.instance.getAppointmentsInstance().option('items');

                        assert.equal(appointmentsItems.length, 2, 'Items length is correct');

                        assert.deepEqual(appointmentsItems[0].itemData, dataSourceItems[1], 'Item0 is correct');
                        assert.notOk(appointmentsItems[0].needRepaint, 'Item0 should be repainted');
                        assert.notOk(appointmentsItems[0].needRemove, 'Item0 should not be removed');

                        assert.deepEqual(appointmentsItems[1].itemData, dataSourceItems[0], 'Item1 is correct');
                        assert.notOk(appointmentsItems[1].needRepaint, 'Item1 should be repainted');
                        assert.ok(appointmentsItems[1].needRemove, 'Item1 should not be removed');

                    },
                    scrollable,
                    { y: 1000 }
                )
            );
        });

        [
            {
                appointment: {
                    text: 'a',
                    startDate: new Date(2021, 1, 1, 9),
                    endDate: new Date(2021, 1, 1, 10),
                    humanId: 18
                },
                groupByDate: false,
                scrollCoordinates: { x: 9500 },
                expectedAppointmentCount: 1
            },
            {
                appointment: {
                    text: 'b',
                    startDate: new Date(2021, 1, 1, 9),
                    endDate: new Date(2021, 1, 1, 10),
                    humanId: 0
                },
                groupByDate: false,
                scrollCoordinates: { x: 9500 },
                expectedAppointmentCount: 0
            },
            {
                appointment: {
                    text: 'c',
                    startDate: new Date(2021, 1, 1, 9),
                    endDate: new Date(2021, 1, 1, 10),
                    humanId: 18
                },
                groupByDate: true,
                scrollCoordinates: { x: 3000 },
                expectedAppointmentCount: 1
            }
        ].forEach(({ appointment, groupByDate, scrollCoordinates, expectedAppointmentCount }) => {
            test(`After scrolling appointment count in DOM should be ${expectedAppointmentCount}
            when groupByDate is ${groupByDate}`, function(assert) {
                const resources = [
                    { id: 0 }, { id: 1 },
                    { id: 2 }, { id: 3 },
                    { id: 4 }, { id: 5 },
                    { id: 6 }, { id: 7 },
                    { id: 8 }, { id: 9 },
                    { id: 10 }, { id: 11 },
                    { id: 12 }, { id: 13 },
                    { id: 14 }, { id: 15 },
                    { id: 16 }, { id: 17 },
                    { id: 18 }, { id: 19 }
                ];

                const scheduler = createWrapper({
                    height: 600,
                    width: 600,
                    currentDate: new Date(2021, 1, 2),
                    dataSource: [appointment],
                    views: [
                        {
                            type: 'month',
                            groupOrientation: 'horizontal'
                        }
                    ],
                    currentView: 'month',
                    scrolling: {
                        mode: 'virtual'
                    },
                    groups: ['humanId'],
                    resources: [{
                        fieldExpr: 'humanId',
                        dataSource: resources
                    }],
                    groupByDate
                });

                const workspace = scheduler.instance.getWorkSpace();
                const scrollable = workspace.getScrollable();

                workspace.renderer.getRenderTimeout = () => -1;

                return asyncWrapper(assert, promise => {
                    promise = asyncScrollTest(
                        assert,
                        promise,
                        () => {
                            const appointmentCount = scheduler.appointmentList.length;
                            assert.equal(appointmentCount, expectedAppointmentCount, 'DOM contain right count of appoinments');
                        },
                        scrollable,
                        scrollCoordinates);

                    return promise;
                });
            });
        });
    });

    module('CSS customization', () => {
        module('Vertical orientation', () => {
            supportedViews.forEach(viewName => {
                test(`Cell height should be correct in "${viewName}" view`, function(assert) {
                    const $style = $('<style nonce="qunit-test">').text('#scheduler .dx-scheduler-cell-sizes-vertical { height: 80px } ');
                    const styleBefore = $style.text();

                    $('#qunit-fixture').prepend($style);

                    const instance = createWrapper({
                        views: [{
                            type: viewName,
                        }],
                        currentView: viewName,
                        scrolling: {
                            mode: 'virtual',
                            orientation: 'vertical'
                        },
                        height: 400
                    }).instance;

                    const { virtualScrollingDispatcher } = instance.getWorkSpace();

                    assert.equal(virtualScrollingDispatcher.rowHeight, 80, 'Cell height is correct');

                    $style.text(styleBefore);
                });
            });
        });

        module('Horizontal orientation', () => {
            supportedViews.forEach(viewName => {
                test(`Cell width should be correct in "${viewName}" view`, function(assert) {
                    const $style = $('<style nonce="qunit-test">').text('#scheduler .dx-scheduler-cell-sizes-horizontal { width: 120px } ');
                    const styleBefore = $style.text();

                    $('#qunit-fixture').prepend($style);

                    const instance = createWrapper({
                        views: [{
                            type: viewName,
                            intervalCount: 10
                        }],
                        currentView: viewName,
                        scrolling: {
                            mode: 'virtual',
                            orientation: 'horizontal'
                        },
                        crossScrollingEnabled: true,
                        height: 400,
                        width: 600
                    }).instance;

                    const { virtualScrollingDispatcher } = instance.getWorkSpace();

                    assert.equal(virtualScrollingDispatcher.cellWidth, 120, 'Cell width is correct');

                    $style.text(styleBefore);
                });
            });
        });
    });

    module('Markup', () => {
        [true, false].forEach((showAllDayPanel) => {
            test(`MonthView's groupPanel and dateTable should have correct height when showAllDayPanel: "${showAllDayPanel}" and vertical grouping is used`, function(assert) {
                const { workSpace } = createWrapper({
                    views: [{
                        type: 'month',
                        groupOrientation: 'vertical',
                    }],
                    currentView: 'month',
                    currentDate: new Date(2020, 11, 29),
                    groups: ['priorityId'],
                    resources: [{
                        fieldExpr: 'priorityId',
                        allowMultiple: false,
                        dataSource: [{ id: 1 }, { id: 2 }]
                    }],
                    height: 500,
                    showAllDayPanel,
                });

                const cellHeight = workSpace.getCellHeight();
                const calculatedHeight = 12 * cellHeight;

                const dateTableHeight = workSpace.getDateTable().outerHeight();
                const groupPanelHeight = workSpace.groups.getVerticalGroupPanel().outerHeight();

                assert.equal(dateTableHeight, calculatedHeight, 'Correct dateTable height');
                assert.equal(groupPanelHeight, calculatedHeight, 'Correct groupPanel height');
            });
        });

        test('AllDayPanel should have correct height if all day appointments out of viewport', function(assert) {
            const { workSpace } = createWrapper({
                height: 600,
                width: 800,
                currentDate: new Date(2021, 8, 6),
                dataSource: [{
                    text: 'Test',
                    startDate: new Date(2021, 8, 11, 9, 30),
                    resourceId: [5],
                    allDay: true
                }],
                startDayHour: 9,
                endDayHour: 18,
                currentView: 'week',
                scrolling: {
                    mode: 'virtual',
                    type: 'both',
                },
                groups: ['resourceId'],
                resources: [{
                    fieldExpr: 'resourceId',
                    dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
                }]
            });

            assert.equal(workSpace.getAllDayCellHeight(), 75, 'AllDayPanel height is correct');
        });

        QUnit.test('WorkSpace elements should have correct height when there are a log of groups in timeline month', function(assert) {
            const scheduler = createWrapper({
                views: ['timelineMonth'],
                currentView: 'timelineMonth',
                currentDate: new Date(2021, 2, 6),
                scrolling: {
                    mode: 'virtual',
                    type: 'both',
                },
                groups: ['resourceId'],
                resources: [{
                    fieldExpr: 'resourceId',
                    dataSource: [
                        { id: 1, text: '1' }, { id: 2, text: '2' }, { id: 3, text: '3' }, { id: 4, text: '4' },
                        { id: 5, text: '5' }, { id: 6, text: '6' }, { id: 7, text: '7' }, { id: 8, text: '8' },
                        { id: 9, text: '9' }, { id: 10, text: '10' }, { id: 11, text: '11' }, { id: 12, text: '12' },
                        { id: 13, text: '13' }, { id: 14, text: '14' }, { id: 15, text: '15' }, { id: 16, text: '16' },
                    ],
                }],
                height: 500,
                width: 800,
            });

            const groupPanelHeight = scheduler.workSpace.groups.getGroupsContainer().outerHeight();

            assert.equal(groupPanelHeight, 800, 'GroupPanel height is correct');
        });
    });
});
