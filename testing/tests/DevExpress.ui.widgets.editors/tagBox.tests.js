import $ from 'jquery';
import { DataSource } from 'data/data_source/data_source';
import { isRenderer } from 'core/utils/type';
import { createTextElementHiddenCopy } from 'core/utils/dom';
import ajaxMock from '../../helpers/ajaxMock.js';
import config from 'core/config';
import dataQuery from 'data/query';
import devices from 'core/devices';
import errors from 'core/errors';
import dataErrors from 'data/errors';
import fx from 'animation/fx';
import keyboardMock from '../../helpers/keyboardMock.js';
import messageLocalization from 'localization/message';
import pointerMock from '../../helpers/pointerMock.js';
import ArrayStore from 'data/array_store';
import CustomStore from 'data/custom_store';
import ODataStore from 'data/odata/store';
import TagBox from 'ui/tag_box';
import getScrollRtlBehavior from 'core/utils/scroll_rtl_behavior';

import 'common.css!';
import 'generic_light.css!';

QUnit.testStart(() => {
    const markup =
        '<div id="tagBox"></div>\
         <div id="anotherContainer"></div>';

    $('#qunit-fixture').html(markup);
});

const LIST_CLASS = 'dx-list';
const LIST_ITEM_CLASS = 'dx-list-item';
const LIST_ITEM_SELECTED_CLASS = 'dx-list-item-selected';
const LIST_CKECKBOX_CLASS = 'dx-list-select-checkbox';
const SELECT_ALL_CLASS = 'dx-list-select-all';
const SELECT_ALL_CHECKBOX_CLASS = 'dx-list-select-all-checkbox';
const POPUP_DONE_BUTTON_CLASS = 'dx-popup-done';
const TEXTBOX_CLASS = 'dx-texteditor-input';
const EMPTY_INPUT_CLASS = 'dx-texteditor-empty';
const TAGBOX_TAG_CONTAINER_CLASS = 'dx-tag-container';
const TAGBOX_TAG_CONTENT_CLASS = 'dx-tag-content';
const TAGBOX_TAG_CLASS = 'dx-tag';
const TAGBOX_MULTI_TAG_CLASS = 'dx-tagbox-multi-tag';
const TAGBOX_TAG_REMOVE_BUTTON_CLASS = 'dx-tag-remove-button';
const TAGBOX_SINGLE_LINE_CLASS = 'dx-tagbox-single-line';
const TAGBOX_POPUP_WRAPPER_CLASS = 'dx-tagbox-popup-wrapper';
const TAGBOX_DEFAULT_FIELD_TEMPLATE_CLASS = 'dx-tagbox-default-template';
const TAGBOX_CUSTOM_FIELD_TEMPLATE_CLASS = 'dx-tagbox-custom-template';
const FOCUSED_CLASS = 'dx-state-focused';
const TAGBOX_MOUSE_WHEEL_DELTA_MULTIPLIER = -0.3;
const KEY_ENTER = 'Enter';
const KEY_DOWN = 'ArrowDown';
const KEY_SPACE = ' ';
const CLEAR_BUTTON_AREA = 'dx-clear-button-area';

const TIME_TO_WAIT = 500;

const getList = (tagBox) => {
    return tagBox._$list;
};

const moduleSetup = {
    beforeEach: function() {
        TagBox.defaultOptions({ options: { deferRendering: false } });
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
};

QUnit.module('rendering', moduleSetup, () => {
    QUnit.test('popup wrapper gets the \'dx-tagbox-popup-wrapper\' class', function(assert) {
        $('#tagBox').dxTagBox({
            opened: true
        }).dxTagBox('instance');

        const $popupWrapper = $('.dx-popup-wrapper').eq(0);
        assert.ok($popupWrapper.hasClass(TAGBOX_POPUP_WRAPPER_CLASS), 'the class is added');
    });

    QUnit.test('empty class should be added if no one tags selected', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3]
        });

        const tagBox = $tagBox.dxTagBox('instance');

        tagBox.option('value', [1, 2]);
        assert.ok(!$tagBox.hasClass(EMPTY_INPUT_CLASS), 'empty class not present');
        tagBox.option('value', []);
        assert.ok($tagBox.hasClass(EMPTY_INPUT_CLASS), 'empty class present');
    });

    QUnit.test('skip gesture event class attach only when popup is opened', function(assert) {
        const SKIP_GESTURE_EVENT_CLASS = 'dx-skip-gesture-event';
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3]
        });

        assert.equal($tagBox.hasClass(SKIP_GESTURE_EVENT_CLASS), false, 'skip gesture event class was not added when popup is closed');

        $tagBox.dxTagBox('option', 'opened', true);
        assert.equal($tagBox.hasClass(SKIP_GESTURE_EVENT_CLASS), true, 'skip gesture event class was added after popup was opened');

        $tagBox.dxTagBox('option', 'opened', false);
        assert.equal($tagBox.hasClass(SKIP_GESTURE_EVENT_CLASS), false, 'skip gesture event class was removed after popup was closed');
    });
});

QUnit.module('select element', () => {
    QUnit.test('the select element should be invisible', function(assert) {
        const $select = $('#tagBox').dxTagBox()
            .find('select');

        assert.notOk($select.is(':visible'), 'select in not visible');
    });

    QUnit.test('option elements should be updated on value change', function(assert) {
        const items = [{ id: 1, text: 'eins' }, { id: 2, text: 'zwei' }, { id: 3, text: 'drei' }];
        const initialValue = [1];
        const newValue = [2, 3];

        const $tagBox = $('#tagBox').dxTagBox({
            items,
            value: initialValue,
            valueExpr: 'id',
            displayExpr: 'text'
        });

        const instance = $tagBox.dxTagBox('instance');

        instance.option('value', newValue);

        const $options = $tagBox.find('option');
        assert.equal($options.length, 2, 'options are updated');

        $options.each(function(index) {
            assert.equal(this.value, newValue[index], 'the \'value\' attribute is correct for the option ' + index);
        });
    });

    QUnit.test('unselect item with value \'0\'', function(assert) {
        const items = [{ id: 0, text: 'eins' }, { id: 1, text: 'zwei' }, { id: 2, text: 'drei' }];
        const value = [0, 1];
        const $tagBox = $('#tagBox');

        const tagBoxInstance = $tagBox
            .dxTagBox({
                items,
                value,
                valueExpr: 'id',
                displayExpr: 'text'
            }).dxTagBox('instance');

        $tagBox
            .find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`)
            .first()
            .trigger('dxclick');

        assert.deepEqual(tagBoxInstance.option('value'), [1]);
    });
});

QUnit.module('list selection', moduleSetup, () => {
    QUnit.test('selected item class', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 4]
        });

        this.clock.tick(TIME_TO_WAIT);
        const $listItems = $tagBox.find(`.${LIST_ITEM_CLASS}`);

        assert.equal($listItems.eq(0).hasClass(LIST_ITEM_SELECTED_CLASS), true, 'first item has selected class');
        assert.equal($listItems.eq(1).hasClass(LIST_ITEM_SELECTED_CLASS), false, 'second item does not have selected class');
        assert.equal($listItems.eq(2).hasClass(LIST_ITEM_SELECTED_CLASS), false, 'third item does not have selected class');
        assert.equal($listItems.eq(3).hasClass(LIST_ITEM_SELECTED_CLASS), true, 'fourth item has selected class');
    });

    QUnit.test('Selected item should be unselected on click', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: [1, 2, 3],
            value: [1, 2],
            opened: true
        });

        const tagBox = $tagBox.dxTagBox('instance');
        const $list = getList(tagBox);

        $($list.find('.' + LIST_ITEM_SELECTED_CLASS).eq(0)).trigger('dxclick');
        assert.deepEqual(tagBox.option('value'), [2], 'value is correct');
    });

    QUnit.test('Selected item should be removed from list if \'hideSelectedItems\' option is true', function(assert) {
        const dataSource = [1, 2, 3, 4, 5];

        const $tagBox = $('#tagBox').dxTagBox({
            dataSource,
            opened: true,
            hideSelectedItems: true
        });

        const tagBox = $tagBox.dxTagBox('instance');
        const $list = getList(tagBox);

        assert.equal($list.find(`.${LIST_ITEM_CLASS}`).length, dataSource.length, 'items count is correct');

        tagBox.open();
        $($list.find('.dx-list-item').eq(0)).trigger('dxclick');
        assert.equal($list.find(`.${LIST_ITEM_CLASS}`).length, dataSource.length - 1, 'items count is correct after the first item selection');

        tagBox.open();
        $($list.find('.dx-list-item').eq(0)).trigger('dxclick');
        assert.equal($list.find(`.${LIST_ITEM_CLASS}`).length, dataSource.length - 2, 'items count is correct after the second item selection');

        tagBox.open();
        $($list.find('.dx-list-item').eq(0)).trigger('dxclick');
        assert.equal($list.find(`.${LIST_ITEM_CLASS}`).length, dataSource.length - 3, 'items count is correct after the third item selection');

        tagBox.open();
        $($tagBox.find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`).eq(0)).trigger('dxclick');
        assert.equal($list.find(`.${LIST_ITEM_CLASS}`).length, dataSource.length - 2, 'items count is correct after the first tag is removed');

        tagBox.open();
        $($tagBox.find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`).eq(0)).trigger('dxclick');
        assert.equal($list.find(`.${LIST_ITEM_CLASS}`).length, dataSource.length - 1, 'items count is correct after the second tag is removed');
    });

    QUnit.test('Selected item should be removed from list if "hideSelectedItems" option is true and minSearchLength > 0 (T951777)', function(assert) {
        const dataSource = [1, 11];

        const $tagBox = $('#tagBox').dxTagBox({
            dataSource,
            value: [1],
            hideSelectedItems: true,
            searchEnabled: true,
            minSearchLength: 1
        });

        const tagBox = $tagBox.dxTagBox('instance');
        const $list = getList(tagBox);
        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard.type('1');
        this.clock.tick(TIME_TO_WAIT);
        assert.strictEqual($list.find(`.${LIST_ITEM_CLASS}`).length, 1, 'items count is correct after the first item selection');

        $($tagBox.find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`).eq(0)).trigger('dxclick');
        assert.equal($list.find(`.${LIST_ITEM_CLASS}`).length, 2, 'items count is correct after the first tag is removed');
    });

    QUnit.test('Selected item tag should be correct if hideSelectedItems is set (T580639)', function(assert) {
        const dataSource = [{
            'ID': 1,
            'Name': 'Item 1'
        }, {
            'ID': 2,
            'Name': 'Item 2'
        }];

        const $tagBox = $('#tagBox').dxTagBox({
            dataSource,
            opened: true,
            hideSelectedItems: true,
            displayExpr: 'Name',
            valueExpr: 'ID',
        });

        const tagBox = $tagBox.dxTagBox('instance');
        const $list = getList(tagBox);

        $($list.find('.dx-list-item').eq(0)).trigger('dxclick');

        assert.equal($tagBox.find('.' + TAGBOX_TAG_CLASS).eq(0).text(), 'Item 1', 'tag is correct after selection');

        $($list.find('.dx-list-item').eq(0)).trigger('dxclick');

        assert.equal($tagBox.find('.' + TAGBOX_TAG_CLASS).eq(0).text(), 'Item 1', 'tag is correct after selection');
        assert.equal($tagBox.find('.' + TAGBOX_TAG_CLASS).eq(1).text(), 'Item 2', 'tag is correct after selection');
    });

    QUnit.test('Items should be hidden on init if hideSelectedItems is true', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3, 4, 5],
            opened: true,
            hideSelectedItems: true,
            value: [1, 2, 3]
        });

        const tagBox = $tagBox.dxTagBox('instance');

        assert.equal(tagBox._list.option('items').length, 2, 'items was restored');
    });

    QUnit.test('Items should not be changed if one of them is hidden', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3, 4, 5],
            opened: true,
            hideSelectedItems: true,
            onValueChanged(e) {
                e.component.option('items', e.component.option('items'));
            }
        });

        const tagBox = $tagBox.dxTagBox('instance');

        tagBox.option('value', [1, 2, 3]);
        tagBox.option('value', []);

        assert.equal(tagBox.option('items').length, 5, 'items was restored');
    });

    QUnit.test('added and removed items should be correct with hideSelecterdItems option and dataSource (T589590)', function(assert) {
        const spy = sinon.spy();

        const tagBox = $('#tagBox').dxTagBox({
            dataSource: [1, 2, 3],
            opened: true,
            hideSelectedItems: true,
            onSelectionChanged: spy
        }).dxTagBox('instance');

        const content = tagBox.content();
        let $item = $(content).find(`.${LIST_ITEM_CLASS}`).eq(0);

        $item.trigger('dxclick');
        assert.deepEqual(spy.args[1][0].addedItems, [1], 'added items is correct');
        assert.deepEqual(spy.args[1][0].removedItems, [], 'removed items is empty');

        $item = $(content).find(`.${LIST_ITEM_CLASS}`).eq(1);
        $item.trigger('dxclick');
        assert.deepEqual(spy.args[2][0].addedItems, [3], 'added items is correct');
        assert.deepEqual(spy.args[2][0].removedItems, [], 'removed items is empty');
    });

    QUnit.test('selected items should be correct after item click with hideSelecterdItems option (T606462)', function(assert) {
        const tagBox = $('#tagBox').dxTagBox({
            dataSource: [1, 2, 3],
            value: [1],
            opened: true,
            hideSelectedItems: true
        }).dxTagBox('instance');

        const content = tagBox.content();
        const $item = $(content).find(`.${LIST_ITEM_CLASS}`).eq(0);

        $item.trigger('dxclick');

        assert.deepEqual(tagBox.option('selectedItems'), [1, 2], 'selected items are correct');
    });
});

QUnit.module('tags', moduleSetup, () => {
    QUnit.test('add/delete tags', function(assert) {
        const items = [1, 2, 3];

        const $element = $('#tagBox').dxTagBox({
            items
        });

        this.clock.tick(TIME_TO_WAIT);
        assert.strictEqual($element.find(`.${LIST_ITEM_CLASS}`).length, 3, 'found 3 items');

        $($element.find(`.${LIST_ITEM_CLASS}`).first()).trigger('dxclick');
        assert.equal($element.find('.' + TAGBOX_TAG_CLASS).length, 1, 'tag is added');

        $($element.find(`.${LIST_ITEM_CLASS}`).first()).trigger('dxclick');
        assert.equal($element.find('.' + TAGBOX_TAG_CLASS).length, 0, 'tag is removed');

        $($element.find(`.${LIST_ITEM_CLASS}`).last()).trigger('dxclick');
        assert.equal($element.find('.' + TAGBOX_TAG_CLASS).length, 1, 'another tag is added');

        const $close = $element.find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`).last();
        $($close).trigger('dxclick');
        assert.equal($element.find('.' + TAGBOX_TAG_CLASS).length, 0, 'tag is removed');
    });

    QUnit.test('tags should remove after clear values', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: [1, 2, 3],
            value: [1]
        });

        assert.equal($tagBox.find('.dx-tag').length, 1, 'one item rendered');

        $tagBox.dxTagBox('option', 'value', []);
        assert.equal($tagBox.find('.dx-tag').length, 0, 'zero item rendered');
    });

    QUnit.testInActiveWindow('tags should not be rerendered when editor looses focus', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            focusStateEnabled: true
        });

        const tagBox = $tagBox.dxTagBox('instance');

        const renderTagsStub = sinon.stub(tagBox, '_renderTags');

        $($tagBox.find(`.${TEXTBOX_CLASS}`)).trigger('focusin');
        $($tagBox.find(`.${TEXTBOX_CLASS}`)).trigger('focusout');

        assert.equal(renderTagsStub.callCount, 0, 'tags weren\'t rerendered');
    });

    QUnit.test('tagBox field is not cleared on blur', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            value: [1]
        });

        this.clock.tick(TIME_TO_WAIT);
        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
        $($input).trigger('dxclick');
        $($input).trigger('blur');

        const $tags = $tagBox.find('.' + TAGBOX_TAG_CONTENT_CLASS);
        assert.equal($tags.is(':visible'), true, 'tag is rendered');
    });

    QUnit.test('list item with zero value should be selectable', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [0, 1, 2, 3],
            opened: true
        });

        this.clock.tick(TIME_TO_WAIT);

        const $listItems = $(`.${LIST_ITEM_CLASS}`);
        $($listItems.eq(0)).trigger('dxclick');
        $($listItems.eq(1)).trigger('dxclick');

        assert.equal($.trim($tagBox.find('.' + TAGBOX_TAG_CONTAINER_CLASS).text()), '01', 'selected first and second items');
    });

    QUnit.test('\'text\' option should have correct value when item value is zero', function(assert) {
        const tagBox = $('#tagBox').dxTagBox({
            value: [0],
            items: [0, 1]
        }).dxTagBox('instance');

        assert.equal(tagBox.option('text'), '0');
    });

    QUnit.test('tag should have correct value when item value is an empty string', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: ['', 1, 2, 3],
            opened: true
        });

        this.clock.tick(TIME_TO_WAIT);

        const $listItems = $(`.${LIST_ITEM_CLASS}`);
        $($listItems.eq(0)).trigger('dxclick');

        assert.equal($tagBox.find('.' + TAGBOX_TAG_CLASS).length, 1, 'empty string value was successfully selected');
    });

    QUnit.test('TagBox has right content after items setting', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            value: [1],
            valueExpr: 'id',
            displayExpr: 'name'
        });

        const instance = $tagBox.dxTagBox('instance');
        instance.option('items', [{ id: 1, name: 'First' }, { id: 2, name: 'Second' }]);

        const content = $tagBox.find('.' + TAGBOX_TAG_CONTENT_CLASS);
        assert.equal(content.text(), 'First', 'tags has right content');
    });

    QUnit.test('TagBox has right tag order if byKey return value in wrong order', function(assert) {
        const data = [1, 2];
        const timeToWait = 500;
        let count = 2;

        const $tagBox = $('#tagBox').dxTagBox({
            value: [1, 2],
            dataSource: new DataSource({
                store: new CustomStore({
                    load(options) {
                        const res = $.Deferred();
                        setTimeout(() => {
                            res.resolve(data);
                        }, timeToWait * 4);
                        return res.promise();
                    },
                    byKey(key) {
                        const res = $.Deferred();
                        setTimeout(() => {
                            res.resolve(key);
                        }, timeToWait * count--);
                        return res.promise();
                    }
                }),
                paginate: false
            })
        });
        this.clock.tick(timeToWait * 4);

        const content = $tagBox.find('.' + TAGBOX_TAG_CONTENT_CLASS);
        assert.equal(content.eq(0).text(), '1', 'first tag has right content');
        assert.equal(content.eq(1).text(), '2', 'second tag has right content');
    });

    QUnit.test('removing tags after clicking the \'clear\' button', function(assert) {
        const $element = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            showClearButton: true,
            opened: true
        });

        const $listItems = $(`.${LIST_ITEM_CLASS}`);

        $($listItems.eq(0)).trigger('dxclick');
        $($listItems.eq(1)).trigger('dxclick');
        $($element.find('.dx-clear-button-area')).trigger('dxclick');
        $($listItems.eq(2)).trigger('dxclick');

        assert.equal($element.find('.' + TAGBOX_TAG_CLASS).length, 1, 'one item is chosen');
    });

    QUnit.test('clear button should save valueChangeEvent', function(assert) {
        const valueChangedHandler = sinon.spy();

        const $element = $('#tagBox').dxTagBox({
            items: [1],
            showClearButton: true,
            value: [1],
            onValueChanged: valueChangedHandler
        });

        const $clearButton = $element.find('.dx-clear-button-area');
        $clearButton.trigger('dxclick');

        assert.equal(valueChangedHandler.callCount, 1, 'valueChangedHandler has been called');
        assert.equal(valueChangedHandler.getCall(0).args[0].event.type, 'dxclick', 'event is correct');
    });

    QUnit.test('clear button should also clear the input value', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1],
            showClearButton: true,
            searchEnabled: true,
            value: ['1']
        });

        const $input = $tagBox.find('.dx-texteditor-input');
        const keyboard = keyboardMock($input);

        keyboard.type('123');

        $tagBox
            .find('.dx-clear-button-area')
            .trigger('dxclick');

        assert.equal($tagBox.find('.' + TAGBOX_TAG_CLASS).length, 0, 'tags are cleared');
        assert.equal($input.val(), '', 'input is also cleared');
    });

    QUnit.test('clear button should have sizes similar as the other editors have', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            showClearButton: true,
            dataSource: ['1'],
            value: ['1']
        });

        const $textBox = $('#anotherContainer').dxTextBox({
            mode: 'number',
            value: '1',
            showClearButton: true
        });

        const clearButtonAreaSelector = `.${CLEAR_BUTTON_AREA}`;
        const textBoxClearButtonWidth = $textBox.find(clearButtonAreaSelector).width();
        const tagBoxClearButtonWidth = $tagBox.find(clearButtonAreaSelector).width();

        assert.equal(tagBoxClearButtonWidth, textBoxClearButtonWidth, 'clear button\'s width is ok');
    });

    QUnit.test('Tag should have empty text if display value is empty', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [{ name: '', value: 1 }, { name: 'two', value: 2 }],
            displayExpr: 'name',
            valueExpr: 'value',
            value: [1]
        });

        const $tag = $tagBox.find('.' + TAGBOX_TAG_CLASS);
        assert.equal($tag.text(), '', 'tag has empty text');
    });

    QUnit.test('Tag should have correct text if display value is \'0\'', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [{ name: 0, value: 1 }, { name: 'two', value: 2 }],
            displayExpr: 'name',
            valueExpr: 'value',
            value: [1]
        });

        const $tag = $tagBox.find('.' + TAGBOX_TAG_CLASS);
        assert.equal($tag.text(), 0, 'tag has correct text');
    });

    QUnit.test('Tag should have correct text if display value is \'null\'', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [{ name: null, value: 1 }, { name: 'two', value: 2 }],
            displayExpr: 'name',
            valueExpr: 'value',
            value: [1]
        });

        const $tag = $tagBox.find('.' + TAGBOX_TAG_CLASS);
        assert.equal($tag.text(), '', 'tag has correct text');
    });

    QUnit.test('Tag should repaint tags on \'repaint\' if dataSource is reloaded (T873372)', function(assert) {
        let items = [{ name: 'one', value: 1 }, { name: 'two', value: 2 }];
        const dataSource = new DataSource({
            store: new CustomStore({
                key: 'value',
                load: function() {
                    const deferred = $.Deferred();
                    deferred.resolve(items);
                    return deferred.promise();
                }
            }),
            paginate: true
        });
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource,
            displayExpr: 'name',
            valueExpr: 'value',
            value: [1]
        });
        const tagBox = $tagBox.dxTagBox('instance');
        this.clock.tick();
        items = [{ name: 'updated', value: 1 }];
        dataSource.reload();
        tagBox.repaint();

        const $tag = $tagBox.find('.' + TAGBOX_TAG_CLASS);
        assert.equal($tag.text(), 'updated', 'tag has updated text');
    });

    QUnit.test('onValueChanged has dxclick event on remove button click', function(assert) {
        const $element = $('#tagBox').dxTagBox({
            value: ['123'],
            onValueChanged: function(e) {
                assert.equal(e.event.type, 'dxclick', 'correct event type');
                assert.deepEqual(e.event.target, $removeButton.get(0), 'correct target element');
            }
        });

        const $removeButton = $element.find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`).last();
        $($removeButton).trigger('dxclick');
    });
});

