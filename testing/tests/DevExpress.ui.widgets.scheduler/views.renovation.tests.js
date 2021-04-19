import 'generic_light.css!';

import {
    createWrapper,
    initTestMarkup,
} from '../../helpers/scheduler/helpers.js';

const {
    testStart,
    module,
    test,
} = QUnit;

initTestMarkup();

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
});
