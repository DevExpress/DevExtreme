var $ = require('jquery'),
    ko = require('knockout');

require('integration/knockout');
require('ui/scheduler');

require('common.css!');
require('generic_light.css!');

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
