import $ from 'jquery';
import dblclickEvent from 'events/dblclick';
import Color from 'color';
import fx from 'animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import dragEvents from 'events/drag';
import translator from 'animation/translator';
import { DataSource } from 'data/data_source/data_source';
import subscribes from 'ui/scheduler/ui.scheduler.subscribes';
import dateSerialization from 'core/utils/date_serialization';
import { SchedulerTestWrapper, isDesktopEnvironment } from './helpers.js';

import 'common.css!';
import 'generic_light.css!';
import 'ui/scheduler/ui.scheduler';

QUnit.testStart(function() {
    $('#qunit-fixture').html(
        '<div id="scheduler">\
            <div data-options="dxTemplate: { name: \'template\' }">Task Template</div>\
            </div>');
});

QUnit.module('Integration: Recurring Appointments', {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = function(options) {
            this.instance = $('#scheduler').dxScheduler($.extend(options, { height: 600 })).dxScheduler('instance');
            this.scheduler = new SchedulerTestWrapper(this.instance);
        };
        this.getAppointmentColor = function($task) {
            return new Color($task.css('backgroundColor')).toHex();
        };
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test('Tasks should be duplicated according to recurrence rule', function(assert) {
    const tasks = [
        { text: 'One', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 2), recurrenceRule: 'FREQ=DAILY;INTERVAL=4' },
        { text: 'Two', startDate: new Date(2015, 2, 17), endDate: new Date(2015, 2, 17, 0, 30) }
    ];
    const dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentView: 'week',
        currentDate: new Date(2015, 2, 16),
        dataSource: dataSource
    });

    assert.equal(this.instance.$element().find('.dx-scheduler-appointment').length, 3, 'tasks are OK');
    assert.equal(this.instance.$element().find('.dx-scheduler-appointment-recurrence').length, 2, 'recurrence tasks are OK');
});

QUnit.test('Tasks should be duplicated according to recurrence rule, if firstDayOfWeek was set', function(assert) {
    const tasks = [
        { text: 'One', startDate: new Date(2015, 2, 12), endDate: new Date(2015, 2, 12, 2), recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH,SA' }
    ];
    const dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentView: 'week',
        currentDate: new Date(2015, 2, 12),
        dataSource: dataSource,
        firstDayOfWeek: 4
    });

    assert.equal(this.instance.$element().find('.dx-scheduler-appointment-recurrence').length, 3, 'recurrence tasks are OK');
});

QUnit.test('Tasks should be duplicated according to recurrence rule and recurrence exception', function(assert) {
    const tasks = [
        { text: 'One', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 2), recurrenceRule: 'FREQ=DAILY', recurrenceException: '20150317' }
    ];
    const dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentView: 'week',
        currentDate: new Date(2015, 2, 16),
        dataSource: dataSource
    });

    assert.equal(this.instance.$element().find('.dx-scheduler-appointment-recurrence').length, 5, 'tasks are OK');
});

QUnit.test('Recurring appointments with resources should have color of the first resource if groups option is not defined', function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        firstDayOfWeek: 1,
        views: ['week'],
        currentView: 'week',
        resources: [{
            field: 'ownerId',
            dataSource: [{ id: 1, text: 'John', color: '#ff0000' }, { id: 2, text: 'Mike', color: '#0000ff' }]
        }],
        dataSource: [
            {
                text: 'a',
                recurrenceRule: 'FREQ=DAILY',
                startDate: new Date(2015, 1, 9, 10),
                endDate: new Date(2015, 1, 9, 10, 30),
                ownerId: [1, 2]
            }
        ]
    });
    const that = this;
    $(this.instance.$element()).find('.dx-scheduler-appointment').each(function() {
        assert.equal(that.getAppointmentColor($(this)), '#ff0000', 'Color is OK');
    });

});