QUnit.module('multi tag support', {
    beforeEach: function() {
        this.getTexts = $tags => {
            return $tags.map((_, tag) => {
                return $(tag).text();
            }).toArray();
        };
        this.clock = sinon.useFakeTimers();
        messageLocalization.load({
            'en': {
                'dxTagBox-seleced': '{0} selected',
                'dxTagBox-moreSeleced': '{0} more'
            }
        });
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    QUnit.test('tagBox should display one tag after new tags was added', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2, 4],
            maxDisplayedTags: 2
        });

        const tagBox = $tagBox.dxTagBox('instance');

        tagBox.option('value', [1, 2]);
        tagBox.option('value', [1, 2, 3]);

        const $tag = $tagBox.find('.' + TAGBOX_TAG_CLASS);

        assert.equal($tag.length, 1, 'only one tag should be displayed');
        assert.ok($tag.hasClass(TAGBOX_MULTI_TAG_CLASS), 'the tag has correct css class');
        assert.equal($tag.text(), '3 selected', 'tag has correct text');
    });

    QUnit.test('tagBox should display multiple tags after value was changed', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2, 4],
            maxDisplayedTags: 2
        });

        const tagBox = $tagBox.dxTagBox('instance');

        tagBox.option('value', [1, 2]);

        const $tag = $tagBox.find('.' + TAGBOX_TAG_CLASS);
        assert.equal($tag.length, 2, 'two tags should be displayed');
        assert.deepEqual(this.getTexts($tag), ['1', '2'], 'tags have correct text');
    });

    QUnit.test('multi tag should work with data expressions', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [{ id: 1, name: 'item 1' }, { id: 2, name: 'item 2' }, { id: 3, name: 'item 3' }],
            value: [1, 2, 3],
            displayExpr: 'name',
            valueExpr: 'id',
            maxDisplayedTags: 2
        });

        const $tag = $tagBox.find('.' + TAGBOX_TAG_CLASS);
        assert.deepEqual(this.getTexts($tag), ['3 selected'], 'multi tag works');
    });

    QUnit.test('tagBox should deselect all items after multi tag removed', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2, 4],
            maxDisplayedTags: 2
        });

        const tagBox = $tagBox.dxTagBox('instance');
        const $tagRemoveButton = $tagBox.find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`).eq(0);

        $($tagRemoveButton).trigger('dxclick');

        assert.deepEqual(tagBox.option('value'), [], 'value was cleared');
        assert.deepEqual(tagBox.option('selectedItems'), [], 'selectedItems was cleared');
        assert.strictEqual(tagBox.option('selectedItem'), null, 'selectedItem was cleared');
        assert.strictEqual(tagBox.option('selectedIndex'), undefined, 'selectedIndex was cleared');
        assert.strictEqual($tagBox.find('.' + TAGBOX_TAG_CLASS).length, 0, 'there are no tags in the field');
    });

    QUnit.test('tags should be recalculated after maxDisplayedTags option changed', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2, 4]
        });

        const tagBox = $tagBox.dxTagBox('instance');

        assert.equal($tagBox.find('.' + TAGBOX_TAG_CLASS).length, 3, '3 tags by default');

        tagBox.option('maxDisplayedTags', 2);
        assert.equal($tagBox.find('.' + TAGBOX_TAG_CLASS).length, 1, '1 tag when limit is over');

        tagBox.option('maxDisplayedTags', 3);
        assert.equal($tagBox.find('.' + TAGBOX_TAG_CLASS).length, 3, '3 tags when limit is not over');

        tagBox.option('value', [1, 2, 3, 4]);
        tagBox.option('maxDisplayedTags', undefined);
        assert.equal($tagBox.find('.' + TAGBOX_TAG_CLASS).length, 4, '4 tags when option was disabled');
    });

    QUnit.test('onMultiTagPreparing option change', function(assert) {
        assert.expect(4);

        const onMultiTagPreparing = e => {
            assert.equal(e.component.NAME, 'dxTagBox', 'component is correct');
            assert.ok($(e.multiTagElement).hasClass(TAGBOX_MULTI_TAG_CLASS), 'element is correct');
            assert.deepEqual(e.selectedItems, [1, 2, 4], 'selectedItems are correct');
            e.text = 'custom text';
        };

        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2, 4],
            maxDisplayedTags: 2
        });

        const tagBox = $tagBox.dxTagBox('instance');

        tagBox.option('onMultiTagPreparing', onMultiTagPreparing);

        const $tag = $tagBox.find('.' + TAGBOX_TAG_CLASS);
        assert.deepEqual($tag.text(), 'custom text', 'custom text is displayed');
    });

    QUnit.test('multitagPreparing event test', function(assert) {
        assert.expect(4);

        const onMultiTagPreparing = e => {
            assert.equal(e.component.NAME, 'dxTagBox', 'component is correct');
            assert.ok($(e.multiTagElement).hasClass(TAGBOX_MULTI_TAG_CLASS), 'element is correct');
            assert.deepEqual(e.selectedItems, [1, 2, 4], 'selectedItems are correct');
            e.text = 'custom text';
        };
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3, 4],
            maxDisplayedTags: 2
        });
        const tagBox = $tagBox.dxTagBox('instance');

        tagBox.on('multiTagPreparing', onMultiTagPreparing);
        tagBox.option('value', [1, 2, 4]);

        const $tag = $tagBox.find('.' + TAGBOX_TAG_CLASS);
        assert.deepEqual($tag.text(), 'custom text', 'custom text is displayed');
    });

    QUnit.test('tags should be rerendered after showMultiTagOnly option changed', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2, 4],
            maxDisplayedTags: 2,
            showMultiTagOnly: false
        });

        const tagBox = $tagBox.dxTagBox('instance');

        tagBox.option('showMultiTagOnly', true);

        const $tag = $tagBox.find('.' + TAGBOX_TAG_CLASS);

        assert.equal($tag.length, 1, '1 tag rendered');
        assert.deepEqual($tag.text(), '3 selected', 'text is correct');
    });

    QUnit.test('multi tag should deselect overflow tags only when showMultiTagOnly is false', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2, 4],
            maxDisplayedTags: 2,
            showMultiTagOnly: false
        });

        const tagBox = $tagBox.dxTagBox('instance');
        const $multiTag = $tagBox.find('.' + TAGBOX_MULTI_TAG_CLASS);

        $($multiTag.find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`)).trigger('dxclick');

        assert.equal($tagBox.find('.' + TAGBOX_TAG_CLASS).length, 2, 'only 2 tags remain');
        assert.deepEqual(tagBox.option('value'), [1, 2], 'value is correct');
        assert.deepEqual(this.getTexts($tagBox.find('.' + TAGBOX_TAG_CLASS)), ['1', '2'], 'tags have correct text');
    });

    QUnit.test('only one multi tag should be rendered when selectAll checked and value changind on runtime', function(assert) {
        let suppressSelectionChanged = false;

        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2],
            value: [1, 2],
            maxDisplayedTags: 1,
            onSelectionChanged(e) {
                if(!suppressSelectionChanged) {
                    suppressSelectionChanged = true;
                    e.component.option('value', e.removedItems.length > 0 ? e.removedItems : e.addedItems);
                }
            }
        });

        const $multiTag = $tagBox.find('.' + TAGBOX_MULTI_TAG_CLASS);

        assert.equal($multiTag.length, 1, 'only 1 tag rendered');
    });

    QUnit.test('tagbox should show count of selected items when only first page is loaded', function(assert) {
        const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: {
                store: new ArrayStore(items),
                paginate: true,
                pageSize: 5
            },
            maxDisplayedTags: 2,
            opened: true,
            selectAllMode: 'page',
            showSelectionControls: true
        });

        $('.dx-list-select-all-checkbox').trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT);

        assert.equal($tagBox.dxTagBox('option', 'value').length, 5, 'first page is selected');
        assert.equal($tagBox.find('.' + TAGBOX_MULTI_TAG_CLASS).text(), '5 selected', 'text is correct');
    });

    QUnit.test('TagBox should correctly process the rejected load promise of the dataSource', function(assert) {
        const dataErrorStub = sinon.stub(dataErrors.errors, 'log');
        const $editor = $('#tagBox').dxTagBox({
            dataSource: {
                store: new CustomStore({
                    load: function(loadOptions) {
                        const deferred = $.Deferred();
                        setTimeout(() => {
                            if(loadOptions.filter) {
                                deferred.reject({
                                    type: 'error',
                                    message: 'data load error'
                                });
                            } else {
                                deferred.resolve([1, 2, 3]);
                            }
                        }, 100);
                        return deferred.promise();
                    }
                })
            },
            showSelectionControls: true,
            searchEnabled: true,
            maxDisplayedTags: 1,
            showMultiTagOnly: false,
            opened: true
        });
        const $input = $editor.find('.dx-texteditor-input');
        const keyboard = keyboardMock($input);

        this.clock.tick(100);
        keyboard.type('t');
        this.clock.tick(100);

        $('.dx-list-select-checkbox').each((i, elem) => {
            $(elem).trigger('dxclick');
            this.clock.tick(100);
        });

        const tagCount = $editor.find('.dx-tag').length;
        assert.strictEqual(tagCount, 1, 'There is only one tag');
        dataErrorStub.restore();
    });
});

QUnit.module('the \'value\' option', moduleSetup, () => {
    QUnit.test('value should be passed by value (not by reference)', function(assert) {
        const value = ['item1'];
        const $tagBox = $('#tagBox').dxTagBox({
            items: ['item1', 'item2'],
            value
        });

        $($tagBox.find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`)).trigger('dxclick');

        assert.deepEqual(value, ['item1'], 'outer value is not changed');
    });

    QUnit.test('reset()', function(assert) {
        const tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            value: [1]
        }).dxTagBox('instance');

        tagBox.reset();
        assert.deepEqual(tagBox.option('value'), [], 'Value should be reset');
    });

    QUnit.test('displayExpr change at runtime', function(assert) {
        const items = [{ name: 'one', value: 1 },
            { name: 'two', value: 2 }];

        const $element = $('#tagBox')
            .dxTagBox({
                items,
                displayExpr: 'value',
                valueExpr: 'value'
            });

        const instance = $element.dxTagBox('instance');

        instance.option('value', [1]);
        instance.option('displayExpr', 'name');
        const $tag = $element.find('.' + TAGBOX_TAG_CONTENT_CLASS);
        assert.equal($tag.text(), 'one', 'tag render displayValue');
    });
});

QUnit.module('the \'onValueChanged\' option', moduleSetup, () => {
    QUnit.test('onValueChanged provides selected values', function(assert) {
        let value;

        const $element = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            onValueChanged(args) {
                value = args.value;
            }
        });

        this.clock.tick(TIME_TO_WAIT);

        $($element.find(`.${LIST_ITEM_CLASS}`).eq(0)).trigger('dxclick');
        assert.deepEqual(value, [1], 'only first item is selected');

        $($element.find(`.${LIST_ITEM_CLASS}`).eq(2)).trigger('dxclick');
        assert.deepEqual(value, [1, 3], 'two items are selected');
    });

    QUnit.test('onValueChanged should not be fired on first render', function(assert) {
        const valueChangeActionSpy = sinon.spy();
        $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            value: [1],
            onValueChanged: valueChangeActionSpy
        });

        this.clock.tick(TIME_TO_WAIT);

        assert.equal(valueChangeActionSpy.called, false, 'onValueChanged was not fired');
    });

    QUnit.test('onValueChanged should not be fired on first popup render (T838251)', function(assert) {
        const data = [{
            id: 1,
            name: 'First'
        }, {
            id: 2,
            name: 'Second'
        }, {
            id: 3,
            name: 'Third'
        }];
        const valueChangeActionSpy = sinon.spy();
        const instance = $('#tagBox').dxTagBox({
            dataSource: new DataSource({
                store: new CustomStore({
                    key: 'id',
                    load() {
                        const res = $.Deferred();
                        setTimeout(() => {
                            res.resolve(data);
                        }, TIME_TO_WAIT / 4);
                        return res.promise();
                    },
                    byKey(key) {
                        const res = $.Deferred();
                        setTimeout(() => {
                            res.resolve(key);
                        }, TIME_TO_WAIT / 4);
                        return res.promise();
                    }
                }),
                paginate: false
            }),
            displayExpr: 'name',
            valueExpr: 'id',
            value: [2, 3],
            onValueChanged: valueChangeActionSpy,
            showSelectionControls: true
        }).dxTagBox('instance');

        instance.open();
        this.clock.tick(TIME_TO_WAIT);

        assert.equal(valueChangeActionSpy.called, false, 'onValueChanged was not fired');
    });

    QUnit.test('onValueChanged should be fired when dxTagBox is readOnly', function(assert) {
        const valueChangeActionSpy = sinon.spy();

        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            value: [1],
            readOnly: true,
            onValueChanged: valueChangeActionSpy
        });

        $tagBox.dxTagBox('instance').option('value', [3]);

        assert.ok(valueChangeActionSpy.called, 'onValueChanged was fired');
    });

    QUnit.test('onValueChanged should be fired when dxTagBox is disabled', function(assert) {
        const valueChangeActionSpy = sinon.spy();

        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            value: [1],
            disabled: true,
            onValueChanged: valueChangeActionSpy
        });

        $tagBox.dxTagBox('instance').option('value', []);

        assert.ok(valueChangeActionSpy.called, 'onValueChanged was fired');
    });

    QUnit.test('onValueChanged provide selected value after removing values', function(assert) {
        let value;

        const $element = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            onValueChanged(args) {
                value = args.value;
            }
        });

        this.clock.tick(TIME_TO_WAIT);
        $($element.find(`.${LIST_ITEM_CLASS}`).eq(0)).trigger('dxclick');
        $($element.find(`.${LIST_ITEM_CLASS}`).eq(2)).trigger('dxclick');
        $($element.find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`).eq(0)).trigger('dxclick');

        assert.deepEqual(value, [3], 'item is deleted');
    });

    QUnit.test('T338728 - onValueChanged action should contain correct previousValues', function(assert) {
        const spy = sinon.spy();

        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            value: [1, 2],
            onValueChanged: spy
        });

        const tagBox = $tagBox.dxTagBox('instance');

        tagBox.option('value', [2]);
        assert.deepEqual(spy.args[0][0].previousValue, [1, 2], 'the \'previousValue\' argument is correct');
    });

    QUnit.test('onValueChanged should not be fired on the \'backspace\' key press if the editor is already empty (T385450)', function(assert) {
        const spy = sinon.spy();

        const $tagBox = $('#tagBox').dxTagBox({
            onValueChanged: spy
        });

        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);

        keyboardMock($input).press('backspace');
        assert.notOk(spy.called, 'onValueChanged is not fired');
    });
});

QUnit.module('the \'onCustomItemCreating\' option', moduleSetup, () => {
    QUnit.test('using the \'onCustomItemCreating\' option should throw a warning if handler returns an item', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            acceptCustomValue: true,
            displayExpr: 'display',
            valueExpr: 'value',
            onCustomItemCreating(e) {
                return {
                    display: 'display ' + e.text,
                    value: 'value ' + e.text
                };
            }
        });

        const $input = $tagBox.find('.dx-texteditor-input');
        const keyboard = keyboardMock($input);
        const customValue = 'Custom value';
        const logStub = sinon.stub(errors, 'log');

        keyboard
            .type(customValue)
            .press('enter');

        const $tags = $tagBox.find('.dx-tag');

        assert.deepEqual($tagBox.dxTagBox('option', 'value'), ['value ' + customValue]);
        assert.equal($tags.length, 1, 'tag is added');
        assert.equal($tags.eq(0).text(), 'display ' + customValue);
        assert.ok(logStub.calledOnce, 'There was an one message');
        assert.deepEqual(logStub.firstCall.args, ['W0015', 'onCustomItemCreating', 'customItem'], 'Check warning parameters');
        logStub.restore();
    });

    QUnit.test('creating custom item via the \'customItem\' event parameter', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            acceptCustomValue: true,
            displayExpr: 'display',
            valueExpr: 'value',
            onCustomItemCreating(e) {
                e.customItem = {
                    display: 'display ' + e.text,
                    value: 'value ' + e.text
                };
            }
        });

        const $input = $tagBox.find('.dx-texteditor-input');
        const keyboard = keyboardMock($input);
        const customValue = 'Custom value';

        keyboard
            .type(customValue)
            .press('enter');

        const $tags = $tagBox.find('.dx-tag');

        assert.deepEqual($tagBox.dxTagBox('option', 'value'), ['value ' + customValue]);
        assert.equal($tags.length, 1, 'tag is added');
        assert.equal($tags.eq(0).text(), 'display ' + customValue);
    });

    QUnit.test('create custom item by subscribe on event via \'on\' method', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            acceptCustomValue: true,
            displayExpr: 'display',
            valueExpr: 'value'
        });

        const $input = $tagBox.find('.dx-texteditor-input');
        const keyboard = keyboardMock($input);
        const customValue = 'Custom value';

        const onCustomItemCreating = event => {
            event.customItem = {
                display: 'display ' + event.text,
                value: 'value ' + event.text
            };
        };

        const instance = $tagBox.dxTagBox('instance');

        instance.on('customItemCreating', onCustomItemCreating);

        keyboard
            .type(customValue)
            .press('enter');

        const $tags = $tagBox.find('.dx-tag');

        assert.deepEqual(instance.option('value'), ['value ' + customValue]);
        assert.equal($tags.length, 1, 'tag is added');
        assert.equal($tags.eq(0).text(), 'display ' + customValue);
    });

    QUnit.test('the \'onCustomItemCreating\' option with Deferred', function(assert) {
        const deferred = $.Deferred();

        const $tagBox = $('#tagBox').dxTagBox({
            acceptCustomValue: true,
            displayExpr: 'display',
            valueExpr: 'value',
            onCustomItemCreating(e) {
                e.customItem = deferred.promise();
            }
        });

        const $input = $tagBox.find('.dx-texteditor-input');
        const keyboard = keyboardMock($input);
        const customValue = 'Custom value';

        keyboard
            .type(customValue)
            .press('enter');

        assert.deepEqual($tagBox.dxTagBox('option', 'value'), [], 'the \'value\' array is correct until deferred is resolved');
        assert.equal($tagBox.find('.dx-tag').length, 0, 'no tags are rendered until deferred is resolved');

        deferred.resolve({
            display: 'display ' + customValue,
            value: 'value ' + customValue
        });

        const $tags = $tagBox.find('.dx-tag');

        assert.deepEqual($tagBox.dxTagBox('option', 'value'), ['value ' + customValue], 'the \'value\' array is correct');
        assert.equal($tags.length, 1, 'tag is added');
        assert.equal($tags.eq(0).text(), 'display ' + customValue, 'added tag text is correct');
    });

    QUnit.test('the selected list items should be correct if custom item is in list', function(assert) {
        const items = [1, 2, 3];

        const $tagBox = $('#tagBox').dxTagBox({
            acceptCustomValue: true,
            items
        });

        const tagBox = $tagBox.dxTagBox('instance');
        const $input = $tagBox.find('.dx-texteditor-input');
        const customValue = 'Custom value';

        tagBox.option('onCustomItemCreating', e => {
            const items = tagBox.option('items').slice();
            items.push(e.text);
            tagBox.option('items', items);
            e.customItem = e.text;
        });

        keyboardMock($input)
            .type(customValue)
            .press('enter');

        tagBox.open();
        const list = tagBox._list;

        assert.deepEqual(list.option('items'), items.concat([customValue]), 'list items are changed');
        assert.deepEqual(list.option('selectedItems'), [customValue], 'selected items are correct');
    });

    QUnit.test('tags should have a right display texts for acceptCustomValue and preset value', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [],
            value: ['one'],
            acceptCustomValue: true
        });

        const $input = $tagBox.find('.dx-texteditor-input');
        const keyboard = keyboardMock($input);
        const customValue = 'two';

        keyboard
            .type(customValue)
            .press('enter');

        const $tags = $tagBox.find('.dx-tag');

        assert.equal($tags.length, 2, 'tag is added');
        assert.equal($tags.eq(0).text(), 'one');
        assert.equal($tags.eq(1).text(), 'two');
    });

    QUnit.test('custom item should be selected in list but tag should not be rendered in useButtons mode', function(assert) {
        const store = new ArrayStore([{ id: 1, name: 'Alex' }]);

        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: store,
            onCustomItemCreating(e) {
                e.customItem = store.insert({ id: 2, name: e.text }).done(() => {
                    instance.getDataSource().reload();
                });
            },
            value: [],
            acceptCustomValue: true,
            applyValueMode: 'useButtons',
            valueExpr: 'id',
            displayExpr: 'name',
            opened: true
        });

        const instance = $tagBox.dxTagBox('instance');
        const $input = $tagBox.find('.dx-texteditor-input');
        const keyboard = keyboardMock($input);

        keyboard
            .type('123')
            .press('enter');

        this.clock.tick();

        const $tags = $tagBox.find('.dx-tag');
        const $listItems = $(instance.content()).find('.dx-list-item.dx-list-item-selected');

        assert.equal($tags.length, 0, 'tags should not be rendered before button click');
        assert.equal($listItems.length, 1, 'list item should be selected after enter press');
    });

    QUnit.test('custom item should be selected in list but tag should not be rendered in useButtons mode with checkboxes', function(assert) {
        const store = new ArrayStore([{ id: 1, name: 'Alex' }]);

        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: store,
            onCustomItemCreating(e) {
                e.customItem = store.insert({ id: 2, name: e.text }).done(() => {
                    instance.getDataSource().reload();
                });
            },
            value: [],
            acceptCustomValue: true,
            showSelectionControls: true,
            applyValueMode: 'useButtons',
            valueExpr: 'id',
            displayExpr: 'name',
            opened: true
        });

        const instance = $tagBox.dxTagBox('instance');
        const $input = $tagBox.find('.dx-texteditor-input');
        const keyboard = keyboardMock($input);

        keyboard
            .type('123')
            .press('enter');

        this.clock.tick();

        const $tags = $tagBox.find('.dx-tag');
        const $listItems = $(instance.content()).find('.dx-list-item.dx-list-item-selected');
        const checkbox = $listItems.eq(0).find(`.${LIST_CKECKBOX_CLASS}`).dxCheckBox('instance');

        assert.equal($tags.length, 0, 'tags should not be rendered before button click');
        assert.equal($listItems.length, 1, 'list item should be selected after enter press');
        assert.equal(checkbox.option('value'), true, 'checkbox is checked');
    });

    QUnit.test('onValueChanged event should have correct "event" field after adding a custom item', function(assert) {
        const valueChangedStub = sinon.stub();
        const $tagBox = $('#tagBox').dxTagBox({
            acceptCustomValue: true,
            items: [1, 2, 3],
            onValueChanged: valueChangedStub,
            onCustomItemCreating: (e) => {
                e.customItem = e.text;
            }
        });
        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);

        keyboardMock($input)
            .type('test')
            .press('enter');

        const event = valueChangedStub.getCall(0).args[0].event;
        assert.ok(valueChangedStub.calledOnce);
        assert.ok(!!event);
        assert.strictEqual(event.type, 'keydown');
    });
});

QUnit.module('placeholder', () => {
    QUnit.test('placeholder should appear after tag deleted', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: ['item1', 'item2', 'item3'],
            value: ['item1']
        });

        const $clearButton = $tagBox.find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`);

        $($clearButton).trigger('dxclick');

        const $placeholder = $tagBox.find('.dx-placeholder');

        assert.notEqual($placeholder.css('display'), 'none', 'placeholder was appear');
        assert.equal($placeholder.is(':visible'), true, 'placeholder was appear');
    });

    QUnit.test('placeholder is hidden after tag is removed if the search value is exist', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            value: [1],
            searchEnabled: true
        });

        const $placeholder = $tagBox.find('.dx-placeholder');
        const $input = $tagBox.find('.dx-texteditor-input');

        keyboardMock($input).type('123');
        $($tagBox.find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`)).trigger('dxclick');
        assert.notOk($placeholder.is(':visible'), 'placeholder is hidden');
    });

    QUnit.test('placeholder should be restored after focusout in Angular', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            searchEnabled: true
        });

        const $placeholder = $tagBox.find('.dx-placeholder');
        const $input = $tagBox.find('.dx-texteditor-input');

        keyboardMock($input).type('5');
        $input.trigger('blur');
        $input.trigger('focusout');

        assert.ok($placeholder.is(':visible'), 'placeholder is visible');
    });

    QUnit.test('placeholder should not be visible after tag add when fieldTemplate is used (T918886)', function(assert) {
        const fieldTemplate = () => {
            return $('<div>').dxTextBox({
                placeholder: 'placeholder'
            });
        };

        const $tagBox = $('#tagBox').dxTagBox({
            fieldTemplate,
            acceptCustomValue: true,
            items: [],
            onCustomItemCreating: function(args) {
                const newValue = args.text;
                const component = args.component;
                const currentItems = component.option('items');
                currentItems.unshift(newValue);
                component.option('items', currentItems);
                args.customItem = newValue;
            }
        });

        let $input = $tagBox.find('.dx-texteditor-input');
        const keyboard = keyboardMock($input);

        keyboard
            .type('123')
            .press('enter');

        $input = $tagBox.find('.dx-texteditor-input');
        $input.trigger('blur');

        const $placeholder = $tagBox.find('.dx-placeholder');
        assert.notOk($placeholder.is(':visible'), 'placeholder is not visible');
    });
});

