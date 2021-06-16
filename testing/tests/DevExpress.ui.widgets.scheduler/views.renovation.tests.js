import 'generic_light.css!';
import $ from 'jquery';

import {
    createWrapper,
    initTestMarkup,
} from '../../helpers/scheduler/helpers.js';

const {
    testStart,
    module,
    test,
} = QUnit;

testStart(() => initTestMarkup());

module('Renovated Views', () => {
    ['week', 'timelineWeek'].forEach((currentView) => {
        test(`Group panel should not disappear on current date option change in ${currentView}`, function(assert) {
            const scheduler = createWrapper({
                currentView,
                views: [currentView],
                groups: ['resourceId'],
                resources: [{
                    fieldExpr: 'resourceId',
                    dataSource: [{ id: 1, text: '1' }, { id: 2, text: '2' }],
                }],
                currentDate: new Date(2021, 1, 20),
                renovateRender: true,
            });

            assert.equal(scheduler.workSpace.groups.getGroupHeaders().length, 2, 'Correct number of group headers');

            scheduler.instance.option('currentDate', new Date(2022, 1, 20));

            assert.equal(scheduler.workSpace.groups.getGroupHeaders().length, 2, 'Correct number of group headers');
        });
    });

    ['week', 'timelineWeek', 'timelineMonth'].forEach((currentView) => {
        test(`Shader should be cleaned on options change in ${currentView}`, function(assert) {
            const scheduler = createWrapper({
                currentView,
                views: [currentView],
                groups: ['resourceId'],
                currentDate: new Date(2020, 1, 20),
                shadeUntilCurrentTime: true,
                renovateRender: true,
            });

            let shader = scheduler.workSpace.getShader();

            assert.equal(shader.length, 1, 'Shader is rendered');

            scheduler.instance.option('currentDate', new Date(2019, 1, 1));
            shader = scheduler.workSpace.getShader();

            assert.equal(shader.length, 1, 'Shader is updated');
        });
    });

    [true, false].forEach((renovateRender) => {
        test(`Scrolling mode should be changed corrctly when renovateRender is ${renovateRender}`, function(assert) {
            const scheduler = createWrapper({
                height: 400,
                scrolling: { mode: 'standard' },
                renovateRender,
            });

            let virtualCells = scheduler.workSpace.getVirtualCells();

            assert.ok(!virtualCells.length, 'There are no virtual cells');

            scheduler.instance.option('scrolling.mode', 'virtual');

            virtualCells = scheduler.workSpace.getVirtualCells();

            assert.ok(!!virtualCells.length, 'There are virtual cells present');
        });
    });

    test('Virtual scrolling should be applied when renovated render is used', function(assert) {
        const scheduler = createWrapper({
            views: [{
                type: 'week',
                intervalCount: 5,
            }],
            currentView: 'week',
            width: 500,
            height: 500,
            renovateRender: true,
        });

        let virtualCells = scheduler.workSpace.getVirtualCells();

        assert.equal(virtualCells.length, 0, 'There are no virtual cells');

        scheduler.instance.option('scrolling', { mode: 'virtual', orientation: 'both' });

        virtualCells = scheduler.workSpace.getVirtualCells();

        assert.ok(virtualCells.length > 0, 'Virtual cells have been rendered');
    });

    [{
        view: 'day',
        cellCount: 1,
    }, {
        view: 'week',
        cellCount: 7,
    }].forEach(({ view, cellCount }) => {
        test(`It should be possible to change showAllDayPanel in runtime in ${view}`, function(assert) {
            const scheduler = createWrapper({
                views: [view],
                currentView: view,
                showAllDayPanel: false,
                renovateRender: true,
            });

            scheduler.instance.option('showAllDayPanel', true);

            assert.equal(scheduler.workSpace.getAllDayCells().length, cellCount, 'Correct number of cells');
        });

        [true, false].forEach((crossScrollingEnabled) => {
            test(`All-day title should be rendered when crossScrollingEnabled=${crossScrollingEnabled} in ${view} and all-day panel is not enabled`, function(assert) {
                const scheduler = createWrapper({
                    views: [view],
                    currentView: view,
                    showAllDayPanel: false,
                    renovateRender: true,
                    crossScrollingEnabled,
                });

                assert.equal(scheduler.workSpace.getAllDayTitle().length, 1, 'All-day title exists');
            });
        });

        test(`All-day title should not be rendered in ${view} when all-day panel is not enabled and vertical grouping is used`, function(assert) {
            const scheduler = createWrapper({
                views: [{
                    type: view,
                    groupOrientation: 'vertical',
                }],
                currentView: view,
                showAllDayPanel: false,
                renovateRender: true,
                groups: ['ownerId'],
                resources: [{
                    fieldExpr: 'ownerId',
                    dataSource: [{
                        text: 'O1',
                        id: 1,
                    }, {
                        text: 'O2',
                        id: 2,
                    }, {
                        text: 'O3',
                        id: 3,
                    }],
                }],
            });

            assert.equal(scheduler.workSpace.getAllDayTitle().length, 0, 'All-day title does not exist');
        });

        test(`All-day title should be rendered in ${view} when all-day panel is not enabled and horizontal grouping is used`, function(assert) {
            const scheduler = createWrapper({
                views: [{
                    type: view,
                    groupOrientation: 'horizontal',
                }],
                currentView: view,
                showAllDayPanel: false,
                renovateRender: true,
                groups: ['ownerId'],
                resources: [{
                    fieldExpr: 'ownerId',
                    dataSource: [{
                        text: 'O1',
                        id: 1,
                    }, {
                        text: 'O2',
                        id: 2,
                    }, {
                        text: 'O3',
                        id: 3,
                    }],
                }],
            });

            assert.equal(scheduler.workSpace.getAllDayTitle().length, 1, 'All-day title exists');
        });
    });

    ['timelineDay', 'timelineWeek', 'timelineMonth'].forEach((view) => {
        test(`${view}'s cells should have correct height when current date changes`, function(assert) {
            const scheduler = createWrapper({
                views: [view],
                currentView: view,
                crossScrollingEnabled: true,
                renovateRender: true,
                height: 600,
                currentDate: new Date(2020, 0, 1),
            });

            const cellHeight = scheduler.workSpace.getCellHeight();

            scheduler.option('currentDate', 2021, 0, 1);

            const cellHeightAfterCurrentDateChange = scheduler.workSpace.getCellHeight();

            assert.equal(cellHeightAfterCurrentDateChange, cellHeight, 'Correct cell hieght');
        });
    });


    [{
        groupOrientation: 'horizontal',
        groupByDate: true,
        cellCount: 7,
        testDescription: 'Header cells in timeline\'s week row should have correct texts when grouping by date is used',
    }, {
        groupOrientation: 'horizontal',
        groupByDate: false,
        cellCount: 14,
        testDescription: 'Header cells in timeline\'s week row should have correct texts when horizontal grouping is used',
    }, {
        groupOrientation: 'vertical',
        groupByDate: false,
        cellCount: 7,
        testDescription: 'Header cells in timeline\'s week row should have correct texts when vertical grouping is used',
    }].forEach(({ groupByDate, groupOrientation, cellCount, testDescription }) => {
        test(testDescription, function(assert) {
            const scheduler = createWrapper({
                height: 500,
                views: [{
                    type: 'timelineWeek',
                    groupOrientation,

                }],
                currentView: 'timelineWeek',
                currentDate: new Date(2021, 6, 21),
                startDayHour: 9,
                endDayHour: 10,
                groups: ['resourceId'],
                resources: [{
                    fieldExpr: 'resourceId',
                    dataSource: [{ id: 1, text: '1' }, { id: 2, text: '2' }],
                }],
                groupByDate,
            });

            const dateHeaderCells = scheduler.workSpace.getWeekDayHeaderPanelCells();

            assert.equal(dateHeaderCells.length, cellCount, 'Correct number of cells');

            const texts = ['Sun 18', 'Mon 19', 'Tue 20', 'Wed 21', 'Thu 22', 'Fri 23', 'Sat 24'];

            dateHeaderCells.each(function(index) {
                const text = texts[index % 7];

                assert.equal($(this).text(), text, 'Correct text');
            });
        });
    });
});
