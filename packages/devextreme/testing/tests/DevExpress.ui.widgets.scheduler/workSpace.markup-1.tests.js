import $ from 'jquery';
import SchedulerWorkSpaceVerticalStrategy from '__internal/scheduler/workspaces/m_work_space_grouped_strategy_vertical';
import dateLocalization from 'common/core/localization/date';
import devices from '__internal/core/m_devices';
import '__internal/scheduler/m_scheduler';

import { getEmptyResourceManager, applyWorkspaceGroups, getWorkspaceResourceConfig } from '../../helpers/scheduler/mockResourceManager.js';

QUnit.testStart(() => {
    const markup =
        '<div id="scheduler-work-space">\
        <div id="scheduler-work-space-grouped">';

    $('#qunit-fixture').html(markup);
});

const ALL_DAY_TABLE_CELL_CLASS = 'dx-scheduler-all-day-table-cell';
const ALL_DAY_ROW_CLASS = 'dx-scheduler-all-day-table-row';
const TIME_PANEL_CLASS = 'dx-scheduler-time-panel';
const ALL_DAY_TITLE_CLASS = 'dx-scheduler-all-day-title';

const VERTICAL_GROUP_TABLE_CLASS = 'dx-scheduler-work-space-vertical-group-table';

const CELL_CLASS = 'dx-scheduler-date-table-cell';
const CELL_TEXT_CLASS = 'dx-scheduler-date-table-cell-text';
const TIME_PANEL_CELL_CLASS = 'dx-scheduler-time-panel-cell';
const HEADER_PANEL_CELL_CLASS = 'dx-scheduler-header-panel-cell';
const HORIZONTAL_SIZES_CLASS = 'dx-scheduler-cell-sizes-horizontal';
const VERTICAL_SIZES_CLASS = 'dx-scheduler-cell-sizes-vertical';

const FIRST_GROUP_CELL_CLASS = 'dx-scheduler-first-group-cell';
const LAST_GROUP_CELL_CLASS = 'dx-scheduler-last-group-cell';

const WORKSPACE_DAY = { class: 'dxSchedulerWorkSpaceDay', name: 'SchedulerWorkSpaceDay' };
const WORKSPACE_WEEK = { class: 'dxSchedulerWorkSpaceWeek', name: 'SchedulerWorkSpaceWeek' };
const WORKSPACE_MONTH = { class: 'dxSchedulerWorkSpaceMonth', name: 'SchedulerWorkSpaceMonth' };

const checkRowsAndCells = function($element, assert, interval, start, end, groupCount) {
    interval = interval || 0.5;
    start = start || 0;
    end = end || 24;
    groupCount = groupCount || 1;

    const cellCount = (end - start) / interval;
    const cellDuration = 3600000 * interval;

    const cellCountInGroup = cellCount;
    assert.equal($element.find('.dx-scheduler-time-panel-row').length, Math.ceil(cellCount * groupCount), 'Time panel has a right count of rows');
    assert.equal($element.find('.dx-scheduler-time-panel-cell').length, Math.ceil(cellCount * groupCount), 'Time panel has a right count of cells');

    $element.find('.dx-scheduler-time-panel-cell').each(function(index) {
        let time;
        const cellIndex = index % cellCountInGroup;

        if(cellIndex % 2 === 0) {
            time = dateLocalization.format(new Date(new Date(1970, 0).getTime() + Math.round(cellDuration) * cellIndex + start * 3600000), 'shorttime');
        } else {
            time = '';
        }
        assert.equal($(this).text(), time, 'Time is OK');
    });
};

const dayModuleConfig = {
    beforeEach: function() {
        this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceDay({
            getResourceManager: getEmptyResourceManager,
        }).dxSchedulerWorkSpaceDay('instance');
    }
};

QUnit.module('Workspace Day markup', dayModuleConfig, () => {
    QUnit.test('Scheduler workspace day should have a right css class', async function(assert) {
        const $element = this.instance.$element();

        assert.ok($element.hasClass('dx-scheduler-work-space-day'), 'dxSchedulerWorkSpaceDay has \'dx-scheduler-workspace-day\' css class');
    });

    QUnit.test('Date table cells should have a special css classes', async function(assert) {
        const $element = this.instance.$element();
        const classes = $element.find('.dx-scheduler-date-table td').attr('class').split(' ');

        assert.ok($.inArray(CELL_CLASS, classes) > -1, `Cell has the ${CELL_CLASS} class`);
        assert.notOk($.inArray(HORIZONTAL_SIZES_CLASS, classes) > -1, `Cell hasn't the ${HORIZONTAL_SIZES_CLASS} class`);
        assert.ok($.inArray(VERTICAL_SIZES_CLASS, classes) > -1, `Cell has the ${VERTICAL_SIZES_CLASS} class`);
    });

    QUnit.test('Scheduler all day panel should contain one row', async function(assert) {
        this.instance.option('showAllDayPanel', true);

        const $allDayPanel = this.instance.$element().find('.dx-scheduler-all-day-panel');

        assert.equal($allDayPanel.find('tbody tr').length, 1, 'All day panel contains 1 row');
        assert.equal($allDayPanel.find('tbody tr>td').length, 1, 'All day panel contains 1 cell');
    });

    QUnit.test('Scheduler workspace date-table rows and cells should have correct css-class', async function(assert) {
        const $element = this.instance.$element();
        const $dateTable = $element.find('.dx-scheduler-date-table');
        const $row = $dateTable.find('tr').first();
        const $cell = $row.find('td').first();

        assert.ok($row.hasClass('dx-scheduler-date-table-row'), 'Row class is correct');
        assert.ok($cell.hasClass('dx-scheduler-date-table-cell'), 'Cell class is correct');
    });

    QUnit.test('Scheduler workspace day view', async function(assert) {
        const $element = this.instance.$element();
        let cellCounter = 0;


        assert.equal($element.find('.dx-scheduler-date-table tbody tr').length, 48, 'Date table has 48 rows');
        assert.equal($element.find('.dx-scheduler-date-table tbody tr>td').length, 48, 'Date table has 48 cells');

        $element.find('.dx-scheduler-date-table tbody tr').each(function() {
            if($(this).find('td').length === 1) {
                cellCounter++;
            }
        });

        assert.equal(cellCounter, 48, 'Each row has a single cell');
    });

    QUnit.test('Scheduler workspace day grouped view', async function(assert) {
        const $element = this.instance.$element();
        let cellCounter = 0;
        await applyWorkspaceGroups(this.instance, [{
            label: 'one',
            fieldExpr: 'one',
            dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
        }]);

        assert.equal($element.find('.dx-scheduler-date-table tbody tr').length, 48, 'Date table has 48 rows');
        assert.equal($element.find('.dx-scheduler-date-table tbody tr>td').length, 96, 'Date table has 96 cells');

        $element.find('.dx-scheduler-date-table tbody tr').each(function() {
            if($(this).find('td').length === 2) {
                cellCounter++;
            }
        });

        assert.equal(cellCounter, 48, 'Each row has a two cells');
    });

    QUnit.test('Grouped cells should have a right group field in cellData', async function(assert) {
        const $element = this.instance.$element();
        await applyWorkspaceGroups(this.instance, [{
            label: 'one',
            fieldExpr: 'one',
            dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
        }]);

        assert.deepEqual(this.instance.getCellData($element.find('.dx-scheduler-date-table tbody tr>td').eq(0)).groups, {
            one: 1
        }, 'Cell group is OK');
        assert.deepEqual(this.instance.getCellData($element.find('.dx-scheduler-date-table tbody tr>td').eq(1)).groups, { one: 2 }, 'Cell group is OK');
    });

    QUnit.test('Scheduler workspace day view should not contain a single header', async function(assert) {
        const $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-header-row th').length, 0, 'Date table has not header cell');
    });

    QUnit.test('Scheduler workspace day grouped view should contain a few headers', async function(assert) {
        const $element = this.instance.$element();
        await applyWorkspaceGroups(this.instance, [{
            label: 'one',
            fieldExpr: 'one',
            dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
        }, {
            label: 'two',
            fieldExpr: 'two',
            dataSource: [{ id: 1, text: 'c' }, { id: 2, text: 'd' }]
        }]);

        assert.equal($element.find('.dx-scheduler-header-row th').length, 0, 'Date table has not header cell');
        assert.equal($element.find('.dx-scheduler-group-row').eq(0).find('th').attr('colspan'), '2', 'Group header has a right \'colspan\'');
        assert.strictEqual($element.find('.dx-scheduler-group-row').eq(1).find('th').attr('colspan'), '1', 'Group header has a right \'colspan\'');
    });

    QUnit.test('Time panel should have 24 rows and 24 cells', async function(assert) {
        checkRowsAndCells(this.instance.$element(), assert);
    });

    QUnit.test('Time panel should have 22 rows and 22 cells for hoursInterval = 1 & startDayHour = 2', async function(assert) {
        this.instance.option({
            hoursInterval: 1,
            startDayHour: 2
        });

        checkRowsAndCells(this.instance.$element(), assert, 1, 2);
    });

    QUnit.test('Time panel should have right cell text when hoursInterval is fractional', async function(assert) {
        this.instance.option({
            hoursInterval: 2.1666666666666665,
            endDayHour: 5
        });

        checkRowsAndCells(this.instance.$element(), assert, 2.1666666666666665, 0, 5);
    });

    QUnit.test('Cell count should depend on start/end day hour & hoursInterval', async function(assert) {
        const $element = this.instance.$element();

        this.instance.option({
            currentDate: new Date(2015, 2, 1),
            startDayHour: 8,
            endDayHour: 20,
            hoursInterval: 2.5
        });

        assert.equal($element.find('.dx-scheduler-date-table-cell').length, 5, 'Cell count is OK');
    });

    QUnit.test('WorkSpace Day view has right count of cells with view option intervalCount=2', async function(assert) {
        this.instance.option('intervalCount', 2);

        let cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance.getCellCountInDay() * 2, 'view has right cell count');

        this.instance.option('intervalCount', 4);

        cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance.getCellCountInDay() * 4, 'view has right cell count');
    });
});

