import $ from 'jquery';
import HtmlEditor from 'ui/html_editor';
import markupTests from './markup.tests.js';
import valueRenderingTests from './valueRendering.tests.js';
import toolbarIntegrationTests from './toolbarIntegration.tests.js';
import pasteTests from './paste.tests.js';
import mentionIntegrationTests from './mentionIntegration.tests.js';
import { prepareTableValue } from './utils.js';

const CONTENT_CLASS = 'dx-htmleditor-content';
const TIME_TO_WAIT = 500;

const { module: testModule, test } = QUnit;
const moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
};

export default function() {
    testModule('Multiline module integration', {
        beforeEach: function() {
            this.initialEditorDefaults = HtmlEditor._classCustomRules; // Save initial defaults
            HtmlEditor.defaultOptions({
                options: {
                    customizeModules: function(config) {
                        config.multiline = true;

                        return config;
                    }
                }
            });
        },
        afterEach: function() {
            HtmlEditor._classCustomRules = this.initialEditorDefaults; // Restore initial defaults
        }
    }, function() {

        // Run common tests
        markupTests();
        valueRenderingTests();
        toolbarIntegrationTests();
        pasteTests();
        mentionIntegrationTests();

        // Run specific tests
        testModule('initial render', function() {
            test('editor should preserve initial breakers', function(assert) {
                const value = '<h1>Hi!<br>Hej!</h1><p>Ab<br>Cd</p><ul><li>First<br>item</li><li>Second item</li></ul>';
                const $element = $('#htmlEditor');
                const instance = $element.dxHtmlEditor({
                    value
                }).dxHtmlEditor('instance');
                const markup = $element.find(`.${CONTENT_CLASS}`).html();

                assert.strictEqual(instance.option('value'), value);
                assert.strictEqual(markup, '<h1>Hi!<br>Hej!</h1><p>Ab<br>Cd</p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>First<br>item</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Second item</li></ol>');
            });

            test('editor should preserve table cell breaks', function(assert) {
                const value = '<table><tbody><tr><td>plain text</td><td>multi<br>line<br>text</td></tr><tr><td>multi<br>line<br>text</td><td>plain text</td></tr></tbody></table>';
                const $element = $('#htmlEditor');
                const instance = $element.dxHtmlEditor({
                    value
                }).dxHtmlEditor('instance');
                const markup = prepareTableValue($element.find(`.${CONTENT_CLASS}`).html());

                assert.strictEqual(instance.option('value'), prepareTableValue(value));
                assert.strictEqual(markup, value);
            });
        });

        testModule('runtime editing', moduleConfig, function() {
            [
                {
                    name: 'break paragraph',
                    value: 'test',
                    expected: '<p>te<br>st</p>'
                },
                {
                    name: 'break list item',
                    value: '<ul><li>item 1</li><li>item 2</li></ul>',
                    expected: '<ul><li>it<br>em 1</li><li>item 2</li></ul>'
                },
                {
                    name: 'break table cell',
                    value: '<table><tr><td>cell 1</td><td>cell 2</td></tr></table>',
                    expected: '<table><tbody><tr><td>ce<br>ll 1</td><td>cell 2</td></tr></tbody></table>'
                }
            ].forEach(({ name, value, expected }) => {
                test(name, function(assert) {
                    const done = assert.async();
                    const $element = $('#htmlEditor');
                    const instance = $element.dxHtmlEditor({
                        value,
                        onValueChanged: ({ value: newValue }) => {
                            assert.strictEqual(prepareTableValue(newValue), expected);
                            done();
                        }
                    }).dxHtmlEditor('instance');

                    instance.setSelection(2, 0, true);
                    this.clock.tick(TIME_TO_WAIT);
                    const contentElem = $(instance.element()).find(`.${CONTENT_CLASS}`).get(0);

                    contentElem.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true }));
                });
            });
        });
    });
}
