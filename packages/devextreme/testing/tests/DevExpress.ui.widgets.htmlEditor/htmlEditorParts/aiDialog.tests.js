import $ from 'jquery';
import AiDialog from '__internal/ui/html_editor/ui/aiDialog';
import { isPromise } from 'core/utils/type';

import 'ui/menu';
import 'ui/popup';
import 'ui/text_area';
import 'ui/select_box';

const AI_DIALOG_CONTENT_CLASS = 'dx-aidialog-content';
const AI_DIALOG_CONTROLS_CLASS = 'dx-aidialog-controls';
const DIALOG_CLASS = 'dx-formdialog';
const TEXT_AREA_CLASS = 'dx-textarea';
const SELECT_BOX_CLASS = 'dx-selectbox';

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#htmlEditor');
        this.componentMock = {
            _createComponent: ($container, Widget, options) => {
                return new Widget($container, options);
            },
            $element: () => this.$element,
        };
    }
};

QUnit.module('AiDialog', moduleConfig, () => {
    QUnit.test('Should render AI dialog content', function(assert) {
        const aiDialog = new AiDialog(this.componentMock, {}, { container: this.$element });

        const commandsMap = {
            translate: {
                name: 'translate',
                text: 'Translate',
                options: ['english', 'german']
            }
        };

        const payload = {
            currentCommand: 'translate',
            currentCommandOption: 'english',
            commandsMap,
            text: 'Test text',
        };

        aiDialog.show(payload);

        const $wrapper = this.$element.find(`.${DIALOG_CLASS}`);
        const $aiContent = $wrapper.find(`.${AI_DIALOG_CONTENT_CLASS}`);
        assert.strictEqual($aiContent.length, 1, 'AI dialog content rendered');

        const $controls = $aiContent.find(`.${AI_DIALOG_CONTROLS_CLASS}`);
        assert.strictEqual($controls.length, 1, 'Controls container rendered');

        const $selectBoxes = $aiContent.find(`.${SELECT_BOX_CLASS}`);
        assert.strictEqual($selectBoxes.length, 2, 'Two SelectBox components rendered');

        const commandSelectBox = $selectBoxes.eq(0).dxSelectBox('instance');
        const optionSelectBox = $selectBoxes.eq(1).dxSelectBox('instance');
        const commandSelectDataSource = commandSelectBox.option('dataSource').map((item) => item.name);

        assert.ok(commandSelectBox, 'Command SelectBox instance created');
        assert.strictEqual(commandSelectBox.option('value'), 'translate', 'Correct command selected');
        assert.deepEqual(commandSelectDataSource, ['translate'], 'Command SelectBox contains correct items');

        assert.ok(optionSelectBox, 'Option SelectBox instance created');
        assert.strictEqual(optionSelectBox.option('value'), 'english', 'Correct option selected');
        assert.deepEqual(optionSelectBox.option('items'), ['english', 'german'], 'Option SelectBox contains correct items');

        const $textArea = $aiContent.find(`.${TEXT_AREA_CLASS}`);
        assert.strictEqual($textArea.length, 1, 'TextArea rendered');

        const textAreaInstance = $textArea.dxTextArea('instance');
        assert.strictEqual(textAreaInstance.option('value'), 'Test text', 'TextArea contains correct text');
    });

    QUnit.test('Should not render option select if command has no options', function(assert) {
        const aiDialog = new AiDialog(this.componentMock, {}, { container: this.$element });

        const commandsMap = {
            translate: {
                name: 'summarize',
            }
        };

        const payload = {
            currentCommand: 'summarize',
            commandsMap,
        };

        aiDialog.show(payload);

        const $wrapper = this.$element.find(`.${DIALOG_CLASS}`);
        const $aiContent = $wrapper.find(`.${AI_DIALOG_CONTENT_CLASS}`);

        const $controls = $aiContent.find(`.${AI_DIALOG_CONTROLS_CLASS}`);
        assert.strictEqual($controls.length, 1, 'Controls container rendered');

        const $selectBoxes = $aiContent.find(`.${SELECT_BOX_CLASS}`);

        const commandSelectBox = $selectBoxes.eq(0).dxSelectBox('instance');
        const optionSelectBox = $selectBoxes.eq(1).dxSelectBox('instance');

        assert.strictEqual(
            optionSelectBox.option('visible'),
            false,
            'Option SelectBox visibility is false'
        );

        assert.ok(commandSelectBox, 'Command SelectBox instance created');
        assert.strictEqual(commandSelectBox.option('value'), 'summarize', 'Correct command selected');
    });

    QUnit.test('show returns a promise', function(assert) {
        const aiDialog = new AiDialog(this.componentMock, {}, { container: this.$element });

        const promise = aiDialog.show({
            currentCommand: 'translate',
            commandsMap: {
                translate: { name: 'translate' }
            }
        });

        assert.ok(isPromise(promise), 'show() returns promise');
    });

    QUnit.test('Cancel via popup hide triggers reject', function(assert) {
        assert.expect(1);

        const aiDialog = new AiDialog(this.componentMock, {}, { container: this.$element });
        const promise = aiDialog.show({
            currentCommand: 'translate',
            commandsMap: {
                translate: { name: 'translate' }
            }
        });

        promise.fail((data) => {
            assert.notOk(data, 'Dialog was cancelled, no data');
        });

        aiDialog._popup.hide();
    });
});
