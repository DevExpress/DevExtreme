import $ from 'jquery';
import SchedulerResourcesManager from 'ui/scheduler/ui.scheduler.resource_manager';
import resizeCallbacks from 'core/utils/resize_callbacks';

const SCHEDULER_DATE_TIME_SHADER_CLASS = 'dx-scheduler-date-time-shader';
const SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS = 'dx-scheduler-date-time-shader-all-day';
const SCHEDULER_DATE_TIME_INDICATOR_CLASS = 'dx-scheduler-date-time-indicator';
const SCHEDULER_DATE_TABLE_CELL_CLASS = 'dx-scheduler-date-table-cell';

import 'common.css!';
import 'generic_light.css!';

import 'ui/scheduler/workspaces/ui.scheduler.work_space_day';
import 'ui/scheduler/workspaces/ui.scheduler.work_space_week';
import 'ui/scheduler/workspaces/ui.scheduler.timeline_day';
import 'ui/scheduler/workspaces/ui.scheduler.timeline_week';
import 'ui/scheduler/workspaces/ui.scheduler.timeline_work_week';
import 'ui/scheduler/workspaces/ui.scheduler.timeline_month';

QUnit.testStart(function() {
    $('#qunit-fixture').html('</div><div id="scheduler-work-space-rtl"></div><div id="scheduler-work-space">');
});

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
    });
};

const testShader = function(testCase, $element, assert) {
    const $shader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS);
    assert.equal($shader.length, testCase.shaderCount, 'Shader was rendered in appropriate cells');

    const $allDayShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS);
    testCase.allDayShaderCount && assert.equal($allDayShader.length, testCase.allDayShaderCount, 'AllDay shader was rendered in appropriate cells');

    if(testCase.lastShaderHeight || testCase.lastShaderWidth) {
        testCase.lastShaderIndexes.forEach(index => {
            const $lastIndicationCell = $element.find('.' + SCHEDULER_DATE_TABLE_CELL_CLASS).eq(index);
            const $lastShader = $lastIndicationCell.find(`.${SCHEDULER_DATE_TIME_SHADER_CLASS}-last`);

            assert.equal($lastShader.length, 1, 'Last shader placed in a correct height');
            testCase.lastShaderHeight && assert.roughEqual($lastShader.height(), testCase.lastShaderHeight, 1, 'Last shader has a correct height');
            testCase.lastShaderWidth && assert.roughEqual($lastShader.width(), testCase.lastShaderWidth, 1, 'Last shader has a correct width');
        });
    } else {
        const $lastShader = $element.find(`.${SCHEDULER_DATE_TIME_SHADER_CLASS}-last`);
        assert.equal($lastShader.length, 0, 'There are no last shader');
    }
};

const testIndicators = function(testCases, $element, assert) {
    const $indicators = $element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS);
    assert.equal($indicators.length, testCases.length, 'Indicator count is correct');

    testCases.forEach(({ cellIndex, offset, isSimple }, index) => {
        const $cell = $element.find('.' + SCHEDULER_DATE_TABLE_CELL_CLASS).eq(cellIndex);
        const $indicator = $indicators.eq(index);

        assert.equal($indicators.eq(index).parent().get(0), $cell.get(0), 'Indicator was placed in the correct cell');
        assert.equal($indicators.eq(index).css('top'), offset.top, 'Indicator has correct top offset');
        assert.equal($indicators.eq(index).css('left'), offset.left, 'Indicator has correct left offset');

        isSimple ? assert.ok($indicator.hasClass('dx-scheduler-date-time-indicator-simple'), 'Indicator is simple') :
            assert.notOk($indicator.hasClass('dx-scheduler-date-time-indicator-simple'), 'Indicator is usual');
    });
};

