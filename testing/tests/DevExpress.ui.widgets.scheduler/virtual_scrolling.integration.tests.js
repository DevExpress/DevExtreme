import $ from 'jquery';

import { getWindow } from 'core/utils/window';

import 'common.css!';
import 'generic_light.css!';

import {
    createWrapper,
    initTestMarkup,
    checkResultByDeviceType,
    isDesktopEnvironment
} from '../../helpers/scheduler/helpers.js';

const supportedViews = ['day', 'week', 'workWeek'];
const unsupportedViews = ['month', 'timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];

const {
    testStart,
    test,
    module
} = QUnit;

testStart(() => initTestMarkup());

module('Initialization', () => {
    supportedViews.forEach(viewName => {
        [{
            mode: 'standard', result: false,
        }, {
            mode: 'virtual', result: true,
        }].forEach(scrolling => {
            test(`Component should be correctly created in ${viewName} view if scrolling.mode: ${scrolling.mode}`, function(assert) {
                const instance = createWrapper({
                    views: supportedViews,
                    currentView: viewName,
                    dataSource: [],
                    scrolling: {
                        mode: scrolling.mode,
                    },
                    height: 400
                }).instance;

                assert.equal(
                    !!instance.getWorkSpace().virtualScrollingDispatcher,
                    scrolling.result,
                    'Virtual scrolling initialization',
                );
                assert.equal(
                    instance.getWorkSpace().isRenovatedRender(),
                    scrolling.result,
                    'Correct render is used'
                );
            });

            test(`Component should be correctly created in ${viewName} view if view.scrolling.mode: ${scrolling.mode}`, function(assert) {
                const instance = createWrapper({
                    views: [{
                        type: viewName,
                        scrolling: {
                            mode: scrolling.mode,
                        },
                    }],
                    currentView: viewName,
                    height: 400
                }).instance;

                assert.equal(
                    !!instance.getWorkSpace().virtualScrollingDispatcher,
                    scrolling.result,
                    'Virtual scrolling initialization',
                );
                assert.equal(
                    instance.getWorkSpace().isRenovatedRender(),
                    scrolling.result,
                    'Correct render is used'
                );
            });

            test(`Component should be correctly created after change scrolling.mode option to ${scrolling.mode} in ${viewName} view`, function(assert) {
                const instance = createWrapper({
                    views: supportedViews,
                    currentView: viewName,
                    height: 400
                }).instance;

                instance.option('scrolling.mode', 'virtual');

                assert.ok(
                    !!instance.getWorkSpace().virtualScrollingDispatcher,
                    'Virtual scrolling Initialized'
                );
                assert.ok(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is used');

                instance.option('scrolling.mode', 'standard');

                assert.notOk(
                    !!instance.getWorkSpace().virtualScrollingDispatcher,
                    'Virtual scrolling not initialized'
                );
                assert.notOk(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is not used');
            });

            test(`Component should be correctly created after change view.scrolling.mode option to ${scrolling.mode} in ${viewName} view`, function(assert) {
                const instance = createWrapper({
                    views: [{
                        type: viewName,
                    }],
                    currentView: viewName,
                    height: 400
                }).instance;

                instance.option('views[0].scrolling.mode', 'virtual');
                assert.ok(
                    !!instance.getWorkSpace().virtualScrollingDispatcher,
                    'Virtual scrolling is initialized'
                );
                assert.ok(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is used');

                instance.option('views[0].scrolling.mode', 'standard');
                assert.notOk(
                    !!instance.getWorkSpace().virtualScrollingDispatcher,
                    'Virtual scrolling is not initialized'
                );
                assert.notOk(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is not used');
            });
        });

        module('Options', () => {
            test(`viewportHeight should be correct if height is not set in ${viewName} view`, function(assert) {
                const { instance } = createWrapper({
                    views: [{
                        type: viewName,
                    }],
                    scrolling: {
                        mode: 'virtual'
                    },
                    currentView: viewName
                });

                const { virtualScrollingDispatcher } = instance.getWorkSpace();
                const { viewportHeight } = virtualScrollingDispatcher;

                assert.equal(viewportHeight, window.innerHeight, 'viewPortHeight is correct');
            });

            test(`pageSize should be correct if height is not set in ${viewName} view`, function(assert) {
                const { instance } = createWrapper({
                    views: [{
                        type: viewName,
                    }],
                    scrolling: {
                        mode: 'virtual'
                    },

                    currentView: viewName
                });

                const { virtualScrollingDispatcher } = instance.getWorkSpace();
                const { pageSize } = virtualScrollingDispatcher.getState();
                const { innerHeight } = getWindow();

                const rowHeight = virtualScrollingDispatcher._virtualScrolling.getRowHeight();
                const expectedPageSize = Math.ceil(innerHeight / rowHeight);

                assert.equal(pageSize, expectedPageSize, 'Page size is correct');
            });
        });
    });

    unsupportedViews.forEach(view => {
        [{
            mode: 'standard', result: false,
        }, {
            mode: 'virtual', result: true,
        }].forEach(scrolling => {
            test(`Virtual Scrolling as the ${view} view option, scrolling.mode: ${scrolling.mode}`, function(assert) {
                const instance = createWrapper({
                    views: unsupportedViews,
                    currentView: view,
                    scrolling: {
                        mode: scrolling.mode,
                    },
                    height: 400
                }).instance;

                assert.notOk(instance.getWorkSpace().virtualScrollingDispatcher, 'Virtual scrolling not initialized');
                assert.notOk(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is not used');
            });

            test(`Virtual Scrolling as the ${view} view option, view.scrolling.mode: ${scrolling.mode}`, function(assert) {
                const instance = createWrapper({
                    views: [{
                        type: view,
                        scrolling: {
                            mode: scrolling.mode,
                        },
                    }],
                    currentView: view,
                    height: 400
                }).instance;

                assert.notOk(instance.getWorkSpace().virtualScrollingDispatcher, 'Virtual scrolling not initialized');
                assert.notOk(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is not used');
            });
        });

        test(`Virtual scrolling optional if view: ${view}`, function(assert) {
            const instance = createWrapper({
                views: unsupportedViews,
                currentView: view,
                height: 400
            }).instance;

            instance.option('scrolling.mode', 'virtual');
            assert.notOk(instance.getWorkSpace().virtualScrollingDispatcher, 'Virtual scrolling not initialized');
            assert.notOk(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is not used');

            instance.option('scrolling.mode', 'standard');
            assert.notOk(instance.getWorkSpace().virtualScrollingDispatcher, 'Virtual scrolling not initialized');
            assert.notOk(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is not used');
        });

        test(`Optional Virtual Scrolling as the ${view} view option`, function(assert) {
            const instance = createWrapper({
                views: [{
                    type: view,
                }],
                currentView: view,
                height: 400
            }).instance;

            instance.option('views[0].scrolling.mode', 'virtual');
            assert.notOk(!!instance.getWorkSpace().virtualScrollingDispatcher, 'Virtual scrolling is not initialized');
            assert.notOk(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is not used');

            instance.option('views[0].scrolling.mode', 'standard');
            assert.notOk(!!instance.getWorkSpace().virtualScrollingDispatcher, 'Virtual scrolling is not initialized');
            assert.notOk(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is not used');
        });
    });
});

module('AppointmentSettings', {
    before: function() {
        this.createInstance = function(options) {
            this.scheduler = createWrapper(options);
            this.scheduler.instance
                .getWorkSpace()
                .virtualScrollingDispatcher
                .getRenderTimeout = () => -1;
        };
    }
}, function() {
    supportedViews.forEach(viewName => {
        [undefined, 'FREQ=DAILY'].forEach(recurrenceRule => {
            test(`Appointments should contains groupIndex if recurrenceRule: ${recurrenceRule}, view: ${viewName}`, function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 2, 2),
                    scrolling: {
                        mode: 'virtual'
                    },
                    height: 400
                });

                const { instance } = this.scheduler;

                const settings = instance.fire('createAppointmentSettings', {
                    startDate: new Date(2015, 2, 2, 0),
                    endDate: new Date(2015, 2, 2, 0, 30),
                    recurrenceRule
                });

                assert.equal(settings[0].groupIndex, 0, 'groupIndex is correct');
            });
        });

        test(`Grouped appointment should contains correct groupIndex if ${viewName} view has vertical group orientation`, function(assert) {
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
                height: 400
            });

            const { instance } = this.scheduler;

            const settings = instance.fire('createAppointmentSettings', {
                startDate: new Date(2015, 2, 2, 0),
                endDate: new Date(2015, 2, 2, 0, 30),
                resourceId0: 0
            });

            assert.equal(settings[0].groupIndex, 0, 'groupIndex is correct');
        });

        test(`Grouped appointment should contains correct groupIndex if ${viewName} view has horizontal group orientation`, function(assert) {
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
                height: 400
            });

            const { instance } = this.scheduler;

            const settings = instance.fire('createAppointmentSettings', {
                startDate: new Date(2015, 2, 2, 0),
                endDate: new Date(2015, 2, 2, 0, 30),
                resourceId0: 1
            });

            assert.equal(settings[0].groupIndex, 1, 'groupIndex is correct');
        });

        test(`Grouped allDay appointment should contains correct groupIndex if ${viewName} view has vertical group orientation`, function(assert) {
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
                height: 400
            });

            const { instance } = this.scheduler;

            const settings = instance.fire('createAppointmentSettings', {
                startDate: new Date(2015, 2, 2),
                endDate: new Date(2015, 2, 2),
                resourceId0: 0,
                allDay: true
            });

            assert.equal(settings[0].groupIndex, 0, 'groupIndex is correct');
        });

        ['horizontal', 'vertical'].forEach(groupOrientation => {
            [
                { y: 1000, expectedDate: new Date(2015, 2, 4, 8, 30) },
                { y: 1050, expectedDate: new Date(2015, 2, 4, 9, 0) },
                { y: 1100, expectedDate: new Date(2015, 2, 4, 9, 30) },
                { y: 1200, expectedDate: new Date(2015, 2, 4, 10, 30) },
                { y: 1250, expectedDate: new Date(2015, 2, 4, 11, 0) },
                { y: 1300, expectedDate: new Date(2015, 2, 4, 11, 30) },
                { y: 1350, expectedDate: new Date(2015, 2, 4, 12, 0) },
                { y: 1400, expectedDate: new Date(2015, 2, 4, 12, 30) },
                { y: 1500, expectedDate: new Date(2015, 2, 4, 13, 30) },
                { y: 2000, expectedDate: new Date(2015, 2, 4, 18, 30) }
            ].forEach(option => {
                test(`A long appointment should be correctly croped if view: ${viewName}, ${groupOrientation} group orientation, scroll position ${option.y}`, function(assert) {
                    this.createInstance({
                        currentDate: new Date(2015, 2, 4),
                        scrolling: {
                            mode: 'virtual'
                        },
                        views: [{
                            type: viewName,
                            groupOrientation: groupOrientation
                        }],
                        currentView: viewName,
                        dataSource: [{
                            startDate: new Date(2015, 2, 4, 0, 10),
                            endDate: new Date(2015, 2, 4, 23, 50)
                        }],
                        height: 400
                    });

                    const { instance } = this.scheduler;
                    const workspace = instance.getWorkSpace();
                    const scrollable = workspace.getScrollable();
                    const longAppointment = {
                        startDate: new Date(2015, 2, 4, 0, 10),
                        endDate: new Date(2015, 2, 4, 23, 50)
                    };

                    workspace.virtualScrollingDispatcher.getRenderTimeout = () => -1;

                    scrollable.scrollTo({ y: option.y });

                    checkResultByDeviceType(assert, () => {
                        const settings = instance.fire('createAppointmentSettings', longAppointment)[0];

                        assert.equal(
                            settings.groupIndex,
                            0,
                            `group index is correct when scrolled to ${option.y}`
                        );

                        assert.deepEqual(
                            settings.info.appointment.startDate,
                            option.expectedDate,
                            `start date is correct when scrolled to ${option.y}`
                        );
                    });
                });
            });
        });
    });

    test('Recurrent appointment should have correct settings in vertical group orientation', function(assert) {
        if(!isDesktopEnvironment()) {
            assert.ok(true, 'This test is for desktop only');
            return;
        }

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

        instance.getWorkSpace().virtualScrollingDispatcher.getRenderTimeout = () => -1;

        const scrollable = instance.getWorkSpace().getScrollable();

        [
            {
                offsetY: 0,
                expectedSettings: [
                    {
                        groupIndex: 0,
                        topPositions: [50, 150, 250, 350, 450, 550, 650, 750]
                    }
                ]
            },
            {
                offsetY: 2000,
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
                offsetY: 4000,
                expectedSettings: [
                    {
                        groupIndex: 1,
                        topPositions: [3800, 3900, 4000, 4100, 4200, 4300, 4400, 4500, 4600, 4700]
                    }
                ]
            },
        ].forEach(option => {
            scrollable.scrollTo({ y: option.offsetY });

            const filteredItems = instance.getFilteredItems();

            filteredItems.forEach((dataItem, index) => {
                const settings = instance.fire('createAppointmentSettings', dataItem);
                const {
                    groupIndex,
                    topPositions
                } = option.expectedSettings[index];
                topPositions.forEach((top, index) => {
                    assert.equal(settings[index].groupIndex, groupIndex, `Appointment groupIndex ${groupIndex} is correct for offsetY: ${option.offsetY}`);
                    assert.equal(settings[index].top, top, `Appointment top position ${top} is correct for offsetY: ${option.offsetY}`);
                });
            });

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

                const instance = createWrapper({
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
                    height: 400
                }).instance;

                const filteredItems = instance.getFilteredItems();

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

                const instance = createWrapper({
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
                }).instance;

                const filteredItems = instance.getFilteredItems();

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

            const instance = createWrapper({
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
                height: 400
            }).instance;

            const filteredItems = instance.getFilteredItems();

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

            const instance = createWrapper({
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
                height: 400
            }).instance;

            const filteredItems = instance.getFilteredItems();

            assert.equal(filteredItems.length, 3, 'Filtered items length is correct');
            assert.deepEqual(filteredItems[0], data[0], 'Filtered item 0 is correct');
            assert.deepEqual(filteredItems[1], data[1], 'Filtered item 1 is correct');
            assert.deepEqual(filteredItems[2], data[2], 'Filtered item 2 is correct');
        });

        test('Recurrent appointments should be filtered correctly in vertical group orientation', function(assert) {
            if(!isDesktopEnvironment()) {
                assert.ok(true, 'This test is for desktop only');
                return;
            }

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

            instance.getWorkSpace().virtualScrollingDispatcher.getRenderTimeout = () => -1;

            const scrollable = instance.getWorkSpace().getScrollable();

            [
                { offsetY: 0, expectedDataIndices: [0] },
                { offsetY: 500, expectedDataIndices: [0] },
                { offsetY: 1000, expectedDataIndices: [0] },
                { offsetY: 2000, expectedDataIndices: [0, 1] },
                { offsetY: 2500, expectedDataIndices: [0, 1] },
                { offsetY: 4000, expectedDataIndices: [1] },
                { offsetY: 4500, expectedDataIndices: [1] },
            ].forEach(option => {
                scrollable.scrollTo({ y: option.offsetY });

                const filteredItems = instance.getFilteredItems();

                const { expectedDataIndices } = option;
                assert.equal(filteredItems.length, expectedDataIndices.length, 'Filtered items length is correct');

                expectedDataIndices.forEach((dataIndex, index) => {
                    assert.deepEqual(filteredItems[index], data[dataIndex], `Filtered item ${index} is correct`);
                });
            });
        });
    });

    module('On scrolling', {
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
                        mode: 'virtual'
                    },
                    height: 400
                }, options);

                this.instance = createWrapper(options).instance;

                this.instance
                    .getWorkSpace()
                    .virtualScrollingDispatcher
                    .getRenderTimeout = () => -1;
            };
        }
    }, function() {
        [
            { y: 0, expectedIndices: [0, 1, 2] },
            { y: 300, expectedIndices: [1, 2] },
            { y: 900, expectedIndices: [3, 5] },
            { y: 1700, expectedIndices: [4, 5] },
            { y: 2400, expectedIndices: [4, 5] }
        ].forEach(option => {
            test(`Scrolling Down if groupOrientation: 'vertical', scrollY: ${option.y}`, function(assert) {
                const { expectedIndices } = option;

                this.createInstance();

                const { instance } = this;

                window.scheduler = instance;

                instance.getWorkSpaceScrollable().scrollTo({ y: option.y });

                checkResultByDeviceType(assert, () => {
                    const filteredItems = instance.getFilteredItems();

                    assert.equal(filteredItems.length, expectedIndices.length, 'Filtered items length is correct');

                    filteredItems.forEach((_, index) => {
                        const expected = this.data[expectedIndices[index]];
                        assert.deepEqual(filteredItems[index], expected, `Filtered item ${index} is correct`);
                    });
                });
            });
        });

        [
            { y: 2400, expectedIndices: [4, 5] },
            { y: 1700, expectedIndices: [4, 5] },
            { y: 900, expectedIndices: [3, 5] },
            { y: 300, expectedIndices: [1, 2] },
            { y: 0, expectedIndices: [0, 1, 2] }
        ].forEach(option => {
            test(`Scrolling Up if groupOrientation: 'vertical', scrollY: ${option.y}`, function(assert) {
                const { expectedIndices } = option;

                this.createInstance();

                const { instance } = this;

                instance.getWorkSpaceScrollable().scrollTo({ y: option.y });

                checkResultByDeviceType(assert, () => {
                    const filteredItems = instance.getFilteredItems();

                    assert.equal(filteredItems.length, expectedIndices.length, 'Filtered items length is correct');

                    filteredItems.forEach((_, index) => {
                        const expected = this.data[expectedIndices[index]];
                        assert.deepEqual(filteredItems[index], expected, `Filtered item ${index} is correct`);
                    });
                });
            });
        });

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
            test(`Scrolling Down if groups, resources, groupOrientation: 'vertical', scrollY: ${option.y}`, function(assert) {
                const { expectedIndices } = option;

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
                    }],
                });

                const { instance } = this;

                instance.getWorkSpaceScrollable().scrollTo({ y: option.y });

                checkResultByDeviceType(assert, () => {
                    const filteredItems = instance.getFilteredItems();

                    assert.equal(filteredItems.length, expectedIndices.length, 'Filtered items length is correct');

                    filteredItems.forEach((_, index) => {
                        const expected = this.data[expectedIndices[index]];
                        assert.deepEqual(filteredItems[index], expected, `Filtered item ${index} is correct`);
                    });
                });
            });
        });

        [0, 300, 900, 1700, 2400, 2700, 3000, 3300, 4300 ].forEach(scrollY => {
            test(`Next day appointments should be filtered if grouping, groupOrientation: 'vertical', scrollY: ${scrollY}`, function(assert) {
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
                    }],
                });

                try {
                    const { instance } = this;

                    instance.getWorkSpaceScrollable().scrollTo({ y: scrollY });

                    checkResultByDeviceType(assert, () => {
                        assert.equal(
                            instance.getFilteredItems().length,
                            0,
                            'Filtered items length is correct'
                        );
                    });

                } catch(e) {
                    assert.ok(false, `Exception: ${e.message}`);
                }
            });
        });
    });
});

QUnit.module('Appointments', {
    before: function() {
        this.createInstance = function(options) {
            this.scheduler = createWrapper(options);
            this.scheduler.instance
                .getWorkSpace()
                .virtualScrollingDispatcher
                .getRenderTimeout = () => -1;
        };
    }
}, function() {
    QUnit.test('Appointments should be fully repainted', function(assert) {
        this.createInstance({
            currentDate: new Date(2015, 2, 2),
            scrolling: {
                mode: 'virtual'
            },
            height: 400
        });

        const { instance } = this.scheduler;

        assert.ok(instance._appointments._isRepaintAll(), 'Full repaint flag is set');
    });
});
