import $ from 'jquery';
import SchedulerTimeline from 'ui/scheduler/workspaces/ui.scheduler.timeline';
import SchedulerTimelineDay from 'ui/scheduler/workspaces/ui.scheduler.timeline_day';
import SchedulerTimelineWeek from 'ui/scheduler/workspaces/ui.scheduler.timeline_week';
import SchedulerTimelineWorkWeek from 'ui/scheduler/workspaces/ui.scheduler.timeline_work_week';
import SchedulerTimelineMonth from 'ui/scheduler/workspaces/ui.scheduler.timeline_month';
import dataUtils from 'core/element_data';
import dateLocalization from 'localization/date';
import SchedulerWorkSpaceVerticalStrategy from 'ui/scheduler/workspaces/ui.scheduler.work_space.grouped.strategy.vertical';
import SchedulerWorkSpaceHorizontalStrategy from 'ui/scheduler/workspaces/ui.scheduler.work_space.grouped.strategy.horizontal';
import SchedulerResourcesManager from 'ui/scheduler/ui.scheduler.resource_manager';
import 'ui/scheduler/ui.scheduler';

QUnit.testStart(() => {
    const markup =
        '<div id="scheduler-timeline"></div>';

    $('#qunit-fixture').html(markup);
});

const CELL_CLASS = 'dx-scheduler-date-table-cell';

var checkHeaderCells = function($element, assert, interval, groupCount, viewDuration) {
    interval = interval || 0.5;
    viewDuration = viewDuration || 1;
    groupCount = groupCount || 1;
    var cellCount = 24 / interval,
        cellDuration = 3600000 * interval;

    assert.equal($element.find('.dx-scheduler-header-panel-cell').length, cellCount * groupCount * viewDuration, 'Time panel has a right count of cells');
    $element.find('.dx-scheduler-header-panel-cell').each(function(index) {
        var time = dateLocalization.format(new Date(new Date(1970, 0).getTime() + cellDuration * index), 'shorttime');
        assert.equal($(this).text(), time, 'Time is OK');
    });
};

const stubInvokeMethod = (instance) => {
    sinon.stub(instance, 'invoke', function() {
        var subscribe = arguments[0];
        if(subscribe === 'createResourcesTree') {
            return new SchedulerResourcesManager().createResourcesTree(arguments[1]);
        }
        if(subscribe === 'convertDateByTimezone') {
            return arguments[1];
        }
    });
};

const moduleConfig = {
    beforeEach: () =>{
        this.createInstance = function(options) {
            this.instance = $('#scheduler-timeline').dxSchedulerTimeline().dxSchedulerTimeline('instance');
            stubInvokeMethod(this.instance, options);
        };

        this.createInstance();
    }
};

QUnit.module('Timeline markup', moduleConfig, () => {
    QUnit.test('Scheduler timeline should be initialized', (assert) => {
        assert.ok(this.instance instanceof SchedulerTimeline, 'dxSchedulerTimeLine was initialized');
    });

    QUnit.test('Scheduler timeline should have right groupedStrategy by default', (assert) => {
        assert.ok(this.instance._groupedStrategy instanceof SchedulerWorkSpaceVerticalStrategy, 'Grouped strategy is right');
    });

    QUnit.test('Two scrollable elements should be rendered', (assert) => {
        let $dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable'),
            $headerScrollable = this.instance.$element().find('.dx-scheduler-header-scrollable');


        assert.equal($dateTableScrollable.length, 1, 'Date table scrollable was rendered');
        assert.ok($dateTableScrollable.dxScrollable('instance'), 'Date table scrollable is instance of dxScrollable');

        assert.equal($headerScrollable.length, 1, 'Header scrollable was rendered');
        assert.ok($headerScrollable.dxScrollable('instance'), 'Header scrollable is instance of dxScrollable');
    });

    QUnit.test('Both scrollable elements should be rendered if crossScrollingEnabled=true', (assert) => {
        this.instance.option('crossScrollingEnabled', true);
        assert.ok(this.instance.$element().hasClass('dx-scheduler-work-space-both-scrollbar'), 'CSS class is OK');
        this.instance.option('crossScrollingEnabled', false);
        assert.notOk(this.instance.$element().hasClass('dx-scheduler-work-space-both-scrollbar'), 'CSS class is OK');
    });

    QUnit.test('Date table scrollable should have right config', (assert) => {
        let dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');

        assert.equal(dateTableScrollable.option('direction'), 'horizontal', 'Direction is OK');
    });

    QUnit.test('Date table scrollable should have right config for crossScrolling', (assert) => {
        this.instance.option('crossScrollingEnabled', true);
        let dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable').dxScrollable('instance');

        assert.equal(dateTableScrollable.option('direction'), 'both', 'Direction is OK');
    });

    QUnit.test('Sidebar should contain group table in grouped mode', (assert) => {
        let $element = this.instance.$element();

        this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }]);
        let $groupTable = $element.find('.dx-scheduler-sidebar-scrollable .dx-scheduler-group-table');

        assert.equal($groupTable.length, 1, 'Group table is rendered');
    });

    QUnit.test('Header panel should not contain group rows in grouped mode', (assert) => {
        let $element = this.instance.$element();

        this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }]);
        let $groupRows = $element.find('.dx-scheduler-header-panel .dx-scheduler-group-row');

        assert.strictEqual($groupRows.length, 0, 'Header panel does not contain any group row');
    });

    QUnit.test('Group table should contain right rows and cells count', (assert) => {
        let $element = this.instance.$element();

        this.instance.option('groups', [
            { name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] },
            { name: 'two', items: [{ id: 1, text: '1' }, { id: 2, text: '2' }] }
        ]);

        let $groupTable = $element.find('.dx-scheduler-sidebar-scrollable .dx-scheduler-group-table'),
            $groupRows = $groupTable.find('.dx-scheduler-group-row'),
            $firstRowCells = $groupRows.eq(0).find('.dx-scheduler-group-header'),
            $secondRowCells = $groupRows.eq(1).find('.dx-scheduler-group-header'),
            $thirdRowCells = $groupRows.eq(2).find('.dx-scheduler-group-header'),
            $fourthRowCells = $groupRows.eq(3).find('.dx-scheduler-group-header');

        assert.equal($groupRows.length, 4, 'Row count is OK');
        assert.equal($firstRowCells.length, 2, 'Cell count is OK');
        assert.equal($firstRowCells.eq(0).attr('rowspan'), 2, 'Rowspan is OK');
        assert.equal($firstRowCells.eq(1).attr('rowspan'), 1, 'Rowspan is OK');

        assert.equal($secondRowCells.length, 1, 'Cell count is OK');
        assert.equal($secondRowCells.eq(0).attr('rowspan'), 1, 'Rowspan is OK');

        assert.equal($thirdRowCells.length, 2, 'Cell count is OK');
        assert.equal($thirdRowCells.eq(0).attr('rowspan'), 2, 'Rowspan is OK');
        assert.equal($thirdRowCells.eq(1).attr('rowspan'), 1, 'Rowspan is OK');

        assert.equal($fourthRowCells.length, 1, 'Cell count is OK');
        assert.equal($fourthRowCells.eq(0).attr('rowspan'), 1, 'Rowspan is OK');
    });

    QUnit.test('Timeline should have the right \'dx-group-column-count\' attr depend on group count', (assert) => {
        let $element = this.instance.$element();

        this.instance.option('groups', [
            { name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] },
            { name: 'two', items: [{ id: 1, text: '1' }, { id: 2, text: '2' }] }
        ]);

        assert.equal($element.attr('dx-group-column-count'), '2', 'Attr is OK');
        assert.notOk($element.attr('dx-group-row-count'), 'row-count attr is not applied');

        this.instance.option('groups', []);

        assert.notOk($element.attr('dx-group-column-count'), 'column-count attr is not applied');
    });
});

