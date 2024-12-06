import $ from 'jquery';
import fx from 'common/core/animation/fx';

import nativePointerMock from '../../../helpers/nativePointerMock.js';

import 'ui/html_editor';
import 'ui/popup';
import 'ui/scroll_view';

const { test } = QUnit;

const MULTILINE_VALUE = '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n';

QUnit.module('Scrolling', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    const SCROLLABLE_CONTAINER_SELECTOR = '.dx-scrollable-container';
    class TestHelper {
        constructor() {
            this.editorOptions = {
                height: 150
            };

            this.presetValue = true;
        }

        _prepareEnvironment() {
            this.$editor = $('#htmlEditor').wrap($('<div>'));
            this.$container = this.$editor.parent();
            this.editor = this.$editor.dxHtmlEditor(this.editorOptions).dxHtmlEditor('instance');
            this.$editorContent = this.$editor.find('.dx-htmleditor-content');
            this.presetValue && this.editor.insertText(0, MULTILINE_VALUE);
            this.maxScrollValue = this._getMaxScrollValue();
        }

        initPopupTest() {
            this._prepareEnvironment();

            this.popup = this.$container.dxPopup({
                height: 100,
                onContentReady: ({ component }) => {
                    $(component.content()).css('overflow', 'auto').height(100);
                },
                visible: true
            }).dxPopup('instance');
        }

        initPopupWithScrollViewTest() {
            this._prepareEnvironment();

            this.$container.wrap($('<div>'));
            this.scrollView = this.$container.dxScrollView({
                height: 100,
                useNative: false,
                showScrollbar: 'always',
            }).dxScrollView('instance');
            this.popup = this.$container.parent().dxPopup({
                visible: true
            }).dxPopup('instance');
        }

        initScrollViewTest() {
            this._prepareEnvironment();

            this.scrollView = this.$container.dxScrollView({
                height: 100,
                useNative: false,
                showScrollbar: 'always',
            }).dxScrollView('instance');
        }

        _getMaxScrollValue(prop) {
            return this.$editorContent.get(0)['scrollHeight'] - this.$editorContent.get(0)['clientHeight'];
        }

        getScrollableContainer() {
            return this._$scrollableContainer;
        }

        setScrollableContainer($container) {
            this._$scrollableContainer = $container;
        }

        setPosition($element, scrollPosition) {
            $element.scrollTop(scrollPosition);
        }

        checkAsserts(assert, expectedOffset) {
            const $container = this.getScrollableContainer();

            assert.strictEqual($container.scrollTop(), expectedOffset, 'scrollTop()');
        }
    }

    test('editor + scrollView: editor scrollTop - start', function(assert) {
        const helper = new TestHelper();
        helper.initScrollViewTest();

        const $scrollableContainer = $(SCROLLABLE_CONTAINER_SELECTOR);
        helper.setScrollableContainer($scrollableContainer);

        helper.scrollView.scrollTo({ top: 50 });

        const pointer = nativePointerMock(helper.$editorContent.children().first());

        pointer.start().wheel(20);
        helper.checkAsserts(assert, 30);

        pointer.start().wheel(-20);
        helper.checkAsserts(assert, 30);

    });

    test('editor + scrollView: editor scrollTop - end', function(assert) {
        const helper = new TestHelper();
        helper.initScrollViewTest();

        const $scrollableContainer = $(SCROLLABLE_CONTAINER_SELECTOR);
        helper.setScrollableContainer($scrollableContainer);

        helper.scrollView.scrollTo({ top: 25 });
        helper.setPosition(helper.$editorContent, helper.maxScrollValue);

        const pointer = nativePointerMock(helper.$editorContent);

        pointer.start().wheel(-20);
        helper.checkAsserts(assert, 45);

        pointer.start().wheel(20);
        helper.checkAsserts(assert, 45);
    });

    test('editor + scrollView: editor scrollTop - middle', function(assert) {
        const helper = new TestHelper();
        helper.initScrollViewTest();

        const $scrollableContainer = $(SCROLLABLE_CONTAINER_SELECTOR);
        helper.setScrollableContainer($scrollableContainer);

        helper.scrollView.scrollTo({ top: 50 });
        helper.setPosition(helper.$editorContent, helper.maxScrollValue / 2);

        const pointer = nativePointerMock(helper.$editorContent);

        pointer.start().wheel(-20);
        helper.checkAsserts(assert, 50);

        pointer.start().wheel(20);
        helper.checkAsserts(assert, 50);
    });

    test('editor + popup: editor scrollTop - start', function(assert) {
        const helper = new TestHelper();
        helper.initPopupTest();

        const $scrollableContainer = $(helper.popup.content());
        helper.setScrollableContainer($scrollableContainer);

        helper.setPosition($scrollableContainer, 50);

        const pointer = nativePointerMock(helper.$editorContent);

        pointer.start().wheel(20);
        helper.checkAsserts(assert, 50);

        pointer.start().wheel(-20);
        helper.checkAsserts(assert, 50);
    });

    test('editor + popup: editor scrollTop - end', function(assert) {
        const helper = new TestHelper();
        helper.initPopupTest();

        const $scrollableContainer = $(helper.popup.content());
        helper.setScrollableContainer($scrollableContainer);

        helper.setPosition($scrollableContainer, 25);
        helper.setPosition(helper.$editorContent, helper.maxScrollValue);

        const pointer = nativePointerMock(helper.$editorContent);

        pointer.start().wheel(-20);
        helper.checkAsserts(assert, 25);

        pointer.start().wheel(20);
        helper.checkAsserts(assert, 25);
    });

    test('editor + popup: editor scrollTop - middle', function(assert) {
        const helper = new TestHelper();
        helper.initPopupTest();

        const $scrollableContainer = $(helper.popup.content());
        helper.setScrollableContainer($scrollableContainer);

        helper.setPosition($scrollableContainer, 50);
        helper.setPosition(helper.$editorContent, helper.maxScrollValue / 2);

        const pointer = nativePointerMock(helper.$editorContent);

        pointer.start().wheel(-20);
        helper.checkAsserts(assert, 50);

        pointer.start().wheel(20);
        helper.checkAsserts(assert, 50);
    });

    test('editor + popup + scrollView: editor scrollTop - start', function(assert) {
        const helper = new TestHelper();
        helper.initPopupWithScrollViewTest();

        const $scrollableContainer = $(SCROLLABLE_CONTAINER_SELECTOR);
        helper.setScrollableContainer($scrollableContainer);

        helper.scrollView.scrollTo({ top: 50 });

        const pointer = nativePointerMock(helper.$editorContent);

        pointer.start().wheel(20);
        helper.checkAsserts(assert, 30);

        pointer.start().wheel(-20);
        helper.checkAsserts(assert, 30);
    });

    test('editor + popup + scrollView: editor scrollTop - end', function(assert) {
        const helper = new TestHelper();
        helper.initPopupWithScrollViewTest();

        const $scrollableContainer = $(SCROLLABLE_CONTAINER_SELECTOR);
        helper.setScrollableContainer($scrollableContainer);

        helper.scrollView.scrollTo({ top: 25 });
        helper.setPosition(helper.$editorContent, helper.maxScrollValue);

        const pointer = nativePointerMock(helper.$editorContent);

        pointer.start().wheel(-20);
        helper.checkAsserts(assert, 45);

        pointer.start().wheel(20);
        helper.checkAsserts(assert, 45);
    });

    test('editor + popup + scrollView: editor scrollTop - middle', function(assert) {
        const helper = new TestHelper();
        helper.initPopupWithScrollViewTest();

        const $scrollableContainer = $(SCROLLABLE_CONTAINER_SELECTOR);
        helper.setScrollableContainer($scrollableContainer);

        helper.scrollView.scrollTo({ top: 50 });
        helper.setPosition(helper.$editorContent, helper.maxScrollValue / 2);

        const pointer = nativePointerMock(helper.$editorContent);

        pointer.start().wheel(-20);
        helper.checkAsserts(assert, 50);

        pointer.start().wheel(20);
        helper.checkAsserts(assert, 50);
    });

    test('editor + popup: wheel event should be passed for element with contenteditable=false', function(assert) {
        const helper = new TestHelper();
        const labelClass = 'test-label';

        helper.presetValue = false;
        helper.editorOptions.onInitialized = ({ component: instance }) => {
            const Parchment = instance.get('parchment');

            class Label extends Parchment.EmbedBlot {
                static create(value) {
                    const node = super.create(value);
                    node.innerText = value;
                    node.contentEditable = 'false';
                    return node;
                }

                deleteAt() { }

                static value(node) {
                    return node.childNodes[0].textContent;
                }
            }

            Label.blotName = 'label';
            Label.tagName = 'div';
            Label.className = labelClass;

            instance.register(Label);
        };
        helper.editorOptions.onContentReady = ({ component: instance }) => {
            const quill = instance.getQuillInstance();
            const Delta = instance.get('delta');

            const newDelta = new Delta()
                .insert({ label: 'Footer (Readonly)' })
                .insert(MULTILINE_VALUE);

            quill.updateContents(newDelta);
        };

        helper.initPopupWithScrollViewTest();

        const $scrollableContainer = $(SCROLLABLE_CONTAINER_SELECTOR);
        helper.setScrollableContainer($scrollableContainer);

        helper.setPosition($scrollableContainer, 50);
        helper.setPosition(helper.$editorContent, helper.maxScrollValue / 2);

        const pointer = nativePointerMock(helper.$editorContent.find(`.${labelClass}`));

        pointer.start().wheel(-20);
        helper.checkAsserts(assert, 50);

        pointer.start().wheel(20);
        helper.checkAsserts(assert, 50);
    });
});