const dayWithGroupingModuleConfig = {
    beforeEach: async function() {
        const resourceConfig = await getWorkspaceResourceConfig([{
            label: 'a',
            fieldExpr: 'a',
            dataSource: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }]
        }]);
        this.instance = $('#scheduler-work-space-grouped').dxSchedulerWorkSpaceDay({
            groupOrientation: 'vertical',
            showCurrentTimeIndicator: false,
            startDayHour: 8,
            showAllDayPanel: false,
            endDayHour: 20,
            ...resourceConfig,
        }).dxSchedulerWorkSpaceDay('instance');
    }
};

QUnit.module('Workspace Day markup with vertical grouping', dayWithGroupingModuleConfig, () => {
    QUnit.test('Scheduler workspace day should have a right css class', async function(assert) {
        const $element = this.instance.$element();

        assert.ok($element.hasClass('dx-scheduler-work-space-vertical-grouped'), 'Workspace has \'dx-scheduler-work-space-vertical-grouped\' css class');
    });

    QUnit.test('Scheduler workspace day should have right groupedStrategy, groupOrientation = vertical', async function(assert) {
        assert.ok(this.instance.groupedStrategy instanceof SchedulerWorkSpaceVerticalStrategy, 'Grouped strategy is right');
    });

    QUnit.test('Scheduler all day rows should be built into dateTable', async function(assert) {
        this.instance.option('showAllDayPanel', true);

        const $allDayRows = this.instance.$element().find(`.${ALL_DAY_ROW_CLASS}`);

        assert.equal($allDayRows.length, 2, 'DateTable contains 2 allDay rows');
    });

    QUnit.test('Scheduler all day titles should be built into timePanel', async function(assert) {
        this.instance.option('showAllDayPanel', true);

        const $timePanel = this.instance.$element().find(`.${TIME_PANEL_CLASS}`);
        const $allDayTitles = $timePanel.find(`.${ALL_DAY_TITLE_CLASS}`);

        assert.equal($allDayTitles.length, 2, 'TimePanel contains 2 allDay titles');
    });

    QUnit.test('Date table should have right group header', async function(assert) {
        const $element = this.instance.$element();

        assert.equal($element.find('.' + VERTICAL_GROUP_TABLE_CLASS).length, 1, 'Group header is rendered');
    });

    QUnit.test('Date table should have right group header cells count', async function(assert) {
        const $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-group-header').length, 2, 'Group header cells count is ok');
    });

    QUnit.test('Scheduler workspace Day should have a right rows count', async function(assert) {
        const $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-date-table tbody tr').length, 48, 'Workspace has 48 rows');
    });

    QUnit.test('Time panel should have right rows count and cell text, even cells count', async function(assert) {
        checkRowsAndCells(this.instance.$element(), assert, 0.5, 8, 20, 2);
    });

    QUnit.test('Time panel should have right rows count and cell text, odd cells count', async function(assert) {
        this.instance.option({
            startDayHour: 9,
            endDayHour: 16,
            hoursInterval: 1
        });

        checkRowsAndCells(this.instance.$element(), assert, 1, 9, 16, 2);
    });

    QUnit.test('Time panel should have 48 rows and 48 cells', async function(assert) {
        const $element = this.instance.$element();

        const cellCount = $element.find('.dx-scheduler-date-table tbody tr').length;

        assert.equal($element.find('.dx-scheduler-time-panel-row').length, cellCount, 'Time panel has a right count of rows');
        assert.equal($element.find('.dx-scheduler-time-panel-cell').length, cellCount, 'Time panel has a right count of cells');
    });

    QUnit.test('Grouped cells should have a right group field in cellData', async function(assert) {
        const $element = this.instance.$element();

        assert.deepEqual(this.instance.getCellData($element.find('.dx-scheduler-date-table tbody tr>td').eq(0)).groups, {
            a: 1
        }, 'Cell group is OK');
        assert.deepEqual(this.instance.getCellData($element.find('.dx-scheduler-date-table tbody tr>td').eq(25)).groups, { a: 2 }, 'Cell group is OK');
    });

    QUnit.test('Grouped allDay cells should have a right group field in cellData', async function(assert) {
        this.instance.option('showAllDayPanel', true);

        const $allDayCells = this.instance.$element().find(`.${ALL_DAY_TABLE_CELL_CLASS}`);

        assert.deepEqual(this.instance.getCellData($allDayCells.eq(0)).groups, { a: 1 }, 'Cell group is OK');
        assert.deepEqual(this.instance.getCellData($allDayCells.eq(1)).groups, { a: 2 }, 'Cell group is OK');
    });
});

const weekModuleConfig = {
    beforeEach: function() {
        this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWeek({
            showCurrentTimeIndicator: false,
            getResourceManager: getEmptyResourceManager,
        }).dxSchedulerWorkSpaceWeek('instance');
    }
};

