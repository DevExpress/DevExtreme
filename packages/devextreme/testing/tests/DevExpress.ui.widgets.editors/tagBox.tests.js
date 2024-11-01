import $ from 'jquery';
import { DataSource } from 'common/data/data_source/data_source';
import { isRenderer } from 'core/utils/type';
import { createTextElementHiddenCopy } from '__internal/core/utils/m_dom';
import ajaxMock from '../../helpers/ajaxMock.js';
import config from 'core/config';
import dataQuery from 'common/data/query';
import devices from '__internal/core/m_devices';
import coreErrors from 'core/errors';
import uiErrors from 'ui/widget/ui.errors';
import { errors as dataErrors } from 'common/data/errors';
import fx from 'common/core/animation/fx';
import keyboardMock from '../../helpers/keyboardMock.js';
import messageLocalization from 'common/core/localization/message';
import pointerMock from '../../helpers/pointerMock.js';
import ArrayStore from 'common/data/array_store';
import { CustomStore } from 'common/data/custom_store';
import ODataStore from 'common/data/odata/store';
import TagBox from 'ui/tag_box';
import { normalizeKeyName } from 'common/core/events/utils/index';
import { getWidth, getHeight } from 'core/utils/size';
import Guid from 'core/guid';

import { TextEditorLabel } from '__internal/ui/text_box/m_text_editor.label';

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
const LIST_CHECKBOX_CLASS = 'dx-list-select-checkbox';
const SELECT_ALL_CLASS = 'dx-list-select-all';
const SELECT_ALL_CHECKBOX_CLASS = 'dx-list-select-all-checkbox';
const POPUP_DONE_BUTTON_CLASS = 'dx-popup-done';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const EMPTY_INPUT_CLASS = 'dx-texteditor-empty';
const DROP_DOWN_EDITOR_INPUT_WRAPPER = 'dx-dropdowneditor-input-wrapper';
const TAGBOX_TAG_CONTAINER_CLASS = 'dx-tag-container';
const TAGBOX_TAG_CONTENT_CLASS = 'dx-tag-content';
const TAGBOX_TAG_CLASS = 'dx-tag';
const TAGBOX_MULTI_TAG_CLASS = 'dx-tagbox-multi-tag';
const TAGBOX_TAG_REMOVE_BUTTON_CLASS = 'dx-tag-remove-button';
const TAGBOX_SINGLE_LINE_CLASS = 'dx-tagbox-single-line';
const TAGBOX_POPUP_WRAPPER_CLASS = 'dx-tagbox-popup-wrapper';
const TAGBOX_DEFAULT_FIELD_TEMPLATE_CLASS = 'dx-tagbox-default-template';
const TAGBOX_CUSTOM_FIELD_TEMPLATE_CLASS = 'dx-tagbox-custom-template';
const TAGBOX_SELECT_SELECTOR = 'select';
const FOCUSED_CLASS = 'dx-state-focused';
const TAGBOX_MOUSE_WHEEL_DELTA_MULTIPLIER = -0.3;
const KEY_ENTER = 'Enter';
const KEY_DOWN = 'ArrowDown';
const KEY_SPACE = ' ';
const CLEAR_BUTTON_AREA = 'dx-clear-button-area';
const TEXTEDITOR_LABEL_CLASS = 'dx-texteditor-label';
const PLACEHOLDER_CLASS = 'dx-placeholder';

const TIME_TO_WAIT = 500;

const getList = (tagBox) => {
    return tagBox._$list;
};

const getListItems = (tagBox) => {
    const instance = tagBox.dxTagBox ? tagBox.dxTagBox('instance') : tagBox;
    return $((instance).content()).find(`.${LIST_ITEM_CLASS}`);
};

const getAsyncLoad = () => {
    const data = [{
        'id': 'item 1'
    }, {
        'id': 'item 2'
    }, {
        'id': 'item 3'
    }, {
        'id': 'item 4'
    }, {
        'id': 'item 5'
    }, {
        'id': 'item for search 1'
    }, {
        'id': 'item for search 2'
    }, {
        'id': 'item for search 3'
    }, {
        'id': 'item for search 4'
    }];

    return (loadOptions) => {
        const deferred = $.Deferred();
        setTimeout(() => {
            if(loadOptions.take && !loadOptions.searchValue) {
                deferred.resolve(data.slice().splice(loadOptions.skip, loadOptions.take), { totalCount: 9 });
            } else if(loadOptions.filter) {
                const result = data.filter((item) => {
                    if(Array.isArray(loadOptions.filter[0]) && item[2] && item[2].id === loadOptions.filter[2].id) {
                        return item[2];
                    } else if(item.id === loadOptions.filter[2].id) {
                        return item;
                    } else if(Array.isArray(loadOptions.filter) && loadOptions.filter.length > 2) {
                        for(let i = 0; i < loadOptions.filter.length; i++) {
                            const element = loadOptions.filter[i];
                            if(Array.isArray(element) && element[2] === item.id) {
                                return item;
                            }
                        }
                    } else {
                        deferred.reject();
                    }
                });

                deferred.resolve(result, { totalCount: 9 });
            } else if(loadOptions.searchValue) {
                const result = data.filter((item) => {
                    if(item.id.indexOf(loadOptions.searchValue) >= 0) {
                        return item;
                    }
                });

                deferred.resolve(result.splice(loadOptions.skip, loadOptions.take), { totalCount: 9 });
            } else {
                deferred.resolve(data, { totalCount: 9 });
            }
        }, TIME_TO_WAIT * 2);

        return deferred.promise();
    };
};