let timelineDayModuleConfig = {
    beforeEach: () =>{
        this.createInstance = function(options) {
            this.instance = $('#scheduler-timeline').dxSchedulerTimelineDay().dxSchedulerTimelineDay('instance');
            stubInvokeMethod(this.instance, options);
        };

        this.createInstance();
    }
};

QUnit.module('TimelineDay markup', timelineDayModuleConfig, () => {
    QUnit.test('Scheduler timelineDay should be initialized', (assert) => {
        assert.ok(this.instance instanceof SchedulerTimelineDay, 'dxSchedulerTimeLineDay was initialized');
    });

    QUnit.test('Scheduler timeline day should have a right css class', (assert) => {
        let $element = this.instance.$element();
        assert.ok($element.hasClass('dx-scheduler-timeline'), 'dxSchedulerTimelineDay has \'dx-scheduler-timeline\' css class');
        assert.ok($element.hasClass('dx-scheduler-timeline-day'), 'dxSchedulerTimelineDay has \'dx-scheduler-timeline\' css class');
    });

    QUnit.test('Scheduler timeline day view should have right cell & row count', (assert) => {
        let $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-date-table-row').length, 1, 'Date table has 1 rows');
        assert.equal($element.find('.dx-scheduler-date-table-cell').length, 48, 'Date table has 48 cells');
    });

    QUnit.test('Scheduler timeline day should have rigth first view date', (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 9, 21),
            firstDayOfWeek: 1,
            startDayHour: 4
        });

        assert.deepEqual(this.instance.getStartViewDate(), new Date(2015, 9, 21, 4), 'First view date is OK');
    });

    QUnit.test('Each cell of scheduler timeline day should contain rigth jQuery dxCellData', (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 9, 21),
            firstDayOfWeek: 1,
            startDayHour: 5,
            hoursInterval: 1
        });

        let $cells = this.instance.$element().find('.' + CELL_CLASS);

        assert.deepEqual(dataUtils.data($cells.get(0), 'dxCellData'), {
            startDate: new Date(2015, 9, 21, 5),
            endDate: new Date(2015, 9, 21, 6),
            allDay: false
        }, 'data of first cell is rigth');

        assert.deepEqual(dataUtils.data($cells.get(5), 'dxCellData'), {
            startDate: new Date(2015, 9, 21, 10),
            endDate: new Date(2015, 9, 21, 11),
            allDay: false
        }, 'data of 5th cell is rigth');

        assert.deepEqual(dataUtils.data($cells.get(10), 'dxCellData'), {
            startDate: new Date(2015, 9, 21, 15),
            endDate: new Date(2015, 9, 21, 16),
            allDay: false
        }, 'data of 10th cell is rigth');
    });

    QUnit.test('Each cell of grouped scheduler timeline day should contain rigth jQuery dxCellData', (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 9, 21),
            firstDayOfWeek: 1,
            startDayHour: 5,
            hoursInterval: 1,
            groups: [
                { name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] },
                { name: 'two', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }
            ]
        });

        let $cells = this.instance.$element().find('.dx-scheduler-date-table-row').eq(2).find('.' + CELL_CLASS);

        assert.deepEqual(dataUtils.data($cells.get(0), 'dxCellData'), {
            startDate: new Date(2015, 9, 21, 5),
            endDate: new Date(2015, 9, 21, 6),
            allDay: false,
            groups: {
                one: 2,
                two: 1
            }
        }, 'data of first cell is rigth');

        assert.deepEqual(dataUtils.data($cells.get(5), 'dxCellData'), {
            startDate: new Date(2015, 9, 21, 10),
            endDate: new Date(2015, 9, 21, 11),
            allDay: false,
            groups: {
                one: 2,
                two: 1
            }
        }, 'data of 5th cell is rigth');

        assert.deepEqual(dataUtils.data($cells.get(10), 'dxCellData'), {
            startDate: new Date(2015, 9, 21, 15),
            endDate: new Date(2015, 9, 21, 16),
            allDay: false,
            groups: {
                one: 2,
                two: 1
            }
        }, 'data of 10th cell is rigth');
    });

    QUnit.test('Header panel should have right quantity of cells', (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 9, 21, 0, 0)
        });
        checkHeaderCells(this.instance.$element(), assert);
    });

    QUnit.test('Date table should have right quantity of cells', (assert) => {
        var $element = this.instance.$element();

        this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }]);
        let $rows = $element.find('.dx-scheduler-date-table-row');

        assert.equal($rows.length, 2, 'Date table has 2 rows');
        assert.equal($rows.eq(0).find('.dx-scheduler-date-table-cell').length, 48, 'The first group row has 48 cells');
        assert.equal($rows.eq(1).find('.dx-scheduler-date-table-cell').length, 48, 'The second group row has 48 cells');
    });

    QUnit.test('Scheduler timeline day should correctly process startDayHour=0', (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 5, 30),
            startDayHour: 10
        });

        this.instance.option('startDayHour', 0);

        assert.deepEqual(this.instance.getStartViewDate(), new Date(2015, 5, 30, 0), 'First view date is correct');
    });

    QUnit.test('Cell count should depend on start/end day hour & hoursInterval', (assert) => {
        let $element = this.instance.$element();

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
    beforeEach: () =>{
        this.createInstance = function(options) {
            this.instance = $('#scheduler-timeline').dxSchedulerTimelineDay({
                currentDate: new Date(2015, 9, 16)
            }).dxSchedulerTimelineDay('instance');
            stubInvokeMethod(this.instance, options);
        };

        this.createInstance();
    }
};

QUnit.module('TimelineDay with intervalCount markup', timelineDayModuleConfig, () => {
    QUnit.test('TimelineDay has right intervalCount of cells with view option intervalCount', (assert) => {
        this.instance.option('intervalCount', 2);

        var cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 2, 'view has right cell count');

        this.instance.option('intervalCount', 4);

        cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 4, 'view has right cell count');
    });

    QUnit.test('TimelineDay Day view cells have right cellData with view option intervalCount=2', (assert) => {
        this.instance.option('intervalCount', 2);
        this.instance.option('currentDate', new Date(2017, 5, 29));

        var firstCellData = dataUtils.data(this.instance.$element().find('.dx-scheduler-date-table-cell').get(0), 'dxCellData'),
            secondCellData = dataUtils.data(this.instance.$element().find('.dx-scheduler-date-table-cell').get(95), 'dxCellData');

        assert.deepEqual(firstCellData.startDate, new Date(2017, 5, 29, 0), 'cell has right startDate');
        assert.deepEqual(firstCellData.endDate, new Date(2017, 5, 29, 0, 30), 'cell has right endtDate');

        assert.deepEqual(secondCellData.startDate, new Date(2017, 5, 30, 23, 30), 'cell has right startDate');
        assert.deepEqual(secondCellData.endDate, new Date(2017, 5, 31, 0), 'cell has right endtDate');
    });

    QUnit.test('Get date range', (assert) => {
        this.instance.option('currentDate', new Date(2015, 2, 16));
        this.instance.option('intervalCount', 2);

        assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 16, 0, 0), new Date(2015, 2, 17, 23, 59)], 'Range is OK');

        this.instance.option('intervalCount', 4);
        assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 16, 0, 0), new Date(2015, 2, 19, 23, 59)], 'Range is OK');
    });

    QUnit.test('Scheduler timeline day header cells should have right class', (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 9, 29),
            intervalCount: 2
        });
        let $element = this.instance.$element(),
            $firstRow = $element.find('.dx-scheduler-header-row').first();

        assert.equal($firstRow.find('.dx-scheduler-header-panel-week-cell').length, 2, 'First row cells count and class is ok');
    });

    QUnit.test('Scheduler timeline day should contain two rows in header panel, if intervalCount is set', (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 9, 29),
            firstDayOfWeek: 1,
            startDayHour: 4,
            endDayHour: 5,
            intervalCount: 1
        });

        assert.equal(this.instance.$element().find('.dx-scheduler-header-row').length, 1, 'There is 1 row in header panel');

        this.instance.option('intervalCount', 2);

        let $rows = this.instance.$element().find('.dx-scheduler-header-row'),
            $firstRowCells = $rows.first().find('.dx-scheduler-header-panel-cell'),
            startDate = 29;

        assert.equal($rows.length, 2, 'There are 2 rows in header panel');

        for(var i = 0; i < 2; i++) {
            var $cell = $firstRowCells.eq(i);
            assert.equal($cell.text(), formatWeekdayAndDay(new Date(2015, 9, startDate + i)), 'Cell text is OK');
            assert.equal($cell.attr('colspan'), 2, 'Cell colspan is OK');
        }
    });
});

