import resizeCallbacks from 'core/utils/resize_callbacks';
import 'generic_light.css!';
import $ from 'jquery';

import { stubInvokeMethod, getObserver } from '../../helpers/scheduler/workspaceTestHelper.js';

import 'ui/scheduler/workspaces/ui.scheduler.work_space_week';
import { createFactoryInstances } from 'ui/scheduler/instanceFactory.js';

const {
    test,
    module,
    testStart
} = QUnit;

testStart(function() {
    $('#qunit-fixture').html('<div class="dx-scheduler"><div id="scheduler-work-space"></div></div>');
});

module('Work Space cellData Cache', {
    beforeEach: function() {

        const key = createFactoryInstances({
            scheduler: {
                isVirtualScrolling: () => false
            }
        });
        const observer = getObserver(key);

        this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWeek({ observer }).dxSchedulerWorkSpaceWeek('instance');
        stubInvokeMethod(this.instance, { key });
    }
}, () => {
    test('Workspace should be able to cache cellData', function(assert) {
        let cache;
        const $cell = { startDate: 2015, endDate: 2016 };
        const getCellDataStub = sinon.stub(this.instance, 'getCellData').returns($cell);
        const cellCoordinates = {
            rowIndex: 1,
            columnIndex: 0
        };

        try {
            this.instance.setCellDataCache(cellCoordinates, 0, $cell);

            cache = this.instance.cache;

            assert.deepEqual(cache.get('{"rowIndex":1,"columnIndex":0,"groupIndex":0}'), {
                startDate: 2015,
                endDate: 2016
            }, 'Cache is OK');

        } finally {
            getCellDataStub.restore();
        }
    });

    test('CellData cache set correct alias', function(assert) {
        const $cell = { startDate: 2015, endDate: 2016 };
        const getCellDataStub = sinon.stub(this.instance, 'getCellData').returns($cell);

        try {
            const appointment = {
                rowIndex: 1,
                columnIndex: 0,
                groupIndex: 0
            };
            const geometry = {
                top: 10,
                left: 10
            };
            const aliasKey = JSON.stringify({
                top: geometry.top,
                left: geometry.left
            });

            this.instance.setCellDataCache(appointment, 0, $cell);
            this.instance.setCellDataCacheAlias(appointment, geometry);

            const cacheData = this.instance.cache.get(aliasKey);

            assert.deepEqual(cacheData, {
                'endDate': 2016,
                'startDate': 2015
            }, 'Cache Data Alias is OK');

        } finally {
            getCellDataStub.restore();
        }
    });

    test('getCellDataByCoordinates return cached cell data', function(assert) {
        const appointment = {
            rowIndex: 1,
            columnIndex: 0,
            groupIndex: 0
        };
        const geometry = {
            top: 10,
            left: 10
        };
        const aliasKey = JSON.stringify({
            top: geometry.top,
            left: geometry.left,
        });
        const $cell = {
            startDate: 2015,
            endDate: 2016
        };
        const getCellDataStub = sinon.stub(this.instance, 'getCellData').returns($cell);
        const aliasCellCache = sinon.spy(this.instance.cache, 'get').withArgs(aliasKey);

        try {

            this.instance.setCellDataCache(appointment, 0, $cell);
            this.instance.setCellDataCacheAlias(appointment, geometry);

            const cellData = this.instance.getCellDataByCoordinates({ top: 10, left: 10 });

            assert.ok(getCellDataStub.calledOnce, 'getCellData called once');
            assert.ok(aliasCellCache.calledOnce, 'getCellDataByCoordinates called aliasCellCache once');
            assert.deepEqual(aliasCellCache.getCall(0).returnValue, {
                'endDate': 2016,
                'startDate': 2015
            }, 'aliasCellCache return correct cellData object');
            assert.deepEqual(cellData, {
                'endDate': 2016,
                'startDate': 2015
            }, 'getCellDataByCoordinates returns correct cellData object');

        } finally {
            getCellDataStub.restore();
        }
    });

    test('Work space should return correct cell data if option changed (cleanCellDataCache)', function(assert) {
        const workSpace = this.instance;
        const $element = this.instance.$element();
        const appointment = {
            columnIndex: 0,
            rowIndex: 0,
            groupIndex: 0
        };
        const geometry = {
            top: 10,
            left: 120
        };
        const testDataList = [
            {
                optionName: 'currentDate',
                optionValue: new Date(2016, 4, 12),
                cellDataCompare: {
                    allDay: false,
                    startDate: new Date(2016, 4, 8),
                    endDate: new Date(2016, 4, 8, 0, 30),
                    groupIndex: 0,
                }
            }, {
                optionName: 'hoursInterval',
                optionValue: 0.3,
                cellDataCompare: {
                    allDay: false,
                    startDate: new Date(2016, 4, 8),
                    endDate: new Date(2016, 4, 8, 0, 18),
                    groupIndex: 0,
                }
            }, {
                optionName: 'firstDayOfWeek',
                optionValue: 3,
                cellDataCompare: {
                    allDay: false,
                    startDate: new Date(2016, 4, 11),
                    endDate: new Date(2016, 4, 11, 0, 18, 0),
                    groupIndex: 0,
                }
            }, {
                optionName: 'groups',
                optionValue: [{ name: 'one', items: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }],
                cellDataCompare: {
                    allDay: false,
                    startDate: new Date(2016, 4, 11),
                    endDate: new Date(2016, 4, 11, 0, 18, 0),
                    groups: { one: 1 },
                    groupIndex: 0,
                }
            }, {
                optionName: 'startDayHour',
                optionValue: 2,
                cellDataCompare: {
                    allDay: false,
                    startDate: new Date(2016, 4, 11, 2),
                    endDate: new Date(2016, 4, 11, 2, 18, 0),
                    groups: { one: 1 },
                    groupIndex: 0,
                }
            }, {
                optionName: 'endDayHour',
                optionValue: 23,
                cellDataCompare: {
                    allDay: false,
                    startDate: new Date(2016, 4, 11, 2),
                    endDate: new Date(2016, 4, 11, 2, 18),
                    groups: { one: 1 },
                    groupIndex: 0,
                }
            }
        ];

        workSpace.option('currentDate', new Date(2016, 3, 12));

        testDataList.forEach(function(testData) {
            const $firstCell = $element.find('.dx-scheduler-date-table-cell').first();

            workSpace.setCellDataCache(appointment, 0, $firstCell);
            workSpace.setCellDataCacheAlias(appointment, geometry);

            workSpace.option(testData.optionName, testData.optionValue);
            assert.ok($.isEmptyObject(workSpace.cache.size), `Cell data cache was cleared after ${testData.optionName} option changing`);

            const cellData = workSpace.getCellDataByCoordinates(geometry);
            assert.deepEqual(cellData, testData.cellDataCompare, `Cell data cache was cleared after ${testData.optionName} option changing`);
        });
    });

    test('Cell data cache should be cleared when dimensions were changed', function(assert) {
        const workSpace = this.instance;
        const $element = this.instance.$element();
        const appointment = {
            columnIndex: 0,
            rowIndex: 0,
            groupIndex: 0
        };
        const geometry = {
            top: 10,
            left: 120
        };

        const $firstCell = $element.find('.dx-scheduler-date-table-cell').first();

        workSpace.setCellDataCache(appointment, 0, $firstCell);
        workSpace.setCellDataCacheAlias(appointment, geometry);

        resizeCallbacks.fire();

        const cache = workSpace.cache;

        assert.equal(cache.size, 2, 'Cache has no cell data');
        assert.ok(cache.get('cellWidth'), 'Has cached cell width');
        assert.ok(cache.get('cellHeight'), 'Has cached cell height');
    });
});
