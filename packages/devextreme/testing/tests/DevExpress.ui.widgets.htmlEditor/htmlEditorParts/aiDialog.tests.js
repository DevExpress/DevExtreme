import $ from 'jquery';
import localization from 'localization';
import devices from '__internal/core/m_devices';
import themes from 'ui/themes';
import domAdapter from '__internal/core/m_dom_adapter';
import AIDialog, {
    AI_DIALOG_CLASS,
    AI_DIALOG_CONTROLS_CLASS,
    AI_DIALOG_CONTENT_CLASS,
    REPLACE_DROPDOWN_WIDTH,
    ACTION_BUTTON_WIDTH,
    COMPACT_ACTION_BUTTON_WIDTH,
    TEXT_AREA_MIN_HEIGHT,
    TEXT_AREA_MAX_HEIGHT
} from '__internal/ui/html_editor/ui/aiDialog';
import { AIIntegration } from '__internal/core/ai_integration/core/ai_integration';
import { isPromise } from 'core/utils/type';
import {
    buildDefaultCommandsMap,
    clickActionButton,
    getBottomToolbarItems,
    findButtonByName,
    getCommandSelectBoxInstance,
    getItemByName,
    getLoadIndicator,
    getOptionSelectBoxInstance,
    getPromptTextAreaInstance,
    getResultTextAreaInstance,
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
        this.getAbort = () => this.aiDialog._abort;
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
                const $copyButton = findButtonByName(this.aiDialogPopup, 'copy');
                const resultTextAreaInstance = getResultTextAreaInstance(this.$element);

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
                const $tryAgainButton = findButtonByName(this.aiDialogPopup, 'tryAgain');

                $tryAgainButton.trigger('dxclick');

                assert.strictEqual(generateSpy.calledOnce, true, 'retry triggered generate');
                done();
            });
        });

        QUnit.test('Should display only stop button while loading', function(assert) {
            showAIDialog(this, {
                config: { currentCommand: 'translate' },
            });

            this.setDialogState('generating');

            const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);

            assert.strictEqual(bottomToolbarItems.length, 1, 'one item in bottom toolbar');
            assert.strictEqual(bottomToolbarItems[0].name, 'stop', 'stop button is shown');
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

                assert.strictEqual(bottomToolbarItems.length, 3, '3 buttons are shown: tryAgain, copy and regenerate');
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

            const $stopButton = findButtonByName(this.aiDialogPopup, 'stop');
            $stopButton.trigger('dxclick');

            const promptTextAreaInstance = getPromptTextAreaInstance(this.$element);
            const resultTextAreaInstance = getResultTextAreaInstance(this.$element);

            const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);

            assert.strictEqual(promptTextAreaInstance.option('visible'), true, 'prompt TextArea is visible');
            assert.strictEqual(promptTextAreaInstance.option('readOnly'), false, 'prompt TextArea is not readOnly');
            assert.strictEqual(resultTextAreaInstance.option('visible'), false, 'result TextArea is hidden');

            assert.strictEqual(bottomToolbarItems.length, 1, '1 button is rendered');
            assert.strictEqual(bottomToolbarItems[0].name, 'generate', 'generate button is shown');
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

            const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);

            assert.strictEqual(promptTextAreaInstance.option('visible'), true, 'prompt TextArea is visible');
            assert.strictEqual(promptTextAreaInstance.option('readOnly'), false, 'prompt TextArea is not readOnly');
            assert.strictEqual(resultTextAreaInstance.option('visible'), false, 'result TextArea is hidden');
            assert.strictEqual(optionSelectBoxInstance.option('visible'), false, 'option SelectBox hidden for askAI');

            assert.strictEqual(bottomToolbarItems.length, 1, '1 button is rendered');
            assert.strictEqual(bottomToolbarItems[0].name, 'generate', 'generate button is shown');
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
        QUnit.test('stop should abort request', function(assert) {
            this.showDialog({ currentCommand: 'translate' });

            assert.notOk(this.abortSpy.calledOnce, 'abort is not called');

            const $stopButton = findButtonByName(this.aiDialogPopup, 'stop');
            $stopButton.trigger('dxclick');

            assert.ok(this.abortSpy.calledOnce, 'abort is called');
        });

        QUnit.test('stop should reset dialog state', function(assert) {
            this.showDialog({ currentCommand: 'translate' });

            assert.strictEqual(getLoadIndicator(this.$element).length, 1, 'loadindicator is rendered');

            const $stopButton = findButtonByName(this.aiDialogPopup, 'stop');
            $stopButton.trigger('dxclick');

            assert.strictEqual(getLoadIndicator(this.$element).length, 0, 'loadindicator is removed');
        });

        QUnit.test('try again should clear result and retry request', function(assert) {
            const done = assert.async();

            this.showDialog({ currentCommand: 'summarize' });

            assert.strictEqual(this.sendRequestStub.callCount, 1, 'sendRequest is called once');

            this.resolve('Response');

            this.promise.then(() => {
                const $tryAgain = findButtonByName(this.aiDialogPopup, 'tryAgain');

                $tryAgain.trigger('dxclick');

                assert.strictEqual(this.sendRequestStub.callCount, 2, 'sendRequest is called twice');

                const resultTextAreaInstance = getResultTextAreaInstance(this.$element);
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

    QUnit.module('dialog state handling', integrationModuleConfig, () => {
        QUnit.test('onComplete should update buttons and remove loadindicator', function(assert) {
            const done = assert.async();

            this.showDialog({ currentCommand: 'translate' });

            assert.strictEqual(getLoadIndicator(this.$element).length, 1, 'indicator is rendered');

            this.resolve('response');

            this.promise.then(() => {
                const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);
                const replaceButton = getItemByName(bottomToolbarItems, 'replace');
                const tryAgainButton = getItemByName(bottomToolbarItems, 'tryAgain');

                assert.strictEqual(bottomToolbarItems.length, 3, '3 buttons are shown: try again, copy and replace');
                assert.strictEqual(replaceButton.disabled, undefined);
                assert.strictEqual(tryAgainButton.disabled, undefined);

                assert.strictEqual(getLoadIndicator(this.$element).length, 0, 'indicator is removed');

                done();
            });
        });

        QUnit.test('onError should update buttons, textareas and remove loadindicator', function(assert) {
            const done = assert.async();

            this.showDialog({ currentCommand: 'translate' });
            this.reject('Error');

            setTimeout(() => {
                const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);
                const replaceButton = getItemByName(bottomToolbarItems, 'replace');
                const tryAgainButton = getItemByName(bottomToolbarItems, 'tryAgain');
                const resultTextAreaInstance = getResultTextAreaInstance(this.$element);
                const promptTextAreaInstance = getPromptTextAreaInstance(this.$element);

                assert.strictEqual(bottomToolbarItems.length, 3, '3 buttons in bottom toolbar: tryAgain, copy and replace');
                assert.strictEqual(replaceButton.disabled, undefined, 'replace button is not disabled');
                assert.strictEqual(tryAgainButton.disabled, undefined, 'tryAgain button is not disabled');
                assert.strictEqual(resultTextAreaInstance.option('disabled'), false, 'result textArea is not disabled');
                assert.strictEqual(resultTextAreaInstance.option('readOnly'), true, 'result textArea is readOnly');
                assert.strictEqual(resultTextAreaInstance.option('visible'), true, 'result textArea is visible');
                assert.strictEqual(promptTextAreaInstance.option('disabled'), true), 'promts textArea is disabled';
                assert.strictEqual(promptTextAreaInstance.option('readOnly'), false, 'result textArea is not readOnly');
                assert.strictEqual(promptTextAreaInstance.option('visible'), false, 'result textArea is not visible');
                assert.strictEqual(getLoadIndicator(this.$element).length, 0, 'indicator is removed');

                done();
            }, 0);
        });

        QUnit.test('onError should update buttons, textareas and remove loadindicator correctly with askAI', function(assert) {
            const done = assert.async();

            this.showDialog({ currentCommand: 'askAI' });

            const $generateButton = findButtonByName(this.aiDialogPopup, 'generate');
            $generateButton.trigger('dxclick');

            this.reject('Error');

            setTimeout(() => {
                const $generateButton = findButtonByName(this.aiDialogPopup, 'generate');
                const resultTextAreaInstance = getResultTextAreaInstance(this.$element);
                const promptTextAreaInstance = getPromptTextAreaInstance(this.$element);

                assert.ok($generateButton.length, 'generate button is visible');
                assert.strictEqual(resultTextAreaInstance.option('disabled'), true);
                assert.strictEqual(resultTextAreaInstance.option('readOnly'), false);
                assert.strictEqual(resultTextAreaInstance.option('visible'), false);
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
                'dxHtmlEditor-aiStop': 'custom stop',
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

        QUnit.test('should be correct for stop button', function(assert) {
            showAIDialog(this, {
                config: { currentCommand: 'translate' },
            });

            const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);
            const stopToolbarItem = getItemByName(bottomToolbarItems, 'stop');
            const stopButtonOptions = stopToolbarItem.options;

            assertConfig(assert, stopToolbarItem, {
                toolbar: 'bottom',
                location: 'after',
                widget: 'dxButton'
            });
            assertConfig(assert, stopButtonOptions, {
                stylingMode: 'contained',
                type: 'default',
                width: ACTION_BUTTON_WIDTH,
            });
            assert.strictEqual(stopButtonOptions.text, this.dictionary['dxHtmlEditor-aiStop'], 'text is localized');
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

        QUnit.test('should be correct for try again button', function(assert) {
            const done = assert.async();

            showAIDialog(this, {
                config: { currentCommand: 'translate' },
            });

            this.resolve();

            this.promise.then(() => {
                const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);
                const tryAgainToolbarItem = getItemByName(bottomToolbarItems, 'tryAgain');
                const tryAgainButtonOptions = tryAgainToolbarItem.options;

                assertConfig(assert, tryAgainToolbarItem, {
                    toolbar: 'bottom',
                    location: 'before',
                    widget: 'dxButton',
                });
                assertConfig(assert, tryAgainButtonOptions, {
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
        QUnit.test('result textArea  config is correct', function(assert) {
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

        QUnit.test('tryAgain button text is shown and localized', function(assert) {
            const localizedTryAgainText = 'custom copy';
            const initialLocale = localization.locale();
            localization.loadMessages({
                'ja': {
                    'dxHtmlEditor-aiTryAgain': localizedTryAgainText,
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
                const tryAgainToolbarItem = getItemByName(bottomToolbarItems, 'tryAgain');
                const tryAgainButtonOptions = tryAgainToolbarItem.options;

                assert.strictEqual(tryAgainButtonOptions.text, localizedTryAgainText, 'text is localized');

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

                QUnit.test('tryAgain button text is not shown', function(assert) {
                    const done = assert.async();

                    showAIDialog(this, {
                        config: { currentCommand: 'translate' },
                    });

                    this.resolve();

                    this.promise.then(() => {
                        const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);
                        const copyToolbarItem = getItemByName(bottomToolbarItems, 'tryAgain');
                        const copyButtonOptions = copyToolbarItem.options;

                        assert.strictEqual(copyButtonOptions.text, undefined, 'text is not passed');
                        assert.strictEqual(copyButtonOptions.icon, 'restore', 'icon is passed');

                        done();
                    });
                });
            });
        });
    });
});

QUnit.module('compact', {
    beforeEach: function() {
        this.isCompactStub = sinon.stub(themes, 'isCompact').returns(true);

        integrationModuleConfig.beforeEach.apply(this);
    },
    afterEach: function() {
        integrationModuleConfig.afterEach.apply(this);
        this.isCompactStub.restore();
    }
}, () => {
    QUnit.test('generate button should have special width', function(assert) {
        showAIDialog(this, {
            config: { currentCommand: 'askAI' },
        });

        const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);
        const generateToolbarItem = getItemByName(bottomToolbarItems, 'generate');
        const generateButtonOptions = generateToolbarItem.options;

        assert.strictEqual(generateButtonOptions.width, COMPACT_ACTION_BUTTON_WIDTH, 'width=100px');
    });

    QUnit.test('stop button should have special width', function(assert) {
        showAIDialog(this, {
            config: { currentCommand: 'translate' },
        });

        const bottomToolbarItems = getBottomToolbarItems(this.aiDialogPopup);
        const stopToolbarItem = getItemByName(bottomToolbarItems, 'stop');
        const stopButtonOptions = stopToolbarItem.options;

        assert.strictEqual(stopButtonOptions.width, COMPACT_ACTION_BUTTON_WIDTH, 'width=100px');
    });
});