timelineDayModuleConfig = {
    beforeEach: () =>{
        this.createInstance = function(options) {
            this.instance = $('#scheduler-timeline').dxSchedulerTimelineDay({
                groupOrientation: 'horizontal'
            }).dxSchedulerTimelineDay('instance');
            stubInvokeMethod(this.instance, options);

            this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }]);
        };

        this.createInstance();
    }
};

QUnit.module('TimelineDay with horizontal grouping markup', timelineDayModuleConfig, () => {
    QUnit.test('Scheduler timeline day should have right groupedStrategy, groupOrientation = horizontal', (assert) => {
        assert.ok(this.instance._groupedStrategy instanceof SchedulerWorkSpaceHorizontalStrategy, 'Grouped strategy is right');
    });

    QUnit.test('Scheduler timeline day should have a right css class, groupOrientation = horizontal', (assert) => {
        let $element = this.instance.$element();
        assert.ok($element.hasClass('dx-scheduler-work-space-horizontal-grouped'), 'dxSchedulerTimelineDay has \'dx-scheduler-work-space-horizontal-grouped\' css class');
    });

    QUnit.test('Scheduler timeline day view should have right cell & row count, groupOrientation = horizontal', (assert) => {
        let $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-date-table-row').length, 1, 'Date table has 1 rows');
        assert.equal($element.find('.dx-scheduler-date-table-cell').length, 96, 'Date table has 96 cells');
    });

    QUnit.test('Each cell of scheduler timeline day should contain rigth jQuery dxCellData, groupOrientation = horizontal', (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 9, 21),
            firstDayOfWeek: 1,
            startDayHour: 5,
            endDayHour: 8,
            hoursInterval: 1
        });

        let $cells = this.instance.$element().find('.' + CELL_CLASS);

        assert.deepEqual(dataUtils.data($cells.get(0), 'dxCellData'), {
            startDate: new Date(2015, 9, 21, 5),
            endDate: new Date(2015, 9, 21, 6),
            allDay: false,
            groups: {
                one: 1
            }
        }, 'data of first cell is rigth');

        assert.deepEqual(dataUtils.data($cells.get(5), 'dxCellData'), {
            startDate: new Date(2015, 9, 21, 7),
            endDate: new Date(2015, 9, 21, 8),
            allDay: false,
            groups: {
                one: 2
            }
        }, 'data of 5th cell is rigth');
    });

    QUnit.test('Header panel should have right quantity of cells, groupOrientation = horizontal', (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 9, 21, 0, 0)
        });
        checkHeaderCells(this.instance.$element(), assert, 0.5, 2);
    });

    QUnit.test('Date table should have right quantity of cells, groupOrientation = horizontal', (assert) => {
        var $element = this.instance.$element();

        let $rows = $element.find('.dx-scheduler-date-table-row');

        assert.equal($rows.length, 1, 'Date table has 1 row');
        assert.equal($rows.eq(0).find('.dx-scheduler-date-table-cell').length, 48 * 2, 'The first group row has 96 cells');
    });

    QUnit.test('Header panel should contain group rows in grouped mode, groupOrientation = horizontal', (assert) => {
        let $element = this.instance.$element();

        let $groupRows = $element.find('.dx-scheduler-header-panel .dx-scheduler-group-row');

        assert.strictEqual($groupRows.length, 1, 'Header panel does not contain any group row');
    });

    QUnit.test('Group table should contain right rows and cells count, groupOrientation = horizontal', (assert) => {
        let $element = this.instance.$element();

        let $groupRows = $element.find('.dx-scheduler-group-row'),
            $firstRowCells = $groupRows.eq(0).find('.dx-scheduler-group-header');

        assert.equal($groupRows.length, 1, 'Row count is OK');
        assert.equal($firstRowCells.length, 2, 'Cell count is OK');
    });

    QUnit.test('Last group cell should have right class', (assert) => {
        let $element = this.instance.$element();

        assert.ok($element.find('.dx-scheduler-date-table-cell').eq(47).hasClass('dx-scheduler-last-group-cell'), 'cell has correct class');
    });
});