(function() {
    QUnit.module('DateTime indicator on Day View', {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();

            this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceDay({
                showCurrentTimeIndicator: true,
                currentDate: new Date(2017, 8, 5),
                startDayHour: 8,
            }).dxSchedulerWorkSpaceDay('instance');
            stubInvokeMethod(this.instance);
        },
        afterEach: function() {
            this.clock.restore();
        }
    });

    QUnit.test('DateTimeIndicator should be rendered if needed, Day view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        let $element = this.instance.$element();

        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 1, 'Indicator is rendered correctly');

        this.instance.option('showCurrentTimeIndicator', false);
        $element = this.instance.$element();

        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 0, 'Indicator wasn\'t rendered');
    });

    QUnit.test('DateTimeIndicator should be wrapped by appropriate cell, Day view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });
        const $element = this.instance.$element();
        const $cell = $element.find('.' + SCHEDULER_DATE_TABLE_CELL_CLASS).eq(9);

        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).eq(0).parent().get(0), $cell.get(0), 'Cell contains time indicator');
    });

    QUnit.test('Indication should be updated by some timer', function(assert) {
        const renderIndicatorStub = sinon.stub(this.instance, '_renderDateTimeIndication');

        this.instance.option({
            indicatorUpdateInterval: 20
        });

        const timer = setTimeout(function() {
            assert.ok(renderIndicatorStub.calledTwice, 'Indicator was updated');
        }, 40);

        this.clock.tick(40);
        clearTimeout(timer);
    });

    QUnit.test('Indication should not be updated by some timer if indicatorUpdateInterval = 0', function(assert) {
        const renderIndicatorStub = sinon.stub(this.instance, '_renderDateTimeIndication');

        this.instance.option({
            indicatorUpdateInterval: 0
        });

        const timer = setTimeout(function() {
            assert.equal(renderIndicatorStub.callCount, 0, 'Indicator wasn\'t updated');
        }, 40);

        this.clock.tick(40);
        clearTimeout(timer);
    });

    QUnit.test('Indication should be updated on dimensionChanged', function(assert) {
        const renderIndicatorStub = sinon.stub(this.instance, '_renderDateTimeIndication');

        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        resizeCallbacks.fire();

        assert.ok(renderIndicatorStub.calledTwice, 'Indicator was updated');
    });

    QUnit.test('DateTimeIndicator should not be renderd after currentDate changing, Day view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 19, 45),
            showAllDayPanel: true
        });

        const $element = this.instance.$element();
        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 1, 'Indicator is rendered');

        this.instance.option('currentDate', new Date(2017, 8, 6));

        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 0, 'Indicator wasn\'t rendered');
    });

    QUnit.test('DateTimeIndicator should not be renderd if indicatorTime < startDayHour, Day view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 10, 45),
            startDayHour: 11,
            intervalCount: 3
        });

        const $element = this.instance.$element();
        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 0, 'Indicator wasn\'t rendered');

        this.instance.option('startDayHour', 8);
        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 1, 'Indicator is rendered');
    });

    QUnit.test('DateTimeIndicator should have correct target cell and position, Day view with groups', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

        const $element = this.instance.$element();

        const testCases = [
            {
                cellIndex: 18,
                offset: {
                    top: '25px',
                    left: '0px'
                }
            }, {
                cellIndex: 19,
                offset: {
                    top: '25px',
                    left: '0px'
                }
            }
        ];
        testIndicators(testCases, $element, assert);
    });

    QUnit.test('Shader should be rendered if needed, Day view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            shadeUntilCurrentTime: false
        });

        let $element = this.instance.$element();

        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS).length, 0, 'Shader wasn\'t rendered');

        this.instance.option('shadeUntilCurrentTime', true);
        $element = this.instance.$element();

        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS).length, 11, 'Shader was rendered in appropriate cells');
    });

    QUnit.test('Shader should have pointer-events = none', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            shadeUntilCurrentTime: true
        });

        const $element = this.instance.$element();
        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS).css('pointerEvents'), 'none', 'Shader has correct pointer-events');
    });

    QUnit.test('Shader on allDayPanel should be rendered if needed, Day view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            showAllDayPanel: true,
            shadeUntilCurrentTime: false
        });
        const $element = this.instance.$element();
        const $allDayPanel = $element.find('.dx-scheduler-all-day-panel');

        assert.equal($allDayPanel.find('.' + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).length, 0, 'Shader wasn\'t rendered');

        this.instance.option('shadeUntilCurrentTime', true);

        assert.equal($allDayPanel.find('.' + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).length, 1, 'Shader was rendered in appropriate cells');
    });

    QUnit.test('Shader on allDayPanel should have correct height, Day view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            showAllDayPanel: true,
            allDayExpanded: false,
            shadeUntilCurrentTime: true
        });
        const $element = this.instance.$element();

        assert.roughEqual($element.find('.' + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).eq(0).get(0).getBoundingClientRect().height, 23, 1, 'Indicator has correct height');

        this.instance.option('allDayExpanded', true);

        assert.roughEqual($element.find('.' + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).eq(0).get(0).getBoundingClientRect().height, 73, 1, 'Indicator has correct height');
    });

    QUnit.test('Shader should occupy correct cell count', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        const $element = this.instance.$element();

        const testCase = {
            lastShaderHeight: 24.5,
            lastShaderIndexes: [9],
            shaderCount: 11
        };

        testShader(testCase, $element, assert);
    });

    QUnit.test('Shader should occupy correct cell count, Day view with intervalCount, indicatorTime = startDayHour', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 11, 59),
            startDayHour: 12,
            intervalCount: 3
        });

        const $element = this.instance.$element();

        const testCase = {
            lastShaderHeight: null,
            lastShaderIndexes: null,
            shaderCount: 26
        };

        testShader(testCase, $element, assert);
    });

    QUnit.test('Shader should be rendered correctly, Day view with groups', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 12, 45),
            intervalCount: 3
        });

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }, { id: 3, text: 'a.3' }] }]);
        const $element = this.instance.$element();

        const testCase = {
            lastShaderHeight: 24.5,
            lastShaderIndexes: [82, 85, 88],
            shaderCount: 132,
            allDayShaderCount: 6
        };

        testShader(testCase, $element, assert);
    });


    QUnit.test('TimePanel currentTime cell should have specific class, Day view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        const $element = this.instance.$element();
        const $cell = $element.find('.dx-scheduler-time-panel-cell').eq(9);

        assert.ok($cell.hasClass('dx-scheduler-time-panel-current-time-cell'), 'Cell has specific class');
    });

    QUnit.test('TimePanel currentTime cell should have specific class, Day view with intervalCount', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 12, 45),
            intervalCount: 3
        });

        const $element = this.instance.$element();
        const $cell = $element.find('.dx-scheduler-time-panel-cell').eq(9);

        assert.ok($cell.hasClass('dx-scheduler-time-panel-current-time-cell'), 'Cell has specific class');
    });
})('DateTime indicator on Day View');

