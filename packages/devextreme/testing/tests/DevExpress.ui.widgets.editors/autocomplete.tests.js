import $ from 'jquery';
import ArrayStore from 'common/data/array_store';
import Autocomplete from 'ui/autocomplete';
import config from 'core/config';
import devices from '__internal/core/m_devices';
import executeAsyncMock from '../../helpers/executeAsyncMock.js';
import fx from 'common/core/animation/fx';
import keyboardMock from '../../helpers/keyboardMock.js';
import pointerMock from '../../helpers/pointerMock.js';
import resizeCallbacks from 'core/utils/resize_callbacks';
import { isRenderer } from 'core/utils/type';
import { normalizeKeyName } from 'common/core/events/utils/index';
import { getHeight, getOuterHeight } from 'core/utils/size';

import 'generic_light.css!';
import 'ui/select_box';

QUnit.testStart(() => {
    const markup =
        '<div id="qunit-fixture" class="dx-viewport">\
            <div id="widget"></div>\
            <div id="widthRootStyle"></div>\
            <div id="autocomplete"></div>\
        \
        <div id="autocomplete2"></div>\
        \
        <div id="autocompleteTemplate">\
            <div data-options="dxTemplate : { name: \'item\' } ">\
                <span>Test</span>\
                <span data-bind="text: $data"></span>\
            </div>\
        </div>\
        \
        <div id="multifieldDS">\
            <div data-options="dxTemplate : { name: \'item\' } ">\
                <span>***</span>\
                <span data-bind="text: item"></span>\
                <div data-bind="text: description"></div>\
            </div>\
        </div>\
    </div>';

    $('#qunit-fixture').html(markup);
    $('#widthRootStyle').css('width', '300px');
});

const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const LIST_CLASS = 'dx-list';
const LIST_ITEM_CLASS = 'dx-list-item';
const CLEAR_BUTTON_AREA_SELECTOR = '.dx-clear-button-area';
const FOCUSED_STATE_SELECTOR = '.dx-state-focused';
const KEY_DOWN = 'ArrowDown';
const KEY_UP = 'ArrowUp';
const KEY_ENTER = 'Enter';
const KEY_ESC = 'Escape';
const KEY_TAB = 'Tab';

