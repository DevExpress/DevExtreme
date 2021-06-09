import { createWrapper, initTestMarkup, CLASSES } from '../../helpers/scheduler/helpers.js';
import { dateToMilliseconds as toMs } from 'core/utils/date';

import 'generic_light.css!';
import 'ui/scheduler/ui.scheduler';

const { testStart, module, test } = QUnit;

const NOW = new Date(2020, 11, 9, 12, 15);
const HOUR = 3600000;

const CURRENT_TIME_CELL_CLASS = CLASSES.currentTimeCell.slice(1);
const HEADER_PANEL_CURRENT_TIME_CELL_CLASS = CLASSES.headerPanelCurrentTimeCell.slice(1);

testStart(() => initTestMarkup());

module('Current Time Cell Indication Updating', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers(NOW.getTime());
    },
    afterEach: function() {
        this.clock.restore();
    },
}, () => {
    const getBaseConfig = (view) => ({
        views: [view],
        currentView: view.type,
        currentDate: NOW,
        resources: [{
            fieldExpr: 'priorityId',
            allowMultiple: false,
            dataSource: [{
                text: 'Low Priority',
                id: 1
            }, {
                text: 'High Priority',
                id: 2
            }],
            label: 'Priority',
        }],
        startDayHour: 10,
        endDayHour: 14,
        indicatorUpdateInterval: 300000,
    });

    const basicViewsConfig = ['day', 'week'];
    const timelineViewsConfig = [{
        view: 'timelineDay',
        cellIndices: [4],
        timeDifference: HOUR,
    }, {
        view: 'timelineWeek',
        cellIndices: [28],
        timeDifference: HOUR,
    }, {
        view: 'timelineMonth',
        cellIndices: [8],
        timeDifference: HOUR * 48,
    }];

    const testBasicView = (assert, scheduler, clock, currentTimeCellsNumber, cellIndices) => {
        let timePanelCells = scheduler.workSpace.getTimePanelCells();
        let currentTimeCells = scheduler.workSpace.getTimePanelCurrentTimeCells();

        assert.equal(currentTimeCells.length, currentTimeCellsNumber, 'Correct number of current time cells');
        cellIndices.forEach((cellIndex) => {
            const currentCell = timePanelCells.eq(cellIndex);
            assert.ok(currentCell.hasClass(CURRENT_TIME_CELL_CLASS), 'The current time cell has current-time class');
        });

        clock.tick(HOUR);

        timePanelCells = scheduler.workSpace.getTimePanelCells();
        currentTimeCells = scheduler.workSpace.getTimePanelCurrentTimeCells();

        assert.equal(currentTimeCells.length, currentTimeCellsNumber, 'Correct number of current time cells');
        cellIndices.forEach((cellIndex) => {
            const currentCell = timePanelCells.eq(cellIndex + 2);
            assert.ok(currentCell.hasClass(CURRENT_TIME_CELL_CLASS), 'The current time cell has current-time class');
        });
    };
    const testTimelineView = (
        assert, scheduler, clock, timeDifference, currentTimeCellsNumber, cellIndices,
    ) => {
        let headerPanelCells = scheduler.workSpace.getOrdinaryHeaderPanelCells();
        let currentTimeCells = scheduler.workSpace.getHeaderPanelCurrentTimeCells();

        assert.equal(currentTimeCells.length, currentTimeCellsNumber, 'Correct number of current time cells');
        cellIndices.forEach((cellIndex) => {
            const currentCell = headerPanelCells.eq(cellIndex);
            assert.ok(currentCell.hasClass(HEADER_PANEL_CURRENT_TIME_CELL_CLASS), 'The current time cell has current-time class');
        });

        clock.tick(timeDifference);

        headerPanelCells = scheduler.workSpace.getOrdinaryHeaderPanelCells();
        currentTimeCells = scheduler.workSpace.getHeaderPanelCurrentTimeCells();

        assert.equal(currentTimeCells.length, currentTimeCellsNumber, 'Correct number of current time cells');
        cellIndices.forEach((cellIndex) => {
            const currentCell = headerPanelCells.eq(cellIndex + 2);
            assert.ok(currentCell.hasClass(HEADER_PANEL_CURRENT_TIME_CELL_CLASS), 'The current time cell has current-time class');
        });
    };

    basicViewsConfig.forEach(view => {
        test(`Current Time Panel Cell indication should work correctly in simple case in ${view} view`, function(assert) {
            const scheduler = createWrapper({
                ...getBaseConfig({ type: view }),
            });

            testBasicView(assert, scheduler, this.clock, 2, [3, 4]);
        });

        test(`Current Time Panel Cell indication should work correctly when it starts from the first cell in ${view} view`, function(assert) {
            const scheduler = createWrapper({
                ...getBaseConfig({ type: view }),
                startDayHour: 12,
            });

            let timePanelCells = scheduler.workSpace.getTimePanelCells();
            let firstCell = timePanelCells.eq(0);
            let currentTimeCells = scheduler.workSpace.getTimePanelCurrentTimeCells();

            assert.equal(currentTimeCells.length, 1, 'Correct number of current time cells');
            assert.ok(firstCell.hasClass(CURRENT_TIME_CELL_CLASS), 'The first current time cell has current-time class');

            this.clock.tick(HOUR);

            timePanelCells = scheduler.workSpace.getTimePanelCells();
            firstCell = timePanelCells.eq(1);
            const secondCell = timePanelCells.eq(2);
            currentTimeCells = scheduler.workSpace.getTimePanelCurrentTimeCells();

            assert.equal(currentTimeCells.length, 2, 'Correct number of current time cells');
            assert.ok(firstCell.hasClass(CURRENT_TIME_CELL_CLASS), 'The first current time cell has current-time class');
            assert.ok(secondCell.hasClass(CURRENT_TIME_CELL_CLASS), 'The second current time cell has current-time class');
        });
    });

    timelineViewsConfig.forEach(({ view, cellIndices, timeDifference }) => {
        test(`Current Header Panel Cell indication should work correctly in simple case in ${view} view`, function(assert) {
            const scheduler = createWrapper({
                ...getBaseConfig({ type: view }),
            });

            testTimelineView(assert, scheduler, this.clock, timeDifference, 1, cellIndices);
        });
    });

    basicViewsConfig.forEach(view => {
        test(`Current Time Panel Cell indication should work correctly when horizontal grouping is used in ${view} view`, function(assert) {
            const scheduler = createWrapper({
                ...getBaseConfig({
                    type: view,
                    groupOrientation: 'horizontal',
                    groupByDate: false,
                }),
                groups: ['priorityId'],
            });

            testBasicView(assert, scheduler, this.clock, 2, [3, 4]);
        });
    });

    [{
        view: 'timelineDay',
        cellIndices: [4, 12],
        timeDifference: HOUR,
    }, {
        view: 'timelineWeek',
        cellIndices: [28, 84],
        timeDifference: HOUR,
    }, {
        view: 'timelineMonth',
        cellIndices: [8, 39],
        timeDifference: HOUR * 48,
    }].forEach(({ view, cellIndices, timeDifference }) => {
        test(`Current Header Panel Cell indication should work correctly when horizontal grouping is used in ${view} view`, function(assert) {
            const scheduler = createWrapper({
                ...getBaseConfig({
                    type: view,
                    groupOrientation: 'horizontal',
                    groupByDate: false,
                }),
                groups: ['priorityId'],
            });

            testTimelineView(assert, scheduler, this.clock, timeDifference, 2, cellIndices);
        });
    });

    timelineViewsConfig.forEach(({ view, cellIndices, timeDifference }) => {
        test(`Current Header Panel Cell indication should work correctly when grouping by date is used in ${view} view`, function(assert) {
            const scheduler = createWrapper({
                ...getBaseConfig({
                    type: view,
                    groupOrientation: 'horizontal',
                    groupByDate: true,
                }),
                groups: ['priorityId'],
            });

            testTimelineView(assert, scheduler, this.clock, timeDifference, 1, cellIndices);
        });
    });

    [{
        view: 'day',
        cellIndices: [3, 4, 11, 12],
    }, {
        view: 'day',
        cellIndices: [3, 4, 11, 12],
    }].forEach(({ view, cellIndices }) => {
        test(`Current Time Panel Cell indication should work correctly when vertical grouping is used in ${view} view`, function(assert) {
            const scheduler = createWrapper({
                ...getBaseConfig({
                    type: view,
                    groupOrientation: 'vertical',
                }),
                groups: ['priorityId'],
            });

            testBasicView(assert, scheduler, this.clock, 4, cellIndices);
        });
    });

    timelineViewsConfig.forEach(({ view, cellIndices, timeDifference }) => {
        test(`Current Header Panel Cell indication should work correctly when vertical is used in ${view} view`, function(assert) {
            const scheduler = createWrapper({
                ...getBaseConfig({
                    type: view,
                    groupOrientation: 'vertical',
                }),
                groups: ['priorityId'],
            });

            testTimelineView(assert, scheduler, this.clock, timeDifference, 1, cellIndices);
        });
    });

    basicViewsConfig.forEach(view => {
        test(`Current Time Panel Cell indication should be updated if it was invisible in ${view} view`, function(assert) {
            const scheduler = createWrapper({
                ...getBaseConfig({ type: view }),
                startDayHour: 13,
            });

            let timePanelCells = scheduler.workSpace.getTimePanelCells();
            let currentTimeCells = scheduler.workSpace.getTimePanelCurrentTimeCells();

            assert.equal(currentTimeCells.length, 0, 'Correct number of current time cells');

            this.clock.tick(HOUR);

            timePanelCells = scheduler.workSpace.getTimePanelCells();
            const cell = timePanelCells.eq(0);
            currentTimeCells = scheduler.workSpace.getTimePanelCurrentTimeCells();

            assert.equal(currentTimeCells.length, 1, 'Correct number of current time cells');
            assert.ok(cell.hasClass(CURRENT_TIME_CELL_CLASS), 'The current time cell has current-time class');
        });
    });

    [{
        view: 'timelineDay',
        columnIndex: 0,
        timeDifference: HOUR,
    }, {
        view: 'timelineWeek',
        columnIndex: 6,
        timeDifference: HOUR,
    }].forEach(({ view, cellIndex, timeDifference }) => {
        test(`Current Header Panel Cell indication should work correctly in simple case in ${view} view`, function(assert) {
            const scheduler = createWrapper({
                ...getBaseConfig({ type: view }),
                startDayHour: 13,
            });

            let currentTimeCells = scheduler.workSpace.getHeaderPanelCurrentTimeCells();

            assert.equal(currentTimeCells.length, 0, 'Correct number of current time cells');

            this.clock.tick(timeDifference);

            const headerPanelCells = scheduler.workSpace.getOrdinaryHeaderPanelCells();
            const currentCell = headerPanelCells.eq(cellIndex);
            currentTimeCells = scheduler.workSpace.getHeaderPanelCurrentTimeCells();

            assert.equal(currentTimeCells.length, 1, 'Correct number of current time cells');
            assert.ok(currentCell.hasClass(HEADER_PANEL_CURRENT_TIME_CELL_CLASS), 'The current time cell has current-time class');
        });
    });
});