(function() {
    QUnit.module('DateTime indicator on Day View, vertical grouping', {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();

            this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceDay({
                showCurrentTimeIndicator: true,
                groupOrientation: 'vertical',
                currentDate: new Date(2017, 8, 5),
                startDayHour: 8,
                endDayHour: 14
            }).dxSchedulerWorkSpaceDay('instance');
            stubInvokeMethod(this.instance);
        },
        afterEach: function() {
            this.clock.restore();
        }
    });

    QUnit.test('DateTimeIndicator should have correct positions, Day view with groups, verticalGrouping', function(assert) {
        this.instance.option({
            shadeUntilCurrentTime: false,
            startDayHour: 11,
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

        const $element = this.instance.$element();

        const testCases = [
            {
                cellIndex: 3,
                offset: {
                    top: '25px',
                    left: '0px'
                }
            }, {
                cellIndex: 9,
                offset: {
                    top: '25px',
                    left: '0px'
                }
            }
        ];
        testIndicators(testCases, $element, assert);
    });

    QUnit.test('DateTimeIndicator should have correct positions, Day view with groups and allDay customization, verticalGrouping (T737095)', function(assert) {
        const $style = $('<style>').text('.dx-scheduler-work-space-vertical-grouped .dx-scheduler-all-day-table-row { height: 150px } .dx-scheduler-work-space-vertical-grouped.dx-scheduler-work-space-day .dx-scheduler-all-day-title { height: 150px !important } ');

        try {
            $style.appendTo('head');

            this.instance.option({
                shadeUntilCurrentTime: false,
                indicatorTime: new Date(2017, 8, 5, 12, 42)
            });

            this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

            const $element = this.instance.$element();

            const testCases = [
                {
                    cellIndex: 9,
                    offset: {
                        top: '20px',
                        left: '0px'
                    }
                }, {
                    cellIndex: 21,
                    offset: {
                        top: '20px',
                        left: '0px'
                    }
                }
            ];

            testIndicators(testCases, $element, assert);
        } finally {
            $style.remove();
        }
    });

    QUnit.test('DateTimeIndicator should have correct positions, Day view with groups without allDay panels, verticalGrouping', function(assert) {
        this.instance.option({
            showAllDayPanel: false,
            shadeUntilCurrentTime: false,
            indicatorTime: new Date(2017, 8, 5, 12, 42)
        });

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

        const $element = this.instance.$element();

        const testCases = [
            {
                cellIndex: 9,
                offset: {
                    top: '20px',
                    left: '0px'
                }
            }, {
                cellIndex: 21,
                offset: {
                    top: '20px',
                    left: '0px'
                }
            }
        ];

        testIndicators(testCases, $element, assert);
    });

    QUnit.test('DateTimeIndicator should have correct positions, Day view with groups with shader', function(assert) {
        this.instance.option({
            shadeUntilCurrentTime: true,
            indicatorTime: new Date(2017, 8, 5, 12, 42)
        });

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

        const $element = this.instance.$element();

        const testCases = [
            {
                cellIndex: 9,
                offset: {
                    top: '20px',
                    left: '0px'
                }
            }, {
                cellIndex: 21,
                offset: {
                    top: '20px',
                    left: '0px'
                }
            }
        ];

        testIndicators(testCases, $element, assert);
    });

    QUnit.test('Shader should be rendered correctly, Day view with groups', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 12, 50),
            intervalCount: 3,
            startDayHour: 11,
            endDayHour: 14
        });

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }, { id: 3, text: 'a.3' }] }]);

        const $element = this.instance.$element();

        const testCase = {
            lastShaderHeight: 32.6562,
            lastShaderIndexes: [10, 28, 46],
            shaderCount: 36,
            allDayShaderCount: 6
        };

        testShader(testCase, $element, assert);
    });

    QUnit.test('TimePanel currentTime cell should have specific class, Day view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        const $element = this.instance.$element();
        const $cell = $element.find('.dx-scheduler-time-panel-current-time-cell');

        assert.equal($cell.length, 2, 'Cells has specific class');
    });
})('DateTime indicator on Day View, vertical grouping');

