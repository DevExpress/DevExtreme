import 'fluent_blue_light.css!';
import '__internal/scheduler/m_subscribes';
import '__internal/scheduler/m_scheduler';

import $ from 'jquery';
import fx from 'common/core/animation/fx';
import config from 'core/config';

import { createWrapper } from '../../helpers/scheduler/helpers.js';
import { waitAsync } from '../../helpers/scheduler/waitForAsync.js';

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
        this.createInstance = async(options) => {
            this.scheduler = await createWrapper(options);
            this.instance = this.scheduler.instance;
        };
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, function() {
    test('"getTargetedAppointmentData" should return correct data for recurrence appointments (T660901)', async function(assert) {
        const appointmentData = {
            startDate: new Date(2015, 1, 1, 5, 11),
            endDate: new Date(2015, 1, 1, 6),
            recurrenceRule: 'FREQ=HOURLY;INTERVAL=2'
        };
        await this.createInstance({
            currentDate: new Date(2015, 1, 1),
            currentView: 'day',
            dataSource: [appointmentData]
        });

        const $appointments = this.instance.$element().find('.dx-scheduler-appointment');
        const targetedData = this.instance.fire('getTargetedAppointmentData', appointmentData, $appointments.eq(1));

        assert.equal(targetedData.startDate.getTime(), appointmentData.startDate.getTime() + 2 * 3600000, 'Targeted startDate is OK');
        assert.equal(targetedData.endDate.getTime(), appointmentData.endDate.getTime() + 2 * 3600000, 'Targeted endDate is OK');
    });


    test('\'needRecalculateResizableArea\' should return false for horizontal grouped workspace', async function(assert) {
        await this.createInstance({
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

    test('\'needRecalculateResizableArea\' should return true for vertical grouped workspace', async function(assert) {
        await this.createInstance({
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

    test('"createAppointmentSettings" should return correct count of coordinates for allDay recurrence appointment', async function(assert) {
        await this.createInstance();
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
        await waitAsync(0);

        assert.equal(this.instance.getLayoutManager().filteredItems.length, 7, 'count is OK');
    });

    test('"createAppointmentSettings" should return correct count of coordinates for allDay recurrence appointment, allDay = true', async function(assert) {
        await this.createInstance();
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
        await waitAsync(0);

        assert.equal(this.instance.getLayoutManager().filteredItems.length, 7, 'count is OK');
    });

    test('Long appointment in Timeline view should have right left coordinate', async function(assert) {
        await this.createInstance({
            currentView: 'timelineDay',
            views: ['timelineDay'],
            currentDate: new Date(2015, 2, 3),
            dataSource: [{
                'startDate': new Date(2015, 2, 3, 0, 30),
                'endDate': new Date(2015, 2, 5, 15, 30)
            }]
        });

        const items = this.instance.getAppointmentsInstance().option('items');
        const $expectedCell = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(1);
        const expectedLeftCoordinate = $expectedCell.position().left;

        assert.equal(items[0].left, expectedLeftCoordinate, 'left coordinate is OK');
    });

    test('"mapAppointmentFields" should call getTargetedAppointment', async function(assert) {
        await this.createInstance();

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

    test('"showAddAppointmentPopup" should update appointment data if there is some custom data fields', async function(assert) {
        await this.createInstance();
        const stub = sinon.stub(this.instance, 'showAppointmentPopup');

        this.instance.option({
            startDateExpr: 'Start',
            endDateExpr: 'End',
            allDayExpr: 'AllDay'
        });

        this.instance.showAddAppointmentPopup({
            startDateUTC: new Date(2015, 1, 1),
            endDateUTC: new Date(2015, 1, 1, 1),
            allDay: true
        });

        const appointmentData = stub.getCall(0).args[0];

        assert.deepEqual(appointmentData, {
            Start: new Date(2015, 1, 1),
            End: new Date(2015, 1, 1, 1),
            AllDay: true
        }, 'Appointment data is OK');
    });

    test('check the "getField" method with date field', async function(assert) {
        const defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = true;
        try {
            await this.createInstance();
            const startDate = this.instance._dataAccessors.get('startDate', { startDate: '2017-02-08' });
            assert.deepEqual(startDate, new Date(2017, 1, 8), 'the "getField" method works fine');

            const endDate = this.instance._dataAccessors.get('endDate', { endDate: '2017-02-09' });
            assert.deepEqual(endDate, new Date(2017, 1, 9), 'the "getField" method works fine');
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    test('check the "setField" method with date field and auto detect of serialization format', async function(assert) {
        const defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = true;
        try {
            await this.createInstance();
            const obj = { startDate: '2017-02-07', endDate: '2017-02-08' };

            this.instance._dataAccessors.get('startDate', obj);

            this.instance._dataAccessors.set('startDate', obj, new Date(2017, 1, 8));
            assert.equal(obj.startDate, '2017-02-08', 'the "setField" method works fine');

            this.instance._dataAccessors.set('endDate', obj, new Date(2017, 1, 10));
            assert.equal(obj.endDate, '2017-02-10', 'the "setField" method works fine');
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    test('prevent unexpected dateSerializationFormat option changing', async function(assert) {
        const defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = true;
        try {
            await this.createInstance();
            const obj = { startDate: new Date(2017, 2, 7) };

            assert.strictEqual(this.instance.option('dateSerializationFormat'), undefined);
            this.instance._dataAccessors.get('startDate', obj);

            assert.strictEqual(this.instance.option('dateSerializationFormat'), undefined);
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    test('check the \'setField\' method with date field and dateSerializationFormat', async function(assert) {
        await this.createInstance({
            dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssZ'
        });
        const obj = { startDate: '2017-02-07', endDate: '2017-02-08' };

        this.instance._dataAccessors.set('startDate', obj, new Date(Date.UTC(2017, 1, 8, 1)));
        assert.equal(obj.startDate, '2017-02-08T01:00:00Z', 'the \'setField\' method works fine');

        this.instance._dataAccessors.set('endDate', obj, new Date(Date.UTC(2017, 1, 10, 1)));
        assert.equal(obj.endDate, '2017-02-10T01:00:00Z', 'the \'setField\' method works fine');
    });

    test('check the "getField" method', async function(assert) {
        await this.createInstance();
        const text = this.instance._dataAccessors.get('text', { text: 1 });
        assert.equal(text, 1, 'the "getField" method works fine');
    });

    test('check the \'getField - recurrenceRule\' method, if recurrenceRuleExpr = null', async function(assert) {
        await this.createInstance({
            recurrenceRuleExpr: null
        });

        const recurrenceRule = this.instance._dataAccessors.get('recurrenceRule', { recurrenceRule: 'FREQ=daily' });
        assert.strictEqual(recurrenceRule, undefined, 'the "getField" method works fine');
    });

    test('check the \'getField - recurrenceRule\' method, if recurrenceRuleExpr was set as null after option changed', async function(assert) {
        await this.createInstance();

        this.instance.option({
            recurrenceRuleExpr: null
        });

        const recurrenceRule = this.instance._dataAccessors.get('recurrenceRule', { recurrenceRule: 'FREQ=daily' });
        assert.strictEqual(recurrenceRule, undefined, 'the "getField" method works fine');
    });

    test('check the \'getField - recurrenceRule\' method, if recurrenceRuleExpr was set as value after option changed', async function(assert) {
        await this.createInstance({
            recurrenceRuleExpr: null
        });

        this.instance.option({
            recurrenceRuleExpr: 'recurrenceRule'
        });

        const recurrenceRule = this.instance._dataAccessors.get('recurrenceRule', { recurrenceRule: 'FREQ=daily' });
        assert.equal(recurrenceRule, 'FREQ=daily', 'the "getField" method works fine');
    });

    test('check the \'setField\' method', async function(assert) {
        await this.createInstance();
        const obj = { text: 1 };

        this.instance._dataAccessors.set('text', obj, 2);
        assert.equal(obj.text, 2, 'the \'setField\' method works fine');
    });

    test('check the \'setField\' method with multi-dotted string', async function(assert) {
        await this.createInstance({ textExpr: 'a.b.text' });
        const obj = {};
        const obj1 = { c: 'just field' };

        this.instance._dataAccessors.set('text', obj, 2);
        this.instance._dataAccessors.set('text', obj1, 2);

        assert.deepEqual(obj, { a: { b: { text: 2 } } }, 'the \'setField\' method works fine');
        assert.deepEqual(obj1, { c: 'just field', a: { b: { text: 2 } } }, 'the \'setField\' method works fine');
    });

    test('check the \'setField-recurrenceRule\' method, if recurrenceRuleExpr = null', async function(assert) {
        await this.createInstance({
            recurrenceRuleExpr: null
        });

        const obj = { recurrenceRule: 'FREQ=DAILY' };

        this.instance._dataAccessors.set('recurrenceRule', obj, 'FREQ=WEEKLY');
        assert.equal(obj.recurrenceRule, 'FREQ=DAILY', 'the \'setField\' method works fine');
    });

    test('check the \'setField-recurrenceRule\' method, if recurrenceRuleExpr was set as null after option changed', async function(assert) {
        await this.createInstance();

        this.instance.option({
            recurrenceRuleExpr: null
        });

        const obj = { recurrenceRule: 'FREQ=DAILY' };

        this.instance._dataAccessors.set('recurrenceRule', obj, 'FREQ=WEEKLY');
        assert.equal(obj.recurrenceRule, 'FREQ=DAILY', 'the \'setField\' method works fine');
    });

    test('check the \'setField-recurrenceRule\' method, if recurrenceRuleExpr was set as value after option changed', async function(assert) {
        await this.createInstance({
            recurrenceRuleExpr: null
        });

        this.instance.option({
            recurrenceRuleExpr: 'recurrenceRule'
        });

        const obj = { recurrenceRule: 'FREQ=DAILY' };

        this.instance._dataAccessors.set('recurrenceRule', obj, 'FREQ=WEEKLY');
        assert.equal(obj.recurrenceRule, 'FREQ=WEEKLY', 'the \'setField\' method works fine');
    });

    test('UpdateAppointmentEndDate should return corrected endDate', async function(assert) {
        await this.createInstance();
        this.instance.option({
            currentView: 'timelineWeek',
            currentDate: 1425416400000,
            startDayHour: 1,
            endDayHour: 10
        });
        await waitAsync(0);

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

    test('UpdateAppointmentEndDate should return corrected endDate for long appointment', async function(assert) {
        await this.createInstance();
        this.instance.option({
            currentView: 'timelineWeek',
            currentDate: 1425416400000,
            startDayHour: 1,
            endDayHour: 10
        });
        await waitAsync(0);

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

    test('UpdateAppointmentEndDate should return corrected endDate by certain endDayHour', async function(assert) {
        await this.createInstance({
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

    test('"getAppointmentColor" by certain group', async function(assert) {
        await this.createInstance({
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
            }]
        });

        const appointmentColor = await this.instance.resourceManager.getAppointmentColor({
            itemData: {
                typeId: 1,
                priorityId: 1
            },
            groupIndex: 0,
        });

        assert.strictEqual(appointmentColor, 'red', 'appointment color');
    });

    test('"getAppointmentColor" with fieldExpr for complex resource', async function(assert) {
        await this.createInstance({
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

        const appointmentColor = await this.instance.resourceManager.getAppointmentColor({
            itemData: {
                'Price': 10,
                'startDate': new Date(2015, 4, 24, 9, 10, 0, 0),
                'endDate': new Date(2015, 4, 24, 11, 1, 0, 0),
                'Movie': {
                    'ID': 3
                },
                'TheatreId': 1
            },
            groupIndex: 0
        });

        assert.strictEqual(appointmentColor, 'red', 'appointment color is OK');
    });

    test('"maxAppointmentsPerCell" should return correct value in accordance with scheduler configuration', async function(assert) {
        await this.createInstance({
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

        let countPerCell = this.instance.getViewOption('maxAppointmentsPerCell');

        assert.equal(countPerCell, 5, 'overlappingMode is OK');

        this.instance.option('currentView', 'WEEK');
        await waitAsync(0);

        countPerCell = this.instance.getViewOption('maxAppointmentsPerCell');

        assert.equal(countPerCell, 'auto', 'overlappingMode is OK');
    });

    test('"maxAppointmentsPerCell" should return correct value in accordance with view configuration', async function(assert) {
        await this.createInstance({
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

        let countPerCell = this.instance.getViewOption('maxAppointmentsPerCell');

        assert.equal(countPerCell, 5, 'overlappingMode is OK');

        this.instance.option('currentView', 'WEEK');
        await waitAsync(0);

        countPerCell = this.instance.getViewOption('maxAppointmentsPerCell');

        assert.equal(countPerCell, 'unlimited', 'overlappingMode is OK');
    });

    test('\'isAdaptive\' subscribe should work correctly', async function(assert) {
        await this.createInstance({
            dataSource: [],
            adaptivityEnabled: true
        });

        assert.ok(this.instance.fire('isAdaptive'), 'Scheduler is adaptive');

        this.instance.option('adaptivityEnabled', false);
        await waitAsync(0);

        assert.notOk(this.instance.fire('isAdaptive'), 'Scheduler isn\'t adaptive');
    });

    test('createFormattedDateText with format TIME should work correct', async function(assert) {
        const data = {
            text: 'Appointment test text',
            startDate: new Date(2018, 2, 1, 10),
            endDate: new Date(2018, 2, 1, 11)
        };
        await this.createInstance({
            dataSource: [data],
            views: ['week'],
            currentView: 'week'
        });

        assert.deepEqual(this.instance.fire('createFormattedDateText', data, data, 'TIME'), {
            formatDate: '10:00 AM - 11:00 AM',
            text: 'Appointment test text'
        });
    });

    test('createFormattedDateText, appointment with allDay option, without format', async function(assert) {
        const data = {
            text: 'Appointment test text',
            startDate: new Date(2018, 2, 1, 10),
            endDate: new Date(2018, 2, 1, 11),
            allDay: true
        };
        await this.createInstance({
            dataSource: [data],
            views: ['week'],
            currentView: 'week'
        });

        assert.deepEqual(this.instance.fire('createFormattedDateText', data, data), {
            formatDate: 'March 1',
            text: 'Appointment test text'
        });
    });

    test('createFormattedDateText, with expr fields', async function(assert) {
        const data = {
            Text: 'Appointment test text',
            StartDate: new Date(2018, 2, 1, 10),
            EndDate: new Date(2018, 2, 1, 11),
            AllDay: true,
        };
        await this.createInstance({
            dataSource: [data],
            views: ['week'],
            currentView: 'week',
            textExpr: 'Text',
            startDateExpr: 'StartDate',
            endDateExpr: 'EndDate',
            allDayExpr: 'AllDay',
        });

        assert.deepEqual(this.instance.fire('createFormattedDateText', data, data), {
            formatDate: 'March 1',
            text: 'Appointment test text'
        });
    });

    test('createFormattedDateText, simple appointment, without format', async function(assert) {
        const data = {
            text: 'Appointment test text',
            startDate: new Date(2018, 2, 1, 10),
            endDate: new Date(2018, 2, 1, 11),
        };
        await this.createInstance({
            dataSource: [data],
            views: ['week'],
            currentView: 'week'
        });

        assert.deepEqual(this.instance.fire('createFormattedDateText', data, data), {
            formatDate: '10:00 AM - 11:00 AM',
            text: 'Appointment test text'
        });
    });

    test('createFormattedDateText, simple appointment, month view, without format', async function(assert) {
        const data = {
            text: 'Appointment test text',
            startDate: new Date(2018, 2, 1, 10),
            endDate: new Date(2018, 2, 1, 11),
        };
        await this.createInstance({
            dataSource: [data],
            views: ['month'],
            currentView: 'month'
        });

        assert.deepEqual(this.instance.fire('createFormattedDateText', data, data), {
            formatDate: 'March 1 10:00 AM - 11:00 AM',
            text: 'Appointment test text'
        });
    });

    test('getTextAndFormatData, recurrance appointment with different data', async function(assert) {
        const initialData = {
            text: 'Appointment test text',
            startDate: new Date(2018, 2, 1, 10),
            endDate: new Date(2018, 2, 1, 11),
        };
        const dataRecur = {
            startDate: new Date(2018, 2, 2, 10),
            endDate: new Date(2018, 2, 2, 11),
        };
        await this.createInstance({
            dataSource: [initialData],
            views: ['month'],
            currentView: 'month'
        });
        assert.deepEqual(this.instance.fire('createFormattedDateText', initialData, dataRecur), {
            formatDate: 'March 2 10:00 AM - 11:00 AM',
            text: 'Appointment test text'
        });
    });
});

module('Grouping By Date', {
    beforeEach: function() {
        this.createInstance = async function(options) {
            this.scheduler = await createWrapper(options);
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
    test('\'isGroupedByDate\' should be true only for horizontal grouped workspace with groups', async function(assert) {
        await this.createInstance({
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
        });

        assert.equal(this.instance.fire('isGroupedByDate'), true, 'Workspace is grouped by date');

        this.instance.option('currentView', 'WEEK');
        await waitAsync(0);
        assert.equal(this.instance.fire('isGroupedByDate'), false, 'Workspace isn\'t grouped by date');

        this.instance.option('groups', []);
        this.instance.option('currentView', 'DAY');
        await waitAsync(0);
        assert.equal(this.instance.fire('isGroupedByDate'), false, 'Workspace isn\'t grouped by date');
    });

    test('"createAppointmentSettings" should work correct for allDay appointment when groupByDate = true, Week view', async function(assert) {
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
        await this.createInstance({
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
            dataSource: [{
                startDate: new Date(2018, 4, 21, 9, 0),
                endDate: new Date(2018, 4, 23, 9, 0),
                priorityId: 2,
                allDay: true
            }]
        });

        const results = this.instance.getAppointmentsInstance().option('items').sort((a, b) => a.columnIndex - b.columnIndex);

        assert.equal(results.length, 3, 'Result length is OK');
        this.checkNeedCoordinatesResult(assert, results[0], 1, 0, 0, 99, 1.1);
        this.checkNeedCoordinatesResult(assert, results[1], 2, 0, 0, 166, 1.1);
        this.checkNeedCoordinatesResult(assert, results[2], 3, 0, 0, 233, 1.1);
    });

    test('"createAppointmentSettings" should work correct when groupByDate = true, Month view', async function(assert) {
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
        await this.createInstance({
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
            dataSource: [{
                startDate: new Date(2018, 4, 22, 10, 0),
                endDate: new Date(2018, 4, 24),
                priorityId: 2
            }]
        });

        const $cell = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).get(0);
        const cellWidth = $cell.getBoundingClientRect().width;
        const cellHeight = $cell.getBoundingClientRect().height;

        const results = this.instance.getAppointmentsInstance().option('items').sort((a, b) => a.columnIndex - b.columnIndex);

        assert.equal(results.length, 2, 'Coordinates count is ok');
        this.checkNeedCoordinatesResult(assert, results[0], 2, 3, cellHeight * 3 + 30, cellWidth * 5, 1.5);
        this.checkNeedCoordinatesResult(assert, results[1], 3, 3, cellHeight * 3 + 30, cellWidth * 7, 1.5);
    });

    test('\'getResizableAppointmentArea\' should return correct area when groupByDate = true, Month view', async function(assert) {
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
        await this.createInstance({
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

    test('\'getResizableAppointmentArea\' should return undefined for not allDay appointments in grouped timeline view', async function(assert) {
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
        await this.createInstance({
            currentView: 'timelineWeek',
            views: [{
                type: 'timelineWeek',
                name: 'timelineWeek',
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

        const result = this.instance.fire('getResizableAppointmentArea', {
            allDay: false,
            coordinates: {
                groupIndex: 1,
                left: 550,
                top: 0
            },
        });

        assert.strictEqual(result, undefined, 'Area is undefined');
    });

    test('\'getResizableStep\' should return correct step, groupByDate = true, Month view', async function(assert) {
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
        await this.createInstance({
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

    test('Appointment is rendered in allDay panel if endDate is out of view, groupByDate = true (T742932)', async function(assert) {
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

        await this.createInstance({
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