QUnit.module('tag template', moduleSetup, () => {
    QUnit.test('tag template should have correct arguments', function(assert) {
        const items = [{ text: 1 }, { text: 2 }];

        $('#tagBox').dxTagBox({
            items,
            valueExpr: 'this',
            value: [items[0]],
            tagTemplate(tagData, tagElement) {
                assert.equal(tagData, items[0], 'correct data is passed');
                assert.equal($(tagElement).hasClass(TAGBOX_TAG_CLASS), true, 'correct element passed');
                assert.equal(isRenderer(tagElement), !!config().useJQuery, 'tagElement is correct');
            }
        });
    });

    QUnit.test('tag template should get item in arguments even if the \'displayExpr\' option is specified', function(assert) {
        const items = [{ id: 1, text: 'one' }, { id: 2, text: 'two' }];

        $('#tagBox').dxTagBox({
            items,
            displayExpr: 'text',
            value: [items[1]],
            tagTemplate(tagData, tagElement) {
                assert.deepEqual(tagData, items[1], 'correct data is passed');
            }
        });
    });

    QUnit.test('displayExpr as function should work', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [{ name: 'Item 1', id: 1 }],
            displayExpr(item) {
                return item.name;
            },
            valueExpr: 'id',
            value: [1]
        });

        const $tags = $tagBox.find('.' + TAGBOX_TAG_CLASS);

        assert.equal($tags.text(), 'Item 1', 'tags are correct');
    });

    QUnit.test('tag template should be applied correctly after item selection (T589269)', function(assert) {
        const items = [{ id: 1, text: 'one' }, { id: 2, text: 'two' }];

        const $element = $('#tagBox').dxTagBox({
            items,
            displayExpr: 'text',
            valueExpr: 'id',
            opened: true,
            tagTemplate(tagData, tagElement) {
                return '<div class=\'custom-item\'><div class=\'product-name\'>' + tagData.text + '</div>';
            }
        });

        const list = $element.dxTagBox('instance')._list;
        const $list = list.$element();

        $($list.find('.dx-list-item').eq(0)).trigger('dxclick');
        $($list.find('.dx-list-item').eq(1)).trigger('dxclick');

        const $tagContainer = $element.find('.' + TAGBOX_TAG_CONTAINER_CLASS);

        assert.equal($.trim($tagContainer.text()), 'onetwo', 'selected values are rendered correctly');
    });

    QUnit.test('value should be correct if the default tag template is used and the displayExpr is specified', function(assert) {
        const items = [{ id: 1, text: 'one' }];

        const $element = $('#tagBox').dxTagBox({
            items,
            displayExpr: 'text',
            valueExpr: 'this',
            opened: true
        });

        const instance = $element.dxTagBox('instance');
        const $list = instance._list.$element();

        $($list.find('.dx-list-item').eq(0)).trigger('dxclick');
        assert.deepEqual(instance.option('value'), [items[0]], 'the \'value\' option is correct');
    });

    QUnit.test('selected list items should be correct if the default tag template is used and the displayExpr is specified', function(assert) {
        const items = [{ id: 1, text: 'one' }];

        const $element = $('#tagBox').dxTagBox({
            items,
            displayExpr: 'text',
            valueExpr: 'this',
            opened: true
        });

        const list = $element.dxTagBox('instance')._list;
        const $list = list.$element();

        $($list.find('.dx-list-item').eq(0)).trigger('dxclick');
        assert.deepEqual(list.option('selectedItems'), [items[0]], 'the \'selectedItems\' list option is correct');
    });

    QUnit.test('user can return default tag template from the custom function', function(assert) {
        const $element = $('#tagBox').dxTagBox({
            items: [{ id: 1, text: 'item 1' }],
            valueExpr: 'id',
            displayExpr: 'text',
            value: [1],
            tagTemplate() {
                return 'tag';
            }
        });

        const $tags = $element.find('.' + TAGBOX_TAG_CLASS);

        assert.equal($tags.text(), 'item 1', 'text is correct');
    });
});

QUnit.module('showSelectionControls', moduleSetup, () => {
    QUnit.test('showSelectionControls', function(assert) {
        $('#tagBox').dxTagBox({
            items: [1],
            opened: true,
            showSelectionControls: true
        });

        this.clock.tick(TIME_TO_WAIT);

        assert.equal($('.dx-checkbox').length, 2, 'selectAll checkbox and checkbox on item added');
    });

    QUnit.test('click on selected item causes item uncheck', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            opened: true,
            showSelectionControls: true
        });

        this.clock.tick(TIME_TO_WAIT);

        pointerMock($('.dx-list-item').eq(1)).start().click();
        pointerMock($('.dx-list-item').eq(2)).start().click();

        pointerMock($('.dx-list-item').eq(2)).start().click();

        assert.deepEqual($tagBox.dxTagBox('option', 'value'), [2], 'value is reset');
    });

    QUnit.test('list items are selected on render', function(assert) {
        $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            value: [1, 2],
            opened: true,
            showSelectionControls: true
        });

        this.clock.tick(TIME_TO_WAIT);

        assert.equal($('.dx-checkbox-checked').length, 2, 'values selected on render');
    });

    QUnit.test('selectAll element should be rendered correctly when opening tagBox', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: {
                store: new ArrayStore([1, 2, 3]),
                pageSize: 2
            },
            showSelectionControls: true
        });

        this.clock.tick(TIME_TO_WAIT);

        $tagBox.dxTagBox('option', 'opened', true);
        this.clock.tick(TIME_TO_WAIT);

        assert.equal($('.dx-list-select-all').length, 1, 'selectAll item is rendered');
    });

    QUnit.test('changing selectAll state with selectAllMode \'allPages\'', function(assert) {
        const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: {
                store: new ArrayStore(items),
                paginate: true,
                pageSize: 5
            },
            selectAllMode: 'allPages',
            showSelectionControls: true
        });
        this.clock.tick(TIME_TO_WAIT);

        $tagBox.dxTagBox('option', 'opened', true);
        this.clock.tick(TIME_TO_WAIT);
        $('.dx-list-select-all-checkbox').trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT);

        assert.deepEqual($tagBox.dxTagBox('option', 'value'), items, 'items is selected');
    });

    QUnit.test('items check state reset after deleting of the value', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2],
            opened: true,
            showSelectionControls: true
        });

        const tagBox = $tagBox.dxTagBox('instance');
        tagBox.option('value', [2]);

        const $checkedItems = $('.dx-checkbox-checked');

        assert.equal($checkedItems.length, 1, 'only one item highlighted');
    });

    QUnit.test('onValueChanged should be fired once when showSelectionControls is true', function(assert) {
        let fired = 0;
        $('#tagBox').dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2],
            showSelectionControls: true,
            onValueChanged(e) {
                fired++;
            }
        });

        this.clock.tick(TIME_TO_WAIT);

        assert.equal(fired, 0, 'event was not fired');

        $('.dx-list-select-all-checkbox').trigger('dxclick');
        assert.equal(fired, 1, 'event fired once');
    });

    QUnit.test('correct value after deselecting all items', function(assert) {
        const items = [1, 2, 3, 4];
        const tagBox = $('#tagBox').dxTagBox({
            items,
            value: items,
            showSelectionControls: true
        }).dxTagBox('instance');

        this.clock.tick(TIME_TO_WAIT);

        $('.dx-list-select-all-checkbox').trigger('dxclick');
        assert.deepEqual(tagBox.option('value'), [], 'value is an empty array');
    });

    QUnit.test('onValueChanged was not raised when time after time popup opening (showSelectionControls = true)', function(assert) {
        let fired = 0;

        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3, 4],
            showSelectionControls: true,
            opened: true,
            onValueChanged(e) {
                fired++;
            }
        });

        this.clock.tick(TIME_TO_WAIT);

        const $listItems = $('.dx-list-item');

        $($listItems.first()).trigger('dxclick');

        $tagBox.dxTagBox('instance').option('opened', false);
        $tagBox.dxTagBox('instance').option('opened', true);

        assert.equal(fired, 1, 'event was fired once');
    });

    QUnit.test('tag rendered after click on selections control', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            showSelectionControls: true,
            opened: true
        });

        this.clock.tick(TIME_TO_WAIT);

        const $listItems = $('.dx-list-item');

        $($listItems.first()).trigger('dxclick');

        assert.equal($tagBox.find('.dx-tag').length, 1, 'tag rendered');
    });

    QUnit.testInActiveWindow('tag should not be removed when editor looses focus', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            showSelectionControls: true,
            focusStateEnabled: true,
            searchEnabled: true,
            searchTimeout: 0,
            opened: true
        });

        $($tagBox.find(`.${TEXTBOX_CLASS}`)).trigger('focusin');
        $('.dx-list-item').first().trigger('dxclick');
        $($tagBox.find(`.${TEXTBOX_CLASS}`)).trigger('focusout');

        assert.equal($tagBox.find('.dx-tag').length, 1, 'tag is present');
    });

    QUnit.test('list \'select all\' checkbox state should be correct if all items are selected on init and data source paging is enabled', function(assert) {
        const items = (() => {
            const items = [];
            for(let i = 0, n = 200; i < n; i++) {
                items.push(i);
            }
            return items;
        })();

        $('#tagBox').dxTagBox({
            value: items.slice(),
            showSelectionControls: true,
            dataSource: {
                paginate: true,
                pageSize: 100,
                requireTotalCount: true,
                store: items
            },
            opened: true
        });

        const selectAllCheck = $('.dx-list-select-all-checkbox').dxCheckBox('instance');
        assert.equal(selectAllCheck.option('value'), true, 'the \'select all\' checkbox is checked');
    });

    QUnit.test('T378748 - the tab key press should not lead to error while navigating in list', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            showSelectionControls: true,
            opened: true
        });

        const $input = $tagBox.find('.dx-texteditor-input');

        keyboardMock($input)
            .focus()
            .press('down')
            .press('tab');

        assert.expect(0);
    });

    QUnit.test('dataSource should not load item on item selection if valueExpr is used', function(assert) {
        const items = [{ name: 'one', value: 1 }, { name: 'two', value: 2 }, { name: 'three', value: 3 }];
        const loadSpy = sinon.spy((loadOptions) => {
            const deferred = $.Deferred();
            setTimeout(() => {
                if(loadOptions.take) {
                    deferred.resolve(items.slice().splice(loadOptions.skip, loadOptions.take));
                }
                deferred.resolve();
            }, 500);

            return deferred.promise();
        });


        const dataSource = new DataSource({
            store: new CustomStore({
                load: loadSpy
            }),
            paginate: true,
            pageSize: 4

        });
        $('#tagBox').dxTagBox({
            dataSource,
            displayExpr: 'name',
            valueExpr: 'value',
            opened: true,
            showSelectionControls: true
        });

        this.clock.tick(TIME_TO_WAIT);
        pointerMock($('.dx-list-item').eq(1)).start().click();
        pointerMock($('.dx-list-item').eq(2)).start().click();

        assert.strictEqual(loadSpy.callCount, 1, 'selected items are correct');
    });

    QUnit.test('dataSource should not load item on item selection if dataSource key is used (T888848)', function(assert) {
        const items = [{ name: 'one', value: 1 }, { name: 'two', value: 2 }, { name: 'three', value: 3 }];
        const loadSpy = sinon.spy((loadOptions) => {
            const deferred = $.Deferred();
            setTimeout(() => {
                if(loadOptions.take) {
                    deferred.resolve(items.slice().splice(loadOptions.skip, loadOptions.take));
                }
                deferred.resolve();
            }, 500);

            return deferred.promise();
        });


        const dataSource = new DataSource({
            store: new CustomStore({
                load: loadSpy
            }),
            key: 'value',
            paginate: true,
            pageSize: 4

        });
        $('#tagBox').dxTagBox({
            dataSource,
            displayExpr: 'name',
            opened: true,
            showSelectionControls: true
        });

        this.clock.tick(TIME_TO_WAIT);
        pointerMock($('.dx-list-item').eq(1)).start().click();
        pointerMock($('.dx-list-item').eq(2)).start().click();

        assert.strictEqual(loadSpy.callCount, 1, 'selected items are correct');
    });

    QUnit.test('dataSource should not load item on item selection if no dataSource key is used', function(assert) {
        const items = [{ name: 'one', value: 1 }, { name: 'two', value: 2 }, { name: 'three', value: 3 }];
        const loadSpy = sinon.spy((loadOptions) => {
            const deferred = $.Deferred();
            setTimeout(() => {
                if(loadOptions.take) {
                    deferred.resolve(items.slice().splice(loadOptions.skip, loadOptions.take));
                }
                deferred.resolve();
            }, 500);

            return deferred.promise();
        });


        const dataSource = new DataSource({
            store: new CustomStore({
                load: loadSpy
            }),
            paginate: true,
            pageSize: 4

        });
        $('#tagBox').dxTagBox({
            dataSource,
            displayExpr: 'name',
            opened: true,
            showSelectionControls: true
        });

        this.clock.tick(TIME_TO_WAIT);
        pointerMock($('.dx-list-item').eq(1)).start().click();
        pointerMock($('.dx-list-item').eq(2)).start().click();

        assert.strictEqual(loadSpy.callCount, 1, 'selected items are correct');
    });
});

QUnit.module('keyboard navigation', {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();

        this._init = (options) => {
            this.$element = $('<div>')
                .appendTo('#qunit-fixture')
                .dxTagBox(options);
            this.instance = this.$element.dxTagBox('instance');
            this.$input = this.$element.find('.' + TEXTBOX_CLASS);
            this.keyboard = keyboardMock(this.$input);
        };

        this._init({
            focusStateEnabled: true,
            items: [1, 2, 3],
            value: [1, 2],
            opened: true
        });
        this.reinit = (options) => {
            this.$element.remove();
            this._init(options);
        };
    },
    afterEach: function() {
        this.$element.remove();
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    QUnit.test('backspace', function(assert) {
        assert.expect(2);

        this.keyboard
            .focus()
            .keyDown('backspace');
        assert.deepEqual(this.instance.option('value'), [1], 'last value has been deleted');

        this.keyboard
            .keyDown('backspace');
        assert.deepEqual(this.instance.option('value'), [], 'values is empty');
    });

    QUnit.test('backspace UI', function(assert) {
        assert.expect(2);

        this.keyboard
            .focus()
            .keyDown('backspace');
        assert.equal($('.' + LIST_ITEM_SELECTED_CLASS).length, 1, 'list selected items has been modified');

        this.keyboard
            .keyDown('backspace');
        assert.equal($('.' + LIST_ITEM_SELECTED_CLASS).length, 0, 'there are no selected items in list');
    });

    QUnit.test('TagBox should not select items when list is not shown', function(assert) {
        assert.expect(1);

        this.instance.option({
            value: [],
            deferRendering: false,
            opened: false
        });

        this.keyboard
            .keyDown('down');
        assert.deepEqual(this.instance.option('value'), [], 'downArrow should not select value when the list is hidden');
    });

    QUnit.test('T309987 - value should not be changed when moving focus by the \'tab\' key', function(assert) {
        const items = ['first', 'second', 'third', 'fourth'];
        const value = [items[1], items[3]];

        this.reinit({
            items,
            value,
            opened: true
        });

        this.keyboard
            .focus()
            .press('tab');

        assert.deepEqual(this.instance.option('value'), value, 'the value is correct');
    });

    QUnit.testInActiveWindow('Value should be correct when not last item is focused and the \'tab\' key pressed', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'desktop specific test');
            return;
        }
        const items = ['first', 'second', 'third'];
        const value = [items[0], items[2]];

        this.reinit({
            focusStateEnabled: true,
            items,
            value,
            opened: true
        });

        this.keyboard
            .focus()
            .keyDown('down')
            .press('tab');

        assert.deepEqual(this.instance.option('value'), [items[0], items[2]], 'value is still the same');
    });

    QUnit.test('First item is not selected when edit is disabled', function(assert) {
        this.reinit({
            value: [],
            acceptCustomValue: false,
            searchEnabled: false,
            opened: true,
            dataSource: ['1', '2', '3']
        });

        this.keyboard
            .keyDown('tab');
        assert.deepEqual(this.instance.option('value'), [], 'was selected first item and be set');
    });

    QUnit.test('Enter and escape key press prevent default when popup is opened', function(assert) {
        this.reinit({
            items: [0, 1, 2],
            value: [1],
            focusStateEnabled: true,
            opened: true,
            acceptCustomValue: true
        });

        let prevented = 0;

        $(this.$element).on('keydown', e => {
            if(e.isDefaultPrevented()) {
                prevented++;
            }
        });

        this.keyboard
            .keyDown('enter');
        assert.equal(prevented, 1, 'defaults prevented on enter');

        prevented = 0;
        this.instance.option('opened', true);

        this.keyboard
            .keyDown('esc');
        assert.equal(prevented, 1, 'defaults prevented on escape keys');
    });

    QUnit.test('Enter and escape key press prevent default when popup is opened and field edit enabled is not set', function(assert) {
        this.reinit({
            items: [0, 1, 2],
            value: [1],
            focusStateEnabled: true,
            opened: true
        });

        let prevented = 0;

        $(this.$element).on('keydown', e => {
            if(e.isDefaultPrevented()) {
                prevented++;
            }
        });

        this.keyboard
            .keyDown('enter');
        assert.equal(prevented, 1, 'defaults prevented on enter');

        prevented = 0;
        this.instance.option('opened', false);

        this.keyboard
            .keyDown('enter');
        assert.equal(prevented, 0, 'defaults not prevented on enter when popup is closed');
    });

    QUnit.test('input value should be cleared', function(assert) {
        this.reinit({
            items: [1, 2],
            opened: true
        });

        this.keyboard
            .keyUp(KEY_DOWN)
            .keyUp(KEY_ENTER);

        assert.equal(this.$input.val(), '', 'value was not rendered');
    });

    QUnit.test('tagBox selects item on enter key', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        this.reinit({
            items: [1, 2, 3],
            focusStateEnabled: true,
            opened: true
        });

        this.keyboard
            .keyDown(KEY_ENTER)
            .keyDown(KEY_DOWN)
            .keyDown(KEY_ENTER);

        const $tags = this.$element.find('.' + TAGBOX_TAG_CONTENT_CLASS);
        assert.equal($tags.text(), '1', 'rendered first item');
    });

    QUnit.test('control keys test', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        this.reinit({
            items: [1, 2, 3],
            focusStateEnabled: true
        });

        const altDown = $.Event('keydown', { key: 'ArrowDown', altKey: true });
        const altUp = $.Event('keydown', { key: 'ArrowUp', altKey: true });

        assert.ok(!this.instance.option('opened'), 'overlay is hidden on first show');

        this.$input.trigger(altDown);
        assert.ok(this.instance.option('opened'), 'overlay is visible on alt+down press');

        this.$input.trigger(altUp);
        assert.notOk(this.instance.option('opened'), 'overlay is invisible on alt+up press');
    });

    QUnit.test('up and down keys should work correctly in dxTagBox', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        this.reinit({
            items: [1, 2, 3],
            focusStateEnabled: true
        });

        this.keyboard.press('down');
        this.keyboard.press('up');
        assert.ok(true, 'there is no exceptions');
    });

    QUnit.test('tagBox selects item on space key', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        this.reinit({
            items: [1, 2, 3],
            focusStateEnabled: true,
            opened: true
        });

        this.keyboard
            .keyDown(KEY_SPACE)
            .keyDown(KEY_DOWN)
            .keyDown(KEY_SPACE);

        const $tags = this.$element.find('.' + TAGBOX_TAG_CONTENT_CLASS);
        assert.equal($tags.text(), '1', 'rendered first item');
    });

    QUnit.test('tagBox didn\'t selects item on space key if it acceptCustomValue', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        this.reinit({
            items: [1, 2, 3],
            focusStateEnabled: true,
            acceptCustomValue: true,
            opened: true
        });

        this.keyboard
            .keyDown(KEY_SPACE)
            .keyDown(KEY_DOWN)
            .keyDown(KEY_SPACE);

        const $tags = this.$element.find('.' + TAGBOX_TAG_CONTENT_CLASS);
        assert.equal($tags.length, 0, 'there are no tags');
    });

    QUnit.test('tagBox didn\'t selects item on space key if search is enabled', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        this.reinit({
            items: [1, 2, 3],
            focusStateEnabled: true,
            searchEnabled: true,
            opened: true
        });

        this.keyboard
            .keyDown(KEY_SPACE)
            .keyDown(KEY_DOWN)
            .keyDown(KEY_SPACE);

        const $tags = this.$element.find('.' + TAGBOX_TAG_CONTENT_CLASS);
        assert.equal($tags.length, 0, 'there are no tags');
    });

    QUnit.test('the \'enter\' key should not add/remove tags if the editor is closed (T378292)', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }
        this.reinit({
            items: [1, 2, 3],
            focusStateEnabled: true,
            opened: true
        });

        this.keyboard
            .focus()
            .press('down');

        this.instance.close();

        this.keyboard
            .press('enter');
        assert.deepEqual(this.instance.option('value'), [], 'value is not changed');
    });

    QUnit.test('onValueChanged shouldn\'t be fired on the \'tab\' key press', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        const spy = sinon.spy();

        this.instance.option('onValueChanged', spy);

        this.keyboard
            .press('down')
            .press('down')
            .press('tab');

        assert.equal(spy.callCount, 0, 'onValueChanged event isn\'t fired');
    });

    QUnit.test('value shouldn\'t be changed on \'tab\' if there is a focused item in the drop down list', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        const expectedValue = this.instance.option('value');

        this.keyboard
            .focus()
            .press('down')
            .press('down')
            .press('tab');

        assert.deepEqual(this.instance.option('value'), expectedValue, 'the value is correct');
    });

    QUnit.testInActiveWindow('the \'apply\' button should be focused on the \'tab\' key press if the input is focused and showSelectionControls if false (T389453)', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'desktop specific test');
            return;
        }

        this.instance.option({
            applyValueMode: 'useButtons',
            opened: true
        });

        this.keyboard
            .focus()
            .press('tab');

        const $applyButton = this.instance._popup._wrapper().find('.dx-button.dx-popup-done');
        assert.ok($applyButton.hasClass('dx-state-focused'), 'the apply button is focused');
    });
});

