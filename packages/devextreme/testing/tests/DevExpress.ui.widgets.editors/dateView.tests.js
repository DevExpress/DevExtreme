import fx from 'common/core/animation/fx';
import translator from 'common/core/animation/translator';
import devices from '__internal/core/m_devices';
import { triggerShownEvent } from 'common/core/events/visibility_change';
import 'generic_light.css!';
import $ from 'jquery';
import dateLocalization from 'common/core/localization/date';
import '__internal/ui/date_box/m_date_view';
import '__internal/ui/date_box/m_date_view_roller';
import executeAsyncMock from '../../helpers/executeAsyncMock.js';
import pointerMock from '../../helpers/pointerMock.js';


QUnit.testStart(function() {
    const markup =
        '<div id="roller"></div>\
            <div id="picker"></div>\
            <div id="customDateView"></div>';

    $('#qunit-fixture').html(markup);
    $('#roller').css('height', '20px');
});


const DATEVIEW_CLASS = 'dx-dateview';
const DATEVIEW_WRAPPER_CLASS = 'dx-dateview-wrapper';
const DATEVIEW_ROLLER_CONTAINER_CLASS = 'dx-dateview-rollers';
const DATEVIEW_ROLLER_CLASS = 'dx-dateviewroller';
const DATEVIEW_ROLLER_CURRENT_CLASS = 'dx-dateviewroller-current';

const DATEVIEW_ROLLER_ITEM_CLASS = 'dx-dateview-item';
const DATEVIEW_ROLLER_ITEM_SELECTED_CLASS = 'dx-dateview-item-selected';
const DATEVIEW_ROLLER_ITEM_SELECTED_FRAME_CLASS = 'dx-dateview-item-selected-frame';
const DATEVIEW_ROLLER_ITEM_SELECTED_BORDER_CLASS = 'dx-dateview-item-selected-border';

devices.current({ platform: 'android', device: 'phone', version: '4' });

const commonConfig = {
    beforeEach: function() {
        executeAsyncMock.setup();
        fx.off = true;
    },

    afterEach: function() {
        executeAsyncMock.teardown();
        fx.off = false;
    }
};

