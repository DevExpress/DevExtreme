import $ from 'jquery';
import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';
const { testStart, test, module } = QUnit;
import themes from 'ui/themes';
import { getCaption } from 'ui/scheduler/header/utils';

testStart(() => initTestMarkup());

test('should have navigator and view switcher in basic configuration', function(assert) {
    const scheduler = createWrapper({
        views: ['day'],
        currentView: 'day',
    });

    assert.ok(scheduler.header.navigator, 'Navigator is in DOM');
    assert.ok(scheduler.header.viewSwitcher, 'View switcher is in DOM');
});

test('should have correct deafult views', function(assert) {
    const scheduler = createWrapper({ 'useDropDownViewSwitcher': false });

    assert.equal(
        scheduler.header.viewSwitcher.getText(),
        'DayWeek',
        'view switcher should have correct views'
    );
});

test('should rerender after useDropDownViewSwitcher option changes', function(assert) {
    const scheduler = createWrapper({
        currentView: 'month',
        views: ['day', 'month'],
    });

    scheduler.option('useDropDownViewSwitcher', true);

    assert.equal(
        scheduler.header.viewSwitcher.getText(),
        'Month',
        'Drop down view switcher displayed'
    );
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
    test('should have navigator, viewSwitcher and dropDown viewSwitcher', function(assert) {
        const scheduler = createWrapper({
            views: ['day'],
            currentView: 'day',
        });

        const navigatorCount = scheduler.header.navigator.getElement().length;
        const viewSwitcherCount = scheduler.header.viewSwitcher.getElement().length;
        const dropDownButtonCount = scheduler.header.viewSwitcher.dropDownButton.getElement().length;

        assert.equal(navigatorCount, 1, 'Navigator is in DOM');
        assert.equal(viewSwitcherCount, 1, 'View switcher is in DOM');
        assert.equal(dropDownButtonCount, 1, 'Drop down button is in DOM');
    });
});

module('Toolbar config', () => {
    test('should rerender after items configuration changes', function(assert) {
        const scheduler = createWrapper({
            currentView: 'month',
            views: ['month'],
        });

        const headerInstance = scheduler.instance._header;

        const stub = sinon.stub(headerInstance, '_render');

        scheduler.option('toolbar', []);

        assert.ok(stub.calledOnce, 'Render method is called');
    });

    test('should render default items with swapped positions', function(assert) {
        const scheduler = createWrapper({
            currentView: 'month',
            views: ['month'],
            toolbar: [
                {
                    location: 'before',
                    defaultElement: 'viewSwitcher',
                },
                {
                    location: 'after',
                    defaultElement: 'dateNavigator',
                }
            ],
        });

        const viewSwitcher = scheduler.header.viewSwitcher.getElement();
        const dateNavigator = scheduler.header.navigator.getElement();

        assert.equal(viewSwitcher.length, 1, 'viewSwitcher disaplayed');
        assert.equal(dateNavigator.length, 1, 'dateNavigator disaplayed');
    });

    test('should not display viewSwitcher and dateNavigator', function(assert) {
        const scheduler = createWrapper({
            currentView: 'month',
            views: ['month'],
            toolbar: [],
        });

        const viewSwitcherCount = scheduler.header.viewSwitcher.getElement().length;
        const dateNavigatorCount = scheduler.header.navigator.getElement().length;

        assert.equal(viewSwitcherCount, 0, 'viewSwitcher not disaplayed');
        assert.equal(dateNavigatorCount, 0, 'dateNavigator not disaplayed');
    });

    test('should display custom today button', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2020, 6, 7),
            currentView: 'month',
            views: ['month'],
            toolbar: [
                {
                    defaultElement: 'dateNavigator',
                },
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        text: 'Today',
                        elementAttr: {
                            class: 'today-button'
                        },
                        onClick: function() {
                            scheduler.option('currentDate', new Date());
                        },
                    },
                }
            ],
        });

        const todayButton = $('.today-button');
        todayButton.trigger('dxclick');

        const captionOptions = {
            startDate: new Date(),
            endDate: new Date(),
            step: 'month',
            date: new Date(),
            firstDayOfWeek: 0,
            intervalCount: 1,
        };
        const todayCaption = getCaption(captionOptions);

        assert.equal(scheduler.header.navigator.getText(), todayCaption.text, 'Current date is changed');
    });
});
