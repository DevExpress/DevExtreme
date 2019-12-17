const $ = require('jquery');
const dateSerialization = require('core/utils/date_serialization');
const isDefined = require('core/utils/type').isDefined;
const config = require('core/config');
const isRenderer = require('core/utils/type').isRenderer;
const hasWindow = require('core/utils/window').hasWindow;

require('common.css!');
require('generic_light.css!');
require('ui/calendar');

const CALENDAR_CLASS = 'dx-calendar';
const CALENDAR_NAVIGATOR_CLASS = 'dx-calendar-navigator';
const CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS = 'dx-calendar-navigator-previous-view';
const CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS = 'dx-calendar-navigator-next-view';
const CALENDAR_FOOTER_CLASS = 'dx-calendar-footer';
const CALENDAR_CAPTION_BUTTON_CLASS = 'dx-calendar-caption-button';
const CALENDAR_VIEWS_WRAPPER_CLASS = 'dx-calendar-views-wrapper';

const toSelector = function(className) {
    return '.' + className;
};

QUnit.module('Calendar markup', {
    beforeEach: function() {
        this.$element = $('<div>').appendTo('body');
        this.calendar = this.$element.dxCalendar({
            value: new Date(2013, 9, 15),
            firstDayOfWeek: 1,
            focusStateEnabled: true
        }).dxCalendar('instance');
    },
    afterEach: function() {
        this.$element.remove();
    }
});

QUnit.test('\'dx-calendar\' class should be added', function(assert) {
    assert.ok(this.$element.hasClass(CALENDAR_CLASS));
});

QUnit.test('navigator is rendered', function(assert) {
    assert.equal(this.$element.find(toSelector(CALENDAR_NAVIGATOR_CLASS)).length, 1, 'navigator is rendered');
});

QUnit.test('views are rendered', function(assert) {
    if(hasWindow()) {
        assert.equal(this.$element.find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS) + ' .dx-widget').length, 3, 'all views are rendered');
    } else {
        assert.equal(this.$element.find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS) + ' .dx-widget').length, 1, 'only one view is rendered');
    }
});

QUnit.test('Calendar must render with dx-rtl class', function(assert) {
    const $element = $('<div>').appendTo('body');
    $element.dxCalendar({
        value: new Date(2013, 9, 15),
        rtlEnabled: true
    });

    assert.ok($element.hasClass('dx-rtl'), 'class dx-rtl must be');
    $element.remove();
});

QUnit.module('Hidden input', {
    beforeEach: function() {
        this.$element = $('<div>').appendTo('body');
        this.calendar = this.$element.dxCalendar({
            value: new Date(2013, 9, 15)
        }).dxCalendar('instance');

        this.stringValue = function(value) {
            return dateSerialization.serializeDate(value, 'yyyy-MM-dd');
        };
    },
    afterEach: function() {
        this.$element.remove();
    }
});

QUnit.test('Calendar must create a hidden input', function(assert) {
    const $input = this.$element.find('input');

    assert.equal($input.length, 1, 'input is rendered');
    assert.equal($input.attr('type'), 'hidden', 'input type is \'hidden\'');
});

QUnit.test('Calendar should pass value to the hidden input on init', function(assert) {
    const $input = this.$element.find('input');

    const expectedValue = this.stringValue(this.calendar.option('value'));
    assert.equal($input.val(), expectedValue, 'input value is correct after init');
});


QUnit.module('The \'name\' option', {
    beforeEach: function() {
        this.$element = $('<div>').appendTo('body');
    },
    afterEach: function() {
        this.$element.remove();
    }
});

QUnit.test('widget input should get the \'name\' attribute with a correct value', function(assert) {
    const expectedName = 'some_name';
    const $element = this.$element.dxCalendar({
        name: expectedName
    });
    const $input = $element.find('input');

    assert.equal($input.attr('name'), expectedName, 'the input \'name\' attribute has correct value');
});

QUnit.module('Navigator', {
    beforeEach: function() {
        this.$element = $('<div>').appendTo('body');
        this.calendar = this.$element.dxCalendar({
            value: new Date(2015, 5, 13)
        }).dxCalendar('instance');
    },
    afterEach: function() {
        this.$element.remove();
    }
});