QUnit.test('Recurring Task dragging', function(assert) {
    const data = new DataSource({
        store: [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: 'FREQ=DAILY'
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: 'week',
        editing: true,
        firstDayOfWeek: 1
    });

    const updatedItem = {
        text: 'Task 1',
        startDate: new Date(2015, 1, 14),
        endDate: new Date(2015, 1, 14, 1),
        recurrenceRule: 'FREQ=DAILY',
        allDay: false
    };

    let pointer = pointerMock($(this.instance.$element()).find('.dx-scheduler-appointment').eq(0)).start().down().move(10, 10);
    $(this.instance.$element()).find('.dx-scheduler-date-table-cell').eq(5).trigger(dragEvents.enter);
    pointer.up();
    $('.dx-dialog-buttons .dx-button').eq(0).trigger('dxclick');

    let dataSourceItem = this.instance.option('dataSource').items()[0];

    assert.equal(dataSourceItem.text, updatedItem.text, 'New data is correct');
    assert.equal(dataSourceItem.allDay, updatedItem.allDay, 'New data is correct');
    assert.equal(dataSourceItem.recurrenceRule, updatedItem.recurrenceRule, 'New data is correct');
    assert.deepEqual(dataSourceItem.startDate, updatedItem.startDate, 'New data is correct');
    assert.deepEqual(dataSourceItem.endDate, updatedItem.endDate, 'New data is correct');

    pointer = pointerMock($(this.instance.$element()).find('.dx-scheduler-appointment').eq(0)).start().down().move(10, 10);
    $(this.instance.$element()).find('.dx-scheduler-date-table-cell').eq(8).trigger(dragEvents.enter);
    pointer.up();
    $('.dx-dialog-buttons .dx-button').eq(1).trigger('dxclick');

    dataSourceItem = this.instance.option('dataSource').items()[0];

    assert.equal(dataSourceItem.text, updatedItem.text, 'data does not changed');
    assert.equal(dataSourceItem.allDay, updatedItem.allDay, 'data does not changed');
    assert.equal(dataSourceItem.recurrenceRule, updatedItem.recurrenceRule, 'data does not changed');
    assert.deepEqual(dataSourceItem.startDate, updatedItem.startDate, 'data does not changed');
    assert.deepEqual(dataSourceItem.endDate, updatedItem.endDate, 'data does not changed');
});

QUnit.test('Recurring Task dragging with \'series\' recurrenceEditMode', function(assert) {
    const data = new DataSource({
        store: [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: 'FREQ=DAILY'
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: 'week',
        editing: true,
        firstDayOfWeek: 1,
        recurrenceEditMode: 'series'
    });

    const updatedItem = {
        text: 'Task 1',
        startDate: new Date(2015, 1, 14),
        endDate: new Date(2015, 1, 14, 1),
        recurrenceRule: 'FREQ=DAILY',
        allDay: false
    };

    const pointer = pointerMock($(this.instance.$element()).find('.dx-scheduler-appointment').eq(0)).start().down().move(10, 10);
    $(this.instance.$element()).find('.dx-scheduler-date-table-cell').eq(5).trigger(dragEvents.enter);
    pointer.up();

    const dataSourceItem = this.instance.option('dataSource').items()[0];

    delete dataSourceItem.initialCoordinates;
    delete dataSourceItem.initialSize;

    assert.deepEqual(dataSourceItem, updatedItem, 'New data is correct');
});

QUnit.test('Recurrent Task dragging with \'occurrence\' recurrenceEditMode', function(assert) {
    const data = new DataSource({
        store: [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: 'FREQ=DAILY'
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: 'week',
        editing: true,
        firstDayOfWeek: 1,
        recurrenceEditMode: 'occurrence'
    });

    const updatedItem = {
        text: 'Task 1',
        startDate: new Date(2015, 1, 14),
        endDate: new Date(2015, 1, 14, 1),
        allDay: false,
        recurrenceRule: '',
        recurrenceException: ''
    };

    const pointer = pointerMock($(this.instance.$element()).find('.dx-scheduler-appointment').eq(0)).start().down().move(10, 10);
    $(this.instance.$element()).find('.dx-scheduler-date-table-cell').eq(5).trigger(dragEvents.enter);
    pointer.up();

    const updatedSingleItem = this.instance.option('dataSource').items()[1];
    const updatedRecurringItem = this.instance.option('dataSource').items()[0];
    const exceptionDate = new Date(2015, 1, 9, 1, 0, 0, 0);

    delete updatedSingleItem.initialCoordinates;
    delete updatedSingleItem.initialSize;

    assert.deepEqual(updatedSingleItem, updatedItem, 'New data is correct');

    assert.equal(updatedRecurringItem.recurrenceException, dateSerialization.serializeDate(exceptionDate, 'yyyyMMddTHHmmssZ'), 'Exception for recurrence appointment is correct');
});

QUnit.test('Updated single item should not have recurrenceException ', function(assert) {
    const data = new DataSource({
        store: [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: 'FREQ=DAILY',
                recurrenceException: '20150214T010000'
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: 'week',
        editing: true,
        firstDayOfWeek: 1
    });

    const pointer = pointerMock($(this.instance.$element()).find('.dx-scheduler-appointment').eq(0)).start().down().move(10, 10);
    $(this.instance.$element()).find('.dx-scheduler-date-table-cell').eq(5).trigger(dragEvents.enter);
    pointer.up();
    $('.dx-dialog-buttons .dx-button').eq(1).trigger('dxclick');

    const singleItem = this.instance.option('dataSource').items()[1];

    assert.equal(singleItem.recurrenceException, '', 'Single appointment data is correct');
});

QUnit.test('Recurrent Task dragging, single mode', function(assert) {
    const data = new DataSource({
        store: [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 17, 0),
                endDate: new Date(2015, 1, 9, 18, 0),
                recurrenceRule: 'FREQ=DAILY'
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: 'week',
        editing: true,
        firstDayOfWeek: 1
    });

    const updatedItem = {
        text: 'Task 1',
        startDate: new Date(2015, 1, 14),
        endDate: new Date(2015, 1, 14, 1),
        allDay: false,
        recurrenceRule: ''
    };

    const pointer = pointerMock($(this.instance.$element()).find('.dx-scheduler-appointment').eq(0)).start().down().move(10, 10);
    $(this.instance.$element()).find('.dx-scheduler-date-table-cell').eq(5).trigger(dragEvents.enter);
    pointer.up();
    $('.dx-dialog-buttons .dx-button').eq(1).trigger('dxclick');

    const updatedSingleItem = this.instance.option('dataSource').items()[1];
    const updatedRecurringItem = this.instance.option('dataSource').items()[0];
    const exceptionDate = new Date(2015, 1, 9, 17, 0, 0, 0);

    assert.equal(updatedSingleItem.text, updatedItem.text, 'New data is correct');
    assert.equal(updatedSingleItem.allDay, updatedItem.allDay, 'New data is correct');
    assert.equal(updatedSingleItem.recurrenceRule, updatedItem.recurrenceRule, 'New data is correct');
    assert.deepEqual(updatedSingleItem.startDate, updatedItem.startDate, 'New data is correct');
    assert.deepEqual(updatedSingleItem.endDate, updatedItem.endDate, 'New data is correct');

    assert.equal(updatedRecurringItem.recurrenceException, dateSerialization.serializeDate(exceptionDate, 'yyyyMMddTHHmmssZ'), 'Exception for recurrence appointment is correct');
});

QUnit.test('Recurrent Task dragging, single mode - recurrenceException updating ', function(assert) {
    const data = new DataSource({
        store: [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: 'FREQ=DAILY',
                recurrenceException: '20150214T010000Z'
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: 'week',
        editing: true,
        firstDayOfWeek: 1
    });

    const pointer = pointerMock($(this.instance.$element()).find('.dx-scheduler-appointment').eq(1)).start().down().move(10, 10);
    $(this.instance.$element()).find('.dx-scheduler-date-table-cell').eq(5).trigger(dragEvents.enter);
    pointer.up();
    $('.dx-dialog-buttons .dx-button').eq(1).trigger('dxclick');

    const updatedRecurringItem = this.instance.option('dataSource').items()[0];
    const exceptionDate = new Date(2015, 1, 10, 1);

    assert.equal(updatedRecurringItem.recurrenceException, '20150214T010000Z,' + dateSerialization.serializeDate(exceptionDate, 'yyyyMMddTHHmmssZ'), 'Exception for recurrence appointment is correct');
});

QUnit.test('Recurrent Task resizing, single mode', function(assert) {
    const data = new DataSource({
        store: [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: 'FREQ=DAILY'
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: 'week',
        firstDayOfWeek: 1,
        editing: true
    });

    const updatedItem = {
        text: 'Task 1',
        startDate: new Date(2015, 1, 10, 1),
        endDate: new Date(2015, 1, 10, 3),
        allDay: false,
        recurrenceRule: ''
    };

    const cellHeight = $(this.instance.$element()).find('.dx-scheduler-date-table-cell').eq(0).outerHeight();
    const hourHeight = cellHeight * 2;

    const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-bottom').eq(1)).start();
    pointer.dragStart().drag(0, hourHeight).dragEnd();
    $('.dx-dialog-buttons .dx-button').eq(1).trigger('dxclick');

    const updatedSingleItem = this.instance.option('dataSource').items()[1];
    const updatedRecurringItem = this.instance.option('dataSource').items()[0];
    const exceptionDate = new Date(2015, 1, 10, 1, 0, 0, 0);

    assert.equal(updatedSingleItem.recurrenceRule, updatedItem.recurrenceRule, 'New data is correct');
    assert.deepEqual(updatedSingleItem.startDate, updatedItem.startDate, 'New data is correct');
    assert.deepEqual(updatedSingleItem.endDate, updatedItem.endDate, 'New data is correct');

    assert.equal(updatedRecurringItem.recurrenceException, dateSerialization.serializeDate(exceptionDate, 'yyyyMMddTHHmmssZ'), 'Exception for recurrence appointment is correct');
});

QUnit.test('Recurrence task resizing when currentDate != recStartDate (T488760)', function(assert) {
    this.createInstance({
        currentDate: new Date(2017, 2, 20),
        editing: true,
        recurrenceEditMode: 'occurrence',
        dataSource: [{
            text: 'a',
            startDate: new Date(2015, 4, 25, 1),
            endDate: new Date(2015, 4, 25, 2, 30),
            recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO'

        }]
    });

    const cellHeight = $(this.instance.$element()).find('.dx-scheduler-date-table-cell').eq(0).outerHeight();
    const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-bottom').eq(0)).start();

    pointer.dragStart().drag(0, cellHeight).dragEnd();

    const apptData = $(this.instance.$element()).find('.dx-scheduler-appointment').dxSchedulerAppointment('instance').option('data');

    assert.deepEqual(apptData.endDate, new Date(2017, 2, 20, 3), 'End date is OK');
});

QUnit.test('Recurrent Task deleting, single mode', function(assert) {
    const data = new DataSource({
        store: [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: 'FREQ=DAILY'
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: 'week',
        firstDayOfWeek: 1
    });

    this.scheduler.appointments.click(1);
    this.clock.tick(300);

    this.scheduler.tooltip.clickOnDeleteButton();
    $('.dx-dialog-buttons .dx-button').eq(1).trigger('dxclick');

    const updatedRecurringItem = this.instance.option('dataSource').items()[0];
    const exceptionDate = new Date(2015, 1, 10, 1, 0, 0, 0);

    assert.equal(updatedRecurringItem.recurrenceException, dateSerialization.serializeDate(exceptionDate, 'yyyyMMddTHHmmssZ'), 'Exception for recurrence appointment is correct');
    assert.equal(this.instance.option('dataSource').items().length, 1, 'Single item was deleted');
});

QUnit.test('Recurrent Task editing, confirmation tooltip should be shown after trying to edit recurrent appointment', function(assert) {
    const data = new DataSource({
        store: [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: 'FREQ=DAILY'
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: 'week',
        firstDayOfWeek: 1
    });

    this.scheduler.appointments.click(2);
    this.clock.tick(300);
    this.scheduler.tooltip.clickOnItem();

    assert.ok($('.dx-dialog.dx-overlay-modal').length, 'Dialog was shown');
    $('.dx-dialog-buttons .dx-button').eq(1).trigger('dxclick');
});

QUnit.test('Recurrent Task editing, single mode', function(assert) {
    const data = new DataSource({
        store: [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: 'FREQ=DAILY'
            }
        ]
    });

    const updatedItem = {
        text: 'Task 2',
        startDate: new Date(2015, 1, 11, 3),
        endDate: new Date(2015, 1, 11, 4),
        allDay: false,
        recurrenceRule: ''
    };

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: 'week',
        firstDayOfWeek: 1
    });

    this.scheduler.appointments.click(2);
    this.clock.tick(300);
    this.scheduler.tooltip.clickOnItem();
    $('.dx-dialog-buttons .dx-button').eq(1).trigger('dxclick');

    const $title = $('.dx-textbox').eq(0);
    const title = $title.dxTextBox('instance');
    const $startDate = $('.dx-datebox').eq(0);
    const startDate = $startDate.dxDateBox('instance');

    title.option('value', 'Task 2');
    startDate.option('value', new Date(2015, 1, 11, 3, 0));
    $('.dx-button.dx-popup-done').eq(0).trigger('dxclick');
    this.clock.tick(300);

    const updatedSingleItem = this.instance.option('dataSource').items()[1];
    const updatedRecurringItem = this.instance.option('dataSource').items()[0];
    const exceptionDate = new Date(2015, 1, 11, 1, 0, 0, 0);

    assert.equal(updatedSingleItem.text, updatedItem.text, 'New data is correct');
    assert.equal(updatedSingleItem.recurrenceRule, updatedItem.recurrenceRule, 'New data is correct');
    assert.deepEqual(updatedSingleItem.startDate, updatedItem.startDate, 'New data is correct');
    assert.deepEqual(updatedSingleItem.endDate, updatedItem.endDate, 'New data is correct');

    assert.equal(updatedRecurringItem.recurrenceException, dateSerialization.serializeDate(exceptionDate, 'yyyyMMddTHHmmssZ'), 'Exception for recurrence appointment is correct');
});

QUnit.test('Recurrent Task edition canceling, single mode', function(assert) {
    const data = new DataSource({
        store: [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: 'FREQ=DAILY'
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: 'week',
        firstDayOfWeek: 1
    });

    $(this.instance.$element()).find('.dx-scheduler-appointment').eq(2).trigger('dxclick');
    this.clock.tick(300);
    $('.dx-scheduler-appointment-tooltip-buttons .dx-button').eq(1).trigger('dxclick');
    $('.dx-dialog-buttons .dx-button').eq(1).trigger('dxclick');
    $('.dx-button.dx-popup-cancel').eq(0).trigger('dxclick');

    $(this.instance.$element()).find('.dx-scheduler-appointment').eq(2).trigger('dxclick');
    this.clock.tick(300);
    $('.dx-scheduler-appointment-tooltip-buttons .dx-button').eq(1).trigger('dxclick');
    $('.dx-dialog-buttons .dx-button').eq(0).trigger('dxclick');
    $('.dx-button.dx-popup-done').eq(0).trigger('dxclick');

    const items = this.instance.option('dataSource').items();

    assert.equal(items.length, 1, 'Items are correct');
});

QUnit.test('Recurrent Task editing, single mode - canceling', function(assert) {
    const data = new DataSource({
        store: [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: 'FREQ=DAILY'
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: 'week',
        firstDayOfWeek: 1
    });

    $(this.instance.$element()).find('.dx-scheduler-appointment').eq(2).trigger('dxclick');
    this.clock.tick(300);
    $('.dx-scheduler-appointment-tooltip-buttons .dx-button').eq(1).trigger('dxclick');
    $('.dx-dialog-buttons .dx-button').eq(1).trigger('dxclick');

    $('.dx-button.dx-popup-cancel').eq(0).trigger('dxclick');
    this.clock.tick(300);

    const recurrentItem = this.instance.option('dataSource').items()[0];

    assert.equal(recurrentItem.recurrenceException, undefined, 'Exception for recurrence appointment is correct');
});

QUnit.test('Recurrent Task editing, confirmation tooltip should be shown after double click on recurrent appointment', function(assert) {
    const data = new DataSource({
        store: [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: 'FREQ=DAILY'
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: 'week',
        firstDayOfWeek: 1
    });

    $(this.instance.$element()).find('.dx-scheduler-appointment').eq(2).trigger(dblclickEvent.name);
    this.clock.tick(300);

    assert.ok($('.dx-dialog.dx-overlay-modal').length, 'Dialog was shown');
    $('.dx-dialog-buttons .dx-button').eq(1).trigger('dxclick');
});

QUnit.test('Recurrent Task editing, single mode - double click', function(assert) {
    const data = new DataSource({
        store: [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: 'FREQ=DAILY'
            }
        ]
    });

    const updatedItem = {
        text: 'Task 2',
        startDate: new Date(2015, 1, 11, 3),
        endDate: new Date(2015, 1, 11, 4),
        allDay: false,
        recurrenceRule: ''
    };

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: 'week',
        firstDayOfWeek: 1
    });

    $(this.instance.$element()).find('.dx-scheduler-appointment').eq(2).trigger(dblclickEvent.name);
    this.clock.tick(300);

    $('.dx-dialog-buttons .dx-button').eq(1).trigger('dxclick');

    const $title = $('.dx-textbox').eq(0);
    const title = $title.dxTextBox('instance');
    const $startDate = $('.dx-datebox').eq(0);
    const startDate = $startDate.dxDateBox('instance');

    title.option('value', 'Task 2');
    startDate.option('value', new Date(2015, 1, 11, 3, 0));
    $('.dx-button.dx-popup-done').eq(0).trigger('dxclick');
    this.clock.tick(300);

    const updatedSingleItem = this.instance.option('dataSource').items()[1];
    const updatedRecurringItem = this.instance.option('dataSource').items()[0];
    const exceptionDate = new Date(2015, 1, 11, 1, 0, 0, 0);

    assert.equal(updatedSingleItem.text, updatedItem.text, 'New data is correct');
    assert.equal(updatedSingleItem.recurrenceRule, updatedItem.recurrenceRule, 'New data is correct');
    assert.deepEqual(updatedSingleItem.startDate, updatedItem.startDate, 'New data is correct');
    assert.deepEqual(updatedSingleItem.endDate, updatedItem.endDate, 'New data is correct');

    assert.equal(updatedRecurringItem.recurrenceException, dateSerialization.serializeDate(exceptionDate, 'yyyyMMddTHHmmssZ'), 'Exception for recurrence appointment is correct');
});

QUnit.test('Recurrent allDay task dragging on month view, single mode', function(assert) {
    const data = new DataSource({
        store: [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1),
                endDate: new Date(2015, 1, 9, 2),
                allDay: true,
                recurrenceRule: 'FREQ=DAILY'
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        endDayHour: 10,
        dataSource: data,
        currentView: 'month',
        firstDayOfWeek: 1,
        editing: true
    });

    const updatedItem = {
        text: 'Task 1',
        startDate: new Date(2015, 0, 26, 1),
        endDate: new Date(2015, 0, 26, 2),
        allDay: true,
        recurrenceRule: ''
    };

    const pointer = pointerMock($(this.instance.$element()).find('.dx-scheduler-appointment').eq(0)).start().down().move(10, 10);
    $(this.instance.$element()).find('.dx-scheduler-date-table-cell').eq(0).trigger(dragEvents.enter);
    pointer.up();
    $('.dx-dialog-buttons .dx-button').eq(1).trigger('dxclick');

    const updatedSingleItem = this.instance.option('dataSource').items()[1];
    const updatedRecurringItem = this.instance.option('dataSource').items()[0];
    const exceptionDate = new Date(2015, 1, 9, 1, 0, 0, 0);

    assert.equal(updatedSingleItem.text, updatedItem.text, 'New data is correct');
    assert.equal(updatedSingleItem.allDay, updatedItem.allDay, 'New data is correct');
    assert.equal(updatedSingleItem.recurrenceRule, updatedItem.recurrenceRule, 'New data is correct');
    assert.deepEqual(updatedSingleItem.startDate, updatedItem.startDate, 'New data is correct');
    assert.deepEqual(updatedSingleItem.endDate, updatedItem.endDate, 'New data is correct');

    assert.equal(updatedRecurringItem.recurrenceException, dateSerialization.serializeDate(exceptionDate, 'yyyyMMddTHHmmssZ'), 'Exception for recurrence appointment is correct');
});

QUnit.test('Recurrent allDay task dragging on month view, single mode, 24h appointment duration', function(assert) {
    const data = new DataSource({
        store: [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9),
                endDate: new Date(2015, 1, 10),
                allDay: true,
                recurrenceRule: 'FREQ=DAILY'
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: 'month',
        firstDayOfWeek: 1,
        editing: true,
        startDayHour: 3,
        endDayHour: 10
    });

    const updatedItem = {
        text: 'Task 1',
        startDate: new Date(2015, 0, 26),
        endDate: new Date(2015, 0, 27),
        allDay: true,
        recurrenceRule: ''
    };

    const pointer = pointerMock($(this.instance.$element()).find('.dx-scheduler-appointment').eq(0)).start().down().move(10, 10);
    $(this.instance.$element()).find('.dx-scheduler-date-table-cell').eq(0).trigger(dragEvents.enter);
    pointer.up();
    $('.dx-dialog-buttons .dx-button').eq(1).trigger('dxclick');

    const updatedSingleItem = this.instance.option('dataSource').items()[1];
    const updatedRecurringItem = this.instance.option('dataSource').items()[0];
    const exceptionDate = new Date(2015, 1, 9, 0, 0, 0, 0);

    assert.equal(updatedSingleItem.text, updatedItem.text, 'New data is correct');
    assert.equal(updatedSingleItem.allDay, updatedItem.allDay, 'New data is correct');
    assert.equal(updatedSingleItem.recurrenceRule, updatedItem.recurrenceRule, 'New data is correct');
    assert.deepEqual(updatedSingleItem.startDate, updatedItem.startDate, 'New data is correct');
    assert.deepEqual(updatedSingleItem.endDate, updatedItem.endDate, 'New data is correct');

    assert.equal(updatedRecurringItem.recurrenceException, dateSerialization.serializeDate(exceptionDate, 'yyyyMMddTHHmmssZ'), 'Exception for recurrence appointment is correct');
});

QUnit.test('Recurrence item in form should have a special css class', function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: [],
        currentView: 'week',
        firstDayOfWeek: 1
    });

    this.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 9, 2) }, true);

    const form = this.instance.getAppointmentDetailsForm();
    const recurrenceItemClass = 'dx-scheduler-recurrence-rule-item';
    const openedRecurrenceItemClass = 'dx-scheduler-recurrence-rule-item-opened';
    let $recurrenceItem = form.$element().find('.' + recurrenceItemClass);
    const recurrenceEditor = form.getEditor('recurrenceRule');
    const freqEditor = recurrenceEditor._freqEditor;

    assert.notOk($recurrenceItem.hasClass(openedRecurrenceItemClass));

    freqEditor.option('value', 'daily');
    $recurrenceItem = form.$element().find('.' + recurrenceItemClass);

    assert.ok($recurrenceItem.hasClass(openedRecurrenceItemClass));
});

