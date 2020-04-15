import $ from 'jquery';
import { noop } from 'core/utils/common';
import devices from 'core/devices';
import { Template } from 'core/templates/template';
import Guid from 'core/guid';
import { DataSource } from 'data/data_source/data_source';
import ArrayStore from 'data/array_store';
import CustomStore from 'data/custom_store';
import keyboardMock from '../../helpers/keyboardMock.js';
import browser from 'core/utils/browser';
import fx from 'animation/fx';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';
import ajaxMock from '../../helpers/ajaxMock.js';

import 'ui/drop_down_editor/ui.drop_down_list';

import 'common.css!';
import 'generic_light.css!';

QUnit.testStart(() => {
    const markup =
        '<div id="dropDownList"></div>';

    $('#qunit-fixture').html(markup);
});

const LIST_ITEM_SELECTOR = '.dx-list-item';
const STATE_FOCUSED_CLASS = 'dx-state-focused';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const POPUP_CONTENT_CLASS = 'dx-popup-content';
const LIST_CLASS = 'dx-list';

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
};

QUnit.module('focus policy', {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();

        this.$element = $('#dropDownList').dxDropDownList({
            focusStateEnabled: true,
            dataSource: ['item 1', 'item 2', 'item 3']
        });
        this.instance = this.$element.dxDropDownList('instance');
        this.$input = this.$element.find('.' + TEXTEDITOR_INPUT_CLASS);
        this.keyboard = keyboardMock(this.$input);
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    QUnit.test('focus removed from list on type some text', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        this.instance.option('opened', true);
        this.clock.tick(500);
        this.keyboard.keyDown('down');
        const $firstItem = this.instance._$list.find(LIST_ITEM_SELECTOR).eq(0);
        assert.equal(isRenderer(this.instance._list.option('focusedElement')), !!config().useJQuery, 'focusedElement is correct');
        assert.ok($firstItem.hasClass(STATE_FOCUSED_CLASS), 'first list element is focused');

        this.keyboard.type('some text');
        assert.ok(!$firstItem.hasClass(STATE_FOCUSED_CLASS), 'first list element is not focused');
    });

    QUnit.testInActiveWindow('popup should not focus when we selecting an item', function(assert) {
        this.instance.option('opened', true);

        const mouseDownStub = sinon.stub();
        const $popupContent = $(this.instance._popup.$content());

        $popupContent
            .on('mousedown', mouseDownStub)
            .trigger('mousedown')
            .trigger('mouseup');

        assert.notOk(mouseDownStub.getCall(0).args[0].isDefaultPrevented(), 'mousedown isn\'t prevented');

        if(devices.real().deviceType === 'desktop') {
            assert.ok(this.$element.hasClass(STATE_FOCUSED_CLASS), 'element save focused state after click on popup content');
        }
    });

    QUnit.test('hover and focus states for list should be initially disabled on mobile devices only', function(assert) {
        this.instance.option('opened', true);

        const list = $(`.${LIST_CLASS}`).dxList('instance');

        if(devices.real().deviceType === 'desktop') {
            assert.ok(list.option('hoverStateEnabled'), 'hover state should be enabled on desktop');
            assert.ok(list.option('focusStateEnabled'), 'focus state should be enabled on desktop');
        } else {
            assert.notOk(list.option('hoverStateEnabled'), 'hover state should be disabled on mobiles');
            assert.notOk(list.option('focusStateEnabled'), 'focus state should be disabled on mobiles');
        }
    });

    QUnit.test('changing hover and focus states for list should be enabled on desktop only', function(assert) {
        this.instance.option('opened', true);

        const list = $(`.${LIST_CLASS}`).dxList('instance');

        this.instance.option({ hoverStateEnabled: false, focusStateEnabled: false });

        if(devices.real().deviceType === 'desktop') {
            assert.notOk(list.option('hoverStateEnabled'), 'hover state should be changed to disabled on desktop');
            assert.notOk(list.option('focusStateEnabled'), 'focus state should be changed to disabled on desktop');
        } else {
            this.instance.option({ hoverStateEnabled: true, focusStateEnabled: true });

            assert.notOk(list.option('hoverStateEnabled'), 'hover state should not be changed on mobiles');
            assert.notOk(list.option('focusStateEnabled'), 'focus state should not be changed on mobiles');
        }
    });

    QUnit.test('setFocusPolicy should correctly renew subscription', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }
        const setFocusPolicySpy = sinon.spy(this.instance, '_setFocusPolicy');

        this.instance.option('onChange', noop);
        this.instance.option('onKeyUp', noop);

        this.$input.trigger('input');

        assert.equal(setFocusPolicySpy.callCount, 1, 'setFocusPollicy called once');
    });
});

