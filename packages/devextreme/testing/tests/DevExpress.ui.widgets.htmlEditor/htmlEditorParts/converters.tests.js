import $ from 'jquery';

import 'ui/html_editor';
import DeltaConverter from '__internal/ui/html_editor/converters/m_delta';
import { getQuill } from 'ui/html_editor/quill_importer';
import keyboardMock from '../../../helpers/keyboardMock.js';

const HTML_EDITOR_CONTENT_CLASS = 'dx-htmleditor-content';

const { test, module: testModule } = QUnit;

testModule('Delta converter', {
    beforeEach: function() {
        const Quill = getQuill();
        this.deltaConverter = new DeltaConverter();
        this.quillInstance = new Quill($('#htmlEditor').get(0), {});
        this.deltaConverter.setQuillInstance(this.quillInstance);
    } }, () => {
    test('it convert an editor content to semantic HTML markup', function(assert) {
        const deltaOps = [{
            insert: 'test',
            attributes: {
                bold: true
            }
        }];

        this.quillInstance.setContents(deltaOps);

        assert.strictEqual(this.deltaConverter.toHtml(), '<p><strong>test</strong></p>', 'It converts delta operations');
    });

    test('it should respect more the one level indent between list items', function(assert) {
        const deltaOps = [{
            insert: 'item1-1'
        }, {
            insert: '\n',
            attributes: { list: 'bullet' }
        }, {
            insert: 'item3-1'
        }, {
            insert: '\n',
            attributes: {
                indent: 2,
                list: 'bullet'
            }
        }, {
            insert: 'item1-2'
        }, {
            insert: '\n',
            attributes: {
                list: 'bullet'
            }
        }];
        const expected = '<ul><li>item1-1<ul><li><ul><li>item3-1</li></ul></li></ul></li><li>item1-2</li></ul>';

        this.quillInstance.setContents(deltaOps);

        assert.strictEqual(this.deltaConverter.toHtml(), expected, 'convert list with indent more the one step');
    });

    test('it should respect list item attributes', function(assert) {
        const deltaOps = [
            { insert: 'item1' },
            {
                attributes: {
                    align: 'center',
                    list: 'bullet'
                },
                insert: '\n'
            },
            { insert: 'item2' },
            {
                attributes: {
                    align: 'center',
                    indent: 1,
                    list: 'bullet'
                },
                insert: '\n'
            }
        ];
        const expected = '<ul><li class="ql-align-center">item1<ul><li class="ql-align-center">item2</li></ul></li></ul>';

        this.quillInstance.setContents(deltaOps);
        assert.strictEqual(this.deltaConverter.toHtml(), expected, 'converted markup should contains inner styles');
    });

    test('it should return an empty string when editor is empty', function(assert) {
        assert.strictEqual(this.deltaConverter.toHtml(), '', 'editor is empty and converter return an empty string');
    });
});

testModule('Custom list', {
    before: function() {
        const Quill = getQuill();
        this.originalList = Quill.import('formats/list');
        class LatinList extends this.originalList {
            static create(value) {
                const node = super.create(value);

                node.setAttribute('type', 'a');
                return node;
            }
        }

        Quill.register('formats/list', LatinList, true);
    },
    beforeEach: function() {
        const Quill = getQuill();
        this.deltaConverter = new DeltaConverter();
        this.quillInstance = new Quill($('#htmlEditor').get(0), {});
        this.deltaConverter.setQuillInstance(this.quillInstance);
    },
    after: function() {
        getQuill().register('formats/list', this.originalList, true);
    } }, () => {

    [
        { type: 'bullet', tag: 'ul' },
        { type: 'ordered', tag: 'ol' }
    ].forEach(({ type, tag }) => {
        test(`it should respect ${type} list attributes`, function(assert) {
            const deltaOps = [
                { insert: 'item1' },
                {
                    attributes: {
                        list: type
                    },
                    insert: '\n'
                },
                { insert: 'item2' },
                {
                    attributes: {
                        list: type
                    },
                    insert: '\n'
                }
            ];
            const expected = `<${tag}><li type="a">item1</li><li type="a">item2</li></${tag}>`;

            this.quillInstance.setContents(deltaOps);
            assert.strictEqual(this.deltaConverter.toHtml(), expected, `attributes of the ${type} list are correct`);
        });

        test(`indent ${type} list attributes are correct`, function(assert) {
            const deltaOps = [
                { insert: 'item1' },
                {
                    attributes: {
                        list: type
                    },
                    insert: '\n'
                },
                { insert: 'item2' },
                {
                    attributes: {
                        indent: 1,
                        list: type
                    },
                    insert: '\n'
                }
            ];
            const expected = `<${tag}><li type="a">item1<${tag}><li type="a">item2</li></${tag}></li></${tag}>`;

            this.quillInstance.setContents(deltaOps);
            assert.strictEqual(this.deltaConverter.toHtml(), expected, `attributes of the ${type} list are correct`);
        });
    });
});

testModule('converter option', () => {
    test('toHtml and fromHtml should be called once after value option changed', function(assert) {
        const toHtmlStub = sinon.stub();
        const fromHtmlStub = sinon.stub();

        const converter = {
            toHtml: toHtmlStub,
            fromHtml: fromHtmlStub,
        };

        const instance = $('#htmlEditor').dxHtmlEditor({
            converter,
        }).dxHtmlEditor('instance');

        instance.option('value', 'new value');

        assert.strictEqual(toHtmlStub.callCount, 1);
        assert.strictEqual(fromHtmlStub.callCount, 1);
    });

    test('toHtml and fromHtml must be called the correct number of times after the character has been entered', function(assert) {
        const clock = sinon.useFakeTimers();
        const toHtmlStub = sinon.stub();
        const fromHtmlStub = sinon.stub();
        const done = assert.async();

        try {
            const converter = {
                toHtml: toHtmlStub,
                fromHtml: fromHtmlStub,
            };

            const instance = $('#htmlEditor').dxHtmlEditor({
                converter,
                onValueChanged: () => {
                    assert.strictEqual(toHtmlStub.callCount, 0);
                    assert.strictEqual(fromHtmlStub.callCount, 1);

                    done();
                },
            }).dxHtmlEditor('instance');

            instance.focus();

            clock.tick(500);

            const input = instance.$element().find(`.${HTML_EDITOR_CONTENT_CLASS}`).get(0);

            keyboardMock(input).type('t').change();
            input.textContent = 't';
        } finally {
            clock.restore();
        }
    });

    [
        '',
        'string',
        true,
        false,
        null,
        undefined,
        NaN,
        4,
        Infinity,
        -Infinity,
        {},
    ].forEach(returnedValue => {
        test(`There is no error here if the toHtml return value is ${returnedValue}`, function(assert) {
            const converter = {
                toHtml: () => returnedValue,
                fromHtml: (value) => value,
            };

            const instance = $('#htmlEditor').dxHtmlEditor({
                converter,
            }).dxHtmlEditor('instance');

            try {
                instance.option('value', '');
            } catch(e) {
                assert.ok(false, `error: ${e.message}`);
            } finally {
                assert.ok(true, 'there is no error');
            }
        });

        test(`There is no error here if the fromHtml return value is ${returnedValue}`, function(assert) {
            const converter = {
                toHtml: (value) => value,
                fromHtml: () => returnedValue,
            };

            const instance = $('#htmlEditor').dxHtmlEditor({
                converter,
            }).dxHtmlEditor('instance');

            try {
                instance.option('value', '');
            } catch(e) {
                assert.ok(false, `error: ${e.message}`);
            } finally {
                assert.ok(true, 'there is no error');
            }
        });
    });
});