let timelineWeekModuleConfig = {
    beforeEach: () =>{
        this.createInstance = function(options) {
            this.instance = $('#scheduler-timeline').dxSchedulerTimelineWeek().dxSchedulerTimelineWeek('instance');
            stubInvokeMethod(this.instance, options);
        };

        this.createInstance();
    }
};

let formatWeekdayAndDay = function(date) {
    return dateLocalization.getDayNames('abbreviated')[date.getDay()] + ' ' + dateLocalization.format(date, 'day');
};

QUnit.module('TimelineWeek markup', timelineWeekModuleConfig, () => {
    QUnit.test('Scheduler timeline week should be initialized', (assert) => {
        assert.ok(this.instance instanceof SchedulerTimelineWeek, 'dxSchedulerTimeLineWeek was initialized');
    });

    QUnit.test('Scheduler timeline week should have a right css class', (assert) => {
        let $element = this.instance.$element();
        assert.ok($element.hasClass('dx-scheduler-timeline'), 'dxSchedulerTimelineWeek has \'dx-scheduler-timeline\' css class');
        assert.ok($element.hasClass('dx-scheduler-timeline-week'), 'dxSchedulerTimelineWeek has \'dx-scheduler-timeline\' css class');
    });

    QUnit.test('Scheduler timeline week view should have right cell & row count', (assert) => {
        let $element = this.instance.$element();


        assert.equal($element.find('.dx-scheduler-date-table-row').length, 1, 'Date table has 1 rows');
        assert.equal($element.find('.dx-scheduler-date-table-cell').length, 336, 'Date table has 336 cells');
    });

    QUnit.test('Scheduler timeline week view should have right cell & row count is startDayHour and endDayHour are defined', (assert) => {
        this.instance.option({
            startDayHour: 9,
            endDayHour: 10,
            currentDate: new Date(2015, 9, 29),
            groups: [
                { name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }
            ]
        });
        let $element = this.instance.$element(),
            $lastRow = $element.find('.dx-scheduler-header-row').last();


        assert.equal($element.find('.dx-scheduler-date-table-row').length, 2, 'Date table has 1 rows');
        assert.equal($element.find('.dx-scheduler-date-table-cell').length, 28, 'Date table has 28 cells');
        assert.equal($lastRow.find('.dx-scheduler-header-panel-cell').length, 14, 'Header row has 14 cells');

        assert.equal($lastRow.find('.dx-scheduler-header-panel-cell').eq(2).text(), dateLocalization.format(new Date(2015, 9, 29, 9), 'shorttime'));
    });

    QUnit.test('Scheduler timeline week header cells should have right class', (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 9, 29)
        });
        let $element = this.instance.$element(),
            $firstRow = $element.find('.dx-scheduler-header-row').first();

        assert.equal($firstRow.find('.dx-scheduler-header-panel-week-cell').length, 7, 'First row cells count and class is ok');
    });

    QUnit.test('Scheduler timeline week should have rigth first view date', (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 9, 21),
            firstDayOfWeek: 1,
            startDayHour: 4
        });

        assert.deepEqual(this.instance.getStartViewDate(), new Date(2015, 9, 19, 4), 'First view date is OK');
    });

    QUnit.test('Scheduler timeline week should contain two rows in header panel', (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 9, 29),
            firstDayOfWeek: 1,
            startDayHour: 4,
            endDayHour: 5
        });

        let $rows = this.instance.$element().find('.dx-scheduler-header-row'),
            $firstRowCells = $rows.first().find('.dx-scheduler-header-panel-cell'),
            startDate = 26;

        assert.equal($rows.length, 2, 'There are 2 rows in header panel');

        for(var i = 0; i < 7; i++) {
            var $cell = $firstRowCells.eq(i);
            assert.equal($cell.text(), formatWeekdayAndDay(new Date(2015, 9, startDate + i)), 'Cell text is OK');
            assert.equal($cell.attr('colspan'), 2, 'Cell colspan is OK');
        }
    });

    QUnit.test('Cell count should depend on start/end day hour & hoursInterval', (assert) => {
        let $element = this.instance.$element();

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
    beforeEach: () =>{
        this.createInstance = function(options) {
            this.instance = $('#scheduler-timeline').dxSchedulerTimelineWeek(options).dxSchedulerTimelineWeek('instance');
            stubInvokeMethod(this.instance, options);
        };

        this.createInstance({
            currentDate: new Date(2015, 9, 16)
        });
    }
};

QUnit.module('TimelineWeek with intervalCount markup', timelineWeekModuleConfig, () => {
    QUnit.test('TimelineWeek has right count of cells with view option intervalCount', (assert) => {
        this.instance.option('intervalCount', 2);

        let cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 7 * 2, 'view has right cell count');

        this.instance.option('intervalCount', 4);

        cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 7 * 4, 'view has right cell count');
    });

    QUnit.test('TimelineWeek view cells have right cellData with view option intervalCount=2', (assert) => {
        this.instance.option('intervalCount', 2);
        this.instance.option('currentDate', new Date(2017, 5, 29));

        let firstCellData = dataUtils.data(this.instance.$element().find('.dx-scheduler-date-table-cell').get(7 * 48), 'dxCellData'),
            secondCellData = dataUtils.data(this.instance.$element().find('.dx-scheduler-date-table-cell').get(2 * 7 * 48 - 1), 'dxCellData');

        assert.deepEqual(firstCellData.startDate, new Date(2017, 6, 2, 0), 'cell has right startDate');
        assert.deepEqual(firstCellData.endDate, new Date(2017, 6, 2, 0, 30), 'cell has right endtDate');

        assert.deepEqual(secondCellData.startDate, new Date(2017, 6, 8, 23, 30), 'cell has right startDate');
        assert.deepEqual(secondCellData.endDate, new Date(2017, 6, 9, 0), 'cell has right endtDate');
    });

    QUnit.test('Get date range', (assert) => {
        this.instance.option('currentDate', new Date(2017, 5, 26));
        this.instance.option('intervalCount', 2);
        this.instance.option('firstDayOfWeek', 1);

        assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 26, 0, 0), new Date(2017, 6, 9, 23, 59)], 'Range is OK');

        this.instance.option('intervalCount', 4);
        assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 26, 0, 0), new Date(2017, 6, 23, 23, 59)], 'Range is OK');
    });

    QUnit.test('TimelineWeek view should contain right header if intervalCount=3', (assert) => {
        this.instance.option('currentDate', new Date(2017, 5, 26));
        this.instance.option('intervalCount', 3);

        let $element = this.instance.$element(),
            $firstRow = $element.find('.dx-scheduler-header-row').first();

        assert.equal($firstRow.find('.dx-scheduler-header-panel-cell').length, 21, 'Header row has 21 cells');
    });
});