QUnit.module('keyboard navigation', {
    beforeEach: function() {
        fx.off = true;

        this.$element = $('#dropDownList').dxDropDownList({
            focusStateEnabled: true,
            dataSource: ['item 1', 'item 2', 'item 3'],
            applyValueMode: 'instantly'
        });
        this.clock = sinon.useFakeTimers();
        this.instance = this.$element.dxDropDownList('instance');
        this.$input = this.$element.find('.' + TEXTEDITOR_INPUT_CLASS);
        this.popup = this.instance._popup;
        this.$list = this.instance._$list;
        this.keyboard = keyboardMock(this.$input);
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.test('focusout should not be fired on input element', function(assert) {
        const onFocusOutStub = sinon.stub();
        this.instance.option('onFocusOut', onFocusOutStub);

        this.$element.focusin();
        this.keyboard.keyDown('tab');

        assert.equal(onFocusOutStub.callCount, 0, 'onFocusOut wasn\'t fired');
    });

    QUnit.test('focusout should be prevented when list clicked', function(assert) {
        assert.expect(1);

        this.instance.open();

        const $list = $(this.instance.content()).find(`.${LIST_CLASS}`);

        $list.on('mousedown', e => {
            // note: you should not prevent pointerdown because it will prevent click on ios real devices
            // you must use preventDefault in code because it is possible to use .on('focusout', handler) instead of onFocusOut option
            assert.ok(e.isDefaultPrevented(), 'mousedown was prevented and lead to focusout prevent');
        });

        $list.trigger('mousedown');
    });

    QUnit.test('list should not have tab index to prevent its focusing when scrollbar clicked', function(assert) {
        this.instance.option({
            items: [1, 2, 3, 4, 5, 6],
            opened: true,
            value: null
        });

        const $content = $(this.instance.content());
        const $list = $content.find(`.${LIST_CLASS}`);

        assert.notOk($list.attr('tabIndex'), 'list have no tabindex');
    });

    QUnit.testInActiveWindow('popup hides on tab', function(assert) {
        this.instance.focus();
        assert.ok(this.$element.hasClass(STATE_FOCUSED_CLASS), 'element is focused');

        this.instance.open();
        this.keyboard.keyDown('tab');
        assert.equal(this.instance.option('opened'), false, 'popup is hidden');
    });

    QUnit.test('event should be a parameter for onValueChanged function after select an item via tab', function(assert) {
        const valueChangedHandler = sinon.spy();

        this.instance.option({
            opened: true,
            onValueChanged: valueChangedHandler
        });

        const $content = $(this.instance.content());
        const list = $content.find(`.${LIST_CLASS}`).dxList('instance');
        const $listItem = $content.find(LIST_ITEM_SELECTOR).eq(0);

        list.option('focusedElement', $listItem);
        this.keyboard.keyDown('tab');

        assert.ok(valueChangedHandler.getCall(0).args[0].event, 'event is defined');
    });

    QUnit.test('No item should be chosen after pressing tab', function(assert) {
        this.instance.option('opened', true);

        this.$input.focusin();
        this.keyboard.keyDown('tab');

        assert.equal(this.instance.option('value'), null, 'value was set correctly');
    });

    QUnit.test('DropDownList does not crushed after pressing pageup, pagedown keys when list doesn\'t have focused item', function(assert) {
        assert.expect(0);

        this.instance.option('opened', true);
        this.$input.focusin();

        try {
            this.keyboard.keyDown('pagedown');
            this.keyboard.keyDown('pageup');
        } catch(e) {
            assert.ok(false, 'exception was threw');
        }
    });
});

QUnit.module('displayExpr', moduleConfig, () => {
    QUnit.test('displayExpr has item in argument', function(assert) {
        const args = [];

        const dataSource = [1, 2, 3];
        const $dropDownList = $('#dropDownList').dxDropDownList({
            dataSource,
            deferRendering: false,
            value: 2,
            displayExpr(item) {
                args.push(item);
            }
        });

        $dropDownList.dxDropDownList('option', 'opened', true);
        this.clock.tick();

        assert.deepEqual(args, [2].concat(dataSource), 'displayExpr args is correct');
    });

    QUnit.test('submit value should be equal to the displayExpr in case value is object and valueExpr isn\'t an object field', function(assert) {
        const $dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: [{ text: 'test' }],
            deferRendering: false,
            value: { text: 'test' },
            displayExpr: 'text',
            useHiddenSubmitElement: true
        });
        const $submitInput = $dropDownList.find('input[type=\'hidden\']');

        assert.equal($submitInput.val(), 'test', 'the submit value is correct');
    });

    QUnit.test('submit value should be equal to the primitive value type', function(assert) {
        const $dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: ['test'],
            deferRendering: false,
            value: 'test',
            displayExpr: (item) => {
                if(item) {
                    return item + '123';
                }
            },
            useHiddenSubmitElement: true
        });
        const $submitInput = $dropDownList.find('input[type=\'hidden\']');

        assert.equal($submitInput.val(), 'test', 'the submit value is correct');
    });
});

