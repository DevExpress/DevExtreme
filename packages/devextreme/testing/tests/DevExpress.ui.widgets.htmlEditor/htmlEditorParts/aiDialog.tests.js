import $ from 'jquery';
import AiDialog from '__internal/ui/html_editor/ui/aiDialog';
import { isPromise } from 'core/utils/type';
import {
    showAiDialog,
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
        this.componentMock = {
            _createComponent: ($container, Widget, options) => {
                return new Widget($container, options);
            },
            $element: () => this.$element,
        };

        this.aiDialog = new AiDialog(this.componentMock, {}, { container: this.$element });
    },
};

QUnit.module('AiDialog', moduleConfig, () => {
    QUnit.test('Should render AI dialog content with correct values', function(assert) {
        showAiDialog(this);

        const $wrapper = this.$element.find(`.${AI_DIALOG_CLASS}`);
        const $aiContent = $wrapper.find(`.${AI_DIALOG_CONTENT_CLASS}`);
        const $controls = $aiContent.find(`.${AI_DIALOG_CONTROLS_CLASS}`);
        const $selectBoxes = $controls.find(`.${SELECT_BOX_CLASS}`);
        const $textArea = $aiContent.find(`.${TEXT_AREA_CLASS}`);
        const commandSelectBox = $selectBoxes.eq(0).dxSelectBox('instance');
        const optionSelectBox = $selectBoxes.eq(1).dxSelectBox('instance');
        const commandSelectDataSource = commandSelectBox.option('dataSource').map((item) => item.name);
        const textAreaInstance = $textArea.dxTextArea('instance');

        assert.strictEqual($aiContent.length, 1, 'AI dialog content rendered');
        assert.strictEqual($controls.length, 1, 'controls container rendered');
        assert.strictEqual($selectBoxes.length, 2, 'two SelectBox components rendered');
        assert.strictEqual(commandSelectBox.option('value'), 'translate', 'correct command selected');
        assert.deepEqual(commandSelectDataSource, ['translate', 'summarize'], 'command SelectBox contains correct items');
        assert.strictEqual(optionSelectBox.option('value'), 'english', 'correct option selected');
        assert.deepEqual(optionSelectBox.option('items'), ['english', 'german'], 'option SelectBox contains correct items');
        assert.strictEqual($textArea.length, 1, 'TextArea rendered');
        assert.strictEqual(textAreaInstance.option('value'), 'Test text', 'TextArea contains correct text');
    });

    QUnit.test('Should hide option SelectBox if command has no options', function(assert) {
        showAiDialog(this, { isBasicCommand: true, config: { currentCommand: 'summarize' } });

        const optionSelectBox = getOptionSelectBoxInstance(this.$element);

        assert.strictEqual(optionSelectBox.option('visible'), false, 'Option SelectBox visibility is false');
    });

    QUnit.test('Should return a promise', function(assert) {
        const promise = showAiDialog(this);

        assert.strictEqual(isPromise(promise), true, 'show() returns promise');
    });

    QUnit.test('Should reject promise on hide', function(assert) {
        const promise = showAiDialog(this);

        promise.fail((data) => {
            assert.strictEqual(data, undefined, 'dialog was cancelled, no data');
        });

        this.aiDialog._popup.hide();
    });

    QUnit.test('Should hide options SelectBox if command with no options selected', function(assert) {
        showAiDialog(this);

        const commandSelectBox = getCommandSelectBoxInstance(this.$element);
        const optionSelectBox = getOptionSelectBoxInstance(this.$element);

        assert.strictEqual(optionSelectBox.option('visible'), true, 'option SelectBox is initially visible');

        commandSelectBox.option('value', 'summarize');

        assert.strictEqual(optionSelectBox.option('visible'), false, 'option SelectBox hidden after changing command');
    });

    QUnit.test('Should show options SelectBox and select first option if command with options selected', function(assert) {
        showAiDialog(this, { isBasicCommand: false, config: { currentCommand: 'summarize' } });

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

            showAiDialog(this).done(({ resultText, event }) => {
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

        showAiDialog(this);

        const $copyButton = findButtonByText(this.$element, 'Copy');
        $copyButton.trigger('dxclick');

        assert.strictEqual(clipboardStub.calledWith('Test text'), true, 'copied correct text');

        clipboardStub.restore();
    });

    QUnit.test('Popup config should contain correct parameters', function(assert) {
        const popup = this.aiDialog._popup;
        const popupConfig = popup.option();

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