QUnit.module('keyboard navigation through tags', {
    beforeEach: function() {
        const items = [1, 2, 3, 4];

        this.$element = $('#tagBox').dxTagBox({
            items,
            value: items,
            focusStateEnabled: true
        });

        this._init = () => {
            this.instance = this.$element.dxTagBox('instance');
            this.$input = this.$element.find(`.${TEXTBOX_CLASS}`);
            this.keyboard = keyboardMock(this.$input, true);

            this.getTags = () => {
                return this.$element.find('.' + TAGBOX_TAG_CLASS);
            };

            this.getFocusedTag = () => {
                return this.$element.find('.' + TAGBOX_TAG_CLASS + '.' + FOCUSED_CLASS);
            };
        };

        this.reinit = (options) => {
            this.$element = $('#tagBox').dxTagBox(options);
            this._init();
        };

        this._init();
    },
}, () => {
    QUnit.test('the last rendered tag should get \'focused\' class after the \'leftArrow\' key press', function(assert) {
        this.keyboard
            .focus()
            .press('left');

        const $lastTag = this.getTags().last();
        assert.ok($lastTag.hasClass(FOCUSED_CLASS), 'the last tag got the \'focused\' class');
    });

    QUnit.test('the last rendered tag should get \'focused\' class after the \'leftArrow\' key press if field is editable', function(assert) {
        const items = [1, 2, 3, 4];
        this.reinit({
            items,
            value: items,
            focusStateEnabled: true,
            acceptCustomValue: true
        });

        this.keyboard
            .focus()
            .press('left');

        const $lastTag = this.getTags().last();
        assert.ok($lastTag.hasClass(FOCUSED_CLASS), 'the last tag got the \'focused\' class');
    });

    QUnit.test('the first rendered tag should get \'focused\' class after the \'rightArrow\' key press', function(assert) {
        this.keyboard
            .focus()
            .press('right');

        const $firstTag = this.getTags().first();
        assert.ok($firstTag.hasClass(FOCUSED_CLASS), 'the first tag got the \'focused\' class');
    });

    QUnit.test('the \'focused\' class should be moved to the previous tag after the \'leftArrow\' key press', function(assert) {
        this.keyboard
            .focus()
            .press('left')
            .press('left');

        const $lastTag = this.getTags().last();
        const $penultTag = $lastTag.prev();

        assert.notOk($lastTag.hasClass(FOCUSED_CLASS), 'the last tag does not have the \'focused\' class');
        assert.ok($penultTag.hasClass(FOCUSED_CLASS), 'the penult tag has the \'focused\' class');
    });

    QUnit.test('the \'focused\' should remain on the first tag if the \'leftArrow\' key is pressed', function(assert) {
        this.instance.option({
            items: [1],
            value: [1]
        });

        this.keyboard
            .focus()
            .press('left')
            .press('left');

        const $firstTag = this.getTags().first();
        assert.ok($firstTag.hasClass(FOCUSED_CLASS), 'the first tag has the \'focused\' class');
    });

    QUnit.test('the \'focused\' class should be moved to the next tag after the \'rightArrow\' key press', function(assert) {
        this.keyboard
            .focus()
            .press('left')
            .press('left')
            .press('right');

        const $lastTag = this.getTags().last();
        const $penultTag = $lastTag.prev();

        assert.ok($lastTag.hasClass(FOCUSED_CLASS), 'the last tag has the \'focused\' class');
        assert.notOk($penultTag.hasClass(FOCUSED_CLASS), 'the penult tag does not have the \'focused\' class');
    });

    QUnit.test('the \'focused\' class should remain on the last tag if the \'rightArrow\' key is pressed', function(assert) {
        this.keyboard
            .focus()
            .press('left')
            .press('right');

        const $lastTag = this.getTags().last();

        assert.ok($lastTag.hasClass(FOCUSED_CLASS), 'the last tag has does not have the \'focused\' class');
        assert.notOk(this.$input.hasClass(FOCUSED_CLASS), 'the \'tag focused\' class should not be set on the input');
    });

    QUnit.test('the \'focused\' class should be removed from the last tag if the \'rightArrow\' key is pressed is field is editable', function(assert) {
        const items = [1, 2, 3, 4];
        this.reinit({
            items,
            value: items,
            focusStateEnabled: true,
            acceptCustomValue: true
        });

        this.keyboard
            .focus()
            .press('left')
            .press('right');

        const $lastTag = this.getTags().last();

        assert.notOk($lastTag.hasClass(FOCUSED_CLASS), 'the last tag has does not have the \'focused\' class');
        assert.notOk(this.$input.hasClass(FOCUSED_CLASS), 'the \'tag focused\' class should not be set on the input');
    });

    QUnit.test('it should be possible to move input caret after navigating through tags', function(assert) {
        const items = [1, 2, 3, 4];
        this.reinit({
            items,
            value: items,
            focusStateEnabled: true,
            acceptCustomValue: true
        });

        this.keyboard
            .focus()
            .press('left')
            .press('right');

        let event;
        $(this.$input).on('keydown', e => {
            event = e;
        });

        this.keyboard
            .press('right');

        const focusedTagsCount = this.getFocusedTag().length;

        assert.equal(focusedTagsCount, 0, 'there are no focused tags');
        assert.notOk(event.isDefaultPrevented(), 'the event default is not prevented, so the input caret move');
    });

    QUnit.test('typing symbols should not remove the \'focused\' class from currently focused tag', function(assert) {
        this.keyboard
            .focus()
            .press('left')
            .type('a');

        const $lastTag = this.getTags().last();
        assert.ok($lastTag.hasClass(FOCUSED_CLASS), 'the last tag has the \'focused\' class');
    });

    QUnit.test('typing symbols should remove the \'focused\' class from currently focused tag if the field is editable', function(assert) {
        const items = [1, 2, 3, 4];
        this.reinit({
            items,
            value: items,
            focusStateEnabled: true,
            acceptCustomValue: true
        });

        this.keyboard
            .focus()
            .press('left')
            .type('a');

        const $focusedTags = this.getFocusedTag();
        assert.equal($focusedTags.length, 0, 'no tags have the \'focused\' class');
    });

    QUnit.test('the last tag should not be selected after the \'leftArrow\' key press if the input caret is not at the start position', function(assert) {
        const items = [1, 2, 3, 4];
        this.reinit({
            items,
            value: items,
            focusStateEnabled: true,
            acceptCustomValue: true
        });

        this.keyboard
            .focus()
            .type('abc')
            .press('left');

        const $focusedTags = this.getFocusedTag();
        assert.equal($focusedTags.length, 0, 'there are no focused tags');
    });

    QUnit.test('the input caret should not move while navigating through tags', function(assert) {
        const items = [1, 2, 3, 4];
        this.reinit({
            items,
            value: items,
            focusStateEnabled: true,
            acceptCustomValue: true
        });

        this.keyboard
            .focus()
            .type('aa')
            .press('home')
            .press('left')
            .press('left');

        let event;
        $(this.$input).on('keydown', e => {
            event = e;
        });

        this.keyboard
            .press('right');

        assert.ok(event.isDefaultPrevented(), 'the event default is prevented, so the input caret did not move');
    });

    QUnit.test('the focused tag should be removed after pressing the \'backspace\' key', function(assert) {
        this.keyboard
            .focus()
            .press('left')
            .press('left');

        const expectedValue = this.instance.option('value').slice();
        const focusedTagIndex = this.getFocusedTag().index();

        expectedValue.splice(focusedTagIndex, 1);

        this.keyboard
            .press('backspace');

        const value = this.instance.option('value');
        assert.deepEqual(value, expectedValue, 'the widget\'s value is correct');
    });

    QUnit.test('backspace should remove selected search text but not tag if any text is selected', function(assert) {
        this.reinit({
            items: ['item 1', 'item 2'],
            value: ['item 1'],
            focusStateEnabled: true,
            searchEnabled: true
        });

        this.$input.val('item');
        this.keyboard.caret({ start: 0, end: 4 });
        this.keyboard.press('backspace');

        assert.equal(this.instance.option('value'), 'item 1', 'tag was not removed');
    });

    QUnit.test('the focused tag should be removed after pressing the \'delete\' key', function(assert) {
        this.keyboard
            .focus()
            .press('left')
            .press('left');

        const expectedValue = this.instance.option('value').slice();
        const focusedTagIndex = this.getFocusedTag().index();

        expectedValue.splice(focusedTagIndex, 1);

        this.keyboard
            .press('del');

        const value = this.instance.option('value');
        assert.deepEqual(value, expectedValue, 'the widget\'s value is correct');
    });

    QUnit.test('pressing any of \'backspace\' or \'delete\' keys while tag is focused should not affect on input value', function(assert) {
        const items = [1, 2, 3, 4];
        this.reinit({
            items,
            value: items,
            focusStateEnabled: true,
            acceptCustomValue: true
        });

        const initialVal = 'abc';

        this.$input.val(initialVal);

        this.keyboard
            .focus()
            .press('home')
            .press('left')
            .press('backspace');

        assert.equal(this.$input.val(), initialVal, 'input value was not modified after pressing the \'backspace\' key');

        this.keyboard
            .press('left');

        let event;
        $(this.$input).on('keydown', e => {
            event = e;
        });

        this.keyboard
            .press('del');

        assert.ok(event.isDefaultPrevented(), 'the default is prevented after the \'delete\' key press, so the input value is not modified');
    });

    QUnit.test('continuously removing tags with the \'backspace\' key while input is focused', function(assert) {
        const expectedTagsCount = this.instance.option('value').length - 2;

        this.keyboard
            .focus()
            .press('backspace')
            .press('backspace');

        assert.equal(this.instance.option('value').length, expectedTagsCount, 'tags are removed correctly');
    });

    QUnit.test('the previous tag is focused after the \'backspace\' key press', function(assert) {
        this.keyboard
            .focus()
            .press('left')
            .press('left');

        const $expectedFocusedTag = this.getFocusedTag().prev('.' + TAGBOX_TAG_CLASS);

        this.keyboard
            .press('backspace');

        assert.ok($expectedFocusedTag.hasClass(FOCUSED_CLASS), 'the previous tag is focused');
    });

    QUnit.test('there are no focused tags after removing the first tag with the help of the \'backspace\' key', function(assert) {
        this.keyboard
            .focus()
            .press('left')
            .press('left')
            .press('left')
            .press('left')
            .press('backspace');

        const focusedTagsCount = this.getFocusedTag().length;
        assert.equal(focusedTagsCount, 0, 'there are no focused tags');
    });

    QUnit.test('there are no focused tags after pressing the \'backspace\' key while input is focused', function(assert) {
        this.keyboard
            .focus()
            .press('backspace');

        const focusedTagsCount = this.getFocusedTag().length;
        assert.equal(focusedTagsCount, 0, 'there are no focused tags');
    });

    QUnit.test('keyboard navigation should work after removing the last tag with the help of the \'backspace\' key (T378397)', function(assert) {
        this.keyboard
            .focus()
            .press('right')
            .press('backspace')
            .press('right');

        const $lastTag = this.$element.find('.' + TAGBOX_TAG_CLASS).first();
        assert.ok($lastTag.hasClass(FOCUSED_CLASS), 'the last tag is focused');
    });

    QUnit.test('the next tag is focused after the \'del\' key press', function(assert) {
        this.keyboard
            .focus()
            .press('left')
            .press('left');

        const $expectedFocusedTag = this.getFocusedTag().next('.' + TAGBOX_TAG_CLASS);

        this.keyboard
            .press('del');

        assert.ok($expectedFocusedTag.hasClass(FOCUSED_CLASS), 'the next tag is focused');
    });

    QUnit.test('there are no focused tags after removing the last tag with the help of the \'del\' key', function(assert) {
        this.keyboard
            .focus()
            .press('left')
            .press('del');

        const focusedTagsCount = this.getFocusedTag().length;
        assert.equal(focusedTagsCount, 0, 'there are no focused tags');
    });

    QUnit.test('keyboard navigation should work after removing the last tag with the help of the \'del\' key (T378397)', function(assert) {
        this.keyboard
            .focus()
            .press('left')
            .press('del')
            .press('left');

        const $lastTag = this.$element.find('.' + TAGBOX_TAG_CLASS).last();
        assert.ok($lastTag.hasClass(FOCUSED_CLASS), 'the last tag is focused');
    });

    QUnit.testInActiveWindow('the \'focused\' class should be removed from the focused tag when the widget loses focus', function(assert) {
        this.instance.focus();
        this.keyboard
            .press('left');

        this.instance.blur();

        const focusedTagsCount = this.getFocusedTag().length;
        assert.equal(focusedTagsCount, 0, 'there are no focused tags');
    });

    QUnit.testInActiveWindow('the should be no focused tags on when the widget gets focus', function(assert) {
        this.instance.focus();

        this.keyboard
            .press('left');

        this.instance.blur();
        this.instance.focus();

        const focusedTagsCount = this.getFocusedTag().length;
        assert.equal(focusedTagsCount, 0, 'there are no focused tags');
    });

    QUnit.test('there should be no focused tags after changing value not by keyboard', function(assert) {
        this.keyboard
            .focus()
            .press('right');

        const currentValue = this.instance.option('value');
        this.instance.option('value', [currentValue[0]]);

        const focusedTagsCount = this.getFocusedTag().length;
        assert.equal(focusedTagsCount, 0, 'there are no focused tags');
    });

    QUnit.test('navigating through tags in the RTL mode', function(assert) {
        const items = [1, 2, 3, 4];
        this.reinit({
            items,
            value: items,
            focusStateEnabled: true,
            rtlEnabled: true
        });

        this.keyboard
            .focus()
            .press('right');

        let $focusedTag = this.getFocusedTag();
        assert.equal($focusedTag.index(), 3, 'correct tag is focused after the \'right\' key press');

        this.keyboard
            .press('right');

        $focusedTag = this.getFocusedTag();
        assert.equal($focusedTag.index(), 2, 'correct tag is focused after the \'right\' key press');

        this.keyboard
            .press('left');

        $focusedTag = this.getFocusedTag();
        assert.equal($focusedTag.index(), 3, 'correct tag is focused after the \'left\' key press');
    });

    QUnit.test('navigating through tags in the RTL mode if the field is editable', function(assert) {
        const items = [1, 2, 3, 4];
        this.reinit({
            items,
            value: items,
            focusStateEnabled: true,
            acceptCustomValue: true,
            rtlEnabled: true
        });

        this.keyboard
            .focus()
            .press('right');

        let $focusedTag = this.getFocusedTag();
        assert.equal($focusedTag.index(), 3, 'correct tag is focused after the \'right\' key press');

        this.keyboard
            .press('right');

        $focusedTag = this.getFocusedTag();
        assert.equal($focusedTag.index(), 2, 'correct tag is focused after the \'right\' key press');

        this.keyboard
            .press('left');

        $focusedTag = this.getFocusedTag();
        assert.equal($focusedTag.index(), 3, 'correct tag is focused after the \'left\' key press');
    });

    QUnit.test('the input caret should not move while navigating through tags in the RTL mode', function(assert) {
        const items = [1, 2, 3, 4];
        this.reinit({
            items,
            value: items,
            focusStateEnabled: true,
            acceptCustomValue: true,
            rtlEnabled: true
        });

        this.keyboard
            .focus()
            .type('aa')
            .press('home')
            .press('right')
            .press('right');

        let event;
        $(this.$input).on('keydown', e => {
            event = e;
        });

        this.keyboard
            .press('left');

        assert.ok(event.isDefaultPrevented(), 'the event default is prevented, so the input caret did not move');
    });
});

