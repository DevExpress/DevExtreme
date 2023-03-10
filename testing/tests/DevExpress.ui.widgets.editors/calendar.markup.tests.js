import $ from 'jquery';
import dateSerialization from 'core/utils/date_serialization';
import { isDefined, isRenderer } from 'core/utils/type';
import config from 'core/config';
import windowUtils from 'core/utils/window';

import 'generic_light.css!';
import 'ui/calendar';

const CALENDAR_CLASS = 'dx-calendar';
const CALENDAR_WEEK_NUMBER_CELL_CLASS = 'dx-calendar-week-number-cell';
const CALENDAR_WEEK_NUMBER_HEADER_CLASS = 'dx-week-number-header';
const CALENDAR_NAVIGATOR_CLASS = 'dx-calendar-navigator';
const CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS = 'dx-calendar-navigator-previous-view';
const CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS = 'dx-calendar-navigator-next-view';
const CALENDAR_FOOTER_CLASS = 'dx-calendar-footer';
const CALENDAR_CAPTION_BUTTON_CLASS = 'dx-calendar-caption-button';
const CALENDAR_VIEWS_WRAPPER_CLASS = 'dx-calendar-views-wrapper';
const VIEWS_GAP = 32;

const toSelector = function(className) {
    return '.' + className;
};

const { module: testModule, test } = QUnit;

QUnit.module('Calendar markup', {
    beforeEach: function() {
        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.calendar = this.$element.dxCalendar({
            value: new Date(2013, 9, 15),
            firstDayOfWeek: 1,
            focusStateEnabled: true
        }).dxCalendar('instance');
    },
    afterEach: function() {
        this.$element.remove();
    }
}, () => {
    QUnit.test('\'dx-calendar\' class should be added', function(assert) {
        assert.ok(this.$element.hasClass(CALENDAR_CLASS));
    });

    QUnit.test('navigator is rendered', function(assert) {
        assert.equal(this.$element.find(toSelector(CALENDAR_NAVIGATOR_CLASS)).length, 1, 'navigator is rendered');
    });

    [1, 2].forEach((views) => {
        QUnit.test(`rendered views amount is correct when views option equals ${views}`, function(assert) {
            this.calendar.option('views', views);
            if(windowUtils.hasWindow()) {
                const hiddenViews = 2;
                assert.equal(this.$element.find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS) + ' .dx-widget').length, views + hiddenViews, 'all views are rendered');
            } else {
                assert.equal(this.$element.find(toSelector(CALENDAR_VIEWS_WRAPPER_CLASS) + ' .dx-widget').length, views, 'only one view is rendered');
            }
        });
    });

    QUnit.module('multiview', {
        beforeEach: function() {
            this.calendar.option('views', 2);
            this.viewWidth = this.calendar._viewWidth();
        }
    }, () => {
        QUnit.test('calendar should have inline width equals to two views width plus views gap', function(assert) {
            const elementWidth = this.$element[0].style.width;

            assert.strictEqual(elementWidth, `${this.viewWidth * 2 + VIEWS_GAP}px`);
        });

        QUnit.test('calendar should not have inline width after multiview runtime disable', function(assert) {
            this.calendar.option('views', 1);

            const elementWidth = this.$element[0].style.width;

            assert.strictEqual(elementWidth, '');
        });
    });

    QUnit.test('Calendar must render with dx-rtl class', function(assert) {
        const $element = $('<div>').appendTo('#qunit-fixture');
        $element.dxCalendar({
            value: new Date(2013, 9, 15),
            rtlEnabled: true
        });

        assert.ok($element.hasClass('dx-rtl'), 'class dx-rtl must be');
        $element.remove();
    });
});

