import DeltaConverter from 'ui/html_editor/converters/delta';
import MarkdownConverter from 'ui/html_editor/converters/markdown';
import { getQuill } from 'ui/html_editor/quill_importer';

const { test } = QUnit;

QUnit.module('Delta converter', {
    beforeEach: function() {
        const Quill = getQuill();
        this.deltaConverter = new DeltaConverter();
        this.quillInstance = new Quill(document.getElementById('htmlEditor'), {});
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
        const expected = '<ul><li>item1-1<ul><ul><li>item3-1</li></ul></li></ul></li><li>item1-2</li></ul>';

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

QUnit.module('Markdown converter', () => {
    test('it convert a HTML to the Markdown', function(assert) {
        const markdownConverter = new MarkdownConverter();
        const html = '<p>Te<strong>st</strong></p>';

        assert.equal(markdownConverter.toMarkdown(html), 'Te**st**', 'It converts a HTML to Markdown');
    });

    test('it convert a Markdown to the HTML', function(assert) {
        const markdownConverter = new MarkdownConverter();
        const markdown = 'Te**st**';

        assert.equal(markdownConverter.toHtml(markdown), '<p>Te<strong>st</strong></p>', 'It converts a Markdown to HTML');
    });
});
