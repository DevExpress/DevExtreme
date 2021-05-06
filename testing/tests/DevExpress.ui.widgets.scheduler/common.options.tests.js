import config from 'core/config';
import devices from 'core/devices';
import CustomStore from 'data/custom_store';
import { DataSource } from 'data/data_source/data_source';

import { triggerHidingEvent, triggerShownEvent } from 'events/visibility_change';
import $ from 'jquery';
import dxSchedulerWorkSpaceDay from 'ui/scheduler/workspaces/ui.scheduler.work_space_day';
import errors from 'ui/widget/ui.errors';
import keyboardMock from '../../helpers/keyboardMock.js';
import pointerMock from '../../helpers/pointerMock.js';
import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';

initTestMarkup();

const checkDate = function(instance, assert) {

    const workSpace = instance.getWorkSpace();
    const workSpaceCurrentDate = workSpace.option('currentDate');
    const header = instance.getHeader();
    const headerCurrentDate = header.option('currentDate');

    assert.ok(workSpaceCurrentDate instanceof Date, 'date is instance of Date constructor');
    assert.equal(workSpaceCurrentDate.getFullYear(), 2015, 'Year is OK');
    assert.equal(workSpaceCurrentDate.getMonth(), 4, 'Month is OK');
    assert.equal(workSpaceCurrentDate.getDate(), 13, 'Date is OK');

    assert.ok(headerCurrentDate instanceof Date, 'date is instance of Date constructor');
    assert.equal(headerCurrentDate.getFullYear(), 2015, 'Year is OK');
    assert.equal(headerCurrentDate.getMonth(), 4, 'Month is OK');
    assert.equal(headerCurrentDate.getDate(), 13, 'Date is OK');
};

