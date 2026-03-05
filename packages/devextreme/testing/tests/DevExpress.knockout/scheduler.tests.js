const $ = require('jquery');
const ko = require('knockout');

require('integration/knockout');
const Scheduler = require('ui/scheduler');
const { waitAsync } = require('../../helpers/scheduler/waitForAsync.js');

require('fluent_blue_light.css!');

if(QUnit.urlParams['nocsp']) {
    QUnit.module('scheduler');
} else {
    QUnit.module.skip('scheduler');
}

const isRenovatedScheduler = !!Scheduler.IS_RENOVATED_WIDGET;

QUnit.test('Appointment should have right date format', async function(assert) {
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
    await waitAsync(0);

    const startDate = $element.dxScheduler('instance').option('dataSource')[0].startDate;
    const endDate = $element.dxScheduler('instance').option('dataSource')[0].endDate;

    assert.deepEqual(startDate, new Date(2016, 6, 10, 2));
    assert.deepEqual(endDate, new Date(2016, 6, 10, 3));
});

QUnit[isRenovatedScheduler ? 'skip' : 'test']('Appointment template should be render once(T947938)', async function(assert) {
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
    await waitAsync(0);

    assert.equal($('.dx-scheduler-appointment-title').length, 1, 'title should be render once');
    assert.equal($('.dx-scheduler-appointment-content-details').length, 1, 'details should be render once');
});

QUnit[isRenovatedScheduler ? 'skip' : 'test']('Appointment DnD with disabled property (T1046067)', async function(assert) {
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
                endDate: ko.observable(new Date(2021, 4, 25, 2)),
                disabled: ko.observable(true),
            }],
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2021, 4, 25),
            height: 600
        };
    }

    ko.applyBindings(new PageViewModel(), $element.get(0));
    await waitAsync(0);

    assert.equal($('.dx-scheduler-appointment-title').length, 1, 'title should be render once');
    assert.equal($('.dx-scheduler-appointment-content-details').length, 1, 'details should be render once');
});

QUnit.test('T1282055: appointment collector renders correct', async function(assert) {
    const markupText = `<div class='dx-viewport demo-container'>
        <div id='scheduler-demo'>
            <div data-bind='dxScheduler: schedulerOptions'></div>
        </div>
    </div>`;

    const $element = $(markupText).appendTo('#qunit-fixture');

    function PageViewModel() {
        this.schedulerOptions = {
            dataSource: [
                {
                    text: 'Website Re-Design Plan',
                    startDate: ko.observable('2021-06-01T16:30:00.000Z'),
                    endDate: ko.observable('2021-06-01T18:30:00.000Z')
                },
                {
                    text: 'Install New Router in Dev Room',
                    startDate: ko.observable('2021-06-01T16:30:00.000Z'),
                    endDate: ko.observable('2021-06-01T18:30:00.000Z')
                },
                {
                    text: 'Install New Router in Dev Room',
                    startDate: ko.observable('2021-06-01T16:30:00.000Z'),
                    endDate: ko.observable('2021-06-01T18:30:00.000Z')
                },
                {
                    text: 'Install New Router in Dev Room',
                    startDate: ko.observable('2021-06-01T16:30:00.000Z'),
                    endDate: ko.observable('2021-06-01T18:30:00.000Z')
                }
            ],
            views: ['month'],
            currentView: 'month',
            currentDate: new Date('2021-06-01T16:30:00'),
        };
    }

    ko.applyBindings(new PageViewModel(), $element.get(0));
    await waitAsync(0);

    assert.equal($('.dx-scheduler-appointment-collector').length, 1, 'appointment collector has rendered');
    assert.equal(
        $('.dx-scheduler-appointment-collector').attr('aria-roledescription'),
        'June 1, 2021',
        'appointment collector has correct a11y description'
    );
});