QUnit.test('Caption button is render', function(assert) {
    assert.ok(this.$element.find('.dx-calendar-caption-button').length === 1);
});

QUnit.test('Calendar must display previous and next month links, and previous and next year links', function(assert) {
    assert.ok(this.$element.find(toSelector(CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS)).length === 1);
    assert.ok(this.$element.find(toSelector(CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS)).length === 1);
});

QUnit.test('Calendar must display the current month and year', function(assert) {
    const navigatorCaption = this.$element.find(toSelector(CALENDAR_CAPTION_BUTTON_CLASS));
    assert.equal(navigatorCaption.text(), 'June 2015');
});

QUnit.module('Calendar footer', {
    beforeEach: function() {
        this.$element = $('<div>').appendTo('body');
    },
    afterEach: function() {
        this.$element.remove();
    }
});

QUnit.test('calendar must have _footer if showTodayButton = true', function(assert) {
    const $element = this.$element;
    $element.dxCalendar({
        value: new Date(2015, 5, 13),
        showTodayButton: true
    }).dxCalendar('instance');
    assert.equal($element.find(toSelector(CALENDAR_FOOTER_CLASS)).length, 1, 'footer exist');
});

QUnit.test('calendar mustn\'t have _footer if showTodayButton  = false', function(assert) {
    const $element = this.$element;
    $element.dxCalendar({
        value: new Date(2015, 5, 13),
        showTodayButton: false
    }).dxCalendar('instance');
    assert.equal($element.find(toSelector(CALENDAR_FOOTER_CLASS)).length, 0, 'footer doesn\'t exist');
});

QUnit.module('CellTemplate option', {
    beforeEach: function() {
        this.$element = $('<div>').appendTo('body');
        this.calendar = this.$element.dxCalendar().dxCalendar('instance');
    },
    reinit: function(options) {
        this.$element.remove();
        this.$element = $('<div>').appendTo('body');
        this.calendar = this.$element.dxCalendar(options).dxCalendar('instance');
    },
    afterEach: function() {
        this.$element.remove();
    }
});

QUnit.test('custom markup should be applied', function(assert) {
    const $cellTemplate = $('<span class=\'custom-cell-class\'>');

    try {
        this.reinit({
            value: new Date(2013, 11, 15),
            currentDate: new Date(2013, 11, 15),
            cellTemplate: $cellTemplate
        });

        assert.ok(this.$element.find('.custom-cell-class').length > 0, 'custom templated cells are rendered');

    } finally {
        $cellTemplate.remove();
    }
});

QUnit.test('correct data should be passed to cellTemplate', function(assert) {
    let data;

    this.reinit({
        cellTemplate: function(itemData, itemIndex, itemElement) {
            assert.equal(isRenderer(itemElement), !!config().useJQuery, 'itemElement is correct');
            if(!data) {
                data = itemData;
            }
        }
    });

    assert.equal(isDefined(data.text), true, 'text field is present in itemData');
    assert.equal(isDefined(data.date), true, 'date field is present in itemData');
    assert.equal(isDefined(data.view), true, 'view field is present in itemData');
});

QUnit.test('calendar must have view class name', function(assert) {
    const className = 'dx-calendar-view-';

    $.each(['month', 'year', 'decade', 'century'], (function(_, type) {
        this.reinit({
            zoomLevel: type
        });
        const $element = this.$element;

        assert.ok($element.hasClass(className + type));

        $.each(['month', 'year', 'decade', 'century'], function(_, affix) {
            if(type !== affix) assert.ok(!$element.hasClass(className + affix));
        });
    }).bind(this));
});

QUnit.module('Aria accessibility', {
    beforeEach: function() {
        this.$element = $('<div>').appendTo('body');
    },
    afterEach: function() {
        this.$element.remove();
    }
});

QUnit.test('role for calendar widget', function(assert) {
    const $element = this.$element;

    $element.dxCalendar();

    assert.equal($element.attr('role'), 'listbox', 'role is correct');
    assert.equal($element.attr('aria-label'), 'Calendar', 'label is correct');
});