timelineWeekModuleConfig = {
    beforeEach: () =>{
        this.createInstance = function(options) {
            this.instance = $('#scheduler-timeline').dxSchedulerTimelineWeek({
                groupOrientation: 'horizontal'
            }).dxSchedulerTimelineWeek('instance');
            stubInvokeMethod(this.instance, options);

            this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }]);
        };

        this.createInstance();
    }
};

QUnit.module('TimelineWeek with horizontal grouping markup', timelineWeekModuleConfig, () => {
    QUnit.test('Scheduler timeline day view should have right cell & row count, groupOrientation = horizontal', (assert) => {
        let $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-date-table-row').length, 1, 'Date table has 1 rows');
        assert.equal($element.find('.dx-scheduler-date-table-cell').length, 336 * 2, 'Date table has 672 cells');
    });

    QUnit.test('Each cell of scheduler timeline week should contain rigth jQuery dxCellData, groupOrientation = horizontal', (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 9, 21),
            firstDayOfWeek: 1,
            startDayHour: 5,
            endDayHour: 8,
            hoursInterval: 1
        });

        let $cells = this.instance.$element().find('.' + CELL_CLASS);

        assert.deepEqual(dataUtils.data($cells.get(0), 'dxCellData'), {
            startDate: new Date(2015, 9, 19, 5),
            endDate: new Date(2015, 9, 19, 6),
            allDay: false,
            groups: {
                one: 1
            }
        }, 'data of first cell is rigth');

        assert.deepEqual(dataUtils.data($cells.get(25), 'dxCellData'), {
            startDate: new Date(2015, 9, 20, 6),
            endDate: new Date(2015, 9, 20, 7),
            allDay: false,
            groups: {
                one: 2
            }
        }, 'data of 25th cell is rigth');
    });

    QUnit.test('Header panel should contain group rows in grouped mode, groupOrientation = horizontal', (assert) => {
        let $element = this.instance.$element();

        let $groupRows = $element.find('.dx-scheduler-header-panel .dx-scheduler-group-row');

        assert.strictEqual($groupRows.length, 1, 'Header panel does not contain any group row');
    });

    QUnit.test('Group table should contain right rows and cells count, groupOrientation = horizontal', (assert) => {
        let $element = this.instance.$element();

        let $groupRows = $element.find('.dx-scheduler-group-row'),
            $firstRowCells = $groupRows.eq(0).find('.dx-scheduler-group-header');

        assert.equal($groupRows.length, 1, 'Row count is OK');
        assert.equal($firstRowCells.length, 2, 'Cell count is OK');
    });
});

