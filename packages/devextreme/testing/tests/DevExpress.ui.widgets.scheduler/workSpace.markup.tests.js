import $ from 'jquery';
import SchedulerWorkSpace from '__internal/scheduler/workspaces/m_work_space';
import SchedulerWorkSpaceHorizontalStrategy from '__internal/scheduler/workspaces/m_work_space_grouped_strategy_horizontal';
import SchedulerWorkSpaceVerticalStrategy from '__internal/scheduler/workspaces/m_work_space_grouped_strategy_vertical';
import dateLocalization from 'common/core/localization/date';
import devices from '__internal/core/m_devices';
import '__internal/scheduler/m_scheduler';

import 'generic_light.css!';

QUnit.testStart(() => {
    const markup =
        '<div id="scheduler-work-space">\
        <div id="scheduler-work-space-grouped">';

    $('#qunit-fixture').html(markup);
});

const WORKSPACE_CLASS = 'dx-scheduler-work-space';
const WORKSPACE_WITH_COUNT_CLASS = 'dx-scheduler-work-space-count';
const WORKSPACE_WITH_GROUP_BY_DATE_CLASS = 'dx-scheduler-work-space-group-by-date';
const HEADER_PANEL_CLASS = 'dx-scheduler-header-panel';
const ALL_DAY_PANEL_CLASS = 'dx-scheduler-all-day-panel';
const ALL_DAY_TABLE_CELL_CLASS = 'dx-scheduler-all-day-table-cell';
const ALL_DAY_ROW_CLASS = 'dx-scheduler-all-day-table-row';
const TIME_PANEL_CLASS = 'dx-scheduler-time-panel';
const DATE_TABLE_CLASS = 'dx-scheduler-date-table';
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

const toSelector = cssClass => '.' + cssClass;

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

