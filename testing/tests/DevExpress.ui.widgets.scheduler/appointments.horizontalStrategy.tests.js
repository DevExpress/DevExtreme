import $ from 'jquery';
import dataCoreUtils from 'core/utils/data';
import typeUtils from 'core/utils/type';
import fx from 'animation/fx';
import 'ui/scheduler/ui.scheduler';

const compileGetter = dataCoreUtils.compileGetter;
const compileSetter = dataCoreUtils.compileSetter;

QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id="scheduler-appointments"></div>\
                                <div id="allDayContainer"></div>\
                                <div id="fixedContainer"></div>');
});

const moduleOptions = {
    beforeEach: function() {
        fx.off = true;

        this.clock = sinon.useFakeTimers();
        this.width = 20;
        this.height = 20;
        this.allDayHeight = 20;
        this.compactAppointmentOffset = 3;
        this.viewStartDate = undefined;
        this.coordinates = [{ top: 0, left: 0 }];
        this.getCoordinates = function() {
            return this.coordinates;
        };
        this.instance = $('#scheduler-appointments').dxSchedulerAppointments().dxSchedulerAppointments('instance');

        this.instance.notifyObserver = $.proxy(function(command, options) {
            if(command === 'needCoordinates') {
                options.callback(this.getCoordinates.apply(this));
            }

            if(command === 'getCellDimensions') {
                options.callback(this.width, this.height, this.allDayHeight);
            }

            if(command === 'getFullWeekAppointmentWidth') {
                options.callback(this.fullWeekAppointmentWidth);
            }

            if(command === 'getMaxAppointmentWidth') {
                options.callback(this.maxAppointmentWidth);
            }

            if(command === 'getAppointmentColor') {
                options.callback($.Deferred().resolve('red').promise());
            }

            if(command === 'getResourceForPainting') {
                options.callback({ field: 'roomId' });
            }

            if(command === 'updateAppointmentStartDate') {
                this.viewStartDate && options.callback(this.viewStartDate);
            }

            if(command === 'getAppointmentDurationInMs') {
                options.callback(options.endDate.getTime() - options.startDate.getTime());
            }

        }, this);

        this.instance.invoke = $.proxy(function(command, field, obj, value) {
            const dataAccessors = {
                getter: {
                    startDate: compileGetter('startDate'),
                    endDate: compileGetter('endDate'),
                    allDay: compileGetter('allDay'),
                    text: compileGetter('text'),
                    recurrenceRule: compileGetter('recurrenceRule')
                },
                setter: {
                    startDate: compileSetter('startDate'),
                    endDate: compileSetter('endDate'),
                    allDay: compileSetter('allDay'),
                    text: compileSetter('text'),
                    recurrenceRule: compileSetter('recurrenceRule')
                }
            };
            if(command === 'getField') {
                if(!typeUtils.isDefined(dataAccessors.getter[field])) {
                    return;
                }

                return dataAccessors.getter[field](obj);
            }
            if(command === 'setField') {
                return dataAccessors.setter[field](obj, value);
            }
            if(command === 'prerenderFilter') {
                return this.instance.option('items');
            }
            if(command === 'convertDateByTimezone') {
                return field;
            }
            if(command === 'getEndDayHour') {
                if(this.instance.option('renderingStrategy') === 'horizontalMonthLine') {
                    return 24;
                } else {
                    return 20;
                }
            }
            if(command === 'getStartDayHour') {
                if(this.instance.option('renderingStrategy') === 'horizontalMonthLine') {
                    return 0;
                } else {
                    return 8;
                }
            }
            // TODO: rename arguments
            if(command === 'processDateDependOnTimezone') {
                return field;
            }
            if(command === 'getAppointmentGeometry') {
                return {
                    width: field.width || 0,
                    height: field.height || 0,
                    left: field.left || 0,
                    top: field.top || 0,
                    empty: field.empty || false
                };
            }
        }, this);
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
};

(function() {

    QUnit.module('Horizontal Month Strategy', moduleOptions);

    QUnit.test('AllDay appointment should be displayed right when endDate > startDate and duration < 24', function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 2, 5, 10),
                endDate: new Date(2015, 2, 6, 6),
                allDay: true
            },
            settings: [{ top: 0, left: 0, count: 1, index: 0, width: 40, allDay: true }]
        }];

        this.items = items;
        this.instance.option('items', items);

        const $appointment = this.instance.$element().find('.dx-scheduler-appointment');
        const allDayAppointmentWidth = this.width * 2;
        assert.equal($appointment.eq(0).outerWidth(), allDayAppointmentWidth, 'appointment has right width');
    });

    QUnit.test('Appointment should not be multiweek when its width some more than maxAllowedPosition(ie & ff pixels)', function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 2, 1),
                endDate: new Date(2015, 2, 8)
            },
            settings: [{ top: 0, left: 0, max: 135 }]
        }];

        this.fullWeekAppointmentWidth = 140;
        this.maxAppointmentWidth = 500;

        this.instance.option({
            items: items,
            renderingStrategy: 'horizontalMonth'
        });

        const $appointment = this.instance.$element().find('.dx-scheduler-appointment');

        assert.equal($appointment.length, 1, 'appointment is not multiline');
    });

    QUnit.test('Collapsing appointments should have specific class', function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 11),
                endDate: new Date(2015, 1, 9, 12)
            },
            settings: [{ top: 0, left: 0, empty: true }]
        }];

        this.width = 150;
        this.height = 200;
        this.instance.option('renderingStrategy', 'horizontalMonth');
        this.items = items;
        this.instance.option('items', items);

        const $appointment = this.instance.$element().find('.dx-scheduler-appointment').eq(0);
        assert.ok($appointment.hasClass('dx-scheduler-appointment-empty'), 'appointment has the class');
    });

    QUnit.test('Small width appointments should have specific class', function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 12)
            },
            settings: [{ top: 0, left: 0, height: 50, width: 39.5, empty: true }]
        }];

        this.items = items;
        this.instance.option('renderingStrategy', 'horizontalMonth');
        this.instance.option('items', items);

        const $appointment = this.instance.$element().find('.dx-scheduler-appointment');
        assert.ok($appointment.eq(0).hasClass('dx-scheduler-appointment-empty'), 'appointment has the class');
    });

    QUnit.test('Small height appointments should have specific class', function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 12)
            },
            settings: [{ top: 0, left: 0, height: 18.5, width: 10, empty: true }]
        }];

        this.items = items;
        this.instance.option('renderingStrategy', 'horizontalMonth');
        this.instance.option('items', items);

        const $appointment = this.instance.$element().find('.dx-scheduler-appointment');
        assert.ok($appointment.eq(0).hasClass('dx-scheduler-appointment-empty'), 'appointment has the class');
    });

})('Horizontal Month Strategy');

(function() {
    QUnit.module('Horizontal Strategy', moduleOptions);

    QUnit.test('All-day appointment should have a correct css class', function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 1),
                endDate: new Date(2015, 1, 9, 2),
                allDay: true
            },
            settings: [{ top: 0, left: 0, count: 1, index: 0, width: 40, allDay: true }]
        }];

        this.height = 200;
        this.width = 50;
        this.items = items;

        this.instance.option('renderingStrategy', 'horizontal');
        this.instance.option('items', items);

        const $appointment = this.instance.$element().find('.dx-scheduler-appointment');

        assert.ok($appointment.eq(0).hasClass('dx-scheduler-all-day-appointment'), 'Appointment has a right css class');
    });

    QUnit.test('Appointment should have a correct min width', function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 1),
                endDate: new Date(2015, 1, 9, 2),
                allDay: true
            },
            settings: [{ width: 2 }]
        }];
        this.instance.option('renderingStrategy', 'horizontal');
        this.instance.option('items', items);

        const $appointment = this.instance.$element().find('.dx-scheduler-appointment');

        assert.equal($appointment.outerWidth(), 2, 'Min width is OK');
    });

})('Horizontal Strategy');
