import $ from 'jquery';
import devices from 'core/devices';
import executeAsyncMock from '../../helpers/executeAsyncMock.js';
import keyboardMock from '../../helpers/keyboardMock.js';
import { DataSource } from 'data/data_source/data_source';
import { deferUpdate } from 'core/utils/common';
import registerKeyHandlerTestHelper from '../../helpers/registerKeyHandlerTestHelper.js';
import errors from 'ui/widget/ui.errors';

import 'ui/radio_group';

const { testStart, module, test, testInActiveWindow } = QUnit;

testStart(() => {
    $('#qunit-fixture').html('<div id="radioGroup"></div>');
});

const RADIO_GROUP_CLASS = 'dx-radiogroup';
const RADIO_GROUP_VERTICAL_CLASS = 'dx-radiogroup-vertical';
const RADIO_GROUP_HORIZONTAL_CLASS = 'dx-radiogroup-horizontal';
const RADIO_BUTTON_CLASS = 'dx-radiobutton';
const RADIO_BUTTON_CHECKED_CLASS = 'dx-radiobutton-checked';
const FOCUSED_CLASS = 'dx-state-focused';

const moduleConfig = {
    beforeEach: function() {
        executeAsyncMock.setup();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
    }
};

const createRadioGroup = options => $('#radioGroup').dxRadioGroup(options);
const getInstance = $element => $element.dxRadioGroup('instance');

module('nested radio group', moduleConfig, () => {
    test('T680199 - click on nested radio group in template should not affect on contaier parent radio group', function(assert) {
        let $nestedRadioGroup;

        const $radioGroup = createRadioGroup({
            items: [{
                template: function(itemData, itemIndex, element) {
                    $nestedRadioGroup = $('<div/>').dxRadioGroup({
                        items: [1, 2]
                    }).appendTo(element);

                    $('<div/>').dxRadioGroup({
                        items: [1, 2]
                    }).appendTo(element);
                }
            }]
        });

        const parentRadioGroup = getInstance($radioGroup);
        const parentItemElement = $(parentRadioGroup.itemElements()).first();
        parentItemElement.trigger('dxclick');
        assert.ok(parentItemElement.hasClass(RADIO_BUTTON_CHECKED_CLASS), 'item of parent radio group is checked');

        const nestedRadioGroup = getInstance($nestedRadioGroup);
        const nestedItemElement = $(nestedRadioGroup.itemElements()).first();
        nestedItemElement.trigger('dxclick');
        assert.ok(nestedItemElement.hasClass(RADIO_BUTTON_CHECKED_CLASS), 'item of nested radio group is checked');

        assert.ok(parentItemElement.hasClass(RADIO_BUTTON_CHECKED_CLASS), 'item of parent radio group is not changed');
    });

    test('T680199 - click on one nested radio group doesn\'t change another nested group', function(assert) {
        let $nestedRadioGroup1,
            $nestedRadioGroup2;

        createRadioGroup({
            items: [{
                template: function(itemData, itemIndex, element) {
                    $nestedRadioGroup1 = $('<div/>').dxRadioGroup({
                        items: [1, 2]
                    }).appendTo(element);

                    $nestedRadioGroup2 = $('<div/>').dxRadioGroup({
                        items: [1, 2]
                    }).appendTo(element);
                }
            }]
        });

        const nestedRadioGroup1 = getInstance($nestedRadioGroup1);
        const nestedRadioGroup2 = getInstance($nestedRadioGroup2);

        const firstNestedItemElement1 = $(nestedRadioGroup1.itemElements()).first();
        firstNestedItemElement1.trigger('dxclick');
        assert.ok(firstNestedItemElement1.hasClass(RADIO_BUTTON_CHECKED_CLASS), 'item of first nested radio group is checked');

        const firstNestedItemElement2 = $(nestedRadioGroup2.itemElements()).first();
        assert.notOk(firstNestedItemElement2.hasClass(RADIO_BUTTON_CHECKED_CLASS), 'item of second nested radio group is not changed');
    });

    QUnit.test('item template can return default template name', function(assert) {
        const instance = $('#radioGroup').dxRadioGroup({
            items: [1, 2, 3],
            itemTemplate: function() {
                return 'item';
            }
        }).dxRadioGroup('instance');

        assert.strictEqual(instance.itemElements().eq(0).text(), '1', 'Default item template was rendered');
        assert.strictEqual(instance.itemElements().eq(1).text(), '2', 'Default item template was rendered');
    });
});

