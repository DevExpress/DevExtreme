import $ from 'jquery';
import SchedulerTimeline from '__internal/scheduler/workspaces/m_timeline';
import SchedulerTimelineDay from '__internal/scheduler/workspaces/m_timeline_day';
import SchedulerTimelineWeek from '__internal/scheduler/workspaces/m_timeline_week';
import SchedulerTimelineWorkWeek from '__internal/scheduler/workspaces/m_timeline_work_week';
import SchedulerTimelineMonth from '__internal/scheduler/workspaces/m_timeline_month';
import dataUtils from 'core/element_data';
import dateLocalization from 'common/core/localization/date';
import SchedulerWorkSpaceVerticalStrategy from '__internal/scheduler/workspaces/m_work_space_grouped_strategy_vertical';
import SchedulerWorkSpaceHorizontalStrategy from '__internal/scheduler/workspaces/m_work_space_grouped_strategy_horizontal';
import '__internal/scheduler/m_scheduler';

QUnit.testStart(() => {
    const markup =
        '<div id="scheduler-timeline"></div>';

    $('#qunit-fixture').html(markup);
});

const CELL_CLASS = 'dx-scheduler-date-table-cell';
const HEADER_PANEL_CELL_CLASS = 'dx-scheduler-header-panel-cell';
const HEADER_PANEL_WEEK_CELL_CLASS = 'dx-scheduler-header-panel-week-cell';

const FIRST_GROUP_CELL_CLASS = 'dx-scheduler-first-group-cell';
const LAST_GROUP_CELL_CLASS = 'dx-scheduler-last-group-cell';

const TIMELINE_DAY = { class: 'dxSchedulerTimelineDay', name: 'SchedulerTimelineDay' };
const TIMELINE_WEEK = { class: 'dxSchedulerTimelineWeek', name: 'SchedulerTimelineWeek' };
const TIMELINE_MONTH = { class: 'dxSchedulerTimelineMonth', name: 'SchedulerTimelineMonth' };

const toSelector = cssClass => '.' + cssClass;

const checkHeaderCells = function($element, assert, interval, groupCount, viewDuration) {
    interval = interval || 0.5;
    viewDuration = viewDuration || 1;
    groupCount = groupCount || 1;
    const cellCount = 24 / interval;
    const cellDuration = 3600000 * interval;

    assert.equal($element.find('.dx-scheduler-header-panel-cell').length, cellCount * groupCount * viewDuration, 'Time panel has a right count of cells');
    $element.find('.dx-scheduler-header-panel-cell').each(function(index) {
        const time = dateLocalization.format(new Date(new Date(1970, 0).getTime() + cellDuration * index), 'shorttime');
        assert.equal($(this).text(), time, 'Time is OK');
    });
};


const moduleConfig = {
    beforeEach: function() {
        this.instance = $('#scheduler-timeline').dxSchedulerTimelineDay({}).dxSchedulerTimelineDay('instance');
    }
};

QUnit.module('Timeline markup', moduleConfig, () => {
    QUnit.test('Scheduler timeline should be initialized', function(assert) {
        assert.ok(this.instance instanceof SchedulerTimeline, 'dxSchedulerTimeLine was initialized');
    });

    QUnit.test('Scheduler timeline should have right groupedStrategy by default', function(assert) {
        assert.ok(this.instance._groupedStrategy instanceof SchedulerWorkSpaceVerticalStrategy, 'Grouped strategy is right');
    });

    QUnit.test('Two scrollable elements should be rendered', function(assert) {
        const $dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable');
        const $headerScrollable = this.instance.$element().find('.dx-scheduler-header-scrollable');


        assert.equal($dateTableScrollable.length, 1, 'Date table scrollable was rendered');
        assert.ok($dateTableScrollable.dxScrollable('instance'), 'Date table scrollable is instance of dxScrollable');

        assert.equal($headerScrollable.length, 1, 'Header scrollable was rendered');
        assert.ok($headerScrollable.dxScrollable('instance'), 'Header scrollable is instance of dxScrollable');
    });

    QUnit.test('Both scrollable elements should be rendered if crossScrollingEnabled=true', function(assert) {
        this.instance.option('crossScrollingEnabled', true);
        assert.ok(this.instance.$element().hasClass('dx-scheduler-work-space-both-scrollbar'), 'CSS class is OK');
        this.instance.option('crossScrollingEnabled', false);
        assert.notOk(this.instance.$element().hasClass('dx-scheduler-work-space-both-scrollbar'), 'CSS class is OK');
    });

    QUnit.test('Date table scrollable should have right config for crossScrolling', function(assert) {
        this.instance.option('crossScrollingEnabled', true);
        const dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');

        assert.equal(dateTableScrollable.option('direction'), 'both', 'Direction is OK');
    });

    QUnit.test('Sidebar should contain group table in grouped mode', function(assert) {
        const $element = this.instance.$element();

        this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }]);
        const $groupTable = $element.find('.dx-scheduler-sidebar-scrollable .dx-scheduler-group-table');

        assert.equal($groupTable.length, 1, 'Group table is rendered');
    });

    QUnit.test('Header panel should not contain group rows in grouped mode', function(assert) {
        const $element = this.instance.$element();

        this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }]);
        const $groupRows = $element.find('.dx-scheduler-header-panel .dx-scheduler-group-row');

        assert.strictEqual($groupRows.length, 0, 'Header panel does not contain any group row');
    });

    QUnit.test('Group table should contain right rows and cells count', function(assert) {
        const $element = this.instance.$element();

        this.instance.option('groups', [
            { name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] },
            { name: 'two', items: [{ id: 1, text: '1' }, { id: 2, text: '2' }] }
        ]);

        const $groupTable = $element.find('.dx-scheduler-sidebar-scrollable .dx-scheduler-group-table');
        const $groupColumns = $groupTable.find('.dx-scheduler-group-row');
        const $firstColumnCells = $groupColumns.eq(0).find('.dx-scheduler-group-header');
        const $secondColumnCells = $groupColumns.eq(1).find('.dx-scheduler-group-header');

        assert.equal($groupColumns.length, 2, 'Column count is OK');
        assert.equal($firstColumnCells.length, 2, 'Cell count is OK');
        assert.equal($secondColumnCells.length, 4, 'Cell count is OK');
    });

    QUnit.test('Timeline should have correct group-count class depending on group count', function(assert) {
        const $element = this.instance.$element();

        this.instance.option('groups', [
            { name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] },
            { name: 'two', items: [{ id: 1, text: '1' }, { id: 2, text: '2' }] }
        ]);

        assert.ok($element.hasClass('dx-scheduler-group-column-count-two'), 'Correct class');

        this.instance.option('groups', []);

        assert.notOk($element.hasClass('dx-scheduler-group-column-count-two'), 'group-count class was not applied');
    });
});

