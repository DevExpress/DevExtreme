import { createWrapper, initTestMarkup, CLASSES } from '../../helpers/scheduler/helpers.js';

import 'common.css!';
import 'generic_light.css!';
import 'ui/scheduler/ui.scheduler';

const { testStart, module, test } = QUnit;

const NOW = new Date(2020, 11, 9, 12, 45);
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
    ['day', 'week'].forEach(view => {
        test(`Current Time Panel Cell indication shoul work correctly in simple case in ${view} view`, function(assert) {
            const scheduler = createWrapper({
                views: [view],
                currentView: view,
                currentDate: NOW,
                startDayHour: 10,
            });

            let timePanelCells = scheduler.workSpace.getTimePanelCells();
            let firstCell = timePanelCells.eq(5);
            let secondCell = timePanelCells.eq(6);
            let currentTimeCells = scheduler.workSpace.getTimePanelCurrentTimeCells();

            assert.equal(currentTimeCells.length, 2, 'Correct number of current time cells');
            assert.ok(firstCell.hasClass(CURRENT_TIME_CELL_CLASS), 'The first current time cell has current-time class');
            assert.ok(secondCell.hasClass(CURRENT_TIME_CELL_CLASS), 'The second current time cell has current-time class');

            this.clock.tick(HOUR);

            timePanelCells = scheduler.workSpace.getTimePanelCells();
            firstCell = timePanelCells.eq(7);
            secondCell = timePanelCells.eq(8);
            currentTimeCells = scheduler.workSpace.getTimePanelCurrentTimeCells();

            assert.equal(currentTimeCells.length, 2, 'Correct number of current time cells');
            assert.ok(firstCell.hasClass(CURRENT_TIME_CELL_CLASS), 'The first current time cell has current-time class');
            assert.ok(secondCell.hasClass(CURRENT_TIME_CELL_CLASS), 'The second current time cell has current-time class');
        });
    });

    [{
        view: 'timelineDay',
        cellIndex: 5,
        timeDifference: HOUR,
    }, {
        view: 'timelineWeek',
        cellIndex: 29,
        timeDifference: HOUR,
    }, {
        view: 'timelineMonth',
        cellIndex: 8,
        timeDifference: HOUR * 48,
    }].forEach(({ view, cellIndex, timeDifference }) => {
        test(`Current Header Panel Cell indication shoul work correctly in simple case in ${view} view`, function(assert) {
            const scheduler = createWrapper({
                views: [view],
                currentView: view,
                currentDate: NOW,
                startDayHour: 10,
                endDayHour: 14,
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
});