QUnit.module('searchEnabled', moduleSetup, () => {
    QUnit.test('searchEnabled allows searching', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: ['test', 'custom'],
            searchEnabled: true,
            searchTimeout: 0
        });

        this.clock.tick(TIME_TO_WAIT);

        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
        keyboardMock($input).type('te');

        this.clock.tick(TIME_TO_WAIT);

        const $listItems = $('.dx-list-item');
        assert.equal($.trim($listItems.text()), 'test', 'items filtered');
    });

    QUnit.test('renders all tags after search', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: ['Moscow', 'London'],
            searchEnabled: true,
            searchTimeout: 0,
            opened: true,
            value: ['Moscow']
        });

        this.clock.tick();
        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
        keyboardMock($input).type('Lon');

        this.clock.tick(TIME_TO_WAIT);

        $('.dx-list-item').eq(0).trigger('dxclick');

        const $tagContainer = $tagBox.find('.' + TAGBOX_TAG_CONTAINER_CLASS);

        assert.equal($tagContainer.find('.' + TAGBOX_TAG_CONTENT_CLASS).length, 2, 'selected tags rendered');
        assert.equal($.trim($tagContainer.text()), 'MoscowLondon', 'selected values are rendered');
    });

    QUnit.test('input is positioned on the right of last tag', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: ['Moscow'],
            searchEnabled: true,
            width: 1000
        });

        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
        const inputLeft = $input.offset().left;

        $tagBox.dxTagBox('option', 'value', ['Moscow']);
        this.clock.tick(TIME_TO_WAIT);

        assert.ok($input.offset().left > inputLeft, 'input is moved to the right');
    });

    QUnit.test('size of input changes depending on search value length', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            searchEnabled: true
        });

        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
        const inputWidth = $input.width();

        keyboardMock($input).type('test text');

        assert.ok($input.width() > inputWidth, 'input size increase');
    });

    ['searchEnabled', 'acceptCustomValue'].forEach((option) => {
        QUnit.test(`width of input is enougth for all content with ${option} option (T807069)`, function(assert) {
            const $tagBox = $('#tagBox').dxTagBox({
                width: 300,
                [option]: true
            });

            const text = 'wwwwwwwwwwwwwwwwwwww';
            const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
            $input.css('padding', '0 10px');

            keyboardMock($input).type(text);
            const inputWidth = $input.width();

            const inputCopy = createTextElementHiddenCopy($input, text);
            inputCopy.appendTo('#qunit-fixture');

            assert.ok(inputWidth >= inputCopy.width());
            inputCopy.remove();
        });
    });

    QUnit.test('size of input is reset after selecting item', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            searchEnabled: true,
            items: ['test1', 'test2']
        });

        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
        const initInputWidth = $input.width();

        $tagBox.dxTagBox('option', 'value', ['test1']);
        assert.roughEqual($tagBox.find(`.${TEXTBOX_CLASS}`).width(), initInputWidth, 0.1, 'input width is not changed after selecting item');
    });

    QUnit.test('space entering should increase input element size (T923429)', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            searchEnabled: true
        });

        const text = '123456789          ';
        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard.type(text);
        const $inputCopy = createTextElementHiddenCopy($input, text, { includePaddings: true });
        $inputCopy
            .css('whiteSpace', 'pre')
            .appendTo('#qunit-fixture');
        const textWidth = $inputCopy.width();

        const currentWidth = $tagBox.find(`.${TEXTBOX_CLASS}`).width();
        assert.ok(currentWidth > textWidth, `input width (${currentWidth}) should be grester then input text width (${textWidth})`);
        $inputCopy.remove();
    });

    QUnit.test('size of input is 1 when searchEnabled and acceptCustomValue is false', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            searchEnabled: false,
            acceptCustomValue: false
        });

        const input = $tagBox.find(`.${TEXTBOX_CLASS}`).get(0);
        const { width: inputWidth } = input.getBoundingClientRect();

        // NOTE: width should be 0.1 because of T393423
        assert.roughEqual(inputWidth, 0.1, 0.101, 'input has correct width');
    });

    QUnit.test('no placeholder when textbox is not empty', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            searchEnabled: true,
            placeholder: 'placeholder'
        });

        keyboardMock($tagBox.find(`.${TEXTBOX_CLASS}`)).type('test');

        const $placeholder = $tagBox.find('.dx-placeholder');

        assert.ok($placeholder.is(':hidden'), 'placeholder is hidden');
    });

    QUnit.test('the \'backspace\' key press should remove text and preserve the widget\'s value', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            searchEnabled: true,
            dataSource: [1, 2, 3],
            value: [1, 2],
            focusStateEnabled: true
        });

        const tagBox = $tagBox.dxTagBox('instance');
        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
        const keyboard = keyboardMock($input, true);

        keyboard
            .type('te')
            .press('end')
            .press('backspace');

        assert.equal($input.val(), 't', 'input text is changed');
        assert.equal(tagBox.option('value').length, 2, 'tags are not removed');
    });

    QUnit.test('deleting tag when input is not empty', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: [1, 2, 3],
            searchEnabled: true,
            searchTimeout: 0,
            value: [1, 2],
            opened: true
        });

        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
        keyboardMock($input).type('3');

        this.clock.tick(TIME_TO_WAIT);

        const $close = $tagBox.find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`).last();
        $($close).trigger('dxclick');

        this.clock.tick(TIME_TO_WAIT);

        const $tagContainer = $tagBox.find('.' + TAGBOX_TAG_CONTAINER_CLASS);
        assert.equal($tagContainer.text(), '1', 'tags is refreshed correctly');
    });

    QUnit.test('list item obtained focus only after press on control key', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            searchEnabled: true,
            searchTimeout: 0,
            opened: true,
            focusStateEnabled: true
        });

        this.clock.tick(TIME_TO_WAIT);

        const $input = $tagBox.find('.dx-texteditor-input');

        keyboardMock($input).press('down');
        this.clock.tick(TIME_TO_WAIT);

        const $firstItemList = $('.dx-list-item').eq(0);
        assert.ok($firstItemList.hasClass(FOCUSED_CLASS), 'first list item obtained focus');
    });

    QUnit.test('tagBox should not be opened after selecting item', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: [1, 2, 3],
            searchEnabled: true
        });

        const tagBox = $tagBox.dxTagBox('instance');

        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
        keyboardMock($input).type('3');

        this.clock.tick(TIME_TO_WAIT);

        $('.dx-list-item').trigger('dxclick');

        this.clock.tick(TIME_TO_WAIT);

        assert.equal(tagBox.option('opened'), false, 'widget closed');
    });

    QUnit.test('tagBox removeTag with searchEnabled when input is focused', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: [1, 2, 3],
            searchEnabled: true,
            value: [1]
        });

        const tagBox = $tagBox.dxTagBox('instance');

        const $removeTag = $tagBox.find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`);
        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);

        const pointer = pointerMock($removeTag).start().down();
        $($input).trigger('blur');
        pointer.up();

        assert.deepEqual(tagBox.option('value'), [], 'tag was removed');
    });

    QUnit.test('tagBox set focused class with searchEnabled after press \'delete\' key', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: ['val-1', 'val-2', 'val-3', 'val-4'],
            searchEnabled: true,
            value: ['val-2', 'val-3'],
            opened: true,
            focusStateEnabled: true
        });

        const tagBox = $tagBox.dxTagBox('instance');

        this.clock.tick(TIME_TO_WAIT);

        const $input = $tagBox.find('.dx-texteditor-input');
        const keyboard = keyboardMock($input);

        keyboard
            .press('down');

        const $focusedItemList = $(tagBox._list.option('focusedElement'));
        assert.ok($focusedItemList.hasClass(FOCUSED_CLASS), 'list item obtained focus');

        keyboard
            .press('backspace');

        assert.ok($focusedItemList.hasClass(FOCUSED_CLASS), 'list item save focus after press \'delete\' key');
    });

    QUnit.test('remove tag by backspace', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: ['one', 'two', 'three'],
            value: ['one', 'two'],
            searchEnabled: true,
            searchTimeout: 0
        });

        this.clock.tick(TIME_TO_WAIT);

        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard.press('backspace');
        this.clock.tick(TIME_TO_WAIT);

        keyboard.press('backspace');
        this.clock.tick(TIME_TO_WAIT);

        assert.equal($tagBox.find('.' + TAGBOX_TAG_CLASS).length, 0, 'all tags removed');
    });

    QUnit.test('removing tag by backspace should not load data from DS', function(assert) {
        const data = ['one', 'two', 'three'];
        let loadedCount = 0;

        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: {
                load() {
                    loadedCount++;
                    return data;
                },
                byKey(index) {
                    return data[index];
                }
            },
            value: ['one', 'two'],
            deferRendering: true,
            searchEnabled: true,
            searchTimeout: 0
        });

        this.clock.tick(TIME_TO_WAIT);
        assert.equal(loadedCount, 1, 'data source loaded data');

        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard.press('backspace');
        this.clock.tick(TIME_TO_WAIT);

        assert.equal(loadedCount, 1, 'data source did not load data again');
    });

    QUnit.test('search after selection first item', function(assert) {
        const items = [{ text: 'item1' }, { text: 'item2' }];
        const $tagBox = $('#tagBox').dxTagBox({
            items,
            displayExpr: 'text',
            searchEnabled: true,
            searchExpr: 'text',
            searchTimeout: 0
        });

        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard.type('It');
        this.clock.tick(TIME_TO_WAIT);
        $('.dx-list-item').eq(0).trigger('dxclick');

        keyboard.type('It');
        this.clock.tick(TIME_TO_WAIT);

        assert.equal($input.val(), 'It', 'input value is correct');
    });

    QUnit.test('input should not be cleared after the \'value\' option change', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: ['one', 'two'],
            searchEnabled: true,
            searchTimeout: 0
        });

        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
        const searchValue = '123';

        $input.val(searchValue);
        $tagBox.dxTagBox('option', 'value', ['one']);

        assert.equal($input.val(), searchValue, 'input is clear');
    });

    QUnit.test('input should be cleared after list item is clicked', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: ['one', 'two'],
            searchEnabled: true,
            searchTimeout: 0,
            opened: true
        });

        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);

        $input.val('one');
        $('.dx-list-item').eq(0).trigger('dxclick');

        assert.equal($input.val(), '', 'input is clear');
    });

    QUnit.test('input should not be cleared after list item is clicked when checkboxes are visible', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: ['one', 'two'],
            searchEnabled: true,
            showSelectionControls: true,
            searchTimeout: 0,
            opened: true
        });

        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);

        $input.val('one');
        $('.dx-list-item').eq(0).trigger('dxclick');

        assert.equal($input.val(), 'one', 'input was not cleared');
    });

    QUnit.test('input should not be cleared after tag is removed', function(assert) {
        const items = [1, 2, 3];

        const $element = $('#tagBox').dxTagBox({
            items,
            value: items,
            searchEnabled: true
        });

        const $input = $element.find(`.${TEXTBOX_CLASS}`);
        const searchValue = '123';

        $input.val(searchValue);
        $($element.find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`).eq(0)).trigger('dxclick');

        assert.equal($input.val(), searchValue, 'search value is not cleared');
    });

    QUnit.testInActiveWindow('input should be cleared after widget focus out', function(assert) {
        const items = [1, 2, 3];
        const $element = $('#tagBox').dxTagBox({
            items,
            searchEnabled: true,
            focusStateEnabled: true
        });
        const instance = $element.dxTagBox('instance');

        instance.focus();
        const $input = $element.find(`.${TEXTBOX_CLASS}`);

        $input.val('123');
        instance.blur();

        assert.equal($input.val(), '', 'search value is cleared');
    });

    QUnit.test('search was work if acceptCustomValue is set to true', function(assert) {
        const $element = $('#tagBox').dxTagBox({
            dataSource: ['item 1', 'element 1', 'item 2'],
            searchEnabled: true,
            searchTimeout: 0,
            acceptCustomValue: true
        });

        const $input = $element.find(`.${TEXTBOX_CLASS}`);
        keyboardMock($input).type('1');

        $($input).trigger('change');
        const listItems = $('.dx-list-item');

        assert.equal(listItems.length, 2, 'search was performed');
    });

    QUnit.test('tag should be added after enter press key if popup was not opened early', function(assert) {
        const $element = $('#tagBox').dxTagBox({
            dataSource: ['q', 'er', 'fsd', 'fd'],
            searchEnabled: true,
            searchTimeout: 0,
            acceptCustomValue: true,
            focusStateEnabled: true,
            opened: false,
            deferRendering: true
        });

        const $input = $element.find(`.${TEXTBOX_CLASS}`);

        $input.focus();

        keyboardMock($input)
            .type('123')
            .keyDown('enter');

        assert.equal($element.find('.dx-tag').length, 1, 'tag is added');
    });

    QUnit.test('popup should be repaint after change height of input', function(assert) {
        const $element = $('#tagBox').dxTagBox({
            dataSource: ['Antigua and Barbuda', 'Albania', 'American Samoa'],
            value: ['Antigua and Barbuda', 'Albania'],
            searchTimeout: 0,
            acceptCustomValue: true,
            searchEnabled: true,
            focusStateEnabled: true,
            opened: true,
            width: 280
        });

        const instance = $element.dxTagBox('instance');
        const handlerStub = sinon.stub(instance._popup, 'repaint');

        const $input = $element.find(`.${TEXTBOX_CLASS}`);
        $input.focus();

        keyboardMock($input).type('American Samo');

        assert.ok(handlerStub.called, 'repaint was fired');
    });

    QUnit.test('the input size should change if autocompletion is Enabled (T378411)', function(assert) {
        const items = ['Antigua and Barbuda', 'Albania'];
        const $element = $('#tagBox').dxTagBox({
            dataSource: items,
            searchEnabled: true,
            searchMode: 'startswith'
        });
        const $input = $element.find('.dx-texteditor-input');
        const inputWidth = $input.width();

        keyboardMock($input)
            .type('a');
        this.clock.tick(TIME_TO_WAIT);
        assert.ok($input.width() > inputWidth, 'input size is changed for substitution');
    });

    QUnit.test('the previous value should be still selected after the new value was added after the new search (T880346)', function(assert) {
        const items = ['aaa', 'aab', 'bbb'];
        const $element = $('#tagBox').dxTagBox({
            dataSource: items,
            searchEnabled: true,
            applyValueMode: 'useButtons',
            searchTimeout: 0,
            showSelectionControls: true,
            deferRendering: true,
            minSearchLength: 2
        });
        const instance = $element.dxTagBox('instance');
        const $input = $element.find(`.${TEXTBOX_CLASS}`);
        const keyboard = keyboardMock($input);

        instance.open();
        const $popupWrapper = $(instance.content()).parents(`.${TAGBOX_POPUP_WRAPPER_CLASS}`);

        keyboard.type('aa');
        $popupWrapper.find(`.${LIST_CKECKBOX_CLASS}`).eq(0).trigger('dxclick');
        $popupWrapper.find(`.${POPUP_DONE_BUTTON_CLASS}`).trigger('dxclick');

        instance.close();
        instance.open();

        keyboard.type('aa');
        $popupWrapper.find(`.${LIST_CKECKBOX_CLASS}`).eq(1).trigger('dxclick');
        $popupWrapper.find(`.${POPUP_DONE_BUTTON_CLASS}`).trigger('dxclick');

        assert.strictEqual(instance.option('selectedItems').length, 2);
    });

    QUnit.test('filter should be reset after the search value clearing (T385456)', function(assert) {
        const items = ['111', '222', '333'];

        const $element = $('#tagBox').dxTagBox({
            searchTimeout: 0,
            items,
            searchEnabled: true,
            opened: true
        });

        const instance = $element.dxTagBox('instance');
        const $input = $element.find(`.${TEXTBOX_CLASS}`);

        keyboardMock($input, true)
            .type(items[0][0])
            .press('backspace');

        const $listItems = instance._list.$element().find('.dx-list-item');
        assert.equal($listItems.length, items.length, 'list items count is correct');
    });

    QUnit.test('filtering operation should pass \'customQueryParams\' to the data source (T683047)', function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: 'odata4.org(param=\'value\')',
            callback: ({ data }) => {
                assert.deepEqual(data, { $filter: 'this eq \'1\'' });
                ajaxMock.clear();
                done();
            }
        });

        $('#tagBox').dxTagBox({
            value: ['1'],
            dataSource: new DataSource({
                customQueryParams: { param: 'value' },
                store: new ODataStore({ version: 4, url: 'odata4.org' })
            })
        });
    });

    QUnit.test('filtering operation should pass \'expand\' parameter to the dataSource', function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: 'odata4.org',
            callback: ({ data }) => {
                assert.deepEqual(data, {
                    $filter: 'this eq \'1\'',
                    $expand: 'Orders'
                });
                ajaxMock.clear();
                done();
            }
        });

        $('#tagBox').dxTagBox({
            value: ['1'],
            dataSource: new DataSource({
                store: new ODataStore({ version: 4, url: 'odata4.org' }),
                expand: ['Orders']
            })
        });
    });

    QUnit.testInActiveWindow('input should be focused after click on field (searchEnabled is true or acceptCustomValue is true)', function(assert) {
        const items = ['111', '222', '333'];

        const $tagBox = $('#tagBox').dxTagBox({
            items,
            searchEnabled: true,
            acceptCustomValue: true,
            showDropDownButton: true
        });

        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
        const $dropDownButton = $tagBox.find('.dx-dropdowneditor-button');
        $dropDownButton.click();

        this.clock.tick(TIME_TO_WAIT);

        assert.ok($input.is(':focus'), 'input was focused');
    });

    QUnit.test('Select all\' checkBox is checked when filtered items are selected only', function(assert) {
        const items = ['111', '222', '333'];

        const $element = $('#tagBox').dxTagBox({
            searchTimeout: 0,
            items,
            searchEnabled: true,
            showSelectionControls: true,
            selectAllMode: 'allPages'
        });

        const instance = $element.dxTagBox('instance');
        const $input = $element.find(`.${TEXTBOX_CLASS}`);

        keyboardMock($input).type('1');
        $('.dx-list-item').trigger('dxclick');

        assert.equal(instance.option('selectedItems').length, 1, 'selected items count');
    });

    QUnit.testInActiveWindow('Filter should not be canceled after Apply button click', function(assert) {
        const items = ['111', '222', '333'];

        const $element = $('#tagBox').dxTagBox({
            searchTimeout: 0,
            items,
            searchEnabled: true,
            showSelectionControls: true,
            selectAllMode: 'allPages',
            applyValueMode: 'useButtons'
        });

        const instance = $element.dxTagBox('instance');
        const $input = $element.find(`.${TEXTBOX_CLASS}`);

        keyboardMock($input).type('1');
        $('.dx-list-item').trigger('dxclick');
        $('.dx-button.dx-popup-done').trigger('dxclick');

        assert.equal($(instance.content()).find('.dx-list-item').length, 1, 'filter was not cleared after Apply button click');
    });

    QUnit.test('filter should not be cleared when no focusout and no item selection happened', function(assert) {
        const items = ['111', '222', '333'];

        const $element = $('#tagBox').dxTagBox({
            searchTimeout: 0,
            items,
            searchEnabled: true,
            opened: true,
            showSelectionControls: true,
            selectAllMode: 'allPages'
        });

        const $input = $element.find(`.${TEXTBOX_CLASS}`);

        const keyboard = keyboardMock($input);
        keyboard.type('1');
        keyboard.press('esc');

        $input.trigger('dxclick');

        assert.equal($('.dx-item').length, 1, 'items count of list');
        assert.equal($.trim($('.dx-item').first().text()), '111', 'value of first item');
    });

    QUnit.test('TagBox with selection controls shouldn\'t clear search after click on item', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: ['test1', 'custom', 'test2'],
            searchEnabled: true,
            searchTimeout: 0,
            showSelectionControls: true,
            selectAllMode: 'allPages'
        });

        const instance = $tagBox.dxTagBox('instance');

        this.clock.tick(TIME_TO_WAIT);

        keyboardMock(instance._input()).type('te');
        this.clock.tick(TIME_TO_WAIT);

        const $listItems = $(`.${LIST_ITEM_CLASS}`);

        $listItems.first().trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT);

        $listItems.last().trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT);

        assert.deepEqual(instance.option('value'), ['test1', 'test2'], 'Correct value');
    });

    QUnit.testInActiveWindow('TagBox with selection controls shouldn\'t clear value when searchValue length becomes smaller then minSearchLength (T898390)', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [111, 222],
            searchEnabled: true,
            minSearchLength: 3,
            showSelectionControls: true,
        });
        this.clock.tick(TIME_TO_WAIT);

        const instance = $tagBox.dxTagBox('instance');
        const $input = $(instance._input());
        const keyboard = keyboardMock($input);

        $input.focusin();
        keyboard
            .type('111');
        this.clock.tick(TIME_TO_WAIT);

        keyboard.press('enter');
        this.clock.tick(TIME_TO_WAIT);
        assert.deepEqual(instance.option('value'), [111], 'value is selected');

        $input.focusout();
        this.clock.tick(TIME_TO_WAIT);

        keyboard.type('1');
        this.clock.tick(TIME_TO_WAIT);
        assert.deepEqual(instance.option('value'), [111], 'value is not removed');
        assert.strictEqual(instance.option('text'), '1', 'text is correct');
    });

    QUnit.testInActiveWindow('TagBox without selection controls should search value when minSearchLength is exceeded and there are selected items (T932182)', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [111, 222],
            value: [111],
            searchEnabled: true,
            minSearchLength: 2,
        });
        this.clock.tick(TIME_TO_WAIT);

        const instance = $tagBox.dxTagBox('instance');
        const $input = $(instance._input());
        const keyboard = keyboardMock($input);

        $input.focusin();
        keyboard
            .type('22');
        this.clock.tick(TIME_TO_WAIT);
        const list = $tagBox.dxTagBox('instance')._list;
        assert.deepEqual(list.getDataSource().items(), [222], 'dataSource was updated');
    });

    QUnit.testInActiveWindow('TagBox with selection controls should search value when minSearchLength is exceeded and there are selected items (T932182)', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [111, 222],
            value: [111],
            searchEnabled: true,
            minSearchLength: 2,
            showSelectionControls: true
        });
        this.clock.tick(TIME_TO_WAIT);

        const instance = $tagBox.dxTagBox('instance');
        const $input = $(instance._input());
        const keyboard = keyboardMock($input);

        $input.focusin();
        keyboard
            .type('22');
        this.clock.tick(TIME_TO_WAIT);
        const list = $tagBox.dxTagBox('instance')._list;
        assert.deepEqual(list.getDataSource().items(), [222], 'dataSource was updated');
    });

    QUnit.test('load tags data should not raise an error after widget has been disposed', function(assert) {
        assert.expect(1);

        const $container = $('#tagBox').dxTagBox({
            dataSource: {
                load: (loadOptions) => {
                    const d = $.Deferred();

                    setTimeout(function() {
                        const data = loadOptions && loadOptions.searchValue ?
                            ['test1'] :
                            ['test1', 'test2', 'test3'];

                        d.resolve(data);
                    }, TIME_TO_WAIT);

                    return d.promise();
                }
            },
            searchEnabled: true,
            searchTimeout: 0,
            onValueChanged: function({ component, value }) {
                if(value.length === 2) {
                    let isOK = true;

                    try {
                        component.dispose();
                    } catch(e) {
                        isOK = false;
                    }

                    assert.ok(isOK, 'there is no exception');
                }
            },
            value: ['test2']
        });
        const instance = $container.dxTagBox('instance');

        this.clock.tick(TIME_TO_WAIT);

        keyboardMock(instance._input()).type('te');
        this.clock.tick(TIME_TO_WAIT);

        const $listItems = $(`.${LIST_ITEM_CLASS}`);

        $listItems.first().trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT);
    });

    QUnit.test('TagBox should not request dataSource after item selecting using search when all selected items are available (T944099)', function(assert) {
        const loadStub = sinon.stub().returns([{ id: 1, text: 'item1' }, { id: 2, text: 'item2' }]);
        const instance = $('#tagBox').dxTagBox({
            dataSource: {
                load: loadStub
            },
            searchEnabled: true,
            searchTimeout: 0,
            valueExpr: 'id',
            displayExpr: 'text',
            searchExpr: 'text',
            opened: true
        }).dxTagBox('instance');

        keyboardMock(instance._input()).type('1');
        this.clock.tick(TIME_TO_WAIT);
        const $item = $('.dx-list-item').eq(0);
        $item.trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT);

        assert.strictEqual(loadStub.callCount, 2);
    });
});

QUnit.module('popup position and size', moduleSetup, () => {
    QUnit.testInActiveWindow('popup height should be depended from its content height', function(assert) {
        const $element = $('#tagBox').dxTagBox({
            dataSource: ['Antigua and Barbuda', 'Albania', 'American Samoa'],
            acceptCustomValue: true,
            searchEnabled: true,
            focusStateEnabled: true,
            searchTimeout: 0,
            opened: true
        });

        const instance = $element.dxTagBox('instance');
        const height = instance._popup._$popupContent.height();

        const $input = $element.find(`.${TEXTBOX_CLASS}`);
        $input.focus();

        keyboardMock($input).type('American Samo');

        const currentHeight = instance._popup._$popupContent.height();

        assert.notEqual(height, currentHeight);
    });

    QUnit.test('popup changes its position when field height changed', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'],
            showSelectionControls: true,
            width: 100,
            searchEnabled: true
        });

        const tagBox = $tagBox.dxTagBox('instance');

        tagBox.open();

        const initialHeight = $tagBox.height();
        const $selectAllItem = $('.dx-list-select-all');
        const popupContent = $(tagBox.content());
        const popupContentTop = popupContent.offset().top;

        $($selectAllItem).trigger('dxclick');

        assert.roughEqual(popupContent.offset().top, popupContentTop - initialHeight + $tagBox.height(), 1, 'selectAll moved');
    });

    QUnit.test('refresh popup size after dataSource loaded', function(assert) {
        const d = $.Deferred();

        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: {
                load() {
                    return d.promise();
                }
            }
        });

        $($tagBox.find(`.${TEXTBOX_CLASS}`)).trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT);

        const $popup = $('.dx-popup-content');
        const popupHeight = $popup.height();

        d.resolve(['first', 'second', 'third', 'fourth']);
        this.clock.tick(TIME_TO_WAIT);

        assert.ok($popup.height() > popupHeight, 'popup enlarged after loading');
    });

    QUnit.test('Second search should be work, when first search are running', function(assert) {
        const items = [
            { name: 'Zambia', code: 'ZM' },
            { name: 'Zimbabwe', code: 'ZW' }
        ];

        const $element = $('#tagBox').dxTagBox({
            dataSource: {
                load(loadOptions) {
                    const filterOptions = loadOptions.searchValue ? loadOptions.searchValue : '';
                    const d = new $.Deferred();
                    setTimeout(() => {
                        d.resolve(dataQuery(items).filter('name', 'contains', filterOptions).toArray(), { totalCount: items.length });
                    }, 2000);
                    return d.promise();
                },
                key: 'name',
                byKey(key) {
                    return key;
                }
            },
            searchEnabled: true,
            searchTimeout: 100,
            opened: true
        });
        this.clock.tick(2000);

        const $input = $element.find(`.${TEXTBOX_CLASS}`);

        const keyboard = keyboardMock($input);
        keyboard.type('Z');
        this.clock.tick(200);

        keyboard.type('i');
        this.clock.tick(4100);

        assert.equal($('.dx-list-item').length, 1, 'search was completed');
    });

    QUnit.test('load selected item data via custom store', function(assert) {
        let testPassed = true;
        try {
            const $tagBox = $('#tagBox').dxTagBox({
                dataSource: {
                    load() {
                        return new $.Deferred().resolve({ data: [{ id: 2, name: 'test' }], totalCount: 1 }).promise();
                    },
                    key: 'id'
                },
                valueExpr: 'id',
                displayExpr: 'name',
                value: [2]
            });
            const tagText = $tagBox.find(`.${TAGBOX_TAG_CLASS}`).text();

            assert.strictEqual(tagText, 'test', 'correct display value');
        } catch(e) {
            testPassed = false;
        }

        assert.ok(testPassed, 'There is no errors during test');
    });
});

QUnit.module('the \'acceptCustomValue\' option', moduleSetup, () => {
    QUnit.test('acceptCustomValue', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: ['item1', 'item2'],
            acceptCustomValue: true,
            value: ['item1'],
            focusStateEnabled: true
        });

        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);

        const keyboard = keyboardMock($input);
        keyboard.type('test');

        assert.deepEqual($tagBox.dxTagBox('option', 'value'), ['item1'], 'value was not added to values before pressing enter key');

        keyboard.press('enter');
        this.clock.tick(TIME_TO_WAIT);

        assert.equal($('.dx-list-item').length, 2, 'items is not filtered');
        assert.deepEqual($tagBox.dxTagBox('option', 'value'), ['item1', 'test'], 'value was added to values');
        this.clock.tick(TIME_TO_WAIT);

        assert.equal($.trim($tagBox.find('.' + TAGBOX_TAG_CONTAINER_CLASS).text()), 'item1test', 'all tags rendered');
    });

    QUnit.test('acceptCustomValue should not add empty tag', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            acceptCustomValue: true
        });

        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
        const keyboard = keyboardMock($input);
        keyboard.press('enter');

        assert.deepEqual($tagBox.dxTagBox('option', 'value'), [], 'empty value was not added');
    });

    QUnit.test('adding the custom tag should clear input value (T385448)', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            acceptCustomValue: true
        });

        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);

        keyboardMock($input)
            .type('custom')
            .press('enter');

        assert.equal($input.val(), '', 'the input is empty');
    });

    QUnit.test('adding the custom tag shouldn\'t lead to duplicating of ordinary tags', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            acceptCustomValue: true,
            items: [1, 2, 3]
        });
        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
        const tagBoxInstance = $tagBox.dxTagBox('instance');

        keyboardMock($input)
            .type('custom')
            .press('enter');

        $($tagBox.find(`.${LIST_ITEM_CLASS}`).first()).trigger('dxclick');
        const $tags = $tagBox.find('.dx-tag');

        assert.strictEqual($tags.length, 2, 'only two tags are added');
        assert.deepEqual(tagBoxInstance.option('selectedItems'), ['custom', 1], 'selected items are correct');
    });
});

QUnit.module('the \'selectedItems\' option', moduleSetup, () => {
    QUnit.test('The \'selectedItems\' option value is correct on init if the \'value\' option is specified', function(assert) {
        const items = [1, 2, 3];

        const tagBox = $('#tagBox').dxTagBox({
            items,
            value: [items[1]]
        }).dxTagBox('instance');

        assert.deepEqual(tagBox.option('selectedItems'), [items[1]], 'the \'selectedItems\' option value is correct');
    });

    QUnit.test('onSelectionChanged handler should be called if selected items was changed at runtime', function(assert) {
        const items = [1, 2, 3];
        const selectionChangedHandler = sinon.spy();

        const tagBox = $('#tagBox').dxTagBox({
            items,
            opened: true,
            onSelectionChanged: selectionChangedHandler
        }).dxTagBox('instance');

        const callCountOnInit = selectionChangedHandler.callCount;
        tagBox.option('selectedItems', [items[0], items[1]]);
        assert.strictEqual(selectionChangedHandler.callCount, callCountOnInit + 1, 'onSelectionChanged handler was called');
    });

    QUnit.test('The \'selectedItems\' option changes after the \'value\' option', function(assert) {
        const items = [1, 2, 3];

        const tagBox = $('#tagBox').dxTagBox({
            items
        }).dxTagBox('instance');

        tagBox.option('value', items);
        assert.deepEqual(tagBox.option('selectedItems'), items, 'the \'selectedItems\' option value is changed');
    });

    QUnit.test('selected items should be correct if the list item is selected', function(assert) {
        const items = [1, 2, 3];

        const tagBox = $('#tagBox').dxTagBox({
            items,
            value: [items[0]],
            opened: true
        }).dxTagBox('instance');

        const $listItems = tagBox._list.$element().find('.dx-list-item');

        $($listItems.eq(1)).trigger('dxclick');
        assert.deepEqual(tagBox.option('selectedItems'), [items[0], items[1]], 'the \'selectedItems\' option value is correct');
    });

    QUnit.test('selected items should be correct if the list item is unselected', function(assert) {
        const items = [1, 2, 3];

        const tagBox = $('#tagBox').dxTagBox({
            items,
            value: items,
            opened: true
        }).dxTagBox('instance');

        const $listItems = tagBox._list.$element().find('.dx-list-item');

        $($listItems.eq(0)).trigger('dxclick');
        assert.deepEqual(tagBox.option('selectedItems'), [items[1], items[2]], 'the \'selectedItems\' option value is correct');
    });

    QUnit.test('all items are selected correctly when the last item is deselected from an editor', function(assert) {
        let selectedItems;

        const tagBox = $('#tagBox').dxTagBox({
            dataSource: {
                paginate: true,
                pageSize: 1,
                store: [1, 2, 3, 4, 5, 6]
            },
            selectAllMode: 'allPages',
            showSelectionControls: true,
            maxDisplayedTags: 3,
            onMultiTagPreparing(args) {
                selectedItems = args.selectedItems;

                if(selectedItems.length < 6) {
                    args.cancel = true;
                } else {
                    args.text = 'All selected (' + selectedItems.length + ')';
                }
            }
        }).dxTagBox('instance');

        tagBox.option('opened', true);
        this.clock.tick(TIME_TO_WAIT);

        $('.dx-list-select-all-checkbox').trigger('dxclick');

        $(`.${LIST_CKECKBOX_CLASS}`).first().trigger('dxclick');
        $('.dx-tag-remove-button').last().trigger('dxclick');

        $('.dx-list-select-all-checkbox').trigger('dxclick');

        assert.equal(selectedItems.length, 6, 'All items should be selected');
    });
});

QUnit.module('the \'onSelectionChanged\' option', moduleSetup, () => {
    QUnit.test('the \'onSelectionChanged\' action should contain correct \'addedItems\' argument', function(assert) {
        const items = [1, 2, 3];
        const spy = sinon.spy();

        const tagBox = $('#tagBox').dxTagBox({
            items,
            opened: true,
            onSelectionChanged: spy
        }).dxTagBox('instance');

        const $listItems = tagBox._list.$element().find('.dx-list-item');

        $($listItems.eq(0)).trigger('dxclick');
        assert.deepEqual(spy.args[1][0].addedItems, [items[0]], 'first item is in the \'addedItems\' argument');

        $($listItems.eq(1)).trigger('dxclick');
        assert.deepEqual(spy.args[2][0].addedItems, [items[1]], 'second item is in the \'addedItems\' argument');

        $($listItems.eq(1)).trigger('dxclick');
        assert.deepEqual(spy.args[3][0].addedItems, [], 'no items in the \'addedItems\' argument after item is unselected');
    });

    QUnit.test('the \'onSelectionChanged\' action should contain correct \'removedItems\' argument', function(assert) {
        const items = [1, 2, 3];
        const spy = sinon.spy();

        const tagBox = $('#tagBox').dxTagBox({
            items,
            value: items,
            opened: true,
            onSelectionChanged: spy
        }).dxTagBox('instance');

        const $listItems = tagBox._list.$element().find('.dx-list-item');

        $($listItems.eq(0)).trigger('dxclick');
        assert.deepEqual(spy.args[1][0].removedItems, [items[0]], 'first item is in the \'removedItems\' argument');

        $($listItems.eq(1)).trigger('dxclick');
        assert.deepEqual(spy.args[2][0].removedItems, [items[1]], 'second item is in the \'removedItems\' argument');

        $($listItems.eq(1)).trigger('dxclick');
        assert.deepEqual(spy.args[3][0].removedItems, [], 'not items in the \'removedItems\' argument after item is selected');
    });

    const createCustomStore = (data, key) => {
        const arrayStore1 = new ArrayStore(data);

        const arrayStore2 = new ArrayStore({
            data: data.map(item => {
                return $.extend({}, item);
            }),
            key
        });

        return new CustomStore({
            load(options) {
                return arrayStore1.load(options);
            },
            byKey(key) {
                return arrayStore2.byKey(key);
            },
            key
        });
    };

    QUnit.test('the \'onSelectionChanged\' action should contain correct \'addedItems\' when a remote store is used', function(assert) {
        const data = [
            {
                'id': 1,
                'title': 'item 1'
            },
            {
                'id': 2,
                'title': 'item 2'
            },
            {
                'id': 3,
                'title': 'item 3'
            }];

        const spy = sinon.spy();

        const tagBox = $('#tagBox').dxTagBox({
            dataSource: createCustomStore(data, 'id'),
            showSelectionControls: true,
            applyValueMode: 'useButtons',
            value: [1, 2],
            displayExpr: 'id',
            valueExpr: 'id',
            opened: true,
            onSelectionChanged: spy
        }).dxTagBox('instance');

        const $listItems = tagBox._list.$element().find('.dx-list-item');

        $($listItems.eq(2)).trigger('dxclick');
        $('.dx-button.dx-popup-done').trigger('dxclick');

        assert.deepEqual(spy.args[1][0].addedItems, [data[2]], 'the \'addedItems\' argument');
        assert.equal(spy.args[1][0].removedItems.length, 0, 'the \'removedItems\' argument');
    });

    QUnit.test('the \'onSelectionChanged\' action should contain correct \'removedItems\' when a remote store is used', function(assert) {
        const data = [
            {
                'id': 1,
                'title': 'item 1'
            },
            {
                'id': 2,
                'title': 'item 2'
            },
            {
                'id': 3,
                'title': 'item 3'
            }];

        const spy = sinon.spy();

        const tagBox = $('#tagBox').dxTagBox({
            dataSource: createCustomStore(data, 'id'),
            value: [1, 2, 3],
            displayExpr: 'id',
            valueExpr: 'id',
            onSelectionChanged: spy
        }).dxTagBox('instance');

        const $removeButtons = tagBox.$element().find('.dx-tag-remove-button');

        $($removeButtons.eq(2)).trigger('dxclick');

        assert.deepEqual(spy.args[1][0].removedItems, [data[2]], 'the \'removedItems\' argument');
        assert.equal(spy.args[1][0].addedItems.length, 0, 'the \'addedItems\' argument');
    });

    QUnit.test('selectionChanged event should be raised if selected items were changed', function(assert) {
        const items = [1, 2, 3];
        const selectionChangedHandler = sinon.spy();
        const tagBox = $('#tagBox').dxTagBox({
            items,
            opened: true
        }).dxTagBox('instance');

        tagBox.on('selectionChanged', selectionChangedHandler);
        tagBox.option('value', [1]);

        assert.strictEqual(selectionChangedHandler.callCount, 1, 'selectionChanged event was raised');
    });
});

QUnit.module('the \'fieldTemplate\' option', moduleSetup, () => {
    QUnit.test('the \'fieldTemplate\' function should be called only once on init and value change', function(assert) {
        let callCount = 0;

        const tagBox = $('#tagBox').dxTagBox({
            dataSource: [1, 2, 3],
            value: [1],
            fieldTemplate(selectedItems) {
                callCount++;
                return $('<div>').dxTextBox();
            }
        }).dxTagBox('instance');

        assert.equal(callCount, 1, 'the \'fieldTemplate\' was called once on init');

        callCount = 0;
        tagBox.option('value', [1, 2]);
        assert.equal(callCount, 1, 'the \'fieldTemplate\' was called once on value change');
    });

    QUnit.test('the \'fieldTemplate\' has correct arguments', function(assert) {
        const args = [];

        const tagBox = $('#tagBox').dxTagBox({
            dataSource: [1, 2, 3],
            value: [1],
            fieldTemplate(selectedItems, fieldElement) {
                assert.equal(isRenderer(fieldElement), !!config().useJQuery, 'fieldElement is correct');

                args.push(selectedItems);
                return $('<div>').dxTextBox();
            }
        }).dxTagBox('instance');

        tagBox.option('value', [1, 2, 3]);
        tagBox.option('value', [2]);

        assert.deepEqual(args[0], [1], 'arguments are correct on init');
        assert.deepEqual(args[1], [1, 2, 3], 'arguments are correct after adding values');
        assert.deepEqual(args[2], [2], 'arguments are correct after removing values');
    });

    QUnit.testInActiveWindow('field should not be updated on focus changing', function(assert) {
        const fieldTemplate = () => {
            return $('<div>').dxTextBox();
        };
        const fieldTemplateSpy = sinon.spy(fieldTemplate);
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            fieldTemplate: fieldTemplateSpy,
            opened: true,
            focusStateEnabled: true
        });

        fieldTemplateSpy.reset();
        keyboardMock($tagBox.find('.dx-texteditor-input'))
            .focus()
            .press('down');

        assert.equal(fieldTemplateSpy.callCount, 0, 'fieldTemplate render was not called');
    });

    QUnit.test('tag can be removed by click on the remove button', function(assert) {
        const fieldTemplate = () => {
            return $('<div>').dxTextBox();
        };
        const tagBox = $('#tagBox').dxTagBox({
            fieldTemplate,
            items: [1, 2, 3],
            value: [1],
            opened: true,
            focusStateEnabled: true
        }).dxTagBox('instance');

        const $container = tagBox.$element().find('.' + TAGBOX_TAG_CONTAINER_CLASS);
        const $tagRemoveButtons = $container.find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`);
        $($tagRemoveButtons.eq(0)).trigger('dxclick');

        assert.deepEqual(tagBox.option('value'), [], 'tag is removed');
    });

    QUnit.test('tagbox should get template classes after fieldTemplate option change', function(assert) {
        const fieldTemplate = () => {
            return $('<div>').dxTextBox();
        };

        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            focusStateEnabled: true
        });

        $tagBox.dxTagBox('instance').option('fieldTemplate', fieldTemplate);

        assert.ok(!$tagBox.hasClass(TAGBOX_DEFAULT_FIELD_TEMPLATE_CLASS), 'default template class was applied');
        assert.ok($tagBox.hasClass(TAGBOX_CUSTOM_FIELD_TEMPLATE_CLASS), 'default template class wasn\'t applied');
    });

    QUnit.test('value should be cleared after deselect all items if fieldTemplate and searchEnabled is used', function(assert) {
        const $field = $('<div>');

        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            opened: true,
            value: [1],
            searchEnabled: true,
            fieldTemplate(itemData, container) {
                const $textBox = $('<div>').dxTextBox();

                itemData = Array.isArray(itemData) ? itemData : [itemData];
                $field.text(itemData[0] || '');

                $(container).append($field).append($textBox);
            }
        });

        const $items = $(`.${LIST_ITEM_CLASS}`);

        assert.equal($field.text(), '1', 'text was added on init');

        $($items.eq(0)).trigger('dxclick');

        assert.deepEqual($tagBox.dxTagBox('option', 'value'), [], 'value was cleared');
        assert.equal($field.text(), '', 'text was cleared after the deselect');
    });
});

