import dateUtils from 'core/utils/date';
import { triggerShownEvent } from 'common/core/events/visibility_change';
import 'generic_light.css!';
import $ from 'jquery';

import '__internal/scheduler/workspaces/m_work_space_week';
import '__internal/scheduler/workspaces/m_work_space_work_week';

const CLASSES = {
    dateTableCell: '.dx-scheduler-date-table-cell'
};

QUnit.dump.maxDepth = 10;

const {
    test,
    skip,
    module,
    testStart
} = QUnit;

testStart(function() {
    $('#qunit-fixture').html('<div class="dx-scheduler"><div id="scheduler-work-space"></div></div>');
});

module('Work Space Week', () => {
    module('Default', {
        beforeEach: function() {
            this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWeek({
                showCurrentTimeIndicator: false,
            }).dxSchedulerWorkSpaceWeek('instance');
        }
    }, () => {
        skip('Work space should find cell coordinates by date', function(assert) {
            const $element = this.instance.$element();

            this.instance.option('currentDate', new Date(2015, 2, 4));
            const coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 5, 2, 0));
            assert.equal(coords.top, $element.find('.dx-scheduler-date-table tbody td').eq(32).position().top, 'Cell coordinates are right');
            assert.roughEqual(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(32).position().left, 0.01, 'Cell coordinates are right');
        });

        skip('Work space should find cell coordinates by date in allDay panel', function(assert) {
            const $element = this.instance.$element();

            this.instance.option('currentDate', new Date(2015, 2, 4));
            const coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 5, 2, 15), 0, true);

            assert.roughEqual(coords.top, 0, 1.001, 'Cell coordinates are right');
            assert.roughEqual(coords.left, $element.find('.dx-scheduler-all-day-table tbody td').eq(4).position().left, 0.01, 'Cell coordinates are right');
        });

        skip('Work space should find cell coordinates by date depend on start day hour', function(assert) {
            const $element = this.instance.$element();

            this.instance.option('currentDate', new Date(2015, 2, 4));
            this.instance.option('startDayHour', 5);
            this.instance.option('firstDayOfWeek', 7);

            const coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 5, 6, 0));
            assert.roughEqual(coords.top, $element.find('.dx-scheduler-date-table tbody td').eq(18).position().top, 1, 'Cell coordinates are right');
            assert.roughEqual(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(18).position().left, 0.01, 'Cell coordinates are right');
        });

        skip('Work space should find cell coordinates by date depend on start/end day hour & cellDuration', function(assert) {
            const $element = this.instance.$element();

            this.instance.option({
                currentDate: new Date(2015, 2, 1),
                firstDayOfWeek: 0,
                startDayHour: 5,
                endDayHour: 10,
                hoursInterval: 0.75
            });

            const coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 2, 8, 0));
            assert.equal(coords.top, $element.find('.dx-scheduler-date-table tbody td').eq(29).position().top, 'Cell coordinates are right');
            assert.roughEqual(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(29).position().left, 0.01, 'Cell coordinates are right');
        });

        skip('Work space should find cell coordinates by date depend on end day hour', function(assert) {
            const $element = this.instance.$element();

            this.instance.option('currentDate', new Date(2015, 2, 4));
            this.instance.option('endDayHour', 10);
            this.instance.option('firstDayOfWeek', 1);

            const coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 5, 0, 30));
            assert.equal(coords.top, $element.find('.dx-scheduler-date-table tbody td').eq(10).position().top, 'Cell coordinates are right');
            assert.roughEqual(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(10).position().left, 0.01, 'Cell coordinates are right');
        });

        skip('Work space should find cell coordinates by date inside group', function(assert) {
            const $element = this.instance.$element();

            this.instance.option('currentDate', new Date(2015, 2, 4));
            this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }]);

            const coords = this.instance.positionHelper.getCoordinatesByDateInGroup(new Date(2015, 2, 5, 2, 0), [1]);
            assert.equal(coords.length, 1);
            assert.equal(coords[0].top, $element.find('.dx-scheduler-date-table tbody td').eq(67).position().top, 'Cell coordinates are right');
            assert.roughEqual(coords[0].left, $element.find('.dx-scheduler-date-table tbody td').eq(67).position().left, 0.01, 'Cell coordinates are right');
        });

        skip('Work space should find cells coordinates by date inside the same groups', function(assert) {
            const $element = this.instance.$element();

            this.instance.option('currentDate', new Date(2015, 2, 4));
            this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }]);

            const coords = this.instance.positionHelper.getCoordinatesByDateInGroup(new Date(2015, 2, 5, 2, 0), [0, 1]);
            const $cells = $element.find('.dx-scheduler-date-table tbody td');
            assert.equal(coords.length, 2);
            assert.equal(coords[0].top, $cells.eq(60).position().top, 'Cell coordinates are right');
            assert.roughEqual(coords[0].left, $cells.eq(60).position().left, 0.01, 'Cell coordinates are right');
            assert.equal(coords[1].top, $cells.eq(67).position().top, 'Cell coordinates are right');
            assert.roughEqual(coords[1].left, $cells.eq(67).position().left, 0.01, 'Cell coordinates are right');
        });

        skip('Work space should find cells coordinates by date inside the different groups', function(assert) {
            const $element = this.instance.$element();

            this.instance.option('currentDate', new Date(2015, 2, 4));
            this.instance.option('groups', [
                {
                    name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                },
                {
                    name: 'two', items: [{ id: 1, text: 'c' }, { id: 2, text: 'd' }]
                }
            ]);

            this.instance.resources = [
                { field: 'one', dataSource: [{ id: 1 }, { id: 2 }] },
                { field: 'two', dataSource: [{ id: 1 }, { id: 2 }] }
            ];

            const coords = this.instance.positionHelper.getCoordinatesByDateInGroup(new Date(2015, 2, 5, 2, 0), [0, 1, 2, 3]);
            const $cells = $element.find('.dx-scheduler-date-table tbody td');

            $.each(coords, function(index, coordinate) {
                const position = $cells.eq(116 + index * 7).position();
                assert.equal(coordinate.top, position.top, '');
                assert.roughEqual(coordinate.left, position.left, 0.01, '');
            });
        });

        test('Get date range', function(assert) {
            this.instance.option('firstDayOfWeek', 1);
            this.instance.option('currentDate', new Date(2015, 2, 16));

            assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 16, 0, 0), new Date(2015, 2, 22, 23, 59)], 'Range is OK');
        });

        test('Date range should be correct if startDayHour & endDayHour are defined', function(assert) {
            this.instance.option({
                'firstDayOfWeek': 1,
                'currentDate': new Date(2015, 2, 16),
                startDayHour: 2,
                endDayHour: 3
            });

            assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 16, 2, 0), new Date(2015, 2, 22, 2, 59)], 'Range is OK');
        });

        test('Each cell should contain jQuery dxCellData depend on start day hour', function(assert) {
            this.instance.option({
                currentDate: new Date(2015, 2, 16),
                firstDayOfWeek: 1,
                startDayHour: 5,
                renovateRender: false,
            });

            const $cell = this.instance.$element().find(CLASSES.dateTableCell).eq(8);

            assert.deepEqual($cell.data('dxCellData'), {
                startDate: new Date(2015, 2, 17, 5, 30),
                endDate: new Date(2015, 2, 17, 6, 0),
                allDay: false,
                groupIndex: 0,
            });
        });

        test('Each cell should contain jQuery dxCellData depend on end day hour', function(assert) {
            this.instance.option({
                currentDate: new Date(2015, 2, 4),
                firstDayOfWeek: 1,
                endDayHour: 10,
                renovateRender: false,
            });

            const $cell = this.instance.$element().find(CLASSES.dateTableCell).eq(8);

            assert.deepEqual($cell.data('dxCellData'), {
                startDate: new Date(2015, 2, 3, 0, 30),
                endDate: new Date(2015, 2, 3, 1, 0),
                allDay: false,
                groupIndex: 0,
            });
        });

        skip('getCoordinatesByDate should return right coordinates for all day appointments', function(assert) {
            this.instance.option({
                currentDate: new Date(2015, 2, 4),
                firstDayOfWeek: 1,
                startDayHour: 4,
                showAllDayPanel: true
            });

            const $cell = this.instance.$element().find('.dx-scheduler-all-day-table-cell').eq(4);
            const cellPosition = $cell.position();

            const coordinates = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 6), 0, true);

            assert.roughEqual(coordinates.left, cellPosition.left, 0.01);
        });

        skip('getCoordinatesByDate should return rowIndex and columnIndex', function(assert) {
            this.instance.option('currentDate', new Date(2015, 2, 4));

            const coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 4, 2, 45));

            assert.equal(coords.rowIndex, 5, 'Row index is OK');
            assert.equal(coords.columnIndex, 3, 'Column index is OK');
        });

        test('Get first view date', function(assert) {
            this.instance.option({
                currentDate: new Date(2015, 5, 30),
                firstDayOfWeek: 1,
                startDayHour: 4
            });

            assert.deepEqual(this.instance.getStartViewDate(), new Date(2015, 5, 29, 4), 'First view date is OK');
        });

        test('Get cellData by coordinates', function(assert) {
            this.instance.option({
                currentDate: new Date(2015, 5, 30),
                firstDayOfWeek: 1,
                endDayHour: 10
            });

            const cellData = {
                allDay: false,
                endDate: new Date(2015, 5, 29, 1, 30),
                startDate: new Date(2015, 5, 29, 1, 0),
                groupIndex: 0,
            };

            assert.deepEqual(this.instance.getCellDataByCoordinates({
                top: 100,
                left: 100
            }, false), cellData, 'Cell data is OK');
        });

        test('Cell data should be correct if DST makes sense (T442904)', function(assert) {
            // can be reproduced in PST timezone
            this.instance.option({
                currentDate: new Date(2016, 10, 6),
                firstDayOfWeek: 0,
                startDayHour: 1,
                renovateRender: false,
            });

            const cellData = this.instance.$element().find('.dx-scheduler-date-table-row').eq(1).find('.dx-scheduler-date-table-cell').eq(0).data('dxCellData');

            assert.equal(cellData.startDate.toString(), new Date(2016, 10, 6, 1, 30).toString(), 'Start date is OK');
            assert.equal(cellData.endDate.toString(), new Date(2016, 10, 6, 2).toString(), 'End date is OK');
        });

        test('Get allDay cellData by coordinates', function(assert) {
            this.instance.option({
                currentDate: new Date(2015, 5, 30),
                firstDayOfWeek: 1,
                endDayHour: 10,
                allDayExpanded: true
            });

            const cellData = {
                allDay: true,
                endDate: new Date(2015, 5, 29, 0),
                startDate: new Date(2015, 5, 29, 0),
                groupIndex: 0,
            };

            assert.deepEqual(this.instance.getCellDataByCoordinates({
                top: 51,
                left: 100
            }, true), cellData, 'Cell data is OK');
        });

        test('Get last view date', function(assert) {
            this.instance.option({
                currentDate: new Date(2015, 5, 30),
                firstDayOfWeek: 1,
                endDayHour: 10
            });

            assert.deepEqual(this.instance.getEndViewDate(), new Date(2015, 6, 5, 9, 59), 'Last view date is OK');
        });

        test('Get visible bounds', function(assert) {
            this.instance.option({
                currentDate: new Date(2015, 5, 30),
                firstDayOfWeek: 1,
                startDayHour: 1,
                height: 410,
                showAllDayPanel: true,
                allDayExpanded: true
            });

            this.instance.$element().css('padding', 0);

            const scrollable = this.instance.getScrollable();

            triggerShownEvent(this.instance.$element());

            scrollable.scrollBy(0);

            const bounds = this.instance.getVisibleBounds();

            assert.deepEqual(bounds.top, { hours: 1, minutes: 0 }, 'Top bound is OK');
            assert.deepEqual(bounds.bottom, { hours: 3, minutes: 30 }, 'Bottom bound is OK');
        });

        test('Get visible bounds if scroll position is not null', function(assert) {
            this.instance.option({
                currentDate: new Date(2015, 5, 30),
                firstDayOfWeek: 1,
                startDayHour: 1,
                height: 700,
                showAllDayPanel: true,
                allDayExpanded: true
            });

            const scrollable = this.instance.getScrollable();

            triggerShownEvent(this.instance.$element());

            scrollable.scrollBy(220);

            const bounds = this.instance.getVisibleBounds();

            assert.deepEqual(bounds.top, { hours: 3, minutes: 30 }, 'Top bound is OK');
            assert.deepEqual(bounds.bottom, { hours: 8, minutes: 30 }, 'Bottom bound is OK');
        });

        test('Get visible bounds if hoursInterval is set', function(assert) {
            this.instance.option({
                currentDate: new Date(2015, 2, 2),
                firstDayOfWeek: 1,
                startDayHour: 0,
                height: 700,
                showAllDayPanel: true,
                allDayExpanded: true,
                hoursInterval: 1.5
            });
            let scrollable = this.instance.getScrollable();
            let bounds = this.instance.getVisibleBounds();

            scrollable = this.instance.getScrollable();

            triggerShownEvent(this.instance.$element());

            scrollable.scrollBy(200);

            bounds = this.instance.getVisibleBounds();

            assert.deepEqual(bounds.top, { hours: 6, minutes: 0 }, 'Top bound is OK');
            assert.deepEqual(bounds.bottom, { hours: 23, minutes: 30 }, 'Bottom bound is OK');

        });

        test('Cells of week after the DST switch should have right date', function(assert) {
            const spy = sinon.spy(dateUtils, 'getTimezonesDifference');

            this.instance.option({
                currentDate: new Date(2016, 2, 14)
            });

            assert.equal(spy.callCount, 343);
            spy.restore();
        });

        test('Cells have right cellData in horizontal grouped WorkSpace Week view', function(assert) {
            this.instance.option({
                currentDate: new Date(2018, 2, 16),
                groupOrientation: 'vertical',
                startDayHour: 9,
                groups: [{
                    name: 'one',
                    items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                }],
                renovateRender: false,
            });

            const firstCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(25).data('dxCellData');
            const secondCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(248).data('dxCellData');

            assert.deepEqual(firstCellData.startDate, new Date(2018, 2, 15, 10, 30), 'cell has right startDate');
            assert.deepEqual(firstCellData.endDate, new Date(2018, 2, 15, 11), 'cell has right endtDate');

            assert.deepEqual(secondCellData.startDate, new Date(2018, 2, 14, 11, 30), 'cell has right startDate');
            assert.deepEqual(secondCellData.endDate, new Date(2018, 2, 14, 12), 'cell has right endtDate');
        });

        test('Vertical grouped work space should calculate max top position', function(assert) {
            this.instance.option({
                currentDate: new Date(2015, 2, 16),
                firstDayOfWeek: 1,
                showAllDayPanel: true,
                startDayHour: 8,
                endDayHour: 9,
                groupOrientation: 'vertical',
                groups: [{
                    name: 'one',
                    items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                },
                {
                    name: 'two',
                    items: [{ id: 1, text: 'c' }, { id: 2, text: 'd' }]
                }]
            });

            const $rows = this.instance.$element().find('.dx-scheduler-date-table tr');
            const $firstGroupLastCell = $rows.eq(2).find('td').first();
            const $secondGroupLastCell = $rows.eq(5).find('td').first();
            const $thirdGroupLastCell = $rows.eq(8).find('td').first();
            const $fourthGroupLastCell = $rows.eq(11).find('td').first();

            const getVerticalMax = (groupIndex) => {
                return this.instance.positionHelper.getVerticalMax({
                    groupIndex,
                    isVirtualScrolling: false,
                    isShowAllDayPanel: true,
                    supportAllDayRow: true,
                    isGroupedAllDayPanel: true,
                    isVerticalGrouping: true
                });
            };

            assert.roughEqual($firstGroupLastCell.position().top + $firstGroupLastCell.get(0).getBoundingClientRect().height, getVerticalMax(0), 1.1, 'Max top is OK');
            assert.roughEqual($secondGroupLastCell.position().top + $secondGroupLastCell.get(0).getBoundingClientRect().height, getVerticalMax(1), 1.1, 'Max top is OK');
            assert.roughEqual($thirdGroupLastCell.position().top + $thirdGroupLastCell.get(0).getBoundingClientRect().height, getVerticalMax(2), 1.1, 'Max top is OK');
            assert.roughEqual($fourthGroupLastCell.position().top + $fourthGroupLastCell.get(0).getBoundingClientRect().height, getVerticalMax(3), 1.1, 'Max top is OK');
        });
    });

    module('Group by date', {
        beforeEach: function() {
            this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWeek({
                currentDate: new Date(2018, 2, 1),
                groupByDate: true,
                showCurrentTimeIndicator: false,
                groups: [{
                    name: 'one',
                    items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                }],
            }).dxSchedulerWorkSpaceWeek('instance');
        }
    }, () => {
        test('Get date range', function(assert) {
            this.instance.option('intervalCount', 2);
            assert.deepEqual(this.instance.getDateRange(), [new Date(2018, 1, 25, 0, 0), new Date(2018, 2, 10, 23, 59)], 'Range is OK');

            this.instance.option('intervalCount', 3);
            assert.deepEqual(this.instance.getDateRange(), [new Date(2018, 1, 25, 0, 0), new Date(2018, 2, 17, 23, 59)], 'Range is OK');
        });

        skip('Work space should find cell coordinates by date, groupByDate = true', function(assert) {
            const $element = this.instance.$element();

            this.instance.option('currentDate', new Date(2015, 2, 4));

            let coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 4, 2, 0), 1, false);

            assert.equal(coords.top, $element.find('.dx-scheduler-date-table tbody td').eq(63).position().top, 'Top cell coordinates are right');
            assert.roughEqual(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(63).position().left, 0.01, 'Left cell coordinates are right');

            coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 7, 1, 0), 0, false);

            assert.equal(coords.top, $element.find('.dx-scheduler-date-table tbody td').eq(40).position().top, 'Top cell coordinates are right');
            assert.roughEqual(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(40).position().left, 0.01, 'Left cell coordinates are right');
        });

        skip('Work space should find cell coordinates by date in allDay row, groupByDate = true', function(assert) {
            const $element = this.instance.$element();

            this.instance.option('currentDate', new Date(2015, 2, 4));
            let coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 2, 2, 0), 1, true);

            assert.equal(coords.top, 0, 'Top cell coordinates are right');
            assert.roughEqual(coords.hMax, 898, 1, 'hMax cell coordinates are right');
            assert.roughEqual(coords.left, $element.find('.dx-scheduler-all-day-table tbody td').eq(3).position().left, 0.01, 'Left cell coordinates are right');

            coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 5, 2, 0), 0, true);

            assert.equal(coords.top, 0, 'Top cell coordinates are right');
            assert.roughEqual(coords.hMax, 898, 1, 'hMax cell coordinates are right');
            assert.roughEqual(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(8).position().left, 0.01, 'Left cell coordinates are right');
        });
    });

    module('it with intervalCount', {
        beforeEach: function() {
            this.createInstance = function(options) {
                this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWeek(options).dxSchedulerWorkSpaceWeek('instance');
            };
        }
    }, () => {
        test('WorkSpace Week view cells have right cellData with view option intervalCount', function(assert) {
            this.createInstance({
                intervalCount: 2,
                currentDate: new Date(2017, 5, 25),
                renovateRender: false,
            });

            const firstCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(6).data('dxCellData');
            const secondCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(671).data('dxCellData');

            assert.deepEqual(firstCellData.startDate, new Date(2017, 6, 1, 0), 'cell has right startDate');
            assert.deepEqual(firstCellData.endDate, new Date(2017, 6, 1, 0, 30), 'cell has right endtDate');

            assert.deepEqual(secondCellData.startDate, new Date(2017, 6, 8, 23, 30), 'cell has right startDate');
            assert.deepEqual(secondCellData.endDate, new Date(2017, 6, 9, 0), 'cell has right endtDate');
        });

        test('WorkSpace Week view cells have right cellData with view option intervalCount = 3 and startDate < currentDate', function(assert) {
            this.createInstance({
                intervalCount: 3,
                hoursInterval: 1,
                firstDayOfWeek: 1,
                currentDate: new Date(2017, 6, 26),
                startDate: new Date(2017, 6, 4),
                renovateRender: false,
            });

            const firstCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).data('dxCellData');
            const secondCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(240).data('dxCellData');
            const thirdCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(503).data('dxCellData');

            assert.deepEqual(firstCellData.startDate, new Date(2017, 6, 24, 0), 'cell has right startDate');
            assert.deepEqual(firstCellData.endDate, new Date(2017, 6, 24, 1), 'cell has right endtDate');

            assert.deepEqual(secondCellData.startDate, new Date(2017, 7, 2, 11), 'cell has right startDate');
            assert.deepEqual(secondCellData.endDate, new Date(2017, 7, 2, 12), 'cell has right endtDate');

            assert.deepEqual(thirdCellData.startDate, new Date(2017, 7, 13, 23), 'cell has right startDate');
            assert.deepEqual(thirdCellData.endDate, new Date(2017, 7, 14, 0), 'cell has right endtDate');
        });

        test('WorkSpace Week view cells have right cellData with view option intervalCount = 3 and startDate > currentDate', function(assert) {
            this.createInstance({
                intervalCount: 2,
                hoursInterval: 1,
                firstDayOfWeek: 1,
                currentDate: new Date(2017, 6, 4),
                startDate: new Date(2017, 6, 26),
                renovateRender: false,
            });

            const firstCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).data('dxCellData');
            const secondCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(160).data('dxCellData');
            const thirdCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(335).data('dxCellData');

            assert.deepEqual(firstCellData.startDate, new Date(2017, 5, 26, 0), 'cell has right startDate');
            assert.deepEqual(firstCellData.endDate, new Date(2017, 5, 26, 1), 'cell has right endtDate');

            assert.deepEqual(secondCellData.startDate, new Date(2017, 6, 2, 11), 'cell has right startDate');
            assert.deepEqual(secondCellData.endDate, new Date(2017, 6, 2, 12), 'cell has right endtDate');

            assert.deepEqual(thirdCellData.startDate, new Date(2017, 6, 9, 23), 'cell has right startDate');
            assert.deepEqual(thirdCellData.endDate, new Date(2017, 6, 10, 0), 'cell has right endtDate');
        });

        test('Get date range', function(assert) {
            this.createInstance({
                intervalCount: 3,
                currentDate: new Date(2015, 2, 15)
            });

            assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 15, 0, 0), new Date(2015, 3, 4, 23, 59)], 'Range is OK');

            this.instance.option('intervalCount', 4);
            assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 15, 0, 0), new Date(2015, 3, 11, 23, 59)], 'Range is OK');
        });
    });
});

