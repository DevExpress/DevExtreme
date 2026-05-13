import $ from 'jquery';
import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';
const { testStart, test, module } = QUnit;
import themes from 'ui/themes';
import { getCaption } from '__internal/scheduler/header/utils';

testStart(() => initTestMarkup());

test('should have navigator and view switcher in basic configuration', async function(assert) {
    const scheduler = await createWrapper({
        views: ['day'],
        currentView: 'day',
    });

    assert.ok(scheduler.header.navigator, 'Navigator is in DOM');
    assert.ok(scheduler.header.viewSwitcher, 'View switcher is in DOM');
});

test('should have correct deafult views', async function(assert) {
    const scheduler = await createWrapper({ 'useDropDownViewSwitcher': false });

    assert.equal(
        scheduler.header.viewSwitcher.getText(),
        'DayWeek',
        'view switcher should have correct views'
    );
});

test('should rerender after useDropDownViewSwitcher option changes', async function(assert) {
    const scheduler = await createWrapper({
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

module('Material-based themes', {
    beforeEach: function() {
        this.origIsMaterialBased = themes.isMaterialBased;
        themes.isMaterialBased = function() { return true; };
    },
    afterEach: function() {
        themes.isMaterialBased = this.origIsMaterialBased;
    }
}, () => {
    test('should have navigator, viewSwitcher and dropDown viewSwitcher', async function(assert) {
        const scheduler = await createWrapper({
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
    test('should render default items with swapped positions', async function(assert) {
        const scheduler = await createWrapper({
            currentView: 'month',
            views: ['month'],
            toolbar: {
                items: [
                    { location: 'before', name: 'viewSwitcher' },
                    { location: 'after', name: 'dateNavigator' },
                ]
            },
        });

        const viewSwitcher = scheduler.header.viewSwitcher.getElement();
        const dateNavigator = scheduler.header.navigator.getElement();

        assert.equal(viewSwitcher.length, 1, 'viewSwitcher displayed');
        assert.equal(dateNavigator.length, 1, 'dateNavigator displayed');
    });

    test('should not display viewSwitcher and dateNavigator when visible is false', async function(assert) {
        const scheduler = await createWrapper({
            currentView: 'month',
            views: ['month'],
            toolbar: {
                visible: false,
                items: [
                    { location: 'before', name: 'viewSwitcher' },
                    { location: 'after', name: 'dateNavigator' },
                ]
            },
        });

        const viewSwitcherCount = scheduler.header.viewSwitcher.getElement().length;
        const dateNavigatorCount = scheduler.header.navigator.getElement().length;

        assert.equal(viewSwitcherCount, 0, 'viewSwitcher not displayed');
        assert.equal(dateNavigatorCount, 0, 'dateNavigator not displayed');
    });

    test('should not display viewSwitcher and dateNavigator', async function(assert) {
        const scheduler = await createWrapper({
            currentView: 'month',
            views: ['month'],
            toolbar: { items: [] },
        });

        const viewSwitcherCount = scheduler.header.viewSwitcher.getElement().length;
        const dateNavigatorCount = scheduler.header.navigator.getElement().length;

        assert.equal(viewSwitcherCount, 0, 'viewSwitcher not displayed');
        assert.equal(dateNavigatorCount, 0, 'dateNavigator not displayed');
    });

    test('should display custom today button', async function(assert) {
        const scheduler = await createWrapper({
            currentDate: new Date(2020, 6, 7),
            currentView: 'month',
            views: ['month'],
            toolbar: {
                items: [
                    { name: 'dateNavigator' },
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
                ]
            },
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
