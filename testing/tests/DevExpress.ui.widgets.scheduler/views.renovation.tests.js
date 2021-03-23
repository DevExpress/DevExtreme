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
    });
});
