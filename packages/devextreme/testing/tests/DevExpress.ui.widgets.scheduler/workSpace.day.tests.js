import { getOuterHeight } from 'core/utils/size';
import dragEvents from 'common/core/events/drag';
import 'generic_light.css!';
import $ from 'jquery';
import resizeCallbacks from 'core/utils/resize_callbacks';
import dateLocalization from 'common/core/localization/date';

import '__internal/scheduler/workspaces/m_work_space_day';
const CELL_CLASS = 'dx-scheduler-date-table-cell';
const DROPPABLE_CELL_CLASS = 'dx-scheduler-date-table-droppable-cell';

const {
    test,
    skip,
    module,
    testStart
} = QUnit;

testStart(function() {
    $('#qunit-fixture').html('<div class="dx-scheduler"><div id="scheduler-work-space"></div></div>');
});

module('Work Space Day', {
    beforeEach: function() {
        this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceDay({}).dxSchedulerWorkSpaceDay('instance');
        this.instance.initDragBehavior();
        this.instance._attachTablesEvents();
    }
}, () => {
    test('Workspace getAllDayHeight() should return 0 or allDayPanel-height depending on the showAllDayPanel option', function(assert) {
        this.instance.option('showAllDayPanel', true);
        assert.ok(this.instance.getAllDayHeight() > 0, 'Return value is correct');

        this.instance.option('showAllDayPanel', false);
        assert.equal(this.instance.getAllDayHeight(), 0, 'Return value is correct');
    });

    skip('Work space should find cell coordinates by date', function(assert) {
        const $element = this.instance.$element();

        this.instance.option('currentDate', new Date(2015, 2, 4));
        let coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 4, 2, 0));

        assert.equal(coords.top, $element.find('.dx-scheduler-date-table tbody td').eq(4).position().top, 'Top cell coordinates are right');
        assert.equal(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(4).position().left, 'Left cell coordinates are right');


        const $cell = $element.find('.dx-scheduler-date-table-cell').eq(5);
        const position = $cell.position();

        coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 4, 2, 30));
        assert.equal(coords.top, position.top, 'Cell coordinates are right');
        assert.equal(coords.left, position.left, 'Cell coordinates are right');

        coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 4, 2, 45));

        position.top += getOuterHeight($cell) * 0.5;
        assert.equal(coords.top, position.top, 'Cell coordinates are right');
        assert.equal(coords.left, position.left, 'Cell coordinates are right');
    });

    skip('Workspace should find cell coordinates by date with second precision', function(assert) {
        const $element = this.instance.$element();

        this.instance.option('currentDate', new Date(2017, 5, 16));
        this.instance.option('hoursInterval', 1);

        const coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2017, 5, 16, 1, 1, 30));
        const $cell = $element.find('.dx-scheduler-date-table tbody td').eq(1);
        const top = $cell.position().top + (1.5 / 60) * getOuterHeight($cell);

        assert.equal(coords.top, top, 'Cell coordinates are right');
        assert.equal(coords.left, $cell.position().left, 'Cell coordinates are right');
    });

    skip('Work space should find cell coordinates by date depend on start day hour', function(assert) {
        const $element = this.instance.$element();

        this.instance.option('currentDate', new Date(2015, 2, 4));
        this.instance.option('startDayHour', 5);

        const coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 4, 6, 0));

        assert.roughEqual(coords.top, $element.find('.dx-scheduler-date-table tbody td').eq(2).position().top, 1, 'Cell coordinates are right');
        assert.equal(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(2).position().left, 'Cell coordinates are right');
    });

    skip('Work space should find cell coordinates by date depend on fractional start day hour', function(assert) {
        const $element = this.instance.$element();

        this.instance.option('currentDate', new Date(2015, 2, 4));
        this.instance.option('startDayHour', 5.5);

        const coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 4, 6, 0));

        assert.roughEqual(coords.top, $element.find('.dx-scheduler-date-table tbody td').eq(1).position().top, 1, 'Cell coordinates are right');
        assert.equal(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(1).position().left, 'Cell coordinates are right');
    });

    skip('Work space should find cell coordinates by date depend on end day hour', function(assert) {
        const $element = this.instance.$element();

        this.instance.option('currentDate', new Date(2015, 2, 4));
        this.instance.option('endDayHour', 10);

        const coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 4, 6, 0));

        assert.equal(coords.top, $element.find('.dx-scheduler-date-table tbody td').eq(12).position().top, 'Cell coordinates are right');
        assert.equal(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(12).position().left, 'Cell coordinates are right');
    });

    test('getDataByDroppableCell should work right with the single group', function(assert) {
        this.instance.option('currentDate', new Date(2015, 1, 18));
        this.instance.option('groups', [
            {
                name: 'res',
                items: [
                    { id: 1, text: 'one' }, { id: 2, text: 'two' }
                ]
            }
        ]);

        this.instance.$element().find('.' + CELL_CLASS).eq(3).addClass('dx-scheduler-date-table-droppable-cell');

        const data = this.instance.getDataByDroppableCell();
        assert.deepEqual(data, {
            allDay: false,
            startDate: new Date(2015, 1, 18, 0, 30),
            endDate: new Date(2015, 1, 18, 1),
            groups: {
                res: 2
            }
        }, 'Data is OK');
    });

    test('getDataByDroppableCell should work right with many groups', function(assert) {
        this.instance.option('currentDate', new Date(2015, 1, 18));
        this.instance.option('groups', [
            {
                name: 'one',
                items: [
                    { id: 1, text: 'a' }, { id: 2, text: 'b' }
                ]
            },
            {
                name: 'two',
                items: [
                    { id: 1, text: 'c' }, { id: 2, text: 'd' }
                ]
            },
            {
                name: 'three',
                items: [
                    { id: 1, text: 'e' }, { id: 2, text: 'f' }, { id: 3, text: 'g' }
                ]
            }
        ]);

        this.instance.$element().find('.' + CELL_CLASS).eq(20).addClass('dx-scheduler-date-table-droppable-cell');

        const data = this.instance.getDataByDroppableCell();
        assert.deepEqual(data, {
            startDate: new Date(2015, 1, 18, 0, 30),
            endDate: new Date(2015, 1, 18, 1, 0),
            allDay: false,
            groups: {
                one: 2,
                two: 1,
                three: 3
            }
        }, 'Data is OK');
    });

    test('droppable class should be added on dxdragenter', function(assert) {
        const $cell = this.instance.$element().find('.' + CELL_CLASS).eq(2);

        $($cell).trigger(dragEvents.enter);
        assert.ok($cell.hasClass(DROPPABLE_CELL_CLASS), 'cell has droppable class');
    });

    test('Get date range', function(assert) {
        this.instance.option('currentDate', new Date(2015, 2, 16));

        assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 16, 0, 0), new Date(2015, 2, 16, 23, 59)], 'Range is OK');
    });

    test('Each cell should contain jQuery dxCellData', function(assert) {
        this.instance.option('renovateRender', false);

        this.instance.option('currentDate', new Date(2015, 2, 16));

        const $cell = this.instance.$element().find('.' + CELL_CLASS).first();

        assert.deepEqual($cell.data('dxCellData'), {
            startDate: new Date(2015, 2, 16, 0, 0),
            endDate: new Date(2015, 2, 16, 0, 30),
            allDay: false,
            groupIndex: 0,
        });
    });

    test('dxCellData should be \'immutable\'', function(assert) {
        this.instance.option('renovateRender', false);

        const $element = this.instance.$element();
        const $cell = $element.find('.' + CELL_CLASS).first();
        const cellData = this.instance.getCellData($cell);

        cellData.cellCustomField = 'cell-custom-data';
        assert.strictEqual($element.find('.' + CELL_CLASS).first().data('dxCellData').cellCustomField, undefined, 'Cell data is not affected');
    });

    test('Cells have right cellData in vertical grouped WorkSpace Day view', function(assert) {
        this.instance.option('renovateRender', false);

        this.instance.option({
            currentDate: new Date(2018, 2, 16),
            groups: [{
                name: 'one',
                items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
            }],
            groupOrientation: 'vertical',
            startDayHour: 9,
            showAllDayPanel: false
        });
        const firstCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).data('dxCellData');
        const secondCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(36).data('dxCellData');

        assert.deepEqual(firstCellData.startDate, new Date(2018, 2, 16, 9), 'cell has right startDate');
        assert.deepEqual(firstCellData.endDate, new Date(2018, 2, 16, 9, 30), 'cell has right endDate');

        assert.deepEqual(secondCellData.startDate, new Date(2018, 2, 16, 12), 'cell has right startDate');
        assert.deepEqual(secondCellData.endDate, new Date(2018, 2, 16, 12, 30), 'cell has right endDate');
    });
});

