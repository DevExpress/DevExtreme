import $ from "jquery";

import "ui/select_box";
import "ui/color_box/color_view";
import Toolbar from "ui/html_editor/modules/toolbar";
import FormDialog from "ui/html_editor/ui/formDialog";
import { noop } from "core/utils/common";
import keyboardMock from "../../../helpers/keyboardMock.js";

const TOOLBAR_CLASS = "dx-htmleditor-toolbar";
const TOOLBAR_FORMAT_WIDGET_CLASS = "dx-htmleditor-toolbar-format";
const FORM_CLASS = "dx-formdialog-form";
const FIELD_ITEM_CLASS = "dx-field-item";
const FIELD_ITEM_LABEL_CLASS = "dx-field-item-label-text";
const SELECTBOX_CLASS = "dx-selectbox";
const COLORVIEW_CLASS = "dx-colorview";
const COLOR_VIEW_HEX_FIELD_CLASS = "dx-colorview-label-hex";
const TEXTEDITOR_INPUT_CLASS = "dx-texteditor-input";
const DIALOG_CLASS = "dx-formdialog";
const BUTTON_WITH_TEXT_CLASS = "dx-button-has-text";

const simpleModuleConfig = {
    beforeEach: () => {
        this.$element = $("#htmlEditor");
        this.log = [];
        this.quillMock = {
            format: (format, value) => {
                this.log.push({ format: format, value: value });
            },
            on: noop,
            off: noop,
            getSelection: noop,
            getFormat: () => {}
        };

        this.options = {
            editorInstance: {
                $element: () => {
                    return this.$element;
                },
                _createComponent: ($element, widget, options) => {
                    return new widget($element, options);
                },
                on: noop
            }
        };
    }
};

const dialogModuleConfig = {
    beforeEach: () => {
        this.$element = $("#htmlEditor");
        this.log = [];
        this.quillMock = {
            format: (format, value) => {
                this.log.push({ format: format, value: value });
            },
            insertText: (index, text, formats) => {
                this.log.push({ index: index, text: text, formats: formats });
            },
            insertEmbed: (index, type, value) => {
                this.log.push({ index: index, type: type, value: value });
            },
            on: noop,
            off: noop,
            getSelection: noop,
            getFormat: () => { return {}; },
            getLength: () => { return 1; }
        };
        this.formDialogOptionStub = sinon.stub();

        this.options = {
            editorInstance: {
                $element: () => {
                    return this.$element;
                },
                _createComponent: ($element, widget, options) => {
                    return new widget($element, options);
                },
                on: noop,
                formDialogOption: this.formDialogOptionStub,
                showFormDialog: (formConfig) => {
                    return this.formDialog.show(formConfig);
                }
            }
        };

        this.formDialog = new FormDialog(this.options.editorInstance, { container: this.$element });
    }
};

const { test } = QUnit;

QUnit.module("Toolbar module", simpleModuleConfig, () => {
    test("Render toolbar without any options", (assert) => {
        new Toolbar(this.quillMock, this.options);

        assert.notOk(this.$element.hasClass(TOOLBAR_CLASS), "Toolbar rendered not on the root element");
        assert.notOk(this.$element.children().hasClass(TOOLBAR_CLASS), "Toolbar isn't render inside the root element (no items)");
        assert.equal(this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`).length, 0, "There are no format widgets");
    });

    test("Render toolbar with items", (assert) => {
        this.options.items = ["bold"];
        new Toolbar(this.quillMock, this.options);

        assert.notOk(this.$element.hasClass(TOOLBAR_CLASS), "Toolbar rendered not on the root element");
        assert.ok(this.$element.children().hasClass(TOOLBAR_CLASS), "Toolbar render inside the root element");
        assert.equal(this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`).length, 1, "There is one format widget");
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
        const $formatWidgets = this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);

        assert.equal($formatWidgets.length, 2, "There are 2 format widgets");
        assert.ok($formatWidgets.first().hasClass("dx-button"), "Change simple format via Button");
    });

    test("Simple format handling", (assert) => {
        let isHandlerTriggered;
        this.quillMock.getFormat = () => {
            return { bold: false };
        };
        this.options.items = ["bold", {
            formatName: "strike",
            widget: "dxButton",
            options: {
                onClick: () => {
                    isHandlerTriggered = true;
                }
            }
        }];

        new Toolbar(this.quillMock, this.options);

        const $formatWidgets = this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);

        $formatWidgets.eq(0).trigger("dxclick");
        $formatWidgets.eq(1).trigger("dxclick");

        assert.deepEqual(this.log[0], { format: "bold", value: true });
        assert.ok(isHandlerTriggered, "Custom handler triggered");
    });

    test("Render toolbar with enum format", (assert) => {
        this.options.items = [{ formatName: "header", formatValues: [1, 2, 3, false] }];

        new Toolbar(this.quillMock, this.options);
        const $formatWidget = this.$element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);

        assert.ok($formatWidget.hasClass(SELECTBOX_CLASS), "Change enum format via SelectBox");
    });
});

