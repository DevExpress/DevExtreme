import $ from 'jquery';
import { camelize } from 'core/utils/inflector';
import translator from 'animation/translator';
import dateUtils from 'core/utils/date';
import dateSerialization from 'core/utils/date_serialization';
import { noop } from 'core/utils/common';
import swipeEvents from 'events/swipe';
import fx from 'animation/fx';
import Views from 'ui/calendar/ui.calendar.views';
import Calendar from 'ui/calendar';
import pointerMock from '../../helpers/pointerMock.js';
import keyboardMock from '../../helpers/keyboardMock.js';
import config from 'core/config';
import browser from 'core/utils/browser';
import dataUtils from 'core/element_data';
import dateLocalization from 'localization/date';

import 'common.css!';
import 'generic_light.css!';

// calendar
const CALENDAR_BODY_CLASS = 'dx-calendar-body';
const CALENDAR_CELL_CLASS = 'dx-calendar-cell';
const CALENDAR_DISABLED_NAVIGATOR_LINK_CLASS = 'dx-calendar-disabled-navigator-link';
const CALENDAR_NAVIGATOR_NEXT_MONTH_CLASS = 'dx-calendar-navigator-next-month';
const CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS = 'dx-calendar-navigator-previous-view';
const CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS = 'dx-calendar-navigator-next-view';
const CALENDAR_TODAY_BUTTON_CLASS = 'dx-calendar-today-button';
const CALENDAR_CAPTION_BUTTON_CLASS = 'dx-calendar-caption-button';
const CALENDAR_OTHER_VIEW_CLASS = 'dx-calendar-other-view';
const CALENDAR_VIEWS_WRAPPER_CLASS = 'dx-calendar-views-wrapper';

// calendar view
const CALENDAR_SELECTED_DATE_CLASS = 'dx-calendar-selected-date';
const CALENDAR_CONTOURED_DATE_CLASS = 'dx-calendar-contoured-date';

const CALENDAR_DATE_VALUE_KEY = 'dxDateValueKey';

const VIEW_ANIMATION_DURATION = 350;

const ACTIVE_STATE_CLASS = 'dx-state-active';

const ENTER_KEY_CODE = 'Enter';
const PAGE_UP_KEY_CODE = 'PageUp';
const PAGE_DOWN_KEY_CODE = 'PageDown';
const END_KEY_CODE = 'End';
const HOME_KEY_CODE = 'Home';
const LEFT_ARROW_KEY_CODE = 'ArrowLeft';
const UP_ARROW_KEY_CODE = 'ArrowUp';
const RIGHT_ARROW_KEY_CODE = 'ArrowRight';
const DOWN_ARROW_KEY_CODE = 'ArrowDown';

const getShortDate = (date) => {
    return dateSerialization.serializeDate(date, dateUtils.getShortDateFormat());
};

const getBeforeViewInstance = (calendar) => {
    return calendar._beforeView;
};
const getCurrentViewInstance = (calendar) => {
    return calendar._view;
};
const getAfterViewInstance = (calendar) => {
    return calendar._afterView;
};

const toSelector = (className) => {
    return '.' + className;
};

const iterateViews = (callback) => {
    const views = ['month', 'year', 'decade', 'century'];
    $.each(views, callback);
};

function triggerKeydown($element, key, ctrl) {
    const options = { key: key };

    if(ctrl) {
        options.ctrlKey = ctrl;
    }

    const e = $.Event('keydown', options);
    $element.trigger(e);
}

QUnit.module('Hidden input', {
    beforeEach: function() {
        fx.off = true;

        this.$element = $('<div>').appendTo('body');
        this.calendar = this.$element.dxCalendar({
            value: new Date(2013, 9, 15)
        }).dxCalendar('instance');

        this.stringValue = (value) => {
            return dateSerialization.serializeDate(value, 'yyyy-MM-dd');
        };
    },
    afterEach: function() {
        fx.off = false;
        this.$element.remove();
    }
}, () => {
    QUnit.test('Calendar should pass value to the hidden input on widget value change', function(assert) {
        const $input = this.$element.find('input');

        const date = new Date(2016, 6, 9);
        this.calendar.option('value', date);
        assert.equal($input.val(), this.stringValue(date), 'input value is correct after widget value change');
    });
});


