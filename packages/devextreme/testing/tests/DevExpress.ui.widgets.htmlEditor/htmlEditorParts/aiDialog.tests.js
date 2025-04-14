import $ from 'jquery';
import AIDialog from '__internal/ui/html_editor/ui/aiDialog';
import { isPromise } from 'core/utils/type';
import {
    showAIDialog,
    clickActionButton,
    findButtonByText,
    getCommandSelectBoxInstance,
    getOptionSelectBoxInstance
} from '../../../helpers/aiDialog.js';

import 'ui/menu';
import 'ui/popup';
import 'ui/text_area';
import 'ui/select_box';

const AI_DIALOG_CLASS = 'dx-aidialog';
const AI_DIALOG_CONTENT_CLASS = 'dx-aidialog-content';
const AI_DIALOG_CONTROLS_CLASS = 'dx-aidialog-controls';
const TEXT_AREA_CLASS = 'dx-textarea';
const SELECT_BOX_CLASS = 'dx-selectbox';

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#htmlEditor');

        this.aiDialog = new AIDialog(this.$element, {}, { container: this.$element });
    },
};

QUnit.module('AIDialog', moduleConfig, () => {
    QUnit.test('Should render AI dialog content with correct values', function(assert) {
        showAIDialog(this);

        const $wrapper = this.$element.find(`.${AI_DIALOG_CLASS}`);
        const $aiContent = $wrapper.find(`.${AI_DIALOG_CONTENT_CLASS}`);
        const $controls = $aiContent.find(`.${AI_DIALOG_CONTROLS_CLASS}`);
        const $selectBoxes = $controls.find(`.${SELECT_BOX_CLASS}`);
        const $textAreas = $aiContent.find(`.${TEXT_AREA_CLASS}`);
        const $promptTextArea = $textAreas.eq(0);
        const $resultTextArea = $textAreas.eq(1);
        const commandSelectBox = $selectBoxes.eq(0).dxSelectBox('instance');
        const optionSelectBox = $selectBoxes.eq(1).dxSelectBox('instance');
        const commandSelectDataSource = commandSelectBox.option('dataSource').map((item) => item.name);
        const resultTextAreaInstance = $resultTextArea.dxTextArea('instance');
        const promptTextAreaInstance = $promptTextArea.dxTextArea('instance');


        assert.strictEqual($aiContent.length, 1, 'AI dialog content rendered');
        assert.strictEqual($controls.length, 1, 'controls container rendered');
        assert.strictEqual($selectBoxes.length, 2, 'two SelectBox components rendered');
        assert.strictEqual(commandSelectBox.option('value'), 'translate', 'correct command selected');
        assert.deepEqual(commandSelectDataSource, ['translate', 'summarize'], 'command SelectBox contains correct items');
        assert.strictEqual(optionSelectBox.option('value'), 'english', 'correct option selected');
        assert.deepEqual(optionSelectBox.option('items'), ['english', 'german'], 'option SelectBox contains correct items');
        assert.strictEqual($textAreas.length, 2, 'TextAreas are rendered');
        assert.strictEqual(resultTextAreaInstance.option('value'), 'Test text', 'result TextArea contains correct text');
        assert.strictEqual(promptTextAreaInstance.option('value'), '', 'prompt TextArea contains correct text');
        assert.strictEqual(promptTextAreaInstance.option('visible'), false, 'prompt TextArea is hidden by default');
    });

    QUnit.test('Should hide option SelectBox if command has no options', function(assert) {
        showAIDialog(this, { isBasicCommand: true, config: { currentCommand: 'summarize' } });

        const optionSelectBox = getOptionSelectBoxInstance(this.$element);

        assert.strictEqual(optionSelectBox.option('visible'), false, 'Option SelectBox visibility is false');
    });

    QUnit.test('Should return a promise', function(assert) {
        const promise = showAIDialog(this);

        assert.strictEqual(isPromise(promise), true, 'show() returns promise');
    });

    QUnit.test('Should reject promise on hide', function(assert) {
        const promise = showAIDialog(this);

        promise.fail((data) => {
            assert.strictEqual(data, undefined, 'dialog was cancelled, no data');
        });

        this.aiDialog._popup.hide();
    });

    QUnit.test('Should hide options SelectBox if command with no options selected', function(assert) {
        showAIDialog(this);

        const commandSelectBox = getCommandSelectBoxInstance(this.$element);
        const optionSelectBox = getOptionSelectBoxInstance(this.$element);

        assert.strictEqual(optionSelectBox.option('visible'), true, 'option SelectBox is initially visible');

        commandSelectBox.option('value', 'summarize');

        assert.strictEqual(optionSelectBox.option('visible'), false, 'option SelectBox hidden after changing command');
    });

    QUnit.test('Should show options SelectBox and select first option if command with options selected', function(assert) {
        showAIDialog(this, { isBasicCommand: false, config: { currentCommand: 'summarize' } });

        const commandSelectBox = getCommandSelectBoxInstance(this.$element);
        const optionSelectBox = getOptionSelectBoxInstance(this.$element);

        assert.strictEqual(optionSelectBox.option('visible'), false, 'option SelectBox is initially not visible');

        commandSelectBox.option('value', 'translate');

        assert.strictEqual(optionSelectBox.option('visible'), true, 'option SelectBox is visible after changing command');
        assert.strictEqual(optionSelectBox.option('value'), 'english', 'first command option is selected after command change');
    });

    ['replace', 'insertAbove', 'insertBelow'].forEach((mode) => {
        QUnit.test(`Should resolve with correct payload on ${mode} click`, function(assert) {
            const done = assert.async();
            const hideSpy = sinon.spy(this.aiDialog, 'hide');

            showAIDialog(this).done(({ resultText, event }) => {
                assert.strictEqual(resultText, 'Test text', 'resolved text is correct');
                assert.strictEqual(event.itemData.id, mode, `operation is correct: ${mode}`);
                assert.strictEqual(hideSpy.calledOnce, true, 'hide called');
                done();
            });

            clickActionButton(mode);
        });
    });

    QUnit.test('Copy button triggers clipboard write', function(assert) {
        if(!navigator.clipboard) {
            assert.ok(true, 'clipboard not supported in this environment');
            return;
        }

        const clipboardStub = sinon.stub(navigator.clipboard, 'writeText');

        showAIDialog(this);

        const $copyButton = findButtonByText(this.$element, 'Copy');
        $copyButton.trigger('dxclick');

        assert.strictEqual(clipboardStub.calledWith('Test text'), true, 'copied correct text');

        clipboardStub.restore();
    });

    QUnit.test('Should trigger generation on Try again button click', function(assert) {
        showAIDialog(this, { config: { currentCommand: 'summarize' } });

        const generateSpy = sinon.spy(this.aiDialog, '_generateAIResponse');

        const $tryAgainButton = findButtonByText(this.$element, 'Try again');
        $tryAgainButton.trigger('dxclick');

        assert.strictEqual(generateSpy.calledOnce, true, 'retry triggered generate');
    });

    QUnit.test('Ask AI - Should render correct UI', function(assert) {
        showAIDialog(this, {
            config: { currentCommand: 'askAI' }
        });

        const $promptTextArea = this.$element.find(`.${TEXT_AREA_CLASS}`).eq(0);
        const $resultTextArea = this.$element.find(`.${TEXT_AREA_CLASS}`).eq(1);
        const promptTextAreaInstance = $promptTextArea.dxTextArea('instance');
        const resultTextAreaInstance = $resultTextArea.dxTextArea('instance');
        const popup = this.aiDialog._popup;
        const toolbarItems = popup.option('toolbarItems');
        const buttonTexts = toolbarItems
            .filter(item => item.widget === 'dxButton')
            .map(item => item.options.text);

        assert.strictEqual(promptTextAreaInstance.option('visible'), true, 'prompt TextArea is visible');
        assert.strictEqual(resultTextAreaInstance.option('visible'), false, 'result TextArea is hidden initially');
        assert.strictEqual(promptTextAreaInstance.option('disabled'), false, 'prompt TextArea is editable');

        assert.deepEqual(
            buttonTexts,
            ['Generate', 'Stop'],
            'toolbar contains correct buttons for Ask AI mode'
        );
    });

    QUnit.test('Ask AI - Should render correct content after generation', function(assert) {
        showAIDialog(this, {
            config: { currentCommand: 'askAI' }
        });

        const $generateButton = findButtonByText(this.$element, 'Generate');
        $generateButton.trigger('dxclick');

        const $promptTextArea = this.$element.find(`.${TEXT_AREA_CLASS}`).eq(0);
        const $resultTextArea = this.$element.find(`.${TEXT_AREA_CLASS}`).eq(1);
        const promptInstance = $promptTextArea.dxTextArea('instance');
        const resultInstance = $resultTextArea.dxTextArea('instance');
        const popup = this.aiDialog._popup;
        const toolbarItems = popup.option('toolbarItems');

        const buttonTexts = toolbarItems
            .filter(item => ['dxButton', 'dxDropDownButton'].includes(item.widget))
            .map(item => item.options.text);

        assert.strictEqual(promptInstance.option('disabled'), true, 'prompt now disabled');
        assert.strictEqual(resultInstance.option('visible'), true, 'result TextArea is visible');
        assert.deepEqual(
            buttonTexts,
            ['Replace', 'Try again', 'Copy'],
            'Toolbar contains correct buttons after generation'
        );
    });

    QUnit.test('Ask AI - Should reset state after clicking Stop', function(assert) {
        showAIDialog(this, {
            config: { currentCommand: 'askAI' }
        });

        const instance = this.aiDialog;
        instance['_setDialogState']('generating');

        const $stopButton = findButtonByText(this.$element, 'Stop');
        $stopButton.trigger('dxclick');

        const $textAreas = this.$element.find(`.${TEXT_AREA_CLASS}`);
        const promptTextArea = $textAreas.eq(0).dxTextArea('instance');
        const resultTextArea = $textAreas.eq(1).dxTextArea('instance');

        const toolbarItems = instance._popup.option('toolbarItems');
        const buttonTexts = toolbarItems
            .filter(item => item.widget === 'dxButton')
            .map(item => item.options.text);

        assert.strictEqual(promptTextArea.option('visible'), true, 'prompt TextArea is visible');
        assert.strictEqual(promptTextArea.option('disabled'), false, 'prompt TextArea is not disabled');
        assert.strictEqual(promptTextArea.option('height'), 64, 'prompt TextArea has expanded height');
        assert.strictEqual(resultTextArea.option('visible'), false, 'result TextArea is hidden');

        assert.deepEqual(
            buttonTexts,
            ['Generate', 'Stop'],
            'toolbar reset to Ask AI state with correct buttons'
        );
    });

    QUnit.test('Ask AI - Should reset fields when switching to a basic command', function(assert) {
        showAIDialog(this, {
            config: { currentCommand: 'askAI' }
        });

        const commandSelectBox = getCommandSelectBoxInstance(this.$element);
        commandSelectBox.option('value', 'translate');

        const promptTextArea = this.$element.find(`.${TEXT_AREA_CLASS}`).eq(0).dxTextArea('instance');
        const resultTextArea = this.$element.find(`.${TEXT_AREA_CLASS}`).eq(1).dxTextArea('instance');

        assert.strictEqual(promptTextArea.option('visible'), false, 'prompt TextArea is hidden');
        assert.strictEqual(promptTextArea.option('value'), '', 'prompt TextArea is cleared');
        assert.strictEqual(resultTextArea.option('visible'), true, 'result TextArea is visible');
    });

    QUnit.test('Ask AI - Should render correct UI on command change to askAI', function(assert) {
        showAIDialog(this, {
            config: { currentCommand: 'translate' }
        });

        const commandSelectBox = getCommandSelectBoxInstance(this.$element);

        commandSelectBox.option('value', 'askAI');
        const $textAreas = this.$element.find(`.${TEXT_AREA_CLASS}`);
        const promptTextArea = $textAreas.eq(0).dxTextArea('instance');
        const resultTextArea = $textAreas.eq(1).dxTextArea('instance');
        const optionSelectBox = getOptionSelectBoxInstance(this.$element);
        const toolbarItems = this.aiDialog._popup.option('toolbarItems');
        const actualTexts = toolbarItems
            .filter(item => item.widget === 'dxButton')
            .map(item => item.options.text);

        assert.strictEqual(promptTextArea.option('visible'), true, 'prompt TextArea is visible');
        assert.strictEqual(promptTextArea.option('disabled'), false, 'prompt TextArea is editable');
        assert.strictEqual(promptTextArea.option('height'), 64, 'prompt TextArea has expanded height');
        assert.strictEqual(resultTextArea.option('visible'), false, 'result TextArea is hidden');
        assert.strictEqual(optionSelectBox.option('visible'), false, 'option SelectBox hidden for askAI');

        assert.deepEqual(actualTexts, [
            'Generate',
            'Stop'
        ], 'toolbar contains correct buttons for Ask AI');
    });

    QUnit.test('Popup config should contain correct parameters', function(assert) {
        const popup = this.aiDialog._popup;
        const popupConfig = popup.option();
        showAIDialog(this);

        assert.strictEqual(popupConfig.minWidth, 288, 'minWidth is correct');
        assert.strictEqual(popupConfig.maxWidth, 460, 'maxWidth is correct');
        assert.strictEqual(popupConfig.height, 'auto', 'height is auto');
        assert.strictEqual(popupConfig.shadingColor, 'transparent', 'shading is transparent');
        assert.strictEqual(popupConfig.dragEnabled, true, 'dragEnabled is true');
        assert.strictEqual(popupConfig.focusStateEnabled, true, 'focus enabled');
        assert.strictEqual(popupConfig.showCloseButton, true, 'close button is shown');

        const position = popupConfig.position;
        assert.strictEqual(position.my, 'center', 'popup position "my" is center');
        assert.strictEqual(position.at, 'center', 'popup position "at" is center');
        assert.deepEqual(position.of, this.$element, 'position.of points to editor element');

        const toolbarItems = popupConfig.toolbarItems;
        assert.strictEqual(Array.isArray(toolbarItems), true, 'toolbarItems is array');
        assert.strictEqual(toolbarItems.length, 4, '4 toolbar items rendered');

        const dropDownItem = toolbarItems.find(item => item.widget === 'dxDropDownButton');
        assert.deepEqual(dropDownItem.options.items.map(i => i.id), ['replace', 'insertAbove', 'insertBelow'], 'DropDown has correct items');
    });
});