const getDSWithAsyncSearch = (asyncLoad = getAsyncLoad()) => {

    return new DataSource({
        paginate: true,
        pageSize: 5,
        store: new CustomStore({
            key: 'id',
            load: asyncLoad
        })
    });
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
        const $listItems = getListItems($tagBox);

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

        assert.equal(getListItems(tagBox).length, dataSource.length, 'items count is correct');

        tagBox.open();
        $(getListItems(tagBox).eq(0)).trigger('dxclick');
        assert.equal(getListItems(tagBox).length, dataSource.length - 1, 'items count is correct after the first item selection');

        tagBox.open();
        $(getListItems(tagBox).eq(0)).trigger('dxclick');
        assert.equal(getListItems(tagBox).length, dataSource.length - 2, 'items count is correct after the second item selection');

        tagBox.open();
        $(getListItems(tagBox).eq(0)).trigger('dxclick');
        assert.equal(getListItems(tagBox).length, dataSource.length - 3, 'items count is correct after the third item selection');

        tagBox.open();
        $($tagBox.find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`).eq(0)).trigger('dxclick');
        assert.equal(getListItems(tagBox).length, dataSource.length - 2, 'items count is correct after the first tag is removed');

        tagBox.open();
        $($tagBox.find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`).eq(0)).trigger('dxclick');
        assert.equal(getListItems(tagBox).length, dataSource.length - 1, 'items count is correct after the second tag is removed');
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
        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard.type('1');
        this.clock.tick(TIME_TO_WAIT);
        assert.strictEqual(getListItems(tagBox).length, 1, 'items count is correct after the first item selection');

        $($tagBox.find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`).eq(0)).trigger('dxclick');
        assert.equal(getListItems(tagBox).length, 2, 'items count is correct after the first tag is removed');
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

        let $item = getListItems(tagBox).eq(0);

        $item.trigger('dxclick');
        assert.deepEqual(spy.args[1][0].addedItems, [1], 'added items is correct');
        assert.deepEqual(spy.args[1][0].removedItems, [], 'removed items is empty');

        $item = getListItems(tagBox).eq(1);
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

        const $item = getListItems(tagBox).eq(0);

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
        assert.strictEqual(getListItems($element).length, 3, 'found 3 items');

        $(getListItems($element).first()).trigger('dxclick');
        assert.equal($element.find('.' + TAGBOX_TAG_CLASS).length, 1, 'tag is added');

        $(getListItems($element).first()).trigger('dxclick');
        assert.equal($element.find('.' + TAGBOX_TAG_CLASS).length, 0, 'tag is removed');

        $(getListItems($element).last()).trigger('dxclick');
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

        $($tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`)).trigger('focusin');
        $($tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`)).trigger('focusout');

        assert.equal(renderTagsStub.callCount, 0, 'tags weren\'t rerendered');
    });

    QUnit.test('tagBox field is not cleared on blur', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            value: [1]
        });

        this.clock.tick(TIME_TO_WAIT);
        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
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

        const $listItems = getListItems($tagBox);
        $($listItems.eq(0)).trigger('dxclick');
        $($listItems.eq(1)).trigger('dxclick');

        assert.equal($.trim($tagBox.find('.' + TAGBOX_TAG_CONTAINER_CLASS).text()), '01', 'selected first and second items');
    });

    QUnit.test('tag should have correct value when item value is an empty string', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: ['', 1, 2, 3],
            opened: true
        });

        this.clock.tick(TIME_TO_WAIT);

        const $listItems = getListItems($tagBox);
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

        const $listItems = getListItems($element);

        $($listItems.eq(0)).trigger('dxclick');
        $($listItems.eq(1)).trigger('dxclick');
        $($element.find('.dx-clear-button-area')).trigger('dxclick');
        getListItems($element).eq(2).trigger('dxclick');

        assert.equal($element.find('.' + TAGBOX_TAG_CLASS).length, 1, 'one item is chosen');
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

    [true, false].forEach((deferRenderingValue) => {
        QUnit.test(`Tag should repaint tags on 'repaint' if dataSource is reloaded and deferRendering: ${deferRenderingValue} (T873372)`, function(assert) {
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
                deferRendering: deferRenderingValue,
                value: [1]
            });
            const tagBox = $tagBox.dxTagBox('instance');
            this.clock.tick(10);
            items = [{ name: 'updated', value: 1 }];
            dataSource.reload();
            tagBox.repaint();

            const $tag = $tagBox.find(`.${TAGBOX_TAG_CLASS}`);
            assert.equal($tag.text(), 'updated', 'tag has updated text');
        });
    });

    QUnit.test('Tags should be rendered on start if fieldTemplate is async (T1056792)', function(assert) {
        const done = assert.async();
        assert.expect(1);
        this.clock.restore();

        let rendered = false;
        const $tagBox = $('#tagBox').dxTagBox({
            items: [{ name: 'one', value: 1 }, { name: 'two', value: 2 }],
            displayExpr: 'name',
            valueExpr: 'value',
            value: [1],
            fieldTemplate: 'fieldTemplate',
            templatesRenderAsynchronously: true,
            integrationOptions: {
                templates: {
                    fieldTemplate: {
                        render: (data) => {
                            const text = $('<div>');
                            if(!rendered) {
                                setTimeout(() => {
                                    text.dxTextBox({});
                                    data.container.append(text.get(0));
                                    data.onRendered();
                                    rendered = true;
                                }, TIME_TO_WAIT / 2);
                            } else {
                                text.dxTextBox({});
                                data.container.append(text);
                                data.onRendered();
                            }

                            return text;
                        }
                    }
                }
            },
        });

        setTimeout(() => {
            const $tag = $tagBox.find(`.${TAGBOX_TAG_CLASS}`);
            assert.equal($tag.length, 1, 'tag was rendered');
            done();
        }, TIME_TO_WAIT);
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

        $(`.${SELECT_ALL_CHECKBOX_CLASS}`).trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT);

        assert.equal($tagBox.dxTagBox('option', 'value').length, 5, 'first page is selected');
        assert.equal($tagBox.find('.' + TAGBOX_MULTI_TAG_CLASS).text(), '5 selected', 'text is correct');
    });

    QUnit.test('TagBox should correctly process the rejected load promise of the dataSource', function(assert) {
        const dataErrorStub = sinon.stub(dataErrors, 'log');
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

    QUnit.test('clear()', function(assert) {
        const tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            value: [1]
        }).dxTagBox('instance');

        tagBox.clear();
        assert.deepEqual(tagBox.option('value'), [], 'Value should be cleared');
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

QUnit.module('the "text" option', moduleSetup, () => {
    QUnit.test('value change should not change text option', function(assert) {
        const tagBox = $('#tagBox').dxTagBox({
            items: ['item1', 'item2'],
        }).dxTagBox('instance');
        this.clock.tick(TIME_TO_WAIT);

        tagBox.option('value', ['item1']);

        assert.strictEqual(tagBox.option('text'), '', 'text is empty');
    });

    QUnit.test('typed value should be passed to text option', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            searchEnabled: true,
            searchTimeout: 0
        });
        this.clock.tick(TIME_TO_WAIT);

        const tagBox = $tagBox.dxTagBox('instance');
        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input, true);

        keyboard.type('i');
        this.clock.tick(TIME_TO_WAIT);
        assert.strictEqual(tagBox.option('text'), 'i', 'text is correct');

        keyboard.type('t');
        this.clock.tick(TIME_TO_WAIT);
        assert.strictEqual(tagBox.option('text'), 'it', 'text is correct');

        keyboard.press('backspace');
        this.clock.tick(TIME_TO_WAIT);
        assert.strictEqual(tagBox.option('text'), 'i', 'text is correct');
    });

    QUnit.test('focusout after search should clear text option value', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            searchEnabled: true,
            searchTimeout: 0
        });
        this.clock.tick(TIME_TO_WAIT);

        const tagBox = $tagBox.dxTagBox('instance');
        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard.type('i');
        this.clock.tick(TIME_TO_WAIT);

        $input.focusout();

        assert.strictEqual(tagBox.option('text'), '', 'text is cleared');
    });

    QUnit.test('value selecting after search should clear text option value', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: ['item1', 'item2'],
            searchEnabled: true,
            searchTimeout: 0
        });
        this.clock.tick(TIME_TO_WAIT);

        const tagBox = $tagBox.dxTagBox('instance');
        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard.type('i');
        this.clock.tick(TIME_TO_WAIT);

        const $listItems = getListItems(tagBox);
        $listItems.first().trigger('dxclick');

        assert.strictEqual(tagBox.option('text'), '', 'text is cleared');
    });

    QUnit.test('custom item adding should clear text option value', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            acceptCustomValue: true,
            searchTimeout: 0
        });
        this.clock.tick(TIME_TO_WAIT);

        const tagBox = $tagBox.dxTagBox('instance');
        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard
            .type('i')
            .press('enter');
        this.clock.tick(TIME_TO_WAIT);

        assert.strictEqual(tagBox.option('text'), '', 'text is cleared');
    });
});

QUnit.module('the \'onValueChanged\' option', moduleSetup, () => {
    QUnit.test('onValueChanged provides selected values', function(assert) {
        let value;

        const tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            onValueChanged(args) {
                value = args.value;
            }
        });

        this.clock.tick(TIME_TO_WAIT);

        $(getListItems(tagBox).eq(0)).trigger('dxclick');
        assert.deepEqual(value, [1], 'only first item is selected');

        $(getListItems(tagBox).eq(2)).trigger('dxclick');
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
        const $listItems = getListItems($element);
        $($listItems.eq(0)).trigger('dxclick');
        $($listItems.eq(2)).trigger('dxclick');
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

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

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
        const logStub = sinon.stub(coreErrors, 'log');

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

        this.clock.tick(10);

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

        this.clock.tick(10);

        const $tags = $tagBox.find('.dx-tag');
        const $listItems = $(instance.content()).find('.dx-list-item.dx-list-item-selected');
        const checkbox = $listItems.eq(0).find(`.${LIST_CHECKBOX_CLASS}`).dxCheckBox('instance');

        assert.equal($tags.length, 0, 'tags should not be rendered before button click');
        assert.equal($listItems.length, 1, 'list item should be selected after enter press');
        assert.equal(checkbox.option('value'), true, 'checkbox is checked');
    });

    [true, false].forEach((deferRendering) => {
        QUnit.test(`No errors should be encountored when new item is added, items option is empty, deferRendering is ${deferRendering} [T1230995]`, function(assert) {
            try {
                const $element = $('#tagBox').dxTagBox({
                    applyValueMode: 'useButtons',
                    acceptCustomValue: true,
                    onCustomItemCreating(args) {
                        const newValue = args.text;
                        const { component } = args;
                        const currentItems = component.option('items');
                        const isItemInDataSource = currentItems.some((item) => item === newValue);
                        if(!isItemInDataSource) {
                            currentItems.unshift(newValue);
                            component.option('items', currentItems);
                        }
                        args.customItem = newValue;
                    },
                    deferRendering
                });
                const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

                keyboardMock($input, true)
                    .focus()
                    .type('test 1')
                    .press('enter');

                const instance = $element.dxTagBox('instance');

                assert.deepEqual(instance.option('selectedItems'), []);
                assert.deepEqual(instance.option('items'), ['test 1']);
            } catch(error) {
                assert.ok(false, `Error encountered is: ${error.message}`);
            }
        });

        QUnit.test(`No errors should be encountored when new item is added, deferRendering is ${deferRendering} [T1230995]`, function(assert) {
            try {
                const $element = $('#tagBox').dxTagBox({
                    items: ['Item_1', 'Item_2', 'Item_3'],
                    applyValueMode: 'useButtons',
                    acceptCustomValue: true,
                    onCustomItemCreating(args) {
                        const newValue = args.text;
                        const { component } = args;
                        const currentItems = component.option('items');
                        const isItemInDataSource = currentItems.some((item) => item === newValue);
                        if(!isItemInDataSource) {
                            currentItems.unshift(newValue);
                            component.option('items', currentItems);
                        }
                        args.customItem = newValue;
                    },
                    deferRendering
                });
                const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

                keyboardMock($input, true)
                    .focus()
                    .type('test 1')
                    .press('enter');

                const instance = $element.dxTagBox('instance');

                assert.deepEqual(instance.option('selectedItems'), []);
                assert.deepEqual(instance.option('items'), ['test 1', 'Item_1', 'Item_2', 'Item_3']);
            } catch(error) {
                assert.ok(false, `Error encountered is: ${error.message}`);
            }
        });
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

    QUnit.test('tag template should receive item object if displayValue is empty string (T965054)', function(assert) {
        const items = [{ text: '' }];

        $('#tagBox').dxTagBox({
            items,
            value: items,
            displayExpr: 'text',
            tagTemplate(tagData) {
                assert.deepEqual(tagData, items[0], 'correct data is passed');
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

    QUnit.test('tag template can use string data', function(assert) {
        const items = ['first'];

        const $element = $('#tagBox').dxTagBox({
            items,
            valueExpr: 'this',
            value: [items[0]]
        });

        const $tags = $element.find('.' + TAGBOX_TAG_CLASS);
        assert.strictEqual($tags.text(), 'first', 'text is correct');
    });

    QUnit.test('tag template should use empty text if it is defined', function(assert) {
        const items = [{ id: 1, text: '' }];

        const $element = $('#tagBox').dxTagBox({
            items,
            displayExpr: 'text',
            valueExpr: 'this',
            value: [items[0]]
        });

        const $tags = $element.find('.' + TAGBOX_TAG_CLASS);
        assert.strictEqual($tags.length, 1, 'text is correct');
        assert.strictEqual($tags.text(), '', 'text is correct');
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
        $(`.${SELECT_ALL_CHECKBOX_CLASS}`).trigger('dxclick');
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

        $(`.${SELECT_ALL_CHECKBOX_CLASS}`).trigger('dxclick');
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

        $(`.${SELECT_ALL_CHECKBOX_CLASS}`).trigger('dxclick');
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

        $($tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`)).trigger('focusin');
        $('.dx-list-item').first().trigger('dxclick');
        $($tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`)).trigger('focusout');

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

        const selectAllCheck = $(`.${SELECT_ALL_CHECKBOX_CLASS}`).dxCheckBox('instance');
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
            this.$input = this.$element.find('.' + TEXTEDITOR_INPUT_CLASS);
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
    QUnit.test('pagedown/pageup keys should move focus to last/first item', function(assert) {
        const $listItems = getListItems(this.instance);
        this.keyboard.press('down');

        this.keyboard.press('pagedown');
        assert.ok($listItems.eq(2).hasClass(FOCUSED_CLASS), 'the last tag has the \'focused\' class');

        this.keyboard.press('pageup');
        assert.ok($listItems.eq(0).hasClass(FOCUSED_CLASS), 'the first tag has the \'focused\' class');
    });

    QUnit.test('down/up keys should move focus to next/previous item', function(assert) {
        const $listItems = getListItems(this.instance);
        const $firstItem = $listItems.eq(0);
        const $secondItem = $listItems.eq(1);

        this.keyboard.press('down');
        assert.ok($secondItem.hasClass(FOCUSED_CLASS), 'second item is focused');

        this.keyboard.press('up');
        assert.ok($firstItem.hasClass(FOCUSED_CLASS), 'first item is focused');
    });

    ['enter', 'space'].forEach(key => {
        QUnit.test(`item should be selected when pressing ${key}`, function(assert) {
            assert.deepEqual(this.instance.option('value'), [1, 2], 'the value is correct');

            this.keyboard.press('down');
            this.keyboard.press('down');

            this.keyboard.press(key);
            this.clock.tick(TIME_TO_WAIT);
            assert.deepEqual(this.instance.option('value'), [1, 2, 3], 'the value is correct');
        });
    });

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

        assert.strictEqual(this.instance.option('opened'), false);
    });

    QUnit.test('escape key should close popup', function(assert) {
        this.reinit({
            opened: true,
        });

        this.keyboard.keyDown('esc');

        assert.notOk(this.instance.option('opened'), 'popup closed');
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

        const $applyButton = this.instance._popup.$wrapper().find('.dx-button.dx-popup-done');
        assert.ok($applyButton.hasClass('dx-state-focused'), 'the apply button is focused');
    });

    QUnit.testInActiveWindow('toolbar button should be focused on the "tab" key press if the input is focused and showSelectionControls is enabled', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'desktop specific test');
            return;
        }

        this.reinit({
            opened: true,
            showSelectionControls: true,
            applyValueMode: 'useButtons',
            dropDownOptions: {
                toolbarItems: [
                    {
                        widget: 'dxButton',
                        options: {
                            text: 'Button',
                            elementAttr: { id: 'toolbarButton' }
                        }
                    }
                ]
            }
        });

        this.keyboard
            .focus()
            .press('tab');

        const $toolbarButton = this.instance._popup.$wrapper().find('#toolbarButton');

        assert.ok($toolbarButton.hasClass('dx-state-focused'), 'toolbar button is focused');
    });

    QUnit.test('keyboard event handlers passed from a config', function(assert) {
        const keyDownStub = sinon.stub();
        const keyUpStub = sinon.stub();

        this.instance.dispose();
        this.reinit({
            onKeyDown: keyDownStub,
            onKeyUp: keyUpStub
        });

        this.keyboard
            .focus()
            .type('a');

        assert.ok(keyDownStub.calledOnce, 'keydown handled');
        assert.ok(keyUpStub.calledOnce, 'keyup handled');
    });

    QUnit.test('keyboard event handlers added dynamically', function(assert) {
        const keyDownStub = sinon.stub();
        const keyUpStub = sinon.stub();

        this.instance.on('keyDown', keyDownStub);
        this.instance.on('keyUp', keyUpStub);

        this.keyboard
            .focus()
            .type('a');

        assert.ok(keyDownStub.calledOnce, 'keydown handled');
        assert.ok(keyUpStub.calledOnce, 'keyup handled');
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
            this.$input = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
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

    ['readOnly', 'disabled'].forEach((optionName) => {
        ['backspace', 'del'].forEach((keyName) => {
            QUnit.test(`the focused tag should be removed after pressing the '${keyName}' key after ${optionName} state (T986220)`, function(assert) {
                const items = [1, 2, 3, 4];
                this.reinit({
                    items,
                    value: items,
                    focusStateEnabled: true,
                    searchEnabled: true
                });

                this.instance.option(optionName, true);
                this.instance.option(optionName, false);

                this.keyboard
                    .focus()
                    .press('left')
                    .press('left')
                    .press('left');

                const expectedValue = this.instance.option('value').slice();
                const focusedTagIndex = this.getFocusedTag().index();
                expectedValue.splice(focusedTagIndex, 1);

                this.keyboard
                    .press(keyName);

                const value = this.instance.option('value');
                assert.deepEqual(value, expectedValue, 'the widget\'s value is correct');
            });
        });
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
    const searchModuleSetup = {
        beforeEach: function() {
            this.items = ['111', '222', '333', '2'];
            const initConfig = {
                searchTimeout: 0,
                items: this.items,
                searchEnabled: true
            };

            this.init = (options) => {
                this.$element = $('#tagBox').dxTagBox(options);
                this.$input = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
                this.keyboard = keyboardMock(this.$input);
                this.instance = this.$element.dxTagBox('instance');
            };
            this.reinit = (options) => {
                this.init($.extend({}, initConfig, options));
            };

            this.init(initConfig);
        }
    };

    QUnit.module('search should be canceled after', searchModuleSetup, () => {
        QUnit.test('search value clearing (T385456)', function(assert) {
            keyboardMock(this.$input, true)
                .type(this.items[0][0])
                .press('backspace');

            assert.strictEqual(getListItems(this.instance).length, this.items.length, 'search was canceled');
        });

        QUnit.test('focusout', function(assert) {
            this.keyboard
                .type('111')
                .blur();

            assert.strictEqual(getListItems(this.instance).length, this.items.length, 'search was canceled');
        });

        QUnit.test('focusout if popup is closed', function(assert) {
            this.keyboard.type('111');
            this.instance.close();
            this.$input.trigger('focusout');

            assert.strictEqual(getListItems(this.instance).length, this.items.length, 'search was canceled');
        });

        QUnit.test('focusout if acceptCustomValue=true', function(assert) {
            this.reinit({ acceptCustomValue: true });

            this.keyboard
                .type('111')
                .blur();

            assert.strictEqual(getListItems(this.instance).length, this.items.length, 'search was canceled');
        });

        QUnit.test('apply button click', function(assert) {
            this.instance.option({ applyValueMode: 'useButtons' });

            this.keyboard.type('1');
            $(`.dx-button.${POPUP_DONE_BUTTON_CLASS}`).trigger('dxclick');

            assert.strictEqual(this.$input.val(), '', 'input was cleared');
            assert.strictEqual(getListItems(this.instance).length, this.items.length, 'search was canceled');
        });

        QUnit.test('apply button click if showSelectionControls=true', function(assert) {
            this.reinit({
                showSelectionControls: true,
                applyValueMode: 'useButtons'
            });

            this.keyboard.type('1');
            $(`.dx-button.${POPUP_DONE_BUTTON_CLASS}`).trigger('dxclick');

            assert.strictEqual(getListItems(this.instance).length, this.items.length, 'search was canceled');
        });
    });

    QUnit.module('search should not be canceled after', searchModuleSetup, () => {
        QUnit.test('cancel button click', function(assert) {
            this.instance.option({ applyValueMode: 'useButtons' });

            this.keyboard.type('1');
            $('.dx-button.dx-popup-cancel').trigger('dxclick');

            assert.strictEqual(this.$input.val(), '1', 'input was not cleared');
            assert.strictEqual(getListItems(this.instance).length, 1, 'search was not canceled');

            this.instance.open();
            assert.strictEqual(getListItems(this.instance).length, 1, 'search was not canceled on reopening');
        });

        QUnit.test('popup closing using esc', function(assert) {
            this.keyboard
                .type('1')
                .press('esc');

            assert.strictEqual(getListItems(this.instance).length, 1, 'search was not canceled');
        });

        QUnit.test('click on item if showSelectionControls=true', function(assert) {
            this.reinit('showSelectionControls', true);

            this.keyboard.type('2');

            const $listItems = getListItems(this.instance);
            $listItems.first().trigger('dxclick');

            assert.strictEqual($listItems.length, 2, 'search was not canceled');
        });

        QUnit.test('click on input if acceptCustomValue=true (T851874)', function(assert) {
            this.reinit({ acceptCustomValue: true });

            this.keyboard.type('111');
            this.$input.trigger('dxclick');

            assert.strictEqual(this.$input.val(), '111', 'input was not cleared');
            assert.strictEqual(getListItems(this.instance).length, 1, 'search was not canceled');
        });

        QUnit.test('click on input', function(assert) {
            this.keyboard.type('111');
            this.$input.trigger('dxclick');

            assert.strictEqual(getListItems(this.instance).length, 1, 'search was not canceled');
        });
    });

    QUnit.test('searchEnabled allows searching', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: ['test', 'custom'],
            searchEnabled: true,
            searchTimeout: 0
        });

        this.clock.tick(TIME_TO_WAIT);

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
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

        this.clock.tick(10);
        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
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

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const inputLeft = $input.offset().left;

        $tagBox.dxTagBox('option', 'value', ['Moscow']);
        this.clock.tick(TIME_TO_WAIT);

        assert.ok($input.offset().left > inputLeft, 'input is moved to the right');
    });

    QUnit.test('size of input changes depending on search value length', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            searchEnabled: true
        });

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
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
            const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
            $input.css('padding', '0 10px');

            keyboardMock($input).type(text);
            const inputWidth = $input.width();

            const inputCopy = createTextElementHiddenCopy($input, text);
            inputCopy.appendTo('#qunit-fixture');

            assert.ok(inputWidth >= getWidth(inputCopy));
            inputCopy.remove();
        });
    });

    QUnit.test('size of input is reset after selecting item', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            searchEnabled: true,
            items: ['test1', 'test2']
        });

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const initInputWidth = $input.width();

        $tagBox.dxTagBox('option', 'value', ['test1']);
        assert.roughEqual($tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`).width(), initInputWidth, 0.1, 'input width is not changed after selecting item');
    });

    QUnit.test('space entering should increase input element size (T923429)', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            searchEnabled: true
        });

        const text = '123456789          ';
        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard.type(text);
        const $inputCopy = createTextElementHiddenCopy($input, text, { includePaddings: true });
        $inputCopy
            .css('whiteSpace', 'pre')
            .appendTo('#qunit-fixture');
        const textWidth = getWidth($inputCopy);

        const currentWidth = getWidth($tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`));
        assert.ok(currentWidth > textWidth, `input width (${currentWidth}) should be grester then input text width (${textWidth})`);
        $inputCopy.remove();
    });

    QUnit.test('size of input is 1 when searchEnabled and acceptCustomValue is false', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            searchEnabled: false,
            acceptCustomValue: false
        });

        const input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`).get(0);
        const { width: inputWidth } = input.getBoundingClientRect();

        // NOTE: width should be 0.1 because of T393423
        assert.roughEqual(inputWidth, 0.1, 0.101, 'input has correct width');
    });

    QUnit.test('no placeholder when textbox is not empty', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            searchEnabled: true,
            placeholder: 'placeholder'
        });

        keyboardMock($tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`)).type('test');

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
        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
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

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
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

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
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
        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

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

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
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

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
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

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
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

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
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

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

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

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

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

        const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
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
        const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

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

        const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        keyboardMock($input).type('1');

        const itemsCount = $('.dx-list-item').length;

        assert.strictEqual(itemsCount, 2, 'search was performed');
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

        const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

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

        const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        $input.focus();

        keyboardMock($input).type('American Samo');

        assert.ok(handlerStub.called, 'repaint was fired');
    });

    QUnit.test('popup should update position after change height of input on dataSource "Loaded" event', function(assert) {
        const $element = $('#tagBox').dxTagBox({
            focusStateEnabled: true,
            opened: true,
            dataSource: {
                store: new CustomStore({
                    loadMode: 'raw',
                    load: function() {
                        const deferred = $.Deferred();

                        setTimeout(() => {
                            deferred.resolve(['testvalue1', 'testvalue2', 'testvalue3']);
                        }, TIME_TO_WAIT);

                        return deferred.promise();
                    }
                })
            },
            width: 170,
            value: ['testvalue1', 'testvalue2'],
            searchEnabled: true,
            searchTimeout: 0
        });

        this.clock.tick(TIME_TO_WAIT);

        const instance = $element.dxTagBox('instance');
        const popupContent = $(instance.content());
        const { top: initialTop } = popupContent.offset();

        $element
            .find(`.${TEXTEDITOR_INPUT_CLASS}`)
            .val('testtesttesttest')
            .trigger('input');

        this.clock.tick(TIME_TO_WAIT);

        const { top: updatedTop } = popupContent.offset();

        assert.ok(updatedTop > initialTop, 'Popup update position');
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
        const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        instance.open();
        const $popupWrapper = $(instance.content()).parents(`.${TAGBOX_POPUP_WRAPPER_CLASS}`);

        keyboard.type('aa');
        $popupWrapper.find(`.${LIST_CHECKBOX_CLASS}`).eq(0).trigger('dxclick');
        $popupWrapper.find(`.${POPUP_DONE_BUTTON_CLASS}`).trigger('dxclick');

        instance.close();
        instance.open();

        keyboard.type('aa');
        $popupWrapper.find(`.${LIST_CHECKBOX_CLASS}`).eq(1).trigger('dxclick');
        $popupWrapper.find(`.${POPUP_DONE_BUTTON_CLASS}`).trigger('dxclick');

        assert.strictEqual(instance.option('selectedItems').length, 2);
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

    QUnit.test('filtering operation should pass "select" parameter to the data source (T982439)', function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: 'dxdataservice',
            callback: ({ data }) => {
                assert.deepEqual(data, {
                    $filter: 'this eq \'1\'',
                    $select: 'name,company'
                });
                ajaxMock.clear();
                done();
            }
        });

        $('#tagBox').dxTagBox({
            value: ['1'],
            dataSource: new DataSource({
                store: new ODataStore({ url: 'dxdataservice' }),
                select: ['name', 'company']
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

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
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
        const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        keyboardMock($input).type('1');
        $('.dx-list-item').trigger('dxclick');

        assert.equal(instance.option('selectedItems').length, 1, 'selected items count');
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
                        let data;
                        if(loadOptions && loadOptions.searchValue) {
                            data = ['test1'];
                        } else if(loadOptions && loadOptions.filter) {
                            data = ['test2'];
                        } else {
                            data = ['test1', 'test2', 'test3'];
                        }

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
        this.clock.tick(TIME_TO_WAIT * 2);

        const $listItems = getListItems(instance);

        $listItems.first().trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT * 2);
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

        assert.strictEqual(loadStub.callCount, 3);
    });

    QUnit.test('TagBox should add all clicked items after search if dataSource is async (T958611)', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: getDSWithAsyncSearch(),
            valueExpr: 'id',
            displayExpr: 'id',
            showSelectionControls: true,
            searchEnabled: true,
            searchExpr: 'id',
            searchTimeout: TIME_TO_WAIT,
            opened: true
        });
        const tagBox = $tagBox.dxTagBox('instance');

        this.clock.tick(TIME_TO_WAIT * 3);
        let $listItems = getListItems(tagBox);
        $listItems.eq(0).trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT * 3);

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        keyboardMock($input).type('search');

        this.clock.tick(TIME_TO_WAIT * 4);
        $listItems = getListItems(tagBox);
        $listItems.eq(0).trigger('dxclick');
        $listItems.eq(1).trigger('dxclick');
        $listItems.eq(2).trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT * 4);

        const $tagContainer = $tagBox.find(`.${TAGBOX_TAG_CONTAINER_CLASS}`);

        assert.strictEqual($tagContainer.find(`.${TAGBOX_TAG_CONTENT_CLASS}`).length, 4, 'correctly tags count');
        assert.deepEqual(tagBox.option('value'), ['item 1', 'item for search 1', 'item for search 2', 'item for search 3'], 'correctly items values');
    });

    QUnit.test('TagBox should correctly add and remove all clicked items after search if dataSource is async (T958611)', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: getDSWithAsyncSearch(),
            valueExpr: 'id',
            displayExpr: 'id',
            showSelectionControls: true,
            searchEnabled: true,
            searchExpr: 'id',
            searchTimeout: TIME_TO_WAIT,
            opened: true
        });
        const tagBox = $tagBox.dxTagBox('instance');

        this.clock.tick(TIME_TO_WAIT * 3);
        let $listItems = getListItems(tagBox);
        $listItems.eq(0).trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT * 3);

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        keyboardMock($input).type('search');

        this.clock.tick(TIME_TO_WAIT * 4);
        $listItems = getListItems(tagBox);
        $listItems.eq(0).trigger('dxclick');
        $listItems.eq(1).trigger('dxclick');
        $listItems.eq(2).trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT * 4);

        $listItems.eq(3).trigger('dxclick');
        $listItems.eq(1).trigger('dxclick');
        $listItems.eq(2).trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT * 4);

        const $tagContainer = $tagBox.find(`.${TAGBOX_TAG_CONTAINER_CLASS}`);

        assert.strictEqual($tagContainer.find(`.${TAGBOX_TAG_CONTENT_CLASS}`).length, 3, 'correctly tags count');
        assert.deepEqual(tagBox.option('value'), ['item 1', 'item for search 1', 'item for search 4'], 'correctly items values');
    });

    QUnit.test('TagBox should correctly quickly add remove the same item after search if dataSource is async', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: getDSWithAsyncSearch(),
            valueExpr: 'id',
            displayExpr: 'id',
            showSelectionControls: true,
            searchEnabled: true,
            searchExpr: 'id',
            searchTimeout: TIME_TO_WAIT,
            opened: true
        });
        const tagBox = $tagBox.dxTagBox('instance');

        this.clock.tick(TIME_TO_WAIT * 3);
        let $listItems = getListItems(tagBox);
        $listItems.eq(0).trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT * 3);

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        keyboardMock($input).type('search');

        this.clock.tick(TIME_TO_WAIT * 4);
        $listItems = getListItems(tagBox);
        $listItems.eq(1).trigger('dxclick');
        $listItems.eq(1).trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT * 4);

        const $tagContainer = $tagBox.find(`.${TAGBOX_TAG_CONTAINER_CLASS}`);

        assert.strictEqual($tagContainer.find(`.${TAGBOX_TAG_CONTENT_CLASS}`).length, 1, 'correctly tags count');
        assert.deepEqual(tagBox.option('value'), ['item 1'], 'correctly items values');
    });

    QUnit.test('TagBox should correctly quickly add remove items after search if dataSource is async', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: getDSWithAsyncSearch(),
            valueExpr: 'id',
            displayExpr: 'id',
            showSelectionControls: true,
            searchEnabled: true,
            searchExpr: 'id',
            searchTimeout: TIME_TO_WAIT,
            opened: true
        });
        const tagBox = $tagBox.dxTagBox('instance');

        this.clock.tick(TIME_TO_WAIT * 3);
        let $listItems = getListItems(tagBox);
        $listItems.eq(0).trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT * 3);

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        keyboardMock($input).type('search');

        this.clock.tick(TIME_TO_WAIT * 4);
        $listItems = getListItems(tagBox);
        $listItems.eq(0).trigger('dxclick');
        $listItems.eq(1).trigger('dxclick');

        $listItems.eq(3).trigger('dxclick');
        $listItems.eq(1).trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT * 4);

        const $tagContainer = $tagBox.find(`.${TAGBOX_TAG_CONTAINER_CLASS}`);

        assert.strictEqual($tagContainer.find(`.${TAGBOX_TAG_CONTENT_CLASS}`).length, 3, 'correctly tags count');
        assert.deepEqual(tagBox.option('value'), ['item 1', 'item for search 1', 'item for search 4'], 'correctly items values');
    });

    QUnit.test('TagBox should correctly add and remove selected items after search if dataSource is async and all old items has been already selected', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: getDSWithAsyncSearch(),
            valueExpr: 'id',
            displayExpr: 'id',
            showSelectionControls: true,
            searchEnabled: true,
            searchExpr: 'id',
            searchTimeout: TIME_TO_WAIT,
            opened: true
        });
        const tagBox = $tagBox.dxTagBox('instance');

        this.clock.tick(TIME_TO_WAIT * 3);
        let $listItems = getListItems(tagBox);
        $listItems.eq(0).trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT * 3);

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        keyboardMock($input).type('search');

        this.clock.tick(TIME_TO_WAIT * 4);
        $listItems = getListItems(tagBox);
        $listItems.eq(0).trigger('dxclick');
        $listItems.eq(1).trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT * 4);
        $listItems.eq(3).trigger('dxclick');
        $listItems.eq(1).trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT * 4);

        const $tagContainer = $tagBox.find(`.${TAGBOX_TAG_CONTAINER_CLASS}`);

        assert.strictEqual($tagContainer.find(`.${TAGBOX_TAG_CONTENT_CLASS}`).length, 3, 'correctly tags count');
        assert.deepEqual(tagBox.option('value'), ['item 1', 'item for search 1', 'item for search 4'], 'correctly items values');
    });

    QUnit.test('TagBox should correctly add and quickly remove all items after search if dataSource is async with selectAllMode \'allPages\' (T978877)', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: getDSWithAsyncSearch(),
            valueExpr: 'id',
            displayExpr: 'id',
            showSelectionControls: true,
            selectAllMode: 'allPages',
            searchEnabled: true,
            searchExpr: 'id',
            searchTimeout: TIME_TO_WAIT,
            opened: true
        });
        const tagBox = $tagBox.dxTagBox('instance');

        this.clock.tick(TIME_TO_WAIT * 3);
        const $selectAllCheckbox = $(tagBox._list.$element().find(`.${SELECT_ALL_CHECKBOX_CLASS}`).eq(0));
        $selectAllCheckbox.trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT * 4);
        $selectAllCheckbox.trigger('dxclick');

        const $tagContainer = $tagBox.find(`.${TAGBOX_TAG_CONTAINER_CLASS}`);
        assert.strictEqual($tagContainer.find(`.${TAGBOX_TAG_CONTENT_CLASS}`).length, 0, 'no tags');
        assert.deepEqual(tagBox.option('value'), [], 'all items are deselected');
    });

    QUnit.test('TagBox should send one request if we select second item after search (T1029049)', function(assert) {
        const loadSpy = sinon.spy(getAsyncLoad());

        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: getDSWithAsyncSearch(loadSpy),
            valueExpr: 'id',
            displayExpr: 'id',
            selectAllMode: 'allPages',
            searchEnabled: true,
            searchExpr: 'id',
            dropDownOptions: {
                height: 120,
            },
            searchTimeout: TIME_TO_WAIT,
            opened: true
        });
        const tagBox = $tagBox.dxTagBox('instance');

        this.clock.tick(TIME_TO_WAIT * 3);

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        keyboardMock($input).type('item');

        let $listItems = getListItems(tagBox);

        $listItems.eq(0).trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT * 3);

        keyboardMock($input).type('search');

        this.clock.tick(TIME_TO_WAIT * 5);

        $listItems = getListItems(tagBox);

        $listItems.eq(0).trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT * 3);

        assert.strictEqual(loadSpy.callCount, 5, 'correct count of ds load');
    });

    QUnit.test('TagBox should use one DataSource request on list item selection if the editor has selected items from next pages (T970259)', function(assert) {
        const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }];

        const loadSpy = sinon.spy(function(loadOptions) {
            const deferred = $.Deferred();
            if(loadOptions.take && !loadOptions.searchValue) {
                deferred.resolve(data.slice().splice(loadOptions.skip, loadOptions.take));
            } else if(loadOptions.filter) {
                const result = data.filter((item) => {
                    if(Array.isArray(loadOptions.filter[0]) && item[2] && item[2].id === loadOptions.filter[2].id) {
                        return item[2];
                    } else if(item.id === loadOptions.filter[2].id) {
                        return item;
                    } else if(Array.isArray(loadOptions.filter) && loadOptions.filter.length > 2) {
                        for(let i = 0; i < loadOptions.filter.length; i++) {
                            const element = loadOptions.filter[i];
                            if(Array.isArray(element) && element[2] === item.id) {
                                return item;
                            }
                        }
                    }
                });

                deferred.resolve(result);
            }

            return deferred;
        });

        const dataSource = new DataSource({
            paginate: true,
            pageSize: 5,
            store: new CustomStore({
                key: 'id',
                load: loadSpy
            })
        });

        const $tagBox = $('#tagBox').dxTagBox({
            dataSource,
            valueExpr: 'id',
            displayExpr: 'id',
            showSelectionControls: true,
            opened: false,
            value: [1, 7],
            dropDownOptions: {
                height: 150
            }
        });
        const tagBox = $tagBox.dxTagBox('instance');

        tagBox.open();
        this.clock.tick(TIME_TO_WAIT);
        const $listItems = getListItems(tagBox);
        $listItems.eq(3).trigger('dxclick');
        this.clock.tick(TIME_TO_WAIT);

        assert.strictEqual(loadSpy.callCount, 4, 'no unnecessary loadings');
    });

    QUnit.test('Changing the data source should not cause an error when the search is active', function(assert) {
        let isOk = true;

        const tagBox = $('#tagBox')
            .dxTagBox({
                dataSource: null,
                searchEnabled: true,
                minSearchLength: 2,
                opened: true
            })
            .dxTagBox('instance');

        try {
            tagBox.option('dataSource', []);
        } catch(e) {
            isOk = false;
        }

        assert.ok(isOk, 'dataSource updated without errors');
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
        const height = getHeight(instance._popup._$popupContent);

        const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        $input.focus();

        keyboardMock($input).type('American Samo');

        const currentHeight = getHeight(instance._popup._$popupContent);

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

        $($tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`)).trigger('dxclick');
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

        const $input = $element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

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

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

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

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);
        keyboard.press('enter');

        assert.deepEqual($tagBox.dxTagBox('option', 'value'), [], 'empty value was not added');
    });

    QUnit.test('adding the custom tag should clear input value (T385448)', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            acceptCustomValue: true
        });

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

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
        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const tagBoxInstance = $tagBox.dxTagBox('instance');

        keyboardMock($input)
            .type('custom')
            .press('enter');

        $(getListItems($tagBox).first()).trigger('dxclick');
        const $tags = $tagBox.find('.dx-tag');

        assert.strictEqual($tags.length, 2, 'only two tags are added');
        assert.deepEqual(tagBoxInstance.option('selectedItems'), ['custom', 1], 'selected items are correct');
    });

    QUnit.test('The editor must have the actual value after this value has been entered following its deletion(T1197444)', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            acceptCustomValue: true,
            searchEnabled: false,
            openOnFieldClick: false,
            onCustomItemCreating: function(args) {
                const newValue = args.text;
                const component = args.component;
                const currentItems = component.option('items');
                currentItems.unshift(newValue);
                component.option('items', currentItems);
                args.customItem = newValue;
            }
        });

        const tagBoxInstance = $tagBox.dxTagBox('instance');

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard.type('1');
        $input.trigger('change');

        $(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`)
            .last()
            .trigger('dxclick');

        keyboard.type('1');
        $input.trigger('change');

        assert.deepEqual(tagBoxInstance.option('value'), ['1']);
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

        $(`.${SELECT_ALL_CHECKBOX_CLASS}`).trigger('dxclick');

        $(`.${LIST_CHECKBOX_CLASS}`).first().trigger('dxclick');
        $(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`).last().trigger('dxclick');

        $(`.${SELECT_ALL_CHECKBOX_CLASS}`).trigger('dxclick');

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

        const $removeButtons = tagBox.$element().find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`);

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

        fieldTemplateSpy.resetHistory();
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
        const tagBox = $tagBox.dxTagBox('instance');

        const $items = getListItems(tagBox);

        assert.equal($field.text(), '1', 'text was added on init');

        $($items.eq(0)).trigger('dxclick');

        assert.deepEqual($tagBox.dxTagBox('option', 'value'), [], 'value was cleared');
        assert.equal($field.text(), '', 'text was cleared after the deselect');
    });

    QUnit.test('click on remove tag button should not remove tag in another tagBox with fieldTemplate (T1137828)', function(assert) {
        const $tagBox = $('#anotherContainer').dxTagBox({
            items: [1, 2, 3],
            value: [1],
        });
        const tagBox = $tagBox.dxTagBox('instance');
        const tagBoxWithFieldTemplate = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            value: [1],
            fieldTemplate: () => $('<div>').dxTextBox()
        }).dxTagBox('instance');

        $tagBox.find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS }`).trigger('dxclick');

        assert.strictEqual(tagBox.option('value').length, 0);
        assert.strictEqual(tagBoxWithFieldTemplate.option('value').length, 1);
    });
});