[{
    viewName: 'Day',
    view: 'dxSchedulerWorkSpaceDay',
    baseColSpan: 1,
}, {
    viewName: 'Week',
    view: 'dxSchedulerWorkSpaceWeek',
    baseColSpan: 7,
}, {
    viewName: 'Month',
    view: 'dxSchedulerWorkSpaceMonth',
    baseColSpan: 7,
}, {
    viewName: 'Timeline Day',
    view: 'dxSchedulerTimelineDay',
    baseColSpan: 48,
}, {
    viewName: 'Timeline Week',
    view: 'dxSchedulerTimelineWeek',
    baseColSpan: 336,
}, {
    viewName: 'Timeline Month',
    view: 'dxSchedulerTimelineMonth',
    baseColSpan: 31,
}].forEach(({ viewName, view, baseColSpan }) => {
    const moduleConfig = {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();
            this.instance = $('#scheduler-work-space')[view]({})[view]('instance');
        },
        afterEach: function() {
            this.clock.restore();
        }
    };

    QUnit.module(`Base Workspace markup for ${viewName}`, moduleConfig, () => {
        if(viewName === 'Day' || viewName === 'Week') {
            QUnit.test('All day title should be rendered in header panel empty cell', function(assert) {
                const $element = this.instance.$element();
                const headerEmptyCell = $element.find(toSelector('dx-scheduler-header-panel-empty-cell'));

                assert.equal(headerEmptyCell.children(toSelector(ALL_DAY_TITLE_CLASS)).length, 1, 'All-day-title is OK');
            });

            QUnit.test('Workspace should have specific css class, if showAllDayPanel = true ', function(assert) {
                this.instance.option('showAllDayPanel', true);

                const $element = this.instance.$element();
                assert.ok($element.hasClass('dx-scheduler-work-space-all-day'), 'dxSchedulerWorkSpace has \'dx-scheduler-work-space-all-day\' css class');

                this.instance.option('showAllDayPanel', false);
                assert.notOk($element.hasClass('dx-scheduler-work-space-all-day'), 'dxSchedulerWorkSpace hasn\'t \'dx-scheduler-work-space-all-day\' css class');
            });

            QUnit.test('All day panel has specific class when allDayExpanded = true', function(assert) {
                this.instance.option('showAllDayPanel', true);
                this.instance.option('allDayExpanded', true);

                const $element = this.instance.$element();

                assert.notOk($element.hasClass('dx-scheduler-work-space-all-day-collapsed'), 'dxSchedulerWorkSpace has not \'dx-scheduler-work-space-all-day-collapsed\' css class');

                this.instance.option('allDayExpanded', false);

                assert.ok($element.hasClass('dx-scheduler-work-space-all-day-collapsed'), 'dxSchedulerWorkSpace has \'dx-scheduler-work-space-all-day-collapsed\' css class');
            });

            QUnit.test('Workspace should not has specific class when showAllDayPanel = false', function(assert) {
                this.instance.option('showAllDayPanel', false);
                this.instance.option('allDayExpanded', false);

                const $element = this.instance.$element();

                assert.notOk($element.hasClass('dx-scheduler-work-space-all-day-collapsed'), 'dxSchedulerWorkSpace has not \'dx-scheduler-work-space-all-day-collapsed\' css class');

                this.instance.option('showAllDayPanel', true);

                assert.ok($element.hasClass('dx-scheduler-work-space-all-day-collapsed'), 'dxSchedulerWorkSpace has \'dx-scheduler-work-space-all-day-collapsed\' css class');
            });

            QUnit.test('Scheduler workspace should contain time panel, header panel, allday panel and content', function(assert) {
                const $element = this.instance.$element();

                assert.equal($element.find(toSelector(HEADER_PANEL_CLASS)).length, 1, 'Workspace contains the time panel');
                assert.equal($element.find(toSelector(ALL_DAY_PANEL_CLASS)).length, 1, 'Workspace contains the all day panel');
                assert.equal($element.find(toSelector(TIME_PANEL_CLASS)).length, 1, 'Workspace contains the time panel');
                assert.equal($element.find(toSelector(DATE_TABLE_CLASS)).length, 1, 'Workspace contains date table');
            });

            QUnit.test('Time panel cells and rows should have special css classes', function(assert) {
                const $element = this.instance.$element();
                const $row = $element.find('.dx-scheduler-time-panel tr').first();
                const $cell = $row.find('td').first();

                assert.ok($row.hasClass('dx-scheduler-time-panel-row'), 'Css class of row is correct');
                assert.ok($cell.hasClass('dx-scheduler-time-panel-cell'), 'Css class of cell is correct');
                assert.ok($cell.hasClass(VERTICAL_SIZES_CLASS), 'Css class of cell is correct');
            });

            QUnit.test('All day panel row should have special css class', function(assert) {
                this.instance.option('showAllDayPanel', true);

                const $element = this.instance.$element();
                const $row = $element.find('.dx-scheduler-all-day-table tr').first();

                assert.ok($row.hasClass('dx-scheduler-all-day-table-row'), 'Css class of row is correct');
            });

            QUnit.test('All-day-appointments container should be rendered inside all-day-panael', function(assert) {
                const $element = this.instance.$element();

                assert.equal($element.find('.dx-scheduler-all-day-panel').children('.dx-scheduler-all-day-appointments').length, 1, 'Container is rendered correctly');
            });

            QUnit.test('Scheduler workspace day should have right groupedStrategy by default', function(assert) {
                assert.ok(this.instance._groupedStrategy instanceof SchedulerWorkSpaceHorizontalStrategy, 'Grouped strategy is right');
            });
        }

        QUnit.test('Scheduler workspace should be initialized', function(assert) {
            assert.ok(this.instance instanceof SchedulerWorkSpace, 'dxSchedulerWorkSpace was initialized');
        });

        QUnit.test('Scheduler workspace should have a right css class', function(assert) {
            const $element = this.instance.$element();
            assert.ok($element.hasClass(WORKSPACE_CLASS), 'dxSchedulerWorkSpace has \'dx-scheduler-workspace\' css class');
        });

        QUnit.test('Scheduler workspace with intervalCount should have a right css class', function(assert) {
            this.instance.option('intervalCount', 3);
            let $element = this.instance.$element();
            assert.ok($element.hasClass(WORKSPACE_WITH_COUNT_CLASS), 'dxSchedulerWorkSpace has right css class');

            this.instance.option('intervalCount', 1);
            $element = this.instance.$element();
            assert.notOk($element.hasClass(WORKSPACE_WITH_COUNT_CLASS), 'dxSchedulerWorkSpace has \'dx-scheduler-workspace\' css class');
        });

        QUnit.test('Scheduler workspace with groupByDate should have a right css class', function(assert) {
            this.instance.option('groupOrientation', 'vertical');

            let $element = this.instance.$element();

            assert.notOk($element.hasClass(WORKSPACE_WITH_GROUP_BY_DATE_CLASS), 'dxSchedulerWorkSpace hasn\'t right css class');

            this.instance.option('groups', [{
                name: 'one',
                items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
            }]);
            this.instance.option('groupByDate', true);
            $element = this.instance.$element();
            assert.notOk($element.hasClass(WORKSPACE_WITH_GROUP_BY_DATE_CLASS), 'dxSchedulerWorkSpace hasn\'t right css class');

            this.instance.option('groupOrientation', 'horizontal');
            $element = this.instance.$element();
            assert.ok($element.hasClass(WORKSPACE_WITH_GROUP_BY_DATE_CLASS), 'dxSchedulerWorkSpace right css class');
        });

        QUnit.test('Workspace should have specific css class, if hoursInterval = 0.5 ', function(assert) {
            this.instance.option('hoursInterval', 0.5);

            const $element = this.instance.$element();
            assert.ok($element.hasClass('dx-scheduler-work-space-odd-cells'), 'dxSchedulerWorkSpace has \'dx-scheduler-work-space-odd-cells\' css class');

            this.instance.option('hoursInterval', 0.75);
            assert.notOk($element.hasClass('dx-scheduler-work-space-odd-cells'), 'dxSchedulerWorkSpace hasn\'t \'dx-scheduler-work-space-odd-cells\' css class');
        });

        QUnit.test('Scheduler workspace parts should be wrapped by scrollable', function(assert) {
            const $element = this.instance.$element();

            assert.ok($element.find('.dx-scheduler-time-panel').parent().parent().hasClass('dx-scrollable-content'), 'Scrollable contains the time panel');
            assert.ok(
                $element.find('.dx-scheduler-date-table-container').parent().parent().hasClass('dx-scrollable-content'),
                'Scrollable contains date table',
            );
        });

        QUnit.test('Fixed appointments container should be rendered directly in workspace', function(assert) {
            const $element = this.instance.$element();

            assert.equal($element.children('.dx-scheduler-fixed-appointments').length, 1, 'Container is rendered correctly');
        });

        QUnit.test('Group header should be rendered if there are some groups', function(assert) {

            assert.equal(this.instance.$element().find('.dx-scheduler-group-header').length, 0, 'Groups are not rendered');

            this.instance.option('groups', [
                {
                    name: 'one',
                    items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                },
                {
                    name: 'two',
                    items: [{ id: 1, text: 'c' }, { id: 2, text: 'd' }, { id: 3, text: 'e' }]
                }
            ]);
            this.instance.option('groupOrientation', 'horizontal');
            this.instance.option('currentDate', new Date(2021, 0, 1));

            const rows = this.instance.$element().find('.dx-scheduler-header-panel .dx-scheduler-group-row');
            const firstRowCells = rows.eq(0).find('.dx-scheduler-group-header');
            const secondRowCells = rows.eq(1).find('.dx-scheduler-group-header');

            assert.equal(rows.length, 2, 'There are two group rows');

            assert.equal(firstRowCells.length, 2, 'The first group row contains two group headers');
            assert.equal(firstRowCells.attr('colspan'), `${3 * baseColSpan}`, 'Cells of the first group row have a right colspan attr');
            assert.equal(firstRowCells.eq(0).text(), 'a', 'Cell has a right text');
            assert.equal(firstRowCells.eq(1).text(), 'b', 'Cell has a right text');

            assert.equal(secondRowCells.length, 6, 'The second group row contains six group headers');

            assert.strictEqual(secondRowCells.attr('colspan'), `${baseColSpan}`, 'Cells of the second group row do not have colspan attr');

            assert.equal(secondRowCells.eq(0).text(), 'c', 'Cell has a right text');
            assert.equal(secondRowCells.eq(1).text(), 'd', 'Cell has a right text');
            assert.equal(secondRowCells.eq(2).text(), 'e', 'Cell has a right text');

            assert.equal(secondRowCells.eq(3).text(), 'c', 'Cell has a right text');
            assert.equal(secondRowCells.eq(4).text(), 'd', 'Cell has a right text');
            assert.equal(secondRowCells.eq(5).text(), 'e', 'Cell has a right text');
        });

        QUnit.test('Group header should be rendered if there is a single group', function(assert) {
            this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }] }]);

            const headers = this.instance.$element().find('.dx-scheduler-group-header');

            assert.equal(headers.length, 1, 'Group are rendered');
            assert.equal(headers.eq(0).text(), 'a', 'Group header text is right');
        });

        QUnit.test('Group header should contain group header content', function(assert) {
            this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }] }]);

            const header = this.instance.$element().find('.dx-scheduler-group-header');
            const headerContent = header.find('.dx-scheduler-group-header-content');

            assert.equal(headerContent.length, 1, 'Group header content is rendered');
        });
    });
});