(function() {
    QUnit.module('DateTime indicator on Week View', {
        beforeEach: function() {
            this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWeek({
                showCurrentTimeIndicator: true,
                currentDate: new Date(2017, 8, 5),
                startDayHour: 8,
            }).dxSchedulerWorkSpaceWeek('instance');
            stubInvokeMethod(this.instance);
        }
    });

    QUnit.test('DateTimeIndicator should be rendered if needed, Week view', function(assert) {
        this.instance.option({
            currentDate: new Date(),
            startDayHour: 0
        });
        let $element = this.instance.$element();

        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 1, 'Indicator is rendered correctly');

        this.instance.option('showCurrentTimeIndicator', false);
        $element = this.instance.$element();

        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 0, 'Indicator wasn\'t rendered');
    });

    QUnit.test('DateTimeIndicator should not be renderd after currentDate changing, Week view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 19, 45),
            showAllDayPanel: true
        });

        const $element = this.instance.$element();
        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 1, 'Indicator is rendered');

        this.instance.option('currentDate', new Date(2017, 8, 15));

        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 0, 'Indicator wasn\'t rendered');
    });

    QUnit.test('Shader should be rendered correctly, Week view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 12, 50),
            startDayHour: 11,
            endDayHour: 14
        });

        const $element = this.instance.$element();

        const testCase = {
            lastShaderHeight: 32.6562,
            lastShaderIndexes: [24],
            shaderCount: 26,
            allDayShaderCount: 4
        };

        testShader(testCase, $element, assert);
    });

    QUnit.test('Shader should be rendered for \'overdue\' views', function(assert) {
        this.instance.option({
            endDayHour: 18,
            currentDate: new Date(2017, 7, 5),
            indicatorTime: new Date(2017, 8, 5, 19, 45)
        });

        const $element = this.instance.$element();

        const testCase = {
            lastShaderHeight: null,
            lastShaderIndexes: null,
            shaderCount: 147,
            allDayShaderCount: 7
        };

        testShader(testCase, $element, assert);
    });

    QUnit.test('TimePanel currentTime cell should have specific class, Week view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 12, 30)
        });

        const $element = this.instance.$element();
        const $firstCell = $element.find('.dx-scheduler-time-panel-cell').eq(8);
        const $secondCell = $element.find('.dx-scheduler-time-panel-cell').eq(9);
        const $thirdCell = $element.find('.dx-scheduler-time-panel-cell').eq(10);

        assert.ok($firstCell.hasClass('dx-scheduler-time-panel-current-time-cell'), 'Cell has specific class');
        assert.ok($secondCell.hasClass('dx-scheduler-time-panel-current-time-cell'), 'Cell has specific class');
        assert.notOk($thirdCell.hasClass('dx-scheduler-time-panel-current-time-cell'), 'Cell hasn\'t specific class');
    });

    QUnit.test('DateHeader currentTime cell should have specific class, Week view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 7, 12, 45)
        });

        const $element = this.instance.$element();
        const $cell = $element.find('.dx-scheduler-header-panel-cell').eq(4);

        assert.ok($cell.hasClass('dx-scheduler-header-panel-current-time-cell'), 'Cell has specific class');
    });

    [{
        startDayHour: 8,
        endDayHour: 14,
        indicatorTime: new Date(2017, 8, 6, 10, 45),
        isVisible: true,
        caseName: 'indicator time is between startDayHour and endDayHour'
    },
    {
        startDayHour: 8,
        endDayHour: 14,
        indicatorTime: new Date(2017, 8, 6, 15, 45),
        isVisible: false,
        caseName: 'indicator time is later than endDayHour'
    },
    {
        startDayHour: 8,
        endDayHour: 23,
        indicatorTime: new Date(2017, 8, 6, 7, 45),
        isVisible: false,
        caseName: 'indicator time is earlier than startDayHour'
    }].forEach(testCase => {
        QUnit.test(`indicator visibility - ${testCase.caseName} `, function(assert) {
            this.instance.option({
                indicatorTime: testCase.indicatorTime,
                startDayHour: testCase.startDayHour,
                endDayHour: testCase.endDayHour
            });

            const $element = this.instance.$element();
            assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, testCase.isVisible ? 1 : 0, 'Indicator was rendered correctly');
        });
    });
})('DateTime indicator on Week View');