QUnit.module('Workspace Week markup', weekModuleConfig, () => {
    QUnit.test('Scheduler workspace week should have a right css class', async function(assert) {
        const $element = this.instance.$element();

        assert.ok($element.hasClass('dx-scheduler-work-space-week'), 'dxSchedulerWorkSpaceWeek has \'dx-scheduler-workspace-week\' css class');
    });

    QUnit.test('Header cells should have a special css classes', async function(assert) {
        const $element = this.instance.$element();
        const classes = $element.find('.dx-scheduler-header-panel th').attr('class').split(' ');

        assert.ok($.inArray('dx-scheduler-header-panel-cell', classes) > -1, 'Cell has the dx-scheduler-header-panel-cell class');
        assert.notOk($.inArray(HORIZONTAL_SIZES_CLASS, classes) > -1, `Cell hasn't the ${HORIZONTAL_SIZES_CLASS} class`);
        assert.notOk($.inArray(VERTICAL_SIZES_CLASS, classes) > -1, `Cell hasn't the ${VERTICAL_SIZES_CLASS} class`);
    });

    QUnit.test('Scheduler all day panel should contain one row & 7 cells', async function(assert) {
        this.instance.option('showAllDayPanel', true);

        const $allDayPanel = this.instance.$element().find('.dx-scheduler-all-day-panel');

        assert.equal($allDayPanel.find('tbody tr').length, 1, 'All day panel contains 1 row');
        assert.equal($allDayPanel.find('tbody tr>td').length, 7, 'All day panel contains 7 cell');
    });

    QUnit.test('Scheduler workspace week view', async function(assert) {
        const $element = this.instance.$element();
        let cellCounter = 0;

        assert.equal($element.find('.dx-scheduler-date-table tbody tr').length, 48, 'Date table has 48 rows');
        assert.equal($element.find('.dx-scheduler-date-table tbody tr>td').length, 336, 'Date table has 336 cells');

        $element.find('.dx-scheduler-date-table tbody tr').each(function() {
            if($(this).find('td').length === 7) {
                cellCounter++;
            }
        });

        assert.equal(cellCounter, 48, 'Each row has a seven cells');
    });

    QUnit.test('Time panel should have 24 rows and 24 cells', async function(assert) {
        this.instance.option('currentDate', new Date(1970, 0));
        checkRowsAndCells(this.instance.$element(), assert);
    });

    QUnit.test('Scheduler workspace week grouped view', async function(assert) {
        const $element = this.instance.$element();
        let cellCounter = 0;
        await applyWorkspaceGroups(this.instance, [{
            label: 'one',
            fieldExpr: 'one',
            dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
        }]);

        assert.equal($element.find('.dx-scheduler-date-table tbody tr').length, 48, 'Date table has 48 rows');
        assert.equal($element.find('.dx-scheduler-date-table tbody tr>td').length, 672, 'Date table has 672 cells');

        $element.find('.dx-scheduler-date-table tbody tr').each(function() {
            if($(this).find('td').length === 14) {
                cellCounter++;
            }
        });

        assert.equal(cellCounter, 48, 'Each row has a fourteen cells');
    });

    QUnit.test('Scheduler workspace week view should contain a 7 headers', async function(assert) {
        const $element = this.instance.$element();

        const weekStartDate = new Date().getDate() - new Date().getDay();

        const $headerCells = $element.find('.dx-scheduler-header-row th');

        assert.equal($headerCells.length, 7, 'Date table has 7 header cells');

        $headerCells.each(function(index, cell) {
            const date = new Date();
            date.setDate(weekStartDate + index);

            const cellText = [
                dateLocalization.getDayNames('abbreviated')[index % 7].toLowerCase(),
                date.getDate()
            ].join(' ');

            assert.equal($(cell).text().toLowerCase(), cellText, 'Header has a right text');
            assert.equal($(cell).attr('title').toLowerCase(), cellText, 'Header has a right title');
        });
    });

    QUnit.test('Scheduler workspace grouped week view should contain a few headers', async function(assert) {
        const $element = this.instance.$element();
        await applyWorkspaceGroups(this.instance, [{
            label: 'one',
            fieldExpr: 'one',
            dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
        }, {
            label: 'two',
            fieldExpr: 'two',
            dataSource: [{ id: 1, text: 'c' }, { id: 2, text: 'd' }]
        }]);

        const $headerCells = $element.find('.dx-scheduler-header-row th');

        assert.equal($headerCells.length, 28, 'Date table has 28 header cells');

        assert.equal($element.find('.dx-scheduler-group-row').eq(0).find('th').attr('colspan'), '14', 'Group header has a right \'colspan\'');
        assert.equal($element.find('.dx-scheduler-group-row').eq(1).find('th').attr('colspan'), '7', 'Group header has a right \'colspan\'');
    });

    QUnit.test('Group header should be rendered if there are some groups, groupByDate = true', async function(assert) {

        assert.equal(this.instance.$element().find('.dx-scheduler-group-header').length, 0, 'Groups are not rendered');
        await applyWorkspaceGroups(this.instance, [{
            label: 'one',
            fieldExpr: 'one',
            dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
        }, {
            label: 'two',
            fieldExpr: 'two',
            dataSource: [{ id: 1, text: 'c' }, { id: 2, text: 'd' }, { id: 3, text: 'e' }]
        }]);

        this.instance.option('groupByDate', true);

        const rows = this.instance.$element().find('.dx-scheduler-group-row');
        const firstRowCells = rows.eq(0).find('.dx-scheduler-group-header');
        const secondRowCells = rows.eq(1).find('.dx-scheduler-group-header');

        assert.equal(rows.length, 2, 'There are two group rows');

        assert.equal(firstRowCells.length, 14, 'The first group row contains 14 group headers');
        assert.equal(firstRowCells.attr('colspan'), '3', 'Cells of the first group row have a right colspan attr');
        assert.equal(firstRowCells.eq(0).text(), 'a', 'Cell has a right text');
        assert.equal(firstRowCells.eq(1).text(), 'b', 'Cell has a right text');

        assert.equal(secondRowCells.length, 42, 'The second group row contains 42 group headers');

        assert.strictEqual(secondRowCells.attr('colspan'), '1', 'Cells of the second group row do not have colspan attr');

        assert.equal(secondRowCells.eq(0).text(), 'c', 'Cell has a right text');
        assert.equal(secondRowCells.eq(1).text(), 'd', 'Cell has a right text');
        assert.equal(secondRowCells.eq(2).text(), 'e', 'Cell has a right text');

        assert.equal(secondRowCells.eq(3).text(), 'c', 'Cell has a right text');
        assert.equal(secondRowCells.eq(4).text(), 'd', 'Cell has a right text');
        assert.equal(secondRowCells.eq(5).text(), 'e', 'Cell has a right text');
    });

    QUnit.test('Group row should be rendered before header row', async function(assert) {
        await applyWorkspaceGroups(this.instance, [{
            label: 'one',
            fieldExpr: 'one',
            dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
        }]);
        const $element = this.instance.$element();
        const $groupRow = $element.find('.dx-scheduler-group-row');
        const $headerRow = $element.find('.dx-scheduler-header-row');

        assert.deepEqual($groupRow.next().get(0), $headerRow.get(0), 'Group row rendered correctly');
    });

    QUnit.test('WorkSpace Week view has right count of cells with view option intervalCount', async function(assert) {
        this.instance.option('intervalCount', 2);

        let cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance.getCellCountInDay() * 7 * 2, 'view has right cell count');

        this.instance.option('intervalCount', 4);

        cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance.getCellCountInDay() * 7 * 4, 'view has right cell count');
    });
});

const weekWithGroupingModuleConfig = {
    beforeEach: async function() {
        const resourceConfig = await getWorkspaceResourceConfig([{
            label: 'a',
            fieldExpr: 'a',
            dataSource: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }]
        }]);
        this.instance = $('#scheduler-work-space-grouped').dxSchedulerWorkSpaceWeek({
            groupOrientation: 'vertical',
            startDayHour: 8,
            showAllDayPanel: false,
            endDayHour: 20,
            ...resourceConfig,
        }).dxSchedulerWorkSpaceWeek('instance');
    }
};

QUnit.module('Workspace Week markup with vertical grouping', weekWithGroupingModuleConfig, () => {
    QUnit.test('Scheduler workspace day should have a right css class', async function(assert) {
        const $element = this.instance.$element();

        assert.ok($element.hasClass('dx-scheduler-work-space-vertical-grouped'), 'Workspace has \'dx-scheduler-work-space-vertical-grouped\' css class');
    });

    QUnit.test('Scheduler workspace Week should have a right rows count', async function(assert) {
        const $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-date-table tbody tr').length, 48, 'Workspace has 48 rows');
    });

    QUnit.test('Scheduler all day rows should be built into dateTable', async function(assert) {
        this.instance.option('showAllDayPanel', true);

        const $allDayRows = this.instance.$element().find(`.${ALL_DAY_ROW_CLASS}`);

        assert.equal($allDayRows.length, 2, 'DateTable contains 2 allDay rows');
    });
    QUnit.test('Time panel should have right rows count and cell text', async function(assert) {
        checkRowsAndCells(this.instance.$element(), assert, 0.5, 8, 20, 2);
    });

    QUnit.test('Grouped cells should have a right group field in cellData', async function(assert) {
        const $element = this.instance.$element();
        const $cells = $element.find('.dx-scheduler-date-table tbody tr>td');
        const cellCount = $cells.length;

        assert.deepEqual(this.instance.getCellData($cells.eq(0)).groups, {
            a: 1
        }, 'Cell group is OK');
        assert.deepEqual(this.instance.getCellData($cells.eq(cellCount / 2)).groups, { a: 2 }, 'Cell group is OK');
    });
});

