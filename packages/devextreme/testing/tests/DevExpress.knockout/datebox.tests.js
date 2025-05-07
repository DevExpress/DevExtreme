import '../../helpers/noIntl.js';

import $ from 'jquery';
import fx from 'common/core/animation/fx';
import support from '__internal/core/utils/m_support';
import devices from '__internal/core/m_devices';
import uiDateUtils from '__internal/ui/date_box/m_date_utils';
import dateLocalization from 'common/core/localization/date';
import ko from 'knockout';

import 'integration/knockout';
import 'ui/date_box';

const moduleWithoutCsp = QUnit.urlParams['nocsp'] ? QUnit.module : QUnit.module.skip;

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

const isTextEditor = function($input) {
    return $input.prop('type') === 'text';
};

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


moduleWithoutCsp('options changed callbacks', moduleConfig);

QUnit.test('several editors for same value', function(assert) {
    const value = new Date(2012, 10, 26, 16, 40, 0);
    let newValue = null;
    const vm = {
        value: ko.observable(value)
    };

    ko.applyBindings(vm, $('#several').get(0));

    const getEditorTextByValue = function(value, type) {
        this.instance.option({
            type: type,
            value: value
        });

        return this.instance.option('text');
    }.bind(this);

    const $date = $('#dateboxWithDateFormat').find('.dx-texteditor-input');
    const $datetime = $('#dateboxWithDateTimeFormat').find('.dx-texteditor-input');
    const $time = $('#dateboxWithTimeFormat').find('.dx-texteditor-input');

    const dateMode = $('#dateboxWithDateFormat').dxDateBox().dxDateBox('instance').option('mode');

    const dateBoxWithDateTimeFormat = $('#dateboxWithDateTimeFormat').dxDateBox().dxDateBox('instance');
    const datetimeMode = dateBoxWithDateTimeFormat.option('mode');
    const timeMode = $('#dateboxWithTimeFormat').dxDateBox().dxDateBox('instance').option('mode');

    assert.equal($date.val(), getExpectedResult(value, dateMode, toStandardDateFormat(value, dateMode)), '\'date\' format is displayed correctly');
    assert.equal(dateBoxWithDateTimeFormat.option('text'), getExpectedResult(value, datetimeMode, toStandardDateFormat(value, datetimeMode)), '\'datetime\' format is displayed correctly');
    assert.equal($time.val(), getExpectedResult(value, timeMode, toStandardDateFormat(value, timeMode)), '\'time\' format is displayed correctly');

    newValue = new Date(2013, 11, 22, 16, 40, 0);

    let inputValue = isTextEditor($date) ?
        getEditorTextByValue(newValue, 'date') :
        toStandardDateFormat(newValue, dateMode);
    $date
        .val(inputValue)
        .trigger('change');

    assert.equal($date.val(), getExpectedResult(newValue, dateMode, toStandardDateFormat(newValue, dateMode)), '\'date\' format is displayed correctly');
    assert.equal(dateBoxWithDateTimeFormat.option('text'), getExpectedResult(newValue, datetimeMode, toStandardDateFormat(newValue, datetimeMode)), '\'datetime\' format is displayed correctly');
    assert.equal($time.val(), getExpectedResult(newValue, timeMode, toStandardDateFormat(newValue, timeMode)), '\'time\' format is displayed correctly');

    newValue = new Date(2008, 9, 26, 22, 30);
    inputValue = isTextEditor($datetime) ?
        getEditorTextByValue(newValue, 'datetime') :
        toStandardDateFormat(newValue, datetimeMode);
    $datetime
        .val(inputValue)
        .trigger('change');

    assert.equal($date.val(), getExpectedResult(newValue, dateMode, toStandardDateFormat(newValue, dateMode)), '\'date\' format is displayed correctly');
    assert.equal(dateBoxWithDateTimeFormat.option('text'), getExpectedResult(newValue, datetimeMode, toStandardDateFormat(newValue, datetimeMode)), '\'datetime\' format is displayed correctly');
    assert.equal($time.val(), getExpectedResult(newValue, timeMode, toStandardDateFormat(newValue, timeMode)), '\'time\' format is displayed correctly');

    newValue = new Date(2008, 9, 26, 14, 29);
    inputValue = isTextEditor($time) ?
        getEditorTextByValue(newValue, 'time') :
        toStandardDateFormat(newValue, timeMode);
    $time
        .val(inputValue)
        .trigger('change');

    assert.equal($date.val(), getExpectedResult(newValue, dateMode, toStandardDateFormat(newValue, dateMode)), '\'date\' format is displayed correctly');
    assert.equal(dateBoxWithDateTimeFormat.option('text'), getExpectedResult(newValue, datetimeMode, toStandardDateFormat(newValue, datetimeMode)), '\'datetime\' format is displayed correctly');
    assert.equal($time.val(), getExpectedResult(newValue, timeMode, toStandardDateFormat(newValue, timeMode)), '\'time\' format is displayed correctly');
});


moduleWithoutCsp('dateView integration', {
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