const moduleConfig = {
    beforeEach() {
        this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWeek({
            showCurrentTimeIndicator: true,
            currentDate: new Date(2017, 8, 5),
            startDayHour: 8,
        }).dxSchedulerWorkSpaceWeek('instance');
        stubInvokeMethod(this.instance);
    }
};

QUnit.module('DateTime indicator on grouped Week View', moduleConfig, () => {
    QUnit.test('DateTimeIndicator should have correct position and size, Week view with groupByDate = true', function(assert) {
        this.instance.option({
            groups: [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }],
            groupByDate: true,
            indicatorTime: new Date(2017, 8, 5, 12, 0)
        });

        const $element = this.instance.$element();
        const testCases = [
            {
                cellIndex: 116,
                offset: {
                    top: '0px',
                    left: '0px'
                },
                isSimple: false
            },
            {
                cellIndex: 117,
                offset: {
                    top: '0px',
                    left: '0px'
                },
                isSimple: true
            }
        ];

        testIndicators(testCases, $element, assert);
    });

    QUnit.test('Shader should have correct position and size, Week view with groupByDate = true', function(assert) {
        this.instance.option({
            groups: [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }, { id: 3, text: 'a.3' }] }],
            groupByDate: true,
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            startDayHour: 12,
            endDayHour: 14
        });

        const $element = this.instance.$element();

        const testCase = {
            lastShaderHeight: 24.5,
            lastShaderIndexes: [27, 28, 29],
            shaderCount: 39,
            allDayShaderCount: 9
        };

        testShader(testCase, $element, assert);
    });
});