QUnit.test('Recurrence editor should work correctly after toggling repeat and repeat-type editor', function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: new DataSource({
            store: []
        }),
        currentView: 'week'
    });

    const appointment = { startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), text: 'caption 1' };

    this.instance.showAppointmentPopup(appointment);

    const form = this.instance.getAppointmentDetailsForm();
    const recurrenceEditor = form.getEditor('recurrenceRule');
    const freqEditor = recurrenceEditor._freqEditor;
    const repeatTypeEditor = recurrenceEditor._repeatTypeEditor;

    freqEditor.option('value', 'daily');
    repeatTypeEditor.option('value', 'count');
    freqEditor.option('value', 'never');

    assert.ok(true, 'recurrence editor works correctly');
});

QUnit.test('Recurrence editor should work correctly after turn off the recurrence', function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 4, 25),
        dataSource: new DataSource({
            store: []
        }),
        currentView: 'week'
    });

    this.instance.option('recurrenceEditMode', 'series');

    const appointment = {
        text: 'Appointment',
        startDate: new Date(2015, 4, 25, 9, 0),
        endDate: new Date(2015, 4, 25, 9, 15),
        recurrenceRule: 'FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR;UNTIL=20150530'
    };

    this.instance.showAppointmentPopup(appointment);

    const form = this.instance.getAppointmentDetailsForm();
    const recurrenceEditor = form.getEditor('recurrenceRule');
    const freqEditor = recurrenceEditor._freqEditor;

    freqEditor.option('value', 'never');

    assert.ok(true, 'recurrence editor works correctly');
});