const dayModuleConfig = {
    beforeEach: function() {
        this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceDay({}).dxSchedulerWorkSpaceDay('instance');
    }
};

QUnit.module('Workspace Day markup', dayModuleConfig, () => {
    QUnit.test('Scheduler workspace day should have a right css class', function(assert) {
        const $element = this.instance.$element();

        assert.ok($element.hasClass('dx-scheduler-work-space-day'), 'dxSchedulerWorkSpaceDay has \'dx-scheduler-workspace-day\' css class');
    });

    QUnit.test('Date table cells should have a special css classes', function(assert) {
        const $element = this.instance.$element();
        const classes = $element.find('.dx-scheduler-date-table td').attr('class').split(' ');

        assert.ok($.inArray(CELL_CLASS, classes) > -1, `Cell has the ${CELL_CLASS} class`);
        assert.notOk($.inArray(HORIZONTAL_SIZES_CLASS, classes) > -1, `Cell hasn't the ${HORIZONTAL_SIZES_CLASS} class`);
        assert.ok($.inArray(VERTICAL_SIZES_CLASS, classes) > -1, `Cell has the ${VERTICAL_SIZES_CLASS} class`);
    });

    QUnit.test('Scheduler all day panel should contain one row', function(assert) {
        this.instance.option('showAllDayPanel', true);

        const $allDayPanel = this.instance.$element().find('.dx-scheduler-all-day-panel');

        assert.equal($allDayPanel.find('tbody tr').length, 1, 'All day panel contains 1 row');
        assert.equal($allDayPanel.find('tbody tr>td').length, 1, 'All day panel contains 1 cell');
    });

    QUnit.test('Scheduler workspace date-table rows and cells should have correct css-class', function(assert) {
        const $element = this.instance.$element();
        const $dateTable = $element.find('.dx-scheduler-date-table');
        const $row = $dateTable.find('tr').first();
        const $cell = $row.find('td').first();

        assert.ok($row.hasClass('dx-scheduler-date-table-row'), 'Row class is correct');
        assert.ok($cell.hasClass('dx-scheduler-date-table-cell'), 'Cell class is correct');
    });

    QUnit.test('Scheduler workspace day view', function(assert) {
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

    QUnit.test('Scheduler workspace day grouped view', function(assert) {
        const $element = this.instance.$element();
        let cellCounter = 0;

        this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }]);

        assert.equal($element.find('.dx-scheduler-date-table tbody tr').length, 48, 'Date table has 48 rows');
        assert.equal($element.find('.dx-scheduler-date-table tbody tr>td').length, 96, 'Date table has 96 cells');

        $element.find('.dx-scheduler-date-table tbody tr').each(function() {
            if($(this).find('td').length === 2) {
                cellCounter++;
            }
        });

        assert.equal(cellCounter, 48, 'Each row has a two cells');
    });

    QUnit.test('Grouped cells should have a right group field in dxCellData', function(assert) {
        this.instance.option('renovateRender', false);

        const $element = this.instance.$element();

        this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }]);

        assert.deepEqual($element.find('.dx-scheduler-date-table tbody tr>td').eq(0).data('dxCellData').groups, {
            one: 1
        }, 'Cell group is OK');
        assert.deepEqual($element.find('.dx-scheduler-date-table tbody tr>td').eq(1).data('dxCellData').groups, { one: 2 }, 'Cell group is OK');
    });

    QUnit.test('Scheduler workspace day view should not contain a single header', function(assert) {
        const $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-header-row th').length, 0, 'Date table has not header cell');
    });

    [true, false].forEach((isRenovatedRender) => {
        QUnit.test('Scheduler workspace day grouped view should contain a few headers', function(assert) {
            const $element = this.instance.$element();

            this.instance.option('groups', [
                {
                    name: 'one',
                    items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                },
                {
                    name: 'two',
                    items: [{ id: 1, text: 'c' }, { id: 2, text: 'd' }]
                }
            ]);
            this.instance.option('renovateRender', isRenovatedRender);

            const lowerHeaderColspan = this.instance.option('renovateRender')
                ? '1' : undefined;

            assert.equal($element.find('.dx-scheduler-header-row th').length, 0, 'Date table has not header cell');
            assert.equal($element.find('.dx-scheduler-group-row').eq(0).find('th').attr('colspan'), '2', 'Group header has a right \'colspan\'');
            assert.strictEqual($element.find('.dx-scheduler-group-row').eq(1).find('th').attr('colspan'), lowerHeaderColspan, 'Group header has a right \'colspan\'');
        });
    });

    QUnit.test('Time panel should have 24 rows and 24 cells', function(assert) {
        checkRowsAndCells(this.instance.$element(), assert);
    });

    QUnit.test('Time panel should have 22 rows and 22 cells for hoursInterval = 1 & startDayHour = 2', function(assert) {
        this.instance.option({
            hoursInterval: 1,
            startDayHour: 2
        });

        checkRowsAndCells(this.instance.$element(), assert, 1, 2);
    });

    QUnit.test('Time panel should have right cell text when hoursInterval is fractional', function(assert) {
        this.instance.option({
            hoursInterval: 2.1666666666666665,
            endDayHour: 5
        });

        checkRowsAndCells(this.instance.$element(), assert, 2.1666666666666665, 0, 5);
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

    QUnit.test('WorkSpace Day view has right count of cells with view option intervalCount=2', function(assert) {
        this.instance.option('intervalCount', 2);

        let cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 2, 'view has right cell count');

        this.instance.option('intervalCount', 4);

        cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 4, 'view has right cell count');
    });
});

const dayWithGroupingModuleConfig = {
    beforeEach: function() {
        this.instance = $('#scheduler-work-space-grouped').dxSchedulerWorkSpaceDay({
            groupOrientation: 'vertical',
            showCurrentTimeIndicator: false,
            startDayHour: 8,
            showAllDayPanel: false,
            endDayHour: 20,
            groups: [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }],
        }).dxSchedulerWorkSpaceDay('instance');
    }
};

