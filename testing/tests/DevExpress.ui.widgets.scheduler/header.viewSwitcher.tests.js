import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';
const { testStart, test, module } = QUnit;
import themes from 'ui/themes';
import devices from 'core/devices';

testStart(() => initTestMarkup());
if(devices.current().deviceType === 'desktop') {
    test('should pass the "views" option', function(assert) {
        const scheduler = createWrapper({
            views: ['day', 'week', 'month'],
            currentView: 'day',
        });

        const viewSwitcher = scheduler.header.viewSwitcher;

        assert.equal(
            viewSwitcher.getButton('Day').getElement().length, 1,
            'Day button displayed'
        );
        assert.equal(
            viewSwitcher.getButton('Week').getElement().length, 1,
            'Week button displayed'
        );
        assert.equal(
            viewSwitcher.getButton('Month').getElement().length, 1,
            'Month button displayed'
        );
    });

    module('Option Changing', () => {
        test('should pass the "views" option', function(assert) {
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

            const viewSwitcher = scheduler.header.viewSwitcher;

            assert.equal(
                viewSwitcher.getButton('WEEK').getElement().length, 1,
                '"WEEK" button has correct name'
            );
            assert.equal(
                viewSwitcher.getButton('dAy').getElement().length, 1,
                '"dAy" button has correct name'
            );
            assert.equal(
                viewSwitcher.getButton('TiMiLine').getElement().length, 1,
                '"TiMiLine" button has correct name'
            );
            assert.equal(
                viewSwitcher.getButton('Work Week').getElement().length, 1,
                '"Work Week" button has correct name'
            );
        });

        test('should select view button after changing "currentView"', function(assert) {
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

            assert.equal(viewSwitcher.selectedButton.getText(), 'Month', 'current view is correct');

            scheduler.option('currentView', 'week');
            assert.equal(viewSwitcher.selectedButton.getText(), 'Week', 'current view is correct');

            scheduler.option('currentView', 'TestDay');
            assert.equal(viewSwitcher.selectedButton.getText(), 'TestDay', 'current view is correct');

            scheduler.option('currentView', 'month');
            assert.equal(viewSwitcher.selectedButton.getText(), 'Month', 'current view is correct');
        });

        test('should select view button after changing "currentView" and "views"', function(assert) {
            const scheduler = createWrapper({
                views: ['day', 'week'],
                currentView: 'day',
                currentDate: new Date(2021, 6, 7),
            });

            const viewSwitcher = scheduler.header.viewSwitcher;

            scheduler.option('currentView', 'month');

            assert.equal(viewSwitcher.selectedButton.getText(), '', 'no one button is selected');

            scheduler.option('views', ['day', 'month']);


            assert.equal(viewSwitcher.selectedButton.getText(), 'Month', 'Month button is selected');
        });

        test('should save selected view button when "views" changes', function(assert) {
            const scheduler = createWrapper({
                views: ['month', 'day'],
                currentView: 'day',
            });

            const viewSwitcher = scheduler.header.viewSwitcher;

            scheduler.option('views', ['month', 'week', 'day']);

            assert.equal(viewSwitcher.selectedButton.getText(), 'Day', 'current view is Day');
        });

        test('should render dropDownButton after enabling "useDropDownViewSwitcher"', function(assert) {
            const scheduler = createWrapper({
                views: ['month', 'day'],
                currentView: 'day',
            });

            const viewSwitcher = scheduler.header.viewSwitcher;

            assert.equal(viewSwitcher.getText(), 'MonthDay', 'before option changing displayed all views');

            scheduler.option('useDropDownViewSwitcher', true);

            assert.equal(viewSwitcher.getText(), 'Day', 'after option chaning displayed only dropDownButton label');
        });
    });

    module('Selected view', () => {
        test('should be no buttons selected if the "currentView" is not set', function(assert) {
            const scheduler = createWrapper({
                views: ['month'],
            });

            assert.equal(
                scheduler.header.viewSwitcher.selectedButton.getText(),
                '',
                'no one element is selected'
            );
        });

        test('should be no buttons selected if the "currentView" is not in views', function(assert) {
            const scheduler = createWrapper({
                views: ['month'],
                currentView: 'day',
            });

            assert.equal(
                scheduler.header.viewSwitcher.selectedButton.getText(),
                '',
                'no one element is selected'
            );
        });

        test('should be the selected button if "currentView" in views', function(assert) {
            const scheduler = createWrapper({
                currentView: 'month',
                views: ['month'],
            });

            assert.equal(
                scheduler.header.viewSwitcher.selectedButton.getText(),
                'Month',
                'currentView button is selected'
            );
        });

        test('should select view button after click', function(assert) {
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

            assert.equal(viewSwitcher.selectedButton.getText(), 'Month', 'Month view button is selected');

            viewSwitcher.getButton('Week').click();
            assert.equal(viewSwitcher.selectedButton.getText(), 'Week', 'Week view button is selected');

            viewSwitcher.getButton('workWeek').click();
            assert.equal(viewSwitcher.selectedButton.getText(), 'workWeek', 'workWeek view button is selected');

            viewSwitcher.getButton('TestDay').click();
            assert.equal(viewSwitcher.selectedButton.getText(), 'TestDay', 'TestDay view button is selected');

            viewSwitcher.getButton('Month').click();
            assert.equal(viewSwitcher.selectedButton.getText(), 'Month', 'Month view button is selected');
        });
    });
}

module('Meterial theme', {
    beforeEach: function() {
        this.origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };
    },
    afterEach: function() {
        themes.isMaterial = this.origIsMaterial;
    }
}, () => {
    test('dropdown button should have correct label', function(assert) {
        const scheduler = createWrapper({
            currentView: 'workWeek',
            views: ['workWeek'],
        });

        assert.equal(
            scheduler.header.viewSwitcher.getText(),
            'Work Week',
            'view switcher should have correct label'
        );
    });
});
