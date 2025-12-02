import $ from 'jquery';
import { camelize } from 'core/utils/inflector';
import translator from 'common/core/animation/translator';
import dateUtils from 'core/utils/date';
import dateSerialization from 'core/utils/date_serialization';
import swipeEvents from 'common/core/events/swipe';
import fx from 'common/core/animation/fx';
import Views from '__internal/ui/calendar/calendar.views';
import pointerMock from '../../helpers/pointerMock.js';
import keyboardMock from '../../helpers/keyboardMock.js';
import config from 'core/config';
import dataUtils from 'core/element_data';
import { normalizeKeyName } from 'common/core/events/utils/index';
import localization from 'localization';

import 'ui/calendar';
import 'fluent_blue_light.css!';

// calendar
const CALENDAR_BODY_CLASS = 'dx-calendar-body';
const CALENDAR_CELL_CLASS = 'dx-calendar-cell';
const CALENDAR_WEEK_NUMBER_CELL_CLASS = 'dx-calendar-week-number-cell';
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
const getAdditionalViewInstance = (calendar) => {
    return calendar._additionalView;
};
const getAfterViewInstance = (calendar) => {
    return calendar._afterView;
};

const iterateViews = (callback) => {
    const views = ['month', 'year', 'decade', 'century'];
    $.each(views, callback);
};

function triggerKeydown($element, key, additionOptions) {
    const options = { key: key };

    $.extend(options, additionOptions);

    const e = $.Event('keydown', options);
    $element.trigger(e);
}

const commandKeysConfigs = [{
    name: 'ctrl',
    optionConfig: { ctrlKey: true }
}, {
    name: 'command',
    optionConfig: { metaKey: true }
}];

QUnit.module('Hidden input', {
    beforeEach: function() {
        fx.off = true;

        this.$element = $('<div>').appendTo('#qunit-fixture');
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
        this.$element = $('<div>').appendTo('#qunit-fixture');
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
        const brick = $('<div></div>');
        const immediateClick = (element) => {
            const event = document.createEvent('MouseEvent');

            event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            element.dispatchEvent(event);
        };
        let actualScrollTop;
        try {
            brick.appendTo('#qunit-fixture');
            brick.css('height', '50000px');
            brick.insertBefore(this.$element);
            $window.scrollTop(50000);
            actualScrollTop = $window.scrollTop();
            if(actualScrollTop > 0) {
                immediateClick(this.$element.find(`.${CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS}`)[0]);
                assert.ok($window.scrollTop() >= actualScrollTop);
            } else {
                assert.ok(true, 'scrollTop does not work on older Android browsers, and so this test will not work');
            }
        } finally {
            brick.remove();
        }
    });

    QUnit.test('Calendar must display the current month and year', function(assert) {
        const navigatorCaption = this.$element.find(`.${CALENDAR_CAPTION_BUTTON_CLASS}`);
        assert.equal(navigatorCaption.text(), 'June 2015');
    });
});


