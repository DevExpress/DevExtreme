import $ from 'jquery';
import { TextEditorLabel } from 'ui/text_box/ui.text_editor.label';
import { getWidth } from 'core/utils/size';

const TEXTEDITOR_LABEL_CLASS = 'dx-texteditor-label';

const LABEL_BEFORE_SELECTOR = '.dx-label-before';
const LABEL_SELECTOR = '.dx-label';
const LABEL_AFTER_SELECTOR = '.dx-label-after';

QUnit.testStart(function() {
    const markup = '<div id="textEditor"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('textEditorLabel', {
    beforeEach: function() {
        this.$editor = $('#textEditor');
        this.labelInitialConfig = {
            $editor: this.$editor,
            text: 'Label',
            mark: '*',
            mode: 'static',
            beforeWidth: 7,
            containerWidth: 180
        };
        this.init = (options) => {
            this.label = new TextEditorLabel($.extend({}, this.labelInitialConfig, options));
            this.$label = this.label.$element();
            this.getBeforeElement = () => this.$label.find(LABEL_BEFORE_SELECTOR);
            this.getLabelElement = () => this.$label.find(LABEL_SELECTOR);
            this.getSpan = () => this.getLabelElement().find('span');
        };
        this.reinit = (options) => {
            this.label = null;
            this.$label.remove();

            this.init(options);
        };

        this.init({});
    }
}, () => {
    QUnit.module('render', () => {
        QUnit.test('base markup', function(assert) {
            assert.ok(this.getBeforeElement().length, 'label has before element');
            assert.ok(this.getLabelElement().length, 'label has internal element');
            assert.ok(this.$label.find(LABEL_AFTER_SELECTOR).length, 'label has after element');

            assert.ok(this.getSpan().length, 'internal label has span');
        });

        QUnit.test('root element should have dx-texteditor-label class', function(assert) {
            assert.ok(this.$label.hasClass(TEXTEDITOR_LABEL_CLASS));
        });

        QUnit.test('span should have text equal to text prop', function(assert) {
            assert.strictEqual(this.getSpan().text(), this.labelInitialConfig.text, 'text is correct');
        });

        QUnit.test('span should have data-mark requal to mark prop', function(assert) {
            assert.strictEqual(this.getSpan().attr('data-mark'), this.labelInitialConfig.mark, 'mark is correct');
        });

        QUnit.test('label before element should have width equal to beforeWidth prop', function(assert) {
            const beforeWidth = getWidth(this.getBeforeElement());

            assert.strictEqual(beforeWidth, this.labelInitialConfig.beforeWidth, 'before element width is correct');
        });

        QUnit.test('label internal element should have width equal to containerWidth prop', function(assert) {
            const labelWidth = getWidth(this.getLabelElement());

            assert.strictEqual(labelWidth, this.labelInitialConfig.containerWidth, 'label internal element width is correct');
        });
    });

    QUnit.module('public methods', () => {
        QUnit.test('updateText', function(assert) {
            const newText = 'LabelNew';
            this.label.updateText(newText);

            assert.strictEqual(this.getSpan().text(), newText, 'text is updated');
        });

        QUnit.test('updateMark', function(assert) {
            const newMark = ':';
            this.label.updateMark(newMark);

            assert.strictEqual(this.getSpan().attr('data-mark'), newMark, 'span mark is updated');
        });

        QUnit.test('updateBeforeWidth', function(assert) {
            const newBeforeWidth = 200;
            this.label.updateBeforeWidth(newBeforeWidth);

            const labelBeforeWidth = getWidth(this.getBeforeElement());
            assert.strictEqual(labelBeforeWidth, newBeforeWidth, 'before element width is updated');
        });

        QUnit.test('updateWidth', function(assert) {
            const newContainerWidth = 300;
            this.label.updateWidth(newContainerWidth);

            const labelWidth = getWidth(this.getLabelElement());
            assert.strictEqual(labelWidth, newContainerWidth, 'label width is updated');
        });
    });
});