module('buttons group rendering', () => {
    test('onContentReady fired after the widget is fully ready', function(assert) {
        assert.expect(2);

        createRadioGroup({
            items: [
                { text: '0' }
            ],
            onContentReady: function(e) {
                assert.ok($(e.element).hasClass(RADIO_GROUP_CLASS));
                assert.ok($(e.element).find('.' + RADIO_BUTTON_CLASS).length);
            }
        });
    });

    test('onContentReady should rise after changing dataSource (T697809)', function(assert) {
        const onContentReadyHandler = sinon.stub(),
            instance = getInstance(
                createRadioGroup({
                    dataSource: ['str1', 'str2', 'str3'],
                    onContentReady: onContentReadyHandler
                })
            );

        assert.ok(onContentReadyHandler.calledOnce);
        instance.option('dataSource', [1, 2, 3]);
        assert.strictEqual(onContentReadyHandler.callCount, 2);
    });
});

module('layout', moduleConfig, () => {
    test('should be generated proper class with vertical layout', function(assert) {
        const $radioGroup = createRadioGroup({
            layout: 'vertical'
        });

        assert.ok($radioGroup.hasClass(RADIO_GROUP_VERTICAL_CLASS), 'class set correctly');
    });

    test('should be generated proper class with horizontal layout', function(assert) {
        const $radioGroup = createRadioGroup({
            layout: 'horizontal'
        });

        assert.ok($radioGroup.hasClass(RADIO_GROUP_HORIZONTAL_CLASS), 'class set correctly');
    });

    test('should be generated proper class when layout is changed', function(assert) {
        const $radioGroup = createRadioGroup({
            layout: 'horizontal'
        });

        getInstance($radioGroup).option('layout', 'vertical');

        assert.ok($radioGroup.hasClass(RADIO_GROUP_VERTICAL_CLASS), 'class set correctly');
    });

    test('On the tablet radio group must use a horizontal layout', function(assert) {
        devices.current('iPad');

        const $radioGroup = createRadioGroup(),
            isHorizontalLayout = getInstance($radioGroup).option('layout') === 'horizontal';

        assert.ok(isHorizontalLayout, 'radio group on tablet have horizontal layout');
    });

    test('RadioGroup items should have the \'dx-radio-button\' class after render on deferUpdate (T820582)', function(assert) {
        const items = [
            { text: 'test 1' },
            { text: 'test 2' }
        ];

        deferUpdate(() => {
            createRadioGroup({ items });
        });

        const itemsCount = $('#radioGroup').find(`.${RADIO_BUTTON_CLASS}`).length;

        assert.strictEqual(itemsCount, items.length, `items with the "${RADIO_BUTTON_CLASS}" class were rendered`);
    });
});

module('hidden input', () => {
    test('the hidden input should get correct value on widget value change', function(assert) {
        const $element = createRadioGroup({
                items: [1, 2, 3],
                value: 2
            }),
            instance = getInstance($element),
            $input = $element.find('input');

        instance.option('value', 1);
        assert.equal($input.val(), '1', 'input value is correct');
    });
});

