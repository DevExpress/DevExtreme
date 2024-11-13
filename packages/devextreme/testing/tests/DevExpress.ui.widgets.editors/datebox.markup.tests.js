import $ from 'jquery';
import support from '__internal/core/utils/m_support';
import uiDateUtils from '__internal/ui/date_box/m_date_utils';
import DateBox from 'ui/date_box';
import dateLocalization from 'common/core/localization/date';
import keyboardMock from '../../helpers/keyboardMock.js';

QUnit.testStart(function() {
    const markup =
        '<div id="dateBox"></div>\
        <div id="widthRootStyle"></div>';

    $('#qunit-fixture').html(markup);
    $('#widthRootStyle').css('width', '300px');
});

import 'generic_light.css!';

const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const DATEBOX_CLASS = 'dx-datebox';
const DATEBOX_LIST_CLASS = 'dx-datebox-list';
const DX_AUTO_WIDTH_CLASS = 'dx-auto-width';

const moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers(new Date().valueOf());

        this.$element = $('#dateBox');

        this.createInstance = function(options) {
            this.instance = this.$element.dxDateBox($.extend({
                pickerType: 'native'
            }, options)).dxDateBox('instance');
        };
    },

    afterEach: function() {
        this.clock.restore();
    }
};

const getExpectedResult = function(date, mode, stringDate) {
    let localizedDate;

    if(uiDateUtils.FORMATS_MAP[mode]) {
        localizedDate = dateLocalization.format(date, uiDateUtils.FORMATS_MAP[mode]);
    } else {
        localizedDate = uiDateUtils.toStandardDateFormat(date, mode);
    }

    return support.inputType(mode) ? stringDate : localizedDate;
};

QUnit.module('Datebox markup', moduleConfig, () => {
    QUnit.test('attach dxDateBox', function(assert) {
        this.createInstance();
        assert.ok(this.instance instanceof DateBox);
        assert.ok(this.$element.hasClass(DATEBOX_CLASS));
    });

    QUnit.test('rendered markup when pickerType=\'list\'', function(assert) {
        this.createInstance({
            pickerType: 'list',
            type: 'time'
        });

        assert.ok(this.$element.hasClass(DATEBOX_LIST_CLASS), 'TimeBox initialized');
    });

    QUnit.test('clear button should not be rendered if pickerType is \'native\' (T209347)', function(assert) {
        this.createInstance({
            type: 'date',
            pickerType: 'native',
            showClearButton: true,
            value: new Date()
        });

        const $clearButton = this.$element.find('.dx-clear-button-area');

        assert.equal($clearButton.length, 0, 'no clear buttons are rendered');
    });

    QUnit.test('widget should render without error with \'showClearButton\'=true', function(assert) {
        let isOK = true;

        try {
            this.createInstance({
                showClearButton: true
            });
        } catch(e) {
            isOK = false;
        }

        assert.ok(isOK, 'widget rendered without any error');
    });
});

