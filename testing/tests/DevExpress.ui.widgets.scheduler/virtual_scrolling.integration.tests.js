import $ from 'jquery';

import 'common.css!';
import 'generic_light.css!';

import {
    createWrapper,
    initTestMarkup
} from '../../helpers/scheduler/helpers.js';

const supportedViews = ['day', 'week', 'workWeek'];
const unsupportedViews = ['month', 'timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];

const { testStart, test, module } = QUnit;

testStart(() => initTestMarkup());

module('Initialization', {
    beforeEach: function() {
    }
}, () => {
    supportedViews.forEach(view => {
        [{
            mode: 'standard', result: false,
        }, {
            mode: 'virtual', result: true,
        }].forEach(scrolling => {
            test(`Virtual Scrolling as the ${view} view option, scrolling.mode: ${scrolling.mode}`, function(assert) {
                const instance = createWrapper({
                    views: supportedViews,
                    currentView: view,
                    scrolling: {
                        mode: scrolling.mode,
                    },
                }).instance;

                assert.equal(
                    !!instance.getWorkSpace()._virtualScrolling, scrolling.result, 'Virtual scrolling initialization',
                );
                assert.equal(instance.getWorkSpace().isRenovatedRender(), scrolling.result, 'Correct render is used');
            });

            test(`Virtual Scrolling as the ${view} view option, view.scrolling.mode: ${scrolling.mode}`, function(assert) {
                const instance = createWrapper({
                    views: [{
                        type: view,
                        scrolling: {
                            mode: scrolling.mode,
                        },
                    }],
                    currentView: view
                }).instance;

                assert.equal(
                    !!instance.getWorkSpace()._virtualScrolling, scrolling.result, 'Virtual scrolling initialization',
                );
                assert.equal(instance.getWorkSpace().isRenovatedRender(), scrolling.result, 'Correct render is used');
            });
        });

        test(`Virtual scrolling optional if view: ${view}`, function(assert) {
            const instance = createWrapper({
                views: supportedViews,
                currentView: view
            }).instance;

            instance.option('scrolling.mode', 'virtual');
            assert.ok(!!instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling Initialized');
            assert.ok(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is used');

            instance.option('scrolling.mode', 'standard');
            assert.notOk(!!instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling not initialized');
            assert.notOk(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is not used');
        });

        test(`Optional Virtual Scrolling as the ${view} view option`, function(assert) {
            const instance = createWrapper({
                views: [{
                    type: view,
                }],
                currentView: view
            }).instance;

            instance.option('views[0].scrolling.mode', 'virtual');
            assert.ok(!!instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling is initialized');
            assert.ok(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is used');

            instance.option('views[0].scrolling.mode', 'standard');
            assert.notOk(!!instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling is not initialized');
            assert.notOk(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is not used');
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
                }).instance;

                assert.notOk(instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling not initialized');
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
                    currentView: view
                }).instance;

                assert.notOk(instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling not initialized');
                assert.notOk(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is not used');
            });
        });

        test(`Virtual scrolling optional if view: ${view}`, function(assert) {
            const instance = createWrapper({
                views: unsupportedViews,
                currentView: view
            }).instance;

            instance.option('scrolling.mode', 'virtual');
            assert.notOk(instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling not initialized');
            assert.notOk(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is not used');

            instance.option('scrolling.mode', 'standard');
            assert.notOk(instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling not initialized');
            assert.notOk(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is not used');
        });

        test(`Optional Virtual Scrolling as the ${view} view option`, function(assert) {
            const instance = createWrapper({
                views: [{
                    type: view,
                }],
                currentView: view
            }).instance;

            instance.option('views[0].scrolling.mode', 'virtual');
            assert.notOk(!!instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling is not initialized');
            assert.notOk(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is not used');

            instance.option('views[0].scrolling.mode', 'standard');
            assert.notOk(!!instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling is not initialized');
            assert.notOk(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is not used');
        });
    });
});

QUnit.module('Appointment filtering', function() {
    QUnit.module('Init', function() {
        ['vertical', 'horizontal'].forEach(groupOrientation => {
            QUnit.test(`Should be filtered correctly when groupOrientation: ${groupOrientation}`, function(assert) {
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

            QUnit.test(`Should be filtered correctly with resources when groupOrientation: ${groupOrientation}`, function(assert) {
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

        QUnit.test('Grouped appointments should be filtered correctly when groupOrientation: "vertical"', function(assert) {
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

        QUnit.test('Grouped appointments should be filtered correctly when groupOrientation: "horizontal"', function(assert) {
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
    });

    QUnit.module('Scrolling', {
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

                $.extend(true, options, {
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
                });

                this.instance = createWrapper(options).instance;

                this.instance
                    .getWorkSpace()
                    ._virtualScrolling
                    ._getRenderTimeout = () => -1;
            };
        }
    }, function() {
        [
            { y: 0, indices: [0, 1, 2] },
            { y: 300, indices: [1, 2] },
            { y: 900, indices: [3, 5] },
            { y: 1700, indices: [4, 5] },
            { y: 2400, indices: [4, 5] }
        ].forEach(option => {
            QUnit.test(`Scrolling Down if groupOrientation: 'vertical', scrollY: ${option.y}`, function(assert) {
                this.createInstance();

                const { instance } = this;

                instance.getWorkSpaceScrollable().scrollTo({ y: option.y });

                const dataIndices = option.indices;
                const filteredItems = instance.getFilteredItems();

                assert.equal(filteredItems.length, dataIndices.length, 'Filtered items length is correct');

                filteredItems.forEach((_, index) => {
                    const expected = this.data[dataIndices[index]];
                    assert.deepEqual(filteredItems[index], expected, `Filtered item ${index} is correct`);
                });
            });
        });

        [
            { y: 2400, indices: [4, 5] },
            { y: 1700, indices: [4, 5] },
            { y: 900, indices: [3, 5] },
            { y: 300, indices: [1, 2] },
            { y: 0, indices: [0, 1, 2] }
        ].forEach(option => {
            QUnit.test(`Scrolling Up if groupOrientation: 'vertical', scrollY: ${option.y}`, function(assert) {
                this.createInstance();

                const { instance } = this;

                instance.getWorkSpaceScrollable().scrollTo({ y: option.y });

                const dataIndices = option.indices;
                const filteredItems = instance.getFilteredItems();

                assert.equal(filteredItems.length, dataIndices.length, 'Filtered items length is correct');

                filteredItems.forEach((_, index) => {
                    const expected = this.data[dataIndices[index]];
                    assert.deepEqual(filteredItems[index], expected, `Filtered item ${index} is correct`);
                });
            });
        });

        [
            { y: 0, indices: [0, 2] },
            { y: 300, indices: [2] },
            { y: 900, indices: [5] },
            { y: 1700, indices: [4, 5] },
            { y: 2400, indices: [5, 1] },
            { y: 2700, indices: [1] },
            { y: 3000, indices: [] },
            { y: 3300, indices: [3] },
            { y: 4300, indices: [] },
        ].forEach(option => {
            QUnit.test(`Scrolling Down if groups, resources, groupOrientation: 'vertical', scrollY: ${option.y}`, function(assert) {
                this.createInstance({
                    groups: ['resourceId0'],
                    resources: [{
                        fieldExpr: 'resourceId0',
                        dataSource: [
                            { text: 'Rc0_0', id: 0, color: '#727bd2' },
                            { text: 'Rc0_1', id: 1, color: '#32c9ed' },
                        ],
                        label: 'Resource0'
                    }],
                });

                const { instance } = this;

                instance.getWorkSpaceScrollable().scrollTo({ y: option.y });

                const dataIndices = option.indices;
                const filteredItems = instance.getFilteredItems();

                assert.equal(filteredItems.length, dataIndices.length, 'Filtered items length is correct');

                filteredItems.forEach((_, index) => {
                    const expected = this.data[dataIndices[index]];
                    assert.deepEqual(filteredItems[index], expected, `Filtered item ${index} is correct`);
                });
            });
        });

        [
            { y: 4300, indices: [] },
            { y: 3300, indices: [3] },
            { y: 3000, indices: [] },
            { y: 2700, indices: [1] },
            { y: 2400, indices: [5, 1] },
            { y: 1700, indices: [4, 5] },
            { y: 900, indices: [5] },
            { y: 300, indices: [2] },
            { y: 0, indices: [0, 2] }
        ].forEach(option => {
            QUnit.test(`Scrolling Up if groups, resources, groupOrientation: 'vertical', scrollY: ${option.y}`, function(assert) {
                this.createInstance({
                    groups: ['resourceId0'],
                    resources: [{
                        fieldExpr: 'resourceId0',
                        dataSource: [
                            { text: 'Rc0_0', id: 0, color: '#727bd2' },
                            { text: 'Rc0_1', id: 1, color: '#32c9ed' },
                        ],
                        label: 'Resource0'
                    }],
                });

                const { instance } = this;

                instance.getWorkSpaceScrollable().scrollTo({ y: option.y });

                const dataIndices = option.indices;
                const filteredItems = instance.getFilteredItems();

                assert.equal(filteredItems.length, dataIndices.length, 'Filtered items length is correct');

                filteredItems.forEach((_, index) => {
                    const expected = this.data[dataIndices[index]];
                    assert.deepEqual(filteredItems[index], expected, `Filtered item ${index} is correct`);
                });
            });
        });
    });
});
