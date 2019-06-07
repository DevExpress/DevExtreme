import $ from "jquery";

import "ui/html_editor";
import fx from "animation/fx";

import keyboardMock from "../../../helpers/keyboardMock.js";

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
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },
    afterEach: () => {
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    test("Apply simple format without focus", (assert) => {
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

    test("there is no extra focusout when applying toolbar formatting to the selected range", (assert) => {
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

    test("Apply simple format with selection", (assert) => {
        const done = assert.async();
        const expected = "<strong>te</strong>st";
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

    test("Apply format via color dialog located in the adaptive menu", (assert) => {
        const done = assert.async();
        const toolbarClickStub = sinon.stub();
        const expected = '<span style="color: rgb(250, 250, 250);">te</span>st';
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

        $(`.${TOOLBAR_CLASS}`).on("dxclick", toolbarClickStub);
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

    test("Add a link via dialog", (assert) => {
        const done = assert.async();
        const expected = '<a href="http://test.com" target="_blank">te</a>st';
        const instance = $("#htmlEditor").dxHtmlEditor({
            value: "<p>test</p>",
            toolbar: { items: ["link"] },
            onValueChanged: (e) => {
                assert.equal(e.value, expected, "link has been added");
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
            .val("http://test.com")
            .change();

        $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`)
            .first()
            .trigger("dxclick");
    });

    test("Overflow menu button should have a correct content", (assert) => {
        $("#htmlEditor").html("<p>test</p>").dxHtmlEditor({
            toolbar: { items: ["bold", { text: "test", showInMenu: "always" }] }
        });

        const buttonContent = $("#htmlEditor")
            .find(`.${DROPDOWNMENU_CLASS} .${BUTTON_CONTENT_CLASS}`)
            .html();
        const expectedContent = '<i class="dx-icon dx-icon-overflow"></i>';

        assert.equal(buttonContent, expectedContent);
    });

    test("Editor disposing should dispose external toolbar", (assert) => {
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

    test("Editor should consider toolbar height", (assert => {
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

    test("Toolbar correctly disposed after repaint", (assert) => {
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

    test("Toolbar should be disabled once editor is read only", (assert) => {
        $("#htmlEditor").dxHtmlEditor({
            readOnly: true,
            toolbar: { items: ["bold"] }
        });

        const isToolbarDisabled = $(`.${TOOLBAR_CLASS}`).hasClass(STATE_DISABLED_CLASS);
        assert.ok(isToolbarDisabled);
    });

    test("Toolbar should be disabled once editor is disabled", (assert) => {
        $("#htmlEditor").dxHtmlEditor({
            disabled: true,
            toolbar: { items: ["bold"] }
        });

        const isToolbarDisabled = $(`.${TOOLBAR_CLASS}`).hasClass(STATE_DISABLED_CLASS);
        assert.ok(isToolbarDisabled);
    });

    test("Toolbar should correctly update disabled state on the option changed", (assert) => {
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

    test("SelectBox should keep selected value after format applying", (assert) => {
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

    function prepareImageUpdateTest(context, caretPosition, selectionLength) {
        return (assert) => {
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

            context.clock.tick(100);
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

    test("image should be correctly updated after change a source and caret placed after", prepareImageUpdateTest(this, 1, 0));

    test("image should be correctly updated after change a source and caret placed before an image", prepareImageUpdateTest(this, 0, 0));

    test("selected image should be correctly updated after change a source and caret placed after", prepareImageUpdateTest(this, 1, 1));

    test("selected image should be correctly updated after change a source and caret placed before an image", prepareImageUpdateTest(this, 0, 1));

    test("image should be correctly updated after change a source and caret placed between two images", (assert) => {
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

    test("link should be correctly set to an image", (assert) => {
        const done = assert.async();
        const $container = $("#htmlEditor");
        const link = "http://test.com";
        const expected = `<a href="${link}" target="_blank"><img src="${BLACK_PIXEL}"></a>`;
        const instance = $container.dxHtmlEditor({
            toolbar: { items: ["link"] },
            value: `<img src=${BLACK_PIXEL}>`,
            onValueChanged: ({ value }) => {
                assert.strictEqual(value, expected, "link was setted");
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

    test("link should be correctly added for a third", (assert) => {
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
                        .val("http://test2.com")
                        .change();

                    $okDialogButton.trigger("dxclick");
                });
            } else if(valueChangeSpy.calledTwice) {
                setTimeout(() => {
                    prepareLink();
                    $urlInput
                        .val("http://test3.com")
                        .change();

                    $okDialogButton.trigger("dxclick");
                });
            } else {
                assert.strictEqual(value, '<a href="http://test3.com" target="_blank">test</a>', "link was setted");
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
            .val("http://test1.com")
            .change();

        $okDialogButton.trigger("dxclick");
        this.clock.tick();
        this.clock.tick();
    });

    test("Add a link with empty text", (assert) => {
        const done = assert.async();
        const expected = '<a href="http://test.com" target="_blank">http://test.com</a>test';
        const instance = $("#htmlEditor").dxHtmlEditor({
            value: "<p>test</p>",
            toolbar: { items: ["link"] },
            onValueChanged: (e) => {
                assert.equal(e.value, expected, "link has been added");
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
            .val("http://test.com")
            .change();

        $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`)
            .first()
            .trigger("dxclick");
    });

    test("Add a link and text without selection", (assert) => {
        const done = assert.async();
        const expected = '<a href="http://test.com" target="_blank">123</a>test';
        const instance = $("#htmlEditor").dxHtmlEditor({
            value: "<p>test</p>",
            toolbar: { items: ["link"] },
            onValueChanged: (e) => {
                assert.equal(e.value, expected, "link has been added");
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
            .val("http://test.com")
            .change();

        $inputs
            .last()
            .val("123")
            .change();

        $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`)
            .first()
            .trigger("dxclick");
    });

    test("Add a link with empty text and selected range", (assert) => {
        const done = assert.async();
        const expected = '<a href="http://test.com" target="_blank">http://test.com</a>st';
        const instance = $("#htmlEditor").dxHtmlEditor({
            value: "<p>test</p>",
            toolbar: { items: ["link"] },
            onValueChanged: (e) => {
                assert.equal(e.value, expected, "link has been added");
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
            .val("http://test.com")
            .change();

        $inputs
            .last()
            .val("")
            .change();

        $(`.${DIALOG_CLASS} .${BUTTON_CLASS}`)
            .first()
            .trigger("dxclick");
    });

    test("format image and text", (assert) => {
        const done = assert.async();
        const $container = $("#htmlEditor");
        const link = "http://test.com";
        const expected = `<a href="${link}" target="_blank"><img src="${BLACK_PIXEL}">12</a>`;
        const instance = $container.dxHtmlEditor({
            toolbar: { items: ["link"] },
            value: `<img src=${BLACK_PIXEL}>12`,
            onValueChanged: ({ value }) => {
                assert.strictEqual(value, expected, "link was setted");
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

    test("replace the text of the existed link", (assert) => {
        const done = assert.async();
        const $container = $("#htmlEditor");
        const link = "http://test.com";
        const expected = `<a href="${link}" target="_blank">123</a>`;
        const instance = $container.dxHtmlEditor({
            toolbar: { items: ["link"] },
            value: `<a href="${link}" target="_blank">test</a>`,
            onValueChanged: ({ value }) => {
                assert.strictEqual(value, expected, "text updated");
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
});