module('Integration with Virtual Scrolling', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers(NOW.getTime());
    },
    afterEach: function() {
        this.clock.restore();
    },
}, () => {
    test('Scheduler should display correct number of indicators', function(assert) {
        const scheduler = createWrapper({
            currentDate: NOW,
            views: ['timelineDay', 'timelineWeek', 'timelineMonth'],
            currentView: 'timelineDay',
            startDayHour: 11,
            endDayHour: 13,
            height: 250,
            groups: ['resourceId0'],
            crossScrollingEnabled: true,
            resources: [{
                fieldExpr: 'resourceId0',
                dataSource: [
                    { id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 },
                    { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 },
                ],
            }],
            scrolling: { mode: 'virtual' },
        });

        const actualNumberOfIndicators = scheduler.workSpace.getCurrentTimeIndicatorCount();

        assert.equal(actualNumberOfIndicators, 1, 'Correct number of indicators');
    });
});

module('Common cases', () => {
    test('Current time indicator calculates position correctly with workWeek view (T750252)', function(assert) {
        const clock = sinon.useFakeTimers((new Date(2021, 0, 20, 20)).getTime());

        const scheduler = createWrapper({
            views: [{
                name: '2 Work Weeks',
                type: 'workWeek',
                intervalCount: 2,
                startDate: new Date(Date.now() - 5 * toMs('day')),
            }],
            currentView: 'workWeek',
            currentDate: new Date(),
            height: 580,
        });

        const $dateTimeIndicator = scheduler.workSpace.getCurrentTimeIndicator()[0];
        const position = { top: $dateTimeIndicator.style.top, left: $dateTimeIndicator.style.left };

        assert.notDeepEqual(position, { left: 0, top: 0 }, 'Current time indicator positioned correctly');

        clock.restore();
    });

    test('Current time indicator should be visible in period between 23.59 and 24.00', function(assert) {
        const clock = sinon.useFakeTimers((new Date(2021, 0, 20, 23, 59, 58)).getTime());

        const scheduler = createWrapper({
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(),
            height: 580,
        });

        const currentTimeIndicator = scheduler.workSpace.getCurrentTimeIndicator();

        assert.equal(currentTimeIndicator.length, 1, 'Current time indicator is visible');

        clock.restore();
    });
});
