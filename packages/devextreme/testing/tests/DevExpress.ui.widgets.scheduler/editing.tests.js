const $ = require('jquery');
const devices = require('core/devices');
const fx = require('common/core/animation/fx');
const keyboardMock = require('../../helpers/keyboardMock.js');
const { createWrapper } = require('../../helpers/scheduler/helpers.js');
const { waitAsync } = require('../../helpers/scheduler/waitForAsync.js');

require('__internal/scheduler/m_scheduler');
require('ui/drop_down_button');

QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id="scheduler"></div>');
});

QUnit.module('Editing option: boolean', {
    beforeEach: function() {
        this.createInstance = async function(options) {
            fx.off = true;

            options = options || {};
            options.editing = options.editing || false;
            const scheduler = await createWrapper(options);
            this.instance = scheduler.instance;
        };
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test('Scheduler should have \'readonly\' css class', async function(assert) {
    await this.createInstance();
    assert.ok(this.instance.$element().hasClass('dx-scheduler-readonly'), 'Readonly class is defined');

    this.instance.option('editing', true);
    assert.notOk(this.instance.$element().hasClass('dx-scheduler-readonly'), 'Readonly class is removed');
});

QUnit.test('popup should not be shown  after click on focused cell', async function(assert) {
    await this.createInstance();

    $(this.instance.$element()).find('.dx-scheduler-date-table-cell').first().trigger('dxpointerdown').trigger('dxpointerdown').trigger('dxclick');

    assert.notOk($('.dx-scheduler-appointment-popup .dx-overlay-content').length, 'Popup is not shown');

});

QUnit.test('popup should not be shown after press Enter', async function(assert) {
    await this.createInstance({ focusStateEnabled: true });

    const $workSpace = $(this.instance.$element().find('.dx-scheduler-work-space'));
    const keyboard = keyboardMock($workSpace);

    $($workSpace).trigger('focusin');
    keyboard.keyDown('enter');

    assert.notOk($('.dx-scheduler-appointment-popup .dx-overlay-content').length, 'Popup is not shown');
});

QUnit.test('Appointment should not be draggable & resizable', async function(assert) {
    await this.createInstance({
        currentDate: new Date(2015, 5, 15),
        firstDayOfWeek: 1,
        dataSource: [{
            text: 'a',
            startDate: new Date(2015, 5, 15, 10),
            endDate: new Date(2015, 5, 15, 10, 30)
        }]
    });

    const appointments = this.instance.$element().find('.dx-scheduler-scrollable-appointments').dxSchedulerAppointments('instance');
    assert.notOk(appointments.option('allowDrag'), 'Drag is not allowed');
    assert.notOk(appointments.option('allowResize'), 'Resize is not allowed');

    this.instance.option('editing', true);
    assert.ok(appointments.option('allowDrag'), 'Drag is allowed');
    assert.ok(appointments.option('allowResize'), 'Resize is allowed');
});

QUnit.test('ReadOnly option should be passed to the details appointment view', async function(assert) {
    await this.createInstance();

    this.instance.showAppointmentPopup({
        text: 'a',
        startDate: new Date(2015, 5, 15, 10),
        endDate: new Date(2015, 5, 15, 11)
    });

    let detailsAppointmentView = this.instance.getAppointmentDetailsForm();

    assert.ok(detailsAppointmentView.option('readOnly'), 'ReadOnly option is correct');

    this.instance.option('editing', true);
    this.instance.showAppointmentPopup({
        text: 'a',
        startDate: new Date(2015, 5, 15, 10),
        endDate: new Date(2015, 5, 15, 11)
    });
    detailsAppointmentView = this.instance.getAppointmentDetailsForm();

    assert.notOk(detailsAppointmentView.option('readOnly'), 'ReadOnly option is correct');
});

QUnit.test('Details appointment view should be readOnly if editing.allowUpdating=false', async function(assert) {
    await this.createInstance({
        editing: {
            allowUpdating: false
        }
    });

    this.instance.showAppointmentPopup({
        text: 'a',
        startDate: new Date(2015, 5, 15, 10),
        endDate: new Date(2015, 5, 15, 11)
    });

    let detailsAppointmentView = this.instance.getAppointmentDetailsForm();

    assert.ok(detailsAppointmentView.option('readOnly'), 'ReadOnly option is correct');

    this.instance.option('editing', {
        allowUpdating: true
    });
    this.instance.showAppointmentPopup({
        text: 'a',
        startDate: new Date(2015, 5, 15, 10),
        endDate: new Date(2015, 5, 15, 11)
    });
    detailsAppointmentView = this.instance.getAppointmentDetailsForm();

    assert.notOk(detailsAppointmentView.option('readOnly'), 'ReadOnly option is correct');
});

QUnit.test('Details appointment view shouldn\'t be readOnly when adding new appointment if editing.allowUpdating=false', async function(assert) {
    await this.createInstance({
        currentDate: new Date(2015, 5, 14),
        editing: {
            allowUpdating: false,
            allowAdding: true
        }
    });

    this.instance.showAppointmentPopup({
        text: 'a',
        startDate: new Date(2015, 12, 15, 10),
        endDate: new Date(2015, 12, 15, 11)
    }, true);

    const detailsAppointmentView = this.instance.getAppointmentDetailsForm();

    assert.notOk(detailsAppointmentView.option('readOnly'), 'ReadOnly option is correct');
});

QUnit.test('Details appointment form should be readOnly after adding new appointment if editing.allowUpdating=false', async function(assert) {
    await this.createInstance({
        currentDate: new Date(2015, 5, 14),
        editing: {
            allowUpdating: false
        },
        dataSource: []
    });

    const a = { text: 'a', startDate: new Date(2015, 5, 14, 0), endDate: new Date(2015, 5, 14, 0, 30) };

    this.instance.showAppointmentPopup(a, true);
    this.instance.hideAppointmentPopup();

    this.instance.showAppointmentPopup(a);

    const detailsAppointmentView = this.instance.getAppointmentDetailsForm();

    assert.ok(detailsAppointmentView.option('readOnly'), 'ReadOnly option is correct');
    this.instance.hideAppointmentPopup();
});

QUnit.test('Details form of new appointment shouldn\'t be readOnly after try to change existing appointment if editing.allowUpdating=false', async function(assert) {
    const first = { text: 'first', startDate: new Date(2015, 5, 14, 0), endDate: new Date(2015, 5, 14, 0, 30) };
    const second = { text: 'second', startDate: new Date(2015, 5, 14, 1), endDate: new Date(2015, 5, 14, 1, 30) };

    await this.createInstance({
        currentDate: new Date(2015, 5, 14),
        editing: {
            allowUpdating: false
        },
        dataSource: [first]
    });
    this.instance.showAppointmentPopup(first);
    this.instance.hideAppointmentPopup();
    this.instance.showAppointmentPopup(second, true);

    const detailsAppointmentView = this.instance.getAppointmentDetailsForm();

    assert.notOk(detailsAppointmentView.option('readOnly'), 'ReadOnly option is correct');
    this.instance.hideAppointmentPopup();
});

QUnit.module('Editing option: complex object', {
    beforeEach: function() {
        this.createInstance = function(options) {
            fx.off = true;

            options = options || {};
            !options.editing && (options.editing = {
                allowAdding: false,
                allowUpdating: false,
                allowDeleting: false,
                allowResizing: false,
                allowDragging: false
            });
            this.instance = $('#scheduler').dxScheduler(options).dxScheduler('instance');
        };
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test('Scheduler should have \'readonly\' css class for complex object editing option', async function(assert) {
    await this.createInstance();
    assert.ok(this.instance.$element().hasClass('dx-scheduler-readonly'), 'Readonly class is defined');

    this.instance.option('editing.allowUpdating', true);
    assert.notOk(this.instance.$element().hasClass('dx-scheduler-readonly'), 'Readonly class is removed');
});

QUnit.test('showAppointmentPopup method should not be called after click on focused cell if editing.allowAdding is false', async function(assert) {
    await this.createInstance({
        editing: {
            allowAdding: false
        }
    });
    const spy = sinon.spy(this.instance, 'showAppointmentPopup');

    $(this.instance.$element()).find('.dx-scheduler-date-table-cell').first().trigger('dxpointerdown').trigger('dxpointerdown');

    assert.notOk(spy.called, 'showAppointmentPopup is not called');

    this.instance.showAppointmentPopup.restore();
});

QUnit.test('Appointment should not be draggable & resizable if editing.allowUpdating is false', async function(assert) {
    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'test does not actual for mobile devices');
        return;
    }

    await this.createInstance({
        editing: {
            allowUpdating: false
        },
        currentDate: new Date(2015, 5, 15),
        firstDayOfWeek: 1,
        dataSource: [{
            text: 'a',
            startDate: new Date(2015, 5, 15, 10),
            endDate: new Date(2015, 5, 15, 10, 30)
        }]
    });

    await waitAsync(0);
    const appointments = this.instance.$element().find('.dx-scheduler-scrollable-appointments').dxSchedulerAppointments('instance');
    assert.notOk(appointments.option('allowDrag'), 'Drag is not allowed');
    assert.notOk(appointments.option('allowResize'), 'Resize is not allowed');

    this.instance.option('editing', {
        allowUpdating: true
    });
    assert.ok(appointments.option('allowDrag'), 'Drag is allowed');
    assert.ok(appointments.option('allowResize'), 'Resize is allowed');
});

QUnit.test('Appointment should not be resizable if editing.allowResizing is false', async function(assert) {
    await this.createInstance({
        editing: {
            allowResizing: false
        },
        currentDate: new Date(2015, 5, 15),
        firstDayOfWeek: 1,
        dataSource: [{
            text: 'a',
            startDate: new Date(2015, 5, 15, 10),
            endDate: new Date(2015, 5, 15, 10, 30)
        }]
    });

    await waitAsync(0);
    const appointments = this.instance.$element().find('.dx-scheduler-scrollable-appointments').dxSchedulerAppointments('instance');
    assert.notOk(appointments.option('allowResize'), 'Resize is not allowed');

    this.instance.option('editing', {
        allowResizing: true
    });
    assert.ok(appointments.option('allowResize'), 'Resize is allowed');
});

QUnit.test('Appointment should not be draggable if editing.allowDragging is false', async function(assert) {
    await this.createInstance({
        editing: {
            allowDragging: false
        },
        currentDate: new Date(2015, 5, 15),
        firstDayOfWeek: 1,
        dataSource: [{
            text: 'a',
            startDate: new Date(2015, 5, 15, 10),
            endDate: new Date(2015, 5, 15, 10, 30)
        }]
    });

    await waitAsync(0);
    const appointments = this.instance.$element().find('.dx-scheduler-scrollable-appointments').dxSchedulerAppointments('instance');
    assert.notOk(appointments.option('allowDrag'), 'Drag is not allowed');

    this.instance.option('editing', {
        allowDragging: true
    });
    assert.ok(appointments.option('allowDrag'), 'Drag is allowed');
});

QUnit.test('Appointment should not be deleted, if allowUpdating || allowDeleting = false', async function(assert) {
    await this.createInstance({
        currentDate: new Date(2015, 5, 15),
        firstDayOfWeek: 1,
        dataSource: [{
            text: 'a',
            startDate: new Date(2015, 5, 15, 10),
            endDate: new Date(2015, 5, 15, 10, 30)
        }],
        editing: {
            allowUpdating: false,
            allowDeleting: false
        }
    });

    await waitAsync(0);
    let appointments = this.instance.$element().find('.dx-scheduler-scrollable-appointments').dxSchedulerAppointments('instance');
    assert.strictEqual(appointments.option('allowDelete'), false, 'Delete is not allowed');

    this.instance.option('editing', {
        allowUpdating: false,
        allowDeleting: true
    });

    assert.strictEqual(appointments.option('allowDelete'), false, 'Delete is not allowed');

    this.instance.option('editing', {
        allowUpdating: true,
        allowDeleting: true
    });

    appointments = this.instance.$element().find('.dx-scheduler-scrollable-appointments').dxSchedulerAppointments('instance');
    assert.strictEqual(appointments.option('allowDelete'), true, 'Delete is allowed');
});