QUnit.module('items & dataSource', moduleConfig, () => {
    QUnit.test('default value is null', function(assert) {
        const $dropDownList = $('#dropDownList').dxDropDownList();
        const instance = $dropDownList.dxDropDownList('instance');

        assert.strictEqual(instance.option('value'), null, 'value is null on default');
    });

    QUnit.test('wrapItemText option', function(assert) {
        const $dropDownList = $('#dropDownList').dxDropDownList({
            items: [1],
            deferRendering: false,
            wrapItemText: true
        });
        const instance = $dropDownList.dxDropDownList('instance');
        const $itemContainer = $(instance.content()).find('.dx-scrollview-content');

        assert.ok($itemContainer.hasClass('dx-wrap-item-text'), 'class was added');

        instance.option('wrapItemText', false);
        assert.notOk($itemContainer.hasClass('dx-wrap-item-text'), 'class was removed');
    });

    QUnit.test('widget should render with empty items', function(assert) {
        const $dropDownList = $('#dropDownList').dxDropDownList({
            items: null,
            opened: true
        });

        const instance = $dropDownList.dxDropDownList('instance');

        assert.ok(instance, 'widget was rendered');
    });

    QUnit.test('items option contains items from dataSource after load', function(assert) {
        const dataSource = [1, 2, 3];

        const $dropDownList = $('#dropDownList').dxDropDownList({
            dataSource,
            deferRendering: false
        });

        this.clock.tick();
        assert.deepEqual($dropDownList.dxDropDownList('option', 'items'), dataSource, 'displayExpr args is correct');
    });

    QUnit.test('all items', function(assert) {
        const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
        const $dropDownList = $('#dropDownList').dxDropDownList({
            items,
            opened: true
        });

        this.clock.tick();
        assert.deepEqual($dropDownList.dxDropDownList('option', 'items'), items, 'rendered all items');
    });

    QUnit.test('calcNextItem private method should work', function(assert) {
        const $dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: [1, 2, 3, 4],
            opened: true,
            value: 2
        });

        const dropDownList = $dropDownList.dxDropDownList('instance');

        assert.strictEqual(dropDownList._calcNextItem(1), 3, 'step forward');
        assert.strictEqual(dropDownList._calcNextItem(-1), 1, 'step backward');
    });

    QUnit.test('items private method should work', function(assert) {
        const $dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: [1, 2, 3, 4],
            opened: true,
            value: 2
        });

        const dropDownList = $dropDownList.dxDropDownList('instance');

        assert.deepEqual(dropDownList._items(), [1, 2, 3, 4], 'items are correct');
    });

    QUnit.test('fitIntoRange private method should work', function(assert) {
        const $dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: [1, 2, 3, 4],
            opened: true,
            value: 2
        });

        const dropDownList = $dropDownList.dxDropDownList('instance');

        assert.deepEqual(dropDownList._fitIntoRange(1, 2, 4), 4, 'smaller than min');
        assert.deepEqual(dropDownList._fitIntoRange(3, 2, 4), 3, 'in range');
        assert.deepEqual(dropDownList._fitIntoRange(5, 2, 4), 2, 'larger than max');
    });

    QUnit.test('getSelectedIndex private method should work', function(assert) {
        const $dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: [{ id: 1 }, { id: 2 }],
            opened: true,
            valueExpr: 'id',
            value: 2
        });

        const dropDownList = $dropDownList.dxDropDownList('instance');

        assert.deepEqual(dropDownList._getSelectedIndex(), 1, 'index is correct');
    });

    QUnit.test('widget should be openable if dataSource is null', function(assert) {
        const dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: [1]
        }).dxDropDownList('instance');

        dropDownList.option('dataSource', null);
        dropDownList.open();
        assert.ok(true, 'Widget works correctly');
    });

    QUnit.test('itemTemplate accepts template', function(assert) {
        const $template = $('<div>').text('test');
        $('#dropDownList').dxDropDownList({
            items: [1],
            displayExpr: 'this',
            opened: true,
            itemTemplate: new Template($template)
        });

        this.clock.tick();

        assert.equal($.trim($('.dx-list-item').text()), 'test', 'template rendered');
    });

    QUnit.test('contentReady action fires when dataSource loaded', function(assert) {
        let contentReadyFired = 0;

        const $dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: [1],
            deferRendering: true,
            onContentReady() {
                contentReadyFired++;
            }
        });

        assert.equal(contentReadyFired, 0, 'no content ready before opening');
        $dropDownList.dxDropDownList('open');
        this.clock.tick();

        assert.equal(contentReadyFired, 1, 'content ready fired when content is rendered');

        $dropDownList.dxDropDownList('close');
        $dropDownList.dxDropDownList('open');

        assert.equal(contentReadyFired, 1, 'content ready not fired when reopen dropdown');
    });

    QUnit.test('contentReady action fires when readOnly=true', function(assert) {
        const contentReadyActionStub = sinon.stub();

        const $dropDownList = $('#dropDownList').dxDropDownList({
            readOnly: true,
            dataSource: [1],
            onContentReady: contentReadyActionStub,
            deferRendering: true
        });

        $dropDownList.dxDropDownList('open');

        assert.ok(contentReadyActionStub.called, 'content ready fired when content is rendered');
    });

    QUnit.test('contentReady action fires when disabled=true', function(assert) {
        const contentReadyActionStub = sinon.stub();

        const $dropDownList = $('#dropDownList').dxDropDownList({
            disabled: true,
            dataSource: [1],
            onContentReady: contentReadyActionStub,
            deferRendering: true
        });

        $dropDownList.dxDropDownList('open');

        assert.ok(contentReadyActionStub.called, 'content ready fired when content is rendered');
    });

    QUnit.test('dataSource with Guid key', function(assert) {
        const guidKey1 = 'bd330029-8106-6d2d-5371-f27325155e99';
        const dataSource = new DataSource({
            load() {
                return [{ key: new Guid(guidKey1), value: 'one' }];
            },
            byKey(key, extra) {
                return { key: new Guid(guidKey1), value: 'one' };
            },

            key: 'key',
            keyType: 'Guid'
        });

        const $dropDownList = $('#dropDownList').dxDropDownList({
            dataSource,
            value: { key: new Guid(guidKey1), value: 'one' },
            valueExpr: 'this',
            displayExpr: 'value'
        });

        assert.equal($dropDownList.dxDropDownList('option', 'text'), 'one', 'value displayed');
    });

    QUnit.test('set item when key is 0', function(assert) {
        const data = [{ key: 0, value: 'one' }];
        const store = new CustomStore({
            load() {
                return data;
            },
            byKey(key) {
                return key === data[0].key
                    ? data[0]
                    : null;
            },
            key: 'key'
        });

        const $dropDownList = $('#dropDownList').dxDropDownList({
            displayExpr: 'value',
            valueExpr: 'this',
            dataSource: store
        });

        const dropDownList = $dropDownList.dxDropDownList('instance');
        dropDownList.option('value', { key: 0, value: 'one' });

        this.clock.tick();
        const $input = $dropDownList.find('.' + TEXTEDITOR_INPUT_CLASS);
        assert.equal($input.val(), 'one', 'item displayed');
    });

    QUnit.test('composite keys should be supported (T431267)', function(assert) {
        const data = [
            { a: 1, b: 1, value: 'one' },
            { a: 1, b: 2, value: 'two' }
        ];

        const dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: new CustomStore({
                load() {
                    return data;
                },
                byKey(key) {
                    return data.reduce((_, current) => {
                        if(current.a === key.a && current.b === key.b) {
                            return current;
                        }
                    });
                },
                key: ['a', 'b']
            })
        }).dxDropDownList('instance');

        dropDownList.option('value', data[1]);
        assert.deepEqual(dropDownList.option('selectedItem'), data[1], 'the selected item is set correctly');
    });

    QUnit.test('T321572: dxSelectBox - Use clear button with custom store leads to duplicate items', function(assert) {
        const productSample = [{
            'ID': 1,
            'Name': 'HD Video Player'
        }, {
            'ID': 2,
            'Name': 'SuperHD Player'
        }, {
            'ID': 3,
            'Name': 'SuperPlasma 50'
        }, {
            'ID': 4,
            'Name': 'SuperLED 50'
        }, {
            'ID': 5,
            'Name': 'SuperLED 42'
        }, {
            'ID': 6,
            'Name': 'SuperLCD 55'
        }, {
            'ID': 7,
            'Name': 'SuperLCD 42'
        }, {
            'ID': 8,
            'Name': 'SuperPlasma 65'
        }, {
            'ID': 9,
            'Name': 'SuperLCD 70'
        }];

        const $element = $('#dropDownList').dxDropDownList({
            displayExpr: 'Name',
            valueExpr: 'ID',
            dataSource: new DataSource({
                store: new CustomStore({
                    key: 'ID',
                    byKey: noop,
                    load(options) {
                        return productSample.slice(options.skip, options.skip + options.take);
                    },
                    pageSize: 5
                })
            }),
            placeholder: 'Choose Product',
            showClearButton: true,
            opened: true
        });

        const scrollView = $('.dx-scrollview').dxScrollView('instance');

        scrollView.scrollToElement($('.dx-list-item').last());
        scrollView.scrollToElement($('.dx-list-item').last());

        const dataSource = $element.dxDropDownList('option', 'dataSource');

        assert.ok(dataSource.isLastPage(), 'last page is loaded');

        $('.dx-list-item').last().trigger('dxclick');
        $($element.find('.dx-clear-button-area')).trigger('dxclick');

        assert.ok(dataSource.isLastPage(), 'last page is not changed');
    });

    QUnit.test('items value should be escaped', function(assert) {
        const $element = $('#dropDownList').dxDropDownList({
            dataSource: [{
                'CustId': -1,
                'Customer': '<None>'
            }],
            displayExpr: 'Customer',
            valueExpr: 'CustId'
        });

        const instance = $element.dxDropDownList('instance');
        instance.option('opened', true);

        assert.equal($.trim($('.dx-list-item').text()), '<None>', 'template rendered');
    });

    QUnit.test('searchTimeout should be refreshed after next symbol entered', function(assert) {
        const loadHandler = sinon.spy();

        const $element = $('#dropDownList').dxDropDownList({
            searchEnabled: true,
            dataSource: new CustomStore({
                load: loadHandler,
                byKey: noop
            }),
            searchTimeout: 100
        });

        const $input = $element.find('.' + TEXTEDITOR_INPUT_CLASS);
        const kb = keyboardMock($input);

        kb.type('1');
        this.clock.tick(100);
        assert.equal(loadHandler.callCount, 1, 'dataSource loaded after search timeout');

        kb.type('2');
        this.clock.tick(60);
        kb.type('3');
        this.clock.tick(60);
        assert.equal(loadHandler.callCount, 1, 'new time should start when new character is entered. DataSource should not load again');

        this.clock.tick(40);
        assert.equal(loadHandler.callCount, 2, 'dataSource loaded when full time is over after last input character');
    });

    QUnit.test('dropDownList should search for a pasted value', function(assert) {
        const $element = $('#dropDownList').dxDropDownList({
            searchEnabled: true,
            dataSource: ['1', '2', '3']
        });

        const instance = $element.dxDropDownList('instance');
        const searchSpy = sinon.spy(instance, '_searchDataSource');
        const $input = $element.find('.' + TEXTEDITOR_INPUT_CLASS);
        const kb = keyboardMock($input);

        kb.input('2');
        this.clock.tick(600);

        assert.equal(searchSpy.callCount, 1, 'widget searched for a suitable values');
    });

    QUnit.test('dropDownList should search in grouped DataSource', function(assert) {
        const $element = $('#dropDownList').dxDropDownList({
            grouped: true,
            searchEnabled: true,
            valueExpr: 'name',
            displayExpr: 'name',
            searchExpr: 'name',
            dataSource: [{ key: 'a', items: [{ name: '1' }] }, { key: 'b', items: [{ name: '2' }] }]
        });

        const instance = $element.dxDropDownList('instance');
        const $input = $element.find('.' + TEXTEDITOR_INPUT_CLASS);
        const kb = keyboardMock($input);
        const expectedValue = { key: 'b', items: [{ name: '2', key: 'b' }] };

        kb.type('2');
        this.clock.tick(500);

        assert.deepEqual(instance.option('items')[0], expectedValue, 'widget searched for a suitable values');
    });

    QUnit.test('valueExpr should not be passed to the list if it is \'this\'', function(assert) {
        // note: selection can not work with this and function as keyExpr.
        // Allowing of this breaks the case when store key is specified and deferred datasource is used
        $('#dropDownList').dxDropDownList({
            dataSource: [{ id: 1, text: 'Item 1' }],
            displayExpr: 'text',
            valueExpr: 'this',
            opened: true
        });

        const list = $(`.${LIST_CLASS}`).dxList('instance');

        assert.equal(list.option('keyExpr'), null, 'keyExpr is correct');
    });

    QUnit.test('valueExpr should be passed to the list\'s keyExpr option', function(assert) {
        const dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: [{ id: 1, text: 'Item 1' }],
            displayExpr: 'text',
            valueExpr: 'id',
            opened: true
        }).dxDropDownList('instance');

        const list = $(`.${LIST_CLASS}`).dxList('instance');

        assert.equal(list.option('keyExpr'), 'id', 'keyExpr should be passed on init');

        dropDownList.option('valueExpr', 'this');
        assert.equal(list.option('keyExpr'), null, 'keyExpr should be cleared when valueExpr was changed to \'this\'');

        dropDownList.option('valueExpr', 'text');
        assert.equal(list.option('keyExpr'), 'text', 'keyExpr should be passed on optionChanged');
    });

    QUnit.test('value option should be case-sensitive', function(assert) {
        const $element = $('#dropDownList').dxDropDownList({
            dataSource: [{ text: 'first' }, { text: 'First' }],
            displayExpr: 'text',
            valueExpr: 'text'
        });

        const instance = $element.dxDropDownList('instance');
        const $input = $element.find('.' + TEXTEDITOR_INPUT_CLASS);

        assert.equal($input.val(), '');

        instance.option('value', 'First');
        assert.equal($input.val(), 'First');
    });

    QUnit.test('set items on init when items of a data source are loaded', function(assert) {
        const arrayStore = new ArrayStore({
            data: [{ id: 1, text: 'first' }, { id: 2, text: 'second' }],
            key: 'id'
        });

        const customStore = new CustomStore({
            load(options) {
                return arrayStore.load(options);
            },

            byKey(key) {
                return arrayStore.byKey(key);
            },

            key: 'id'
        });

        const dataSource = new DataSource({
            store: customStore
        });

        const createDropDownList = () => {
            return $('<div/>')
                .appendTo($('#dropDownList'))
                .dxDropDownList({
                    dataSource,
                    displayExpr: 'text',
                    valueExpr: 'id',
                    opened: true,
                    value: 1
                }).dxDropDownList('instance');
        };

        createDropDownList();
        $('#dropDownList').empty();

        const spy = sinon.spy(customStore, 'byKey');
        const instance = createDropDownList();
        const $listItem = $(instance._$list.find(LIST_ITEM_SELECTOR).eq(1));

        $listItem.trigger('dxclick');

        assert.equal(spy.callCount, 0, 'byKey is not called when items are loaded');
    });
});