QUnit.module('Navigator', {
    beforeEach: function() {
        fx.off = true;
        this.$element = $('<div>').appendTo('body');
        this.calendar = this.$element.dxCalendar({
            value: new Date(2015, 5, 13)
        }).dxCalendar('instance');
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('Navigator links must prevent default click browser action', function(assert) {
        const $window = $(window);
        const brick = $('<div style=\'height:50000px;\'></div>');
        const immediateClick = (element) => {
            const event = document.createEvent('MouseEvent');

            event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            element.dispatchEvent(event);
        };
        let actualScrollTop;
        try {
            brick.appendTo('body');
            brick.insertBefore(this.$element);
            $window.scrollTop(50000);
            actualScrollTop = $window.scrollTop();
            if(actualScrollTop > 0) {
                immediateClick(this.$element.find(toSelector(CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS))[0]);
                assert.ok($window.scrollTop() >= actualScrollTop);
            } else {
                assert.ok(true, 'scrollTop does not work on older Android browsers, and so this test will not work');
            }
        } finally {
            brick.remove();
        }
    });

    QUnit.test('Calendar must display the current month and year', function(assert) {
        const navigatorCaption = this.$element.find(toSelector(CALENDAR_CAPTION_BUTTON_CLASS));
        assert.equal(navigatorCaption.text(), 'June 2015');
    });
});


QUnit.module('Navigator integration', {
    beforeEach: function() {
        fx.off = true;
        this.$element = $('<div>').appendTo('body');
        this.calendar = this.$element.dxCalendar({
            value: new Date(2015, 5, 13)
        }).dxCalendar('instance');

        this.$navigatorCaption = this.$element.find(toSelector(CALENDAR_CAPTION_BUTTON_CLASS));
        this.$navigatorNext = this.$element.find(toSelector(CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS));
        this.$navigatorPrev = this.$element.find(toSelector(CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS));

        this.reinit = (options) => {
            this.$element.remove();
            this.$element = $('<div>').appendTo('body');
            this.calendar = this.$element.dxCalendar(options).dxCalendar('instance');

            this.$navigatorCaption = this.$element.find(toSelector(CALENDAR_CAPTION_BUTTON_CLASS));
            this.$navigatorNext = this.$element.find(toSelector(CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS));
            this.$navigatorPrev = this.$element.find(toSelector(CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS));
        };
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {

    QUnit.test('calendar must change the current date when navigating to previous and next view', function(assert) {
        const calendar = this.calendar;
        const $navigatorPrev = this.$navigatorPrev;
        const $navigatorNext = this.$navigatorNext;

        $.each(['month', 'year', 'decade', 'century'], (_, type) => {
            calendar.option('zoomLevel', type);

            const startDate = calendar.option('currentDate');
            $($navigatorPrev).trigger('dxclick');
            assert.ok(calendar.option('currentDate') < startDate, 'current date more then start date');

            $($navigatorNext.trigger('dxclick')).trigger('dxclick');
            assert.ok(calendar.option('currentDate') > startDate, 'current date less then start date');
        });
    });

    QUnit.test('calendar must change the current date when navigating to previous and next view in RTL mode', function(assert) {
        this.reinit({
            rtlEnabled: true
        });

        const calendar = this.calendar;
        const $navigatorPrev = this.$navigatorPrev;
        const $navigatorNext = this.$navigatorNext;

        $.each(['month', 'year', 'decade', 'century'], (_, type) => {
            calendar.option('zoomLevel', type);

            const startDate = calendar.option('currentDate');
            $($navigatorPrev).trigger('dxclick');
            assert.ok(calendar.option('currentDate') > startDate, 'current date more then start date');

            $($navigatorNext.trigger('dxclick')).trigger('dxclick');
            assert.ok(calendar.option('currentDate') < startDate, 'current date less then start date');
        });
    });

    // TODO: get rid of mocking private method
    QUnit.test('when option.disabled = true, navigator links should do nothing', function(assert) {
        this.reinit({
            disabled: true
        });
        this.calendar._navigate = () => {
            assert.ok(false);
        };

        assert.expect(0);
        $(this.$navigatorPrev).trigger('dxclick');
        $(this.$navigatorNext).trigger('dxclick');
    });

    QUnit.test('Navigator caption should be changed after click on prev/next month button', function(assert) {
        this.reinit({
            value: new Date(2015, 4, 15)
        });

        $(this.$navigatorNext).trigger('dxclick');

        const newText = this.$navigatorCaption.text();
        assert.equal(newText, 'July 2015', 'correct navigation caption');
    });

    QUnit.test('Navigator caption should be changed after click on prev/next month button in RTL', function(assert) {
        this.reinit({
            value: new Date(2015, 4, 15),
            rtlEnabled: true
        });

        $(this.$navigatorNext).trigger('dxclick');

        const newText = this.$navigatorCaption.text();
        assert.equal(newText, 'March 2015', 'correct navigation caption');
    });

    QUnit.test('navigator caption should be changed after the \'value\' option change', function(assert) {
        this.reinit({
            value: new Date(2015, 5, 9)
        });

        const $navigatorCaption = this.$navigatorCaption;
        const instance = this.calendar;

        assert.equal($navigatorCaption.text(), 'June 2015', 'navigator caption is correct');

        instance.option('value', new Date(2015, 6, 15));
        assert.equal($navigatorCaption.text(), 'July 2015', 'navigator caption is correct');
    });

    QUnit.test('navigator caption should be changed after the \'currentDate\' option change', function(assert) {
        this.reinit({
            value: new Date(2015, 5, 9),
            currentDate: new Date(2015, 5, 1)
        });

        const $navigatorCaption = this.$navigatorCaption;
        const calendar = this.calendar;

        assert.equal($navigatorCaption.text(), 'June 2015', 'navigator caption is correct');

        calendar.option('currentDate', new Date(2015, 6, 15));
        assert.equal($navigatorCaption.text(), 'July 2015', 'navigator caption is correct');
    });

    QUnit.test('navigator caption should be changed during swipe', function(assert) {
        const $element = this.$element;
        const $navigatorCaption = this.$navigatorCaption;

        assert.equal($navigatorCaption.text(), 'June 2015', 'start caption');

        const pointer = pointerMock($element).start().swipe(-0.6);
        assert.equal($navigatorCaption.text(), 'July 2015', 'navigator caption is changed to next month');

        pointer.swipe(0.2);
        assert.equal($navigatorCaption.text(), 'June 2015', 'navigator caption is changed to current month');

        pointer.swipe(1.6);
        assert.equal($navigatorCaption.text(), 'May 2015', 'navigator caption is changed to previous month');
    });

    QUnit.test('navigator caption should be changed correctly during swipe in RTL (not reverted)', function(assert) {
        this.reinit({
            rtlEnabled: true,
            value: new Date(2015, 5, 13)
        });

        const $element = this.$element;
        const $navigatorCaption = this.$navigatorCaption;

        assert.equal($navigatorCaption.text(), 'June 2015', 'start caption');

        const pointer = pointerMock($element).start().swipe(-0.6);
        assert.equal($navigatorCaption.text(), 'May 2015', 'navigator caption is changed to previous month');

        pointer.swipe(1.6);
        assert.equal($navigatorCaption.text(), 'July 2015', 'navigator caption is changed to next month');
    });

    QUnit.test('navigator should be disabled after min/max option changed', function(assert) {
        this.reinit({
            value: new Date(2015, 3, 14)
        });

        const $element = this.$element;
        const instance = $element.dxCalendar('instance');

        instance.option({
            max: new Date(2015, 3, 25),
            min: new Date(2015, 3, 4)
        });

        const nextButton = this.$navigatorNext.dxButton('instance');
        const prevButton = this.$navigatorPrev.dxButton('instance');

        assert.equal(nextButton.option('disabled'), true, 'next button is disabled');
        assert.equal(prevButton.option('disabled'), true, 'prev button is disabled');
    });

    QUnit.test('navigator caption should be updated after \'zoomLevel\' option change', function(assert) {
        this.calendar.option('zoomLevel', 'year');
        assert.equal(this.$navigatorCaption.text(), '2015', 'navigator caption is correct');
    });

    QUnit.test('click on caption button should change \'zoomLevel\'', function(assert) {
        const calendar = this.calendar;
        const $navigatorCaption = this.$navigatorCaption;

        $.each(['year', 'decade', 'century'], (_, type) => {
            $($navigatorCaption).trigger('dxclick');
            assert.equal(calendar.option('zoomLevel'), type, 'type view matches zoomLevel type');
        });
    });

    QUnit.test('view change buttons should have feedback', function(assert) {
        const prevChangeMonthButton = this.$navigatorPrev;
        const nextChangeMonthButton = this.$navigatorNext;
        const prevMouse = pointerMock(prevChangeMonthButton).start();

        prevMouse.active();
        assert.ok($(prevChangeMonthButton).hasClass(ACTIVE_STATE_CLASS));

        prevMouse.inactive();
        assert.ok(!$(prevChangeMonthButton).hasClass(ACTIVE_STATE_CLASS));

        const nextMouse = pointerMock(nextChangeMonthButton).start();

        nextMouse.active();
        assert.ok($(nextChangeMonthButton).hasClass(ACTIVE_STATE_CLASS));

        nextMouse.inactive();
        assert.ok(!$(nextChangeMonthButton).hasClass(ACTIVE_STATE_CLASS));
    });

    QUnit.test('view change buttons should be disabled if min/max has been reached', function(assert) {
        this.reinit({
            value: new Date(2015, 8, 6),
            min: new Date(2015, 7, 1),
            max: new Date(2015, 9, 28)
        });

        assert.ok(!this.$navigatorPrev.hasClass(CALENDAR_DISABLED_NAVIGATOR_LINK_CLASS));
        assert.ok(!this.$navigatorNext.hasClass(CALENDAR_DISABLED_NAVIGATOR_LINK_CLASS));

        $(this.$navigatorPrev).trigger('dxclick');
        assert.ok(this.$navigatorPrev.hasClass(CALENDAR_DISABLED_NAVIGATOR_LINK_CLASS));

        $(this.$navigatorNext).trigger('dxclick');
        $(this.$navigatorNext).trigger('dxclick');
        assert.ok(this.$navigatorNext.hasClass(CALENDAR_DISABLED_NAVIGATOR_LINK_CLASS));
    });

    QUnit.test('view change buttons should be disabled if min/max has been reached in RTL mode', function(assert) {
        this.reinit({
            rtlEnabled: true,
            value: new Date(2015, 8, 6),
            min: new Date(2015, 7, 1),
            max: new Date(2015, 9, 28)
        });

        assert.ok(!this.$navigatorPrev.hasClass(CALENDAR_DISABLED_NAVIGATOR_LINK_CLASS));
        assert.ok(!this.$navigatorNext.hasClass(CALENDAR_DISABLED_NAVIGATOR_LINK_CLASS));

        $(this.$navigatorPrev).trigger('dxclick');
        assert.ok(this.$navigatorPrev.hasClass(CALENDAR_DISABLED_NAVIGATOR_LINK_CLASS));

        $(this.$navigatorNext).trigger('dxclick');
        $(this.$navigatorNext).trigger('dxclick');
        assert.ok(this.$navigatorNext.hasClass(CALENDAR_DISABLED_NAVIGATOR_LINK_CLASS));
    });

    QUnit.test('navigator caption is correct after fast right short swipe', function(assert) {
        const currentDate = new Date(this.calendar.option('currentDate'));
        currentDate.setMonth(currentDate.getMonth() - 1);

        const pointer = pointerMock(this.$element).start();
        pointer.down().move(10).up();

        const navigatorText = this.$navigatorCaption.text();
        const expectedText = 'May 2015';

        assert.equal(navigatorText, expectedText, 'navigator caption is correct');
    });

    QUnit.test('navigator caption is correct after fast left short swipe', function(assert) {
        const currentDate = new Date(this.calendar.option('currentDate'));
        currentDate.setMonth(currentDate.getMonth() + 1);

        const pointer = pointerMock(this.$element).start();
        pointer.down().move(-10).up();

        const navigatorText = this.$navigatorCaption.text();
        const expectedText = 'July 2015';

        assert.equal(navigatorText, expectedText, 'navigator caption is correct');
    });

    QUnit.test('navigator buttons should displays correctly on short min/max range', function(assert) {
        this.reinit({
            min: new Date(1522454400000),
            max: new Date(1523923200000),
            value: new Date(1522454400000)
        });

        assert.notOk(this.$navigatorNext.hasClass(CALENDAR_DISABLED_NAVIGATOR_LINK_CLASS), 'The next navigator button is enabled');
        assert.ok(this.$navigatorPrev.hasClass(CALENDAR_DISABLED_NAVIGATOR_LINK_CLASS), 'The prev navigator button is disabled');
    });
});


QUnit.module('Views initial positions', {
    beforeEach: function() {
        this.$element = $('<div>').appendTo('body');
        this.instance = this.$element.dxCalendar().dxCalendar('instance');

        this.reinit = (options) => {
            this.$element.remove();
            this.$element = $('<div>').appendTo('body');
            this.instance = this.$element.dxCalendar(options).dxCalendar('instance');
        };
    },

    afterEach: function() {
        this.$element.remove();
    }
}, () => {
    QUnit.test('calendar views animation end position should be correct after width is changed', function(assert) {
        this.reinit({
            width: 400
        });

        const $navigatorNext = this.$element.find(toSelector(CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS));
        $($navigatorNext).trigger('dxclick');

        const animateSpy = sinon.spy(fx, 'animate');

        try {
            this.instance.option('width', this.$element.width() - 100);
            $($navigatorNext).trigger('dxclick');

            const expectedOffset = -this.$element.width();
            assert.equal(animateSpy.args[0][1].to.left, expectedOffset, 'animation end position is correct');
        } finally {
            fx.animate.restore();
        }
    });

    QUnit.test('calendar views position', function(assert) {
        const $view = $(getCurrentViewInstance(this.instance).$element());
        const viewWidth = $view.width();

        assert.equal($view.position().left, 0, 'main view is at 0');
        assert.equal(getBeforeViewInstance(this.instance).$element().position().left, -viewWidth, 'main view is at the left');
        assert.equal(getAfterViewInstance(this.instance).$element().position().left, viewWidth, 'main view is at the right');
    });

    QUnit.test('calendar views position in RTL', function(assert) {
        if('chrome' in window && browser.msie) {
            // Chrome DevTools device emulation
            assert.ok(true, 'This test is not relevant for chrome dev tools device emulation');
            return;
        }

        this.reinit({ rtlEnabled: true });

        const $view = $(getCurrentViewInstance(this.instance).$element());
        const viewWidth = $view.width();

        assert.equal($view.position().left, 0, 'main view is at 0');
        assert.equal(getBeforeViewInstance(this.instance).$element().position().left, viewWidth, 'main view is at the left');
        assert.equal(getAfterViewInstance(this.instance).$element().position().left, -viewWidth, 'main view is at the right');
    });
});


QUnit.module('Views integration', {
    beforeEach: function() {
        fx.off = true;
        this.$element = $('<div>').appendTo('body');
        this.calendar = this.$element.dxCalendar({
            value: new Date(2015, 5, 13),
            focusStateEnabled: true
        }).dxCalendar('instance');

        this.reinit = (options) => {
            this.$element.remove();
            this.$element = $('<div>').appendTo('body');
            this.calendar = this.$element.dxCalendar(options).dxCalendar('instance');
        };
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('calendar should instantiate views with proper LTR-RTL mode', function(assert) {
        this.reinit({
            rtlEnabled: true
        });
        assert.ok(getCurrentViewInstance(this.calendar).option('rtl'));
    });

    QUnit.test('calendar must pass disabled to the created views', function(assert) {
        this.reinit({
            disabled: true
        });
        assert.deepEqual(getCurrentViewInstance(this.calendar).option('disabled'), true);
    });

    QUnit.test('calendar must render correct view depending on current zoom level', function(assert) {
        const calendar = this.calendar;

        $.each(['month', 'year', 'decade', 'century'], (_, type) => {
            calendar.option('zoomLevel', type);
            assert.equal(calendar.option('zoomLevel'), type);
            assert.ok(getCurrentViewInstance(calendar) instanceof Views[type]);
        });
    });

    QUnit.test('view option \'value\' should depend on calendar option \'value\'', function(assert) {
        const calendar = this.calendar;
        let value = new Date(2015, 5, 15);

        calendar.option('value', new Date(value));
        assert.deepEqual(getCurrentViewInstance(calendar).option('value'), value, 'view option \'value\' is set correctly');

        value = new Date(2015, 5, 7);
        calendar.option('value', new Date(value));
        assert.deepEqual(getCurrentViewInstance(calendar).option('value'), value, 'view option \'value\' is changed correctly');
    });

    QUnit.test('changing calendar \'value\' option to the date of different view should change current view', function(assert) {
        const calendar = this.calendar;
        const oldMonthView = getCurrentViewInstance(calendar);
        const newDate = new Date(2015, 8, 11);
        const testNewDate = new Date(newDate);

        calendar.option('value', newDate);
        const newMonthView = getCurrentViewInstance(calendar);

        assert.notEqual(newMonthView, oldMonthView);
        assert.deepEqual(newMonthView.option('value'), testNewDate);
        assert.deepEqual(newMonthView.option('date'), newMonthView.option('value'));
    });

    QUnit.test('T277747 - only one selected cell may be present among all rendered views', function(assert) {
        const $element = this.$element;

        this.calendar.option('value', new Date(2013, 9, 15));
        $($element.find(toSelector(CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS))).trigger('dxclick');
        $($element.find('td[data-value=\'2013/11/13\']')).trigger('dxclick');

        assert.equal($element.find(toSelector(CALENDAR_SELECTED_DATE_CLASS)).length, 1, 'there is only one selected cell');
    });

    QUnit.test('views should not be rerendered after other month cell click', function(assert) {
        const calendar = this.calendar;

        calendar.option('value', new Date(2015, 9, 1));

        const $currentView = $(getCurrentViewInstance(calendar).$element());
        const afterViewBeforeClick = getAfterViewInstance(calendar);

        $($currentView.find('td[data-value=\'2015/11/06\']')).trigger('dxclick');

        const currentViewAfterClick = getCurrentViewInstance(calendar);
        assert.strictEqual(afterViewBeforeClick, currentViewAfterClick, 'after view should become a current view after click on other month date cell');
    });

    QUnit.test('selected value should be rendered correctly on views with different maxZoomLevel', function(assert) {
        const $element = this.$element;
        const calendar = this.calendar;

        calendar.option('value', new Date(calendar.option('currentDate')));

        $.each(['month', 'year', 'decade', 'century'], (_, type) => {
            calendar.option('maxZoomLevel', type);

            const $selectedCell = $element.find(toSelector(CALENDAR_SELECTED_DATE_CLASS));

            assert.equal($selectedCell.length, 1, 'there is a selected cell');
            assert.equal($selectedCell.get(0), getCurrentViewInstance(calendar)._getCellByDate(calendar.option('value')).get(0), 'correct cell is selected');
        });
    });

    QUnit.test('click on cell should have UI feedback', function(assert) {
        this.reinit({
            firstDayOfWeek: 0,
            value: new Date(2013, 8, 9)
        });

        const $dayElement = this.$element.find(toSelector(CALENDAR_CELL_CLASS)).first();
        const pointer = pointerMock($dayElement).start();

        pointer.active(this.$element);
        assert.ok($dayElement.hasClass(ACTIVE_STATE_CLASS));

        pointer.inactive(this.$element);
        assert.ok(!$dayElement.hasClass(ACTIVE_STATE_CLASS));
    });

    QUnit.test('click on view cell changes calendar value', function(assert) {
        this.reinit({
            zoomLevel: 'month',
            value: new Date(2015, 2, 15)
        });

        const $element = this.$element;
        const calendar = this.calendar;

        $.each(['month', 'year', 'decade', 'century'], (_, type) => {
            calendar.option('maxZoomLevel', type);

            const $cell = $element.find(toSelector(CALENDAR_CELL_CLASS)).eq(5);
            const cellDate = dataUtils.data($cell.get(0), CALENDAR_DATE_VALUE_KEY);

            $($cell).trigger('dxclick');
            assert.ok($cell, 'cell has selected class');
            assert.deepEqual(calendar.option('value'), cellDate, 'calendar value is correct');
        });
    });

    QUnit.test('view contouredDate should sync with calendar currentDate', function(assert) {
        this.reinit({
            value: new Date(2015, 2, 15),
            focusStateEnabled: true
        });

        const $element = this.$element;
        const calendar = this.calendar;

        $.each(['month', 'year', 'decade', 'century'], (_, type) => {
            calendar.option('zoomLevel', type);

            $($element).trigger('focusin');

            const keyboard = keyboardMock($element);
            keyboard.press('right');

            assert.deepEqual(getCurrentViewInstance('contouredDate'), calendar.option('contouredDate'), 'contouredDate is equal currentDate');
        });
    });

    QUnit.test('view contouredDate should be set on calendar focusin and should be removed on focusout', function(assert) {
        const view = getCurrentViewInstance(this.calendar);

        assert.equal(view.option('contouredDate'), null, 'no currentDate is passed to view on calendar init');

        $(this.$element).trigger('focusin');
        assert.deepEqual(view.option('contouredDate'), this.calendar.option('currentDate'), 'view contouredDate is set on focusin');

        $(this.$element).trigger('focusout');
        assert.equal(view.option('contouredDate'), null, 'view contouredDate is set to null on focusout');
    });

    QUnit.test('contouredDate should not be passed to view if widget is not in focus', function(assert) {
        this.calendar.option('value', new Date(2013, 5, 16));
        assert.equal(getCurrentViewInstance(this.calendar).option('contouredDate'), null, 'view contouredDate is null');
    });
});


QUnit.module('Keyboard navigation', {
    beforeEach: function() {
        fx.off = true;

        this.$element = $('<div>').appendTo('body');
        this.value = new Date(2013, 9, 13);

        this.calendar = this.$element.dxCalendar({
            focusStateEnabled: true,
            value: this.value
        }).dxCalendar('instance');

        this.clock = sinon.useFakeTimers();

        this.reinit = (options) => {
            this.$element.remove();
            this.$element = $('<div>').appendTo('body');
            this.calendar = this.$element.dxCalendar(options).dxCalendar('instance');
        };
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.test('rootElement must have a tabindex of 0 by default', function(assert) {
        assert.equal(this.$element.attr('tabindex'), 0);
    });

    QUnit.test('The main table must not have tabindex by default', function(assert) {
        this.reinit();
        assert.ok(!this.$element.find('table').attr('tabindex'));
    });

    QUnit.test('click must not focus the main table if it does have tabindex', function(assert) {
        this.reinit();

        const $cell = $(getCurrentViewInstance(this.calendar).$element().find('table').find('td')[0]);
        assert.ok(!this.$element.find('table').attr('tabindex'));

        $cell.click();
        assert.notStrictEqual(document.activeElement, this.$element.find('table')[0]);
    });

    QUnit.test('left/right key press should change currentDate correctly', function(assert) {
        const params = {
            'month': { startDate: new Date(2013, 9, 13), movedDate: new Date(2013, 9, 14) },
            'year': { startDate: new Date(2013, 9, 13), movedDate: new Date(2013, 10, 13) },
            'decade': { startDate: new Date(2013, 9, 13), movedDate: new Date(2014, 9, 13) },
            'century': { startDate: new Date(2013, 9, 13), movedDate: new Date(2023, 9, 13) },
        };

        const keyboard = keyboardMock(this.$element);
        const calendar = this.calendar;

        iterateViews((_, type) => {
            calendar.option('zoomLevel', type);

            keyboard.press('right');
            assert.deepEqual(calendar.option('currentDate'), params[type].movedDate, 'currentDate is correct');

            keyboard.press('left');
            assert.deepEqual(calendar.option('currentDate'), params[type].startDate, 'currentDate is correct');
        });
    });

    QUnit.test('left/right key press should change currentDate correctly in RTL', function(assert) {
        this.reinit({
            value: new Date(2023, 9, 13),
            focusStateEnabled: true,
            rtlEnabled: true
        });

        const params = {
            'month': { startDate: new Date(2023, 9, 13), movedDate: new Date(2023, 9, 12) },
            'year': { startDate: new Date(2023, 9, 13), movedDate: new Date(2023, 8, 13) },
            'decade': { startDate: new Date(2023, 9, 13), movedDate: new Date(2022, 9, 13) },
            'century': { startDate: new Date(2023, 9, 13), movedDate: new Date(2013, 9, 13) },
        };

        const keyboard = keyboardMock(this.$element);
        const calendar = this.calendar;

        iterateViews((_, type) => {
            calendar.option('zoomLevel', type);

            keyboard.press('right');
            assert.deepEqual(calendar.option('currentDate'), params[type].movedDate, 'currentDate is correct');

            keyboard.press('left');
            assert.deepEqual(calendar.option('currentDate'), params[type].startDate, 'currentDate is correct');
        });
    });

    QUnit.test('up/down key press should change currentDate correctly', function(assert) {
        const expectedDates = {
            'month': new Date(2055, 6, 15),
            'year': new Date(2055, 2, 22),
            'decade': new Date(2051, 6, 22),
            'century': new Date(2015, 6, 22)
        };
        const origDate = new Date(2055, 6, 22);

        iterateViews($.proxy((_, type) => {
            this.reinit({
                maxZoomLevel: type,
                value: origDate,
                focusStateEnabled: true
            });

            const keyboard = keyboardMock(this.$element);

            keyboard.press('up');
            assert.deepEqual(this.calendar.option('currentDate'), expectedDates[type], 'current date is correct');

            keyboard.press('down');
            assert.deepEqual(this.calendar.option('currentDate'), origDate, 'current date is correct');
        }, this));
    });

    QUnit.test('pressing enter should change value', function(assert) {
        const calendar = this.calendar;
        const keyboard = keyboardMock(this.$element);

        iterateViews((_, type) => {
            calendar.option({
                maxZoomLevel: type,
                value: null
            });

            keyboard.press('enter');
            assert.deepEqual(calendar.option('value'), calendar.option('currentDate'), 'value is changed');
        });
    });

    QUnit.test('Event should be passed to the valueChanged action after selecting a cell via the keyboard', function(assert) {
        const keyboard = keyboardMock(this.$element);
        const valueChangedHandler = sinon.stub();

        this.calendar.option({
            onValueChanged: valueChangedHandler,
            value: null
        });

        keyboard.press('enter');

        const params = valueChangedHandler.getCall(1).args[0];
        assert.ok(params.event, 'Event should be passed');
        assert.ok(params.component, 'Component should be passed');
        assert.ok(params.element, 'Element should be passed');
    });

    QUnit.test('pressing ctrl+arrows or pageup/pagedown keys must change view correctly', function(assert) {
        const $element = this.$element;
        const calendar = this.calendar;

        const expectedDates = {
            'month': [new Date(2013, 8, 13), new Date(2013, 9, 13)],
            'year': [new Date(2012, 9, 13), new Date(2013, 9, 13)],
            'decade': [new Date(2003, 9, 13), new Date(2013, 9, 13)],
            'century': [new Date(1913, 9, 13), new Date(2013, 9, 13)]
        };

        const clock = this.clock;

        iterateViews((_, type) => {
            calendar.option('zoomLevel', type);

            clock.tick();
            triggerKeydown($element, LEFT_ARROW_KEY_CODE, true);
            assert.deepEqual(calendar.option('currentDate'), expectedDates[type][0], 'ctrl+left arrow navigates correctly');

            clock.tick();
            triggerKeydown($element, RIGHT_ARROW_KEY_CODE, true);
            assert.deepEqual(calendar.option('currentDate'), expectedDates[type][1], 'ctrl+right arrow navigates correctly');

            clock.tick();
            triggerKeydown($element, PAGE_UP_KEY_CODE);
            assert.deepEqual(calendar.option('currentDate'), expectedDates[type][0], 'pageup navigates correctly');

            clock.tick();
            triggerKeydown($element, PAGE_DOWN_KEY_CODE);
            assert.deepEqual(calendar.option('currentDate'), expectedDates[type][1], 'pagedown navigates correctly');
        });
    });

    QUnit.test('pressing pageup/pagedown keys must change view correctly when rtlEnabled is true', function(assert) {
        const $element = this.$element;
        const calendar = this.calendar;
        calendar.option('rtlEnabled', true);

        const expectedDates = {
            'month': [new Date(2013, 8, 13), new Date(2013, 9, 13)],
            'year': [new Date(2012, 9, 13), new Date(2013, 9, 13)],
            'decade': [new Date(2003, 9, 13), new Date(2013, 9, 13)],
            'century': [new Date(1913, 9, 13), new Date(2013, 9, 13)]
        };

        const clock = this.clock;

        iterateViews((_, type) => {
            calendar.option('zoomLevel', type);

            clock.tick();
            triggerKeydown($element, PAGE_UP_KEY_CODE);
            assert.deepEqual(calendar.option('currentDate'), expectedDates[type][0], 'pageUp navigates correctly');

            clock.tick();
            triggerKeydown($element, PAGE_DOWN_KEY_CODE);
            assert.deepEqual(calendar.option('currentDate'), expectedDates[type][1], 'pageDown navigates correctly');
        });
    });

    QUnit.test('pressing ctrl+arrows must navigate in inverse direction in RTL mode', function(assert) {
        this.reinit({
            value: this.value,
            firstDayOfWeek: 1,
            rtlEnabled: true,
            focusStateEnabled: true
        });

        const $element = this.$element;

        triggerKeydown($element, LEFT_ARROW_KEY_CODE, true);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2013, 10, this.value.getDate()), 'ctrl+left arrow navigates correctly');

        this.clock.tick();
        triggerKeydown($element, RIGHT_ARROW_KEY_CODE, true);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2013, 9, this.value.getDate()), 'ctrl+right arrow navigates correctly');
    });

    QUnit.test('correct currentDate change after navigating on other view cell by keyboard', function(assert) {
        this.reinit({
            value: new Date(2015, 2, 1),
            zoomLevel: 'month',
            focusStateEnabled: true
        });

        const $element = this.$element;
        const calendar = this.calendar;

        $element.trigger('focusin');

        calendar.option('currentDate', dateUtils.getLastMonthDate(calendar.option('currentDate')));
        triggerKeydown($element, RIGHT_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2015, 3, 1), 'month changed correctly');

        calendar.option('zoomLevel', 'year');
        calendar.option('currentDate', new Date(2015, 11, 1));
        triggerKeydown($element, RIGHT_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2016, 0, 1), 'year changed correctly');

        calendar.option('zoomLevel', 'decade');
        calendar.option('currentDate', new Date(2019, 0, 1));
        triggerKeydown($element, RIGHT_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2020, 0, 1), 'decade changed correctly');

        calendar.option('zoomLevel', 'century');
        calendar.option('currentDate', new Date(2090, 0, 1));
        triggerKeydown($element, RIGHT_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2100, 0, 1), 'century changed correctly');
    });

    QUnit.test('view changing should be correct after keyboard navigation from boundary cell', function(assert) {
        this.reinit({
            value: new Date(2015, 8, 10),
            min: new Date(2015, 7, 20),
            max: new Date(2015, 9, 10),
            focusStateEnabled: true
        });

        const calendar = this.calendar;
        const keyboard = keyboardMock(this.$element);

        calendar.option('value', new Date(2015, 8, 1));

        keyboard.press('left');
        assert.ok(dateUtils.sameMonth(getCurrentViewInstance(calendar).option('date'), new Date(2015, 7, 1)), 'view is changed');

        calendar.option('value', new Date(2015, 8, 30));

        keyboard.press('right');
        assert.ok(dateUtils.sameMonth(getCurrentViewInstance(calendar).option('date'), new Date(2015, 9, 1)), 'view is changed');
    });

    QUnit.test('pressing ctrl+up/down arrow keys must call navigateUp/navigateDown', function(assert) {
        this.reinit({
            value: new Date(2013, 11, 15),
            zoomLevel: 'month',
            focusStateEnabled: true
        });

        const $element = this.$element;
        const calendar = this.calendar;

        $.each(['year', 'decade', 'century'], (_, type) => {
            triggerKeydown($element, UP_ARROW_KEY_CODE, true);
            assert.equal(calendar.option('zoomLevel'), type, 'type view matches zoomLevel type');
        });

        $.each(['decade', 'year', 'month'], (_, type) => {
            triggerKeydown($element, DOWN_ARROW_KEY_CODE, true);
            assert.equal(calendar.option('zoomLevel'), type, 'type view matches zoomLevel type');
        });
    });

    QUnit.test('Pressing home/end keys must contour first/last cell', function(assert) {
        this.reinit({
            focusStateEnabled: true,
            value: new Date(2013, 11, 15)
        });

        const calendar = this.calendar;
        const $element = this.$element;

        $($element).trigger('focusin');

        $.each(['month', 'year', 'decade', 'century'], (_, type) => {
            calendar.option('zoomLevel', type);

            const view = getCurrentViewInstance(calendar);
            const $view = $(view.$element());

            calendar.option('value', new Date(dataUtils.data($view.find(toSelector(CALENDAR_CELL_CLASS)).not(toSelector(CALENDAR_OTHER_VIEW_CLASS)).eq(5).get(0), CALENDAR_DATE_VALUE_KEY)));

            let expectedContoured = dataUtils.data($view.find(toSelector(CALENDAR_CELL_CLASS)).not(toSelector(CALENDAR_OTHER_VIEW_CLASS)).first().get(0), CALENDAR_DATE_VALUE_KEY);

            triggerKeydown($element, HOME_KEY_CODE);
            assert.deepEqual(view.option('contouredDate'), expectedContoured, 'home button contoured first cell');

            expectedContoured = dataUtils.data($view.find(toSelector(CALENDAR_CELL_CLASS)).not(toSelector(CALENDAR_OTHER_VIEW_CLASS)).last().get(0), CALENDAR_DATE_VALUE_KEY);
            triggerKeydown($element, END_KEY_CODE);
            assert.deepEqual(view.option('contouredDate'), expectedContoured, 'end button contoured last cell');
        });
    });

    QUnit.test('home/end keypress must contoured first and last allowable cells', function(assert) {
        const params = {
            'month': { value: new Date(2010, 10, 15), min: new Date(2010, 10, 5), max: new Date(2010, 10, 24) },
            'year': { value: new Date(2015, 4, 10), min: new Date(2015, 2, 18), max: new Date(2015, 8, 18) },
            'decade': { value: new Date(2015, 10, 15), min: new Date(2013, 2, 18), max: new Date(2018, 6, 18) },
            'century': { value: new Date(2045, 10, 15), min: new Date(2030, 2, 18), max: new Date(2075, 6, 18) }
        };

        $.each(['month', 'year', 'decade', 'century'], $.proxy((_, type) => {
            this.reinit($.extend({}, { zoomLevel: type, focusStateEnabled: true }, params[type]));

            const $element = this.$element;

            $($element).trigger('focusin');

            const view = getCurrentViewInstance(this.calendar);

            triggerKeydown($element, HOME_KEY_CODE);
            assert.deepEqual(view.option('contouredDate'), params[type].min, 'home button contoured min cell');

            triggerKeydown($element, END_KEY_CODE);
            assert.deepEqual(view.option('contouredDate'), params[type].max, 'end button contoured max cell');
        }, this));
    });

    QUnit.test('keydown event default behavior should be prevented by calendar keydown handlers for datebox integration', function(assert) {
        assert.expect(4);

        this.$element.remove();
        this.$element = $('<div>').appendTo('body');
        this.$element.dxCalendar({
            value: new Date(2013, 11, 15),
            focusStateEnabled: true
        });

        this.$element
            .on('keydown.TEST', e => {
                assert.ok(e.isDefaultPrevented());
            })
            .trigger($.Event('keydown', { key: LEFT_ARROW_KEY_CODE }))
            .trigger($.Event('keydown', { key: UP_ARROW_KEY_CODE }))
            .trigger($.Event('keydown', { key: RIGHT_ARROW_KEY_CODE }))
            .trigger($.Event('keydown', { key: DOWN_ARROW_KEY_CODE }))
            .off('.TEST');
    });

    QUnit.test('correct view change after fast keyboard navigation', function(assert) {
        this.reinit({
            value: new Date(2013, 9, 1),
            focusStateEnabled: true
        });

        const fxOrigState = fx.off;
        fx.off = false;

        const keyboard = keyboardMock(this.$element);
        const clock = sinon.useFakeTimers();

        $(this.$element).trigger('focusin');

        try {
            keyboard.press('up');
            clock.tick(VIEW_ANIMATION_DURATION / 5);
            keyboard.press('up');
            clock.tick(VIEW_ANIMATION_DURATION * 2);

            assert.deepEqual(this.calendar.option('currentDate'), new Date(2013, 8, 17), 'current date is correct');
            assert.deepEqual(getCurrentViewInstance(this.calendar).option('date'), new Date(2013, 8, 1), 'correct view is shown');
            assert.equal(getCurrentViewInstance(this.calendar).$element().find(toSelector(CALENDAR_CONTOURED_DATE_CLASS)).length, 1, 'contoured date is rendered');
        } finally {
            fx.off = fxOrigState;
            clock.restore();
        }
    });
});


