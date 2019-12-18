import $ from 'jquery';
import SchedulerWorkSpace from 'ui/scheduler/workspaces/ui.scheduler.work_space';
import SchedulerWorkSpaceHorizontalStrategy from 'ui/scheduler/workspaces/ui.scheduler.work_space.grouped.strategy.horizontal';
import SchedulerWorkSpaceVerticalStrategy from 'ui/scheduler/workspaces/ui.scheduler.work_space.grouped.strategy.vertical';
import SchedulerResourcesManager from 'ui/scheduler/ui.scheduler.resource_manager';
import dateLocalization from 'localization/date';
import devices from 'core/devices';
import 'ui/scheduler/ui.scheduler';

QUnit.testStart(() => {
    const markup =
        '<div id="scheduler-work-space">\
        <div id="scheduler-work-space-grouped">';

    $('#qunit-fixture').html(markup);
});

const WORKSPACE_CLASS = 'dx-scheduler-work-space',
    WORKSPACE_WITH_COUNT_CLASS = 'dx-scheduler-work-space-count',
    WORKSPACE_WITH_GROUP_BY_DATE_CLASS = 'dx-scheduler-work-space-group-by-date',
    HEADER_PANEL_CLASS = 'dx-scheduler-header-panel',
    ALL_DAY_PANEL_CLASS = 'dx-scheduler-all-day-panel',
    ALL_DAY_TABLE_CELL_CLASS = 'dx-scheduler-all-day-table-cell',
    ALL_DAY_ROW_CLASS = 'dx-scheduler-all-day-table-row',
    TIME_PANEL_CLASS = 'dx-scheduler-time-panel',
    DATE_TABLE_CLASS = 'dx-scheduler-date-table',
    ALL_DAY_TITLE_CLASS = 'dx-scheduler-all-day-title',

    VERTICAL_GROUP_TABLE_CLASS = 'dx-scheduler-work-space-vertical-group-table',

    CELL_CLASS = 'dx-scheduler-date-table-cell',
    HORIZONTAL_SIZES_CLASS = 'dx-scheduler-cell-sizes-horizontal',
    VERTICAL_SIZES_CLASS = 'dx-scheduler-cell-sizes-vertical';

const toSelector = cssClass => '.' + cssClass;

const stubInvokeMethod = function(instance, options) {
    options = options || {};
    sinon.stub(instance, 'invoke', function() {
        const subscribe = arguments[0];
        if(subscribe === 'createResourcesTree') {
            return new SchedulerResourcesManager().createResourcesTree(arguments[1]);
        }
        if(subscribe === 'getResourceTreeLeaves') {
            const resources = instance.resources || [{ field: 'one', dataSource: [{ id: 1 }, { id: 2 }] }];
            return new SchedulerResourcesManager(resources).getResourceTreeLeaves(arguments[1], arguments[2]);
        }
        if(subscribe === 'getTimezone') {
            return options.tz || 3;
        }
        if(subscribe === 'getTimezoneOffset') {
            return -180 * 60000;
        }
        if(subscribe === 'convertDateByTimezone') {
            let date = new Date(arguments[1]);

            const tz = options.tz;

            if(tz) {
                const tzOffset = new Date().getTimezoneOffset() * 60000,
                    dateInUTC = date.getTime() + tzOffset;

                date = new Date(dateInUTC + (tz * 3600000));
            }

            return date;
        }
    });
};

const checkRowsAndCells = function($element, assert, interval, start, end, groupCount) {
    interval = interval || 0.5;
    start = start || 0;
    end = end || 24;
    groupCount = groupCount || 1;

    const cellCount = (end - start) / interval,
        cellDuration = 3600000 * interval;

    const cellCountInGroup = cellCount;
    assert.equal($element.find('.dx-scheduler-time-panel-row').length, Math.ceil(cellCount * groupCount), 'Time panel has a right count of rows');
    assert.equal($element.find('.dx-scheduler-time-panel-cell').length, Math.ceil(cellCount * groupCount), 'Time panel has a right count of cells');

    $element.find('.dx-scheduler-time-panel-cell').each(function(index) {
        let time;
        let cellIndex = index % cellCountInGroup;

        if(cellIndex % 2 === 0) {
            time = dateLocalization.format(new Date(new Date(1970, 0).getTime() + Math.round(cellDuration) * cellIndex + start * 3600000), 'shorttime');
        } else {
            time = '';
        }
        assert.equal($(this).text(), time, 'Time is OK');
    });
};

const moduleConfig = {
    beforeEach: () =>{
        this.instance = $('#scheduler-work-space').dxSchedulerWorkSpace().dxSchedulerWorkSpace('instance');
    }
};