const workWeekModuleConfig = {
    beforeEach: function() {
        this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWeek({
            type: 'workWeek',
            skippedDays: [0, 6],
            getResourceManager: getEmptyResourceManager,
        }).dxSchedulerWorkSpaceWeek('instance');
    }
};

QUnit.module('Workspace Work Week markup', workWeekModuleConfig, () => {
    QUnit.test('Scheduler workspace work week should have a right css class', async function(assert) {
        const $element = this.instance.$element();

        assert.ok($element.hasClass('dx-scheduler-work-space-work-week'), 'workWeek has \'dx-scheduler-workspace-work-week\' css class');
    });

    QUnit.test('Scheduler all day panel should contain one row & 5 cells', async function(assert) {
        this.instance.option('showAllDayPanel', true);

        const $allDayPanel = this.instance.$element().find('.dx-scheduler-all-day-panel');

        assert.equal($allDayPanel.find('tbody tr').length, 1, 'All day panel contains 1 row');
        assert.equal($allDayPanel.find('tbody tr>td').length, 5, 'All day panel contains 5 cell');
    });

    QUnit.test('Scheduler workspace work week view', async function(assert) {
        const $element = this.instance.$element();
        let cellCounter = 0;

        assert.equal($element.find('.dx-scheduler-date-table tbody tr').length, 48, 'Date table has 48 rows');
        assert.equal($element.find('.dx-scheduler-date-table tbody tr>td').length, 240, 'Date table has 240 cells');

        $element.find('.dx-scheduler-date-table tbody tr').each(function() {
            if($(this).find('td').length === 5) {
                cellCounter++;
            }
        });

        assert.equal(cellCounter, 48, 'Each row has a five cells');
    });

    QUnit.test('Scheduler workspace work week grouped view', async function(assert) {
        const $element = this.instance.$element();
        let cellCounter = 0;
        await applyWorkspaceGroups(this.instance, [{
            label: 'one',
            fieldExpr: 'one',
            dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
        }]);

        assert.equal($element.find('.dx-scheduler-date-table tbody tr').length, 48, 'Date table has 48 rows');
        assert.equal($element.find('.dx-scheduler-date-table tbody tr>td').length, 480, 'Date table has 480 cells');

        $element.find('.dx-scheduler-date-table tbody tr').each(function() {
            if($(this).find('td').length === 10) {
                cellCounter++;
            }
        });

        assert.equal(cellCounter, 48, 'Each row has a ten cells');
    });

    QUnit.test('Scheduler workspace work week view should contain a 5 headers', async function(assert) {
        const currentDate = new Date(2021, 2, 21);
        this.instance.option('currentDate', currentDate);

        const $element = this.instance.$element();
        const weekStartDate = new Date(currentDate).getDate() - (new Date(currentDate).getDay() - 1);
        const $headerCells = $element.find('.dx-scheduler-header-panel-cell');

        assert.equal($headerCells.length, 5, 'Date table has 5 header cells');

        $headerCells.each(function(index, cell) {
            const date = new Date(currentDate);
            date.setDate(weekStartDate + index);
            assert.equal($(cell).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[(index + 1) % 7].toLowerCase() + ' ' + date.getDate(), 'Header has a right text');
        });
    });

    QUnit.test('Scheduler workspace work week grouped view should contain a few headers', async function(assert) {
        const $element = this.instance.$element();
        await applyWorkspaceGroups(this.instance, [{
            label: 'one',
            fieldExpr: 'one',
            dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
        }, {
            label: 'two',
            fieldExpr: 'two',
            dataSource: [{ id: 1, text: 'c' }, { id: 2, text: 'd' }]
        }]);

        const $headerCells = $element.find('.dx-scheduler-header-row th');

        assert.equal($headerCells.length, 20, 'Date table has 20 header cells');
        assert.equal($element.find('.dx-scheduler-group-row').eq(0).find('th').attr('colspan'), '10', 'Group header has a right \'colspan\'');
        assert.equal($element.find('.dx-scheduler-group-row').eq(1).find('th').attr('colspan'), '5', 'Group header has a right \'colspan\'');
    });

    QUnit.test('Scheduler workspace work week view should be correct with any first day of week', async function(assert) {
        const instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWeek({
            type: 'workWeek',
            skippedDays: [0, 6],
            firstDayOfWeek: 2,
            currentDate: new Date(2015, 1, 4)
        }).dxSchedulerWorkSpaceWeek('instance');

        const $element = instance.$element();

        const $headerCells = $element.find('.dx-scheduler-header-row th');

        assert.equal($headerCells.first().text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[2].toLowerCase() + ' 3', 'first header has a right text');
        assert.equal($headerCells.eq(3).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[5].toLowerCase() + ' 6', '4 header has a right text');
        assert.equal($headerCells.last().text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[1].toLowerCase() + ' 9', 'last header has a right text');
    });

    QUnit.test('Scheduler workspace work week view should be correct, if currentDate is Sunday', async function(assert) {
        const $element = this.instance.$element();

        this.instance.option('firstDayOfWeek', 0);
        this.instance.option('currentDate', new Date(2016, 0, 10));

        const $headerCells = $element.find('.dx-scheduler-header-row th');

        assert.equal($headerCells.first().text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[1].toLowerCase() + ' 11', 'first header has a right text');
        assert.equal($headerCells.eq(2).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[3].toLowerCase() + ' 13', '3 header has a right text');
        assert.equal($headerCells.last().text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[5].toLowerCase() + ' 15', 'last header has a right text');
    });

    QUnit.test('Scheduler workspace work week view should be correct with any first day of week, if currentDate is Sunday', async function(assert) {
        const instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWeek({
            type: 'workWeek',
            skippedDays: [0, 6],
            currentDate: new Date(2016, 0, 10),
            firstDayOfWeek: 3
        }).dxSchedulerWorkSpaceWeek('instance');

        const $element = instance.$element();

        const $headerCells = $element.find('.dx-scheduler-header-row th');

        assert.equal($headerCells.first().text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[3].toLowerCase() + ' 6', 'first header has a right text');
        assert.equal($headerCells.eq(2).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[5].toLowerCase() + ' 8', '3 header has a right text');
        assert.equal($headerCells.last().text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[2].toLowerCase() + ' 12', 'last header has a right text');
    });

    QUnit.test('Time panel should have 24 rows and 24 cells', async function(assert) {
        checkRowsAndCells(this.instance.$element(), assert);
    });

    QUnit.test('WorkSpace WorkWeek view has right count of cells with view option intervalCount', async function(assert) {
        this.instance.option('intervalCount', 2);

        let cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance.getCellCountInDay() * 5 * 2, 'view has right cell count');

        this.instance.option('intervalCount', 4);

        cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance.getCellCountInDay() * 5 * 4, 'view has right cell count');
    });

    QUnit.test('Workspace work week view should contain 15 headers if intervalCount=3', async function(assert) {
        this.instance.option({
            intervalCount: 3,
            firstDayOfWeek: 1,
            currentDate: new Date(2017, 5, 26)
        });

        const instance = this.instance;

        const currentDate = instance.option('currentDate');
        const $element = instance.$element();
        const $headerCells = $element.find('.dx-scheduler-header-panel-cell');
        let date;
        let i;

        assert.equal($headerCells.length, 15, 'Date table has 15 header cells');
        for(i = 0; i < 5; i++) {
            date = new Date(this.instance.option('currentDate'));
            date.setDate(currentDate.getDate() + i);
            assert.equal($headerCells.eq(i).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[(i + 1) % 7].toLowerCase() + ' ' + date.getDate(), 'Header has a right text');
        }
        for(i = 7; i < 12; i++) {
            date = new Date(this.instance.option('currentDate'));
            date.setDate(currentDate.getDate() + i);
            assert.equal($headerCells.eq(i - 2).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[(i + 1) % 7].toLowerCase() + ' ' + date.getDate(), 'Header has a right text');
        }
        for(i = 14; i < 19; i++) {
            date = new Date(this.instance.option('currentDate'));
            date.setDate(currentDate.getDate() + i);
            assert.equal($headerCells.eq(i - 4).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[(i + 1) % 7].toLowerCase() + ' ' + date.getDate(), 'Header has a right text');
        }
    });

    QUnit.test('Grouped Workspace work week view should contain right count of headers with view option intervalCount', async function(assert) {
        this.instance.option({
            intervalCount: 2,
            firstDayOfWeek: 1,
            currentDate: new Date(2017, 5, 26)
        });

        const instance = this.instance;
        await applyWorkspaceGroups(this.instance, [{
            label: 'a',
            fieldExpr: 'a',
            dataSource: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }]
        }]);

        const currentDate = instance.option('currentDate');
        const $element = instance.$element();
        const $headerCells = $element.find('.dx-scheduler-header-panel-cell');
        let date;
        let i;

        assert.equal($headerCells.length, 20, 'Date table has 15 header cells');
        for(i = 0; i < 5; i++) {
            date = new Date(this.instance.option('currentDate'));
            date.setDate(currentDate.getDate() + i);
            assert.equal($headerCells.eq(i).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[(i + 1) % 7].toLowerCase() + ' ' + date.getDate(), 'Header has a right text');
        }
        for(i = 7; i < 12; i++) {
            date = new Date(this.instance.option('currentDate'));
            date.setDate(currentDate.getDate() + i);
            assert.equal($headerCells.eq(i - 2).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[(i + 1) % 7].toLowerCase() + ' ' + date.getDate(), 'Header has a right text');
        }
        for(i = 14; i < 19; i++) {
            date = new Date(this.instance.option('currentDate'));
            date.setDate(currentDate.getDate() + i - 14);
            assert.equal($headerCells.eq(i - 4).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[(i + 1) % 7].toLowerCase() + ' ' + date.getDate(), 'Header has a right text');
        }
        for(i = 21; i < 26; i++) {
            date = new Date(this.instance.option('currentDate'));
            date.setDate(currentDate.getDate() + i - 14);
            assert.equal($headerCells.eq(i - 6).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[(i + 1) % 7].toLowerCase() + ' ' + date.getDate(), 'Header has a right text');
        }
    });
});

