import $ from 'jquery';

import 'ui/html_editor';
import 'ui/html_editor/converters/markdown';

import { checkLink, prepareEmbedValue } from './utils.js';

const CONTENT_CLASS = 'dx-htmleditor-content';
const HTML_EDITOR_SUBMIT_ELEMENT_CLASS = 'dx-htmleditor-submit-element';

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
            const initialHeight = $element.outerHeight();

            instance.option('placeholder', '1234 567 89 0123 4567 89 012 345 67 890');

            const actualHeight = $element.outerHeight();

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

            this.clock.tick();

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

            this.clock.tick();

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

        test('value after change valueType', function(assert) {
            const done = assert.async();
            const instance = $('#htmlEditor')
                .dxHtmlEditor({
                    valueType: 'markdown',
                    value: 'Hi! **Test. 123**\n\nNew line',
                    onValueChanged: (e) => {
                        if(e.component.option('valueType') === 'html') {
                            assert.equal(e.value, '<p>Hi! <strong>Test. 123</strong></p><p>New line</p>', 'value is OK');
                            done();
                        }
                    }
                })
                .dxHtmlEditor('instance');

            instance.option('valueType', 'html');
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

            this.clock.tick();

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

            this.clock.tick();

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

            this.clock.tick();

            assert.expect(1);
            instance.setSelection(0, 4);
            instance.format('align', 'center');
            this.clock.tick();
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

            this.clock.tick();

            assert.expect(1);
            instance.setSelection(1, 0);
            instance.format('align', 'center');
            this.clock.tick();
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

            this.clock.tick();

            assert.strictEqual(instance.option('value'), expected);
        });
    });


    testModule('Value as Markdown markup', {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();
        },
        afterEach: function() {
            this.clock.restore();
        }
    }, () => {
        test('render default markdown value', function(assert) {
            const instance = $('#htmlEditor').dxHtmlEditor({
                value: 'Hi!\n\nIt\'s a **test**!',
                valueType: 'markdown'
            }).dxHtmlEditor('instance');
            const $element = instance.$element();
            const markup = $element.find(getSelector(CONTENT_CLASS)).html();

            assert.strictEqual(instance.option('value'), 'Hi!\n\nIt\'s a **test**!');
            assert.strictEqual(markup, '<p>Hi!</p><p>It\'s a <strong>test</strong>!</p>');
        });

        test('change markdown value by user', function(assert) {
            const done = assert.async();
            const instance = $('#htmlEditor')
                .dxHtmlEditor({
                    valueType: 'markdown',
                    onValueChanged: (e) => {
                        assert.equal(e.value, 'Hi! **Test.**');
                        done();
                    }
                })
                .dxHtmlEditor('instance');

            instance
                .$element()
                .find(getSelector(CONTENT_CLASS))
                .html('<p>Hi! <strong>Test.</strong></p>');
        });

        test('change value to null', function(assert) {
            const done = assert.async();
            const instance = $('#htmlEditor')
                .dxHtmlEditor({
                    value: 'test',
                    valueType: 'markdown',
                    onValueChanged: ({ value }) => {
                        assert.strictEqual(value, null);

                        done();
                    }
                })
                .dxHtmlEditor('instance');

            instance.option('value', null);
        });

        test('apply value after change valueType', function(assert) {
            const done = assert.async();
            const instance = $('#htmlEditor')
                .dxHtmlEditor({
                    value: '<p>Hi! <strong>Test.</strong></p>',
                    onValueChanged: (e) => {
                        if(e.component.option('valueType') === 'markdown') {
                            assert.equal(e.value, 'Hi! **Test.**');
                            done();
                        }
                    }
                })
                .dxHtmlEditor('instance');

            instance.option('valueType', 'markdown');
        });

        test('clear the Markdown value', function(assert) {
            const done = assert.async();
            const instance = $('#htmlEditor')
                .dxHtmlEditor({
                    value: 'test',
                    valueType: 'markdown',
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
            this.clock.tick();
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
}