let timelineDayModuleConfig = {
    beforeEach: function() {
        this.instance = $('#scheduler-timeline').dxSchedulerTimelineDay({}).dxSchedulerTimelineDay('instance');
    }
};

QUnit.module('TimelineDay markup', timelineDayModuleConfig, () => {
    QUnit.test('Scheduler timelineDay should be initialized', function(assert) {
        assert.ok(this.instance instanceof SchedulerTimelineDay, 'dxSchedulerTimeLineDay was initialized');
    });

    QUnit.test('Scheduler timeline day should have a right css class', function(assert) {
        const $element = this.instance.$element();
        assert.ok($element.hasClass('dx-scheduler-timeline'), 'dxSchedulerTimelineDay has \'dx-scheduler-timeline\' css class');
        assert.ok($element.hasClass('dx-scheduler-timeline-day'), 'dxSchedulerTimelineDay has \'dx-scheduler-timeline\' css class');
    });

    QUnit.test('Scheduler timeline day view should have right cell & row count', function(assert) {
        const $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-date-table-row').length, 1, 'Date table has 1 rows');
        assert.equal($element.find('.dx-scheduler-date-table-cell').length, 48, 'Date table has 48 cells');
    });

    QUnit.test('Scheduler timeline day should have correct first view date', function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 9, 21),
            firstDayOfWeek: 1,
            startDayHour: 4
        });

        assert.deepEqual(this.instance.getStartViewDate(), new Date(2015, 9, 21, 4), 'First view date is OK');
    });

    QUnit.test('Each cell of scheduler timeline day should contain correct jQuery dxCellData', function(assert) {
        this.instance.option({
            renovateRender: false,
            currentDate: new Date(2015, 9, 21),
            firstDayOfWeek: 1,
            startDayHour: 5,
            hoursInterval: 1
        });

        const $cells = this.instance.$element().find('.' + CELL_CLASS);

        assert.deepEqual(dataUtils.data($cells.get(0), 'dxCellData'), {
            startDate: new Date(2015, 9, 21, 5),
            endDate: new Date(2015, 9, 21, 6),
            allDay: false,
            groupIndex: 0,
        }, 'data of first cell is correct');

        assert.deepEqual(dataUtils.data($cells.get(5), 'dxCellData'), {
            startDate: new Date(2015, 9, 21, 10),
            endDate: new Date(2015, 9, 21, 11),
            allDay: false,
            groupIndex: 0,
        }, 'data of 5th cell is correct');

        assert.deepEqual(dataUtils.data($cells.get(10), 'dxCellData'), {
            startDate: new Date(2015, 9, 21, 15),
            endDate: new Date(2015, 9, 21, 16),
            allDay: false,
            groupIndex: 0,
        }, 'data of 10th cell is correct');
    });

    QUnit.test('Each cell of grouped scheduler timeline day should contain correct jQuery dxCellData', function(assert) {
        this.instance.option({
            renovateRender: false,
            currentDate: new Date(2015, 9, 21),
            firstDayOfWeek: 1,
            startDayHour: 5,
            hoursInterval: 1,
            groups: [
                { name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] },
                { name: 'two', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }
            ]
        });

        if(this.instance.option('renovateRender')) {
            assert.ok(true, 'This test is not for renovated render');
            return;
        }

        const $cells = this.instance.$element().find('.dx-scheduler-date-table-row').eq(2).find('.' + CELL_CLASS);

        assert.deepEqual(dataUtils.data($cells.get(0), 'dxCellData'), {
            startDate: new Date(2015, 9, 21, 5),
            endDate: new Date(2015, 9, 21, 6),
            allDay: false,
            groups: {
                one: 2,
                two: 1
            },
            groupIndex: 2,
        }, 'data of first cell is correct');

        assert.deepEqual(dataUtils.data($cells.get(5), 'dxCellData'), {
            startDate: new Date(2015, 9, 21, 10),
            endDate: new Date(2015, 9, 21, 11),
            allDay: false,
            groups: {
                one: 2,
                two: 1
            },
            groupIndex: 2,
        }, 'data of 5th cell is correct');

        assert.deepEqual(dataUtils.data($cells.get(10), 'dxCellData'), {
            startDate: new Date(2015, 9, 21, 15),
            endDate: new Date(2015, 9, 21, 16),
            allDay: false,
            groups: {
                one: 2,
                two: 1
            },
            groupIndex: 2,
        }, 'data of 10th cell is correct');
    });

    QUnit.test('Header panel should have right quantity of cells', function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 9, 21, 0, 0)
        });
        checkHeaderCells(this.instance.$element(), assert);
    });

    QUnit.test('Date table should have right quantity of cells', function(assert) {
        const $element = this.instance.$element();

        this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }]);
        const $rows = $element.find('.dx-scheduler-date-table-row');

        assert.equal($rows.length, 2, 'Date table has 2 rows');
        assert.equal($rows.eq(0).find('.dx-scheduler-date-table-cell').length, 48, 'The first group row has 48 cells');
        assert.equal($rows.eq(1).find('.dx-scheduler-date-table-cell').length, 48, 'The second group row has 48 cells');
    });

    QUnit.test('Scheduler timeline day should correctly process startDayHour=0', function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 5, 30),
            startDayHour: 10
        });

        this.instance.option('startDayHour', 0);

        assert.deepEqual(this.instance.getStartViewDate(), new Date(2015, 5, 30, 0), 'First view date is correct');
    });

    QUnit.test('Cell count should depend on start/end day hour & hoursInterval', function(assert) {
        const $element = this.instance.$element();

        this.instance.option({
            currentDate: new Date(2015, 2, 1),
            startDayHour: 8,
            endDayHour: 20,
            hoursInterval: 2.5
        });

        assert.equal($element.find('.dx-scheduler-date-table-cell').length, 5, 'Cell count is OK');
    });
});

timelineDayModuleConfig = {
    beforeEach: function() {
        this.instance = $('#scheduler-timeline').dxSchedulerTimelineDay({
            currentDate: new Date(2015, 9, 16),
        }).dxSchedulerTimelineDay('instance');
    }
};