QUnit.test('AllDay recurrence appointments should be rendered correctly after changing currentDate', function(assert) {
    const tasks = [
        { text: 'One', startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 17), allDay: true, recurrenceRule: 'FREQ=DAILY' }
    ];
    const dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentView: 'week',
        startDayHour: 8,
        endDayHour: 19,
        currentDate: new Date(2015, 2, 16),
        dataSource: dataSource
    });

    this.instance.option('currentDate', new Date(2015, 2, 23));
    assert.equal(this.instance.$element().find('.dx-scheduler-appointment-recurrence').length, 7, 'appointments are OK');
});

QUnit.test('AllDay recurrence appointments should be rendered correctly after changing currentDate, day view', function(assert) {
    const tasks = [{
        startDate: new Date(2015, 4, 25, 9, 30),
        endDate: new Date(2015, 4, 26, 11, 30),
        recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=26'
    }];
    const dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentView: 'day',
        currentDate: new Date(2015, 4, 26),
        dataSource: dataSource
    });
    assert.equal(this.instance.$element().find('.dx-scheduler-appointment-recurrence').length, 1, 'appointments are OK');
    this.instance.option('currentDate', new Date(2015, 4, 27));
    assert.equal(this.instance.$element().find('.dx-scheduler-appointment-recurrence').length, 0, 'appointments are OK');
});

