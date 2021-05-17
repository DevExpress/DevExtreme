import $ from 'jquery';

import 'ui/html_editor';

import nativePointerMock from '../../../helpers/nativePointerMock.js';
import { prepareEmbedValue } from './utils.js';

const { test, module } = QUnit;

const SUGGESTION_LIST_CLASS = 'dx-suggestion-list';
const LIST_ITEM_CLASS = 'dx-list-item';
const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
const HTML_EDITOR_CONTENT = 'dx-htmleditor-content';
const FOCUSED_STATE_CLASS = 'dx-state-focused';
const MENTION_CLASS = 'dx-mention';

const POPUP_TIMEOUT = 500;

const KEY_CODES = {
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    ARROW_LEFT: 37,
    ARROW_RIGHT: 39,
    ENTER: 13,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36
};

const NAVIGATION_KEYS = [
    KEY_CODES.ARROW_LEFT,
    KEY_CODES.ARROW_RIGHT,
    KEY_CODES.PAGE_UP,
    KEY_CODES.PAGE_DOWN,
    KEY_CODES.END,
    KEY_CODES.HOME
];

const KeyEventsMock = nativePointerMock();

module('Mentions integration', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = $('#htmlEditor');
        this.options = {
            mentions: [{
                dataSource: ['Alex', 'John', 'Freddy', 'Sam']
            }]
        };

        this.createWidget = () => {
            this.instance = this.$element
                .dxHtmlEditor(this.options)
                .dxHtmlEditor('instance');
        };

        this.getItems = () => $(`.${SUGGESTION_LIST_CLASS} .${LIST_ITEM_CLASS}`);
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    test('insert mention after click on item', function(assert) {
        const done = assert.async();
        const expectedMention = '<p><span class="dx-mention" spellcheck="false" data-marker="@" data-mention-value="John" data-id="John"><span contenteditable="false"><span>@</span>John</span></span> </p>';
        const valueChangeSpy = sinon.spy(({ value }) => {
            if(valueChangeSpy.calledOnce) {
                assert.strictEqual(value, '<p>@</p>', 'marker has been added');
                this.getItems().eq(1).trigger('dxclick');
                this.clock.tick(POPUP_TIMEOUT);
            } else {
                assert.strictEqual(prepareEmbedValue(value), expectedMention, 'mention has been added');
                done();
            }
        });

        this.options.onValueChanged = valueChangeSpy;

        this.createWidget();
        this.instance.focus();
        this.$element.find('p').first().text('@');
        this.clock.tick();
    });

    test('popup position', function(assert) {
        const done = assert.async();
        const $fixture = $('#qunit-fixture');
        const fixtureLeft = $fixture.css('left');
        const valueChangeSpy = sinon.spy(() => {
            this.instance.setSelection(0, 1);
            this.clock.tick();
            const { bottom, left } = getSelection().getRangeAt(0).getBoundingClientRect();
            const overlayRect = $(`.${SUGGESTION_LIST_CLASS}`).closest(`.${OVERLAY_CONTENT_CLASS}`).get(0).getBoundingClientRect();

            assert.roughEqual(overlayRect.top, bottom, 1.2, 'popup top position equals to bottom position of marker');
            assert.strictEqual(overlayRect.left, left, 'popup left position equals to left position of marker');

            $fixture.css('left', fixtureLeft);
            done();
        });

        $fixture.css('left', '0px');
        this.options = {
            onValueChanged: valueChangeSpy,
            mentions: [{
                dataSource: [1, 2, 3, 4]
            }]
        };
        this.createWidget();
        this.instance.focus();
        this.$element.find('p').first().text('@');
        this.clock.tick();
    });

    test('set up mentions for existed editor', function(assert) {
        const done = assert.async();
        const valueChangeSpy = sinon.spy(() => {
            const $items = this.getItems();

            assert.strictEqual($items.length, 3, 'there\'re three items');
            assert.strictEqual($items.text(), 'AlexJohnSam', 'correct data');
            done();
        });

        this.options = { onValueChanged: valueChangeSpy };
        this.createWidget();

        this.instance.option('mentions', [{
            dataSource: ['Alex', 'John', 'Sam']
        }]);

        this.instance.focus();
        this.$element.find('p').first().text('@');
        this.clock.tick();
    });

    test('reset mentions option for existed editor', function(assert) {
        const done = assert.async();
        const valueChangeSpy = sinon.spy(() => {
            const $list = $(`.${SUGGESTION_LIST_CLASS}`);

            assert.notOk($list.is(':visible'), 'list isn\'t visible');
            done();
        });

        this.options.onValueChanged = valueChangeSpy;
        this.createWidget();

        this.instance.option('mentions', null);

        this.instance.focus();
        this.$element.find('p').first().text('@');
        this.clock.tick();
    });

    test('change mentions marker', function(assert) {
        const done = assert.async();
        const expectedMention = '<p><span class="dx-mention" spellcheck="false" data-marker="#" data-mention-value="Freddy" data-id="Freddy"><span contenteditable="false"><span>#</span>Freddy</span></span> </p>';
        const valueChangeSpy = sinon.spy(({ value }) => {
            if(valueChangeSpy.calledOnce) {
                assert.strictEqual(value, '<p>#</p>', 'marker has been added');
                this.getItems().eq(2).trigger('dxclick');
                this.clock.tick(POPUP_TIMEOUT);
            } else {
                assert.strictEqual(prepareEmbedValue(value), expectedMention, 'mention has been added');
                done();
            }
        });

        this.options.onValueChanged = valueChangeSpy;
        this.createWidget();

        this.instance.option('mentions[0].marker', '#');

        this.instance.focus();
        this.$element.find('p').first().text('#');
        this.clock.tick();
    });

    test('list isn\'t shown for wrong marker', function(assert) {
        const done = assert.async();
        const valueChangeSpy = sinon.spy(() => {
            const $list = $(`.${SUGGESTION_LIST_CLASS}`);

            assert.notOk($list.is(':visible'), 'list isn\'t visible');
            done();
        });

        this.options.onValueChanged = valueChangeSpy;
        this.createWidget();

        this.instance.option('mentions[0].marker', '#');

        this.instance.focus();
        this.$element.find('p').first().text('@');
        this.clock.tick();
    });

    test('several mention markers: first mention', function(assert) {
        const done = assert.async();
        const valueChangeSpy = sinon.spy(() => {
            const $items = this.getItems();

            assert.strictEqual($items.length, 3, 'there\'re three items');
            assert.strictEqual($items.text(), 'AlexJohnSam', 'correct data');
            done();
        });

        this.options.onValueChanged = valueChangeSpy;
        this.createWidget();

        this.instance.option('mentions', [{
            dataSource: ['Alex', 'John', 'Sam']
        }, {
            dataSource: [1, 2],
            marker: '#'
        }]);

        this.instance.focus();
        this.$element.find('p').first().text('@');
        this.clock.tick();
    });

    test('several mention markers: second mention', function(assert) {
        const done = assert.async();
        const valueChangeSpy = sinon.spy(() => {
            const $items = this.getItems();

            assert.strictEqual($items.length, 2, 'there\'re three items');
            assert.strictEqual($items.text(), '12', 'correct data');
            done();
        });

        this.options.onValueChanged = valueChangeSpy;
        this.createWidget();

        this.instance.option('mentions', [{
            dataSource: ['Alex', 'John', 'Sam']
        }, {
            dataSource: [1, 2],
            marker: '#'
        }]);

        this.instance.focus();
        this.$element.find('p').first().text('#');
        this.clock.tick();
    });

    test('reduce mention markers', function(assert) {
        const done = assert.async();
        const valueChangeSpy = sinon.spy(() => {
            const $items = this.getItems();

            assert.strictEqual($items.length, 3, 'there\'re three items');
            assert.strictEqual($items.text(), 'abc', 'correct data');
            done();
        });

        this.options = {
            mentions: [{
                dataSource: ['Alex', 'John', 'Sam']
            }, {
                dataSource: [1, 2],
                marker: '#'
            }],
            onValueChanged: valueChangeSpy
        };
        this.createWidget();

        this.instance.option('mentions', [{
            dataSource: ['a', 'b', 'c'],
            marker: '*'
        }]);

        this.instance.focus();
        this.$element.find('p').first().text('*');
        this.clock.tick();
    });

    test('old marker doesn\'t work after reduce mention markers', function(assert) {
        const done = assert.async();
        const valueChangeSpy = sinon.spy(() => {
            const $list = $(`.${SUGGESTION_LIST_CLASS}`);

            assert.notOk($list.is(':visible'), 'list isn\'t visible');
            done();
        });

        this.options = {
            mentions: [{
                dataSource: ['Alex', 'John', 'Sam']
            }, {
                dataSource: [1, 2],
                marker: '#'
            }],
            onValueChanged: valueChangeSpy
        };
        this.createWidget();

        this.instance.option('mentions', [{
            dataSource: ['a', 'b', 'c'],
            marker: '*'
        }]);

        this.instance.focus();
        this.$element.find('p').first().text('#');
        this.clock.tick();
    });

    test('new mention should be selected after press \'enter\' key', function(assert) {
        const done = assert.async();
        const expectedMention = '<p><span class="dx-mention" spellcheck="false" data-marker="@" data-mention-value="John" data-id="John"><span contenteditable="false"><span>@</span>John</span></span> </p>';
        const valueChangeSpy = sinon.spy(({ value }) => {
            if(valueChangeSpy.calledOnce) {
                this.clock.tick();
                const $content = this.$element.find(`.${HTML_EDITOR_CONTENT}`);
                KeyEventsMock.simulateEvent($content.get(0), 'keydown', { keyCode: KEY_CODES.ARROW_DOWN });
                KeyEventsMock.simulateEvent($content.get(0), 'keydown', { keyCode: KEY_CODES.ENTER });
                this.clock.tick();
            } else {
                assert.strictEqual(prepareEmbedValue(value), expectedMention, 'mention has been added');
                done();
            }
        });
        this.options.onValueChanged = valueChangeSpy;

        this.createWidget();
        this.instance.focus();
        this.$element.find('p').first().text('@');
        this.clock.tick();
    });

    test('navigation keys don\'t change a caret position when suggestion list is visible', function(assert) {
        const done = assert.async();
        const valueChangeSpy = sinon.spy(() => {
            if(valueChangeSpy.calledOnce) {
                this.clock.tick();
                const $content = this.$element.find(`.${HTML_EDITOR_CONTENT}`);
                const range = this.instance.getSelection();

                NAVIGATION_KEYS.forEach((keyCode) => {
                    KeyEventsMock.simulateEvent($content.get(0), 'keydown', { keyCode });
                    assert.deepEqual(this.instance.getSelection(), range, 'caret position wasn\'t change');
                });
                done();
            }
        });

        this.options.onValueChanged = valueChangeSpy;

        this.createWidget();
        this.instance.focus();
        this.$element.find('p').first().text('@');
        this.clock.tick();
    });

    test('list should show relevant items on typing text', function(assert) {
        const done = assert.async();
        const valueChangeSpy = sinon.spy(({ component }) => {
            if(valueChangeSpy.calledOnce) {
                const element = this.$element.find('p').get(0);
                element.innerText += 'F';
                this.clock.tick();
            } else {
                this.clock.tick(POPUP_TIMEOUT);
                const $items = this.getItems();

                assert.strictEqual(component.option('value'), '<p>@F</p>', 'correct value');
                assert.strictEqual($items.length, 1, 'there is one relevant item');
                assert.strictEqual($items.text(), 'Freddy', 'correct item');
                done();
            }
        });
        this.options.onValueChanged = valueChangeSpy;

        this.createWidget();
        this.instance.focus();
        this.$element.find('p').first().text('@');
        this.clock.tick();
    });

    test('first list item should be focused on filtering', function(assert) {
        const done = assert.async();
        const valueChangeSpy = sinon.spy(() => {
            if(valueChangeSpy.calledOnce) {
                const element = this.$element.find('p').get(0);

                element.innerText += 'F';
                this.clock.tick();
            } else {
                this.clock.tick(POPUP_TIMEOUT);
                const $items = this.getItems();
                const isFirstListItemFocused = $items.first().hasClass(FOCUSED_STATE_CLASS);

                assert.ok(isFirstListItemFocused);
                done();
            }
        });
        this.options.onValueChanged = valueChangeSpy;

        this.createWidget();
        this.instance.focus();
        this.$element.find('p').first().text('@');
        this.clock.tick();
    });

    test('input text should be removed after item select', function(assert) {
        const done = assert.async();
        const expectedMention = '<p><span class="dx-mention" spellcheck="false" data-marker="@" data-mention-value="Freddy" data-id="Freddy"><span contenteditable="false"><span>@</span>Freddy</span></span> </p>';
        const valueChangeSpy = sinon.spy(({ value }) => {
            const element = this.$element.find('p').get(0);

            switch(valueChangeSpy.callCount) {
                case 1:
                    element.innerText += 'F';
                    this.clock.tick();
                    break;
                case 2:
                    this.clock.tick(POPUP_TIMEOUT);
                    this.getItems().first().trigger('dxclick');
                    this.clock.tick(POPUP_TIMEOUT);
                    break;
                case 3:
                    assert.strictEqual(prepareEmbedValue(value), expectedMention, 'mention has been added');
                    done();
                    break;
            }
        });
        this.options.onValueChanged = valueChangeSpy;

        this.createWidget();
        this.instance.focus();
        this.$element.find('p').first().text('@');
        this.clock.tick();
    });

    test('search timeout', function(assert) {
        const done = assert.async();
        const TIMEOUT = 700;
        const valueChangeSpy = sinon.spy(({ value }) => {
            let $items;
            if(valueChangeSpy.calledOnce) {
                const element = this.$element.find('p').get(0);

                element.innerText += 'F';
                this.clock.tick();
                assert.strictEqual(this.getItems().length, 4, 'dataSource isn\'t filtered');
            } else {
                this.clock.tick(TIMEOUT);
                $items = this.getItems();
                assert.strictEqual(value, '<p>@F</p>', 'correct value');
                assert.strictEqual($items.length, 1, 'there is one relevant item');
                assert.strictEqual($items.text(), 'Freddy', 'correct item');
                done();
            }
        });
        this.options.onValueChanged = valueChangeSpy;
        this.options.mentions.searchTimeout = TIMEOUT;

        this.createWidget();
        this.instance.focus();
        this.$element.find('p').first().text('@');
        this.clock.tick();
    });

    test('minimal search length', function(assert) {
        const done = assert.async();
        const getParagraph = () => this.$element.find('p').get(0);
        const valueChangeSpy = sinon.spy(({ component }) => {
            let $items;
            if(valueChangeSpy.calledOnce) {
                getParagraph().innerText += 'F';
                this.clock.tick();
                const $items = this.getItems();
                assert.strictEqual($items.length, 4, 'dataSource isn\'t filtered');
            } else if(valueChangeSpy.calledTwice) {
                getParagraph().innerText += 'r';
                this.clock.tick();
            } else {
                this.clock.tick(POPUP_TIMEOUT);
                $items = this.getItems();
                assert.strictEqual(component.option('value'), '<p>@Fr</p>', 'correct value');
                assert.strictEqual($items.length, 1, 'there is one relevant item');
                assert.strictEqual($items.text(), 'Freddy', 'correct item');
                done();
            }
        });
        this.options.onValueChanged = valueChangeSpy;
        this.options.mentions.minSearchLength = 2;

        this.createWidget();
        this.instance.focus();
        this.$element.find('p').first().text('@');
        this.clock.tick();
    });

    test('search expression', function(assert) {
        const done = assert.async();
        const valueChangeSpy = sinon.spy(({ component }) => {
            let $items;
            if(valueChangeSpy.calledOnce) {
                const element = this.$element.find('p').get(0);

                element.innerText += 'A';
                this.clock.tick();
            } else {
                this.clock.tick(POPUP_TIMEOUT);
                $items = this.getItems();
                assert.strictEqual(component.option('value'), '<p>@A</p>', 'correct value');
                assert.strictEqual($items.length, 1, 'there is one relevant item');
                assert.strictEqual($items.text(), 'London', 'correct item');
                done();
            }
        });

        this.options.onValueChanged = valueChangeSpy;
        this.options.mentions = [{
            dataSource: [
                { name: 'Alex', city: 'London' },
                { name: 'John', city: 'New York' },
                { name: 'Freddy', city: 'Paris' }
            ],
            searchExpr: 'name',
            displayExpr: 'city'
        }];

        this.createWidget();
        this.instance.focus();
        this.$element.find('p').first().text('@');
        this.clock.tick();
    });

    test('template', function(assert) {
        const done = assert.async();
        const expectedMention = '<p><span class="dx-mention" spellcheck="false" data-marker="@" data-mention-value="John" data-id="John"><span contenteditable="false">John!</span></span> </p>';
        const valueChangeSpy = sinon.spy(({ value }) => {
            if(valueChangeSpy.calledOnce) {
                $(`.${SUGGESTION_LIST_CLASS} .${LIST_ITEM_CLASS}`).eq(1).trigger('dxclick');

                this.clock.tick();
            } else {
                assert.strictEqual(prepareEmbedValue(value), expectedMention, 'mention has been added');
                done();
            }
        });
        this.options.mentions[0].template = (data, container) => {
            $(container).text(`${data.value}!`);
        };

        this.options.onValueChanged = valueChangeSpy;

        this.createWidget();
        this.instance.focus();
        this.$element.find('p').first().text('@');
        this.clock.tick();
    });

    test('template for existed value', function(assert) {
        const expectedMention = '<span class="dx-mention" spellcheck="false" data-marker="@" data-mention-value="John" data-id="John"><span contenteditable="false">John!</span></span>';

        this.options.mentions[0].template = (data, container) => {
            $(container).text(`${data.value}!`);
        };
        this.options.value = expectedMention;

        this.createWidget();

        const value = prepareEmbedValue(this.$element.find(`.${MENTION_CLASS}`).parent().html());
        assert.strictEqual(value, expectedMention);
    });
});
