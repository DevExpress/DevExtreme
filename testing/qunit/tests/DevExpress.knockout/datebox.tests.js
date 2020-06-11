const $ = require('jquery');
const fx = require('animation/fx');
const support = require('core/utils/support');
const devices = require('core/devices');
const uiDateUtils = require('ui/date_box/ui.date_utils');
const dateLocalization = require('localization/date');
const ko = require('knockout');

require('integration/knockout');
require('ui/date_box');

QUnit.testStart(function() {
    const markup =
        '<div id="dateBox"></div>\
        \
        <div id="several">\
            <div id="dateboxWithDateFormat" data-bind="dxDateBox: { value: value, type: \'date\', pickerType: \'native\' }"></div>\
            <div id="dateboxWithDateTimeFormat" data-bind="dxDateBox: { value: value, type: \'datetime\', pickerType: \'native\' }"></div>\
            <div id="dateboxWithTimeFormat" data-bind="dxDateBox: { value: value, type: \'time\', pickerType: \'native\' }"></div>\
        </div>\
        \
        <div id="B250640" data-bind="dxDateBox: { pickerType: \'calendar\', type: \'datetime\' }"></div>\
        \
        <div id="Q468727" data-bind="dxDateBox: { value: value, type: \'datetime\' }"></div>';

    $('#qunit-fixture').html(markup);
});

const toStandardDateFormat = uiDateUtils.toStandardDateFormat;

const FORMATS_MAP = uiDateUtils.FORMATS_MAP;
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const widgetName = 'dxDateBox';


const getInstanceWidget = function(instance) {
    return instance._strategy._widget;
};

const moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers(new Date().valueOf());

        this.$element = $('#dateBox')[widgetName]({ pickerType: 'native' });
        this.instance = this.$element[widgetName]('instance');
        this.$input = $.proxy(this.instance._input, this.instance);
    },
    afterEach: function() {
        this.clock.restore();
    }
};

const getExpectedResult = function(date, mode, stringDate) {
    let localizedDate;

    if(FORMATS_MAP[mode]) {
        localizedDate = dateLocalization.format(date, FORMATS_MAP[mode]);
    } else {
        localizedDate = toStandardDateFormat(date, mode);
    }

    return support.inputType(mode) ? stringDate : localizedDate;
};


QUnit.module('options changed callbacks', moduleConfig);

QUnit.test('several editors for same value', function(assert) {
    const value = new Date(2012, 10, 26, 16, 40, 0);
    let newValue = null;
    const vm = {
        value: ko.observable(value)
    };

    ko.applyBindings(vm, $('#several').get(0));

    const $date = $('#dateboxWithDateFormat').find('.dx-texteditor-input');
    const $datetime = $('#dateboxWithDateTimeFormat').find('.dx-texteditor-input');
    const $time = $('#dateboxWithTimeFormat').find('.dx-texteditor-input');
    const dateMode = $('#dateboxWithDateFormat').dxDateBox().dxDateBox('instance').option('mode');
    const datetimeMode = $('#dateboxWithDateTimeFormat').dxDateBox().dxDateBox('instance').option('mode');
    const timeMode = $('#dateboxWithTimeFormat').dxDateBox().dxDateBox('instance').option('mode');

    assert.equal($date.val(), getExpectedResult(value, dateMode, toStandardDateFormat(value, dateMode)), '\'date\' format is displayed correctly');
    assert.equal($datetime.val(), getExpectedResult(value, datetimeMode, toStandardDateFormat(value, datetimeMode)), '\'datetime\' format is displayed correctly');
    assert.equal($time.val(), getExpectedResult(value, timeMode, toStandardDateFormat(value, timeMode)), '\'time\' format is displayed correctly');

    newValue = new Date(2013, 11, 22, 16, 40, 0);
    $date
        .val(toStandardDateFormat(newValue, dateMode))
        .trigger('change');

    assert.equal($date.val(), getExpectedResult(newValue, dateMode, toStandardDateFormat(newValue, dateMode)), '\'date\' format is displayed correctly');
    assert.equal($datetime.val(), getExpectedResult(newValue, datetimeMode, toStandardDateFormat(newValue, datetimeMode)), '\'datetime\' format is displayed correctly');
    assert.equal($time.val(), getExpectedResult(newValue, timeMode, toStandardDateFormat(newValue, timeMode)), '\'time\' format is displayed correctly');

    newValue = new Date(2008, 9, 26, 22, 30);
    $datetime
        .val(toStandardDateFormat(newValue, datetimeMode))
        .trigger('change');

    assert.equal($date.val(), getExpectedResult(newValue, dateMode, toStandardDateFormat(newValue, dateMode)), '\'date\' format is displayed correctly');
    assert.equal($datetime.val(), getExpectedResult(newValue, datetimeMode, toStandardDateFormat(newValue, datetimeMode)), '\'datetime\' format is displayed correctly');
    assert.equal($time.val(), getExpectedResult(newValue, timeMode, toStandardDateFormat(newValue, timeMode)), '\'time\' format is displayed correctly');

    newValue = new Date(2008, 9, 26, 14, 29);
    $time
        .val(toStandardDateFormat(newValue, timeMode))
        .trigger('change');

    assert.equal($date.val(), getExpectedResult(newValue, dateMode, toStandardDateFormat(newValue, dateMode)), '\'date\' format is displayed correctly');
    assert.equal($datetime.val(), getExpectedResult(newValue, datetimeMode, toStandardDateFormat(newValue, datetimeMode)), '\'datetime\' format is displayed correctly');
    assert.equal($time.val(), getExpectedResult(newValue, timeMode, toStandardDateFormat(newValue, timeMode)), '\'time\' format is displayed correctly');
});


QUnit.module('dateView integration', {
    beforeEach: function() {
        fx.off = true;

        this.originalInputType = support.inputType;
        support.inputType = function() {
            return false;
        };
        moduleConfig.beforeEach.apply(this, arguments);
        this.instance.option('pickerType', 'calendar');

        this.popup = $.proxy(function() {
            return this._popup;
        }, this.instance);

        this.popupTitle = function() {
            return this.popup()._$title.find('.dx-toolbar-label').text();
        };

        this.instance.open();

        this.dateView = function() {
            return getInstanceWidget(this.instance);
        };
    },
    afterEach: function() {
        moduleConfig.afterEach.apply(this, arguments);
        support.inputType = this.originalInputType;
        fx.off = false;
    }
});

QUnit.test('B250640 - Unable to get property \'show\' of undefined or null reference', function(assert) {
    const $element = $('#B250640');

    ko.applyBindings({}, $element.get(0));
    $element.find('.' + TEXTEDITOR_INPUT_CLASS).trigger('dxclick');
    assert.ok(true, 'no exceptions were fired');
});

QUnit.test('Q468727 - dxDateBox - It is impossible to change a value if the initial value is undefined on a IOS device', function(assert) {
    if(!devices.real().ios) {
        assert.expect(0);
        return;
    }

    const vm = {
        value: ko.observable()
    };

    const $dateBox = $('#Q468727');
    ko.applyBindings(vm, $dateBox[0]);

    $dateBox
        .find('.' + TEXTEDITOR_INPUT_CLASS)
        .val('2010-10-10T10:10:10.500')
        .trigger('change');

    assert.ok(vm.value());
});