QUnit.module('selectedItem', moduleConfig, () => {
    QUnit.test('selectedItem', function(assert) {
        const items = [
            { key: 1, value: 'one' },
            { key: 2, value: 'two' }
        ];

        const dropDownList = $('#dropDownList').dxDropDownList({
            items,
            valueExpr: 'key',
            opened: true,
            value: 1
        }).dxDropDownList('instance');

        this.clock.tick();

        assert.deepEqual(dropDownList.option('selectedItem'), items[0], 'selected item');
    });

    QUnit.test('selectedItem and value should be reset on loading new items', function(assert) {
        const dropDownList = $('#dropDownList').dxDropDownList({
            items: [1, 2, 3, 4],
            value: 1,
            selectedItem: 1
        }).dxDropDownList('instance');

        this.clock.tick();

        dropDownList.option('items', ['a', 'b', 's', 'd']);
        this.clock.tick();

        assert.strictEqual(dropDownList.option('value'), 1, 'value is unchanged');
        assert.strictEqual(dropDownList.option('selectedItem'), null, 'selected item was reset');
    });

    QUnit.test('selectedItem and value should be reset on loading new dataSource', function(assert) {

        const dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: ['1', '2', '3', '4'],
            value: '1',
            selectedItem: '1'
        }).dxDropDownList('instance');

        this.clock.tick();

        dropDownList.option('dataSource', ['a', 'b', 's', 'd']);
        this.clock.tick();

        assert.strictEqual(dropDownList.option('value'), '1', 'value is unchanged');
        assert.strictEqual(dropDownList.option('selectedItem'), null, 'selected item was reset');
    });

    QUnit.test('selectedItem and value should not be reset on loading new dataSource, if the same element is contained in new dataSource', function(assert) {
        const dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: [],
            value: 2,
            selectedItem: 2
        }).dxDropDownList('instance');

        this.clock.tick();

        dropDownList.option('dataSource', [5, 2, 6, 7]);
        this.clock.tick();

        assert.strictEqual(dropDownList.option('value'), 2, 'value is correct');
        assert.strictEqual(dropDownList.option('selectedItem'), 2, 'selected item was not reset');
    });

    QUnit.test('\'null\' value processed correctly', function(assert) {
        const store = new ArrayStore({
            key: 'k',
            data: [
                { k: 1, v: 'a' },
                { k: 2, v: 'b' }
            ]
        });

        const dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: [0, 2, 3, 4],
            value: 0,
            selectedItem: 0
        }).dxDropDownList('instance');

        try {
            dropDownList.option('dataSource', store);

            assert.strictEqual(dropDownList.option('value'), 0, 'value is unchanged');
            assert.strictEqual(dropDownList.option('selectedItem'), null, 'selectedItem is null');
        } catch(e) {
            assert.ok(false, 'value was unwrapped incorrectly');
        }

    });

    QUnit.test('onSelectionChanged args should provide selectedItem (T193115)', function(assert) {
        assert.expect(2);

        const $dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: {
                load() {
                    return [1, 2, 3, 4, 5];
                },
                byKey(key) {
                    const deferred = $.Deferred();

                    setTimeout(() => {
                        deferred.resolve(key);
                    });

                    return deferred.promise();
                }
            },
            value: 2,
            onSelectionChanged(e) {
                assert.ok(Object.prototype.hasOwnProperty.call(e, 'selectedItem'), 'onSelectionChanged fired on creation when selectedItem is loaded');
            }
        });

        this.clock.tick();

        $dropDownList.dxDropDownList('option', 'onSelectionChanged', e => {
            assert.equal(e.selectedItem, 1, 'selectedItem provided in onValueChanged');
        });

        $dropDownList.dxDropDownList('option', 'value', 1);

        this.clock.tick();
    });

    QUnit.test('selectedItem should be chosen synchronously if item is already loaded', function(assert) {
        const $dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: {
                store: new CustomStore({
                    load(options) {
                        const result = [];
                        for(let i = options.skip; i < options.take; i++) {
                            result.push(i);
                        }
                        return result;
                    },
                    byKey(key) {
                        assert.ok(false, 'dataSource.byKey should not be called to fetch selected item');
                    }
                }),
                pageSize: 1,
                paginate: true
            },
            opened: true
        });

        this.clock.tick();

        $(`.${LIST_CLASS}`).dxList('_loadNextPage');

        this.clock.tick();

        $dropDownList.dxDropDownList('option', 'value', 0);

        assert.equal($dropDownList.dxDropDownList('option', 'selectedItem'), 0, 'selectedItem is fetched');
    });

    QUnit.test('selectedItem should be chosen correctly if deferRendering = false and dataSource is async', function(assert) {
        const dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: {
                store: new CustomStore({
                    load(options) {
                        const deferred = $.Deferred();
                        setTimeout(() => {
                            deferred.resolve([1, 2, 3, 4, 5, 6, 7]);
                        }, 100);
                        return deferred.promise();
                    },
                    byKey(key) {
                        const res = $.Deferred();
                        setTimeout(() => {
                            res.resolve(key);
                        }, 10);
                        return res.promise();
                    }
                }),
            },
            opened: false,
            value: 1,
            deferRendering: false
        }).dxDropDownList('instance');

        dropDownList.option('opened', true);
        this.clock.tick(1000);

        assert.equal(dropDownList._list.option('selectedItem'), 1, 'selectedItem is correct');
    });

    QUnit.test('reset()', function(assert) {
        const dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: [1, 2, 3, 4],
            value: 2,
            selectedItem: 2
        }).dxDropDownList('instance');

        // act
        dropDownList.reset();
        // assert
        assert.strictEqual(dropDownList.option('value'), null, 'Value should be reset');
        assert.strictEqual(dropDownList.option('selectedItem'), null, 'Value should be reset');
    });

    QUnit.test('onSelectionChanged action should not be fired after dataSource has been updated and selectedItem was not changed', function(assert) {
        const selectionChangedHandler = sinon.spy();
        const dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: [],
            value: 'unknown value',
            valueExpr: 'id',
            displayExpr: 'name',
            acceptCustomValue: true,
            onSelectionChanged: selectionChangedHandler
        }).dxDropDownList('instance');

        dropDownList.option('dataSource', [{ id: 0, name: 'zero' }, { id: 1, name: 'one' }]);

        assert.strictEqual(selectionChangedHandler.callCount, 0, 'selectionChanged action was not fired');
    });

    QUnit.test('selectionChanged should not fire if selectedItem was not changed', function(assert) {
        const selectionChangedHandler = sinon.stub();
        const items = [{ name: 'item1' }, { name: 'item2' }];
        const instance = $('#dropDownList').dxDropDownList({
            dataSource: items,
            value: items[0],
            onSelectionChanged: selectionChangedHandler,
            displayExpr: 'name'
        }).dxDropDownList('instance');

        assert.strictEqual(instance.option('selectedItem'), items[0], 'selectedItem is correct on init');

        instance.option('selectedItem', items[0]);
        assert.strictEqual(instance.option('selectedItem'), items[0], 'selectedItem was not changed');
        assert.equal(selectionChangedHandler.callCount, 1, 'selectionChanged should not fire twice');
    });
});

