import $ from "jquery";

import "ui/html_editor";

const { test } = QUnit;

const TOOLBAR_FORMAT_WIDGET_CLASS = "dx-htmleditor-toolbar-format";

const moduleConfig = {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();

        this.options = {
            value: "<p>Test 1</p><p>Test 2</p><p>Test 3</p>"
        };

        this.createEditor = () => {
            this.instance = $("#htmlEditor")
                .dxHtmlEditor(this.options)
                .dxHtmlEditor("instance");
        };
    },
    afterEach: () => {
        this.clock.restore();
    }
};

QUnit.module("API", moduleConfig, () => {
    test("get registered module", (assert) => {
        this.createEditor();
        const Bold = this.instance.get("formats/bold");

        assert.ok(Bold, "module is defined");
        assert.strictEqual(Bold.blotName, "bold", "we get correct blot");
    });

    test("get registered module on init", (assert) => {
        assert.expect(2);
        this.options.onInitialized = ({ component }) => {
            const Bold = component.get("formats/bold");

            assert.ok(Bold, "module is defined");
            assert.strictEqual(Bold.blotName, "bold", "we get correct blot");
        };
        this.createEditor();
    });

    test("get quill instance", (assert) => {
        this.createEditor();
        const quillInstance = this.instance.getQuillInstance();

        assert.ok(quillInstance, "instance isn't undefined");
        assert.ok(quillInstance.format, "specific method isn't undefined");
    });

    test("get/set selection", (assert) => {
        this.createEditor();
        this.instance.setSelection(1, 2);
        const selection = this.instance.getSelection();

        assert.strictEqual(selection.index, 1, "Correct index");
        assert.strictEqual(selection.length, 2, "Correct length");
    });

    test("format", (assert) => {
        this.createEditor();
        this.instance.setSelection(1, 2);
        this.instance.format("bold", true);

        assert.strictEqual(this.instance.option("value"), "<p>T<strong>es</strong>t 1</p><p>Test 2</p><p>Test 3</p>", "format applied");
    });

    test("formatText", (assert) => {
        this.createEditor();
        const expected = "<h1>T<strong>est 1</strong></h1><p><strong>Tes</strong>t 2</p><p>Test 3</p>";
        this.instance.formatText(1, 9, {
            bold: true, // inline format
            header: 1 // block format
        });

        assert.strictEqual(
            this.instance.option("value"), expected, "block format applies for the first line only");
    });

    test("formatLine", (assert) => {
        this.createEditor();
        this.instance.formatLine(1, 9, {
            bold: true, // inline format
            header: 1 // block format
        });

        assert.strictEqual(this.instance.option("value"), "<h1>Test 1</h1><h1>Test 2</h1><p>Test 3</p>", "just block format applied");
    });

    test("getFormat", (assert) => {
        this.createEditor();
        this.instance.option("value", "<p><b>Test Test</b></p>");

        const format = this.instance.getFormat(1, 2);
        assert.deepEqual(format, { bold: true }, "correct format");
    });

    test("removeFormat", (assert) => {
        this.createEditor();
        this.instance.option("value", "<p><b>Test Test</b></p>");
        this.instance.removeFormat(1, 2);

        assert.strictEqual(this.instance.option("value"), "<p><strong>T</strong>es<strong>t Test</strong></p>", "remove format from specific range");
    });

    test("getLength", (assert) => {
        this.createEditor();
        const length = this.instance.getLength();
        const LINE_WIDTH = 7; // 6 chars + the new line char

        assert.strictEqual(length, LINE_WIDTH * 3, "correct format");
    });

    test("delete", (assert) => {
        this.createEditor();
        this.instance.delete(1, 7);

        assert.strictEqual(this.instance.option("value"), "<p>Test 2</p><p>Test 3</p>", "custom range removed");
    });

    test("insertText", (assert) => {
        this.createEditor();
        this.instance.insertText(1, "one");
        this.instance.insertText(6, "two", { italic: true });

        assert.strictEqual(this.instance.option("value"), "<p>Tonees<em>two</em>t 1</p><p>Test 2</p><p>Test 3</p>", "insert simple and formatted text");
    });

    test("insertEmbed", (assert) => {
        this.createEditor();
        const expected = '<p>T<span class="dx-variable" data-var-start-esc-char="#" data-var-end-esc-char="#"' +
            ' data-var-value="template"><span contenteditable="false">#template#</span></span>est 1</p><p>Test 2</p><p>Test 3</p>';
        this.instance.insertEmbed(1, "variable", { value: "template", escapeChar: "#" });

        assert.strictEqual(this.instance.option("value").replace(/\uFEFF/g, ""), expected, "insert embed");
    });

    test("undo/redo", (assert) => {
        this.createEditor();
        this.instance.insertText(0, "a");
        this.clock.tick(1000);
        this.instance.insertText(0, "b");
        this.clock.tick(1000);
        this.instance.insertText(0, "c");
        this.clock.tick(1000);

        this.instance.undo();

        assert.strictEqual(this.instance.option("value"), "<p>baTest 1</p><p>Test 2</p><p>Test 3</p>", "undo operation");

        this.instance.redo();
        assert.strictEqual(this.instance.option("value"), "<p>cbaTest 1</p><p>Test 2</p><p>Test 3</p>", "redo operation");
    });

    test("clearHistory", (assert) => {
        this.createEditor();
        this.instance.insertText(0, "a");
        this.clock.tick(1000);
        this.instance.insertText(0, "b");
        this.clock.tick(1000);
        this.instance.insertText(0, "c");
        this.clock.tick(1000);

        this.instance.clearHistory();
        this.instance.undo();

        assert.strictEqual(this.instance.option("value"), "<p>cbaTest 1</p><p>Test 2</p><p>Test 3</p>", "history is empty");
    });

    test("registerModule", (assert) => {
        class Test {
            constructor(quillInstance, options) {
                this._editorInstance = options.editorInstance;
            }

            getEditor() {
                return this._editorInstance;
            }
        }

        this.createEditor();
        this.instance.register({ "modules/test": Test });

        const testModule = this.instance.getQuillInstance().getModule("test");

        assert.ok(testModule);
        assert.strictEqual(testModule.getEditor(), this.instance);
    });

    test("registerModule on init", (assert) => {
        class Test {
            constructor(quillInstance, options) {
                this._editorInstance = options.editorInstance;
            }

            getEditor() {
                return this._editorInstance;
            }
        }

        this.options.onInitialized = ({ component }) => {
            component.register({ "modules/testInit": Test });
        };
        this.createEditor();

        const testModule = this.instance.getQuillInstance().getModule("testInit");

        assert.ok(testModule);
        assert.strictEqual(testModule.getEditor(), this.instance);
    });

    test("'focus' method should call the quill's focus", (assert) => {
        this.createEditor();
        const focusSpy = sinon.spy(this.instance.getQuillInstance(), "focus");

        this.instance.focus();

        assert.ok(focusSpy.calledOnce, "Quill focus() should triggered on the editor's focus()");
    });

    test("change value via 'option' method should correctly update content", (assert) => {
        this.createEditor();
        const valueChangeStub = sinon.stub();
        const updateContentSpy = sinon.spy(this.instance, "_updateHtmlContent");

        this.instance.on("valueChanged", valueChangeStub);
        this.instance.option("value", "<p>First row</p><p>Second row</p>");
        this.clock.tick();
        this.instance.option("value", "New text");
        this.clock.tick();

        assert.strictEqual(valueChangeStub.lastCall.args[0].value, "New text");
        assert.strictEqual(updateContentSpy.callCount, 2, "value changed twice -> update content two times");
        assert.strictEqual(updateContentSpy.lastCall.args[0], "New text", "Update content with the new value");
    });

    test("customize module", (assert) => {
        this.options.customizeModules = function({ toolbar }) {
            toolbar.items.push("italic");
        };

        this.options.toolbar = { items: ["bold"] };
        this.createEditor();

        const $toolbarItems = $(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);
        assert.strictEqual($toolbarItems.length, 2, "second item has been added");
        assert.strictEqual($toolbarItems.text(), "BoldItalic", "expected items order");
    });

    test("customize custom module", (assert) => {
        assert.expect(1);
        class Test {
            constructor(quillInstance, { customOption }) {
                assert.strictEqual(customOption, 3, "instance creates with custom options");
            }
        }

        this.options.customizeModules = function({ testWithOptions }) {
            if(testWithOptions) {
                testWithOptions.customOption = 3;
            }
        };

        this.createEditor();
        this.instance.register({ "modules/testWithOptions": Test });
    });
});
