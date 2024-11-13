import 'generic_light.css!';
import '__internal/scheduler/m_subscribes';
import '__internal/scheduler/m_scheduler';
import {
    DateGeneratorBaseStrategy,
    DateGeneratorVirtualStrategy
} from '__internal/scheduler/appointments/m_settings_generator';

import $ from 'jquery';
import fx from 'common/core/animation/fx';
import dateUtils from 'core/utils/date';
import config from 'core/config';

import { ExpressionUtils } from '__internal/scheduler/m_expression_utils';
import { createWrapper } from '../../helpers/scheduler/helpers.js';

import { getAppointmentColor, createExpressions } from '__internal/scheduler/resources/m_utils';
import { getAppointmentTakesSeveralDays } from '__internal/scheduler/appointments/data_provider/m_utils';

const {
    module,
    testStart,
    test
} = QUnit;

testStart(function() {
    $('#qunit-fixture').html('<div id="scheduler"></div>');
});

module('Subscribes', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.createInstance = (options) => {
            this.scheduler = createWrapper(options);
            this.instance = this.scheduler.instance;
        };
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
}, function() {
    test('"getTargetedAppointmentData" should return correct data for recurrence appointments (T660901)', function(assert) {
        const appointmentData = {
            startDate: new Date(2015, 1, 1, 5, 11),
            endDate: new Date(2015, 1, 1, 6),
            recurrenceRule: 'FREQ=HOURLY;INTERVAL=2'
        };
        this.createInstance({
            currentDate: new Date(2015, 1, 1),
            currentView: 'day',
            dataSource: [appointmentData]
        });

        const $appointments = this.instance.$element().find('.dx-scheduler-appointment');
        const targetedData = this.instance.fire('getTargetedAppointmentData', appointmentData, $appointments.eq(1));

        assert.equal(targetedData.startDate.getTime(), appointmentData.startDate.getTime() + 2 * 3600000, 'Targeted startDate is OK');
        assert.equal(targetedData.endDate.getTime(), appointmentData.endDate.getTime() + 2 * 3600000, 'Targeted endDate is OK');
    });

    [
        {
            scrollingMode: 'standard',
            expectedType: DateGeneratorBaseStrategy
        },
        {
            scrollingMode: 'virtual',
            expectedType: DateGeneratorVirtualStrategy
        }
    ].forEach(option => {
        test(`Appointment dates generator strategy should has correct type if scrolling.mode: ${option.scrollingMode}`, function(assert) {
            this.createInstance({
                currentView: 'day',
                scrolling: {
                    mode: option.scrollingMode
                }
            });

            const layoutManager = this.instance.getLayoutManager();
            const appointmentRenderingStrategy = layoutManager.getRenderingStrategyInstance();
            const { dateSettingsStrategy } = appointmentRenderingStrategy.getAppointmentSettingsGenerator();

            assert.ok(dateSettingsStrategy instanceof option.expectedType, 'Type of the appointment dates generator is correct');
        });
    });

    test('\'setCellDataCacheAlias\' should call workSpace method with right arguments', function(assert) {
        this.createInstance({
            currentView: 'week'
        });

        const setCacheAliasStub = sinon.stub(this.instance.getWorkSpace(), 'setCellDataCacheAlias');
        try {
            this.instance.fire('setCellDataCacheAlias', {
                rowIndex: 1,
                columnIndex: 2,
                groupIndex: 3,
                left: 4,
                top: 5
            }, {
                left: 4,
                top: 5
            });

            assert.ok(setCacheAliasStub.calledOnce, 'setCellDataCacheAlias workSpace method called once');
            assert.deepEqual(setCacheAliasStub.getCall(0).args[0], {
                rowIndex: 1,
                columnIndex: 2,
                groupIndex: 3,
                left: 4,
                top: 5
            }, 'setCellDataCacheAlias workSpace method called with correct appointmentSettings');
            assert.deepEqual(setCacheAliasStub.getCall(0).args[1], {
                left: 4,
                top: 5
            }, 'setCellDataCacheAlias workSpace method called with correct geometry');
        } finally {
            setCacheAliasStub.restore();
        }
    });

    test('\'createAppointmentSettings\' should return workSpace date table scrollable', function(assert) {
        this.createInstance({
            currentView: 'day',
            startDayHour: 2,
            endDayHour: 10,
            currentDate: 1425416400000
        });

        const layoutManager = this.instance.getLayoutManager();
        const appointmentRenderingStrategy = layoutManager.getRenderingStrategyInstance();
        const coordinate = appointmentRenderingStrategy.generateAppointmentSettings({
            startDate: new Date(2015, 2, 3, 22),
            endDate: new Date(2015, 2, 17, 10, 30)
        });
        assert.roughEqual(coordinate[0].top, 0, 1.001, 'Top coordinate is OK');
    });

    test('\'needRecalculateResizableArea\' should return false for horizontal grouped workspace', function(assert) {
        this.createInstance({
            currentView: 'workWeek',
            views: [{
                type: 'workWeek',
                groupOrientation: 'horizontal'
            }],
            height: 500,
            groups: ['priorityId'],
            resources: [{
                field: 'typeId',
                dataSource: [{ id: 1, color: 'red' }]
            },
            {
                field: 'priorityId',
                dataSource: [{ id: 1, color: 'black' }]
            }
            ]
        });

        const scrollable = this.instance.getWorkSpace().getScrollable();
        scrollable.scrollTo({ left: 0, top: 400 });

        const needRecalculate = this.instance.fire('needRecalculateResizableArea');

        assert.notOk(needRecalculate, 'Resizable area should not be recalculated');
    });

    test('\'needRecalculateResizableArea\' should return true for vertical grouped workspace', function(assert) {
        this.createInstance({
            currentView: 'workWeek',
            views: [{
                type: 'workWeek',
                groupOrientation: 'vertical'
            }],
            height: 500,
            groups: ['priorityId'],
            resources: [{
                field: 'typeId',
                dataSource: [{ id: 1, color: 'red' }]
            },
            {
                field: 'priorityId',
                dataSource: [{ id: 1, color: 'black' }]
            }
            ]
        });

        const scrollable = this.instance.getWorkSpace().getScrollable();
        scrollable.scrollTo({ left: 0, top: 400 });

        const needRecalculate = this.instance.fire('needRecalculateResizableArea');

        assert.ok(needRecalculate, 'Resizable area should be recalculated');
    });

    test('"createAppointmentSettings" should return correct count of coordinates for allDay recurrence appointment', function(assert) {
        this.createInstance();
        this.instance.option({
            currentView: 'week',
            startDayHour: 2,
            endDayHour: 10,
            currentDate: new Date(2015, 2, 2, 0),
            firstDayOfWeek: 1,
            dataSource: [{
                startDate: new Date(2015, 2, 2, 0),
                endDate: new Date(2015, 2, 3, 0),
                recurrenceRule: 'FREQ=DAILY'
            }]
        });

        const layoutManager = this.instance.getLayoutManager();
        const { _positionMap } = layoutManager;

        assert.equal(_positionMap[0].length, 7, 'count is OK');
    });

    test('"createAppointmentSettings" should return correct count of coordinates for allDay recurrence appointment, allDay = true', function(assert) {
        this.createInstance();
        this.instance.option({
            currentView: 'week',
            startDayHour: 2,
            endDayHour: 10,
            currentDate: new Date(2015, 2, 2, 0),
            firstDayOfWeek: 1,
            dataSource: [{
                'startDate': new Date(2015, 2, 2, 0),
                'endDate': new Date(2015, 2, 3, 0),
                'recurrenceRule': 'FREQ=DAILY',
                allDay: true
            }]
        });

        const layoutManager = this.instance.getLayoutManager();
        const { _positionMap } = layoutManager;

        assert.equal(_positionMap[0].length, 7, 'count is OK');
    });

    test('"createAppointmentSettings" should not change dateRange', function(assert) {
        this.createInstance({
            currentView: 'week',
            startDayHour: 2,
            endDayHour: 10,
            currentDate: new Date(2015, 2, 2, 0),
            firstDayOfWeek: 1,
            dataSource: [{
                'startDate': new Date(2015, 2, 2, 0),
                'endDate': new Date(2015, 2, 3, 0),
                'recurrenceRule': 'FREQ=DAILY',
                allDay: true
            }]
        });

        const instance = this.instance;
        const dateRange = instance._workSpace.getDateRange();

        const layoutManager = this.instance.getLayoutManager();
        const appointmentRenderingStrategy = layoutManager.getRenderingStrategyInstance();

        appointmentRenderingStrategy.generateAppointmentSettings({
            'startDate': new Date(2015, 2, 2, 1),
            'endDate': new Date(2015, 2, 3, 1),
            'recurrenceRule': 'FREQ=DAILY',
            allDay: true
        });

        assert.deepEqual(dateRange, instance._workSpace.getDateRange(), 'Date range wasn\'t changed');
    });

    test('Long appointment in Timeline view should have right left coordinate', function(assert) {
        this.createInstance({
            currentView: 'timelineDay',
            views: ['timelineDay'],
            currentDate: new Date(2015, 2, 3),
            dataSource: [{
                'startDate': new Date(2015, 2, 3, 0, 30),
                'endDate': new Date(2015, 2, 5, 15, 30)
            }]
        });

        const layoutManager = this.instance.getLayoutManager();
        const { _positionMap } = layoutManager;

        const $expectedCell = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(1);
        const expectedLeftCoordinate = $expectedCell.position().left;

        assert.equal(_positionMap[0][0].left, expectedLeftCoordinate, 'left coordinate is OK');
    });

    test('"mapAppointmentFields" should call getTargetedAppointment', function(assert) {
        this.createInstance();

        const stub = sinon.stub(this.instance, 'getTargetedAppointment');

        this.instance.fire('mapAppointmentFields', {
            itemData: {
                startDate: new Date(2015, 1, 1),
                endDate: new Date(2015, 1, 1, 1),
                allDay: true
            }
        });

        const appointmentData = stub.getCall(0).args[0];

        assert.deepEqual(appointmentData, {
            startDate: new Date(2015, 1, 1),
            endDate: new Date(2015, 1, 1, 1),
            allDay: true
        }, 'Appointment data is OK');
    });

    test('"showAddAppointmentPopup" should update appointment data if there is some custom data fields', function(assert) {
        this.createInstance();
        const stub = sinon.stub(this.instance, 'showAppointmentPopup');

        this.instance.option({
            startDateExpr: 'Start',
            endDateExpr: 'End',
            allDayExpr: 'AllDay'
        });

        this.instance.showAddAppointmentPopup({
            startDate: new Date(2015, 1, 1),
            endDate: new Date(2015, 1, 1, 1),
            allDay: true
        });

        const appointmentData = stub.getCall(0).args[0];

        assert.deepEqual(appointmentData, {
            Start: new Date(2015, 1, 1),
            End: new Date(2015, 1, 1, 1),
            AllDay: true
        }, 'Appointment data is OK');
    });

    test('check the "getField" method with date field', function(assert) {
        const defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = true;
        try {
            this.createInstance();
            const startDate = ExpressionUtils.getField(this.instance._dataAccessors, 'startDate', { startDate: '2017-02-08' });
            assert.deepEqual(startDate, new Date(2017, 1, 8), 'the "getField" method works fine');

            const endDate = ExpressionUtils.getField(this.instance._dataAccessors, 'endDate', { endDate: '2017-02-09' });
            assert.deepEqual(endDate, new Date(2017, 1, 9), 'the "getField" method works fine');
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    test('check the "setField" method with date field and auto detect of serialization format', function(assert) {
        const defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = true;
        try {
            this.createInstance();
            const obj = { startDate: '2017-02-07', endDate: '2017-02-08' };

            ExpressionUtils.getField(this.instance._dataAccessors, 'startDate', obj);

            ExpressionUtils.setField(this.instance._dataAccessors, 'startDate', obj, new Date(2017, 1, 8));
            assert.equal(obj.startDate, '2017-02-08', 'the "setField" method works fine');

            ExpressionUtils.setField(this.instance._dataAccessors, 'endDate', obj, new Date(2017, 1, 10));
            assert.equal(obj.endDate, '2017-02-10', 'the "setField" method works fine');
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    test('prevent unexpected dateSerializationFormat option changing', function(assert) {
        const defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = true;
        try {
            this.createInstance();
            const obj = { startDate: new Date(2017, 2, 7) };

            assert.strictEqual(this.instance.option('dateSerializationFormat'), undefined);
            ExpressionUtils.getField(this.instance._dataAccessors, 'startDate', obj);

            assert.strictEqual(this.instance.option('dateSerializationFormat'), undefined);
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    test('check the \'setField\' method with date field and dateSerializationFormat', function(assert) {
        this.createInstance({
            dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssZ'
        });
        const obj = { startDate: '2017-02-07', endDate: '2017-02-08' };

        ExpressionUtils.setField(this.instance._dataAccessors, 'startDate', obj, new Date(Date.UTC(2017, 1, 8, 1)));
        assert.equal(obj.startDate, '2017-02-08T01:00:00Z', 'the \'setField\' method works fine');

        ExpressionUtils.setField(this.instance._dataAccessors, 'endDate', obj, new Date(Date.UTC(2017, 1, 10, 1)));
        assert.equal(obj.endDate, '2017-02-10T01:00:00Z', 'the \'setField\' method works fine');
    });

    test('check the "getField" method', function(assert) {
        this.createInstance();
        const text = ExpressionUtils.getField(this.instance._dataAccessors, 'text', { text: 1 });
        assert.equal(text, 1, 'the "getField" method works fine');
    });

    test('check the \'getField - recurrenceRule\' method, if recurrenceRuleExpr = null', function(assert) {
        this.createInstance({
            recurrenceRuleExpr: null
        });

        const recurrenceRule = ExpressionUtils.getField(this.instance._dataAccessors, 'recurrenceRule', { recurrenceRule: 'FREQ=daily' });
        assert.strictEqual(recurrenceRule, undefined, 'the "getField" method works fine');
    });

    test('check the \'getField - recurrenceRule\' method, if recurrenceRuleExpr was set as null after option changed', function(assert) {
        this.createInstance();

        this.instance.option({
            recurrenceRuleExpr: null
        });

        const recurrenceRule = ExpressionUtils.getField(this.instance._dataAccessors, 'recurrenceRule', { recurrenceRule: 'FREQ=daily' });
        assert.strictEqual(recurrenceRule, undefined, 'the "getField" method works fine');
    });

    test('check the \'getField - recurrenceRule\' method, if recurrenceRuleExpr was set as value after option changed', function(assert) {
        this.createInstance({
            recurrenceRuleExpr: null
        });

        this.instance.option({
            recurrenceRuleExpr: 'recurrenceRule'
        });

        const recurrenceRule = ExpressionUtils.getField(this.instance._dataAccessors, 'recurrenceRule', { recurrenceRule: 'FREQ=daily' });
        assert.equal(recurrenceRule, 'FREQ=daily', 'the "getField" method works fine');
    });

    test('check the \'setField\' method', function(assert) {
        this.createInstance();
        const obj = { text: 1 };

        ExpressionUtils.setField(this.instance._dataAccessors, 'text', obj, 2);
        assert.equal(obj.text, 2, 'the \'setField\' method works fine');
    });

    test('check the \'setField\' method with multi-dotted string', function(assert) {
        this.createInstance({ textExpr: 'a.b.text' });
        const obj = ExpressionUtils.setField(this.instance._dataAccessors, 'text', {}, 2);
        const obj1 = ExpressionUtils.setField(this.instance._dataAccessors, 'text', { c: 'just field' }, 2);

        assert.deepEqual(obj, { a: { b: { text: 2 } } }, 'the \'setField\' method works fine');
        assert.deepEqual(obj1, { c: 'just field', a: { b: { text: 2 } } }, 'the \'setField\' method works fine');
    });

    test('check the \'setField-recurrenceRule\' method, if recurrenceRuleExpr = null', function(assert) {
        this.createInstance({
            recurrenceRuleExpr: null
        });

        const obj = { recurrenceRule: 'FREQ=DAILY' };

        ExpressionUtils.setField(this.instance._dataAccessors, 'recurrenceRule', obj, 'FREQ=WEEKLY');
        assert.equal(obj.recurrenceRule, 'FREQ=DAILY', 'the \'setField\' method works fine');
    });

    test('check the \'setField-recurrenceRule\' method, if recurrenceRuleExpr was set as null after option changed', function(assert) {
        this.createInstance();

        this.instance.option({
            recurrenceRuleExpr: null
        });

        const obj = { recurrenceRule: 'FREQ=DAILY' };

        ExpressionUtils.setField(this.instance._dataAccessors, 'recurrenceRule', obj, 'FREQ=WEEKLY');
        assert.equal(obj.recurrenceRule, 'FREQ=DAILY', 'the \'setField\' method works fine');
    });

    test('check the \'setField-recurrenceRule\' method, if recurrenceRuleExpr was set as value after option changed', function(assert) {
        this.createInstance({
            recurrenceRuleExpr: null
        });

        this.instance.option({
            recurrenceRuleExpr: 'recurrenceRule'
        });

        const obj = { recurrenceRule: 'FREQ=DAILY' };

        ExpressionUtils.setField(this.instance._dataAccessors, 'recurrenceRule', obj, 'FREQ=WEEKLY');
        assert.equal(obj.recurrenceRule, 'FREQ=WEEKLY', 'the \'setField\' method works fine');
    });

    test('appointmentTakesSeveralDays should return true, if startDate and endDate is different days', function(assert) {
        this.createInstance();
        this.instance.option({
            currentView: 'week',
            currentDate: new Date(2016, 1, 1),
        });

        const appointments = [
            {
                startDate: new Date(2016, 1, 2, 2),
                endDate: new Date(2016, 1, 3, 7)
            },
            {
                startDate: new Date(2016, 1, 2, 2),
                endDate: new Date(2016, 1, 2, 7)
            }
        ];

        assert.ok(getAppointmentTakesSeveralDays(
            appointments[0],
            this.instance._dataAccessors,
            this.instance.timeZoneCalculator,
        ), 'appointmentTakesSeveralDays works correctly');
        assert.notOk(getAppointmentTakesSeveralDays(
            appointments[1],
            this.instance._dataAccessors,
            this.instance.timeZoneCalculator,
        ), 'appointmentTakesSeveralDays works correctly');
    });

    test('UpdateAppointmentEndDate should return corrected endDate', function(assert) {
        this.createInstance();
        this.instance.option({
            currentView: 'timelineWeek',
            currentDate: 1425416400000,
            startDayHour: 1,
            endDayHour: 10
        });

        const appointment = {
            startDate: new Date(2015, 2, 3, 9, 30),
            endDate: new Date(2015, 2, 3, 10, 30)
        };

        const result = this.instance.fire('updateAppointmentEndDate', {
            appointment: appointment,
            endDate: appointment.endDate,
        });
        assert.deepEqual(result, new Date(2015, 2, 3, 10), 'Updated date is correct');
    });

    test('UpdateAppointmentEndDate should return corrected endDate for long appointment', function(assert) {
        this.createInstance();
        this.instance.option({
            currentView: 'timelineWeek',
            currentDate: 1425416400000,
            startDayHour: 1,
            endDayHour: 10
        });

        const appointment = {
            startDate: new Date(2015, 2, 2, 9, 30),
            endDate: new Date(2015, 2, 3, 10, 30)
        };

        const result = this.instance.fire('updateAppointmentEndDate', {
            appointment: appointment,
            endDate: appointment.endDate,
        });
        assert.deepEqual(result, new Date(2015, 2, 3, 10), 'Updated date is correct');
    });

    test('UpdateAppointmentEndDate should return corrected endDate by certain endDayHour', function(assert) {
        this.createInstance({
            currentView: 'timelineWeek',
            views: [{
                type: 'timelineWeek',
                endDayHour: 18
            }],
            startDayHour: 9,
            endDayHour: 23,
            currentDate: new Date(2015, 2, 3)
        });

        const appointment = {
            startDate: new Date(2015, 2, 3, 9, 30),
            endDate: new Date(2015, 2, 3, 20, 30)
        };

        const result = this.instance.fire('updateAppointmentEndDate', {
            appointment: appointment,
            endDate: appointment.endDate,
        });
        assert.deepEqual(result, new Date(2015, 2, 3, 18), 'Updated date is correct');
    });

    test('"getAppointmentDurationInMs" should return visible appointment duration', function(assert) {
        this.createInstance();

        const renderingStrategy = this.instance.getRenderingStrategyInstance();
        const result = renderingStrategy.getAppointmentDurationInMs(
            new Date(2015, 2, 2, 8),
            new Date(2015, 2, 2, 20)
        );

        assert.equal(result / dateUtils.dateToMilliseconds('hour'), 12, '"getAppointmentDurationInMs" works fine');
    });

    test('"getAppointmentDurationInMs" should return visible appointment duration considering startDayHour and endDayHour', function(assert) {
        this.createInstance();

        this.instance.option({
            startDayHour: 8,
            endDayHour: 20
        });

        const renderingStrategy = this.instance.getRenderingStrategyInstance();
        const result = renderingStrategy.getAppointmentDurationInMs(
            new Date(2015, 2, 2, 8),
            new Date(2015, 2, 4, 20)
        );

        assert.equal(result / dateUtils.dateToMilliseconds('hour'), 12 * 3, '"getAppointmentDurationInMs" works fine');
    });

    test('"getAppointmentDurationInMs" should return visible appointment duration considering startDayHour and endDayHour for stricly allDay appointment without allDay field', function(assert) {
        this.createInstance();

        this.instance.option({
            startDayHour: 8,
            endDayHour: 20
        });

        const renderingStrategy = this.instance.getRenderingStrategyInstance();
        const result = renderingStrategy.getAppointmentDurationInMs(
            new Date(2015, 2, 2, 8),
            new Date(2015, 2, 3, 0)
        );
        assert.equal(result / dateUtils.dateToMilliseconds('hour'), 12, '"getAppointmentDurationInMs" works fine');
    });

    test('"getAppointmentDurationInMs" should return visible appointment duration considering hours of startDate and endDate', function(assert) {
        this.createInstance();

        this.instance.option({
            startDayHour: 1,
            endDayHour: 22
        });

        const renderingStrategy = this.instance.getRenderingStrategyInstance();
        const result = renderingStrategy.getAppointmentDurationInMs(
            new Date(2015, 4, 25, 21),
            new Date(2015, 4, 26, 3)
        );
        assert.equal(result / dateUtils.dateToMilliseconds('hour'), 3, '"getAppointmentDurationInMs" works fine');
    });

    test('"getAppointmentDurationInMs" should return visible long appointment duration considering hours of startDate and endDate', function(assert) {
        this.createInstance();

        this.instance.option({
            startDayHour: 8,
            endDayHour: 20
        });

        const renderingStrategy = this.instance.getRenderingStrategyInstance();
        const result = renderingStrategy.getAppointmentDurationInMs(
            new Date(2015, 2, 2, 10),
            new Date(2015, 2, 4, 17)
        );
        assert.equal(result / dateUtils.dateToMilliseconds('hour'), 31, '"getAppointmentDurationInMs" works fine');
    });

    test('"getAppointmentDurationInMs" should return visible appointment duration considering hours of ultraboundary startDate and endDate', function(assert) {
        this.createInstance();

        this.instance.option({
            startDayHour: 8,
            endDayHour: 20
        });

        const renderingStrategy = this.instance.getRenderingStrategyInstance();
        const result = renderingStrategy.getAppointmentDurationInMs(
            new Date(2015, 2, 2, 7),
            new Date(2015, 2, 4, 21),
        );
        assert.equal(result / dateUtils.dateToMilliseconds('hour'), 12 * 3, '"getAppointmentDurationInMs" works fine');
    });

    test('"getAppointmentDurationInMs" should return visible allDay appointment duration', function(assert) {
        this.createInstance();

        this.instance.option({
            startDayHour: 8,
            endDayHour: 20
        });

        const renderingStrategy = this.instance.getRenderingStrategyInstance();
        const result = renderingStrategy.getAppointmentDurationInMs(
            new Date(2015, 2, 2, 7),
            new Date(2015, 2, 4, 21),
            true,
        );

        assert.equal(result / dateUtils.dateToMilliseconds('hour'), 12 * 3, '"getAppointmentDurationInMs" works fine');
    });

    test('"getAppointmentColor" by certain group', function(assert) {
        let appointmentColor;

        this.createInstance({
            currentView: 'workWeek',
            views: ['week', {
                type: 'workWeek',
                groups: ['typeId']
            }],
            groups: ['priorityId'],
            resources: [{
                field: 'typeId',
                dataSource: [{ id: 1, color: 'red' }]
            },
            {
                field: 'priorityId',
                dataSource: [{ id: 1, color: 'black' }]
            }
            ]
        });

        const groups = this.instance._getCurrentViewOption('groups');

        const config = {
            resources: this.instance.option('resources'),
            dataAccessors: createExpressions(this.instance.option('resources')),
            loadedResources: this.instance.option('loadedResources'),
            resourceLoaderMap: this.instance.option('resourceLoaderMap')
        };

        const result = getAppointmentColor(config, {
            itemData: {
                typeId: 1,
                priorityId: 1
            },
            groupIndex: 0,
            groups,
        });

        result.done(function(color) {
            appointmentColor = color;
        });

        assert.strictEqual(appointmentColor, 'red', 'appointment color');
    });

    test('"getAppointmentColor" with fieldExpr for complex resource', function(assert) {
        let appointmentColor;

        this.createInstance({
            currentView: 'workWeek',
            views: ['week', {
                type: 'workWeek',
                groups: ['typeId']
            }],
            groups: ['TheatreId'],
            resources: [{
                fieldExpr: 'Movie.ID',
                useColorAsDefault: true,
                allowMultiple: false,
                dataSource: [{
                    'ID': 1,
                    'Color': 'blue'
                }, {
                    'ID': 3,
                    'Color': 'red'
                }],
                valueExpr: 'ID',
                colorExpr: 'Color'
            }, {
                fieldExpr: 'TheatreId',
                dataSource: [{
                    id: 1
                }, {
                    id: 2
                }]
            }]
        });

        const groups = this.instance._getCurrentViewOption('groups');

        const config = {
            resources: this.instance.option('resources'),
            dataAccessors: createExpressions(this.instance.option('resources')),
            loadedResources: this.instance.option('loadedResources'),
            resourceLoaderMap: this.instance.option('resourceLoaderMap')
        };

        const result = getAppointmentColor(config, {
            itemData: {
                'Price': 10,
                'startDate': new Date(2015, 4, 24, 9, 10, 0, 0),
                'endDate': new Date(2015, 4, 24, 11, 1, 0, 0),
                'Movie': {
                    'ID': 3
                },
                'TheatreId': 1
            },
            groupIndex: 0,
            groups
        });

        result.done(function(color) {
            appointmentColor = color;
        });

        assert.strictEqual(appointmentColor, 'red', 'appointment color is OK');
    });

    test('"maxAppointmentsPerCell" should return correct value in accordance with scheduler configuration', function(assert) {
        this.createInstance({
            views: [{
                name: 'DAY',
                type: 'day',
                maxAppointmentsPerCell: 5
            }, {
                name: 'WEEK',
                type: 'week'
            }],
            currentView: 'DAY',
            dataSource: [{ startDate: new Date(2016, 2, 1, 1), endDate: new Date(2016, 2, 1, 2) }]
        });

        let countPerCell = this.instance._getCurrentViewOption('maxAppointmentsPerCell');

        assert.equal(countPerCell, 5, 'overlappingMode is OK');

        this.instance.option('currentView', 'WEEK');

        countPerCell = this.instance._getCurrentViewOption('maxAppointmentsPerCell');

        assert.equal(countPerCell, 'auto', 'overlappingMode is OK');
    });

    test('"maxAppointmentsPerCell" should return correct value in accordance with view configuration', function(assert) {
        this.createInstance({
            views: [{
                name: 'DAY',
                type: 'day',
                maxAppointmentsPerCell: 5
            }, {
                name: 'WEEK',
                type: 'week',
                maxAppointmentsPerCell: 'unlimited'
            }],
            currentView: 'DAY',
            dataSource: [{ startDate: new Date(2016, 2, 1, 1), endDate: new Date(2016, 2, 1, 2) }]
        });

        let countPerCell = this.instance._getCurrentViewOption('maxAppointmentsPerCell');

        assert.equal(countPerCell, 5, 'overlappingMode is OK');

        this.instance.option('currentView', 'WEEK');

        countPerCell = this.instance._getCurrentViewOption('maxAppointmentsPerCell');

        assert.equal(countPerCell, 'unlimited', 'overlappingMode is OK');
    });

    test('\'isAdaptive\' subscribe should work correctly', function(assert) {
        this.createInstance({
            dataSource: [],
            adaptivityEnabled: true
        });

        assert.ok(this.instance.fire('isAdaptive'), 'Scheduler is adaptive');

        this.instance.option('adaptivityEnabled', false);

        this.clock.tick(300);
        assert.notOk(this.instance.fire('isAdaptive'), 'Scheduler isn\'t adaptive');
    });

    test('\'getDropDownAppointmentWidth\' and \'getDropDownAppointmentHeight\' subscribes should work correctly', function(assert) {
        this.createInstance({
            dataSource: [],
            adaptivityEnabled: true
        });
        this.clock.tick(300);

        const width = this.instance.fire('getDropDownAppointmentWidth');
        const height = this.instance.fire('getDropDownAppointmentHeight');

        assert.equal(height, 28, 'Returned height is ok');
        assert.equal(width, 28, 'Returned width is ok');
    });

    test('\'supportCompactDropDownAppointments\' should return true for some views', function(assert) {
        this.createInstance({
            dataSource: [],
            views: ['motnh', 'week'],
            currentView: 'week'
        });
        this.clock.tick(300);

        assert.ok(this.instance.fire('supportCompactDropDownAppointments'));

        this.instance.option('currentView', 'month');

        assert.notOk(this.instance.fire('supportCompactDropDownAppointments'));
    });

    test('getTextAndFormatDate with format TIME should work correct', function(assert) {
        const data = {
            text: 'Appointment test text',
            startDate: new Date(2018, 2, 1, 10),
            endDate: new Date(2018, 2, 1, 11)
        };
        this.createInstance({
            dataSource: [data],
            views: ['week'],
            currentView: 'week'
        });

        assert.deepEqual(this.instance.fire('getTextAndFormatDate', data, data, 'TIME'), {
            formatDate: '10:00 AM - 11:00 AM',
            text: 'Appointment test text'
        });
    });

    test('getTextAndFormatDate, appointment with allDay option, without format', function(assert) {
        const data = {
            text: 'Appointment test text',
            startDate: new Date(2018, 2, 1, 10),
            endDate: new Date(2018, 2, 1, 11),
            allDay: true
        };
        this.createInstance({
            dataSource: [data],
            views: ['week'],
            currentView: 'week'
        });

        assert.deepEqual(this.instance.fire('getTextAndFormatDate', data, data), {
            formatDate: 'March 1',
            text: 'Appointment test text'
        });
    });

    test('getTextAndFormatDate, with expr fields', function(assert) {
        const data = {
            Text: 'Appointment test text',
            StartDate: new Date(2018, 2, 1, 10),
            EndDate: new Date(2018, 2, 1, 11),
            AllDay: true,
        };
        this.createInstance({
            dataSource: [data],
            views: ['week'],
            currentView: 'week',
            textExpr: 'Text',
            startDateExpr: 'StartDate',
            endDateExpr: 'EndDate',
            allDayExpr: 'AllDay',
        });

        assert.deepEqual(this.instance.fire('getTextAndFormatDate', data, data), {
            formatDate: 'March 1',
            text: 'Appointment test text'
        });
    });

    test('getTextAndFormatDate, simple appointment, without format', function(assert) {
        const data = {
            text: 'Appointment test text',
            startDate: new Date(2018, 2, 1, 10),
            endDate: new Date(2018, 2, 1, 11),
        };
        this.createInstance({
            dataSource: [data],
            views: ['week'],
            currentView: 'week'
        });

        assert.deepEqual(this.instance.fire('getTextAndFormatDate', data, data), {
            formatDate: '10:00 AM - 11:00 AM',
            text: 'Appointment test text'
        });
    });

    test('getTextAndFormatDate, simple appointment, month view, without format', function(assert) {
        const data = {
            text: 'Appointment test text',
            startDate: new Date(2018, 2, 1, 10),
            endDate: new Date(2018, 2, 1, 11),
        };
        this.createInstance({
            dataSource: [data],
            views: ['month'],
            currentView: 'month'
        });

        assert.deepEqual(this.instance.fire('getTextAndFormatDate', data, data), {
            formatDate: 'March 1 10:00 AM - 11:00 AM',
            text: 'Appointment test text'
        });
    });

    test('getTextAndFormatData, recurrance appointment with different data', function(assert) {
        const initialData = {
            text: 'Appointment test text',
            startDate: new Date(2018, 2, 1, 10),
            endDate: new Date(2018, 2, 1, 11),
        };
        const dataRecur = {
            startDate: new Date(2018, 2, 2, 10),
            endDate: new Date(2018, 2, 2, 11),
        };
        this.createInstance({
            dataSource: [initialData],
            views: ['month'],
            currentView: 'month'
        });
        assert.deepEqual(this.instance.fire('getTextAndFormatDate', initialData, dataRecur), {
            formatDate: 'March 2 10:00 AM - 11:00 AM',
            text: 'Appointment test text'
        });
    });

    [undefined, 'FREQ=DAILY'].forEach(recurrenceRule => {
        test(`Appointments should not contains groupIndex if recurrenceRule: ${recurrenceRule}`, function(assert) {
            this.createInstance({
                currentDate: new Date(2015, 2, 2),
                dataSource: [{
                    startDate: new Date(2015, 2, 2, 0),
                    endDate: new Date(2015, 2, 3, 0),
                    recurrenceRule: undefined
                }]
            });

            const layoutManager = this.instance.getLayoutManager();
            const { _positionMap } = layoutManager;

            assert.notOk(_positionMap[0][0].groupIndex, 'no groupIndex');
        });
    });
});

module('Grouping By Date', {
    beforeEach: function() {
        this.createInstance = function(options) {
            this.scheduler = createWrapper(options);
            this.instance = this.scheduler.instance;
        };
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    },

    checkNeedCoordinatesResult: (assert, result, columnIndex, rowIndex, top, left, epsilon) => {
        assert.equal(result.columnIndex, columnIndex, 'columnIndex is correct');
        assert.equal(result.rowIndex, rowIndex, 'rowIndex is correct');
        assert.equal(result.top, top, 'top is correct');
        assert.roughEqual(result.left, left, epsilon, 'left is correct');
    }
}, function() {
    [true, false].forEach((isRenovatedRender) => {
        test(`'isGroupedByDate' should be true only for horizontal grouped workspace with groups when renovateRender is ${isRenovatedRender}`, function(assert) {
            this.createInstance({
                views: [{
                    name: 'DAY',
                    type: 'day',
                    groupOrientation: 'horizontal'
                }, {
                    name: 'WEEK',
                    type: 'week',
                    groupOrientation: 'vertical'
                }],
                currentView: 'DAY',
                dataSource: [],
                groupByDate: true,
                groups: ['priorityId'],
                resources: [{
                    field: 'typeId',
                    dataSource: [{ id: 1, color: 'red' }]
                }, {
                    field: 'priorityId',
                    dataSource: [{ id: 1, color: 'black' }]
                }],
                renovateRender: isRenovatedRender,
            });

            assert.equal(this.instance.fire('isGroupedByDate'), true, 'Workspace is grouped by date');

            this.instance.option('currentView', 'WEEK');
            assert.equal(this.instance.fire('isGroupedByDate'), false, 'Workspace isn\'t grouped by date');

            this.instance.option('groups', []);
            this.instance.option('currentView', 'DAY');
            assert.equal(this.instance.fire('isGroupedByDate'), false, 'Workspace isn\'t grouped by date');
        });

        test(`"createAppointmentSettings" should work correct for allDay appointment when groupByDate = true, Week view when renovateRender is ${isRenovatedRender}`, function(assert) {
            const priorityData = [
                {
                    text: 'Low Priority',
                    id: 1,
                    color: '#1e90ff'
                }, {
                    text: 'High Priority',
                    id: 2,
                    color: '#ff9747'
                }
            ];
            this.createInstance({
                currentView: 'week',
                views: [{
                    type: 'week',
                    name: 'week',
                    intervalCount: 2
                }],
                currentDate: new Date(2018, 4, 21, 9, 0),
                groupByDate: true,
                startDayHour: 9,
                groups: ['priorityId'],
                resources: [
                    {
                        fieldExpr: 'priorityId',
                        allowMultiple: false,
                        dataSource: priorityData,
                        label: 'Priority'
                    }
                ],
                renovateRender: isRenovatedRender,
                dataSource: [{
                    startDate: new Date(2018, 4, 21, 9, 0),
                    endDate: new Date(2018, 4, 23, 9, 0),
                    priorityId: 2,
                    allDay: true
                }]
            });

            const layoutManager = this.instance.getLayoutManager();
            const results = layoutManager._positionMap[0];

            assert.equal(results.length, 3, 'Result length is OK');
            this.checkNeedCoordinatesResult(assert, results[0], 3, 0, 0, 96, 1.1);
            this.checkNeedCoordinatesResult(assert, results[1], 5, 0, 0, 160, 1.1);
            this.checkNeedCoordinatesResult(assert, results[2], 7, 0, 0, 224, 1.1);
        });

        test(`"createAppointmentSettings" should work correct when groupByDate = true, Month view when renovateRender is ${isRenovatedRender}`, function(assert) {
            const priorityData = [
                {
                    text: 'Low Priority',
                    id: 1,
                    color: '#1e90ff'
                }, {
                    text: 'High Priority',
                    id: 2,
                    color: '#ff9747'
                }
            ];
            this.createInstance({
                currentView: 'month',
                views: [{
                    type: 'month',
                    name: 'month',
                    groupOrientation: 'horizontal'
                }],
                currentDate: new Date(2018, 4, 21, 9, 0),
                groupByDate: true,
                groups: ['priorityId'],
                resources: [
                    {
                        fieldExpr: 'priorityId',
                        allowMultiple: false,
                        dataSource: priorityData,
                        label: 'Priority'
                    }
                ],
                renovateRender: isRenovatedRender,
                dataSource: [{
                    startDate: new Date(2018, 4, 22, 10, 0),
                    endDate: new Date(2018, 4, 24),
                    priorityId: 2
                }]
            });

            const $cell = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).get(0);
            const cellWidth = $cell.getBoundingClientRect().width;
            const cellHeight = $cell.getBoundingClientRect().height;

            const layoutManager = this.instance.getLayoutManager();
            const results = layoutManager._positionMap[0];

            assert.equal(results.length, 2, 'Coordinates count is ok');
            this.checkNeedCoordinatesResult(assert, results[0], 5, 3, cellHeight * 3, cellWidth * 5, 1.5);
            this.checkNeedCoordinatesResult(assert, results[1], 7, 3, cellHeight * 3, cellWidth * 7, 1.5);
        });

        test(`createAppointmentSettings' should work correct for recurrenceAppointment when groupByDate = true, Month view when renovateRender is ${isRenovatedRender}`, function(assert) {
            const priorityData = [
                {
                    text: 'Low Priority',
                    id: 1,
                    color: '#1e90ff'
                }, {
                    text: 'High Priority',
                    id: 2,
                    color: '#ff9747'
                }
            ];
            this.createInstance({
                currentView: 'month',
                views: [{
                    type: 'month',
                    name: 'month',
                    groupOrientation: 'horizontal'
                }],
                currentDate: new Date(2018, 4, 21, 9, 0),
                groupByDate: true,
                groups: ['priorityId'],
                resources: [
                    {
                        fieldExpr: 'priorityId',
                        allowMultiple: false,
                        dataSource: priorityData,
                        label: 'Priority'
                    }
                ],
                renovateRender: isRenovatedRender,
                dataSource: [{
                    startDate: new Date(2018, 4, 22, 10, 0),
                    endDate: new Date(2018, 4, 23, 12),
                    priorityId: 2,
                    recurrenceRule: 'FREQ=DAILY;COUNT=3'
                }]
            });

            const $cell = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).get(0);
            const cellWidth = $cell.getBoundingClientRect().width;
            const cellHeight = $cell.getBoundingClientRect().height;

            const layoutManager = this.instance.getLayoutManager();
            const results = layoutManager._positionMap[0];

            assert.equal(results.length, 6, 'Coordinates count is ok');
            this.checkNeedCoordinatesResult(assert, results[0], 5, 3, cellHeight * 3, cellWidth * 5, 1.5);
            this.checkNeedCoordinatesResult(assert, results[1], 7, 3, cellHeight * 3, cellWidth * 7, 1.5);
            this.checkNeedCoordinatesResult(assert, results[2], 7, 3, cellHeight * 3, cellWidth * 7, 1.5);
            this.checkNeedCoordinatesResult(assert, results[3], 9, 3, cellHeight * 3, cellWidth * 9, 1.5);
            this.checkNeedCoordinatesResult(assert, results[4], 9, 3, cellHeight * 3, cellWidth * 9, 1.5);
            this.checkNeedCoordinatesResult(assert, results[5], 11, 3, cellHeight * 3, cellWidth * 11, 1.5);
        });

        // NOTE: It was false positive test. This usage scenario broken for long time.
        test.skip(`'createAppointmentSettings' should work correct when groupByDate = true, Timeline view when renovateRender is ${isRenovatedRender}`, function(assert) {
            const priorityData = [
                {
                    text: 'Low Priority',
                    id: 1,
                    color: '#1e90ff'
                }, {
                    text: 'High Priority',
                    id: 2,
                    color: '#ff9747'
                }
            ];
            this.createInstance({
                currentView: 'timelineWeek',
                views: [{
                    type: 'timelineWeek',
                    name: 'timelineWeek',
                    groupOrientation: 'horizontal'
                }],
                currentDate: new Date(2018, 4, 21),
                cellDuration: 60,
                groupByDate: true,
                startDayHour: 10,
                endDayHour: 12,
                groups: ['priorityId'],
                resources: [
                    {
                        fieldExpr: 'priorityId',
                        allowMultiple: false,
                        dataSource: priorityData,
                        label: 'Priority'
                    }
                ],
                renovateRender: isRenovatedRender,
                dataSource: [{
                    startDate: new Date(2018, 4, 21, 10, 0),
                    endDate: new Date(2018, 4, 21, 12, 0),
                    priorityId: 2
                }]
            });

            const cellWidth = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).get(0).getBoundingClientRect().width;

            const layoutManager = this.instance.getLayoutManager();
            const results = layoutManager._positionMap[0];

            this.checkNeedCoordinatesResult(assert, results[0], 5, 0, 0, cellWidth * 5, 1.5);
            this.checkNeedCoordinatesResult(assert, results[1], 7, 0, 0, cellWidth * 7, 1.5);
        });
    });

    test('\'getResizableAppointmentArea\' should return correct area when groupByDate = true, Month view', function(assert) {
        const priorityData = [
            {
                text: 'Low Priority',
                id: 1,
                color: '#1e90ff'
            }, {
                text: 'High Priority',
                id: 2,
                color: '#ff9747'
            },
            {
                text: 'Middle Priority',
                id: 3,
                color: '#ff9747'
            }
        ];
        this.createInstance({
            currentView: 'month',
            views: [{
                type: 'month',
                name: 'month',
                groupOrientation: 'horizontal'
            }],
            width: 800,
            currentDate: new Date(2018, 4, 21, 9, 0),
            groupByDate: true,
            groups: ['priorityId'],
            resources: [
                {
                    fieldExpr: 'priorityId',
                    allowMultiple: false,
                    dataSource: priorityData,
                    label: 'Priority'
                }
            ],
        });

        const $firstCell = this.instance.$element().find('.dx-scheduler-date-table-cell').first();
        const $lastCell = this.instance.$element().find('.dx-scheduler-date-table-cell').last();
        const firstCellPosition = $firstCell.offset();
        const lastCellPosition = $lastCell.offset();
        const cellWidth = $lastCell.get(0).getBoundingClientRect().width;

        const result = this.instance.fire('getResizableAppointmentArea', {
            allDay: false,
            coordinates: {
                groupIndex: 1,
                left: 550,
                top: 0
            },
        });
        assert.roughEqual(result.left, firstCellPosition.left - cellWidth / 2, 3, 'Area left is OK');
        assert.roughEqual(result.right, lastCellPosition.left + 1.5 * cellWidth, 3, 'Area right is OK');
    });

    test('\'getResizableStep\' should return correct step, groupByDate = true, Month view', function(assert) {
        const priorityData = [
            {
                text: 'Low Priority',
                id: 1,
                color: '#1e90ff'
            }, {
                text: 'High Priority',
                id: 2,
                color: '#ff9747'
            },
            {
                text: 'Middle Priority',
                id: 3,
                color: '#ff9747'
            }
        ];
        this.createInstance({
            currentView: 'month',
            dataSource: [{
                startDate: new Date(2018, 4, 21, 9, 0),
                endDate: new Date(2018, 4, 21, 9, 30),
                priorityId: 1
            }],
            views: [{
                type: 'month',
                name: 'month',
                groupOrientation: 'horizontal'
            }],
            width: 800,
            currentDate: new Date(2018, 4, 21, 9, 0),
            groupByDate: true,
            groups: ['priorityId'],
            resources: [
                {
                    fieldExpr: 'priorityId',
                    allowMultiple: false,
                    dataSource: priorityData,
                    label: 'Priority'
                }
            ],
        });

        const $cell = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0);
        const cellWidth = $cell.get(0).getBoundingClientRect().width;

        assert.roughEqual(this.instance.getWorkSpace().positionHelper.getResizableStep(), cellWidth * 3, 3, 'Step is OK');
    });

    test('Appointment is rendered in allDay panel if endDate is out of view, groupByDate = true (T742932)', function(assert) {
        const priorityData = [
            {
                text: 'Low Priority',
                id: 1,
                color: '#1e90ff'
            }, {
                text: 'High Priority',
                id: 2,
                color: '#ff9747'
            }
        ];

        this.createInstance({
            currentView: 'day',
            dataSource: [
                {
                    text: 'Website Re-Design Plan',
                    priorityId: 2,
                    startDate: new Date(2018, 4, 21, 9, 30),
                    endDate: new Date(2018, 4, 23, 11, 30)
                }],
            views: [{
                type: 'day',
                name: 'Day'
            }],
            width: 800,
            groupByDate: true,
            currentDate: new Date(2018, 4, 21),
            startDayHour: 9,
            endDayHour: 16,
            groups: ['priorityId'],
            resources: [
                {
                    fieldExpr: 'priorityId',
                    allowMultiple: false,
                    dataSource: priorityData,
                    label: 'Priority'
                }
            ],
        });
        assert.equal(this.scheduler.appointments.getAppointmentCount(), 1, 'Appointment is rendered');
    });
});
