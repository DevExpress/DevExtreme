import $ from 'jquery';
import SchedulerAppointment from 'ui/scheduler/ui.scheduler.appointment';
import fx from 'animation/fx';

const APPOINTMENT_DRAG_SOURCE_CLASS = 'dx-scheduler-appointment-drag-source';

QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id="scheduler-appointment"></div>');
});

const moduleOptions = {
    beforeEach: function() {
        fx.off = true;
        this.instance = $('#scheduler-appointment').dxSchedulerAppointment().dxSchedulerAppointment('instance');
        this.cellHeight = 20;
        this.cellWidth = 25;

        this.instance.invoke = $.proxy(function(command, field, obj, value) {
            if(command === 'getCellHeight') {
                return this.cellHeight;
            }
            if(command === 'getCellWidth') {
                return this.cellWidth;
            }
            if(command === 'getResizableStep') {
                return this.cellWidth;
            }
            if(command === 'isGroupedByDate') {
                return false;
            }
        }, this);
    },
    afterEach: function() {
        fx.off = false;
    }
};


QUnit.module('Appointments', moduleOptions);

QUnit.test('Scheduler appointment should be initialized', function(assert) {
    assert.ok(this.instance instanceof SchedulerAppointment, 'dxSchedulerAppointment was initialized');
});

QUnit.test('Scheduler appointment has right direction css-class', function(assert) {
    assert.notOk(this.instance.$element().hasClass('dx-scheduler-appointment-horizontal'), 'appointment doesn\'t have css-class');
    assert.ok(this.instance.$element().hasClass('dx-scheduler-appointment-vertical'), 'appointment has right class');

    this.instance.option('direction', 'horizontal');
    assert.ok(this.instance.$element().hasClass('dx-scheduler-appointment-horizontal'), 'appointment has right class');
});

QUnit.test('Scheduler appointment has right resizable config for vertical direction', function(assert) {
    this.instance.option({
        direction: 'vertical',
        cellHeight: 20
    });

    assert.ok(this.instance.$element().dxResizable, 'appointment has right class');

    const resizableInstance = this.instance.$element().dxResizable('instance');

    assert.equal(resizableInstance.option('handles'), 'top bottom', 'Appointment can resize only horizontal');
    assert.equal(resizableInstance.option('step'), this.cellHeight, 'Resizable has a right step');
    assert.equal(resizableInstance.option('minWidth'), 0, 'Resizable has a right minWidth');
    assert.equal(resizableInstance.option('minHeight'), this.cellHeight, 'Resizable has a right minHeight');
});

QUnit.test('Scheduler appointment has right resizable config for horizontal direction', function(assert) {
    this.instance.option({
        direction: 'horizontal',
        cellWidth: 25
    });

    assert.ok(this.instance.$element().dxResizable, 'appointment has right class');

    const resizableInstance = this.instance.$element().dxResizable('instance');

    assert.equal(resizableInstance.option('handles'), 'left right', 'Appointment can resize only horizontal');
    assert.equal(resizableInstance.option('step'), this.cellWidth, 'Resizable has a right step');
    assert.equal(resizableInstance.option('minWidth'), this.cellWidth, 'Resizable has a right minWidth');
    assert.equal(resizableInstance.option('minHeight'), 0, 'Resizable has a right minHeight');
});

QUnit.test('Scheduler appointment has right resizing handles, horizontal direction', function(assert) {
    this.instance.option({
        direction: 'horizontal',
        cellHeight: 20,
        cellWidth: 25,
        reduced: 'head'
    });

    const resizableInstance = this.instance.$element().dxResizable('instance');

    assert.equal(resizableInstance.option('handles'), 'left', 'Appointment has right resizing handle');

    this.instance.option('reduced', 'body');
    assert.equal(resizableInstance.option('handles'), '', 'Appointment has right resizing handle');

    this.instance.option('reduced', 'tail');
    assert.equal(resizableInstance.option('handles'), 'right', 'Appointment has right resizing handle');
});

QUnit.test('Scheduler appointment has right resizing handles, horizontal direction, RTL', function(assert) {
    this.instance.option({
        direction: 'horizontal',
        cellHeight: 20,
        cellWidth: 25,
        rtlEnabled: true,
        reduced: 'head'
    });

    const resizableInstance = this.instance.$element().dxResizable('instance');

    assert.equal(resizableInstance.option('handles'), 'right', 'Appointment has right resizing handle');

    this.instance.option('reduced', 'body');
    assert.equal(resizableInstance.option('handles'), '', 'Appointment has right resizing handle');

    this.instance.option('reduced', 'tail');
    assert.equal(resizableInstance.option('handles'), 'left', 'Appointment has right resizing handle');
});

QUnit.test('Appointment should process "isDragSource" property', function(assert) {
    assert.ok(
        !this.instance.$element().hasClass(APPOINTMENT_DRAG_SOURCE_CLASS),
        'Appointment is not a drag source by default',
    );

    this.instance.option('isDragSource', true);

    assert.ok(
        this.instance.$element().hasClass(APPOINTMENT_DRAG_SOURCE_CLASS),
        'Appointment is a drag source by',
    );

});