QUnit.test('Recurring appt should be rendered correctly after changing of repeate count', function(assert) {
    const task = { startDate: new Date(2017, 7, 9), endDate: new Date(2017, 7, 9, 0, 30), recurrenceRule: 'FREQ=DAILY;COUNT=2' };
    const newTask = { startDate: new Date(2017, 7, 9), endDate: new Date(2017, 7, 9, 0, 30), recurrenceRule: 'FREQ=DAILY;COUNT=4' };

    this.createInstance({
        dataSource: [task],
        views: ['week'],
        currentView: 'week',
        currentDate: new Date(2017, 7, 10),
        recurrenceEditMode: 'series'
    });

    this.instance.updateAppointment(task, newTask);
    const appointments = this.instance.$element().find('.dx-scheduler-appointment');

    assert.equal(appointments.length, 4, 'appt was rendered correctly');
});

QUnit.test('Recurring appt should be rendered correctly after setting recurrenceException', function(assert) {
    const task = {
        text: 'Stand-up meeting',
        startDate: new Date(2015, 4, 4, 9, 0),
        endDate: new Date(2015, 4, 4, 9, 15),
        recurrenceRule: 'FREQ=DAILY;COUNT=3'
    };
    const newTask = {
        text: 'Stand-up meeting',
        startDate: new Date(2015, 4, 4, 9, 0),
        endDate: new Date(2015, 4, 4, 9, 15),
        recurrenceRule: 'FREQ=DAILY;COUNT=3',
        recurrenceException: '20150506T090000'
    };

    this.createInstance({
        dataSource: [task],
        views: ['month'],
        currentView: 'month',
        currentDate: new Date(2015, 4, 25),
        recurrenceEditMode: 'single'
    });

    this.instance.updateAppointment(task, newTask);
    const appointments = this.instance.$element().find('.dx-scheduler-appointment');

    assert.equal(appointments.length, 2, 'appt was rendered correctly');
});

QUnit.test('The second appointment in recurring series in Month view should have correct width', function(assert) {
    this.createInstance({
        dataSource: [{
            text: 'Appointment 1',
            startDate: new Date(2017, 9, 17, 9),
            endDate: new Date(2017, 9, 18, 10),
            recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU,MO,TU,WE,TH,FR,SA'
        }],
        currentDate: new Date(2017, 9, 17),
        views: ['month'],
        currentView: 'month'
    });
    const $appointments = this.instance.$element().find('.dx-scheduler-appointment');
    const cellWidth = this.instance.$element().find('.dx-scheduler-date-table-cell').outerWidth();

    assert.roughEqual($appointments.eq(1).outerWidth(), cellWidth * 2, 2, '2d appt has correct width');
});

QUnit.test('The second appointment in recurring series in Week view should have correct width', function(assert) {
    this.createInstance({
        dataSource: [{
            text: 'Appointment 1',
            startDate: new Date(2017, 9, 17, 9),
            endDate: new Date(2017, 9, 18, 10),
            recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU,MO,TU,WE,TH,FR,SA'
        }],
        currentDate: new Date(2017, 9, 17),
        views: ['week'],
        currentView: 'week'
    });

    const $appointments = this.instance.$element().find('.dx-scheduler-appointment');
    const cellWidth = this.instance.$element().find('.dx-scheduler-date-table-cell').outerWidth();

    assert.roughEqual($appointments.eq(1).outerWidth(), cellWidth * 2, 1.001, '2d appt has correct width');
});

QUnit.test('The second appointment in recurring series in Week view should be rendered correctly', function(assert) {
    this.createInstance({
        dataSource: [
            {
                startDate: new Date(2019, 9, 20, 8, 30),
                endDate: new Date(2019, 9, 21, 8, 29),
                recurrenceRule: 'FREQ=DAILY;COUNT=2',
                text: 'Test2'
            }
        ],
        views: ['week'],
        currentView: 'week',
        currentDate: new Date(2019, 9, 26),
        startDayHour: 9,
        height: 600
    });
    const $appointments = this.instance.$element().find('.dx-scheduler-appointment');
    const $dropDown = this.instance.$element().find('.dx-scheduler-appointment-collector');
    assert.equal($appointments.length, 2, 'Two appointments are rendered');
    assert.equal($dropDown.length, 0, 'There is no dropDown appointment');
});