QUnit.module('dateViewRoller', {
    beforeEach: function() {
        commonConfig.beforeEach.apply(this, arguments);

        this.element = $('#roller')
            .wrap('<div class=\'dx-dateview-wrapper\'>')
            .wrap('<div class=\'dx-dateview-rollers\'>');

        this.instance = this.element.dxDateViewRoller({ items: ['1', '2', '3'] }).dxDateViewRoller('instance');
    },
    afterEach: commonConfig.teardown
}, () => {
    QUnit.test('rendering - items', function(assert) {
        let items = this.element.find('.' + DATEVIEW_ROLLER_ITEM_CLASS);
        assert.equal(items.length, 3);
        assert.equal(items.text(), '123');

        this.instance.option('items', ['4', '5']);
        items = this.element.find('.' + DATEVIEW_ROLLER_ITEM_CLASS);
        assert.equal(items.length, 2);
        assert.equal(items.text(), '45');
    });

    QUnit.test('rendering - selected item frame', function(assert) {
        assert.equal(this.element.find('.' + DATEVIEW_ROLLER_ITEM_SELECTED_FRAME_CLASS).length, 1);
    });

    QUnit.test('rendering - selected item border', function(assert) {
        assert.equal(this.element.find('.' + DATEVIEW_ROLLER_ITEM_SELECTED_BORDER_CLASS).length, 1);
    });

    QUnit.test('selected item should be changed by item click', function(assert) {
        const $element = this.element.dxDateViewRoller({
            items: ['1', '2'],
            clickableItems: true
        });
        const instance = $element.dxDateViewRoller('instance');
        const $items = $element.find('.' + DATEVIEW_ROLLER_ITEM_CLASS);

        $($items.eq(1)).trigger('dxclick');
        assert.equal(instance.option('selectedIndex'), 1, 'selectedIndex changed');
    });

    QUnit.test('change selected item by option', function(assert) {
        const element = this.element.dxDateViewRoller({ items: ['1', '2', '3', '4', '5', '6', '7'] });
        const instance = element.dxDateViewRoller('instance');
        const content = element.find('.dx-scrollable-content');
        const itemHeight = element.find('.' + DATEVIEW_ROLLER_ITEM_CLASS).eq(0).outerHeight(true);

        assert.equal(content.position().top, 0 * itemHeight);

        instance.option('selectedIndex', 0);
        assert.equal(content.position().top, 0 * itemHeight);

        instance.option('selectedIndex', 1);
        assert.equal(content.position().top, -1 * itemHeight);

        instance.option('selectedIndex', 2);
        assert.equal(content.position().top, -2 * itemHeight);
    });

    QUnit.test('selected item active class', function(assert) {
        const element = this.element.dxDateViewRoller({ items: ['1', '2', '3'] });
        const instance = element.dxDateViewRoller('instance');
        const content = element.find('.dx-scrollable-content');
        const items = content.find('.' + DATEVIEW_ROLLER_ITEM_CLASS);
        let selected = 2;

        instance.option('selectedIndex', selected);
        assert.equal(items.filter('.' + DATEVIEW_ROLLER_ITEM_SELECTED_CLASS).length, 1);
        assert.ok(items.eq(selected).hasClass(DATEVIEW_ROLLER_ITEM_SELECTED_CLASS));

        selected = 1;

        instance.option('selectedIndex', selected);
        assert.equal(items.filter('.' + DATEVIEW_ROLLER_ITEM_SELECTED_CLASS).length, 1);
        assert.ok(items.eq(selected).hasClass(DATEVIEW_ROLLER_ITEM_SELECTED_CLASS));
    });

    QUnit.test('change selected item by UI', function(assert) {
        const element = this.element;
        const instance = this.instance;
        const content = element.find('.dx-scrollable-content');
        const itemHeight = element.find('.' + DATEVIEW_ROLLER_ITEM_SELECTED_CLASS).eq(0).outerHeight(true);
        const pointer = pointerMock(content);

        assert.equal(instance.option('selectedIndex'), 0);

        pointer.start().down().move(0, -itemHeight).wait(500).up();
        assert.equal(instance.option('selectedIndex'), 1);

        pointer.down().move(0, -itemHeight).wait(500).up();
        assert.equal(instance.option('selectedIndex'), 2);

        pointer.down().move(0, -itemHeight).wait(500).up();
        assert.equal(instance.option('selectedIndex'), 2);
    });

    QUnit.test('scrolling by step (UI)', function(assert) {
        const element = this.element.dxDateViewRoller({ items: ['1', '2', '3'], selectedIndex: 0 });
        const instance = element.dxDateViewRoller('instance');
        const content = element.find('.dx-scrollable-content');
        const itemHeight = element.find('.' + DATEVIEW_ROLLER_ITEM_SELECTED_CLASS).eq(0).outerHeight(true);
        const pointer = pointerMock(instance.container());

        pointer.start().down().move(0, -itemHeight * 0.7).wait(500).up();
        assert.equal(content.position().top, -itemHeight);

        pointer.start().down().move(0, -itemHeight * 0.1).wait(500).up();

        assert.equal(content.position().top, -itemHeight);
    });

    QUnit.test('selectedIndex can be changed by vertical swipe', function(assert) {
        const element = this.element.dxDateViewRoller({ items: ['1', '2', '3', '4', '5'], selectedIndex: 0 });
        const instance = element.dxDateViewRoller('instance');
        const content = element.find('.dx-scrollable-content');
        const itemHeight = element.find('.' + DATEVIEW_ROLLER_ITEM_SELECTED_CLASS).eq(0).outerHeight(true);
        const pointer = pointerMock(instance.container());

        pointer.start().down().move(0, -itemHeight * 4).wait(500).up();
        assert.strictEqual(content.position().top, -itemHeight * 4);
        assert.strictEqual(instance.option('selectedIndex'), 4);

        pointer.start().down().move(0, itemHeight * 2).wait(500).up();
        assert.strictEqual(content.position().top, -itemHeight * 2);
        assert.strictEqual(instance.option('selectedIndex'), 2);
    });

    QUnit.test('items changing leads to selected item recalculation', function(assert) {
        const element = this.element.dxDateViewRoller({ items: ['1', '2', '3', '4', '5'], selectedIndex: 4 });
        const instance = element.dxDateViewRoller('instance');

        instance.option('items', ['5', '4', '3', '2', '1']);
        assert.equal(instance.option('selectedIndex'), 4);

        instance.option('items', ['6', '7', '8']);
        assert.equal(instance.option('selectedIndex'), 2);
    });

    QUnit.test('clicking on non-selected item changes selectedIndex', function(assert) {
        const $element = this.element.dxDateViewRoller({
            items: ['1', '2', '3', '4', '5', '6', '7'],
            selectedIndex: 4
        });
        const instance = $element.dxDateViewRoller('instance');

        $($element.find('.' + DATEVIEW_ROLLER_ITEM_CLASS).eq(1)).trigger('dxclick');
        assert.equal(instance.option('selectedIndex'), 1, 'selectedIndex is changed correctly');
    });

    QUnit.test('\'onSelectedIndexChanged\' event', function(assert) {
        const value = 4;
        const newValue = 2;
        let valueChangedCount = 0;

        const $element = this.element.dxDateViewRoller({
            items: ['1', '2', '3', '4', '5', '6', '7'],
            selectedIndex: value,
            onSelectedIndexChanged: function(e) {
                valueChangedCount++;
                assert.equal(e.value, newValue, 'event data value is correct');
                assert.equal(e.previousValue, value, 'event data previous value is correct');
            }
        });

        const instance = $element.dxDateViewRoller('instance');

        instance.option('selectedIndex', newValue);
        assert.equal(valueChangedCount, 1, '\'onSelectedIndexChanged\' event was fired');
    });

    QUnit.test('Content should not be have a transform css property after complete', function(assert) {
        const element = this.element.dxDateViewRoller({ items: ['1', '2', '3'], selectedIndex: 0 });
        const instance = element.dxDateViewRoller('instance');
        const $content = element.find('.dx-scrollable-content');
        const $container = element.find('.dx-scrollable-container');
        const itemHeight = element.find('.' + DATEVIEW_ROLLER_ITEM_SELECTED_CLASS).eq(0).outerHeight(true);
        const pointer = pointerMock(instance.container());

        pointer.start().down().move(0, -itemHeight * 0.7).wait(500).up();
        assert.deepEqual(translator.locate($content), { top: 0, left: 0 });
        assert.equal($container.position().top, 0);
    });
});