QUnit.module('popup', moduleConfig, () => {
    QUnit.test('popup max height should fit in the window', function(assert) {
        const items = ['item 1', 'item 2', 'item 3', 'item 1', 'item 2', 'item 3', 'item 1', 'item 2', 'item 3',
            'item 1', 'item 2', 'item 3', 'item 1', 'item 2', 'item 3', 'item 1', 'item 2', 'item 3', 'item 1', 'item 2', 'item 3',
            'item 1', 'item 2', 'item 3', 'item 1', 'item 2', 'item 3', 'item 1', 'item 2', 'item 3',
            'item 1', 'item 2', 'item 3', 'item 3', 'item 1', 'item 2', 'item 3', 'item 1', 'item 2', 'item 3'];

        $('#dropDownList').dxDropDownList({
            items,
            opened: true
        }).dxDropDownList('instance');

        assert.ok($('.dx-overlay-content').height() <= Math.ceil($(window).height() * 0.5));
    });

    QUnit.test('popup max height are limited by container bounds', function(assert) {
        const items = ['item 1', 'item 2', 'item 3', 'item 1', 'item 2', 'item 3', 'item 1', 'item 2', 'item 3'];
        const parentContainer = $('<div>').attr('id', 'specific-container').height(80).appendTo('#qunit-fixture');
        const childContainer = $('<div>').attr('id', 'child-container').height(60).appendTo(parentContainer);

        const instance = $('#dropDownList').dxDropDownList({
            items,
            dropDownOptions: {
                container: childContainer
            },
            opened: true
        }).dxDropDownList('instance');

        assert.ok($(instance.content()).parent().height() > 80, 'popup sizes are not limited if container has no overflow: hidden styles');

        parentContainer.css('overflow', 'hidden');
        instance.close();
        instance.open();
        assert.roughEqual($(instance.content()).parent().height(), 80 / 2, 2, 'popup sizes are limited by container parent bounds');

        childContainer.css('overflow', 'hidden');
        instance.repaint();
        assert.roughEqual($(instance.content()).parent().height(), 60 / 2, 2, 'popup sizes are limited by container bounds');

        parentContainer.remove();
    });

    QUnit.test('popup max height are limited by container bounds and window', function(assert) {
        const items = [];
        for(let i = 0; i < 100; i++) {
            items.push(`item ${i}`);
        }

        const windowHeight = $(window).outerHeight();
        const parentContainer = $('<div>')
            .attr('id', 'specific-container')
            .css('overflow', 'hidden')
            .height(windowHeight * 2)
            .appendTo('#qunit-fixture');

        const instance = $('#dropDownList').dxDropDownList({
            items,
            dropDownOptions: {
                container: parentContainer
            },
            opened: true
        }).dxDropDownList('instance');
        const $overlay = $(instance.content()).parent();

        assert.roughEqual($overlay.height(), windowHeight / 2, 2, 'popup sizes are limited by window if overflow:hidden container is larger than window');

        parentContainer.remove();
    });

    QUnit.test('skip gesture event class attach only when popup is opened', function(assert) {
        const SKIP_GESTURE_EVENT_CLASS = 'dx-skip-gesture-event';
        const $dropDownList = $('#dropDownList').dxDropDownList({
            items: [1, 2, 3]
        });

        assert.equal($dropDownList.hasClass(SKIP_GESTURE_EVENT_CLASS), false, 'skip gesture event class was not added when popup is closed');

        $dropDownList.dxDropDownList('option', 'opened', true);
        assert.equal($dropDownList.hasClass(SKIP_GESTURE_EVENT_CLASS), true, 'skip gesture event class was added after popup was opened');

        $dropDownList.dxDropDownList('option', 'opened', false);
        assert.equal($dropDownList.hasClass(SKIP_GESTURE_EVENT_CLASS), false, 'skip gesture event class was removed after popup was closed');
    });

    QUnit.test('After load new page scrollTop should not be changed', function(assert) {
        this.clock.restore();

        const data = [];
        const done = assert.async();

        for(let i = 100; i >= 0; i--) {
            data.push(i);
        }

        $('#qunit-fixture')
            .css('left', 0)
            .css('top', 0);

        $('#dropDownList').dxDropDownList({
            searchEnabled: true,
            dataSource: {
                store: new ArrayStore(data),
                paginate: true,
                pageSize: 40
            },
            opened: true,
            searchTimeout: 0,
            width: 200
        });

        const listInstance = $(`.${LIST_CLASS}`).dxList('instance');

        listInstance.option('pageLoadMode', 'scrollBottom');
        listInstance.option('useNativeScrolling', 'true');
        listInstance.option('useNative', 'true');

        listInstance.scrollTo(1000);
        const scrollTop = listInstance.scrollTop();

        setTimeout(() => {
            assert.strictEqual(listInstance.scrollTop(), scrollTop, 'scrollTop is correctly after new page load');
            done();
        });
    });

    QUnit.testInActiveWindow('After search and load new page scrollTop should not be changed', function(assert) {
        if(browser.msie) {
            assert.ok(true, 'not applicable in IE');
            return;
        }

        if(browser.chrome && !window.INTRANET) {
            assert.ok(true, 'TODO https://trello.com/c/l50V8hPU/');
            return;
        }

        this.clock.restore();

        const data = [];
        const done = assert.async();

        for(let i = 100; i >= 0; i--) {
            data.push(i);
        }

        const $dropDownList = $('#dropDownList').dxDropDownList({
            searchEnabled: true,
            dataSource: {
                store: new ArrayStore(data),
                paginate: true,
                pageSize: 40
            },
            searchTimeout: 0
        });

        $dropDownList.dxDropDownList('instance').open();

        const listInstance = $(`.${LIST_CLASS}`).dxList('instance');

        listInstance.option('pageLoadMode', 'scrollBottom');
        listInstance.option('useNativeScrolling', 'true');
        listInstance.option('useNative', 'true');

        const $input = $dropDownList.find('.' + TEXTEDITOR_INPUT_CLASS);
        const keyboard = keyboardMock($input);

        $dropDownList.focusin();

        keyboard
            .type('5')
            .press('backspace');

        listInstance.scrollTo(1000);

        const scrollTop = listInstance.scrollTop();

        setTimeout(() => {
            assert.roughEqual(listInstance.scrollTop(), scrollTop, 2, 'scrollTop is correctly after new page load');
            assert.ok(listInstance.scrollTop() === scrollTop, 'scrollTop was not changed after loading new page');
            done();
        });
    });

    QUnit.test('popup should be configured with templatesRenderAsynchronously=false (T470619)', function(assert) {
        const data = ['item-1', 'item-2', 'item-3'];

        $('#dropDownList').dxDropDownList({
            dataSource: new DataSource(data),
            value: data[0],
            opened: true
        });

        const popup = $('.dx-dropdowneditor-overlay.dx-popup').dxPopup('instance');

        assert.strictEqual(popup.option('templatesRenderAsynchronously'), false, 'templatesRenderAsynchronously should have false value');
    });

    QUnit.test('popup should be configured with autoResizeEnabled=false (to prevent issues with pushBackValue and scrolling in IOS)', function(assert) {
        const data = ['item-1'];

        $('#dropDownList').dxDropDownList({
            dataSource: new DataSource(data),
            value: data[0],
            opened: true
        });

        const popup = $('.dx-dropdowneditor-overlay.dx-popup').dxPopup('instance');

        assert.strictEqual(popup.option('autoResizeEnabled'), false, 'autoResizeEnabled should have false value');
    });

    QUnit.test('no exception when \'container\' is empty jQuery set (T831152)', function(assert) {
        let exception = null;

        try {

            $('#dropDownList').dxDropDownList({
                items: ['1', '2', '3'],
                opened: true,
                dropDownOptions: {
                    container: $()
                }
            });

        } catch(e) {
            exception = e;
        } finally {
            assert.strictEqual(exception, null);
        }
    });
});