QUnit.module('dxAutocomplete', {
    beforeEach: function() {
        fx.off = true;
        executeAsyncMock.setup();
        Autocomplete.defaultOptions({ options: { deferRendering: false } });
        this.clock = sinon.useFakeTimers();

        this.element = $('#autocomplete').dxAutocomplete({
            value: 'text',
            dataSource: ['item 1', 'item 2', 'item 3'],
            searchTimeout: 0,
            focusStateEnabled: true
        });
        this.instance = this.element.dxAutocomplete('instance');
        this.$input = this.element.find('.' + TEXTEDITOR_INPUT_CLASS);
        this.popup = this.instance._popup;
        this.keyboard = keyboardMock(this.$input);
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        fx.off = false;

        this.clock.restore();
    }
}, () => {
    QUnit.test('popup init', function(assert) {
        assert.ok(this.popup.$wrapper().hasClass('dx-autocomplete-popup-wrapper'), 'popup wrapper class set');

        this.instance.option('value', 'i');
        assert.equal($('.dx-viewport ' + '.' + LIST_CLASS).length, 1, 'Element has ' + LIST_CLASS + ' class');
    });

    QUnit.test('dataSource init', function(assert) {
        const element = $('#autocomplete2').dxAutocomplete({
            value: 'anotherText',
            dataSource: ['qwerty', 'item 2', 'item 3']
        });

        const instance = element.dxAutocomplete('instance');

        assert.equal(instance._dataSource.items()[0], 'qwerty', 'autocomplete-s dataSource initialization');
    });

    QUnit.test('reset should set value to initial', function(assert) {
        const element = $('#autocomplete2').dxAutocomplete({
            value: 'initValue',
        });

        const instance = element.dxAutocomplete('instance');
        instance.option('value', 'newValue');

        instance.reset();

        assert.strictEqual(instance.option('value'), 'initValue');
    });

    QUnit.test('reset with parameter should set value correctly', function(assert) {
        const element = $('#autocomplete2').dxAutocomplete({
            value: 'initValue',
        });

        const instance = element.dxAutocomplete('instance');

        instance.reset('newValue');

        assert.strictEqual(instance.option('value'), 'newValue');
    });

    QUnit.test('reset should set isDirty to false', function(assert) {
        const element = $('#autocomplete2').dxAutocomplete({
            value: 'initValue',
        });

        const instance = element.dxAutocomplete('instance');
        instance.option('value', 'newValue');

        instance.reset('newValue');

        assert.strictEqual(instance.option('isDirty'), false);
    });

    QUnit.test('maxItemCount should override datasource pageSize on init', function(assert) {
        const element = $('#autocomplete2').dxAutocomplete({
            dataSource: ['1', '2', '3'],
            maxItemCount: 1,
            minSearchLength: 0
        });

        const instance = element.dxAutocomplete('instance');

        instance.open();
        const items = instance._popup.$content().find('.dx-list-item');

        assert.strictEqual(items.length, 1, 'list items count is correct');
    });

    QUnit.test('Resize by option', function(assert) {
        const setUpWidth = 300;
        const setUpHeight = 50;

        const $autocomplete = $('#autocomplete').dxAutocomplete({
            value: 'anotherText',
            dataSource: ['qwerty', 'item 2', 'item 3'],
            placeholder: 'type something',
            width: setUpWidth,
            height: setUpHeight,
            opened: true
        });

        const autocomplete = $autocomplete.dxAutocomplete('instance');
        const popup = autocomplete._popup;
        const $overlayContent = $('.dx-overlay-content');
        const initialPopupWidth = $overlayContent.outerWidth();
        const initialWidth = $autocomplete.outerWidth();
        const initialHeight = $autocomplete.outerHeight();
        const increment = 123;

        assert.strictEqual(initialWidth, setUpWidth, 'Width was set up successfully');
        assert.strictEqual(initialHeight, setUpHeight, 'Height was set up successfully');
        assert.strictEqual(typeof popup.option('width'), 'function', 'Popup was set up successfully');
        assert.strictEqual(initialPopupWidth, initialWidth, 'overlay content has correct width');

        autocomplete.option('height', initialHeight + increment);
        autocomplete.option('width', initialWidth + increment);

        const dHeight = $autocomplete.height() - initialHeight;
        const dWidth = $autocomplete.width() - initialWidth;
        const dPopupWidth = $overlayContent.width() - initialPopupWidth;

        assert.notEqual(dHeight, 0, 'Height could be changed');
        assert.notEqual(dWidth, 0, 'Width could be changed');
        assert.equal(dWidth, dPopupWidth, 'Element and popup change width accordingly');
    });

    QUnit.test('check textbox sizes', function(assert) {
        const element = $('#autocomplete2').dxAutocomplete({
            value: 'anotherText',
            dataSource: ['qwerty', 'item 2', 'item 3'],
            placeholder: 'type something',
            width: 100,
            height: 100
        });

        const instance = element.dxAutocomplete('instance');

        assert.equal(element.outerHeight(), instance.option('height'), 'textbox height is right');

        instance.option('height', 120);

        assert.equal(element.outerHeight(), instance.option('height'), 'textbox height is right');
    });

    QUnit.test('dataSource support', function(assert) {
        const newData = ['item1', 'item2'];
        this.instance.option('dataSource', newData);
        this.instance.option('minSearchLength', 0);
        assert.deepEqual(this.instance._list._dataSource.items(), ['item1', 'item2'], 'init with array');

        const newestData = new ArrayStore(['item3', 'item4']);
        this.instance.option('dataSource', newestData);
        assert.deepEqual(this.instance._list._dataSource.items(), ['item3', 'item4'], 'init with dx.data.ArrayStore');
    });

    QUnit.testInActiveWindow('list showing/hiding', function(assert) {
        const keyboard = this.keyboard;

        this.element.dxAutocomplete({
            value: '',
            dataSource: ['item 1', 'item 2', 'item 3'],
            focusStateEnabled: true
        });

        const $list = this.instance._list._$element;

        assert.equal($list.is(':hidden'), true, 'when start list is hidden');

        keyboard.type('1');
        assert.equal($list.is(':hidden'), false, 'when type, list is visible');

        keyboard.press('backspace');
        assert.equal($list.is(':hidden'), true, 'when textbox has no value, list is hidden');

        keyboard.type('1').keyDown(KEY_DOWN);
        assert.equal($list.is(':hidden'), false, 'when select list item, list is visible');

        $(this.$input).trigger('dxpointerdown');
        assert.equal($list.is(':hidden'), false, 'when click one more at input, list is visible');

        keyboard.keyDown(KEY_ENTER);
        assert.equal($list.is(':hidden'), true, 'when we select list-s item with -enter- key, list is hidden');
    });

    QUnit.test('Enter and escape key press prevent default when popup in opened', function(assert) {
        assert.expect(1);

        let prevented = 0;

        this.keyboard.type('i').keyDown(KEY_DOWN);
        this.instance.option('opened', true);

        $(this.$input).on('keydown', e => {
            if(e.isDefaultPrevented()) {
                prevented++;
            }
        });

        this.keyboard.keyDown('enter');

        this.keyboard.type('i').keyDown(KEY_DOWN);
        this.instance.option('opened', true);
        this.keyboard.keyDown('esc');

        assert.equal(prevented, 2, 'defaults prevented on enter and escape keys');
    });

    QUnit.test('Enter and escape key press does not prevent default when popup in not opened', function(assert) {
        assert.expect(1);

        let prevented = 0;

        this.instance.option('opened', false);

        this.element.on('keydown', e => {
            if(e.isDefaultPrevented()) {
                prevented++;
            }
        });

        this.keyboard.keyDown('enter');
        this.keyboard.keyDown('esc');

        assert.equal(prevented, 0, 'defaults has not prevented on enter and escape keys');
    });

    QUnit.test('item click sets value', function(assert) {
        const $list = this.instance._list._$element;

        assert.equal(this.instance.option('value'), 'text');
        $($list.find('.' + LIST_ITEM_CLASS).first()).trigger('dxclick');

        assert.equal(this.instance.option('value'), 'item 1', 'click on list item, and it-s value replace textbox value');
        assert.equal($list.is(':hidden'), true, 'when click on list-s item, list is hidden');
        assert.ok(!this.$input.is(':focus'), 'after select value we drop focus from input');
    });

    QUnit.testInActiveWindow('open/close actions', function(assert) {
        let openFired = 0;
        let closeFired = 0;

        this.instance.option({
            value: '',
            onOpened() {
                openFired++;
            },
            onClosed() {
                closeFired++;
            }
        });

        this.keyboard.type('i');
        assert.equal(openFired, 1, 'open fired once');
        assert.equal(closeFired, 0, 'close not fired yet');

        this.keyboard.press('backspace');
        assert.equal(openFired, 1, 'open fired once');
        assert.equal(closeFired, 1, 'close fired once');
    });

    QUnit.testInActiveWindow('should not open overlay if the focus has been lost (T712942)', function(assert) {
        const done = assert.async();
        let isOpenFired = false;

        this.clock.restore();

        this.instance.option({
            value: null,
            onOpened: () => isOpenFired = true,
            searchTimeout: 10
        });

        this.keyboard.type('i');
        this.instance.blur();

        window.setTimeout(() => {
            assert.notOk(isOpenFired);
            assert.notOk(this.instance._isFocused());

            this.instance.focus();
            this.keyboard.press('backspace');
            this.keyboard.type('i');
            this.instance.blur();

            window.setTimeout(() => {
                assert.notOk(isOpenFired);
                assert.notOk(this.instance._isFocused());
                done();
            }, 20);
        }, 20);
    });

    QUnit.test('onEnterKey (T107163)', function(assert) {
        let enterKeyFired = 0;

        this.instance.option({
            onEnterKey() {
                enterKeyFired++;
            }
        });

        this.keyboard.keyUp(KEY_ENTER);
        assert.equal(enterKeyFired, 1, 'onEnterKey fired once');
    });

    QUnit.testInActiveWindow('minimal search length', function(assert) {
        this.element.dxAutocomplete({
            value: '',
            dataSource: ['item 1', 'item 2', 'item 3'],
            minSearchLength: 2
        });

        const $list = this.instance._list._$element;

        this.keyboard.type('i');
        assert.equal($list.is(':hidden'), true, 'when enter first char, list is hidden');

        this.keyboard.type('t');
        assert.equal($list.is(':hidden'), false, 'when enter second char, list shows all items');
    });

    QUnit.testInActiveWindow('Typing shows the list with async data source', function(assert) {
        const instance = this.instance;
        const deferred = new $.Deferred();
        let searchValue;

        this.element.dxAutocomplete({
            value: '',
            dataSource: {
                load(options) {
                    if(options.searchValue) {
                        searchValue = options.searchValue;
                    }

                    return deferred;
                },
                byKey(key) {
                    return key;
                }
            }
        });

        this.keyboard.type('q');
        const $list = this.instance._list._$element;

        assert.equal(instance._list._dataSource, null, 'list has no dataSource');

        deferred.resolve(['qwerty']);
        assert.deepEqual(instance._list._dataSource.items(), ['qwerty'], 'dataSource is filtered after timeout');
        assert.equal($list.is(':visible'), true, 'List should be shown');

        assert.equal(searchValue, 'q');
    });

    QUnit.test('\'searchTimeout\' sets interval between list filtering', function(assert) {
        const instance = this.instance;

        this.element.dxAutocomplete({
            value: '',
            dataSource: ['qwerty', 'item 2', 'item 3'],
            searchTimeout: 500
        });

        this.keyboard.type('q');

        this.clock.tick(instance.option('searchTimeout') + 100);

        assert.deepEqual(instance._dataSource.items(), ['qwerty'], 'dataSource is filtered after timeout');
    });

    QUnit.test('\'change event\' is called once', function(assert) {
        const instance = this.instance;
        this.element.dxAutocomplete({
            value: null,
            dataSource: ['item 1', 'item 2', 'item 3'],
            valueChangeEvent: 'change'
        });

        this.keyboard.type('i');
        assert.equal(instance.option('value'), null);
        this.keyboard.type('tem2');

        $(this.$input).trigger('change');
        assert.equal(instance.option('value'), 'item2');
    });

    QUnit.testInActiveWindow('list is shown when key was pressed and there was items to show', function(assert) {
        const instance = this.instance;
        this.element.dxAutocomplete({
            value: null,
            dataSource: ['item 1', 'item 2', 'item 3'],
            valueChangeEvent: 'change'
        });

        const $list = instance._list._$element;

        this.keyboard.type('i');
        assert.ok($list.is(':visible'), 'when key press and input not empty, list is visible');
    });

    QUnit.test('interrupt searchTimeout by new timer', function(assert) {
        const instance = this.instance;
        const keyboard = this.keyboard;
        let time = 0;

        this.element.dxAutocomplete({
            value: '',
            dataSource: ['qwerty', 'item 2', 'item 3'],
            searchTimeout: 500
        });

        keyboard.type('i');
        assert.equal(instance._list._dataSource, null, 'dataSource is not filtered yet, wait timeout');

        while(time < 850) {
            if(time === 250) {
                keyboard.type('t');
            }

            if(time < 750) {
                assert.equal(instance._dataSource.items().length, 0, 'search is not performed at ' + time);
            } else {
                assert.equal(instance._dataSource.items().length, 2, 'search is performed at ' + time);
                assert.equal(instance._dataSource.items()[0], 'item 2', 'ensure search results are valid at ' + time);
                break;
            }

            this.clock.tick(50);
            time += 50;
        }
    });

    QUnit.test('dataSource should load new items only when searchTimeout is up (T880996)', function(assert) {
        const keyboard = this.keyboard;
        const data = [{
            ID: 1,
            Name: 'Item 11'
        }, {
            ID: 2,
            Name: 'Item 12'
        }, {
            ID: 3,
            Name: 'Item 22'
        }];
        const loadMock = sinon.stub().returns(data);

        this.element.dxAutocomplete({
            dataSource: {
                load: loadMock
            },
            searchTimeout: 500,
            valueExpr: 'Name'
        });

        assert.strictEqual(loadMock.callCount, 1, 'dataSource load is called on init');

        keyboard
            .type('Item')
            .change();


        this.clock.tick(499);
        assert.strictEqual(loadMock.callCount, 1, 'dataSource load is not called after typing if timeout is not up');

        this.clock.tick(1);
        assert.strictEqual(loadMock.callCount, 2, 'dataSource is filtered when timeout is up');
    });

    QUnit.test('arrow_down/arrow_up/enter provide item navigation and selection', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        const instance = this.instance;
        const keyboard = this.keyboard;
        let $selectedItem;

        this.element.dxAutocomplete({
            dataSource: ['item 1', 'item 2', 'item 3'],
            value: '',
            focusStateEnabled: true
        });

        let $lastScrolledItem = $();
        instance._list.scrollToItem = $item => {
            $lastScrolledItem = $($item);
        };
        this.$input.focusin();
        keyboard.keyDown(KEY_ENTER);
        assert.equal(instance.option('value'), '', 'when we press enter and list is hidden, input value don\'t change');

        keyboard.keyDown(KEY_UP);
        const $list = instance._list._$element;
        assert.equal($list.is(':hidden'), true, 'when press \'key_ap\' and list is hidden, list stay hidden');

        keyboard.type('i');
        assert.equal($list.is(':hidden'), false, 'when enter first char, list is visible');

        keyboard.keyDown(KEY_DOWN);
        assert.equal($list.is(':hidden'), false, 'when press down arrow and input not empty, list is visible');

        keyboard.keyDown(KEY_ENTER);
        assert.equal(instance.option('value'), 'item 1', 'when we will press enter key, list value should be replace item value');

        this.$input.focusin();

        keyboard
            .caret(6)
            .press('backspace')
            .press('backspace');

        this.$input.focusin();

        keyboard
            .keyDown(KEY_DOWN)
            .keyDown(KEY_DOWN)
            .keyDown(KEY_DOWN)
            .keyDown(KEY_DOWN)
            .keyDown(KEY_DOWN)
            .keyDown(KEY_DOWN);

        $selectedItem = $list.find(FOCUSED_STATE_SELECTOR);
        assert.equal(isRenderer(instance._list.option('focusedElement')), !!config().useJQuery, 'focusedElement is correct');
        assert.equal($selectedItem.text(), 'item 3', 'when we 6 times press \'key_down\', we select \'item 3\'');
        assert.equal($lastScrolledItem.text(), 'item 3', 'when we 6 times press \'key_down\', we scroll to \'item 3\'');

        keyboard
            .keyDown(KEY_UP)
            .keyDown(KEY_UP)
            .keyDown(KEY_UP);

        $selectedItem = $list.find(FOCUSED_STATE_SELECTOR);
        assert.equal(isRenderer(instance._list.option('focusedElement')), !!config().useJQuery, 'focusedElement is correct');
        assert.equal($selectedItem.text(), 'item 3', 'when we 2 times press \'key_up\', we select \'item 3\'');
        assert.equal($lastScrolledItem.text(), 'item 3', 'when we 2 times press \'key_up\', we scroll to \'item 3\'');

        keyboard.keyDown(KEY_UP);
        $selectedItem = $list.find(FOCUSED_STATE_SELECTOR);
        assert.equal($selectedItem.text(), 'item 2', 'when we press \'key_up\', we select \'item 2\'');
    });

    QUnit.test('down arrow should move focus through the groups', function(assert) {
        const $element = $('#widget').dxAutocomplete({
            searchExpr: 'text',
            value: null,
            searchTimeout: 0,
            valueExpr: 'text',
            dataSource: [{
                key: 'Group 1',
                items: [
                    { 'Id': 1, 'text': 'Item 1' }
                ]
            }, {
                key: 'Group 2',
                items: [
                    { 'Id': 3, 'text': 'Item 2' },
                ]
            }],
            grouped: true,
            focusStateEnabled: true
        });

        const instance = $element.dxAutocomplete('instance');
        const keyboard = keyboardMock($element.find('.' + TEXTEDITOR_INPUT_CLASS));

        keyboard
            .type('i')
            .keyDown(KEY_DOWN)
            .keyDown(KEY_DOWN)
            .keyDown(KEY_TAB);

        assert.equal(instance.option('value'), 'Item 2', 'value is correct');
    });

    QUnit.testInActiveWindow('key_tab for autocomplete current value', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        const instance = this.instance;
        const keyboard = this.keyboard;

        instance.option({
            value: '',
            dataSource: ['item 1', 'item 2', 'item 3']
        });

        keyboard
            .type('i')
            .keyDown(KEY_DOWN)
            .keyDown(KEY_TAB);

        assert.equal(instance.option('value'), 'item 1', 'when press \'tab\', replace input value with top list item');
    });

    QUnit.test('key_up/key_down - prevent default', function(assert) {
        assert.expect(2);

        const instance = this.instance;
        const keyboard = this.keyboard;

        instance.option({
            dataSource: ['i1', 'i2', 'i3'],
            value: ''
        });
        keyboard.type('i');

        $(this.$input).on('keydown', e => {
            assert.ok(e.isDefaultPrevented());
        });

        keyboard
            .keyDown(KEY_DOWN)
            .keyDown(KEY_UP);
    });

    [
        { key: KEY_DOWN, ctrlKey: true },
        { key: KEY_UP, ctrlKey: true },
        { key: KEY_DOWN, metaKey: true },
        { key: KEY_UP, metaKey: true }
    ].forEach((keyDownConfig) => {
        const commandKey = keyDownConfig.ctrlKey ? 'ctrl' : 'command';
        QUnit.test(`default behavior of ${keyDownConfig.key} arrow key with ${commandKey} key should not be prevented`, function(assert) {
            this.keyboard.keyDown(keyDownConfig.key, keyDownConfig);

            assert.notOk(this.keyboard.event.isDefaultPrevented(), 'event is not prevented');
            assert.notOk(this.keyboard.event.isPropagationStopped(), 'propogation is not stopped');
        });
    });

    QUnit.test('popup should be opened after press alt + arrow down', function(assert) {
        const keyboard = this.keyboard;
        const keyDownConfig = { key: KEY_DOWN, altKey: true };

        keyboard.keyDown(keyDownConfig.key, keyDownConfig);

        assert.strictEqual(this.instance.option('opened'), true);
    });

    QUnit.test('popup should be closed after press alt + arrow up', function(assert) {
        const keyboard = this.keyboard;
        const keyDownConfig = { key: KEY_DOWN, altKey: true };
        const keyUpConfig = { key: KEY_UP, altKey: true };

        keyboard.keyDown(keyDownConfig.key, keyDownConfig);
        keyboard.keyDown(keyUpConfig.key, keyUpConfig);

        assert.strictEqual(this.instance.option('opened'), false);
    });

    QUnit.test('should fire open/close events after open/close popup by keyboard', function(assert) {
        assert.expect(2);

        this.instance.option({
            onOpened() {
                assert.ok(true, 'event on open was fired');
            },
            onClosed() {
                assert.ok(true, 'event on closed was fired');
            }
        });

        const keyboard = this.keyboard;
        const keyDownConfig = { key: KEY_DOWN, altKey: true };
        const keyUpConfig = { key: KEY_UP, altKey: true };

        keyboard.keyDown(keyDownConfig.key, keyDownConfig);
        keyboard.keyDown(keyUpConfig.key, keyUpConfig);
    });

    QUnit.testInActiveWindow('enter - prevent default', function(assert) {
        assert.expect(1);

        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        const instance = this.instance;
        const keyboard = this.keyboard;

        instance.option({
            dataSource: ['i1', 'i2', 'i3'],
            value: ''
        });
        keyboard.type('i');

        keyboard.keyDown(KEY_DOWN);

        $(this.$input).on('keydown', e => {
            assert.ok(e.isDefaultPrevented());
        });

        keyboard.keyDown(KEY_ENTER);
    });

    QUnit.test('try to autocomplete current value when type missing searchValue', function(assert) {
        const keyboard = this.keyboard;

        this.element.dxAutocomplete({
            value: '',
            dataSource: ['item 1', 'item 2', 'item 3']
        });

        keyboard
            .type('l')
            .keyDown(KEY_TAB);

        assert.equal(this.instance.option('value'), 'l', 'when press \'tab\' and list hidden, input value still unchanged');
    });

    QUnit.testInActiveWindow('esc_key close list', function(assert) {
        const $list = this.instance._list._$element;

        this.instance.option('value', '');
        this.keyboard.type('i');
        assert.equal($list.is(':hidden'), false, 'when type value to input, list is visible');

        this.keyboard.keyDown(KEY_ESC);
        assert.equal($list.is(':hidden'), true, 'when press -esc- key, we hide list');
    });

    QUnit.test('filter with non-default searchMode', function(assert) {
        const instance = this.instance;
        const keyboard = this.keyboard;

        this.element.dxAutocomplete({
            value: '',
            dataSource: ['item 1', 'thing', 'item 3'],
            searchMode: 'startswith'
        });

        keyboard.type('t');
        assert.deepEqual(instance._dataSource.items(), ['thing'], 'element that starts with \'t\' letter was found');
    });

    QUnit.test('search mode incorrect name raises exception', function(assert) {
        assert.throws(() => {
            $('#autocomplete2').dxAutocomplete({
                value: '',
                dataSource: ['item 1', 'thing', 'item 3'],
                searchMode: 'incorrectFilterOperatorName'
            });
        });

        assert.throws(() => {
            const element = $('#autocomplete2').dxAutocomplete({
                value: '',
                dataSource: ['item 1', 'thing', 'item 3'],
                searchMode: 'startWith'
            });

            const instance = element.dxAutocomplete('instance');

            instance.option('searchMode', 'anotherIncorrectFilterOperatorName');
        });
    });

    QUnit.testInActiveWindow('using custom item template', function(assert) {
        const element = $('#autocompleteTemplate').dxAutocomplete({
            value: '',
            dataSource: ['item 1', 'item 2', 'item 3'],
            itemTemplate: 'item',
            searchTimeout: 0,
            focusStateEnabled: true
        });
        const instance = element.dxAutocomplete('instance');
        const $input = element.find('.' + TEXTEDITOR_INPUT_CLASS);
        const keyboard = keyboardMock($input);
        const autocompleteItemTemplate = instance._getTemplateByOption('itemTemplate');

        assert.ok(!!autocompleteItemTemplate, 'autocomplete initialize template');

        const listItemTemplate = instance._list._getTemplateByOption('itemTemplate');
        assert.strictEqual(listItemTemplate, autocompleteItemTemplate, 'list initialize template');

        keyboard
            .type('i');

        $(instance._list.$element().find('.dx-list-item').first()).trigger('dxclick');

        assert.equal(instance.option('value'), 'item 1', 'send correct value to input when using custom template');
    });

    QUnit.test('itemTemplate support', function(assert) {
        const instance = $('#autocomplete2').dxAutocomplete({
            dataSource: ['0', '1', '2'],
            itemTemplate(item) {
                return 'item' + item;
            },
            minSearchLength: 0
        }).dxAutocomplete('instance');
        const items = instance._popup.$content().find('.dx-list-item');
        assert.equal(items.length, 3);
        assert.equal(items.text(), 'item0item1item2');
    });

    QUnit.test('valueExpr option', function(assert) {
        const element = $('#autocomplete2').dxAutocomplete({
            value: '',
            searchTimeout: 0,
            dataSource: [
                { item: 'item 1', description: 'aq', caption: 'qa' },
                { item: 'item 2', description: 'sw', caption: 'ws' },
                { item: 'item 3', description: 'de', caption: 'ed' }
            ],
            valueExpr: 'item'
        });

        const instance = element.dxAutocomplete('instance');

        const keyboard = keyboardMock(instance._input());

        let items = instance._popup.$content().find('.dx-list-item');
        assert.equal(items.length, 0, 'no items while value is empty');

        instance.option('value', '');
        keyboard.type('i');
        items = instance._popup.$content().find('.dx-list-item');
        assert.equal(items.eq(0).text(), 'item 1');

        instance.option('valueExpr', 'caption');
        instance.option('value', '');
        keyboard.type('q');

        items = instance._popup.$content().find('.dx-list-item');
        assert.equal(items.eq(0).text(), 'qa');
    });

    QUnit.testInActiveWindow('using multifield datasource', function(assert) {
        const element = $('#autocomplete2').dxAutocomplete({
            value: '',
            dataSource: [
                { item: 'item 1', description: 'aq', caption: 'qa' },
                { item: 'item 2', description: 'sw', caption: 'ws' },
                { item: 'item 3', description: 'de', caption: 'ed' }
            ],
            valueExpr: 'item',
            searchTimeout: 0,
            focusStateEnabled: true
        });

        const instance = element.dxAutocomplete('instance');
        const $input = element.find('.' + TEXTEDITOR_INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard
            .type('i');

        $(instance._list.$element().find('.dx-list-item').first()).trigger('dxclick');

        assert.equal(instance.option('value'), 'item 1', 'send correct value to input when using multifield datasource');

        instance.option('value', '');
        instance.option('valueExpr', 'caption');

        keyboard
            .type('e');

        $(instance._list.$element().find('.dx-list-item').first()).trigger('dxclick');

        assert.equal(instance.option('value'), 'ed', 'send correct value to input when change \'valueExpr\' option');
    });

    QUnit.testInActiveWindow('using multifield datasource with template', function(assert) {
        const element = $('#multifieldDS').dxAutocomplete({
            itemTemplate: 'item',
            value: '',
            dataSource: [
                { item: 'item 1', description: 'aq' },
                { item: 'item 2', description: 'sw' },
                { item: 'item 3', description: 'de' }
            ],
            valueExpr: 'item',
            searchTimeout: 0,
            focusStateEnabled: true
        });

        const instance = element.dxAutocomplete('instance');
        const $input = element.find('.' + TEXTEDITOR_INPUT_CLASS);
        const keyboard = keyboardMock($input);
        const autocompleteItemTemplate = instance._getTemplateByOption('itemTemplate');

        assert.ok(!!autocompleteItemTemplate, 'autocomplete initialize template');

        const listItemTemplate = instance._list._getTemplateByOption('itemTemplate');
        assert.equal(listItemTemplate, autocompleteItemTemplate, 'list initialize template');

        keyboard
            .type('i');

        $(instance._list.$element().find('.dx-list-item').first()).trigger('dxclick');

        assert.equal(instance.option('value'), 'item 1', 'send correct value to input when using multifield datasource');
    });

    QUnit.test('Manual datasource - search in datasource', function(assert) {
        const keyboard = this.keyboard;
        let searchedString = null;

        this.element.dxAutocomplete({
            value: '',
            dataSource: {
                load(loadOptions) {
                    searchedString = loadOptions.searchValue;
                    return ['item 1', 'item 2', 'item 3'];
                },
                byKey(key) {
                    return key;
                }
            },
            filterOperator: 'startswith'
        });

        keyboard.type('t');

        assert.equal(searchedString, 't', 'Search string should be passed to user-defined load method');
    });

    QUnit.test('Changing the \'value\' option must invoke the \'onValueChanged\' action', function(assert) {
        const autocomplete = $('#autocomplete2').dxAutocomplete({
            onValueChanged() {
                assert.ok(true);
            }
        }).dxAutocomplete('instance');
        autocomplete.option('value', true);
    });

    QUnit.test('dxAutoComplete should not be opened when change the value from code (T141485)', function(assert) {
        this.element.dxAutocomplete({
            dataSource: ['item1', 'item2', 'item3'],
            value: ''
        });

        this.instance.option('value', 'i');

        assert.equal(this.instance._popup.option('visible'), false, 'drop down should not be shown');
    });

    QUnit.testInActiveWindow('maxItemCount option test', function(assert) {
        assert.expect(2);

        const $autocomplete = $('#autocomplete2').dxAutocomplete({
            dataSource: ['item1', 'item2', 'item3', 'item4', 'item5'],
            value: '',
            searchTimeout: 0,
            maxItemCount: 2
        });

        const autocompleteInstance = $autocomplete.dxAutocomplete('instance');
        const keyboard = keyboardMock($autocomplete.find('.dx-texteditor-input'));

        keyboard.type('i');
        this.clock.tick(1000);
        let listItemsCount = $('.dx-overlay-content:visible .dx-list-item').length;

        assert.equal(listItemsCount, autocompleteInstance.option('maxItemCount'), 'drop down list items count is not equal to maxItemCount');

        autocompleteInstance.option('maxItemCount', 1);
        this.clock.tick(1000);
        listItemsCount = $('.dx-overlay-content:visible .dx-list-item').length;
        assert.equal(listItemsCount, autocompleteInstance.option('maxItemCount'), 'drop down list items count is not equal to maxItemCount');
    });

    QUnit.test('there should be no warnings after widget value is cleared (T386512)', function(assert) {
        if(!window.console || !window.console.warn) {
            assert.ok(true, 'the console object is not supported');
            return;
        }

        const item = 'aa';

        const $autocomplete = $('#autocomplete2').dxAutocomplete({
            items: [item],
            value: item
        });

        const $input = $autocomplete.find('.' + TEXTEDITOR_INPUT_CLASS);
        const keyboard = keyboardMock($input);

        const spy = sinon.spy(console, 'warn');

        try {
            keyboard.press('end');

            for(let i = 0, n = item.length; i < n; i++) {
                keyboard.press('backspace');
            }

            assert.equal($input.val(), '', 'value is cleared');
            assert.notOk(spy.called, 'warnings are not printed');
        } finally {
            spy.restore();
        }
    });
});

