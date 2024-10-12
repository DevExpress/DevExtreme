import $ from 'jquery';

import 'ui/html_editor';
import { getOuterHeight } from 'core/utils/size';

import { checkLink, prepareEmbedValue, prepareTableValue } from './utils.js';
import Quill from 'devextreme-quill';

const CONTENT_CLASS = 'dx-htmleditor-content';
const HTML_EDITOR_SUBMIT_ELEMENT_CLASS = 'dx-htmleditor-submit-element';

const TABLE_WITH_HEADER_MARKUP = `
<table>
    <thead>
        <tr>
            <th>Header1</th>
            <th>Header2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Data1</td>
            <td>Data2</td>
        </tr>
    </tbody>
</table>`;

function getSelector(className) {
    return `.${className}`;
}

const { test, module: testModule } = QUnit;

const moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
};

export default function() {
    testModule('Value as HTML markup', moduleConfig, () => {
        test('show placeholder is value undefined', function(assert) {
            const instance = $('#htmlEditor').dxHtmlEditor({
                placeholder: 'test placeholder'
            }).dxHtmlEditor('instance');
            const $element = instance.$element();
            const $content = $element.find(getSelector(CONTENT_CLASS));

            assert.equal($content.get(0).dataset.placeholder, 'test placeholder');
        });

        test('the container must adjust to the placeholder', function(assert) {
            const instance = $('#htmlEditor').dxHtmlEditor({
                width: 50
            }).dxHtmlEditor('instance');
            const $element = instance.$element();
            const initialHeight = getOuterHeight($element);

            instance.option('placeholder', '1234 567 89 0123 4567 89 012 345 67 890');

            const actualHeight = getOuterHeight($element);

            assert.ok(actualHeight > initialHeight, 'editor height has been increased');
        });

        test('render default value', function(assert) {
            const instance = $('#htmlEditor').dxHtmlEditor({
                value: '<h1>Hi!</h1><p>Test</p>'
            }).dxHtmlEditor('instance');
            const $element = instance.$element();
            const markup = $element.find(getSelector(CONTENT_CLASS)).html();

            assert.strictEqual(instance.option('value'), '<h1>Hi!</h1><p>Test</p>');
            assert.strictEqual(markup, '<h1>Hi!</h1><p>Test</p>');
        });

        test('render table with header without paragraph', function(assert) {
            const instance = $('#htmlEditor').dxHtmlEditor({
                value: TABLE_WITH_HEADER_MARKUP
            }).dxHtmlEditor('instance');
            const $element = instance.$element();
            const markup = prepareTableValue($element.find(getSelector(CONTENT_CLASS)).html());
            const expectedValue = '<table>' +
                '<thead>' +
                    '<tr>' +
                        '<th><p>Header1</p></th>' +
                        '<th><p>Header2</p></th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>' +
                    '<tr>' +
                        '<td><p>Data1</p></td>' +
                        '<td><p>Data2</p></td>' +
                    '</tr>' +
                '</tbody>' +
            '</table>';

            assert.strictEqual(instance.option('value'), TABLE_WITH_HEADER_MARKUP);
            assert.strictEqual(markup, expectedValue);
        });

        test('render table with header and multiple paragraphs', function(assert) {
            const value = `
            <table>
                <thead>
                    <tr>
                        <th>
                            <p>Header1</p>
                            <p>Subheader1</p>
                            </th>
                        <th>Header2</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <p>Data1</p>
                            <p>Data1_1</p>
                            <p>Data1_2</p>
                        </td>
                        <td>Data2</td>
                    </tr>
                </tbody>
            </table>`;
            const instance = $('#htmlEditor').dxHtmlEditor({ value }).dxHtmlEditor('instance');
            const $element = instance.$element();
            const markup = prepareTableValue($element.find(getSelector(CONTENT_CLASS)).html());
            const expectedValue = '<table>' +
                '<thead>' +
                    '<tr>' +
                        '<th>' +
                            '<p>Header1</p>' +
                            '<p>Subheader1</p>' +
                        '</th>' +
                        '<th><p>Header2</p></th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>' +
                    '<tr>' +
                        '<td>' +
                            '<p>Data1</p>' +
                            '<p>Data1_1</p>' +
                            '<p>Data1_2</p>' +
                        '</td>' +
                        '<td><p>Data2</p></td>' +
                    '</tr>' +
                '</tbody>' +
            '</table>';

            assert.strictEqual(instance.option('value'), value);
            assert.strictEqual(markup, expectedValue);
        });

        test('render transclude content', function(assert) {
            assert.expect(4);
            const instance = $('#htmlEditor')
                .html('<h1>Hi!</h1><p>Test</p>')
                .dxHtmlEditor()
                .dxHtmlEditor('instance');
            const $element = instance.$element();
            const markup = $element.find(getSelector(CONTENT_CLASS)).html();
            const updateContentTask = instance._updateContentTask;

            if(updateContentTask) {
                const taskPromise = updateContentTask && updateContentTask.promise;

                assert.ok(true, 'There is a task that update the value with a transcluded content');

                taskPromise.then(() => {
                    assert.ok(true, 'Update value task finished');
                });
            }

            this.clock.tick(10);

            assert.equal(instance.option('value'), '<h1>Hi!</h1><p>Test</p>');
            assert.equal(markup, '<h1>Hi!</h1><p>Test</p>');
        });

        test('render transclude content and predefined value', function(assert) {
            const instance = $('#htmlEditor')
                .html('<h1>Hi!</h1><p>Test</p>')
                .dxHtmlEditor({
                    value: '<p>Test1</p><p>Test2</p>'
                })
                .dxHtmlEditor('instance');
            const $element = instance.$element();
            const markup = $element.find(getSelector(CONTENT_CLASS)).html();

            this.clock.tick(10);

            assert.equal(instance.option('value'), '<p>Test1</p><p>Test2</p>');
            assert.equal(markup, '<p>Test1</p><p>Test2</p>');
        });

        test('change value by user', function(assert) {
            const done = assert.async();
            const expectedValue = '<p>Hi! <strong>Test.</strong></p><p>New line</p>';
            const instance = $('#htmlEditor')
                .dxHtmlEditor({
                    onValueChanged: (e) => {
                        assert.equal(e.value, expectedValue);
                        assert.equal($(e.element).find(`.${HTML_EDITOR_SUBMIT_ELEMENT_CLASS}`).val(), expectedValue);
                        done();
                    }
                })
                .dxHtmlEditor('instance');

            instance
                .$element()
                .find(getSelector(CONTENT_CLASS))
                .html('<p>Hi! <strong>Test.</strong></p><p>New line</p>');
        });

        test('render markup with a font-size style', function(assert) {
            const instance = $('#htmlEditor').dxHtmlEditor({
                value: '<span style="font-size: 20px">Test</span>'
            }).dxHtmlEditor('instance');
            const $element = instance.$element();
            const markup = $element.find(getSelector(CONTENT_CLASS)).html();

            assert.equal(markup, '<p><span style="font-size: 20px;">Test</span></p>');
        });

        test('render markup with a font-family style', function(assert) {
            const instance = $('#htmlEditor').dxHtmlEditor({
                value: '<span style="font-family: Terminal;">Test</span>'
            }).dxHtmlEditor('instance');
            const $element = instance.$element();
            const markup = $element.find(getSelector(CONTENT_CLASS)).html();

            assert.equal(markup, '<p><span style="font-family: Terminal;">Test</span></p>');
        });

        test('editor should preserve break lines', function(assert) {
            const expectedMarkup = '<p><br></p><p><br></p><h1>Hi!</h1><p>Te</p><p>st</p>';
            const instance = $('#htmlEditor')
                .html('<p><br></p><p><br></p><h1>Hi!</h1><p>Te</p><p>st</p>')
                .dxHtmlEditor()
                .dxHtmlEditor('instance');

            this.clock.tick(10);

            const $element = instance.$element();
            const markup = $element.find(getSelector(CONTENT_CLASS)).html();

            assert.equal(instance.option('value'), expectedMarkup);
            assert.equal(markup, expectedMarkup);
        });

        test('editor shouldn\'t create unexpected break lines', function(assert) {
            const htmlMarkup = '<p>hi</p><ul><li>test</li></ul>';
            const quillMarkup = '<p>hi</p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>test</li></ol>';
            const instance = $('#htmlEditor')
                .html(htmlMarkup)
                .dxHtmlEditor()
                .dxHtmlEditor('instance');

            this.clock.tick(10);

            const $element = instance.$element();
            const markup = $element.find(getSelector(CONTENT_CLASS)).html();

            assert.equal(instance.option('value'), htmlMarkup);
            assert.equal(markup, quillMarkup);
        });

        test('editor should respect attributes of the list item', function(assert) {
            const done = assert.async();
            const expectedMarkup = '<ul><li style="text-align: center;">test</li></ul>';
            const instance = $('#htmlEditor')
                .dxHtmlEditor({
                    value: '<ul><li>test</li></ul>',
                    onValueChanged: (e) => {
                        assert.equal(e.value, expectedMarkup, 'value is OK');
                        done();
                    }
                })
                .dxHtmlEditor('instance');

            this.clock.tick(10);

            assert.expect(1);
            instance.setSelection(0, 4);
            instance.format('align', 'center');
            this.clock.tick(10);
        });

        test('editor should respect attributes of the single formatted line', function(assert) {
            const done = assert.async();
            const expectedMarkup = '<p style="text-align: center;">test</p>';
            const instance = $('#htmlEditor')
                .dxHtmlEditor({
                    value: 'test',
                    onValueChanged: (e) => {
                        assert.equal(e.value, expectedMarkup, 'value is OK');
                        done();
                    }
                })
                .dxHtmlEditor('instance');

            this.clock.tick(10);

            assert.expect(1);
            instance.setSelection(1, 0);
            instance.format('align', 'center');
            this.clock.tick(10);
        });

        test('editor should have an empty string value when all content has been removed', function(assert) {
            const instance = $('#htmlEditor')
                .dxHtmlEditor({
                    value: 'test'
                }).dxHtmlEditor('instance');

            instance.delete(0, 4);
            assert.equal(instance.option('value'), '', 'value is empty line');
        });

        test('editor should trigger the \'valueChanged\' event after formatting a link', function(assert) {
            assert.expect(1);

            const done = assert.async();
            const instance = $('#htmlEditor')
                .dxHtmlEditor({
                    value: '<a href=\'www.test.test\'>test</a>',
                    onValueChanged: ({ value }) => {
                        const hasColor = /style=(".*?"|'.*?'|[^"'][^\s]*)/.test(value);

                        assert.ok(hasColor, 'link has a color');
                        done();
                    }
                }).dxHtmlEditor('instance');

            instance.setSelection(0, 4);
            instance.format('color', 'red');
        });

        test('clear the HTML value', function(assert) {
            const done = assert.async();
            const instance = $('#htmlEditor')
                .dxHtmlEditor({
                    value: 'test',
                    onValueChanged: ({ value, previousValue }) => {
                        assert.strictEqual(value, '');
                        assert.strictEqual(previousValue, 'test');
                        done();
                    }
                })
                .dxHtmlEditor('instance');

            instance
                .$element()
                .find(getSelector(CONTENT_CLASS))
                .html('');
        });

        test('render widget in detached container', function(assert) {
            const $container = $('#htmlEditor');
            const listMarkup = '<ul><li>t1</li><li>t2</li></ul>';
            const quillMarkup = '<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false">' +
                '</span>t1</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>t2</li></ol>';

            $container.detach();

            $container.dxHtmlEditor({
                value: listMarkup
            });

            $container.appendTo('#qunit-fixture');

            const content = $container.find('.dx-htmleditor-content').html();
            assert.strictEqual(content, quillMarkup);
        });

        test('it should keep value with nested lists if the widget has transcluded content', function(assert) {
            const $container = $('#htmlEditor');
            $container.html('123');
            const expected = '<ol><li>vehicles<ol><li>cars<ol><li>electric cars</li></ol></li><li>ships<ol><li>sailing ships</li></ol></li><li>planes<ol><li>propeller air crafts</li><li>jet</li></ol></li></ol></li></ol>';

            const instance = $container
                .dxHtmlEditor({ 'value': expected })
                .dxHtmlEditor('instance');

            this.clock.tick(10);

            assert.strictEqual(instance.option('value'), expected);
        });
    });

    testModule('xss security', {
        beforeEach: function() {
            window._isScriptExecuted = false;
            window._isInlineHandlerExecuted = false;

            this.htmlWithScript = '<script>window._isScriptExecuted = true;</script>';
            this.htmlWithInlineHandler = '<img src="undefined" onerror="window._isInlineHandlerExecuted = true;"/>';
        },
        afterEach: function() {
            delete window._isScriptExecuted;
            delete window._isInlineHandlerExecuted;
        }
    }, () => {
        test('frame should have an empty srcdoc attribute to prevent an excess "Blocked script execution" error in Opera (T1150911)', function(assert) {
            const htmlEditor = $('#htmlEditor').dxHtmlEditor({}).dxHtmlEditor('instance');
            const $frame = htmlEditor._createNoScriptFrame();

            assert.strictEqual($frame.attr('srcdoc'), '', 'srcdoc attribute is set');
        });

        test('script embedded in html value should not be executed on init', function(assert) {
            const done = assert.async();

            $('#htmlEditor').dxHtmlEditor({
                value: this.htmlWithScript
            });

            setTimeout(() => {
                assert.strictEqual(window._isScriptExecuted, false, 'script was not executed');
                done();
            }, 100);
        });

        test('inline handler embedded in html value should not be executed on init', function(assert) {
            const done = assert.async();

            $('#htmlEditor').dxHtmlEditor({
                value: this.htmlWithInlineHandler
            });

            setTimeout(() => {
                assert.strictEqual(window._isInlineHandlerExecuted, false, 'inline handler was not executed');
                done();
            }, 100);
        });

        test('value change to html with embedded script should not execute the script', function(assert) {
            const done = assert.async();

            const htmlEditor = $('#htmlEditor').dxHtmlEditor({}).dxHtmlEditor('instance');
            htmlEditor.option('value', this.htmlWithScript);

            setTimeout(() => {
                assert.strictEqual(window._isScriptExecuted, false, 'script was not executed');
                done();
            }, 100);
        });

        test('value change to html with embedded inline handler should not execute the handler', function(assert) {
            const done = assert.async();

            const htmlEditor = $('#htmlEditor').dxHtmlEditor({}).dxHtmlEditor('instance');
            htmlEditor.option('value', this.htmlWithInlineHandler);

            setTimeout(() => {
                assert.strictEqual(window._isInlineHandlerExecuted, false, 'inline handler was not executed');
                done();
            }, 100);
        });
    });

    testModule('Custom blots rendering', {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();
        },
        afterEach: function() {
            this.clock.restore();
        }
    }, () => {
        test('render image', function(assert) {
            const testTag = /<img([\w\W]+?)/;
            const testSrc = /src="http:\/\/test.test\/test.jpg"/g;
            const testAlt = /alt="altering"/g;
            const testWidth = /width="100"/g;
            const testHeight = /height="100"/g;

            const instance = $('#htmlEditor')
                .dxHtmlEditor({
                    onValueChanged: (e) => {
                        assert.ok(testTag.test(e.value));
                        assert.ok(testSrc.test(e.value));
                        assert.ok(testAlt.test(e.value));
                        assert.ok(testWidth.test(e.value));
                        assert.ok(testHeight.test(e.value));
                    }
                })
                .dxHtmlEditor('instance');

            instance.insertEmbed(0, 'extendedImage', { src: 'http://test.test/test.jpg', width: 100, height: 100, alt: 'altering' });
            this.clock.tick(10);
        });

        test('render link', function(assert) {
            const instance = $('#htmlEditor')
                .dxHtmlEditor({
                    value: 'test',
                    onValueChanged: ({ value }) => {
                        checkLink(assert, {
                            href: 'http://test.test',
                            content: 'test',
                            afterLink: 'test'
                        }, value);
                    }
                })
                .dxHtmlEditor('instance');

            instance.setSelection(0, 0);
            instance.insertText(0, 'test', 'link', { href: 'http://test.test', target: true });
        });

        test('render variable', function(assert) {
            const expected = '<p><span class="dx-variable" data-var-start-esc-char="#" data-var-end-esc-char="#" data-var-value="Test"><span contenteditable="false">#Test#</span></span></p>';
            const instance = $('#htmlEditor')
                .dxHtmlEditor({
                    onValueChanged: (e) => {
                        assert.equal(prepareEmbedValue(e.value), expected, 'markup contains a variable');
                    }
                })
                .dxHtmlEditor('instance');

            instance.insertEmbed(0, 'variable', { escapeChar: '#', value: 'Test' });
        });
    });

    testModule('Table without paragraph support', Object.assign({
        before: function() {
            this.originalTableModule = Quill.import('modules/table');
            const TableModule = Quill.import('tableModules/lite');
            Quill.register('modules/table', TableModule, true);
        },
        after: function() {
            Quill.register('modules/table', this.originalTableModule, true);
        }
    }, moduleConfig), () => {
        test('render table with header', function(assert) {
            const expectedMarkup = '<table><thead><tr><th>Header1</th><th>Header2</th></tr></thead><tbody><tr><td>Data1</td><td>Data2</td></tr></tbody></table>';
            const instance = $('#htmlEditor').dxHtmlEditor({
                value: TABLE_WITH_HEADER_MARKUP
            }).dxHtmlEditor('instance');
            const $element = instance.$element();
            const markup = prepareTableValue($element.find(getSelector(CONTENT_CLASS)).html());

            assert.strictEqual(instance.option('value'), TABLE_WITH_HEADER_MARKUP);
            assert.strictEqual(markup, expectedMarkup);
        });
    });

    testModule('CSP. inline styles parsing', {}, () => {
        testModule('Mocked quill methods', {
            beforeEach() {
                this.replaceStyleAttributeCallCount = 0;
                this.sourceReplaceStyleAttribute = Quill.replaceStyleAttribute;
                Quill.replaceStyleAttribute = () => {
                    this.replaceStyleAttributeCallCount += 1;
                };
            },
            afterEach() {
                Quill.replaceStyleAttribute = this.sourceReplaceStyleAttribute;
            }
        }, () => {
            test('replaceStyleAttribute should be called on value processing', function(assert) {
                $('#htmlEditor')
                    .dxHtmlEditor({
                        value: '<p></p>'
                    })
                    .dxHtmlEditor('instance');

                assert.strictEqual(this.replaceStyleAttributeCallCount, 2);
            });
        });

        testModule('rendering vulnerable value', {
            createHtmlEditor(value) {
                return $('#htmlEditor')
                    .dxHtmlEditor({ value })
                    .dxHtmlEditor('instance');
            }
        }, () => {
            const testCases = [{
                testName: 'simple style attribute should be rendered coccectly',
                inputMarkup: '<p style="text-align: right;">content</p>',
                expectedMarkup: '<p style="text-align: right;">content</p>',
            }, {
                testName: 'uppercase style attribute should be rendered coccectly',
                inputMarkup: '<p STYLE="text-align: right;">content</p>',
                expectedMarkup: '<p STYLE="text-align: right;">content</p>',
            }, {
                testName: 'style attribute with one space after attribute should be rendered coccectly',
                inputMarkup: '<p style ="text-align: right;">content</p>',
                expectedMarkup: '<p style ="text-align: right;">content</p>',
            }, {
                testName: 'style attribute with two spaces after attribute should be rendered coccectly',
                inputMarkup: '<p style  ="text-align: right;">content</p>',
                expectedMarkup: '<p style  ="text-align: right;">content</p>',
            }, {
                testName: 'several style attributes should be rendered coccectly',
                inputMarkup: '<p style="text-align: right;" style="border: solid;">content</p>',
                expectedMarkup: '<p style="text-align: right;" style="border: solid;">content</p>',
            }, {
                testName: 'style inside tag attribute should be rendered coccectly',
                inputMarkup: '<p>style="text-align: right;"</p>',
                expectedMarkup: '<p>style="text-align: right;"</p>',
            }, {
                testName: 'style attributes in sibling tags should be rendered coccectly',
                inputMarkup: '<p style="text-align: left;">content</p><p style="text-align: right;">content</p>',
                expectedMarkup: '<p style="text-align: left;">content</p><p style="text-align: right;">content</p>',
            }, {
                testName: 'style attributes in parent and child elements should be rendered coccectly',
                inputMarkup: '<div style="text-align: right;">content<div style="color: red;">content</div></div>',
                expectedMarkup: '<div style="text-align: right;">content<div style="color: red;">content</div></div>',
            }, {
                testName: 'value should be rendered coccectly when input markup do not have open bracket for open tag',
                inputMarkup: 'p style="text-align: right;">content</p>',
                expectedMarkup: 'p style="text-align: right;">content</p>',
            }, {
                testName: 'value should be rendered coccectly when input markup do not have closed bracket for open tag',
                inputMarkup: '<p style="text-align: right;" content</p>',
                expectedMarkup: '<p style="text-align: right;" content</p>',
            }, {
                testName: 'value should be rendered coccectly when input markup do not have open bracket for closed tag',
                inputMarkup: '<p style="text-align: right;">content /p>',
                expectedMarkup: '<p style="text-align: right;">content /p>',
            }, {
                testName: 'value should be rendered coccectly when input markup do not have closed bracket for closed tag',
                inputMarkup: '<p style="text-align: right;">content</p',
                expectedMarkup: '<p style="text-align: right;">content</p',
            }, {
                testName: 'value should be rendered coccectly when input markup do not have closed tag',
                inputMarkup: '<p style="text-align: right;">content',
                expectedMarkup: '<p style="text-align: right;">content',
            }, {
                testName: 'should be no errors when value is equals empty string',
                inputMarkup: '',
                expectedMarkup: '',
            }];

            testCases.forEach(testCase => {
                test(testCase.testName, function(assert) {
                    const initialValue = testCase.inputMarkup;
                    const htmlEditor = this.createHtmlEditor(initialValue);

                    const renderedValue = htmlEditor.option('value');

                    assert.strictEqual(renderedValue, testCase.expectedMarkup);
                });
            });
        });
    });
}