QUnit.module('Preserve time component on value change', {
    beforeEach: function() {
        fx.off = true;

        this.$element = $('<div>').appendTo('body');
        this.calendar = this.$element.dxCalendar({
            focusStateEnabled: true
        }).dxCalendar('instance');
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('date time should not be changed after cell click', function(assert) {
        const calendar = this.calendar;

        calendar.option('value', new Date(2015, 4, 7, 18, 37));
        const $cell = this.$element.find('[data-value=\'2015/05/04\']');
        $($cell).trigger('dxclick');

        assert.deepEqual(calendar.option('value'), new Date(2015, 4, 4, 18, 37), 'value is correct');
    });

    QUnit.test('T277555 - time should not be reset if keyboard is used', function(assert) {
        const calendar = this.calendar;
        const $calendar = this.$element;

        calendar.option('value', new Date(2015, 8, 1, 12, 57));

        $($calendar).trigger('focusin');

        triggerKeydown($calendar, RIGHT_ARROW_KEY_CODE);
        triggerKeydown($calendar, ENTER_KEY_CODE);

        assert.deepEqual(calendar.option('value'), new Date(2015, 8, 2, 12, 57));
    });
});


QUnit.module('Calendar footer', {
    beforeEach: function() {
        fx.off = true;

        this.$element = $('<div>').appendTo('body');
        this.calendar = this.$element.dxCalendar({
            value: new Date(2010, 10, 10),
            focusStateEnabled: true,
            showTodayButton: true
        }).dxCalendar('instance');

        this.reinit = (options = {}) => {
            this.$element.remove();
            this.$element = $('<div>').appendTo('body');
            this.calendar = this.$element.dxCalendar(options).dxCalendar('instance');
        };
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('today view are current after today button click', function(assert) {
        const calendar = this.calendar;

        const $todayButton = this.$element.find(toSelector(CALENDAR_TODAY_BUTTON_CLASS));

        calendar.option('value', new Date(2020, 10, 10));
        assert.deepEqual(calendar.option('currentDate'), new Date(2020, 10, 10), 'change option correct');

        $($todayButton).trigger('dxclick');

        const currentDate = calendar.option('currentDate');
        const today = new Date();

        currentDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        assert.deepEqual(calendar.option('currentDate'), today, 'current view is today view');
    });

    QUnit.test('today view already has a current', function(assert) {
        const calendar = this.calendar;
        const $todayButton = this.$element.find(toSelector(CALENDAR_TODAY_BUTTON_CLASS));

        const dateInTodayView = new Date();
        dateInTodayView.setDate(15);

        calendar.option('value', dateInTodayView);
        assert.equal(getShortDate(calendar.option('value')), getShortDate(dateInTodayView), 'current view is today view');

        $($todayButton).trigger('dxclick');
        assert.equal(getShortDate(calendar.option('value')), getShortDate(new Date()), 'value is today date');
    });

    QUnit.test('click on today button should change current view to \'month\'', function(assert) {
        this.reinit({
            showTodayButton: true,
            value: new Date(2013, 3, 11),
            zoomLevel: 'decade'
        });

        const calendar = this.calendar;
        const $todayButton = this.$element.find(toSelector(CALENDAR_TODAY_BUTTON_CLASS));

        $($todayButton).trigger('dxclick');
        assert.equal(calendar.option('zoomLevel'), 'month', 'calendar view is changed correctly');

        assert.deepEqual(getShortDate(calendar.option('value')), getShortDate(new Date()), 'calendar value is correct');
    });

    QUnit.test('today view is visible after \'today\' button click', function(assert) {
        const $element = this.$element;
        const $todayButton = $element.find(toSelector(CALENDAR_TODAY_BUTTON_CLASS));

        $($todayButton).trigger('dxclick');

        const view = getCurrentViewInstance(this.calendar);

        assert.ok(dateUtils.sameMonthAndYear(view.option('date'), new Date()), 'calendar current view is correct');
        assert.equal(view.$element().position().left, 0, 'calendar current view position is correct');
        assert.equal($element.find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS)).position().left, 0, 'views wrapper is centered');
        assert.equal(view.$element().find(toSelector(CALENDAR_SELECTED_DATE_CLASS)).length, 1, 'there is selected cell on the current view');
    });

    QUnit.test('navigator caption should be changed after \'today\' button click', function(assert) {
        const $element = this.$element;
        const $todayButton = $element.find(toSelector(CALENDAR_TODAY_BUTTON_CLASS));

        const $navigator = $element.find(toSelector(CALENDAR_CAPTION_BUTTON_CLASS));
        const prevText = $navigator.text();

        $($todayButton).trigger('dxclick');

        const navigatorText = $navigator.text();
        assert.notEqual(navigatorText, prevText, 'navigator caption changed');
    });

    QUnit.test('correct today view position before animation (currentDate < today)', function(assert) {
        assert.expect(2);

        const fxState = fx.off;
        const origAnimate = fx.animate;

        const $element = this.$element;
        const calendar = this.calendar;
        const viewWidth = $element.find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS) + ' .dx-widget').eq(0).width();

        try {
            fx.off = false;
            fx.animate = () => {
                const todayView = getAfterViewInstance(calendar);
                const $todayView = $(todayView.$element());

                assert.equal(getShortDate(todayView.option('date')), getShortDate(new Date()), 'today view is created');
                assert.equal($todayView.position().left, viewWidth, 'today view position is correct');

                return $.Deferred().resolve().promise();
            };

            const $todayButton = $element.find(toSelector(CALENDAR_TODAY_BUTTON_CLASS));
            $($todayButton).trigger('dxclick');
        } finally {
            fx.animate = origAnimate;
            fx.off = fxState;
        }
    });

    QUnit.test('correct today view position before animation (currentDate > today)', function(assert) {
        assert.expect(2);

        const fxState = fx.off;
        const origAnimate = fx.animate;

        const calendar = this.calendar;
        const viewWidth = this.$element.find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS) + ' .dx-widget').eq(0).width();
        const today = new Date();

        calendar.option('currentDate', new Date(today.getFullYear() + 2, 2, 7));

        try {
            fx.off = false;
            fx.animate = () => {
                const todayView = getBeforeViewInstance(calendar);
                const $todayView = $(todayView.$element());

                assert.equal(getShortDate(todayView.option('date')), getShortDate(new Date()), 'today view is created');
                assert.equal($todayView.position().left, -viewWidth, 'today view position is correct');

                return $.Deferred().resolve().promise();
            };

            const $todayButton = $(calendar.$element().find(toSelector(CALENDAR_TODAY_BUTTON_CLASS)));

            $($todayButton).trigger('dxclick');
        } finally {
            fx.animate = origAnimate;
            fx.off = fxState;
        }
    });

    QUnit.test('correct views are rendered after animation', function(assert) {
        const calendar = this.calendar;
        const $todayButton = this.$element.find(toSelector(CALENDAR_TODAY_BUTTON_CLASS));

        $($todayButton).trigger('dxclick');

        const beforeViewDate = getBeforeViewInstance(calendar).option('date');
        const afterViewDate = getAfterViewInstance(calendar).option('date');
        const today = calendar.option('currentDate');

        assert.equal(beforeViewDate.getFullYear(), new Date(today.getFullYear(), today.getMonth() - 1).getFullYear(), 'before view year is correct');
        assert.equal(beforeViewDate.getMonth(), new Date(today.getFullYear(), today.getMonth() - 1).getMonth(), 'before view month is correct');
        assert.equal(afterViewDate.getFullYear(), new Date(today.getFullYear(), today.getMonth() + 1).getFullYear(), 'after view year is correct');
        assert.equal(afterViewDate.getMonth(), new Date(today.getFullYear(), today.getMonth() + 1).getMonth(), 'after view month is correct');
    });

    QUnit.test('correct animation after today button click on the different zoom level', function(assert) {
        this.calendar.option({
            zoomLevel: 'century',
            value: new Date(1973, 4, 5),
        });

        const origAnimate = fx.animate;

        try {
            let animationCount = 0;

            fx.animate = (...args) => {
                animationCount += 1;
                return origAnimate.apply(fx, args);
            };

            $(this.$element.find(toSelector(CALENDAR_TODAY_BUTTON_CLASS))).trigger('dxclick');

            assert.equal(animationCount, 1, 'only one animation was made for view change');
        } finally {
            fx.animate = origAnimate;
        }
    });
});