let timelineWorkWeekModuleConfig = {
    beforeEach: () =>{
        this.createInstance = function(options) {
            this.instance = $('#scheduler-timeline').dxSchedulerTimelineWorkWeek().dxSchedulerTimelineWorkWeek('instance');
            stubInvokeMethod(this.instance, options);
        };

        this.createInstance();
    }
};

QUnit.module('TimelineWorkWeek markup', timelineWorkWeekModuleConfig, () => {
    QUnit.test('Scheduler timeline work week should be initialized', (assert) => {
        assert.ok(this.instance instanceof SchedulerTimelineWorkWeek, 'dxSchedulerTimeLineWorkWeek was initialized');
    });

    QUnit.test('Scheduler timeline work week should have a right css class', (assert) => {
        let $element = this.instance.$element();
        assert.ok($element.hasClass('dx-scheduler-timeline'), 'dxSchedulerTimelineWorkWeek has \'dx-scheduler-timeline\' css class');
        assert.ok($element.hasClass('dx-scheduler-timeline-work-week'), 'dxSchedulerTimelineWorkWeek has \'dx-scheduler-timeline-work-week\' css class');
    });

    QUnit.test('Scheduler timeline work week view should have right cell & row count', (assert) => {
        let $element = this.instance.$element();
        assert.equal($element.find('.dx-scheduler-date-table-row').length, 1, 'Date table has 1 rows');
        assert.equal($element.find('.dx-scheduler-date-table-cell').length, 240, 'Date table has 240 cells');
    });

    QUnit.test('Scheduler timeline work week should have rigth first view date', (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 9, 21),
            firstDayOfWeek: 1,
            startDayHour: 4
        });

        assert.deepEqual(this.instance.getStartViewDate(), new Date(2015, 9, 19, 4), 'First view date is OK');
    });

    QUnit.test('Scheduler timeline workweek should contain two rows in header panel', (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 9, 29),
            firstDayOfWeek: 1,
            startDayHour: 4,
            endDayHour: 5
        });

        let $rows = this.instance.$element().find('.dx-scheduler-header-row'),
            $firstRowCells = $rows.first().find('th'),
            startDate = 26;

        assert.equal($rows.length, 2, 'There are 2 rows in header panel');

        for(let i = 0; i < 5; i++) {
            let $cell = $firstRowCells.eq(i);
            assert.equal($cell.text(), formatWeekdayAndDay(new Date(2015, 9, startDate + i)), 'Cell text is OK');
            assert.equal($cell.attr('colspan'), 2, 'Cell colspan is OK');
        }
    });

    QUnit.test('Scheduler timeline workweek view should be correct, if currentDate is Monday, but firstDayOfWeek = 0', (assert) => {
        let $element = this.instance.$element();

        this.instance.option('firstDayOfWeek', 0);
        this.instance.option('currentDate', new Date(2015, 4, 25));

        let $headerCells = $element.find('.dx-scheduler-header-row th');

        assert.equal($headerCells.first().text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[1].toLowerCase() + ' 25', 'first header has a right text');
        assert.equal($headerCells.eq(2).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[3].toLowerCase() + ' 27', '3 header has a right text');
        assert.equal($headerCells.eq(4).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[5].toLowerCase() + ' 29', 'last header has a right text');
    });
});