module('value', moduleConfig, () => {

    test('should throw the W1002 error when the value is unknown key', function(assert) {
        const errorLogStub = sinon.stub(errors, 'log');

        createRadioGroup({
            items: [{ value: '1' }, { value: '2' }],
            valueExpr: 'value',
            value: '3'
        });

        assert.ok(errorLogStub.calledOnce, 'error was thrown');
        errorLogStub.restore();
    });

    test('should not throw the W1002 error when the value is \'null\' (T823478)', function(assert) {
        const errorLogStub = sinon.stub(errors, 'log');

        createRadioGroup({
            items: ['1', '2', '3'],
            value: null
        });

        assert.ok(errorLogStub.notCalled, 'error was not thrown');
        errorLogStub.restore();
    });

    test('should not throw the W1002 error when the value is changed to \'null\' (T823478)', function(assert) {
        const errorLogStub = sinon.stub(errors, 'log');

        const instance = getInstance(
            createRadioGroup({
                items: ['1', '2', '3'],
                value: '2'
            })
        );

        instance.option('value', null);

        assert.ok(errorLogStub.notCalled, 'error was not thrown');
        errorLogStub.restore();
    });

    test('should not throw the W1002 error when the reset method is called (T823478)', function(assert) {
        const errorLogStub = sinon.stub(errors, 'log');

        createRadioGroup({
            items: ['1', '2', '3'],
            value: '2'
        }).dxRadioGroup('reset');

        assert.ok(errorLogStub.notCalled, 'error was not thrown');
        errorLogStub.restore();
    });

    test('should have correct initialized selection', function(assert) {
        let radioGroupInstance = null;
        const isItemChecked = index => radioGroupInstance.itemElements().eq(index).hasClass(RADIO_BUTTON_CHECKED_CLASS);

        radioGroupInstance = getInstance(
            createRadioGroup({
                items: ['item1', 'item2', 'item3']
            })
        );

        assert.notOk(isItemChecked(0));
        assert.notOk(isItemChecked(1));
        assert.notOk(isItemChecked(2));

        radioGroupInstance = getInstance(
            createRadioGroup({
                items: ['item1', 'item2', 'item3'],
                value: 'item2'
            })
        );

        assert.notOk(isItemChecked(0));
        assert.ok(isItemChecked(1));
        assert.notOk(isItemChecked(2));
    });

    QUnit.test('null item should be selectable', function(assert) {
        const radioGroupInstance = getInstance(
            createRadioGroup({
                items: [
                    { id: null, name: 'null' },
                    { id: false, name: 'false' },
                    { id: 0, name: '0' },
                    { id: undefined, name: 'undefined' }
                ],
                valueExpr: 'id',
                displayExpr: 'name'
            })
        );
        const $radioButtons = radioGroupInstance.$element().find('.dx-radiobutton');

        radioGroupInstance.option('value', null);
        assert.ok($radioButtons.eq(0).hasClass('dx-radiobutton-checked'), 'null item is selected');

        radioGroupInstance.option('value', false);
        assert.ok($radioButtons.eq(1).hasClass('dx-radiobutton-checked'), 'false item is selected');

        radioGroupInstance.option('value', 0);
        assert.ok($radioButtons.eq(2).hasClass('dx-radiobutton-checked'), '0 item is selected');

        radioGroupInstance.option('value', undefined);
        assert.ok($radioButtons.eq(3).hasClass('dx-radiobutton-checked'), 'undefined item is selected');
    });

    test('repaint of widget shouldn\'t reset value option', function(assert) {
        const items = [{ text: '0' }, { text: '1' }];
        const $radioGroup = createRadioGroup({
                items: items,
                value: items[1]
            }),
            radioGroup = getInstance($radioGroup);

        radioGroup.repaint();
        assert.strictEqual(radioGroup.option('value'), items[1]);
    });

    test('value is changed on item click', function(assert) {
        assert.expect(1);

        let value;
        const $radioGroup = createRadioGroup({
            items: [1, 2, 3],
            onValueChanged: function(e) {
                value = e.value;
            }
        });
        const radioGroup = getInstance($radioGroup);

        $(radioGroup.itemElements()).first().trigger('dxclick');

        assert.equal(value, 1, 'value changed');
    });

    test('onValueChanged option should get jQuery event as a parameter', function(assert) {
        let jQueryEvent,
            $radioGroup = createRadioGroup({
                items: [1, 2, 3],
                onValueChanged: function(e) {
                    jQueryEvent = e.event;
                }
            }),
            radioGroup = getInstance($radioGroup);

        $(radioGroup.itemElements()).first().trigger('dxclick');
        assert.ok(jQueryEvent, 'jQuery event is defined when click used');

        radioGroup.option('value', 2);
        assert.notOk(jQueryEvent, 'jQuery event is not defined when api used');
    });
});

