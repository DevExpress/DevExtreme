/* eslint-disable no-console */

require('../../helpers/qunitPerformanceExtension.js');

require('common.css!');
require('generic_light.css!');

var $ = require('jquery'),
    resizeCallbacks = require('core/utils/resize_callbacks'),
    data = [
        { startDate: new Date(2016, 2, 9, 1), endDate: new Date(2016, 2, 9, 2), text: 'Meeting' },
        { startDate: new Date(2016, 2, 9, 3), endDate: new Date(2016, 2, 9, 4), text: 'Go to a shop' },
        { startDate: new Date(2016, 2, 9, 4, 30), endDate: new Date(2016, 2, 9, 5), text: 'The TV show' },
        { startDate: new Date(2016, 2, 9, 5), endDate: new Date(2016, 2, 9, 5, 30), text: 'Read a book' },
        { startDate: new Date(2016, 2, 9, 9), endDate: new Date(2016, 2, 9, 10), text: 'Play a guitar' }
    ];

require('ui/scheduler');

QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id="element"></div>');
});

QUnit.performanceTest('dxScheduler should force minimum relayout count on creation', function(assert) {
    var measureFunction = function() {
        $('#element').dxScheduler({
            showCurrentTimeIndicator: false,
            showAllDayPanel: false
        });
    };

    assert.measureStyleRecalculation(measureFunction, 7);
});

QUnit.performanceTest('dxScheduler should force minimum relayout count on creation if showAllDayPanel = true', function(assert) {
    var measureFunction = function() {
        $('#element').dxScheduler({
            showCurrentTimeIndicator: false,
            showAllDayPanel: true
        });
    };

    assert.measureStyleRecalculation(measureFunction, 8);
});

QUnit.performanceTest('dxScheduler day view should force minimum relayout count on creation with appointments', function(assert) {
    var measureFunction = function() {
        console.timeStamp('Scheduler');
        $('#element').dxScheduler({
            views: ['day'],
            currentView: 'day',
            currentDate: new Date(2016, 2, 9),
            dataSource: data,
            showCurrentTimeIndicator: false,
            showAllDayPanel: false
        });
    };

    assert.measureStyleRecalculation(measureFunction, 8);
});

QUnit.performanceTest('dxScheduler day view should force minimum relayout count on creation with appointments if showAllDayPanel = true', function(assert) {
    var measureFunction = function() {
        console.timeStamp('Scheduler');
        $('#element').dxScheduler({
            views: ['day'],
            currentView: 'day',
            currentDate: new Date(2016, 2, 9),
            dataSource: data,
            showCurrentTimeIndicator: false,
            showAllDayPanel: true
        });
    };

    assert.measureStyleRecalculation(measureFunction, 14);
});

QUnit.performanceTest('dxScheduler week view should force minimum relayout count on creation with appointments', function(assert) {
    var measureFunction = function() {
        console.timeStamp('Scheduler');
        $('#element').dxScheduler({
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2016, 2, 9),
            dataSource: data,
            showCurrentTimeIndicator: false,
            showAllDayPanel: false
        });
    };

    assert.measureStyleRecalculation(measureFunction, 8);
});

QUnit.performanceTest('dxScheduler week view should force minimum relayout count on creation with appointments if showAllDayPanel = true', function(assert) {
    var measureFunction = function() {
        console.timeStamp('Scheduler');
        $('#element').dxScheduler({
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2016, 2, 9),
            dataSource: data,
            showCurrentTimeIndicator: false,
            showAllDayPanel: true
        });
    };

    assert.measureStyleRecalculation(measureFunction, 14);
});

QUnit.performanceTest('dxScheduler workWeek view should force minimum relayout count on creation with appointments', function(assert) {
    var measureFunction = function() {
        console.timeStamp('Scheduler');
        $('#element').dxScheduler({
            views: ['workWeek'],
            currentView: 'workWeek',
            currentDate: new Date(2016, 2, 9),
            dataSource: data,
            showCurrentTimeIndicator: false,
            showAllDayPanel: false
        });
    };

    assert.measureStyleRecalculation(measureFunction, 8);
});

