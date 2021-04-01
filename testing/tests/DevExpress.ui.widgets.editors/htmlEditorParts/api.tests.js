import $ from 'jquery';

import 'ui/html_editor';
import { prepareTableValue } from './utils.js';
import { isObject } from 'core/utils/type';

const { test, module: testModule } = QUnit;

const TOOLBAR_FORMAT_WIDGET_CLASS = 'dx-htmleditor-toolbar-format';

const moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.options = {
            value: '<p>Test 1</p><p>Test 2</p><p>Test 3</p>'
        };

        this.createEditor = () => {
            this.instance = $('#htmlEditor')
                .dxHtmlEditor(this.options)
                .dxHtmlEditor('instance');
        };
    },
    afterEach: function() {
        this.clock.restore();
    }
};

const moduleConfigWithTable = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.options = {
            value: '<table><tr><td>1</td><td>2</td></tr><tr><td>3</td><td>4</td></tr></table>'
        };

        this.createEditor = () => {
            this.instance = $('#htmlEditor')
                .dxHtmlEditor(this.options)
                .dxHtmlEditor('instance');
        };

        this.applyTableMethod = (methodName, ...restArgs) => {
            return this.instance && this.instance.getModule('table')[methodName](...restArgs);
        };

        this.getValue = () => prepareTableValue(this.instance.option('value'));
    },
    afterEach: function() {
        this.clock.restore();
    }
};

