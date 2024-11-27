import $ from 'jquery';

import MentionFormat from '__internal/ui/html_editor/formats/m_mention';
import Mentions from '__internal/ui/html_editor/modules/m_mentions';

import { noop } from 'core/utils/common';
import devices from '__internal/core/m_devices';
import { Event as dxEvent } from 'common/core/events';
import { normalizeKeyName } from 'common/core/events/utils/index';
import Quill from 'devextreme-quill';

const SUGGESTION_LIST_CLASS = 'dx-suggestion-list';
const LIST_ITEM_CLASS = 'dx-list-item';
const FOCUSED_STATE_CLASS = 'dx-state-focused';

const KEY_CODES = {
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32
};

const POPUP_HIDING_TIMEOUT = 500;

const APPLY_VALUE_KEYS = [{ key: 'Enter', code: KEY_CODES.ENTER }, { key: ' ', code: KEY_CODES.SPACE }];

const INSERT_DEFAULT_MENTION_DELTA = { ops: [{ insert: '@' }] };
const INSERT_HASH_MENTION_DELTA = { ops: [{ insert: '#' }] };
const INSERT_TEXT_DELTA = { ops: [{ insert: 'Text' }] };

const moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.Delta = Quill.import('delta');

        this.$element = $('#htmlEditor');

        this.log = [];

        this.$element.on('keydown', (event) => {
            const handlers = this.quillMock.keyboard.bindings[normalizeKeyName(event)]
                || this.quillMock.keyboard.bindings[event.which];
            if(handlers) {
                handlers.forEach((handler) => {
                    handler();
                });
            }
        });

        this.previousChar = ' ';

        this.quillMock = {
            getContents: () => { return { ops: [{ insert: this.previousChar }] }; },
            getLength: () => 0,
            getBounds: () => { return { left: 0, bottom: 0 }; },
            root: this.$element.get(0),
            getModule: noop,
            getSelection: () => { return { index: 1, length: 0 }; },
            setSelection: (index) => { this.log.push({ operation: 'setSelection', index }); },
            updateContents: (newDelta) => { this.log.push({ delta: newDelta }); },
            getFormat: noop,
            on: noop,
            deleteText: (index, length) => { this.log.push({ operation: 'deleteText', index, length }); },
            insertText: (index, text, source) => { this.log.push({ operation: 'insertText', index, text, source }); },
            keyboard: {
                addBinding: ({ key }, handler) => {
                    const keys = Array.isArray(key) ? key : [key];
                    keys.forEach((keyName) => {
                        if(!this.quillMock.keyboard.bindings[keyName]) {
                            this.quillMock.keyboard.bindings[keyName] = [];
                        }

                        this.quillMock.keyboard.bindings[keyName].push(handler);
                    });
                },
                bindings: {
                    'enter': [noop]
                }
            }
        };

        this.options = {
            mentions: [{
                dataSource: ['Alex', 'John', 'Freddy', 'Sam']
            }],
            editorInstance: {
                getMentionKeyInTemplateStorage: sinon.spy(() => 'my_key_in_storage'),
                addCleanCallback: noop,
                $element: () => {
                    return this.$element;
                },
                _createComponent: ($element, widget, options) => {
                    return new widget($element, options);
                }
            }
        };

        this.complexDataOptions = {
            mentions: [{
                dataSource: [{
                    name: 'Alex',
                    position: 'manager'
                }, {
                    name: 'John',
                    position: 'it'
                }],
                valueExpr: 'name',
                displayExpr: ({ name, position }) => {
                    return `${name} ${position}`;
                }
            }],
            editorInstance: this.options.editorInstance
        };

        this.severalMarkerOptions = {
            mentions: [{
                dataSource: ['Alex', 'John', 'Stew', 'Lola', 'Nancy']
            }, {
                dataSource: [4421, 5422, 2245, 6632],
                marker: '#'
            }],
            editorInstance: this.options.editorInstance
        };
    },
    afterEach: function() {
        this.clock.restore();
    }
};

const { test } = QUnit;

