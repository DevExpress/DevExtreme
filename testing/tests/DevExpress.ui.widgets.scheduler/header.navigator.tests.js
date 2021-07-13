import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';
const { testStart, test, module } = QUnit;
import 'ui/drop_down_button';

testStart(() => initTestMarkup());

test('should has correct caption', function(assert) {
    const scheduler = createWrapper({
        views: ['week'],
        currentView: 'week',
        currentDate: new Date(2021, 6, 7),
    });

    assert.equal(scheduler.header.navigator.getText(), '4-10 July 2021');
});

test('should has correct caption(with firstDayOfWeek)', function(assert) {
    const scheduler = createWrapper({
        views: ['week'],
        currentView: 'week',
        firstDayOfWeek: 3,
        currentDate: new Date(2021, 6, 7),
    });

    assert.equal(scheduler.header.navigator.getText(), '7-13 July 2021');
});

test('should has correct caption(with intervalCount and startDate in view)', function(assert) {
    const scheduler = createWrapper({
        currentView: 'week',
        views: [{
            type: 'week',
            intervalCount: 3,
            startDate: new Date(2021, 6, 5),
        }],
        currentDate: new Date(2021, 6, 7),
    });

    assert.equal(scheduler.header.navigator.getText(), '4-24 July 2021');
});

test('should has correct caption(with agendaDuration)', function(assert) {
    const scheduler = createWrapper({
        currentView: 'agenda',
        views: [{
            type: 'agenda',
            agendaDuration: 4,
        }],
        firstDayOfWeek: 3,
        currentDate: new Date(2021, 6, 7),
    });

    assert.equal(scheduler.header.navigator.getText(), '7-10 July 2021');
});

module('Option Changing', {}, () => {
    test('should toggle previous and next buttons depending on "min" & "max"', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2021, 6, 5),
            min: new Date(2021, 6, 4),
            max: new Date(2021, 6, 6),
            views: ['day', 'week', 'month'],
            currentView: 'day',
        });

        const navigator = scheduler.header.navigator;

        assert.equal(navigator.prevButton.isDisabled(), false, 'previous button endabled');
        assert.equal(navigator.nextButton.isDisabled(), false, 'next button endabled');

        scheduler.option('currentDate', new Date(2021, 6, 4));

        assert.equal(navigator.prevButton.isDisabled(), true, 'previous button disabled');
        assert.equal(navigator.nextButton.isDisabled(), false, 'next button endabled');

        scheduler.option('currentDate', new Date(2021, 6, 6));

        assert.equal(navigator.prevButton.isDisabled(), false, 'previous button endabled');
        assert.equal(navigator.nextButton.isDisabled(), true, 'next button disabled');
    });

    test('should update caption after changing "currentDate"', function(assert) {
        const scheduler = createWrapper({
            views: ['day'],
            currentView: 'day',
            currentDate: new Date(2020, 6, 7),
        });
        scheduler.option('currentDate', new Date(2021, 5, 4));
        assert.equal(scheduler.header.navigator.getText(), '4 June 2021', 'Caption is correct');
    });

    test('should update caption after changing "currentView"', function(assert) {
        const scheduler = createWrapper({
            views: ['month', 'day'],
            currentView: 'day',
            currentDate: new Date(2021, 6, 7),
        });
        scheduler.option('currentView', 'month');
        assert.equal(scheduler.header.navigator.getText(), 'July 2021', 'Caption is correct');
    });

    test('should update caption after changing "firstDayOfWeek"', function(assert) {
        const scheduler = createWrapper({
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2021, 6, 7),
        });
        scheduler.option('firstDayOfWeek', 4);
        assert.equal(scheduler.header.navigator.getText(), '1-7 July 2021', 'Caption is correct');
    });


    test('should update caption after changing "agendaDuration"', function(assert) {
        const scheduler = createWrapper({
            views: [{
                type: 'agenda',
                agendaDuration: 5,
            }],
            currentView: 'agemda',
            currentDate: new Date(2021, 6, 7),
        });
        assert.equal(scheduler.header.navigator.getText(), '7-11 July 2021', 'Caption is correct');
        scheduler.option('views', [{
            type: 'agenda',
            agendaDuration: 3,
        }]);
        assert.equal(scheduler.header.navigator.getText(), '7-9 July 2021', 'Caption is correct');
    });
});

module('Interface Interaction', {}, () => {
    test('should disabled previous and next buttons depending on "min" & "max"', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2021, 6, 5),
            min: new Date(2021, 6, 4),
            max: new Date(2021, 6, 6),
            views: ['day', 'week', 'month'],
            currentView: 'day',
            height: 600,
        });

        const navigator = scheduler.header.navigator;

        assert.equal(navigator.prevButton.isDisabled(), false, 'previous button endabled');
        assert.equal(navigator.nextButton.isDisabled(), false, 'next button endabled');

        navigator.prevButton.click();

        assert.equal(navigator.prevButton.isDisabled(), true, 'previous button disabled');
        assert.equal(navigator.nextButton.isDisabled(), false, 'next button endabled');

        navigator.nextButton.click();
        navigator.nextButton.click();

        assert.equal(navigator.prevButton.isDisabled(), false, 'previous button endabled');
        assert.equal(navigator.nextButton.isDisabled(), true, 'next button disabled');
    });
});