QUnit.module('Options', {
    beforeEach: function() {
        fx.off = true;

        this.$element = $('<div>').appendTo('body');
        this.calendar = this.$element.dxCalendar().dxCalendar('instance');

        this.reinit = (options) => {
            this.$element.remove();
            this.$element = $('<div>').appendTo('body');
            this.calendar = this.$element.dxCalendar(options).dxCalendar('instance');
        };
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('changing the \'value\' option must invoke the \'onValueChanged\' action', function(assert) {
        this.reinit({
            onValueChanged: () => {
                assert.ok(true);
            }
        });
        this.calendar.option('value', new Date(2002, 2, 2));
    });

    QUnit.test('onCellClick return not \'undefined\' after click on cell', function(assert) {
        const clickHandler = sinon.spy(noop);

        this.reinit({
            currentDate: new Date(2010, 10, 10),
            focusStateEnabled: true,
            onCellClick: clickHandler
        });

        const $cell = this.$element.find(toSelector(CALENDAR_CELL_CLASS)).eq(4);
        $($cell).trigger('dxclick');

        assert.ok(clickHandler.calledOnce, 'onCellClick called once');

        const params = clickHandler.getCall(0).args[0];
        assert.ok(params, 'Event params should be passed');
        assert.ok(params.event, 'Event should be passed');
        assert.ok(params.component, 'Component should be passed');
        assert.ok(params.element, 'Element should be passed');
    });

    QUnit.test('Event should be passed to the valueChanged action after click on a cell', function(assert) {
        const valueChangedHandler = sinon.stub();

        this.reinit({
            currentDate: new Date(2010, 10, 10),
            focusStateEnabled: true,
            onValueChanged: valueChangedHandler
        });

        const $cell = this.$element.find(toSelector(CALENDAR_CELL_CLASS)).eq(4);
        $($cell).trigger('dxclick');

        const params = valueChangedHandler.getCall(0).args[0];
        assert.ok(params.event, 'Event should be passed');
        assert.ok(params.component, 'Component should be passed');
        assert.ok(params.element, 'Element should be passed');
    });

    QUnit.test('onCellClick should not be fired when zoomLevel change required (for datebox integration)', function(assert) {
        const clickSpy = sinon.spy();

        this.reinit({
            onCellClick: clickSpy,
            zoomLevel: 'year',
            maxZoomLevel: 'month'
        });

        const $cell = $(getCurrentViewInstance(this.calendar).$element().find('.' + CALENDAR_CELL_CLASS).eq(3));
        $($cell).trigger('dxclick');

        assert.equal(clickSpy.callCount, 0, 'onCellClick was not fired');
    });

    QUnit.test('Calendar should not allow to select date in disabled state changed in runtime (T196663)', function(assert) {
        this.reinit({
            value: new Date(2013, 11, 15),
            currentDate: new Date(2013, 11, 15)
        });

        this.calendar.option('disabled', true);
        $(this.$element.find('[data-value=\'2013/12/11\']')).trigger('dxclick');
        assert.deepEqual(this.calendar.option('value'), new Date(2013, 11, 15));
    });

    QUnit.test('When initialized without currentDate, calendar must try to infer it from value', function(assert) {
        const date = new Date(2014, 11, 11);

        this.reinit({
            value: new Date(date)
        });

        assert.deepEqual(this.calendar.option('currentDate'), date);
    });

    QUnit.test('calendar view should be changed on the \'currentDate\' option change', function(assert) {
        const calendar = this.calendar;
        const oldDate = getCurrentViewInstance(calendar).option('date');

        calendar.option('currentDate', new Date(2013, 11, 15));
        assert.notDeepEqual(getCurrentViewInstance(calendar).option('date'), oldDate, 'view is changed');
    });

    QUnit.test('contoured date displaying should depend on \'hasFocus\' option', function(assert) {
        this.reinit({
            value: new Date(2015, 10, 18),
            hasFocus: () => {
                return true;
            }
        });

        assert.deepEqual(getCurrentViewInstance(this.calendar).option('contouredDate'), new Date(2015, 10, 18), 'view contoured is set');
    });
});


QUnit.module('ZoomLevel option', {
    beforeEach: function() {
        fx.off = true;
        this.$element = $('<div>').appendTo('body');
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('\'zoomLevel\' should have correct value on init if \'maxZoomLevel\' is specified', function(assert) {
        const calendar = this.$element.dxCalendar({
            maxZoomLevel: 'year',
            zoomLevel: 'month'
        }).dxCalendar('instance');

        assert.equal(calendar.option('zoomLevel'), calendar.option('maxZoomLevel'), '\'zoomLevel\' is corrected');
    });

    QUnit.test('view should not be changed down if specified maxZoomLevel is reached', function(assert) {
        const calendar = this.$element.dxCalendar({
            maxZoomLevel: 'year',
            zoomLevel: 'decade'
        }).dxCalendar('instance');

        $(this.$element.find(toSelector(CALENDAR_CELL_CLASS)).eq(5)).trigger('dxclick');
        assert.equal(calendar.option('zoomLevel'), 'year', '\'zoomLevel\' changed');

        $(this.$element.find(toSelector(CALENDAR_CELL_CLASS)).eq(5)).trigger('dxclick');
        assert.equal(calendar.option('zoomLevel'), 'year', '\'zoomLevel\' did not change');
    });

    QUnit.test('\'zoomLevel\' should be aligned after \'maxZoomLevel\' option change if out of bounds', function(assert) {
        const calendar = this.$element.dxCalendar({
            maxZoomLevel: 'month',
            value: new Date(2015, 2, 15)
        }).dxCalendar('instance');

        $.each(['month', 'year', 'decade', 'century'], (_, type) => {
            calendar.option('maxZoomLevel', type);

            assert.equal(calendar.option('zoomLevel'), type, 'calendar \'zoomLevel\' is correct');
        });
    });

    QUnit.test('\'zoomLevel\' option should not be changed after \'maxZoomLevel\' option change', function(assert) {
        const calendar = this.$element.dxCalendar({
            maxZoomLevel: 'century',
            value: new Date(2015, 2, 15)
        }).dxCalendar('instance');

        $.each(['month', 'year', 'decade', 'century'], (_, type) => {
            calendar.option('maxZoomLevel', type);

            assert.equal(calendar.option('zoomLevel'), 'century', 'calendar \'zoomLevel\' is correct');
        });
    });

    QUnit.test('calendar should get correct value after click on cell of specified maxZoomLevel', function(assert) {
        const calendar = this.$element.dxCalendar({
            maxZoomLevel: 'year',
            value: new Date(2015, 2, 15)
        }).dxCalendar('instance');

        $(this.$element.find(toSelector(CALENDAR_CELL_CLASS)).eq(5)).trigger('dxclick');
        assert.deepEqual(calendar.option('value'), new Date(2015, 5, 1), '\'zoomLevel\' changed');

        calendar.option('maxZoomLevel', 'decade');
        $(this.$element.find(toSelector(CALENDAR_CELL_CLASS)).eq(5)).trigger('dxclick');
        assert.deepEqual(calendar.option('value'), new Date(2014, 0, 1), '\'zoomLevel\' changed');

        calendar.option('maxZoomLevel', 'century');
        $(this.$element.find(toSelector(CALENDAR_CELL_CLASS)).eq(5)).trigger('dxclick');
        assert.deepEqual(calendar.option('value'), new Date(2040, 0, 1), '\'zoomLevel\' changed');
    });

    QUnit.test('do not go up if minZoomLevel is reached', function(assert) {
        const $element = this.$element;
        const instance = $element.dxCalendar().dxCalendar('instance');

        $.each(['month', 'year', 'decade'], (_, type) => {
            instance.option({
                minZoomLevel: type,
                zoomLevel: type
            });

            $(toSelector(CALENDAR_CAPTION_BUTTON_CLASS)).trigger('dxclick');
            assert.equal(instance.option('zoomLevel'), type, 'zoom level did not change');
        });
    });

    QUnit.test('\'zoomLevel\' should be aligned after \'minZoomLevel\' option change if out of bounds', function(assert) {
        const $element = this.$element;
        const instance = $element.dxCalendar({
            minZoomLevel: 'century',
            zoomLevel: 'century'
        }).dxCalendar('instance');

        $.each(['decade', 'year', 'month'], (_, type) => {
            instance.option('minZoomLevel', type);
            assert.equal(instance.option('zoomLevel'), type, 'zoom level is changed correctly');
        });
    });

    QUnit.test('cancel change zoomLevel if there is only one cell on new view', function(assert) {
        const calendar = this.$element.dxCalendar({
            maxZoomLevel: 'month',
            min: new Date(2015, 3, 5),
            max: new Date(2015, 3, 25),
            value: new Date(2015, 2, 15)
        }).dxCalendar('instance');

        const $captionButton = this.$element.find(toSelector(CALENDAR_CAPTION_BUTTON_CLASS));

        $($captionButton).trigger('dxclick');
        assert.equal(calendar.option('zoomLevel'), 'month', 'view is not changed (month)');

        calendar.option('zoomLevel', 'year');
        calendar.option('max', new Date(2015, 6, 25));
        $($captionButton).trigger('dxclick');
        assert.equal(calendar.option('zoomLevel'), 'year', 'view is not changed (year)');

        calendar.option('zoomLevel', 'decade');
        calendar.option('max', new Date(2017, 6, 25));
        $($captionButton).trigger('dxclick');
        assert.equal(calendar.option('zoomLevel'), 'decade', 'view is not changed (decade)');
    });

    QUnit.test('change ZoomLevel after click on view cell', function(assert) {
        const $element = this.$element;
        const calendar = $element.dxCalendar({
            zoomLevel: 'century',
            value: new Date(2015, 2, 15)
        }).dxCalendar('instance');

        $.each(['century', 'decade'], (_, type) => {
            calendar.option('zoomLevel', type);

            $($element.find(toSelector(CALENDAR_CELL_CLASS)).not(toSelector(CALENDAR_OTHER_VIEW_CLASS)).eq(3)).trigger('dxclick');
            assert.notStrictEqual(calendar.option('zoomLevel'), type, 'zoomLevel option view is changed');
        });
    });

    QUnit.test('change ZoomLevel after pressing enter key on view cell', function(assert) {
        const $element = this.$element;
        const calendar = $element.dxCalendar({
            zoomLevel: 'century',
            value: new Date(2015, 2, 15),
            focusStateEnabled: true
        }).dxCalendar('instance');

        $.each(['century', 'decade'], (_, type) => {
            calendar.option('zoomLevel', type);
            $($element).trigger('focusin');
            triggerKeydown($element, ENTER_KEY_CODE);
            assert.notStrictEqual(calendar.option('zoomLevel'), type, 'zoomLevel option view is changed');
        });
    });

    QUnit.test('change ZoomLevel after click on other view cell', function(assert) {
        const $element = this.$element;
        const calendar = $element.dxCalendar({
            zoomLevel: 'century',
            value: new Date(2015, 2, 15)
        }).dxCalendar('instance');

        $.each(['century', 'decade'], (_, type) => {
            calendar.option('zoomLevel', type);

            $($element.find(toSelector(CALENDAR_OTHER_VIEW_CLASS)).first()).trigger('dxclick');
            assert.notStrictEqual(calendar.option('zoomLevel'), type, 'zoomLevel option view is changed');
        });
    });

    QUnit.test('Current view should be set correctly, after click on other view cells', function(assert) {

        const $element = this.$element;
        const calendar = $element.dxCalendar({
            value: new Date(2015, 1, 1),
            zoomLevel: 'decade'
        }).dxCalendar('instance');

        const spy = sinon.spy(calendar, '_navigate');

        try {
            fx.off = false;
            this.clock = sinon.useFakeTimers();
            $($element.find(toSelector(CALENDAR_CELL_CLASS)).first()).trigger('dxclick');

            this.clock.tick(1000);

            const navigatorCaptionText = $element.find(toSelector(CALENDAR_CAPTION_BUTTON_CLASS)).text();
            const dataCell = $element.find(toSelector(CALENDAR_CELL_CLASS)).first().data('value');

            assert.equal(navigatorCaptionText, '2009', 'navigator caption text is correct');
            assert.equal(dataCell, '2009/01/01', 'cell data is correct');
            assert.ok(!spy.called, '_navigate should not be called');
            assert.equal(calendar.option('zoomLevel'), 'year');
        } finally {
            fx.off = true;
            this.clock.restore();
        }
    });

    QUnit.test('Month names should be shown in \'abbreviated\' format when ZoomLevel is Year', function(assert) {
        const getMonthNamesStub = sinon.stub(dateLocalization, 'getMonthNames');

        getMonthNamesStub.returns(['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec']);
        getMonthNamesStub.withArgs('abbreviated').returns(['led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro']);

        const calendar = this.$element.dxCalendar({
            zoomLevel: 'year',
            value: new Date(2017, 10, 20)
        }).dxCalendar('instance');

        const $cells = $(getCurrentViewInstance(calendar).$element().find('.dx-calendar-cell'));

        assert.equal($cells.eq(5).text().trim(), 'čvn');
        assert.equal($cells.eq(6).text().trim(), 'čvc');

        getMonthNamesStub.restore();
    });
});


QUnit.module('Min & Max options', {
    beforeEach: function() {
        fx.off = true;

        this.value = new Date(2010, 10, 10);
        this.minDate = new Date(2010, 9, 10);
        this.maxDate = new Date(2010, 11, 10);

        this.$element = $('<div>').appendTo('body');
        this.calendar = this.$element.dxCalendar({
            min: this.minDate,
            value: this.value,
            max: this.maxDate,
            focusStateEnabled: true
        }).dxCalendar('instance');

        this.clock = sinon.useFakeTimers();

        this.reinit = (options) => {
            this.$element.remove();
            this.$element = $('<div>').appendTo('body');
            this.calendar = this.$element.dxCalendar(options).dxCalendar('instance');
        };
    },
    afterEach: function() {
        this.$element.remove();
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    QUnit.test('calendar should not throw error if max date is null', function(assert) {
        assert.expect(0);

        new Calendar('<div>', { value: new Date(2013, 9, 15), firstDayOfWeek: 1, max: null });
    });

    QUnit.test('calendar must pass min and max to the created views', function(assert) {
        assert.deepEqual(getCurrentViewInstance(this.calendar).option('min'), this.minDate);
        assert.deepEqual(getCurrentViewInstance(this.calendar).option('max'), this.maxDate);
    });

    QUnit.test('calendar should not allow to navigate to a date earlier than min and later than max via keyboard events', function(assert) {
        const isAnimationOff = fx.off;
        const animate = fx.animate;

        try {
            let animateCount = 0;

            fx.off = false;

            fx.animate = (...args) => {
                animateCount++;
                return animate.apply(fx, args);
            };

            const minimumCurrentDate = new Date(this.value.getFullYear(), this.value.getMonth() - 1, this.value.getDate());
            const currentDate = new Date(this.value.getFullYear(), this.value.getMonth(), this.value.getDate());
            const maximumCurrentDate = new Date(this.value.getFullYear(), this.value.getMonth() + 1, this.value.getDate());

            $(this.$element).trigger('focusin');

            triggerKeydown(this.$element, PAGE_UP_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), minimumCurrentDate);
            assert.equal(animateCount, 1, 'view is changed with animation after the \'page up\' key press the first time');

            triggerKeydown(this.$element, PAGE_UP_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), minimumCurrentDate);
            assert.equal(animateCount, 1, 'view is not changed after the \'page up\' key press the second time');

            triggerKeydown(this.$element, PAGE_DOWN_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), currentDate);

            triggerKeydown(this.$element, PAGE_DOWN_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), maximumCurrentDate);
            assert.equal(animateCount, 3, 'view is changed with animation after the \'page down\' key press the first time');

            triggerKeydown(this.$element, PAGE_DOWN_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), maximumCurrentDate);
            assert.equal(animateCount, 3, 'view is not changed after the \'page down\' key press the second time');
        } finally {
            fx.off = isAnimationOff;
            fx.animate = animate;
        }
    });

    QUnit.test('calendar should set currentDate to min when setting to an earlier date; and to max when setting to a later date', function(assert) {
        const calendar = this.calendar;
        const min = calendar.option('min');
        const max = calendar.option('max');
        const earlyDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth() - 1, 1);
        const lateDate = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth() + 1, 1);

        calendar.option('currentDate', earlyDate);
        assert.deepEqual(calendar.option('currentDate'), new Date(this.minDate.getFullYear(), this.minDate.getMonth(), min.getDate()));
        calendar.option('currentDate', lateDate);
        assert.deepEqual(calendar.option('currentDate'), new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), max.getDate()));
    });

    QUnit.test('calendar should properly initialize currentDate with respect to min and max', function(assert) {
        this.reinit({
            min: this.minDate,
            max: this.maxDate
        });

        const calendar = this.calendar;
        assert.ok(dateUtils.sameView(calendar.option('zoomLevel'), calendar.option('currentDate'), this.minDate));
    });

    QUnit.test('value should not be changed when min and max options are set', function(assert) {
        const calendar = this.calendar;
        const outOfRangeDate = new Date(2010, 12, 10);

        calendar.option('value', outOfRangeDate);
        assert.equal(calendar.option('value'), outOfRangeDate, 'value is not changed');
    });

    QUnit.test('current date is max month if value is null and range is earlier than today', function(assert) {
        this.reinit({
            min: this.minDate,
            max: this.maxDate,
            currentDate: new Date(2015, 10, 13),
            value: null
        });

        const calendar = this.calendar;

        assert.strictEqual(calendar.option('value'), null, 'value is null');
        assert.deepEqual(calendar.option('currentDate'), new Date(this.maxDate), 'current date is max');
    });

    QUnit.test('change currentDate without navigation if became out of range after max is set', function(assert) {
        this.reinit({
            value: new Date(2015, 5, 16)
        });

        const spy = sinon.spy(this.calendar, '_navigate');
        const max = new Date(2015, 4, 7);

        this.calendar.option('max', max);
        assert.deepEqual(this.calendar.option('currentDate'), max, 'currentDate and max are equal');
        assert.equal(spy.callCount, 0, 'there was no navigation');
        assert.equal(this.$element.find(toSelector(CALENDAR_CAPTION_BUTTON_CLASS)).text(), 'May 2015', 'navigator caption is changed');
    });

    QUnit.test('change currentDate without navigation if became out of range after min is set', function(assert) {
        this.reinit({
            value: new Date(2015, 5, 16)
        });

        const spy = sinon.spy(this.calendar, '_navigate');
        const min = new Date(2015, 6, 12);

        this.calendar.option('min', min);
        assert.deepEqual(this.calendar.option('currentDate'), min, 'currentDate and min are equal');
        assert.equal(spy.callCount, 0, 'there was no navigation');
        assert.equal(this.$element.find(toSelector(CALENDAR_CAPTION_BUTTON_CLASS)).text(), 'July 2015', 'navigator caption is changed');
    });

    QUnit.test('current date is not changed when min or max option is changed and current value is in range', function(assert) {
        const value = new Date(2015, 0, 27);

        this.reinit({
            min: null,
            max: null,
            value: value
        });

        const calendar = this.calendar;
        const minDate = new Date(value);
        const maxDate = new Date(value);

        minDate.setYear(2014);
        maxDate.setYear(2015);

        assert.deepEqual(calendar.option('currentDate'), value, 'current date and value are the same');

        calendar.option('min', minDate);
        assert.deepEqual(calendar.option('currentDate'), value, 'current date and min are the same after min option is set');
        assert.deepEqual(calendar.option('value'), value, 'value is not changed');

        calendar.option('min', null);
        assert.deepEqual(calendar.option('currentDate'), value, 'current date and value are the same');
        assert.deepEqual(calendar.option('value'), value, 'value is not changed');

        calendar.option('max', maxDate);
        assert.deepEqual(calendar.option('currentDate'), value, 'current date and max are the same after max option is set');
        assert.deepEqual(calendar.option('value'), value, 'value is not changed');
    });

    QUnit.test('T278441 - min date should be 1/1/1000 if the \'min\' option is null', function(assert) {
        const value = new Date(988, 7, 17);

        this.reinit({
            value: value,
            min: null
        });

        assert.deepEqual(this.calendar.option('currentDate'), new Date(1000, 0), 'current date is correct');
    });

    QUnit.test('T278441 - max date should be 31/12/2999 if the \'max\' option is null', function(assert) {
        const value = new Date(3015, 7, 17);

        this.reinit({
            value: value,
            max: null
        });

        assert.deepEqual(this.calendar.option('currentDate'), new Date(3000, 0), 'current date is correct');
    });

    QUnit.test('T266658 - widget should have no views that are out of range', function(assert) {
        this.reinit({
            value: new Date(2015, 8, 8),
            min: new Date(2015, 8, 2),
            max: new Date(2015, 9, 20)
        });

        const calendar = this.calendar;
        const $viewsWrapper = $(calendar.$element().find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS)));

        assert.equal($viewsWrapper.children().length, 2, 'the number of views is correct when current view contain min date');
        assert.ok(!getBeforeViewInstance(calendar), 'there is no after view');

        calendar.option('value', new Date(2015, 9, 15));

        assert.equal($viewsWrapper.children().length, 2, 'the number of views is correct when current view contain max date');
        assert.ok(!getAfterViewInstance(calendar), 'there is no after view');
    });

    QUnit.test('T266658 - widget should have no views that are out of range after navigation', function(assert) {
        this.reinit({
            value: new Date(2015, 9, 8),
            min: new Date(2015, 8, 2),
            max: new Date(2015, 9, 20)
        });

        const calendar = this.calendar;
        const $views = $(calendar.$element().find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS)).children());

        assert.equal($views.length, 2, 'the number of views is correct when current view contain min date');
    });

    QUnit.test('correct views rendering with min option', function(assert) {
        const params = {
            'year': { value: new Date(2015, 0, 8), min: new Date(2014, 11, 16) },
            'decade': { value: new Date(2010, 0, 8), min: new Date(2009, 11, 16) },
            'century': { value: new Date(2000, 0, 8), min: new Date(1999, 11, 16) }
        };

        $.each(['year', 'decade', 'century'], $.proxy((_, type) => {
            this.reinit($.extend({}, params[type], { zoomLevel: type }));

            const $views = this.$element.find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS)).children();
            assert.equal($views.length, 3, 'all three views are rendered');
        }, this));
    });

    QUnit.test('correct views rendering with max option', function(assert) {
        const params = {
            'year': { value: new Date(2015, 11, 8), max: new Date(2016, 0, 16) },
            'decade': { value: new Date(2019, 11, 8), max: new Date(2020, 0, 16) },
            'century': { value: new Date(2099, 11, 8), max: new Date(2100, 0, 16) }
        };

        $.each(['year', 'decade', 'century'], $.proxy((_, type) => {
            this.reinit($.extend({}, params[type], { zoomLevel: type }));

            const $views = this.$element.find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS)).children();
            assert.equal($views.length, 3, 'all three views are rendered');
        }, this));
    });
});