QUnit.module('the "customItemCreateEvent" option', {
    beforeEach: function() {
        this.onCustomItemCreatingSpy = sinon.spy();

        this.$tagBox = $('#tagBox').dxTagBox({
            items: ['item 1'],
            acceptCustomValue: true,
            focusStateEnabled: true,
            onCustomItemCreating: (args) => {
                this.onCustomItemCreatingSpy();
                args.customItem = args.text;
            },
        });

        this.instance = this.$tagBox.dxTagBox('instance');
        this.$input = this.$tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        this.keyboard = keyboardMock(this.$input);
        this.customValue = 't';
    },
}, () => {
    const events = ['keyup', 'blur', 'change', 'input', 'focusout'];

    events.forEach((eventValue) => {
        QUnit.testInActiveWindow(`custom item has been added when customItemCreateEvent='${eventValue}'`, function(assert) {
            const { $input, customValue, keyboard, instance, onCustomItemCreatingSpy } = this;

            instance.option('customItemCreateEvent', eventValue);

            switch(eventValue) {
                case 'keyup':
                    instance.focus();
                    $input.val(customValue);
                    keyboard.keyUp(customValue);
                    break;
                case 'input':
                    keyboard.type(customValue);
                    break;
                case 'change':
                    keyboard.type(customValue);
                    $input.trigger('change');
                    break;
                case 'blur':
                case 'focusout':
                    keyboard.type(customValue);
                    $input.trigger(eventValue);
                    break;
            }

            assert.strictEqual(onCustomItemCreatingSpy.callCount, 1, 'the "onCustomItemCreating" was fired once');
        });
    });
});

