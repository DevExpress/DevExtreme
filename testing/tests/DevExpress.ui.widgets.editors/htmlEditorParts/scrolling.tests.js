import $ from "jquery";

import nativePointerMock from "../../../helpers/nativePointerMock.js";

import "ui/html_editor";
import "ui/popup";
import "ui/scroll_view";

import fx from "animation/fx";

const { test } = QUnit;

const MULTILINE_VALUE = "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n";

QUnit.module("Scrolling", {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },
    afterEach: () => {
        this.clock.restore();
        fx.off = false;
    }
}, () => {

    class TestHelper {
        constructor() {
            this.editorOptions = {
                height: 150
            };
        }

        _prepareEnvironment(callBack) {
            this.editorOptions.onContentReady = callBack;
            this.$container = $("<div>");
            this.$editor = $("#htmlEditor").wrap(this.$container);
            this.editor = this.$editor.dxHtmlEditor(this.editorOptions).dxHtmlEditor("instance");
            this.$editorContent = this.$editor.find(".dx-htmleditor-content");
            this.editor.insertText(0, MULTILINE_VALUE);
            this.maxScrollValue = this._getMaxScrollValue();
        }

        initPopupTest() {
            this._prepareEnvironment();

            this.popup = this.$container.dxPopup({ height: 100 }).dxPopup("instance");
        }

        initScrollViewTest(callBack) {
            this._prepareEnvironment(callBack);

            this.scrollView = this.$container.dxScrollView({
                height: 100,
                useNative: false,
                showScrollbar: "always",
            }).dxScrollView("instance");
        }

        _getMaxScrollValue(prop) {
            return this.$editorContent.get(0)["scrollHeight"] - this.$editorContent.get(0)["clientHeight"];
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

            assert.strictEqual($container.scrollTop(), expectedOffset, "scrollTop()");
        }
    }

    // test("HtmlEditor nested in the ScrollView", (assert) => {
    //     const helper = new TextAreaInScrollableTestHelper(direction);
    //     const $container = helper.getScrollableContainer();

    //     helper.setPosition($container, 100);

    //     const pointer = nativePointerMock(helper.$textAreaInput);

    //     pointer.start().wheel(20, helper.isShift());
    //     helper.checkAsserts(assert, 80);

    //     pointer.start().wheel(-20, helper.isShift());
    //     helper.checkAsserts(assert, 80);

    // });


    test(`mousewheel: textArea (scrollPosition - MIN) - wheel -> up -> down`, (assert) => {
        const helper = new TestHelper();
        helper.initScrollViewTest();

        const $scrollableContainer = $(helper.scrollView.content());
        helper.setScrollableContainer($scrollableContainer);

        helper.setPosition($scrollableContainer, 50);

        const pointer = nativePointerMock(helper.$editorContent);

        pointer.start().wheel(20);
        helper.checkAsserts(assert, 80);

        pointer.start().wheel(-20);
        helper.checkAsserts(assert, 80);
    });

    test(`mousewheel: textArea (scrollPosition - MAX) - wheel -> down -> up`, (assert) => {
        const helper = new TestHelper();
        helper.initScrollViewTest();

        const $scrollableContainer = $(helper.scrollView.content());
        helper.setScrollableContainer($scrollableContainer);

        helper.setPosition($scrollableContainer, 50);
        helper.setPosition(helper.$editorContent, helper.maxScrollValue);

        const pointer = nativePointerMock(helper.$editorContent);

        pointer.start().wheel(-20);
        helper.checkAsserts(assert, 70);

        pointer.start().wheel(20);
        helper.checkAsserts(assert, 70);
    });

    test(`mousewheel: textArea (scrollPosition - MIDDLE) - wheel -> down -> up`, (assert) => {
        const helper = new TestHelper();
        helper.initScrollViewTest();

        const $scrollableContainer = $(helper.scrollView.content());
        helper.setScrollableContainer($scrollableContainer);

        helper.setPosition($scrollableContainer, 100);
        helper.setPosition(helper.$editorContent, helper.maxScrollValue / 2);

        const pointer = nativePointerMock(helper.$editorContent);

        pointer.start().wheel(-20);
        helper.checkAsserts(assert, 100);

        pointer.start().wheel(20);
        helper.checkAsserts(assert, 100);
    });
});