QUnit.module('Workspace markup', moduleConfig, () => {
    QUnit.test('Scheduler workspace should be initialized', (assert) => {
        assert.ok(this.instance instanceof SchedulerWorkSpace, 'dxSchedulerWorkSpace was initialized');
    });

    QUnit.test('Scheduler workspace day should have right groupedStrategy by default', (assert) => {
        assert.ok(this.instance._groupedStrategy instanceof SchedulerWorkSpaceHorizontalStrategy, 'Grouped strategy is right');
    });

    QUnit.test('Scheduler workspace should have a right css class', (assert) => {
        const $element = this.instance.$element();
        assert.ok($element.hasClass(WORKSPACE_CLASS), 'dxSchedulerWorkSpace has \'dx-scheduler-workspace\' css class');
    });

    QUnit.test('Scheduler workspace with intervalCount should have a right css class', (assert) => {
        this.instance.option('intervalCount', 3);
        let $element = this.instance.$element();
        assert.ok($element.hasClass(WORKSPACE_WITH_COUNT_CLASS), 'dxSchedulerWorkSpace has right css class');

        this.instance.option('intervalCount', 1);
        $element = this.instance.$element();
        assert.notOk($element.hasClass(WORKSPACE_WITH_COUNT_CLASS), 'dxSchedulerWorkSpace has \'dx-scheduler-workspace\' css class');
    });

    QUnit.test('Scheduler workspace with groupByDate should have a right css class', (assert) => {
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

    QUnit.test('Scheduler workspace should contain time panel, header panel, allday panel and content', (assert) => {
        const $element = this.instance.$element();

        assert.equal($element.find(toSelector(HEADER_PANEL_CLASS)).length, 1, 'Workspace contains the time panel');
        assert.equal($element.find(toSelector(ALL_DAY_PANEL_CLASS)).length, 1, 'Workspace contains the all day panel');
        assert.equal($element.find(toSelector(TIME_PANEL_CLASS)).length, 1, 'Workspace contains the time panel');
        assert.equal($element.find(toSelector(DATE_TABLE_CLASS)).length, 1, 'Workspace contains date table');
    });

    QUnit.test('All day title should be rendered in workspace directly', (assert) => {
        const $element = this.instance.$element();

        assert.equal($element.children(toSelector(ALL_DAY_TITLE_CLASS)).length, 1, 'All-day-title is OK');
    });

    QUnit.test('All day title has a special CSS class, if showAllDayPanel = false', (assert) => {
        this.instance.option('showAllDayPanel', false);

        const $element = this.instance.$element(),
            $allDayTitle = $element.find('.dx-scheduler-all-day-title');

        assert.ok($allDayTitle.hasClass('dx-scheduler-all-day-title-hidden'), 'CSS class is OK');

        this.instance.option('showAllDayPanel', true);

        assert.notOk($allDayTitle.hasClass('dx-scheduler-all-day-title-hidden'), 'CSS class is OK');
    });

    QUnit.test('Workspace should have specific css class, if showAllDayPanel = true ', (assert) => {
        this.instance.option('showAllDayPanel', true);

        const $element = this.instance.$element();
        assert.ok($element.hasClass('dx-scheduler-work-space-all-day'), 'dxSchedulerWorkSpace has \'dx-scheduler-work-space-all-day\' css class');

        this.instance.option('showAllDayPanel', false);
        assert.notOk($element.hasClass('dx-scheduler-work-space-all-day'), 'dxSchedulerWorkSpace hasn\'t \'dx-scheduler-work-space-all-day\' css class');
    });

    QUnit.test('Workspace should have specific css class, if hoursInterval = 0.5 ', (assert) => {
        this.instance.option('hoursInterval', 0.5);

        const $element = this.instance.$element();
        assert.ok($element.hasClass('dx-scheduler-work-space-odd-cells'), 'dxSchedulerWorkSpace has \'dx-scheduler-work-space-odd-cells\' css class');

        this.instance.option('hoursInterval', 0.75);
        assert.notOk($element.hasClass('dx-scheduler-work-space-odd-cells'), 'dxSchedulerWorkSpace hasn\'t \'dx-scheduler-work-space-odd-cells\' css class');
    });

    QUnit.test('All day panel has specific class when allDayExpanded = true', (assert) => {
        this.instance.option('showAllDayPanel', true);
        this.instance.option('allDayExpanded', true);

        const $element = this.instance.$element();

        assert.notOk($element.hasClass('dx-scheduler-work-space-all-day-collapsed'), 'dxSchedulerWorkSpace has not \'dx-scheduler-work-space-all-day-collapsed\' css class');

        this.instance.option('allDayExpanded', false);

        assert.ok($element.hasClass('dx-scheduler-work-space-all-day-collapsed'), 'dxSchedulerWorkSpace has \'dx-scheduler-work-space-all-day-collapsed\' css class');
    });

    QUnit.test('Workspace should not has specific class when showAllDayPanel = false', (assert) => {
        this.instance.option('showAllDayPanel', false);
        this.instance.option('allDayExpanded', false);

        const $element = this.instance.$element();

        assert.notOk($element.hasClass('dx-scheduler-work-space-all-day-collapsed'), 'dxSchedulerWorkSpace has not \'dx-scheduler-work-space-all-day-collapsed\' css class');

        this.instance.option('showAllDayPanel', true);

        assert.ok($element.hasClass('dx-scheduler-work-space-all-day-collapsed'), 'dxSchedulerWorkSpace has \'dx-scheduler-work-space-all-day-collapsed\' css class');
    });

    QUnit.test('Scheduler workspace parts should be wrapped by scrollable', (assert) => {
        const $element = this.instance.$element();

        assert.ok($element.find('.dx-scheduler-time-panel').parent().hasClass('dx-scrollable-content'), 'Scrollable contains the time panel');
        assert.ok($element.find('.dx-scheduler-date-table').parent().hasClass('dx-scrollable-content'), 'Scrollable contains date table');
    });

    QUnit.test('Time panel cells and rows should have special css classes', (assert) => {
        const $element = this.instance.$element(),
            $row = $element.find('.dx-scheduler-time-panel tr').first(),
            $cell = $row.find('td').first();

        assert.ok($row.hasClass('dx-scheduler-time-panel-row'), 'Css class of row is correct');
        assert.ok($cell.hasClass('dx-scheduler-time-panel-cell'), 'Css class of cell is correct');
        assert.ok($cell.hasClass(VERTICAL_SIZES_CLASS), 'Css class of cell is correct');
    });

    QUnit.test('All day panel row should have special css class', (assert) => {
        this.instance.option('showAllDayPanel', true);

        const $element = this.instance.$element(),
            $row = $element.find('.dx-scheduler-all-day-table tr').first();

        assert.ok($row.hasClass('dx-scheduler-all-day-table-row'), 'Css class of row is correct');
    });

    QUnit.test('All-day-appointments container should be rendered directly in workspace', (assert) => {
        const $element = this.instance.$element();

        assert.equal($element.children('.dx-scheduler-all-day-appointments').length, 1, 'Container is rendered correctly');
    });

    QUnit.test('Fixed appointments container should be rendered directly in workspace', (assert) => {
        const $element = this.instance.$element();

        assert.equal($element.children('.dx-scheduler-fixed-appointments').length, 1, 'Container is rendered correctly');
    });

    QUnit.test('Work space should have \'grouped\' class & group row count attr if there are some groups', (assert) => {
        assert.ok(!this.instance.$element().hasClass('dx-scheduler-work-space-grouped'), '\'grouped\' class is not applied');

        this.instance.option('groups', [{
            name: 'one',
            items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
        }]);

        assert.ok(this.instance.$element().hasClass('dx-scheduler-work-space-grouped'), '\'grouped\' class is applied');
        assert.equal(this.instance.$element().attr('dx-group-row-count'), 1, '\'dx-group-row-count\' is right');

        this.instance.option('groups', []);
        assert.ok(!this.instance.$element().hasClass('dx-scheduler-work-space-grouped'), '\'grouped\' class is not applied');
        assert.notOk(this.instance.$element().attr('dx-group-row-count'), '\'dx-group-row-count\' isn\'t applied');
    });

    QUnit.test('Work space should not have \'grouped\' class & group row count attr if groups exist but empty(T381796)', (assert) => {
        assert.ok(!this.instance.$element().hasClass('dx-scheduler-work-space-grouped'), '\'grouped\' class is not applied');

        this.instance.option('groups', [{
            name: 'one',
            items: []
        }]);

        assert.notOk(this.instance.$element().hasClass('dx-scheduler-work-space-grouped'), '\'grouped\' class isn\'t applied');
        assert.notOk(this.instance.$element().attr('dx-group-row-count'), '\'dx-group-row-count\' isn\'t applied');
    });

    QUnit.test('Group header should be rendered if there are some groups', (assert) => {

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

        const rows = this.instance.$element().find('.dx-scheduler-group-row'),
            firstRowCells = rows.eq(0).find('.dx-scheduler-group-header'),
            secondRowCells = rows.eq(1).find('.dx-scheduler-group-header');

        assert.equal(rows.length, 2, 'There are two group rows');
        assert.equal(this.instance.$element().attr('dx-group-row-count'), 2, '\'dx-group-row-count\' is right');

        assert.equal(firstRowCells.length, 2, 'The first group row contains two group headers');
        assert.equal(firstRowCells.attr('colspan'), '3', 'Cells of the first group row have a right colspan attr');
        assert.equal(firstRowCells.eq(0).text(), 'a', 'Cell has a right text');
        assert.equal(firstRowCells.eq(1).text(), 'b', 'Cell has a right text');

        assert.equal(secondRowCells.length, 6, 'The second group row contains six group headers');

        assert.strictEqual(secondRowCells.attr('colspan'), undefined, 'Cells of the second group row do not have colspan attr');

        assert.equal(secondRowCells.eq(0).text(), 'c', 'Cell has a right text');
        assert.equal(secondRowCells.eq(1).text(), 'd', 'Cell has a right text');
        assert.equal(secondRowCells.eq(2).text(), 'e', 'Cell has a right text');

        assert.equal(secondRowCells.eq(3).text(), 'c', 'Cell has a right text');
        assert.equal(secondRowCells.eq(4).text(), 'd', 'Cell has a right text');
        assert.equal(secondRowCells.eq(5).text(), 'e', 'Cell has a right text');
    });

    QUnit.test('Group header should be rendered if there is a single group', (assert) => {
        this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }] }]);

        const headers = this.instance.$element().find('.dx-scheduler-group-header');

        assert.equal(headers.length, 1, 'Group are rendered');
        assert.equal(headers.eq(0).text(), 'a', 'Group header text is right');
    });

    QUnit.test('Group header should contain group header content', (assert) => {
        this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }] }]);

        const header = this.instance.$element().find('.dx-scheduler-group-header'),
            headerContent = header.find('.dx-scheduler-group-header-content');

        assert.equal(headerContent.length, 1, 'Group header content is rendered');
    });
});


