import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';
const { testStart, test, module } = QUnit;
import themes from 'ui/themes';
import devices from 'core/devices';
import 'ui/drop_down_button';

testStart(() => initTestMarkup());
if(devices.current().deviceType === 'desktop') {
    test('should pass the "views" option', function(assert) {
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

    module('Option Changing', {}, () => {
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

            assert.equal(
                scheduler.header.viewSwitcher.getText(),
                'WEEKdAyTiMiLineWeekWork Week',
                'view switcher should has correct text'
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

            assert.equal(viewSwitcher.selected.getText(), 'Month', 'current view is correct');

            scheduler.option('currentView', 'week');
            assert.equal(viewSwitcher.selected.getText(), 'Week', 'current view is correct');

            scheduler.option('currentView', 'TestDay');
            assert.equal(viewSwitcher.selected.getText(), 'TestDay', 'current view is correct');

            scheduler.option('currentView', 'Month');
            assert.equal(viewSwitcher.selected.getText(), 'Month', 'current view is correct');
        });

        test('should select view button after changing "currentView" and "views"', function(assert) {
            const scheduler = createWrapper({
                views: ['day', 'week'],
                currentView: 'day',
                currentDate: new Date(2021, 6, 7),
            });

            const viewSwitcher = scheduler.header.viewSwitcher;

            scheduler.option('currentView', 'month');

            assert.equal(viewSwitcher.selected.getText(), '', 'no one button is selected');

            scheduler.option('views', ['day', 'month']);


            assert.equal(viewSwitcher.selected.getText(), 'Month', 'Month button is selected');
        });

        test('should save selected view button when "views" changes', function(assert) {
            const scheduler = createWrapper({
                views: ['month', 'day'],
                currentView: 'day',
            });

            const viewSwitcher = scheduler.header.viewSwitcher;

            scheduler.option('views', ['month', 'week', 'day']);

            assert.equal(viewSwitcher.selected.getText(), 'Day', 'current view is Day');
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

    module('Interface Interaction', {}, () => {
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

            assert.equal(viewSwitcher.selected.getText(), 'Month', 'select Month view button');

            viewSwitcher.getButton('Week').click();
            assert.equal(viewSwitcher.selected.getText(), 'Week', 'select Week view button');

            viewSwitcher.getButton('workWeek').click();
            assert.equal(viewSwitcher.selected.getText(), 'workWeek', 'select workWeek view button');

            viewSwitcher.getButton('TestDay').click();
            assert.equal(viewSwitcher.selected.getText(), 'TestDay', 'select TestDay view button');

            viewSwitcher.getButton('Month').click();
            assert.equal(viewSwitcher.selected.getText(), 'Month', 'select Month view button');
        });
    });

    module('Selected view', {}, () => {
        test('should be no buttons selected if the "currentView" is not set', function(assert) {
            const scheduler = createWrapper({
                views: ['month'],
            });

            assert.equal(
                scheduler.header.viewSwitcher.selected.getText(),
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
                scheduler.header.viewSwitcher.selected.getText(),
                '',
                'no one element is selected'
            );
        });

        test('should be the selected buttons if "currentView" in views', function(assert) {
            const scheduler = createWrapper({
                currentView: 'month',
                views: ['month'],
            });

            assert.equal(
                scheduler.header.viewSwitcher.selected.getText(),
                'Month',
                'currentView button is selected'
            );
        });
    });
}

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
    test('dropdown button should has correct label', function(assert) {
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