QUnit.module('TimelineDay with intervalCount markup', timelineDayModuleConfig, () => {
    QUnit.test('TimelineDay has right intervalCount of cells with view option intervalCount', function(assert) {
        this.instance.option('intervalCount', 2);

        let cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 2, 'view has right cell count');

        this.instance.option('intervalCount', 4);

        cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 4, 'view has right cell count');
    });

    QUnit.test('TimelineDay Day view cells have right cellData with view option intervalCount=2', function(assert) {
        this.instance.option('renovateRender', false);

        this.instance.option('intervalCount', 2);
        this.instance.option('currentDate', new Date(2017, 5, 29));

        const firstCellData = dataUtils.data(this.instance.$element().find('.dx-scheduler-date-table-cell').get(0), 'dxCellData');
        const secondCellData = dataUtils.data(this.instance.$element().find('.dx-scheduler-date-table-cell').get(95), 'dxCellData');

        assert.deepEqual(firstCellData.startDate, new Date(2017, 5, 29, 0), 'cell has right startDate');
        assert.deepEqual(firstCellData.endDate, new Date(2017, 5, 29, 0, 30), 'cell has right endtDate');

        assert.deepEqual(secondCellData.startDate, new Date(2017, 5, 30, 23, 30), 'cell has right startDate');
        assert.deepEqual(secondCellData.endDate, new Date(2017, 5, 31, 0), 'cell has right endtDate');
    });

    QUnit.test('Get date range', function(assert) {
        this.instance.option('currentDate', new Date(2015, 2, 16));
        this.instance.option('intervalCount', 2);

        assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 16, 0, 0), new Date(2015, 2, 17, 23, 59)], 'Range is OK');

        this.instance.option('intervalCount', 4);
        assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 16, 0, 0), new Date(2015, 2, 19, 23, 59)], 'Range is OK');
    });

    QUnit.test('Scheduler timeline day header cells should have right class', function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 9, 29),
            intervalCount: 2
        });
        const $element = this.instance.$element();
        const $firstRow = $element.find('.dx-scheduler-header-row').first();

        assert.equal($firstRow.find('.dx-scheduler-header-panel-week-cell').length, 2, 'First row cells count and class is ok');
    });

    QUnit.test('Scheduler timeline day should contain two rows in header panel, if intervalCount is set', function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 9, 29),
            firstDayOfWeek: 1,
            startDayHour: 4,
            endDayHour: 5,
            intervalCount: 1
        });

        assert.equal(this.instance.$element().find('.dx-scheduler-header-row').length, 1, 'There is 1 row in header panel');

        this.instance.option('intervalCount', 2);

        const $rows = this.instance.$element().find('.dx-scheduler-header-row');
        const $firstRowCells = $rows.first().find('.dx-scheduler-header-panel-cell');
        const startDate = 29;

        assert.equal($rows.length, 2, 'There are 2 rows in header panel');

        for(let i = 0; i < 2; i++) {
            const $cell = $firstRowCells.eq(i);
            assert.equal($cell.text(), formatWeekdayAndDay(new Date(2015, 9, startDate + i)), 'Cell text is OK');
            assert.equal($cell.attr('colspan'), 2, 'Cell colspan is OK');
        }
    });
});

timelineDayModuleConfig = {
    beforeEach: function() {
        this.instance = $('#scheduler-timeline').dxSchedulerTimelineDay({
            groupOrientation: 'horizontal',
            groups: [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }],
        }).dxSchedulerTimelineDay('instance');
    }
};

QUnit.module('TimelineDay with horizontal grouping markup', timelineDayModuleConfig, () => {
    QUnit.test('Scheduler timeline day should have right groupedStrategy, groupOrientation = horizontal', function(assert) {
        assert.ok(this.instance._groupedStrategy instanceof SchedulerWorkSpaceHorizontalStrategy, 'Grouped strategy is right');
    });

    QUnit.test('Scheduler timeline day should have a right css class, groupOrientation = horizontal', function(assert) {
        const $element = this.instance.$element();
        assert.ok($element.hasClass('dx-scheduler-work-space-horizontal-grouped'), 'dxSchedulerTimelineDay has \'dx-scheduler-work-space-horizontal-grouped\' css class');
    });

    QUnit.test('Scheduler timeline day view should have right cell & row count, groupOrientation = horizontal', function(assert) {
        const $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-date-table-row').length, 1, 'Date table has 1 rows');
        assert.equal($element.find('.dx-scheduler-date-table-cell').length, 96, 'Date table has 96 cells');
    });

    QUnit.test('Each cell of scheduler timeline day should contain correct jQuery dxCellData, groupOrientation = horizontal', function(assert) {
        this.instance.option('renovateRender', false);

        this.instance.option({
            currentDate: new Date(2015, 9, 21),
            firstDayOfWeek: 1,
            startDayHour: 5,
            endDayHour: 8,
            hoursInterval: 1
        });

        const $cells = this.instance.$element().find('.' + CELL_CLASS);

        assert.deepEqual(dataUtils.data($cells.get(0), 'dxCellData'), {
            startDate: new Date(2015, 9, 21, 5),
            endDate: new Date(2015, 9, 21, 6),
            allDay: false,
            groups: {
                one: 1
            },
            groupIndex: 0,
        }, 'data of first cell is correct');

        assert.deepEqual(dataUtils.data($cells.get(5), 'dxCellData'), {
            startDate: new Date(2015, 9, 21, 7),
            endDate: new Date(2015, 9, 21, 8),
            allDay: false,
            groups: {
                one: 2
            },
            groupIndex: 1,
        }, 'data of 5th cell is correct');
    });

    QUnit.test('Header panel should have right quantity of cells, groupOrientation = horizontal', function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 9, 21, 0, 0)
        });
        checkHeaderCells(this.instance.$element(), assert, 0.5, 2);
    });

    QUnit.test('Date table should have right quantity of cells, groupOrientation = horizontal', function(assert) {
        const $element = this.instance.$element();

        const $rows = $element.find('.dx-scheduler-date-table-row');

        assert.equal($rows.length, 1, 'Date table has 1 row');
        assert.equal($rows.eq(0).find('.dx-scheduler-date-table-cell').length, 48 * 2, 'The first group row has 96 cells');
    });

    QUnit.test('Group table should contain right rows and cells count, groupOrientation = horizontal', function(assert) {
        const $element = this.instance.$element();

        const $groupRows = $element.find('.dx-scheduler-group-row');
        const $firstRowCells = $groupRows.eq(0).find('.dx-scheduler-group-header');

        assert.equal($groupRows.length, 1, 'Row count is OK');
        assert.equal($firstRowCells.length, 2, 'Cell count is OK');
    });

    QUnit.test('Last group cell should have right class', function(assert) {
        const $element = this.instance.$element();

        assert.ok($element.find('.dx-scheduler-date-table-cell').eq(47).hasClass('dx-scheduler-last-group-cell'), 'cell has correct class');
    });

    QUnit.test('TimelineDay shoud render date cells correctly', function(assert) {
        this.instance.option('currentDate', new Date(2020, 10, 24));
        this.instance.option('intervalCount', 2);

        const $element = this.instance.$element();
        const $firstRow = $element.find('.dx-scheduler-header-row').first();
        const $headerCells = $firstRow.find('.dx-scheduler-header-panel-cell');

        assert.equal($headerCells.length, 4, 'Header row has 4 cells');
        assert.equal($headerCells.eq(0).text(), 'Tue 24', 'First header cell text is correct');
        assert.equal($headerCells.eq(1).text(), 'Wed 25', 'Second header cell text is correct');
        assert.equal($headerCells.eq(2).text(), 'Tue 24', 'Third header cell text is correct');
        assert.equal($headerCells.eq(3).text(), 'Wed 25', 'Fourth header cell text is correct');
    });
});