QUnit.module('Workspace Day markup with vertical grouping', dayWithGroupingModuleConfig, () => {
    QUnit.test('Scheduler workspace day should have a right css class', function(assert) {
        const $element = this.instance.$element();

        assert.ok($element.hasClass('dx-scheduler-work-space-vertical-grouped'), 'Workspace has \'dx-scheduler-work-space-vertical-grouped\' css class');
    });

    QUnit.test('Scheduler workspace day should have right groupedStrategy, groupOrientation = vertical', function(assert) {
        assert.ok(this.instance._groupedStrategy instanceof SchedulerWorkSpaceVerticalStrategy, 'Grouped strategy is right');
    });

    QUnit.test('Scheduler all day rows should be built into dateTable', function(assert) {
        this.instance.option('showAllDayPanel', true);

        const $allDayRows = this.instance.$element().find(toSelector(ALL_DAY_ROW_CLASS));

        assert.equal($allDayRows.length, 2, 'DateTable contains 2 allDay rows');
    });

    QUnit.test('Scheduler all day titles should be built into timePanel', function(assert) {
        this.instance.option('showAllDayPanel', true);

        const $timePanel = this.instance.$element().find(toSelector(TIME_PANEL_CLASS));
        const $allDayTitles = $timePanel.find(toSelector(ALL_DAY_TITLE_CLASS));

        assert.equal($allDayTitles.length, 2, 'TimePanel contains 2 allDay titles');
    });

    QUnit.test('Date table should have right group header', function(assert) {
        const $element = this.instance.$element();

        assert.equal($element.find('.' + VERTICAL_GROUP_TABLE_CLASS).length, 1, 'Group header is rendered');
    });

    QUnit.test('Date table should have right group header cells count', function(assert) {
        const $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-group-header').length, 2, 'Group header cells count is ok');
    });

    QUnit.test('Scheduler workspace Day should have a right rows count', function(assert) {
        const $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-date-table tbody tr').length, 48, 'Workspace has 48 rows');
    });

    QUnit.test('Time panel should have right rows count and cell text, even cells count', function(assert) {
        checkRowsAndCells(this.instance.$element(), assert, 0.5, 8, 20, 2);
    });

    QUnit.test('Time panel should have right rows count and cell text, odd cells count', function(assert) {
        this.instance.option({
            startDayHour: 9,
            endDayHour: 16,
            hoursInterval: 1
        });

        checkRowsAndCells(this.instance.$element(), assert, 1, 9, 16, 2);
    });

    QUnit.test('Time panel should have 48 rows and 48 cells', function(assert) {
        const $element = this.instance.$element();

        const cellCount = $element.find('.dx-scheduler-date-table tbody tr').length;

        assert.equal($element.find('.dx-scheduler-time-panel-row').length, cellCount, 'Time panel has a right count of rows');
        assert.equal($element.find('.dx-scheduler-time-panel-cell').length, cellCount, 'Time panel has a right count of cells');
    });

    QUnit.test('Grouped cells should have a right group field in dxCellData', function(assert) {
        this.instance.option('renovateRender', false);

        const $element = this.instance.$element();

        assert.deepEqual($element.find('.dx-scheduler-date-table tbody tr>td').eq(0).data('dxCellData').groups, {
            a: 1
        }, 'Cell group is OK');
        assert.deepEqual($element.find('.dx-scheduler-date-table tbody tr>td').eq(25).data('dxCellData').groups, { a: 2 }, 'Cell group is OK');
    });

    QUnit.test('Grouped allDay cells should have a right group field in dxCellData', function(assert) {
        this.instance.option('renovateRender', false);

        this.instance.option('showAllDayPanel', true);

        const $allDayCells = this.instance.$element().find(toSelector(ALL_DAY_TABLE_CELL_CLASS));

        assert.deepEqual($allDayCells.eq(0).data('dxCellData').groups, { a: 1 }, 'Cell group is OK');
        assert.deepEqual($allDayCells.eq(1).data('dxCellData').groups, { a: 2 }, 'Cell group is OK');
    });
});

const weekModuleConfig = {
    beforeEach: function() {
        this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWeek({
            showCurrentTimeIndicator: false,
        }).dxSchedulerWorkSpaceWeek('instance');
    }
};

QUnit.module('Workspace Week markup', weekModuleConfig, () => {
    QUnit.test('Scheduler workspace week should have a right css class', function(assert) {
        const $element = this.instance.$element();

        assert.ok($element.hasClass('dx-scheduler-work-space-week'), 'dxSchedulerWorkSpaceWeek has \'dx-scheduler-workspace-week\' css class');
    });

    QUnit.test('Header cells should have a special css classes', function(assert) {
        const $element = this.instance.$element();
        const classes = $element.find('.dx-scheduler-header-panel th').attr('class').split(' ');

        assert.ok($.inArray('dx-scheduler-header-panel-cell', classes) > -1, 'Cell has the dx-scheduler-header-panel-cell class');
        assert.notOk($.inArray(HORIZONTAL_SIZES_CLASS, classes) > -1, `Cell hasn't the ${HORIZONTAL_SIZES_CLASS} class`);
        assert.notOk($.inArray(VERTICAL_SIZES_CLASS, classes) > -1, `Cell hasn't the ${VERTICAL_SIZES_CLASS} class`);
    });

    QUnit.test('Scheduler all day panel should contain one row & 7 cells', function(assert) {
        this.instance.option('showAllDayPanel', true);

        const $allDayPanel = this.instance.$element().find('.dx-scheduler-all-day-panel');

        assert.equal($allDayPanel.find('tbody tr').length, 1, 'All day panel contains 1 row');
        assert.equal($allDayPanel.find('tbody tr>td').length, 7, 'All day panel contains 7 cell');
    });

    QUnit.test('Scheduler workspace week view', function(assert) {
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

    QUnit.test('Time panel should have 24 rows and 24 cells', function(assert) {
        this.instance.option('currentDate', new Date(1970, 0));
        checkRowsAndCells(this.instance.$element(), assert);
    });

    QUnit.test('Scheduler workspace week grouped view', function(assert) {
        const $element = this.instance.$element();
        let cellCounter = 0;

        this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }]);

        assert.equal($element.find('.dx-scheduler-date-table tbody tr').length, 48, 'Date table has 48 rows');
        assert.equal($element.find('.dx-scheduler-date-table tbody tr>td').length, 672, 'Date table has 672 cells');

        $element.find('.dx-scheduler-date-table tbody tr').each(function() {
            if($(this).find('td').length === 14) {
                cellCounter++;
            }
        });

        assert.equal(cellCounter, 48, 'Each row has a fourteen cells');
    });

    QUnit.test('Scheduler workspace week view should contain a 7 headers', function(assert) {
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

    QUnit.test('Scheduler workspace grouped week view should contain a few headers', function(assert) {
        const $element = this.instance.$element();

        this.instance.option('groups', [
            {
                name: 'one',
                items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
            },
            {
                name: 'two',
                items: [{ id: 1, text: 'c' }, { id: 2, text: 'd' }]
            }
        ]);

        const $headerCells = $element.find('.dx-scheduler-header-row th');

        assert.equal($headerCells.length, 28, 'Date table has 28 header cells');

        assert.equal($element.find('.dx-scheduler-group-row').eq(0).find('th').attr('colspan'), '14', 'Group header has a right \'colspan\'');
        assert.equal($element.find('.dx-scheduler-group-row').eq(1).find('th').attr('colspan'), '7', 'Group header has a right \'colspan\'');
    });

    QUnit.test('Group header should be rendered if there are some groups, groupByDate = true', function(assert) {

        assert.equal(this.instance.$element().find('.dx-scheduler-group-header').length, 0, 'Groups are not rendered');

        this.instance.option('groups', [
            {
                name: 'one',
                items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
            },
            {
                name: 'two',
                items: [{ id: 1, text: 'c' }, { id: 2, text: 'd' }, { id: 3, text: 'e' }]
            }
        ]);

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

    QUnit.test('Group row should be rendered before header row', function(assert) {
        this.instance.option('groups', [
            {
                name: 'one',
                items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
            }
        ]);
        const $element = this.instance.$element();
        const $groupRow = $element.find('.dx-scheduler-group-row');
        const $headerRow = $element.find('.dx-scheduler-header-row');

        assert.deepEqual($groupRow.next().get(0), $headerRow.get(0), 'Group row rendered correctly');
    });

    QUnit.test('WorkSpace Week view has right count of cells with view option intervalCount', function(assert) {
        this.instance.option('intervalCount', 2);

        let cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 7 * 2, 'view has right cell count');

        this.instance.option('intervalCount', 4);

        cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 7 * 4, 'view has right cell count');
    });
});

const weekWithGroupingModuleConfig = {
    beforeEach: function() {
        this.instance = $('#scheduler-work-space-grouped').dxSchedulerWorkSpaceWeek({
            groupOrientation: 'vertical',
            startDayHour: 8,
            showAllDayPanel: false,
            endDayHour: 20,
            groups: [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }],
        }).dxSchedulerWorkSpaceWeek('instance');
    }
};