QUnit.test('The second weekend appointment in recurring series in Week view should be rendered correctly', function(assert) {
    this.createInstance({
        dataSource: [
            {
                startDate: new Date(2019, 9, 26, 8, 30),
                endDate: new Date(2019, 9, 27, 8, 29),
                recurrenceRule: 'FREQ=DAILY;COUNT=2'
            },
        ],
        views: ['week'],
        currentView: 'week',
        currentDate: new Date(2019, 9, 26),
        startDayHour: 9,
        height: 600
    });

    let $appointments = this.instance.$element().find('.dx-scheduler-appointment');
    let $dropDown = this.instance.$element().find('.dx-scheduler-appointment-collector');

    assert.equal($appointments.length, 1, 'One appointment is rendered');
    assert.equal($dropDown.length, 0, 'There is no dropDown appointment');

    this.instance.option('currentDate', new Date(2019, 9, 26));

    $appointments = this.instance.$element().find('.dx-scheduler-appointment');
    $dropDown = this.instance.$element().find('.dx-scheduler-appointment-collector');

    assert.equal($appointments.length, 1, 'One appointment is rendered');
    assert.equal($dropDown.length, 0, 'There is no dropDown appointment');
});

QUnit.test('Reduced reccuring appt should have right left position in first column in Month view', function(assert) {
    this.createInstance({
        dataSource: [{
            text: 'Appointment 1',
            startDate: new Date(2017, 9, 17, 9),
            endDate: new Date(2017, 9, 18, 10),
            recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU,MO,TU,WE,TH,FR,SA'
        }],
        currentDate: new Date(2017, 9, 17),
        views: ['month'],
        currentView: 'month'
    });

    const $appointment = this.instance.$element().find('.dx-scheduler-appointment');
    const $reducedAppointment = this.instance.$element().find('.dx-scheduler-appointment-reduced');
    const compactClass = 'dx-scheduler-appointment-compact';

    assert.equal($reducedAppointment.eq(1).position().left, 0, 'first appt has right left position');
    assert.notOk($appointment.eq(7).hasClass(compactClass), 'next appt isn\'t compact');
});

QUnit.test('Reduced reccuring appt should have right left position in first column in grouped Month view', function(assert) {
    this.createInstance({
        dataSource: [{
            text: 'Appointment 1',
            startDate: new Date(2017, 9, 17, 9),
            endDate: new Date(2017, 9, 18, 10),
            recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU,MO,TU,WE,TH,FR,SA',
            ownerId: 2
        }],
        currentDate: new Date(2017, 9, 17),
        views: ['month'],
        currentView: 'month',
        groups: ['ownerId'],
        resources: [
            {
                field: 'ownerId',
                dataSource: [
                    { id: 1, text: 'one' },
                    { id: 2, text: 'two' }
                ]
            }
        ]
    });

    const $appointment = this.instance.$element().find('.dx-scheduler-appointment');
    const $reducedAppointment = this.instance.$element().find('.dx-scheduler-appointment-reduced');
    const compactClass = 'dx-scheduler-appointment-compact';
    const cellWidth = this.instance.$element().find('.dx-scheduler-date-table-cell').outerWidth();

    assert.roughEqual($reducedAppointment.eq(1).position().left, cellWidth * 7, 2.5, 'first appt in 2d group has right left position');
    assert.notOk($appointment.eq(7).hasClass(compactClass), 'appt isn\'t compact');
});

QUnit.test('Recurrence exception should be adjusted by scheduler timezone', function(assert) {
    const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-39600000);
    try {
        this.createInstance({
            dataSource: [{
                text: 'a',
                startDate: new Date(2018, 2, 26, 10),
                endDate: new Date(2018, 2, 26, 11),
                recurrenceRule: 'FREQ=DAILY',
                recurrenceException: '20180327T100000, 20180330T100000'
            }],
            views: ['month'],
            currentView: 'month',
            currentDate: new Date(2018, 2, 30),
            timeZone: 'Australia/Sydney',
            height: 600
        });

        const $appointments = this.instance.$element().find('.dx-scheduler-appointment');

        assert.equal($appointments.length, 11, 'correct number of the appointments');
    } finally {
        tzOffsetStub.restore();
    }
});

QUnit.test('T697037. Recurrence exception date should equal date of appointment, which excluded from recurrence', function(assert) {
    this.createInstance({
        dataSource: [ {
            text: 'Increase Price - North Region',
            startDate: '2018-11-26T02:00:00Z',
            endDate: '2018-11-26T02:15:00Z',
            recurrenceRule: 'FREQ=DAILY;COUNT=5',
            recurrenceException: ''
        }],
        views: ['week'],
        currentView: 'week',
        currentDate: new Date(2018, 10, 26),
        dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssZ',
        timeZone: 'Etc/UTC',
        editing: true,
        onAppointmentUpdating: function(e) {
            assert.equal(e.newData.recurrenceException, '20181128T020000Z', 'correct recurrence exception date');
        }
    });
    const $appointment = $(this.instance.$element()).find('.dx-scheduler-appointment').eq(2);
    const pointer = pointerMock($appointment).start();

    pointer.down().move(0, -30).up();

    $('.dx-dialog-buttons .dx-button').eq(1).trigger('dxclick');
});

QUnit.test('Recurrence exception should be adjusted by scheduler timezone after deleting of the single appt', function(assert) {
    this.createInstance({
        dataSource: [{
            text: 'Recruiting students',
            startDate: new Date(2018, 2, 26, 10, 0),
            endDate: new Date(2018, 2, 26, 11, 0),
            recurrenceRule: 'FREQ=DAILY'
        }],
        views: ['day'],
        currentView: 'day',
        currentDate: new Date(2018, 2, 27),
        timeZone: 'Australia/Sydney'
    });

    this.scheduler.appointments.click();
    this.clock.tick(300);

    this.scheduler.tooltip.clickOnDeleteButton();
    $('.dx-dialog-buttons .dx-button').eq(1).trigger('dxclick');

    const $appointment = this.instance.$element().find('.dx-scheduler-appointment');
    assert.notOk($appointment.length, 'appt is deleted');
});

QUnit.test('Recurrence exception should be adjusted by appointment timezone after deleting of the single appt', function(assert) {
    this.createInstance({
        dataSource: [{
            text: 'Recruiting students',
            startDate: new Date(2018, 2, 26, 10, 0),
            endDate: new Date(2018, 2, 26, 11, 0),
            recurrenceRule: 'FREQ=DAILY',
            startDateTimeZone: 'Australia/Canberra',
            endDateTimeZone: 'Australia/Canberra'
        }],
        views: ['day'],
        currentView: 'day',
        currentDate: new Date(2018, 3, 1)
    });

    this.scheduler.appointments.click();
    this.clock.tick(300);

    this.scheduler.tooltip.clickOnDeleteButton();
    $('.dx-dialog-buttons .dx-button').eq(1).trigger('dxclick');

    const $appointment = this.instance.$element().find('.dx-scheduler-appointment');

    assert.notOk($appointment.length, 'appt is deleted');
});

