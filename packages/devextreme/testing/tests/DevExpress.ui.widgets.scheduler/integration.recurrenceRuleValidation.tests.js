const $ = require('jquery');

QUnit.testStart(function() {
    $('#qunit-fixture').html(
        '<div id="scheduler">\
            <div data-options="dxTemplate: { name: \'template\' }">Task Template</div>\
            </div>');
});

require('fluent_blue_light.css!');

const fx = require('common/core/animation/fx');
const dragEvents = require('common/core/events/drag');
const DataSource = require('common/data/data_source/data_source').DataSource;
const { createWrapper } = require('../../helpers/scheduler/helpers.js');

require('__internal/scheduler/m_scheduler');
require('ui/drop_down_button');

QUnit.module('Integration: recurrence rules validation', {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = async function(options) {
            const scheduler = await createWrapper(options);
            this.instance = scheduler.instance;
        };

        this.tasks = [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            }
        ];
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test('Incorrect recurrence rule should not be applied', async function(assert) {
    const item = { text: 'Appointment 1', startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 0, 30), recurrenceRule: 'FREQ=DAILY,INTERVAL=1' };

    const data = new DataSource({
        store: [item]
    });

    await this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, currentView: 'week' });

    assert.equal(this.instance.$element().find('.dx-scheduler-appointment').length, 1, 'dxSchedulerAppointments has only one item');
});

QUnit.test('Appointment with incorrect recurrence rule should not have specific class', async function(assert) {
    const item = { text: 'Appointment 1', startDate: new Date(2015, 1, 9), recurrenceRule: 'FREQ=DAILY,INTERVAL=1' };

    const data = new DataSource({
        store: [item]
    });

    await this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, currentView: 'week' });

    const $appointment = this.instance.$element().find('.dx-scheduler-appointment').eq(0);

    assert.notOk($appointment.hasClass('dx-scheduler-appointment-recurrence'), 'Appointment has not specific class');
});

QUnit.test('Recurrence rule with incorrect ruleName should not be applied ', async function(assert) {
    const item = { text: 'Appointment 1', startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 0, 30), recurrenceRule: 'FREQ=DAILY;INTERVAL=1;AA=2' };

    const data = new DataSource({
        store: [item]
    });

    await this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, currentView: 'week' });

    assert.equal(this.instance.$element().find('.dx-scheduler-appointment').length, 1, 'dxSchedulerAppointments has only one item');
});

QUnit.test('Confirmation dialog should not be shown if rrule is invalid', async function(assert) {
    const data = new DataSource({
        store: [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: 'FREQ=DAILY,INTERVAL=1'
            }
        ]
    });

    await this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: data,
        currentView: 'week',
        firstDayOfWeek: 1
    });

    $(this.instance.$element()).find('.dx-scheduler-appointment').eq(0).trigger(dragEvents.start);
    $(this.instance.$element()).find('.dx-scheduler-date-table-cell').eq(5).trigger(dragEvents.enter);
    $(this.instance.$element()).find('.dx-scheduler-appointment').eq(0).trigger(dragEvents.end);

    assert.notOk($('.dx-dialog').length, 'Dialog was not shown');
});
