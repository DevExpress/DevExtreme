import $ from 'jquery';
import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';
const { testStart, test, module } = QUnit;
import themes from 'ui/themes';
import 'ui/drop_down_button';

testStart(() => initTestMarkup());

test('Scheduler with basic toolbar configuration should has navigator and view switcher', function(assert) {
    createWrapper({
        views: ['day'],
        currentView: 'day',
    });

    assert.equal($('.dx-scheduler-navigator').length, 1, 'Navigator is in DOM');
    assert.equal($('.dx-scheduler-view-switcher').length, 1, 'View switcher is in DOM');
});

test('Toolbar should have correct deafult views', function(assert) {
    const scheduler = createWrapper();

    assert.equal(
        scheduler.header.viewSwitcher.getText(),
        'DayWeek',
        'view switcher should has correct views'
    );
});

test('Toolbar view switcher only one element is not selected(not in currentView)', function(assert) {
    const scheduler = createWrapper({
        views: ['month'],
    });

    assert.equal(
        scheduler.header.viewSwitcher.selected.getText(),
        '',
        'no one element is selected, because of view is day, that is not in views array'
    );
});

test('Toolbar view switcher only one element is selected(in currentView)', function(assert) {
    const scheduler = createWrapper({
        currentView: 'month',
        views: ['month'],
    });

    assert.equal(
        scheduler.header.viewSwitcher.selected.getText(),
        'Month',
        'single element should be selected'
    );
});

test('Toolbar should rerender after useDropDownViewSwitcher option changes', function(assert) {
    const scheduler = createWrapper({
        currentView: 'month',
        views: ['month'],
    });

    const headerInstance = scheduler.instance._header;

    const stub = sinon.stub(headerInstance, '_render');

    scheduler.option('useDropDownViewSwitcher', []);

    assert.ok(stub.calledOnce, 'Render method is called');
});