QUnit.module('applyValueMode = \'useButtons\'', {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();

        this._init = (options) => {
            this.$element = $('<div>')
                .appendTo('#qunit-fixture')
                .dxTagBox(options);
            this.instance = this.$element.dxTagBox('instance');
            this.$listItems = $('.dx-list-item');
            this.$popupWrapper = $('.' + TAGBOX_POPUP_WRAPPER_CLASS);
            this.getListInstance = () => {
                return this.instance._list;
            };
        };

        this._init({
            applyValueMode: 'useButtons',
            items: [1, 2, 3],
            opened: true
        });

        this.reinit = (options) => {
            this.$element.remove();
            this._init(options);
        };
    },
    afterEach: function() {
        this.$element.remove();
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    QUnit.test('popup should not be hidden after list item click', function(assert) {
        const $listItems = this.$listItems;

        $($listItems.eq(0)).trigger('dxclick');
        assert.ok(this.instance.option('opened'), 'popup is visible after the first item is clicked');
        assert.deepEqual(this.instance.option('value'), [], 'value is not changed after the first item is clicked');

        $($listItems.eq(1)).trigger('dxclick');
        assert.ok(this.instance.option('opened'), 'popup is visible after the second item is clicked');
        assert.deepEqual(this.instance.option('value'), [], 'value is not changed after the second item is clicked');
    });

    QUnit.test('tags should not be rendered on list item click', function(assert) {
        const $listItems = this.$listItems;

        $($listItems.eq(0)).trigger('dxclick');
        assert.equal(this.$element.find('.dx-tag').length, 0, 'tag is not rendered after the first list item is clicked');

        $($listItems.eq(1)).trigger('dxclick');
        assert.equal(this.$element.find('.dx-tag').length, 0, 'tag is not rendered after the second list item is clicked');
    });

    QUnit.test('value should be applied after the \'done\' button click', function(assert) {
        const items = this.instance.option('items');
        const $listItems = this.$listItems;

        $($listItems.eq(0)).trigger('dxclick');
        $($listItems.eq(1)).trigger('dxclick');
        assert.deepEqual(this.instance.option('value'), [], 'value is not changed after items are clicked');

        $(this.$popupWrapper.find(`.${POPUP_DONE_BUTTON_CLASS}`)).trigger('dxclick');
        assert.ok(!this.instance.option('opened'), 'popup is hidden after the \'done\' button is clicked');
        assert.deepEqual(this.instance.option('value'), [items[0], items[1]], 'value is changed to selected list items');
    });

    QUnit.test('value should not be changed after the \'cancel\' button click', function(assert) {
        const $listItems = this.$listItems;

        $($listItems.eq(0)).trigger('dxclick');
        $($listItems.eq(1)).trigger('dxclick');
        assert.deepEqual(this.instance.option('value'), [], 'value is not changed after items are clicked');

        $(this.$popupWrapper.find('.dx-popup-cancel')).trigger('dxclick');
        assert.ok(!this.instance.option('opened'), 'popup is hidden after the \'done\' button is clicked');
        assert.deepEqual(this.instance.option('value'), [], 'value is changed to selected list items');
    });

    QUnit.test('value should not be changed after the popup is closed', function(assert) {
        const $listItems = this.$listItems;
        const initialValue = this.instance.option('value');

        $($listItems.eq(0)).trigger('dxclick');
        $($listItems.eq(1)).trigger('dxclick');
        this.instance.close();

        assert.deepEqual(this.instance.option('value'), initialValue, 'value is not changed');
    });

    QUnit.test('selected list items should be reset after the \'cancel\' button is clicked', function(assert) {
        const $listItems = this.$listItems;

        $($listItems.eq(0)).trigger('dxclick');
        $($listItems.eq(1)).trigger('dxclick');
        $(this.$popupWrapper.find('.dx-popup-cancel')).trigger('dxclick');

        assert.deepEqual(this.getListInstance().option('selectedItems'), [], 'selected items are reset');
    });

    QUnit.test('selected list items should be reset after the popup is closed', function(assert) {
        const $listItems = this.$listItems;

        $($listItems.eq(0)).trigger('dxclick');
        $($listItems.eq(1)).trigger('dxclick');
        this.instance.close();

        assert.deepEqual(this.getListInstance().option('selectedItems'), [], 'selected items are reset');
    });

    QUnit.test('list items selection should not be reset after next page loading', function(assert) {
        const dataSource = new DataSource({
            store: new CustomStore({
                load(loadOptions) {
                    const items = [];
                    const take = loadOptions.take;
                    const skip = loadOptions.skip;

                    for(let i = 0; i < take; i++) {
                        items.push(i + skip);
                    }

                    return items;
                }
            }),
            paginate: true
        });

        this.reinit({
            dataSource,
            applyValueMode: 'useButtons',
            opened: true,
            deferRendering: true
        });

        const list = this.getListInstance();
        const $list = list.$element();
        const $listItems = this.$listItems;

        $($listItems.eq(0)).trigger('dxclick');
        $($listItems.eq(1)).trigger('dxclick');

        const selectedItemsCount = list.option('selectedItems').length;
        $list.dxScrollView('option', 'onReachBottom')();

        assert.equal(list.option('selectedItems').length, selectedItemsCount, 'selection is not reset');
    });

    QUnit.test('the \'selectedItems\' should not be updated after list item click', function(assert) {
        $(this.$listItems.eq(0)).trigger('dxclick');
        assert.deepEqual(this.instance.option('selectedItems'), [], 'selected items are not changed');
    });

    QUnit.test('\'onValueChanged\' should not be fired after clicking on list item (T378374)', function(assert) {
        const valueChangedSpy = sinon.spy();
        this.reinit({
            applyValueMode: 'useButtons',
            items: [1, 2, 3],
            onValueChanged: valueChangedSpy,
            showSelectionControls: true,
            opened: true
        });

        $(this.$listItems.eq(1)).trigger('dxclick');
        assert.equal(valueChangedSpy.callCount, 0, 'the \'onValueChanged\' was not fired after checking an item');
    });

    QUnit.test('\'onValueChanged\' should not be fired after clicking on list item when value is not empty (T378374)', function(assert) {
        const valueChangedSpy = sinon.spy();
        this.reinit({
            applyValueMode: 'useButtons',
            items: [1, 2, 3],
            value: [1],
            onValueChanged: valueChangedSpy,
            showSelectionControls: true,
            opened: true
        });

        $(this.$listItems.eq(1)).trigger('dxclick');
        assert.equal(valueChangedSpy.callCount, 0, 'the \'onValueChanged\' was not fired after checking an item');
    });

    QUnit.test('the list selection should be updated after value is changed while editor is opened', function(assert) {
        const items = this.instance.option('items');
        const list = this.getListInstance();

        this.instance.option('value', [items[0], items[1]]);
        assert.equal(list.option('selectedItems').length, 2, 'list selection is updated after adding items');

        this.instance.option('value', [items[1]]);
        assert.equal(this.getListInstance().option('selectedItems').length, 1, 'list selection is updated after removing item');
    });

    QUnit.testInActiveWindow('the value should be applied after search (T402855)', function(assert) {
        this.reinit({
            applyValueMode: 'useButtons',
            items: ['aa', 'ab', 'bb', 'ac', 'bc'],
            showSelectionControls: true,
            searchEnabled: true,
            searchTimeout: 0,
            opened: true
        });

        const $input = this.$element.find(`.${TEXTBOX_CLASS}`);
        const $doneButton = $('.dx-button.dx-popup-done');

        keyboardMock($input)
            .focus()
            .type('c');

        $('.dx-list-select-all-checkbox').trigger('dxclick');

        $($input).trigger($.Event('focusout', { relatedTarget: $doneButton.get(0) }));
        $doneButton.trigger('dxclick');

        assert.deepEqual(this.instance.option('value'), ['ac', 'bc'], 'value is applied correctly');
    });

    QUnit.test('the search should be cleared after pressing the \'OK\' button', function(assert) {
        this.reinit({
            applyValueMode: 'useButtons',
            items: ['aa', 'ab', 'bb', 'ac', 'bc'],
            showSelectionControls: true,
            searchEnabled: true,
            searchTimeout: 0,
            opened: true
        });

        const $input = this.$element.find(`.${TEXTBOX_CLASS}`);

        keyboardMock($input)
            .focus()
            .type('c');

        $('.dx-button.dx-popup-done').trigger('dxclick');

        assert.equal($input.val(), '', 'the search is cleared');
        assert.notOk(this.instance._dataSource.searchValue(), 'The search value is cleared');
    });

    QUnit.test('value should keep initial tag order', function(assert) {
        const items = this.instance.option('items');
        const $listItems = this.$listItems;

        $($listItems.eq(1)).trigger('dxclick');
        $(this.$popupWrapper.find(`.${POPUP_DONE_BUTTON_CLASS}`)).trigger('dxclick');

        this.instance.option('opened', true);

        $($listItems.eq(0)).trigger('dxclick');
        $(this.$popupWrapper.find(`.${POPUP_DONE_BUTTON_CLASS}`)).trigger('dxclick');

        assert.deepEqual(this.instance.option('value'), [items[1], items[0]], 'tags order is correct');
    });

    QUnit.test('value should keep initial tag order with object items', function(assert) {
        this.reinit({
            items: [{ id: 1, name: 'Alex' }, { id: 2, name: 'John' }, { id: 3, name: 'Max' }],
            valueExpr: 'id',
            displayExpr: 'name',
            opened: true
        });

        const items = this.instance.option('items');
        const $listItems = this.$listItems;

        $($listItems.eq(1)).trigger('dxclick');
        $(this.$popupWrapper.find(`.${POPUP_DONE_BUTTON_CLASS}`)).trigger('dxclick');

        this.instance.option('opened', true);

        $($listItems.eq(0)).trigger('dxclick');
        $(this.$popupWrapper.find(`.${POPUP_DONE_BUTTON_CLASS}`)).trigger('dxclick');

        assert.deepEqual(this.instance.option('value'), [items[1].id, items[0].id], 'tags order is correct');
    });

    QUnit.test('value should keep initial tag order with object items and \'this\' valueExpr', function(assert) {
        this.reinit({
            items: [{ id: 1, name: 'Alex' }, { id: 2, name: 'John' }, { id: 3, name: 'Max' }],
            valueExpr: 'this',
            displayExpr: 'name',
            opened: true
        });

        const items = this.instance.option('items');
        const $listItems = this.$listItems;

        $($listItems.eq(1)).trigger('dxclick');
        $(this.$popupWrapper.find(`.${POPUP_DONE_BUTTON_CLASS}`)).trigger('dxclick');

        this.instance.option('opened', true);

        $($listItems.eq(0)).trigger('dxclick');
        $(this.$popupWrapper.find(`.${POPUP_DONE_BUTTON_CLASS}`)).trigger('dxclick');

        assert.deepEqual(this.instance.option('value'), [items[1], items[0]], 'tags order is correct');
    });

    QUnit.test('Value should keep initial order if tags aren\'t changed', function(assert) {
        const items = this.instance.option('items');
        const $listItems = this.$listItems;

        $($listItems.eq(0)).trigger('dxclick');
        $($listItems.eq(1)).trigger('dxclick');
        $(this.$popupWrapper.find(`.${POPUP_DONE_BUTTON_CLASS}`)).trigger('dxclick');
        assert.deepEqual(this.instance.option('value'), [items[0], items[1]], 'tags order is correct');

        this.instance.option('opened', true);
        $(this.$popupWrapper.find(`.${POPUP_DONE_BUTTON_CLASS}`)).trigger('dxclick');
        assert.deepEqual(this.instance.option('value'), [items[0], items[1]], 'tags order is correct');
    });

    QUnit.test('Value should correctly update if items count isn\'t changed', function(assert) {
        const items = this.instance.option('items');
        const $listItems = this.$listItems;

        $($listItems.eq(1)).trigger('dxclick');
        $($listItems.eq(2)).trigger('dxclick');
        $(this.$popupWrapper.find(`.${POPUP_DONE_BUTTON_CLASS}`)).trigger('dxclick');
        assert.deepEqual(this.instance.option('value'), [items[1], items[2]], 'tags order is correct');

        this.instance.option('opened', true);
        $($listItems.eq(1)).trigger('dxclick');
        $($listItems.eq(0)).trigger('dxclick');
        $(this.$popupWrapper.find(`.${POPUP_DONE_BUTTON_CLASS}`)).trigger('dxclick');
        assert.deepEqual(this.instance.option('value'), [items[2], items[0]], 'tags order is correct');
    });

    QUnit.test('Object value should keep initial order if tags aren\'t changed', function(assert) {
        this.reinit({
            items: [{ id: 1, name: 'Alex' }, { id: 2, name: 'John' }, { id: 3, name: 'Max' }],
            valueExpr: 'id',
            displayExpr: 'name',
            opened: true
        });

        const items = this.instance.option('items');
        const $listItems = this.$listItems;

        $($listItems.eq(0)).trigger('dxclick');
        $($listItems.eq(1)).trigger('dxclick');
        $(this.$popupWrapper.find(`.${POPUP_DONE_BUTTON_CLASS}`)).trigger('dxclick');
        assert.deepEqual(this.instance.option('value'), [items[0].id, items[1].id], 'tags order is correct');

        this.instance.option('opened', true);
        $(this.$popupWrapper.find(`.${POPUP_DONE_BUTTON_CLASS}`)).trigger('dxclick');
        assert.deepEqual(this.instance.option('value'), [items[0].id, items[1].id], 'tags order is correct');
    });

    QUnit.test('Value should correctly update if valueExpr is \'this\' and value is object', function(assert) {
        this.reinit({
            items: [{ id: 1, name: 'Alex' }, { id: 2, name: 'John' }, { id: 3, name: 'Max' }],
            valueExpr: 'this',
            displayExpr: 'name',
            opened: true
        });

        const items = this.instance.option('items');
        const $listItems = this.$listItems;

        $($listItems.eq(0)).trigger('dxclick');
        $($listItems.eq(1)).trigger('dxclick');
        $(this.$popupWrapper.find(`.${POPUP_DONE_BUTTON_CLASS}`)).trigger('dxclick');

        this.instance.option('opened', true);
        $(this.$popupWrapper.find(`.${POPUP_DONE_BUTTON_CLASS}`)).trigger('dxclick');
        assert.deepEqual(this.instance.option('value'), [items[0], items[1]], 'tags order is correct');

        $(this.$popupWrapper.find(`.${POPUP_DONE_BUTTON_CLASS}`)).trigger('dxclick');
        assert.deepEqual(this.instance.option('value'), [items[0], items[1]], 'tags order is correct');
    });

    QUnit.testInActiveWindow('tags are rendered correctly when minSearchLength is used', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: [
                {
                    Id: 0,
                    Name: 'AAA'
                },
                {
                    Id: 1,
                    Name: 'BBB'
                }
            ],
            displayExpr: 'Name',
            valueExpr: 'Id',
            applyValueMode: 'useButtons',
            minSearchLength: 3,
            showSelectionControls: true,
            searchEnabled: true
        });
        this.clock.tick(TIME_TO_WAIT);

        const tagBox = $tagBox.dxTagBox('instance');
        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard.type('aaa');
        this.clock.tick(TIME_TO_WAIT);

        let $popupWrapper = $(tagBox.content()).parent().parent();

        $popupWrapper.find('.dx-list-select-all-checkbox').trigger('dxclick');
        $popupWrapper.find('.dx-popup-done.dx-button').trigger('dxclick');

        keyboard.type('bbb');
        this.clock.tick(TIME_TO_WAIT);

        $popupWrapper = $(tagBox.content()).parent().parent();

        $popupWrapper.find('.dx-list-select-all-checkbox').trigger('dxclick');
        $popupWrapper.find('.dx-popup-done.dx-button').trigger('dxclick');

        assert.deepEqual($tagBox.dxTagBox('instance').option('value'), [0, 1], 'value of TagBox');
    });
});

QUnit.module('the \'onSelectAllValueChanged\' option', {
    beforeEach: function() {
        this.items = [1, 2, 3];

        this._init = (options) => {
            this.spy = sinon.spy();

            this.$element = $('<div>')
                .appendTo('#qunit-fixture')
                .dxTagBox($.extend({
                    showSelectionControls: true,
                    opened: true,
                    onSelectAllValueChanged: this.spy
                }, options));

            this.instance = this.$element.dxTagBox('instance');
        };

        this.reinit = (options) => {
            this.$element.remove();
            this._init(options);
        };

        this._init({
            items: this.items
        });
    },
    afterEach: function() {
        this.$element.remove();
    }
}, () => {
    QUnit.test('the \'onSelectAllValueChanged\' option behavior', function(assert) {
        const $selectAllCheckbox = this.instance._list.$element().find('.dx-list-select-all-checkbox');

        $($selectAllCheckbox).trigger('dxclick');
        assert.ok(this.spy.args[this.spy.args.length - 1][0].value, 'all items are selected');

        $($selectAllCheckbox).trigger('dxclick');
        assert.strictEqual(this.spy.args[this.spy.args.length - 1][0].value, false, 'all items are unselected');
    });

    QUnit.test('the \'onSelectAllValueChanged\' action is fired only one time if all items are selected', function(assert) {
        const $list = this.instance._list.$element();
        $($list.find('.dx-list-select-all-checkbox')).trigger('dxclick');
        assert.equal(this.spy.callCount, 1, 'count is correct');
    });

    QUnit.test('the \'onSelectAllValueChanged\' action is fired only one time if all items are unselected', function(assert) {
        this.reinit({
            items: this.items,
            value: this.items.slice()
        });

        const $list = this.instance._list.$element();
        $($list.find('.dx-list-select-all-checkbox')).trigger('dxclick');
        assert.equal(this.spy.callCount, 1, 'count is correct');
    });

    QUnit.test('the \'onSelectAllValueChanged\' action is fired only one time if one item is selected', function(assert) {
        const $list = this.instance._list.$element();
        $($list.find('.dx-list-item').eq(0)).trigger('dxclick');
        assert.equal(this.spy.callCount, 1, 'count is correct');
    });

    QUnit.test('the \'onSelectAllValueChanged\' action is fired only one time if one item is unselected', function(assert) {
        this.reinit({
            items: this.items,
            value: this.items.splice()
        });

        const $list = this.instance._list.$element();
        $($list.find('.dx-list-item').eq(0)).trigger('dxclick');
        assert.equal(this.spy.callCount, 1, 'count is correct');
    });

    QUnit.test('the "selectAllValueChanged" event is fired one time after all items selection changing', function(assert) {
        const spy = sinon.spy();

        this.reinit({
            items: this.items,
            value: this.items.splice(),
            onSelectAllValueChanged: null
        });

        const $list = this.instance._list.$element();
        const $selectAllElement = $($list.find('.dx-list-select-all-checkbox'));
        $selectAllElement.trigger('dxclick');
        assert.equal(this.spy.callCount, 0, 'count is correct');

        this.instance.on('selectAllValueChanged', spy);
        $selectAllElement.trigger('dxclick');

        assert.equal(spy.callCount, 1, 'count is correct');
    });
});