timelineWorkWeekModuleConfig = {
    beforeEach: () =>{
        this.createInstance = function(options) {
            this.instance = $('#scheduler-timeline').dxSchedulerTimelineWorkWeek(options).dxSchedulerTimelineWorkWeek('instance');
            stubInvokeMethod(this.instance, options);
        };

        this.createInstance({
            currentDate: new Date(2015, 9, 16)
        });
    }
};

QUnit.module('TimelineWorkWeek with intervalCount markup', timelineWorkWeekModuleConfig, () => {
    QUnit.test('TimelineWorkWeek has right count of cells with view option intervalCount', (assert) => {
        this.instance.option('intervalCount', 2);

        let cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 5 * 2, 'view has right cell count');

        this.instance.option('intervalCount', 4);

        cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 5 * 4, 'view has right cell count');
    });

    QUnit.test('TimelineWorkWeek view cells have right cellData with view option intervalCount=2', (assert) => {
        this.instance.option('intervalCount', 2);
        this.instance.option('currentDate', new Date(2017, 5, 29));

        let firstCellData = dataUtils.data(this.instance.$element().find('.dx-scheduler-date-table-cell').get(5 * 48), 'dxCellData'),
            secondCellData = dataUtils.data(this.instance.$element().find('.dx-scheduler-date-table-cell').get(2 * 5 * 48 - 1), 'dxCellData');

        assert.deepEqual(firstCellData.startDate, new Date(2017, 6, 3, 0), 'cell has right startDate');
        assert.deepEqual(firstCellData.endDate, new Date(2017, 6, 3, 0, 30), 'cell has right endtDate');

        assert.deepEqual(secondCellData.startDate, new Date(2017, 6, 7, 23, 30), 'cell has right startDate');
        assert.deepEqual(secondCellData.endDate, new Date(2017, 6, 8, 0), 'cell has right endtDate');
    });

    QUnit.test('Get date range', (assert) => {
        this.instance.option('currentDate', new Date(2017, 5, 26));
        this.instance.option('intervalCount', 2);
        this.instance.option('firstDayOfWeek', 1);

        assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 26, 0, 0), new Date(2017, 6, 7, 23, 59)], 'Range is OK');

        this.instance.option('intervalCount', 4);
        assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 26, 0, 0), new Date(2017, 6, 21, 23, 59)], 'Range is OK');
    });

    QUnit.test('TimelineWorkWeek view should contain right header if intervalCount=3', (assert) => {
        this.instance.option('currentDate', new Date(2017, 5, 26));
        this.instance.option('intervalCount', 3);

        let $element = this.instance.$element(),
            $firstRow = $element.find('.dx-scheduler-header-row').first(),
            $headerCells = $firstRow.find('.dx-scheduler-header-panel-cell');

        assert.equal($headerCells.length, 15, 'Header row has 15 cells');
        assert.equal($headerCells.eq(0).text(), 'Mon 26', 'Header cell text is correct');
        assert.equal($headerCells.eq(5).text(), 'Mon 3', 'Header cell text is correct');
        assert.equal($headerCells.eq(14).text(), 'Fri 14', 'Header cell text is correct');
    });
});

let timelineMonthModuleConfig = {
    beforeEach: () =>{
        this.createInstance = function(options) {
            this.instance = $('#scheduler-timeline').dxSchedulerTimelineMonth(options).dxSchedulerTimelineMonth('instance');
            stubInvokeMethod(this.instance, options);
        };

        this.createInstance({
            currentDate: new Date(2015, 9, 16)
        });
    }
};

QUnit.module('TimelineMonth markup', timelineMonthModuleConfig, () => {
    QUnit.test('Scheduler timeline month should be initialized', (assert) => {
        assert.ok(this.instance instanceof SchedulerTimelineMonth, 'dxSchedulerTimeLineMonth was initialized');
    });

    QUnit.test('Scheduler timeline month should have a right css class', (assert) => {
        let $element = this.instance.$element();
        assert.ok($element.hasClass('dx-scheduler-timeline'), 'dxSchedulerTimelineMonth has \'dx-scheduler-timeline\' css class');
        assert.ok($element.hasClass('dx-scheduler-timeline-month'), 'dxSchedulerTimelineMonth has \'dx-scheduler-timeline\' css class');
    });

    QUnit.test('Scheduler timeline month view should have right cell & row count', (assert) => {
        let $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-date-table-row').length, 1, 'Date table has 1 rows');
        assert.equal($element.find('.dx-scheduler-date-table-cell').length, 31, 'Date table has 240 cells');
    });

    QUnit.test('Scheduler timeline month header panel should have right quantity of cells', (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 8, 21)
        });
        let $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-header-panel-cell').length, 30, 'Time panel has a right count of cells');
        $element.find('.dx-scheduler-header-panel-cell').each(function(index) {
            var header = formatWeekdayAndDay(new Date(new Date(2015, 8, 1).getTime() + 3600000 * 24 * index));
            assert.equal($(this).text(), header, 'Header text is OK');
        });
    });

    QUnit.test('Scheduler timeline month should have rigth first view date', (assert) => {
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

    QUnit.test('Each cell of scheduler timeline month should contain rigth jQuery dxCellData', (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 3, 1),
            startDayHour: 1,
            endDayHour: 10,
            firstDayOfWeek: 1
        });

        let $cells = this.instance.$element().find('.' + CELL_CLASS);

        $cells.each(function(index) {
            assert.deepEqual(dataUtils.data($(this)[0], 'dxCellData'), {
                startDate: new Date(2015, 3, 1 + index, 1),
                endDate: new Date(2015, 3, 1 + index, 10),
                allDay: false
            }, 'data of first cell is rigth');
        });
    });

    QUnit.test('Cells should have right date', (assert) => {
        this.instance.option({
            currentDate: new Date(2016, 3, 21),
            firstDayOfWeek: 1,
            hoursInterval: 1,
            startDayHour: 8,
            endDayHour: 20
        });

        let $cells = this.instance.$element().find('.' + CELL_CLASS);
        assert.deepEqual(dataUtils.data($cells.get(25), 'dxCellData').startDate, new Date(2016, 3, 26, 8), 'Date is OK');
    });
});