(function() {
    QUnit.module('DateTime indicator on TimelineDay View', {
        beforeEach: function() {
            this.instance = $('#scheduler-work-space').dxSchedulerTimelineDay({
                showCurrentTimeIndicator: true,
                currentDate: new Date(2017, 8, 5),
                startDayHour: 8,
                height: 307
            }).dxSchedulerTimelineDay('instance');
        }
    });

    QUnit.test('DateTimeIndicator should be rendered if needed, TimelineDay view', function(assert) {
        this.instance.option({
            currentDate: new Date(),
            startDayHour: 0
        });
        let $element = this.instance.$element();

        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 1, 'Indicator is rendered correctly');

        this.instance.option('showCurrentTimeIndicator', false);
        $element = this.instance.$element();

        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 0, 'Indicator wasn\'t rendered');
    });

    QUnit.test('Shader should have correct height & width, TimelineDay view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        const $element = this.instance.$element();

        const testCase = {
            lastShaderWidth: 99.5,
            lastShaderIndexes: [9],
            shaderCount: 10
        };

        testShader(testCase, $element, assert);
    });

    QUnit.test('Shader should be rendered for \'overdue\' views, TimelineDay view', function(assert) {
        this.instance.option({
            currentDate: new Date(2017, 8, 3),
            indicatorTime: new Date(2017, 8, 5, 19, 45)
        });

        const $element = this.instance.$element();
        const testCase = {
            shaderCount: 32
        };

        testShader(testCase, $element, assert);
    });

    QUnit.test('DateHeader currentTime cell should have specific class', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        const $element = this.instance.$element();
        const $cell = $element.find('.dx-scheduler-header-panel-cell').eq(9);

        assert.ok($cell.hasClass('dx-scheduler-header-panel-current-time-cell'), 'Cell has specific class');
    });
})('DateTime indicator on TimelineDay View');

(function() {
    QUnit.module('DateTime indicator on TimelineDay View, vertical grouping', {
        beforeEach: function() {
            this.instance = $('#scheduler-work-space').dxSchedulerTimelineDay({
                showCurrentTimeIndicator: true,
                currentDate: new Date(2017, 8, 5),
                groupOrientation: 'vertical',
                startDayHour: 10,
                endDayHour: 18,
                hoursInterval: 1,
                height: 307
            }).dxSchedulerTimelineDay('instance');
            stubInvokeMethod(this.instance);
        }
    });

    QUnit.test('DateTimeIndicator should be rendered correctly', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

        const $element = this.instance.$element();

        const testCases = [
            {
                cellIndex: 2,
                offset: {
                    top: '0px',
                    left: '150px'
                },
                isSimple: false
            }, {
                cellIndex: 10,
                offset: {
                    top: '0px',
                    left: '150px'
                },
                isSimple: true
            }
        ];

        testIndicators(testCases, $element, assert);
    });
})('DateTime indicator on TimelineDay View, vertical grouping');