QUnit.module('dataSource integration', moduleConfig, function() {
    QUnit.test('guid integration', function(assert) {
        const value = '6fd3d2c5-904d-4e6f-a302-3e277ef36630';
        const data = [new Guid(value)];
        const dataSource = new DataSource(data);
        const $dropDownList = $('#dropDownList').dxDropDownList({
            dataSource,
            value
        });

        this.clock.tick();

        assert.deepEqual($dropDownList.dxDropDownList('option', 'selectedItem'), data[0], 'value found');
    });

    QUnit.test('dataSource loading longer than 400ms should not lead to the load panel being displayed', function(assert) {
        const loadDelay = 1000;
        const instance = $('#dropDownList').dxDropDownList({
            dataSource: {
                load: () => {
                    const d = new $.Deferred();

                    setTimeout(() => {
                        d.resolve([1, 2, 3]);
                    }, loadDelay);

                    return d;
                }
            },
            opened: true
        }).dxDropDownList('instance');

        this.clock.tick(loadDelay);
        const $content = $(instance.content());
        const $loadPanel = $content.find('.dx-scrollview-loadpanel');

        instance.getDataSource().load();
        this.clock.tick(loadDelay / 2);
        assert.ok($loadPanel.is(':hidden'), `load panel is not visible (${loadDelay / 2}ms after the loading started)`);

        this.clock.tick(loadDelay / 2);
        assert.ok($loadPanel.is(':hidden'), 'load panel is not visible when loading has been finished');
    });

    QUnit.test('dataSource should not be reloaded while minSearchLength is not exceeded (T876423)', function(assert) {
        const loadStub = sinon.stub().returns([{ name: 'test 1' }, { name: 'test 2' }, { name: 'test 3' }]);

        const $dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: {
                load: loadStub,
                byKey: (id) => { return { name: id }; }
            },
            searchEnabled: true,
            deferRendering: false,
            showDataBeforeSearch: true,
            valueExpr: 'name',
            displayExpr: 'name',
            searchExpr: 'name',
            searchTimeout: 0,
            minSearchLength: 3
        });

        const $input = $dropDownList.find('.' + TEXTEDITOR_INPUT_CLASS);
        const kb = keyboardMock($input);

        kb.type('123');

        assert.strictEqual(loadStub.callCount, 2);

        kb.press('backspace')
            .press('backspace');

        assert.strictEqual(loadStub.callCount, 3);
    });
});

