import $ from "jquery";

import "ui/select_box";
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

        this.options = {
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
        new Toolbar(this.quillMock, this.options);

        assert.notOk(this.$element.hasClass(TOOLBAR_CLASS), "Toolbar rendered not on the root element");
        assert.notOk(this.$element.children().hasClass(TOOLBAR_CLASS), "Toolbar isn't render inside the root element (no items)");
        assert.equal(this.$element.find("." + TOOLBAR_FORMAT_WIDGET_CLASS).length, 0, "There are no format widgets");
    });

    test("Render toolbar with items", (assert) => {
        this.options.items = ["bold"];
        new Toolbar(this.quillMock, this.options);

        assert.notOk(this.$element.hasClass(TOOLBAR_CLASS), "Toolbar rendered not on the root element");
        assert.ok(this.$element.children().hasClass(TOOLBAR_CLASS), "Toolbar render inside the root element");
        assert.equal(this.$element.find("." + TOOLBAR_FORMAT_WIDGET_CLASS).length, 1, "There is one format widget");
    });

    test("Render toolbar on custom container", (assert) => {
        this.options.items = ["bold"];
        this.options.container = this.$element;
        new Toolbar(this.quillMock, this.options);

        assert.ok(this.$element.hasClass(TOOLBAR_CLASS), "Toolbar rendered on the custom element");
    });

    test("Render toolbar with simple formats", (assert) => {
        this.options.items = ["bold", "strike"];

        new Toolbar(this.quillMock, this.options);
        const $formatWidgets = this.$element.find("." + TOOLBAR_FORMAT_WIDGET_CLASS);

        assert.equal($formatWidgets.length, 2, "There are 2 format widgets");
        assert.ok($formatWidgets.first().hasClass("dx-button"), "Change simple format via Button");
    });

    test("Simple format handling", (assert) => {
        let isHandlerTriggered;
        this.quillMock.getFormat = () => {
            return { bold: false };
        };
        this.options.items = ["bold", {
            format: "strike",
            widget: "dxButton",
            options: {
                onClick: () => {
                    isHandlerTriggered = true;
                }
            }
        }];

        new Toolbar(this.quillMock, this.options);

        const $formatWidgets = this.$element.find("." + TOOLBAR_FORMAT_WIDGET_CLASS);

        $formatWidgets.eq(0).trigger("dxclick");
        $formatWidgets.eq(1).trigger("dxclick");

        assert.deepEqual(this.log[0], { format: "bold", value: true });
        assert.ok(isHandlerTriggered, "Custom handler triggered");
    });

    test("Render toolbar with enum format", (assert) => {
        this.options.items = [{ format: "header", items: [1, 2, 3, false] }];

        new Toolbar(this.quillMock, this.options);
        const $formatWidget = this.$element.find("." + TOOLBAR_FORMAT_WIDGET_CLASS);

        assert.ok($formatWidget.first().hasClass("dx-selectbox"), "Change enum format via SelectBox");
    });
});