QUnit.module('disabledDates option', {
    beforeEach: function() {
        fx.off = true;

        this.value = new Date(2010, 10, 10);
        this.disabledDates = (args) => {
            const month = args.date.getMonth();

            if(month === 9 || month === 11) {
                return true;
            }
        };

        this.$element = $('<div>').appendTo('body');
        this.calendar = this.$element.dxCalendar({
            disabledDates: this.disabledDates,
            value: this.value,
            focusStateEnabled: true
        }).dxCalendar('instance');

        this.clock = sinon.useFakeTimers();

        this.reinit = (options) => {
            this.$element.remove();
            this.$element = $('<div>').appendTo('body');
            this.calendar = this.$element.dxCalendar(options).dxCalendar('instance');
        };
    },
    afterEach: function() {
        this.$element.remove();
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    QUnit.test('navigating to the disabled month should not skip the month and should focus the current date', function(assert) {
        const isAnimationOff = fx.off;
        const animationSpy = sinon.spy(fx, 'animate');

        try {
            fx.off = false;

            this.$element.trigger('focusin');

            triggerKeydown(this.$element, PAGE_UP_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), new Date(2010, 9, 10), 'same date has been focused');
            assert.equal(animationSpy.callCount, 1, 'view is changed with animation after the \'page up\' key press the first time');

            triggerKeydown(this.$element, PAGE_UP_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), new Date(2010, 8, 10), 'same date has been focused');
            assert.equal(animationSpy.callCount, 2, 'view is changed after the \'page up\' key press the second time');

            triggerKeydown(this.$element, PAGE_DOWN_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), new Date(2010, 9, 10), 'same date has been focused');
            assert.equal(animationSpy.callCount, 3, 'view is changed with animation after the \'page down\' key press the first time');

            triggerKeydown(this.$element, PAGE_DOWN_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), new Date(2010, 10, 10), 'same date has been focused');
            assert.equal(animationSpy.callCount, 4, 'view is changed with animation after the \'page down\' key press the first time');

            triggerKeydown(this.$element, PAGE_DOWN_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), new Date(2010, 11, 10), 'same date has been focused');
            assert.equal(animationSpy.callCount, 5, 'view is changed after the \'page down\' key press the third time');

            $(this.$element.find(toSelector(CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS))).trigger('dxclick');
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), new Date(2010, 10, 10), 'same date has been focused');
            assert.equal(animationSpy.callCount, 6, 'view is changed after the click on previous arrow on UI');

            $(this.$element.find(toSelector(CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS))).trigger('dxclick');
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), new Date(2010, 11, 10), 'same date has been focused');
            assert.equal(animationSpy.callCount, 7, 'view is changed after the click on next arrow on UI');
        } finally {
            fx.off = isAnimationOff;
            animationSpy.restore();
        }
    });

    QUnit.test('navigating to next/previous month should focus the closest available date and change the view', function(assert) {
        const isAnimationOff = fx.off;
        const animationSpy = sinon.spy(fx, 'animate');

        try {
            this.calendar.option({
                value: new Date(2020, 0, 15),
                disabledDates: (args) => {
                    const date = args.date.getDate();
                    const month = args.date.getMonth();
                    return month === 0 && date >= 20 || month === 1 && date < 20;
                }
            });

            fx.off = false;
            animationSpy.reset();

            const lastAvailableDateOnJanuary = new Date(2020, 0, 19);
            const firstAvailableDateOnFebruary = new Date(2020, 1, 20);

            this.$element.trigger('focusin');

            triggerKeydown(this.$element, PAGE_DOWN_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), firstAvailableDateOnFebruary, 'closest available date has been focused');
            assert.equal(animationSpy.callCount, 1, 'view has been changed');

            triggerKeydown(this.$element, PAGE_UP_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), lastAvailableDateOnJanuary, 'closest available date has been focused');
            assert.equal(animationSpy.callCount, 2, 'view has been changed');

            triggerKeydown(this.$element, RIGHT_ARROW_KEY_CODE, true);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), firstAvailableDateOnFebruary, 'closest available date has been focused');
            assert.equal(animationSpy.callCount, 3, 'view has been changed');

            triggerKeydown(this.$element, LEFT_ARROW_KEY_CODE, true);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), lastAvailableDateOnJanuary, 'closest available date has been focused');
            assert.equal(animationSpy.callCount, 4, 'view has been changed');

            $(this.$element.find(toSelector(CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS))).trigger('dxclick');
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), firstAvailableDateOnFebruary, 'closest available date has been focused');
            assert.equal(animationSpy.callCount, 5, 'view has been changed');

            $(this.$element.find(toSelector(CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS))).trigger('dxclick');
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), lastAvailableDateOnJanuary, 'closest available date has been focused');
            assert.equal(animationSpy.callCount, 6, 'view has been changed');
        } finally {
            fx.off = isAnimationOff;
            animationSpy.restore();
        }
    });

    QUnit.test('left/right/up/downArrow should focus the closest date on the previous/next month when forced to change the month', function(assert) {
        const isAnimationOff = fx.off;
        const animationSpy = sinon.spy(fx, 'animate');

        try {
            this.calendar.option({
                value: new Date(2020, 0, 14),
                disabledDates: (args) => {
                    return args.date.getDate() >= 15 || args.date.getDate() <= 4;
                }
            });

            fx.off = false;
            animationSpy.reset();

            this.$element.trigger('focusin');

            triggerKeydown(this.$element, RIGHT_ARROW_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 1, 5), 'closest available date has been focused');
            assert.equal(animationSpy.callCount, 1, 'view has been changed');

            triggerKeydown(this.$element, LEFT_ARROW_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 0, 14), 'closest available date has been focused');
            assert.equal(animationSpy.callCount, 2, 'view has been changed');

            triggerKeydown(this.$element, DOWN_ARROW_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 1, 11), 'closest available date has been focused');
            assert.equal(animationSpy.callCount, 3, 'view has been changed');

            triggerKeydown(this.$element, UP_ARROW_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 0, 14), 'closest available date has been focused');
            assert.equal(animationSpy.callCount, 4, 'view has been changed');
        } finally {
            fx.off = isAnimationOff;
            animationSpy.restore();
        }
    });

    QUnit.test('left/right/up/downArrow should try focus the date moved by offset in a month', function(assert) {
        this.calendar.option({
            value: new Date(2020, 0, 6),
            disabledDates: (args) => {
                const date = args.date.getDate();
                return date > 10 && date < 16 || date === 7 || date === 21;
            }
        });

        this.$element.trigger('focusin');

        triggerKeydown(this.$element, DOWN_ARROW_KEY_CODE);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 0, 20), 'closest date by offset has been focused');

        triggerKeydown(this.$element, RIGHT_ARROW_KEY_CODE);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 0, 22), 'closest date by offset has been focused');

        triggerKeydown(this.$element, UP_ARROW_KEY_CODE);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 0, 8), 'closest date by offset has been focused');

        triggerKeydown(this.$element, LEFT_ARROW_KEY_CODE);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 0, 6), 'closest date by offset has been focused');
    });

    QUnit.test('left/right arrows should try focus the month moved by offset in a year view', function(assert) {
        this.calendar.option({
            value: new Date(2020, 0, 6),
            zoomLevel: 'year',
            disabledDates: (args) => {
                const month = args.date.getMonth();
                return month % 2;
            }
        });

        this.$element.trigger('focusin');

        triggerKeydown(this.$element, RIGHT_ARROW_KEY_CODE);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 2, 6), 'closest month by offset has been focused');

        triggerKeydown(this.$element, LEFT_ARROW_KEY_CODE);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 0, 6), 'closest month by offset has been focused');
    });

    QUnit.test('left/right/up/down arrows should try focus the year moved by offset in a decade view', function(assert) {
        this.calendar.option({
            value: new Date(2020, 0, 6),
            zoomLevel: 'decade',
            disabledDates: (args) => {
                const year = args.date.getYear();
                return year === 121 || year === 124;
            }
        });

        this.$element.trigger('focusin');

        triggerKeydown(this.$element, RIGHT_ARROW_KEY_CODE);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2022, 0, 6), 'closest year by offset has been focused');

        triggerKeydown(this.$element, LEFT_ARROW_KEY_CODE);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 0, 6), 'closest year by offset has been focused');

        triggerKeydown(this.$element, DOWN_ARROW_KEY_CODE);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2028, 0, 6), 'closest year by offset has been focused');

        triggerKeydown(this.$element, UP_ARROW_KEY_CODE);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 0, 6), 'closest year by offset has been focused');
    });

    QUnit.test('left/right/up/down arrows should try focus the decade moved by offset in a century view', function(assert) {
        this.calendar.option({
            value: new Date(2000, 0, 6),
            zoomLevel: 'century',
            disabledDates: (args) => {
                const year = args.date.getYear();
                return year >= 110 && year < 120 || year >= 140 && year < 150;
            }
        });

        this.$element.trigger('focusin');

        triggerKeydown(this.$element, RIGHT_ARROW_KEY_CODE);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 0, 6), 'closest decade by offset has been focused');

        triggerKeydown(this.$element, LEFT_ARROW_KEY_CODE);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2000, 0, 6), 'closest decade by offset has been focused');

        triggerKeydown(this.$element, DOWN_ARROW_KEY_CODE);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2080, 0, 6), 'closest decade by offset has been focused');

        triggerKeydown(this.$element, UP_ARROW_KEY_CODE);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2000, 0, 6), 'closest decade by offset has been focused');
    });

    QUnit.test('disabled decade/century should not be skipped during navigation', function(assert) {
        this.calendar.option({
            value: new Date(2020, 0, 6),
            zoomLevel: 'decade',
            disabledDates: (args) => {
                const view = args.view;
                const year = args.date.getYear();
                if(view === 'decade') {
                    return year >= 130 && year < 140;
                } else if(view === 'century') {
                    return year >= 100 && year < 200;
                }
            }
        });

        this.$element.trigger('focusin');

        triggerKeydown(this.$element, RIGHT_ARROW_KEY_CODE, true);
        this.clock.tick(VIEW_ANIMATION_DURATION);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2030, 0, 6), 'current date is correct');

        triggerKeydown(this.$element, RIGHT_ARROW_KEY_CODE);
        this.clock.tick(VIEW_ANIMATION_DURATION);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2040, 0, 6), 'current date is correct');

        triggerKeydown(this.$element, UP_ARROW_KEY_CODE, true);
        this.clock.tick(VIEW_ANIMATION_DURATION);

        triggerKeydown(this.$element, LEFT_ARROW_KEY_CODE);
        this.clock.tick(VIEW_ANIMATION_DURATION);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(1940, 0, 6), 'current date is correct');
    });

    QUnit.test('up/down arrows should try focus the month moved by offset in a year view', function(assert) {
        this.calendar.option({
            value: new Date(2020, 4, 6),
            zoomLevel: 'year',
            disabledDates: (args) => {
                const month = args.date.getMonth();
                return month < 4 || month > 7;
            }
        });

        this.$element.trigger('focusin');

        triggerKeydown(this.$element, UP_ARROW_KEY_CODE);
        this.clock.tick(VIEW_ANIMATION_DURATION);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2019, 4, 6), 'closest month by offset has been focused');

        triggerKeydown(this.$element, DOWN_ARROW_KEY_CODE);
        this.clock.tick(VIEW_ANIMATION_DURATION);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 4, 6), 'closest month by offset has been focused');
    });

    QUnit.test('zoomLevel option change should focus the closest available date', function(assert) {
        this.calendar.option({
            value: new Date(2020, 0, 6),
            zoomLevel: 'year',
            disabledDates: (args) => {
                const year = args.date.getYear();
                const date = args.date.getDate();

                if(args.view === 'decade') {
                    return year === 120;
                }

                return date === 6;
            }
        });

        this.$element.trigger('focusin');

        triggerKeydown(this.$element, DOWN_ARROW_KEY_CODE, true);
        this.clock.tick(VIEW_ANIMATION_DURATION);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 0, 7), 'closest date has been focused');

        triggerKeydown(this.$element, UP_ARROW_KEY_CODE, true);
        this.clock.tick(VIEW_ANIMATION_DURATION);
        triggerKeydown(this.$element, UP_ARROW_KEY_CODE, true);
        this.clock.tick(VIEW_ANIMATION_DURATION);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2021, 0, 7), 'closest date has been focused');
    });

    QUnit.test('zoomLevel option change should contour the current view even if current date has not been changed', function(assert) {
        const currentDate = new Date(2020, 0, 6);
        this.calendar.option({
            value: currentDate,
        });

        this.$element.trigger('focusin');

        triggerKeydown(this.$element, UP_ARROW_KEY_CODE, true);
        this.clock.tick(VIEW_ANIMATION_DURATION);
        assert.deepEqual(this.calendar.option('currentDate'), currentDate, 'currentDate has not been changed');
        assert.deepEqual(this.calendar._view.option('contouredDate'), currentDate, 'contoured date is correct');
    });

    QUnit.test('left/right/up/downArrow should work like pageUp/Down when navigating to the disabled month', function(assert) {
        const isAnimationOff = fx.off;
        const animationSpy = sinon.spy(fx, 'animate');

        try {
            const currentDateOnJanuary = new Date(2020, 0, 15);
            const currentDateOnFebruary = new Date(2020, 1, 15);
            const currentDateOnMarch = new Date(2020, 2, 15);
            const currentDateOnApril = new Date(2020, 3, 15);

            this.calendar.option({
                value: currentDateOnJanuary,
                disabledDates: (args) => {
                    const month = args.date.getMonth();
                    return month === 1 || month === 2;
                }
            });

            fx.off = false;
            animationSpy.reset();

            this.$element.trigger('focusin');

            triggerKeydown(this.$element, RIGHT_ARROW_KEY_CODE, true);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), currentDateOnFebruary, 'the same date has been focused');
            assert.equal(animationSpy.callCount, 1, 'view has been changed');

            triggerKeydown(this.$element, RIGHT_ARROW_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), currentDateOnMarch, 'the same date has been focused');
            assert.equal(animationSpy.callCount, 2, 'view has been changed');

            triggerKeydown(this.$element, DOWN_ARROW_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), currentDateOnApril, 'the same date has been focused');
            assert.equal(animationSpy.callCount, 3, 'view has been changed');

            triggerKeydown(this.$element, LEFT_ARROW_KEY_CODE, true);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), currentDateOnMarch, 'the same date has been focused');
            assert.equal(animationSpy.callCount, 4, 'view has been changed');

            triggerKeydown(this.$element, LEFT_ARROW_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), currentDateOnFebruary, 'the same date has been focused');
            assert.equal(animationSpy.callCount, 5, 'view has been changed');

            triggerKeydown(this.$element, UP_ARROW_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), currentDateOnJanuary, 'the same date has been focused');
            assert.equal(animationSpy.callCount, 6, 'view has been changed');

        } finally {
            fx.off = isAnimationOff;
            animationSpy.restore();
        }
    });

    QUnit.test('calendar should properly set the first and the last available cells', function(assert) {
        this.reinit({
            disabledDates: (args) => {
                const disabledDays = [1, 2, 28, 30];
                if(disabledDays.indexOf(args.date.getDate()) > -1) {
                    return true;
                }
            },
            value: this.value,
            focusStateEnabled: true
        });

        this.$element.trigger('focusin');

        triggerKeydown(this.$element, HOME_KEY_CODE);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2010, 10, 3));

        triggerKeydown(this.$element, END_KEY_CODE);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2010, 10, 29));
    });

    QUnit.test('home/end keys should not do anything if all dates in the current month are disabled', function(assert) {
        this.calendar.option('value', new Date(2010, 11, 10));

        this.$element.trigger('focusin');

        triggerKeydown(this.$element, HOME_KEY_CODE);
        assert.deepEqual(this.calendar.option('currentDate'), this.calendar.option('value'));

        triggerKeydown(this.$element, END_KEY_CODE);
        assert.deepEqual(this.calendar.option('currentDate'), this.calendar.option('value'));
    });

    QUnit.test('enter key should not change selected value if focused date is disabled', function(assert) {
        const startDate = new Date(2020, 0, 6);
        this.calendar.option({
            value: startDate,
            disabledDates: (args) => {
                return args.date.getMonth() === 1;
            }
        });

        this.$element.trigger('focusin');

        triggerKeydown(this.$element, RIGHT_ARROW_KEY_CODE, true);
        this.clock.tick(VIEW_ANIMATION_DURATION);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 1, 6), 'current date is correct');

        triggerKeydown(this.$element, ENTER_KEY_CODE);
        assert.deepEqual(this.calendar.option('value'), startDate, 'selected value has not been changed');
    });

    QUnit.test('home/end keys should focus the first/last available date in the current month', function(assert) {
        this.calendar.option({
            value: new Date(2020, 0, 15),
            disabledDates: (args) => {
                const date = args.date.getDate();
                return date <= 7 || date >= 23;
            }
        });

        this.$element.trigger('focusin');

        triggerKeydown(this.$element, HOME_KEY_CODE);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 0, 8));

        triggerKeydown(this.$element, END_KEY_CODE);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 0, 22));
    });

    QUnit.test('the focused date should always be in the [min, max] range', function(assert) {
        const isAnimationOff = fx.off;
        const animationSpy = sinon.spy(fx, 'animate');

        try {
            this.calendar.option({
                value: new Date(2020, 0, 25),
                disabledDates: (args) => {
                    const date = args.date.getDate();
                    return date >= 5 && date <= 20;
                },
                max: new Date(2020, 1, 20),
                min: new Date(2020, 0, 25)
            });

            fx.off = false;
            animationSpy.reset();

            this.$element.trigger('focusin');

            triggerKeydown(this.$element, PAGE_DOWN_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 1, 4), 'focused date is in the range (min, max)');
            assert.equal(animationSpy.callCount, 1, 'view has been changed');

            triggerKeydown(this.$element, PAGE_UP_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 0, 25), 'focused date is in the range (min, max)');
            assert.equal(animationSpy.callCount, 2, 'view has been changed');

        } finally {
            fx.off = isAnimationOff;
            animationSpy.restore();
        }
    });

    QUnit.test('up/downArrow should try focus the same date in the next/previous month when the column is disabled', function(assert) {
        const isAnimationOff = fx.off;
        const animationSpy = sinon.spy(fx, 'animate');

        try {
            this.calendar.option({
                value: new Date(2020, 1, 5),
                disabledDates: (args) => {
                    const day = args.date.getDay();
                    const month = args.date.getMonth();
                    const date = args.date.getDate();
                    return month === 0 && day === 3 || month === 1 && day === 0 || month === 0 && day === 0 && date !== 5;
                }
            });

            fx.off = false;
            animationSpy.reset();

            this.$element.trigger('focusin');

            triggerKeydown(this.$element, UP_ARROW_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 0, 5), 'the closest available date has been focused');
            assert.equal(animationSpy.callCount, 1, 'view has been changed');

            triggerKeydown(this.$element, DOWN_ARROW_KEY_CODE);
            this.clock.tick(VIEW_ANIMATION_DURATION);
            assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 1, 5), 'the closest available date has been focused');
            assert.equal(animationSpy.callCount, 2, 'view has been changed');

        } finally {
            fx.off = isAnimationOff;
            animationSpy.restore();
        }
    });

    QUnit.test('calendar should properly initialize currentDate when initial value is disabled', function(assert) {
        this.reinit({
            disabledDates: (args) => {
                if(args.date.valueOf() === new Date(2010, 10, 10).valueOf()) {
                    return true;
                }
            },
            value: this.value,
            focusStateEnabled: true
        });

        const calendar = this.calendar;
        assert.ok(dateUtils.sameView(calendar.option('zoomLevel'), calendar.option('currentDate'), new Date(2010, 10, 11)));
    });

    QUnit.test('arrowUp/Down should focus cell on top/bottom', function(assert) {
        this.calendar.option({
            disabledDates: (args) => {
                return args.date.getDate() === 15 || args.date.getDate() === 11;
            },
            value: new Date(2020, 0, 16)
        });


        this.$element.trigger('focusin');

        triggerKeydown(this.$element, UP_ARROW_KEY_CODE);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 0, 9), 'cell on top has been focused');

        triggerKeydown(this.$element, DOWN_ARROW_KEY_CODE);
        assert.deepEqual(this.calendar.option('currentDate'), new Date(2020, 0, 16), 'cell on bottom has been focused');
    });

    QUnit.test('value can be changed to disabled date', function(assert) {
        const calendar = this.calendar;
        const disabledDate = new Date(2010, 9, 10);

        calendar.option('value', disabledDate);
        assert.strictEqual(calendar.option('value'), disabledDate, 'value is changed');
    });

    QUnit.test('disabledDates argument contains correct component parameter', function(assert) {
        const stub = sinon.stub();

        this.reinit({
            disabledDates: stub,
            value: this.value,
            focusStateEnabled: true
        });

        const component = stub.lastCall.args[0].component;
        assert.equal(component.NAME, 'dxCalendar', 'Correct component');
    });

    QUnit.test('current day should be the same as selected on init when current month is disabled', function(assert) {
        this.calendar.option('value', new Date(2010, 11, 10));

        assert.deepEqual(this.calendar.option('currentDate'), this.calendar.option('value'), 'currentDate is the same as selected date');
    });

    QUnit.test('current day should be set to the closest available date on init when there is available date on the current month', function(assert) {
        this.calendar.option({
            value: new Date(2010, 10, 14),
            disabledDates: (args) => {
                return args.date.getDate() > 10 && args.date.getDate() <= 20;
            }
        });

        assert.deepEqual(this.calendar.option('currentDate'), new Date(2010, 10, 10), 'currentDate is the closest available date');
    });
});


