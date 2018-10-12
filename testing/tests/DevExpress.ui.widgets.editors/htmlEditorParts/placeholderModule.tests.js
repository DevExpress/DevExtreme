import $ from "jquery";

import PlaceholderFormat from "ui/html_editor/formats/placeholder";
import DataPlaceholder from "ui/html_editor/modules/placeholder";
import { noop } from "core/utils/common";

const SUGGESTION_LIST_CLASS = "dx-suggestion-list";

const moduleConfig = {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();

        this.$element = $("#htmlEditor");

        this.log = [];
        this._keyBindingStub = sinon.stub();

        this.quillMock = {
            insertEmbed: (position, format, value) => {
                this.log.push({ position: position, format: format, value: value });
            },
            keyboard: {
                addBinding: this._keyBindingStub
            },
            getLength: () => 0,
            getBounds: () => { return { left: 0, bottom: 0 }; },
            root: this.$element.get(0),
            getModule: noop,
            getSelection: noop,
            setSelection: noop,
            getFormat: noop
        };

        this.options = {
            dataSource: ["TEST_NAME", "TEST_COMPANY"],
            editorInstance: {
                $element: () => {
                    return this.$element;
                },
                _createComponent: ($element, widget, options) => {
                    return new widget($element, options);
                }
            }
        };
    },
    afterEach: () => {
        this.clock.reset();
    }
};

const { test } = QUnit;

QUnit.module("Placeholder format", () => {
    test("Create an element by data", (assert) => {
        const data = {
            value: "TEST_NAME",
            escapedChar: "@"
        };
        const element = PlaceholderFormat.create(data);

        assert.equal(element.dataset.placeholderEscChar, "@", "correct escaped char");
        assert.equal(element.dataset.placeholderValue, "TEST_NAME", "correct inner text");
        assert.notOk(element.dataset.placeholderStartChar, "There is no start char");
        assert.notOk(element.dataset.placeholderEndChar, "There is no end char");
        assert.equal(element.innerText, "@TEST_NAME@", "correct inner text");
    });

    test("Create an element with default escaped char", (assert) => {
        const data = {
            value: "TEST_NAME",
            escapedChar: ""
        };
        const element = PlaceholderFormat.create(data);

        assert.equal(element.dataset.placeholderEscChar, "", "correct escaped char");
        assert.equal(element.dataset.placeholderValue, "TEST_NAME", "correct inner text");
        assert.notOk(element.dataset.placeholderStartChar, "There is no start char");
        assert.notOk(element.dataset.placeholderEndChar, "There is no end char");
        assert.equal(element.innerText, "TEST_NAME", "correct inner text");
    });

    test("Create an element with start escaping char", (assert) => {
        const data = {
            value: "TEST_NAME",
            escapedChar: "",
            startEscapedChar: "{"
        };
        const element = PlaceholderFormat.create(data);

        assert.equal(element.dataset.placeholderEscChar, "", "correct escaped char");
        assert.equal(element.dataset.placeholderValue, "TEST_NAME", "correct inner text");
        assert.equal(element.dataset.placeholderStartChar, "{", "There is no start char");
        assert.notOk(element.dataset.placeholderEndChar, "There is no end char");
        assert.equal(element.innerText, "{TEST_NAME", "correct inner text");
    });

    test("Create an element with end escaping char", (assert) => {
        const data = {
            value: "TEST_NAME",
            escapedChar: "",
            endEscapedChar: "}"
        };
        const element = PlaceholderFormat.create(data);

        assert.equal(element.dataset.placeholderEscChar, "", "correct escaped char");
        assert.equal(element.dataset.placeholderValue, "TEST_NAME", "correct inner text");
        assert.notOk(element.dataset.placeholderStartChar, "There is no start char");
        assert.equal(element.dataset.placeholderEndChar, "}", "There is no end char");
        assert.equal(element.innerText, "TEST_NAME}", "correct inner text");
    });

    test("Create an element with start, end and default escaping char", (assert) => {
        const data = {
            value: "TEST_NAME",
            startEscapedChar: "{",
            endEscapedChar: "}",
            escapedChar: "@"
        };
        const element = PlaceholderFormat.create(data);

        assert.equal(element.dataset.placeholderEscChar, "@", "correct escaped char");
        assert.equal(element.dataset.placeholderValue, "TEST_NAME", "correct inner text");
        assert.equal(element.dataset.placeholderStartChar, "{", "There is no start char");
        assert.equal(element.dataset.placeholderEndChar, "}", "There is no end char");
        assert.equal(element.innerText, "{TEST_NAME}", "correct inner text");
    });

    test("Get data from element", (assert) => {
        const markup = "<span class='dx-data-placeholder' data-placeholder-esc-char=## data-placeholder-value=TEST_NAME><span>##TEST_NAME##</span></span>";
        const element = $(markup).get(0);
        const data = PlaceholderFormat.value(element);

        assert.deepEqual(data, { value: "TEST_NAME", escapedChar: "##" }, "Correct data");
    });
});

QUnit.module("Placeholder module", moduleConfig, () => {
    test("Render toolbar without any options", (assert) => {
        this.options.escapedChar = "#";
        const dataPlaceholder = new DataPlaceholder(this.quillMock, this.options);

        dataPlaceholder.showPopover();
        $(`.${SUGGESTION_LIST_CLASS} .dx-item`).first().trigger("dxclick");

        this.clock.tick();

        assert.deepEqual(this.log, [{
            format: "placeholder",
            position: 0,
            value: {
                escapedChar: "#",
                value: "TEST_NAME"
            }
        }], "Correct formatting");
    });

});
