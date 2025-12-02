import $ from 'jquery';

import 'ui/html_editor';
import {
    openAIDialog,
    openAIToolbarMenu,
    getMenuItems,
    defaultAICommands,
    defaultAIOptions
} from '../../../helpers/aiToolbarMenu.js';
import {
    clickActionButton,
    setResultText,
    getResultTextAreaValue,
} from '../../../helpers/aiDialog.js';
import { AI_DIALOG_CLASS } from '__internal/ui/html_editor/ui/aiDialog';
import { POPUP_TITLE_CLOSEBUTTON_CLASS } from '__internal/ui/popup/m_popup';
import { DX_MENU_ITEM_CLASS } from '__internal/ui/menu/menu';
import uiErrors from 'ui/widget/ui.errors';
import keyboardMock from '../../../helpers/keyboardMock.js';

const MENU_ITEM_CLASS = 'dx-menu-item';
const MENU_CLASS = 'dx-menu';
const DISABLED_STATE_CLASS = 'dx-state-disabled';

const setupHtmlEditorWithAi = (config) => {
    return $('#htmlEditor').dxHtmlEditor({
        value: 'Test value',
        aiIntegration: {},
        toolbar: {
            items: [{
                name: 'ai',
                commands: ['summarize'],
            }],
        },
        ...config
    }).dxHtmlEditor('instance');
};

const getAIDialog = (htmlEditor) => {
    return htmlEditor._aiDialog;
};

const getAIDialogElement = ($htmlEditor) => {
    return $htmlEditor.find(`.${AI_DIALOG_CLASS}`);
};

const getPopup = (htmlEditor) => {
    return getAIDialog(htmlEditor)._popup;
};

const getOverlayContentElement = (htmlEditor) => {
    return $(getPopup(htmlEditor).content()).parent();
};

const getCloseButtonElement = (htmlEditor) => {
    return getOverlayContentElement(htmlEditor).find(`.${POPUP_TITLE_CLOSEBUTTON_CLASS}`);
};