module('valueExpr', moduleConfig, () => {
    test('value should be correct if valueExpr is a string', function(assert) {
        const items = [
            { number: 1, caption: 'one' },
            { number: 2, caption: 'two' }
        ];

        const radioGroup = getInstance(
            createRadioGroup({
                dataSource: items,
                valueExpr: 'number',
                value: 2,
                itemTemplate: function(item) {
                    return item.caption;
                }
            })
        );

        let $secondItem = $(radioGroup.itemElements()).eq(1);

        assert.equal($secondItem.text(), 'two');

        radioGroup.option('itemTemplate', function(item) {
            return item.number;
        });

        $secondItem = $(radioGroup.itemElements()).eq(1);
        assert.equal($secondItem.text(), '2');

        radioGroup.option('valueExpr', 'caption');
        assert.equal(radioGroup.option('value'), 2);

        assert.equal($(radioGroup.itemElements()).find(`.${RADIO_BUTTON_CHECKED_CLASS}`).length, 0, 'no items selected');
    });

    test('value should be correct if valueExpr is a function', function(assert) {
        const items = [
            { text: 'text1', value: true },
            { text: 'text2', value: false }
        ];
        const radioGroup = getInstance(
            createRadioGroup({
                dataSource: items,
                valueExpr: e => e.value
            })
        );

        assert.strictEqual(radioGroup.option('value'), null);
        assert.strictEqual($(radioGroup.itemElements()).find(`.${RADIO_BUTTON_CHECKED_CLASS}`).length, 0);

        const itemElement = $(radioGroup.itemElements()).first();

        itemElement.trigger('dxclick');
        assert.strictEqual(radioGroup.option('value'), true);
        assert.ok(itemElement.hasClass(RADIO_BUTTON_CHECKED_CLASS));
    });

    test('displayExpr option should work', function(assert) {
        const radioGroup = getInstance(
            createRadioGroup({
                dataSource: [{ id: 1, name: 'Item 1' }],
                valueExpr: 'id',
                displayExpr: 'name',
                value: 1
            })
        );
        const $item = $(radioGroup.itemElements()).eq(0);

        assert.strictEqual($item.text(), 'Item 1', 'displayExpr works');
    });
});

module('widget sizing render', moduleConfig, () => {
    test('change width', function(assert) {
        const $element = createRadioGroup({
                items: [
                    { text: '0' },
                    { text: '1' },
                    { text: '2' },
                    { text: '3' }
                ]
            }),
            instance = getInstance($element),
            customWidth = 400;

        instance.option('width', customWidth);

        assert.strictEqual($element.outerWidth(), customWidth, 'outer width of the element must be equal to custom width');
    });
});

module('keyboard navigation', moduleConfig, () => {
    test('keys tests', function(assert) {
        assert.expect(3);

        const items = [{ text: '0' }, { text: '1' }, { text: '2' }, { text: '3' }],
            $element = createRadioGroup({
                focusStateEnabled: true,
                items: items
            }),
            instance = getInstance($element),
            keyboard = keyboardMock($element);

        $element.focusin();

        keyboard.keyDown('enter');
        assert.equal(instance.option('value'), items[0], 'first item chosen');
        keyboard.keyDown('down');
        keyboard.keyDown('enter');
        assert.equal(instance.option('value'), items[1], 'second item chosen');
        keyboard.keyDown('up');
        keyboard.keyDown('space');
        assert.equal(instance.option('value'), items[0], 'first item chosen');
    });

    test('control keys should be prevented', function(assert) {
        const items = [{ text: '0' }, { text: '1' }];
        const $element = createRadioGroup({
            focusStateEnabled: true,
            items: items
        });
        const keyboard = keyboardMock($element);
        let isDefaultPrevented = false;
        $($element).on('keydown', function(e) {
            isDefaultPrevented = e.isDefaultPrevented();
        });

        $element.focusin();

        keyboard.keyDown('enter');
        assert.ok(isDefaultPrevented, 'enter is default prevented');

        keyboard.keyDown('down');
        assert.ok(isDefaultPrevented, 'down is default prevented');

        keyboard.keyDown('up');
        assert.ok(isDefaultPrevented, 'up is default prevented');

        keyboard.keyDown('space');
        assert.ok(isDefaultPrevented, 'space is default prevented');
    });

    test('keyboard navigation does not work in disabled widget', function(assert) {
        const items = [{ text: '0' }, { text: '1' }, { text: '2' }, { text: '3' }],
            $element = createRadioGroup({
                focusStateEnabled: true,
                items: items,
                disabled: true
            });

        assert.ok($element.attr('tabindex') === undefined, 'collection of radio group has not tabindex');
    });

    test('radio group items should not have tabIndex(T674238)', function(assert) {
        const items = [{ text: '0' }, { text: '1' }],
            $element = createRadioGroup({
                focusStateEnabled: true,
                items: items
            });

        const $items = $element.find('.' + RADIO_BUTTON_CLASS);
        assert.ok($items.eq(0).attr('tabindex') === undefined, 'items of radio group hasn\'t tabindex');
        assert.ok($items.eq(1).attr('tabindex') === undefined, 'items of radio group hasn\'t tabindex');
    });
});

if(devices.current().deviceType === 'desktop') {
    registerKeyHandlerTestHelper.runTests({
        createWidget: ($element, options) => $element.dxRadioGroup(
            $.extend({
                items: [{ text: 'text' }]
            }, options)).dxRadioGroup('instance'),
        checkInitialize: true });
}