QUnit.module('options changing', moduleSetup, () => {
    ['readOnly', 'disabled'].forEach((optionName) => {
        QUnit.test(`Typing events should be rerendered after ${optionName} option enabled (T986220)`, function(assert) {
            const $element = $('#tagBox');
            const tagBox = $element.dxTagBox({
                items: [1, 2],
                value: [1],
                searchEnabled: true
            }).dxTagBox('instance');

            tagBox.option(optionName, true);
            tagBox.option(optionName, false);

            keyboardMock($element.find(`.${TEXTEDITOR_INPUT_CLASS}`))
                .focus()
                .keyDown('backspace');

            assert.deepEqual(tagBox.option('value'), []);
        });
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

        const $input = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const $doneButton = $('.dx-button.dx-popup-done');

        keyboardMock($input)
            .focus()
            .type('c');

        $(`.${SELECT_ALL_CHECKBOX_CLASS}`).trigger('dxclick');

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

        const $input = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

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

    QUnit.test('value should be updated correctly after item is added if valueExpr="this" (T1141799)', function(assert) {
        const firstValue = { id: 1, description: 'item 1' };
        const secondValue = { id: 2, description: 'item 2' };
        const thirdValue = { id: 3, description: 'item 3' };

        this.reinit({
            items: [firstValue, secondValue, thirdValue],
            value: [firstValue, thirdValue],
            applyValueMode: 'useButtons',
            displayExpr: 'description',
            opened: true
        });

        $(this.$listItems.eq(1)).trigger('dxclick');
        $(this.$popupWrapper.find(`.${POPUP_DONE_BUTTON_CLASS}`)).trigger('dxclick');

        const items = this.instance.option('value');
        assert.strictEqual(items.length, 3);
        assert.deepEqual(items[0], firstValue);
        assert.deepEqual(items[1], thirdValue);
        assert.deepEqual(items[2], secondValue);
    });

    QUnit.test('value should be updated correctly after item is removed if valueExpr="this" (T1141799)', function(assert) {
        const firstValue = { id: 1, description: 'item 1' };
        const secondValue = { id: 2, description: 'item 2' };
        const thirdValue = { id: 3, description: 'item 3' };
        const allItems = [firstValue, secondValue, thirdValue];

        this.reinit({
            items: allItems,
            value: allItems,
            applyValueMode: 'useButtons',
            displayExpr: 'description',
            opened: true
        });

        $(this.$listItems.eq(1)).trigger('dxclick');
        $(this.$popupWrapper.find(`.${POPUP_DONE_BUTTON_CLASS}`)).trigger('dxclick');

        const items = this.instance.option('value');
        assert.strictEqual(items.length, 2);
        assert.deepEqual(items[0], firstValue);
        assert.deepEqual(items[1], thirdValue);
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
        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard.type('aaa');
        this.clock.tick(TIME_TO_WAIT);

        let $popupWrapper = $(tagBox.content()).parent().parent();

        $popupWrapper.find(`.${SELECT_ALL_CHECKBOX_CLASS}`).trigger('dxclick');
        $popupWrapper.find('.dx-popup-done.dx-button').trigger('dxclick');

        keyboard.type('bbb');
        this.clock.tick(TIME_TO_WAIT);

        $popupWrapper = $(tagBox.content()).parent().parent();

        $popupWrapper.find(`.${SELECT_ALL_CHECKBOX_CLASS}`).trigger('dxclick');
        $popupWrapper.find('.dx-popup-done.dx-button').trigger('dxclick');

        assert.deepEqual($tagBox.dxTagBox('instance').option('value'), [0, 1], 'value of TagBox');
    });
});

QUnit.module('the \'onSelectAllValueChanged\' option', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
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
        this.clock.restore();
        this.$element.remove();
    }
}, () => {
    QUnit.test('the \'onSelectAllValueChanged\' option behavior', function(assert) {
        const $selectAllCheckbox = this.instance._list.$element().find(`.${SELECT_ALL_CHECKBOX_CLASS}`);

        $($selectAllCheckbox).trigger('dxclick');
        assert.ok(this.spy.args[this.spy.args.length - 1][0].value, 'all items are selected');

        $($selectAllCheckbox).trigger('dxclick');
        assert.strictEqual(this.spy.args[this.spy.args.length - 1][0].value, false, 'all items are unselected');
    });

    QUnit.test('the \'onSelectAllValueChanged\' action is fired only one time if all items are selected', function(assert) {
        const $list = this.instance._list.$element();
        $($list.find(`.${SELECT_ALL_CHECKBOX_CLASS}`)).trigger('dxclick');
        assert.equal(this.spy.callCount, 1, 'count is correct');
    });

    QUnit.test('the \'onSelectAllValueChanged\' action is fired only one time if all items are unselected', function(assert) {
        this.reinit({
            items: this.items,
            value: this.items.slice()
        });

        const $list = this.instance._list.$element();
        $($list.find(`.${SELECT_ALL_CHECKBOX_CLASS}`)).trigger('dxclick');
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
        const $selectAllElement = $($list.find(`.${SELECT_ALL_CHECKBOX_CLASS}`));
        $selectAllElement.trigger('dxclick');
        assert.equal(this.spy.callCount, 0, 'count is correct');

        this.instance.on('selectAllValueChanged', spy);
        $selectAllElement.trigger('dxclick');

        assert.equal(spy.callCount, 1, 'count is correct');
    });

    QUnit.test('only all filtered items are selected if popup is closed on selectAllValueChanged (T1066477)', function(assert) {
        const loadTimeout = 200;

        this.reinit({
            opened: false,
            dataSource: {
                load: ({ searchValue, filter }) => {
                    const deferred = $.Deferred();

                    setTimeout(() => {
                        if(searchValue || filter) {
                            deferred.resolve({ data: [1], totalCount: 1 });
                        } else {
                            deferred.resolve({ data: [1, 2, 3], totalCount: 3 });
                        }
                    }, loadTimeout);

                    return deferred.promise();
                }
            },
            onSelectAllValueChanged: (e) => {
                if(e.value) {
                    e.component.close();
                }
            },
            selectAllMode: 'allPages',
            searchTimeout: 0,
            searchEnabled: true,
            animation: null
        });

        const $input = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        keyboardMock($input).type('1').change();

        this.clock.tick(loadTimeout);
        const $list = getList(this.instance);

        $($list.find(`.${LIST_ITEM_CLASS}`).eq(0)).trigger('dxclick');
        this.clock.tick(loadTimeout);

        assert.deepEqual(this.instance.option('selectedItems'), [1], 'selected items are correct');
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
        assert.roughEqual($container.scrollLeft(), $container.get(0).scrollWidth - $container.outerWidth(), 1, 'tags container is scrolled to the end');

        this.instance.option('value', this.items);
        assert.roughEqual($container.scrollLeft(), $container.get(0).scrollWidth - $container.outerWidth(), 1, 'tags container is scrolled to the end');
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
            .find(`.${TAGBOX_TAG_CONTAINER_CLASS}`)
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

    ['ctrlKey', 'metaKey'].forEach((commandKey) => {
        QUnit.test(`mousewheel with command key shouldn't prevented (${commandKey} pressed)`, function(assert) {
            if(devices.real().deviceType !== 'desktop') {
                assert.ok(true, 'desktop specific test');
                return;
            }

            const spy = sinon.spy();

            $(this.$element).on('dxmousewheel', spy);

            $(this.$element).trigger($.Event('dxmousewheel', {
                delta: -120,
                [commandKey]: true
            }));

            const event = spy.args[0][0];
            assert.notOk(event.isDefaultPrevented(), 'default is not prevented');
            assert.notOk(event.isPropagationStopped(), 'propagation is not stopped');
        });
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
        const $input = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        assert.equal($container.scrollLeft(), 0, 'scroll position is correct on rendering');

        $input
            .focus()
            .blur();

        assert.equal($container.scrollLeft(), 0, 'scroll position is correct on focus out');
    });

    QUnit.test('tags container should be scrolled to the end on focusin (T390041)', function(assert) {
        const $container = this.$element.find('.' + TAGBOX_TAG_CONTAINER_CLASS);

        this.instance.focus();
        assert.roughEqual($container.scrollLeft(), $container.get(0).scrollWidth - $container.outerWidth(), 1, 'tags container is scrolled to the end');
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
        const expectedScrollPosition = 0;

        assert.equal($container.scrollLeft(), expectedScrollPosition, 'scroll position is correct on rendering');

        this.instance.focus();
        this.instance.blur();

        assert.roughEqual($container.scrollLeft(), expectedScrollPosition, 1.01, 'scroll position is correct on focus out');
    });

    QUnit.test('tags container should be scrolled to the end on focusin in the RTL mode (T390041)', function(assert) {
        this.instance.option('rtlEnabled', true);

        const $container = this.$element.find('.' + TAGBOX_TAG_CONTAINER_CLASS);

        const expectedScrollPosition = -($container.get(0).scrollWidth - $container.outerWidth());

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
        const $inputWrapper = this.$element.find(`.${DROP_DOWN_EDITOR_INPUT_WRAPPER}`);

        $inputWrapper.on('mousedown', e => {
            // note: you should not prevent pointerdown because it will prevent click on ios real devices
            // you must use preventDefault in code because it is possible to use .on('focusout', handler) instead of onFocusOut option
            assert.ok(e.isDefaultPrevented(), 'mousedown was prevented and lead to focusout prevent');
        });

        this.instance.focus();
        $inputWrapper.trigger('mousedown');
    });

    QUnit.test('mousedown should not be prevented when input field clicked (T1046705)', function(assert) {
        const $inputWrapper = this.$element.find(`.${DROP_DOWN_EDITOR_INPUT_WRAPPER}`);
        const $input = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        $inputWrapper.on('mousedown', e => {
            assert.notOk(e.isDefaultPrevented(), 'mousedown was not prevented');
        });

        this.instance.focus();
        $input.trigger('mousedown');
    });

    QUnit.test('mousedown should not be prevented on first focusin (T1102475)', function(assert) {
        const $inputWrapper = this.$element.find(`.${DROP_DOWN_EDITOR_INPUT_WRAPPER}`);
        const $input = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        $inputWrapper.on('mousedown', e => {
            assert.notOk(e.isDefaultPrevented(), 'mousedown was not prevented');
        });

        $input.trigger('mousedown');
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
            this.keyboard = keyboardMock(this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`));
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

    ['left', 'right'].forEach((directionKey) => {
        QUnit.test(`empty editor should correctly handle ${directionKey} key (T959418)`, function(assert) {
            this.reinit({
                items: this.items,
                multiline: false,
                focusStateEnabled: true,
                searchEnabled: true
            });
            try {
                this.keyboard
                    .focus()
                    .press(directionKey);
                assert.ok(true, `${directionKey} key handled correctly`);
            } catch(e) {
                assert.ok(false, `${directionKey} key: error has been raised`);
            }
        });
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

        this.instance.focus();
        this.instance.option('value', [this.items[0]]);

        let expectedScrollPosition = -($container.get(0).scrollWidth - $container.outerWidth());
        assert.roughEqual($container.scrollLeft(), expectedScrollPosition, 1.01, 'tags container is scrolled to the start');

        this.instance.option('value', this.items);
        expectedScrollPosition = -($container.get(0).scrollWidth - $container.outerWidth());

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
        assert.roughEqual($focusedTag.position().left + $focusedTag.width(), containerWidth, 1.5, 'focused tag is visible');

        this.keyboard
            .press('right')
            .press('right');

        $focusedTag = this.getFocusedTag();
        assert.roughEqual($focusedTag.position().left + $focusedTag.width(), containerWidth, 1.5, 'focused tag is visible');
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

        const expectedScrollPosition = -($container.get(0).scrollWidth - $container.outerWidth());

        assert.roughEqual($container.scrollLeft(), expectedScrollPosition, 1.01, 'tags container is scrolled to the start');
    });
});

QUnit.module('dataSource integration', moduleSetup, () => {
    [{
        dataSource: [1, 2, 3, 4, 5],
        titleSuffix: 'is not grouped'
    }, {
        dataSource: [{ key: 'key', items: [1, 2] }],
        titleSuffix: 'is grouped'
    }].forEach(({ dataSource, titleSuffix }) => {
        QUnit.test(`setting dataSource to null after opening should not raise any errors if dataSource ${titleSuffix} (T1046896)`, function(assert) {
            const tagBox = $('#tagBox').dxTagBox({
                dataSource
            }).dxTagBox('instance');

            tagBox.open();

            try {
                tagBox.option('dataSource', null);
            } catch(e) {
                assert.ok(false, `error is raised: ${e}`);
            } finally {
                assert.ok(true, 'no errors is raised');
            }
        });
    });

    QUnit.test('item should be chosen synchronously if item is already loaded', function(assert) {
        assert.expect(0);

        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: {
                load() {
                    return [1, 2, 3, 4, 5];
                }
            }
        });

        this.clock.tick(10);

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
        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
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
        const kb = keyboardMock($tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`));

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
                assert.ok(false, 'Cannot update tagbox size because of input value is initRender[] object');
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

    QUnit.test('tags loading call result should be ignored after new call', function(assert) {
        const items = [{ id: 1, text: 'first' }, { id: 2, text: 'second' }];
        const customStore = new CustomStore({
            load: () => {
                const deferred = $.Deferred();
                setTimeout(() => {
                    deferred.resolve({ data: items, totalCount: items.length });
                }, 100);
                return deferred.promise();
            }
        });
        const dataSource = new DataSource({
            store: customStore
        });
        const tagBox = $('#tagBox').dxTagBox({
            dataSource: dataSource,
            displayExpr: 'text',
            valueExpr: 'id',
            value: [1],
        }).dxTagBox('instance');

        this.clock.tick(20);
        tagBox.option('value', [2]);

        this.clock.tick(80);
        const list = getList(tagBox).dxList('instance');
        assert.strictEqual(list.option('selectedItemKeys').length, 0, 'first loading result is ignored');
        this.clock.tick(20);
        assert.strictEqual(list.option('selectedItemKeys')[0], 2, 'value is correct');
    });

    QUnit.test('tags loading call result should be ignored after new call when grouped=true', function(assert) {
        const items = [{ key: 'key', items: [{ id: 1, text: 'first' }, { id: 2, text: 'second' }] }];
        const customStore = new CustomStore({
            load: (options) => {
                const deferred = $.Deferred();
                setTimeout(() => {
                    deferred.resolve({ data: items[0].items, totalCount: 2 });
                }, 200);
                return deferred.promise();
            }
        });
        const dataSource = new DataSource({
            store: customStore,
            key: 'id'
        });
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource,
            displayExpr: 'text',
            valueExpr: 'id',
            grouped: true,
            value: [1],
            deferRendering: true
        });
        const tagBox = $tagBox.dxTagBox('instance');

        this.clock.tick(100);
        tagBox.option('value', [2]);
        this.clock.tick(100);

        assert.strictEqual(tagBox.option('selectedItems').length, 0, 'first request is cancelled');
        this.clock.tick(100);
        assert.strictEqual(tagBox.option('selectedItems')[0].id, 2, 'second loading result');
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

        $($tagBox.find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`).eq(0)).trigger('dxclick');

        filter = load.lastCall.args[0].filter;
        assert.deepEqual(filter, null, 'filter is correct');
    });

    QUnit.module('item getter call count on selection change', {
        // NOTE: If some of this tests is failed it can mean that selection performance worsens.
        //       Don't consider these tests as a strict requirement.
        beforeEach: function() {
            this.items = [];
            let keyGetterCallCount = 0;

            const getter = function() {
                keyGetterCallCount++;
                return this._id;
            };
            for(let i = 1; i <= 100; i++) {
                const item = { _id: i, text: 'item ' + i };
                Object.defineProperty(item, 'id', {
                    get: getter,
                    enumerable: true,
                    configurable: true
                });
                this.items.push(item);
            }

            const arrayStore = new ArrayStore({
                data: this.items,
                key: 'id'
            });

            this.tagBox = $('#tagBox').dxTagBox({
                dataSource: arrayStore,
                valueExpr: 'id',
                opened: true,
                showSelectionControls: true,
                selectionMode: 'all',
                selectAllMode: 'allPages',
                displayExpr: 'text'
            }).dxTagBox('instance');

            this.getValueGetterCallCount = () => {
                return keyGetterCallCount;
            };
            this.resetGetterCallCount = () => {
                keyGetterCallCount = 0;
            };
        }
    }, () => {
        QUnit.test('on select all', function(assert) {
            const isValueEqualsSpy = sinon.spy(this.tagBox, '_isValueEquals');

            this.resetGetterCallCount();
            $(`.${SELECT_ALL_CHECKBOX_CLASS}`).trigger('dxclick');

            assert.strictEqual(this.getValueGetterCallCount(), 6154, 'key getter call count');
            assert.strictEqual(isValueEqualsSpy.callCount, 5050, '_isValueEquals call count');
        });

        QUnit.test('on one item deselect after select all', function(assert) {
            this.tagBox.option('value', this.items.map(item => item._id));

            this.resetGetterCallCount();
            const checkboxes = $(`.${LIST_CHECKBOX_CLASS}`);
            checkboxes.eq(checkboxes.length - 1).trigger('dxclick');

            assert.strictEqual(this.getValueGetterCallCount(), 6054, 'key getter call count');
        });
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

QUnit.module('maxFilterQueryLength', {
    beforeEach: function() {
        this.load = sinon.stub();
        const initialOptions = {
            dataSource: {
                load: this.load
            },
            value: Array.apply(null, { length: 1 }).map(Number.call, Number),
            valueExpr: 'id',
            displayExpr: 'text'
        };

        this.instance = $('#tagBox')
            .dxTagBox(initialOptions)
            .dxTagBox('instance');

        this.reinit = (options) => {
            this.instance.dispose();
            this.instance = $('#tagBox')
                .dxTagBox($.extend({}, options, initialOptions))
                .dxTagBox('instance');
        };

        this.stubLogger = (assert) => {
            this.stub = sinon.stub(uiErrors, 'log').callsFake((warning) => {
                assert.strictEqual(warning, 'W1019', 'warning is correct');
            });
        };
    },
    afterEach: function() {
        this.stub && this.stub.restore();
    }
}, () => {
    QUnit.test('load filter should be undefined when tagBox has some initial values and maxFilterQueryLength was changed at runtime', function(assert) {
        this.instance.option('maxFilterQueryLength', 0);
        this.instance.option('value', Array.apply(null, { length: 2 }).map(Number.call, Number));

        assert.ok(this.load.getCall(0).args[0].filter);
        assert.strictEqual(this.load.getCall(this.load.callCount - 1).args[0].filter, undefined);
    });

    QUnit.test('W1019 warning should be logged after maxFilterQueryLength was changed at runtime and exceeded', function(assert) {
        assert.expect(1);

        this.stubLogger(assert);

        this.instance.option('maxFilterQueryLength', 0);
        this.instance.option('value', Array.apply(null, { length: 2 }).map(Number.call, Number));
    });

    QUnit.test('load filter should be undefined when tagBox has some initial values and maxFilterQueryLength is exceeded', function(assert) {
        this.reinit({ maxFilterQueryLength: 1 });

        assert.strictEqual(this.load.getCall(this.load.callCount - 1).args[0].filter, undefined);
    });

    QUnit.test('W1019 warning should be logged if maxFilterQueryLength is exceeded', function(assert) {
        assert.expect(1);

        this.stubLogger(assert);

        this.reinit({ maxFilterQueryLength: 1 });
    });

    QUnit.test('load filter should be passed to dataSource when tagBox has some initial values and maxFilterQueryLength is not exceeded', function(assert) {
        assert.ok(this.load.getCall(0).args[0].filter);
    });

    QUnit.test('no warning should be logged if maxFilterQueryLength is not exceeded', function(assert) {
        assert.expect(0);

        this.stubLogger(assert);

        this.reinit({});
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
        this.clock.tick(10);
        assert.ok(tagBox.option('selectedItems').length);
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

        const $input = tagBox.$element().find(`.${TEXTEDITOR_INPUT_CLASS}`);
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

        this.clock.tick(10);
        assert.equal(tagBox.option('selectedItems').length, 2, 'selectedItems contains all selected values');

        const $container = tagBox.$element().find('.' + TAGBOX_TAG_CONTAINER_CLASS);
        const $tagRemoveButtons = $container.find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`);

        tagBox.option('onSelectionChanged', e => {
            assert.deepEqual(e.removedItems.length, 1, 'removed item was added when tag deleted');
            assert.equal(e.addedItems.length, 0, 'there are no added items when tag deleted');
        });

        $($tagRemoveButtons.eq(1)).trigger('dxclick');

        this.clock.tick(10);

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

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
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
        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        $input.focus();
        assert.ok($tagBox.hasClass(FOCUSED_CLASS), 'focused class was applied');

        $input.blur();
        assert.notOk($tagBox.hasClass(FOCUSED_CLASS), 'focused class was removed');
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

        $(`.${SELECT_ALL_CHECKBOX_CLASS}`).trigger('dxclick');

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

    QUnit.test('maxFilterQueryLength option should be propagated to selection and allow to exceed its default limit (T1191760)', function(assert) {
        const arrayLength = 25;
        const arraySource = Array(arrayLength).fill(null).map((_, idx) => ({
            display: `Item ${idx}`,
            value: new Guid().toString()
        }));
        const dataSource = new DataSource({
            paginate: true,
            store: new CustomStore({
                key: 'value',
                byKey: (key) => arraySource.find(item => item.value === key),
                load: (loadOptions) => {
                    const d = $.Deferred();

                    setTimeout(() => {
                        if(loadOptions.filter) {
                            d.resolve({
                                data: arraySource,
                                request: { skip: 0, take: arrayLength },
                                totalCount: arrayLength
                            });
                        } else if(loadOptions.skip === 0) {
                            d.resolve({
                                data: arraySource.slice(0, 19),
                                request: { skip: 0, take: 20 },
                                totalCount: arrayLength
                            });
                        } else if(loadOptions.skip === 20) {
                            d.resolve({
                                data: arraySource.slice(20),
                                request: { skip: 20, take: 20 },
                                totalCount: arrayLength
                            });
                        }
                    }, 0);

                    return d.promise();
                }
            })
        });
        const value = arraySource.map(o => o.value);
        const $element = $('#tagBox')
            .dxTagBox({
                dataSource,
                value,
                keyExpr: 'value',
                displayExpr: 'display',
                showSelectionControls: true,
                maxFilterQueryLength: 9999,
                deferRendering: false,
            });

        const $inputWrapper = $element.find(`.${DROP_DOWN_EDITOR_INPUT_WRAPPER}`);

        this.clock.tick(50);
        $inputWrapper.trigger('dxclick');

        const selectAllCheckBox = $(`.${SELECT_ALL_CHECKBOX_CLASS}`).dxCheckBox('instance');

        assert.strictEqual(selectAllCheckBox.option('value'), true, 'the "select all" checkbox is checked');
    });
});

QUnit.module('valueChanged should receive correct event parameter', {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();

        this.valueChangedHandler = sinon.stub();
        const initialOptions = {
            focusStateEnabled: true,
            items: [1, 2, 3],
            onValueChanged: this.valueChangedHandler,
            opened: true,
            value: [1, 2],
        };
        this.init = (options) => {
            this.$element = $('<div>')
                .appendTo('#qunit-fixture')
                .dxTagBox(options);
            this.instance = this.$element.dxTagBox('instance');
            this.$input = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
            this.keyboard = keyboardMock(this.$input);
            this.$listItems = $(this.instance.content()).find(`.${LIST_ITEM_CLASS}`);
            this.$firstItem = this.$listItems.eq(0);
        };
        this.reinit = (options) => {
            this.instance.dispose();
            this.init($.extend({}, initialOptions, options));
        };
        this.testProgramChange = (assert) => {
            this.instance.option('value', [3]);

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
        this.$element.remove();
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    [false, true].forEach(showSelectionControls => {
        QUnit.module(`when showSelectionControls=${showSelectionControls}`, {
            beforeEach: function() {
                this.reinit({ showSelectionControls });
            }
        }, () => {
            QUnit.test('on runtime change', function(assert) {
                this.testProgramChange(assert);
            });

            QUnit.test('on tag removing using backspace (T947619)', function(assert) {
                this.keyboard
                    .focus()
                    .keyDown('backspace');

                this.checkEvent(assert, 'keydown', this.$input, 'backspace');
                this.testProgramChange(assert);
            });

            QUnit.test('on tag removing using delete', function(assert) {
                this.keyboard
                    .focus()
                    .press('left')
                    .keyDown('del');

                this.checkEvent(assert, 'keydown', this.$input, 'delete');
                this.testProgramChange(assert);
            });

            QUnit.test('on tag removing using remove button', function(assert) {
                const $removeButton = this.$element
                    .find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`)
                    .first();

                $removeButton.trigger('dxclick');

                this.checkEvent(assert, 'dxclick', $removeButton);
                this.testProgramChange(assert);
            });

            QUnit.test('on click on item (T947619)', function(assert) {
                this.$firstItem.trigger('dxclick');

                this.checkEvent(assert, 'dxclick', this.$firstItem);
                this.testProgramChange(assert);
            });

            QUnit.test('on click on clearButton', function(assert) {
                this.reinit({ showClearButton: true });
                const $clearButton = this.$element.find(`.${CLEAR_BUTTON_AREA}`);

                $clearButton.trigger('dxclick');

                this.checkEvent(assert, 'dxclick', $clearButton);
                this.testProgramChange(assert);
            });

            ['enter', 'space'].forEach(key => {
                QUnit.test(`on item selecting using ${key}`, function(assert) {
                    this.reinit({ value: [] });

                    this.keyboard
                        .focus()
                        .press('down')
                        .keyDown(key);

                    this.checkEvent(assert, 'keydown', this.$firstItem, key);
                    this.testProgramChange(assert);
                });
            });

            QUnit.test('on custom item adding', function(assert) {
                this.reinit({ acceptCustomValue: true });

                this.keyboard
                    .type('custom')
                    .press('enter');

                this.checkEvent(assert, 'keydown', this.$input, 'enter');
                this.testProgramChange(assert);
            });

            QUnit.test('on click on apply button when applyValueMode=useButtons', function(assert) {
                this.reinit({ applyValueMode: 'useButtons' });
                const $applyButton = $('.dx-button.dx-popup-done');

                this.$firstItem.trigger('dxclick');
                $applyButton.trigger('dxclick');

                this.checkEvent(assert, 'dxclick', $applyButton);
                this.testProgramChange(assert);
            });
        });
    });

    QUnit.module('when showSelectionControls=true', {
        beforeEach: function() {
            this.reinit({ showSelectionControls: true });
            this.$firstItemCheckBox = this.$firstItem.find(`.${LIST_CHECKBOX_CLASS}`);
            this.$selectAllItem = $(`.${SELECT_ALL_CLASS}`);
            this.$selectAllItemCheckBox = $(`.${SELECT_ALL_CHECKBOX_CLASS}`);
        }
    }, () => {
        QUnit.test('on click on item checkBox (T947619)', function(assert) {
            this.$firstItemCheckBox.trigger('dxclick');

            this.checkEvent(assert, 'dxclick', this.$firstItemCheckBox);
            this.testProgramChange(assert);
        });

        QUnit.test('on click on selectAll item (T947619)', function(assert) {
            this.$selectAllItem.trigger('dxclick');

            this.checkEvent(assert, 'dxclick', this.$selectAllItem);
            this.testProgramChange(assert);
        });

        QUnit.test('on click on selectAll item checkBox (T947619)', function(assert) {
            this.$selectAllItemCheckBox.trigger('dxclick');

            this.checkEvent(assert, 'dxclick', this.$selectAllItemCheckBox);
            this.testProgramChange(assert);
        });

        ['enter', 'space'].forEach(key => {
            QUnit.test(`on selectAll item selecting using ${key}`, function(assert) {
                this.keyboard
                    .focus()
                    .press('down')
                    .press('up')
                    .keyDown(key);

                this.checkEvent(assert, 'keydown', this.$selectAllItem, key);
                this.testProgramChange(assert);
            });
        });
    });
});

QUnit.module('label integration', () => {
    QUnit.test('tagBox should pass containerWidth equal to tag container width', function(assert) {
        const that = this;

        this.TextEditorLabelMock = function(args) {
            that.labelArgs = args;
            return new TextEditorLabel(args);
        };

        TagBox.mockTextEditorLabel(this.TextEditorLabelMock);

        try {
            const $tagBox = $('#tagBox').dxTagBox({
                label: 'some'
            });

            const $tagContainer = $tagBox.find(`.${TAGBOX_TAG_CONTAINER_CLASS}`);
            const tagContainerWidth = getWidth($tagContainer);
            assert.strictEqual(this.labelArgs.getContainerWidth(), tagContainerWidth);
        } finally {
            TagBox.restoreTextEditorLabel();
        }
    });
});

QUnit.module('accessibility', () => {
    QUnit.test('Custom aria-label attribute should be added to input if inputAttr property is used', function(assert) {
        const productsData = [
            'HD Video Player',
            'SuperHD Video Player',
            'SuperPlasma 50',
        ];
        const productLabel = { 'aria-label': 'Product' };
        const $tagBox = $('#tagBox').dxTagBox({
            items: productsData,
            inputAttr: productLabel,
            value: productsData,
            maxDisplayedTags: 3,
            showMultiTagOnly: false
        });

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        assert.strictEqual($input.attr('aria-label'), 'Product', 'input aria-label attribute is correct');
    });

    QUnit.test('input should not have aria-attribute by default', function(assert) {
        const productsData = [
            'HD Video Player',
            'SuperHD Video Player',
            'SuperPlasma 50',
        ];

        const $tagBox = $('#tagBox').dxTagBox({
            items: productsData,
            value: productsData,
            maxDisplayedTags: 3,
            showMultiTagOnly: false
        });

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        assert.strictEqual($input.attr('aria-label'), undefined, 'input aria-label attribute is not presented');
    });

    QUnit.test('Tag aria-label should contain correct tag text value', function(assert) {
        const productsData = [
            'HD Video Player',
            'SuperHD Video Player',
            'SuperPlasma 50',
        ];

        const $tagBox = $('#tagBox').dxTagBox({
            items: productsData,
            value: productsData,
            maxDisplayedTags: 3,
            showMultiTagOnly: false
        });
        const $tags = $tagBox.find(`.${TAGBOX_TAG_CLASS}`);

        assert.strictEqual($tags.length, 3, 'tags count is correct');
        assert.strictEqual($tags.eq(0).attr('aria-label'), 'HD Video Player', 'aria-label is tagged correctly');
        assert.strictEqual($tags.eq(1).attr('aria-label'), 'SuperHD Video Player', 'aria-label is tagged correctly');
        assert.strictEqual($tags.eq(2).attr('aria-label'), 'SuperPlasma 50', 'aria-label is tagged correctly');
    });

    QUnit.test('Multitag should have an aria-label that includes the count of selected items', function(assert) {
        const productsData = [{
            ID: 1,
            Name: 'Tag_1',
        }, {
            ID: 2,
            Name: 'Tag_2',
        }];
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: productsData,
            valueExpr: 'ID',
            value: [productsData[0].ID, productsData[1].ID],
            displayExpr: 'Name',
            maxDisplayedTags: 1,
            showMultiTagOnly: true
        });

        const $tag = $tagBox.find(`.${TAGBOX_TAG_CLASS}`);

        assert.strictEqual($tag.length, 1, 'only one tag is presented');
        assert.strictEqual($tag.attr('aria-label'), '2 selected', 'aria-label is tagged correctly');
    });

    QUnit.test('Tag aria-label attribute should have correct text value according displayExpr setting', function(assert) {
        const productsData = [{
            ID: 1,
            Name: 'Tag_1',
        }, {
            ID: 2,
            Name: 'Tag_2',
        }];
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: productsData,
            valueExpr: 'ID',
            value: [productsData[0].ID, productsData[1].ID],
            displayExpr: 'Name',
            maxDisplayedTags: 3,
            showMultiTagOnly: true
        });

        const $tags = $tagBox.find(`.${TAGBOX_TAG_CLASS}`);

        assert.strictEqual($tags.length, 2, 'tags count is correct');
        assert.strictEqual($tags.eq(0).attr('aria-label'), 'Tag_1', 'aria-label is tagged correctly');
        assert.strictEqual($tags.eq(1).attr('aria-label'), 'Tag_2', 'aria-label is tagged correctly');
    });


    QUnit.test('multitag should have correct aria attributes', function(assert) {
        const sampleData = ['First Item', 'Second Item', 'Third Item', 'Fourth Item'];
        const $tagBox = $('#tagBox').dxTagBox({
            items: sampleData,
            value: sampleData,
            maxDisplayedTags: 2,
            showMultiTagOnly: false,
        });
        const parentTagContainerIds = $tagBox.attr('aria-labelledby').split(' ');
        const $multiTagContainer = $tagBox.find(`.${TAGBOX_MULTI_TAG_CLASS}`);
        const selectedItemsLength = $tagBox.dxTagBox('instance').option('selectedItems').length;

        assert.strictEqual(parentTagContainerIds.includes($multiTagContainer.attr('id')), true, 'aria-labelledby attribute contains multitag id');
        assert.strictEqual($multiTagContainer.attr('role'), 'button', 'role attribute is correct');
        assert.strictEqual($multiTagContainer.attr('aria-label'), `${selectedItemsLength - 1} more`, 'aria-label attribute is correct');
        assert.strictEqual($multiTagContainer.attr('aria-roledescription'), messageLocalization.format('dxTagBox-tagRoleDescription'), 'aria-roledescription attribute is correct');
    });

    QUnit.test('root element should have aria-labelledby attribute based from multitag id', function(assert) {
        const sampleData = ['First Item', 'Second Item', 'Third Item', 'Fourth Item'];
        const $tagBox = $('#tagBox').dxTagBox({
            items: sampleData,
            value: sampleData,
            maxDisplayedTags: 2,
            showMultiTagOnly: false,
        });
        const $multiTagContainer = $tagBox.find(`.${TAGBOX_MULTI_TAG_CLASS}`);
        const parentTagContainerIds = $tagBox.attr('aria-labelledby').split(' ');

        assert.strictEqual(parentTagContainerIds.length, 2, 'root element aria-labelledby attribute contains two ids');
        assert.strictEqual(parentTagContainerIds.includes($multiTagContainer.attr('id')), true, 'aria-labelledby attribute contains multitag id');
    });

    QUnit.test('tagBox should show correct count of tags if showMultiTagOnly=true and maxDisplay tags is 2', function(assert) {
        const sampleData = ['First Item', 'Second Item', 'Third Item', 'Fourth Item'];
        const $tagBox = $('#tagBox').dxTagBox({
            items: sampleData,
            value: sampleData,
            maxDisplayedTags: 2,
            showMultiTagOnly: true,
        });
        const parentTagContainerIds = $tagBox.attr('aria-labelledby').split(' ');
        const simpleTagsLength = $tagBox.find(`.${TAGBOX_TAG_CLASS}:not(.${TAGBOX_MULTI_TAG_CLASS})`).length;
        const multiTagsLength = $tagBox.find(`.${TAGBOX_MULTI_TAG_CLASS}`).length;
        const tagIds = $tagBox.find(`.${TAGBOX_TAG_CLASS}`).map((_, element) => $(element).attr('id')).get();

        assert.strictEqual(simpleTagsLength, 0, 'root element has no simple tag');
        assert.strictEqual(multiTagsLength, 1, 'root element contains one multitag');
        assert.strictEqual(tagIds.every(item => parentTagContainerIds.includes(item)), true, 'root element contains all tag ids when showMultiTagOnly = true and maxDisplayTags = 2');
    });

    QUnit.test('tagBox should show correct count of tags if showMultiTagOnly=true and maxDisplayTags is 4', function(assert) {
        const sampleData = ['First Item', 'Second Item', 'Third Item', 'Fourth Item'];
        const $tagBox = $('#tagBox').dxTagBox({
            items: sampleData,
            value: sampleData,
            maxDisplayedTags: 4,
            showMultiTagOnly: true,
        });
        const simpleTagsLength = $tagBox.find(`.${TAGBOX_TAG_CLASS}:not(.${TAGBOX_MULTI_TAG_CLASS})`).length;
        const multiTagsLength = $tagBox.find(`.${TAGBOX_MULTI_TAG_CLASS}`).length;
        const parentTagContainerIds = $tagBox.attr('aria-labelledby').split(' ');
        const tagIds = $tagBox.find(`.${TAGBOX_TAG_CLASS}`).map((_, element) => $(element).attr('id')).get();

        assert.strictEqual(simpleTagsLength, 4, 'root element contains four simple tag');
        assert.strictEqual(multiTagsLength, 0, 'root element has no multitag');
        assert.strictEqual(tagIds.every(item => parentTagContainerIds.includes(item)), true, 'root element contains all tag ids when showMultiTagOnly = true and maxDisplayTags = 4');
    });

    QUnit.test('tagBox should show correct count of tags if showMultiTagOnly=false and maxDisplayTags is 2', function(assert) {
        const sampleData = ['First Item', 'Second Item', 'Third Item', 'Fourth Item'];
        const $tagBox = $('#tagBox').dxTagBox({
            items: sampleData,
            value: sampleData,
            maxDisplayedTags: 2,
            showMultiTagOnly: false,
        });
        const simpleTagsLength = $tagBox.find(`.${TAGBOX_TAG_CLASS}:not(.${TAGBOX_MULTI_TAG_CLASS})`).length;
        const multiTagsLength = $tagBox.find(`.${TAGBOX_MULTI_TAG_CLASS}`).length;
        const parentTagContainerIds = $tagBox.attr('aria-labelledby').split(' ');
        const tagIds = $tagBox.find(`.${TAGBOX_TAG_CLASS}`).map((_, element) => $(element).attr('id')).get();

        assert.strictEqual(simpleTagsLength, 1, 'root element contains 1 simple tag');
        assert.strictEqual(multiTagsLength, 1, 'root element contains one multitag');
        assert.strictEqual(tagIds.every(item => parentTagContainerIds.includes(item)), true, 'root element contains all tag ids when showMultiTagOnly = false and maxDisplayTags = 2');
    });

    QUnit.test('tagBox should show correct count of tags if showMultiTagOnly=false and maxDisplayTags is 4', function(assert) {
        const sampleData = ['First Item', 'Second Item', 'Third Item', 'Fourth Item'];
        const $tagBox = $('#tagBox').dxTagBox({
            items: sampleData,
            value: sampleData,
            maxDisplayedTags: 4,
            showMultiTagOnly: false,
        });
        const simpleTagsLength = $tagBox.find(`.${TAGBOX_TAG_CLASS}:not(.${TAGBOX_MULTI_TAG_CLASS})`).length;
        const multiTagsLength = $tagBox.find(`.${TAGBOX_MULTI_TAG_CLASS}`).length;
        const parentTagContainerIds = $tagBox.attr('aria-labelledby').split(' ');
        const tagIds = $tagBox.find(`.${TAGBOX_TAG_CLASS}`).map((_, element) => $(element).attr('id')).get();

        assert.strictEqual(simpleTagsLength, 4, 'root element contains four simple tag');
        assert.strictEqual(multiTagsLength, 0, 'root element has no multitag');
        assert.strictEqual(tagIds.every(item => parentTagContainerIds.includes(item)), true, 'root element contains all tag ids when showMultiTagOnly = false and maxDisplayTags = 4');
    });

    QUnit.test('root element should not have multitag id when its deleted', function(assert) {
        const sampleData = ['First Item', 'Second Item', 'Third Item', 'Fourth Item'];
        const $tagBox = $('#tagBox').dxTagBox({
            items: sampleData,
            value: sampleData,
            maxDisplayedTags: 2,
            showMultiTagOnly: false,
        });

        const $multiTagContainer = $tagBox.find(`.${TAGBOX_MULTI_TAG_CLASS}`);
        let parentTagContainerIds = $tagBox.attr('aria-labelledby').split(' ');

        assert.strictEqual(parentTagContainerIds.includes($multiTagContainer.attr('id')), true, 'root element includes multitag id when multitag is not removed');

        $multiTagContainer.find(`.${TAGBOX_TAG_REMOVE_BUTTON_CLASS}`).trigger('dxclick');

        parentTagContainerIds = $tagBox.attr('aria-labelledby').split(' ');

        assert.strictEqual(!parentTagContainerIds.includes($multiTagContainer.attr('id')), true, 'root element contains one id when multitag is removed');
    });

    QUnit.test('input should have aria-labelledby with a labelId if label specified', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({ label: 'custom-label' });
        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const labelId = $tagBox.find(`.${TEXTEDITOR_LABEL_CLASS}`).attr('id');

        const expectedAria = `${labelId}`;

        assert.strictEqual($input.attr('aria-labelledby'), expectedAria, 'aria-labelledby was set correctly');
    });

    QUnit.test('input should not have aria-labelledby attr if label is not specified', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({ });
        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);

        assert.strictEqual($input.attr('aria-labelledby'), undefined, 'aria-labelledby was set correctly');
    });

    QUnit.test('select should have a correct aria-label', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox();
        const $select = $tagBox.find(TAGBOX_SELECT_SELECTOR);

        assert.strictEqual($select.attr('aria-label'), 'Selected items', 'aria-label is correct');
    });

    QUnit.test('TagBox element should have correct aria attributes', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox();

        assert.strictEqual($tagBox.attr('role'), 'application', 'role is set correctly');
        assert.strictEqual($tagBox.attr('aria-roledescription'), 'tagbox', 'aria-roledescription is set correctly');
    });

    QUnit.test('TagBox element should have an aria-labelledby attribute with correct ids', function(assert) {
        const items = [1, 2, 3];
        const $tagBox = $('#tagBox').dxTagBox({ items });
        const tagBox = $tagBox.dxTagBox('instance');

        assert.strictEqual($tagBox.attr('aria-labelledby'), undefined, 'aria-labelledby is undefined');

        tagBox.option('value', [items[0]]);
        let tagId = $tagBox.find(`.${TAGBOX_TAG_CLASS}`).attr('id');

        assert.strictEqual($tagBox.attr('aria-labelledby'), tagId, 'aria-labelledby is set correctly');

        tagBox.option('value', []);
        assert.strictEqual($tagBox.attr('aria-labelledby'), undefined, 'aria-labelledby is set correctly');

        tagBox.option('value', [items[0], items[1]]);

        const tagIds = $tagBox.find(`.${TAGBOX_TAG_CLASS}`).toArray().map(($tag) => {
            return $($tag).attr('id');
        }).join(' ');

        assert.strictEqual($tagBox.attr('aria-labelledby'), tagIds, 'aria-labelledby is set correctly');

        tagBox.option('value', [items[1]]);
        tagId = $tagBox.find(`.${TAGBOX_TAG_CLASS}`).attr('id');

        assert.strictEqual($tagBox.attr('aria-labelledby'), tagId, 'aria-labelledby is set correctly');
    });

    QUnit.test('TagBox tag element should have correct aria attributes', function(assert) {
        const items = [1, 2, 3];
        const $tagBox = $('#tagBox').dxTagBox({
            items,
            value: [items[0]],
        });

        const $tag = $tagBox.find(`.${TAGBOX_TAG_CLASS}`);

        assert.strictEqual($tag.attr('role'), 'button');
        assert.strictEqual($tag.attr('aria-label'), '1');
        assert.strictEqual($tag.attr('aria-roledescription'), 'Tag. Press the delete button to remove this tag');
    });

    QUnit.test('TagBox element should have aria-labelledby with correct ids if tag was deleted by keyboard', function(assert) {
        const items = [1, 2];
        const $tagBox = $('#tagBox').dxTagBox({
            items,
            value: [items[0], items[1]],
        });

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        keyboard
            .press('right')
            .press('backspace');

        const tagId = $tagBox.find(`.${TAGBOX_TAG_CLASS}`).attr('id');

        assert.strictEqual($tagBox.attr('aria-labelledby'), tagId, 'aria-labelledby is set correctly');
    });

    QUnit.test('input should have aria-activedescendant with correct id if tag is focused', function(assert) {
        const items = [1, 2];
        const $tagBox = $('#tagBox').dxTagBox({
            items,
            value: items,
        });
        const tagBox = $tagBox.dxTagBox('instance');

        const $input = $tagBox.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const keyboard = keyboardMock($input);

        const $tags = $tagBox.find(`.${TAGBOX_TAG_CLASS}`);

        const firstTagId = $tags.eq(0).attr('id');
        const secondTagId = $tags.eq(1).attr('id');

        keyboard.press('right');
        assert.strictEqual($input.attr('aria-activedescendant'), firstTagId, 'aria-activedescendant is set correctly');

        keyboard.press('right');
        assert.strictEqual($input.attr('aria-activedescendant'), secondTagId, 'aria-activedescendant is set correctly');

        keyboard.press('backspace');
        assert.strictEqual($input.attr('aria-activedescendant'), firstTagId, 'aria-activedescendant is set correctly');

        keyboard.press('backspace');
        assert.strictEqual($input.attr('aria-activedescendant'), undefined, 'aria-activedescendant is set correctly');

        tagBox.option('value', [items[0], items[1]]);

        keyboard
            .press('right')
            .press('backspace');

        assert.strictEqual($input.attr('aria-activedescendant'), undefined, 'aria-activedescendant is set correctly');
    });
});
