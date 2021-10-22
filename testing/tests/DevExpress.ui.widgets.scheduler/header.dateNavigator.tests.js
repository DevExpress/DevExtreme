import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';
const { testStart, test, module } = QUnit;
import devices from 'core/devices';

testStart(() => initTestMarkup());

test('should has correct caption', function(assert) {
    const scheduler = createWrapper({
        views: ['week'],
        currentView: 'week',
        currentDate: new Date(2021, 4, 7),
    });

    assert.equal(scheduler.header.navigator.getText(), '2-8 May 2021');
});

test('should has correct caption(with firstDayOfWeek)', function(assert) {
    const scheduler = createWrapper({
        views: ['week'],
        currentView: 'week',
        firstDayOfWeek: 3,
        currentDate: new Date(2021, 4, 7),
    });

    assert.equal(scheduler.header.navigator.getText(), '5-11 May 2021');
});

test('should has correct caption(with intervalCount and startDate in view)', function(assert) {
    const scheduler = createWrapper({
        currentView: 'week',
        views: [{
            type: 'week',
            intervalCount: 3,
            startDate: new Date(2021, 4, 5),
        }],
        currentDate: new Date(2021, 4, 7),
    });

    assert.equal(scheduler.header.navigator.getText(), '2-22 May 2021');
});

test('should has correct caption(with agendaDuration)', function(assert) {
    const scheduler = createWrapper({
        currentView: 'agenda',
        views: [{
            type: 'agenda',
            agendaDuration: 4,
        }],
        firstDayOfWeek: 3,
        currentDate: new Date(2021, 4, 7),
    });

    assert.equal(scheduler.header.navigator.getText(), '7-10 May 2021');
});

test('should display correct caption after changing to day view if startDate is settled in views',
    function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2021, 6, 28),
            currentView: 'month',
            views: [
                'month',
                {
                    type: 'day',
                    intervalCount: 3,
                    startDate: new Date(2021, 6, 30),
                }
            ],
        });

        scheduler.option('currentView', 'day');

        const expectedCaption = devices.current().deviceType === 'desktop'
            ? '27-29 July 2021'
            : '27-29 Jul 2021';

        assert.equal(
            scheduler.header.navigator.caption.getText(),
            expectedCaption,
            'caption must take into account startDate'
        );
    }
);

test('should display correct caption after changing to month view if startDate is settled in views',
    function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2021, 6, 28),
            currentView: 'day',
            views: [
                'day',
                {
                    type: 'month',
                    intervalCount: 3,
                    startDate: new Date(2021, 5, 30),
                },
            ]
        });

        scheduler.option('currentView', 'month');

        assert.equal(
            scheduler.header.navigator.caption.getText(),
            'Jun-Aug 2021',
            'caption must take into account startDate'
        );
    }
);

test('should display correct caption after switching to the next week', function(assert) {
    const scheduler = createWrapper({
        currentDate: new Date(2021, 8, 22),
        views: [
            {
                type: 'workWeek',
                startDayHour: 10,
                endDayHour: 19
            }
        ],
        currentView: 'workWeek',
    });

    const navigator = scheduler.header.navigator;
    navigator.nextButton.click();

    assert.equal(
        navigator.caption.getText(),
        '27 Sep-1 Oct 2021',
        'caption correct'
    );
}
);

module('Option Changing', () => {
    test('should change caption text after changing "currentView"', function(assert) {
        const scheduler = createWrapper({
            views: ['day', 'week', 'month', 'agenda'],
            currentView: 'day',
            currentDate: new Date(2021, 4, 7),
        });

        const navigator = scheduler.header.navigator;

        assert.equal(navigator.getText(), '7 May 2021', 'Correct caption for day view');

        scheduler.option('currentView', 'week');
        assert.equal(navigator.getText(), '2-8 May 2021', 'Correct caption for week view');

        scheduler.option('currentView', 'month');
        assert.equal(navigator.getText(), 'May 2021', 'Correct caption for month view');

        scheduler.option('currentView', 'agenda');
        assert.equal(navigator.getText(), '7-13 May 2021', 'Correct caption for agenda view');
    });

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
        scheduler.option('currentDate', new Date(2021, 4, 4));
        assert.equal(scheduler.header.navigator.getText(), '4 May 2021', 'Caption is correct');
    });

    test('should update caption after changing "currentView"', function(assert) {
        const scheduler = createWrapper({
            views: ['month', 'day'],
            currentView: 'day',
            currentDate: new Date(2021, 4, 7),
        });
        scheduler.option('currentView', 'month');
        assert.equal(scheduler.header.navigator.getText(), 'May 2021', 'Caption is correct');
    });

    test('should update caption after changing "firstDayOfWeek"', function(assert) {
        const scheduler = createWrapper({
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2021, 4, 7),
        });
        scheduler.option('firstDayOfWeek', 4);
        assert.equal(scheduler.header.navigator.getText(), '6-12 May 2021', 'Caption is correct');
    });


    test('should update caption after changing "agendaDuration"', function(assert) {
        const scheduler = createWrapper({
            views: [{
                type: 'agenda',
                agendaDuration: 5,
            }],
            currentView: 'agenda',
            currentDate: new Date(2021, 4, 7),
        });
        assert.equal(scheduler.header.navigator.getText(), '7-11 May 2021', 'Caption is correct');
        scheduler.option('views', [{
            type: 'agenda',
            agendaDuration: 3,
        }]);
        assert.equal(scheduler.header.navigator.getText(), '7-9 May 2021', 'Caption is correct');
    });
});

module('Interface Interaction', () => {
    test('should disabled previous button depending on "min"', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2021, 6, 5),
            min: new Date(2021, 6, 4),
            views: ['day'],
            currentView: 'day',
            height: 600,
        });

        const navigator = scheduler.header.navigator;

        assert.equal(navigator.prevButton.isDisabled(), false, 'previous button is endabled');

        navigator.prevButton.click();

        assert.equal(navigator.prevButton.isDisabled(), true, 'previous button is disabled');

        navigator.nextButton.click();

        assert.equal(navigator.prevButton.isDisabled(), false, 'previous button is endabled');
    });

    test('should disabled next button depending on "max"', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2021, 6, 5),
            max: new Date(2021, 6, 6),
            views: ['day', 'week', 'month'],
            currentView: 'day',
            height: 600,
        });

        const navigator = scheduler.header.navigator;

        assert.equal(navigator.nextButton.isDisabled(), false, 'next button is endabled');

        navigator.nextButton.click();

        assert.equal(navigator.nextButton.isDisabled(), true, 'next button is disables');

        navigator.prevButton.click();

        assert.equal(navigator.nextButton.isDisabled(), false, 'next button is enabled');
    });
});
