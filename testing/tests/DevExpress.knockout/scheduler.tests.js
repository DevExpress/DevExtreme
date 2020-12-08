const $ = require('jquery');
const ko = require('knockout');

require('integration/knockout');
require('ui/scheduler');

require('common.css!');
require('generic_light.css!');

QUnit.test('Appointment should have right date format', function(assert) {
    const $element = $('<div data-bind=\'dxScheduler: {dataSource: schedulerDataSource, currentDate: new Date(2016, 6, 10)}\'></div>').appendTo('#qunit-fixture');
    const viewModel = {
        schedulerDataSource: [
            {
                text: 'Appointment 1',
                startDate: new Date(2016, 6, 10, 2),
                endDate: new Date(2016, 6, 10, 3)
            }
        ]
    };

    ko.applyBindings(viewModel, $element.get(0));

    const startDate = $element.dxScheduler('instance').option('dataSource')[0].startDate;
    const endDate = $element.dxScheduler('instance').option('dataSource')[0].endDate;

    assert.deepEqual(startDate, new Date(2016, 6, 10, 2));
    assert.deepEqual(endDate, new Date(2016, 6, 10, 3));
});

QUnit.test('Appointment template should be render once(T947938)', function(assert) {
    const markupText = `<div class='dx-viewport demo-container'>
        <div id='scheduler-demo'>
            <div data-bind='dxScheduler: schedulerOptions'></div>
        </div>
    </div>`;

    const $element = $(markupText).appendTo('#qunit-fixture');

    function PageViewModel() {
        this.schedulerOptions = {
            dataSource: [{
                text: ko.observable('Website Re-Design Plan'),
                startDate: ko.observable(new Date(2021, 4, 25, 1)),
                endDate: ko.observable(new Date(2021, 4, 25, 2))
            }],
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2021, 4, 25),
            height: 600
        };
    }

    ko.applyBindings(new PageViewModel(), $element.get(0));

    assert.equal($('.dx-scheduler-appointment-title').length, 1, 'title should be render once');
    assert.equal($('.dx-scheduler-appointment-content-details').length, 1, 'details should be render once');
});