QUnit.module('Rendering input', moduleConfig, () => {
    QUnit.test('default field template test when pickerType=\'list\'', function(assert) {
        this.createInstance({
            pickerType: 'list',
            type: 'time',
            min: new Date(2008, 7, 8, 4, 0),
            value: new Date(2008, 7, 8, 5, 0),
            max: new Date(2008, 7, 8, 6, 0)
        });

        const $input = this.$element.find('.dx-texteditor-input');

        assert.equal($input.val(), '5:00 AM', 'field template is right');
    });

    QUnit.test('render value', function(assert) {
        const date = new Date(2012, 10, 26, 16, 40, 23);

        this.createInstance({
            value: date
        });

        assert.equal(this.instance._input().val(), getExpectedResult(date, this.instance.option('mode'), '2012-11-26'));
        assert.ok(!this.instance._input().prop('disabled'));
    });

    QUnit.test('render type - datetime', function(assert) {
        const date = new Date(2012, 10, 26, 16, 40, 0);

        this.createInstance({
            value: date,
            type: 'datetime'
        });

        assert.equal(!support.inputType('datetime'), this.instance.option('mode') === 'datetime-local', 'if \'datetime\' mode is not supported, it is change to \'datetime-local\'');

        assert.equal(uiDateUtils.fromStandardDateFormat(this.instance._input().val()).getTime(), date.getTime());
    });

    QUnit.test('format should be correct when pickerType is calendar', function(assert) {
        const date = new Date($.now());

        this.createInstance({
            type: 'datetime',
            pickerType: 'calendar',
            value: date
        });

        const formattedValue = dateLocalization.format(date, uiDateUtils.FORMATS_MAP['datetime']);

        assert.equal(this.$element.find('.' + TEXTEDITOR_INPUT_CLASS).val(), formattedValue, 'correct format');
    });

    QUnit.test('render type - time', function(assert) {
        const date = new Date(2012, 10, 26, 16, 40, 0);

        this.createInstance({
            value: date,
            type: 'time'
        });

        const inputValue = this.instance._input().val();
        const normalizedInputValue = support.inputType(this.instance.option('mode')) ? uiDateUtils.fromStandardDateFormat(inputValue) : dateLocalization.parse(inputValue, uiDateUtils.FORMATS_MAP.time);

        assert.equal(normalizedInputValue.getHours(), date.getHours());
        assert.equal(normalizedInputValue.getMinutes(), date.getMinutes());
    });

    QUnit.test('render disabled state', function(assert) {
        this.createInstance({
            disabled: true,
            type: 'datetime'
        });

        assert.ok(this.instance._input().prop('disabled'));
    });

    QUnit.test('datebox should set min and max attributes to the native input (T258860)', function(assert) {
        this.createInstance({
            type: 'date',
            pickerType: 'native',
            min: new Date(2015, 5, 2),
            max: new Date(2015, 7, 2)
        });

        const $input = this.$element.find('.' + TEXTEDITOR_INPUT_CLASS);

        assert.equal($input.attr('min'), '2015-06-02', 'minimum date initialized correctly');
        assert.equal($input.attr('max'), '2015-08-02', 'maximum date initialized correctly');
    });

    QUnit.test('DateBox with masked behavior should not set the selection of the hidden unfocused input', function(assert) {
        this.$element.hide();
        this.createInstance({
            value: new Date('10/10/2012 13:07'),
            useMaskBehavior: true,
            mode: 'text',
            displayFormat: 'd.MM.yyyy',
            pickerType: 'calendar'
        });
        this.$element.show();

        const $input = this.$element.find('.dx-texteditor-input');
        const keyboard = keyboardMock($input, true);

        const {
            start: selectionStart,
            end: selectionEnd
        } = keyboard.caret();
        const isDayPartSelected = selectionStart === 0 && selectionEnd === 2;

        assert.notOk(isDayPartSelected, 'correct intial position');
    });
});

QUnit.module('pickerType', () => {
    QUnit.test('correct behavior for the \'calendar\' value, type=\'date\'', function(assert) {
        const $element = $('#dateBox').dxDateBox({
            value: new Date(),
            pickerType: 'calendar',
            type: 'date'
        });
        const instance = $element.dxDateBox('instance');

        assert.equal(instance._strategy.NAME, 'Calendar', 'strategy is correct for the \'date\' type');
    });

    QUnit.test('correct behavior for the \'calendar\' value, type=\'datetime\'', function(assert) {
        const $element = $('#dateBox').dxDateBox({
            value: new Date(),
            pickerType: 'calendar',
            type: 'datetime'
        });
        const instance = $element.dxDateBox('instance');

        assert.equal(instance._strategy.NAME, 'CalendarWithTime', 'strategy is correct for the \'datetime\' type');
    });

    QUnit.test('correct behavior for the \'list\' value', function(assert) {
        const $element = $('#dateBox').dxDateBox({
            value: new Date(),
            pickerType: 'list',
            type: 'time'
        });
        const instance = $element.dxDateBox('instance');

        assert.equal(instance._strategy.NAME, 'List', 'strategy is correct');
    });

    QUnit.test('correct behavior for the \'rollers\' value', function(assert) {
        const $element = $('#dateBox').dxDateBox({
            value: new Date(),
            pickerType: 'rollers',
            type: 'date'
        });
        const instance = $element.dxDateBox('instance');

        assert.equal(instance._strategy.NAME, 'DateView', 'strategy is correct');
    });

    QUnit.test('correct behavior for the \'native\' value', function(assert) {
        const $element = $('#dateBox').dxDateBox({
            value: new Date(),
            pickerType: 'native',
            type: 'date'
        });
        const instance = $element.dxDateBox('instance');

        assert.equal(instance._strategy.NAME, 'Native', 'strategy is correct');
    });
});