const dayModuleConfig = {
    beforeEach: () => {
        this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceDay().dxSchedulerWorkSpaceDay('instance');
        stubInvokeMethod(this.instance);
    }
};

QUnit.module('Workspace Day markup', dayModuleConfig, () => {
    QUnit.test('Scheduler workspace day should have a right css class', (assert) => {
        const $element = this.instance.$element();

        assert.ok($element.hasClass('dx-scheduler-work-space-day'), 'dxSchedulerWorkSpaceDay has \'dx-scheduler-workspace-day\' css class');
    });

    QUnit.test('Date table cells should have a special css classes', (assert) => {
        const $element = this.instance.$element(),
            classes = $element.find('.dx-scheduler-date-table td').attr('class').split(' ');

        assert.ok($.inArray(CELL_CLASS, classes) > -1, 'Cell has a css class');
        assert.ok($.inArray(HORIZONTAL_SIZES_CLASS, classes) > -1, 'Cell has a css class');
        assert.ok($.inArray(VERTICAL_SIZES_CLASS, classes) > -1, 'Cell has a css class');
    });

    QUnit.test('Scheduler all day panel should contain one row', (assert) => {
        this.instance.option('showAllDayPanel', true);

        const $allDayPanel = this.instance.$element().find('.dx-scheduler-all-day-panel');

        assert.equal($allDayPanel.find('tbody tr').length, 1, 'All day panel contains 1 row');
        assert.equal($allDayPanel.find('tbody tr>td').length, 1, 'All day panel contains 1 cell');
    });

    QUnit.test('Scheduler workspace date-table rows and cells should have correct css-class', (assert) => {
        const $element = this.instance.$element(),
            $dateTable = $element.find('.dx-scheduler-date-table'),
            $row = $dateTable.find('tr').first(),
            $cell = $row.find('td').first();

        assert.ok($row.hasClass('dx-scheduler-date-table-row'), 'Row class is correct');
        assert.ok($cell.hasClass('dx-scheduler-date-table-cell'), 'Cell class is correct');
    });

    QUnit.test('Scheduler workspace day view', (assert) => {
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

    QUnit.test('Scheduler workspace day grouped view', (assert) => {
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

    QUnit.test('Grouped cells should have a right group field in dxCellData', (assert) => {
        const $element = this.instance.$element();

        this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }]);

        assert.deepEqual($element.find('.dx-scheduler-date-table tbody tr>td').eq(0).data('dxCellData').groups, {
            one: 1
        }, 'Cell group is OK');
        assert.deepEqual($element.find('.dx-scheduler-date-table tbody tr>td').eq(1).data('dxCellData').groups, { one: 2 }, 'Cell group is OK');
    });

    QUnit.test('Scheduler workspace day view should not contain a single header', (assert) => {
        const $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-header-row th').length, 0, 'Date table has not header cell');
    });

    QUnit.test('Scheduler workspace day grouped view should contain a few headers', (assert) => {
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

        assert.equal($element.find('.dx-scheduler-header-row th').length, 0, 'Date table has not header cell');
        assert.equal($element.find('.dx-scheduler-group-row').eq(0).find('th').attr('colspan'), '2', 'Group header has a right \'colspan\'');
        assert.strictEqual($element.find('.dx-scheduler-group-row').eq(1).find('th').attr('colspan'), undefined, 'Group header has a right \'colspan\'');
    });

    QUnit.test('Time panel should have 24 rows and 24 cells', (assert) => {
        checkRowsAndCells(this.instance.$element(), assert);
    });

    QUnit.test('Time panel should have 22 rows and 22 cells for hoursInterval = 1 & startDayHour = 2', (assert) => {
        this.instance.option({
            hoursInterval: 1,
            startDayHour: 2
        });

        checkRowsAndCells(this.instance.$element(), assert, 1, 2);
    });

    QUnit.test('Time panel should have right cell text when hoursInterval is fractional', (assert) => {
        this.instance.option({
            hoursInterval: 2.1666666666666665,
            endDayHour: 5
        });

        checkRowsAndCells(this.instance.$element(), assert, 2.1666666666666665, 0, 5);
    });

    QUnit.test('Cell count should depend on start/end day hour & hoursInterval', (assert) => {
        const $element = this.instance.$element();

        this.instance.option({
            currentDate: new Date(2015, 2, 1),
            startDayHour: 8,
            endDayHour: 20,
            hoursInterval: 2.5
        });

        assert.equal($element.find('.dx-scheduler-date-table-cell').length, 5, 'Cell count is OK');
    });

    QUnit.test('WorkSpace Day view has right count of cells with view option intervalCount=2', (assert) => {
        this.instance.option('intervalCount', 2);

        let cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 2, 'view has right cell count');

        this.instance.option('intervalCount', 4);

        cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 4, 'view has right cell count');
    });

    QUnit.test('WorkSpace Day view cells should have right class when intervalCount and groups', (assert) => {
        this.instance.option('intervalCount', 3);

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

        this.instance.$element().find('.dx-scheduler-date-table-cell').each(function(index) {
            if((index + 1) % 3 === 0) {
                assert.ok($(this).hasClass('dx-scheduler-last-group-cell'), 'Date table cell has last-group class');
            } else {
                assert.notOk($(this).hasClass('dx-scheduler-last-group-cell'), 'Date tale cell hasn\'t last-group class');
            }
        });

        this.instance.$element().find(ALL_DAY_TABLE_CELL_CLASS).each(function(index) {
            if((index + 1) % 3 === 0) {
                assert.ok($(this).hasClass('dx-scheduler-last-group-cell'), 'AllDay panel cell has last-group class');
            } else {
                assert.notOk($(this).hasClass('dx-scheduler-last-group-cell'), 'AllDay panel cell hasn\'t last-group class');
            }
        });

        this.instance.$element().find('.dx-scheduler-header-panel-cell').each(function(index) {
            if((index + 1) % 3 === 0) {
                assert.ok($(this).hasClass('dx-scheduler-last-group-cell'), 'Header panel cell has last-group class');
            } else {
                assert.notOk($(this).hasClass('dx-scheduler-last-group-cell'), 'Header panel cell hasn\'t last-group class');
            }
        });
    });

    QUnit.test('WorkSpace Day view cells should have right class when intervalCount and groups, groupByDate = true', (assert) => {
        this.instance.option('intervalCount', 3);
        this.instance.option('groupByDate', true);

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

        this.instance.$element().find('.dx-scheduler-date-table-cell').each(function(index) {
            if((index + 1) % 2 === 0) {
                assert.ok($(this).hasClass('dx-scheduler-last-group-cell'), 'Date table cell has last-group class');
            } else {
                assert.notOk($(this).hasClass('dx-scheduler-last-group-cell'), 'Date tale cell hasn\'t last-group class');
            }
        });

        this.instance.$element().find(ALL_DAY_TABLE_CELL_CLASS).each(function(index) {
            if((index + 1) % 2 === 0) {
                assert.ok($(this).hasClass('dx-scheduler-last-group-cell'), 'AllDay panel cell has last-group class');
            } else {
                assert.notOk($(this).hasClass('dx-scheduler-last-group-cell'), 'AllDay panel cell hasn\'t last-group class');
            }
        });

        this.instance.$element().find('.dx-scheduler-header-panel-cell').each(function(index) {
            if((index + 1) % 2 === 0) {
                assert.ok($(this).hasClass('dx-scheduler-last-group-cell'), 'Header panel cell has last-group class');
            } else {
                assert.notOk($(this).hasClass('dx-scheduler-last-group-cell'), 'Header panel cell hasn\'t last-group class');
            }
        });
    });
});