QUnit.module('Workspace Week markup with vertical grouping', weekWithGroupingModuleConfig, () => {
    QUnit.test('Scheduler workspace day should have a right css class', function(assert) {
        const $element = this.instance.$element();

        assert.ok($element.hasClass('dx-scheduler-work-space-vertical-grouped'), 'Workspace has \'dx-scheduler-work-space-vertical-grouped\' css class');
    });

    QUnit.test('Scheduler workspace Week should have a right rows count', function(assert) {
        const $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-date-table tbody tr').length, 48, 'Workspace has 48 rows');
    });

    QUnit.test('Scheduler all day rows should be built into dateTable', function(assert) {
        this.instance.option('showAllDayPanel', true);

        const $allDayRows = this.instance.$element().find(toSelector(ALL_DAY_ROW_CLASS));

        assert.equal($allDayRows.length, 2, 'DateTable contains 2 allDay rows');
    });
    QUnit.test('Time panel should have right rows count and cell text', function(assert) {
        checkRowsAndCells(this.instance.$element(), assert, 0.5, 8, 20, 2);
    });

    QUnit.test('Grouped cells should have a right group field in dxCellData', function(assert) {
        this.instance.option('renovateRender', false);

        const $element = this.instance.$element();
        const $cells = $element.find('.dx-scheduler-date-table tbody tr>td');
        const cellCount = $cells.length;

        assert.deepEqual($cells.eq(0).data('dxCellData').groups, {
            a: 1
        }, 'Cell group is OK');
        assert.deepEqual($cells.eq(cellCount / 2).data('dxCellData').groups, { a: 2 }, 'Cell group is OK');
    });
});

const workWeekModuleConfig = {
    beforeEach: function() {
        this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWorkWeek({}).dxSchedulerWorkSpaceWorkWeek('instance');
    }
};