let timelineWeekModuleConfig = {
    beforeEach: function() {
        this.instance = $('#scheduler-timeline').dxSchedulerTimelineWeek({}).dxSchedulerTimelineWeek('instance');
    }
};

const formatWeekdayAndDay = function(date) {
    return dateLocalization.getDayNames('abbreviated')[date.getDay()] + ' ' + dateLocalization.format(date, 'day');
};

QUnit.module('TimelineWeek markup', timelineWeekModuleConfig, () => {
    QUnit.test('Scheduler timeline week should be initialized', function(assert) {
        assert.ok(this.instance instanceof SchedulerTimelineWeek, 'dxSchedulerTimeLineWeek was initialized');
    });

    QUnit.test('Scheduler timeline week should have a right css class', function(assert) {
        const $element = this.instance.$element();
        assert.ok($element.hasClass('dx-scheduler-timeline'), 'dxSchedulerTimelineWeek has \'dx-scheduler-timeline\' css class');
        assert.ok($element.hasClass('dx-scheduler-timeline-week'), 'dxSchedulerTimelineWeek has \'dx-scheduler-timeline\' css class');
    });

    QUnit.test('Scheduler timeline week view should have right cell & row count', function(assert) {
        const $element = this.instance.$element();


        assert.equal($element.find('.dx-scheduler-date-table-row').length, 1, 'Date table has 1 rows');
        assert.equal($element.find('.dx-scheduler-date-table-cell').length, 336, 'Date table has 336 cells');
    });

    QUnit.test('Scheduler timeline week view should have right cell & row count is startDayHour and endDayHour are defined', function(assert) {
        this.instance.option({
            startDayHour: 9,
            endDayHour: 10,
            currentDate: new Date(2015, 9, 29),
            groups: [
                { name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }
            ]
        });
        const $element = this.instance.$element();
        const $lastRow = $element.find('.dx-scheduler-header-row').last();


        assert.equal($element.find('.dx-scheduler-date-table-row').length, 2, 'Date table has 1 rows');
        assert.equal($element.find('.dx-scheduler-date-table-cell').length, 28, 'Date table has 28 cells');
        assert.equal($lastRow.find('.dx-scheduler-header-panel-cell').length, 14, 'Header row has 14 cells');

        assert.equal($lastRow.find('.dx-scheduler-header-panel-cell').eq(2).text(), dateLocalization.format(new Date(2015, 9, 29, 9), 'shorttime'));
    });

    QUnit.test('Scheduler timeline week header cells should have right class', function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 9, 29)
        });
        const $element = this.instance.$element();
        const $firstRow = $element.find('.dx-scheduler-header-row').first();

        assert.equal($firstRow.find('.dx-scheduler-header-panel-week-cell').length, 7, 'First row cells count and class is ok');
    });

    QUnit.test('Scheduler timeline week should have correct first view date', function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 9, 21),
            firstDayOfWeek: 1,
            startDayHour: 4
        });

        assert.deepEqual(this.instance.getStartViewDate(), new Date(2015, 9, 19, 4), 'First view date is OK');
    });

    QUnit.test('Scheduler timeline week should contain two rows in header panel', function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 9, 29),
            firstDayOfWeek: 1,
            startDayHour: 4,
            endDayHour: 5
        });

        const $rows = this.instance.$element().find('.dx-scheduler-header-row');
        const $firstRowCells = $rows.first().find('.dx-scheduler-header-panel-cell');
        const startDate = 26;

        assert.equal($rows.length, 2, 'There are 2 rows in header panel');

        for(let i = 0; i < 7; i++) {
            const $cell = $firstRowCells.eq(i);
            assert.equal($cell.text(), formatWeekdayAndDay(new Date(2015, 9, startDate + i)), 'Cell text is OK');
            assert.equal($cell.attr('colspan'), 2, 'Cell colspan is OK');
        }
    });

    QUnit.test('Cell count should depend on start/end day hour & hoursInterval', function(assert) {
        const $element = this.instance.$element();

        this.instance.option({
            currentDate: new Date(2015, 2, 1),
            firstDayOfWeek: 0,
            startDayHour: 5,
            endDayHour: 10,
            hoursInterval: 0.75
        });

        assert.equal($element.find('.dx-scheduler-date-table-cell').length, 49, 'Cell count is OK');
    });
});

timelineWeekModuleConfig = {
    beforeEach: function() {
        this.instance = $('#scheduler-timeline').dxSchedulerTimelineWeek({
            currentDate: new Date(2015, 9, 16),
        }).dxSchedulerTimelineWeek('instance');
    }
};

QUnit.module('TimelineWeek with intervalCount markup', timelineWeekModuleConfig, () => {
    QUnit.test('TimelineWeek has right count of cells with view option intervalCount', function(assert) {
        this.instance.option('intervalCount', 2);

        let cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 7 * 2, 'view has right cell count');

        this.instance.option('intervalCount', 4);

        cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 7 * 4, 'view has right cell count');
    });

    QUnit.test('TimelineWeek view cells have right cellData with view option intervalCount=2', function(assert) {
        this.instance.option('renovateRender', false);

        this.instance.option('intervalCount', 2);
        this.instance.option('currentDate', new Date(2017, 5, 29));

        const firstCellData = dataUtils.data(this.instance.$element().find('.dx-scheduler-date-table-cell').get(7 * 48), 'dxCellData');
        const secondCellData = dataUtils.data(this.instance.$element().find('.dx-scheduler-date-table-cell').get(2 * 7 * 48 - 1), 'dxCellData');

        assert.deepEqual(firstCellData.startDate, new Date(2017, 6, 2, 0), 'cell has right startDate');
        assert.deepEqual(firstCellData.endDate, new Date(2017, 6, 2, 0, 30), 'cell has right endtDate');

        assert.deepEqual(secondCellData.startDate, new Date(2017, 6, 8, 23, 30), 'cell has right startDate');
        assert.deepEqual(secondCellData.endDate, new Date(2017, 6, 9, 0), 'cell has right endtDate');
    });

    QUnit.test('Get date range', function(assert) {
        this.instance.option('currentDate', new Date(2017, 5, 26));
        this.instance.option('intervalCount', 2);
        this.instance.option('firstDayOfWeek', 1);

        assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 26, 0, 0), new Date(2017, 6, 9, 23, 59)], 'Range is OK');

        this.instance.option('intervalCount', 4);
        assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 26, 0, 0), new Date(2017, 6, 23, 23, 59)], 'Range is OK');
    });

    QUnit.test('TimelineWeek view should contain right header if intervalCount=3', function(assert) {
        this.instance.option('currentDate', new Date(2017, 5, 26));
        this.instance.option('intervalCount', 3);

        const $element = this.instance.$element();
        const $firstRow = $element.find('.dx-scheduler-header-row').first();

        assert.equal($firstRow.find('.dx-scheduler-header-panel-cell').length, 21, 'Header row has 21 cells');
    });
});