const monthModuleConfig = {
    beforeEach: function() {
        this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceMonth({
            getResourceManager: getEmptyResourceManager,
        }).dxSchedulerWorkSpaceMonth('instance');
    }
};

QUnit.module('Workspace Month markup', monthModuleConfig, () => {
    QUnit.test('Scheduler workspace month should have a right css class', async function(assert) {
        const $element = this.instance.$element();

        assert.ok($element.hasClass('dx-scheduler-work-space-month'), 'dxSchedulerWorkSpaceMonth has \'dx-scheduler-workspace-month\' css class');
    });

    QUnit.test('Scheduler all day panel should not contain rows & cells', async function(assert) {
        const $allDayPanel = this.instance.$element().find('.dx-scheduler-all-day-panel');

        assert.equal($allDayPanel.find('tbody tr').length, 0, 'All day panel does not contain rows');
    });

    QUnit.test('Scheduler time panel should not contain rows & cells', async function(assert) {
        const $timePanel = this.instance.$element().find('.dx-scheduler-time-panel');

        assert.equal($timePanel.find('tbody tr').length, 0, 'Time panel does not contain rows');
    });

    QUnit.test('Scheduler workspace month view', async function(assert) {
        const $element = this.instance.$element();
        let cellCounter = 0;

        assert.equal($element.find('.dx-scheduler-date-table tbody tr').length, 6, 'Date table has 6 rows');
        assert.equal($element.find('.dx-scheduler-date-table tbody tr>td').length, 42, 'Date table has 42 cells');

        $element.find('.dx-scheduler-date-table tbody tr').each(function() {
            if($(this).find('td').length === 7) {
                cellCounter++;
            }
        });

        assert.equal(cellCounter, 6, 'Each row has a seven cells');
    });

    QUnit.test('Scheduler workspace month grouped view', async function(assert) {
        const $element = this.instance.$element();
        let cellCounter = 0;

        this.instance.option('currentDate', new Date(2015, 2, 5));
        this.instance.option('firstDayOfWeek', 1);
        await applyWorkspaceGroups(this.instance, [{
            label: 'one',
            fieldExpr: 'one',
            dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }, { id: 3, text: 'c' }]
        }]);

        assert.equal($element.find('.dx-scheduler-date-table tbody tr').length, 6, 'Date table has 6 rows');
        assert.equal($element.find('.dx-scheduler-date-table tbody tr>td').length, 126, 'Date table has 126 cells');

        $element.find('.dx-scheduler-date-table tbody tr').each(function() {
            if($(this).find('td').length === 21) {
                cellCounter++;
            }
        });

        assert.equal(cellCounter, 6, 'Each row has a 21 cells');
        assert.equal($element.find('.dx-scheduler-date-table tbody tr>td').eq(7).text(), '23', 'Text is OK');
    });

    QUnit.test('Scheduler workspace month view should contain a 7 headers', async function(assert) {
        const $element = this.instance.$element();

        const $headerCells = $element.find('.dx-scheduler-header-row th');

        assert.equal($headerCells.length, 7, 'Date table has 7 header cells');

        $headerCells.each(function(index, cell) {
            assert.equal($(cell).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[index % 7].toLowerCase(), 'Header has a right text');
        });
    });

    QUnit.test('Scheduler workspace month grouped view should contain a few headers', async function(assert) {
        const $element = this.instance.$element();
        await applyWorkspaceGroups(this.instance, [{
            label: 'one',
            fieldExpr: 'one',
            dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }, { id: 3, text: 'c' }]
        }, {
            label: 'two',
            fieldExpr: 'two',
            dataSource: [{ id: 1, text: 'd' }, { id: 2, text: 'e' }, { id: 3, text: 'f' }]
        }]);

        const $headerCells = $element.find('.dx-scheduler-header-row th');

        assert.equal($headerCells.length, 63, 'Date table has 63 header cells');
        assert.equal($element.find('.dx-scheduler-group-row').eq(0).find('th').attr('colspan'), 21, 'Group header has a right \'colspan\'');
        assert.equal($element.find('.dx-scheduler-group-row').eq(1).find('th').attr('colspan'), 7, 'Group header has a right \'colspan\'');
    });

    QUnit.test('Scheduler workspace month view should have a right date in each cell', async function(assert) {
        const $element = this.instance.$element();

        this.instance.option('currentDate', new Date(2015, 2, 1));
        this.instance.option('firstDayOfWeek', 1);

        const firstDate = new Date(2015, 1, 23);

        $element.find('.dx-scheduler-date-table tr>td').each(function(index, cell) {
            const date = new Date(firstDate);
            date.setDate(firstDate.getDate() + index);
            const $cellText = $(cell).find(`.${CELL_TEXT_CLASS}`);
            assert.equal($cellText.text(), dateLocalization.format(date, 'dd'), 'Cell has a right date');
        });
    });

    QUnit.test('Scheduler workspace month view should have a right date in each cell, groupByDate = true', async function(assert) {
        const $element = this.instance.$element();

        this.instance.option('groupByDate', true);
        await applyWorkspaceGroups(this.instance, [{
            label: 'one',
            fieldExpr: 'one',
            dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }, { id: 3, text: 'c' }]
        }]);
        this.instance.option('currentDate', new Date(2015, 2, 1));
        this.instance.option('firstDayOfWeek', 1);

        const firstDate = new Date(2015, 1, 23);

        $element.find('.dx-scheduler-date-table tr>td').each(function(index, cell) {
            index = Math.floor(index / 3);

            const date = new Date(firstDate);
            date.setDate(firstDate.getDate() + index);
            assert.equal($(cell).text(), dateLocalization.format(date, 'dd'), 'Cell has a right date');
        });
    });

    QUnit.test('Scheduler workspace month view should have a date with current-date class', async function(assert) {
        const $element = this.instance.$element();

        const currentDate = new Date();
        const $cell = $element.find('.dx-scheduler-date-table-current-date');

        this.instance.option('currentDate', currentDate);

        assert.equal(parseInt($cell.text(), 10), currentDate.getDate().toString(), 'Cell text is correct');
    });

    QUnit.test('Scheduler workspace month view should have a dates with other-month class', async function(assert) {
        const $element = this.instance.$element();

        this.instance.option('currentDate', new Date(2015, 2, 1));

        const $cells = $element.find('.dx-scheduler-date-table-other-month');
        assert.equal($cells.length, 11, 'Other-month cells count is correct');
    });

    QUnit.test('Scheduler workspace month view should have a dates with other-month class, if startDate is set', async function(assert) {
        const $element = this.instance.$element();

        this.instance.option('currentDate', new Date(2015, 2, 1));
        this.instance.option('startDate', new Date(2015, 5, 1));

        const $cells = $element.find('.dx-scheduler-date-table-other-month');
        assert.equal($cells.length, 11, 'Other-month cells count is correct');
    });

    QUnit.test('Scheduler workspace month view should have a dates with other-month class, if startDate & intervalCount is set', async function(assert) {
        const $element = this.instance.$element();

        this.instance.option('currentDate', new Date(2015, 2, 1));
        this.instance.option('startDate', new Date(2015, 11, 1));
        this.instance.option('intervalCount', 3);

        const $cells = $element.find('.dx-scheduler-date-table-other-month');
        assert.equal($cells.length, 6, 'Other-month cells count is correct');
    });

    QUnit.test('Scheduler workspace should have a right first day of week', async function(assert) {
        const $element = this.instance.$element();

        const days = dateLocalization.getDayNames('abbreviated');
        let firstCellHeader = $element.find('.dx-scheduler-header-panel thead tr>th').first().text();

        assert.equal(firstCellHeader.toLowerCase(), days[0].toLowerCase(), 'Workspace has a right first day of week by default');

        this.instance.option('firstDayOfWeek', 2);

        firstCellHeader = $element.find('.dx-scheduler-header-panel thead tr>th').first().text();

        assert.equal(firstCellHeader.toLowerCase(), days[this.instance.option('firstDayOfWeek')].toLowerCase(), 'Workspace has a right first day of week when option was changed');
    });

    QUnit.test('WorkSpace Month view has right count of rows with view option intervalCount', async function(assert) {
        this.instance.option('currentDate', new Date(2023, 6, 1));
        this.instance.option('intervalCount', 2);

        let rows = this.instance.$element().find('.dx-scheduler-date-table-row');
        assert.equal(rows.length, 10, 'view has right rows count');

        this.instance.option('intervalCount', 4);

        rows = this.instance.$element().find('.dx-scheduler-date-table-row');
        assert.equal(rows.length, 19, 'view has right rows count');
    });

    QUnit.test('WorkSpace Month view has right count of cells with view option intervalCount', async function(assert) {
        this.instance.option('currentDate', new Date(2023, 6, 1));
        this.instance.option('intervalCount', 2);

        const rows = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(rows.length, 7 * 10, 'view has right cells count');
    });

    QUnit.test('WorkSpace Month view with option intervalCount has cells with special isFirstDayMonthHighlighting class', async function(assert) {
        this.instance.option({
            intervalCount: 2,
            currentDate: new Date(2017, 5, 25)
        });

        const $firstDayOfMonthCells = this.instance.$element().find('.dx-scheduler-date-table-first-of-month');

        assert.equal($firstDayOfMonthCells.length, 3, 'view has right special cells count');

        assert.equal($firstDayOfMonthCells.first().text(), 'Jun 1', 'Cell has a right text');
        assert.equal($firstDayOfMonthCells.last().text(), 'Aug 1', 'Cell has a right text');
    });
});

