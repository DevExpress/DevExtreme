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

        const repaintSpy = sinon.spy(this.instance, "repaint");
        this.instance.register({ "modules/test": Test });

        const testModule = this.instance.getQuillInstance().getModule("test");

        assert.ok(testModule);
        assert.ok(repaintSpy.calledOnce, "repaint is called when the module is registered after creating the quill instance");
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

        let repaintSpy;

        this.options.onInitialized = ({ component }) => {
            repaintSpy = sinon.spy(component, "repaint");
            component.register({ "modules/testInit": Test });
        };
        this.createEditor();

        const testModule = this.instance.getQuillInstance().getModule("testInit");

        assert.ok(testModule);
        assert.ok(repaintSpy.notCalled, "repaint isn't called when the module is registered at the initialization");
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

    test("onContentReady should trigger after processing transcluded content", (assert) => {
        const initialMarkup = "<custom-tag></custom-tag><h1>Hi!</h1><p>Test         </p>";
        const expectedValue = "<h1>Hi!</h1><p>Test</p>";

        $("#htmlEditor").html(initialMarkup);
        this.options = {
            onContentReady: ({ component }) => {
                assert.strictEqual(component.option("value"), expectedValue, "value is synchronized with the transcluded content");
            }
        };
        this.createEditor();

        this.clock.tick();
    });

    test("onContentReady event should trigger after editor without transcluded content rendered", (assert) => {
        this.options.onContentReady = sinon.stub();
        this.createEditor();

        this.clock.tick();
        assert.ok(this.options.onContentReady.calledOnce, "onContentReady has been called once");
    });

    test("empty editor should trigger onContentReady event", (assert) => {
        this.options = { onContentReady: sinon.stub() };
        this.createEditor();

        this.clock.tick();
        assert.ok(this.options.onContentReady.calledOnce, "onContentReady has been called once");
    });

    test("editor with invalid transcluded content should trigger onContentReady event", (assert) => {
        $("#htmlEditor").html("<test><custom-tag></custom-tag></test>");
        this.options = { onContentReady: sinon.stub() };
        this.createEditor();

        this.clock.tick();
        assert.ok(this.options.onContentReady.calledOnce, "onContentReady has been called once");
    });
});

QUnit.module("Private API", moduleConfig, () => {
    test("cleanCallback should trigger on refresh", (assert) => {
        const cleanCallback = sinon.stub();

        this.createEditor();
        this.instance.addCleanCallback(cleanCallback);

        this.instance.repaint();
        assert.ok(cleanCallback.calledOnce, "callback is called on refresh");

        this.instance.repaint();
        assert.ok(cleanCallback.calledOnce, "callbacks has been removed after clean");

        this.instance.addCleanCallback(cleanCallback);
        this.instance.dispose();
        assert.ok(cleanCallback.calledTwice, "callback is called on dispose");
    });

    test("contentInitialized callback should trigger after content was initialized by Quill but before ContentReady event", (assert) => {
        const contentInitializedCallback = () => {
            assert.ok(contentReadyHandler.notCalled, "ContentReady event isn't trigger yet");
        };
        const contentReadyHandler = sinon.stub();

        this.options.onInitialized = ({ component }) => {
            component.addContentInitializedCallback(contentInitializedCallback);
        };
        this.options.onContentReady = contentReadyHandler;
        this.createEditor();

        this.instance.repaint();
    });

    test("contentInitialized callback should been removed on widget repaint", (assert) => {
        const contentInitializedCallback = sinon.stub();

        this.options.onInitialized = ({ component }) => {
            component.addContentInitializedCallback(contentInitializedCallback);
        };
        this.createEditor();

        assert.ok(contentInitializedCallback.calledOnce, "contentInitialized was called once");
        this.instance.repaint();
        assert.ok(contentInitializedCallback.calledOnce, "contentInitialized wasn't called twice");
    });
});