timelineWeekModuleConfig = {
    beforeEach: function() {
        this.instance = $('#scheduler-timeline').dxSchedulerTimelineWeek({
            groupOrientation: 'horizontal',
            groups: [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }],
        }).dxSchedulerTimelineWeek('instance');
    }
};

QUnit.module('TimelineWeek with horizontal grouping markup', timelineWeekModuleConfig, () => {
    QUnit.test('Scheduler timeline day view should have right cell & row count, groupOrientation = horizontal', function(assert) {
        const $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-date-table-row').length, 1, 'Date table has 1 rows');
        assert.equal($element.find('.dx-scheduler-date-table-cell').length, 336 * 2, 'Date table has 672 cells');
    });

    QUnit.test('Each cell of scheduler timeline week should contain correct jQuery dxCellData, groupOrientation = horizontal', function(assert) {
        this.instance.option('renovateRender', false);

        this.instance.option({
            currentDate: new Date(2015, 9, 21),
            firstDayOfWeek: 1,
            startDayHour: 5,
            endDayHour: 8,
            hoursInterval: 1
        });

        const $cells = this.instance.$element().find('.' + CELL_CLASS);

        assert.deepEqual(dataUtils.data($cells.get(0), 'dxCellData'), {
            startDate: new Date(2015, 9, 19, 5),
            endDate: new Date(2015, 9, 19, 6),
            allDay: false,
            groups: {
                one: 1
            },
            groupIndex: 0,
        }, 'data of first cell is correct');

        assert.deepEqual(dataUtils.data($cells.get(25), 'dxCellData'), {
            startDate: new Date(2015, 9, 20, 6),
            endDate: new Date(2015, 9, 20, 7),
            allDay: false,
            groups: {
                one: 2
            },
            groupIndex: 1,
        }, 'data of 25th cell is correct');
    });

    QUnit.test('Group table should contain right rows and cells count, groupOrientation = horizontal', function(assert) {
        const $element = this.instance.$element();

        const $groupRows = $element.find('.dx-scheduler-group-row');
        const $firstRowCells = $groupRows.eq(0).find('.dx-scheduler-group-header');

        assert.equal($groupRows.length, 1, 'Row count is OK');
        assert.equal($firstRowCells.length, 2, 'Cell count is OK');
    });

    QUnit.test('TimelineWeek shoud render date cells correctly', function(assert) {
        this.instance.option('currentDate', new Date(2020, 10, 24));

        const $element = this.instance.$element();
        const $firstRow = $element.find('.dx-scheduler-header-row').first();
        const $headerCells = $firstRow.find('.dx-scheduler-header-panel-cell');

        assert.equal($headerCells.length, 14, 'Header row has 14 cells');
        assert.equal($headerCells.eq(0).text(), 'Sun 22', 'First header cell text is correct');
        assert.equal($headerCells.eq(6).text(), 'Sat 28', 'Second header cell text is correct');
        assert.equal($headerCells.eq(7).text(), 'Sun 22', 'Third header cell text is correct');
        assert.equal($headerCells.eq(13).text(), 'Sat 28', 'Fourth header cell text is correct');
    });
});

let timelineWorkWeekModuleConfig = {
    beforeEach: function() {
        this.instance = $('#scheduler-timeline').dxSchedulerTimelineWorkWeek({}).dxSchedulerTimelineWorkWeek('instance');
    }
};

QUnit.module('TimelineWorkWeek markup', timelineWorkWeekModuleConfig, () => {
    QUnit.test('Scheduler timeline work week should be initialized', function(assert) {
        assert.ok(this.instance instanceof SchedulerTimelineWorkWeek, 'dxSchedulerTimeLineWorkWeek was initialized');
    });

    QUnit.test('Scheduler timeline work week should have a right css class', function(assert) {
        const $element = this.instance.$element();
        assert.ok($element.hasClass('dx-scheduler-timeline'), 'dxSchedulerTimelineWorkWeek has \'dx-scheduler-timeline\' css class');
        assert.ok($element.hasClass('dx-scheduler-timeline-work-week'), 'dxSchedulerTimelineWorkWeek has \'dx-scheduler-timeline-work-week\' css class');
    });

    QUnit.test('Scheduler timeline work week view should have right cell & row count', function(assert) {
        const $element = this.instance.$element();
        assert.equal($element.find('.dx-scheduler-date-table-row').length, 1, 'Date table has 1 rows');
        assert.equal($element.find('.dx-scheduler-date-table-cell').length, 240, 'Date table has 240 cells');
    });

    QUnit.test('Scheduler timeline work week should have correct first view date', function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 9, 21),
            firstDayOfWeek: 1,
            startDayHour: 4
        });

        assert.deepEqual(this.instance.getStartViewDate(), new Date(2015, 9, 19, 4), 'First view date is OK');
    });

    QUnit.test('Scheduler timeline workweek should contain two rows in header panel', function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 9, 29),
            firstDayOfWeek: 1,
            startDayHour: 4,
            endDayHour: 5
        });

        const $rows = this.instance.$element().find('.dx-scheduler-header-row');
        const $firstRowCells = $rows.first().find('th');
        const startDate = 26;

        assert.equal($rows.length, 2, 'There are 2 rows in header panel');

        for(let i = 0; i < 5; i++) {
            const $cell = $firstRowCells.eq(i);
            assert.equal($cell.text(), formatWeekdayAndDay(new Date(2015, 9, startDate + i)), 'Cell text is OK');
            assert.equal($cell.attr('colspan'), 2, 'Cell colspan is OK');
        }
    });

    QUnit.test('Scheduler timeline workweek view should be correct, if currentDate is Monday, but firstDayOfWeek = 0', function(assert) {
        const $element = this.instance.$element();

        this.instance.option('firstDayOfWeek', 0);
        this.instance.option('currentDate', new Date(2015, 4, 25));

        const $headerCells = $element.find('.dx-scheduler-header-row th');

        assert.equal($headerCells.first().text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[1].toLowerCase() + ' 25', 'first header has a right text');
        assert.equal($headerCells.eq(2).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[3].toLowerCase() + ' 27', '3 header has a right text');
        assert.equal($headerCells.eq(4).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[5].toLowerCase() + ' 29', 'last header has a right text');
    });
});