QUnit.module('Workspace Work Week markup', workWeekModuleConfig, () => {
    QUnit.test('Scheduler workspace work week should have a right css class', function(assert) {
        const $element = this.instance.$element();

        assert.ok($element.hasClass('dx-scheduler-work-space-work-week'), 'dxSchedulerWorkSpaceWorkWeek has \'dx-scheduler-workspace-work-week\' css class');
    });

    QUnit.test('Scheduler all day panel should contain one row & 5 cells', function(assert) {
        this.instance.option('showAllDayPanel', true);

        const $allDayPanel = this.instance.$element().find('.dx-scheduler-all-day-panel');

        assert.equal($allDayPanel.find('tbody tr').length, 1, 'All day panel contains 1 row');
        assert.equal($allDayPanel.find('tbody tr>td').length, 5, 'All day panel contains 5 cell');
    });

    QUnit.test('Scheduler workspace work week view', function(assert) {
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

    QUnit.test('Scheduler workspace work week grouped view', function(assert) {
        const $element = this.instance.$element();
        let cellCounter = 0;

        this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }]);

        assert.equal($element.find('.dx-scheduler-date-table tbody tr').length, 48, 'Date table has 48 rows');
        assert.equal($element.find('.dx-scheduler-date-table tbody tr>td').length, 480, 'Date table has 480 cells');

        $element.find('.dx-scheduler-date-table tbody tr').each(function() {
            if($(this).find('td').length === 10) {
                cellCounter++;
            }
        });

        assert.equal(cellCounter, 48, 'Each row has a ten cells');
    });

    QUnit.test('Scheduler workspace work week view should contain a 5 headers', function(assert) {
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

    QUnit.test('Scheduler workspace work week grouped view should contain a few headers', function(assert) {
        const $element = this.instance.$element();

        this.instance.option('groups', [
            {
                name: 'one',
                items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
            },
            {
                name: 'two',
                items: [{ id: 1, text: 'c' }, { id: 2, text: 'd' }]
            }
        ]);

        const $headerCells = $element.find('.dx-scheduler-header-row th');

        assert.equal($headerCells.length, 20, 'Date table has 20 header cells');
        assert.equal($element.find('.dx-scheduler-group-row').eq(0).find('th').attr('colspan'), '10', 'Group header has a right \'colspan\'');
        assert.equal($element.find('.dx-scheduler-group-row').eq(1).find('th').attr('colspan'), '5', 'Group header has a right \'colspan\'');
    });

    QUnit.test('Scheduler workspace work week view should be correct with any first day of week', function(assert) {
        const instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWorkWeek({
            firstDayOfWeek: 2,
            currentDate: new Date(2015, 1, 4)
        }).dxSchedulerWorkSpaceWorkWeek('instance');

        const $element = instance.$element();

        const $headerCells = $element.find('.dx-scheduler-header-row th');

        assert.equal($headerCells.first().text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[2].toLowerCase() + ' 3', 'first header has a right text');
        assert.equal($headerCells.eq(3).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[5].toLowerCase() + ' 6', '4 header has a right text');
        assert.equal($headerCells.last().text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[1].toLowerCase() + ' 9', 'last header has a right text');
    });

    QUnit.test('Scheduler workspace work week view should be correct, if currentDate is Sunday', function(assert) {
        const $element = this.instance.$element();

        this.instance.option('firstDayOfWeek', 0);
        this.instance.option('currentDate', new Date(2016, 0, 10));

        const $headerCells = $element.find('.dx-scheduler-header-row th');

        assert.equal($headerCells.first().text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[1].toLowerCase() + ' 11', 'first header has a right text');
        assert.equal($headerCells.eq(2).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[3].toLowerCase() + ' 13', '3 header has a right text');
        assert.equal($headerCells.last().text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[5].toLowerCase() + ' 15', 'last header has a right text');
    });

    QUnit.test('Scheduler workspace work week view should be correct with any first day of week, if currentDate is Sunday', function(assert) {
        const instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWorkWeek({
            currentDate: new Date(2016, 0, 10),
            firstDayOfWeek: 3
        }).dxSchedulerWorkSpaceWorkWeek('instance');

        const $element = instance.$element();

        const $headerCells = $element.find('.dx-scheduler-header-row th');

        assert.equal($headerCells.first().text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[3].toLowerCase() + ' 6', 'first header has a right text');
        assert.equal($headerCells.eq(2).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[5].toLowerCase() + ' 8', '3 header has a right text');
        assert.equal($headerCells.last().text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[2].toLowerCase() + ' 12', 'last header has a right text');
    });

    QUnit.test('Time panel should have 24 rows and 24 cells', function(assert) {
        checkRowsAndCells(this.instance.$element(), assert);
    });

    QUnit.test('WorkSpace WorkWeek view has right count of cells with view option intervalCount', function(assert) {
        this.instance.option('intervalCount', 2);

        let cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 5 * 2, 'view has right cell count');

        this.instance.option('intervalCount', 4);

        cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 5 * 4, 'view has right cell count');
    });

    QUnit.test('Workspace work week view should contain 15 headers if intervalCount=3', function(assert) {
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

    QUnit.test('Grouped Workspace work week view should contain right count of headers with view option intervalCount', function(assert) {
        this.instance.option({
            intervalCount: 2,
            firstDayOfWeek: 1,
            currentDate: new Date(2017, 5, 26)
        });

        const instance = this.instance;

        instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

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
        this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceMonth({}).dxSchedulerWorkSpaceMonth('instance');
    }
};

QUnit.module('Workspace Month markup', monthModuleConfig, () => {
    QUnit.test('Scheduler workspace month should have a right css class', function(assert) {
        const $element = this.instance.$element();

        assert.ok($element.hasClass('dx-scheduler-work-space-month'), 'dxSchedulerWorkSpaceMonth has \'dx-scheduler-workspace-month\' css class');
    });

    QUnit.test('Scheduler all day panel should not contain rows & cells', function(assert) {
        const $allDayPanel = this.instance.$element().find('.dx-scheduler-all-day-panel');

        assert.equal($allDayPanel.find('tbody tr').length, 0, 'All day panel does not contain rows');
    });

    QUnit.test('Scheduler time panel should not contain rows & cells', function(assert) {
        const $timePanel = this.instance.$element().find('.dx-scheduler-time-panel');

        assert.equal($timePanel.find('tbody tr').length, 0, 'Time panel does not contain rows');
    });

    QUnit.test('Scheduler workspace month view', function(assert) {
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

    QUnit.test('Scheduler workspace month grouped view', function(assert) {
        const $element = this.instance.$element();
        let cellCounter = 0;

        this.instance.option('currentDate', new Date(2015, 2, 5));
        this.instance.option('firstDayOfWeek', 1);

        this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }, { id: 3, text: 'c' }] }]);

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

    QUnit.test('Scheduler workspace month view should contain a 7 headers', function(assert) {
        const $element = this.instance.$element();

        const $headerCells = $element.find('.dx-scheduler-header-row th');

        assert.equal($headerCells.length, 7, 'Date table has 7 header cells');

        $headerCells.each(function(index, cell) {
            assert.equal($(cell).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[index % 7].toLowerCase(), 'Header has a right text');
        });
    });

    QUnit.test('Scheduler workspace month grouped view should contain a few headers', function(assert) {
        const $element = this.instance.$element();
        this.instance.option('groups', [
            {
                name: 'one',
                items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }, { id: 3, text: 'c' }]
            },
            {
                name: 'two',
                items: [{ id: 1, text: 'd' }, { id: 2, text: 'e' }, { id: 3, text: 'f' }]
            }
        ]);

        const $headerCells = $element.find('.dx-scheduler-header-row th');

        assert.equal($headerCells.length, 63, 'Date table has 63 header cells');
        assert.equal($element.find('.dx-scheduler-group-row').eq(0).find('th').attr('colspan'), 21, 'Group header has a right \'colspan\'');
        assert.equal($element.find('.dx-scheduler-group-row').eq(1).find('th').attr('colspan'), 7, 'Group header has a right \'colspan\'');
    });

    QUnit.test('Scheduler workspace month view should have a right date in each cell', function(assert) {
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

    QUnit.test('Scheduler workspace month view should have a right date in each cell, groupByDate = true', function(assert) {
        const $element = this.instance.$element();

        this.instance.option('groupByDate', true);
        this.instance.option('groups', [
            {
                name: 'one',
                items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }, { id: 3, text: 'c' }]
            }
        ]);
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

    QUnit.test('Scheduler workspace month view should have a date with current-date class', function(assert) {
        const $element = this.instance.$element();

        const currentDate = new Date();
        const $cell = $element.find('.dx-scheduler-date-table-current-date');

        this.instance.option('currentDate', currentDate);

        assert.equal(parseInt($cell.text(), 10), currentDate.getDate().toString(), 'Cell text is correct');
    });

    QUnit.test('Scheduler workspace month view should have a dates with other-month class', function(assert) {
        const $element = this.instance.$element();

        this.instance.option('currentDate', new Date(2015, 2, 1));

        const $cells = $element.find('.dx-scheduler-date-table-other-month');
        assert.equal($cells.length, 11, 'Other-month cells count is correct');
    });

    QUnit.test('Scheduler workspace month view should have a dates with other-month class, if startDate is set', function(assert) {
        const $element = this.instance.$element();

        this.instance.option('currentDate', new Date(2015, 2, 1));
        this.instance.option('startDate', new Date(2015, 5, 1));

        const $cells = $element.find('.dx-scheduler-date-table-other-month');
        assert.equal($cells.length, 11, 'Other-month cells count is correct');
    });

    QUnit.test('Scheduler workspace month view should have a dates with other-month class, if startDate & intervalCount is set', function(assert) {
        const $element = this.instance.$element();

        this.instance.option('currentDate', new Date(2015, 2, 1));
        this.instance.option('startDate', new Date(2015, 11, 1));
        this.instance.option('intervalCount', 3);

        const $cells = $element.find('.dx-scheduler-date-table-other-month');
        assert.equal($cells.length, 6, 'Other-month cells count is correct');
    });

    QUnit.test('Scheduler workspace should have a right first day of week', function(assert) {
        const $element = this.instance.$element();

        const days = dateLocalization.getDayNames('abbreviated');
        let firstCellHeader = $element.find('.dx-scheduler-header-panel thead tr>th').first().text();

        assert.equal(firstCellHeader.toLowerCase(), days[0].toLowerCase(), 'Workspace has a right first day of week by default');

        this.instance.option('firstDayOfWeek', 2);

        firstCellHeader = $element.find('.dx-scheduler-header-panel thead tr>th').first().text();

        assert.equal(firstCellHeader.toLowerCase(), days[this.instance.option('firstDayOfWeek')].toLowerCase(), 'Workspace has a right first day of week when option was changed');
    });

    QUnit.test('WorkSpace Month view has right count of rows with view option intervalCount', function(assert) {
        this.instance.option('currentDate', new Date(2023, 6, 1));
        this.instance.option('intervalCount', 2);

        let rows = this.instance.$element().find('.dx-scheduler-date-table-row');
        assert.equal(rows.length, 10, 'view has right rows count');

        this.instance.option('intervalCount', 4);

        rows = this.instance.$element().find('.dx-scheduler-date-table-row');
        assert.equal(rows.length, 19, 'view has right rows count');
    });

    QUnit.test('WorkSpace Month view has right count of cells with view option intervalCount', function(assert) {
        this.instance.option('currentDate', new Date(2023, 6, 1));
        this.instance.option('intervalCount', 2);

        const rows = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(rows.length, 7 * 10, 'view has right cells count');
    });

    QUnit.test('WorkSpace Month view with option intervalCount has cells with special firstDayOfMonth class', function(assert) {
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
    beforeEach: function() {
        this.instance = $('#scheduler-work-space-grouped').dxSchedulerWorkSpaceMonth({
            groupOrientation: 'vertical',
            startDayHour: 8,
            showAllDayPanel: false,
            endDayHour: 20,
            groups: [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }],
        }).dxSchedulerWorkSpaceMonth('instance');
    }
};

QUnit.module('Workspace Month markup with vertical grouping', monthWithGroupingModuleConfig, () => {
    QUnit.test('Scheduler workspace day should have a right css class', function(assert) {
        const $element = this.instance.$element();

        assert.ok($element.hasClass('dx-scheduler-work-space-vertical-grouped'), 'Workspace has \'dx-scheduler-work-space-vertical-grouped\' css class');
    });

    QUnit.test('Workspace Month markup should contain three scrollable elements', function(assert) {
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

    QUnit.test('Date table scrollable should have right config with vertical grouping', function(assert) {
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

    QUnit.test('Sidebar scrollable should contain group table', function(assert) {
        const $sidebarScrollable = this.instance.$element().find('.dx-scheduler-sidebar-scrollable');

        assert.equal($sidebarScrollable.find('.dx-scheduler-group-header').length, 2, 'Group header cells count is ok');
    });

    QUnit.test('Scheduler workspace month should have correct rows and cells count', function(assert) {
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

    QUnit.test('Grouped cells should have a right group field in dxCellData', function(assert) {
        this.instance.option('renovateRender', false);

        const $element = this.instance.$element();
        const $cells = $element.find('.dx-scheduler-date-table tbody tr>td');
        const cellCount = $cells.length;

        assert.deepEqual($cells.eq(0).data('dxCellData').groups, {
            a: 1
        }, 'Cell group is OK');
        assert.deepEqual($cells.eq(cellCount / 2).data('dxCellData').groups, { a: 2 }, 'Cell group is OK');
    });

    QUnit.test('Scheduler workspace month view should have a dates with other-month class', function(assert) {
        const $element = this.instance.$element();

        this.instance.option('currentDate', new Date(2015, 2, 1));

        const $cells = $element.find('.dx-scheduler-date-table-other-month');
        assert.equal($cells.length, 22, 'Other-month cells count is correct');
    });

    QUnit.test('Scheduler workspace month view should have a dates text', function(assert) {
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

    QUnit.test('Date table should have right group header', function(assert) {
        const $element = this.instance.$element();

        assert.equal($element.find('.' + VERTICAL_GROUP_TABLE_CLASS).length, 1, 'Group header is rendered');
    });

    QUnit.test('Date table should have right group header cells count', function(assert) {
        const $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-group-header').length, 2, 'Group header cells count is ok');
    });
});

const scrollingModuleConfig = {
    beforeEach: function() {
        this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWeek({
            crossScrollingEnabled: true,
            width: 100,
        }).dxSchedulerWorkSpaceWeek('instance');
    }
};

QUnit.module('Workspace with crossScrollingEnabled markup', scrollingModuleConfig, () => {
    QUnit.test('Workspace should have correct class', function(assert) {
        assert.ok(this.instance.$element().hasClass('dx-scheduler-work-space-both-scrollbar'), 'CSS class is OK');
        this.instance.option('crossScrollingEnabled', false);
        assert.notOk(this.instance.$element().hasClass('dx-scheduler-work-space-both-scrollbar'), 'CSS class is OK');
    });

    QUnit.test('Three scrollable elements should be rendered', function(assert) {
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

    QUnit.test('Time panel scrollable should contain time panel', function(assert) {
        const timePanelScrollable = this.instance.$element().find('.dx-scheduler-sidebar-scrollable').dxScrollable('instance');
        const scrollableContent = timePanelScrollable.$content();

        assert.equal(scrollableContent.find('.dx-scheduler-time-panel').length, 1, 'Time panel exists');
    });

    QUnit.test('Header scrollable should have right config', function(assert) {
        const headerScrollable = this.instance.$element().find('.dx-scheduler-header-scrollable').dxScrollable('instance');

        assert.equal(headerScrollable.option('direction'), 'horizontal', 'Direction is OK');
        assert.strictEqual(headerScrollable.option('showScrollbar'), 'never', 'showScrollbar is OK');
        assert.strictEqual(headerScrollable.option('bounceEnabled'), false, 'bounceEnabled is OK');
        assert.strictEqual(headerScrollable.option('updateManually'), true, 'updateManually is OK');
    });

    QUnit.test('Time panel scrollable should have right config', function(assert) {
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

    [true, false].forEach((isRenovatedRender) => {
        const moduleName = isRenovatedRender
            ? 'Renovated Render'
            : 'Non-Renovated Render';

        const groupClassesModuleConfig = {
            beforeEach: function() {
                this.createInstance = (workspaceClass, options = {}) => {
                    const instance = $('#scheduler-work-space')[workspaceClass]({
                        intervalCount: 3,
                        renovateRender: isRenovatedRender,
                        startDayHour: 0,
                        endDayHour: 2,
                        currentDate: new Date(2020, 8, 27),
                        groupOrientation: 'horizontal',
                        ...options,
                    })[workspaceClass]('instance');

                    return instance;
                };
            }
        };

        QUnit.module(moduleName, groupClassesModuleConfig, () => {
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
                QUnit.test(`first-group-cell class should be assigned to correct cells in basic case in ${view.name}`, function(assert) {
                    const instance = this.createInstance(view.class);

                    instance.$element().find(toSelector(CELL_CLASS)).each(function(index) {
                        checkFirstGroupCell(assert, this, index, columnCountInGroup, 'Date table');
                    });

                    instance.$element().find(toSelector(ALL_DAY_TABLE_CELL_CLASS)).each(function(index) {
                        checkFirstGroupCell(assert, this, index, columnCountInGroup, 'All-day panel');
                    });

                    instance.$element().find(toSelector(TIME_PANEL_CELL_CLASS)).each(function() {
                        assert.notOk($(this).hasClass(FIRST_GROUP_CELL_CLASS), 'Time panel cell does not have first-group class');
                    });

                    instance.$element().find(toSelector(HEADER_PANEL_CELL_CLASS)).each(function(index) {
                        checkFirstGroupCell(assert, this, index, columnCountInGroup, 'Header panel');
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

                    instance.$element().find(toSelector(ALL_DAY_TABLE_CELL_CLASS)).each(function(index) {
                        checkFirstGroupCell(assert, this, index, columnCountInGroup, 'All-day panel');
                    });

                    instance.$element().find(toSelector(TIME_PANEL_CELL_CLASS)).each(function() {
                        assert.notOk($(this).hasClass(FIRST_GROUP_CELL_CLASS), 'Time panel cell does not have first-group class');
                    });

                    instance.$element().find(toSelector(HEADER_PANEL_CELL_CLASS)).each(function(index) {
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

                    instance.$element().find(toSelector(ALL_DAY_TABLE_CELL_CLASS)).each(function(index) {
                        checkFirstGroupCell(assert, this, index, GROUP_COUNT, 'All-day panel');
                    });

                    instance.$element().find(toSelector(TIME_PANEL_CELL_CLASS)).each(function() {
                        assert.notOk($(this).hasClass(FIRST_GROUP_CELL_CLASS), 'Time panel cell does not have first-group class');
                    });

                    instance.$element().find(toSelector(HEADER_PANEL_CELL_CLASS)).each(function(index) {
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

                    instance.$element().find(toSelector(ALL_DAY_TABLE_CELL_CLASS)).each(function() {
                        assert.notOk($(this).hasClass(FIRST_GROUP_CELL_CLASS), 'All-day panel cell does not have first-group class');
                    });

                    instance.$element().find(toSelector(TIME_PANEL_CELL_CLASS)).each(function(index) {
                        if(index % rowCountInGroup === 0) {
                            assert.ok($(this).hasClass(FIRST_GROUP_CELL_CLASS), 'Time panel cell has first-group class');
                        } else {
                            assert.notOk($(this).hasClass(FIRST_GROUP_CELL_CLASS), 'Time panel cell does not have first-group class');
                        }
                    });

                    instance.$element().find(toSelector(HEADER_PANEL_CELL_CLASS)).each(function() {
                        assert.notOk($(this).hasClass(FIRST_GROUP_CELL_CLASS), 'Header panel cell does not have first-group class');
                    });
                });

                QUnit.test(`last-group-cell class should be assigned to correct cells in basic case in ${view.name}`, function(assert) {
                    const instance = this.createInstance(view.class);

                    instance.$element().find(toSelector(CELL_CLASS)).each(function(index) {
                        checkLastGroupCell(assert, this, index, columnCountInGroup, 'Date table');
                    });

                    instance.$element().find(toSelector(ALL_DAY_TABLE_CELL_CLASS)).each(function(index) {
                        checkLastGroupCell(assert, this, index, columnCountInGroup, 'All-day panel');
                    });

                    instance.$element().find(toSelector(TIME_PANEL_CELL_CLASS)).each(function() {
                        assert.notOk($(this).hasClass(LAST_GROUP_CELL_CLASS), 'Time panel cell does not have last-group class');
                    });

                    instance.$element().find(toSelector(HEADER_PANEL_CELL_CLASS)).each(function(index) {
                        checkLastGroupCell(assert, this, index, columnCountInGroup, 'Header panel');
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

                    instance.$element().find(toSelector(ALL_DAY_TABLE_CELL_CLASS)).each(function(index) {
                        checkLastGroupCell(assert, this, index, columnCountInGroup, 'All-day panel');
                    });

                    instance.$element().find(toSelector(TIME_PANEL_CELL_CLASS)).each(function() {
                        assert.notOk($(this).hasClass(LAST_GROUP_CELL_CLASS), 'Time panel cell does not have last-group class');
                    });

                    instance.$element().find(toSelector(HEADER_PANEL_CELL_CLASS)).each(function(index) {
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

                    instance.$element().find(toSelector(ALL_DAY_TABLE_CELL_CLASS)).each(function(index) {
                        checkLastGroupCell(assert, this, index, GROUP_COUNT, 'All-day panel');
                    });

                    instance.$element().find(toSelector(TIME_PANEL_CELL_CLASS)).each(function() {
                        assert.notOk($(this).hasClass(LAST_GROUP_CELL_CLASS), 'Time panel cell does not have last-group class');
                    });

                    instance.$element().find(toSelector(HEADER_PANEL_CELL_CLASS)).each(function() {
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

                    instance.$element().find(toSelector(ALL_DAY_TABLE_CELL_CLASS)).each(function() {
                        assert.notOk($(this).hasClass(LAST_GROUP_CELL_CLASS), 'All-day panel cell does not have last-group class');
                    });

                    instance.$element().find(toSelector(TIME_PANEL_CELL_CLASS)).each(function(index) {
                        if((index + 1) % rowCountInGroup === 0) {
                            assert.ok($(this).hasClass(LAST_GROUP_CELL_CLASS), 'Time panel cell has last-group class');
                        } else {
                            assert.notOk($(this).hasClass(LAST_GROUP_CELL_CLASS), 'Time panel cell does not have last-group class');
                        }
                    });

                    instance.$element().find(toSelector(HEADER_PANEL_CELL_CLASS)).each(function() {
                        assert.notOk($(this).hasClass(LAST_GROUP_CELL_CLASS), 'Header panel cell does not have last-group class');
                    });
                });
            });
        });
    });
});