testModule('API', moduleConfig, () => {
    test('get registered module', function(assert) {
        this.createEditor();
        const Bold = this.instance.get('formats/bold');

        assert.ok(Bold, 'module is defined');
        assert.strictEqual(Bold.blotName, 'bold', 'we get correct blot');
    });

    test('get registered module on init', function(assert) {
        assert.expect(2);
        this.options.onInitialized = ({ component }) => {
            const Bold = component.get('formats/bold');

            assert.ok(Bold, 'module is defined');
            assert.strictEqual(Bold.blotName, 'bold', 'we get correct blot');
        };
        this.createEditor();
    });

    test('get quill instance', function(assert) {
        this.createEditor();
        const quillInstance = this.instance.getQuillInstance();

        assert.ok(quillInstance, 'instance isn\'t undefined');
        assert.ok(quillInstance.format, 'specific method isn\'t undefined');
    });

    test('get module instance', function(assert) {
        this.createEditor();
        const Clipboard = this.instance.get('modules/clipboard');
        const clipboardInstance = this.instance.getModule('clipboard');

        assert.ok(clipboardInstance, 'module instance is not undefined');
        assert.ok(clipboardInstance instanceof Clipboard, 'module is instance of the Clipboard class');
    });

    test('get/set selection', function(assert) {
        this.createEditor();
        this.instance.setSelection(1, 2);
        const selection = this.instance.getSelection();

        assert.strictEqual(selection.index, 1, 'Correct index');
        assert.strictEqual(selection.length, 2, 'Correct length');
    });

    test('quill getSelection gets correct arguments', function(assert) {
        this.createEditor();
        const getSelectionSpy = sinon.spy(this.instance.getQuillInstance(), 'getSelection');
        this.instance.getSelection(true);

        assert.deepEqual(getSelectionSpy.lastCall.args[0], true, 'Quill getSelection() gets correct arguments');
    });

    test('format', function(assert) {
        this.createEditor();
        this.instance.setSelection(1, 2);
        this.instance.format('bold', true);

        assert.strictEqual(this.instance.option('value'), '<p>T<strong>es</strong>t 1</p><p>Test 2</p><p>Test 3</p>', 'format applied');
    });

    test('formatText', function(assert) {
        this.createEditor();
        const expected = '<h1>T<strong>est 1</strong></h1><p><strong>Tes</strong>t 2</p><p>Test 3</p>';
        this.instance.formatText(1, 9, {
            bold: true, // inline format
            header: 1 // block format
        });

        assert.strictEqual(
            this.instance.option('value'), expected, 'block format applies for the first line only');
    });

    test('formatLine', function(assert) {
        this.createEditor();
        this.instance.formatLine(1, 9, {
            bold: true, // inline format
            header: 1 // block format
        });

        assert.strictEqual(this.instance.option('value'), '<h1>Test 1</h1><h1>Test 2</h1><p>Test 3</p>', 'just block format applied');
    });

    test('getBounds', function(assert) {
        this.createEditor();
        this.instance.option({
            'value': '<p><b>Test Test</b></p>',
            'width': 400,
            'height': 200
        });
        const getBoundsSpy = sinon.spy(this.instance.getQuillInstance(), 'getBounds');

        const bounds = this.instance.getBounds(2, 7);

        assert.ok(getBoundsSpy.calledOnce, 'Quill getBounds() should triggered on the editor\'s getBounds()');
        assert.deepEqual(getBoundsSpy.lastCall.args, [2, 7], 'Quill getBounds() gets correct arguments');
        assert.ok(isObject(bounds), 'bounds object is returned');
    });

    test('getFormat', function(assert) {
        this.createEditor();
        this.instance.option('value', '<p><b>Test Test</b></p>');

        const format = this.instance.getFormat(1, 2);
        assert.deepEqual(format, { bold: true }, 'correct format');
    });

    test('getFormat for current selection', function(assert) {
        this.createEditor();
        this.instance.option('value', '<p>Test <b>Test</b></p>');
        this.instance.setSelection(6, 2);

        const format = this.instance.getFormat();
        assert.deepEqual(format, { bold: true }, 'correct format');
    });

    test('getText', function(assert) {
        this.createEditor();
        this.instance.option('value', '<p><b>Test Test</b></p>');

        const text = this.instance.getText(2, 5);
        assert.strictEqual(text, 'st Te', 'correct text');
    });

    test('removeFormat', function(assert) {
        this.createEditor();
        this.instance.option('value', '<p><b>Test Test</b></p>');
        this.instance.removeFormat(1, 2);

        assert.strictEqual(this.instance.option('value'), '<p><strong>T</strong>es<strong>t Test</strong></p>', 'remove format from specific range');
    });

    test('getLength', function(assert) {
        this.createEditor();
        const length = this.instance.getLength();
        const LINE_WIDTH = 7; // 6 chars + the new line char

        assert.strictEqual(length, LINE_WIDTH * 3, 'correct format');
    });

    test('delete', function(assert) {
        this.createEditor();
        this.instance.delete(1, 7);

        assert.strictEqual(this.instance.option('value'), '<p>Test 2</p><p>Test 3</p>', 'custom range removed');
    });

    test('insertText', function(assert) {
        this.createEditor();
        this.instance.insertText(1, 'one');
        this.instance.insertText(6, 'two', { italic: true });

        assert.strictEqual(this.instance.option('value'), '<p>Tonees<em>two</em>t 1</p><p>Test 2</p><p>Test 3</p>', 'insert simple and formatted text');
    });

    test('insertText with simple arguments', function(assert) {
        this.createEditor();
        this.instance.insertText(1, 'one');
        this.instance.insertText(6, 'two', 'italic', true);

        assert.strictEqual(this.instance.option('value'), '<p>Tonees<em>two</em>t 1</p><p>Test 2</p><p>Test 3</p>', 'insert simple and formatted text');
    });

    test('insertEmbed', function(assert) {
        this.createEditor();
        const expected = '<p>T<span class="dx-variable" data-var-start-esc-char="#" data-var-end-esc-char="#"' +
            ' data-var-value="template"><span contenteditable="false">#template#</span></span>est 1</p><p>Test 2</p><p>Test 3</p>';
        this.instance.insertEmbed(1, 'variable', { value: 'template', escapeChar: '#' });

        assert.strictEqual(this.instance.option('value').replace(/\uFEFF/g, ''), expected, 'insert embed');
    });

    test('undo/redo', function(assert) {
        this.createEditor();
        this.instance.insertText(0, 'a');
        this.clock.tick(1000);
        this.instance.insertText(0, 'b');
        this.clock.tick(1000);
        this.instance.insertText(0, 'c');
        this.clock.tick(1000);

        this.instance.undo();

        assert.strictEqual(this.instance.option('value'), '<p>baTest 1</p><p>Test 2</p><p>Test 3</p>', 'undo operation');

        this.instance.redo();
        assert.strictEqual(this.instance.option('value'), '<p>cbaTest 1</p><p>Test 2</p><p>Test 3</p>', 'redo operation');
    });

    test('clearHistory', function(assert) {
        this.createEditor();
        this.instance.insertText(0, 'a');
        this.clock.tick(1000);
        this.instance.insertText(0, 'b');
        this.clock.tick(1000);
        this.instance.insertText(0, 'c');
        this.clock.tick(1000);

        this.instance.clearHistory();
        this.instance.undo();

        assert.strictEqual(this.instance.option('value'), '<p>cbaTest 1</p><p>Test 2</p><p>Test 3</p>', 'history is empty');
    });

    test('registerModule', function(assert) {
        class Test {
            constructor(quillInstance, options) {
                this._editorInstance = options.editorInstance;
            }

            getEditor() {
                return this._editorInstance;
            }
        }

        this.createEditor();

        const repaintSpy = sinon.spy(this.instance, 'repaint');
        this.instance.register({ 'modules/test': Test });

        const testModule = this.instance.getQuillInstance().getModule('test');

        assert.ok(testModule);
        assert.ok(repaintSpy.calledOnce, 'repaint is called when the module is registered after creating the quill instance');
        assert.strictEqual(testModule.getEditor(), this.instance);
    });

    test('registerModule on init', function(assert) {
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
            repaintSpy = sinon.spy(component, 'repaint');
            component.register({ 'modules/testInit': Test });
        };
        this.createEditor();

        const testModule = this.instance.getQuillInstance().getModule('testInit');

        assert.ok(testModule);
        assert.ok(repaintSpy.notCalled, 'repaint isn\'t called when the module is registered at the initialization');
        assert.strictEqual(testModule.getEditor(), this.instance);
    });

    test('\'update\' method should call the quill\'s update', function(assert) {
        this.createEditor();
        const updateSpy = sinon.spy(this.instance.getQuillInstance(), 'update');

        this.instance.update();

        assert.ok(updateSpy.calledOnce, 'Quill update() should triggered on the editor\'s update()');
    });

    test('\'focus\' method should call the quill\'s focus', function(assert) {
        this.createEditor();
        const focusSpy = sinon.spy(this.instance.getQuillInstance(), 'focus');

        this.instance.focus();

        assert.ok(focusSpy.calledOnce, 'Quill focus() should triggered on the editor\'s focus()');
    });

    test('\'blur\' method should call the quill\'s blur', function(assert) {
        this.createEditor();
        const blurSpy = sinon.spy(this.instance.getQuillInstance(), 'blur');

        this.instance.blur();

        assert.ok(blurSpy.calledOnce, 'Quill blur() should triggered on the editor\'s blur()');
    });

    test('\'blur\' method should not remove focus from additional htmlEditor element', function(assert) {
        this.createEditor();
        const internalElement = $('<input type="button">');
        const blurSpy = sinon.spy();
        internalElement.appendTo(this.instance.element());
        internalElement.on('blur', blurSpy);

        internalElement.focus();
        this.instance.blur();

        assert.strictEqual(blurSpy.callCount, 0, 'custom internal element blur() should not triggered on the editor\'s blur()');
    });

    test('change value via \'option\' method should correctly update content', function(assert) {
        this.createEditor();
        const valueChangeStub = sinon.stub();
        const updateContentSpy = sinon.spy(this.instance, '_updateHtmlContent');

        this.instance.on('valueChanged', valueChangeStub);
        this.instance.option('value', '<p>First row</p><p>Second row</p>');
        this.clock.tick();
        this.instance.option('value', 'New text');
        this.clock.tick();

        assert.strictEqual(valueChangeStub.lastCall.args[0].value, 'New text');
        assert.strictEqual(updateContentSpy.callCount, 2, 'value changed twice -> update content two times');
        assert.strictEqual(updateContentSpy.lastCall.args[0], 'New text', 'Update content with the new value');
    });

    test('customize module', function(assert) {
        this.options.customizeModules = function({ toolbar }) {
            toolbar.items.push('italic');
        };

        this.options.toolbar = { items: ['bold'] };
        this.createEditor();

        const $toolbarItems = $(`.${TOOLBAR_FORMAT_WIDGET_CLASS}`);
        assert.strictEqual($toolbarItems.length, 2, 'second item has been added');
        assert.strictEqual($toolbarItems.text(), 'BoldItalic', 'expected items order');
    });

    test('customize custom module', function(assert) {
        assert.expect(1);
        class Test {
            constructor(quillInstance, { customOption }) {
                assert.strictEqual(customOption, 3, 'instance creates with custom options');
            }
        }

        this.options.customizeModules = function({ testWithOptions }) {
            if(testWithOptions) {
                testWithOptions.customOption = 3;
            }
        };

        this.createEditor();
        this.instance.register({ 'modules/testWithOptions': Test });
    });

    test('onContentReady should trigger after processing transcluded content', function(assert) {
        const initialMarkup = '<custom-tag></custom-tag><h1>Hi!</h1><p>Test         </p>';
        const expectedValue = '<h1>Hi!</h1><p>Test</p>';

        $('#htmlEditor').html(initialMarkup);
        this.options = {
            onContentReady: ({ component }) => {
                assert.strictEqual(component.option('value'), expectedValue, 'value is synchronized with the transcluded content');
            }
        };
        this.createEditor();

        this.clock.tick();
    });

    test('onContentReady event should trigger after editor without transcluded content rendered', function(assert) {
        this.options.onContentReady = sinon.stub();
        this.createEditor();

        this.clock.tick();
        assert.ok(this.options.onContentReady.calledOnce, 'onContentReady has been called once');
    });

    test('empty editor should trigger onContentReady event', function(assert) {
        this.options = { onContentReady: sinon.stub() };
        this.createEditor();

        this.clock.tick();
        assert.ok(this.options.onContentReady.calledOnce, 'onContentReady has been called once');
    });

    test('editor with invalid transcluded content should trigger onContentReady event', function(assert) {
        $('#htmlEditor').html('<test><custom-tag></custom-tag></test>');
        this.options = { onContentReady: sinon.stub() };
        this.createEditor();

        this.clock.tick();
        assert.ok(this.options.onContentReady.calledOnce, 'onContentReady has been called once');
    });
});