QUnit.module('action options', moduleConfig, () => {
    QUnit.test('onItemClick action', function(assert) {
        assert.expect(3);

        const items = ['item 1', 'item 2', 'item 3'];

        const $dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: items,
            opened: true
        });

        const instance = $dropDownList.dxDropDownList('instance');

        this.clock.tick();

        const $listItem = instance._$list.find(LIST_ITEM_SELECTOR).eq(1);

        instance.option('onItemClick', e => {
            assert.deepEqual($(e.itemElement)[0], $listItem[0], 'itemElement is correct');
            assert.strictEqual(e.itemData, items[1], 'itemData is correct');
            assert.strictEqual(e.itemIndex, 1, 'itemIndex is correct');
        });

        $($listItem).trigger('dxclick');
    });
});

QUnit.module('render input addons', moduleConfig, () => {
    QUnit.test('dropDownButton rendered correctly when dataSource is async', function(assert) {
        const $dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: {
                load() {
                    const deferred = $.Deferred();
                    setTimeout(() => {
                        deferred.resolve([1, 2, 3, 4, 5, 6, 7]);
                    }, 1000);
                    return deferred.promise();
                },
                byKey(key) {
                    const deferred = $.Deferred();
                    setTimeout(() => {
                        deferred.resolve(key);
                    }, 1000);
                    return deferred.promise();
                }
            },
            showDropDownButton: true,
            openOnFieldClick: false,
            value: 1
        });

        this.clock.tick(1000);

        assert.ok($dropDownList.find('.dx-dropdowneditor-button').length, 'dropDownButton rendered');
    });
});

