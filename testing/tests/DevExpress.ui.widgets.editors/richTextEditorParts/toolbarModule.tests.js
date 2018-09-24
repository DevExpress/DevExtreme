import $ from "jquery";

import Toolbar from "ui/rich_text_editor/modules/toolbar";
import { noop } from "core/utils/common";

const TOOLBAR_CLASS = "dx-richtexteditor-toolbar";
const TOOLBAR_FORMAT_WIDGET_CLASS = "dx-richtexteditor-toolbar-format";

const moduleConfig = {
    beforeEach: () => {
        this.$element = $("#richTextEditor");
        this.log = [];
        this.quillMock = {
            format: (format, value) => {
                this.log.push({ format: format, value: value });
            },
            on: noop,
            off: noop,
            getSelection: noop,
            getFormat: noop
        };

        this.defaultOptions = {
            editorInstance: {
                $element: () => {
                    return this.$element;
                },
                _createComponent: ($element, widget, options) => {
                    new widget($element, options);
                }
            }
        };
    }
};

const { test } = QUnit;

QUnit.module("Toolbar module", moduleConfig, () => {
    test("Render toolbar without any options", (assert) => {
        new Toolbar(this.quillMock, this.defaultOptions);

        assert.notOk(this.$element.hasClass(TOOLBAR_CLASS), "Toolbar rendered not on the root element");
        assert.notOk(this.$element.children().hasClass(TOOLBAR_CLASS), "Toolbar isn't render inside the root element (no items)");
        assert.equal(this.$element.find("." + TOOLBAR_FORMAT_WIDGET_CLASS).length, 0, "There are no format widgets");
    });

    test("Render toolbar with items", (assert) => {
        this.defaultOptions.items = ["bold"];
        new Toolbar(this.quillMock, this.defaultOptions);

        assert.notOk(this.$element.hasClass(TOOLBAR_CLASS), "Toolbar rendered not on the root element");
        assert.ok(this.$element.children().hasClass(TOOLBAR_CLASS), "Toolbar render inside the root element");
        assert.equal(this.$element.find("." + TOOLBAR_FORMAT_WIDGET_CLASS).length, 1, "There is one format widget");
    });

    test("Render toolbar on custom container", (assert) => {
        this.defaultOptions.items = ["bold"];
        this.defaultOptions.container = this.$element;
        new Toolbar(this.quillMock, this.defaultOptions);

        assert.ok(this.$element.hasClass(TOOLBAR_CLASS), "Toolbar rendered on the custom element");
    });

    test("Render toolbar with simple formats", (assert) => {
        this.defaultOptions.items = ["bold", "strike"];

        new Toolbar(this.quillMock, this.defaultOptions);

        assert.equal(this.$element.find("." + TOOLBAR_FORMAT_WIDGET_CLASS).length, 2, "There are 2 format widgets");
    });

    test("Simple format handling", (assert) => {
        let isHandlerTriggered;
        this.quillMock.getFormat = () => {
            return { bold: false };
        };
        this.defaultOptions.items = ["bold", {
            format: "strike",
            widget: "dxButton",
            options: {
                onClick: () => {
                    isHandlerTriggered = true;
                }
            }
        }];

        new Toolbar(this.quillMock, this.defaultOptions);

        const $formatWidgets = this.$element.find("." + TOOLBAR_FORMAT_WIDGET_CLASS);

        $formatWidgets.eq(0).trigger("dxclick");
        $formatWidgets.eq(1).trigger("dxclick");

        assert.deepEqual(this.log[0], { format: "bold", value: true });
        assert.ok(isHandlerTriggered, "Custom handler triggered");
    });
});
