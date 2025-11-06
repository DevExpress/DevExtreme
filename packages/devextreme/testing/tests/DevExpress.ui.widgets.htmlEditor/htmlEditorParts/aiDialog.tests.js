import $ from 'jquery';
import localization from 'localization';
import devices from '__internal/core/m_devices';
import themes from 'ui/themes';
import domAdapter from '__internal/core/m_dom_adapter';
import AIDialog, {
    AI_DIALOG_CLASS,
    AI_DIALOG_CONTROLS_CLASS,
    AI_DIALOG_CONTENT_CLASS,
    AI_DIALOG_TITLE_CLASS,
    REPLACE_DROPDOWN_WIDTH,
    ACTION_BUTTON_WIDTH,
    COMPACT_ACTION_BUTTON_WIDTH,
    TEXT_AREA_MIN_HEIGHT,
    TEXT_AREA_MAX_HEIGHT
} from '__internal/ui/html_editor/ui/aiDialog';
import { BUTTON_GROUP_CLASS } from '__internal/ui/button_group';
import { POPUP_CLASS } from '__internal/ui/popup/m_popup';
import { TEXTAREA_CLASS } from '__internal/ui/m_text_area';
import { TEXTEDITOR_INPUT_CLASS } from '__internal/ui/text_box/m_text_editor.base';
import { SELECTBOX_CLASS } from '__internal/ui/m_select_box';
import { INFORMER_CLASS } from '__internal/ui/informer/informer';
import { BUTTON_CLASS } from '__internal/ui/button/button';
import {
    ANIMATION_TYPE_CLASSES,
    LOADINDICATOR_CONTENT_CLASS,
} from '__internal/ui/load_indicator';
import { AIIntegration } from '__internal/core/ai_integration/core/ai_integration';
import { isPromise } from 'core/utils/type';
import keyboardMock from '../../../helpers/keyboardMock.js';
import {
    buildDefaultCommandsMap,
    clickActionButton,
    getBottomToolbarItems,
    findButtonByName,
    getButtonInstance,
    getCommandSelectBoxInstance,
    getItemByName,
    getLoadIndicator,
    getOptionSelectBoxInstance,
    getPromptTextAreaInstance,
    getResultTextAreaInstance,
    getInformerInstance,
    showAIDialog,
} from '../../../helpers/aiDialog.js';

import 'ui/menu';
import 'ui/popup';
import 'ui/text_area';
import 'ui/select_box';

const moduleConfig = {
    beforeEach() {
        this.$element = $('#htmlEditor');
        this.promise = Promise.resolve('');
        this.aiDialog = new AIDialog(this.$element, new AIIntegration({
            sendRequest: () => ({ promise: this.promise }),
        }), { container: this.$element });
        this.aiDialogPopup = this.aiDialog._popup;
        this.setDialogState = (state) => {
            this.aiDialog['_setDialogState'](state);
        };
    },
    afterEach() {
        sinon.restore();
    }
};

const integrationModuleConfig = {
    beforeEach() {
        this.$element = $('#htmlEditor');
        this.abortSpy = sinon.spy();
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        this.sendRequestStub = sinon.stub().returns({ promise: this.promise, abort: this.abortSpy });
        this.aiIntegration = new AIIntegration({ sendRequest: this.sendRequestStub });
        this.changeStyleStub = sinon.spy(this.aiIntegration, 'changeStyle');
        this.translateStub = sinon.spy(this.aiIntegration, 'translate');
        this.executeStub = sinon.spy(this.aiIntegration, 'execute');
        this.aiDialog = new AIDialog(this.$element, this.aiIntegration, { container: this.$element });
        this.aiDialogPopup = this.aiDialog._popup;
        this.commandsMap = buildDefaultCommandsMap();
        this.promptStub1 = sinon.spy(this.commandsMap.custom0, 'prompt');
        this.promptStub2 = sinon.spy(this.commandsMap.custom2, 'prompt');
        this.showDialog = (payload) => {
            showAIDialog(
                this,
                {
                    config: {
                        commandsMap: this.commandsMap,
                        prompt: this.commandsMap[payload.currentCommand].prompt,
                        ...payload,
                    },
                },
            );
        };
        this.setDialogState = (state) => this.aiDialog['_setDialogState'](state);
        this.getAbort = () => this.aiDialog._abort;
        this.getFocusTarget = (instance) => {
            const focusTarget = instance._focusTarget && instance._focusTarget();
            const element = instance.$element();

            return focusTarget || element;
        };
    },
    afterEach() {
        sinon.restore();
    }
};

function assertConfig(assert, config, expectations) {
    for(const key in expectations) {
        assert.strictEqual(config[key], expectations[key], `${key}=expectations[key]`);
    }
};