QUnit.test('Single changed appointment should be rendered correctly in specified timeZone', function(assert) {
    const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-10800000);
    try {
        this.createInstance({
            dataSource: [{
                text: 'Recurrence',
                startDate: '2018-05-23T10:00:00Z',
                endDate: '2018-05-23T10:30:00Z',
                recurrenceRule: 'FREQ=DAILY'
            }],
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2018, 4, 23),
            timeZone: 'Etc/UTC'
        });

        $(this.instance.$element()).find('.dx-scheduler-appointment').eq(0).trigger('dxclick').trigger('dxclick');

        $('.dx-dialog-buttons .dx-button').eq(1).trigger('dxclick');

        const $startDate = $('.dx-datebox').eq(0);
        const startDate = $startDate.dxDateBox('instance');
        const expectedStartDate = new Date(2018, 4, 23, 9, 0);

        startDate.option('value', expectedStartDate);
        $('.dx-button.dx-popup-done').eq(0).trigger('dxclick');
        this.clock.tick(300);

        const actualStartDate = $(this.instance.$element()).find('.dx-scheduler-appointment').eq(3).dxSchedulerAppointment('instance').option('startDate');

        assert.deepEqual(actualStartDate, expectedStartDate, 'appointment starts in 9AM');
    } finally {
        tzOffsetStub.restore();
    }
});

QUnit.test('Recurrent appointment considers firstDayOfWeek of Scheduler, WEEKLY,INTERVAL=2 (T744191)', function(assert) {
    this.createInstance({
        dataSource: [{
            text: 'test',
            startDate: new Date(2018, 4, 18, 6, 0),
            endDate: new Date(2018, 4, 18, 7, 0),
            recurrenceRule: 'FREQ=WEEKLY;BYDAY=SA,SU,MO,TH,FR;INTERVAL=2'
        }],
        views: [{
            type: 'month'
        }],
        currentView: 'month',
        currentDate: new Date(2018, 4, 21),
        height: 700,
        firstDayOfWeek: 3,
    });

    assert.equal(this.scheduler.appointments.getAppointmentCount(), 9, 'Appointment has right count of occurences');

    const firstAppointmentCoords = translator.locate($(this.scheduler.appointments.getAppointment(0)));

    assert.equal(firstAppointmentCoords.top, translator.locate(this.scheduler.appointments.getAppointment(1)).top, 'Second occurence has same top coordinate as first');
    assert.equal(firstAppointmentCoords.top, translator.locate(this.scheduler.appointments.getAppointment(2)).top, 'Third occurence has same top coordinate as first');

    const secondRowAppointmentCoords = translator.locate(this.scheduler.appointments.getAppointment(4));

    assert.equal(secondRowAppointmentCoords.top, translator.locate(this.scheduler.appointments.getAppointment(5)).top, 'Sixth occurence has same top coordinate as fifth');
    assert.equal(secondRowAppointmentCoords.top, translator.locate(this.scheduler.appointments.getAppointment(6)).top, 'Seventh occurence has same top coordinate as fifth');
    assert.equal(secondRowAppointmentCoords.top, translator.locate(this.scheduler.appointments.getAppointment(7)).top, 'Eighth occurence has same top coordinate as fifth');
});

QUnit.test('Prerender filter by recurrence rule determines renderable appointments correctly (T736600)', function(assert) {
    const data = [
        {
            text: 'Recurrent app with exc',
            startDate: new Date(2019, 5, 6, 15, 0),
            endDate: new Date(2019, 5, 6, 18, 30),
            recurrenceException: '20190607T150000',
            recurrenceRule: 'FREQ=DAILY'
        }
    ];

    this.createInstance({
        dataSource: data,
        views: ['day'],
        currentView: 'day',
        currentDate: new Date(2019, 5, 7),
        startDayHour: 8,
        height: 600
    });

    assert.equal(this.scheduler.appointments.getAppointmentCount(), 0, 'Appt is filtered on prerender and not rendered');
});

QUnit.test('Recurring appointment with interval > 1 rendered correctly (T823073)', function(assert) {
    const data = [
        {
            text: '5-week recur',
            startDate: new Date(2019, 9, 20, 7, 0),
            endDate: new Date(2019, 9, 20, 9, 0),
            recurrenceException: '',
            recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU;INTERVAL=5;COUNT=3'
        }
    ];

    this.createInstance({
        dataSource: data,
        views: ['month'],
        currentView: 'month',
        currentDate: new Date(2019, 9, 20),
        firstDayOfWeek: 1,
        startDayHour: 6,
        height: 600
    });

    assert.equal(this.scheduler.appointments.getAppointmentCount(), 1, 'Appointment is rendered');

    const position = this.scheduler.appointments.getAppointment(0).position();
    assert.roughEqual(position.left, 855, 0.5, 'Appointment\'s left is correct');
    assert.roughEqual(position.top, 190, 0.5, 'Appointment\'s top is correct');
});

QUnit.test('Appointment has correct occurrences dates with interval > 1', function(assert) {
    const data = [
        {
            text: 'Appointment with interval',
            startDate: new Date(2019, 9, 18, 7, 0),
            endDate: new Date(2019, 9, 18, 9, 0),
            recurrenceException: '',
            recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU,MO,TU,WE,TH,FR,SA;INTERVAL=2'
        }
    ];

    this.createInstance({
        dataSource: data,
        views: ['month'],
        currentView: 'month',
        currentDate: new Date(2019, 9, 20),
        startDayHour: 6,
        height: 600
    });

    assert.equal(this.scheduler.appointments.getAppointmentCount(), 9, 'Appointment occurrences are rendered');
    const firstPosition = this.scheduler.appointments.getAppointment(0).position();
    const eighthPosition = this.scheduler.appointments.getAppointment(7).position();

    assert.roughEqual(firstPosition.left, eighthPosition.left, 0.5, 'Appointment\'s left is correct');
    assert.roughEqual(firstPosition.top, 190, 0.5, 'Appointment\'s top is correct');
});

QUnit.test('Appointment has correct occurrences dates with interval > 1, custom firstDayOfWeek', function(assert) {
    const data = [
        {
            text: 'Appointment with interval',
            startDate: new Date(2019, 9, 18, 7, 0),
            endDate: new Date(2019, 9, 18, 9, 0),
            recurrenceException: '',
            recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU,MO,TU,WE,TH,FR,SA;INTERVAL=2'
        }
    ];

    this.createInstance({
        dataSource: data,
        views: ['month'],
        currentView: 'month',
        currentDate: new Date(2019, 9, 20),
        firstDayOfWeek: 1,
        startDayHour: 6,
        height: 600
    });

    assert.equal(this.scheduler.appointments.getAppointmentCount(), 10, 'Appointment is rendered');
    const firstPosition = this.scheduler.appointments.getAppointment(0).position();
    const eighthPosition = this.scheduler.appointments.getAppointment(7).position();

    assert.roughEqual(firstPosition.left, eighthPosition.left, 0.5, 'Appointment\'s left is correct');
    assert.roughEqual(firstPosition.top, 190, 0.5, 'Appointment\'s top is correct');
});