QUnit.module('AI dialog integration', () => {
    QUnit.module('toolbar', () => {
        QUnit.test('Should pass correct payload to dialog on item click', function(assert) {
            const instance = setupHtmlEditorWithAi();

            const showSpy = sinon.spy(instance, 'showAIDialog');

            openAIDialog($('#htmlEditor'));

            assert.ok(showSpy.calledOnce, 'showAIDialog called');
            assert.deepEqual(showSpy.firstCall.args[0], {
                currentCommand: 'summarize',
                currentCommandOption: undefined,
                text: 'Test value\n',
                prompt: undefined,
                commandsMap: {
                    summarize: {
                        id: 'summarize',
                        name: 'summarize',
                        options: undefined,
                        text: 'Summarize',
                    },
                },
            }, 'Correct config passed to dialog');
        });

        QUnit.test('Should pass correct payload to dialog on item click if there is custom command', function(assert) {
            const prompt = {};
            const instance = setupHtmlEditorWithAi({ toolbar: { items: [{ name: 'ai', commands: [{ name: 'custom', prompt }] }] } });
            const showSpy = sinon.spy(instance, 'showAIDialog');

            openAIDialog($('#htmlEditor'));

            assert.ok(showSpy.calledOnce, 'showAIDialog called');
            assert.deepEqual(showSpy.firstCall.args[0], {
                currentCommand: 'custom0',
                currentCommandOption: undefined,
                text: 'Test value\n',
                prompt,
                commandsMap: {
                    custom0: {
                        id: 'custom0',
                        name: 'custom',
                        options: undefined,
                        text: 'Custom',
                        prompt,
                    },
                },
            }, 'Correct config passed to dialog');
        });

        QUnit.test('Should pass correct payload to dialog on item click if there is custom command with options', function(assert) {
            const prompt = (param) => `custom prompt with ${param}`;
            const instance = setupHtmlEditorWithAi({ toolbar: { items: [
                {
                    name: 'ai',
                    commands: [
                        {
                            name: 'custom',
                            options: ['option 1'],
                            prompt,
                        },
                    ],
                },
            ] } });
            const showSpy = sinon.spy(instance, 'showAIDialog');

            openAIDialog($('#htmlEditor'));

            assert.ok(showSpy.calledOnce, 'showAIDialog called');
            assert.deepEqual(showSpy.firstCall.args[0], {
                currentCommand: 'custom0',
                currentCommandOption: 'Option 1',
                text: 'Test value\n',
                prompt,
                commandsMap: {
                    custom0: {
                        id: 'custom0',
                        name: 'custom',
                        options: ['Option 1'],
                        text: 'Custom',
                        prompt,
                    },
                },
            }, 'Correct config passed to dialog');
        });

        QUnit.test('showAIDialog is not called on root menu item click (with submenu)', function(assert) {
            const instance = setupHtmlEditorWithAi();
            const showSpy = sinon.spy(instance, 'showAIDialog');

            openAIToolbarMenu($('#htmlEditor'));

            const $rootItem = $(`.${MENU_CLASS} .${MENU_ITEM_CLASS}`).eq(0);
            $rootItem.trigger('dxclick');

            assert.strictEqual(showSpy.callCount, 0, 'showAIDialog is not called on root item click');
        });

        ['ai', { name: 'ai' }].forEach(item => {
            const itemType = typeof item === 'object' ? 'object' : 'string';

            QUnit.test(`default commands, default options, AI item is passed as ${itemType}`, function(assert) {
                setupHtmlEditorWithAi({ toolbar: { items: [item] } });
                const menuItems = getMenuItems($('#htmlEditor'));
                const commandNames = menuItems.map(command => command.id);

                assert.deepEqual(commandNames, defaultAICommands, 'commands match default list');

                Object.entries(defaultAIOptions).forEach(([commandName, defaultOptions]) => {
                    const command = menuItems.find((command) => command.id === commandName);
                    const options = command.items.map((option) => option.id);
                    assert.deepEqual(options, defaultOptions, `Options for "${commandName}" match defaults`);
                });
            });
        });

        QUnit.test('should pass specific commands, default options to menu', function(assert) {
            setupHtmlEditorWithAi({ toolbar: { items: [{ name: 'ai', commands: ['translate', 'changeStyle', 'changeTone'] }] } });

            const menuItems = getMenuItems($('#htmlEditor'));
            const commandNames = menuItems.map(command => command.id);

            assert.strictEqual(menuItems.length, 3, 'only specified commands rendered');
            assert.deepEqual(commandNames, ['translate', 'changeStyle', 'changeTone'], 'commands match specified list');

            Object.entries(defaultAIOptions).forEach(([commandName, defaultOptions]) => {
                const command = menuItems.find((command) => command.id === commandName);
                const actualOptions = command.items.map((option) => option.id);
                assert.deepEqual(actualOptions, defaultOptions, `Options for "${commandName}" match defaults`);
            });
        });

        QUnit.test('should pass specific commands, specific options to menu', function(assert) {
            const commandOptions = ['English', 'Spanish'];
            setupHtmlEditorWithAi({ toolbar: { items: [{ name: 'ai', commands: [{ name: 'translate', options: commandOptions }] }] } });

            const menuItems = getMenuItems($('#htmlEditor'));
            const commandNames = menuItems.map(command => command.id);

            const translateCommand = menuItems.find(command => command.id === 'translate');
            const translateOptions = translateCommand.items.map(option => option.id);

            assert.deepEqual(commandNames, ['translate'], 'commands match specified list');
            assert.deepEqual(translateOptions, commandOptions, 'only specified options rendered');
        });

        QUnit.test('should pass empty commands to menu if commands are empty', function(assert) {
            setupHtmlEditorWithAi({ toolbar: { items: [{ name: 'ai', commands: [] }] } });

            const menuItems = getMenuItems($('#htmlEditor'));
            const commandNames = menuItems.map(command => command.id);

            assert.deepEqual(commandNames, [], 'empty commands list in menu');
        });

        QUnit.test('should pass empty command options to menu if options are empty', function(assert) {
            setupHtmlEditorWithAi({ toolbar: { items: [{ name: 'ai', commands: [{ name: 'translate', options: [] }] }] } });

            const menuItems = getMenuItems($('#htmlEditor'));

            const translateCommand = menuItems.find(command => command.id === 'translate');
            const translateOptions = translateCommand.items.map(option => option.id);

            assert.deepEqual(translateOptions, [], 'empty command options in menu');
        });

        QUnit.test('should render specified command text', function(assert) {
            setupHtmlEditorWithAi({ toolbar: { items: [{ name: 'ai', commands: [{ name: 'summarize', text: 'Summarize name' }] }] } });

            openAIToolbarMenu($('#htmlEditor'));

            const $menuItem = $(`.${MENU_ITEM_CLASS}`).last();
            assert.strictEqual($menuItem.text(), 'Summarize name', 'custom command text rendered in menu');
        });

        QUnit.test('should render custom command in menu', function(assert) {
            setupHtmlEditorWithAi({ toolbar: { items: [{
                name: 'ai',
                commands: [{
                    name: 'custom',
                    text: 'Custom command',
                    prompt: () => {}
                }]
            }] } });

            openAIToolbarMenu($('#htmlEditor'));

            const $menuItem = $(`.${MENU_ITEM_CLASS}`).last();
            assert.strictEqual($menuItem.text(), 'Custom command', 'custom command rendered in menu');
        });

        QUnit.test('should disable custom command menu item if no prompt is specified', function(assert) {
            setupHtmlEditorWithAi({ toolbar: { items: [{
                name: 'ai',
                commands: [{
                    name: 'custom',
                    text: 'Custom command',
                }]
            }] } });

            openAIToolbarMenu($('#htmlEditor'));

            const $menuItem = $(`.${MENU_ITEM_CLASS}`).last();

            assert.strictEqual($menuItem.hasClass(DISABLED_STATE_CLASS), true, 'custom command is disabled');
        });

        QUnit.test('root menu item is disabled if commands list is empty', function(assert) {
            setupHtmlEditorWithAi({ toolbar: { items: [{ name: 'ai', commands: [] }] } });
            openAIToolbarMenu($('#htmlEditor'));

            const menuInstance = $(`.${MENU_CLASS}`).dxMenu('instance');

            assert.strictEqual(menuInstance.option('disabled'), true, 'menu is disabled');
        });
    });

    QUnit.module('render', () => {
        ['ai', { name: 'ai' }].forEach(aiToolbarItem => {
            QUnit.test(`should be rendered if aiIntegration and ai toolbar item (as ${typeof aiToolbarItem}) are passed`, function(assert) {
                const $element = $('#htmlEditor').dxHtmlEditor({
                    aiIntegration: {},
                    toolbar: { items: [ aiToolbarItem ] },
                });
                const $dialog = getAIDialogElement($element);

                assert.strictEqual($dialog.length, 1, 'dialog is rendered');
            });

            QUnit.test('should not be rendered if aiIntegration is not passed and ai toolbar item is passed', function(assert) {
                const $element = $('#htmlEditor').dxHtmlEditor({
                    toolbar: { items: [ aiToolbarItem ] },
                });
                const $dialog = getAIDialogElement($element);

                assert.strictEqual($dialog.length, 0, 'dialog is not rendered');
            });

            QUnit.test('should not be rendered if ai toolbar item is not passed and aiIntegration is passed', function(assert) {
                const $element = $('#htmlEditor').dxHtmlEditor({
                    aiIntegration: {},
                });
                const $dialog = getAIDialogElement($element);

                assert.strictEqual($dialog.length, 0, 'dialog is not rendered');
            });
        });
    });

    QUnit.module('aiIntegration option', () => {
        QUnit.test('process update if ai dailog was rendered before', function(assert) {
            const htmlEditor = setupHtmlEditorWithAi({});
            const dialog = getAIDialog(htmlEditor);
            const $dialog = getAIDialogElement(htmlEditor.$element());
            const updateAIIntegrationSpy = sinon.spy(dialog, 'updateAIIntegration');

            assert.strictEqual(updateAIIntegrationSpy.callCount, 0);
            assert.strictEqual($dialog.length, 1, 'dialog is rendered');

            htmlEditor.option({ aiIntegration: {} });

            assert.strictEqual(updateAIIntegrationSpy.callCount, 1, 'updateAIIntegration is called once');
        });

        QUnit.test('process update if ai dailog was not rendered before', function(assert) {
            const htmlEditor = setupHtmlEditorWithAi({ aiIntegration: null });
            let $dialog = getAIDialogElement(htmlEditor.$element());

            assert.strictEqual($dialog.length, 0, 'dialog is not rendered');

            htmlEditor.option({ aiIntegration: {} });

            $dialog = getAIDialogElement(htmlEditor.$element());

            assert.strictEqual($dialog.length, 1, 'dialog is rendered');
        });

        QUnit.module('runtime update', () => {
            QUnit.test('update aiIntegration cancels active request and resets dialog state', function(assert) {
                const abortSpy = sinon.spy();
                const summarizeSpy1 = sinon.stub().returns(abortSpy);
                const summarizeSpy2 = sinon.stub().returns(() => {});
                const initialAIIntegration = { summarize: summarizeSpy1 };
                const newAIIntegration = { summarize: summarizeSpy2 };
                const htmlEditor = setupHtmlEditorWithAi({ aiIntegration: initialAIIntegration });

                openAIDialog($('#htmlEditor'));

                assert.ok(summarizeSpy1.calledOnce, 'initial summarize called');

                htmlEditor.option({ aiIntegration: newAIIntegration });

                assert.ok(abortSpy.calledOnce, 'previous request aborted');
                assert.ok(summarizeSpy1.calledOnce, 'initial summarize is not called again');
                assert.ok(summarizeSpy2.calledOnce, 'new summarize invoked after update');
            });
        });

        QUnit.module('aiIntegration absence', () => {
            QUnit.test('showAIDialog should return undefined when aiIntegration is omitted', function(assert) {
                const htmlEditor = setupHtmlEditorWithAi({ aiIntegration: null });
                const result = htmlEditor.showAIDialog({
                    currentCommand: 'summarize',
                    currentCommandOption: undefined,
                    text: '',
                    commandsMap: {},
                });

                assert.strictEqual(result, undefined, 'showAIDialog returns undefined');
            });
        });
    });

    QUnit.module('action buttons', () => {
        QUnit.test('replace without selected text should replace all text', function(assert) {
            const done = assert.async();

            setupHtmlEditorWithAi({
                value: 'Old value',
                onValueChanged: ({ value }) => {
                    assert.strictEqual(value, '<p>New value</p>', 'all text is replaced');
                    done();
                },
            });

            openAIDialog($('#htmlEditor'));
            setResultText('New value');
            clickActionButton('replace');
        });

        QUnit.test('replace should replace selected text', function(assert) {
            const done = assert.async();

            const htmlEditor = setupHtmlEditorWithAi({
                value: 'Test value',
                onValueChanged: ({ value }) => {
                    assert.strictEqual(value, '<p>Inserted value value</p>', 'selected text replaced');
                    done();
                },
            });

            htmlEditor.setSelection(0, 4);

            openAIDialog(($('#htmlEditor')));
            setResultText('Inserted value');
            clickActionButton('replace');
        });

        QUnit.test('insertAbove button click should insert text from result textArea above the selected text', function(assert) {
            const done = assert.async();

            setupHtmlEditorWithAi({
                onValueChanged: ({ value }) => {
                    assert.strictEqual(value, '<p>Inserted value</p><p>Test value</p>', 'inserted above');
                    done();
                },
            });

            openAIDialog($('#htmlEditor'));
            setResultText('Inserted value');
            clickActionButton('insertAbove');
        });

        QUnit.test('insertBelow button click should insert text from result textArea below the selected text', function(assert) {
            const done = assert.async();

            setupHtmlEditorWithAi({
                onValueChanged: ({ value }) => {
                    assert.strictEqual(value, '<p>Test value</p><p>Inserted value</p>', 'inserted below');
                    done();
                },
            });

            openAIDialog($('#htmlEditor'));
            setResultText('Inserted value');
            clickActionButton('insertBelow');
        });
    });

    QUnit.module('TextArea', () => {
        QUnit.test('should not have any text inside it if nothing is selected', function(assert) {
            setupHtmlEditorWithAi();

            const resultText = getResultTextAreaValue();

            assert.strictEqual(resultText, '', 'textarea does not contain text');
        });

        QUnit.test('should not have any text inside it if part of the text is selected', function(assert) {
            const instance = setupHtmlEditorWithAi();

            instance.setSelection(0, 4);

            const resultText = getResultTextAreaValue();

            assert.strictEqual(resultText, '', 'textarea does not contain text');
        });
    });

    QUnit.module('onValueChanged', () => {
        QUnit.test('should receive correct event parameter if value is updated after action button click', function(assert) {
            const done = assert.async();

            setupHtmlEditorWithAi({
                onValueChanged: ({ event }) => {
                    const clickedText = $(event.target).text();

                    assert.strictEqual(event.type, 'dxclick', 'called with correct event type');
                    assert.strictEqual(clickedText, 'Replace', 'called on correct element');
                    done();
                },
            });

            openAIDialog($('#htmlEditor'));
            setResultText('Inserted value');
            clickActionButton('replace');
        });
    });

    QUnit.module('Warnings', {
        beforeEach: function() {
            sinon.spy(uiErrors, 'log');

        },
        afterEach: function() {
            uiErrors.log.restore();
        }
    }, () => {
        ['ai', { name: 'ai' }].forEach(aiToolbarItem => {
            QUnit.test(`W1026 warning should be logged if if aiIntegration is not passed but ai toolbar item is passed as ${typeof aiToolbarItem}`, function(assert) {
                setupHtmlEditorWithAi({
                    toolbar: {
                        items: [aiToolbarItem],
                    },
                    aiIntegration: null,
                });

                assert.deepEqual(uiErrors.log.lastCall.args, ['W1026'], 'logged with correct args');
            });
        });

        QUnit.test('W1027 warning should be logged if prompt is not specified for a custom command', function(assert) {
            setupHtmlEditorWithAi({ toolbar: { items: [{
                name: 'ai',
                commands: [{
                    name: 'custom',
                    text: 'Custom command',
                }]
            }] } });

            assert.deepEqual(uiErrors.log.lastCall.args, ['W1027'], 'logged with correct args');
        });
    });

    QUnit.module('Accessibility', () => {
        QUnit.test('menu item should have correct aria-label', function(assert) {
            const instance = setupHtmlEditorWithAi();
            const $menuItem = instance.$element().find(`.${DX_MENU_ITEM_CLASS}`).first();

            assert.strictEqual($menuItem.attr('aria-label'), 'AI Assistant toolbar item', 'menu item has correct aria-label');
        });
    });

    QUnit.module('command execution abort on hiding', {
        beforeEach() {
            this.abortSpy = sinon.spy();
            this.commandSpy = sinon.stub().returns(this.abortSpy);
            const aiIntegration = { summarize: this.commandSpy };
            this.htmlEditor = setupHtmlEditorWithAi({ aiIntegration });
        },
        afterEach() {
            sinon.restore();
        },
    }, () => {
        [
            {
                name: 'click outside',
                action() { $(document).trigger('dxpointerdown'); },
            },
            {
                name: 'click on the close button',
                action() { getCloseButtonElement(this.htmlEditor).trigger('dxclick'); },
            },
            {
                name: 'esc keydown',
                action() { keyboardMock(getOverlayContentElement(this.htmlEditor)).press('escape'); },
            },
        ].forEach(({ name, action }) => {
            QUnit.test(`should abort on ${name}`, function(assert) {
                openAIDialog($(this.htmlEditor.$element()));

                assert.ok(this.commandSpy.calledOnce, 'command execution is started');

                action.call(this);

                assert.ok(this.abortSpy.calledOnce, 'abort function is called once');
            });
        });
    });
});