timelineWorkWeekModuleConfig = {
    beforeEach: function() {
        this.instance = $('#scheduler-timeline').dxSchedulerTimelineWorkWeek({
            currentDate: new Date(2015, 9, 16),
        }).dxSchedulerTimelineWorkWeek('instance');
    }
};

QUnit.module('TimelineWorkWeek with intervalCount markup', timelineWorkWeekModuleConfig, () => {
    QUnit.test('TimelineWorkWeek has right count of cells with view option intervalCount', function(assert) {
        this.instance.option('intervalCount', 2);

        let cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 5 * 2, 'view has right cell count');

        this.instance.option('intervalCount', 4);

        cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 5 * 4, 'view has right cell count');
    });

    QUnit.test('TimelineWorkWeek view cells have right cellData with view option intervalCount=2', function(assert) {
        this.instance.option('renovateRender', false);

        this.instance.option('intervalCount', 2);
        this.instance.option('currentDate', new Date(2017, 5, 29));

        const firstCellData = dataUtils.data(this.instance.$element().find('.dx-scheduler-date-table-cell').get(5 * 48), 'dxCellData');
        const secondCellData = dataUtils.data(this.instance.$element().find('.dx-scheduler-date-table-cell').get(2 * 5 * 48 - 1), 'dxCellData');

        assert.deepEqual(firstCellData.startDate, new Date(2017, 6, 3, 0), 'cell has right startDate');
        assert.deepEqual(firstCellData.endDate, new Date(2017, 6, 3, 0, 30), 'cell has right endtDate');

        assert.deepEqual(secondCellData.startDate, new Date(2017, 6, 7, 23, 30), 'cell has right startDate');
        assert.deepEqual(secondCellData.endDate, new Date(2017, 6, 8, 0), 'cell has right endtDate');
    });

    QUnit.test('Get date range', function(assert) {
        this.instance.option('currentDate', new Date(2017, 5, 26));
        this.instance.option('intervalCount', 2);
        this.instance.option('firstDayOfWeek', 1);

        assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 26, 0, 0), new Date(2017, 6, 7, 23, 59)], 'Range is OK');

        this.instance.option('intervalCount', 4);
        assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 26, 0, 0), new Date(2017, 6, 21, 23, 59)], 'Range is OK');
    });

    QUnit.test('TimelineWorkWeek view should contain right header if intervalCount=3', function(assert) {
        this.instance.option('currentDate', new Date(2017, 5, 26));
        this.instance.option('intervalCount', 3);

        const $element = this.instance.$element();
        const $firstRow = $element.find('.dx-scheduler-header-row').first();
        const $headerCells = $firstRow.find('.dx-scheduler-header-panel-cell');

        assert.equal($headerCells.length, 15, 'Header row has 15 cells');
        assert.equal($headerCells.eq(0).text(), 'Mon 26', 'Header cell text is correct');
        assert.equal($headerCells.eq(5).text(), 'Mon 3', 'Header cell text is correct');
        assert.equal($headerCells.eq(14).text(), 'Fri 14', 'Header cell text is correct');
    });
});

let timelineMonthModuleConfig = {
    beforeEach: function() {
        this.instance = $('#scheduler-timeline').dxSchedulerTimelineMonth({
            currentDate: new Date(2015, 9, 16),
        }).dxSchedulerTimelineMonth('instance');
    }
};

QUnit.module('TimelineMonth markup', timelineMonthModuleConfig, () => {
    QUnit.test('Scheduler timeline month should be initialized', function(assert) {
        assert.ok(this.instance instanceof SchedulerTimelineMonth, 'dxSchedulerTimeLineMonth was initialized');
    });

    QUnit.test('Scheduler timeline month should have a right css class', function(assert) {
        const $element = this.instance.$element();
        assert.ok($element.hasClass('dx-scheduler-timeline'), 'dxSchedulerTimelineMonth has \'dx-scheduler-timeline\' css class');
        assert.ok($element.hasClass('dx-scheduler-timeline-month'), 'dxSchedulerTimelineMonth has \'dx-scheduler-timeline\' css class');
    });

    QUnit.test('Scheduler timeline month view should have right cell & row count', function(assert) {
        const $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-date-table-row').length, 1, 'Date table has 1 rows');
        assert.equal($element.find('.dx-scheduler-date-table-cell').length, 31, 'Date table has 240 cells');
    });

    QUnit.test('Scheduler timeline month header panel should have right quantity of cells', function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 8, 21)
        });
        const $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-header-panel-cell').length, 30, 'Time panel has a right count of cells');
        $element.find('.dx-scheduler-header-panel-cell').each(function(index) {
            const header = formatWeekdayAndDay(new Date(new Date(2015, 8, 1).getTime() + 3600000 * 24 * index));
            assert.equal($(this).text(), header, 'Header text is OK');
        });
    });

    QUnit.test('Scheduler timeline month should have correct first view date', function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 9, 21),
            firstDayOfWeek: 1,
            startDayHour: 4
        });

        assert.deepEqual(this.instance.getStartViewDate(), new Date(2015, 9, 1, 4), 'First view date is OK');

        this.instance.option({
            startDayHour: 0
        });

        assert.deepEqual(this.instance.getStartViewDate(), new Date(2015, 9, 1, 0), 'First view date is OK after startDayHour option changed');
    });

    QUnit.test('Each cell of scheduler timeline month should contain correct jQuery dxCellData', function(assert) {
        this.instance.option('renovateRender', false);

        this.instance.option({
            currentDate: new Date(2015, 3, 1),
            startDayHour: 1,
            endDayHour: 10,
            firstDayOfWeek: 1
        });

        const $cells = this.instance.$element().find('.' + CELL_CLASS);

        $cells.each(function(index) {
            assert.deepEqual(dataUtils.data($(this)[0], 'dxCellData'), {
                startDate: new Date(2015, 3, 1 + index, 1),
                endDate: new Date(2015, 3, 1 + index, 10),
                allDay: false,
                groupIndex: 0,
            }, 'cell\'s data is correct');
        });
    });

    QUnit.test('Cells should have right date', function(assert) {
        this.instance.option('renovateRender', false);

        this.instance.option({
            currentDate: new Date(2016, 3, 21),
            firstDayOfWeek: 1,
            hoursInterval: 1,
            startDayHour: 8,
            endDayHour: 20
        });

        const $cells = this.instance.$element().find('.' + CELL_CLASS);
        assert.deepEqual(dataUtils.data($cells.get(25), 'dxCellData').startDate, new Date(2016, 3, 26, 8), 'Date is OK');
    });
});

timelineMonthModuleConfig = {
    beforeEach: function() {
        this.instance = $('#scheduler-timeline').dxSchedulerTimelineMonth({
            currentDate: new Date(2015, 9, 16),
        }).dxSchedulerTimelineMonth('instance');
    }
};