QUnit.module('Options', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        sinon.spy(errors, 'log');
    },
    afterEach: function() {
        this.clock.restore();
        errors.log.restore();
    }
}, () => {
    QUnit.test('Data expressions should be recompiled on optionChanged', function(assert) {
        const scheduler = createWrapper();

        const repaintStub = sinon.stub(scheduler.instance, 'repaint');

        try {
            scheduler.instance.option({
                'startDateExpr': '_startDate',
                'endDateExpr': '_endDate',
                'startDateTimeZoneExpr': '_startDateTimeZone',
                'endDateTimeZoneExpr': '_endDateTimeZone',
                'textExpr': '_text',
                'descriptionExpr': '_description',
                'allDayExpr': '_allDay',
                'recurrenceRuleExpr': '_recurrenceRule',
                'recurrenceExceptionExpr': '_recurrenceException',
                'disabledExpr': '_disabled'
            });

            const data = {
                startDate: new Date(2017, 2, 22),
                endDate: new Date(2017, 2, 23),
                startDateTimeZone: 'America/Los_Angeles',
                endDateTimeZone: 'America/Los_Angeles',
                text: 'a',
                description: 'b',
                allDay: true,
                recurrenceRule: 'abc',
                recurrenceException: 'def',
                disabled: false
            };
            const appointment = {
                _startDate: data.startDate,
                _endDate: data.endDate,
                _startDateTimeZone: data.startDateTimeZone,
                _endDateTimeZone: data.endDateTimeZone,
                _text: data.text,
                _description: data.description,
                _allDay: data.allDay,
                _recurrenceRule: data.recurrenceRule,
                _recurrenceException: data.recurrenceException,
                _disabled: data.disabled
            };

            const dataAccessors = scheduler.instance._dataAccessors;

            $.each(dataAccessors.getter, function(name, getter) {
                assert.equal(dataAccessors.getter[name](appointment), data[name], 'getter for ' + name + ' is OK');
            });

            $.each(dataAccessors.setter, function(name, getter) {
                dataAccessors.setter[name](appointment, 'xyz');
                assert.equal(appointment['_' + name], 'xyz', 'setter for ' + name + ' is OK');
            });
        } finally {
            repaintStub.restore();
        }
    });

    QUnit.test('Data expressions should be recompiled on optionChanged and passed to appointmentDataSource', function(assert) {
        const scheduler = createWrapper();
        const repaintStub = sinon.stub(scheduler.instance, 'repaint');

        try {
            const appointmentDataSource = scheduler.instance.getAppointmentDataSource();

            scheduler.instance.option({
                'startDateExpr': '_startDate',
                'endDateExpr': '_endDate',
                'startDateTimeZoneExpr': '_startDateTimeZone',
                'endDateTimeZoneExpr': '_endDateTimeZone',
                'textExpr': '_text',
                'descriptionExpr': '_description',
                'allDayExpr': '_allDay',
                'recurrenceRuleExpr': '_recurrenceRule',
                'recurrenceExceptionExpr': '_recurrenceException'
            });

            const dataAccessors = scheduler.instance._dataAccessors;

            assert.deepEqual($.extend({ resources: {} }, dataAccessors.getter), appointmentDataSource.dataAccessors.getter, 'dataAccessors getters were passed to appointmentDataSource');
            assert.deepEqual($.extend({ resources: {} }, dataAccessors.setter), appointmentDataSource.dataAccessors.setter, 'dataAccessors setters were passed to appointmentDataSource');
            assert.deepEqual(dataAccessors.expr, appointmentDataSource.dataAccessors.expr, 'dataExpressions were passed to appointmentDataSource');
        } finally {
            repaintStub.restore();
        }
    });

    QUnit.test('Appointment should be rendered correctly after expression changing', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                text: 'a',
                StartDate: new Date(2015, 6, 8, 8, 0),
                endDate: new Date(2015, 6, 8, 17, 0),
                allDay: true
            }],
            currentDate: new Date(2015, 6, 8)
        });

        scheduler.instance.option('startDateExpr', 'StartDate');
        this.clock.tick();
        assert.equal(scheduler.instance.$element().find('.dx-scheduler-appointment').length, 1, 'Appointment is rendered');
    });

    QUnit.test('Sheduler should be repainted after data expression option changing', function(assert) {
        const scheduler = createWrapper();
        const repaintStub = sinon.stub(scheduler.instance, 'repaint');

        try {
            scheduler.instance.option({
                'startDateExpr': '_startDate',
                'endDateExpr': '_endDate',
                'startDateTimeZoneExpr': '_startDateTimeZone',
                'endDateTimeZoneExpr': '_endDateTimeZone',
                'textExpr': '_text',
                'descriptionExpr': '_description',
                'allDayExpr': '_allDay',
                'recurrenceRuleExpr': '_recurrenceRule',
                'recurrenceExceptionExpr': '_recurrenceException'
            });

            assert.equal(repaintStub.callCount, 9, 'Scheduler was repainted');
        } finally {
            repaintStub.restore();
        }
    });

    QUnit.test('Sheduler should have correct default template after data expression option changing', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                text: 'a',
                TEXT: 'New Text',
                startDate: new Date(2015, 6, 8, 8, 0),
                endDate: new Date(2015, 6, 8, 17, 0),
                allDay: true
            }],
            currentDate: new Date(2015, 6, 8)
        });

        scheduler.instance.option({
            textExpr: 'TEXT'
        });

        assert.equal(scheduler.instance.$element().find('.dx-scheduler-appointment-title').eq(0).text(), 'New Text', 'Appointment template is correct');
    });

    QUnit.test('Changing of \'currentView\' option after initializing should work correctly', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2018, 0, 30),
            views: ['day', 'week'],
            currentView: 'week',
            onInitialized: function(e) {
                e.component.option('currentView', 'day');
            }
        });

        assert.ok(scheduler.instance.getWorkSpace() instanceof dxSchedulerWorkSpaceDay, 'correct view');
    });

    QUnit.test('It should be possible to init currentDate as timestamp', function(assert) {
        const scheduler = createWrapper({
            currentDate: 1431515985596
        });

        checkDate(scheduler.instance, assert);
    });

    QUnit.test('It should be possible to change currentDate using timestamp', function(assert) {
        const scheduler = createWrapper();

        scheduler.instance.option('currentDate', 1431515985596);
        checkDate(scheduler.instance, assert);
    });

    QUnit.test('Custom store should be loaded only once on the first rendering', function(assert) {
        let counter = 0;

        createWrapper({
            dataSource: new DataSource({
                store: new CustomStore({
                    load: function() {
                        const d = $.Deferred();
                        setTimeout(function() {
                            d.resolve([]);
                            counter++;
                        }, 100);

                        return d.promise();
                    }
                })
            })
        });

        this.clock.tick(200);

        assert.equal(counter, 1);
    });

    QUnit.test('Custom store should be loaded only once on dataSource option change', function(assert) {
        let counter = 0;

        const scheduler = createWrapper();

        scheduler.instance.option('dataSource', new DataSource({
            store: new CustomStore({
                load: function() {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([]);
                        counter++;
                    }, 100);

                    return d.promise();
                }
            })
        }));

        this.clock.tick(200);

        assert.equal(counter, 1);
    });

    QUnit.test('allowAllDayResize option should be updated when current view is changed', function(assert) {
        const scheduler = createWrapper({
            currentView: 'day'
        });

        assert.notOk(scheduler.instance.getAppointmentsInstance().option('allowAllDayResize'));

        scheduler.instance.option('currentView', 'week');
        assert.ok(scheduler.instance.getAppointmentsInstance().option('allowAllDayResize'));
    });

    QUnit.test('allowAllDayResize option should depend on intervalCount', function(assert) {
        const scheduler = createWrapper({
            views: [{ type: 'week', name: 'WEEK' }, { type: 'day', name: 'DAY' }, { type: 'day', name: 'DAY1', intervalCount: 3 } ],
            currentView: 'DAY'
        });

        assert.notOk(scheduler.instance.getAppointmentsInstance().option('allowAllDayResize'));

        scheduler.instance.option('currentView', 'DAY1');
        assert.ok(scheduler.instance.getAppointmentsInstance().option('allowAllDayResize'));
    });

    QUnit.test('showAllDayPanel option value = true on init', function(assert) {
        const scheduler = createWrapper();

        assert.equal(scheduler.instance.option('showAllDayPanel'), true, 'showAllDayPanel option value is right on init');
    });

    QUnit.test('showCurrentTimeIndicator should have right default', function(assert) {
        const scheduler = createWrapper();

        assert.equal(scheduler.instance.option('showCurrentTimeIndicator'), true, 'showCurrentTimeIndicator option value is right on init');
    });

    QUnit.test('customizeDateNavigatorText should be passed to header & navigator', function(assert) {
        const scheduler = createWrapper({
            currentView: 'week',
            currentDate: new Date(2017, 10, 25),
            customizeDateNavigatorText: function() {
                return 'abc';
            },
            views: ['week']
        });

        const header = scheduler.instance.getHeader();
        const navigator = header._navigator;

        assert.deepEqual(header.option('customizeDateNavigatorText')(), 'abc', 'option is passed correctly');
        assert.equal(navigator.option('customizeDateNavigatorText')(), 'abc', 'option is passed correctly');
    });

    QUnit.test('groupByDate option should be passed to workSpace', function(assert) {
        const scheduler = createWrapper({
            currentView: 'week',
            groupByDate: false
        });

        const workSpaceWeek = scheduler.instance.getWorkSpace();

        assert.equal(workSpaceWeek.option('groupByDate'), false, 'workspace has correct groupByDate');

        scheduler.instance.option('groupByDate', true);

        assert.equal(workSpaceWeek.option('groupByDate'), true, 'workspace has correct groupByDate');
    });

    QUnit.test('showCurrentTimeIndicator option should be passed to workSpace', function(assert) {
        const scheduler = createWrapper({
            currentView: 'week',
            showCurrentTimeIndicator: false
        });

        const workSpaceWeek = scheduler.instance.getWorkSpace();

        assert.equal(workSpaceWeek.option('showCurrentTimeIndicator'), false, 'workspace has correct showCurrentTimeIndicator');

        scheduler.instance.option('showCurrentTimeIndicator', true);

        assert.equal(workSpaceWeek.option('showCurrentTimeIndicator'), true, 'workspace has correct showCurrentTimeIndicator');
    });

    QUnit.test('indicatorTime option should be passed to workSpace', function(assert) {
        const scheduler = createWrapper({
            currentView: 'week',
            indicatorTime: new Date(2017, 8, 19)
        });

        const workSpaceWeek = scheduler.instance.getWorkSpace();

        assert.deepEqual(workSpaceWeek.option('indicatorTime'), new Date(2017, 8, 19), 'workspace has correct indicatorTime');

        scheduler.instance.option('indicatorTime', new Date(2017, 8, 20));

        assert.deepEqual(workSpaceWeek.option('indicatorTime'), new Date(2017, 8, 20), 'workspace has correct indicatorTime');
    });

    QUnit.test('indicatorUpdateInterval should have right default', function(assert) {
        const scheduler = createWrapper({
            currentView: 'week'
        });

        assert.equal(scheduler.instance.option('indicatorUpdateInterval'), 300000, 'workspace has correct indicatorUpdateInterval');
    });

    QUnit.test('indicatorUpdateInterval option should be passed to workSpace', function(assert) {
        const scheduler = createWrapper({
            currentView: 'week',
            indicatorUpdateInterval: 2000
        });

        const workSpaceWeek = scheduler.instance.getWorkSpace();

        assert.equal(workSpaceWeek.option('indicatorUpdateInterval'), 2000, 'workspace has correct indicatorUpdateInterval');

        scheduler.instance.option('indicatorUpdateInterval', 3000);

        assert.equal(workSpaceWeek.option('indicatorUpdateInterval'), 3000, 'workspace has correct indicatorUpdateInterval');
    });

    QUnit.test('shadeUntilCurrentTime should have right default', function(assert) {
        const scheduler = createWrapper({
            currentView: 'week'
        });

        assert.equal(scheduler.instance.option('shadeUntilCurrentTime'), false, 'workspace has correct shadeUntilCurrentTime');
    });

    QUnit.test('shadeUntilCurrentTime option should be passed to workSpace', function(assert) {
        const scheduler = createWrapper({
            currentView: 'week',
            shadeUntilCurrentTime: false
        });

        const workSpaceWeek = scheduler.instance.getWorkSpace();

        assert.equal(workSpaceWeek.option('shadeUntilCurrentTime'), false, 'workspace has correct shadeUntilCurrentTime');

        scheduler.instance.option('shadeUntilCurrentTime', true);

        assert.equal(workSpaceWeek.option('shadeUntilCurrentTime'), true, 'workspace has correct shadeUntilCurrentTime');
    });

    QUnit.test('appointments should be repainted after scheduler dimensions changing', function(assert) {
        const data = [{
            id: 1, text: 'abc', startDate: new Date(2015, 1, 9, 10), endDate: new Date(2015, 1, 9, 10, 30)
        }];

        const scheduler = createWrapper({
            currentDate: new Date(2015, 1, 9),
            currentView: 'month',
            dataSource: data,
            height: 500,
            width: 800
        });

        const initialAppointmentHeight = scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0).outerHeight();

        scheduler.instance.option('height', 200);
        this.clock.tick();

        assert.notEqual(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0).outerHeight(), initialAppointmentHeight, 'Appointment was repainted');
    });

    QUnit.test('appointments should be repainted after scheduler hiding/showing and dimensions changing', function(assert) {
        const data = [{
            id: 1, text: 'abc', startDate: new Date(2015, 1, 9, 10), endDate: new Date(2015, 1, 9, 10, 30)
        }];

        const scheduler = createWrapper({
            currentDate: new Date(2015, 1, 9),
            currentView: 'month',
            dataSource: data,
            maxAppointmentsPerCell: 2,
            height: 500,
            width: 800
        });

        const initialAppointmentHeight = scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0).outerHeight();

        triggerHidingEvent($('#scheduler'));
        $('#scheduler').hide();
        scheduler.instance.option('height', 400);
        $('#scheduler').show();
        triggerShownEvent($('#scheduler'));
        this.clock.tick();

        assert.notEqual(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0).outerHeight(), initialAppointmentHeight, 'Appointment was repainted');
    });

    QUnit.test('view.intervalCount is passed to workspace & header & navigator', function(assert) {
        const scheduler = createWrapper({
            currentView: 'week',
            views: [{
                type: 'week',
                name: 'Week',
                intervalCount: 3
            }]
        });

        const workSpaceWeek = scheduler.instance.getWorkSpace();
        const header = scheduler.instance.getHeader();
        const navigator = header._navigator;

        assert.equal(workSpaceWeek.option('intervalCount'), 3, 'workspace has correct count');
        assert.equal(header.option('intervalCount'), 3, 'header has correct count');
        assert.equal(navigator.option('intervalCount'), 3, 'navigator has correct count');
    });

    QUnit.test('view.intervalCount is passed to workspace & header & navigator, currentView is set by view.name', function(assert) {
        const scheduler = createWrapper({
            currentView: 'WEEK1',
            views: [{
                type: 'day',
                name: 'DAY1',
                intervalCount: 5
            }, {
                type: 'week',
                name: 'WEEK1',
                intervalCount: 3
            }]
        });

        const workSpaceWeek = scheduler.instance.getWorkSpace();
        const header = scheduler.instance.getHeader();
        const navigator = header._navigator;

        assert.equal(workSpaceWeek.option('intervalCount'), 3, 'workspace has correct count');
        assert.equal(header.option('intervalCount'), 3, 'header has correct count');
        assert.equal(navigator.option('intervalCount'), 3, 'navigator has correct count');
    });

    QUnit.test('view.intervalCount is passed to workspace & header & navigator, currentView is set by view.type', function(assert) {
        const views = [{
            type: 'day',
            name: 'DAY1',
            intervalCount: 5
        }, {
            type: 'week',
            name: 'WEEK1',
            intervalCount: 3
        }];

        const scheduler = createWrapper({
            currentView: 'week',
            views: views,
            useDropDownViewSwitcher: false
        });

        const workSpaceWeek = scheduler.instance.getWorkSpace();
        const header = scheduler.instance.getHeader();
        const viewSwitcher = header._viewSwitcher;
        const navigator = header._navigator;

        assert.equal(workSpaceWeek.option('intervalCount'), 3, 'workspace has correct count');
        assert.equal(header.option('intervalCount'), 3, 'header has correct count');
        assert.equal(navigator.option('intervalCount'), 3, 'navigator has correct count');
        assert.deepEqual(viewSwitcher.option('selectedItem'), views[1], 'View switcher has correct selectedItem');
    });

    QUnit.test('view.startDate is passed to workspace & header & navigator', function(assert) {
        const date = new Date(2017, 3, 4);

        const scheduler = createWrapper({
            currentView: 'week',
            currentDate: new Date(2017, 2, 10),
            views: [{
                type: 'week',
                name: 'Week',
                intervalCount: 3,
                startDate: date
            }]
        });

        const workSpaceWeek = scheduler.instance.getWorkSpace();
        const header = scheduler.instance.getHeader();
        const navigator = header._navigator;

        assert.deepEqual(workSpaceWeek.option('startDate'), date, 'workspace has correct startDate');
        assert.deepEqual(header.option('startDate'), date, 'header has correct startDate');
        assert.equal(navigator.option('date').getMonth(), 1, 'navigator has correct date depending on startDate');
    });

    QUnit.test('view.groupByDate is passed to workspace', function(assert) {
        const scheduler = createWrapper({
            currentView: 'Week',
            views: [{
                type: 'week',
                name: 'Week',
                groupByDate: true
            },
            {
                type: 'day',
                name: 'Day',
                groupByDate: false
            }]
        });

        let workSpace = scheduler.instance.getWorkSpace();

        assert.ok(workSpace.option('groupByDate'), 'workspace has correct groupByDate');
        scheduler.instance.option('currentView', 'day');
        workSpace = scheduler.instance.getWorkSpace();
        assert.notOk(workSpace.option('groupByDate'), 'workspace has correct groupByDate');
    });

    QUnit.test('currentView option should be passed to header correctly', function(assert) {
        const scheduler = createWrapper({
            currentView: 'Week1',
            currentDate: new Date(2017, 10, 25),
            views: [{
                type: 'day',
                name: 'day1'
            }, {
                type: 'week',
                name: 'Week1'
            }]
        });

        const header = scheduler.instance.getHeader();
        const navigator = header._navigator;

        assert.deepEqual(header.option('currentView'), { type: 'week', name: 'Week1' }, 'header has correct currentView');
        assert.equal(navigator.option('step'), 'week', 'navigator has correct currentView');

        scheduler.instance.option('currentView', 'day1');

        assert.deepEqual(header.option('currentView'), { type: 'day', name: 'day1' }, 'header has correct currentView');
        assert.equal(navigator.option('step'), 'day', 'navigator has correct currentView');
    });

    QUnit.test('currentView option changing should work correctly, when intervalCount & startDate is set', function(assert) {
        const scheduler = createWrapper({
            currentView: 'day',
            currentDate: new Date(2019, 1, 23),
            views: [{
                type: 'day',
                name: 'day',
                intervalCount: 3,
                startDate: new Date(2019, 0, 1)
            }, {
                type: 'week',
                name: 'Week',
                intervalCount: 2,
                startDate: new Date(2019, 0, 30)
            }]
        });

        scheduler.instance.option('currentView', 'week');
        const workSpaceWeek = scheduler.instance.getWorkSpace();
        const header = scheduler.instance.getHeader();
        const navigator = header._navigator;

        assert.equal(workSpaceWeek.option('intervalCount'), 2, 'workspace has correct count');
        assert.equal(header.option('intervalCount'), 2, 'header has correct count');
        assert.equal(navigator.option('intervalCount'), 2, 'navigator has correct count');

        assert.deepEqual(workSpaceWeek.option('startDate'), new Date(2019, 0, 30), 'workspace has correct startDate');
        assert.deepEqual(header.option('displayedDate'), new Date(2019, 1, 10), 'header has correct displayedDate');
        assert.deepEqual(header.option('currentDate'), new Date(2019, 1, 23), 'header has correct displayedDate');
        assert.equal(navigator.option('date').getMonth(), 1, 'navigator has correct date');
    });

    QUnit.test('currentView option changing should work correctly, when intervalCount on month view', function(assert) {
        const scheduler = createWrapper({
            currentView: 'day',
            currentDate: new Date(2017, 4, 1),
            views: [ {
                name: '3 Days',
                type: 'day',
                intervalCount: 3,
                startDate: new Date(2017, 3, 30)
            }, {
                name: '2 Months',
                type: 'month',
                intervalCount: 2
            }]
        });

        scheduler.instance.option('currentView', 'month');
        const workSpaceWeek = scheduler.instance.getWorkSpace();
        const header = scheduler.instance.getHeader();
        const navigator = header._navigator;

        assert.equal(workSpaceWeek.option('intervalCount'), 2, 'workspace has correct count');
        assert.equal(header.option('intervalCount'), 2, 'header has correct count');
        assert.equal(navigator.option('intervalCount'), 2, 'navigator has correct count');

        assert.deepEqual(workSpaceWeek.option('startDate'), null, 'workspace has correct startDate');
        assert.deepEqual(header.option('displayedDate'), new Date(2017, 4, 1), 'header has correct displayedDate');
        assert.deepEqual(header.option('currentDate'), new Date(2017, 4, 1), 'header has correct displayedDate');
        assert.equal(navigator.option('date').getMonth(), 4, 'navigator has correct date');
    });

    QUnit.test('maxAppointmentsPerCell should have correct default', function(assert) {
        const scheduler = createWrapper({
            currentView: 'Week',
            views: [{
                type: 'week',
                name: 'Week',
            }]
        });

        assert.equal(scheduler.instance.option('maxAppointmentsPerCell'), 'auto', 'Default Option value is right');
    });

    QUnit.test('cellDuration is passed to workspace', function(assert) {
        const scheduler = createWrapper({
            currentView: 'week',
            cellDuration: 60
        });

        const workSpaceWeek = scheduler.instance.getWorkSpace();

        assert.equal(workSpaceWeek.option('hoursInterval') * 60, scheduler.instance.option('cellDuration'), 'workspace has correct cellDuration');

        scheduler.instance.option('cellDuration', 20);

        assert.equal(workSpaceWeek.option('hoursInterval') * 60, scheduler.instance.option('cellDuration'), 'workspace has correct cellDuration after change');
    });

    QUnit.test('accessKey is passed to workspace', function(assert) {
        const scheduler = createWrapper({
            currentView: 'month',
            accessKey: 'o'
        });

        const workSpaceMonth = scheduler.instance.getWorkSpace();
        assert.equal(workSpaceMonth.option('accessKey'), scheduler.instance.option('accessKey'), 'workspace has correct accessKey');

        scheduler.instance.option('accessKey', 'k');
        assert.equal(workSpaceMonth.option('accessKey'), scheduler.instance.option('accessKey'), 'workspace has correct accessKey afterChange');
    });

    QUnit.test('the \'width\' option should be passed to work space on option changed if horizontal scrolling is enabled', function(assert) {
        const scheduler = createWrapper();
        scheduler.instance.option('crossScrollingEnabled', true);
        scheduler.instance.option('width', 777);

        assert.equal(scheduler.instance.getWorkSpace().option('width'), 777, 'option is OK');
    });

    QUnit.test('the \'width\' option should not be passed to work space on option changed if horizontal scrolling is not enabled', function(assert) {
        const scheduler = createWrapper();
        scheduler.instance.option('crossScrollingEnabled', false);
        scheduler.instance.option('width', 777);

        assert.strictEqual(scheduler.instance.getWorkSpace().option('width'), undefined, 'option is OK');
    });

    QUnit.test('Editing default option value', function(assert) {
        const defaultEditing = {
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            allowResizing: true,
            allowDragging: true,
            allowTimeZoneEditing: false,
            allowEditingTimeZones: false
        };

        if(devices.real().platform !== 'generic') {
            defaultEditing.allowDragging = false;
            defaultEditing.allowResizing = false;
        }

        const scheduler = createWrapper();
        const editing = scheduler.instance.option('editing');

        assert.deepEqual(editing, defaultEditing);
    });

    QUnit.test('Scheduler should be repainted after currentTime indication toggling', function(assert) {
        const scheduler = createWrapper({
            showCurrentTimeIndicator: true,
            currentDate: new Date(2017, 11, 18),
            indicatorTime: new Date(2017, 11, 18, 16, 45),
            views: ['timelineWeek'],
            view: 'timelineWeek'
        });

        const repaintStub = sinon.stub(scheduler.instance, 'repaint');

        scheduler.instance.option('showCurrentTimeIndicator', false);

        assert.ok(repaintStub.calledOnce, 'Sheduler was repainted');
    });

    QUnit.test('Filter options should be updated when dataSource is changed', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2016, 2, 15),
            views: ['week'],
            currentView: 'week',
            dataSource: [{ startDate: new Date(2016, 2, 15, 1).toString(), endDate: new Date(2016, 2, 15, 2).toString() }]
        });

        assert.equal(scheduler.instance.$element().find('.dx-scheduler-appointment').length, 1, 'Appointment is rendered');

        scheduler.instance.option('dataSource', [
            { startDate: new Date(2016, 2, 15, 1).toString(), endDate: new Date(2016, 2, 15, 2).toString() },
            { startDate: new Date(2016, 2, 15, 3).toString(), endDate: new Date(2016, 2, 15, 4).toString() }
        ]);

        assert.equal(scheduler.instance.$element().find('.dx-scheduler-appointment').length, 2, 'Appointments are rendered');
    });

    QUnit.test('Appointments should be deleted from DOM when needed', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2016, 2, 15),
            views: ['week', 'month'],
            currentView: 'week',
            dataSource: [{ startDate: new Date(2016, 2, 15, 1).toString(), endDate: new Date(2016, 2, 15, 2).toString() }]
        });

        assert.equal(scheduler.instance.$element().find('.dx-scheduler-appointment').length, 1, 'Appointment is rendered');

        scheduler.instance.option('currentDate', new Date(2016, 2, 23));
        scheduler.instance.option('currentView', 'month');
        scheduler.instance.option('currentView', 'week');

        assert.equal(scheduler.instance.$element().find('.dx-scheduler-appointment').length, 0, 'Appointments were removed');
    });

    ['virtual', 'standard'].forEach((scrollingMode) => {
        QUnit.test(`selectedCellData option should be updated after view changing when scrolling is ${scrollingMode}`, function(assert) {
            const scheduler = createWrapper({
                currentDate: new Date(2018, 4, 10),
                views: ['week', 'month'],
                currentView: 'week',
                focusStateEnabled: true,
                scrolling: { mode: scrollingMode },
                width: 600
            });

            const keyboard = keyboardMock(scheduler.instance.getWorkSpace().$element());
            const cell = scheduler.workSpace.getCell(7);

            pointerMock(cell).start().click();
            keyboard.keyDown('down', { shiftKey: true });

            assert.deepEqual(scheduler.instance.option('selectedCellData'), [{
                startDate: new Date(2018, 4, 6, 0, 30),
                endDate: new Date(2018, 4, 6, 1),
                allDay: false,
                groups: undefined,
                groupIndex: 0,
            }, {
                startDate: new Date(2018, 4, 6, 1),
                endDate: new Date(2018, 4, 6, 1, 30),
                allDay: false,
                groups: undefined,
                groupIndex: 0,
            }], 'correct cell data');

            scheduler.instance.option('currentView', 'month');
            assert.deepEqual(scheduler.instance.option('selectedCellData'), [], 'selectedCellData was cleared');
        });

        QUnit.test(`selectedCellData option should be updated after currentDate changing when scrolling is ${scrollingMode}`, function(assert) {
            const scheduler = createWrapper({
                currentDate: new Date(2018, 4, 10),
                views: ['week', 'month'],
                currentView: 'week',
                focusStateEnabled: true,
                scrolling: { mode: scrollingMode },
                width: 600
            });

            const keyboard = keyboardMock(scheduler.instance.getWorkSpace().$element());
            const cell = scheduler.workSpace.getCell(7);

            pointerMock(cell).start().click();
            keyboard.keyDown('down', { shiftKey: true });

            assert.deepEqual(scheduler.instance.option('selectedCellData'), [{
                startDate: new Date(2018, 4, 6, 0, 30),
                endDate: new Date(2018, 4, 6, 1),
                allDay: false,
                groups: undefined,
                groupIndex: 0,
            }, {
                startDate: new Date(2018, 4, 6, 1),
                endDate: new Date(2018, 4, 6, 1, 30),
                allDay: false,
                groups: undefined,
                groupIndex: 0,
            }], 'correct cell data');

            scheduler.instance.option('currentDate', new Date(2018, 5, 10));
            assert.deepEqual(scheduler.instance.option('selectedCellData'), [], 'selectedCellData was cleared');
        });
    });

    QUnit.test('Multiple reloading should be avoided after some options changing (T656320)', function(assert) {
        let counter = 0;

        const scheduler = createWrapper();

        scheduler.instance.option('dataSource', new DataSource({
            store: new CustomStore({
                load: function() {
                    counter++;
                    return [];
                }
            })
        }));
        assert.equal(counter, 1, 'Data source was reloaded after dataSource option changing');
        scheduler.instance.beginUpdate();
        scheduler.instance.option('startDayHour', 10);
        scheduler.instance.option('endDayHour', 18);
        scheduler.instance.endUpdate();
        assert.equal(counter, 2, 'Data source was reloaded one more time after some options changing');
    });

    QUnit.test('Multiple reloading should be avoided after repaint (T737181)', function(assert) {
        let counter = 0;

        const scheduler = createWrapper();

        scheduler.instance.option('dataSource', new DataSource({
            store: new CustomStore({
                load: function() {
                    counter++;
                    return [];
                }
            })
        }));
        assert.equal(counter, 1, 'Data source was reloaded after dataSource option changing');
        scheduler.instance.repaint();
        assert.equal(counter, 1, 'Data source wasn\'t reloaded after repaint');
    });

    QUnit.test('Multiple reloading should be avoided after some currentView options changing (T656320)', function(assert) {
        let counter = 0;
        let resourceCounter = 0;

        const scheduler = createWrapper({
            dataSource: new DataSource({
                store: new CustomStore({
                    load: function() {
                        counter++;
                        return [];
                    }
                })
            }),
            groups: ['owner.id'],
            resources: [{
                fieldExpr: 'owner.id',
                dataSource: new DataSource({
                    store: new CustomStore({
                        load: function() {
                            const d = $.Deferred();
                            setTimeout(function() {
                                resourceCounter++;
                                assert.equal(counter, resourceCounter - 1);
                                d.resolve([{ id: 1, text: 'text' }]);
                            }, 100);

                            return d.promise();
                        }
                    })
                })
            }],
        });
        this.clock.tick(100);
        assert.equal(resourceCounter, 1, 'Resources was reloaded after dataSource option changing');
        scheduler.instance.beginUpdate();
        scheduler.instance.option('currentView', 'timelineDay');
        scheduler.instance.option('currentView', 'timelineMonth');
        scheduler.instance.endUpdate();
        this.clock.tick(100);
        assert.equal(resourceCounter, 2, 'Resources was reloaded one more time after dataSource option changing');
    });


    [
        { startDayHour: 0, endDayHour: 0 },
        { startDayHour: 2, endDayHour: 0 }
    ].forEach(dayHours => {
        QUnit.test(`Generate error if option changed to startDayHour: ${dayHours.startDayHour} >= endDayHour: ${dayHours.endDayHour}`, function(assert) {
            const scheduler = createWrapper({
                currentDate: new Date(2015, 4, 24),
                views: ['day'],
                currentView: 'day',
                startDayHour: 8,
                endDayHour: 12
            });

            assert.throws(
                () => {
                    scheduler.instance.option('startDayHour', dayHours.startDayHour);
                    scheduler.instance.option('endDayHour', dayHours.endDayHour);
                },
                e => /E1058/.test(e.message),
                'E1058 Error message'
            );
        });

        QUnit.test(`Generate error if workSpace option changed to startDayHour: ${dayHours.startDayHour} >= endDayHour: ${dayHours.endDayHour}`, function(assert) {
            const scheduler = createWrapper({
                currentDate: new Date(2015, 4, 24),
                views: [{
                    name: 'day',
                    type: 'day'
                }],
                currentView: 'day',
                startDayHour: 8,
                endDayHour: 12
            });

            assert.throws(
                () => {
                    const instance = scheduler.instance;
                    instance.option('views[0].startDayHour', dayHours.startDayHour);
                    instance.option('views[0].endDayHour', dayHours.endDayHour);
                },
                e => /E1058/.test(e.message),
                'E1058 Error message'
            );
        });

        QUnit.test(`Generate error if currentView changed to view.startDayHour: ${dayHours.startDayHour} >= view.endDayHour: ${dayHours.endDayHour}`, function(assert) {
            const scheduler = createWrapper({
                currentDate: new Date(2015, 4, 24),
                dataSource: [
                    {
                        startDate: new Date(2015, 4, 24, 0),
                        endDate: new Date(2015, 4, 24, 2),
                        allDay: true
                    }
                ],
                views: [{
                    name: 'day',
                    type: 'day'
                }, {
                    name: 'week',
                    type: 'week',
                    startDayHour: dayHours.startDayHour,
                    endDayHour: dayHours.endDayHour
                }],
                currentView: 'day',
                startDayHour: 8,
                endDayHour: 12
            });

            assert.throws(
                () => {
                    scheduler.instance.option('currentView', 'week');
                },
                e => /E1058/.test(e.message),
                'E1058 Error message'
            );
        });
    });

    [
        { startDayHour: 0, endDayHour: 24, cellDuration: 95 },
        { startDayHour: 8, endDayHour: 24, cellDuration: 90 }
    ].forEach(config => {
        QUnit.test(`Options changing, generate warning if cellDuration: ${config.cellDuration} could not divide the range from startDayHour: ${config.startDayHour} to the endDayHour: ${config.endDayHour} into even intervals`, function(assert) {
            const scheduler = createWrapper({
                currentDate: new Date(2015, 4, 24),
                views: ['day'],
                currentView: 'day',
                startDayHour: 8,
                endDayHour: 12
            });
            scheduler.instance.option({
                startDayHour: config.startDayHour,
                endDayHour: config.endDayHour,
                cellDuration: config.cellDuration
            });

            assert.equal(errors.log.callCount, 1, 'warning has been called once');
            assert.equal(errors.log.getCall(0).args[0], 'W1015', 'warning has correct error id');
        });
    });

    [
        { currentView: 'WEEK1' },
        { currentView: 'WEEK2' }
    ].forEach(view => {
        QUnit.test(`View changing, generate warning if cellDuration: ${config.cellDuration} could not divide the range from startDayHour: ${config.startDayHour} to the endDayHour: ${config.endDayHour} into even intervals`, function(assert) {
            const scheduler = createWrapper({
                currentDate: new Date(2015, 4, 24),
                views: ['day',
                    {
                        type: 'week',
                        name: 'WEEK1',
                        cellDuration: 7
                    },
                    {
                        type: 'week',
                        name: 'WEEK2',
                        cellDuration: 95
                    }],
                currentView: 'day',
                startDayHour: 8,
                endDayHour: 24
            });
            scheduler.instance.option('currentView', view.currentView);

            assert.equal(errors.log.callCount, 1, 'warning has been called once');
            assert.equal(errors.log.getCall(0).args[0], 'W1015', 'warning has correct error id');
        });
    });

    QUnit.test('Data source should not be loaded on option change if it is already being loaded (T916558)', function(assert) {
        const dataSource = new DataSource({
            store: []
        });
        const scheduler = createWrapper({
            currentDate: new Date(2015, 4, 24),
            views: ['day', 'workWeek', { type: 'week' }],
            currentView: 'day',
            dataSource,
        });

        const initMarkupSpy = sinon.spy(scheduler.instance, '_initMarkup');
        const reloadDataSourceSpy = sinon.spy(scheduler.instance, '_reloadDataSource');

        const nextDataSource = new DataSource({
            store: new CustomStore({
                load: function() {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([]);
                    }, 300);

                    return d.promise();
                }
            })
        });
        scheduler.instance.option({
            'dataSource': nextDataSource,
        });
        scheduler.instance.option({
            'views[2].intervalCount': 2,
            'views[2].startDate': new Date(),
        });

        this.clock.tick(400);

        assert.ok(initMarkupSpy.calledTwice, 'Init markup was called on the second and third option change');
        assert.ok(reloadDataSourceSpy.calledOnce, '_reloadDataSource was not called on init mark up');
    });

    QUnit.test('It should be possible to change views option when view names are specified (T995794)', function(assert) {
        const baseViews = [{
            type: 'day',
            name: 'Custom Day',
        }, {
            type: 'week',
            name: 'Custom Week',
        }];
        const timelineViews = [{
            type: 'timelineDay',
            name: 'Custom Timeline Day',
        }, {
            type: 'timelineWeek',
            name: 'Custom Timeline Week',
        }];
        const scheduler = createWrapper({
            views: baseViews,
            currentView: 'Custom Week',
        });

        scheduler.instance.option('views', timelineViews);

        assert.equal(scheduler.workSpace.getCells().length, 48, 'Everything is correct');
    });
});