QUnit.module('ContentReady event', {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.test('ContentReady should be raised after items loading', function(assert) {
        assert.expect(5);

        const longArray = [];
        let arrayLength = 100;

        while(arrayLength--) {
            longArray.push(arrayLength);
        }

        const instance = $('#autocomplete').dxAutocomplete({
            dataSource: {
                store: longArray
            },
            deferRendering: false,
            searchTimeout: 0,
            focusStateEnabled: true
        }).dxAutocomplete('instance');

        assert.equal(instance._list._dataSource, null, 'no dataSource before changing value');

        instance.on('contentReady', (e) => {
            assert.ok(true, 'ContentReady is raised');
            assert.ok(e.component, 'Component info should be passed');
            assert.ok(e.element, 'Element info should be passed');
        });

        keyboardMock(instance._input()).type('0');

        assert.equal(instance._list.$element().find('.dx-list-item').length, 10);
    });

    QUnit.test('ContentReady should be raised after items filtering', function(assert) {
        assert.expect(4);

        const instance = $('#autocomplete').dxAutocomplete({
            dataSource: ['1', '2', '3'],
            deferRendering: false,
            searchTimeout: 0,
            focusStateEnabled: true
        }).dxAutocomplete('instance');

        instance.on('contentReady', (e) => {
            assert.ok(true, 'ContentReady is raised');
            assert.ok(e.component, 'Component info should be passed');
            assert.ok(e.element, 'Element info should be passed');
        });

        keyboardMock(instance._input()).type('1');

        assert.equal(instance._list.$element().find('.dx-list-item').length, 1);
    });
});