QUnit.module('TimelineMonth with intervalCount', timelineMonthModuleConfig, () => {
    QUnit.test('TimelineMonth has right count of cells with view option intervalCount', function(assert) {
        this.instance.option('intervalCount', 2);

        let cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, 61, 'view has right cell count');

        this.instance.option('intervalCount', 4);

        cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, 123, 'view has right cell count');
    });

    QUnit.test('TimelineMonth view cells have right cellData with view option intervalCount=2', function(assert) {
        this.instance.option('renovateRender', false);

        this.instance.option('intervalCount', 2);
        this.instance.option('currentDate', new Date(2017, 5, 29));

        const firstCellData = dataUtils.data(this.instance.$element().find('.dx-scheduler-date-table-cell').get(0), 'dxCellData');
        const secondCellData = dataUtils.data(this.instance.$element().find('.dx-scheduler-date-table-cell').last().get(0), 'dxCellData');

        assert.deepEqual(firstCellData.startDate, new Date(2017, 5, 1, 0), 'cell has right startDate');
        assert.deepEqual(firstCellData.endDate, new Date(2017, 5, 2, 0), 'cell has right endtDate');

        assert.deepEqual(secondCellData.startDate, new Date(2017, 6, 31, 0), 'cell has right startDate');
        assert.deepEqual(secondCellData.endDate, new Date(2017, 7, 1, 0), 'cell has right endtDate');
    });

    QUnit.test('Get date range', function(assert) {
        this.instance.option('currentDate', new Date(2017, 5, 26));
        this.instance.option('intervalCount', 2);
        this.instance.option('firstDayOfWeek', 1);

        assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 1), new Date(2017, 6, 31, 23, 59)], 'Range is OK');

        this.instance.option('intervalCount', 4);
        assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 1), new Date(2017, 8, 30, 23, 59)], 'Range is OK');
    });
});

timelineMonthModuleConfig = {
    beforeEach: function() {
        this.instance = $('#scheduler-timeline').dxSchedulerTimelineMonth({
            groupOrientation: 'horizontal',
            currentDate: new Date(2018, 3, 2),
            groups: [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }],
        }).dxSchedulerTimelineMonth('instance');
    }
};