testModule('Private API', moduleConfig, () => {
    test('cleanCallback should trigger on refresh', function(assert) {
        const cleanCallback = sinon.stub();

        this.createEditor();
        this.instance.addCleanCallback(cleanCallback);

        this.instance.repaint();
        assert.ok(cleanCallback.calledOnce, 'callback is called on refresh');

        this.instance.repaint();
        assert.ok(cleanCallback.calledOnce, 'callbacks has been removed after clean');

        this.instance.addCleanCallback(cleanCallback);
        this.instance.dispose();
        assert.ok(cleanCallback.calledTwice, 'callback is called on dispose');
    });

    test('contentInitialized callback should trigger after content was initialized by Quill but before ContentReady event', function(assert) {
        const contentInitializedCallback = () => {
            assert.ok(contentReadyHandler.notCalled, 'ContentReady event isn\'t trigger yet');
        };
        const contentReadyHandler = sinon.stub();

        this.options.onInitialized = ({ component }) => {
            component.addContentInitializedCallback(contentInitializedCallback);
        };
        this.options.onContentReady = contentReadyHandler;
        this.createEditor();

        this.instance.repaint();
    });

    test('contentInitialized callback should been removed on widget repaint', function(assert) {
        const contentInitializedCallback = sinon.stub();

        this.options.onInitialized = ({ component }) => {
            component.addContentInitializedCallback(contentInitializedCallback);
        };
        this.createEditor();

        assert.ok(contentInitializedCallback.calledOnce, 'contentInitialized was called once');
        this.instance.repaint();
        assert.ok(contentInitializedCallback.calledOnce, 'contentInitialized wasn\'t called twice');
    });
});

