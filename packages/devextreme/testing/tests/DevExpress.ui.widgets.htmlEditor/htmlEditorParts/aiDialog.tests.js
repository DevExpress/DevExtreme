import $ from 'jquery';
import AIDialog, {
    AI_DIALOG_CLASS,
    AI_DIALOG_CONTROLS_CLASS,
    AI_DIALOG_CONTENT_CLASS,
} from '__internal/ui/html_editor/ui/aiDialog';
import { AIIntegration } from '__internal/core/ai_integration/core/ai_integration';
import { isPromise } from 'core/utils/type';
import {
    buildDefaultCommandsMap,
    clickActionButton,
    findButtonByText,
    getCommandSelectBoxInstance,
    getLoadIndicator,
    getOptionSelectBoxInstance,
    getPromptTextAreaInstance,
    getResultTextAreaInstance,
    getToolbarButtonItems,
    showAIDialog,
} from '../../../helpers/aiDialog.js';

import 'ui/menu';
import 'ui/popup';
import 'ui/text_area';
import 'ui/select_box';

const TEXT_AREA_CLASS = 'dx-textarea';
const SELECT_BOX_CLASS = 'dx-selectbox';

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
        this.promptStub1 = sinon.spy(this.commandsMap.custom, 'prompt');
        this.promptStub2 = sinon.spy(this.commandsMap.custom2, 'prompt');
        this.showDialog = (payload) => showAIDialog(
            this,
            {
                config: {
                    commandsMap: this.commandsMap,
                    prompt: this.commandsMap[payload.currentCommand].prompt,
                    ...payload,
                },
            },
        );
        this.getAbort = () => this.aiDialog._abort;
    },
    afterEach() {
        sinon.restore();
    }
};

