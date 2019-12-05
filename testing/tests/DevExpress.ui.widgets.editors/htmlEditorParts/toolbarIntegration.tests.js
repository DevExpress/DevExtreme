import $ from "jquery";

import "ui/html_editor";
import fx from "animation/fx";

import keyboardMock from "../../../helpers/keyboardMock.js";
import { checkLink } from "./utils.js";

const TOOLBAR_CLASS = "dx-htmleditor-toolbar";
const TOOLBAR_WRAPPER_CLASS = "dx-htmleditor-toolbar-wrapper";
const TOOLBAR_FORMAT_WIDGET_CLASS = "dx-htmleditor-toolbar-format";
const DROPDOWNMENU_CLASS = "dx-dropdownmenu-button";
const DROPDOWNEDITOR_ICON_CLASS = "dx-dropdowneditor-icon";
const BUTTON_CONTENT_CLASS = "dx-button-content";
const QUILL_CONTAINER_CLASS = "dx-quill-container";
const STATE_DISABLED_CLASS = "dx-state-disabled";
const HEX_FIELD_CLASS = "dx-colorview-label-hex";
const INPUT_CLASS = "dx-texteditor-input";
const DIALOG_CLASS = "dx-formdialog";
const DIALOG_FORM_CLASS = "dx-formdialog-form";
const BUTTON_CLASS = "dx-button";
const LIST_ITEM_CLASS = "dx-list-item";
const FIELD_ITEM_CLASS = "dx-field-item";
const TEXTEDITOR_INPUT_CLASS = "dx-texteditor-input";

const WHITE_PIXEL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWP4////fwAJ+wP93BEhJAAAAABJRU5ErkJggg==";
const BLACK_PIXEL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWNgYmL6DwABFgEGpP/tHAAAAABJRU5ErkJggg==";
const ORANGE_PIXEL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWP4z8j4HwAFBQIB6OfkUgAAAABJRU5ErkJggg==";

const { test } = QUnit;