QUnit.module('Hidden input', {
    beforeEach: function() {
        this.$element = $('<div>').appendTo('#qunit-fixture');
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
}, () => {
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
});

QUnit.module('The \'name\' option', {
    beforeEach: function() {
        this.$element = $('<div>').appendTo('#qunit-fixture');
    },
    afterEach: function() {
        this.$element.remove();
    }
}, () => {
    QUnit.test('widget input should get the \'name\' attribute with a correct value', function(assert) {
        const expectedName = 'some_name';
        const $element = this.$element.dxCalendar({
            name: expectedName
        });
        const $input = $element.find('input');

        assert.equal($input.attr('name'), expectedName, 'the input \'name\' attribute has correct value');
    });
});

QUnit.module('Navigator', {
    beforeEach: function() {
        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.calendar = this.$element.dxCalendar({
            value: new Date(2015, 5, 13)
        }).dxCalendar('instance');
    },
    afterEach: function() {
        this.$element.remove();
    }
}, () => {
    QUnit.test('Caption button is render', function(assert) {
        assert.strictEqual(this.$element.find('.dx-calendar-caption-button').length, 1);
    });

    QUnit.test('Calendar must display previous and next month links, and previous and next year links', function(assert) {
        assert.strictEqual(this.$element.find(toSelector(CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS)).length, 1);
        assert.strictEqual(this.$element.find(toSelector(CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS)).length, 1);
    });

    QUnit.test('Calendar must display the current month and year', function(assert) {
        const navigatorCaption = this.$element.find(toSelector(CALENDAR_CAPTION_BUTTON_CLASS));
        assert.equal(navigatorCaption.text(), 'June 2015');
    });

    QUnit.test('Calendar with two views should display 2 months', function(assert) {
        this.calendar.option('views', 2);
        const navigatorCaption = this.$element.find(toSelector(CALENDAR_CAPTION_BUTTON_CLASS));
        assert.equal(navigatorCaption.text(), 'June 2015 - July 2015');
    });
});

QUnit.module('Calendar footer', {
    beforeEach: function() {
        this.$element = $('<div>').appendTo('#qunit-fixture');
    },
    afterEach: function() {
        this.$element.remove();
    }
}, () => {
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
});

QUnit.module('showWeekNumbers', {
    beforeEach: function(assert) {
        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.calendar = this.$element.dxCalendar().dxCalendar('instance');

        this.reinit = (options) => {
            this.$element.remove();
            this.$element = $('<div>').appendTo('#qunit-fixture');
            this.calendar = this.$element.dxCalendar(options).dxCalendar('instance');
        };

        this.cacheTableElements = () => {
            this.$table = this.$element.find('table').eq(0);
            this.$headerRow = this.$table.find('thead').eq(0).children().eq(0);
            this.$firstBodyRow = this.$table.find('tbody').eq(0).children().eq(0);
        };

        this.checkColumnCount = (expectedColumnCount) => {
            this.cacheTableElements();

            assert.strictEqual(this.$headerRow.children().length, expectedColumnCount);
            assert.strictEqual(this.$firstBodyRow.children().length, expectedColumnCount);
        };
    },
    afterEach: function() {
        this.$element.remove();
    }
}, () => {
    QUnit.test('table should have additional column if showWeekNumbers=true', function() {
        this.reinit({ showWeekNumbers: true });

        this.checkColumnCount(8);
    });

    QUnit.test('table should not have additional column if showWeekNumbers=false', function() {
        this.reinit({ showWeekNumbers: false });

        this.checkColumnCount(7);
    });

    QUnit.test('table should be rerendered with additional column after runtime change of showWeekNumbers', function(assert) {
        this.reinit({});

        this.checkColumnCount(7);

        this.calendar.option('showWeekNumbers', true);

        this.checkColumnCount(8);
    });

    QUnit.test('first header cell should have "dx-week-number-header" class when showWeekNumbers=true', function(assert) {
        this.reinit({ showWeekNumbers: true });
        this.cacheTableElements();
        const $firstHeaderCell = this.$headerRow.children().eq(0);

        assert.ok($firstHeaderCell.hasClass(CALENDAR_WEEK_NUMBER_HEADER_CLASS));
    });

    QUnit.test('first cell in tbody should have "dx-calendar-week-number-cell" class when showWeekNumbers=true', function(assert) {
        this.reinit({ showWeekNumbers: true });
        this.cacheTableElements();
        const $firstBodyCell = this.$firstBodyRow.children().eq(0);

        assert.ok($firstBodyCell.hasClass(CALENDAR_WEEK_NUMBER_CELL_CLASS));
    });

    QUnit.test('last header cell should have "dx-week-number-header" class when showWeekNumbers=true and rtlEnabled=true', function(assert) {
        this.reinit({ showWeekNumbers: true, rtlEnabled: true });
        this.cacheTableElements();
        const $lastHeaderCell = this.$headerRow.children().eq(7);

        assert.ok($lastHeaderCell.hasClass(CALENDAR_WEEK_NUMBER_HEADER_CLASS));
    });

    QUnit.test('last cell in tbody should have "dx-calendar-week-number-cell" class when showWeekNumbers=true and rtlEnabled=true', function(assert) {
        this.reinit({ showWeekNumbers: true, rtlEnabled: true });
        this.cacheTableElements();
        const $lastBodyRowCell = this.$firstBodyRow.children().eq(7);

        assert.ok($lastBodyRowCell.hasClass(CALENDAR_WEEK_NUMBER_CELL_CLASS));
    });

    QUnit.test('calendar with zoomLevel!=="month" and showWeekNumbers=true should not have additional column', function(assert) {
        this.reinit({ showWeekNumbers: true, zoomLevel: 'year' });
        this.cacheTableElements();

        assert.strictEqual(this.$firstBodyRow.children().length, 4);
    });

    QUnit.test('calendar with zoomLevel="month" and showWeekNumbers=true should not have additional column after zoomLevel runtime change', function(assert) {
        this.reinit({ showWeekNumbers: true });
        this.calendar.option('zoomLevel', 'year');
        this.cacheTableElements();

        assert.strictEqual(this.$firstBodyRow.children().length, 4);
    });
});

QUnit.module('CellTemplate option', {
    beforeEach: function() {
        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.calendar = this.$element.dxCalendar().dxCalendar('instance');
    },
    reinit: function(options) {
        this.$element.remove();
        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.calendar = this.$element.dxCalendar(options).dxCalendar('instance');
    },
    afterEach: function() {
        this.$element.remove();
    }
}, () => {
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
});

QUnit.module('Aria accessibility', {
    beforeEach: function() {
        this.$element = $('<div>').appendTo('#qunit-fixture');
    },
    afterEach: function() {
        this.$element.remove();
    }
}, () => {
    QUnit.test('role for calendar widget', function(assert) {
        this.$element.dxCalendar();

        const $tables = this.$element.find('table');

        $tables.each((index, tableElement) => {
            const role = tableElement.getAttribute('role');
            const label = tableElement.getAttribute('aria-label');

            assert.strictEqual(role, 'grid', 'role is correct');
            assert.equal(label, 'Calendar', 'label is correct');
        });
    });
});

testModule('OptionChanged', {
    beforeEach: function() {
        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.createCalendar = (config = {}) => this.$element.dxCalendar(config).dxCalendar('instance');
        this.getViews = () => this.$element.find(`.${CALENDAR_VIEWS_WRAPPER_CLASS} .dx-widget`);
    },
    afterEach: function() {
        this.$element.remove();
    }
}, function() {
    [false, true].forEach((initialBoolOption) => {
        test(`Calendar with initial disabled=${initialBoolOption} option`, function(assert) {
            const instance = this.createCalendar({ disabled: initialBoolOption });
            this.getViews().each((index, element) => {
                assert.strictEqual($(element).hasClass('dx-state-disabled'), initialBoolOption, 'initial view\'s disabled state is correct');
            });

            instance.option('disabled', !initialBoolOption);

            this.getViews().each((index, element) => {
                assert.strictEqual($(element).hasClass('dx-state-disabled'), !initialBoolOption, 'updated view\'s disabled state is correct');
            });
        });

        test(`Calendar with initial rtlEnabled=${initialBoolOption} option`, function(assert) {
            const instance = this.createCalendar({ rtlEnabled: initialBoolOption });
            this.getViews().each((index, element) => {
                assert.strictEqual($(element).hasClass('dx-rtl'), initialBoolOption, 'initial view\'s RTL state is correct');
            });

            instance.option('rtlEnabled', !initialBoolOption);

            this.getViews().each((index, element) => {
                assert.strictEqual($(element).hasClass('dx-rtl'), !initialBoolOption, 'updated view\'s RTL state is correct');
            });
        });
    });
});