QUnit.module('Mention format', () => {
    test('Create an element by data', function(assert) {
        const data = {
            value: 'John Smith',
            marker: '@',
            id: 'JohnSm'
        };
        const element = MentionFormat.create(data);

        assert.strictEqual(element.dataset.marker, '@', 'correct marker');
        assert.strictEqual(element.dataset.mentionValue, 'John Smith', 'correct value');
        assert.strictEqual(element.dataset.id, 'JohnSm', 'correct id');
    });

    test('Renders text into container', function(assert) {
        const data = {
            value: 'John Smith',
            marker: '@',
            id: 'JohnSm'
        };
        const element = MentionFormat.create(data);

        new MentionFormat({}, element);
        assert.strictEqual(element.children[0].innerText, '@John Smith', 'correct inner text');
    });

    test('Get data from element', function(assert) {
        const markup = '<span class=\'dx-mention\' data-marker=@ data-mention-value=\'John Smith\' data-id=\'JohnSm\'><span>@</span>John Smith</span>';
        const element = $(markup).get(0);
        const data = MentionFormat.value(element);

        assert.deepEqual(data, { value: 'John Smith', marker: '@', id: 'JohnSm' }, 'Correct data');
    });

    test('Change default marker', function(assert) {
        const data = {
            value: 'John Smith',
            marker: '#',
            id: 'JohnSm'
        };

        const element = MentionFormat.create(data);

        assert.strictEqual(element.getAttribute('data-marker'), '#', 'correct data-marker attribute');
    });

    test('Change default content renderer', function(assert) {
        const nodeData = {
            value: 'John Smith',
            marker: '@',
            id: 'JohnSm'
        };
        const data = {
            ...nodeData,
            keyInTemplateStorage: 'my_key_in_storage'
        };

        MentionFormat.addTemplate({ marker: '@', editorKey: 'my_key_in_storage' }, {
            render: ({ container, model: mentionData }) => {
                container.innerText = 'test';
                assert.deepEqual(mentionData, nodeData);
            }
        });

        let element = MentionFormat.create(data);

        new MentionFormat({}, element);
        assert.strictEqual(element.children[0].innerText, 'test');

        MentionFormat.removeTemplate({ marker: '@', editorKey: 'my_key_in_storage' });
        element = MentionFormat.create(data);
        new MentionFormat({}, element);
        assert.strictEqual(element.children[0].innerText, '@John Smith');
    });
});

