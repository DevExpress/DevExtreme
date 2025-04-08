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
const DROP_DOWN_BUTTON_CLASS = 'dx-dropdownbutton';
const BUTTON_CLASS = 'dx-button';
const LIST_ITEM_CLASS = 'dx-list-item';
const OVERLAY_CLASS = 'dx-overlay-content';

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#htmlEditor');
        this.componentMock = {
            _createComponent: ($container, Widget, options) => {
                return new Widget($container, options);
            },
            $element: () => this.$element,
        };

        this.aiDialog = new AiDialog(this.componentMock, {}, { container: this.$element });
    }
};

QUnit.module('AiDialog', moduleConfig, () => {
    QUnit.test('Should render AI dialog content', function(assert) {
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

        this.aiDialog.show(payload);

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
        const commandsMap = {
            translate: {
                name: 'summarize',
            }
        };

        const payload = {
            currentCommand: 'summarize',
            commandsMap,
        };

        this.aiDialog.show(payload);

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
        const promise = this.aiDialog.show({
            currentCommand: 'translate',
            commandsMap: {
                translate: { name: 'translate' }
            }
        });

        assert.strictEqual(isPromise(promise), true, 'show() returns promise');
    });

    QUnit.test('Cancel via popup hide triggers reject', function(assert) {
        const promise = this.aiDialog.show({
            currentCommand: 'translate',
            commandsMap: {
                translate: { name: 'translate' }
            }
        });

        promise.fail((data) => {
            assert.strictEqual(data, undefined, 'Dialog was cancelled, no data');
        });

        this.aiDialog._popup.hide();
    });

    QUnit.test('Command change updates options and result', function(assert) {
        const commandsMap = {
            translate: {
                name: 'translate',
                text: 'Translate',
                options: ['english', 'german']
            },
            summarize: {
                name: 'summarize',
                text: 'Summarize',
            }
        };

        this.aiDialog.show({
            currentCommand: 'translate',
            currentCommandOption: 'german',
            commandsMap,
            text: 'Initial',
        });

        const $commandSelect = this.$element.find(`.${SELECT_BOX_CLASS}`).eq(0);
        const commandSelectBox = $commandSelect.dxSelectBox('instance');

        const $optionSelect = this.$element.find(`.${SELECT_BOX_CLASS}`).eq(1);
        const optionSelectBox = $optionSelect.dxSelectBox('instance');

        assert.strictEqual(optionSelectBox.option('visible'), true, 'Option select is initially visible');

        commandSelectBox.option('value', 'summarize');

        assert.strictEqual(optionSelectBox.option('visible'), false, 'Option select hidden after changing command');
        assert.strictEqual(commandSelectBox.option('value'), 'summarize', 'Command updated');
    });

    QUnit.test('Clicking "Replace" resolves with correct payload', function(assert) {
        const done = assert.async();
        const hideSpy = sinon.spy(this.aiDialog, 'hide');

        const commandsMap = {
            translate: {
                name: 'translate',
                text: 'Translate',
                options: ['english', 'german']
            }
        };

        this.aiDialog.show({
            currentCommand: 'translate',
            currentCommandOption: 'english',
            commandsMap,
            text: 'Test text',
        }).done((resultText, event) => {
            assert.strictEqual(resultText, 'Test text', 'Correct text resolved');
            assert.strictEqual(event.itemData.id, 'replace', 'Correct operation: replace');
            done();
        });

        const $replaceDropDown = this.$element.find(`.${DROP_DOWN_BUTTON_CLASS} .${BUTTON_CLASS}`).eq(0);
        $replaceDropDown.trigger('dxclick');

        const $replaceButton = $(`.${OVERLAY_CLASS} .${LIST_ITEM_CLASS}`).eq(0);
        $replaceButton.trigger('dxclick');

        assert.strictEqual(hideSpy.calledOnce, true, 'hide called');
    });

    QUnit.test('Clicking "Insert above" resolves with correct payload', function(assert) {
        const done = assert.async();
        const hideSpy = sinon.spy(this.aiDialog, 'hide');

        const commandsMap = {
            translate: {
                name: 'translate',
                text: 'Translate',
                options: ['english', 'german']
            }
        };

        this.aiDialog.show({
            currentCommand: 'translate',
            currentCommandOption: 'english',
            commandsMap,
            text: 'Test text',
        }).done((resultText, event) => {
            assert.strictEqual(resultText, 'Test text', 'Correct text resolved');
            assert.strictEqual(event.itemData.id, 'insertAbove', 'Correct operation: insert above');
            done();
        });

        const $replaceDropDown = this.$element.find(`.${DROP_DOWN_BUTTON_CLASS} .${BUTTON_CLASS}`).eq(0);
        $replaceDropDown.trigger('dxclick');

        const $replaceButton = $(`.${OVERLAY_CLASS} .${LIST_ITEM_CLASS}`).eq(1);
        $replaceButton.trigger('dxclick');

        assert.strictEqual(hideSpy.calledOnce, true, 'hide called');
    });

    QUnit.test('Clicking "Insert below" resolves with correct payload', function(assert) {
        const done = assert.async();
        const hideSpy = sinon.spy(this.aiDialog, 'hide');

        const commandsMap = {
            translate: {
                name: 'translate',
                text: 'Translate',
                options: ['english', 'german']
            }
        };

        this.aiDialog.show({
            currentCommand: 'translate',
            currentCommandOption: 'english',
            commandsMap,
            text: 'Test text',
        }).done((resultText, event) => {
            assert.strictEqual(resultText, 'Test text', 'Correct text resolved');
            assert.strictEqual(event.itemData.id, 'insertBelow', 'Correct operation: insert below');
            done();
        });

        const $replaceDropDown = this.$element.find(`.${DROP_DOWN_BUTTON_CLASS} .${BUTTON_CLASS}`).eq(0);
        $replaceDropDown.trigger('dxclick');

        const $replaceButton = $(`.${OVERLAY_CLASS} .${LIST_ITEM_CLASS}`).eq(2);
        $replaceButton.trigger('dxclick');

        assert.strictEqual(hideSpy.calledOnce, true, 'hide called');
    });

    QUnit.testInActiveWindow('Copy button triggers clipboard write', function(assert) {
        const clipboardSpy = sinon.stub(navigator.clipboard, 'writeText');

        this.aiDialog.show({
            currentCommand: 'translate',
            commandsMap: {
                translate: { name: 'translate', text: 'Translate' }
            },
            text: 'Test value',
        });

        const $copyButton = this.$element.find(`.${BUTTON_CLASS}`).filter((_, el) => {
            return $(el).text() === 'Copy';
        });

        $copyButton.trigger('dxclick');

        assert.strictEqual(clipboardSpy.calledWith('Test value'), true, 'Copied correct text');
        clipboardSpy.restore();
    });

    QUnit.test('Try again button triggers _retryAIRequest', function(assert) {
        const retrySpy = sinon.spy(this.aiDialog, '_retryAIRequest');

        this.aiDialog.show({
            currentCommand: 'translate',
            commandsMap: {
                translate: { name: 'translate', text: 'Translate' }
            }
        });

        const $tryAgainButton = this.$element.find(`.${BUTTON_CLASS}`).filter((_, el) => {
            return $(el).text() === 'Try again';
        });

        $tryAgainButton.trigger('dxclick');
        assert.strictEqual(retrySpy.calledOnce, true, 'Try again handler called');
    });
});
