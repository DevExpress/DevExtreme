import $ from 'jquery';
import { TextEditorLabel } from 'ui/text_box/ui.text_editor.label';
import { getWidth } from 'core/utils/size';

const TEXTEDITOR_LABEL_CLASS = 'dx-texteditor-label';
const LABEL_BEFORE_SELECTOR = '.dx-label-before';
const LABEL_SELECTOR = '.dx-label';
const LABEL_AFTER_SELECTOR = '.dx-label-after';

QUnit.testStart(function() {
    const markup =
        '<div id="textEditor"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('texteditor_label', {
    beforeEach: function() {
        this.editor = $('#textEditor');
        this.label = new TextEditorLabel({
            $editor: this.editor,
            text: 'Label',
            mark: '*',
            beforeWidth: 7,
            containerWidth: 180
        });
    }
}, () => {
    QUnit.module('label murkup', () => {
        QUnit.test('check label root element', function(assert) {
            assert.equal(this.label.$element().length, 1, 'root element is created');
            assert.ok(this.label.$element().hasClass(TEXTEDITOR_LABEL_CLASS), 'right root element class');
        });

        QUnit.test('check label before element', function(assert) {
            assert.equal(this.label.$element().find(LABEL_BEFORE_SELECTOR).length, 1, 'label has before element');
        });

        QUnit.test('check label after element', function(assert) {
            assert.equal(this.label.$element().find(LABEL_AFTER_SELECTOR).length, 1, 'label has after element');
        });


        QUnit.test('check label element', function(assert) {
            assert.equal(this.label.$element().find(LABEL_SELECTOR).length, 1, 'label has internal element');
        });


        QUnit.test('check label text', function(assert) {
            assert.equal(this.label.$element().text(), 'Label', 'right label text');
        });


        QUnit.test('check label mark', function(assert) {
            assert.equal(this.label.$element().find('span').attr('data-mark'), '*', 'right label mark');
        });

        QUnit.test('check label before width', function(assert) {
            assert.equal(getWidth(this.label.$element().find(LABEL_BEFORE_SELECTOR)), 7, 'right label before width');
        });


        QUnit.test('check label width', function(assert) {
            assert.equal(getWidth(this.label.$element().find(LABEL_SELECTOR)), 180, 'right label width');
        });

    });
    QUnit.module('public methods', () => {
        QUnit.test('check label text after update', function(assert) {

            this.label.updateText('LabelNew');

            assert.strictEqual(this.label.$element().text(), 'LabelNew', 'right label text');
        });


        QUnit.test('check label mark after update', function(assert) {

            this.label.updateMark(':');

            assert.strictEqual(this.label.$element().find('span').attr('data-mark'), ':', 'right label mark');
        });


        QUnit.test('check label before element width after update', function(assert) {

            this.label.updateBeforeWidth(200);

            assert.strictEqual(getWidth(this.label.$element().find(LABEL_BEFORE_SELECTOR)), 200, 'right before width');
        });

        QUnit.test('check label element width after update', function(assert) {

            this.label.updateWidth(300);

            assert.strictEqual(getWidth(this.label.$element().find(LABEL_SELECTOR)), 300, 'right label width');
        });
    });
});
