import $ from 'jquery';
import ko from 'knockout';

import 'integration/knockout';
import 'ui/scheduler';

import 'common.css!';
import 'generic_light.css!';

QUnit.test('Appointment should have right date format', function(assert) {
    var $element = $('<div data-bind=\'dxScheduler: {dataSource: schedulerDataSource, currentDate: new Date(2016, 6, 10)}\'></div>').appendTo('#qunit-fixture'),
        viewModel = {
            schedulerDataSource: [
                {
                    text: 'Appointment 1',
                    startDate: new Date(2016, 6, 10, 2),
                    endDate: new Date(2016, 6, 10, 3)
                }
            ]
        };

    ko.applyBindings(viewModel, $element.get(0));

    var startDate = $element.dxScheduler('instance').option('dataSource')[0].startDate,
        endDate = $element.dxScheduler('instance').option('dataSource')[0].endDate;

    assert.deepEqual(startDate, new Date(2016, 6, 10, 2));
    assert.deepEqual(endDate, new Date(2016, 6, 10, 3));
});

QUnit.test('Appointment must render template with correct $context', function(assert) {
    const data = [
        {
            text: 'Website Re-Design Plan',
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30),
            recurrenceRule: 'FREQ=DAILY;COUNT=3',
        }
    ];
    let $element = $('<div data-bind=\'dxScheduler: schedulerOptions\'><div data-options="dxTemplate: { name: \'calendar-event-template\' }">'
    + '<div class=\'assert-class\' data-bind="text: $root.assert()">Context function not working</div>'
    + '<div><i class=\'dx-icon dx-icon-trash template-icon\'></i></div>'
    + '</div></div>').appendTo('#qunit-fixture'),
        viewModel = {
            schedulerOptions: {
                dataSource: data,
                views: ['week', 'month'],
                currentView: 'month',
                currentDate: new Date(2017, 4, 25),
                startDayHour: 9,
                height: 600,
                appointmentTemplate: 'calendar-event-template',
                onInitialized: function(e) { this.instance = e.component; }
            },
            assert: function() {
                return 'Assert function is called';
            }
        };

    ko.applyBindings(viewModel, $element.get(0));

    let trashIcons = $element.find('.dx-icon.dx-icon-trash.template-icon');

    assert.equal(trashIcons.length, 3, 'Template has trash icons');

    let isContextFunctionCalled = $element.find('.assert-class').eq(1).text() === viewModel.assert();

    assert.ok(isContextFunctionCalled, 'Context function is called');
});