QUnit.performanceTest('dxScheduler workWeek view should force minimum relayout count on creation with appointments if showAllDayPanel = true', function(assert) {
    var measureFunction = function() {
        console.timeStamp('Scheduler');
        $('#element').dxScheduler({
            views: ['workWeek'],
            currentView: 'workWeek',
            currentDate: new Date(2016, 2, 9),
            dataSource: data,
            showCurrentTimeIndicator: false,
            showAllDayPanel: true
        });
    };

    assert.measureStyleRecalculation(measureFunction, 14);
});

QUnit.performanceTest('dxScheduler month view should force minimum relayout count on creation with appointments', function(assert) {
    var measureFunction = function() {
        console.timeStamp('Scheduler');
        $('#element').dxScheduler({
            views: ['month'],
            currentView: 'month',
            currentDate: new Date(2016, 2, 9),
            dataSource: data,
            height: 900,
            showCurrentTimeIndicator: false
        });
    };

    assert.measureStyleRecalculation(measureFunction, 8);
});

QUnit.performanceTest('dxScheduler timelineDay view should force minimum relayout count on creation with appointments', function(assert) {
    var measureFunction = function() {
        console.timeStamp('Scheduler');
        $('#element').dxScheduler({
            views: ['timelineDay'],
            currentView: 'timelineDay',
            maxAppointmentsPerCell: null,
            currentDate: new Date(2016, 2, 9),
            dataSource: data,
            showCurrentTimeIndicator: false
        });
    };

    assert.measureStyleRecalculation(measureFunction, 14);
});

QUnit.performanceTest('dxScheduler timelineWeek view should force minimum relayout count on creation with appointments', function(assert) {
    var measureFunction = function() {
        console.timeStamp('Scheduler');
        $('#element').dxScheduler({
            views: ['timelineWeek'],
            currentView: 'timelineWeek',
            maxAppointmentsPerCell: null,
            currentDate: new Date(2016, 2, 9),
            dataSource: data,
            showCurrentTimeIndicator: false
        });
    };

    assert.measureStyleRecalculation(measureFunction, 14);
});

QUnit.performanceTest('dxScheduler timelineWorkWeek view should force minimum relayout count on creation with appointments', function(assert) {
    var measureFunction = function() {
        console.timeStamp('Scheduler');
        $('#element').dxScheduler({
            views: ['timelineWorkWeek'],
            currentView: 'timelineWorkWeek',
            maxAppointmentsPerCell: null,
            currentDate: new Date(2016, 2, 9),
            dataSource: data,
            showCurrentTimeIndicator: false
        });
    };

    assert.measureStyleRecalculation(measureFunction, 14);
});

QUnit.performanceTest('dxScheduler timelineMonth view should force minimum relayout count on creation with appointments', function(assert) {
    var measureFunction = function() {
        console.timeStamp('Scheduler');
        $('#element').dxScheduler({
            views: ['timelineMonth'],
            currentView: 'timelineMonth',
            maxAppointmentsPerCell: null,
            currentDate: new Date(2016, 2, 9),
            dataSource: data,
            showCurrentTimeIndicator: false
        });
    };

    assert.measureStyleRecalculation(measureFunction, 14);
});

QUnit.performanceTest('dxScheduler agenda view should force minimum relayout count on creation with appointments', function(assert) {
    var measureFunction = function() {
        console.timeStamp('Scheduler');
        $('#element').dxScheduler({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 2, 9),
            dataSource: data,
            showCurrentTimeIndicator: false
        });
    };

    assert.measureStyleRecalculation(measureFunction, 10);
});

QUnit.performanceTest('dxScheduler should not force relayout on dxshown event', function(assert) {
    $('#element').dxScheduler({
        showCurrentTimeIndicator: false
    });

    var measureFunction = function() {
        resizeCallbacks.fire();
    };

    assert.measureStyleRecalculation(measureFunction, 2);
});
