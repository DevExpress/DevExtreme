import { createWrapper, initTestMarkup, CLASSES } from '../../helpers/scheduler/helpers.js';

import 'common.css!';
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
    });

    ['day', 'week'].forEach(view => {
        test(`Current Time Panel Cell indication should work correctly in simple case in ${view} view`, function(assert) {
            const scheduler = createWrapper({
                ...getBaseConfig({ type: view }),
            });

            let timePanelCells = scheduler.workSpace.getTimePanelCells();
            let firstCell = timePanelCells.eq(3);
            let secondCell = timePanelCells.eq(4);
            let currentTimeCells = scheduler.workSpace.getTimePanelCurrentTimeCells();

            assert.equal(currentTimeCells.length, 2, 'Correct number of current time cells');
            assert.ok(firstCell.hasClass(CURRENT_TIME_CELL_CLASS), 'The first current time cell has current-time class');
            assert.ok(secondCell.hasClass(CURRENT_TIME_CELL_CLASS), 'The second current time cell has current-time class');

            this.clock.tick(HOUR);

            timePanelCells = scheduler.workSpace.getTimePanelCells();
            firstCell = timePanelCells.eq(5);
            secondCell = timePanelCells.eq(6);
            currentTimeCells = scheduler.workSpace.getTimePanelCurrentTimeCells();

            assert.equal(currentTimeCells.length, 2, 'Correct number of current time cells');
            assert.ok(firstCell.hasClass(CURRENT_TIME_CELL_CLASS), 'The first current time cell has current-time class');
            assert.ok(secondCell.hasClass(CURRENT_TIME_CELL_CLASS), 'The second current time cell has current-time class');
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

    [{
        view: 'timelineDay',
        cellIndex: 4,
        timeDifference: HOUR,
    }, {
        view: 'timelineWeek',
        cellIndex: 28,
        timeDifference: HOUR,
    }, {
        view: 'timelineMonth',
        cellIndex: 8,
        timeDifference: HOUR * 48,
    }].forEach(({ view, cellIndex, timeDifference }) => {
        test(`Current Header Panel Cell indication should work correctly in simple case in ${view} view`, function(assert) {
            const scheduler = createWrapper({
                ...getBaseConfig({ type: view }),
            });

            let headerPanelCells = scheduler.workSpace.getOrdinaryHeaderPanelCells();
            let currentCell = headerPanelCells.eq(cellIndex);
            let currentTimeCells = scheduler.workSpace.getHeaderPanelCurrentTimeCells();

            assert.equal(currentTimeCells.length, 1, 'Correct number of current time cells');
            assert.ok(currentCell.hasClass(HEADER_PANEL_CURRENT_TIME_CELL_CLASS), 'The current time cell has current-time class');

            this.clock.tick(timeDifference);

            headerPanelCells = scheduler.workSpace.getOrdinaryHeaderPanelCells();
            currentCell = headerPanelCells.eq(cellIndex + 2);
            currentTimeCells = scheduler.workSpace.getHeaderPanelCurrentTimeCells();

            assert.equal(currentTimeCells.length, 1, 'Correct number of current time cells');
            assert.ok(currentCell.hasClass(HEADER_PANEL_CURRENT_TIME_CELL_CLASS), 'The current time cell has current-time class');
        });
    });

    ['day', 'week'].forEach(view => {
        test(`Current Time Panel Cell indication should work correctly when horizontal grouping is used in ${view} view`, function(assert) {
            const scheduler = createWrapper({
                ...getBaseConfig({
                    type: view,
                    groupOrientation: 'horizontal',
                    groupByDate: false,
                }),
                groups: ['priorityId'],
            });

            let timePanelCells = scheduler.workSpace.getTimePanelCells();
            let firstCell = timePanelCells.eq(3);
            let secondCell = timePanelCells.eq(4);
            let currentTimeCells = scheduler.workSpace.getTimePanelCurrentTimeCells();

            assert.equal(currentTimeCells.length, 2, 'Correct number of current time cells');
            assert.ok(firstCell.hasClass(CURRENT_TIME_CELL_CLASS), 'The first current time cell has current-time class');
            assert.ok(secondCell.hasClass(CURRENT_TIME_CELL_CLASS), 'The second current time cell has current-time class');

            this.clock.tick(HOUR);

            timePanelCells = scheduler.workSpace.getTimePanelCells();
            firstCell = timePanelCells.eq(5);
            secondCell = timePanelCells.eq(6);
            currentTimeCells = scheduler.workSpace.getTimePanelCurrentTimeCells();

            assert.equal(currentTimeCells.length, 2, 'Correct number of current time cells');
            assert.ok(firstCell.hasClass(CURRENT_TIME_CELL_CLASS), 'The first current time cell has current-time class');
            assert.ok(secondCell.hasClass(CURRENT_TIME_CELL_CLASS), 'The second current time cell has current-time class');
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

            let headerPanelCells = scheduler.workSpace.getOrdinaryHeaderPanelCells();
            let currentTimeCells = scheduler.workSpace.getHeaderPanelCurrentTimeCells();

            assert.equal(currentTimeCells.length, 2, 'Correct number of current time cells');

            cellIndices.forEach((cellIndex) => {
                const currentCell = headerPanelCells.eq(cellIndex);
                assert.ok(currentCell.hasClass(HEADER_PANEL_CURRENT_TIME_CELL_CLASS), 'The current time cell has current-time class');
            });

            this.clock.tick(timeDifference);

            headerPanelCells = scheduler.workSpace.getOrdinaryHeaderPanelCells();
            currentTimeCells = scheduler.workSpace.getHeaderPanelCurrentTimeCells();

            assert.equal(currentTimeCells.length, 2, 'Correct number of current time cells');

            cellIndices.forEach((cellIndex) => {
                const currentCell = headerPanelCells.eq(cellIndex + 2);
                assert.ok(currentCell.hasClass(HEADER_PANEL_CURRENT_TIME_CELL_CLASS), 'The current time cell has current-time class');
            });
        });
    });

    [{
        view: 'timelineDay',
        cellIndex: 4,
        timeDifference: HOUR,
    }, {
        view: 'timelineWeek',
        cellIndex: 28,
        timeDifference: HOUR,
    }, {
        view: 'timelineMonth',
        cellIndex: 8,
        timeDifference: HOUR * 48,
    }].forEach(({ view, cellIndex, timeDifference }) => {
        test(`Current Header Panel Cell indication should work correctly when grouping by date is used in ${view} view`, function(assert) {
            const scheduler = createWrapper({
                ...getBaseConfig({
                    type: view,
                    groupOrientation: 'horizontal',
                    groupByDate: true,
                }),
                groups: ['priorityId'],
            });

            let headerPanelCells = scheduler.workSpace.getOrdinaryHeaderPanelCells();
            let currentCell = headerPanelCells.eq(cellIndex);
            let currentTimeCells = scheduler.workSpace.getHeaderPanelCurrentTimeCells();

            assert.equal(currentTimeCells.length, 1, 'Correct number of current time cells');
            assert.ok(currentCell.hasClass(HEADER_PANEL_CURRENT_TIME_CELL_CLASS), 'The current time cell has current-time class');

            this.clock.tick(timeDifference);

            headerPanelCells = scheduler.workSpace.getOrdinaryHeaderPanelCells();
            currentCell = headerPanelCells.eq(cellIndex + 2);
            currentTimeCells = scheduler.workSpace.getHeaderPanelCurrentTimeCells();

            assert.equal(currentTimeCells.length, 1, 'Correct number of current time cells');
            assert.ok(currentCell.hasClass(HEADER_PANEL_CURRENT_TIME_CELL_CLASS), 'The current time cell has current-time class');
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

            let timePanelCells = scheduler.workSpace.getTimePanelCells();
            let currentTimeCells = scheduler.workSpace.getTimePanelCurrentTimeCells();

            assert.equal(currentTimeCells.length, 4, 'Correct number of current time cells');

            cellIndices.forEach((cellIndex) => {
                const currentCell = timePanelCells.eq(cellIndex);
                assert.ok(currentCell.hasClass(CURRENT_TIME_CELL_CLASS), 'The current time cell has current-time class');
            });

            this.clock.tick(HOUR);

            timePanelCells = scheduler.workSpace.getTimePanelCells();
            currentTimeCells = scheduler.workSpace.getTimePanelCurrentTimeCells();

            assert.equal(currentTimeCells.length, 4, 'Correct number of current time cells');

            cellIndices.forEach((cellIndex) => {
                const currentCell = timePanelCells.eq(cellIndex + 2);
                assert.ok(currentCell.hasClass(CURRENT_TIME_CELL_CLASS), 'The current time cell has current-time class');
            });
        });
    });

    [{
        view: 'timelineDay',
        cellIndex: 4,
        timeDifference: HOUR,
    }, {
        view: 'timelineWeek',
        cellIndex: 28,
        timeDifference: HOUR,
    }, {
        view: 'timelineMonth',
        cellIndex: 8,
        timeDifference: HOUR * 48,
    }].forEach(({ view, cellIndex, timeDifference }) => {
        test(`Current Header Panel Cell indication should work correctly when vertical is used in ${view} view`, function(assert) {
            const scheduler = createWrapper({
                ...getBaseConfig({
                    type: view,
                    groupOrientation: 'vertical',
                }),
                groups: ['priorityId'],
            });

            let headerPanelCells = scheduler.workSpace.getOrdinaryHeaderPanelCells();
            let currentCell = headerPanelCells.eq(cellIndex);
            let currentTimeCells = scheduler.workSpace.getHeaderPanelCurrentTimeCells();

            assert.equal(currentTimeCells.length, 1, 'Correct number of current time cells');
            assert.ok(currentCell.hasClass(HEADER_PANEL_CURRENT_TIME_CELL_CLASS), 'The current time cell has current-time class');

            this.clock.tick(timeDifference);

            headerPanelCells = scheduler.workSpace.getOrdinaryHeaderPanelCells();
            currentCell = headerPanelCells.eq(cellIndex + 2);
            currentTimeCells = scheduler.workSpace.getHeaderPanelCurrentTimeCells();

            assert.equal(currentTimeCells.length, 1, 'Correct number of current time cells');
            assert.ok(currentCell.hasClass(HEADER_PANEL_CURRENT_TIME_CELL_CLASS), 'The current time cell has current-time class');
        });
    });

    ['day', 'week'].forEach(view => {
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
        cellIndex: 0,
        timeDifference: HOUR,
    }, {
        view: 'timelineWeek',
        cellIndex: 6,
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