QUnit.module('TimelineMonth with horizontal scrolling markup', timelineMonthModuleConfig, () => {
    QUnit.test('Scheduler timeline month view should have right cell & row count', function(assert) {
        const $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-date-table-row').length, 1, 'Date table has 1 rows');
        assert.equal($element.find('.dx-scheduler-date-table-cell').length, 60, 'Date table has 60 cells');
    });

    QUnit.test('Scheduler timeline month header panel should have right quantity of cells', function(assert) {
        this.instance.option({
            currentDate: new Date(2015, 8, 21)
        });
        const $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-header-panel-cell').length, 60, 'Time panel has a right count of cells');
        $element.find('.dx-scheduler-header-panel-cell').each(function(index) {
            const dateIndex = index % 30;
            const header = formatWeekdayAndDay(new Date(new Date(2015, 8, 1).getTime() + 3600000 * 24 * dateIndex));
            assert.equal($(this).text(), header, 'Header text is OK');
        });
    });

    QUnit.test('Each cell of scheduler timeline month should contain correct jQuery dxCellData', function(assert) {
        this.instance.option('renovateRender', false);

        this.instance.option({
            currentDate: new Date(2015, 3, 1),
            startDayHour: 1,
            endDayHour: 10,
            firstDayOfWeek: 1
        });

        const $cells = this.instance.$element().find('.' + CELL_CLASS);

        $cells.each(function(index) {
            const dateIndex = index % 30;
            const groupIndex = index < 30 ? 1 : 2;

            assert.deepEqual(dataUtils.data($(this)[0], 'dxCellData'), {
                startDate: new Date(2015, 3, 1 + dateIndex, 1),
                endDate: new Date(2015, 3, 1 + dateIndex, 10),
                allDay: false,
                groups: {
                    one: groupIndex
                },
                groupIndex: groupIndex - 1,
            }, 'cell\'s data is correct');
        });
    });

    QUnit.test('Cells should have right date', function(assert) {
        this.instance.option('renovateRender', false);

        this.instance.option({
            currentDate: new Date(2016, 3, 21),
            firstDayOfWeek: 1,
            hoursInterval: 1,
            startDayHour: 8,
            endDayHour: 20
        });

        const $cells = this.instance.$element().find('.' + CELL_CLASS);
        assert.deepEqual(dataUtils.data($cells.get(25), 'dxCellData').startDate, new Date(2016, 3, 26, 8), 'Date is OK');
        assert.deepEqual(dataUtils.data($cells.get(55), 'dxCellData').startDate, new Date(2016, 3, 26, 8), 'Date is OK');
    });

    QUnit.test('TimelineMonth shoud render date cells correctly', function(assert) {
        this.instance.option('currentDate', new Date(2020, 11, 1));

        const $element = this.instance.$element();
        const $firstRow = $element.find('.dx-scheduler-header-row').first();
        const $headerCells = $firstRow.find('.dx-scheduler-header-panel-cell');

        assert.equal($headerCells.length, 62, 'Header row has 62 cells');
        assert.equal($headerCells.eq(0).text(), 'Tue 1', 'First header cell text is correct');
        assert.equal($headerCells.eq(30).text(), 'Thu 31', 'Second header cell text is correct');
        assert.equal($headerCells.eq(31).text(), 'Tue 1', 'Third header cell text is correct');
        assert.equal($headerCells.eq(61).text(), 'Thu 31', 'Fourth header cell text is correct');
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

    [true, false].forEach((isRenovatedRender) => {
        const moduleName = isRenovatedRender
            ? 'Renovated Render'
            : 'Non-Renovated Render';

        const groupClassesModuleConfig = {
            beforeEach: function() {
                this.createInstance = (workspaceClass, options = {}) => {
                    const instance = $('#scheduler-timeline')[workspaceClass]({
                        renovateRender: isRenovatedRender,
                        startDayHour: 12,
                        endDayHour: 14,
                        currentDate: new Date(2020, 8, 27),
                        groupOrientation: 'horizontal',
                        intervalCount: 2,
                        ...options,
                    })[workspaceClass]('instance');

                    return instance;
                };
            }
        };

        QUnit.module(moduleName, groupClassesModuleConfig, () => {
            [{
                view: TIMELINE_DAY,
                columnCountInGroup: 8,
                rowCountInGroup: 1,
            }, {
                view: TIMELINE_WEEK,
                columnCountInGroup: 56,
                rowCountInGroup: 1,
            }, {
                view: TIMELINE_MONTH,
                columnCountInGroup: 61,
                rowCountInGroup: 1,
            }].forEach(({ view, columnCountInGroup, rowCountInGroup }) => {
                QUnit.test(`first-group-cell class should be assigned to correct cells in basic case in ${view.name}`, function(assert) {
                    const instance = this.createInstance(view.class);

                    instance.$element().find(toSelector(CELL_CLASS)).each(function() {
                        assert.ok($(this).hasClass(FIRST_GROUP_CELL_CLASS), 'Date table cell has first-group class');
                    });

                    instance.$element().find(`.${HEADER_PANEL_CELL_CLASS}:not(.${HEADER_PANEL_WEEK_CELL_CLASS})`).each(function() {
                        assert.notOk($(this).hasClass(FIRST_GROUP_CELL_CLASS), 'Header panel cell has first-group class');
                    });
                });

                QUnit.test(`first-group-cell class should be assigned to correct cells in ${view.name} when appointments are grouped horizontally`, function(assert) {
                    const instance = this.createInstance(view.class);

                    instance.option('groups', [{
                        name: 'one',
                        items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                    }]);

                    instance.$element().find(toSelector(CELL_CLASS)).each(function(index) {
                        checkFirstGroupCell(assert, this, index, columnCountInGroup, 'Date table');
                    });

                    instance.$element().find(`.${HEADER_PANEL_CELL_CLASS}:not(.${HEADER_PANEL_WEEK_CELL_CLASS})`).each(function(index) {
                        checkFirstGroupCell(assert, this, index, columnCountInGroup, 'Header panel');
                    });
                });

                QUnit.test(`first-group-cell class should be assigned to correct cells in ${view.name} when appointments are grouped by date`, function(assert) {
                    const instance = this.createInstance(view.class, {
                        groupByDate: true,
                    });

                    instance.option('groups', [{
                        name: 'one',
                        items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                    }]);

                    instance.$element().find(toSelector(CELL_CLASS)).each(function(index) {
                        checkFirstGroupCell(assert, this, index, GROUP_COUNT, 'Date table');
                    });

                    instance.$element().find(`.${HEADER_PANEL_CELL_CLASS}:not(.${HEADER_PANEL_WEEK_CELL_CLASS})`).each(function() {
                        assert.ok($(this).hasClass(FIRST_GROUP_CELL_CLASS), 'Header panel cell has first-group class');
                    });
                });

                QUnit.test(`first-group-cell class should be assigned to correct cells in ${view.name} when appointments are grouped vertically`, function(assert) {
                    const instance = this.createInstance(view.class, {
                        groupOrientation: 'vertical',
                    });

                    instance.option('groups', [{
                        name: 'one',
                        items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                    }]);

                    instance.$element().find(toSelector(CELL_CLASS)).each(function(index) {
                        if(Math.floor(index / columnCountInGroup) % rowCountInGroup === 0) {
                            assert.ok($(this).hasClass(FIRST_GROUP_CELL_CLASS), 'Date table cell has first-group class');
                        } else {
                            assert.notOk($(this).hasClass(FIRST_GROUP_CELL_CLASS), 'Date table cell does not have first-group class');
                        }
                    });

                    instance.$element().find(`.${HEADER_PANEL_CELL_CLASS}:not(.${HEADER_PANEL_WEEK_CELL_CLASS})`).each(function() {
                        assert.notOk($(this).hasClass(FIRST_GROUP_CELL_CLASS), 'Header panel cell does not have first-group class');
                    });
                });

                QUnit.test(`last-group-cell class should be assigned to correct cells in basic case in ${view.name}`, function(assert) {
                    const instance = this.createInstance(view.class);

                    instance.$element().find(toSelector(CELL_CLASS)).each(function() {
                        assert.ok($(this).hasClass(LAST_GROUP_CELL_CLASS), 'Date table cell has last-group class');
                    });

                    instance.$element().find(`.${HEADER_PANEL_CELL_CLASS}:not(.${HEADER_PANEL_WEEK_CELL_CLASS})`).each(function() {
                        assert.notOk($(this).hasClass(LAST_GROUP_CELL_CLASS), 'Header panel cell does not have last-group class');
                    });
                });

                QUnit.test(`last-group-cell class should be assigned to correct cells in ${view.name} when appointments are grouped horizontally`, function(assert) {
                    const instance = this.createInstance(view.class);

                    instance.option('groups', [{
                        name: 'one',
                        items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                    }]);

                    instance.$element().find(toSelector(CELL_CLASS)).each(function(index) {
                        checkLastGroupCell(assert, this, index, columnCountInGroup, 'Date table');
                    });

                    instance.$element().find(`.${HEADER_PANEL_CELL_CLASS}:not(.${HEADER_PANEL_WEEK_CELL_CLASS})`).each(function(index) {
                        checkLastGroupCell(assert, this, index, columnCountInGroup, 'Header panel');
                    });
                });

                QUnit.test(`last-group-cell class should be assigned to correct cells in ${view.name} when appointments are grouped by date`, function(assert) {
                    const instance = this.createInstance(view.class, {
                        groupByDate: true,
                    });

                    instance.option('groups', [{
                        name: 'one',
                        items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                    }]);

                    instance.$element().find(toSelector(CELL_CLASS)).each(function(index) {
                        checkLastGroupCell(assert, this, index, GROUP_COUNT, 'Date table');
                    });

                    instance.$element().find(`.${HEADER_PANEL_CELL_CLASS}:not(.${HEADER_PANEL_WEEK_CELL_CLASS})`).each(function() {
                        assert.ok($(this).hasClass(LAST_GROUP_CELL_CLASS), 'Header panel cell has last-group class');
                    });
                });

                QUnit.test(`last-group-cell class should be assigned to correct cells in ${view.name} when appointments are grouped vertically`, function(assert) {
                    const instance = this.createInstance(view.class, {
                        groupOrientation: 'vertical',
                    });

                    instance.option('groups', [{
                        name: 'one',
                        items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                    }]);

                    instance.$element().find(toSelector(CELL_CLASS)).each(function(index) {
                        if((Math.floor(index / columnCountInGroup) + 1) % rowCountInGroup === 0) {
                            assert.ok($(this).hasClass(LAST_GROUP_CELL_CLASS), 'Date table cell has last-group class');
                        } else {
                            assert.notOk($(this).hasClass(LAST_GROUP_CELL_CLASS), 'Date table cell does not have last-group class');
                        }
                    });

                    instance.$element().find(`.${HEADER_PANEL_CELL_CLASS}:not(.${HEADER_PANEL_WEEK_CELL_CLASS})`).each(function() {
                        assert.notOk($(this).hasClass(LAST_GROUP_CELL_CLASS), 'Header panel cell does not have last-group class');
                    });
                });
            });
        });
    });
});