timelineMonthModuleConfig = {
    beforeEach: () =>{
        this.createInstance = function(options) {
            this.instance = $('#scheduler-timeline').dxSchedulerTimelineMonth(options).dxSchedulerTimelineMonth('instance');
            stubInvokeMethod(this.instance, options);
        };

        this.createInstance({
            currentDate: new Date(2015, 9, 16)
        });
    }
};

QUnit.module('TimelineMonth with intervalCount', timelineMonthModuleConfig, () => {
    QUnit.test('TimelineMonth has right count of cells with view option intervalCount', (assert) => {
        this.instance.option('intervalCount', 2);

        let cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, 61, 'view has right cell count');

        this.instance.option('intervalCount', 4);

        cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, 123, 'view has right cell count');
    });

    QUnit.test('TimelineMonth view cells have right cellData with view option intervalCount=2', (assert) => {
        this.instance.option('intervalCount', 2);
        this.instance.option('currentDate', new Date(2017, 5, 29));

        let firstCellData = dataUtils.data(this.instance.$element().find('.dx-scheduler-date-table-cell').get(0), 'dxCellData'),
            secondCellData = dataUtils.data(this.instance.$element().find('.dx-scheduler-date-table-cell').last().get(0), 'dxCellData');

        assert.deepEqual(firstCellData.startDate, new Date(2017, 5, 1, 0), 'cell has right startDate');
        assert.deepEqual(firstCellData.endDate, new Date(2017, 5, 2, 0), 'cell has right endtDate');

        assert.deepEqual(secondCellData.startDate, new Date(2017, 6, 31, 0), 'cell has right startDate');
        assert.deepEqual(secondCellData.endDate, new Date(2017, 7, 1, 0), 'cell has right endtDate');
    });

    QUnit.test('Get date range', (assert) => {
        this.instance.option('currentDate', new Date(2017, 5, 26));
        this.instance.option('intervalCount', 2);
        this.instance.option('firstDayOfWeek', 1);

        assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 1), new Date(2017, 6, 31, 23, 59)], 'Range is OK');

        this.instance.option('intervalCount', 4);
        assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 1), new Date(2017, 8, 30, 23, 59)], 'Range is OK');
    });
});

timelineMonthModuleConfig = {
    beforeEach: () =>{
        this.createInstance = function(options) {
            this.instance = $('#scheduler-timeline').dxSchedulerTimelineMonth({
                groupOrientation: 'horizontal',
                currentDate: new Date(2018, 3, 2)
            }).dxSchedulerTimelineMonth('instance');
            stubInvokeMethod(this.instance, options);

            this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }]);
        };

        this.createInstance();
    }
};

QUnit.module('TimelineMonth with horizontal scrolling markup', timelineMonthModuleConfig, () => {
    QUnit.test('Scheduler timeline month view should have right cell & row count', (assert) => {
        let $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-date-table-row').length, 1, 'Date table has 1 rows');
        assert.equal($element.find('.dx-scheduler-date-table-cell').length, 60, 'Date table has 60 cells');
    });

    QUnit.test('Scheduler timeline month header panel should have right quantity of cells', (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 8, 21)
        });
        let $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-header-panel-cell').length, 60, 'Time panel has a right count of cells');
        $element.find('.dx-scheduler-header-panel-cell').each(function(index) {
            var dateIndex = index % 30;
            var header = formatWeekdayAndDay(new Date(new Date(2015, 8, 1).getTime() + 3600000 * 24 * dateIndex));
            assert.equal($(this).text(), header, 'Header text is OK');
        });
    });

    QUnit.test('Each cell of scheduler timeline month should contain rigth jQuery dxCellData', (assert) => {
        this.instance.option({
            currentDate: new Date(2015, 3, 1),
            startDayHour: 1,
            endDayHour: 10,
            firstDayOfWeek: 1
        });

        let $cells = this.instance.$element().find('.' + CELL_CLASS);

        $cells.each(function(index) {
            var dateIndex = index % 30;
            var groupIndex = index < 30 ? 1 : 2;

            assert.deepEqual(dataUtils.data($(this)[0], 'dxCellData'), {
                startDate: new Date(2015, 3, 1 + dateIndex, 1),
                endDate: new Date(2015, 3, 1 + dateIndex, 10),
                allDay: false,
                groups: {
                    one: groupIndex
                }
            }, 'data of cell is rigth');
        });
    });

    QUnit.test('Cells should have right date', (assert) => {
        this.instance.option({
            currentDate: new Date(2016, 3, 21),
            firstDayOfWeek: 1,
            hoursInterval: 1,
            startDayHour: 8,
            endDayHour: 20
        });

        let $cells = this.instance.$element().find('.' + CELL_CLASS);
        assert.deepEqual(dataUtils.data($cells.get(25), 'dxCellData').startDate, new Date(2016, 3, 26, 8), 'Date is OK');
        assert.deepEqual(dataUtils.data($cells.get(55), 'dxCellData').startDate, new Date(2016, 3, 26, 8), 'Date is OK');
    });
});