(function() {
    QUnit.module('DateTime indicator on TimelineDay View, horizontal grouping', {
        beforeEach: function() {
            this.instance = $('#scheduler-work-space').dxSchedulerTimelineDay({
                showCurrentTimeIndicator: true,
                currentDate: new Date(2017, 8, 5),
                groupOrientation: 'horizontal',
                startDayHour: 8,
                endDayHour: 14,
                hoursInterval: 1,
                height: 307
            }).dxSchedulerTimelineDay('instance');
            stubInvokeMethod(this.instance);
        }
    });

    QUnit.test('DateTimeIndicator should be rendered correctly', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

        const $element = this.instance.$element();

        const testCases = [
            {
                cellIndex: 4,
                offset: {
                    top: '0px',
                    left: '150px'
                }
            }, {
                cellIndex: 10,
                offset: {
                    top: '0px',
                    left: '150px'
                }
            }
        ];

        testIndicators(testCases, $element, assert);
    });

    QUnit.test('DateTimeIndicator should be rendered correctly, groupByDate = true', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            groupByDate: true,
            startDayHour: 11
        });

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

        const $element = this.instance.$element();

        const testCases = [
            {
                cellIndex: 2,
                offset: {
                    top: '0px',
                    left: '150px'
                }
            }, {
                cellIndex: 3,
                offset: {
                    top: '0px',
                    left: '150px'
                }
            }
        ];

        testIndicators(testCases, $element, assert);
    });

    QUnit.test('Shader should have correct height, width and position, groupByDate = true', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            groupByDate: true,
            startDayHour: 11
        });

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

        const $element = this.instance.$element();

        const testCase = {
            lastShaderWidth: 149,
            lastShaderIndexes: [2, 3],
            shaderCount: 4
        };

        testShader(testCase, $element, assert);
    });
})('DateTime indicator on TimelineDay View, horizontal grouping');