QUnit.module("Toolbar dialogs", dialogModuleConfig, () => {
    test("show color dialog", (assert) => {
        this.options.items = ["color"];
        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger("dxclick");

        const $form = $(`.${FORM_CLASS}`);
        const $colorView = $form.find(`.${COLORVIEW_CLASS}`);
        const $hexValueInput = $colorView.find(`.${COLOR_VIEW_HEX_FIELD_CLASS} .${TEXTEDITOR_INPUT_CLASS}`);

        assert.equal($form.length, 1, "Form shown");
        assert.equal($colorView.length, 1, "Form contains ColorView");
        assert.equal($hexValueInput.val(), "000000", "Base value");
    });

    test("show color dialog when formatted text selected", (assert) => {
        this.options.items = ["color"];
        this.quillMock.getFormat = () => { return { color: "#fafafa" }; };

        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger("dxclick");

        const $colorView = $(`.${FORM_CLASS} .${COLORVIEW_CLASS}`);
        const $hexValueInput = $colorView.find(`.${COLOR_VIEW_HEX_FIELD_CLASS} .${TEXTEDITOR_INPUT_CLASS}`);

        assert.equal($hexValueInput.val(), "fafafa", "Selected text color");
    });

    test("change color", (assert) => {
        this.options.items = ["color"];

        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger("dxclick");

        const $colorView = $(`.${FORM_CLASS} .${COLORVIEW_CLASS}`);
        const $hexValueInput = $colorView.find(`.${COLOR_VIEW_HEX_FIELD_CLASS} .${TEXTEDITOR_INPUT_CLASS}`);

        $hexValueInput.val("");
        keyboardMock($hexValueInput)
            .type("fafafa")
            .change();

        $(`.${DIALOG_CLASS} .${BUTTON_WITH_TEXT_CLASS}`)
            .first()
            .trigger("dxclick");

        assert.deepEqual(this.log, [{ format: "color", value: "#fafafa" }], "format method with the right arguments");
    });

    test("show background dialog", (assert) => {
        this.options.items = ["background"];
        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger("dxclick");

        const $form = $(`.${FORM_CLASS}`);
        const $colorView = $form.find(`.${COLORVIEW_CLASS}`);
        const $hexValueInput = $colorView.find(`.${COLOR_VIEW_HEX_FIELD_CLASS} .${TEXTEDITOR_INPUT_CLASS}`);

        assert.equal($form.length, 1, "Form shown");
        assert.equal($colorView.length, 1, "Form contains ColorView");
        assert.equal($hexValueInput.val(), "000000", "Base value");
    });

    test("show background dialog when formatted text selected", (assert) => {
        this.options.items = ["background"];
        this.quillMock.getFormat = () => { return { background: "#fafafa" }; };

        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger("dxclick");

        const $colorView = $(`.${FORM_CLASS} .${COLORVIEW_CLASS}`);
        const $hexValueInput = $colorView.find(`.${COLOR_VIEW_HEX_FIELD_CLASS} .${TEXTEDITOR_INPUT_CLASS}`);

        assert.equal($hexValueInput.val(), "fafafa", "Selected background color");
    });

    test("change background", (assert) => {
        this.options.items = ["background"];

        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger("dxclick");

        const $colorView = $(`.${FORM_CLASS} .${COLORVIEW_CLASS}`);
        const $hexValueInput = $colorView.find(`.${COLOR_VIEW_HEX_FIELD_CLASS} .${TEXTEDITOR_INPUT_CLASS}`);

        $hexValueInput.val("");
        keyboardMock($hexValueInput)
            .type("fafafa")
            .change();

        $(`.${DIALOG_CLASS} .${BUTTON_WITH_TEXT_CLASS}`)
            .first()
            .trigger("dxclick");

        assert.deepEqual(this.log, [{ format: "background", value: "#fafafa" }], "format method with the right arguments");
    });

    test("show image dialog", (assert) => {
        this.options.items = ["image"];
        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger("dxclick");

        const $form = $(`.${FORM_CLASS}`);
        const $fields = $form.find(`.${FIELD_ITEM_CLASS}`);
        const fieldsText = $form.find(`.${FIELD_ITEM_LABEL_CLASS}`).text();

        assert.equal($fields.length, 4, "Form with 4 fields shown");
        assert.equal(fieldsText, "URL:Width (px):Height (px):Alternate text:", "Check labels");

    });

    test("show image dialog when an image selected", (assert) => {
        this.quillMock.getFormat = () => {
            return {
                src: "http://test.com/test.jpg",
                width: 100,
                height: 100
            };
        };
        this.options.items = ["image"];
        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger("dxclick");

        const $fieldInputs = $(`.${FIELD_ITEM_CLASS} .${TEXTEDITOR_INPUT_CLASS}`);

        assert.equal($fieldInputs.eq(0).val(), "http://test.com/test.jpg", "URL");
        assert.equal($fieldInputs.eq(1).val(), "100", "Width");
        assert.equal($fieldInputs.eq(2).val(), "100", "Height");
    });

    test("change an image formatting", (assert) => {
        this.options.items = ["image"];
        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger("dxclick");

        const $fieldInputs = $(`.${FIELD_ITEM_CLASS} .${TEXTEDITOR_INPUT_CLASS}`);

        keyboardMock($fieldInputs.eq(0))
            .type("http://test.com/test.jpg")
            .change();

        keyboardMock($fieldInputs.eq(1))
            .type("100")
            .change();

        keyboardMock($fieldInputs.eq(2))
            .type("100")
            .change();

        keyboardMock($fieldInputs.eq(3))
            .type("Alternate")
            .change()
            .press("enter");

        assert.deepEqual(this.log, [{
            index: 1,
            type: "image",
            value: {
                alt: "Alternate",
                height: "100",
                src: "http://test.com/test.jpg",
                width: "100"
            }
        }], "expected insert new image config");
    });

    test("show link dialog", (assert) => {
        this.options.items = ["link"];
        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger("dxclick");

        const $form = $(`.${FORM_CLASS}`);
        const $fields = $form.find(`.${FIELD_ITEM_CLASS}`);
        const fieldsText = $form.find(`.${FIELD_ITEM_LABEL_CLASS}`).text();

        assert.equal($fields.length, 4, "Form with 4 fields shown");
        assert.equal(fieldsText, "URL:Text:Hint:Open text in new window:", "Check labels");
    });

    test("show link dialog when a link selected", (assert) => {
        this.quillMock.getFormat = () => {
            return {
                link: {
                    href: "http://test.com",
                    target: true,
                    text: "Test",
                    title: "Hint text"
                }
            };
        };
        this.options.items = ["link"];
        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger("dxclick");

        const $fieldInputs = $(`.${FIELD_ITEM_CLASS} .${TEXTEDITOR_INPUT_CLASS}`);

        assert.equal($fieldInputs.eq(0).val(), "http://test.com", "URL");
        assert.equal($fieldInputs.eq(1).val(), "Test", "Text");
        assert.equal($fieldInputs.eq(2).val(), "Hint text", "Hint");
    });

    test("change an link formatting", (assert) => {
        this.options.items = ["link"];
        new Toolbar(this.quillMock, this.options);
        this.$element
            .find(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`)
            .trigger("dxclick");

        const $fieldInputs = $(`.${FIELD_ITEM_CLASS} .${TEXTEDITOR_INPUT_CLASS}`);

        keyboardMock($fieldInputs.eq(0))
            .type("http://test.com")
            .change();

        keyboardMock($fieldInputs.eq(1))
            .type("Test")
            .change();

        keyboardMock($fieldInputs.eq(2))
            .type("Hint text")
            .change()
            .press("enter");

        assert.deepEqual(this.log, [{
            format: "link",
            value: {
                href: "http://test.com",
                target: true,
                text: "Test",
                title: "Hint text"
            }
        }], "expected format config");
    });
});