const monthWithGroupingModuleConfig = {
    beforeEach: async function() {
        const resourceConfig = await getWorkspaceResourceConfig([{
            label: 'a',
            fieldExpr: 'a',
            dataSource: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }]
        }]);
        this.instance = $('#scheduler-work-space-grouped').dxSchedulerWorkSpaceMonth({
            groupOrientation: 'vertical',
            startDayHour: 8,
            showAllDayPanel: false,
            endDayHour: 20,
            ...resourceConfig,
        }).dxSchedulerWorkSpaceMonth('instance');
    }
};

QUnit.module('Workspace Month markup with vertical grouping', monthWithGroupingModuleConfig, () => {
    QUnit.test('Scheduler workspace day should have a right css class', async function(assert) {
        const $element = this.instance.$element();

        assert.ok($element.hasClass('dx-scheduler-work-space-vertical-grouped'), 'Workspace has \'dx-scheduler-work-space-vertical-grouped\' css class');
    });

    QUnit.test('Workspace Month markup should contain three scrollable elements', async function(assert) {
        const $dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable');
        const $sidebarScrollable = this.instance.$element().find('.dx-scheduler-sidebar-scrollable');
        const $headerScrollable = this.instance.$element().find('.dx-scheduler-header-scrollable');

        assert.equal($dateTableScrollable.length, 1, 'Date table scrollable was rendered');
        assert.ok($dateTableScrollable.data('dxScrollable'), 'Date table scrollable is instance of dxScrollable');

        assert.equal($sidebarScrollable.length, 1, 'Time panel scrollable was rendered');
        assert.ok($sidebarScrollable.data('dxScrollable'), 'Time panel scrollable is instance of dxScrollable');

        assert.equal($headerScrollable.length, 1, 'Header scrollable was rendered');
        assert.ok($headerScrollable.data('dxScrollable'), 'Header scrollable is instance of dxScrollable');
    });

    QUnit.test('Date table scrollable should have right config with vertical grouping', async function(assert) {
        const dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');
        const device = devices.current();
        let expectedShowScrollbarOption = 'onHover';

        if(device.phone || device.tablet) {
            expectedShowScrollbarOption = 'onScroll';
        }

        assert.equal(dateTableScrollable.option('direction'), 'both', 'Direction is OK');
        assert.equal(dateTableScrollable.option('showScrollbar'), expectedShowScrollbarOption, 'showScrollbar is OK');
        assert.strictEqual(dateTableScrollable.option('bounceEnabled'), false, 'bounceEnabled is OK');
        assert.strictEqual(dateTableScrollable.option('updateManually'), true, 'updateManually is OK');
    });

    QUnit.test('Sidebar scrollable should contain group table', async function(assert) {
        const $sidebarScrollable = this.instance.$element().find('.dx-scheduler-sidebar-scrollable');

        assert.equal($sidebarScrollable.find('.dx-scheduler-group-header').length, 2, 'Group header cells count is ok');
    });

    QUnit.test('Scheduler workspace month should have correct rows and cells count', async function(assert) {
        const $element = this.instance.$element();
        let cellCounter = 0;

        assert.equal($element.find('.dx-scheduler-date-table tbody tr').length, 12, 'Date table has 12 rows');
        assert.equal($element.find('.dx-scheduler-date-table tbody tr>td').length, 84, 'Date table has 84 cells');

        $element.find('.dx-scheduler-date-table tbody tr').each(function() {
            if($(this).find('td').length === 7) {
                cellCounter++;
            }
        });

        assert.equal(cellCounter, 12, 'Each row has a 7 cells');
    });

    QUnit.test('Grouped cells should have a right group field in cellData', async function(assert) {
        const $element = this.instance.$element();
        const $cells = $element.find('.dx-scheduler-date-table tbody tr>td');
        const cellCount = $cells.length;

        assert.deepEqual(this.instance.getCellData($cells.eq(0)).groups, {
            a: 1
        }, 'Cell group is OK');
        assert.deepEqual(this.instance.getCellData($cells.eq(cellCount / 2)).groups, { a: 2 }, 'Cell group is OK');
    });

    QUnit.test('Scheduler workspace month view should have a dates with other-month class', async function(assert) {
        const $element = this.instance.$element();

        this.instance.option('currentDate', new Date(2015, 2, 1));

        const $cells = $element.find('.dx-scheduler-date-table-other-month');
        assert.equal($cells.length, 22, 'Other-month cells count is correct');
    });

    QUnit.test('Scheduler workspace month view should have a dates text', async function(assert) {
        const $element = this.instance.$element();
        const viewStart = new Date(2018, 1, 25);

        this.instance.option('currentDate', new Date(2018, 2, 1));
        const $cells = $element.find('.dx-scheduler-date-table tbody tr>td');
        const cellsCount = $cells.length;
        const cellCountInGroup = cellsCount / 2;

        $element.find('.dx-scheduler-date-table-cell').each(function(index) {
            let date = new Date(viewStart);
            const cellIndex = index % cellCountInGroup;

            date = dateLocalization.format(new Date(date.setDate(date.getDate() + cellIndex)), 'dd');

            assert.equal($(this).text(), date, 'Time is OK');
        });
    });

    QUnit.test('Date table should have right group header', async function(assert) {
        const $element = this.instance.$element();

        assert.equal($element.find('.' + VERTICAL_GROUP_TABLE_CLASS).length, 1, 'Group header is rendered');
    });

    QUnit.test('Date table should have right group header cells count', async function(assert) {
        const $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-group-header').length, 2, 'Group header cells count is ok');
    });
});