testModule('Table API', moduleConfigWithTable, function() {
    test('insertTable', function(assert) {
        const expectedValue = '<table><tbody><tr><td><br></td><td><br></td></tr></tbody></table><p><br></p>';
        this.options.value = '';
        this.createEditor();
        this.instance.focus();

        this.applyTableMethod('insertTable', 1, 2);

        assert.strictEqual(this.getValue(), expectedValue);
    });

    test('insertRowBelow', function(assert) {
        const expectedValue = '<table><tbody><tr><td>1</td><td>2</td></tr><tr><td><br></td><td><br></td></tr><tr><td>3</td><td>4</td></tr></tbody></table>';
        this.createEditor();
        this.instance.setSelection(1, 0);

        this.applyTableMethod('insertRowBelow');

        assert.strictEqual(this.getValue(), expectedValue);
    });

    test('insertRowAbove', function(assert) {
        const expectedValue = '<table><tbody><tr><td><br></td><td><br></td></tr><tr><td>1</td><td>2</td></tr><tr><td>3</td><td>4</td></tr></tbody></table>';
        this.createEditor();
        this.instance.setSelection(1, 0);

        this.applyTableMethod('insertRowAbove');

        assert.strictEqual(this.getValue(), expectedValue);
    });

    test('insertColumnLeft', function(assert) {
        const expectedValue = '<table><tbody><tr><td><br></td><td>1</td><td>2</td></tr><tr><td><br></td><td>3</td><td>4</td></tr></tbody></table>';
        this.createEditor();
        this.instance.setSelection(1, 0);

        this.applyTableMethod('insertColumnLeft');

        assert.strictEqual(this.getValue(), expectedValue);
    });

    test('insertColumnRight', function(assert) {
        const expectedValue = '<table><tbody><tr><td>1</td><td><br></td><td>2</td></tr><tr><td>3</td><td><br></td><td>4</td></tr></tbody></table>';
        this.createEditor();
        this.instance.setSelection(1, 0);

        this.applyTableMethod('insertColumnRight');

        assert.strictEqual(this.getValue(), expectedValue);
    });

    test('deleteColumn', function(assert) {
        const expectedValue = '<table><tbody><tr><td>2</td></tr><tr><td>4</td></tr></tbody></table>';
        this.createEditor();
        this.instance.setSelection(1, 0);

        this.applyTableMethod('deleteColumn');

        assert.strictEqual(this.getValue(), expectedValue);
    });

    test('deleteRow', function(assert) {
        const expectedValue = '<table><tbody><tr><td>3</td><td>4</td></tr></tbody></table>';
        this.createEditor();
        this.instance.setSelection(1, 0);

        this.applyTableMethod('deleteRow');

        assert.strictEqual(this.getValue(), expectedValue);
    });

    test('deleteTable', function(assert) {
        const expectedValue = '';
        this.createEditor();
        this.instance.setSelection(1, 0);

        this.applyTableMethod('deleteTable');

        assert.strictEqual(this.getValue(), expectedValue);
    });
});