const dayWithGroupingModuleConfig = {
    beforeEach: () => {
        this.instance = $('#scheduler-work-space-grouped').dxSchedulerWorkSpaceDay({
            groupOrientation: 'vertical',
            showCurrentTimeIndicator: false,
            startDayHour: 8,
            showAllDayPanel: false,
            endDayHour: 20
        }).dxSchedulerWorkSpaceDay('instance');
        stubInvokeMethod(this.instance);

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);
    }
};

QUnit.module('Workspace Day markup with vertical grouping', dayWithGroupingModuleConfig, () => {
    QUnit.test('Scheduler workspace day should have a right css class', (assert) => {
        const $element = this.instance.$element();

        assert.ok($element.hasClass('dx-scheduler-work-space-vertical-grouped'), 'Workspace has \'dx-scheduler-work-space-vertical-grouped\' css class');
    });

    QUnit.test('Scheduler workspace day should have right groupedStrategy, groupOrientation = vertical', (assert) => {
        assert.ok(this.instance._groupedStrategy instanceof SchedulerWorkSpaceVerticalStrategy, 'Grouped strategy is right');
    });

    QUnit.test('Scheduler all day rows should be built into dateTable', (assert) => {
        this.instance.option('showAllDayPanel', true);

        const $allDayRows = this.instance.$element().find(toSelector(ALL_DAY_ROW_CLASS));

        assert.equal($allDayRows.length, 2, 'DateTable contains 2 allDay rows');
    });

    QUnit.test('Scheduler all day titles should be built into timePanel', (assert) => {
        this.instance.option('showAllDayPanel', true);

        const $timePanel = this.instance.$element().find(toSelector(TIME_PANEL_CLASS));
        const $allDayTitles = $timePanel.find(toSelector(ALL_DAY_TITLE_CLASS));

        assert.equal($allDayTitles.length, 2, 'TimePanel contains 2 allDay titles');
    });

    QUnit.test('Date table should have right group header', (assert) => {
        const $element = this.instance.$element();

        assert.equal($element.find('.' + VERTICAL_GROUP_TABLE_CLASS).length, 1, 'Group header is rendered');
    });

    QUnit.test('Date table should have right group header cells count', (assert) => {
        const $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-group-header').length, 2, 'Group header cells count is ok');
    });

    QUnit.test('Scheduler workspace Day should have a right rows count', (assert) => {
        const $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-date-table tbody tr').length, 48, 'Workspace has 48 rows');
    });

    QUnit.test('Time panel should have right rows count and cell text, even cells count', (assert) => {
        checkRowsAndCells(this.instance.$element(), assert, 0.5, 8, 20, 2);
    });

    QUnit.test('Time panel should have right rows count and cell text, odd cells count', (assert) => {
        this.instance.option({
            startDayHour: 9,
            endDayHour: 16,
            hoursInterval: 1
        });

        checkRowsAndCells(this.instance.$element(), assert, 1, 9, 16, 2);
    });

    QUnit.test('Time panel should have 48 rows and 48 cells', (assert) => {
        const $element = this.instance.$element();

        let cellCount = $element.find('.dx-scheduler-date-table tbody tr').length;

        assert.equal($element.find('.dx-scheduler-time-panel-row').length, cellCount, 'Time panel has a right count of rows');
        assert.equal($element.find('.dx-scheduler-time-panel-cell').length, cellCount, 'Time panel has a right count of cells');
    });

    QUnit.test('Grouped cells should have a right group field in dxCellData', (assert) => {
        const $element = this.instance.$element();

        assert.deepEqual($element.find('.dx-scheduler-date-table tbody tr>td').eq(0).data('dxCellData').groups, {
            a: 1
        }, 'Cell group is OK');
        assert.deepEqual($element.find('.dx-scheduler-date-table tbody tr>td').eq(25).data('dxCellData').groups, { a: 2 }, 'Cell group is OK');
    });

    QUnit.test('Grouped allDay cells should have a right group field in dxCellData', (assert) => {
        this.instance.option('showAllDayPanel', true);

        let $allDayCells = this.instance.$element().find(toSelector(ALL_DAY_TABLE_CELL_CLASS));

        assert.deepEqual($allDayCells.eq(0).data('dxCellData').groups, { a: 1 }, 'Cell group is OK');
        assert.deepEqual($allDayCells.eq(1).data('dxCellData').groups, { a: 2 }, 'Cell group is OK');
    });

    QUnit.test('WorkSpace Day view cells should have right class when groups', (assert) => {
        var rowCountInGroup = 24;

        this.instance.$element().find('.dx-scheduler-date-table-cell').each(function(index) {
            if((index + 1) % rowCountInGroup === 0) {
                assert.ok($(this).hasClass('dx-scheduler-last-group-cell'), 'Date table cell has last-group class');
            } else if(index % rowCountInGroup === 0) {
                assert.ok($(this).hasClass('dx-scheduler-first-group-cell'), 'Date table cell has first-group class');
            } else {
                assert.notOk($(this).hasClass('dx-scheduler-last-group-cell'), 'Date table cell hasn\'t last-group class');
                assert.notOk($(this).hasClass('dx-scheduler-first-group-cell'), 'Date table cell hasn\'t first-group class');
            }
        });

        this.instance.$element().find('.dx-scheduler-time-panel-cell').each(function(index) {
            if((index + 1) % rowCountInGroup === 0) {
                assert.ok($(this).hasClass('dx-scheduler-last-group-cell'), 'Date table cell has last-group class');
            } else if(index % rowCountInGroup === 0) {
                assert.ok($(this).hasClass('dx-scheduler-first-group-cell'), 'Date table cell has first-group class');
            } else {
                assert.notOk($(this).hasClass('dx-scheduler-last-group-cell'), 'Date tale cell hasn\'t last-group class');
                assert.notOk($(this).hasClass('dx-scheduler-first-group-cell'), 'Date tale cell hasn\'t first-group class');
            }
        });
    });
});