QUnit.module('Current date', {
    beforeEach: function() {
        fx.off = true;
        this.$element = $('<div>').appendTo('body');

        this.reinit = () => {
            this.$element.remove();
            this.$element = $('<div>').appendTo('body');
        };
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('calendar must contouring date on focusin', function(assert) {
        const $element = this.$element;
        const calendar = $element.dxCalendar({
            value: new Date(2015, 11, 15),
            focusStateEnabled: true
        }).dxCalendar('instance');

        $.each(['month', 'year', 'decade', 'century'], (_, type) => {
            calendar.option('zoomLevel', type);
            $($element).trigger('focusin');

            const $contouredElement = $element.find(toSelector(CALENDAR_CONTOURED_DATE_CLASS));
            assert.equal($contouredElement.length, 1, 'there is a contoured element');
        });
    });

    QUnit.test('click on cell should change current date', function(assert) {
        const calendar = this.$element.dxCalendar({
            value: new Date(2015, 10, 8),
            focusStateEnabled: true
        }).dxCalendar('instance');

        const $cell = $(getCurrentViewInstance(calendar).$element().find('td[data-value=\'2015/11/16\']'));
        $($cell).trigger('dxclick');

        assert.deepEqual(calendar.option('currentDate'), new Date(2015, 10, 16), 'current date is changed correctly');
    });

    QUnit.test('correct currentDate with min and no value', function(assert) {
        const $element = this.$element;
        const calendar = $element.dxCalendar({
            focusStateEnabled: true
        }).dxCalendar('instance');

        const optionsByTypes = {
            'month': { currentDate: new Date(2015, 2, 1), min: new Date(2015, 2, 10) },
            'year': { currentDate: new Date(2015, 1, 1), min: new Date(2015, 2, 1) },
            'decade': { currentDate: new Date(2010, 1, 1), min: new Date(2015, 1, 1) },
            'century': { currentDate: new Date(2000, 1, 1), min: new Date(2040, 1, 1) }
        };

        $.each(['month', 'year', 'decade', 'century'], (_, viewType) => {
            calendar.option({
                zoomLevel: viewType,
                min: optionsByTypes[viewType].min,
                currentDate: optionsByTypes[viewType].currentDate
            });

            assert.deepEqual(calendar.option('currentDate'), calendar.option('min'), 'min cell is contoured');
        });
    });

    QUnit.test('correct change contouredDate after view change if this cell is not present on new view', function(assert) {
        const calendar = this.$element.dxCalendar({
            value: new Date(2015, 0, 31),
            zoomLevel: 'month',
            focusStateEnabled: true
        }).dxCalendar('instance');

        $(this.$element.find(toSelector(CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS))).trigger('dxclick');
        assert.deepEqual(calendar.option('currentDate'), new Date(2015, 1, 28));
    });

    QUnit.test('current date is correct when trying to navigate out of available range', function(assert) {
        const params = {
            'month': { min: new Date(2015, 2, 14), max: new Date(2015, 2, 16), currentDate: new Date(2015, 2, 15) },
            'year': { min: new Date(2015, 1, 17), max: new Date(2015, 3, 20), currentDate: new Date(2015, 2, 15) },
            'decade': { min: new Date(2014, 1, 17), max: new Date(2016, 3, 20), currentDate: new Date(2015, 2, 15) },
            'century': { min: new Date(2005, 1, 17), max: new Date(2025, 3, 20), currentDate: new Date(2015, 0, 1) }
        };

        iterateViews($.proxy((_, type) => {
            this.reinit();

            const $element = this.$element;
            const calendar = this.$element.dxCalendar($.extend(
                {},
                { zoomLevel: type, focusStateEnabled: true },
                params[type])).dxCalendar('instance');

            $($element).trigger('focusin');

            triggerKeydown($element, RIGHT_ARROW_KEY_CODE);
            triggerKeydown($element, RIGHT_ARROW_KEY_CODE);
            assert.deepEqual(calendar.option('currentDate'), calendar.option('max'), 'currentDate is correct');
            assert.deepEqual(getCurrentViewInstance(calendar).option('contouredDate'), calendar.option('currentDate'), 'view contouredDate is the same as calendar currentDate');

            triggerKeydown($element, LEFT_ARROW_KEY_CODE);
            triggerKeydown($element, LEFT_ARROW_KEY_CODE);
            triggerKeydown($element, LEFT_ARROW_KEY_CODE);
            assert.deepEqual(calendar.option('currentDate'), calendar.option('min'), 'min date is countoured');
            assert.deepEqual(getCurrentViewInstance(calendar).option('contouredDate'), calendar.option('currentDate'), 'view contouredDate is the same as calendar currentDate');
        }, this));
    });

    QUnit.test('after pressing upArrow/downArrow button the current view should be changed and the contouredDate should be set correctly', function(assert) {
        const params = {
            'month': { startDate: new Date(2015, 2, 3), expectedDate: new Date(2015, 1, 24) },
            'year': { startDate: new Date(2015, 2, 1), expectedDate: new Date(2014, 10, 1) },
            'decade': { startDate: new Date(2010, 0, 1), expectedDate: new Date(2006, 0, 1) },
            'century': { startDate: new Date(2015, 0, 1), expectedDate: new Date(1975, 0, 1) }
        };

        iterateViews($.proxy((_, type) => {
            this.reinit();

            const $element = this.$element;
            const calendar = $element.dxCalendar({
                zoomLevel: type,
                value: params[type].startDate,
                focusStateEnabled: true
            }).dxCalendar('instance');

            const currentDate = calendar.option('currentDate');

            $($element).trigger('focusin');

            triggerKeydown($element, UP_ARROW_KEY_CODE);
            assert.ok(!dateUtils.sameMonthAndYear(calendar.option('currentDate'), currentDate), 'current view is changed');
            assert.deepEqual(getCurrentViewInstance(calendar).option('contouredDate'), params[type].expectedDate, 'contouredDate is countoured');

            triggerKeydown($element, DOWN_ARROW_KEY_CODE);
            assert.ok(dateUtils.sameMonthAndYear(calendar.option('currentDate'), currentDate), 'current view is changed');
            assert.deepEqual(getCurrentViewInstance(calendar).option('contouredDate'), params[type].startDate, 'contouredDate is countoured');
        }, this));
    });

    QUnit.test('current date should be saved while navigating up and down', function(assert) {
        const $element = this.$element;
        const calendar = $element.dxCalendar({
            value: new Date(2015, 2, 10),
            focusStateEnabled: true
        }).dxCalendar('instance');

        $($element).trigger('focusin');

        triggerKeydown($element, UP_ARROW_KEY_CODE, true);
        assert.deepEqual(calendar.option('currentDate'), new Date(2015, 2, 10), 'contoured is correct on year view (up)');

        triggerKeydown($element, UP_ARROW_KEY_CODE, true);
        assert.deepEqual(calendar.option('currentDate'), new Date(2015, 2, 10), 'contoured is correct on decade view (up)');

        triggerKeydown($element, UP_ARROW_KEY_CODE, true);
        assert.deepEqual(calendar.option('currentDate'), new Date(2015, 2, 10), 'contoured is correct on century view (up)');

        triggerKeydown($element, RIGHT_ARROW_KEY_CODE);
        triggerKeydown($element, DOWN_ARROW_KEY_CODE, true);
        assert.deepEqual(calendar.option('currentDate'), new Date(2025, 2, 10), 'contoured is correct on decade view (down)');

        triggerKeydown($element, DOWN_ARROW_KEY_CODE, true);
        assert.deepEqual(calendar.option('currentDate'), new Date(2025, 2, 10), 'contoured is correct on year view (down)');

        triggerKeydown($element, DOWN_ARROW_KEY_CODE, true);
        assert.deepEqual(calendar.option('currentDate'), new Date(2025, 2, 10), 'contoured is correct on month view (down)');
    });

    QUnit.test('contouredDate should not be rendered when focusStateEnabled is false(T196396)', function(assert) {
        const $calendar = this.$element.dxCalendar({
            focusStateEnabled: false,
            value: new Date(2013, 11, 15)
        });
        const $day = $($calendar.find('[data-value=\'2013/12/11\']')).trigger('dxclick');

        assert.ok(!$day.hasClass(CALENDAR_CONTOURED_DATE_CLASS), 'contoured date class is not attached');
    });
});


QUnit.module('Navigation - click on other view cell', {
    beforeEach: function() {
        fx.off = true;
        this.$element = $('<div>').appendTo('body');
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('go to neighbor view after click on view cell with class \'CALENDAR_OTHER_VIEW_CLASS\'', function(assert) {
        const calendar = this.$element.dxCalendar({
            value: new Date(2015, 2, 15)
        }).dxCalendar('instance');

        $.each(['century', 'decade', 'month'], (_, type) => {
            calendar.option('maxZoomLevel', type);
            calendar.option('zoomLevel', type);

            const $cell = $(calendar.$element().find(toSelector(CALENDAR_OTHER_VIEW_CLASS)).first());
            const date = dataUtils.data($cell.get(0), CALENDAR_DATE_VALUE_KEY);

            $($cell).trigger('dxclick');

            assert.equal(calendar.option('zoomLevel'), type, 'zoomLevel option view is not changed');
            assert.ok(dateUtils[camelize('same ' + type)](calendar.option('currentDate'), date), 'currentDate is in the same ' + type + ' with the cell clicked');
            assert.deepEqual(calendar.option('value'), date, 'calendar value is correct');
        });
    });

    QUnit.test('click on other view cell forces view change', function(assert) {
        const calendar = this.$element.dxCalendar({
            maxZoomLevel: 'month',
            value: new Date(2015, 3, 15)
        }).dxCalendar('instance');
        const $element = this.$element;

        const $cell = $element.find(toSelector(CALENDAR_CELL_CLASS)).eq(2);
        const expectedDate = dataUtils.data($cell.get(0), CALENDAR_DATE_VALUE_KEY);

        expectedDate.setDate(1);
        $($cell).trigger('dxclick');

        assert.deepEqual(calendar.option('currentDate'), expectedDate, 'view is changed');
    });

    QUnit.test('click on other view cell must set value and contoured date on boundary view ', function(assert) {
        const calendar = this.$element.dxCalendar({
            zoomLevel: 'month',
            value: new Date(2015, 3, 15),
            min: new Date(2015, 2, 5),
            focusStateEnabled: true
        }).dxCalendar('instance');
        const $element = this.$element;

        const $cell = $element.find(toSelector(CALENDAR_CELL_CLASS)).eq(1);
        const expectedDate = dataUtils.data($cell.get(0), CALENDAR_DATE_VALUE_KEY);

        $($element).trigger('focusin');
        $($cell).trigger('dxclick');

        assert.deepEqual(calendar.option('value'), expectedDate, 'view is changed');
        assert.deepEqual(calendar._view.option('contouredDate'), expectedDate, 'view is changed');
    });

    QUnit.test('Click on other view cell must set value correctly', function(assert) {
        const calendar = this.$element.dxCalendar({
            value: new Date(2015, 11, 1),
            currentDate: new Date(2015, 11, 1)
        }).dxCalendar('instance');

        for(let year = 2015; year < 2017; year++) {
            for(let month = 11; month > 0; month--) {
                calendar.option('value', new Date(year, month, 1));
                const $cellLastPrevMonth = $(calendar._view.$element().find(toSelector(CALENDAR_CELL_CLASS)).not(toSelector(CALENDAR_OTHER_VIEW_CLASS)).first().prev());

                if($cellLastPrevMonth.length) {
                    const expected = dataUtils.data($cellLastPrevMonth.get(0), CALENDAR_DATE_VALUE_KEY);
                    $($cellLastPrevMonth).trigger('dxclick');

                    assert.deepEqual(calendar.option('value'), expected, 'view is changed and value is correct');
                }
            }
        }
    });
});


QUnit.module('Navigation - swiping', {
    beforeEach: function() {
        fx.off = true;

        this.$element = $('<div>').appendTo('body');
        this.calendar = this.$element.dxCalendar({
            currentDate: new Date(2013, 9, 15),
            firstDayOfWeek: 1
        }).dxCalendar('instance');

        this.pointer = pointerMock(this.$element).start();

        this.reinit = (options) => {
            this.$element.remove();
            this.$element = $('<div>').appendTo('body');
            this.calendar = this.$element.dxCalendar(options).dxCalendar('instance');
            this.pointer = pointerMock(this.$element).start();
        };
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('views count on continuous swipe', function(assert) {
        assert.expect(1);

        this.pointer.swipeStart().swipe(0.01);
        assert.equal(this.$element.find('table').length, 3, 'Month views count is equal to 3');
    });

    QUnit.test('views offset on continuous right swipe', function(assert) {
        const width = this.$element.width();
        const offset = 0.5 * width;

        this.pointer.swipeStart().swipe(0.5);

        const $tables = this.$element.find(toSelector(CALENDAR_BODY_CLASS) + ' .dx-widget');
        const $wrapper = this.$element.find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS)).eq(0);

        assert.equal(translator.locate($wrapper).left, offset, 'Views wrapper position is correct');
        assert.equal(translator.locate($tables.eq(0)).left, 0, 'First view position is correct');
        assert.equal(translator.locate($tables.eq(1)).left, -width, 'Second view position is correct');
    });

    QUnit.test('views offset on continuous left swipe', function(assert) {
        const width = this.$element.width();
        const offset = 0.5 * width;

        this.pointer.swipeStart().swipe(-0.5);

        const $tables = this.$element.find(toSelector(CALENDAR_BODY_CLASS) + ' .dx-widget');
        const $wrapper = this.$element.find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS)).eq(0);

        assert.equal(translator.locate($wrapper).left, -offset, 'Views wrapper position is correct');
        assert.equal(translator.locate($tables.eq(0)).left, 0, 'First view position is correct');
        assert.equal(translator.locate($tables.eq(1)).left, -width, 'Second view position is correct');
        assert.equal(translator.locate($tables.eq(2)).left, width, 'Third view position is correct');
    });

    QUnit.test('views after canceled right swipe', function(assert) {
        const currentDate = new Date(this.calendar.option('currentDate'));

        this.pointer.swipeStart().swipeEnd(0, 0.4);

        assert.equal(this.$element.find('table').length, 3, 'Calendar contains one view after swipe end');
        assert.equal(this.$element.find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS)).position().left, 0, 'Views wrapper position is correct');
        assert.equal(getCurrentViewInstance(this.calendar).$element().position().left, 0, 'View position is correct');
        assert.equal(this.calendar.option('currentDate').getMonth(), currentDate.getMonth(), 'Current month is correct');
    });

    QUnit.test('views after canceled left swipe', function(assert) {
        const currentDate = new Date(this.calendar.option('currentDate'));

        this.pointer.swipeStart().swipeEnd(0, -0.4);

        assert.equal(this.$element.find('table').length, 3, 'Calendar contains one view after swipe end');
        assert.equal(this.$element.find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS)).position().left, 0, 'Views wrapper position is correct');
        assert.equal(getCurrentViewInstance(this.calendar).$element().position().left, 0, 'View position is correct');
        assert.equal(this.calendar.option('currentDate').getMonth(), currentDate.getMonth(), 'Current month is correct');
    });

    QUnit.test('views after right long swipe end', function(assert) {
        const currentDate = new Date(this.calendar.option('currentDate'));
        currentDate.setMonth(currentDate.getMonth() - 1);

        this.pointer.swipeStart().swipe(0.6).swipeEnd(1, 0.6);

        assert.equal(this.$element.find('table').length, 3, 'Calendar contains one view after long right swipe end');
        assert.equal(this.$element.find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS)).position().left, 0, 'Views wrapper position is correct');
        assert.equal(getCurrentViewInstance(this.calendar).$element().position().left, 0, 'View position is correct');
        assert.equal(this.calendar.option('currentDate').getMonth(), currentDate.getMonth(), 'Current month is correct');
    });

    QUnit.test('views after left long swipe end', function(assert) {
        const currentDate = new Date(this.calendar.option('currentDate'));
        currentDate.setMonth(currentDate.getMonth() + 1);

        this.pointer.swipeStart().swipe(-0.6).swipeEnd(-1, -0.6);

        assert.equal(this.$element.find('table').length, 3, 'Calendar contains one view after long left swipe end');
        assert.equal(this.$element.find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS)).position().left, 0, 'Views wrapper position is correct');
        assert.equal(getCurrentViewInstance(this.calendar).$element().position().left, 0, 'View position is correct');
        assert.equal(this.calendar.option('currentDate').getMonth(), currentDate.getMonth(), 'Current month is correct');
    });

    QUnit.test('views after fast long swipe end', function(assert) {
        this.pointer.down().move(-100).move(-1000).up();
        assert.ok(true, 'test must pass');
    });

    QUnit.test('views after right short swipe end', function(assert) {
        const currentDate = new Date(this.calendar.option('currentDate'));

        currentDate.setMonth(currentDate.getMonth() - 1);
        this.pointer.swipeStart().swipe(0.4).swipeEnd(1, 0.4);

        assert.equal(this.$element.find('table').length, 3, 'Calendar contains one view after short right swipe end');
        assert.equal(this.$element.find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS)).position().left, 0, 'Views wrapper position is correct');
        assert.equal(getCurrentViewInstance(this.calendar).$element().position().left, 0, 'View position is correct');
        assert.equal(this.calendar.option('currentDate').getMonth(), currentDate.getMonth(), 'Current month is correct');
    });

    QUnit.test('views after left short swipe end', function(assert) {
        const currentDate = new Date(this.calendar.option('currentDate'));
        currentDate.setMonth(currentDate.getMonth() + 1);

        this.pointer.swipeStart().swipe(-0.4).swipeEnd(-1, -0.4);

        assert.equal(this.$element.find('table').length, 3, 'Calendar contains one view after short left swipe end');
        assert.equal(this.$element.find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS)).position().left, 0, 'Views wrapper position is correct');
        assert.equal(getCurrentViewInstance(this.calendar).$element().position().left, 0, 'View position is correct');
        assert.equal(this.calendar.option('currentDate').getMonth(), currentDate.getMonth(), 'Current month is correct');
    });

    QUnit.test('should not overlap during multidirectional swipe', function(assert) {
        this.pointer.swipeStart().swipe(-0.1).swipe(0.01);

        const $views = this.$element.find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS) + ' .dx-widget');

        assert.equal($views.length, 3, 'correct views count');
        assert.ok($views.eq(1).position().left < 0, 'first additional view located at right');
        assert.ok($views.eq(2).position().left > 0, 'second additional view located at left');
    });

    QUnit.test('views after right swipe end in rtl mode', function(assert) {
        this.reinit({
            currentDate: new Date(2013, 9, 15),
            firstDayOfWeek: 1,
            rtlEnabled: true
        });

        const calendar = this.calendar;

        const newDate = new Date(calendar.option('currentDate'));
        newDate.setMonth(newDate.getMonth() + 1);

        this.pointer.swipeStart().swipe(0.6).swipeEnd(1, 0.6);

        assert.equal(this.$element.find('table').eq(0).position().left, 0, 'View position is correct');
        assert.equal(calendar.option('currentDate').getMonth(), newDate.getMonth(), 'Current month is correct');
    });

    QUnit.test('views after left swipe end in rtl mode', function(assert) {
        assert.expect(2);

        this.reinit({
            currentDate: new Date(2013, 9, 15),
            firstDayOfWeek: 1,
            rtlEnabled: true
        });

        const calendar = this.calendar;

        const newDate = new Date(calendar.option('currentDate'));
        newDate.setMonth(newDate.getMonth() - 1);

        this.pointer.swipeStart().swipe(-0.6).swipeEnd(-1, -0.6);

        assert.equal(getCurrentViewInstance(calendar).$element().position().left, 0, 'View position is correct');
        assert.equal(calendar.option('currentDate').getMonth(), newDate.getMonth(), 'Current month is correct');
    });

    QUnit.test('calendar must not leak views when navigating by swipe gesture', function(assert) {
        this.pointer.swipeStart().swipe(-0.6).swipeEnd(-1);
        this.pointer.swipeStart().swipe(-0.6).swipeEnd(-1);
        this.pointer.swipeStart().swipe(-0.6).swipeEnd(-1);
        this.pointer.swipeStart().swipe(-0.6).swipeEnd(-1);
        assert.equal(this.$element.find('table').length, 3, 'correct views count');
    });

    QUnit.test('correct end position for animation after long left swipe end', function(assert) {
        assert.expect(1);

        const origAnimate = fx.animate;

        try {
            const $views = this.$element.find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS) + ' .dx-widget');
            const viewWidth = $views.eq(0).width();

            fx.animate = ($element, config) => {
                assert.equal(config.to.left, -viewWidth, 'view will be animated to bound');
                return $.Deferred().resolve().promise();
            };

            this.pointer.swipeStart().swipe(-2.3).swipeEnd(-2, -2.3);

        } finally {
            fx.animate = origAnimate;
        }
    });

    QUnit.test('correct end position for animation after long right swipe end', function(assert) {
        assert.expect(1);

        const origAnimate = fx.animate;

        try {
            const $views = this.$element.find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS) + ' .dx-widget');
            const viewWidth = $views.eq(0).width();

            fx.animate = ($element, config) => {
                assert.equal(config.to.left, viewWidth, 'view will be animated to bound');
                return $.Deferred().resolve().promise();
            };

            this.pointer.swipeStart().swipe(2.3).swipeEnd(2, 2.3);

        } finally {
            fx.animate = origAnimate;
        }
    });

    QUnit.test('correct views wrapper position after swiping from boundary view', function(assert) {
        this.reinit({
            currentDate: new Date(2015, 8, 15),
            min: new Date(2015, 8, 8),
            max: new Date(2015, 8, 26)
        });

        const $viewsWrapper = this.$element.find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS));

        this.pointer.swipeStart().swipe(-0.8).swipeEnd(0, -0.8);
        assert.equal($viewsWrapper.position().left, 0, 'views wrapper position is correct');

        this.pointer.swipeStart().swipe(0.8).swipeEnd(0, 0.8);
        assert.equal($viewsWrapper.position().left, 0, 'views wrapper position is correct');
    });

    QUnit.test('correct views wrapper position after canceled swipe', function(assert) {
        this.reinit({
            currentDate: new Date(2015, 8, 15),
            min: new Date(2015, 8, 8),
            max: new Date(2015, 8, 26)
        });

        const $viewsWrapper = this.$element.find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS));

        this.pointer.swipeStart().swipe(-0.2).swipeEnd(0, -0.2);
        assert.equal($viewsWrapper.position().left, 0, 'views wrapper position is correct');

        this.pointer.swipeStart().swipe(0.2).swipeEnd(0, 0.2);
        assert.equal($viewsWrapper.position().left, 0, 'views wrapper position is correct');
    });

    // TODO: get rid of mocking private method
    QUnit.test('performing a micro-swipe should not make the calendar jump by navigating to the same month', function(assert) {
        const swipeEnd = $.Event(swipeEvents.end, { offset: 0, targetOffset: 0 });
        this.calendar._navigate = () => {
            assert.ok(false);
        };
        assert.expect(0);
        $(this.$element).trigger(swipeEvents.start);
        $(this.$element).trigger(swipeEnd);
    });

    QUnit.test('maxRightOffset and maxLeftOffset are correct when rltEnabled=true (T322033)', function(assert) {
        this.reinit({
            rtlEnabled: true,
            min: new Date(2015, 10, 10),
            max: new Date(2015, 11, 11),
            value: new Date(2015, 10, 15)
        });

        $(this.$element).on(swipeEvents.start, (e) => {
            assert.equal(e.maxRightOffset, 1);
            assert.equal(e.maxLeftOffset, 0);
        });

        this.pointer
            .swipeStart()
            .swipe(-0.8)
            .swipeEnd(0, -0.8);
    });
});