QUnit.module('Overlay integration', {
    beforeEach: function() {
        executeAsyncMock.setup();
        fx.off = true;
        this.clock = sinon.useFakeTimers();
        this.element = $('#autocomplete').dxAutocomplete({
            value: 'text',
            dataSource: ['item 1', 'item 2', 'item 3', 'item 4', 'item 5', 'item 6'],
            searchTimeout: 0,
            deferRendering: false
        });
        this.instance = this.element.dxAutocomplete('instance');
        this.$input = this.element.find('.' + TEXTEDITOR_INPUT_CLASS);
        this.popup = this.instance._popup.$element();
        this.keyboard = keyboardMock(this.$input);
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.testInActiveWindow('list animation jumps to end', function(assert) {
        const keyboard = this.keyboard;

        this.element.dxAutocomplete({
            value: '',
            dataSource: ['item 1', 'item 2', 'item 3']
        });

        const $overlayContent = this.popup.find('.dx-overlay-content').eq(0);
        assert.equal($overlayContent.is(':hidden'), true, 'when start list is hidden');
        keyboard.type('i');
        assert.equal($overlayContent.is(':hidden'), false, 'when type, list is visible');
        keyboard.type('t');
        assert.equal($overlayContent.css('opacity'), 1, 'when type, opacity is 1');
    });

    QUnit.testInActiveWindow('popup height calculated correctly', function(assert) {
        this.element.dxAutocomplete({
            value: '',
            dataSource: ['item 10', 'item 20', 'item 30']
        });
        const $popup = this.popup;
        const popup = $popup.dxPopup('instance');

        const keyboard = this.keyboard;
        keyboard.type('item ');

        const popupHeightWithAllItems = getHeight(popup.$content());

        keyboard.type('1');
        const popupHeightWithSingleItem = getHeight(popup.$content());
        assert.ok(popupHeightWithSingleItem < popupHeightWithAllItems, 'height recalculated');
    });

    QUnit.test('popup height is refreshed on window resize callback (B254555)', function(assert) {
        fx.off = true;

        const $popup = this.popup;
        const popup = $popup.dxPopup('instance');

        popup.show();

        const initialHeight = getHeight(popup.$content());
        const testHeight = initialHeight + 100;

        popup.option('height', testHeight);

        resizeCallbacks.fire();
        assert.notEqual(testHeight, initialHeight, 'initial height is restored after window resize callback');
    });

    QUnit.test('popup showing calls list update (B254555)', function(assert) {
        fx.off = true;

        const $popup = this.popup;
        const popup = $popup.dxPopup('instance');

        const list = $popup.find('.dx-list').dxList('instance');
        const updateDimensionsSpy = sinon.spy(list, 'updateDimensions');

        popup.show();
        this.clock.tick(10);
        assert.equal(updateDimensionsSpy.callCount, 3, 'initial render + 2x dimension changed handler');
    });

    QUnit.test('dxAutocomplete - popup list has vertical scroll when items count is small and scroll is not needed(T105434)', function(assert) {
        fx.off = true;

        const $popup = this.popup;
        const popup = $popup.dxPopup('instance');

        const $overlayContent = $popup.find('.dx-overlay-content').eq(0).css('border', '10px solid black');
        const $popupContent = $overlayContent.find('.dx-popup-content').eq(0);
        const $scrollableContainer = $popup.find('.dx-scrollable-container');

        popup.show();
        this.clock.tick(10);

        assert.equal(getOuterHeight($scrollableContainer), getHeight($popupContent));
    });

    QUnit.testInActiveWindow('popup should not reopened on Enter key press', function(assert) {
        assert.expect(1);

        fx.off = true;
        this.instance.option('value', '');
        this.keyboard.type('i');
        this.clock.tick(10);
        this.popup.dxPopup('option', 'onHidden', () => {
            assert.ok(true, 'popup is hidden');
        });
        this.popup.dxPopup('option', 'onShown', () => {
            assert.ok(false, 'popup is shown again');
        });

        this.keyboard.press('enter');
        $(this.$input).trigger('change');
    });

    QUnit.test('popup should be hidden after clear', function(assert) {
        this.instance.option('value', '');

        this.keyboard.type('i');
        this.instance.clear();

        assert.notOk(this.instance.option('opened'), 'popup is hidden');
    });

    QUnit.test('popup should be hidden after reset', function(assert) {
        this.instance.option('value', '');

        this.keyboard.type('i');
        this.instance.reset();

        assert.notOk(this.instance.option('opened'), 'popup is hidden');
    });
});

QUnit.module('regressions', {
    beforeEach: function() {
        fx.off = true;
        executeAsyncMock.setup();
        Autocomplete.defaultOptions({ options: { deferRendering: false } });
        this.clock = sinon.useFakeTimers();

        this.element = $('#autocomplete').dxAutocomplete({
            value: '',
            dataSource: ['item 1', 'item 2', 'item 3'],
            searchTimeout: 0,
            focusStateEnabled: true
        });
        this.instance = this.element.dxAutocomplete('instance');
        this.$input = this.element.find('.' + TEXTEDITOR_INPUT_CLASS);
        this.keyboard = keyboardMock(this.$input);
        this.inputValue = () => {
            return this.$input.val();
        };
        this.widgetValue = () => {
            return this.instance.option('value');
        };
        this.popup = this.instance._popup;
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        fx.off = false;

        this.clock.restore();
    }
}, () => {
    QUnit.test('update input value on click', function(assert) {
        const $list = this.instance._list._$element;

        this.keyboard.type('i');
        const $item = $list.find('.dx-list-item').first();
        const mouse = pointerMock($item);
        mouse.click();

        assert.equal(this.inputValue(), 'item 1', 'input value');
        assert.equal(this.widgetValue(), 'item 1', 'widget value');
    });

    QUnit.testInActiveWindow('update input value on press complete key', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        this.keyboard
            .type('i')
            .keyDown(KEY_DOWN)
            .keyDown(KEY_TAB);

        assert.equal(this.inputValue(), 'item 1', 'input value');
        assert.equal(this.widgetValue(), 'item 1', 'widget value');
    });

    QUnit.testInActiveWindow('update input value on press enter key', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        this.keyboard
            .type('i')
            .keyDown(KEY_DOWN)
            .keyDown(KEY_ENTER);

        assert.equal(this.inputValue(), 'item 1', 'input value');
        assert.equal(this.widgetValue(), 'item 1', 'widget value');
    });

    QUnit.testInActiveWindow('when updating value option, input.val() do not updating twice', function(assert) {
        this.keyboard.type('i');

        assert.equal(this.inputValue(), 'i', 'input value');
        assert.equal(this.widgetValue(), 'i', 'input value');

        $(this.instance._list.$element().find('.dx-list-item').first()).trigger('dxclick');

        this.keyboard.caret(6);

        assert.equal(this.inputValue(), 'item 1', 'input value');
        assert.equal(this.widgetValue(), 'item 1', 'input value');

        this.keyboard
            .press('backspace')
            .press('backspace')
            .press('backspace');

        assert.equal(this.inputValue(), 'ite', 'input value');
        assert.equal(this.widgetValue(), 'ite', 'widget value');
    });

    QUnit.test('big dataSource loading', function(assert) {
        const instance = this.instance;
        const longArray = [];
        let arrayLength = 100;

        while(arrayLength) {
            longArray.push(arrayLength);
            arrayLength--;
        }

        this.element.dxAutocomplete({
            dataSource: {
                store: longArray
            }
        });

        assert.equal(instance._list._dataSource, null, 'no dataSource before changing value');

        keyboardMock(this.instance._input()).type('0');

        assert.equal(instance._list.$element().find('.dx-list-item').length, 10);
    });

    QUnit.test('B233605 autocomplete shows on short time', function(assert) {
        executeAsyncMock.teardown();

        const instance = this.instance;
        const popup = instance._popup;
        let showCounter = 0;

        popup.option('shown', () => {
            showCounter++;
        });

        instance.option('value', 'item 1');
        instance.option('value', 'item 1a');

        this.clock.tick(500);

        assert.equal(showCounter, 0, 'autocomplete menu should not be shown');
    });

    QUnit.testInActiveWindow('B233600 dxAutocomplete - Sometimes autocomplete shows redundant items', function(assert) {
        assert.expect(5);

        executeAsyncMock.teardown();

        const instance = this.instance;
        const popup = instance._popup;
        let countShown = 0;
        const complete = $.Deferred();
        const $input = this.$input;
        const keyboard = this.keyboard;

        popup.option('onShown', () => {
            if(countShown === 0) {
                assert.ok(popup.option('visible'), 'autocomplete shown');
                $input.val('');
                keyboard.type('a');
            } else if(countShown === 1) {
                assert.equal(instance._dataSource.items()[0], 'Afanasiy', 'check for correct autocomplete suggestion');
                $input.val('');
                keyboard.type('a');
            } else {
                assert.equal(instance._dataSource.items()[0], 'Afanasiy', 'check for correct autocomplete suggestion after delay');
                popup.option('onHidden', null);
                popup.option('onShown', null);
                complete.resolve();
            }
            countShown++;
        });

        popup.option('onHidden', () => {
            assert.ok(!popup.option('visible'), 'autocomplete hide');
            $input.val('');
            keyboard.type('as');
        });

        instance.option({
            searchTimeout: 100,
            minSearchLength: 2,
            dataSource: ['Ivan', 'Svyatoslav', 'Alexander', 'Nikolay', 'Dmitry', 'Afanasiy']
        });
        keyboard.type('as');
        this.clock.tick(1000);
    });

    QUnit.test('B233813 dxAutocomplete - custom or non existing option change, cause additional autocomplete edit input instance.', function(assert) {
        executeAsyncMock.teardown();
        const instance = this.instance;
        const childrenCount = this.element.children().length;

        instance.option({
            customOption: 'customOptionValue'
        });

        const numEditItems = $('.dx-texteditor-input').length;
        assert.equal(this.element.children().length, childrenCount, 'we should have only one dx-texteditor-input in dxautocomplete instance');
        assert.equal(numEditItems, 1, 'we should have only one dx-texteditor-input in dxautocomplete instance');
    });

    QUnit.test('B234608 check offset for iOS devices', function(assert) {
        devices.current('iPad');

        const element = $('#autocomplete2').dxAutocomplete({
            value: '',
            dataSource: ['item 1', 'item 2', 'item 3']
        });

        const popup = element.dxAutocomplete('instance')._popup;
        const vOffset = popup.option('position').offset.v;
        assert.equal(vOffset, -1, 'vertical offset for iOS devices');

        devices.current(null);
    });

    QUnit.testInActiveWindow('B234649 if item not selected and pressed enter key - close popup', function(assert) {
        const keyboard = this.keyboard;

        keyboard.type('i');
        const $list = this.instance._list._$element;
        assert.equal($list.is(':hidden'), false, 'when type char, that can be found in list - show popup');

        keyboard.keyDown(KEY_ENTER);
        assert.equal($list.is(':hidden'), true, 'when press enter key and item not selected - hide popup');
    });

    QUnit.test('B238021', function(assert) {
        const $input = this.$input;

        this.keyboard
            .type('i')
            .keyDown(KEY_TAB);

        $($input).trigger('focusout');
        const $list = this.instance._list._$element;

        assert.ok($list.is(':hidden'), 'close menu after input losts focus');
    });

    QUnit.test('onValueChanged callback', function(assert) {
        let called = 0;

        this.instance.option('valueChangeEvent', 'change keyup');
        this.instance.option('onValueChanged', e => {
            assert.ok(e.value, 'value present');
            called++;
        });

        this.keyboard
            .type('123')
            .change();
        assert.equal(called, 3);

        this.instance.option('valueChangeEvent', 'keyup');
        this.keyboard
            .type('123');
        assert.equal(called, 6);
    });

    QUnit.test('onSelectionChanged event should trigger on item selection', function(assert) {
        const valueChangedStub = sinon.stub();
        const selectionChangedStub = sinon.stub();

        this.instance.option({
            onValueChanged: valueChangedStub,
            onSelectionChanged: selectionChangedStub
        });

        this.keyboard
            .type('2')
            .press('arrowDown')
            .press('enter');

        assert.strictEqual(valueChangedStub.callCount, 2);
        assert.strictEqual(valueChangedStub.firstCall.args[0].value, '2');
        assert.strictEqual(valueChangedStub.secondCall.args[0].value, 'item 2');
        assert.strictEqual(selectionChangedStub.callCount, 1);
        assert.strictEqual(selectionChangedStub.lastCall.args[0].selectedItem, 'item 2');


        this.keyboard
            .caret(6)
            .press('backspace');

        assert.strictEqual(valueChangedStub.callCount, 3);
        assert.strictEqual(valueChangedStub.lastCall.args[0].value, 'item ');
        assert.strictEqual(selectionChangedStub.callCount, 2);
        assert.strictEqual(selectionChangedStub.lastCall.args[0].selectedItem, null);
    });


    QUnit.module('onSelectionChanged', {
        beforeEach: function() {
            this.selectionChangedStub = sinon.stub();
            this.timeToWait = 300;
            this.instance.option({
                searchTimeout: this.timeToWait,
                onSelectionChanged: this.selectionChangedStub
            });
        }
    }, () => {
        QUnit.test('onSelectionChanged event should trigger on item selection if its text is equal to input text (T991350)', function(assert) {
            this.keyboard
                .type('item 2');

            this.clock.tick(this.timeToWait + 100);
            const $listItems = $(this.instance.content()).find(`.${LIST_ITEM_CLASS}`);
            const $secondItem = $listItems.eq(0);
            $secondItem.trigger('dxclick');

            assert.strictEqual(this.selectionChangedStub.callCount, 1);
            assert.strictEqual(this.instance.option('selectedItem'), 'item 2');
        });

        QUnit.test('onSelectionChanged event should trigger on item selection by keyboard if its text is equal to input text (T991350)', function(assert) {
            this.keyboard
                .type('item 2');

            this.clock.tick(this.timeToWait + 100);

            this.keyboard
                .keyDown(KEY_DOWN)
                .keyDown(KEY_ENTER);

            assert.strictEqual(this.selectionChangedStub.callCount, 1);
            assert.strictEqual(this.instance.option('selectedItem'), 'item 2');
        });
    });

    QUnit.test('item initialization scenario', function(assert) {
        const instance = $('#autocomplete').dxAutocomplete({
            items: ['a', 'b', 'c']
        }).dxAutocomplete('instance');

        const items = instance._popup.$content().find('.dx-list-item');
        assert.equal(items.length, 3);
        assert.equal(items.text(), 'abc');
    });

    QUnit.test('item option change scenario', function(assert) {
        const instance = $('#autocomplete').dxAutocomplete({
            items: ['a', 'b']
        }).dxAutocomplete('instance');

        instance.option('items', ['a', 'b', 'c']);
        const items = instance._popup.$content().find('.dx-list-item');

        assert.equal(items.length, 3);
        assert.equal(items.text(), 'abc');
    });

    QUnit.test('B251208 - dxAutocomplete: cannot select text by keyboard', function(assert) {
        $('#autocomplete').dxAutocomplete().dxAutocomplete('instance');

        this.$input.val('xxx');
        this.$input.prop('selectionStart', 0);
        this.$input.prop('selectionEnd', 2);

        $(this.$input).trigger('keyup');

        assert.equal(this.$input.prop('selectionStart'), 0);
        assert.equal(this.$input.prop('selectionEnd'), 2);
    });
});

