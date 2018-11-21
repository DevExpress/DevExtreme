import $ from "jquery";

import "ui/html_editor";

const TOOLBAR_CLASS = "dx-htmleditor-toolbar";
const TOOLBAR_WRAPPER_CLASS = "dx-htmleditor-toolbar-wrapper";
const TOOLBAR_FORMAT_WIDGET_CLASS = "dx-htmleditor-toolbar-format";
const DROPDOWNMENU_CLASS = "dx-dropdownmenu-button";
const BUTTON_CONTENT_CLASS = "dx-button-content";
const QUILL_CONTAINER_CLASS = "dx-quill-container";

const { test } = QUnit;

QUnit.module("Toolbar integration", {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: () => {
        this.clock.restore();
    }
}, () => {
    test("Apply simple format without focus", (assert) => {
        $("#htmlEditor").dxHtmlEditor({
            value: "<p>test</p>",
            toolbar: { items: ["bold"] }
        });

        try {
            $("#htmlEditor")
                .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
                .trigger("dxclick");
        } catch(e) {
            assert.ok(false, "error on formatting");
        }

        assert.ok(true);
    });

    test("Apply simple format with selection", (assert) => {
        const done = assert.async();
        const expected = "<strong>te</strong>st";
        const instance = $("#htmlEditor").dxHtmlEditor({
            value: "<p>test</p>",
            toolbar: { items: ["bold"] },
            onValueChanged: (e) => {
                assert.equal(e.value, expected, "markup contains an image");
                done();
            }
        })
            .dxHtmlEditor("instance");

        instance.setSelection(0, 2);
        $("#htmlEditor")
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
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
        let markup = "";

        for(let i = 1; i < 50; i++) {
            markup += `<p>test ${i}</p>`;
        }

        $("#htmlEditor").html(markup).dxHtmlEditor({
            height: height,
            toolbar: { items: ["bold"] }
        });

        const quillContainerHeight = $(`#htmlEditor .${QUILL_CONTAINER_CLASS}`).outerHeight();
        const toolbarHeight = $(`#htmlEditor .${TOOLBAR_WRAPPER_CLASS}`).outerHeight();

        assert.roughEqual(quillContainerHeight + toolbarHeight, height, 1, "Toolbar + editor equals to the predefined height");
    }));
});