QUnit.module('aria accessibility', moduleConfig, () => {
    QUnit.test('aria-owns should point to list', function(assert) {
        const $dropDownList = $('#dropDownList').dxDropDownList({ opened: true });
        const $popupContent = $(`.${POPUP_CONTENT_CLASS}`);

        assert.notEqual($dropDownList.attr('aria-owns'), undefined, 'aria-owns exists');
        assert.equal($dropDownList.attr('aria-owns'), $popupContent.attr('id'), 'aria-owns equals popup content\'s id');
    });

    QUnit.test('aria-controls should be removed when popup is not visible', function(assert) {
        const $dropDownList = $('#dropDownList').dxDropDownList({ opened: true });
        const $input = $dropDownList.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const instance = $dropDownList.dxDropDownList('instance');
        const $list = $(instance.content()).find(`.${LIST_CLASS}`);

        assert.notEqual($input.attr('aria-controls'), undefined, 'controls exists');
        assert.equal($input.attr('aria-controls'), $list.attr('id'), 'aria-controls points to list\'s id');

        instance.close();

        assert.strictEqual($input.attr('aria-controls'), undefined, 'controls does not exist');
    });

    QUnit.test('input\'s aria-activedescendant attribute should point to the focused item', function(assert) {
        const $dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: [1, 2, 3],
            opened: true,
            focusStateEnabled: true
        });

        const $list = $(`.${LIST_CLASS}`);
        const list = $list.dxList('instance');
        const $input = $dropDownList.find('.' + TEXTEDITOR_INPUT_CLASS);
        const $item = $list.find('.dx-list-item:eq(1)');

        list.option('focusedElement', $item);

        assert.notEqual($input.attr('aria-activedescendant'), undefined, 'aria-activedescendant exists');
        assert.equal($input.attr('aria-activedescendant'), $item.attr('id'), 'aria-activedescendant and id of the focused item are equals');
    });

    QUnit.test('list\'s aria-target should point to the widget\'s input (T247414)', function(assert) {
        assert.expect(2);

        const dropDownList = $('#dropDownList').dxDropDownList({ opened: true }).dxDropDownList('instance');
        const list = $(`.${LIST_CLASS}`).dxList('instance');
        const $input = $('#dropDownList').find(`.${TEXTEDITOR_INPUT_CLASS}`);

        assert.deepEqual(list._getAriaTarget(), dropDownList._getAriaTarget());
        assert.strictEqual($input.attr('role'), 'combobox', 'input.role');
    });
});

QUnit.module('dropdownlist with groups', {
    beforeEach: function() {
        this.dataSource = new DataSource({
            store: [{ id: 1, group: 'first' }, { id: 2, group: 'second' }],
            key: 'id',
            group: 'group'
        });
    }
}, () => {
    QUnit.test('grouped option', function(assert) {
        const dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: this.dataSource,
            opened: true,
            grouped: true
        }).dxDropDownList('instance');

        const list = $(`.${LIST_CLASS}`).dxList('instance');
        assert.strictEqual(list.option('grouped'), true, 'grouped option is passed to the list');
        assert.deepEqual(list.option('items'), dropDownList.option('items'), 'items is equal');

        dropDownList.option('grouped', false);

        assert.strictEqual(list.option('grouped'), false, 'grouped option is passed to the list');
    });

    QUnit.test('groupTemplate option', function(assert) {
        const groupTemplate1 = new Template('<div>Test</div>');

        const dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: this.dataSource,
            opened: true,
            grouped: true,
            groupTemplate: groupTemplate1
        }).dxDropDownList('instance');

        const list = $(`.${LIST_CLASS}`).dxList('instance');
        assert.strictEqual(list.option('groupTemplate'), groupTemplate1, 'groupTemplate has been passed on init');

        const groupTemplate2 = new Template('<div>Test</div>');
        dropDownList.option('groupTemplate', groupTemplate2);

        assert.strictEqual(list.option('groupTemplate'), groupTemplate2, 'groupTemplate has been passed on option changing');
    });

    QUnit.test('itemElement argument of groupTemplate option is correct', function(assert) {
        $('#dropDownList').dxDropDownList({
            dataSource: this.dataSource,
            opened: true,
            grouped: true,
            groupTemplate(itemData, itemIndex, itemElement) {
                assert.equal(isRenderer(itemElement), !!config().useJQuery, 'itemElement is correct');
                return $('<div>');
            }
        }).dxDropDownList('instance');
    });

    QUnit.test('selectedItem for grouped dropdownlist', function(assert) {
        const dropDownList = $('#dropDownList').dxDropDownList({
            dataSource: this.dataSource,
            opened: true,
            grouped: true,
            valueExpr: 'id',
            displayExpr: 'id',
            value: 2
        }).dxDropDownList('instance');

        assert.strictEqual(dropDownList.option('selectedItem').id, 2, 'selectedItem is correct');
    });
});

QUnit.module(
    'data source from url',
    {
        afterEach: function() {
            ajaxMock.clear();
        }
    },
    () => {
        const TEST_URL = '/a3211c1d-c725-4185-acc0-0a59a4152aae';

        const setupAjaxMock = (responseFactory) => {
            ajaxMock.setup({
                url: TEST_URL,
                callback() {
                    this.responseText = responseFactory();
                }
            });
        };

        const appendWidgetContainer = () => {
            return $('#qunit-fixture').append('<div id=test-drop-down></div>');
        };

        QUnit.test('initial value', function(assert) {
            const done = assert.async();

            appendWidgetContainer();
            setupAjaxMock(() => {
                return [{ value: 123, text: 'Expected Text' }];
            });

            $('#test-drop-down').dxDropDownList({
                dataSource: TEST_URL,
                valueExpr: 'value',
                displayExpr: 'text',
                value: 123
            });

            window
                .waitFor(() => {
                    return $('#test-drop-down').dxDropDownList('option', 'displayValue') === 'Expected Text';
                })
                .done(() => {
                    assert.expect(0);
                    done();
                });
        });

        QUnit.test('search', function(assert) {
            const done = assert.async();

            appendWidgetContainer();
            setupAjaxMock(() => {
                return ['a', 'z'];
            });

            $('#test-drop-down').dxDropDownList({
                dataSource: TEST_URL,
                searchEnabled: true,
                searchTimeout: 0,
                opened: true
            });

            keyboardMock($('#test-drop-down .' + TEXTEDITOR_INPUT_CLASS)).type('z');

            window
                .waitFor(() => {
                    const popup = $('#test-drop-down').dxDropDownList('instance')._popup.$content();
                    const items = popup.find('.dx-list-item');

                    return items.length === 1 && $(items[0]).text() === 'z';
                })
                .done(() => {
                    assert.expect(0);
                    done();
                });
        });

    }
);