QUnit.module('Aria accessibility', {
    beforeEach: function() {
        fx.off = true;
        this.$element = $('<div>').appendTo('body');
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('role for calendar widget', function(assert) {
        const $element = this.$element;

        $element.dxCalendar();

        assert.equal($element.attr('role'), 'listbox', 'role is correct');
        assert.equal($element.attr('aria-label'), 'Calendar', 'label is correct');
    });

    QUnit.test('aria-activedescendant on widget should point to the focused cell', function(assert) {
        const $element = this.$element;

        $element.dxCalendar({
            focusStateEnabled: true
        });

        $($element).trigger('focusin');

        const $cell = $element.find(toSelector(CALENDAR_CONTOURED_DATE_CLASS));

        assert.notEqual($cell.attr('id'), undefined, 'id exists');
        assert.equal($element.attr('aria-activedescendant'), $cell.attr('id'), 'cell\'s id and element\'s activedescendant are equal');
    });

    QUnit.test('onContouredChanged action on init', function(assert) {
        assert.expect(2);

        this.$element.dxCalendar({
            value: null,
            focusStateEnabled: true,
            onContouredChanged: (e) => {
                assert.ok(true, 'contouredChanged was triggered on render');
                assert.ok(e.actionValue, 'action has aria id as a parameter');
            }
        });

        $(this.$element).trigger('focusin');
    });

    QUnit.test('onContouredChanged action on option change', function(assert) {
        assert.expect(2);

        this.$element.dxCalendar({
            value: null,
            onContouredChanged: (e) => {
                assert.ok(true, 'contouredChanged was triggered on render');
                assert.ok(e.actionValue, 'action has aria id as a parameter');
            },
            focusStateEnabled: true
        });
    });

    QUnit.test('element should have correct aria-activedescendant attribute (T310017)', function(assert) {
        const $element = this.$element;

        $element.dxCalendar({
            date: new Date(2015, 5, 1),
            value: new Date(2015, 5, 1),
            firstDayOfWeek: 1,
            focusStateEnabled: true
        });

        const keyboard = keyboardMock($element);

        $($element).trigger('focusin');

        let $cell = $element.find(toSelector(CALENDAR_CONTOURED_DATE_CLASS));
        assert.equal($element.attr('aria-activedescendant'), $cell.attr('id'), 'contoured date cell id and activedescendant are equal');

        keyboard.press('right');
        $cell = $element.find(toSelector(CALENDAR_CONTOURED_DATE_CLASS));
        assert.equal($element.attr('aria-activedescendant'), $cell.attr('id'), 'new contoured date cell id and activedescendant are equal');

        keyboard.press('enter');
        $cell = $element.find(toSelector(CALENDAR_SELECTED_DATE_CLASS));
        assert.equal($element.attr('aria-activedescendant'), $cell.attr('id'), 'selected cell id and activedescendant are equal');
    });

    QUnit.test('role for calendar cells', function(assert) {
        const calendar = this.$element.dxCalendar().dxCalendar('instance');
        const $cell = $(getCurrentViewInstance(calendar).$element().find(toSelector(CALENDAR_CELL_CLASS)).first());

        assert.equal($cell.attr('role'), 'option', 'aria role is correct');
    });

    QUnit.test('aria id on contoured date cell', function(assert) {
        const calendar = this.$element.dxCalendar({
            value: new Date(2015, 5, 1),
            focusStateEnabled: true
        }).dxCalendar('instance');

        const keyboard = keyboardMock(this.$element);

        $(this.$element).trigger('focusin');

        let $cell = $(getCurrentViewInstance(calendar).$element().find(toSelector(CALENDAR_CONTOURED_DATE_CLASS)));
        const cellId = $cell.attr('id');

        assert.equal($cell.attr('aria-selected'), 'true', 'aria-selected exists');
        assert.notEqual(cellId, undefined, 'contoured cell has id');

        keyboard.press('right');
        assert.equal($cell.attr('id'), undefined, 'id was removed from old contoured date cell');

        $cell = $(getCurrentViewInstance(calendar).$element().find(toSelector(CALENDAR_CONTOURED_DATE_CLASS)));
        const newCellId = $cell.attr('id');
        assert.notEqual(cellId, undefined, 'id was added to new contoured date cell');
        assert.notEqual(cellId, newCellId, 'id was refreshed');

        keyboard.press('enter');
        $cell = $(getCurrentViewInstance(calendar).$element().find(toSelector(CALENDAR_CONTOURED_DATE_CLASS)));
        assert.notEqual($cell.attr('id'), undefined, 'id was not remove when cell was selected');
        assert.notEqual($cell.attr('id'), newCellId, 'id was refreshed again');
    });

    QUnit.test('aria-selected on selected date cell', function(assert) {
        const calendar = this.$element.dxCalendar({
            value: new Date(2015, 5, 1),
            focusStateEnabled: true
        }).dxCalendar('instance');

        const keyboard = keyboardMock(this.$element);

        let $cell = $(getCurrentViewInstance(calendar).$element().find(toSelector(CALENDAR_SELECTED_DATE_CLASS)));
        assert.equal($cell.attr('aria-selected'), 'true', 'aria-selected was added to the cell');

        keyboard.press('right');
        assert.equal($cell.attr('aria-selected'), 'true', 'aria-selected still on the cell');

        keyboard.press('enter');
        assert.notOk($cell.attr('aria-selected'), 'aria-selected was removed from the old cell');

        $cell = $(getCurrentViewInstance(calendar).$element().find(toSelector(CALENDAR_SELECTED_DATE_CLASS)));
        assert.equal($cell.attr('aria-selected'), 'true', 'aria-selected was added to the new cell');
    });

    QUnit.test('cell id should be set before widget activedescendant attribute', function(assert) {
        const calendar = this.$element.dxCalendar({
            focusStateEnabled: true
        }).dxCalendar('instance');

        $(this.$element).trigger('focusin');

        const setAriaSpy = sinon.spy(calendar, 'setAria');
        const idSpy = setAriaSpy.withArgs('id');
        const activeDescendantSpy = setAriaSpy.withArgs('activedescendant');

        calendar.option('currentDate', new Date(2015, 10, 18));

        try {
            sinon.assert.callOrder(idSpy, activeDescendantSpy);
            assert.ok(true, 'order is correct');
        } catch(err) {
            assert.ok(false, 'order should be correct');
        }
    });

    QUnit.test('aria id on contoured cell after zoom level change (T321824)', function(assert) {
        const calendar = this.$element.dxCalendar({
            focusStateEnabled: true,
            zoomLevel: 'month'
        }).dxCalendar('instance');

        calendar.option('zoomLevel', 'year');
        $(this.$element).trigger('focusin');

        const $contouredDateCell = this.$element.find('.' + CALENDAR_CONTOURED_DATE_CLASS);

        assert.ok($contouredDateCell.attr('id'), 'aria id exists');
        assert.equal($contouredDateCell.attr('id'), this.$element.attr('aria-activedescendant'), 'cell has correct id');
    });

    QUnit.test('aria id on contoured cell after view change (T321824)', function(assert) {
        const clock = sinon.useFakeTimers();

        try {
            fx.off = false;

            this.$element.dxCalendar({
                focusStateEnabled: true,
                value: new Date(2015, 5, 1)
            });

            const keyboard = keyboardMock(this.$element);

            keyboard.press('up');
            clock.tick(VIEW_ANIMATION_DURATION);
            $(this.$element).trigger('focusin');

            const $contouredDateCell = this.$element.find('.' + CALENDAR_CONTOURED_DATE_CLASS);

            assert.ok($contouredDateCell.attr('id'), 'aria id exists');
            assert.equal($contouredDateCell.attr('id'), this.$element.attr('aria-activedescendant'), 'cell has correct id');

        } finally {
            fx.off = true;
            clock.restore();
        }
    });
});


QUnit.module('Regression', {
    beforeEach: function() {
        fx.off = true;
        this.$element = $('<div>').appendTo('body');

        this.reinit = (options) => {
            this.$element.remove();
            this.$element = $('<div>').appendTo('body');
        };
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('T182880: dxDateBox - Can not list to next month in Firefox', function(assert) {
        const calendar = this.$element.dxCalendar({
            value: new Date(2013, 11, 31)
        }).dxCalendar('instance');

        const $nextMonthButton = this.$element.find(toSelector(CALENDAR_NAVIGATOR_NEXT_MONTH_CLASS));

        $($nextMonthButton).trigger('dxclick');
        assert.equal(calendar.option('currentDate').getMonth(), 0);
    });

    QUnit.test('T182866: dxCalendar shows 31 Dec. 2013 twice in Firefox and Yandex browsers', function(assert) {
        const calendar = this.$element.dxCalendar({
            value: new Date(2013, 11, 31)
        }).dxCalendar('instance');
        const $view = $(getCurrentViewInstance(calendar).$element());

        const $cells = $view.find(toSelector(CALENDAR_CELL_CLASS));
        assert.equal($cells.filter((index, element) => {
            return $(element).text() === '31';
        }).length, 1);
    });

    QUnit.test('T190112: dxCalendar - month is not changed when click on cell in Firefox (December 2013 -> January 2014)', function(assert) {
        const calendar = this.$element.dxCalendar({
            currentDate: new Date(2013, 11, 31)
        }).dxCalendar('instance');

        $(this.$element.find(toSelector(CALENDAR_CELL_CLASS) + '[data-value=\'2014/01/01\']')).trigger('dxclick');
        assert.equal(calendar.option('currentDate').getMonth(), 0);
    });

    QUnit.test('T190814: dxCalendar - unable to navigate by keyboard from December 2013 to January 2013 in Firefox', function(assert) {
        const calendar = this.$element.dxCalendar({
            value: new Date(2013, 11, 31),
            currentDate: new Date(2013, 11, 31),
            focusStateEnabled: true
        }).dxCalendar('instance');

        $(this.$element).trigger($.Event('keydown', { key: RIGHT_ARROW_KEY_CODE }));
        assert.equal(calendar.option('currentDate').getMonth(), 0);
    });
});


QUnit.module('dxCalendar number and string value support', {
    beforeEach: function() {
        this.$element = $('<div>').appendTo('body');
        fx.off = true;
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('widget should work correct if the \'value\', \'min\' and \'max\' options have string type', function(assert) {
        this.$element.dxCalendar({
            value: '2016/04/11',
            min: '2016/03/11',
            max: '2016/05/11'
        });

        assert.ok(true, 'it\'s ok');
    });

    QUnit.test('widget should work correct if the \'value\', \'min\' and \'max\' options have number type', function(assert) {
        const value = new Date(2016, 3, 11);
        const min = new Date(2016, 2, 11);
        const max = new Date(2016, 4, 11);

        this.$element.dxCalendar({
            value: value.getTime(),
            min: min.getTime(),
            max: max.getTime()
        });

        assert.ok(true, 'it\'s ok');
    });

    QUnit.test('widget should work correct if the only \'min\' and \'max\' options have number type', function(assert) {
        const min = new Date(2016, 2, 11);
        const max = new Date(2016, 4, 11);

        this.$element.dxCalendar({
            min: min.getTime(),
            max: max.getTime()
        });

        assert.ok(true, 'it\'s ok');
    });

    QUnit.test('selected cell is correct if the \'value\' has string type', function(assert) {
        this.$element.dxCalendar({
            value: '2016/04/11'
        });

        const cellValue = this.$element.find('.' + CALENDAR_SELECTED_DATE_CLASS).data('value');
        assert.deepEqual(cellValue, '2016/04/11', 'cell value is correct');
    });

    QUnit.test('selected cell is correct if the \'value\' has number type', function(assert) {
        const numberValue = (new Date(2016, 3, 11)).getTime();

        this.$element.dxCalendar({
            value: numberValue
        });

        const cellValue = this.$element.find('.' + CALENDAR_SELECTED_DATE_CLASS).data('value');
        assert.deepEqual(cellValue, '2016/04/11', 'cell value is correct');
    });

    QUnit.test('new cell selection should change value correct if the value type is string', function(assert) {
        this.$element.dxCalendar({
            value: '2016/04/11'
        });

        this.$element
            .find('.' + CALENDAR_SELECTED_DATE_CLASS)
            .next('.' + CALENDAR_CELL_CLASS)
            .trigger('dxclick');

        assert.equal(this.$element.dxCalendar('option', 'value'), '2016/04/12', 'value is correct');
    });

    QUnit.test('new cell selection should change value correct if the value type is string', function(assert) {
        this.$element.dxCalendar({
            value: (new Date(2016, 3, 11)).getTime()
        });

        this.$element
            .find('.' + CALENDAR_SELECTED_DATE_CLASS)
            .next('.' + CALENDAR_CELL_CLASS)
            .trigger('dxclick');

        assert.equal(this.$element.dxCalendar('option', 'value'), (new Date(2016, 3, 12)).getTime(), 'value is correct');
    });

    QUnit.test('datetime value should work correct if the value type is string', function(assert) {
        this.$element.dxCalendar({
            value: '2016/04/11 17:29'
        });

        assert.ok(true, 'it\'s ok');
    });

    QUnit.test('datetime value should be changed without time changing if the value type is string', function(assert) {
        this.$element.dxCalendar({
            value: '2016/04/11 17:29:00'
        });

        this.$element
            .find('.' + CALENDAR_SELECTED_DATE_CLASS)
            .next('.' + CALENDAR_CELL_CLASS)
            .trigger('dxclick');

        assert.equal(this.$element.dxCalendar('option', 'value'), '2016/04/12 17:29:00', 'value is correct');
    });

    QUnit.test('datetime value should be changed without time changing if the value type is ISO string', function(assert) {
        const defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = true;

        try {
            this.$element.dxCalendar({
                value: '2016-04-11T17:29:00',
                min: '2016-04-10T17:29:00',
                max: '2016-04-13T17:29:00'
            });

            this.$element
                .find('.' + CALENDAR_SELECTED_DATE_CLASS)
                .next('.' + CALENDAR_CELL_CLASS)
                .trigger('dxclick');

            assert.equal(this.$element.dxCalendar('option', 'value'), '2016-04-12T17:29:00', 'value is correct');
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    QUnit.test('datetime value should be changed without time changing if the value type is ISO string with dateSerializationFormat', function(assert) {
        this.$element.dxCalendar({
            value: '2016-04-11T00:00:00Z',
            dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssZ'
        });

        this.$element
            .find('.' + CALENDAR_SELECTED_DATE_CLASS)
            .next('.' + CALENDAR_CELL_CLASS)
            .trigger('dxclick');

        assert.equal(this.$element.dxCalendar('option', 'value'), '2016-04-12T00:00:00Z', 'value is correct');
    });
});