QUnit.module("Toolbar integration", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    test("Apply simple format without focus", function(assert) {
        const focusInStub = sinon.stub();
        const focusOutStub = sinon.stub();

        $("#htmlEditor").dxHtmlEditor({
            value: "<p>test</p>",
            toolbar: { items: ["bold"] },
            onFocusIn: focusInStub,
            onFocusOut: focusOutStub
        });

        try {
            $("#htmlEditor")
                .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                .trigger("dxclick");
        } catch(e) {
            assert.ok(false, "error on formatting");
        }

        assert.strictEqual(focusInStub.callCount, 1, "editor focused");
        assert.strictEqual(focusOutStub.callCount, 0, "editor isn't blurred");
    });

    test("there is no extra focusout when applying toolbar formatting to the selected range", function(assert) {
        const done = assert.async();
        const focusInStub = sinon.stub();
        const focusOutStub = sinon.stub();
        const instance = $("#htmlEditor").dxHtmlEditor({
            value: "<p>test</p>",
            toolbar: { items: ["bold"] },
            onValueChanged: (e) => {
                assert.strictEqual(focusInStub.callCount, 1, "editor focused");
                assert.strictEqual(focusOutStub.callCount, 0, "editor isn't blurred");
                done();
            },
            onFocusIn: focusInStub,
            onFocusOut: focusOutStub
        })
            .dxHtmlEditor("instance");

        instance.setSelection(0, 2);

        $("#htmlEditor")
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger("dxclick");
    });

    test("Apply simple format with selection", function(assert) {
        const done = assert.async();
        const expected = "<p><strong>te</strong>st</p>";
        const instance = $("#htmlEditor").dxHtmlEditor({
            value: "<p>test</p>",
            toolbar: { items: ["bold"] },
            onValueChanged: (e) => {
                assert.equal(e.value, expected, "markup contains a formatted text");
                done();
            }
        })
            .dxHtmlEditor("instance");

        instance.setSelection(0, 2);

        $("#htmlEditor")
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger("dxclick");
    });

    test("Apply format via color dialog located in the adaptive menu", function(assert) {
        const done = assert.async();
        const toolbarClickStub = sinon.stub();
        const expected = '<p><span style="color: rgb(250, 250, 250);">te</span>st</p>';
        const instance = $("#htmlEditor").dxHtmlEditor({
            value: "<p>test</p>",
            toolbar: { items: [{ formatName: "color", locateInMenu: "always" }] },
            onValueChanged: (e) => {
                assert.equal(e.value, expected, "color has been applied");
                assert.equal(toolbarClickStub.callCount, 2, "Clicks on toolbar buttons should bubbling to the toolbar container");
                done();
            }
        }).dxHtmlEditor("instance");

        instance.setSelection(0, 2);

        $(`.${TOOLBAR_WRAPPER_CLASS}`).on("dxclick", toolbarClickStub);
        $("#htmlEditor")
            .find(`.dx-dropdownmenu-button`)
            .trigger("dxclick");

        $(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger("dxclick");

        $(`.${HEX_FIELD_CLASS} .${INPUT_CLASS}`)
            .val("fafafa")
            .change();


        $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`)
            .first()
            .trigger("dxclick");
    });

    test("Add a link via dialog", function(assert) {
        const done = assert.async();
        const instance = $("#htmlEditor").dxHtmlEditor({
            value: "<p>test</p>",
            toolbar: { items: ["link"] },
            onValueChanged: ({ value }) => {
                checkLink(assert, {
                    href: "http://test.test",
                    content: "te"
                }, value);
                done();
            }
        }).dxHtmlEditor("instance");

        instance.setSelection(0, 2);

        $("#htmlEditor")
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger("dxclick");

        const $inputs = $(`.${DIALOG_FORM_CLASS} .${INPUT_CLASS}`);
        const linkText = $inputs
            .last()
            .val();

        assert.strictEqual(linkText, "te", "Link test equal to the selected content");

        $inputs
            .first()
            .val("http://test.test")
            .change();

        $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`)
            .first()
            .trigger("dxclick");
    });

    test("Overflow menu button should have a correct content", function(assert) {
        $("#htmlEditor").html("<p>test</p>").dxHtmlEditor({
            toolbar: { items: ["bold", { text: "test", showInMenu: "always" }] }
        });

        const buttonContent = $("#htmlEditor")
            .find(`.${DROPDOWNMENU_CLASS} .${BUTTON_CONTENT_CLASS}`)
            .html();
        const expectedContent = '<i class="dx-icon dx-icon-overflow"></i>';

        assert.equal(buttonContent, expectedContent);
    });

    test("Editor disposing should dispose external toolbar", function(assert) {
        const $toolbarContainer = $("<div>").addClass("external-container");
        $("#qunit-fixture").append($toolbarContainer);

        const editor = $("#htmlEditor").dxHtmlEditor({
            toolbar: {
                container: $toolbarContainer,
                items: ["bold"]
            }
        }).dxHtmlEditor("instance");

        assert.ok($toolbarContainer.hasClass(TOOLBAR_WRAPPER_CLASS), "Container has wrapper class");
        assert.equal($toolbarContainer.find(`.${TOOLBAR_CLASS}`).length, 1, "Toolbar container contains the htmlEditor's toolbar");

        editor.dispose();

        assert.equal($toolbarContainer.html(), "", "Container's inner html is empty");
        assert.notOk($toolbarContainer.hasClass(TOOLBAR_WRAPPER_CLASS), "Container hasn't wrapper class");
    });

    test("Editor should consider toolbar height", (function(assert) {
        const height = 100;
        const $container = $("#htmlEditor");
        let markup = "";

        for(let i = 1; i < 50; i++) {
            markup += `<p>test ${i}</p>`;
        }

        $container.html(markup).dxHtmlEditor({
            height: height,
            toolbar: { items: ["bold"] }
        });

        const quillContainerHeight = $container.find(`.${QUILL_CONTAINER_CLASS}`).outerHeight();
        const toolbarHeight = $container.find(`.${TOOLBAR_WRAPPER_CLASS}`).outerHeight();
        const bordersWidth = parseInt($container.css("border-top-width")) + parseInt($container.css("border-bottom-width"));

        assert.roughEqual(quillContainerHeight + toolbarHeight + bordersWidth, height, 1, "Toolbar + editor equals to the predefined height");
    }));

    test("Toolbar correctly disposed after repaint", function(assert) {
        const $toolbarContainer = $("<div>").addClass("external-container");
        $("#qunit-fixture").append($toolbarContainer);

        const editor = $("#htmlEditor").dxHtmlEditor({
            toolbar: {
                container: $toolbarContainer,
                items: ["bold"]
            }
        }).dxHtmlEditor("instance");

        editor.repaint();

        assert.ok($toolbarContainer.hasClass(TOOLBAR_WRAPPER_CLASS), "Container has wrapper class");
        assert.equal($toolbarContainer.find(`.${TOOLBAR_CLASS}`).length, 1, "Toolbar container contains the htmlEditor's toolbar");
    });

    test("Toolbar should be disabled once editor is read only", function(assert) {
        $("#htmlEditor").dxHtmlEditor({
            readOnly: true,
            toolbar: { items: ["bold"] }
        });

        const isToolbarDisabled = $(`.${TOOLBAR_CLASS}`).hasClass(STATE_DISABLED_CLASS);
        assert.ok(isToolbarDisabled);
    });

    test("Toolbar should be disabled once editor is disabled", function(assert) {
        $("#htmlEditor").dxHtmlEditor({
            disabled: true,
            toolbar: { items: ["bold"] }
        });

        const isToolbarDisabled = $(`.${TOOLBAR_CLASS}`).hasClass(STATE_DISABLED_CLASS);
        assert.ok(isToolbarDisabled);
    });

    test("Toolbar should correctly update disabled state on the option changed", function(assert) {
        const editor = $("#htmlEditor").dxHtmlEditor({
            disabled: true,
            readOnly: true,
            toolbar: { items: ["bold"] }
        }).dxHtmlEditor("instance");
        const $toolbar = $(`.${TOOLBAR_CLASS}`);

        editor.option("disabled", false);
        assert.ok($toolbar.hasClass(STATE_DISABLED_CLASS));

        editor.option("readOnly", false);
        assert.notOk($toolbar.hasClass(STATE_DISABLED_CLASS));

        editor.option("disabled", true);
        assert.ok($toolbar.hasClass(STATE_DISABLED_CLASS));
    });

    test("SelectBox should keep selected value after format applying", function(assert) {
        $("#htmlEditor").dxHtmlEditor({
            toolbar: { items: [{ formatName: "size", formatValues: ["10px", "11px"] }] }
        });

        const $formatWidget = $("#htmlEditor").find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);

        $formatWidget
            .find(`.${DROPDOWNEDITOR_ICON_CLASS}`)
            .trigger("dxclick");

        $(`.${LIST_ITEM_CLASS}`)
            .last()
            .trigger("dxclick");

        const value = $formatWidget.find(`.${INPUT_CLASS}`).val();

        assert.strictEqual(value, "11px", "SelectBox contain selected value");
    });

    function prepareImageUpdateTest(caretPosition, selectionLength) {
        return function(assert) {
            const done = assert.async();
            const $container = $("#htmlEditor");
            const instance = $container.dxHtmlEditor({
                toolbar: { items: ["image"] },
                value: `<img src=${WHITE_PIXEL}>`,
                onValueChanged: ({ value }) => {
                    assert.ok(value.indexOf(WHITE_PIXEL) === -1, "There is no white pixel");
                    assert.ok(value.indexOf(BLACK_PIXEL) !== -1, "There is a black pixel");
                    done();
                }
            }).dxHtmlEditor("instance");

            instance.focus();

            setTimeout(() => {
                instance.setSelection(caretPosition, selectionLength);
            }, 100);

            this.clock.tick(100);
            $container
                .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                .trigger("dxclick");

            const $srcInput = $(`.${FIELD_ITEM_CLASS} .${TEXTEDITOR_INPUT_CLASS}`).first().val("");

            keyboardMock($srcInput.eq(0))
                .type(BLACK_PIXEL)
                .change()
                .press("enter");
        };
    }

    test("image should be correctly updated after change a source and caret placed after", prepareImageUpdateTest(1, 0));

    test("image should be correctly updated after change a source and caret placed before an image", prepareImageUpdateTest(0, 0));

    test("selected image should be correctly updated after change a source and caret placed after", prepareImageUpdateTest(1, 1));

    test("selected image should be correctly updated after change a source and caret placed before an image", prepareImageUpdateTest(0, 1));

    test("image should be correctly updated after change a source and caret placed between two images", function(assert) {
        const done = assert.async();
        const $container = $("#htmlEditor");
        const instance = $container.dxHtmlEditor({
            toolbar: { items: ["image"] },
            value: `<img src=${WHITE_PIXEL}><img src=${BLACK_PIXEL}>`,
            onValueChanged: ({ value }) => {
                const blackIndex = value.indexOf(BLACK_PIXEL);
                const orangeIndex = value.indexOf(ORANGE_PIXEL);

                assert.ok(value.indexOf(WHITE_PIXEL) === -1, "There is no white pixel");
                assert.ok(blackIndex !== -1, "There is a black pixel");
                assert.ok(orangeIndex !== -1, "There is an orange pixel");
                assert.ok(orangeIndex < blackIndex, "orange pixel placed before black pixel");
                done();
            }
        }).dxHtmlEditor("instance");

        instance.focus();

        setTimeout(() => {
            instance.setSelection(1, 0);
        }, 100);

        this.clock.tick(100);

        $container
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger("dxclick");

        const $srcInput = $(`.${FIELD_ITEM_CLASS} .${TEXTEDITOR_INPUT_CLASS}`).first().val("");

        keyboardMock($srcInput.eq(0))
            .type(ORANGE_PIXEL)
            .change()
            .press("enter");
    });

    test("link should be correctly set to an image", function(assert) {
        const done = assert.async();
        const $container = $("#htmlEditor");
        const link = "http://test.test";
        const instance = $container.dxHtmlEditor({
            toolbar: { items: ["link"] },
            value: `<img src=${BLACK_PIXEL}>`,
            onValueChanged: ({ value }) => {
                checkLink(assert, {
                    href: link,
                    content: `<img src="${BLACK_PIXEL}">`
                }, value);
                done();
            }
        }).dxHtmlEditor("instance");

        instance.focus();
        instance.setSelection(0, 1);

        const $linkFormatButton = $container.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`).eq(0);
        $linkFormatButton.trigger("dxclick");

        const $urlInput = $(`.${DIALOG_FORM_CLASS} .${INPUT_CLASS}`).first();
        const $okDialogButton = $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`).first();

        $urlInput
            .val(link)
            .change();

        $okDialogButton.trigger("dxclick");
    });

    test("link should be correctly added for a third", function(assert) {
        const done = assert.async();
        const $container = $("#htmlEditor");
        let $urlInput;
        let $okDialogButton;

        const prepareLink = () => {
            instance.focus();

            instance.setSelection(0, 4);

            let $linkFormatButton = $container.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`).eq(0);
            $linkFormatButton.trigger("dxclick");

            $urlInput = $(`.${DIALOG_FORM_CLASS} .${INPUT_CLASS}`).first();
            $okDialogButton = $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`).first();
        };

        const valueChangeSpy = sinon.spy(({ value }) => {
            if(valueChangeSpy.calledOnce) {
                setTimeout(() => {
                    prepareLink();
                    $urlInput
                        .val("http://test2.test")
                        .change();

                    $okDialogButton.trigger("dxclick");
                });
            } else if(valueChangeSpy.calledTwice) {
                setTimeout(() => {
                    prepareLink();
                    $urlInput
                        .val("http://test3.test")
                        .change();

                    $okDialogButton.trigger("dxclick");
                });
            } else {
                checkLink(assert, {
                    href: "http://test3.test",
                    content: "test"
                }, value);
                done();
            }
        });

        const instance = $container.dxHtmlEditor({
            toolbar: { items: ["link"] },
            value: "<p>test</p>",
            onValueChanged: valueChangeSpy
        }).dxHtmlEditor("instance");

        prepareLink();
        $urlInput
            .val("http://test1.test")
            .change();

        $okDialogButton.trigger("dxclick");
        this.clock.tick();
        this.clock.tick();
    });

    test("Add a link with empty text", function(assert) {
        const done = assert.async();
        const instance = $("#htmlEditor").dxHtmlEditor({
            value: "<p>test</p>",
            toolbar: { items: ["link"] },
            onValueChanged: ({ value }) => {
                checkLink(assert, {
                    href: "http://test.test",
                    content: "http://test.test",
                    afterLink: "test"
                }, value);
                done();
            }
        }).dxHtmlEditor("instance");

        instance.setSelection(0, 0);

        $("#htmlEditor")
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger("dxclick");

        const $inputs = $(`.${DIALOG_FORM_CLASS} .${INPUT_CLASS}`);

        $inputs
            .first()
            .val("http://test.test")
            .change();

        $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`)
            .first()
            .trigger("dxclick");
    });

    test("Add a link and text without selection", function(assert) {
        const done = assert.async();
        const instance = $("#htmlEditor").dxHtmlEditor({
            value: "<p>test</p>",
            toolbar: { items: ["link"] },
            onValueChanged: ({ value }) => {
                checkLink(assert, {
                    href: "http://test.test",
                    content: "123",
                    afterLink: "test"
                }, value);
                done();
            }
        }).dxHtmlEditor("instance");

        instance.setSelection(0, 0);

        $("#htmlEditor")
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger("dxclick");

        const $inputs = $(`.${DIALOG_FORM_CLASS} .${INPUT_CLASS}`);

        $inputs
            .first()
            .val("http://test.test")
            .change();

        $inputs
            .last()
            .val("123")
            .change();

        $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`)
            .first()
            .trigger("dxclick");
    });

    test("Add a link with empty text and selected range", function(assert) {
        const done = assert.async();
        const instance = $("#htmlEditor").dxHtmlEditor({
            value: "<p>test</p>",
            toolbar: { items: ["link"] },
            onValueChanged: ({ value }) => {
                checkLink(assert, {
                    href: "http://test.test",
                    content: "http://test.test",
                    afterLink: "st"
                }, value);
                done();
            }
        }).dxHtmlEditor("instance");

        instance.setSelection(0, 2);

        $("#htmlEditor")
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger("dxclick");

        const $inputs = $(`.${DIALOG_FORM_CLASS} .${INPUT_CLASS}`);

        $inputs
            .first()
            .val("http://test.test")
            .change();

        $inputs
            .last()
            .val("")
            .change();

        $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`)
            .first()
            .trigger("dxclick");
    });

    test("format image and text", function(assert) {
        const done = assert.async();
        const $container = $("#htmlEditor");
        const link = "http://test.test";
        const instance = $container.dxHtmlEditor({
            toolbar: { items: ["link"] },
            value: `<img src=${BLACK_PIXEL}>12`,
            onValueChanged: ({ value }) => {
                checkLink(assert, {
                    href: link,
                    content: `<img src="${BLACK_PIXEL}">12`
                }, value);
                done();
            }
        }).dxHtmlEditor("instance");

        instance.focus();
        instance.setSelection(0, 3);

        const $linkFormatButton = $container.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`).eq(0);
        $linkFormatButton.trigger("dxclick");

        const $urlInput = $(`.${DIALOG_FORM_CLASS} .${INPUT_CLASS}`).first();
        const $okDialogButton = $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`).first();

        $urlInput
            .val(link)
            .change();

        $okDialogButton.trigger("dxclick");
    });

    test("replace the text of the existed link", function(assert) {
        const done = assert.async();
        const $container = $("#htmlEditor");
        const link = "http://test.test";
        const instance = $container.dxHtmlEditor({
            toolbar: { items: ["link"] },
            value: `<a href="${link}" target="_blank">test</a>`,
            onValueChanged: ({ value }) => {
                checkLink(assert, {
                    href: link,
                    content: "123"
                }, value);
                done();
            }
        }).dxHtmlEditor("instance");

        instance.focus();
        instance.setSelection(0, 4);

        const $linkFormatButton = $container.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`).eq(0);
        $linkFormatButton.trigger("dxclick");

        const $textInput = $(`.${DIALOG_FORM_CLASS} .${INPUT_CLASS}`).last();
        const $okDialogButton = $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`).first();

        $textInput
            .val("123")
            .change();

        $okDialogButton.trigger("dxclick");
    });

    test("history buttons are inactive after processing transcluded content", function(assert) {
        const done = assert.async();
        const $container = $("#htmlEditor").html("<p>test</p>");

        $container.dxHtmlEditor({
            toolbar: { items: ["undo", "redo"] },
            onContentReady: () => {
                const $toolbarButtons = $container.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);
                assert.ok($toolbarButtons.eq(0).hasClass(STATE_DISABLED_CLASS), "Undo button is disabled");
                assert.ok($toolbarButtons.eq(1).hasClass(STATE_DISABLED_CLASS), "Redo button is disabled");

                done();
            }
        }).dxHtmlEditor("instance");

        this.clock.tick();
    });

    test("history buttons are inactive when editor has initial value", function(assert) {
        const done = assert.async();
        const $container = $("#htmlEditor");

        $container.dxHtmlEditor({
            toolbar: { items: ["undo", "redo"] },
            value: "<p>test</p>",
            onContentReady: () => {
                const $toolbarButtons = $container.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);
                assert.ok($toolbarButtons.eq(0).hasClass(STATE_DISABLED_CLASS), "Undo button is disabled");
                assert.ok($toolbarButtons.eq(1).hasClass(STATE_DISABLED_CLASS), "Redo button is disabled");

                done();
            }
        }).dxHtmlEditor("instance");
    });

    test("history buttons are inactive when editor hasn't initial value", function(assert) {
        const done = assert.async();
        const $container = $("#htmlEditor");

        $container.dxHtmlEditor({
            toolbar: { items: ["undo", "redo"] },
            onContentReady: () => {
                const $toolbarButtons = $container.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);
                assert.ok($toolbarButtons.eq(0).hasClass(STATE_DISABLED_CLASS), "Undo button is disabled");
                assert.ok($toolbarButtons.eq(1).hasClass(STATE_DISABLED_CLASS), "Redo button is disabled");

                done();
            }
        }).dxHtmlEditor("instance");
    });

    test("Toolbar should correctly update its dimensions after changing the width of the HtmlEditor", function(assert) {
        const $container = $("#htmlEditor");
        const instance = $container.dxHtmlEditor({
            width: 1000,
            toolbar: {
                items: [
                    "undo", "redo", "bold", "italic", "strike", "underline", "separator",
                    "alignLeft", "alignCenter", "alignRight", "alignJustify", "separator",
                    "orderedList", "bulletList", "separator",
                    "color", "background", "separator",
                    "link", "image", "separator",
                    "clear", "codeBlock", "blockquote"
                ]
            }
        }).dxHtmlEditor("instance");

        this.clock.tick();
        instance.option("width", 100);
        this.clock.tick();

        const toolbarWidth = $container.find(`.${TOOLBAR_CLASS}`).width();
        const beforeContainerWidth = $container.find(`.dx-toolbar-before`).width();
        assert.ok(beforeContainerWidth <= toolbarWidth, "toolbar items fits the widget container");
    });
});