QUnit.module('AIDialog', () => {
    QUnit.module('rendering and initial state', moduleConfig, () => {
        QUnit.test('should render AI dialog content with correct values', function(assert) {
            showAIDialog(this);

            const $wrapper = this.$element.find(`.${AI_DIALOG_CLASS}`);
            const $aiContent = $wrapper.find(`.${AI_DIALOG_CONTENT_CLASS}`);
            const $controls = $aiContent.find(`.${AI_DIALOG_CONTROLS_CLASS}`);
            const $selectBoxes = $controls.find(`.${SELECTBOX_CLASS}`);
            const $textAreas = $aiContent.find(`.${TEXTAREA_CLASS}`);
            const $informer = $aiContent.find(`.${INFORMER_CLASS}`);
            const commandSelectBox = $selectBoxes.eq(0).dxSelectBox('instance');
            const optionSelectBox = $selectBoxes.eq(1).dxSelectBox('instance');
            const commandSelectDataSource = commandSelectBox.option('dataSource').map((item) => item.name);
            const resultTextAreaInstance = getResultTextAreaInstance($wrapper);
            const promptTextAreaInstance = getPromptTextAreaInstance($wrapper);
            const informerInstance = getInformerInstance($wrapper);

            assert.strictEqual($aiContent.length, 1, 'AI dialog content rendered');
            assert.strictEqual($controls.length, 1, 'controls container rendered');
            assert.strictEqual($selectBoxes.length, 2, 'two SelectBox components rendered');
            assert.strictEqual($informer.length, 1, 'Informer component is rendered');
            assert.strictEqual(commandSelectBox.option('value'), 'translate', 'correct command selected');
            assert.deepEqual(commandSelectDataSource, ['translate', 'summarize'], 'command SelectBox contains correct items');
            assert.strictEqual(optionSelectBox.option('value'), 'english', 'correct option selected');
            assert.deepEqual(optionSelectBox.option('items'), ['english', 'german'], 'option SelectBox contains correct items');
            assert.strictEqual($textAreas.length, 2, 'TextAreas are rendered');
            assert.strictEqual(resultTextAreaInstance.option('value'), undefined, 'result TextArea contains empty text');
            assert.strictEqual(promptTextAreaInstance.option('value'), '', 'prompt TextArea contains empty text');
            assert.strictEqual(promptTextAreaInstance.option('visible'), false, 'prompt TextArea is hidden by default');
            assert.strictEqual(informerInstance.option('visible'), false, 'Informer is hidden by default');
        });

        QUnit.test('should hide option SelectBox if command has no options', function(assert) {
            showAIDialog(this, { isBasicCommand: true, config: { currentCommand: 'summarize' } });

            const optionSelectBox = getOptionSelectBoxInstance(this.$element);

            assert.strictEqual(optionSelectBox.option('visible'), false, 'Option SelectBox visibility is false');
        });

        QUnit.test('popup config should contain correct parameters', function(assert) {
            showAIDialog(this, { config: { currentCommand: 'non-existent-command' } });

            const popupConfig = this.aiDialogPopup.option();

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
            assert.deepEqual(dropDownItem.options.items.map(i => i.id), ['insertAbove', 'insertBelow'], 'DropDown has correct items');
        });
    });

    QUnit.module('keyboard navigation', integrationModuleConfig, () => {
        [
            { name: 'dialog', domClass: POPUP_CLASS, index: 0, state: 'initial', class: 'dxPopup' },
            { name: 'command selectbox', domClass: SELECTBOX_CLASS, index: 0, state: 'initial', class: 'dxSelectBox' },
            { name: 'option selectbox', domClass: SELECTBOX_CLASS, index: 1, state: 'initial', class: 'dxSelectBox' },
            { name: 'prompt textarea', domClass: TEXTAREA_CLASS, index: 0, state: 'asking', class: 'dxTextArea' },
            { name: 'result textarea', domClass: TEXTAREA_CLASS, index: 1, state: 'resultReady', class: 'dxTextArea' },
            { name: 'replace button', domClass: BUTTON_CLASS, index: 1, state: 'resultReady', class: 'dxButton' },
            { name: 'copy button', domClass: BUTTON_CLASS, index: 1, state: 'resultReady', class: 'dxButton' },
            { name: 'generate button', domClass: BUTTON_CLASS, index: 1, state: 'asking', class: 'dxButton' },
            { name: 'cancel button', domClass: BUTTON_CLASS, index: 1, state: 'generating', class: 'dxButton' },
        ].forEach(element => {
            QUnit.test(`esc keydown on ${element.name} should hide dialog`, function(assert) {
                if(devices.real().deviceType !== 'desktop') {
                    assert.ok(true, 'Test is not applicable for mobile devices');
                    return;
                }

                const done = assert.async();
                const config = element.state === 'asking'
                    ? { currentCommand: 'askAI' }
                    : { currentCommand: 'changeStyle', currentCommandOption: 'formal' };

                this.showDialog(config);
                this.promise.then(() => {
                    this.setDialogState(element.state);

                    if(element.name === 'generate button') {
                        const promptTextAreaInstance = getPromptTextAreaInstance(this.$element);
                        promptTextAreaInstance.option('value', 'some question');
                    }

                    const $element = $(`.${element.domClass}`).eq(element.index);
                    const instance = $element[element.class]('instance');

                    instance.focus();
                    assert.strictEqual(this.aiDialogPopup.option('visible'), true, 'dialog open');

                    keyboardMock(this.getFocusTarget(instance)).press('escape');
                    assert.strictEqual(this.aiDialogPopup.option('visible'), false, `dialog hidden by esc on ${element.name}`);

                    done();
                });
                this.resolve('response');
            });
        });
    });

    QUnit.module('dialog visibility and promise handling', moduleConfig, () => {
        QUnit.test('should return a promise', function(assert) {
            const promise = showAIDialog(this);

            assert.strictEqual(isPromise(promise), true, 'show() returns promise');
        });

        QUnit.test('should reject promise on hide', function(assert) {
            const promise = showAIDialog(this);

            promise.fail((data) => {
                assert.strictEqual(data, undefined, 'dialog was cancelled, no data');
            });

            this.aiDialogPopup.hide();
        });
    });

    QUnit.module('command and option selection behavior', moduleConfig, () => {
        QUnit.test('should hide options SelectBox if command with no options selected', function(assert) {
            showAIDialog(this);

            const commandSelectBox = getCommandSelectBoxInstance(this.$element);
            const optionSelectBox = getOptionSelectBoxInstance(this.$element);

            assert.strictEqual(optionSelectBox.option('visible'), true, 'option SelectBox is initially visible');

            commandSelectBox.option('value', 'summarize');

            assert.strictEqual(optionSelectBox.option('visible'), false, 'option SelectBox hidden after changing command');
        });

        QUnit.test('should show options SelectBox and select first option if command with options selected', function(assert) {
            showAIDialog(this, { isBasicCommand: false, config: { currentCommand: 'summarize' } });

            const commandSelectBox = getCommandSelectBoxInstance(this.$element);
            const optionSelectBox = getOptionSelectBoxInstance(this.$element);

            assert.strictEqual(optionSelectBox.option('visible'), false, 'option SelectBox is initially not visible');

            commandSelectBox.option('value', 'translate');

            assert.strictEqual(optionSelectBox.option('visible'), true, 'option SelectBox is visible after changing command');
            assert.strictEqual(optionSelectBox.option('value'), 'english', 'first command option is selected after command change');
        });
    });

    QUnit.module('runtime command and option change', integrationModuleConfig, () => {
        QUnit.test('should not send ai request after switch from command with options to askAi', function(assert) {
            this.showDialog({ currentCommand: 'changeStyle', currentCommandOption: 'formal' });

            assert.strictEqual(this.sendRequestStub.callCount, 1, 'request is sent on dialog show');

            const commandSelectBox = getCommandSelectBoxInstance(this.$element);

            commandSelectBox.option('value', 'askAI');

            assert.strictEqual(this.sendRequestStub.callCount, 1, 'no new requests are sent on switch to askAI command');
        });

        QUnit.test('should send ai request after switch from command with options to not askAi command without options', function(assert) {
            this.showDialog({ currentCommand: 'changeStyle', currentCommandOption: 'formal' });

            assert.strictEqual(this.sendRequestStub.callCount, 1, 'request is sent on dialog show');

            const commandSelectBox = getCommandSelectBoxInstance(this.$element);

            commandSelectBox.option('value', 'summarize');

            assert.strictEqual(this.sendRequestStub.callCount, 2, 'new request is sent on switch to summarize');
        });
    });

    QUnit.module('toolbar actions', moduleConfig, () => {
        QUnit.test('copy button triggers clipboard write', function(assert) {
            if(!navigator.clipboard) {
                assert.ok(true, 'clipboard not supported in this environment');
                return;
            }

            const done = assert.async();
            const clipboardStub = sinon.stub(navigator.clipboard, 'writeText');

            showAIDialog(this);

            this.promise.then(() => {
                const $copyButton = findButtonByName(this.aiDialogPopup, 'copy');
                const resultTextAreaInstance = getResultTextAreaInstance(this.$element);

                resultTextAreaInstance.option({ value: 'Test text' });

                $copyButton.trigger('dxclick');

                assert.strictEqual(clipboardStub.calledWith('Test text'), true, 'copied correct text');
                done();
            });
        });

        QUnit.test('should trigger generation on regenerate button click', function(assert) {
            const done = assert.async();

            showAIDialog(this, {
                config: { currentCommand: 'summarize' },
            });

            this.promise.then(() => {
                const generateSpy = sinon.spy(this.aiDialog, '_executeAICommand');
                const $regenerateButton = findButtonByName(this.aiDialogPopup, 'regenerate');

                $regenerateButton.trigger('dxclick');

                assert.strictEqual(generateSpy.calledOnce, true, 'retry triggered generate');
                done();
            });
        });

        QUnit.test('should display only cancel button while loading', function(assert) {
            showAIDialog(this, {
                config: { currentCommand: 'translate' },
            });

            this.setDialogState('generating');

            const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);

            assert.strictEqual(bottomToolbarItems.length, 1, 'one item in bottom toolbar');
            assert.strictEqual(bottomToolbarItems[0].name, 'cancel', 'cancel button is shown');
        });

        ['replace', 'insertAbove', 'insertBelow'].forEach((mode) => {
            QUnit.test(`Should resolve with correct payload on ${mode} click`, function(assert) {
                const done = assert.async();
                const hideSpy = sinon.spy(this.aiDialog, 'hide');

                showAIDialog(this)
                    .done(({ resultText, event }) => {
                        assert.strictEqual(resultText, '', 'resolved text is empty');
                        assert.strictEqual(event.itemData.id, mode, `operation is correct: ${mode}`);
                        assert.strictEqual(hideSpy.calledOnce, true, 'hide called');
                        done();
                    });

                this.promise.then(() => clickActionButton(mode));
            });
        });
    });

    QUnit.module('askAI command', moduleConfig, () => {
        QUnit.test('should render correct UI', function(assert) {
            showAIDialog(this, {
                config: { currentCommand: 'askAI' }
            });

            const promptTextAreaInstance = getPromptTextAreaInstance(this.$element);
            const resultTextAreaInstance = getResultTextAreaInstance(this.$element);

            const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);
            const generateButtonItem = getItemByName(bottomToolbarItems, 'generate');

            assert.strictEqual(promptTextAreaInstance.option('visible'), true, 'prompt TextArea is visible');
            assert.strictEqual(resultTextAreaInstance.option('visible'), false, 'result TextArea is hidden initially');
            assert.strictEqual(promptTextAreaInstance.option('readOnly'), false, 'prompt TextArea is not readOnly');

            assert.strictEqual(bottomToolbarItems.length, 1, 'single item in bottom toolbar');
            assert.strictEqual(bottomToolbarItems[0].name, 'generate', 'generate button is shown');
            assert.strictEqual(generateButtonItem.disabled, undefined, 'generate button is not disabled');
        });

        QUnit.test('should render correct content after generation', function(assert) {
            const done = assert.async();

            showAIDialog(this, {
                config: {
                    currentCommand: 'askAI',
                    commandsMap: {
                        askAI: {
                            id: 'askAI',
                            name: 'askAI',
                            text: 'AskAI',
                        },
                    },
                },
            });

            const promptTextAreaInstance = getPromptTextAreaInstance(this.$element);
            promptTextAreaInstance.option('value', 'some question');

            const $generateButton = findButtonByName(this.aiDialogPopup, 'generate');
            $generateButton.trigger('dxclick');

            this.promise.then(() => {
                const promptTextAreaInstance = getPromptTextAreaInstance(this.$element);
                const resultTextAreaInstance = getResultTextAreaInstance(this.$element);

                const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);
                const replaceButtonItem = getItemByName(bottomToolbarItems, 'replace');
                const copyButtonItem = getItemByName(bottomToolbarItems, 'copy');

                assert.strictEqual(promptTextAreaInstance.option('readOnly'), true, 'prompt TextArea is readOnly');
                assert.strictEqual(resultTextAreaInstance.option('visible'), true, 'result TextArea is visible');

                assert.strictEqual(bottomToolbarItems.length, 3, '3 buttons are shown: regenerate, copy and regenerate');
                assert.strictEqual(replaceButtonItem.disabled, undefined, 'replace button is not disabled');
                assert.strictEqual(copyButtonItem.disabled, undefined, 'copy button is not disabled');

                done();
            });
        });

        QUnit.test('should reset state after clicking Cancel', function(assert) {
            showAIDialog(this, {
                config: { currentCommand: 'askAI' }
            });

            this.setDialogState('generating');

            const $cancelButton = findButtonByName(this.aiDialogPopup, 'cancel');
            $cancelButton.trigger('dxclick');

            const promptTextAreaInstance = getPromptTextAreaInstance(this.$element);
            const resultTextAreaInstance = getResultTextAreaInstance(this.$element);

            const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);

            assert.strictEqual(promptTextAreaInstance.option('visible'), true, 'prompt TextArea is visible');
            assert.strictEqual(promptTextAreaInstance.option('readOnly'), false, 'prompt TextArea is not readOnly');
            assert.strictEqual(resultTextAreaInstance.option('visible'), false, 'result TextArea is hidden');

            assert.strictEqual(bottomToolbarItems.length, 1, '1 button is rendered');
            assert.strictEqual(bottomToolbarItems[0].name, 'generate', 'generate button is shown');
        });

        QUnit.test('should show info type Informer after clicking Cancel', function(assert) {
            showAIDialog(this, {
                config: { currentCommand: 'askAI' }
            });

            this.setDialogState('generating');

            const $cancelButton = findButtonByName(this.aiDialogPopup, 'cancel');
            $cancelButton.trigger('dxclick');

            const informerInstance = getInformerInstance(this.$element);

            assert.strictEqual(informerInstance.option('visible'), true, 'Informer is shown');
            assert.strictEqual(informerInstance.option('icon'), 'errorcircle', 'Icon is correct');
            assert.strictEqual(informerInstance.option('text'), 'Generation canceled', 'Text is correct');
            assert.strictEqual(informerInstance.option('type'), 'info', 'Type is correct');
        });

        QUnit.test('should hide Informer after switching from canceled state to generate', function(assert) {
            showAIDialog(this, {
                config: { currentCommand: 'askAI' }
            });

            const informerInstance = getInformerInstance(this.$element);

            this.setDialogState('askingCanceled');

            assert.strictEqual(informerInstance.option('visible'), true, 'Informer is shown');

            this.setDialogState('generating');

            assert.strictEqual(informerInstance.option('visible'), false, 'Informer is hidden');
        });

        QUnit.test('should reset fields when switching to a basic command', function(assert) {
            showAIDialog(this, {
                config: { currentCommand: 'askAI' }
            });

            const commandSelectBoxInstance = getCommandSelectBoxInstance(this.$element);

            commandSelectBoxInstance.option('value', 'translate');

            const promptTextAreaInstance = getPromptTextAreaInstance(this.$element);
            const resultTextAreaInstance = getResultTextAreaInstance(this.$element);
            const informerInstance = getInformerInstance(this.$element);

            assert.strictEqual(promptTextAreaInstance.option('visible'), false, 'prompt TextArea is hidden');
            assert.strictEqual(promptTextAreaInstance.option('value'), undefined, 'prompt TextArea is cleared');
            assert.strictEqual(resultTextAreaInstance.option('visible'), true, 'result TextArea is visible');
            assert.strictEqual(informerInstance.option('visible'), false, 'Informer is hidden');
        });

        QUnit.test('should render correct UI on command change to askAI', function(assert) {
            showAIDialog(this, {
                config: { currentCommand: 'translate' }
            });

            const commandSelectBoxInstance = getCommandSelectBoxInstance(this.$element);
            const optionSelectBoxInstance = getOptionSelectBoxInstance(this.$element);

            commandSelectBoxInstance.option('value', 'askAI');

            const promptTextAreaInstance = getPromptTextAreaInstance(this.$element);
            const resultTextAreaInstance = getResultTextAreaInstance(this.$element);
            const informerInstance = getInformerInstance(this.$element);

            const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);

            assert.strictEqual(promptTextAreaInstance.option('visible'), true, 'prompt TextArea is visible');
            assert.strictEqual(promptTextAreaInstance.option('readOnly'), false, 'prompt TextArea is not readOnly');
            assert.strictEqual(resultTextAreaInstance.option('visible'), false, 'result TextArea is hidden');
            assert.strictEqual(optionSelectBoxInstance.option('visible'), false, 'option SelectBox hidden for askAI');
            assert.strictEqual(informerInstance.option('visible'), false, 'Informer is hidden');

            assert.strictEqual(bottomToolbarItems.length, 1, '1 button is rendered');
            assert.strictEqual(bottomToolbarItems[0].name, 'generate', 'generate button is shown');
        });

        QUnit.test('generate button should be disabled when textArea is empty', function(assert) {
            showAIDialog(this, {
                config: { currentCommand: 'askAI' }
            });

            let generateButton = getButtonInstance(findButtonByName(this.aiDialogPopup, 'generate'));

            assert.strictEqual(generateButton.option('disabled'), true, 'generate button is disabled on init');

            const promptTextAreaInstance = getPromptTextAreaInstance(this.$element);

            promptTextAreaInstance.option('value', 'f');
            generateButton = getButtonInstance(findButtonByName(this.aiDialogPopup, 'generate'));

            assert.strictEqual(generateButton.option('disabled'), false, 'generate button is enabled after input some text');

            promptTextAreaInstance.option('value', '');
            generateButton = getButtonInstance(findButtonByName(this.aiDialogPopup, 'generate'));

            assert.strictEqual(generateButton.option('disabled'), true, 'generate button is disabled after input is cleared');
        });
    });

    QUnit.module('integration execution and parameter checks', integrationModuleConfig, () => {
        QUnit.test('should trigger AI request on show immediately', function(assert) {
            this.showDialog({ currentCommand: 'summarize' });

            assert.ok(this.sendRequestStub.calledOnce, 'provider.sendRequest is called');
        });

        QUnit.test('should render loadindicator on show immediately', function(assert) {
            this.showDialog({ currentCommand: 'summarize' });

            const $loadIndicator = getLoadIndicator(this.$element);

            assert.strictEqual($loadIndicator.length, 1, 'loadindicator is rendered');
        });

        QUnit.test('askAI should not run the request automatically', function(assert) {
            this.showDialog({ currentCommand: 'askAI' });

            const $loadIndicator = getLoadIndicator(this.$element);

            assert.ok(this.sendRequestStub.notCalled, 'provider.sendRequest is not called');
            assert.strictEqual($loadIndicator.length, 0, 'loadindicator is not rendered');
        });

        QUnit.test('changing command shold restart request', function(assert) {
            const done = assert.async();

            this.showDialog({ currentCommand: 'summarize' });
            this.promise.then(() => {
                assert.strictEqual(this.sendRequestStub.callCount, 1, 'provider.sendRequest is called once');

                const commandSelectBox = getCommandSelectBoxInstance(this.$element);
                commandSelectBox.option('value', 'translate');
                assert.strictEqual(this.sendRequestStub.callCount, 2, 'provider.sendRequest is called twice');

                done();
            });
            this.resolve('');
        });

        QUnit.test('changing command option should trigger new request', function(assert) {
            const done = assert.async();

            this.showDialog({ currentCommand: 'translate' });
            this.promise.then(() => {
                assert.strictEqual(this.sendRequestStub.callCount, 1, 'provider.sendRequest is not called once');

                const optionSelectBox = getOptionSelectBoxInstance(this.$element);
                optionSelectBox.option('value', 'german');
                assert.strictEqual(this.sendRequestStub.callCount, 2, 'provider.sendRequest is not called twice');

                done();
            });
            this.resolve('');
        });

        QUnit.test('changeStyle should be called with correct params', function(assert) {
            this.showDialog({ currentCommand: 'changeStyle', currentCommandOption: 'formal' });

            const params = this.changeStyleStub.firstCall.args[0];

            assert.deepEqual(params, { text: 'Test text', writingStyle: 'formal' }, 'params are correct');
        });

        QUnit.test('translate should be called with correct params', function(assert) {
            this.showDialog({ currentCommand: 'translate', currentCommandOption: 'german' });

            const params = this.translateStub.firstCall.args[0];

            assert.deepEqual(params, { text: 'Test text', lang: 'german' }, 'params are correct');
        });

        QUnit.test('askAI should be called with correct params with prompt', function(assert) {
            const prompt = 'User text';

            this.showDialog({ currentCommand: 'askAI' });

            const promptTextAreaInstance = getPromptTextAreaInstance(this.$element);

            promptTextAreaInstance.option('value', prompt);

            const $generateButton = findButtonByName(this.aiDialogPopup, 'generate');
            $generateButton.trigger('dxclick');

            const param = this.executeStub.firstCall.args[0];
            assert.strictEqual(param.text, 'Text: "Test text". User text', 'prompt included');
        });

        QUnit.test('optionSelectBox should be visible if custom command options are passed', function(assert) {
            const commandsMap = {
                custom0: { id: 'custom0', name: 'custom', text: 'Custom', options: ['Option 1', 'Option 2'] },
            };
            this.showDialog({ currentCommand: 'custom0', commandsMap, currentCommandOption: 'Option 1' });

            const optionSelectBox = getOptionSelectBoxInstance(this.$element);

            assert.ok(optionSelectBox.option('visible'), 'optionSelectBox is visible');
        });

        QUnit.test('option SelectBox hidden for custom without options', function(assert) {

            const optionSelectBox = getOptionSelectBoxInstance(this.$element);

            assert.strictEqual(optionSelectBox.option('visible'), false, 'selectbox is hidden');
        });

        QUnit.test('optionSelectBox should not be visible if custom command options are not passed', function(assert) {
            const commandsMap = {
                custom2: { id: 'custom2', name: 'custom', text: 'Custom' },
            };
            this.showDialog({ currentCommand: 'custom2', commandsMap, currentCommandOption: undefined });

            const optionSelectBox = getOptionSelectBoxInstance(this.$element);

            assert.notOk(optionSelectBox.option('visible'), 'optionSelectBox is not visible');
        });

        QUnit.test('custom command should use prompt function', function(assert) {
            this.showDialog({ currentCommand: 'custom2', currentCommandOption: undefined });

            const param = this.promptStub2.firstCall.args[0];
            const result = this.promptStub2.firstCall.returnValue;

            assert.strictEqual(param, '');
            assert.strictEqual(result, 'Simple prompt');
        });

        QUnit.test('custom command should use prompt function with correct param if options are passed', function(assert) {
            this.showDialog({ currentCommand: 'custom0', currentCommandOption: 'Option 1' });

            const param = this.promptStub1.firstCall.args[0];
            const result = this.promptStub1.firstCall.returnValue;

            assert.strictEqual(param, 'Option 1');
            assert.strictEqual(result, 'Prompt with Option 1');
        });
    });

    QUnit.module('request lifecycle management', integrationModuleConfig, () => {
        QUnit.test('cancel should abort request', function(assert) {
            this.showDialog({ currentCommand: 'translate' });

            assert.notOk(this.abortSpy.calledOnce, 'abort is not called');

            const $cancelButton = findButtonByName(this.aiDialogPopup, 'cancel');
            $cancelButton.trigger('dxclick');

            assert.ok(this.abortSpy.calledOnce, 'abort is called');
        });

        QUnit.test('cancel should reset dialog state', function(assert) {
            this.showDialog({ currentCommand: 'translate' });

            assert.strictEqual(getLoadIndicator(this.$element).length, 1, 'loadindicator is rendered');

            const $cancelButton = findButtonByName(this.aiDialogPopup, 'cancel');
            $cancelButton.trigger('dxclick');

            assert.strictEqual(getLoadIndicator(this.$element).length, 0, 'loadindicator is removed');
        });

        QUnit.test('regenerate should clear result and retry request', function(assert) {
            const done = assert.async();

            this.showDialog({ currentCommand: 'summarize' });

            assert.strictEqual(this.sendRequestStub.callCount, 1, 'sendRequest is called once');

            this.resolve('Response');

            this.promise.then(() => {
                const $regenerate = findButtonByName(this.aiDialogPopup, 'regenerate');

                $regenerate.trigger('dxclick');

                assert.strictEqual(this.sendRequestStub.callCount, 2, 'sendRequest is called twice');

                const resultTextAreaInstance = getResultTextAreaInstance(this.$element);
                assert.strictEqual(resultTextAreaInstance.option('value'), undefined, 'text is empty');

                done();
            });
        });

        QUnit.test('regenerate should hide Informer', function(assert) {
            const done = assert.async();

            this.showDialog({ currentCommand: 'summarize' });

            this.reject('Error');

            setTimeout(() => {
                const informerInstance = getInformerInstance(this.$element);

                assert.strictEqual(informerInstance.option('visible'), true, 'Informer is visible');

                const $regenerate = findButtonByName(this.aiDialogPopup, 'regenerate');

                $regenerate.trigger('dxclick');

                assert.strictEqual(informerInstance.option('visible'), false, 'Informer is hidden');
                done();
            });
        });

        QUnit.test('hide during generation should abort request', function(assert) {
            this.showDialog({ currentCommand: 'translate' });

            this.aiDialog.hide('', { itemData: { id: 'replace' }, event: {} });

            assert.ok(this.abortSpy.calledOnce, 'abort is called');
        });

        QUnit.test('should clear abort function on hide', function(assert) {
            this.showDialog({ currentCommand: 'translate' });

            this.aiDialog.hide('', { itemData: { id: 'replace' }, event: {} });

            assert.strictEqual(this.getAbort(), undefined, 'abort is reset');
        });
    });

    QUnit.module('dialog state handling', integrationModuleConfig, () => {
        QUnit.test('onComplete should update buttons and remove loadindicator', function(assert) {
            const done = assert.async();

            this.showDialog({ currentCommand: 'translate' });

            assert.strictEqual(getLoadIndicator(this.$element).length, 1, 'indicator is rendered');

            this.resolve('response');

            this.promise.then(() => {
                const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);
                const replaceButton = getItemByName(bottomToolbarItems, 'replace');
                const regenerateButton = getItemByName(bottomToolbarItems, 'regenerate');

                assert.strictEqual(bottomToolbarItems.length, 3, '3 buttons are shown: regenerate, copy and replace');
                assert.strictEqual(replaceButton.disabled, undefined);
                assert.strictEqual(regenerateButton.disabled, undefined);

                assert.strictEqual(getLoadIndicator(this.$element).length, 0, 'indicator is removed');

                done();
            });
        });

        QUnit.test('should make Informer with error type visible on reject', function(assert) {
            const done = assert.async();

            this.showDialog({ currentCommand: 'translate' });

            const informerInstance = getInformerInstance(this.$element);

            assert.strictEqual(informerInstance.option('visible'), false, 'Informer is not visible on dialog shown');

            this.reject('Error');

            setTimeout(() => {
                const informerInstance = getInformerInstance(this.$element);

                assert.strictEqual(informerInstance.option('visible'), true, 'Informer is visible on reject');
                assert.strictEqual(informerInstance.option('icon'), '', 'Icon is correct');
                assert.strictEqual(informerInstance.option('text'), 'Something went wrong. Please try again.', 'Text is correct');
                assert.strictEqual(informerInstance.option('type'), 'error', 'Type is correct');
                done();
            });
        });

        QUnit.test('onError should update buttons, textareas, informer and remove loadindicator', function(assert) {
            const done = assert.async();

            this.showDialog({ currentCommand: 'translate' });
            this.reject('Error');

            setTimeout(() => {
                const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);
                const replaceButton = getItemByName(bottomToolbarItems, 'replace');
                const regenerateButton = getItemByName(bottomToolbarItems, 'regenerate');
                const resultTextAreaInstance = getResultTextAreaInstance(this.$element);
                const promptTextAreaInstance = getPromptTextAreaInstance(this.$element);
                const informerInstance = getInformerInstance(this.$element);

                assert.strictEqual(bottomToolbarItems.length, 3, '3 buttons in bottom toolbar: regenerate, copy and replace');
                assert.strictEqual(replaceButton.disabled, undefined, 'replace button is not disabled');
                assert.strictEqual(regenerateButton.disabled, undefined, 'regenerate button is not disabled');
                assert.strictEqual(resultTextAreaInstance.option('disabled'), false, 'result textArea is not disabled');
                assert.strictEqual(resultTextAreaInstance.option('readOnly'), true, 'result textArea is readOnly');
                assert.strictEqual(resultTextAreaInstance.option('visible'), true, 'result textArea is visible');
                assert.strictEqual(promptTextAreaInstance.option('disabled'), true), 'promts textArea is disabled';
                assert.strictEqual(promptTextAreaInstance.option('readOnly'), false, 'result textArea is not readOnly');
                assert.strictEqual(promptTextAreaInstance.option('visible'), false, 'result textArea is not visible');
                assert.strictEqual(informerInstance.option('visible'), true, 'informer is visible');
                assert.strictEqual(getLoadIndicator(this.$element).length, 0, 'indicator is removed');

                done();
            }, 0);
        });

        QUnit.test('onError should update buttons, textareas, informer and remove loadindicator correctly with askAI', function(assert) {
            const done = assert.async();

            this.showDialog({ currentCommand: 'askAI' });

            const promptTextAreaInstance = getPromptTextAreaInstance(this.$element);
            promptTextAreaInstance.option('value', 'some question');

            const $generateButton = findButtonByName(this.aiDialogPopup, 'generate');
            $generateButton.trigger('dxclick');

            this.reject('Error');

            setTimeout(() => {
                const $generateButton = findButtonByName(this.aiDialogPopup, 'generate');
                const resultTextAreaInstance = getResultTextAreaInstance(this.$element);
                const promptTextAreaInstance = getPromptTextAreaInstance(this.$element);
                const informerInstance = getInformerInstance(this.$element);

                assert.ok($generateButton.length, 'generate button is visible');
                assert.strictEqual(resultTextAreaInstance.option('disabled'), true);
                assert.strictEqual(resultTextAreaInstance.option('readOnly'), false);
                assert.strictEqual(resultTextAreaInstance.option('visible'), false);
                assert.strictEqual(promptTextAreaInstance.option('disabled'), false);
                assert.strictEqual(promptTextAreaInstance.option('readOnly'), false);
                assert.strictEqual(promptTextAreaInstance.option('visible'), true);
                assert.strictEqual(informerInstance.option('visible'), true, 'informer is visible');
                assert.strictEqual(getLoadIndicator(this.$element).length, 0, 'indicator is removed');

                done();
            }, 0);
        });

        QUnit.test('loadindicator animation should be sparkle', function(assert) {
            showAIDialog(this);

            this.setDialogState('generating');

            const $loadIndicatorContent = this.$element.find(`.${LOADINDICATOR_CONTENT_CLASS}`);

            assert.strictEqual($loadIndicatorContent.hasClass(ANIMATION_TYPE_CLASSES['sparkle']), true, 'animation type is sparkle');
        });

        QUnit.test('should not change state on hide', function(assert) {
            showAIDialog(this);

            this.setDialogState('generating');
            this.aiDialog.hide();

            assert.strictEqual(getLoadIndicator(this.$element).length, 1, 'indicator is not removed');
        });

        QUnit.test('should not throw an error if the Enter key was pressed on the replace button', function(assert) {
            const done = assert.async();

            showAIDialog(this);

            this.promise.then(() => {
                try {
                    const $replaceButton = this.$element.find(`.${BUTTON_GROUP_CLASS}`);
                    keyboardMock($replaceButton).press('enter');

                    assert.ok(true, 'There is no error');
                } catch(e) {
                    assert.ok(false, `Error is raised: ${e.message}`);
                } finally {
                    done();
                }
            });

            this.resolve('');
        });

        QUnit.test('changing the dialog state does not trigger additional command execution if the command has options', function(assert) {
            this.showDialog({ currentCommand: 'changeStyle', currentCommandOption: 'business' });
            const commandSelectBox = getCommandSelectBoxInstance(this.$element);

            assert.ok(this.sendRequestStub.calledOnce, 'command execution is called once');

            commandSelectBox.option('value', 'askAI');
            assert.ok(this.sendRequestStub.calledOnce, 'command execution is called once');

            commandSelectBox.option('value', 'changeStyle');
            assert.strictEqual(this.sendRequestStub.callCount, 2, 'command execution is called twice');
        });
    });

    QUnit.module('UI interactivity during generation', integrationModuleConfig, () => {
        QUnit.test('selectboxes should be disabled during generating', function(assert) {
            this.showDialog({ currentCommand: 'translate' });

            const commandSelectBoxInstance = getCommandSelectBoxInstance(this.$element);
            const optionSelectBoxInstance = getOptionSelectBoxInstance(this.$element);

            assert.strictEqual(commandSelectBoxInstance.option('disabled'), true, 'command selectbox is disabled');
            assert.strictEqual(optionSelectBoxInstance.option('disabled'), true, 'option selectbox is disabled');
        });

        QUnit.test('prompt textarea is disabled in generating state and is not disabled after', function(assert) {
            const done = assert.async();

            this.showDialog({ currentCommand: 'askAI' });

            const promptTextAreaInstance = getPromptTextAreaInstance(this.$element);
            promptTextAreaInstance.option('value', 'some question');

            const generateButton = findButtonByName(this.aiDialogPopup, 'generate');
            generateButton.trigger('dxclick');

            assert.strictEqual(promptTextAreaInstance.option('disabled'), true, 'disabled during generating');

            this.resolve('Result');

            this.promise.then(() => {
                assert.strictEqual(promptTextAreaInstance.option('disabled'), false, 'not disabled after');
                done();
            });
        });
    });

    QUnit.module('button config', {
        beforeEach: function() {
            integrationModuleConfig.beforeEach.apply(this);

            this.initialLocale = localization.locale();
            this.dictionary = {
                'dxHtmlEditor-aiGenerate': 'custom generate',
                'dxHtmlEditor-aiCancel': 'custom cancel',
                'dxHtmlEditor-aiReplace': 'custom replace',
                'dxHtmlEditor-aiInsertAbove': 'custom insert above',
                'dxHtmlEditor-aiInsertBelow': 'custom insert below',
            };
            localization.loadMessages({
                'ja': this.dictionary
            });
            localization.locale('ja');
        },
        afterEach: function() {
            integrationModuleConfig.afterEach.apply(this);

            localization.locale(this.initialLocale);
        }
    }, () => {
        QUnit.test('should be correct for generate button', function(assert) {
            showAIDialog(this, {
                config: { currentCommand: 'askAI' }
            });

            const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);
            const generateButtonItem = getItemByName(bottomToolbarItems, 'generate');
            const generateButtonOptions = generateButtonItem.options;

            assertConfig(assert, generateButtonItem, {
                toolbar: 'bottom',
                location: 'after',
                widget: 'dxButton'
            });
            assertConfig(assert, generateButtonOptions, {
                stylingMode: 'contained',
                type: 'default',
                width: ACTION_BUTTON_WIDTH,
            });
            assert.strictEqual(generateButtonOptions.text, this.dictionary['dxHtmlEditor-aiGenerate'], 'text is localized');
        });

        QUnit.test('should be correct for cancel button', function(assert) {
            showAIDialog(this, {
                config: { currentCommand: 'translate' },
            });

            const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);
            const cancelToolbarItem = getItemByName(bottomToolbarItems, 'cancel');
            const cancelButtonOptions = cancelToolbarItem.options;

            assertConfig(assert, cancelToolbarItem, {
                toolbar: 'bottom',
                location: 'after',
                widget: 'dxButton'
            });
            assertConfig(assert, cancelButtonOptions, {
                stylingMode: 'contained',
                type: 'default',
                width: ACTION_BUTTON_WIDTH,
            });
            assert.strictEqual(cancelButtonOptions.text, this.dictionary['dxHtmlEditor-aiCancel'], 'text is localized');
        });

        QUnit.test('should be correct for copy button', function(assert) {
            const done = assert.async();

            showAIDialog(this, {
                config: { currentCommand: 'translate' },
            });

            this.resolve();

            this.promise.then(() => {
                const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);
                const copyToolbarItem = getItemByName(bottomToolbarItems, 'copy');
                const copyButtonOptions = copyToolbarItem.options;

                assertConfig(assert, copyToolbarItem, {
                    toolbar: 'bottom',
                    location: 'after',
                    widget: 'dxButton',
                    locateInMenu: 'auto'
                });
                assertConfig(assert, copyButtonOptions, {
                    stylingMode: 'outlined',
                    icon: 'copy',
                });

                done();
            });
        });

        QUnit.test('should be correct for regenerate button', function(assert) {
            const done = assert.async();

            showAIDialog(this, {
                config: { currentCommand: 'translate' },
            });

            this.resolve();

            this.promise.then(() => {
                const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);
                const regenerateToolbarItem = getItemByName(bottomToolbarItems, 'regenerate');
                const regenerateButtonOptions = regenerateToolbarItem.options;

                assertConfig(assert, regenerateToolbarItem, {
                    toolbar: 'bottom',
                    location: 'before',
                    widget: 'dxButton',
                });
                assertConfig(assert, regenerateButtonOptions, {
                    stylingMode: 'outlined',
                    icon: 'restore',
                });

                done();
            });
        });

        QUnit.test('should be correct for replace button', function(assert) {
            const done = assert.async();

            showAIDialog(this, {
                config: { currentCommand: 'translate' },
            });

            this.resolve();

            this.promise.then(() => {
                const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);
                const replaceToolbarItem = getItemByName(bottomToolbarItems, 'replace');
                const replaceButtonOptions = replaceToolbarItem.options;

                assertConfig(assert, replaceToolbarItem, {
                    toolbar: 'bottom',
                    location: 'after',
                    widget: 'dxDropDownButton',
                    locateInMenu: 'auto'
                });
                assertConfig(assert, replaceButtonOptions, {
                    displayExpr: 'text',
                    stylingMode: 'contained',
                    type: 'default',
                    splitButton: true,
                    useSelectMode: false,
                });
                assertConfig(assert, replaceButtonOptions.dropDownOptions, {
                    width: REPLACE_DROPDOWN_WIDTH
                });
                assert.strictEqual(replaceButtonOptions.text, this.dictionary['dxHtmlEditor-aiReplace'], 'text is localized');

                const expectedDropDownItems = [{
                    id: 'insertAbove',
                    text: this.dictionary['dxHtmlEditor-aiInsertAbove']
                }, {
                    id: 'insertBelow',
                    text: this.dictionary['dxHtmlEditor-aiInsertBelow']
                }];
                assert.deepEqual(replaceButtonOptions.items, expectedDropDownItems, 'items in dropdown are correct');

                done();
            });
        });
    });

    QUnit.module('desktop specific', {
        beforeEach: function() {
            this.realDevice = devices.real();
            devices.real({ deviceType: 'desktop' });
            this.getDocumentElementStub = sinon.stub(domAdapter, 'getDocumentElement');
            this.getDocumentElementStub.returns({
                clientWidth: 1000
            });

            integrationModuleConfig.beforeEach.apply(this);
        },
        afterEach: function() {
            integrationModuleConfig.afterEach.apply(this);

            devices.real(this.realDevice);
            this.getDocumentElementStub.restore();
        }
    }, () => {
        QUnit.test('result textArea config is correct', function(assert) {
            const done = assert.async();

            showAIDialog(this, {
                config: { currentCommand: 'translate' },
            });

            this.resolve();

            this.promise.then(() => {
                const resultTextAreaInstance = getResultTextAreaInstance(this.$element);

                assertConfig(assert, resultTextAreaInstance.option(), {
                    minHeight: TEXT_AREA_MIN_HEIGHT,
                    width: '100%',
                    readOnly: true,
                    maxHeight: TEXT_AREA_MAX_HEIGHT,
                    autoResizeEnabled: true,
                });

                done();
            });
        });

        QUnit.test('copy button text is shown and localized', function(assert) {
            const localizedCopyText = 'custom copy';
            const initialLocale = localization.locale();
            localization.loadMessages({
                'ja': {
                    'dxHtmlEditor-aiCopy': localizedCopyText,
                }
            });
            localization.locale('ja');

            const done = assert.async();

            showAIDialog(this, {
                config: { currentCommand: 'translate' },
            });

            this.resolve();

            this.promise.then(() => {
                const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);
                const copyToolbarItem = getItemByName(bottomToolbarItems, 'copy');
                const copyButtonOptions = copyToolbarItem.options;

                assert.strictEqual(copyButtonOptions.text, localizedCopyText, 'text is localized');

                localization.locale(initialLocale);
                done();
            });
        });

        QUnit.test('regenerate button text is shown and localized', function(assert) {
            const localizedRegenerateText = 'custom copy';
            const initialLocale = localization.locale();
            localization.loadMessages({
                'ja': {
                    'dxHtmlEditor-aiRegenerate': localizedRegenerateText,
                }
            });
            localization.locale('ja');

            const done = assert.async();

            showAIDialog(this, {
                config: { currentCommand: 'translate' },
            });

            this.resolve();

            this.promise.then(() => {
                const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);
                const regenerateToolbarItem = getItemByName(bottomToolbarItems, 'regenerate');
                const regenerateButtonOptions = regenerateToolbarItem.options;

                assert.strictEqual(regenerateButtonOptions.text, localizedRegenerateText, 'text is localized');

                localization.locale(initialLocale);
                done();
            });
        });
    });

    QUnit.module('prompt textArea config', {
        beforeEach: function() {
            this.initialLocale = localization.locale();
            this.localizedAskAiPlaceholder = 'custom placeholder';
            localization.loadMessages({
                'ja': {
                    'dxHtmlEditor-aiAskPlaceholder': this.localizedAskAiPlaceholder
                }
            });
            localization.locale('ja');
            integrationModuleConfig.beforeEach.apply(this);
        },
        afterEach: function() {
            localization.locale(this.initialLocale);
            integrationModuleConfig.afterEach.apply(this);
        }
    }, () => {
        QUnit.test('is correct', function(assert) {
            showAIDialog(this, {
                config: { currentCommand: 'askAI' },
            });

            const promptTextAreaInstance = getPromptTextAreaInstance(this.$element);

            assertConfig(assert, promptTextAreaInstance.option(), {
                minHeight: TEXT_AREA_MIN_HEIGHT,
                maxHeight: TEXT_AREA_MAX_HEIGHT,
                autoResizeEnabled: true,
                width: '100%',
                placeholder: this.localizedAskAiPlaceholder,
            });
        });
    });

    QUnit.module('informer config', {
        beforeEach: function() {
            this.initialLocale = localization.locale();
            this.localizedAIDialogError = 'custom error';
            this.localizedCanceledInfo = '';
            localization.loadMessages({
                'ja': {
                    'dxHtmlEditor-aiDialogError': this.localizedAIDialogError,
                    'dxHtmlEditor-aiDialogCanceled': this.localizedCanceledInfo,
                }
            });
            localization.locale('ja');
            integrationModuleConfig.beforeEach.apply(this);
        },
        afterEach: function() {
            localization.locale(this.initialLocale);
            integrationModuleConfig.afterEach.apply(this);
        }
    }, () => {
        QUnit.test('is correct on init', function(assert) {
            showAIDialog(this, {
                config: { currentCommand: 'askAI' },
            });

            const informerInstance = getInformerInstance(this.$element);

            assertConfig(assert, informerInstance.option(), {
                contentAlignment: 'center',
                showBackground: true,
                visible: false,
            });
        });

        QUnit.test('is correct on error', function(assert) {
            const done = assert.async();

            this.showDialog({ currentCommand: 'summarize' });

            this.reject();

            setTimeout(() => {
                const informerInstance = getInformerInstance(this.$element);

                assertConfig(assert, informerInstance.option(), {
                    text: this.localizedAIDialogError,
                    type: 'error',
                    icon: '',
                    visible: true,
                });

                done();
            });
        });

        QUnit.test('is correct on cancel', function(assert) {
            this.showDialog({ currentCommand: 'summarize' });

            const $cancelButton = findButtonByName(this.aiDialogPopup, 'cancel');
            $cancelButton.trigger('dxclick');

            const informerInstance = getInformerInstance(this.$element);

            assertConfig(assert, informerInstance.option(), {
                text: this.localizedCanceledInfo,
                type: 'info',
                icon: 'errorcircle',
                visible: true,
            });
        });
    });

    QUnit.module('mobile layout', () => {
        [{
            name: 'phone',
            beforeEach: function() {
                this.realDevice = devices.real();
                devices.real({ deviceType: 'phone' });
                integrationModuleConfig.beforeEach.apply(this);
            },
            afterEach: function() {
                devices.real(this.realDevice);
                integrationModuleConfig.afterEach.apply(this);
            }
        }, {
            name: 'small screen',
            beforeEach: function() {
                this.getDocumentElementStub = sinon.stub(domAdapter, 'getDocumentElement');
                this.getDocumentElementStub.returns({
                    clientWidth: 300
                });
                integrationModuleConfig.beforeEach.apply(this);
            },
            afterEach: function() {
                this.getDocumentElementStub.restore();
                integrationModuleConfig.afterEach.apply(this);
            }
        }].forEach(moduleConfig => {
            QUnit.module(moduleConfig.name, moduleConfig, () => {
                QUnit.test('result textArea config is correct', function(assert) {
                    const done = assert.async();

                    showAIDialog(this, {
                        config: { currentCommand: 'translate' },
                    });

                    this.resolve();

                    this.promise.then(() => {
                        const resultTextAreaInstance = getResultTextAreaInstance(this.$element);

                        assertConfig(assert, resultTextAreaInstance.option(), {
                            minHeight: TEXT_AREA_MIN_HEIGHT,
                            width: '100%',
                            readOnly: true,
                            maxHeight: '100%',
                            height: '100%',
                            autoResizeEnabled: false,
                        });

                        done();
                    });
                });

                QUnit.test('copy button text is not shown', function(assert) {
                    const done = assert.async();

                    showAIDialog(this, {
                        config: { currentCommand: 'translate' },
                    });

                    this.resolve();

                    this.promise.then(() => {
                        const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);
                        const copyToolbarItem = getItemByName(bottomToolbarItems, 'copy');
                        const copyButtonOptions = copyToolbarItem.options;

                        assert.strictEqual(copyButtonOptions.text, undefined, 'text is not passed');
                        assert.strictEqual(copyButtonOptions.icon, 'copy', 'icon is passed');

                        done();
                    });
                });

                QUnit.test('regenerate button text is not shown', function(assert) {
                    const done = assert.async();

                    showAIDialog(this, {
                        config: { currentCommand: 'translate' },
                    });

                    this.resolve();

                    this.promise.then(() => {
                        const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);
                        const copyToolbarItem = getItemByName(bottomToolbarItems, 'regenerate');
                        const copyButtonOptions = copyToolbarItem.options;

                        assert.strictEqual(copyButtonOptions.text, undefined, 'text is not passed');
                        assert.strictEqual(copyButtonOptions.icon, 'restore', 'icon is passed');

                        done();
                    });
                });
            });
        });
    });

    QUnit.module('compact theme', {
        beforeEach() {
            this.isCompactStub = sinon.stub(themes, 'isCompact').returns(true);

            integrationModuleConfig.beforeEach.apply(this);
        },
        afterEach() {
            integrationModuleConfig.afterEach.apply(this);

            this.isCompactStub.restore();
        },
    }, () => {
        QUnit.test('generate button should have special width', function(assert) {
            showAIDialog(this, {
                config: { currentCommand: 'askAI' },
            });

            const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);
            const generateToolbarItem = getItemByName(bottomToolbarItems, 'generate');
            const generateButtonOptions = generateToolbarItem.options;

            assert.strictEqual(generateButtonOptions.width, COMPACT_ACTION_BUTTON_WIDTH, 'width is specific');
        });

        QUnit.test('cancel button should have special width', function(assert) {
            showAIDialog(this, {
                config: { currentCommand: 'translate' },
            });

            const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);
            const cancelToolbarItem = getItemByName(bottomToolbarItems, 'cancel');
            const cancelButtonOptions = cancelToolbarItem.options;

            assert.strictEqual(cancelButtonOptions.width, COMPACT_ACTION_BUTTON_WIDTH, 'width is specific');
        });
    });

    QUnit.module('Accessibility', moduleConfig, () => {
        QUnit.test('result textarea should have correct aria-label', function(assert) {
            showAIDialog(this);

            const $resultTextArea = this.$element.find(`.${TEXTAREA_CLASS}`).eq(1);
            const $textArea = $resultTextArea.find(`.${TEXTEDITOR_INPUT_CLASS}`);

            assert.strictEqual($textArea.attr('aria-label'), 'AI Assistant result', 'aria-label is correct');
        });

        ['initial', 'asking', 'resultReady', 'generating'].forEach(state => {
            QUnit.test(`dialog content aria-labelledby should be equal to title id when dialog in ${state} state`, function(assert) {
                showAIDialog(this);
                this.setDialogState(state);

                const ariaLabel = this.aiDialogPopup.$overlayContent().attr('aria-labelledby');
                const id = this.aiDialogPopup.$overlayContent()
                    .find(`.${AI_DIALOG_TITLE_CLASS}`)
                    .attr('id');

                assert.strictEqual(ariaLabel, id, 'aria-labelledby is equal to id');
            });
        });
    });
});