QUnit.module('dateView', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers(new Date().valueOf());

        commonConfig.beforeEach.apply(this, arguments);

        this.element = $('#picker').dxDateView({ visible: true });
        this.wrapper = this.element.dxDateView('_wrapper');
        this.instance = this.element.dxDateView('instance');
    },

    afterEach: function() {
        commonConfig.afterEach.apply(this, arguments);
        this.clock.restore();
    }
}, () => {
    QUnit.test('DateView should have compact class on mobile device', function(assert) {
        const currentDevice = devices.current();
        devices.current({ platform: 'android', deviceType: 'phone' });

        try {
            const date = new Date(2013, 7, 31);

            const $element = $('#customDateView').dxDateView({
                visible: true,
                value: date
            });
            assert.ok($element.hasClass(DATEVIEW_CLASS + '-compact'), 'DateView isn\'t compact');
        } finally {
            devices.current(currentDevice);
        }
    });

    QUnit.test('DateView should not have compact class on desktop', function(assert) {
        const currentDevice = devices.current();
        devices.current({ platform: 'generic', deviceType: 'desktop' });

        try {
            const date = new Date(2013, 7, 31);

            const $element = $('#customDateView').dxDateView({
                visible: true,
                value: date
            });
            assert.notOk($element.hasClass(DATEVIEW_CLASS + '-compact'), 'DateView isn\'t compact');
        } finally {
            devices.current(currentDevice);
        }
    });
    QUnit.test('default value set correctly', function(assert) {
        this.clock.restore();
        const done = assert.async();
        const value = new Date(2015, 5, 5, 5, 5);

        const $dateView = $('<div>').appendTo('#qunit-fixture').dxDateView({
            value: value,
            minDate: new Date(2014, 1, 1, 1, 1),
            type: 'datetime'
        });

        triggerShownEvent($('#qunit-fixture'));

        setTimeout(() => {
            const instance = $dateView.dxDateView('instance');

            assert.notEqual(instance._rollers.year.scrollTop(), 0, 'year scroll correctly');
            assert.notEqual(instance._rollers.month.scrollTop(), 0, 'month scroll correctly');
            assert.notEqual(instance._rollers.day.scrollTop(), 0, 'day scroll correctly');
            assert.notEqual(instance._rollers.hours.scrollTop(), 0, 'hours scroll correctly');
            assert.notEqual(instance._rollers.minutes.scrollTop(), 0, 'minutes scroll correctly');

            done();
        });
    });

    QUnit.test('render default', function(assert) {
        assert.ok(this.element.hasClass(DATEVIEW_CLASS), 'render class exists');
        assert.ok(this.wrapper.hasClass(DATEVIEW_WRAPPER_CLASS), 'render wrapper class exists');
        assert.equal(this.wrapper.find('.' + DATEVIEW_ROLLER_CONTAINER_CLASS).length, 1, 'rollers div exists');
    });

    QUnit.test('active roller class', function(assert) {
        const datePickerElement = this.wrapper;
        const clock = this.clock;

        this.instance.option('value', new Date(2020, 5, 5, 8, 0));

        // NOTE: simulate triggering visibility change event in popup
        triggerShownEvent('#qunit-fixture');

        $.each(this.instance._rollers, function(type) {
            const pointer = pointerMock(this.container());
            pointer.start().down().move(0, -20).up();

            assert.equal(datePickerElement.find('.' + DATEVIEW_ROLLER_CURRENT_CLASS).length, 1, 'active roller [' + type + '] only one');
            assert.ok(this.$element().hasClass(DATEVIEW_ROLLER_CURRENT_CLASS), 'this roller [' + type + '] is active');

            clock.tick(400);
        });
    });

    QUnit.test('render rollers', function(assert) {
        this.instance.option('type', 'date');

        assert.equal(this.instance._$rollersContainer.find('.' + DATEVIEW_ROLLER_CLASS).length, 3, 'count [DATE] rollers class');

        this.instance.option('type', 'time');
        assert.equal(this.instance._$rollersContainer.find('.' + DATEVIEW_ROLLER_CLASS).length, 2, 'count [TIME] rollers class');

        this.instance.option('type', 'datetime');
        assert.equal(this.instance._$rollersContainer.find('.' + DATEVIEW_ROLLER_CLASS).length, 5, 'count [DATETIME] rollers class');
    });

    QUnit.test('check state rollers', function(assert) {
        const date = new Date(2012, 10, 23);
        const minDate = new Date(2010, 1);

        this.instance.option({ value: date, minDate: minDate });

        const rollers = this.instance._rollers;

        assert.equal(rollers.day.option('selectedIndex'), date.getDate() - 1);
        assert.equal(rollers.month.option('selectedIndex'), date.getMonth());
        assert.equal(rollers.year.option('selectedIndex'), date.getFullYear() - minDate.getFullYear());
    });

    QUnit.test('min and max date should take hours into account', function(assert) {
        const value = new Date(2000, 5, 5, 10, 0, 0);
        const min = new Date(2000, 5, 4, 8, 0, 0);
        const max = new Date(2000, 5, 6, 12, 0, 0);

        this.instance.option({ type: 'datetime', value: value, minDate: min, maxDate: max });

        const rollers = this.instance._rollers;
        let hourItems = rollers.hours.option('items');

        assert.equal(hourItems[0], 0, 'hours start from 0 in middle day');
        assert.equal(hourItems[hourItems.length - 1], 23, 'hours end at 23 in middle day');

        this.instance.option('value', new Date(2000, 5, 6, 11, 0, 0));
        hourItems = rollers.hours.option('items');

        assert.equal(hourItems[0], 0, 'hours start from 0 in last day');
        assert.equal(hourItems[hourItems.length - 1], 12, 'hours end at 12 in last day');

        this.instance.option('value', new Date(2000, 5, 4, 11, 0, 0));
        hourItems = rollers.hours.option('items');

        assert.equal(hourItems[0], 8, 'hours start from 8 in first day');
        assert.equal(hourItems[hourItems.length - 1], 23, 'hours end at 23 in first day');
    });

    // T584111
    QUnit.test('rollers are able to select a date in January when the min and max options allow choosing a date in the subsequent year', function(assert) {
        this.instance.option({
            value: new Date('2017-12-07'),
            minDate: new Date('2017-12-05'),
            maxDate: new Date('2018-01-31')
        });

        const rollers = this.instance._rollers;
        assert.deepEqual(rollers.month.option('items'), ['December']);

        rollers.year.option('selectedIndex', 1);
        assert.deepEqual(rollers.month.option('items'), ['January']);
    });

    QUnit.test('\'value\' option should depend on rollers position', function(assert) {
        const date = new Date(2012, 9, 10);
        const minDate = new Date(2000, 1);

        this.instance.option({ value: date, minDate: minDate });

        const rollers = this.instance._rollers;

        assert.deepEqual(this.instance.option('value'), date, 'initial value is correct');

        rollers.day.option('selectedIndex', 12);
        assert.deepEqual(this.instance.option('value'), new Date(2012, 9, 13), 'day is changed');

        rollers.month.option('selectedIndex', 10);
        assert.deepEqual(this.instance.option('value'), new Date(2012, 10, 13), 'month is changed');

        rollers.year.option('selectedIndex', 2);
        assert.deepEqual(this.instance.option('value'), new Date(2002, 10, 13), 'year is changed');
    });

    QUnit.test('it should be impossible to select date out of range via rollers', function(assert) {
        const date = new Date(2012, 9, 10);
        const minDate = new Date(2012, 7, 11);
        const maxDate = new Date(2012, 9, 11);

        this.instance.option({ value: date, maxDate: maxDate, minDate: minDate });

        const rollers = this.instance._rollers;
        rollers.month.option('selectedIndex', 1);
        rollers.day.option('selectedIndex', 12);
        rollers.month.option('selectedIndex', 2);

        assert.deepEqual(this.instance.option('value'), new Date(2012, 9, 11), 'date is not out of range');

        rollers.day.option('selectedIndex', 9);
        rollers.month.option('selectedIndex', 0);
        assert.deepEqual(this.instance.option('value'), new Date(2012, 7, 11), 'date is not out of range');
    });

    QUnit.test('max day in month overflow is prevented', function(assert) {
        const date = new Date(2012, 7, 31);
        const minDate = new Date(2000, 1);

        this.instance.option({ value: date, minDate: minDate });

        const rollers = this.instance._rollers;

        rollers.month.option('selectedIndex', 8);
        assert.deepEqual(this.instance.option('value'), new Date(2012, 8, 30));

        rollers.month.option('selectedIndex', 1);
        rollers.year.option('selectedIndex', 1);
        assert.deepEqual(this.instance.option('value'), new Date(2001, 1, 28));
    });

    QUnit.test('Dateview have all days in previous month with option maxDate', function(assert) {
        const date = new Date(2012, 7, 31);
        const maxDate = new Date(2025, 1, 15);

        this.instance.option({ value: date, maxDate: maxDate });
        const rollers = this.instance._rollers;

        rollers.month.option('selectedIndex', 0);

        const lastYearIndex = rollers.year.option('items').length;
        rollers.year.option('selectedIndex', lastYearIndex - 1);

        assert.deepEqual(rollers.day.option('items').length, 31, 'previous month have all days');

        rollers.month.option('selectedIndex', 1);
        assert.deepEqual(rollers.day.option('items').length, 15, 'last allowable month haven\'t all days');
    });

    QUnit.test('Dateview have all days in previous month with option minDate', function(assert) {
        const date = new Date(2012, 7, 31);
        const minDate = new Date(2005, 10, 15);

        this.instance.option({ value: date, minDate: minDate });

        const rollers = this.instance._rollers;

        rollers.year.option('selectedIndex', 0);

        rollers.month.option('selectedIndex', 1);
        assert.equal(rollers.day.option('items').length, 31, 'previous month have all days');

        rollers.month.option('selectedIndex', 0);
        assert.equal(rollers.day.option('items').length, 16, 'last allowable month haven\'t all days');
    });

    QUnit.test('Hour\'s roller should have values from 0 to 23', function(assert) {
        const date = new Date(2013, 7, 31);
        const hoursArr = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];

        this.instance.option({ value: date, type: 'datetime', pickerType: 'rollers' });

        const rollers = this.instance._rollers;

        assert.deepEqual(rollers.hours.option('items'), hoursArr, 'all hours generated correctly');
    });

    QUnit.test('rollers coherence', function(assert) {
        const date = new Date(2013, 7, 31);

        this.instance.option({ value: date });

        const rollers = this.instance._rollers;
        $.each(rollers, function() {
            this.option({ inertiaEnabled: false, bounceEnabled: false });
        });

        assert.equal(rollers.day.option('items').length, 31);

        rollers.month.option('selectedIndex', 1);
        assert.equal(this.instance._rollers.day.option('items').length, 28);
    });

    QUnit.test('setting 31st day after 30-day month was set is ok', function(assert) {
        const date = new Date(2013, 3, 30);

        this.instance.option({ value: date });

        const rollers = this.instance._rollers;
        $.each(rollers, function() {
            this.option({ inertiaEnabled: false, bounceEnabled: false });
        });

        this.instance._rollers.month.option('selectedIndex', 2);
        this.instance._rollers.day.option('selectedIndex', 30);

        assert.deepEqual(this.instance.option('value'), new Date(2013, 2, 31), 'date is correct');
    });

    QUnit.test('rollers order accordingly date type', function(assert) {
        const date = new Date(2000, 0, 1, 16, 24);

        this.instance.option({ value: date, type: 'date', culture: 'en' });
        let rollerOrder = $.map(this.instance._rollerConfigs, function(item) {
            return item.type;
        });
        assert.deepEqual(rollerOrder, ['month', 'day', 'year']);


        dateLocalization.inject({
            getFormatParts: function() {
                return ['day', 'month', 'year'];
            }
        });

        this.instance.repaint();

        rollerOrder = $.map(this.instance._rollerConfigs, function(item) {
            return item.type;
        });

        assert.deepEqual(rollerOrder, ['day', 'month', 'year']);
        dateLocalization.resetInjection();
    });

    QUnit.test('regression: each date component has right count', function(assert) {
        this.instance.option({
            value: new Date(2000, 11, 31, 23, 59, 59, 999),
            minDate: new Date(1999, 11, 31, 23, 59, 59, 999),
            maxDate: new Date(2001, 11, 31, 23, 59, 59, 999),
            type: 'datetime',
            culture: 'en'
        });

        const components = this.wrapper.find('.dx-scrollable-content');
        const months = components.eq(0).find('.dx-dateview-item');
        const days = components.eq(1).find('.dx-dateview-item');
        const years = components.eq(2).find('.dx-dateview-item');
        const hours = components.eq(3).find('.dx-dateview-item');
        const minutes = components.eq(4).find('.dx-dateview-item');

        assert.equal(months.length, 12, 'month count from January to December');
        assert.equal(days.length, 31, 'day count in December');
        assert.equal(years.length, 3, 'year count from 2000 to 2001');
        assert.equal(hours.length, 24, 'hour count from 0 to 23');
        assert.equal(minutes.length, 60, 'minute count form 0 to 59');
    });

    QUnit.test('B239399: render rollers in russian culture', function(assert) {
        try {
            this.instance.option('culture', 'ru');

            this.instance.option('type', 'time');
            assert.equal(this.instance._$rollersContainer.find('.' + DATEVIEW_ROLLER_CLASS).length, 2, 'count [TIME] rollers class in russian culture (24-hours format)');
        } finally {
            this.instance.option('culture', 'en');
        }
    });

    QUnit.test('min date should be configured correctly', function(assert) {
        const date = new Date(2013, 7, 20);
        const minDate = new Date(2013, 7, 20);

        this.instance.option({
            minDate: minDate,
            value: date
        });

        const rollers = this.instance._rollers;
        $.each(rollers, function() {
            this.option({ inertiaEnabled: false, bounceEnabled: false });
        });

        assert.equal(rollers.day.option('items').length, 31 - 19);
        assert.equal(rollers.month.option('items').length, 11 - 6);
    });

    QUnit.test('max date should be configured correctly', function(assert) {
        const date = new Date(2013, 7, 20);
        const maxDate = new Date(2013, 7, 20);

        this.instance.option({
            maxDate: maxDate,
            value: date
        });

        const rollers = this.instance._rollers;
        $.each(rollers, function() {
            this.option({ inertiaEnabled: false, bounceEnabled: false });
        });

        assert.equal(rollers.day.option('items').length, 20);
        assert.equal(rollers.month.option('items').length, 8);
    });

    QUnit.test('date should be the same if month changed with assigned min date option', function(assert) {
        const date = new Date(2013, 7, 20);
        const minDate = new Date(2013, 7, 20);

        this.instance.option({ minDate: minDate, value: date });

        const rollers = this.instance._rollers;
        $.each(rollers, function() {
            this.option({ inertiaEnabled: false, bounceEnabled: false });
        });

        this.instance._rollers.year.option('selectedIndex', 1);

        assert.equal(this.instance._rollers.day.option('selectedIndex'), 19);
        assert.equal(this.instance._rollers.month.option('selectedIndex'), 7);
    });

    QUnit.test('T152430: no widget rollers should be chosen after every opening', function(assert) {
        this.instance.option('visible', true);
        assert.equal($('.dx-dateviewroller-current').length, 0, 'no rollers are chosen after widget is opened first time');
        this.instance.option('visible', false);
        this.instance.option('visible', true);
        assert.equal($('.dx-dateviewroller-current').length, 0, 'no rollers are chosen after widget is opened second time');
    });

    QUnit.test('dateView should have class corresponding its type', function(assert) {
        const instance = this.instance;
        const $element = this.element;

        let prevClass = DATEVIEW_CLASS + '-' + instance.option('type');
        assert.ok($element.hasClass(prevClass), 'type specific class is set on init');

        $.each(['datetime', 'date', 'time'], function(_, type) {
            instance.option('type', type);
            assert.ok(!$element.hasClass(prevClass), 'previously set class is removed');
            prevClass = DATEVIEW_CLASS + '-' + type;
            assert.ok($element.hasClass(prevClass), '\'' + type + '\' type specific class is set');
        });
    });

    QUnit.test('T211302 - items number should be correct when min and max months are the same if value is out of range', function(assert) {
        const min = new Date(2015, 3, 10);
        const max = new Date(2015, 3, 20);
        const daysNumber = max.getDate() - min.getDate() + 1;

        const $element = $('#customDateView').dxDateView({
            value: new Date(2015, 4, 15),
            minDate: min,
            maxDate: max
        });

        const instance = $element.dxDateView('instance');
        const $dayRoller = $element.find('.' + DATEVIEW_ROLLER_CLASS + '-day');
        let $dayRollerItems = $dayRoller.find('.' + DATEVIEW_ROLLER_ITEM_CLASS);
        const $monthRoller = $element.find('.' + DATEVIEW_ROLLER_CLASS + '-month');
        const $monthRollerItems = $monthRoller.find('.' + DATEVIEW_ROLLER_ITEM_CLASS);

        assert.equal($monthRollerItems.length, 1, 'only one month item is rendered');
        assert.equal($dayRollerItems.length, daysNumber, 'only one month item is rendered');

        assert.ok($dayRollerItems.eq(daysNumber - 1).hasClass(DATEVIEW_ROLLER_ITEM_SELECTED_CLASS), 'last item is selected because value is greater than max');

        instance.option('value', new Date(2015, 1, 15));
        $dayRollerItems = $element.find('.' + DATEVIEW_ROLLER_CLASS + '-day .' + DATEVIEW_ROLLER_ITEM_CLASS);

        assert.ok($dayRollerItems.eq(0).hasClass(DATEVIEW_ROLLER_ITEM_SELECTED_CLASS), 'first item is selected because value is less than min');
    });

    QUnit.test('time of maximum date should be 23:59:59 by default (T249446)', function(assert) {
        const $element = $('#customDateView').dxDateView({}); const instance = $element.dxDateView('instance'); const maxDate = instance.option('maxDate'); const maxTime = maxDate.getHours() + ':' + maxDate.getMinutes() + ':' + maxDate.getSeconds();

        assert.equal(maxTime, '23:59:59', 'max hours is correct');
    });

    QUnit.test('value should be updated after day scroll if it is out of range', function(assert) {
        const min = new Date(2015, 3, 10);
        const max = new Date(2015, 3, 20);
        const $element = $('#customDateView').dxDateView({
            value: new Date(2015, 4, 15),
            minDate: min,
            maxDate: max
        });
        const instance = $element.dxDateView('instance');
        const dayRoller = instance._rollers.day;

        dayRoller.option('selectedIndex', 4);
        assert.deepEqual(instance.option('value'), new Date(2015, 3, 14), 'value is correct');
    });

    QUnit.test('click on non-selected roller item should change dateView value', function(assert) {
        const $element = $('#customDateView').dxDateView({
            value: new Date(2015, 4, 12)
        });
        const instance = $element.dxDateView('instance');

        $element.find('.' + DATEVIEW_ROLLER_CLASS + '-day').eq(0)
            .find('.' + DATEVIEW_ROLLER_ITEM_CLASS).eq(9).trigger('dxclick');
        assert.deepEqual(instance.option('value'), new Date(2015, 4, 10), 'value is changed correctly');

        $element.find('.' + DATEVIEW_ROLLER_CLASS + '-day').eq(0)
            .find('.' + DATEVIEW_ROLLER_ITEM_CLASS).eq(7).trigger('dxclick');
        assert.deepEqual(instance.option('value'), new Date(2015, 4, 8), 'value is changed correctly');
    });

    QUnit.test('should not fail if null is passed as value', function(assert) {
        assert.expect(0);

        $('#customDateView').dxDateView({
            value: null
        });
    });

    QUnit.test('the next value after null should have zero time components when type = \'date\' (T407518)', function(assert) {
        const instance = $('#customDateView').dxDateView({
            value: null
        }).dxDateView('instance');

        instance._rollers.day.option('selectedIndex', 1); // NOTE: Need because test failed at 1st day in month
        instance._rollers.day.option('selectedIndex', 0);
        const newValue = instance.option('value');

        assert.equal(newValue.getHours(), 0, 'hours component is 0');
        assert.equal(newValue.getMinutes(), 0, 'minutes component is 0');
        assert.equal(newValue.getSeconds(), 0, 'seconds component is 0');
        assert.equal(newValue.getMilliseconds(), 0, 'milliseconds component is 0');
    });

    QUnit.test('time component should be preserved after value is changed by rollers', function(assert) {
        const date = new Date(2016, 7, 8, 17, 52, 31, 57);
        const instance = $('#customDateView').dxDateView({
            value: date
        }).dxDateView('instance');

        instance._rollers.day.option('selectedIndex', 0);
        const newValue = instance.option('value');

        assert.equal(newValue.getHours(), date.getHours(), 'hours component is correct');
        assert.equal(newValue.getMinutes(), date.getMinutes(), 'minutes component is correct');
        assert.equal(newValue.getSeconds(), date.getSeconds(), 'seconds component is correct');
        assert.equal(newValue.getMilliseconds(), date.getMilliseconds(), 'milliseconds component is correct');
    });

    [ 'date', 'datetime' ].forEach((type) => {

        QUnit.test(`'type' = '${type}', use 'value' time component when changing 'value' > 'maxDate' (T823748)`, function(assert) {
            this.instance.option({
                type: type,
                minDate: new Date(2020, 0, 30, 1, 2, 0),
                value: new Date(2020, 0, 31, 3, 4, 0),
                maxDate: new Date(2020, 1, 1, 5, 6, 0)
            });

            this.instance._rollers.month.option('selectedIndex', 1);

            assert.deepEqual(this.instance.option('value'), new Date(2020, 1, 1, 3, 4, 0));
        });

        QUnit.test(`'type' = '${type}', use 'maxDate' time component when changing 'value' > 'maxDate'`, function(assert) {
            this.instance.option({
                type: type,
                minDate: new Date(2020, 0, 30, 1, 2, 0),
                value: new Date(2020, 0, 31, 5, 6, 0),
                maxDate: new Date(2020, 1, 1, 3, 4, 0)
            });

            this.instance._rollers.month.option('selectedIndex', 1);

            assert.deepEqual(this.instance.option('value'), new Date(2020, 1, 1, 3, 4, 0));
        });

        QUnit.test(`'type' = '${type}', use 'value' time component when changing 'value' < 'minDate'`, function(assert) {
            this.instance.option({
                type: type,
                minDate: new Date(2020, 0, 30, 3, 4, 0),
                value: new Date(2020, 1, 1, 1, 2, 0),
                maxDate: new Date(2020, 1, 1, 5, 6, 0)
            });

            this.instance._rollers.month.option('selectedIndex', 0);

            assert.deepEqual(this.instance.option('value'), new Date(2020, 0, 30, 3, 4, 0));
        });

        QUnit.test(`'type' = '${type}', use 'minDate' time component when changing 'value' < 'minDate'`, function(assert) {
            this.instance.option({
                type: type,
                minDate: new Date(2020, 0, 30, 1, 2, 0),
                value: new Date(2020, 1, 1, 0, 3, 4, 0),
                maxDate: new Date(2020, 1, 1, 5, 6, 0)
            });

            this.instance._rollers.month.option('selectedIndex', 0);

            assert.deepEqual(this.instance.option('value'), new Date(2020, 0, 30, 1, 2, 0));
        });

    });
});