module('Work Space Work Week', () => {
    module('Default', {
        beforeEach: function() {
            this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWorkWeek({}).dxSchedulerWorkSpaceWorkWeek('instance');
        }
    }, () => {
        skip('Work space should find cell coordinates by date', function(assert) {
            const $element = this.instance.$element();

            this.instance.option('currentDate', new Date(2015, 2, 4));
            const coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 5, 2, 0));
            assert.equal(coords.top, $element.find('.dx-scheduler-date-table tbody td').eq(23).position().top, 'Cell coordinates are right');
            assert.roughEqual(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(23).position().left, 0.01, 'Cell coordinates are right');
        });

        skip('Work space should find cell coordinates by date depend on start day hour', function(assert) {
            const $element = this.instance.$element();

            this.instance.option('currentDate', new Date(2015, 2, 4));
            this.instance.option('startDayHour', 5);
            this.instance.option('firstDayOfWeek', 5);

            const coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 5, 6, 0));
            assert.roughEqual(coords.top, $element.find('.dx-scheduler-date-table tbody td').eq(14).position().top, 1, 'Cell coordinates are right');
            assert.roughEqual(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(14).position().left, 0.01, 'Cell coordinates are right');
        });

        skip('Work space should find cell coordinates by date depend on end day hour', function(assert) {
            const $element = this.instance.$element();

            this.instance.option('currentDate', new Date(2015, 2, 4));
            this.instance.option('endDayHour', 10);
            this.instance.option('firstDayOfWeek', 1);

            const coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2015, 2, 5, 0, 30));
            assert.equal(coords.top, $element.find('.dx-scheduler-date-table tbody td').eq(8).position().top, 'Cell coordinates are right');
            assert.roughEqual(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(8).position().left, 0.01, 'Cell coordinates are right');
        });

        test('Get date range', function(assert) {
            this.instance.option('firstDayOfWeek', 1);
            this.instance.option('currentDate', new Date(2015, 2, 16));

            assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 16, 0, 0), new Date(2015, 2, 20, 23, 59)], 'Range is OK');
        });

        test('Scheduler allDay title should have correct text after changing currentDate', function(assert) {
            this.instance.option('showAllDayPanel', true);
            this.instance.option('currentDate', new Date(2017, 2, 4));

            const $allDayTitle = this.instance.$element().find('.dx-scheduler-all-day-title');

            assert.equal($allDayTitle.text(), 'All day', 'All-day title is correct');
        });
    });

    module('it with intervalCount', {
        beforeEach: function() {
            this.createInstance = function(options) {
                this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWorkWeek(options).dxSchedulerWorkSpaceWorkWeek('instance');
            };
        }
    }, () => {
        skip('getCoordinatesByDate should return right coordinates with view option intervalCount', function(assert) {
            this.createInstance({
                intervalCount: 2,
                currentDate: new Date(2017, 5, 25),
                startDayHour: 8,
                endDayHour: 20
            });

            const $element = this.instance.$element();

            const coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2017, 6, 6, 12, 0), 0, false);
            const targetCellPosition = $element.find('.dx-scheduler-date-table tbody td').eq(88).position();

            assert.equal(coords.top, targetCellPosition.top, 'Cell coordinates are right');
            assert.roughEqual(coords.left, targetCellPosition.left, 0.01, 'Cell coordinates are right');
        });

        skip('getCoordinatesByDate should return right coordinates with view option intervalCount, short day duration', function(assert) {
            this.createInstance({
                intervalCount: 2,
                currentDate: new Date(2017, 5, 25),
                startDayHour: 10,
                endDayHour: 13
            });

            const $element = this.instance.$element();

            const coords = this.instance.positionHelper.getCoordinatesByDate(new Date(2017, 6, 6, 12, 0), 0, false);
            const targetCellPosition = $element.find('.dx-scheduler-date-table tbody td').eq(48).position();

            assert.equal(coords.top, targetCellPosition.top, 'Cell coordinates are right');
            assert.roughEqual(coords.left, targetCellPosition.left, 0.01, 'Cell coordinates are right');
        });

        test('WorkSpace WorkWeek view cells have right cellData with view option intervalCount', function(assert) {
            this.createInstance({
                intervalCount: 2,
                currentDate: new Date(2017, 5, 25),
                renovateRender: false,
            });

            const firstCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(4).data('dxCellData');
            const secondCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(5).data('dxCellData');
            const thirdCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(479).data('dxCellData');

            assert.deepEqual(firstCellData.startDate, new Date(2017, 5, 30, 0), 'cell has right startDate');
            assert.deepEqual(firstCellData.endDate, new Date(2017, 5, 30, 0, 30), 'cell has right endtDate');

            assert.deepEqual(secondCellData.startDate, new Date(2017, 6, 3, 0), 'cell has right startDate');
            assert.deepEqual(secondCellData.endDate, new Date(2017, 6, 3, 0, 30), 'cell has right endtDate');

            assert.deepEqual(thirdCellData.startDate, new Date(2017, 6, 7, 23, 30), 'cell has right startDate');
            assert.deepEqual(thirdCellData.endDate, new Date(2017, 6, 8, 0), 'cell has right endtDate');
        });

        test('WorkSpace WorkWeek view cells have right cellData with view option intervalCount = 3 and startDate < currentDate', function(assert) {
            this.createInstance({
                intervalCount: 3,
                hoursInterval: 1,
                firstDayOfWeek: 1,
                currentDate: new Date(2017, 6, 26),
                startDate: new Date(2017, 6, 4),
                renovateRender: false,
            });

            const firstCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).data('dxCellData');
            const secondCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(82).data('dxCellData');
            const thirdCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').last().data('dxCellData');

            assert.deepEqual(firstCellData.startDate, new Date(2017, 6, 24, 0), 'cell has right startDate');
            assert.deepEqual(firstCellData.endDate, new Date(2017, 6, 24, 1), 'cell has right endtDate');

            assert.deepEqual(secondCellData.startDate, new Date(2017, 7, 2, 5), 'cell has right startDate');
            assert.deepEqual(secondCellData.endDate, new Date(2017, 7, 2, 6), 'cell has right endtDate');

            assert.deepEqual(thirdCellData.startDate, new Date(2017, 7, 11, 23), 'cell has right startDate');
            assert.deepEqual(thirdCellData.endDate, new Date(2017, 7, 12, 0), 'cell has right endtDate');
        });

        test('WorkSpace WorkWeek view cells have right cellData with view option intervalCount = 3 and startDate > currentDate', function(assert) {
            this.createInstance({
                intervalCount: 2,
                hoursInterval: 1,
                firstDayOfWeek: 1,
                currentDate: new Date(2017, 6, 4),
                startDate: new Date(2017, 6, 26),
                renovateRender: false,
            });

            const firstCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).data('dxCellData');
            const secondCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(36).data('dxCellData');
            const thirdCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').last().data('dxCellData');

            assert.deepEqual(firstCellData.startDate, new Date(2017, 5, 26, 0), 'cell has right startDate');
            assert.deepEqual(firstCellData.endDate, new Date(2017, 5, 26, 1), 'cell has right endtDate');

            assert.deepEqual(secondCellData.startDate, new Date(2017, 6, 4, 3), 'cell has right startDate');
            assert.deepEqual(secondCellData.endDate, new Date(2017, 6, 4, 4), 'cell has right endtDate');

            assert.deepEqual(thirdCellData.startDate, new Date(2017, 6, 7, 23), 'cell has right startDate');
            assert.deepEqual(thirdCellData.endDate, new Date(2017, 6, 8, 0), 'cell has right endtDate');
        });

        test('Get date range', function(assert) {
            this.createInstance({
                intervalCount: 3,
                currentDate: new Date(2017, 5, 26)
            });

            assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 26, 0, 0), new Date(2017, 6, 14, 23, 59)], 'Range is OK');

            this.instance.option('intervalCount', 4);
            assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 26, 0, 0), new Date(2017, 6, 21, 23, 59)], 'Range is OK');
        });

        test('Grouped WorkSpace WorkWeek view cells have right cellData with view option intervalCount', function(assert) {
            this.createInstance({
                intervalCount: 2,
                hoursInterval: 1,
                firstDayOfWeek: 1,
                currentDate: new Date(2017, 6, 4),
                renovateRender: false,
            });

            this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

            const firstCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).data('dxCellData');
            const secondCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(5).data('dxCellData');
            const thirdCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(10).data('dxCellData');
            const lastCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(15).data('dxCellData');

            assert.deepEqual(firstCellData.startDate, new Date(2017, 6, 3, 0), 'cell has right startDate');
            assert.deepEqual(firstCellData.endDate, new Date(2017, 6, 3, 1), 'cell has right endtDate');

            assert.deepEqual(secondCellData.startDate, new Date(2017, 6, 10, 0), 'cell has right startDate');
            assert.deepEqual(secondCellData.endDate, new Date(2017, 6, 10, 1), 'cell has right endtDate');

            assert.deepEqual(thirdCellData.startDate, new Date(2017, 6, 3, 0), 'cell has right startDate');
            assert.deepEqual(thirdCellData.endDate, new Date(2017, 6, 3, 1), 'cell has right endtDate');

            assert.deepEqual(lastCellData.startDate, new Date(2017, 6, 10, 0), 'cell has right startDate');
            assert.deepEqual(lastCellData.endDate, new Date(2017, 6, 10, 1), 'cell has right endtDate');
        });

        skip('getCoordinatesByDateInGroup method should return only work week days (t853629)', function(assert) {
            this.createInstance({
                intervalCount: 2,
                currentDate: new Date(2018, 4, 21),
            });

            assert.ok(!this.instance.positionHelper.getCoordinatesByDateInGroup(new Date(2018, 4, 26))[0]);
            assert.ok(!this.instance.positionHelper.getCoordinatesByDateInGroup(new Date(2018, 4, 27))[0]);
            assert.ok(this.instance.positionHelper.getCoordinatesByDateInGroup(new Date(2018, 4, 23))[0]);
            assert.ok(this.instance.positionHelper.getCoordinatesByDateInGroup(new Date(2018, 4, 28))[0]);
        });
    });
});