const weekModuleConfig = {
    beforeEach: () => {
        this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWeek({
            showCurrentTimeIndicator: false
        }).dxSchedulerWorkSpaceWeek('instance');
        stubInvokeMethod(this.instance);
    }
};

QUnit.module('Workspace Week markup', weekModuleConfig, () => {
    QUnit.test('Scheduler workspace week should have a right css class', (assert) => {
        const $element = this.instance.$element();

        assert.ok($element.hasClass('dx-scheduler-work-space-week'), 'dxSchedulerWorkSpaceWeek has \'dx-scheduler-workspace-week\' css class');
    });

    QUnit.test('Header cells should have a special css classes', (assert) => {
        const $element = this.instance.$element(),
            classes = $element.find('.dx-scheduler-header-panel th').attr('class').split(' ');

        assert.ok($.inArray('dx-scheduler-header-panel-cell', classes) > -1, 'Cell has a css class');
        assert.ok($.inArray(HORIZONTAL_SIZES_CLASS, classes) > -1, 'Cell has a css class');
        assert.notOk($.inArray(VERTICAL_SIZES_CLASS, classes) > -1, 'Cell hasn\'t a css class');
    });

    QUnit.test('Scheduler all day panel should contain one row & 7 cells', (assert) => {
        this.instance.option('showAllDayPanel', true);

        const $allDayPanel = this.instance.$element().find('.dx-scheduler-all-day-panel');

        assert.equal($allDayPanel.find('tbody tr').length, 1, 'All day panel contains 1 row');
        assert.equal($allDayPanel.find('tbody tr>td').length, 7, 'All day panel contains 7 cell');
    });

    QUnit.test('Scheduler workspace week view', (assert) => {
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

    QUnit.test('Time panel should have 24 rows and 24 cells', (assert) => {
        this.instance.option('currentDate', new Date(1970, 0));
        checkRowsAndCells(this.instance.$element(), assert);
    });

    QUnit.test('Scheduler workspace week grouped view', (assert) => {
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

    QUnit.test('Scheduler workspace week view should contain a 7 headers', (assert) => {
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

    QUnit.test('Scheduler workspace grouped week view should contain a few headers', (assert) => {
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

    QUnit.test('Group header should be rendered if there are some groups, groupByDate = true', (assert) => {

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

        const rows = this.instance.$element().find('.dx-scheduler-group-row'),
            firstRowCells = rows.eq(0).find('.dx-scheduler-group-header'),
            secondRowCells = rows.eq(1).find('.dx-scheduler-group-header');

        assert.equal(rows.length, 2, 'There are two group rows');
        assert.equal(this.instance.$element().attr('dx-group-row-count'), 2, '\'dx-group-row-count\' is right');

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

    QUnit.test('Group row should be rendered before header row', (assert) => {
        this.instance.option('groups', [
            {
                name: 'one',
                items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
            }
        ]);
        const $element = this.instance.$element(),
            $groupRow = $element.find('.dx-scheduler-group-row'),
            $headerRow = $element.find('.dx-scheduler-header-row');

        assert.deepEqual($groupRow.next().get(0), $headerRow.get(0), 'Group row rendered correctly');
    });

    QUnit.test('WorkSpace Week view has right count of cells with view option intervalCount', (assert) => {
        this.instance.option('intervalCount', 2);

        let cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 7 * 2, 'view has right cell count');

        this.instance.option('intervalCount', 4);

        cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 7 * 4, 'view has right cell count');
    });

    QUnit.test('WorkSpace Week view cells should have right class when intervalCount and groups', (assert) => {
        this.instance.option('intervalCount', 3);

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

        this.instance.$element().find('.dx-scheduler-date-table-cell').each(function(index) {
            if((index + 1) % 21 === 0) {
                assert.ok($(this).hasClass('dx-scheduler-last-group-cell'), 'Date table cell has last-group class');
            } else {
                assert.notOk($(this).hasClass('dx-scheduler-last-group-cell'), 'Date tale cell hasn\'t last-group class');
            }
        });

        this.instance.$element().find(ALL_DAY_TABLE_CELL_CLASS).each(function(index) {
            if((index + 1) % 21 === 0) {
                assert.ok($(this).hasClass('dx-scheduler-last-group-cell'), 'AllDay panel cell has last-group class');
            } else {
                assert.notOk($(this).hasClass('dx-scheduler-last-group-cell'), 'AllDay panel cell hasn\'t last-group class');
            }
        });

        this.instance.$element().find('.dx-scheduler-header-panel-cell').each(function(index) {
            if((index + 1) % 21 === 0) {
                assert.ok($(this).hasClass('dx-scheduler-last-group-cell'), 'Header panel cell has last-group class');
            } else {
                assert.notOk($(this).hasClass('dx-scheduler-last-group-cell'), 'Header panel cell hasn\'t last-group class');
            }
        });
    });
});

const weekWithGroupingModuleConfig = {
    beforeEach: () => {
        this.instance = $('#scheduler-work-space-grouped').dxSchedulerWorkSpaceWeek({
            groupOrientation: 'vertical',
            startDayHour: 8,
            showAllDayPanel: false,
            endDayHour: 20
        }).dxSchedulerWorkSpaceWeek('instance');
        stubInvokeMethod(this.instance);

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);
    }
};

QUnit.module('Workspace Week markup with vertical grouping', weekWithGroupingModuleConfig, () => {
    QUnit.test('Scheduler workspace day should have a right css class', (assert) => {
        const $element = this.instance.$element();

        assert.ok($element.hasClass('dx-scheduler-work-space-vertical-grouped'), 'Workspace has \'dx-scheduler-work-space-vertical-grouped\' css class');
    });

    QUnit.test('Scheduler workspace Week should have a right rows count', (assert) => {
        const $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-date-table tbody tr').length, 48, 'Workspace has 48 rows');
    });

    QUnit.test('Scheduler all day rows should be built into dateTable', (assert) => {
        this.instance.option('showAllDayPanel', true);

        const $allDayRows = this.instance.$element().find(toSelector(ALL_DAY_ROW_CLASS));

        assert.equal($allDayRows.length, 2, 'DateTable contains 2 allDay rows');
    });
    QUnit.test('Time panel should have right rows count and cell text', (assert) => {
        checkRowsAndCells(this.instance.$element(), assert, 0.5, 8, 20, 2);
    });

    QUnit.test('Grouped cells should have a right group field in dxCellData', (assert) => {
        let $element = this.instance.$element(),
            $cells = $element.find('.dx-scheduler-date-table tbody tr>td'),
            cellCount = $cells.length;

        assert.deepEqual($cells.eq(0).data('dxCellData').groups, {
            a: 1
        }, 'Cell group is OK');
        assert.deepEqual($cells.eq(cellCount / 2).data('dxCellData').groups, { a: 2 }, 'Cell group is OK');
    });
});

const workWeekModuleConfig = {
    beforeEach: () => {
        this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWorkWeek().dxSchedulerWorkSpaceWorkWeek('instance');
        stubInvokeMethod(this.instance);
    }
};

QUnit.module('Workspace Work Week markup', workWeekModuleConfig, () => {
    QUnit.test('Scheduler workspace work week should have a right css class', (assert) => {
        const $element = this.instance.$element();

        assert.ok($element.hasClass('dx-scheduler-work-space-work-week'), 'dxSchedulerWorkSpaceWorkWeek has \'dx-scheduler-workspace-work-week\' css class');
    });

    QUnit.test('Scheduler all day panel should contain one row & 5 cells', (assert) => {
        this.instance.option('showAllDayPanel', true);

        const $allDayPanel = this.instance.$element().find('.dx-scheduler-all-day-panel');

        assert.equal($allDayPanel.find('tbody tr').length, 1, 'All day panel contains 1 row');
        assert.equal($allDayPanel.find('tbody tr>td').length, 5, 'All day panel contains 5 cell');
    });

    QUnit.test('Scheduler workspace work week view', (assert) => {
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

    QUnit.test('Scheduler workspace work week grouped view', (assert) => {
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

    QUnit.test('Scheduler workspace work week view should contain a 5 headers', (assert) => {
        const currentDate = new Date(),
            $element = this.instance.$element(),
            weekStartDate = new Date(currentDate).getDate() - (new Date(currentDate).getDay() - 1),
            $headerCells = $element.find('.dx-scheduler-header-panel-cell');

        assert.equal($headerCells.length, 5, 'Date table has 5 header cells');

        $headerCells.each(function(index, cell) {
            const date = new Date(currentDate);
            date.setDate(weekStartDate + index);
            assert.equal($(cell).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[(index + 1) % 7].toLowerCase() + ' ' + date.getDate(), 'Header has a right text');
        });
    });

    QUnit.test('Scheduler workspace work week grouped view should contain a few headers', (assert) => {
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

    QUnit.test('Scheduler workspace work week view should be correct with any first day of week', (assert) => {
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

    QUnit.test('Scheduler workspace work week view should be correct, if currentDate is Sunday', (assert) => {
        const $element = this.instance.$element();

        this.instance.option('firstDayOfWeek', 0);
        this.instance.option('currentDate', new Date(2016, 0, 10));

        const $headerCells = $element.find('.dx-scheduler-header-row th');

        assert.equal($headerCells.first().text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[1].toLowerCase() + ' 11', 'first header has a right text');
        assert.equal($headerCells.eq(2).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[3].toLowerCase() + ' 13', '3 header has a right text');
        assert.equal($headerCells.last().text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[5].toLowerCase() + ' 15', 'last header has a right text');
    });

    QUnit.test('Scheduler workspace work week view should be correct with any first day of week, if currentDate is Sunday', (assert) => {
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

    QUnit.test('Time panel should have 24 rows and 24 cells', (assert) => {
        checkRowsAndCells(this.instance.$element(), assert);
    });

    QUnit.test('WorkSpace WorkWeek view has right count of cells with view option intervalCount', (assert) => {
        this.instance.option('intervalCount', 2);

        let cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 5 * 2, 'view has right cell count');

        this.instance.option('intervalCount', 4);

        cells = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(cells.length, this.instance._getCellCountInDay() * 5 * 4, 'view has right cell count');
    });

    QUnit.test('Workspace work week view should contain 15 headers if intervalCount=3', (assert) => {
        this.instance.option({
            intervalCount: 3,
            firstDayOfWeek: 1,
            currentDate: new Date(2017, 5, 26)
        });

        const instance = this.instance;

        const currentDate = instance.option('currentDate'),
            $element = instance.$element(),
            $headerCells = $element.find('.dx-scheduler-header-panel-cell');
        let date,
            i;

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

    QUnit.test('Grouped Workspace work week view should contain right count of headers with view option intervalCount', (assert) => {
        this.instance.option({
            intervalCount: 2,
            firstDayOfWeek: 1,
            currentDate: new Date(2017, 5, 26)
        });

        const instance = this.instance;

        instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

        const currentDate = instance.option('currentDate'),
            $element = instance.$element(),
            $headerCells = $element.find('.dx-scheduler-header-panel-cell');
        let date,
            i;

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
    beforeEach: () => {
        this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceMonth().dxSchedulerWorkSpaceMonth('instance');
        stubInvokeMethod(this.instance);
    }
};

QUnit.module('Workspace Month markup', monthModuleConfig, () => {
    QUnit.test('Scheduler workspace month should have a right css class', (assert) => {
        const $element = this.instance.$element();

        assert.ok($element.hasClass('dx-scheduler-work-space-month'), 'dxSchedulerWorkSpaceMonth has \'dx-scheduler-workspace-month\' css class');
    });

    QUnit.test('Scheduler workspace month scrollable content should have a right css class', (assert) => {
        const $scrollableContent = this.instance.getScrollable().$content();

        assert.ok($scrollableContent.hasClass('dx-scheduler-scrollable-fixed-content'), 'Scrollable content has \'dx-scheduler-scrollable-fixed-content\' css class');
    });

    QUnit.test('Scheduler workspace month scrollable content should not have a right css class, if intervalCount is set', (assert) => {
        this.instance.option('intervalCount', 2);

        const $scrollableContent = this.instance.getScrollable().$content();

        assert.notOk($scrollableContent.hasClass('dx-scheduler-scrollable-fixed-content'), 'Scrollable content hasn\'t \'dx-scheduler-scrollable-fixed-content\' css class');
    });

    QUnit.test('Scheduler all day panel should not contain rows & cells', (assert) => {
        const $allDayPanel = this.instance.$element().find('.dx-scheduler-all-day-panel');

        assert.equal($allDayPanel.find('tbody tr').length, 0, 'All day panel does not contain rows');
    });

    QUnit.test('Scheduler time panel should not contain rows & cells', (assert) => {
        const $timePanel = this.instance.$element().find('.dx-scheduler-time-panel');

        assert.equal($timePanel.find('tbody tr').length, 0, 'Time panel does not contain rows');
    });

    QUnit.test('Scheduler workspace month view', (assert) => {
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

    QUnit.test('Scheduler workspace month grouped view', (assert) => {
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

    QUnit.test('Scheduler workspace month view should contain a 7 headers', (assert) => {
        const $element = this.instance.$element();

        const $headerCells = $element.find('.dx-scheduler-header-row th');

        assert.equal($headerCells.length, 7, 'Date table has 7 header cells');

        $headerCells.each(function(index, cell) {
            assert.equal($(cell).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[index % 7].toLowerCase(), 'Header has a right text');
        });
    });

    QUnit.test('Scheduler workspace month grouped view should contain a few headers', (assert) => {
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

    QUnit.test('Scheduler workspace month view should have a right date in each cell', (assert) => {
        const $element = this.instance.$element();

        this.instance.option('currentDate', new Date(2015, 2, 1));
        this.instance.option('firstDayOfWeek', 1);

        const firstDate = new Date(2015, 1, 23);

        $element.find('.dx-scheduler-date-table tr>td').each(function(index, cell) {
            const date = new Date(firstDate);
            date.setDate(firstDate.getDate() + index);
            assert.equal($(cell).text(), dateLocalization.format(date, 'dd'), 'Cell has a right date');
        });
    });

    QUnit.test('Scheduler workspace month view should have a right date in each cell, groupByDate = true', (assert) => {
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

    QUnit.test('Scheduler workspace month view should have a date with current-date class', (assert) => {
        const $element = this.instance.$element();

        const currentDate = new Date(),
            $cell = $element.find('.dx-scheduler-date-table-current-date');

        this.instance.option('currentDate', currentDate);

        assert.equal(parseInt($cell.text(), 10), currentDate.getDate().toString(), 'Cell text is correct');
    });

    QUnit.test('Scheduler workspace month view should have a dates with other-month class', (assert) => {
        const $element = this.instance.$element();

        this.instance.option('currentDate', new Date(2015, 2, 1));

        const $cells = $element.find('.dx-scheduler-date-table-other-month');
        assert.equal($cells.length, 11, 'Other-month cells count is correct');
    });

    QUnit.test('Scheduler workspace month view should have a dates with other-month class, if startDate is set', (assert) => {
        const $element = this.instance.$element();

        this.instance.option('currentDate', new Date(2015, 2, 1));
        this.instance.option('startDate', new Date(2015, 5, 1));

        const $cells = $element.find('.dx-scheduler-date-table-other-month');
        assert.equal($cells.length, 11, 'Other-month cells count is correct');
    });

    QUnit.test('Scheduler workspace month view should have a dates with other-month class, if startDate & intervalCount is set', (assert) => {
        const $element = this.instance.$element();

        this.instance.option('currentDate', new Date(2015, 2, 1));
        this.instance.option('startDate', new Date(2015, 11, 1));
        this.instance.option('intervalCount', 3);

        const $cells = $element.find('.dx-scheduler-date-table-other-month');
        assert.equal($cells.length, 6, 'Other-month cells count is correct');
    });

    QUnit.test('Scheduler workspace should have a right first day of week', (assert) => {
        const $element = this.instance.$element();

        const days = dateLocalization.getDayNames('abbreviated');
        let firstCellHeader = $element.find('.dx-scheduler-header-panel thead tr>th').first().text();

        assert.equal(firstCellHeader.toLowerCase(), days[0].toLowerCase(), 'Workspace has a right first day of week by default');

        this.instance.option('firstDayOfWeek', 2);

        firstCellHeader = $element.find('.dx-scheduler-header-panel thead tr>th').first().text();

        assert.equal(firstCellHeader.toLowerCase(), days[this.instance.option('firstDayOfWeek')].toLowerCase(), 'Workspace has a right first day of week when option was changed');
    });

    QUnit.test('WorkSpace Month view has right count of rows with view option intervalCount', (assert) => {
        this.instance.option('intervalCount', 2);

        let rows = this.instance.$element().find('.dx-scheduler-date-table-row');
        assert.equal(rows.length, 10, 'view has right rows count');

        this.instance.option('intervalCount', 4);

        rows = this.instance.$element().find('.dx-scheduler-date-table-row');
        assert.equal(rows.length, 18, 'view has right rows count');
    });

    QUnit.test('WorkSpace Month view has right count of cells with view option intervalCount', (assert) => {
        this.instance.option('intervalCount', 2);

        const rows = this.instance.$element().find('.dx-scheduler-date-table-cell');
        assert.equal(rows.length, 7 * 10, 'view has right cells count');
    });

    QUnit.test('WorkSpace Month view with option intervalCount has cells with special firstDayOfMonth class', (assert) => {
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
    beforeEach: () => {
        this.instance = $('#scheduler-work-space-grouped').dxSchedulerWorkSpaceMonth({
            groupOrientation: 'vertical',
            startDayHour: 8,
            showAllDayPanel: false,
            endDayHour: 20
        }).dxSchedulerWorkSpaceMonth('instance');
        stubInvokeMethod(this.instance);

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);
    }
};

QUnit.module('Workspace Month markup with vertical grouping', monthWithGroupingModuleConfig, () => {
    QUnit.test('Scheduler workspace day should have a right css class', (assert) => {
        const $element = this.instance.$element();

        assert.ok($element.hasClass('dx-scheduler-work-space-vertical-grouped'), 'Workspace has \'dx-scheduler-work-space-vertical-grouped\' css class');
    });

    QUnit.test('Workspace Month markup should contain three scrollable elements', (assert) => {
        var $dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable'),
            $sidebarScrollable = this.instance.$element().find('.dx-scheduler-sidebar-scrollable'),
            $headerScrollable = this.instance.$element().find('.dx-scheduler-header-scrollable');

        assert.equal($dateTableScrollable.length, 1, 'Date table scrollable was rendered');
        assert.ok($dateTableScrollable.data('dxScrollable'), 'Date table scrollable is instance of dxScrollable');

        assert.equal($sidebarScrollable.length, 1, 'Time panel scrollable was rendered');
        assert.ok($sidebarScrollable.data('dxScrollable'), 'Time panel scrollable is instance of dxScrollable');

        assert.equal($headerScrollable.length, 1, 'Header scrollable was rendered');
        assert.ok($headerScrollable.data('dxScrollable'), 'Header scrollable is instance of dxScrollable');
    });

    QUnit.test('Date table scrollable should have right config with vertical grouping', (assert) => {
        var dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable').dxScrollable('instance'),
            device = devices.current(),
            expectedShowScrollbarOption = 'onHover';

        if(device.phone || device.tablet) {
            expectedShowScrollbarOption = 'onScroll';
        }

        assert.equal(dateTableScrollable.option('direction'), 'both', 'Direction is OK');
        assert.equal(dateTableScrollable.option('showScrollbar'), expectedShowScrollbarOption, 'showScrollbar is OK');
        assert.strictEqual(dateTableScrollable.option('bounceEnabled'), false, 'bounceEnabled is OK');
        assert.strictEqual(dateTableScrollable.option('updateManually'), true, 'updateManually is OK');
    });

    QUnit.test('Scheduler workspace month scrollable content should not have fixed-content class with vertical grouping', (assert) => {
        const $scrollableContent = this.instance.getScrollable().$content();

        assert.notOk($scrollableContent.hasClass('dx-scheduler-scrollable-fixed-content'), 'Scrollable content hasn\'t \'dx-scheduler-scrollable-fixed-content\' css class');
    });

    QUnit.test('Sidebar scrollable should contain group table', (assert) => {
        var $sidebarScrollable = this.instance.$element().find('.dx-scheduler-sidebar-scrollable');

        assert.equal($sidebarScrollable.find('.dx-scheduler-group-header').length, 2, 'Group header cells count is ok');
    });

    QUnit.test('Scheduler workspace month should have correct rows and cells count', (assert) => {
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

    QUnit.test('Grouped cells should have a right group field in dxCellData', (assert) => {
        let $element = this.instance.$element(),
            $cells = $element.find('.dx-scheduler-date-table tbody tr>td'),
            cellCount = $cells.length;

        assert.deepEqual($cells.eq(0).data('dxCellData').groups, {
            a: 1
        }, 'Cell group is OK');
        assert.deepEqual($cells.eq(cellCount / 2).data('dxCellData').groups, { a: 2 }, 'Cell group is OK');
    });

    QUnit.test('Scheduler workspace month view should have a dates with other-month class', (assert) => {
        const $element = this.instance.$element();

        this.instance.option('currentDate', new Date(2015, 2, 1));

        const $cells = $element.find('.dx-scheduler-date-table-other-month');
        assert.equal($cells.length, 22, 'Other-month cells count is correct');
    });

    QUnit.test('Scheduler workspace month view should have a dates text', (assert) => {
        const $element = this.instance.$element(),
            viewStart = new Date(2018, 1, 25);

        this.instance.option('currentDate', new Date(2018, 2, 1));
        let $cells = $element.find('.dx-scheduler-date-table tbody tr>td'),
            cellsCount = $cells.length,
            cellCountInGroup = cellsCount / 2;

        $element.find('.dx-scheduler-date-table-cell').each(function(index) {
            let date = new Date(viewStart);
            let cellIndex = index % cellCountInGroup;

            date = dateLocalization.format(new Date(date.setDate(date.getDate() + cellIndex)), 'dd');

            assert.equal($(this).text(), date, 'Time is OK');
        });
    });

    QUnit.test('Date table should have right group header', (assert) => {
        const $element = this.instance.$element();

        assert.equal($element.find('.' + VERTICAL_GROUP_TABLE_CLASS).length, 1, 'Group header is rendered');
    });

    QUnit.test('Date table should have right group header cells count', (assert) => {
        const $element = this.instance.$element();

        assert.equal($element.find('.dx-scheduler-group-header').length, 2, 'Group header cells count is ok');
    });
});

const scrollingModuleConfig = {
    beforeEach: () => {
        this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWeek({
            crossScrollingEnabled: true,
            width: 100
        }).dxSchedulerWorkSpaceWeek('instance');
    }
};

QUnit.module('Workspace with crossScrollingEnabled markup', scrollingModuleConfig, () => {
    QUnit.test('Workspace should have correct class', (assert) => {
        assert.ok(this.instance.$element().hasClass('dx-scheduler-work-space-both-scrollbar'), 'CSS class is OK');
        this.instance.option('crossScrollingEnabled', false);
        assert.notOk(this.instance.$element().hasClass('dx-scheduler-work-space-both-scrollbar'), 'CSS class is OK');
    });

    QUnit.test('Three scrollable elements should be rendered', (assert) => {
        var $dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable'),
            $timePanelScrollable = this.instance.$element().find('.dx-scheduler-sidebar-scrollable'),
            $headerScrollable = this.instance.$element().find('.dx-scheduler-header-scrollable');

        assert.equal($dateTableScrollable.length, 1, 'Date table scrollable was rendered');
        assert.ok($dateTableScrollable.data('dxScrollable'), 'Date table scrollable is instance of dxScrollable');

        assert.equal($timePanelScrollable.length, 1, 'Time panel scrollable was rendered');
        assert.ok($timePanelScrollable.data('dxScrollable'), 'Time panel scrollable is instance of dxScrollable');

        assert.equal($headerScrollable.length, 1, 'Header scrollable was rendered');
        assert.ok($headerScrollable.data('dxScrollable'), 'Header scrollable is instance of dxScrollable');
    });

    QUnit.test('Time panel scrollable should contain time panel', (assert) => {
        var timePanelScrollable = this.instance.$element().find('.dx-scheduler-sidebar-scrollable').dxScrollable('instance'),
            scrollableContent = timePanelScrollable.$content();

        assert.equal(scrollableContent.find('.dx-scheduler-time-panel').length, 1, 'Time panel exists');
    });

    QUnit.test('Header scrollable should have right config', (assert) => {
        var headerScrollable = this.instance.$element().find('.dx-scheduler-header-scrollable').dxScrollable('instance');

        assert.equal(headerScrollable.option('direction'), 'horizontal', 'Direction is OK');
        assert.strictEqual(headerScrollable.option('showScrollbar'), false, 'showScrollbar is OK');
        assert.strictEqual(headerScrollable.option('bounceEnabled'), false, 'bounceEnabled is OK');
        assert.strictEqual(headerScrollable.option('updateManually'), true, 'updateManually is OK');
    });

    QUnit.test('Time panel scrollable should have right config', (assert) => {
        var timePanelScrollable = this.instance.$element().find('.dx-scheduler-sidebar-scrollable').dxScrollable('instance');

        assert.equal(timePanelScrollable.option('direction'), 'vertical', 'Direction is OK');
        assert.strictEqual(timePanelScrollable.option('showScrollbar'), false, 'showScrollbar is OK');
        assert.strictEqual(timePanelScrollable.option('bounceEnabled'), false, 'bounceEnabled is OK');
        assert.strictEqual(timePanelScrollable.option('updateManually'), true, 'updateManually is OK');
    });
});