QUnit.module('single line mode', {
    beforeEach: function() {
        fx.off = true;

        this.items = ['Africa', 'Antarctica', 'Asia', 'Australia/Oceania', 'Europe', 'North America', 'South America'];

        this._width = 200;

        this.$element = $('<div>')
            .appendTo('#qunit-fixture')
            .width(this._width)
            .dxTagBox({
                items: this.items,
                value: this.items,
                multiline: false,
                focusStateEnabled: true
            });
        this.instance = this.$element.dxTagBox('instance');
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('single line class presence should depend the \'multiline\' option', function(assert) {
        this.instance.option('multiline', true);
        assert.notOk(this.$element.hasClass(TAGBOX_SINGLE_LINE_CLASS), 'there is no single line class on widget');

        this.instance.option('multiline', false);
        assert.ok(this.$element.hasClass(TAGBOX_SINGLE_LINE_CLASS), 'the single line class is added');
    });

    QUnit.test('tags container should be scrolled to the end on value change if the widget is focused', function(assert) {
        const $container = this.$element.find('.' + TAGBOX_TAG_CONTAINER_CLASS);

        this.instance.focus();
        this.instance.option('value', [this.items[0]]);
        assert.equal($container.scrollLeft(), $container.get(0).scrollWidth - $container.outerWidth(), 'tags container is scrolled to the end');

        this.instance.option('value', this.items);
        assert.equal($container.scrollLeft(), $container.get(0).scrollWidth - $container.outerWidth(), 'tags container is scrolled to the end');
    });

    QUnit.test('tags container should not be scrolled to the end on value change without focus (T865611)', function(assert) {
        const $container = this.$element.find('.' + TAGBOX_TAG_CONTAINER_CLASS);

        this.instance.option('value', this.items);
        assert.equal($container.scrollLeft(), 0, 'tags container is not scrolled if the widget has no focus');
    });

    QUnit.test('tags should be scrolled by mouse wheel (T386939)', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'desktop specific test');
            return;
        }

        const itemText = 'Test item ';
        const items = [];

        for(let i = 1; i <= 50; i++) {
            items.push(itemText + i);
        }

        this.instance.option({
            items,
            value: items.slice(0, 20)
        });

        const $tagContainer = this.$element.find('.' + TAGBOX_TAG_CONTAINER_CLASS);
        $tagContainer.scrollLeft(0);

        const delta = -120;

        $(this.$element).trigger($.Event('dxmousewheel', {
            delta
        }));

        assert.equal($tagContainer.scrollLeft(), delta * TAGBOX_MOUSE_WHEEL_DELTA_MULTIPLIER, 'tag container position is correct after the second scroll');

        $(this.$element).trigger($.Event('dxmousewheel', {
            delta
        }));

        assert.equal($tagContainer.scrollLeft(), 2 * delta * TAGBOX_MOUSE_WHEEL_DELTA_MULTIPLIER, 'tag container position is correct after the second scroll');
    });

    QUnit.test('stopPropagation and preventDefault should be called for the mouse wheel event (T386939)', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'desktop specific test');
            return;
        }

        const spy = sinon.spy();

        $(this.$element).on('dxmousewheel', spy);

        $(this.$element).trigger($.Event('dxmousewheel', {
            delta: -120
        }));

        const event = spy.args[0][0];
        assert.ok(event.isDefaultPrevented(), 'default is prevented');
        assert.ok(event.isPropagationStopped(), 'propagation is stopped');
    });

    QUnit.test('stopPropagation and preventDefault should not be called for the mouse wheel event at scroll end/start position', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'desktop specific test');
            return;
        }

        const spy = sinon.spy();

        $(this.$element).on('dxmousewheel', spy);

        $(this.$element).trigger($.Event('dxmousewheel', {
            delta: 120
        }));

        this.$element
            .find('.dx-tag-container')
            .scrollLeft(1000);

        $(this.$element).trigger($.Event('dxmousewheel', {
            delta: -120
        }));

        const startingPositionEvent = spy.args[0][0];
        const endingPositionEvent = spy.args[1][0];
        assert.notOk(startingPositionEvent.isDefaultPrevented(), 'event is not prevented for the starting position');
        assert.notOk(startingPositionEvent.isPropagationStopped(), 'event propogation is not stopped for the starting position');
        assert.notOk(endingPositionEvent.isDefaultPrevented(), 'event is not prevented for the ending position');
        assert.notOk(endingPositionEvent.isPropagationStopped(), 'event propogation is not stopped for the ending position');
    });

    QUnit.test('it is should be possible to scroll tag container natively on mobile device', function(assert) {
        const currentDevice = devices.real();
        let $tagBox;

        try {
            devices.real({
                deviceType: 'mobile'
            });

            $tagBox = $('<div>')
                .appendTo('body')
                .dxTagBox({
                    multiline: false
                });

            const $tagContainer = $tagBox.find('.' + TAGBOX_TAG_CONTAINER_CLASS);

            assert.equal($tagContainer.css('overflowX'), 'auto', 'the overflow css property is correct');
        } finally {
            devices.real(currentDevice);
            $tagBox && $tagBox.remove();
        }
    });

    QUnit.testInActiveWindow('tag container should be scrolled to the start after rendering and focusout (T390041)', function(assert) {
        const $container = this.$element.find('.' + TAGBOX_TAG_CONTAINER_CLASS);
        const $input = this.$element.find(`.${TEXTBOX_CLASS}`);

        assert.equal($container.scrollLeft(), 0, 'scroll position is correct on rendering');

        $input
            .focus()
            .blur();

        assert.equal($container.scrollLeft(), 0, 'scroll position is correct on focus out');
    });

    QUnit.test('tags container should be scrolled to the end on focusin (T390041)', function(assert) {
        const $container = this.$element.find('.' + TAGBOX_TAG_CONTAINER_CLASS);

        this.instance.focus();
        assert.equal($container.scrollLeft(), $container.get(0).scrollWidth - $container.outerWidth(), 'tags container is scrolled to the end');
    });

    QUnit.test('list should save it\'s scroll position after value changed', function(assert) {
        this.instance.option({
            opened: true,
            showSelectionControls: true
        });

        const $content = $(this.instance.content());
        const $list = $content.find('.' + LIST_CLASS);
        const list = $list.dxList('instance');
        const scrollView = $list.dxScrollView('instance');

        this.instance._popup.option('height', 100);

        list.scrollTo(2);
        this.instance.option('value', [this.items[2]]);

        assert.equal(scrollView.scrollTop(), 2, 'list should not be scrolled to the top after value changed');
    });

    QUnit.testInActiveWindow('tag container should be scrolled to the start after rendering and focusout in the RTL mode (T390041)', function(assert) {
        this.instance.option('rtlEnabled', true);

        const $container = this.$element.find('.' + TAGBOX_TAG_CONTAINER_CLASS);
        const scrollBehavior = getScrollRtlBehavior();
        const isScrollInverted = scrollBehavior.decreasing ^ scrollBehavior.positive;
        const scrollSign = scrollBehavior.positive ? 1 : -1;

        const expectedScrollPosition = isScrollInverted ? 0 : scrollSign * ($container.get(0).scrollWidth - $container.outerWidth());

        assert.equal($container.scrollLeft(), expectedScrollPosition, 'scroll position is correct on rendering');

        this.instance.focus();
        this.instance.blur();

        assert.roughEqual($container.scrollLeft(), expectedScrollPosition, 1.01, 'scroll position is correct on focus out');
    });

    QUnit.test('tags container should be scrolled to the end on focusin in the RTL mode (T390041)', function(assert) {
        this.instance.option('rtlEnabled', true);

        const $container = this.$element.find('.' + TAGBOX_TAG_CONTAINER_CLASS);

        const scrollBehavior = getScrollRtlBehavior();
        const isScrollInverted = scrollBehavior.decreasing ^ scrollBehavior.positive;
        const scrollSign = scrollBehavior.positive ? 1 : -1;

        const expectedScrollPosition = isScrollInverted ? scrollSign * ($container.get(0).scrollWidth - $container.outerWidth()) : 0;

        this.instance.focus();
        assert.roughEqual($container.scrollLeft(), expectedScrollPosition, 1.01, 'tags container is scrolled to the end');
    });

    QUnit.test('tags container should be scrolled on mobile devices', function(assert) {
        const $container = this.$element.find('.' + TAGBOX_TAG_CONTAINER_CLASS);

        if(devices.real().deviceType === 'desktop') {
            assert.equal($container.css('overflowX'), 'hidden', 'overflow-x has a \'hidden\' value on desktop');
        } else {
            assert.equal($container.css('overflowX'), 'auto', 'overflow-x has a \'auto\' value on mobile');
        }
    });

    QUnit.test('focusOut should be prevented when tagContainer clicked - T454876', function(assert) {
        assert.expect(1);

        const $inputWrapper = this.$element.find('.dx-dropdowneditor-input-wrapper');

        $inputWrapper.on('mousedown', e => {
            // note: you should not prevent pointerdown because it will prevent click on ios real devices
            // you must use preventDefault in code because it is possible to use .on('focusout', handler) instead of onFocusOut option
            assert.ok(e.isDefaultPrevented(), 'mousedown was prevented and lead to focusout prevent');
        });

        $inputWrapper.trigger('mousedown');
    });
});

QUnit.module('keyboard navigation through tags in single line mode', {
    beforeEach: function() {
        fx.off = true;

        this.items = ['Africa', 'Antarctica', 'Asia', 'Australia/Oceania', 'Europe', 'North America', 'South America'];

        this._width = 200;

        this.$element = $('<div>')
            .appendTo('#qunit-fixture')
            .width(this._width)
            .dxTagBox({
                items: this.items,
                value: this.items,
                multiline: false,
                focusStateEnabled: true,
                searchEnabled: true
            });

        this._init = () => {
            this.instance = this.$element.dxTagBox('instance');
            this.keyboard = keyboardMock(this.$element.find(`.${TEXTBOX_CLASS}`));
            this.getFocusedTag = () => {
                return this.$element.find('.' + TAGBOX_TAG_CLASS + '.' + FOCUSED_CLASS);
            };
        };

        this.reinit = (options) => {
            this.$element.remove();

            this.$element = $('<div>')
                .appendTo('#qunit-fixture')
                .width(this._width)
                .dxTagBox(options);

            this._init();
        };

        this._init();
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('the focused tag should be visible during keyboard navigation to the left', function(assert) {
        this.keyboard
            .focus()
            .press('left')
            .press('left')
            .press('left');

        assert.roughEqual(this.getFocusedTag().position().left, 0, 1, 'focused tag is visible');

        this.keyboard
            .press('left')
            .press('left');

        assert.roughEqual(this.getFocusedTag().position().left, 0, 1, 'focused tag is visible');
    });

    QUnit.test('the focused tag should be visible during keyboard navigation to the right', function(assert) {
        const containerWidth = this.$element.find('.' + TAGBOX_TAG_CONTAINER_CLASS).outerWidth();

        this.keyboard.focus();

        for(let i = 0; i < this.items.length; i++) {
            this.keyboard.press('left');
        }

        this.keyboard
            .press('right')
            .press('right')
            .press('right');

        let $focusedTag = this.getFocusedTag();
        assert.roughEqual($focusedTag.position().left + $focusedTag.width(), containerWidth, 1.01, 'focused tag is visible');

        this.keyboard
            .press('right')
            .press('right');

        $focusedTag = this.getFocusedTag();
        assert.roughEqual($focusedTag.position().left + $focusedTag.width(), containerWidth, 1.01, 'focused tag is visible');
    });

    QUnit.test('tags container should be scrolled to the end after the last tag loses focus during navigation to the right', function(assert) {
        this.reinit({
            items: this.items,
            value: this.items,
            multiline: false,
            focusStateEnabled: true,
            acceptCustomValue: true
        });

        this.keyboard
            .focus()
            .press('left')
            .press('left')
            .press('left')
            .press('right')
            .press('right')
            .press('right');

        const $container = this.$element.find('.' + TAGBOX_TAG_CONTAINER_CLASS);
        assert.equal($container.scrollLeft(), $container.get(0).scrollWidth - $container.outerWidth(), 'tags container is scrolled to the end');
    });

    QUnit.test('tags container should be scrolled to the start on value change in the RTL mode', function(assert) {
        this.reinit({
            items: this.items,
            value: this.items,
            multiline: false,
            focusStateEnabled: true,
            rtlEnabled: true
        });

        const $container = this.$element.find('.' + TAGBOX_TAG_CONTAINER_CLASS);

        const scrollBehavior = getScrollRtlBehavior();
        const isScrollInverted = scrollBehavior.decreasing ^ scrollBehavior.positive;
        const scrollSign = scrollBehavior.positive ? 1 : -1;

        this.instance.focus();
        this.instance.option('value', [this.items[0]]);

        let expectedScrollPosition = isScrollInverted ? scrollSign * ($container.get(0).scrollWidth - $container.outerWidth()) : 0;
        assert.roughEqual($container.scrollLeft(), expectedScrollPosition, 1.01, 'tags container is scrolled to the start');

        this.instance.option('value', this.items);
        expectedScrollPosition = isScrollInverted ? scrollSign * ($container.get(0).scrollWidth - $container.outerWidth()) : 0;

        assert.roughEqual($container.scrollLeft(), expectedScrollPosition, 1.01, 'tags container is scrolled to the start');
    });

    QUnit.test('the focused tag should be visible during keyboard navigation to the right in the RTL mode', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test is not relevant for mobile devices');
            return;
        }

        this.reinit({
            items: this.items,
            value: this.items,
            multiline: false,
            focusStateEnabled: true,
            rtlEnabled: true,
            searchEnabled: true
        });

        const containerWidth = this.$element.find('.' + TAGBOX_TAG_CONTAINER_CLASS).outerWidth();

        this.keyboard
            .focus()
            .press('right')
            .press('right')
            .press('right');

        let $focusedTag = this.getFocusedTag();
        assert.roughEqual($focusedTag.position().left + $focusedTag.width(), containerWidth, 1, 'focused tag is visible');

        this.keyboard
            .press('right')
            .press('right');

        $focusedTag = this.getFocusedTag();
        assert.roughEqual($focusedTag.position().left + $focusedTag.width(), containerWidth, 1, 'focused tag is visible');
    });

    QUnit.test('the focused tag should be visible during keyboard navigation to the left in the RTL mode', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test is not relevant for mobile devices');
            return;
        }

        this.reinit({
            items: this.items,
            value: this.items,
            multiline: false,
            focusStateEnabled: true,
            rtlEnabled: true
        });

        this.keyboard.focus();

        for(let i = 0; i < this.items.length; i++) {
            this.keyboard.press('right');
        }

        this.keyboard
            .press('left')
            .press('left')
            .press('left');

        assert.roughEqual(this.getFocusedTag().position().left, 0, 1.01, 'focused tag is not hidden at left');

        this.keyboard
            .press('left')
            .press('left');

        assert.roughEqual(this.getFocusedTag().position().left, 0, 1.01, 'focused tag is not hidden at left');
    });

    QUnit.test('tags container should be scrolled to the start after the last tag loses focus during navigation to the left in the RTL mode', function(assert) {
        this.reinit({
            items: this.items,
            value: this.items,
            multiline: false,
            focusStateEnabled: true,
            acceptCustomValue: true,
            rtlEnabled: true
        });

        this.keyboard
            .focus()
            .press('right')
            .press('right')
            .press('right')
            .press('left')
            .press('left')
            .press('left');

        const $container = this.$element.find('.' + TAGBOX_TAG_CONTAINER_CLASS);

        const scrollBehavior = getScrollRtlBehavior();
        const scrollSign = scrollBehavior.positive ? 1 : -1;
        const isScrollInverted = scrollBehavior.decreasing ^ scrollBehavior.positive;
        const expectedScrollPosition = isScrollInverted ? scrollSign * ($container.get(0).scrollWidth - $container.outerWidth()) : 0;

        assert.roughEqual($container.scrollLeft(), expectedScrollPosition, 1.01, 'tags container is scrolled to the start');
    });
});

QUnit.module('dataSource integration', moduleSetup, () => {
    QUnit.test('item should be chosen synchronously if item is already loaded', function(assert) {
        assert.expect(0);

        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: {
                load() {
                    return [1, 2, 3, 4, 5];
                }
            }
        });

        this.clock.tick();

        $tagBox.dxTagBox('option', 'value', [1]);
    });

    QUnit.test('first page should be displayed after search and tag select', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: {
                store: new CustomStore({
                    load(options) {
                        const result = [];

                        if(options.searchValue) {
                            return [options.searchValue];
                        }

                        for(let i = options.skip; i < options.skip + options.take; i++) {
                            result.push(i);
                        }

                        return $.Deferred().resolve(result).promise();
                    },
                    byKey(key) {
                        return key;
                    }
                }),
                pageSize: 2,
                paginate: true
            },
            searchTimeout: 0,
            opened: true,
            searchEnabled: true
        });
        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard.type('4');

        $('.dx-item').trigger('dxclick');

        $($input).trigger('dxclick');
        assert.equal($.trim($('.dx-item').first().text()), '0', 'first item loaded');
    });

    QUnit.test('\'byKey\' should not be called on initialization (T533200)', function(assert) {
        const byKeySpy = sinon.spy(key => {
            return key;
        });

        $('#tagBox').dxTagBox({
            value: [1],
            dataSource: {
                load() {
                    return [1, 2];
                },
                byKey: byKeySpy
            }
        });

        assert.equal(byKeySpy.callCount, 0);
    });

    QUnit.test('tagBox should not load data from the DataSource when showDataBeforeSearch is disabled', function(assert) {
        const load = sinon.stub().returns([{ text: 'Item 1' }]);

        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: { load },
            searchTimeout: 0,
            minSearchLength: 3,
            searchEnabled: true,
            showDataBeforeSearch: false
        });

        const tagBox = $tagBox.dxTagBox('instance');
        const kb = keyboardMock($tagBox.find(`.${TEXTBOX_CLASS}`));

        tagBox.open();
        assert.notOk(load.called, 'load has not been called');

        kb.type('Item');
        this.clock.tick(0);
        assert.ok(load.called, 'load has been called after the search only');
    });

    QUnit.test('map function should correctly applies to the widget datasource with the default value', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: new DataSource({
                store: [
                    { ID: 1, Name: 'Test1' },
                    { ID: 2, Name: 'Test2' }
                ],
                map: (item) => {
                    item.Name += ' changed';
                    return item;
                }
            }),
            displayExpr: 'Name',
            valueExpr: 'ID',
            value: [1]
        });

        const tagText = $tagBox.find(`.${TAGBOX_TAG_CLASS}`).text();
        assert.strictEqual(tagText, 'Test1 changed', 'Tag text contains an updated data');
    });

    QUnit.test('Tagbox should not try to update size if input is empty(T818690)', function(assert) {
        const instance = $('#tagBox').dxTagBox({
            multiline: false,
            searchEnabled: true,
            showDropDownButton: true,
            showSelectionControls: true,
            valueExpr: 'ID'
        }).dxTagBox('instance');

        setTimeout(() => {
            instance.beginUpdate();
            try {
                instance.option('displayExpr', 'Label');

                instance.option('items', [
                    { ID: 1, Label: 'Test 1' }
                ]);

                instance.endUpdate();
            } catch(e) {
                assert.ok(false, 'Сannot update tagbox size bacause of input value is initRender[] object');
            }
            instance.endUpdate();
        }, 1000);
        this.clock.tick(1000);

        assert.ok(true, 'TagBox rendered');
    });

    QUnit.test('TagBox should correctly handle disposing on data loading', function(assert) {
        assert.expect(1);

        try {
            const ds = new CustomStore({
                load: function() {
                    const deferred = $.Deferred();

                    setTimeout(function() {
                        deferred.resolve([2]);
                    }, 1000);

                    return deferred.promise();
                }
            });

            const tagBox = $('#tagBox').dxTagBox({
                dataSource: ds,
                value: [2],
                onInitializing: function() {
                    this.beginUpdate();
                }
            }).dxTagBox('instance');

            tagBox.endUpdate();
            tagBox.dispose();
            this.clock.tick(1000);
        } catch(e) {
            assert.ok(false, 'TagBox raise the error');
        }

        assert.ok(true, 'TagBox rendered');
    });
});

QUnit.module('performance', () => {
    QUnit.test('selectionHandler should call twice on popup opening', function(assert) {
        const items = [1, 2, 3, 4, 5];
        const tagBox = $('#tagBox').dxTagBox({
            items,
            value: items,
            showSelectionControls: true
        }).dxTagBox('instance');

        const selectionChangeHandlerSpy = sinon.spy(tagBox, '_selectionChangeHandler');

        tagBox.option('opened', true);

        assert.ok(selectionChangeHandlerSpy.callCount <= 2, 'selection change handler called less than 2 (ListContentReady and SelectAll)');
    });

    QUnit.test('loadOptions.filter should be a filter expression when key is specified', function(assert) {
        const load = sinon.stub().returns([{ id: 1, text: 'item 1' }, { id: 2, text: 'item 2' }]);

        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: {
                load
            },
            valueExpr: 'id',
            displayExpr: 'text',
            opened: true,
            hideSelectedItems: true
        });

        const tagBox = $tagBox.dxTagBox('instance');
        const $item = $(getList(tagBox).find('.dx-list-item').eq(0));

        $item.trigger('dxclick');

        const filter = load.lastCall.args[0].filter;
        assert.ok(Array.isArray(filter), 'filter should be an array for serialization');
        assert.deepEqual(filter, [['!', ['id', 1]]], 'filter should be correct');
    });

    QUnit.test('loadOptions.filter should be a function when valueExpr is function', function(assert) {
        const load = sinon.stub().returns([{ id: 1, text: 'item 1' }, { id: 2, text: 'item 2' }]);

        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: {
                load
            },
            valueExpr() {
                return 'id';
            },
            displayExpr: 'text',
            opened: true,
            hideSelectedItems: true
        });

        const tagBox = $tagBox.dxTagBox('instance');
        const $item = $(getList(tagBox).find('.dx-list-item').eq(0));

        $item.trigger('dxclick');

        const filter = load.lastCall.args[0].filter;
        assert.ok($.isFunction(filter), 'filter is function');
    });

    QUnit.test('loadOptions.filter should be correct when user filter is also used', function(assert) {
        const load = sinon.stub().returns([{ id: 1, text: 'item 1' }, { id: 2, text: 'item 2' }]);

        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: {
                load,
                filter: ['id', '>', 0]
            },
            valueExpr: 'id',
            displayExpr: 'text',
            opened: true,
            hideSelectedItems: true
        });

        const tagBox = $tagBox.dxTagBox('instance');
        let $item = $(getList(tagBox).find('.dx-list-item').eq(0));

        $item.trigger('dxclick');

        let filter = load.lastCall.args[0].filter;
        assert.deepEqual(filter, [['!', ['id', 1]], ['id', '>', 0]], 'filter is correct');

        tagBox.option('opened', true);
        $item = $(getList(tagBox).find('.dx-list-item').eq(1));

        $item.trigger('dxclick');
        filter = load.lastCall.args[0].filter;

        assert.deepEqual(filter, [['!', ['id', 1]], ['!', ['id', 2]], ['id', '>', 0]], 'filter is correct');
    });

    QUnit.test('loadOptions.filter should be correct after some items selecting/deselecting', function(assert) {
        const load = sinon.stub().returns([{ id: 1, text: 'item 1' }, { id: 2, text: 'item 2' }]);

        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: {
                load
            },
            valueExpr: 'id',
            displayExpr: 'text',
            opened: true,
            hideSelectedItems: true
        });

        const tagBox = $tagBox.dxTagBox('instance');

        $(getList(tagBox).find('.dx-list-item').eq(0)).trigger('dxclick');

        let filter = load.lastCall.args[0].filter;
        assert.deepEqual(filter, [['!', ['id', 1]]], 'filter is correct');

        $($tagBox.find('.dx-tag-remove-button').eq(0)).trigger('dxclick');

        filter = load.lastCall.args[0].filter;
        assert.deepEqual(filter, null, 'filter is correct');
    });

    QUnit.test('Select All should use cache', function(assert) {
        const items = [];
        let keyGetterCounter = 0;

        const getter = () => {
            keyGetterCounter++;
            return this._id;
        };
        for(let i = 1; i <= 100; i++) {
            const item = { _id: i, text: 'item ' + i };
            Object.defineProperty(item, 'id', {
                get: getter,
                enumerable: true,
                configurable: true
            });
            items.push(item);
        }

        const arrayStore = new ArrayStore({
            data: items,
            key: 'id'
        });

        const tagBox = $('#tagBox').dxTagBox({
            dataSource: arrayStore,
            valueExpr: 'id',
            opened: true,
            showSelectionControls: true,
            selectionMode: 'all',
            selectAllMode: 'allPages',
            displayExpr: 'text'
        }).dxTagBox('instance');

        const isValueEqualsSpy = sinon.spy(tagBox, '_isValueEquals');

        // act
        keyGetterCounter = 0;
        $('.dx-list-select-all-checkbox').trigger('dxclick');

        // assert
        assert.equal(keyGetterCounter, 613, 'key getter call count');
        assert.equal(isValueEqualsSpy.callCount, 100, '_isValueEquals call count');
    });

    QUnit.test('load filter should be undefined when tagBox has a lot of initial values', function(assert) {
        const load = sinon.stub();

        $('#tagBox').dxTagBox({
            dataSource: {
                load
            },
            value: Array.apply(null, { length: 2000 }).map(Number.call, Number),
            valueExpr: 'id',
            displayExpr: 'text'
        });

        assert.strictEqual(load.getCall(0).args[0].filter, undefined);
    });

    QUnit.test('load filter should be undefined when tagBox has some initial values and "maxFilterLength" was changed at runtime', function(assert) {
        const load = sinon.stub();

        const instance = $('#tagBox').dxTagBox({
            dataSource: {
                load
            },
            value: Array.apply(null, { length: 1 }).map(Number.call, Number),
            valueExpr: 'id',
            displayExpr: 'text'
        }).dxTagBox('instance');

        instance.option('maxFilterLength', 0);
        instance.option('value', Array.apply(null, { length: 2 }).map(Number.call, Number));

        assert.ok(load.getCall(0).args[0].filter);
        assert.strictEqual(load.getCall(load.callCount - 1).args[0].filter, undefined);
    });

    QUnit.test('load filter should be array when tagBox has not a lot of initial values', function(assert) {
        const load = sinon.stub();

        $('#tagBox').dxTagBox({
            dataSource: {
                load
            },
            value: Array.apply(null, { length: 2 }).map(Number.call, Number),
            valueExpr: 'id',
            displayExpr: 'text'
        });

        assert.deepEqual(load.getCall(0).args[0].filter, [['id', '=', 0], 'or', ['id', '=', 1]]);
    });

    QUnit.test('initial items value should be loaded when filter is not implemented in load method', function(assert) {
        const load = sinon.stub().returns([{ id: 1, text: 'item 1' }, { id: 2, text: 'item 2' }, {
            id: 3,
            text: 'item 3'
        }]);

        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: {
                load
            },
            value: [2, 3],
            valueExpr: 'id',
            displayExpr: 'text'
        });

        assert.equal($tagBox.find('.' + TAGBOX_TAG_CLASS).text(), 'item 2item 3');
    });

    QUnit.test('initial items value should be loaded and selected when valueExpr = this and dataSource.key is used (T662546)', function(assert) {
        const load = sinon.stub().returns([{ id: 1, text: 'item 1' }, { id: 2, text: 'item 2' }, {
            id: 3,
            text: 'item 3'
        }]);

        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: {
                load,
                key: 'id'
            },
            value: [{ id: 2, text: 'item 2' }],
            valueExpr: 'this',
            displayExpr: 'text',
            opened: true
        });

        assert.equal($tagBox.find('.' + TAGBOX_TAG_CLASS).text(), 'item 2');

        const list = getList($tagBox.dxTagBox('instance')).dxList('instance');
        assert.deepEqual(list.option('selectedItems'), [{ id: 2, text: 'item 2' }]);
    });

    QUnit.test('initial items value should be loaded and selected when valueExpr = this and dataSource.key and deferred datasource is used', function(assert) {
        const clock = sinon.useFakeTimers();

        try {
            const $tagBox = $('#tagBox').dxTagBox({
                dataSource: {
                    load(loadOptions) {
                        const d = $.Deferred();

                        setTimeout(() => {
                            d.resolve(loadOptions.filter ? [] : [{ id: 1, text: 'item 1' }]);
                        }, 500);

                        return d.promise();
                    },
                    byKey() {
                        const d = $.Deferred();

                        setTimeout(() => {
                            d.resolve({ id: 1, text: 'item 1' });
                        }, 500);

                        return d.promise();
                    },
                    key: 'id'
                },
                value: [{ id: 1, text: 'item 1' }],
                valueExpr: 'this',
                displayExpr: 'text'
            });

            clock.tick(1000);
            assert.equal($tagBox.find('.' + TAGBOX_TAG_CLASS).text(), 'item 1');

        } finally {
            clock.restore();
        }
    });

    QUnit.test('useSubmitBehavior option', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2],
            useSubmitBehavior: false,
            value: [1]
        });

        const instance = $tagBox.dxTagBox('instance');

        assert.equal($tagBox.find('select').length, 0, 'submit element is not rendered on init');

        instance.option('value', [1, 2]);
        assert.equal($tagBox.find('select').length, 0, 'submit element is not rendered after value change');

        instance.option('useSubmitBehavior', true);
        assert.equal($tagBox.find('select').length, 1, 'submit element is rendered after option changed');
        assert.equal($tagBox.find('option').length, 2, '2 options was rendered');

        instance.option('useSubmitBehavior', false);
        assert.equal($tagBox.find('select').length, 0, 'submit element was removed');
    });

    QUnit.test('Unnecessary a load calls do not happen of custom store when item is selected', function(assert) {
        let loadCallCounter = 0;

        const store = new CustomStore({
            key: 'id',
            loadMode: 'raw',
            load() {
                loadCallCounter++;
                return [{ id: 1, text: 'item 1' }, { id: 2, text: 'item 2' }];
            }
        });

        $('#tagBox').dxTagBox({
            dataSource: {
                store
            },
            valueExpr: 'id',
            displayExpr: 'text',
            opened: true,
            hideSelectedItems: true
        });

        const $item = $('.dx-list-item').eq(0);

        $item.trigger('dxclick');

        assert.equal(loadCallCounter, 1);
    });
});