QUnit.module('AIDialog', {}, () => {
    QUnit.module('rendering and initial State', moduleConfig, () => {
        QUnit.test('should render AI dialog content with correct values', function(assert) {
            showAIDialog(this);

            const $wrapper = this.$element.find(`.${AI_DIALOG_CLASS}`);
            const $aiContent = $wrapper.find(`.${AI_DIALOG_CONTENT_CLASS}`);
            const $controls = $aiContent.find(`.${AI_DIALOG_CONTROLS_CLASS}`);
            const $selectBoxes = $controls.find(`.${SELECT_BOX_CLASS}`);
            const $textAreas = $aiContent.find(`.${TEXT_AREA_CLASS}`);
            const commandSelectBox = $selectBoxes.eq(0).dxSelectBox('instance');
            const optionSelectBox = $selectBoxes.eq(1).dxSelectBox('instance');
            const commandSelectDataSource = commandSelectBox.option('dataSource').map((item) => item.name);
            const resultTextAreaInstance = getResultTextAreaInstance($wrapper);
            const promptTextAreaInstance = getPromptTextAreaInstance($wrapper);

            assert.strictEqual($aiContent.length, 1, 'AI dialog content rendered');
            assert.strictEqual($controls.length, 1, 'controls container rendered');
            assert.strictEqual($selectBoxes.length, 2, 'two SelectBox components rendered');
            assert.strictEqual(commandSelectBox.option('value'), 'translate', 'correct command selected');
            assert.deepEqual(commandSelectDataSource, ['translate', 'summarize'], 'command SelectBox contains correct items');
            assert.strictEqual(optionSelectBox.option('value'), 'english', 'correct option selected');
            assert.deepEqual(optionSelectBox.option('items'), ['english', 'german'], 'option SelectBox contains correct items');
            assert.strictEqual($textAreas.length, 2, 'TextAreas are rendered');
            assert.strictEqual(resultTextAreaInstance.option('value'), undefined, 'result TextArea contains empty text');
            assert.strictEqual(promptTextAreaInstance.option('value'), '', 'prompt TextArea contains empty text');
            assert.strictEqual(promptTextAreaInstance.option('visible'), false, 'prompt TextArea is hidden by default');
        });

        QUnit.test('should hide option SelectBox if command has no options', function(assert) {
            showAIDialog(this, { isBasicCommand: true, config: { currentCommand: 'summarize' } });

            const optionSelectBox = getOptionSelectBoxInstance(this.$element);

            assert.strictEqual(optionSelectBox.option('visible'), false, 'Option SelectBox visibility is false');
        });

        QUnit.test('popup config should contain correct parameters', function(assert) {
            showAIDialog(this);

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
            assert.deepEqual(dropDownItem.options.items.map(i => i.id), ['replace', 'insertAbove', 'insertBelow'], 'DropDown has correct items');
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
                const $copyButton = findButtonByText(this.$element, 'Copy');
                const resultTextAreaInstance = this.$element
                    .find(`.${TEXT_AREA_CLASS}`).eq(1)
                    .dxTextArea('instance');

                resultTextAreaInstance.option({ value: 'Test text' });

                $copyButton.trigger('dxclick');

                assert.strictEqual(clipboardStub.calledWith('Test text'), true, 'copied correct text');
                done();
            });
        });

        QUnit.test('should trigger generation on try again button click', function(assert) {
            const done = assert.async();

            showAIDialog(this, {
                config: { currentCommand: 'summarize' },
            });

            this.promise.then(() => {
                const generateSpy = sinon.spy(this.aiDialog, '_executeAICommand');
                const $tryAgainButton = findButtonByText(this.$element, 'Try again');

                $tryAgainButton.trigger('dxclick');

                assert.strictEqual(generateSpy.calledOnce, true, 'retry triggered generate');
                done();
            });
        });

        QUnit.test('should disable buttons while loading', function(assert) {
            showAIDialog(this, {
                config: { currentCommand: 'translate' },
            });

            this.setDialogState('generating');

            const toolbarButtonItems = getToolbarButtonItems(this.aiDialogPopup);
            const stopButtonItem = toolbarButtonItems.find(item => item.options.text === 'Stop');
            const replaceButtonItem = toolbarButtonItems.find(item => item.options.text === 'Replace');
            const copyButtonItem = toolbarButtonItems.find(item => item.options.text === 'Copy');

            assert.strictEqual(stopButtonItem.disabled, undefined, 'stop button is not disabled');
            assert.strictEqual(replaceButtonItem.disabled, true, 'generate button is disabled');
            assert.strictEqual(copyButtonItem.disabled, true, 'copy button not disabled');
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

    QUnit.module('Ask AI command', moduleConfig, () => {
        QUnit.test('should render correct UI', function(assert) {
            showAIDialog(this, {
                config: { currentCommand: 'askAI' }
            });

            const promptTextAreaInstance = getPromptTextAreaInstance(this.$element);
            const resultTextAreaInstance = getResultTextAreaInstance(this.$element);

            const toolbarButtonItems = getToolbarButtonItems(this.aiDialogPopup);

            const generateButtonItem = toolbarButtonItems.find(item => item.options.text === 'Generate');
            const buttonTexts = toolbarButtonItems.map(item => item.options.text);

            assert.strictEqual(promptTextAreaInstance.option('visible'), true, 'prompt TextArea is visible');
            assert.strictEqual(resultTextAreaInstance.option('visible'), false, 'result TextArea is hidden initially');
            assert.strictEqual(promptTextAreaInstance.option('readOnly'), false, 'prompt TextArea is not readOnly');

            assert.deepEqual(buttonTexts, ['Generate'], 'toolbar contains correct buttons for Ask AI mode');
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

            const $generateButton = findButtonByText(this.$element, 'Generate');
            $generateButton.trigger('dxclick');

            this.promise.then(() => {
                const promptTextAreaInstance = getPromptTextAreaInstance(this.$element);
                const resultTextAreaInstance = getResultTextAreaInstance(this.$element);

                const toolbarButtonItems = this.aiDialogPopup.option('toolbarItems').filter(item => ['dxButton', 'dxDropDownButton'].includes(item.widget));
                const buttonTexts = toolbarButtonItems.map(item => item.options.text);
                const replaceButtonItem = toolbarButtonItems.find(item => item.options.text === 'Replace');
                const copyButtonItem = toolbarButtonItems.find(item => item.options.text === 'Copy');

                assert.strictEqual(promptTextAreaInstance.option('readOnly'), true, 'prompt TextArea is readOnly');
                assert.strictEqual(resultTextAreaInstance.option('visible'), true, 'result TextArea is visible');

                assert.deepEqual(buttonTexts, ['Try again', 'Copy', 'Replace'], 'toolbar contains correct buttons after generation');
                assert.strictEqual(replaceButtonItem.disabled, undefined, 'replace button is not disabled');
                assert.strictEqual(copyButtonItem.disabled, undefined, 'copy button is not disabled');

                done();
            });
        });

        QUnit.test('should reset state after clicking Stop', function(assert) {
            showAIDialog(this, {
                config: { currentCommand: 'askAI' }
            });

            this.setDialogState('generating');

            const $stopButton = findButtonByText(this.$element, 'Stop');
            $stopButton.trigger('dxclick');

            const promptTextAreaInstance = getPromptTextAreaInstance(this.$element);
            const resultTextAreaInstance = getResultTextAreaInstance(this.$element);

            const toolbarButtonItems = this.aiDialogPopup.option('toolbarItems').filter(item => item.widget === 'dxButton');
            const buttonTexts = toolbarButtonItems.map(item => item.options.text);

            assert.strictEqual(promptTextAreaInstance.option('visible'), true, 'prompt TextArea is visible');
            assert.strictEqual(promptTextAreaInstance.option('readOnly'), false, 'prompt TextArea is not readOnly');
            assert.strictEqual(resultTextAreaInstance.option('visible'), false, 'result TextArea is hidden');

            assert.deepEqual(buttonTexts, ['Generate'], 'toolbar reset to Ask AI state with correct buttons');
        });

        QUnit.test('should reset fields when switching to a basic command', function(assert) {
            showAIDialog(this, {
                config: { currentCommand: 'askAI' }
            });

            const commandSelectBoxInstance = getCommandSelectBoxInstance(this.$element);

            commandSelectBoxInstance.option('value', 'translate');

            const promptTextAreaInstance = getPromptTextAreaInstance(this.$element);
            const resultTextAreaInstance = getResultTextAreaInstance(this.$element);

            assert.strictEqual(promptTextAreaInstance.option('visible'), false, 'prompt TextArea is hidden');
            assert.strictEqual(promptTextAreaInstance.option('value'), undefined, 'prompt TextArea is cleared');
            assert.strictEqual(resultTextAreaInstance.option('visible'), true, 'result TextArea is visible');
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

            const toolbarButtonItems = this.aiDialogPopup.option('toolbarItems').filter(item => item.widget === 'dxButton');
            const buttonTexts = toolbarButtonItems.map(item => item.options.text);

            assert.strictEqual(promptTextAreaInstance.option('visible'), true, 'prompt TextArea is visible');
            assert.strictEqual(promptTextAreaInstance.option('readOnly'), false, 'prompt TextArea is not readOnly');
            assert.strictEqual(resultTextAreaInstance.option('visible'), false, 'result TextArea is hidden');
            assert.strictEqual(optionSelectBoxInstance.option('visible'), false, 'option SelectBox hidden for askAI');

            assert.deepEqual(buttonTexts, ['Generate'], 'toolbar contains correct buttons for Ask AI');
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

            const $generateButton = findButtonByText(this.$element, 'Generate');
            $generateButton.trigger('dxclick');

            const param = this.executeStub.firstCall.args[0];
            assert.strictEqual(param.text, 'Test text. User text', 'prompt included');
        });

        QUnit.test('optionSelectBox should be visible if custom command options are passed', function(assert) {
            this.showDialog({ currentCommand: 'custom', currentCommandOption: 'custom option' });

            const optionSelectBox = getOptionSelectBoxInstance(this.$element);

            assert.ok(optionSelectBox.option('visible'), 'optionSelectBox is visible');
        });

        QUnit.test('optionSelectBox should not be visible if custom command options are not passed', function(assert) {
            this.showDialog({ currentCommand: 'custom2', currentCommandOption: undefined });

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
            this.showDialog({ currentCommand: 'custom', currentCommandOption: 'option 1' });

            const param = this.promptStub1.firstCall.args[0];
            const result = this.promptStub1.firstCall.returnValue;

            assert.strictEqual(param, 'option 1');
            assert.strictEqual(result, 'Prompt with option 1');
        });
    });

    QUnit.module('Request lifecycle management', integrationModuleConfig, () => {
        QUnit.test('stop should abort request', function(assert) {
            this.showDialog({ currentCommand: 'translate' });

            assert.notOk(this.abortSpy.calledOnce, 'abort is not called');

            const $stopButton = findButtonByText(this.$element, 'Stop');
            $stopButton.trigger('dxclick');

            assert.ok(this.abortSpy.calledOnce, 'abort is called');
        });

        QUnit.test('stop should reset dialog state', function(assert) {
            this.showDialog({ currentCommand: 'translate' });

            assert.strictEqual(getLoadIndicator(this.$element).length, 1, 'loadindicator is rendered');

            const $stopButton = findButtonByText(this.$element, 'Stop');
            $stopButton.trigger('dxclick');

            assert.strictEqual(getLoadIndicator(this.$element).length, 0, 'loadindicator is removed');
        });

        QUnit.test('try again should clear result and retry request', function(assert) {
            const done = assert.async();

            this.showDialog({ currentCommand: 'summarize' });

            assert.strictEqual(this.sendRequestStub.callCount, 1, 'sendRequest is called once');

            this.resolve('Response');

            this.promise.then(() => {
                const $tryAgain = findButtonByText(this.$element, 'Try again');

                $tryAgain.trigger('dxclick');

                assert.strictEqual(this.sendRequestStub.callCount, 2, 'sendRequest is called twice');

                const resultTextAreaInstance = this.$element
                    .find(`.${TEXT_AREA_CLASS}`).eq(1)
                    .dxTextArea('instance');

                assert.strictEqual(resultTextAreaInstance.option('value'), undefined, 'text is empty');

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

    QUnit.module('Dialog state handling', integrationModuleConfig, () => {
        QUnit.test('onComplete should update buttons and remove loadindicator', function(assert) {
            const done = assert.async();

            this.showDialog({ currentCommand: 'translate' });

            assert.strictEqual(getLoadIndicator(this.$element).length, 1, 'indicator is rendered');

            this.resolve('response');

            this.promise.then(() => {
                const toolbarButtonItems = getToolbarButtonItems(this.aiDialogPopup);
                const replaceButton = toolbarButtonItems.find(item => item.options.text === 'Replace');
                const tryAgainButton = toolbarButtonItems.find(item => item.options.text === 'Try again');
                const $copyButton = findButtonByText(this.$element, 'Copy');

                assert.strictEqual(replaceButton.disabled, undefined);
                assert.strictEqual(tryAgainButton.disabled, undefined);
                assert.ok($copyButton.length, 'copy button is visible');

                assert.strictEqual(getLoadIndicator(this.$element).length, 0, 'indicator is removed');

                done();
            });
        });

        QUnit.test('onError should update buttons, textareas and remove loadindicator', function(assert) {
            const done = assert.async();

            this.showDialog({ currentCommand: 'translate' });
            this.reject('Error');

            setTimeout(() => {
                const toolbarButtonItems = getToolbarButtonItems(this.aiDialogPopup);
                const replaceButton = toolbarButtonItems.find(item => item.options.text === 'Replace');
                const tryAgainButton = toolbarButtonItems.find(item => item.options.text === 'Try again');
                const $copyButton = findButtonByText(this.$element, 'Copy');
                const resultTextAreaInstance = getResultTextAreaInstance(this.$element);
                const promptTextAreaInstance = getPromptTextAreaInstance(this.$element);

                assert.strictEqual(replaceButton.disabled, undefined);
                assert.strictEqual(tryAgainButton.disabled, undefined);
                assert.ok($copyButton.length, 'copy button is visible');
                assert.strictEqual(resultTextAreaInstance.option('disabled'), false);
                assert.strictEqual(resultTextAreaInstance.option('readOnly'), true);
                assert.strictEqual(resultTextAreaInstance.option('visible'), true);
                assert.strictEqual(promptTextAreaInstance.option('disabled'), true);
                assert.strictEqual(promptTextAreaInstance.option('readOnly'), false);
                assert.strictEqual(promptTextAreaInstance.option('visible'), false);
                assert.strictEqual(getLoadIndicator(this.$element).length, 0, 'indicator is removed');

                done();
            }, 0);
        });

        QUnit.test('onError should update buttons, textareas and remove loadindicator correctly with askAI', function(assert) {
            const done = assert.async();

            this.showDialog({ currentCommand: 'askAI' });

            const $generateButton = findButtonByText(this.$element, 'Generate');
            $generateButton.trigger('dxclick');

            this.reject('Error');

            setTimeout(() => {
                const toolbarButtonItems = getToolbarButtonItems(this.aiDialogPopup);
                const stopButton = toolbarButtonItems.find(item => item.options.text === 'Stop');
                const $generateButton = findButtonByText(this.$element, 'Generate');
                const resultTextAreaInstance = getResultTextAreaInstance(this.$element);
                const promptTextAreaInstance = getPromptTextAreaInstance(this.$element);

                assert.strictEqual(stopButton.disabled, true);
                assert.ok($generateButton.length, 'generate button is visible');
                assert.strictEqual(resultTextAreaInstance.option('disabled'), false);
                assert.strictEqual(resultTextAreaInstance.option('readOnly'), true);
                assert.strictEqual(resultTextAreaInstance.option('visible'), true);
                assert.strictEqual(promptTextAreaInstance.option('disabled'), false);
                assert.strictEqual(promptTextAreaInstance.option('readOnly'), false);
                assert.strictEqual(promptTextAreaInstance.option('visible'), true);
                assert.strictEqual(getLoadIndicator(this.$element).length, 0, 'indicator is removed');

                done();
            }, 0);
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
            const generateButton = findButtonByText(this.$element, 'Generate');

            generateButton.trigger('dxclick');

            assert.strictEqual(promptTextAreaInstance.option('disabled'), true, 'disabled during generating');

            this.resolve('Result');

            this.promise.then(() => {
                assert.strictEqual(promptTextAreaInstance.option('disabled'), false, 'not disabled after');
                done();
            });
        });
    });

    QUnit.module('Custom Command Behavior', integrationModuleConfig, () => {
        QUnit.test('option SelectBox hidden for custom without options', function(assert) {
            const commandsMap = {
                custom: { id: 'custom0', name: 'custom', text: 'Custom' },
            };

            this.showDialog({ currentCommand: 'custom', commandsMap });

            const optionSelectBox = getOptionSelectBoxInstance(this.$element);

            assert.strictEqual(optionSelectBox.option('visible'), false, 'selectbox is hidden');
        });
    });
});