QUnit.module('Mentions module', moduleConfig, () => {
    test('retain formatting after inserting a mention (T1236869)', function(assert) {
        this.quillMock.getFormat = () => {
            return { bold: true };
        };
        const mention = new Mentions(this.quillMock, this.options);
        mention.savePosition(0);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, 'user');

        $(`.${SUGGESTION_LIST_CLASS} .${LIST_ITEM_CLASS}`).first().trigger('dxclick');

        this.clock.tick(POPUP_HIDING_TIMEOUT);

        const expectedDelta = new this.Delta()
            .delete(1)
            .insert({ mention: {
                value: 'Alex',
                marker: '@',
                id: 'Alex',
                keyInTemplateStorage: 'my_key_in_storage'
            } })
            .insert(' ', { bold: true });

        assert.deepEqual(this.log[0].delta.ops, expectedDelta.ops, 'Correct formatting');
    });

    test('insert mention after click on item', function(assert) {
        const mention = new Mentions(this.quillMock, this.options);

        mention.savePosition(0);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, 'user');

        $(`.${SUGGESTION_LIST_CLASS} .${LIST_ITEM_CLASS}`).first().trigger('dxclick');

        this.clock.tick(POPUP_HIDING_TIMEOUT);

        const expectedDelta = new this.Delta()
            .delete(1)
            .insert({ mention: {
                value: 'Alex',
                marker: '@',
                id: 'Alex',
                keyInTemplateStorage: 'my_key_in_storage'
            } })
            .insert(' ');

        assert.deepEqual(this.log[0].delta.ops, expectedDelta.ops, 'Correct formatting');
        assert.ok(this.options.editorInstance.getMentionKeyInTemplateStorage.calledOnce, 'id requested from widget');
    });

    test('Display and value expression with complex data', function(assert) {
        const mention = new Mentions(this.quillMock, this.complexDataOptions);

        mention.savePosition(0);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, 'user');
        $(`.${SUGGESTION_LIST_CLASS} .${LIST_ITEM_CLASS}`).first().trigger('dxclick');

        this.clock.tick(POPUP_HIDING_TIMEOUT);

        const expectedDelta = new this.Delta()
            .delete(1)
            .insert({ mention: {
                value: 'Alex manager',
                marker: '@',
                id: 'Alex',
                keyInTemplateStorage: 'my_key_in_storage'
            } })
            .insert(' ');

        assert.deepEqual(this.log[0].delta.ops, expectedDelta.ops, 'Correct formatting');
    });

    test('Insert embed content should remove marker before insert a mention and restore the selection', function(assert) {
        const mention = new Mentions(this.quillMock, this.complexDataOptions);

        mention.savePosition(2);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, 'user');
        $(`.${SUGGESTION_LIST_CLASS} .${LIST_ITEM_CLASS}`).first().trigger('dxclick');
        this.clock.tick(POPUP_HIDING_TIMEOUT);

        const expectedDelta = new this.Delta()
            .delete(1)
            .insert({ mention: {
                value: 'Alex manager',
                marker: '@',
                id: 'Alex',
                keyInTemplateStorage: 'my_key_in_storage'
            } })
            .insert(' ');

        assert.strictEqual(this.log.length, 2, 'add a mention + set selection');
        assert.deepEqual(this.log[0].delta.ops, expectedDelta.ops, 'add a mention');
        assert.deepEqual(this.log[1], {
            index: 2, // restore selection
            operation: 'setSelection'
        });
    });

    test('changing text by user should trigger checkMentionRequest', function(assert) {
        this.quillMock.getSelection = () => { return { index: 1, length: 0 }; };

        const mention = new Mentions(this.quillMock, this.complexDataOptions);
        const mentionRequestSpy = sinon.spy(mention, 'checkMentionRequest');
        const showPopupSpy = sinon.spy(mention._popup, 'show');


        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, 'API');

        assert.ok(mentionRequestSpy.notCalled, 'Ignore changing text by API');
        assert.ok(showPopupSpy.notCalled, 'Popup isn\'t shown');

        mention.onTextChange(INSERT_TEXT_DELTA, {}, 'user');

        assert.ok(mentionRequestSpy.calledOnce, 'trigger mention request');
        assert.ok(showPopupSpy.notCalled, 'Popup isn\'t shown because text doesn\'t contain a marker');

        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, 'user');

        assert.ok(mentionRequestSpy.calledTwice, 'trigger mention request');
        assert.ok(showPopupSpy.calledOnce, 'Show popup with suggestion list');
    });

    test('Should appear after type a marker that replaces a selected text (T730303)', function(assert) {
        const mention = new Mentions(this.quillMock, this.complexDataOptions);
        const showPopupSpy = sinon.spy(mention._popup, 'show');

        const replaceAllDelta = { ops: [{ insert: '@' }, { delete: 2 }] };
        const replaceLastWordDelta = { ops: [{ retain: 5 }, { insert: '@' }, { delete: 1 }] };

        mention.onTextChange(replaceLastWordDelta, {}, 'user');
        assert.ok(showPopupSpy.calledOnce);

        mention.onTextChange(replaceAllDelta, {}, 'user');
        assert.ok(showPopupSpy.calledTwice);
    });

    test('Should hide popup after remove more than one char', function(assert) {
        const mention = new Mentions(this.quillMock, this.complexDataOptions);
        const hidePopupSpy = sinon.spy(mention._popup, 'hide');

        const addMarker = { ops: [{ insert: '@' }] };
        const removeWord = { ops: [{ delete: 3 }] };

        mention.onTextChange(addMarker, {}, 'user');
        this.clock.tick(10);
        assert.ok(hidePopupSpy.notCalled);

        mention.onTextChange(removeWord, {}, 'user');
        this.clock.tick(10);
        assert.ok(hidePopupSpy.calledOnce);
    });

    test('Module should not filter the list after quickly removing the marker (T894506)', function(assert) {
        const mention = new Mentions(this.quillMock, this.complexDataOptions);
        const filterListSpy = sinon.spy(mention, '_filterList');

        const addMarker = { ops: [{ insert: '@' }] };
        const removeMarker = { ops: [{ delete: 1 }] };

        mention.onTextChange(addMarker, {}, 'user');
        this.clock.tick(10);
        mention.onTextChange(removeMarker, {}, 'user');
        mention.onTextChange(addMarker, {}, 'user');
        this.clock.tick(10);

        assert.ok(filterListSpy.notCalled);
    });

    test('display expression should be used in the suggestion list', function(assert) {
        const mention = new Mentions(this.quillMock, this.complexDataOptions);

        mention.savePosition(2);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, 'user');

        const itemText = $(`.${SUGGESTION_LIST_CLASS} .${LIST_ITEM_CLASS}`).first().text();

        assert.strictEqual(itemText, 'Alex manager');
    });

    test('item template', function(assert) {
        this.complexDataOptions.mentions[0].itemTemplate = (item, index, element) => {
            $(element).text(`${item.name}@`);
        };

        const mention = new Mentions(this.quillMock, this.complexDataOptions);
        mention.savePosition(2);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, 'user');

        const itemText = $(`.${SUGGESTION_LIST_CLASS} .${LIST_ITEM_CLASS}`).first().text();
        assert.strictEqual(itemText, 'Alex@');
    });

    test('several markers using', function(assert) {
        const usersCount = this.severalMarkerOptions.mentions[0].dataSource.length;
        const issueCount = this.severalMarkerOptions.mentions[1].dataSource.length;
        const mention = new Mentions(this.quillMock, this.severalMarkerOptions);

        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, 'user');

        let $items = $(`.${SUGGESTION_LIST_CLASS} .${LIST_ITEM_CLASS}`);

        assert.strictEqual($items.length, usersCount, 'List of users');

        $items.first().trigger('dxclick');
        this.clock.tick(POPUP_HIDING_TIMEOUT);

        const firstDelta = new this.Delta()
            .delete(1)
            .insert({ mention: {
                value: 'Alex',
                marker: '@',
                id: 'Alex',
                keyInTemplateStorage: 'my_key_in_storage'
            } })
            .insert(' ');
        assert.deepEqual(this.log[0].delta.ops, firstDelta.ops, 'insert user mention');

        mention.onTextChange(INSERT_HASH_MENTION_DELTA, {}, 'user');

        $items = $(`.${SUGGESTION_LIST_CLASS} .${LIST_ITEM_CLASS}`);

        assert.strictEqual($items.length, issueCount, 'List of issues');

        $items.first().trigger('dxclick');
        this.clock.tick(POPUP_HIDING_TIMEOUT);

        const secondDelta = new this.Delta()
            .delete(1)
            .insert({ mention: {
                value: 4421,
                marker: '#',
                id: 4421,
                keyInTemplateStorage: 'my_key_in_storage'
            } })
            .insert(' ');
        assert.deepEqual(this.log[2].delta.ops, secondDelta.ops, 'insert issue mention');
    });

    test('list shouldn\'t be focused on text input', function(assert) {
        const mention = new Mentions(this.quillMock, this.options);

        mention.savePosition(0);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, 'user');

        this.clock.tick(10);
        const $list = $(`.${SUGGESTION_LIST_CLASS}`);
        const isListFocused = $list.hasClass(FOCUSED_STATE_CLASS);
        const isFirstListItemFocused = $list.find(`.${LIST_ITEM_CLASS}`).first().hasClass(FOCUSED_STATE_CLASS);

        assert.notOk(isListFocused);
        assert.ok(isFirstListItemFocused);
    });

    test('trigger \'arrow down\' should focus next list item', function(assert) {
        const mention = new Mentions(this.quillMock, this.options);

        mention.savePosition(0);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, 'user');

        this.clock.tick(10);
        this.$element.trigger($.Event('keydown', { key: 'ArrowDown', which: KEY_CODES.ARROW_DOWN }));

        const $list = $(`.${SUGGESTION_LIST_CLASS}`);
        const isListFocused = $list.hasClass(FOCUSED_STATE_CLASS);
        const isSecondListItemFocused = $list.find(`.${LIST_ITEM_CLASS}`).eq(1).hasClass(FOCUSED_STATE_CLASS);

        assert.notOk(isListFocused);
        assert.ok(isSecondListItemFocused);
    });

    test('list should load next page on reach end of current page', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'desktop specific test');
            return;
        }

        const totalItems = 60;
        const pageSize = 50;
        const items = [];
        for(let i = 0; i < totalItems; i++) {
            items.push(i);
        }

        this.$element.css({
            fontSize: '14px',
            lineHeight: 1.35715
        });

        this.options.mentions = [{
            dataSource: {
                store: items,
                pageSize,
                paginate: true
            },
        }];

        const mention = new Mentions(this.quillMock, this.options);

        mention._popup.option('container', this.$element);
        mention.savePosition(0);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, 'user');

        this.clock.tick(10);

        let $items = $(`.${SUGGESTION_LIST_CLASS} .${LIST_ITEM_CLASS}`);
        assert.strictEqual($items.length, pageSize);

        this.$element.trigger($.Event('keydown', { key: 'ArrowUp', which: KEY_CODES.ARROW_UP }));

        $items = $(`.${SUGGESTION_LIST_CLASS} .${LIST_ITEM_CLASS}`);
        const isLastItemOnPageFocused = $items.eq(pageSize - 1).hasClass(FOCUSED_STATE_CLASS);

        assert.ok(isLastItemOnPageFocused);
        assert.strictEqual($items.length, totalItems, 'next page has loaded');
    });

    test('trigger \'arrow up\' should focus previous list item', function(assert) {
        const mention = new Mentions(this.quillMock, this.options);

        mention.savePosition(0);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, 'user');

        this.clock.tick(10);

        this.$element.trigger($.Event('keydown', { key: 'ArrowUp', which: KEY_CODES.ARROW_UP }));

        const $list = $(`.${SUGGESTION_LIST_CLASS}`);
        const isListFocused = $list.hasClass(FOCUSED_STATE_CLASS);
        const isLastListItemFocused = $list.find(`.${LIST_ITEM_CLASS}`).last().hasClass(FOCUSED_STATE_CLASS);

        assert.notOk(isListFocused);
        assert.ok(isLastListItemFocused);
    });

    test('trigger "arrow down" or "arrow up" does not change focused item in case data source is loading', function(assert) {
        const mention = new Mentions(this.quillMock, this.options);

        mention.savePosition(0);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, 'user');

        this.clock.tick(10);

        this.$element.trigger($.Event('keydown', { key: 'ArrowUp', which: KEY_CODES.ARROW_UP }));

        const $list = $(`.${SUGGESTION_LIST_CLASS}`);
        const getLastItem = () => $list.find(`.${LIST_ITEM_CLASS}`).last();
        const getFocusedItem = () => $list.find(`.${LIST_ITEM_CLASS}.${FOCUSED_STATE_CLASS}`);
        const $lastItem = getLastItem();

        assert.ok($lastItem.hasClass(FOCUSED_STATE_CLASS), 'last item is focused');

        mention._list.getDataSource().beginLoading();

        this.$element.trigger($.Event('keydown', { key: 'ArrowDown', which: KEY_CODES.ARROW_DOWN }));
        assert.ok(getFocusedItem().is($lastItem), 'the same item is still focused');

        this.$element.trigger($.Event('keydown', { key: 'ArrowUp', which: KEY_CODES.ARROW_UP }));
        assert.ok(getFocusedItem().is($lastItem), 'the same item is still focused');
    });

    APPLY_VALUE_KEYS.forEach(({ key, code }) => {
        test(`trigger '${key}' key should select focused list item`, function(assert) {
            const mention = new Mentions(this.quillMock, this.options);

            mention.savePosition(0);
            mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, 'user');
            this.clock.tick(10);

            this.$element.trigger($.Event('keydown', { key, which: code }));
            this.clock.tick(10);

            const expectedDelta = new this.Delta()
                .delete(1)
                .insert({ mention: {
                    value: 'Alex',
                    marker: '@',
                    id: 'Alex',
                    keyInTemplateStorage: 'my_key_in_storage'
                } })
                .insert(' ');
            assert.deepEqual(this.log[0].delta.ops, expectedDelta.ops, 'Correct formatting');
        });
    });

    APPLY_VALUE_KEYS.forEach(({ key, code }) => {
        test(`trigger '${key}' key should close list if it is empty`, function(assert) {
            const mention = new Mentions(this.quillMock, this.options);

            mention.savePosition(0);
            mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, 'user');
            this.clock.tick(10);

            mention.onTextChange(INSERT_TEXT_DELTA, {}, 'user');
            this.clock.tick(POPUP_HIDING_TIMEOUT);

            const $list = $(`.${SUGGESTION_LIST_CLASS}`);

            this.$element.trigger($.Event('keydown', { key, which: code }));
            this.clock.tick(POPUP_HIDING_TIMEOUT);

            assert.notOk($list.is(':visible'));
        });
    });

    test('trigger \'escape\' should close list', function(assert) {
        const mention = new Mentions(this.quillMock, this.options);

        mention.savePosition(0);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, 'user');

        this.clock.tick(10);

        const $list = $(`.${SUGGESTION_LIST_CLASS}`);

        this.$element.trigger($.Event('keydown', { key: 'Escape', which: KEY_CODES.ESCAPE }));
        this.clock.tick(POPUP_HIDING_TIMEOUT);

        assert.notOk($list.is(':visible'));
    });

    test('mention char shouldn\'t be a part of string (e.g. e-mail)', function(assert) {
        let content = 'd';

        this.quillMock.getContents = (index, length) => {
            this.log.push({ operation: 'getContents', index, length });
            return { ops: [{ insert: content }] };
        };
        const mention = new Mentions(this.quillMock, this.options);
        const $list = $(`.${SUGGESTION_LIST_CLASS}`);

        mention.savePosition(0);

        mention.onTextChange({ ops: [{ insert: '@', retain: 2 }] }, {}, 'user');
        assert.notOk($list.is(':visible'));
        assert.deepEqual(this.log[0], { operation: 'getContents', index: 1, length: 1 });

        content = '\n';
        mention.onTextChange({ ops: [{ insert: '@', retain: 50 }] }, {}, 'user');
        assert.ok($list.is(':visible'));
        assert.deepEqual(this.log[1], { operation: 'getContents', index: 49, length: 1 });

        mention._popup.hide();
        this.clock.tick(POPUP_HIDING_TIMEOUT);

        content = ' ';
        mention.onTextChange({ ops: [{ insert: '@', retain: 1 }] }, {}, 'user');
        assert.ok($list.is(':visible'));
        assert.deepEqual(this.log[2], { operation: 'getContents', index: 0, length: 1 });
    });

    test('popup position config', function(assert) {
        const mention = new Mentions(this.quillMock, this.options);
        mention.savePosition(0);
        const { collision, offset, of: positionTarget } = mention._popupPosition;

        assert.deepEqual(collision, {
            x: 'flipfit',
            y: 'flip'
        }, 'Check popup position collision resolve strategy');
        assert.ok(positionTarget instanceof dxEvent, 'mention positioned by event\'s pageX and pageY');
        assert.notOk(Object.prototype.hasOwnProperty.call(offset, 'h'), 'it hasn\'t a horizontal offset');
        assert.ok(Object.prototype.hasOwnProperty.call(offset, 'v'), 'it has a vertical offset');
    });

    test('popup shouldn\'t close on target scroll', function(assert) {
        const mention = new Mentions(this.quillMock, this.options);
        mention.savePosition(0);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, 'user');
        this.clock.tick(10);

        $('#qunit-fixture').triggerHandler('scroll');

        assert.ok(mention._popup.option('visible'), 'popup is visible after scrolling');
    });

    test('popup should update position after search', function(assert) {
        const mention = new Mentions(this.quillMock, this.options);
        const popupRepaintSpy = sinon.spy(mention._popup, 'repaint');

        mention.savePosition(0);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, 'user');
        this.clock.tick(10);
        mention.onTextChange({ ops: [{ insert: 'A' }] }, {}, 'user');
        this.clock.tick(POPUP_HIDING_TIMEOUT);

        assert.ok(popupRepaintSpy.calledOnce, 'popup has been repainted after search');
    });

    test('insert mention on a start of the newline', function(assert) {
        this.previousChar = '\n';
        const mention = new Mentions(this.quillMock, this.options);

        mention.savePosition(3);
        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, 'user');

        $(`.${SUGGESTION_LIST_CLASS} .${LIST_ITEM_CLASS}`).first().trigger('dxclick');

        this.clock.tick(POPUP_HIDING_TIMEOUT);
        const expectedDelta = new this.Delta()
            .retain(1)
            .delete(1)
            .insert({ mention: {
                value: 'Alex',
                marker: '@',
                id: 'Alex',
                keyInTemplateStorage: 'my_key_in_storage'
            } })
            .insert(' ');
        assert.deepEqual(this.log[0].delta.ops, expectedDelta.ops, 'Correct formatting');
    });

    test('popup should have correct position when mention is inserted on the new line (T1087787)', function(assert) {
        this.previousChar = '\n';
        const mention = new Mentions(this.quillMock, this.options);

        mention.onTextChange(INSERT_DEFAULT_MENTION_DELTA, {}, 'user');

        assert.strictEqual(mention.getPosition(), 2, 'position is correct (1 for new line and 1 for marker)');
    });
});