QUnit.module('widget sizing render', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    QUnit.test('default', function(assert) {
        const $element = $('#widget').dxAutocomplete();

        assert.ok($element.outerWidth() > 0, 'outer width of the element must be more than zero');
    });

    QUnit.test('constructor', function(assert) {
        const $element = $('#widget').dxAutocomplete({ width: 400 });
        const instance = $element.dxAutocomplete('instance');

        assert.strictEqual(instance.option('width'), 400);
        assert.strictEqual($element.outerWidth(), 400, 'outer width of the element must be equal to custom width');
    });

    QUnit.test('root with custom width', function(assert) {
        const $element = $('#widthRootStyle').dxAutocomplete();
        assert.strictEqual($element.outerWidth(), 300, 'outer width of the element must be equal to custom width');
    });

    QUnit.test('change width', function(assert) {
        const $element = $('#widget').dxAutocomplete();
        const instance = $element.dxAutocomplete('instance');
        const customWidth = 400;

        instance.option('width', customWidth);

        assert.strictEqual($element.outerWidth(), customWidth, 'outer width of the element must be equal to custom width');
    });

    QUnit.testInActiveWindow('filter is not reset', function(assert) {
        const $element = $('#widget').dxAutocomplete({
            items: ['Congo', 'Canada', 'Zimbabwe'],
            searchTimeout: 0
        });

        $element.find('.dx-popup-content').css({
            padding: '0 !important',
            border: 'none !important',
            margin: '0 !important'
        });

        const $input = $element.find('.' + TEXTEDITOR_INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard.type('C');
        this.clock.tick(10);

        $($input.val('')).trigger('keyup');
        this.clock.tick(10);

        keyboard.type('Z');
        this.clock.tick(10);

        const $overlayContent = $('.dx-overlay-content');
        assert.ok($overlayContent.height() > 0, 'overlay height is correct');
    });
});