(function() {
    QUnit.module('DateTime indicator on other timelines');

    [{
        startDayHour: 9,
        endDayHour: 14,
        indicatorTime: new Date(2017, 8, 5, 12, 30),
        testDescription: 'indicatorTime is between startDayHour and endDayHour',
        expectedCellCount: 14,
        lastShaderWidth: 99.5,
        indicatorCount: 1
    },
    {
        startDayHour: 9,
        endDayHour: 14,
        indicatorTime: new Date(2017, 8, 5, 7, 30),
        testDescription: 'indicatorTime is less than startDateHour',
        expectedCellCount: 10,
        lastShaderWidth: undefined,
        indicatorCount: 0
    },
    {
        startDayHour: 9,
        endDayHour: 14,
        indicatorTime: new Date(2017, 8, 5, 15, 30),
        testDescription: 'indicatorTime is greater than endDayHour',
        expectedCellCount: 15,
        lastShaderWidth: undefined,
        indicatorCount: 0
    }].forEach(schedulerConfig => {
        QUnit.test(`Shader should have correct height & width on timelineWeek, ${schedulerConfig.testDescription}, (T923329)`, function(assert) {
            const instance = $('#scheduler-work-space').dxSchedulerTimelineWeek({
                currentDate: new Date(2017, 8, 5),
                height: 307,
                indicatorTime: schedulerConfig.indicatorTime,
                startDayHour: schedulerConfig.startDayHour,
                endDayHour: schedulerConfig.endDayHour,
                hoursInterval: 1
            }).dxSchedulerTimelineWeek('instance');

            const $element = instance.$element();

            const shaderCase = {
                lastShaderWidth: schedulerConfig.lastShaderWidth,
                lastShaderIndexes: [schedulerConfig.expectedCellCount - 1],
                shaderCount: schedulerConfig.expectedCellCount
            };

            testShader(shaderCase, $element, assert);

            const $indicators = $element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS);
            assert.equal($indicators.length, schedulerConfig.indicatorCount, 'Indicator count is correct');
        });
    });

    [{
        startDayHour: 9,
        endDayHour: 14,
        expectedCellCount: 5,
        indicatorCount: 1,
        lastShaderWidth: 119.391,
        indicatorTime: new Date(2017, 8, 5, 12),
        testDescription: 'indicatorTime is between startDayHour and endDayHour'
    },
    {
        startDayHour: 13,
        endDayHour: 14,
        expectedCellCount: 4,
        indicatorCount: 1,
        lastShaderWidth: undefined,
        indicatorTime: new Date(2017, 8, 5, 12),
        testDescription: 'indicatorTime is less than startDateHour'
    },
    {
        startDayHour: 0,
        endDayHour: 11,
        indicatorCount: 1,
        expectedCellCount: 5,
        lastShaderWidth: undefined,
        indicatorTime: new Date(2017, 8, 5, 12, 45),
        testDescription: 'indicatorTime is greater than endDayHour'
    }].forEach(schedulerConfig => {
        QUnit.test(`Shader should have correct height & width on timelineMonth, ${schedulerConfig.testDescription}, (T923329)`, function(assert) {
            const instance = $('#scheduler-work-space').dxSchedulerTimelineMonth({
                currentDate: new Date(2017, 8, 5),
                height: 307,
                indicatorTime: schedulerConfig.indicatorTime,
                startDayHour: schedulerConfig.startDayHour,
                endDayHour: schedulerConfig.endDayHour,
                hoursInterval: 1
            }).dxSchedulerTimelineMonth('instance');
            const $element = instance.$element();

            const shaderCase = {
                lastShaderWidth: schedulerConfig.lastShaderWidth,
                lastShaderIndexes: [schedulerConfig.expectedCellCount - 1],
                shaderCount: schedulerConfig.expectedCellCount
            };

            testShader(shaderCase, $element, assert);

            const $indicators = $element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS);
            assert.equal($indicators.length, schedulerConfig.indicatorCount, 'Indicator count is correct');
        });
    });

    QUnit.test('DateHeader currentTime cell should have specific class, TimelineWeek view', function(assert) {
        const instance = $('#scheduler-work-space').dxSchedulerTimelineWeek({
            showCurrentTimeIndicator: true,
            currentDate: new Date(2017, 8, 5),
            startDayHour: 8,
            height: 307,
            indicatorTime: new Date(2017, 8, 5, 12, 30),
            hoursInterval: 1
        }).dxSchedulerTimelineWeek('instance');

        const $element = instance.$element();
        const $cell = $element.find('.dx-scheduler-header-panel-cell').eq(43);

        assert.ok($cell.hasClass('dx-scheduler-header-panel-current-time-cell'), 'Cell has specific class');
    });

    QUnit.test('Shader should have correct height & width, TimelineMonth view', function(assert) {
        const instance = $('#scheduler-work-space').dxSchedulerTimelineMonth({
            showCurrentTimeIndicator: true,
            currentDate: new Date(2017, 8, 5),
            startDayHour: 8,
            height: 307,
            indicatorTime: new Date(2017, 8, 16, 12, 0),
            hoursInterval: 1
        }).dxSchedulerTimelineMonth('instance');

        const $element = instance.$element();
        const testCase = {
            lastShaderWidth: 49.75,
            lastShaderIndexes: [15],
            shaderCount: 16
        };

        testShader(testCase, $element, assert);
    });

    QUnit.test('DateHeader currentTime cell should have specific class, TimelineMonth view', function(assert) {
        const instance = $('#scheduler-work-space').dxSchedulerTimelineMonth({
            showCurrentTimeIndicator: true,
            currentDate: new Date(2017, 8, 5),
            startDayHour: 8,
            height: 307,
            indicatorTime: new Date(2017, 8, 15, 12, 30)
        }).dxSchedulerTimelineMonth('instance');

        const $element = instance.$element();
        const $cell = $element.find('.dx-scheduler-header-panel-cell').eq(14);

        assert.ok($cell.hasClass('dx-scheduler-header-panel-current-time-cell'), 'Cell has specific class');
    });
})('DateTime indicator on other timelines');