QUnit.module('hidden input', () => {
    QUnit.test('a hidden input should be rendered', function(assert) {
        const $element = $('#dateBox').dxDateBox(); const $hiddenInput = $element.find('input[type=\'hidden\']');

        assert.equal($hiddenInput.length, 1, 'hidden input is rendered');
    });

    QUnit.test('the value should be passed to the hidden input on init', function(assert) {
        const dateValue = new Date(2016, 6, 15);
        const type = 'date';
        const stringValue = uiDateUtils.toStandardDateFormat(dateValue, type);
        const $element = $('#dateBox').dxDateBox({
            value: dateValue,
            type: type
        });
        const $hiddenInput = $element.find('input[type=\'hidden\']');

        assert.equal($hiddenInput.val(), stringValue, 'input value is correct after init');
    });

    QUnit.test('the value should be passed to the hidden input in the correct format if dateSerializationFormat option is defined', function(assert) {
        const dateValue = new Date(Date.UTC(2016, 6, 15, 14, 30));
        const $element = $('#dateBox').dxDateBox({
            type: 'datetime',
            dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssZ',
            value: dateValue
        });

        assert.equal($element.find('input[type=\'hidden\']').val(), '2016-07-15T14:30:00Z', 'input value is correct for the \'yyyy-MM-ddTHH:mm:ssZ\' format');
    });
});

QUnit.module('the \'name\' option', () => {
    QUnit.test('widget hidden input should get the \'name\' attribute with a correct value', function(assert) {
        const expectedName = 'some_name';
        const $element = $('#dateBox').dxDateBox({
            name: expectedName
        });
        const $input = $element.find('input[type=\'hidden\']');

        assert.equal($input.attr('name'), expectedName, 'the input \'name\' attribute has correct value');
    });
});

QUnit.module('widget sizing render', () => {
    QUnit.test('component should have special css class when the user set the width option', function(assert) {
        const $element = $('#dateBox').dxDateBox({
            width: 100
        });
        const component = $element.dxDateBox('instance');

        assert.notOk($element.hasClass(DX_AUTO_WIDTH_CLASS), 'component has not class');

        component.option('width', undefined);
        assert.ok($element.hasClass(DX_AUTO_WIDTH_CLASS), 'component has class');
    });

    QUnit.test('constructor', function(assert) {
        const $element = $('#dateBox').dxDateBox({
            pickerType: 'rollers',
            width: 400
        });
        const instance = $element.dxDateBox('instance');

        assert.strictEqual(instance.option('width'), 400);
        assert.strictEqual($element[0].style.width, 400 + 'px', 'outer width of the element must be equal to custom width');
    });

    QUnit.test('root with custom width', function(assert) {
        const $element = $('#widthRootStyle').dxDateBox(); const instance = $element.dxDateBox('instance');

        assert.strictEqual(instance.option('width'), undefined);
        assert.strictEqual($element[0].style.width, 300 + 'px', 'outer width of the element must be equal to custom width');
    });

    QUnit.test('constructor, calendar integration', function(assert) {
        const $element = $('#dateBox').dxDateBox({ pickerType: 'calendar', width: 1234 }); const instance = $element.dxDateBox('instance');

        assert.strictEqual(instance.option('width'), 1234);
        assert.strictEqual($element[0].style.width, 1234 + 'px', 'outer width of the element must be equal to custom width');
    });

    QUnit.test('root with custom width, calendar integration', function(assert) {
        const $element = $('#widthRootStyle').dxDateBox({ pickerType: 'calendar' }); const instance = $element.dxDateBox('instance');

        assert.strictEqual(instance.option('width'), undefined);
        assert.strictEqual($element[0].style.width, 300 + 'px', 'outer width of the element must be equal to custom width');
    });
});

QUnit.module('native datebox', {
    beforeEach: function() {
        this.$dateBox = $('#dateBox');

        this.dateBox = this.$dateBox
            .dxDateBox({
                pickerType: 'native'
            })
            .dxDateBox('instance');
    },
    afterEach: function() {
    }
}, () => {
    QUnit.test('widget should work correctly', function(assert) {
        assert.ok(this.dateBox, 'Instance of native datepicker should work for each platform');
        assert.equal(this.dateBox._strategy.NAME, 'Native', 'correct strategy is chosen');
    });
});