QUnit.module('valueChanged should receive correct event', {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();

        this.valueChangedHandler = sinon.stub();
        const initialOptions = {
            items: ['11', '22'],
            searchTimeout: 0,
            onValueChanged: this.valueChangedHandler,
            valueChangeEvent: ''
        };
        this.init = (options) => {
            this.$element = $('#widget').dxAutocomplete(options);
            this.instance = this.$element.dxAutocomplete('instance');
            this.$input = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
            this.keyboard = keyboardMock(this.$input);
            this.getListItems = () => $(this.instance.content()).find(`.${LIST_ITEM_CLASS}`);
        };
        this.reinit = (options) => {
            this.instance.dispose();
            this.init($.extend({}, initialOptions, options));
        };
        this.testProgramChange = (assert) => {
            this.instance.option('value', 'new value');

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

        this.init(initialOptions);
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.test('on program change', function(assert) {
        this.testProgramChange(assert);
    });

    QUnit.test('on item select using click (T963574)', function(assert) {
        this.keyboard.type('1');

        const $listItems = this.getListItems();
        const $firstItem = $listItems.eq(0);
        $firstItem.trigger('dxclick');

        this.checkEvent(assert, 'dxclick', $firstItem);
        this.testProgramChange(assert);
    });

    QUnit.test('on item select using enter', function(assert) {
        this.keyboard
            .type('1')
            .press('down')
            .press('enter');

        const $listItems = this.getListItems();
        const $firstItem = $listItems.eq(0);

        this.checkEvent(assert, 'keydown', $firstItem, 'enter');
        this.testProgramChange(assert);
    });

    QUnit.test('on item select using tab', function(assert) {
        this.keyboard
            .type('1')
            .press('down')
            .press('tab');

        this.checkEvent(assert, 'keydown', this.$input, 'tab');
        this.testProgramChange(assert);
    });

    QUnit.test('on input', function(assert) {
        this.instance.option('valueChangeEvent', 'input');

        this.keyboard.type('a');

        this.checkEvent(assert, 'input', this.$input);
        this.testProgramChange(assert);
    });

    QUnit.test('on click on clear button', function(assert) {
        this.reinit({
            value: '11',
            showClearButton: true
        });

        const $clearButton = this.$element.find(CLEAR_BUTTON_AREA_SELECTOR);
        $clearButton.trigger('dxclick');

        this.checkEvent(assert, 'dxclick', $clearButton);
        this.testProgramChange(assert);
    });
});