QUnit.test('Appointment has correct occurrences dates with interval > 1, custom WKST', function(assert) {
    const data = [
        {
            text: 'Appointment with interval',
            startDate: new Date(2019, 9, 18, 7, 0),
            endDate: new Date(2019, 9, 18, 9, 0),
            recurrenceException: '',
            recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU,MO,TU,WE,TH,FR,SA;WKST=WE;INTERVAL=2'
        }
    ];

    this.createInstance({
        dataSource: data,
        views: ['month'],
        currentView: 'month',
        currentDate: new Date(2019, 9, 20),
        firstDayOfWeek: 1,
        startDayHour: 6,
        height: 600
    });

    assert.equal(this.scheduler.appointments.getAppointmentCount(), 12, 'Appointment is rendered');
    const firstPosition = this.scheduler.appointments.getAppointment(0).position();
    const eighthPosition = this.scheduler.appointments.getAppointment(7).position();

    assert.roughEqual(firstPosition.left, eighthPosition.left, 0.5, 'Appointment\'s left is correct');
    assert.roughEqual(firstPosition.top, 190, 0.5, 'Appointment\'s top is correct');
});

QUnit.test('Appointment has correct occurrences dates with interval > 1, custom WKST', function(assert) {
    const data = [
        {
            text: 'Appointment with interval',
            startDate: new Date(2019, 9, 18, 7, 0),
            endDate: new Date(2019, 9, 18, 9, 0),
            recurrenceException: '',
            recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU,MO,TU,WE,TH,FR,SA;WKST=WE;INTERVAL=2'
        }
    ];

    this.createInstance({
        dataSource: data,
        views: ['month'],
        currentView: 'month',
        currentDate: new Date(2019, 9, 20),
        startDayHour: 6,
        height: 600
    });

    assert.equal(this.scheduler.appointments.getAppointmentCount(), 12, 'Appointment occurrences are rendered');
    const firstPosition = this.scheduler.appointments.getAppointment(0).position();
    const fourthPosition = this.scheduler.appointments.getAppointment(3).position();
    const eighthPosition = this.scheduler.appointments.getAppointment(7).position();

    assert.roughEqual(firstPosition.left, eighthPosition.left, 0.5, 'Appointment\'s left are correct');
    assert.roughEqual(fourthPosition.top - firstPosition.top, eighthPosition.top - fourthPosition.top, 0.5, 'Appointment\'s top are correct');
});

QUnit.test('Appointment has correct occurrences dates with interval > 1, custom firstDayOfWeek & WKST', function(assert) {
    const data = [
        {
            text: 'Appointment with interval',
            startDate: new Date(2019, 9, 18, 7, 0),
            endDate: new Date(2019, 9, 18, 9, 0),
            recurrenceException: '',
            recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU,MO,TU,WE,TH,FR,SA;WKST=WE;INTERVAL=2'
        }
    ];

    this.createInstance({
        dataSource: data,
        views: ['month'],
        currentView: 'month',
        currentDate: new Date(2019, 9, 20),
        startDayHour: 6,
        firstDayOfWeek: 1,
        height: 600
    });

    assert.equal(this.scheduler.appointments.getAppointmentCount(), 12, 'Appointment occurrences are rendered');
    const firstPosition = this.scheduler.appointments.getAppointment(0).position();
    const fourthPosition = this.scheduler.appointments.getAppointment(3).position();
    const seventhPosition = this.scheduler.appointments.getAppointment(6).position();
    const eighthPosition = this.scheduler.appointments.getAppointment(7).position();

    assert.roughEqual(firstPosition.left, eighthPosition.left, 0.5, 'Appointment\'s left are correct');
    assert.roughEqual(fourthPosition.top - firstPosition.top, eighthPosition.top - fourthPosition.top, 0.5, 'Appointment\'s top are correct');
    assert.roughEqual(seventhPosition.top, eighthPosition.top, 0.5, 'Appointment\'s occurrences after WKST are positioned correct on top');
});

if(isDesktopEnvironment()) {
    QUnit.test('Recurrent appointment occurrence should be resized correctly, when startDayHour is changed on recurrent appointment (T832115)', function(assert) {
        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            views: ['week'],
            currentView: 'week',
            startDayHour: 6,
            dataSource: [{
                text: 'a',
                startDate: new Date(2015, 1, 9, 10),
                endDate: new Date(2015, 1, 9, 11),
                recurrenceRule: 'FREQ=DAILY',
            }]
        });

        const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-top').eq(1)).start();
        pointer.dragStart().drag(0, -3 * this.scheduler.workSpace.getCellHeight()).dragEnd();

        this.scheduler.appointmentForm.getRecurrentAppointmentFormDialogButtons().eq(1).trigger('dxclick');

        assert.deepEqual(this.instance.option('dataSource')[1].startDate, new Date(2015, 1, 10, 8, 30), 'Start date is OK');
    });
}

QUnit.test('Recurrence appointment occurrences should have correct start date with timezone changing (T818393)', function(assert) {
    this.createInstance({
        views: ['day', 'week', 'workWeek', 'month'],
        currentView: 'week',
        startDayHour: 1,
        firstDayOfWeek: 2,
        height: 600,
        dataSource: [{
            text: 'Recurrence',
            startDate: new Date(2019, 2, 30, 2, 0),
            endDate: new Date(2019, 2, 30, 10, 0),
            recurrenceException: '',
            recurrenceRule: 'FREQ=DAILY'
        }],
        currentDate: new Date(2019, 2, 30)
    });

    assert.equal(this.scheduler.appointments.getAppointmentCount(), 3, 'Appointment has right count of occurrences');
    assert.equal(this.scheduler.appointments.getAppointmentPosition(0).top, this.scheduler.appointments.getAppointmentPosition(2).top, 'Appointment first and third occurrences have same top coordinate');
});

QUnit.test('Recurrence appointment occurences should have correct text (T818393)', function(assert) {
    this.createInstance({
        views: ['week'],
        currentView: 'week',
        height: 600,
        dataSource: [{
            text: 'Recurrence',
            startDate: new Date(2019, 2, 30, 2, 0),
            endDate: new Date(2019, 2, 30, 3, 0),
            recurrenceException: '',
            recurrenceRule: 'FREQ=HOURLY;INTERVAL=1;COUNT=5'
        }],
        currentDate: new Date(2019, 2, 30)
    });

    assert.equal(this.scheduler.appointments.getAppointmentCount(), 5, 'Appointment has right count of occurrences');

    const $thirdAppointment = this.scheduler.appointments.getAppointment(2);

    assert.equal($thirdAppointment.find('.dx-scheduler-appointment-content-date').eq(0).text(), '4:00 AM', 'Appointment third occurrences has correct start date text');
    assert.equal($thirdAppointment.find('.dx-scheduler-appointment-content-date').eq(2).text(), '5:00 AM', 'Appointment third occurrences has correct end date text');
});