module('Work Space Day with grouping by date', () => {
    module('Default', {
        beforeEach: function() {
            this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceDay({
                currentDate: new Date(2018, 2, 1),
                groupByDate: true,
                intervalCount: 2,
                showCurrentTimeIndicator: false,
                groups: [{
                    name: 'one',
                    items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                }],
            }).dxSchedulerWorkSpaceDay('instance');
        }
    }, () => {
        test('Get date range', function(assert) {
            assert.deepEqual(this.instance.getDateRange(), [new Date(2018, 2, 1, 0, 0), new Date(2018, 2, 2, 23, 59)], 'Range is OK');

            this.instance.option('intervalCount', 3);

            assert.deepEqual(this.instance.getDateRange(), [new Date(2018, 2, 1, 0, 0), new Date(2018, 2, 3, 23, 59)], 'Range is OK');
        });

        test('Group header should be rendered correct, groupByDate = true', function(assert) {
            const $groupRow = this.instance.$element().find('.dx-scheduler-group-row');
            const $groupHeaderCells = $groupRow.find('.dx-scheduler-group-header');

            assert.equal($groupHeaderCells.length, 4, 'Group header cells count is OK');
            const $groupHeaderContents = this.instance.$element().find('.dx-scheduler-group-header-content');

            resizeCallbacks.fire();

            assert.roughEqual(getOuterHeight($groupHeaderContents.eq(0)), 19, 5, 'Group header content height is OK');
            assert.roughEqual(getOuterHeight($groupHeaderContents.eq(3)), 19, 5, 'Group header content height is OK');
        });

        test('Date table cells shoud have right cellData, groupByDate = true', function(assert) {
            this.instance.option('renovateRender', false);

            this.instance.option('intervalCount', 3);
            const $cells = this.instance.$element().find('.dx-scheduler-date-table-cell');

            assert.deepEqual($cells.eq(0).data('dxCellData'), {
                startDate: new Date(2018, 2, 1),
                endDate: new Date(2018, 2, 1, 0, 30),
                allDay: false,
                groups: {
                    one: 1
                },
                groupIndex: 0,
            });

            assert.deepEqual($cells.eq(1).data('dxCellData'), {
                startDate: new Date(2018, 2, 1),
                endDate: new Date(2018, 2, 1, 0, 30),
                allDay: false,
                groups: {
                    one: 2
                },
                groupIndex: 1,
            });

            assert.deepEqual($cells.eq(2).data('dxCellData'), {
                startDate: new Date(2018, 2, 2),
                endDate: new Date(2018, 2, 2, 0, 30),
                allDay: false,
                groups: {
                    one: 1
                },
                groupIndex: 0,
            });

            assert.deepEqual($cells.eq(3).data('dxCellData'), {
                startDate: new Date(2018, 2, 2),
                endDate: new Date(2018, 2, 2, 0, 30),
                allDay: false,
                groups: {
                    one: 2
                },
                groupIndex: 1,
            });

            assert.deepEqual($cells.eq(4).data('dxCellData'), {
                startDate: new Date(2018, 2, 3),
                endDate: new Date(2018, 2, 3, 0, 30),
                allDay: false,
                groups: {
                    one: 1
                },
                groupIndex: 0,
            });

            assert.deepEqual($cells.eq(5).data('dxCellData'), {
                startDate: new Date(2018, 2, 3),
                endDate: new Date(2018, 2, 3, 0, 30),
                allDay: false,
                groups: {
                    one: 2
                },
                groupIndex: 1,
            });
        });

        test('Date table cells should have right cellData, groupByDate = true without groups', function(assert) {
            this.instance.option('renovateRender', false);

            this.instance.option('groups', []);
            const $cells = this.instance.$element().find('.dx-scheduler-date-table-cell');

            assert.deepEqual($cells.eq(0).data('dxCellData'), {
                startDate: new Date(2018, 2, 1),
                endDate: new Date(2018, 2, 1, 0, 30),
                allDay: false,
                groupIndex: 0,
            });

            assert.deepEqual($cells.eq(1).data('dxCellData'), {
                startDate: new Date(2018, 2, 2),
                endDate: new Date(2018, 2, 2, 0, 30),
                allDay: false,
                groupIndex: 0,
            });

            assert.deepEqual($cells.eq(2).data('dxCellData'), {
                startDate: new Date(2018, 2, 1, 0, 30),
                endDate: new Date(2018, 2, 1, 1, 0),
                allDay: false,
                groupIndex: 0,
            });

            assert.deepEqual($cells.eq(3).data('dxCellData'), {
                startDate: new Date(2018, 2, 2, 0, 30),
                endDate: new Date(2018, 2, 2, 1, 0),
                allDay: false,
                groupIndex: 0,
            });
        });

        test('Date table cells should have right cellData, groupByDate = true', function(assert) {
            const $groupRow = this.instance.$element().find('.dx-scheduler-group-row');
            const $groupHeaderCells = $groupRow.find('.dx-scheduler-group-header');

            assert.equal($groupHeaderCells.eq(0).text(), 'a', 'Group header content height is OK');
            assert.equal($groupHeaderCells.eq(1).text(), 'b', 'Group header content height is OK');
            assert.equal($groupHeaderCells.eq(2).text(), 'a', 'Group header content height is OK');
            assert.equal($groupHeaderCells.eq(3).text(), 'b', 'Group header content height is OK');
        });

        skip('Work space should find cell coordinates by date, groupByDate = true', function(assert) {
            const $element = this.instance.$element();

            this.instance.option('currentDate', new Date(2015, 2, 4));
            let coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 4, 2, 0), 1, false);

            assert.equal(coords.top, $element.find('.dx-scheduler-date-table tbody td').eq(17).position().top, 'Top cell coordinates are right');
            assert.equal(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(17).position().left, 'Left cell coordinates are right');

            coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 5, 2, 0), 1, false);

            assert.equal(coords.top, $element.find('.dx-scheduler-date-table tbody td').eq(19).position().top, 'Top cell coordinates are right');
            assert.equal(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(19).position().left, 'Left cell coordinates are right');
        });

        skip('Work space should find cell coordinates by date in allDay row, groupByDate = true', function(assert) {
            const $element = this.instance.$element();

            this.instance.option('currentDate', new Date(2015, 2, 4));
            let coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 4, 2, 0), 1, true);

            assert.equal(coords.top, 0, 'Top cell coordinates are right');
            assert.equal(coords.hMax, 898, 'hMax cell coordinates are right');
            assert.equal(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(17).position().left, 'Left cell coordinates are right');

            coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 5, 2, 0), 0, true);

            assert.equal(coords.top, 0, 'Top cell coordinates are right');
            assert.equal(coords.hMax, 898, 'hMax cell coordinates are right');
            assert.equal(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(18).position().left, 'Left cell coordinates are right');
        });
    });

    module('it with intervalCount', {
        beforeEach: function() {
            this.createInstance = function(options) {
                this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceDay(options).dxSchedulerWorkSpaceDay('instance');
            };
        }
    }, () => {
        test('WorkSpace Day view cells have right cellData with view option intervalCount=2', function(assert) {
            this.createInstance({
                intervalCount: 2,
                currentDate: new Date(2017, 5, 29),
                renovateRender: false,
            });

            const firstCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(1).data('dxCellData');
            const secondCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(95).data('dxCellData');

            assert.deepEqual(firstCellData.startDate, new Date(2017, 5, 30, 0), 'cell has right startDate');
            assert.deepEqual(firstCellData.endDate, new Date(2017, 5, 30, 0, 30), 'cell has right endtDate');

            assert.deepEqual(secondCellData.startDate, new Date(2017, 5, 30, 23, 30), 'cell has right startDate');
            assert.deepEqual(secondCellData.endDate, new Date(2017, 5, 31, 0), 'cell has right endtDate');
        });

        test('WorkSpace Day view cells have right cellData with view option intervalCount = 3 and startDate < currentDate', function(assert) {
            this.createInstance({
                intervalCount: 3,
                currentDate: new Date(2017, 5, 28),
                startDate: new Date(2017, 5, 21),
                renovateRender: false,
            });

            const firstCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).data('dxCellData');
            const secondCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(143).data('dxCellData');

            assert.deepEqual(firstCellData.startDate, new Date(2017, 5, 27, 0), 'cell has right startDate');
            assert.deepEqual(firstCellData.endDate, new Date(2017, 5, 27, 0, 30), 'cell has right endtDate');

            assert.deepEqual(secondCellData.startDate, new Date(2017, 5, 29, 23, 30), 'cell has right startDate');
            assert.deepEqual(secondCellData.endDate, new Date(2017, 5, 30, 0), 'cell has right endtDate');
        });

        test('WorkSpace Day view cells have right cellData with view option intervalCount = 3 and startDate > currentDate', function(assert) {
            this.createInstance({
                intervalCount: 3,
                currentDate: new Date(2017, 5, 25),
                startDate: new Date(2017, 5, 30),
                renovateRender: false,
            });

            const firstCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).data('dxCellData');
            const secondCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(143).data('dxCellData');

            assert.deepEqual(firstCellData.startDate, new Date(2017, 5, 24, 0), 'cell has right startDate');
            assert.deepEqual(firstCellData.endDate, new Date(2017, 5, 24, 0, 30), 'cell has right endtDate');

            assert.deepEqual(secondCellData.startDate, new Date(2017, 5, 26, 23, 30), 'cell has right startDate');
            assert.deepEqual(secondCellData.endDate, new Date(2017, 5, 27, 0), 'cell has right endtDate');
        });

        test('Get date range', function(assert) {
            this.createInstance({
                intervalCount: 2,
                currentDate: new Date(2015, 2, 16)
            });

            assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 16, 0, 0), new Date(2015, 2, 17, 23, 59)], 'Range is OK');

            this.instance.option('intervalCount', 4);
            assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 16, 0, 0), new Date(2015, 2, 19, 23, 59)], 'Range is OK');
        });

        test('WorkSpace Day view with option intervalCount = 3 should have right header', function(assert) {
            this.createInstance({
                intervalCount: 3,
                currentDate: new Date(2017, 5, 25),
                startDate: new Date(2017, 5, 24)
            });

            const date = new Date(this.instance.option('startDate'));
            const $element = this.instance.$element();
            let $headerCells = $element.find('.dx-scheduler-header-panel-cell');

            assert.equal($headerCells.length, 3, 'Date table has 3 header cells');
            assert.equal($headerCells.eq(0).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[6].toLowerCase() + ' ' + date.getDate(), 'Header has a right text');
            assert.equal($headerCells.eq(1).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[0].toLowerCase() + ' ' + new Date(date.setDate(date.getDate() + 1)).getDate(), 'Header has a right text');
            assert.equal($headerCells.eq(2).text().toLowerCase(), dateLocalization.getDayNames('abbreviated')[1].toLowerCase() + ' ' + new Date(date.setDate(date.getDate() + 1)).getDate(), 'Header has a right text');

            this.instance.option('intervalCount', 1);

            $headerCells = $element.find('.dx-scheduler-header-panel-cell');
            assert.equal($headerCells.length, 0, 'Date table hasn\'t 3 header cells');
        });
    });

});