const scrollingModuleConfig = {
    beforeEach: function() {
        this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWeek({
            crossScrollingEnabled: true,
            width: 100,
            getResourceManager: getEmptyResourceManager,
        }).dxSchedulerWorkSpaceWeek('instance');
    }
};

QUnit.module('Workspace with crossScrollingEnabled markup', scrollingModuleConfig, () => {
    QUnit.test('Workspace should have correct class', async function(assert) {
        assert.ok(this.instance.$element().hasClass('dx-scheduler-work-space-both-scrollbar'), 'CSS class is OK');
        this.instance.option('crossScrollingEnabled', false);
        assert.notOk(this.instance.$element().hasClass('dx-scheduler-work-space-both-scrollbar'), 'CSS class is OK');
    });

    QUnit.test('Three scrollable elements should be rendered', async function(assert) {
        const $dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable');
        const $timePanelScrollable = this.instance.$element().find('.dx-scheduler-sidebar-scrollable');
        const $headerScrollable = this.instance.$element().find('.dx-scheduler-header-scrollable');

        assert.equal($dateTableScrollable.length, 1, 'Date table scrollable was rendered');
        assert.ok($dateTableScrollable.data('dxScrollable'), 'Date table scrollable is instance of dxScrollable');

        assert.equal($timePanelScrollable.length, 1, 'Time panel scrollable was rendered');
        assert.ok($timePanelScrollable.data('dxScrollable'), 'Time panel scrollable is instance of dxScrollable');

        assert.equal($headerScrollable.length, 1, 'Header scrollable was rendered');
        assert.ok($headerScrollable.data('dxScrollable'), 'Header scrollable is instance of dxScrollable');
    });

    QUnit.test('Time panel scrollable should contain time panel', async function(assert) {
        const timePanelScrollable = this.instance.$element().find('.dx-scheduler-sidebar-scrollable').dxScrollable('instance');
        const scrollableContent = timePanelScrollable.$content();

        assert.equal(scrollableContent.find('.dx-scheduler-time-panel').length, 1, 'Time panel exists');
    });

    QUnit.test('Header scrollable should have right config', async function(assert) {
        const headerScrollable = this.instance.$element().find('.dx-scheduler-header-scrollable').dxScrollable('instance');

        assert.equal(headerScrollable.option('direction'), 'horizontal', 'Direction is OK');
        assert.strictEqual(headerScrollable.option('showScrollbar'), 'never', 'showScrollbar is OK');
        assert.strictEqual(headerScrollable.option('bounceEnabled'), false, 'bounceEnabled is OK');
        assert.strictEqual(headerScrollable.option('updateManually'), true, 'updateManually is OK');
    });

    QUnit.test('Time panel scrollable should have right config', async function(assert) {
        const timePanelScrollable = this.instance.$element().find('.dx-scheduler-sidebar-scrollable').dxScrollable('instance');

        assert.equal(timePanelScrollable.option('direction'), 'vertical', 'Direction is OK');
        assert.strictEqual(timePanelScrollable.option('showScrollbar'), 'never', 'showScrollbar is OK');
        assert.strictEqual(timePanelScrollable.option('bounceEnabled'), false, 'bounceEnabled is OK');
        assert.strictEqual(timePanelScrollable.option('updateManually'), true, 'updateManually is OK');
    });
});

