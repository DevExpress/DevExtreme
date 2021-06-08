import resizeCallbacks from 'core/utils/resize_callbacks';
import 'generic_light.css!';
import $ from 'jquery';

import { stubInvokeMethod } from '../../helpers/scheduler/workspaceTestHelper.js';

import 'ui/scheduler/workspaces/ui.scheduler.work_space_month';
import { createFactoryInstances } from 'ui/scheduler/instanceFactory';

const CELL_CLASS = 'dx-scheduler-date-table-cell';

const {
    test,
    module,
    testStart
} = QUnit;

testStart(function() {
    $('#qunit-fixture').html('<div class="dx-scheduler"><div id="scheduler-work-space"></div></div>');
});

module('Work Space Month', () => {
    module('Default', {
        beforeEach: function() {
            createFactoryInstances({
                scheduler: {
                    isVirtualScrolling: () => false
                }
            });

            this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceMonth().dxSchedulerWorkSpaceMonth('instance');
            stubInvokeMethod(this.instance);
        }
    }, () => {
        [true, false].forEach((renovateRender) => {
            test(`Scheduler all day panel is invisible on month view after switching showAllDayPanel option when renovateRender is ${renovateRender}`, function(assert) {
                this.instance.option('renovateRender', renovateRender);
                this.instance.option('showAllDayPanel', false);
                this.instance.option('showAllDayPanel', true);

                const $allDayPanel = this.instance.$element().find('.dx-scheduler-all-day-panel');

                assert.equal($allDayPanel.length, 0, 'allDay panel is invisible');
            });

            test(`Scheduler all day title is invisible on month view after switching showAllDayPanel option when renovateRender is ${renovateRender}`, function(assert) {
                this.instance.option('renovateRender', renovateRender);
                this.instance.option('showAllDayPanel', false);
                this.instance.option('showAllDayPanel', true);

                const $allDayTitle = this.instance.$element().find('.dx-scheduler-all-day-title');

                assert.equal($allDayTitle.length, 0, 'All-day title is invisible');
            });
        });

        test('Work space should find cell coordinates by date', function(assert) {
            const $element = this.instance.$element();

            this.instance.option('firstDayOfWeek', 1);
            this.instance.option('currentDate', new Date(2015, 2, 4));

            const coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 5, 0, 0));
            const expectedCoordinates = $element.find('.dx-scheduler-date-table tbody td').eq(10).position();

            assert.roughEqual(coords.top, Math.floor(expectedCoordinates.top), 1.001, 'Cell coordinates are right');
            assert.roughEqual(coords.left, expectedCoordinates.left, 0.01, 'Cell coordinates are right');
        });

        test('Work space should find cell coordinates by date depend on start day hour', function(assert) {
            const $element = this.instance.$element();

            this.instance.option('currentDate', new Date(2015, 2, 4));
            this.instance.option('firstDayOfWeek', 7);
            this.instance.option('startDayHour', 5);

            const coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 5, 6, 0));
            assert.roughEqual(coords.top, $element.find('.dx-scheduler-date-table tbody td').eq(4).position().top, 1, 'Cell coordinates are right');
            assert.roughEqual(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(4).position().left, 0.01, 'Cell coordinates are right');
        });

        test('Work space should find cell coordinates by date depend on end day hour', function(assert) {
            const $element = this.instance.$element();

            this.instance.option('currentDate', new Date(2015, 2, 4));
            this.instance.option('firstDayOfWeek', 7);
            this.instance.option('endDayHour', 10);

            const coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 5, 6, 0));
            assert.roughEqual(coords.top, $element.find('.dx-scheduler-date-table tbody td').eq(4).position().top, 1, 'Cell coordinates are right');
            assert.roughEqual(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(4).position().left, 0.01, 'Cell coordinates are right');
        });

        test('Get date range', function(assert) {
            this.instance.option('firstDayOfWeek', 1);
            this.instance.option('currentDate', new Date(2018, 8, 5));

            assert.deepEqual(this.instance.getDateRange(), [new Date(2018, 7, 27, 0, 0), new Date(2018, 9, 7, 23, 59)], 'Range is OK');
        });

        test('Get date range when startDayHour & endDayHour are specified', function(assert) {
            this.instance.option({
                firstDayOfWeek: 1,
                currentDate: new Date(2015, 2, 16),
                startDayHour: 8,
                endDayHour: 20
            });
            this.instance.option('currentDate', new Date(2015, 2, 16));

            assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 1, 23, 8, 0), new Date(2015, 3, 5, 19, 59)], 'Range is OK');
        });

        test('Each cell should contain jQuery dxCellData depend on start day hour', function(assert) {
            this.instance.option({
                currentDate: new Date(2015, 2, 16),
                firstDayOfWeek: 1,
                startDayHour: 5,
                renovateRender: false,
            });

            const $cell = this.instance.$element().find('.' + CELL_CLASS).eq(0);

            assert.deepEqual($cell.data('dxCellData'), {
                startDate: new Date(2015, 1, 23, 5, 0),
                endDate: new Date(2015, 1, 24, 0, 0),
                allDay: undefined,
                groupIndex: 0,
            });
        });

        test('Each cell should contain jQuery dxCellData depend on end day hour', function(assert) {
            this.instance.option({
                currentDate: new Date(2015, 2, 16),
                firstDayOfWeek: 1,
                endDayHour: 10,
                renovateRender: false,
            });

            const $cell = this.instance.$element().find('.' + CELL_CLASS).eq(0);

            assert.deepEqual($cell.data('dxCellData'), {
                startDate: new Date(2015, 1, 23, 0, 0),
                endDate: new Date(2015, 1, 23, 10, 0),
                allDay: undefined,
                groupIndex: 0,
            });
        });

        test('Each cell should contain jQuery dxCellData depend on fractional hoursInterval', function(assert) {
            this.instance.option({
                currentDate: new Date(2015, 2, 16),
                firstDayOfWeek: 1,
                hoursInterval: 2.1666666666666665,
                endDayHour: 5,
                renovateRender: false,
            });

            const $cell = this.instance.$element().find('.' + CELL_CLASS).eq(0);

            assert.deepEqual($cell.data('dxCellData'), {
                startDate: new Date(2015, 1, 23, 0, 0),
                endDate: new Date(2015, 1, 23, 5, 0),
                allDay: undefined,
                groupIndex: 0,
            });
        });

        [true, false].forEach((renovateRender) => {
            test(`WorkSpace should calculate max left position when renovateRender is ${renovateRender}`, function(assert) {
                this.instance.option({
                    currentDate: new Date(2015, 2, 16),
                    firstDayOfWeek: 1,
                    renovateRender,
                });

                const $lastCell = this.instance.$element().find('.dx-scheduler-date-table').find('td').eq(6);

                assert.deepEqual(this.instance.getMaxAllowedPosition(),
                    Math.round($lastCell.position().left + $lastCell.outerWidth()), 'Max left position is correct');
            });

            test(`Grouped work space should calculate max left position when renovateRender is ${renovateRender}`, function(assert) {
                this.instance.option({
                    currentDate: new Date(2015, 2, 16),
                    firstDayOfWeek: 1,
                    groups: [{
                        name: 'one',
                        items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                    },
                    {
                        name: 'two',
                        items: [{ id: 1, text: 'c' }, { id: 2, text: 'd' }]
                    }],
                    renovateRender,
                });

                const $cells = this.instance.$element().find('.dx-scheduler-date-table tr').first().find('td');
                const $firstGroupLastCell = $cells.eq(6);
                const $secondGroupLastCell = $cells.eq(13);
                const $thirdGroupLastCell = $cells.eq(20);
                const $fourthGroupLastCell = $cells.eq(27);

                const expectedResult = [
                    Math.round($firstGroupLastCell.position().left + $firstGroupLastCell.get(0).getBoundingClientRect().width),
                    Math.round($secondGroupLastCell.position().left + $secondGroupLastCell.get(0).getBoundingClientRect().width),
                    Math.round($thirdGroupLastCell.position().left + $thirdGroupLastCell.get(0).getBoundingClientRect().width),
                    Math.round($fourthGroupLastCell.position().left + $fourthGroupLastCell.get(0).getBoundingClientRect().width)
                ];

                const actualResult = [0, 1, 2, 3].map((groupIndex) => {
                    return this.instance.getMaxAllowedPosition(groupIndex);
                });

                assert.deepEqual(actualResult, expectedResult, 'Max left positions are correct');
            });
        });

        test('Group width calculation', function(assert) {
            this.instance.option('groups', [{ name: 'one', items: [{ id: 1, text: 'a' }] }]);
            sinon.stub(this.instance, 'getCellWidth').returns(50);

            assert.equal(this.instance.getGroupWidth(), 350, 'Group width is OK');
        });

        test('Get cell count to last view date', function(assert) {
            this.instance.option({
                currentDate: new Date(2015, 1, 16),
                firstDayOfWeek: 1
            });

            assert.equal(this.instance.getCellCountToLastViewDate(new Date(2015, 1, 17)), 20, 'Cell count is OK');
        });

        test('Get cell count to last view dates', function(assert) {
            this.instance.option('renovateRender', false);

            const origGetFirstViewDate = this.instance.getStartViewDate;

            this.instance.getStartViewDate = function() {
                return new Date(2016, 1, 29, 5, 0);
            };

            try {
                this.instance.option({
                    currentDate: new Date(2016, 2, 14, 0, 0),
                    startDayHour: 5
                });

                const $cell = this.instance._getCells().eq(14);

                assert.deepEqual($cell.data('dxCellData'), {
                    startDate: new Date(2016, 2, 14, 5, 0),
                    endDate: new Date(2016, 2, 15, 0, 0),
                    allDay: undefined,
                    groupIndex: 0,
                }, 'data of the cell is right');
            } finally {
                this.instance.getStartViewDate = origGetFirstViewDate;
            }
        });

        test('Cells have right cellData in horizontal grouped WorkSpace Month view', function(assert) {
            this.instance.option({
                currentDate: new Date(2018, 2, 1),
                groupOrientation: 'vertical',
                groups: [{
                    name: 'one',
                    items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
                }],
                renovateRender: false,
            });

            const firstCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).data('dxCellData');
            const secondCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(51).data('dxCellData');

            assert.deepEqual(firstCellData.startDate, new Date(2018, 1, 25, 0), 'cell has right startDate');
            assert.deepEqual(firstCellData.endDate, new Date(2018, 1, 26, 0), 'cell has right endtDate');

            assert.deepEqual(secondCellData.startDate, new Date(2018, 2, 6, 0), 'cell has right startDate');
            assert.deepEqual(secondCellData.endDate, new Date(2018, 2, 7, 0), 'cell has right endtDate');
        });

    });

    module('it with grouping by date', {
        beforeEach: function() {
            this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceMonth({
                currentDate: new Date(2018, 2, 1),
                groupByDate: true,
                showCurrentTimeIndicator: false
            }).dxSchedulerWorkSpaceMonth('instance');

            stubInvokeMethod(this.instance);

            this.instance.option('groups', [{
                name: 'one',
                items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
            }]);
        }
    }, () => {
        test('Work space should find cell coordinates by date, groupByDate = true', function(assert) {
            const $element = this.instance.$element();

            this.instance.option('currentDate', new Date(2015, 2, 4));

            let coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 4), 1, false);

            assert.roughEqual(coords.top, $element.find('.dx-scheduler-date-table tbody td').eq(7).position().top, 1.1, 'Top cell coordinates are right');
            assert.roughEqual(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(7).position().left, 1.1, 'Left cell coordinates are right');
            assert.roughEqual(coords.hMax, 998, 1.1, 'hMax is right');

            coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 21), 0, false);

            assert.roughEqual(coords.top, $element.find('.dx-scheduler-date-table tbody td').eq(40).position().top, 1.1, 'Top cell coordinates are right');
            assert.roughEqual(coords.left, $element.find('.dx-scheduler-date-table tbody td').eq(40).position().left, 1.1, 'Left cell coordinates are right');
            assert.roughEqual(coords.hMax, 998, 1.1, 'hMax is right');
        });
    });

    module('it with horizontal grouping', {
        beforeEach: function() {
            this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceMonth({
                currentDate: new Date(2018, 2, 1),
                groupOrientation: 'vertical',
                crossScrollingEnabled: true
            }).dxSchedulerWorkSpaceMonth('instance');

            stubInvokeMethod(this.instance);

            this.instance.option('groups', [{
                name: 'one',
                items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }]
            }]);
        }
    }, () => {
        test('Group table content should have right height', function(assert) {
            const $groupHeaderContents = this.instance.$element().find('.dx-scheduler-group-header');
            resizeCallbacks.fire();
            assert.roughEqual($groupHeaderContents.eq(0).outerHeight(), 449, 5, 'Group header content height is OK');
            assert.roughEqual($groupHeaderContents.eq(1).outerHeight(), 449, 5, 'Group header content height is OK');
        });

        test('Group width calculation', function(assert) {
            sinon.stub(this.instance, 'getCellWidth').returns(50);

            assert.equal(this.instance.getGroupWidth(), 350, 'Group width is OK');
        });

        test('Tables should not be rerendered if dimension was changed and horizontal scrolling is disabled', function(assert) {
            this.instance.option('crossScrollingEnabled', false);
            const stub = sinon.stub(this.instance, '_setTableSizes');

            resizeCallbacks.fire();

            assert.notOk(stub.calledOnce, 'Tables weren\'t updated');
        });

    });

    module('it with intervalCount', {
        beforeEach: function() {
            this.createInstance = function(options) {
                this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceMonth(options).dxSchedulerWorkSpaceMonth('instance');
                stubInvokeMethod(this.instance);
            };
        }
    }, () => {
        test('WorkSpace Month view cells have right cellData with view option intervalCount & startDate < currentDate', function(assert) {
            this.createInstance({
                intervalCount: 3,
                currentDate: new Date(2017, 4, 25),
                startDate: new Date(2017, 0, 15),
                renovateRender: false,
            });

            const firstCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).data('dxCellData');
            const secondCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(35).data('dxCellData');
            const thirdCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').last().data('dxCellData');

            assert.deepEqual(firstCellData.startDate, new Date(2017, 2, 26, 0), 'cell has right startDate');
            assert.deepEqual(firstCellData.endDate, new Date(2017, 2, 27, 0), 'cell has right endtDate');

            assert.deepEqual(secondCellData.startDate, new Date(2017, 3, 30, 0), 'cell has right startDate');
            assert.deepEqual(secondCellData.endDate, new Date(2017, 4, 1, 0), 'cell has right endtDate');

            assert.deepEqual(thirdCellData.startDate, new Date(2017, 6, 1, 0), 'cell has right startDate');
            assert.deepEqual(thirdCellData.endDate, new Date(2017, 6, 2, 0), 'cell has right endtDate');
        });

        test('WorkSpace Month view cells have right cellData with view option intervalCount & startDate > currentDate', function(assert) {
            this.createInstance({
                intervalCount: 3,
                currentDate: new Date(2017, 1, 15),
                startDate: new Date(2017, 5, 15),
                renovateRender: false,
            });

            const firstCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).data('dxCellData');
            const secondCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(35).data('dxCellData');
            const thirdCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').last().data('dxCellData');

            assert.deepEqual(firstCellData.startDate, new Date(2016, 10, 27, 0), 'cell has right startDate');
            assert.deepEqual(firstCellData.endDate, new Date(2016, 10, 28, 0), 'cell has right endtDate');

            assert.deepEqual(secondCellData.startDate, new Date(2017, 0, 1, 0), 'cell has right startDate');
            assert.deepEqual(secondCellData.endDate, new Date(2017, 0, 2, 0), 'cell has right endtDate');

            assert.deepEqual(thirdCellData.startDate, new Date(2017, 2, 4, 0), 'cell has right startDate');
            assert.deepEqual(thirdCellData.endDate, new Date(2017, 2, 5, 0), 'cell has right endtDate');
        });

        test('WorkSpace Month view cells have right cellData with view option intervalCount & startDate = currentDate', function(assert) {
            this.createInstance({
                intervalCount: 3,
                currentDate: new Date(2017, 6, 15),
                startDate: new Date(2017, 5, 15),
                renovateRender: false,
            });

            const firstCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).data('dxCellData');
            const secondCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(35).data('dxCellData');
            const thirdCellData = this.instance.$element().find('.dx-scheduler-date-table-cell').last().data('dxCellData');

            assert.deepEqual(firstCellData.startDate, new Date(2017, 4, 28, 0), 'cell has right startDate');
            assert.deepEqual(firstCellData.endDate, new Date(2017, 4, 29, 0), 'cell has right endtDate');

            assert.deepEqual(secondCellData.startDate, new Date(2017, 6, 2, 0), 'cell has right startDate');
            assert.deepEqual(secondCellData.endDate, new Date(2017, 6, 3, 0), 'cell has right endtDate');

            assert.deepEqual(thirdCellData.startDate, new Date(2017, 8, 2, 0), 'cell has right startDate');
            assert.deepEqual(thirdCellData.endDate, new Date(2017, 8, 3, 0), 'cell has right endtDate');
        });

        test('Get date range', function(assert) {
            this.createInstance({
                intervalCount: 3,
                currentDate: new Date(2017, 5, 26),
            });

            assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 4, 28, 0, 0), new Date(2017, 8, 2, 23, 59)], 'Range is OK');

            this.instance.option('intervalCount', 4);
            assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 4, 28, 0, 0), new Date(2017, 8, 30, 23, 59)], 'Range is OK');
        });
    });
});