QUnit.module('Navigator integration', {
    beforeEach: function() {
        fx.off = true;
        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.calendar = this.$element.dxCalendar({
            value: new Date(2015, 5, 13)
        }).dxCalendar('instance');

        this.$navigatorCaption = this.$element.find(`.${CALENDAR_CAPTION_BUTTON_CLASS}`);
        this.$navigatorNext = this.$element.find(`.${CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS}`);
        this.$navigatorPrev = this.$element.find(`.${CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS}`);

        this.reinit = (options) => {
            this.$element.remove();
            this.$element = $('<div>').appendTo('#qunit-fixture');
            this.calendar = this.$element.dxCalendar(options).dxCalendar('instance');

            this.$navigatorCaption = this.$element.find(`.${CALENDAR_CAPTION_BUTTON_CLASS}`);
            this.$navigatorNext = this.$element.find(`.${CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS}`);
            this.$navigatorPrev = this.$element.find(`.${CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS}`);
        };
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.module('navigator caption should be correct (T962871)', () => {
        const nextCaption = {
            'month': 'July 2015',
            'year': '2016',
            'decade': '2020-2029',
            'century': '2100-2199',
        };
        const prevCaption = {
            'month': 'May 2015',
            'year': '2014',
            'decade': '2000-2009',
            'century': '1900-1999',
        };
        const zoomLevels = ['month', 'year', 'decade', 'century'];

        [true, false].forEach(rtlEnabled => {
            QUnit.test(`after navigate to next, rtlEnabled: ${rtlEnabled}`, function(assert) {
                this.reinit({ rtlEnabled, value: new Date(2015, 5, 13) });

                $.each(zoomLevels, (_, zoomLevel) => {
                    this.calendar.option({ zoomLevel });

                    this.$navigatorNext.trigger('dxclick');
                    assert.strictEqual(this.$navigatorCaption.text(), nextCaption[zoomLevel], 'caption is correct');
                });
            });

            QUnit.test(`after navigate to prev, rtlEnabled: ${rtlEnabled}`, function(assert) {
                this.reinit({ rtlEnabled, value: new Date(2015, 5, 13) });

                $.each(zoomLevels, (_, zoomLevel) => {
                    this.calendar.option({ zoomLevel });

                    this.$navigatorPrev.trigger('dxclick');
                    assert.strictEqual(this.$navigatorCaption.text(), prevCaption[zoomLevel], 'caption is correct');
                });
            });
        });
    });

    QUnit.test('calendar width should not be changed after change zoom level by click on caption button if width option is set', function(assert) {
        const initialWidthValue = '400px';

        this.reinit({
            width: '400px',
            value: new Date(2021, 9, 17)
        });

        const $navigatorCaptionButton = this.$element.find(`.${CALENDAR_CAPTION_BUTTON_CLASS}`);

        $navigatorCaptionButton.trigger('dxclick');

        assert.strictEqual(this.calendar.option('zoomLevel'), 'year', 'zoom level is changed');
        assert.strictEqual(this.$element.css('width'), initialWidthValue, 'width is correct');
    });

    [true, false].forEach((rtlEnabled) => {
        QUnit.test(`calendar must change the current date when navigating to previous and next view, rtlEnabled=${rtlEnabled}`, function(assert) {
            this.reinit({
                rtlEnabled,
            });

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

    QUnit.test('should not throw any errors if value on initialization is empty string (T1257679)', function(assert) {
        try {
            this.reinit({
                value: ''
            });
        } catch(e) {
            assert.ok(false, `error: ${e.message}`);
        } finally {
            assert.ok(true, 'there is no error');
        }
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

    [true, false].forEach((rtlEnabled) =>{
        QUnit.test(`view change buttons should be disabled if min/max has been reached, rtlEnabled=${rtlEnabled}`, function(assert) {
            this.reinit({
                rtlEnabled,
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
    });

    [
        {
            viewsCount: 1,
            expectedText: 'May 2015',
            isLeftSwipe: false
        },
        {
            viewsCount: 2,
            expectedText: 'May 2015June 2015',
            isLeftSwipe: false
        },
        {
            viewsCount: 1,
            expectedText: 'July 2015',
            isLeftSwipe: true
        },
        {
            viewsCount: 2,
            expectedText: 'July 2015August 2015',
            isLeftSwipe: true
        },
    ].forEach(({ viewsCount, expectedText, isLeftSwipe }) => {
        QUnit.test(`navigator caption is correct after fast ${isLeftSwipe ? 'left' : 'right'} short swipe (viewsCount = ${viewsCount})`, function(assert) {
            this.calendar.option('viewsCount', viewsCount);
            const currentDate = new Date(this.calendar.option('currentDate'));
            currentDate.setMonth(currentDate.getMonth() + isLeftSwipe ? -1 : 1);

            const pointer = pointerMock(this.$element).start();
            const moveValue = isLeftSwipe ? -10 : 10;
            pointer.down().move(moveValue).up();

            const navigatorText = this.$navigatorCaption.text();

            assert.equal(navigatorText, expectedText, 'navigator caption is correct');
        });
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

    [true, false].forEach(focusStateEnabled => {
        QUnit.test(`navigator and today buttons should have focusStateEnabled=${focusStateEnabled} if calendar focusStateEnabled=${focusStateEnabled} on init`, function(assert) {
            this.reinit({
                focusStateEnabled,
                showTodayButton: true,
            });

            const nextButton = this.$element.find(`.${CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS}`).dxButton('instance');
            const caption = this.$element.find(`.${CALENDAR_CAPTION_BUTTON_CLASS}`).dxButton('instance');
            const prevButton = this.$element.find(`.${CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS}`).dxButton('instance');
            const todayButton = this.$element.find(`.${CALENDAR_TODAY_BUTTON_CLASS}`).dxButton('instance');

            assert.strictEqual(prevButton.option('focusStateEnabled'), focusStateEnabled);
            assert.strictEqual(caption.option('focusStateEnabled'), focusStateEnabled);
            assert.strictEqual(nextButton.option('focusStateEnabled'), focusStateEnabled);
            assert.strictEqual(todayButton.option('focusStateEnabled'), focusStateEnabled);
        });

        QUnit.test(`navigator buttons should have focusStateEnabled=${focusStateEnabled} if calendar focusStateEnabled=${focusStateEnabled} on runtime`, function(assert) {
            this.reinit({
                focusStateEnabled: !focusStateEnabled,
                showTodayButton: true,
            });

            this.calendar.option('focusStateEnabled', focusStateEnabled);

            const nextButton = this.$element.find(`.${CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS}`).dxButton('instance');
            const caption = this.$element.find(`.${CALENDAR_CAPTION_BUTTON_CLASS}`).dxButton('instance');
            const prevButton = this.$element.find(`.${CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS}`).dxButton('instance');
            const todayButton = this.$element.find(`.${CALENDAR_TODAY_BUTTON_CLASS}`).dxButton('instance');

            assert.strictEqual(prevButton.option('focusStateEnabled'), focusStateEnabled);
            assert.strictEqual(caption.option('focusStateEnabled'), focusStateEnabled);
            assert.strictEqual(nextButton.option('focusStateEnabled'), focusStateEnabled);
            assert.strictEqual(todayButton.option('focusStateEnabled'), focusStateEnabled);
        });
    });
});


QUnit.module('Views initial positions', {
    beforeEach: function() {
        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.instance = this.$element.dxCalendar().dxCalendar('instance');

        this.reinit = (options) => {
            this.$element.remove();
            this.$element = $('<div>').appendTo('#qunit-fixture');
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

        const $navigatorNext = this.$element.find(`.${CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS}`);
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

    QUnit.test('calendar views position (viewsCount = 1)', function(assert) {
        const $view = $(getCurrentViewInstance(this.instance).$element());
        const viewWidth = $view.width();

        assert.equal($view.position().left, 0, 'main view is at 0');
        assert.equal(getBeforeViewInstance(this.instance).$element().position().left, -viewWidth, 'main view is at the left');
        assert.equal(getAfterViewInstance(this.instance).$element().position().left, viewWidth, 'main view is at the right');
    });

    QUnit.test('calendar views position (viewsCount = 2)', function(assert) {
        this.reinit({
            viewsCount: 2
        });
        const $view = $(getCurrentViewInstance(this.instance).$element());
        const viewWidth = $view.width();

        assert.equal($view.position().left, 0, 'main view is at 0');
        assert.equal(getAdditionalViewInstance(this.instance).$element().position().left, viewWidth);
        assert.equal(getBeforeViewInstance(this.instance).$element().position().left, -viewWidth,);
        assert.equal(getAfterViewInstance(this.instance).$element().position().left, 2 * viewWidth);
    });

    QUnit.test('calendar views position (viewsCount = 1; rtlEnabled)', function(assert) {
        this.reinit({ rtlEnabled: true });

        const $view = $(getCurrentViewInstance(this.instance).$element());
        const viewWidth = $view.width();

        assert.equal($view.position().left, 0, 'main view is at 0');
        assert.equal(getBeforeViewInstance(this.instance).$element().position().left, viewWidth, 'main view is at the left');
        assert.equal(getAfterViewInstance(this.instance).$element().position().left, -viewWidth, 'main view is at the right');
    });

    QUnit.test('calendar views position (viewsCount = 2; rtlEnabled)', function(assert) {
        this.reinit({
            viewsCount: 2,
            rtlEnabled: true
        });
        const $view = $(getCurrentViewInstance(this.instance).$element());
        const viewWidth = $view.width();

        assert.equal($view.position().left, viewWidth);
        assert.equal(getAdditionalViewInstance(this.instance).$element().position().left, 0);
        assert.equal(getBeforeViewInstance(this.instance).$element().position().left, 2 * viewWidth,);
        assert.equal(getAfterViewInstance(this.instance).$element().position().left, -viewWidth);
    });
});


QUnit.module('Views integration', {
    beforeEach: function() {
        fx.off = true;
        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.calendar = this.$element.dxCalendar({
            value: new Date(2015, 5, 13),
            focusStateEnabled: true
        }).dxCalendar('instance');

        this.reinit = (options) => {
            this.$element.remove();
            this.$element = $('<div>').appendTo('#qunit-fixture');
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
        assert.ok(getCurrentViewInstance(this.calendar).option('rtlEnabled'));
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
        $($element.find(`.${CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS}`)).trigger('dxclick');
        $($element.find('td[data-value=\'2013/11/13\']')).trigger('dxclick');

        assert.equal($element.find(`.${CALENDAR_SELECTED_DATE_CLASS}`).length, 1, 'there is only one selected cell');
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

            const $selectedCell = $element.find(`.${CALENDAR_SELECTED_DATE_CLASS}`);

            assert.equal($selectedCell.length, 1, 'there is a selected cell');
            assert.equal($selectedCell.get(0), getCurrentViewInstance(calendar)._getCellByDate(calendar.option('value')).get(0), 'correct cell is selected');
        });
    });

    QUnit.test('click on cell should have UI feedback', function(assert) {
        this.reinit({
            firstDayOfWeek: 0,
            value: new Date(2013, 8, 9)
        });

        const $dayElement = this.$element.find(`.${CALENDAR_CELL_CLASS}`).first();
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

            const $cell = $element.find(`.${CALENDAR_CELL_CLASS}`).eq(5);
            const cellDate = dataUtils.data($cell.get(0), CALENDAR_DATE_VALUE_KEY);

            $($cell).trigger('dxclick');
            assert.ok($cell, 'cell has selected class');
            assert.deepEqual(calendar.option('value'), cellDate, 'calendar value is correct');
        });
    });

    QUnit.test('click on view cell can select first century value (T929559)', function(assert) {
        const startDate = dateUtils.createDateWithFullYear(15, 2, 15);

        this.reinit({
            zoomLevel: 'month',
            value: startDate,
            min: new Date(-50, 1, 1)
        });

        const $element = this.$element;
        const calendar = this.calendar;

        $.each(['month', 'year', 'decade', 'century'], (_, type) => {
            calendar.option('maxZoomLevel', type);
            const $cell = $element.find(`.${CALENDAR_CELL_CLASS}`).eq(5);
            const cellDate = dataUtils.data($cell.get(0), CALENDAR_DATE_VALUE_KEY);

            $cell.trigger('dxclick');
            assert.ok($cell, 'cell has selected class');
            assert.deepEqual(calendar.option('value'), cellDate, 'calendar value is correct');
        });
    });

    QUnit.test('view contouredDate should sync with calendar currentDate', function(assert) {
        this.reinit({
            value: new Date(2015, 2, 15),
            focusStateEnabled: true
        });

        const calendar = this.calendar;

        $.each(['month', 'year', 'decade', 'century'], (_, type) => {
            calendar.option('zoomLevel', type);
            calendar.focus();

            const keyboard = keyboardMock($(calendar._$viewsWrapper));
            keyboard.press('right');

            assert.deepEqual(getCurrentViewInstance('contouredDate'), calendar.option('contouredDate'), 'contouredDate is equal currentDate');
        });
    });

    ['month', 'year', 'decade', 'century'].forEach((zoomLevel) => {
        QUnit.test(`contouredDate should correctly move from main view to additiona view (zoomLevel=${zoomLevel})`, function(assert) {
            this.reinit({
                focusStateEnabled: true,
                viewsCount: 2,
                zoomLevel,
            });

            this.calendar.option('currentDate', new Date('2099/12/31'));
            this.calendar.focus();

            const keyboard = keyboardMock($(this.calendar._$viewsWrapper));
            const $mainView = $(getCurrentViewInstance(this.calendar).$element());
            const $additionalView = $(getAdditionalViewInstance(this.calendar).$element());

            let $contouredCellOnMainView = $mainView.find(`.${CALENDAR_CONTOURED_DATE_CLASS}`);
            let $contouredCellOnAdditionalView = $additionalView.find(`.${CALENDAR_CONTOURED_DATE_CLASS}`);

            assert.strictEqual($contouredCellOnMainView.length, 1, 'contoured date is on main view');
            assert.strictEqual($contouredCellOnAdditionalView.length, 0, 'contoured date is not on additional view');

            keyboard.press('right');

            $contouredCellOnMainView = $mainView.find(`.${CALENDAR_CONTOURED_DATE_CLASS}`);
            $contouredCellOnAdditionalView = $additionalView.find(`.${CALENDAR_CONTOURED_DATE_CLASS}`);

            assert.strictEqual($contouredCellOnMainView.length, 0, 'contoured date is not on main view');
            assert.strictEqual($contouredCellOnAdditionalView.length, 1, 'contoured date is on additional view');
        });
    });

    QUnit.test('view contouredDate should be set on views wrapper focus and should be removed on focusout', function(assert) {
        const view = getCurrentViewInstance(this.calendar);
        const $viewsWrapper = this.calendar._$viewsWrapper;

        assert.equal(view.option('contouredDate'), null, 'no currentDate is passed to view on calendar init');

        this.calendar.focus();
        assert.deepEqual(view.option('contouredDate'), this.calendar.option('currentDate'), 'view contouredDate is set on focusin');

        $($viewsWrapper).trigger('focusout');
        assert.equal(view.option('contouredDate'), null, 'view contouredDate is set to null on focusout');
    });

    QUnit.test('contouredDate should not be passed to view if widget is not in focus', function(assert) {
        this.calendar.option('value', new Date(2013, 5, 16));
        assert.equal(getCurrentViewInstance(this.calendar).option('contouredDate'), null, 'view contouredDate is null');
    });

    QUnit.test('contoredDate class should not be added to the January 1970 cell when contouredDate is set to null', function(assert) {
        this.reinit({
            value: new Date(0),
            zoomLevel: 'year',
        });

        const view = getCurrentViewInstance(this.calendar);

        view.option('contouredDate', null);

        const $contouredCell = getCurrentViewInstance(this.calendar).$element().find(`.${CALENDAR_CONTOURED_DATE_CLASS}`);

        assert.strictEqual($contouredCell.length, 0, 'there is no contoured date cell');
    });

    QUnit.test('should not navigate view after new date UI select, even in React controlled mode (T1279950)', function(assert) {
        this.calendar.option({
            selectionMode: 'multiple',
            value: [new Date(2025, 1, 10), new Date(2025, 2, 10)],
        });

        const calendar = this.calendar;
        const $nextMonthButton = this.$element.find(`.${CALENDAR_NAVIGATOR_NEXT_MONTH_CLASS}`);

        assert.ok(
            dateUtils.sameMonth(calendar.option('currentDate'), new Date(2025, 1, 10)),
            'initially navigated to the earliest date'
        );

        $($nextMonthButton).trigger('dxclick');

        assert.ok(
            dateUtils.sameMonth(calendar.option('currentDate'), new Date(2025, 2, 10)),
            'navigated to the next month'
        );

        calendar.option('value', [new Date(2025, 1, 10), new Date(2025, 2, 10)]);

        assert.ok(
            dateUtils.sameMonth(calendar.option('currentDate'), new Date(2025, 2, 10)),
            'did not navigate back to the earliest date'
        );

        const $cell = this.$element.find('*[data-value="2025/03/10"]');

        $cell.trigger('dxclick');

        assert.strictEqual(this.calendar.option('value').length, 1, 'deselected correctly');

        assert.ok(
            dateUtils.sameMonth(calendar.option('currentDate'), new Date(2025, 2, 10)),
            'did not navigate back to the earliest date after deseleting'
        );
    });
});


QUnit.module('Keyboard navigation', {
    beforeEach: function() {
        fx.off = true;

        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.value = new Date(2013, 9, 13);

        this.calendar = this.$element.dxCalendar({
            focusStateEnabled: true,
            value: this.value
        }).dxCalendar('instance');

        this.$viewsWrapper = $(this.calendar._$viewsWrapper);
        this.clock = sinon.useFakeTimers();

        this.reinit = (options) => {
            this.$element.remove();
            this.$element = $('<div>').appendTo('#qunit-fixture');
            this.calendar = this.$element.dxCalendar(options).dxCalendar('instance');
            this.$viewsWrapper = $(this.calendar._$viewsWrapper);
        };
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.test('rootElement should not have tabIndex by default', function(assert) {
        assert.equal(this.$element.attr('tabindex'), undefined);
    });

    QUnit.test('views wrapper should have tabIndex equals 0 by default', function(assert) {
        assert.equal(this.$viewsWrapper.attr('tabindex'), 0);
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

        const calendar = this.calendar;
        const keyboard = keyboardMock(this.$viewsWrapper);

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

        const calendar = this.calendar;
        const keyboard = keyboardMock(this.$viewsWrapper);

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

            const keyboard = keyboardMock(this.$viewsWrapper);

            keyboard.press('up');
            assert.deepEqual(this.calendar.option('currentDate'), expectedDates[type], 'current date is correct');

            keyboard.press('down');
            assert.deepEqual(this.calendar.option('currentDate'), origDate, 'current date is correct');
        }, this));
    });

    QUnit.test('pressing enter should change value', function(assert) {
        const calendar = this.calendar;
        const keyboard = keyboardMock(this.$viewsWrapper);

        iterateViews((_, type) => {
            calendar.option({
                maxZoomLevel: type,
                value: null
            });

            keyboard.press('enter');
            assert.deepEqual(calendar.option('value'), calendar.option('currentDate'), 'value is changed');
        });
    });

    $.each(commandKeysConfigs, (index, { name, optionConfig }) => {
        QUnit.test(`pressing ${name}+arrows keys must change view correctly`, function(assert) {
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

                clock.tick(10);
                triggerKeydown(this.$viewsWrapper, LEFT_ARROW_KEY_CODE, optionConfig);
                assert.deepEqual(calendar.option('currentDate'), expectedDates[type][0], `${name}+left arrow navigates correctly`);

                clock.tick(10);
                triggerKeydown(this.$viewsWrapper, RIGHT_ARROW_KEY_CODE, optionConfig);
                assert.deepEqual(calendar.option('currentDate'), expectedDates[type][1], `${name}+right arrow navigates correctly`);
            });
        });

        QUnit.test(`pressing ${name}+arrows must navigate in inverse direction in RTL mode`, function(assert) {
            this.reinit({
                value: this.value,
                firstDayOfWeek: 1,
                rtlEnabled: true,
                focusStateEnabled: true
            });

            triggerKeydown(this.$viewsWrapper, LEFT_ARROW_KEY_CODE, optionConfig);
            assert.deepEqual(this.calendar.option('currentDate'), new Date(2013, 10, this.value.getDate()), `${name}+left arrow navigates correctly`);

            this.clock.tick(10);
            triggerKeydown(this.$viewsWrapper, RIGHT_ARROW_KEY_CODE, optionConfig);
            assert.deepEqual(this.calendar.option('currentDate'), new Date(2013, 9, this.value.getDate()), `${name}+right arrow navigates correctly`);
        });

        QUnit.test(`pressing ${name}+up/down arrow keys must call navigateUp/navigateDown`, function(assert) {
            this.reinit({
                value: new Date(2013, 11, 15),
                zoomLevel: 'month',
                focusStateEnabled: true
            });

            const calendar = this.calendar;

            $.each(['year', 'decade', 'century'], (_, type) => {
                triggerKeydown(this.$viewsWrapper, UP_ARROW_KEY_CODE, optionConfig);
                assert.equal(calendar.option('zoomLevel'), type, 'type view matches zoomLevel type');
            });

            $.each(['decade', 'year', 'month'], (_, type) => {
                triggerKeydown(this.$viewsWrapper, DOWN_ARROW_KEY_CODE, optionConfig);
                assert.equal(calendar.option('zoomLevel'), type, 'type view matches zoomLevel type');
            });
        });
    });

    QUnit.test('pressing pageup/pagedown keys must change view correctly', function(assert) {
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

            clock.tick(10);
            triggerKeydown(this.$viewsWrapper, PAGE_UP_KEY_CODE);
            assert.deepEqual(calendar.option('currentDate'), expectedDates[type][0], 'pageup navigates correctly');

            clock.tick(10);
            triggerKeydown(this.$viewsWrapper, PAGE_DOWN_KEY_CODE);
            assert.deepEqual(calendar.option('currentDate'), expectedDates[type][1], 'pagedown navigates correctly');
        });
    });

    QUnit.test('pressing pageup/pagedown keys must change view correctly when rtlEnabled is true', function(assert) {
        const calendar = this.calendar;
        calendar.option('rtlEnabled', true);
        const $viewsWrapper = $(calendar._$viewsWrapper);

        const expectedDates = {
            'month': [new Date(2013, 8, 13), new Date(2013, 9, 13)],
            'year': [new Date(2012, 9, 13), new Date(2013, 9, 13)],
            'decade': [new Date(2003, 9, 13), new Date(2013, 9, 13)],
            'century': [new Date(1913, 9, 13), new Date(2013, 9, 13)]
        };

        const clock = this.clock;

        iterateViews((_, type) => {
            calendar.option('zoomLevel', type);

            clock.tick(10);
            triggerKeydown($viewsWrapper, PAGE_UP_KEY_CODE);
            assert.deepEqual(calendar.option('currentDate'), expectedDates[type][0], 'pageUp navigates correctly');

            clock.tick(10);
            triggerKeydown($viewsWrapper, PAGE_DOWN_KEY_CODE);
            assert.deepEqual(calendar.option('currentDate'), expectedDates[type][1], 'pageDown navigates correctly');
        });
    });

    QUnit.test('correct currentDate change after navigating on other view cell by keyboard', function(assert) {
        this.reinit({
            value: new Date(2015, 2, 1),
            zoomLevel: 'month',
            focusStateEnabled: true
        });

        const calendar = this.calendar;
        const $viewsWrapper = $(calendar._$viewsWrapper);

        calendar.focus();

        calendar.option('currentDate', dateUtils.getLastMonthDate(calendar.option('currentDate')));
        triggerKeydown($viewsWrapper, RIGHT_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2015, 3, 1), 'month changed correctly');

        calendar.option('zoomLevel', 'year');
        calendar.option('currentDate', new Date(2015, 11, 1));
        triggerKeydown($viewsWrapper, RIGHT_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2016, 0, 1), 'year changed correctly');

        calendar.option('zoomLevel', 'decade');
        calendar.option('currentDate', new Date(2019, 0, 1));
        triggerKeydown($viewsWrapper, RIGHT_ARROW_KEY_CODE);
        assert.deepEqual(calendar.option('currentDate'), new Date(2020, 0, 1), 'decade changed correctly');

        calendar.option('zoomLevel', 'century');
        calendar.option('currentDate', new Date(2090, 0, 1));
        triggerKeydown($viewsWrapper, RIGHT_ARROW_KEY_CODE);
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
        const keyboard = keyboardMock($(calendar._$viewsWrapper));

        calendar.option('value', new Date(2015, 8, 1));

        keyboard.press('left');
        assert.ok(dateUtils.sameMonth(getCurrentViewInstance(calendar).option('date'), new Date(2015, 7, 1)), 'view is changed');

        calendar.option('value', new Date(2015, 8, 30));

        keyboard.press('right');
        assert.ok(dateUtils.sameMonth(getCurrentViewInstance(calendar).option('date'), new Date(2015, 9, 1)), 'view is changed');
    });

    QUnit.test('Pressing home/end keys must contour first/last cell', function(assert) {
        this.reinit({
            focusStateEnabled: true,
            value: new Date(2013, 11, 15)
        });

        const calendar = this.calendar;
        const $viewsWrapper = $(calendar._$viewsWrapper);

        calendar.focus();

        $.each(['month', 'year', 'decade', 'century'], (_, type) => {
            calendar.option('zoomLevel', type);

            const view = getCurrentViewInstance(calendar);
            const $view = $(view.$element());

            calendar.option('value', new Date(dataUtils.data($view.find(`.${CALENDAR_CELL_CLASS}`).not(`.${CALENDAR_OTHER_VIEW_CLASS}`).eq(5).get(0), CALENDAR_DATE_VALUE_KEY)));

            let expectedContoured = dataUtils.data($view.find(`.${CALENDAR_CELL_CLASS}`).not(`.${CALENDAR_OTHER_VIEW_CLASS}`).first().get(0), CALENDAR_DATE_VALUE_KEY);

            triggerKeydown($viewsWrapper, HOME_KEY_CODE);
            assert.deepEqual(view.option('contouredDate'), expectedContoured, 'home button contoured first cell');

            expectedContoured = dataUtils.data($view.find(`.${CALENDAR_CELL_CLASS}`).not(`.${CALENDAR_OTHER_VIEW_CLASS}`).last().get(0), CALENDAR_DATE_VALUE_KEY);
            triggerKeydown($viewsWrapper, END_KEY_CODE);
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

            const calendar = this.calendar;
            const $viewsWrapper = $(calendar._$viewsWrapper);

            calendar.focus();

            const view = getCurrentViewInstance(this.calendar);

            triggerKeydown($viewsWrapper, HOME_KEY_CODE);
            assert.deepEqual(view.option('contouredDate'), params[type].min, 'home button contoured min cell');

            triggerKeydown($viewsWrapper, END_KEY_CODE);
            assert.deepEqual(view.option('contouredDate'), params[type].max, 'end button contoured max cell');
        }, this));
    });

    QUnit.test('keydown event default behavior should be prevented by calendar keydown handlers for datebox integration', function(assert) {
        assert.expect(4);

        this.$element.remove();
        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.$element.dxCalendar({
            value: new Date(2013, 11, 15),
            focusStateEnabled: true
        });

        const $viewsWrapper = $(this.$element.dxCalendar('instance')._$viewsWrapper);

        this.$element
            .on('keydown.TEST', e => {
                assert.ok(e.isDefaultPrevented());
            });

        $viewsWrapper
            .trigger($.Event('keydown', { key: LEFT_ARROW_KEY_CODE }))
            .trigger($.Event('keydown', { key: UP_ARROW_KEY_CODE }))
            .trigger($.Event('keydown', { key: RIGHT_ARROW_KEY_CODE }))
            .trigger($.Event('keydown', { key: DOWN_ARROW_KEY_CODE }));

        this.$element
            .off('.TEST');
    });

    QUnit.test('correct view change after fast keyboard navigation', function(assert) {
        this.reinit({
            value: new Date(2013, 9, 1),
            focusStateEnabled: true
        });

        const fxOrigState = fx.off;
        fx.off = false;

        const calendar = this.calendar;
        const keyboard = keyboardMock($(calendar._$viewsWrapper));

        calendar.focus();

        try {
            keyboard.press('up');
            this.clock.tick(VIEW_ANIMATION_DURATION / 5);
            keyboard.press('up');
            this.clock.tick(VIEW_ANIMATION_DURATION * 2);

            assert.deepEqual(this.calendar.option('currentDate'), new Date(2013, 8, 17), 'current date is correct');
            assert.deepEqual(getCurrentViewInstance(this.calendar).option('date'), new Date(2013, 8, 1), 'correct view is shown');
            assert.equal(getCurrentViewInstance(this.calendar).$element().find(`.${CALENDAR_CONTOURED_DATE_CLASS}`).length, 1, 'contoured date is rendered');
        } finally {
            fx.off = fxOrigState;
        }
    });

    QUnit.test('upArrow with ctrl-key should increase zoomLevel option', function(assert) {
        this.calendar.option({
            zoomLevel: 'month',
        });

        this.calendar.focus();
        triggerKeydown(this.$viewsWrapper, UP_ARROW_KEY_CODE, { ctrlKey: true });

        assert.equal(this.calendar.option('zoomLevel'), 'year', 'zoomLevel option has been increased');
    });

    QUnit.test('upArrow with ctrl-key should not increase zoomLevel option if zoomLevel === maxZoomLevel', function(assert) {
        this.calendar.option({
            zoomLevel: 'century',
            maxZoomLevel: 'century',
        });

        this.calendar.focus();
        triggerKeydown(this.$viewsWrapper, UP_ARROW_KEY_CODE, { ctrlKey: true });

        assert.equal(this.calendar.option('zoomLevel'), 'century', 'zoomLevel option has not been increased');
    });

    QUnit.test('downArrow with ctrl-key should decrease zoomLevel option', function(assert) {
        this.calendar.option({
            zoomLevel: 'year',
        });

        this.calendar.focus();
        triggerKeydown(this.$viewsWrapper, DOWN_ARROW_KEY_CODE, { ctrlKey: true });

        assert.equal(this.calendar.option('zoomLevel'), 'month', 'zoomLevel option has been decreased');
    });

    QUnit.test('downArrow with ctrl-key should not decrease zoomLevel option if zoomLevel === minZoomLevel', function(assert) {
        this.calendar.option({
            zoomLevel: 'month',
            minZoomLevel: 'month',
        });

        this.calendar.focus();
        triggerKeydown(this.$element, DOWN_ARROW_KEY_CODE, { ctrlKey: true });

        assert.equal(this.calendar.option('zoomLevel'), 'month', 'zoomLevel option has not been decreased');
    });
});


QUnit.module('Preserve time component on value change', {
    beforeEach: function() {
        fx.off = true;

        this.$element = $('<div>').appendTo('#qunit-fixture');
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
        const $viewsWrapper = $(calendar._$viewsWrapper);

        calendar.option('value', new Date(2015, 8, 1, 12, 57));

        calendar.focus();

        triggerKeydown($viewsWrapper, RIGHT_ARROW_KEY_CODE);
        triggerKeydown($viewsWrapper, ENTER_KEY_CODE);

        assert.deepEqual(calendar.option('value'), new Date(2015, 8, 2, 12, 57));
    });
});


QUnit.module('Calendar footer', {
    beforeEach: function() {
        fx.off = true;

        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.calendar = this.$element.dxCalendar({
            value: new Date(2010, 10, 10),
            focusStateEnabled: true,
            showTodayButton: true
        }).dxCalendar('instance');

        this.reinit = (options = {}) => {
            this.$element.remove();
            this.$element = $('<div>').appendTo('#qunit-fixture');
            this.calendar = this.$element.dxCalendar(options).dxCalendar('instance');
        };
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('today button click reselect value when selectionMode is single', function(assert) {
        const $todayButton = this.$element.find(`.${CALENDAR_TODAY_BUTTON_CLASS}`);

        $todayButton.trigger('dxclick');

        const value = this.calendar.option('value').setHours(0, 0, 0, 0);
        const expectedValue = new Date().setHours(0, 0, 0, 0);

        assert.deepEqual(value, expectedValue);
    });

    ['multiple', 'range'].forEach((selectionMode) => {
        QUnit.test(`today button click adds today date to value when selectionMode is ${selectionMode}`, function(assert) {
            this.reinit({
                selectionMode,
                value: [new Date('2022/02/22')],
                showTodayButton: true
            });

            assert.strictEqual(this.calendar.option('value').length, 1);

            const $todayButton = this.$element.find(`.${CALENDAR_TODAY_BUTTON_CLASS}`);
            $todayButton.trigger('dxclick');

            assert.strictEqual(this.calendar.option('value').length, 2);
        });
    });

    QUnit.test('today button click should deselect date if it is already selected and selectionMode is multiple', function(assert) {
        this.reinit({
            selectionMode: 'multiple',
            value: [new Date()],
            showTodayButton: true
        });

        assert.strictEqual(this.calendar.option('value').length, 1);

        const $todayButton = this.$element.find(`.${CALENDAR_TODAY_BUTTON_CLASS}`);
        $todayButton.trigger('dxclick');

        assert.strictEqual(this.calendar.option('value').length, 0);
    });

    QUnit.test('today view are current after today button click', function(assert) {
        const calendar = this.calendar;

        const $todayButton = this.$element.find(`.${CALENDAR_TODAY_BUTTON_CLASS}`);

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
        const $todayButton = this.$element.find(`.${CALENDAR_TODAY_BUTTON_CLASS}`);

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
        const $todayButton = this.$element.find(`.${CALENDAR_TODAY_BUTTON_CLASS}`);

        $($todayButton).trigger('dxclick');
        assert.equal(calendar.option('zoomLevel'), 'month', 'calendar view is changed correctly');

        assert.deepEqual(getShortDate(calendar.option('value')), getShortDate(new Date()), 'calendar value is correct');
    });

    QUnit.test('today view is visible after \'today\' button click', function(assert) {
        const $element = this.$element;
        const $todayButton = $element.find(`.${CALENDAR_TODAY_BUTTON_CLASS}`);

        $($todayButton).trigger('dxclick');

        const view = getCurrentViewInstance(this.calendar);

        assert.ok(dateUtils.sameMonthAndYear(view.option('date'), new Date()), 'calendar current view is correct');
        assert.equal(view.$element().position().left, 0, 'calendar current view position is correct');
        assert.equal($element.find(`.${CALENDAR_VIEWS_WRAPPER_CLASS}`).position().left, 0, 'views wrapper is centered');
        assert.equal(view.$element().find(`.${CALENDAR_SELECTED_DATE_CLASS}`).length, 1, 'there is selected cell on the current view');
    });

    QUnit.test('navigator caption should be changed after \'today\' button click', function(assert) {
        const $element = this.$element;
        const $todayButton = $element.find(`.${CALENDAR_TODAY_BUTTON_CLASS}`);

        const $navigator = $element.find(`.${CALENDAR_CAPTION_BUTTON_CLASS}`);
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
        const viewWidth = $element.find(`.${CALENDAR_VIEWS_WRAPPER_CLASS} .dx-widget`).eq(0).width();

        try {
            fx.off = false;
            fx.animate = () => {
                const todayView = getAfterViewInstance(calendar);
                const $todayView = $(todayView.$element());

                assert.equal(getShortDate(todayView.option('date')), getShortDate(new Date()), 'today view is created');
                assert.equal($todayView.position().left, viewWidth, 'today view position is correct');

                return $.Deferred().resolve().promise();
            };

            const $todayButton = $element.find(`.${CALENDAR_TODAY_BUTTON_CLASS}`);
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
        const viewWidth = this.$element.find(`.${CALENDAR_VIEWS_WRAPPER_CLASS} .dx-widget`).eq(0).width();
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

            const $todayButton = $(calendar.$element().find(`.${CALENDAR_TODAY_BUTTON_CLASS}`));

            $($todayButton).trigger('dxclick');
        } finally {
            fx.animate = origAnimate;
            fx.off = fxState;
        }
    });

    [1, 2].forEach((viewsCount) => {
        QUnit.test(`correct views are rendered after animation (viewsCount = ${viewsCount}`, function(assert) {
            const calendar = this.calendar;
            calendar.option('viewsCount', viewsCount);
            const $todayButton = this.$element.find(`.${CALENDAR_TODAY_BUTTON_CLASS}`);

            $($todayButton).trigger('dxclick');

            const beforeViewDate = getBeforeViewInstance(calendar).option('date');
            const afterViewDate = getAfterViewInstance(calendar).option('date');
            const today = calendar.option('currentDate');

            assert.equal(beforeViewDate.getFullYear(), new Date(today.getFullYear(), today.getMonth() - 1).getFullYear(), 'before view year is correct');
            assert.equal(beforeViewDate.getMonth(), new Date(today.getFullYear(), today.getMonth() - 1).getMonth(), 'before view month is correct');
            assert.equal(afterViewDate.getFullYear(), new Date(today.getFullYear(), today.getMonth() + viewsCount).getFullYear(), 'after view year is correct');
            assert.equal(afterViewDate.getMonth(), new Date(today.getFullYear(), today.getMonth() + viewsCount).getMonth(), 'after view month is correct');

            if(viewsCount === 2) {
                const additionalViewDate = getAdditionalViewInstance(calendar).option('date');
                assert.equal(additionalViewDate.getFullYear(), new Date(today.getFullYear(), today.getMonth() + 1).getFullYear(), 'additional view year is correct');
                assert.equal(additionalViewDate.getMonth(), new Date(today.getFullYear(), today.getMonth() + 1).getMonth(), 'additional view month is correct');
            }
        });

        QUnit.test(`correct animation after today button click on the different zoom level (viewsCount = ${viewsCount}`, function(assert) {
            this.calendar.option({
                zoomLevel: 'century',
                value: new Date(1973, 4, 5),
                viewsCount
            });

            const origAnimate = fx.animate;

            try {
                let animationCount = 0;

                fx.animate = (...args) => {
                    animationCount += 1;
                    return origAnimate.apply(fx, args);
                };

                $(this.$element.find(`.${CALENDAR_TODAY_BUTTON_CLASS}`)).trigger('dxclick');

                assert.equal(animationCount, viewsCount, 'only one animation was made for view change');
            } finally {
                fx.animate = origAnimate;
            }
        });
    });
});


QUnit.module('Current date', {
    beforeEach: function() {
        fx.off = true;
        this.$element = $('<div>').appendTo('#qunit-fixture');

        this.reinit = () => {
            this.$element.remove();
            this.$element = $('<div>').appendTo('#qunit-fixture');
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

        ['month', 'year', 'decade', 'century'].forEach(type => {
            $(calendar._$viewsWrapper).trigger('blur');
            calendar.option('zoomLevel', type);
            $(calendar._$viewsWrapper).trigger('focus');

            const $contouredElement = $element.find(`.${CALENDAR_CONTOURED_DATE_CLASS}`);
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

        $(this.$element.find(`.${CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS}`)).trigger('dxclick');
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

            const calendar = this.$element.dxCalendar($.extend(
                {},
                { zoomLevel: type, focusStateEnabled: true },
                params[type])).dxCalendar('instance');
            const $viewsWrapper = $(calendar._$viewsWrapper);

            calendar.focus();

            triggerKeydown($viewsWrapper, RIGHT_ARROW_KEY_CODE);
            triggerKeydown($viewsWrapper, RIGHT_ARROW_KEY_CODE);
            assert.deepEqual(calendar.option('currentDate'), calendar.option('max'), 'currentDate is correct');
            assert.deepEqual(getCurrentViewInstance(calendar).option('contouredDate'), calendar.option('currentDate'), 'view contouredDate is the same as calendar currentDate');

            triggerKeydown($viewsWrapper, LEFT_ARROW_KEY_CODE);
            triggerKeydown($viewsWrapper, LEFT_ARROW_KEY_CODE);
            triggerKeydown($viewsWrapper, LEFT_ARROW_KEY_CODE);
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
            const $viewsWrapper = $(calendar._$viewsWrapper);

            const currentDate = calendar.option('currentDate');

            calendar.focus();

            triggerKeydown($viewsWrapper, UP_ARROW_KEY_CODE);
            assert.ok(!dateUtils.sameMonthAndYear(calendar.option('currentDate'), currentDate), 'current view is changed');
            assert.deepEqual(getCurrentViewInstance(calendar).option('contouredDate'), params[type].expectedDate, 'contouredDate is countoured');

            triggerKeydown($viewsWrapper, DOWN_ARROW_KEY_CODE);
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
        const $viewsWrapper = $(calendar._$viewsWrapper);

        calendar.focus();

        triggerKeydown($viewsWrapper, UP_ARROW_KEY_CODE, { ctrlKey: true });
        assert.deepEqual(calendar.option('currentDate'), new Date(2015, 2, 10), 'contoured is correct on year view (up)');

        triggerKeydown($viewsWrapper, UP_ARROW_KEY_CODE, { ctrlKey: true });
        assert.deepEqual(calendar.option('currentDate'), new Date(2015, 2, 10), 'contoured is correct on decade view (up)');

        triggerKeydown($viewsWrapper, UP_ARROW_KEY_CODE, { ctrlKey: true });
        assert.deepEqual(calendar.option('currentDate'), new Date(2015, 2, 10), 'contoured is correct on century view (up)');

        triggerKeydown($viewsWrapper, RIGHT_ARROW_KEY_CODE);
        triggerKeydown($viewsWrapper, DOWN_ARROW_KEY_CODE, { ctrlKey: true });
        assert.deepEqual(calendar.option('currentDate'), new Date(2025, 2, 10), 'contoured is correct on decade view (down)');

        triggerKeydown($viewsWrapper, DOWN_ARROW_KEY_CODE, { ctrlKey: true });
        assert.deepEqual(calendar.option('currentDate'), new Date(2025, 2, 10), 'contoured is correct on year view (down)');

        triggerKeydown($viewsWrapper, DOWN_ARROW_KEY_CODE, { ctrlKey: true });
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
        this.$element = $('<div>').appendTo('#qunit-fixture');
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

            const $cell = $(calendar.$element().find(`.${CALENDAR_OTHER_VIEW_CLASS}`).first());
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

        const $cell = $element.find(`.${CALENDAR_CELL_CLASS}`).eq(2);
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

        const $cell = $element.find(`.${CALENDAR_CELL_CLASS}`).eq(1);
        const expectedDate = dataUtils.data($cell.get(0), CALENDAR_DATE_VALUE_KEY);

        calendar.focus();
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
                const $cellLastPrevMonth = $(calendar._view.$element().find(`.${CALENDAR_CELL_CLASS}`).not(`.${CALENDAR_OTHER_VIEW_CLASS}`).first().prev());

                if($cellLastPrevMonth.length) {
                    const expected = dataUtils.data($cellLastPrevMonth.get(0), CALENDAR_DATE_VALUE_KEY);
                    $($cellLastPrevMonth).trigger('dxclick');

                    assert.deepEqual(calendar.option('value'), expected, 'view is changed and value is correct');
                }
            }
        }
    });
});

[1, 2].forEach((viewsCount) => {
    QUnit.module(`Navigation - swiping (viewsCount=${viewsCount})`, {
        beforeEach: function() {
            fx.off = true;

            this.$element = $('<div>').appendTo('#qunit-fixture');
            this.calendar = this.$element.dxCalendar({
                viewsCount,
                currentDate: new Date(2013, 9, 15),
                firstDayOfWeek: 1,
            }).dxCalendar('instance');

            this.pointer = pointerMock(this.$element).start();

            this.reinit = (options) => {
                this.$element.remove();
                this.$element = $('<div>').appendTo('#qunit-fixture');
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
            assert.equal(this.$element.find('table').length, 2 + viewsCount, 'Month views count is correct');
        });


        ['left', 'right'].forEach((direction) => {
            const directionMultiplayer = direction === 'right' ? 1 : -1;

            QUnit.test(`views offset on continuous ${direction} swipe`, function(assert) {
                const width = this.$element.width() / viewsCount;
                const offset = 0.5 * width;

                this.pointer.swipeStart().swipe(0.5 * directionMultiplayer);

                const $tables = this.$element.find(`.${CALENDAR_BODY_CLASS} .dx-widget`);
                const $wrapper = this.$element.find(`.${CALENDAR_VIEWS_WRAPPER_CLASS}`).eq(0);

                assert.roughEqual(translator.locate($wrapper).left, offset * directionMultiplayer, 1, 'Views wrapper position is correct');
                assert.roughEqual(translator.locate($tables.eq(0)).left, 0, 1, 'Main view position is correct');
                assert.roughEqual(translator.locate($tables.eq(1)).left, -width, 1, 'Before view position is correct');
                assert.roughEqual(translator.locate($tables.eq(2)).left, width * viewsCount, 1, 'After view position is correct');

                if(viewsCount === 2) {
                    assert.equal(translator.locate($tables.eq(3)).left, width, 'After view position is correct');
                }
            });

            QUnit.test(`views after canceled ${direction} swipe`, function(assert) {
                const currentDate = new Date(this.calendar.option('currentDate'));

                this.pointer.swipeStart().swipeEnd(0, 0.4 * directionMultiplayer);

                assert.equal(this.$element.find('table').length, 2 + viewsCount, 'Calendar contains one view after swipe end');
                assert.equal(this.$element.find(`.${CALENDAR_VIEWS_WRAPPER_CLASS}`).position().left, 0, 'Views wrapper position is correct');
                assert.equal(getCurrentViewInstance(this.calendar).$element().position().left, 0, 'View position is correct');
                assert.equal(this.calendar.option('currentDate').getMonth(), currentDate.getMonth(), 'Current month is correct');
            });

            QUnit.test(`views after ${direction} long swipe end`, function(assert) {
                const currentDate = new Date(this.calendar.option('currentDate'));
                currentDate.setMonth(currentDate.getMonth() - 1);

                this.pointer.swipeStart().swipe(0.6 * directionMultiplayer).swipeEnd(1, 0.6 * directionMultiplayer);

                assert.equal(this.$element.find('table').length, 2 + viewsCount, 'Calendar contains one view after long right swipe end');
                assert.equal(this.$element.find(`.${CALENDAR_VIEWS_WRAPPER_CLASS}`).position().left, 0, 'Views wrapper position is correct');
                assert.equal(getCurrentViewInstance(this.calendar).$element().position().left, 0, 'View position is correct');
                assert.equal(this.calendar.option('currentDate').getMonth(), currentDate.getMonth(), 'Current month is correct');
            });

            QUnit.test(`views after ${direction} short swipe end`, function(assert) {
                const currentDate = new Date(this.calendar.option('currentDate'));


                currentDate.setMonth(currentDate.getMonth() - directionMultiplayer);
                this.pointer.swipeStart().swipe(0.4 * directionMultiplayer).swipeEnd(1 * directionMultiplayer, 0.4 * directionMultiplayer);

                assert.equal(this.$element.find('table').length, 2 + viewsCount, 'Calendar contains one view after short right swipe end');
                assert.equal(this.$element.find(`.${CALENDAR_VIEWS_WRAPPER_CLASS}`).position().left, 0, 'Views wrapper position is correct');
                assert.equal(getCurrentViewInstance(this.calendar).$element().position().left, 0, 'View position is correct');
                assert.equal(this.calendar.option('currentDate').getMonth(), currentDate.getMonth(), 'Current month is correct');
            });

            QUnit.test(`views after ${direction} swipe end in rtl mode`, function(assert) {
                this.reinit({
                    currentDate: new Date(2013, 9, 15),
                    firstDayOfWeek: 1,
                    rtlEnabled: true,
                    viewsCount
                });

                const calendar = this.calendar;

                const newDate = new Date(calendar.option('currentDate'));
                newDate.setMonth(newDate.getMonth() + directionMultiplayer);

                this.pointer.swipeStart().swipe(0.6 * directionMultiplayer).swipeEnd(1 * directionMultiplayer, 0.6 * directionMultiplayer);

                assert.equal(this.$element.find('table').eq(0).position().left, 0, 'View position is correct');
                assert.equal(calendar.option('currentDate').getMonth(), newDate.getMonth(), 'Current month is correct');
            });

            QUnit.test(`correct end position for animation after long ${direction} swipe end`, function(assert) {
                assert.expect(1);

                const origAnimate = fx.animate;

                try {
                    const $views = this.$element.find(`.${CALENDAR_VIEWS_WRAPPER_CLASS} .dx-widget`);
                    const viewWidth = $views.eq(0).width();

                    fx.animate = (_, config) => {
                        assert.roughEqual(config.to.left, -viewWidth * directionMultiplayer, 2, 'view will be animated to bound');
                        return $.Deferred().resolve().promise();
                    };

                    this.pointer.swipeStart().swipe(-2.3 * directionMultiplayer).swipeEnd(-2 * directionMultiplayer, -2.3 * directionMultiplayer);

                } finally {
                    fx.animate = origAnimate;
                }
            });
        });

        QUnit.test('should not overlap during multidirectional swipe', function(assert) {
            this.pointer.swipeStart().swipe(-0.1).swipe(0.01);

            const $views = this.$element.find(`.${CALENDAR_VIEWS_WRAPPER_CLASS} .dx-widget`);

            assert.equal($views.length, 2 + viewsCount, 'correct views count');
            assert.ok($views.eq(1).position().left < 0, 'first additional view located at right');
            assert.ok($views.eq(2).position().left > 0, 'second additional view located at left');
        });

        QUnit.test('calendar must not leak views when navigating by swipe gesture', function(assert) {
            this.pointer.swipeStart().swipe(-0.6).swipeEnd(-1);
            this.pointer.swipeStart().swipe(-0.6).swipeEnd(-1);
            this.pointer.swipeStart().swipe(-0.6).swipeEnd(-1);
            this.pointer.swipeStart().swipe(-0.6).swipeEnd(-1);
            assert.equal(this.$element.find('table').length, 2 + viewsCount, 'correct views count');
        });

        QUnit.test('correct views wrapper position after swiping from boundary view', function(assert) {
            this.reinit({
                currentDate: new Date(2015, 8, 15),
                min: new Date(2015, 8, 8),
                max: new Date(2015, 8, 26)
            });

            const $viewsWrapper = this.$element.find(`.${CALENDAR_VIEWS_WRAPPER_CLASS}`);

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

            const $viewsWrapper = this.$element.find(`.${CALENDAR_VIEWS_WRAPPER_CLASS}`);

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
});


QUnit.module('Aria accessibility', {
    beforeEach: function() {
        fx.off = true;
        this.$element = $('<div>').appendTo('#qunit-fixture');
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('aria-label should be "Read-only calendar" and role = group when readOnly option is true', function(assert) {
        const $element = this.$element;

        $element.dxCalendar({
            readOnly: true
        }).dxCalendar('instance');

        assert.strictEqual($element.attr('aria-label'), 'Read-only calendar', 'aria-label is set correctly');
        assert.strictEqual($element.attr('role'), 'group', 'role is set correctly');
    });

    QUnit.test('aria-label and role should be removed when readOnly option is false', function(assert) {
        const $element = this.$element;

        $element.dxCalendar({
            readOnly: false
        }).dxCalendar('instance');

        assert.notOk($element.attr('aria-label'), 'aria-label is not set');
        assert.notOk($element.attr('role'), 'role is not set');
    });

    QUnit.test('aria-label and role should be removed when readOnly option is set to false on runtime', function(assert) {
        const $element = this.$element;

        const calendar = $element.dxCalendar({
            readOnly: true
        }).dxCalendar('instance');

        calendar.option('readOnly', false);

        assert.notOk($element.attr('aria-label'), 'aria-label is removed');
        assert.notOk($element.attr('role'), 'role is removed');
    });

    QUnit.test('aria-label and role should be setted when readOnly option is set to true on runtime', function(assert) {
        const $element = this.$element;

        const calendar = $element.dxCalendar({
            readOnly: false
        }).dxCalendar('instance');

        calendar.option('readOnly', true);

        assert.strictEqual($element.attr('aria-label'), 'Read-only calendar', 'aria-label is set correctly');
        assert.strictEqual($element.attr('role'), 'group', 'role is set correctly');
    });

    QUnit.test('aria-label attribute should be equal to custom localized text', function(assert) {
        const localizedText = 'For Testing';
        localization.loadMessages({ 'en': { 'dxCalendar-readOnlyLabel': localizedText } });

        const $element = this.$element;

        $element.dxCalendar({
            readOnly: true
        });

        assert.strictEqual($element.attr('aria-label'), localizedText, 'aria-label is set correctly');
    });

    QUnit.test('aria-activedescendant on views wrapper should point to the focused cell', function(assert) {
        const $element = this.$element;

        const calendar = $element.dxCalendar({
            focusStateEnabled: true
        }).dxCalendar('instance');
        const $viewsWrapper = $(calendar._$viewsWrapper);

        calendar.focus();

        const $cell = $element.find(`.${CALENDAR_CONTOURED_DATE_CLASS}`);

        assert.notEqual($cell.attr('id'), undefined, 'id exists');
        assert.equal($viewsWrapper.attr('aria-activedescendant'), $cell.attr('id'), 'cell\'s id and element\'s activedescendant are equal');
    });

    QUnit.test('views wrapper should have role=application attribute', function(assert) {
        const calendar = this.$element.dxCalendar().dxCalendar('instance');
        const $viewsWrapper = $(calendar._$viewsWrapper);

        assert.strictEqual($viewsWrapper.attr('role'), 'application');
    });

    QUnit.test('onContouredChanged action on init', function(assert) {
        assert.expect(2);

        const calendar = this.$element.dxCalendar({
            value: null,
            focusStateEnabled: true,
            onContouredChanged: (e) => {
                assert.ok(true, 'contouredChanged was triggered on render');
                assert.ok(e.actionValue, 'action has aria id as a parameter');
            }
        }).dxCalendar('instance');

        calendar.focus();
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

        const calendar = $element.dxCalendar({
            date: new Date(2015, 5, 1),
            value: new Date(2015, 5, 1),
            firstDayOfWeek: 1,
            focusStateEnabled: true
        }).dxCalendar('instance');

        const $viewsWrapper = $(calendar._$viewsWrapper);
        const keyboard = keyboardMock($viewsWrapper);

        calendar.focus();

        let $cell = $element.find(`.${CALENDAR_CONTOURED_DATE_CLASS}`);
        assert.equal($viewsWrapper.attr('aria-activedescendant'), $cell.attr('id'), 'contoured date cell id and activedescendant are equal');

        keyboard.press('right');
        $cell = $element.find(`.${CALENDAR_CONTOURED_DATE_CLASS}`);
        assert.equal($viewsWrapper.attr('aria-activedescendant'), $cell.attr('id'), 'new contoured date cell id and activedescendant are equal');

        keyboard.press('enter');
        $cell = $element.find(`.${CALENDAR_SELECTED_DATE_CLASS}`);
        assert.equal($viewsWrapper.attr('aria-activedescendant'), $cell.attr('id'), 'selected cell id and activedescendant are equal');
    });

    QUnit.test('role for calendar cells and rows', function(assert) {
        this.$element.dxCalendar();

        const $row = this.$element.find('tr').last();
        const $cell = this.$element.find(`.${CALENDAR_CELL_CLASS}`).first();

        assert.equal($row.attr('role'), 'row', 'Row: aria role is correct');
        assert.equal($cell.attr('role'), 'gridcell', 'Cell: aria role is correct');
    });

    QUnit.test('The calendar view wrapper does not have an aria-readonly attribute', function(assert) {
        this.$element.dxCalendar({
            readOnly: true,
        });
        const $viewsWrapper = $(this.$element.find(`.${CALENDAR_VIEWS_WRAPPER_CLASS}`));

        assert.equal($viewsWrapper.attr('aria-readonly'), undefined);
    });

    QUnit.test('aria id on contoured date cell', function(assert) {
        const calendar = this.$element.dxCalendar({
            value: new Date(2015, 5, 1),
            focusStateEnabled: true
        }).dxCalendar('instance');
        const $viewsWrapper = $(calendar._$viewsWrapper);
        const keyboard = keyboardMock($viewsWrapper);

        calendar.focus();

        const viewElement = getCurrentViewInstance(calendar).$element();
        let $cell = $(viewElement.find(`.${CALENDAR_CONTOURED_DATE_CLASS}`));
        const cellId = $cell.attr('id');

        assert.strictEqual($cell.attr('aria-selected'), 'true', 'aria-selected is true');
        assert.notEqual(cellId, undefined, 'contoured cell has id');

        keyboard.press('right');
        assert.strictEqual($cell.attr('id'), undefined, 'id was removed from old contoured date cell');

        $cell = $(viewElement.find(`.${CALENDAR_CONTOURED_DATE_CLASS}`));
        const newCellId = $cell.attr('id');
        assert.notEqual(cellId, undefined, 'id was added to new contoured date cell');
        assert.notEqual(cellId, newCellId, 'id was refreshed');

        keyboard.press('enter');
        $cell = $(viewElement.find(`.${CALENDAR_CONTOURED_DATE_CLASS}`));
        assert.notEqual($cell.attr('id'), undefined, 'id was not remove when cell was selected');
        assert.notEqual($cell.attr('id'), newCellId, 'id was refreshed again');
    });

    QUnit.test('aria-selected on date cells, selectionMode=single', function(assert) {
        const calendar = this.$element.dxCalendar({
            selectionMode: 'single',
            value: new Date(2015, 5, 1),
            focusStateEnabled: true,
        }).dxCalendar('instance');

        const keyboard = keyboardMock($(calendar._$viewsWrapper));

        const viewElement = getCurrentViewInstance(calendar).$element();
        let $cell = $(viewElement.find(`.${CALENDAR_CELL_CLASS}:not(.${CALENDAR_SELECTED_DATE_CLASS})`)[1]);

        assert.strictEqual($cell.attr('aria-selected'), 'false', 'aria-selected is false on not selected cell');

        $cell = $(viewElement.find(`.${CALENDAR_SELECTED_DATE_CLASS}`));
        assert.strictEqual($cell.attr('aria-selected'), 'true', 'aria-selected is true');

        keyboard.press('right');
        assert.strictEqual($cell.attr('aria-selected'), 'true', 'aria-selected is still true');

        keyboard.press('enter');
        assert.strictEqual($cell.attr('aria-selected'), 'false', 'aria-selected is false on the old cell');

        $cell = $(viewElement.find(`.${CALENDAR_SELECTED_DATE_CLASS}`));
        assert.strictEqual($cell.attr('aria-selected'), 'true', 'aria-selected is true on the new cell');
    });

    QUnit.test('aria-selected on selected date cells on both views when viewsCount option equals 2', function(assert) {
        const calendar = this.$element.dxCalendar({
            value: '01/31/2015',
            viewsCount: 2
        }).dxCalendar('instance');

        let $cell = $(getCurrentViewInstance(calendar).$element().find(`.${CALENDAR_SELECTED_DATE_CLASS}`));
        assert.strictEqual($cell.attr('aria-selected'), 'true', 'aria-selected is true on the main view cell');

        $cell = $(getAdditionalViewInstance(calendar).$element().find(`.${CALENDAR_SELECTED_DATE_CLASS}`));
        assert.strictEqual($cell.attr('aria-selected'), 'true', 'aria-selected is true on the additional view cell');
    });

    ['multiple', 'range'].forEach((selectionMode) => {
        QUnit.test(`aria-selected on selected date cell, selectionMode=${selectionMode}`, function(assert) {
            const calendar = this.$element.dxCalendar({
                value: [new Date(2015, 5, 1)],
                selectionMode,
                focusStateEnabled: true,
            }).dxCalendar('instance');

            const keyboard = keyboardMock($(calendar._$viewsWrapper));

            const viewElement = getCurrentViewInstance(calendar).$element();
            let $cell = $(viewElement.find(`.${CALENDAR_CELL_CLASS}:not(.${CALENDAR_SELECTED_DATE_CLASS})`)[1]);

            assert.strictEqual($cell.attr('aria-selected'), 'false', 'aria-selected is false on not selected cell');

            $cell = $(viewElement.find(`.${CALENDAR_SELECTED_DATE_CLASS}`));
            assert.strictEqual($cell.attr('aria-selected'), 'true', 'aria-selected is true on the cell');

            keyboard.press('right');
            keyboard.press('enter');

            assert.strictEqual($cell.attr('aria-selected'), 'true', 'aria-selected is true on the old cell');

            $cell = $(viewElement.find(`.${CALENDAR_SELECTED_DATE_CLASS}`));
            assert.strictEqual($cell.attr('aria-selected'), 'true', 'aria-selected is true on the new cell');
        });
    });

    ['single', 'multiple', 'range'].forEach((selectionMode) => {
        QUnit.test(`aria-selected should be added to selected date cell afrer view change, selectionMode=${selectionMode}`, function(assert) {
            const calendar = this.$element.dxCalendar({
                selectionMode,
                value: selectionMode === 'single' ? new Date(2023, 1, 1) : [new Date(2023, 1, 1)],
                focusStateEnabled: true
            }).dxCalendar('instance');

            const keyboard = keyboardMock($(calendar._$viewsWrapper));

            let $cell = $(getCurrentViewInstance(calendar).$element().find(`.${CALENDAR_SELECTED_DATE_CLASS}`));
            assert.equal($cell.attr('aria-selected'), 'true', 'aria-selected is true on the cell');

            keyboard.press('up');
            keyboard.press('down');

            $cell = $(getCurrentViewInstance(calendar).$element().find(`.${CALENDAR_SELECTED_DATE_CLASS}`));
            assert.equal($cell.attr('aria-selected'), 'true', 'aria-selected is true on the cell');
        });
    });

    QUnit.test('cell id should be set before widget activedescendant attribute', function(assert) {
        const calendar = this.$element.dxCalendar({
            focusStateEnabled: true
        }).dxCalendar('instance');

        calendar.focus();

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
        const $viewsWrapper = $(calendar._$viewsWrapper);

        calendar.option('zoomLevel', 'year');
        calendar.focus();

        const $contouredDateCell = this.$element.find('.' + CALENDAR_CONTOURED_DATE_CLASS);

        assert.ok($contouredDateCell.attr('id'), 'aria id exists');
        assert.equal($contouredDateCell.attr('id'), $viewsWrapper.attr('aria-activedescendant'), 'cell has correct id');
    });

    QUnit.test('aria id on contoured cell after view change (T321824)', function(assert) {
        const clock = sinon.useFakeTimers();

        try {
            fx.off = false;

            const calendar = this.$element.dxCalendar({
                focusStateEnabled: true,
                value: new Date(2015, 5, 1)
            }).dxCalendar('instance');

            const $viewsWrapper = $(calendar._$viewsWrapper);
            const keyboard = keyboardMock($(calendar._$viewsWrapper));

            keyboard.press('up');
            clock.tick(VIEW_ANIMATION_DURATION);
            calendar.focus();

            const $contouredDateCell = this.$element.find('.' + CALENDAR_CONTOURED_DATE_CLASS);

            assert.ok($contouredDateCell.attr('id'), 'aria id exists');
            assert.equal($contouredDateCell.attr('id'), $viewsWrapper.attr('aria-activedescendant'), 'cell has correct id');

        } finally {
            fx.off = true;
            clock.restore();
        }
    });

    QUnit.test('table should have correct role after navigation to another view or zoom level', function(assert) {
        const calendar = this.$element.dxCalendar().dxCalendar('instance');
        const $navigatorNext = this.$element.find(`.${CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS}`);

        ['month', 'year', 'decade', 'century'].forEach((zoomLevel) => {
            calendar.option({ zoomLevel });
            $navigatorNext.trigger('dxclick');

            const $tables = this.$element.find('table');

            $tables.each((index, tableElement) => {
                const role = tableElement.getAttribute('role');
                const label = tableElement.getAttribute('aria-label');

                assert.strictEqual(role, 'grid', `zoomLevel: ${zoomLevel}, role is correct`);
                assert.strictEqual(label, 'Calendar', 'label is correct');
            });
        });
    });

    [
        { attr: 'aria-label', value: 'Week 1' },
        { attr: 'role', value: 'gridcell' },
    ].forEach(({ attr, value }) => {
        QUnit.test(`week number cell should have ${attr} attribute equals ${value}`, function(assert) {
            this.$element.dxCalendar({
                value: new Date(2022, 0, 1),
                showWeekNumbers: true
            });

            const $cell = this.$element.find(`.${CALENDAR_WEEK_NUMBER_CELL_CLASS}`).first();

            assert.equal($cell.attr(attr), value);
        });
    });

    ['month', 'year', 'decade', 'century'].forEach((zoomLevel) => {
        QUnit.test(`Previous view button should have 'Previous ${zoomLevel}' label when zoomLevel=${zoomLevel} on init`, function(assert) {
            this.$element.dxCalendar({
                zoomLevel
            });

            const $prevButton = this.$element.find(`.${CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS}`);
            const expectedLabel = `Previous ${zoomLevel}`;

            assert.equal($prevButton.attr('aria-label'), expectedLabel);
        });

        QUnit.test(`Previous view button should have 'Previous ${zoomLevel}' label when zoomLevel=${zoomLevel} on runtime`, function(assert) {
            const calendar = this.$element.dxCalendar({
                zoomLevel: zoomLevel === 'month' ? 'year' : 'month'
            }).dxCalendar('instance');

            calendar.option('zoomLevel', zoomLevel);

            const $prevButton = this.$element.find(`.${CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS}`);
            const expectedLabel = `Previous ${zoomLevel}`;

            assert.equal($prevButton.attr('aria-label'), expectedLabel);
        });

        QUnit.test(`Next view button should have 'Next ${zoomLevel}' label when zoomLevel=${zoomLevel} on init`, function(assert) {
            this.$element.dxCalendar({
                zoomLevel
            });

            const $nextButton = this.$element.find(`.${CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS}`);
            const expectedLabel = `Next ${zoomLevel}`;

            assert.equal($nextButton.attr('aria-label'), expectedLabel);
        });

        QUnit.test(`Next view button should have 'Next ${zoomLevel}' label when zoomLevel=${zoomLevel} on runtime`, function(assert) {
            const calendar = this.$element.dxCalendar({
                zoomLevel: zoomLevel === 'month' ? 'year' : 'month'
            }).dxCalendar('instance');

            calendar.option('zoomLevel', zoomLevel);

            const $nextButton = this.$element.find(`.${CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS}`);
            const expectedLabel = `Next ${zoomLevel}`;

            assert.equal($nextButton.attr('aria-label'), expectedLabel);
        });

        QUnit.test(`Caption button should have label with caption text+'${zoomLevel} selection' when zoomLevel=${zoomLevel} on init`, function(assert) {
            this.$element.dxCalendar({
                zoomLevel
            });

            const $captionButton = this.$element.find(`.${CALENDAR_CAPTION_BUTTON_CLASS}`);
            const captionText = $captionButton.dxButton('instance').option('text');
            const capitalizedZoomLevel = zoomLevel.charAt(0).toUpperCase() + zoomLevel.slice(1);
            const expectedLabel = `${captionText}. ${capitalizedZoomLevel} selection`;

            assert.equal($captionButton.attr('aria-label'), expectedLabel);
        });

        QUnit.test(`Caption button should have label with caption text+'${zoomLevel} selection' when zoomLevel=${zoomLevel} on runtime`, function(assert) {
            const calendar = this.$element.dxCalendar({
                zoomLevel: zoomLevel === 'month' ? 'year' : 'month'
            }).dxCalendar('instance');

            calendar.option('zoomLevel', zoomLevel);

            const $captionButton = this.$element.find(`.${CALENDAR_CAPTION_BUTTON_CLASS}`);
            const captionText = $captionButton.dxButton('instance').option('text');
            const capitalizedZoomLevel = zoomLevel.charAt(0).toUpperCase() + zoomLevel.slice(1);
            const expectedLabel = `${captionText}. ${capitalizedZoomLevel} selection`;

            assert.equal($captionButton.attr('aria-label'), expectedLabel);
        });
    });
});


QUnit.module('Regression', {
    beforeEach: function() {
        fx.off = true;
        this.$element = $('<div>').appendTo('#qunit-fixture');

        this.reinit = (options) => {
            this.$element.remove();
            this.$element = $('<div>').appendTo('#qunit-fixture');
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

        const $nextMonthButton = this.$element.find(`.${CALENDAR_NAVIGATOR_NEXT_MONTH_CLASS}`);

        $($nextMonthButton).trigger('dxclick');
        assert.equal(calendar.option('currentDate').getMonth(), 0);
    });

    QUnit.test('T182866: dxCalendar shows 31 Dec. 2013 twice in Firefox and Yandex browsers', function(assert) {
        const calendar = this.$element.dxCalendar({
            value: new Date(2013, 11, 31)
        }).dxCalendar('instance');
        const $view = $(getCurrentViewInstance(calendar).$element());

        const $cells = $view.find(`.${CALENDAR_CELL_CLASS}`);
        assert.equal($cells.filter((index, element) => {
            return $(element).text() === '31';
        }).length, 1);
    });

    QUnit.test('T190112: dxCalendar - month is not changed when click on cell in Firefox (December 2013 -> January 2014)', function(assert) {
        const calendar = this.$element.dxCalendar({
            currentDate: new Date(2013, 11, 31)
        }).dxCalendar('instance');

        $(this.$element.find(`.${CALENDAR_CELL_CLASS}[data-value=\'2014/01/01\']`)).trigger('dxclick');
        assert.equal(calendar.option('currentDate').getMonth(), 0);
    });

    QUnit.test('T190814: dxCalendar - unable to navigate by keyboard from December 2013 to January 2013 in Firefox', function(assert) {
        const calendar = this.$element.dxCalendar({
            value: new Date(2013, 11, 31),
            currentDate: new Date(2013, 11, 31),
            focusStateEnabled: true
        }).dxCalendar('instance');
        const $viewsWrapper = $(calendar._$viewsWrapper);

        $($viewsWrapper).trigger($.Event('keydown', { key: RIGHT_ARROW_KEY_CODE }));
        assert.equal(calendar.option('currentDate').getMonth(), 0);
    });
});


QUnit.module('dxCalendar number and string value support', {
    beforeEach: function() {
        this.$element = $('<div>').appendTo('#qunit-fixture');
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

    QUnit.test('new cell selection should change value correct if the value type is number', function(assert) {
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

['single', 'multiple', 'range'].forEach((selectionMode) => {
    QUnit.module(`valueChanged handler should receive correct event (selectionMode = ${selectionMode}`, {
        beforeEach: function() {
            fx.off = true;
            this.clock = sinon.useFakeTimers();
            this.valueChangedHandler = sinon.stub();
            this.$element = $('<div>')
                .dxCalendar({
                    focusStateEnabled: true,
                    currentDate: new Date(2010, 10, 10),
                    onValueChanged: this.valueChangedHandler,
                    selectionMode
                })
                .appendTo('#qunit-fixture');
            this.instance = this.$element.dxCalendar('instance');
            this.keyboard = keyboardMock($(this.instance._$viewsWrapper));

            this.testProgramChange = (assert) => {
                if(selectionMode === 'single') {
                    this.instance.option('value', new Date(1993, 2, 19));
                } else {
                    this.instance.option('value', [new Date(1993, 2, 19), new Date(1993, 2, 22)]);
                }

                const callCount = this.valueChangedHandler.callCount;
                const event = this.valueChangedHandler.getCall(callCount - 1).args[0].event;
                assert.strictEqual(event, undefined, 'event is undefined');
            };
            this.checkEvent = (assert, type, target, key) => {
                const event = this.valueChangedHandler.getCall(0).args[0].event;
                assert.strictEqual(event.type, type, 'event type is correct');
                assert.strictEqual(event.target, target.get(0), 'event target is correct');
                if(type === 'keydown') {
                    assert.strictEqual(normalizeKeyName(event), normalizeKeyName({ key }), 'event key is correct');
                }
            };
        },
        afterEach: function() {
            fx.off = false;
            this.clock.restore();
            this.$element.remove();
        }
    }, () => {
        QUnit.test('on runtime value change', function(assert) {
            this.testProgramChange(assert);
        });

        QUnit.test('on click on cell', function(assert) {
            const $cell = this.$element
                .find(`.${CALENDAR_CELL_CLASS}`)
                .eq(4);
            $cell.trigger('dxclick');

            this.checkEvent(assert, 'dxclick', $cell);
            this.testProgramChange(assert);
        });

        QUnit.test('after value selecting via the keyboard', function(assert) {
            this.instance.focus();
            this.keyboard.press('up');
            const $cell = $(`.${CALENDAR_CONTOURED_DATE_CLASS}`);

            this.keyboard.press('enter');

            this.checkEvent(assert, 'keydown', $cell, 'enter');
            this.testProgramChange(assert);
        });

        QUnit.test('after click on today button', function(assert) {
            this.instance.option('showTodayButton', true);
            const $todayButton = this.$element.find(`.${CALENDAR_TODAY_BUTTON_CLASS}`);

            $todayButton.trigger('dxclick');

            this.checkEvent(assert, 'dxclick', $todayButton);
            this.testProgramChange(assert);
        });
    });
});