module('Option Changing', {}, () => {
    test('Date navigator buttons should be disabled depending on min & max values', function(assert) {
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


    module('Views', {}, () => {
        test('Views option should be passed to viewSwitcher', function(assert) {
            const scheduler = createWrapper({
                views: ['day', 'week', 'month'],
                currentView: 'day',
            });

            assert.equal(
                scheduler.header.viewSwitcher.getText(),
                'DayWeekMonth',
                'view switcher should has correct text'
            );
        });

        test('Views option with objects should be passed to viewSwitcher', function(assert) {
            const scheduler = createWrapper({
                views: ['day', 'week', 'month'],
                currentView: 'day',
            });

            scheduler.option('views', [
                {
                    type: 'week',
                    name: 'WEEK',
                }, {
                    type: 'day',
                    name: 'dAy',
                },
                {
                    type: 'timelineWeek',
                    name: 'TiMiLine',
                },
                {
                    type: 'week',
                },
                'workWeek'
            ]);

            assert.equal(
                scheduler.header.viewSwitcher.getText(),
                'WEEKdAyTiMiLineWeekWork Week',
                'view switcher should has correct text'
            );
        });

        test('Changing view option should change caption text', function(assert) {
            const scheduler = createWrapper({
                views: ['day', 'week', 'month', 'agenda'],
                currentView: 'day',
                currentDate: new Date(2021, 6, 7),
            });

            const navigator = scheduler.header.navigator;

            assert.equal(navigator.getText(), '7 July 2021', 'Correct caption for day view');

            scheduler.option('currentView', 'week');
            assert.equal(navigator.getText(), '4-10 July 2021', 'Correct caption for week view');

            scheduler.option('currentView', 'month');
            assert.equal(navigator.getText(), 'July 2021', 'Correct caption for month view');

            scheduler.option('currentView', 'agenda');
            assert.equal(navigator.getText(), '7-13 July 2021', 'Correct caption for agenda view');
        });

        test('Changing currentView and then views should apply selected view correctly', function(assert) {
            const scheduler = createWrapper({
                views: ['day', 'week'],
                currentView: 'day',
                currentDate: new Date(2021, 6, 7),
            });

            const viewSwitcher = scheduler.header.viewSwitcher;

            scheduler.option('currentView', 'month');

            assert.equal(viewSwitcher.selected.getText(), '', 'no one view is selected');

            scheduler.option('views', ['day', 'month']);


            assert.equal(viewSwitcher.selected.getText(), 'Month', 'selected view is correct');
        });
    });

    test('View switcher buttons should be selected after option change', function(assert) {
        const scheduler = createWrapper({
            views: [
                {
                    type: 'month'
                }, {
                    type: 'day',
                    name: 'TestDay'
                },
                'week',
            ],
            currentView: 'month',
        });

        const viewSwitcher = scheduler.header.viewSwitcher;

        assert.equal(viewSwitcher.selected.getText(), 'Month', 'current view is correct');

        scheduler.option('currentView', 'week');
        assert.equal(viewSwitcher.selected.getText(), 'Week', 'current view is correct');

        scheduler.option('currentView', 'TestDay');
        assert.equal(viewSwitcher.selected.getText(), 'TestDay', 'current view is correct');

        scheduler.option('currentView', 'Month');
        assert.equal(viewSwitcher.selected.getText(), 'Month', 'current view is correct');
    });

    test('currentView option should be saved when views changed', function(assert) {
        const scheduler = createWrapper({
            views: ['month', 'day'],
            currentView: 'day',
        });

        const viewSwitcher = scheduler.header.viewSwitcher;

        scheduler.option('views', ['month', 'week', 'day']);

        assert.equal(viewSwitcher.selected.getText(), 'Day', 'current view is Day');
    });


    test('viewSwitcher transform to dropDownButton after toggling "useDropDownViewSwitcher" option', function(assert) {
        const scheduler = createWrapper({
            views: ['month', 'day'],
            currentView: 'day',
        });

        const viewSwitcher = scheduler.header.viewSwitcher;

        assert.equal(viewSwitcher.getText(), 'MonthDay', 'before option changing displayed all views');

        scheduler.option('useDropDownViewSwitcher', true);

        assert.equal(viewSwitcher.getText(), 'Day', 'after option chaning displayed only dropDownButton label');
    });

    test('Date Navigator caption is correct after changing currentDate option', function(assert) {
        const scheduler = createWrapper({
            views: ['day'],
            currentView: 'day',
            currentDate: new Date(2020, 6, 7),
        });
        scheduler.option('currentDate', new Date(2021, 5, 4));
        assert.equal(scheduler.header.navigator.getText(), '4 June 2021', 'Caption is correct');
    });

    test('Date Navigator caption is correct after changing currentView option', function(assert) {
        const scheduler = createWrapper({
            views: ['month', 'day'],
            currentView: 'day',
            currentDate: new Date(2021, 6, 7),
        });
        scheduler.option('currentView', 'month');
        assert.equal(scheduler.header.navigator.getText(), 'July 2021', 'Caption is correct');
    });

    test('Date Navigator caption is correct after changing firstDayOfWeek option', function(assert) {
        const scheduler = createWrapper({
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2021, 6, 7),
        });
        scheduler.option('firstDayOfWeek', 4);
        assert.equal(scheduler.header.navigator.getText(), '1-7 July 2021', 'Caption is correct');
    });


    test('Date Navigator caption is correct after changing agendaDuration option', function(assert) {
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
    test('Date navigator buttons should be disabled depending on min & max values', function(assert) {
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

    test('View switcher buttons should be selected after click', function(assert) {
        const scheduler = createWrapper({
            views: [
                {
                    type: 'month',
                }, {
                    type: 'day',
                    name: 'TestDay',
                }, {
                    type: 'workWeek',
                    name: 'workWeek',
                },
                'week',
            ],
            currentView: 'month',
        });

        const viewSwitcher = scheduler.header.viewSwitcher;

        assert.equal(viewSwitcher.selected.getText(), 'Month', 'current view is correct');

        viewSwitcher.getButton('Week').click();
        assert.equal(viewSwitcher.selected.getText(), 'Week', 'current view is correct');

        viewSwitcher.getButton('workWeek').click();
        assert.equal(viewSwitcher.selected.getText(), 'workWeek', 'current view is correct');

        viewSwitcher.getButton('TestDay').click();
        assert.equal(viewSwitcher.selected.getText(), 'TestDay', 'current view is correct');

        viewSwitcher.getButton('Month').click();
        assert.equal(viewSwitcher.selected.getText(), 'Month', 'current view is correct');
    });

    test('Notify observer should be called after selecting view', function(assert) {
        const scheduler = createWrapper({
            currentView: 'day',
            views: ['day', 'week'],
            currentDate: new Date(2021, 6, 9),
        });

        const headerInstance = scheduler.instance._header;

        const stub = sinon.stub(headerInstance, 'notifyObserver').withArgs('currentViewUpdated');

        scheduler.header.viewSwitcher.getButton('Week').click();

        assert.ok(stub.calledOnce, 'Observer is notified');
        const args = stub.getCall(0).args;
        assert.equal(args[1], 'week', 'Arguments are OK');
    });

    test('Notify observer should be called after selecting new date', function(assert) {
        const scheduler = createWrapper({
            currentView: 'day',
            views: ['day', 'week'],
            currentDate: new Date(2021, 6, 9),
        });

        const headerInstance = scheduler.instance._header;

        const stub = sinon.stub(headerInstance, 'notifyObserver').withArgs('currentDateUpdated');

        scheduler.header.navigator.nextButton.click();

        assert.ok(stub.calledOnce, 'Observer is notified');
        const args = stub.getCall(0).args;
        assert.equal(args[1].toUTCString(), new Date(2021, 6, 10).toUTCString(), 'Arguments are OK');
    });
});

module('Meterial theme', {
    beforeEach: function() {
        this.origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        themes.isMaterial = this.origIsMaterial;
    }
}, () => {
    test('Scheduler with basic toolbar configuration should has navigator and drop down view switcher', function(assert) {
        createWrapper({
            views: ['day'],
            currentView: 'day',
        });

        assert.equal($('.dx-scheduler-navigator').length, 1, 'Navigator is in DOM');
        assert.equal($('.dx-scheduler-view-switcher').length, 1, 'View switcher is in DOM');
        assert.equal($('.dx-scheduler-view-switcher-dropdown-button').length, 1, 'Drop down button is in DOM');
    });
});


module('Navigator', {
    beforeEach: function() {
        this.origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        themes.isMaterial = this.origIsMaterial;
    }
}, () => {
    test('Navigator should has correct caption', function(assert) {
        const scheduler = createWrapper({
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2021, 6, 7),
        });

        assert.equal(scheduler.header.navigator.getText(), '4-10 July 2021');
    });


    test('Navigator should has correct caption(with firstDayOfWeek)', function(assert) {
        const scheduler = createWrapper({
            views: ['week'],
            currentView: 'week',
            firstDayOfWeek: 3,
            currentDate: new Date(2021, 6, 7),
        });

        assert.equal(scheduler.header.navigator.getText(), '7-13 July 2021');
    });

    test('Navigator should has correct caption(with intervalCount and startDate in view)', function(assert) {
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

    test('Navigator should has correct caption(with agendaDuration)', function(assert) {
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

    test('Toolbar dropdown button should have correct label', function(assert) {
        const scheduler = createWrapper({
            currentView: 'workWeek',
            views: ['workWeek'],
        });

        assert.equal(
            scheduler.header.viewSwitcher.getText(),
            'Work Week',
            'view switcher should has correct label'
        );
    });
});

module('Toolbar config', {}, () => {
    test('Toolbar should rerender after items configuration changes', function(assert) {
        const scheduler = createWrapper({
            currentView: 'month',
            views: ['month'],
        });

        const headerInstance = scheduler.instance._header;

        const stub = sinon.stub(headerInstance, '_render');

        scheduler.option('toolbar', []);

        assert.ok(stub.calledOnce, 'Render method is called');
    });
});