module('focus policy', moduleConfig, () => {
    test('focused-state set up on radio group after focusing on any item', function(assert) {
        assert.expect(2);

        const $radioGroup = createRadioGroup({
                items: [1, 2, 3],
                focusStateEnabled: true
            }),
            radioGroup = getInstance($radioGroup),
            $firstRButton = $(radioGroup.itemElements()).first();

        assert.ok(!$radioGroup.hasClass(FOCUSED_CLASS), 'radio group is not focused');

        $radioGroup.focusin();
        $($firstRButton).trigger('dxpointerdown');

        assert.ok($radioGroup.hasClass(FOCUSED_CLASS), 'radio group was focused after focusing on item');
    });

    test('radioGroup item has not dx-state-focused class after radioGroup lose focus', function(assert) {
        assert.expect(2);

        const $radioGroup = createRadioGroup({
                items: [1, 2, 3],
                focusStateEnabled: true
            }),
            radioGroup = getInstance($radioGroup),
            $firstRButton = $(radioGroup.itemElements()).first();

        $radioGroup.focusin();
        $($firstRButton).trigger('dxpointerdown');

        assert.ok($firstRButton.hasClass(FOCUSED_CLASS), 'radioGroup item is focused');

        $radioGroup.focusout();

        assert.ok(!$firstRButton.hasClass(FOCUSED_CLASS), 'radio group item lost focus after focusout on radio group');
    });

    test('radioGroup item has not dx-state-focused class after radioGroup lose focus', function(assert) {
        assert.expect(2);

        const $radioGroup = createRadioGroup({
                items: [1, 2, 3],
                focusStateEnabled: true
            }),
            radioGroup = getInstance($radioGroup),
            $firstRButton = $(radioGroup.itemElements()).first();

        assert.ok(!$firstRButton.hasClass(FOCUSED_CLASS));

        $radioGroup.focusin();

        assert.ok($firstRButton.hasClass(FOCUSED_CLASS), 'radioGroup item is not focused');
    });

    test('radioGroup element should get \'dx-state-focused\' class', function(assert) {
        const $radioGroup = createRadioGroup({
            items: [1, 2, 3],
            focusStateEnabled: true
        });

        $radioGroup.focusin();

        assert.ok($radioGroup.hasClass(FOCUSED_CLASS), 'element got \'dx-state-focused\' class');
    });

    test('option \'accessKey\' has effect', function(assert) {
        const $radioGroup = createRadioGroup({
                items: [1, 2, 3],
                focusStateEnabled: true,
                accessKey: 'k'
            }),
            instance = getInstance($radioGroup);

        assert.equal($radioGroup.attr('accessKey'), 'k', 'access key is correct');

        instance.option('accessKey', 'o');
        assert.equal($radioGroup.attr('accessKey'), 'o', 'access key is correct after change');
    });

    test('option \'tabIndex\' has effect', function(assert) {
        const $radioGroup = createRadioGroup({
                items: [1, 2, 3],
                focusStateEnabled: true,
                tabIndex: 4
            }),
            instance = getInstance($radioGroup);

        assert.equal($radioGroup.attr('tabIndex'), 4, 'tab index is correct');
        instance.option('tabIndex', 7);
        assert.equal($radioGroup.attr('tabIndex'), 7, 'tab index is correct after change');
    });

    testInActiveWindow('the \'focus()\' method should set focused class to widget', function(assert) {
        const $radioGroup = createRadioGroup({
            focusStateEnabled: true
        });
        const instance = getInstance($radioGroup);

        instance.focus();
        assert.ok($radioGroup.hasClass('dx-state-focused'), 'widget got focused class');
    });
});

module('option changed', () => {
    test('items from the getDataSource method are wrong when the dataSource option is changed', function(assert) {
        const instance = getInstance(
            createRadioGroup({
                dataSource: [1, 2, 3]
            })
        );

        instance.option('dataSource', [4, 5, 6]);

        assert.deepEqual(instance.getDataSource().items(), [4, 5, 6], 'items from data source');
    });

    test('items from the getDataSource method are wrong when the dataSource option is changed if uses an instance of dataSource', function(assert) {
        const instance = getInstance(
            createRadioGroup({
                dataSource: new DataSource({ store: [1, 2, 3] })
            })
        );

        instance.option('dataSource', [4, 5, 6]);

        assert.deepEqual(instance.getDataSource().items(), [4, 5, 6], 'items from data source');
    });
});
