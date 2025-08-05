import $ from 'jquery';
import SchedulerWorkSpace from '__internal/scheduler/workspaces/m_work_space';
import SchedulerWorkSpaceHorizontalStrategy from '__internal/scheduler/workspaces/m_work_space_grouped_strategy_horizontal';
import '__internal/scheduler/m_scheduler';

import { getEmptyResourceManager, applyWorkspaceGroups } from '../../helpers/scheduler/mockResourceManager.js';

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
const TIME_PANEL_CLASS = 'dx-scheduler-time-panel';
const DATE_TABLE_CLASS = 'dx-scheduler-date-table';
const ALL_DAY_TITLE_CLASS = 'dx-scheduler-all-day-title';

const VERTICAL_SIZES_CLASS = 'dx-scheduler-cell-sizes-vertical';

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
            this.instance = $('#scheduler-work-space')[view]({
                getResourceManager: getEmptyResourceManager,
            })[view]('instance');
        }
    };

    QUnit.module(`Base Workspace markup for ${viewName}`, moduleConfig, () => {
        if(viewName === 'Day' || viewName === 'Week') {
            QUnit.test('All day title should be rendered in header panel empty cell', async function(assert) {
                const $element = this.instance.$element();
                const headerEmptyCell = $element.find('.dx-scheduler-header-panel-empty-cell');

                assert.equal(headerEmptyCell.children(`.${ALL_DAY_TITLE_CLASS}`).length, 1, 'All-day-title is OK');
            });

            QUnit.test('Workspace should have specific css class, if showAllDayPanel = true ', async function(assert) {
                this.instance.option('showAllDayPanel', true);

                const $element = this.instance.$element();
                assert.ok($element.hasClass('dx-scheduler-work-space-all-day'), 'dxSchedulerWorkSpace has \'dx-scheduler-work-space-all-day\' css class');

                this.instance.option('showAllDayPanel', false);
                assert.notOk($element.hasClass('dx-scheduler-work-space-all-day'), 'dxSchedulerWorkSpace hasn\'t \'dx-scheduler-work-space-all-day\' css class');
            });

            QUnit.test('All day panel has specific class when allDayExpanded = true', async function(assert) {
                this.instance.option('showAllDayPanel', true);
                this.instance.option('allDayExpanded', true);

                const $element = this.instance.$element();

                assert.notOk($element.hasClass('dx-scheduler-work-space-all-day-collapsed'), 'dxSchedulerWorkSpace has not \'dx-scheduler-work-space-all-day-collapsed\' css class');

                this.instance.option('allDayExpanded', false);

                assert.ok($element.hasClass('dx-scheduler-work-space-all-day-collapsed'), 'dxSchedulerWorkSpace has \'dx-scheduler-work-space-all-day-collapsed\' css class');
            });

            QUnit.test('Workspace should not has specific class when showAllDayPanel = false', async function(assert) {
                this.instance.option('showAllDayPanel', false);
                this.instance.option('allDayExpanded', false);

                const $element = this.instance.$element();

                assert.notOk($element.hasClass('dx-scheduler-work-space-all-day-collapsed'), 'dxSchedulerWorkSpace has not \'dx-scheduler-work-space-all-day-collapsed\' css class');

                this.instance.option('showAllDayPanel', true);

                assert.ok($element.hasClass('dx-scheduler-work-space-all-day-collapsed'), 'dxSchedulerWorkSpace has \'dx-scheduler-work-space-all-day-collapsed\' css class');
            });

            QUnit.test('Scheduler workspace should contain time panel, header panel, allday panel and content', async function(assert) {
                const $element = this.instance.$element();

                assert.equal($element.find(`.${HEADER_PANEL_CLASS}`).length, 1, 'Workspace contains the time panel');
                assert.equal($element.find(`.${ALL_DAY_PANEL_CLASS}`).length, 1, 'Workspace contains the all day panel');
                assert.equal($element.find(`.${TIME_PANEL_CLASS}`).length, 1, 'Workspace contains the time panel');
                assert.equal($element.find(`.${DATE_TABLE_CLASS}`).length, 1, 'Workspace contains date table');
            });

            QUnit.test('Time panel cells and rows should have special css classes', async function(assert) {
                const $element = this.instance.$element();
                const $row = $element.find('.dx-scheduler-time-panel tr').first();
                const $cell = $row.find('td').first();

                assert.ok($row.hasClass('dx-scheduler-time-panel-row'), 'Css class of row is correct');
                assert.ok($cell.hasClass('dx-scheduler-time-panel-cell'), 'Css class of cell is correct');
                assert.ok($cell.hasClass(VERTICAL_SIZES_CLASS), 'Css class of cell is correct');
            });

            QUnit.test('All day panel row should have special css class', async function(assert) {
                this.instance.option('showAllDayPanel', true);

                const $element = this.instance.$element();
                const $row = $element.find('.dx-scheduler-all-day-table tr').first();

                assert.ok($row.hasClass('dx-scheduler-all-day-table-row'), 'Css class of row is correct');
            });

            QUnit.test('All-day-appointments container should be rendered inside all-day-panael', async function(assert) {
                const $element = this.instance.$element();

                assert.equal($element.find('.dx-scheduler-all-day-panel').children('.dx-scheduler-all-day-appointments').length, 1, 'Container is rendered correctly');
            });

            QUnit.test('Scheduler workspace day should have right groupedStrategy by default', async function(assert) {
                assert.ok(this.instance._groupedStrategy instanceof SchedulerWorkSpaceHorizontalStrategy, 'Grouped strategy is right');
            });
        }

        QUnit.test('Scheduler workspace should be initialized', async function(assert) {
            assert.ok(this.instance instanceof SchedulerWorkSpace, 'dxSchedulerWorkSpace was initialized');
        });

        QUnit.test('Scheduler workspace should have a right css class', async function(assert) {
            const $element = this.instance.$element();
            assert.ok($element.hasClass(WORKSPACE_CLASS), 'dxSchedulerWorkSpace has \'dx-scheduler-workspace\' css class');
        });

        QUnit.test('Scheduler workspace with intervalCount should have a right css class', async function(assert) {
            this.instance.option('intervalCount', 3);
            let $element = this.instance.$element();
            assert.ok($element.hasClass(WORKSPACE_WITH_COUNT_CLASS), 'dxSchedulerWorkSpace has right css class');

            this.instance.option('intervalCount', 1);
            $element = this.instance.$element();
            assert.notOk($element.hasClass(WORKSPACE_WITH_COUNT_CLASS), 'dxSchedulerWorkSpace has \'dx-scheduler-workspace\' css class');
        });

        QUnit.test('Scheduler workspace with groupByDate should have a right css class', async function(assert) {
            this.instance.option('groupOrientation', 'vertical');

            let $element = this.instance.$element();

            assert.notOk($element.hasClass(WORKSPACE_WITH_GROUP_BY_DATE_CLASS), 'dxSchedulerWorkSpace hasn\'t right css class');

            await applyWorkspaceGroups(this.instance, [{
                label: 'one',
                fieldExpr: 'one',
                dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
            }]);
            this.instance.option('groupByDate', true);
            $element = this.instance.$element();
            assert.notOk($element.hasClass(WORKSPACE_WITH_GROUP_BY_DATE_CLASS), 'dxSchedulerWorkSpace hasn\'t right css class');

            this.instance.option('groupOrientation', 'horizontal');
            $element = this.instance.$element();
            assert.ok($element.hasClass(WORKSPACE_WITH_GROUP_BY_DATE_CLASS), 'dxSchedulerWorkSpace right css class');
        });

        QUnit.test('Workspace should have specific css class, if hoursInterval = 0.5 ', async function(assert) {
            this.instance.option('hoursInterval', 0.5);

            const $element = this.instance.$element();
            assert.ok($element.hasClass('dx-scheduler-work-space-odd-cells'), 'dxSchedulerWorkSpace has \'dx-scheduler-work-space-odd-cells\' css class');

            this.instance.option('hoursInterval', 0.75);
            assert.notOk($element.hasClass('dx-scheduler-work-space-odd-cells'), 'dxSchedulerWorkSpace hasn\'t \'dx-scheduler-work-space-odd-cells\' css class');
        });

        QUnit.test('Scheduler workspace parts should be wrapped by scrollable', async function(assert) {
            const $element = this.instance.$element();

            assert.ok($element.find('.dx-scheduler-time-panel').parent().parent().hasClass('dx-scrollable-content'), 'Scrollable contains the time panel');
            assert.ok(
                $element.find('.dx-scheduler-date-table-container').parent().parent().hasClass('dx-scrollable-content'),
                'Scrollable contains date table',
            );
        });

        QUnit.test('Fixed appointments container should be rendered directly in workspace', async function(assert) {
            const $element = this.instance.$element();

            assert.equal($element.children('.dx-scheduler-fixed-appointments').length, 1, 'Container is rendered correctly');
        });

        QUnit.test('Group header should be rendered if there are some groups', async function(assert) {

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

        QUnit.test('Group header should be rendered if there is a single group', async function(assert) {
            await applyWorkspaceGroups(this.instance, [{
                label: 'one',
                fieldExpr: 'one',
                dataSource: [{ id: 1, text: 'a' }]
            }]);

            const headers = this.instance.$element().find('.dx-scheduler-group-header');

            assert.equal(headers.length, 1, 'Group are rendered');
            assert.equal(headers.eq(0).text(), 'a', 'Group header text is right');
        });

        QUnit.test('Group header should contain group header content', async function(assert) {
            await applyWorkspaceGroups(this.instance, [{
                label: 'one',
                fieldExpr: 'one',
                dataSource: [{ id: 1, text: 'a' }]
            }]);

            const header = this.instance.$element().find('.dx-scheduler-group-header');
            const headerContent = header.find('.dx-scheduler-group-header-content');

            assert.equal(headerContent.length, 1, 'Group header content is rendered');
        });
    });
});