QUnit.module('FirstGroupCell and LastGroupCell classes', () => {
    const GROUP_COUNT = 2;

    const checkFirstGroupCell = (assert, cell, cellIndex, columnCountInGroup, tableName) => {
        if(cellIndex % columnCountInGroup === 0) {
            assert.ok($(cell).hasClass(FIRST_GROUP_CELL_CLASS), `${tableName} cell has first-group class`);
        } else {
            assert.notOk($(cell).hasClass(FIRST_GROUP_CELL_CLASS), `${tableName} cell does not have first-group class`);
        }
    };
    const checkLastGroupCell = (assert, cell, cellIndex, columnCountInGroup, tableName) => {
        if((cellIndex + 1) % columnCountInGroup === 0) {
            assert.ok($(cell).hasClass(LAST_GROUP_CELL_CLASS), `${tableName} cell has last-group class`);
        } else {
            assert.notOk($(cell).hasClass(LAST_GROUP_CELL_CLASS), `${tableName} cell does not have last-group class`);
        }
    };

    const groupClassesModuleConfig = {
        beforeEach: function() {
            this.createInstance = (workspaceClass, options = {}) => {
                const instance = $('#scheduler-work-space')[workspaceClass]({
                    intervalCount: 3,
                    startDayHour: 0,
                    endDayHour: 2,
                    currentDate: new Date(2020, 8, 27),
                    groupOrientation: 'horizontal',
                    getResourceManager: getEmptyResourceManager,
                    ...options,
                })[workspaceClass]('instance');

                return instance;
            };
        }
    };

    QUnit.module('Group cell classes', groupClassesModuleConfig, () => {
        [{
            view: WORKSPACE_DAY,
            columnCountInGroup: 3,
            rowCountInGroup: 4,
        }, {
            view: WORKSPACE_WEEK,
            columnCountInGroup: 21,
            rowCountInGroup: 4,
        }, {
            view: WORKSPACE_MONTH,
            columnCountInGroup: 7,
            rowCountInGroup: 14,
        }].forEach(({ view, columnCountInGroup, rowCountInGroup }) => {
            QUnit.test(`first-group-cell class should be assigned to correct cells in basic case in ${view.name}`, async function(assert) {
                const instance = this.createInstance(view.class);

                instance.$element().find(`.${CELL_CLASS}`).each(function(index) {
                    checkFirstGroupCell(assert, this, index, columnCountInGroup, 'Date table');
                });

                instance.$element().find(`.${ALL_DAY_TABLE_CELL_CLASS}`).each(function(index) {
                    checkFirstGroupCell(assert, this, index, columnCountInGroup, 'All-day panel');
                });

                instance.$element().find(`.${TIME_PANEL_CELL_CLASS}`).each(function() {
                    assert.notOk($(this).hasClass(FIRST_GROUP_CELL_CLASS), 'Time panel cell does not have first-group class');
                });

                instance.$element().find(`.${HEADER_PANEL_CELL_CLASS}`).each(function(index) {
                    checkFirstGroupCell(assert, this, index, columnCountInGroup, 'Header panel');
                });
            });

            QUnit.test(`first-group-cell class should be assigned to correct cells in ${view.name} when appointments are grouped horizontally`, async function(assert) {
                const instance = this.createInstance(view.class);
                await applyWorkspaceGroups(instance, [{
                    label: 'one',
                    fieldExpr: 'one',
                    dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }],
                }]);

                instance.$element().find(`.${CELL_CLASS}`).each(function(index) {
                    checkFirstGroupCell(assert, this, index, columnCountInGroup, 'Date table');
                });

                instance.$element().find(`.${ALL_DAY_TABLE_CELL_CLASS}`).each(function(index) {
                    checkFirstGroupCell(assert, this, index, columnCountInGroup, 'All-day panel');
                });

                instance.$element().find(`.${TIME_PANEL_CELL_CLASS}`).each(function() {
                    assert.notOk($(this).hasClass(FIRST_GROUP_CELL_CLASS), 'Time panel cell does not have first-group class');
                });

                instance.$element().find(`.${HEADER_PANEL_CELL_CLASS}`).each(function(index) {
                    checkFirstGroupCell(assert, this, index, columnCountInGroup, 'Header panel');
                });
            });

            QUnit.test(`first-group-cell class should be assigned to correct cells in ${view.name} when appointments are grouped by date`, async function(assert) {
                const instance = this.createInstance(view.class, {
                    groupByDate: true,
                });
                await applyWorkspaceGroups(instance, [{
                    label: 'one',
                    fieldExpr: 'one',
                    dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }],
                }]);

                instance.$element().find(`.${CELL_CLASS}`).each(function(index) {
                    checkFirstGroupCell(assert, this, index, GROUP_COUNT, 'Date table');
                });

                instance.$element().find(`.${ALL_DAY_TABLE_CELL_CLASS}`).each(function(index) {
                    checkFirstGroupCell(assert, this, index, GROUP_COUNT, 'All-day panel');
                });

                instance.$element().find(`.${TIME_PANEL_CELL_CLASS}`).each(function() {
                    assert.notOk($(this).hasClass(FIRST_GROUP_CELL_CLASS), 'Time panel cell does not have first-group class');
                });

                instance.$element().find(`.${HEADER_PANEL_CELL_CLASS}`).each(function(index) {
                    assert.ok($(this).hasClass(FIRST_GROUP_CELL_CLASS), 'Header panel cell has first-group class');
                });
            });

            QUnit.test(`first-group-cell class should be assigned to correct cells in ${view.name} when appointments are grouped vertically`, async function(assert) {
                const instance = this.createInstance(view.class, {
                    groupOrientation: 'vertical',
                });
                await applyWorkspaceGroups(instance, [{
                    label: 'one',
                    fieldExpr: 'one',
                    dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }],
                }]);

                instance.$element().find(`.${CELL_CLASS}`).each(function(index) {
                    if(Math.floor(index / columnCountInGroup) % rowCountInGroup === 0) {
                        assert.ok($(this).hasClass(FIRST_GROUP_CELL_CLASS), 'Date table cell has first-group class');
                    } else {
                        assert.notOk($(this).hasClass(FIRST_GROUP_CELL_CLASS), 'Date table cell does not have first-group class');
                    }
                });

                instance.$element().find(`.${ALL_DAY_TABLE_CELL_CLASS}`).each(function() {
                    assert.notOk($(this).hasClass(FIRST_GROUP_CELL_CLASS), 'All-day panel cell does not have first-group class');
                });

                instance.$element().find(`.${TIME_PANEL_CELL_CLASS}`).each(function(index) {
                    if(index % rowCountInGroup === 0) {
                        assert.ok($(this).hasClass(FIRST_GROUP_CELL_CLASS), 'Time panel cell has first-group class');
                    } else {
                        assert.notOk($(this).hasClass(FIRST_GROUP_CELL_CLASS), 'Time panel cell does not have first-group class');
                    }
                });

                instance.$element().find(`.${HEADER_PANEL_CELL_CLASS}`).each(function() {
                    assert.notOk($(this).hasClass(FIRST_GROUP_CELL_CLASS), 'Header panel cell does not have first-group class');
                });
            });

            QUnit.test(`last-group-cell class should be assigned to correct cells in basic case in ${view.name}`, async function(assert) {
                const instance = this.createInstance(view.class);

                instance.$element().find(`.${CELL_CLASS}`).each(function(index) {
                    checkLastGroupCell(assert, this, index, columnCountInGroup, 'Date table');
                });

                instance.$element().find(`.${ALL_DAY_TABLE_CELL_CLASS}`).each(function(index) {
                    checkLastGroupCell(assert, this, index, columnCountInGroup, 'All-day panel');
                });

                instance.$element().find(`.${TIME_PANEL_CELL_CLASS}`).each(function() {
                    assert.notOk($(this).hasClass(LAST_GROUP_CELL_CLASS), 'Time panel cell does not have last-group class');
                });

                instance.$element().find(`.${HEADER_PANEL_CELL_CLASS}`).each(function(index) {
                    checkLastGroupCell(assert, this, index, columnCountInGroup, 'Header panel');
                });
            });

            QUnit.test(`last-group-cell class should be assigned to correct cells in ${view.name} when appointments are grouped horizontally`, async function(assert) {
                const instance = this.createInstance(view.class);
                await applyWorkspaceGroups(instance, [{
                    label: 'one',
                    fieldExpr: 'one',
                    dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                }]);

                instance.$element().find(`.${CELL_CLASS}`).each(function(index) {
                    checkLastGroupCell(assert, this, index, columnCountInGroup, 'Date table');
                });

                instance.$element().find(`.${ALL_DAY_TABLE_CELL_CLASS}`).each(function(index) {
                    checkLastGroupCell(assert, this, index, columnCountInGroup, 'All-day panel');
                });

                instance.$element().find(`.${TIME_PANEL_CELL_CLASS}`).each(function() {
                    assert.notOk($(this).hasClass(LAST_GROUP_CELL_CLASS), 'Time panel cell does not have last-group class');
                });

                instance.$element().find(`.${HEADER_PANEL_CELL_CLASS}`).each(function(index) {
                    checkLastGroupCell(assert, this, index, columnCountInGroup, 'Header panel');
                });
            });

            QUnit.test(`last-group-cell class should be assigned to correct cells in ${view.name} when appointments are grouped by date`, async function(assert) {
                const instance = this.createInstance(view.class, {
                    groupByDate: true,
                });
                await applyWorkspaceGroups(instance, [{
                    label: 'one',
                    fieldExpr: 'one',
                    dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                }]);

                instance.$element().find(`.${CELL_CLASS}`).each(function(index) {
                    checkLastGroupCell(assert, this, index, GROUP_COUNT, 'Date table');
                });

                instance.$element().find(`.${ALL_DAY_TABLE_CELL_CLASS}`).each(function(index) {
                    checkLastGroupCell(assert, this, index, GROUP_COUNT, 'All-day panel');
                });

                instance.$element().find(`.${TIME_PANEL_CELL_CLASS}`).each(function() {
                    assert.notOk($(this).hasClass(LAST_GROUP_CELL_CLASS), 'Time panel cell does not have last-group class');
                });

                instance.$element().find(`.${HEADER_PANEL_CELL_CLASS}`).each(function() {
                    assert.ok($(this).hasClass(LAST_GROUP_CELL_CLASS), 'Header panel cell has last-group class');
                });
            });

            QUnit.test(`last-group-cell class should be assigned to correct cells in ${view.name} when appointments are grouped vertically`, async function(assert) {
                const instance = this.createInstance(view.class, {
                    groupOrientation: 'vertical',
                });
                await applyWorkspaceGroups(instance, [{
                    label: 'one',
                    fieldExpr: 'one',
                    dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                }]);

                instance.$element().find(`.${CELL_CLASS}`).each(function(index) {
                    if((Math.floor(index / columnCountInGroup) + 1) % rowCountInGroup === 0) {
                        assert.ok($(this).hasClass(LAST_GROUP_CELL_CLASS), 'Date table cell has last-group class');
                    } else {
                        assert.notOk($(this).hasClass(LAST_GROUP_CELL_CLASS), 'Date table cell does not have last-group class');
                    }
                });

                instance.$element().find(`.${ALL_DAY_TABLE_CELL_CLASS}`).each(function() {
                    assert.notOk($(this).hasClass(LAST_GROUP_CELL_CLASS), 'All-day panel cell does not have last-group class');
                });

                instance.$element().find(`.${TIME_PANEL_CELL_CLASS}`).each(function(index) {
                    if((index + 1) % rowCountInGroup === 0) {
                        assert.ok($(this).hasClass(LAST_GROUP_CELL_CLASS), 'Time panel cell has last-group class');
                    } else {
                        assert.notOk($(this).hasClass(LAST_GROUP_CELL_CLASS), 'Time panel cell does not have last-group class');
                    }
                });

                instance.$element().find(`.${HEADER_PANEL_CELL_CLASS}`).each(function() {
                    assert.notOk($(this).hasClass(LAST_GROUP_CELL_CLASS), 'Header panel cell does not have last-group class');
                });
            });
        });
    });
});