QUnit.module('regression', {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    QUnit.test('Selection refreshing process should wait for the items data will be loaded from the data source (T673636)', function(assert) {
        const clock = sinon.useFakeTimers();

        const tagBox = $('#tagBox').dxTagBox({
            valueExpr: 'id',
            dataSource: {
                load: () => {
                    const d = $.Deferred();

                    setTimeout(() => d.resolve([{ id: 1 }, { id: 2 }]), 0);

                    return d.promise();
                }
            }
        }).dxTagBox('instance');

        tagBox.option('value', [1]);

        assert.notOk(tagBox.option('selectedItems').length);
        clock.tick();
        assert.ok(tagBox.option('selectedItems').length);
        clock.restore();
    });

    QUnit.test('should render function item template that returns default template\'s name (T726777)', function(assert) {
        const tagBox = $('#tagBox').dxTagBox({
            items: [{ text: 'item1' }, { text: 'item2' }],
            itemTemplate: () => 'item',
            opened: true
        }).dxTagBox('instance');
        const checkItemsRender = () => {
            const texts = ['item1', 'item2'];
            const listItems = getList(tagBox).find('.dx-list-item');

            texts.forEach((text, index) => assert.strictEqual(listItems.eq(index).text(), text));
        };

        checkItemsRender();
        tagBox.option('itemTemplate', () => 'item');
        checkItemsRender();
    });

    QUnit.test('tagBox should not fail when asynchronous data source is used (T381326)', function(assert) {
        const data = [1, 2, 3, 4, 5];
        const timeToWait = 500;

        $('#tagBox').dxTagBox({
            dataSource: new DataSource({
                store: new CustomStore({
                    load(options) {
                        const res = $.Deferred();
                        setTimeout(() => {
                            res.resolve(data);
                        }, timeToWait);
                        return res.promise();
                    },
                    byKey(key) {
                        const res = $.Deferred();
                        setTimeout(() => {
                            res.resolve(key);
                        }, timeToWait);
                        return res.promise();
                    }
                }),
                paginate: false
            }),
            value: [data[0], data[1]]
        });

        this.clock.tick(timeToWait);
        assert.expect(0);
    });

    QUnit.test('tagBox should not fail when asynchronous data source is used in the single line mode (T381326)', function(assert) {
        const data = [1, 2, 3, 4, 5];
        const timeToWait = 500;

        $('#tagBox').dxTagBox({
            multiline: false,
            dataSource: new DataSource({
                store: new CustomStore({
                    load(options) {
                        const res = $.Deferred();
                        setTimeout(() => {
                            res.resolve(data);
                        }, timeToWait);
                        return res.promise();
                    },
                    byKey(key) {
                        const res = $.Deferred();
                        setTimeout(() => {
                            res.resolve(key);
                        }, timeToWait);
                        return res.promise();
                    }
                }),
                paginate: false
            }),
            value: [data[0], data[1]]
        });

        this.clock.tick(timeToWait);
        assert.expect(0);
    });

    QUnit.test('tagBox should not render duplicated tags after searching', function(assert) {
        const data = [{ 'id': 1, 'Name': 'Item14' }, { 'id': 2, 'Name': 'Item21' }, {
            'id': 3,
            'Name': 'Item31'
        }, { 'id': 4, 'Name': 'Item41' }];
        const tagBox = $('#tagBox').dxTagBox({
            dataSource: new CustomStore({
                key: 'id',
                load(loadOptions) {
                    const loadedItems = [];
                    const filteredData = loadOptions.filter ? dataQuery(data).filter(loadOptions.filter).toArray() : data;

                    if(!loadOptions.searchValue) {
                        return filteredData;
                    }

                    const d = $.Deferred();
                    setTimeout(i => {
                        filteredData.forEach(i => {
                            if(i.Name.indexOf(loadOptions.searchValue) >= 0) {
                                loadedItems.push(i);
                            }
                        });

                        if(loadedItems.length) {
                            return d.resolve(loadedItems);
                        }
                    });

                    return d.promise();
                }
            }),
            searchTimeout: 0,
            displayExpr: 'Name',
            opened: true,
            searchEnabled: true
        }).dxTagBox('instance');

        $(getList(tagBox).find('.dx-list-item').eq(0)).trigger('dxclick');

        const $input = tagBox.$element().find(`.${TEXTBOX_CLASS}`);
        const kb = keyboardMock($input);

        kb.type('4');
        this.clock.tick(TIME_TO_WAIT);

        $(getList(tagBox).find('.dx-list-item').eq(1)).trigger('dxclick');

        const $tagContainer = tagBox.$element().find('.' + TAGBOX_TAG_CONTAINER_CLASS);

        assert.equal($.trim($tagContainer.text()), 'Item14Item41', 'selected values are rendered correctly');
    });

    QUnit.test('T403756 - dxTagBox treats removing a dxTagBox item for the first time as removing the item', function(assert) {
        const items = [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' },
            { id: 3, name: 'Item 3' }
        ];

        const tagBox = $('#tagBox').dxTagBox({
            displayExpr: 'name',
            valueExpr: 'id',
            dataSource: new CustomStore({
                key: 'id',
                load() {
                    return items;
                },
                byKey(key) {
                    const d = $.Deferred();
                    setTimeout(i => {
                        items.forEach(i => {
                            if(i.id === key) {
                                d.resolve(i);
                                return;
                            }
                        });
                    });
                    return d.promise();
                }
            }),
            onSelectionChanged(e) {
                assert.deepEqual(e.removedItems.length, 0, 'there are no removed items on init');
                assert.equal(e.addedItems.length, 2, 'items are added on init');
            },
            value: [1, 2]
        }).dxTagBox('instance');

        this.clock.tick();
        assert.equal(tagBox.option('selectedItems').length, 2, 'selectedItems contains all selected values');

        const $container = tagBox.$element().find('.' + TAGBOX_TAG_CONTAINER_CLASS);
        const $tagRemoveButtons = $container.find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`);

        tagBox.option('onSelectionChanged', e => {
            assert.deepEqual(e.removedItems.length, 1, 'removed item was added when tag deleted');
            assert.equal(e.addedItems.length, 0, 'there are no added items when tag deleted');
        });

        $($tagRemoveButtons.eq(1)).trigger('dxclick');

        this.clock.tick();

        assert.equal(tagBox.option('selectedItems').length, 1, 'selectedItems was changed correctly');
    });

    QUnit.testInActiveWindow('Searching should work correctly in grouped tagBox (T516798)', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        const items = [{
            'ID': 1,
            'Name': 'Item1',
            'Category': 'Category1'
        }, {
            'ID': 3,
            'Name': 'Item3',
            'Category': 'Category2'
        }];

        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: new DataSource({
                store: items,
                group: 'Category'
            }),
            valueExpr: 'ID',
            displayExpr: 'Name',
            value: [items[0].ID],
            searchEnabled: true,
            opened: true,
            grouped: true
        });

        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard.type('3');
        this.clock.tick(TIME_TO_WAIT);
        keyboard.press('enter');

        const $tagContainer = $tagBox.find('.' + TAGBOX_TAG_CONTAINER_CLASS);

        assert.equal($tagContainer.find('.' + TAGBOX_TAG_CONTENT_CLASS).length, 2, 'selected tags rendered');
        assert.equal($.trim($tagContainer.text()), 'Item1Item3', 'selected values are rendered');
    });

    QUnit.test('selection should work with pregrouped data without paging and with preloaded datasource', function(assert) {
        const ds = new DataSource({
            store: [
                { key: 'Category 1', items: [{ id: 11, name: 'Item 11' }, { id: 12, name: 'Item 12' }] },
                { key: 'Category 2', items: [{ id: 21, name: 'Item 21' }, { id: 22, name: 'Item 22' }] }
            ]
        });
        ds.load();

        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: ds,
            valueExpr: 'id',
            displayExpr: 'name',
            value: [21],
            grouped: true
        });

        assert.strictEqual($tagBox.find('.' + TAGBOX_TAG_CONTAINER_CLASS).text(), 'Item 21', 'Tag was selected');
    });

    QUnit.test('selection should work with pregrouped data without paging', function(assert) {
        const loadMock = sinon.stub().returns([
            { key: 'Category 1', items: [{ id: 11, name: 'Item 11' }, { id: 12, name: 'Item 12' }] },
            { key: 'Category 2', items: [{ id: 21, name: 'Item 21' }, { id: 22, name: 'Item 22' }] }
        ]);
        const ds = new DataSource({
            load: loadMock
        });

        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: ds,
            valueExpr: 'id',
            displayExpr: 'name',
            value: [21],
            grouped: true
        });

        assert.strictEqual(loadMock.callCount, 1, 'there was only one load');
        assert.strictEqual($tagBox.find('.' + TAGBOX_TAG_CONTAINER_CLASS).text(), 'Item 21', 'Tag was selected');
    });

    QUnit.testInActiveWindow('focusout event should remove focus class from the widget', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({});
        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);

        $input.focus();
        assert.ok($tagBox.hasClass(FOCUSED_CLASS), 'focused class was applied');

        $input.blur();
        assert.notOk($tagBox.hasClass(FOCUSED_CLASS), 'focused class was removed');
    });

    QUnit.test('search filter should not be cleared on close without focusout (T851874)', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: ['111', '222', '333'],
            searchTimeout: 0,
            opened: true,
            searchEnabled: true
        });

        const instance = $tagBox.dxTagBox('instance');
        const $tagContainer = $tagBox.find('.' + TAGBOX_TAG_CONTAINER_CLASS);
        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
        const kb = keyboardMock($input);

        kb.type('111');
        this.clock.tick();
        assert.equal($(instance.content()).find(`.${LIST_ITEM_CLASS}`).length, 1, 'filter was applied');

        $tagContainer.trigger('dxclick');
        $tagContainer.trigger('dxclick');

        assert.equal($input.val(), '111', 'input is not cleared');
        assert.equal($(instance.content()).find(`.${LIST_ITEM_CLASS}`).length, 1, 'filter is not cleared');
    });

    QUnit.test('search filter should be cleared on focusout', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: ['111', '222', '333'],
            searchTimeout: 0,
            opened: true,
            searchEnabled: true
        });

        const instance = $tagBox.dxTagBox('instance');
        const $input = $tagBox.find(`.${TEXTBOX_CLASS}`);
        const kb = keyboardMock($input);

        kb.type('111');
        instance.close();
        $($input).trigger('focusout');

        $($input).trigger('dxclick');
        this.clock.tick();

        assert.equal($input.val(), '', 'input was cleared');
        assert.equal($(instance.content()).find(`.${LIST_ITEM_CLASS}`).length, 3, 'filter was cleared');
    });

    QUnit.test('Items is not selected when values is set on the onSelectAllValueChanged event', function(assert) {
        const dataSource = ['Item 1', 'item 2', 'item 3', 'item 4'];

        $('#tagBox').dxTagBox({
            opened: true,
            dataSource: {
                paginate: true,
                pageSize: 2,
                store: dataSource
            },
            selectAllMode: 'page',
            showSelectionControls: true,
            pageLoadMode: 'scrollBottom',
            onSelectAllValueChanged(e) {
                if(e.value === true) {
                    e.component.option('value', dataSource);
                }
            }
        });

        $('.dx-list-select-all-checkbox').trigger('dxclick');

        const selectedItems = $('.dx-list').dxList('instance').option('selectedItems');
        assert.equal(selectedItems.length, 4, 'selected items');
    });

    QUnit.test('Read only TagBox should be able to render the multitag', function(assert) {
        assert.expect(1);

        try {
            $('#tagBox').dxTagBox({
                dataSource: [1, 2, 3, 4, 5, 6, 7],
                placeholder: 'test',
                value: [1, 2, 3, 4],
                readOnly: true,
                maxDisplayedTags: 3
            });
        } catch(e) {
            assert.ok(false, 'Widget raise the error');
        }

        assert.ok(true, 'Widget rendered');
    });

    QUnit.test('Disabled TagBox should be able to render the multitag', function(assert) {
        assert.expect(1);

        try {
            $('#tagBox').dxTagBox({
                dataSource: [1, 2, 3, 4, 5, 6, 7],
                placeholder: 'test',
                value: [1, 2, 3, 4],
                disabled: true,
                maxDisplayedTags: 3
            });
        } catch(e) {
            assert.ok(false, 'Widget raise the error');
        }

        assert.ok(true, 'Widget rendered');
    });
});

QUnit.module('event passed to valueChanged (showSelectionControls=true)', {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();

        this._init = (options) => {
            this.$element = $('<div>')
                .appendTo('#qunit-fixture')
                .dxTagBox(options);
            this.instance = this.$element.dxTagBox('instance');
            this.$input = this.$element.find('.' + TEXTBOX_CLASS);
            this.keyboard = keyboardMock(this.$input);
        };


        this.valueChangedHandler = sinon.stub();
        this._init({
            focusStateEnabled: true,
            showSelectionControls: true,
            items: [1, 2, 3],
            value: [1, 2],
            onValueChanged: this.valueChangedHandler,
            opened: true,
        });

        this.$listItems = $(`.${LIST_ITEM_CLASS}`);
        this.$firstItem = this.$listItems.eq(0);
        this.$firstItemCheckBox = this.$firstItem.find(`.${LIST_CKECKBOX_CLASS}`);
        this.$selectAllItem = $(`.${SELECT_ALL_CLASS}`);
        this.$selectAllItemCheckBox = $(`.${SELECT_ALL_CHECKBOX_CLASS}`);
    },
    afterEach: function() {
        this.$element.remove();
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    QUnit.test('Correct event should be passed to valueChanged when tag is removed using backspace (T947619)', function(assert) {
        this.keyboard
            .focus()
            .keyDown('backspace');

        const data = this.valueChangedHandler.getCall(0).args[0];
        assert.strictEqual(data.event.type, 'keydown', 'correct event is passed');
        assert.strictEqual(data.event.key, 'Backspace', 'event key is correct');
    });

    QUnit.test('Correct event should be passed to valueChanged when tag is removed using delete', function(assert) {
        this.keyboard
            .focus()
            .press('left')
            .keyDown('del');

        const data = this.valueChangedHandler.getCall(0).args[0];
        assert.strictEqual(data.event.type, 'keydown', 'correct event is passed');
        assert.strictEqual(data.event.key, 'Delete', 'event key is correct');
    });

    QUnit.test('event passed to valueChanged should be undefined when value runtime changes after tag removing', function(assert) {
        this.keyboard
            .focus()
            .press('backspace');

        this.instance.option('value', [3]);

        const data = this.valueChangedHandler.getCall(1).args[0];
        assert.strictEqual(data.event, undefined, 'correct event is passed');
    });

    QUnit.test('event passed to valueChanged should be correct after click on item (T947619)', function(assert) {
        this.$firstItem.trigger('dxclick');

        const data = this.valueChangedHandler.getCall(0).args[0];
        assert.strictEqual(data.event.type, 'dxclick', 'correct event is passed');
        assert.strictEqual(data.event.target, this.$firstItem.get(0), 'event target is correct');
    });

    QUnit.test('event passed to valueChanged should be correct after click on item checkBox (T947619)', function(assert) {
        this.$firstItemCheckBox.trigger('dxclick');

        const data = this.valueChangedHandler.getCall(0).args[0];
        assert.strictEqual(data.event.type, 'dxclick', 'correct event is passed');
        assert.strictEqual(data.event.target, this.$firstItemCheckBox.get(0), 'event target is correct');
    });

    QUnit.test('event passed to valueChanged should be correct after click on selectAll item (T947619)', function(assert) {
        this.$selectAllItem.trigger('dxclick');

        const data = this.valueChangedHandler.getCall(0).args[0];
        assert.strictEqual(data.event.type, 'dxclick', 'correct event is passed');
        assert.strictEqual(data.event.target, this.$selectAllItem.get(0), 'event target is correct');
    });

    QUnit.test('event passed to valueChanged should be correct after click on selectAll item checkBox (T947619)', function(assert) {
        this.$selectAllItemCheckBox.trigger('dxclick');

        const data = this.valueChangedHandler.getCall(0).args[0];
        assert.strictEqual(data.event.type, 'dxclick', 'correct event is passed');
        assert.strictEqual(data.event.target, this.$selectAllItemCheckBox.get(0), 'event target is correct');
    });

    QUnit.test('Correct event should be passed to valueChanged when item is selected using enter', function(assert) {
        this.keyboard
            .focus()
            .press('down')
            .keyDown('enter');

        const data = this.valueChangedHandler.getCall(0).args[0];
        assert.strictEqual(data.event.type, 'keydown', 'correct event is passed');
        assert.strictEqual(data.event.key, 'Enter', 'event key is correct');
        assert.strictEqual(data.event.target.get(0), this.$firstItem.get(0), 'target is correct');
    });

    QUnit.test('Correct event should be passed to valueChanged when item is selected using space', function(assert) {
        this.keyboard
            .focus()
            .press('down')
            .keyDown('space');

        const data = this.valueChangedHandler.getCall(0).args[0];
        assert.strictEqual(data.event.type, 'keydown', 'correct event is passed');
        assert.strictEqual(data.event.key, ' ', 'event key is correct');
        assert.strictEqual(data.event.target.get(0), this.$firstItem.get(0), 'target is correct');
    });

    QUnit.test('Correct event should be passed to valueChanged when selectAll item is selected using enter', function(assert) {
        this.keyboard
            .focus()
            .press('down')
            .press('up')
            .keyDown('enter');

        const data = this.valueChangedHandler.getCall(0).args[0];
        assert.strictEqual(data.event.type, 'keydown', 'correct event is passed');
        assert.strictEqual(data.event.key, 'Enter', 'event key is correct');
    });

    QUnit.test('Correct event should be passed to valueChanged when selectAll item is selected using space', function(assert) {
        this.keyboard
            .focus()
            .press('down')
            .press('up')
            .keyDown('space');

        const data = this.valueChangedHandler.getCall(0).args[0];
        assert.strictEqual(data.event.type, 'keydown', 'correct event is passed');
        assert.strictEqual(data.event.key, ' ', 'event key is correct');
    });

    QUnit.test('event=undefined should be passed to valueChanged when value changes runtime after selectAll item is selected using enter', function(assert) {
        this.keyboard
            .focus()
            .press('down')
            .press('up')
            .keyDown('enter');

        this.instance.option('value', [3]);

        const data = this.valueChangedHandler.getCall(1).args[0];
        assert.strictEqual(data.event, undefined, 'correct event is passed');
    });

    QUnit.test('event=undefined should be passed to valueChanged when value changes runtime after selectAll item is selected using space', function(assert) {
        this.keyboard
            .focus()
            .press('down')
            .press('up')
            .keyDown('space');

        this.instance.option('value', [3]);

        const data = this.valueChangedHandler.getCall(1).args[0];
        assert.strictEqual(data.event, undefined, 'correct event is passed');
    });

    QUnit.test('event passed to valueChanged should be undefined when value changes runtime after click on item', function(assert) {
        this.$firstItem.trigger('dxclick');

        this.instance.option('value', [3]);

        const data = this.valueChangedHandler.getCall(1).args[0];
        assert.strictEqual(data.event, undefined, 'correct event is passed');
    });

    QUnit.test('event passed to valueChanged should be undefined when value changes runtime after click on selectAll item', function(assert) {
        this.$selectAllItem.trigger('dxclick');

        this.instance.option('value', [3]);

        const data = this.valueChangedHandler.getCall(1).args[0];
        assert.strictEqual(data.event, undefined, 'correct event is passed');
    });

    QUnit.test('event passed to valueChanged should be undefined when value changes runtime after click on item checkBox', function(assert) {
        this.$firstItemCheckBox.trigger('dxclick');

        this.instance.option('value', [3]);

        const data = this.valueChangedHandler.getCall(1).args[0];
        assert.strictEqual(data.event, undefined, 'correct event is passed');
    });

    QUnit.test('event passed to valueChanged should be undefined when value changes runtime after click on selectAll item checkBox', function(assert) {
        this.$selectAllItemCheckBox.trigger('dxclick');

        this.instance.option('value', [3]);

        const data = this.valueChangedHandler.getCall(1).args[0];
        assert.strictEqual(data.event, undefined, 'correct event is passed');
    });
});
